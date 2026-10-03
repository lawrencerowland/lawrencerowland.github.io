const {test}=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const M=require('../model.js');
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} ≠ ${b}`);
const g=(ids,edges,hidden=[])=>M.graph(ids.map(id=>({id,observed:!hidden.includes(id)})),edges);
// Independent oracle: enumerate skeleton paths and apply local collider rules.
// It deliberately does not call dSeparated, paths, descendants or backdoor.
function oracle(g,x,y,Z) {
  const arrows=new Set(g.edges.map(([a,b])=>`${a}:${b}`));
  const desc={};for(const {id} of g.nodes) {desc[id]=new Set();const stack=[id];while(stack.length){const v=stack.pop();for(const [a,b]of g.edges)if(a===v&&!desc[id].has(b)){desc[id].add(b);stack.push(b);}}}
  let open=false;
  function walk(p) {const v=p.at(-1);if(v===y){const blocked=p.slice(1,-1).some((n,i)=>{
    const collider=arrows.has(`${p[i]}:${n}`)&&arrows.has(`${p[i+2]}:${n}`);
    return collider?!Z.includes(n)&&![...desc[n]].some(d=>Z.includes(d)):Z.includes(n);
  });if(!blocked)open=true;return;}
  for(const [a,b] of g.edges){const n=a===v?b:b===v?a:null;if(n!==null&&!p.includes(n))walk([...p,n]);}}
  walk([x]);return !open;
}
test('source synthetic data preserved exactly at all 52 weeks',()=>{
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(M.synthetic())).digest('hex'),'f2d6de852bab7fe4ca54a84c201b862321075bb728c7994ffa134aab8d62ab7e');
  assert.deepEqual(M.example().nodes.map(n=>n.id),['Scope Creep','Interface Misalignment','Vendor Capacity','Design Risk','Cost Overrun','Delay']);
  assert.equal(M.example().edges.length,5);
});
test('acyclic guard, unique names, endpoints and finite teaching bound',()=>{
  assert.throws(()=>g(['a','b'],[['a','b'],['b','a']]),/cycle/);
  assert.throws(()=>g(['a','a'],[]),/unique/);assert.throws(()=>g(['a','b'],[['a','b'],['a','b']]),/repeat/);
  assert.throws(()=>g(['a'],[['a','z']]),/existing/);assert.throws(()=>g(Array.from({length:13},(_,i)=>String(i)),[]),/12/);
  assert.throws(()=>M.dSeparated(g(['a'],[]),'a','a'),/different/);
});
test('exhaustive four-node DAG d-separation agrees with independent path oracle',()=>{
  const ids=['0','1','2','3'],possible=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)possible.push([ids[i],ids[j]]);
  let checked=0;
  for(let mask=0;mask<64;mask++) {const graph=g(ids,possible.filter((_,i)=>mask&(1<<i)));
    for(const x of ids)for(const y of ids)if(x!==y){const interior=ids.filter(n=>n!==x&&n!==y);for(let z=0;z<4;z++){const Z=interior.filter((_,i)=>z&(1<<i));assert.equal(M.dSeparated(graph,x,y,Z),oracle(graph,x,y,Z));checked++;}}
  }assert.equal(checked,3072);
});
test('random six-node graphs agree for adjustment validity and all minimal sets',()=>{
  const random=M.rng(761),ids=['0','1','2','3','4','5'];
  for(let i=0;i<200;i++) {const edges=[];for(let a=0;a<6;a++)for(let b=a+1;b<6;b++)if(random()<.4)edges.push([ids[a],ids[b]]);
    const graph=g(ids,edges),x=String(Math.floor(random()*6));let y=String(Math.floor(random()*6));if(y===x)y=String((Number(y)+1)%6);
    const candidates=ids.filter(n=>n!==x&&n!==y),valid=[];
    for(let mask=0;mask<16;mask++){const Z=candidates.filter((_,j)=>mask&(1<<j));const desc=M.descendants(graph,x);const expected=!Z.some(n=>desc.has(n))&&oracle({...graph,edges:edges.filter(([a])=>a!==x)},x,y,Z);assert.equal(M.backdoor(graph,x,y,Z).valid,expected);if(expected)valid.push(Z);}
    const minimal=valid.filter(z=>!valid.some(v=>v.length<z.length&&v.every(n=>z.includes(n)))).map(z=>z.join(',')).sort();assert.deepEqual(M.adjustmentSets(graph,x,y).map(z=>z.join(',')).sort(),minimal);
  }
});
test('collider descendant opens association; mediator adjustment is rejected for total effect',()=>{
  const graph=g(['X','C','Y','D'],[['X','C'],['Y','C'],['C','D']]);
  assert.equal(M.dSeparated(graph,'X','Y'),true);assert.equal(M.dSeparated(graph,'X','Y',['C']),false);assert.equal(M.dSeparated(graph,'X','Y',['D']),false);
  const mediation=g(['X','M','Y'],[['X','M'],['M','Y']]);assert.deepEqual(M.adjustmentSets(mediation,'X','Y'),[[]]);assert.equal(M.backdoor(mediation,'X','Y',['M']).valid,false);
  assert.equal(M.paths(mediation,'X','Y').items[0].kind,'directed');assert.deepEqual(M.paths(mediation,'X','Y').items[0].nodes,['X','M','Y']);
});
test('observed confounding, hidden confounding, and alternatives to a redundant common ancestor set',()=>{
  const graph=g(['X','A','B','Y'],[['A','X'],['A','B'],['B','Y'],['X','Y']]);
  assert.deepEqual(M.adjustmentSets(graph,'X','Y'),[['A'],['B']]);
  const latent=g(['X','U','Y'],[['U','X'],['U','Y'],['X','Y']],['U']);assert.deepEqual(M.adjustmentSets(latent,'X','Y'),[]);assert.equal(M.backdoor(latent,'X','Y',['U']).valid,false);
  assert.deepEqual(M.adjustmentSets(g(['X','Y'],[]),'X','Y'),[[]]);
});
test('a node collider on one route can be needed in a valid multi-node set',()=>{
  const graph=g(['X','Y','Z1','Z2','Z3','W1','W2'],[['Z1','W1'],['W1','X'],['Z1','Z3'],['Z2','Z3'],['Z2','W2'],['W2','Y'],['Z3','Y']]);
  assert.equal(M.backdoor(graph,'X','Y',['Z3']).valid,false);
  assert.equal(M.backdoor(graph,'X','Y',['Z2','Z3']).valid,true);
  assert.ok(M.adjustmentSets(graph,'X','Y').some(s=>s.length===2&&s.includes('Z2')&&s.includes('Z3')));
});
test('display path limit does not affect exact graph criterion',()=>{
  const ids=Array.from({length:9},(_,i)=>String(i)),edges=[];for(let a=0;a<9;a++)for(let b=a+1;b<9;b++)edges.push([String(a),String(b)]);
  const graph=g(ids,edges);assert.equal(M.paths(graph,'0','8',[],5).items.length,5);assert.equal(M.paths(graph,'0','8',[],5).truncated,true);assert.deepEqual(M.adjustmentSets(graph,'0','8'),[[]]);
});
test('CSV handles BOM, quoted numbers, CRLF, reordered headers and trailing lines',()=>{
  const data=M.synthetic(),csv=M.csv(data);assert.deepEqual(M.parseCSV('\uFEFF'+csv.replaceAll('\n','\r\n')),data);
  const reverse=[...M.columns].reverse();assert.deepEqual(M.parseCSV(reverse.map(k=>'"'+k+'"').join(',')+'\n'+data.map(r=>reverse.map(k=>'"'+r[k]+'"').join(',')).join('\n')),data);
});
test('CSV rejects silent zero conversion, missing/extra cells, non-finite, invalid domains and duplicate weeks',()=>{
  const csv=M.csv(M.synthetic());
  for(const malformed of [csv.replace('1,10','1,'),csv.replace('1,10','1,NaN'),csv.replace('1,10','1,Infinity'),csv.replace('1,10','1,10,99'),csv.replace('1,10','1,-1'),csv.replace('2,10','1,10'),csv.replace('week,S','week,week'),csv.replace('week,S','week,"S')])assert.throws(()=>M.parseCSV(malformed));
  assert.throws(()=>M.parseCSV('week,S,A,W,U,R,T,L,D\n1,1,0,1,1,1,1,1,1'),/8–/);
});
test('QR recovers orthogonal analytic regression, scaled data and rank failure',()=>{
  const X=[],y=[];for(const x of [-2,-1,1,2])for(const z of [-1,1]) {X.push([1,x,z]);y.push(4+3*x-2*z);}
  const fit=M.ols(y,X);fit.coef.forEach((v,i)=>close(v,[4,3,-2][i]));close(fit.sigma,0);
  const scaled=M.ols(y,X.map(([one,x,z])=>[one,1e6+1e3*x,z/1e3]));close(scaled.coef[1],.003);close(scaled.coef[2],-2000,1e-8);
  assert.throws(()=>M.ols(y,X.map(([one,x])=>[one,x,2*x])),/rank deficient/);assert.throws(()=>M.ols(y,X.map(()=>[1,1])),/constant/);assert.throws(()=>M.fit(M.synthetic(8)),/equation:.*rank deficient/);
});
function knownModel(noise=0) {return {base:{S:10,A:.3,W:8,U:1},uSigma:0,ranges:{S:[0,100],A:[0,1],W:[1,100]},R:{coef:[1,2,-1,0,0],sigma:0},T:{coef:[1,2,3,-1,-2,0],sigma:0},L:{coef:[2,5],sigma:noise},D:{coef:[100,0,0,0,0],sigma:noise}};}
test('forward intervention agrees with a hand-computed cascade, utility and bounds',()=>{
  const model=knownModel(),r=M.simulate(model,{dS:2,dA:.1,dW:-2},50,7);close(r.stats.R.mean,2.6);close(r.stats.T.mean,20);close(r.stats.L.mean,3.5);close(r.stats.D.mean,100);close(r.stats.Uti.mean,-110.105);
  assert.deepEqual(M.intervention({S:2,A:.9,W:2},{dS:-10,dA:.5,dW:-10}).actual,{S:0,A:1,W:1});
  assert.throws(()=>M.simulate(model,M.presets.baseline,0),/sample/);assert.throws(()=>M.simulate(model,M.presets.baseline,50.5),/sample/);assert.throws(()=>M.simulate(model,M.presets.baseline,50,-1),/seed/);assert.throws(()=>M.intervention(model.base,{dS:11,dA:0,dW:0}),/changes/);
});
test('paired draws are repeatable and zero policy difference is exactly zero',()=>{
  const model=M.fit(M.synthetic()),a=M.simulate(model,M.presets.baseline,200,56),b=M.simulate(model,{dS:0,dA:0,dW:0},200,56);assert.deepEqual(a,b);
  const changed=M.simulate(model,M.presets.auto_up,200,56);assert.deepEqual(a.samples.map(s=>s.U),changed.samples.map(s=>s.U));assert.ok(changed.extrapolated.includes('A'));
});
test('full residual SD is used for both L and D, with no hidden scaling',()=>{
  const model=knownModel(1);model.L.coef=[100,0];const r=M.simulate(model,M.presets.baseline,20000,19);close(r.stats.L.sd,1,.03);close(r.stats.D.sd,1,.03);assert.equal(r.clipped.L,0);assert.equal(r.clipped.D,0);
});
test('sample U spread drives shocks and numerical floors are counted',()=>{
  const model=knownModel();model.uSigma=0;model.T.coef=[-100,0,0,0,0,0];model.L.coef=[-10,0];model.D.coef=[-10,0,0,0,0];const r=M.simulate(model,M.presets.baseline,50,1);assert.equal(r.stats.U.sd,0);assert.equal(r.clipped.T,50);assert.equal(r.clipped.L,50);assert.equal(r.clipped.D,50);close(r.stats.T.mean,.05);close(r.stats.L.mean,.1);
});
test('all in-app smoke checks pass',()=>assert.ok(M.selfTests().every(t=>t.pass)));
