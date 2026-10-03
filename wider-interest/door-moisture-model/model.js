(function (root, factory) {
  'use strict';
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.DoorMoistureModel = model;
}(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  // Illustrative sensitivities retained from the original, not material constants.
  const assumptions = Object.freeze({ referenceMoisture: 12, doorRate: 0.25, jambRate: 0.20, wallScale: 1.5 });
  const limits = Object.freeze({ door: [6, 28], jamb: [6, 28], wall: [0, 1], clearance: [0, 10] });
  Object.values(limits).forEach(Object.freeze);
  const defaults = Object.freeze({ door: 12, jamb: 12, wall: 0.2, clearance: 3 });
  const examples = Object.freeze({
    original: defaults,
    dry: Object.freeze({ door: 8, jamb: 8, wall: 0.2, clearance: 3 }),
    contact: Object.freeze({ door: 18, jamb: 18, wall: 0.2, clearance: 3 }),
    wet: Object.freeze({ door: 20, jamb: 20, wall: 0.2, clearance: 3 })
  });
  function validate(input) {
    if (!input || typeof input !== 'object') throw new TypeError('Four numeric inputs are required.');
    const state = {};
    for (const [key, [min, max]] of Object.entries(limits)) {
      const value = input[key];
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(key + ' must be a finite number.');
      if (value < min || value > max) throw new RangeError(key + ' is outside the toy’s range.');
      state[key] = value;
    }
    return state;
  }
  function calculate(input) {
    const state = validate(input);
    const doorMovement = assumptions.doorRate * (state.door - assumptions.referenceMoisture);
    const jambMovement = assumptions.jambRate * (state.jamb - assumptions.referenceMoisture);
    const wallMovement = assumptions.wallScale * state.wall;
    const rawGap = state.clearance - doorMovement - jambMovement - wallMovement;
    // Floating-point roundoff at exact contact must not become a false gap.
    const gap = Math.abs(rawGap) < 1e-10 ? 0 : rawGap;
    return Object.freeze({
      ...state, doorMovement, jambMovement, wallMovement, gap,
      status: gap > 0 ? 'gap' : gap < 0 ? 'overlap' : 'contact',
      extraClearance: Math.max(0, -gap)
    });
  }
  function doorSweep(input) {
    const state = validate(input);
    return Array.from({ length: 23 }, (_, i) => {
      const door = 6 + i;
      return Object.freeze({ door, gap: calculate({ ...state, door }).gap });
    });
  }
  function contactMoisture(input) {
    const result = calculate(input);
    return assumptions.referenceMoisture + (result.clearance - result.jambMovement - result.wallMovement) / assumptions.doorRate;
  }
  return Object.freeze({ assumptions, limits, defaults, examples, calculate, doorSweep, contactMoisture });
}));
