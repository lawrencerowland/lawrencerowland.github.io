'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const M=require('../assets/js/gap-map-model.js'),base=require('../assets/data/gap-map.json');
const root=path.join(__dirname,'..'),requireLibrary=require('node:module').createRequire(path.join(root,'tools/library-apps/package.json'));
const {JSDOM}=requireLibrary('jsdom');
const by=(data,key,id)=>data[key].find(x=>x.id===id);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('risk paths are restored without changing the receiving framing/history identities',()=>{
  const d=M.createData(base);
  assert.equal(d.gaps.length,13);assert.equal(d.capabilities.length,23);assert.equal(d.resources.length,18);
  assert.match(by(d,'capabilities','C14').title,/Framing/);assert.match(by(d,'capabilities','C15').title,/Historical/);
  assert.match(by(d,'capabilities','C22').title,/Quantitative Risk/);assert.match(by(d,'capabilities','C23').title,/Risk Culture/);
  for(const id of ['C22','C23']){assert.ok(by(d,'gaps','G10').linkedCapabilities.includes(id));assert.ok(by(d,'capabilities',id).linkedResources.includes('R4'));}
  assert.deepEqual(by(d,'resources','R4').linkedCapabilities,['C22','C23']);
  assert.ok(by(d,'resources','R10').linkedCapabilities.includes('C22'));assert.ok(!by(d,'resources','R10').linkedCapabilities.includes('C14'));
  assert.ok(by(d,'resources','R1').linkedCapabilities.includes('C23'));assert.ok(!by(d,'resources','R1').linkedCapabilities.includes('C15'));
});
test('meaningful old-only links survive and every reverse relation has exactly one forward relation',()=>{
  const d=M.createData(base);
  for(const [cid,rid] of [['C6','R14'],['C11','R12'],['C23','R1']])assert.ok(by(d,'capabilities',cid).linkedResources.includes(rid));
  for(const [gid,cid] of [['G6','C2'],['G4','C3'],['G6','C4'],['G12','C6'],['G10','C8'],['G4','C10']])assert.ok(by(d,'gaps',gid).linkedCapabilities.includes(cid));
  for(const g of d.gaps)for(const c of d.capabilities)assert.equal(g.linkedCapabilities.filter(x=>x===c.id).length,c.linkedGaps.filter(x=>x===g.id).length);
  for(const c of d.capabilities)for(const r of d.resources)assert.equal(c.linkedResources.filter(x=>x===r.id).length,r.linkedCapabilities.filter(x=>x===c.id).length);
  assert.ok(by(d,'gaps','G1').linkedCapabilities.includes('C21'));assert.ok(by(d,'capabilities','C20').linkedResources.includes('R18'));
  assert.throws(()=>M.createData({...base,gaps:[{...base.gaps[0],linkedCapabilities:['missing']}]}),/Unknown capability/);
});
test('references have usable destinations and explicit contextual notes, not placeholder jumps',()=>{
  for(const r of base.resources){assert.ok(M.safeURL(r.url));assert.notEqual(r.url,'#');assert.ok(r.description.length>30);assert.ok(r.sourceKind);}
  assert.match(by(base,'resources','R3').url,/projectdelivery.gov.uk\/library-product\/benefits-management/);
  assert.match(by(base,'resources','R10').description,/Vendor|vendor/);
  assert.equal(M.safeURL('javascript:alert(1)'),null);assert.equal(M.safeURL('data:text/html,hello'),null);
});
test('CSV preserves quoted commas, escaped quotes, multiline content and empty catalogues',()=>{
  const records=M.parseCSV('\uFEFFname,description,tags\r\n"a","A, \"\"quoted\"\"\nline","risk; ai"\r\n');
  assert.deepEqual(records,[{name:'a',description:'A, "quoted"\nline',tags:'risk; ai'}]);assert.deepEqual(M.parseCSV(''),[]);assert.deepEqual(M.parseCSV('name,tags\n'),[]);
  assert.throws(()=>M.parseCSV('name\n"broken'),/quote/);assert.throws(()=>M.parseCSV('<html>error</html>'),/name column/);
});
test('maintained homes override stale source identities and destination aliases without losing residual apps',()=>{
  const library=[{name:'old-name',repo:'Project-web-apps',url:'https://lawrencerowland.github.io/library/apps/new-home/',tags:'risk',description:'kept'}];
  const specialist=[{name:'alias',repo:'Project-web-apps',url:'/library/apps/new-home/index.html#item'}, {name:'special',repo:'Project-web-apps',url:'/special/'}];
  const old=[{name:'old-name',repo:'Project-web-apps'},{name:'alias',repo:'Project-web-apps'},{name:'residual',tags:'coaching'},{name:'3D_Construction_Workflow',repo:'Project-web-apps'}];
  const apps=M.mergeApps([library,specialist,old],[{repo:'Project-web-apps',name:'3D_Construction_Workflow'}]);
  assert.deepEqual(apps.map(a=>a.name),['old-name','special','residual']);assert.equal(apps[0].description,'kept');
  const d=M.integrateApps(base,apps),r=d.resources.find(r=>r.title==='old-name');assert.ok(r.linkedCapabilities.includes('C22'));assert.ok(!r.linkedCapabilities.includes('C14'));
  const ids=d.resources.map(r=>r.id);assert.equal(new Set(ids).size,ids.length);
});
test('domain aliases and OR semantics match the graph; no dangling links survive filtering',()=>{
  assert.deepEqual(M.domains(['Project Leadership','Team Dynamics']),['Project Leadership & Team Dynamics']);
  const item={title:'A',description:'',domains:['Risk Management','Project Governance']};
  assert.equal(M.matches(item,'',new Set(['Risk Management'])),true);assert.equal(M.matches(item,'',new Set(item.domains)),false);
  const d=M.integrateApps(base,[{name:'unmapped',repo:'Project-web-apps',url:'/unmapped/',tags:'never-seen'}]);
  assert.deepEqual(d.resources.find(r=>r.title==='unmapped').domains,['Unclassified']);
  const graph=M.graphData(d,'risk',new Set(['Project Governance'])),ids=new Set(graph.nodes.map(n=>n.id));
  assert.ok(ids.has('C22'));assert.ok(!ids.has('C15'));assert.ok(graph.nodes.every(n=>M.matches(n,'risk',new Set(['Project Governance']))));
  assert.ok(graph.links.every(e=>ids.has(e.source)&&ids.has(e.target)));
});
function feedFetcher(failed=[]){return async url=>{
  if(failed.some(s=>url.includes(s)))throw new Error('offline');
  if(url.includes('app-index'))return {ok:true,text:async()=> 'name,tags\nold,risk\nresidual,coaching\n3D_Construction_Workflow,ai\n'};
  const rows=url.includes('retired')?[{repo:'Project-web-apps',name:'3D_Construction_Workflow'}]:url.includes('specialist')?[{name:'special',repo:'Project-web-apps',url:'/special/'}]:[{name:'old',repo:'Project-web-apps',url:'/library/apps/old/'}];
  return {ok:true,json:async()=>rows};
};}
test('maintained feeds recover independently without the retired CSV',async()=>{
  let result=await M.loadCatalogues(feedFetcher());assert.deepEqual(result.apps.map(a=>a.name),['old','special']);assert.deepEqual(result.failures,[]);
  result=await M.loadCatalogues(feedFetcher(['library-apps']));assert.deepEqual(result.apps.map(a=>a.name),['special']);
  result=await M.loadCatalogues(feedFetcher(['specialist']));assert.deepEqual(result.apps.map(a=>a.name),['old']);
  result=await M.loadCatalogues(feedFetcher(['retired']));assert.deepEqual(result.failures,['Retirement list']);
  result=await M.loadCatalogues(async()=>({ok:false}));assert.equal(result.apps.length,0);assert.equal(result.failures.length,3);
  const seen=[];await M.loadCatalogues(async url=>{seen.push(url);return feedFetcher()(url)});assert.ok(seen.every(url=>!url.includes('app-index')));
});
async function pageFixture(t,{deferFeeds=false,d3=false,fail=[]}={}){
  const dom=new JSDOM(read('gap-map.md').replace(/^---[\s\S]*?---\n/,''),{url:'https://example.test/gap-map.html',runScripts:'outside-only',pretendToBeVisual:true});t.after(()=>{dom.window.dispatchEvent(new dom.window.Event('pagehide'));dom.window.close();});
  const {window:w}=dom;let release;const gate=new Promise(resolve=>release=resolve);let starts=0,stops=0;
  if(d3){w.eval(fs.readFileSync(requireLibrary.resolve('d3').replace(/src\/index.js$/,'dist/d3.min.js'),'utf8'));const real=w.d3.forceSimulation;w.d3.forceSimulation=(...args)=>{starts++;const sim=real(...args),stop=sim.stop;sim.stop=function(){stops++;return stop.call(sim);};return sim;};}
  w.fetch=async url=>{if(url.includes('gap-map.json'))return {ok:true,json:async()=>JSON.parse(JSON.stringify(base))};if(deferFeeds)await gate;return feedFetcher(fail)(url);};
  w.eval(read('assets/js/gap-map-model.js'));w.eval(read('assets/js/gap-map.js'));await new Promise(setImmediate);await new Promise(setImmediate);
  return {w,doc:w.document,counts:()=>({starts,stops}),async release(){release();await new Promise(setImmediate);await new Promise(setImmediate);},input(text){const el=w.document.getElementById('searchBox');el.value=text;el.dispatchEvent(new w.Event('input',{bubbles:true}));}};
}
test('catalogue arrival preserves an active filter; link navigation exposes and focuses its actual target',async t=>{
  const p=await pageFixture(t,{deferFeeds:true});p.doc.getElementById('btnC').click();p.input('Quantitative Risk');
  const box=p.doc.querySelector('input[data-domain="Project Governance"]');box.focus();box.checked=false;box.dispatchEvent(new p.w.Event('change'));await p.release();
  assert.equal(p.doc.querySelectorAll('#listView .item').length,1);assert.equal(p.doc.querySelector('input[data-domain="Project Governance"]').checked,false);assert.equal(p.doc.activeElement.dataset.domain,'Project Governance');
  const target=[...p.doc.querySelectorAll('#listView .childItem')].find(b=>b.textContent.includes('Treasury'));assert.ok(target);target.click();
  assert.equal(p.doc.getElementById('searchBox').value,'');assert.equal(p.doc.activeElement.textContent,'HM Treasury Optimism Bias Guidance');assert.equal(p.doc.getElementById('btnR').getAttribute('aria-pressed'),'true');
  assert.ok([...p.doc.querySelectorAll('#domainFilters input')].every(i=>i.checked));
});
test('clear resets domains as promised; empty state and feed/library failures remain usable',async t=>{
  const p=await pageFixture(t,{fail:['library-apps']});assert.match(p.doc.getElementById('loadStatus').textContent,/Library examples/);
  p.doc.getElementById('noDomains').click();assert.match(p.doc.getElementById('listView').textContent,/No matching/);
  p.doc.getElementById('clearSelectionBtn').click();assert.equal(p.doc.querySelectorAll('#listView .item').length,13);
  p.doc.getElementById('btnR').click();assert.ok(p.doc.getElementById('listView').textContent.includes('special'));
  assert.equal(p.doc.getElementById('toggleGraph').disabled,true);
});
test('all help dialogs close by backdrop/Escape and restore focus to the opener',async t=>{
  const p=await pageFixture(t);
  for(const [opener,id] of [['whatBtn','whatModal'],['howToBtn','howToModal'],['moreInfoBtn','moreInfoModal']]){p.doc.getElementById(opener).click();const modal=p.doc.getElementById(id);assert.equal(modal.hidden,false);assert.equal(p.doc.activeElement,modal.querySelector('button'));modal.click();assert.equal(modal.hidden,true);assert.equal(p.doc.activeElement.id,opener);}
  p.doc.getElementById('whatBtn').click();p.doc.activeElement.dispatchEvent(new p.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(p.doc.getElementById('whatModal').hidden,true);
});
test('actual D3 graph filters, keyboard selection and simulation cleanup follow the page controls',async t=>{
  const p=await pageFixture(t,{d3:true});p.doc.getElementById('toggleGraph').click();assert.ok(p.doc.querySelectorAll('.node-group').length>54);
  p.input('Quantitative Risk Analysis Techniques');assert.equal(p.doc.querySelectorAll('.node-group').length,1);const node=p.doc.querySelector('.node-group');assert.equal(node.dataset.id,'C22');
  node.dispatchEvent(new p.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.match(p.doc.getElementById('graphSelection').textContent,/Monte/);
  p.doc.getElementById('noDomains').click();assert.equal(p.doc.querySelectorAll('.node-group').length,0);assert.match(p.doc.getElementById('graphSvg').textContent,/No matching/);
  p.doc.getElementById('clearSelectionBtn').click();assert.ok(p.doc.querySelectorAll('.node-group').length>54);assert.equal(p.counts().starts-p.counts().stops,1);
  p.doc.getElementById('toggleGraph').click();assert.equal(p.counts().starts,p.counts().stops);
});

test('actual maintained aliases suppress stale Gap Map wrappers and retired rows without hiding other apps',()=>{
  const library=JSON.parse(read('assets/data/library-apps.json')),specialist=JSON.parse(read('assets/data/specialist-apps.json')),retired=JSON.parse(read('assets/data/retired-apps.json'));
  const old=[{repo:'Project-web-apps',name:'pm_gap_map'},{repo:'Project-web-apps',name:'gap_map_gemini'},{repo:'Project-web-apps',name:'3D_Construction_Workflow'},{repo:'Project-web-apps',name:'still-here',tags:'risk'}];
  const merged=M.mergeApps([library,specialist,old],retired);
  for(const name of ['pm_gap_map','gap_map_gemini','3D_Construction_Workflow'])assert.ok(!merged.some(a=>a.name===name),name);
  assert.ok(merged.some(a=>a.name==='still-here'));
  assert.equal(new Set(merged.map(a=>M.canonicalURL(a.url))).size,merged.length);
});

test('untrusted catalogue property names cannot access inherited mapping objects',()=>{
  const names=['__proto__','constructor','toString'];
  const d=M.integrateApps(base,names.map(name=>({name,url:'/example/'+name,tags:'risk, __proto__, constructor, toString'})));
  for(const name of names){const resource=d.resources.find(r=>r.title===name);assert.ok(resource);assert.deepEqual(resource.linkedCapabilities,['C22']);}
});
test('malformed retirement rows fail only their feed; stale conflicts preserve higher-priority homes',async()=>{
  const ordinary=feedFetcher();
  const result=await M.loadCatalogues(async url=>url.includes('retired')?{ok:true,json:async()=>[null]}:ordinary(url));
  assert.deepEqual(result.failures,['Retirement list']);assert.ok(result.apps.some(a=>a.name==='special'));assert.ok(result.apps.some(a=>a.name==='special'));
  assert.doesNotThrow(()=>M.mergeApps([[{name:'A',url:'/one/'}]],[null,{},23]));
  const homes=M.mergeApps([[{name:'A',url:'/one/'},{name:'B',url:'/two/'}],[{name:'A',url:'/two/'}]]);
  assert.deepEqual(homes.map(a=>[a.name,a.url]),[['A','/one/'],['B','/two/']]);
});

 test('Wider interest toys are not promoted as project capability resources',()=>{const rows=M.mergeApps([[{repo:'Project-web-apps',name:'HS2-elite',url:'/wider-interest/hs2-elite/',home:'Wider interest',tags:'learning'},{repo:'Project-web-apps',name:'retained',url:'/library/apps/retained/',home:'Library'}]]);assert.deepEqual(rows.map(x=>x.name),['retained']);});
