(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ContractBoard = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const FORMAT = 'contract-portfolio-board', STORAGE_KEY = 'contract-portfolio-board.v1';
  const MAX_BYTES = 1500000;
  const clone = value => JSON.parse(JSON.stringify(value));
  function bytes(value) { let size = 0; for (const char of value) { const code = char.codePointAt(0); size += code < 128 ? 1 : code < 2048 ? 2 : code < 65536 ? 3 : 4; } return size; }
  function object(value, keys, where) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error(where + ' must be an object.');
    for (const key of Object.keys(value)) if (!keys.includes(key)) throw Error(where + ': unrecognised field “' + key + '”. Keep or correct your file before importing.');
    for (const key of keys) if (!Object.hasOwn(value, key)) throw Error(where + ': missing ' + key + '.');
  }
  function text(value, name, max, empty = false) {
    if (typeof value !== 'string' || value.length > max || (!empty && !value.trim())) throw Error(name + ' must be ' + (empty ? 'text' : 'nonempty text') + ' of at most ' + max + ' characters.');
    return value;
  }
  function validate(input) {
    object(input, ['format', 'version', 'title', 'groups', 'items'], 'Board');
    if (input.format !== FORMAT || input.version !== 1) throw Error('Use a Contract Portfolio Board version 1 file.');
    text(input.title, 'Board title', 160);
    if (!Array.isArray(input.groups) || input.groups.length !== 7) throw Error('The board needs three contracts, Context, Internal, ConOps and Unassigned.');
    if (!Array.isArray(input.items) || input.items.length > 300) throw Error('Use at most 300 artefacts.');
    const ids = new Set(), itemIds = new Set(), placed = new Set(), counts = {}, lists = [];
    let workstreams = 0;
    function id(value) {
      if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/.test(value) || ids.has(value)) throw Error('Every group, workstream and artefact needs a unique ID (letters, numbers, hyphens or underscores).');
      ids.add(value);
    }
    for (const item of input.items) {
      object(item, ['id', 'title', 'notes', 'reviewed'], 'Artefact'); id(item.id); itemIds.add(item.id);
      text(item.title, 'Artefact title', 200); text(item.notes, 'Artefact notes', 4000, true);
      if (typeof item.reviewed !== 'boolean') throw Error('Reviewed must be true or false.');
    }
    for (const group of input.groups) {
      object(group, ['id', 'name', 'kind', 'items', 'workstreams'], 'Group'); id(group.id); text(group.name, 'Group name', 100);
      if (!['contract', 'context', 'internal', 'conops', 'unassigned'].includes(group.kind)) throw Error('Unknown group kind.');
      counts[group.kind] = (counts[group.kind] || 0) + 1;
      if (!Array.isArray(group.workstreams)) throw Error('Workstreams must be a list.');
      if (group.kind === 'unassigned' && group.workstreams.length) throw Error('Unassigned cannot contain workstreams.');
      lists.push(group.items);
      for (const stream of group.workstreams) {
        object(stream, ['id', 'name', 'items'], 'Workstream'); id(stream.id); text(stream.name, 'Workstream name', 100);
        lists.push(stream.items); workstreams++;
      }
    }
    if (counts.contract !== 3 || ['context', 'internal', 'conops', 'unassigned'].some(kind => counts[kind] !== 1)) throw Error('Keep exactly three contracts and one of each supporting group. Names can be changed.');
    if (workstreams > 60) throw Error('Use at most 60 workstreams.');
    for (const list of lists) {
      if (!Array.isArray(list)) throw Error('Each destination needs an artefact-ID list.');
      for (const itemId of list) {
        if (!itemIds.has(itemId)) throw Error('A destination refers to a missing artefact: ' + String(itemId));
        if (placed.has(itemId)) throw Error('An artefact is allocated more than once: ' + itemId);
        placed.add(itemId);
      }
    }
    if (placed.size !== itemIds.size) throw Error('Every artefact must have one destination, including Unassigned.');
    if (bytes(JSON.stringify(input, null, 2)) > MAX_BYTES) throw Error('The complete board must fit in a 1.5 MB JSON file. Shorten long notes or reduce the number of artefacts.');
    return clone(input);
  }
  function initial() {
    return {format: FORMAT, version: 1, title: 'Project scope and ownership', groups: [
      {id: 'contract1', name: 'Contract 1', kind: 'contract', items: [], workstreams: [{id: 'stream1', name: 'Digital Strategy', items: []}]},
      {id: 'contract2', name: 'Contract 2', kind: 'contract', items: [], workstreams: []},
      {id: 'contract3', name: 'Contract 3', kind: 'contract', items: [], workstreams: []},
      {id: 'context', name: 'Context', kind: 'context', items: [], workstreams: []},
      {id: 'internal', name: 'Internal ownership', kind: 'internal', items: [], workstreams: []},
      {id: 'conops', name: 'Concept of operations', kind: 'conops', items: [], workstreams: []},
      {id: 'unassigned', name: 'Unassigned', kind: 'unassigned', items: ['item1', 'item2', 'item3', 'item4'], workstreams: []}
    ], items: ['Project charter', 'Future state processes', 'Business requirements', 'Stakeholder analysis'].map((title, i) => ({id: 'item' + (i + 1), title, notes: '', reviewed: false}))};
  }
  function containers(board) {
    return board.groups.flatMap(group => [{id: group.id, name: group.name + ' · direct', group, items: group.items}, ...group.workstreams.map(stream => ({id: stream.id, name: group.name + ' / ' + stream.name, group, stream, items: stream.items}))]);
  }
  function destination(board, id) {
    const found = containers(board).find(c => c.id === id);
    if (!found) throw Error('Choose an existing destination.');
    return found;
  }
  function locate(board, id) {
    const found = containers(board).find(c => c.items.includes(id));
    if (!found) throw Error('Artefact no longer exists.');
    return found;
  }
  function newId(board, prefix) {
    const ids = new Set([...board.items.map(i => i.id), ...containers(board).map(c => c.id)]);
    let i = 1; while (ids.has(prefix + i)) i++;
    return prefix + i;
  }
  function change(board, edit) { const next = validate(board); edit(next); return validate(next); }
  function selectedIds(board, ids) {
    if (!Array.isArray(ids) || !ids.length || new Set(ids).size !== ids.length || ids.some(id => !board.items.some(item => item.id === id))) throw Error('Select one or more existing artefacts.');
    const set = new Set(ids);
    return containers(board).flatMap(c => c.items).filter(id => set.has(id));
  }
  function addItem(board, title, notes = '', target) {
    return change(board, next => {
      const id = newId(next, 'item');
      destination(next, target || next.groups.find(g => g.kind === 'unassigned').id).items.push(id);
      next.items.push({id, title, notes, reviewed: false});
    });
  }
  function editItem(board, id, title, notes, reviewed) {
    return change(board, next => {
      const item = next.items.find(i => i.id === id); if (!item) throw Error('Artefact no longer exists.');
      Object.assign(item, {title, notes, reviewed});
    });
  }
  function moveItems(board, ids, target) {
    return change(board, next => {
      const ordered = selectedIds(next, ids), to = destination(next, target);
      // Items already in the destination keep their order; only arrivals are appended.
      for (const id of ordered) { const from = locate(next, id); if (from.id !== to.id) { from.items.splice(from.items.indexOf(id), 1); to.items.push(id); } }
    });
  }
  function removeItems(board, ids) {
    return change(board, next => { for (const id of selectedIds(next, ids)) { const from = locate(next, id); from.items.splice(from.items.indexOf(id), 1); } next.items = next.items.filter(i => !ids.includes(i.id)); });
  }
  function reorderItem(board, id, direction) {
    return change(board, next => { if (![1, -1].includes(direction)) throw Error('Use up or down.'); const list = locate(next, id).items, i = list.indexOf(id), j = i + direction; if (j >= 0 && j < list.length) [list[i], list[j]] = [list[j], list[i]]; });
  }
  function rename(board, id, name) {
    return change(board, next => { const c = destination(next, id); (c.stream || c.group).name = name; });
  }
  function setTitle(board, title) { return change(board, next => { next.title = title; }); }
  function addWorkstream(board, groupId, name) {
    return change(board, next => { const group = next.groups.find(g => g.id === groupId); if (!group || group.kind === 'unassigned') throw Error('Choose a contract or supporting group.'); group.workstreams.push({id: newId(next, 'stream'), name, items: []}); });
  }
  function moveWorkstream(board, id, groupId) {
    return change(board, next => { const from = destination(next, id), to = next.groups.find(g => g.id === groupId); if (!from.stream || !to || to.kind === 'unassigned') throw Error('Choose a workstream and a contract or supporting group.'); if (from.group.id !== to.id) { from.group.workstreams.splice(from.group.workstreams.indexOf(from.stream), 1); to.workstreams.push(from.stream); } });
  }
  function reorderWorkstream(board, id, direction) {
    return change(board, next => { const c = destination(next, id); if (!c.stream || ![1, -1].includes(direction)) throw Error('Choose a workstream and up or down.'); const list = c.group.workstreams, i = list.indexOf(c.stream), j = i + direction; if (j >= 0 && j < list.length) [list[i], list[j]] = [list[j], list[i]]; });
  }
  function removeWorkstream(board, id) {
    return change(board, next => { const c = destination(next, id); if (!c.stream) throw Error('Choose a workstream.'); if (c.items.length) throw Error('Move the artefacts first. Only empty workstreams can be removed.'); c.group.workstreams.splice(c.group.workstreams.indexOf(c.stream), 1); });
  }
  function splitWorkstream(board, id, ids, name) {
    return change(board, next => {
      const from = destination(next, id); if (!from.stream) throw Error('Choose a workstream.');
      const selected = selectedIds(next, ids); if (selected.some(itemId => !from.items.includes(itemId))) throw Error('Choose artefacts from this workstream only.');
      const stream = {id: newId(next, 'stream'), name, items: from.items.filter(itemId => ids.includes(itemId))};
      from.stream.items = from.items.filter(itemId => !ids.includes(itemId));
      from.group.workstreams.splice(from.group.workstreams.indexOf(from.stream) + 1, 0, stream);
    });
  }
  function matches(board, item, query, reviewed = 'all') {
    const c = locate(board, item.id), haystack = [item.title, item.notes, c.group.name, c.stream ? c.stream.name : ''].join(' ').toLocaleLowerCase();
    return haystack.includes(query.trim().toLocaleLowerCase()) && (reviewed === 'all' || item.reviewed === (reviewed === 'yes'));
  }
  function parse(source) {
    if (typeof source !== 'string' || source.length > MAX_BYTES || bytes(source) > MAX_BYTES) throw Error('Use a JSON file smaller than 1.5 MB.');
    let value; try { value = JSON.parse(source); } catch (_) { throw Error('JSON could not be read. Correct the text and try again; the board is unchanged.'); }
    return validate(value);
  }
  function serialize(board) { return JSON.stringify(validate(board), null, 2); }
  class History {
    constructor(board) { this.current = validate(board); this.past = []; this.future = []; }
    commit(board) { const next = validate(board); if (JSON.stringify(next) === JSON.stringify(this.current)) return false; this.past.push(this.current); if (this.past.length > 100) this.past.shift(); this.current = next; this.future = []; return true; }
    undo() { if (!this.past.length) return false; this.future.push(this.current); this.current = this.past.pop(); return true; }
    redo() { if (!this.future.length) return false; this.past.push(this.current); this.current = this.future.pop(); return true; }
  }
  function save(storage, board, savedAt = new Date().toISOString()) {
    const valid = validate(board), record = {savedAt, board: valid};
    storage.setItem(STORAGE_KEY, JSON.stringify(record));
    return record;
  }
  function load(storage) {
    const raw = storage.getItem(STORAGE_KEY); if (raw === null) return null;
    if (raw.length > MAX_BYTES) throw Error('The saved board is too large. It has not been replaced.');
    let record; try { record = JSON.parse(raw); } catch (_) { throw Error('The saved board is not readable JSON. It has not been replaced.'); }
    object(record, ['savedAt', 'board'], 'Saved board');
    if (typeof record.savedAt !== 'string' || !Number.isFinite(Date.parse(record.savedAt))) throw Error('The saved board has an invalid saved time.');
    return {savedAt: record.savedAt, board: validate(record.board)};
  }
  return {FORMAT, STORAGE_KEY, MAX_BYTES, clone, initial, validate, containers, destination, locate, newId, addItem, editItem, moveItems, removeItems, reorderItem, rename, setTitle, addWorkstream, moveWorkstream, reorderWorkstream, removeWorkstream, splitWorkstream, matches, parse, serialize, History, save, load};
});
