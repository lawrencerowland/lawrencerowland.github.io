(function (root) {
  'use strict';
  const DEFAULTS = Object.freeze({horizon:8,serviceFloor:1,milestoneSlot:4,milestoneService:2,crews:2,accessCap:2,temporaryAvailable:true});
  const ACTIONS = Object.freeze([
    {id:'platform-up',name:'Commission next platform tier',short:'Platform',family:'platform',cost:3,access:1,crews:1,description:'Retain existing platform service; next platform tier needs the matching signalling tier already commissioned.'},
    {id:'signal-up',name:'Commission next signalling tier',short:'Signalling',family:'signal',cost:4,access:1,crews:1,description:'Retain existing signalling service while commissioning the next tier.'},
    {id:'grid-direct',name:'Direct grid cutover',short:'Direct grid',family:'grid',cost:3,access:2,crews:1,description:'Isolate grid service for this slot. An already active temporary bridge retains pre-cutover grid service.'},
    {id:'grid-prepare',name:'Prepare protected grid cutover',short:'Prepare grid',family:'grid',cost:2,access:0,crews:1,description:'Prepare one tier of protected grid work without interrupting existing service.'},
    {id:'grid-protected',name:'Protected grid cutover',short:'Protected grid',family:'grid',cost:4,access:1,crews:1,description:'Use the prepared arrangement to commission one grid tier while retaining pre-cutover service.'},
    {id:'temporary-install',name:'Install temporary grid bridge',short:'Install bridge',family:'temporary',cost:4,access:1,crews:1,description:'Install a temporary supply arrangement, available from the next slot; it protects grid continuity.'},
    {id:'temporary-return',name:'Return temporary grid bridge',short:'Return bridge',family:'temporary',cost:0,access:1,crews:1,description:'Return the temporary arrangement. It must be returned before the implementation is complete.'}
  ].map(Object.freeze));
  const BY_ID = Object.fromEntries(ACTIONS.map(a=>[a.id,a]));
  const PRESETS = Object.freeze([
    {id:'continuity',title:'Keep the railway operating',explanation:'The cheapest endpoint design interrupts service. Find all minimal staged implementations that retain one service band.',params:{...DEFAULTS}},
    {id:'shutdown',title:'Allow an operating shutdown',explanation:'With no operating-service floor, cheap direct cutovers become admissible. This changes the requested functionality.',params:{...DEFAULTS,serviceFloor:0}},
    {id:'restricted-access',title:'Only one access unit',explanation:'Direct cutovers require two simultaneous access units; protected work can fit one. The least-cost endpoint changes with the available interface.',params:{...DEFAULTS,accessCap:1,horizon:10,milestoneSlot:6}},
    {id:'no-bridge',title:'Temporary bridge unavailable',explanation:'Protected grid work remains an alternative; excluding one enabling option changes the frontier without changing the final assets.',params:{...DEFAULTS,temporaryAvailable:false}},
    {id:'early-service',title:'An earlier service promise',explanation:'Require two commissioned service bands by the end of slot 2. The faster protected path becomes necessary.',params:{...DEFAULTS,milestoneSlot:2}},
    {id:'one-crew',title:'One shared work crew',explanation:'All module actions compete for the same crew. Independent subsystem plans no longer imply parallel delivery.',params:{...DEFAULTS,crews:1,horizon:12,milestoneSlot:6}},
    {id:'no-path',title:'The deadline cannot be met',explanation:'One crew can finish the cheapest endpoint design in six slots. The continuity-preserving implementations need at least eight; none fits this six-slot horizon.',params:{...DEFAULTS,crews:1,horizon:6,milestoneSlot:4}}
  ].map(x=>Object.freeze({...x,params:Object.freeze(x.params)})));

  function normalize(input={}) {
    if(input===null||typeof input!=='object'||Array.isArray(input)) throw new TypeError('Parameters must be an object.');
    for(const k of Object.keys(input)) if(!Object.prototype.hasOwnProperty.call(DEFAULTS,k)) throw new Error('Unknown parameter: '+k);
    const p={...DEFAULTS,...input};
    for(const [k,lo,hi] of [['horizon',4,12],['serviceFloor',0,3],['milestoneSlot',0,12],['milestoneService',1,3],['crews',1,3],['accessCap',1,3]]) {
      if(!Number.isInteger(p[k])||p[k]<lo||p[k]>hi) throw new RangeError(k+' must be an integer from '+lo+' to '+hi+'.');
    }
    if(p.milestoneSlot>p.horizon) throw new RangeError('Milestone slot must fit inside the horizon, or be 0 to turn it off.');
    if(typeof p.temporaryAvailable!=='boolean') throw new TypeError('temporaryAvailable must be true or false.');
    return p;
  }
  function initial(){return {p:0,s:0,g:0,prepared:false,temp:0};}
  function stateKey(x){return [x.p,x.s,x.g,x.prepared?1:0,x.temp].join(',');}
  function capacity(x){return Math.min(x.p,x.s,x.g)+1;}
  function complete(x){return x.p===2&&x.s===2&&x.g===2&&!x.prepared&&x.temp!==1;}
  function guard(a,x,p){
    switch(a.id){
      case 'platform-up':return x.p<2&&x.s>=x.p+1;
      case 'signal-up':return x.s<2;
      case 'grid-direct':return x.g<2&&!x.prepared;
      case 'grid-prepare':return x.g<2&&!x.prepared;
      case 'grid-protected':return x.g<2&&x.prepared;
      case 'temporary-install':return p.temporaryAvailable&&x.temp===0&&x.g<2;
      case 'temporary-return':return x.temp===1;
      default:return false;
    }
  }
  function step(x,ids,p){
    const actions=ids.map(id=>BY_ID[id]);
    if(actions.some(a=>!a)) return {error:'Unknown action.'};
    if(!actions.length) return {error:'Empty slots are excluded from normalized implementations.'};
    if(new Set(ids).size!==ids.length) return {error:'An action cannot appear twice in one slot.'};
    if(actions.some(a=>!guard(a,x,p))) return {error:'An action lacks its start-of-slot prerequisite.'};
    const grid=actions.filter(a=>a.family==='grid').length,temp=actions.filter(a=>a.family==='temporary').length;
    if(grid>1||temp>1||(grid&&temp)) return {error:'Grid and temporary work need separate, exclusive work slots.'};
    const crews=actions.length,access=actions.reduce((n,a)=>n+a.access,0),cost=actions.reduce((n,a)=>n+a.cost,0);
    if(crews>p.crews) return {error:'Concurrent work exceeds available crews.'};
    if(access>p.accessCap) return {error:'Concurrent work exceeds the access cap.'};
    const gOperational=ids.includes('grid-direct')&&x.temp!==1?0:x.g+1;
    const service=Math.min(x.p+1,x.s+1,gOperational);
    const y={...x};
    for(const id of ids){
      switch(id){
        case 'platform-up':y.p++;break;
        case 'signal-up':y.s++;break;
        case 'grid-direct':y.g++;break;
        case 'grid-prepare':y.prepared=true;break;
        case 'grid-protected':y.g++;y.prepared=false;break;
        case 'temporary-install':y.temp=1;break;
        case 'temporary-return':y.temp=2;break;
      }
    }
    return {before:{...x},after:y,actions:ids.slice(),service,cost,access,crews};
  }
  function enabledBatches(x,p){
    const enabled=ACTIONS.filter(a=>guard(a,x,p));
    const batches=[];
    for(let mask=1;mask<(1<<enabled.length);mask++){
      const ids=enabled.filter((_,j)=>mask&(1<<j)).map(a=>a.id);
      if(ids.length>p.crews) continue;
      const z=step(x,ids,p);if(!z.error)batches.push(z);
    }
    return batches;
  }
  function dominates(a,b,keys){return keys.every(k=>a[k]<=b[k])&&keys.some(k=>a[k]<b[k]);}
  function equalResources(a,b,keys){return keys.every(k=>a[k]===b[k]);}
  function lexPath(path){return path.map(z=>z.actions.join('+')).join('|');}
  function preferredTie(a,b){
    // Tied labels have the same future interface and resource values. This affects only which witness is shown.
    if(a.minService!==b.minService)return a.minService>b.minService;
    if(a.accessTotal!==b.accessTotal)return a.accessTotal<b.accessTotal;
    return lexPath(a.path)<lexPath(b.path);
  }
  function insertLabel(list,candidate,keys){
    for(let i=0;i<list.length;i++){
      const old=list[i];
      if(dominates(old,candidate,keys))return false;
      if(equalResources(old,candidate,keys)){
        if(preferredTie(candidate,old)){list[i]=candidate;return true;}return false;
      }
    }
    for(let i=list.length-1;i>=0;i--)if(dominates(candidate,list[i],keys))list.splice(i,1);
    list.push(candidate);return true;
  }
  function methodOf(path){
    const ids=path.flatMap(z=>z.actions);
    const direct=ids.filter(x=>x==='grid-direct').length,protectedCount=ids.filter(x=>x==='grid-protected').length;
    if(ids.includes('temporary-install'))return protectedCount?'Bridge + protected work':'Temporary bridge';
    if(protectedCount===2)return 'Protected cutovers';
    if(direct===2)return 'Direct cutovers';
    return 'Mixed grid methods';
  }
  function finishPlan(label,p,prefix,index){
    const path=label.path;
    const atMilestone=p.milestoneSlot===0?3:capacity(path[Math.min(p.milestoneSlot,path.length)-1].after);
    return {id:prefix+'-'+index,cost:label.cost,finish:path.length,peakAccess:label.peakAccess,accessTotal:label.accessTotal,minService:label.minService,milestoneService:atMilestone,path,final:{...label.state},resources:[label.cost,path.length,label.peakAccess],method:methodOf(path)};
  }
  function run(p,temporal){
    let layer=new Map([[stateKey(initial()),[{state:initial(),cost:0,peakAccess:0,accessTotal:0,minService:3,path:[]}]]]);
    const finished=[];
    const stats={states:1,labelsExpanded:0,candidateExtensions:0,completedLabels:0,serviceRejected:0,milestoneRejected:0,horizonStranded:0};
    const rejectSamples={service:null,milestone:null};
    const batchCache=new Map();
    for(let time=1;time<=p.horizon&&layer.size;time++){
      const next=new Map();
      for(const [key,labels] of layer){
        let batches=batchCache.get(key);if(!batches){batches=enabledBatches(labels[0].state,p);batchCache.set(key,batches);}
        for(const label of labels){
          stats.labelsExpanded++;
          for(const transition of batches){
            stats.candidateExtensions++;
            if(temporal&&transition.service<p.serviceFloor){
              stats.serviceRejected++;if(!rejectSamples.service)rejectSamples.service={slot:time,actions:transition.actions,available:transition.service,required:p.serviceFloor};continue;
            }
            if(temporal&&p.milestoneSlot===time&&capacity(transition.after)<p.milestoneService){
              stats.milestoneRejected++;if(!rejectSamples.milestone)rejectSamples.milestone={slot:time,available:capacity(transition.after),required:p.milestoneService};continue;
            }
            const path=label.path.concat({...transition,slot:time});
            const cand={state:transition.after,cost:label.cost+transition.cost,peakAccess:Math.max(label.peakAccess,transition.access),accessTotal:label.accessTotal+transition.access,minService:Math.min(label.minService,transition.service),path};
            if(complete(cand.state)){
              // Final capability persists if completion precedes the milestone.
              stats.completedLabels++;finished.push(cand);continue;
            }
            if(time===p.horizon){stats.horizonStranded++;continue;}
            const nextKey=stateKey(cand.state);if(!next.has(nextKey))next.set(nextKey,[]);
            insertLabel(next.get(nextKey),cand,['cost','peakAccess']);
          }
        }
      }
      stats.states+=next.size;layer=next;
    }
    const candidates=finished.map((x,i)=>finishPlan(x,p,temporal?'stage':'end',i+1));
    const front=[];
    for(const c of candidates)insertLabel(front,c,['cost','finish','peakAccess']);
    front.sort((a,b)=>a.cost-b.cost||a.finish-b.finish||a.peakAccess-b.peakAccess||lexPath(a.path).localeCompare(lexPath(b.path)));
    front.forEach((x,i)=>x.id=(temporal?'stage':'end')+'-'+(i+1));
    return {front,candidates,stats,rejectSamples};
  }
  function replay(pathInput,input={}){
    const p=normalize(input);
    const src=Array.isArray(pathInput)?pathInput:pathInput&&pathInput.path;
    if(!Array.isArray(src))throw new TypeError('Replay needs a path array or an object with a path array.');
    const errors=[];let x=initial(),path=[],cost=0,peakAccess=0,accessTotal=0,minService=3;
    for(let i=0;i<src.length;i++){
      const ids=Array.isArray(src[i])?src[i]:src[i]&&src[i].actions;
      if(!Array.isArray(ids)||ids.some(id=>typeof id!=='string')){errors.push({slot:i+1,code:'physical',message:'Each slot needs an action-ID array.'});break;}
      if(complete(x)){errors.push({slot:i+1,code:'physical',message:'Work after the first complete implementation is not part of its normalized path.'});break;}
      const z=step(x,ids,p);
      if(z.error){errors.push({slot:i+1,code:'physical',message:z.error});break;}
      const row={...z,slot:i+1};path.push(row);x=z.after;cost+=z.cost;peakAccess=Math.max(peakAccess,z.access);accessTotal+=z.access;minService=Math.min(minService,z.service);
      if(z.service<p.serviceFloor)errors.push({slot:i+1,code:'service',message:'Assured operating service '+z.service+' is below the required floor '+p.serviceFloor+'.'});
      if(p.milestoneSlot===i+1&&capacity(x)<p.milestoneService)errors.push({slot:i+1,code:'milestone',message:'Commissioned service '+capacity(x)+' misses the required '+p.milestoneService+' by the end of this slot.'});
    }
    if(src.length>p.horizon)errors.push({slot:src.length,code:'horizon',message:'Completion exceeds the horizon of '+p.horizon+' slots.'});
    const done=complete(x);
    if(!done)errors.push({slot:path.length,code:'incomplete',message:'Both tiers of every permanent module must be commissioned, prepared work cleared and temporary equipment returned.'});
    const physicalValid=!errors.some(e=>e.code==='physical'||e.code==='horizon'||e.code==='incomplete');
    const temporalValid=!errors.some(e=>e.code==='service'||e.code==='milestone');
    let plan=null;if(path.length)plan=finishPlan({state:x,cost,peakAccess,accessTotal,minService,path},p,'replay',1);
    return {valid:physicalValid&&temporalValid,physicalValid,temporalValid,complete:done,errors,plan};
  }
  function solve(input={},options={}){
    const p=normalize(input),end=run(p,false),staged=run(p,true);
    const endpointChecks=end.front.map(plan=>({id:plan.id,method:plan.method,cost:plan.cost,finish:plan.finish,check:replay(plan.path,p)}));
    const rejected=endpointChecks.filter(x=>!x.check.temporalValid);
    const endpointResourceVectorsWithStagedWitness=end.front.flatMap(e=>{
      const s=staged.front.find(z=>equalResources(e,z,['cost','finish','peakAccess']));
      return s?[{endpointId:e.id,stagedId:s.id,resources:e.resources.slice(),pathChanged:lexPath(e.path)!==lexPath(s.path)}]:[];
    });
    const witnessOnlyRearrangements=rejected.flatMap(e=>{
      const equivalent=endpointResourceVectorsWithStagedWitness.find(z=>z.endpointId===e.id);
      return equivalent?[equivalent]:[];
    });
    const endpointVectorsExcluded=end.front.filter(e=>!endpointResourceVectorsWithStagedWitness.some(z=>z.endpointId===e.id)).map(e=>({endpointId:e.id,resources:e.resources.slice()}));
    const genuinelyLostStagedVectors=staged.front.filter(s=>!end.front.some(e=>equalResources(e,s,['cost','finish','peakAccess']))).map(s=>({stagedId:s.id,resources:s.resources.slice(),dominatedByEndpointIds:end.front.filter(e=>dominates(e,s,['cost','finish','peakAccess'])).map(e=>e.id)}));
    const reasons=[];
    if(p.serviceFloor>1)reasons.push({code:'initial-service',message:'The starting railway supplies only one service band. A higher floor must hold from the first work slot, so no implementation can satisfy it.'});
    if(p.accessCap<2)reasons.push({code:'direct-access',message:'Direct grid cutovers require two simultaneous access units; the current cap excludes them.'});
    if(!p.temporaryAvailable)reasons.push({code:'bridge-unavailable',message:'The temporary bridge is unavailable. Protected cutovers remain in the catalogue.'});
    if(staged.stats.serviceRejected)reasons.push({code:'service',message:'Some candidate transitions interrupt required operating service.',count:staged.stats.serviceRejected,example:staged.rejectSamples.service});
    if(staged.stats.milestoneRejected)reasons.push({code:'milestone',message:'Some partial implementations miss the intermediate commissioned-capacity promise.',count:staged.stats.milestoneRejected,example:staged.rejectSamples.milestone});
    if(!staged.front.length)reasons.push({code:'no-completion',message:'Exact finite search found no complete implementation satisfying all stated constraints within the horizon. This is a result for this catalogue and these rules.'});
    const statement=endpointVectorsExcluded.length?'Some endpoint resource vectors have no witness satisfying the temporal request. The full query requires different implementations.':witnessOnlyRearrangements.length?'Some displayed endpoint paths miss the temporal request, but a different ordering achieves the same resource vectors. The resource frontier is preserved; the witnesses need rearrangement.':'The endpoint resource vectors have temporally admissible witnesses too. No lost resource frontier is exhibited under these settings.';
    const result={params:p,endpointFrontier:end.front,stagedFrontier:staged.front,counts:{endpoint:end.stats,staged:staged.stats},rejections:reasons,catalogue:ACTIONS.map(a=>({...a})),comparison:{endpointPlansRejected:rejected.length,endpointChecks,endpointResourceVectorsWithStagedWitness,witnessOnlyRearrangements,endpointVectorsExcluded,genuinelyLostStagedVectors,endpointCheapest:end.front.length?Math.min(...end.front.map(x=>x.cost)):null,stagedCheapest:staged.front.length?Math.min(...staged.front.map(x=>x.cost)):null,statement}};
    if(options.includeAll){result.endpointCompletions=end.candidates;result.stagedCompletions=staged.candidates;}
    return result;
  }
  const API={VERSION:'1.0.0',DEFAULTS,PRESETS,normalize,solve,replay,catalogue:ACTIONS.map(a=>({...a}))};
  root.StageDesign=API;
  if(typeof module!=='undefined'&&module.exports)module.exports=API;
})(typeof globalThis!=='undefined'?globalThis:this);
