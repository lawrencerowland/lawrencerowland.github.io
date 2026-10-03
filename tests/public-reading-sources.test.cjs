'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { JSDOM } = require('../tools/library-apps/node_modules/jsdom');
const root = path.resolve(__dirname, '..');
const build = process.argv[2] ? path.resolve(process.argv[2]) : null;
const origin = 'https://lawrencerowland.github.io';
const catalogue = JSON.parse(fs.readFileSync(path.join(root, '_data/public_reading_sources.json')));
const files = catalogue.files;
const source = url => path.join(root, decodeURIComponent(url));
const text = value => Array.isArray(value) ? value.join('') : String(value || '');
const digest = data => createHash('sha256').update(data).digest('hex');
const builtPath = pathname => path.join(build, decodeURIComponent(pathname.endsWith('/') ? pathname + 'index.html' : pathname));
const document = file => new JSDOM(fs.readFileSync(file, 'utf8')).window.document;

test('public downloads retain the captured bytes and exact source revision', () => {
  assert.ok(files.length >= 120);
  for (const f of files) {
    assert.match(f.commit, /^[a-f0-9]{40}$/);
    assert.ok(f.source_url.includes('/blob/' + f.commit + '/'));
    const bytes = fs.readFileSync(source(f.download_url));
    assert.equal(bytes.length, f.bytes, f.path);
    assert.equal(digest(bytes), f.sha256, f.path);
    if (build) assert.equal(digest(fs.readFileSync(builtPath(f.download_url))), f.sha256, 'served copy: ' + f.path);
    assert.ok(fs.existsSync(source('/library/sources/' + f.group + '/index.md')));
  }
  for (const group of ['four-directors','us-portfolio','portfolio-needs','programme-models','project-ontology','orange-project-ratings','monthly-portfolio-review','project-graphs','framework-outline','bracken-vale','functors','gimmer-collections']) {
    assert.ok(files.some(f => f.group === group), group);
  }
});

test('seven notebook readers preserve every code cell and every saved output', () => {
  const notebooks = files.filter(f => f.path.endsWith('.ipynb'));
  assert.equal(notebooks.length, 7);
  for (const f of notebooks) {
    const nb = JSON.parse(fs.readFileSync(source(f.download_url), 'utf8'));
    const p = build ? builtPath(f.reader_url) : source(f.reader_url.replace(/\.html$/, '.md'));
    const doc = document(p);
    const cells = doc.querySelectorAll('.reading-cell');
    assert.equal(cells.length, nb.cells.length, f.path);
    for (const [i, c] of nb.cells.entries()) {
      const cell = doc.getElementById('cell-' + (i + 1));
      assert.ok(cell, f.path + ' cell ' + i);
      if (c.cell_type !== 'markdown') assert.equal(cell.querySelector('.reading-code code').textContent, text(c.source));
      const outs = c.outputs || [];
      assert.equal(cell.querySelectorAll('.reading-output').length, outs.length ? 1 : 0);
      const pngs = outs.filter(o => o.data && o.data['image/png']);
      assert.deepEqual([...cell.querySelectorAll('.reading-output img[src^="data:image/png"]')].map(img => img.getAttribute('src').slice('data:image/png;base64,'.length)), pngs.map(o => text(o.data['image/png']).replace(/\n/g, '')));
      assert.equal(cell.querySelectorAll('script,iframe,object,embed,[onclick],[onload],[onerror]').length, 0, 'no executable saved output');
    }
    assert.match(fs.readFileSync(p,'utf8'), /nothing was executed/);
  }
});

test('source links point to actual authoring folders, and access is labelled', () => {
  const apps = JSON.parse(fs.readFileSync(path.join(root, '_data/library_apps.json')));
  for (const app of apps) {
    const url = app.source_url || origin.replace('https://lawrencerowland.github.io','https://github.com/lawrencerowland/lawrencerowland.github.io') + '/tree/master/tools/library-apps/apps/' + app.id;
    if (url.startsWith('https://github.com/lawrencerowland/lawrencerowland.github.io/tree/master/')) {
      assert.ok(fs.existsSync(path.join(root, decodeURIComponent(url.split('/tree/master/')[1]))), app.id + ': real authoring folder');
    }
  }
  assert.match(fs.readFileSync(path.join(root, '_includes/library-entry.html'),'utf8'), /GitHub source \(may require access\)/);
});

if (build) test('all preserved reading routes, images, downloads and local fragments resolve in the built site', () => {
  const readers = files.filter(f => f.reader_url).map(f => f.reader_url);
  const indexes = [...new Set(files.map(f => '/library/sources/' + f.group + '/'))];
  const entrances = ['/ML-for-portfolios.html','/Portfolio-data-model.html','/Portfolio-frameworks.html','/project-model-comparison.html','/library/models/us-portfolio-questions.html'];
  const documents = new Map();
  function readDoc(p) { if (!documents.has(p)) documents.set(p, document(p)); return documents.get(p); }
  let links = 0;
  for (const route of [...readers,...indexes,...entrances]) {
    const from = builtPath(route); assert.ok(fs.existsSync(from), route);
    const doc = readDoc(from);
    if (readers.includes(route)) assert.ok(doc.querySelector('h1'), route + ': rendered Markdown heading');
    for (const node of doc.querySelectorAll('main a[href], main img[src]')) {
      const raw = node.getAttribute(node.hasAttribute('href') ? 'href' : 'src');
      if (!raw || raw.startsWith('data:')) continue;
      assert.ok(!raw.includes('{{'), route + ': Liquid rendered');
      const u = new URL(raw, origin + route);
      if (u.origin !== origin || raw.startsWith('http')) continue; // sibling Pages sites are checked separately
      const target = builtPath(u.pathname);
      assert.ok(fs.existsSync(target), route + ' → ' + raw);
      if (u.hash && target.endsWith('.html')) assert.ok(readDoc(target).getElementById(decodeURIComponent(u.hash.slice(1))), route + ': fragment ' + raw);
      links++;
    }
  }
  assert.ok(links > 400, 'substantial reader route coverage');
});
