'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),site=process.argv[2]?path.resolve(process.argv[2]):root;
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const {JSDOM}=require('../tools/library-apps/node_modules/jsdom');
const apps=json('_data/library_apps.json'),listing=json('assets/data/library-apps.json'),specialists=json('assets/data/specialist-apps.json'),p=json('tests/fixtures/app-migration/provenance.json').phase_five;
assert.equal(apps.length,48);assert.equal(listing.length,48);assert.equal(apps.length+json('_data/library_materials.json').length,70);
assert.equal(new Set(apps.map(a=>a.id)).size,48);assert.ok(apps.some(a=>a.id==='contract-portfolio-board'));
assert.equal(p.base_revision,'8221f32b398d582801e639b5460aa674805f1671');
const expected={'project-causal-lab':{theme:'decisions-and-trade-offs',names:['pm_causal_playground','counterfactual_programme_steering']},'signed-feedback-lab':{theme:'delivery-dynamics',names:['SMR_governance_simulator']},'project-dependency-atlas':{theme:'delivery-dynamics',names:['project-dependency-atlas']}};
for(const [id,e] of Object.entries(expected)){
 const a=apps.find(x=>x.id===id);assert.ok(a);assert.equal(a.theme,e.theme);assert.equal(a.build,'static');assert.equal(a.source_revision,p.base_revision);assert.deepEqual(a.source_files,p.source_files[id]);assert.equal(a.source_sha256,p.source_sha256[a.original_name]);
 for(const f of ['title','description','try_this','limitation','image_alt'])assert.ok(a[f]?.trim());
 const folder=path.join(site,a.url),html=fs.readFileSync(path.join(folder,'index.html'),'utf8'),d=new JSDOM(html,{url:'https://lawrencerowland.github.io'+a.url}).window.document;
 assert.ok(d.querySelector('h1'));assert.ok(d.querySelector('noscript'));assert.equal(d.querySelector('link[rel=canonical]')?.href,'https://lawrencerowland.github.io'+a.url);
 assert.ok([...d.querySelectorAll('a')].some(x=>x.pathname==='/library/methods/'+e.theme+'.html'));
 for(const el of d.querySelectorAll('script[src],link[href],a[href]')){
  const raw=el.getAttribute('src')||el.getAttribute('href');if(!raw||raw.startsWith('#'))continue;
  const u=new URL(raw,'https://lawrencerowland.github.io'+a.url);
  if(u.origin!=='https://lawrencerowland.github.io'){assert.notEqual(el.tagName,'SCRIPT','no remote runtime dependency');continue;}
  if(!process.argv[2]&&!u.pathname.startsWith(a.url))continue;
  assert.ok(fs.existsSync(path.join(site,u.pathname,u.pathname.endsWith('/')?'index.html':'')),id+': '+raw);
 }
 const pic=fs.readFileSync(path.join(site,a.image),'utf8');assert.match(pic,/<svg\b/);assert.ok(pic.length>500);
 for(const n of e.names){const rows=specialists.filter(x=>x.repo==='Project-web-apps'&&x.name===n);assert.equal(rows.length,1);assert.equal(rows[0].url,p.destinations[n]);const u=new URL(rows[0].url);if(u.hash)assert.ok(d.getElementById(u.hash.slice(1)),n+': named mode preserved');}
 if(process.argv[2]){const page=fs.readFileSync(path.join(site,'library/methods/'+e.theme+'.html'),'utf8');assert.equal(page.split('id="'+id+'"').length-1,1);assert.ok(page.includes(a.image));}
}
const dot=fs.readFileSync(path.join(site,'library/apps/signed-feedback-lab/original-governance-av.dot'));
assert.equal(crypto.createHash('sha256').update(dot).digest('hex'),'9ed272b8d9d47fbeae74cbb12375d886a546ecc5c681b6f0adcfb1f5953048a6');
const before=read('tests/fixtures/app-migration/Project-web-apps-phase-five-before.csv'),after=read('tests/fixtures/app-migration/Project-web-apps-phase-five-after.csv');
assert.equal(before.split(/\r?\n/).slice(1).filter(Boolean).length,17);assert.equal(after.split(/\r?\n/).slice(1).filter(Boolean).length,13);
assert.equal(before.split(/(?<=\n)/).filter(l=>!p.removed_names.includes(l.split(',')[1])).join(''),after,'exactly four selected CSV rows retired');
assert.deepEqual(new Set(p.removed_names),new Set(Object.values(expected).flatMap(x=>x.names)));
console.log('PASS: three pictured homes, four exact source identities, preserved DOT, 48 apps / 70 peer cards, 17 → 13 catalogue rows.');
