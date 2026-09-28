/* Run: node export.test.cjs. Executes the app's download handler, without a browser. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const K=require('./model.cjs');
const source=fs.readFileSync(path.join(__dirname,'../../apps/wildlife-crossing.html'),'utf8');
const handlers=source.split('\n').filter(line=>line.startsWith("$('export').addEventListener('click',"));
assert.equal(handlers.length,1,'one production export handler');
const plain=x=>JSON.parse(JSON.stringify(x));

async function download(request,pick=0){
  const solved=K.solve(request),chosen=solved.frontier[pick]?.implementations[0]||null;
  let click,blob,downloaded=false,revoked=false;
  const status={textContent:''};
  const anchor={click(){downloaded=true;}};
  vm.runInNewContext(handlers[0],{K,solved,chosen:()=>chosen,Blob,
    $:id=>{if(id==='export')return{addEventListener(type,fn){assert.equal(type,'click');click=fn;}};assert.equal(id,'download-status');return status;},
    document:{createElement(tag){assert.equal(tag,'a');return anchor;}},
    URL:{createObjectURL(value){blob=value;return'blob:comparison';},revokeObjectURL(value){assert.equal(value,'blob:comparison');revoked=true;}},
    setTimeout(fn){fn();}
  });
  click();
  assert.ok(downloaded&&revoked);assert.equal(anchor.download,'wildlife-codesign-comparison.json');
  assert.equal(blob.type,'application/json');assert.match(status.textContent,/download requested/);
  const receipt=JSON.parse(await blob.text());
  assert.deepEqual(receipt.catalogues,plain(K.CATALOGUES));
  assert.deepEqual(Object.fromEntries(Object.entries(receipt.catalogues).map(([k,v])=>[k,v.length])),{baseBridges:3,bridges:20,fences:7,monitoring:7});
  assert.deepEqual(receipt.selectedImplementation,plain(chosen));
  assert.deepEqual(receipt.request,plain(solved.params));
  assert.equal(receipt.model,'wildlife-dpi-1');assert.equal(receipt.units.capital,'GBP');
  return receipt;
}

// Replay uses only the parsed record, not model.replay/solve or production helpers.
function replay(receipt,w){
  const c=receipt.catalogues,p=receipt.request;
  const b=c.bridges.find(x=>x.id===w.parts.bridge),f=c.fences.find(x=>x.id===w.parts.fence),m=c.monitoring.find(x=>x.id===w.parts.monitoring);
  assert.ok(b&&f&&m,'every witness part resolves in the saved catalogue');
  const parts=b.widths.map(width=>c.baseBridges.find(x=>x.width===width));
  assert.ok(parts.every(Boolean));assert.equal(b.count,parts.length);
  const sum=(items,key)=>items.reduce((n,x)=>n+x.resources[key],0);
  const capacity=parts.reduce((n,x)=>n+x.capacity,0);
  assert.equal(b.capacity,capacity);assert.equal(b.fenceNeedKm,2*parts.length);assert.equal(b.observationNeed,2*parts.length);
  for(const key of ['capital','land','annual'])assert.equal(b.resources[key],sum(parts,key));
  assert.equal(m.resources.annual,m.annualEquipment+m.annualStaff);assert.equal(m.annualStaff,55*m.staffMilli);
  const resources=Object.fromEntries(['capital','land','annual'].map(key=>[key,sum([b,f,m],key)]));
  const rebuilt={id:[b.id,f.id,m.id].join('|'),parts:{bridge:b.id,fence:f.id,monitoring:m.id},widths:b.widths,sites:b.count,
    exec:{capacity},interfaces:{fenceRequired:b.fenceNeedKm,fenceProvided:f.km,observationRequired:b.observationNeed+f.observationNeed,observationProvided:m.points},resources,staffMilli:m.staffMilli};
  assert.deepEqual(w,rebuilt);
  assert.ok(b.fenceNeedKm<=f.km&&b.observationNeed+f.observationNeed<=m.points);
  assert.ok(capacity>=p.target&&b.count<=p.maxSites);
  assert.ok(p.capitalLimit===null||resources.capital<=p.capitalLimit);
  assert.ok(p.landLimit===null||resources.land<=p.landLimit);
}

(async()=>{
  const cases=[{name:'mixed pair',request:{}},{name:'land-constrained assisted review',request:{target:80,landLimit:14000},pick:2},{name:'zero work',request:{target:0}},{name:'infeasible',request:{target:330}}];
  let witnesses=0;
  for(const test of cases){
    const r=await download(test.request,test.pick);
    if(r.selectedImplementation){replay(r,r.selectedImplementation);assert.equal(r.replay.valid,true);assert.deepEqual(r.replay.implementation,r.selectedImplementation);}
    else{assert.equal(r.replay,null);assert.deepEqual(r.frontier,[]);}
    for(const group of r.frontier)for(const w of group.implementations){replay(r,w);assert.deepEqual(group.resources,w.resources);witnesses++;}
    if(test.name==='mixed pair')assert.deepEqual(r.selectedImplementation.widths,[30,50]);
    if(test.pick===2)assert.equal(r.selectedImplementation.parts.monitoring,'m-assisted-6');
    if(test.name==='zero work')assert.deepEqual(r.selectedImplementation.resources,{capital:0,land:0,annual:0});
  }
  console.log(`PASS: production export handler; ${cases.length} records; ${witnesses} frontier witnesses replayed from saved catalogues. No browser or result ledger was written.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
