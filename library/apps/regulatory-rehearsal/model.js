/* Exact coalition attribution plus explicitly hypothetical consent and group-payoff models. */
(function(root,factory){if(typeof module==='object' && module.exports) module.exports=factory(require('./data.js'));else root.Rehearsal=factory(root.RehearsalData);})(typeof globalThis!=='undefined'?globalThis:this,function(initialState){
'use strict';
const MODEL_VERSION='regulatory-rehearsal-2.0';
const STORAGE_KEY='regulatory-rehearsal.v2';
const clone=x=>JSON.parse(JSON.stringify(x));
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const constants={baseOutcomes:[.46,.42,.43,.45],referencePoint:[.20,.20,.20,.20],hypervolumeFloor:.005,nonnegativeCoalitionWorth:true,consentIterations:34,consentInitial:.52,consentDamping:.38,timelineSteps:12,reputationRetention:.84,reputationReward:.30,reputationLoss:-.12,surpriseMultiplier:.55,coreTolerance:1e-10,assuranceGroup:['ONR','EA','Local Councils','Insurers'],pressures:{safety:{base:1,on:-.08,off:.06},environment:{base:.78,public:.45,ea:.35,risk:.20},funding:{base:1,on:-.10,off:.04},liability:{base:.88,risk:.50,insurers:.35,cap:.15},community:{base:1,on:-.12,off:.08},schedule:{base:1,on:-.05,off:.07}},clauseScoring:{activeLever:1,topPressure:2,pivotalOwner:1,highlightThreshold:2},splitMidpoint:.5,indexMidpoint:.5,zeroAttributionTolerance:1e-12};
const labels=['risk control','schedule confidence','cost certainty','public confidence'];
const clamp01=x=>Math.max(0,Math.min(1,x));
const pct=(x,dec=0)=>(100*x).toFixed(dec)+'%';
function exactShapley(names,values){
 if(!Array.isArray(names)||names.length<1||names.length>10||new Set(names).size!==names.length) throw new Error('Use 1–10 distinct parties.');
 const n=names.length;
 if(values.length!==2**n||values.some(v=>!Number.isFinite(v))||values[0]!==0) throw new Error('Supply a finite worth for every coalition, including zero for the empty coalition.');
 const fact=[1];for(let i=1;i<=n;i++)fact[i]=fact[i-1]*i;
 const phi={};names.forEach((name,i)=>{let v=0;for(let m=0;m<2**n;m++){if(m&(1<<i))continue;let k=0;for(let x=m;x;x>>=1)k+=x&1;v+=fact[k]*fact[n-k-1]/fact[n]*(values[m|(1<<i)]-values[m]);}phi[name]=v;});
 const grand=values.at(-1),sum=Object.values(phi).reduce((a,b)=>a+b,0);
 const shares=Object.fromEntries(names.map(n=>[n,grand!==0?phi[n]/grand:0]));
 return {phi,shares,grand,sum,efficiencyResidual:sum-grand};
}
function coreCheck(names,values,allocation,tolerance=constants.coreTolerance){
 if(!Number.isFinite(tolerance)||tolerance<0)throw new Error('Invalid core tolerance.');
 exactShapley(names,values);
 if(allocation.length!==names.length||allocation.some(x=>!Number.isFinite(x)))throw new Error('Invalid allocation.');
 const efficiencyResidual=allocation.reduce((a,b)=>a+b,0)-values.at(-1);
 const rows=values.map((value,mask)=>{const members=names.filter((_,i)=>mask&(1<<i));const allocated=allocation.reduce((sum,x,i)=>sum+((mask&(1<<i))?x:0),0);return {mask,names:members,value,allocated,shortfall:value-allocated};});
 const worst=rows.reduce((a,b)=>b.shortfall>a.shortfall?b:a,rows[0]);
 return {inCore:Math.abs(efficiencyResidual)<=tolerance&&worst.shortfall<=tolerance,efficiencyResidual,maxShortfall:Math.max(0,worst.shortfall),worst,blockingCoalitions:rows.filter(r=>r.shortfall>tolerance),tolerance};
}
function splitStability(assurance,delivery,utilities,platformEffect,epsilon){
 const names=[...assurance,...delivery];
 if(new Set(names).size!==names.length||!names.length||names.some(n=>!Number.isFinite(utilities[n]))||!Number.isFinite(platformEffect)||platformEffect<0||!Number.isFinite(epsilon)||epsilon<0)throw new Error('Invalid split parameters.');
 const avg=a=>a.length?a.reduce((s,n)=>s+utilities[n],0)/a.length:.5;
 const moves=names.map(name=>{const inA=assurance.includes(name),own=inA?assurance:delivery,other=inA?delivery:assurance;
 const stay=utilities[name]+platformEffect*(avg(own)-constants.splitMidpoint);
 const move=utilities[name]+platformEffect*(avg(other)-constants.splitMidpoint);
 return {name,to:inA?'delivery':'assurance',stay,move,gain:move-stay};});
 const maxGain=Math.max(0,...moves.map(m=>m.gain)),slack=epsilon-maxGain;
 return {assurance,delivery,platformA:avg(assurance),platformB:avg(delivery),moves:moves.filter(m=>m.gain>epsilon),allMoves:moves,maxGain,slack,status:maxGain>epsilon?'Unstable':maxGain>epsilon/2?'At risk':'Stable'};
}
function create(input=initialState){
 const state=validateState(input);const baseOutcomes=constants.baseOutcomes,refPoint=constants.referencePoint;
    function activeLeverObjects(activeIds=state.scenario.activeLevers){
      return state.levers.filter(l => activeIds.includes(l.id));
    }
    function selectedSequence(){
      return state.sequences.find(s => s.id === state.scenario.selectedSequence) || state.sequences[0];
    }
    function sortedPair(a,b){ return [a,b].sort().join("+"); }
    function vectorAdd(a,b){ return a.map((x,i)=>x + b[i]); }
    function dot(a,b){ return a.reduce((s,x,i)=>s + x*b[i],0); }
    function logistic(x){ return x >= 0 ? 1/(1+Math.exp(-x)) : Math.exp(x)/(1+Math.exp(x)); }
    function normalise(w){
      const total = w.reduce((s,x)=>s + Math.max(0, +x || 0),0);
      if(total <= 0) return [.25,.25,.25,.25];
      return w.map(x => Math.max(0,+x || 0) / total);
    }

    function outcomesForOwners(ownerSet, activeIds=state.scenario.activeLevers, includeSequence=true){
      let out = baseOutcomes.slice();
      const included = state.levers.filter(l => activeIds.includes(l.id) && ownerSet.has(l.owner));
      included.forEach(l => { out = vectorAdd(out, l.effect); });
      for(let i=0;i<included.length;i++){
        for(let j=i+1;j<included.length;j++){
          const effect = state.synergies[sortedPair(included[i].id, included[j].id)];
          if(effect) out = vectorAdd(out, effect);
        }
      }
      if(includeSequence) out = vectorAdd(out, selectedSequence().modifier);
      return out.map(clamp01);
    }

    function scenarioOutcomes(activeIds=state.scenario.activeLevers){
      const owners = new Set(state.parties.map(p => p.name));
      return outcomesForOwners(owners, activeIds, true);
    }

    function hypervolume(outcomes){
      return outcomes.reduce((prod,x,i)=>prod * Math.max(constants.hypervolumeFloor, x - refPoint[i]),1);
    }

    function coalitionWorth(ownerNames, activeIds=state.scenario.activeLevers){
      const ownerSet = new Set(ownerNames);
      const withCoalition = outcomesForOwners(ownerSet, activeIds, true);
      const empty = outcomesForOwners(new Set(), activeIds, true);
      return Math.max(0, hypervolume(withCoalition) - hypervolume(empty));
    }

    function shapley(activeIds=state.scenario.activeLevers){
      const parties=state.parties.map(p=>p.name);
      const values=Array.from({length:1 << parties.length},(_,mask)=>coalitionWorth(parties.filter((_,i)=>mask & (1<<i)),activeIds));
      return exactShapley(parties,values);
    }
    function countBits(mask){
      let n = 0;
      while(mask){ n += mask & 1; mask >>= 1; }
      return n;
    }

    function activeCosts(){
      const costs = Object.fromEntries(state.parties.map(p => [p.name,0]));
      activeLeverObjects().forEach(l => {
        costs[l.owner] = (costs[l.owner] || 0) + (state.parties.find(p => p.name === l.owner)?.concessionCost || 0);
        Object.entries(l.cost || {}).forEach(([party,c]) => {
          costs[party] = (costs[party] || 0) + c;
        });
      });
      return costs;
    }

    function utilityForParty(p, outcomes, costs){
      const weights = normalise(p.weights);
      const aligned = dot(weights, outcomes);
      return aligned - (costs[p.name] || 0);
    }

    function consentAtReputation(reputations, outcomes){
      const costs = activeCosts();
      const utils = state.parties.map(p => utilityForParty(p, outcomes, costs));
      let probs = Array(state.parties.length).fill(constants.consentInitial);
      for(let iter=0; iter<constants.consentIterations; iter++){
        const next = probs.map((prob,i)=>{
          const p = state.parties[i];
          let networkTerm = 0;
          for(let j=0;j<state.parties.length;j++) networkTerm += state.influence[i][j] * (probs[j] - constants.indexMidpoint);
          const x = p.alpha * (utils[i] - p.threshold) + p.beta * (reputations[i] - p.baseReputation) + p.network * networkTerm;
          return logistic(x);
        });
        probs = probs.map((p,i)=>(1-constants.consentDamping)*p + constants.consentDamping*next[i]);
      }
      const mandatoryIdx = state.parties.map((p,i)=>p.mandatory ? i : -1).filter(i=>i >= 0);
      const optionalIdx = state.parties.map((p,i)=>p.mandatory ? -1 : i).filter(i=>i >= 0);
      const mandatoryProduct = mandatoryIdx.length ? mandatoryIdx.reduce((acc,i)=>acc * probs[i],1) : 1;
      const optionalQuorum = optionalIdx.length ? 1 - optionalIdx.reduce((acc,i)=>acc * (1 - probs[i]),1) : 1;
      const softAll = 1 - probs.reduce((acc,p)=>acc * (1 - p),1);
      const projectConsent = state.scenario.mandatoryGate ? mandatoryProduct * optionalQuorum : softAll;
      return {probs, projectConsent, utils};
    }

    function simulateTimeline(outcomes){
      const steps = constants.timelineSteps;
      const seq = selectedSequence();
      const surprise = state.scenario.surprisePenalty + seq.surprise;
      const reputations = state.parties.map(p => p.reputation);
      const series = {
        projectConsent:[],
        avgReputation:[],
        partyConsent:state.parties.map(p => ({name:p.name, values:[]})),
        partyReputation:state.parties.map(p => ({name:p.name, values:[]}))
      };
      let currentR = reputations.slice();
      for(let t=0;t<steps;t++){
        const consent = consentAtReputation(currentR, outcomes);
        series.projectConsent.push(consent.projectConsent);
        series.avgReputation.push(currentR.reduce((a,b)=>a+b,0) / currentR.length);
        consent.probs.forEach((p,i)=>series.partyConsent[i].values.push(p));
        currentR.forEach((r,i)=>series.partyReputation[i].values.push(r));
        currentR = currentR.map((r,i)=>{
          const party = state.parties[i];
          const earned = consent.utils[i] >= party.threshold ? constants.reputationReward : constants.reputationLoss;
          const target = clamp01(party.baseReputation + earned - constants.surpriseMultiplier*surprise);
          return clamp01(constants.reputationRetention*r + (1-constants.reputationRetention)*target);
        });
      }
      return series;
    }

    function constraints(outcomes, consent){
      const active = new Set(state.scenario.activeLevers);
      const byParty = Object.fromEntries(state.parties.map((p,i)=>[p.name, consent.probs[i]]));
      const k=constants.pressures;
      return [
        {id:"safety", name:"Safety case", severity:clamp01(k.safety.base - outcomes[0] + (active.has("inspection") ? k.safety.on : k.safety.off)), why:"Assurance depth and unresolved technical risk."},
        {id:"environment", name:"Environmental permit", severity:clamp01(k.environment.base - (k.environment.public*outcomes[3] + k.environment.ea*byParty.EA + k.environment.risk*outcomes[0])), why:"EA confidence and public acceptability."},
        {id:"funding", name:"Funding authority", severity:clamp01(k.funding.base - outcomes[2] + (active.has("costRecovery") ? k.funding.on : k.funding.off)), why:"Cost certainty and gateway release discipline."},
        {id:"liability", name:"Insurance / liability", severity:clamp01(k.liability.base - (k.liability.risk*outcomes[0] + k.liability.insurers*byParty.Insurers + (active.has("riskCap") ? k.liability.cap : 0))), why:"Residual risk must become priced obligations."},
        {id:"community", name:"Community acceptance", severity:clamp01(k.community.base - outcomes[3] + (active.has("community") ? k.community.on : k.community.off)), why:"Local councils need visible, governable benefits."},
        {id:"schedule", name:"Supply chain / schedule", severity:clamp01(k.schedule.base - outcomes[1] + (active.has("buffer") ? k.schedule.on : k.schedule.off)), why:"Delivery pressure, resequencing, and contractor capacity."}
      ].sort((a,b)=>b.severity - a.severity);
    }

    function dealPatterns(outputs){
      const binding = outputs.constraints[0];
      const pivotal = outputs.pivotalParty;
      const active = new Set(state.scenario.activeLevers);
      const patterns = [];
      const byConstraint = {
        safety:["Assurance protocol", "Create a short assurance sprint: fixed evidence pack, sample-based inspection cadence, decision clock, and escalation route for unresolved safety questions."],
        environment:["Statement of Common Ground", "Agree the environmental interpretation note, monitoring triggers, and named owner for each residual issue before the formal gate is reached."],
        funding:["Cost-recovery collar", "Use a cost collar and gateway release mechanism so extra funding is tied to verified readiness rather than broad schedule optimism."],
        liability:["Risk-transfer cap", "Set liability caps, evidence escrow, and insurability triggers so residual risk is priced rather than argued late."],
        community:["Community obligations", "Convert social value into enforceable commitments: local works, transparent governance, reporting rhythm, and benefit release conditions."],
        schedule:["Buffer and resequence", "Protect the critical path with explicit buffer burn rules, resequencing options, and incentives that do not reward unresolved assurance debt."]
      };
      patterns.push({title:byConstraint[binding.id][0], reason:"Binding constraint: " + binding.name, body:byConstraint[binding.id][1]});
      const owned = activeLeverObjects().filter(l => l.owner === pivotal.name);
      if(pivotal.name === "No attributed contributor"){
        patterns.push({title:"Inspect the worth assumptions",reason:"Zero attribution",body:"Every party has zero attributed contribution in this run. Check the active levers and the definition of worth before inferring any engagement priority."});
      } else if(owned.length){
        patterns.push({title:pivotal.name + " package", reason:"Pivotal party", body:owned[0].contract});
      } else {
        patterns.push({title:pivotal.name + " engagement", reason:"Pivotal party", body:"Run a focused bilateral: ask what evidence, obligation, or risk allocation would move their consent threshold by the next gate."});
      }
      if(!active.has("infoProtocol")){
        patterns.push({title:"Information protocol", reason:"Low-regret trust builder", body:"Add a shared issue taxonomy, response clocks, and dashboard so parties stop negotiating from different facts."});
      } else if(!active.has("community")){
        patterns.push({title:"Community package", reason:"Consent option", body:"Turn local acceptance into a governed obligation before it becomes a late-stage objection."});
      } else {
        patterns.push({title:"Replay receipt", reason:"Governance memory", body:"Commit the current package with who, why, and the exact assumptions so future changes are auditable."});
      }
      return patterns;
    }

    function synergyReadout(){
      const active = new Set(state.scenario.activeLevers);
      return Object.entries(state.synergies).map(([key,effect]) => {
        const ids = key.split("+");
        const levers = ids.map(id => state.levers.find(l => l.id === id));
        const activeCount = ids.filter(id => active.has(id)).length;
        const score = effect.reduce((sum,x)=>sum + Math.max(0,x),0);
        const strongest = effect
          .map((x,i)=>({label:labels[i], value:x}))
          .sort((a,b)=>b.value - a.value)
          .slice(0,2)
          .map(x => x.label + " +" + pct(x.value))
          .join(", ");
        return {
          key,
          ids,
          levers,
          effect,
          score,
          strongest,
          note:state.synergyNotes[key] || "This pair creates additional value beyond the two levers on their own.",
          status:activeCount === 2 ? "Active" : activeCount === 1 ? "One move away" : "Dormant",
          missing:levers.filter(l => !active.has(l.id)).map(l => l.label)
        };
      }).sort((a,b)=>{
        const rank = {Active:0, "One move away":1, Dormant:2};
        return rank[a.status] - rank[b.status] || b.score - a.score;
      });
    }

    function clauseLibraryFor(outputs){
      const active = new Set(state.scenario.activeLevers);
      const bindingId = outputs.constraints[0].id;
      return state.clauseLibrary.map(c => {
        const activeHits = c.linkedLevers.filter(id => active.has(id)).length;
        const constraintHit = c.constraints.includes(bindingId) ? constants.clauseScoring.topPressure : 0;
        const pivotalHit = c.owner === outputs.pivotalParty.name ? constants.clauseScoring.pivotalOwner : 0;
        const score = constants.clauseScoring.activeLever*activeHits + constraintHit + pivotalHit;
        const missing = c.linkedLevers.filter(id => !active.has(id)).map(id => state.levers.find(l => l.id === id)?.label || id);
        return {...c, score, missing, recommended:score >= constants.clauseScoring.highlightThreshold};
      }).sort((a,b)=>b.score - a.score || a.title.localeCompare(b.title));
    }

    function coalitionExplorer(outputs){
      const n = state.parties.length;
      const rows = [];
      for(let mask=1; mask < (1 << n); mask++){
        const members = state.parties.filter((_,i)=>mask & (1 << i));
        if(state.scenario.mandatoryGate){
          const hasMandatory = state.parties.every((p,i)=>!p.mandatory || (mask & (1 << i)));
          if(!hasMandatory) continue;
        }
        const names = members.map(p => p.name);
        const value = coalitionWorth(names);
        const out = outcomesForOwners(new Set(names), state.scenario.activeLevers, true);
        rows.push({names, value, outcomes:out});
      }
      rows.sort((a,b)=>b.value - a.value);
      return rows.slice(0, state.scenario.topK);
    }

    function stabilityReport(outcomes){
      const assurance=constants.assuranceGroup;
      const delivery=state.parties.map(p=>p.name).filter(n=>!assurance.includes(n));
      const costs=activeCosts();
      const utilities=Object.fromEntries(state.parties.map(p=>[p.name,utilityForParty(p,outcomes,costs)]));
      return splitStability(assurance,delivery,utilities,state.scenario.platformEffect,state.scenario.epsilon);
    }
    function computeOutputs(){
      const outcomes = scenarioOutcomes();
      const sh = shapley();
      const timeline = simulateTimeline(outcomes);
      const latestR = timeline.avgReputation[timeline.avgReputation.length - 1];
      const consent = consentAtReputation(state.parties.map(p => p.reputation), outcomes);
      const cons = constraints(outcomes, consent);
      const partiesByShare = state.parties.map(p => ({
        ...p,
        share:sh.shares[p.name] || 0,
        phi:sh.phi[p.name] || 0,
        consent:consent.probs[state.parties.findIndex(x=>x.name === p.name)]
      })).sort((a,b)=>b.phi - a.phi);
      const pivotalParty = partiesByShare.some(p=>Math.abs(p.phi)>constants.zeroAttributionTolerance)?partiesByShare[0]:{name:"No attributed contributor",share:0,phi:0,consent:0};
      const outputs = {
        outcomes,
        shapley:sh,
        consent,
        timeline,
        avgReputation:latestR,
        constraints:cons,
        pivotalParty,
        stability:null,
        coalitions:null,
        dealPatterns:null,
        synergies:null,
        clauses:null
      };
      outputs.stability = stabilityReport(outcomes);
      outputs.coalitions = coalitionExplorer(outputs);
      outputs.dealPatterns = dealPatterns(outputs);
      outputs.synergies = synergyReadout();
      outputs.clauses = clauseLibraryFor(outputs);
      outputs.coalitionTable = Array.from({length:1 << state.parties.length},(_,mask)=>({mask, names:state.parties.filter((_,i)=>mask & (1<<i)).map(p=>p.name), value:coalitionWorth(state.parties.filter((_,i)=>mask & (1<<i)).map(p=>p.name))}));
      outputs.core = coreCheck(state.parties.map(p=>p.name), outputs.coalitionTable.map(c=>c.value), state.parties.map(p=>sh.phi[p.name]));
      return outputs;
    }

return {compute:computeOutputs,coalitionWorth,scenarioOutcomes,consentAtReputation,stabilityReport};
}
function validateState(value){
 const fail=m=>{throw new Error(m);};
 if(!value||typeof value!=='object'||Array.isArray(value))fail('Scenario must be an object.');
 const text=(x,p,max=12000)=>{if(typeof x!=='string'||x.length>max)fail(p+' must be text of at most '+max+' characters.');};
 const number=(x,p,min=-1,max=1)=>{if(typeof x!=='number'||!Number.isFinite(x)||x<min||x>max)fail(p+' is outside '+min+'…'+max+'.');};
 const obj=(x,p,keys)=>{if(!x||typeof x!=='object'||Array.isArray(x))fail(p+' must be an object.');for(const k of Object.keys(x))if(!keys.includes(k))fail('Unknown '+p+' field: '+k);};
 const array=(x,p,n)=>{if(!Array.isArray(x)||(n!==undefined&&x.length!==n))fail(p+' has an invalid length.');};
 const vector=(x,p,min=-1,max=1)=>{array(x,p,4);x.forEach(y=>number(y,p,min,max));};
 obj(value,'scenario state',['parties','influence','levers','synergies','synergyNotes','clauseLibrary','sequences','scenario','receipts','outputs']);
 array(value.parties,'parties',7);
 const names=initialState.parties.map(p=>p.name);
 value.parties.forEach((p,i)=>{obj(p,'party',Object.keys(initialState.parties[i]));if(p.name!==names[i])fail('Keep the seven original party identities and order.');text(p.role,'role');if(typeof p.mandatory!=='boolean')fail('Gate must be true or false.');['threshold','reputation','baseReputation','network'].forEach(k=>number(p[k],k,0,1));number(p.concessionCost,'concessionCost',0,.2);number(p.alpha,'alpha',0,20);number(p.beta,'beta',0,20);vector(p.weights,'weights',0,1);});
 array(value.influence,'influence',7);value.influence.forEach(r=>{array(r,'influence row',7);r.forEach(x=>number(x,'influence',0,1));});
 array(value.levers,'levers',8);const ids=initialState.levers.map(l=>l.id);
 value.levers.forEach(l=>{obj(l,'lever',['id','label','owner','family','effect','cost','contract','explanation']);if(!ids.includes(l.id))fail('Unknown lever ID.');if(!names.includes(l.owner))fail('Unknown lever owner.');['label','family','contract','explanation'].forEach(k=>text(l[k],k));vector(l.effect,'lever effect');obj(l.cost,'lever cost',names);Object.values(l.cost).forEach(c=>number(c,'lever cost',0,1));});
 if(new Set(value.levers.map(l=>l.id)).size!==8)fail('Duplicate lever ID.');
 const pairs=Object.keys(initialState.synergies);obj(value.synergies,'synergies',pairs);if(Object.keys(value.synergies).length!==pairs.length)fail('Keep all six synergy pairs.');Object.values(value.synergies).forEach(v=>vector(v,'synergy'));
 obj(value.synergyNotes,'synergy notes',pairs);pairs.forEach(k=>text(value.synergyNotes[k],'synergy note'));
 array(value.clauseLibrary,'clause library',8);const clauseIds=initialState.clauseLibrary.map(c=>c.id);
 value.clauseLibrary.forEach(c=>{obj(c,'clause',Object.keys(initialState.clauseLibrary[0]));if(!clauseIds.includes(c.id))fail('Unknown clause ID.');if(!names.includes(c.owner))fail('Unknown clause owner.');['title','trigger','primary','fallback','redline'].forEach(k=>text(c[k],k));array(c.linkedLevers,'linked levers');if(c.linkedLevers.some(x=>!ids.includes(x)))fail('Unknown linked lever.');array(c.constraints,'constraints');if(c.constraints.some(x=>!['safety','environment','funding','liability','community','schedule'].includes(x)))fail('Unknown constraint.');});
 if(new Set(value.clauseLibrary.map(c=>c.id)).size!==8)fail('Duplicate clause ID.');
 array(value.sequences,'sequences',4);const seqIds=initialState.sequences.map(s=>s.id);
 value.sequences.forEach(s=>{obj(s,'sequence',['id','label','modifier','surprise']);if(!seqIds.includes(s.id))fail('Unknown sequence ID.');text(s.label,'sequence label');vector(s.modifier,'sequence modifier');number(s.surprise,'sequence surprise',0,1);});
 if(new Set(value.sequences.map(s=>s.id)).size!==4)fail('Duplicate sequence ID.');
 const s=value.scenario;obj(s,'parameters',Object.keys(initialState.scenario));array(s.activeLevers,'active levers');if(new Set(s.activeLevers).size!==s.activeLevers.length||s.activeLevers.some(id=>!ids.includes(id)))fail('Active levers contain duplicate or unknown IDs.');if(!seqIds.includes(s.selectedSequence))fail('Unknown selected sequence.');number(s.epsilon,'epsilon',.01,.2);number(s.platformEffect,'platform effect',0,.14);number(s.surprisePenalty,'surprise penalty',0,.16);number(s.topK,'coalition count',3,15);if(!Number.isInteger(s.topK))fail('Coalition count must be a whole number.');if(typeof s.mandatoryGate!=='boolean')fail('Mandatory gate must be true or false.');
 array(value.receipts,'receipts');if(value.receipts.length>100)fail('Keep at most 100 receipts; export a copy before starting a new scenario.');
 value.receipts.forEach(r=>{if(!r||typeof r!=='object'||Array.isArray(r))fail('Receipt must be an object.');['when','actor','event','rationale'].forEach(k=>text(r[k],'receipt '+k));if(!r.snapshot||typeof r.snapshot!=='object'||Array.isArray(r.snapshot))fail('Receipt snapshot is missing.');
 if(r.snapshot.modelVersion===MODEL_VERSION){
  if(!r.snapshot.inputs||!Array.isArray(r.snapshot.inputs.receipts)||r.snapshot.inputs.receipts.length!==0)fail('A v2 receipt needs complete inputs with no nested receipts.');
  if(canonical(r.snapshot.constants)!==canonical(constants))fail('A v2 receipt has missing or changed constants.');
  const inputs=validateState(r.snapshot.inputs);
  if(canonical(create(inputs).compute())!==canonical(r.snapshot.outputs))fail('A v2 receipt has missing, altered or non-reproducible results.');
 }});
 const inspect=(x,depth=0)=>{if(depth>35)fail('Import is too deeply nested.');if(typeof x==='number'&&!Number.isFinite(x))fail('Non-finite number.');if(x&&typeof x==='object')for(const [k,v]of Object.entries(x)){if(['__proto__','constructor','prototype'].includes(k))fail('Unsupported object key.');inspect(v,depth+1);}};inspect(value);
 if(JSON.stringify(value).length>12000000)fail('Scenario exceeds the 12 MB limit.');
 return clone(value);
}
function importScenario(input){
 if(typeof input==='string'){if(input.length>12000000)throw new Error('Scenario exceeds the 12 MB limit.');input=JSON.parse(input);}
 if(input?.version&&!['rehearsal-board-v1','rehearsal-board-v2'].includes(input.version))throw new Error('Unsupported export version.');
 if(input?.modelVersion&&input.modelVersion!==MODEL_VERSION)throw new Error('Unsupported model version.');
 if(input?.constants&&canonical(input.constants)!==canonical(constants))throw new Error('Model constants differ; use the matching model version.');
 return validateState(input?.state??input);
}
function snapshot(state,when=new Date().toISOString()){
 const valid=validateState(state);
 return {version:'rehearsal-board-v2',modelVersion:MODEL_VERSION,exportedAt:when,constants:clone(constants),state:valid,outputs:create(valid).compute()};
}
function receipt(state,actor,event,rationale,when=new Date().toISOString()){
 const inputs=validateState(state);inputs.receipts=[];delete inputs.outputs;
 return {when,actor:actor.trim()||'Project team',event:event.trim()||'Scenario update',rationale:rationale.trim()||'No rationale recorded.',snapshot:{modelVersion:MODEL_VERSION,constants:clone(constants),inputs,outputs:create(inputs).compute()}};
}
function replayReceipt(r){
 if(r?.snapshot?.modelVersion!==MODEL_VERSION||!r.snapshot.inputs)throw new Error('Legacy or unsupported receipt: its complete inputs cannot be replayed with this model.');
 if(canonical(r.snapshot.constants)!==canonical(constants))throw new Error('Receipt constants do not match this model.');
 const outputs=create(r.snapshot.inputs).compute();
 return {matches:canonical(outputs)===canonical(r.snapshot.outputs),outputs};
}
return {MODEL_VERSION,STORAGE_KEY,constants,labels,initialState,clone,create,exactShapley,coreCheck,splitStability,validateState,importScenario,snapshot,receipt,replayReceipt};
});
