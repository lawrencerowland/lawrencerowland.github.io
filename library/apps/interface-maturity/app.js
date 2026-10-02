
/* ============================
   Interface Maturity Simulator
   (Standalone, SharpCloud-style)
   ============================ */

(() => {
  "use strict";

  /* ---------- Model meta ---------- */
  const VARS = [
    { key: "Trust", label: "Trust", goodHigh: true, tip: "Confidence that others will act in good faith." },
    { key: "Adaptability", label: "Adaptability", goodHigh: true, tip: "Ability to adjust when reality changes." },
    { key: "Ambiguity", label: "Ambiguity", goodHigh: false, tip: "Unclear scope/roles/definition of done (high = bad)." },
    { key: "EscalationReadiness", label: "Escalation readiness", goodHigh: true, tip: "How quickly issues are surfaced & resolved." },
    { key: "SharedIncentives", label: "Shared incentives", goodHigh: true, tip: "Aligned goals, shared wins/losses." }
  ];

  const DEFAULT_CONFIG = {
    localIterations: 4,
    spilloverStrong: 0.15,
    spilloverWeak: 0.05,
    frictionAmbiguityThreshold: 70,
    frictionPositiveFactor: 0.5,
    safetyEscalationThreshold: 30,
    safetyAmbiguityThreshold: 60,
    safetyPenalty: 5,
    localCouplingEdges: [
      { from: "Ambiguity", to: "Trust", coeff: -0.6 },
      { from: "Ambiguity", to: "EscalationReadiness", coeff: 0.3 },
      { from: "Trust", to: "Adaptability", coeff: 0.5 },
      { from: "Trust", to: "SharedIncentives", coeff: 0.5 },
      { from: "SharedIncentives", to: "Ambiguity", coeff: -0.4 }
    ]
  };

  const BASE_INTERFACES = [
    {
      id: "pm-design",
      name: "PM↔Design",
      parties: ["PM", "Design"],
      owner: "Alex",
      tag: "Design",
      weight: 1.0,
      values: { Trust:55, Adaptability:60, Ambiguity:45, EscalationReadiness:50, SharedIncentives:50 }
    },
    {
      id: "pm-client",
      name: "PM↔Client",
      parties: ["PM", "Client"],
      owner: "Sam",
      tag: "Governance",
      weight: 1.3,
      values: { Trust:50, Adaptability:55, Ambiguity:50, EscalationReadiness:45, SharedIncentives:52 }
    },
    {
      id: "design-supply",
      name: "Design↔Supply Chain",
      parties: ["Design", "Supply Chain"],
      owner: "Mia",
      tag: "Delivery",
      weight: 1.1,
      values: { Trust:48, Adaptability:50, Ambiguity:58, EscalationReadiness:42, SharedIncentives:46 }
    },
    {
      id: "contractor-clientrep",
      name: "Contractor↔Client Rep",
      parties: ["Contractor", "Client"],
      owner: "Lee",
      tag: "Commercial",
      weight: 1.4,
      values: { Trust:52, Adaptability:49, Ambiguity:60, EscalationReadiness:40, SharedIncentives:44 }
    },
    {
      id: "risk-finance",
      name: "Risk↔Finance",
      parties: ["Risk", "Finance"],
      owner: "Pat",
      tag: "Assurance",
      weight: 1.2,
      values: { Trust:47, Adaptability:53, Ambiguity:55, EscalationReadiness:48, SharedIncentives:50 }
    }
  ];

  /* ---------- Helpers ---------- */
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const clamp100 = (x) => Math.max(0, Math.min(100, x));
  const round1 = (x) => Math.round(x * 10) / 10;
  const round0 = (x) => Math.round(x);

  const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

  function maturityIndex(values){
    // Average of good variables plus (100 - ambiguity)
    const good =
      values.Trust +
      values.Adaptability +
      values.EscalationReadiness +
      values.SharedIncentives +
      (100 - values.Ambiguity);
    return good / 5;
  }

  function avg(arr){
    if (!arr.length) return 0;
    return arr.reduce((a,b)=>a+b,0) / arr.length;
  }

  function intersects(a, b){
    const set = new Set(a);
    return b.some(x => set.has(x));
  }

  function sharedParties(a, b){
    const set = new Set(a.parties);
    return b.parties.filter(p => set.has(p));
  }

  // Heat color: score 0..1 => hue 0..120
  function heatColor(varMeta, value){
    const score = varMeta.goodHigh ? (value/100) : (1 - value/100);
    const s = clamp01(score);
    const hue = 120 * s;           // 0 red -> 120 green
    const sat = 70;
    const light = 92 - 12 * s;     // darker for low, lighter for high
    return `hsl(${hue}, ${sat}%, ${light}%)`;
  }

  function formatDelta(d){
    const x = round1(d);
    const sign = x > 0 ? "+" : "";
    return `${sign}${x}`;
  }

  function safeClipboardWrite(text){
    if (navigator.clipboard && navigator.clipboard.writeText){
      return Promise.race([navigator.clipboard.writeText(text),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Copy timed out")),1500))]).then(()=>{$("log").textContent="Copied.";}).catch(()=>{$("log").textContent="Copy unavailable. Select the visible export text and copy it manually.";});
    }
    // fallback
    window.prompt("Copy to clipboard:", text);
    return Promise.resolve();
  }

  function downloadText(filename, text){
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }

  function zerosDelta(){
    const d = {};
    for (const v of VARS) d[v.key] = 0;
    return d;
  }

  /* ---------- State ---------- */
  const state = {
    config: deepCopy(DEFAULT_CONFIG),
    step: 0,
    // interfaces will be expanded with history + lastStepDelta
    interfaces: [],
    undoStack: [],
    selected: { ifaceId: null, varKey: null },
    globalHistory: {
      avgMaturity: [ ],
      avgTrust: [ ]
    }
  };

  // Initialize with baseline
  function initInterfaces(){
    state.interfaces = deepCopy(BASE_INTERFACES).map(it => ({
      ...it,
      history: {
        Trust: [it.values.Trust],
        Maturity: [maturityIndex(it.values)]
      },
      lastStepDelta: zerosDelta()
    }));
    state.step = 0;
    state.undoStack = [];
    state.globalHistory.avgMaturity = [ avg(state.interfaces.map(i=>maturityIndex(i.values))) ];
    state.globalHistory.avgTrust = [ avg(state.interfaces.map(i=>i.values.Trust)) ];
    state.selected = { ifaceId: state.interfaces[0].id, varKey: VARS[0].key };
  }

  initInterfaces();

  /* ---------- Core simulation ---------- */


  function finiteRange(value, min, max, label){
    if(typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) throw new Error(`${label} must be a finite number from ${min} to ${max}.`);
    return value;
  }
  function validateConfig(input){
    if(!input || typeof input!=="object") throw new Error("Missing model configuration.");
    const cfg=deepCopy(input);
    finiteRange(cfg.localIterations,1,10,"Iterations"); if(!Number.isInteger(cfg.localIterations)) throw new Error("Iterations must be a whole number.");
    for(const key of ["spilloverStrong","spilloverWeak","frictionPositiveFactor"]) finiteRange(cfg[key],0,1,key);
    for(const key of ["frictionAmbiguityThreshold","safetyEscalationThreshold","safetyAmbiguityThreshold","safetyPenalty"]) finiteRange(cfg[key],0,100,key);
    if(!Array.isArray(cfg.localCouplingEdges) || cfg.localCouplingEdges.length>25) throw new Error("Invalid coupling edges.");
    const keys=new Set(VARS.map(v=>v.key)), pairs=new Set();
    for(const e of cfg.localCouplingEdges){if(!e || !keys.has(e.from)||!keys.has(e.to)||pairs.has(e.from+":"+e.to)) throw new Error("Invalid or duplicate coupling edge.");pairs.add(e.from+":"+e.to);finiteRange(e.coeff,-1,1,"Coupling coefficient");}
    return cfg;
  }
  function validateState(input){
    if(!input || typeof input!=="object") throw new Error("Expected a simulation state object.");
    const config=validateConfig(input.config), ids=new Set();
    if(!Array.isArray(input.interfaces)||input.interfaces.length<1||input.interfaces.length>50)throw new Error("State needs 1–50 interfaces.");
    const text=(x,label)=>{if(typeof x!=="string"||!x.trim()||x.length>200)throw new Error(`Invalid ${label}.`);return x;};
    const history=(a,max,label)=>{if(!Array.isArray(a)||!a.length||a.length>max)throw new Error(`Invalid ${label}.`);return a.map(x=>finiteRange(x,0,100,label));};
    const interfaces=input.interfaces.map(it=>{
      if(!it||typeof it!=="object")throw new Error("Invalid interface.");
      const id=text(it.id,"interface ID");if(ids.has(id))throw new Error("Duplicate interface ID.");ids.add(id);
      const values={},lastStepDelta={};for(const v of VARS){values[v.key]=finiteRange(it.values?.[v.key],0,100,v.label);lastStepDelta[v.key]=finiteRange(it.lastStepDelta?.[v.key]??0,-100,100,"Last change");}
      if(!Array.isArray(it.parties)||!it.parties.length||it.parties.length>20)throw new Error("Each interface needs named parties.");
      return {id,name:text(it.name,"interface name"),owner:text(it.owner,"owner"),tag:text(it.tag,"tag"),parties:it.parties.map(x=>text(x,"party")),weight:finiteRange(it.weight,0.01,10,"Interface weight"),values,lastStepDelta,history:{Trust:history(it.history?.Trust??[values.Trust],30,"Trust history"),Maturity:history(it.history?.Maturity??[maturityIndex(values)],30,"Index history")}};
    });
    const step=input.step??0;finiteRange(step,0,1000000,"Step");if(!Number.isInteger(step))throw new Error("Step must be a whole number.");
    const selected=input.selected??{ifaceId:interfaces[0].id,varKey:VARS[0].key};if(!ids.has(selected.ifaceId)||!VARS.some(v=>v.key===selected.varKey))throw new Error("Invalid selected interface or variable.");
    return {step,interfaces,config,selected:{...selected},globalHistory:{avgMaturity:history(input.globalHistory?.avgMaturity??[avg(interfaces.map(i=>maturityIndex(i.values)))],60,"Global index history"),avgTrust:history(input.globalHistory?.avgTrust??[avg(interfaces.map(i=>i.values.Trust))],60,"Global Trust history")}};
  }
  function loadState(input){const valid=validateState(input);restore(valid);state.undoStack=[];return snapshot();}
  function reset(){state.config=deepCopy(DEFAULT_CONFIG);initInterfaces();}

  function computeLocalDeltas(userVarKey, userDelta, held=false){
    // Propagate in "waves" along coupling edges for N iterations.
    // frontier starts as user delta on userVarKey, then each iteration produces new deltas.
    const N = Math.max(1, Math.min(10, state.config.localIterations|0));
    const total = zerosDelta();
    const frontier = zerosDelta();
    total[userVarKey] = userDelta;
    frontier[userVarKey] = userDelta;

    const waves = [];
    waves.push({ iter: 0, frontier: deepCopy(frontier) });

    for (let iter=1; iter<=N; iter++){
      const next = zerosDelta();
      for (const edge of state.config.localCouplingEdges){
        if(!held || edge.to!==userVarKey) next[edge.to] += edge.coeff * frontier[edge.from];
      }
      for (const v of VARS){
        total[v.key] += next[v.key];
      }
      for (const v of VARS){
        frontier[v.key] = next[v.key];
      }
      waves.push({ iter, frontier: deepCopy(frontier) });
    }
    for (const v of VARS) total[v.key] = round1(total[v.key]);
    return { total, waves };
  }

  function spilloverCoeff(iFace, jFace){
    const strong = intersects(iFace.parties, jFace.parties);
    let coeff = strong ? state.config.spilloverStrong : state.config.spilloverWeak;

    // Weight damping: if j is heavier than i, scale by weight(i)/weight(j)
    if (jFace.weight > iFace.weight){
      coeff *= (iFace.weight / jFace.weight);
    }
    return { coeff, strong };
  }

  function applyDeltasToInterface(iface, deltas){
    // Apply deltas with clamp
    for (const v of VARS){
      const k = v.key;
      iface.values[k] = round1(clamp100(iface.values[k] + deltas[k]));
    }
  }

  function applySafetyValve(iface){
    const cfg = state.config;
    if (iface.values.EscalationReadiness < cfg.safetyEscalationThreshold &&
        iface.values.Ambiguity > cfg.safetyAmbiguityThreshold){
      iface.values.Trust = round1(clamp100(iface.values.Trust - cfg.safetyPenalty));
      iface.values.Adaptability = round1(clamp100(iface.values.Adaptability - cfg.safetyPenalty));
      return true;
    }
    return false;
  }

  function snapshot(){
    return deepCopy({
      step: state.step,
      interfaces: state.interfaces,
      globalHistory: state.globalHistory,
      selected: state.selected,
      config: state.config
    });
  }

  function restore(snap){
    state.step = snap.step;
    state.interfaces = snap.interfaces;
    state.globalHistory = snap.globalHistory;
    state.selected = snap.selected;
    state.config = snap.config;
    if(typeof document!=="undefined")primeKnobInputsFromConfig();
  }

  function runAction({ ifaceId, varKey, mode, value }){
    // mode: "delta" => value is Δ
    // mode: "set"   => value is absolute; Δ = value - current
    const iface = state.interfaces.find(x => x.id === ifaceId);
    if (!iface) throw new Error("Choose a valid interface.");
    if(!VARS.some(v=>v.key===varKey)||!["set","delta"].includes(mode))throw new Error("Invalid action.");
    finiteRange(value, mode==="set"?0:-100,100,"Action value");
    validateConfig(state.config);
    const proposedDelta=mode==="set"?value-iface.values[varKey]:value;
    if(proposedDelta===0)return false;
    const before = snapshot();
    state.undoStack.push(before);

    // clear last-step deltas
    for (const it of state.interfaces){
      it.lastStepDelta = zerosDelta();
    }

    const current = iface.values[varKey];
    const userDelta = (mode === "set") ? (value - current) : value;

    const { total: localTotal, waves } = computeLocalDeltas(varKey, userDelta, mode === "set");

    // Capture before-values to compute last-step deltas at the end
    const beforeValues = new Map(state.interfaces.map(it => [it.id, deepCopy(it.values)]));

    // 1) Apply local coupling to chosen interface
    applyDeltasToInterface(iface, localTotal);

    const realised = {}; for(const v of VARS) realised[v.key]=round1(iface.values[v.key]-beforeValues.get(iface.id)[v.key]);

    // 2) Spillover to other interfaces
    const spillNotes = [];
    for (const other of state.interfaces){
      if (other.id === iface.id) continue;

      const { coeff, strong } = spilloverCoeff(iface, other);
      const spill = zerosDelta();
      for (const v of VARS){
        spill[v.key] = round1(realised[v.key] * coeff);
      }

      // Friction cap on receiver if its ambiguity is high BEFORE receiving spill
      const cfg = state.config;
      let frictionApplied = false;
      if (other.values.Ambiguity > cfg.frictionAmbiguityThreshold){
        for (const v of VARS){
          if (v.goodHigh ? spill[v.key] > 0 : spill[v.key] < 0){
            spill[v.key] = round1(spill[v.key] * cfg.frictionPositiveFactor);
            frictionApplied = true;
          }
        }
      }

      applyDeltasToInterface(other, spill);

      spillNotes.push({
        to: other.name,
        coeff: Number(coeff.toFixed(4)),
        strong,
        frictionApplied,
        spill
      });
    }

    // 3) Threshold penalty check across all
    const safetyHits = [];
    for (const it of state.interfaces){
      const hit = applySafetyValve(it);
      if (hit) safetyHits.push(it.name);
    }

    if(mode === "set") iface.values[varKey]=value;

    // 4) Update step, histories, lastStepDelta
    state.step += 1;

    for (const it of state.interfaces){
      const b = beforeValues.get(it.id);
      for (const v of VARS){
        const k = v.key;
        it.lastStepDelta[k] = round1(it.values[k] - b[k]);
      }
      it.history.Trust.push(it.values.Trust);
      it.history.Maturity.push(maturityIndex(it.values));
      // keep recent window
      if (it.history.Trust.length > 30) it.history.Trust.shift();
      if (it.history.Maturity.length > 30) it.history.Maturity.shift();
    }

    state.globalHistory.avgMaturity.push(avg(state.interfaces.map(i=>maturityIndex(i.values))));
    state.globalHistory.avgTrust.push(avg(state.interfaces.map(i=>i.values.Trust)));
    if (state.globalHistory.avgMaturity.length > 60) state.globalHistory.avgMaturity.shift();
    if (state.globalHistory.avgTrust.length > 60) state.globalHistory.avgTrust.shift();

    // 5) Render and log
    renderAll();
    writeLog({
      ifaceName: iface.name,
      varKey,
      mode,
      input: value,
      userDelta: round1(userDelta),
      localTotal,
      waves,
      spillNotes,
      safetyHits
    });
  }

  function runScenario(kind){
    const before = snapshot();
    state.undoStack.push(before);

    for (const it of state.interfaces){
      it.lastStepDelta = zerosDelta();
    }
    const beforeValues = new Map(state.interfaces.map(it => [it.id, deepCopy(it.values)]));

    const notes = [];
    const applyExogenous = (ifaceId, varKey, delta) => {
      const it = state.interfaces.find(x=>x.id===ifaceId);
      if (!it) return;
      const d = zerosDelta();
      d[varKey] = delta;
      applyDeltasToInterface(it, d);
      notes.push(`${it.name}: ${varKey} ${formatDelta(delta)}`);
    };

    if (kind === "early_warning"){
      for (const it of state.interfaces) applyExogenous(it.id, "EscalationReadiness", +10);
    } else if (kind === "contract_misalign"){
      for (const it of state.interfaces) applyExogenous(it.id, "SharedIncentives", -15);
    } else if (kind === "clarify_scope"){
      for (const it of state.interfaces) applyExogenous(it.id, "Ambiguity", -12);
    } else if (kind === "deadline_pressure"){
      applyExogenous("pm-client", "Ambiguity", +12);
      applyExogenous("pm-client", "Trust", -8);
    } else {
      // unknown
      state.undoStack.pop();
      return;
    }

    const safetyHits = [];
    for (const it of state.interfaces){
      const hit = applySafetyValve(it);
      if (hit) safetyHits.push(it.name);
    }

    state.step += 1;
    for (const it of state.interfaces){
      const b = beforeValues.get(it.id);
      for (const v of VARS){
        const k = v.key;
        it.lastStepDelta[k] = round1(it.values[k] - b[k]);
      }
      it.history.Trust.push(it.values.Trust);
      it.history.Maturity.push(maturityIndex(it.values));
      if (it.history.Trust.length > 30) it.history.Trust.shift();
      if (it.history.Maturity.length > 30) it.history.Maturity.shift();
    }

    state.globalHistory.avgMaturity.push(avg(state.interfaces.map(i=>maturityIndex(i.values))));
    state.globalHistory.avgTrust.push(avg(state.interfaces.map(i=>i.values.Trust)));
    if (state.globalHistory.avgMaturity.length > 60) state.globalHistory.avgMaturity.shift();
    if (state.globalHistory.avgTrust.length > 60) state.globalHistory.avgTrust.shift();

    renderAll();
    const log = [
      `Scenario: ${kind}`,
      ...notes.map(x => `  - ${x}`),
      safetyHits.length ? `Threshold penalty triggered on: ${safetyHits.join(", ")}` : `Threshold penalty: none`
    ].join("\n");
    if(typeof document!=="undefined")document.getElementById("log").textContent = log;
  }

  /* ---------- Rendering ---------- */
  const $ = (id) => document.getElementById(id);

  function renderHeaderPills(){
    $("stepPill").textContent = String(state.step);
    const sel = state.selected;
    const iface = state.interfaces.find(x=>x.id===sel.ifaceId);
    const name = iface ? iface.name : "—";
    $("selPill").textContent = (iface && sel.varKey) ? `${name} · ${sel.varKey}` : "—";
    $("iterPill").textContent = String(state.config.localIterations);
    $("spillPill").textContent = `${state.config.spilloverStrong} / ${state.config.spilloverWeak}`;
    $("fricPill").textContent = `A>${state.config.frictionAmbiguityThreshold} → improvement ×${state.config.frictionPositiveFactor}`;
    $("netStrong").textContent = String(state.config.spilloverStrong);
    $("netWeak").textContent = String(state.config.spilloverWeak);
  }

  function renderSelects(){
    const ifaceSel = $("ifaceSel");
    const varSel = $("varSel");

    // interfaces
    ifaceSel.innerHTML = "";
    for (const it of state.interfaces){
      const opt = document.createElement("option");
      opt.value = it.id;
      opt.textContent = `${it.name}  (w=${it.weight}, parties=${it.parties.join("&")})`;
      ifaceSel.appendChild(opt);
    }

    // vars
    varSel.innerHTML = "";
    for (const v of VARS){
      const opt = document.createElement("option");
      opt.value = v.key;
      opt.textContent = v.label;
      opt.title = v.tip;
      varSel.appendChild(opt);
    }

    // set selected
    ifaceSel.value = state.selected.ifaceId || state.interfaces[0].id;
    varSel.value = state.selected.varKey || VARS[0].key;
  }

  function renderMatrix(){
    const host = $("matrixHost");
    host.innerHTML = "";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trh = document.createElement("tr");

    const th0 = document.createElement("th");
    th0.textContent = "Interface (Story)";
    trh.appendChild(th0);

    for (const v of VARS){
      const th = document.createElement("th");
      th.textContent = v.label + (v.key==="Ambiguity" ? " (high=bad)" : "");
      th.title = v.tip;
      trh.appendChild(th);
    }

    const thM = document.createElement("th");
    thM.textContent = "Maturity index";
    thM.title = "Average of Trust, Adaptability, Escalation readiness, Shared incentives, and (100 - Ambiguity).";
    trh.appendChild(thM);

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const sel = state.selected;

    for (const it of state.interfaces){
      const tr = document.createElement("tr");

      // Left sticky cell
      const td0 = document.createElement("td");
      const nameLine = document.createElement("div");
      nameLine.className = "ifaceName";

      const left = document.createElement("div");
      left.textContent = it.name;

      const right = document.createElement("div");
      right.className = "pill";
      right.style.fontSize = "11px";
      right.textContent = `w=${it.weight}`;

      nameLine.appendChild(left);
      nameLine.appendChild(right);

      const meta = document.createElement("div");
      meta.className = "metaSmall";
      meta.textContent = `Parties: ${it.parties.join(" ↔ ")} · Owner: ${it.owner} · Tag: ${it.tag}`;

      const sparkWrap = document.createElement("div");
      sparkWrap.className = "sparkWrap";
      const lbl = document.createElement("div");
      lbl.className = "sparkLbl";
      lbl.textContent = "Trust";
      const canvas = document.createElement("canvas");
      canvas.className = "spark";
      canvas.width = 220;
      canvas.height = 44;
      drawSpark(canvas, it.history.Trust);

      const lbl2 = document.createElement("div");
      lbl2.className = "sparkLbl";
      lbl2.textContent = "Index";
      const canvas2 = document.createElement("canvas");
      canvas2.className = "spark";
      canvas2.width = 220;
      canvas2.height = 44;
      drawSpark(canvas2, it.history.Maturity);

      sparkWrap.appendChild(lbl);
      sparkWrap.appendChild(canvas);
      sparkWrap.appendChild(lbl2);
      sparkWrap.appendChild(canvas2);

      td0.appendChild(nameLine);
      td0.appendChild(meta);
      td0.appendChild(sparkWrap);
      tr.appendChild(td0);

      // Value cells
      for (const v of VARS){
        const td = document.createElement("td");
        const cell = document.createElement("button");
        cell.type="button";cell.dataset.selection=it.id+":"+v.key;cell.setAttribute("aria-label",`${it.name}, ${v.label}, ${it.values[v.key]}`);
        cell.className = "cell";
        const isSelected = (sel.ifaceId === it.id && sel.varKey === v.key);
        if (isSelected) cell.classList.add("selected");

        const val = it.values[v.key];
        cell.style.background = `linear-gradient(180deg, ${heatColor(v,val)}, rgba(233,231,218,.35))`;

        const leftVal = document.createElement("div");
        leftVal.className = "cellVal";
        leftVal.textContent = String(round0(val));

        const d = it.lastStepDelta[v.key] || 0;
        const delta = document.createElement("div");
        delta.className = "cellDelta";
        if (d > 0) delta.classList.add("deltaPos");
        else if (d < 0) delta.classList.add("deltaNeg");
        else delta.classList.add("deltaZero");
        delta.textContent = `Δ${formatDelta(d)}`;

        cell.appendChild(leftVal);
        cell.appendChild(delta);

        cell.title = `${it.name}\n${v.label}: ${round1(val)} (Δ${formatDelta(d)})\nTip: ${v.tip}`;

        cell.addEventListener("click", () => {
          state.selected.ifaceId = it.id;
          state.selected.varKey = v.key;
          syncControlsToSelection();
          renderAll(); // redraw selection highlight
          [...document.querySelectorAll("[data-selection]")].find(el=>el.dataset.selection===it.id+":"+v.key)?.focus();
        });

        td.appendChild(cell);
        tr.appendChild(td);
      }

      // Maturity index column
      const tdM = document.createElement("td");
      const idx = maturityIndex(it.values);
      const cellM = document.createElement("div");
      cellM.className = "cell";
      cellM.style.cursor = "default";
      cellM.style.background = `linear-gradient(180deg, ${heatColor({goodHigh:true}, idx)}, rgba(233,231,218,.35))`;

      const v1 = document.createElement("div");
      v1.className = "cellVal";
      v1.textContent = String(round0(idx));

      const dIdx = round1(idx - it.history.Maturity[it.history.Maturity.length - 2] || 0);
      const dTag = document.createElement("div");
      dTag.className = "cellDelta";
      if (dIdx > 0) dTag.classList.add("deltaPos");
      else if (dIdx < 0) dTag.classList.add("deltaNeg");
      else dTag.classList.add("deltaZero");
      dTag.textContent = `Δ${formatDelta(dIdx)}`;

      cellM.appendChild(v1);
      cellM.appendChild(dTag);
      tdM.appendChild(cellM);
      tr.appendChild(tdM);

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    host.appendChild(table);
  }

  function drawSpark(canvas, series){
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // background
    ctx.fillStyle = "rgba(0,0,0,0.0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if (!series || series.length < 2) return;

    const pad = 6;
    const w = canvas.width - pad*2;
    const h = canvas.height - pad*2;
    const xs = series.length;
    const minV = 0;
    const maxV = 100;

    // axis line
    ctx.strokeStyle = "rgba(49,87,63,0.22)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad+h);
    ctx.lineTo(pad+w, pad+h);
    ctx.stroke();

    // line
    ctx.strokeStyle = "rgba(31,65,48,0.95)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i=0; i<xs; i++){
      const x = pad + (w * (i/(xs-1)));
      const yNorm = (series[i]-minV)/(maxV-minV);
      const y = pad + (h * (1 - yNorm));
      if (i===0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }
    ctx.stroke();

    // last dot
    const last = series[xs-1];
    const x = pad + w;
    const y = pad + (h * (1 - (last-minV)/(maxV-minV)));
    ctx.fillStyle = "rgba(55,110,73,0.95)";
    ctx.beginPath();
    ctx.arc(x,y,3.2,0,Math.PI*2);
    ctx.fill();
  }

  function renderNetwork(){
    const svg = $("netSvg");
    const tip = $("netTip");
    svg.innerHTML = "";

    const showWeak = $("showWeak").checked;

    const nodes = state.interfaces.map((it, idx) => ({
      id: it.id,
      name: it.name,
      it,
      idx
    }));

    // circle layout
    const cx = 500, cy = 290;
    const R = 210;
    const positions = new Map();
    nodes.forEach((n, i) => {
      const angle = (Math.PI*2) * (i / nodes.length) - Math.PI/2;
      positions.set(n.id, { x: cx + R*Math.cos(angle), y: cy + R*Math.sin(angle) });
    });

    // edges for all pairs (strong + optional weak)
    const edges = [];
    for (let i=0;i<nodes.length;i++){
      for (let j=i+1;j<nodes.length;j++){
        const a = nodes[i].it;
        const b = nodes[j].it;
        const shared = sharedParties(a,b);
        const strong = shared.length > 0;
        if (!strong && !showWeak) continue;
        const { coeff } = spilloverCoeff(a,b); // note: coeff depends on weight direction; for display we'll show symmetric-ish
        edges.push({
          a: nodes[i], b: nodes[j],
          strong,
          label: strong ? `Shared: ${shared.join(", ")}` : "Weak tie",
          coeff: Number(coeff.toFixed(4))
        });
      }
    }

    // Draw edges
    for (const e of edges){
      const p1 = positions.get(e.a.id);
      const p2 = positions.get(e.b.id);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", p1.x);
      line.setAttribute("y1", p1.y);
      line.setAttribute("x2", p2.x);
      line.setAttribute("y2", p2.y);

      const alpha = e.strong ? 0.55 : 0.22;
      line.setAttribute("stroke", `rgba(49,87,63,${alpha})`);
      line.setAttribute("stroke-width", e.strong ? 3 : 1.5);

      // hover
      line.addEventListener("mousemove", (ev) => {
        tip.style.display = "block";
        tip.style.left = (ev.offsetX + 14) + "px";
        tip.style.top = (ev.offsetY + 14) + "px";
        tip.textContent = `${e.a.name} ↔ ${e.b.name}\n${e.label}\n${e.a.name} → ${e.b.name}: ${e.coeff}; reverse: ${spilloverCoeff(e.b.it,e.a.it).coeff.toFixed(4)}`;
      });
      line.addEventListener("mouseleave", ()=> tip.style.display="none");

      svg.appendChild(line);
    }

    // Draw nodes
    for (const n of nodes){
      const p = positions.get(n.id);
      const idx = maturityIndex(n.it.values);

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${p.x},${p.y})`);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", 22);
      circle.setAttribute("fill", heatColor({goodHigh:true}, idx));
      circle.setAttribute("stroke", "rgba(31,65,48,0.65)");
      circle.setAttribute("stroke-width", "2");

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("y", 44);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "rgba(31,65,48,0.92)");
      text.setAttribute("font-size", "12");
      text.setAttribute("font-weight", "750");
      text.textContent = n.name;

      const small = document.createElementNS("http://www.w3.org/2000/svg", "text");
      small.setAttribute("y", 5);
      small.setAttribute("text-anchor", "middle");
      small.setAttribute("fill", "rgba(233,231,218,0.85)");
      small.setAttribute("font-size", "13");
      small.setAttribute("font-weight", "900");
      small.textContent = String(round0(idx));

      g.appendChild(circle);
      g.appendChild(small);
      g.appendChild(text);

      g.addEventListener("mousemove", (ev) => {
        const box = $("netStage").getBoundingClientRect();
        tip.style.display = "block";
        tip.style.left = (ev.clientX - box.left + 14) + "px";
        tip.style.top = (ev.clientY - box.top + 14) + "px";
        tip.innerHTML = ""; // build richer tooltip safely
        const t = document.createElement("div");
        t.className = "t";
        t.textContent = n.name;
        tip.appendChild(t);

        const rows = [
          ["Index", round1(idx)],
          ["Trust", n.it.values.Trust],
          ["Adapt", n.it.values.Adaptability],
          ["Ambig", n.it.values.Ambiguity],
          ["Esc", n.it.values.EscalationReadiness],
          ["Incent", n.it.values.SharedIncentives],
          ["Weight", n.it.weight]
        ];
        for (const [k,v] of rows){
          const r = document.createElement("div");
          r.className = "r";
          const a = document.createElement("span");
          a.textContent = k;
          const b = document.createElement("span");
          b.textContent = String(round1(v));
          r.appendChild(a); r.appendChild(b);
          tip.appendChild(r);
        }
      });
      g.addEventListener("mouseleave", ()=> tip.style.display="none");

      svg.appendChild(g);
    }
  }

  function renderDashboard(){
    // KPIs
    const kpis = $("kpis");
    kpis.innerHTML = "";

    const indices = state.interfaces.map(it => maturityIndex(it.values));
    const avgIdx = avg(indices);
    const avgTrust = avg(state.interfaces.map(it=>it.values.Trust));
    const hiAmb = state.interfaces.filter(it=>it.values.Ambiguity > state.config.frictionAmbiguityThreshold).length;
    const lowEsc = state.interfaces.filter(it=>it.values.EscalationReadiness < state.config.safetyEscalationThreshold).length;

    const cards = [
      { k: "Average maturity", v: round0(avgIdx) },
      { k: "Average trust", v: round0(avgTrust) },
      { k: `High ambiguity (A>${state.config.frictionAmbiguityThreshold})`, v: hiAmb },
      { k: `Low escalation (E<${state.config.safetyEscalationThreshold})`, v: lowEsc }
    ];
    for (const c of cards){
      const el = document.createElement("div");
      el.className = "kpi";
      const k = document.createElement("div");
      k.className = "k";
      k.textContent = c.k;
      const v = document.createElement("div");
      v.className = "v";
      v.textContent = String(c.v);
      el.appendChild(k); el.appendChild(v);
      kpis.appendChild(el);
    }

    // Bar chart
    drawBars($("barCanvas"), state.interfaces.map(it => ({
      label: it.name,
      value: maturityIndex(it.values)
    })));

    // Trend chart
    drawTrend($("trendCanvas"), state.globalHistory.avgMaturity);

    // Demo notes
    const notes = [
      `• “Notice how a single nudge creates local coupling (within the interface) AND spillover to other interfaces that share a party.”`,
      `• “Ambiguity acts like friction: once A>${state.config.frictionAmbiguityThreshold}, beneficial spillover changes get damped.”`,
      `• “If escalation readiness collapses while ambiguity is high, the threshold penalty hits trust & adaptability: quiet + murky = rot.”`,
      `• “The weight term makes ‘big’ interfaces harder to move with spillover—so the same behaviour shift has different reach.”`,
      `• “In SharpCloud terms: these are Stories with Attributes + Relationships; the matrix and network are just two projections.”`
    ];
    $("demoNotes").textContent = notes.join("\n");
    $("chartValues").textContent=state.interfaces.map(it=>`${it.name}: index ${round1(maturityIndex(it.values))}; Trust history ${it.history.Trust.join(", ")}`).join("\n")+"\nAverage index by step (recent window): "+state.globalHistory.avgMaturity.map(round1).join(", ");
  }

  function drawBars(canvas, series){
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);

    // background
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0,0,w,h);

    const padL=140, padR=20, padT=24, padB=36;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;

    // axis
    ctx.strokeStyle = "rgba(49,87,63,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT+innerH);
    ctx.lineTo(padL+innerW, padT+innerH);
    ctx.stroke();

    // grid + labels (0..100)
    ctx.fillStyle = "rgba(49,87,63,0.7)";
    ctx.font = "12px " + getComputedStyle(document.body).fontFamily;
    for (let t=0; t<=100; t+=25){
      const x = padL + innerW*(t/100);
      ctx.strokeStyle = "rgba(49,87,63,0.12)";
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT+innerH);
      ctx.stroke();
      ctx.fillText(String(t), x-8, padT+innerH+22);
    }

    const barH = innerH / Math.max(1, series.length);
    series.forEach((s, i) => {
      const y = padT + i*barH + 8;
      const bh = barH - 16;

      // label
      ctx.fillStyle = "rgba(31,65,48,0.92)";
      ctx.font = "12px " + getComputedStyle(document.body).fontFamily;
      ctx.fillText(s.label, 12, y+bh*0.72);

      // bar
      const val = clamp100(s.value);
      const bw = innerW * (val/100);
      ctx.fillStyle = "rgba(55,110,73,0.55)";
      ctx.fillRect(padL, y, bw, bh);

      // value
      ctx.fillStyle = "rgba(31,65,48,0.92)";
      ctx.font = "bold 12px " + getComputedStyle(document.body).fontFamily;
      ctx.fillText(String(round0(val)), padL + bw + 8, y+bh*0.72);
    });
  }

  function drawTrend(canvas, series){
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);

    const pad=24, padB=34;
    const innerW = w - pad*2;
    const innerH = h - pad - padB;

    // axis
    ctx.strokeStyle = "rgba(49,87,63,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, pad+innerH);
    ctx.lineTo(pad+innerW, pad+innerH);
    ctx.stroke();

    if (!series || series.length < 2) return;

    // line
    ctx.strokeStyle = "rgba(107,255,176,0.72)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const n = series.length;
    for (let i=0; i<n; i++){
      const x = pad + innerW*(i/(n-1));
      const y = pad + innerH*(1 - clamp01(series[i]/100));
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();

    // last point
    const last = series[n-1];
    const lx = pad + innerW;
    const ly = pad + innerH*(1 - clamp01(last/100));
    ctx.fillStyle = "rgba(31,65,48,0.95)";
    ctx.beginPath();
    ctx.arc(lx,ly,3.2,0,Math.PI*2);
    ctx.fill();

    // label
    ctx.fillStyle = "rgba(49,87,63,0.85)";
    ctx.font = "12px " + getComputedStyle(document.body).fontFamily;
    ctx.fillText("Avg index", pad, 16);
    ctx.fillText(String(round0(last)), lx-18, ly-10);
  }

  function generateExportPack(){
    // Conceptual SharpCloud-like pack: Stories + attributes + relationships
    const now = new Date().toISOString();

    const attributeDefinitions = VARS.map(v => ({
      key: v.key,
      label: v.label,
      type: "number",
      min: 0,
      max: 100,
      note: v.tip
    })).concat([
      { key: "Weight", label: "Weight", type: "number", min: 0, max: 10, note: "Interface importance / inertia." },
      { key: "Owner", label: "Owner", type: "text", note: "Accountable owner." },
      { key: "Tag", label: "Tag", type: "text", note: "Workstream tag." }
    ]);

    const stories = state.interfaces.map(it => ({
      id: it.id,
      title: it.name,
      tags: [
        `Tag:${it.tag}`,
        `Owner:${it.owner}`,
        ...it.parties.map(p=>`Party:${p}`)
      ],
      attributes: {
        ...it.values,
        Weight: it.weight,
        Owner: it.owner,
        Tag: it.tag
      },
      description: `Interface between ${it.parties.join(" and ")}.`
    }));

    const relationships = [];
    for (let i=0;i<state.interfaces.length;i++){
      for (let j=i+1;j<state.interfaces.length;j++){
        const a = state.interfaces[i];
        const b = state.interfaces[j];
        const shared = sharedParties(a,b);
        const strong = shared.length > 0;

        const coeffAtoB = spilloverCoeff(a,b).coeff;
        const coeffBtoA = spilloverCoeff(b,a).coeff;

        relationships.push({
          from: a.id,
          to: b.id,
          type: strong ? "shared_party" : "weak_tie",
          label: strong ? `Shared: ${shared.join(", ")}` : "No shared party",
          strength_hint: Number(Math.max(coeffAtoB, coeffBtoA).toFixed(4)),
          coefficient_from_to: Number(coeffAtoB.toFixed(4)),
          coefficient_to_from: Number(coeffBtoA.toFixed(4)),
          note: strong
            ? "Spillover uses strong coefficient (then weight-damped if receiver heavier)."
            : "Optional weak tie spillover."
        });
      }
    }

    const pack = {
      meta: {
        tool: "Interface Maturity Simulator",
        generatedAt: now,
        step: state.step,
        notes: [
          "This is NOT an official SharpCloud API format.",
          "It mirrors a typical Story + Attribute + Relationship structure for import/mapping."
        ]
      },
      modelConfig: deepCopy(state.config),
      attributeDefinitions,
      stories,
      relationships
    };

    return JSON.stringify(pack, null, 2);
  }

  function generateCSV(){
    const cols = [
      "Interface","PartyA","PartyB","Owner","Tag","Weight",
      ...VARS.map(v=>v.key),
      "MaturityIndex"
    ];
    const lines = [cols.join(",")];

    for (const it of state.interfaces){
      const row = [
        it.name,
        it.parties[0] || "",
        it.parties[1] || "",
        it.owner,
        it.tag,
        it.weight,
        ...VARS.map(v => round1(it.values[v.key])),
        round1(maturityIndex(it.values))
      ].map(x => {
        let s = String(x);
        if(typeof x === "string" && /^[\s]*[=+@-]/.test(s))s="'"+s;
        // CSV escape
        return /[",\r\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
      });
      lines.push(row.join(","));
    }
    return lines.join("\n");
  }

  function renderMapping(){
    $("jsonOut").value = generateExportPack();
    $("csvOut").value = generateCSV();
  }

  function renderAll(){
    if(typeof document === "undefined") return;
    renderHeaderPills();
    renderSelects();
    renderMatrix();
    renderNetwork();
    renderDashboard();
    renderMapping();
    syncControlsToSelection(false);
  }

  function syncControlsToSelection(updateDeltaField = true){
    const sel = state.selected;
    $("ifaceSel").value = sel.ifaceId;
    $("varSel").value = sel.varKey;

    // Update delta field to something sensible:
    // If mode is set, show current value. If delta, keep user chosen unless asked.
    const mode = $("modeSel").value;
    const iface = state.interfaces.find(x=>x.id===sel.ifaceId);
    if (!iface) return;

    $("selPill").textContent = `${iface.name} · ${sel.varKey}`;

    if (!updateDeltaField) return;

    if (mode === "set"){
      $("deltaNum").value = String(round0(iface.values[sel.varKey]));
      $("deltaRange").min="0";$("deltaRange").max="100";$("deltaRange").value = String(iface.values[sel.varKey]);
    } else {
      $("deltaRange").min="-30";$("deltaRange").max="30";
    }
  }

  /* ---------- Logging ---------- */
  function writeLog(info){
    if(typeof document === "undefined") return;
    const lines = [];
    lines.push(`Action #${state.step}`);
    lines.push(`Nudge: ${info.ifaceName} · ${info.varKey}`);
    lines.push(`Mode: ${info.mode} | Input: ${info.input} | Effective Δ: ${formatDelta(info.userDelta)}`);
    lines.push("");
    lines.push("Local coupling (total deltas on the chosen interface):");
    for (const v of VARS){
      const k = v.key;
      const d = info.localTotal[k];
      if (Math.abs(d) > 0.05) lines.push(`  - ${k}: ${formatDelta(d)}`);
    }

    lines.push("");
    lines.push(`Local ripple waves (iterations=${state.config.localIterations}):`);
    for (const w of info.waves){
      const parts = [];
      for (const v of VARS){
        const dv = round1(w.frontier[v.key]);
        if (Math.abs(dv) > 0.05){
          parts.push(`${v.key}:${formatDelta(dv)}`);
        }
      }
      lines.push(`  iter ${w.iter}: ${parts.length ? parts.join("  ") : "—"}`);
    }

    lines.push("");
    lines.push("Spillovers (to other interfaces):");
    for (const s of info.spillNotes){
      const tag = s.strong ? "shared party" : "weak tie";
      const fr = s.frictionApplied ? " | friction cap" : "";
      lines.push(`  → ${s.to} (${tag}, coeff≈${s.coeff}${fr})`);
      const dparts = [];
      for (const v of VARS){
        const dv = s.spill[v.key];
        if (Math.abs(dv) > 0.05) dparts.push(`${v.key}:${formatDelta(dv)}`);
      }
      lines.push(`     ${dparts.length ? dparts.join("  ") : "—"}`);
    }

    lines.push("");
    if (info.safetyHits.length){
      lines.push(`Threshold penalty triggered on: ${info.safetyHits.join(", ")}`);
      lines.push(`  Condition: Escalation < ${state.config.safetyEscalationThreshold} AND Ambiguity > ${state.config.safetyAmbiguityThreshold}`);
      lines.push(`  Penalty: −${state.config.safetyPenalty} Trust and −${state.config.safetyPenalty} Adaptability`);
    } else {
      lines.push("Threshold penalty: none");
    }

    $("log").textContent = lines.join("\n");
  }

  /* ---------- UI wiring ---------- */
  function wireTabs(){
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const id = tab.dataset.tab;
        document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
        $(id).classList.add("active");
      });
    });
  }

  function wireControls(){
    $("ifaceSel").addEventListener("change", (e) => {
      state.selected.ifaceId = e.target.value;
      syncControlsToSelection(true);
      renderAll();
    });

    $("varSel").addEventListener("change", (e) => {
      state.selected.varKey = e.target.value;
      syncControlsToSelection(true);
      renderAll();
    });

    $("modeSel").addEventListener("change", () => {
      syncControlsToSelection(true);
    });

    // Link number + slider
    $("deltaRange").addEventListener("input", (e) => {
      $("deltaNum").value = e.target.value;
    });
    $("deltaNum").addEventListener("input", (e) => {
      if ($("modeSel").value === "delta"){
        const v = Number(e.target.value);
        if (!Number.isNaN(v)) $("deltaRange").value = String(Math.max(-30, Math.min(30, v)));
      }
    });

    $("applyBtn").addEventListener("click", () => {
      const ifaceId = $("ifaceSel").value;
      const varKey = $("varSel").value;
      const mode = $("modeSel").value;
      const val = Number($("deltaNum").value);
      try {
        if(!$("deltaNum").value.trim())throw new Error("Enter an action value.");
        const changed=runAction({ ifaceId, varKey, mode, value: val });
        if(changed===false)$("log").textContent="No change requested; no step or penalty applied.";
      }catch(err){$("log").textContent=err.message;}
    });

    $("undoBtn").addEventListener("click", () => {
      if (!state.undoStack.length) return;
      const snap = state.undoStack.pop();
      restore(snap);
      renderAll();
      $("log").textContent = "Undo applied.";
    });

    $("resetBtn").addEventListener("click", () => {
      reset();
      primeKnobInputsFromConfig();
      // refresh controls
      $("modeSel").value = "delta";
      $("deltaNum").value = "10";
      $("deltaRange").value = "10";
      renderAll();
      $("log").textContent = "Reset to baseline.";
    });

    $("scenarioBtn").addEventListener("click", () => {
      const kind = $("scenarioSel").value;
      if (!kind) return;
      runScenario(kind);
    });

    $("showWeak").addEventListener("change", () => {
      renderNetwork();
    });

    // Mapping buttons
    $("copyJsonBtn").addEventListener("click", () => safeClipboardWrite($("jsonOut").value));
    $("downloadJsonBtn").addEventListener("click", () => downloadText("sharpcloud-mapping-pack.json", $("jsonOut").value));
    $("copyCsvBtn").addEventListener("click", () => safeClipboardWrite($("csvOut").value));
    $("downloadCsvBtn").addEventListener("click", () => downloadText("interface-maturity.csv", $("csvOut").value));

    $("exportStateBtn").addEventListener("click", () => {
      const payload = JSON.stringify({
        step: state.step,
        interfaces: state.interfaces,
        globalHistory: state.globalHistory,
        selected: state.selected,
        config: state.config
      }, null, 2);
      $("stateIO").value = payload;
    });

    $("loadStateBtn").addEventListener("click", () => {
      try{
        const obj = JSON.parse($("stateIO").value);
        loadState(obj);
        renderAll();
        $("log").textContent = "State loaded.";
      } catch(err){
        $("log").textContent = "Load failed: " + err.message;
      }
    });

    // Knobs
    $("iterRange").addEventListener("input", (e) => {
      $("iterNum").value = e.target.value;
    });
    $("iterNum").addEventListener("input", (e) => {
      const v = Math.max(1, Math.min(10, Number(e.target.value)));
      if (!Number.isNaN(v)) $("iterRange").value = String(v);
    });

    $("applyKnobsBtn").addEventListener("click", () => {
      try {
      const cfg = deepCopy(state.config);
      const ids=["iterNum","spillStrong","spillWeak","fricThresh","fricFactor","svEsc","svAmb","svPen","c_am_t","c_am_e","c_t_ad","c_t_s","c_s_am"];
      if(ids.some(id=>!$(id).value.trim()))throw new Error("Complete each model assumption before applying.");
      cfg.localIterations = Number($("iterNum").value);
      cfg.spilloverStrong = Number($("spillStrong").value);
      cfg.spilloverWeak = Number($("spillWeak").value);
      cfg.frictionAmbiguityThreshold = Number($("fricThresh").value);
      cfg.frictionPositiveFactor = Number($("fricFactor").value);
      cfg.safetyEscalationThreshold = Number($("svEsc").value);
      cfg.safetyAmbiguityThreshold = Number($("svAmb").value);
      cfg.safetyPenalty = Number($("svPen").value);

      // Edge coeffs
      const c_am_t = Number($("c_am_t").value);
      const c_am_e = Number($("c_am_e").value);
      const c_t_ad = Number($("c_t_ad").value);
      const c_t_s  = Number($("c_t_s").value);
      const c_s_am = Number($("c_s_am").value);

      cfg.localCouplingEdges = [
        { from: "Ambiguity", to: "Trust", coeff: c_am_t },
        { from: "Ambiguity", to: "EscalationReadiness", coeff: c_am_e },
        { from: "Trust", to: "Adaptability", coeff: c_t_ad },
        { from: "Trust", to: "SharedIncentives", coeff: c_t_s },
        { from: "SharedIncentives", to: "Ambiguity", coeff: c_s_am }
      ];

      const checkedConfig=validateConfig(cfg);
      state.undoStack.push(snapshot());
      state.config=checkedConfig;
      renderAll();
      $("log").textContent = "Model assumptions applied.";
      } catch(err){$("log").textContent=err.message;}
    });
  }

  function primeKnobInputsFromConfig(){
    const cfg = state.config;
    $("iterRange").value = String(cfg.localIterations);
    $("iterNum").value = String(cfg.localIterations);
    $("spillStrong").value = String(cfg.spilloverStrong);
    $("spillWeak").value = String(cfg.spilloverWeak);
    $("fricThresh").value = String(cfg.frictionAmbiguityThreshold);
    $("fricFactor").value = String(cfg.frictionPositiveFactor);
    $("svEsc").value = String(cfg.safetyEscalationThreshold);
    $("svAmb").value = String(cfg.safetyAmbiguityThreshold);
    $("svPen").value = String(cfg.safetyPenalty);

    // edges
    const findEdge = (from,to) => cfg.localCouplingEdges.find(e=>e.from===from && e.to===to)?.coeff ?? 0;
    $("c_am_t").value = String(findEdge("Ambiguity","Trust"));
    $("c_am_e").value = String(findEdge("Ambiguity","EscalationReadiness"));
    $("c_t_ad").value = String(findEdge("Trust","Adaptability"));
    $("c_t_s").value  = String(findEdge("Trust","SharedIncentives"));
    $("c_s_am").value = String(findEdge("SharedIncentives","Ambiguity"));
  }

  /* ---------- Boot ---------- */
  function boot(){
    wireTabs();
    wireControls();
    primeKnobInputsFromConfig();
    renderAll();

    // prefill selection
    syncControlsToSelection(true);

    // small keyboard sugar: Enter applies
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (document.activeElement === $("deltaNum") || document.activeElement === $("deltaRange"))){
        $("applyBtn").click();
      }
    });
  }
  if(typeof module!=="undefined" && module.exports)module.exports={VARS,DEFAULT_CONFIG,state,reset,snapshot,restore,runAction,runScenario,computeLocalDeltas,maturityIndex,spilloverCoeff,validateConfig,validateState,loadState,generateExportPack,generateCSV};
  if(typeof document!=="undefined")boot();
})();
