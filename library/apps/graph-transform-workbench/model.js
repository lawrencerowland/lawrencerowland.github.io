/* Graph-change teaching model. No third-party dependencies. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GraphWorkbench = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const copy = x => JSON.parse(JSON.stringify(x));
  const finite = (x, name, fallback = 0, nonnegative = false) => {
    if (x === undefined) return fallback;
    if (typeof x === 'number' && Math.abs(x) > 1e9) throw Error(`${name} exceeds this teaching model's numeric bound (1 billion).`);
    if (typeof x !== 'number' || !Number.isFinite(x) || (nonnegative && x < 0)) throw Error(`${name} must be a finite ${nonnegative ? 'non-negative ' : ''}number.`);
    return x;
  };
  const id = (x, name) => { if (typeof x !== 'string' || !x.trim()) throw Error(`${name} must be a non-empty string.`); return x; };
  const strings = (x, name) => { if (x === undefined) return []; if (!Array.isArray(x) || x.some(v => typeof v !== 'string' || !v.trim())) throw Error(`${name} must be an array of non-empty strings.`); return [...x]; };
  function normalizeGraph(raw) {
    if (!raw || !Array.isArray(raw.nodes) || !Array.isArray(raw.edges)) throw Error('Expected JSON with nodes[] and edges[].');
    if (raw.nodes.length > 150 || raw.edges.length > 600) throw Error('This teaching view supports at most 150 nodes and 600 edges.');
    const ids = new Set(), edgeIds = new Set();
    const nodes = raw.nodes.map((n, i) => {
      if (!n || typeof n !== 'object' || Array.isArray(n)) throw Error(`Node ${i + 1} must be an object.`);
      const key = id(n.id, `Node ${i + 1} id`);
      if (ids.has(key)) throw Error(`Duplicate node id: ${key}`); ids.add(key);
      for (const field of ['label', 'owner', 'type', 'date']) if (n[field] !== undefined && typeof n[field] !== 'string') throw Error(`${key}.${field} must be text.`);
      if (n.date && (!/^\d{4}-\d{2}-\d{2}$/.test(n.date) || !Number.isFinite(Date.parse(n.date)) || new Date(n.date).toISOString().slice(0, 10) !== n.date)) throw Error(`Invalid date on ${key}; use YYYY-MM-DD.`);
      return {...copy(n), id:key, label:n.label || key, tags:strings(n.tags, `${key}.tags`), owner:n.owner || '', type:n.type || '', date:n.date || '', duration:finite(n.duration, `${key}.duration`, 0, true)};
    });
    const edges = raw.edges.map((e, i) => {
      if (!e || typeof e !== 'object' || Array.isArray(e)) throw Error(`Edge ${i + 1} must be an object.`);
      const source = id(e.source, `Edge ${i + 1} source`), target = id(e.target, `Edge ${i + 1} target`);
      if (!ids.has(source) || !ids.has(target)) throw Error(`Edge ${source} → ${target} has an unknown endpoint.`);
      const key = e.id === undefined ? `edge-${i + 1}` : id(e.id, `Edge ${i + 1} id`);
      if (edgeIds.has(key)) throw Error(`Duplicate edge id: ${key}`); edgeIds.add(key);
      return {...copy(e), id:key, source, target, lag:finite(e.lag, `${key}.lag`), duration:finite(e.duration, `${key}.duration`, 0, true)};
    });
    return {nodes, edges};
  }
  function index(graph) {
    const nodes = new Map(graph.nodes.map(n => [n.id,n])), incoming = new Map(), outgoing = new Map(), degree = new Map();
    nodes.forEach((_, key) => { incoming.set(key, []); outgoing.set(key, []); degree.set(key, 0); });
    graph.edges.forEach(e => { incoming.get(e.target).push(e); outgoing.get(e.source).push(e); degree.set(e.target, degree.get(e.target)+1); });
    const queue = [...nodes.keys()].filter(key => degree.get(key) === 0), order=[];
    for (let i=0;i<queue.length;i++) { const key=queue[i]; order.push(key); for(const e of outgoing.get(key)) { degree.set(e.target,degree.get(e.target)-1); if(degree.get(e.target)===0) queue.push(e.target); } }
    return {nodes, incoming, outgoing, order, hasCycle:order.length !== nodes.size, blocked:[...nodes.keys()].filter(key=>degree.get(key)>0)};
  }
  function schedule(graph, slips = {}) {
    const ix=index(graph);
    if(ix.hasCycle) return {valid:false, reason:'Directed cycle: earliest-date and longest-path calculations are unavailable.', blocked:ix.blocked, order:ix.order};
    const es=Object.create(null),ef=Object.create(null),prev=new Map();
    for(const key of ix.order) {
      let start=0;
      for(const e of ix.incoming.get(key)) { const candidate=ef[e.source]+e.lag+e.duration; if(candidate>start || (candidate===start && !prev.has(key))) { start=candidate;prev.set(key,e); } }
      es[key]=start+finite(Object.hasOwn(slips,key)?slips[key]:undefined,`${key} local delay`,0,true); ef[key]=es[key]+ix.nodes.get(key).duration;
    }
    const makespan=Math.max(0,...Object.values(ef)), end=ix.order.find(key=>ef[key]===makespan),criticalEdges=[],criticalNodes=[];
    let cursor=end;
    while(cursor!==undefined) { criticalNodes.unshift(cursor); const e=prev.get(cursor); if(!e) break;criticalEdges.unshift(e.id);cursor=e.source; }
    return {valid:true,es,ef,makespan,criticalEdges,criticalNodes,order:ix.order};
  }
  function scalarPropagation(graph, slips, rule='max') {
    const ix=index(graph); if(ix.hasCycle) throw Error('Scalar propagation requires a DAG.');
    if(!['max','sum','mean'].includes(rule)) throw Error('Unknown scalar rule.');
    const result=Object.create(null);
    for(const key of ix.order) { const values=ix.incoming.get(key).map(e=>result[e.source]); let value=0; if(values.length) value=rule==='max'?Math.max(...values):values.reduce((a,b)=>a+b,0)/(rule==='mean'?values.length:1);result[key]=value+finite(Object.hasOwn(slips,key)?slips[key]:undefined,`${key} local delay`,0,true); }
    return result;
  }
  function filterGraph(graph, f={}) {
    if(f.start && f.end && f.start>f.end) throw Error('The filter start date must not follow its end date.');
    const norm=s=>String(s||'').trim().toLowerCase();
    const nodes=graph.nodes.filter(n=>(!f.type||norm(n.type)===norm(f.type)) && (!f.owner||norm(n.owner)===norm(f.owner)) && (!f.tag||n.tags.some(t=>norm(t).includes(norm(f.tag)))) && (!f.start||(n.date&&n.date>=f.start)) && (!f.end||(n.date&&n.date<=f.end)));
    const keep=new Set(nodes.map(n=>n.id));return copy({nodes,edges:graph.edges.filter(e=>keep.has(e.source)&&keep.has(e.target))});
  }
  function prune(graph, targets) {
    const ix=index(graph),unknown=targets.filter(key=>!ix.nodes.has(key));
    if(unknown.length) throw Error(`Unknown output nodes: ${unknown.join(', ')}`);
    if(!targets.length) throw Error('Choose at least one output node or matching output tag.');
    const keep=new Set(targets),queue=[...keep];
    for(let i=0;i<queue.length;i++) for(const e of ix.incoming.get(queue[i])) if(!keep.has(e.source)) {keep.add(e.source);queue.push(e.source);}
    return copy({nodes:graph.nodes.filter(n=>keep.has(n.id)),edges:graph.edges.filter(e=>keep.has(e.source)&&keep.has(e.target))});
  }
  function groupView(graph, mode='none', tag='') {
    if(mode==='none') return {graph:copy(graph),grouped:false,membership:[],hasCycle:index(graph).hasCycle};
    if(!['owner','type','tag'].includes(mode)) throw Error('Unknown grouping mode.');
    if(mode==='tag'&&!tag.trim()) throw Error('Enter the tag to group.');
    const groups=new Map(),map=new Map();
    graph.nodes.forEach(n=>{const key=mode==='tag'?(n.tags.some(t=>t.toLowerCase()===tag.toLowerCase())?`tag:${tag}`:`node:${n.id}`):(n[mode]?`${mode}:${n[mode]}`:`node:${n.id}`); if(!groups.has(key))groups.set(key,[]);groups.get(key).push(n.id);map.set(n.id,key);});
    const nodes=[...groups].map(([key,members],i)=>({id:`group-${i+1}`,label:`${key} (${members.length})`,members,tags:[],owner:'',type:'group',duration:0}));
    const keyToId=new Map([...groups.keys()].map((key,i)=>[key,nodes[i].id]));
    const edges=graph.edges.filter(e=>map.get(e.source)!==map.get(e.target)).map(e=>({...e,source:keyToId.get(map.get(e.source)),target:keyToId.get(map.get(e.target)),originalEdge:e.id}));
    const view={nodes,edges};return {graph:view,grouped:true,membership:nodes.map(n=>({group:n.label,members:n.members})),hasCycle:index(view).hasCycle};
  }
  function braid(graph,options={}) {
    const laneKey=options.laneKey||'owner',reuse=!!options.reuse,priority=options.priority||['scope','contract','permit','power'];
    const ix=index(graph),nodes=copy(graph.nodes),edges=[],interfaces=new Map(),usedIds=new Set(nodes.map(n=>n.id)),usedEdges=new Set(graph.edges.map(e=>e.id));
    let count=0;
    const fresh=(base,used)=>{let key=base,i=1;while(used.has(key))key=`${base}-${i++}`;used.add(key);return key;};
    for(const e of graph.edges) {
      const a=ix.nodes.get(e.source),b=ix.nodes.get(e.target),laneA=a[laneKey]||'unassigned',laneB=b[laneKey]||'unassigned';
      // Existing explicit interface legs stay intact; repeat use is idempotent.
      if(laneA===laneB || a.interface || b.interface) {edges.push(copy(e));continue;}
      const tags=new Set([...a.tags,...b.tags].map(x=>x.toLowerCase())),type=priority.find(t=>tags.has(t))||options.fallback||'handoff';
      const group=reuse?JSON.stringify([laneA,laneB,type]):e.id;
      let iface=interfaces.get(group);
      if(!iface) { iface={id:fresh(`interface-${interfaces.size+1}`,usedIds),label:`${type}: ${laneA} → ${laneB}`,tags:['interface',type],owner:`${laneA} → ${laneB}`,type:`interface:${type}`,duration:0,interface:true,originEdges:[]};interfaces.set(group,iface);nodes.push(iface); }
      iface.originEdges.push(e.id);
      edges.push({...copy(e),id:fresh(`${e.id}:in`,usedEdges),target:iface.id,originEdge:e.id});
      edges.push({id:fresh(`${e.id}:out`,usedEdges),source:iface.id,target:e.target,lag:0,duration:0,originEdge:e.id});count++;
    }
    return {graph:{nodes,edges},count,interfaces:interfaces.size,mode:reuse?'shared coupling':'per-edge subdivision'};
  }
  function pairMeasures(graph, ids) {
    const ix=index(graph),result=new Map();
    for(const source of ids) {
      const reach=new Set(),queue=[source];
      for(let i=0;i<queue.length;i++) for(const e of ix.outgoing.get(queue[i])||[]) if(!reach.has(e.target)){reach.add(e.target);queue.push(e.target);}
      const dist=new Map([[source,0]]);
      if(!ix.hasCycle) for(const key of ix.order) if(dist.has(key)) for(const e of ix.outgoing.get(key)){const candidate=dist.get(key)+ix.nodes.get(key).duration+e.duration+e.lag;if(!dist.has(e.target)||candidate>dist.get(e.target))dist.set(e.target,candidate);}
      for(const target of ids) if(source!==target) result.set(JSON.stringify([source,target]),{reachable:reach.has(target),weight:ix.hasCycle?null:(dist.has(target)?dist.get(target):null)});
    }
    return result;
  }
  function compare(before,after) {
    const originalIds=before.nodes.map(n=>n.id),afterIds=new Set(after.nodes.map(n=>n.id)),retained=originalIds.filter(key=>afterIds.has(key)),a=pairMeasures(before,retained),b=pairMeasures(after,retained),added=[],removed=[],weights=[];
    for(const [pair,x] of a) {const y=b.get(pair);if(!x.reachable&&y.reachable)added.push(JSON.parse(pair));if(x.reachable&&!y.reachable)removed.push(JSON.parse(pair));if(x.reachable&&y.reachable&&x.weight!==null&&y.weight!==null&&Math.abs(x.weight-y.weight)>1e-9)weights.push({pair:JSON.parse(pair),before:x.weight,after:y.weight});}
    return {removedNodes:originalIds.filter(key=>!afterIds.has(key)),addedReachability:added,removedReachability:removed,changedWeights:weights,beforeCycle:index(before).hasCycle,afterCycle:index(after).hasCycle,weightsChecked:!index(before).hasCycle&&!index(after).hasCycle};
  }
  function exportsFor(graph) {
    const csv=x=>`"${String(x??'').replace(/"/g,'""')}"`,dot=x=>JSON.stringify(String(x));
    const nodes=['id,label,duration,owner,type,date,tags',...graph.nodes.map(n=>[n.id,n.label,n.duration,n.owner,n.type,n.date,n.tags.join('|')].map(csv).join(','))].join('\n');
    const edges=['edge_id,source,target,lag,duration',...graph.edges.map(e=>[e.id,e.source,e.target,e.lag,e.duration].map(csv).join(','))].join('\n');
    const dotText=['digraph G {','  rankdir=LR;',...graph.nodes.map(n=>`  ${dot(n.id)} [label=${dot(n.label)}];`),...graph.edges.map(e=>`  ${dot(e.source)} -> ${dot(e.target)} [label=${dot(`${e.id}: lag ${e.lag}, duration ${e.duration}`)}];`),'}'].join('\n');
    return {json:JSON.stringify(graph,null,2),nodesCsv:nodes,edgesCsv:edges,dot:dotText};
  }
  function createSession(initial) {
    let baseline=null,history=[],cursor=-1;
    const applyImport=raw=>{const validated=normalizeGraph(raw);baseline=copy(validated);history=[{label:'Baseline imported',graph:copy(validated)}];cursor=0;return snapshot();};
    const snapshot=()=>({baseline:copy(baseline),current:copy(history[cursor]?.graph||null),history:history.map(x=>x.label),cursor});
    const commit=(graph,label)=>{const validated=normalizeGraph(graph);history=history.slice(0,cursor+1);history.push({label,graph:copy(validated)});cursor++;return snapshot();};
    const undo=()=>{if(cursor>0)cursor--;return snapshot();},redo=()=>{if(cursor<history.length-1)cursor++;return snapshot();};
    if(initial)applyImport(initial);
    return {snapshot,import:applyImport,commit,undo,redo};
  }
  const MAIN=normalizeGraph({nodes:[['A','Concept Freeze',3],['B','Design Gate',4],['C','Procurement',5],['D','Site Ready',3],['E','Install',4],['F','Commission',2],['G','Handover',1]].map(([id,label,duration],i)=>({id,label:`${id}: ${label}`,duration,tier:[1,2,2,3,3,3,4][i]})),edges:[['A','B'],['A','C'],['B','C'],['B','D'],['C','E'],['D','F'],['E','F'],['F','G']].map(([source,target])=>({id:`${source}->${target}`,source,target}))});
  const SAMPLE=normalizeGraph({nodes:[{id:'S1',label:'Scope draft',tags:['scope'],owner:'PMO',type:'scope',date:'2025-02-01'},{id:'S2',label:'Permit check',tags:['permit','risk'],owner:'Reg',type:'permit',date:'2025-02-05'},{id:'S3',label:'Contract gate',tags:['contract'],owner:'Legal',type:'contract',date:'2025-02-10'},{id:'S4',label:'Power interface',tags:['power','interface','output'],owner:'Utilities',type:'power',date:'2025-02-12'},{id:'S5',label:'Design pack',tags:['design'],owner:'Eng',type:'scope',date:'2025-02-15'}],edges:[{source:'S1',target:'S2',duration:2,lag:1},{source:'S2',target:'S3',duration:3,lag:0},{source:'S3',target:'S4',duration:4,lag:1},{source:'S3',target:'S5',duration:2,lag:0},{source:'S5',target:'S4',duration:1,lag:0}]});
  const PRESETS={permit:{tasks:[{id:'A1',window:[1,6],buffer:2,needs:['permit'],offers:['design']},{id:'A2',window:[4,9],buffer:1,needs:['design'],offers:['permit']},{id:'A3',window:[6,10],buffer:2,needs:['permit'],offers:[]}],resources:[{id:'permit',cap:1,calendar:'weekdays'},{id:'design',cap:1,calendar:'weekdays'}]},crane:{tasks:[{id:'C1',window:[2,7],buffer:1,needs:['crane'],offers:['lift']},{id:'C2',window:[5,9],buffer:1,needs:['lift'],offers:['crane']},{id:'C3',window:[3,8],buffer:0,needs:['crane'],offers:[]}],resources:[{id:'crane',cap:1,calendar:'shift'},{id:'lift',cap:1,calendar:'shift'}]},design:{tasks:[{id:'D1',window:[1,5],buffer:1,needs:['design'],offers:['review']},{id:'D2',window:[4,10],buffer:2,needs:['review'],offers:['design']},{id:'D3',window:[6,12],buffer:1,needs:['design'],offers:[]}],resources:[{id:'design',cap:1,calendar:'weekdays'},{id:'review',cap:1,calendar:'weekdays'}]}};
  function validateAgents(raw) {
    if(!raw||!Array.isArray(raw.tasks)||!Array.isArray(raw.resources))throw Error('Expected tasks[] and resources[].');
    if(raw.tasks.length>150)throw Error('At most 150 tasks are supported.');
    const resources=new Set();raw.resources.forEach(r=>{id(r.id,'Resource id');if(resources.has(r.id))throw Error(`Duplicate resource ${r.id}`);resources.add(r.id);finite(r.cap,`${r.id}.cap`,0,true);if(r.calendar!==undefined&&typeof r.calendar!=='string')throw Error('Calendar must be a descriptive string.');});
    const ids=new Set();const tasks=raw.tasks.map(t=>{id(t.id,'Task id');if(ids.has(t.id))throw Error(`Duplicate task ${t.id}`);ids.add(t.id);if(!Array.isArray(t.window)||t.window.length!==2)throw Error(`${t.id} needs a [start,end] window.`);t.window.forEach(v=>finite(v,`${t.id}.window`));if(t.window[0]>=t.window[1])throw Error(`${t.id} window must end after it starts.`);finite(t.buffer,`${t.id}.buffer`,0,true);const needs=strings(t.needs,`${t.id}.needs`),offers=strings(t.offers,`${t.id}.offers`);for(const r of [...needs,...offers])if(!resources.has(r))throw Error(`Unknown resource ${r} on ${t.id}`);if(new Set(needs).size!==needs.length||new Set(offers).size!==offers.length)throw Error(`${t.id} has repeated need/offer names.`);return {...copy(t),buffer:t.buffer||0,needs,offers};});
    return {tasks,resources:copy(raw.resources)};
  }
  function effectiveWindow(task,policy) { const b=policy==='liberal'?task.buffer:policy==='priority'?Math.floor(task.buffer*.5):0;return [task.window[0]-b,task.window[1]+b]; }
  function matchOffers(raw,policy='strict') {
    if(!['strict','liberal','priority'].includes(policy))throw Error('Unknown matching policy.');
    const input=validateAgents(raw),ordered=[...input.tasks].sort((a,b)=>policy==='priority'?a.buffer-b.buffer:0),used=new Set(),trades=[],deficits=[],windowDeltas=Object.create(null);
    const overlap=(a,b)=>Math.max(0,Math.min(a[1],b[1])-Math.max(a[0],b[0]));
    for(const task of ordered) { const w=effectiveWindow(task,policy);windowDeltas[task.id]=w[1]-w[0]-(task.window[1]-task.window[0]);for(const need of task.needs){const other=ordered.find(o=>o.id!==task.id&&o.offers.includes(need)&&!used.has(JSON.stringify([o.id,need]))&&overlap(w,effectiveWindow(o,policy))>0);if(other){used.add(JSON.stringify([other.id,need]));trades.push({from:other.id,to:task.id,resource:need,overlap:overlap(w,effectiveWindow(other,policy))});}else deficits.push({task:task.id,resource:need,window:w});} }
    return {policy,trades,deficits,windowDeltas,assumptions:['One consumable offer token per provider/resource; a match requires positive window overlap.','Greedy input order; priority policy orders smallest buffers first. Matches are not reciprocal swaps.','Resource capacity and calendar fields are retained source annotations and NOT enforced. No allocation, execution, feasibility or optimality claim.','Expanded window width is not CPM float or measured schedule slack.'],resources:input.resources};
  }
  return {copy,normalizeGraph,index,schedule,scalarPropagation,filterGraph,prune,groupView,braid,compare,exportsFor,createSession,MAIN,SAMPLE,PRESETS,validateAgents,matchOffers,effectiveWindow};
});
