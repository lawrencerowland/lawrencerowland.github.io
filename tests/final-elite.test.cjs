const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = path.join(__dirname, '../wider-interest/hs2-elite');
const M = require(path.join(base, 'model.js'));
const near = (a, b, epsilon = 1e-8) => assert.ok(Math.abs(a - b) < epsilon, `${a} differs from ${b}`);
const flight = () => {
  const s = M.createState(17);
  s.docked = false; s.location = null;
  s.ship.x = -5000; s.ship.y = 3000;
  return s;
};

test('retains every original outpost, coordinate, type and commodity', () => {
  assert.deepEqual(M.OUTPOSTS.map(s => [s.name, s.x, s.y, s.z, s.type]), [
    ['Euston',0,0,0,'Terminus'],['Old Oak Common',300,50,-200,'Interchange'],
    ['West Ruislip',600,-30,300,'Tunnel portal'],['Chiltern Tunnel',900,100,-100,'TBM site'],
    ['Birmingham Int.',1200,-80,250,'Station'],['Curzon Street',1500,20,0,'Terminus']
  ]);
  assert.deepEqual(M.GOODS.map(g => [g.name, g.basePrice, g.variance]), [
    ['Consultants',500,.3],['Concrete',100,.2],['Steel rails',300,.25],['TBM parts',800,.4],['Signalling tech',600,.35],['Env. reports',200,.5]
  ]);
  const s = M.createState();
  assert.equal(s.credits,10000); assert.equal(s.capacity,20); assert.equal(s.fuel,100);
  assert.equal(s.docked,true); assert.equal(s.location,'euston');
});

test('opening, buying, selling and returning cannot reroll prices or make local arbitrage', () => {
  const s = M.createState(893), initial = JSON.stringify(s.prices);
  for (let repeat = 0; repeat < 30; repeat++) {
    M.openMarket(s);
    for (const good of M.GOODS) {
      assert.equal(M.trade(s,good.id,'buy').ok,true);
      assert.equal(M.trade(s,good.id,'sell').ok,true);
    }
    M.closeMarket(s);
    assert.equal(s.credits,10000); assert.equal(M.cargoCount(s),0);
    assert.equal(JSON.stringify(s.prices),initial);
  }
  M.undock(s);
  s.ship.x=0;s.ship.y=0;s.ship.z=-35;s.ship.vx=s.ship.vy=s.ship.vz=0;s.undockLock=null;
  M.step(s,{},M.STEP); assert.equal(s.docked,true); M.openMarket(s);
  assert.equal(JSON.stringify(s.prices),initial);
  assert.deepEqual(M.createState(893).prices,s.prices);
  assert.notDeepEqual(M.createState(894).prices,s.prices);
});

test('travel allows a real price difference and all six goods can be traded', () => {
  for (const good of M.GOODS) {
    const s = M.createState(41);
    const ranked = [...M.OUTPOSTS].sort((a,b)=>s.prices[a.id][good.id]-s.prices[b.id][good.id]);
    const low=ranked[0],high=ranked.at(-1);
    assert.ok(s.prices[low.id][good.id]<s.prices[high.id][good.id]);
    s.location=low.id;M.openMarket(s);
    const bought=M.trade(s,good.id,'buy');
    M.closeMarket(s);s.location=high.id;M.openMarket(s);
    const sold=M.trade(s,good.id,'sell');
    assert.equal(s.credits,10000+sold.price-bought.price);assert.equal(M.cargoCount(s),0);
  }
});

test('trading guards capacity, money, stock, location and unrecognised actions without mutation', () => {
  const s=M.createState(9);M.openMarket(s);
  for(let i=0;i<20;i++)assert.equal(M.trade(s,'concrete','buy').ok,true);
  assert.equal(M.cargoCount(s),20);
  const full=JSON.stringify(s);assert.equal(M.trade(s,'concrete','buy').ok,false);assert.equal(JSON.stringify(s),full);
  assert.equal(M.trade(s,'concrete','sell').ok,true);assert.equal(M.cargoCount(s),19);
  s.credits=0;
  for(const [id,side] of [['concrete','buy'],['tbm','sell'],['invalid','buy'],['concrete','delete']]) {
    const before=JSON.stringify(s);assert.equal(M.trade(s,id,side).ok,false);assert.equal(JSON.stringify(s),before);
  }
  M.closeMarket(s);assert.equal(M.trade(s,'concrete','sell').ok,false);
  M.undock(s);assert.equal(M.openMarket(s),false);assert.equal(M.trade(s,'concrete','sell').ok,false);
});

test('projection and click rays agree for arbitrary yaw, pitch and roll', () => {
  for(const [yaw,pitch,roll] of [[0,0,0],[1.2,.4,-.8],[-2.8,-.6,2.1],[3.13,1.2,-2.9]]) {
    const ship={yaw,pitch,roll};const b=M.basis(ship);
    for(const vector of Object.values(b))near(Math.hypot(vector.x,vector.y,vector.z),1);
    const forward=M.worldToCamera(b.forward,ship);near(forward.x,0);near(forward.y,0);near(forward.z,1);
    for(const [x,y] of [[450,250],[130,100],[800,400]]) {
      const ray=M.screenRay(x,y,900,500,500,ship);
      const projected=M.project(M.worldToCamera(ray,ship),900,500,500);
      near(projected.x,x);near(projected.y,y);
    }
    const source={x:42,y:-90,z:133};const result=M.cameraToWorld(M.worldToCamera(source,ship),ship);
    for(const axis of ['x','y','z'])near(result[axis],source[axis]);
  }
});

test('auto aim takes the short yaw path across minus pi and manual rotation respects roll', () => {
  const s=flight();s.ship.yaw=-Math.PI+.02;
  assert.equal(M.aim(s,{x:Math.sin(Math.PI-.02),y:0,z:Math.cos(Math.PI-.02)}),true);
  M.step(s,{},M.STEP);
  near(M.wrap(s.ship.yaw-(-Math.PI+.02)),-2.4*M.STEP);
  for(let i=0;i<5;i++)M.step(s,{},M.STEP);
  near(M.wrap(s.ship.yaw-(Math.PI-.02)),0);assert.equal(s.target,null);
  s.ship.yaw=0;s.ship.pitch=0;s.ship.roll=Math.PI/2;
  M.step(s,{up:true},M.STEP);
  assert.ok(s.ship.yaw>0,'pitch up while rolled right turns towards world right');
  near(s.ship.pitch,0);
});

test('movement, fuel, time and rotation are independent of 30, 60 or 144 Hz rendering', () => {
  const results=[];
  for(const hz of [30,60,144]) {
    const s=flight(),runner=M.createRunner(s);
    for(let i=0;i<hz*2;i++)runner.advance(1/hz,{right:true,rollLeft:true});
    for(let i=0;i<hz*4;i++)runner.advance(1/hz,{forward:true});
    for(let i=0;i<hz*2;i++)runner.advance(1/hz,{brake:true});
    results.push(s);
  }
  for(const s of results.slice(1)) {
    for(const key of Object.keys(s.ship))near(s.ship[key],results[0].ship[key]);
    near(s.fuel,results[0].fuel);near(s.time,8);near(s.time,results[0].time);
  }
});

test('fine, normal, boost and reverse preserve their different power and fuel costs', () => {
  const results={};
  for(const mode of ['fine','normal','boost']) {
    const s=flight();s.mode=mode;const r=M.createRunner(s);
    for(let i=0;i<120;i++)r.advance(1/120,{forward:true,right:true});
    assert.equal(s.ship.yaw,0,'thrust blocks rotation immediately');
    near(100-s.fuel,M.MODES[mode].fuel);results[mode]=M.speed(s);
  }
  assert.ok(results.fine<results.normal&&results.normal<results.boost);
  const s=flight();M.step(s,{reverse:true},M.STEP);assert.ok(s.ship.vz<0);
  const fine=flight();M.step(fine,{forward:true,fine:true},M.STEP);assert.equal(fine.thrust,15);
  const boost=flight();M.step(boost,{forward:true,boost:true},M.STEP);assert.equal(boost.thrust,150);
});

test('pause, markets and docked state freeze simulation; a long suspended frame is bounded', () => {
  for(const kind of ['pause','market','dock']) {
    const s=kind==='pause'?flight():M.createState();
    if(kind==='pause')M.setPaused(s,true);if(kind==='market')M.openMarket(s);
    const before=JSON.stringify(s);const r=M.createRunner(s);r.advance(60,{forward:true});M.step(s,{forward:true},.05);
    assert.equal(JSON.stringify(s),before);
  }
  const s=flight(),r=M.createRunner(s);r.advance(3600,{forward:true});near(s.time,.1);
  M.setPaused(s,true);r.advance(120,{forward:true});M.setPaused(s,false);r.advance(1/120,{});near(s.time,.1+1/120);
});

test('a controlled arrival docks, stops, refuels, opens a market and releases cleanly', () => {
  for(const station of M.OUTPOSTS) {
    const s=flight();Object.assign(s.ship,{x:station.x,y:station.y,z:station.z-40,vx:0,vy:0,vz:4});s.fuel=23;
    M.step(s,{},M.STEP);
    assert.equal(s.docked,true);assert.equal(s.location,station.id);assert.equal(s.fuel,100);assert.equal(M.speed(s),0);
    assert.ok(s.visited.includes(station.id));assert.equal(M.openMarket(s),true);
    assert.equal(M.undock(s),true);assert.equal(s.marketOpen,false);assert.equal(s.docked,false);assert.equal(s.location,null);
    assert.equal(s.undockLock,station.id);near(M.speed(s),9);
    M.step(s,{},M.STEP);assert.equal(s.docked,false);
  }
});

test('fast approaches and distant ships do not dock; braking and depleted fuel behave sensibly', () => {
  const fast=flight();Object.assign(fast.ship,{x:0,y:0,z:-40,vz:20});M.step(fast,{},M.STEP);assert.equal(fast.docked,false);
  const far=flight();Object.assign(far.ship,{x:0,y:0,z:-60,vz:0});M.step(far,{},M.STEP);assert.equal(far.docked,false);
  const normal=flight(),braked=flight();normal.ship.vz=braked.ship.vz=40;
  M.step(normal,{},.1);M.step(braked,{brake:true},.1);assert.ok(M.speed(braked)<M.speed(normal));
  const empty=flight();empty.fuel=0;M.step(empty,{forward:true,boost:true},.1);assert.equal(M.speed(empty),0);assert.equal(empty.thrust,0);
  empty.fuel=.001;M.step(empty,{forward:true,boost:true},.1);assert.equal(empty.fuel,0);assert.ok(M.speed(empty)>0);assert.equal(empty.thrust,0);
});

test('tow recovers an empty tank, retains cargo and never takes credits negative', () => {
  for(const credits of [1000,70,0]) {
    const s=flight();const station=M.OUTPOSTS[4];Object.assign(s.ship,{x:station.x+80,y:station.y,z:station.z,vz:40});
    s.credits=credits;s.fuel=0;s.cargo.concrete=3;M.setPaused(s,true);
    assert.equal(M.rescue(s),true);assert.equal(s.location,station.id);assert.equal(s.docked,true);assert.equal(s.paused,false);
    assert.equal(s.credits,Math.max(0,credits-250));assert.equal(s.cargo.concrete,3);assert.equal(s.fuel,100);assert.equal(M.speed(s),0);
    const before=JSON.stringify(s);assert.equal(M.rescue(s),false);assert.equal(JSON.stringify(s),before);
  }
});

test('a normal flight can reach a second outpost, slow and dock without a tow', () => {
  const s=M.createState(31);M.undock(s);M.aimAtStation(s,'old-oak');
  for(let i=0;i<200;i++)M.step(s,{},M.STEP);
  const target=M.stationById('old-oak');
  for(let i=0;i<120*30&&!s.docked;i++) {
    const distance=Math.hypot(target.x-s.ship.x,target.y-s.ship.y,target.z-s.ship.z);
    M.step(s,distance>65?{forward:true}:{brake:true},M.STEP);
  }
  assert.equal(s.docked,true);assert.equal(s.location,'old-oak');assert.equal(s.visited.length,2);
});

test('standalone home has fictional framing, accessible controls, return routes and no remote runtime', () => {
  const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
  const script=fs.readFileSync(path.join(base,'game.js'),'utf8');
  assert.match(html,/href="\/wider-interest\/"/);assert.match(html,/fictional space game/i);
  assert.match(html,/makes no claims about real routes/);assert.match(html,/session-only game/);
  assert.match(html,/aria-label="Wireframe flight view/);assert.match(html,/role="status"/);
  assert.match(html,/<dialog id="market-dialog" aria-labelledby/);assert.match(html,/<noscript>/);
  assert.doesNotMatch(html,/user-scalable=no|on(?:click|keydown)=|<script[^>]+src="https?:/);
  for(const action of ['up','down','left','right','rollLeft','rollRight','forward','reverse','brake'])assert.match(html,new RegExp(`<button[^>]+data-hold="${action}"`));
  for(const hook of ['visibilitychange','pointercancel','lostpointercapture','setPointerCapture','focusin'])assert.ok(script.includes(hook));
  assert.match(script,/market\.showModal\(\)/);assert.match(script,/event\.repeat/);
  assert.doesNotMatch(script,/fetch\(|localStorage|setInterval\(/);
  const note=fs.readFileSync(path.join(base,'MAINTAINER.md'),'utf8');
  assert.ok(note.includes('fe7f0568c39e97407dd360d77d78d555abe23b19d38e9cd99576dc704630a2b3'));
});
