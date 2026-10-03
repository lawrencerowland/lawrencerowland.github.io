const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const registry = JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e',
  'puts JSON.generate(YAML.load_file("_data/side_projects.yml"))'], { encoding: 'utf8' }));
const projects = registry.filter(p => p.placement === 'project').sort((a, b) => a.gallery_order - b.gallery_order);
const directorySource = fs.readFileSync('side-projects.md', 'utf8');
const directoryTitle = /<h1\b[^>]*>Experiments<\/h1>/;
const directoryIntro = /<header\b[^>]*class="[^"]*\bforay-intro\b[^"]*"[^>]*>[\s\S]*?<\/header>/;
assert.match(directorySource, directoryTitle, 'the directory has the concise Experiments title');
assert.match(directorySource, directoryIntro, 'the directory introduction remains identifiable with additional styling classes');
for (const phrase of ['My Custom GPTs', 'These are exploratory tools and toy models', 'The two original general app collections', 'For individual tools from the two general app libraries']) {
  assert.ok(!directorySource.includes(phrase), 'the retired directory tail is absent: ' + phrase);
}
assert.ok(!directorySource.includes('class="foray-note"'), 'the directory ends without the former three notes');
assert.ok(projects.every(p => Number.isInteger(p.gallery_order) && p.gallery_order > 0), 'each gallery entry has an explicit display order');
assert.equal(new Set(projects.map(p => p.gallery_order)).size, projects.length, 'display order is unambiguous');
assert.equal(projects.slice(0, 3).filter(p => p.group === 'gimmer').length, 1, 'the first row introduces other scenarios alongside Gimmer');
for (const p of projects.filter(p => p.group === 'gimmer')) {
  assert.ok(p.entry_question && p.entry_purpose, `${p.id}: show the distinct purpose before disclosure`);
}
assert.equal(new Set(projects.filter(p => p.group === 'gimmer').map(p => p.tile_image || p.image)).size, 3, 'the three Gimmer entrances have distinct pictures');
for (const p of projects.filter(p => p.tile_image)) {
  assert.ok(p.tile_image.startsWith('/images/scenarios/'));
  assert.ok(fs.existsSync(p.tile_image.slice(1)), `${p.id}: local illustration exists`);
}
const collections = registry.filter(p => p.placement === 'library');
assert.equal(registry.length, 19);
assert.equal(projects.length, 19);
assert.deepEqual(collections.map(p => p.id), []);
assert.equal(new Set(registry.map(p => p.id)).size, registry.length);
const bracken=projects.find(p=>p.id==='bracken-vale');
assert.ok(bracken,'published Bracken Vale has an Experiments entrance');
assert.equal(bracken.path,'https://lawrencerowland.github.io/bracken-vale/');
assert.equal(bracken.role,'open-enquiry');
assert.ok(bracken.scenario&&bracken.entry_question&&bracken.entry_purpose&&bracken.image_alt);
assert.ok(!collections.some(p=>p.id==='bracken-vale'),'one enquiry home');
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
    assert.equal(new URL(link.path, 'https://lawrencerowland.github.io').origin, 'https://lawrencerowland.github.io');
  }
}
assert.equal(projects.find(p => p.title === 'Functors for Projects').path,
  'https://lawrencerowland.github.io/functors-for_projects/');
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
  assert.equal((html.match(/class="pw-picture-card foray-card"/g) || []).length, projects.length);
  assert.equal((html.match(/class="pw-picture-grid"/g) || []).length, 1);
  assert.equal((html.match(/class="foray-group"/g) || []).length, 1);
  assert.equal((html.match(/class="foray-empty"/g) || []).length, 1);
  assert.match(html, directoryTitle);
  assert.ok(!/Gimmer experiment suites|Featured projects|Playgrounds &amp; libraries|Other side projects/.test(html));
  const escapeHTML = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  assert.ok(!html.includes('start-with-a-question'), 'retired question dropdown is absent');
  assert.ok(!html.includes('foray-browse-tools'), 'topic filter is directly available');
  const renderedCards = [...html.matchAll(/<article class="pw-picture-card foray-card"[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(renderedCards.length, projects.length);
  assert.ok(!html.includes('href="/library.html#earlier-app-collections"'), 'collections use their single Library home');
  for (const collection of collections) assert.ok(!renderedCards.some(card => card.includes(collection.path)), 'generic collections move out of the project grid');
  assert.ok(!html.includes('{%') && !html.includes('{{'), 'Liquid rendered completely');
  assert.ok(!html.includes('https://lawrencerowland.github.io/csv-to-gantt/'), 'removed route is absent from the rendered directory');
  for (const [index, project] of projects.entries()) {
    const card = renderedCards[index];
    assert.ok(card.includes(`id="${project.id}"`), `stable entry anchor: ${project.id}`);
    assert.ok(card.includes(`href="${escapeHTML(project.path)}"`), `missing rendered link: ${project.title}`);
    const tile = JSON.parse(fs.readFileSync('_data/experiment_tiles.json', 'utf8'))[project.id];
    assert.ok(card.includes(`src="${tile.image}"`), `enquiry emblem: ${project.title}`);
    assert.ok(card.includes(escapeHTML(tile.title)), `tile title: ${project.id}`);
    assert.ok(card.includes(escapeHTML(tile.description)), `short question: ${project.id}`);
    assert.ok(card.includes(`aria-describedby="${project.id}-description"`), `accessible one-line descriptor: ${project.id}`);
    const notes = html.match(new RegExp(`<section id="notes-${project.id}">[\\s\\S]*?<\\/section>`))?.[0];
    assert.ok(notes, 'preserved project notes: ' + project.id);
    for (const field of ['title', 'scenario', 'question', 'description', 'entry_purpose', 'origin']) {
      if (project[field]) assert.ok(notes.includes(escapeHTML(project[field])), `retained explanation ${field}: ${project.id}`);
    }
    for (const link of project.related || []) {
      assert.ok(notes.includes(`href="${escapeHTML(link.path)}"`), `related route: ${project.id}`);
      assert.ok(notes.includes(escapeHTML(link.title)), `related title: ${project.id}`);
    }
  }
  for (const id of ['gimmer-projects', 'featured-forays', 'playgrounds', 'other-projects']) {
    assert.equal((html.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1, `preserve one target for #${id}`);
  }
  const intro = html.match(directoryIntro)?.[0];
  assert.ok(intro, 'the rendered directory introduction remains identifiable');
  assert.ok(!intro.includes('all-project-apps.html'), 'generic catalogue is not an opening shortcut');
  assert.ok(html.indexOf('id="compare-approaches"') > html.lastIndexOf('</article>'), 'comparison follows the gallery');
  assert.ok(!html.includes('My Custom GPTs'), 'Custom GPTs is no longer a directory-tail entrance');
  // This utility is deliberately discoverable through the generic app catalogues.
  assert.ok(!html.includes('project_innovation_app'), 'Do not promote the Idea notebook on Projects');
  assert.ok(!html.includes('href="/all-project-apps.html"'), 'the app catalogue is reached through Library');
  const expectedTags = [...new Set(projects.flatMap(p => p.tags))].sort();
  const topicOptions = [...html.matchAll(/<option value="([^"]+)"/g)].map(m => m[1]).filter(x => x !== 'all');
  assert.deepEqual(topicOptions, expectedTags, 'filter offers only topics with a displayed project');
  if (process.argv[3]) {
    const library = fs.readFileSync(process.argv[3], 'utf8');
    const keptCards = [...library.matchAll(/<article class="pw-picture-card foray-card"[\s\S]*?<\/article>/g)].map(m => m[0]);
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
console.log(`PASS: ${projects.length} project cards, 0 retired collection cards, one gallery, all topic filters, empty state, reset and optional rendered-page preservation checks.`);

assert.deepEqual(projects.filter(p => p.group === 'gimmer').map(p => p.path), [
  'https://lawrencerowland.github.io/gimmer-crag/petri-smc-wbs.html',
  'https://lawrencerowland.github.io/gimmer-crag-project-mountain-refuge/',
  'https://lawrencerowland.github.io/gimmer-crag/app-index.html'
]);
