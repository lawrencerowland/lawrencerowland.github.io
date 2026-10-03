const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../model.js');
const bridge = { cost: 45, value: 55, supplierAlternative: 0, clientAlternative: 0 };

test('all five original packages and cost/value assumptions are preserved', () => {
  assert.deepEqual(M.packages.map(p => [p.name, p.cost, p.value]), [
    ['Bridge construction', 45, 55], ['Tunnel excavation', 50, 60], ['Station renovation', 40, 50],
    ['Signalling system upgrade', 55, 65], ['Track electrification', 48, 58]
  ]);
});
test('close but uncrossed offers fail; broad crossing offers can succeed', () => {
  assert.equal(M.analyse(bridge, 55, 50).reason, 'uncrossed-offers');
  const r = M.analyse(bridge, 40, 60);
  assert.equal(r.price, 50);
  assert.deepEqual([r.supplierSurplus, r.clientSurplus, r.supplierGain, r.clientGain], [5, 5, 5, 5]);
});
test('matching offers below cost or above value do not produce an agreement', () => {
  assert.equal(M.analyse({ ...bridge, cost: 55, value: 65 }, 50, 50).reason, 'outside-reservations');
  assert.equal(M.analyse(bridge, 60, 60).reason, 'outside-reservations');
  assert.equal(M.analyse(bridge, 30, 40).agreement, false);
});
test('outside alternatives change reservations and may remove the ZOPA', () => {
  assert.deepEqual(M.reservations({ ...bridge, supplierAlternative: 3, clientAlternative: 2 }), {
    ...bridge, supplierAlternative: 3, clientAlternative: 2, lower: 48, upper: 53, exists: true, surplus: 5
  });
  const r = M.analyse({ ...bridge, supplierAlternative: 6, clientAlternative: 6 }, 0, 100);
  assert.equal(r.reason, 'no-zone');
  assert.equal(r.price, null);
  assert.equal(r.supplierGain, null);
});
test('indifference at a single price is allowed, including price-domain endpoints', () => {
  const zero = M.analyse({ cost: 0, value: 0, supplierAlternative: 0, clientAlternative: 0 }, 0, 0);
  assert.equal(zero.price, 0);
  const full = M.analyse({ cost: 100, value: 100, supplierAlternative: 0, clientAlternative: 0 }, 100, 100);
  assert.equal(full.price, 100);
  const point = M.analyse({ ...bridge, supplierAlternative: 5, clientAlternative: 5 }, 0, 100);
  assert.deepEqual([point.lower, point.upper, point.price, point.supplierGain, point.clientGain], [50, 50, 50, 0, 0]);
});
test('the illustrative midpoint splits the offered overlap, not necessarily total surplus equally', () => {
  const r = M.analyse(bridge, 52, 55);
  assert.equal(r.price, 53.5);
  assert.deepEqual([r.supplierGain, r.clientGain], [8.5, 1.5]);
});
test('independent finite-price search agrees with 2400 seeded boundary-rich bargains', () => {
  let seed = 271828;
  const draw = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % 101; };
  for (let i = 0; i < 2400; i++) {
    const t = { cost: draw(), value: draw(), supplierAlternative: i % 3 ? 0 : draw(), clientAlternative: i % 4 ? 0 : draw() };
    const ask = draw(), bid = draw(), r = M.analyse(t, ask, bid);
    // Enumerate the allowed half-unit grid without using the model's interval equations.
    const acceptable = [];
    for (let half = 0; half <= 200; half++) {
      const price = half / 2;
      if (price >= ask && price <= bid && price - t.cost >= t.supplierAlternative && t.value - price >= t.clientAlternative) acceptable.push(price);
    }
    assert.equal(r.agreement, acceptable.length > 0, JSON.stringify({ t, ask, bid }));
    if (r.agreement) {
      assert.ok(acceptable.includes(r.price));
      assert.ok(r.supplierGain >= 0 && r.clientGain >= 0);
      assert.equal(r.supplierSurplus + r.clientSurplus, t.value - t.cost);
      assert.equal(r.supplierGain + r.clientGain, t.value - t.cost - t.supplierAlternative - t.clientAlternative);
    }
  }
});
test('non-finite, fractional, out-of-range and text values fail explicitly', () => {
  for (const value of [NaN, Infinity, -Infinity, -1, 101, 0.5, '50', null, undefined]) {
    assert.throws(() => M.analyse({ ...bridge, cost: value }, 50, 50));
    assert.throws(() => M.analyse(bridge, value, 50));
    assert.throws(() => M.analyse({ ...bridge, clientAlternative: value }, 50, 50));
  }
});
test('five four-stage packages complete safely; final recording cannot double count', () => {
  let s = M.start();
  for (let round = 0; round < 5; round++) {
    assert.equal(s.round, round);
    assert.equal(s.stage, 0);
    assert.throws(() => M.record(s));
    s = M.next(M.next(M.next(s)));
    assert.equal(s.stage, 3);
    const before = s;
    s = M.record(s);
    assert.equal(before.history.length, round, 'previous state was not mutated');
    assert.equal(s.history.length, round + 1);
  }
  assert.equal(s.finished, true);
  assert.equal(s.round, 4);
  assert.equal(M.record(s), s);
  assert.equal(M.back(s), s);
  assert.throws(() => M.next(s));
  assert.equal(M.summary(s.history).agreements, 4);
  assert.equal(M.start().history.length, 0);
});
test('each turn enforces its role; revising a package does not rewrite recorded history', () => {
  let s = M.start();
  assert.throws(() => M.setOffer(s, 'ask', 60));
  s = M.setTerms(s, { ...bridge, supplierAlternative: 2 });
  s = M.next(s);
  assert.throws(() => M.setTerms(s, bridge));
  assert.throws(() => M.setOffer(s, 'bid', 50));
  s = M.setOffer(s, 'ask', 48);
  s = M.next(s);
  s = M.setOffer(s, 'bid', 52);
  s = M.record(M.next(s));
  assert.equal(s.history[0].price, 50);
  assert.equal(s.history[0].supplierGain, 3);
  assert.equal(s.terms.supplierAlternative, 0);
  s = M.setTerms(s, { ...s.terms, cost: 70 });
  assert.equal(s.history[0].terms.cost, 45);
});
test('the declared activity only contributes its full toy price once complete', () => {
  assert.equal(M.activityContribution(false), 0);
  assert.equal(M.activityContribution(true), 150000);
  assert.throws(() => M.activityContribution('true'));
});
