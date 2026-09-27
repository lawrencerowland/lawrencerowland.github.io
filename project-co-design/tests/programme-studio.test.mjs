// Independent Cartesian-product and arithmetic oracle for the declared finite studio.
// Run: node programme-studio.test.mjs [path-to-programme-studio.html]
import fs from 'node:fs';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const file=process.argv[2]||fileURLToPath(new URL('../apps/programme-studio.html',import.meta.url));
const html=fs.readFileSync(file,'utf8');
const code=html.slice(html.indexOf('  const clamp'),html.indexOf('  // END PURE STUDIO MODEL'));
const M=new Function(code+'\nreturn globalThis.ProgrammeStudioModel;')(),C=M.catalogues;
const stats={queries:0,oracleCandidates:0,resourceCoordinates:0,frontierComparisons:0,monotoneWitnesses:0,typedJoinChecks:0};
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<1e-8,`${label}: ${a} != ${b}`);
const keys=['capex','months','risk','accessDays'];
// Deliberately no calls to production eligibility, transition, evaluation or Pareto helpers.
function requirements(sp,ctx){
 // Independent table for the width-induced requirement, with integer station rounding.
 const widthRow={20:{fence:2,stations:4},30:{fence:3,stations:6},40:{fence:4,stations:8}}[sp.width];
 const fence=sp.catchment>widthRow.fence?sp.catchment:widthRow.fence;
 const unrounded=sp.width*fence*ctx.surveyLoad/10;
 const stationCount=Math.ceil(unrounded);
 return [sp.width,fence,stationCount>widthRow.stations?stationCount:widthRow.stations];
}
function compatible(sp,p,s,w,ctx){const r=requirements(sp,ctx);return p.width>=r[0]&&s.catchment>=r[1]&&w.stations>=r[2];}
function times(packages,type){
 const events=packages.map(p=>p.stages.map(s=>({duration:s.durFrac*p.dur,cap:s.cap,start:0})));
 if(type==='matched'){
   let clock=0;for(let i=0;i<Math.max(...events.map(x=>x.length));i++){for(const list of events)if(list[i])list[i].start=clock;clock+=Math.max(...events.map(list=>list[i]?.duration||0));}
 }else{
   const lengths=packages.map(p=>p.dur);const offsets=type==='civilsFirst'?[0,lengths[0],lengths[0]+lengths[1]]:type==='systemsFirst'?[Math.max(lengths[1],lengths[2]),0,0]:[0,0,0];
   events.forEach((list,j)=>{let clock=offsets[j];for(const e of list){e.start=clock;clock+=e.duration;}});
 }
 return events;
}
function resource(sp,p,s,w,g,strat,inputs){
 const packages=[p,s,w],req=requirements(sp,inputs.context),ev=times(packages,strat.type),bases=[20,2,4];
 const finish=Math.max(1,...ev.flat().map(e=>e.start+e.duration));let area=0;
 for(let k=1;k<=120;k++){
   const t=finish*k/120;
   const fractions=ev.map((list,j)=>{
     if(req[j]<=bases[j])return 1;
     let cap=bases[j],previous=bases[j];
     for(const e of list){cap+=(e.cap-previous)*(e.duration===0?1:Math.max(0,Math.min(1,(t-e.start)/e.duration)));previous=e.cap;}
     return Math.max(0,Math.min(1,(cap-bases[j])/(req[j]-bases[j])));
   });
   area+=(Math.max(...fractions)-Math.min(...fractions))*finish/120;
 }
 const over=Math.max(0,p.width/req[0]-1)+Math.max(0,s.catchment/req[1]-1)+Math.max(0,w.stations/req[2]-1);
 const capex=packages.reduce((n,x)=>n+x.capex,0)*inputs.context.costMult*g.costFactor+strat.costPremium+g.transactionCost+.35*over;
 const accessDays=packages.reduce((n,x)=>n+x.accessDays,0)*inputs.context.accessMult*g.accessFactor*(strat.type==='matched'?.93:strat.type==='fasttrack'?.88:1);
 const base=finish*inputs.context.durMult,B=packages.reduce((n,x)=>n+x.risk,0)+inputs.context.riskOffset+g.riskOffset+strat.baseRisk+18*over;
 const q=area*g.mismatchFactor*({matched:.55,fasttrack:1,civilsFirst:1.25,systemsFirst:.95}[strat.type]);
 let months=base+q+.1*accessDays,risk=B+.18*accessDays+.30*q;
 if(inputs.feedback){
   let prior=0;
   for(let i=0;i<1000;i++){
     months=base+q+.1*accessDays+g.approvalAlpha*prior;
     risk=B+.42*(months-base)+.18*accessDays+.30*q;
     if(Math.abs(risk-prior)<1e-11)break;prior=risk;
   }
 }
 return {capex,months,risk,accessDays};
}
function oracle(inputs){
 const out=[];
 const within=r=>(inputs.budgetCap===0||r.capex<=inputs.budgetCap)&&(inputs.deadlineCap===0||r.months<=inputs.deadlineCap)&&(inputs.riskCap===0||r.risk<=inputs.riskCap);
 const baseSP={width:20,catchment:2};
 if(20*2*inputs.scenarioFactor>=inputs.demand&&2<=inputs.maxCatchment&&compatible(baseSP,C.crossingPkgs[0],C.fencePkgs[0],C.monitoringPkgs[0],inputs.context))out.push({id:'existing',res:{capex:0,months:0,risk:0,accessDays:0}});
 // Explicit full Cartesian tuple checks, rather than the engine's prefiltered joins.
 for(const sp of C.habitatPlans)for(const p of C.crossingPkgs)for(const s of C.fencePkgs)for(const w of C.monitoringPkgs){
   if(sp.width*sp.catchment*inputs.scenarioFactor<inputs.demand||sp.catchment>inputs.maxCatchment)continue;
   if(!compatible(sp,p,s,w,inputs.context))continue;
   if(p.id==='C0'&&s.id==='F0'&&w.id==='M0')continue;
   for(const g of C.governances)for(const st of C.strategies){
     if(g.id==='all'||st.id==='all')continue;
     if(inputs.governance!=='all'&&inputs.governance!==g.id)continue;
     if(inputs.strategy!=='all'&&inputs.strategy!==st.id)continue;
     const res=resource(sp,p,s,w,g,st,inputs);
     if(within(res))out.push({id:[sp.width,sp.catchment,p.id,s.id,w.id,g.id,st.id].join('/'),res});
   }
 }
 return out;
}
function frontier(list){return list.filter(a=>!list.some(b=>keys.every(k=>b.res[k]<=a.res[k]+1e-8)&&keys.some(k=>b.res[k]<a.res[k]-1e-8)));}
function check(params){
 const got=M.query(params),want=oracle(got.inputs);stats.queries++;stats.oracleCandidates+=want.length;
 assert.equal(got.complete,true);assert.equal(got.diagnostics.calculationFailures.length,0);
 assert.deepEqual(got.all.map(p=>p.id).sort(),want.map(p=>p.id).sort());
 const lookup=new Map(want.map(x=>[x.id,x]));
 for(const p of got.all){for(const k of keys){near(p.res[k],lookup.get(p.id).res[k],p.id+'/'+k);stats.resourceCoordinates++;}assert.ok(p.compatibility.every(j=>j.met));}
 const expected=frontier(want);stats.frontierComparisons++;
 assert.deepEqual(got.pareto.map(x=>x.id).sort(),expected.map(x=>x.id).sort());return got;
}
for(const context of ['woodland','mixed','open'])for(const params of [
 {},{demand:80,scenarioFactor:2},{demand:480,scenarioFactor:2},
 {governance:'multiprime',strategy:'civilsFirst'},
 {feedback:false,strategy:'matched'},{budgetCap:6,deadlineCap:60,riskCap:150},
 {maxCatchment:2,demand:480},{budgetCap:.25},{riskCap:5,demand:80,scenarioFactor:2}
])check({...params,context});
const uncapped=check({context:'woodland',governance:'multiprime',strategy:'civilsFirst'});
assert.ok(uncapped.all.length>0);assert.ok(uncapped.all.every(x=>Number.isFinite(x.res.months)));
for(const governance of ['all','alliance','multiprime','stagedgov'])for(const strategy of ['all','matched','fasttrack','civilsFirst','systemsFirst']){
 const r=M.query({demand:80,scenarioFactor:2,context:'mixed',governance,strategy,budgetCap:.25,deadlineCap:3,riskCap:5});
 assert.deepEqual(r.pareto.map(p=>p.id),['existing']);assert.deepEqual(r.pareto[0].res,{capex:0,months:0,risk:0,accessDays:0});
}
assert.equal(M.query({demand:80,scenarioFactor:2,context:'woodland'}).all.some(p=>p.kind==='existing'),false);
assert.equal(M.query({demand:90,scenarioFactor:2,context:'mixed'}).all.some(p=>p.kind==='existing'),false);
// Independently stated wildlife anchors: a width-induced co-move and baseline context boundary.
const mixed=C.contexts.find(c=>c.id==='mixed'),woods=C.contexts.find(c=>c.id==='woodland');
const hand=M.compatibility({width:30,catchment:2},C.crossingPkgs[1],C.fencePkgs[1],C.monitoringPkgs[1],mixed);
assert.deepEqual(hand.map(j=>[j.required,j.provided,j.met]),[[30,30,true],[3,3,true],[9,8,false]]);
assert.equal(M.compatibility({width:20,catchment:2},C.crossingPkgs[0],C.fencePkgs[0],C.monitoringPkgs[0],woods)[2].required,5);
assert.equal(M.query({demand:80}).pareto[0].habitatPlan.modelCrossings,80);
assert.equal(M.query({demand:80}).pareto[0].clock.total,0);
// Raising monitoring capacity is never allowed to inflate the declared animal capability proxy.
for(const x of M.query().all)assert.equal(x.habitatPlan.modelCrossings,x.habitatPlan.width*x.habitatPlan.catchment*2);
// Exhaustive typed-join equivalence at all catalogue triples, all service plans, all contexts.
for(const context of C.contexts)for(const sp of C.habitatPlans)for(const p of C.crossingPkgs)for(const s of C.fencePkgs)for(const w of C.monitoringPkgs){
 assert.equal(M.compatibility(sp,p,s,w,context).every(x=>x.met),compatible(sp,p,s,w,context));stats.typedJoinChecks++;
}
// Hold the implementation universe fixed: only demand varies, with resource witnesses unchanged.
for(const context of ['woodland','mixed','open']){
 const low=M.query({demand:80,scenarioFactor:2,context}),lookup=new Map(low.all.map(x=>[x.id,x]));
 for(const demand of [90,160,300,480])for(const p of M.query({demand,scenarioFactor:2,context}).all){
   assert.ok(lookup.has(p.id));for(const k of keys)assert.equal(p.res[k],lookup.get(p.id).res[k]);stats.monotoneWitnesses++;
 }
}
// Feedback is finite beyond the former cutoffs; its defining equations hold.
const f=M.feedbackResources(400,600,200,100,.085,true);assert.ok(f.months>180&&f.risk>260);
near(f.months,400+200+10+.085*f.risk,'exact duration equation');
near(f.risk,600+.42*(f.months-400)+18+60,'exact risk equation');
assert.throws(()=>M.feedbackResources(10,20,1,1,3,true),/contraction/);
const arrangement=C.governances.find(g=>g.id==='multiprime'),savedAlpha=arrangement.approvalAlpha;
try{arrangement.approvalAlpha=3;const failed=M.query({governance:'multiprime'});assert.equal(failed.complete,false);assert.ok(failed.diagnostics.calculationFailures.length>0);assert.equal(failed.all.length,0);}finally{arrangement.approvalAlpha=savedAlpha;}
// A high finite sensitivity is an explicit evaluator stress fixture, outside the supplied arrangements.
try{arrangement.approvalAlpha=2;const large=check({context:'woodland',governance:'multiprime',strategy:'civilsFirst'});assert.ok(large.all.some(p=>p.res.months>180&&p.res.risk>260));}finally{arrangement.approvalAlpha=savedAlpha;}
const damaged=C.crossingPkgs[1],savedCost=damaged.capex;
try{damaged.capex=Infinity;const partial=M.query();assert.equal(partial.complete,false);assert.ok(partial.diagnostics.calculationFailures.length>0);assert.ok(partial.all.length>0);}finally{damaged.capex=savedCost;}
assert.throws(()=>M.query({demand:Infinity}),/range/);
console.log(JSON.stringify({status:'PASS',...stats,default:{feasible:M.query().all.length,pareto:M.query().pareto.length},uncappedCrossingFirst:{feasible:uncapped.all.length,pareto:uncapped.pareto.length}},null,2));
