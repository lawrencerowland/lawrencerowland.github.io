(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.MethodAtlas = api;
    const start = () => api.mount(root.document, root.fetch.bind(root), root);
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const ids = ['q', 'family', 'mode', 'view', 'tab', 'status', 'minExec', 'minExecVal', 'reset', 'showing', 'cardsView', 'mapView', 'map', 'mapList', 'legacyControls', 'legacyNotice', 'tryPetri'];
  const recordId = record => record.originalId || record.id;
  const initialState = () => ({ query: '', families: [], mode: 'reviewed', view: 'cards', tab: 'all', status: 'all', minExec: 0, selectedIds: null });
  const safeUrl = value => {
    if (typeof value !== 'string') return null;
    try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; } catch (_) { return null; }
  };
  function validateData(methods, history) {
    if (!Array.isArray(methods) || !Array.isArray(history) || methods.length !== 11 || history.length !== 11) throw new Error('Expected eleven reviewed and eleven earlier entries.');
    const oldIds = history.map(record => record && record.id);
    if (new Set(oldIds).size !== 11 || oldIds.some(id => typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id))) throw new Error('Earlier entry identifiers are invalid.');
    const newIds = methods.map(record => record && record.originalId);
    if (new Set(newIds).size !== 11 || newIds.some(id => !oldIds.includes(id))) throw new Error('Reviewed entries must preserve the earlier identifiers.');
    for (const method of methods) {
      const earlier = history.find(record => record.id === method.originalId);
      if (method.family !== earlier.family) throw new Error('Method families must be preserved.');
      for (const key of ['title', 'premise', 'why', 'nextProbe', 'correction']) if (typeof method[key] !== 'string' || !method[key].trim()) throw new Error('Reviewed text is incomplete.');
      for (const key of ['signals', 'failureModes']) if (!Array.isArray(method[key]) || method[key].some(value => typeof value !== 'string')) throw new Error('Reviewed lists are invalid.');
      for (const key of ['rigor', 'legibility', 'buildability', 'tab', 'status']) if (Object.hasOwn(method, key)) throw new Error('Earlier ratings cannot appear as reviewed evidence.');
      if (!Array.isArray(method.sources) || !method.sources.length || method.sources.some(source => !source || !safeUrl(source.url) || typeof source.title !== 'string' || typeof source.role !== 'string')) throw new Error('Reviewed sources are incomplete.');
      if (method.project !== null && (!method.project || !safeUrl(method.project.url) || typeof method.project.title !== 'string')) throw new Error('Project link is invalid.');
    }
    for (const record of history) {
      for (const key of ['rigor', 'legibility', 'buildability']) if (!Number.isFinite(record[key]) || record[key] < 0 || record[key] > 10) throw new Error('Earlier ratings are outside their original scale.');
    }
    return { methods, history };
  }
  function allText(value) {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(allText).join(' ');
    if (value && typeof value === 'object') return Object.values(value).map(allText).join(' ');
    return '';
  }
  function filterRecords(data, state) {
    const earlier = state.mode === 'earlier';
    const terms = (state.query || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    return (earlier ? data.history : data.methods).filter(record => {
      if (state.families && state.families.length && !state.families.includes(record.family)) return false;
      if (!terms.every(term => allText(record).toLowerCase().includes(term))) return false;
      if (state.selectedIds && !state.selectedIds.includes(recordId(record))) return false;
      return !earlier || ((!state.tab || state.tab === 'all' || record.tab === state.tab) &&
        (!state.status || state.status === 'all' || record.status === state.status) && record.legibility >= Number(state.minExec || 0));
    });
  }
  function changeMode(state, mode) {
    return { ...state, mode: mode === 'earlier' ? 'earlier' : 'reviewed', view: 'cards', tab: 'all', status: 'all', minExec: 0, selectedIds: null };
  }
  function resetState(state) { return { ...initialState(), mode: state.mode }; }
  function mapGroups(records) {
    const groups = new Map();
    for (const record of records) {
      const key = record.legibility + ':' + record.rigor;
      if (!groups.has(key)) groups.set(key, { x: record.legibility, y: record.rigor, records: [] });
      groups.get(key).records.push(record);
    }
    return [...groups.values()];
  }
  function editable(target) {
    for (let node = target; node; node = node.parentElement) {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(String(node.tagName || '').toUpperCase()) || node.isContentEditable) return true;
      const attr = node.getAttribute && node.getAttribute('contenteditable');
      if (attr !== null && attr !== undefined && attr !== 'false') return true;
    }
    return false;
  }
  function shortcut(event) {
    if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey || editable(event.target)) return null;
    if (event.key === '/') return 'search';
    if (!event.shiftKey && event.key && event.key.toLowerCase() === 'r') return 'reset';
    return null;
  }
  function hashId(hash, data) {
    let id;
    try { id = decodeURIComponent(String(hash || '').replace(/^#/, '')); } catch (_) { return null; }
    return data.methods.some(record => record.originalId === id) ? id : null;
  }
  async function loadData(fetcher) {
    const [methods, history] = await Promise.all(['methods.json', 'history.json'].map(async path => {
      const response = await fetcher(path);
      if (!response.ok) throw new Error('Could not load ' + path);
      return response.json();
    }));
    return validateData(methods, history);
  }
  function mount(document, fetcher, environment = {}) {
    const el = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
    if (Object.values(el).some(value => !value)) throw new Error('Atlas controls are missing.');
    let data = null;
    let state = initialState();
    let familyInputs = [];
    const controls = ['q', 'family', 'mode', 'view', 'tab', 'status', 'minExec', 'reset', 'tryPetri'].map(id => el[id]);
    const node = (tag, className, text) => {
      const item = document.createElement(tag);
      if (className) item.className = className;
      if (text !== undefined) item.textContent = text;
      return item;
    };
    const anchor = (text, url) => { const a = node('a', '', text); a.href = url; return a; };
    function field(card, heading, text) {
      const section = node('section', 'atlas-field');
      section.append(node('h3', '', heading), node('p', '', text)); card.append(section);
    }
    function list(card, heading, items) {
      const section = node('section', 'atlas-field');
      const ul = node('ul'); items.forEach(text => ul.append(node('li', '', text)));
      section.append(node('h3', '', heading), ul); card.append(section);
    }
    function card(record) {
      const earlier = state.mode === 'earlier';
      const id = recordId(record);
      const item = node('article', 'atlas-card'); item.id = id; item.tabIndex = -1;
      item.setAttribute('aria-labelledby', id + '-title');
      item.append(node('p', 'atlas-family', record.family));
      const title = node('h2', 'atlas-card-heading', record.title); title.id = id + '-title'; item.append(title);
      item.append(anchor('Link to this entry', '#' + encodeURIComponent(id)));
      field(item, 'The idea', record.premise);
      field(item, earlier ? 'Earlier rationale' : 'Why explore it?', record.why);
      field(item, earlier ? 'Earlier next probe' : 'A next check', record.nextProbe);
      if (earlier) {
        list(item, 'Earlier claimed signals', record.signals);
        list(item, 'Ways it can fail', record.failureModes);
        field(item, 'Earlier ratings · unvalidated', 'Rigor: ' + record.rigor + '/10 · Legibility: ' + record.legibility + '/10 · Buildability: ' + record.buildability + '/10');
        field(item, 'Earlier labels · unvalidated', 'Tab: ' + record.tab + ' · Status: ' + record.status);
        field(item, 'Original identifier', record.id);
      } else {
        const evidence = node('details', 'atlas-evidence');
        evidence.append(node('summary', '', 'Evidence, limits & sources'));
        list(evidence, 'What to look for', record.signals);
        list(evidence, 'Ways it can fail', record.failureModes);
        const correction = node('section', 'atlas-correction');
        correction.append(node('h3', '', 'What changed from the earlier note'), node('p', '', record.correction)); evidence.append(correction);
        const sources = node('section', 'atlas-sources'); sources.append(node('h3', '', 'Sources and scope'));
        const ul = node('ul');
        record.sources.forEach(source => {
          const li = node('li'); li.append(anchor(source.title, safeUrl(source.url)), node('p', '', source.role)); ul.append(li);
        });
        sources.append(ul); evidence.append(sources); item.append(evidence);
        if (record.project) { const p = node('p', 'atlas-project'); p.append(anchor(record.project.title, safeUrl(record.project.url))); item.append(p); }
      }
      return item;
    }
    function focusCard(id) {
      const item = document.getElementById(id);
      if (item) { item.focus({ preventScroll: true }); if (item.scrollIntoView) item.scrollIntoView({ block: 'start' }); }
    }
    function selectRecords(records) {
      state = { ...state, view: 'cards', selectedIds: records.map(recordId) }; syncControls(); render(); focusCard(recordId(records[0]));
    }
    function renderMap(records) {
      el.map.replaceChildren(); el.mapList.replaceChildren();
      for (const group of mapGroups(records)) {
        const point = node('button', 'atlas-map-point', String(group.records.length)); point.type = 'button';
        point.style.left = group.x * 10 + '%'; point.style.top = (10 - group.y) * 10 + '%';
        point.setAttribute('aria-label', group.records.map(record => record.title).join('; ') + '. Earlier legibility ' + group.x + '/10, rigor ' + group.y + '/10. Show ' + group.records.length + (group.records.length === 1 ? ' entry.' : ' entries.'));
        point.title = group.records.map(record => record.title).join('; ');
        point.addEventListener('click', () => selectRecords(group.records)); el.map.append(point);
      }
      for (const record of records) {
        const li = node('li', 'atlas-map-list-item');
        const button = node('button', '', record.title + ' — legibility ' + record.legibility + '/10; rigor ' + record.rigor + '/10; buildability ' + record.buildability + '/10');
        button.type = 'button'; button.addEventListener('click', () => selectRecords([record])); li.append(button); el.mapList.append(li);
      }
      if (!records.length) el.map.append(node('p', 'atlas-message', 'No entries match these filters. Clear filters to see them all.'));
    }
    function syncControls() {
      el.q.value = state.query; familyInputs.forEach(input => { input.checked = state.families.includes(input.value); }); el.mode.value = state.mode; el.view.value = state.view;
      el.tab.value = state.tab; el.status.value = state.status; el.minExec.value = String(state.minExec); el.minExecVal.textContent = String(state.minExec);
    }
    function render() {
      if (!data) return;
      const earlier = state.mode === 'earlier';
      if (!earlier) state.view = 'cards';
      el.legacyControls.hidden = !earlier; el.legacyNotice.hidden = !earlier;
      const viewControl = el.view.closest && (el.view.closest('[data-view-control]') || el.view.closest('label'));
      (viewControl || el.view).hidden = !earlier;
      const records = filterRecords(data, state);
      el.showing.textContent = records.length + ' of 11 ' + (earlier ? 'earlier entries' : 'reviewed entries') + (state.selectedIds ? ' · selected from the earlier map' : '');
      el.cardsView.hidden = state.view === 'map'; el.mapView.hidden = state.view !== 'map';
      el.cardsView.replaceChildren(...records.map(card));
      if (!records.length) el.cardsView.append(node('p', 'atlas-message', 'No entries match these filters. Clear filters to see them all.'));
      if (earlier) renderMap(records); else { el.map.replaceChildren(); el.mapList.replaceChildren(); }
      el.minExecVal.textContent = String(state.minExec);
    }
    function reset() { state = resetState(state); syncControls(); render(); el.q.focus(); }
    function reveal(id, reviewed = false) {
      if (!data || !data.methods.some(record => record.originalId === id)) return false;
      state = resetState(state); if (reviewed) state.mode = 'reviewed'; syncControls(); render(); focusCard(id); return true;
    }
    function filters() {
      state = { ...state, query: el.q.value, families: familyInputs.filter(input => input.checked).map(input => input.value), tab: el.tab.value, status: el.status.value, minExec: Number(el.minExec.value), selectedIds: null };
      render();
    }
    el.q.addEventListener('input', filters);
    ['tab', 'status'].forEach(id => el[id].addEventListener('change', filters)); el.minExec.addEventListener('input', filters);
    el.mode.addEventListener('change', () => { state = changeMode(state, el.mode.value); syncControls(); render(); });
    el.view.addEventListener('change', () => { state.view = state.mode === 'earlier' && el.view.value === 'map' ? 'map' : 'cards'; state.selectedIds = null; render(); });
    el.reset.addEventListener('click', reset);
    el.tryPetri.addEventListener('click', () => {
      if (reveal('petri-sched', true) && environment.history && environment.history.replaceState) environment.history.replaceState(null, '', '#petri-sched');
    });
    document.addEventListener('keydown', event => {
      if (!data) return;
      const action = shortcut(event); if (!action) return;
      event.preventDefault(); if (action === 'reset') reset(); else el.q.focus();
    });
    if (environment.addEventListener) environment.addEventListener('hashchange', () => {
      if (!data) return; const id = hashId(environment.location && environment.location.hash, data); if (id) reveal(id);
    });
    controls.forEach(control => { control.disabled = true; });
    el.showing.textContent = 'Loading the atlas…'; el.cardsView.setAttribute('aria-busy', 'true');
    const ready = loadData(fetcher).then(value => {
      data = value;
      familyInputs = [];
      const choices = [...new Set(data.methods.map(record => record.family))].sort().map(family => {
        const label = node('label', 'atlas-family-choice');
        const input = node('input'); input.type = 'checkbox'; input.value = family; input.checked = false;
        input.addEventListener('change', filters); familyInputs.push(input);
        label.append(input, node('span', '', family)); return label;
      });
      el.family.replaceChildren(...choices); controls.forEach(control => { control.disabled = false; }); syncControls(); render();
      const id = hashId(environment.location && environment.location.hash, data); if (id) reveal(id);
      return true;
    }).catch(() => {
      el.showing.textContent = 'Atlas unavailable'; el.cardsView.hidden = false; el.mapView.hidden = true;
      const message = node('div', 'atlas-message'); message.append(node('p', '', 'The atlas could not be loaded. Reload the page to try again, or read the source records.'));
      const reload = node('button', '', 'Reload the atlas'); reload.type = 'button'; reload.addEventListener('click', () => { if (environment.location && environment.location.reload) environment.location.reload(); });
      message.append(reload, anchor('Reviewed source records', 'methods.json'), anchor('Earlier source records', 'history.json'));
      el.cardsView.replaceChildren(message); return false;
    }).finally(() => el.cardsView.setAttribute('aria-busy', 'false'));
    return { ready, render, reset, reveal, getState: () => ({ ...state, families: [...state.families], selectedIds: state.selectedIds && [...state.selectedIds] }) };
  }
  return { recordId, safeUrl, initialState, validateData, filterRecords, changeMode, resetState, mapGroups, editable, shortcut, hashId, loadData, mount };
});
