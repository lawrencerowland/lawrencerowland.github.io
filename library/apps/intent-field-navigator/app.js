
    // ------------------------ Utilities ------------------------
    const State = {
      baselineWeights: [], learningApplied: false,
      intents: [],      // [{intent_id, name, description, tags[], target_weight, active}]
      items: [],        // [{item_id, title, description, tags[], type, status, squad, effort, url}]
      outcomes: [],     // [{item_id, outcome, lead_time, defect_rate, realized_intent}]
      vocab: new Map(), // token -> index
      idf: [],          // array
      vecIntents: Object.create(null),   // intent_id -> Float64Array
      vecItems: Object.create(null),     // item_id -> Float64Array
      sim: [],          // 2D [i][j] = similarity item i to intent j
      probs: [],        // 2D [i][j] normalized "pull" per item across intents
      coverage: Object.create(null),     // intent_id -> coverage (weighted by effort)
      gaps: Object.create(null),         // intent_id -> delta (actual - target)
      totals: { items:0, efforts:0, intents:0 },
      charts: { coverage:null, gap:null, entropy:null },
      params: { topK:3, epsilon:0.08, tagBoost:1.30, eta:0.10 },
      sliders: Object.create(null),      // intent_id -> slider DOM
      lastExport: { align:[], matches:[], nudges:[], coverage:[], edges:[] }
    };

    const STOP = new Set(("a,an,the,and,or,of,for,to,from,with,into,at,by,on,be,is,are,was,were,as,that,this,these,those,it,its,in,out,over,under,up,down,not,no,yes,if,then,else,when,while,which,who,whom,whose,can,could,should,would,may,might,will,just,than,so,such,via,per,each,any,all,more,most,less,least,also,about,across,among,between,within,without,against,after,before,above,below".split(",")));
    const EXPLAINERS = {
      overview:{title:"Read the comparison",body:"<p>Text and tags create normalised lexical allocation weights between work items and active intents. Effort-weighted shares are compared with your editable targets. No-match work remains unallocated.</p><p>Start with the demo, inspect the words behind a close match, then adjust a target share. Similar wording is a prompt for review, not evidence of value or delivery alignment.</p>"},
      architecture:{title:"Original architecture hypothesis",body:"<p>The original proposal imagined an intent codex, live work harvesting, embeddings, a graph field solver and a feedback loop. GitHub/Jira/Notion integration, version-controlled strategy and continuous steering remain future possibilities.</p><p>This app implements local CSV input, TF-IDF/cosine plus tag overlap, a coverage comparison, and transparent heuristics. The bipartite edge export lets you inspect item-to-intent allocations.</p>"},
      value:{title:"What a team could discuss",body:"<p>Compare where the wording of a backlog appears concentrated with the shares a team says it wants. Check ambiguous or unmatched work before treating a coverage gap as a real strategic gap. Text, tags, effort estimates and target shares are assumptions.</p><p>The original capital-allocation and adaptive-strategy ideas are hypotheses; this app does not recommend validated investments or verify outcomes.</p>"},
      improvements:{title:"Calculations and limits",body:"<ul><li>Positive retained cosine/tag scores are exponentiated and normalised using softmax, retaining boundary ties. Zero evidence stays unmatched.</li><li>Coverage is allocated effort divided by all effort. Gaps are differences in share; no KL divergence is computed.</li><li>Entropy describes allocation spread for matched work; unmatched work has no allocation distribution and is N/A, excluded from the histogram and ranking. Roughness averages squared differences between each item's top weight and target shares across its edges; it is a diagnostic proxy.</li><li>Each candidate move transfers an explicit fraction of one item's weight, capped by that item's mass and the two gaps. Candidates are alternatives, not a minimal or jointly feasible set.</li><li>The optional outcome-score heuristic changes targets once per reset. Reset restores the originally loaded target shares. It is not a bandit or reinforcement-learning implementation.</li></ul>"}
    };
    const escapeHTML=value=>String(value??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function status(message){if(typeof document!=="undefined")document.getElementById('status').textContent=message;}
    function csvText(rows, spreadsheetSafe=false){return rows.map(row=>row.map(value=>{let s=String(value??"");if(spreadsheetSafe&&typeof value==='string'&&/^[\s]*[=+@-]/.test(s)&&!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?$/i.test(s.trim()))s="'"+s;return /[,"\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}).join(',')).join('\r\n');}
    function parseCSV(text){
      if(typeof text!=="string"||text.length>5000000)throw new Error("CSV must be text under 5 MB.");
      text=text.replace(/^\uFEFF/,'');const rows=[];let row=[],field='',quoted=false,closed=false;
      const push=()=>{row.push(field);field='';closed=false;};
      for(let i=0;i<text.length;i++){const c=text[i];if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else field+=c;}else if(c==='"'){if(field||closed)throw new Error("Unexpected quote in CSV.");quoted=true;}else if(c===','){push();}else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;push();if(row.some(x=>x.trim()))rows.push(row);row=[];}else{if(closed)throw new Error("Unexpected text after a quoted CSV field.");field+=c;}}
      if(quoted)throw new Error("Unclosed quote in CSV.");push();if(row.some(x=>x.trim()))rows.push(row);if(!rows.length)throw new Error("CSV is empty.");
      const headers=rows.shift().map(x=>x.trim());if(headers.some(x=>!x)||new Set(headers).size!==headers.length)throw new Error("CSV headers must be unique and nonempty.");
      if(rows.length>2000)throw new Error("Use at most 2,000 rows in this teaching example.");
      const records=rows.map((r,i)=>{if(r.length!==headers.length)throw new Error(`CSV row ${i+2} has ${r.length} fields; expected ${headers.length}. Quote commas inside a field.`);return Object.fromEntries(headers.map((h,j)=>[h,r[j]]));});
      Object.defineProperty(records,'headers',{value:headers});return records;
    }
    function prepareData(intentRows,itemRows,outcomeRows=[]){
      const requireHeaders=(rows,required,label)=>{const keys=rows.headers??Object.keys(rows[0]??{});for(const key of required)if(!keys.includes(key))throw new Error(`${label} needs a ${key} column.`);};
      requireHeaders(intentRows,['intent_id','name'],'Intents');requireHeaders(itemRows,['item_id','title'],'Work items');if(outcomeRows.length)requireHeaders(outcomeRows,['item_id'],'Outcomes');
      const number=(raw,fallback,label)=>{if(raw==null||String(raw).trim()==='')return fallback;const n=Number(raw);if(!Number.isFinite(n)||n<0||n>1e12)throw new Error(`${label} must be a finite number from 0 to 1 trillion in this teaching example.`);return n;};
      const ids=new Set(), workIds=new Set(), outcomeIds=new Set();const id=(raw,set,label)=>{const value=String(raw??'').trim();if(!value||value.length>200||set.has(value))throw new Error(`${label} must have unique, nonempty IDs (at most 200 characters).`);set.add(value);return value;};
      const intents=intentRows.map(r=>{const active=String(r.active??'1').trim().toLowerCase();if(!['','1','true','yes','0','false','no'].includes(active))throw new Error('Active must be 1/0 or true/false.');return {intent_id:id(r.intent_id,ids,'Intents'),name:String(r.name||r.intent_id),description:String(r.description??''),tags:parseTags(String(r.tags??'')),target_weight:number(r.target_weight,NaN,'Target weight'),active:!['0','false','no'].includes(active)};});
      const active=intents.filter(x=>x.active);if(!active.length||active.length>30)throw new Error('Use between 1 and 30 active intents.');const known=active.filter(x=>Number.isFinite(x.target_weight));if(known.length&&known.length!==active.length)throw new Error('Supply every active target weight or leave all of them blank.');let sum=known.reduce((a,x)=>a+x.target_weight,0);if(!Number.isFinite(sum))throw new Error('Target weights are too large.');for(const it of active)it.target_weight=sum>0?it.target_weight/sum:1/active.length;
      const items=itemRows.map(r=>({item_id:id(r.item_id,workIds,'Work items'),title:String(r.title??''),description:String(r.description??''),tags:parseTags(String(r.tags??'')),type:String(r.type??''),status:String(r.status??''),squad:String(r.squad??''),effort:number(r.effort,1,'Effort'),url:String(r.url??'')}));if(!items.length)throw new Error('At least one work item is needed.');if(!Number.isFinite(items.reduce((s,x)=>s+x.effort,0)))throw new Error('Total effort is too large.');
      const outcomes=outcomeRows.map(r=>{const item_id=id(r.item_id,outcomeIds,'Outcomes');if(!workIds.has(item_id))throw new Error(`Outcome ${item_id} has no matching work item.`);const realized_intent=String(r.realized_intent??'').trim();if(realized_intent&&!active.some(x=>x.intent_id===realized_intent))throw new Error(`Unknown active realised intent: ${realized_intent}`);const result={item_id,realized_intent,outcome:number(r.outcome,NaN,'Outcome'),lead_time:number(r.lead_time,NaN,'Lead time'),defect_rate:number(r.defect_rate,NaN,'Defect rate')};if(result.defect_rate>1)throw new Error('Defect rate must be a fraction from 0 to 1.');if(![result.outcome,result.lead_time,result.defect_rate].some(Number.isFinite))throw new Error('Each outcome row needs at least one observed numeric measure.');return result;});
      const terms=new Set();for(const row of [...intents,...items]){for(const term of [...tokenize((row.name??row.title??"")+" "+row.description),...row.tags]){terms.add(term);if(terms.size>5000)throw new Error("Use at most 5,000 distinct words/tags in this teaching example.");}}
      return {intents,items,outcomes};
    }
    function tokenize(text) {
      if (!text) return [];
      const toks = text.toLowerCase()
        .replace(/[^a-z0-9\s\-_/+#.]/g, " ")
        .split(/[\s\/+_.-]+/g)
        .filter(t => t && !STOP.has(t) && t.length > 1);
      return toks;
    }

    function parseTags(raw) {
      if (!raw) return [];
      return raw.split(/[;,]/g).map(s => s.trim().toLowerCase()).filter(Boolean);
    }

    function jaccard(a, b) {
      const A = new Set(a), B = new Set(b);
      if (A.size === 0 && B.size === 0) return 0;
      let inter = 0;
      A.forEach(x => { if (B.has(x)) inter++; });
      const uni = A.size + B.size - inter;
      return uni === 0 ? 0 : inter / uni;
    }

    function dot(a,b){ let s=0; for(let i=0;i<a.length;i++) s += a[i]*b[i]; return s; }
    function norm(a){ return Math.sqrt(dot(a,a)); }
    function cosine(a,b){ const na=norm(a), nb=norm(b); if(na===0||nb===0) return 0; return dot(a,b)/(na*nb); }

    function softmaxPos(arr) {
      // stable softmax over nonnegative inputs; if all zero, return uniform
      const maxv = Math.max(...arr);
      const exps = arr.map(v => Math.exp(v - maxv));
      const s = exps.reduce((acc,x)=>acc+x,0);
      if (!isFinite(s) || s===0) return arr.map(_=>1/arr.length);
      return exps.map(x => x/s);
    }

    function entropy(p) {
      // normalized entropy in [0,1] using log(K) denominator
      if(!p.some(x=>x>0))return null;
      const K = p.length;
      let H = 0;
      for (const x of p) if (x>0) H += -x * Math.log(x);
      const Hmax = Math.log(K);
      return Hmax===0?0: H / Hmax;
    }

    function downloadCSV(filename, rows) {const blob=new Blob([csvText(rows,true)],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('CSV generated; download requested.');}

    function renderExplainer(key) {
      const config = EXPLAINERS[key] || EXPLAINERS.overview;
      const content = document.getElementById("explainerContent");
      content.innerHTML = `<h3>${config.title}</h3>${config.body}`;
      document.querySelectorAll(".explainer-btn").forEach(btn => {
        const active = btn.dataset.explainer === key;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    // ------------------------ CSV ingestion ------------------------
    async function loadCSVs(files){
      const texts=await Promise.all([files.intents.text(),files.work.text(),files.outcomes?files.outcomes.text():null]);
      const data=prepareData(parseCSV(texts[0]),parseCSV(texts[1]),texts[2]===null?[]:parseCSV(texts[2]));
      Object.assign(State,data);State.baselineWeights=State.intents.map(x=>x.target_weight);State.learningApplied=false;
      renderIntentSliders();computeAll();status(`Loaded ${State.items.length} work items and ${State.intents.filter(x=>x.active).length} active intents.`);
    }
    function normalizeIntentWeights(){const active=State.intents.filter(x=>x.active);if(!active.length)throw new Error('At least one active intent is needed.');if(active.some(x=>!Number.isFinite(x.target_weight)||x.target_weight<0))throw new Error('Every target share must be finite and nonnegative.');const sum=active.reduce((s,x)=>s+x.target_weight,0);if(!Number.isFinite(sum))throw new Error('Target shares are too large.');for(const x of active)x.target_weight=sum?x.target_weight/sum:1/active.length;}

    function buildVocabulary() {
      State.vocab.clear();
      const docs = [];
      for (const it of State.intents) {
        if (!it.active) continue;
        const toks = tokenize(it.name + " " + it.description).concat(
          // amplify intent tags by repeating them
          it.tags.flatMap(t => [t,t,t])
        );
        docs.push(toks);
      }
      for (const wi of State.items) {
        const toks = tokenize(wi.title + " " + wi.description).concat(
          wi.tags.flatMap(t => [t,t]) // lighter boost than intents
        );
        docs.push(toks);
      }
      // DF counts
      const df = new Map();
      docs.forEach(tokens => {
        const seen = new Set(tokens);
        seen.forEach(tok => df.set(tok, (df.get(tok)||0)+1));
      });
      // Build vocab (sorted for determinism)
      const tokens = Array.from(df.keys()).sort();
      tokens.forEach((tok, idx) => State.vocab.set(tok, idx));
      // IDF
      const N = docs.length;
      State.idf = new Float64Array(State.vocab.size);
      tokens.forEach((tok, idx) => {
        const dfi = df.get(tok) || 1;
        State.idf[idx] = Math.log((N + 1) / (dfi + 1)) + 1.0;
      });
    }

    function vectorize(text, tags, intent=false) {
      const toks = tokenize(text).slice();
      // Tag weighting: Jaccard appears later in similarity; here we add mild repetition
      const amplified = intent ? tags.flatMap(t=>[t,t,t]) : tags.flatMap(t=>[t,t]);
      const all = toks.concat(amplified);
      const v = new Float64Array(State.vocab.size);
      // term frequency
      for (const tok of all) {
        const idx = State.vocab.get(tok);
        if (idx!=null) v[idx] += 1;
      }
      // tf-idf
      for (let i=0;i<v.length;i++) {
        if (v[i]>0) v[i] = (1 + Math.log(v[i])) * State.idf[i];
      }
      return v;
    }

    function buildVectors() {
      State.vecIntents = Object.create(null);
      State.vecItems = Object.create(null);
      for (const it of State.intents) {
        if (!it.active) continue;
        State.vecIntents[it.intent_id] = vectorize((it.name||"")+" "+(it.description||""), it.tags, true);
      }
      for (const wi of State.items) {
        State.vecItems[wi.item_id] = vectorize((wi.title||"")+" "+(wi.description||""), wi.tags, false);
      }
    }

    // ------------------------ Similarities and Field ------------------------
    function computeSimilarities() {
      const intents = State.intents.filter(x=>x.active);
      const I = State.items.length, J = intents.length;
      State.sim = Array.from({length:I}, ()=> new Float64Array(J));
      for (let i=0;i<I;i++) {
        const wi = State.items[i];
        const v = State.vecItems[wi.item_id];
        for (let j=0;j<J;j++) {
          const it = intents[j];
          const u = State.vecIntents[it.intent_id];
          let s = cosine(v, u);
          // Tag Jaccard boost
          const jac = jaccard(wi.tags, it.tags);
          s = s * (1 + State.params.tagBoost * jac);
          // Clamp to [0, Infinity)
          State.sim[i][j] = Math.max(0, s);
        }
      }
    }

    function sparsifyAndNormalize(){const J=State.intents.filter(x=>x.active).length,K=Math.max(1,Math.min(State.params.topK,J));State.probs=State.sim.map(values=>{const positive=Array.from(values).map((v,j)=>({v,j})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v),result=new Float64Array(J);if(!positive.length)return result;const threshold=positive[Math.min(K,positive.length)-1].v;const kept=positive.filter(x=>x.v>=threshold-1e-12);const weights=softmaxPos(kept.map(x=>x.v));kept.forEach((x,i)=>result[x.j]=weights[i]);return result;});}

    function computeCoverageAndGaps() {
      const intents = State.intents.filter(x=>x.active);
      const I = State.items.length, J = intents.length;
      // Coverage = sum_i effort_i * p_ij
      const cov = new Float64Array(J).fill(0);
      let totalEffort = 0;
      for (let i=0;i<I;i++) {
        const eff = Math.max(0, State.items[i].effort ?? 1);
        totalEffort += eff;
        for (let j=0;j<J;j++) cov[j] += eff * State.probs[i][j];
      }
      // Normalize to fraction of total effort
      const total = totalEffort || 1;
      const covPct = cov.map(x=> x/total);
      // Gaps
      const gaps = covPct.map((x,j)=> x - intents[j].target_weight);
      State.coverage = Object.create(null); State.gaps = Object.create(null);
      for (let j=0;j<J;j++) {
        State.coverage[intents[j].intent_id] = covPct[j];
        State.gaps[intents[j].intent_id] = gaps[j];
      }
      State.totals = { items: I, efforts: totalEffort, intents: J, unallocated: Math.max(0,totalEffort-cov.reduce((a,x)=>a+x,0)) };
      return { covPct, gaps };
    }

    function computeEntropyList() {
      const intents = State.intents.filter(x=>x.active);
      const I = State.items.length, J = intents.length;
      const ent = Array(I).fill(null);
      for (let i=0;i<I;i++) ent[i] = entropy(Array.from(State.probs[i]));
      return ent;
    }

    function computeGraphEdges() {
      // Return bipartite edges: item_i -> intent_j with weight = probs[i][j]; keep nonzero entries
      const intents = State.intents.filter(x=>x.active);
      const edges = [];
      for (let i=0;i<State.items.length;i++) {
        for (let j=0;j<intents.length;j++) {
          const w = State.probs[i][j];
          if (w>0) {
            edges.push({
              src: State.items[i].item_id,
              dst: intents[j].intent_id,
              weight: w
            });
          }
        }
      }
      return edges;
    }

    function computeGraphRoughness() {
      // A simple Laplacian roughness: sum over edges w*(f_i - g_j)^2
      // where f_i = p(top intent) of item i, g_j = target_weight(intent j)
      // This is a proxy; lower means smoother alignment between probabilities and priors.
      const intents = State.intents.filter(x=>x.active);
      const J = intents.length;
      const topP = [];
      for (let i=0;i<State.items.length;i++) {
        const arr = Array.from(State.probs[i]);
        topP.push(Math.max(...arr));
      }
      const F = topP;
      const G = intents.map(it => it.target_weight);
      let s = 0, m = 0;
      for (let i=0;i<State.items.length;i++) {
        for (let j=0;j<J;j++) {
          const w = State.probs[i][j];
          if (w>0) { s += w * Math.pow(F[i] - G[j], 2); m += w; }
        }
      }
      return m>0 ? s/m : null;
    }

    // ------------------------ Nudges ------------------------
    function computeNudges(){const intents=State.intents.filter(x=>x.active),total=State.items.reduce((s,x)=>s+x.effort,0);if(!total)return [];const moves=[];for(let i=0;i<State.items.length;i++){const eff=State.items[i].effort;if(!eff)continue;const sorted=Array.from(State.probs[i]).map((v,j)=>({v,j})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v);if(sorted.length<2)continue;const [a,b]=sorted,from=intents[a.j],to=intents[b.j],over=State.gaps[from.intent_id],under=-State.gaps[to.intent_id];if(over<=0||under<=0||a.v-b.v>State.params.epsilon)continue;const transfer=Math.min(a.v,over*total/eff,under*total/eff),impact=transfer*eff/total;if(impact>0)moves.push({item_id:State.items[i].item_id,from_name:from.name,to_name:to.name,from_id:from.intent_id,to_id:to.intent_id,delta_gap:impact,delta_p:a.v-b.v,transfer_weight:transfer,effort:eff});}return moves.sort((a,b)=>b.delta_gap-a.delta_gap);}

    function applyLearningUpdate() {
      if (!State.outcomes.length || State.learningApplied) return;
      State.learningApplied=true;
      // Compute per-intent average score over items whose argmax intent == that intent
      const intents = State.intents.filter(x=>x.active);
      const J = intents.length;

      // Build item -> argmax intent idx mapping
      const argmax = [];
      for (let i=0;i<State.items.length;i++) {
        const p = Array.from(State.probs[i]);
        let bestJ = 0, bestV = p[0];
        for (let j=1;j<J;j++) if (p[j]>bestV){ bestV = p[j]; bestJ=j; }
        argmax[i] = bestJ;
      }

      // Outcomes index by item_id
      const outMap = new Map();
      for (const o of State.outcomes) outMap.set(o.item_id, o);

      // Score: normalize positive outcome; penalize lead time and defect_rate if present
      // score = z(outcome) - 0.5*z(lead_time) - 0.5*z(defect)
      const valsO = [], valsL = [], valsD = [];
      for (const o of State.outcomes) {
        if (isFinite(o.outcome)) valsO.push(o.outcome);
        if (isFinite(o.lead_time)) valsL.push(o.lead_time);
        if (isFinite(o.defect_rate)) valsD.push(o.defect_rate);
      }
      function z(v, arr, invert=false) {
        if (!isFinite(v) || !arr.length) return 0;
        const m = arr.reduce((a,x)=>a+x,0)/arr.length;
        const s = Math.sqrt(arr.reduce((a,x)=>a+(x-m)*(x-m),0)/arr.length) || 1;
        const z = (v - m)/s;
        return invert ? -z : z;
      }

      const perIntent = intents.map(_=>({sum:0, n:0}));
      for (let i=0;i<State.items.length;i++) {
        const wi = State.items[i];
        const o = outMap.get(wi.item_id);
        if (!o) continue;
        const s = z(o.outcome, valsO, false) + 0.0
                + 0.5 * z(o.lead_time, valsL, true)
                + 0.5 * z(o.defect_rate, valsD, true);
        const j = o.realized_intent ? intents.findIndex(x=>x.intent_id===o.realized_intent) : argmax[i];
        if(j<0 || (!o.realized_intent && !State.probs[i].some(x=>x>0)))continue;
        perIntent[j].sum += s; perIntent[j].n += 1;
      }
      const avg = perIntent.map(x => x.n ? x.sum/x.n : 0);
      const meanAvg = avg.reduce((a,x)=>a+x,0)/avg.length;

      // Multiplicative weights update on target priors
      const eta = State.params.eta;
      let Z = 0;
      for (let j=0;j<intents.length;j++) {
        const w = intents[j].target_weight;
        const upd = w * (1 + eta * (avg[j] - meanAvg));
        intents[j].target_weight = Math.max(0, upd);
        Z += intents[j].target_weight;
      }
      if (Z<=0) {
        const u = 1/intents.length;
        for (let j=0;j<intents.length;j++) intents[j].target_weight = u;
      } else {
        for (let j=0;j<intents.length;j++) intents[j].target_weight /= Z;
      }
      if(typeof document!=="undefined")renderIntentSliders(); // reflect changes
    }

    // ------------------------ Rendering ------------------------
    function ensureCharts(intents, cov, gaps, entHist) {
      const labels = intents.map(it=>it.name);
      const covPct = cov.map(x=> x*100);
      const tgtPct = intents.map(it => it.target_weight * 100);
      const ctx1 = document.getElementById('coverageChart');
      const ctx2 = document.getElementById('gapChart');
      const ctx3 = document.getElementById('entropyChart');

      if (State.charts.coverage) State.charts.coverage.destroy();
      if (State.charts.gap) State.charts.gap.destroy();
      if (State.charts.entropy) State.charts.entropy.destroy();

      State.charts.coverage = new Chart(ctx1, {
        type: 'bar',
        data: { labels,
          datasets: [
            { label: 'Attributed %', data: covPct },
            { label: 'Target %', data: tgtPct }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'top' } },
          scales: { y: { beginAtZero: true, ticks: { callback:(v)=>v+'%' } } }
        }
      });

      State.charts.gap = new Chart(ctx2, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Gap (pp)', data: gaps.map(x=> x*100) }] },
        options: {
          responsive: true,
          plugins: { legend: { display:false } },
          scales: { y: { beginAtZero: true, ticks: { callback:(v)=>v+'%' } } }
        }
      });

      State.charts.entropy = new Chart(ctx3, {
        type: 'bar',
        data: { labels: entHist.labels, datasets: [{ label: 'Items', data: entHist.counts }] },
        options: {
          responsive: true,
          plugins: { legend: { display:false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    function renderIntentSliders() {
      const wrap = document.getElementById('intentSliders');
      wrap.innerHTML = '';
      State.sliders = Object.create(null);
      const active = State.intents.filter(x=>x.active);
      for (const it of active) {
        const div = document.createElement('div');
        div.className = 'intent-slider';
        const lab = document.createElement('div');
        lab.innerHTML = `<strong>${escapeHTML(it.name)}</strong> <span class="small muted">(${escapeHTML(it.intent_id)})</span> <span class="small">target_weight: ${(it.target_weight*100).toFixed(1)}%</span>`;
        const slider = document.createElement('input');
        slider.setAttribute("aria-label", `Target share for ${it.name}`);
        slider.type = 'range'; slider.min = 0; slider.max = 100; slider.value = Math.round(it.target_weight*100);
        slider.oninput = (e) => {
          const val = parseInt(e.target.value,10)/100;
          it.target_weight = val;
          // renormalize across all active on slide end?
        };
        slider.onchange = (e) => {
          // Renormalize all active after user change
          const act = State.intents.filter(x=>x.active);
          let s=0; for (const k of act) s += k.target_weight;
          if (s<=0){ const u=1/act.length; for (const k of act) k.target_weight = u; }
          else for (const k of act) k.target_weight /= s;
          renderIntentSliders();computeAll();status("Target shares changed; matches are unchanged, comparison and exports updated.");
        };
        div.appendChild(lab); div.appendChild(slider);
        wrap.appendChild(div);
        State.sliders[it.intent_id] = slider;
      }
    }

    function renderTables(nudges, entropies, intents) {
      // Ambiguity table
      const ambigBody = document.querySelector('#ambigTable tbody');
      const rowsA = [];
      const entries = State.items.map((wi,i)=>({i, H: entropies[i]})).filter(e=>Number.isFinite(e.H)).sort((a,b)=> b.H - a.H).slice(0,50);
      for (const e of entries) {
        const i = e.i;
        const wi = State.items[i];
        const p = Array.from(State.probs[i]);
        const sorted = p.map((v,j)=>({j,v})).sort((a,b)=>b.v-a.v);
        const top2 = !p.some(x=>x>0) ? "Unallocated: no text/tag match" : sorted.slice(0,2).filter(x=>x.v>0).map(o=> `${escapeHTML(intents[o.j].name)} ${(o.v*100).toFixed(1)}%`).join(" · ");
        rowsA.push(`<tr>
          <td><strong>${escapeHTML(wi.item_id)}</strong><div class="small muted">${escapeHTML(wi.title || '')}</div></td>
          <td>${escapeHTML(wi.squad || '')}</td>
          <td>${e.H.toFixed(3)}</td>
          <td>${top2}</td>
          <td>${wi.tags.map(t=>`<span class="pill">${escapeHTML(t)}</span>`).join('')}</td>
        </tr>`);
      }
      ambigBody.innerHTML = rowsA.join('') || '<tr><td colspan="5">No matched items have an allocation entropy. Unmatched work is listed in Ranked Matches.</td></tr>';

      // Nudges
      const nudgeBody = document.querySelector('#nudgeTable tbody');
      const rowsN = nudges.slice(0,50).map(n => {
        return `<tr>
          <td><strong>${escapeHTML(n.item_id)}</strong></td>
          <td>${escapeHTML(n.from_name)} → ${escapeHTML(n.to_name)}</td>
          <td>${(n.delta_gap*100).toFixed(2)} pp</td>
          <td>${n.delta_p.toFixed(3)}</td>
          <td>${n.effort}</td>
        </tr>`;
      });
      nudgeBody.innerHTML = rowsN.join('');

      // Matches
      const matchBody = document.querySelector('#matchTable tbody');
      const rowsM = [];
      for (let i=0;i<State.items.length;i++) {
        const wi = State.items[i];
        const p = Array.from(State.probs[i]);
        const sorted = p.map((v,j)=>({j,v})).sort((a,b)=>b.v-a.v);
        const top = sorted[0], top3 = !p.some(x=>x>0)?"No positive lexical match":sorted.slice(0,3).filter(x=>x.v>0).map(o=> `${escapeHTML(intents[o.j].name)} ${(o.v*100).toFixed(1)}%`).join(" · ");
        rowsM.push(`<tr>
          <td><strong>${escapeHTML(wi.item_id)}</strong></td>
          <td>${p.some(x=>x>0)?escapeHTML(intents[top.j].name):"Unallocated"}</td>
          <td>${(top.v*100).toFixed(1)}%</td>
          <td>${top3}</td>
          <td>${escapeHTML(wi.title || '')}</td>
          <td>${escapeHTML(wi.squad || '')}</td>
          <td>${wi.tags.map(t=>`<span class="pill">${escapeHTML(t)}</span>`).join('')}</td>
        </tr>`);
      }
      matchBody.innerHTML = rowsM.join('');
    }

    function renderTotals(roughness) {
      document.getElementById('roughnessVal').textContent = roughness===null?'N/A (no allocated edges)':roughness.toFixed(4);
      const t = State.totals;
      document.getElementById('totals').innerHTML = `
        <div>Items: <strong>${t.items}</strong></div>
        <div>Total effort: <strong>${t.efforts}</strong></div>
        <div>Active intents: <strong>${t.intents}</strong></div><div>Unallocated effort: <strong>${t.unallocated.toFixed(2)}</strong></div>
      `;
    }

    function entHistogram(entropies) {
      // 10 bins [0,1)
      const B = 10;
      const counts = Array(B).fill(0);
      for (const h of entropies) {
        if(!Number.isFinite(h))continue;
        const idx = Math.min(B-1, Math.floor(h * B));
        counts[idx]++;
      }
      const labels = Array(B).fill(0).map((_,i)=>`${(i*0.1).toFixed(1)}–${((i+1)*0.1).toFixed(1)}`);
      return { labels, counts };
    }

    // ------------------------ Exports ------------------------
    function buildExports(covPct, gaps) {
      const intents = State.intents.filter(x=>x.active);
      // Alignment report per item
      const align = [["item_id","top_intent","p_top","entropy","effort","squad","title","tags"]];
      const matches = [["item_id","intent_id","intent_name","probability"]];
      for (let i=0;i<State.items.length;i++) {
        const wi = State.items[i];
        const p = Array.from(State.probs[i]);
        const sorted = p.map((v,j)=>({j,v})).sort((a,b)=>b.v-a.v);
        const top = sorted[0];
        align.push([
          wi.item_id,
          p.some(x=>x>0)?intents[top.j].intent_id:"",
          top.v.toFixed(6),
          entropy(p)===null?"":entropy(p).toFixed(6),
          wi.effort,
          wi.squad,
          wi.title,
          wi.tags.join(";")
        ]);
        for (const o of sorted) {
          matches.push([
            wi.item_id,
            intents[o.j].intent_id,
            intents[o.j].name,
            o.v.toFixed(6)
          ]);
        }
      }
      // Nudges
      const nudges = [["item_id","from_intent","to_intent","delta_gap_estimate","delta_p","effort","transfer_weight","from_intent_id","to_intent_id"]];
      const recs = computeNudges();
      for (const n of recs) {
        nudges.push([n.item_id, n.from_name, n.to_name, n.delta_gap.toFixed(6), n.delta_p.toFixed(6), n.effort, n.transfer_weight.toFixed(6), n.from_id, n.to_id]);
      }
      // Coverage summary
      const coverage = [["intent_id","name","target_weight","actual_coverage","gap"]];
      for (let j=0;j<intents.length;j++) {
        coverage.push([
          intents[j].intent_id,
          intents[j].name,
          intents[j].target_weight.toFixed(6),
          covPct[j].toFixed(6),
          gaps[j].toFixed(6)
        ]);
      }
      // Graph edges
      const edgesRows = [["source","target","weight","type"]];
      const edges = computeGraphEdges();
      for (const e of edges) edgesRows.push([e.src, e.dst, e.weight.toFixed(6), "item→intent"]);

      State.lastExport = { align, matches, nudges, coverage, edges: edgesRows };
    }

    // ------------------------ Orchestration ------------------------
    function computeAll() {
      buildVocabulary();
      buildVectors();
      computeSimilarities();
      sparsifyAndNormalize();
      const intents = State.intents.filter(x=>x.active);
      const { covPct, gaps } = computeCoverageAndGaps();
      const ent = computeEntropyList();
      const rough = computeGraphRoughness();
      renderTotals(rough);
      ensureCharts(intents, covPct, gaps, entHistogram(ent));
      const nudges = computeNudges();
      renderTables(nudges, ent, intents);
      buildExports(covPct, gaps);

      // Enable buttons
      document.getElementById('recomputeBtn').disabled = false;
      document.getElementById('learnBtn').disabled = !State.outcomes.length || State.learningApplied;
      document.getElementById('resetWeights').disabled=false;
      document.getElementById('chartValues').textContent=intents.map((it,j)=>`${it.name}: attributed ${(covPct[j]*100).toFixed(2)}%; target ${(it.target_weight*100).toFixed(2)}%; gap ${(gaps[j]*100).toFixed(2)} percentage points`).join('\n')+'\nEntropy histogram (matched items only): '+entHistogram(ent).counts.join(', ')+'\nUnallocated effort: '+State.totals.unallocated.toFixed(2)+'\nRoughness proxy: '+(rough===null?'N/A (no allocated edges)':rough.toFixed(4));
      document.getElementById('exportAlign').disabled = false;
      document.getElementById('exportMatches').disabled = false;
      document.getElementById('exportNudges').disabled = false;
      document.getElementById('exportCoverage').disabled = false;
      document.getElementById('exportGraph').disabled = false;
    }

    // ------------------------ Demo data ------------------------
    function demoCSVs() {
      // A tiny synthetic world with 4 intents and ~12 items
      const intents = [
        ["intent_id","name","description","tags","target_weight","active"],
        ["RES","Resilience","Reliability, fault-tolerance, graceful degradation","reliability;resilience;uptime;failover",0.35,1],
        ["USE","Usability","Friction reduction, accessibility, UX polish","ux;usability;accessibility;onboarding",0.25,1],
        ["SCL","Scale","Throughput, latency, horizontal scaling, cost-efficiency","performance;latency;throughput;scale",0.25,1],
        ["ECO","Ecosystem","Integrations, APIs, partnerships, docs","integration;api;docs;partner",0.15,1]
      ];
      const work = [
        ["item_id","title","description","tags","type","status","squad","effort","url"],
        ["W1","Retry & backoff for ingest","Add exponential backoff and idempotent retries to ingest pipeline","reliability;failover","task","ready","Core",3,""] ,
        ["W2","Latency SLO for read path","Instrument p95/99, budget policy and alerts","latency;observability;slo","epic","in-progress","Core",5,""] ,
        ["W3","OAuth2 partner sandbox","Partner sandbox + token refresh flows","integration;oauth;partner","epic","ready","Platform",5,""] ,
        ["W4","Empty-state onboarding","Rewrite empty-state; reduce first-run confusion","onboarding;ux;copy","task","in-review","Growth",2,""] ,
        ["W5","Shard registry caching","Reduce registry hot spots with client caches","throughput;scale;caching","task","ready","Core",3,""] ,
        ["W6","Docs: webhooks & retries","Author robust delivery patterns section","docs;webhooks;retry","task","ready","Docs",1,""] ,
        ["W7","Keyboard shortcuts","Accelerators for power users","usability;accessibility","task","ready","Growth",1,""] ,
        ["W8","Async batch export","Background export with resumable checkpoints","scale;throughput;batch","epic","ready","Platform",5,""] ,
        ["W9","WCAG color pass","Fix low-contrast components","accessibility;ux","task","ready","Growth",2,""] ,
        ["W10","Partner status callbacks","Add callback endpoints and examples","api;callback;docs;integration","task","ready","Platform",2,""] ,
        ["W11","Circuit breaker for upstream","Trip and shed load to protect core","resilience;throttle;fail-fast","task","ready","Core",3,""] ,
        ["W12","Product tour v2","Contextual tips during first session","onboarding;ux;tour","task","ready","Growth",2,""]
      ];
      const outcomes = [
        ["item_id","outcome","lead_time","defect_rate","realized_intent"],
        ["W3",0.6,18,0.02,"ECO"],
        ["W4",0.4,8,0.01,"USE"],
        ["W5",0.5,21,0.03,"SCL"],
        ["W6",0.3,5,0.00,"ECO"],
        ["W8",0.55,30,0.04,"SCL"],
        ["W9",0.25,7,0.00,"USE"]
      ];
      const toBlob = arr => new Blob([csvText(arr)],{type:"text/csv"});
      return {
        intents: new File([toBlob(intents)], "intents.csv", {type:"text/csv"}),
        work: new File([toBlob(work)], "work_items.csv", {type:"text/csv"}),
        outcomes: new File([toBlob(outcomes)], "outcomes.csv", {type:"text/csv"})
      };
    }

    
    function boundaryCSVs(){
      const make=(rows,name)=>new File([csvText(rows)],name,{type:'text/csv'});
      const intents=[['intent_id','name','description','tags','target_weight','active'],['RES','Resilience','reliability resilience','reliability;resilience',.2,1],['USE','Usability','usability accessibility','usability;accessibility',.8,1]];
      const work=[['item_id','title','description','tags','effort'],['MIX','Resilience and usability','reliability resilience usability accessibility','reliability;resilience;usability;accessibility',10],['NONE','Orchard pruning','apple pear harvest','horticulture',2],['ZERO','Resilience and usability','reliability resilience usability accessibility','reliability;resilience;usability;accessibility',0]];
      return {intents:make(intents,'boundary-intents.csv'),work:make(work,'boundary-work.csv'),outcomes:null};
    }
    if(typeof module!=='undefined'&&module.exports)module.exports={State,parseCSV,csvText,prepareData,normalizeIntentWeights,tokenize,parseTags,jaccard,cosine,entropy,entHistogram,computeEntropyList,buildVocabulary,buildVectors,computeSimilarities,sparsifyAndNormalize,computeCoverageAndGaps,computeGraphRoughness,computeNudges,applyLearningUpdate,demoCSVs,boundaryCSVs,escapeHTML};
    if(typeof document!=='undefined'){
// ------------------------ Event wiring ------------------------
    document.querySelectorAll(".explainer-btn").forEach(btn => {
      btn.addEventListener("click", () => renderExplainer(btn.dataset.explainer));
    });
    renderExplainer("overview");

    document.getElementById('topK').addEventListener('input', (e)=>{
      const v = parseInt(e.target.value,10);
      State.params.topK = v;if(State.items.length)computeAll();
      document.getElementById('topKVal').textContent = v;
    });
    document.getElementById('epsilon').addEventListener('input', (e)=>{
      const v = parseInt(e.target.value,10)/100;
      State.params.epsilon = v;if(State.items.length)computeAll();
      document.getElementById('epsilonVal').textContent = v.toFixed(2);
    });
    document.getElementById('tagBoost').addEventListener('input', (e)=>{
      const v = parseInt(e.target.value,10)/10;
      State.params.tagBoost = v;if(State.items.length)computeAll();
      document.getElementById('tagBoostVal').textContent = v.toFixed(2);
    });
    document.getElementById('eta').addEventListener('input', (e)=>{
      const v = parseInt(e.target.value,10)/100;
      State.params.eta = v;
      document.getElementById('etaVal').textContent = v.toFixed(2);
    });

    document.getElementById('loadBtn').addEventListener('click', async ()=>{
      const intentsFile = document.getElementById('intentsFile').files[0];
      const workFile = document.getElementById('workFile').files[0];
      const outcomesFile = document.getElementById('outcomesFile').files[0];
      if (!intentsFile || !workFile) {
        alert("Please choose intents.csv and work_items.csv; outcomes.csv is optional.");
        return;
      }
      try{await loadCSVs({intents:intentsFile, work:workFile, outcomes:outcomesFile});}catch(err){status("Load failed: "+err.message+" Previous data is unchanged.");}
    });

    document.getElementById('demoBtn').addEventListener('click', async ()=>{
      const files = demoCSVs();
      try{await loadCSVs(files);}catch(err){status("Demo failed: "+err.message);}
    });

    document.getElementById('boundaryDemoBtn').addEventListener('click',async()=>{try{await loadCSVs(boundaryCSVs());status('Boundary example: MIX has two equal matches, NONE stays unallocated, and ZERO contributes no effort. Candidate moves are independent alternatives.');}catch(err){status('Demo failed: '+err.message);}});
    document.getElementById('recomputeBtn').addEventListener('click', ()=>{
      computeAll();
    });

    document.getElementById('learnBtn').addEventListener('click', ()=>{
      applyLearningUpdate();
      computeAll();
    });

    document.getElementById('exportAlign').addEventListener('click', ()=>{
      downloadCSV("intent_alignment_report.csv", State.lastExport.align);
    });
    document.getElementById('exportMatches').addEventListener('click', ()=>{
      downloadCSV("ranked_matches.csv", State.lastExport.matches);
    });

    document.getElementById('exportNudges').addEventListener('click', ()=>{
      downloadCSV("nudge_recommendations.csv", State.lastExport.nudges);
    });

    document.getElementById('exportCoverage').addEventListener('click', ()=>{
      downloadCSV("coverage_summary.csv", State.lastExport.coverage);
    });

    document.getElementById('exportGraph').addEventListener('click', ()=>{
      downloadCSV("graph_edges.csv", State.lastExport.edges);
    });
  
    document.getElementById('resetWeights').addEventListener('click',()=>{State.intents.forEach((x,i)=>x.target_weight=State.baselineWeights[i]);State.learningApplied=false;renderIntentSliders();computeAll();status('Originally loaded target shares restored.');});

    }
