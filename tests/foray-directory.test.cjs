const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const projects = JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e',
  'puts JSON.generate(YAML.load_file("_data/side_projects.yml"))'], { encoding: 'utf8' }));
assert.equal(projects.length, 17);
assert.equal(projects.find(p => p.title === "Project Co-design").path, "https://lawrencerowland.github.io/project-co-design/");
assert.equal(new Set(projects.map(project => project.path)).size, projects.length);
assert.equal(projects.find(p => p.title === "Shared waters: open systems").path, "https://lawrencerowland.github.io/shared-dynamics/");
for (const project of projects) {
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
  const renderedCards = [...html.matchAll(/<article class="example-card foray-card"[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(renderedCards.length, projects.length);
  assert.ok(!html.includes('{%') && !html.includes('{{'), 'Liquid rendered completely');
  assert.ok(!html.includes('https://lawrencerowland.github.io/csv-to-gantt/'), 'removed route is absent from the rendered directory');
  for (const [index, project] of projects.entries()) {
    const card = renderedCards[index];
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
  assert.ok(html.includes('href="https://lawrencerowland.github.io/project_innovation_app/"'));
  assert.ok(html.includes('href="/all-project-apps.html"'));
  assert.match(html, /src="\/assets\/forays\.js\?v=\d+"/);
  assert.ok(html.includes('id="foray-topic" autocomplete="off"'));
}
console.log(`PASS: ${projects.length} unique cards, one gallery, all topic filters, empty state, reset and optional rendered-page preservation checks.`);

assert.deepEqual(projects.filter(p => p.group === 'gimmer').map(p => p.path), [
  'https://lawrencerowland.github.io/gimmer-crag/petri-smc-wbs.html',
  'https://lawrencerowland.github.io/gimmer-crag-project-mountain-refuge/',
  'https://lawrencerowland.github.io/gimmer-crag/app-index.html'
]);
