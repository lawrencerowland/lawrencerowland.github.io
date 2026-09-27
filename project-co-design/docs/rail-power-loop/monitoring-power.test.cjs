/* No browser automation: execute the page's unchanged script with an inert DOM.
   Checks data, projections, persistence and exact ceilings. Layout and real input
   journeys require a separate browser review. Run from any working directory. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const docs=__dirname,apps=path.resolve(docs,'../../apps');
const html=fs.readFileSync(path.join(apps,'monitoring-power-loop.html'),'utf8');
const raw=fs.readFileSync(path.join(docs,'atlas.json'),'utf8');
const inline=html.match(/<script id="mcdp-atlas" type="application\/json">([\s\S]*?)<\/script>/)[1];
assert.equal(inline.trim(),raw.trim(),'Inline atlas must be the freshly generated raw atlas');
const atlas=JSON.parse(raw),contract=JSON.parse(fs.readFileSync(path.join(docs,'contract.json'),'utf8'));
assert.equal(atlas.schemaVersion,'monitoring-power-loop-1');
assert.deepEqual(atlas.unitContract,{power:'W',energy:'Wh',duration:'hours',capital:'GBP',cabinetVolume:'L'});
assert.deepEqual(atlas.default,{powerW:750,durationHours:8,condition:'hot'});
assert.equal(atlas.provenance.commit,'97d6446abf48c3424cf52bace9c5d9c40bfda978');
for(const [file,key] of [['model.py','modelSha256'],['contract.json','contractSha256'],['build_atlas.py','generatorSha256']])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(docs,file))).digest('hex'),atlas.provenance[key],file+' provenance');
for(const key of ['physicalAssumptions','scenarioMapping','unitContract'])assert.deepEqual(atlas[key],contract[key]);
assert.equal(atlas.queries.length,98);assert.equal(atlas.summary.calculations,784);
assert.equal(atlas.summary.converged,784);assert.equal(atlas.summary.catalogueFeasible,726);assert.equal(atlas.summary.catalogueInfeasible,58);
assert.equal(atlas.summary.emptyQueryFrontiers,3);
assert.equal(atlas.catalogues.batteries[0].usableWh,1000);assert.equal(atlas.catalogues.batteries[0].capitalGBP,320);assert.equal(atlas.catalogues.batteries[0].volumeL,28);
const historical=fs.readFileSync(path.join(apps,'rail-power-loop.html'),'utf8');
assert(!/<script\b|http-equiv\s*=\s*["']?refresh/i.test(historical),'Old railway route must never execute or redirect');
assert(historical.includes('href="monitoring-power-loop.html"'),'Migration enters the unparameterised default');
assert(historical.includes('aa8047d9315d0dce9c9ea08b077531573a617207'),'Historical evidence is immutable');
assert(!/monitoring-power-loop\.html\?/.test(historical),'Never forward a saved railway query');
const source=Array.from(html.matchAll(/<script>([\s\S]*?)<\/script>/g)).at(-1)[1];
new vm.Script(source);
const plain=x=>JSON.parse(JSON.stringify(x));
function boot(search=''){
  const elements=new Map(),windowEvents={};
  function el(id){if(!elements.has(id))elements.set(id,{value:'',textContent:'',innerHTML:'',hidden:false,dataset:{},attributes:{},events:{},addEventListener(type,fn){this.events[type]=fn;},setAttribute(k,v){this.attributes[k]=v;},getAttribute(k){return this.attributes[k];},removeAttribute(k){delete this.attributes[k];},querySelectorAll(){return[];},focus(){},select(){}});return elements.get(id);}
  for(const match of html.matchAll(/\bid="([^"]+)"/g))el(match[1]);
  el('power').value='750';el('duration').value='8';el('climate').value='hot';el('mcdp-atlas').textContent=inline;
  const ctx={document:{getElementById:el,querySelectorAll(){return[];},addEventListener(){},hidden:false},window:{addEventListener(type,fn){windowEvents[type]=fn;}},location:new URL('https://example.invalid/project-co-design/apps/monitoring-power-loop.html'+search),URL,URLSearchParams,Intl,BigInt,console:{error(...args){throw Error(args.join(' '));}},setInterval(){return 1;},clearInterval(){},setTimeout(){}};
  ctx.history={replaceState(a,b,url){ctx.location=new URL(url);}};
  vm.runInNewContext(source,ctx);
  return {el,ctx,snapshot:()=>plain(ctx.window.MonitoringPowerUI.getSnapshot()),apply(p=750,h=8,c='hot',capital='',volume=''){el('power').value=String(p);el('duration').value=String(h);el('climate').value=c;el('capexCap').value=capital;el('areaCap').value=volume;el('brief-form').events.submit({preventDefault(){}});return this.snapshot();}};
}
const ui=boot();let s=ui.snapshot();assert(s.ready);
assert.equal(s.selectedArchitectureId,'standard-efficient-liquid');
assert.deepEqual(s.record.selected.witness.counts,{batteries:8,converters:4,coolers:3});
assert.deepEqual(s.record.selected.witness.resources,{capitalGBP:3245,volumeL:274});
assert.equal(ui.el('metric-capital').textContent,'£3,245');assert.equal(ui.el('metric-volume').textContent,'274 L');assert.equal(ui.el('metric-overhead').textContent,'36 W');
assert.equal(s.record.selected.witness.values.energyWh,6400);
assert.equal(s.record.selected.witness.checks[0].required,6288);
assert.equal(s.record.format,'monitoring-power-loop-comparison-1');
assert.deepEqual(s.record.unitContract,atlas.unitContract);
assert.equal(ui.el('ranking-insight').hidden,false);
for(const amount of ['£2,965','£3,390','£3,130','£3,245','£145'])assert(ui.el('ranking-insight').innerHTML.includes(amount),'Ranking reversal '+amount);
assert(ui.el('ranking-insight').innerHTML.includes('Cheaper parts can cost more as a complete system'));
assert(ui.el('compound').innerHTML.includes('cameras, sensors, data link'));
assert(ui.el('compound').innerHTML.includes('8 battery packs, 4 converters and 3 coolers'));
assert(!/railway|sleepers|kW|m²/.test(ui.el('compound').innerHTML));
assert.equal(ui.ctx.location.searchParams.get('powerW'),'750');assert.equal(ui.ctx.location.searchParams.get('power'),null);
for(const q of atlas.queries){
 s=ui.apply(q.powerW,q.durationHours,q.condition);
 assert.equal(s.queryId,q.id);assert.deepEqual([...s.frontierArchitectureIds].sort(),[...q.frontier].sort(),q.id+' frontier');assert.deepEqual(s.record.allFamilyResults,q.results,q.id+' exact family records');
 if(q.powerW===0){assert.equal(ui.el('frontier-count').textContent,'1 no-equipment result');assert.equal(s.frontierArchitectureIds.length,8);assert.deepEqual(s.record.selected.witness.resources,{capitalGBP:0,volumeL:0});}
 if(!q.frontier.length){assert.equal(ui.el('empty-state').hidden,false);assert.equal(ui.el('empty-kicker').textContent,'CALCULATION COMPLETE · INVENTORY EXCEEDED');}
}
s=ui.apply(750,8,'hot','3245','274');assert.deepEqual(s.frontierArchitectureIds,['standard-efficient-liquid']);
for(const ceiling of ['3244.99','3244.999999999999999999999999999999']){s=ui.apply(750,8,'hot',ceiling,'274');assert.deepEqual(s.frontierArchitectureIds,[]);assert.equal(s.record.ceilings.capitalGBP,ceiling);const reloaded=boot(ui.ctx.location.search);assert.deepEqual(reloaded.snapshot().record,s.record,'Exact ceiling survives link reload');}
s=ui.apply(750,8,'hot','3245','273.999999999999999999');assert.deepEqual(s.frontierArchitectureIds,[]);
s=ui.apply(750,8,'hot','4300','200');assert.deepEqual(s.frontierArchitectureIds,['compact-standard-liquid']);
s=ui.apply(750,8,'hot','4500','160');assert.deepEqual(s.frontierArchitectureIds,['compact-efficient-liquid']);
assert.equal(ui.ctx.location.searchParams.get('volume'),'160');assert.equal(ui.ctx.location.searchParams.get('land'),null);
const valid=s,validURL=ui.ctx.location.href;
for(const invalid of ['-1','NaN','1e9','£500','3,500','Infinity']){ui.apply(750,8,'hot',invalid,'160');assert.equal(ui.el('input-error').hidden,false);assert.deepEqual(ui.snapshot(),valid,'Invalid ceiling must preserve applied result');assert.equal(ui.ctx.location.href,validURL);}
s=ui.apply(0,8,'hot','0','0');assert.deepEqual(s.record.selected.witness.resources,{capitalGBP:0,volumeL:0});
s=ui.apply(750,8,'hot','0','');assert.deepEqual(s.frontierArchitectureIds,[]);
for(const search of ['?powerW=','?powerW=%20','?powerW=999&hours=3&condition=unknown']){const bad=boot(search);assert.equal(bad.snapshot().queryId,'p750-h8-hot');assert(bad.el('status').textContent.includes('unsupported'));}
assert.equal(boot('?powerW=0').snapshot().brief.powerW,0);
const selected=boot('?powerW=750&hours=8&condition=hot&design=standard-standard-air');assert.equal(selected.snapshot().selectedArchitectureId,'standard-standard-air');assert.deepEqual(selected.snapshot().record.selected.witness.resources,{capitalGBP:3390,volumeL:384});assert(selected.el('result-kicker').textContent.includes('DOMINATED'));
console.log('PASS: monitoring schema and provenance, static migration isolation, all 98 UI data projections, ranking reversal, W/Wh/GBP/L record and exact decimal ceiling persistence. Inert DOM; no browser-layout claim.');
