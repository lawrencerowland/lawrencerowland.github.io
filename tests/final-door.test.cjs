'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { test } = require('node:test');
const folder = path.resolve(__dirname, '../wider-interest/door-moisture-model');
const M = require(path.join(folder, 'model.js'));
const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-9, message || `${actual} != ${expected}`);

test('original default and hand-worked examples preserve the source arithmetic', () => {
  assert.deepEqual(M.defaults, { door: 12, jamb: 12, wall: 0.2, clearance: 3 });
  const r = M.calculate(M.defaults);
  close(r.gap, 2.7); close(r.doorMovement, 0); close(r.jambMovement, 0); close(r.wallMovement, .3);
  close(M.calculate(M.examples.dry).gap, 4.5);
  close(M.calculate(M.examples.wet).gap, -.9);
  assert.equal(M.calculate(M.examples.contact).gap, 0);
  assert.equal(M.calculate(M.examples.contact).status, 'contact');
});

test('moisture uses percentage points, with the source closing and opening directions', () => {
  const reference = { ...M.defaults, wall: 0 };
  close(M.calculate({ ...reference, door: 16 }).gap, 2);
  close(M.calculate({ ...reference, jamb: 17 }).gap, 2);
  close(M.calculate({ ...reference, wall: 1 }).gap, 1.5);
  close(M.calculate({ ...reference, door: 8, jamb: 7 }).gap, 5);
  close(M.calculate({ ...reference, clearance: 4 }).gap, 4);
});

test('independent integer budget agrees across 2,400 mixed settings', () => {
  // Convert slider ticks directly to micrometres. This oracle does not call model helpers.
  let count = 0;
  for (const d of [60, 61, 120, 153, 180, 199, 240, 280])
    for (const j of [60, 99, 120, 180, 221, 280])
      for (const w of [0, 1, 20, 33, 100])
        for (const c of [0, 1, 3, 7, 20, 30, 45, 66, 99, 100]) {
          const expectedMicrometres = 100 * c - 25 * (d - 120) - 20 * (j - 120) - 15 * w;
          const r = M.calculate({ door: d / 10, jamb: j / 10, wall: w / 100, clearance: c / 10 });
          close(r.gap, expectedMicrometres / 1000);
          assert.equal(r.status, expectedMicrometres > 0 ? 'gap' : expectedMicrometres < 0 ? 'overlap' : 'contact');
          close(r.extraClearance, Math.max(0, -expectedMicrometres / 1000));
          close(r.gap + r.doorMovement + r.jambMovement + r.wallMovement, c / 10);
          count++;
        }
  assert.equal(count, 2400);
});

test('all endpoint combinations stay inside the independently calculated global envelope', () => {
  const values = [];
  for (const door of [6, 28]) for (const jamb of [6, 28]) for (const wall of [0, 1]) for (const clearance of [0, 10]) {
    const gap = M.calculate({ door, jamb, wall, clearance }).gap;
    assert.ok(gap >= -8.7 - 1e-9 && gap <= 12.7 + 1e-9);
    values.push(gap);
  }
  close(Math.min(...values), -8.7); close(Math.max(...values), 12.7);
});

test('contact and near-contact do not misclassify rounded values', () => {
  const base = { ...M.defaults, door: 18, jamb: 18 };
  assert.equal(M.calculate(base).status, 'contact');
  assert.equal(M.calculate({ ...base, clearance: 3.0001 }).status, 'gap');
  assert.equal(M.calculate({ ...base, clearance: 2.9999 }).status, 'overlap');
  const zero = M.calculate({ door: 12, jamb: 12, wall: 0, clearance: 0 });
  assert.equal(zero.status, 'contact');
  assert.ok(!Object.is(zero.gap, -0));
});

test('sweep holds other inputs fixed and the inverse identifies first contact', () => {
  const state = { door: 13.7, jamb: 15.5, wall: .4, clearance: 4.8 };
  const original = { ...state };
  const curve = M.doorSweep(state);
  assert.equal(curve.length, 23);
  close(curve[0].gap, 5); close(curve.at(-1).gap, -.5);
  for (let i = 1; i < curve.length; i++) close(curve[i - 1].gap - curve[i].gap, .25);
  close(M.contactMoisture(state), 26);
  assert.equal(M.calculate({ ...state, door: 26 }).status, 'contact');
  close(M.contactMoisture(M.defaults), 22.8);
  assert.ok(M.contactMoisture({ ...M.defaults, clearance: 10 }) > 28);
  assert.ok(M.contactMoisture({ door: 12, jamb: 28, wall: 1, clearance: 0 }) < 6);
  assert.deepEqual(state, original);
});

test('rejects missing, non-numeric, non-finite and out-of-range values', () => {
  for (const invalid of [undefined, null, {}, { ...M.defaults, door: '12' }]) assert.throws(() => M.calculate(invalid), TypeError);
  for (const key of Object.keys(M.defaults)) {
    for (const value of [NaN, Infinity, -Infinity]) assert.throws(() => M.calculate({ ...M.defaults, [key]: value }), TypeError);
    for (const value of [M.limits[key][0] - .01, M.limits[key][1] + .01]) assert.throws(() => M.calculate({ ...M.defaults, [key]: value }), RangeError);
  }
  assert.ok(Object.isFrozen(M.defaults)); assert.ok(Object.isFrozen(M.assumptions));
});

test('public page retains four labelled source controls and states model limits', () => {
  const html = fs.readFileSync(path.join(folder, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(folder, 'app.js'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, 'No duplicate IDs');
  for (const key of Object.keys(M.defaults)) {
    assert.ok(html.includes(`for="${key}"`));
    assert.ok(html.includes(`id="${key}" type="range"`));
    assert.ok(html.includes(`id="${key}-value"`));
  }
  for (const match of app.matchAll(/byId\('([^']+)'\)/g)) assert.ok(ids.includes(match[1]), `Missing DOM element: ${match[1]}`);
  for (const match of html.matchAll(/aria-(?:describedby|labelledby)="([^"]+)"/g)) for (const id of match[1].split(' ')) assert.ok(ids.includes(id), `Broken accessible reference: ${id}`);
  assert.ok(html.includes('href="/wider-interest/"'));
  assert.ok(html.includes('aria-live="polite"'));
  assert.ok(html.includes('<noscript>'));
  assert.ok(html.includes('not measurements of a particular door'));
  assert.ok(html.includes('not this toy’s coefficients'));
  assert.ok(!/https?:\/\/[^"\s]+\.js/.test(html), 'No remote scripts');
  assert.ok(!/\/Users\/|0000 Vault|x-devonthink/.test(html + app));
  for (const file of ['style.css', 'model.js', 'app.js']) assert.ok(fs.existsSync(path.join(folder, file)));
});

if (process.argv[2]) test('built assets exactly match the tested source files', () => {
  const built = path.resolve(process.argv[2], 'wider-interest/door-moisture-model');
  for (const file of ['index.html', 'style.css', 'model.js', 'app.js']) {
    const hash = filePath => crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
    assert.equal(hash(path.join(built, file)), hash(path.join(folder, file)), file);
  }
});
