'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {createRequire} = require('node:module');
const root = path.resolve(__dirname, '..');
const built = process.argv[2] && path.resolve(process.argv[2]);
const {JSDOM} = createRequire(path.join(root, 'tools/library-apps/package.json'))('jsdom');
const origin = 'https://lawrencerowland.github.io';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const siteRoot = built || root;
const apps = json('_data/library_apps.json');
const materials = json('_data/library_materials.json');
const listing = json('assets/data/library-apps.json');
const specialists = json('assets/data/specialist-apps.json');
const themes = json('_data/library_themes.json');
const provenance = json('tests/fixtures/app-migration/provenance.json').phase_three;
const revision = 'cd0528939fd0e1f5de1df7cda9930785349e4946';
const expected = {
  'project-decision-graph': {theme:'decisions-and-trade-offs', sources:['hs2-decision-graph']},
  'crossing-project-map': {theme:'data-and-assurance', sources:['lower_thames_crossing_geo_kg']},
  'project-viability-navigator': {theme:'states-and-relationships', sources:['project_viability_state_space_navigator_plus']},
  'reading-project-evidence': {theme:'data-and-assurance', sources:['grounded-theory-approach', 'legends_tower_sentiment_report']}
};
// These pinned values are independent of the destination catalogue being checked.
const sourceHashes = {
  dico_module_map_d3:'56f386d262078cc5f292ec83680c1e1b5688f5271aa1ee7c823557337963de0a',
  tokyo_stadium_dicon_graph:'54a68482f80e0838fcc82f551a3e07e2b68d67eed23a801b985ec74228aa2c10',
  hs2_stakeholders_network:'54f38cc7c70954eb6e481148e5d1ea582e41bb2c7626951b9d81806d6357f3a1',
  'hs2-decision-graph':'c0df5196d63783d2a1e4ab3895b0ea47a8700306ca90102a9ca18643d0857306',
  lower_thames_crossing_geo_kg:'3efc41b26b20a27af56d6575cd3031d20814bef7732a1cca7e1ee690036944a7',
  project_viability_state_space_navigator_plus:'007068f1be681fa6696deca22b687e4eef5adace26eea28c6589409726d1bee0',
  'grounded-theory-approach':'2c0a689f5f8fd8a30df1045eb27072452b9448fff4966fadb2fe777551b5aecd',
  legends_tower_sentiment_report:'af49f45e50a1de174715eb71397accffeedc4f4ec6e9bf99ba992f7d4b254ef1'
};
// Historical receipt remains pinned; the three ontology routes now go directly to Solway.
const relocations=json('tests/fixtures/app-migration/provenance.json').phase_four.ontology_relocations;
const destinations = {
  dico_module_map_d3: origin+'/library/apps/digital-construction-ontology/#modules',
  tokyo_stadium_dicon_graph: origin+'/library/apps/digital-construction-ontology/#tokyo',
  hs2_stakeholders_network: origin+'/library/apps/digital-construction-ontology/#hs2',
  'hs2-decision-graph': origin+'/library/apps/project-decision-graph/',
  lower_thames_crossing_geo_kg: origin+'/library/apps/crossing-project-map/',
  project_viability_state_space_navigator_plus: origin+'/library/apps/project-viability-navigator/',
  'grounded-theory-approach': origin+'/library/apps/reading-project-evidence/#coding',
  legends_tower_sentiment_report: origin+'/library/apps/reading-project-evidence/#stance'
};
assert.equal(apps.length, 52, '52 maintained apps');
assert.equal(materials.length, 22, 'existing reading/worked-example peers retained');
assert.equal(apps.length + materials.length, 74, '74 flat subject entries');
assert.equal(listing.length, apps.length, 'legacy app listing mirrors the maintained homes');
assert.equal(new Set([...apps,...materials].map(a=>a.id)).size, 74, 'every subject card has one unique identity');
assert.equal(provenance.repository, 'lawrencerowland/Project-web-apps');
assert.equal(provenance.base_revision, revision);
assert.equal(provenance.before_rows, 28);
assert.equal(provenance.after_rows, 20);
assert.deepEqual(provenance.source_sha256, sourceHashes, 'all eight original files have exact pinned hashes');
assert.deepEqual(provenance.destinations, destinations, 'exact source-to-home routing, including case fragments');
assert.deepEqual([...provenance.removed_names].sort(), Object.keys(destinations).sort());
assert.equal(new Set(Object.values(destinations).map(url=>new URL(url).pathname)).size, 5, 'eight source files consolidate into five homes');

function sourceOrBuiltTarget(url) {
  const pathname = decodeURIComponent(url.pathname);
  let file = path.join(siteRoot, pathname, pathname.endsWith('/') ? 'index.html' : '');
  if (!built && !fs.existsSync(file) && file.endsWith('.html')) {
    const markdown = file.slice(0,-5)+'.md';
    if (fs.existsSync(markdown)) file=markdown;
  }
  return file;
}
const pages = new Map();
const pictures=[];
for (const [id, rule] of Object.entries(expected)) {
  const matches=apps.filter(app=>app.id===id); assert.equal(matches.length,1,id+': one maintained card');
  const app=matches[0], route='/library/apps/'+id+'/';
  assert.equal(app.theme,rule.theme,id+': purpose-based subject');
  assert.equal(app.url,route);
  assert.equal(app.kind,'app');assert.equal(app.build,'static');
  for (const field of ['title','description','try_this','limitation','image_alt']) assert.ok(app[field]?.trim(),id+': reader-facing '+field);
  assert.equal(app.source_revision,revision);
  assert.equal(app.original_name,rule.sources[0]);
  assert.equal(app.source_sha256,sourceHashes[app.original_name]);
  assert.deepEqual(app.source_files,Object.fromEntries(rule.sources.map(name=>['web_apps/'+name+'.html',sourceHashes[name]])),id+': exact retained source set');
  const originalNames=new Set(rule.sources);
  const mirrors=listing.filter(item=>originalNames.has(item.name));
  assert.equal(mirrors.length,1,id+': consolidated sources have one app-listing entrance');
  assert.equal(mirrors[0].name,app.original_name);assert.equal(mirrors[0].url,origin+route);
  assert.equal([...apps,...materials].filter(item=>item.url?.split('#')[0]===route).length,1,id+': no duplicate subject home');
  const directory=path.join(siteRoot,route);
  const html=fs.readFileSync(path.join(directory,'index.html'),'utf8');
  const dom=new JSDOM(html,{url:origin+route});const doc=dom.window.document;
  assert.ok(doc.querySelector('h1'),id+': clear visible purpose');
  assert.ok(doc.querySelector('noscript'),id+': no-script explanation');
  assert.equal(doc.querySelector('link[rel=canonical]')?.href,origin+route);
  assert.ok([...doc.querySelectorAll('a[href]')].some(a=>a.pathname==='/library/methods/'+rule.theme+'.html'),id+': return to the established subject');
  assert.ok(fs.existsSync(path.join(directory,'app.js')),id+': maintained static application');
  assert.ok(fs.existsSync(path.join(directory,'README.md')),id+': provenance and QA record');
  const documentation=fs.readFileSync(path.join(root,route,'README.md'),'utf8');
  for (const name of rule.sources) assert.ok(documentation.includes(sourceHashes[name]),id+': README pins '+name);
  for(const resource of doc.querySelectorAll('[src],link[href],a[href]')) {
    const raw=resource.getAttribute('src')??resource.getAttribute('href');
    if(!raw||raw.startsWith('#'))continue;
    const url=new URL(raw,origin+route);
    // Primary sources and external documentation are allowed; local application dependencies must exist.
    if(url.origin!==origin) {
      if(resource.tagName==='SCRIPT')assert.fail(id+': runtime script must be vendored locally: '+raw);
      continue;
    }
    assert.ok(fs.existsSync(sourceOrBuiltTarget(url)),id+': local dependency/route '+raw);
  }
  assert.equal(app.image,'/images/library-apps/'+id+'.jpg',id+': one deliberate pictured entrance');
  pictures.push({id,image:app.image});
  pages.set(id,{html,doc,dom});
}

for(const [name,destination] of Object.entries(destinations)) {
  const rows=specialists.filter(item=>item.repo==='Project-web-apps'&&item.name===name);
  assert.equal(rows.length,1,name+': one retained specialist identity');
  assert.equal(rows[0].url,relocations[name]||destination,name+': specialist bookmark reaches exact maintained home/case');
  if(relocations[name]) continue; // Receiver owns model and case tests; relocation tests cover the forwarding shell.
  const url=new URL(destination),id=url.pathname.split('/').filter(Boolean).at(-1),{doc,html}=pages.get(id);
  if(url.hash) {
    const anchor=url.hash.slice(1);
    if(id==='digital-construction-ontology') {
      assert.ok(doc.querySelector('button[data-case="'+anchor+'"]'),name+': retained case selector');
      const script=fs.readFileSync(path.join(siteRoot,url.pathname,'app.js'),'utf8');
      assert.match(script,/hashchange/,'ontology keeps bookmarked case changes');
      assert.match(script,/location\.hash/,'ontology initializes from the bookmarked case');
      const caseDOM=new JSDOM(html,{url:destination,runScripts:'outside-only'});
      for(const file of ['data.js','model.js','app.js'])caseDOM.window.eval(fs.readFileSync(path.join(siteRoot,url.pathname,file),'utf8'));
      assert.equal(caseDOM.window.document.querySelector('[data-case][aria-pressed=\"true\"]')?.getAttribute('data-case'),anchor,name+': bookmark initializes the correct case');
      assert.ok(caseDOM.window.document.querySelectorAll('.node-card').length>0,name+': bookmarked case renders inspectable cards');
      caseDOM.window.close();
    } else assert.ok(doc.getElementById(anchor),name+': explanatory section bookmark exists');
  }
}

// Preserve literal CSV record bytes, including CRLF, quoted commas, escaped quotes and multiline descriptions.
function records(buffer) {
  const result=[];let start=0,quoted=false;
  for(let i=0;i<buffer.length;i++) {
    if(buffer[i]===34) {if(quoted&&buffer[i+1]===34)i++;else quoted=!quoted;}
    if(buffer[i]===10&&!quoted){result.push(buffer.subarray(start,i+1));start=i+1;}
  }
  assert.equal(quoted,false,'source CSV has balanced quoted records');
  if(start<buffer.length)result.push(buffer.subarray(start));
  return result;
}
function cells(record) {
  const text=record.toString('utf8').replace(/\r?\n$/,''),out=[];let value='',quoted=false;
  for(let i=0;i<text.length;i++) {
    if(text[i]==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
    else if(text[i]===','&&!quoted){out.push(value);value='';}else value+=text[i];
  }
  out.push(value);return out;
}
const before=fs.readFileSync(path.join(root,'tests/fixtures/app-migration/Project-web-apps-phase-three-before.csv'));
const after=fs.readFileSync(path.join(root,'tests/fixtures/app-migration/Project-web-apps-phase-three-after.csv'));
const beforeRecords=records(before),afterRecords=records(after),removed=new Set(Object.keys(destinations));
const nonempty = rows => rows.filter(row=>row.toString('utf8').trim());
assert.equal(nonempty(beforeRecords).length-1,28);assert.equal(nonempty(afterRecords).length-1,20);
assert.deepEqual(afterRecords[0],beforeRecords[0],'CSV header bytes preserved');
const actualRemoved=beforeRecords.slice(1).filter(record=>removed.has(cells(record)[1]));
assert.equal(actualRemoved.length,8);assert.deepEqual(actualRemoved.map(record=>cells(record)[1]).sort(),[...removed].sort());
assert.deepEqual(after,Buffer.concat(beforeRecords.filter((record,index)=>index===0||!removed.has(cells(record)[1]))),'only the eight selected records are removed; all remaining CSV bytes stay exact');
assert.ok(afterRecords.slice(1).every(record=>!removed.has(cells(record)[1])));

// The long-lived root route remains a state-preserving forward, not another graph implementation.
const forwardHTML=fs.readFileSync(path.join(siteRoot,'examples/hs2-decision-graph.html'),'utf8');
const forwardDoc=new JSDOM(forwardHTML,{url:origin+'/examples/hs2-decision-graph.html'});
const target=destinations['hs2-decision-graph'];
assert.equal(forwardDoc.window.document.querySelector('link[rel=canonical]')?.href,target);
assert.equal(forwardDoc.window.document.getElementById('destination')?.href,target);
const redirectScript=[...forwardHTML.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(script=>script.includes('location.replace'));
assert.ok(redirectScript,'root HS2 route has a forwarding script');
for(const [search,hash] of [['',''],['?view=scenario&label=a%20b','#scenario-tab'],['?tag=one&tag=two','#details-tab']]) {
  const link={href:target};let actual;
  vm.runInNewContext(redirectScript,{URL,document:{getElementById:id=>{assert.equal(id,'destination');return link;}},location:{search,hash,replace:url=>{actual=url;throw Error('Simulated navigation block');}}});
  assert.equal(actual,target+search+hash);assert.equal(link.href,target+search+hash,'manual fallback keeps query and fragment');
}
assert.doesNotMatch(forwardHTML,/d3\.forceSimulation|ontologyData/,'old root route does not retain a duplicate app');
assert.deepEqual(json('assets/data/retired-apps.json').map(item=>item.name),['3D_Construction_Workflow'],'existing retirement record remains unchanged');
assert.ok(apps.some(item=>item.id==='contract-portfolio-board'),'user-valued contract board retained');

for(const {id,image} of pictures) {
  const picture=fs.readFileSync(path.join(siteRoot,image));
  assert.ok(picture.length>1000,id+': image contains a substantive preview');
  assert.equal(picture.subarray(0,3).toString('hex'),'ffd8ff',id+': JPEG extension matches actual bytes');
  assert.equal(picture.subarray(-2).toString('hex'),'ffd9',id+': complete JPEG');
}

if(built) {
  let cardTotal=0;
  for(const theme of themes) {
    const file=path.join(built,'library/methods/'+theme.id+'.html'),html=fs.readFileSync(file,'utf8');
    assert.ok(!html.includes('{%')&&!html.includes('{{'),theme.id+': fully rendered');
    const dom=new JSDOM(html,{url:origin+'/library/methods/'+theme.id+'.html'}),doc=dom.window.document;
    const cards=[...doc.querySelectorAll('article.pw-home-question[id]')];
    const peers=[...apps,...materials].filter(item=>item.theme===theme.id).sort((a,b)=>a.order-b.order);
    assert.deepEqual(cards.map(card=>card.id),peers.map(peer=>peer.id),theme.id+': one correctly ordered peer card per app/material');
    cardTotal+=cards.length;
    for(const [id,rule]of Object.entries(expected)) {
      const matching=cards.filter(card=>card.id===id);
      assert.equal(matching.length,rule.theme===theme.id?1:0,id+': one subject placement');
      if(!matching.length)continue;
      const app=apps.find(item=>item.id===id),card=matching[0],picture=card.querySelector('img');
      assert.equal(picture?.getAttribute('src'),app.image);assert.equal(picture?.getAttribute('alt'),app.image_alt);
      assert.ok([...card.querySelectorAll('a')].some(a=>a.pathname===app.url),id+': pictured card opens the maintained home');
      for(const field of ['title','description','try_this','limitation','reviewed'])assert.ok(card.textContent.includes(app[field]),id+': visible '+field);
    }
    dom.window.close();
  }
  assert.equal(cardTotal,74,'built subject pages expose exactly 74 peer cards');
}
for(const {dom}of pages.values())dom.window.close();forwardDoc.window.close();
console.log('PASS: four retained pictured Library homes and three Solway routes, eight source identities and exact destinations, pinned provenance, retained bookmarks and 28 → 20 byte-exact source rows'+(built?'; 74 rendered subject cards and local dependencies.':'.'));
