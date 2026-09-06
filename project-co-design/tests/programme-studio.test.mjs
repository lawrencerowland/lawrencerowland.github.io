// Independent Cartesian-product and arithmetic oracle for the declared finite studio.
// Run: node programme-studio.test.mjs [path-to-programme-studio.html]
import fs from 'node:fs';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const file=process.argv[2]||fileURLToPath(new URL('../apps/programme-studio.html',import.meta.url));
const html=fs.readFileSync(file,'utf8');
const code=html.slice(html.indexOf('  const clamp'),html.indexOf('  // END PURE STUDIO MODEL'));
const M=new Function(code+'\nreturn globalThis.ProgrammeStudioModel;')(),C=M.catalogues;
const stats={queries:0,oracleCandidates:0,resourceCoordinates:0,frontierComparisons:0,monotoneWitnesses:0,typedJoinChecks:0};
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<1e-8,`${label}: ${a} != ${b}`);
const keys=['capex','months','risk','possessions'];
// Deliberately no calls to production eligibility, transition, evaluation or Pareto helpers.
function requirements(sp,ctx){const signal=Math.max(sp.tph,sp.cars===8?18:sp.cars===10?21:24);return [sp.cars,signal,Math.max((sp.cars*signal*ctx.traction)/144,sp.cars===8?1:sp.cars===10?1.18:1.42)];}
function compatible(sp,p,s,w,ctx){const r=requirements(sp,ctx);return p.cars>=r[0]&&s.tph>=r[1]&&w.index>=r[2];}
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
 const packages=[p,s,w],req=requirements(sp,inputs.context),ev=times(packages,strat.type),bases=[8,18,1];
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
 const over=Math.max(0,p.cars/req[0]-1)+Math.max(0,s.tph/req[1]-1)+Math.max(0,w.index/req[2]-1);
 const capex=packages.reduce((n,x)=>n+x.capex,0)*inputs.context.costMult*g.costFactor+strat.costPremium+g.transactionCost+35*over;
 const possessions=packages.reduce((n,x)=>n+x.possessions,0)*inputs.context.possessionMult*g.possessionFactor*(strat.type==='matched'?.93:strat.type==='fasttrack'?.88:1);
 const base=finish*inputs.context.durMult,B=packages.reduce((n,x)=>n+x.risk,0)+inputs.context.riskOffset+g.riskOffset+strat.baseRisk+18*over;
 const q=area*g.mismatchFactor*({matched:.55,fasttrack:1,civilsFirst:1.25,systemsFirst:.95}[strat.type]);
 let months=base+q+.1*possessions,risk=B+.18*possessions+.30*q;
 if(inputs.feedback){
   let prior=0;
   for(let i=0;i<100;i++){
     months=base+q+.1*possessions+g.approvalAlpha*prior;
     risk=B+.42*(months-base)+.18*possessions+.30*q;
     if(Math.abs(risk-prior)<1e-11)break;prior=risk;
   }
 }
 return {capex,months,risk,possessions};
}
function oracle(inputs){
 const out=[];
 const within=r=>(inputs.budgetCap===0||r.capex<=inputs.budgetCap)&&(inputs.deadlineCap===0||r.months<=inputs.deadlineCap)&&(inputs.riskCap===0||r.risk<=inputs.riskCap);
 const baseSP={cars:8,tph:18};
 if(8*18*inputs.paxPerCar>=inputs.demand&&18<=inputs.maxTph&&compatible(baseSP,C.platformPkgs[0],C.signalPkgs[0],C.powerPkgs[0],inputs.context))out.push({id:'existing',res:{capex:0,months:0,risk:0,possessions:0}});
 // Explicit full Cartesian tuple checks, rather than the engine's prefiltered joins.
 for(const sp of C.servicePlans)for(const p of C.platformPkgs)for(const s of C.signalPkgs)for(const w of C.powerPkgs){
   if(sp.cars*sp.tph*inputs.paxPerCar<inputs.demand||sp.tph>inputs.maxTph)continue;
   if(!compatible(sp,p,s,w,inputs.context))continue;
   if(p.id==='P0'&&s.id==='S0'&&w.id==='W0')continue;
   for(const g of C.governances)for(const st of C.strategies){
     if(g.id==='all'||st.id==='all')continue;
     if(inputs.governance!=='all'&&inputs.governance!==g.id)continue;
     if(inputs.strategy!=='all'&&inputs.strategy!==st.id)continue;
     const res=resource(sp,p,s,w,g,st,inputs);
     if(within(res))out.push({id:[sp.cars,sp.tph,p.id,s.id,w.id,g.id,st.id].join('/'),res});
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
for(const context of ['urban','mixed','surface'])for(const params of [
 {},{demand:18000,paxPerCar:150},{demand:42000,paxPerCar:150},
 {governance:'multiprime',strategy:'civilsFirst'},
 {feedback:false,strategy:'matched'},{budgetCap:1500,deadlineCap:90,riskCap:150},
 {maxTph:21,demand:42000},{budgetCap:25},{riskCap:5,demand:18000,paxPerCar:150}
])check({...params,context});
const uncapped=check({context:'urban',governance:'multiprime',strategy:'civilsFirst'});
assert.equal(uncapped.all.length,6);assert.ok(uncapped.all.every(x=>Number.isFinite(x.res.months)&&x.res.months>180));
for(const governance of ['all','alliance','multiprime','stagedgov'])for(const strategy of ['all','matched','fasttrack','civilsFirst','systemsFirst']){
 const r=M.query({demand:18000,paxPerCar:150,context:'mixed',governance,strategy,budgetCap:25,deadlineCap:3,riskCap:5});
 assert.deepEqual(r.pareto.map(p=>p.id),['existing']);assert.deepEqual(r.pareto[0].res,{capex:0,months:0,risk:0,possessions:0});
}
assert.equal(M.query({demand:18000,paxPerCar:150,context:'urban'}).all.some(p=>p.kind==='existing'),false);
assert.equal(M.query({demand:22000,paxPerCar:150,context:'mixed'}).all.some(p=>p.kind==='existing'),false);
// Exhaustive typed-join equivalence at all catalogue triples, all service plans, all contexts.
for(const context of C.contexts)for(const sp of C.servicePlans)for(const p of C.platformPkgs)for(const s of C.signalPkgs)for(const w of C.powerPkgs){
 assert.equal(M.compatibility(sp,p,s,w,context).every(x=>x.met),compatible(sp,p,s,w,context));stats.typedJoinChecks++;
}
// Hold the implementation universe fixed: only demand varies, with resource witnesses unchanged.
for(const context of ['urban','mixed','surface']){
 const low=M.query({demand:18000,paxPerCar:150,context}),lookup=new Map(low.all.map(x=>[x.id,x]));
 for(const demand of [18500,22000,30000,42000])for(const p of M.query({demand,paxPerCar:150,context}).all){
   assert.ok(lookup.has(p.id));for(const k of keys)assert.equal(p.res[k],lookup.get(p.id).res[k]);stats.monotoneWitnesses++;
 }
}
// Feedback is finite beyond the former cutoffs; its defining equations hold.
const f=M.feedbackResources(400,600,200,100,.085,true);assert.ok(f.months>180&&f.risk>260);
near(f.months,400+200+10+.085*f.risk,'exact duration equation');
near(f.risk,600+.42*(f.months-400)+18+60,'exact risk equation');
assert.throws(()=>M.feedbackResources(10,20,1,1,3,true),/contraction/);
assert.throws(()=>M.query({demand:Infinity}),/range/);
console.log(JSON.stringify({status:'PASS',...stats,default:{feasible:M.query().all.length,pareto:M.query().pareto.length},previouslyFalseInfeasibility:{feasible:uncapped.all.length,pareto:uncapped.pareto.length}},null,2));
