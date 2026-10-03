'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),site=process.argv[2]?path.resolve(process.argv[2]):root;
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const all=JSON.parse(read('_data/library_apps.json')),apps=all.filter(app=>app.source_revision==='fa5a4a4819c8c5d25b413c7d1f3219aac2e81fc2');
const expected={
 'risk-matrix':['intro_risk_matrix','decisions-and-trade-offs'],
 'weighted-decision-matrix':['weighted-decision-matrix','decisions-and-trade-offs'],
 'eisenhower-matrix':['eisenhower-matrix','decisions-and-trade-offs'],
 'decision-latency':['decision-latency','delivery-dynamics'],
 'critical-path-spotter':['critical-path-spotter','delivery-dynamics'],
 'wbs-to-pbs':['hs2_WBS_to_PBS','states-and-relationships'],
 'project-data-standard':['Project_Data_standard_example','data-and-assurance'],
 'white-space-analysis':['white_space_analysis','capabilities-and-futures'],
 'service-trident':['service_trident','capabilities-and-futures'],
 'stakeholder-mapper':['stakeholder-mapper','states-and-relationships']
};
assert.equal(all.length,45);assert.equal(apps.length,10);assert.deepEqual(new Set(apps.map(a=>a.id)),new Set(Object.keys(expected)));
const manifest=JSON.parse(read('assets/data/library-apps.json')),specialists=JSON.parse(read('assets/data/specialist-apps.json'));
for(const app of apps){
 assert.equal(app.original_name,expected[app.id][0]);assert.equal(app.theme,expected[app.id][1]);
 assert.equal(app.original_path,'web_apps/'+app.original_name+'.html');assert.equal(app.source_repository,'Project-web-apps');
 assert.equal(app.source_revision,'fa5a4a4819c8c5d25b413c7d1f3219aac2e81fc2');assert.match(app.source_sha256,/^[a-f0-9]{64}$/);
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
// Exercise the actual shared catalogue loader against a stale source record.
const M=require('../assets/js/gap-map-model.js');
const old='name,description\nintro_risk_matrix,old\ndoor-moisture-model,residual\n';
M.loadCatalogues(async url=>({ok:true,text:async()=>old,json:async()=>url.includes('library-apps.json')?manifest.filter(a=>a.name==='intro_risk_matrix'):[]})).then(({apps:received})=>{
 assert.equal(received.filter(a=>a.name==='intro_risk_matrix').length,1);
 assert.equal(received.find(a=>a.name==='intro_risk_matrix').url,manifest.find(a=>a.name==='intro_risk_matrix').url);
 assert.ok(received.some(a=>a.name==='door-moisture-model'));
 console.log('PASS: ten retained app identities, subjects, source hashes, dependencies, pictures and current catalogue deduplication'+(process.argv[2]?'; exact built site.':'.'));
}).catch(error=>{console.error(error);process.exitCode=1});
