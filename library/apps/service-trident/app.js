(() => {
  'use strict';
  const M=ServiceTrident,$=id=>document.getElementById(id);let state=M.initial(),copyAttempt=0;
  const needButtons=new Map(),levelButtons=new Map(),leadCards=new Map();
  function button(text,handler) {const el=document.createElement('button');el.type='button';el.className='card';el.textContent=text;el.setAttribute('aria-pressed','false');el.addEventListener('click',handler);return el;}
  function update() {
    copyAttempt++;$('copyStatus').textContent='';$('manualCopy').hidden=true;
    for(const [need,el] of needButtons) el.setAttribute('aria-pressed',String(state.need===need));
    for(const [level,el] of levelButtons) el.setAttribute('aria-pressed',String(state.leverage.includes(level)));
    for(const [lead,el] of leadCards) {const active=M.leadMap[state.need]===lead;el.classList.toggle('active',active);el.querySelector('.selection').textContent=active?'Suggested for the selected need':'';}
    $('recommend').disabled=!state.need;$('syn').textContent=M.synopsis(state);
  }
  for(const need of M.needs) {const el=button(need,()=>{state=M.chooseNeed(state,need);update();});needButtons.set(need,el);$('needs').append(el);}
  for(const lead of M.leads) {const el=document.createElement('div');el.className='card';el.append(document.createTextNode(lead));const label=document.createElement('span');label.className='selection';el.append(label);leadCards.set(lead,el);$('leads').append(el);}
  for(const level of M.levels) {const el=button(level,()=>{state=M.toggleLevel(state,level);update();});levelButtons.set(level,el);$('levels').append(el);}
  $('recommend').addEventListener('click',()=>{if(!state.need)return;state=M.recommend(state);update();});
  $('clear').addEventListener('click',()=>{state=M.clear(state);update();});
  $('copy').addEventListener('click',async()=>{
    const attempt=++copyAttempt,text=M.synopsis(state);
    $('copyStatus').textContent='Copying summary…';
    const copied=await M.copyText(text,navigator.clipboard);
    if(attempt!==copyAttempt)return;
    if(copied) {$('copyStatus').textContent='Summary copied.';$('manualCopy').hidden=true;}
    else {$('copyStatus').textContent='Automatic copy is unavailable or did not finish. Use the manual copy box below.';$('copyFallback').value=text;$('manualCopy').hidden=false;$('copyFallback').focus();$('copyFallback').select();}
  });
  update();
})();
