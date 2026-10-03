/* HS2 Elite: dependency-free simulation, shared by the cockpit and Node tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EliteModel = factory();
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const TAU = 2 * Math.PI;
  const STEP = 1 / 120;
  const OUTPOSTS = Object.freeze([
    { id: 'euston', name: 'Euston', x: 0, y: 0, z: 0, type: 'Terminus' },
    { id: 'old-oak', name: 'Old Oak Common', x: 300, y: 50, z: -200, type: 'Interchange' },
    { id: 'west-ruislip', name: 'West Ruislip', x: 600, y: -30, z: 300, type: 'Tunnel portal' },
    { id: 'chiltern', name: 'Chiltern Tunnel', x: 900, y: 100, z: -100, type: 'TBM site' },
    { id: 'birmingham', name: 'Birmingham Int.', x: 1200, y: -80, z: 250, type: 'Station' },
    { id: 'curzon', name: 'Curzon Street', x: 1500, y: 20, z: 0, type: 'Terminus' }
  ].map(Object.freeze));
  const GOODS = Object.freeze([
    { id: 'consultants', name: 'Consultants', basePrice: 500, variance: .3 },
    { id: 'concrete', name: 'Concrete', basePrice: 100, variance: .2 },
    { id: 'rails', name: 'Steel rails', basePrice: 300, variance: .25 },
    { id: 'tbm', name: 'TBM parts', basePrice: 800, variance: .4 },
    { id: 'signalling', name: 'Signalling tech', basePrice: 600, variance: .35 },
    { id: 'reports', name: 'Env. reports', basePrice: 200, variance: .5 }
  ].map(Object.freeze));
  const MODES = Object.freeze({
    fine: Object.freeze({ acceleration: 15, fuel: .35 }),
    normal: Object.freeze({ acceleration: 45, fuel: .96 }),
    boost: Object.freeze({ acceleration: 150, fuel: 3.6 })
  });
  const clamp = (n, low, high) => Math.max(low, Math.min(high, n));
  const wrap = a => ((a + Math.PI) % TAU + TAU) % TAU - Math.PI;
  const length = a => Math.hypot(a.x, a.y, a.z);
  const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
  const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
  function unit(a) {
    const n = length(a);
    return n > 1e-12 ? { x: a.x / n, y: a.y / n, z: a.z / n } : null;
  }
  function basis(ship) {
    const cy = Math.cos(ship.yaw), sy = Math.sin(ship.yaw);
    const cp = Math.cos(ship.pitch), sp = Math.sin(ship.pitch);
    const cr = Math.cos(ship.roll), sr = Math.sin(ship.roll);
    const forward = { x: sy * cp, y: sp, z: cy * cp };
    const right = { x: cy, y: 0, z: -sy };
    const up = { x: -sy * sp, y: cp, z: -cy * sp };
    return {
      forward,
      right: { x: right.x * cr - up.x * sr, y: -up.y * sr, z: right.z * cr - up.z * sr },
      up: { x: up.x * cr + right.x * sr, y: up.y * cr, z: up.z * cr + right.z * sr }
    };
  }
  function worldToCamera(vector, ship) {
    const b = basis(ship);
    return { x: dot(vector, b.right), y: dot(vector, b.up), z: dot(vector, b.forward) };
  }
  function cameraToWorld(vector, ship) {
    const b = basis(ship);
    return {
      x: vector.x * b.right.x + vector.y * b.up.x + vector.z * b.forward.x,
      y: vector.x * b.right.y + vector.y * b.up.y + vector.z * b.forward.y,
      z: vector.x * b.right.z + vector.y * b.up.z + vector.z * b.forward.z
    };
  }
  function screenRay(x, y, width, height, focal, ship) {
    return unit(cameraToWorld({ x: (x - width / 2) / focal, y: (height / 2 - y) / focal, z: 1 }, ship));
  }
  function project(vector, width, height, focal) {
    if (vector.z < .5) return null;
    return { x: width / 2 + vector.x * focal / vector.z, y: height / 2 - vector.y * focal / vector.z };
  }
  function seededRandom(seed) {
    let n = seed >>> 0;
    return function () {
      n = (n + 0x6D2B79F5) >>> 0;
      let t = Math.imul(n ^ (n >>> 15), 1 | n);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function createState(seed = 48532) {
    const random = seededRandom(seed);
    const prices = Object.fromEntries(OUTPOSTS.map(station => [station.id,
      Object.freeze(Object.fromEntries(GOODS.map(g => [g.id, Math.round(g.basePrice * (1 + (random() - .5) * g.variance))])))
    ]));
    return {
      seed: seed >>> 0, credits: 10000, cargo: Object.fromEntries(GOODS.map(g => [g.id, 0])), capacity: 20,
      fuel: 100, ship: { x: 0, y: 0, z: -40, yaw: 0, pitch: 0, roll: 0, vx: 0, vy: 0, vz: 0 },
      location: 'euston', selected: 'old-oak', docked: true, paused: false, marketOpen: false,
      prices: Object.freeze(prices), target: null, thrust: 0, mode: 'normal', time: 0,
      undockLock: null, visited: ['euston'], message: 'Welcome, commander. Trade at Euston, then undock to explore.'
    };
  }
  const stationById = id => OUTPOSTS.find(s => s.id === id);
  const cargoCount = state => Object.values(state.cargo).reduce((sum, n) => sum + n, 0);
  const speed = state => Math.hypot(state.ship.vx, state.ship.vy, state.ship.vz);
  function nearest(state) {
    return OUTPOSTS.map(station => ({ station, distance: length(subtract(station, state.ship)) }))
      .reduce((a, b) => a.distance < b.distance ? a : b);
  }
  function setPaused(state, paused) {
    state.paused = !!paused;
    state.thrust = 0;
  }
  function openMarket(state) {
    if (!state.docked || !stationById(state.location)) return false;
    state.marketOpen = true;
    state.thrust = 0;
    return true;
  }
  function closeMarket(state) { state.marketOpen = false; }
  function trade(state, goodId, side) {
    const good = GOODS.find(g => g.id === goodId);
    if (!state.docked || !state.marketOpen || !good || !['buy', 'sell'].includes(side)) {
      return { ok: false, message: 'Open a docked station market to trade.' };
    }
    const price = state.prices[state.location][goodId];
    if (side === 'buy') {
      if (cargoCount(state) >= state.capacity) return { ok: false, message: 'Cargo hold full. Sell a unit to make space.' };
      if (state.credits < price) return { ok: false, message: 'Insufficient credits for that unit.' };
      state.credits -= price;
      state.cargo[goodId] += 1;
    } else {
      if (state.cargo[goodId] < 1) return { ok: false, message: `No ${good.name.toLowerCase()} aboard.` };
      state.cargo[goodId] -= 1;
      state.credits += price;
    }
    state.message = `${side === 'buy' ? 'Bought' : 'Sold'} one unit of ${good.name.toLowerCase()} for £${price}.`;
    return { ok: true, message: state.message, price };
  }
  function undock(state) {
    if (!state.docked) return false;
    const station = stationById(state.location), forward = basis(state.ship).forward;
    state.ship.x = station.x - forward.x * 80;
    state.ship.y = station.y - forward.y * 80;
    state.ship.z = station.z - forward.z * 80;
    state.ship.vx = -forward.x * 9;
    state.ship.vy = -forward.y * 9;
    state.ship.vz = -forward.z * 9;
    state.undockLock = station.id;
    state.docked = false;
    state.location = null;
    state.marketOpen = false;
    state.paused = false;
    state.target = null;
    state.thrust = 0;
    state.message = `Undocked from ${station.name}. Aim, then thrust; release to coast.`;
    return true;
  }
  function aim(state, direction) {
    if (state.docked || state.marketOpen || state.thrust !== 0) return false;
    const normalized = unit(direction);
    if (!normalized || !Object.values(normalized).every(Number.isFinite)) return false;
    state.target = normalized;
    return true;
  }
  function aimAtStation(state, id = state.selected) {
    const station = stationById(id);
    return station ? aim(state, subtract(station, state.ship)) : false;
  }
  function dock(state, station) {
    state.docked = true;
    state.location = station.id;
    state.fuel = 100;
    state.ship.vx = state.ship.vy = state.ship.vz = 0;
    state.thrust = 0;
    state.target = null;
    if (!state.visited.includes(station.id)) state.visited.push(station.id);
    state.message = `Docked at ${station.name}. Tank refilled. Open the market to trade.`;
  }
  function rescue(state) {
    if (state.docked || state.marketOpen) return false;
    const { station } = nearest(state);
    const fee = Math.min(250, state.credits);
    state.credits -= fee;
    state.ship.x = station.x; state.ship.y = station.y; state.ship.z = station.z - 40;
    state.ship.yaw = state.ship.pitch = state.ship.roll = 0;
    state.undockLock = null;
    dock(state, station);
    state.paused = false;
    state.message = `Towed to ${station.name} for £${fee}. Cargo retained; tank refilled.`;
    return true;
  }
  function step(state, input = {}, dt = STEP) {
    if (!(dt > 0) || !Number.isFinite(dt) || dt > .1 || state.paused || state.marketOpen || state.docked) return;
    state.time += dt;
    const ship = state.ship;
    const sign = input.reverse ? -1 : input.forward ? 1 : 0;
    const mode = input.fine ? 'fine' : input.boost ? 'boost' : state.mode;
    const selectedMode = MODES[mode] || MODES.normal;
    const thrusting = sign !== 0 && state.fuel > 0;
    state.thrust = thrusting ? sign * selectedMode.acceleration : 0;
    if (thrusting) state.target = null;
    // Deliberate original interaction: aim with the drive released, then thrust.
    if (!thrusting) {
      const turn = Number(!!input.right) - Number(!!input.left);
      const rise = Number(!!input.up) - Number(!!input.down);
      if (turn || rise || input.rollLeft || input.rollRight) state.target = null;
      if (turn || rise) {
        const b = basis(ship), delta = 1.6 * dt;
        const direction = unit({ x: b.forward.x + delta * (turn * b.right.x + rise * b.up.x),
          y: b.forward.y + delta * (turn * b.right.y + rise * b.up.y),
          z: b.forward.z + delta * (turn * b.right.z + rise * b.up.z) });
        ship.yaw = Math.atan2(direction.x, direction.z);
        ship.pitch = clamp(Math.asin(clamp(direction.y, -1, 1)), -Math.PI / 2 + .001, Math.PI / 2 - .001);
      }
      ship.roll = wrap(ship.roll + (Number(!!input.rollRight) - Number(!!input.rollLeft)) * 1.6 * dt);
      if (state.target) {
        const yawDelta = wrap(Math.atan2(state.target.x, state.target.z) - ship.yaw);
        const pitchDelta = Math.asin(clamp(state.target.y, -1, 1)) - ship.pitch;
        ship.yaw = wrap(ship.yaw + clamp(yawDelta, -2.4 * dt, 2.4 * dt));
        ship.pitch += clamp(pitchDelta, -2.4 * dt, 2.4 * dt);
        if (Math.abs(yawDelta) <= 2.4 * dt && Math.abs(pitchDelta) <= 2.4 * dt) state.target = null;
      }
    }
    const forward = basis(ship).forward;
    // Exact damped integration for a fixed heading; render rate does not affect it.
    const damping = input.brake ? 3.8 : .75;
    const decay = Math.exp(-damping * dt);
    const fuelFraction = thrusting ? Math.min(1, state.fuel / (selectedMode.fuel * dt)) : 0;
    const acceleration = state.thrust * fuelFraction;
    for (const axis of ['x', 'y', 'z']) {
      const velocityKey = `v${axis}`;
      const terminalVelocity = forward[axis] * acceleration / damping;
      ship[axis] += terminalVelocity * dt + (ship[velocityKey] - terminalVelocity) * (1 - decay) / damping;
      ship[velocityKey] = terminalVelocity + (ship[velocityKey] - terminalVelocity) * decay;
    }
    if (thrusting) state.fuel = Math.max(0, state.fuel - selectedMode.fuel * dt);
    if (state.fuel === 0) state.thrust = 0;
    const closest = nearest(state);
    if (state.undockLock && length(subtract(stationById(state.undockLock), ship)) > 90) state.undockLock = null;
    if (closest.distance < 50 && speed(state) < 5 && closest.station.id !== state.undockLock) dock(state, closest.station);
  }
  function createRunner(state) {
    let accumulator = 0;
    return {
      reset() { accumulator = 0; },
      advance(seconds, input = {}) {
        if (!Number.isFinite(seconds) || seconds < 0) return 0;
        if (state.paused || state.marketOpen || state.docked) { accumulator = 0; return 0; }
        // Stall protection: no invisible catch-up after a suspended browser.
        accumulator += Math.min(seconds, .1);
        let count = 0;
        while (accumulator + 1e-12 >= STEP) {
          step(state, input, STEP);
          accumulator = Math.max(0, accumulator - STEP);
          count += 1;
        }
        return count;
      }
    };
  }
  return { OUTPOSTS, GOODS, MODES, STEP, createState, createRunner, basis, worldToCamera, cameraToWorld,
    screenRay, project, unit, subtract, wrap, speed, nearest, cargoCount, stationById, setPaused,
    openMarket, closeMarket, trade, undock, aim, aimAtStation, rescue, step };
});
