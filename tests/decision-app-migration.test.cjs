const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { scoreRisk, groupRisks } = require('../library/apps/risk-matrix/model.js');
const { evaluate } = require('../library/apps/weighted-decision-matrix/model.js');
const { getRecommendedAction, groupTasks } = require('../library/apps/eisenhower-matrix/model.js');

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} should equal ${expected}`);
const criteria = [{ name: 'Affordability', weight: 0.3 }, { name: 'Quality', weight: 0.4 }, { name: 'Support', weight: 0.3 }];
const vendors = [{ name: 'A', ratings: [3, 4, 5] }, { name: 'B', ratings: [4, 3, 4] }, { name: 'C', ratings: [5, 2, 3] }];

test('delayed materials example respects the declared band; endpoints and adjacent band boundaries agree', () => {
  assert.deepEqual(scoreRisk(3, 5), { score: 15, band: 'Moderate' });
  assert.deepEqual(scoreRisk(4, 5), { score: 20, band: 'High' });
  assert.deepEqual(scoreRisk(1, 1), { score: 1, band: 'Low' });
  assert.deepEqual(scoreRisk(1, 5), { score: 5, band: 'Low' });
  assert.deepEqual(scoreRisk(2, 3), { score: 6, band: 'Moderate' });
  assert.deepEqual(scoreRisk(4, 4), { score: 16, band: 'High' });
  assert.deepEqual(scoreRisk(5, 5), { score: 25, band: 'High' });
});

test('multiple events at one location survive grouping and moving one does not remove the other', () => {
  const risks = [{ id: 1, name: 'Materials late', likelihood: 3, impact: 5 }, { id: 2, name: 'Approval late', likelihood: 3, impact: 5 }];
  assert.equal(groupRisks(risks).get('3,5').length, 2);
  risks[0].likelihood = 4;
  assert.equal(groupRisks(risks).get('3,5')[0].id, 2);
  assert.equal(groupRisks(risks).get('4,5')[0].id, 1);
  assert.equal(groupRisks([]).size, 0);
});

test('risk and urgency ratings reject missing, fractional, out-of-range and non-finite values', () => {
  for (const invalid of [undefined, null, NaN, Infinity, -1, 0, 2.5, 6, '3']) {
    assert.throws(() => scoreRisk(invalid, 3), RangeError);
    assert.throws(() => scoreRisk(3, invalid), RangeError);
    assert.throws(() => getRecommendedAction(invalid, 3), RangeError);
    assert.throws(() => getRecommendedAction(3, invalid), RangeError);
  }
});

test('vendor totals and normalised scores match a hand-calculated comparison', () => {
  const result = evaluate(criteria, vendors);
  assert.deepEqual(result.errors, []);
  [4, 3.6, 3.2].forEach((expected, index) => {
    close(result.scores[index].raw, expected);
    close(result.scores[index].normalised, expected);
  });
  assert.deepEqual(result.leaders, [0]);
});

test('the documented sensitivity scenario finds all three ties and then reverses preference', () => {
  const changed = criteria.map(criterion => ({ ...criterion }));
  changed[0].weight = 0.7;
  const tied = evaluate(changed, vendors);
  assert.deepEqual(tied.leaders, [0, 1, 2]);
  tied.scores.forEach(score => { close(score.raw, 5.2); close(score.normalised, 26 / 7); });
  changed[0].weight = 1;
  assert.deepEqual(evaluate(changed, vendors).leaders, [2]);
});

test('rescaling weights preserves normalised scores and ranks, including large finite values', () => {
  const original = evaluate(criteria, vendors);
  const rescaled = evaluate(criteria.map(criterion => ({ ...criterion, weight: criterion.weight * 100 })), vendors);
  assert.deepEqual(rescaled.leaders, original.leaders);
  rescaled.scores.forEach((score, index) => close(score.normalised, original.scores[index].normalised));
  const large = evaluate([{ name: 'One', weight: Number.MAX_VALUE }, { name: 'Two', weight: Number.MAX_VALUE }], [{ name: 'A', ratings: [5, 1] }, { name: 'B', ratings: [4, 4] }]);
  assert.deepEqual(large.leaders, [1]);
  close(large.scores[0].normalised, 3);
  close(large.scores[1].normalised, 4);
});

test('a missing or invalid rating suppresses the whole ranking rather than producing a false winner', () => {
  for (const invalid of [null, undefined, NaN, Infinity, -1, 0, 5.1, '4']) {
    const result = evaluate(criteria, [{ name: 'Unassessed', ratings: [5, invalid, 5] }, ...vendors]);
    assert.ok(result.errors.length);
    assert.deepEqual(result.leaders, []);
    assert.deepEqual(result.scores, []);
  }
  assert.deepEqual(evaluate(criteria, [{ name: 'Short', ratings: [5, 5] }]).leaders, []);
  assert.ok(evaluate(criteria, [{ name: '   ', ratings: [5, 5, 5] }]).errors.length);
});

test('zero weights may exclude a criterion; all-zero, negative or missing weights cannot create winners', () => {
  const onlyQuality = [{ name: 'Affordability', weight: 0 }, { name: 'Quality', weight: 1 }, { name: 'Support', weight: 0 }];
  assert.deepEqual(evaluate(onlyQuality, vendors).scores.map(score => score.normalised), [4, 3, 2]);
  for (const invalid of [-1, null, undefined, NaN, Infinity]) {
    assert.deepEqual(evaluate([{ name: 'A', weight: invalid }], [{ name: 'B', ratings: [5] }]).leaders, []);
  }
  assert.ok(evaluate(criteria.map(criterion => ({ ...criterion, weight: 0 })), vendors).errors.length);
  assert.ok(evaluate([], []).errors.length);
  assert.ok(evaluate(criteria, []).errors.length);
  assert.ok(evaluate([{ name: '', weight: 1 }], [{ name: 'B', ratings: [5] }]).errors.length);
});

test('all four task actions meet at the documented 2-to-3 boundaries', () => {
  assert.equal(getRecommendedAction(2, 2), 'Delete / Defer');
  assert.equal(getRecommendedAction(3, 2), 'Delegate');
  assert.equal(getRecommendedAction(2, 3), 'Schedule (Decide)');
  assert.equal(getRecommendedAction(3, 3), 'Do immediately');
  assert.equal(getRecommendedAction(5, 5), 'Do immediately');
  assert.equal(getRecommendedAction(1, 5), 'Schedule (Decide)');
  assert.equal(getRecommendedAction(5, 1), 'Delegate');
  assert.equal(getRecommendedAction(1, 1), 'Delete / Defer');
});

test('coincident task points retain their separate descriptions and list numbers', () => {
  const tasks = [{ id: 1, description: 'First blocker', urgency: 5, importance: 5 }, { id: 2, description: 'Second blocker', urgency: 5, importance: 5 }, { id: 3, description: 'Planning', urgency: 2, importance: 5 }];
  const grouped = groupTasks(tasks);
  assert.equal(grouped.length, 2);
  assert.deepEqual(grouped[0].tasks.map(task => [task.number, task.description]), [[1, 'First blocker'], [2, 'Second blocker']]);
  assert.equal(grouped[1].tasks[0].number, 3);
  assert.equal(tasks[0].number, undefined);
  assert.deepEqual(groupTasks([]), []);
});

// Small event/element fixture exercises the actual controllers' validation-to-edit
// transition. Native form layout and interaction are checked separately in-browser.
function pageFixture(app, globals, defaults) {
  const created = [], ids = new Map();
  function node(tag) {
    const listeners = new Map();
    const item = {
      tag, children: [], attributes: {}, value: '', customValidity: '', dataset: {},
      setAttribute(key, value) { this.attributes[key] = String(value); },
      append(...items) { this.children.push(...items); },
      replaceChildren(...items) { this.children = [...items]; },
      addEventListener(name, callback) { listeners.set(name, callback); },
      emit(name) { listeners.get(name)?.({ preventDefault() {} }); },
      setCustomValidity(message) { this.customValidity = message; },
      reportValidity() { return !this.customValidity; },
      reset() {}, focus() {},
      get firstChild() { return this.children[0]; }
    };
    created.push(item);
    return item;
  }
  const get = id => { if (!ids.has(id)) ids.set(id, node('div')); return ids.get(id); };
  for (const [id, value] of Object.entries(defaults)) get(id).value = value;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../library/apps', app, 'app.js'), 'utf8'), {
    document: { getElementById: get, createElement: node, createElementNS: (_, tag) => node(tag) }, ...globals
  });
  return { get, created };
}

test('editing an existing risk clears a whitespace-submission validation error before saving', () => {
  const page = pageFixture('risk-matrix', { RiskMatrix: { scoreRisk, groupRisks } }, { likelihood: '3', impact: '3' });
  page.get('exampleButton').emit('click');
  page.get('riskName').value = '   ';
  page.get('riskForm').emit('submit');
  assert.equal(page.get('riskName').reportValidity(), false);
  page.created.find(node => node.attributes['aria-label'] === 'Edit Delayed materials').emit('click');
  assert.equal(page.get('riskName').value, 'Delayed materials');
  assert.equal(page.get('riskName').reportValidity(), true);
  page.get('riskForm').emit('submit');
  assert.match(page.get('status').textContent, /^Updated Delayed materials:/);
});

test('editing an existing task clears a whitespace-submission validation error before saving', () => {
  const page = pageFixture('eisenhower-matrix', { EisenhowerMatrix: { getRecommendedAction, groupTasks } }, { taskUrgency: '1', taskImportance: '1' });
  page.get('exampleButton').emit('click');
  page.get('taskDescription').value = '   ';
  page.get('taskForm').emit('submit');
  assert.equal(page.get('taskDescription').reportValidity(), false);
  page.created.find(node => node.attributes['aria-label'] === 'Edit Plan recovery drills').emit('click');
  assert.equal(page.get('taskDescription').value, 'Plan recovery drills');
  assert.equal(page.get('taskDescription').reportValidity(), true);
  page.get('taskForm').emit('submit');
  assert.match(page.get('status').textContent, /^Updated Plan recovery drills:/);
});
