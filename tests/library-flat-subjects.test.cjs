'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const themes = JSON.parse(read('_data/library_themes.json'));
const apps = JSON.parse(read('_data/library_apps.json'));
const materials = JSON.parse(read('_data/library_materials.json'));
const redirects = JSON.parse(read('_data/library_redirects.json'));
const articles = JSON.parse(read('_data/historical_articles.yml'));
const origin = 'https://lawrencerowland.github.io';
const escapeHTML = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const ids = html => [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const themeRoute = item => '/library/methods/' + item.theme + '.html#' + item.id;
const regular = materials.filter(item => !['article', 'worked-example'].includes(item.kind));
const byURL = url => regular.find(item => item.url === url);
const allItems = [...apps, ...materials];
const themeIDs = ['states-and-relationships', 'decisions-and-trade-offs', 'delivery-dynamics', 'data-and-assurance', 'capabilities-and-futures'];
assert.deepEqual(themes.map(theme => theme.id), themeIDs, 'retain the five established subjects and order');
assert.equal(new Set(allItems.map(item => item.id)).size, allItems.length, 'every peer card has a distinct stable identity');
for (const item of allItems) {
  assert.ok(themeIDs.includes(item.theme), item.id + ': belongs to an established subject');
  assert.ok(Number.isFinite(item.order), item.id + ': deliberate numeric order');
}
for (const theme of themes) {
  const peers = allItems.filter(item => item.theme === theme.id);
  assert.equal(new Set(peers.map(item => item.order)).size, peers.length, theme.id + ': unambiguous order across kinds');
}
const requiredDestinations = [
  ['/Portfolio-data-model.html#read-the-worked-models', 'states-and-relationships', '/images/Portfolio-data-model/Full-programme-data-model.png'],
  ['/Portfolio-frameworks.html', 'capabilities-and-futures', '/images/Portfolio-frameworks/portfolio-tier1.png'],
  ['/ML-for-portfolios.html', 'data-and-assurance', '/images/ML-for-portfolios/Usecase-to-Operations-subgraph-ML-models-created.png'],
  ['/library/models/mobilising-two-projects.html', 'states-and-relationships', '/images/notebook-examples/mobilising-two-projects.png'],
  ['/library/models/rail-stakeholders-objectives-scope.html', 'states-and-relationships', '/images/notebook-examples/rail-three-layers.png'],
  ['/library/models/us-portfolio-questions.html', 'states-and-relationships'],
  ['/ML-for-portfolios.html#highways-delay-notebook', 'data-and-assurance'],
  ['/ML-for-portfolios.html#orange-project-ratings', 'data-and-assurance'],
  ['/ML-for-portfolios.html#monthly-portfolio-decisions', 'decisions-and-trade-offs'],
  ['/graphs.html', 'states-and-relationships'],
  ['/gap-map.html', 'capabilities-and-futures'],
  ['/Books.html', 'capabilities-and-futures'],
  ['/deep-research/', 'capabilities-and-futures']
];
for (const [url, theme, image] of requiredDestinations) {
  const item = byURL(url);
  assert.ok(item, 'retain direct subject destination: ' + url);
  assert.equal(item.theme, theme, url + ': reader-purpose placement');
  if (image) assert.equal(item.image, image, url + ': retain original pictured entrance');
}
for (const item of regular) {
  for (const key of ['title', 'description', 'url']) assert.ok(item[key]?.trim(), item.id + ': retain ' + key);
  assert.ok(item.label || item.action, item.id + ': explicit reading role or action');
  if (item.image) {
    assert.ok(item.image_alt?.trim(), item.id + ': original picture has a meaningful description');
    if (item.image.startsWith('/')) assert.ok(fs.existsSync(path.join(root, item.image)), item.id + ': pictured source exists');
  }
}
assert.deepEqual(materials.filter(item => item.kind === 'worked-example').map(item => [item.id, item.theme]).sort(), [
  ['buffer-day', 'decisions-and-trade-offs'], ['feedback-groups', 'delivery-dynamics']
], 'both bounded examples have peer placements');
assert.equal(materials.filter(item => item.kind === 'article').length, 4, 'all four dated articles remain peer cards');
for (const article of articles) {
  const placements = materials.filter(item => item.kind === 'article' && item.historical_url === article.url);
  assert.equal(placements.length, 1, article.url + ': one subject card');
  assert.equal(article.library_url, themeRoute(placements[0]), 'historical return identifies the card itself');
}
const expectedRedirects = {
  'library-data-models': themeRoute(byURL('/Portfolio-data-model.html#read-the-worked-models')),
  'library-frameworks': themeRoute(byURL('/Portfolio-frameworks.html')),
  'library-methods': themeRoute(byURL('/ML-for-portfolios.html')),
  'notebook-examples': '/library/methods/states-and-relationships.html#mobilising-two-projects',
  'feedback-groups': '/library/methods/delivery-dynamics.html#feedback-groups',
  'buffer-day': '/library/methods/decisions-and-trade-offs.html#buffer-day',
  'library-maps-title': '/library/methods/states-and-relationships.html#graphs-and-connections',
  'library-reading': '/library/methods/capabilities-and-futures.html#deep-research'
};
assert.equal(new Set(redirects.map(item => item.id)).size, redirects.length, 'legacy fragments are unambiguous');
for (const [id, url] of Object.entries(expectedRedirects)) assert.equal(redirects.find(item => item.id === id)?.url, url, id + ': forwards to the precise replacement card');
for (const redirect of redirects) {
  assert.ok(allItems.some(item => themeRoute(item) === redirect.url), redirect.id + ': replacement is an existing peer card');
}
const library = read('library.md');
for (const fragment of ['notes', 'blog-posts', 'earlier-notes--2020', 'historical-articles', 'library-starts', 'interactive-methods']) assert.ok(ids(library).includes(fragment), 'retain broad Library fragment ' + fragment);
for (const phrase of ['Try an idea', 'Five ways into the work.', 'Two bounded worked examples', 'Three strands of earlier work.', 'Connecting the parts of a project.', 'Maps, connections &amp; reading']) assert.ok(!library.includes(phrase), 'retire type-based section: ' + phrase);
assert.ok(library.includes('/explore-visually.html'), 'visual browsing remains a collection-wide entrance');
assert.ok(library.includes('id="earlier-app-collections"') && library.includes('<details>'), 'remaining collections retain their native disclosure');
assert.ok(library.includes('site.data.library_redirects') && library.includes('/assets/js/library-routes.js'), 'legacy fragments have rendered links and a forwarding script');

// The script is exercised below against every saved fragment, separately from
// rendered-page checks, so a passing build cannot hide broken navigation.
const routeScript = read('assets/js/library-routes.js');
function routeEnvironment(initialHash, search, blocked) {
  const links = new Map(redirects.map(item => [item.id, {href: item.url}]));
  const replacements = [];
  const events = {};
  const location = {hash: initialHash, search, href: origin + '/library.html' + search + initialHash,
    replace(href) { replacements.push(href); if (blocked) throw Error('navigation blocked'); }};
  vm.runInNewContext(routeScript, {
    URL,
    document: {getElementById(id) {
      if (!links.has(id)) return null;
      return {querySelector(selector) {
        assert.equal(selector, 'a[data-library-destination]');
        return links.get(id);
      }};
    }},
    window: {location, addEventListener(name, listener) { events[name] = listener; }}
  });
  return {links, replacements, events, location};
}
for (const redirect of redirects) {
  const encodedID = [...redirect.id].map(character => '%' + character.charCodeAt(0).toString(16)).join('');
  for (const hash of ['#' + redirect.id, '#' + encodedID]) {
    for (const search of ['', '?from=saved&term=two%20words', '?repeat=1&repeat=2&encoded=%2523%26']) {
      for (const blocked of [false, true]) {
        const result = routeEnvironment(hash, search, blocked);
        const expected = new URL(redirect.url, origin);
        expected.search = search;
        assert.deepEqual(result.replacements, [expected.href], redirect.id + ': follow the new card and preserve query text');
        assert.equal(result.links.get(redirect.id).href, expected.href, redirect.id + ': navigation failure leaves a usable fallback');
        assert.equal(new URL(result.replacements[0]).hash, new URL(redirect.url, origin).hash, redirect.id + ': never copy the obsolete Library fragment to the destination');
        assert.equal(typeof result.events.hashchange, 'function', 'later bookmark selections remain supported');
      }
    }
  }
}
for (const hash of ['', '#unknown-section', '#interactive-methods', '#notes', '#historical-articles', '#bad%ZZ']) {
  const result = routeEnvironment(hash, '?keep=1', false);
  assert.deepEqual(result.replacements, [], hash + ': ordinary Library visits and unknown fragments stay on the Library');
}
const changed = routeEnvironment('', '?from=later', false);
for (const redirect of redirects) {
  changed.location.hash = '#' + redirect.id;
  changed.location.href = origin + '/library.html?from=later#' + redirect.id;
  changed.events.hashchange();
  const expected = new URL(redirect.url, origin);
  expected.search = '?from=later';
  assert.equal(changed.replacements.at(-1), expected.href, redirect.id + ': hashchange follows the newly selected card');
}

if (process.argv[2]) {
  const built = path.resolve(process.argv[2]);
  const builtRead = file => fs.readFileSync(path.join(built, file), 'utf8');
  const libraryHTML = builtRead('library.html');
  const rootCards = [...libraryHTML.matchAll(/<article class="pw-home-question"[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(rootCards.length, 5, 'the Library presents only five equal topic cards');
  for (const theme of themes) {
    const route = '/library/methods/' + theme.id + '.html';
    assert.equal(rootCards.filter(card => card.includes('href="' + route + '"')).length, 1, theme.id + ': one topic entrance');
    const html = builtRead(route);
    assert.ok(!html.includes('{%') && !html.includes('{{'), theme.id + ': fully rendered');
    const pageIDs = ids(html);
    assert.equal(new Set(pageIDs).size, pageIDs.length, theme.id + ': accessible ids are unique');
    const cards = [...html.matchAll(/<article class="pw-home-question" id="([^"]+)"[\s\S]*?<\/article>/g)];
    const peers = allItems.filter(item => item.theme === theme.id).sort((a, b) => a.order - b.order);
    assert.deepEqual(cards.map(match => match[1]), peers.map(item => item.id), theme.id + ': one ordered set of equal-level cards across material types');
    assert.ok(!/pw-library-article|pw-historical-grid|pw-historical-card/.test(html), theme.id + ': historical material is not a nested reading hierarchy');
    for (const item of peers) {
      const card = cards.find(match => match[1] === item.id)[0];
      if (regular.includes(item)) {
        for (const key of ['title', 'description', 'url', 'image', 'image_alt', 'label', 'action', 'limitation']) if (item[key]) assert.ok(card.includes(escapeHTML(item[key])), item.id + ': preserve visible ' + key);
      }
      if (apps.includes(item)) {
        for (const key of ['title', 'description', 'url', 'image', 'image_alt', 'try_this', 'limitation', 'reviewed']) assert.ok(card.includes(escapeHTML(item[key])), item.id + ': preserve app ' + key);
      } else {
        assert.ok(!card.includes('repaired and reviewed'), item.id + ': no inherited claim that historical material was repaired');
      }
    }
    for (const img of html.matchAll(/<img\b[^>]*>/g)) assert.match(img[0], /\balt="[^"]*"/, 'subject pictures retain accessible descriptions');
    for (const match of html.matchAll(/(?:href|src)="([^\"]+)"/g)) {
      if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(match[1])) continue;
      const url = new URL(match[1], origin + route);
      const target = decodeURIComponent(url.pathname) + (url.pathname.endsWith('/') ? 'index.html' : '');
      assert.ok(fs.existsSync(path.join(built, target)), theme.id + ': local target exists: ' + target);
      if (url.hash && target.endsWith('.html')) assert.ok(ids(builtRead(target)).includes(decodeURIComponent(url.hash.slice(1))), theme.id + ': destination fragment exists: ' + url.pathname + url.hash);
    }
  }
  for (const redirect of redirects) {
    assert.ok(ids(libraryHTML).includes(redirect.id), 'old fragment still has a visible fallback: ' + redirect.id);
    const fallback = libraryHTML.match(new RegExp('<p[^>]*id="' + redirect.id + '"[^>]*>[\\s\\S]*?<\\/p>'))?.[0];
    assert.ok(fallback && fallback.includes('data-library-destination') && fallback.includes('href="' + redirect.url + '"'), 'saved-link fallback reaches its exact card without JavaScript: ' + redirect.id);
  }
}
console.log('PASS: five flat subjects, complete peer-card preservation, dated article returns and precise saved-link forwards' + (process.argv[2] ? '; rendered cards, images and links.' : '.'));
