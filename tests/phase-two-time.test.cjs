'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=path.join(__dirname,'../library/apps/project-time-exchange'),M=require(path.join(dir,'model.js'));
const {JSDOM}=require('node:module').createRequire(path.join(__dirname,'../tools/library-apps/package.json'))('jsdom');
const exampleContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(dir,'example.js'),'utf8'),exampleContext);const example=JSON.parse(JSON.stringify(exampleContext.window.TimeExchangeExample));
const activity=(duration,options=[],extra={})=>({name:'Task',duration,crashOptions:[{duration,cost:0},...options],...extra});
const simple={activities:{A:activity(4,[{duration:2,cost:5}]),B:activity(3,[{duration:1,cost:4}]),C:activity(2,[{duration:1,cost:3}])},precedences:[{from:'A',to:'C'},{from:'B',to:'C'}]};
function referenceSchedule(data,choices){
 const ids=Object.keys(data.activities).sort(),dur=Object.fromEntries(ids.map((id,i)=>[id,data.activities[id].crashOptions[choices[i]].duration])),pred=Object.fromEntries(ids.map(id=>[id,[]])),succ=Object.fromEntries(ids.map(id=>[id,[]]));for(const e of data.precedences){pred[e.to].push(e.from);succ[e.from].push(e.to);}
 const paths=[];function walk(id,path){const next=[...path,id];if(!succ[id].length)paths.push(next);else for(const child of succ[id])walk(child,next);}ids.filter(id=>!pred[id].length).forEach(id=>walk(id,[]));
 const sums=paths.map(p=>p.reduce((sum,id)=>sum+dur[id],0)),finish=Math.max(...sums);
 return {finish,rows:ids.map(id=>{const containing=paths.map((p,i)=>[p,sums[i]]).filter(([p])=>p.includes(id)),ES=Math.max(...containing.map(([p])=>p.slice(0,p.indexOf(id)).reduce((s,i)=>s+dur[i],0))),float=finish-Math.max(...containing.map(([,sum])=>sum));return {id,ES,EF:ES+dur[id],LS:ES+float,LF:ES+float+dur[id],float};})};
}
function referenceCombos(data){const ids=Object.keys(data.activities).sort(),out=[];function walk(choices){if(choices.length===ids.length){const cost=choices.reduce((s,o,i)=>s+data.activities[ids[i]].crashOptions[o].cost,0);out.push({choices:choices.slice(),cost,finish:referenceSchedule(data,choices).finish});return;}data.activities[ids[choices.length]].crashOptions.forEach((_,o)=>walk([...choices,o]));}walk([]);return out;}
function referenceFrontier(all){const points=all.filter(p=>!all.some(q=>q.cost<=p.cost&&q.finish<=p.finish&&(q.cost<p.cost||q.finish<p.finish)));return [...new Map(points.map(p=>[JSON.stringify([p.cost,p.finish]),[p.cost,p.finish]])).values()].sort((a,b)=>a[0]-b[0]);}

test('CPM forward/backward times match independent complete-path enumeration for every small portfolio',()=>{
 for(const p of referenceCombos(simple)){const actual=M.schedule(simple,p.choices),expected=referenceSchedule(simple,p.choices);assert.equal(actual.finish,expected.finish);for(const r of expected.rows){const a=actual.rows.find(x=>x.id===r.id);for(const key of ['ES','EF','LS','LF','float'])assert.equal(a[key],r[key]);assert.equal(a.critical,r.float===0);}}
 assert.equal(M.schedule(example).finish,25);
});

test('exhaustive frontier matches pairwise dominance and welfare optimum obeys every budget',()=>{
 const ref=referenceCombos(simple),front=referenceFrontier(ref),T0=referenceSchedule(simple,[0,0,0]).finish;
 for(const budget of [0,3,4,5,7,8,12])for(const valueOfTime of [0,1,3,10]){const r=M.analyse(simple,{budget,valueOfTime});assert.equal(r.portfolioCount,8);assert.deepEqual(r.frontier.map(p=>[p.cost,p.finish]),front);assert.ok(r.knee.cost<=budget);assert.ok(r.welfare.cost<=budget);const best=ref.filter(p=>p.cost<=budget).sort((a,b)=>(valueOfTime*(T0-b.finish)-b.cost)-(valueOfTime*(T0-a.finish)-a.cost)||a.cost-b.cost||a.finish-b.finish)[0];assert.equal(r.welfare.cost,best.cost);assert.equal(r.welfare.finish,best.finish);}
});

test('zero-edge graphs, zero durations and faster free options preserve the declared baseline',()=>{
 const d={activities:{A:activity(4,[{duration:2,cost:0}]),B:activity(1)},precedences:[]};const r=M.analyse(d,{budget:0,valueOfTime:8});assert.equal(r.baseline.finish,4);assert.equal(r.welfare.finish,2);assert.equal(r.welfare.cost,0);assert.equal(r.welfareValue,16);assert.equal(r.baseline.rows[0].optionIndex,0);
 const zero=M.analyse({activities:{A:activity(0),B:activity(0)},precedences:[]},{budget:0,valueOfTime:0});assert.equal(zero.frontier.length,1);assert.equal(zero.welfareValue,0);assert.ok(zero.baseline.rows.every(r=>r.critical&&r.float===0));
});

test('decimal budget is enforced in integer millionths and equal net value prefers lower cost',()=>{
 const d={activities:{A:activity(1,[{duration:0.5,cost:0.1}]),B:activity(1,[{duration:0.5,cost:0.2}])},precedences:[{from:'A',to:'B'}]};const r=M.analyse(d,{budget:0.3,valueOfTime:1});assert.equal(r.welfare.cost,0.3);assert.equal(r.welfare.finish,1);
 const tied=M.analyse({activities:{A:activity(2,[{duration:1,cost:0.1}])},precedences:[]},{budget:0.1,valueOfTime:0.1});assert.equal(tied.welfare.cost,0);assert.equal(tied.welfareValue,0);
 assert.throws(()=>M.units(0.1234567,'Value'),/six decimal/);
});

test('knee normalisation is invariant to cost units and has declared short/flat-frontier tie behaviour',()=>{
 const points=[{id:0,costUnits:0,finishUnits:100},{id:1,costUnits:10,finishUnits:50},{id:2,costUnits:100,finishUnits:0}];assert.equal(M.knee(points).id,1);assert.equal(M.knee(points.map(p=>({...p,costUnits:p.costUnits*1000}))).id,1);assert.equal(M.knee(points.slice(0,2)).id,1);assert.equal(M.knee([{id:0,costUnits:0,finishUnits:100},{id:1,costUnits:50,finishUnits:50},{id:2,costUnits:100,finishUnits:0}]).id,0);
});

test('malformed fields, floors, cycles, duplicated/dangling arcs and oversized enumerations reject before work',()=>{
 const copy=()=>JSON.parse(JSON.stringify(simple));
 for(const mutate of [d=>d.activities.A.duration=Infinity,d=>d.activities.A.crashOptions[1].cost=-1,d=>d.activities.A.crashOptions[1].duration=-1,d=>d.activities.A.crashOptions[1].duration=5,d=>d.activities.A.floor=3,d=>d.activities.A.crashOptions[0].cost=1,d=>d.activities.A=null,d=>d.precedences.push({from:'C',to:'A'}),d=>d.precedences.push({from:'A',to:'A'}),d=>d.precedences.push({from:'missing',to:'C'}),d=>d.precedences.push(d.precedences[0]),d=>d.activities.A.crashOptions=[],d=>d.precedences=[null]]){const d=copy();mutate(d);assert.throws(()=>M.validate(d));}
 const large={activities:Object.fromEntries(Array.from({length:16},(_,i)=>['T'+i,activity(2,[{duration:1,cost:1}])])),precedences:[]};assert.throws(()=>M.validate(large),/enumeration cap/);assert.throws(()=>M.validate({activities:{},precedences:[]}),/1–40/);
 assert.throws(()=>M.parse('{"activities":{"A":{"duration":1,"crashOptions":[{"duration":1,"cost":0},{"duration":0,"cost":1e400}]}},"precedences":[]}'),/finite/);
 assert.deepEqual(simple,copy());
});

test('reserved IDs are ordinary activities and exports preserve menu/source/schedule context with safe CSV text',()=>{
 const activities=JSON.parse('{"__proto__":{"name":"=HYPERLINK(\"\"x\"\")","duration":2,"crashOptions":[{"duration":2,"cost":0}]}}'.replace('=HYPERLINK(\"\"x\"\")','formula'));activities.__proto__.name='=cmd,"quoted"\nnext';activities.constructor=activity(1);const d={activities,precedences:[{from:'__proto__',to:'constructor'}]},r=M.analyse(d,{budget:0,valueOfTime:3}),report=M.selectedReport(d,r,r.welfare,'welfare');
 assert.equal(report.baseline.finish,3);assert.equal(report.dataset.activities.__proto__.name,activities.__proto__.name);assert.equal(M.parse(JSON.stringify(report)).data.activities.__proto__.name,activities.__proto__.name);assert.match(M.scheduleCSV(report),/"'=cmd,""quoted""\r?\nnext"/);assert.match(M.scheduleCSV(report),/option_cost/);assert.match(M.frontierCSV(report),/options_by_sorted_activity_id/);assert.equal(report.assumptions.paymentMechanism,'not implemented');assert.equal(report.frontier.length,r.frontier.length);
});

const sleep=()=>new Promise(setImmediate);
async function page(t){const dom=new JSDOM(fs.readFileSync(path.join(dir,'index.html'),'utf8'),{runScripts:'outside-only',url:'https://example.test/library/apps/project-time-exchange/'});t.after(()=>dom.window.close());const w=dom.window;for(const file of ['model.js','example.js','app.js'])w.eval(fs.readFileSync(path.join(dir,file),'utf8'));const $=id=>w.document.getElementById(id);async function idle(){for(let i=0;i<100;i++){if($('cancel').hidden&&$('result-json').value)return;await new Promise(r=>setTimeout(r,2));}throw Error('UI did not complete');}await idle();return {w,$,idle,snapshot:()=>JSON.parse($('result-json').value),input(id,value){$(id).value=value;$(id).dispatchEvent(new w.Event('input',{bubbles:true}));},file(text,size=100){Object.defineProperty($('file'),'files',{configurable:true,value:[{size,text}]});$('file').dispatchEvent(new w.Event('change'));}};}

test('actual UI budget/choice controls prevent over-budget selection and export the applied settings',async t=>{
 const p=await page(t);assert.ok(p.snapshot().selection.cost<=300);p.input('budget','0');p.$('run-all').click();await p.idle();assert.equal(p.snapshot().settings.budget,0);assert.equal(p.snapshot().selection.cost,0);assert.ok([...p.w.document.querySelectorAll('[data-portfolio]')].some(b=>b.disabled));
 p.input('value','0');p.$('welfare').click();await p.idle();assert.equal(p.snapshot().selection.cost,0);assert.equal(p.snapshot().settings.valueOfTime,0);assert.match(p.$('summary').textContent,/Baseline weeks/);
});

test('actual UI malformed JSON/menu edits are atomic and a valid edit clears stale output before rerun',async t=>{
 const p=await page(t),before=p.$('result-json').value;p.input('activities','{broken');p.$('apply').click();assert.equal(p.$('result-json').value,before);assert.ok(p.$('error').textContent);
 p.input('activities',JSON.stringify({A:activity(2,[{duration:1,cost:-1}])}));p.input('precedences','[]');p.$('apply').click();assert.equal(p.$('result-json').value,before);
 p.input('activities',JSON.stringify({A:activity(2,[{duration:1,cost:1}],{name:'<img src=x onerror=alert(1)>'})}));p.$('apply').click();assert.equal(p.$('result-json').value,'');p.$('welfare').click();await p.idle();assert.equal(p.snapshot().baseline.finish,2);assert.equal(p.w.document.querySelectorAll('#schedule-table img').length,0);assert.match(p.$('schedule-table').textContent,/<img/);
});

test('actual UI cancellation preserves last completed result and newer file loads win over stale successes/errors',async t=>{
 const p=await page(t),before=p.$('result-json').value;p.$('run-all').click();assert.equal(p.$('cancel').hidden,false);p.$('cancel').click();await new Promise(r=>setTimeout(r,10));assert.equal(p.$('result-json').value,before);
 let releaseA;p.file(()=>new Promise(r=>releaseA=r));p.file(async()=>JSON.stringify({activities:{Newest:activity(7)},precedences:[]}));await sleep();await p.idle();assert.equal(p.snapshot().baseline.finish,7);releaseA(JSON.stringify({activities:{Stale:activity(90)},precedences:[]}));await sleep();assert.equal(p.snapshot().baseline.finish,7);
 let rejectA;p.file(()=>new Promise((_,r)=>rejectA=r));p.file(async()=>JSON.stringify({activities:{NewestAgain:activity(6)},precedences:[]}));await sleep();await p.idle();rejectA(Error('stale read error'));await sleep();assert.equal(p.snapshot().baseline.finish,6);assert.doesNotMatch(p.$('error').textContent,/stale/);
});

test('actual UI result import recomputes derived values and keyboard frontier selection remains budget feasible',async t=>{
 const p=await page(t),exported=p.snapshot();exported.baseline.finish=-100;exported.selectedSchedule.finish=-100;exported.selection.finish=-100;p.file(async()=>JSON.stringify(exported));await sleep();await p.idle();assert.equal(p.snapshot().baseline.finish,25);
 const dot=p.w.document.querySelector('#frontier-chart [role="button"][aria-disabled="false"]');dot.focus();dot.dispatchEvent(new p.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.equal(p.snapshot().selection.mode,'manual');assert.ok(p.snapshot().selection.cost<=p.snapshot().settings.budget);assert.equal(p.w.document.activeElement.dataset.portfolio,dot.dataset.portfolio);assert.equal(p.w.document.activeElement.tagName,'circle');assert.ok(p.w.document.activeElement.isConnected);
});


test('actual UI imported selection is descriptive, never trusted as a welfare-optimal choice',async t=>{
 const p=await page(t),report=p.snapshot();report.selection={mode:'welfare',choices:Array(7).fill(0)};
 p.file(async()=>JSON.stringify(report));await sleep();await p.idle();
 assert.equal(p.snapshot().selection.cost,0);assert.equal(p.snapshot().selection.mode,'manual');
});

test('actual UI a replaced imported enumeration cannot restore its old selection into the newer result',async t=>{
 const p=await page(t),queued=[],report=p.snapshot();report.selection={mode:'welfare',choices:Array(7).fill(0)};
 p.w.setTimeout=fn=>{queued.push(fn);return queued.length;};
 p.file(async()=>JSON.stringify(report));await sleep();assert.equal(queued.length,1);assert.equal(p.$('cancel').hidden,false);
 const ids=['A','B','C','D','E','F','G'],next={activities:Object.fromEntries(ids.map(id=>[id,activity(2,[{duration:1,cost:1}],{name:'New '+id})])),precedences:ids.slice(1).map((id,i)=>({from:ids[i],to:id}))};
 p.file(async()=>JSON.stringify(next));await sleep();assert.equal(p.snapshot().selection.cost,7);assert.equal(p.snapshot().selection.mode,'welfare');
 for(const fn of queued)fn();await sleep();
 assert.equal(p.snapshot().dataset.activities.A.name,'New A');assert.equal(p.snapshot().selection.cost,7);assert.equal(p.snapshot().selection.mode,'welfare');
});
