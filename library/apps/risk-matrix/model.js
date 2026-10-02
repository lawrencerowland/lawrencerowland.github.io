(function (root) {
  'use strict';
  function scoreRisk(likelihood, impact) {
    if (![likelihood, impact].every(value => Number.isInteger(value) && value >= 1 && value <= 5)) {
      throw new RangeError('Choose whole-number likelihood and impact ratings from 1 to 5.');
    }
    const score = likelihood * impact;
    return { score, band: score >= 16 ? 'High' : score >= 6 ? 'Moderate' : 'Low' };
  }
  function groupRisks(risks) {
    const cells = new Map();
    risks.forEach(risk => {
      scoreRisk(risk.likelihood, risk.impact);
      const key = `${risk.likelihood},${risk.impact}`;
      if (!cells.has(key)) cells.set(key, []);
      cells.get(key).push(risk);
    });
    return cells;
  }
  const api = { scoreRisk, groupRisks };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RiskMatrix = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
