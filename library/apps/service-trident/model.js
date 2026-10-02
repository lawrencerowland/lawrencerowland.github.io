(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ServiceTrident = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const needs = ['Capability','Maturity','Performance'];
  const leads = ['Capability Planning','P3M3 Assessment','Programme Assurance & Recovery'];
  const levels = ['Portfolio','Programme','Project'];
  const leadMap = Object.freeze({Capability:leads[0],Maturity:leads[1],Performance:leads[2]});
  const recommendations = Object.freeze({Capability:['Portfolio','Programme'],Maturity:['Portfolio','Programme'],Performance:['Programme','Project']});
  function validate(state) {
    if (!state || (state.need !== null && !needs.includes(state.need)) || !Array.isArray(state.leverage) || state.leverage.some(level=>!levels.includes(level)) || new Set(state.leverage).size!==state.leverage.length) throw new TypeError('Use a listed need and distinct listed intervention levels.');
  }
  function initial() { return {need:null,leverage:[]}; }
  function chooseNeed(state, need) {validate(state);if(!needs.includes(need))throw new RangeError('Unknown need.');return {need,leverage:[...state.leverage]};}
  function toggleLevel(state, level) {validate(state);if(!levels.includes(level))throw new RangeError('Unknown intervention level.');return {...state,leverage:levels.filter(item=>item===level ? !state.leverage.includes(item):state.leverage.includes(item))};}
  function recommend(state) {validate(state);if(!state.need)throw new Error('Choose a need first.');return {...state,leverage:[...recommendations[state.need]]};}
  function clear(state) {validate(state);return {...state,leverage:[]};}
  function synopsis(state) {validate(state);return `Need: ${state.need || 'Not selected'}\nSuggested lead: ${state.need ? leadMap[state.need] : 'Not selected'}\nIntervention levels: ${state.leverage.length ? state.leverage.join(', ') : 'None selected'}\n\nIllustrative conversation guide; the mapping is an authored assumption, not a diagnosis or assessment result.`;}
  async function copyText(text, clipboard, timeoutMs = 1500) {
    if (!clipboard || typeof clipboard.writeText !== 'function') return false;
    let timer;
    try {
      return await Promise.race([
        Promise.resolve().then(()=>clipboard.writeText(text)).then(()=>true,()=>false),
        new Promise(resolve=>{timer=setTimeout(()=>resolve(false),timeoutMs);})
      ]);
    } finally {clearTimeout(timer);}
  }
  return {needs,leads,levels,leadMap,recommendations,initial,chooseNeed,toggleLevel,recommend,clear,synopsis,copyText};
});
