'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../../../../tools/library-apps/node_modules/jsdom');
function setup(){
  const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),{runScripts:'outside-only',url:'https://example.test/library/apps/signed-feedback-lab/'}),w=dom.window;
  let nextId=0;const intervals=new Map(),downloads=[],blobs=[];
  w.setInterval=fn=>{const id=++nextId;intervals.set(id,fn);return id;};w.clearInterval=id=>intervals.delete(id);
  w.URL.createObjectURL=blob=>{blobs.push(blob);return 'blob:test-'+blobs.length;};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){downloads.push(this.download);};
  for(const name of ['model.js','app.js'])w.eval(fs.readFileSync(path.join(__dirname,'..',name),'utf8'));
  const $=id=>w.document.getElementById(id),click=id=>$(id).click(),submit=()=> $('parameters').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  return {dom,w,$,click,submit,intervals,downloads,blobs};
}
test('step, autorun, restart and restore have distinct deterministic semantics',()=>{
  const {dom,w,$,click,submit,intervals}=setup();
  assert.equal($('tick').textContent,'0');assert.equal($('contributions').children.length,4);assert.equal(w.document.querySelectorAll('#graph rect').length,7);
  click('step');assert.equal($('tick').textContent,'1');assert.match($('history-table').textContent,/-0.05/);
  $('gain-e1').value='.8';$('initial-Reg').value='2';submit();assert.equal($('tick').textContent,'0');
  click('run');assert.equal(intervals.size,1);click('run');assert.equal(intervals.size,1);[...intervals.values()][0]();assert.equal($('tick').textContent,'1');
  click('restart');assert.equal(intervals.size,0);assert.equal($('tick').textContent,'0');assert.equal($('gain-e1').value,'0.8');assert.equal($('initial-Reg').value,'2');assert.equal($('pause').disabled,true);
  click('run');click('restore');assert.equal(intervals.size,0);assert.equal($('gain-e1').value,'0.35');assert.equal($('initial-Reg').value,'1');
  $('preset').value='boundary';$('preset').dispatchEvent(new w.Event('change'));assert.match($('stability').textContent,/Boundary/);assert.equal($('gain-e2').value,'-1');
  dom.window.close();
});
test('JSON imports start paused, bad imports leave the applied model intact, and labels are inert text',()=>{
  const {dom,w,$,click,intervals}=setup();click('step');click('show-json');const exported=JSON.parse($('model-json').value);exported.nodes[0].initial=-2;exported.edges[0].gain=.7;exported.edges[0].activity='<img src=x onerror=alert(1)>';
  click('run');$('model-json').value=JSON.stringify(exported);click('apply-json');assert.equal(intervals.size,0);assert.equal($('tick').textContent,'0');assert.equal($('initial-Reg').value,'-2');assert.equal($('gain-e1').value,'0.7');assert.equal(w.document.querySelectorAll('img').length,0);assert.match($('contributions').textContent,/<img src=x/);
  const before=$('contributions').textContent;$('model-json').value='{}';click('apply-json');assert.equal($('error').hidden,false);assert.equal($('contributions').textContent,before);assert.equal($('tick').textContent,'0');
  click('show-json');assert.equal(JSON.parse($('model-json').value).nodes[0].initial,-2);dom.window.close();
});
test('export controls create correctly named downloads with matching contents; invalid input cannot change the run',async()=>{
  const {dom,$,click,submit,downloads,blobs}=setup();click('step');$('gain-e1').value='';submit();assert.equal($('error').hidden,false);assert.equal($('tick').textContent,'1');
  click('download-json');click('download-dot');click('download-csv');assert.deepEqual(downloads,['signed-feedback-model.json','signed-feedback-tick-1.dot','signed-feedback-history.csv']);assert.deepEqual(blobs.map(b=>b.type),['application/json','text/vnd.graphviz','text/csv']);
  const read=blob=>new Promise((resolve,reject)=>{const reader=new dom.window.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsText(blob);});
  const [json,dot,csv]=await Promise.all(blobs.map(read));assert.equal(JSON.parse(json).edges[0].gain,.35);assert.match(dot,/AV_e1 \[shape=box[^\n]*c = -0.017499999999999998/);assert.match(csv,/-0.05,0.35,0.06/);
  assert.equal(dom.window.document.querySelector('a[href="original-governance-av.dot"]').hasAttribute('download'),true);dom.window.close();
});
