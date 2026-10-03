'use strict';

// Independent mathematical checks for the standalone explorer. No DOM or browser
// implementation is loaded: only the deliberately isolated public model is used.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const file = path.resolve(__dirname, '../library/apps/frobenius-dsm-explorer/index.html');
const html = fs.readFileSync(file, 'utf8');
const script = html.match(/<script\b[^>]*\bid=["']model["'][^>]*>([\s\S]*?)<\/script>/i);
assert.ok(script, 'The standalone page must expose its isolated model script');
const Model = vm.runInNewContext(`${script[1]}\n;Model;`, {}, { timeout: 3000 });
const plain = value => JSON.parse(JSON.stringify(value));
const square = n => Array.from({ length: n }, () => Array(n).fill(0));

// Floyd-Warshall reachability is independent of Tarjan/Kosaraju implementations.
// Convention: A[row][column] is the dependency column -> row.
function oracleComponents(matrix) {
  const n = matrix.length;
  const reach = matrix.map((row, i) => row.map((entry, j) => Boolean(entry) || i === j));
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) reach[i][j] ||= reach[i][k] && reach[k][j];
    }
  }
  const seen = new Set(), components = [];
  for (let i = 0; i < n; i++) {
    if (seen.has(i)) continue;
    const component = [];
    for (let j = 0; j < n; j++) {
      if (reach[i][j] && reach[j][i]) { component.push(j); seen.add(j); }
    }
    components.push(component);
  }
  return components;
}

function componentKey(components) {
  return components.map(group => [...group].sort((a, b) => a - b).join(',')).sort();
}

let graphCount = 0;
function checkGraph(matrix, label) {
  const before = JSON.stringify(matrix);
  const result = plain(Model.analyze(matrix));
  const n = matrix.length;
  assert.equal(JSON.stringify(matrix), before, `${label}: analysis mutated its input`);
  assert.deepEqual(componentKey(result.components), componentKey(oracleComponents(matrix)), `${label}: SCC membership`);
  assert.deepEqual([...result.order].sort((a, b) => a - b), Array.from({ length: n }, (_, i) => i), `${label}: vertex permutation`);
  assert.deepEqual(result.order, result.components.flat(), `${label}: blocks remain contiguous`);
  assert.equal(result.blockOf.length, n, `${label}: block membership length`);
  assert.equal(result.cyclic.length, result.components.length, `${label}: cycle flags length`);
  for (let block = 0; block < result.components.length; block++) {
    const members = result.components[block];
    for (const vertex of members) assert.equal(result.blockOf[vertex], block, `${label}: original vertex identity`);
    assert.equal(result.cyclic[block], members.length > 1 || Boolean(matrix[members[0]][members[0]]), `${label}: cyclic singleton or component`);
  }
  assert.equal(result.grouped.length, n, `${label}: grouped height`);
  for (let row = 0; row < n; row++) {
    assert.equal(result.grouped[row].length, n, `${label}: grouped width`);
    for (let column = 0; column < n; column++) {
      assert.equal(result.grouped[row][column], matrix[result.order[row]][result.order[column]], `${label}: dependency preserved under permutation`);
      if (matrix[row][column] && result.blockOf[row] !== result.blockOf[column]) {
        assert.ok(result.blockOf[column] < result.blockOf[row], `${label}: sources precede receivers`);
      }
      if (result.blockOf[result.order[row]] < result.blockOf[result.order[column]]) {
        assert.equal(result.grouped[row][column], 0, `${label}: upper off-diagonal block is empty`);
      }
    }
  }
  graphCount++;
  return result;
}

// An asymmetric chain detects reversing the DSM convention even if an SCC
// implementation otherwise gets every connected component right.
assert.deepEqual(checkGraph([[0, 0, 0], [1, 0, 0], [0, 1, 0]], 'directed source chain').order, [0, 1, 2]);
assert.deepEqual(checkGraph([[0, 1, 0], [0, 0, 1], [0, 0, 0]], 'reverse source chain').order, [2, 1, 0]);
checkGraph([[1]], 'self-loop');
checkGraph([[0]], 'isolated singleton');

// Exhaust every labelled directed binary graph on one through four vertices,
// INCLUDING diagonal self-loops: 66,066 cases, not a handful of chosen pictures.
for (let n = 1; n <= 4; n++) {
  for (let bits = 0; bits < 2 ** (n * n); bits++) {
    const matrix = square(n);
    for (let cell = 0; cell < n * n; cell++) matrix[Math.floor(cell / n)][cell % n] = (bits >>> cell) & 1;
    checkGraph(matrix, `exhaustive n=${n} graph=${bits}`);
  }
}

// Deterministic larger cases sample sparse, mixed and dense dependencies.
let seed = 0x6d736346;
function random() {
  seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
  return (seed >>> 0) / 2 ** 32;
}
for (let trial = 0; trial < 720; trial++) {
  const density = (trial % 12) / 11;
  checkGraph(square(6).map(row => row.map(() => +(random() < density))), `seeded six-vertex graph ${trial}`);
}

// BigInt fractions keep the algebra checks exact, independently of floating
// point matrix helpers. Decimal inputs are interpreted as their exact decimal.
function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a < 0n ? -a : a; }
function fraction(numerator, denominator = 1n) {
  let n = BigInt(numerator), d = BigInt(denominator);
  assert.notEqual(d, 0n, 'nonzero rational denominator');
  if (d < 0n) { n = -n; d = -d; }
  const factor = gcd(n, d);
  return [n / factor, d / factor];
}
function rational(value) {
  if (Array.isArray(value)) return fraction(value[0], value[1]);
  const source = String(value);
  if (source.includes('/')) { const [n, d] = source.split('/'); return fraction(n, d); }
  const match = source.match(/^(-?)(\d+)(?:\.(\d*))?(?:e([+-]?\d+))?$/i);
  assert.ok(match, `Exact rational representation: ${source}`);
  const decimals = match[3] || '', exponent = Number(match[4] || 0) - decimals.length;
  const n = BigInt(`${match[1]}${match[2]}${decimals}`);
  return exponent >= 0 ? fraction(n * 10n ** BigInt(exponent)) : fraction(n, 10n ** BigInt(-exponent));
}
const ZERO = fraction(0), ONE = fraction(1);
const add = (a, b) => fraction(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const neg = a => [-a[0], a[1]];
const sub = (a, b) => add(a, neg(b));
const mul = (a, b) => fraction(a[0] * b[0], a[1] * b[1]);
const div = (a, b) => fraction(a[0] * b[1], a[1] * b[0]);
const isZero = a => a[0] === 0n;
const exactMatrix = A => A.map(row => row.map(rational));
const identity = n => square(n).map((row, i) => row.map((_, j) => i === j ? ONE : ZERO));
const matrixKey = A => A.map(row => row.map(q => `${q[0]}/${q[1]}`));
function multiply(A, B) {
  return A.map(row => B[0].map((_, j) => row.reduce((sum, value, k) => add(sum, mul(value, B[k][j])), ZERO)));
}
const trace = A => A.reduce((sum, row, i) => add(sum, row[i]), ZERO);
function determinant(A) {
  if (A.length === 0) return ONE;
  if (A.length === 1) return A[0][0];
  return A[0].reduce((sum, value, j) => {
    const minor = A.slice(1).map(row => row.filter((_, k) => k !== j));
    const term = mul(value, determinant(minor));
    return add(sum, j % 2 ? neg(term) : term);
  }, ZERO);
}
function sameMatrix(A, B, label) { assert.deepEqual(matrixKey(A), matrixKey(B), label); }
function characteristic(A) {
  const n = A.length, coefficients = [ONE];
  let B = identity(n);
  for (let k = 1; k <= n; k++) {
    const AB = multiply(A, B), coefficient = neg(div(trace(AB), fraction(k)));
    coefficients.push(coefficient);
    B = AB.map((row, i) => row.map((entry, j) => i === j ? add(entry, coefficient) : entry));
  }
  return coefficients;
}
function rank(input) {
  const A = input.map(row => row.slice());
  let pivotRow = 0;
  for (let column = 0; column < A[0].length && pivotRow < A.length; column++) {
    const found = A.findIndex((row, i) => i >= pivotRow && !isZero(row[column]));
    if (found === -1) continue;
    [A[pivotRow], A[found]] = [A[found], A[pivotRow]];
    const pivot = A[pivotRow][column];
    A[pivotRow] = A[pivotRow].map(value => div(value, pivot));
    for (let i = pivotRow + 1; i < A.length; i++) {
      const factor = A[i][column];
      A[i] = A[i].map((value, j) => sub(value, mul(factor, A[pivotRow][j])));
    }
    pivotRow++;
  }
  return pivotRow;
}
function evaluatePolynomial(coefficients, A) {
  let result = square(A.length).map(row => row.map(() => ZERO));
  for (const coefficient of coefficients) {
    result = multiply(result, A).map((row, i) => row.map((entry, j) => i === j ? add(entry, coefficient) : entry));
  }
  return result;
}
function polynomialProduct(left, right) {
  const result = Array(left.length + right.length - 1).fill(ZERO);
  left.forEach((a, i) => right.forEach((b, j) => { result[i + j] = add(result[i + j], mul(a, b)); }));
  return result;
}
function polynomialRemainder(dividend, divisor) {
  const result = dividend.slice();
  for (let i = 0; i <= dividend.length - divisor.length; i++) {
    const factor = div(result[i], divisor[0]);
    divisor.forEach((coefficient, j) => { result[i + j] = sub(result[i + j], mul(factor, coefficient)); });
  }
  return result.slice(Math.max(0, dividend.length - divisor.length + 1));
}

// Map the exact published mathematical labels to independently stated,
// descending coefficient arrays. This also rejects a mistyped display label.
function polynomialCoefficients(value) {
  const coefficients = new Map([
    ['t² − 3t + 2', [1, -3, 2]],
    ['t² − 2t + 1', [1, -2, 1]],
    ['(t − 1)²', [1, -2, 1]],
    ['t − 1', [1, -1]],
  ]).get(value);
  assert.ok(coefficients, `Recognised, exact displayed polynomial: ${value}`);
  return coefficients.map(rational);
}

const examples = plain(Model.rationalExamples);
assert.ok(Array.isArray(examples) && examples.length >= 2, 'At least two worked rational-form examples');
assert.equal(new Set(examples.map(example => example.id)).size, examples.length, 'Unique rational example identities');
for (const example of examples) {
  const { id } = example;
  const A = exactMatrix(example.A), S = exactMatrix(example.S), Sinv = exactMatrix(example.Sinv), C = exactMatrix(example.C);
  const n = A.length;
  for (const matrix of [A, S, Sinv, C]) assert.ok(matrix.length === n && matrix.every(row => row.length === n), `${id}: square example dimensions`);
  assert.ok(!isZero(determinant(S)), `${id}: change of basis is invertible`);
  sameMatrix(multiply(A, S), multiply(S, C), `${id}: exact AS = SC`);
  sameMatrix(multiply(S, Sinv), identity(n), `${id}: S Sinv = I`);
  sameMatrix(multiply(Sinv, S), identity(n), `${id}: Sinv S = I`);
  sameMatrix(multiply(multiply(Sinv, A), S), C, `${id}: exact similarity`);
  assert.deepEqual(trace(A), trace(C), `${id}: similarity preserves trace`);
  assert.deepEqual(determinant(A), determinant(C), `${id}: similarity preserves determinant`);
  sameMatrix(exactMatrix(Model.multiply(example.A, example.S)), multiply(A, S), `${id}: public multiplication agrees with exact oracle`);
  const polynomial = polynomialCoefficients(example.polynomial), minimal = polynomialCoefficients(example.minimal);
  assert.ok(minimal.length >= 2, `${id}: positive-degree minimal polynomial`);
  assert.deepEqual(minimal[0], ONE, `${id}: minimal polynomial is monic`);
  assert.deepEqual(polynomial, characteristic(A), `${id}: stated characteristic polynomial`);
  assert.deepEqual(polynomial, characteristic(C), `${id}: characteristic polynomial preserved`);
  sameMatrix(evaluatePolynomial(minimal, A), square(n).map(row => row.map(() => ZERO)), `${id}: stated minimal polynomial annihilates A`);
  const independentPowers = [];
  let power = identity(n);
  for (let degree = 0; degree < minimal.length - 1; degree++) {
    independentPowers.push(power.flat()); power = multiply(power, A);
  }
  assert.equal(rank(independentPowers), minimal.length - 1, `${id}: no smaller-degree annihilating polynomial`);
  const invariantFactors = example.invariantFactors.map(polynomialCoefficients);
  assert.ok(invariantFactors.length, `${id}: invariant factors are present`);
  for (const factor of invariantFactors) {
    assert.ok(factor.length >= 2, `${id}: invariant factors have positive degree`);
    assert.deepEqual(factor[0], ONE, `${id}: invariant factors are monic`);
  }
  assert.deepEqual(invariantFactors.reduce(polynomialProduct, [ONE]), polynomial, `${id}: invariant-factor product is characteristic polynomial`);
  assert.deepEqual(invariantFactors.at(-1), minimal, `${id}: largest invariant factor is minimal polynomial`);
  for (let i = 1; i < invariantFactors.length; i++) {
    assert.ok(polynomialRemainder(invariantFactors[i], invariantFactors[i - 1]).every(isZero), `${id}: invariant factors form a divisibility chain`);
  }
  const expectedCompanion = square(n).map(row => row.map(() => ZERO));
  let offset = 0;
  for (const factor of invariantFactors) {
    const degree = factor.length - 1;
    for (let row = 0; row < degree; row++) expectedCompanion[offset + row][offset + degree - 1] = neg(factor[degree - row]);
    for (let column = 0; column < degree - 1; column++) expectedCompanion[offset + column + 1][offset + column] = ONE;
    offset += degree;
  }
  assert.equal(offset, n, `${id}: invariant-factor degrees equal matrix dimension`);
  sameMatrix(C, expectedCompanion, `${id}: C is the declared block-diagonal companion form`);
}

// Imports are data only and must remain within the six-activity binary schema.
let rejectedDrafts = 0;
const validDraft = () => ({ version: 1, preset: 'loop', matrix: square(6) });
for (const preset of ['loop', 'chain', 'pairs']) {
  const draft = validDraft(); draft.preset = preset; draft.matrix[2][4] = 1;
  const before = JSON.stringify(draft);
  assert.deepEqual(plain(Model.validateDraft(draft)), draft, `Valid ${preset} draft round-trip`);
  assert.equal(JSON.stringify(draft), before, `Valid ${preset} draft is not mutated`);
}
const invalidDrafts = [null, undefined, false, [], 'draft', 1, {}, { version: 1 },
  { ...validDraft(), version: 0 }, { ...validDraft(), version: 2 }, { ...validDraft(), version: '1' },
  { ...validDraft(), preset: 'custom' }, { ...validDraft(), preset: '' }, { ...validDraft(), preset: null },
  { ...validDraft(), matrix: [] }, { ...validDraft(), matrix: square(5) }, { ...validDraft(), matrix: square(7) },
  { ...validDraft(), matrix: Array(6) },
  { ...validDraft(), matrix: 'matrix' }, { ...validDraft(), matrix: null },
];
for (const value of [-1, 2, 0.5, NaN, Infinity, true, false, '1', '0', null, undefined]) {
  const draft = validDraft(); draft.matrix[1][4] = value; invalidDrafts.push(draft);
}
for (let i = 0; i < 6; i++) {
  const draft = validDraft(); draft.matrix[i][i] = 1; invalidDrafts.push(draft);
}
for (const badRow of [[], Array(5).fill(0), Array(7).fill(0), null, '000000', Array(6)]) {
  const draft = validDraft(); draft.matrix[2] = badRow; invalidDrafts.push(draft);
}
for (const draft of invalidDrafts) {
  assert.throws(() => Model.validateDraft(draft), `Invalid draft ${rejectedDrafts} must be rejected`);
  rejectedDrafts++;
}

console.log(`PASS: ${graphCount.toLocaleString('en-GB')} directed graph cases against independent reachability; ${examples.length} exact rational-form examples; ${rejectedDrafts} invalid draft cases rejected.`);
