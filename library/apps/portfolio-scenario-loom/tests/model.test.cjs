const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const M=require('../model.js'),D=require('../data.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} differs from ${b}`);
const fibre=(id,effects={},extra={})=>({id,name:id,type:'market',start:'2026-01-01',end:'2026-03-01',confidence:1,weight:1,effects:{cost:0,schedule:0,quality:0,supply:0,regulatory:0,talent:0,...effects},second:[],tags:[],...extra});
const state=items=>M.validate({library:items,selected:items.map(f=>f.id),weights:{},milestones:[{id:'m',label:'Decision',date:'2026-02-01'}],startDate:'2026-01-01',horizon:6,risk:.5});
test('retains every authored scenario, effect, lag, prompt, selection and milestone offset from the pinned source',()=>{
  const retained={library:D.seed.library,selected:D.seed.selected,milestones:D.seed.milestones,rules:D.rules};
  // Independently extracted by executing the pinned original's seedLibrary/loadState in UTC.
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(retained)).digest('hex'),'ce5f632f17d7d9ad5ad6c6d62893cd0ed812e16366a7acf644593b79b85d1c41');
  assert.equal(D.seed.library.length,12);assert.equal(D.rules.length,12);assert.equal(D.seed.library.reduce((n,f)=>n+f.second.length,0),3);
  assert.deepEqual(D.seed.milestones.map(m=>m.date),['2025-10-01','2026-07-01','2027-07-01']);
});
test('UTC calendar arithmetic, real dates and monthly grain are explicit and timezone independent',()=>{
  assert.equal(M.addMonths('2026-01-31',1),'2026-02-28');assert.equal(M.addMonths('2024-01-31',1),'2024-02-29');assert.equal(M.monthsBetween('2026-01-31','2026-02-01'),1);
  for(const x of ['2026-02-30','2026-13-01','2026-2-01','bad'])assert.throws(()=>M.parseDate(x));
  const script=`const M=require(${JSON.stringify(require.resolve('../model.js'))});process.stdout.write(JSON.stringify(M.compute(M.defaults()).milestones));`;
  const a=spawnSync(process.execPath,['-e',script],{env:{...process.env,TZ:'UTC'},encoding:'utf8'}),b=spawnSync(process.execPath,['-e',script],{env:{...process.env,TZ:'America/Los_Angeles'},encoding:'utf8'});assert.equal(a.status,0);assert.equal(b.status,0);assert.equal(a.stdout,b.stdout);
});
test('triangular activation matches hand values and shoulders; zero strength and weight remain zero',()=>{
  const s=state([fibre('a',{cost:1})]);assert.deepEqual(M.compute(s).activation.a,[.5,1,.5,0,0,0,0]);
  s.weights.a=0;assert.ok(M.compute(s).activation.a.every(v=>v===0));delete s.weights.a;s.library[0].confidence=0;assert.ok(M.compute(s).activation.a.every(v=>v===0));
  s.library[0].confidence=.5;s.library[0].weight=2;close(M.baseActivation(s,s.library[0],1),1);
});
test('lagged links propagate base activation once; dormant targets, negative links and clipping are explicit',()=>{
  const a=fibre('a',{cost:1},{second:[{target:'b',lagMonths:1,polarity:1,strength:.5}]}),b=fibre('b',{supply:1},{confidence:0,second:[{target:'c',lagMonths:1,polarity:1,strength:1}]}),c=fibre('c',{quality:1},{confidence:0});
  const s=state([a,b,c]),r=M.compute(s);close(r.activation.b[2],.5);assert.ok(r.activation.c.every(v=>v===0));s.selected=['a'];assert.deepEqual(Object.keys(M.compute(s).activation),['a']);
  const neg=state([fibre('a',{cost:1},{second:[{target:'b',lagMonths:0,polarity:-1,strength:2}]}),fibre('b',{cost:1},{confidence:.2})]);const n=M.compute(neg);assert.equal(n.activation.b[1],0);assert.ok(n.clipped>0);
  neg.library[0].second[0].polarity=1;assert.equal(M.compute(neg).activation.b[1],2);
});
test('lagged contributions before the visible start preserve shared calendar-month results without recursive propagation',()=>{
  const s=state([fibre('a',{}, {second:[{target:'b',lagMonths:2,polarity:1,strength:1}]}),fibre('b',{cost:1},{confidence:0,second:[{target:'c',lagMonths:0,polarity:1,strength:1}]}),fibre('c',{quality:1},{confidence:0})]);
  s.milestones[0].date='2026-03-01';const original=M.compute(s);close(original.milestones[0].probe.attention,.5);
  for(const startDate of ['2026-02-01','2026-03-01']){
    const shifted=M.compute({...s,startDate});close(shifted.milestones[0].probe.attention,.5);assert.deepEqual(shifted.milestones[0].prompts,original.milestones[0].prompts);
    for(const p of shifted.monthly){const before=original.monthly.find(x=>x.date===p.date);if(before)assert.deepEqual(p,before);}
    assert.ok(shifted.activation.c.every(v=>v===0));
  }
  s.library[0].start='2016-01-01';s.library[0].end='2016-03-01';s.library[0].second[0].lagMonths=120;s.startDate='2026-02-01';
  close(M.compute(s).milestones[0].probe.attention,.5);
});
test('imported prototype-name scenario IDs use only explicit saved weight overrides',()=>{
  for(const id of ['toString','valueOf','hasOwnProperty']){
    const imported=M.parse(JSON.stringify(state([fibre(id,{cost:1},{weight:.8})])));
    assert.equal(Object.hasOwn(imported.weights,id),false);close(M.compute(imported).milestones[0].probe.attention,.8);
    for(const weight of [0,.4]){imported.weights[id]=weight;const round=M.parse(M.serialize(imported));close(M.compute(round).milestones[0].probe.attention,weight);}
  }
});
test('stress, relief and alignment retain signs; a neutral selected fibre cannot improve attention',()=>{
  const s=state([fibre('a',{cost:1})]);close(M.compute(s).milestones[0].probe.attention,1);
  s.library.push(fibre('neutral'));s.selected.push('neutral');close(M.compute(s).milestones[0].probe.attention,1);
  const relief=M.compute(state([fibre('relief',{cost:-1})]));assert.equal(relief.milestones[0].probe.attention,0);assert.equal(relief.milestones[0].prompts.length,0);assert.equal(relief.monthly[1].relief[0],1);
  const pair=M.compute(state([fibre('a',{cost:1}),fibre('b',{cost:1})]));close(pair.monthly[1].aligned,1);close(pair.monthly[1].attention,2);
  const opposing=M.compute(state([fibre('a',{cost:1}),fibre('b',{cost:-1})]));close(opposing.monthly[1].opposed,1);assert.equal(opposing.monthly[1].net[0],0);assert.equal(opposing.monthly[1].stress[0],1);assert.equal(opposing.monthly[1].relief[0],1);
});
test('review emphasis changes only attention and prompts, not activation, pressure or pairwise indices',()=>{
  const s=state([fibre('a',{cost:.6})]);s.risk=0;const low=M.compute(s);s.risk=1;const high=M.compute(s);assert.deepEqual(low.activation,high.activation);assert.deepEqual(low.monthly.map(p=>p.net),high.monthly.map(p=>p.net));close(low.monthly[1].attention,.78);close(high.monthly[1].attention,.42);assert.equal(low.milestones[0].prompts.length,1);assert.equal(high.milestones[0].prompts.length,0);
});
test('out-of-window milestones are not clamped to boundary results; an empty selection is a zero-assumption model',()=>{
  const s=state([]);s.milestones.push({id:'old',label:'Before',date:'2025-12-01'},{id:'later',label:'After',date:'2027-01-01'});const r=M.compute(s);assert.equal(r.milestones[0].probe.attention,0);assert.equal(r.milestones[1].probe,null);assert.equal(r.milestones[2].probe,null);assert.deepEqual(r.milestones[0].prompts,[]);
});
test('swap comparison recomputes effects and links without changing the baseline',()=>{
  const s=state([fibre('a',{cost:1}),fibre('b',{cost:-1}),fibre('c',{cost:0})]);s.selected=['a'];const snapshot=JSON.stringify(s),r=M.compare(s,'a','b');assert.equal(JSON.stringify(s),snapshot);close(r.rows[0].before,1);close(r.rows[0].after,0);assert.deepEqual(r.next.selected,['b']);assert.throws(()=>M.compare(s,'b','a'));assert.throws(()=>M.compare(s,'a','missing'));
});
test('model and legacy imports round-trip, preserve labels/tags and reject invalid or excessive input',()=>{
  const s=M.defaults();s.library[0].tags=['review'];s.library[0].name='<em>literal name</em>';assert.deepEqual(M.parse(M.serialize(s)),s);assert.deepEqual(M.parse(JSON.stringify(s)),s);
  const bad=[x=>x.library.push(x.library[0]),x=>x.library[0].start='not a date',x=>x.library[0].end='1900-01-01',x=>x.library[0].confidence=2,x=>x.library[0].effects.cost=null,x=>x.library[0].second[0].target='missing',x=>x.library[0].second[0].lagMonths=.5,x=>x.library[0].second[0].polarity=0,x=>x.selected.push('missing'),x=>x.horizon=Infinity,x=>x.risk=-1,x=>x.milestones[0].date='2026-02-30',x=>x.weights.unknown=1,x=>x.library[0].id='__proto__',x=>x.library=Array(33).fill(x.library[0]),x=>x.milestones=Array(13).fill(x.milestones[0])];
  for(const mutate of bad){const x=M.defaults();mutate(x);assert.throws(()=>M.validate(x));}
  assert.throws(()=>M.parse('{'));assert.throws(()=>M.parse(' '.repeat(M.MAX_BYTES+1)));assert.throws(()=>M.parse(JSON.stringify({app:M.APP,version:2,state:s})));
});
test('CSV exports all activation and signed contribution values, with quoted scenario headings',()=>{
  const s=state([fibre('a',{cost:1},{name:'A, "quoted" name'})]);const csv=M.csv(s);assert.ok(csv.includes('"activation: A, ""quoted"" name"'));assert.equal(csv.split('\r\n').length,8);assert.ok(csv.includes('"stress: cost"'));assert.ok(csv.includes('"relief: cost"'));
});
