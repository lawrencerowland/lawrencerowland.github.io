(function(root){
  'use strict';
  const D=typeof module!=='undefined'&&module.exports?require('./data.js'):root.LoomData;
  const EFFECTS=['cost','schedule','quality','supply','regulatory','talent'];
  const APP='portfolio-scenario-loom',MAX_FIBRES=32,MAX_MILESTONES=12,MAX_BYTES=200000;
  const clone=x=>JSON.parse(JSON.stringify(x)),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function fail(message){throw new Error(message);}
  function text(x,label,max=100){if(typeof x!=='string'||!x.trim()||x.length>max||/[\u0000-\u001f\u007f]/.test(x))fail(label+' must be nonblank text, at most '+max+' characters.');return x;}
  function identifier(x,label){text(x,label);if(['__proto__','prototype','constructor'].includes(x))fail(label+' is reserved.');return x;}
  function number(x,label,a,b,integer=false){if(typeof x!=='number'||!Number.isFinite(x)||x<a||x>b||(integer&&!Number.isInteger(x)))fail(label+' must be '+(integer?'an integer ':'')+'between '+a+' and '+b+'.');return x;}
  function object(x,label){if(!x||typeof x!=='object'||Array.isArray(x))fail(label+' must be an object.');return x;}
  function keys(x,allowed,label){object(x,label);if(Object.keys(x).some(k=>!allowed.includes(k)))fail(label+' contains an unknown field.');}
  function array(x,label,max){if(!Array.isArray(x)||x.length>max)fail(label+' must be a list of at most '+max+' items.');return x;}
  function parseDate(s){
    if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))fail('Use a calendar date in YYYY-MM-DD form.');
    const [y,m,d]=s.split('-').map(Number),dt=new Date(Date.UTC(y,m-1,d));
    if(y<1900||y>2200||dt.getUTCFullYear()!==y||dt.getUTCMonth()!==m-1||dt.getUTCDate()!==d)fail('Calendar dates must be real dates from 1900 to 2200.');
    return dt;
  }
  const monthIndex=s=>{const d=parseDate(s);return d.getUTCFullYear()*12+d.getUTCMonth();};
  const monthsBetween=(a,b)=>monthIndex(b)-monthIndex(a);
  function addMonths(s,n){const d=parseDate(s),y=d.getUTCFullYear(),m=d.getUTCMonth()+n;const last=new Date(Date.UTC(y,m+1,0)).getUTCDate();return new Date(Date.UTC(y,m,Math.min(d.getUTCDate(),last))).toISOString().slice(0,10);}
  function validate(input){
    const s=clone(input);keys(s,['library','selected','weights','milestones','startDate','horizon','risk'],'Model');
    parseDate(s.startDate);number(s.horizon,'Horizon',6,120,true);parseDate(addMonths(s.startDate,s.horizon));number(s.risk,'Tolerance',0,1);
    array(s.library,'Scenarios',MAX_FIBRES);array(s.selected,'Selection',MAX_FIBRES);array(s.milestones,'Milestones',MAX_MILESTONES);object(s.weights,'Weights');
    const ids=new Set();
    for(const f of s.library){
      keys(f,['id','name','type','start','end','confidence','weight','effects','second','tags'],'Scenario');identifier(f.id,'Scenario ID');if(ids.has(f.id))fail('Scenario IDs must be unique.');ids.add(f.id);text(f.name,'Scenario name');
      if(!['policy','market','tech'].includes(f.type))fail('Scenario type must be policy, market or tech.');
      parseDate(f.start);parseDate(f.end);if(f.start>f.end)fail('A scenario end must not precede its start.');
      number(f.confidence,'Assumed strength',0,1);number(f.weight,'Scenario weight',0,2);keys(f.effects,EFFECTS,'Effects');for(const k of EFFECTS)number(f.effects[k],k+' effect',-1,1);
      array(f.tags,'Tags',10).forEach(x=>text(x,'Tag',40));array(f.second,'Lagged links',8);
      for(const l of f.second){keys(l,['target','lagMonths','polarity','strength'],'Lagged link');identifier(l.target,'Target ID');number(l.lagMonths,'Lag in months',0,120,true);number(l.strength,'Link gain',0,2);if(l.polarity!==1&&l.polarity!==-1)fail('Link polarity must be +1 or -1.');}
    }
    for(const f of s.library)for(const l of f.second)if(!ids.has(l.target))fail('Unknown link target: '+l.target);
    if(new Set(s.selected).size!==s.selected.length||s.selected.some(x=>!ids.has(x)))fail('Selected IDs must be unique and name existing scenarios.');
    for(const [k,v]of Object.entries(s.weights)){if(!ids.has(k))fail('A saved weight names an unknown scenario.');number(v,'Saved weight',0,2);}
    const mids=new Set();for(const m of s.milestones){keys(m,['id','label','date'],'Milestone');identifier(m.id,'Milestone ID');text(m.label,'Milestone label',80);parseDate(m.date);if(mids.has(m.id))fail('Milestone IDs must be unique.');mids.add(m.id);}
    return s;
  }
  const defaults=()=>validate(D.seed);
  function parse(input){
    if(typeof input!=='string'||new TextEncoder().encode(input).length>MAX_BYTES)fail('The model file must be at most 200 KB.');
    let o;try{o=JSON.parse(input);}catch{fail('The file is not valid JSON.');}
    if(o&&Object.prototype.hasOwnProperty.call(o,'app')){keys(o,['app','version','state'],'File');if(o.app!==APP||o.version!==1)fail('This model format or version is not supported.');return validate(o.state);}
    return validate(o); // Explicit imports of the original CSPL export format.
  }
  const serialize=s=>JSON.stringify({app:APP,version:1,state:validate(s)},null,2);
  function baseActivation(s,f,m){
    const start=monthsBetween(s.startDate,f.start),end=monthsBetween(s.startDate,f.end),mid=(start+end)/2,span=Math.max(2,end-start),widen=Math.max(1,Math.round(.15*span));
    const left=start-widen,right=end+widen;if(m<left||m>right)return 0;
    const pos=(m-left)/(right-left),peak=(mid-left)/(right-left);
    return clamp(pos<=peak?pos/peak:(1-pos)/(1-peak),0,1)*f.confidence*(Object.hasOwn(s.weights,f.id)?s.weights[f.id]:f.weight);
  }
  function compute(s,pairs=true){
    const active=s.library.filter(f=>s.selected.includes(f.id)),n=s.horizon+1,ticks=Array.from({length:n},(_,i)=>addMonths(s.startDate,i));
    const base=Object.fromEntries(active.map(f=>[f.id,Array.from({length:n},(_,m)=>baseActivation(s,f,m))]));
    const extra=Object.fromEntries(active.map(f=>[f.id,Array(n).fill(0)])),activeIDs=new Set(active.map(f=>f.id));
    // The visible window does not erase earlier source activation; only base values propagate.
    for(const f of active)for(const l of f.second)if(activeIDs.has(l.target))for(let m=0;m<n;m++)extra[l.target][m]+=baseActivation(s,f,m-l.lagMonths)*l.strength*l.polarity;
    let clipped=0;const activation=Object.fromEntries(active.map(f=>[f.id,base[f.id].map((v,m)=>{const raw=v+extra[f.id][m];if(raw<0||raw>2)clipped++;return clamp(raw,0,2);})]));
    const factor=1.3-.6*s.risk;
    const monthly=ticks.map((date,m)=>{
      const stress=EFFECTS.map(k=>active.reduce((sum,f)=>sum+Math.max(0,f.effects[k]*activation[f.id][m]),0));
      const relief=EFFECTS.map(k=>active.reduce((sum,f)=>sum+Math.max(0,-f.effects[k]*activation[f.id][m]),0));
      const net=stress.map((v,k)=>v-relief[k]);let aligned=0,opposed=0;
      if(pairs)for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
        const dot=EFFECTS.reduce((sum,k)=>sum+active[i].effects[k]*active[j].effects[k],0)*activation[active[i].id][m]*activation[active[j].id][m];
        if(dot>=0)aligned+=dot;else opposed-=dot;
      }
      const attention=net.reduce((sum,v)=>sum+Math.max(0,v),0)*factor;
      return {date,stress,relief,net,aligned,opposed,attention};
    });
    const milestones=s.milestones.map(ms=>{
      const index=monthsBetween(s.startDate,ms.date),inRange=index>=0&&index<n;
      if(!inRange)return {...ms,index,inRange:false,probe:null,prompts:[]};
      const probe=monthly[index],prompts=EFFECTS.map((dim,k)=>({dim,pressure:Math.max(0,probe.net[k])*factor,net:probe.net[k]})).sort((a,b)=>b.pressure-a.pressure).map(x=>{
        const rule=D.rules.filter(r=>r.dim===x.dim).sort((a,b)=>b.thresh-a.thresh).find(r=>x.pressure>=r.thresh);
        return rule?{...x,threshold:rule.thresh,text:rule.text}:null;
      }).filter(Boolean).slice(0,3);
      return {...ms,index,inRange:true,probe,prompts};
    });
    return {active,ticks,activation,base,monthly,milestones,factor,clipped};
  }
  function swapped(s,remove,add){if(!s.selected.includes(remove)||s.selected.includes(add)||!s.library.some(f=>f.id===add))fail('Choose one selected scenario to remove and one unselected scenario to add.');const next=clone(s);next.selected=next.selected.map(id=>id===remove?add:id);return validate(next);}
  function compare(s,remove,add){const next=swapped(s,remove,add),before=compute(s,false),after=compute(next,false);return {next,before,after,rows:before.milestones.map((m,i)=>({label:m.label,date:m.date,before:m.probe?.attention??null,after:after.milestones[i].probe?.attention??null}))};}
  function csv(s){const r=compute(s),header=['month',...r.active.map(f=>'activation: '+f.name),...EFFECTS.map(k=>'net: '+k),...EFFECTS.map(k=>'stress: '+k),...EFFECTS.map(k=>'relief: '+k),'same_direction_alignment','opposition','attention_index'];const quote=x=>'"'+String(x).replaceAll('"','""')+'"';return [header,...r.monthly.map((p,i)=>[p.date,...r.active.map(f=>r.activation[f.id][i]),...p.net,...p.stress,...p.relief,p.aligned,p.opposed,p.attention])].map(row=>row.map(quote).join(',')).join('\r\n');}
  const api={APP,EFFECTS,MAX_FIBRES,MAX_MILESTONES,MAX_BYTES,clone,parseDate,monthsBetween,addMonths,validate,defaults,parse,serialize,baseActivation,compute,swapped,compare,csv};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LoomModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
