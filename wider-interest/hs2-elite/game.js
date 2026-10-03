(function () {
  'use strict';
  const M = window.EliteModel;
  const $ = id => document.getElementById(id);
  const canvas = $('flight');
  const ctx = canvas.getContext('2d');
  if (!M || !ctx) {
    $('message').textContent = 'The cockpit could not start. Reload in a browser with JavaScript and canvas enabled.';
    return;
  }
  const seed = () => window.crypto?.getRandomValues ? window.crypto.getRandomValues(new Uint32Array(1))[0] : Date.now() >>> 0;
  let state = M.createState(seed());
  let runner = M.createRunner(state);
  let lastTime = null, lastUI = 0;
  let width = 1000, height = 500, focal = 460, ratio = 1;
  let lastMessage = '';
  const keyboard = new Set(), pointers = new Map(), buttonKeys = new Map(), pulses = new Map();
  const holdButtons = [...document.querySelectorAll('[data-hold]')];
  const map = { KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right', KeyQ: 'rollLeft', KeyE: 'rollRight',
    Space: 'forward', KeyX: 'reverse', KeyB: 'brake', ShiftLeft: 'fine', ShiftRight: 'fine', ControlLeft: 'boost', ControlRight: 'boost' };
  const money = n => `£${n.toLocaleString('en-GB')}`;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const market = $('market-dialog'), restartDialog = $('restart-dialog'), towDialog = $('tow-dialog');
  const tableRows = new Map();

  function announce(text) {
    state.message = text;
    if (text !== lastMessage) { $('message').textContent = text; lastMessage = text; }
  }
  function clearInputs() {
    keyboard.clear(); pointers.clear(); buttonKeys.clear(); pulses.clear();
    holdButtons.forEach(button => button.classList.remove('active'));
    state.thrust = 0;
  }
  function resetClock() { runner.reset(); lastTime = null; }
  function pause(reason = 'Flight paused. Press Resume when ready.') {
    clearInputs(); resetClock();
    if (state.docked || state.marketOpen) return;
    if (!state.paused) { M.setPaused(state, true); announce(reason); }
    updateUI();
  }
  function resume() {
    clearInputs(); M.setPaused(state, false); resetClock();
    announce('Flight resumed. Aim, then thrust.');
    updateUI(); canvas.focus({ preventScroll: true });
  }
  function currentInput(now) {
    const input = {};
    keyboard.forEach(code => { if (map[code]) input[map[code]] = true; });
    pointers.forEach(action => { input[action] = true; });
    buttonKeys.forEach(action => { input[action] = true; });
    pulses.forEach((end, action) => { if (now < end) input[action] = true; else pulses.delete(action); });
    holdButtons.forEach(button => button.classList.toggle('active', !!input[button.dataset.hold]));
    return input;
  }
  function canFly() { return !state.docked && !state.paused && !state.marketOpen; }
  function openMarket() {
    if (!M.openMarket(state)) { announce('Dock at an outpost before opening its market.'); return; }
    clearInputs(); resetClock(); renderMarket();
    $('market-message').textContent = 'Ready to trade. These prices stay fixed for this game.';
    if (!market.open) market.showModal();
    updateUI();
  }
  function closeMarket() {
    M.closeMarket(state);
    if (market.open) market.close();
    clearInputs(); resetClock(); updateUI(); canvas.focus({ preventScroll: true });
  }
  function undock() {
    if (market.open) market.close();
    clearInputs();
    if (M.undock(state)) { resetClock(); announce(state.message); updateUI(); canvas.focus({ preventScroll: true }); }
  }
  function aimAtDestination() {
    if (M.aimAtStation(state)) {
      announce(`Turning towards ${M.stationById(state.selected).name}. Wait for the target to reach the centre, then thrust.`);
      canvas.focus({ preventScroll: true });
    } else announce(state.docked ? 'Undock before aiming.' : 'Release thrust before aiming.');
  }
  function updateUI() {
    $('credits').textContent = money(state.credits);
    $('cargo').textContent = `${M.cargoCount(state)} / ${state.capacity}`;
    $('fuel').textContent = `${Math.floor(state.fuel)}%`;
    $('speed').textContent = `${M.speed(state).toFixed(1)} m/s`;
    const heading = ((Math.round(state.ship.yaw * 180 / Math.PI) % 360) + 360) % 360;
    $('heading').textContent = `${String(heading).padStart(3, '0')}°`;
    const input = currentInput(performance.now());
    const mode = input.fine ? 'Fine' : input.boost ? 'Boost' : state.mode.charAt(0).toUpperCase() + state.mode.slice(1);
    $('drive').textContent = state.thrust ? `${state.thrust < 0 ? 'Rev · ' : ''}${mode}` : 'Off';
    $('location').textContent = state.docked ? `Docked at ${M.stationById(state.location).name}` : 'Free flight';
    $('visited').textContent = `${state.visited.length} / 6 outposts visited`;
    const target = M.stationById(state.selected);
    const distance = Math.hypot(target.x - state.ship.x, target.y - state.ship.y, target.z - state.ship.z);
    $('target-status').textContent = `${target.name} · ${Math.round(distance).toLocaleString('en-GB')} m away`;
    const nearest = M.nearest(state);
    $('flight-status').textContent = state.docked ? 'Docked. Fuel replenished. Visit the market or undock.' : state.paused ? 'Paused · your position and fuel are held.' : state.target ? 'Turning to target · wait before thrusting.' : state.fuel === 0 ? 'Fuel empty · request a tow below the cockpit.' : `${nearest.station.name} · ${Math.round(nearest.distance)} m · dock within 50 m at under 5 m/s`;
    $('market-button').disabled = !state.docked;
    $('undock-button').disabled = !state.docked;
    $('pause-button').disabled = state.docked;
    $('pause-button').innerHTML = `${state.paused ? 'Resume' : 'Pause'} <kbd>P</kbd>`;
    $('pause-button').setAttribute('aria-pressed', String(state.paused));
    $('pause-cover').hidden = !state.paused;
    $('aim-button').disabled = !canFly() || state.thrust !== 0;
    $('tow-button').disabled = state.docked;
    $('destination').disabled = false;
    $('thrust-mode').disabled = false;
    $('restart-button').disabled = false;
    holdButtons.forEach(button => { button.disabled = !canFly(); });
    announce(state.message);
  }
  function makeMarketRows() {
    M.GOODS.forEach(good => {
      const row = document.createElement('tr');
      const name = document.createElement('th'); name.scope = 'row'; name.textContent = good.name;
      const price = document.createElement('td'), owned = document.createElement('td'), actions = document.createElement('td');
      const buy = document.createElement('button'), sell = document.createElement('button');
      for (const [button, side] of [[buy, 'buy'], [sell, 'sell']]) {
        button.type = 'button'; button.textContent = side === 'buy' ? 'Buy' : 'Sell';
        button.setAttribute('aria-label', `${side === 'buy' ? 'Buy' : 'Sell'} one unit of ${good.name.toLowerCase()}`);
        button.addEventListener('click', () => {
          const result = M.trade(state, good.id, side);
          $('market-message').textContent = result.message;
          if (result.ok) { renderMarket(); updateUI(); }
        });
        actions.append(button);
      }
      row.append(name, price, owned, actions); $('market-rows').append(row);
      tableRows.set(good.id, { price, owned, buy, sell });
    });
  }
  function renderMarket() {
    if (!state.docked) return;
    $('market-title').textContent = `${M.stationById(state.location).name} market`;
    $('market-credits').textContent = money(state.credits);
    $('market-cargo').textContent = `${M.cargoCount(state)} / ${state.capacity} cargo slots`;
    M.GOODS.forEach(good => {
      const row = tableRows.get(good.id), price = state.prices[state.location][good.id];
      row.price.textContent = money(price); row.owned.textContent = state.cargo[good.id];
      row.buy.disabled = M.cargoCount(state) >= state.capacity || state.credits < price;
      row.sell.disabled = state.cargo[good.id] === 0;
    });
  }

  $('market-button').addEventListener('click', openMarket);
  $('close-market').addEventListener('click', closeMarket);
  market.addEventListener('cancel', event => { event.preventDefault(); closeMarket(); });
  $('undock-button').addEventListener('click', undock);
  $('market-undock').addEventListener('click', undock);
  $('pause-button').addEventListener('click', () => state.paused ? resume() : pause());
  $('aim-button').addEventListener('click', aimAtDestination);
  $('destination').addEventListener('change', event => { state.selected = event.target.value; updateUI(); });
  $('thrust-mode').addEventListener('change', event => { state.mode = event.target.value; updateUI(); });
  $('restart-button').addEventListener('click', () => { pause(); restartDialog.showModal(); });
  $('cancel-restart').addEventListener('click', () => restartDialog.close());
  $('confirm-restart').addEventListener('click', () => {
    clearInputs(); restartDialog.close();
    state = M.createState(seed()); runner = M.createRunner(state); lastTime = null;
    $('destination').value = state.selected; $('thrust-mode').value = state.mode;
    updateUI(); canvas.focus({ preventScroll: true });
  });
  $('tow-button').addEventListener('click', () => {
    pause();
    const { station } = M.nearest(state);
    $('tow-description').textContent = `Tow to ${station.name} for ${money(Math.min(250, state.credits))}? Your cargo is retained and the fuel tank is refilled.`;
    towDialog.showModal();
  });
  $('cancel-tow').addEventListener('click', () => towDialog.close());
  $('confirm-tow').addEventListener('click', () => {
    clearInputs(); towDialog.close(); M.rescue(state); resetClock(); updateUI(); canvas.focus({ preventScroll: true });
  });
  canvas.addEventListener('click', event => {
    canvas.focus({ preventScroll: true });
    if (!canFly()) return;
    const rect = canvas.getBoundingClientRect();
    if (M.aim(state, M.screenRay(event.clientX - rect.left, event.clientY - rect.top, width, height, focal, state.ship))) {
      announce('Turning to that point. Release thrust to steer; the cyan mark shows forward.');
    } else announce('Release thrust before aiming.');
  });
  canvas.addEventListener('keydown', event => {
    if (['KeyM', 'KeyP', 'Escape'].includes(event.code)) {
      event.preventDefault();
      if (event.repeat) return;
      if (event.code === 'KeyM') openMarket();
      else if (event.code === 'KeyP') { if (!state.docked) state.paused ? resume() : pause(); }
      else pause();
      return;
    }
    if (map[event.code]) { event.preventDefault(); if (canFly()) keyboard.add(event.code); }
  });
  window.addEventListener('keyup', event => {
    keyboard.delete(event.code);
    if (event.code === 'Space' || event.code === 'Enter') buttonKeys.clear();
  });
  canvas.addEventListener('blur', () => keyboard.clear());
  holdButtons.forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (!canFly() || (event.pointerType === 'mouse' && event.button !== 0)) return;
      event.preventDefault(); button.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, button.dataset.hold);
    });
    for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      button.addEventListener(eventName, event => { pointers.delete(event.pointerId); });
    }
    button.addEventListener('keydown', event => {
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault(); if (canFly()) buttonKeys.set(button, button.dataset.hold);
      }
    });
    button.addEventListener('keyup', event => {
      if (event.code === 'Space' || event.code === 'Enter') { event.preventDefault(); buttonKeys.delete(button); }
    });
    button.addEventListener('blur', () => buttonKeys.delete(button));
    // Assistive-technology button activation can have no pointer/key hold events.
    button.addEventListener('click', event => {
      if (event.detail === 0 && canFly()) pulses.set(button.dataset.hold, performance.now() + 180);
    });
  });
  window.addEventListener('blur', () => pause('Flight paused while this window was away. Resume when ready.'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause('Flight paused while this tab was away. Resume when ready.'); });
  document.addEventListener('focusin', event => {
    if (!$('cockpit').contains(event.target) && !event.target.closest('dialog')) pause('Flight paused while you read outside the cockpit. Resume when ready.');
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height; focal = Math.min(width, height) * .95;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  const vertices = [[-42,-42,-42],[42,-42,-42],[42,42,-42],[-42,42,-42],[-42,-42,42],[42,-42,42],[42,42,42],[-42,42,42]];
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const stars = Array.from({ length: 150 }, (_, i) => {
    const a = i * 2.399963229728653, z = 1 - 2 * (i + .5) / 150, r = Math.sqrt(1 - z * z);
    return { x: r * Math.cos(a), y: r * Math.sin(a), z };
  });
  function line3D(a, b, camera) {
    let first = M.worldToCamera(M.subtract(a, camera), camera), second = M.worldToCamera(M.subtract(b, camera), camera);
    const near = .5;
    if (first.z < near && second.z < near) return;
    if (first.z < near || second.z < near) {
      const behind = first.z < near ? first : second, front = first.z < near ? second : first;
      const fraction = (near - behind.z) / (front.z - behind.z);
      const clipped = { x: behind.x + (front.x - behind.x) * fraction, y: behind.y + (front.y - behind.y) * fraction, z: near };
      if (first.z < near) first = clipped; else second = clipped;
    }
    const p = M.project(first, width, height, focal), q = M.project(second, width, height, focal);
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  }
  function drawStation(station, camera) {
    const distance = Math.hypot(station.x - camera.x, station.y - camera.y, station.z - camera.z);
    const selected = station.id === state.selected;
    const centre = M.worldToCamera(M.subtract(station, camera), camera);
    ctx.strokeStyle = selected ? '#f5d288' : '#74bd8b'; ctx.lineWidth = distance < 300 ? 1.5 : 1;
    const points = vertices.map(([x,y,z]) => ({ x: station.x + x, y: station.y + y, z: station.z + z }));
    edges.forEach(([a,b]) => line3D(points[a], points[b], camera));
    if (distance < 550) {
      const rotation = reducedMotion.matches ? 0 : state.time * 1.2;
      const c = Math.cos(rotation), s = Math.sin(rotation);
      const ring = [[-30,-30],[30,-30],[30,30],[-30,30]].map(([x,y]) => ({ x: station.x + x*c-y*s, y: station.y + x*s+y*c, z: station.z - 43 }));
      ctx.strokeStyle = '#73d9e6'; ring.forEach((p,i) => line3D(p, ring[(i+1)%4], camera));
    }
    const point = M.project(centre, width, height, focal);
    if (point && point.x > -80 && point.x < width + 80 && point.y > 35 && point.y < height - 50) {
      ctx.fillStyle = selected ? '#f5d288' : '#a2d5b0'; ctx.font = `${width < 500 ? 10 : 11}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      const labelX = Math.max(75, Math.min(width - 75, point.x));
      const labelY = Math.max(70, point.y - Math.min(90, 55*focal/Math.max(centre.z, 1)) - 12);
      ctx.fillText(station.name.toUpperCase(), labelX, labelY);
      if (distance < 600) { ctx.fillStyle = '#779b85'; ctx.fillText(station.type.toUpperCase(), labelX, labelY + 14); }
    }
  }
  function drawCompass() {
    const cx = 48, cy = height - 91, radius = 25;
    ctx.strokeStyle = '#426a51'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2); ctx.stroke();
    ctx.textAlign = 'center'; ctx.fillStyle = '#92bda1'; ctx.font = '9px ui-monospace, monospace'; ctx.fillText('N',cx,cy-radius-5);
    const angle = -state.ship.yaw;
    ctx.strokeStyle = '#f5d288'; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx + Math.sin(angle)*21,cy-Math.cos(angle)*21); ctx.stroke();
    const pitchY = cy - Math.sin(state.ship.pitch)*20;
    ctx.strokeStyle = '#73d9e6'; ctx.beginPath();ctx.moveTo(cx-19,pitchY);ctx.lineTo(cx+19,pitchY);ctx.stroke();
    ctx.fillStyle = '#779b85';ctx.fillText('BEARING',cx,cy+radius+13);
  }
  function render() {
    ctx.clearRect(0,0,width,height);
    const gradient = ctx.createRadialGradient(width*.5,height*.5,0,width*.5,height*.5,Math.max(width,height)*.7);
    gradient.addColorStop(0,'#0b2019');gradient.addColorStop(1,'#030a07');ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);
    let camera = state.ship;
    if (state.docked) {
      const station = M.stationById(state.location), direction = M.basis(state.ship).forward;
      camera = { ...state.ship, x: station.x - direction.x * 210, y: station.y - direction.y * 210, z: station.z - direction.z * 210 };
    }
    ctx.fillStyle='#62856f';
    stars.forEach(star => {
      const relative = M.worldToCamera({ x:star.x*10000,y:star.y*10000,z:star.z*10000 },camera);
      const p=M.project(relative,width,height,focal);if(p&&p.x>=0&&p.x<width&&p.y>=0&&p.y<height)ctx.fillRect(p.x,p.y,1.5,1.5);
    });
    [...M.OUTPOSTS].sort((a,b) => Math.hypot(b.x-camera.x,b.y-camera.y,b.z-camera.z)-Math.hypot(a.x-camera.x,a.y-camera.y,a.z-camera.z)).forEach(station=>drawStation(station,camera));
    const x=width/2,y=height/2;
    ctx.strokeStyle=state.thrust<0?'#efb879':state.thrust>0?'#e2ffde':'#73d9e6';ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(x-17,y);ctx.lineTo(x-6,y);ctx.moveTo(x+6,y);ctx.lineTo(x+17,y);ctx.moveTo(x,y-17);ctx.lineTo(x,y-6);ctx.moveTo(x,y+6);ctx.lineTo(x,y+17);ctx.stroke();
    ctx.fillStyle=ctx.strokeStyle;ctx.fillRect(x-1,y-1,2,2);
    if (!state.docked && M.speed(state)>.3) {
      const velocityDirection = M.unit({x:state.ship.vx,y:state.ship.vy,z:state.ship.vz});
      const vector = M.worldToCamera({x:velocityDirection.x*100,y:velocityDirection.y*100,z:velocityDirection.z*100},state.ship);
      const p=M.project(vector,width,height,focal);
      ctx.strokeStyle='#efb879';ctx.fillStyle='#efb879';ctx.lineWidth=1;
      if(p&&p.x>12&&p.x<width-12&&p.y>50&&p.y<height-60){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y,7,0,Math.PI*2);ctx.stroke();}
      else {ctx.font='10px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText(vector.z<0?'DRIFT AFT':'DRIFT OUT OF VIEW',x,height-74);}
    }
    if (!state.docked) {
      const target = M.stationById(state.selected), relative=M.worldToCamera(M.subtract(target,state.ship),state.ship);
      const p=M.project(relative,width,height,focal);
      if(!p||p.x<0||p.x>width||p.y<45||p.y>height-55){ctx.fillStyle='#f5d288';ctx.font='10px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText(relative.z<0?'DESTINATION BEHIND · USE AIM':'DESTINATION OUT OF VIEW · USE AIM',x,60);}
    }
    drawCompass();
  }
  function frame(now) {
    const elapsed=lastTime===null?0:(now-lastTime)/1000;lastTime=now;
    const wasDocked=state.docked;
    runner.advance(elapsed,currentInput(now));
    if(!wasDocked&&state.docked){clearInputs();resetClock();updateUI();}
    render();
    if(now-lastUI>100){updateUI();lastUI=now;}
    window.requestAnimationFrame(frame);
  }
  makeMarketRows();resize();updateUI();
  document.body.dataset.ready='true';
  window.requestAnimationFrame(frame);
})();
