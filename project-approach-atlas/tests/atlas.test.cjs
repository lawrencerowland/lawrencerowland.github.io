const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const api = require('../app.js');
const root = path.resolve(__dirname, '..');
const historyBytes = fs.readFileSync(path.join(root, 'history.json'));
const history = JSON.parse(historyBytes);
const methods = JSON.parse(fs.readFileSync(path.join(root, 'methods.json'), 'utf8'));
const data = { methods, history };
const expectedIds = ['kg-gt', 'petri-sched', 'smc-wiring', 'sheaf-wbs', 'rl-powell', 'mcd', 'handover-compile', 'ontology-refuge', 'monism-critique', 'interface-geometry', 'wbs-task-state'];
const fresh = () => api.initialState();
const clone = value => JSON.parse(JSON.stringify(value));

// DOM boundary double only; actual layout, focus visibility and native details are browser checks.
class Element {
  constructor(tag, document) { this.tagName = tag.toUpperCase(); this.document = document; this.children = []; this.attributes = {}; this.listeners = {}; this.style = {}; this.value = ''; this.hidden = false; }
  set textContent(value) { this.content = String(value); this.children = []; }
  get textContent() { return (this.content || '') + this.children.map(child => child.textContent).join(' '); }
  append(...children) { for (const child of children) { child.parentElement = this; this.children.push(child); } }
  replaceChildren(...children) { this.children.forEach(child => { child.parentElement = null; }); this.children = []; this.content = ''; this.append(...children); }
  setAttribute(key, value) { this.attributes[key] = String(value); }
  getAttribute(key) { return this.attributes[key] ?? null; }
  addEventListener(name, callback) { (this.listeners[name] ||= []).push(callback); }
  dispatch(name, event = {}) { for (const fn of this.listeners[name] || []) fn({ target: this, ...event }); }
  focus() { this.document.activeElement = this; }
  scrollIntoView() { this.scrolled = true; }
  closest(selector) { for (let node = this; node; node = node.parentElement) if ((selector === 'label' && node.tagName === 'LABEL') || (selector === '[data-view-control]' && node.getAttribute('data-view-control') !== null)) return node; return null; }
  set innerHTML(value) { throw new Error('Metadata must never be interpreted as HTML.'); }
}
const descendants = node => [node, ...node.children.flatMap(descendants)];
function documentDouble() {
  const document = { listeners: {}, activeElement: null };
  const ids = ['q', 'family', 'mode', 'view', 'tab', 'status', 'minExec', 'minExecVal', 'reset', 'showing', 'cardsView', 'mapView', 'map', 'mapList', 'legacyControls', 'legacyNotice', 'tryPetri'];
  document.createElement = tag => new Element(tag, document);
  document.elements = Object.fromEntries(ids.map(id => { const node = document.createElement(['mode', 'view', 'tab', 'status'].includes(id) ? 'select' : ['q', 'minExec'].includes(id) ? 'input' : ['reset', 'tryPetri'].includes(id) ? 'button' : 'div'); node.id = id; return [id, node]; }));
  document.getElementById = id => Object.values(document.elements).flatMap(descendants).find(node => node.id === id) || null;
  document.addEventListener = (name, callback) => { (document.listeners[name] ||= []).push(callback); };
  document.dispatch = (name, event) => { for (const callback of document.listeners[name] || []) callback(event); };
  document.viewLabel = document.createElement('label'); document.viewLabel.append(document.elements.view);
  return document;
}
function environment(hash = '') {
  return { location: { hash, reload() { this.reloaded = true; } }, history: { replaceState(_a, _b, hash) { this.hash = hash; } }, listeners: {}, addEventListener(name, fn) { this.listeners[name] = fn; } };
}
const fetchData = async url => ({ ok: true, json: async () => url === 'methods.json' ? methods : history });
async function mounted(hash = '', fetcher = fetchData) {
  const document = documentDouble(); const env = environment(hash); const app = api.mount(document, fetcher, env); await app.ready; return { document, e: document.elements, env, app };
}
function event(target, key, extra = {}) { return { target, key, preventDefault() { this.prevented = true; }, ...extra }; }
function assertHistoryContent(card, record) {
  for (const key of ['id', 'family', 'title', 'premise', 'why', 'nextProbe', 'tab', 'status']) assert.ok(card.textContent.includes(record[key]), record.id + ': ' + key);
  for (const text of [...record.signals, ...record.failureModes]) assert.ok(card.textContent.includes(text), record.id + ': ' + text);
  for (const [key, label] of [['rigor', 'Rigor'], ['legibility', 'Legibility'], ['buildability', 'Buildability']]) assert.ok(card.textContent.includes(label + ': ' + record[key] + '/10'));
}

test('all eleven original records and ten families are preserved byte for byte', () => {
  assert.equal(crypto.createHash('sha256').update(historyBytes).digest('hex'), '4b38ad5ab288798ba75290acd180a8e72e4d6ce70e7d148b4aa62c006aa06b38');
  assert.deepEqual(history.map(record => record.id), expectedIds);
  assert.equal(new Set(history.map(record => record.family)).size, 10);
  assert.equal(api.validateData(methods, history).methods.length, 11);
  assert.deepEqual([...methods.map(record => record.originalId)].sort(), [...expectedIds].sort());
  assert.ok(methods.every(record => record.sources.length && record.correction));
});

test('data validation rejects missing/duplicate identities, score leakage and unsafe source links', () => {
  assert.throws(() => api.validateData(methods.slice(1), history));
  const duplicate = clone(methods); duplicate[0].originalId = duplicate[1].originalId; assert.throws(() => api.validateData(duplicate, history));
  const scores = clone(methods); scores[0].rigor = 9; assert.throws(() => api.validateData(scores, history), /ratings/);
  const family = clone(methods); family[0].family = 'Other'; assert.throws(() => api.validateData(family, history), /families/);
  const badSource = clone(methods); badSource[0].sources[0].url = 'javascript:alert(1)'; assert.throws(() => api.validateData(badSource, history), /sources/);
  assert.equal(api.safeUrl('data:text/html,hello'), null);
});

test('reviewed filters ignore historical ratings; earlier filters retain their original meaning', () => {
  const before = JSON.stringify(data);
  assert.equal(api.filterRecords(data, { ...fresh(), status: 'bad', tab: 'shelve', minExec: 10 }).length, 11);
  const legacy = { ...fresh(), mode: 'earlier', minExec: 8 };
  assert.deepEqual(api.filterRecords(data, legacy).map(api.recordId), ['kg-gt', 'handover-compile', 'interface-geometry']);
  // High buildability cannot pass a high legibility threshold.
  assert.equal(api.filterRecords(data, legacy).some(record => record.id === 'monism-critique'), false);
  assert.deepEqual(api.filterRecords(data, { ...fresh(), mode: 'earlier', families: ['Category Theory'], tab: 'try', status: 'warn', minExec: 5 }).map(api.recordId), ['wbs-task-state']);
  assert.equal(api.filterRecords(data, { ...fresh(), families: ['Category Theory'] }).length, 2);
  const method = methods.find(record => record.originalId === 'petri-sched');
  for (const query of [method.correction, method.nextProbe, method.sources[0].role, method.sources[0].url]) assert.ok(api.filterRecords(data, { ...fresh(), query }).some(record => record.originalId === 'petri-sched'));
  assert.equal(JSON.stringify(data), before);
});

test('switching mode clears incompatible scores, map and point selection; reset keeps the chosen edition', () => {
  const changed = api.changeMode({ ...fresh(), query: 'lanes', families: ['Petri Nets'], mode: 'earlier', view: 'map', tab: 'now', status: 'good', minExec: 9, selectedIds: ['kg-gt'] }, 'reviewed');
  assert.equal(changed.query, 'lanes'); assert.deepEqual(changed.families, ['Petri Nets']);
  assert.equal(changed.view, 'cards'); assert.equal(changed.tab, 'all'); assert.equal(changed.status, 'all'); assert.equal(changed.minExec, 0); assert.equal(changed.selectedIds, null);
  assert.deepEqual(api.resetState({ ...changed, mode: 'earlier' }), { ...fresh(), mode: 'earlier' });
});

test('map preserves x=legibility/y=rigor and groups all overlapping records', () => {
  const groups = api.mapGroups(history);
  assert.equal(groups.length, 8);
  assert.deepEqual(groups.find(group => group.x === 8 && group.y === 6).records.map(record => record.id), ['kg-gt', 'interface-geometry']);
  assert.deepEqual(groups.find(group => group.x === 5 && group.y === 7).records.map(record => record.id), ['rl-powell', 'monism-critique']);
  assert.deepEqual(groups.find(group => group.x === 6 && group.y === 8).records.map(record => record.id), ['petri-sched', 'mcd']);
  assert.equal(groups.reduce((sum, group) => sum + group.records.length, 0), 11);
});

test('keyboard shortcuts ignore every editor and modifiers; typing r or slash leaves filters intact', async () => {
  const { document, e } = await mounted();
  e.q.value = 'Petri'; e.q.dispatch('input');
  for (const key of ['r', '/']) for (const target of [e.q, e.mode, e.family.children[0].children[0], document.createElement('textarea')]) {
    const ev = event(target, key); document.dispatch('keydown', ev); assert.equal(ev.prevented, undefined); assert.equal(e.q.value, 'Petri');
  }
  const editable = document.createElement('div'); editable.setAttribute('contenteditable', ''); const child = document.createElement('span'); editable.append(child);
  assert.equal(api.shortcut(event(child, 'r')), null);
  assert.equal(api.shortcut(event(child, '/')), null);
  for (const modifier of ['ctrlKey', 'metaKey', 'altKey', 'shiftKey']) assert.equal(api.shortcut(event(document.createElement('div'), 'r', { [modifier]: true })), null);
  const slash = event(document.createElement('div'), '/'); document.dispatch('keydown', slash); assert.equal(document.activeElement, e.q); assert.equal(slash.prevented, true);
  const reset = event(document.createElement('div'), 'r'); document.dispatch('keydown', reset); assert.equal(e.q.value, ''); assert.equal(e.cardsView.children.length, 11);
});

test('all eleven deep links reveal and focus their current card; invalid hashes are harmless', async () => {
  for (const id of expectedIds) {
    const { document, app, e } = await mounted('#' + id);
    assert.equal(document.activeElement.id, id); assert.equal(document.activeElement.scrolled, true); assert.equal(e.cardsView.hidden, false); assert.equal(app.getState().mode, 'reviewed');
  }
  assert.equal(api.hashId('#%E0%A4%A', data), null); assert.equal(api.hashId('#unknown', data), null);
  const { e, env, document } = await mounted(); e.q.value = 'no match'; e.q.dispatch('input');
  env.location.hash = '#mcd'; env.listeners.hashchange(); assert.equal(e.q.value, ''); assert.equal(document.activeElement.id, 'mcd'); assert.equal(e.cardsView.children.length, 11);
});

test('rendering keeps reviewed evidence in native details and historical content intact', async () => {
  const { e, document } = await mounted();
  assert.equal(e.cardsView.children.length, 11); assert.equal(e.family.children.length, 10); assert.equal(document.viewLabel.hidden, true);
  assert.equal(e.legacyControls.hidden, true); assert.equal(e.mapView.hidden, true); assert.equal(e.map.children.length, 0);
  methods.forEach((record, index) => {
    const card = e.cardsView.children[index]; const nodes = descendants(card); const details = nodes.find(node => node.tagName === 'DETAILS');
    assert.equal(details.children[0].tagName, 'SUMMARY'); assert.equal(details.children[0].textContent, 'Evidence, limits & sources');
    assert.ok(details.textContent.includes(record.correction)); assert.ok(details.textContent.includes('What to look for'));
    for (const text of [...record.signals, ...record.failureModes]) assert.ok(details.textContent.includes(text));
    for (const source of record.sources) assert.ok(details.textContent.includes(source.title) && details.textContent.includes(source.role));
    assert.ok(card.children.some(node => node.textContent.includes(record.nextProbe) && node.tagName !== 'DETAILS'));
    assert.equal(card.textContent.includes('Rigor:'), false);
  });
  e.mode.value = 'earlier'; e.mode.dispatch('change');
  history.forEach((record, index) => assertHistoryContent(e.cardsView.children[index], record));
  assert.equal(document.viewLabel.hidden, false); assert.equal(e.legacyNotice.hidden, false); assert.equal(e.mapList.children.length, 11);
});

test('family and no-result counts update without replacing focus or accumulating messages', async () => {
  const { document, e } = await mounted(); const family = e.family.children.find(label => label.children[0].value === 'Category Theory').children[0]; family.focus(); family.checked = true; family.dispatch('change');
  assert.match(e.showing.textContent, /^2 of 11/); assert.equal(document.activeElement, family);
  e.q.focus(); e.q.value = 'unfindable-extraordinary-string';
  for (let i = 0; i < 4; i++) e.q.dispatch('input');
  assert.equal(e.cardsView.children.length, 1); assert.match(e.showing.textContent, /^0 of 11/); assert.equal(document.activeElement, e.q);
  e.reset.dispatch('click'); assert.equal(e.cardsView.children.length, 11); assert.ok(e.family.children.every(label => !label.children[0].checked)); assert.match(e.showing.textContent, /^11 of 11/); assert.equal(document.activeElement, e.q);
});

test('overlapping map button names all members and opens/focuses the corresponding cards', async () => {
  const { document, e, app } = await mounted(); e.mode.value = 'earlier'; e.mode.dispatch('change'); e.view.value = 'map'; e.view.dispatch('change');
  assert.equal(e.mapView.hidden, false); assert.equal(e.cardsView.hidden, true); assert.equal(e.map.children.length, 8);
  const point = e.map.children.find(node => node.style.left === '80%' && node.style.top === '40%');
  assert.equal(point.tagName, 'BUTTON'); assert.equal(point.type, 'button');
  for (const id of ['kg-gt', 'interface-geometry']) assert.ok(point.getAttribute('aria-label').includes(history.find(record => record.id === id).title));
  point.dispatch('click'); assert.equal(app.getState().view, 'cards'); assert.deepEqual(e.cardsView.children.map(node => node.id), ['kg-gt', 'interface-geometry']); assert.equal(document.activeElement.id, 'kg-gt'); assert.match(e.showing.textContent, /^2 of 11/);
  e.reset.dispatch('click'); assert.equal(e.cardsView.children.length, 11);
  e.view.value = 'map'; e.view.dispatch('change'); e.mapList.children[1].children[0].dispatch('click'); assert.equal(document.activeElement.id, 'petri-sched'); assert.equal(e.cardsView.children.length, 1);
});

test('the shared-resource action escapes earlier filters and opens the reviewed Petri entry', async () => {
  const { e, env, document, app } = await mounted(); e.mode.value = 'earlier'; e.mode.dispatch('change'); e.status.value = 'bad'; e.status.dispatch('change'); e.tryPetri.dispatch('click');
  assert.equal(app.getState().mode, 'reviewed'); assert.equal(e.status.value, 'all'); assert.equal(e.cardsView.children.length, 11); assert.equal(document.activeElement.id, 'petri-sched'); assert.equal(env.history.hash, '#petri-sched');
});

test('failed requests or invalid data show one recoverable error and source records', async () => {
  const failures = [async () => ({ ok: false, status: 404 }), async () => { throw new Error('offline'); }, async () => ({ ok: true, json: async () => { throw new Error('bad JSON'); } }), async () => ({ ok: true, json: async () => [] })];
  for (const fetcher of failures) {
    const { e, env, app } = await mounted('', fetcher); assert.equal(await app.ready, false); assert.equal(e.showing.textContent, 'Atlas unavailable'); assert.equal(e.cardsView.children.length, 1); assert.equal(e.cardsView.getAttribute('aria-busy'), 'false');
    const nodes = descendants(e.cardsView); assert.deepEqual(nodes.filter(node => node.tagName === 'A').map(node => node.href), ['methods.json', 'history.json']);
    nodes.find(node => node.tagName === 'BUTTON').dispatch('click'); assert.equal(env.location.reloaded, true);
  }
});

test('source content is rendered as literal text, never markup', async () => {
  const hostile = clone(methods); hostile[0].premise = '<img src=x onerror=alert(1)>'; hostile[0].sources[0].title = '<script>bad()</script>';
  const { e } = await mounted('', async url => ({ ok: true, json: async () => url === 'methods.json' ? hostile : history }));
  assert.ok(e.cardsView.textContent.includes(hostile[0].premise)); assert.ok(e.cardsView.textContent.includes(hostile[0].sources[0].title));
  assert.equal(descendants(e.cardsView).some(node => ['SCRIPT', 'IMG'].includes(node.tagName)), false);
});

test('the shipped HTML exposes labelled controls, stable data routes and bounded earlier-map context', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const allIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(allIds).size, allIds.length, 'No duplicate page IDs');
  for (const id of Object.keys(documentDouble().elements)) assert.ok(allIds.includes(id), 'Required app hook: ' + id);
  for (const id of ['q', 'mode', 'view', 'tab', 'status', 'minExec']) {
    const label = [...html.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/g)].find(match => match[0].includes('id="' + id + '"'));
    assert.ok(label, 'Visible label wraps ' + id);
  }
  for (const id of ['tryPetri', 'reset']) assert.match(html, new RegExp('<button(?=[^>]*id="' + id + '")(?=[^>]*type="button")[^>]*>'));
  for (const id of ['legacyControls', 'legacyNotice', 'mapView']) assert.match(html, new RegExp('<[^>]+(?=[^>]*id="' + id + '")(?=[^>]*\\bhidden)[^>]*>'));
  assert.match(html, /<details[^>]*id="familyFilter"[^>]*>[\s\S]*<summary>Method families<\/summary>/);
  assert.match(html, /<div[^>]*id="family"[^>]*role="group"[^>]*aria-label="Method families"/);
  assert.match(html, /id="showing"[^>]*role="status"/);
  assert.match(html, /Horizontal: legibility\. Vertical: rigor\./);
  assert.match(html, /not a measured ranking or evidence of adoption/);
  for (const file of ['app.js', 'style.css', 'methods.json', 'history.json']) {
    assert.ok(html.includes('"' + file + '"'), 'HTML route for ' + file);
    assert.ok(fs.statSync(path.join(root, file)).isFile(), 'Shipped file ' + file);
  }
  assert.match(html, /<noscript>[\s\S]*href="methods\.json"[\s\S]*href="history\.json"[\s\S]*<\/noscript>/);
  for (const href of ['/side-projects.html', '/library.html']) assert.ok(html.includes('href="' + href + '"'), 'Estate return ' + href);
  assert.match(html, /https:\/\/github\.com\/lawrencerowland\/lawrencerowland\.github\.io\/tree\/(master|main)\/project-approach-atlas/);
});

test('several native family choices combine with OR, intersect other filters, and all unchecked restores every family', async () => {
  const { document, e, app } = await mounted();
  const choice = family => e.family.children.find(label => label.children[0].value === family).children[0];
  for (const label of e.family.children) { assert.equal(label.tagName, 'LABEL'); assert.equal(label.children[0].type, 'checkbox'); assert.equal(label.children[1].textContent, label.children[0].value); }
  const petri = choice('Petri Nets'), category = choice('Category Theory');
  petri.checked = true; petri.dispatch('change'); category.focus(); category.checked = true; category.dispatch('change');
  assert.deepEqual([...app.getState().families].sort(), ['Category Theory', 'Petri Nets']);
  assert.deepEqual(e.cardsView.children.map(node => node.id), ['petri-sched', 'smc-wiring', 'wbs-task-state']);
  assert.equal(document.activeElement, category); assert.match(e.showing.textContent, /^3 of 11/);
  e.mode.value = 'earlier'; e.mode.dispatch('change'); e.tab.value = 'try'; e.tab.dispatch('change');
  assert.deepEqual(e.cardsView.children.map(node => node.id), ['smc-wiring', 'wbs-task-state']);
  assert.equal(petri.checked, true); assert.equal(category.checked, true);
  e.tab.value = 'all'; e.tab.dispatch('change'); category.checked = false; category.dispatch('change');
  assert.deepEqual(e.cardsView.children.map(node => node.id), ['petri-sched']);
  petri.checked = false; petri.dispatch('change'); assert.equal(e.cardsView.children.length, 11); assert.deepEqual(app.getState().families, []);
  category.checked = true; category.dispatch('change'); e.reset.dispatch('click'); assert.equal(e.cardsView.children.length, 11); assert.ok(e.family.children.every(label => !label.children[0].checked));
});

test('reading a plotted entry and returning to the map retains the comparison filters', async () => {
  const { e, app } = await mounted(); e.mode.value = 'earlier'; e.mode.dispatch('change');
  const choice = e.family.children.find(label => label.children[0].value === 'Monotone Co-Design').children[0];
  choice.checked = true; choice.dispatch('change'); e.q.value = 'capacity'; e.q.dispatch('input'); e.tab.value = 'try'; e.tab.dispatch('change'); e.status.value = 'warn'; e.status.dispatch('change'); e.minExec.value = '6'; e.minExec.dispatch('input');
  e.view.value = 'map'; e.view.dispatch('change'); assert.equal(e.map.children.length, 1); e.map.children[0].dispatch('click');
  assert.deepEqual(e.cardsView.children.map(node => node.id), ['mcd']);
  e.view.value = 'map'; e.view.dispatch('change');
  assert.equal(e.map.children.length, 1); assert.equal(e.mapList.children.length, 1); assert.equal(app.getState().query, 'capacity');
  assert.deepEqual(app.getState().families, ['Monotone Co-Design']); assert.equal(app.getState().tab, 'try'); assert.equal(app.getState().status, 'warn'); assert.equal(app.getState().minExec, 6); assert.equal(app.getState().selectedIds, null);
});
