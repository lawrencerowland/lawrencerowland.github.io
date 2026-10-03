'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('../tools/library-apps/node_modules/jsdom');
const root=path.resolve(__dirname,'..'),page=fs.readFileSync(process.argv[2]||path.join(root,'all-project-apps.md'),'utf8');
const specialists=JSON.parse(fs.readFileSync(path.join(root,'assets/data/specialist-apps.json'),'utf8')),retired=JSON.parse(fs.readFileSync(path.join(root,'assets/data/retired-apps.json'),'utf8'));
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
 'project-risk-gradient':'library/apps/project-risk-gradient/',
 'frobenius-dsm-explorer':'library/apps/frobenius-dsm-explorer/',
 'social-debt-explorer':'library/apps/social-debt-explorer/'
};
Object.assign(expected,{"dico_module_map_d3": "Solway_tunnel_ontology/apps/digital-construction-ontology/#modules", "tokyo_stadium_dicon_graph": "Solway_tunnel_ontology/apps/digital-construction-ontology/#tokyo", "hs2_stakeholders_network": "Solway_tunnel_ontology/apps/digital-construction-ontology/#hs2", "hs2-decision-graph": "library/apps/project-decision-graph/", "lower_thames_crossing_geo_kg": "library/apps/crossing-project-map/", "project_viability_state_space_navigator_plus": "library/apps/project-viability-navigator/", "grounded-theory-approach": "library/apps/reading-project-evidence/#coding", "legends_tower_sentiment_report": "library/apps/reading-project-evidence/#stance"});
Object.assign(expected,{"pm_causal_playground": "counterfactuals/#paths", "counterfactual_programme_steering": "counterfactuals/#policies", "SMR_governance_simulator": "library/apps/signed-feedback-lab/", "project-dependency-atlas": "library/apps/project-dependency-atlas/"});
Object.assign(expected,{'interactive-nec-contract-journey':'library/apps/project-contract-lab/#nec','hs2-contract-game':'library/apps/project-contract-lab/#bargaining','regulatory-negotiation-rehearsal-board':'library/apps/regulatory-rehearsal/'});
Object.assign(expected,{'living-graph-transform-system':'library/apps/graph-transform-workbench/','portfolio_loom':'library/apps/portfolio-scenario-loom/','Project_Health_Atlas':'library/apps/project-health-and-benefits/#gaps','regulatory-benefits-pmo':'library/apps/project-health-and-benefits/#benefits'});
Object.assign(expected,{"AI_timeline_from_Gemini_25": "library/apps/market_timeline_explorer/#gemini", "project-services-navigator": "library/apps/market_timeline_explorer/#navigator", "consulting_catalogue": "library/apps/project-services-guide/#offers", "project_use_case_tree": "library/apps/project-services-guide/#questions", "concurrent_change_levels_amazon": "library/apps/change-coordination/", "Project_Controls_2010-2025_Transformation": "library/apps/pm-software-evolution/#controls-transformation"});
const migratedLibrary=JSON.parse(fs.readFileSync(path.join(root,'_data/library_apps.json'),'utf8'));
for(const app of migratedLibrary)expected[app.original_name||app.id] ||= app.url.slice(1);
Object.assign(expected,{'door-moisture-model':'wider-interest/door-moisture-model/','project-management-pong':'wider-interest/project-management-pong/','HS2-elite':'wider-interest/hs2-elite/','assurance_bundle_prototype':'library/apps/governance-trio/#assurance-records'});
Object.assign(expected,{"simplicial_project_mgmt": "functors-for_projects/apps/simplicial-project-management/", "animal_crossing_codesign": "project-co-design/apps/wildlife-crossing.html", "monotone-codesign-rail-transit": "project-co-design/apps/transit-tradeoffs.html", "monotone_codesign_rail": "project-co-design/apps/rail-simulator.html", "monotone_codesign_rail_upgrade": "project-co-design/apps/incremental-upgrade.html", "rail-staged-codesign": "project-co-design/apps/staged-paths.html"});
assert.equal(specialists.length,101);
assert.equal(new Set(specialists.map(x=>x.repo+':'+x.name)).size,101);
assert.equal(new Set(specialists.map(x=>x.url.split('#')[0])).size,84,'distinct maintained routes');
assert.equal(new Set(specialists.map(x=>x.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'))).size,100,'unambiguous legacy query identities');
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


const script=[...page.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).find(s=>s.includes('function loadData()'));
assert.ok(script);assert.ok(!page.includes('/Project-web-apps/app-index.csv'));assert.ok(!page.includes('heatmap-container'));
async function check(name,extra='',hash='',failure=false){
 const dom=new JSDOM('<p id="moved-app-notice"></p>',{url:'https://lawrencerowland.github.io/all-project-apps.html'+(name?'?app='+encodeURIComponent(name)+extra:'' )+hash,runScripts:'outside-only'}),w=dom.window,requests=[];
 w.fetch=async url=>{requests.push(url);if(failure)throw Error('offline');return {ok:true,json:async()=>url.includes('specialist')?specialists:retired};};
 w.eval(script);await new Promise(resolve=>setTimeout(resolve,0));
 return {dom,w,requests,notice:w.document.getElementById('moved-app-notice')};
}
(async()=>{
 for(const record of specialists){for(const [extra,hash] of [['',''],['&view=details&value=two%20words&repeat=1&repeat=2&encoded=%2523%26%3D','#section%2F2']]){
  const name=record.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const r=await check(name,extra,hash);const link=r.notice.querySelector('a');assert.ok(link,record.name);
  const target=new URL(record.url);target.search=new URLSearchParams(extra.replace(/^&/,'')).toString();if(hash)target.hash=hash;
  assert.equal(link.href,target.href,record.name+': query and fragment survive');assert.equal(r.requests.length,2);assert.ok(r.notice.textContent.includes(record.home));r.dom.window.close();
 }}
 for(const n of ['does-not-exist','decision-tree-extra','https://example.org/','<script>']){const r=await check(n);assert.equal(r.notice.querySelector('a'),null);assert.match(r.notice.textContent,/No saved app matches/);r.dom.window.close();}
 const ordinary=await check('');assert.equal(ordinary.requests.length,0);ordinary.dom.window.close();
 const retiredResult=await check('3d-construction-workflow');assert.match(retiredResult.notice.textContent,/did not model/);assert.equal(retiredResult.notice.querySelector('a'),null);retiredResult.dom.window.close();
 const failed=await check('door-moisture-model','','',true);assert.match(failed.notice.textContent,/could not load/);failed.dom.window.close();
 console.log('PASS: every maintained app selector resolves with state preserved; historical retirement accounting, unknown selectors, no-selector and offline recovery; no retired CSV dependency.');
})().catch(error=>{console.error(error);process.exitCode=1});
