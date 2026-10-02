'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),site=process.argv[2]?path.resolve(process.argv[2]):root;
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const all=JSON.parse(read('_data/library_apps.json')),apps=all.filter(app=>app.source_revision==='9d9c253f9c203441be1fd301bcb9a6b976b85d4f');
const expected={
 'p3m-capability-review':['p3m-capability-tool','capabilities-and-futures'],
 'concept-triad-builder':['interactive-concept-map','decisions-and-trade-offs'],
 'wbs-rewriter':['WBS_rewrite','delivery-dynamics'],
 'date-defence-kit':['date-defence-kit','delivery-dynamics'],
 'interface-maturity':['interface_maturity_simulator','delivery-dynamics'],
 'intent-field-navigator':['intent_field_navigator','decisions-and-trade-offs'],
 'governance-trio':['governance-trio-replay-rules-lineage','data-and-assurance'],
 'probecrafter':['probecrafter','capabilities-and-futures']
};
assert.equal(all.length,34);assert.equal(apps.length,8);assert.deepEqual(new Set(apps.map(a=>a.id)),new Set(Object.keys(expected)));
const manifest=JSON.parse(read('assets/data/library-apps.json')),specialists=JSON.parse(read('assets/data/specialist-apps.json'));
for(const app of apps){
 assert.equal(app.original_name,expected[app.id][0]);assert.equal(app.theme,expected[app.id][1]);
 assert.equal(app.original_path,'web_apps/'+app.original_name+'.html');assert.equal(app.source_repository,'Project-web-apps');
 assert.equal(app.source_revision,'9d9c253f9c203441be1fd301bcb9a6b976b85d4f');assert.match(app.source_sha256,/^[a-f0-9]{64}$/);
 assert.ok(app.source_files[app.original_path]===app.source_sha256);
 for (const hash of Object.values(app.source_files)) assert.match(hash,/^[a-f0-9]{64}$/);
 assert.equal(app.url,'/library/apps/'+app.id+'/');assert.ok(app.description&&app.try_this&&app.limitation&&app.reviewed);
 assert.equal(app.source_url,'https://github.com/lawrencerowland/lawrencerowland.github.io/tree/master/library/apps/'+app.id);
 assert.ok(fs.statSync(path.join(site,app.image)).size>1000,app.id+': a real pictured entrance');
 const html=fs.readFileSync(path.join(site,app.url,'index.html'),'utf8');
 assert.match(html,/<h1\b/);assert.match(html,/<noscript>/);assert.ok(html.includes('https://lawrencerowland.github.io'+app.url));
 assert.ok(html.includes('/library/methods/'+app.theme+'.html'));assert.ok(!html.includes('Back to Card Index'));
 assert.ok(!/【\d+†/.test(html),'unresolved citation markers are gone');
 for(const reference of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)){
  const href=reference[1];if(/^[a-z]+:|^\/\//.test(href))continue;
  const target=href.startsWith('/')?path.join(site,href):path.resolve(site,app.url.slice(1),href);
  if(href.startsWith('/')&&!process.argv[2])continue;
  assert.ok(fs.existsSync(target),app.id+': local dependency or route exists '+href);
 }
 for(const list of [manifest,specialists]){
  const matches=list.filter(x=>x.repo==='Project-web-apps'&&x.name===app.original_name);assert.equal(matches.length,1);
  assert.equal(matches[0].url,'https://lawrencerowland.github.io'+app.url);assert.ok(matches[0].home.startsWith('Library'));
 }
 if(process.argv[2]){
  const page=fs.readFileSync(path.join(site,'library/methods/'+app.theme+'.html'),'utf8');
  assert.equal((page.match(new RegExp('id="'+app.id+'"','g'))||[]).length,1);assert.ok(page.includes(app.source_url));
 }
}
// Actual Gap Map loader: a stale source catalogue must not resurrect moved copies.
const gap=read('gap-map.md');const loader=gap.slice(gap.indexOf('function loadResourcesData(){'),gap.indexOf('\nlet currentCats='));
const vm=require('node:vm');let received;
const sampleOld=[{name:'probecrafter'},{name:'door-moisture-model'}];const maintained=manifest.filter(a=>a.name==='probecrafter');
const context={fetch:async url=>url.includes('app-index.csv')?{text:async()=>''}:{ok:true,json:async()=>maintained},parseCSV:()=>sampleOld,integrateApps:apps=>received=apps,assignAppCapabilities(){},buildDomainFilters(){},renderList(){},graphVisible:false,Date,Set};
vm.runInNewContext(loader,context);
context.loadResourcesData().then(()=>{assert.equal(received.filter(a=>a.name==='probecrafter').length,1);assert.equal(received.find(a=>a.name==='probecrafter').url,maintained[0].url);assert.ok(received.some(a=>a.name==='door-moisture-model'));console.log('PASS: eight source identities, correct subjects, provenance, local dependencies, picture/source routes and stale-catalogue deduplication'+(process.argv[2]?'; exact built site.':'.'));}).catch(error=>{console.error(error);process.exitCode=1});
