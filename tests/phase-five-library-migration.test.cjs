'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),site=process.argv[2]?path.resolve(process.argv[2]):root;
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const {JSDOM}=require('../tools/library-apps/node_modules/jsdom');
const apps=json('_data/library_apps.json'),listing=json('assets/data/library-apps.json'),specialists=json('assets/data/specialist-apps.json'),p=json('tests/fixtures/app-migration/provenance.json').phase_five;
assert.equal(apps.length,52);assert.equal(listing.length,52);assert.equal(apps.length+json('_data/library_materials.json').length,75);
assert.equal(new Set(apps.map(a=>a.id)).size,52);assert.ok(apps.some(a=>a.id==='contract-portfolio-board'));
assert.equal(p.base_revision,'8221f32b398d582801e639b5460aa674805f1671');
const origin='https://lawrencerowland.github.io';
function checkPage(id,url,returnPath){
 const html=fs.readFileSync(path.join(site,url,'index.html'),'utf8'),d=new JSDOM(html,{url:origin+url}).window.document;
 assert.ok(d.querySelector('h1'));assert.ok(d.querySelector('noscript'));assert.equal(d.querySelector('link[rel=canonical]')?.href,origin+url);
 assert.ok([...d.querySelectorAll('a')].some(x=>x.pathname===returnPath),id+': return to its primary home');
 for(const el of d.querySelectorAll('script[src],link[href],a[href]')){
  const raw=el.getAttribute('src')||el.getAttribute('href');if(!raw||raw.startsWith('#'))continue;
  const u=new URL(raw,origin+url);
  if(u.origin!==origin){assert.notEqual(el.tagName,'SCRIPT','no remote runtime dependency');continue;}
  if(!process.argv[2]&&!u.pathname.startsWith(url))continue;
  assert.ok(fs.existsSync(path.join(site,u.pathname,u.pathname.endsWith('/')?'index.html':'')),id+': '+raw);
 }
 return d;
}
function checkSources(names,d){
 for(const n of names){const rows=specialists.filter(x=>x.repo==='Project-web-apps'&&x.name===n);assert.equal(rows.length,1);assert.equal(rows[0].url,p.destinations[n]);const u=new URL(rows[0].url);if(u.hash)assert.ok(d.getElementById(u.hash.slice(1)),n+': named mode preserved');}
}
const expected={'signed-feedback-lab':{theme:'delivery-dynamics',names:['SMR_governance_simulator']},'project-dependency-atlas':{theme:'delivery-dynamics',names:['project-dependency-atlas']}};
for(const [id,e] of Object.entries(expected)){
 const a=apps.find(x=>x.id===id);assert.ok(a);assert.equal(a.theme,e.theme);assert.equal(a.build,'static');assert.equal(a.source_revision,p.base_revision);assert.deepEqual(a.source_files,p.source_files[id]);assert.equal(a.source_sha256,p.source_sha256[a.original_name]);
 for(const f of ['title','description','try_this','limitation','image_alt'])assert.ok(a[f]?.trim());
 const d=checkPage(id,a.url,'/library/methods/'+e.theme+'.html');
 const pic=fs.readFileSync(path.join(site,a.image),'utf8');assert.match(pic,/<svg\b/);assert.ok(pic.length>500);
 checkSources(e.names,d);
 if(process.argv[2]){const page=fs.readFileSync(path.join(site,'library/methods/'+e.theme+'.html'),'utf8');assert.equal(page.split('id="'+id+'"').length-1,1);assert.ok(page.includes(a.image));}
}
// The counterfactual enquiry retains both source modes in one pictured Experiments home.
const causalNames=['pm_causal_playground','counterfactual_programme_steering'];
const registry=JSON.parse(require('node:child_process').execFileSync('ruby',['-ryaml','-rjson','-e','puts JSON.generate(YAML.load_file("_data/side_projects.yml"))'],{cwd:root,encoding:'utf8'}));
const causal=registry.filter(x=>x.id==='counterfactual-steering');assert.equal(causal.length,1);
const project=causal[0];assert.equal(project.title,'Counterfactual programme steering');assert.equal(project.placement,'project');assert.equal(project.role,'open-enquiry');assert.equal(project.gallery_order,18);assert.equal(project.path,origin+'/counterfactuals/');
assert.equal(registry.filter(x=>x.path===project.path).length,1,'one primary enquiry record');
assert.ok(project.image_alt?.trim());
const picture=fs.readFileSync(path.join(site,project.tile_image||project.image),'utf8');assert.match(picture,/<svg\b/);assert.ok(picture.length>500);
const causalDocument=checkPage(project.id,'/counterfactuals/','/side-projects.html');
for(const mode of ['paths','policies']){
 assert.equal(causalDocument.querySelectorAll('section#'+mode).length,1,'one preserved '+mode+' panel');
 assert.equal(causalDocument.querySelectorAll('a[data-mode="'+mode+'"][href="#'+mode+'"]').length,1,'direct switch to '+mode);
}
assert.equal(p.destinations.pm_causal_playground,origin+'/counterfactuals/#paths');assert.equal(p.destinations.counterfactual_programme_steering,origin+'/counterfactuals/#policies');
checkSources(causalNames,causalDocument);
const causalReadme=read('counterfactuals/README.md');assert.ok(causalReadme.includes(p.base_revision));
for(const hash of Object.values(p.source_files['project-causal-lab']))assert.ok(causalReadme.includes(hash),'retained causal source provenance');
assert.ok(!apps.some(x=>x.id==='project-causal-lab'||x.url.startsWith('/counterfactuals/')),'causal enquiry has no Library card');
assert.ok(!listing.some(x=>causalNames.includes(x.name)||x.url.includes('/counterfactuals/')),'causal enquiry has no primary Library app listing');
assert.ok(!fs.existsSync(path.join(root,'library/apps/project-causal-lab')),'no old causal Library working copy');
if(process.argv[2]){
 const directory=new JSDOM(fs.readFileSync(path.join(site,'side-projects.html'),'utf8'),{url:origin+'/side-projects.html'}).window.document;
 assert.equal(directory.querySelectorAll('article#counterfactual-steering').length,1,'one rendered enquiry card');
 const card=directory.querySelector('article#counterfactual-steering');assert.ok(card.querySelector('img'));assert.ok([...card.querySelectorAll('a')].some(a=>a.href===project.path));
 assert.equal(card.querySelector('img').getAttribute('src'),JSON.parse(fs.readFileSync(path.join(root,'_data/experiment_tiles.json'),'utf8'))[project.id].image,'current experiment emblem');
 assert.ok(fs.existsSync(path.join(site,project.tile_image||project.image)),'original pictured app entrance remains available');
 for(const theme of json('_data/library_themes.json')){
  const subject=new JSDOM(fs.readFileSync(path.join(site,'library/methods/'+theme.id+'.html'),'utf8'),{url:origin}).window.document;
  assert.ok(!subject.getElementById('project-causal-lab'),'former causal subject card is absent');
  assert.ok(![...subject.querySelectorAll('article a')].some(a=>a.pathname.startsWith('/counterfactuals/')),'no duplicate causal Library discovery card');
 }
 assert.ok(!fs.existsSync(path.join(site,'library/apps/project-causal-lab')),'no old causal working copy in the built site');
}
const dot=fs.readFileSync(path.join(site,'library/apps/signed-feedback-lab/original-governance-av.dot'));
assert.equal(crypto.createHash('sha256').update(dot).digest('hex'),'9ed272b8d9d47fbeae74cbb12375d886a546ecc5c681b6f0adcfb1f5953048a6');
const before=read('tests/fixtures/app-migration/Project-web-apps-phase-five-before.csv'),after=read('tests/fixtures/app-migration/Project-web-apps-phase-five-after.csv');
assert.equal(before.split(/\r?\n/).slice(1).filter(Boolean).length,17);assert.equal(after.split(/\r?\n/).slice(1).filter(Boolean).length,13);
assert.equal(before.split(/(?<=\n)/).filter(l=>!p.removed_names.includes(l.split(',')[1])).join(''),after,'exactly four selected CSV rows retired');
assert.deepEqual(new Set(p.removed_names),new Set([...causalNames,...Object.values(expected).flatMap(x=>x.names)]));
console.log('PASS: one pictured causal enquiry with two modes, two pictured Library homes, four exact source identities, preserved DOT, 50 apps / 75 peer cards, 17 → 13 catalogue rows.');
