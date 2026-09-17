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
const expected={
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
 'tag-concurrence-explorer':'Tag_Concurrence_Graph/app_catalogue.html'
};
assert.equal(specialists.length,14);
assert.equal(new Set(specialists.map(x=>x.repo+':'+x.name)).size,14);
assert.equal(new Set(specialists.map(x=>x.url)).size,14,'distinct specialist routes');
assert.deepEqual(new Set(specialists.map(x=>x.name)),new Set(Object.keys(expected)));
for(const row of specialists){
 assert.equal(row.url,'https://lawrencerowland.github.io/'+expected[row.name],row.name+' links directly to its new home');
 assert.ok(row.home&&row.description&&row.tags,'complete specialist metadata');
 assert.ok(!row.image,'moved rows intentionally have no speculative thumbnail');
}
const fixtures=path.join(__dirname,'fixtures/app-migration');
const fixtureMeta=JSON.parse(fs.readFileSync(path.join(fixtures,'provenance.json'),'utf8'));
const csv=(repo,phase)=>fs.readFileSync(path.join(fixtures,repo+'-'+phase+'.csv'),'utf8');
const slug=name=>name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
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
async function load(phase,query=''){
 const ids=['app-container','filter-container','heatmap-container','tag-cloud'],elements=Object.fromEntries(ids.map(id=>{const node=new Element('div');node.id=id;return[id,node];}));
 const events={},requests=[];
 const all=()=>Object.values(elements).flatMap(node=>[node,...descendants(node)]);
 const document={
  createElement:tag=>new Element(tag),getElementById:id=>all().find(node=>node.id===id),
  addEventListener:(type,fn)=>events[type]=fn,
  querySelectorAll:selector=>selector==='.example-card'?elements['app-container'].children.filter(n=>n.classList.contains('example-card')):selector==='#filter-container button'?elements['filter-container'].children:selector==='#tag-cloud button'?elements['tag-cloud'].children:(()=>{throw Error('Unimplemented selector: '+selector);})()
 };
 const fetch=async url=>{requests.push(url);if(url.startsWith('/Project-web-apps/app-index.csv?'))return{ok:true,text:async()=>csv('Project-web-apps',phase)};if(url.startsWith('/React_proj-apps/app-index.csv?'))return{ok:true,text:async()=>csv('React_proj-apps',phase)};if(url==='/assets/data/specialist-apps.json')return{ok:true,json:async()=>JSON.parse(JSON.stringify(specialists))};throw Error('Unexpected request '+url);};
 const context={document,fetch,window:{location:{search:query}},URLSearchParams,console};vm.createContext(context);vm.runInContext(script,context);
 assert.equal(typeof events.DOMContentLoaded,'function');events.DOMContentLoaded();await new Promise(setImmediate);
 assert.equal(requests.length,3,'both general catalogues and specialists were fetched');
 const cards=elements['app-container'].children;
 const expectedCount=Object.values(fixtureMeta).reduce((n,row)=>n+row.after_rows,0)+14;
 assert.equal(cards.length,expectedCount,'unmoved rows remain and specialists are added exactly once');
 for(const [name,newPath] of Object.entries(expected)){
  const matches=cards.filter(c=>c.id==='app-'+slug(name));assert.equal(matches.length,1,phase+': '+name+' appears once');
  const content=descendants(matches[0]);assert.equal(content.filter(n=>n.tagName==='a').length,1);
  assert.equal(content.find(n=>n.tagName==='a').href,'https://lawrencerowland.github.io/'+newPath);
  assert.equal(content.filter(n=>n.tagName==='img').length,0,'moved card has no broken legacy image: '+name);
  assert.ok(content.some(n=>n.tagName==='p'&&n.textContent==='Home: '+specialists.find(x=>x.name===name).home));
 }
 assert.ok(elements['filter-container'].children.length>1,'category controls rendered');assert.ok(elements['heatmap-container'].children.length>1,'heatmap rendered');assert.ok(elements['tag-cloud'].children.length>1,'tags rendered');
 return {cards,context,elements};
}
(async()=>{
 for(const phase of ['before','after']){
  const result=await load(phase);assert.equal(result.cards.filter(c=>c.classList.contains('highlight')).length,0);
  result.context.filterCards('risk_management');assert.ok(result.cards.some(c=>c.style.display==='block'));assert.ok(result.cards.some(c=>c.style.display==='none'));
  result.context.filterCards('all');assert.ok(result.cards.every(c=>c.style.display==='block'));
  for(const name of Object.keys(expected)){
   const result=await load(phase,'?app='+encodeURIComponent(slug(name))),highlighted=result.cards.filter(c=>c.classList.contains('highlight'));
   assert.equal(highlighted.length,1,'one deep-linked highlight');assert.equal(highlighted[0].id,'app-'+slug(name));assert.equal(highlighted[0].scrolled,1,'deep link scrolls after asynchronous render');
  }
 }
 const absent=await load('after','?app=does-not-exist');assert.ok(absent.cards.every(c=>!c.classList.contains('highlight')));
 console.log('PASS: 14 specialist apps exactly once before/after retirement; direct destination links; 28 deep-link journeys; no legacy images; existing filters/heatmap/tags retained'+(process.argv[2]?'; rendered Jekyll page.':'.'));
})().catch(error=>{console.error(error);process.exitCode=1;});
