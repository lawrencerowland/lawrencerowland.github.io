/* Pure filtering/state logic. No network, persistence or ontology reasoning. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GraphModel=api;})(globalThis,function(){
'use strict';
const group=n=>n.group||n.type;
function validateData(data){
  if(!data||!Array.isArray(data.nodes)||!Array.isArray(data.edges))throw Error('Missing graph data.');
  const ids=new Set();for(const n of data.nodes){if(!n.id||ids.has(n.id)||!n.label)throw Error('Missing or duplicate node ID.');ids.add(n.id);}
  const edges=new Set();for(const e of data.edges){if(!ids.has(e.source)||!ids.has(e.target)||!e.type||!e.id||edges.has(e.id))throw Error('Invalid graph relationship.');edges.add(e.id);}
  return data;
}
function defaultState(data){return {v:1,query:'',types:[...new Set(data.nodes.map(group))],relations:[...new Set(data.edges.map(e=>e.type))],year:2015,undated:true,inferred:true,labels:true,ego:false,mapLines:false,reading:'',selected:null,charge:300,distance:110};}
function validateState(data,input){
  if(!input||typeof input!=='object'||Array.isArray(input)||input.v!==1)throw Error('Unrecognised view file.');
  const d=defaultState(data),s={...d};
  for(const k of Object.keys(input))if(!Object.prototype.hasOwnProperty.call(d,k))throw Error('Unknown view field: '+k);
  for(const k of ['types','relations']){if(!Array.isArray(input[k])||input[k].some(x=>!d[k].includes(x))||new Set(input[k]).size!==input[k].length)throw Error('Invalid '+k+' filter.');s[k]=[...input[k]];}
  if(typeof input.query!=='string'||input.query.length>200)throw Error('Search is too long.');s.query=input.query;
  for(const k of ['undated','inferred','labels','ego','mapLines']){if(typeof input[k]!=='boolean')throw Error('Invalid '+k+' setting.');s[k]=input[k];}
  for(const [k,min,max] of [['year',2015,2026],['charge',100,1000],['distance',50,300]]){if(!Number.isInteger(input[k])||input[k]<min||input[k]>max)throw Error('Invalid '+k+' value.');s[k]=input[k];}
  if(input.reading!==''&&!data.scenarios.some(r=>r.id===input.reading))throw Error('Unknown reading.');s.reading=input.reading;
  if(input.selected!==null&&!data.nodes.some(n=>n.id===input.selected))throw Error('Unknown selected node.');s.selected=input.selected;
  return s;
}
function derive(data,state){
  const s=validateState(data,state),q=s.query.trim().toLocaleLowerCase(),reading=data.scenarios.find(r=>r.id===s.reading);
  const nodes=data.nodes.filter(n=>s.types.includes(group(n))&&(!reading||reading.nodes.includes(n.id))&&(!q||[n.label,n.summary,n.description,JSON.stringify(n.meta)].join(' ').toLocaleLowerCase().includes(q))&&(n.type!=='Contract'||(n.meta.awardDate?Number(n.meta.awardDate.slice(0,4))>=s.year:s.undated)));
  const ids=new Set(nodes.map(n=>n.id)),edges=data.edges.filter(e=>ids.has(e.source)&&ids.has(e.target)&&s.relations.includes(e.type)&&(s.inferred||e.kind!=='inferred'));
  const selected=ids.has(s.selected)?s.selected:null,neighbors=new Set(selected?[selected]:[]),degree=new Map(nodes.map(n=>[n.id,0]));
  edges.forEach(e=>{degree.set(e.source,degree.get(e.source)+1);degree.set(e.target,degree.get(e.target)+1);if(e.source===selected)neighbors.add(e.target);if(e.target===selected)neighbors.add(e.source);});
  return {nodes,edges,ids,selected,neighbors,degree,isolated:nodes.filter(n=>degree.get(n.id)===0),inferred:edges.filter(e=>e.kind==='inferred').length};
}
function coordinate(data,id){
  const n=data.nodes.find(n=>n.id===id);if(!n)return null;
  if(Number.isFinite(n.lat)&&Number.isFinite(n.lon))return {lat:n.lat,lon:n.lon,basis:n.meta.coordinateBasis,anchor:n.id,derived:false};
  if(n.type==='Organisation'){const e=data.edges.find(e=>e.source===id&&e.type==='BASED_IN');if(e){const c=coordinate(data,e.target);return c?{...c,derived:true,basis:e.rationale+' '+c.basis}:null;}}
  if(n.type==='Project'||n.type==='Contract'){const e=data.edges.find(e=>e.source===id&&['SCOPED_TO','ASSOCIATED_WITH_AREA'].includes(e.type));if(e){const c=coordinate(data,e.target);return c?{...c,derived:true,basis:'Assigned to the approximate project anchor for this projection; this is not a contract delivery coordinate. '+c.basis}:null;}}
  return null;
}
function mapEdges(data,view){return view.edges.flatMap(e=>{const a=coordinate(data,e.source),b=coordinate(data,e.target);return a&&b&&(a.lat!==b.lat||a.lon!==b.lon)?[{...e,a,b}]:[];});}
function exportView(data,state){return JSON.stringify({app:data.meta.kind,sourceRevision:data.meta.sourceRevision,state:validateState(data,state)},null,2);}
function importView(data,text){if(typeof text!=='string'||text.length>30000)throw Error('View file is too large.');const v=JSON.parse(text);if(v.app!==data.meta.kind||v.sourceRevision!==data.meta.sourceRevision)throw Error('This view belongs to a different example or data revision.');return validateState(data,v.state);}
return {group,validateData,defaultState,validateState,derive,coordinate,mapEdges,exportView,importView};
});
