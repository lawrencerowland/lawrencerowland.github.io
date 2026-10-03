'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../../../tools/library-apps/node_modules/jsdom');
const data=require('./data.js'),M=require('./model.js');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
function dom(hash=''){
 const d=new JSDOM(html,{url:'https://example.test/library/apps/project-services-guide/'+hash,runScripts:'outside-only',pretendToBeVisual:true});
 for(const name of ['data.js','model.js','app.js'])d.window.eval(fs.readFileSync(path.join(__dirname,name),'utf8'));
 return d;
}
const wait=()=>new Promise(r=>setTimeout(r,15));
test('15 service offers, all eight source headings and 23 questions retain a complete test structure',()=>{
 assert.equal(data.services.length,15);assert.equal(data.services.filter(s=>s.family==='practice').length,7);assert.equal(data.services.filter(s=>s.family==='automation').length,8);
 assert.deepEqual(data.groups.map(g=>[g.title,g.ideas.length]),[['AI augmentation',4],['Immersive collaboration',3],['ESG & sustainability dashboards',3],['Low-code orchestration',3],['Compliance & governance automation',3],['Knowledge-graph intelligence',3],['Advanced analytics',2],['Human factors & wellbeing',2]]);
 assert.equal(M.records.length,38);assert.equal(new Set(M.records.map(x=>x.id)).size,38);
 for(const x of M.records){assert.ok(x.title.length>0);for(const key of ['artefact','measure','scope'])assert.ok(x[key].length>20,x.id+': '+key);assert.ok((x.offer||x.option).length>20);if(x.type==='question')assert.ok(data.services.some(s=>s.id===x.service));}
});
test('search finds artefacts, measures and parent headings; families are an intersection',()=>{
 assert.deepEqual(M.filter('Precision at five','automation').map(x=>x.id),['knowledge-commons']);
 assert.deepEqual(M.filter('Immersive collaboration','question').map(x=>x.id),['site-walkthroughs','spatial-meetings','schedule-overlays']);
 assert.ok(M.filter('risk','practice').every(x=>x.type==='practice'));assert.ok(M.filter('risk','practice').length>0);
 assert.equal(M.filter('not-in-any-content').length,0);assert.equal(M.filter('  ','all').length,38);
 assert.equal(M.filter('human-factors','question').length,2);assert.throws(()=>M.filter('','invalid'));
});
test('static readable output exactly matches maintained data and all deep-link identities',()=>{
 assert.equal(html,require('./render.cjs'));
 const d=new JSDOM(html).window.document;
 assert.equal(d.querySelectorAll('[data-record]').length,38);assert.equal(d.querySelectorAll('[data-group]').length,8);
 for(const record of M.records){const el=d.getElementById(record.id);assert.ok(el);assert.equal(el.querySelector('h3').textContent,record.title);assert.ok(el.textContent.includes(record.measure));}
 for(const el of d.querySelectorAll('script[src],link[rel=stylesheet],img[src]'))assert.ok(!/^https?:/.test(el.getAttribute('src')||el.getAttribute('href')));
 for(const a of d.querySelectorAll('a[href^="#"]'))assert.ok(d.getElementById(a.hash.slice(1)));
 assert.ok(d.getElementById('offers'));assert.ok(d.getElementById('questions'));assert.ok(d.querySelector('meta[name=viewport]'));assert.ok(d.querySelector('noscript'));
});
test('expand all remains expanded after native toggle events; collapse closes every item',async()=>{
 const d=dom(),doc=d.window.document;doc.getElementById('expand').click();await wait();
 assert.equal(doc.querySelectorAll('#browse details[open]').length,46);
 doc.getElementById('collapse').click();await wait();assert.equal(doc.querySelectorAll('#browse details[open]').length,0);d.window.close();
});
test('filtered results expose matching branches and empty state then restore previous expansion',async()=>{
 const d=dom(),doc=d.window.document;doc.getElementById('human-factors').open=true;
 const input=doc.getElementById('search');input.value='carbon';input.dispatchEvent(new d.window.Event('input'));await wait();
 assert.ok(doc.getElementById('sustainability-dashboards').open);assert.equal(doc.querySelectorAll('[data-record]:not([hidden])').length,1);assert.equal(doc.getElementById('offers').hidden,true);
 input.value='no-match-98123';input.dispatchEvent(new d.window.Event('input'));assert.equal(doc.getElementById('empty').hidden,false);assert.equal(doc.getElementById('questions').hidden,true);
 doc.getElementById('clear').click();assert.equal(doc.getElementById('empty').hidden,true);assert.equal(doc.getElementById('human-factors').open,true);assert.equal(doc.getElementById('sustainability-dashboards').open,false);assert.equal(doc.activeElement.id,'search');assert.equal(doc.querySelectorAll('[data-record]:not([hidden])').length,38);d.window.close();
});
test('family filtering, visible-only expansion and reset preserve hidden items',()=>{
 const d=dom(),doc=d.window.document,type=doc.getElementById('type');
 type.value='automation';type.dispatchEvent(new d.window.Event('change'));doc.getElementById('expand').click();
 assert.equal(doc.querySelectorAll('[data-record]:not([hidden])').length,8);assert.equal(doc.querySelectorAll('#browse details[open]').length,8);assert.equal(doc.getElementById('risk-framework').open,false);
 doc.getElementById('clear').click();assert.equal(doc.querySelectorAll('[data-record]:not([hidden])').length,38);d.window.close();
});
test('deep links clear restrictive search and open ancestors without removing summary keyboard access',async()=>{
 const d=dom('#risk-summaries'),doc=d.window.document;assert.ok(doc.getElementById('risk-summaries').open);assert.ok(doc.getElementById('ai-augmentation').open);assert.equal(doc.activeElement,doc.querySelector('#risk-summaries>summary'));assert.notEqual(doc.activeElement.getAttribute('tabindex'),'-1');
 const type=doc.getElementById('type');type.value='question';type.dispatchEvent(new d.window.Event('change'));
 d.window.location.hash='risk-framework';await wait();assert.equal(type.value,'all');assert.equal(doc.getElementById('risk-framework').hidden,false);assert.ok(doc.getElementById('risk-framework').open);
 d.window.location.hash='questions';await wait();assert.equal(doc.activeElement.id,'questions-heading');
 d.window.location.hash='%E0%A4%A';await wait();d.window.close();
});
test('former routes resolve and unsupported claims are absent from reader content',()=>{
 assert.equal(M.target('offers').section,'offers');assert.equal(M.target('questions').section,'questions');assert.equal(M.target('unknown'),null);
 assert.doesNotMatch(html,/HoloLens|DoWhy\+\+|DiffRL|ELLY|80\s*%|sub.hourly retraining|GA\s*\(2023\)|100k.run|GPT.4o|forecast burnout risk weeks/i);
 assert.match(html,/not a list of services currently delivered/);assert.match(html,/not measured results/);assert.match(html,/not private model reasoning/);
});
