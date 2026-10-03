const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../../tools/library-apps/node_modules/jsdom');
function app(hash='') {
  const root=path.resolve(__dirname,'..'),dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{runScripts:'outside-only',url:'https://example.test/counterfactuals/'+hash});
  dom.window.eval(fs.readFileSync(path.join(root,'model.js'),'utf8'));dom.window.eval(fs.readFileSync(path.join(root,'app.js'),'utf8'));
  const $=id=>dom.window.document.getElementById(id),change=id=>$(id).dispatchEvent(new dom.window.Event('change',{bubbles:true}));
  return {dom,$,change};
}
test('graph lifecycle: source seed, common cause, selected adjustment, hidden confounder, cycle rejection',()=>{
  const {dom,$,change}=app();assert.equal($('dag').querySelectorAll('.node').length,6);
  $('graph-example').value='confounding';$('load-example').click();assert.match($('graph-result').textContent,/does not pass/);
  $('graph-result').querySelector('[data-set]').click();assert.match($('graph-result').textContent,/Selected set passes/);
  const observed=$('conditioning').querySelector('[aria-label="Observed: Team Capacity"]');observed.checked=false;observed.dispatchEvent(new dom.window.Event('change'));
  assert.match($('graph-result').textContent,/No observed set/);
  $('edge-from').value='Throughput';$('edge-to').value='Team Capacity';$('edge-form').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));assert.match($('graph-error').textContent,/cycle/);
  $('clear-graph').click();assert.equal($('dag').querySelectorAll('.node').length,0);assert.match($('graph-result').textContent,/different variables/);dom.window.close();
});
test('custom node labels are text, not executable markup',()=>{
  const {dom,$}=app();$('new-variable').value='<img src=x onerror=alert(1)>';$('node-form').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));assert.equal($('conditioning').querySelector('img'),null);assert.ok($('conditioning').textContent.includes('<img'));dom.window.close();
});
test('policy mode, preset/custom controls, comparison and deterministic baseline',()=>{
  const {dom,$,change}=app('#policies');assert.equal($('paths').hidden,true);assert.equal($('policies').hidden,false);assert.match($('kpis').textContent,/Δ baseline 0.00/);
  $('preset').value='auto_up';change('preset');$('policy-form').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));assert.match($('focus-label').textContent,/Automation/);assert.match($('policy-warnings').textContent,/Outside observed/);
  $('compare').click();assert.equal($('comparison').querySelectorAll('tbody tr').length,4);assert.match($('focus-label').textContent,/Automation/);
  $('preset').value='custom';change('preset');assert.equal($('custom-controls').hidden,false);$('delta-s').value=-10;$('policy-form').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));assert.match($('policy-warnings').textContent,/Control bounds applied/);
  $('reset-policy').click();assert.match($('focus-label').textContent,/Baseline/);assert.equal($('custom-controls').hidden,true);$('self-tests').click();assert.doesNotMatch($('test-output').textContent,/FAIL/);dom.window.close();
});
test('CSV installation is transactional on failure and clears old results when controls prevent rerun',async()=>{
  const {dom,$}=app('#policies'),M=dom.window.CausalLab,original=$('data-preview').textContent;
  const importText=async(text,name)=>{Object.defineProperty($('csv-file'),'files',{configurable:true,value:[{name,size:text.length,text:async()=>text}]});$('csv-file').dispatchEvent(new dom.window.Event('change'));await new Promise(r=>setImmediate(r));};
  await importText('bad csv','bad.csv');assert.match($('policy-error').textContent,/Import rejected/);assert.equal($('data-preview').textContent,original);assert.notEqual($('kpis').textContent,'');
  const singular=M.synthetic().map(r=>({...r,S:10}));await importText(M.csv(singular),'singular.csv');assert.match($('policy-error').textContent,/rank deficient/);assert.equal($('data-preview').textContent,original);assert.notEqual($('kpis').textContent,'');
  $('samples').value=0;await importText(M.csv(M.synthetic(52,43)),'good.csv');assert.match($('data-status').textContent,/Imported: good.csv/);assert.notEqual($('data-preview').textContent,original);assert.equal($('kpis').textContent,'');assert.equal($('comparison').textContent,'');assert.match($('focus-label').textContent,/need a new run/);
  $('samples').value=100;$('policy-form').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));assert.match($('policy-context').textContent,/good.csv/);assert.notEqual($('kpis').textContent,'');dom.window.close();
});
