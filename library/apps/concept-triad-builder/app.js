(function () {
  'use strict';
  const M = window.TriadModel, $ = id => document.getElementById(id), ns = 'http://www.w3.org/2000/svg';
  let state = {version:1,triads:[],draft:null}, history = [], pendingImport = null, editingId = null;
  const uid = () => 'triad-' + (crypto.randomUUID ? crypto.randomUUID() : Date.now()+'-'+Math.random().toString(36).slice(2));
  function el(tag,text,className) {const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n;}
  function svgEl(tag,attrs,text) {const n = document.createElementNS(ns,tag); Object.entries(attrs).forEach(([k,v]) => n.setAttribute(k,String(v))); if (text !== undefined) n.textContent = text; return n;}
  function message(text,error = false) {$('status').textContent = text; $('status').classList.toggle('error',error);}
  function fileMessage(text,error = false) {$('fileStatus').textContent = text; $('fileStatus').classList.toggle('error',error);}
  function commit(next,text,resetEntry = false) {const validated = M.validateDocument(next), preserveEntry = !resetEntry && JSON.stringify(state.draft) === JSON.stringify(validated.draft); history.push(state); if (history.length > 30) history.shift(); state = validated; render(preserveEntry); message(text);}
  function diagram(concepts) {
    const svg = svgEl('svg',{viewBox:'0 0 600 315',class:'triangle','aria-hidden':'true'}), points = [[300,45],[110,245],[490,245]];
    [[0,1],[1,2],[2,0]].forEach(([a,b]) => {if (concepts[a] && concepts[b]) svg.append(svgEl('line',{x1:points[a][0],y1:points[a][1],x2:points[b][0],y2:points[b][1],stroke:'#8b9f90','stroke-width':2}));});
    points.forEach(([x,y],index) => {
      const active = Boolean(concepts[index]);
      svg.append(svgEl('circle',{cx:x,cy:y,r:22,fill:active ? index === 2 ? '#235d50' : '#dde7da' : '#f7f6ef',stroke:'#698774','stroke-width':2,'stroke-dasharray':active ? 'none' : '4 3'}));
      svg.append(svgEl('text',{x,y:y+6,'text-anchor':'middle',fill:active && index === 2 ? '#fff' : '#26352d','font-size':18},String(index+1)));
      const caption = concepts[index] || ['First concept','Second concept','Third concept'][index];
      const words = caption.replace(/\s+/g,' ').split(' '), lines = [''];
      words.forEach(word => {while (word.length > 22) {if (lines[lines.length-1]) lines.push(''); lines[lines.length-1] = word.slice(0,22); lines.push(''); word = word.slice(22);} if ((lines[lines.length-1]+' '+word).trim().length > 22) lines.push(word); else lines[lines.length-1] = (lines[lines.length-1]+' '+word).trim();});
      const shown = lines.slice(0,3); if (lines.length > 3) shown[2] = shown[2].slice(0,20)+'…';
      const label = svgEl('text',{x,y:index === 0 ? 90 : 155,'text-anchor':'middle','font-size':17,fill:active ? '#26352d' : '#69796c'});
      shown.forEach((line,i) => label.append(svgEl('tspan',{x,dy:i ? 21 : 0},line))); svg.append(label);
    }); return svg;
  }
  function card(item,draft = false) {
    const article = el('article',undefined,'panel triad-card'); if (!draft) article.id = item.id;
    article.append(el('h3',item.title+(draft ? ' · draft' : '')),diagram(item.concepts));
    const list = el('ol',undefined,'concept-list');
    item.concepts.forEach((concept,index) => {const li = el('li'); li.append(el('span',index === 2 ? 'Third · reframing concept' : index === 0 ? 'First concept' : 'Second concept','note'),el('strong',concept)); list.append(li);});
    article.append(list);
    if (!draft) {
      const actions = el('div',undefined,'actions'), edit = el('button','Edit','secondary'), remove = el('button','Remove','secondary');
      edit.setAttribute('aria-label','Edit '+item.title); edit.id = 'edit-'+item.id; edit.addEventListener('click',() => openEdit(item));
      remove.setAttribute('aria-label','Remove '+item.title); remove.addEventListener('click',() => {commit({...state,triads:state.triads.filter(t => t.id !== item.id)},'Removed '+item.title+'. Undo is available.'); $('undo').focus();});
      actions.append(edit,remove); article.append(actions);
    } return article;
  }
  function render(preserveEntry = false) {
    const enteredTitle = $('title').value, enteredConcept = $('concept').value;
    const count = state.draft ? state.draft.concepts.length : 0;
    $('titleField').hidden = count > 0; $('title').required = count === 0;
    $('title').value = state.draft ? state.draft.title : '';
    $('title').setCustomValidity(''); $('concept').setCustomValidity(''); $('concept').value = '';
    if (preserveEntry) {if (!state.draft) $('title').value = enteredTitle; $('concept').value = enteredConcept;}
    $('conceptLabel').textContent = ['First concept','Second concept','Third, reframing concept'][count];
    $('concept').placeholder = ['e.g. Central control','e.g. Local autonomy','e.g. Apprenticeship'][count];
    $('step').textContent = ['Step 1 of 3 · Name the topic and first concept','Step 2 of 3 · Add the familiar other position','Step 3 of 3 · Add a concept that changes the question'][count];
    $('prompt').textContent = ['Start with a familiar position in the discussion.','What other position is often contrasted with the first?','Look for a third idea that challenges the original division, rather than a compromise between its sides.'][count];
    $('add').textContent = ['Add first concept','Add second concept','Complete triad'][count];
    $('back').hidden = $('cancelDraft').hidden = !count; $('draft').hidden = !count;
    $('draft').replaceChildren(); if (state.draft) $('draft').append(card(state.draft,true));
    $('triads').replaceChildren(...state.triads.map(t => card(t)));
    $('empty').hidden = state.triads.length > 0; $('undo').disabled = !history.length;
  }
  ['title','concept'].forEach(id => $(id).addEventListener('input',() => $(id).setCustomValidity('')));
  $('conceptForm').addEventListener('submit',event => {
    event.preventDefault();
    for (const id of state.draft ? ['concept'] : ['title','concept']) if (!$(id).value.trim()) {$(id).setCustomValidity('Enter at least one non-space character.'); $(id).reportValidity(); return;}
    try {
      const draft = M.addConcept(state.draft,$('title').value,$('concept').value);
      if (draft.concepts.length === 3) {const completed = M.triad(uid(),draft.title,draft.concepts); commit({...state,draft:null,triads:[...state.triads,completed]},'Triad completed. You can edit it below.'); $('title').focus();}
      else {commit({...state,draft},'Concept added. '+(draft.concepts.length === 1 ? 'Add the second position.' : 'Add the reframing concept.')); $('concept').focus();}
    } catch (error) {message(error.message,true);}
  });
  $('back').addEventListener('click',() => {
    if (!state.draft) return; const d = state.draft, value = d.concepts[d.concepts.length-1];
    commit({...state,draft:d.concepts.length === 1 ? null : {...d,concepts:d.concepts.slice(0,-1)}},'Previous concept returned to the form.');
    if (d.concepts.length === 1) $('title').value = d.title;
    $('concept').value = value; $('concept').focus();
  });
  $('cancelDraft').addEventListener('click',() => {commit({...state,draft:null},'Draft cancelled. Undo is available.'); $('title').focus();});
  $('example').addEventListener('click',() => {commit({...state,triads:[...state.triads,M.triad(uid(),'How we organise work',['Central control','Local autonomy','Apprenticeship'])]},'Fictional organising-work example added. Your draft is retained.');});
  $('undo').addEventListener('click',() => {if (history.length) {state = history.pop(); render(); message('Previous state restored.');}});
  function openEdit(item) {
    editingId = item.id; ['editTitle','editFirst','editSecond','editThird'].forEach((id,i) => {$(id).value = i ? item.concepts[i-1] : item.title; $(id).setCustomValidity('');});
    $('editError').textContent = ''; $('editDialog').showModal(); $('editTitle').focus();
  }
  ['editTitle','editFirst','editSecond','editThird'].forEach(id => $(id).addEventListener('input',() => $(id).setCustomValidity('')));
  $('editForm').addEventListener('submit',event => {
    event.preventDefault();
    for (const id of ['editTitle','editFirst','editSecond','editThird']) if (!$(id).value.trim()) {$(id).setCustomValidity('Enter at least one non-space character.'); $(id).reportValidity(); return;}
    try {const triads = M.replace(state.triads,editingId,$('editTitle').value,[$('editFirst').value,$('editSecond').value,$('editThird').value]); $('editDialog').close(); commit({...state,triads},'Triad updated.'); $('edit-'+editingId)?.focus();} catch (error) {$('editError').textContent = error.message;}
  });
  $('cancelEdit').addEventListener('click',() => $('editDialog').close());
  $('save').addEventListener('click',() => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})), a = el('a'); a.href = url; a.download = 'concept-triads.json'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url),1000); fileMessage('Download requested: concept-triads.json. Keep the saved file to reopen these triads.');
  });
  $('import').addEventListener('change',async event => {
    const file = event.target.files[0]; pendingImport = null; $('importPreview').hidden = true; if (!file) return;
    try {if (file.size > 1000000) throw Error('Use a file smaller than 1 MB.'); pendingImport = M.parse(await file.text()); $('importSummary').textContent = `${file.name}: ${pendingImport.triads.length} completed triads${pendingImport.draft ? ' and one draft' : ''}. This will replace this page’s entries; Undo remains available.`; $('importPreview').hidden = false; $('applyImport').focus(); fileMessage('File checked. Review before applying.');} catch (error) {fileMessage('File not loaded: '+error.message+' Your entries are unchanged.',true);} event.target.value = '';
  });
  $('applyImport').addEventListener('click',() => {if (pendingImport) {const next = pendingImport; pendingImport = null; $('importPreview').hidden = true; commit(next,'Triads loaded. Undo is available.',true); fileMessage('Triads loaded. Undo is available.'); $('save-heading').focus();}});
  $('cancelImport').addEventListener('click',() => {pendingImport = null; $('importPreview').hidden = true; fileMessage('Load cancelled; entries unchanged.'); $('import').focus();});
  render();
})();
