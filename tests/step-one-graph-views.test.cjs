const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { JSDOM } = createRequire(path.join(__dirname, '../tools/library-apps/package.json'))('jsdom');
const root = path.join(__dirname, '../library/apps/project-graph-views');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
function app() {
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {runScripts:'outside-only', url:'https://example.org/library/apps/project-graph-views/'});
  const w=dom.window; w.TextEncoder=TextEncoder;
  w.eval(source + '\nwindow.api={state,TEMPLATES,parseCSV,parseISODate,graphFromJSON,graphFromCSVs,normalizeGraph,canonicalGraphHash,loadGraph,runCurrent,buildDemoGraph,buildAuditZip,defaultParamValues,renderParamForm,renderDrilldown,buildItemsLinksCSVs,spreadsheetCSV};');
  const a=w.api;
  a.loadGraph(a.buildDemoGraph('2026-03-01'));w.document.querySelector('#today').value='2026-03-01';
  function run(id, params={}) {
    const role=w.document.querySelector('#role');role.value='All';role.dispatchEvent(new w.Event('change'));
    const selector=w.document.querySelector('#template');selector.value=id;selector.dispatchEvent(new w.Event('change'));
    Object.assign(a.state.params,params);
    return a.runCurrent(a.state);
  }
  return {w,a,run,close:()=>w.close()};
}
const plain=x=>JSON.parse(JSON.stringify(x));
const ids=r=>r.view.items.map(i=>i.external_id).sort();

test('all eight retained templates produce explicit, bounded graph views',()=>{
  const h=app();try{
    assert.equal(h.a.TEMPLATES.length,8);
    for(const t of h.a.TEMPLATES){
      const r=h.run(t.id);const nodes=new Set(r.view.items.map(n=>n.external_id));
      for(const e of r.view.links)assert.ok(nodes.has(e.from_external_id)&&nodes.has(e.to_external_id),t.id);
      assert.equal(r.receipt.outputs.items_exported,r.view.items.length);
      assert.equal(r.receipt.outputs.links_exported,r.view.links.length);
      assert.equal(r.receipt.snapshot.generated_at,r.view.meta.generated_at);
      assert.deepEqual(plain(r.receipt.snapshot.data_lineage),plain(r.view.meta.data_lineage));
      assert.ok(Object.hasOwn(r.receipt.deterministic,'parameters'));
    }
    assert.match(h.a.TEMPLATES.find(t=>t.id==='tpl_critical_path_watch').name,/Unfinished/);
  }finally{h.close();}
});

test('milestone risk view excludes unflagged milestones and counts each risk once across multiple upstream nodes',()=>{
  const h=app();try{
    let r=h.run('pmo_milestones_at_risk_90d',{window_days:365});
    assert.ok(ids(r).includes('M1'));assert.ok(!ids(r).includes('M2'));assert.ok(!ids(r).includes('WP2'));
    assert.equal(r.computed.get('M1').milestone_unmitigated_risks,1);
    assert.equal(r.computed.get('M1').milestone_max_risk_score_all,25);
    assert.equal(r.extras.tables[0].columns.at(-1),'max_risk_score_all');
    assert.match(h.w.document.querySelector('#extra').textContent,/including risks with a Control labelled Approved/);
    const g=plain(h.a.state.graph);
    g.edges.push({id:'extra-risk-path',from:'R1',to:'WP1',type:'introduces_risk'});
    h.a.loadGraph(g);r=h.run('pmo_milestones_at_risk_90d');
    assert.equal(r.computed.get('M1').milestone_unmitigated_risks,1);
    g.nodes.find(n=>n.id==='C1').props.state='Approved';h.a.loadGraph(g);
    assert.equal(h.run('pmo_milestones_at_risk_90d',{window_days:365}).view.items.length,0);
  }finally{h.close();}
});

test('red-risk owner filter works in both modes and includes connected controls',()=>{
  const h=app();try{
    let r=h.run('risk_unowned_red_hazards_on_interfaces');
    assert.ok(ids(r).includes('R1'));assert.ok(!ids(r).includes('R2'));assert.ok(!ids(r).includes('IF2'));
    assert.ok(r.view.links.some(e=>e.from_external_id==='R1'&&e.to_external_id==='C1'));
    r=h.run('risk_unowned_red_hazards_on_interfaces',{require_owner:'no'});
    assert.ok(ids(r).includes('R2'));assert.equal(r.computed.get('R2').owner_missing,false);
    assert.ok(ids(r).includes('IF2'));
  }finally{h.close();}
});

test('query dates and parameter boundaries do not silently normalize or fall back',()=>{
  const h=app();try{
    for(const value of ['2026-02-29','2026-04-31','2026-13-01','2026-00-10','bad'])assert.equal(h.a.parseISODate(value),null);
    assert.ok(h.a.parseISODate('2024-02-29'));
    h.run('tpl_90_day_risk_window');const previous=h.a.state.lastResult;
    for(const limit of ['','0','-1','1.2','2001']){
      h.w.document.querySelector('#limit').value=limit;
      assert.throws(()=>h.a.runCurrent(h.a.state),/Limit/);assert.equal(h.a.state.lastResult,previous);
    }
    h.w.document.querySelector('#limit').value='1';
    const r=h.a.runCurrent(h.a.state);
    assert.equal(r.view.items.length,1);assert.equal(r.view.meta.limit,1);assert.equal(r.receipt.deterministic.limit,1);assert.equal(r.receipt.outputs.truncated,true);
    assert.throws(()=>h.run('tpl_change_heatmap',{days:0}),/whole number/);
    assert.equal(h.run('tpl_critical_path_watch',{not_done_states:[]}).view.items.length,0);
  }finally{h.close();}
});

test('malformed graph imports reject transactionally, including duplicate IDs, dates, shapes and dangling links',()=>{
  const h=app();try{
    h.run('tpl_owner_load');const previous=h.a.state.graph,result=h.a.state.lastResult;
    const corrupt=[null,{nodes:{},edges:[]},{nodes:[{}],edges:[]}];
    for(const change of [g=>g.nodes.push(g.nodes[0]),g=>g.edges.push(g.edges[0]),g=>g.edges[0].to='missing',g=>g.nodes[0].props.target_date='2026-02-30',g=>g.nodes[0].tags='bad',g=>g.nodes[0].props={risk_score:Infinity}]){const g=plain(previous);change(g);corrupt.push(g);}
    for(const g of corrupt){assert.throws(()=>h.a.loadGraph(g));assert.equal(h.a.state.graph,previous);assert.equal(h.a.state.lastResult,result);}
    assert.throws(()=>h.a.graphFromJSON('{"nodes":[{"id":"n","type":"Risk","title":"bad","props":{"risk_score":1e400}}],"edges":[]}'),/non-finite/);
  }finally{h.close();}
});

test('CSV quotation, headers, rows and empty edge sets are validated without silently dropping records',()=>{
  const h=app();try{
    const g=h.a.graphFromCSVs('id,type,title\na,Risk,"quoted, title\nsecond line"','from,to,type');
    assert.equal(g.nodes[0].title,'quoted, title\nsecond line');assert.equal(g.edges.length,0);
    for(const text of ['id,type,title\na,Risk,"unfinished','id,id,title\na,Risk,x','id,type,title\na,Risk','id,type,title\na,Risk,x,extra','id,type,title\n,Risk,x'])assert.throws(()=>h.a.graphFromCSVs(text,'from,to,type'));
    h.a.loadGraph({nodes:[],edges:[]});assert.equal(h.run('tpl_owner_load').view.items.length,0);
  }finally{h.close();}
});

test('editable CSV preserves custom scalars, zero, false, null, absent properties and delimiter-bearing tags',()=>{
  const h=app();try{
    const g={nodes:[{id:'__proto__',type:'Risk',title:'One',tags:['a|b'],props:JSON.parse('{"risk_score":0,"flag":false,"nothing":null,"__proto__":"kept","title":"custom"}')},{id:'constructor',type:'Risk',title:'Two',props:{}}],edges:[]};
    h.a.loadGraph(g);
    const round=h.a.graphFromCSVs(h.w.document.querySelector('#nodesCsv').value,h.w.document.querySelector('#edgesCsv').value);
    assert.deepEqual(plain(round.nodes[0].props),g.nodes[0].props);assert.deepEqual(plain(round.nodes[0].tags),g.nodes[0].tags);assert.deepEqual(plain(round.nodes[1].props),{});
    const r=h.run('tpl_owner_load');assert.equal(r.view.items.length,2);assert.match(r.itemsCsv,/attribute:title/);
  }finally{h.close();}
});

test('loaded graph clears all old result surfaces and generated exports use the new graph',()=>{
  const h=app();try{
    h.run('tpl_owner_load');h.w.document.querySelector('#graphJson').value='{"nodes":[],"edges":[]}';h.w.document.querySelector('#loadGraphJson').click();
    assert.equal(h.a.state.lastResult,null);assert.equal(h.w.document.querySelector('#receiptOut').textContent,'');assert.equal(h.w.document.querySelector('#lineageNodes').textContent,'');
    assert.equal(h.run('tpl_owner_load').view.items.length,0);
  }finally{h.close();}
});

test('assurance evidence exports preserve paths and lineage endpoints even when cards are truncated',()=>{
  const h=app();try{
    const r=h.run('tpl_assurance_trail',{milestone_id:'M1'});
    assert.ok(r.view.links.some(e=>e.from_external_id==='R2'&&e.to_external_id==='C2'));
    assert.ok(r.view.links.some(e=>e.from_external_id==='C2'&&e.to_external_id==='E1'));
    h.w.document.querySelector('#limit').value='1';const limited=h.a.runCurrent(h.a.state);
    const lineNodes=new Set(limited.lineageExports.nodeRows.slice(1).map(r=>r[0]));
    for(const e of limited.lineageExports.edgeRows.slice(1)){assert.ok(lineNodes.has(e[1]));assert.ok(lineNodes.has(e[2]));}
    assert.equal(limited.view.links.length,0);
  }finally{h.close();}
});

test('imported strings render as text, cards are keyboard operable and computed attributes cannot overwrite source values',()=>{
  const h=app();try{
    const g={nodes:[{id:'<img src=x>',type:'Risk',title:'<img src=x onerror="alert(1)">',tags:['<svg onload=bad>'],props:{owner:'<b>owner</b>',review_overdue:'source',computed_review_overdue:'also source'}}],edges:[]};
    h.a.loadGraph(g);const r=h.run('tpl_owner_load');
    assert.equal(h.w.document.querySelectorAll('#cards img,#cards svg').length,0);
    const card=h.w.document.querySelector('.card');card.dispatchEvent(new h.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    assert.match(h.w.document.querySelector('#drill').textContent,/Included by rules/);assert.equal(h.w.document.querySelectorAll('#drill img,#drill b owner').length,0);
    assert.equal(r.view.items[0].attributes.review_overdue,'source');assert.equal(r.view.items[0].attributes.computed_review_overdue,'also source');assert.equal(r.view.items[0].attributes.computed_computed_review_overdue,false);
  }finally{h.close();}
});

test('canonical checksum is stable under record and property order, while CSV neutralizes formula-leading text',()=>{
  const h=app();try{
    const g=plain(h.a.state.graph), swapped=plain(g);swapped.nodes.reverse();swapped.edges.reverse();
    assert.equal(h.a.canonicalGraphHash(g),h.a.canonicalGraphHash(swapped));
    swapped.nodes[0].title+=' changed';assert.notEqual(h.a.canonicalGraphHash(g),h.a.canonicalGraphHash(swapped));
    assert.equal(h.a.spreadsheetCSV([['=1+1','@cmd','normal',-2]]),"'=1+1,'@cmd,normal,-2");
  }finally{h.close();}
});

test('ZIP contains all promised exports from the same successful query',async()=>{
  const h=app();try{
    const r=h.run('tpl_owner_load');const blob=h.a.buildAuditZip(h.a.state);
    const data=await new Promise((resolve,reject)=>{const reader=new h.w.FileReader();reader.onload=()=>resolve(Buffer.from(reader.result));reader.onerror=reject;reader.readAsArrayBuffer(blob);});
    const files=new Map();let offset=0;
    while(data.readUInt32LE(offset)===0x04034b50){const size=data.readUInt32LE(offset+18),len=data.readUInt16LE(offset+26),extra=data.readUInt16LE(offset+28),name=data.subarray(offset+30,offset+30+len).toString();const start=offset+30+len+extra;files.set(name.split('/').pop(),data.subarray(start,start+size).toString());offset=start+size;}
    assert.equal(files.size,11);assert.deepEqual(JSON.parse(files.get('sharpcloud-view.json')),plain(r.view));assert.deepEqual(JSON.parse(files.get('receipt.json')),plain(r.receipt));assert.equal(files.get('items.csv'),r.itemsCsv);assert.equal(JSON.parse(files.get('saved-searches.json')).templates.length,8);assert.match(files.get('README.txt'),/not a cryptographic signature/);
  }finally{h.close();}
});

test('date windows and review/engineering thresholds include only their stated boundary cases',()=>{
  const h=app();try{
    const g=plain(h.a.state.graph);
    g.nodes.find(n=>n.id==='D1').props.decision_date='2026-02-15'; // exactly 14 days old
    g.nodes.find(n=>n.id==='D3').props.decision_date='2026-03-01';
    g.nodes.find(n=>n.id==='R1').props.review_due='2026-03-01';
    g.nodes.find(n=>n.id==='R2').props.review_due='2026-02-28';
    h.a.loadGraph(g);
    assert.equal(h.run('eng_asset_interfaces_stale_proposed_changes',{asset:'Viaduct',age_days:14}).view.items.length,0);
    assert.ok(ids(h.run('eng_asset_interfaces_stale_proposed_changes',{asset:'Viaduct',age_days:13})).includes('D1'));
    let r=h.run('tpl_change_heatmap',{days:14});assert.ok(ids(r).includes('D1'));assert.ok(ids(r).includes('D3'));assert.ok(!ids(r).includes('D2'));
    r=h.run('tpl_owner_load');assert.equal(r.computed.get('R1').review_overdue,false);assert.equal(r.computed.get('R2').review_overdue,true);
    const due=g.nodes.find(n=>n.id==='IF1');due.props.target_date='2026-05-30';h.a.loadGraph(g);
    assert.ok(ids(h.run('tpl_90_day_risk_window',{window_days:90})).includes('IF1'));
    due.props.target_date='2026-05-31';h.a.loadGraph(g);assert.ok(!ids(h.run('tpl_90_day_risk_window',{window_days:90})).includes('IF1'));
  }finally{h.close();}
});

test('known relationship endpoint types are enforced and parallel dependency edges do not double-count tasks',()=>{
  const h=app();try{
    const g=plain(h.a.state.graph);g.edges.push({id:'parallel',from:'WP1',to:'M1',type:'depends_on'});h.a.loadGraph(g);
    const r=h.run('tpl_critical_path_watch');assert.equal(r.computed.get('M1').blocking_tasks,1);
    g.edges.push({id:'bad-proof',from:'C1',to:'WP1',type:'verified_by'});assert.throws(()=>h.a.loadGraph(g),/expects/);
  }finally{h.close();}
});
