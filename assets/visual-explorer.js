/* Saved previews only: the linked examples retain their own models and controls. */
(function () {
  'use strict';
  function readState(search, items) {
    const params = new URLSearchParams(search);
    return {
      view: items.some(item => item.id === params.get('view')) ? params.get('view') : null
    };
  }

  function stateURL(href, state) {
    const url = new URL(href);
    // Retired filters must never narrow the picture wall, including old bookmarks.
    for (const key of ['q', 'topic', 'kind']) url.searchParams.delete(key);
    if (state.view) url.searchParams.set('view', state.view);
    else url.searchParams.delete('view');
    return url;
  }

  // Shared with the small Node test; no browser runtime dependency.
  if (typeof module !== 'undefined' && module.exports) module.exports = { readState, stateURL };
  if (typeof document === 'undefined') return;
  const root = document.querySelector('.viz-explorer');
  const dialog = document.getElementById('viz-dialog');
  if (!root || !dialog || typeof dialog.showModal !== 'function') return;
  const items = JSON.parse(document.getElementById('viz-data').textContent);
  const byId = new Map(items.map(item => [item.id, item]));
  const get = id => document.getElementById(id);
  const tiles = Array.from(root.querySelectorAll('[data-view]'));
  let state = readState(location.search, items);
  let returnFocus = null;
  let tooltipTile = null;
  let tooltipTimer;
  const saveURL = () => history.replaceState(null, '', stateURL(location.href, state));
  const asset = path => (root.dataset.baseurl || '') + path;
  const setText = (id, text) => { get(id).textContent = text; };

  function hideTooltip() {
    clearTimeout(tooltipTimer);
    if (tooltipTile) tooltipTile.querySelector('.viz-tooltip').hidden = true;
    tooltipTile = null;
  }

  function positionTooltip() {
    if (!tooltipTile) return;
    const tooltip = tooltipTile.querySelector('.viz-tooltip');
    const rect = tooltipTile.getBoundingClientRect();
    const viewport = window.visualViewport;
    const leftEdge = (viewport ? viewport.offsetLeft : 0) + 12;
    const topEdge = (viewport ? viewport.offsetTop : 0) + 12;
    const rightEdge = leftEdge + (viewport ? viewport.width : document.documentElement.clientWidth) - 24;
    const bottomEdge = topEdge + (viewport ? viewport.height : window.innerHeight) - 24;
    tooltip.style.maxWidth = `${rightEdge - leftEdge}px`;
    tooltip.style.maxHeight = `${bottomEdge - topEdge}px`;
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    const below = rect.bottom + 8;
    const top = below + height <= bottomEdge ? below : rect.top - height - 8;
    tooltip.style.left = `${Math.max(leftEdge, Math.min(rect.left + (rect.width - width) / 2, rightEdge - width))}px`;
    tooltip.style.top = `${Math.max(topEdge, Math.min(top, bottomEdge - height))}px`;
  }

  function showTooltip(tile) {
    if (dialog.open) return;
    hideTooltip();
    tooltipTile = tile;
    tile.querySelector('.viz-tooltip').hidden = false;
    positionTooltip();
  }

  function leaveTooltip(tile) {
    clearTimeout(tooltipTimer);
    // Leave enough time to cross the small gap onto the hint itself.
    tooltipTimer = setTimeout(() => {
      if (tooltipTile === tile && document.activeElement !== tile && !tile.matches(':hover')) hideTooltip();
    }, 160);
  }

  function renderPreview() {
    const item = byId.get(state.view);
    if (!item) return;
    const index = items.findIndex(view => view.id === item.id);
    setText('viz-position', `${index + 1} of ${items.length} views`);
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
    get('viz-next').disabled = index >= items.length - 1;
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
    hideTooltip();
    state.view = id;
    returnFocus = trigger || tiles.find(tile => tile.dataset.view === id);
    renderPreview();
    document.body.classList.add('viz-preview-open');
    if (!dialog.open) dialog.showModal();
    get('viz-close').focus();
    saveURL();
  }

  function step(direction) {
    const index = items.findIndex(item => item.id === state.view);
    const next = items[index + direction];
    if (!next) return;
    state.view = next.id;
    returnFocus = tiles.find(tile => tile.dataset.view === next.id);
    renderPreview();
    saveURL();
  }

  tiles.forEach(tile => {
    tile.setAttribute('aria-haspopup', 'dialog');
    tile.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') showTooltip(tile); });
    tile.addEventListener('pointerleave', () => leaveTooltip(tile));
    tile.addEventListener('focus', () => showTooltip(tile));
    tile.addEventListener('blur', () => leaveTooltip(tile));
    tile.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      openPreview(tile.dataset.view, tile);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && tooltipTile && !dialog.open) hideTooltip();
  });
  window.addEventListener('resize', positionTooltip);
  window.addEventListener('scroll', positionTooltip, true);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', positionTooltip);
    window.visualViewport.addEventListener('scroll', positionTooltip);
  }
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
    (returnFocus || root).focus();
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
    if (state.view) openPreview(state.view);
    else if (dialog.open) dialog.close();
    else saveURL();
  });
  saveURL();
  if (state.view) openPreview(state.view);
})();
