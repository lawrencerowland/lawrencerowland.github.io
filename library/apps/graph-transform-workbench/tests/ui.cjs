/* DOM interaction regressions; no browser, server or new package. Actual layout/focus
   and visual interaction are checked separately through the ordinary browser UI. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../../../../tools/library-apps/node_modules/jsdom');
const root=path.resolve(__dirname,'..');
function boot(){
 const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{runScripts:'outside-only',url:'https://example.test/library/apps/graph-transform-workbench/'}),w=dom.window,d=w.document,timers=[],downloads=[],blobs=new Map(),errors=[];
 w.addEventListener('error',e=>errors.push(e.error?.message||e.message));
 w.setTimeout=fn=>{timers.push(fn);return timers.length;};
 w.Blob=class{constructor(parts,options){this.text=parts.join('');this.type=options?.type;}};
 w.URL.createObjectURL=blob=>{const key=`blob:test-${blobs.size}`;blobs.set(key,blob);return key;};w.URL.revokeObjectURL=key=>blobs.delete(key);
 w.HTMLAnchorElement.prototype.click=function(){downloads.push({name:this.download,text:blobs.get(this.href)?.text});};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 for(const file of ['model.js','app.js'])w.eval(fs.readFileSync(path.join(root,file),'utf8'));
 const $=id=>d.getElementById(id),click=id=>$(id).click(),change=(id,value)=>{$(id).value=value;$(id).dispatchEvent(new w.Event('change',{bubbles:true}));},input=(id,value)=>{$(id).value=value;$(id).dispatchEvent(new w.Event('input',{bubbles:true}));},flush=()=>{while(timers.length)timers.shift()();};
 return {dom,w,d,$,click,change,input,flush,downloads,errors};
}
(async()=>{
 const ctx=boot(),{dom,w,d,$,click,change,input,flush,downloads,errors}=ctx;
 try{
  assert.equal($('msNow').textContent,'19 days');assert.equal(d.querySelectorAll('#scheduleGraph .node').length,7);assert.equal(d.querySelectorAll('#scheduleGraph .edge').length,8);
  click('delayAB');assert.equal($('msNow').textContent,'21 days');click('resetAll');flush();assert.equal($('msNow').textContent,'19 days');assert.equal(d.querySelectorAll('#scheduleGraph .stepping').length,0);
  change('view','both');change('rule','mean');assert.equal($('msNow').textContent,'19 days');change('nodeSelect','D');input('delay','12');click('apply');assert.equal($('msNow').textContent,'25 days');
  click('scheduleExport');assert.equal(downloads.at(-1).name,'installation-schedule-snapshot.json');const schedule=JSON.parse(downloads.at(-1).text);assert.equal(schedule.result.makespan,25);assert.equal(schedule.localDelays.D,12);assert.deepEqual(schedule.graph.nodes.map(n=>n.tier),[1,2,2,3,3,3,4]);
  click('tab-sandbox');assert.equal($('sandbox').hidden,false);assert.equal($('schedule').hidden,true);const initial=$('sandboxAfter').textContent;
  input('sandboxInput','{"nodes":[{"id":"A"}],"edges":[{"source":"A","target":"unknown"}]}');click('sandboxParse');assert.match($('importMessage').textContent,/unchanged/);assert.equal($('sandboxAfter').textContent,initial);
  click('loadWeight');click('sandboxParse');assert.match($('timingReport').textContent,/3 days/);click('braidRun');assert.match($('timingReport').textContent,/3 days/);assert.match($('invariantReport').textContent,/Changed maximum path weights among retained nodes: 0/);assert.equal(JSON.parse($('sandboxAfter').textContent).nodes.length,3);
  click('sandboxUndo');assert.equal(JSON.parse($('sandboxAfter').textContent).nodes.length,2);click('sandboxRedo');assert.equal(JSON.parse($('sandboxAfter').textContent).nodes.length,3);
  click('downloadJson');assert.equal(downloads.at(-1).name,'graph-current.json');const exported=downloads.at(-1).text;
  Object.defineProperty($('graphFile'),'files',{value:[{name:'roundtrip.json',size:exported.length,text:async()=>exported}],configurable:true});$('graphFile').dispatchEvent(new w.Event('change'));await new Promise(resolve=>setImmediate(resolve));assert.match($('importMessage').textContent,/roundtrip.json/);click('sandboxParse');assert.deepEqual(JSON.parse($('sandboxAfter').textContent),JSON.parse(exported));
  click('loadCoupling');click('sandboxParse');change('contractMode','owner');click('groupApply');assert.match($('groupReport').textContent,/contains a cycle/);assert.match($('timingReport').textContent,/3 days/);$('braidReuse').checked=true;click('braidRun');assert.match($('timingReport').textContent,/unavailable/);assert.match($('invariantReport').textContent,/absent before → present after/);
  click('sandboxSample');click('sandboxParse');input('filterOwner','Reg');click('sandboxApply');assert.equal(JSON.parse($('sandboxAfter').textContent).nodes.length,1);click('sandboxReset');assert.equal(JSON.parse($('sandboxAfter').textContent).nodes.length,5);
  input('pruneTag','');input('pruneIds','S2');click('pruneRun');assert.deepEqual(JSON.parse($('sandboxAfter').textContent).nodes.map(n=>n.id),['S1','S2']);click('sandboxUndo');
  click('exportCsv');await Promise.resolve();assert.match($('exportPreview').value,/edge_id,source,target/);assert.match($('exportMessage').textContent,/Clipboard unavailable/);click('downloadCsv');assert.deepEqual(downloads.slice(-2).map(x=>x.name),['graph-nodes.csv','graph-edges.csv']);click('downloadDot');assert.match(downloads.at(-1).text,/digraph G/);
  click('tab-theory');const explainers=[...$('explainerButtons').querySelectorAll('button')];assert.equal(explainers.length,10);explainers[0].click();assert.equal($('explainerModal').open,true);assert.match($('explainerBody').textContent,/not make a many-to-one transformation invertible/);click('closeExplainer');assert.equal($('explainerModal').open,false);
  click('tab-agents');click('runAgents');assert.match($('agentReceipts').textContent,/Strict baseline/);let output=JSON.parse($('agentOutput').textContent);assert.equal(output.trades.length,2);assert.equal(output.deficits.length,1);change('policyMode','liberal');click('runAgents');output=JSON.parse($('agentOutput').textContent);assert.equal(output.windowDeltas.A1,4);click('agentExport');const comparison=JSON.parse(downloads.at(-1).text);assert.equal(comparison.input.tasks.length,3);assert.equal(comparison.baseline.policy,'strict');assert.equal(comparison.result.policy,'liberal');
  for(const preset of ['crane','design']){change('agentPreset',preset);click('loadPreset');click('runAgents');assert.equal(JSON.parse($('agentOutput').textContent).trades.length,2);}
  input('agentInput','{"tasks":[],"resources":"bad"}');click('runAgents');assert.equal($('agentExport').disabled,true);assert.match($('agentOutput').textContent,/No current comparison/);assert.equal($('agentCsv').value,'');
  click('tab-schedule');$('tab-schedule').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal($('tab-sandbox').getAttribute('aria-selected'),'true');
  assert.equal(d.querySelector('link[rel=canonical]').href,'https://lawrencerowland.github.io/library/apps/graph-transform-workbench/');assert.match(d.querySelector('noscript').textContent,/JavaScript/);assert.equal(d.querySelectorAll('a[href^="samples/"]').length,7);
  const restarted=boot();assert.equal(restarted.$('msNow').textContent,'19 days');assert.equal(restarted.$('agentExport').disabled,true);restarted.dom.window.close();
  assert.deepEqual(errors,[]);console.log('DOM interaction checks passed: task/lag changes and stale animation cancellation; snapshot contents; transactional import; subdivision/coupling/grouping; undo/redo; file/JSON round trip; filters/pruning; CSV/DOT and clipboard fallback; all ten explanations; three offer presets; invalid-result clearing; keyboard tabs; fresh-session reset.');
 }finally{dom.window.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
