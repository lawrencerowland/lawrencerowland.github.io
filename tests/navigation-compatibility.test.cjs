'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('../tools/library-apps/node_modules/jsdom');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const origin = 'https://lawrencerowland.github.io';
const ids = html => [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const scalar = (source, key) => source.match(new RegExp('^' + key + ': (.+)$', 'm'))?.[1];
const redirectScript = source => [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(script => script.includes('location.replace'));
const about = read('about_me.md');
const oldAbout = read('about_the_site.md');
const oldExamples = read('project-examples.md');
const aboutSections = ['about', 'current-work', 'earlier-purpose', 'purpose', 'how-to-use', 'motivation', 'methodologies', 'experiments', 'frameworks', 'manifesto', 'publications', 'contact'];
for (const id of aboutSections) assert.ok(ids(about).includes(id), 'merged About retains section ' + id);
assert.equal(new Set(ids(about)).size, ids(about).length, 'merged About has unambiguous fragment targets');
assert.equal((about.match(/<h1\b/g) || []).length, 1, 'one merged About title');
assert.ok(about.includes('/images/Howgills.png'), 'the earlier About image remains');
assert.ok(!fs.existsSync(path.join(root, '_data/examples.yml')), 'the duplicate earlier-example collection is retired');
assert.ok(!/filterExamples|site\.data\.examples|example-card/.test(oldExamples), 'old example URL is a compatibility page, not a second catalogue');

const aboutFragments = {
  'about-this-site': 'about',
  'the-sites-earlier-purpose': 'earlier-purpose',
  purpose: 'purpose', description: 'purpose',
  'how-to-use': 'how-to-use', motivation: 'motivation', contact: 'contact'
};
const redirects = [
  {file: 'about_the_site', source: oldAbout, target: '/about_me.html', linkID: 'about-destination',
    hashes: ['', ...Object.keys(aboutFragments).flatMap(id => ['#' + id, '#markdown-toc-' + id]), '#%64escription', '#unfamiliar-section'],
    destinationHash(hash) {
      let id = decodeURIComponent(hash.slice(1)).replace(/^markdown-toc-/, '');
      return hash ? '#' + (aboutFragments[id] || id) : '';
    }},
  {file: 'project-examples', source: oldExamples, target: '/library.html#interactive-methods', linkID: 'destination',
    hashes: ['', '#old-section', '#https://example.invalid/'], destinationHash: () => '#interactive-methods'}
];

function exerciseRedirect(item, source, href) {
  const script = redirectScript(source);
  assert.ok(script, item.file + ': actual forwarding script exists');
  for (const search of ['', '?from=saved&repeat=one&repeat=two&encoded=%2523%26', '?next=https%3A%2F%2Fexample.invalid%2F']) {
    for (const hash of item.hashes) for (const blocked of [false, true]) {
      const link = {href};
      let forwarded;
      const location = {search, hash, href: origin + '/' + item.file + '.html' + search + hash,
        replace(url) { forwarded = url; if (blocked) throw Error('navigation blocked'); }};
      vm.runInNewContext(script, {URL, location, window: {location},
        document: {getElementById(id) { assert.equal(id, item.linkID); return link; }}});
      const expected = new URL(item.target, origin);
      expected.search = search;
      expected.hash = item.destinationHash(hash);
      assert.equal(forwarded, expected.href, item.file + ': fixed destination with preserved query and mapped fragment');
      assert.equal(link.href, expected.href, item.file + ': same usable fallback when forwarding is blocked');
    }
  }
}
for (const item of redirects) {
  assert.equal(scalar(item.source, 'legacy_redirect'), 'true', item.file + ': compatibility status enables noindex');
  assert.equal(scalar(item.source, 'sitemap'), 'false', item.file + ': not a competing sitemap entrance');
  assert.equal(scalar(item.source, 'canonical_url'), new URL(item.target, origin).href.split('#')[0]);
  assert.ok(item.source.includes('id="' + item.linkID + '"'), item.file + ': visible no-script fallback');
  exerciseRedirect(item, item.source, new URL(item.target, origin).href);
}

// Saved About sections inside a disclosure must become visible both on initial
// arrival and when another fragment is selected later.
const revealScript = [...about.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(script => script.includes('revealLinkedSection'));
assert.ok(revealScript, 'merged About reveals bookmarked sections');
const disclosure = {tagName: 'DETAILS', open: false, parentElement: null};
let scrolled = 0, hashchange;
const section = {parentElement: disclosure, scrollIntoView() { scrolled++; }};
const location = {hash: '#%6dethodologies'};
vm.runInNewContext(revealScript, {
  document: {getElementById(id) { return id === 'methodologies' ? section : null; }},
  window: {location, addEventListener(event, listener) { assert.equal(event, 'hashchange'); hashchange = listener; }}
});
assert.equal(disclosure.open, true, 'initial bookmarked disclosure opens');
assert.equal(scrolled, 1, 'revealed section is brought into view');
disclosure.open = false;
hashchange();
assert.equal(disclosure.open, true, 'later bookmarked disclosure opens');
assert.equal(scrolled, 2);
for (const hash of ['#unknown', '#bad%ZZ', '']) { location.hash = hash; hashchange(); }
assert.equal(scrolled, 2, 'unknown fragments do not move the page');

if (process.argv[2]) {
  const built = path.resolve(process.argv[2]);
  const builtRead = file => fs.readFileSync(path.join(built, file), 'utf8');
  const merged = builtRead('about_me.html');
  const siteMap = builtRead('sitemap.xml'), humanMap = builtRead('sitemap.html');
  const mapDocument = new JSDOM(humanMap, {url: origin + '/sitemap.html'}).window.document;
  const mapURLs = [...mapDocument.querySelectorAll('a[href]')].map(anchor => new URL(anchor.href));
  // The agent orientation can refer to the same canonical homes; the tree
  // itself must still contain each retained destination exactly once.
  const treeURLs = [...mapDocument.querySelectorAll('.pw-map-branch:nth-child(-n+2) a[href]')].map(anchor => new URL(anchor.href));
  for (const route of ['/gimmer-comparison/', '/project-co-design/', '/library/models/us-portfolio-questions.html']) {
    assert.equal(treeURLs.filter(url => url.href === new URL(route, origin).href).length, 1, 'one retained canonical sitemap tree route, absolute or relative: ' + route);
  }
  for (const id of aboutSections) assert.ok(ids(merged).includes(id), 'published About section ' + id);
  assert.equal(new Set(ids(merged)).size, ids(merged).length, 'published About fragment targets are unique');
  for (const item of redirects) {
    const file = item.file + '.html', html = builtRead(file);
    const fallback = html.match(new RegExp('<a\\b[^>]*id="' + item.linkID + '"[^>]*href="([^"]+)"[^>]*>([^<]+)<\\/a>'));
    assert.ok(fallback && fallback[2].trim(), file + ': rendered visible fallback');
    assert.equal(fallback[1], item.target);
    assert.match(html, /<meta name="robots" content="noindex, follow">/);
    assert.ok(html.includes('rel="canonical" href="' + new URL(item.target, origin).href.split('#')[0] + '"'));
    assert.ok(!siteMap.includes('<loc>' + origin + '/' + file + '</loc>'), file + ': absent from machine sitemap');
    assert.ok(!mapURLs.some(url => url.origin === origin && url.pathname === '/' + file), file + ': absent from human sitemap, including absolute and stateful links');
    exerciseRedirect(item, html, new URL(fallback[1], origin).href);
  }
  const subjects = builtRead('library.html');
  assert.ok(ids(subjects).includes('interactive-methods'), 'old examples redirect to an existing subject entrance');
}
console.log('PASS: About consolidation and earlier-example compatibility routes, saved fragments, fixed destinations and manual fallbacks' + (process.argv[2] ? '; rendered metadata and sitemap exclusions.' : '.'));
