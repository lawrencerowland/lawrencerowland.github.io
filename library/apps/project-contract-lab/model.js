(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ContractLab = factory();
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const packages = Object.freeze([
    { name: 'Bridge construction', cost: 45, value: 55 },
    { name: 'Tunnel excavation', cost: 50, value: 60 },
    { name: 'Station renovation', cost: 40, value: 50 },
    { name: 'Signalling system upgrade', cost: 55, value: 65 },
    { name: 'Track electrification', cost: 48, value: 58 }
  ].map(Object.freeze));
  function amount(value, name) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100 || !Number.isInteger(value))
      throw new Error(name + ' must be a whole number from 0 to 100.');
    return value;
  }
  function validateTerms(input) {
    if (!input || typeof input !== 'object') throw new Error('A package needs cost, value and both outside-option surpluses.');
    return {
      cost: amount(input.cost, 'Supplier cost'), value: amount(input.value, 'Client value'),
      supplierAlternative: amount(input.supplierAlternative, 'Supplier outside-option surplus'),
      clientAlternative: amount(input.clientAlternative, 'Client outside-option surplus')
    };
  }
  function reservations(input) {
    const terms = validateTerms(input);
    const lower = terms.cost + terms.supplierAlternative;
    const upper = terms.value - terms.clientAlternative;
    return { ...terms, lower, upper, exists: lower <= upper, surplus: upper - lower };
  }
  function analyse(input, supplierAsk, clientBid) {
    const zone = reservations(input);
    const ask = amount(supplierAsk, 'Supplier ask'), bid = amount(clientBid, 'Client bid');
    const lower = Math.max(zone.lower, ask), upper = Math.min(zone.upper, bid);
    const agreement = lower <= upper;
    const price = agreement ? (lower + upper) / 2 : null;
    const reason = !zone.exists ? 'no-zone' : ask > bid ? 'uncrossed-offers' : !agreement ? 'outside-reservations' : 'agreement';
    return {
      zone, ask, bid, lower, upper, agreement, reason, price,
      supplierSurplus: agreement ? price - zone.cost : null,
      clientSurplus: agreement ? zone.value - price : null,
      supplierGain: agreement ? price - zone.lower : null,
      clientGain: agreement ? zone.upper - price : null
    };
  }
  function termsFor(index) { return { cost: packages[index].cost, value: packages[index].value, supplierAlternative: 0, clientAlternative: 0 }; }
  function start() { return { round: 0, stage: 0, terms: termsFor(0), ask: 50, bid: 50, history: [], finished: false }; }
  function setTerms(state, input) {
    if (state.finished || state.stage !== 0) throw new Error('Change assumptions at the scenario step.');
    return { ...state, terms: validateTerms(input) };
  }
  function setOffer(state, party, value) {
    if (state.finished || (party !== 'ask' && party !== 'bid') || state.stage !== (party === 'ask' ? 1 : 2)) throw new Error('Use the current party’s turn to change its offer.');
    return { ...state, [party]: amount(value, party === 'ask' ? 'Supplier ask' : 'Client bid') };
  }
  function next(state) {
    if (state.finished || state.stage >= 3) throw new Error('Record the analysis before moving to another package.');
    return { ...state, stage: state.stage + 1 };
  }
  function back(state) { return state.finished ? state : { ...state, stage: Math.max(0, state.stage - 1) }; }
  function record(state) {
    if (state.finished) return state;
    if (state.stage !== 3) throw new Error('Complete all four steps before recording this package.');
    const result = { package: packages[state.round].name, terms: { ...state.terms }, ...analyse(state.terms, state.ask, state.bid) };
    const history = [...state.history, result];
    if (state.round === packages.length - 1) return { ...state, history, finished: true };
    const round = state.round + 1;
    return { round, stage: 0, terms: termsFor(round), ask: 50, bid: 50, history, finished: false };
  }
  function summary(history) {
    return history.reduce((sum, result) => ({
      recorded: sum.recorded + 1, agreements: sum.agreements + Number(result.agreement),
      supplierGain: sum.supplierGain + (result.supplierGain || 0),
      clientGain: sum.clientGain + (result.clientGain || 0)
    }), { recorded: 0, agreements: 0, supplierGain: 0, clientGain: 0 });
  }
  // A declared teaching activity: this is a PWDD contribution, not a payment assessment.
  function activityContribution(completed) {
    if (typeof completed !== 'boolean') throw new Error('Activity completion must be true or false.');
    return completed ? 150000 : 0;
  }
  return { packages, validateTerms, reservations, analyse, start, setTerms, setOffer, next, back, record, summary, activityContribution };
});
