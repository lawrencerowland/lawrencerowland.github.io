'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM}=require('../tools/library-apps/node_modules/jsdom');
const root=path.resolve(__dirname,'..'),built=!!process.argv[2],site=built?path.resolve(process.argv[2]):root;
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const apps=json('_data/library_apps.json'),listing=json('assets/data/library-apps.json'),specialists=json('assets/data/specialist-apps.json'),materials=json('_data/library_materials.json');
const p=json('tests/fixtures/app-migration/provenance.json').phase_six,origin='https://lawrencerowland.github.io';
assert.equal(apps.length,52);assert.equal(listing.length,52);assert.equal(apps.length+materials.length,75);
assert.equal(new Set([...apps,...materials].map(x=>x.id)).size,75);
assert.ok(apps.some(x=>x.id==='contract-portfolio-board'));
assert.equal(p.base_revision,'7888f8a85aa9121e99190d392a622a4ee0cd4a7e');
const expected={
 'graph-transform-workbench':{theme:'states-and-relationships',names:['living-graph-transform-system']},
 'portfolio-scenario-loom':{theme:'capabilities-and-futures',names:['portfolio_loom']},
 'project-health-and-benefits':{theme:'data-and-assurance',names:['Project_Health_Atlas','regulatory-benefits-pmo']}
};
for(const [id,e] of Object.entries(expected)){
 const app=apps.find(x=>x.id===id);assert.ok(app,id);assert.equal(app.theme,e.theme);assert.equal(app.build,'static');assert.equal(app.source_revision,p.base_revision);assert.deepEqual(app.source_files,p.source_files[id]);
 assert.deepEqual(app.original_names,e.names);
 for(const field of ['title','description','try_this','limitation','image_alt','source_url'])assert.ok(app[field]?.trim(),id+': '+field);
 assert.equal(listing.filter(x=>e.names.includes(x.name)).length,1,'one discovery entry for the home, including a combined home');
 const folder=path.join(site,app.url),html=fs.readFileSync(path.join(folder,'index.html'),'utf8');
 const d=new JSDOM(html,{url:origin+app.url}).window.document;
 assert.ok(d.querySelector('h1'));assert.ok(d.querySelector('noscript'));
 assert.equal(d.querySelector('link[rel=canonical]')?.href,origin+app.url);
 assert.ok([...d.querySelectorAll('a')].some(a=>a.pathname==='/library/methods/'+e.theme+'.html'),id+': own subject return');
 const pic=fs.readFileSync(path.join(site,app.image),'utf8');assert.match(pic,/<svg\b/);assert.ok(pic.length>500);
 for(const node of d.querySelectorAll('script[src],link[rel=stylesheet],img[src],a[href]')){
  const raw=node.getAttribute('src')||node.getAttribute('href');if(!raw||raw.startsWith('#')||raw.startsWith('data:'))continue;
  const u=new URL(raw,origin+app.url);
  if(u.origin!==origin){assert.notEqual(node.tagName,'SCRIPT','local runtime dependency');continue;}
  if(!u.pathname.startsWith(app.url)&&!built)continue;
  // Separate project sites are served by their own repositories.
  if(!u.pathname.startsWith(app.url)&&!u.pathname.startsWith('/library/')&&!['/side-projects.html','/counterfactuals/'].includes(u.pathname))continue;
  assert.ok(fs.existsSync(path.join(site,u.pathname,u.pathname.endsWith('/')?'index.html':'')),id+': '+raw);
 }
 const readme=read(app.url.slice(1)+'README.md');assert.ok(readme.includes(p.base_revision),'pinned source');
 for(const name of e.names){
  const records=specialists.filter(x=>x.repo==='Project-web-apps'&&x.name===name);assert.equal(records.length,1);
  assert.equal(records[0].url,p.destinations[name]);
  const u=new URL(records[0].url);assert.equal(u.pathname,app.url);if(u.hash)assert.ok(d.getElementById(u.hash.slice(1)),name+': preserved named mode');
 }
 if(built){
  const subject=fs.readFileSync(path.join(site,'library/methods/'+e.theme+'.html'),'utf8');
  assert.equal(subject.split('id="'+id+'"').length-1,1);assert.ok(subject.includes(app.image));
 }
}
// Maintained support assets: only misleading whole-line comments change in three Graphviz examples.
assert.equal(Object.keys(p.maintained_support_files).length,9);
const crypto=require('node:crypto');
for(const [source,entry] of Object.entries(p.maintained_support_files)){
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(site,entry.path))).digest('hex'),entry.sha256,source);
 assert.ok(['exact copy','comment-only correction'].includes(entry.change));
 if(entry.change==='exact copy')assert.equal(entry.sha256,Object.values(p.source_files).map(x=>x[source]).find(Boolean));
}
const before=read('tests/fixtures/app-migration/Project-web-apps-phase-six-before.csv'),after=read('tests/fixtures/app-migration/Project-web-apps-phase-six-after.csv');
assert.equal(before.split(/\r?\n/).slice(1).filter(Boolean).length,13);assert.equal(after.split(/\r?\n/).slice(1).filter(Boolean).length,9);
assert.equal(before.split(/(?<=\n)/).filter(line=>!p.removed_names.includes(line.split(',')[1])).join(''),after,'only the four agreed source records retire');
assert.deepEqual(new Set(p.removed_names),new Set(Object.values(expected).flatMap(x=>x.names)));
console.log('PASS: three pictured Library homes preserve four identities; two distinct health/benefit modes; 52 apps / 75 peer cards; exact 13 → 9 catalogue retirement'+(built?'; rendered routes.':'.'));
