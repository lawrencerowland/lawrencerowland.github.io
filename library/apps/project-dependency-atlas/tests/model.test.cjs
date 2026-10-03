const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const M = require('../model.js');
const copy = x => JSON.parse(JSON.stringify(x));
const graph = (groups, edges) => ({ hierarchy: { name: 'root', children: groups.map(([name, leaves])=>({name,children:leaves.map(name=>({name}))})) }, imports: edges.map(([s,t])=>({s,t})) });
const task = (name,start,end,status='active',milestone=false)=>({task:name,start,end,status,milestone});
const timeline = streams => ({streams:streams.map(([name,tasks])=>({name,tasks}))});

test('all historical datasets, labels, dates, colours and supplied narrative are retained exactly',()=>{
  // Golden digest is of JSON.stringify({bundles: SCENARIOS, timelines: TIMELINE_SCENARIOS, sourceDate})
  // independently evaluated from pinned source 8221f32 / blob abe993f88bdc34492f67cbcc50f96f0652ae9d7b.
  const digest=crypto.createHash('sha256').update(JSON.stringify(M.data)).digest('hex');
  assert.equal(digest,'761d351004ed7824bc875e556460ce4c704adee2fde931171f5d88656f6964f7');
  assert.deepEqual(Object.keys(M.data.bundles),['pennine','srp']);assert.deepEqual(Object.keys(M.data.timelines),['portfolio','pennine-tl']);
});

test('both source graph counts and busiest-node directions are computed from listed edges',()=>{
  assert.deepEqual(M.graphSummary(M.data.bundles.pennine),{nodes:22,groups:5,edges:36,crossGroup:23,internal:13,busiest:[{name:'Design Integration',incident:11,incoming:5,outgoing:6}]});
  assert.deepEqual(M.graphSummary(M.data.bundles.srp),{nodes:23,groups:6,edges:28,crossGroup:13,internal:15,busiest:[{name:'Reg Approval Gate',incident:6,incoming:3,outgoing:3}]});
  for(const example of Object.values(M.data.bundles)){
    const all=M.graph(example), incoming=all.nodes.reduce((sum,n)=>sum+n.incoming.length,0),outgoing=all.nodes.reduce((sum,n)=>sum+n.outgoing.length,0);
    assert.equal(incoming,all.edges.length);assert.equal(outgoing,all.edges.length);
    assert.equal(M.visibleEdges(example,'cross').length+M.visibleEdges(example,'internal').length,all.edges.length);
  }
});

test('degree is independent of narrative, includes ties, and does not become a critical-path calculation',()=>{
  const g=graph([['A',['a','b']],['B',['c','isolated']]],[['a','b'],['b','c'],['c','a'],['a','a']]);
  const s=M.graphSummary(g);assert.equal(s.edges,4);assert.equal(s.crossGroup,2);assert.deepEqual(M.nodeDetail(g,'a'),{name:'a',group:'A',incoming:['c','a'],outgoing:['b','a'],incident:3});
  assert.equal(M.nodeDetail(g,'isolated').incident,0);
  g.imports.pop();assert.deepEqual(M.graphSummary(g).busiest.map(n=>n.name),['a','b','c']);
  g.meta=[{label:'Critical path',value:'invented'}];g.insight={title:'collision',text:'100% float consumed'};
  assert.deepEqual(M.graphSummary(g).busiest.map(n=>n.name),['a','b','c']);
  assert.equal('criticalPath' in M.graphSummary(g),false);
});

test('bad graph input is rejected instead of silently dropping a dependency',()=>{
  const base=graph([['A',['a','b']],['B',['c']]],[['a','b']]);
  for(const edit of [g=>g.imports.push({s:'absent',t:'a'}),g=>g.imports.push({s:'a',t:'b'}),g=>g.hierarchy.children[1].children.push({name:'a'}),g=>g.hierarchy.children[1].name='A',g=>g.hierarchy.children[0].children=[],g=>g.hierarchy.children[0].children[0].children=[{name:'nested'}]]){
    const g=copy(base);edit(g);assert.throws(()=>M.graphSummary(g));
  }
  assert.throws(()=>M.visibleEdges(base,'not-a-filter'));assert.throws(()=>M.nodeDetail(base,'missing'));
});

test('routes preserve the hierarchy; bundling changes geometry without inventing adjacency',()=>{
  const g=graph([['A',['a','b']],['B',['c']]],[['a','b'],['b','c']]);
  const same=M.hierarchyRoute(g,'a','b'),cross=M.hierarchyRoute(g,'b','c');
  assert.equal(same.length,3);assert.equal(cross.length,5);assert.deepEqual(cross[2],{x:0,y:0});assert.deepEqual(same[1],cross[1]);
  for(const beta of [0,.82,1]) { const p=M.bundledPath(cross,beta); assert.ok(p.startsWith('M '));assert.equal(/NaN|Infinity/.test(p),false); }
  assert.equal(M.bundledPath([{x:0,y:0},{x:2,y:4},{x:6,y:0}],0),'M 0 0 L 6 0');
  assert.ok(M.bundledPath([{x:0,y:0},{x:2,y:4},{x:6,y:0}],1).endsWith('6 0'));
  for(const beta of [-1,2,NaN])assert.throws(()=>M.bundledPath(cross,beta));
  assert.throws(()=>M.bundledPath([{x:NaN,y:0},{x:1,y:2}]));
  assert.throws(()=>M.hierarchyRoute(g,'missing','a'));
});

function calendarOracle(scenario){
  const entries=scenario.streams.flatMap((s,si)=>s.tasks.map((t,ti)=>({...t,stream:si,id:`${si}:${ti}`})));
  const days=t=>{const set=new Set();if(!t.milestone)for(let d=Date.parse(t.start+'T00:00Z');d<Date.parse(t.end+'T00:00Z');d+=86400000)set.add(d);return set;};
  const out=[];for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
    const a=entries[i],b=entries[j];if(a.stream===b.stream)continue;
    const bd=days(b),both=[...days(a)].filter(d=>bd.has(d));if(both.length)out.push({a:a.id,b:b.id,days:both.length,start:new Date(Math.min(...both)).toISOString().slice(0,10),end:new Date(Math.max(...both)+86400000).toISOString().slice(0,10)});
  }return out;
}

test('timeline counts, historical extent and cross-facet overlap match an independent per-day intersection oracle',()=>{
  for(const [key,example] of Object.entries(M.data.timelines)){
    const s=M.timelineSummary(example);assert.deepEqual(s.overlaps,calendarOracle(example));
    assert.deepEqual([s.items,s.activities,s.milestones,s.facets,s.days,s.overlaps.length],key==='portfolio'?[16,12,4,4,176,35]:[19,17,2,5,217,43]);
    assert.equal(Object.values(s.statusCounts).reduce((a,b)=>a+b),s.items);
  }
  for(let seed=1;seed<=25;seed++){
    const iso=day=>new Date(Date.UTC(2026,0,day)).toISOString().slice(0,10);
    const example=timeline(Array.from({length:3},(_,i)=>['s'+i,Array.from({length:4},(_,j)=>{const start=1+(seed*(j+1)+i*3)%20;return task('t'+j,iso(start),iso(start+1+(seed+i+j)%8));})]));
    assert.deepEqual(M.timelineSummary(example).overlaps,calendarOracle(example));
  }
});

test('positive half-open overlap ignores shared endpoints, milestones and pairs in one facet',()=>{
  const example=timeline([['A',[task('a','2026-01-01','2026-01-03'),task('same','2026-01-01','2026-01-04')]],['B',[task('touch','2026-01-04','2026-01-06'),task('gate','2026-01-02','2026-01-02','milestone',true)]]]);
  assert.deepEqual(M.timelineSummary(example).overlaps,[]);
  example.streams[1].tasks[0].start='2026-01-03';assert.equal(M.timelineSummary(example).overlaps.length,1);assert.equal(M.timelineSummary(example).overlaps[0].days,1);
  example.insight={title:'capacity collision',text:'two cranes'};assert.equal('resourceCollision' in M.timelineSummary(example),false);
});

test('dates are strict UTC calendar dates, duration is elapsed, and status is supplied rather than inferred',()=>{
  assert.equal(M.elapsedDays('2024-02-28','2024-03-01'),2);assert.equal(M.elapsedDays('2026-03-28','2026-03-30'),2);assert.equal(M.elapsedDays('2026-10-24','2026-10-26'),2);assert.equal(M.elapsedDays('2026-01-01','2026-01-01'),0);
  for(const invalid of ['2026-02-29','2026-02-30','2026-13-01','2026-1-01','2026-01-01T12:00Z','bad'])assert.throws(()=>M.dateValue(invalid));
  assert.throws(()=>M.elapsedDays('2026-01-02','2026-01-01'));
  assert.deepEqual(M.monthTicks('2026-01-05','2026-04-01'),['2026-02-01','2026-03-01','2026-04-01']);
  const e=timeline([['A',[task('old','2000-01-01','2000-01-02','planned')]]]);assert.equal(M.tasks(e)[0].status,'planned');
  for(const edit of [t=>t.status='unknown',t=>t.end=t.start,t=>t.milestone=true,t=>t.end='2026-02-30',t=>t.start='2099-01-01']){const example=copy(e);edit(example.streams[0].tasks[0]);assert.throws(()=>M.timelineSummary(example));}
});

test('complete view round trips validate example references and all known fields atomically',()=>{
  const state={...M.defaultState(),view:'timeline',bundle:'srp',timeline:'pennine-tl',links:'cross',node:'ONR Safety Case',status:'milestone',task:'2:3'};
  assert.deepEqual(M.parseState(M.serializeState(state)),state);const detached=M.validateState(state);detached.bundle='pennine';assert.equal(state.bundle,'srp');
  const bad=[s=>s.version=2,s=>s.app='other',s=>s.bundle='__proto__',s=>s.node='Design Integration',s=>s.task='0:99',s=>s.task='0:0',s=>s.links='none',s=>s.status='critical',s=>delete s.view,s=>s.unexpected=1,s=>s.version=NaN];
  for(const edit of bad){const s=copy(state);edit(s);assert.throws(()=>M.validateState(s));}
  assert.throws(()=>M.parseState('['));assert.throws(()=>M.parseState(' '.repeat(20001)));assert.throws(()=>M.validateState(null));assert.throws(()=>M.parseState(JSON.stringify({bundles:M.data.bundles})));
});
