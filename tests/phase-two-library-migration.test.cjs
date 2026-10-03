'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),built=process.argv[2]&&path.resolve(process.argv[2]);
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const apps=json('_data/library_apps.json'),materials=json('_data/library_materials.json'),specialists=json('assets/data/specialist-apps.json');
const p=json('tests/fixtures/app-migration/provenance.json').phase_two;
assert.equal(apps.length,40);assert.equal(apps.length+materials.length,62);
const expected={'project-frontier-lab':'decisions-and-trade-offs','waste-route-capacity':'delivery-dynamics','project-time-exchange':'delivery-dynamics','scenario-control-lattice':'data-and-assurance'};
for(const [id,theme] of Object.entries(expected)){
 const a=apps.find(x=>x.id===id);assert.ok(a);assert.equal(a.theme,theme);assert.equal(a.build,'static');
 assert.equal(a.source_revision,p.base_revision);assert.equal(a.source_sha256,p.source_sha256[a.original_name]);
 for(const [source,hash] of Object.entries(a.source_files))if(source.endsWith('.html'))assert.equal(hash,p.source_sha256[source.slice(9,-5)]);
 const folder=path.join(built||root,a.url),html=fs.readFileSync(path.join(folder,'index.html'),'utf8');
 assert.match(html,/<h1\b/);assert.match(html,/<noscript>/);assert.ok(html.includes('https://lawrencerowland.github.io'+a.url));
 assert.ok(html.includes('/library/methods/'+theme+'.html'));const picture=fs.readFileSync(path.join(built||root,a.image));assert.ok(picture.length>1000);assert.ok(a.image.endsWith('.jpg'));assert.equal(picture.subarray(0,3).toString('hex'),'ffd8ff','pictured entrance has matching JPEG bytes and extension');
 for(const m of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)){
  const href=m[1];if(/^[a-z]+:|^\/\//.test(href)||(!built&&href.startsWith('/')))continue;
  assert.ok(fs.existsSync(href.startsWith('/')?path.join(built,href):path.resolve(folder,href)),id+': '+href);
 }
 if(built){const page=fs.readFileSync(path.join(built,'library/methods/'+theme+'.html'),'utf8');assert.equal(page.split('id="'+id+'"').length-1,1);}
}
for(const name of p.removed_names){
 const rows=specialists.filter(x=>x.repo==='Project-web-apps'&&x.name===name);assert.equal(rows.length,1);assert.equal(rows[0].url,p.destinations[name]);
 const u=new URL(rows[0].url),html=fs.readFileSync(path.join(built||root,u.pathname,'index.html'),'utf8');
 if(u.hash)assert.ok(html.includes('id="'+u.hash.slice(1)+'"'),name+' reaches its explanatory section');
}
const before=read('tests/fixtures/app-migration/Project-web-apps-phase-two-before.csv'),after=read('tests/fixtures/app-migration/Project-web-apps-phase-two-after.csv');
const count=s=>s.split(/\r?\n/).slice(1).filter(x=>x.trim()).length;
assert.equal(count(before),34);assert.equal(count(after),28);
assert.equal(after,before.split(/(?<=\n)/).filter(line=>!p.removed_names.includes(line.split(',')[1])).join(''),'only six selected rows removed; unrelated bytes unchanged');
assert.deepEqual(json('assets/data/retired-apps.json').map(x=>x.name),['3D_Construction_Workflow']);
assert.ok(apps.some(x=>x.id==='contract-portfolio-board'),'user-valued board retained');
console.log('PASS: four maintained homes, six source identities, exact provenance, default explanatory anchors and 34 → 28 source rows'+(built?'; built subjects/dependencies.':'.'));
