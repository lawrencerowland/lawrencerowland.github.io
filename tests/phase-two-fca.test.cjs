'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../tools/library-apps/node_modules/jsdom');
const folder=path.join(__dirname,'../library/apps/scenario-control-lattice');
const api=require(path.join(folder,'model.js'));
const key=a=>Array.from(a).sort().join('|');
function independent(context){
 const concepts=new Map();
 for(let bits=0;bits<2**context.attributes.length;bits++){
  const seed=context.attributes.filter((_,i)=>bits&(2**i));
  const extent=context.objects.filter(o=>seed.every(a=>(context.relation[o]||[]).includes(a)));
  const intent=context.attributes.filter(a=>extent.every(o=>(context.relation[o]||[]).includes(a)));
  concepts.set(key(intent),key(extent));
 }
 return concepts;
}
test('NextClosure agrees with exhaustive enumeration of all 1024 attribute subsets',()=>{
 const m=api.create(api.project),expected=independent(api.project);
 assert.equal(m.concepts.length,8);assert.equal(expected.size,8);
 assert.deepEqual(new Map(m.concepts.map(c=>[key(c.intent),key(c.extent)])),expected);
 const training=m.concepts.find(c=>c.extent.length===4);
 assert.deepEqual(training.extent,['risk-001','risk-002','risk-003','risk-004']);
 assert.deepEqual(training.intent,['control:competency_training_signoff','evidence:training_roster_Q1_2026']);
 assert.equal(new Set(training.extent.map(r=>key(api.project.relation[r]))).size,4,'shared intent does not mean identical full rows');
 const bottom=m.concepts.find(c=>!c.extent.length);assert.equal(bottom.intent.length,10);
 assert.deepEqual(m.gaps(),{noBarrier:['risk-005','risk-006'],empty:['risk-006']});
});
test('cover edges contain exactly strict extent inclusions with no intervening concept',()=>{
 const m=api.create(api.project),sup=(a,b)=>a.length>b.length&&b.every(x=>a.includes(x));
 const want=[];
 for(const a of m.concepts)for(const b of m.concepts)if(sup(a.extent,b.extent)&&!m.concepts.some(c=>sup(a.extent,c.extent)&&sup(c.extent,b.extent)))want.push(a.id+'>'+b.id);
 assert.deepEqual(m.edges.map(e=>e.source+'>'+e.target).sort(),want.sort());
 for(const r of m.objects){const c=m.concepts.find(c=>c.id===m.conceptForRisk(r));assert.ok(c.extent.includes(r));assert.equal(key(c.intent),key(api.project.relation[r]));}
 assert.equal(m.conceptForRisk('unknown'),null);
 const positions=m.hierarchyPositions();for(const e of m.edges)assert.ok(positions[e.target].y>positions[e.source].y,'every hierarchy arrow moves downward, including the empty extent');
});
test('closure laws and independent concepts hold for every binary 3 × 3 context',()=>{
 for(let bits=0;bits<512;bits++){
  const c={objects:['a','b','c'],attributes:['x','y','z'],relation:{}};
  c.objects.forEach((o,i)=>c.relation[o]=c.attributes.filter((_,j)=>bits&(1<<(i*3+j))));
  const m=api.create(c);assert.deepEqual(new Map(m.concepts.map(c=>[key(c.intent),key(c.extent)])),independent(c));
  for(let mask=0;mask<8;mask++){const b=new Set(c.attributes.filter((_,i)=>mask&(1<<i))),cl=m.closure(b);assert.ok([...b].every(a=>cl.has(a)));assert.equal(key(cl),key(m.closure(cl)));}
 }
 for(const c of [{objects:[],attributes:['x'],relation:{}},{objects:['a'],attributes:[],relation:{}},{objects:[],attributes:[],relation:{}}])assert.deepEqual(new Map(api.create(c).concepts.map(c=>[key(c.intent),key(c.extent)])),independent(c));
});
test('large concept spaces stop before expensive cover construction',()=>{
 const attributes=Array.from({length:9},(_,i)=>'a'+i),objects=Array.from({length:9},(_,i)=>'o'+i),relation=Object.fromEntries(objects.map((o,i)=>[o,attributes.filter((_,j)=>i!==j)]));
 assert.throws(()=>api.create({attributes,objects,relation}),/256 concepts/);
});
test('malformed contexts fail rather than produce misleading lattices',()=>{
 assert.throws(()=>api.create({...api.project,objects:['x','x']}),/distinct/);
 assert.throws(()=>api.create({...api.project,relation:{...api.project.relation,unknown:[]}}),/Unknown/);
 assert.throws(()=>api.create({...api.project,relation:{'risk-001':['fake']}}),/Invalid/);
 assert.throws(()=>api.create({objects:[],attributes:Array.from({length:13},(_,i)=>''+i),relation:{}}),/at most/);
});
function ui(){
 const dom=new JSDOM(fs.readFileSync(path.join(folder,'index.html'),'utf8'),{url:'https://example.org/library/apps/scenario-control-lattice/',runScripts:'outside-only',pretendToBeVisual:true});
 dom.window.eval(fs.readFileSync(path.join(folder,'model.js'),'utf8'));dom.window.eval(fs.readFileSync(path.join(folder,'app.js'),'utf8'));return dom;
}
test('renderer failure retains matrix, search, selection and gap reports',()=>{
 const dom=ui(),w=dom.window,d=w.document;
 assert.match(d.querySelector('#cy').textContent,/picture is unavailable/);assert.equal(d.querySelectorAll('#matrix tbody tr').length,6);
 const select=d.querySelector('#conceptSelect');assert.equal(select.options.length,9);select.value='c7';select.dispatchEvent(new w.Event('change'));
 assert.match(d.querySelector('#selectedPanel').textContent,/empty extent by convention/);
 d.querySelector('#riskSearch').value='forklift';d.querySelector('#btnSearch').click();assert.match(d.querySelector('#selectedPanel').textContent,/Forklift/);
 d.querySelector('#btnDimOthers').click();d.querySelector('#riskSearch').value='no-such-scenario';d.querySelector('#btnSearch').click();assert.equal(select.value,'');assert.match(d.querySelector('#canvasHint').textContent,/No scenario matches/);
 d.querySelector('#btnGaps').click();assert.equal(d.querySelector('#btnGaps').getAttribute('aria-pressed'),'true');assert.match(d.querySelector('#gapReport').textContent,/No recorded control \(2\)/);assert.match(d.querySelector('#gapReport').textContent,/No attributes recorded \(1\)/);assert.match(d.querySelector('#gapReport').textContent,/its other scenarios need not have a gap/);
 d.querySelector('#btnReset').click();assert.equal(d.querySelector('#riskSearch').value,'');assert.equal(d.querySelector('#btnGaps').getAttribute('aria-pressed'),'false');assert.equal(select.value,'');dom.window.close();
});
test('help opens with focus, traps Tab and restores the initiating control',()=>{
 const dom=ui(),w=dom.window,d=w.document,opener=d.querySelector('[data-open="modalWhat"]');opener.focus();opener.click();
 const m=d.querySelector('#modalWhat'),close=m.querySelector('[data-close]');assert.equal(d.activeElement,close);assert.equal(m.getAttribute('aria-hidden'),'false');assert.equal(d.querySelector('header').inert,true);
 close.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));assert.equal(d.activeElement,close);
 close.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(m.getAttribute('aria-hidden'),'true');assert.equal(d.activeElement,opener);assert.equal(d.querySelector('header').inert,false);dom.window.close();
});
