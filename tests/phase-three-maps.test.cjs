const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
const root=path.resolve(__dirname,'..');
const {JSDOM}=createRequire(path.join(root,'tools/library-apps/package.json'))('jsdom');
const M=require('../library/apps/project-decision-graph/model.js');
const clone=x=>JSON.parse(JSON.stringify(x));
const folders={decision:'project-decision-graph',crossing:'crossing-project-map'};
function read(kind){const text=fs.readFileSync(path.join(root,'library/apps',folders[kind],'index.html'),'utf8');return JSON.parse(text.match(/<script type="application\/json" id="kg-data">([\s\S]*?)<\/script>/)[1]);}
const H=read('decision'),C=read('crossing'),original=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/phase-three-maps-original.json'),'utf8'));
function ui(t,kind,{graph=false,map=false,hash=''}={}){
  const folder=path.join(root,'library/apps',folders[kind]);
  const dom=new JSDOM(fs.readFileSync(path.join(folder,'index.html'),'utf8'),{url:'https://example.test/library/apps/'+folders[kind]+'/'+hash,runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window,d=w.document,errors=[];w.addEventListener('error',e=>errors.push(e.error));
  w.eval(fs.readFileSync(path.join(folder,'model.js'),'utf8'));
  if(graph)w.eval(fs.readFileSync(path.join(folder,'vendor/d3.v7.9.0.min.js'),'utf8'));
  if(map){
    // jsdom's contextified Window proxy does not report inherited event methods to `in`.
    Object.defineProperty(w,'addEventListener',{value:w.addEventListener.bind(w),configurable:true});
    Object.defineProperty(w,'removeEventListener',{value:w.removeEventListener.bind(w),configurable:true});
    w.SVGSVGElement.prototype.createSVGRect=()=>({});const host=d.getElementById('map');Object.defineProperties(host,{clientWidth:{value:650},clientHeight:{value:530}});w.eval(fs.readFileSync(path.join(folder,'vendor/leaflet.js'),'utf8'));
  }
  w.eval(fs.readFileSync(path.join(folder,'app.js'),'utf8'));
  t.after(()=>{w.close();assert.deepEqual(errors,[]);});
  return {w,d,api:w.LibraryGraph,click:id=>d.getElementById(id).click(),input:(id,value,event='input')=>{const el=d.getElementById(id);if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new w.Event(event,{bubbles:true}));}};
}

test('all original entities and relationships survive with inspectable original relation mappings',()=>{
  for(const [kind,data] of [['decision',H],['crossing',C]]){
    assert.equal(M.validateData(data),data);
    assert.deepEqual(data.nodes.map(n=>n.id),original[kind].nodes.map(n=>n.id));
    assert.equal(data.nodes.length,kind==='decision'?22:54);
    for(const source of original[kind].links)assert.ok(data.edges.some(e=>JSON.stringify(e.legacy)===JSON.stringify(source)),JSON.stringify(source));
  }
  assert.equal(H.edges.length,28);assert.equal(C.edges.length,76);
  assert.equal(C.nodes.filter(n=>n.meta.noticeId).length,12);
  assert.equal(C.nodes.filter(n=>n.basis==='Legacy notice row — not reverified').length,4);
  for(const n of C.nodes){const source=original.crossing.nodes.find(x=>x.id===n.id);if(source.lat!==undefined){assert.equal(n.lat,source.lat);assert.equal(n.lon,source.lon);assert.ok(n.meta.coordinateBasis);}}
});

test('HS2 arrows use the intended direction; decision reading is a connected directed path',()=>{
  const edge=(a,b,type)=>H.edges.some(e=>e.source===a&&e.target===b&&e.type===type);
  assert.ok(edge('timelineAdherence','constructionManager','inheresIn'));
  assert.ok(edge('qualityStandardsCompliance','constructionManager','inheresIn'));
  assert.ok(edge('constructionDelay','concreteQualityFailure','historicallyDependsOn'));
  assert.ok(edge('materialQualityUncertainty','concreteQualityFailure','mayPrecede'));
  assert.ok(edge('supplierReplacement','constructionDelay','acceptsShortTermDelay'));
  assert.ok(!edge('supplierReplacement','constructionDelay','mitigates'));
  const path=H.scenarios.find(r=>r.id==='decision').nodes;
  for(let i=1;i<path.length;i++)assert.ok(H.edges.some(e=>e.source===path[i-1]&&e.target===path[i]),`${path[i-1]} → ${path[i]}`);
  assert.ok(H.nodes.every(n=>n.basis==='Fictional scenario'));
  assert.ok(H.edges.every(e=>e.kind==='scenario'));
  assert.equal(H.nodes.find(n=>n.id==='chilternViaduct').label,'Fictional viaduct');
});

test('primary notice corrections, source discrepancies and unavailable rows remain explicit',()=>{
  const n=id=>C.nodes.find(n=>n.id===id);
  assert.deepEqual(['awardDate','start','end','cpv'].map(k=>n('c_gantries_2026').meta[k]),['2025-12-23','2026-01-14','2027-08-31','71220000']);
  assert.equal(n('c_gantries_2026').legacyMeta.awardDate,'2026-01-14');
  assert.equal(n('c_hydrogen_2024').meta.valueGBP,146423);
  assert.equal(n('c_hydrogen_2024').legacyMeta.valueGBP,38750);
  assert.equal(n('c_finance_erp_2026').meta.valueGBP,2000000);
  assert.equal(n('c_finance_erp_2026').meta.summaryValueGBP,1248585);
  assert.equal(n('c_task17a_2016').meta.end,'2015-12-31');
  assert.equal(n('c_task17a_2016').meta.summaryEnd,'2016-01-06');
  for(const id of ['c_dco_2024','c_f0031_2024','c_f0022_2024','c_t0344_2022'])assert.match(n(id).meta.review,/could not be retrieved/);
  for(const e of C.edges.filter(e=>['c_dco_2024','c_f0031_2024','c_f0022_2024','c_t0344_2022'].includes(e.source)))assert.notEqual(e.kind,'notice');
});

test('filter combinations never leak edges, year uses corrected award dates, undated is an explicit choice',()=>{
  const s=M.defaultState(C);s.year=2026;s.undated=false;
  const r=M.derive(C,s);
  assert.deepEqual(r.nodes.filter(n=>n.type==='Contract').map(n=>n.id),['c_finance_erp_2026']);
  assert.ok(r.nodes.some(n=>n.id==='org_nh_ltd'));
  s.undated=true;assert.equal(M.derive(C,s).nodes.filter(n=>n.type==='Contract').length,4);
  for(const year of [2015,2020,2024,2025,2026])for(const type of ['Contract','Organisation','Location','Project','Site','Framework'])for(const inferred of [true,false]){
    const state={...M.defaultState(C),year,types:[type],inferred},v=M.derive(C,state);
    assert.ok(v.nodes.every(n=>n.type===type));assert.ok(v.edges.every(e=>v.ids.has(e.source)&&v.ids.has(e.target)));
    if(!inferred)assert.ok(v.edges.every(e=>e.kind!=='inferred'));
  }
  const selected={...M.defaultState(C),selected:'c_gantries_2026',query:'NO MATCH 772991'};
  assert.equal(M.derive(C,selected).selected,null);assert.equal(M.derive(C,selected).nodes.length,0);
  assert.equal(M.derive(C,{...M.defaultState(C),relations:[]}).edges.length,0);
});

test('coordinates distinguish actual source points, office inheritance and illustrative project anchors',()=>{
  const location=M.coordinate(C,'loc_kt18_5bw'),office=M.coordinate(C,'org_atkinsrealis_pps'),contract=M.coordinate(C,'c_gantries_2026');
  assert.equal(location.derived,false);assert.equal(office.derived,true);assert.equal(office.lat,location.lat);assert.match(office.basis,/not an actual project worksite/);
  assert.match(M.coordinate(C,'org_deloitte').basis,/Representative city proxy/);
  assert.equal(contract.anchor,'site_ltc');assert.match(contract.basis,/not a contract delivery coordinate/);
  assert.equal(M.coordinate(C,'org_dft'),null);assert.equal(M.coordinate(C,'fw_rm6323'),null);
  const v=M.derive(C,M.defaultState(C)),lines=M.mapEdges(C,v);
  assert.ok(lines.length>0);assert.ok(lines.every(e=>e.a.lat!==e.b.lat||e.a.lon!==e.b.lon));
  assert.ok(lines.some(e=>e.type==='SUPPLIED_BY'));
  assert.ok(C.edges.filter(e=>e.type==='ASSOCIATED_WITH_AREA').every(e=>e.kind==='inferred'));
});

test('view export/import is a strict, immutable, app-specific round trip',()=>{
  for(const data of [H,C]){const s={...M.defaultState(data),query:'quality',selected:data.nodes[0].id,year:2025,ego:true,charge:700};const before=clone(s);assert.deepEqual(M.importView(data,M.exportView(data,s)),s);assert.deepEqual(s,before);
    const bad=[x=>x.v=2,x=>x.types.push(x.types[0]),x=>x.relations=['missing'],x=>x.query='q'.repeat(201),x=>x.year=2027,x=>x.charge=NaN,x=>x.labels='true',x=>x.selected='missing',x=>x.reading='missing',x=>x.unrecognised=true];
    for(const mutate of bad){const x=clone(s);mutate(x);assert.throws(()=>M.validateState(data,x));}
  }
  assert.throws(()=>M.importView(H,M.exportView(C,M.defaultState(C))),/different example/);
  assert.throws(()=>M.importView(H,'{broken'));assert.throws(()=>M.importView(H,'x'.repeat(30001)),/too large/);
  const s=M.defaultState(H);M.derive(H,s);assert.deepEqual(s,M.defaultState(H));
});

test('complete lists and filters work without graphical libraries',t=>{
  const u=ui(t,'crossing');assert.equal(u.d.querySelectorAll('.node-card').length,54);assert.equal(u.d.querySelectorAll('#relations>li').length,76);
  assert.equal(u.d.getElementById('graph-fallback').hidden,false);assert.equal(u.d.getElementById('map-fallback').hidden,false);
  u.input('year',2026);u.input('undated',false,'change');assert.equal(u.api.getView().nodes.filter(n=>n.type==='Contract').length,1);
  u.click('card-c_finance_erp_2026');assert.match(u.d.getElementById('details').textContent,/£1,248,585/);assert.match(u.d.getElementById('details').textContent,/£2,000,000/);
  u.input('search','NO MATCH');assert.match(u.d.getElementById('cards').textContent,/No nodes match/);assert.equal(u.api.getState().selected,null);
  u.click('reset');assert.equal(u.d.querySelectorAll('.node-card').length,54);
});

test('guided readings, keyboard nodes, stable selection layout and zoom controls work with local D3',t=>{
  const u=ui(t,'decision',{graph:true});assert.equal(u.d.querySelectorAll('.graph-node').length,22);
  u.click('reading-decision');assert.equal(u.d.querySelectorAll('.node-card').length,6);
  const target=u.d.getElementById('graph-materialQualityVariance');target.focus();const transform=target.getAttribute('transform');target.dispatchEvent(new u.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
  assert.equal(u.api.getState().selected,'materialQualityVariance');assert.equal(u.d.activeElement.id,'graph-materialQualityVariance');assert.equal(u.d.getElementById('graph-materialQualityVariance').getAttribute('transform'),transform);
  assert.match(u.d.getElementById('details').textContent,/Fictional scenario/);u.click('pin-node');assert.match(u.d.getElementById('pin-node').textContent,/Unpin/);
  u.click('zoom-in');u.click('zoom-out');u.click('fit');
  u.input('charge',700);u.input('distance',180);assert.equal(u.api.getState().charge,700);
  u.click('reset');assert.equal(u.d.querySelectorAll('.graph-node').length,22);assert.equal(u.api.getState().reading,'');
});

test('crossing uses real local Leaflet: projected lines, grouped points, selected records and map fit',t=>{
  const u=ui(t,'crossing',{graph:true,map:true});assert.match(u.d.getElementById('map-count').textContent,/16 distinct coordinate points/);
  assert.equal(u.d.querySelectorAll('img.leaflet-tile').length,0);
  u.input('mapLines',true,'change');assert.ok(Number(u.d.getElementById('map-count').textContent.match(/· (\d+) projected lines/)[1])>0);
  u.click('reading-geography');u.click('card-org_arup');assert.match(u.d.getElementById('details').textContent,/city proxy/);u.click('fit-map');
  assert.ok(u.d.querySelectorAll('.leaflet-interactive').length>0);
});

test('share links restore filters and selection; malformed links keep the default data',t=>{
  const u=ui(t,'decision');u.click('reading-value');u.click('card-qualityControlTeam');u.click('share');
  const link=u.d.getElementById('share-link').value,hash=new URL(link).hash;
  const restored=ui(t,'decision',{hash});assert.deepEqual(clone(restored.api.getState()),clone(u.api.getState()));
  const bad=ui(t,'decision',{hash:'#view=%7Bbad'});assert.equal(bad.api.getView().nodes.length,22);assert.match(bad.d.getElementById('status').textContent,/could not be opened/);
});

test('original HS2 tab and content bookmark fragments land on persistent readable sections',t=>{
  // These six IDs are taken from the pinned original HTML, not invented compatibility names.
  const anchors={
    'overview-tab':/A concrete supply problem/,
    'overview-content':/Trace a project decision/,
    'details-tab':/Inspect a node/,
    'details-content':/Inspect a node/,
    'scenario-tab':/The fictional decision story/,
    'scenario-content':/The fictional decision story/
  };
  for(const [id,copy] of Object.entries(anchors)){
    const u=ui(t,'decision',{hash:'#'+id});
    assert.equal(u.w.location.hash,'#'+id);
    assert.match(u.d.getElementById(id).textContent,copy);
    assert.equal(u.api.getView().nodes.length,22,'a section bookmark must not become a saved-view filter');
    u.click('reading-decision');u.click('card-materialQualityVariance');
    for(const alias of Object.keys(anchors))assert.ok(u.d.getElementById(alias),alias+' survives dynamic detail rendering');
    assert.match(u.d.getElementById('details-content').textContent,/Material Quality Variance/);
    assert.equal(u.d.querySelectorAll('#network').length,1);
    u.click('reset');assert.match(u.d.getElementById('details-content').textContent,/Inspect a node/);
  }
});

test('view-file import is atomic in the UI and safely restores the exported filters',async t=>{
  const u=ui(t,'crossing');u.click('reading-audit');u.click('card-c_f0030_2024');const before=clone(u.api.getState()),input=u.d.getElementById('import-view');
  async function importFile(text){Object.defineProperty(input,'files',{value:[{size:text.length,text:async()=>text}],configurable:true});input.dispatchEvent(new u.w.Event('change'));await new Promise(setImmediate);}
  await importFile('{bad');assert.deepEqual(clone(u.api.getState()),before);assert.match(u.d.getElementById('status').textContent,/View was not changed/);
  await importFile(M.exportView(H,M.defaultState(H)));assert.deepEqual(clone(u.api.getState()),before);
  const next={...M.defaultState(C),year:2026,undated:false,selected:'c_finance_erp_2026'};await importFile(M.exportView(C,next));assert.deepEqual(clone(u.api.getState()),next);assert.match(u.d.getElementById('details').textContent,/Finance ERP/);
});

test('both routes use local scripts, complete navigation and no remote script requirement',()=>{
  for(const kind of Object.keys(folders)){const folder=path.join(root,'library/apps',folders[kind]),dom=new JSDOM(fs.readFileSync(path.join(folder,'index.html'),'utf8')),d=dom.window.document;
    for(const s of d.querySelectorAll('script[src]')){assert.ok(!s.src.startsWith('https:'));assert.ok(fs.existsSync(path.join(folder,s.getAttribute('src'))));}
    assert.equal(d.querySelector('link[rel=canonical]').href,'https://lawrencerowland.github.io/library/apps/'+folders[kind]+'/');
    assert.ok(d.querySelector('nav a[href="/library.html"]'));assert.ok(d.querySelector('nav a[href="/"]'));
    const ids=[...d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);dom.window.close();
  }
  assert.equal(fs.readFileSync(path.join(root,'library/apps/project-decision-graph/model.js'),'utf8'),fs.readFileSync(path.join(root,'library/apps/crossing-project-map/model.js'),'utf8'));
});
