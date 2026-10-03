(function(){
  'use strict';
  const M=window.LoomModel,D=window.LoomData,$=id=>document.getElementById(id),KEY='library.portfolio-scenario-loom.v1';
  let state=M.defaults(),preview=null,editorReturn=null,nextId=0,drag=null,chartGeometry=null;
  const fmt=n=>Number(n).toLocaleString(undefined,{maximumFractionDigits:3}),month=s=>s.slice(0,7),date=s=>s+'-01';
  const colors={policy:'#7562ad',market:'#bf7159',tech:'#398065'};
  function el(tag,content,attrs={}){const n=document.createElement(tag);if(content!==undefined&&content!==null)n.textContent=content;for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;}
  function svg(tag,attrs={},content){const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));if(content!==undefined)n.textContent=content;return n;}
  function status(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error);}
  function unique(prefix){let id;do{id=prefix+'-'+Date.now()+'-'+(++nextId);}while(state.library.some(f=>f.id===id)||state.milestones.some(m=>m.id===id));return id;}
  function install(next,message){state=M.validate(next);preview=null;render();if(message)status(message);}
  function attempt(fn){try{fn();}catch(e){status(e.message,true);}}
  function change(mutator,message){const next=M.clone(state);mutator(next);install(next,message);}
  function renderLibrary(){
    const q=$('search').value.toLowerCase(),type=$('type').value,list=state.library.filter(f=>(!type||f.type===type)&&[f.name,f.type,...f.tags].join(' ').toLowerCase().includes(q)).sort((a,b)=>a.type.localeCompare(b.type)||a.start.localeCompare(b.start));
    $('selection').textContent=state.selected.length+' of '+state.library.length+' selected · '+list.length+' shown';$('scenarios').replaceChildren();
    if(!list.length)$('scenarios').append(el('p','No scenarios match this filter.',{class:'small'}));
    for(const f of list){
      const idx=state.library.indexOf(f),card=el('article',null,{class:'scenario'}),row=el('div',null,{class:'scenario-main'}),check=el('input',null,{type:'checkbox',id:'select-'+idx});check.checked=state.selected.includes(f.id);
      check.addEventListener('change',()=>attempt(()=>change(s=>{s.selected=check.checked?[...s.selected,f.id]:s.selected.filter(id=>id!==f.id);},'Selection updated.')));
      row.append(check,el('label',f.name,{for:check.id}));card.append(row);
      const meta=el('p',null,{class:'small'});meta.append(el('span',f.type,{class:'type '+f.type}),document.createTextNode(month(f.start)+' → '+month(f.end)+' · strength '+fmt(f.confidence)+' · weight '+fmt(Object.hasOwn(state.weights,f.id)?state.weights[f.id]:f.weight)));card.append(meta);
      const button=el('button','Edit assumptions',{id:'edit-'+idx,'aria-label':'Edit '+f.name});button.onclick=()=>openEditor(f.id,button.id);card.append(button);
      if(f.second.length)card.append(el('p',f.second.length+' declared lagged link'+(f.second.length===1?'':'s')+'.',{class:'small'}));
      $('scenarios').append(card);
    }
  }
  function table(headers,rows,caption){const t=el('table');if(caption)t.append(el('caption',caption));const head=el('thead'),hr=el('tr');for(const h of headers)hr.append(el('th',h,{scope:'col'}));head.append(hr);const body=el('tbody');for(const row of rows){const tr=el('tr');row.forEach((v,i)=>tr.append(el(i===0?'th':'td',v,i===0?{scope:'row'}:{})));body.append(tr);}t.append(head,body);return t;}
  function renderChart(r){
    const chart=$('chart'),W=1060,left=185,right=30,top=50+state.milestones.length*15,lane=43,bottom=120,H=top+Math.max(1,r.active.length)*lane+bottom,inner=W-left-right,x=m=>left+inner*m/state.horizon;
    chartGeometry={W,left,inner};chart.setAttribute('viewBox','0 0 '+W+' '+H);chart.replaceChildren(svg('title',{id:'chart-title'},'Authored scenario activation by month'),svg('desc',{id:'chart-desc'},'Selected scenarios share a zero-to-two activation scale. Dashed lines mark decision months. Two bands show same-direction alignment and opposition, not benefit and harm. Exact values are in the monthly table.'));
    const grid=svg('g',{'aria-hidden':'true'});chart.append(grid);const step=state.horizon>72?12:state.horizon>36?6:3;
    for(let i=0;i<=state.horizon;i++){if(i%step&&i!==state.horizon)continue;grid.append(svg('line',{x1:x(i),x2:x(i),y1:top-8,y2:H-40,stroke:'#dbe2da'}),svg('text',{x:x(i),y:H-14,'text-anchor':i===state.horizon?'end':'middle','font-size':11,fill:'#52666a'},month(r.ticks[i])));}
    if(!r.active.length)grid.append(svg('text',{x:left,y:top+25,'font-size':15,fill:'#52666a'},'Select a scenario to show its activation.'));
    r.active.forEach((f,i)=>{
      const baseY=top+i*lane+32,points=r.activation[f.id].map((a,m)=>[x(m),baseY-a*15]);
      grid.append(svg('line',{x1:left,x2:W-right,y1:baseY,y2:baseY,stroke:'#dce2d9'}));
      const label=svg('text',{x:left-12,y:baseY-9,'text-anchor':'end','font-size':11,fill:colors[f.type]},f.name.length>25?f.name.slice(0,24)+'…':f.name);label.append(svg('title',{},f.name));grid.append(label);
      grid.append(svg('path',{d:'M '+x(0)+' '+baseY+' L '+points.map(p=>p.join(' ')).join(' L ')+' L '+x(state.horizon)+' '+baseY+' Z',fill:colors[f.type],opacity:.1}));
      const path=svg('path',{d:'M '+points.map(p=>p.join(' ')).join(' L '),fill:'none',stroke:colors[f.type],'stroke-width':2});path.append(svg('title',{},f.name+' — activation 0 to 2'));grid.append(path);
    });
    const bandY=top+Math.max(1,r.active.length)*lane+12;
    for(const[k,label,color,offset]of [['aligned','Same-direction alignment','#7d67aa',0],['opposed','Opposition','#b97534',29]]){
      const max=Math.max(0,...r.monthly.map(p=>p[k]));grid.append(svg('text',{x:left-12,y:bandY+offset+13,'text-anchor':'end','font-size':11,fill:'#52666a'},label));
      for(let m=0;m<=state.horizon;m++){const v=r.monthly[m][k],rect=svg('rect',{x:x(m),y:bandY+offset,width:Math.max(1,inner/(state.horizon+1)),height:18,fill:color,opacity:max?v/max*.8:0});rect.append(svg('title',{},month(r.ticks[m])+' '+label+': '+fmt(v)));grid.append(rect);}
    }
    r.milestones.forEach((m,i)=>{
      if(!m.inRange)return;const xx=x(m.index),g=svg('g',{'data-milestone':m.id,class:'milestone-line'});
      g.append(svg('line',{x1:xx,x2:xx,y1:top-7,y2:H-40,stroke:'transparent','stroke-width':16}),svg('line',{x1:xx,x2:xx,y1:top-7,y2:H-40,stroke:'#99651f','stroke-width':1.5,'stroke-dasharray':'5 4'}),svg('text',{x:xx,y:21+i*15,'text-anchor':xx>W-180?'end':'start','font-size':11,fill:'#875915'},m.label));g.append(svg('title',{},m.label+' · '+month(m.date)+' · drag to change month'));chart.append(g);
    });
    const outside=r.milestones.filter(m=>!m.inRange).length;
    $('chart-note').textContent='Band intensity is scaled to each band’s current maximum; use the numbers to compare selections. '+(r.clipped?r.clipped+' scenario-month activations were clipped to 0–2. ':'No activation clipping. ')+(outside?outside+' milestone(s) lie outside this timeline.':'');
    $('numbers').replaceChildren(table(['Month',...r.active.map(f=>'Activation: '+f.name),...M.EFFECTS.map(k=>'Net '+k),'Alignment','Opposition','Attention'],r.monthly.map((p,i)=>[month(p.date),...r.active.map(f=>fmt(r.activation[f.id][i])),...p.net.map(fmt),fmt(p.aligned),fmt(p.opposed),fmt(p.attention)]),'Dimensionless indices at monthly resolution. CSV also includes stress and relief by dimension.'));
  }
  function renderMilestones(r){
    $('milestones').replaceChildren();if(!r.milestones.length)$('milestones').append(el('p','No milestones are defined. Add one to inspect a decision month.'));
    for(const [i,m]of r.milestones.entries()){
      const card=el('article',null,{class:'milestone-card'});card.append(el('h3',m.label));const input=el('input',null,{type:'month',id:'month-'+i,min:'1900-01',max:'2200-12','aria-label':'Month for '+m.label});input.value=month(m.date);card.append(el('label','Decision month',{for:input.id}),input);
      input.onchange=()=>attempt(()=>change(s=>{s.milestones.find(x=>x.id===m.id).date=date(input.value);},'Milestone month updated.'));
      if(m.inRange){const p=m.probe;card.append(el('p','Attention index '+fmt(p.attention),{class:'attention'}),el('p','Review emphasis factor '+fmt(r.factor)+'; no scenario probability is implied.',{class:'small'}));
        const wrap=el('div',null,{class:'table-scroll',tabindex:0,'aria-label':'Pressure values for '+m.label});wrap.append(table(['Effect','Stress','Relief','Net'],M.EFFECTS.map((k,j)=>[k,fmt(p.stress[j]),fmt(p.relief[j]),fmt(p.net[j])])));card.append(wrap);
        if(p.stress.some((v,j)=>v>0&&p.relief[j]>0))card.append(el('p','Opposing assumptions offset within at least one dimension. Inspect both contributions; a small net is not low uncertainty.',{class:'small'}));
        card.append(el('h3','Discussion prompts'));
        if(m.prompts.length){const list=el('ul');for(const q of m.prompts){const li=el('li',q.text);li.append(el('div',q.dim+' · positive net '+fmt(q.net)+' × '+fmt(r.factor)+' = '+fmt(q.pressure)+'; threshold '+q.threshold,{class:'small'}));list.append(li);}card.append(list,el('p','Up to three authored prompts; neither optimised nor tested interventions.',{class:'small'}));}
        else card.append(el('p','No positive net pressure crosses the prompt thresholds. This does not establish safety or readiness.',{class:'small'}));
      }else card.append(el('p','Outside the current timeline. No value is substituted from its boundary month.'));
      const remove=el('button','Remove milestone',{'aria-label':'Remove '+m.label});remove.onclick=()=>attempt(()=>change(s=>{s.milestones=s.milestones.filter(x=>x.id!==m.id);},'Milestone removed.'));card.append(remove);$('milestones').append(card);
    }
  }
  function renderSwaps(){
    const remove=$('remove'),add=$('replace'),oldRemove=remove.value,oldAdd=add.value;remove.replaceChildren();add.replaceChildren();
    for(const f of state.library){const target=state.selected.includes(f.id)?remove:add;target.append(el('option',f.name,{value:f.id}));}
    if([...remove.options].some(o=>o.value===oldRemove))remove.value=oldRemove;if([...add.options].some(o=>o.value===oldAdd))add.value=oldAdd;
    $('preview').disabled=!remove.options.length||!add.options.length;$('apply').hidden=true;$('comparison').replaceChildren();
    if(!remove.options.length||!add.options.length)$('comparison').append(el('p','A swap needs at least one selected and one unselected scenario.',{class:'small'}));
  }
  function render(){
    const focused=document.activeElement?.id;const r=M.compute(state);$('start').value=month(state.startDate);$('horizon').value=state.horizon;$('tolerance').value=state.risk;$('tolerance-value').value=state.risk.toFixed(2);
    renderLibrary();renderChart(r);renderMilestones(r);renderSwaps();$('add').disabled=state.library.length>=M.MAX_FIBRES;$('add-milestone').disabled=state.milestones.length>=M.MAX_MILESTONES;
    if(focused&&$(focused))$(focused).focus({preventScroll:true});
  }
  const form=$('scenario-form'),field=name=>form.elements.namedItem(name);
  for(const k of M.EFFECTS){const wrap=el('div'),input=el('input',null,{id:'effect-'+k,name:'effect_'+k,type:'number',min:-1,max:1,step:.05,required:''});wrap.append(el('label',k[0].toUpperCase()+k.slice(1),{for:input.id}),input);$('effect-fields').append(wrap);}
  function openEditor(fid,returnId){
    editorReturn=returnId;const f=state.library.find(x=>x.id===fid)||{id:unique('scenario'),name:'',type:'policy',start:M.addMonths(state.startDate,3),end:M.addMonths(state.startDate,9),confidence:.6,weight:1,effects:Object.fromEntries(M.EFFECTS.map(k=>[k,0])),second:[],tags:[]};
    form.reset();for(const k of ['id','name','type','confidence'])field(k).value=f[k];field('start').value=month(f.start);field('end').value=month(f.end);field('weight').value=Object.hasOwn(state.weights,f.id)?state.weights[f.id]:f.weight;field('second').value=JSON.stringify(f.second,null,2);field('tags').value=f.tags.join(', ');for(const k of M.EFFECTS)field('effect_'+k).value=f.effects[k];
    $('editor-title').textContent=fid?'Edit scenario':'Add scenario';$('editor-error').textContent='';$('target-ids').replaceChildren(...state.library.map(x=>el('li',x.id)));$('editor').showModal();field('name').focus();
  }
  function closeEditor(){$('editor').close();if(editorReturn&&$(editorReturn))$(editorReturn).focus();}
  $('cancel').onclick=closeEditor;$('editor').addEventListener('cancel',()=>{if(editorReturn&&$(editorReturn))$(editorReturn).focus();});
  form.addEventListener('submit',e=>{e.preventDefault();try{
    if(!form.reportValidity())return;const f={id:field('id').value,name:field('name').value.trim(),type:field('type').value,start:date(field('start').value),end:date(field('end').value),confidence:Number(field('confidence').value),weight:Number(field('weight').value),effects:Object.fromEntries(M.EFFECTS.map(k=>[k,Number(field('effect_'+k).value)])),second:JSON.parse(field('second').value||'[]'),tags:field('tags').value.split(',').map(t=>t.trim()).filter(Boolean)};
    const next=M.clone(state),index=next.library.findIndex(x=>x.id===f.id);if(index>=0)next.library[index]=f;else next.library.push(f);next.weights[f.id]=f.weight;install(next,'Scenario assumptions saved in this tab.');closeEditor();
  }catch(err){$('editor-error').textContent=err.message;}});
  $('add').onclick=()=>openEditor(null,'add');$('search').oninput=renderLibrary;$('type').onchange=renderLibrary;
  $('start').onchange=()=>attempt(()=>change(s=>{s.startDate=date($('start').value);},'Timeline start updated.'));
  $('horizon').onchange=()=>attempt(()=>change(s=>{s.horizon=Number($('horizon').value);},'Timeline horizon updated.'));
  $('tolerance').oninput=()=>attempt(()=>change(s=>{s.risk=Number($('tolerance').value);},'Review emphasis updated; assumed effects are unchanged.'));
  $('add-milestone').onclick=()=>{$('milestone-form').reset();$('m-date').value=month(M.addMonths(state.startDate,Math.min(12,state.horizon)));$('milestone-error').textContent='';$('milestone-editor').showModal();$('m-label').focus();};
  $('cancel-milestone').onclick=()=>{$('milestone-editor').close();$('add-milestone').focus();};
  $('milestone-form').onsubmit=e=>{e.preventDefault();try{if(!$('milestone-form').reportValidity())return;change(s=>s.milestones.push({id:unique('milestone'),label:$('m-label').value.trim(),date:date($('m-date').value)}),'Milestone added.');$('milestone-editor').close();$('add-milestone').focus();}catch(err){$('milestone-error').textContent=err.message;}};
  $('preview').onclick=()=>attempt(()=>{preview=M.compare(state,$('remove').value,$('replace').value);const wrap=el('div',null,{class:'table-scroll',tabindex:0,'aria-label':'Milestone comparison'});wrap.append(table(['Milestone','Month','Before attention','After attention','Difference'],preview.rows.map(r=>[r.label,month(r.date),r.before===null?'Outside timeline':fmt(r.before),r.after===null?'Outside timeline':fmt(r.after),r.before===null?'—':fmt(r.after-r.before)]),'Only the selected assumption set changes. All milestone months and effect rules are held fixed.'));$('comparison').replaceChildren(wrap,el('p','A lower index can simply mean that an adverse assumption was removed. It is not an improvement in the underlying portfolio.',{class:'small'}));$('apply').hidden=false;status('Swap preview ready. The current selection has not changed.');});
  for(const id of ['remove','replace'])$(id).onchange=()=>{preview=null;$('comparison').replaceChildren();$('apply').hidden=true;};
  $('apply').onclick=()=>attempt(()=>{if(!preview)throw new Error('Preview the swap first.');install(preview.next,'Scenario selection changed.');});
  function download(content,type,name){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),link=el('a',null,{href:url,download:name});document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Download prepared: '+name+'. Your browser controls where it is saved.');}
  $('export').onclick=()=>attempt(()=>download(M.serialize(state),'application/json','portfolio-scenarios.json'));
  $('csv').onclick=()=>attempt(()=>download(M.csv(state),'text/csv;charset=utf-8','portfolio-scenario-months.csv'));
  $('import').onclick=()=>$('file').click();$('file').onchange=async()=>{const file=$('file').files[0];if(!file)return;try{if(file.size>M.MAX_BYTES)throw new Error('The model file must be at most 200 KB.');const next=M.parse(await file.text());install(next,'Model imported into this tab. The browser save has not changed.');}catch(e){status('Import rejected: '+e.message,true);}finally{$('file').value='';}};
  $('save').onclick=()=>attempt(()=>{const value=M.serialize(state);localStorage.setItem(KEY,value);status('Model saved in this browser. This is not a cross-device backup.');});
  $('load').onclick=()=>attempt(()=>{const value=localStorage.getItem(KEY);if(value===null)throw new Error('No model has been saved in this browser.');const next=M.parse(value);install(next,'Browser model loaded.');});
  $('reset').onclick=()=>install(M.defaults(),'Original example restored, including its three milestones. Your browser save is unchanged.');
  const chart=$('chart');chart.addEventListener('pointerdown',e=>{const target=e.target.closest('[data-milestone]');if(!target)return;e.preventDefault();drag=target.getAttribute('data-milestone');chart.setPointerCapture?.(e.pointerId);});
  chart.addEventListener('pointermove',e=>{if(!drag)return;e.preventDefault();const rect=chart.getBoundingClientRect();if(!rect.width)return;const px=(e.clientX-rect.left)*chartGeometry.W/rect.width,index=Math.max(0,Math.min(state.horizon,Math.round((px-chartGeometry.left)/chartGeometry.inner*state.horizon))),d=M.addMonths(state.startDate,index),target=state.milestones.find(m=>m.id===drag);if(target&&month(target.date)!==month(d))attempt(()=>change(s=>{s.milestones.find(m=>m.id===drag).date=d;},'Milestone moved to '+month(d)+'.'));});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])chart.addEventListener(event,()=>{drag=null;});
  render();
})();
