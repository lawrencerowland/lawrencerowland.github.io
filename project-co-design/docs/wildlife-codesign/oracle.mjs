// Independent audit oracle: rebuild declared catalogues and flatten all triples.
// Does not import the production catalogue, join, witness, query or Pareto helpers.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const model=require('./model.cjs');
const root=new URL('.',import.meta.url);
const started=Date.now();
const counters={queries:0,witnessReplays:0,monotonicity:0,capBoundaryQueries:0,compositionComparisons:0};
const bs=[];
for(let a=0;a<=3;a++)for(let b=0;b<=3-a;b++)for(let c=0;c<=3-a-b;c++){
  const widths=[...Array(a).fill(30),...Array(b).fill(50),...Array(c).fill(70)];
  bs.push({id:'b-'+(widths.join('-')||'none'),widths,sites:a+b+c,capacity:45*a+75*b+105*c,capital:4225000*a+6255000*b+8306000*c,land:6000*a+10000*b+15000*c,annual:44900*a+65500*b+86600*c});
}
const fspec=[{id:'f-none',km:0,capital:0,land:0,annual:0}];
for(const km of [2,4,6])for(const durable of [false,true])fspec.push({id:`f-${durable?'durable':'standard'}-${km}`,km,capital:km*(durable?160000:100000),land:500*km,annual:km*(durable?1000:2000)});
const ms=[{id:'m-none',points:0,staffMilli:0,capital:0,land:0,annual:0}];
for(const points of [3,6,9])for(const assisted of [false,true])ms.push({id:`m-${assisted?'assisted':'field'}-${points}`,points,staffMilli:points*(assisted?40:100),capital:(assisted?120000:50000)+points*(assisted?45000:30000),land:0,annual:assisted?2000+3600*points:6300*points});
const all=[];let triples=0,bf=0,fm=0;
for(const b of bs)for(const f of fspec){if(2*b.sites<=f.km)bf++;}
for(const f of fspec)for(const m of ms){if(f.km/2<=m.points)fm++;}
for(const b of bs)for(const f of fspec)for(const m of ms){
  triples++;
  if(f.km<2*b.sites||m.points<2*b.sites+f.km/2)continue;
  all.push({id:[b.id,f.id,m.id].join('|'),parts:{bridge:b.id,fence:f.id,monitoring:m.id},widths:b.widths,sites:b.sites,exec:{capacity:b.capacity},interfaces:{fenceRequired:2*b.sites,fenceProvided:f.km,observationRequired:2*b.sites+f.km/2,observationProvided:m.points},resources:{capital:b.capital+f.capital+m.capital,land:b.land+f.land+m.land,annual:b.annual+f.annual+m.annual},staffMilli:m.staffMilli});
}
all.sort((a,b)=>a.id.localeCompare(b.id));
const ids=xs=>xs.map(x=>x.id).sort();
const sameWitness=(a,b)=>assert.deepEqual(a,b);
assert.equal(bs.length,20);assert.equal(triples,980);assert.equal(all.length,239);
for(const name of ['bridge-fence','fence-monitor']){
  const got=model.compose(name);assert.deepEqual(got.implementations,all);
  assert.equal(got.compatiblePairs,name==='bridge-fence'?bf:fm);counters.compositionComparisons++;
}
const le=(a,b)=>a.capital<=b.capital&&a.land<=b.land&&a.annual<=b.annual;
const strict=(a,b)=>le(a,b)&&(a.capital<b.capital||a.land<b.land||a.annual<b.annual);
const dominators=new Map(all.map(w=>[w.id,all.filter(x=>strict(x.resources,w.resources)).map(x=>x.id)]));
function oracle(p){
  const feasible=all.filter(w=>w.exec.capacity>=p.target&&w.sites<=p.maxSites&&(p.capitalLimit==null||w.resources.capital<=p.capitalLimit)&&(p.landLimit==null||w.resources.land<=p.landLimit));
  const active=new Set(ids(feasible));
  const min=feasible.filter(w=>!dominators.get(w.id).some(id=>active.has(id)));
  const groups=new Map();
  for(const w of min){const k=[w.resources.capital,w.resources.land,w.resources.annual].join(',');if(!groups.has(k))groups.set(k,[]);groups.get(k).push(w.id);}
  return {feasible,groups:[...groups].map(([vector,witnesses])=>({vector,witnesses:witnesses.sort()})).sort((a,b)=>a.vector.localeCompare(b.vector))};
}
function check(p){
  const expected=oracle(p),got=model.solve(p);counters.queries++;
  assert.deepEqual(ids(got.feasible),ids(expected.feasible),JSON.stringify(p));
  const groups=got.frontier.map(g=>({vector:[g.resources.capital,g.resources.land,g.resources.annual].join(','),witnesses:ids(g.implementations)})).sort((a,b)=>a.vector.localeCompare(b.vector));
  assert.deepEqual(groups,expected.groups,JSON.stringify(p));
  assert.equal(got.counts.feasibleImplementations,expected.feasible.length);
  assert.equal(got.counts.frontierVectors,expected.groups.length);
  assert.equal(got.maxCapacityAtAvailableSites,p.maxSites*105);
  return {got,expected};
}
// Full supported integer demand and site-availability domain, with uncapped,
// zero, tight and mixed caps; monetary/land quantities stay in base units.
const caps=[
  {capitalLimit:null,landLimit:null},{capitalLimit:0,landLimit:null},
  {capitalLimit:null,landLimit:0},{capitalLimit:11110000,landLimit:18000},
  {capitalLimit:11109999,landLimit:18000},{capitalLimit:12000000,landLimit:17999},
  {capitalLimit:20000000,landLimit:30000},{capitalLimit:1000000000,landLimit:1000000}
];
for(const cap of caps)for(let maxSites=0;maxSites<=3;maxSites++){
  let previous=null;
  for(let target=0;target<=330;target++){
    const {expected}=check({target,maxSites,...cap});const current=new Set(ids(expected.feasible));
    if(previous){for(const id of current)assert(previous.has(id));counters.monotonicity++;}
    previous=current;
  }
}
// Every distinct capital and land decision boundary, and one integer below it,
// at strategically different demands; then crossing paired caps at every witness.
for(const key of ['capital','land']){
  const vals=[...new Set(all.map(w=>w.resources[key]))].sort((a,b)=>a-b);
  for(const value of vals)for(const limit of [value,Math.max(0,value-1)])for(const target of [0,80,110,120,315]){
    const p={target,maxSites:3,capitalLimit:null,landLimit:null,[key+'Limit']:limit};
    check(p);counters.capBoundaryQueries++;
  }
  for(const target of [0,80,110,315]){
    let previous=new Set();
    for(const limit of vals){const now=new Set(ids(oracle({target,maxSites:3,capitalLimit:null,landLimit:null,[key+'Limit']:limit}).feasible));for(const id of previous)assert(now.has(id));previous=now;counters.monotonicity++;}
  }
}
for(const w of all)for(const dc of [0,-1])for(const dl of [0,-1]){
  check({target:w.exec.capacity,maxSites:w.sites,capitalLimit:Math.max(0,w.resources.capital+dc),landLimit:Math.max(0,w.resources.land+dl)});counters.capBoundaryQueries++;
}
// Independent replay from the actual IDs, plus invalid and query-failed receipts.
for(const w of all){const p={target:w.exec.capacity,maxSites:w.sites,capitalLimit:w.resources.capital,landLimit:w.resources.land};const r=model.replay(w.id,p);assert(r.valid);sameWitness(r.implementation,w);counters.witnessReplays++;}
assert.equal(model.replay('b-30|f-none|m-none').valid,false);
assert.equal(model.replay('b-fake|f-none|m-none').valid,false);
assert.equal(model.replay('b-30|f-standard-2|m-field-3',{target:46}).valid,false);
for(const p of [{target:-1},{target:331},{target:1.5},{maxSites:4},{capitalLimit:-1},{landLimit:1.5},{extra:2}])assert.throws(()=>model.solve(p));
const empty=check({target:0,maxSites:0,capitalLimit:0,landLimit:0}).got;
assert.equal(empty.frontier.length,1);assert.deepEqual(empty.frontier[0].resources,{capital:0,land:0,annual:0});assert.equal(empty.frontier[0].implementations.length,1);
assert.equal(check({target:316,maxSites:3,capitalLimit:null,landLimit:null}).got.frontier.length,0);
const q80=check({target:80,maxSites:3,capitalLimit:null,landLimit:null}).got;
const bridgeChoices=new Set(q80.frontier.flatMap(g=>g.implementations.map(i=>i.widths.join(','))));assert(bridgeChoices.has('70'));assert(bridgeChoices.has('30,30'));
const better=all.find(w=>w.id==='b-30-50|f-standard-4|m-field-6'),worse=all.find(w=>w.id==='b-50-50|f-standard-4|m-field-6');
assert(better.exec.capacity>=120);assert(strict(better.resources,worse.resources));
const q120=check({target:120,maxSites:3,capitalLimit:null,landLimit:null}).got;
assert(q120.frontier.every(g=>g.implementations.every(i=>i.widths.join(',')==='30,50')));
const sha=crypto.createHash('sha256').update(fs.readFileSync(new URL('model.cjs',root))).digest('hex');
const result={status:'PASS',checkedAtUTC:new Date().toISOString(),modelVersion:model.VERSION,modelSha256:sha,independence:'Oracle reconstructs the declared contract without importing production catalogues, join, witness, query or Pareto helpers. Production calls are only compared against independent results.',scope:'All331 supported integer targets ×4 site bounds ×8 cap profiles, plus every distinct capital/land boundary and one unit below at five demands, and paired cap boundaries at all239 complete witnesses. This is not every combination of arbitrary cap values.',catalogues:{bridges:bs.length,fences:fspec.length,monitoring:ms.length,cartesianTriples:triples,compatibleWitnesses:all.length,bridgeFencePairs:bf,fenceMonitoringPairs:fm},checks:counters,examples:{default:model.solve().frontier.map(g=>({resources:g.resources,witnesses:ids(g.implementations)})),q80Vectors:q80.frontier.length,q80BridgeChoices:[...bridgeChoices],q120Dominance:{retained:better,dominated:worse},beyondCatalogue:316,zero:empty.frontier[0]},elapsedMs:Date.now()-started};
fs.writeFileSync(new URL('results.json',root),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,queries:counters.queries,compatibleWitnesses:all.length,elapsedMs:result.elapsedMs,modelSha256:sha}));
