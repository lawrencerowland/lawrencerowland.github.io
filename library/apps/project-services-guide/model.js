(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./data.js'):root.ProjectServicesData);
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ProjectServicesGuide=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(data){
  'use strict';
  const records=[...data.services.map(x=>({...x,type:x.family,group:null})),...data.groups.flatMap(group=>group.ideas.map(x=>({...x,type:'question',group:group.id,groupTitle:group.title})))];
  const normalise=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[–—‑-]/g,' ').replace(/\s+/g,' ').trim();
  function filter(query='',type='all') {
    if(!['all','practice','automation','question'].includes(type))throw new RangeError('Unknown option filter.');
    const terms=normalise(query).split(' ').filter(Boolean);
    return records.filter(record=>(type==='all'||record.type===type)&&terms.every(term=>normalise([record.title,record.offer,record.option,record.artefact,record.measure,record.scope,record.groupTitle].filter(Boolean).join(' ')).includes(term)));
  }
  function target(id) {
    const record=records.find(x=>x.id===id);
    if(record)return {id:record.id,group:record.group,section:record.type==='question'?'questions':'offers'};
    if(data.groups.some(x=>x.id===id))return {id,group:id,section:'questions'};
    if(['offers','questions'].includes(id))return {id,group:null,section:id};
    if(id==='board-contribution')return {id,group:null,section:id,disclosure:true};
    return null;
  }
  return {records,filter,target};
});
