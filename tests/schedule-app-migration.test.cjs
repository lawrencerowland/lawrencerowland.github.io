const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = slug => fs.readFileSync(path.join(root, 'library/apps', slug, 'index.html'), 'utf8');
const models = {};
for (const [slug, name] of [['decision-latency', 'DecisionLatencyModel'], ['critical-path-spotter', 'CriticalPathModel'], ['wbs-to-pbs', 'BreakdownModel']]) {
  const html = read(slug);
  const context = vm.createContext({});
  vm.runInContext(html.match(/<script id="app-model">([\s\S]*?)<\/script>/)[1], context);
  models[slug] = context[name];
  test(`${slug}: executable scripts and self-contained Library route`, () => {
    for (const match of html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)) new vm.Script(match[1]);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /name="viewport"/);
    assert.match(html, /href="\/library.html"/);
    assert.match(html, /href="\/library\/methods\//);
    assert.doesNotMatch(html, /<script[^>]+src=/);
    assert.doesNotMatch(html, /Back to Card Index|【.*?】/);
  });
}
const plain = value => JSON.parse(JSON.stringify(value));
const C = models['critical-path-spotter'];
const fresh = () => plain(C.initialTasks);
test('CPM baseline has a 9-unit finish and B-D-F-G critical route', () => {
  const result = C.calculateSchedule(fresh());
  assert.equal(result.finish, 9);
  assert.deepEqual(plain(result.critical), ['B', 'D', 'F', 'G']);
  assert.equal(result.times.A.float, 1);
  assert.equal(result.times.C.float, 2);
  assert.equal(result.times.E.float, 2);
  assert.deepEqual(plain(result.criticalEdges), [['B', 'D'], ['D', 'F'], ['F', 'G']]);
});
test('CPM uses float before moving finish and marks tied critical branches', () => {
  const rows = fresh(); rows[0].duration += 1;
  const result = C.calculateSchedule(rows);
  assert.equal(result.finish, 9);
  assert.deepEqual(plain(result.critical), ['A', 'B', 'D', 'F', 'G']);
  rows[0].duration += 1;
  assert.equal(C.calculateSchedule(rows).finish, 10);
});
test('CPM critical delay moves finish and non-critical branch can become critical', () => {
  const rows = fresh(); rows[1].duration += 1;
  assert.equal(C.calculateSchedule(rows).finish, 10);
  const alternate = fresh(); alternate[2].duration += 3;
  const result = C.calculateSchedule(alternate);
  assert.equal(result.finish, 10);
  assert.deepEqual(plain(result.critical), ['A', 'C', 'E', 'G']);
});
test('CPM handles out-of-order rows, multiple sinks, decimals and zero milestones', () => {
  assert.equal(C.calculateSchedule(fresh().reverse()).finish, 9);
  const multi = C.calculateSchedule([{id:'a', duration:2, deps:[]}, {id:'b', duration:4, deps:[]}]);
  assert.equal(multi.times.a.float, 2);
  const zero = C.calculateSchedule([{id:'start', duration:0, deps:[]}, {id:'end', duration:0, deps:['start']}]);
  assert.equal(zero.finish, 0);
  assert.equal(zero.critical.length, 2);
  const fractional = C.calculateSchedule([{id:'x',duration:.1,deps:[]},{id:'y',duration:.2,deps:['x']}]);
  assert.equal(fractional.critical.length, 2);
});
test('CPM rejects empty, cyclic, missing, duplicate and invalid duration inputs', () => {
  assert.throws(() => C.calculateSchedule([]), /at least one/);
  assert.throws(() => C.calculateSchedule([{id:'A',duration:1,deps:['B']}]), /missing dependency/);
  assert.throws(() => C.calculateSchedule([{id:'A',duration:1,deps:['A']}]), /cycle/);
  assert.throws(() => C.calculateSchedule([{id:'A',duration:1,deps:['B']},{id:'B',duration:1,deps:['A']}]), /cycle/);
  assert.throws(() => C.calculateSchedule([{id:'A',duration:1,deps:[]},{id:'A',duration:1,deps:[]}]), /unique/);
  for (const duration of [-1, NaN, Infinity, '2']) assert.throws(() => C.calculateSchedule([{id:'A',duration,deps:[]}]), /non-negative/);
  assert.throws(() => C.calculateSchedule([{id:'A',duration:Number.MAX_VALUE,deps:[]},{id:'B',duration:Number.MAX_VALUE,deps:['A']}]), /numeric range/);
});
const L = models['decision-latency'];
test('Latency retains all eight tasks, five decisions and cross-links with 3-day mean', () => {
  assert.equal(L.tasks.length, 8); assert.equal(L.decisions.length, 5);
  const stats = L.validateData(L.tasks, L.decisions, L.taskToDecision);
  assert.equal(stats.mean, 3); assert.equal(stats.longest, 5);
  assert.equal(stats.end - stats.start, 27);
  assert.deepEqual(plain(L.associatedTasks('QA sign‑off')), ['Add interactivity', 'Testing & QA']);
  assert.deepEqual(plain(L.associatedTasks('unknown')), []);
});
test('Latency dates are UTC calendar boundaries and malformed data fails explicitly', () => {
  assert.equal(L.dayNumber('2025-03-31') - L.dayNumber('2025-03-30'), 1);
  for (const value of ['2025-02-29', '2025-13-01', '', '2025-1-1']) assert.throws(() => L.dayNumber(value), /date|Dates/);
  assert.throws(() => L.validateData([], L.decisions, {}), /at least one/);
  const rows = plain(L.tasks); rows[0].end = rows[0].start;
  assert.throws(() => L.validateData(rows, L.decisions, L.taskToDecision), /finish after/);
  assert.throws(() => L.validateData(L.tasks, L.decisions, {}), /known associated decision/);
  const decisions = plain(L.decisions); decisions[0].days = -1;
  assert.throws(() => L.validateData(L.tasks, decisions, L.taskToDecision), /non-negative/);
});
const W = models['wbs-to-pbs'];
test('Breakdown model exposes every work and product node exactly once', () => {
  const counts = W.validateData(W.sampleData);
  assert.equal(counts.workCount, Object.keys(W.workItems(W.sampleData)).length);
  assert.equal(counts.productCount, Object.keys(W.sampleData.deliverables).length);
  assert.equal(counts.workCount, 26);
  assert.equal(counts.productCount, 25);
});
test('Breakdown realization links include project root and distinct OOC products', () => {
  const links = W.linkRealization(W.sampleData);
  assert.deepEqual(plain(links.linkedProcesses[W.sampleData.project.id]), [W.sampleData.project.realizes]);
  assert.deepEqual(plain(links.linkedProcesses[':OOC_Foundations']), [':OOC_Foundations_Product']);
  assert.deepEqual(plain(links.linkedDeliverables[':OOC_Superstructure_Product']), [':OOC_Superstructure']);
  assert.equal(W.getItem(W.sampleData, ':OOC_Foundations_Product', 'product').percentComplete, undefined);
  assert.equal(W.getItem(W.sampleData, ':OOC_Foundations', 'work').percentComplete, 45);
  for (const product of [':Phase1_PreparedSites', ':Phase1_Design_Specification', ':Phase1_AcquiredLand']) {
    assert.equal(W.sampleData.deliverables[product].parent, ':Phase1_SupportingOutputs');
    assert.equal(links.linkedDeliverables[product].length, 1);
  }
});
test('Breakdown status mapping recognises construction, red and green labels', () => {
  for (const [status,tone] of [['Under Construction','blue'],['Red','red'],['Green','green'],['Delayed','red'],['Planning / Review','blue'],['Not Started','grey']]) assert.equal(W.statusTone(status), tone);
});
test('Breakdown model rejects identity collisions, hidden nodes, missing outputs and cycles', () => {
  const duplicate = plain(W.sampleData); duplicate.deliverables[':OOC_Foundations'] = {label:'Duplicate'};
  assert.throws(() => W.validateData(duplicate), /distinct IDs/);
  const hidden = plain(W.sampleData); hidden.deliverables['orphan'] = {label:'Invisible'};
  assert.throws(() => W.validateData(hidden), /unconnected/);
  const missing = plain(W.sampleData); missing.processes[':OOC_Foundations'].realizes = 'missing';
  assert.throws(() => W.validateData(missing), /Missing product/);
  const cycle = plain(W.sampleData); cycle.project.parent = ':HS2_Phase1_Process'; cycle.phases[':HS2_Phase1_Process'].children.push(cycle.project.id);
  assert.throws(() => W.validateData(cycle), /Cycle/);
});
