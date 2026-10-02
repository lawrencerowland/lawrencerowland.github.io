(function (root) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  function clean(value, label) {
    if (typeof value !== 'string' || !value.trim() || value.trim().length > 200) throw Error(label + ' needs 1–200 characters.');
    return value.trim();
  }
  function triad(id,title,concepts) {
    if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(id)) throw Error('Each triad needs a valid ID.');
    if (!Array.isArray(concepts) || concepts.length !== 3) throw Error('A completed triad needs exactly three concepts.');
    return {id,title:clean(title,'The title'),concepts:concepts.map((c,i) => clean(c,'Concept '+(i+1)))};
  }
  function addConcept(draft,title,concept) {
    const next = draft ? clone(draft) : {title:clean(title,'The title'),concepts:[]};
    if (!Array.isArray(next.concepts) || next.concepts.length >= 3) throw Error('Start a new triad after the third concept.');
    next.concepts.push(clean(concept,'The concept')); return next;
  }
  function replace(triads,id,title,concepts) {
    if (!triads.some(item => item.id === id)) throw Error('This triad no longer exists.');
    const next = triad(id,title,concepts); return triads.map(item => item.id === id ? next : clone(item));
  }
  function validateDocument(value) {
    if (!value || value.version !== 1 || !Array.isArray(value.triads) || value.triads.length > 500) throw Error('Use a version 1 triad file containing at most 500 triads.');
    const ids = new Set(), triads = value.triads.map(item => {
      if (!item || ids.has(item.id)) throw Error('Each triad needs a unique ID.');
      ids.add(item.id); return triad(item.id,item.title,item.concepts);
    });
    let draft = null;
    if (value.draft !== null && value.draft !== undefined) {
      if (!value.draft || !Array.isArray(value.draft.concepts) || ![1,2].includes(value.draft.concepts.length)) throw Error('A draft needs one or two concepts.');
      draft = {title:clean(value.draft.title,'Draft title'),concepts:value.draft.concepts.map(c => clean(c,'Draft concept'))};
    }
    return {version:1,triads,draft};
  }
  function parse(text) {
    if (typeof text !== 'string' || text.length > 1000000) throw Error('Use a JSON file smaller than 1 MB.');
    let value; try {value = JSON.parse(text);} catch (_) {throw Error('The JSON file could not be read.');}
    return validateDocument(value);
  }
  const api = {clean,triad,addConcept,replace,validateDocument,parse};
  if (typeof module === 'object' && module.exports) module.exports = api; else root.TriadModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
