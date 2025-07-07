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
</style>


# All Project Apps

<div id="filter-container" class="filter"></div>

<div id="app-container"></div>

<script>
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
    btn.addEventListener('click', () => filterCards(tag));
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

function filterCards(tag) {
  document.querySelectorAll('.example-card').forEach(card => {
    const tags = card.dataset.tags.split(/[,;]/).map(t => t.trim());
    if (tag === 'all' || tags.includes(tag)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
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
    const tags = Array.from(new Set(data.flatMap(d => {
      const tagField = d.tags || d.tag || d.keywords || d.categories || '';
      return tagField.split(/[,;]/).map(t => t.trim()).filter(Boolean);
    }))).sort();
    createFilters(['all'].concat(tags));
    createCards(data);
  });
}

document.addEventListener('DOMContentLoaded', loadData);
</script>
