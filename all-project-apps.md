---
layout: default
title: All Project Apps
schema_type: CollectionPage
tags: [Examples, Projects]
wide: true
---

<style>
  /* Ensure four-column layout for app cards */
  #app-container {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1em;
  }
  .example-card {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 1em;
    margin: 0;
  }
  .example-card img {
    width: 100%;
    height: auto;
    margin-bottom: 0.5em;
  }
  #heatmap-container {
    display: flex;
    height: 1.5em;
    margin: 0.5em 0;
    border: 1px solid #ccc;
  }
  #heatmap-container .heat-segment {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.8em;
  }
  .example-card.highlight { border: 2px solid var(--highlight, #ffab40); background: #fff8e1; }
</style>


# All Project Apps

<div id="filter-container" class="filter"></div>

<div id="heatmap-container" class="heatmap"></div>

<div id="app-container"></div>

<div id="tag-cloud" class="filter"></div>

<script>
const canonicalMap = {
  // Change Management
  agile: 'change_management',
  change_management: 'change_management',

  // Emerging Practice
  capabilities: 'emerging_practice',
  everyday: 'emerging_practice',
  idea_maze: 'emerging_practice',
  imagination: 'emerging_practice',
  learning: 'emerging_practice',
  methods: 'emerging_practice',
  product_management: 'emerging_practice',
  solution: 'emerging_practice',

  // Innovation in PM
  active_inference: 'innovation_pm',
  ashbys_law: 'innovation_pm',
  complexity: 'innovation_pm',
  feedback_loops: 'innovation_pm',
  higher_order_networks: 'innovation_pm',
  non_linearity: 'innovation_pm',
  physics: 'innovation_pm',
  systems_thinking: 'innovation_pm',
  viable_systems_model: 'innovation_pm',

  // Portfolio Management
  agi: 'portfolio_management',
  business_model: 'portfolio_management',
  consulting: 'portfolio_management',
  portfolio_management: 'portfolio_management',
  roadmap: 'portfolio_management',
  tom: 'portfolio_management',
  wardley_map: 'portfolio_management',

  // Project Evaluation & Measurement
  benefits: 'project_evaluation',
  output: 'project_evaluation',
  scope: 'project_evaluation',
  value: 'project_evaluation',

  // Project Governance
  contract_management: 'project_governance',
  hs2: 'project_governance',
  pbs: 'project_governance',
  pmo: 'project_governance',
  procurement: 'project_governance',
  rail: 'project_governance',
  wbs: 'project_governance',
  workflow: 'project_governance',

  // Project Leadership & Team Dynamics
  collaboration: 'leadership_team',
  culture: 'leadership_team',
  feedback: 'leadership_team',
  leadership: 'leadership_team',
  motivation: 'leadership_team',
  team_culture: 'leadership_team',
  teamwork: 'leadership_team',

  // Resource Allocation & Optimization
  resource: 'resource_optimization',
  resources: 'resource_optimization',

  // Risk Management
  abstraction: 'risk_management',
  decision: 'risk_management',
  polarities: 'risk_management',
  prediction_error: 'risk_management',
  risk: 'risk_management',
  risk_culture: 'risk_management',
  sequential_decisions: 'risk_management',
  surprise: 'risk_management',
  uncertainty: 'risk_management',

  // Schedule & Time Management
  dependencies: 'schedule_time',
  schedule: 'schedule_time',
  tasks: 'schedule_time',
  timeline: 'schedule_time',

  // Stakeholder Engagement
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

  // Technology Integration
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

  // Tags with multiple domains
  ai_planning: ['technology_integration','schedule_time'],
  ai_risk: ['technology_integration','risk_management'],
  analytics: ['technology_integration','project_controls'],
  coaching: ['leadership_team','emerging_practice'],
  gamification: ['stakeholder_engagement','leadership_team'],
  mentoring: ['leadership_team','emerging_practice'],
  predictive_modeling: ['technology_integration','risk_management'],
  sustainability: ['project_governance','stakeholder_engagement'],
  training: ['leadership_team','emerging_practice']
};

const canonicalCategories = ['all', ...Array.from(new Set([].concat(...Object.values(canonicalMap).map(v => Array.isArray(v) ? v : [v]))))];

const colorMap = {
  change_management: '#e41a1c',
  emerging_practice: '#377eb8',
  innovation_pm: '#4daf4a',
  leadership_team: '#984ea3',
  portfolio_management: '#ff7f00',
  project_controls: '#ffff33',
  project_evaluation: '#a65628',
  project_governance: '#f781bf',
  resource_optimization: '#999999',
  risk_management: '#a6cee3',
  schedule_time: '#1f78b4',
  stakeholder_engagement: '#b2df8a',
  technology_integration: '#33a02c'
};

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',').map(h => h.trim().toLowerCase());
  return lines.map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (values[i] || '').trim(); });
    return obj;
  });
}

function slugify(str){
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-');
}

function createFilters(tags) {
  const container = document.getElementById('filter-container');
  container.innerHTML = '';
  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.dataset.tag = tag;
    btn.addEventListener('click', () => setActiveCategory(tag));
    container.appendChild(btn);
  });
}

function createTagCloud(tags) {
  const container = document.getElementById('tag-cloud');
  container.innerHTML = '';
  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.dataset.tag = tag;
    btn.addEventListener('click', () => filterByTag(tag));
    container.appendChild(btn);
  });
}

function createCards(data) {
  const container = document.getElementById('app-container');
  container.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('div');
    const slug = slugify(item.name);
    card.className = 'example-card';
    card.id = 'app-' + slug;
    const tagStr = item.tags || item.tag || item.keywords || item.categories || '';
    card.dataset.tags = tagStr;
    const canonSet = new Set();
    tagStr.split(/[,;]/).map(t => t.trim().toLowerCase()).forEach(t => {
      const canon = canonicalMap[t];
      if (canon) {
        const arr = Array.isArray(canon) ? canon : [canon];
        arr.forEach(c => canonSet.add(c));
      }
    });
    card.dataset.canonical = Array.from(canonSet).join(',');

    const title = document.createElement('h2');
    const link = document.createElement('a');
    if (item.repo === 'Project-web-apps') {
      link.href = '/Project-web-apps/web_apps/' + item.name + '.html';
    } else {
      link.href = '/React_proj-apps/apps/' + item.name + '/index.html';
    }
    link.textContent = item.name;
    title.appendChild(link);
    card.appendChild(title);

    const img = document.createElement('img');
    let imgName = item.image || item.pic || item.img || item['#'] || item.name;
    if (/^https?:/.test(imgName)) {
      img.src = imgName;
    } else {
      const ext = /\.(png|jpg|jpeg|gif|svg)$/i.test(imgName) ? '' : '.png';
      const base = item.repo === 'Project-web-apps'
        ? '/Project-web-apps/pics/'
        : '/' + item.repo + '/pics/';
      img.src = base + imgName + ext;
    }
    img.alt = item.name;
    img.onerror = () => {
      img.onerror = null;
      if (img.src.toLowerCase().endsWith('.png')) {
        img.src = img.src.replace(/\.png$/, '.PNG');
      }
    };
    card.appendChild(img);

    const desc = document.createElement('p');
    desc.textContent = item.description;
    card.appendChild(desc);

    const origin = document.createElement('p');
    origin.innerHTML = '<strong>Origin:</strong> ' + item.origin;
    card.appendChild(origin);

    const tags = document.createElement('p');
    tags.innerHTML = '<strong>Tags:</strong> ' + tagStr.split(/[,;]/).map(t => t.trim()).filter(Boolean).map(t => '<span class="tag">' + t + '</span>').join(', ');
    card.appendChild(tags);

    container.appendChild(card);
  });
}

function renderHeatmap(data) {
  const counts = {};
  canonicalCategories.slice(1).forEach(cat => { counts[cat] = 0; });
  data.forEach(item => {
    const tagField = item.tags || item.tag || item.keywords || item.categories || '';
    const cats = new Set();
    tagField.split(/[,;]/).map(t => t.trim().toLowerCase()).forEach(t => {
      const canon = canonicalMap[t];
      if (canon) {
        const arr = Array.isArray(canon) ? canon : [canon];
        arr.forEach(c => cats.add(c));
      }
    });
    cats.forEach(cat => { counts[cat] += 1; });
  });
  const container = document.getElementById('heatmap-container');
  container.innerHTML = '';
  canonicalCategories.slice(1).forEach(cat => {
    const count = counts[cat];
    const seg = document.createElement('div');
    seg.className = 'heat-segment';
    seg.style.flexGrow = count;
    seg.style.background = colorMap[cat] || '#999';
    seg.title = cat + ': ' + count;
    seg.textContent = count;
    container.appendChild(seg);
  });
}

function setActiveCategory(category) {
  document.querySelectorAll('#filter-container button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tag === category);
  });
  document.querySelectorAll('#tag-cloud button').forEach(btn => btn.classList.remove('active'));
  filterCards(category);
}

function filterByTag(tag) {
  const val = canonicalMap[tag];
  const first = Array.isArray(val) ? val[0] : val;
  setActiveCategory(first || 'all');
  document.querySelectorAll('#tag-cloud button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tag === tag);
  });
}

function filterCards(category) {
  document.querySelectorAll('.example-card').forEach(card => {
    if (category === 'all') {
      card.style.display = 'block';
    } else {
      const cats = (card.dataset.canonical || '').split(',').map(c => c.trim());
      card.style.display = cats.includes(category) ? 'block' : 'none';
    }
  });
}

function highlightFromQuery(){
  const params=new URLSearchParams(window.location.search);
  const slug=params.get('app');
  if(!slug) return;
  const el=document.getElementById('app-'+slug);
  if(el){
    el.classList.add('highlight');
    el.scrollIntoView({behavior:'smooth',block:'center'});
  }
}

function loadData() {
  Promise.all([
    fetch('/Project-web-apps/app-index.csv?t=' + Date.now()).then(r => r.text()),
    fetch('/React_proj-apps/app-index.csv?t=' + Date.now()).then(r => r.text())
  ]).then(([c1, c2]) => {
    const d1 = parseCSV(c1).map(d => { d.repo = 'Project-web-apps'; return d; });
    const d2 = parseCSV(c2).map(d => { d.repo = 'React_proj-apps'; return d; });
    const data = d1.concat(d2);
    const allTags = Array.from(new Set(data.flatMap(d => {
      const tagField = d.tags || d.tag || d.keywords || d.categories || '';
      return tagField.split(/[,;]/).map(t => t.trim()).filter(Boolean);
    }))).sort();
    createFilters(canonicalCategories);
    createTagCloud(allTags);
    createCards(data);
    renderHeatmap(data);
    highlightFromQuery();
  });
}

document.addEventListener('DOMContentLoaded', loadData);
</script>
