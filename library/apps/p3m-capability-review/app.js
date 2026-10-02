(function () {
  'use strict';
  const M = window.P3MModel, $ = id => document.getElementById(id);
  let data = M.validate(window.P3MExample), history = [], pendingImport = null, nameAction = null;
  const expanded = new Map();
  const uid = () => 'row-' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
  function el(tag, text, className) {const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node;}
  function message(text, error = false) {$('status').textContent = text; $('status').classList.toggle('error',error);}
  function fileMessage(text,error = false) {$('fileStatus').textContent = text; $('fileStatus').classList.toggle('error',error);}
  function commit(next, text, focusId) {history.push(data); if (history.length > 20) history.shift(); data = next; render(); message(text); if (focusId) (document.getElementById(focusId) || $('filter')).focus();}
  function action(text, handler, label) {const b = el('button',text,'small secondary'); b.type = 'button'; if (label) b.setAttribute('aria-label',label); b.addEventListener('click',handler); return b;}
  function summary() {
    const s = M.stats(data); $('stats').replaceChildren();
    for (const [value,label] of [[s.leaves,'Capabilities'],[s.currentPresent,'Present now'],[s.futureRequired,'Required later'],[s.gaps,'Confirmed gaps'],[s.unknownTargets,'Targets to investigate']]) {const cell = el('div'); cell.append(el('strong',String(value)),el('span',label)); $('stats').append(cell);}
    $('coverage').textContent = `${s.currentReviewed} of ${s.leaves} current states reviewed · ${s.parentJudgements} separate parent judgements · ${s.scopeChanges} targets currently outside scope.`;
  }
  function select(node, field) {
    const label = el('label',field === 'currentOps' ? 'Current' : 'Future','assessment-field'), input = document.createElement('select');
    input.id = field + '-' + node.id;
    input.setAttribute('aria-label',(field === 'currentOps' ? 'Current state: ' : 'Future requirement: ') + node.name);
    const labels = field === 'currentOps' ? ['Unknown','Present','Absent','Outside scope'] : ['Not decided','Required','Not required','Outside scope'];
    ['', 'YES', 'NO', 'NA'].forEach((value,index) => input.add(new Option(labels[index],value)));
    input.value = node[field];
    input.addEventListener('change',() => {
      const bulk = $('cascade').checked && M.find(data,node.id).type !== 'capability';
      commit(M.update(data,node.id,field,input.value,bulk),`${node.name}: ${labels[['','YES','NO','NA'].indexOf(input.value)]}${bulk ? '; all children updated' : ''}. Undo is available.`,input.id);
    }); label.append(input); return label;
  }
  function row(node, type) {
    const r = el('div',undefined,'assessment'); r.setAttribute('role','group'); r.setAttribute('aria-label',node.name);
    const description = el('div',undefined,'row-name'); description.append(el('strong',node.name));
    if (type !== 'capability') description.append(el('small','Separate parent judgement','note'));
    else if (node.currentOps === 'NO' && node.futureOps === 'YES') {description.append(el('span','Confirmed gap','tag moderate')); r.classList.add('gap');}
    else if (!node.currentOps && node.futureOps === 'YES') description.append(el('span','Investigate current state','tag unknown'));
    else if (node.currentOps === 'NA' && node.futureOps === 'YES') description.append(el('span','Scope change to discuss','tag unknown'));
    const buttons = el('div',undefined,'actions'); buttons.append(action('Rename',() => openName('rename',node.id),'Rename '+node.name));
    if (type === 'capability') buttons.append(action('Remove',() => {commit(M.remove(data,node.id),'Removed '+node.name+'. Undo is available.'); $('undo').focus();},'Remove '+node.name));
    r.append(description,select(node,'currentOps'),select(node,'futureOps'),buttons); return r;
  }
  function group(node,type,visible,filtering) {
    const details = el('details',undefined,type === 'category' ? 'panel category-group' : 'subgroup');
    details.open = filtering || expanded.get(node.id) !== false;
    details.addEventListener('toggle',() => {if (details.isConnected) expanded.set(node.id,details.open);});
    const count = node.capabilities.filter(cap => visible.has(cap.id)).length;
    const heading = el('summary',node.name + (type === 'subcategory' ? ` · ${count}` : ''));
    details.append(heading);
    if (!filtering) details.append(row(node,type));
    node.capabilities.forEach(cap => {if (visible.has(cap.id)) details.append(row(cap,'capability'));});
    (node.subcategories || []).forEach(sub => {if (visible.has(sub.id)) details.append(group(sub,'subcategory',visible,filtering));});
    const add = action('Add capability to '+node.name,() => openName('add',node.id)); add.classList.add('add-row'); details.append(add);
    return details;
  }
  function render() {
    summary(); $('undo').disabled = !history.length;
    const category = $('category').value; $('category').replaceChildren(new Option('All categories',''));
    data.categories.forEach(cat => $('category').add(new Option(cat.name,cat.id)));
    if (data.categories.some(cat => cat.id === category)) $('category').value = category;
    const filtering = Boolean($('search').value.trim()) || $('filter').value !== 'all';
    const visible = M.visibleIds(data,$('search').value,$('filter').value,$('category').value);
    let leaves = 0; M.walk(data,(node,type) => {if (type === 'capability' && visible.has(node.id)) leaves++;});
    $('results').textContent = `${leaves} individual capabilities shown${filtering ? '. Group headings provide context; parent judgements are hidden while filtering.' : '.'}`;
    $('empty').hidden = visible.size > 0; $('tree').replaceChildren();
    data.categories.forEach(cat => {if (visible.has(cat.id)) $('tree').append(group(cat,'category',visible,filtering));});
  }
  function openName(actionName,id) {
    nameAction = {action:actionName,id}; const item = M.find(data,id);
    $('dialogTitle').textContent = actionName === 'add' ? 'Add to '+item.node.name : 'Rename '+item.node.name;
    $('nodeName').value = actionName === 'add' ? '' : item.node.name; $('nodeName').setCustomValidity(''); $('nameError').textContent = '';
    $('nameDialog').showModal(); $('nodeName').focus();
  }
  $('nodeName').addEventListener('input',() => $('nodeName').setCustomValidity(''));
  $('nameForm').addEventListener('submit',event => {
    event.preventDefault(); const name = $('nodeName').value.trim();
    if (!name) {$('nodeName').setCustomValidity('Enter a name with at least one non-space character.'); $('nodeName').reportValidity(); return;}
    try {
      const id = nameAction.action === 'add' ? uid() : nameAction.id;
      const next = nameAction.action === 'add' ? M.add(data,nameAction.id,name,id) : M.update(data,id,'name',name);
      $('nameDialog').close(); commit(next,nameAction.action === 'add' ? 'Added '+name+'.' : 'Name updated.','currentOps-'+id);
    } catch (error) {$('nameError').textContent = error.message;}
  });
  $('cancelName').addEventListener('click',() => $('nameDialog').close());
  $('search').addEventListener('input',render); $('category').addEventListener('change',render); $('filter').addEventListener('change',render);
  function changeExpansion(open) {$('tree').querySelectorAll('details').forEach(d => {d.open = open;});}
  $('expand').addEventListener('click',() => changeExpansion(true)); $('collapse').addEventListener('click',() => changeExpansion(false));
  $('undo').addEventListener('click',() => {if (history.length) {data = history.pop(); render(); message('Previous worksheet restored.');}});
  $('clear').addEventListener('click',() => commit(M.clear(data),'Assessments cleared; your edited inventory is retained. Undo is available.'));
  $('restore').addEventListener('click',() => {pendingImport = null; $('importPreview').hidden = true; commit(M.validate(window.P3MExample),'Fictional example restored. Undo is available.');});
  function download(text,name,type) {const url = URL.createObjectURL(new Blob([text],{type})), a = el('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url),1000); fileMessage('Download requested: '+name+'. Keep the saved file to reopen this worksheet.');}
  $('exportCSV').addEventListener('click',() => download(M.exportCSV(data),'p3m-capabilities.csv','text/csv;charset=utf-8'));
  $('exportJSON').addEventListener('click',() => download(JSON.stringify(data,null,2),'p3m-capabilities.json','application/json'));
  $('sample').addEventListener('click',() => download('Category,Subcategory,Capability,Current Operations,Future Operations\r\nPORTFOLIO,,,YES,YES\r\nPORTFOLIO,Pipeline management,,,YES\r\nPORTFOLIO,Pipeline management,Intake,YES,YES\r\nPORTFOLIO,Pipeline management,Pipeline development,,YES\r\n','p3m-sample.csv','text/csv;charset=utf-8'));
  $('import').addEventListener('change',async event => {
    const file = event.target.files[0]; pendingImport = null; $('importPreview').hidden = true;
    if (!file) return;
    try {
      if (file.size > 2000000) throw Error('Use a file smaller than 2 MB.');
      pendingImport = M.importFile(await file.text(),/\.json$/i.test(file.name));
      const s = M.stats(pendingImport);
      $('importSummary').textContent = `${file.name}: ${pendingImport.categories.length} categories and ${s.leaves} capabilities, including ${s.gaps} confirmed gaps and ${s.unknownTargets} unknown targets. This will replace the current worksheet.`;
      $('importPreview').hidden = false; $('applyImport').focus(); fileMessage('File checked. Review its summary before replacing the worksheet.');
    } catch (error) {fileMessage('File not loaded: '+error.message+' Your worksheet is unchanged.',true);}
    event.target.value = '';
  });
  $('applyImport').addEventListener('click',() => {if (!pendingImport) return; const next = pendingImport; pendingImport = null; $('importPreview').hidden = true; $('search').value = ''; $('filter').value = 'all'; $('category').value = ''; commit(next,'Loaded the complete worksheet. Undo is available.'); fileMessage('Worksheet loaded. Undo is available.'); $('files-heading').focus();});
  $('cancelImport').addEventListener('click',() => {pendingImport = null; $('importPreview').hidden = true; fileMessage('Load cancelled; worksheet unchanged.'); $('import').focus();});
  render();
})();
