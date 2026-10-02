/* Power/interest ratings are judgements, not measured probabilities. */
(function (root) {
  'use strict';
  function rating(value) {
    if (String(value).trim() === '') throw new Error('Enter both scores.');
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || number > 100) throw new Error('Use scores from 0 to 100.');
    return number;
  }
  function stakeholder(name, power, interest) {
    name = String(name).trim();
    if (!name) throw new Error('Enter a stakeholder name.');
    if (name.length > 160) throw new Error('Keep the name within 160 characters.');
    return { name, power: rating(power), interest: rating(interest) };
  }
  function category(power, interest) {
    return power >= 50 ? (interest >= 50 ? 'Manage closely' : 'Keep satisfied') : (interest >= 50 ? 'Keep informed' : 'Monitor');
  }
  function coordinates(power, interest) { return { x: 60 + rating(interest) / 100 * 500, y: 500 - rating(power) / 100 * 440 }; }
  const api = { rating, stakeholder, category, coordinates };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.StakeholderMap = api;
})(typeof globalThis === 'undefined' ? this : globalThis);
