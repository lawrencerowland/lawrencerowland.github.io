'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..'), dir = path.join(root, 'library/apps/contract-portfolio-board');
const M = require(path.join(dir, 'model.js'));
const snapshot = board => M.serialize(board);
const ids = board => M.containers(board).flatMap(c => c.items);
function storage(initial = {}) { const data = new Map(Object.entries(initial)); return {data, getItem: key => data.has(key) ? data.get(key) : null, setItem: (key, value) => data.set(key, String(value))}; }

test('seed retains three contracts, Digital Strategy, four original artefacts and all ownership destinations', () => {
  const b = M.validate(M.initial());
  assert.equal(b.groups.filter(g => g.kind === 'contract').length, 3);
  assert.deepEqual(b.groups.map(g => g.kind), ['contract', 'contract', 'contract', 'context', 'internal', 'conops', 'unassigned']);
  assert.equal(b.groups[0].workstreams[0].name, 'Digital Strategy');
  assert.deepEqual(b.items.map(i => i.title), ['Project charter', 'Future state processes', 'Business requirements', 'Stakeholder analysis']);
  assert.deepEqual(ids(b), ['item1', 'item2', 'item3', 'item4']);
});
test('moving artefacts never deletes or duplicates them, and moving a workstream retains IDs, order, notes and review ticks', () => {
  const original = M.initial(), before = snapshot(original);
  let b = M.editItem(original, 'item1', 'Charter', 'Sponsor owns the decision.', true);
  b = M.moveItems(b, ['item2', 'item1'], 'stream1'); // Uses board order, not selection order.
  assert.deepEqual(M.destination(b, 'stream1').items, ['item1', 'item2']);
  b = M.moveItems(b, ['item2', 'item1'], 'stream1');
  assert.deepEqual(M.destination(b, 'stream1').items, ['item1', 'item2']);
  b = M.moveWorkstream(b, 'stream1', 'internal');
  assert.equal(M.locate(b, 'item1').group.kind, 'internal');
  assert.equal(b.items.find(i => i.id === 'item1').notes, 'Sponsor owns the decision.');
  assert.equal(b.items.find(i => i.id === 'item1').reviewed, true);
  assert.deepEqual(ids(b).sort(), ids(original).sort()); assert.equal(snapshot(original), before);
});
test('split moves chosen members into a sibling, preserving source order and allowing an explicitly empty original', () => {
  let b = M.moveItems(M.initial(), ['item1', 'item2', 'item3'], 'stream1');
  b = M.splitWorkstream(b, 'stream1', ['item3', 'item1'], 'Definition');
  assert.deepEqual(M.destination(b, 'stream1').items, ['item2']);
  assert.deepEqual(M.destination(b, 'stream2').items, ['item1', 'item3']);
  assert.deepEqual(b.groups[0].workstreams.map(s => s.id), ['stream1', 'stream2']);
  b = M.splitWorkstream(b, 'stream1', ['item2'], 'Sponsor');
  assert.deepEqual(M.destination(b, 'stream1').items, []);
  assert.equal(b.items.length, 4);
  assert.throws(() => M.splitWorkstream(b, 'stream2', ['item4'], 'Wrong'), /this workstream/);
  assert.throws(() => M.splitWorkstream(b, 'stream2', [], 'Empty'), /Select/);
});
test('reordering and renaming change presentation, not allocations; occupied workstreams cannot be deleted', () => {
  let b = M.moveItems(M.initial(), ['item1', 'item2'], 'stream1');
  b = M.reorderItem(b, 'item2', -1); assert.deepEqual(M.destination(b, 'stream1').items, ['item2', 'item1']);
  assert.equal(snapshot(M.reorderItem(b, 'item2', -1)), snapshot(b));
  b = M.addWorkstream(b, 'contract1', 'Delivery'); b = M.reorderWorkstream(b, 'stream2', -1);
  assert.deepEqual(b.groups[0].workstreams.map(s => s.id), ['stream2', 'stream1']);
  b = M.rename(b, 'contract1', 'Discovery package'); b = M.rename(b, 'stream1', 'Strategy');
  assert.equal(M.locate(b, 'item1').name, 'Discovery package / Strategy');
  assert.throws(() => M.removeWorkstream(b, 'stream1'), /Move the artefacts first/);
  b = M.removeWorkstream(b, 'stream2'); assert.equal(b.groups[0].workstreams.length, 1);
});
test('malformed imported boards are rejected atomically with no silent field or artefact loss', () => {
  const history = new M.History(M.initial()), before = snapshot(history.current);
  const invalid = [
    b => { b.items[0].id = b.items[1].id; },
    b => { b.groups[0].id = b.items[0].id; },
    b => { b.groups[0].items.push('item1'); },
    b => { b.groups[6].items.pop(); },
    b => { b.groups[6].items.push('missing'); },
    b => { b.groups[0].kind = 'conops'; },
    b => { b.items[0].reviewed = 'yes'; },
    b => { b.items[0].title = ''; },
    b => { b.items[0].notes = 'x'.repeat(4001); },
    b => { b.items[0].notes = null; },
    b => { b.items[0].other = 'must not disappear'; },
    b => { b.version = 2; },
    b => { b.groups[6].workstreams.push({id:'stream2', name:'Wrong home', items:[]}); }
  ];
  for (const corrupt of invalid) { const b = M.initial(); corrupt(b); assert.throws(() => history.commit(M.parse(JSON.stringify(b)))); assert.equal(snapshot(history.current), before); assert.equal(history.past.length, 0); }
  for (const source of ['null', '[]', '{bad', '', '{}']) assert.throws(() => M.parse(source));
});
test('invalid edits and destination choices leave their input untouched', () => {
  const b = M.initial(), before = snapshot(b);
  for (const operation of [() => M.addItem(b, ' '), () => M.moveItems(b, ['item1'], 'missing'), () => M.moveItems(b, ['item1', 'item1'], 'contract1'), () => M.moveWorkstream(b, 'stream1', 'unassigned'), () => M.addWorkstream(b, 'unassigned', 'Hidden'), () => M.reorderItem(b, 'item1', 7), () => M.removeItems(b, ['missing'])]) { assert.throws(operation); assert.equal(snapshot(b), before); }
});
test('empty boards, duplicate titles, Unicode and literal markup round-trip without reinterpretation', () => {
  let b = M.removeItems(M.initial(), ['item1', 'item2', 'item3', 'item4']);
  assert.equal(M.parse(snapshot(b)).items.length, 0);
  for (let i = 0; i < 2; i++) b = M.addItem(b, '<img src=x onerror=alert(1)> Å & 測試', 'Line 1\n"quoted", <script>bad()</script>', 'conops');
  assert.equal(new Set(b.items.map(i => i.id)).size, 2); assert.deepEqual(M.parse(snapshot(b)), b);
  assert.equal(M.matches(b, b.items[0], '測試'), true); assert.equal(M.matches(b, b.items[0], 'operations'), true);
  assert.equal(M.matches(b, b.items[0], '', 'yes'), false);
});
test('bounded files remain self-importable and excessive counts or Unicode byte sizes are rejected', () => {
  const b = M.initial();
  for (let i = 5; i <= 300; i++) { b.items.push({id:'item'+i, title:'Artefact '+i, notes:'', reviewed:false}); b.groups[6].items.push('item'+i); }
  assert.equal(M.parse(snapshot(b)).items.length, 300);
  assert.throws(() => M.addItem(b, 'One too many'), /300/);
  const large = M.clone(b); large.items.forEach(item => { item.notes = '測'.repeat(4000); }); assert.throws(() => M.validate(large), /1.5 MB/);
  assert.throws(() => M.parse(' '.repeat(M.MAX_BYTES + 1)), /1.5 MB/);
});
test('undo/redo restores split, move, delete, import and reset state; a new branch drops only redo', () => {
  const h = new M.History(M.initial()), stages = [snapshot(h.current)];
  for (const next of [b => M.moveItems(b, ['item1', 'item2'], 'stream1'), b => M.splitWorkstream(b, 'stream1', ['item2'], 'Second'), b => M.removeItems(b, ['item3']), b => M.setTitle(b, 'Imported shape'), () => M.initial()]) { h.commit(next(h.current)); stages.push(snapshot(h.current)); }
  for (let i = stages.length - 2; i >= 0; i--) { assert.equal(h.undo(), true); assert.equal(snapshot(h.current), stages[i]); }
  assert.equal(h.undo(), false);
  for (let i = 1; i < stages.length; i++) { h.redo(); assert.equal(snapshot(h.current), stages[i]); }
  h.undo(); h.undo(); h.commit(M.setTitle(h.current, 'New branch')); assert.equal(h.future.length, 0); h.undo(); assert.equal(snapshot(h.current), stages[3]);
});
test('storage touches only its own key, reopens exact state and preserves corrupt or inaccessible saves', () => {
  const s = storage({'date-defence-kit':'do not touch', 'other-app':'keep'}), b = M.moveItems(M.initial(), ['item1'], 'context');
  assert.equal(M.load(s), null); M.save(s, b, '2026-10-02T12:00:00.000Z'); assert.deepEqual(M.load(s).board, b);
  assert.equal(s.getItem('date-defence-kit'), 'do not touch'); assert.equal(s.getItem('other-app'), 'keep');
  s.setItem(M.STORAGE_KEY, '{broken'); assert.throws(() => M.load(s), /not readable/); assert.equal(s.getItem(M.STORAGE_KEY), '{broken');
  assert.throws(() => M.save({setItem(){throw Error('Quota exceeded');}}, b), /Quota/);
  assert.throws(() => M.load({getItem(){throw Error('Unavailable');}}), /Unavailable/);
});

// Exercise the actual DOM handlers without claiming a rendered-browser or file-system save check.
const {JSDOM} = require(path.join(root, 'tools/library-apps/node_modules/jsdom'));
function ui(local = storage()) {
  const dom = new JSDOM(fs.readFileSync(path.join(dir, 'index.html'), 'utf8'), {runScripts:'outside-only', url:'https://example.test/library/apps/contract-portfolio-board/'});
  const w = dom.window, d = w.document;
  w.HTMLDialogElement.prototype.showModal = function(){this.setAttribute('open','');};
  w.HTMLDialogElement.prototype.close = function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
  Object.defineProperty(w, 'localStorage', {value:local});
  w.eval(fs.readFileSync(path.join(dir, 'model.js'), 'utf8')); w.eval(fs.readFileSync(path.join(dir, 'app.js'), 'utf8'));
  const click = id => d.getElementById(id).click(), value = (id, text) => {d.getElementById(id).value = text;}, change = (node, type='change') => node.dispatchEvent(new w.Event(type, {bubbles:true}));
  const submit = () => d.getElementById('editor-form').dispatchEvent(new w.Event('submit', {bubbles:true,cancelable:true}));
  const select = id => {const checkbox = d.querySelector('[data-focus="select-'+id+'"]'); checkbox.checked = true; change(checkbox);};
  const current = () => { click('export'); const result = M.parse(d.getElementById('json').value); click('close-transfer'); return result; };
  return {dom,w,d,click,value,change,submit,select,current,local};
}
test('actual UI selects without deletion, places an item, edits literal text and review tick, and clears selection on filtering', () => {
  const u = ui(); try {
    u.select('item1'); assert.equal(u.current().items.length, 4);
    u.value('destination', 'stream1'); u.click('move-selected'); assert.equal(M.locate(u.current(), 'item1').id, 'stream1');
    u.click('edit-selected'); u.value('edit-name', '<img src=x onerror=alert(1)>'); u.value('edit-notes', 'Retain sponsor decision'); u.d.getElementById('edit-reviewed').checked = true; u.submit();
    assert.equal(u.current().items[0].reviewed, true); assert.equal(u.d.querySelectorAll('.card img').length, 0);
    u.value('filter', 'no match'); u.change(u.d.getElementById('filter'), 'input'); assert.equal(u.d.getElementById('move-selected').disabled, true); assert.match(u.d.getElementById('counts').textContent, /0 of 4/);
    u.click('clear-filter'); assert.equal(u.d.querySelectorAll('.card').length, 4);
  } finally {u.dom.window.close();}
});
test('actual UI workstream split and move retain content; cancel never mutates and repeated undo/redo works', () => {
  const u = ui(); try {
    u.select('item1'); u.select('item2'); u.value('destination','stream1'); u.click('move-selected');
    u.d.querySelector('[data-focus="split-stream1"]').click(); u.value('edit-name','Delivery');
    u.d.querySelector('input[name="split-item"][value="item1"]').checked = false; u.submit();
    assert.deepEqual(M.destination(u.current(),'stream2').items,['item2']);
    u.d.querySelector('[data-focus="edit-stream2"]').click(); u.value('edit-name','Operations'); u.value('edit-target','conops'); u.submit();
    assert.equal(M.locate(u.current(),'item2').group.kind,'conops');
    const before = snapshot(u.current()); u.click('add-item'); u.value('edit-name','Cancelled'); u.click('editor-cancel'); assert.equal(snapshot(u.current()),before);
    u.click('undo'); u.click('undo'); assert.deepEqual(M.destination(u.current(),'stream1').items,['item1','item2']);
    u.click('redo'); u.click('redo'); assert.equal(snapshot(u.current()),before);
  } finally {u.dom.window.close();}
});
test('actual UI failed import stays editable, correction replaces atomically, undo restores and saved plan reopens', () => {
  const local = storage({'unrelated':'untouched'}), u = ui(local); try {
    const original = snapshot(u.current()); u.click('save'); const saved = local.getItem(M.STORAGE_KEY);
    u.click('import'); u.value('json','{"bad":true}'); u.click('apply-import');
    assert.ok(u.d.getElementById('transfer').open); assert.ok(u.d.getElementById('transfer-error').textContent); assert.equal(local.getItem(M.STORAGE_KEY),saved);
    const repaired = M.moveItems(M.initial(),['item3'],'internal'); repaired.title='Corrected import'; u.value('json',snapshot(repaired)); u.click('apply-import');
    assert.equal(snapshot(u.current()),snapshot(repaired)); assert.equal(local.getItem(M.STORAGE_KEY),saved);
    u.click('undo'); assert.equal(snapshot(u.current()),original); u.click('redo'); u.click('save');
    u.click('reset'); assert.equal(snapshot(u.current()),original); u.click('undo'); assert.equal(snapshot(u.current()),snapshot(repaired));
    const reopened=ui(local); try {assert.equal(snapshot(reopened.current()),snapshot(repaired)); assert.match(reopened.d.getElementById('status').textContent,/reopened/);} finally {reopened.dom.window.close();}
    assert.equal(local.getItem('unrelated'),'untouched');
  } finally {u.dom.window.close();}
});
test('actual UI returns keyboard focus after an editor rebuild and does not keep filtered-out artefacts selected', () => {
  const u=ui();try {
    u.select('item1');u.value('destination','stream1');u.click('move-selected');
    const trigger=u.d.querySelector('[data-focus="edit-stream1"]');trigger.focus();trigger.click();u.value('edit-name','Renamed strategy');u.submit();
    assert.equal(u.d.activeElement.dataset.focus,'edit-stream1');
    u.value('filter','Renamed strategy');u.change(u.d.getElementById('filter'),'input');u.select('item1');u.value('destination','internal');u.click('move-selected');
    assert.equal(u.d.getElementById('move-selected').disabled,true);assert.match(u.d.getElementById('selection-status').textContent,/No artefacts/);
  }finally{u.dom.window.close();}
});
test('actual UI reports unavailable/corrupt storage, retains working board and never claims a failed save succeeded', () => {
  for (const local of [storage({[M.STORAGE_KEY]:'bad'}), {getItem(){throw Error('Blocked');}, setItem(){throw Error('Blocked');}}]) {
    const u = ui(local); try {assert.match(u.d.getElementById('error').textContent,/not been changed/); assert.equal(u.current().items.length,4);} finally {u.dom.window.close();}
  }
  const local=storage(), u=ui(local); try {u.click('save'); u.select('item1'); u.value('destination','context');u.click('move-selected');local.setItem=()=>{throw Error('Quota exceeded');};u.click('save');assert.match(u.d.getElementById('error').textContent,/Quota/);assert.match(u.d.getElementById('save-status').textContent,/Changes since/);assert.equal(M.locate(u.current(),'item1').id,'context');} finally {u.dom.window.close();}
});
test('navigation, source note, noscript and all local resources are present; dynamic text is not HTML', () => {
  const html=fs.readFileSync(path.join(dir,'index.html'),'utf8'), app=fs.readFileSync(path.join(dir,'app.js'),'utf8');
  assert.match(html,/href="\/library.html"/);assert.match(html,/\/library\/methods\/states-and-relationships.html/);assert.match(html,/rel="canonical"/);assert.match(html,/<noscript>/);assert.match(html,/README.md/);assert.ok(!app.includes('innerHTML'));
  for(const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css|md))"/g)) if(!/^https?:|^\//.test(match[1])) assert.ok(fs.existsSync(path.join(dir,match[1])),match[1]);
});
