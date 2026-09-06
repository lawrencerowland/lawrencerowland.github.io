// Independent complete-history oracle: no engine imports, DP, state cache or engine helpers.
// Every admissible nonempty tick choice is enumerated and every history replayed.
export const DEFAULTS={horizon:8,serviceFloor:1,milestoneSlot:4,milestoneService:2,crews:2,accessCap:2,temporaryAvailable:true};
const CATALOG={P:{cost:3,access:1},S:{cost:4,access:1},GD:{cost:3,access:2},GP:{cost:2,access:0},GC:{cost:4,access:1},TI:{cost:4,access:1},TR:{cost:0,access:1}};
export const catalogue=CATALOG;
export function initial(){return {p:0,s:0,g:0,prepared:false,temp:0};}
export function complete(x){return x.p===2&&x.s===2&&x.g===2&&!x.prepared&&x.temp!==1;}
function enabled(x,q){const out=[];if(x.p<2&&x.s>=x.p+1)out.push('P');if(x.s<2)out.push('S');if(x.g<2&&!x.prepared)out.push('GD','GP');if(x.g<2&&x.prepared)out.push('GC');if(q.temporaryAvailable&&x.temp===0&&x.g<2)out.push('TI');if(x.temp===1)out.push('TR');return out;}
function concurrent(actions,q){if(actions.length>q.crews)return false;if(actions.filter(a=>a[0]==='G').length>1)return false;if(actions.some(a=>a[0]==='T')&&actions.some(a=>a[0]==='G'))return false;return actions.reduce((n,a)=>n+CATALOG[a].access,0)<=q.accessCap;}
export function tick(x,actions,q,slot,{endpoint=false}={}){
 const es=enabled(x,q);if(actions.length===0||new Set(actions).size!==actions.length||actions.some(a=>!es.includes(a)))return null;
 if(!concurrent(actions,q))return null;
 const gcap=actions.includes('GD')&&x.temp!==1?0:1+x.g;
 const service=Math.min(1+x.p,1+x.s,gcap);
 if(!endpoint&&service<q.serviceFloor)return null;
 const y={...x}; for(const a of actions){if(a==='P')y.p++;if(a==='S')y.s++;if(a==='GD'){y.g++;}if(a==='GP')y.prepared=true;if(a==='GC'){y.g++;y.prepared=false;}if(a==='TI')y.temp=1;if(a==='TR')y.temp=2;}
 if(!endpoint&&slot===q.milestoneSlot&&Math.min(1+y.p,1+y.s,1+y.g)<q.milestoneService)return null;
 return {state:y,service,cost:actions.reduce((n,a)=>n+CATALOG[a].cost,0),access:actions.reduce((n,a)=>n+CATALOG[a].access,0)};
}
export function replay(history,params={},opts={}){
 const q={...DEFAULTS,...params};let state=initial(),cost=0,peak=0,total=0;const stages=[];
 for(let i=0;i<history.length;i++){if(complete(state))return {valid:false,reason:'Continues after final target'};const t=tick(state,history[i],q,i+1,opts);if(!t)return {valid:false,reason:`Invalid tick ${i+1}`,state};state=t.state;cost+=t.cost;peak=Math.max(peak,t.access);total+=t.access;stages.push({...t,actions:[...history[i]],slot:i+1});}
 return {valid:history.length<=q.horizon&&complete(state),state,cost,finish:history.length,peakAccess:peak,accessTotal:total,resources:[cost,history.length,peak],stages};
}
export function dominates(a,b){return a.every((v,i)=>v<=b[i])&&a.some((v,i)=>v<b[i]);}
export function frontier(vectors){return vectors.filter((v,i)=>!vectors.some((w,j)=>i!==j&&dominates(w,v)));}
export function enumerate(params={},opts={}){
 const q={...DEFAULTS,...params};const outcomes=new Map();let visited=0,finished=0;
 function walk(state,history,cost,peak,total){visited++;if(complete(state)){finished++;const r=[cost,history.length,peak];const k=r.join(',');if(!outcomes.has(k))outcomes.set(k,{resources:r,history:history.map(a=>[...a]),state:{...state},cost,finish:history.length,peakAccess:peak,accessTotal:total});return;}if(history.length>=q.horizon)return;
 const e=enabled(state,q),n=1<<e.length;for(let mask=1;mask<n;mask++){const as=[];for(let j=0;j<e.length;j++)if(mask&(1<<j))as.push(e[j]);const t=tick(state,as,q,history.length+1,opts);if(t)walk(t.state,[...history,as],cost+t.cost,Math.max(peak,t.access),total+t.access);}}
 walk(initial(),[],0,0,0);const all=[...outcomes.values()];const front=all.filter(x=>!all.some(y=>dominates(y.resources,x.resources)));
 return {params:q,visited,finished,uniqueResources:all.length,frontier:front,all};
}
