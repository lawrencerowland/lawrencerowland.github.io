'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('../tools/library-apps/node_modules/jsdom');
const root=path.resolve(__dirname,'..'),site=process.argv[2]?path.resolve(process.argv[2]):root,read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const apps=json('_data/library_apps.json'),listing=json('assets/data/library-apps.json'),specialists=json('assets/data/specialist-apps.json'),p=json('tests/fixtures/app-migration/provenance.json').phase_seven;
assert.equal(apps.length,52);assert.equal(listing.length,52);assert.equal(apps.length+json('_data/library_materials.json').length,74);
assert.equal(specialists.length,101);assert.ok(apps.some(a=>a.id==='contract-portfolio-board'));assert.equal(p.base_revision,'459efda24b673a1e50b33cfd4347ffa5928817d9');
const expected={'market_timeline_explorer':['AI_timeline_from_Gemini_25','project-services-navigator'],'project-services-guide':['consulting_catalogue','project_use_case_tree'],'change-coordination':['concurrent_change_levels_amazon'],'pm-software-evolution':['Project_Controls_2010-2025_Transformation']};
for(const[id,names]of Object.entries(expected)){
 const a=apps.find(x=>x.id===id);assert.ok(a);assert.equal(a.theme,id==='change-coordination'?'delivery-dynamics':'capabilities-and-futures');assert.equal(apps.filter(x=>x.url===a.url).length,1);assert.equal(listing.filter(x=>x.url.split('#')[0]==='https://lawrencerowland.github.io'+a.url).length,1,'one primary listing per home');
 for(const key of ['title','description','try_this','limitation','image_alt'])assert.ok(a[key]?.trim(),id+': '+key);
 const html=fs.readFileSync(path.join(site,a.url,'index.html'),'utf8'),d=new JSDOM(html,{url:'https://lawrencerowland.github.io'+a.url}).window.document;assert.ok(d.querySelector('noscript'));assert.equal(d.querySelector('link[rel=canonical]')?.href,'https://lawrencerowland.github.io'+a.url);assert.ok(fs.statSync(path.join(site,a.image)).size>500);
 if(a.build==='static'){assert.deepEqual(a.source_files,p.source_files[id]);assert.ok(d.querySelector('h1'));for(const name of names){const hash=new URL(p.destinations[name]).hash;if(hash)assert.ok(d.getElementById(hash.slice(1)),name+': concrete mode anchor');}}
 else {assert.deepEqual(a.additional_sources.files,p.source_files[id]);assert.ok(fs.existsSync(path.join(root,'tools/library-apps/apps',id,'src')));}
 for(const name of names){const records=specialists.filter(x=>x.repo==='Project-web-apps'&&x.name===name);assert.equal(records.length,1);assert.equal(records[0].url,p.destinations[name]);assert.equal(new URL(records[0].url).pathname,a.url);}
 for(const el of d.querySelectorAll('script[src],link[rel=stylesheet],img[src]')){const raw=el.getAttribute('src')||el.getAttribute('href'),u=new URL(raw,'https://lawrencerowland.github.io'+a.url);assert.equal(u.origin,'https://lawrencerowland.github.io','local runtime');if(!process.argv[2]&&!u.pathname.startsWith(a.url))continue;assert.ok(fs.existsSync(path.join(site,u.pathname)),id+': '+raw);}
 if(process.argv[2]){const subject=fs.readFileSync(path.join(site,'library/methods/'+a.theme+'.html'),'utf8');assert.equal(subject.split('id="'+id+'"').length-1,1);assert.ok(subject.includes(a.image));}
}
const before=read('tests/fixtures/app-migration/Project-web-apps-phase-seven-before.csv'),after=read('tests/fixtures/app-migration/Project-web-apps-phase-seven-after.csv');assert.equal(before.split(/\r?\n/).slice(1).filter(Boolean).length,9);assert.equal(after.split(/\r?\n/).slice(1).filter(Boolean).length,3);assert.equal(before.split(/(?<=\n)/).filter(line=>!p.removed_names.includes(line.split(',')[1])).join(''),after);
assert.deepEqual(new Set(p.removed_names),new Set(Object.values(expected).flat()));
console.log('PASS: six source identities in four homes; two new pictured cards, two enriched existing examples;52 Library apps /74 peers; exact9→3 retirement'+(process.argv[2]?'; rendered links.':'.'));
