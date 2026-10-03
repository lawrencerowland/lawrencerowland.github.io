'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),built=process.argv[2]&&path.resolve(process.argv[2]);
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const apps=json('_data/library_apps.json'),materials=json('_data/library_materials.json'),specialists=json('assets/data/specialist-apps.json');
const p=json('tests/fixtures/app-migration/provenance.json').step_one;
assert.equal(apps.length,47);assert.equal(apps.length+materials.length,69);
const expected={'project-graph-views':'data-and-assurance','contract-portfolio-board':'states-and-relationships'};
for(const [id,theme] of Object.entries(expected)){
 const a=apps.find(x=>x.id===id);assert.ok(a);assert.equal(a.theme,theme);assert.equal(a.build,'static');
 assert.equal(a.source_revision,p.base_revision);assert.equal(a.source_sha256,p.source_sha256[a.original_name]);
 for(const [source,hash] of Object.entries(a.source_files))assert.equal(hash,p.source_sha256[source.slice(9,-5)]);
 const folder=path.join(built||root,a.url),html=fs.readFileSync(path.join(folder,'index.html'),'utf8');
 assert.match(html,/<h1\b/);assert.match(html,/<noscript>/);assert.ok(html.includes('https://lawrencerowland.github.io'+a.url));
 assert.ok(html.includes('/library/methods/'+theme+'.html'));assert.ok(fs.statSync(path.join(built||root,a.image)).size>1000);
 for(const m of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)){
  const href=m[1];if(/^[a-z]+:|^\/\//.test(href)||(!built&&href.startsWith('/')))continue;
  assert.ok(fs.existsSync(href.startsWith('/')?path.join(built,href):path.resolve(folder,href)),id+': '+href);
 }
 if(built){const page=fs.readFileSync(path.join(built,'library/methods/'+theme+'.html'),'utf8');assert.equal(page.split('id="'+id+'"').length-1,1);}
}
const idea=materials.find(x=>x.id==='idea-notebook');assert.equal(idea.url,'https://lawrencerowland.github.io/project_innovation_app/webapp/index.html');
assert.equal(idea.theme,'capabilities-and-futures');assert.ok(fs.statSync(path.join(built||root,idea.image)).size>1000);
assert.equal(apps.filter(x=>x.id==='capabilities-wiring-diag').length,1);
assert.equal(materials.filter(x=>x.url==='/gap-map.html').length,1);
for(const name of p.removed_names.filter(n=>n!=='3D_Construction_Workflow'))assert.equal(specialists.filter(x=>x.repo==='Project-web-apps'&&x.name===name).length,1);
assert.deepEqual(json('assets/data/retired-apps.json').map(x=>x.name),['3D_Construction_Workflow']);
assert.ok(!specialists.some(x=>x.name==='3D_Construction_Workflow'),'no fake replacement for retired animation');
console.log('PASS: two new maintained tools, existing notebook/capability/map homes, source provenance and one explicit retirement'+(built?'; built pages and dependencies.':'.'));
