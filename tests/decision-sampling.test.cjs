const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const { treeData, enumerate, sample } = require('../examples/decision-sampling-model.js');

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-13, `${actual} should equal ${expected}`);
const leaf = (name, transitionProbability) => ({ name, description: `${name} detail`, transitionProbability });
const pair = { name: 'Root', children: [leaf('Same name', 1), leaf('Same name', 1)] };
function sequence(values) {
  let index = 0;
  const rng = () => {
    assert.ok(index < values.length, 'unexpected additional random draw');
    return values[index++];
  };
  rng.used = () => index;
  return rng;
}

test('retains every authored tree field from the prior HTML and exposes the browser API', () => {
  // JSON digest independently checked against root commit 5f678acf's treeData.
  assert.equal(createHash('sha256').update(JSON.stringify(treeData)).digest('hex'),
    'd6cfcfd16a100c2ca2d94960230d311b6899615e3bef8cd27f481349910e5973');
  const context = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../examples/decision-sampling-model.js'), 'utf8'), context);
  assert.equal(typeof context.DecisionSampling.sample, 'function');
  assert.equal(JSON.stringify(context.DecisionSampling.enumerate()), JSON.stringify(enumerate()));
});

test('exact leaf probabilities match independent products and conserve probability', () => {
  // 0.85 + 0.15 is 1; only the E/F and G/H unit-weight pairs require halves.
  const expected = { 'Solution A': 0.26775, 'Solution B': 0, 'Solution C': 0.08925,
    'Solution D': 0.063, 'Solution E': 0.09, 'Solution F': 0.09,
    'Solution G': 0.16, 'Solution H': 0.16, 'Solution I': 0.08 };
  const leaves = enumerate();
  assert.equal(leaves.length, 9);
  for (const item of leaves) close(item.probability, expected[item.name]);
  close(leaves.reduce((sum, item) => sum + item.probability, 0), 1);
  assert.equal(leaves.find(item => item.name === 'Solution B').probability, 0);
});

test('stable position IDs distinguish repeated labels and retain full path descriptions', () => {
  const leaves = enumerate();
  assert.equal(new Set(leaves.map(item => item.id)).size, 9);
  const a = leaves.find(item => item.name === 'Solution A');
  const i = leaves.find(item => item.name === 'Solution I');
  assert.deepEqual(a.path.map(item => item.id), ['r', 'r.0', 'r.0.0', 'r.0.0.0', 'r.0.0.0.0', 'r.0.0.0.0.0']);
  assert.equal(a.path[1].name, i.path[1].name);
  assert.notEqual(a.path[1].id, i.path[1].id);
  assert.equal(a.path[1].description, '< $10/user/month');
  assert.equal(i.path[1].description, '> $10/user/month');
  assert.equal(a.path.at(-1).description, a.description);
});

test('replays supplied draws down the original branches without name-based merging', () => {
  // A: five draws; F: three; I: three; D: four. Single-child steps still consume a draw.
  const rng = sequence([0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.8, 0.9, 0.9, 0.9, 0.2, 0.1, 0.1, 0.9, 0.2]);
  const result = sample(4, rng);
  assert.equal(rng.used(), 15);
  const chosen = enumerate().filter(item => result.counts[item.id]).map(item => item.name);
  assert.deepEqual(chosen, ['Solution A', 'Solution D', 'Solution F', 'Solution I']);
  assert.equal(result.total, 4);
  assert.equal(Object.values(result.counts).reduce((a, b) => a + b, 0), 4);
  assert.equal(result.mostFrequentId, 'r.0.0.0.0.0');
});

test('counts repeated-name leaves separately and breaks ties by declared order', () => {
  const result = sample(2, sequence([0.75, 0.25]), pair);
  assert.deepEqual(result, { counts: { 'r.0': 1, 'r.1': 1 }, total: 2, mostFrequentId: 'r.0' });
  assert.deepEqual(sample(0, () => { throw new Error('no draw expected'); }, pair),
    { counts: { 'r.0': 0, 'r.1': 0 }, total: 0, mostFrequentId: null });
});

test('zero-weight branches are never selected, including RNG endpoints', () => {
  const root = { name: 'Root', children: [leaf('Never first', 0), leaf('Always', 3), leaf('Never last', 0)] };
  assert.deepEqual(sample(2, sequence([0, 1 - Number.EPSILON]), root).counts,
    { 'r.0': 0, 'r.1': 2, 'r.2': 0 });
  assert.deepEqual(sample(1, () => 0.5, pair).counts, { 'r.0': 0, 'r.1': 1 });
});

test('relative sibling weights normalise without changing the input or overflowing', () => {
  const root = Object.freeze({ name: 'Root', children: Object.freeze([
    Object.freeze(leaf('A', Number.MAX_VALUE)), Object.freeze(leaf('B', Number.MAX_VALUE))
  ]) });
  assert.deepEqual(enumerate(root).map(item => item.probability), [0.5, 0.5]);
  assert.deepEqual(sample(2, sequence([0, 0.75]), root).counts, { 'r.0': 1, 'r.1': 1 });
  assert.deepEqual(enumerate({ name: 'Root', children: [leaf('A', 2), leaf('B', 6)] }).map(item => item.probability), [0.25, 0.75]);
});

test('larger runs conserve counts and retain zero-probability leaves in results', () => {
  let state = 12345;
  const rng = () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296);
  const result = sample(1000, rng);
  assert.equal(Object.values(result.counts).reduce((a, b) => a + b, 0), 1000);
  assert.equal(result.total, 1000);
  assert.equal(result.counts['r.0.0.0.0.1'], 0);
  assert.deepEqual(Object.keys(result.counts), enumerate().map(item => item.id));
});

test('rejects malformed weights and zero-total branches before sampling', () => {
  for (const bad of [-1, NaN, Infinity, undefined, '1']) {
    const root = { name: 'Root', children: [leaf('A', bad), leaf('B', 1)] };
    assert.throws(() => enumerate(root), /finite non-negative weight/);
    assert.throws(() => sample(1, Math.random, root), /finite non-negative weight/);
  }
  assert.throws(() => enumerate({ name: 'Root', children: [leaf('A', 0), leaf('B', 0)] }), /positive total/);
  assert.throws(() => enumerate({ name: 'Root', children: {} }), /children array/);
  const cycle = { name: 'cycle', transitionProbability: 1 };
  cycle.children = [cycle];
  assert.throws(() => enumerate(cycle), /Cyclic tree/);
});

test('validates sample counts and RNG outputs, with a sensible singleton tree', () => {
  for (const bad of [-1, 0.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1, '2']) {
    assert.throws(() => sample(bad), /non-negative safe integer/);
  }
  assert.throws(() => sample(1, 0), /rng must be a function/);
  for (const bad of [-Number.EPSILON, 1, NaN, Infinity, undefined, '0']) {
    assert.throws(() => sample(1, () => bad), /\[0, 1\)/);
  }
  assert.deepEqual(sample(2, () => { throw new Error('a leaf needs no random draw'); }, { name: 'Only leaf' }),
    { counts: { r: 2 }, total: 2, mostFrequentId: 'r' });
});
