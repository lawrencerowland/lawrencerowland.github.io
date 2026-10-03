const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../../tools/library-apps/node_modules/jsdom');
function app() {
  const root=path.resolve(__dirname,'..'),dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{runScripts:'outside-only',url:'https://example.test/counterfactuals/#paths'});
  dom.window.eval(fs.readFileSync(path.join(root,'model.js'),'utf8'));dom.window.eval(fs.readFileSync(path.join(root,'app.js'),'utf8'));
  const $=id=>dom.window.document.getElementById(id),change=el=>el.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
  const observed=()=> $('conditioning').querySelector('[aria-label="Observed: Team Capacity"]');
  return {dom,$,change,observed};
}
test('elicited arrow choices update the real graph and adjustment result while preserving policy state',()=>{
  const {dom,$}=app(),policy=$('kpis').innerHTML,coefficients=$('fit-table').innerHTML;
  assert.equal($('dag').querySelectorAll('.node').length,6);
  $('arrow-keep').click();
  assert.equal($('dag').querySelectorAll('.node').length,3);assert.equal($('dag').querySelectorAll('.edge').length,3);
  assert.equal($('cause').value,'Automation');assert.equal($('outcome').value,'Throughput');
  assert.match($('arrow-result').textContent,/Arrow kept.*path.*is open.*adjustment set: \{ Team Capacity \}.*Selected set ∅.*does not pass/s);
  assert.match($('graph-result').textContent,/does not pass/);assert.equal($('arrow-keep').getAttribute('aria-pressed'),'true');
  $('graph-result').querySelector('[data-set]').click();
  assert.match($('arrow-result').textContent,/is blocked.*Selected set \{ Team Capacity \} passes/s);
  $('arrow-challenge').click();
  assert.equal($('dag').querySelectorAll('.edge').length,2);
  assert.match($('arrow-result').textContent,/Arrow removed.*adjustment set: ∅.*Selected set ∅.*passes/s);
  assert.match($('graph-result').textContent,/Selected set passes/);assert.equal($('arrow-challenge').getAttribute('aria-pressed'),'true');
  assert.equal($('conditioning').querySelector('[aria-label="Condition on: Team Capacity"]').checked,false);
  assert.equal($('kpis').innerHTML,policy);assert.equal($('fit-table').innerHTML,coefficients);
  $('arrow-keep').click();assert.equal($('dag').querySelectorAll('.edge').length,3);assert.match($('arrow-result').textContent,/does not pass/);
  dom.window.close();
});
test('unmeasured capacity and graph edits cannot leave a stale elicitation verdict',()=>{
  const {dom,$,change,observed}=app();$('arrow-keep').click();observed().checked=false;change(observed());
  assert.match($('arrow-result').textContent,/No observed set.*capacity is unmeasured.*Measuring capacity/s);
  assert.match($('graph-result').textContent,/No observed set/);
  const arrow=[...$('edge-delete').options].find(o=>o.textContent==='Team Capacity → Automation');
  $('edge-delete').value=arrow.value;$('delete-edge').click();
  assert.match($('arrow-result').textContent,/Arrow removed.*adjustment set: ∅/);
  assert.equal($('arrow-challenge').getAttribute('aria-pressed'),'true');
  $('cause').value='Team Capacity';change($('cause'));
  assert.match($('arrow-result').textContent,/another graph or question/);
  assert.equal($('arrow-keep').getAttribute('aria-pressed'),'false');assert.equal($('arrow-challenge').getAttribute('aria-pressed'),'false');
  $('arrow-keep').click();$('new-variable').value='Omitted common cause';
  $('node-form').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));
  assert.match($('arrow-result').textContent,/another graph or question/);
  $('clear-graph').click();assert.match($('arrow-result').textContent,/another graph or question/);
  dom.window.close();
});
test('reload restores the original lesson; source and boundary remain readable without running scripts',()=>{
  const first=app();first.$('arrow-challenge').click();first.dom.window.close();
  const {dom,$}=app();assert.equal($('dag').querySelectorAll('.node').length,6);assert.equal($('arrow-challenge').getAttribute('aria-pressed'),'false');
  const html=new JSDOM(fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8'));
  const lesson=html.window.document.getElementById('why-this-arrow');
  assert.equal(lesson.open,true);assert.match(lesson.textContent,/judgements, not effect sizes/);
  assert.match(lesson.textContent,/synthetic generator encoded the assumed signs/);
  assert.match(lesson.textContent,/empty set passes/);
  assert.ok(lesson.querySelector('a[href="https://www.frontiersin.org/journals/cognition/articles/10.3389/fcogn.2025.1544387/full"]'));
  html.window.close();dom.window.close();
});
