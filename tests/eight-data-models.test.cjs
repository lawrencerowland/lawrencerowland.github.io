const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function fresh(slug, file='app.js') { const p=path.join(root,'library/apps',slug,file); delete require.cache[require.resolve(p)]; return require(p); }
const clone=x=>JSON.parse(JSON.stringify(x));
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);

test('interface absolute interventions are held, while ordinary nudges retain feedback',()=>{
  const m=fresh('interface-maturity');
  close(m.computeLocalDeltas('Trust',5).total.Trust,5.6);
  m.runAction({ifaceId:'pm-design',varKey:'Trust',mode:'set',value:60});
  close(m.state.interfaces[0].values.Trust,60);
  close(m.state.interfaces[0].values.Adaptability,62.5);
  assert.equal(m.state.step,1);
  m.restore(m.state.undoStack.pop());
  close(m.state.interfaces[0].values.Trust,55);assert.equal(m.state.step,0);
});
test('interface spillover follows realised change and a zero action is inert',()=>{
  const m=fresh('interface-maturity');m.state.interfaces[0].values.Trust=100;
  m.runAction({ifaceId:'pm-design',varKey:'Trust',mode:'delta',value:20});
  assert.equal(m.state.interfaces[0].lastStepDelta.Trust,0);
  assert.equal(m.state.interfaces[1].lastStepDelta.Trust,0);
  m.reset();m.state.interfaces[1].values.EscalationReadiness=20;m.state.interfaces[1].values.Ambiguity=80;
  const before=m.snapshot();assert.equal(m.runAction({ifaceId:'pm-design',varKey:'Trust',mode:'delta',value:0}),false);assert.deepEqual(m.snapshot(),before);
});
test('interface state import is atomic and preserves old exported states and assumptions',()=>{
  const m=fresh('interface-maturity');m.state.config.spilloverStrong=.25;m.runScenario('clarify_scope');const saved=m.snapshot();m.reset();m.loadState(saved);assert.deepEqual(m.snapshot(),saved);
  for(const mutate of [x=>x.interfaces=[],x=>x.interfaces[0].values.Trust=Infinity,x=>x.interfaces[0].weight=0,x=>x.interfaces[1].id=x.interfaces[0].id,x=>x.config.spilloverStrong=-1,x=>x.config.localIterations=1.5,x=>x.selected.varKey='unknown']){
    const bad=clone(saved);mutate(bad);assert.throws(()=>m.loadState(bad));assert.deepEqual(m.snapshot(),saved);
  }
  assert.throws(()=>m.runAction({ifaceId:'pm-design',varKey:'Trust',mode:'set',value:NaN}));assert.deepEqual(m.snapshot(),saved);
});
test('interface scenarios, reset and directional mapping remain useful',()=>{
  const m=fresh('interface-maturity');for(const scenario of ['early_warning','contract_misalign','clarify_scope','deadline_pressure']){m.reset();m.runScenario(scenario);assert.equal(m.state.step,1);assert.equal(m.state.interfaces[0].history.Trust.length,2);}
  m.state.config.spilloverWeak=.7;m.reset();assert.equal(m.state.config.spilloverWeak,.05);
  const pack=JSON.parse(m.generateExportPack());assert.equal(pack.stories.length,5);assert.equal(pack.relationships.length,10);
  const edge=pack.relationships.find(x=>x.from==='pm-design'&&x.to==='pm-client');close(edge.coefficient_from_to,.1154);close(edge.coefficient_to_from,.15);
  assert.match(m.generateCSV(),/MaturityIndex/);assert.match(pack.meta.notes[0],/NOT an official/);
});
test('governance rules cover all event combinations, distinguishing not applicable',()=>{
  const m=fresh('governance-trio','model.js');for(let mask=0;mask<64;mask++){const a=m.steps.filter((_,i)=>mask&(1<<i)).map(s=>s.id),r=m.derive({a,seed:42}).rules,has=id=>a.includes(id);assert.equal(r[0].ok,has('approve')?(has('review1')&&has('review2')):null);assert.equal(r[1].ok,has('publish')?(has('ingest')&&has('build')):null);assert.equal(r[2].ok,has('approve')?has('build'):null);assert.equal(r[4].ok,has('build')||has('review1')||has('review2')?(!has('build')||has('ingest'))&&(!(has('review1')||has('review2'))||has('build')):null);}
  assert.ok(m.derive({a:[],seed:1}).rules.every(r=>r.status==='Not applicable'));
});
test('governance lineage does not manufacture missing predecessors; role can fail',()=>{
  const m=fresh('governance-trio','model.js');const incomplete=m.derive({a:['build','review1','approve'],seed:1,role:'Dev'});assert.equal(incomplete.rules[3].ok,false);assert.ok(!incomplete.edges.some(e=>e[0]==='CleanData'));assert.ok(incomplete.missing.some(s=>s.includes('ingest')));
  const full=m.derive({a:m.steps.map(s=>s.id),seed:1,role:'QA'});assert.ok(full.rules.every(x=>x.ok));assert.ok(full.edges.some(e=>e[0]==='ReviewNote#1'&&e[1]==='Approval'));assert.ok(full.edges.some(e=>e[0]==='ReviewNote#2'&&e[1]==='Approval'));assert.equal(full.missing.length,0);
});
test('governance accepts old URL payloads and deterministically renders a synthetic scenario',()=>{
  const m=fresh('governance-trio','model.js');const legacy={a:['approve','build'],seed:123};const payload=Buffer.from(JSON.stringify(legacy)).toString('base64');const s=m.validate(JSON.parse(Buffer.from(payload,'base64').toString()));assert.equal(s.role,'Lead');assert.deepEqual(s.a,['build','approve']);assert.equal(m.replay(s),m.replay(s));assert.match(m.replay(s),/Synthetic timestamps/);assert.notEqual(m.replay(s),m.replay({...s,seed:124}));
  for(const bad of [{a:'approve',seed:1},{a:['unknown'],seed:1},{a:['build','build'],seed:1},{a:[],seed:-1},{a:[],seed:1.5},{a:[],seed:Infinity},{a:[],seed:2**40},{a:[],seed:1,role:'Owner'}])assert.throws(()=>m.validate(bad));
});
test('intent demo and CSV reader preserve commas, quotes and newlines',async()=>{
  const m=fresh('intent-field-navigator'),files=m.demoCSVs();const data=m.prepareData(m.parseCSV(await files.intents.text()),m.parseCSV(await files.work.text()),m.parseCSV(await files.outcomes.text()));assert.equal(data.intents.length,4);assert.equal(data.items.length,12);assert.equal(data.outcomes.length,6);assert.equal(data.intents[0].target_weight,.35);assert.match(data.intents[0].description,/fault-tolerance/);assert.equal(data.items[0].effort,3);
  const rows=[['id','text'],['1','comma, quote " and\nnext line']];assert.equal(m.parseCSV(m.csvText(rows))[0].text,rows[1][1]);assert.throws(()=>m.parseCSV('id,text\n1,a,b'));assert.throws(()=>m.parseCSV('id,text\n1,"unclosed'));assert.throws(()=>m.parseCSV('id,id\n1,2'));
});
test('intent import rejects invalid and partial data before changing working state',()=>{
  const m=fresh('intent-field-navigator'),intents=[{intent_id:'A',name:'Alpha',target_weight:'1'},{intent_id:'B',name:'Beta',target_weight:'1'}],items=[{item_id:'W',title:'Alpha',effort:'0'}];Object.assign(m.State,m.prepareData(intents,items));const before=clone(m.State.items);
  for(const bad of [()=>m.prepareData([{...intents[0]},{...intents[1],target_weight:''}],items),()=>m.prepareData([intents[0],intents[0]],items),()=>m.prepareData(intents.map(x=>({...x,active:'0'})),items),()=>m.prepareData(intents,[{...items[0],effort:'3bad'}]),()=>m.prepareData(intents,[{...items[0],effort:'-1'}]),()=>m.prepareData(intents,items,[{item_id:'missing',outcome:'1'}]),()=>m.prepareData(intents,items,[{item_id:'W',realized_intent:'X',outcome:'1'}])])assert.throws(bad);
  assert.deepEqual(m.State.items,before);assert.equal(m.State.items[0].effort,0);
});
test('intent unmatched work and zero effort are preserved; boundary ties are not arbitrary',()=>{
  const m=fresh('intent-field-navigator');m.State.intents=['A','B','C','D'].map(intent_id=>({intent_id,target_weight:.25,active:true}));m.State.items=[{item_id:'zero',effort:0},{item_id:'none',effort:3},{item_id:'ties',effort:1}];m.State.sim=[[1,0,0,0],[0,0,0,0],[1,1,1,1]];m.State.params.topK=3;m.sparsifyAndNormalize();assert.deepEqual([...m.State.probs[1]],[0,0,0,0]);assert.deepEqual([...m.State.probs[2]],[.25,.25,.25,.25]);const r=m.computeCoverageAndGaps();assert.equal(m.State.totals.efforts,4);close(m.State.totals.unallocated,3);close([...r.covPct].reduce((s,x)=>s+x,0),.25);
});
test('intent candidate moves use portfolio units and match an explicit before/after transfer',()=>{
  const m=fresh('intent-field-navigator');m.State.intents=[{intent_id:'A',name:'A',target_weight:.45,active:true},{intent_id:'B',name:'B',target_weight:.55,active:true}];m.State.items=[{item_id:'small',effort:1},{item_id:'big',effort:999}];m.State.probs=[[.51,.49],[.51,.49]];m.computeCoverageAndGaps();const n=m.computeNudges().find(x=>x.item_id==='small');assert.ok(n);assert.ok(n.delta_gap<=.001);close(n.delta_gap,n.transfer_weight/1000);const before=m.State.gaps.A;m.State.probs[0][0]-=n.transfer_weight;m.State.probs[0][1]+=n.transfer_weight;m.computeCoverageAndGaps();close(before-m.State.gaps.A,n.delta_gap);
});
test('intent outcome update honours declared realised intent and is single-use until reset',()=>{
  const m=fresh('intent-field-navigator');Object.assign(m.State,m.prepareData([{intent_id:'A',name:'A',target_weight:1},{intent_id:'B',name:'B',target_weight:1}],[{item_id:'W1',title:'A'},{item_id:'W2',title:'B'}],[{item_id:'W1',outcome:1,realized_intent:'B'},{item_id:'W2',outcome:0,realized_intent:'A'}]));m.State.probs=[[1,0],[0,1]];m.applyLearningUpdate();close(m.State.intents[0].target_weight,.45);close(m.State.intents[1].target_weight,.55);m.applyLearningUpdate();close(m.State.intents[1].target_weight,.55);
});
test('intent imported markup is treated as text and spreadsheet formulas are escaped',()=>{
  const m=fresh('intent-field-navigator');assert.equal(m.escapeHTML('<img onerror="x">'),'&lt;img onerror=&quot;x&quot;&gt;');assert.match(m.csvText([['text'],['=1+1']],true),/'=1\+1/);
});
test('intent boundary example demonstrates ambiguity, unallocated effort, zero effort and a feasible candidate',async()=>{
  const m=fresh('intent-field-navigator'),files=m.boundaryCSVs();Object.assign(m.State,m.prepareData(m.parseCSV(await files.intents.text()),m.parseCSV(await files.work.text())));m.buildVocabulary();m.buildVectors();m.computeSimilarities();m.sparsifyAndNormalize();m.computeCoverageAndGaps();close(m.State.probs[0][0],.5);close(m.State.probs[0][1],.5);assert.deepEqual([...m.State.probs[1]],[0,0]);assert.equal(m.State.items[2].effort,0);close(m.State.totals.unallocated,2);const moves=m.computeNudges();assert.equal(moves.length,1);assert.equal(moves[0].item_id,'MIX');assert.ok(moves[0].transfer_weight>0&&moves[0].transfer_weight<=.5);
});
test('intent identifiers resembling object properties do not corrupt allocations',()=>{
  const m=fresh('intent-field-navigator');Object.assign(m.State,m.prepareData([{intent_id:'__proto__',name:'Resilience',target_weight:1},{intent_id:'constructor',name:'Usability',target_weight:1}],[{item_id:'__proto__',title:'Resilience',effort:3}]));m.buildVocabulary();m.buildVectors();m.computeSimilarities();m.sparsifyAndNormalize();m.computeCoverageAndGaps();assert.equal(m.State.coverage.__proto__,1);assert.equal(m.State.gaps.constructor,-.5);assert.equal(m.State.totals.efforts,3);
});
test('intent unmatched vectors have no entropy and are excluded from the histogram',()=>{
  const m=fresh('intent-field-navigator');assert.equal(m.entropy([0,0]),null);close(m.entropy([.5,.5]),1);close(m.entropy([1,0]),0);m.State.intents=[{active:true},{active:true}];m.State.items=[{}, {}, {}];m.State.probs=[[0,0],[.5,.5],[1,0]];const ent=m.computeEntropyList();assert.deepEqual(ent,[null,1,0]);const histogram=m.entHistogram(ent);assert.equal(histogram.counts.reduce((s,x)=>s+x,0),2);assert.equal(histogram.counts[0],1);assert.equal(histogram.counts[9],1);m.State.probs=[[0,0],[0,0],[0,0]];assert.equal(m.computeGraphRoughness(),null);
});
