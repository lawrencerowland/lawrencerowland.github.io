'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),site=process.argv[2]?path.resolve(process.argv[2]):root,read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const {JSDOM}=require('../tools/library-apps/node_modules/jsdom');
const apps=json('_data/library_apps.json'),listing=json('assets/data/library-apps.json'),specialists=json('assets/data/specialist-apps.json'),p=json('tests/fixtures/app-migration/provenance.json').phase_four;
assert.equal(apps.length,45);assert.equal(apps.length+json('_data/library_materials.json').length,67);assert.equal(listing.length,45);
assert.ok(apps.some(a=>a.id==='contract-portfolio-board'),'user-valued Contract Board remains');
assert.ok(!apps.some(a=>a.id==='digital-construction-ontology'),'ontology has only its Solway primary home');
assert.ok(!listing.some(a=>a.name==='dico_module_map_d3'),'no obsolete primary Library app listing');
assert.equal(p.base_revision,'676cbc7417d58ec9dd2d6fa751a54bd1000bc03a');
const hashes={'interactive-nec-contract-journey':'b6f0390a4d1de64a61272b94496942a7f4d52489bb909d21581669da3d593374','hs2-contract-game':'177b7f8dcc6900e1ed527cb950067f7be1bb7a5d746c0b2f4f823fb700048f9a','regulatory-negotiation-rehearsal-board':'3ec5fe335dbf5f8e5e9d5b7a77ad87383a523b19e6d05057b66fc52efc153a21'};
assert.deepEqual(p.source_sha256,hashes);
const expected={'project-contract-lab':['interactive-nec-contract-journey','hs2-contract-game'],'regulatory-rehearsal':['regulatory-negotiation-rehearsal-board']};
for(const [id,names] of Object.entries(expected)){
 const a=apps.find(x=>x.id===id);assert.ok(a);assert.equal(a.theme,'decisions-and-trade-offs');assert.equal(a.build,'static');assert.equal(a.source_revision,p.base_revision);assert.equal(a.source_sha256,hashes[names[0]]);assert.deepEqual(a.source_files,p.source_files[id]);
 for(const field of ['title','description','try_this','limitation','image_alt'])assert.ok(a[field]?.trim(),id+': '+field);
 assert.equal(a.url,'/library/apps/'+id+'/');assert.equal(apps.filter(x=>x.url===a.url).length,1);
 const folder=path.join(site,a.url),html=fs.readFileSync(path.join(folder,'index.html'),'utf8'),d=new JSDOM(html,{url:'https://lawrencerowland.github.io'+a.url}).window.document;
 assert.ok(d.querySelector('h1'));assert.ok(d.querySelector('noscript'));assert.equal(d.querySelector('link[rel=canonical]')?.href,'https://lawrencerowland.github.io'+a.url);
 assert.ok([...d.querySelectorAll('a')].some(x=>x.pathname==='/library/methods/decisions-and-trade-offs.html'),id+': return to subject');
 for(const resource of d.querySelectorAll('script[src],link[href],a[href]')){
  const raw=resource.getAttribute('src')||resource.getAttribute('href');if(!raw||raw.startsWith('#'))continue;
  const u=new URL(raw,'https://lawrencerowland.github.io'+a.url);
  if(u.origin!=='https://lawrencerowland.github.io'){assert.notEqual(resource.tagName,'SCRIPT','runtime scripts must be local');continue;}
  if(!process.argv[2]&&!u.pathname.startsWith(a.url))continue;
  const file=path.join(site,u.pathname,u.pathname.endsWith('/')?'index.html':'');assert.ok(fs.existsSync(file),id+': '+raw);
 }
 const picture=fs.readFileSync(path.join(site,a.image),'utf8');assert.match(picture,/<svg\b/);assert.ok(picture.length>500);assert.ok(d.querySelectorAll('script[src]').length);
 for(const name of names){const rows=specialists.filter(x=>x.repo==='Project-web-apps'&&x.name===name);assert.equal(rows.length,1);assert.equal(rows[0].url,p.destinations[name]);const u=new URL(rows[0].url);if(u.hash)assert.ok(d.getElementById(u.hash.slice(1)),name+': distinct case anchor');}
 if(process.argv[2]){const page=fs.readFileSync(path.join(site,'library/methods/decisions-and-trade-offs.html'),'utf8');assert.equal(page.split('id="'+id+'"').length-1,1);assert.ok(page.includes(a.image));}
}
const before=fs.readFileSync(path.join(root,'tests/fixtures/app-migration/Project-web-apps-phase-four-before.csv')),after=fs.readFileSync(path.join(root,'tests/fixtures/app-migration/Project-web-apps-phase-four-after.csv'));
const lines=before.toString().match(/[^\n]*\n|[^\n]+$/g)||[];
assert.equal(before.toString().split(/\r?\n/).slice(1).filter(Boolean).length,20);assert.equal(after.toString().split(/\r?\n/).slice(1).filter(Boolean).length,17);
assert.equal(lines.filter(x=>!Object.keys(hashes).includes(x.split(',')[1])).join(''),after.toString(),'only three chosen catalogue records removed');
const forward=fs.readFileSync(path.join(site,'library/apps/digital-construction-ontology/index.html'),'utf8'),d=new JSDOM(forward).window.document,target='https://lawrencerowland.github.io/Solway_tunnel_ontology/apps/digital-construction-ontology/';
assert.equal(d.querySelector('link[rel=canonical]').href,target);assert.ok(forward.length<2200);assert.equal(d.querySelectorAll('script[src]').length,0);
assert.deepEqual(fs.readdirSync(path.join(site,'library/apps/digital-construction-ontology')),['index.html'],'no old ontology working implementation');
const script=[...forward.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
for(const hash of ['','#modules','#tokyo','#hs2'])for(const search of ['','?repeat=1&repeat=2&value=%2523%26']){
 const link={href:target};let actual;vm.runInNewContext(script,{URL,document:{getElementById:()=>link},location:{search,hash,replace:u=>actual=u}});assert.equal(actual,target+search+hash);assert.equal(link.href,actual);
}
for(const [name,destination] of Object.entries(p.ontology_relocations)){assert.equal(specialists.find(x=>x.repo==='Project-web-apps'&&x.name===name).url,destination);assert.ok(destination.startsWith(target));}
if(process.argv[2]){const states=fs.readFileSync(path.join(site,'library/methods/states-and-relationships.html'),'utf8');assert.ok(!states.includes('id="digital-construction-ontology"'),'former subject card is gone');}
console.log('PASS: two pictured contract homes, 45 Library apps / 67 flat cards, three retained case routes into Solway, no old ontology working copy, and exact 20 → 17 source rows.');
