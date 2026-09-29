const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const nav = fs.readFileSync('_includes/nav.html', 'utf8');
const footer = fs.readFileSync('_includes/footer.html', 'utf8');
const home = fs.readFileSync('index.md', 'utf8');
const library = fs.readFileSync('library.md', 'utf8');
assert.deepEqual([...nav.matchAll(/>(Projects|Library|Notes|About)<\/a>/g)].map(m => m[1]), ['Projects', 'Library']);
assert.ok(!nav.includes('all-project-apps.html'), 'generic catalogues are secondary');
for (const route of ['/blog_summary.html', '/about_me.html', '/all-project-apps.html', '/graphs.html', '/Books.html', '/gap-map.html', '/wider-interest/', '/older-stuff.html', '/ML-for-portfolios.html', '/Portfolio-frameworks.html', '/Portfolio-data-model.html']) {
  assert.ok(footer.includes(route), `preserve the older route ${route}`);
}
assert.match(footer, />Notes &amp; writing<\/a>/, 'Notes remains discoverable in the footer');
assert.match(footer, />About<\/a>/, 'About remains discoverable in the footer');
for (const source of [home, library]) {
  assert.equal((source.match(/<h1\b/g) || []).length, 1);
  assert.ok(source.includes('id="home-main"'), 'skip link has a focusable destination');
  for (const img of source.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /\balt="[^"]*"/, 'images expose an accessible description or are decorative');
}
assert.match(home, /href="https:\/\/lawrencerowland.github.io\/gimmer-crag\/petri-smc-wbs.html" aria-labelledby="gimmer-question-title"/, 'general process-to-plan question leads to the main collection');
assert.match(library, /bounded problem/);
assert.match(library, /not all received a new technical review/);

// Exercise the real navigation script: disclosure, Escape, link selection and
// resizing must keep the announced state and displayed state in agreement.
const handlers = {}, attributes = { 'aria-expanded': 'false' }, classes = new Set();
let focused = false, resize;
const toggle = {
  hidden: true,
  setAttribute: (key, value) => attributes[key] = value,
  getAttribute: key => attributes[key],
  addEventListener: (name, fn) => handlers[`button:${name}`] = fn,
  focus: () => focused = true
};
const links = {
  classList: {
    remove: name => classes.delete(name),
    toggle: name => { if (classes.has(name)) { classes.delete(name); return false; } classes.add(name); return true; }
  },
  addEventListener: (name, fn) => handlers[`links:${name}`] = fn
};
const element = {
  dataset: {},
  querySelector: selector => selector === '.nav-toggle' ? toggle : links,
  addEventListener: (name, fn) => handlers[`nav:${name}`] = fn
};
const script = nav.match(/<script>([\s\S]*?)<\/script>/)[1];
vm.runInNewContext(script, {
  document: { addEventListener: (_, fn) => fn(), querySelector: () => element },
  window: { matchMedia: () => ({ addEventListener: (_, fn) => resize = fn }) }
});
const assertClosed = () => { assert.equal(attributes['aria-expanded'], 'false'); assert.ok(!classes.has('show')); };
assert.equal(toggle.hidden, false);
assertClosed();
handlers['button:click']();
assert.equal(attributes['aria-expanded'], 'true'); assert.ok(classes.has('show'));
handlers['nav:keydown']({ key: 'Escape' }); assertClosed(); assert.ok(focused);
handlers['button:click'](); handlers['links:click']({ target: { closest: () => ({}) } }); assertClosed();
handlers['button:click'](); resize(); assertClosed();
vm.runInNewContext(script, { document: { addEventListener: (_, fn) => fn(), querySelector: () => null } });

const examples = JSON.parse(require('node:child_process').execFileSync('ruby', ['-ryaml','-rjson','-e',
  'puts JSON.generate(YAML.load_file("_data/worked_examples.yml"))'], {encoding:'utf8'}));
assert.equal(examples.length, 2);
assert.equal(new Set(examples.map(x => x.id)).size, examples.length);
for (const example of examples) {
  for (const key of ['id','title','canonical_url','image','image_alt','inputs','try','limitation','revision_context','source_commit','source_url']) assert.ok(example[key], `${example.id}: ${key}`);
  assert.equal(new URL(example.canonical_url).origin, 'https://lawrencerowland.github.io');
  assert.ok(example.source_url.includes(`/blob/${example.source_commit}/`));
  assert.ok(['app_revision','source_commit'].includes(example.date_kind));
  assert.match(example.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(example.role, 'bounded-worked-example');
  assert.ok(fs.existsSync(example.image.slice(1)), 'local example illustration exists');
}

if (process.argv[2]) {
  const root = process.argv[2];
  for (const route of ['index.html', 'library.html', 'about_me.html', 'about_the_site.html', 'blog_summary.html', 'side-projects.html']) {
    const html = fs.readFileSync(path.join(root, route), 'utf8');
    assert.ok(!html.includes('{%') && !html.includes('{{'), `${route}: Liquid fully rendered`);
    assert.match(html, /<meta[^>]+name="viewport"/);
    assert.match(html, /href="\/library.html"/);
    assert.match(html, /aria-controls="main-nav-links"/);
    if (['index.html', 'library.html'].includes(route)) {
      assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: one h1 after Jekyll processing`);
      for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
        let local = decodeURIComponent(match[1]);
        if (local.endsWith('/')) local += 'index.html';
        assert.ok(fs.existsSync(path.join(root, local)), `${route}: local target exists: ${match[1]}`);
      }
    }
  }
  const libraryHTML = fs.readFileSync(path.join(root,'library.html'),'utf8');
  const escapeHTML = value => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  for (const example of examples) {
    const card = libraryHTML.match(new RegExp(`<article class="pw-home-question" id="${example.id}"[\\s\\S]*?<\\/article>`))?.[0];
    assert.ok(card, `rendered example ${example.id}`);
    for (const key of ['title','canonical_url','image','inputs','try','limitation','revision_context','source_url']) assert.ok(card.includes(escapeHTML(example[key])), `example ${example.id}: preserve ${key}`);
    assert.ok(card.includes('<details'), 'scope remains available by native disclosure without JavaScript');
  }
  const notes = fs.readFileSync(path.join(root, 'blog_summary.html'), 'utf8');
  assert.ok(notes.includes('/2020/05/07/Data-models-for-Project-Portfolios.md.html'));
  assert.ok(notes.includes('/2020/05/08/Applying-appropriate-machine-learning-approach.html'));
}
console.log('PASS: public entry routes, retained library, navigation disclosure and optional rendered links.');
