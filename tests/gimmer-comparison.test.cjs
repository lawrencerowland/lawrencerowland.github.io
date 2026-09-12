const assert=require('node:assert/strict');
const fs=require('node:fs');
const M=require('../gimmer-comparison/models.js');
let checks=0;function eq(a,b,msg){assert.deepEqual(a,b,msg);checks++;}function ok(x,msg){assert.ok(x,msg);checks++;}
const bool=[false,true];
// Projection must retain conditions and exhibit loss without inventing permission.
for(const air of bool)for(const permit of bool)for(const capacity of [0,1,2]){
 const s={air,permit,capacity},a=M.projection(s,false),b=M.projection(s,true);
 eq(a.plan,b.plan);eq(a.ready,air&&permit&&capacity>0);eq(b.ready,permit&&capacity>0);
 eq(a.facts.filter(f=>f.use==='retained').length,4);ok(!b.commitments.some(x=>x.text.includes('no conditions')));
 for(const method of ['air','winch']){
  const d=M.dynamics(s,method),can=permit&&capacity>0&&(air||method==='winch');
  eq(d.steps,can?6+Math.ceil(2/capacity):null,'Logical path lower bound');
  let state={rig:false,p:[0,0],removed:false};for(const name of d.path){const e=M.stateMoves(state,s,method).find(e=>e.name===name);ok(e,'Generated move is enabled');state=e.state;}if(can)ok(state.removed);
  for(const n of d.nodes)for(const e of M.stateMoves(n.state,s,method)){
   if(e.name.startsWith('Lift')||e.name.startsWith('Winch'))ok(e.state.p.filter((v,i)=>v===1&&n.state.p[i]===0).length<=capacity);
  }
  const p=M.plans(s,method);eq(p.traces.length,can?52:0);for(const sch of p.schedules)eq(M.replay(p.jobs,sch,capacity),[]);
 }
}
eq(M.stateMoves({rig:true,p:[1,3],removed:false},{},'air').some(x=>x.name==='Inspect A'),false);
eq(M.stateMoves({rig:true,p:[2,3],removed:false},{},'air').some(x=>x.name==='Inspect A'),true);
// Independently enumerate all 8! permutations and filter by declared prerequisites.
const js=M.jobs(),perms=[];function permutations(prefix,left){if(!left.length){const position=Object.fromEntries(prefix.map((x,i)=>[x,i]));if(js.every(j=>j.pre.every(p=>position[p]<position[j.id])))perms.push(prefix.join(','));return;}left.forEach((x,i)=>permutations([...prefix,x],left.filter((_,k)=>k!==i)));}permutations([],js.map(j=>j.id));
eq(M.orders(js).map(x=>x.join(',')).sort(),perms.sort());
eq(M.plans({capacity:1}).schedules.map(s=>s.end),[8,8]);eq(M.plans({capacity:2}).schedules.map(s=>s.end),[6]);
const sch=structuredClone(M.plans({}).schedules[0]);const a=sch.rows.find(x=>x.id==='liftA'),b=sch.rows.find(x=>x.id==='liftB');b.start=a.start;b.end=a.end;ok(M.replay(js,sch,1).includes('Capacity exceeded'));
sch.rows.find(x=>x.id==='inspectA').start=0;ok(M.replay(js,sch,1).includes('Precedence violated'));
// Brute-force assignments for each finite local-account preset.
for(const air of bool)for(const permit of bool)for(const preset of ['agree','conflict','pairwise','missing']){
 const r=M.compatibility({air,permit},preset),oracle=[];
 for(const month of ['Jul','Aug','Sep'])for(const method of ['air','winch'])if(r.views.every(v=>v.month.includes(month)&&v.method.includes(method)&&(!Object.hasOwn(v,'permit')||v.permit?.includes('cleared'))))oracle.push({month,method,permit:'cleared'});
 eq(r.assignments,oracle);
}
const trap=M.compatibility({},'pairwise');ok(trap.pairwise);eq(trap.assignments,[]);
// Interface and governance constraints cannot be repaired by changing an unrelated flag.
for(const capacity of [0,1,2])for(const accepted of bool)for(const parallel of bool){const w=M.wiring({capacity},{accepted,parallel});eq(w.ok,accepted&&capacity>=(parallel?2:1));}
eq(M.wiring({permit:false}).ok,false);eq(M.wiring({air:false}).ok,false);
for(const capacity of [0,1,2])for(const access of ['both','Aug','Sep']){
 const r=M.sharing({capacity},access);eq(r.options.length,capacity===0?0:access==='both'?(capacity===1?2:4):(capacity===1?0:1));
}
// Independent flat catalogue of full resource values, separate from composition code.
const flat=[['Single cassette / Air',490,12,2,200,true,'air'],['Single cassette / Winch',460,18,7,200,false,'winch'],['Split cassettes / Air',430,12,2,180,true,'air'],['Split cassettes / Winch',400,18,7,180,true,'winch'],['Light cassettes / Air',385,12,2,140,true,'air'],['Light cassettes / Winch',355,18,7,140,true,'winch']];
for(const air of bool)for(const permit of bool)for(const capacity of [0,1,2])for(const budget of [350,400,430,465,500])for(const temporary of bool){
 const r=M.codesign({air,permit,capacity,budget},temporary);const feasible=flat.filter(x=>x[1]<=budget&&x[4]>=160&&x[5]&&(x[6]!=='air'||air)&&permit&&capacity>0&&temporary);
 eq(r.items.filter(x=>x.feasible).map(x=>x.id),feasible.map(x=>x[0]));
 const tuples=feasible.map(x=>({id:x[0],cost:x[1],days:x[2]-(capacity===2&&x[0].startsWith('Split')?3:0),site:x[3]}));
 const frontier=tuples.filter(b=>!tuples.some(a=>a.cost<=b.cost&&a.days<=b.days&&a.site<=b.site&&(a.cost<b.cost||a.days<b.days||a.site<b.site)));
 eq(r.frontier.map(x=>x.id),frontier.map(x=>x.id));
}
// Goal-to-work routes, independent representation, complete action replay and omission.
for(const scope of [[],['A'],['A','B']])for(const method of ['air','winch'])for(const air of bool)for(const permit of bool)for(const capacity of [0,1,2]){
 const r=M.semantics({air,permit,capacity},scope,method),possible=!scope.length||(permit&&capacity>0&&(air||method==='winch'));
 eq(r.plan!==null,possible);ok(r.parity);eq(r.direct,r.plan);
 if(possible){let facts=new Set(r.initial);for(const id of r.plan){const a=r.actions.find(x=>x.id===id);ok(a.pre.every(p=>facts.has(p)));a.del.forEach(p=>facts.delete(p));a.add.forEach(p=>facts.add(p));}ok(r.goals.every(g=>facts.has(g)));eq(r.plan.length,scope.length?2+2*scope.length:0);eq(r.required.length,r.plan.length);for(const kind of ['product','process'])eq(Object.values(M.packageWork(r.plan,kind)).flat().sort(),[...r.plan].sort(),'Packaging conserves action identities');}
}
const cycle=[{id:'root',kind:'summary'},{id:'leaf',kind:'leaf'}],ed=[{from:'root',to:'leaf',kind:'partOf'},{from:'leaf',to:'root',kind:'partOf'}];ok(M.validateWork(cycle,ed).some(x=>x.includes('cycle')));ok(M.validateWork(cycle,ed).some(x=>x.includes('deliverable')));
// Enumerate all deterministic policy cost possibilities, taking the minimum only at the end.
function policyCosts(s,{prior,accuracy,evidenceCost,delay}){
 const memo=new Map();function recurse(t,p,used){if(t>=3)return [300];const key=[t,p,used].join(':');if(memo.has(key))return memo.get(key);let values=[300,...recurse(t+1,p,used)];
 if(s.permit&&s.capacity){values.push(165);if(s.air){const q=.9*p+.2*(1-p),post=.1*p/(1-q);for(const next of recurse(t+1,post,used))values.push(70+(1-q)*next);}}
 if(!used){const py=p*accuracy+(1-p)*(1-accuracy),yes=p*accuracy/py,no=p*(1-accuracy)/(1-py);for(const y of recurse(t+delay,yes,true))for(const n of recurse(t+delay,no,true))values.push(evidenceCost+py*y+(1-py)*n);}
 values=[...new Set(values.map(x=>Math.round(x*1e9)/1e9))];memo.set(key,values);return values;}return recurse(0,prior,false);
}
let policyCases=0;
for(const prior of [.1,.5,.9])for(const accuracy of [.5,.85,.98])for(const delay of [1,2,3])for(const evidenceCost of [0,8,80])for(const air of bool){const s={air,permit:true,capacity:1},options={prior,accuracy,delay,evidenceCost},r=M.decisions(s,options);const minimum=Math.min(...policyCosts(s,options));ok(Math.abs(r.best.cost-minimum)<1e-6,'Exact policy optimum');ok(r.best.cost<=r.baseline+1e-8);policyCases++;}
eq(M.decisions({}).best.action,'Buy evidence');ok(M.decisions({},{delay:3}).evidenceGain<0);ok(M.decisions({},{accuracy:.5}).evidenceGain<=0);eq(M.decisions({permit:false}).best.action,'Do not deliver');
// Public navigation and no private-source disclosures in the release files.
const html=fs.readFileSync('gimmer-comparison/index.html','utf8'),app=fs.readFileSync('gimmer-comparison/app.js','utf8'),guide=fs.readFileSync('gimmer-comparison/method.html','utf8');
for(const text of [html,app,guide])ok(!/x-devonthink|\/Users\/|0000 Vault|Shepherd Ben|Sir A\./.test(text));
for(const id of ['110','120','140','150','160','170','180','210','220'])ok(guide.includes('id="f'+id+'"'));
ok(html.includes('aria-label="Ways to reason"'));ok(app.includes('popstate'));ok(app.includes('aria-selected'));ok(fs.readFileSync('side-projects.md','utf8').includes('/gimmer-comparison/'));
if(process.argv[2]){const built=fs.readFileSync(process.argv[2]+'/gimmer-comparison/index.html','utf8');eq(built,html);ok(fs.readFileSync(process.argv[2]+'/side-projects.html','utf8').includes('href="/gimmer-comparison/"'));}
console.log(`PASS: ${checks} assertions; all nine models; ${policyCases} complete policy-enumeration comparisons; independent trace/assignment/catalogue checks; scope/PDDL parity; navigation contracts.`);
