(function(){
'use strict';
const M=window.TimeExchange,$=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
let data,controls,baseline,result=null,selected=null,mode='welfare',sequence=0,draft=false,page=0,running=false;
const f=n=>Number(n).toLocaleString('en-GB',{maximumFractionDigits:6});
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function svgEl(tag,attrs,text){const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs||{}))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;return e;}
function note(message){$('status').textContent=message;const log=$('log');log.textContent=(log.textContent+message+'\n').split('\n').slice(-30).join('\n');}
function error(e){$('error').textContent=(e.message||String(e))+' The last applied dataset and completed result are unchanged.';}
function safe(action){return function(){try{const p=action();if(p?.catch)p.catch(error);}catch(e){error(e);}};}
function readSettings(){const budget=$('budget').value,value=$('value').value;if(!budget.trim()||!value.trim())throw Error('Enter both budget and value of time.');return M.settings({budget:Number(budget),valueOfTime:Number(value)});}
function busy(value){running=value;$('cancel').hidden=!value;$('cancel').textContent='Cancel calculation';}
function invalidate(){sequence++;busy(false);}
function applyData(next,nextSettings){
  const validated=M.validate(next),settings=M.settings(nextSettings),schedule=M.schedule(validated);
  invalidate();data=validated;controls=settings;baseline=schedule;result=null;selected=null;page=0;draft=false;
  $('activities').value=JSON.stringify(data.activities,null,2);$('precedences').value=JSON.stringify(data.precedences,null,2);
  $('budget').value=controls.budget;$('value').value=controls.valueOfTime;$('error').textContent='';render();
}
function report(){return result&&selected?M.selectedReport(data,result,selected,mode):null;}
function render(){
  $('applied').textContent='Applied dataset: '+Object.keys(data.activities).length+' tasks · '+data.precedences.length+' precedences. Displayed budget '+f(controls.budget)+'; value per week '+f(controls.valueOfTime)+'.';
  const summary=$('summary');summary.replaceChildren();
  for(const [label,value] of [['Baseline weeks',baseline.finish],['Selected weeks',selected?.finish],['Selected cost',selected?.cost],['Weeks saved',selected?baseline.finish-selected.finish:undefined],['Net value',selected?M.selectedReport(data,result,selected,mode).selection.netValue:undefined]]){const box=el('div',undefined,'metric');box.append(el('span',label),el('strong',value===undefined?'—':f(value)));summary.append(box);}
  $('selection-note').textContent=result?f(result.portfolioCount)+' portfolios checked; '+f(result.frontier.length)+' nondominated points. Selection: '+(mode==='welfare'?'highest stated net value':mode==='knee'?'affordable knee heuristic':'manual frontier point')+'. No supplier payments are calculated.':'Compute the frontier to compare affordable selections. The baseline always uses declared option 0.';
  drawGantt($('baseline-chart'),baseline,'Declared baseline');drawGantt($('selected-chart'),selected?M.schedule(data,selected.choices):null,'Selected schedule');
  drawFrontier();renderFrontierTable();renderSchedules();
  const snapshot=report();$('result-json').value=snapshot?JSON.stringify(snapshot,null,2):'';
  for(const id of ['export-result','export-schedules','export-frontier','select-json'])$(id).disabled=!snapshot;
}
async function run(choiceMode='welfare'){
  if(draft)throw Error('Apply the edited JSON before running a comparison.');
  const settings=readSettings(),snapshot=data,token=++sequence;busy(true);$('error').textContent='';note('Enumerating the bounded menus… The previous completed comparison remains visible.');
  const combos=[];
  try{
    for(const p of M.portfolios(snapshot)){
      if(token!==sequence)return;
      combos.push(p);
      if(combos.length%300===0){note('Checked '+f(combos.length)+' portfolios…');await new Promise(resolve=>setTimeout(resolve,0));}
    }
    if(token!==sequence)return;
    const next=M.evaluate(snapshot,combos,settings);
    controls=settings;result=next;selected=choiceMode==='knee'?next.knee:next.welfare;mode=choiceMode;page=Math.floor(next.frontier.indexOf(selected)/100);
    render();note('Complete: '+f(combos.length)+' portfolios checked. Selected cost '+f(selected.cost)+' is within budget '+f(controls.budget)+'.');
  }finally{if(token===sequence)busy(false);}
}
function choose(p){
  if(draft)throw Error('Apply the JSON draft before selecting a portfolio.');
  const current=readSettings();if(current.budget!==controls.budget||current.valueOfTime!==controls.valueOfTime)throw Error('Run the changed budget/value controls before selecting a point.');
  if(p.costUnits>M.units(controls.budget,'Budget',1000000000))throw Error('This point exceeds the applied budget.');
  const focusTag=document.activeElement?.dataset.portfolio===String(p.id)?document.activeElement.tagName:null;
  invalidate();selected=p;mode='manual';$('error').textContent='';render();
  if(focusTag)[...document.querySelectorAll('[data-portfolio="'+p.id+'"]')].find(e=>e.tagName===focusTag)?.focus();
  note('Selected frontier portfolio '+p.id+' at cost '+f(p.cost)+' and '+f(p.finish)+' weeks.');
}
function drawGantt(host,schedule,label){
  host.replaceChildren();if(!schedule){host.append(el('p','Run a selection to show its schedule.','small'));return;}
  const W=620,pad=74,rowH=24,rows=schedule.rows.slice().sort((a,b)=>a.ES-b.ES||a.id.localeCompare(b.id)),H=rows.length*rowH+52,max=Math.max(schedule.finish,1),scale=t=>pad+t/max*(W-pad-16);
  const svg=svgEl('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':label+': '+f(schedule.finish)+' weeks. Full task times are in the schedule table.'});
  for(let i=0;i<=5;i++){const x=scale(max*i/5);svg.append(svgEl('line',{x1:x,y1:8,x2:x,y2:H-28,class:'gridline'}),svgEl('text',{x,y:H-8,'text-anchor':'middle'},f(max*i/5)));}
  rows.forEach((r,i)=>{const y=12+i*rowH,title=r.id+' · '+(data.activities[r.id].name||r.id)+' · start '+f(r.ES)+', finish '+f(r.EF)+', duration '+f(r.duration)+(r.critical?' · critical':''),mark=r.duration===0?svgEl('circle',{cx:scale(r.ES),cy:y+7,r:4,class:r.critical?'critical':'normal'}):svgEl('rect',{x:scale(r.ES),y,width:Math.max(1,scale(r.EF)-scale(r.ES)),height:14,rx:2,class:r.critical?'critical':'normal'});mark.append(svgEl('title',{},title));svg.append(mark,svgEl('text',{x:2,y:y+11},r.id.length>10?r.id.slice(0,9)+'…':r.id));});
  host.append(svg,el('p','Weeks from project start · red = zero float; blue = positive float. Zero-duration tasks are dots.','small'));
}
function drawFrontier(){
  const host=$('frontier-chart');host.replaceChildren();$('knee-note').textContent='';if(!result)return;
  const points=result.frontier,W=700,H=280,pad={l:58,r:22,t:18,b:42},minT=Math.min(...points.map(p=>p.finish)),maxT=Math.max(...points.map(p=>p.finish)),maxC=Math.max(1,...points.map(p=>p.cost)),x=c=>pad.l+c/maxC*(W-pad.l-pad.r),y=t=>pad.t+(maxT-t)/(maxT-minT||1)*(H-pad.t-pad.b);
  const svg=svgEl('svg',{viewBox:`0 0 ${W} ${H}`,role:'group','aria-label':'Cost and finish-time frontier; use the table for exact values and all points.'});
  for(let i=0;i<=4;i++){const cost=maxC*i/4,t=maxT-(maxT-minT)*i/4;svg.append(svgEl('line',{x1:x(cost),y1:pad.t,x2:x(cost),y2:H-pad.b,class:'gridline'}),svgEl('text',{x:x(cost),y:H-20,'text-anchor':'middle'},f(cost)),svgEl('text',{x:pad.l-8,y:y(t)+4,'text-anchor':'end'},f(t)));}
  svg.append(svgEl('text',{x:W/2,y:H-2,'text-anchor':'middle'},'Incremental cost'),svgEl('text',{x:6,y:12},'Weeks'));
  const sample=new Map();for(let i=0;i<Math.min(600,points.length);i++){const p=points[Math.round(i*(points.length-1)/Math.max(1,Math.min(600,points.length)-1))];sample.set(p.id,p);}for(const p of [result.knee,result.welfare,selected])sample.set(p.id,p);const drawn=[...sample.values()].sort((a,b)=>a.cost-b.cost);
  svg.append(svgEl('polyline',{points:drawn.map(p=>x(p.cost)+','+y(p.finish)).join(' '),class:'frontierline'}));
  for(const p of drawn){const feasible=p.costUnits<=M.units(controls.budget,'Budget',1000000000),label='Portfolio '+p.id+': cost '+f(p.cost)+', '+f(p.finish)+' weeks'+(feasible?'':', above budget');const dot=svgEl('circle',{cx:x(p.cost),cy:y(p.finish),r:p.id===selected.id?7:5,class:'frontierpoint'+(!feasible?' over':'')+(p.id===result.knee.id?' knee':'')+(p.id===result.welfare.id?' welfare':'')+(p.id===selected.id?' selected':''),role:'button','data-portfolio':p.id,tabindex:feasible?0:-1,'aria-label':label,'aria-disabled':String(!feasible)});dot.append(svgEl('title',{},label));if(feasible){dot.addEventListener('click',safe(()=>choose(p)));dot.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();safe(()=>choose(p))();}});}svg.append(dot);}
  host.append(svg);
  $('knee-note').textContent='Knee: portfolio '+result.knee.id+'; highest net value: '+result.welfare.id+'. Gold = knee; blue = net-value choice; dark ring = selected. The knee uses normalised axes and is a heuristic. '+(points.length>600?'The chart samples 600 points plus these choices; the paged table and exports contain the full frontier.':'Every frontier point is shown.');
}
function table(headers,rows){const t=el('table'),head=el('thead'),h=el('tr');headers.forEach(v=>{const th=el('th',v);th.scope='col';h.append(th);});head.append(h);const body=el('tbody');for(const row of rows){const tr=el('tr');for(const value of row){const td=el('td');td.append(value instanceof Node?value:document.createTextNode(String(value)));tr.append(td);}body.append(tr);}t.append(head,body);return t;}
function renderFrontierTable(){const host=$('frontier-table');host.replaceChildren();if(!result)return;const pages=Math.ceil(result.frontier.length/100);page=Math.max(0,Math.min(page,pages-1));const toolbar=el('div',undefined,'toolbar');
  for(const [label,delta] of [['Previous page',-1],['Next page',1]]){const button=el('button',label);button.disabled=page+delta<0||page+delta>=pages;button.id=delta<0?'frontier-prev':'frontier-next';button.onclick=()=>{page+=delta;renderFrontierTable();const b=$(button.id);if(!b.disabled)b.focus();else host.focus();};toolbar.append(button);}toolbar.append(el('span','Page '+(page+1)+' of '+pages+' · '+result.frontier.length+' points'));
  const rows=result.frontier.slice(page*100,page*100+100).map(p=>{const feasible=p.costUnits<=M.units(controls.budget,'Budget',1000000000),b=el('button',p.id===selected.id?'Selected':'Choose '+p.id);b.disabled=!feasible;b.dataset.portfolio=p.id;b.onclick=safe(()=>choose(p));return [p.id,f(p.cost),f(p.finish),f(M.netValue(result,p)),feasible?'Yes':'No',p.id===result.knee.id?'Knee':'',p.id===result.welfare.id?'Highest net value':'',b];});
  host.append(toolbar,table(['Portfolio','Cost','Weeks','Net value','Within budget','Knee','Value choice','Selection'],rows));
}
function renderSchedules(){const host=$('schedule-table');host.replaceChildren();const schedules=[['Baseline',baseline]];if(selected)schedules.push(['Selected',M.schedule(data,selected.choices)]);const rows=[];for(const [label,s] of schedules)for(const r of s.rows)rows.push([label,r.id,data.activities[r.id].name||r.id,r.optionIndex,f(r.duration),f(r.cost),f(r.ES),f(r.EF),f(r.LS),f(r.LF),f(r.float),r.critical?'Yes':'No']);host.append(table(['Mode','ID','Name','Option','Duration','Extra cost','ES','EF','LS','LF','Float','Critical'],rows));}
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type})),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);note('Download requested: '+name+'. Result JSON also remains available for manual copying.');}
function requireReport(){const r=report();if(!r)throw Error('Run a comparison before exporting results.');return r;}
$('apply').onclick=safe(()=>{const next={activities:JSON.parse($('activities').value),precedences:JSON.parse($('precedences').value)};if(data.title!==undefined)next.title=data.title;applyData(next,readSettings());note('Edits applied and baseline computed. Run a comparison to rebuild the frontier.');});
$('baseline').onclick=safe(()=>{if(draft)throw Error('Apply edited JSON first.');baseline=M.schedule(data);render();note('Declared baseline recomputed: '+f(baseline.finish)+' weeks.');});
$('enumerate').onclick=safe(()=>run('knee'));$('welfare').onclick=safe(()=>run('welfare'));$('run-all').onclick=safe(()=>run('welfare'));
$('reset').onclick=safe(()=>{applyData(window.TimeExchangeExample,{budget:300,valueOfTime:80});note('A–G example and default controls restored.');return run('welfare');});
$('cancel').onclick=()=>{invalidate();note('Calculation cancelled. The previous completed result remains available.');};
for(const id of ['activities','precedences'])$(id).addEventListener('input',()=>{draft=true;invalidate();note('JSON draft changed. Apply edits before running; the previous applied dataset is still shown.');});
for(const id of ['budget','value'])$(id).addEventListener('input',()=>{invalidate();note('Budget/value edited. Run a choice to apply them; displayed results still use budget '+f(controls.budget)+' and value '+f(controls.valueOfTime)+'.');});
$('import').onclick=()=>{$('file').value='';$('file').click();};
$('file').addEventListener('change',async()=>{
  const token=++sequence,file=$('file').files[0];let active=token;busy(false);if(!file)return;note('Reading JSON…');
  try{
    if(file.size>M.MAX_BYTES)throw Error('Use a JSON file under 1.5 MB.');
    const source=await file.text();if(token!==sequence)return;
    const parsed=M.parse(source),nextSettings=parsed.settings||readSettings();applyData(parsed.data,nextSettings);
    note('Imported input validated; stored outputs are ignored and recomputed.');
    const work=run('welfare');active=sequence;await work;if(active!==sequence)return;
    if(parsed.selection&&result){const p=result.combos.find(p=>JSON.stringify(p.choices)===JSON.stringify(parsed.selection.choices));if(p&&p.costUnits<=M.units(controls.budget,'Budget',1000000000)){selected=p;mode=p.id===result.knee.id&&parsed.selection.mode==='knee'?'knee':p.id===result.welfare.id&&parsed.selection.mode==='welfare'?'welfare':'manual';render();}}
  }catch(e){if(active===sequence)error(e);}
});
$('export-input').onclick=safe(()=>download(JSON.stringify({format:'project-time-exchange',version:1,dataset:data,settings:controls},null,2),'project-time-exchange-input.json','application/json'));
$('export-result').onclick=safe(()=>download(JSON.stringify(requireReport(),null,2),'project-time-exchange-result.json','application/json'));
$('export-schedules').onclick=safe(()=>download(M.scheduleCSV(requireReport()),'project-time-exchange-schedules.csv','text/csv'));
$('export-frontier').onclick=safe(()=>download(M.frontierCSV(requireReport()),'project-time-exchange-frontier.csv','text/csv'));
$('select-json').onclick=()=>{$('result-json').focus();$('result-json').select();};
function revealFragment(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const target=document.getElementById(id);if(target)for(let p=target;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}
window.addEventListener('hashchange',revealFragment);revealFragment();
applyData(window.TimeExchangeExample,{budget:300,valueOfTime:80});safe(()=>run('welfare'))();
})();
