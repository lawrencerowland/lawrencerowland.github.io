'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('../tools/library-apps/node_modules/jsdom');
const dir = path.join(__dirname, '../library/apps/waste-route-capacity');
const M = require(path.join(dir, 'model.js'));
const scenario = overrides => ({...M.DEFAULTS, ...overrides});
const fast = overrides => scenario({horizon: 10, inbound: 10, charCap: 200, segCap: 200, sizeCap: 200,
  packCap: 200, assayCap: 200, transportCap: 200, storageCap: 1000, earlySeg: false,
  reworkBase: 0, ...overrides});
function near(a, b, tolerance = 1e-7) { assert.ok(Math.abs(a - b) <= tolerance, `${a} ≈ ${b}`); }
function invariant(r) {
  near(r.materialBalanceError, 0, Math.max(1e-7, r.arrivals * 1e-9));
  near(r.loadBalanceError, 0, Math.max(1e-7, r.arrivals * 1e-9));
  for (const h of r.history) {
    assert.ok(h.storage >= -1e-9 && h.storage <= r.params.storageCap + 1e-7);
    assert.ok(Object.values(h.queues).every(q => Number.isFinite(q) && q >= -1e-8));
    assert.ok(Number.isFinite(h.shipped) && h.shipped >= 0);
  }
  for (const key of M.WORK) assert.ok(r.flow[key] <= r.available[key] + 1e-7);
  assert.ok(Object.values(r.utilization).every(v => v === null || (v >= -1e-9 && v <= 1 + 1e-9)));
}
test('all fictional presets conserve material and once-expanded load, deterministic and stochastic', () => {
  for (const p of Object.values(M.PRESETS)) for (const random of [false, true]) invariant(M.simulate(p, random));
});
test('empty arrival with zero storage has no blocking, shipments, lead time or pressure winner', () => {
  const r = M.simulate(fast({inbound: 0, storageCap: 0}));
  assert.equal(r.blockedDays, 0); assert.equal(r.peakStorage, 0); assert.equal(r.shipped, 0);
  assert.equal(r.unfinished, 0); assert.equal(r.avgLead, null); assert.equal(r.unfinishedAge, null);
  assert.equal(Object.values(r.pressureDays).reduce((a, b) => a + b, 0), 0);
  invariant(r);
});
test('positive work with zero storage blocks assay even with available transport: no cross-docking', () => {
  const r = M.simulate(fast({storageCap: 0}));
  assert.equal(r.blockedDays, 10); assert.equal(r.shipped, 0); assert.equal(r.endQueues.assay, 100);
  assert.equal(r.avgLead, null); invariant(r);
});
test('several stages can execute on one day; storage peak is before transport, not day end', () => {
  const r = M.simulate(fast({horizon: 1, inbound: 7.5}));
  near(r.shipped, 7.5); near(r.avgLead, 0); near(r.peakStorage, 7.5); near(r.peakStorageEnd, 0);
  near(r.unfinished, 0); invariant(r);
});
test('clean release is a deterministic fractional split; disabling it does not imply later release', () => {
  const early = M.simulate(fast({horizon: 1, inbound: 10, earlySeg: true, cleanRelease: 25}));
  near(early.clean, 2.5); near(early.shipped, 7.5);
  const none = M.simulate(fast({horizon: 1, inbound: 10, earlySeg: false, cleanRelease: 90}));
  near(none.clean, 0); near(none.shipped, 10); invariant(early); invariant(none);
});
test('rework keeps original material and adds the packaging allowance only once', () => {
  const r = M.simulate(fast({horizon: 2, inbound: 10, reworkBase: 50, conservative: true,
    classInflation: 100, reworkReduction: 0}));
  // Day 1 passes 5 and returns 5. Day 2 packages 5 rework + 10 new, passes 7.5.
  near(r.shipped, 12.5); near(r.shippedLoad, 25); near(r.reworked, 12.5);
  near(r.allowanceAdded, 20); near(r.flow.pack, 25); near(r.endQueues.pack, 7.5);
  near(r.avgLead, 2.5 / 12.5); invariant(r);
});
test('extra packaging consumes downstream capacity in package units and honors entered upstream capacity', () => {
  const r = M.simulate(fast({horizon: 1, inbound: 10, conservative: true, classInflation: 100,
    reworkReduction: 0, assayCap: 10, transportCap: 10, storageCap: 10}));
  near(r.shipped, 5); near(r.shippedLoad, 10); near(r.endQueues.assay, 5); near(r.flow.pack, 10);
  const small = M.simulate(fast({horizon: 1, segCap: 1, earlySeg: true, cleanRelease: 0}));
  near(small.shipped, 1); invariant(r); invariant(small);
});
test('fractional FIFO consumes oldest queue entries and preserves origin on splits', () => {
  const q = new M.Queue(); q.push(2.5, 1); q.push(3, 2);
  assert.deepEqual(q.take(3), [{qty: 2.5, born: 1, packaged: false}, {qty: .5, born: 2, packaged: false}]);
  q.push(1, 1, true); // Older original arrival re-enters behind the existing queue.
  assert.deepEqual(q.take(3), [{qty: 2.5, born: 2, packaged: false}, {qty: .5, born: 1, packaged: true}]);
  near(q.qty, .5); near(q.load(2), 1);
  const r = M.simulate(fast({horizon: 3, transportCap: 5}));
  near(r.shipped, 15); near(r.avgLead, 2 / 3);
  assert.deepEqual(r.shipBatches.map(b => [b.born, b.day, b.qty]), [[1, 1, 5], [1, 2, 5], [2, 3, 5]]);
});
test('planned outages include the start day for exactly duration days; lead excludes unfinished material', () => {
  const r = M.simulate(fast({horizon: 5, assayOutageStart: 2, assayOutageDuration: 2, transportOutageStart: 4, transportOutageDuration: 1}));
  assert.deepEqual(r.history.map(h => h.assayCap), [200, 0, 0, 200, 200]);
  assert.deepEqual(r.history.map(h => h.transportCap), [200, 200, 200, 0, 200]);
  near(r.available.assay, 600); near(r.available.transport, 800); invariant(r);
  const stalled = M.simulate(fast({horizon: 5, transportCap: 1}));
  near(stalled.shipped, 5); near(stalled.avgLead, 2); near(stalled.unfinished, 45);
  assert.ok(stalled.unfinishedAge !== null); assert.equal(stalled.oldestAge, 4);
});
test('full storage blocks only days with prevented assay work, and transport frees space for next day', () => {
  const r = M.simulate(fast({horizon: 3, storageCap: 10, transportCap: 0}));
  assert.deepEqual(r.history.map(h => h.blocked), [false, true, true]);
  assert.equal(r.blockedDays, 2); near(r.peakStorage, 10);
  const emptyAssay = M.simulate(fast({horizon: 3, storageCap: 0, assayCap: 0}));
  assert.equal(emptyAssay.blockedDays, 0); assert.equal(emptyAssay.utilization.assay, null);
  const limited = M.simulate(fast({horizon: 2, storageCap: 5, transportCap: 200}));
  near(limited.shipped, 10); near(limited.endQueues.assay, 10); assert.equal(limited.blockedDays, 2);
});
test('seeded runs reproduce exactly, different seeds change stochastic arrivals and all values stay bounded', () => {
  const p = scenario({horizon: 40, seed: 123});
  assert.deepEqual(M.simulate(p, true), M.simulate(p, true));
  assert.notDeepEqual(M.simulate(p, true).history, M.simulate({...p, seed: 124}, true).history);
  for (let seed = 0; seed < 20; seed++) {
    const r = M.simulate(scenario({horizon: 30, seed, inboundCV: 100, reworkBase: 80, conservative: true, classInflation: 100}), true);
    invariant(r); assert.ok(r.history.every(h => h.arrivals <= 5 * r.params.inbound));
  }
});
test('certain random outages stay down and no-shipment stress summaries remain missing, not zero', () => {
  const r = M.simulate(fast({assayOutageProb: 100, transportOutageProb: 100, randomOutageDuration: 3}), true);
  assert.ok(r.history.every(h => h.assayCap === 0 && h.transportCap === 0));
  assert.equal(r.shipped, 0); assert.equal(r.utilization.assay, null); invariant(r);
  const s = M.stressSummary([r, r]);
  assert.equal(s.leadRuns, 0); assert.deepEqual(s.lead, [null, null, null]);
});
test('throughput percentiles state exceedance convention and do not conflate missing lead with zero', () => {
  const rows = [0, 10, 20, 30, 40].map((v, i) => ({shippedLoad: v, blockedDays: i, peakStorage: v, avgLead: i ? v : null}));
  const s = M.stressSummary(rows);
  assert.deepEqual(s.throughputExceedance, [20, 8, 2]); assert.equal(s.leadRuns, 4);
  assert.deepEqual(s.lead, [25, 34, 38.5]); assert.equal(s.blockedShare, .8);
  assert.equal(M.stressSeed(4294967295, 1), (4294967295 + 0x9E3779B9) >>> 0);
});
test('invalid, nonfinite, missing, fractional and out-of-bound values fail before simulation', () => {
  for (const key of Object.keys(M.LIMITS)) {
    for (const value of [NaN, Infinity, -Infinity, '', null, undefined, M.LIMITS[key][0] - 1, M.LIMITS[key][1] + 1]) {
      assert.throws(() => M.simulate(scenario({[key]: value})), new RegExp(key));
    }
    if (M.LIMITS[key][2]) assert.throws(() => M.simulate(scenario({[key]: M.LIMITS[key][0] + .5})), new RegExp(key));
  }
  assert.throws(() => M.validate({}), /horizon/);
  assert.throws(() => M.simulate(scenario({earlySeg: 'true'})), /earlySeg/);
  assert.throws(() => M.simulate(scenario({transportOutageDuration: 2, transportOutageStart: 0})), /start day/);
  assert.throws(() => M.validateStress(scenario({horizon: 730, stressRuns: 100})), /30,000/);
  assert.throws(() => M.simulate(scenario({}), true, NaN), /Seed/);
});
test('upper horizon and zero processing capacities remain bounded, conserved and diagnostic', () => {
  const p = scenario({horizon: 730, inbound: 200, charCap: 0, segCap: 0, sizeCap: 0, packCap: 0, assayCap: 0,
    transportCap: 0, storageCap: 0, inboundCV: 100});
  const r = M.simulate(p, true); invariant(r); assert.equal(r.history.length, 730);
  assert.equal(r.blockedDays, 0); assert.equal(r.pressureDays.char, 730); assert.equal(r.utilization.char, null);
});
test('pathological high-rework fractional tail stops at the explicit batch guard', () => {
  assert.throws(() => M.simulate(scenario({horizon: 730, inbound: .01, reworkBase: 80, earlySeg: false, conservative: true, classInflation: 100}), true), /too many fractional batches/);
});
function ui() {
  const dom = new JSDOM(fs.readFileSync(path.join(dir, 'index.html'), 'utf8'), {runScripts: 'outside-only', url: 'https://example.test/library/apps/waste-route-capacity/'});
  dom.window.eval(fs.readFileSync(path.join(dir, 'model.js'), 'utf8'));
  dom.window.eval(fs.readFileSync(path.join(dir, 'app.js'), 'utf8'));
  return dom;
}
function set(w, id, value) { const el = w.document.getElementById(id); el.value = value; el.dispatchEvent(new w.Event('input', {bubbles: true})); }
function submit(w) { w.document.getElementById('scenario').dispatchEvent(new w.Event('submit', {bubbles: true, cancelable: true})); }
async function waitFor(w, predicate) {
  for (let i = 0; i < 200; i++) { if (predicate()) return; await new Promise(resolve => w.setTimeout(resolve, 5)); }
  assert.fail('UI operation did not finish within bounded polling.');
}
test('actual UI initializes charts/table, accessible labels, navigation, canonical and static hazard home', () => {
  const dom = ui(), d = dom.window.document;
  assert.match(d.getElementById('status').textContent, /updated/); assert.equal(d.getElementById('dailyRows').children.length, 180);
  assert.equal(d.querySelectorAll('.chart svg').length, 5); assert.equal(d.querySelectorAll('#metrics .metric').length, 6);
  for (const el of d.querySelectorAll('input,select')) assert.ok(el.labels.length, el.id);
  assert.equal(d.querySelector('[rel=canonical]').href, 'https://lawrencerowland.github.io/library/apps/waste-route-capacity/');
  assert.ok(d.querySelector('noscript')); assert.ok(d.querySelector('a[href="/library/methods/delivery-dynamics.html"]'));
  assert.match(d.getElementById('state-space').textContent, /Inspection supplies evidence/);
  assert.match(d.getElementById('state-space').textContent, /chemical hazard, radiological intensity and structural integrity/);
  assert.equal(d.querySelectorAll('script[src^="http"]').length, 0);
  dom.window.close();
});
test('actual UI validates blank/invalid values without replacing results and resets every control', () => {
  const dom = ui(), w = dom.window, d = w.document, before = d.getElementById('metrics').innerHTML;
  set(w, 'horizon', ''); submit(w); assert.match(d.getElementById('error').textContent, /Horizon/); assert.equal(d.getElementById('metrics').innerHTML, before);
  assert.equal(d.activeElement.id, 'horizon');
  set(w, 'horizon', '1'); set(w, 'inbound', '0'); set(w, 'storageCap', '0'); submit(w);
  assert.equal(d.getElementById('error').textContent, ''); assert.equal(d.getElementById('dailyRows').children.length, 1);
  assert.match(d.getElementById('metrics').textContent, /Storage-blocked days0/);
  d.getElementById('preset').value = 'conservative'; d.getElementById('preset').dispatchEvent(new w.Event('change'));
  assert.equal(d.getElementById('conservative').checked, true);
  d.getElementById('resetBtn').click(); assert.equal(d.getElementById('conservative').checked, false); assert.equal(d.getElementById('horizon').value, '180');
  dom.window.close();
});
test('actual UI stress works, reproduces, cancels on edit, and rejects excess work', async () => {
  const dom = ui(), w = dom.window, d = w.document;
  set(w, 'horizon', '10'); set(w, 'stressRuns', '3');
  d.getElementById('stressBtn').click();
  await waitFor(w, () => d.getElementById('stressStatus').textContent.includes('complete:'));
  const before = d.getElementById('stressResults').textContent;
  assert.match(before, /exceedance/); assert.match(before, /contribute/);
  d.getElementById('stressBtn').click(); await waitFor(w, () => d.getElementById('stressStatus').textContent.includes('complete:'));
  assert.equal(d.getElementById('stressResults').textContent, before);
  d.getElementById('stressBtn').click(); set(w, 'inbound', '2');
  await new Promise(resolve => w.setTimeout(resolve, 20));
  assert.equal(d.getElementById('stressResults').textContent, ''); assert.match(d.getElementById('status').textContent, /previous run/);
  d.getElementById('stressBtn').click(); d.getElementById('cancelBtn').click();
  await new Promise(resolve => w.setTimeout(resolve, 20)); assert.match(d.getElementById('stressStatus').textContent, /cancelled/);
  set(w, 'horizon', '730'); set(w, 'stressRuns', '100'); d.getElementById('stressBtn').click();
  assert.match(d.getElementById('error').textContent, /30,000/); assert.equal(d.getElementById('stressBtn').disabled, false);
  dom.window.close();
});
