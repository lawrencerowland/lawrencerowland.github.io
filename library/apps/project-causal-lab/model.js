(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CausalLab = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const mean = xs => xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = xs => { const m = mean(xs); return Math.sqrt(xs.reduce((s, v) => s + (v-m)**2, 0) / Math.max(1, xs.length-1)); };
  function graph(nodes, edges) {
    if (nodes.length > 12) throw Error('Use at most 12 variables in this teaching graph.');
    if (new Set(nodes.map(n => n.id)).size !== nodes.length || nodes.some(n => !n.id || n.id.length > 60)) throw Error('Use unique names of 1–60 characters.');
    const ids = nodes.map(n => n.id), seen = new Set();
    for (const [a,b] of edges) {
      const key = JSON.stringify([a,b]);
      if (!ids.includes(a) || !ids.includes(b) || a === b || seen.has(key)) throw Error('Arrows need two different existing variables and cannot repeat.');
      seen.add(key);
    }
    const degree = new Map(ids.map(id => [id, 0]));
    edges.forEach(([,b]) => degree.set(b, degree.get(b)+1));
    const q = ids.filter(id => !degree.get(id)); let count = 0;
    while (q.length) { const a = q.pop(); count++; for (const [x,b] of edges) if (x===a) { degree.set(b, degree.get(b)-1); if (!degree.get(b)) q.push(b); } }
    if (count !== ids.length) throw Error('That arrow creates a cycle. Use an acyclic causal graph.');
    return {nodes, edges};
  }
  function reachable(g, seed) {
    const found = new Set(), q = [seed];
    for (let i=0; i<q.length; i++) for (const [a,b] of g.edges) if (a===q[i] && !found.has(b)) { found.add(b); q.push(b); }
    return found;
  }
  // Exact d-separation: ancestral graph, marry parents, forget arrow direction, remove Z.
  function dSeparated(g, x, y, z=[]) {
    const ids = g.nodes.map(n=>n.id);
    if (x===y || !ids.includes(x) || !ids.includes(y) || z.some(v=>!ids.includes(v) || v===x || v===y)) throw Error('Choose different existing endpoints and an interior conditioning set.');
    const ancestors = new Set([x,y,...z]); let changed = true;
    while (changed) { changed = false; for (const [a,b] of g.edges) if (ancestors.has(b) && !ancestors.has(a)) { ancestors.add(a); changed=true; } }
    const adj = new Map([...ancestors].map(n=>[n,new Set()]));
    const join = (a,b) => { adj.get(a).add(b); adj.get(b).add(a); };
    for (const [a,b] of g.edges) if (ancestors.has(a) && ancestors.has(b)) join(a,b);
    for (const child of ancestors) {
      const parents = g.edges.filter(([,b])=>b===child).map(([a])=>a);
      for (let i=0;i<parents.length;i++) for (let j=i+1;j<parents.length;j++) join(parents[i],parents[j]);
    }
    const visited = new Set(z), queue = [x]; visited.add(x);
    for (let i=0;i<queue.length;i++) { if (queue[i]===y) return false; for (const n of adj.get(queue[i])) if (!visited.has(n)) { visited.add(n); queue.push(n); } }
    return true;
  }
  function backdoor(g, x, y, z=[]) {
    const desc = reachable(g,x), reasons = [];
    if (z.some(v=>v===x || v===y || desc.has(v))) reasons.push('The conditioning set includes an endpoint or a descendant of the cause.');
    if (z.some(v=>!g.nodes.some(n=>n.id===v && n.observed!==false))) reasons.push('Every adjustment variable must be observed.');
    const eligible = !reasons.length;
    const blocked = eligible && dSeparated({...g,edges:g.edges.filter(([a])=>a!==x)},x,y,z);
    if (eligible && !blocked) reasons.push('At least one back-door path remains open.');
    return {valid: eligible && blocked, reasons};
  }
  function adjustmentSets(g,x,y) {
    const desc=reachable(g,x), candidates=g.nodes.filter(n=>n.id!==x && n.id!==y && !desc.has(n.id) && n.observed!==false).map(n=>n.id);
    const valid=[];
    for(let mask=0; mask<2**candidates.length; mask++) {
      const z=candidates.filter((_,i)=>mask & (1<<i));
      if (valid.some(v=>v.every(n=>z.includes(n)))) continue;
      if(backdoor(g,x,y,z).valid) valid.push(z);
    }
    return valid.filter(z=>!valid.some(v=>v.length<z.length && v.every(n=>z.includes(n))));
  }
  function paths(g,x,y,z=[],limit=200) {
    const has=(a,b)=>g.edges.some(e=>e[0]===a && e[1]===b), result=[];
    let truncated=false;
    function visit(p) {
      if(result.length>limit) {truncated=true;return;}
      const a=p[p.length-1];
      if(a===y) {
        const colliders=p.slice(1,-1).filter((n,i)=>has(p[i],n)&&has(p[i+2],n));
        const blocked=p.slice(1,-1).some(n=>colliders.includes(n) ? !(z.includes(n)||[...reachable(g,n)].some(d=>z.includes(d))) : z.includes(n));
        result.push({nodes:p,colliders,open:!blocked,kind:has(p[1],x)?'back-door':p.every((n,i)=>i===0||has(p[i-1],n))?'directed':'other'}); return;
      }
      const neighbors=g.edges.filter(e=>e.includes(a)).map(e=>e[0]===a?e[1]:e[0]);
      for(const b of neighbors) if(!p.includes(b)) visit([...p,b]);
    }
    if(x!==y) visit([x]);
    return {items:result.slice(0,limit),truncated};
  }
  const examples = {
    project: {labels:['Scope Creep','Interface Misalignment','Vendor Capacity','Design Risk','Cost Overrun','Delay'],edges:[[0,3],[1,3],[2,5],[3,5],[5,4]],x:3,y:4},
    confounding: {labels:['Team Capacity','Automation','Throughput'],edges:[[0,1],[0,2],[1,2]],x:1,y:2},
    collider: {labels:['Design Risk','Escalations','Vendor Risk','Escalation Review'],edges:[[0,1],[2,1],[1,3]],x:0,y:2},
    mediation: {labels:['Automation','Rework','Throughput'],edges:[[0,1],[1,2],[0,2]],x:0,y:2}
  };
  function example(key='project') {
    const e=examples[key]; if(!e) throw Error('Unknown graph example.');
    const positions={project:[[120,55],[120,175],[365,310],[365,110],[650,315],[650,185]],confounding:[[390,65],[140,260],[640,260]],collider:[[140,65],[390,185],[640,65],[390,310]],mediation:[[140,80],[390,270],[640,80]]}[key];
    return {nodes:e.labels.map((id,i)=>({id,observed:true,x:positions[i][0],y:positions[i][1]})),edges:e.edges.map(([a,b])=>[e.labels[a],e.labels[b]]),x:e.labels[e.x],y:e.labels[e.y]};
  }
  function rng(seed) {let a=seed>>>0;return ()=>{let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
  function normal(random) {return Math.sqrt(-2*Math.log(Math.max(Number.MIN_VALUE,random())))*Math.cos(2*Math.PI*random());}
  function synthetic(n=52,seed=42) {
    const random=rng(seed), data=[];let S=10,A=.35,W=10;
    for(let week=1;week<=n;week++) {
      const U=Math.max(0,.8+.4*(random()-.5)),R=Math.max(0,.7*U+.5*(1-A)+.1*(random()-.5));
      const T=Math.max(.1,1+.45*S+2.2*A-.9*U-.8*R-.05*Math.max(0,W-10)+.2*(random()-.5));
      const L=clamp(5*(W/Math.max(T,.1))*(1+.05*(random()-.5)),1,60),D=Math.max(0,.015+.008*U+.007*R-.01*A+.0005*T+.002*(random()-.5));
      data.push({week,S,A,W,U,R,T,L,D});
      if(week%8===0) A=clamp(A+.02*(random()-.4),.1,.9);
      if(week%13===0) S=clamp(S+(random()<.5?1:-1),6,18);
      if(week%10===0) W=clamp(W+(random()<.6?-1:1),6,16);
    } return data;
  }
  const columns=['week','S','A','W','U','R','T','L','D'];
  function validateData(data) {
    if(data.length<8 || data.length>5000) throw Error('Use 8–5,000 complete weekly rows. More rows do not guarantee an estimable model.');
    const weeks=new Set();
    for(let i=0;i<data.length;i++) {
      const r=data[i];
      if(columns.some(k=>!Number.isFinite(r[k]) || Math.abs(r[k])>1e9)) throw Error(`Row ${i+2}: all nine columns must contain finite numbers of magnitude at most 1e9.`);
      if(!Number.isInteger(r.week)||r.week<1||weeks.has(r.week)) throw Error(`Row ${i+2}: week must be a unique positive integer.`);
      weeks.add(r.week);
      if(r.S<0||r.A<0||r.A>1||r.W<1||r.U<0||r.R<0||r.T<=0||r.L<=0||r.D<0) throw Error(`Row ${i+2}: require S,U,R,D ≥ 0; A in [0,1]; W ≥ 1; T,L > 0.`);
    } return data;
  }
  function parseCSV(text) {
    if(typeof text!=='string'||text.length>2e6) throw Error('Use a CSV file no larger than 2 MB.');
    text=text.replace(/^\uFEFF/,'');
    const rows=[];let row=[],field='',quoted=false,closed=false;
    for(let i=0;i<=text.length;i++) {
      const c=i===text.length?'\n':text[i];
      if(quoted) {if(c==='"') {if(text[i+1]==='"') {field+='"';i++;}else {quoted=false;closed=true;}}else {if(i===text.length) throw Error('Unclosed CSV quotation.');field+=c;}continue;}
      if(c==='"') {if(field.trim()||closed) throw Error('Malformed CSV quotation.');quoted=true;field='';}
      else if(c===','||c==='\n'||c==='\r') {row.push(field.trim());field='';closed=false;if(c!==',') {if(row.some(v=>v!=='')) rows.push(row);row=[];if(c==='\r'&&text[i+1]==='\n')i++;}}
      else {if(closed&&!/\s/.test(c)) throw Error('Unexpected text after a quoted field.');field+=c;}
    }
    const headers=rows.shift()||[];
    if(new Set(headers).size!==headers.length || headers.length!==columns.length || columns.some(k=>!headers.includes(k))) throw Error('Use exactly these nine unique headers: '+columns.join(','));
    const numeric=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
    const data=rows.map((r,i)=>{if(r.length!==headers.length||r.some(v=>!numeric.test(v))) throw Error(`Row ${i+2}: use nine nonblank numeric cells.`);return Object.fromEntries(headers.map((k,j)=>[k,Number(r[j])]));});
    return validateData(data);
  }
  function csv(data) {return columns.join(',')+'\n'+data.map(r=>columns.map(k=>r[k]).join(',')).join('\n')+'\n';}
  // Centred/scaled modified Gram-Schmidt QR with re-orthogonalisation; no normal equations.
  function ols(y,X) {
    const n=y.length,p=X[0]?.length;
    if(!p||n<=p||X.length!==n||X.some(r=>r.length!==p||r[0]!==1||r.some(v=>!Number.isFinite(v)))||y.some(v=>!Number.isFinite(v))) throw Error('Regression requires finite rows, a leading intercept, and more rows than coefficients.');
    const centers=Array(p).fill(0),scales=Array(p).fill(1);
    for(let j=1;j<p;j++) {centers[j]=mean(X.map(r=>r[j]));scales[j]=Math.sqrt(mean(X.map(r=>(r[j]-centers[j])**2)));if(!scales[j]) throw Error('Regression is rank deficient: a predictor is constant.');}
    const Q=[],R=Array.from({length:p},()=>Array(p).fill(0));
    for(let j=0;j<p;j++) {
      const v=X.map(r=>(r[j]-centers[j])/scales[j]);
      for(let pass=0;pass<2;pass++) for(let k=0;k<j;k++) {const a=v.reduce((s,t,i)=>s+t*Q[k][i],0);R[k][j]+=a;for(let i=0;i<n;i++)v[i]-=a*Q[k][i];}
      R[j][j]=Math.hypot(...v);
      if(!Number.isFinite(R[j][j])||R[j][j]<Math.sqrt(n)*1e-8) throw Error('Regression is rank deficient or too close to collinear. Vary the measured inputs.');
      Q.push(v.map(t=>t/R[j][j]));
    }
    const beta=Q.map(q=>q.reduce((s,v,i)=>s+v*y[i],0));
    for(let j=p-1;j>=0;j--) {for(let k=j+1;k<p;k++)beta[j]-=R[j][k]*beta[k];beta[j]/=R[j][j];}
    const coef=beta.map((v,j)=>v/scales[j]);coef[0]-=coef.reduce((s,v,j)=>s+v*centers[j],0);
    const predicted=X.map(r=>r.reduce((s,v,j)=>s+v*coef[j],0)),resid=y.map((v,i)=>v-predicted[i]);
    const sigma=Math.sqrt(resid.reduce((s,v)=>s+v*v,0)/(n-p));
    if(![...coef,sigma].every(Number.isFinite)) throw Error('Regression overflow; rescale the data.');
    return {coef,sigma,resid,n,p};
  }
  function fit(data) {
    validateData(data);
    const fitOne=(name,inputs)=>{try{return ols(data.map(r=>r[name]),data.map(r=>[1,...inputs.map(f=>f(r))]));}catch(e){throw Error(name+' equation: '+e.message);}};
    return {R:fitOne('R',[r=>r.U,r=>r.A,r=>r.W,r=>r.S]),T:fitOne('T',[r=>r.S,r=>r.A,r=>r.U,r=>r.R,r=>r.W]),L:fitOne('L',[r=>r.W/r.T]),D:fitOne('D',[r=>r.U,r=>r.R,r=>r.A,r=>r.T]),base:Object.fromEntries(['S','A','W','U'].map(k=>[k,mean(data.map(r=>r[k]))])),uSigma:sd(data.map(r=>r.U)),ranges:Object.fromEntries(['S','A','W','U'].map(k=>[k,[Math.min(...data.map(r=>r[k])),Math.max(...data.map(r=>r[k]))]]))};
  }
  const presets={baseline:{dS:0,dA:0,dW:0},auto_up:{dS:0,dA:.15,dW:0},fte_plus2:{dS:2,dA:0,dW:0},wip_minus2:{dS:0,dA:0,dW:-2}};
  function intervention(base,d) {
    if(![d.dS,d.dA,d.dW].every(Number.isFinite)||Math.abs(d.dS)>10||Math.abs(d.dA)>.5||Math.abs(d.dW)>10) throw Error('Use staffing/WIP changes in [−10,10] and automation in [−0.5,0.5].');
    const requested={S:base.S+d.dS,A:base.A+d.dA,W:base.W+d.dW};
    return {requested,actual:{S:Math.max(0,requested.S),A:clamp(requested.A,0,1),W:Math.max(1,requested.W)}};
  }
  const dot=(c,x)=>c.reduce((s,v,i)=>s+v*x[i],0);
  function forward(model,context,noise={R:0,T:0,L:0,D:0}) {
    const {S,A,W,U}=context;
    const rawR=dot(model.R.coef,[1,U,A,W,S])+noise.R,R=Math.max(0,rawR);
    const rawT=dot(model.T.coef,[1,S,A,U,R,W])+noise.T,T=Math.max(.05,rawT);
    const rawL=dot(model.L.coef,[1,W/T])+noise.L,L=Math.max(.1,rawL);
    const rawD=dot(model.D.coef,[1,U,R,A,T])+noise.D,D=Math.max(0,rawD);
    const result={...context,R,T,L,D,Uti:2*T-.03*L-1.5*D,clipped:{R:rawR<0,T:rawT<.05,L:rawL<.1,D:rawD<0}};
    if(![R,T,L,D,result.Uti].every(Number.isFinite)) throw Error('Simulation overflow; these fitted equations cannot be used at this setting.');
    return result;
  }
  function quantile(sorted,p) {const i=(sorted.length-1)*p,a=Math.floor(i);return sorted[a]+(sorted[Math.ceil(i)]-sorted[a])*(i-a);}
  function summarize(samples) {
    const stats={};
    for(const k of ['S','A','W','U','R','T','L','D','Uti']) {const v=samples.map(s=>s[k]).sort((a,b)=>a-b);stats[k]={mean:mean(v),sd:sd(v),min:v[0],q05:quantile(v,.05),q25:quantile(v,.25),median:quantile(v,.5),q75:quantile(v,.75),q95:quantile(v,.95),max:v[v.length-1]};}
    return {samples,stats,clipped:Object.fromEntries(['R','T','L','D'].map(k=>[k,samples.filter(s=>s.clipped[k]).length]))};
  }
  function simulate(model,d,N=1000,seed=42) {
    if(!Number.isInteger(N)||N<50||N>20000) throw Error('Use an integer sample count from 50 to 20,000.');
    if(!Number.isInteger(seed)||seed<0||seed>4294967295) throw Error('Use a whole-number seed from 0 to 4,294,967,295.');
    const change=intervention(model.base,d),random=rng(seed),samples=[];let uClips=0;
    for(let i=0;i<N;i++) {
      const rawU=model.base.U+model.uSigma*normal(random),U=Math.max(0,rawU);if(rawU<0)uClips++;
      const noise=Object.fromEntries(['R','T','L','D'].map(k=>[k,model[k].sigma*normal(random)]));
      samples.push(forward(model,{...change.actual,U},noise));
    }
    const result=summarize(samples);result.clipped.U=uClips;
    return {...result,...change,extrapolated:['S','A','W'].filter(k=>change.actual[k]<model.ranges[k][0]||change.actual[k]>model.ranges[k][1])};
  }
  function selfTests() {
    const fitLine=ols([2,5,8,11],[[1,0],[1,1],[1,2],[1,3]]),g=example('collider'),m=fit(synthetic()),a=simulate(m,presets.baseline,50,42),b=simulate(m,presets.baseline,50,42);
    return [{name:'Exact line recovers intercept 2 and slope 3',pass:Math.abs(fitLine.coef[0]-2)<1e-10&&Math.abs(fitLine.coef[1]-3)<1e-10},{name:'Collider blocks; conditioning on its descendant opens',pass:dSeparated(g,g.x,g.y)&&!dSeparated(g,g.x,g.y,['Escalation Review'])},{name:'CSV round trip retains all 52 sample weeks',pass:JSON.stringify(parseCSV(csv(synthetic())))===JSON.stringify(synthetic())},{name:'Same seed and policy give identical simulation draws',pass:JSON.stringify(a.samples)===JSON.stringify(b.samples)}];
  }
  return {graph,descendants:reachable,dSeparated,backdoor,adjustmentSets,paths,example,examples,rng,synthetic,columns,validateData,parseCSV,csv,ols,fit,presets,intervention,forward,simulate,summarize,selfTests};
});
