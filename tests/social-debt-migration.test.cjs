'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { JSDOM, VirtualConsole } = require('../tools/library-apps/node_modules/jsdom');
const root = path.resolve(__dirname, '..');
const app = path.join(root, 'library/apps/social-debt-explorer');
const html = fs.readFileSync(path.join(app, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(app, 'provenance/migration.json'), 'utf8'));
const canonical = 'https://lawrencerowland.github.io/library/apps/social-debt-explorer/';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const graphText = html.match(/<script type="application\/json" id="kg-data">(.*?)<\/script>/s)[1];
const data = JSON.parse(graphText);
function load(hash = '', withGraph = false) {
  const errors = [], downloads = [], copied = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, {
    url: canonical + '?retained=1' + hash,
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
    beforeParse(w) {
      w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.matchMedia = () => ({ matches: true });
      w.ResizeObserver = class { observe() {} disconnect() {} };
      w.Blob = Blob;
      w.URL.createObjectURL = blob => { downloads.push(blob); return 'blob:fixture'; };
      w.URL.revokeObjectURL = () => {};
      w.HTMLAnchorElement.prototype.click = function () {};
      Object.defineProperty(w.navigator, 'clipboard', { value: { writeText: async text => copied.push(text) } });
      w.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 800, height: 520 });
      Object.defineProperty(w.SVGElement.prototype, 'width', { get: () => ({ baseVal: { value: 800 } }) });
      Object.defineProperty(w.SVGElement.prototype, 'height', { get: () => ({ baseVal: { value: 520 } }) });
    }
  });
  if (withGraph) dom.window.eval(fs.readFileSync(path.join(app, 'vendor/d3.v7.9.0.min.js'), 'utf8'));
  return { dom, w: dom.window, d: dom.window.document, errors, downloads, copied };
}
function change(w, element, value, event = 'change') {
  element.value = value;
  element.dispatchEvent(new w.Event(event, { bubbles: true }));
}

test('original projection, runtime, image and provenance survive the move', () => {
  assert.equal(sha(graphText), manifest.embedded_graph_sha256);
  const runtime = html.match(/<script>(.*?)<\/script>/s)[1]
    .replace('./vendor/d3.v7.9.0.min.js', 'https://d3js.org/d3.v7.min.js');
  assert.equal(sha(runtime), manifest.original_runtime_sha256);
  assert.equal(data.nodes.length, 331);
  assert.equal(data.edges.length, 750);
  assert.equal(data.cards.length, 331);
  assert.equal(data.scenarios.length, 6);
  assert.equal(data.meta.profile.namedIndividuals, 262);
  assert.equal(data.meta.profile.domainRangeMismatches, 39);
  for (const [oldPath, newPath] of Object.entries(manifest.preserved_files)) {
    assert.equal(sha(fs.readFileSync(path.join(app, newPath))), manifest.source_files.find(f => f.path === oldPath).sha256);
  }
  const embeddedImage = Buffer.from(html.match(/src="data:image\/jpeg;base64,([^"]+)"/)[1], 'base64');
  assert.equal(sha(embeddedImage), sha(fs.readFileSync(path.join(app, 'assets/team-release-scene.jpg'))));
  const ids = new Set(data.nodes.map(n => n.id)), edgeIds = new Set(data.edges.map(e => e.id));
  assert.equal(ids.size, data.nodes.length);
  assert.equal(edgeIds.size, data.edges.length);
  for (const e of data.edges) { assert.ok(ids.has(e.source), e.id); assert.ok(ids.has(e.target), e.id); }
  for (const s of data.scenarios) {
    for (const id of s.nodeIds) assert.ok(ids.has(id), s.id + ': ' + id);
    for (const id of s.edgeIds) assert.ok(edgeIds.has(id), s.id + ': ' + id);
  }
  const dom = new JSDOM(html), d = dom.window.document;
  assert.equal(d.querySelector('link[rel=canonical]').href, canonical);
  assert.ok(d.querySelector('nav[aria-label=Library] a[href="/library.html#social-debt"]'));
  assert.ok(d.querySelector('noscript'));
  assert.match(d.body.textContent, /not a case study from the paper/);
  assert.match(d.body.textContent, /does not assess the full study/);
  assert.ok(!html.includes('href="https://lawrencerowland.github.io/more-project-apps/"'));
  dom.window.close();
});

test('all three fictional situations retain all three stages and distinct responses', () => {
  const { w, d, errors } = load();
  for (const story of ['knowledge', 'decisions', 'handover']) {
    d.querySelector(`[data-story=${story}]`).click();
    const headings = new Set();
    for (let stage = 0; stage < 3; stage++) {
      d.querySelector(`[data-stage="${stage}"]`).click();
      headings.add(d.getElementById('stage-heading').textContent);
      assert.equal(d.getElementById('stage-counter').textContent, `Stage ${stage + 1} of 3`);
      assert.equal(d.getElementById('stage-back').disabled, stage === 0);
      assert.equal(d.getElementById('stage-next').disabled, stage === 2);
      assert.ok(d.getElementById('stage-description').textContent.length > 40);
      assert.ok(d.getElementById('response-description').textContent.length > 100);
    }
    assert.equal(headings.size, 3);
    d.getElementById('stage-back').click();
    assert.equal(d.getElementById('stage-counter').textContent, 'Stage 2 of 3');
    d.getElementById('stage-next').click();
    assert.equal(d.getElementById('stage-counter').textContent, 'Stage 3 of 3');
  }
  assert.deepEqual(errors, []);
  w.close();
});

test('keyboard tab navigation, card search and pagination preserve access to evidence', () => {
  const { w, d, errors } = load();
  d.getElementById('tab-story').dispatchEvent(new w.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  assert.equal(d.activeElement.id, 'tab-paper');
  assert.equal(d.getElementById('panel-paper').hidden, false);
  d.getElementById('tab-paper').dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  assert.equal(d.activeElement.id, 'tab-cards');
  assert.equal(d.getElementById('card-count').textContent, '13 cards');
  change(w, d.getElementById('card-kind'), '');
  assert.equal(d.getElementById('card-count').textContent, '331 cards');
  assert.equal(d.getElementById('cards-page').textContent, 'Page 1 of 19');
  d.getElementById('cards-next').click();
  assert.equal(d.getElementById('cards-page').textContent, 'Page 2 of 19');
  change(w, d.getElementById('card-search'), 'Knowledge Monopoly', 'input');
  assert.ok(d.querySelectorAll('.concept-card').length > 0);
  assert.ok(d.querySelectorAll('.concept-card').length < 18);
  change(w, d.getElementById('card-search'), 'no-such-ontology-concept-987', 'input');
  assert.equal(d.getElementById('card-count').textContent, '0 cards');
  assert.match(d.getElementById('cards').textContent, /No matching cards/);
  assert.deepEqual(errors, []);
  w.close();
});

test('all guided readings, graph selection, filters and scoped cards work with local D3', async () => {
  const { w, d, errors } = load('', true);
  d.getElementById('story-to-graph').click();
  await w.ensureGraph();
  assert.equal(d.querySelectorAll('[data-reading]').length, 7);
  for (const button of d.querySelectorAll('[data-reading]')) {
    button.click();
    const view = w.visibleData();
    assert.ok(view.nodes.length > 0, button.dataset.reading);
    assert.ok(view.edges.length > 0, button.dataset.reading);
    assert.equal(d.querySelectorAll('.graph-node').length, view.nodes.length);
    assert.equal(d.querySelectorAll('.edge-line').length, view.edges.length);
    assert.ok(view.edges.every(e => view.nodes.some(n => n.id === e.source) && view.nodes.some(n => n.id === e.target)));
  }
  d.querySelector('.graph-node').dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert.match(d.getElementById('inspector').textContent, /Provenance/);
  assert.ok(w.location.hash);
  change(w, d.getElementById('search'), 'unfindable-concept-456', 'input');
  assert.equal(w.visibleData().nodes.length, 0);
  assert.match(d.getElementById('graph-empty').textContent, /No concepts match/);
  d.getElementById('reset-filters').click();
  const before = w.visibleData().edges.length;
  d.getElementById('evidence-only').checked = true;
  d.getElementById('evidence-only').dispatchEvent(new w.Event('change'));
  assert.ok(w.visibleData().edges.every(e => e.explicit !== false));
  assert.ok(w.visibleData().edges.length < before);
  d.getElementById('reset-filters').click();
  d.getElementById('reading-cards').click();
  assert.equal(d.getElementById('panel-cards').hidden, false);
  assert.equal(d.getElementById('card-scope').hidden, false);
  d.getElementById('clear-card-scope').click();
  assert.equal(d.getElementById('card-count').textContent, '331 cards');
  assert.deepEqual(errors, []);
  w.close();
});

test('existing deep-link forms retain their exact reading or node and query', () => {
  for (const [hash, expected] of [
    ['#paper', 'paper'], ['#cards', 'cards'], ['#story', 'story'],
    ['#scenario=handover-path', 'explorer'],
    ['#view=path%3Aknowledge-flow-cascade', 'explorer'],
    ['#node=individual%3ACOG-001_KnowledgeMonopoly', 'explorer']
  ]) {
    const { w, d, errors } = load(hash);
    assert.equal(d.getElementById('panel-' + expected).hidden, false, hash);
    assert.equal(w.location.search, '?retained=1');
    if (hash.startsWith('#node=')) assert.match(d.getElementById('inspector').textContent, /Knowledge Monopoly/);
    if (hash.startsWith('#scenario=')) assert.match(d.getElementById('inspector').textContent, /Handover and shared understanding/);
    assert.deepEqual(errors, []);
    w.close();
  }
});

test('data downloads retain the complete graph, added handover reading and credited cards', async () => {
  const { w, d, downloads, errors, copied } = load('#cards');
  d.getElementById('export-json').click();
  const exported = JSON.parse(await downloads[0].text());
  assert.equal(exported.nodes.length, 331);
  assert.equal(exported.edges.length, 750);
  assert.equal(exported.scenarios.length, 7);
  d.getElementById('export-csv').click();
  const csv = await downloads[1].text();
  assert.match(csv, /"id","name","kind","summary","provenance","source"/);
  assert.ok(csv.includes('Knowledge Monopoly'));
  assert.ok(csv.includes('source:paper'));
  assert.ok(csv.includes('Suárez'));
  d.getElementById('copy-link').click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(copied[0], canonical + '?retained=1#cards');
  assert.deepEqual(errors, []);
  w.close();
});

test('map-loading failure leaves the story, cards and credits usable', async () => {
  const { w, d, errors } = load();
  d.getElementById('tab-explorer').click();
  const loader = d.querySelector('script[src]');
  assert.equal(loader.getAttribute('src'), './vendor/d3.v7.9.0.min.js');
  loader.dispatchEvent(new w.Event('error'));
  await new Promise(resolve => setImmediate(resolve));
  assert.match(d.getElementById('graph-empty').textContent, /map library could not load/);
  assert.ok(d.getElementById('retry-graph'));
  d.getElementById('tab-cards').click();
  assert.equal(d.getElementById('card-count').textContent, '13 cards');
  d.getElementById('tab-paper').click();
  assert.equal(d.getElementById('panel-paper').hidden, false);
  assert.deepEqual(errors, []);
  w.close();
});

if (process.argv[2]) {
  test('built Social Debt app, illustration, provenance and local graph dependencies are complete and byte-identical', () => {
    const builtApp = path.resolve(process.argv[2], 'library/apps/social-debt-explorer');
    for (const file of [
      'index.html', 'assets/team-release-scene.jpg',
      'provenance/migration.json', 'provenance/original-readme.md', 'provenance/original-visual-notes.md',
      'vendor/d3.v7.9.0.min.js', 'vendor/D3-LICENSE'
    ]) {
      const published = path.join(builtApp, file);
      assert.ok(fs.existsSync(published), file + ': present in the built site');
      assert.ok(fs.readFileSync(published).equals(fs.readFileSync(path.join(app, file))), file + ': complete published bytes match the verified source');
    }
  });
}
