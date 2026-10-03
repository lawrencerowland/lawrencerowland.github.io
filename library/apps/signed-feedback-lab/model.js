(function (root) {
  'use strict';
  const LINKS = [['e1','Reg','Op'],['e2','Op','Reg'],['e3','Ov','Reg'],['e4','Op','Ov']];
  const clone = value => JSON.parse(JSON.stringify(value));
  const LIMIT = 1e6, RUN_LIMIT = 1e12, MAX_TICKS = 500;
  function preset(key = 'delivery') {
    const original = key === 'original';
    if (!['delivery','growing','boundary','original'].includes(key)) throw new Error('Unknown example.');
    const labels = original ? ['Regulator','Operator','Oversight'] : ['Review pressure','Rework activity','Evidence gaps'];
    const activities = original ? ['Licence conditions','Incident reports','Parliamentary pressure','Transparency metrics'] : ['Review requests correction','Correction relieves review','Gaps trigger review','Rework reveals gaps'];
    const gains = key === 'growing' ? [1.2,-1.2,.2,.3] : key === 'boundary' ? [1,-1,0,0] : [.35,-.25,.2,.3];
    return {version:1, preset:key, nodes:['Reg','Op','Ov'].map((id,i)=>({id,label:labels[i],initial:[1,.2,0][i]})), edges:LINKS.map(([id,from,to],i)=>({id,from,to,gain:gains[i],activity:activities[i]}))};
  }
  function bounded(value, name, limit = LIMIT) {
    if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > limit) throw new Error(name + ' must be a finite number between −' + limit + ' and ' + limit + '.');
    return value;
  }
  function label(value, name) {
    if (typeof value !== 'string' || !value.trim() || value.length > 100 || /[\x00-\x1f]/.test(value)) throw new Error(name + ' must contain 1–100 printable characters.');
    return value.trim();
  }
  function validateConfig(raw) {
    if (!raw || raw.version !== 1 || !Array.isArray(raw.nodes) || raw.nodes.length !== 3 || !Array.isArray(raw.edges) || raw.edges.length !== 4) throw new Error('Use version 1 with the three nodes and four links in the exported template.');
    const nodes = ['Reg','Op','Ov'].map(id=>{
      const matches=raw.nodes.filter(n=>n && n.id===id); if(matches.length!==1) throw new Error('Each node ID must occur once: Reg, Op, Ov.');
      return {id,label:label(matches[0].label,'Node label'),initial:bounded(matches[0].initial,'Starting signal')};
    });
    const edges=LINKS.map(([id,from,to])=>{
      const matches=raw.edges.filter(e=>e && e.id===id); if(matches.length!==1 || matches[0].from!==from || matches[0].to!==to) throw new Error('Keep the four link IDs and their endpoints from the template.');
      return {id,from,to,gain:bounded(matches[0].gain,'Gain'),activity:label(matches[0].activity,'Activity label')};
    });
    return {version:1,preset:['delivery','growing','boundary','original'].includes(raw.preset)?raw.preset:'delivery',nodes,edges};
  }
  function matrix(config) {
    const w=Array.from({length:3},()=>[0,0,0]);
    config.edges.forEach(e=>{ w[config.nodes.findIndex(n=>n.id===e.to)][config.nodes.findIndex(n=>n.id===e.from)]+=e.gain; });
    return w;
  }
  function multiply(w,x) { return w.map(row=>row.reduce((sum,v,j)=>sum+v*x[j],0)); }
  function contributions(config,x) {
    return config.edges.map(e=>({id:e.id,value:e.gain*x[config.nodes.findIndex(n=>n.id===e.from)]}));
  }
  // All three roots of det(lambda I - W), including a complex conjugate pair.
  // Scaling and a cancellation-avoiding Cardano branch keep this bounded 3x3 calculation small.
  function eigenvalues3(w) {
    if (!Array.isArray(w)||w.length!==3||w.some(row=>!Array.isArray(row)||row.length!==3||row.some(v=>!Number.isFinite(v)))) throw new Error('A finite 3 × 3 matrix is required.');
    const scale=Math.max(...w.flat().map(Math.abs));
    if(scale===0) return Array.from({length:3},()=>({re:0,im:0}));
    const m=w.map(row=>row.map(v=>v/scale));
    const a=-(m[0][0]+m[1][1]+m[2][2]);
    const b=m[0][0]*m[1][1]+m[0][0]*m[2][2]+m[1][1]*m[2][2]-m[0][1]*m[1][0]-m[0][2]*m[2][0]-m[1][2]*m[2][1];
    const c=-(m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]));
    const p=b-a*a/3, q=2*a*a*a/27-a*b/3+c;
    const d=q*q/4+p*p*p/27;
    const tol=64*Number.EPSILON*(Math.abs(q*q/4)+Math.abs(p*p*p/27));
    let roots;
    if(d>tol) {
      const u=Math.cbrt(-q/2+(q>0?-1:1)*Math.sqrt(d));
      const v=u===0?0:-p/(3*u), sum=u+v;
      roots=[{re:sum-a/3,im:0},{re:-sum/2-a/3,im:Math.sqrt(3)*(u-v)/2},{re:-sum/2-a/3,im:-Math.sqrt(3)*(u-v)/2}];
    } else if(d < -tol) {
      const r=2*Math.sqrt(-p/3), theta=Math.atan2(Math.sqrt(-d),-q/2)/3;
      roots=[0,1,2].map(k=>({re:r*Math.cos(theta-2*Math.PI*k/3)-a/3,im:0}));
    } else {
      const u=Math.cbrt(-q/2);
      roots=[{re:2*u-a/3,im:0},{re:-u-a/3,im:0},{re:-u-a/3,im:0}];
    }
    return roots.map(z=>({re:z.re*scale,im:z.im*scale}));
  }
  function stability(w) {
    const eigenvalues=eigenvalues3(w), rho=Math.max(...eigenvalues.map(z=>Math.hypot(z.re,z.im)));
    const tolerance=1e-9;
    return {eigenvalues,rho,classification:rho<1-tolerance?'decay':rho>1+tolerance?'unstable':'boundary',tolerance};
  }
  function loops(config) {
    const g=Object.fromEntries(config.edges.map(e=>[e.id,e.gain]));
    return [{nodes:['Reg','Op','Reg'],value:g.e1*g.e2,length:2},{nodes:['Reg','Op','Ov','Reg'],value:g.e1*g.e4*g.e3,length:3}];
  }
  function start(config) {
    const checked=validateConfig(config), state=checked.nodes.map(n=>n.initial);
    return {config:checked,tick:0,state,history:[{tick:0,state:[...state]}]};
  }
  function step(run) {
    if(run.tick>=MAX_TICKS) throw new Error('Stopped at 500 ticks. Restart to run again; the complete history can be exported.');
    const state=multiply(matrix(run.config),run.state);
    if(state.some(v=>!Number.isFinite(v)||Math.abs(v)>RUN_LIMIT)) throw new Error('Stopped before a signal exceeded 10¹². The last finite state is retained; reduce the gains or restart.');
    const tick=run.tick+1;
    return {...run,tick,state,history:[...run.history,{tick,state:[...state]}]};
  }
  function encode(config) { return JSON.stringify(validateConfig(config),null,2); }
  function decode(text) { if(typeof text!=='string'||text.length>100000) throw new Error('Model JSON must be under 100 KB.'); return validateConfig(JSON.parse(text)); }
  function dot(config,state=config.nodes.map(n=>n.initial)) {
    const quote=s=>JSON.stringify(String(s));
    const lines=['digraph SignedFeedback {','  rankdir=LR;','  // Intermediate nodes are algebraic contributions, not extra time steps.','  node [shape=ellipse, style=filled, fillcolor="#e7eee3"];'];
    config.nodes.forEach((n,i)=>lines.push('  '+n.id+' [label='+quote(n.label+'\nx = '+state[i])+'];'));
    const flows=contributions(config,state);
    config.edges.forEach((e,i)=>{const color=e.gain<0?'#9b4e3a':e.gain>0?'#2a6958':'#74796f';lines.push('  AV_'+e.id+' [shape=box, fillcolor="#f5e8ca", label='+quote(e.activity+'\nc = '+flows[i].value)+'];','  '+e.from+' -> AV_'+e.id+' [color='+quote(color)+', label='+quote('× '+e.gain)+'];','  AV_'+e.id+' -> '+e.to+' [color='+quote(color)+', label="× 1"];');});
    return lines.concat('}').join('\n')+'\n';
  }
  function csv(run) {
    const cell=s=>'"'+String(s).replaceAll('"','""')+'"';
    return [['Tick',...run.config.nodes.map(n=>n.label)].map(cell).join(','),...run.history.map(h=>[h.tick,...h.state].join(','))].join('\n')+'\n';
  }
  const api={preset,validateConfig,matrix,multiply,contributions,eigenvalues3,stability,loops,start,step,encode,decode,dot,csv,clone,MAX_TICKS};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  root.SignedFeedbackModel=api;
})(globalThis);
