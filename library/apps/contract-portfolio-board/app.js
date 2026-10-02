(function () {
  'use strict';
  const M = window.ContractBoard, $ = id => document.getElementById(id);
  const history = new M.History(M.initial());
  let selected = new Set(), savedFingerprint = null, savedAt = null, editorApply = null, editorReturnFocus = null, fileReadToken = 0;
  const board = () => history.current;
  const kindDescriptions = {
    contract: 'Proposed supplier scope · a planning package',
    context: 'Background, constraints and assumptions',
    internal: 'Work and decisions you intend to retain',
    conops: 'How the future service will be used and operated',
    unassigned: 'Candidate artefacts awaiting a primary home'
  };
  function el(tag, value, className) { const node = document.createElement(tag); if (value !== undefined) node.textContent = value; if (className) node.className = className; return node; }
  function button(label, action, options = {}) {
    const node = el('button', label); node.type = 'button'; node.disabled = !!options.disabled;
    if (options.label) node.setAttribute('aria-label', options.label);
    if (options.focus) node.dataset.focus = options.focus;
    node.addEventListener('click', () => safe(action)); return node;
  }
  function safe(action) { try { $('error').textContent = ''; action(); } catch (error) { $('error').textContent = error.message; } }
  function report(message) { $('status').textContent = message; }
  function fillSelect(select, entries, selectedValue) {
    select.replaceChildren();
    for (const [value, label] of entries) { const option = el('option', label); option.value = value; select.append(option); }
    if (entries.some(([value]) => value === selectedValue)) select.value = selectedValue;
  }
  function clearFilter() { $('filter').value = ''; $('review-filter').value = 'all'; }
  function mutate(next, message, clear = false) {
    history.commit(next);
    if (clear) { selected.clear(); clearFilter(); }
    render(); report(message);
  }
  function saveStatus() {
    const current = M.serialize(board());
    if (savedFingerprint === null) $('save-status').textContent = 'The current board has not been saved locally. Save or export to keep your edits.';
    else $('save-status').textContent = (current === savedFingerprint ? 'Matches the local save' : 'Changes since the local save') + ' · ' + new Date(savedAt).toLocaleString() + '. Save is explicit; only that version reopens.';
  }
  function renderControls() {
    selected = new Set([...selected].filter(id => board().items.some(item => item.id === id && M.matches(board(), item, $('filter').value, $('review-filter').value))));
    const ids = [...selected], one = ids.length === 1;
    $('board-title').textContent = board().title;
    $('undo').disabled = !history.past.length; $('redo').disabled = !history.future.length;
    for (const id of ['move-selected', 'clear-selection', 'delete-selected']) $(id).disabled = !ids.length;
    $('edit-selected').disabled = !one;
    $('item-up').disabled = !one || M.locate(board(), ids[0]).items.indexOf(ids[0]) === 0;
    $('item-down').disabled = !one || M.locate(board(), ids[0]).items.indexOf(ids[0]) === M.locate(board(), ids[0]).items.length - 1;
    $('selection-status').textContent = ids.length ? ids.length + (one ? ' artefact selected.' : ' artefacts selected.') : 'No artefacts selected.';
    fillSelect($('destination'), M.containers(board()).map(c => [c.id, c.name]), $('destination').value);
    const visible = board().items.filter(item => M.matches(board(), item, $('filter').value, $('review-filter').value)).length;
    const unassigned = board().groups.find(g => g.kind === 'unassigned').items.length;
    $('counts').textContent = visible + ' of ' + board().items.length + ' artefacts shown · ' + unassigned + ' unassigned · ' + board().items.filter(i => i.reviewed).length + ' reviewed.';
    saveStatus();
  }
  function card(item) {
    const li = el('li', undefined, 'card' + (selected.has(item.id) ? ' selected' : '')); li.dataset.item = item.id;
    const selectLabel = el('label', undefined, 'card-title'), select = document.createElement('input');
    select.type = 'checkbox'; select.checked = selected.has(item.id); select.dataset.focus = 'select-' + item.id;
    select.setAttribute('aria-label', 'Select ' + item.title);
    select.addEventListener('change', () => { select.checked ? selected.add(item.id) : selected.delete(item.id); render(); });
    selectLabel.append(select, el('span', item.title)); li.append(selectLabel);
    if (item.notes) li.append(el('p', item.notes, 'card-note'));
    const reviewLabel = el('label', undefined, 'reviewed'), review = document.createElement('input');
    review.type = 'checkbox'; review.checked = item.reviewed; review.dataset.focus = 'review-' + item.id;
    review.setAttribute('aria-label', 'Reviewed: ' + item.title);
    review.addEventListener('change', () => safe(() => mutate(M.editItem(board(), item.id, item.title, item.notes, review.checked), item.title + (review.checked ? ' marked reviewed.' : ' review tick cleared.'))));
    reviewLabel.append(review, el('span', 'Reviewed')); li.append(reviewLabel); return li;
  }
  function itemList(ids, label) {
    const list = el('ul', undefined, 'items'); list.setAttribute('aria-label', label);
    for (const id of ids) { const item = board().items.find(i => i.id === id); if (M.matches(board(), item, $('filter').value, $('review-filter').value)) list.append(card(item)); }
    if (!list.children.length) list.append(el('li', ids.length ? 'No matching artefacts.' : 'No artefacts yet.', 'empty'));
    return list;
  }
  function placeButton(id, name) {
    return button('Place selected here', () => moveSelected(id), {disabled: !selected.size, label: 'Place selected artefacts in ' + name, focus: 'place-' + id});
  }
  function buildGroup(group) {
    const section = el('section', undefined, 'group'); section.dataset.kind = group.kind;
    const heading = el('div', undefined, 'group-heading'), title = el('h2', group.name); title.id = 'heading-' + group.id;
    section.setAttribute('aria-labelledby', title.id);
    heading.append(title, button('Rename', () => renameGroup(group), {label: 'Rename ' + group.name, focus: 'rename-' + group.id})); section.append(heading);
    section.append(el('p', kindDescriptions[group.kind], 'group-description'));
    const toolbar = el('div', undefined, 'toolbar');
    toolbar.append(placeButton(group.id, group.name));
    if (group.kind !== 'unassigned') toolbar.append(button('+ Workstream', () => createWorkstream(group.id), {label: 'Add workstream in ' + group.name, focus: 'add-' + group.id}));
    section.append(toolbar, itemList(group.items, group.name + ' direct artefacts'));
    for (const [index, stream] of group.workstreams.entries()) {
      const container = el('section', undefined, 'workstream'); container.dataset.stream = stream.id;
      const streamTitle = el('h3', stream.name); streamTitle.id = 'heading-' + stream.id; container.setAttribute('aria-labelledby', streamTitle.id); container.append(streamTitle);
      const actions = el('div', undefined, 'stream-actions');
      actions.append(button('Edit / move', () => editWorkstream(stream.id), {label: 'Edit or move ' + stream.name, focus: 'edit-' + stream.id}),
        button('Split', () => splitWorkstream(stream.id), {disabled: !stream.items.length, label: 'Split ' + stream.name, focus: 'split-' + stream.id}),
        button('↑', () => mutate(M.reorderWorkstream(board(), stream.id, -1), stream.name + ' moved up.'), {disabled: index === 0, label: 'Move workstream ' + stream.name + ' up', focus: 'up-' + stream.id}),
        button('↓', () => mutate(M.reorderWorkstream(board(), stream.id, 1), stream.name + ' moved down.'), {disabled: index === group.workstreams.length - 1, label: 'Move workstream ' + stream.name + ' down', focus: 'down-' + stream.id}),
        placeButton(stream.id, stream.name));
      container.append(actions, itemList(stream.items, group.name + ' / ' + stream.name + ' artefacts')); section.append(container);
    }
    return section;
  }
  function render() {
    const focused = document.activeElement && document.activeElement.dataset.focus;
    renderControls();
    $('contracts').replaceChildren(); $('support').replaceChildren(); $('unassigned').replaceChildren();
    for (const group of board().groups) $(group.kind === 'contract' ? 'contracts' : group.kind === 'unassigned' ? 'unassigned' : 'support').append(buildGroup(group));
    if (focused) {
      const replacement = document.querySelector('[data-focus="' + focused + '"]');
      const fallback = /^(up|down)-/.test(focused) ? document.querySelector('[data-focus="edit-' + focused.replace(/^(up|down)-/, '') + '"]') : $('filter');
      (replacement && !replacement.disabled ? replacement : fallback).focus({preventScroll: true});
    }
  }
  function field(label, id, value, type = 'text', max = 200) {
    const wrapper = el('label', label), input = document.createElement(type === 'textarea' ? 'textarea' : 'input'); input.id = id;
    if (type !== 'textarea') input.type = type;
    if (type === 'checkbox') { input.checked = value; wrapper.className = 'checkbox-label'; } else { input.value = value; input.maxLength = max; input.required = type !== 'textarea'; }
    if (type === 'textarea') input.rows = 4;
    wrapper.append(input); $('editor-fields').append(wrapper); return input;
  }
  function selectField(label, id, entries, value) {
    const wrapper = el('label', label), select = document.createElement('select'); select.id = id; fillSelect(select, entries, value); wrapper.append(select); $('editor-fields').append(wrapper); return select;
  }
  function openEditor(title, setup, apply, action = 'Apply') {
    const active = document.activeElement; editorReturnFocus = active ? {id: active.id, key: active.dataset.focus} : null;
    $('editor-title').textContent = title; $('editor-fields').replaceChildren(); $('editor-error').textContent = ''; $('editor-apply').textContent = action;
    setup(); editorApply = apply; $('editor').showModal();
  }
  function renameGroup(group) {
    openEditor('Rename ' + group.name, () => field('Name', 'edit-name', group.name, 'text', 100), () => mutate(M.rename(board(), group.id, $('edit-name').value.trim()), 'Group renamed.'));
  }
  function editItem() {
    if (selected.size !== 1) throw Error('Select one artefact to edit.');
    const item = board().items.find(i => selected.has(i.id));
    openEditor('Edit artefact', () => {
      field('Title', 'edit-name', item.title); field('Notes / shared interfaces', 'edit-notes', item.notes, 'textarea', 4000); field('Reviewed (not approval or completion)', 'edit-reviewed', item.reviewed, 'checkbox');
      selectField('Primary home', 'edit-target', M.containers(board()).map(c => [c.id, c.name]), M.locate(board(), item.id).id);
    }, () => {
      let next = M.editItem(board(), item.id, $('edit-name').value.trim(), $('edit-notes').value, $('edit-reviewed').checked);
      next = M.moveItems(next, [item.id], $('edit-target').value); mutate(next, 'Artefact updated.');
    });
  }
  function addItem() {
    openEditor('Add candidate artefact', () => {
      field('Title', 'edit-name', ''); field('Notes / shared interfaces', 'edit-notes', '', 'textarea', 4000);
      selectField('Primary home', 'edit-target', M.containers(board()).map(c => [c.id, c.name]), board().groups.find(g => g.kind === 'unassigned').id);
    }, () => mutate(M.addItem(board(), $('edit-name').value.trim(), $('edit-notes').value, $('edit-target').value), 'Artefact added.'), 'Add artefact');
  }
  function createWorkstream(groupId) {
    openEditor('Add workstream', () => field('Workstream name', 'edit-name', '', 'text', 100), () => mutate(M.addWorkstream(board(), groupId, $('edit-name').value.trim()), 'Workstream added.'), 'Add workstream');
  }
  function editWorkstream(id) {
    const c = M.destination(board(), id);
    openEditor('Edit / move workstream', () => {
      field('Workstream name', 'edit-name', c.stream.name, 'text', 100);
      selectField('Group · all contents move with it', 'edit-target', board().groups.filter(g => g.kind !== 'unassigned').map(g => [g.id, g.name]), c.group.id);
      $('editor-fields').append(el('p', c.items.length + ' artefact(s). Remove is available only for an empty workstream.', 'note'));
      $('editor-fields').append(button('Remove empty workstream', () => { mutate(M.removeWorkstream(board(), id), 'Empty workstream removed.'); $('editor').close(); }, {disabled: c.items.length > 0}));
    }, () => { let next = M.rename(board(), id, $('edit-name').value.trim()); next = M.moveWorkstream(next, id, $('edit-target').value); mutate(next, 'Workstream updated; its artefacts kept their notes and review ticks.'); });
  }
  function splitWorkstream(id) {
    const c = M.destination(board(), id);
    openEditor('Split ' + c.stream.name, () => {
      field('New workstream name', 'edit-name', '', 'text', 100);
      $('editor-fields').append(el('p', 'Choose the artefacts to move into a new sibling workstream. The original stays in place, even if it becomes empty.', 'note'));
      const set = el('fieldset'); set.append(el('legend', 'Artefacts for the new workstream'));
      for (const itemId of c.items) {
        const item = board().items.find(i => i.id === itemId), label = el('label', undefined, 'checkbox-label'), checkbox = document.createElement('input');
        checkbox.type = 'checkbox'; checkbox.value = itemId; checkbox.name = 'split-item'; checkbox.checked = selected.has(itemId); label.append(checkbox, el('span', item.title)); set.append(label);
      }
      $('editor-fields').append(set);
    }, () => {
      const ids = [...$('editor-fields').querySelectorAll('input[name="split-item"]:checked')].map(input => input.value);
      mutate(M.splitWorkstream(board(), id, ids, $('edit-name').value.trim()), 'Workstream split. Artefacts and their IDs are preserved.');
    }, 'Split workstream');
  }
  function moveSelected(target) {
    const count = selected.size, name = M.destination(board(), target).name;
    mutate(M.moveItems(board(), [...selected], target), count + ' selected artefact(s) placed in ' + name + '.');
  }
  function openTransfer(mode) {
    fileReadToken++;
    const importing = mode === 'import'; $('transfer-title').textContent = importing ? 'Import a board' : 'Export this board';
    $('transfer-help').textContent = importing ? 'Choose a file or paste JSON. The whole board is checked before replacement. A failed import leaves this board intact; correct the text here and retry. Import is undoable and does not overwrite your local save.' : 'This includes names, notes, review ticks, IDs, allocations and order. Download a file, or select the text and copy it. Filters, selection and undo history are not included.';
    $('file-label').hidden = !importing; $('apply-import').hidden = !importing; $('download').hidden = importing;
    $('json').readOnly = !importing; $('json').disabled = false; $('json').value = importing ? '' : M.serialize(board());
    $('apply-import').disabled = false; $('file').value = ''; $('transfer-error').textContent = ''; $('transfer').showModal();
  }
  $('editor-form').addEventListener('submit', event => { event.preventDefault(); try { $('editor-error').textContent = ''; editorApply(); $('editor').close(); } catch (error) { $('editor-error').textContent = error.message; } });
  $('editor-cancel').onclick = () => $('editor').close();
  $('editor').addEventListener('close', () => {
    const target = editorReturnFocus && (editorReturnFocus.key ? document.querySelector('[data-focus="' + editorReturnFocus.key + '"]') : $(editorReturnFocus.id));
    (target && !target.disabled ? target : $('add-item')).focus({preventScroll: true});
  });
  $('add-item').onclick = () => safe(addItem); $('edit-selected').onclick = () => safe(editItem);
  $('rename-board').onclick = () => openEditor('Rename board', () => field('Board title', 'edit-name', board().title, 'text', 160), () => mutate(M.setTitle(board(), $('edit-name').value.trim()), 'Board renamed.'));
  $('move-selected').onclick = () => safe(() => moveSelected($('destination').value));
  $('item-up').onclick = () => safe(() => mutate(M.reorderItem(board(), [...selected][0], -1), 'Artefact moved up within its destination.'));
  $('item-down').onclick = () => safe(() => mutate(M.reorderItem(board(), [...selected][0], 1), 'Artefact moved down within its destination.'));
  $('delete-selected').onclick = () => safe(() => mutate(M.removeItems(board(), [...selected]), 'Selected artefacts removed. Undo restores them.'));
  $('clear-selection').onclick = () => { selected.clear(); render(); report('Selection cleared.'); };
  for (const [id, event] of [['filter', 'input'], ['review-filter', 'change']]) $(id).addEventListener(event, () => { selected.clear(); render(); });
  $('clear-filter').onclick = () => { clearFilter(); selected.clear(); render(); };
  $('undo').onclick = () => safe(() => { history.undo(); selected.clear(); render(); report('Change undone. The local save was not changed.'); });
  $('redo').onclick = () => safe(() => { history.redo(); selected.clear(); render(); report('Change redone. The local save was not changed.'); });
  $('reset').onclick = () => safe(() => mutate(M.initial(), 'Example restored. Undo brings your previous board back. The local save was not changed.', true));
  $('save').onclick = () => safe(() => { const saved = M.save(window.localStorage, board()); savedFingerprint = M.serialize(saved.board); savedAt = saved.savedAt; saveStatus(); report('Board saved in this browser. This version will reopen on your next visit.'); });
  $('load').onclick = () => safe(() => {
    const saved = M.load(window.localStorage); if (!saved) { report('No local save yet. Your current board is unchanged.'); return; }
    savedFingerprint = M.serialize(saved.board); savedAt = saved.savedAt;
    mutate(saved.board, 'Saved board loaded. Undo returns to the previous board.', true);
  });
  $('export').onclick = () => safe(() => openTransfer('export')); $('import').onclick = () => openTransfer('import');
  $('close-transfer').onclick = () => { fileReadToken++; $('transfer').close(); };
  $('transfer').addEventListener('cancel', () => { fileReadToken++; });
  $('file').addEventListener('change', async () => {
    const file = $('file').files[0], token = ++fileReadToken; if (!file) return;
    $('transfer-error').textContent = ''; $('json').value = ''; $('apply-import').disabled = true; $('json').disabled = true;
    try {
      if (file.size > M.MAX_BYTES) throw Error('Use a JSON file smaller than 1.5 MB.');
      const source = await file.text(); if (token !== fileReadToken) return;
      $('json').value = source;
    } catch (error) { if (token === fileReadToken) $('transfer-error').textContent = 'File could not be loaded: ' + error.message; }
    finally { if (token === fileReadToken) { $('apply-import').disabled = false; $('json').disabled = false; } }
  });
  $('apply-import').onclick = () => {
    try { const next = M.parse($('json').value); mutate(next, 'Board imported. Review it, then Save locally if you want it to reopen here.', true); $('transfer').close(); }
    catch (error) { $('transfer-error').textContent = error.message; }
  };
  $('select-json').onclick = () => { $('json').focus(); $('json').select(); };
  $('download').onclick = () => {
    try {
      const blob = new Blob([$('json').value], {type: 'application/json'}), url = URL.createObjectURL(blob), link = el('a');
      link.href = url; link.download = (board().title.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0,70) || 'contract-board') + '.json';
      document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      $('transfer-error').textContent = ''; report('JSON download requested. The text remains available to copy.');
    } catch (error) { $('transfer-error').textContent = 'Download is unavailable. Select and copy the JSON text instead.'; }
  };
  try {
    const saved = M.load(window.localStorage);
    if (saved) { history.current = saved.board; savedFingerprint = M.serialize(saved.board); savedAt = saved.savedAt; report('Your locally saved board has reopened.'); }
    else report('Example ready. Select an artefact, then place it in a workstream or another home.');
  } catch (error) { $('error').textContent = 'The example is shown because the local save could not be opened: ' + error.message + ' Existing saved data has not been changed.'; }
  render();
})();
