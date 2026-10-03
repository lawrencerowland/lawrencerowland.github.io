const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const base = path.join(__dirname, '..');
const polytope = fs.readFileSync(path.join(base, 'wider-interest/polytope.html'), 'utf8');
const conkers = fs.readFileSync(path.join(base, 'wider-interest/conker-season.js'), 'utf8');
const moduleSource = polytope.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
function functionSource(name) {
  const start = moduleSource.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `Missing ${name}`);
  let i = moduleSource.indexOf('{', start), depth = 1;
  for (i++; depth; i++) {
    if (moduleSource[i] === '{') depth++;
    else if (moduleSource[i] === '}') depth--;
  }
  return moduleSource.slice(start, i);
}
const math = vm.runInNewContext(`(() => {
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 ${['dot4','sub4','scale4','add4','norm4','normalize4','makeOrthonormalBasisForSumZero','uniquePoints4','sliceIntersectionPoints4','sliceName'].map(functionSource).join('\n')}
 return {sliceIntersectionPoints4,sliceName,makeOrthonormalBasisForSumZero};
})()`);
const pointsAt = t => JSON.parse(JSON.stringify(math.sliceIntersectionPoints4(t)));
function sliceEdges(points) {
  const edges=[];
  for(let i=0;i<points.length;i++) for(let j=i+1;j<points.length;j++) {
    // Two cube facets meeting the hyperplane support each slice edge.
    if(points[i].filter((v,k)=>(v===0||v===1)&&v===points[j][k]).length===2) edges.push([i,j]);
  }
  return edges;
}
test('both complete app scripts parse', () => {
  for (const [source, type] of [[moduleSource,'module'],[conkers,'commonjs']]) {
    const parsed=spawnSync(process.execPath,[`--input-type=${type}`,'--check'],{input:source,encoding:'utf8'});
    assert.equal(parsed.status,0,parsed.stderr);
  }
});
test('diagonal slices preserve the defining hyperplane and change topology at the expected layers', () => {
  for (const [t,v,e,f] of [[0,1,0,0],[0.5,4,6,4],[1,4,6,4],[1.25,12,18,8],[1.5,12,18,8],[2,6,12,8],[2.5,12,18,8],[3,4,6,4],[3.5,4,6,4],[4,1,0,0]]) {
    const points=pointsAt(t);
    assert.equal(points.length,v,`vertices at ${t}`);
    points.forEach(p=>{assert.ok(Math.abs(p.reduce((a,b)=>a+b,0)-t)<1e-9);assert.ok(p.every(c=>c>=0&&c<=1));});
    assert.equal(sliceEdges(points).length,e,`edges at ${t}`);
    if(v>1) assert.equal(v-e+f,2,`Euler relation at ${t}`);
  }
});
test('uniform truncated tetrahedra occur at t=1.5 and t=2.5 with the unchanged Euclidean metric', () => {
  function lengths(t) {const p=pointsAt(t);return sliceEdges(p).map(([a,b])=>Math.sqrt(p[a].reduce((sum,v,k)=>sum+(v-p[b][k])**2,0)));}
  for(const t of [1.5,2.5]) {
    const edges=lengths(t);
    assert.ok(edges.every(l=>Math.abs(l-Math.SQRT1_2)<1e-9));
    assert.equal(math.sliceName(t),'uniform truncated tetrahedron');
  }
  const other=lengths(1.25);
  assert.ok(Math.max(...other)-Math.min(...other)>0.5);
  assert.match(math.sliceName(1.25),/varying edge lengths/);
  assert.match(math.sliceName(0.0005),/tetrahedron/,'near-endpoint slices must not be labelled points');
});
test('the displayed slice basis preserves lengths and angles', () => {
  const basis=math.makeOrthonormalBasisForSumZero();
  for(let i=0;i<3;i++) {
    assert.ok(Math.abs(basis[i].reduce((a,b)=>a+b,0))<1e-9);
    for(let j=0;j<3;j++) assert.ok(Math.abs(basis[i].reduce((sum,v,k)=>sum+v*basis[j][k],0)-(i===j?1:0))<1e-9);
  }
});
function nodeHarness() {
  const document={activeElement:null};
  const nodes=new Map();
  function $(id) {
    if(!nodes.has(id)) nodes.set(id,{
      value:'',hidden:false,disabled:false,textContent:'',innerHTML:'',max:0,offsetLeft:id.includes('their')?190:60,
      dataset:{},listeners:{},attributes:{},style:{setProperty(){}},classList:{toggle(){},remove(){},add(){}},
      addEventListener(type,listener){this.listeners[type]=listener;},
      setAttribute(name,value){this.attributes[name]=value;},
      focus(){document.activeElement=this;},
      click(){assert.equal(this.disabled,false);assert.equal(this.hidden,false);this.focus();this.listeners.click();}
    });
    return nodes.get(id);
  }
  return {$,document,nodes};
}
test('moving a slice pauses explicitly and Play resumes from that slice', () => {
  const h=nodeHarness();
  const context={...h};
  vm.createContext(context);
  const start=moduleSource.indexOf('// --- UI events');
  const end=moduleSource.indexOf('    new ResizeObserver',start);
  vm.runInContext(`
    const btnProjection=$('projection'),btnSlice=$('slice'),btnPlayPause=$('play'),btnCycleCells=$('cycle'),btnNextCell=$('next'),paramSlider=$('slider');
    const sliceStops={querySelectorAll:()=>[]},reducedMotion={addEventListener(){}};
    let mode='slice',playing=true,tSlice=2,speed4D=.9,cellCycling=false,cellIndex=0,cellClock=0;
    const cellSpecs=Array.from({length:8});
    const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
    function setMode(next){mode=next;} function rebuildSliceMesh(){} function updateHud(){}
    ${moduleSource.slice(start,end)}
    globalThis.snapshot=()=>({playing,tSlice,cellIndex,cellCycling});
  `,context);
  h.$('slider').value='150';h.$('slider').listeners.input();
  assert.equal(context.snapshot().tSlice,1.5);
  assert.equal(context.snapshot().playing,false);
  assert.equal(h.$('play').textContent,'Play');
  h.$('play').click();
  assert.equal(context.snapshot().playing,true);
  assert.equal(context.snapshot().tSlice,1.5);
  h.$('play').click();h.$('next').click();h.$('next').click();
  assert.equal(context.snapshot().cellIndex,1);
  assert.equal(context.snapshot().playing,false);
});
function conkerGame(rule='simple',first=0) {
  const h=nodeHarness();
  const options=Array.from({length:3},(_,i)=>({value:String(i),disabled:false}));
  const context={...h,$$:()=>options};vm.createContext(context);
  const start=conkers.indexOf('// A finite, reproducible toy model.');
  const end=conkers.indexOf('const surreyHtml=',start);
  const rank=conkers.match(/const rank =[^\n]+/)[0];
  vm.runInContext(`${rank}\n${conkers.slice(start,end)}\nresetGame();globalThis.snapshot=()=>JSON.parse(JSON.stringify(game));`,context);
  h.$('#game-rule').value=rule;h.$('#game-nut').value=String(first);h.$('#game-main').click();
  return {...h,snapshot:context.snapshot};
}
test('a conker keeps damage across wins; checking a knot cannot repair it or add points', () => {
  const h=conkerGame();let steps=0;
  while(h.snapshot().phase!=='between' && steps++<30)h.$('#game-main').click();
  const before=h.snapshot().current;
  assert.equal(before.wins,1);assert.equal(before.score,1);assert.ok(before.hp<before.max);
  h.$('#game-maintain').click();
  assert.deepEqual(h.snapshot().current,before);
  assert.equal(h.document.activeElement,h.$('#game-main'),'disabled maintenance action restores usable focus');
  h.$('#game-main').click();
  assert.equal(h.snapshot().current.hp,before.hp);
});
test('the two score agreements differ only by inherited opponent points', () => {
  const simple=conkerGame('simple'), inherited=conkerGame('inherit');
  for(let step=0;step<100&&simple.snapshot().rival<2;step++) {
    simple.$('#game-main').click();inherited.$('#game-main').click();
  }
  const a=simple.snapshot(),b=inherited.snapshot();
  assert.equal(a.rival,2);assert.equal(a.current.wins,2);
  assert.equal(a.current.score,2);assert.equal(b.current.score,3);
  assert.equal(a.current.hp,b.current.hp);
  simple.$('#game-main').click();
  assert.equal(simple.snapshot().phase,'slipped');
  const old=simple.snapshot().current;
  simple.$('#game-main').click();
  assert.deepEqual(simple.snapshot().current,old,'re-threading preserves identity, rank and damage');
});
test('finite seasons terminate for every first nut and preserve final bout outcome and keyboard focus', () => {
  for(const rule of ['simple','inherit'])for(const first of [0,1,2])for(const hard of [false,true]) {
    const h=conkerGame(rule,first);let steps=0;
    while(h.snapshot().phase!=='ended'&&steps++<150) {
      const phase=h.snapshot().phase;
      const button=hard&&phase==='strike'?'#game-hard':'#game-main';
      h.$(button).click();
      if(button==='#game-hard'&&h.snapshot().phase!=='ended')assert.equal(h.document.activeElement,h.$('#game-main'));
    }
    const end=h.snapshot();
    assert.equal(end.phase,'ended');assert.ok(end.rival<=5);assert.ok(end.used.length<=3);
    assert.match(h.$('#game-log').textContent,/Their conker breaks|Your conker breaks|Both nuts break/);
    assert.equal(h.document.activeElement,h.$('#game-reset'));
    h.$('#game-reset').click();assert.equal(h.snapshot().phase,'ready');assert.equal(h.snapshot().totalWins,0);
  }
});
