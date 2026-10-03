const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const root = path.resolve(__dirname, '..');
const {JSDOM} = createRequire(path.join(root, 'tools/library-apps/package.json'))('jsdom');
const folder = path.join(root, 'library/apps/project-frontier-lab');
const clone = value => JSON.parse(JSON.stringify(value));
const close = (a,b) => assert.ok(Math.abs(a-b) < 1e-9, `${a} != ${b}`);
function ui(t) {
  const dom = new JSDOM(fs.readFileSync(path.join(folder, 'index.html'), 'utf8'), {url:'https://example.test/library/apps/project-frontier-lab/',runScripts:'outside-only'});
  dom.window.eval(fs.readFileSync(path.join(folder, 'app.js'), 'utf8'));
  t.after(() => dom.window.close());
  const d = dom.window.document;
  function change(selector, value) {
    const el = d.querySelector(selector); assert.ok(el, selector);
    if (el.type === 'checkbox') el.checked = value; else el.value = value;
    el.dispatchEvent(new dom.window.Event('change', {bubbles:true})); return el;
  }
  return {dom,d,m:dom.window.FrontierLab,change,click: selector => d.querySelector(selector).click()};
}

test('all 45 original schedules are retained and independently satisfy precedence, coverage, capacity and scoring', t => {
  const {m}=ui(t), {tasks,policies,scenarios}=m.model();
  const fixtures=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/phase-two-frontier-schedules.json'),'utf8'));
  assert.equal(tasks.length,8); assert.equal(policies.length,5); assert.equal(scenarios.length,3); assert.equal(fixtures.length,45);
  for(const original of fixtures) {
    const scenario=scenarios.find(s=>s.id===original.scenario);
    const r=m.simulate(original.policy,scenario,original.capacity);
    assert.deepEqual(clone(r.rows.map(({id,start,end})=>({id,start,end}))),original.rows);
    for(const key of ['finish','firstOutcome','uncertainty6','reuse6','objective'])close(r[key],original[key]);
    assert.deepEqual(r.rows.map(r=>r.id).sort().join(','),tasks.map(t=>t.id).sort().join(','));
    for(const row of r.rows) {
      assert.equal(row.end-row.start,row.duration);
      for(const dep of row.deps)assert.ok(r.rows.find(t=>t.id===dep).end<=row.start);
    }
    for(const time of new Set(r.rows.flatMap(r=>[r.start,r.end])))assert.ok(r.rows.filter(r=>r.start<=time&&r.end>time).length<=original.capacity);
    const exposure=r.rows.reduce((sum,row)=>sum+row.risk*row.end,0);
    close(r.objective,2*r.finish+3*r.firstOutcome+1.2*r.uncertainty6+.18*exposure-.65*r.reuse6);
  }
});

test('scheduler rejects unsupported capacity, policies and altered scenario data', t => {
  const {m}=ui(t), scenario=m.model().scenarios[0];
  for(const capacity of [0,-1,1.5,4,NaN,Infinity,'2'])assert.throws(()=>m.simulate('robust',scenario,capacity));
  assert.throws(()=>m.simulate('invented',scenario,2));
  for(const bad of [null,{}, {id:'base',changes:[]}, {id:'base',changes:{P1:Infinity}}, {id:'data',changes:{P1:2,P3:-1}}, {id:'base',changes:{P8:2}}])assert.throws(()=>m.simulate('risk',bad,2));
});

test('demand presets, seven dispositions and obligation warning preserve relative-effort semantics without changing the planner', t => {
  const {m,d,click,change}=ui(t), before=clone(m.model());
  assert.equal(d.querySelector('#demand-baseline').textContent,'45');
  assert.equal(d.querySelector('#demand-residual').textContent,'18.8');
  assert.equal(d.querySelector('#demand-body select').options.length,7);
  click('#demand-conservative');assert.equal(d.querySelector('#demand-residual').textContent,'32.6');
  click('#demand-challenge');assert.equal(d.querySelector('#demand-residual').textContent,'14.3');
  change('#demand-body tr:nth-child(2) select','delete');
  assert.match(d.querySelector('#demand-output').textContent,/Obligation conflict/);
  assert.match(d.querySelector('#ledger-body').textContent,/Resolve obligation conflict on D2/);
  assert.deepEqual(clone(m.model()),before);
});

test('evidence checker covers all 24 chain states and keeps authority distinct after every chain is accepted', t => {
  const {m,d,click,change}=ui(t);
  for(const activity of [true,false])for(const evidence of ['current','stale','missing'])for(const threshold of [true,false])for(const review of [true,false]) {
    const expected=!activity?'Activity incomplete':evidence==='missing'?'Evidence missing':evidence==='stale'?'Evidence stale':!threshold?'Claim not supported':!review?'Awaiting review':'Chain accepted';
    assert.equal(m.chainState({activity,evidence,threshold,review})[0],expected);
  }
  assert.throws(()=>m.chainState({activity:true,evidence:'unknown',threshold:true,review:true}));
  click('#tab-assurance');
  for(let index=1;index<=4;index++) {
    const row=`#assurance-body tr:nth-child(${index})`;
    for(const selector of ['td:nth-child(2) input','td:nth-child(4) input','td:nth-child(5) input']){
      const el=d.querySelector(`${row} ${selector}`);el.focus();change(`${row} ${selector}`,true);assert.equal(d.activeElement,el);
    }
    const select=d.querySelector(`${row} select`);select.focus();change(`${row} select`,'current');assert.equal(d.activeElement,select);
  }
  assert.equal(d.querySelector('#assurance-gate').textContent,'Eligible for review');
  assert.match(d.querySelector('#assurance-detail').textContent,/authorised gate decision is still separate/);
  change('#assurance-body tr:nth-child(1) select','stale');assert.equal(d.querySelector('#assurance-gate').textContent,'Hold');
  assert.match(d.querySelector('[data-chain="A1"]').textContent,/stale/);
});

test('greedy whole-package allocation is demonstrably suboptimal; no package is fragmented and zero confidence retains only reuse', t => {
  const {m}=ui(t);
  const packages=[{id:'A',delay:9,confidence:100,min:3,alternative:'partial',reuse:0},{id:'B',delay:5,confidence:100,min:2,alternative:'partial',reuse:0},{id:'C',delay:5,confidence:100,min:2,alternative:'partial',reuse:0}];
  const result=m.allocatePackages(packages,4);
  assert.equal(result.funded.map(x=>x.id).join(','),'A');assert.equal(result.remaining,1);
  const score=items=>items.reduce((sum,x)=>sum+m.scarcityScore(x)*x.min,0);
  assert.equal(score(result.funded),9);assert.equal(score(packages.slice(1)),10);
  for(let pool=0;pool<=12;pool++){
    const r=m.allocatePackages(packages,pool);assert.equal(r.remaining+ r.funded.reduce((sum,x)=>sum+x.min,0),pool);
    assert.equal(r.funded.length+r.deferred.length,3);assert.ok(r.deferred.every(x=>x.min>r.remaining));
  }
  close(m.scarcityScore({...packages[0],confidence:0,reuse:4}),2.2/3);
  for(const mutate of [x=>x.min=0,x=>x.min=1.5,x=>x.confidence=101,x=>x.delay=Infinity,x=>x.reuse=-1,x=>x.alternative='unknown']){
    const bad=clone(packages);mutate(bad[0]);assert.throws(()=>m.allocatePackages(bad,4));
  }
});

test('scarcity UI rejects blank, fractional and out-of-bounds numbers without silent coercion; zero/all-funded states are truthful', t => {
  const {m,d,click,change}=ui(t), before=d.querySelector('#scarcity-output').textContent;
  click('#tab-scarcity');
  const selector='[data-scarcity-id="S1"][data-key="min"]';
  for(const value of ['',0,1.5,7,'Infinity']){
    const input=change(selector,value); assert.equal(input.getAttribute('aria-invalid'),'true');
    assert.equal(d.querySelector('#scarcity-output').textContent,before);
    assert.match(d.querySelector('#scarcity-validation').textContent,/last valid settings/);
    assert.throws(()=>m.snapshot());click('#state-export');assert.match(d.querySelector('#state-status').textContent,/Cannot export/);
  }
  change(selector,3);assert.equal(d.querySelector('#scarcity-validation').textContent,'');
  change('#scarcity-pool',0);assert.match(d.querySelector('#scarcity-output').textContent,/0 architect-days → 0 useful package/);
  assert.equal(m.snapshot().scarcity.pool,0);
  change('#scarcity-pool',12);assert.match(d.querySelector('#scarcity-output').textContent,/3 day\(s\) remain after funding every package/);
  change('[data-scarcity-id="S2"][data-key="confidence"]',0);assert.equal(m.snapshot().scarcity.demands[1].confidence,0);
});

test('typed paths distinguish feedback from precedence cycles and expose local evidence paths separately from upstream reachability', t => {
  const {m,d,click,change}=ui(t);click('#tab-topology');
  assert.equal(m.precedenceCycle(''),false);assert.equal(m.pathExists('A','F','',['precedence']),false);
  assert.equal(m.pathExists('A','F','',['precedence','evidence','approval']),true);
  // Arrow tips must lie outside their target rectangle, not under its opaque fill.
  const rectangles=Array.from(d.querySelectorAll('#network-nodes rect'));
  for(const line of d.querySelectorAll('#network-edges line')){
    const x=Number(line.getAttribute('x2')),y=Number(line.getAttribute('y2'));
    assert.ok(Number.isFinite(x)&&Number.isFinite(y));
    assert.ok(!rectangles.some(r=>x>Number(r.getAttribute('x'))&&x<Number(r.getAttribute('x'))+104&&y>Number(r.getAttribute('y'))&&y<Number(r.getAttribute('y'))+50));
  }
  change('[aria-label="Activate e10 D to B"]',true);assert.equal(m.precedenceCycle(''),true);
  assert.match(d.querySelector('#topology-output').textContent,/Infeasible precedence loop/);
  change('#topology-failure','C');assert.equal(m.precedenceCycle('C'),false);
  change('#topology-failure','B');assert.equal(m.pathExists('A','D','B',['precedence']),false);assert.equal(m.pathExists('D','F','B',['evidence','approval']),true);
  assert.match(d.querySelector('#topology-output').textContent,/local paths do not test whether D or G can be reached from A/);
  assert.match(d.querySelector('#topology-output').textContent,/Precedence path A → D: no/);
  change('#topology-failure','E');assert.match(d.querySelector('#topology-output').textContent,/0 available feedback link/);
  assert.match(d.querySelector('#topology-text').textContent,/E — Reconcile evidence \(unavailable\)/);
  assert.throws(()=>m.pathExists('Z','F','',['precedence']));assert.throws(()=>m.pathExists('A','F','',['arbitrary']));
});

test('planner UI changes capacity, policy and stress view while regret retains three-scenario comparison', t => {
  const {m,d,click,change}=ui(t);click('#tab-planners');
  const {policies,scenarios}=m.model();
  for(const capacity of [1,2,3]){
    change('#planner-capacity',capacity);
    for(const policy of policies){
      change('#planner-policy',policy.id);
      for(const scenario of scenarios){
        change('#planner-scenario',scenario.id);
        assert.equal(d.querySelector('#schedule-title').textContent,`${policy.name} · ${scenario.name} schedule`);
        assert.equal(d.querySelectorAll('#schedule .schedule-row').length,8);
        const expected=m.simulate(policy.id,scenario,capacity);
        assert.match(d.querySelector('#planner-output').textContent,new RegExp(`Finish: week ${expected.finish};`));
        assert.equal(d.querySelectorAll('#policy-body tr.selected').length,1);
        assert.match(d.querySelector('#policy-body tr.selected').textContent,new RegExp(policy.name));
        const all=scenarios.map(s=>policies.map(p=>m.simulate(p.id,s,capacity).objective));
        const regret=all.reduce((sum,s)=>sum+s[policies.findIndex(p=>p.id===policy.id)]-Math.min(...s),0)/3;
        assert.equal(d.querySelector('#policy-body tr.selected td:nth-child(2)').textContent,regret.toFixed(1));
      }
    }
  }
});

test('portable settings round-trip every lens and view through actual export/import/reset handlers', t => {
  const {m,d,click,change}=ui(t);
  click('#demand-challenge');change('#assurance-body tr:nth-child(2) select','current');
  change('[data-scarcity-id="S1"][data-key="delay"]',4);change('#scarcity-pool',8);
  change('[aria-label="Activate e9 G to E"]',true);change('#topology-failure','D');
  change('#planner-capacity',3);change('#planner-policy','learning');change('#planner-scenario','data');click('#tab-planners');
  const edited=clone(m.snapshot());click('#state-export');const text=d.querySelector('#state-json').value;
  assert.deepEqual(JSON.parse(text),edited);assert.equal(d.activeElement,d.querySelector('#state-json'));
  click('#state-reset');assert.deepEqual(clone(m.snapshot()),clone(m.example()));
  assert.equal(d.querySelector('#state-json').value,text);
  click('#state-import');assert.deepEqual(clone(m.snapshot()),edited);
  assert.equal(d.querySelector('#panel-planners').hidden,false);assert.match(d.querySelector('#state-status').textContent,/Settings restored/);
});

test('imports validate the complete settings atomically, rejecting omitted IDs, invalid scalars, markup and unknown fields', t => {
  const {m,d,click}=ui(t), valid=clone(m.snapshot()), output=d.querySelector('#ledger-body').textContent;
  for(const mutate of [
    x=>x.version=2,x=>x.app='other',x=>x.extra=true,x=>x.demand.pop(),x=>x.demand[1].id=x.demand[0].id,
    x=>x.demand[0].action='<img src=x onerror=alert(1)>',x=>x.assurance[0].review='true',x=>x.assurance[0].evidence='fresh',
    x=>x.scarcity.pool=null,x=>x.scarcity.pool=13,x=>x.scarcity.demands[0].min=0,x=>x.scarcity.demands[0].confidence=-1,
    x=>x.topology.failure='A',x=>x.topology.edges[0].active=1,x=>x.planner.capacity=1.5,x=>x.planner.policy='unknown',
    x=>x.planner.scenario='future',x=>x.view='unknown'
  ]){
    const bad=clone(valid);bad.demand[0].action='proceed';mutate(bad);
    assert.throws(()=>m.restore(bad));assert.deepEqual(clone(m.snapshot()),valid);
    d.querySelector('#state-json').value=JSON.stringify(bad);click('#state-import');
    assert.match(d.querySelector('#state-status').textContent,/not loaded/);
    assert.deepEqual(clone(m.snapshot()),valid);assert.equal(d.querySelector('#ledger-body').textContent,output);
  }
  d.querySelector('#state-json').value=' '.repeat(20001);click('#state-import');assert.match(d.querySelector('#state-status').textContent,/20,000/);
  d.querySelector('#state-json').value='{bad';click('#state-import');assert.match(d.querySelector('#state-status').textContent,/not loaded/);
  const reordered=clone(valid);reordered.demand.reverse();reordered.scarcity.demands.reverse();m.restore(reordered);assert.deepEqual(clone(m.snapshot()),valid);
});

test('tabs have one tab stop, arrow/Home/End navigation, focusable panels, labelled controls and mobile table labels', t => {
  const {dom,d,click}=ui(t);
  const key=key=>d.activeElement.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key,bubbles:true}));
  d.querySelector('#tab-demand').focus();key('ArrowLeft');assert.equal(d.activeElement.id,'tab-planners');assert.equal(d.querySelector('#panel-planners').hidden,false);
  key('Home');assert.equal(d.activeElement.id,'tab-demand');key('End');assert.equal(d.activeElement.id,'tab-planners');key('ArrowRight');assert.equal(d.activeElement.id,'tab-demand');
  assert.equal(d.querySelectorAll('[role="tab"][tabindex="0"]').length,1);
  for(const panel of d.querySelectorAll('[role="tabpanel"]'))assert.equal(panel.tabIndex,0);
  for(const input of d.querySelectorAll('input,select,textarea'))assert.ok(input.getAttribute('aria-label')||input.closest('label')||d.querySelector(`label[for="${input.id}"]`),input.outerHTML);
  for(const cell of d.querySelectorAll('tbody td'))assert.ok(cell.dataset.label,cell.outerHTML);
  assert.ok(d.querySelector('noscript'));assert.equal(d.querySelector('link[rel="canonical"]').href,'https://lawrencerowland.github.io/library/apps/project-frontier-lab/');
});
