---
layout: default
title: Project Management Gap-Map
wide: true
schema_type: WebPage
---

<style>
html, body { height:100%; margin:0; }
.page-content.wide {
  display:flex !important;
  flex-direction:column;
  flex:1 0 auto;
  margin:0;
  max-width:100%;
  min-height:0;
}
:root {
  --gap: #c62828;
  --cap: #1565c0;
  --res: #2e7d32;
  --bg: #f5f5f5;
  --fg: #212121;
  --muted: #757575;
  --highlight: #ffab40;
}
body {margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:var(--fg);background:var(--bg);display:flex;flex-direction:column;min-height:100vh;}
header{padding:0.5rem 1rem;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,0.1);position:sticky;top:0;z-index:1000;display:flex;align-items:center;flex-wrap:wrap;gap:1rem;}
h1{font-size:1.25rem;margin:0;white-space:nowrap;}
nav{display:inline-block;}
nav button,.info-buttons button{margin-right:0.5rem;padding:0.35rem 0.75rem;border:1px solid #ccc;border-radius:1rem;background:#f9f9f9;cursor:pointer;transition:all 0.2s;}
nav button:hover,.info-buttons button:hover{background:#e0e0e0;border-color:#999;}
nav button.active{background:var(--cap);color:#fff;border-color:var(--cap);font-weight:600;}
.controls-right{margin-left:auto;display:flex;gap:0.5rem;}
#toggleGraph,#clearSelectionBtn{padding:0.35rem 0.75rem;border:1px solid #ccc;border-radius:1rem;background:#fff;cursor:pointer;}
#clearSelectionBtn{display:none;background-color:var(--highlight);color:black;}
#filters{padding:0.75rem 1rem;border-bottom:1px solid #e0e0e0;display:flex;flex-wrap:wrap;gap:1rem;align-items:center;background:#fff;}
#searchBox{flex:1 1 200px;padding:0.5rem;border:1px solid #ccc;border-radius:4px;font-size:1rem;}
#domainFilters{display:flex;flex-wrap:wrap;gap:0.5rem 1rem;}
#domainFilters label{font-size:0.8rem;display:flex;align-items:center;cursor:pointer;}
#domainFilters input{margin-right:0.35rem;}
main{flex:1;display:flex;overflow:hidden;position:relative;}
#listView{flex:1 1 auto;overflow:auto;padding:1rem;}
.item{border:1px solid #e0e0e0;border-radius:6px;padding:1rem;margin-bottom:1rem;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.05);cursor:pointer;transition:all 0.2s ease-in-out;}
.item:hover{transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,0.1);}
.item.highlighted{border-left:5px solid var(--highlight);}
.item h3{margin:0;font-size:1.1rem;}
.domains{margin-top:0.5rem;font-size:0.8rem;color:var(--muted);}
.linkCount{font-size:0.85rem;color:var(--cap);cursor:pointer;margin-top:0.75rem;display:inline-block;}
.childList{margin-top:0.75rem;margin-left:1rem;border-left:2px solid #e0e0e0;padding-left:1rem;}
.childList>div{padding:0.25rem 0;font-size:0.9rem;}
#graphView{flex:1 1 auto;display:none;position:relative;overflow:hidden;}
#graphSvg{width:100%;height:100%;}
.graph-tooltip{position:absolute;text-align:center;width:auto;padding:8px;font:12px sans-serif;background:lightsteelblue;border:0;border-radius:8px;pointer-events:none;opacity:0;transition:opacity 0.2s;}
.modal{display:none;position:fixed;z-index:2000;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,0.5);}
.modal-content{background-color:#fefefe;margin:5% auto;padding:20px;border:1px solid #888;width:80%;max-width:700px;border-radius:8px;}
.modal-content h2{margin-top:0;}
.close-button{color:#aaa;float:right;font-size:28px;font-weight:bold;cursor:pointer;}
@media (max-width:768px){h1{font-size:1.1rem;}header{flex-direction:column;align-items:flex-start;}.controls-right{margin-left:0;}#filters{flex-direction:column;align-items:stretch;}}
footer.site-footer{padding:0.25rem 0;font-size:0.8rem;}
</style>

<header>
  <h1>Project Management Gap-Map</h1>
  <div class="info-buttons">
    <button id="whatBtn">What is this?</button>
    <button id="howToBtn">How to use</button>
  </div>
  <nav>
    <button id="btnG" class="active" data-cat="gap">Gaps</button>
    <button id="btnC" data-cat="cap">Capabilities</button>
    <button id="btnR" data-cat="res">Resources</button>
  </nav>
  <div class="controls-right">
    <button id="clearSelectionBtn">Clear Selection</button>
    <button id="toggleGraph">Graph View</button>
  </div>
</header>
<div id="filters">
  <input type="text" id="searchBox" placeholder="Search by keyword…" />
  <div id="domainFilters"></div>
  <div style="font-size:0.8rem;color:var(--muted);margin-top:0.25rem">Unchecking a domain hides items only in that domain.</div>
</div>
<main>
  <div id="listView"></div>
  <div id="graphView"><svg id="graphSvg"></svg></div>
  <div class="graph-tooltip"></div>
</main>

<!-- Modals -->
<div id="whatModal" class="modal"><div class="modal-content"><span class="close-button">&times;</span><h2>What is this?</h2><p>This tool visualizes the relationships between common challenges (Gaps), solutions (Capabilities), and external knowledge (Resources) in the field of project management.</p><p>It's designed to help project professionals, students, and organizations identify areas for improvement and discover relevant solutions and resources to enhance their project delivery practices.</p></div></div>
<div id="howToModal" class="modal"><div class="modal-content"><span class="close-button">&times;</span><h2>How to Use</h2><ul><li><strong>Browse:</strong> Use the "Gaps", "Capabilities", and "Resources" buttons to switch between categories.</li><li><strong>Filter:</strong> Use the search box and domain checkboxes to narrow down items. Unchecking a domain hides only those items that belong solely to that domain.</li><li><strong>Explore:</strong> Click "▼" to see linked items. Click any item in the list or a node in the graph to highlight it across both views.</li></ul></div></div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
const data = {
  gaps:[
    {id:"G1",title:"Integration of AI and Data Analytics in Project Management",domains:["Technology Integration","Risk Management","Schedule & Time Management","Resource Allocation & Optimization"],description:"The project management field faces a gap in fully leveraging AI and big data analytics for decision support.",linkedCapabilities:["C1","C11","C16"]},
    {id:"G2",title:"Managing Hybrid and Remote Project Teams",domains:["Project Leadership & Team Dynamics","Stakeholder Engagement"],description:"Gap in maintaining team cohesion and productivity in hybrid environments.",linkedCapabilities:["C2","C3"]},
    {id:"G3",title:"Embedding Sustainability and Social Value in Projects",domains:["Project Governance","Stakeholder Engagement","Innovation in PM"],description:"Need to integrate sustainability metrics into PM frameworks.",linkedCapabilities:["C4","C7"]},
    {id:"G4",title:"Project Management Skills Gap and Talent Development",domains:["Project Leadership & Team Dynamics","Emerging Practice"],description:"Insufficient numbers of project professionals with emerging skills.",linkedCapabilities:["C5","C18"]},
    {id:"G5",title:"Adapting Agile and Hybrid Methodologies in Traditional Projects",domains:["Change Management","Schedule & Time Management","Project Governance"],description:"Traditional sectors struggle to adopt agile/hybrid PM.",linkedCapabilities:["C6","C9"]},
    {id:"G6",title:"Effective Stakeholder Engagement in Complex Projects",domains:["Stakeholder Engagement","Project Governance","Change Management"],description:"Need improved frameworks for multi-stakeholder alignment.",linkedCapabilities:["C7","C8","C17"]},
    {id:"G7",title:"Integrating Organizational Change Management with Projects",domains:["Change Management","Stakeholder Engagement","Project Leadership & Team Dynamics"],description:"Disconnect between technical delivery and people change.",linkedCapabilities:["C10","C5"]},
    {id:"G8",title:"Modernizing Project Controls and Performance Management",domains:["Project Controls","Schedule & Time Management","Technology Integration"],description:"Shift from manual to real-time, data-driven controls.",linkedCapabilities:["C1","C11"]},
    {id:"G9",title:"Benefits Realization and Project Value Measurement",domains:["Project Evaluation & Measurement","Project Governance"],description:"Output-based metrics dominate over outcome-based value.",linkedCapabilities:["C12","C13"]},
    {id:"G10",title:"Addressing Cognitive Biases in Project Risk Management",domains:["Risk Management","Project Governance"],description:"Optimism bias undermines realistic planning.",linkedCapabilities:["C14","C15"]},
    {id:"G11",title:"Resource Allocation and Multi-Project Optimization Challenges",domains:["Resource Allocation & Optimization","Schedule & Time Management","Portfolio Management"],description:"Need better techniques for portfolio-level resource balancing.",linkedCapabilities:["C1","C16"]},
    {id:"G12",title:"Fostering Innovation and Continuous Improvement in PM Practices",domains:["Innovation in PM","Emerging Practice","Project Leadership & Team Dynamics"],description:"Conservative PM culture slows adoption of new practices.",linkedCapabilities:["C9","C13","C17"]},
    {id:"G13",title:"Enhancing Team Engagement and Motivation in Projects",domains:["Project Leadership & Team Dynamics","Workforce Engagement"],description:"Sustain motivation in long/high-pressure projects.",linkedCapabilities:["C17","C18"]}
  ],
  capabilities:[
    {id:"C1",title:"AI and Data-Driven PM Tools",domains:["Technology Integration","Risk Management","Schedule & Time Management","Resource Allocation & Optimization"],description:"Predictive analytics and AI assistants for PM.",linkedResources:["R10","R12"],linkedGaps:["G1","G8","G11"]},
    {id:"C2",title:"Digital Collaboration Tools & Practices",domains:["Stakeholder Engagement","Project Leadership & Team Dynamics","Technology Integration"],description:"Platforms and norms for distributed collaboration.",linkedResources:["R12","R14"],linkedGaps:["G2","G6"]},
    {id:"C3",title:"Hybrid/Remote Team Leadership",domains:["Project Leadership & Team Dynamics"],description:"Leading partially remote teams with inclusive practices.",linkedResources:["R11","R1"],linkedGaps:["G2","G4"]},
    {id:"C4",title:"Sustainable PM Practices",domains:["Project Governance","Innovation in PM","Stakeholder Engagement"],description:"Frameworks to integrate sustainability and social value.",linkedResources:["R9"],linkedGaps:["G3","G6"]},
    {id:"C5",title:"Apprenticeships & Professional Development",domains:["Project Leadership & Team Dynamics","Emerging Practice"],description:"Structured training pathways and mentorship.",linkedResources:["R13","R11"],linkedGaps:["G4","G7"]},
    {id:"C6",title:"Agile & Hybrid Delivery Approaches",domains:["Change Management","Schedule & Time Management","Innovation in PM"],description:"Combining iterative methods with traditional governance.",linkedResources:["R5","R6"],linkedGaps:["G5","G12"]},
    {id:"C7",title:"Stakeholder Engagement Strategies & Tools",domains:["Stakeholder Engagement","Change Management","Project Governance"],description:"Systematic identification and continuous engagement.",linkedResources:["R15","R8"],linkedGaps:["G6","G3"]},
    {id:"C8",title:"Collaborative Partnerships & Contracting Models",domains:["Project Governance","Risk Management","Stakeholder Engagement"],description:"Alliance/IPD models with shared incentives.",linkedResources:["R9","R3"],linkedGaps:["G6","G10"]},
    {id:"C9",title:"Adaptive Governance & Portfolio Management",domains:["Project Governance","Project Evaluation & Measurement","Innovation in PM"],description:"Flexible oversight and dynamic portfolio reprioritization.",linkedResources:["R8","R5"],linkedGaps:["G5","G12"]},
    {id:"C10",title:"Change Management Integration",domains:["Change Management","Stakeholder Engagement","Project Leadership & Team Dynamics"],description:"Embedding OCM activities alongside project delivery.",linkedResources:["R7","R1"],linkedGaps:["G7","G4"]},
    {id:"C11",title:"Integrated Project Controls & Analytics",domains:["Project Controls","Schedule & Time Management","Cost Management","Technology Integration"],description:"Unified schedule-cost-risk dashboards with analytics.",linkedResources:["R10","R6"],linkedGaps:["G8","G1"]},
    {id:"C12",title:"Benefits Realization Management",domains:["Project Evaluation & Measurement","Project Governance"],description:"Disciplined approach to define, track and realize benefits.",linkedResources:["R3","R12"],linkedGaps:["G9"]},
    {id:"C13",title:"Knowledge Management & Lessons Learned",domains:["Project Evaluation & Measurement","Innovation in PM"],description:"Repositories and communities to capture and reuse knowledge.",linkedResources:["R15"],linkedGaps:["G9","G12"]},
    {id:"C14",title:"Quantitative Risk Analysis Techniques",domains:["Risk Management","Schedule & Time Management","Cost Management"],description:"Monte-Carlo, reference-class forecasting, decision trees.",linkedResources:["R4","R10"],linkedGaps:["G10"]},
    {id:"C15",title:"Risk Culture & Bias Mitigation Training",domains:["Risk Management","Project Leadership & Team Dynamics"],description:"Workshops and practices to counter optimism bias and encourage open risk dialogue.",linkedResources:["R4","R1"],linkedGaps:["G10"]},
    {id:"C16",title:"Resource Optimization Techniques",domains:["Resource Allocation & Optimization","Schedule & Time Management","Portfolio Management"],description:"Critical Chain, capacity planning, AI-driven leveling.",linkedResources:["R14"],linkedGaps:["G11","G1"]},
    {id:"C17",title:"Gamification & Engagement",domains:["Project Leadership & Team Dynamics","Stakeholder Engagement"],description:"Game-design elements to boost motivation and participation.",linkedResources:["R2","R1"],linkedGaps:["G13","G6","G12"]},
    {id:"C18",title:"Coaching & Mentoring Programs",domains:["Project Leadership & Team Dynamics","Emerging Practice"],description:"One-on-one or team coaching and structured mentoring.",linkedResources:["R1","R11"],linkedGaps:["G4","G13"]}
  ],
  resources:[
    {id:"R1",title:"Coaching in the Project Environment",type:"Report",domains:["Project Leadership & Team Dynamics","Emerging Practice"],url:"#",linkedCapabilities:["C3","C18","C17","C10","C15"]},
    {id:"R2",title:"Introduction to Gamification",type:"Study",domains:["Project Leadership & Team Dynamics","Stakeholder Engagement"],url:"#",linkedCapabilities:["C17"]},
    {id:"R3",title:"Guide for Effective Benefits Management",type:"Guidance",domains:["Project Evaluation & Measurement","Project Governance"],url:"#",linkedCapabilities:["C8","C12"]},
    {id:"R4",title:"HM Treasury Optimism Bias Guidance",type:"Guidance",domains:["Risk Management","Project Governance"],url:"#",linkedCapabilities:["C14","C15"]},
    {id:"R5",title:"PRINCE2 Agile",type:"Framework",domains:["Project Governance","Change Management"],url:"#",linkedCapabilities:["C6","C9"]},
    {id:"R6",title:"Scaled Agile Framework (SAFe)",type:"Framework",domains:["Change Management","Innovation in PM"],url:"#",linkedCapabilities:["C6","C11"]},
    {id:"R7",title:"Prosci ADKAR Model",type:"Methodology",domains:["Change Management"],url:"#",linkedCapabilities:["C10"]},
    {id:"R8",title:"Directing Change – Governance Guide",type:"Guide",domains:["Project Governance"],url:"#",linkedCapabilities:["C7","C9"]},
    {id:"R9",title:"Project 13 Initiative",type:"Industry Initiative",domains:["Project Governance","Stakeholder Engagement"],url:"#",linkedCapabilities:["C4","C8"]},
    {id:"R10",title:"nPlan AI Risk Forecasting",type:"Tool",domains:["Risk Management","Schedule & Time Management"],url:"#",linkedCapabilities:["C1","C11","C14"]},
    {id:"R11",title:"Chartered Project Professional (ChPP)",type:"Credential",domains:["Project Leadership & Team Dynamics"],url:"#",linkedCapabilities:["C3","C5","C18"]},
    {id:"R12",title:"Microsoft Teams",type:"Tool",domains:["Stakeholder Engagement","Technology Integration"],url:"#",linkedCapabilities:["C1","C2","C12"]},
    {id:"R13",title:"Associate Project Manager Apprenticeship",type:"Training",domains:["Project Leadership & Team Dynamics"],url:"#",linkedCapabilities:["C5"]},
    {id:"R14",title:"Atlassian Jira",type:"Tool",domains:["Schedule & Time Management","Technology Integration"],url:"#",linkedCapabilities:["C2","C16"]},
    {id:"R15",title:"APM/RICS Stakeholder Engagement Guide",type:"Guide",domains:["Stakeholder Engagement"],url:"#",linkedCapabilities:["C7","C13"]}
  ]
};


const canonicalMap = {
  // Change Management (organizational change, Agile/hybrid adoption)
  agile: 'change_management',
  change_management: 'change_management',

  // Emerging Practice (new methodologies, continuous learning & development)
  capabilities: 'emerging_practice',
  everyday: 'emerging_practice',
  idea_maze: 'emerging_practice',
  imagination: 'emerging_practice',
  learning: 'emerging_practice',
  methods: 'emerging_practice',
  product_management: 'emerging_practice',
  solution: 'emerging_practice',

  // Innovation in PM (complexity science, systems thinking, advanced concepts)
  active_inference: 'innovation_pm',
  ashbys_law: 'innovation_pm',
  complexity: 'innovation_pm',
  feedback_loops: 'innovation_pm',
  higher_order_networks: 'innovation_pm',
  non_linearity: 'innovation_pm',
  physics: 'innovation_pm',
  systems_thinking: 'innovation_pm',
  viable_systems_model: 'innovation_pm',

  // Portfolio Management (strategic alignment, portfolio oversight, roadmapping)
  agi: 'portfolio_management',
  business_model: 'portfolio_management',
  consulting: 'portfolio_management',
  portfolio_management: 'portfolio_management',
  roadmap: 'portfolio_management',
  tom: 'portfolio_management',
  wardley_map: 'portfolio_management',

  // Project Controls (integrated control systems; e.g. analytics via multi-domain tags)
  // *No direct single-tag mappings here; see multi-domain tags like "analytics" below*

  // Project Evaluation & Measurement (benefits realization, value tracking, metrics)
  benefits: 'project_evaluation',
  output: 'project_evaluation',
  scope: 'project_evaluation',
  value: 'project_evaluation',

  // Project Governance (PMO, governance frameworks, controls, compliance)
  contract_management: 'project_governance',
  hs2: 'project_governance',
  pbs: 'project_governance',
  pmo: 'project_governance',
  procurement: 'project_governance',
  rail: 'project_governance',
  wbs: 'project_governance',
  workflow: 'project_governance',

  // Project Leadership & Team Dynamics (team collaboration, culture, motivation, leadership)
  collaboration: 'leadership_team',
  culture: 'leadership_team',
  feedback: 'leadership_team',
  leadership: 'leadership_team',
  motivation: 'leadership_team',
  team_culture: 'leadership_team',
  teamwork: 'leadership_team',

  // Resource Allocation & Optimization (resource management and optimization techniques)
  resource: 'resource_optimization',
  resources: 'resource_optimization',

  // Risk Management (decision-making under uncertainty, bias mitigation)
  abstraction: 'risk_management',
  decision: 'risk_management',
  polarities: 'risk_management',
  prediction_error: 'risk_management',
  risk: 'risk_management',
  risk_culture: 'risk_management',
  sequential_decisions: 'risk_management',
  surprise: 'risk_management',
  uncertainty: 'risk_management',

  // Schedule & Time Management (scheduling, sequencing, time management)
  dependencies: 'schedule_time',
  schedule: 'schedule_time',
  tasks: 'schedule_time',
  timeline: 'schedule_time',

  // Stakeholder Engagement (stakeholder analysis, management, negotiation, cultural aspects)
  behaviour: 'stakeholder_engagement',
  competition: 'stakeholder_engagement',
  game_theory: 'stakeholder_engagement',
  interactions: 'stakeholder_engagement',
  moving_between_perspectives: 'stakeholder_engagement',
  multiple_perspectives: 'stakeholder_engagement',
  negotiation: 'stakeholder_engagement',
  qualitative_research: 'stakeholder_engagement',
  social_science: 'stakeholder_engagement',
  stakeholder: 'stakeholder_engagement',
  stakeholder_analysis: 'stakeholder_engagement',
  stakeholder_management: 'stakeholder_engagement',

  // Technology Integration (AI, data analytics, and tech adoption in PM)
  ai: 'technology_integration',
  ai_adoption: 'technology_integration',
  category_theory: 'technology_integration',
  chatbot: 'technology_integration',
  classification_tree: 'technology_integration',
  correlation: 'technology_integration',
  generative_model: 'technology_integration',
  graph_pathways: 'technology_integration',
  graphs: 'technology_integration',
  jsx: 'technology_integration',
  knowledge_graph: 'technology_integration',
  knowledge_graph_dependencies: 'technology_integration',
  knowledge_management: 'technology_integration',
  ontology: 'technology_integration',
  svg: 'technology_integration',
  tsx: 'technology_integration',
  use_cases: 'technology_integration',
  visualisation: 'technology_integration',

  // Tags mapping to multiple domains:
  ai_planning: ['technology_integration', 'schedule_time'],
  ai_risk: ['technology_integration', 'risk_management'],
  analytics: ['technology_integration', 'project_controls'],
  coaching: ['leadership_team', 'emerging_practice'],
  gamification: ['stakeholder_engagement', 'leadership_team'],
  mentoring: ['leadership_team', 'emerging_practice'],
  predictive_modeling: ['technology_integration', 'risk_management'],
  sustainability: ['project_governance', 'stakeholder_engagement'],
  training: ['leadership_team', 'emerging_practice']
};

const canonicalToDomain = {
  change_management: 'Change Management',
  emerging_practice: 'Emerging Practice',
  innovation_pm: 'Innovation in PM',
  leadership_team: 'Project Leadership & Team Dynamics',
  portfolio_management: 'Portfolio Management',
  project_controls: 'Project Controls',
  project_evaluation: 'Project Evaluation & Measurement',
  project_governance: 'Project Governance',
  resource_optimization: 'Resource Allocation & Optimization',
  risk_management: 'Risk Management',
  schedule_time: 'Schedule & Time Management',
  stakeholder_engagement: 'Stakeholder Engagement',
  technology_integration: 'Technology Integration'
};

const tagToCaps = {
  change_management: ['C10'],
  stakeholder: ['C7'],
  stakeholder_management: ['C7'],
  procurement: ['C8'],
  contract_management: ['C8'],
  contracts: ['C8'],
  risk: ['C14'],
  risk_culture: ['C15'],
  ai: ['C1'],
  ai_adoption: ['C1'],
  data: ['C1'],
  analytics: ['C1','C11'],
  schedule: ['C11'],
  tasks: ['C11'],
  agile: ['C6'],
  portfolio_management: ['C9'],
  gamification: ['C17'],
  coaching: ['C18'],
  mentoring: ['C18'],
  training: ['C5'],
  learning: ['C5'],
  benefits: ['C12'],
  value: ['C12'],
  knowledge_management: ['C13'],
  knowledge_graph: ['C13'],
  resource: ['C16'],
  resources: ['C16']
};

function parseCSV(text){
  const lines=text.trim().split(/\r?\n/);
  const headers=lines.shift().split(',').map(h=>h.trim().toLowerCase());
  return lines.map(line=>{
    const values=[];let current='';let inQuotes=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch==='"'){
        if(inQuotes && line[i+1]==='"'){current+='"';i++;}
        else{inQuotes=!inQuotes;}
      }else if(ch===',' && !inQuotes){values.push(current);current='';}else{current+=ch;}
    }
    values.push(current);
    const obj={};
    headers.forEach((h,i)=>{obj[h]=(values[i]||'').trim();});
    return obj;
  });
}

function integrateApps(apps){
  let nextId = data.resources.reduce((max, r) => {
    const n = parseInt(String(r.id).replace(/^R/, ''));
    return !isNaN(n) && n > max ? n : max;
  }, 0) + 1;
  apps.forEach(app=>{
    const tags=(app.tags||app.tag||'').split(/[,;]/).map(t=>t.trim().toLowerCase()).filter(Boolean);
    const domainSet=new Set();
    tags.forEach(t=>{
      const canon=canonicalMap[t];
      if(canon){
        const arr=Array.isArray(canon)?canon:[canon];
        arr.forEach(c=>{const dom=canonicalToDomain[c]; if(dom) domainSet.add(dom);});
      }
    });
    const resId='R'+(nextId++);
    const resource={id:resId,title:app.name,type:'App',domains:Array.from(domainSet),url:app.repo==='Project-web-apps'?`/Project-web-apps/web_apps/${app.name}.html`:`/${app.repo}/apps/${app.name}/index.html`,linkedCapabilities:[]};
    data.resources.push(resource);
    tags.forEach(t=>{const caps=tagToCaps[t]; if(caps){caps.forEach(cid=>{const cap=data.capabilities.find(c=>c.id===cid); if(cap && !cap.linkedResources.includes(resId)) cap.linkedResources.push(resId); if(!resource.linkedCapabilities.includes(cid)) resource.linkedCapabilities.push(cid);});}});
  });
}

function loadResourcesData(){
  return Promise.all([
    fetch('/Project-web-apps/app-index.csv?t='+Date.now()).then(r=>r.text()),
    fetch('/React_proj-apps/app-index.csv?t='+Date.now()).then(r=>r.text())
  ]).then(([c1,c2])=>{
    const d1=parseCSV(c1).map(d=>{d.repo='Project-web-apps';return d;});
    const d2=parseCSV(c2).map(d=>{d.repo='React_proj-apps';return d;});
    integrateApps(d1.concat(d2));
    buildDomainFilters();
    renderList();
    if(graphVisible) drawGraph();
  });
}

let currentCats={gap:true,cap:false,res:false};
let activeDomains=new Set();
let searchTerm="";
let graphVisible=false;
let simulation;
let graphContainer;
let graphOffsetY=0;

function init(){
  setupEventListeners();
  buildDomainFilters();
  renderList();
}

function setupEventListeners(){
  document.getElementById('btnG').onclick=()=>setCategory('gap');
  document.getElementById('btnC').onclick=()=>setCategory('cap');
  document.getElementById('btnR').onclick=()=>setCategory('res');
  document.getElementById('searchBox').oninput=e=>{searchTerm=e.target.value.toLowerCase();renderList();};
  document.getElementById('toggleGraph').onclick=toggleGraph;
  document.getElementById('clearSelectionBtn').onclick=clearSelection;
  setupModal('whatBtn','whatModal');
  setupModal('howToBtn','howToModal');
}

function renderList(){
  const list=document.getElementById('listView');
  list.innerHTML='';
  if(currentCats.gap){data.gaps.forEach(g=>addItem(list,g,'gap'));}
  if(currentCats.cap){data.capabilities.forEach(c=>addItem(list,c,'cap'));}
  if(currentCats.res){data.resources.forEach(r=>addItem(list,r,'res'));}
}

function addItem(container,obj,type){
  if(!domainMatch(obj)|| (searchTerm && !obj.title.toLowerCase().includes(searchTerm) && !(obj.description||'').toLowerCase().includes(searchTerm)))return;
  const div=document.createElement('div');
  div.className=`item ${type}`;
  div.id=`item-${obj.id}`;
  div.innerHTML=`<h3>${obj.title}</h3><div class="domains">${obj.domains.join(' • ')}</div><p style="font-size:0.85rem;margin-top:0.35rem">${obj.description||''}</p>`;
  div.onclick=()=>highlightItem(obj.id);
  const linkedItemsKey=type==='gap'?'linkedCapabilities':type==='cap'?'linkedResources':null;
  if(linkedItemsKey && obj[linkedItemsKey] && obj[linkedItemsKey].length>0){
    const linkedDataType=type==='gap'?'capabilities':'resources';
    const linkNoun=type==='gap'?'Capabilities':'Resources';
    const link=document.createElement('div');
    link.className='linkCount';
    link.textContent=`${obj[linkedItemsKey].length} ${linkNoun} ▼`;
    link.onclick=e=>{e.stopPropagation();toggleChildList(e.target,obj,linkedItemsKey,linkedDataType,linkNoun);};
    div.appendChild(link);
  }
  container.appendChild(div);
}

function buildDomainFilters(){
  const allDomains=[...new Set([...data.gaps.flatMap(g=>g.domains),...data.capabilities.flatMap(c=>c.domains),...data.resources.flatMap(r=>r.domains)])].sort();
  const container=document.getElementById('domainFilters');
  container.innerHTML='';
  allDomains.forEach(d=>{
    const id='dom_'+d.replace(/[^a-z0-9]/gi,'');
    const label=document.createElement('label');
    label.innerHTML=`<input type="checkbox" id="${id}" data-domain="${d}" checked> ${d}`;
    container.appendChild(label);
  });
  if(!container.dataset.listener){
    container.addEventListener('change',e=>{
      if(e.target.type==='checkbox'){
        const domain=e.target.dataset.domain;
        if(e.target.checked){activeDomains.delete(domain);}else{activeDomains.add(domain);}renderList();
      }
    });
    container.dataset.listener='true';
  }
}

// Returns true if the item should be visible given the currently unchecked
// domains in `activeDomains`. By default an item is shown if it belongs to at
// least one domain that remains checked. To hide items containing any unchecked
// domain instead, replace `some` with `every` below.
function domainMatch(item){
  if(activeDomains.size===0)return true;
  return item.domains.some(d=>!activeDomains.has(d));
}

function toggleChildList(linkElement,parentObj,linkedItemsKey,linkedDataType,linkNoun){
  const itemDiv=linkElement.closest('.item');
  const existingChild=itemDiv.querySelector('.childList');
  if(existingChild){existingChild.remove();linkElement.textContent=`${parentObj[linkedItemsKey].length} ${linkNoun} ▼`;}
  else{
    const childDiv=document.createElement('div');
    childDiv.className='childList';
    parentObj[linkedItemsKey].forEach(cid=>{const childItem=data[linkedDataType].find(c=>c.id===cid);if(childItem){const p=document.createElement('div');p.textContent=childItem.title;childDiv.appendChild(p);}});
    linkElement.insertAdjacentElement('afterend',childDiv);linkElement.textContent=`Hide ${linkNoun} ▲`;}
}

function highlightItem(itemId){
  document.querySelectorAll('.item').forEach(el=>el.classList.remove('highlighted'));
  const listItem=document.getElementById(`item-${itemId}`);
  if(listItem)listItem.classList.add('highlighted');
  if(graphVisible){d3.selectAll('.node').attr('r',8).style('stroke','none');d3.select(`#node-${itemId}`).attr('r',12).style('stroke','var(--highlight)').style('stroke-width','3px');}
}

function selectItemFromGraph(item){
  setCategory(item.type,false);
  document.getElementById('searchBox').value=item.title;
  searchTerm=item.title.toLowerCase();
  document.getElementById('clearSelectionBtn').style.display='inline-block';
  renderList();
  highlightItem(item.id);
}

function clearSelection(){
  document.getElementById('searchBox').value='';
  searchTerm='';
  document.getElementById('clearSelectionBtn').style.display='none';
  document.querySelectorAll('.item').forEach(el=>el.classList.remove('highlighted'));
  if(graphVisible){d3.selectAll('.node').attr('r',8).style('stroke','none');}
  renderList();
}

function setCategory(cat,doRenderGraph=true){
  currentCats={gap:false,cap:false,res:false};
  currentCats[cat]=true;
  document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-cat="${cat}"]`).classList.add('active');
  renderList();
  if(graphVisible && doRenderGraph)drawGraph();
}

function toggleGraph(){
  graphVisible=!graphVisible;
  document.getElementById('graphView').style.display=graphVisible?'block':'none';
  document.getElementById('listView').style.display=graphVisible?'none':'block';
  document.getElementById('toggleGraph').textContent=graphVisible?'List View':'Graph View';
  if(graphVisible){setTimeout(drawGraph,0);}else if(simulation){simulation.stop();}
}

function drawGraph(){
  const graphView=document.getElementById('graphView');
  const svg=d3.select('#graphSvg');
  svg.selectAll('*').remove();
  graphOffsetY=0;
  graphContainer=svg.append('g').attr('class','graph-container');
  const width=graphView.clientWidth;const height=graphView.clientHeight;const tooltip=d3.select('.graph-tooltip');
  const nodes=[...data.gaps.map(d=>({...d,type:'gap'})),...data.capabilities.map(d=>({...d,type:'cap'})),...data.resources.map(d=>({...d,type:'res'}))];
  const links=[];
  data.gaps.forEach(g=>g.linkedCapabilities.forEach(cid=>links.push({source:g.id,target:cid})));
  data.capabilities.forEach(c=>c.linkedResources.forEach(rid=>links.push({source:c.id,target:rid})));
  const colX={gap:width*0.2,cap:width*0.5,res:width*0.8};
  const color={gap:'var(--gap)',cap:'var(--cap)',res:'var(--res)'};
  simulation=d3.forceSimulation(nodes)
    .force('link',d3.forceLink(links).id(d=>d.id).distance(90))
    .force('charge',d3.forceManyBody().strength(-200))
    .force('center',d3.forceCenter(width/2,height/2))
    .force('x',d3.forceX(d=>colX[d.type]).strength(0.5))
    .force('y',d3.forceY(height/2).strength(0.05));
  const link=graphContainer.append('g').attr('stroke','#999').attr('stroke-opacity',0.6).selectAll('line').data(links).join('line').attr('stroke-width',1.5);
  const node=graphContainer.append('g').selectAll('circle').data(nodes).join('circle').attr('class','node').attr('id',d=>`node-${d.id}`).attr('r',8).attr('fill',d=>color[d.type]).call(dragGraph()).on('click',(event,d)=>{selectItemFromGraph(d);}).on('mouseover',(event,d)=>{tooltip.transition().duration(200).style('opacity',.9);tooltip.html(`<strong>${d.type.toUpperCase()}:</strong> ${d.title}`).style('left',(event.pageX+10)+'px').style('top',(event.pageY-28)+'px');d3.select(event.currentTarget).attr('r',12);}).on('mouseout',(event,d)=>{tooltip.transition().duration(500).style('opacity',0);if(!document.getElementById(`item-${d.id}`)?.classList.contains('highlighted')){d3.select(event.currentTarget).attr('r',8);}});
  simulation.on('tick',()=>{link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);node.attr('cx',d=>d.x).attr('cy',d=>d.y);});
}

function dragGraph(){
  let startY;
  function dragstarted(event){startY=event.y;}
  function dragged(event){const dy=event.y-startY;graphOffsetY+=dy;graphContainer.attr('transform',`translate(0,${graphOffsetY})`);startY=event.y;}
  return d3.drag().on('start',dragstarted).on('drag',dragged);
}

function setupModal(btnId,modalId){
  const modal=document.getElementById(modalId);const span=modal.querySelector('.close-button');
  if(btnId){document.getElementById(btnId).onclick=()=>{modal.style.display='block';}}
  span.onclick=()=>{modal.style.display='none';}
  window.onclick=event=>{if(event.target==modal){modal.style.display='none';}}
}

document.addEventListener('DOMContentLoaded',()=>{
  init();
  loadResourcesData().catch(err=>console.error('Failed to load resources',err));
});
</script>
