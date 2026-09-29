const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const registry = JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e',
  'puts JSON.generate(YAML.load_file("_data/side_projects.yml"))'], { encoding: 'utf8' }));
const projects = registry.filter(p => p.placement === 'project');
const collections = registry.filter(p => p.placement === 'library');
assert.equal(registry.length, 17);
assert.equal(projects.length, 15);
assert.deepEqual(collections.map(p => p.id), ['project-web-apps', 'react-project-apps']);
assert.equal(new Set(registry.map(p => p.id)).size, registry.length);
for (const project of registry) {
  assert.match(project.id, /^[a-z][a-z0-9-]+$/);
  assert.ok(['open-enquiry', 'reference', 'earlier-collection'].includes(project.role));
  assert.ok(['project', 'library'].includes(project.placement));
  assert.equal(new URL(project.source_url).host, 'github.com');
}
assert.equal(projects.find(p => p.title === "Project Co-design").path, "https://lawrencerowland.github.io/project-co-design/");
assert.equal(new Set(registry.map(project => project.path)).size, registry.length);
assert.equal(projects.find(p => p.title === "Shared waters: open systems").path, "https://lawrencerowland.github.io/shared-dynamics/");
for (const project of registry) {
  for (const field of ['title', 'question', 'description', 'path', 'action']) {
    assert.ok(project[field], `${project.title}: missing ${field}`);
  }
  assert.ok(['gimmer', 'featured', 'library', 'other'].includes(project.group));
  assert.ok(Array.isArray(project.tags) && project.tags.length);
  for (const link of [project, ...(project.related || [])]) {
    assert.equal(new URL(link.path).origin, 'https://lawrencerowland.github.io');
  }
}
assert.equal(projects.find(p => p.title === 'Functors for Projects').path,
  'https://lawrencerowland.github.io/functors-for_projects/app-index.html');
assert.match(projects.find(p => p.title === 'Project Spines').description, /Six tabs/);
assert.ok(projects.every(p => p.title !== 'CSV to Gantt'), 'removed CSV-to-Gantt card is absent');
assert.ok(projects.every(p => !p.path.includes('/csv-to-gantt/')), 'removed CSV-to-Gantt route is absent');

const questions = JSON.parse(execFileSync('ruby', ['-ryaml','-rjson','-e',
  'puts JSON.generate(YAML.load_file("_data/project_questions.yml"))'], {encoding:'utf8'}));
assert.equal(questions.length, 3);
assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
for (const q of questions) {
  for (const field of ['id','question','project_label','path','try_this','limitation','source_url']) assert.ok(q[field], `question route ${q.id}: ${field}`);
  const route = new URL(q.path);
  assert.equal(route.origin, 'https://lawrencerowland.github.io');
  assert.ok(route.hash, 'guided route reaches its first interaction');
  assert.match(q.source_url, /^https:\/\/github.com\/lawrencerowland\/[^/]+\/blob\/[0-9a-f]{40}\//, 'question route has a pinned source');
}

const cards = projects.map(project => ({ dataset: { tags: project.tags.join(',') }, hidden: false }));
const listeners = {};
const elements = {
  'foray-directory': { querySelectorAll: selector => selector === '.foray-card' ? cards : [] },
  'foray-filter': { hidden: true },
  'foray-topic': { value: 'all', addEventListener: (event, handler) => { listeners[event] = handler; } },
  'foray-count': { textContent: '' },
  'foray-empty': { hidden: true }
};
const script = fs.readFileSync('assets/forays.js', 'utf8');
const windowEvents = {};
const window = {
  addEventListener: (event, handler) => { windowEvents[event] = handler; },
  setTimeout: handler => handler()
};
const run = () => vm.runInNewContext(script, { document: { getElementById: id => elements[id] }, window });
run();
assert.equal(elements['foray-filter'].hidden, false);
assert.equal(elements['foray-count'].textContent, `${projects.length} of ${projects.length} projects shown`);
assert.equal(elements['foray-empty'].hidden, true);
for (const topic of new Set(projects.flatMap(p => p.tags))) {
  elements['foray-topic'].value = topic;
  listeners.change();
  cards.forEach((card, index) => assert.equal(card.hidden, !projects[index].tags.includes(topic)));
  assert.equal(elements['foray-count'].textContent, `${projects.filter(project => project.tags.includes(topic)).length} of ${projects.length} projects shown`);
  assert.equal(elements['foray-empty'].hidden, true);
}
elements['foray-topic'].value = 'no-match';
listeners.change();
assert.ok(cards.every(card => card.hidden));
assert.equal(elements['foray-empty'].hidden, false);
assert.equal(elements['foray-count'].textContent, `0 of ${projects.length} projects shown`);
elements['foray-topic'].value = 'all';
listeners.change();
assert.ok(cards.every(card => !card.hidden));
assert.equal(elements['foray-empty'].hidden, true);
elements['foray-topic'].value = 'schedule';
run();
assert.equal(elements['foray-topic'].value, 'all', 'reload restores the complete directory');
elements['foray-topic'].value = 'category-theory';
windowEvents.pageshow();
assert.equal(elements['foray-topic'].value, 'all', 'history restoration cannot leave a stale selector');
assert.ok(cards.every(card => !card.hidden));
assert.equal(elements['foray-empty'].hidden, true);
assert.equal(elements['foray-count'].textContent, `${projects.length} of ${projects.length} projects shown`);
vm.runInNewContext(script, { document: { getElementById: () => null } });

if (process.argv[2]) {
  const html = fs.readFileSync(process.argv[2], 'utf8');
  assert.equal((html.match(/class="example-card foray-card"/g) || []).length, projects.length);
  assert.equal((html.match(/class="foray-grid"/g) || []).length, 1);
  assert.equal((html.match(/class="foray-group"/g) || []).length, 1);
  assert.equal((html.match(/class="foray-empty"/g) || []).length, 1);
  assert.match(html, /<h1>Projects<\/h1>/);
  assert.ok(!/Gimmer experiment suites|Featured projects|Playgrounds &amp; libraries|Other side projects/.test(html));
  const escapeHTML = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  for (const q of questions) {
    for (const field of ['question','project_label','path','try_this','limitation','source_url']) assert.ok(html.includes(escapeHTML(q[field])), `rendered question ${q.id}: ${field}`);
    assert.ok(html.includes(`id="question-${q.id}"`));
  }
  assert.match(html, /<details class="foray-question-routes"/);
  const renderedCards = [...html.matchAll(/<article class="example-card foray-card"[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(renderedCards.length, projects.length);
  assert.ok(html.includes('href="/library.html#earlier-app-collections"'), 'retained collections remain signposted');
  for (const collection of collections) assert.ok(!renderedCards.some(card => card.includes(collection.path)), 'generic collections move out of the project grid');
  assert.ok(!html.includes('{%') && !html.includes('{{'), 'Liquid rendered completely');
  assert.ok(!html.includes('https://lawrencerowland.github.io/csv-to-gantt/'), 'removed route is absent from the rendered directory');
  for (const [index, project] of projects.entries()) {
    const card = renderedCards[index];
    assert.ok(card.includes(`id="${project.id}"`), `stable entry anchor: ${project.id}`);
    assert.ok(card.includes(`href="${escapeHTML(project.path)}"`), `missing rendered link: ${project.title}`);
    assert.ok(card.includes(`src="${escapeHTML(project.image)}"`), `missing image: ${project.title}`);
    for (const field of ['title', 'scenario', 'question', 'description', 'action']) {
      assert.ok(card.includes(escapeHTML(project[field])), `missing ${field}: ${project.title}`);
    }
    assert.ok(card.includes('<summary>About this project</summary>'), `missing disclosure: ${project.title}`);
    if (project.origin) assert.ok(card.includes(escapeHTML(project.origin)), `missing origin: ${project.title}`);
    for (const link of project.related || []) {
      assert.ok(card.includes(`href="${escapeHTML(link.path)}"`), `missing related route: ${project.title}`);
      assert.ok(card.includes(escapeHTML(link.title)), `missing related title: ${project.title}`);
    }
  }
  for (const id of ['gimmer-projects', 'featured-forays', 'playgrounds', 'other-projects']) {
    assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1, `preserve one target for #${id}`);
  }
  const intro = html.match(/<header class="foray-intro"[\s\S]*?<\/header>/)[0];
  assert.ok(!intro.includes('all-project-apps.html'), 'generic catalogue is not an opening shortcut');
  assert.ok(html.indexOf('id="compare-approaches"') > html.lastIndexOf('</article>'), 'comparison follows the gallery');
  assert.ok(html.includes('href="/gpt-links-page.html"'));
  // This utility is deliberately discoverable through the generic app catalogues.
  assert.ok(!html.includes('project_innovation_app'), 'Do not promote the Idea notebook on Projects');
  assert.ok(html.includes('href="/all-project-apps.html"'));
  const expectedTags = [...new Set(projects.flatMap(p => p.tags))].sort();
  const topicOptions = [...html.matchAll(/<option value="([^"]+)"/g)].map(m => m[1]).filter(x => x !== 'all');
  assert.deepEqual(topicOptions, expectedTags, 'filter offers only topics with a displayed project');
  if (process.argv[3]) {
    const library = fs.readFileSync(process.argv[3], 'utf8');
    const keptCards = [...library.matchAll(/<article class="example-card foray-card"[\s\S]*?<\/article>/g)].map(m => m[0]);
    assert.equal(keptCards.length, collections.length);
    for (const [i, project] of collections.entries()) {
      const card = keptCards[i];
      for (const field of ['title','scenario','question','description','action','path','image']) {
        assert.ok(card.includes(escapeHTML(project[field])), `preserve collection ${field}: ${project.title}`);
      }
      assert.ok(card.includes(`id="${project.id}"`));
    }
    assert.match(library, /id="earlier-app-collections"/);
  }
  assert.match(html, /src="\/assets\/forays\.js\?v=\d+"/);
  assert.ok(html.includes('id="foray-topic" autocomplete="off"'));
}
console.log(`PASS: ${projects.length} project cards, 2 retained collection records, one gallery, all topic filters, empty state, reset and optional rendered-page preservation checks.`);

assert.deepEqual(projects.filter(p => p.group === 'gimmer').map(p => p.path), [
  'https://lawrencerowland.github.io/gimmer-crag/petri-smc-wbs.html',
  'https://lawrencerowland.github.io/gimmer-crag-project-mountain-refuge/',
  'https://lawrencerowland.github.io/gimmer-crag/app-index.html'
]);
