/* Gap Map: data identities, catalogue merging and a shared list/graph projection. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.GapMapModel=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const canonicalMap = {
  "agile": "change_management",
  "change_management": "change_management",
  "capabilities": "emerging_practice",
  "everyday": "emerging_practice",
  "idea_maze": "emerging_practice",
  "imagination": "emerging_practice",
  "learning": "emerging_practice",
  "methods": "emerging_practice",
  "product_management": "emerging_practice",
  "solution": "emerging_practice",
  "active_inference": "innovation_pm",
  "ashbys_law": "innovation_pm",
  "complexity": "innovation_pm",
  "feedback_loops": "innovation_pm",
  "higher_order_networks": "innovation_pm",
  "non_linearity": "innovation_pm",
  "physics": "innovation_pm",
  "systems_thinking": "innovation_pm",
  "viable_systems_model": "innovation_pm",
  "agi": "portfolio_management",
  "business_model": "portfolio_management",
  "consulting": "portfolio_management",
  "portfolio_management": "portfolio_management",
  "roadmap": "portfolio_management",
  "tom": "portfolio_management",
  "wardley_map": "portfolio_management",
  "benefits": "project_evaluation",
  "output": "project_evaluation",
  "scope": "project_evaluation",
  "value": "project_evaluation",
  "contract_management": "project_governance",
  "hs2": "project_governance",
  "pbs": "project_governance",
  "pmo": "project_governance",
  "procurement": "project_governance",
  "rail": "project_governance",
  "wbs": "project_governance",
  "workflow": "project_governance",
  "collaboration": "leadership_team",
  "culture": "leadership_team",
  "feedback": "leadership_team",
  "leadership": "leadership_team",
  "motivation": "leadership_team",
  "team_culture": "leadership_team",
  "teamwork": "leadership_team",
  "resource": "resource_optimization",
  "resources": "resource_optimization",
  "abstraction": "risk_management",
  "decision": "risk_management",
  "polarities": "risk_management",
  "prediction_error": "risk_management",
  "risk": "risk_management",
  "risk_culture": "risk_management",
  "sequential_decisions": "risk_management",
  "surprise": "risk_management",
  "uncertainty": "risk_management",
  "dependencies": "schedule_time",
  "schedule": "schedule_time",
  "tasks": "schedule_time",
  "timeline": "schedule_time",
  "behaviour": "stakeholder_engagement",
  "competition": "stakeholder_engagement",
  "game_theory": "stakeholder_engagement",
  "interactions": "stakeholder_engagement",
  "moving_between_perspectives": "stakeholder_engagement",
  "multiple_perspectives": "stakeholder_engagement",
  "negotiation": "stakeholder_engagement",
  "qualitative_research": "stakeholder_engagement",
  "social_science": "stakeholder_engagement",
  "stakeholder": "stakeholder_engagement",
  "stakeholder_analysis": "stakeholder_engagement",
  "stakeholder_management": "stakeholder_engagement",
  "ai": "technology_integration",
  "ai_adoption": "technology_integration",
  "category_theory": "technology_integration",
  "chatbot": "technology_integration",
  "classification_tree": "technology_integration",
  "correlation": "technology_integration",
  "generative_model": "technology_integration",
  "graph_pathways": "technology_integration",
  "graphs": "technology_integration",
  "jsx": "technology_integration",
  "knowledge_graph": "technology_integration",
  "knowledge_graph_dependencies": "technology_integration",
  "knowledge_management": "technology_integration",
  "ontology": "technology_integration",
  "svg": "technology_integration",
  "tsx": "technology_integration",
  "use_cases": "technology_integration",
  "visualisation": "technology_integration",
  "ai_planning": [
    "technology_integration",
    "schedule_time"
  ],
  "ai_risk": [
    "technology_integration",
    "risk_management"
  ],
  "analytics": [
    "technology_integration",
    "project_controls"
  ],
  "coaching": [
    "leadership_team",
    "emerging_practice"
  ],
  "gamification": [
    "stakeholder_engagement",
    "leadership_team"
  ],
  "mentoring": [
    "leadership_team",
    "emerging_practice"
  ],
  "predictive_modeling": [
    "technology_integration",
    "risk_management"
  ],
  "sustainability": [
    "project_governance",
    "stakeholder_engagement"
  ],
  "training": [
    "leadership_team",
    "emerging_practice"
  ],
  "strategy_portfolio": "portfolio_management",
  "ai_data": "technology_integration",
  "complexity_systems": "innovation_pm",
  "governance_controls": [
    "project_governance",
    "project_controls"
  ],
  "decision_intelligence": "risk_management",
  "stakeholders_culture": "stakeholder_engagement",
  "learning_capability": "emerging_practice",
  "value_benefits": "project_evaluation"
};
const canonicalToDomain = {
  "change_management": "Change Management",
  "emerging_practice": "Emerging Practice",
  "innovation_pm": "Innovation in PM",
  "leadership_team": "Project Leadership & Team Dynamics",
  "portfolio_management": "Portfolio Management",
  "project_controls": "Project Controls",
  "project_evaluation": "Project Evaluation & Measurement",
  "project_governance": "Project Governance",
  "resource_optimization": "Resource Allocation & Optimization",
  "risk_management": "Risk Management",
  "schedule_time": "Schedule & Time Management",
  "stakeholder_engagement": "Stakeholder Engagement",
  "technology_integration": "Technology Integration"
};
const tagToCaps = {
  "change_management": [
    "C10"
  ],
  "stakeholder": [
    "C7"
  ],
  "stakeholder_management": [
    "C7"
  ],
  "procurement": [
    "C8"
  ],
  "contract_management": [
    "C8"
  ],
  "contracts": [
    "C8"
  ],
  "risk": [
    "C22"
  ],
  "risk_culture": [
    "C23"
  ],
  "ai": [
    "C1"
  ],
  "ai_adoption": [
    "C1"
  ],
  "data": [
    "C1"
  ],
  "analytics": [
    "C1",
    "C11"
  ],
  "schedule": [
    "C11"
  ],
  "tasks": [
    "C11"
  ],
  "agile": [
    "C6"
  ],
  "portfolio_management": [
    "C9"
  ],
  "gamification": [
    "C17"
  ],
  "coaching": [
    "C18"
  ],
  "mentoring": [
    "C18"
  ],
  "training": [
    "C5"
  ],
  "learning": [
    "C5"
  ],
  "benefits": [
    "C12"
  ],
  "value": [
    "C12"
  ],
  "knowledge_management": [
    "C13"
  ],
  "knowledge_graph": [
    "C13"
  ],
  "resource": [
    "C16"
  ],
  "resources": [
    "C16"
  ],
  "uncertainty": [
    "C22"
  ],
  "moving_between_perspectives": [
    "C14"
  ],
  "multiple_perspectives": [
    "C14"
  ],
  "history": [
    "C15"
  ],
  "timeline": [
    "C15"
  ]
};

const aliases={
  'Resource Optimization':'Resource Allocation & Optimization','Resource Allocation':'Resource Allocation & Optimization',
  'Schedule Management':'Schedule & Time Management','Innovation in Project Management':'Innovation in PM','Innovation':'Innovation in PM',
  'Project Leadership':'Project Leadership & Team Dynamics','Team Dynamics':'Project Leadership & Team Dynamics','Project Team Dynamics':'Project Leadership & Team Dynamics',
  'Workforce Engagement':'Project Leadership & Team Dynamics','Project Evaluation':'Project Evaluation & Measurement'
};
const explicitCaps={
  'olaf-delivery-dashboard':['C9'],'pareto_projects':['C14'],
  'interactive-concept-map':['C14','C9'],'concept-triad-builder':['C14','C9'],
  'decision-path-guide':['C6','C9'],'pm-software-evolution':['C15'],
  'Project_Decision_Framing_Tool':['C6','C9'],'IT-project-seq-decisions':['C6'],
  'hs2_WBS_to_PBS':['C14','C9'],'project-management-simulation':['C6','C9'],
  'Project_Controls_2010-2025_Transformation':['C15']
};
const unique=items=>[...new Set(items)];
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key)?object[key]:undefined;
function domains(values){return unique((values||[]).map(v=>own(aliases,v)||v));}
function createData(base){
  const d=JSON.parse(JSON.stringify(base));
  const all=[...d.gaps,...d.capabilities,...d.resources], ids=new Set();
  for(const item of all){if(!item.id||ids.has(item.id))throw new Error('Duplicate or missing map identity');ids.add(item.id);item.domains=domains(item.domains);}
  const caps=new Map(d.capabilities.map(c=>[c.id,c])),resources=new Map(d.resources.map(r=>[r.id,r]));
  for(const c of d.capabilities)c.linkedGaps=[];
  for(const r of d.resources)r.linkedCapabilities=[];
  for(const g of d.gaps){g.linkedCapabilities=unique(g.linkedCapabilities||[]);for(const id of g.linkedCapabilities){if(!caps.has(id))throw new Error('Unknown capability '+id);caps.get(id).linkedGaps.push(g.id);}}
  for(const c of d.capabilities){c.linkedResources=unique(c.linkedResources||[]);for(const id of c.linkedResources){if(!resources.has(id))throw new Error('Unknown resource '+id);resources.get(id).linkedCapabilities.push(c.id);}}
  return d;
}
function parseCSV(text){
  // Quoted commas, escaped quotes and embedded newlines are all part of a field.
  const rows=[],row=[];let field='',quoted=false;
  const push=()=>{row.push(field);field='';};
  text=String(text).replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(ch==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
    else if(ch===','&&!quoted)push();
    else if((ch==='\n'||ch==='\r')&&!quoted){push();if(row.some(v=>v.trim()))rows.push(row.splice(0));else row.length=0;if(ch==='\r'&&text[i+1]==='\n')i++;}
    else field+=ch;
  }
  if(quoted)throw new Error('Unclosed CSV quote');
  if(field||row.length){push();if(row.some(v=>v.trim()))rows.push(row);}
  if(!rows.length)return [];
  const headers=rows.shift().map(h=>h.trim().toLowerCase());
  if(!headers.includes('name'))throw new Error('Catalogue has no name column');
  return rows.map(values=>Object.fromEntries(headers.map((h,i)=>[h,(values[i]||'').trim()]))).filter(r=>r.name);
}
function safeURL(value){
  if(typeof value!=='string'||!value.trim()||value==='#')return null;
  try{const u=new URL(value,'https://lawrencerowland.github.io');if(!['http:','https:'].includes(u.protocol))return null;return value.startsWith('/')&&!value.startsWith('//')?u.pathname+u.search+u.hash:u.href;}catch{return null;}
}
function canonicalURL(value){
  const safe=safeURL(value);if(!safe)return null;
  const u=new URL(safe,'https://lawrencerowland.github.io');
  return u.origin+u.pathname.replace(/\/index\.html$/,'/').replace(/\/$/,'');
}
function identity(app){return String(app.repo||'Project-web-apps')+':'+String(app.name||'');}
function appURL(app){
  if(app.url)return safeURL(app.url);
  if(!app.name||/[\/\\]/.test(app.name))return null;
  const repo=app.repo||'Project-web-apps';
  if(!/^[A-Za-z0-9_.-]+$/.test(repo))return null;
  return repo==='Project-web-apps'?'/Project-web-apps/web_apps/'+encodeURIComponent(app.name)+'.html':'/'+repo+'/apps/'+encodeURIComponent(app.name)+'/index.html';
}
function mergeApps(feeds,retired=[]){
  // Feeds are highest-priority first. A stale conflicting alias cannot collapse
  // two distinct homes already kept from higher-priority metadata.
  const blocked=new Set(retired.filter(r=>typeof r==='string'||(r&&typeof r.repo==='string'&&typeof r.name==='string')).map(r=>typeof r==='string'?r:identity(r)));
  const seenIds=new Set(),seenURLs=new Set(),out=[];
  for(const feed of feeds)for(const app of feed||[]){
    if(!app||typeof app.name!=='string'||!app.name.trim())continue;
    const id=identity(app),url=appURL(app),canon=canonicalURL(url);
    if(!url||blocked.has(id))continue;
    if(canon==='https://lawrencerowland.github.io/gap-map.html'){seenIds.add(id);seenURLs.add(canon);continue;}
    if(seenIds.has(id)||seenURLs.has(canon)){seenIds.add(id);seenURLs.add(canon);continue;}
    seenIds.add(id);seenURLs.add(canon);out.push({...app,repo:app.repo||'Project-web-apps',url});
  }
  return out;
}
function integrateApps(base,apps){
  const d=createData(base),caps=new Map(d.capabilities.map(c=>[c.id,c]));
  for(const app of mergeApps([apps])){
    const tags=String(app.tags||app.tag||'').split(/[,;]/).map(t=>t.trim().toLowerCase()).filter(Boolean);
    const domainNames=unique(tags.flatMap(t=>{const v=own(canonicalMap,t);return (Array.isArray(v)?v:[v]).map(c=>own(canonicalToDomain,c)).filter(Boolean);}));
    const linkedCapabilities=unique([...tags.flatMap(t=>own(tagToCaps,t)||[]),...(own(explicitCaps,app.name)||[])]).filter(id=>caps.has(id));
    // Capability associations also give otherwise unclassified resources a usable domain.
    const ds=domains([...domainNames,...linkedCapabilities.flatMap(id=>caps.get(id).domains)]);
    const r={id:'A-'+encodeURIComponent(identity(app)),title:app.name,description:app.description||'',type:'Interactive example',sourceKind:app.home||'Project Apps catalogue',fromApp:true,domains:ds.length?ds:['Unclassified'],url:app.url,linkedCapabilities,association:'Suggested from catalogue tags and curated links; not evidence of capability coverage.'};
    d.resources.push(r);for(const id of linkedCapabilities)caps.get(id).linkedResources.push(r.id);
  }
  d.resources.sort((a,b)=>Number(!!b.fromApp)-Number(!!a.fromApp));return d;
}
function matches(item,search='',excluded=new Set()){
  const q=search.trim().toLowerCase(),ds=domains(item.domains);
  return (!ds.length||ds.some(d=>!excluded.has(d)))&&(!q||[item.title,item.description,item.type,...ds].filter(Boolean).join(' ').toLowerCase().includes(q));
}
function graphData(data,search='',excluded=new Set()){
  const nodes=[...data.gaps.map(g=>({...g,kind:'gap'})),...data.capabilities.map(c=>({...c,kind:'cap'})),...data.resources.map(r=>({...r,kind:'res'}))].filter(n=>matches(n,search,excluded));
  const ids=new Set(nodes.map(n=>n.id)),links=[];
  for(const g of data.gaps)for(const c of g.linkedCapabilities)if(ids.has(g.id)&&ids.has(c))links.push({source:g.id,target:c});
  for(const c of data.capabilities)for(const r of c.linkedResources)if(ids.has(c.id)&&ids.has(r))links.push({source:c.id,target:r});
  return {nodes,links};
}
async function loadCatalogues(fetcher,retired=[]){
  const feeds=[
    {name:'Library examples',url:'/assets/data/library-apps.json'},
    {name:'Specialist examples',url:'/assets/data/specialist-apps.json'},
    {name:'Remaining Project Apps',url:'/Project-web-apps/app-index.csv',csv:true},
    {name:'Retirement list',url:'/assets/data/retired-apps.json',retirements:true}
  ];
  const results=await Promise.allSettled(feeds.map(async feed=>{
    const response=await fetcher(feed.url);if(!response.ok)throw new Error(feed.name+' unavailable');
    const records=feed.csv?parseCSV(await response.text()).map(r=>({...r,repo:'Project-web-apps'})):await response.json();
    if(!Array.isArray(records))throw new Error(feed.name+' invalid');
    if(feed.retirements&&records.some(r=>!r||typeof r!=='object'||typeof r.repo!=='string'||!r.repo.trim()||typeof r.name!=='string'||!r.name.trim()))throw new Error('Retirement list invalid');
    return records;
  }));
  const registry=results[3].status==='fulfilled'?results[3].value:[];
  return {apps:mergeApps(results.slice(0,3).map(r=>r.status==='fulfilled'?r.value:[]),[...retired,...registry]),failures:results.flatMap((r,i)=>r.status==='rejected'?[feeds[i].name]:[])};
}
return {createData,parseCSV,safeURL,canonicalURL,identity,mergeApps,integrateApps,matches,graphData,loadCatalogues,domains};
});
