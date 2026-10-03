'use strict';
const {test,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {JSDOM,VirtualConsole}=require('node:module').createRequire(path.join(__dirname,'../tools/library-apps/package.json'))('jsdom');
const html=fs.readFileSync(path.join(__dirname,'../library/apps/project-risk-gradient/index.html'),'utf8');
const plain=value=>JSON.parse(JSON.stringify(value));
const close=(a,b,label)=>assert.ok(Math.abs(a-b)<1e-9,`${label||'value'}: ${a} != ${b}`);
function page(t){
  const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
  const dom=new JSDOM(html,{url:'https://example.test/library/apps/project-risk-gradient/',runScripts:'dangerously',virtualConsole:vc});
  assert.deepEqual(errors,[],'page script loads without DOM errors');
  if(t)t.after(()=>dom.window.close());
  return {dom,w:dom.window,d:dom.window.document,qa:dom.window.__projectRiskGradientQA};
}
const model=page();after(()=>model.dom.window.close());const M=model.qa;
// Independent fixture: paths are enumerated, not calculated with the app's
// topological CPM pass. A task's float is project length minus its longest
// complete source-to-sink path through that task.
const fixture=[
  {id:1,d:10,k:.4,p:[]},{id:2,d:15,k:.6,p:[1]},
  {id:3,d:25,k:.8,p:[2]},{id:4,d:15,k:.7,p:[3]},
  {id:5,d:10,k:.3,p:[2]},{id:6,d:8,k:.5,p:[5]},
  {id:7,d:5,k:.9,p:[4,6]}
];
const byId=Object.fromEntries(fixture.map(t=>[t.id,t]));
function allPaths(){
  const paths=[];
  function walk(id,path){const next=fixture.filter(t=>t.p.includes(id));if(!next.length)paths.push([...path,id]);else for(const t of next)walk(t.id,[...path,id]);}
  for(const t of fixture.filter(t=>!t.p.length))walk(t.id,[]);
  return paths;
}
const paths=allPaths();
function oracle(buffers={}){
  const weight=id=>byId[id].d+(buffers[id]||0),sum=ids=>ids.reduce((s,id)=>s+weight(id),0);
  const finish=Math.max(...paths.map(sum));
  return {finish,tasks:fixture.map(t=>{
    const through=paths.filter(p=>p.includes(t.id));
    const es=Math.max(...through.map(p=>sum(p.slice(0,p.indexOf(t.id)))));
    const tail=Math.max(...through.map(p=>sum(p.slice(p.indexOf(t.id)+1))));
    const lf=finish-tail,ef=es+weight(t.id),ls=lf-weight(t.id);
    return {id:t.id,es,ef,ls,lf,slack:ls-es,critical:ls===es};
  })};
}
const baseline=oracle(),weights={1:20,2:30,3:50,4:30,5:10,6:8,7:10};
const baselineSlack={1:0,2:0,3:0,4:0,5:22,6:22,7:0};
const oracleRisk=buffers=>fixture.reduce((s,t)=>s+weights[t.id]*100*Math.exp(-(baselineSlack[t.id]+(buffers[t.id]||0))*t.k/2),0)/158;

test('published fixture, two source-to-sink paths and baseline CPM are independently reproduced',()=>{
  assert.deepEqual(plain(M.tasks.map(t=>({id:t.id,d:t.duration,k:t.coefficient,p:t.dependencies}))),fixture);
  assert.deepEqual(paths,[[1,2,3,4,7],[1,2,5,6,7]]);assert.equal(baseline.finish,70);assert.equal(M.totalWeight,158);
  assert.equal(M.baselineSchedule.projectDuration,70);
  for(const expected of baseline.tasks){
    const actual=M.baselineSchedule.byId.get(expected.id);
    for(const key of ['es','ef','ls','lf','slack','critical'])assert.equal(actual[key],expected[key],`${expected.id} ${key}`);
    assert.equal(actual.slack,baselineSlack[expected.id]);
  }
});
test('CPM agrees with exhaustive path lengths across all 128 slider corners and branch crossover',()=>{
  const settings=[];
  for(let bits=0;bits<128;bits++)settings.push(Object.fromEntries(fixture.map((t,i)=>[t.id,(bits>>i&1)*10])));
  // Values above the UI limit exercise the general schedule routine at a tie
  // and after the documentation/training branch overtakes development/testing.
  settings.push({5:22},{5:23},{5:12,6:11},{1:2.5,2:4.25,3:.5,6:2.75});
  for(const buffers of settings){
    const before=JSON.stringify(buffers),expected=oracle(buffers),actual=M.calculateSchedule(buffers);
    close(actual.projectDuration,expected.finish,'duration');assert.equal(JSON.stringify(buffers),before);
    for(const t of expected.tasks)for(const key of ['es','ef','ls','lf','slack','critical'])assert.equal(actual.byId.get(t.id)[key],t[key],`${JSON.stringify(buffers)} task ${t.id} ${key}`);
  }
});
test('declared exponential task risk is bounded, decreasing, and based on baseline float',()=>{
  for(const task of M.tasks){
    let previous=Infinity;
    for(let b=0;b<=10;b+=.25){
      const risk=M.calculateTaskRisk(task,b),expected=100*Math.exp(-(baselineSlack[task.id]+b)*byId[task.id].k/2);
      close(risk,expected);assert.ok(risk>=0&&risk<=100);assert.ok(risk<previous);previous=risk;
    }
  }
  const zero=M.evaluateScenario({}),mixed=M.evaluateScenario({3:10,5:10,6:10});
  close(zero.projectRisk,oracleRisk({}));close(mixed.projectRisk,oracleRisk({3:10,5:10,6:10}));
  assert.ok(mixed.projectRisk<zero.projectRisk);assert.equal(mixed.schedule.byId.get(5).slack,12);
  close(mixed.risks[5],100*Math.exp(-32*.3/2),'task risk uses 22 baseline + 10 allocated, not current float');
});
test('one-day rankings and finish impact match independent perturbations',()=>{
  const buffers={},evaluation=M.evaluateScenario(buffers);
  const independent=fixture.map(t=>({id:t.id,g:oracleRisk(buffers)-oracleRisk({[t.id]:1}),delta:oracle({[t.id]:1}).finish-oracle(buffers).finish})).sort((a,b)=>b.g-a.g);
  assert.deepEqual(independent.map(x=>x.id),[3,4,2,1,7,5,6]);
  for(const expected of independent){const result=M.gradientForTask(expected.id,evaluation);close(result.gradient,expected.g);assert.equal(result.durationDelta,expected.delta);}
  assert.deepEqual(independent.filter(x=>!x.delta).map(x=>x.id),[5,6]);
  assert.deepEqual(plain(model.w.__projectRiskGradientState.gradients.map(x=>x.taskId)),independent.map(x=>x.id));
});
test('marginal reduction diminishes as a task receives more buffer and inputs are not mutated',()=>{
  for(const task of fixture){
    let previous=Infinity;
    for(let b=0;b<=10;b++){
      const buffers={[task.id]:b},before=JSON.stringify(buffers),evaluation=M.evaluateScenario(buffers),result=M.gradientForTask(task.id,evaluation);
      close(result.gradient,weights[task.id]/158*100*Math.exp(-(baselineSlack[task.id]+b)*task.k/2)*(1-Math.exp(-task.k/2)));
      assert.ok(result.gradient>0&&result.gradient<previous);previous=result.gradient;assert.equal(JSON.stringify(buffers),before);
      assert.equal(evaluation.buffers[task.id],b);
    }
  }
});
test('public scenario evaluation sanitises negative, non-finite and missing buffer values',()=>{
  const result=M.evaluateScenario({1:-4,2:NaN,3:Infinity,4:'2'});
  assert.deepEqual(plain(result.buffers),{1:0,2:0,3:0,4:2,5:0,6:0,7:0});assert.equal(result.projectDuration,72);
});
test('slider adjustments retain the same live control and its keyboard focus across updates',t=>{
  const {w,d,qa}=page(t),slider=d.getElementById('buffer-3');slider.focus();
  for(const task of qa.tasks){
    assert.equal(d.getElementById('buffer-'+task.id).getAttribute('aria-label'),task.name+' buffer');
    assert.equal(d.querySelector('#task-list [data-select="'+task.id+'"]').getAttribute('aria-label'),'Chart risk response for '+task.name);
  }
  for(const value of [1,2,7,10]){
    slider.value=value;slider.dispatchEvent(new w.Event('input',{bubbles:true}));
    assert.equal(d.getElementById('buffer-3'),slider,'drag target must survive render');assert.equal(d.activeElement,slider,'keyboard focus survives render');
    assert.equal(qa.getState().buffers[3],value);assert.equal(d.getElementById('buffer-output-3').textContent,value+'d');
    assert.equal(w.__projectRiskGradientState.evaluation.projectDuration,70+value);
  }
  assert.match(d.getElementById('selected-readout').textContent,/At allocation limit/);
  d.getElementById('reset-button').click();assert.equal(qa.getState().selectedTaskId,3);assert.ok(Object.values(qa.getState().buffers).every(v=>v===0));assert.equal(slider.value,'0');
  assert.equal(w.__projectRiskGradientState.evaluation.projectDuration,70);
});
test('recommendations allocate one day, update the selected chart and remain keyboard reachable',t=>{
  const {w,d,qa}=page(t),button=d.querySelector('#recommendation [data-apply="3"]');button.focus();button.click();
  assert.equal(qa.getState().buffers[3],1);assert.equal(qa.getState().selectedTaskId,3);assert.match(d.getElementById('chart-heading').textContent,/Development/);
  assert.equal(d.activeElement.getAttribute('data-apply'),'3');assert.equal(w.__projectRiskGradientState.evaluation.projectDuration,71);
  d.querySelector('#task-list [data-select="5"]').click();assert.equal(qa.getState().selectedTaskId,5);
  const rank=d.querySelector('#ranking [data-select="2"]');rank.focus();rank.click();assert.equal(qa.getState().selectedTaskId,2);assert.equal(d.activeElement.getAttribute('data-select'),'2');
});
test('allocation caps exclude unavailable recommendations and accurately explain exhausted no-slip choices',t=>{
  const {w,d,qa}=page(t);
  function set(id,value){const el=d.getElementById('buffer-'+id);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));}
  set(5,10);set(6,10);
  assert.equal(d.querySelectorAll('#recommendation [data-apply="5"], #recommendation [data-apply="6"]').length,0);
  assert.match(d.getElementById('recommendation').textContent,/Every available next buffer day/);
  assert.match(d.getElementById('summary').textContent,/0 available next-day options/);
  // With other critical buffers exhausted, Requirements at its cap must not
  // displace a still-available recommendation, despite its nonzero gradient.
  for(const id of [1,2,3,4])set(id,10);
  assert.equal(d.querySelector('#recommendation [data-apply]').getAttribute('data-apply'),'7');
  assert.deepEqual([...d.querySelectorAll('#ranking [data-select]')].map(el=>+el.dataset.select),[7]);
  set(7,9);const last=d.querySelector('#recommendation [data-apply="7"]');last.focus();last.click();
  assert.equal(d.activeElement,d.getElementById('reset-button'),'exhausting the last allocation leaves a useful focused control');
  assert.equal(d.querySelectorAll('#recommendation [data-apply]').length,0);assert.equal(d.querySelectorAll('#ranking [data-select]').length,0);
  assert.match(d.getElementById('recommendation').textContent,/All buffers are at their limit/);assert.ok(Object.values(qa.getState().buffers).every(v=>v===10));
});
test('network toggle and mouse/keyboard node selection update chart and ARIA state',t=>{
  const {w,d,qa}=page(t),button=d.getElementById('network-button'),panel=d.getElementById('network-panel');
  assert.equal(panel.hidden,true);button.click();assert.equal(panel.hidden,false);assert.equal(button.getAttribute('aria-expanded'),'true');
  assert.equal(d.getElementById('network-svg').getAttribute('role'),'group');
  assert.equal(d.querySelectorAll('[data-network-task]').length,7);
  d.querySelector('[data-network-task="5"]').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));assert.equal(qa.getState().selectedTaskId,5);
  for(const key of ['Enter',' ']){
    const node=d.querySelector('[data-network-task="2"]');node.focus();node.dispatchEvent(new w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
    assert.equal(qa.getState().selectedTaskId,2);assert.equal(d.activeElement.getAttribute('data-network-task'),'2');assert.match(d.getElementById('chart-heading').textContent,/Design/);
  }
  button.click();assert.equal(panel.hidden,true);assert.equal(button.getAttribute('aria-expanded'),'false');
});
test('public copy declares uncalibrated risk, baseline assumptions, limits and the retained network',()=>{
  assert.match(html,/not a calibrated risk forecast/);assert.match(html,/baseline total float/);assert.match(html,/100 × exp/);
  assert.match(html,/hypothetical 11th day/);assert.match(html,/same branch remains critical/);assert.match(html,/href="\/library\/methods\/decisions-and-trade-offs.html"/);
  assert.doesNotMatch(html,/<script[^>]+src=/);
});
