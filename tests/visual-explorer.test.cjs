'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const items = JSON.parse(read('_data/visualisations.json'));
const { readState, stateURL } = require('../assets/visual-explorer.js');
const state = { view: null };

assert.ok(items.length > 0, 'the visual collection is populated');
assert.equal(new Set(items.map(item => item.id)).size, items.length, 'unique stable view IDs');
assert.equal(new Set(items.map(item => item.source_sha256)).size, items.length, 'no duplicated source pictures');
const assetPaths = new Set();
for (const item of items) {
  assert.match(item.id, /^[a-z][a-z0-9-]+$/);
  for (const field of ['title', 'home', 'caption', 'look', 'limit', 'alt']) assert.ok(item[field].trim(), `${item.id} has ${field}`);
  assert.equal(new URL(item.url).origin, 'https://lawrencerowland.github.io', 'every view links back to a published example');
  assert.ok(['interactive', 'diagram'].includes(item.kind));
  assert.ok(['Experiment', 'Worked example', 'Earlier example'].includes(item.status));
  if (item.year) assert.match(item.year, /^20\d\d$/);
  assert.ok(item.topics.length && item.topics.every(topic => ['relationships', 'processes', 'resources', 'choices', 'uncertainty'].includes(topic)));
  assert.match(item.checked, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(item.source_sha256, /^[a-f0-9]{64}$/);
  assert.ok(item.width > 0 && item.height > 0);
  const related = item.related || [];
  assert.equal(new Set(related.map(link => link.id)).size, related.length, `${item.id} has unique companions`);
  for (const link of related) {
    assert.notEqual(link.id, item.id, 'a comparison must open a different view');
    assert.ok(items.some(companion => companion.id === link.id), `${item.id} companion exists`);
    assert.ok(link.label.trim(), 'companion links have short visible labels');
    const bookmark = stateURL('https://example.test/explore-visually.html', { ...state, view: link.id });
    assert.equal(readState(bookmark.search, items).view, link.id, 'companion destinations can be bookmarked');
  }
  for (const key of ['image', 'thumb']) {
    assert.match(item[key], /^\/images\/visual-explorer\/[a-z0-9-]+\.(webp|svg)$/);
    assert.ok(fs.statSync(path.join(root, item[key])).size > 100, `${item.id} ${key} exists`);
    assetPaths.add(item[key]);
  }
}
const previewBytes = [...assetPaths].reduce((n, file) => n + fs.statSync(path.join(root, file)).size, 0);
assert.ok(previewBytes <= 3_000_000, 'the previews stay within 3 MB combined');
assert.ok(items.reduce((n, item) => n + fs.statSync(path.join(root, item.thumb)).size, 0) <= 400_000, 'the entire tile wall stays within 400 KB');

const selected = { view: items[0].id };
const encoded = stateURL('https://example.test/explore-visually.html?from=library&q=roof+lift&topic=resources&kind=diagram#pictures', selected);
assert.equal(encoded.searchParams.get('from'), 'library', 'unrelated parameters survive preview navigation');
assert.equal(encoded.hash, '#pictures', 'preview navigation preserves the page fragment');
assert.deepEqual(readState(encoded.search, items), selected, 'a shared view opens the selected picture');
assert.equal(encoded.searchParams.has('q'), false, 'retired search parameters are removed');
assert.equal(encoded.searchParams.has('topic'), false, 'retired topic parameters are removed');
assert.equal(encoded.searchParams.has('kind'), false, 'retired kind parameters are removed');
assert.equal(stateURL(encoded.href, state).search, '?from=library', 'closing a preview removes only explorer state');
assert.deepEqual(readState('?topic=resources&kind=diagram&view=missing&q=nonesuchword', items), state, 'old filters and unknown views cannot narrow the wall');
for (const item of items) {
  assert.deepEqual(readState(`?q=nonesuchword&topic=invalid&kind=invalid&view=${item.id}`, items), { view: item.id }, 'every picture remains reachable from old filtered bookmarks');
}

const source = read('explore-visually.md');
assert.match(source, /href="\{\{ view\.url \| escape \}\}"/, 'without JavaScript every tile still opens its example');
assert.match(source, /<dialog[^>]*aria-labelledby="viz-detail-title"/);
assert.match(source, /<noscript>/);
assert.match(read('library.md'), /\/explore-visually\.html/);
assert.ok(!read('_includes/nav.html').includes('explore-visually'), 'discovery belongs under the existing Library navigation');

if (process.argv[2]) {
  const dir = path.resolve(process.argv[2]);
  const html = fs.readFileSync(path.join(dir, 'explore-visually.html'), 'utf8');
  const library = fs.readFileSync(path.join(dir, 'library.html'), 'utf8');
  const embedded = html.match(/<script type="application\/json" id="viz-data">([\s\S]*?)<\/script>/);
  assert.ok(embedded);
  assert.deepEqual(JSON.parse(embedded[1]), items, 'Jekyll publishes the exact checked catalogue');
  assert.equal([...html.matchAll(/class="viz-tile"/g)].length, items.length);
  assert.ok(!html.includes('{%') && !html.includes('{{'), 'all Liquid is rendered');
  assert.match(library, /href="\/explore-visually.html"/);
  for (const file of assetPaths) assert.ok(fs.existsSync(path.join(dir, file)), `${file} is included in the built site`);
  for (const item of items) assert.ok(html.includes(`data-view="${item.id}"`));
  assert.ok(fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8').includes('/explore-visually.html'));
}
console.log(`Visual explorer: ${items.length} views; shared URLs, retired-filter bookmarks, fallback routes and assets passed (${previewBytes} preview bytes).`);
