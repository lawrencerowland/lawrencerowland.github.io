const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),site=process.argv[2]?path.resolve(process.argv[2]):root;
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),served=p=>fs.readFileSync(path.join(site,p),'utf8');
const apps=JSON.parse(read('_data/library_apps.json')).filter(app=>app.build!=='static'),themes=JSON.parse(read('_data/library_themes.json'));
assert.equal(apps.length,16);assert.equal(themes.length,5);
assert.equal(new Set(apps.map(a=>a.id)).size,16);
const manifest=JSON.parse(read('assets/data/library-apps.json')).filter(app=>app.repo==='React_proj-apps');
assert.deepEqual(manifest.map(a=>a.name),apps.map(a=>a.id));
for(const app of apps){
 const theme=themes.find(t=>t.id===app.theme);assert.ok(theme);
 const source='tools/library-apps/apps/'+app.id;
 assert.ok(fs.existsSync(path.join(root,source,'src')));
 assert.ok(app.try_this&&app.limitation&&app.description);
 assert.ok(fs.existsSync(path.join(site,app.image)));
 const html=served('library/apps/'+app.id+'/index.html');
 assert.ok(html.includes('library-frame')&&html.includes('Try this'));
 assert.ok(html.includes('../../methods/'+app.theme+'.html'));
 assert.ok(!html.includes('Back to app index'));
 assert.ok(html.includes('https://lawrencerowland.github.io'+app.url));
 for(const match of html.matchAll(/(?:src|href)="(\.\/assets\/[^"?#]+)"/g))assert.ok(fs.existsSync(path.resolve(site,'library/apps',app.id,match[1])),app.id+' built dependency exists');
 assert.ok(html.includes('<noscript>'));
 assert.equal(manifest.find(a=>a.name===app.id).url,'https://lawrencerowland.github.io'+app.url);
}
const targets=Object.fromEntries(apps.map(a=>['apps/'+a.id+'/index.html',a.url]));
targets['index.html']='/library.html#interactive-methods';
targets['apps/IT-project-seq-decisions/index.html']='https://lawrencerowland.github.io/Programme-decision-sequences/apps/it-decision-tutorial/';
targets['apps/Another-IT-project-simulation/index.html']='https://lawrencerowland.github.io/Programme-decision-sequences/apps/weekly-it-project-game/';
targets['apps/tag-concurrence-explorer/index.html']='https://lawrencerowland.github.io/Tag_Concurrence_Graph/app_catalogue.html';
for(const [legacy,destination] of Object.entries(targets))for(const [search,hash] of [['',''],['?x=two%20words&repeat=1&repeat=2&encoded=%2523%26','#section%2F2']]){
 const html=served('React_proj-apps/'+legacy),script=html.match(/<script>([\s\S]+)<\/script>/)[1];let replaced;const link={};
 vm.runInNewContext(script,{URL,document:{getElementById:()=>link},location:{origin:'https://lawrencerowland.github.io',search,hash,replace:url=>replaced=url}});
 const expected=new URL(destination,'https://lawrencerowland.github.io');expected.search=search;if(hash)expected.hash=hash;
 assert.equal(replaced,expected.href);assert.equal(link.href,expected.href);
}
const nlogo='building_site_pool_gym_model.nlogo';
assert.equal(served('React_proj-apps/apps/building-site-occupancy-simulation/'+nlogo),read('tools/library-apps/apps/building-site-occupancy-simulation/'+nlogo),'legacy download is the maintained model, not a redirect document');
assert.ok(!read('_data/side_projects.yml').includes('id: react-project-apps'));
assert.ok(!read('all-project-apps.md').includes("fetch('/React_proj-apps/"));
assert.ok(!read('gap-map.md').includes("fetch('/React_proj-apps/"));
assert.ok(read('gap-map.md').includes('url:app.url ||'),'Gap Map follows canonical app URLs');
if(process.argv[2]){
 const library=served('library.html');for(const theme of themes){assert.ok(library.includes('/library/methods/'+theme.id+'.html'));const page=served('library/methods/'+theme.id+'.html');assert.ok(!page.includes('{%'));for(const app of apps.filter(a=>a.theme===theme.id))assert.ok(page.includes(app.url));}
}
console.log('PASS: all 16 named examples, 5 theme entrances, source/build/image integrity, 40 legacy state-preserving journeys and downloadable model continuity'+(process.argv[2]?'; rendered site.':'.'));
