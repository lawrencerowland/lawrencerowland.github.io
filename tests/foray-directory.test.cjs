const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const projects = JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e',
  'puts JSON.generate(YAML.load_file("_data/side_projects.yml"))'], { encoding: 'utf8' }));
assert.equal(projects.length, 14);
assert.equal(new Set(projects.map(project => project.path)).size, projects.length);
for (const project of projects) {
  for (const field of ['title', 'question', 'description', 'path', 'action']) {
    assert.ok(project[field], `${project.title}: missing ${field}`);
  }
  assert.ok(['featured', 'library', 'other'].includes(project.group));
  assert.ok(Array.isArray(project.tags) && project.tags.length);
  for (const link of [project, ...(project.related || [])]) {
    assert.equal(new URL(link.path).origin, 'https://lawrencerowland.github.io');
  }
}
assert.equal(projects.find(p => p.title === 'Functors for Projects').path,
  'https://lawrencerowland.github.io/functors-for_projects/app-index.html');
assert.match(projects.find(p => p.title === 'Project Spines').description, /Six tabs/);
assert.ok(projects.some(p => p.title === 'CSV to Gantt' && p.group === 'other'));

const cards = projects.map(project => ({ dataset: { tags: project.tags.join(',') }, hidden: false }));
const empties = [];
const groups = ['featured', 'library', 'other'].map(name => {
  const empty = { hidden: true };
  empties.push(empty);
  return {
    querySelectorAll: () => cards.filter((_, index) => projects[index].group === name),
    querySelector: () => empty
  };
});
const listeners = {};
const elements = {
  'foray-directory': { querySelectorAll: selector => selector === '.foray-card' ? cards : groups },
  'foray-filter': { hidden: true },
  'foray-topic': { value: 'all', addEventListener: (event, handler) => { listeners[event] = handler; } },
  'foray-count': { textContent: '' }
};
const script = fs.readFileSync('assets/forays.js', 'utf8');
const run = () => vm.runInNewContext(script, { document: { getElementById: id => elements[id] } });
run();
assert.equal(elements['foray-filter'].hidden, false);
assert.equal(elements['foray-count'].textContent, '14 of 14 projects shown');
for (const topic of new Set(projects.flatMap(p => p.tags))) {
  elements['foray-topic'].value = topic;
  listeners.change();
  cards.forEach((card, index) => assert.equal(card.hidden, !projects[index].tags.includes(topic)));
}
elements['foray-topic'].value = 'no-match';
listeners.change();
assert.ok(cards.every(card => card.hidden));
assert.ok(empties.every(empty => !empty.hidden));
elements['foray-topic'].value = 'all';
listeners.change();
assert.ok(cards.every(card => !card.hidden));
elements['foray-topic'].value = 'schedule';
run();
assert.equal(elements['foray-topic'].value, 'all', 'reload restores the complete directory');
vm.runInNewContext(script, { document: { getElementById: () => null } });

if (process.argv[2]) {
  const html = fs.readFileSync(process.argv[2], 'utf8');
  assert.equal((html.match(/class="example-card foray-card"/g) || []).length, 14);
  assert.equal((html.match(/class="foray-group"/g) || []).length, 3);
  assert.ok(!html.includes('{%') && !html.includes('{{'), 'Liquid rendered completely');
  for (const project of projects) {
    assert.ok(html.includes(`href="${project.path}"`), `missing rendered link: ${project.title}`);
  }
  assert.ok(html.includes('href="/gpt-links-page.html"'));
  assert.ok(html.includes('href="/all-project-apps.html"'));
  assert.ok(html.includes('src="/assets/forays.js"'));
}
console.log('PASS: 14 unique cards, three groups, all topic filters, empty state, reset and optional rendered-page checks.');
