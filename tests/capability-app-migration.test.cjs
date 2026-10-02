'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const P = require('../library/apps/project-data-standard/model.js');
const W = require('../library/apps/white-space-analysis/model.js');
const T = require('../library/apps/service-trident/model.js');
const read = route => fs.readFileSync(path.join(root, 'library/apps', route), 'utf8');
const opts = {now:'2025-10-16T08:10:00Z',slaDays:30,tolerance:0.02};
function payload() {
  const source=read('project-data-standard/index.html');
  const data=JSON.parse(source.match(/const SAMPLE = (\{[\s\S]*?\n    \});/)[1]);
  const p=data.project;
  p.baseline.cost.capex.amount=100;p.forecast.cost.capex.amount=90;p.actuals.cost.capex.amount=20;
  p.funding_lines=[{id:'F1',category:'CAPEX',budgeted:{amount:100,currency:'GBP'}}];
  return data;
}
const has = (result, rule) => result.violations.some(v=>v.rule===rule);

test('project checks permit early completion, forecast savings and ordinary spend-to-date',()=>{
  const data=payload();data.project.milestones[0].actual_date='2025-01-09';
  const result=P.validatePDS(data,opts);
  assert.deepEqual(result.violations,[]);
  assert.equal(result.scores.overall,100);
  assert.equal(result.funding.total,100);
  data.project.actuals.cost.capex.amount=95;
  assert.ok(has(P.validatePDS(data,opts),'SPEND-FORECAST'));
});

test('funding uses CAPEX only, handles zero baseline and honours exact zero tolerance',()=>{
  const data=payload();data.project.funding_lines.push({id:'O1',category:'OPEX',budgeted:{amount:900,currency:'EUR'}});
  assert.equal(P.validatePDS(data,opts).funding.total,100);
  data.project.funding_lines[0].budgeted.amount=101;
  assert.equal(P.validatePDS(data,opts).funding.within,true);
  assert.equal(P.validatePDS(data,{...opts,tolerance:0}).funding.within,false);
  data.project.baseline.cost.capex.amount=0;data.project.funding_lines[0].budgeted.amount=0;
  assert.deepEqual(P.validatePDS(data,opts).funding,{total:0,baseline:0,currency:'GBP',within:true,relativeGap:null});
  data.project.funding_lines[0].budgeted.amount=1;
  assert.equal(P.validatePDS(data,opts).funding.within,false);
  data.project.funding_lines[0].budgeted.currency='EUR';
  const result=P.validatePDS(data,opts);
  assert.equal(result.funding,null);assert.ok(has(result,'FUNDING-CURRENCY'));
});

test('actual funding renderer rejects missing currencies and malformed money before drawing comparisons',()=>{
  const source=read('project-data-standard/index.html');
  const draw=source.match(/    function drawFundingChart\([\s\S]*?\n    }\n\n/)[0];
  function render(project,funding=null){
    const bars=[],summary={textContent:''};
    const canvas={width:560,height:240,getContext:()=>({clearRect(){},fillRect(x,y,w,h){bars.push(h);},fillText(){}})};
    const context={$:id=>id==='#fundingChart'?canvas:summary,fmt:value=>Number.isFinite(value)?String(value):'—'};
    vm.createContext(context);vm.runInContext(draw,context);context.drawFundingChart(project,funding);
    return {bars,summary:summary.textContent};
  }
  const capex=(amount,currency)=>({cost:{capex:{amount,...(currency===undefined?{}:{currency})}}});
  for(const currency of [undefined,null,'gbp','GBP1',[],{}]){
    const result=render({baseline:capex(100,currency),forecast:capex(110,currency),actuals:capex(20,currency)});
    assert.ok(result.bars.every(height=>height===0),'invalid currency must not create positive bars');
    assert.equal((result.summary.match(/not comparable/g)||[]).length,4);
    assert.ok(!result.summary.includes('undefined'));
  }
  const valid={baseline:capex(100,'GBP'),forecast:capex(110,'GBP'),actuals:capex(20,'GBP')};
  assert.equal(render(valid).bars.filter(h=>h>0).length,3);
  assert.equal(render({...valid,forecast:capex(110,'EUR')}).bars.filter(h=>h>0).length,2);
  assert.equal(render({...valid,forecast:capex('110','GBP')}).bars.filter(h=>h>0).length,2);
  const fakeMoney=[];fakeMoney.amount=110;fakeMoney.currency='GBP';
  assert.equal(render({...valid,forecast:{cost:{capex:fakeMoney}}}).bars.filter(h=>h>0).length,2);
  assert.ok(render(valid,{total:100,currency:'EUR',within:true}).summary.includes('Budget comparison unavailable'));
  assert.equal(render(valid,{total:100,currency:'GBP',within:true}).bars.filter(h=>h>0).length,4);
});

test('malformed shapes and amounts produce findings rather than crashing or manufacturing comparisons',()=>{
  for(const value of [null,[],42,'x',{project:null},{project:[]},{project:{milestones:'x',funding_lines:[null,7],provenance:9,dates:[]}}]) {
    const result=P.validatePDS(value,opts);
    assert.ok(result.violations.length>0);
    assert.ok(Number.isFinite(result.scores.overall));
    assert.equal(result.funding,null);
  }
  for(const amount of [-1,NaN,Infinity,'100',null]) {
    const data=payload();data.project.baseline.cost.capex.amount=amount;
    const result=P.validatePDS(data,opts);assert.ok(has(result,'MONEY'));assert.equal(result.funding,null);
  }
  const data=payload();data.project.funding_lines=[{id:'A',category:'CAPEX',budgeted:{amount:Number.MAX_VALUE,currency:'GBP'}},{id:'B',category:'CAPEX',budgeted:{amount:Number.MAX_VALUE,currency:'GBP'}}];
  const result=P.validatePDS(data,opts);assert.ok(has(result,'FUNDING-TOTAL'));assert.equal(result.funding,null);
});

test('real calendar dates, UUID fields and codelists are validated explicitly',()=>{
  for(const date of ['2025-02-29','2024-02-30','2025-13-01','2025-01-01T24:00:00Z','2025-01-01T10:00:00','tomorrow','',null,10]) assert.equal(P.parseDate(date),null,String(date));
  for(const date of ['2024-02-29','2025-01-01','2025-01-01T10:30:00Z','2025-01-01T10:30:00+01:00']) assert.ok(P.parseDate(date),date);
  const data=payload();data.project.id='urn:pds:project:'+'-'.repeat(36);data.project.delivery_phase='Whatever';data.project.rag_overall='PURPLE';data.project.approvals[0].stage='Invented';data.project.dates.finish_planned='2023-01-01';
  const result=P.validatePDS(data,opts);
  for(const rule of ['PROJECT-ID','PHASE','RAG','APPROVAL','DATE-ORDER']) assert.ok(has(result,rule),rule);
});

test('provenance age, missing dates and duplicate identifiers cannot earn an unexplained pass',()=>{
  const data=payload();data.project.provenance.last_modified_at='2025-01-01';
  assert.ok(has(P.validatePDS(data,opts),'TIMELINESS-SLA'));
  data.project.provenance.last_modified_at='2027-01-01';assert.ok(has(P.validatePDS(data,opts),'TIMELINESS-FUTURE'));
  data.project.provenance.last_modified_at='bad';
  assert.equal(P.validatePDS(data,opts).scores.timeliness,0);
  data.project.funding_lines.push({...data.project.funding_lines[0]});data.project.milestones.push({name:'No ID',planned_date:'2025-01-01'});
  const result=P.validatePDS(data,opts);assert.ok(has(result,'DUPLICATE-ID'));assert.ok(has(result,'ITEM-ID'));
  for(const bad of [0,-1,NaN,Infinity,'30']) assert.throws(()=>P.validatePDS(payload(),{...opts,slaDays:bad}),/SLA/);
  for(const bad of [-1,NaN,Infinity,2,'0']) assert.throws(()=>P.validatePDS(payload(),{...opts,tolerance:bad}),/Tolerance/);
});

// Exhaustive enumeration over all 10,201 grid rectangles is independent of the
// production optimisation, which only visits thresholds beside occupied points.
function brute(points) {
  let area=0;
  for(let i=0;i<=100;i++)for(let j=0;j<=100;j++){
    const x=i/10,y=j/10;
    if(points.every(p=>p[0]<x || p[1]<y)) area=Math.max(area,(10-x)*(10-y));
  }
  return area;
}
function rows(points){return points.map((p,i)=>({firm:'F'+i,scores:{ot:p[0],gov:p[1],ip:5,ai:5,scale:5,comm:5}}));}
test('white-space areas match an independent full-grid oracle including boundaries',()=>{
  let seed=41;
  const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
  const cases=[[],[[10,10]],[[0,0]],[[10,0],[0,10]],[[5,5]],[[3.05,8.91],[7.01,4.99]],[[3.099999999999,8.5]],[[3.100000000001,8.5]]];
  for(let i=0;i<20;i++)cases.push(Array.from({length:5},()=>[Math.round(rnd()*100)/10,Math.round(rnd()*100)/10]));
  for(const points of cases){
    const result=W.largestEmptyTopRight(rows(points),'ot','gov');
    assert.ok(Math.abs(result.area-brute(points))<1e-8,JSON.stringify(points));
    if(result.empty) assert.ok(points.every(p=>p[0]<result.x0 || p[1]<result.y0));
  }
  const blocked=W.largestEmptyTopRight(rows([[10,10]]),'ot','gov');
  assert.equal(blocked.empty,false);assert.equal(W.inRegion(blocked,10,10),false);
});

test('automatic four-dimension choice maximises the independently enumerated pair areas',()=>{
  const keys=W.dimensions.map(d=>d.key),best=W.autoPick(W.example),totals=[];
  const pairAreas=new Map(W.pairs(keys).map(([x,y])=>[x+':'+y,brute(W.example.map(f=>[f.scores[x],f.scores[y]]))]));
  for(let a=0;a<6;a++)for(let b=a+1;b<6;b++)for(let c=b+1;c<6;c++)for(let d=c+1;d<6;d++){
    const pick=[keys[a],keys[b],keys[c],keys[d]];
    totals.push(W.pairs(pick).reduce((sum,[x,y])=>sum+pairAreas.get(x+':'+y),0));
  }
  assert.equal(best.pick.length,4);assert.ok(Math.abs(best.sumArea-Math.max(...totals))<1e-8);
});

test('white-space inputs reject invalid values and CSV quotes all descriptive cells',()=>{
  for(const value of ['', ' ', null, false, NaN, Infinity, -0.1, 10.1, {}, []]) assert.throws(()=>W.score(value));
  assert.equal(W.score('0'),0);assert.equal(W.score('10'),10);assert.equal(W.score(3.25),3.25);
  assert.throws(()=>W.largestEmptyTopRight(W.example,'ot','ot'));
  assert.throws(()=>W.largestEmptyTopRight([{scores:{ot:undefined,gov:3}}],'ot','gov'));
  assert.throws(()=>W.pairs(['ot','ot']));
  const data=structuredClone(W.example);data[0].firm='Firm "A", partner';
  const csv=W.csv(data);assert.ok(csv.includes('"Firm ""A"", partner"'));assert.equal(csv.split('\r\n').length,6);
});

test('Trident preserves every original mapping and makes changing need independent of level choices',()=>{
  assert.deepEqual(T.needs.map(need=>T.leadMap[need]),['Capability Planning','P3M3 Assessment','Programme Assurance & Recovery']);
  let state=T.chooseNeed(T.initial(),'Performance');state=T.recommend(state);
  assert.deepEqual(state.leverage,['Programme','Project']);
  state=T.chooseNeed(state,'Capability');assert.deepEqual(state.leverage,['Programme','Project']);
  state=T.recommend(state);assert.deepEqual(state.leverage,['Portfolio','Programme']);
  state=T.toggleLevel(state,'Project');assert.deepEqual(state.leverage,T.levels);
  state=T.toggleLevel(state,'Programme');assert.deepEqual(state.leverage,['Portfolio','Project']);
  assert.deepEqual(T.clear(state),{need:'Capability',leverage:[]});
  assert.ok(T.synopsis(state).includes('Suggested lead: Capability Planning'));
  assert.throws(()=>T.recommend(T.initial()),/Choose/);assert.throws(()=>T.chooseNeed(state,'Unknown'));
  assert.throws(()=>T.toggleLevel(state,'Unknown'));assert.throws(()=>T.synopsis({need:'Capability',leverage:['Project','Project']}));
});

test('clipboard unavailable, rejection, stalled permission and success have distinct outcomes',async()=>{
  assert.equal(await T.copyText('test',undefined),false);
  assert.equal(await T.copyText('test',{writeText:()=>Promise.reject(Error('denied'))}),false);
  assert.equal(await T.copyText('test',{writeText:()=>new Promise(()=>{})},10),false,'a pending permission request reaches manual fallback');
  let copied;assert.equal(await T.copyText('test',{writeText:async text=>{copied=text;}}),true);assert.equal(copied,'test');
});

test('all three Library pages load their local tested engine and retain useful explanations',()=>{
  for(const [app,theme] of [['project-data-standard','data-and-assurance'],['white-space-analysis','capabilities-and-futures'],['service-trident','capabilities-and-futures']]){
    const html=read(app+'/index.html');assert.ok(html.includes('/library/methods/'+theme+'.html'));assert.ok(html.includes('href="/library.html"'));
    assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.ok(html.includes('src="./model.js"'));assert.ok(html.includes('<noscript>'));
    assert.ok(!/localStorage\.(?:clear|removeItem)|https:\/\/cdn/.test(html),'no stored-data deletion or runtime CDN');
    for(const script of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]) new vm.Script(script[1]);
  }
});
