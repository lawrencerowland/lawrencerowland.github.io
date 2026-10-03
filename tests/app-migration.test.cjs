'use strict';
// Dependency-free integration harness: run the actual catalogue script and
// DOMContentLoaded/fetch pipeline against pinned before/after source CSVs.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const page=fs.readFileSync(process.argv[2]||path.join(root,'all-project-apps.md'),'utf8');
const script=[...page.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).find(s=>s.includes('function loadData()'));
assert.ok(script,'the actual page has its catalogue loader');
if(process.argv[2])assert.ok(!page.includes('{%')&&!page.includes('{{'),'Liquid has rendered');
const specialists=JSON.parse(fs.readFileSync(path.join(root,'assets/data/specialist-apps.json'),'utf8'));
const retired=JSON.parse(fs.readFileSync(path.join(root,'assets/data/retired-apps.json'),'utf8'));
const expected={
 'advanced_project_planning_ideas':'meta-project-innovation/',
 'hazard_morphospace':'library/apps/waste-route-capacity/#state-space',
 'project_time_exchange_explainer':'library/apps/project-time-exchange/#explainer',
 'what_AI_model_for_what':'library/apps/capabilities-wiring-diag/',
 'idea-notebook':'project_innovation_app/webapp/index.html',
 'pm_gap_map':'gap-map.html',
 'gap_map_gemini':'gap-map.html',
 'Graph to sharp':'library/apps/project-graph-views/',
 'grounded-theory-colimit':'functors-for_projects/apps/grounded-theory-colimit/',
 'Project_Decision_Framing_Tool':'Programme-decision-sequences/apps/project-framing/',
 'climate-sequential-decision-paths':'Programme-decision-sequences/apps/climate-decision-paths/',
 'tangled_triangle_conceptual_plan_section':'local-to-global/tangled-triangle/tangled_triangle_conceptual_plan_section.html',
 'regional-signalling-control-centre':'local-to-global/tangled-triangle/regional-signalling-control-centre.html',
 'regional-signalling-control-centre-site-geometry-topology':'local-to-global/tangled-triangle/regional-signalling-control-centre-site-geometry-topology.html',
 'tangled-triangle-concept-geometry-sketch-plan-section':'local-to-global/tangled-triangle/tangled-triangle-concept-geometry-sketch-plan-section.html',
 'regional-signalling-control-centre-architecture-v0':'local-to-global/tangled-triangle/regional-signalling-control-centre-architecture-v0.html',
 'interface_topology_sketch_v0':'local-to-global/tangled-triangle/interface_topology_sketch_v0.html',
 'climate_megaproject_sdam':'Programme-decision-sequences/apps/climate-sdam-report/',
 'Sequential decisions':'Programme-decision-sequences/apps/climate-policy-simulator/',
 'IT-project-seq-decisions':'Programme-decision-sequences/apps/it-decision-tutorial/',
 'Another-IT-project-simulation':'Programme-decision-sequences/apps/weekly-it-project-game/',
 'tag-concurrence-explorer':'Tag_Concurrence_Graph/app_catalogue.html',
 'decision-tree':'examples/decision-tree.html',
 'project-risk-gradient':'Project-web-apps/web_apps/project-risk-gradient.html',
 'frobenius-dsm-explorer':'Project-web-apps/web_apps/frobenius-dsm-explorer.html',
 'social-debt-explorer':'more-project-apps/web_apps/social-debt-explorer.html'
};
Object.assign(expected,{"dico_module_map_d3": "Solway_tunnel_ontology/apps/digital-construction-ontology/#modules", "tokyo_stadium_dicon_graph": "Solway_tunnel_ontology/apps/digital-construction-ontology/#tokyo", "hs2_stakeholders_network": "Solway_tunnel_ontology/apps/digital-construction-ontology/#hs2", "hs2-decision-graph": "library/apps/project-decision-graph/", "lower_thames_crossing_geo_kg": "library/apps/crossing-project-map/", "project_viability_state_space_navigator_plus": "library/apps/project-viability-navigator/", "grounded-theory-approach": "library/apps/reading-project-evidence/#coding", "legends_tower_sentiment_report": "library/apps/reading-project-evidence/#stance"});
Object.assign(expected,{'interactive-nec-contract-journey':'library/apps/project-contract-lab/#nec','hs2-contract-game':'library/apps/project-contract-lab/#bargaining','regulatory-negotiation-rehearsal-board':'library/apps/regulatory-rehearsal/'});
const migratedLibrary=JSON.parse(fs.readFileSync(path.join(root,'_data/library_apps.json'),'utf8'));
for(const app of migratedLibrary)expected[app.original_name||app.id] ||= app.url.slice(1);
assert.equal(specialists.length,77);
assert.equal(new Set(specialists.map(x=>x.repo+':'+x.name)).size,77);
assert.equal(new Set(specialists.map(x=>x.url.split('#')[0])).size,67,'distinct maintained routes');
assert.equal(new Set(specialists.map(x=>x.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'))).size,76,'unambiguous legacy query identities');
assert.deepEqual(new Set(specialists.map(x=>x.name)),new Set(Object.keys(expected)));
assert.equal(specialists.filter(x=>x.name==='project-controls-knowledge-graph').length,2,'two original source identities now share the consolidated graph');
for(const row of specialists){
 assert.equal(row.url,'https://lawrencerowland.github.io/'+expected[row.name],row.name+' links directly to its new home');
 assert.ok(row.home&&row.description&&row.tags,'complete specialist metadata');
 assert.ok(!row.image,'moved rows intentionally have no speculative thumbnail');
}
const fixtures=path.join(__dirname,'fixtures/app-migration');
const fixtureMeta=JSON.parse(fs.readFileSync(path.join(fixtures,'provenance.json'),'utf8'));
const csv=(repo,phase)=>fs.readFileSync(path.join(fixtures,repo+'-'+(repo==='React_proj-apps'&&phase.startsWith('current-')?'after':phase)+'.csv'),'utf8');
const slug=name=>name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
const rowNames=text=>text.split(/\r?\n/).slice(1).filter(line=>line.trim()).map(line=>line.split(',')[1]);
const cleanupNames=fixtureMeta.current_cleanup['Project-web-apps'].removed_names;
const beforeCleanup=csv('Project-web-apps','current-before');
const afterCleanup=csv('Project-web-apps','current-after');
assert.equal(rowNames(beforeCleanup).length,65);
assert.equal(rowNames(afterCleanup).length,61);
assert.equal(afterCleanup,beforeCleanup.split(/(?<=\n)/).filter(line=>!cleanupNames.includes(line.split(',')[1])).join(''),'current cleanup removes only the four approved records; every unrelated byte stays unchanged');
const migration=fixtureMeta.library_migration;
const libraryBefore=csv('Project-web-apps','library-before'),libraryAfter=csv('Project-web-apps','library-after');
assert.equal(rowNames(libraryBefore).length,60);assert.equal(rowNames(libraryAfter).length,50);
assert.equal(libraryAfter,libraryBefore.split(/(?<=\n)/).filter(line=>!migration.removed_names.includes(line.split(',')[1])).join(''),'the ten selected rows alone are removed; all unrelated source bytes survive');
const eightMigration=fixtureMeta.eight_migration;
const eightBefore=csv('Project-web-apps','eight-before'),eightAfter=csv('Project-web-apps','eight-after');
assert.equal(rowNames(eightBefore).length,50);assert.equal(rowNames(eightAfter).length,42);
assert.equal(eightAfter,eightBefore.split(/(?<=\n)/).filter(line=>!eightMigration.removed_names.includes(line.split(',')[1])).join(''),'only the eight selected rows are retired, with every unrelated source byte retained');
const stepOne=fixtureMeta.step_one;
const stepBefore=csv('Project-web-apps','step-one-before'),stepAfter=csv('Project-web-apps','step-one-after');
assert.equal(rowNames(stepBefore).length,42);assert.equal(rowNames(stepAfter).length,34);
assert.equal(stepAfter,stepBefore.split(/(?<=\n)/).filter(line=>!stepOne.removed_names.includes(line.split(',')[1])).join(''),'only the eight approved rows are removed');
const descendants=node=>node.children.flatMap(child=>[child,...descendants(child)]);
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.style={};this.className='';this.listeners={};this.scrolled=0;this._html='';}
 appendChild(child){this.children.push(child);return child;}
 addEventListener(type,fn){this.listeners[type]=fn;}
 set innerHTML(value){this._html=value;this.children=[];}
 get innerHTML(){return this._html;}
 get classList(){const node=this;const tokens=()=>new Set(node.className.split(/\s+/).filter(Boolean));return{
  contains:t=>tokens().has(t),add(t){const s=tokens();s.add(t);node.className=[...s].join(' ');},remove(t){node.className=[...tokens()].filter(x=>x!==t).join(' ');},toggle(t,force){const next=force===undefined?!tokens().has(t):force;this[next?'add':'remove'](t);return next;}
 };}
 scrollIntoView(options){this.scrolled++;this.scrollOptions=options;}
}
async function load(phase,query='',hash=''){
 const ids=['app-container','filter-container','heatmap-container','tag-cloud','moved-app-notice'],elements=Object.fromEntries(ids.map(id=>{const node=new Element('div');node.id=id;node.hidden=id==='moved-app-notice';return[id,node];}));
 const events={},requests=[];
 const all=()=>Object.values(elements).flatMap(node=>[node,...descendants(node)]);
 const document={
  createElement:tag=>new Element(tag),getElementById:id=>all().find(node=>node.id===id),
  addEventListener:(type,fn)=>events[type]=fn,
  querySelectorAll:selector=>selector==='.example-card'?elements['app-container'].children.filter(n=>n.classList.contains('example-card')):selector==='#filter-container button'?elements['filter-container'].children:selector==='#tag-cloud button'?elements['tag-cloud'].children:(()=>{throw Error('Unimplemented selector: '+selector);})()
 };
 const fetch=async url=>{requests.push(url);if(url.startsWith('/Project-web-apps/app-index.csv?'))return{ok:true,text:async()=>csv('Project-web-apps',phase)};if(url.startsWith('/React_proj-apps/app-index.csv?'))return{ok:true,text:async()=>csv('React_proj-apps',phase)};if(url==='/assets/data/retired-apps.json')return{ok:true,json:async()=>retired};if(url==='/assets/data/specialist-apps.json')return{ok:true,json:async()=>JSON.parse(JSON.stringify(specialists))};throw Error('Unexpected request '+url);};
 const context={document,fetch,window:{location:{search:query,hash}},URL,URLSearchParams,console};vm.createContext(context);vm.runInContext(script,context);
 assert.equal(typeof events.DOMContentLoaded,'function');events.DOMContentLoaded();await new Promise(setImmediate);
 assert.equal(requests.length,3,'the surviving general catalogue, named destinations and explicit retirements were fetched');
 assert.ok(requests.every(url=>!url.includes('/React_proj-apps/')),'retired repository is no longer a live data dependency');
 const cards=elements['app-container'].children;
 const expectedNames=['Project-web-apps'].flatMap(repo=>rowNames(csv(repo,phase)).filter(name=>![...specialists,...retired].some(item=>item.repo===repo&&item.name===name)));
 assert.equal(cards.length,expectedNames.length,'only general catalogue rows remain');
 assert.deepEqual(cards.map(card=>card.id).sort(),expectedNames.map(name=>'app-'+slug(name)).sort(),'every unrelated source row is still rendered');
 for(const name of Object.keys(expected)){
  if(!expectedNames.includes(name))assert.ok(!cards.some(c=>c.id==='app-'+slug(name)),phase+': '+name+' is absent from ordinary cards');
 }
 assert.ok(elements['filter-container'].children.length>1,'category controls rendered');assert.ok(elements['heatmap-container'].children.length>1,'heatmap rendered');assert.ok(elements['tag-cloud'].children.length>1,'tags rendered');
 return {cards,context,elements};
}
(async()=>{
 for(const phase of ['before','after','current-before','current-after','library-before','library-after','eight-before','eight-after','step-one-before','step-one-after','phase-two-before','phase-two-after','phase-three-before','phase-three-after','phase-four-before','phase-four-after']){
  const result=await load(phase);assert.equal(result.cards.filter(c=>c.classList.contains('highlight')).length,0);
  assert.equal(result.elements['moved-app-notice'].hidden,true,'ordinary browsing does not show a moved-app notice');
  result.context.filterCards('risk_management');assert.ok(result.cards.some(c=>c.style.display==='block'));assert.ok(result.cards.some(c=>c.style.display==='none'));
  result.context.filterCards('all');assert.ok(result.cards.every(c=>c.style.display==='block'));
  for(const [name,destination] of Object.entries(expected)){
   for(const [extra,hash] of [['',''],['&view=details&value=two%20words&repeat=1&repeat=2&encoded=%2523%26%3D','#section%2F2']]){
    const result=await load(phase,'?app='+encodeURIComponent(slug(name))+extra,hash);
    assert.equal(result.cards.filter(c=>c.classList.contains('highlight')).length,0,'moved app is not restored as a card');
    const notice=result.elements['moved-app-notice'],content=descendants(notice),links=content.filter(node=>node.tagName==='a');
    assert.equal(notice.hidden,false,'an exact old query exposes its destination');assert.equal(notice.scrolled,1);
    assert.equal(links.length,1);assert.ok(links[0].textContent,'destination link remains understandable');
    const target=new URL(links[0].href);
    const expectedTarget=new URL('https://lawrencerowland.github.io/'+destination);
    assert.equal(target.origin+target.pathname,expectedTarget.origin+expectedTarget.pathname);
    assert.deepEqual([...target.searchParams],[...new URLSearchParams(extra.replace(/^&/,''))],'other parameters, including repeated and encoded values, reach the app');
    assert.equal(target.hash,hash||expectedTarget.hash,'incoming fragment survives or the intended section is used');
    assert.ok(content.some(node=>node.tagName==='p'&&node.textContent.includes(specialists.find(item=>item.name===name).home)));
   }
  }
  const retiredResult=await load(phase,'?app=3d-construction-workflow');
  assert.equal(retiredResult.elements['moved-app-notice'].hidden,false);
  assert.ok(descendants(retiredResult.elements['moved-app-notice']).some(n=>n.textContent?.includes('did not model')));
  assert.equal(descendants(retiredResult.elements['moved-app-notice']).filter(n=>n.tagName==='a').length,0,'retirement does not invent an equivalent destination');
  const ordinary=await load(phase,'?app=door-moisture-model');
  const highlighted=ordinary.cards.filter(card=>card.classList.contains('highlight'));
  assert.equal(highlighted.length,1);assert.equal(highlighted[0].id,'app-door-moisture-model');assert.equal(highlighted[0].scrolled,1,'unmoved app query still highlights its card');
  assert.equal(ordinary.elements['moved-app-notice'].hidden,true);
 }
 for(const query of ['?app=does-not-exist','?app=decision-tree-extra','?app=https://example.org/','?app=%3Cscript%3E']){
  const absent=await load('current-after',query);assert.ok(absent.cards.every(c=>!c.classList.contains('highlight')));assert.equal(absent.elements['moved-app-notice'].hidden,true,'unknown selectors never become destination links');
 }
 console.log('PASS: 77 original app identities and one retirement absent from ordinary cards across sixteen source states; exact-query destination journeys preserve app state; unrelated rows, ordinary query highlights, filters, heatmap and tags retained'+(process.argv[2]?'; rendered Jekyll page.':'.'));
})().catch(error=>{console.error(error);process.exitCode=1;});
