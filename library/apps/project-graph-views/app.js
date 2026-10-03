
/* =========================
   Utilities (dates, CSV, hashing)
   ========================= */

const pad2 = n => String(n).padStart(2,'0');

function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth()+1)}-${pad2(now.getDate())}`;
}

function parseISODate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(s + 'T00:00:00.000Z');
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10) === s ? d : null;
}

function formatISODate(d) {
  if (!(d instanceof Date) || !Number.isFinite(d.getTime())) return '';
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth()+1)}-${pad2(d.getUTCDate())}`;
}

function addDays(d, days) {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

function diffDays(a, b) {
  // b - a in whole days
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

function safeStr(x) {
  return (x === null || x === undefined) ? '' : String(x);
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function stableSort(arr, compare) {
  // deterministic even when compare returns 0
  return arr
    .map((v,i)=>({v,i}))
    .sort((a,b)=> {
      const c = compare(a.v, b.v);
      return c !== 0 ? c : (a.i - b.i);
    })
    .map(x=>x.v);
}

function csvEscape(v) {
  const s = safeStr(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g,'""')}"`;
  return s;
}

function toCSV(rows) {
  return rows.map(r => r.map(csvEscape).join(',')).join('\n');
}

function spreadsheetCSV(rows) {
  return toCSV(rows.map(row=>row.map(value=>typeof value==='string' && /^[\s]*[=+@-]/.test(value) ? "'"+value : value)));
}

function parseCSV(text) {
  const rows = []; let row = [], field = '', quoted = false, closed = false;
  const s = String(text ?? '').replace(/^\uFEFF/, '');
  function cell(){ row.push(field); field=''; closed=false; }
  function line(){ cell(); if(row.some(x=>x.trim()!=='')) rows.push(row); row=[]; }
  for(let i=0;i<s.length;i++){
    const c=s[i];
    if(quoted){
      if(c==='"'){ if(s[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;} }
      else field+=c;
    }else if(c===','){cell();}
    else if(c==='\n'||c==='\r'){line();if(c==='\r'&&s[i+1]==='\n')i++;}
    else if(c==='"'){if(field!==''||closed)throw new Error('Unexpected quote in CSV field.');quoted=true;}
    else {if(closed)throw new Error('Unexpected text after closing CSV quote.');field+=c;}
  }
  if(quoted)throw new Error('Unclosed quoted CSV field.');
  line(); return rows;
}

function htmlEscape(value) {
  return safeStr(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function announce(message) { $('#appStatus').textContent = message; }
function integerValue(value, min, max, label) {
  if(value === '' || value === null || value === undefined || !Number.isInteger(Number(value)) || Number(value)<min || Number(value)>max)
    throw new Error(`${label} must be a whole number from ${min} to ${max}.`);
  return Number(value);
}
function validateParams(template, params, idx) {
  const result = Object.create(null);
  for(const def of template.paramDefs || []){
    const value=params[def.key];
    if(def.type==='number') result[def.key]=integerValue(value,def.min,def.max,def.label);
    else {
      const options=def.optionsFn ? getDynamicOptions(def.optionsFn,{idx}) : def.options || [];
      const valid=options.map(x=>typeof x==='string'?x:x.value);
      if(def.type==='multiselect') {
        if(!Array.isArray(value)||value.some(x=>!valid.includes(x)))throw new Error(`Invalid ${def.label}.`);
        result[def.key]=[...new Set(value)];
      } else if(def.type==='select') {
        if(!(value==='' && !valid.length) && !valid.includes(value))throw new Error(`Choose a valid ${def.label}.`);
        result[def.key]=value;
      } else result[def.key]=value;
    }
  }
  return result;
}

function fnv1a32(str) {
  // 32-bit FNV-1a hash for determinism in receipt
  let h = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(str)) {
    h ^= byte;
    h = (h + ((h<<1) + (h<<4) + (h<<7) + (h<<8) + (h<<24))) >>> 0;
  }
  return ('0000000' + h.toString(16)).slice(-8);
}

/* =========================
   Minimal ZIP writer (store-only, no deps)
   ========================= */

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let i=0; i<256; i++) {
    let c = i;
    for (let k=0; k<8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c >>> 0;
  }
  return table;
}
const CRC_TABLE = makeCrcTable();

function crc32(u8) {
  let c = 0xFFFFFFFF;
  for (let i=0; i<u8.length; i++) {
    c = CRC_TABLE[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function dosDateTime(d) {
  // d is JS Date; use UTC for determinism
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const seconds = d.getUTCSeconds();

  const dosTime = ((hours & 0x1F) << 11) | ((minutes & 0x3F) << 5) | ((Math.floor(seconds/2)) & 0x1F);
  const dosDate = (((year - 1980) & 0x7F) << 9) | ((month & 0x0F) << 5) | (day & 0x1F);
  return {dosTime, dosDate};
}

function u16(n) {
  const a = new Uint8Array(2);
  a[0] = n & 0xFF;
  a[1] = (n >>> 8) & 0xFF;
  return a;
}
function u32(n) {
  const a = new Uint8Array(4);
  a[0] = n & 0xFF;
  a[1] = (n >>> 8) & 0xFF;
  a[2] = (n >>> 16) & 0xFF;
  a[3] = (n >>> 24) & 0xFF;
  return a;
}
function concatBytes(parts) {
  const total = parts.reduce((s,p)=>s + p.length, 0);
  const out = new Uint8Array(total);
  let off=0;
  for (const p of parts) { out.set(p, off); off += p.length; }
  return out;
}

class ZipBuilder {
  constructor() {
    this.files = []; // {path, dataU8, mtime}
    this.encoder = new TextEncoder();
  }
  add(path, content, mtime = new Date()) {
    const dataU8 = (content instanceof Uint8Array)
      ? content
      : this.encoder.encode(String(content));
    this.files.push({path, dataU8, mtime});
  }
  buildBlob() {
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    for (const f of this.files) {
      const nameU8 = this.encoder.encode(f.path);
      const {dosTime, dosDate} = dosDateTime(f.mtime);
      const c = crc32(f.dataU8);
      const size = f.dataU8.length;

      // Local file header
      const localHeader = concatBytes([
        u32(0x04034b50),
        u16(20),        // version needed
        u16(0),         // flags
        u16(0),         // compression 0=store
        u16(dosTime),
        u16(dosDate),
        u32(c),
        u32(size),
        u32(size),
        u16(nameU8.length),
        u16(0),         // extra len
        nameU8
      ]);
      localParts.push(localHeader, f.dataU8);

      // Central directory header
      const centralHeader = concatBytes([
        u32(0x02014b50),
        u16(20),        // version made by
        u16(20),        // version needed
        u16(0),         // flags
        u16(0),         // compression
        u16(dosTime),
        u16(dosDate),
        u32(c),
        u32(size),
        u32(size),
        u16(nameU8.length),
        u16(0),         // extra len
        u16(0),         // comment len
        u16(0),         // disk start
        u16(0),         // internal attrs
        u32(0),         // external attrs
        u32(offset),    // local header offset
        nameU8
      ]);
      centralParts.push(centralHeader);

      offset += localHeader.length + size;
    }

    const centralDir = concatBytes(centralParts);
    const centralOffset = offset;
    const centralSize = centralDir.length;
    const totalEntries = this.files.length;

    const end = concatBytes([
      u32(0x06054b50),
      u16(0),
      u16(0),
      u16(totalEntries),
      u16(totalEntries),
      u32(centralSize),
      u32(centralOffset),
      u16(0)
    ]);

    const blobU8 = concatBytes([...localParts, centralDir, end]);
    return new Blob([blobU8], {type: 'application/zip'});
  }
}

/* =========================
   Feature inventory explainers (buttons → panels)
   ========================= */

const FEATURE_INVENTORY = [
  {
    id: 'canonical_graph_schema',
    title: '1) Canonical graph & schema',
    pills: ['model', 'types', 'ids'],
    items: [
      'Single canonical graph as source of truth (nodes + edges).',
      'Typed nodes: WorkPackage, Interface, Risk, Milestone, Control, Decision, Evidence.',
      'Typed edges: depends_on, interfaces_with, introduces_risk, mitigated_by, verified_by, blocks, informs, supersedes.',
      'Stable external IDs for nodes and edges; duplicate and dangling IDs reject the import.',
      'Extensible property model (state, owner, dates, scores, tags).',
      'Imports reject malformed records, invalid dates, duplicate IDs and dangling references.',
      'Repeatable FNV-1a checksum of the selected graph fields; non-cryptographic and not authentication.'
    ]
  },
  {
    id: 'ingest_maintenance',
    title: '2) Ingest & maintenance',
    pills: ['json', 'csv', 'lineage'],
    items: [
      'Graph JSON ingest (round-trippable).',
      'CSV ingest for nodes and edges (field→type/edge mapping).',
      'Dynamic demo graph with relative dates for scenario testing.',
      'Stable ID preservation across ingests; destination mapping must be reviewed.',
      'Source + last_modified metadata captured per node/edge.'
    ]
  },
  {
    id: 'query_engine',
    title: '3) Query / view engine',
    pills: ['rules', 'traversal', 'deterministic'],
    items: [
      'Views as executable queries, not hand-curated boards.',
      'Role-scoped templates (PMO, Risk, Engineering, plus reusable “All”).',
      'Parameterised rules (time windows, thresholds, assets, states).',
      'Graph traversal logic (directional BFS with depth limits and edge filters).',
      'Computed attributes (risk age, overdue review, unmitigated counts, etc.).',
      'Deterministic sorting with explicit tie-breakers.',
      'Deterministic limits (view truncation is reproducible).'
    ]
  },
  {
    id: 'built_in_templates',
    title: '4) Built-in templates',
    pills: ['pmo', 'risk', 'engineering'],
    items: [
      'PMO: milestones at risk in next N days with upstream unmitigated hazards.',
      'Risk: interfaces with ≥1 red hazard lacking an owner; include controls/review dates.',
      'Engineering: interfaces touching asset X with stale proposed changes.',
      'Reusable set: 90‑Day Risk Window; Unfinished milestone dependencies; Owner Load; Change Heatmap; Assurance Trail.'
    ]
  },
  {
    id: 'auditability_lineage',
    title: '5) Lineage & auditability',
    pills: ['receipt', 'proof', 'governance'],
    items: [
      'Rule receipts: filters, parameters, time windows, traversals.',
      'Snapshot metadata: generated_at, graph id/version/hash, node/edge counts.',
      'Data lineage summary: sources contributing to view + max last_modified.',
      'Lineage maps: nodes included by which rules with reasons.',
      'Edges marked as evidence-used vs merely exported.',
      'Printable record of query inputs and rules; it records no approval or sign-off.'
    ]
  },
  {
    id: 'sharpcloud_outputs',
    title: '6) Portable view outputs',
    pills: ['items', 'links', 'import'],
    items: [
      'Items/cards JSON export with external_id, type, tags, attributes.',
      'Computed fields merged non-destructively (no silent overwrites).',
      'Links JSON export (from_external_id/to_external_id/type).',
      'Items and links CSV for adaptation to a destination importer; no vendor format is verified.',
      'Link mode: relationships used by the query, or all links between selected items.'
    ]
  },
  {
    id: 'audit_bundle_packaging',
    title: '7) Audit bundle packaging',
    pills: ['zip', 'manifest', 'handoff'],
    items: [
      'One-click ZIP containing view JSON, CSVs, receipt JSON/CSV, lineage CSVs, schema CSV, saved-search stubs, README, manifest.',
      'Folder layout designed for client hand-off and assurance packs.',
      'Manifest enumerating bundle contents and snapshot identifiers.'
    ]
  },
  {
    id: 'ui_exploration',
    title: '8) UI & exploration',
    pills: ['drilldown', 'kpis', 'tables'],
    items: [
      'Role + template selector UI.',
      'Dynamic parameter forms (including options derived from graph content).',
      'Card preview with search/filter.',
      'Drill-down panel: inclusion rules, reasons, attributes, neighbors.',
      'KPI tiles: counts by type + snapshot identity.',
      'Extra computed tables per template (owner load, assurance gaps, summaries).',
      'Tabbed navigation: Preview, JSON, Receipt, Lineage, Schema, Features.'
    ]
  },
  {
    id: 'reuse_portability',
    title: '9) Reuse & portability',
    pills: ['offline', 'no-deps', 'stubs'],
    items: [
      'Schema CSV as starter contract for partners/suppliers.',
      'Saved-search JSON stubs for porting templates into other engines.',
      'Local HTML and JavaScript with no runtime dependencies.',
      'Portable, offline-friendly governance artefacts.'
    ]
  },
  {
    id: 'conceptual_shift',
    title: '10) Conceptual shift',
    pills: ['projection', 'proof', 'assurance'],
    items: [
      'A board can be generated from repeatable graph queries; the choice of rules still expresses judgement.',
      'Explicit modelling and rules make assumptions inspectable before a board is shared.',
      'Lineage and receipts support review; they do not prove source truth or evidence sufficiency.',
      'A destination such as SharpCloud could display a projection while the supplied graph remains the source for this query.'
    ]
  }
];

function renderFeatureExplainers() {
  const btnWrap = document.getElementById('featureButtons');
  const panel = document.getElementById('featurePanel');
  if (!btnWrap || !panel) return;

  btnWrap.innerHTML = FEATURE_INVENTORY.map((f, i) => {
    const label = f.title.replace(/^\d+\)\s*/, '');
    return `<button class="exbtn ${i===0?'active':''}" data-fid="${f.id}">${label}</button>`;
  }).join('');

  function show(fid) {
    const f = FEATURE_INVENTORY.find(x => x.id === fid) || FEATURE_INVENTORY[0];
    window.__currentFeatureExplainer=f;
    document.querySelectorAll('.exbtn').forEach(b => b.classList.toggle('active', b.dataset.fid === f.id));

    const pillHtml = (f.pills || []).map(p => `<span class="pill">${p}</span>`).join('');
    const itemsHtml = (f.items || []).map(it => `<li>${it}</li>`).join('');

    panel.innerHTML = `
      <div class="exmeta">
        <span class="pill mono">${f.id}</span>
        ${pillHtml}
      </div>
      <h3>${f.title}</h3>
      <ul>${itemsHtml}</ul>
    `;

    window.__currentFeatureExplainer = f;
  }

  btnWrap.querySelectorAll('.exbtn').forEach(b => {
    b.onclick = () => show(b.dataset.fid);
  });

  show(FEATURE_INVENTORY[0].id);

  const copyOne = document.getElementById('copyFeatureText');
  const copyAll = document.getElementById('copyAllFeatureText');

  if(copyOne)copyOne.onclick=()=>{const f=window.__currentFeatureExplainer||FEATURE_INVENTORY[0];return copyText(`${f.title}\n- ${f.items.join('\n- ')}`);};
  if(copyAll)copyAll.onclick=()=>copyText(FEATURE_INVENTORY.map(f=>`${f.title}\n- ${f.items.join('\n- ')}`).join('\n\n'));

}

/* =========================
   Minimal schema to start
   ========================= */

const SCHEMA = {
  types: [
    {name: 'WorkPackage', description: 'Deliverable or task package (schedule-driving work).'},
    {name: 'Interface', description: 'Dependency boundary between packages/teams/assets.'},
    {name: 'Risk', description: 'Hazard/risk item with score, tag, owner, review cycle.'},
    {name: 'Milestone', description: 'Contract/programme milestone with target date.'},
    {name: 'Control', description: 'Mitigation/control action (approval + verification).'},
    {name: 'Decision', description: 'Change request / decision (state + age).'},
    {name: 'Evidence', description: 'Assurance/verification artefact linked to controls/decisions.'},
  ],
  properties: [
    {name:'state', datatype:'string', applies_to:'WorkPackage|Interface|Risk|Milestone|Control|Decision|Evidence', example:'Open / InProgress / Done / Approved', description:'Workflow/state.'},
    {name:'target_date', datatype:'date', applies_to:'WorkPackage|Interface|Milestone|Evidence', example:'2026-03-15', description:'Target/required date.'},
    {name:'owner', datatype:'string', applies_to:'WorkPackage|Interface|Risk|Milestone|Control|Decision|Evidence', example:'HSE Lead', description:'Accountable owner.'},
    {name:'hazard_tag', datatype:'string', applies_to:'Risk', example:'safety / schedule', description:'Hazard taxonomy.'},
    {name:'risk_score', datatype:'number', applies_to:'Risk', example:'20', description:'Severity/priority score.'},
    {name:'review_cycle', datatype:'number', applies_to:'Risk', example:'14', description:'Review cycle in days.'},
    {name:'review_due', datatype:'date', applies_to:'Risk|Control', example:'2026-01-10', description:'Next review due date.'},
    {name:'asset', datatype:'string', applies_to:'Interface|WorkPackage', example:'Viaduct', description:'Asset/system touched.'},
    {name:'change_state', datatype:'string', applies_to:'Decision', example:'Proposed / Approved', description:'Decision/change state.'},
    {name:'decision_date', datatype:'date', applies_to:'Decision', example:'2025-12-20', description:'Decision/change request date.'},
    {name:'verification_evidence', datatype:'string', applies_to:'Control', example:'EVID-123', description:'Verification reference (optional).'},
    {name:'source', datatype:'string', applies_to:'node|edge', example:'csv:weekly-ingest', description:'Lineage source label.'},
    {name:'last_modified', datatype:'datetime', applies_to:'node|edge', example:'2026-01-03T10:15:00Z', description:'Last modified timestamp.'},
  ],
  edges: [
    {name:'depends_on', from:'WorkPackage', to:'WorkPackage|Milestone', description:'Legacy direction: predecessor WorkPackage → successor WorkPackage/Milestone. The label depends_on is retained for compatibility; this tool follows that explicit direction.'},
    {name:'interfaces_with', from:'WorkPackage|Interface', to:'Interface|WorkPackage', description:'Interface linkage / boundary.'},
    {name:'introduces_risk', from:'Risk', to:'Interface|WorkPackage|Milestone', description:'Risk/hazard affecting something.'},
    {name:'mitigated_by', from:'Risk', to:'Control', description:'Control mitigates risk.'},
    {name:'verified_by', from:'Control|Decision', to:'Evidence', description:'Evidence verifying a control/decision.'},
    {name:'blocks', from:'Interface|WorkPackage|Risk', to:'Milestone|WorkPackage', description:'Blocker relationship.'},
    {name:'supersedes', from:'Decision', to:'Decision', description:'Decision supersedes another decision.'},
    {name:'informs', from:'Decision', to:'Interface|WorkPackage|Milestone', description:'Decision informs/changes scope.'},
  ]
};

/* =========================
   Demo graph (dynamic dates, stable IDs)
   ========================= */

function buildDemoGraph(baseTodayISO) {
  const T = parseISODate(baseTodayISO) || parseISODate(todayISO());
  const mk = days => formatISODate(addDays(T, days));
  const ago = days => formatISODate(addDays(T, -days));
  const nowIso = () => new Date().toISOString();

  return {
    meta: {
      graph_id: "demo-programme",
      graph_version: "0.2",
      created_at: nowIso(),
      note: "Demo graph with relative dates; set T in the UI to explore windows."
    },
    nodes: [
      {id:"WP1", type:"WorkPackage", title:"Viaduct Earthworks", tags:["civils"], props:{state:"InProgress", owner:"Civils Co", target_date: mk(60), asset:"Viaduct"}, source:"demo", last_modified: nowIso()},
      {id:"WP2", type:"WorkPackage", title:"M&E Fitout", tags:["me"], props:{state:"NotStarted", owner:"ME Ltd", target_date: mk(85), asset:"Station"}, source:"demo", last_modified: nowIso()},
      {id:"IF1", type:"Interface", title:"Deck→Pier rebar", tags:["design","interface"], props:{state:"Open", owner:"Design Lead", target_date: mk(25), asset:"Viaduct"}, source:"demo", last_modified: nowIso()},
      {id:"IF2", type:"Interface", title:"SCADA↔Power", tags:["systems","interface"], props:{state:"Open", owner:"Systems Lead", target_date: mk(55), asset:"Station"}, source:"demo", last_modified: nowIso()},
      {id:"M1", type:"Milestone", title:"Pier caps complete", tags:["milestone"], props:{state:"Planned", owner:"PMO", target_date: mk(35)}, source:"demo", last_modified: nowIso()},
      {id:"M2", type:"Milestone", title:"Energisation", tags:["milestone"], props:{state:"Planned", owner:"PMO", target_date: mk(110)}, source:"demo", last_modified: nowIso()},
      {id:"R1", type:"Risk", title:"Rebar delivery slips", tags:["schedule","red"], props:{state:"Open", hazard_tag:"schedule", risk_score:20, owner:"", review_cycle:14, review_due: ago(3)}, source:"demo", last_modified: nowIso()},
      {id:"R2", type:"Risk", title:"Working at height incidents", tags:["safety","red"], props:{state:"Open", hazard_tag:"safety", risk_score:25, owner:"HSE Lead", review_cycle:30, review_due: mk(5)}, source:"demo", last_modified: nowIso()},
      {id:"C1", type:"Control", title:"Expedite rebar order", tags:["mitigation"], props:{state:"Proposed", owner:"Procurement", review_due: mk(7)}, source:"demo", last_modified: nowIso()},
      {id:"C2", type:"Control", title:"Height safety training", tags:["mitigation"], props:{state:"Approved", owner:"HSE Lead", review_due: mk(20)}, source:"demo", last_modified: nowIso()},
      {id:"E1", type:"Evidence", title:"Training attendance records", tags:["assurance"], props:{state:"Verified", owner:"HSE Lead", target_date: mk(20)}, source:"demo", last_modified: nowIso()},
      {id:"D1", type:"Decision", title:"Change reinforcement supplier", tags:["change"], props:{change_state:"Proposed", decision_date: ago(20), owner:"Commercial", state:"Proposed"}, source:"demo", last_modified: nowIso()},
      {id:"D2", type:"Decision", title:"Adopt new SCADA protocol", tags:["change"], props:{change_state:"Approved", decision_date: ago(7), owner:"Systems", state:"Approved"}, source:"demo", last_modified: nowIso()},
      {id:"D3", type:"Decision", title:"Minor SCADA wiring tweak", tags:["change"], props:{change_state:"Approved", decision_date: ago(10), owner:"Systems", state:"Approved"}, source:"demo", last_modified: nowIso()},
      {id:"E2", type:"Evidence", title:"SCADA test report", tags:["assurance"], props:{state:"Draft", owner:"Systems", target_date: mk(18)}, source:"demo", last_modified: nowIso()}
    ],
    edges: [
      {id:"e_wp1_if1", from:"WP1", to:"IF1", type:"interfaces_with", source:"demo", last_modified: nowIso()},
      {id:"e_wp2_if2", from:"WP2", to:"IF2", type:"interfaces_with", source:"demo", last_modified: nowIso()},
      {id:"e_if1_m1", from:"IF1", to:"M1", type:"blocks", source:"demo", last_modified: nowIso()},
      {id:"e_wp1_m1", from:"WP1", to:"M1", type:"depends_on", source:"demo", last_modified: nowIso()},
      {id:"e_wp2_m2", from:"WP2", to:"M2", type:"depends_on", source:"demo", last_modified: nowIso()},
      {id:"e_r1_if1", from:"R1", to:"IF1", type:"introduces_risk", source:"demo", last_modified: nowIso()},
      {id:"e_r2_if1", from:"R2", to:"IF1", type:"introduces_risk", source:"demo", last_modified: nowIso()},
      {id:"e_r2_if2", from:"R2", to:"IF2", type:"introduces_risk", source:"demo", last_modified: nowIso()},
      {id:"e_r1_c1", from:"R1", to:"C1", type:"mitigated_by", source:"demo", last_modified: nowIso()},
      {id:"e_r2_c2", from:"R2", to:"C2", type:"mitigated_by", source:"demo", last_modified: nowIso()},
      {id:"e_c2_e1", from:"C2", to:"E1", type:"verified_by", source:"demo", last_modified: nowIso()},
      {id:"e_d1_if1", from:"D1", to:"IF1", type:"informs", source:"demo", last_modified: nowIso()},
      {id:"e_d2_if2", from:"D2", to:"IF2", type:"informs", source:"demo", last_modified: nowIso()},
      {id:"e_d3_if2", from:"D3", to:"IF2", type:"informs", source:"demo", last_modified: nowIso()},
      {id:"e_d2_e2", from:"D2", to:"E2", type:"verified_by", source:"demo", last_modified: nowIso()}
    ]
  };
}

/* =========================
   Graph index + validation
   ========================= */

function buildIndex(graph) {
  const nodesById = new Map();
  const edgesById = new Map();
  const outEdges = new Map();
  const inEdges = new Map();

  for (const n of graph.nodes || []) {
    nodesById.set(n.id, n);
  }
  for (const e of graph.edges || []) {
    edgesById.set(e.id, e);
    if (!outEdges.has(e.from)) outEdges.set(e.from, []);
    if (!inEdges.has(e.to)) inEdges.set(e.to, []);
    outEdges.get(e.from).push(e);
    inEdges.get(e.to).push(e);
  }

  // deterministic ordering
  for (const [k, list] of outEdges) {
    outEdges.set(k, stableSort(list, (a,b)=> (a.type+a.to).localeCompare(b.type+b.to)));
  }
  for (const [k, list] of inEdges) {
    inEdges.set(k, stableSort(list, (a,b)=> (a.type+a.from).localeCompare(b.type+b.from)));
  }

  return {nodesById, edgesById, outEdges, inEdges};
}

function normalizeGraph(input) {
  const object=x=>x && typeof x==='object' && !Array.isArray(x);
  if(!object(input)||!Array.isArray(input.nodes)||!Array.isArray(input.edges)) throw new Error('Graph must contain nodes[] and edges[].');
  const graph=JSON.parse(JSON.stringify(input,(key,v)=>{if(typeof v==='number'&&!Number.isFinite(v))throw new Error('Graph contains a non-finite number.');return v;}));
  if(graph.meta!==undefined && !object(graph.meta))throw new Error('Graph meta must be an object.');
  const required=(r,k,label)=>{if(typeof r[k]!=='string'||!r[k].trim())throw new Error(`${label}: ${k} must be a non-empty string.`);};
  const stamp=(r,label)=>{
    if(r.source!==undefined && typeof r.source!=='string')throw new Error(`${label}: source must be text.`);
    if(r.last_modified){
      if(typeof r.last_modified!=='string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(r.last_modified) || Number(r.last_modified.slice(11,13))>23 || !parseISODate(r.last_modified.slice(0,10)) || !Number.isFinite(Date.parse(r.last_modified)))throw new Error(`${label}: invalid last_modified timestamp.`);
      r.last_modified=new Date(r.last_modified).toISOString();
    } else if(r.last_modified!==undefined && r.last_modified!=='')throw new Error(`${label}: invalid last_modified timestamp.`);
  };
  const ids=new Set(), edgeIds=new Set();
  for(const n of graph.nodes){
    if(!object(n))throw new Error('Each node must be an object.');
    for(const k of ['id','type','title'])required(n,k,'Node');
    if(ids.has(n.id))throw new Error(`Duplicate node id: ${n.id}`);ids.add(n.id);
    if(n.tags===undefined)n.tags=[];
    if(!Array.isArray(n.tags)||n.tags.some(t=>typeof t!=='string'))throw new Error(`Node ${n.id}: tags must be an array of strings.`);
    if(n.props===undefined)n.props={};
    if(!object(n.props))throw new Error(`Node ${n.id}: props must be an object.`);
    for(const [key,v] of Object.entries(n.props)){
      if(v!==null && !['string','number','boolean'].includes(typeof v))throw new Error(`Node ${n.id}: property ${key} must be text, a finite number, boolean or null.`);
      if(typeof v==='number'&&!Number.isFinite(v))throw new Error(`Node ${n.id}: invalid number ${key}.`);
      if(['target_date','review_due','decision_date'].includes(key)&&v!==''&&v!==null&&!parseISODate(v))throw new Error(`Node ${n.id}: invalid ${key}; use a real YYYY-MM-DD date.`);
      if(['risk_score','review_cycle'].includes(key)&&v!==''&&v!==null){
        if(!['number','string'].includes(typeof v)||(typeof v==='string'&&!v.trim())||!Number.isFinite(Number(v))||Number(v)<0)throw new Error(`Node ${n.id}: ${key} must be non-negative and finite.`);
        n.props[key]=Number(v);
      }
    }
    stamp(n,`Node ${n.id}`);
  }
  for(const e of graph.edges){
    if(!object(e))throw new Error('Each edge must be an object.');
    for(const k of ['id','from','to','type'])required(e,k,'Edge');
    if(edgeIds.has(e.id))throw new Error(`Duplicate edge id: ${e.id}`);edgeIds.add(e.id);
    if(!ids.has(e.from)||!ids.has(e.to))throw new Error(`Edge ${e.id}: unknown endpoint.`);
    const schema=SCHEMA.edges.find(def=>def.name===e.type);
    if(schema){const from=graph.nodes.find(n=>n.id===e.from),to=graph.nodes.find(n=>n.id===e.to);if(!schema.from.split('|').includes(from.type)||!schema.to.split('|').includes(to.type))throw new Error(`Edge ${e.id}: ${e.type} expects ${schema.from} → ${schema.to}. Use a custom edge type for a different relationship.`);}
    stamp(e,`Edge ${e.id}`);
  }
  return graph;
}
function validateGraph(graph) {
  const warnings=[];
  const knownTypes=new Set(SCHEMA.types.map(t=>t.name));
  const knownEdges=new Set(SCHEMA.edges.map(e=>e.name));
  if(graph.nodes.some(n=>!knownTypes.has(n.type)))warnings.push('Custom node types are preserved; built-in queries use the starter type names.');
  if(graph.edges.some(e=>!knownEdges.has(e.type)))warnings.push('Custom edge types are preserved; built-in queries use the starter relationship names.');
  return warnings;
}

function canonicalGraphHash(graph) {
  const nodes = (graph.nodes || [])
    .slice()
    .sort((a,b)=>a.id.localeCompare(b.id))
    .map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      tags: (n.tags || []).slice().sort(),
      props: Object.fromEntries(Object.entries(n.props || {}).sort(([a],[b])=>a.localeCompare(b))),
      source: n.source || '',
      last_modified: n.last_modified || ''
    }));
  const edges = (graph.edges || [])
    .slice()
    .sort((a,b)=>a.id.localeCompare(b.id))
    .map(e => ({
      id: e.id,
      from: e.from,
      to: e.to,
      type: e.type,
      source: e.source || '',
      last_modified: e.last_modified || ''
    }));
  const s = JSON.stringify({nodes, edges});
  return fnv1a32(s);
}

/* =========================
   Lineage tracker
   ========================= */

function makeLineageTracker(idx) {
  const nodes = new Map(); // id -> {ruleIds:Set, reasons:Set}
  const edges = new Map(); // id -> {ruleIds:Set, reasons:Set}

  function touchNode(id, ruleId, reason) {
    if (!id) return;
    const n = idx.nodesById.get(id);
    if (!n) return;
    if (!nodes.has(id)) nodes.set(id, {ruleIds: new Set(), reasons: new Set()});
    const entry = nodes.get(id);
    if (ruleId) entry.ruleIds.add(ruleId);
    if (reason) entry.reasons.add(reason);
  }

  function touchEdge(edgeOrId, ruleId, reason) {
    const e = (typeof edgeOrId === 'string') ? idx.edgesById.get(edgeOrId) : edgeOrId;
    if (!e) return;
    if (!edges.has(e.id)) edges.set(e.id, {ruleIds: new Set(), reasons: new Set()});
    const entry = edges.get(e.id);
    if (ruleId) entry.ruleIds.add(ruleId);
    if (reason) entry.reasons.add(reason);
    // ensure endpoint nodes are tracked too (so the map is consistent)
    touchNode(e.from, ruleId, `via ${e.type} → ${e.to}`);
    touchNode(e.to, ruleId, `via ${e.type} ← ${e.from}`);
  }

  return {
    includeNode: touchNode,
    includeEdge: touchEdge,
    nodeMap: nodes,
    edgeMap: edges
  };
}

/* =========================
   Graph helpers for queries
   ========================= */

function getNode(idx, id) { return idx.nodesById.get(id) || null; }
function out(idx, id, type=null) {
  const list = idx.outEdges.get(id) || [];
  return type ? list.filter(e => e.type === type) : list;
}
function inn(idx, id, type=null) {
  const list = idx.inEdges.get(id) || [];
  return type ? list.filter(e => e.type === type) : list;
}
function nodeProp(n, key, fallback='') {
  return (n && n.props && n.props[key] !== undefined && n.props[key] !== null) ? n.props[key] : fallback;
}
function nodeTags(n) { return (n && n.tags) ? n.tags : []; }

function hasApprovedMitigation(idx, riskId) {
  const mitigations = out(idx, riskId, 'mitigated_by').map(e => getNode(idx, e.to)).filter(n=>n?.type==='Control');
  for (const c of mitigations) {
    const st = safeStr(nodeProp(c, 'state', '')).toLowerCase();
    if (st === 'approved') return true;
  }
  return false;
}

function findMitigations(idx, riskId) {
  return out(idx, riskId, 'mitigated_by').map(e => getNode(idx, e.to)).filter(n=>n?.type==='Control');
}

function findEvidenceForControl(idx, controlId) {
  return out(idx, controlId, 'verified_by').map(e => getNode(idx, e.to)).filter(n=>n?.type==='Evidence');
}

function findEvidenceForDecision(idx, decisionId) {
  return out(idx, decisionId, 'verified_by').map(e => getNode(idx, e.to)).filter(n=>n?.type==='Evidence');
}

function riskSeverity(n) {
  const v = Number(nodeProp(n, 'risk_score', 0));
  return Number.isFinite(v) ? v : 0;
}

function traverseBFS(idx, startIds, opts) {
  // opts: {direction:'in'|'out'|'both', edgeTypes:[], maxDepth:number, stopTypes:Set?}
  const direction = opts.direction || 'out';
  const edgeTypes = opts.edgeTypes || null; // null => any
  const maxDepth = Number.isFinite(opts.maxDepth) ? opts.maxDepth : 1;
  const stopTypes = opts.stopTypes || null;

  const visited = new Set();
  const visitedEdges = new Set();
  const q = [];

  for (const s of startIds) {
    if (!s) continue;
    visited.add(s);
    q.push({id:s, depth:0});
  }

  while (q.length) {
    const {id, depth} = q.shift();
    if (depth >= maxDepth) continue;

    const nextEdges = [];
    if (direction === 'out' || direction === 'both') nextEdges.push(...out(idx, id));
    if (direction === 'in' || direction === 'both') nextEdges.push(...inn(idx, id));

    for (const e of nextEdges) {
      if (edgeTypes && !edgeTypes.includes(e.type)) continue;
      visitedEdges.add(e.id);

      const nextId = (e.from === id) ? e.to : e.from;
      const nextNode = getNode(idx, nextId);
      if (!nextNode) continue;

      if (!visited.has(nextId)) {
        visited.add(nextId);

        // stopTypes: include node but don't expand
        const stopHere = stopTypes && stopTypes.has(nextNode.type);
        q.push({id: nextId, depth: stopHere ? maxDepth : depth+1});
      }
    }
  }

  return {nodeIds: visited, edgeIds: visitedEdges};
}

/* =========================
   Templates (roles + reusable views)
   ========================= */

const ROLES = ['PMO', 'Risk', 'Engineering', 'All'];

const TEMPLATES = [
  {
    id: 'pmo_milestones_at_risk_90d',
    role: 'PMO',
    version: '2.0.0',
    name: 'Milestones at risk (next 90 days; upstream open hazards; no approved mitigation)',
    description: 'PMO view: upcoming milestones where upstream work has open hazards and no approved mitigation.',
    paramDefs: [
      {key:'window_days', label:'Window (days)', type:'number', min:1, max:365, default:90},
      {key:'open_states', label:'Risk states treated as “open”', type:'multiselect', options:['Open','Active'], default:['Open']},
      {key:'max_depth', label:'Upstream traversal depth', type:'number', min:1, max:6, default:3},
    ],
    run: (ctx) => {
      const {idx, today, params, lineage, computed, addRule, extras} = ctx;
      const windowDays = Number(params.window_days || 90);
      const end = addDays(today, windowDays);

      addRule({
        id: 'R1',
        title: 'Upcoming milestones in time window',
        detail: {type:'Milestone', target_date_between:[formatISODate(today), formatISODate(end)]}
      });

      const openStates = new Set((params.open_states || ['Open']).map(s=>String(s).toLowerCase()));
      const maxDepth = Number(params.max_depth || 3);

      addRule({
        id: 'R2',
        title: 'Traverse upstream dependencies',
        detail: {from:'Milestone', direction:'in', edge_types:['depends_on','blocks'], max_depth:maxDepth}
      });

      addRule({
        id: 'R3',
        title: 'Flag milestone at risk if upstream has open risk with no approved mitigation',
        detail: {risk_open_states:Array.from(openStates), mitigation_state_required:'Approved'}
      });

      const milestones = (Array.from(idx.nodesById.values()))
        .filter(n => n.type === 'Milestone')
        .filter(m => {
          const td = parseISODate(nodeProp(m,'target_date',''));
          return td && td.getTime() >= today.getTime() && td.getTime() <= end.getTime();
        });

      const flaggedMilestones = [];

      for (const m of milestones) {
        const mId = m.id;
        const upstream = traverseBFS(idx, [mId], {direction:'in', edgeTypes:['depends_on','blocks'], maxDepth});
        const qualifies = [...upstream.nodeIds].filter(id=>id!==mId).some(id=>inn(idx,id,'introduces_risk').some(e=>{const risk=getNode(idx,e.from);return risk?.type==='Risk' && openStates.has(safeStr(nodeProp(risk,'state','')).toLowerCase()) && !hasApprovedMitigation(idx,risk.id);}));
        if(!qualifies)continue;
        lineage.includeNode(mId, 'R1', 'Milestone in time window');
        for (const eId of upstream.edgeIds) lineage.includeEdge(eId, 'R2', 'Upstream traversal evidence');

        const upstreamNodes = Array.from(upstream.nodeIds).map(id => getNode(idx,id)).filter(Boolean)
          .filter(n => n.id !== mId);

        let maxRisk = 0;
        const unmitigatedIds = new Set();

        for (const u of upstreamNodes) {
          lineage.includeNode(u.id, 'R2', `Upstream of milestone ${mId}`);

          const incomingRiskEdges = inn(idx, u.id, 'introduces_risk');
          for (const e of incomingRiskEdges) {
            const r = getNode(idx, e.from);
            if (!r || r.type !== 'Risk') continue;

            const st = safeStr(nodeProp(r,'state','')).toLowerCase();
            if (!openStates.has(st)) continue;

            const approved = hasApprovedMitigation(idx, r.id);
            const sev = riskSeverity(r);
            maxRisk = Math.max(maxRisk, sev);

            lineage.includeEdge(e, 'R3', `Risk ${r.id} affects upstream node ${u.id}`);
            lineage.includeNode(r.id, 'R3', approved ? 'Open risk (mitigated)' : 'Open risk (unmitigated)');

            const mitigations = findMitigations(idx, r.id);
            for (const c of mitigations) {
              for(const edge of out(idx,r.id,'mitigated_by').filter(e=>e.to===c.id))lineage.includeEdge(edge,'R3','Linked mitigation/control');
            }

            if (!approved) {
              unmitigatedIds.add(r.id);
            }
          }
        }

        const unmitigatedCount = unmitigatedIds.size;
        if (unmitigatedCount > 0) {
          flaggedMilestones.push(mId);
          computed.set(mId, {milestone_max_risk_score_all: maxRisk, milestone_unmitigated_risks: unmitigatedCount});
          lineage.includeNode(mId, 'R3', `At risk: ${unmitigatedCount} upstream unmitigated risk(s)`);
        }
      }

      for (const m of milestones) {
        if (!flaggedMilestones.includes(m.id)) {
          const entry = lineage.nodeMap.get(m.id);
          if (entry && entry.ruleIds.size === 1 && entry.ruleIds.has('R1')) {
            lineage.nodeMap.delete(m.id);
          }
        }
      }

      extras.notes.push(`Flagged milestones: ${flaggedMilestones.length}`);
      extras.notes.push('The maximum risk score covers all matching open risks upstream of a flagged milestone, including risks with a Control labelled Approved. The unmitigated count excludes those risks.');

      const rows = flaggedMilestones.map(id => {
        const m = getNode(idx,id);
        const c = computed.get(id) || {};
        return [
          id,
          m ? m.title : '',
          safeStr(nodeProp(m,'target_date','')),
          safeStr(c.milestone_unmitigated_risks || 0),
          safeStr(c.milestone_max_risk_score_all || 0)
        ];
      });
      if (rows.length) {
        extras.tables.push({
          title: 'Milestone risk summary (computed)',
          columns: ['id','milestone','target_date','unmitigated_risks','max_risk_score_all'],
          rows
        });
      }

      ctx.sortSpec = [
        {key:'milestone_max_risk_score_all', dir:'desc', computed:true},
        {key:'target_date', dir:'asc', computed:false},
        {key:'id', dir:'asc', computed:false}
      ];
    }
  },

  {
    id: 'risk_unowned_red_hazards_on_interfaces',
    role: 'Risk',
    version: '2.0.0',
    name: 'Red hazards on interfaces (optional missing-owner filter)',
    description: 'Find interfaces with risks above your score threshold, optionally requiring a blank owner; bring linked controls and review dates.',
    paramDefs: [
      {key:'red_threshold', label:'Red threshold (risk_score ≥)', type:'number', min:1, max:100, default:16},
      {key:'require_owner', label:'Only risks with a blank owner', type:'select', options:[{value:'yes', label:'Yes (missing owner flags)'},{value:'no', label:'No'}], default:'yes'}
    ],
    run: (ctx) => {
      const {idx, lineage, computed, addRule, params} = ctx;
      const red = Number(params.red_threshold || 16);
      const requireOwner = (params.require_owner || 'yes') === 'yes';

      addRule({id:'R1', title:'Find interface nodes', detail:{type:'Interface'}});
      addRule({id:'R2', title:'Attach risks that introduce_risk to interface', detail:{edge:'introduces_risk', direction:'in'}});
      addRule({id:'R3', title:'Keep interfaces with matching red risk', detail:{risk_score_gte:red, owner_missing:requireOwner}});

      const interfaces = Array.from(idx.nodesById.values()).filter(n => n.type === 'Interface');

      for (const itf of interfaces) {
        const riskEdges = inn(idx, itf.id, 'introduces_risk');
        const redUnownedRisks = [];

        for (const e of riskEdges) {
          const r = getNode(idx, e.from);
          if (!r || r.type !== 'Risk') continue;

          const score = riskSeverity(r);
          if (score < red) continue;

          const owner = safeStr(nodeProp(r,'owner','')).trim();
          const missing = owner === '';
          if(requireOwner && !missing)continue;
          redUnownedRisks.push(r.id);

          lineage.includeEdge(e, 'R2', `Risk ${r.id} affects interface ${itf.id}`);
          lineage.includeNode(r.id, 'R2', `Risk score ${score}`);
        }

        if (redUnownedRisks.length >= 1) {
          lineage.includeNode(itf.id, 'R3', `Interface has ${redUnownedRisks.length} matching red risk(s)`);
          for (const rId of redUnownedRisks) {
            const r = getNode(idx, rId);
            if (!r) continue;

            computed.set(rId, {owner_missing: !safeStr(nodeProp(r,'owner','')).trim()});
            const mitigations = findMitigations(idx, rId);

            if (mitigations.length === 0) {
              computed.set(rId, {...(computed.get(rId)||{}), has_mitigation:false});
            } else {
              computed.set(rId, {...(computed.get(rId)||{}), has_mitigation:true});
            }

            for (const c of mitigations) {
              for(const edge of out(idx,rId,'mitigated_by').filter(e=>e.to===c.id))lineage.includeEdge(edge,'R3','Linked control');
              const reviewDue = safeStr(nodeProp(c,'review_due',''));
              if (reviewDue) computed.set(c.id, {control_review_due: reviewDue});
            }
          }
        }
      }

      ctx.sortSpec = [
        {key:'risk_score', dir:'desc', computed:false},
        {key:'review_due', dir:'asc', computed:false},
        {key:'id', dir:'asc', computed:false}
      ];
    }
  },

  {
    id: 'eng_asset_interfaces_stale_proposed_changes',
    role: 'Engineering',
    version: '2.0.0',
    name: 'Design interfaces touching asset X with proposed changes > 14 days',
    description: 'Engineering view: interfaces for a chosen asset with change requests in “Proposed” older than N days.',
    paramDefs: [
      {key:'asset', label:'Asset', type:'select', optionsFn:'assets', default:''},
      {key:'age_days', label:'Proposed age > (days)', type:'number', min:1, max:365, default:14},
    ],
    run: (ctx) => {
      const {idx, lineage, computed, addRule, params, today, extras} = ctx;
      const asset = safeStr(params.asset || '').trim();
      const ageDays = Number(params.age_days || 14);

      addRule({id:'R1', title:'Filter interfaces touching chosen asset', detail:{type:'Interface', asset}});
      addRule({id:'R2', title:'Attach decisions that inform interface', detail:{edge:'informs', direction:'in'}});
      addRule({id:'R3', title:'Keep Proposed decisions older than age threshold', detail:{change_state:'Proposed', older_than_days:ageDays}});

      const interfaces = Array.from(idx.nodesById.values()).filter(n => n.type === 'Interface');

      for (const itf of interfaces) {
        if (asset && safeStr(nodeProp(itf,'asset','')).trim() !== asset) continue;
        lineage.includeNode(itf.id, 'R1', 'Interface touches asset');

        const decisionEdges = inn(idx, itf.id, 'informs');
        let kept = 0;

        for (const e of decisionEdges) {
          const d = getNode(idx, e.from);
          if (!d || d.type !== 'Decision') continue;

          const cs = safeStr(nodeProp(d,'change_state', nodeProp(d,'state',''))).toLowerCase();
          if (cs !== 'proposed') continue;

          const dd = parseISODate(nodeProp(d,'decision_date',''));
          if (!dd) continue;

          const age = diffDays(dd, today);
          computed.set(d.id, {decision_age_days: age});

          if (age > ageDays) {
            kept++;
            lineage.includeEdge(e, 'R2', `Decision ${d.id} informs interface ${itf.id}`);
            lineage.includeNode(d.id, 'R3', `Proposed for ${age} days`);

            const ev = findEvidenceForDecision(idx, d.id);
            computed.set(d.id, {...(computed.get(d.id)||{}), evidence_count: ev.length});
          }
        }

        if (kept === 0) {
          const entry = lineage.nodeMap.get(itf.id);
          if (entry && entry.ruleIds.size === 1 && entry.ruleIds.has('R1')) lineage.nodeMap.delete(itf.id);
        } else {
          extras.notes.push(`Interface ${itf.id} has ${kept} stale proposed change(s).`);
        }
      }

      ctx.sortSpec = [
        {key:'decision_age_days', dir:'desc', computed:true},
        {key:'id', dir:'asc', computed:false}
      ];
    }
  },

  {
    id: 'tpl_90_day_risk_window',
    role: 'All',
    version: '2.0.0',
    name: '90‑Day Risk Window',
    description: 'Interfaces due in [T, T+N] with a linked risk in the selected hazard tags and no Control labelled Approved. Risk state is not filtered in this template.',
    paramDefs: [
      {key:'window_days', label:'Window (days)', type:'number', min:1, max:365, default:90},
      {key:'hazard_tags', label:'Hazard tags', type:'multiselect', options:['safety','schedule'], default:['safety','schedule']},
    ],
    run: (ctx) => {
      const {idx, lineage, computed, addRule, params, today} = ctx;
      const windowDays = Number(params.window_days || 90);
      const end = addDays(today, windowDays);
      const hazardTags = new Set((params.hazard_tags || ['safety','schedule']).map(s=>String(s).toLowerCase()));

      addRule({id:'R1', title:'Interfaces in time window', detail:{type:'Interface', target_date_between:[formatISODate(today), formatISODate(end)]}});
      addRule({id:'R2', title:'Hazards affecting interface with matching hazard_tag', detail:{edge:'introduces_risk', direction:'in', hazard_tags:Array.from(hazardTags)}});
      addRule({id:'R3', title:'Keep where no approved mitigation exists', detail:{mitigation_state_not:'Approved'}});

      const interfaces = Array.from(idx.nodesById.values()).filter(n => n.type === 'Interface');

      for (const itf of interfaces) {
        const td = parseISODate(nodeProp(itf,'target_date',''));
        if (!td || td < today || td > end) continue;

        const riskEdges = inn(idx, itf.id, 'introduces_risk');
        let keptRisks = 0;

        for (const e of riskEdges) {
          const r = getNode(idx, e.from);
          if (!r || r.type !== 'Risk') continue;

          const tag = safeStr(nodeProp(r,'hazard_tag','')).toLowerCase();
          if (!hazardTags.has(tag)) continue;

          const approved = hasApprovedMitigation(idx, r.id);
          if (!approved) {
            keptRisks++;
            lineage.includeNode(itf.id, 'R1', 'Interface in time window');
            lineage.includeEdge(e, 'R2', `Risk ${r.id} matches hazard_tag ${tag}`);
            lineage.includeNode(r.id, 'R2', 'Hazard in scope');
            computed.set(r.id, {approved_mitigation:false});

            const mitigations = findMitigations(idx, r.id);
            for(const edge of out(idx,r.id,'mitigated_by'))lineage.includeEdge(edge,'R3','Linked control (not approved)');
          }
        }

        if (keptRisks > 0) computed.set(itf.id, {unmitigated_hazards: keptRisks});
      }

      ctx.sortSpec = [
        {key:'unmitigated_hazards', dir:'desc', computed:true},
        {key:'target_date', dir:'asc', computed:false},
        {key:'id', dir:'asc', computed:false}
      ];
    }
  },

  {
    id: 'tpl_critical_path_watch',
    role: 'All',
    version: '2.0.0',
    name: 'Unfinished milestone dependencies',
    description: 'Milestones with an inbound WorkPackage predecessor in a selected unfinished state. This checks supplied links and states; it does not compute durations, float or a critical path.',
    paramDefs: [
      {key:'not_done_states', label:'Treat these task states as “not done”', type:'multiselect', options:['NotStarted','InProgress','Blocked'], default:['NotStarted','InProgress','Blocked']},
    ],
    run: (ctx) => {
      const {idx, lineage, computed, addRule, params, extras} = ctx;
      const notDone = new Set((params.not_done_states || []).map(s=>String(s).toLowerCase()));

      addRule({id:'R1', title:'Scan milestones', detail:{type:'Milestone'}});
      addRule({id:'R2', title:'Check inbound depends_on from WorkPackage', detail:{edge:'depends_on', direction:'in', from_type:'WorkPackage'}});
      addRule({id:'R3', title:'Keep milestones with a task in a selected unfinished state', detail:{task_states:Array.from(notDone)}});

      const milestones = Array.from(idx.nodesById.values()).filter(n => n.type === 'Milestone');

      for (const m of milestones) {
        const inbound = inn(idx, m.id, 'depends_on');
        const blockingTasks = new Set();

        for (const e of inbound) {
          const t = getNode(idx, e.from);
          if (!t || t.type !== 'WorkPackage') continue;

          const st = safeStr(nodeProp(t,'state','')).toLowerCase();
          const notDoneFlag = (st !== 'done') && notDone.has(st);

          if (notDoneFlag) {
            blockingTasks.add(t.id);
            lineage.includeEdge(e, 'R2', `Task ${t.id} depends_on milestone ${m.id}`);
            lineage.includeNode(t.id, 'R2', `Task state=${nodeProp(t,'state','')}`);
          }
        }

        if (blockingTasks.size > 0) {
          lineage.includeNode(m.id, 'R3', `${blockingTasks.size} upstream task(s) not done`);
          computed.set(m.id, {blocking_tasks: blockingTasks.size});
          extras.notes.push(`Milestone ${m.id} has ${blockingTasks.size} blocking task(s).`);
        }
      }

      ctx.sortSpec = [
        {key:'blocking_tasks', dir:'desc', computed:true},
        {key:'target_date', dir:'asc', computed:false},
        {key:'id', dir:'asc', computed:false}
      ];
    }
  },

  {
    id: 'tpl_owner_load',
    role: 'All',
    version: '2.0.0',
    name: 'Owner Load',
    description: 'Risks grouped by owner, with review_due dates earlier than today counted as overdue. Counts do not measure effort, and missing dates are not treated as overdue.',
    paramDefs: [
      {key:'include_unowned', label:'Include unowned risks', type:'select', options:[{value:'yes', label:'Yes'},{value:'no', label:'No'}], default:'yes'}
    ],
    run: (ctx) => {
      const {idx, lineage, computed, addRule, params, today, extras} = ctx;
      const includeUnowned = (params.include_unowned || 'yes') === 'yes';

      addRule({id:'R1', title:'Select risks', detail:{type:'Risk'}});
      addRule({id:'R2', title:'Compute overdue review if review_due < today', detail:{review_due_before: formatISODate(today)}});

      const risks = Array.from(idx.nodesById.values()).filter(n => n.type === 'Risk');

      const byOwner = new Map();
      for (const r of risks) {
        const owner = safeStr(nodeProp(r,'owner','')).trim();
        if (!includeUnowned && owner === '') continue;

        const rd = parseISODate(nodeProp(r,'review_due',''));
        const breach = rd ? (rd.getTime() < today.getTime()) : false;

        computed.set(r.id, {review_overdue: breach, owner_group: owner || '(unowned)'});
        lineage.includeNode(r.id, 'R1', 'Risk included');

        const key = owner || '(unowned)';
        if (!byOwner.has(key)) byOwner.set(key, {count:0, breaches:0});
        byOwner.get(key).count++;
        if (breach) byOwner.get(key).breaches++;
      }

      const owners = stableSort(Array.from(byOwner.entries()), (a,b)=> (b[1].count - a[1].count) || a[0].localeCompare(b[0]));
      extras.tables.push({
        title: 'Owner risk count and overdue reviews (not workload effort)',
        columns: ['owner','risk_count','overdue_reviews'],
        rows: owners.map(([owner, v]) => [owner, String(v.count), String(v.breaches)])
      });

      ctx.sortSpec = [
        {key:'review_overdue', dir:'desc', computed:true},
        {key:'risk_score', dir:'desc', computed:false},
        {key:'owner', dir:'asc', computed:false},
        {key:'id', dir:'asc', computed:false}
      ];
    }
  },

  {
    id: 'tpl_change_heatmap',
    role: 'All',
    version: '2.0.0',
    name: 'Change Heatmap',
    description: 'Decisions in the last N days without a linked Evidence node, plus any Interfaces they inform. Linked evidence is not assessed for quality.',
    paramDefs: [
      {key:'days', label:'Lookback window (days)', type:'number', min:1, max:365, default:14}
    ],
    run: (ctx) => {
      const {idx, lineage, computed, addRule, params, today} = ctx;
      const days = Number(params.days || 14);
      const start = addDays(today, -days);

      addRule({id:'R1', title:'Select decisions in lookback window', detail:{type:'Decision', decision_date_between:[formatISODate(start), formatISODate(today)]}});
      addRule({id:'R2', title:'Keep decisions without evidence', detail:{verified_by_count:0}});
      addRule({id:'R3', title:'Bring affected interfaces (Decision informs Interface)', detail:{edge:'informs', direction:'out'}});

      const decisions = Array.from(idx.nodesById.values()).filter(n => n.type === 'Decision');

      for (const d of decisions) {
        const dd = parseISODate(nodeProp(d,'decision_date',''));
        if (!dd || dd < start || dd > today) continue;

        const evidence = findEvidenceForDecision(idx, d.id);
        const evCount = evidence.length;
        computed.set(d.id, {evidence_count: evCount, decision_age_days: diffDays(dd, today)});

        if (evCount !== 0) continue;

        lineage.includeNode(d.id, 'R2', 'Recent decision missing evidence');

        const informs = out(idx, d.id, 'informs');
        for (const e of informs) {
          const itf = getNode(idx, e.to);
          if (!itf || itf.type!=='Interface') continue;
          lineage.includeEdge(e, 'R3', `Decision ${d.id} touches ${itf.id}`);
          lineage.includeNode(itf.id, 'R3', 'Touched by decision lacking evidence');
        }
      }

      ctx.sortSpec = [
        {key:'decision_age_days', dir:'asc', computed:true},
        {key:'id', dir:'asc', computed:false}
      ];
    }
  },

  {
    id: 'tpl_assurance_trail',
    role: 'All',
    version: '2.0.0',
    name: 'Assurance Trail',
    description: 'For a selected milestone: traverse upstream → risks → controls → evidence and list missing evidence.',
    paramDefs: [
      {key:'milestone_id', label:'Milestone', type:'select', optionsFn:'milestones', default:''},
      {key:'max_depth', label:'Upstream traversal depth', type:'number', min:1, max:6, default:3},
    ],
    run: (ctx) => {
      const {idx, lineage, computed, addRule, params, extras} = ctx;
      const milestoneId = safeStr(params.milestone_id || '').trim();
      const maxDepth = Number(params.max_depth || 3);

      addRule({id:'R1', title:'Choose milestone', detail:{milestone_id: milestoneId}});
      addRule({id:'R2', title:'Traverse upstream dependencies', detail:{from:'Milestone', direction:'in', edge_types:['depends_on','blocks'], max_depth:maxDepth}});
      addRule({id:'R3', title:'Traverse risk→control→evidence', detail:{path:['introduces_risk','mitigated_by','verified_by']}});

      const m = getNode(idx, milestoneId);
      if (!m) {
        extras.notes.push('No milestone selected (or milestone not found).');
        return;
      }

      lineage.includeNode(milestoneId, 'R1', 'Selected milestone');

      const upstream = traverseBFS(idx, [milestoneId], {direction:'in', edgeTypes:['depends_on','blocks'], maxDepth});
      for (const eId of upstream.edgeIds) lineage.includeEdge(eId, 'R2', 'Upstream traversal evidence');

      const gaps = [];
      const assessedRisks = new Set();

      for (const upId of upstream.nodeIds) {
        if (upId === milestoneId) continue;
        const upNode = getNode(idx, upId);
        if (!upNode) continue;

        const riskEdges = inn(idx, upId, 'introduces_risk');
        for (const e of riskEdges) {
          const r = getNode(idx, e.from);
          if (!r || r.type !== 'Risk') continue;

          lineage.includeEdge(e, 'R3', `Risk ${r.id} affects ${upId}`);
          lineage.includeNode(r.id, 'R3', 'Risk in assurance trail');

          if(assessedRisks.has(r.id))continue; assessedRisks.add(r.id);
          const controls = findMitigations(idx, r.id);
          if (controls.length === 0) {
            gaps.push([r.id, r.title, 'No linked control', '', '']);
            computed.set(r.id, {...(computed.get(r.id)||{}), assurance_gap:true, gap_reason:'No linked control'});
            continue;
          }

          for (const c of controls) {
            for(const edge of out(idx,r.id,'mitigated_by').filter(e=>e.to===c.id))lineage.includeEdge(edge,'R3','Control linked to risk');
            const ev = findEvidenceForControl(idx, c.id);
            const cState = safeStr(nodeProp(c,'state',''));
            if (cState.toLowerCase() === 'approved' && ev.length === 0) {
              gaps.push([r.id, r.title, 'Approved control missing evidence', c.id, c.title]);
              computed.set(c.id, {...(computed.get(c.id)||{}), assurance_gap:true, gap_reason:'Approved control missing evidence'});
            }
            for(const edge of out(idx,c.id,'verified_by'))lineage.includeEdge(edge,'R3','Evidence linked to control');
          }
        }
      }

      if (gaps.length) {
        extras.tables.push({
          title: 'Assurance gaps (computed)',
          columns: ['risk_id','risk_title','gap','control_id','control_title'],
          rows: gaps
        });
      } else {
        extras.notes.push('No missing-control or approved-control-without-linked-evidence gaps found by these rules. Linked evidence has not been evaluated for sufficiency.');
      }

      ctx.sortSpec = [
        {key:'assurance_gap', dir:'desc', computed:true},
        {key:'risk_score', dir:'desc', computed:false},
        {key:'id', dir:'asc', computed:false}
      ];
    }
  }
];

/* =========================
   View builder (cards, links, receipt, exports)
   ========================= */

function defaultParamValues(template, ctxForOptions) {
  const out = {};
  for (const def of (template.paramDefs || [])) {
    if (def.default !== undefined) out[def.key] = def.default;
    else if (def.type === 'multiselect') out[def.key] = [];
    else out[def.key] = '';
  }
  for (const def of (template.paramDefs || [])) {
    if (def.type === 'select' && def.optionsFn) {
      const opts = getDynamicOptions(def.optionsFn, ctxForOptions);
      if (!out[def.key] && opts.length) out[def.key] = opts[0].value;
    }
  }
  return out;
}

function getDynamicOptions(optionsFnName, ctx) {
  const {idx} = ctx;
  if (optionsFnName === 'assets') {
    const assets = uniq(Array.from(idx.nodesById.values())
      .filter(n => n.type === 'Interface')
      .map(n => safeStr(nodeProp(n,'asset','')).trim())
      .filter(Boolean)
    ).sort((a,b)=>a.localeCompare(b));
    return assets.map(a => ({value:a, label:a}));
  }
  if (optionsFnName === 'milestones') {
    const ms = Array.from(idx.nodesById.values()).filter(n=>n.type==='Milestone')
      .sort((a,b)=> (safeStr(nodeProp(a,'target_date',''))).localeCompare(safeStr(nodeProp(b,'target_date',''))) || a.id.localeCompare(b.id));
    return ms.map(m => ({value:m.id, label:`${m.id} — ${m.title}`}));
  }
  return [];
}

function computeDataLineage(graph, includedNodeIds, includedEdgeIds, idx) {
  const sources = new Map(); // source -> count
  let maxLastModified = '';

  function touch(source, last) {
    const s = safeStr(source || 'unknown');
    sources.set(s, (sources.get(s) || 0) + 1);
    const lm = safeStr(last || '');
    if (lm && (!maxLastModified || lm > maxLastModified)) maxLastModified = lm;
  }

  for (const id of includedNodeIds) {
    const n = idx.nodesById.get(id);
    if (!n) continue;
    touch(n.source, n.last_modified);
  }
  for (const id of includedEdgeIds) {
    const e = idx.edgesById.get(id);
    if (!e) continue;
    touch(e.source, e.last_modified);
  }

  return {
    sources: Array.from(sources.entries()).map(([source,count])=>({source,count})).sort((a,b)=>b.count-a.count || a.source.localeCompare(b.source)),
    max_last_modified: maxLastModified || null
  };
}

function compareBySpec(aNode, bNode, spec, computed) {
  const aId = aNode.id, bId = bNode.id;
  const aComp = computed.get(aId) || {};
  const bComp = computed.get(bId) || {};

  for (const s of (spec || [])) {
    const dir = (s.dir || 'asc').toLowerCase();
    let av, bv;

    if (s.computed) {
      av = aComp[s.key];
      bv = bComp[s.key];
    } else {
      av = nodeProp(aNode, s.key, '');
      bv = nodeProp(bNode, s.key, '');
    }

    const an = Number(av), bn = Number(bv);
    const bothNum = Number.isFinite(an) && Number.isFinite(bn) && av !== '' && bv !== '';
    let c = 0;

    if (bothNum) c = an - bn;
    else c = safeStr(av).localeCompare(safeStr(bv));

    if (c !== 0) return dir === 'desc' ? -c : c;
  }

  return aId.localeCompare(bId);
}

function buildSharpcloudView(state, template, runResult) {
  const {graph, idx} = state;
  const {lineage, computed, receiptMeta, linkMode, limit} = runResult;

  const includedNodeIds = Array.from(lineage.nodeMap.keys());
  const includedEdgeEvidenceIds = Array.from(lineage.edgeMap.keys());

  let exportEdgeIds = [];
  if (linkMode === 'complete') {
    const idSet = new Set(includedNodeIds);
    exportEdgeIds = (graph.edges || [])
      .filter(e => idSet.has(e.from) && idSet.has(e.to))
      .map(e => e.id);
  } else {
    exportEdgeIds = includedEdgeEvidenceIds.slice();
  }

  const nodes = includedNodeIds
    .map(id => idx.nodesById.get(id))
    .filter(Boolean);

  const sortSpec = runResult.sortSpec || [
    {key:'risk_score', dir:'desc', computed:false},
    {key:'target_date', dir:'asc', computed:false},
    {key:'id', dir:'asc', computed:false}
  ];

  const nodesSorted = stableSort(nodes, (a,b)=> compareBySpec(a,b,sortSpec,computed));

  const limitedNodes = nodesSorted.slice(0, integerValue(limit,1,2000,'Limit'));
  const keptIds = new Set(limitedNodes.map(n=>n.id));

  const exportEdges = exportEdgeIds
    .map(id => idx.edgesById.get(id))
    .filter(Boolean)
    .filter(e => keptIds.has(e.from) && keptIds.has(e.to))
    .sort((a,b)=> (a.from+a.type+a.to).localeCompare(b.from+b.type+b.to) || a.id.localeCompare(b.id));

  const items = limitedNodes.map(n => {
    const comp = computed.get(n.id) || {};
    const attrs = Object.assign(Object.create(null), n.props || {});

    for (const [k,v] of Object.entries(comp)) {
      let key=k; while(Object.hasOwn(attrs,key))key='computed_'+key; attrs[key]=v;
    }

    return {
      external_id: n.id,
      title: n.title,
      type: n.type,
      tags: (n.tags || []),
      attributes: attrs,
      source: n.source || null,
      last_modified: n.last_modified || null,
    };
  });

  const links = exportEdges.map(e => ({
    external_id: e.id,
    from_external_id: e.from,
    to_external_id: e.to,
    type: e.type
  }));

  const dataLineage = computeDataLineage(graph, keptIds, exportEdges.map(e=>e.id), idx);

  const view = {
    meta: {
      role: receiptMeta.role,
      template_id: receiptMeta.template_id,
      template_version: receiptMeta.template_version,
      template_name: receiptMeta.template_name,
      generated_at: receiptMeta.generated_at,
      today_T: receiptMeta.today_T,
      link_mode: linkMode,
      deterministic_sort: {spec: sortSpec, tie_breaker: 'id'},
      limit,
      items_matched: nodesSorted.length,
      items_exported: limitedNodes.length,
      truncated: limitedNodes.length < nodesSorted.length,
      graph: {
        graph_id: graph.meta?.graph_id || null,
        graph_version: graph.meta?.graph_version || null,
        graph_hash: receiptMeta.graph_hash,
        node_count: graph.nodes?.length || 0,
        edge_count: graph.edges?.length || 0
      },
      data_lineage: dataLineage
    },
    items,
    links
  };

  return {view, keptIds, exportEdges};
}

function buildReceipt(state, template, runResult, keptIds, exportEdges) {
  const {graph, idx} = state;
  const {lineage, rules, linkMode, limit, todayISOValue, graphHash, sortSpec} = runResult;

  const snapshotAt = runResult.generatedAt;

  const includedNodeIds = Array.from(keptIds);
  const includedEdgeIds = exportEdges.map(e=>e.id);

  const dataLineage = computeDataLineage(graph, includedNodeIds, includedEdgeIds, idx);

  const receipt = {
    template: {
      id: template.id,
      name: template.name,
      version: template.version,
      role: template.role
    },
    snapshot: {
      generated_at: snapshotAt,
      today_T: todayISOValue,
      graph_id: graph.meta?.graph_id || null,
      graph_version: graph.meta?.graph_version || null,
      graph_hash: graphHash,
      node_count: graph.nodes?.length || 0,
      edge_count: graph.edges?.length || 0,
      data_lineage: dataLineage
    },
    rules_receipt: {
      filters_and_logic: rules,
      traversals: rules
        .filter(r => r.detail && (r.detail.edge_types || r.detail.edge || r.detail.path))
        .map(r => ({rule_id:r.id, title:r.title, detail:r.detail}))
    },
    deterministic: {
      link_mode: linkMode,
      sort: {spec: sortSpec || [], tie_breaker: 'id'},
      limit,
      parameters: runResult.params
    },
    outputs: {
      items_matched: lineage.nodeMap.size,
      truncated: includedNodeIds.length < lineage.nodeMap.size,
      items_exported: includedNodeIds.length,
      links_exported: includedEdgeIds.length,
      lineage_edges_used: Array.from(lineage.edgeMap.keys()).length
    }
  };

  const tableRows = [
    ['template.id', template.id],
    ['template.name', template.name],
    ['template.version', template.version],
    ['template.role', template.role],
    ['snapshot.generated_at', receipt.snapshot.generated_at],
    ['snapshot.today_T', receipt.snapshot.today_T],
    ['snapshot.graph_id', receipt.snapshot.graph_id],
    ['snapshot.graph_version', receipt.snapshot.graph_version],
    ['snapshot.graph_hash', receipt.snapshot.graph_hash],
    ['deterministic.link_mode', receipt.deterministic.link_mode],
    ['deterministic.limit', String(receipt.deterministic.limit)],
    ['parameters', JSON.stringify(receipt.deterministic.parameters)],
    ['outputs.items_matched', String(receipt.outputs.items_matched)],
    ['outputs.truncated', String(receipt.outputs.truncated)],
    ['outputs.items_exported', String(receipt.outputs.items_exported)],
    ['outputs.links_exported', String(receipt.outputs.links_exported)],
    ['outputs.lineage_edges_used', String(receipt.outputs.lineage_edges_used)],
  ];

  for (const s of (receipt.snapshot.data_lineage.sources || [])) {
    tableRows.push([`data_lineage.source.${s.source}`, String(s.count)]);
  }
  if (receipt.snapshot.data_lineage.max_last_modified) {
    tableRows.push(['data_lineage.max_last_modified', receipt.snapshot.data_lineage.max_last_modified]);
  }

  for (const r of rules) {
    tableRows.push([`rule.${r.id}.title`, r.title]);
    tableRows.push([`rule.${r.id}.detail`, JSON.stringify(r.detail)]);
  }

  return {receipt, receiptTableRows: tableRows};
}

function buildLineageExports(state, runResult, keptIds, exportEdges) {
  const {idx} = state;
  const {lineage} = runResult;

  const kept = keptIds;

  const nodeRows = [['node_id','type','title','included_by_rules','reasons','source','last_modified','in_exported_view']];
  const edgeRows = [['edge_id','from','to','type','included_by_rules','reasons','source','last_modified']];

  const nodes = Array.from(new Set([...kept, ...lineage.nodeMap.keys()]))
    .map(id => ({id, n: idx.nodesById.get(id), entry: lineage.nodeMap.get(id)}))
    .filter(x => x.n);

  const sortedNodes = nodes.sort((a,b)=> a.id.localeCompare(b.id));

  for (const x of sortedNodes) {
    const ruleIds = x.entry ? Array.from(x.entry.ruleIds).sort().join('|') : '';
    const reasons = x.entry ? Array.from(x.entry.reasons).sort().join(' | ') : '';
    nodeRows.push([
      x.id,
      x.n.type,
      x.n.title,
      ruleIds,
      reasons,
      safeStr(x.n.source || ''),
      safeStr(x.n.last_modified || ''),
      kept.has(x.id) ? 'yes' : 'no'
    ]);
  }

  const exportedEdgeIds = new Set(exportEdges.map(e=>e.id));
  const allEdgeIds = uniq([...Array.from(lineage.edgeMap.keys()), ...Array.from(exportedEdgeIds)]);

  const sortedEdges = allEdgeIds
    .map(id => ({id, e: idx.edgesById.get(id), entry: lineage.edgeMap.get(id)}))
    .filter(x => x.e)
    .sort((a,b)=> a.id.localeCompare(b.id));

  for (const x of sortedEdges) {
    const ruleIds = x.entry ? Array.from(x.entry.ruleIds).sort().join('|') : '';
    const reasons = x.entry ? Array.from(x.entry.reasons).sort().join(' | ') : '';
    const exportedFlag = exportedEdgeIds.has(x.id) ? 'exported' : 'used_only';
    edgeRows.push([
      x.id,
      x.e.from,
      x.e.to,
      `${x.e.type}${exportedFlag ? ` (${exportedFlag})` : ''}`,
      ruleIds,
      reasons,
      safeStr(x.e.source || ''),
      safeStr(x.e.last_modified || '')
    ]);
  }

  return {nodeRows, edgeRows};
}

function buildItemsLinksCSVs(view) {
  const items = view.items || [];
  const links = view.links || [];

  const attrKeys = uniq(items.flatMap(it => Object.keys(it.attributes || {}))).sort((a,b)=>a.localeCompare(b));

  const itemHeader = ['external_id','title','type','tags', ...attrKeys.map(k=>'attribute:'+k)];
  const itemRows = [itemHeader];

  for (const it of items) {
    const row = [
      it.external_id,
      it.title,
      it.type,
      (it.tags || []).join('|'),
      ...attrKeys.map(k => (it.attributes && it.attributes[k] !== undefined) ? it.attributes[k] : '')
    ];
    itemRows.push(row);
  }

  const linkRows = [['external_id','from_external_id','to_external_id','type']];
  for (const l of links) linkRows.push([l.external_id,l.from_external_id,l.to_external_id,l.type]);

  return {
    itemsCsv: spreadsheetCSV(itemRows),
    linksCsv: spreadsheetCSV(linkRows)
  };
}

function buildSchemaCSV() {
  const rows = [['category','name','datatype/from','applies_to/to','description','example']];
  for (const t of SCHEMA.types) rows.push(['type', t.name, '', '', t.description, '']);
  for (const p of SCHEMA.properties) rows.push(['property', p.name, p.datatype, p.applies_to, p.description, p.example || '']);
  for (const e of SCHEMA.edges) rows.push(['edge', e.name, e.from, e.to, e.description, '']);
  return toCSV(rows);
}

function buildSavedSearchStubsJSON() {
  return {
    generated_at: new Date().toISOString(),
    templates: TEMPLATES.map(t => ({
      id: t.id,
      name: t.name,
      role: t.role,
      version: t.version,
      description: t.description,
      parameters: (t.paramDefs || []).map(p => ({
        key: p.key,
        type: p.type,
        label: p.label,
        default: p.default,
        options: p.options || null,
        optionsFn: p.optionsFn || null
      })),
      sort_hint: 'Deterministic sort with id tie-breaker (see receipt).',
      export_hint: 'Use external_id for stable mapping; resolve links via external_id.'
    }))
  };
}

/* =========================
   UI Rendering
   ========================= */

const $ = sel => document.querySelector(sel);

function setTab(tabId) {
  document.querySelectorAll('.tabbtn').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===tabId)));
  document.querySelectorAll('.tabbtn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  document.querySelectorAll('.tabcontent').forEach(d => d.classList.toggle('active', d.id === tabId));
}

function renderSchemaAndSaved(state) {
  const rows = [];
  rows.push(`<div class="small" style="margin-bottom:8px;">Types, properties, and edges you can start with (exportable as schema CSV).</div>`);
  rows.push(`<table><thead><tr><th>Category</th><th>Name</th><th>Applies / From</th><th>To / Datatype</th><th>Description</th></tr></thead><tbody>`);
  for (const t of SCHEMA.types) {
    rows.push(`<tr><td>Type</td><td><span class="mono">${t.name}</span></td><td></td><td></td><td>${t.description}</td></tr>`);
  }
  for (const p of SCHEMA.properties) {
    rows.push(`<tr><td>Property</td><td><span class="mono">${p.name}</span></td><td>${p.applies_to}</td><td>${p.datatype}</td><td>${p.description}</td></tr>`);
  }
  for (const e of SCHEMA.edges) {
    rows.push(`<tr><td>Edge</td><td><span class="mono">${e.name}</span></td><td>${e.from}</td><td>${e.to}</td><td>${e.description}</td></tr>`);
  }
  rows.push(`</tbody></table>`);
  $('#schemaTable').innerHTML = rows.join('');

  $('#savedOut').textContent = JSON.stringify(buildSavedSearchStubsJSON(), null, 2);
}

function renderWarnings(warnings) {
  const el = $('#warnings');
  if (!warnings || !warnings.length) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = `
    <div class="notice">
      <div style="font-weight:600; margin-bottom:4px;">Graph notes</div>
      <div class="mono">${warnings.map(w=>`• ${htmlEscape(w)}`).join('<br>')}</div>
    </div>`;
}

function renderParamForm(template, state) {
  const form = $('#paramForm');
  if (!template) { form.textContent = 'Select a template.'; return; }

  const ctx = {idx: state.idx};
  const defs = template.paramDefs || [];
  if (!defs.length) { form.innerHTML = `<div class="small">No parameters.</div>`; return; }

  const html = [];
  html.push(`<p class="small">${htmlEscape(template.description)}</p><div class="section">`);
  for (const def of defs) {
    const key = def.key;
    const id = `param_${key}`;
    const current = state.params[key];

    if (def.type === 'number') {
      html.push(`
        <label style="margin-bottom:8px;">
          ${def.label}
          <input id="${id}" type="number" min="${def.min ?? ''}" max="${def.max ?? ''}" value="${htmlEscape(current)}" />
        </label>`);
    } else if (def.type === 'text') {
      html.push(`
        <label style="margin-bottom:8px;">
          ${def.label}
          <input id="${id}" type="text" value="${htmlEscape(current)}" />
        </label>`);
    } else if (def.type === 'date') {
      html.push(`
        <label style="margin-bottom:8px;">
          ${def.label}
          <input id="${id}" type="date" value="${htmlEscape(current)}" />
        </label>`);
    } else if (def.type === 'select') {
      let options = def.options || [];
      if (def.optionsFn) options = getDynamicOptions(def.optionsFn, ctx);
      const optObjs = options.map(o => (typeof o === 'string') ? ({value:o, label:o}) : o);

      html.push(`<label style="margin-bottom:8px;">${def.label}<select id="${id}">`);
      for (const o of optObjs) {
        const sel = safeStr(current) === safeStr(o.value) ? 'selected' : '';
        html.push(`<option value="${htmlEscape(o.value)}" ${sel}>${htmlEscape(o.label)}</option>`);
      }
      html.push(`</select></label>`);
    } else if (def.type === 'multiselect') {
      const opts = (def.options || []).map(o => (typeof o === 'string' ? o : o.value));
      const cur = new Set(Array.isArray(current) ? current.map(String) : []);
      html.push(`<div style="margin-bottom:10px;"><div class="small" style="margin-bottom:6px; font-weight:600; color:#222;">${def.label}</div>`);
      for (const o of opts) {
        const checked = cur.has(String(o)) ? 'checked' : '';
        html.push(`
          <label style="display:flex; align-items:center; gap:8px; margin: 4px 0; color:#222;">
            <input type="checkbox" data-multi="${id}" value="${htmlEscape(o)}" ${checked} />
            <span class="mono">${htmlEscape(o)}</span>
          </label>`);
      }
      html.push(`</div>`);
    }
  }
  html.push(`</div>`);
  form.innerHTML = html.join('');

  for (const def of defs) {
    const key = def.key;
    const id = `param_${key}`;
    if (def.type === 'multiselect') {
      document.querySelectorAll(`input[type="checkbox"][data-multi="${id}"]`).forEach(cb => {
        cb.onchange = () => {
          const selected = Array.from(document.querySelectorAll(`input[type="checkbox"][data-multi="${id}"]:checked`)).map(x=>x.value);
          state.params[key] = selected;
        };
      });
    } else {
      const input = document.getElementById(id);
      if (input) {
        input.onchange = () => {
          if (def.type === 'number') state.params[key] = input.value;
          else state.params[key] = input.value;
        };
      }
    }
  }
}

function renderKPIs(state, template, runResult, view, receipt) {
  const kpis = $('#kpis');
  if (!runResult || !view || !receipt) { kpis.innerHTML = ''; return; }
  const types = Object.create(null);
  for (const it of (view.items || [])) types[it.type] = (types[it.type] || 0) + 1;

  const typeSummary = Object.entries(types)
    .sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]))
    .map(([t,c])=>`${t}:${c}`)
    .join(' • ');

  kpis.innerHTML = `
    <div class="box">
      <div class="small">Template</div>
      <div class="num">${template ? template.role : ''}</div>
      <div class="small">${template ? template.name : ''}</div>
    </div>
    <div class="box">
      <div class="small">Items / Links</div>
      <div class="num">${receipt.outputs.items_exported} / ${receipt.outputs.links_exported}</div>
      <div class="small">${htmlEscape(typeSummary || '—')}</div>
    </div>
    <div class="box">
      <div class="small">Snapshot</div>
      <div class="num">${receipt.snapshot.today_T}</div>
      <div class="small mono">graph_hash ${receipt.snapshot.graph_hash}</div>
    </div>
  `;
}

function renderCards(state, runResult, view) {
  const list = $('#cards');
  const q = safeStr($('#searchCards').value || '').trim().toLowerCase();

  if (!view) { list.innerHTML = '<div class="notice">Run a query to see cards.</div>'; return; }

  const items = (view.items || []).slice();
  const filtered = q
    ? items.filter(it => {
        const hay = [
          it.external_id, it.title, it.type,
          ...(it.tags||[]),
          ...Object.entries(it.attributes||{}).map(([k,v])=>`${k}:${v}`)
        ].join(' ').toLowerCase();
        return hay.includes(q);
      })
    : items;

  if (!filtered.length) {
    list.innerHTML = `<div class="notice">No cards match the filter.</div>`;
    return;
  }

  const html = [];
  for (const it of filtered) {
    const attrs = it.attributes || {};
    const keyBits = [];
    if (attrs.state) keyBits.push(`state=${attrs.state}`);
    if (attrs.target_date) keyBits.push(`target=${attrs.target_date}`);
    if (attrs.owner !== undefined) keyBits.push(`owner=${attrs.owner || '(blank)'}`);
    if (attrs.hazard_tag) keyBits.push(`hazard=${attrs.hazard_tag}`);
    if (attrs.risk_score !== undefined) keyBits.push(`risk_score=${attrs.risk_score}`);
    if (attrs.review_due) keyBits.push(`review_due=${attrs.review_due}`);
    if (attrs.asset) keyBits.push(`asset=${attrs.asset}`);

    html.push(`
      <div class="card" role="button" tabindex="0" data-id="${htmlEscape(it.external_id)}">
        <div class="meta">
          <span class="pill">${htmlEscape(it.type)}</span>
          <span class="pill mono">${htmlEscape(it.external_id)}</span>
          ${(it.tags||[]).slice(0,4).map(t=>`<span class="pill">${htmlEscape(t)}</span>`).join('')}
        </div>
        <h4>${htmlEscape(it.title)}</h4>
        <div class="small mono">${htmlEscape(keyBits.join(' • '))}</div>
      </div>
    `);
  }
  list.innerHTML = html.join('');

  list.querySelectorAll('.card').forEach(card => {
    card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();}};
    card.onclick = () => {
      const id = card.dataset.id;
      renderDrilldown(state, runResult, view, id);
    };
  });
}

function renderDrilldown(state, runResult, view, nodeId) {
  const {idx} = state;
  const {lineage} = runResult;
  const it = (view.items || []).find(x=>x.external_id === nodeId);
  const n = idx.nodesById.get(nodeId);

  if (!it || !n) {
    $('#drill').innerHTML = `<div class="notice">Node not found in view.</div>`;
    return;
  }

  const entry = lineage.nodeMap.get(nodeId);
  const rules = entry ? Array.from(entry.ruleIds).sort() : [];
  const reasons = entry ? Array.from(entry.reasons).sort() : [];

  const outLinks = (view.links || []).filter(l => l.from_external_id === nodeId);
  const inLinks = (view.links || []).filter(l => l.to_external_id === nodeId);

  const neighborIds = uniq([
    ...outLinks.map(l => l.to_external_id),
    ...inLinks.map(l => l.from_external_id)
  ]);

  const neighborList = neighborIds
    .map(id => {
      const nn = idx.nodesById.get(id);
      return nn ? `${id} — ${nn.title} (${nn.type})` : id;
    })
    .sort((a,b)=>a.localeCompare(b));

  const attrs = it.attributes || {};
  const attrRows = Object.entries(attrs)
    .sort(([a],[b])=>a.localeCompare(b))
    .map(([k,v])=>`<div class="key mono">${htmlEscape(k)}</div><div class="mono">${htmlEscape(v)}</div>`)
    .join('');

  $('#drill').innerHTML = `
    <div class="panel" style="border-radius:10px; padding:10px;">
      <div class="meta">
        <span class="pill">${htmlEscape(it.type)}</span>
        <span class="pill mono">${htmlEscape(it.external_id)}</span>
        ${(it.tags||[]).map(t=>`<span class="pill">${htmlEscape(t)}</span>`).join('')}
      </div>
      <div style="font-weight:700; margin-bottom:6px;">${htmlEscape(it.title)}</div>

      <div class="small" style="margin-bottom:8px;">
        <div><b>Included by rules:</b> <span class="mono">${rules.join(', ') || '—'}</span></div>
        <div><b>Reasons:</b> ${reasons.length ? `<div class="mono">${reasons.map(r=>`• ${htmlEscape(r)}`).join('<br>')}</div>` : '—'}</div>
      </div>

      <div class="section">
        <h3>Attributes</h3>
        <div class="kv">${attrRows || '<div class="small">No attributes.</div>'}</div>
      </div>

      <div class="section">
        <h3>Neighbors (via exported links)</h3>
        ${neighborList.length
          ? `<div class="mono small">${neighborList.map(x=>`• ${htmlEscape(x)}`).join('<br>')}</div>`
          : `<div class="small">No neighbors in this view.</div>`
        }
      </div>
    </div>
  `;
}

function renderExtras(runResult) {
  const el = $('#extra');
  if (!runResult || !runResult.extras) {
    el.innerHTML = `<div class="small">No additional tables.</div>`;
    return;
  }

  const {extras} = runResult;
  const parts = [];

  if (extras.notes.length) {
    parts.push(`<div class="notice"><b>Notes</b><div class="mono" style="margin-top:6px;">${extras.notes.map(n=>`• ${htmlEscape(n)}`).join('<br>')}</div></div>`);
  }

  if (extras.tables.length) {
    for (const t of extras.tables) {
      const head = `<tr>${t.columns.map(c=>`<th>${c}</th>`).join('')}</tr>`;
      const body = t.rows.map(r=>`<tr>${r.map(v=>`<td class="mono">${htmlEscape(v)}</td>`).join('')}</tr>`).join('');
      parts.push(`<div style="margin-top:10px;"><b>${t.title}</b><table style="margin-top:6px;"><thead>${head}</thead><tbody>${body}</tbody></table></div>`);
    }
  }

  if (!parts.length) parts.push(`<div class="small">No additional tables for this template.</div>`);
  el.innerHTML = parts.join('');
}

function renderReceiptTable(receiptTableRows) {
  const head = `<tr><th style="width:40%;">Key</th><th>Value</th></tr>`;
  const body = receiptTableRows.map(([k,v])=>`<tr><td class="mono">${htmlEscape(k)}</td><td class="mono">${htmlEscape(v)}</td></tr>`).join('');
  $('#receiptTable').innerHTML = `<table><thead>${head}</thead><tbody>${body}</tbody></table>`;
}

function renderLineageTables(lineageExports) {
  const nodes = lineageExports.nodeRows;
  const edges = lineageExports.edgeRows;

  function tableFromRows(rows) {
    const [header, ...rest] = rows;
    const head = `<tr>${header.map(h=>`<th>${h}</th>`).join('')}</tr>`;
    const body = rest.map(r=>`<tr>${r.map(v=>`<td class="mono">${htmlEscape(v)}</td>`).join('')}</tr>`).join('');
    return `<table><thead>${head}</thead><tbody>${body}</tbody></table>`;
  }

  $('#lineageNodes').innerHTML = tableFromRows(nodes);
  $('#lineageEdges').innerHTML = tableFromRows(edges);
}

/* =========================
   Running templates
   ========================= */

function runCurrent(state) {
  const role = $('#role').value;
  const templateId = $('#template').value;
  const template = TEMPLATES.find(t => t.id === templateId);

  if(!template)throw new Error('Choose a template.');
  const todayISOValue = $('#today').value;
  const today = parseISODate(todayISOValue);
  if(!today)throw new Error('Choose a valid query date.');
  const params = validateParams(template,state.params,state.idx);
  const linkMode = $('#linkMode').value;
  const limit = integerValue($('#limit').value,1,2000,'Limit');
  const generatedAt = new Date().toISOString();

  const graphHash = canonicalGraphHash(state.graph);

  const rules = [];
  function addRule(r) { rules.push({id:r.id, title:r.title, detail:r.detail || {}}); }

  const lineage = makeLineageTracker(state.idx);
  const computed = new Map(); // nodeId -> computed attrs
  const extras = {notes:[], tables:[]};

  const ctx = {
    graph: state.graph,
    idx: state.idx,
    today,
    params,
    lineage,
    computed,
    addRule,
    extras,
    sortSpec: null
  };

  if (template && template.run) template.run(ctx);

  const sortSpec = ctx.sortSpec || [
    {key:'risk_score', dir:'desc', computed:false},
    {key:'target_date', dir:'asc', computed:false},
    {key:'id', dir:'asc', computed:false}
  ];

  const receiptMeta = {
    role,
    template_id: template.id,
    template_version: template.version,
    template_name: template.name,
    generated_at: generatedAt,
    today_T: todayISOValue,
    graph_hash: graphHash
  };

  const {view, keptIds, exportEdges} = buildSharpcloudView(
    state,
    template,
    {lineage, computed, receiptMeta, linkMode, limit, sortSpec}
  );

  const {receipt, receiptTableRows} = buildReceipt(
    state,
    template,
    {lineage, rules, linkMode, limit, todayISOValue, graphHash, sortSpec, params, generatedAt},
    keptIds,
    exportEdges
  );

  const lineageExports = buildLineageExports(state, {lineage}, keptIds, exportEdges);

  const {itemsCsv, linksCsv} = buildItemsLinksCSVs(view);
  const receiptCsv = spreadsheetCSV([['key','value'], ...receiptTableRows]);

  const result = {
    template,
    role,
    todayISOValue,
    linkMode,
    limit,
    graphHash,
    sortSpec,
    lineage,
    computed,
    rules,
    extras,
    view,
    receipt,
    receiptTableRows,
    lineageExports,
    itemsCsv,
    linksCsv,
    receiptCsv
  };

  state.lastResult = result;
  state.dirty = false;
  $('#drill').textContent = 'Choose a card to inspect its inclusion reasons.';
  announce(`Query complete: ${view.items.length} of ${view.meta.items_matched} query items exported${view.meta.truncated ? ' (limit applied)' : ''}.`);

  $('#viewOut').textContent = JSON.stringify(view, null, 2);
  $('#receiptOut').textContent = JSON.stringify(receipt, null, 2);
  renderReceiptTable(receiptTableRows);
  renderLineageTables(lineageExports);
  renderExtras(result);
  renderCards(state, result, view);
  renderKPIs(state, template, result, view, receipt);

  return result;
}

/* =========================
   Downloads
   ========================= */

async function copyText(text) {
  const box=document.getElementById('copyFallback');box.hidden=false;box.value=text;
  announce('Copying… The text is also available below for manual copying.');
  let timer;
  try{
    await Promise.race([navigator.clipboard.writeText(text), new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Clipboard timed out')),1200);})]);
    announce('Copied. The same text remains available below.');
  }catch {announce('Copy manually from the text box below.');box.focus();box.select();}
  finally {clearTimeout(timer);}
}

function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 3000);
  announce(`Download requested: ${filename}`);
}

function downloadText(text, filename, mime='text/plain') {
  downloadBlob(new Blob([text], {type:mime}), filename);
}

function stamp() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = pad2(d.getUTCMonth()+1);
  const dd = pad2(d.getUTCDate());
  const hh = pad2(d.getUTCHours());
  const mi = pad2(d.getUTCMinutes());
  return `${yyyy}${mm}${dd}-${hh}${mi}Z`;
}

function buildAuditZip(state) {
  const r = state.lastResult;
  if (!r) return null;

  const zip = new ZipBuilder();
  const root = `audit-bundle/${r.view.meta.template_id}/${stamp()}/`;

  const manifest = {
    generated_at: new Date().toISOString(),
    role: r.role,
    template_id: r.template.id,
    template_version: r.template.version,
    today_T: r.todayISOValue,
    graph_hash: r.graphHash,
    files: [
      `${root}sharpcloud-view.json`,
      `${root}items.csv`,
      `${root}links.csv`,
      `${root}receipt.json`,
      `${root}receipt_table.csv`,
      `${root}lineage_nodes.csv`,
      `${root}lineage_edges.csv`,
      `${root}schema.csv`,
      `${root}saved-searches.json`,
      `${root}README.txt`,
      `${root}manifest.json`
    ]
  };

  const readme = [
    'Audit bundle contents',
    '=====================',
    '',
    'sharpcloud-view.json',
    '  - Items + links output for import. Items carry stable external_id.',
    '',
    'items.csv / links.csv',
    '  - Generic flat exports: adapt field mapping and verify destination import. Not a verified SharpCloud format.',
    '  - Spreadsheet-formula-leading text is prefixed with an apostrophe in CSV downloads; JSON retains exact values.',
    '  - FNV-1a checksum is not a cryptographic signature, authentication, or proof of approval.',
    '',
    'receipt.json / receipt_table.csv',
    '  - Rule receipt: filters, traversals, windows, deterministic sort/limit, snapshot + lineage.',
    '',
    'lineage_nodes.csv / lineage_edges.csv',
    '  - Lineage map: which rules included each node/edge, and the evidence edges traversed.',
    '',
    'schema.csv',
    '  - Starter schema (types/properties/edges).',
    '',
    'saved-searches.json',
    '  - Template stubs you can port into your own query framework / saved searches.',
    ''
  ].join('\n');

  zip.add(`${root}manifest.json`, JSON.stringify(manifest, null, 2));
  zip.add(`${root}sharpcloud-view.json`, JSON.stringify(r.view, null, 2));
  zip.add(`${root}items.csv`, r.itemsCsv);
  zip.add(`${root}links.csv`, r.linksCsv);
  zip.add(`${root}receipt.json`, JSON.stringify(r.receipt, null, 2));
  zip.add(`${root}receipt_table.csv`, r.receiptCsv);
  zip.add(`${root}lineage_nodes.csv`, spreadsheetCSV(r.lineageExports.nodeRows));
  zip.add(`${root}lineage_edges.csv`, spreadsheetCSV(r.lineageExports.edgeRows));
  zip.add(`${root}schema.csv`, buildSchemaCSV());
  zip.add(`${root}saved-searches.json`, JSON.stringify(buildSavedSearchStubsJSON(), null, 2));
  zip.add(`${root}README.txt`, readme);

  return zip.buildBlob();
}

function printReceipt(state) {
  const r = state.lastResult;
  if (!r) return;

  const html = `
<!doctype html><meta charset="utf-8" />
<title>Receipt — ${r.template.id}</title>
<style>
  body{font-family:system-ui,Segoe UI,Arial;margin:18px;}
  h1{font-size:18px;margin:0 0 10px;}
  .small{color:#666;font-size:12px;margin-bottom:10px;}
  table{border-collapse:collapse;width:100%;font-size:12px;}
  th,td{border:1px solid #ddd;padding:6px;vertical-align:top;}
  th{background:#f7f7f9;text-align:left;}
  .mono{font-family:ui-monospace,Consolas,monospace;}
</style>
<h1>Rule receipt — ${r.template.name}</h1>
<div class="small mono">
  template_id=${r.template.id} • version=${r.template.version} • role=${r.role} • today_T=${r.todayISOValue} • graph_hash=${r.graphHash}
</div>
${document.getElementById('receiptTable').innerHTML}
<script>window.print();<\/script>
`;
  const w = window.open('', '_blank');
  if (w) { w.document.open(); w.document.write(html); w.document.close(); } else announce('Print window was blocked. Use the Receipt tab and your browser print command.');
}

/* =========================
   CSV / JSON ingest
   ========================= */

function graphFromJSON(text) { return normalizeGraph(JSON.parse(text)); }

function graphToJSON(graph) {
  return JSON.stringify(graph, null, 2);
}

function graphFromCSVs(nodesCsvText, edgesCsvText) {
  function records(text, required, label){
    const rows=parseCSV(text);
    if(!rows.length)throw new Error(`${label} CSV needs a header.`);
    const headers=rows.shift().map(h=>h.trim());
    if(headers.some(h=>!h)||new Set(headers).size!==headers.length)throw new Error(`${label} CSV has blank or duplicate column names.`);
    for(const k of required)if(!headers.includes(k))throw new Error(`${label} CSV is missing ${k}.`);
    return rows.map((r,i)=>{
      if(r.length!==headers.length)throw new Error(`${label} CSV row ${i+2} has ${r.length} fields; expected ${headers.length}.`);
      return Object.fromEntries(headers.map((k,j)=>[k,r[j]]));
    });
  }
  const base=new Set(['id','type','title','tags','tags-json','source','last_modified']);
  const nodes=records(nodesCsvText,['id','type','title'],'Nodes').map(obj=>{
    const props=Object.create(null);
    for(const [k,v] of Object.entries(obj)){
      if(base.has(k))continue;
      if(k.startsWith('property-json:')) { if(v==='')continue; try { props[k.slice(14)]=JSON.parse(v); } catch { throw new Error(`Invalid JSON-encoded property ${k}.`); } }
      else if(v!=='')props[k]=v;
    }
    return {id:obj.id,type:obj.type,title:obj.title,tags:obj['tags-json']?JSON.parse(obj['tags-json']):(obj.tags?obj.tags.split('|'):[]),props,source:obj.source||'',last_modified:obj.last_modified||''};
  });
  const edges=records(edgesCsvText,['from','to','type'],'Edges').map((obj,i)=>({
    id:obj.id||`csv-edge-${i+1}`,from:obj.from,to:obj.to,type:obj.type,source:obj.source||'',last_modified:obj.last_modified||''
  }));
  return normalizeGraph({meta:{graph_id:'csv-graph',graph_version:'1.0'},nodes,edges});
}

/* =========================
   App boot + event wiring
   ========================= */

const state = {
  graph: null,
  idx: null,
  params: {},
  lastResult: null
};

function populateRoleAndTemplate() {
  const roleSel = $('#role');
  roleSel.innerHTML = ROLES.map(r=>`<option value="${r}">${r}</option>`).join('');
  roleSel.value = 'PMO';

  function refreshTemplates() {
    const role = roleSel.value;
    const templSel = $('#template');
    const templates = TEMPLATES.filter(t => role === 'All' ? true : (t.role === role || t.role === 'All'));
    templSel.innerHTML = templates.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
    templSel.value = templates[0]?.id || '';
    onTemplateChange();
  }

  function onTemplateChange() {
    const template = TEMPLATES.find(t => t.id === $('#template').value);
    if (!template) return;
    state.params = defaultParamValues(template, {idx: state.idx});
    renderParamForm(template, state);
  }

  roleSel.onchange = refreshTemplates;
  $('#template').onchange = onTemplateChange;

  refreshTemplates();
}

function seedIngestTextareas() {
  const g=state.graph;
  const properties=uniq(g.nodes.flatMap(n=>Object.keys(n.props||{}))).sort();
  const header=['id','type','title','tags-json','source','last_modified',...properties.map(k=>'property-json:'+k)];
  $('#nodesCsv').value=toCSV([header,...g.nodes.map(n=>[n.id,n.type,n.title,JSON.stringify(n.tags),n.source||'',n.last_modified||'',...properties.map(k=>Object.hasOwn(n.props,k)?JSON.stringify(n.props[k]):'')])]);
  $('#edgesCsv').value=toCSV([['id','from','to','type','source','last_modified'],...g.edges.map(e=>[e.id,e.from,e.to,e.type,e.source||'',e.last_modified||''])]);
}

function loadGraph(input) {
  const graph=normalizeGraph(input);
  const idx=buildIndex(graph);
  state.graph = graph;
  state.idx = idx;
  state.lastResult = null;
  state.dirty = true;
  for(const id of ['viewOut','receiptOut','cards','drill','extra','kpis','receiptTable','lineageNodes','lineageEdges'])document.getElementById(id).textContent='';
  $('#graphJson').value = graphToJSON(graph);
  seedIngestTextareas();

  const warnings = validateGraph(graph, state.idx);
  renderWarnings(warnings);

  populateRoleAndTemplate();
  renderSchemaAndSaved(state);

  // Ensure explainers render after DOM and schema
  renderFeatureExplainers();
}

function init() {
  $('#today').value = todayISO();
  const demo = buildDemoGraph($('#today').value);
  loadGraph(demo);

  document.querySelectorAll('.tabbtn').forEach(b => b.onclick = () => setTab(b.dataset.tab));

  $('#run').onclick = () => {try{runCurrent(state);}catch(e){announce(e.message + ' Previous successful result is unchanged.');}};

  $('#searchCards').oninput = () => {
    if (state.lastResult) renderCards(state, state.lastResult, state.lastResult.view);
  };

  $('#copyView').onclick = async () => {if(!state.lastResult)runCurrent(state);await copyText(JSON.stringify(state.lastResult.view,null,2));};

  $('#dlViewJson').onclick = () => {
    if (!state.lastResult) runCurrent(state);
    const r = state.lastResult;
    downloadText(JSON.stringify(r.view, null, 2), `sharpcloud-view_${r.template.id}_${stamp()}.json`, 'application/json');
  };
  $('#dlItemsCsv').onclick = () => {
    if (!state.lastResult) runCurrent(state);
    const r = state.lastResult;
    downloadText(r.itemsCsv, `items_${r.template.id}_${stamp()}.csv`, 'text/csv');
  };
  $('#dlLinksCsv').onclick = () => {
    if (!state.lastResult) runCurrent(state);
    const r = state.lastResult;
    downloadText(r.linksCsv, `links_${r.template.id}_${stamp()}.csv`, 'text/csv');
  };
  $('#dlReceiptJson').onclick = () => {
    if (!state.lastResult) runCurrent(state);
    const r = state.lastResult;
    downloadText(JSON.stringify(r.receipt, null, 2), `receipt_${r.template.id}_${stamp()}.json`, 'application/json');
  };
  $('#dlReceiptCsv').onclick = () => {
    if (!state.lastResult) runCurrent(state);
    const r = state.lastResult;
    downloadText(r.receiptCsv, `receipt_table_${r.template.id}_${stamp()}.csv`, 'text/csv');
  };
  $('#dlLineageNodes').onclick = () => {
    if (!state.lastResult) runCurrent(state);
    const r = state.lastResult;
    downloadText(spreadsheetCSV(r.lineageExports.nodeRows), `lineage_nodes_${r.template.id}_${stamp()}.csv`, 'text/csv');
  };
  $('#dlLineageEdges').onclick = () => {
    if (!state.lastResult) runCurrent(state);
    const r = state.lastResult;
    downloadText(spreadsheetCSV(r.lineageExports.edgeRows), `lineage_edges_${r.template.id}_${stamp()}.csv`, 'text/csv');
  };
  $('#dlSchema').onclick = () => downloadText(buildSchemaCSV(), `schema_${stamp()}.csv`, 'text/csv');
  $('#dlSaved').onclick = () => downloadText(JSON.stringify(buildSavedSearchStubsJSON(), null, 2), `saved-searches_${stamp()}.json`, 'application/json');
  $('#dlAuditZip').onclick = () => {
    if (!state.lastResult) runCurrent(state);
    const blob = buildAuditZip(state);
    if (blob) downloadBlob(blob, `audit-bundle_${state.lastResult.template.id}_${stamp()}.zip`);
  };
  $('#printReceipt').onclick = () => {
    if (!state.lastResult) runCurrent(state);
    printReceipt(state);
  };

  $('#dlGraphJson').onclick = () => downloadText(graphToJSON(state.graph), `graph_${state.graph.meta?.graph_id || 'graph'}_${stamp()}.json`, 'application/json');

  $('#resetDemo').onclick = () => {
    const demo = buildDemoGraph($('#today').value || todayISO());
    loadGraph(demo);
    state.lastResult = null;
    $('#viewOut').textContent = '';
    $('#receiptOut').textContent = '';
    $('#cards').innerHTML = '';
    $('#drill').innerHTML = `<div class="notice">Click a card on the left to see details, neighbors, and inclusion reasons.</div>`;
  };

  $('#loadGraphJson').onclick = () => {
    try {
      const g = graphFromJSON($('#graphJson').value);
      loadGraph(g);
      announce('Graph loaded. Run a query to generate its views and exports.');
    } catch (e) {
      announce(`Failed to load graph JSON: ${e.message}`);
    }
  };

  $('#loadCsv').onclick = () => {
    try {
      const g = graphFromCSVs($('#nodesCsv').value, $('#edgesCsv').value);
      loadGraph(g);
      announce('CSV graph loaded. Run a query to generate its views and exports.');
    } catch (e) {
      announce(`Failed to load CSV: ${e.message}`);
    }
  };

  document.addEventListener('input',e=>{
    if(e.target.matches('#today,#limit,[id^="param_"]')) {state.dirty=true;announce('Query controls changed. Run the query; exports still contain the last successful result.');}
    if(e.target.matches('#graphJson,#nodesCsv,#edgesCsv'))announce('Graph draft changed. Load the draft, then run a query.');
  });
  document.addEventListener('change',e=>{
    if(e.target.matches('#role,#template,#linkMode,[data-multi]')) {state.dirty=true;announce('Query controls changed. Run the query; exports still contain the last successful result.');}
  });
  document.querySelectorAll('button').forEach(button=>{
    const handler=button.onclick;if(!handler)return;
    button.onclick=function(event){try{const result=handler.call(this,event);if(result?.catch)result.catch(e=>announce(e.message));return result;}catch(e){announce(e.message);}};
  });
  setTab('preview');
  runCurrent(state);
}

init();
