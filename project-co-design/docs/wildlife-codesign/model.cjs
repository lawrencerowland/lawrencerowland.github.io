(function(root){
  'use strict';
  const VERSION='wildlife-dpi-1';
  const DEFAULTS={target:110,maxSites:3,capitalLimit:null,landLimit:null};
  const RESOURCE_KEYS=['capital','land','annual'];
  const zero=()=>({capital:0,land:0,annual:0});
  const plus=(a,b)=>Object.fromEntries(RESOURCE_KEYS.map(k=>[k,a[k]+b[k]]));
  const baseBridges=[
    {width:30,capacity:45,resources:{capital:4225000,land:6000,annual:44900}},
    {width:50,capacity:75,resources:{capital:6255000,land:10000,annual:65500}},
    {width:70,capacity:105,resources:{capital:8306000,land:15000,annual:86600}}
  ];
  const bridges=[];
  function bundles(widths,start){
    const parts=widths.map(w=>baseBridges.find(b=>b.width===w));
    bridges.push({id:'b-'+(widths.join('-')||'none'),widths:widths.slice(),count:widths.length,capacity:parts.reduce((n,b)=>n+b.capacity,0),fenceNeedKm:2*widths.length,observationNeed:2*widths.length,resources:parts.reduce((r,b)=>plus(r,b.resources),zero())});
    if(widths.length<3)for(let j=start;j<baseBridges.length;j++)bundles([...widths,baseBridges[j].width],j);
  }
  bundles([],0);
  const fences=[{id:'f-none',kind:'none',name:'No fencing',km:0,observationNeed:0,resources:zero()}];
  for(const km of [2,4,6])for(const kind of ['standard','durable'])fences.push({id:`f-${kind}-${km}`,kind,name:kind==='standard'?'Standard mesh':'Durable mesh',km,observationNeed:km/2,resources:{capital:km*(kind==='standard'?100000:160000),land:km*500,annual:km*(kind==='standard'?2000:1000)}});
  const monitoring=[{id:'m-none',kind:'none',name:'No monitoring',points:0,staffMilli:0,annualEquipment:0,annualStaff:0,resources:zero()}];
  for(const points of [3,6,9])for(const kind of ['field','assisted']){
    const staffMilli=points*(kind==='field'?100:40),annualStaff=55*staffMilli;
    const annualEquipment=kind==='field'?800*points:2000+1400*points;
    monitoring.push({id:`m-${kind}-${points}`,kind,name:kind==='field'?'Field review':'Assisted review',points,staffMilli,annualEquipment,annualStaff,resources:{capital:kind==='field'?50000+30000*points:120000+45000*points,land:0,annual:annualEquipment+annualStaff}});
  }
  const CATALOGUES={baseBridges,bridges,fences,monitoring};
  function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
  freeze(CATALOGUES);freeze(DEFAULTS);freeze(RESOURCE_KEYS);
  function normalize(input={}){
    if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('A request must be an object.');
    for(const key of Object.keys(input))if(!Object.prototype.hasOwnProperty.call(DEFAULTS,key))throw new Error('Unknown request field: '+key);
    const p={...DEFAULTS,...input};
    if(!Number.isInteger(p.target)||p.target<0||p.target>330)throw new RangeError('Target must be a whole number from 0 to 330.');
    if(!Number.isInteger(p.maxSites)||p.maxSites<0||p.maxSites>3)throw new RangeError('Available sites must be a whole number from 0 to 3.');
    for(const [key,max] of [['capitalLimit',1000000000],['landLimit',1000000]])if(p[key]!==null&&(!Number.isInteger(p[key])||p[key]<0||p[key]>max))throw new RangeError(key+' must be null or a non-negative whole number in base units.');
    return p;
  }
  function witness(b,f,m){
    return {id:[b.id,f.id,m.id].join('|'),parts:{bridge:b.id,fence:f.id,monitoring:m.id},widths:b.widths.slice(),sites:b.count,exec:{capacity:b.capacity},interfaces:{fenceRequired:b.fenceNeedKm,fenceProvided:f.km,observationRequired:b.observationNeed+f.observationNeed,observationProvided:m.points},resources:plus(plus(b.resources,f.resources),m.resources),staffMilli:m.staffMilli};
  }
  function compose(grouping='bridge-fence'){
    const implementations=[];let compatiblePairs=0;
    if(grouping==='bridge-fence'){
      // Preserve each implementation and its remaining observation obligation.
      for(const b of bridges)for(const f of fences)if(b.fenceNeedKm<=f.km){
        compatiblePairs++;const need=b.observationNeed+f.observationNeed;
        for(const m of monitoring)if(need<=m.points)implementations.push(witness(b,f,m));
      }
    }else if(grouping==='fence-monitor'){
      // The composite supplier provides guide-km plus residual observation points.
      for(const f of fences)for(const m of monitoring)if(f.observationNeed<=m.points){
        compatiblePairs++;const residual=m.points-f.observationNeed;
        for(const b of bridges)if(b.fenceNeedKm<=f.km&&b.observationNeed<=residual)implementations.push(witness(b,f,m));
      }
    }else throw new Error('Unknown grouping.');
    implementations.sort((a,b)=>a.id.localeCompare(b.id));
    return {grouping,compatiblePairs,implementations};
  }
  function dominates(a,b){return RESOURCE_KEYS.every(k=>a[k]<=b[k])&&RESOURCE_KEYS.some(k=>a[k]<b[k]);}
  function antichain(implementations){
    const retained=[];
    for(const candidate of implementations){
      if(retained.some(x=>dominates(x.resources,candidate.resources)))continue;
      for(let j=retained.length-1;j>=0;j--)if(dominates(candidate.resources,retained[j].resources))retained.splice(j,1);
      retained.push(candidate);
    }
    const groups=new Map();
    for(const w of retained){const key=RESOURCE_KEYS.map(k=>w.resources[k]).join('-');if(!groups.has(key))groups.set(key,{id:'r-'+key,resources:{...w.resources},implementations:[]});groups.get(key).implementations.push(w);}
    return [...groups.values()].sort((a,b)=>a.resources.capital-b.resources.capital||a.resources.land-b.resources.land||a.resources.annual-b.resources.annual);
  }
  function requestFailures(w,p){
    const reasons=[];
    if(w.sites>p.maxSites)reasons.push('sites');
    if(w.exec.capacity<p.target)reasons.push('capacity');
    if(p.capitalLimit!==null&&w.resources.capital>p.capitalLimit)reasons.push('capital');
    if(p.landLimit!==null&&w.resources.land>p.landLimit)reasons.push('land');
    return reasons;
  }
  function solve(input={}){
    const params=normalize(input),composition=compose(),rejected={sites:0,capacity:0,capital:0,land:0};
    let beforeCaps=0;
    const feasible=composition.implementations.filter(w=>{
      if(w.sites<=params.maxSites&&w.exec.capacity>=params.target)beforeCaps++;
      const errors=requestFailures(w,params);errors.forEach(k=>rejected[k]++);return errors.length===0;
    });
    const frontier=antichain(feasible);
    return {version:VERSION,params,frontier,feasible,counts:{bridgeOptions:bridges.length,fenceOptions:fences.length,monitoringOptions:monitoring.length,fullProduct:bridges.length*fences.length*monitoring.length,compatibleBridgeFencePairs:composition.compatiblePairs,compatibleImplementations:composition.implementations.length,feasibleBeforeResourceCaps:beforeCaps,feasibleImplementations:feasible.length,frontierVectors:frontier.length,frontierWitnesses:frontier.reduce((n,g)=>n+g.implementations.length,0)},rejected,maxCapacityAtAvailableSites:params.maxSites*105};
  }
  function replay(id,input={}){
    const params=normalize(input),parts=typeof id==='string'?id.split('|'):[];
    const b=bridges.find(x=>x.id===parts[0]),f=fences.find(x=>x.id===parts[1]),m=monitoring.find(x=>x.id===parts[2]);
    if(parts.length!==3||!b||!f||!m)return {valid:false,errors:['Unknown implementation identifier.']};
    const w=witness(b,f,m),errors=[];
    if(b.fenceNeedKm>f.km)errors.push('Guide-fence interface is not satisfied.');
    if(b.observationNeed+f.observationNeed>m.points)errors.push('Observation-point interface is not satisfied.');
    errors.push(...requestFailures(w,params));
    return {valid:errors.length===0,errors,implementation:w};
  }
  const api=Object.freeze({VERSION,DEFAULTS,RESOURCE_KEYS,CATALOGUES,normalize,compose,solve,replay});
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.WildlifeCoDesign=api;
})(typeof globalThis==='object'?globalThis:this);
