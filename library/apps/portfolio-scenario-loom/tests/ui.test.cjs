const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../../../../tools/library-apps/node_modules/jsdom'),M=require('../model.js');
function setup(){const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),dom=new JSDOM(html,{url:'https://example.test/library/apps/portfolio-scenario-loom/',runScripts:'outside-only'}),w=dom.window,d=w.document,downloads=[];
  w.LoomModel=M;w.LoomData=require('../data.js');w.Blob=Blob;w.URL.createObjectURL=b=>{downloads.push(b);return 'blob:example';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  w.eval(fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'));const $=id=>d.getElementById(id),click=id=>$(id).click(),change=(id,value,type='change')=>{$(id).value=value;$(id).dispatchEvent(new w.Event(type,{bubbles:true}));};
  async function imported(state,raw=false){Object.defineProperty($('file'),'files',{value:[{size:100,text:async()=>raw?state:M.serialize(state)}],configurable:true});await $('file').onchange();}
  async function exported(){click('export');return M.parse(await downloads.at(-1).text());}
  return {dom,w,d,$,click,change,imported,exported,downloads};
}
test('all twelve examples render; filtering is live and does not alter selected assumptions',async()=>{
  const u=setup();assert.equal(u.d.querySelectorAll('.scenario').length,12);assert.equal(u.d.querySelectorAll('.milestone-card').length,3);u.change('search','no match','input');assert.equal(u.d.querySelectorAll('.scenario').length,0);assert.equal((await u.exported()).selected.length,4);u.change('search','','input');u.change('type','tech');assert.equal(u.d.querySelectorAll('.scenario').length,2);assert.equal((await u.exported()).selected.length,4);u.dom.window.close();
});
test('Cancel leaves edits untouched; Save preserves tags and changes intended fields',async()=>{
  const u=setup(),s=M.defaults();s.library[0].tags=['retained tag'];await u.imported(s);u.click('edit-0');u.$('f-name').value='Cancelled edit';u.click('cancel');assert.deepEqual(await u.exported(),s);u.click('edit-0');u.$('f-name').value='Saved name';u.$('scenario-form').dispatchEvent(new u.w.Event('submit',{bubbles:true,cancelable:true}));const next=await u.exported();assert.equal(next.library[0].name,'Saved name');assert.deepEqual(next.library[0].tags,['retained tag']);assert.equal(u.$('editor').open,false);u.dom.window.close();
});
test('invalid edit and import keep previous state; hostile imported text is rendered literally',async()=>{
  const u=setup(),before=await u.exported();u.click('edit-0');u.$('f-links').value='[{"target":"missing","lagMonths":1,"polarity":1,"strength":1}]';u.$('scenario-form').dispatchEvent(new u.w.Event('submit',{bubbles:true,cancelable:true}));assert.ok(u.$('editor-error').textContent.includes('Unknown link target'));assert.deepEqual(await u.exported(),before);u.click('cancel');
  await u.imported('{"library":{"invalid":true}}',true);assert.ok(u.$('status').textContent.startsWith('Import rejected:'));assert.deepEqual(await u.exported(),before);
  const next=M.defaults();next.library[0].name='<img id="bad" src="x">';next.milestones[0].label='<em id="bad-label">literal</em>';await u.imported(next);assert.equal(u.$('bad'),null);assert.equal(u.$('bad-label'),null);assert.ok(u.d.body.textContent.includes('<img id="bad" src="x">'));u.dom.window.close();
});
test('prototype-name IDs display and edit the default weight or an explicit zero override',async()=>{
  const u=setup(),s=M.defaults();s.library=[{...s.library[0],id:'toString',weight:.8,second:[]}];s.selected=['toString'];s.weights={};
  await u.imported(s);assert.ok(u.$('scenarios').textContent.includes('weight 0.8'));u.click('edit-0');assert.equal(u.$('scenario-form').elements.namedItem('weight').value,'0.8');u.click('cancel');
  s.weights.toString=0;await u.imported(s);assert.ok(u.$('scenarios').textContent.includes('weight 0'));u.click('edit-0');assert.equal(u.$('scenario-form').elements.namedItem('weight').value,'0');u.click('cancel');assert.deepEqual(await u.exported(),s);u.dom.window.close();
});
test('reset immediately restores three milestones; browser saving is explicit and rejected loads are transactional',async()=>{
  const u=setup(),key='library.portfolio-scenario-loom.v1',s=M.defaults();s.library[0].name='Saved version';await u.imported(s);u.click('save');const saved=u.w.localStorage.getItem(key);u.click('reset');assert.equal(u.d.querySelectorAll('.milestone-card').length,3);assert.equal(u.w.localStorage.getItem(key),saved);u.click('load');assert.deepEqual(await u.exported(),s);
  u.w.localStorage.setItem(key,'{broken');u.click('load');assert.deepEqual(await u.exported(),s);assert.equal(u.w.localStorage.getItem(key),'{broken');u.dom.window.close();
});
test('blocked storage writes report failure without changing the model',async()=>{
  const u=setup(),before=await u.exported();u.w.Storage.prototype.setItem=function(){throw new Error('storage blocked');};u.click('save');assert.ok(u.$('status').textContent.includes('storage blocked'));assert.deepEqual(await u.exported(),before);u.dom.window.close();
});
test('empty selection and all-selected state disable swaps; a preview is reversible until Apply',async()=>{
  const u=setup(),s=M.defaults();s.selected=[];await u.imported(s);assert.equal(u.$('preview').disabled,true);s.selected=s.library.map(f=>f.id);await u.imported(s);assert.equal(u.$('preview').disabled,true);u.click('reset');const before=await u.exported(),remove=u.$('remove').value,add=u.$('replace').value;u.click('preview');assert.deepEqual(await u.exported(),before);assert.equal(u.$('apply').hidden,false);u.click('apply');const after=await u.exported();assert.ok(!after.selected.includes(remove));assert.ok(after.selected.includes(add));u.dom.window.close();
});
test('milestone month fields, add/remove, tolerance and pointer drag recompute the same model',async()=>{
  const u=setup();u.change('month-0','2026-08');assert.equal((await u.exported()).milestones[0].date,'2026-08-01');u.change('tolerance','0.9','input');assert.equal((await u.exported()).risk,.9);
  u.click('add-milestone');u.$('m-label').value='New gate';u.$('m-date').value='2028-01';u.$('milestone-form').dispatchEvent(new u.w.Event('submit',{bubbles:true,cancelable:true}));assert.equal(u.d.querySelectorAll('.milestone-card').length,4);u.d.querySelectorAll('.milestone-card button')[3].click();assert.equal((await u.exported()).milestones.length,3);
  const chart=u.$('chart');chart.getBoundingClientRect=()=>({left:0,top:0,width:1060,height:500});const hit=chart.querySelector('[data-milestone] line');hit.dispatchEvent(new u.w.MouseEvent('pointerdown',{bubbles:true,clientX:185}));chart.dispatchEvent(new u.w.MouseEvent('pointermove',{bubbles:true,clientX:185+845*20/60}));chart.dispatchEvent(new u.w.MouseEvent('pointerup',{bubbles:true}));assert.equal((await u.exported()).milestones[0].date,'2026-09-01');u.dom.window.close();
});
test('downloads contain complete model JSON and monthly activation/contribution CSV',async()=>{
  const u=setup();const model=await u.exported();assert.equal(model.library.length,12);u.click('csv');const text=await u.downloads.at(-1).text();assert.ok(text.includes('activation: AI Export Controls Tightening'));assert.ok(text.includes('relief: regulatory'));assert.equal(text.split('\r\n').length,62);u.dom.window.close();
});
