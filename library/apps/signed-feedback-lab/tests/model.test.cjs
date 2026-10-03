'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),M=require('../model.js');
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<=tol,`${a} should be ${b}`);
function rootsMatch(matrix,expected,tol=1e-8){const roots=M.eigenvalues3(matrix);for(const [re,im]of expected){const i=roots.findIndex(z=>Math.hypot(z.re-re,z.im-im)<tol);assert.ok(i>=0,`Missing ${re}+${im}i in ${JSON.stringify(roots)}`);roots.splice(i,1);}}
test('original four links yield hand-calculated simultaneous updates and contributions',()=>{
  const config=M.preset('original');assert.deepEqual(M.matrix(config),[[0,-.25,.2],[.35,0,0],[0,.3,0]]);
  const run=M.start(config),first=M.step(run),second=M.step(first);
  [-.05,.35,.06].forEach((v,i)=>near(first.state[i],v));[-.0755,-.0175,.105].forEach((v,i)=>near(second.state[i],v));
  assert.deepEqual(run.state,[1,.2,0]);assert.equal(second.tick,2);assert.equal(second.history.length,3);
  const flows=M.contributions(config,run.state);[.35,-.05,0,.06].forEach((v,i)=>near(flows[i].value,v));
});
test('eigenvalue oracles: diagonal, rotation, cube roots, repeated roots and nilpotence',()=>{
  rootsMatch([[-3,0,0],[0,2,0],[0,0,.5]],[[-3,0],[2,0],[.5,0]]);
  rootsMatch([[0,-2,0],[.5,0,0],[0,0,.2]],[[0,1],[0,-1],[.2,0]]);
  rootsMatch([[0,0,8],[1,0,0],[0,1,0]],[[2,0],[-1,Math.sqrt(3)],[-1,-Math.sqrt(3)]]);
  rootsMatch([[1,1,0],[0,1,0],[0,0,.2]],[[1,0],[1,0],[.2,0]],1e-7);
  rootsMatch([[0,1e6,0],[0,0,1e6],[0,0,0]],[[0,0],[0,0],[0,0]]);
  rootsMatch([[0,0,0],[0,0,0],[0,0,0]],[[0,0],[0,0],[0,0]]);
  rootsMatch([[.1,-.2,0],[.2,.1,0],[0,0,-.4]],[[.1,.2],[.1,-.2],[-.4,0]]);
});
test('classification handles stable, growing and unit-circle cases without declaring boundary stable',()=>{
  for(const [gain,expected]of [[.9999999,'decay'],[1,'boundary'],[1.0000001,'unstable']]){
    const w=[[0,-gain,0],[gain,0,0],[0,0,0]];near(M.stability(w).rho,gain);assert.equal(M.stability(w).classification,expected);
  }
  assert.equal(M.stability([[1,1,0],[0,1,0],[0,0,0]]).classification,'boundary');
  const w=[[.5,10,0],[0,.5,0],[0,0,.2]];assert.equal(M.stability(w).classification,'decay');assert.ok(M.multiply(w,[0,1,0])[0]>1);
  assert.equal(M.stability(M.matrix(M.preset('growing'))).classification,'unstable');
  let config=M.preset('growing');config.nodes.forEach(n=>n.initial=0);assert.deepEqual(M.step(M.start(config)).state,[0,0,0]);
});
test('cycle products are preserved and are distinct from spectral radius',()=>{
  const loops=M.loops(M.preset());near(loops[0].value,-.0875);near(loops[1].value,.021);assert.deepEqual(loops.map(l=>l.length),[2,3]);
  assert.ok(M.stability(M.matrix(M.preset())).rho>Math.max(...loops.map(l=>Math.abs(l.value))));
});
test('JSON round trip validates the complete fixed topology and does not accept numeric strings',()=>{
  const config=M.preset('original');assert.deepEqual(M.decode(M.encode(config)),config);
  for(const mutate of [c=>c.edges[0].gain=Infinity,c=>c.edges[0].gain='0.4',c=>c.edges[0].from='Ov',c=>c.edges[1].id='e1',c=>c.nodes[1].id='Reg',c=>c.nodes[0].initial=null,c=>c.nodes[0].label='',c=>c.version=2]){const c=M.clone(config);mutate(c);assert.throws(()=>M.validateConfig(c));}
  assert.throws(()=>M.decode('not JSON'));assert.throws(()=>M.decode(' '.repeat(100001)));
});
test('Graphviz reports each gain exactly once and CSV preserves complete run precision',()=>{
  const c=M.preset(),run=M.step(M.start(c));c.edges[0].activity='A "quoted" activity';const dot=M.dot(c,run.state);
  assert.match(dot,/AV_e1 \[shape=box/);assert.match(dot,/Reg -> AV_e1 .*× 0.35/);assert.match(dot,/AV_e1 -> Op .*× 1/);assert.match(dot,/A \\"quoted\\" activity/);
  const csv=M.csv(run);assert.equal(csv.trim().split('\n').length,3);assert.match(csv,/-0.05,0.35,0.06/);
});
test('run limits retain the last valid state rather than silently clipping it',()=>{
  const c=M.preset();c.edges.forEach((e,i)=>e.gain=i<2?1e6:0);c.nodes.forEach((n,i)=>n.initial=i===0?1:0);const run=M.start(c);const one=M.step(run),two=M.step(one);assert.throws(()=>M.step(two),/10¹²/);assert.equal(two.tick,2);
  assert.throws(()=>M.step({...run,tick:500}),/500 ticks/);
});
