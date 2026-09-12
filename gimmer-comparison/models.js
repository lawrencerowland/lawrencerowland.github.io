/* Gimmer comparison v2. Small finite models; all figures are fictional.
   This file has no DOM dependency and is also tested under Node. */
(function(root){
'use strict';
const BASE=Object.freeze({air:true,capacity:1,permit:true,budget:465});
const brief=s=>({...BASE,...s});
const all=(xs,p)=>xs.every(p); const unique=xs=>[...new Set(xs)];
function projection(s,backup=true){s=brief(s); const method=s.air?'air':backup?'winch':null;
 const facts=[{id:'F1',text:'No ground haul route',use:'retained'},{id:'F2',text:`Air window ${s.air?'available':'unavailable'}`,use:'retained'},{id:'F3',text:`Permit ${s.permit?'assumed cleared for this example':'evidence missing'}`,use:'retained'},{id:'F4',text:`${s.capacity} lifting resource(s)`,use:'retained'},{id:'F5',text:'Earlier colour debate',use:'omitted: chosen palette is already in the fixed brief'},{id:'F6',text:'Meeting narrative',use:'omitted: not a delivery constraint'}];
 const blockers=[...(!method?['No delivery method in this process']:[]),...(!s.permit?['Permit evidence must be supplied']:[]),...(s.capacity===0?['No lifting resource']:[])];
 return {method,facts,blockers,ready:!blockers.length,plan:['Prepare modules and access','Deliver modules','Inspect and accept','Remove temporary means'],commitments:[{text:method?`Use ${method} delivery`:'Delivery cannot be derived',sources:['F1','F2'],kind:method?'derived':'unsupported'},{text:s.permit?'Permit clearance is a supplied scenario assumption':'Obtain permit evidence before delivery',sources:['F3'],kind:s.permit?'assumed':'derived'},{text:s.capacity>0?'Schedule within lifting capacity':'Provide a lifting resource',sources:['F4'],kind:'derived'}]};
}
// 120: an explicit update system. p=0 absent,1 curing,2 ready,3 accepted.
function stateKey(x){return [Number(x.rig),...x.p,Number(x.removed)].join(',');}
function stateMoves(x,s,method='air'){s=brief(s);let out=[];
 const put=(name,y)=>out.push({name,state:y});
 if(!x.rig&&!x.removed)put('Set up rig',{...x,rig:true,p:[...x.p]});
 const absent=x.p.map((v,i)=>v===0?i:-1).filter(i=>i>=0);
 if(x.rig&&s.permit&&s.capacity>0&&(method==='winch'||s.air)){
  for(let mask=1;mask<(1<<absent.length);mask++){
   const ids=absent.filter((_,j)=>mask&(1<<j));if(ids.length>s.capacity)continue;
   const p=[...x.p];ids.forEach(i=>p[i]=1);put(`${method==='air'?'Lift':'Winch'} ${ids.map(i=>'AB'[i]).join(' + ')}`,{...x,p});
  }
 }
 x.p.forEach((v,i)=>{if(v===1||v===2){const p=[...x.p];p[i]++;put(`${v===1?'Cure':'Inspect'} ${'AB'[i]}`,{...x,p});}});
 if(x.rig&&x.p.every(v=>v===3))put('Remove rig',{...x,rig:false,removed:true,p:[...x.p]});return out;
}
function dynamics(s,method='air',initial={rig:false,p:[0,0],removed:false}){
 const nodes=[{state:initial,d:0,path:[]}],seen=new Map([[stateKey(initial),0]]); let goals=[];
 for(let i=0;i<nodes.length;i++){const n=nodes[i];if(n.state.removed)goals.push(n);
 for(const e of stateMoves(n.state,s,method)){const k=stateKey(e.state);if(!seen.has(k)){seen.set(k,nodes.length);nodes.push({state:e.state,d:n.d+1,path:[...n.path,e.name]});}}}
 return {states:nodes.length,steps:goals.length?Math.min(...goals.map(g=>g.d)):null,path:goals[0]?.path||[],nodes};
}
// 140: finite local constraints, with global domain intersection (not a sheaf theorem).
function compatibility(s,preset='agree'){s=brief(s);
 const sets=preset==='pairwise'?[['Jul','Aug'],['Aug','Sep'],['Jul','Sep']]:[['Aug'],['Aug'],[preset==='conflict'?'Sep':'Aug']];
 const views=[{name:'Delivery diary',month:sets[0],method:['air','winch']},{name:'Cost plan',month:sets[1],method:['air','winch']},{name:'Access review',month:sets[2],method:s.air?['air','winch']:['winch'],permit:s.permit&&preset!=='missing'?['cleared']:null}];
 const rows=['month','method','permit'].map(key=>{
  const relevant=views.filter(v=>Object.hasOwn(v,key));
  const missing=relevant.some(v=>v[key]===null);
  let values=missing?[]:relevant.reduce((a,v)=>a===null?[...v[key]]:a.filter(x=>v[key].includes(x)),null)||[];
  return {key,values,status:missing?'missing':values.length?'agree':'conflict',sources:relevant.map(v=>v.name)};
 });
 const pairwise=views.every((a,i)=>views.slice(i+1).every(b=>a.month.some(x=>b.month.includes(x))));
 let assignments=[];if(rows.every(r=>r.status==='agree'))for(const month of rows[0].values)for(const method of rows[1].values)assignments.push({month,method,permit:'cleared'});
 return {views,rows,pairwise,assignments,ok:assignments.length>0};
}
// 150: eight named, once-only transitions. Read prerequisites; one timed resource.
function jobs(method='air'){return [
 {id:'rig',name:'Rig',d:1,pre:[],resource:0,type:'Kit → Rig'},
 {id:'fabA',name:'Make A',d:2,pre:[],resource:0,type:'Raw A → Panel A'},
 {id:'fabB',name:'Make B',d:2,pre:[],resource:0,type:'Raw B → Panel B'},
 {id:'liftA',name:method==='air'?'Lift A':'Winch A',d:method==='air'?2:4,pre:['rig','fabA'],resource:1,type:'Panel A ⊗ Lift → Mounted A ⊗ Lift'},
 {id:'liftB',name:method==='air'?'Lift B':'Winch B',d:method==='air'?2:4,pre:['rig','fabB'],resource:1,type:'Panel B ⊗ Lift → Mounted B ⊗ Lift'},
 {id:'inspectA',name:'Inspect A',d:1,pre:['liftA'],resource:0,type:'Mounted A → Accepted A'},
 {id:'inspectB',name:'Inspect B',d:1,pre:['liftB'],resource:0,type:'Mounted B → Accepted B'},
 {id:'remove',name:'Remove rig',d:1,pre:['inspectA','inspectB'],resource:0,type:'Rig ⊗ Acceptance records → Clear site'}];}
function orders(js){let out=[];function visit(done){if(done.length===js.length){out.push(done);return;}for(const j of js)if(!done.includes(j.id)&&j.pre.every(x=>done.includes(x)))visit([...done,j.id]);}visit([]);return out;}
function schedule(js,order,capacity){let now=0,done=new Set(),running=[],rows=[];const J=Object.fromEntries(js.map(j=>[j.id,j]));
 while(done.size<js.length){
  let available=capacity-running.reduce((a,j)=>a+j.resource,0);
  for(const id of order){const j=J[id];if(done.has(id)||running.some(x=>x.id===id)||!j.pre.every(x=>done.has(x))||j.resource>available)continue;
   const row={...j,start:now,end:now+j.d};running.push(row);rows.push(row);available-=j.resource;
  }
  if(!running.length)return null;
  now=Math.min(...running.map(j=>j.end));for(const j of running.filter(j=>j.end===now))done.add(j.id);running=running.filter(j=>j.end!==now);
 }return {rows,end:now};}
function replay(js,sch,capacity){if(!sch)return ['No schedule'];const errors=[],J=Object.fromEntries(js.map(j=>[j.id,j])),seen=new Set();
 for(const r of sch.rows){if(!J[r.id]||seen.has(r.id)){errors.push('Unknown or repeated work');continue;}seen.add(r.id);if(r.end-r.start!==J[r.id].d||r.start<0)errors.push('Invalid duration');
 for(const p of J[r.id].pre){const predecessor=sch.rows.find(x=>x.id===p);if(!predecessor||predecessor.end>r.start)errors.push('Precedence violated');}}
 if(seen.size!==js.length)errors.push('Missing work');
 for(const t of unique(sch.rows.flatMap(r=>[r.start,r.end])))if(sch.rows.filter(r=>r.start<=t&&t<r.end).reduce((a,r)=>a+J[r.id].resource,0)>capacity)errors.push('Capacity exceeded');return errors;
}
const ORDER_CACHE={};
function plans(s,method='air'){s=brief(s);const js=jobs(method);const blockers=[...(!s.permit?['Permit evidence missing']:[]),...(method==='air'&&!s.air?['Air window absent']:[]),...(s.capacity<1?['No lifting resource']:[])];
 if(blockers.length)return {jobs:js,traces:[],schedules:[],blockers};
 const traces=ORDER_CACHE[method]||(ORDER_CACHE[method]=orders(js));const seen=new Set(),schedules=[];
 for(const trace of traces){const sch=schedule(js,trace,s.capacity);const k=sch.rows.map(r=>`${r.id}:${r.start}`).sort().join('|');if(!seen.has(k)){seen.add(k);schedules.push({...sch,trace});}}
 schedules.sort((a,b)=>a.end-b.end);return {jobs:js,traces,schedules,blockers};
}
// 160: nominal port typing plus a separately checked simultaneous capacity contract.
function wiring(s,{accepted=true,parallel=false}={}){s=brief(s);
 const nodes=[{id:'panelA',output:'Mounted A'},{id:'panelB',output:'Mounted B'},{id:'reviewA',output:accepted?'Accepted A':'Mounted A'},{id:'reviewB',output:accepted?'Accepted B':'Mounted B'},{id:'handover',output:'Usable refuge'}];
 const edges=[{from:'panelA',to:'reviewA',need:'Mounted A'},{from:'panelB',to:'reviewB',need:'Mounted B'},{from:'reviewA',to:'handover',need:'Accepted A'},{from:'reviewB',to:'handover',need:'Accepted B'}];
 const ports=edges.map(e=>({...e,actual:nodes.find(n=>n.id===e.from).output,ok:nodes.find(n=>n.id===e.from).output===e.need}));
 const demand=parallel?2:1;const failed=ports.filter(p=>!p.ok);const reasons=[...failed.map(p=>`${p.to} needs ${p.need}; received ${p.actual}`),...(demand>s.capacity?[`${demand} simultaneous lifts exceed capacity ${s.capacity}`]:[]),...(!s.permit?['Delivery permit evidence is missing']:[]),...(!s.air?['Selected air-delivery input is unavailable']:[])];
 return {nodes,ports,demand,reasons,ok:!reasons.length,affected:unique(failed.map(e=>e.to))};
}
// 170: enumerate shared two-window behaviours; distinct proposal and accepted state is UI-owned.
function sharing(s,access='both',method='air'){s=brief(s);const windows=access==='both'?['Aug','Sep']:[access];let options=[];
 for(const a of windows)for(const b of windows){const demand=a===b?2:1,cost=method==='air'?430:400;
 if(demand<=s.capacity&&s.permit&&(method==='winch'||s.air)&&cost<=s.budget)options.push({a,b,demand,cost});}
 return {windows,options,method,authority:'Fictional access reviewer proposes windows; project lead accepts this local demonstration state.'};
}
// 180: an exhaustively enumerated catalogue, including temporary rig costs and size constraints.
function codesign(s,temporary=true){s=brief(s);const shells=[{id:'Single cassette',cost:280,mass:2.1,wind:200,units:1},{id:'Split cassettes',cost:250,mass:1.0,wind:180,units:2},{id:'Light cassettes',cost:205,mass:.8,wind:140,units:2}];
 const routes=[{id:'Air',cost:105,limit:2.5,rig:20,days:12,site:2},{id:'Winch',cost:65,limit:1.3,rig:30,days:18,site:7}];let items=[];
 for(const shell of shells)for(const route of routes){const rig=route.rig+(shell.mass>2?30:0),endpoint=shell.cost+route.cost+55,cost=endpoint+rig;const reasons=[];
 if(shell.wind<160)reasons.push('Below fixed 160 km/h acceptance floor');if(shell.mass>route.limit)reasons.push('Cassette exceeds method load limit');if(route.id==='Air'&&!s.air)reasons.push('Air window unavailable');if(s.capacity===0)reasons.push('No lifting resource');if(!s.permit)reasons.push('Permit evidence missing');if(!temporary)reasons.push('Temporary rig absent from construction path');if(cost>s.budget)reasons.push('Full path exceeds budget');
 items.push({id:shell.id+' / '+route.id,shell:shell.id,route:route.id,cost,endpoint,rig,days:route.days-(s.capacity===2&&shell.units===2?3:0),site:route.site,wind:shell.wind,reasons,feasible:!reasons.length,path:['Set up temporary rig','Deliver cassettes','Install and inspect','Remove temporary rig']});}
 const feasible=items.filter(x=>x.feasible);const dominates=(a,b)=>['cost','days','site'].every(k=>a[k]<=b[k])&&['cost','days','site'].some(k=>a[k]<b[k]);return {items,frontier:feasible.filter(b=>!feasible.some(a=>dominates(a,b)))};
}
// 210: explicit local method descriptions compiled to propositional planning actions.
const DOMAIN_TYPES={rig:'TemporaryMeans',rawA:'PhysicalObject',rawB:'PhysicalObject',onA:'PhysicalObject',onB:'PhysicalObject',acceptedA:'AcceptanceRecord',acceptedB:'AcceptanceRecord',clear:'SiteCondition',permit:'Evidence',air:'Resource',lift:'Resource'};
function semanticActions(scope=['A','B'],method='air'){
 if(!scope.length)return [];
 const acts=[{id:'setup',name:'Set up rig',pre:['clear'],add:['rig'],del:['clear'],function:'access'}];
 for(const u of scope){acts.push({id:'install'+u,name:`${method==='air'?'Lift':'Winch'} ${u}`,pre:['rig','raw'+u,'permit','lift',...(method==='air'?['air']:[])],add:['on'+u],del:['raw'+u],function:'install'+u});acts.push({id:'inspect'+u,name:`Inspect ${u}`,pre:['on'+u],add:['accepted'+u],del:['on'+u],function:'accept'+u});}
 acts.push({id:'remove',name:'Remove rig',pre:['rig',...scope.map(u=>'accepted'+u)],add:['clear'],del:['rig'],function:'clear'});return acts;
}
function searchActions(actions,initial,goals){const queue=[{facts:[...initial].sort(),plan:[]}],seen=new Set([queue[0].facts.join('|')]);
 for(let i=0;i<queue.length;i++){const x=queue[i];if(goals.every(g=>x.facts.includes(g)))return {plan:x.plan,states:seen.size};
 for(const a of actions)if(a.pre.every(p=>x.facts.includes(p))){const facts=unique([...x.facts.filter(p=>!a.del.includes(p)),...a.add]).sort(),key=facts.join('|');if(!seen.has(key)){seen.add(key);queue.push({facts,plan:[...x.plan,a.id]});}}}return {plan:null,states:seen.size};}
function directPDDL(scope,method){const preds=['rig','clear','permit','air','lift',...scope.flatMap(u=>['raw'+u,'on'+u,'accepted'+u])];
 const literal=xs=>xs.map(x=>`(${x})`).join(' ');let a=[];
 if(scope.length){a.push('(:action setup :parameters () :precondition (and (clear)) :effect (and (rig) (not (clear))))');
 for(const u of scope){a.push(`(:action install${u} :parameters () :precondition (and (rig) (raw${u}) (permit) (lift) ${method==='air'?'(air)':''}) :effect (and (on${u}) (not (raw${u}))))`);a.push(`(:action inspect${u} :parameters () :precondition (and (on${u})) :effect (and (accepted${u}) (not (on${u}))))`);}
 a.push(`(:action remove :parameters () :precondition (and (rig) ${literal(scope.map(u=>'accepted'+u))}) :effect (and (clear) (not (rig))))`);}
 return `(define (domain gimmer) (:requirements :strips) (:predicates ${literal(preds)})\n${a.join('\n')}\n)`;
}
function parsePDDL(source){const tokens=source.replace(/;[^\n]*/g,'').match(/\(|\)|[^\s()]+/g);let i=0;function read(){if(tokens[i++]!=='(')throw Error('Expected list');const a=[];while(i<tokens.length&&tokens[i]!==')')a.push(tokens[i]==='('?read():tokens[i++]);if(tokens[i++]!==')')throw Error('Unclosed list');return a;}const tree=read();if(i!==tokens.length)throw Error('Trailing input');
 return tree.filter(x=>Array.isArray(x)&&x[0]===':action').map(x=>{const pre=x[x.indexOf(':precondition')+1],effect=x[x.indexOf(':effect')+1];if(pre[0]!=='and'||effect[0]!=='and')throw Error('Unsupported PDDL');return {id:x[1],pre:pre.slice(1).map(p=>p[0]),add:effect.slice(1).filter(p=>p[0]!=='not').map(p=>p[0]),del:effect.slice(1).filter(p=>p[0]==='not').map(p=>p[1][0])};});}
// Separate bit-mask reachability implementation for the direct PDDL route.
function searchPDDL(actions,initial,goals){const ps=unique([...initial,...goals,...actions.flatMap(a=>[...a.pre,...a.add,...a.del])]);const mask=xs=>xs.reduce((n,x)=>n|(1<<ps.indexOf(x)),0);const A=actions.map(a=>({...a,p:mask(a.pre),a:mask(a.add),d:mask(a.del)}));const init=mask(initial),goal=mask(goals),queue=[[init,[]]],seen=new Set([init]);
 for(let i=0;i<queue.length;i++){const [state,path]=queue[i];if((state&goal)===goal)return path;for(const a of A)if((state&a.p)===a.p){const n=(state&~a.d)|a.a;if(!seen.has(n)){seen.add(n);queue.push([n,[...path,a.id]]);}}}return null;}
function semantics(s,scope=['A','B'],method='air'){s=brief(s);const initial=['clear',...scope.map(u=>'raw'+u),...(s.air?['air']:[]),...(s.permit?['permit']:[]),...(s.capacity?['lift']:[])],goals=['clear',...scope.map(u=>'accepted'+u)],actions=semanticActions(scope,method),result=searchActions(actions,initial,goals),domain=directPDDL(scope,method),direct=searchPDDL(parsePDDL(domain),initial,goals);
 const required=result.plan?unique(actions.map(a=>a.function)).filter(f=>searchActions(actions.filter(a=>a.function!==f),initial,goals).plan===null):[];
 const support=actions.map(a=>({id:a.id,pre:a.pre,add:a.add}));const problem=`(define (problem gimmer-brief) (:domain gimmer) (:init ${initial.map(x=>`(${x})`).join(' ')}) (:goal (and ${goals.map(x=>`(${x})`).join(' ')})))`;
 return {...result,actions,initial,goals,direct,parity:JSON.stringify(result.plan)===JSON.stringify(direct),required,support,domain,problem,types:DOMAIN_TYPES};
}
function packageWork(plan,kind='product'){const groups={};for(const id of plan||[]){const key=kind==='product'?(/A$/.test(id)?'Module A':/B$/.test(id)?'Module B':'Shared means'):(id==='setup'||id==='remove'?'Temporary access':id.startsWith('install')?'Installation':'Acceptance');(groups[key]||(groups[key]=[])).push(id);}return groups;}
function validateWork(nodes,edges){const ids=new Set(nodes.map(n=>n.id)),errors=[];const parent=edges.filter(e=>e.kind==='partOf');for(const e of edges)if(!ids.has(e.from)||!ids.has(e.to))errors.push('Dangling relation');
 for(const n of nodes){if(parent.filter(e=>e.from===n.id).length>1)errors.push('Multiple parents: '+n.id);const seen=new Set();let id=n.id;while(id){if(seen.has(id)){errors.push('partOf cycle: '+n.id);break;}seen.add(id);id=parent.find(e=>e.from===id)?.to;}}
 for(const n of nodes.filter(n=>n.kind==='leaf'))if(!edges.some(e=>e.from===n.id&&e.kind==='delivers'&&nodes.find(d=>d.id===e.to)?.kind==='deliverable'))errors.push('Missing leaf deliverable: '+n.id);return unique(errors);}
// 220: a two-regime, three-window belief-state decision problem; at most one survey.
function decisions(s,{prior=.5,accuracy=.85,evidenceCost=8,delay=1}={}){s=brief(s);const horizon=3,backup=165,airCost=70,unserved=300,good=.9,bad=.2,memo=new Map();
 const fly=p=>p*good+(1-p)*bad;
 const signal=p=>({prob:p*accuracy+(1-p)*(1-accuracy),yes:p*accuracy/(p*accuracy+(1-p)*(1-accuracy)||1),no:p*(1-accuracy)/(p*(1-accuracy)+(1-p)*accuracy||1)});
 function choices(t,p,surveyed=false){if(t>=horizon)return [{action:'Deadline missed',cost:unserved}];
 const options=[{action:'Do not deliver',cost:unserved}];
 if(s.permit&&s.capacity>0)options.push({action:'Use winch',cost:backup});
 if(s.air&&s.permit&&s.capacity>0){const q=fly(p),posterior=p*(1-good)/(1-q);options.push({action:'Commit air lift',cost:airCost+(1-q)*value(t+1,posterior,surveyed)});}
 options.push({action:'Wait',cost:value(t+1,p,surveyed)});
 if(!surveyed){const info=signal(p);options.push({action:'Buy evidence',cost:evidenceCost+info.prob*value(t+delay,info.yes,true)+(1-info.prob)*value(t+delay,info.no,true)});}return options;}
 function value(t,p,surveyed){const key=[t,p.toPrecision(14),surveyed].join('|');if(!memo.has(key))memo.set(key,Math.min(...choices(t,p,surveyed).map(x=>x.cost)));return memo.get(key);}
 function policy(t,p){if(t>=horizon)return unserved;if(!s.air||!s.permit||!s.capacity)return s.permit&&s.capacity?backup:unserved;const q=fly(p);return q>=.6||t===horizon-1?airCost+(1-q)*policy(t+1,p*(1-good)/(1-q)):policy(t+1,p);}
 const options=choices(0,prior),best=[...options].sort((a,b)=>a.cost-b.cost)[0],without=Math.min(...options.filter(x=>x.action!=='Buy evidence').map(x=>x.cost)),evidence=options.find(x=>x.action==='Buy evidence'),info=signal(prior);
 return {options,best,bestActions:options.filter(x=>Math.abs(x.cost-best.cost)<1e-9).map(x=>x.action),without,evidenceGain:without-evidence.cost,baseline:policy(0,prior),info,afterYes:choices(delay,info.yes,true).sort((a,b)=>a.cost-b.cost)[0],afterNo:choices(delay,info.no,true).sort((a,b)=>a.cost-b.cost)[0],prior,accuracy,delay,evidenceCost,states:memo.size,scope:'Expected £k over three abstract windows; fixed hidden weather regime, one survey, retries after observed failures.'};
}
const api={BASE,brief,projection,stateMoves,stateKey,dynamics,compatibility,jobs,orders,schedule,replay,plans,wiring,sharing,codesign,semanticActions,searchActions,directPDDL,parsePDDL,searchPDDL,semantics,packageWork,validateWork,decisions};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.GimmerModels=api;
})(typeof globalThis!=='undefined'?globalThis:this);
