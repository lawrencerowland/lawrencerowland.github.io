/* Fractional FIFO queue experiment. No facility, inventory or radiological model. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WasteRoute = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const STAGES = ['char', 'seg', 'size', 'pack', 'assay', 'storage'];
  const WORK = ['char', 'seg', 'size', 'pack', 'assay', 'transport'];
  const LIMITS = {
    horizon: [1, 730, true], inbound: [0, 200], charCap: [0, 200], segCap: [0, 200],
    sizeCap: [0, 200], packCap: [0, 200], assayCap: [0, 200], transportCap: [0, 200],
    storageCap: [0, 10000], cleanRelease: [0, 90], reworkBase: [0, 80],
    classInflation: [0, 100], reworkReduction: [0, 50],
    assayOutageStart: [0, 730, true], assayOutageDuration: [0, 730, true],
    transportOutageStart: [0, 730, true], transportOutageDuration: [0, 730, true],
    stressRuns: [2, 100, true], inboundCV: [0, 100], assayOutageProb: [0, 100],
    transportOutageProb: [0, 100], randomOutageDuration: [1, 30, true], seed: [0, 4294967295, true]
  };
  const DEFAULTS = Object.freeze({
    horizon: 180, inbound: 18, charCap: 24, segCap: 22, sizeCap: 18, packCap: 16,
    assayCap: 14, transportCap: 12, storageCap: 120, cleanRelease: 25, reworkBase: 10,
    classInflation: 15, reworkReduction: 4, earlySeg: true, conservative: false,
    assayOutageStart: 0, assayOutageDuration: 0, transportOutageStart: 0,
    transportOutageDuration: 0, stressRuns: 50, inboundCV: 12, assayOutageProb: 2,
    transportOutageProb: 1, randomOutageDuration: 3, seed: 20261003
  });
  const PRESETS = Object.freeze({
    baseline: {...DEFAULTS}, transportOutage: {...DEFAULTS, transportOutageStart: 80, transportOutageDuration: 10},
    assayConstrained: {...DEFAULTS, assayCap: 11, transportCap: 13, storageCap: 140},
    conservative: {...DEFAULTS, conservative: true}, lateSeg: {...DEFAULTS, earlySeg: false},
    recovered: {...DEFAULTS, assayCap: 16, transportCap: 14, storageCap: 180},
    smallFlow: {...DEFAULTS, inbound: 1.5, charCap: 2, segCap: 2, sizeCap: 2, packCap: 1.8,
      assayCap: 1.5, transportCap: 1.4, storageCap: 12, cleanRelease: 0, reworkBase: 4}
  });
  const MAX_STRESS_DAYS = 30000;
  function validate(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('A complete scenario is required.');
    const p = {};
    for (const [key, [min, max, integer]] of Object.entries(LIMITS)) {
      const value = input[key];
      if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
        throw new Error(`${key}: enter ${integer ? 'a whole number' : 'a finite number'} from ${min} to ${max}.`);
      }
      p[key] = value;
    }
    for (const key of ['earlySeg', 'conservative']) {
      if (typeof input[key] !== 'boolean') throw new Error(`${key}: use a true/false policy choice.`);
      p[key] = input[key];
    }
    for (const stage of ['assay', 'transport']) {
      if (p[stage + 'OutageDuration'] > 0 && p[stage + 'OutageStart'] === 0) throw new Error(`${stage}: an outage with a duration needs a start day of at least 1.`);
    }
    return p;
  }
  function validateStress(input) {
    const p = validate(input);
    if (p.horizon * p.stressRuns > MAX_STRESS_DAYS) throw new Error(`Stress work is limited to ${MAX_STRESS_DAYS.toLocaleString('en-GB')} simulated days. Reduce runs or horizon.`);
    return p;
  }
  function random(seed) {
    let state = seed >>> 0;
    return function () {
      state = (state + 0x6D2B79F5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function normal(rng) {
    const u = Math.max(1 / 4294967296, rng());
    return Math.max(-4, Math.min(4, Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng())));
  }
  // Queue units are conserved material-equivalents. 'packaged' records a once-only allowance.
  class Queue {
    constructor() { this.batches = []; this.head = 0; this.qty = 0; this.packagedQty = 0; }
    push(qty, born, packaged = false) {
      if (!(qty > 0)) return;
      const last = this.batches[this.batches.length - 1];
      if (this.head < this.batches.length && last.born === born && last.packaged === packaged) last.qty += qty;
      else this.batches.push({qty, born, packaged});
      this.qty += qty;
      if (packaged) this.packagedQty += qty;
    }
    take(capacity) {
      let left = Math.min(capacity, this.qty);
      const moved = [];
      while (left > 1e-12 && this.head < this.batches.length) {
        const batch = this.batches[this.head];
        const qty = Math.min(left, batch.qty);
        moved.push({qty, born: batch.born, packaged: batch.packaged});
        batch.qty -= qty; left -= qty; this.qty -= qty;
        if (batch.packaged) this.packagedQty -= qty;
        if (batch.qty <= 0) this.head++;
      }
      if (this.head === this.batches.length) { this.batches = []; this.head = 0; this.qty = 0; this.packagedQty = 0; }
      else if (this.head > 256 && this.head * 2 > this.batches.length) { this.batches = this.batches.slice(this.head); this.head = 0; }
      return moved;
    }
    load(multiplier) { return this.qty + this.packagedQty * (multiplier - 1); }
    remaining() { return this.batches.slice(this.head); }
  }
  const sum = values => values.reduce((a, b) => a + b, 0);
  const quantity = batches => sum(batches.map(b => b.qty));
  const planned = (day, start, duration) => start > 0 && day >= start && day < start + duration;
  function simulate(input, stochastic = false, seedOverride) {
    const p = validate(input);
    const seed = seedOverride === undefined ? p.seed : seedOverride;
    if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw new Error('Seed must be an unsigned 32-bit integer.');
    const rng = random(seed);
    const q = Object.fromEntries(STAGES.map(key => [key, new Queue()]));
    const flow = Object.fromEntries(WORK.map(key => [key, 0]));
    const available = {...flow}, pressureDays = {...flow};
    const history = [];
    const factor = p.conservative ? 1 + p.classInflation / 100 : 1;
    const reworkFraction = Math.max(0, p.reworkBase - (p.conservative ? p.reworkReduction : 0)) / 100;
    const cleanFraction = p.earlySeg ? p.cleanRelease / 100 : 0;
    let arrivals = 0, clean = 0, shipped = 0, packagedFirst = 0, reworked = 0, leadSum = 0;
    let blockedDays = 0, blockedMaterial = 0, peakStorage = 0, peakStorageEnd = 0;
    let assayDown = 0, transportDown = 0, operations = 0;
    const shipBatches = [];
    function transfer(from, to, capacity, ratio = 1, markPackaged = null) {
      const moved = q[from].take(capacity);
      operations += moved.length;
      if (operations > 1000000) throw new Error('This scenario creates too many fractional batches. Reduce its horizon or rework.');
      for (const b of moved) q[to].push(b.qty * ratio, b.born, markPackaged === null ? b.packaged : markPackaged);
      return moved;
    }
    for (let day = 1; day <= p.horizon; day++) {
      const arrival = stochastic ? p.inbound * Math.max(0, 1 + normal(rng) * p.inboundCV / 100) : p.inbound;
      arrivals += arrival;
      q.char.push(arrival, day);
      if (stochastic) {
        if (assayDown === 0 && rng() < p.assayOutageProb / 100) assayDown = p.randomOutageDuration;
        if (transportDown === 0 && rng() < p.transportOutageProb / 100) transportDown = p.randomOutageDuration;
      }
      const assayCap = planned(day, p.assayOutageStart, p.assayOutageDuration) || assayDown > 0 ? 0 : p.assayCap;
      const transportCap = planned(day, p.transportOutageStart, p.transportOutageDuration) || transportDown > 0 ? 0 : p.transportCap;
      if (assayDown > 0) assayDown--;
      if (transportDown > 0) transportDown--;
      const caps = {char: p.charCap, seg: p.segCap, size: p.sizeCap, pack: p.packCap, assay: assayCap, transport: transportCap};
      WORK.forEach(key => { available[key] += caps[key]; });
      flow.char += quantity(transfer('char', 'seg', p.charCap));
      const segregated = quantity(transfer('seg', 'size', p.segCap, 1 - cleanFraction));
      clean += segregated * cleanFraction; flow.seg += segregated;
      flow.size += quantity(transfer('size', 'pack', p.sizeCap));
      const packaged = transfer('pack', 'assay', p.packCap, 1, true);
      flow.pack += quantity(packaged);
      packagedFirst += quantity(packaged.filter(b => !b.packaged));
      // Reserve space for the passing fraction before assay; transport follows assay.
      const wanted = Math.min(q.assay.qty, assayCap / factor);
      const free = Math.max(0, p.storageCap - q.storage.qty * factor);
      const allowed = Math.min(wanted, free / (factor * (1 - reworkFraction)));
      const blocked = Math.max(0, wanted - allowed);
      if (blocked > 1e-9) { blockedDays++; blockedMaterial += blocked; }
      const assayed = q.assay.take(allowed);
      operations += assayed.length;
      for (const b of assayed) {
        q.storage.push(b.qty * (1 - reworkFraction), b.born, true);
        q.pack.push(b.qty * reworkFraction, b.born, true);
      }
      const assayQty = quantity(assayed);
      flow.assay += assayQty * factor; reworked += assayQty * reworkFraction;
      peakStorage = Math.max(peakStorage, q.storage.qty * factor);
      const dispatched = q.storage.take(transportCap / factor);
      operations += dispatched.length;
      if (operations > 1000000) throw new Error('This scenario creates too many fractional batches. Reduce its horizon or rework.');
      const dailyShipped = quantity(dispatched);
      for (const b of dispatched) { leadSum += b.qty * (day - b.born); shipBatches.push({qty: b.qty, born: b.born, day}); }
      shipped += dailyShipped; flow.transport += dailyShipped * factor;
      const queues = Object.fromEntries(STAGES.map(key => [key, Math.max(0, q[key].qty)]));
      const storage = queues.storage * factor;
      peakStorageEnd = Math.max(peakStorageEnd, storage);
      // End-of-day queue / entered daily capacity; outages do not manufacture infinite scores.
      // A positive queue at a zero-capacity stage ranks first; ties use WORK order.
      const pressure = {char: queues.char, seg: queues.seg, size: queues.size, pack: queues.pack, assay: queues.assay * factor, transport: storage};
      let dominant = null, max = 0;
      WORK.forEach(key => {
        const nominal = p[key + 'Cap'];
        const score = pressure[key] <= 1e-9 ? 0 : nominal === 0 ? Infinity : pressure[key] / nominal;
        if (score > max) { max = score; dominant = key; }
      });
      if (dominant) pressureDays[dominant]++;
      history.push({day, arrivals: arrival, queues, storage, shipped: dailyShipped, shippedLoad: dailyShipped * factor,
        completedLead: dailyShipped > 1e-9 ? sum(dispatched.map(b => b.qty * (day - b.born))) / dailyShipped : null,
        blocked: blocked > 1e-9, blockedMaterial: blocked, assayCap, transportCap});
    }
    const endQueues = history[history.length - 1].queues;
    const unfinished = sum(Object.values(endQueues));
    let ageSum = 0, oldestAge = null;
    for (const queue of Object.values(q)) for (const b of queue.remaining()) {
      ageSum += b.qty * (p.horizon - b.born);
      if (b.qty > 1e-9) oldestAge = Math.max(oldestAge === null ? 0 : oldestAge, p.horizon - b.born);
    }
    const endLoad = sum(Object.values(q).map(queue => queue.load(factor)));
    const allowanceAdded = packagedFirst * (factor - 1);
    return {params: p, seed, stochastic, factor, reworkFraction, arrivals, clean, shipped, shippedLoad: shipped * factor,
      unfinished, endQueues, endLoad, allowanceAdded, reworked, blockedDays, blockedMaterial, peakStorage, peakStorageEnd,
      avgLead: shipped > 1e-9 ? leadSum / shipped : null, unfinishedAge: unfinished > 1e-9 ? ageSum / unfinished : null,
      oldestAge, flow, available, utilization: Object.fromEntries(WORK.map(key => [key, available[key] > 0 ? flow[key] / available[key] : null])),
      pressureDays, history, shipBatches,
      materialBalanceError: arrivals - clean - shipped - unfinished,
      loadBalanceError: arrivals + allowanceAdded - clean - shipped * factor - endLoad};
  }
  function percentile(values, fraction) {
    const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
    if (!sorted.length) return null;
    const idx = (sorted.length - 1) * fraction, low = Math.floor(idx), high = Math.ceil(idx);
    return sorted[low] + (sorted[high] - sorted[low]) * (idx - low);
  }
  function stressSummary(runs) {
    if (!runs.length) throw new Error('At least one completed stress run is required.');
    const percentiles = key => [0.5, 0.8, 0.95].map(p => percentile(runs.map(r => r[key]), p));
    return {count: runs.length, leadRuns: runs.filter(r => r.avgLead !== null).length,
      lead: percentiles('avgLead'), peak: percentiles('peakStorage'), blocked: percentiles('blockedDays'),
      throughputExceedance: [0.5, 0.2, 0.05].map(p => percentile(runs.map(r => r.shippedLoad), p)),
      blockedShare: runs.filter(r => r.blockedDays > 0).length / runs.length};
  }
  function stressSeed(seed, index) { return (seed + Math.imul(index, 0x9E3779B9)) >>> 0; }
  return {STAGES, WORK, LIMITS, DEFAULTS, PRESETS, MAX_STRESS_DAYS, validate, validateStress, random,
    Queue, simulate, percentile, stressSummary, stressSeed};
});
