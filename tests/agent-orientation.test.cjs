'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { JSDOM } = require('../tools/library-apps/node_modules/jsdom');
const { model, outputs, generate, canonical } = require('../tools/agent-orientation/generate.cjs');
const root = path.resolve(__dirname, '..'), origin = 'https://lawrencerowland.github.io';
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const json = name => JSON.parse(read('_data/' + name + '.json'));
const yaml = name => JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.load_file(ARGV[0]))', path.join(root, '_data/' + name + '.yml')], { encoding: 'utf8' }));
const stripMatter = text => text.replace(/^---\n[\s\S]*?\n---\n/, '');
const localLiquid = text => text.replace(/\{\{ '([^']*)' \| relative_url \}\}/g, '$1');
const doc = text => new JSDOM(localLiquid(text), { url: origin + '/sitemap.html' }).window.document;
const clean = text => text.replace(/\s+/g, ' ').trim();
const data = model(), guide = doc(read('_includes/agent-orientation.html'));
const directory = stripMatter(read('agents/directory.txt'));
const atlas = stripMatter(read('agents/visual-atlas.txt'));
const body = read('LLMs.txt');
const publicProjects = yaml('side_projects').filter(p => p.placement === 'project').sort((a, b) => a.gallery_order - b.gallery_order);

test('one source generates compact compatible overviews and plain Markdown permalinks', () => {
  assert.equal(generate({ check: true }), 5);
  assert.equal(stripMatter(read('agents/overview.txt')), body);
  assert.ok(body.split(/\s+/).length < 500, 'overview stays brief; detail lives behind links');
  assert.equal(outputs().has('llms.txt'), false, 'no case-only second source file on macOS');
  for (const [name, permalink] of [['overview', '/llms.txt'], ['directory', '/agents/directory.md'], ['visual-atlas', '/agents/visual-atlas.md']]) {
    const source = read('agents/' + name + '.txt');
    assert.match(source, /^---\nlayout: null\n/);
    assert.ok(source.includes('permalink: ' + permalink + '\n'));
    assert.ok(source.includes('sitemap: false\n'));
    assert.match(stripMatter(source), /^# /);
  }
  for (const text of [body, directory, atlas]) {
    assert.doesNotMatch(text, /\{\{|\{%|undefined|devonthink:\/\/|\/Users\/|00000 vault|app:\/\//);
    assert.doesNotMatch(text, /\/Project-web-apps\/|\/React_proj-apps\/|\/more-project-apps\//);
    assert.ok(text.includes(canonical));
  }
});

test('human welcome is keyboard reachable above the unchanged three-branch tree', () => {
  const section = guide.getElementById('for-agents');
  assert.equal(section.getAttribute('tabindex'), '-1');
  assert.equal(section.getAttribute('aria-labelledby'), section.querySelector('h2').id);
  assert.equal(section.querySelectorAll(':scope > details').length, 3);
  assert.equal(section.querySelectorAll('details[open],script,iframe').length, 0, 'expanded directory is optional and needs no script');
  const table = section.querySelector('table');
  assert.ok(table.closest('details'));
  assert.ok(table.querySelector('caption'));
  assert.ok([...table.querySelectorAll('thead th')].every(th => th.scope === 'col'));
  assert.ok([...table.querySelectorAll('tbody th')].every(th => th.scope === 'row'));
  assert.equal(table.parentElement.getAttribute('tabindex'), '0');
  const sitemap = read('sitemap.md');
  assert.equal((sitemap.match(/include agent-orientation\.html/g) || []).length, 1);
  assert.ok(sitemap.indexOf('include agent-orientation.html') < sitemap.indexOf('class="pw-map-root"'));
  assert.equal((sitemap.match(/class="pw-map-branch"/g) || []).length, 3);
  assert.ok(sitemap.includes('include site-map-entry.html entry=entry'));
  const entrances = [...guide.querySelectorAll('.pw-agent-entrances a')].map(a => [a.textContent, new URL(a.href).pathname]);
  assert.deepEqual(entrances, [['Experiments', '/side-projects.html'], ['Library', '/library.html'], ['Visual atlas', '/explore-visually.html']]);
});

test('every project retains its current identity, question, scenario, approach, canonical home and boundary', () => {
  const rows = [...guide.querySelectorAll('[data-agent-project]')];
  assert.deepEqual(rows.map(r => r.dataset.agentProject), publicProjects.map(p => p.id));
  assert.deepEqual(Object.keys(json('agent_orientation').projects).sort(), publicProjects.map(p => p.id).sort());
  publicProjects.forEach((p, i) => {
    const row = rows[i], selected = data.projects.find(item => item.id === p.id);
    assert.equal(row.querySelector('th a').textContent, p.title);
    assert.equal(row.querySelector('th a').href, new URL(p.path, origin).href);
    assert.equal(row.querySelector('th a').getAttribute('href'), p.path, 'sibling project routes stay absolute in local previews');
    assert.ok(row.textContent.includes(p.entry_question || p.question));
    assert.ok(row.textContent.includes(selected.scenario));
    assert.equal(row.querySelector('.pw-agent-approach').textContent, p.description);
    assert.ok(row.textContent.includes(selected.limit));
    assert.ok(directory.includes('- Approach: ' + p.description));
    assert.ok(directory.includes('- Scope and limits: ' + selected.limit));
    assert.ok(directory.includes('](' + new URL(p.path, origin).href + ')'));
  });
  assert.match(data.projects.find(p => p.id === 'functors-for-projects').limit, /exploratory collection, not one bounded foray/);
  for (const repo of ['knowing-enough', 'bracken-vale']) assert.ok(directory.includes('https://github.com/lawrencerowland/' + repo + '/blob/main/FORAY.md'));
  for (const text of [body, directory, guide.body.textContent]) {
    assert.ok(text.includes(data.copy.scope));
    assert.ok(text.includes(data.copy.evidence));
  }
  assert.ok(directory.includes('SMC means symmetric monoidal category'));
});

test('Library subjects, counts and lower shelves come from their actual catalogues', () => {
  const themes = json('library_themes'), entries = [...json('library_apps'), ...json('library_materials')];
  const items = [...guide.querySelectorAll('[data-agent-theme]')];
  assert.deepEqual(items.map(li => li.dataset.agentTheme), themes.map(t => t.id));
  themes.forEach((theme, i) => {
    const count = entries.filter(e => e.theme === theme.id).length;
    assert.equal(items[i].querySelector('a').textContent, theme.title);
    assert.equal(new URL(items[i].querySelector('a').href).pathname, '/library/methods/' + theme.id + '.html');
    assert.ok(items[i].textContent.includes('(' + count + ' entries)'));
    assert.ok(directory.includes(theme.description));
  });
  assert.equal(guide.querySelectorAll('.pw-agent-subjects > li').length, themes.length + 1);
  assert.equal(new URL(guide.querySelector('.pw-agent-subjects > li:last-child a').href).pathname, '/gpt-links-page.html');
  for (const entry of [...json('library_additional'), ...json('wider_interest')]) assert.ok(directory.includes('](' + origin + entry.url + ')'));
});

test('all picture meanings preserve the exact caption, limitation, state, dates and destination', () => {
  const views = json('visualisations');
  assert.equal((atlas.match(/^- View ID: /gm) || []).length, views.length);
  for (const v of views) {
    for (const key of ['caption', 'look', 'limit', 'alt', 'capture', 'checked']) assert.ok(atlas.includes(v[key]), v.id + ': ' + key);
    if (v.state) assert.ok(atlas.includes('- Depicted state: ' + v.state));
    for (const url of [v.url, v.image, v.thumb]) assert.ok(atlas.includes('](' + new URL(url, origin).href + ')'), v.id + ': destination or image');
    assert.ok(atlas.includes('/explore-visually.html?view=' + encodeURIComponent(v.id)));
  }
  assert.match(atlas, /do not claim that the live app was rechecked/);
  assert.ok(guide.body.textContent.includes(data.copy.visual_guidance));
});

test('metadata changes propagate to both representations with escaped HTML and preserved deep links', () => {
  const changed = structuredClone(data);
  Object.assign(changed.projects[0], { title: 'A <new> & "named" project', question: 'New question?', path: origin + '/project-co-design/?mode=trial#explore', description: 'New public approach.' });
  changed.themes[0].count += 1;
  changed.views[0].limit = 'A newly recorded limitation.';
  const rendered = outputs(changed), d = doc(rendered.get('_includes/agent-orientation.html'));
  const row = d.querySelector('[data-agent-project]');
  assert.equal(row.querySelector('th a').textContent, changed.projects[0].title);
  assert.equal(row.querySelector('th a').href, changed.projects[0].path);
  assert.equal(row.querySelector('new'), null, 'metadata cannot become markup');
  assert.ok(rendered.get('agents/directory.txt').includes('New question?'));
  assert.ok(rendered.get('agents/directory.txt').includes('New public approach.'));
  assert.ok(d.querySelector('[data-agent-theme]').textContent.includes('(' + changed.themes[0].count + ' entries)'));
  assert.ok(rendered.get('agents/visual-atlas.txt').includes(changed.views[0].limit));
  for (const a of guide.querySelectorAll('a[href]')) {
    assert.equal(new URL(a.href).protocol, 'https:');
    if (a.getAttribute('href').startsWith('/')) assert.ok(read('_includes/agent-orientation.html').includes("{{ '" + new URL(a.href).pathname), 'HTML local routes remain local in previews');
  }
});

if (process.argv[2]) {
  const built = path.resolve(process.argv[2]);
  const published = name => fs.readFileSync(path.join(built, name), 'utf8');
  test('built Markdown and both llms paths contain the generated text, without HTML conversion', () => {
    for (const [source, route] of [['agents/overview.txt', 'llms.txt'], ['LLMs.txt', 'LLMs.txt'], ['agents/directory.txt', 'agents/directory.md'], ['agents/visual-atlas.txt', 'agents/visual-atlas.md']]) {
      assert.equal(published(route), stripMatter(read(source)), route + ': exact Markdown body');
      assert.ok(published(route).startsWith('# '));
      assert.ok(!published(route).includes('<html'));
    }
    assert.equal(published('llms.txt'), published('LLMs.txt'));
    for (const name of ['overview', 'directory', 'visual-atlas']) assert.ok(!fs.existsSync(path.join(built, 'agents', name + '.html')), 'no competing HTML guide: ' + name);
  });
  test('rendered welcome, masthead and machine-discovery links agree', () => {
    const sitemap = doc(published('sitemap.html'));
    const actual = sitemap.getElementById('for-agents');
    assert.equal(clean(actual.outerHTML), clean(guide.getElementById('for-agents').outerHTML));
    assert.equal(sitemap.querySelectorAll('.pw-map-branch').length, 3);
    for (const name of ['index.html', 'sitemap.html', 'explore-visually.html', 'library.html']) {
      const d = doc(published(name)), cue = d.querySelector('.pw-agent-link');
      assert.ok(cue && cue.textContent.trim(), name + ': named masthead cue');
      assert.equal(cue.href, canonical);
      assert.equal(d.querySelector('link[rel=describedby]').href, origin + '/llms.txt');
    }
    assert.equal(sitemap.querySelector('link[rel=alternate][type="text/markdown"]').href, origin + '/agents/directory.md');
    assert.equal(doc(published('explore-visually.html')).querySelector('link[rel=alternate][type="text/markdown"]').href, origin + '/agents/visual-atlas.md');
  });
}
