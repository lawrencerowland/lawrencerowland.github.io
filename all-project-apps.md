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
</style>


# All Project Apps

<div id="filter-container" class="filter"></div>

<div id="heatmap-container" class="heatmap"></div>

<div id="app-container"></div>

<div id="tag-cloud" class="filter"></div>

<script>
const canonicalMap = {
  agi: 'strategy_portfolio',
  ai_adoption: 'ai_data',
  ashbys_law: 'complexity_systems',
  pbs: 'governance_controls',
  pmo: 'governance_controls',
  tom: 'strategy_portfolio',
  viable_systems_model: 'complexity_systems',
  wbs: 'governance_controls',
  wardley_map: 'strategy_portfolio',
  abstraction: 'decision_intelligence',
  active_inference: 'complexity_systems',
  behaviour: 'stakeholders_culture',
  benefits: 'value_benefits',
  business_model: 'strategy_portfolio',
  capabilities: 'learning_capability',
  category_theory: 'ai_data',
  change_management: 'complexity_systems',
  classification_tree: 'ai_data',
  complexity: 'complexity_systems',
  competition: 'stakeholders_culture',
  consulting: 'strategy_portfolio',
  contract_management: 'governance_controls',
  correlation: 'ai_data',
  culture: 'stakeholders_culture',
  decision: 'decision_intelligence',
  dependencies: 'governance_controls',
  feedback_loops: 'complexity_systems',
  gamification: 'stakeholders_culture',
  game_theory: 'stakeholders_culture',
  generative_model: 'ai_data',
  graph_pathways: 'ai_data',
  graphs: 'ai_data',
  higher_order_networks: 'complexity_systems',
  hs2: 'governance_controls',
  idea_maze: 'learning_capability',
  imagination: 'learning_capability',
  interactions: 'stakeholders_culture',
  jsx: 'ai_data',
  knowledge_graph: 'ai_data',
  knowledge_graph_dependencies: 'ai_data',
  knowledge_management: 'ai_data',
  learning: 'learning_capability',
  methods: 'learning_capability',
  moving_between_perspectives: 'stakeholders_culture',
  multiple_perspectives: 'stakeholders_culture',
  negotiation: 'stakeholders_culture',
  non_linearity: 'complexity_systems',
  ontology: 'ai_data',
  output: 'value_benefits',
  portfolio_management: 'strategy_portfolio',
  polarities: 'decision_intelligence',
  prediction_error: 'decision_intelligence',
  procurement: 'governance_controls',
  product_management: 'learning_capability',
  qualitative_research: 'stakeholders_culture',
  rail: 'governance_controls',
  resources: 'learning_capability',
  risk: 'governance_controls',
  roadmap: 'strategy_portfolio',
  scope: 'value_benefits',
  sequential_decisions: 'decision_intelligence',
  social_science: 'stakeholders_culture',
  solution: 'learning_capability',
  stakeholder: 'stakeholders_culture',
  stakeholder_management: 'stakeholders_culture',
  surprise: 'decision_intelligence',
  svg: 'ai_data',
  tasks: 'governance_controls',
  teamwork: 'stakeholders_culture',
  timeline: 'strategy_portfolio',
  tsx: 'ai_data',
  uncertainty: 'decision_intelligence',
  use_cases: 'ai_data',
  value: 'value_benefits',
  visualisation: 'ai_data',
  workflow: 'governance_controls',
  physics: 'complexity_systems',
  everyday: 'learning_capability'
};

const canonicalCategories = ['all', ...Array.from(new Set(Object.values(canonicalMap)))];

const colorMap = {
  strategy_portfolio: '#e41a1c',
  ai_data: '#377eb8',
  complexity_systems: '#4daf4a',
  governance_controls: '#984ea3',
  decision_intelligence: '#ff7f00',
  stakeholders_culture: '#ffff33',
  learning_capability: '#a65628',
  value_benefits: '#f781bf'
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
    card.className = 'example-card';
    const tagStr = item.tags || item.tag || item.keywords || item.categories || '';
    card.dataset.tags = tagStr;
    const canonSet = new Set();
    tagStr.split(/[,;]/).map(t => t.trim().toLowerCase()).forEach(t => {
      if (canonicalMap[t]) {
        canonSet.add(canonicalMap[t]);
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
      if (canonicalMap[t]) cats.add(canonicalMap[t]);
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
  setActiveCategory(canonicalMap[tag] || 'all');
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
  });
}

document.addEventListener('DOMContentLoaded', loadData);
</script>
