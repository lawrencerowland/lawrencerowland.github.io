import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {enumerate,replay,DEFAULTS,initial,tick} from './oracle.mjs';
const require=createRequire(import.meta.url);
const E=require(process.argv[2] || './model.cjs');
const SHORT={'platform-up':'P','signal-up':'S','grid-direct':'GD','grid-prepare':'GP','grid-protected':'GC','temporary-install':'TI','temporary-return':'TR'};
const history=p=>p.path.map(s=>s.actions.map(a=>SHORT[typeof a==='string'?a:a.id]));
const key=r=>r.join(',');
const resources=p=>p.resources||[p.cost,p.finish,p.peakAccess];
const keys=ps=>[...new Set(ps.map(p=>key(resources(p))))].sort();
let checked=0,replayed=0,stageAnnotations=0,prefixes=0,terminalHistories=0;const rows=[];
function check(params){
 const q={...DEFAULTS,...params};const sol=E.solve(q,{includeAll:true});
 for(const endpoint of [false,true]){
  const oracle=enumerate(q,{endpoint});const engine=endpoint?sol.endpointFrontier:sol.stagedFrontier;
  assert.deepEqual(keys(engine),keys(oracle.frontier),`Front mismatch ${JSON.stringify({q,endpoint})}`);
  const completions=(endpoint?sol.endpointCompletions:sol.stagedCompletions)||engine;
  for(const p of [...engine,...completions]){
   const rr=replay(history(p),q,{endpoint});assert.ok(rr.valid,`Illegal returned history ${JSON.stringify({q,endpoint,p,rr})}`);
   assert.deepEqual(resources(p),rr.resources,'Wrong resource vector');assert.equal(p.accessTotal,rr.accessTotal,'Wrong accumulated access');
   assert.deepEqual(p.final,rr.state,'Wrong final interface state');
   assert.equal(p.minService,Math.min(...rr.stages.map(x=>x.service)),'Wrong minimum service');
   const checkpoint=q.milestoneSlot===0?null:rr.stages[Math.min(q.milestoneSlot,rr.stages.length)-1].state;
   assert.equal(p.milestoneService,checkpoint?1+Math.min(checkpoint.p,checkpoint.s,checkpoint.g):3,'Wrong commissioned service at checkpoint');
   for(let i=0;i<p.path.length;i++){const shown=p.path[i],actual=rr.stages[i];assert.deepEqual(shown.before,i?rr.stages[i-1].state:initial());assert.deepEqual(shown.after,actual.state);for(const field of ['service','cost','access','slot'])assert.equal(shown[field],actual[field],'Incorrect displayed stage '+field);assert.equal(shown.crews,shown.actions.length);stageAnnotations++;}
   replayed++;
  }
  prefixes+=oracle.visited;terminalHistories+=oracle.finished;
 }
 const endpointKeys=keys(sol.endpointFrontier),stagedKeys=keys(sol.stagedFrontier);
 assert.deepEqual(keys(sol.comparison.endpointResourceVectorsWithStagedWitness),endpointKeys.filter(k=>stagedKeys.includes(k)),'Wrong endpoint vector feasibility classification');
 assert.deepEqual(keys(sol.comparison.genuinelyLostStagedVectors),stagedKeys.filter(k=>!endpointKeys.includes(k)),'Wrong genuinely lost frontier classification');
 assert.deepEqual(keys(sol.comparison.endpointVectorsExcluded),endpointKeys.filter(k=>!stagedKeys.includes(k)),'Wrong excluded resource vectors');
 checked++;rows.push({params:q,staged:stagedKeys,endpoint:endpointKeys});
 return sol;
}
// Full crossed small-model sweep; horizon, cap, floor, milestone and options vary independently.
for(const horizon of [4,5,6])for(const crews of [1,2,3])for(const accessCap of [1,2,3])for(const serviceFloor of [0,1,2])for(const temporaryAvailable of [false,true])for(const milestoneSlot of [0,2,4]){
 check({horizon,crews,accessCap,serviceFloor,temporaryAvailable,milestoneSlot,milestoneService:2});
}
for(const horizon of [8,10,12])for(const temporaryAvailable of [false,true])for(const milestoneService of [1,2,3])check({horizon,temporaryAvailable,milestoneService});
const baseline=check({});
assert.deepEqual(keys(baseline.stagedFrontier),['24,5,2','26,4,2','26,6,1']);
assert.deepEqual(keys(baseline.endpointFrontier),['20,5,2','23,4,2','26,6,1']);
const filtered=baseline.endpointFrontier.filter(p=>replay(history(p),DEFAULTS).valid);
assert.deepEqual(keys(filtered),['26,6,1']);
assert.ok(!keys(filtered).includes('24,5,2')&&!keys(filtered).includes('26,4,2'));
const temporary=baseline.stagedFrontier.find(p=>p.cost===24);assert.ok(history(temporary).some(a=>a.includes('TI')));
const rearrangement=check({serviceFloor:0,milestoneSlot:3});
assert.ok(rearrangement.comparison.witnessOnlyRearrangements.some(x=>key(x.resources)==='20,5,2'),'Must recognize reordered same-resource witness');
assert.equal(rearrangement.comparison.genuinelyLostStagedVectors.length,0,'Witness failure must not be called a lost resource frontier');
const noTemp=check({temporaryAvailable:false});assert.ok(noTemp.stagedFrontier.every(p=>p.cost>=26));
// Monotone relaxations concern feasible histories and upper closures, not frontier set inclusion.
let relaxationHistories=0;
for(const p of [{horizon:6},{horizon:8,crews:1},{horizon:8,accessCap:1},{horizon:6,milestoneSlot:2},{horizon:6,temporaryAvailable:false}]){
 const q={...DEFAULTS,...p};const paths=enumerate(q).all;
 for(const weak of [ {...q,horizon:12}, {...q,crews:3}, {...q,accessCap:3}, {...q,serviceFloor:0}, {...q,milestoneSlot:0}, {...q,milestoneService:1}, {...q,temporaryAvailable:true} ]){
  const sol=E.solve(weak);for(const path of paths){assert.ok(replay(path.history,weak).valid);assert.ok(sol.stagedFrontier.some(r=>resources(r).every((v,i)=>v<=path.resources[i])),'Relaxation lost previously feasible resource budget');relaxationHistories++;}
 }
}
// Explicit action semantic witnesses, independent of normal frontier examples.
assert.equal(tick(initial(),['S','P'],DEFAULTS,1),null,'Simultaneous signal cannot enable platform');
assert.equal(tick(initial(),['TI','GD'],DEFAULTS,1),null,'Same slot install cannot power direct upgrade');
assert.equal(tick(initial(),['GP','GC'],DEFAULTS,1),null,'Preparation cannot support same-slot cutover');
assert.equal(tick(initial(),['GD'],DEFAULTS,1),null,'Unprotected direct upgrade violates service');
const malformed=[{horizon:3},{horizon:13},{serviceFloor:-1},{serviceFloor:4},{milestoneSlot:9,horizon:8},{crews:0},{accessCap:0},{temporaryAvailable:'yes'},{horizon:5.5},{unknown:1}];
for(const p of malformed)assert.throws(()=>E.normalize(p),`Must reject ${JSON.stringify(p)}`);
const report={status:'PASS',configurations:checked,independentPrefixes:prefixes,completedHistories:terminalHistories,returnedPlansReplayed:replayed,stageAnnotationsChecked:stageAnnotations,relaxationHistoryChecks:relaxationHistories,baselineFrontier:keys(baseline.stagedFrontier),endpointFrontier:keys(baseline.endpointFrontier),endpointWinnersSurvivingTemporalCheck:keys(filtered),temporaryWitness:temporary,rows};
writeFileSync(process.argv[3] || new URL('./results.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,rows:undefined,temporaryWitness:undefined},null,2));
