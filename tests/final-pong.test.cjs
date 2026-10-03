'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../wider-interest/project-management-pong/index.html'),'utf8');
const context={};
vm.runInNewContext(html.match(/<script id="pong-model">([\s\S]*?)<\/script>/)[1],context);
const M=context.PongModel;
const playing=()=>{const s=M.createState();M.start(s);return s;};
const step=s=>M.advance(s,M.C.step);

test('initial state is stopped and reset creates an independent fresh game',()=>{
  const s=M.createState();M.advance(s,1);
  assert.equal(s.phase,'ready');assert.equal(s.scope,1);assert.equal(s.weeks,0);assert.equal(s.ball.y,200);
  s.ball.y=300;assert.equal(M.createState().ball.y,200);
});
test('one paddle contact counts once, separates the ball, and cannot retrigger while departing',()=>{
  const s=playing();s.ball={x:300,y:364,vx:0,vy:210};
  step(s);assert.equal(s.weeks,1);assert.ok(s.ball.vy<0);assert.ok(s.ball.y+M.radius(s)<M.C.bottom);
  M.advance(s,.1);assert.equal(s.weeks,1);assert.equal(s.scope,1);
});
test('the programme scores one clean transfer after the ball crosses its plane',()=>{
  const s=playing();s.direct=true;s.ball={x:300,y:36,vx:0,vy:-210};
  step(s);assert.equal(s.weeks,1);assert.equal(s.transfers,1);assert.equal(s.scope,1.4);assert.equal(s.direct,false);
  assert.ok(s.ball.y-M.radius(s)>M.C.top);
  M.advance(s,.1);assert.equal(s.weeks,1);assert.equal(s.transfers,1);
});
test('only a centre return begins a clean transfer, and contact alone does not grow scope',()=>{
  const centre=playing();centre.ball={x:300,y:364,vx:0,vy:210};step(centre);
  assert.equal(centre.direct,true);assert.equal(centre.scope,1);
  const edge=playing();edge.ball={x:344,y:364,vx:0,vy:210};step(edge);
  assert.equal(edge.direct,false);assert.ok(edge.ball.vx>0);
});
test('circle overlaps the paddle edge count, but a ball already behind the paddle cannot be rescued',()=>{
  const edge=playing();edge.ball={x:355,y:364,vx:0,vy:210};step(edge);assert.equal(edge.weeks,1);
  const behind=playing();behind.ball={x:300,y:385,vx:0,vy:210};step(behind);assert.equal(behind.weeks,0);assert.ok(behind.ball.vy>0);
});
test('walls change scope and horizontal speed once and invalidate a direct transfer',()=>{
  for(const [x,vx,expected] of [[21,-190,70],[579,190,247]]){
    const s=playing();s.direct=true;s.ball={x,y:200,vx,vy:210};
    step(s);assert.equal(s.scope,.8);assert.equal(s.wallHits,1);assert.equal(s.direct,false);assert.equal(Math.abs(s.ball.vx),expected);
    M.advance(s,.1);assert.equal(s.wallHits,1);assert.equal(s.scope,.8);
  }
});
test('scope losses stop at the floor, and speed is bounded on repeated right contacts',()=>{
  const s=playing();s.scope=.5;s.ball={x:583,y:200,vx:1000,vy:210};step(s);
  assert.equal(s.scope,.5);assert.equal(Math.abs(s.ball.vx),380);assert.equal(s.weeks,0);
});
test('misses apply once, do not count a week, and clear the communication path',()=>{
  for(const [y,vy,expected] of [[411,210,.7],[-11,-210,1.5]]){
    const s=playing();s.direct=true;s.ball={x:60,y,vx:0,vy};step(s);
    assert.equal(s.scope,expected);assert.equal(s.weeks,0);assert.equal(s.misses,1);assert.equal(s.direct,false);assert.equal(s.ball.y,200);
    step(s);assert.equal(s.misses,1);assert.equal(s.scope,expected);
  }
});
test('programme handback can reach the target but is never described as completed work',()=>{
  const s=playing();s.scope=9.7;s.ball={x:60,y:-40,vx:0,vy:-210};step(s);
  assert.equal(s.scope,10);assert.equal(s.phase,'won');assert.equal(s.transfers,0);assert.match(s.event,/not completed work/);
  const before=JSON.stringify(s);M.advance(s,.1);M.start(s);assert.equal(JSON.stringify(s),before);
});
test('pause freezes everything and resuming discards pending fractions of a step',()=>{
  const s=playing();M.advance(s,.005);M.pause(s);const paused=JSON.stringify(s);
  M.advance(s,60,1);assert.equal(JSON.stringify(s),paused);assert.equal(s.clockRemainder,0);
  M.start(s);M.advance(s,M.C.step);assert.equal(s.phase,'playing');assert.ok(s.ball.y>200);
});
test('30, 60 and 144 Hz produce the same fixed-step game state',()=>{
  const run=fps=>{const s=playing();s.assisted=true;for(let i=0;i<fps*15;i++)M.advance(s,1/fps);return s;};
  const baseline=run(30);
  for(const fps of [60,144]){
    const s=run(fps);
    for(const key of ['scope','weeks','transfers','misses','wallHits','phase'])assert.equal(s[key],baseline[key],key);
    for(const key of ['x','y','vx','vy'])assert.ok(Math.abs(s.ball[key]-baseline.ball[key])<1e-8,key);
  }
});
test('a stalled frame is capped and cannot advance the game by many unseen seconds',()=>{
  const normal=playing(),stalled=playing();M.advance(normal,.1);M.advance(stalled,60);
  assert.equal(JSON.stringify(stalled),JSON.stringify(normal));
});
test('keyboard movement and pointer placement keep paddles inside the walls',()=>{
  const s=playing();M.setPaddle(s,-100);assert.equal(s.playerX,10);M.advance(s,.1,-1);assert.equal(s.playerX,10);
  M.setPaddle(s,100);assert.equal(s.playerX,490);M.advance(s,.1,1);assert.equal(s.playerX,490);
});
test('larger scope has a larger ball and slower movement, but no passive growth',()=>{
  const small=playing(),large=playing();large.scope=4;
  step(small);step(large);assert.equal(M.radius(large),2*M.radius(small));
  assert.ok(Math.abs((large.ball.y-200)*2-(small.ball.y-200))<1e-8);assert.equal(large.scope,4);
});
test('assisted play can complete a whole rally with legal positions and finite state',()=>{
  const s=playing();s.assisted=true;
  for(let i=0;i<60*400&&s.phase==='playing';i++){
    M.advance(s,1/60);
    assert.ok(Number.isFinite(s.ball.x)&&Number.isFinite(s.ball.y));assert.ok(s.playerX>=10&&s.playerX<=490);assert.ok(s.programmeX>=10&&s.programmeX<=490);
  }
  assert.equal(s.phase,'won');assert.equal(s.scope,10);assert.ok(s.transfers>0);
});
test('the page retains rules and provides text, keyboard, pointer and pause controls',()=>{
  assert.match(html,/href="\/wider-interest\/"/);assert.match(html,/lang="en"/);assert.match(html,/name="viewport"/);
  assert.match(html,/type="range"/);assert.match(html,/aria-label="Move paddle left"/);assert.match(html,/aria-live="polite"/);
  assert.match(html,/visibilitychange/);assert.match(html,/window.addEventListener\('blur',pause\)/);assert.match(html,/pointercancel/);assert.match(html,/e\.code==='Space'/);
  assert.match(html,/not a validated model/);assert.match(html,/not an average project duration/);assert.match(html,/Scope changes only at these events/);
  assert.doesNotMatch(html,/<script[^>]+src=/);
});
