'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),built=process.argv[2]&&path.resolve(process.argv[2]);
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const apps=json('_data/library_apps.json'),materials=json('_data/library_materials.json'),specialists=json('assets/data/specialist-apps.json');
const p=json('tests/fixtures/app-migration/provenance.json').phase_two;
assert.equal(apps.length,39);assert.equal(apps.length+materials.length,61);
const expected={'waste-route-capacity':'delivery-dynamics','project-time-exchange':'delivery-dynamics','scenario-control-lattice':'data-and-assurance'};
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
// A promising incomplete enquiry has one primary foray home, not a duplicate Library card.
const registry=JSON.parse(require('node:child_process').execFileSync('ruby',['-ryaml','-rjson','-e', 'puts JSON.generate(YAML.load_file("_data/side_projects.yml"))'], {cwd:root,encoding:'utf8'}));
const frontier=registry.filter(x=>x.id==='meta-project-innovation');assert.equal(frontier.length,1);
assert.equal(frontier[0].placement,'project');assert.equal(frontier[0].role,'open-enquiry');
assert.equal(frontier[0].path,p.destinations.advanced_project_planning_ideas);
assert.ok(!apps.some(x=>x.id==='project-frontier-lab'));assert.ok(!json('assets/data/library-apps.json').some(x=>x.name==='advanced_project_planning_ideas'));
const frontierFolder=path.join(built||root,'meta-project-innovation'),frontierHTML=fs.readFileSync(path.join(frontierFolder,'index.html'),'utf8');
assert.ok(frontierHTML.includes('https://lawrencerowland.github.io/meta-project-innovation/'));assert.ok(frontierHTML.includes('/side-projects.html'));
assert.ok(read('meta-project-innovation/README.md').includes(p.source_sha256.advanced_project_planning_ideas));
assert.ok(fs.statSync(path.join(built||root,frontier[0].image)).size>1000);
for(const m of frontierHTML.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)){
 const href=m[1];if(/^[a-z]+:|^\/\//.test(href)||(!built&&href.startsWith('/')))continue;
 assert.ok(fs.existsSync(href.startsWith('/')?path.join(built,href):path.resolve(frontierFolder,href)),'Frontier: '+href);
}
if(built){
 const directory=fs.readFileSync(path.join(built,'side-projects.html'),'utf8');assert.equal(directory.split('id="meta-project-innovation"').length-1,1);
 for(const theme of json('_data/library_themes.json'))assert.ok(!fs.readFileSync(path.join(built,'library/methods/'+theme.id+'.html'),'utf8').includes('id="project-frontier-lab"'));
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
console.log('PASS: three Library homes and one foray home, six source identities, exact provenance, default explanatory anchors and 34 → 28 source rows'+(built?'; built subjects/dependencies.':'.'));
