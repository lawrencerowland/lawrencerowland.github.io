'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const items = JSON.parse(read('_data/visualisations.json'));
const { readState, matchingItems, stateURL } = require('../assets/visual-explorer.js');
const state = { q: '', topic: 'all', kind: 'all', view: null };

assert.ok(items.length >= 24 && items.length <= 36, 'bounded pilot collection');
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
  for (const key of ['image', 'thumb']) {
    assert.match(item[key], /^\/images\/visual-explorer\/[a-z0-9-]+\.(webp|svg)$/);
    assert.ok(fs.statSync(path.join(root, item[key])).size > 100, `${item.id} ${key} exists`);
    assetPaths.add(item[key]);
  }
}
const previewBytes = [...assetPaths].reduce((n, file) => n + fs.statSync(path.join(root, file)).size, 0);
assert.ok(previewBytes < 2_000_000, 'the pilot previews stay below 2 MB combined');
assert.ok(items.reduce((n, item) => n + fs.statSync(path.join(root, item.thumb)).size, 0) < 250_000, 'the entire tile wall stays below 250 KB');

assert.equal(matchingItems(items, state).length, items.length);
assert.deepEqual(matchingItems(items, { ...state, q: 'Petri', topic: 'resources' }).map(item => item.id), ['boundary-net', 'farm-lane-net']);
assert.deepEqual(matchingItems(items, { ...state, q: 'feedback', kind: 'interactive' }).map(item => item.id), ['dependency-matrix', 'dependency-groups']);
assert.equal(matchingItems(items, { ...state, q: 'nonesuchword' }).length, 0);
assert.deepEqual(matchingItems(items, { ...state, q: 'boundary resource' }).map(item => item.id), ['boundary-net', 'boundary-composition'], 'multi-word search requires both terms');
assert.deepEqual(matchingItems(items, { ...state, q: 'PÉTRI' }), matchingItems(items, { ...state, q: 'petri' }), 'case and accents do not block discovery');
assert.ok(matchingItems(items, { ...state, q: '2022' }).every(item => item.year === '2022'));
assert.equal(matchingItems(items, { ...state, q: '<script>alert(1)</script>' }).length, 0);
const combined = { q: 'roof lift', topic: 'resources', kind: 'interactive', view: 'boundary-composition' };
const encoded = stateURL('https://example.test/explore-visually.html?from=library', combined);
assert.equal(encoded.searchParams.get('from'), 'library');
assert.deepEqual(readState(encoded.search, items), combined, 'a shared view preserves its search and filters');
assert.equal(stateURL(encoded.href, state).search, '?from=library', 'reset removes only the explorer state');
assert.deepEqual(readState('?topic=invalid&kind=invalid&view=missing&q=%20lane%20', items), { ...state, q: 'lane' });

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
console.log(`Visual explorer: ${items.length} views; search, combined filters, shared URLs, fallback routes and assets passed (${previewBytes} preview bytes).`);
