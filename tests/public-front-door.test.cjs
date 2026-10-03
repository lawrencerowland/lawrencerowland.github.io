const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const nav = fs.readFileSync('_includes/nav.html', 'utf8');
const home = fs.readFileSync('index.md', 'utf8');
const library = fs.readFileSync('library.md', 'utf8');
const materials = JSON.parse(fs.readFileSync('_data/library_materials.json', 'utf8'));
const themes = JSON.parse(fs.readFileSync('_data/library_themes.json', 'utf8'));
const additional = JSON.parse(fs.readFileSync('_data/library_additional.json', 'utf8'));
const themeLayout = fs.readFileSync('_layouts/library-theme.html', 'utf8');
const materialFor = url => materials.find(item => item.url === url || item.url?.split('#')[0] === url);
assert.deepEqual([...nav.matchAll(/>(Experiments|Methods library|Project scenarios|Working views|Wider interest)<\/a>/g)].map(m => m[1]), ['Experiments', 'Methods library', 'Project scenarios', 'Working views']);
assert.match(nav, /<span>Lawrence Rowland<\/span><small>Project Experiments in AI<\/small>/, 'the top brand keeps the name and requested subtitle');
assert.ok(!nav.includes('Independent project experiments'), 'the former brand subtitle is retired');
assert.ok(!nav.includes('all-project-apps.html'), 'generic catalogues are secondary');
assert.ok(!fs.existsSync('_includes/footer.html'), 'the duplicate shared footer is retired');
for (const file of fs.readdirSync('_layouts').filter(file => file.endsWith('.html'))) {
  assert.ok(!/include\s+footer\.html/.test(fs.readFileSync(path.join('_layouts', file), 'utf8')), file + ': no retired footer include');
}
for (const route of ['/graphs.html', '/Books.html', '/gap-map.html']) {
  assert.ok(library.includes(route) || materialFor(route), `supporting destination remains reachable through Library subjects: ${route}`);
}
assert.ok(!library.includes('/project-examples.html'), 'the retired example index is not a second collection entrance');
const graphMaterial = materialFor('/graphs.html');
assert.equal(graphMaterial?.theme, 'states-and-relationships', 'graphs and connections share the relationships subject');
assert.ok(!library.includes('aria-labelledby="library-maps-title"'), 'maps do not form a separate Library hierarchy');
assert.ok(!home.includes('/gimmer-comparison/'), 'planning comparison is below the Experiments entrance');
assert.ok(fs.readFileSync('side-projects.md', 'utf8').includes('/gimmer-comparison/'), 'the comparison remains reachable from Experiments');
assert.ok(!fs.existsSync('older-stuff.md'), 'redundant Older stuff index is retired');
assert.ok(!library.includes('/older-stuff.html'), 'Library has no link to the retired index');
for (const route of ['/ML-for-portfolios.html', '/Portfolio-frameworks.html', '/Portfolio-data-model.html']) {
  assert.ok(materialFor(route), `guide remains directly reachable in a Library subject: ${route}`);
}
assert.equal(materialFor('/deep-research/')?.theme, 'capabilities-and-futures', 'Deep Research has a capabilities subject entrance');
assert.ok(!/\/blog(?:_summary)?\.html/.test(library), 'Library leads to subject material without an archive entrance');
for (const id of ['notes', 'blog-posts', 'earlier-notes--2020', 'historical-articles', 'library-starts']) {
  assert.ok(library.includes('id="' + id + '"'), 'the former generic fragment remains at the topic grid: ' + id);
}
assert.ok(!/pw-historical-grid|pw-historical-card|<h[1-6][^>]*id="historical-articles"/.test(library), 'no standalone historical article group remains');
assert.ok(themeLayout.includes('site.data.library_materials'), 'subject pages include established material alongside apps');
assert.equal(themes.length, 5, 'the five established subject records remain unchanged');
for (const phrase of ['Try an idea', 'Five ways into the work.', 'Two bounded worked examples', 'Three strands of earlier work.', 'Connecting the parts of a project.']) {
  assert.ok(!library.includes(phrase), 'retired material-type hierarchy is absent: ' + phrase);
}
const historicalArticles = JSON.parse(fs.readFileSync('_data/historical_articles.yml', 'utf8'));
assert.equal(historicalArticles.length, 4);
assert.ok(historicalArticles.every(article => article.date.startsWith('2020-') && article.url.startsWith('/library/articles/')));
assert.match(library, /<h1\b[^>]*>Methods library<\/h1>/, 'Library has a concise title');
assert.match(library, /<p\b[^>]*>A home for more established methods\.<\/p>/, 'Library has the requested subtitle');
assert.ok(!/bounded problem|not all received a new technical review|Looking for the open enquiries|Some work asks an open question/.test(library), 'the former Library introduction is retired');
for (const route of ['/explore-visually.html', '/side-projects.html']) assert.ok(!library.includes(route), 'peer pages are reached through the main navigation: ' + route);
for (const [route, label] of [['/about_me.html', 'About'], ['/sitemap.html', 'Sitemap']]) {
  const entries = additional.filter(entry => entry.url === route);
  assert.equal(entries.length, 1, 'one Library utility tile: ' + label);
  assert.equal(entries[0].title, label);
}
assert.ok(library.includes('for entry in site.data.library_additional'), 'the utility tiles are rendered from their shared metadata');
assert.ok(!library.includes('/about_the_site.html'), 'About has one canonical entrance');
for (const source of [home, library]) {
  assert.equal((source.match(/<h1\b/g) || []).length, 1);
  assert.ok(source.includes('id="home-main"'), 'skip link has a focusable destination');
  for (const img of source.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /\balt="[^"]*"/, 'images expose an accessible description or are decorative');
}
assert.deepEqual([...home.matchAll(/<h2\b[^>]*>([^<]+)<\/h2>/g)].map(match => match[1]), ['Experiments', 'Methods library', 'Project scenarios'], 'the front door retains its three pictured entrances');
assert.ok(home.includes('/side-projects.html'), 'project-specific questions remain under the Experiments entrance');

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
const originalExampleIdentity = {
  'feedback-groups': ['0877b95801274a740cf3b1e59533fbaf95b2670b', 'lawrencerowland/Project-web-apps:web_apps/frobenius-dsm-explorer.html', '5863feaa2293505df2c2475f1291a26f54e624603305507db6f39466babdb6b7'],
  'buffer-day': ['3228f1badb656be3d37ba8d00ca4b7af5907e996', 'lawrencerowland/Project-web-apps:web_apps/project-risk-gradient.html', '8c67552d5593cffcd18190c4aeb8abe020e7670c03fd59f4eaa2c90169e7797f']
};
for (const example of examples) {
  for (const key of ['id','title','canonical_url','image','image_alt','inputs','try','limitation','revision_context','source_commit','source_url']) assert.ok(example[key], `${example.id}: ${key}`);
  assert.equal(new URL(example.canonical_url).origin, 'https://lawrencerowland.github.io');
  assert.deepEqual([example.source_commit, example.historical_source, example.source_sha256], originalExampleIdentity[example.id], 'historical source identities survive repository retirement');
  for (const url of [example.source_url, example.checks_url].filter(Boolean)) {
    const prefix = 'https://github.com/lawrencerowland/lawrencerowland.github.io/blob/master/';
    assert.ok(url.startsWith(prefix), 'reader source links lead to the maintained repository');
    assert.ok(fs.statSync(url.slice(prefix.length)).isFile(), 'maintained source or checks exist');
  }
  assert.ok(['app_revision','source_commit'].includes(example.date_kind));
  assert.match(example.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(example.role, 'bounded-worked-example');
  assert.ok(fs.existsSync(example.image.slice(1)), 'local example illustration exists');
}

if (process.argv[2]) {
  const root = process.argv[2];
  for (const route of ['index.html', 'library.html', 'about_me.html', 'blog_summary.html', 'side-projects.html', 'explore-visually.html']) {
    const html = fs.readFileSync(path.join(root, route), 'utf8');
    assert.ok(!html.includes('{%') && !html.includes('{{'), `${route}: Liquid fully rendered`);
    assert.match(html, /<meta[^>]+name="viewport"/);
    assert.match(html, /href="\/library.html"/);
    assert.match(html, /aria-controls="main-nav-links"/);
    assert.equal((html.match(/aria-label="Main navigation"/g) || []).length, 1, route + ': one main navigation');
    assert.ok(!/class="[^"]*(?:site-footer|pw-footer)/.test(html), route + ': no duplicate shared footer');
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
    const item = materials.find(item => item.kind === 'worked-example' && item.id === example.id);
    assert.ok(item, `worked example ${example.id} has a subject placement`);
    const themeHTML = fs.readFileSync(path.join(root, 'library/methods/' + item.theme + '.html'), 'utf8');
    const card = themeHTML.match(new RegExp(`<article class="pw-home-question" id="${example.id}"[\\s\\S]*?<\\/article>`))?.[0];
    assert.ok(card, `rendered subject example ${example.id}`);
    for (const key of ['title','topic','canonical_url','image','image_alt','problem','action','inputs','try','limitation','revision_context','source_url','source_label']) assert.ok(card.includes(escapeHTML(example[key])), `example ${example.id}: preserve ${key}`);
    for (const key of ['checks_url', 'checks_label']) if (example[key]) assert.ok(card.includes(escapeHTML(example[key])), `example ${example.id}: preserve ${key}`);
    assert.ok(card.includes('<details'), 'scope remains available by native disclosure without JavaScript');
  }
  const historicalCards = [];
  for (const article of historicalArticles) {
    const item = materials.find(item => item.kind === 'article' && item.historical_url === article.url);
    assert.ok(item, 'historical article has a subject placement: ' + article.title);
    assert.equal(article.library_url, '/library/methods/' + item.theme + '.html#' + item.id, 'article return points to its peer card');
    const themeHTML = fs.readFileSync(path.join(root, 'library/methods/' + item.theme + '.html'), 'utf8');
    const card = themeHTML.match(new RegExp('<article class="pw-home-question" id="' + item.id + '"[\\s\\S]*?<\\/article>'))?.[0];
    assert.ok(card, 'peer subject entrance for ' + article.title);
    assert.ok(card.includes('href="' + article.url + '"'), 'peer card directly opens the article');
    assert.ok(card.includes(escapeHTML(article.title)), 'original title is visible');
    assert.ok(card.includes('datetime="' + article.date + '"'), 'original publication date is visible');
    assert.ok(card.includes(escapeHTML(article.summary)), 'reading context remains visible');
    assert.ok(fs.existsSync(path.join(root, article.url)), 'article is published at the retained Library route');
    historicalCards.push(card);
  }
  assert.equal(historicalCards.length, 4, 'four direct historical article entrances on equal subject cards');
  assert.ok(!/href="\/blog(?:_summary)?\.html/.test(libraryHTML), 'no parallel blog entrance is advertised');
}
console.log('PASS: public entry routes, retained library, navigation disclosure and optional rendered links.');
