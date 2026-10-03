(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.TimeExchange=factory();})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const SCALE=1000000, MAX_TASKS=40, MAX_OPTIONS=20, MAX_COMBINATIONS=50000, MAX_WORK=2000000, MAX_BYTES=1500000;
const dict=()=>Object.create(null), clone=x=>JSON.parse(JSON.stringify(x));
function record(x,label,keys){if(!x||typeof x!=='object'||Array.isArray(x))throw Error(label+' must be an object.');if(keys)for(const k of Object.keys(x))if(!keys.includes(k))throw Error(label+': unknown field '+k+'.');}
function units(value,label,max=1000000){
  if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>max)throw Error(label+' must be a finite number from 0 to '+max+'.');
  const scaled=value*SCALE, rounded=Math.round(scaled);
  if(Math.abs(scaled-rounded)>Math.max(1e-7,Math.abs(scaled)*Number.EPSILON*2))throw Error(label+' supports up to six decimal places.');
  return rounded;
}
function text(value,label,max=4000){if(typeof value!=='string'||value.length>max)throw Error(label+' must be text of at most '+max+' characters.');}
function settings(input){record(input,'Settings',['budget','valueOfTime']);units(input.budget,'Budget',1000000000);units(input.valueOfTime,'Value of time');return {budget:input.budget,valueOfTime:input.valueOfTime};}
function validate(input){
  record(input,'Dataset',['activities','precedences','title']);record(input.activities,'Activities');
  const ids=Object.keys(input.activities).sort();if(!ids.length||ids.length>MAX_TASKS)throw Error('Use 1–'+MAX_TASKS+' activities.');
  if(!Array.isArray(input.precedences)||input.precedences.length>MAX_TASKS*(MAX_TASKS-1)/2)throw Error('Precedences must be a bounded array of {from,to} records.');
  const data={activities:dict(),precedences:[]};if(input.title!==undefined){text(input.title,'Title',200);data.title=input.title;}
  let count=1;
  for(const id of ids){
    if(!id.trim()||id.length>100)throw Error('Activity IDs must be non-empty text of at most 100 characters.');
    const a=input.activities[id];record(a,'Activity '+id,['name','duration','crashOptions','floor','notes']);
    const duration=units(a.duration,'Activity '+id+' duration');
    if(a.name!==undefined)text(a.name,'Activity name',200);if(a.notes!==undefined)text(a.notes,'Activity notes');
    const floor=a.floor===undefined?0:units(a.floor,'Activity '+id+' floor');if(floor>duration)throw Error('Activity '+id+' floor exceeds its declared baseline duration.');
    if(!Array.isArray(a.crashOptions)||!a.crashOptions.length||a.crashOptions.length>MAX_OPTIONS)throw Error('Activity '+id+' needs 1–'+MAX_OPTIONS+' explicit crash options, including its baseline first.');
    for(const [i,o] of a.crashOptions.entries()){
      record(o,'Activity '+id+' option '+i,['duration','cost','label','notes','risk']);
      const d=units(o.duration,'Activity '+id+' option '+i+' duration');units(o.cost,'Activity '+id+' option '+i+' cost');
      if(d<floor||d>duration)throw Error('Activity '+id+' option '+i+' must be between its floor and baseline duration.');
      for(const key of ['label','notes','risk'])if(o[key]!==undefined)text(o[key],'Option '+key);
    }
    if(a.crashOptions[0].duration!==a.duration||a.crashOptions[0].cost!==0)throw Error('Activity '+id+': option 0 must be its declared baseline duration at zero incremental cost.');
    count*=a.crashOptions.length;
    if(count>MAX_COMBINATIONS)throw Error('Menus exceed the '+MAX_COMBINATIONS.toLocaleString('en-US')+'-portfolio enumeration cap. Reduce the number of options or activities.');
    data.activities[id]=clone(a);
  }
  const seen=new Set();
  for(const e of input.precedences){
    record(e,'Precedence',['from','to']);if(typeof e.from!=='string'||typeof e.to!=='string'||!Object.hasOwn(data.activities,e.from)||!Object.hasOwn(data.activities,e.to))throw Error('Every precedence needs existing from/to activity IDs.');
    if(e.from===e.to)throw Error('Self-loop precedence is not allowed.');
    const key=JSON.stringify([e.from,e.to]);if(seen.has(key))throw Error('Duplicate precedence '+e.from+' → '+e.to+'.');seen.add(key);data.precedences.push({from:e.from,to:e.to});
  }
  if(count*(ids.length+data.precedences.length)>MAX_WORK)throw Error('This network exceeds the bounded evaluation-work cap. Reduce menus or network size.');
  compile(data);return data;
}
function compile(data){
  const ids=Object.keys(data.activities).sort(),index=new Map(ids.map((id,i)=>[id,i])),preds=ids.map(()=>[]),succs=ids.map(()=>[]),indeg=ids.map(()=>0);
  for(const e of data.precedences){const a=index.get(e.from),b=index.get(e.to);preds[b].push(a);succs[a].push(b);indeg[b]++;}
  const queue=indeg.flatMap((d,i)=>d===0?[i]:[]),order=[];
  for(let i=0;i<queue.length;i++){const u=queue[i];order.push(u);for(const v of succs[u])if(--indeg[v]===0)queue.push(v);}
  if(order.length!==ids.length)throw Error('Precedence graph has a cycle; CPM requires a DAG.');
  return {ids,index,preds,succs,order,menus:ids.map(id=>data.activities[id].crashOptions.map(o=>({duration:units(o.duration,'Duration'),cost:units(o.cost,'Cost')})))};
}
function forward(comp,durations){const es=comp.ids.map(()=>0),ef=comp.ids.map(()=>0);for(const i of comp.order){for(const p of comp.preds[i])es[i]=Math.max(es[i],ef[p]);ef[i]=es[i]+durations[i];}return {es,ef,finish:Math.max(0,...ef)};}
function scheduleCompiled(comp,choices){
  const durations=choices.map((o,i)=>comp.menus[i][o].duration),f=forward(comp,durations),ls=comp.ids.map(()=>0),lf=comp.ids.map(()=>f.finish);
  for(const i of comp.order.slice().reverse()){if(comp.succs[i].length)lf[i]=Math.min(...comp.succs[i].map(j=>ls[j]));ls[i]=lf[i]-durations[i];}
  const rows=comp.ids.map((id,i)=>({id,optionIndex:choices[i],duration:durations[i]/SCALE,cost:comp.menus[i][choices[i]].cost/SCALE,ES:f.es[i]/SCALE,EF:f.ef[i]/SCALE,LS:ls[i]/SCALE,LF:lf[i]/SCALE,float:(ls[i]-f.es[i])/SCALE,critical:ls[i]===f.es[i]}));
  return {finish:f.finish/SCALE,rows,critical:rows.filter(r=>r.critical).map(r=>r.id)};
}
function schedule(data,choices){const d=validate(data),c=compile(d),selected=choices===undefined?c.ids.map(()=>0):choices.slice();if(selected.length!==c.ids.length||selected.some((o,i)=>!Number.isInteger(o)||o<0||o>=c.menus[i].length))throw Error('Select one valid option per activity in sorted ID order.');return scheduleCompiled(c,selected);}
function* portfolios(data){
  const d=validate(data),c=compile(d),choices=c.ids.map(()=>0);let id=0,more=true;
  while(more){const ds=choices.map((o,i)=>c.menus[i][o].duration),cost=choices.reduce((sum,o,i)=>sum+c.menus[i][o].cost,0),finish=forward(c,ds).finish;yield {id:id++,choices:choices.slice(),cost:cost/SCALE,finish:finish/SCALE,costUnits:cost,finishUnits:finish};
    let j=choices.length-1;while(j>=0){choices[j]++;if(choices[j]<c.menus[j].length)break;choices[j]=0;j--;}more=j>=0;
  }
}
function frontier(combos){let best=Infinity;const out=[];for(const p of combos.slice().sort((a,b)=>a.costUnits-b.costUnits||a.finishUnits-b.finishUnits||a.id-b.id)){if(p.finishUnits<best){out.push(p);best=p.finishUnits;}}return out;}
function knee(points){if(!points.length)return null;if(points.length<3)return points.at(-1);const first=points[0],last=points.at(-1),dx=last.costUnits-first.costUnits,dy=first.finishUnits-last.finishUnits;let best=first,distance=-1;
  for(const p of points){const x=dx?(p.costUnits-first.costUnits)/dx:0,y=dy?(first.finishUnits-p.finishUnits)/dy:0,d=Math.abs(y-x)/Math.SQRT2;if(d>distance+1e-12){distance=d;best=p;}}return best;
}
function evaluate(data,combos,control){
  const controls=settings(control),baseline=schedule(data),allFrontier=frontier(combos),budgetUnits=units(controls.budget,'Budget',1000000000),feasible=allFrontier.filter(p=>p.costUnits<=budgetUnits),v=BigInt(units(controls.valueOfTime,'Value of time')),base=BigInt(units(baseline.finish,'Baseline finish',MAX_TASKS*1000000));
  if(!feasible.length)throw Error('No budget-feasible portfolio.');
  let welfareChoice=null,best=null;
  for(const p of feasible){const score=v*(base-BigInt(p.finishUnits))-BigInt(p.costUnits)*BigInt(SCALE);if(best===null||score>best||(score===best&&(p.costUnits<welfareChoice.costUnits||(p.costUnits===welfareChoice.costUnits&&p.finishUnits<welfareChoice.finishUnits)))){best=score;welfareChoice=p;}}
  return {controls,baseline,combos,frontier:allFrontier,feasible,knee:knee(feasible),welfare:welfareChoice,welfareValue:Number(best)/(SCALE*SCALE),portfolioCount:combos.length};
}
function analyse(input,control){const data=validate(input);return evaluate(data,[...portfolios(data)],control);}
function value(result,p){const v=BigInt(units(result.controls.valueOfTime,'Value of time')),base=BigInt(units(result.baseline.finish,'Baseline finish',MAX_TASKS*1000000));return Number(v*(base-BigInt(p.finishUnits))-BigInt(p.costUnits)*BigInt(SCALE))/(SCALE*SCALE);}
function selectedReport(data,result,selected,mode){
  selected=result.combos.find(p=>p.id===selected?.id);if(!selected||selected.costUnits>units(result.controls.budget,'Budget',1000000000))throw Error('Selection must be an enumerated portfolio within the budget.');
  const snap=p=>({id:p.id,choices:p.choices.slice(),cost:p.cost,finish:p.finish,budgetFeasible:p.costUnits<=units(result.controls.budget,'Budget',1000000000),netValue:value(result,p)});
  return {format:'project-time-exchange',version:1,dataset:clone(data),settings:clone(result.controls),selection:{mode,...snap(selected)},baseline:result.baseline,selectedSchedule:schedule(data,selected.choices),summary:{portfolioCount:result.portfolioCount,feasiblePortfolioCount:result.combos.filter(p=>p.costUnits<=units(result.controls.budget,'Budget',1000000000)).length,frontierCount:result.frontier.length,kneeId:result.knee.id,welfareId:result.welfare.id},frontier:result.frontier.map(snap),assumptions:{timeUnit:'weeks',costUnit:'consistent user-defined incremental cost units',baseline:'declared option 0; never replaced by a faster zero-cost option',precedence:'finish-to-start, zero lag, unlimited resources, deterministic durations',budget:'cap on declared incremental option costs, not payments',paymentMechanism:'not implemented',enumerationCap:MAX_COMBINATIONS,evaluationWorkCap:MAX_WORK,decimalPlaces:6}};
}
function parse(source){if(typeof source!=='string'||source.length>MAX_BYTES)throw Error('Use a JSON file under 1.5 MB.');let obj;try{obj=JSON.parse(source);}catch{throw Error('JSON could not be read. The applied dataset is unchanged.');}
  if(obj?.format==='project-time-exchange'){if(obj.version!==1)throw Error('Unsupported Project Time Exchange format version.');return {data:validate(obj.dataset),settings:settings(obj.settings),selection:obj.selection||null};}
  return {data:validate(obj),settings:null,selection:null};
}
function csv(rows){return rows.map(row=>row.map(v=>{let s=String(v??'');if(typeof v==='string'&&/^[\s]*[=+@-]/.test(s))s="'"+s;return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}).join(',')).join('\r\n');}
function scheduleCSV(report){const header=['mode','activity','name','option_index','duration_weeks','option_cost','ES','EF','LS','LF','float','critical','finish_weeks','portfolio_cost','budget','value_of_time','selection_mode','net_value'];const rows=[header];for(const [mode,sched] of [['baseline',report.baseline],['selected',report.selectedSchedule]])for(const r of sched.rows)rows.push([mode,r.id,report.dataset.activities[r.id].name||r.id,r.optionIndex,r.duration,r.cost,r.ES,r.EF,r.LS,r.LF,r.float,r.critical,sched.finish,mode==='baseline'?0:report.selection.cost,report.settings.budget,report.settings.valueOfTime,mode==='baseline'?'declared baseline':report.selection.mode,mode==='baseline'?0:report.selection.netValue]);return csv(rows);}
function frontierCSV(report){return csv([['portfolio_id','cost','finish_weeks','within_budget','net_value','is_knee','is_welfare','is_selected','budget','value_of_time','options_by_sorted_activity_id'],...report.frontier.map(p=>[p.id,p.cost,p.finish,p.budgetFeasible,p.netValue,p.id===report.summary.kneeId,p.id===report.summary.welfareId,p.id===report.selection.id,report.settings.budget,report.settings.valueOfTime,JSON.stringify(Object.fromEntries(Object.keys(report.dataset.activities).sort().map((id,i)=>[id,p.choices[i]])))])]);}
return {SCALE,MAX_TASKS,MAX_OPTIONS,MAX_COMBINATIONS,MAX_WORK,MAX_BYTES,validate,settings,units,schedule,portfolios,frontier,knee,evaluate,analyse,netValue:value,selectedReport,parse,csv,scheduleCSV,frontierCSV};
});
