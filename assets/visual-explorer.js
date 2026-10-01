/* Saved previews only: the linked examples retain their own models and controls. */
(function () {
  'use strict';
  const TOPICS = ['all', 'relationships', 'processes', 'resources', 'choices', 'uncertainty'];
  const KINDS = ['all', 'interactive', 'diagram'];
  const normalise = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  function readState(search, items) {
    const params = new URLSearchParams(search);
    return {
      q: (params.get('q') || '').trim(),
      topic: TOPICS.includes(params.get('topic')) ? params.get('topic') : 'all',
      kind: KINDS.includes(params.get('kind')) ? params.get('kind') : 'all',
      view: items.some(item => item.id === params.get('view')) ? params.get('view') : null
    };
  }

  function matchingItems(items, state) {
    const words = normalise(state.q).split(/\s+/).filter(Boolean);
    return items.filter(item => {
      if (state.topic !== 'all' && !item.topics.includes(state.topic)) return false;
      if (state.kind !== 'all' && item.kind !== state.kind) return false;
      const haystack = normalise([item.title, item.home, item.caption, item.look, item.limit,
        item.status, item.year, item.kind, ...item.topics].join(' '));
      return words.every(word => haystack.includes(word));
    });
  }

  function stateURL(href, state) {
    const url = new URL(href);
    for (const key of ['q', 'topic', 'kind', 'view']) {
      const value = state[key];
      if (value && value !== 'all') url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    return url;
  }

  // Shared with the small Node test; no browser runtime dependency.
  if (typeof module !== 'undefined' && module.exports) module.exports = { readState, matchingItems, stateURL };
  if (typeof document === 'undefined') return;
  const root = document.querySelector('.viz-explorer');
  const dialog = document.getElementById('viz-dialog');
  if (!root || !dialog || typeof dialog.showModal !== 'function') return;
  const items = JSON.parse(document.getElementById('viz-data').textContent);
  const byId = new Map(items.map(item => [item.id, item]));
  const get = id => document.getElementById(id);
  const tiles = Array.from(root.querySelectorAll('[data-view]'));
  const search = get('viz-search');
  const kind = get('viz-kind');
  const topicButtons = Array.from(root.querySelectorAll('[data-topic]'));
  let state = readState(location.search, items);
  let visible = [];
  let returnFocus = null;
  const saveURL = () => history.replaceState(null, '', stateURL(location.href, state));
  const asset = path => (root.dataset.baseurl || '') + path;
  const setText = (id, text) => { get(id).textContent = text; };

  function renderGrid() {
    visible = matchingItems(items, state);
    const ids = new Set(visible.map(item => item.id));
    tiles.forEach(tile => { tile.hidden = !ids.has(tile.dataset.view); });
    topicButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === state.topic)));
    search.value = state.q;
    kind.value = state.kind;
    setText('viz-count', `${visible.length} of ${items.length} views`);
    get('viz-reset').hidden = !state.q && state.topic === 'all' && state.kind === 'all';
    get('viz-empty').hidden = visible.length !== 0;
  }

  function renderPreview() {
    const item = byId.get(state.view);
    if (!item) return;
    const index = visible.findIndex(view => view.id === item.id);
    setText('viz-position', `${index + 1} of ${visible.length} views`);
    setText('viz-detail-title', item.title);
    setText('viz-detail-home', item.home);
    setText('viz-detail-status', [item.status, item.year].filter(Boolean).join(' · '));
    setText('viz-caption', item.caption);
    setText('viz-look', item.look);
    setText('viz-limit', item.limit);
    setText('viz-state', item.state);
    get('viz-state-wrap').hidden = !item.state;
    const picture = get('viz-detail-image');
    picture.alt = item.alt;
    picture.width = item.width;
    picture.height = item.height;
    picture.src = asset(item.image);
    get('viz-full-image').href = asset(item.image);
    get('viz-source').href = item.url;
    get('viz-source').textContent = item.kind === 'interactive' ? 'Open interactive example →' : 'Read the original example →';
    setText('viz-capture', item.capture);
    setText('viz-checked', `Saved ${item.checked}`);
    get('viz-original-wrap').hidden = !item.source_image;
    get('viz-original').href = item.source_image || item.url;
    get('viz-previous').disabled = index <= 0;
    get('viz-next').disabled = index >= visible.length - 1;
    const related = get('viz-related-links');
    related.replaceChildren();
    for (const link of item.related || []) {
      const companion = byId.get(link.id);
      if (!companion) continue;
      const anchor = document.createElement('a');
      anchor.className = 'viz-related-link';
      anchor.href = stateURL(location.href, { ...state, view: companion.id }).href;
      anchor.setAttribute('aria-label', `Compare: ${companion.title}`);
      const thumbnail = document.createElement('img');
      thumbnail.src = asset(companion.thumb);
      thumbnail.alt = '';
      thumbnail.width = companion.width;
      thumbnail.height = companion.height;
      const label = document.createElement('span');
      label.textContent = link.label;
      anchor.append(thumbnail, label);
      anchor.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        openPreview(companion.id);
        dialog.scrollTop = 0;
      });
      related.append(anchor);
    }
    get('viz-related').hidden = !related.childElementCount;
  }

  function openPreview(id, trigger) {
    if (!byId.has(id)) return;
    // A shared view link always opens, even with stale or contradictory filters.
    if (!visible.some(item => item.id === id)) {
      state = { q: '', topic: 'all', kind: 'all', view: id };
      renderGrid();
    }
    state.view = id;
    returnFocus = trigger || tiles.find(tile => tile.dataset.view === id);
    renderPreview();
    document.body.classList.add('viz-preview-open');
    if (!dialog.open) dialog.showModal();
    get('viz-close').focus();
    saveURL();
  }

  function step(direction) {
    const index = visible.findIndex(item => item.id === state.view);
    const next = visible[index + direction];
    if (!next) return;
    state.view = next.id;
    returnFocus = tiles.find(tile => tile.dataset.view === next.id);
    renderPreview();
    saveURL();
  }

  tiles.forEach(tile => {
    tile.setAttribute('aria-haspopup', 'dialog');
    tile.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      openPreview(tile.dataset.view, tile);
    });
  });
  get('viz-controls').hidden = false;
  const filters = get('viz-filters');
  filters.hidden = false;
  const wideScreen = window.matchMedia('(min-width: 761px)');
  filters.open = wideScreen.matches || Boolean(state.q || state.topic !== 'all' || state.kind !== 'all');
  wideScreen.addEventListener('change', event => { if (event.matches) filters.open = true; });
  get('viz-controls').addEventListener('submit', event => event.preventDefault());
  search.addEventListener('input', () => {
    const cursor = search.selectionStart;
    state.q = search.value; // Keep spaces while typing multi-word searches.
    renderGrid();
    if (cursor !== null) search.setSelectionRange(cursor, cursor);
    saveURL();
  });
  kind.addEventListener('change', () => { state.kind = kind.value; renderGrid(); saveURL(); });
  topicButtons.forEach(button => button.addEventListener('click', () => {
    state.topic = button.dataset.topic; renderGrid(); saveURL();
  }));
  get('viz-controls').addEventListener('reset', event => {
    event.preventDefault();
    state = { q: '', topic: 'all', kind: 'all', view: null };
    renderGrid(); saveURL(); search.focus();
  });
  get('viz-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    state.view = null;
    document.body.classList.remove('viz-preview-open');
    saveURL();
    (returnFocus && !returnFocus.hidden ? returnFocus : get('viz-count')).focus();
  });
  get('viz-previous').addEventListener('click', () => step(-1));
  get('viz-next').addEventListener('click', () => step(1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const focusable = Array.from(dialog.querySelectorAll('a[href], button:not([disabled])'))
        .filter(element => element.getClientRects().length && !element.closest('[hidden]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  window.addEventListener('popstate', () => {
    state = readState(location.search, items);
    if (state.q || state.topic !== 'all' || state.kind !== 'all') filters.open = true;
    renderGrid();
    if (state.view) openPreview(state.view);
    else if (dialog.open) dialog.close();
  });
  renderGrid();
  if (state.view) openPreview(state.view);
})();
