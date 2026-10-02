(function (root) {
  'use strict';
  function evaluate(criteria, options) {
    const errors = [];
    if (!criteria.length) errors.push('Add at least one criterion.');
    if (!options.length) errors.push('Add at least one option.');
    criteria.forEach((criterion, index) => {
      if (typeof criterion.name !== 'string' || !criterion.name.trim()) errors.push(`Name criterion ${index + 1}.`);
      if (!Number.isFinite(criterion.weight) || criterion.weight < 0) errors.push(`Give criterion ${index + 1} a finite weight of zero or more.`);
    });
    const maxWeight = criteria.reduce((max, criterion) => Math.max(max, criterion.weight || 0), 0);
    if (criteria.length && maxWeight === 0) errors.push('Give at least one criterion a positive weight.');
    options.forEach((option, index) => {
      if (typeof option.name !== 'string' || !option.name.trim()) errors.push(`Name option ${index + 1}.`);
      if (!Array.isArray(option.ratings) || option.ratings.length !== criteria.length ||
          option.ratings.some(rating => !Number.isFinite(rating) || rating < 1 || rating > 5)) {
        errors.push(`Complete every rating for option ${index + 1}, using numbers from 1 to 5.`);
      }
    });
    if (errors.length) return { errors, scores: [], leaders: [], shares: [] };
    // Scale first so finite but very large weights cannot overflow the normalised score.
    const scaled = criteria.map(criterion => criterion.weight / maxWeight);
    const scaledSum = scaled.reduce((sum, weight) => sum + weight, 0);
    const shares = scaled.map(weight => weight / scaledSum);
    const scores = options.map(option => ({
      raw: option.ratings.reduce((sum, rating, i) => sum + rating * criteria[i].weight, 0),
      normalised: option.ratings.reduce((sum, rating, i) => sum + rating * shares[i], 0)
    }));
    const highest = scores.reduce((max, score) => Math.max(max, score.normalised), -Infinity);
    const leaders = scores.flatMap((score, i) => Math.abs(score.normalised - highest) <= 1e-12 ? [i] : []);
    return { errors, scores, leaders, shares };
  }
  const api = { evaluate };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WeightedDecision = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
