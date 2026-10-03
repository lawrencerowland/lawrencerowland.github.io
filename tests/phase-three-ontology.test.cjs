'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {JSDOM}=require('../tools/library-apps/node_modules/jsdom');
const folder=path.join(__dirname,'../library/apps/digital-construction-ontology'),data=require(path.join(folder,'data.js')),M=require(path.join(folder,'model.js'));
const fixture=require('./fixtures/phase-three-ontology-original.json');
const key=t=>JSON.stringify([t.s,t.p,t.o,t.oType]);
function triplesFromTurtle(text){
 // Independent parser for the deliberately strict full-IRI Turtle subset emitted by this app.
 return text.split('\n').filter(line=>line && !line.startsWith('#')).map(line=>{
  const match=line.match(/^<([^<>\s]+)> <([^<>\s]+)> (<([^<>\s]+)>|"(?:[^"\\\x00-\x1f]|\\["\\nrt]|\\u[0-9a-fA-F]{4})*") \.$/);
  assert.ok(match,'Invalid full-IRI Turtle statement: '+line);
  return {s:match[1],p:match[2],o:match[4]||JSON.parse(match[3]),oType:match[4]?'uri':'literal'};
 });
}
test('complete source topology survives with separate semantics and resolvable endpoints',()=>{
 for(const graph of Object.values(data.cases))assert.deepEqual(M.validate(graph),[]);
 assert.equal(data.cases.tokyo.nodes.length,20);assert.equal(data.cases.tokyo.links.length,28);
 assert.equal(data.cases.hs2.nodes.length,93);assert.equal(data.cases.hs2.links.length,125);
 assert.deepEqual(data.cases.tokyo.nodes.map(n=>n.id),fixture.tokyo.ids);
 assert.deepEqual(data.cases.tokyo.links.map(l=>[l.source,l.target]),fixture.tokyo.endpoints);
 assert.deepEqual(data.cases.hs2.nodes.map(n=>n.id),fixture.hs2.ids);
 assert.deepEqual(data.cases.hs2.links.map(l=>[l.source,l.predicate,l.target]),fixture.hs2.edges);
 assert.equal(data.cases.hs2.nodes.filter(n=>n.type==='Appointment').length,20);
 assert.equal(data.cases.modules.nodes.length,21);
});
test('module imports equal official saved OWL declarations; complete files match receipt hashes',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(folder,'sources/manifest.json'))),expected=[];
 for(const item of manifest){
  const bytes=fs.readFileSync(path.join(folder,'sources',item.module.toLowerCase()+'.ttl'));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256);
  const imports=[...bytes.toString().matchAll(/owl:imports\s+([^;]+);/g)].flatMap(m=>[...m[1].matchAll(/<([^>]+)>/g)].map(x=>x[1]));
  assert.deepEqual(imports,fixture.imports[item.module]);
  imports.forEach(iri=>expected.push([item.module,iri.split('/')[5]]));
 }
 const actual=data.cases.modules.links.filter(l=>l.kind==='import').map(l=>[l.source,l.target]);
 assert.equal(actual.length,9);assert.deepEqual(actual.sort(),expected.sort());
 assert.ok(actual.some(([s,t])=>s==='Agents'&&t==='Processes'));
 assert.ok(!actual.some(([s,t])=>s==='Energy'&&t==='SAREF'));
 assert.equal(M.filter(data.cases.modules,{query:'IndoorAirQuality'}).nodes[0].id,'Occupancy');
 assert.ok(data.cases.modules.links.filter(e=>e.kind!=='import').every(e=>!e.predicate));
});
test('project classes and DiCon properties exist in the declared versioned module',()=>{
 const names={dica:'agents',dice:'entities',dicp:'processes',dici:'information',dicm:'materials',dicv:'variables'};
 const files=Object.fromEntries(Object.entries(names).map(([p,f])=>[p,fs.readFileSync(path.join(folder,'sources',f+'.ttl'),'utf8')]));
 const terms=[];
 for(const graph of [data.cases.tokyo,data.cases.hs2]){
  graph.nodes.forEach(n=>terms.push(n.ontologyClass || M.qname(n.rdfType)));
  graph.links.forEach(e=>terms.push(M.qname(e.predicate)));
 }
 for(const term of new Set(terms)){
  const [prefix,local]=term.split(':');if(!files[prefix])continue;
  assert.match(files[prefix],new RegExp('(?:^|\\n)(?::|'+prefix+':)'+local+'\\s'),term+' must be defined in its own module');
 }
 const tok=data.cases.tokyo;
 assert.equal(tok.links.find(l=>l.source==='stadium'&&l.target==='tokyo').predicate,'dice:locatedIn');
 assert.equal(tok.links.find(l=>l.source==='cost').predicate,'example:costOf');
 assert.ok(tok.links.filter(l=>l.target==='jnse').every(l=>l.validFrom==='2025-04-01'));
 assert.match(tok.nodes.find(n=>n.id==='solar').evidenceStatus,/design intent/);
});
test('roles filter tests predicate and source for string and simulated D3 object endpoints',()=>{
 const graph=data.cases.hs2,expected=['Role_HS2Ltd_ProjectLeader'];
 assert.deepEqual(M.roles(graph,'HS2Ltd').map(n=>n.id),expected);
 assert.deepEqual(M.roles(graph,'HS2Programme'),[]);
 const mutable={...graph,links:graph.links.map(l=>({...l,source:{id:l.source},target:{id:l.target}}))};
 assert.deepEqual(M.roles(mutable,'HS2Ltd').map(n=>n.id),expected);
 assert.deepEqual(M.roles(mutable,'Appt_DfT_to_HS2Ltd'),[]);
});
test('search, type and neighbourhood filters never retain dangling links or mutate data',()=>{
 const before=JSON.stringify(data),graph=data.cases.hs2;
 let result=M.filter(graph,{query:'MWCC2553',includeNeighbours:true});
 assert.ok(result.nodes.some(n=>n.id==='Appt_HS2Ltd_to_Align_MWCC2555'));
 assert.ok(result.nodes.some(n=>n.id==='HS2Ltd'));
 result=M.filter(graph,{query:'MWCC2553',types:['Appointment'],includeNeighbours:true});
 assert.equal(result.nodes.length,1);assert.equal(result.links.length,0);
 for(const graph of Object.values(data.cases))for(const type of [...new Set(graph.nodes.map(n=>n.type))]){
  const subset=M.filter(graph,{types:[type]}),ids=new Set(subset.nodes.map(n=>n.id));
  assert.ok(subset.nodes.every(n=>n.type===type));assert.ok(subset.links.every(e=>ids.has(e.source)&&ids.has(e.target)));
 }
 assert.deepEqual(M.filter(graph,{query:'definitely absent'}).nodes,[]);
 assert.equal(JSON.stringify(data),before);
});
test('every original RDF statement is preserved or has an explicit correction record',()=>{
 const graph=data.cases.hs2,triples=M.triples(graph),set=new Set(triples.map(key));
 for(const old of fixture.hs2.originalTriples){
  if(set.has(key(old)))continue;
  const node=graph.nodes.find(n=>n.uri===old.s),field=old.p===M.prefixes.rdfs+'label'?'label':old.p.slice(M.prefixes.hs2.length);
  if(old.s===M.prefixes.hs2+'HS2Programme'&&old.p===M.prefixes.rdfs+'comment'){assert.match(old.o,/currently focused/);continue;}
  assert.ok(node?.legacy && node.legacy[field]===old.o,'Missing unexplained original statement: '+key(old));
  assert.ok(node.correctionSource,'Corrections need a source');
  assert.ok(triples.some(t=>t.s===node.uri&&t.p===old.p&&t.o===node[field]));
 }
 assert.equal(graph.nodes.filter(n=>n.legacy).length,12);
 assert.equal(graph.nodes.find(n=>n.id==='Appt_HS2Ltd_to_Align_MWCC2555').refId,'MWCC2553');
 assert.equal(graph.nodes.find(n=>n.id==='Appt_HS2Ltd_to_Deloitte_ProgrammeAssurance_2649').award,'Q3 2021');
});
test('Turtle independently round-trips exactly to the triple table, with escaping and complete graph',()=>{
 const graph=data.cases.hs2,triples=M.triples(graph),parsed=triplesFromTurtle(M.turtle(graph));
 assert.deepEqual(new Set(parsed.map(key)),new Set(triples.map(key)));
 assert.equal(new Set(triples.map(key)).size,triples.length);
 const byId=new Map(graph.nodes.map(n=>[n.id,n]));
 for(const e of graph.links)assert.ok(parsed.some(t=>t.s===byId.get(e.source).uri && t.p===e.predicate && t.o===byId.get(e.target).uri && t.oType==='uri'));
 for(const n of graph.nodes)assert.ok(parsed.some(t=>t.s===n.uri&&t.p===M.prefixes.rdf+'type'&&t.o===n.rdfType));
 const special=structuredClone(graph);special.nodes[0].label='Quote " slash \\ newline\n tab\t carriage\r control\u0001';
 assert.equal(triplesFromTurtle(M.turtle(special)).find(t=>t.s===special.nodes[0].uri&&t.p===M.prefixes.rdfs+'label').o,special.nodes[0].label);
 special.nodes[0].uri='https://example.org/unsafe iri';assert.throws(()=>M.turtle(special),/invalid RDF IRI/);
 assert.throws(()=>M.turtle(data.cases.tokyo),/HS2 model only/);
});
function ui(withD3=true){const dom=new JSDOM(fs.readFileSync(path.join(folder,'index.html'),'utf8'),{url:'https://example.org/library/apps/digital-construction-ontology/',runScripts:'outside-only',pretendToBeVisual:true});
 if(withD3)dom.window.eval(fs.readFileSync(path.join(folder,'vendor/d3.v7.9.0.min.js'),'utf8'));
 ['data.js','model.js','app.js'].forEach(file=>dom.window.eval(fs.readFileSync(path.join(folder,file),'utf8')));return dom;}
test('native UI loads each case, selects HS2 roles correctly and filters/searches cards',()=>{
 const dom=ui(),w=dom.window,d=w.document;
 assert.equal(d.querySelectorAll('.graph-node').length,21);assert.equal(d.querySelectorAll('.node-card').length,21);
 d.querySelector('[data-case=tokyo]').click();assert.equal(d.querySelectorAll('.graph-node').length,20);assert.equal(d.querySelectorAll('.graph-link').length,28);
 d.querySelector('[data-node=construction]').click();assert.match(d.querySelector('#inspector').textContent,/2016-12-01/);
 d.querySelector('[data-case=hs2]').click();assert.equal(d.querySelectorAll('.graph-node').length,93);assert.equal(d.querySelectorAll('.graph-link').length,125);
 d.querySelector('[data-node=HS2Ltd]').click();assert.match(d.querySelector('#inspector').textContent,/Roles carried by this node/);
 assert.equal(d.querySelectorAll('#inspector h4')[0].nextElementSibling.textContent,'HS2 Ltd: Delivery / project leader role');
 const search=d.querySelector('#search');search.value='MWCC2553';search.dispatchEvent(new w.Event('input'));
 assert.ok(d.querySelector('[data-node=Appt_HS2Ltd_to_Align_MWCC2555]'));assert.ok(d.querySelectorAll('.node-card').length<93);
 search.value='no-such-thing';search.dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.node-card').length,0);assert.equal(d.querySelector('#empty').hidden,false);
 d.querySelector('#clear-filters').click();assert.equal(d.querySelectorAll('.node-card').length,93);
 const jsonBefore=JSON.stringify(w.OntologyData);d.querySelector('#reset-layout').click();assert.equal(JSON.stringify(w.OntologyData),jsonBefore,'diagram layout must not mutate canonical endpoints or add x/y');
 dom.window.close();
});
test('RDF selected-node and text filters reset without stale selection',()=>{
 const dom=ui(false),w=dom.window,d=w.document;
 d.querySelector('[data-case=hs2]').click();d.querySelector('[data-node=HS2Ltd]').click();
 const only=d.querySelector('#selected-triples');only.checked=true;only.dispatchEvent(new w.Event('change'));
 const total=d.querySelectorAll('#triples tr').length;assert.ok(total>0&&total< M.triples(data.cases.hs2).length);
 d.querySelector('#clear-selection').click();assert.equal(d.querySelectorAll('#triples tr').length,0);
 d.querySelector('#reset-triples').click();assert.equal(d.querySelectorAll('#triples tr').length,M.triples(data.cases.hs2).length);
 const q=d.querySelector('#triple-search');q.value='hs2:originalMetadata';q.dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('#triples tr').length,12);
 dom.window.close();
});
test('data downloads use full canonical case even after filtering; diagram and Turtle controls work',()=>{
 const dom=ui(),w=dom.window,d=w.document,downloads=[];
 w.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
 d.querySelector('[data-case=hs2]').click();const q=d.querySelector('#search');q.value='MWCC2553';q.dispatchEvent(new w.Event('input'));
 ['download-json','download-csv','download-svg','download-ttl','download-triples'].forEach(id=>d.querySelector('#'+id).click());
 assert.equal(downloads.length,5);assert.equal(downloads[0].type,'application/json');assert.equal(downloads[3].type,'text/turtle;charset=utf-8');
 assert.match(d.querySelector('#status').textContent,/hs2-editorial-triples/);dom.window.close();
});
test('card focus survives selection rerender; clearing a stale focus recomputes search results',()=>{
 const dom=ui(),w=dom.window,d=w.document;
 const card=d.querySelector('[data-node=Contexts]');card.focus();card.click();
 assert.equal(d.activeElement.dataset.node,'Contexts','keyboard/card selection must not lose focus to body');
 const focus=d.querySelector('#focus-neighbours');focus.checked=true;focus.dispatchEvent(new w.Event('change'));
 const search=d.querySelector('#search');search.value='Materials';search.dispatchEvent(new w.Event('input'));
 assert.equal(focus.checked,false);
 assert.deepEqual([...d.querySelectorAll('.node-card')].map(n=>n.dataset.node).sort(),['DICO Suite','Entities','Materials']);
 assert.equal(d.querySelector('.table-wrap').tabIndex,0);assert.match(d.querySelector('.table-wrap').getAttribute('aria-label'),/RDF/);
 dom.window.close();
});
test('CSV preserves all node properties and original metadata with RFC-style quote escaping',()=>{
 for(const graph of Object.values(data.cases)){
  const csv=M.csv(graph),rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<csv.length;i++){const c=csv[i];if(c==='"'){if(quoted&&csv[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(field);field='';}else if(c==='\r'&&csv[i+1]==='\n'&&!quoted){row.push(field);rows.push(row);row=[];field='';i++;}else field+=c;}
  row.push(field);rows.push(row);const headers=rows.shift();assert.equal(rows.length,graph.nodes.length);
  graph.nodes.forEach((node,index)=>{const values=Object.fromEntries(headers.map((h,i)=>[h,rows[index][i]]));for(const [k,v] of Object.entries(node))assert.equal(values[k],typeof v==='object'?JSON.stringify(v):String(v),node.id+' '+k);});
 }
});
