'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { JSDOM } = require('../tools/library-apps/node_modules/jsdom');
const root = path.resolve(__dirname, '..');
const origin = 'https://lawrencerowland.github.io';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = name => JSON.parse(read('_data/' + name + '.json'));
const yaml = file => JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.load_file(ARGV[0]))', path.join(root, file)], { encoding: 'utf8' }));
const clean = value => value.replace(/\s+/g, ' ').trim();
const scenarios = json('project_scenarios');
const projects = yaml('_data/side_projects.yml');
const emblems = json('experiment_tiles');
const themes = json('library_themes');
const entries = [...json('library_apps'), ...json('library_materials')];
const views = json('visualisations');

// These are reviewed public destinations, not values inferred from the new cards.
// Absolute sibling-project URLs must remain absolute in a local site preview.
const expectedScenarios = {
  gimmer: ['gimmer-crag/petri-smc-wbs.html', 'gimmer-crag-project-mountain-refuge/', 'gimmer-crag/app-index.html', 'project-spines/', '/gimmer-comparison/'],
  'farm-track': ['integrated_risks_tasks/'],
  'wildlife-crossing': ['/project-co-design/apps/wildlife-crossing.html', '/project-co-design/apps/staged-paths.html', '/project-co-design/apps/programme-studio.html', '/project-co-design/apps/monitoring-power-loop.html'],
  rotunda: ['bricklaying-a-rotunda/apps/Possible-trajectories1.html#first-try', 'bricklaying-a-rotunda/apps/constructive-state/'],
  'tangled-triangle': ['local-to-global/tangled-triangle/', 'local-to-global/forays/003-tangled-triangle.html#first-try'],
  'shared-waters': ['shared-dynamics/compose.html', 'shared-dynamics/compare.html', 'shared-dynamics/interfaces.html'],
  'wall-and-roof': ['building_a_wall/apps/wall-roof-wiring-smc/', 'building_a_wall/apps/wiring-algebra/', 'building_a_wall/apps/course-by-course/'],
  'solway-tunnel': ['Solway_tunnel_ontology/'],
  'museum-whale': ['knowing-enough/'],
  'bracken-vale': ['bracken-vale/']
};
const absolute = route => route.startsWith('/') ? route : origin + '/' + route;
const expectedProjects = [
  ['gimmer-processes-plans', 'gimmer-crag/petri-smc-wbs.html', 'gimmer-crag'],
  ['gimmer-higher-autonomy', 'gimmer-crag-project-mountain-refuge/', 'gimmer-crag-project-mountain-refuge'],
  ['gimmer-broader', 'gimmer-crag/app-index.html', 'gimmer-crag'],
  ['shared-waters', 'shared-dynamics/', 'shared-dynamics'],
  ['integrated-risks-tasks', 'integrated_risks_tasks/', 'integrated_risks_tasks'],
  ['wildlife-crossing', 'project-co-design/', 'lawrencerowland.github.io/tree/master/project-co-design'],
  ['programme-decisions', 'Programme-decision-sequences/', 'Programme-decision-sequences'],
  ['local-to-global', 'local-to-global/', 'local-to-global'],
  ['project-spines', 'project-spines/', 'project-spines'],
  ['portfolio-wave-reading', 'Tag_Concurrence_Graph/pw_best.html', 'Tag_Concurrence_Graph'],
  ['functors-for-projects', 'functors-for_projects/', 'functors-for_projects'],
  ['bricklaying-rotunda', 'bricklaying-a-rotunda/', 'bricklaying-a-rotunda'],
  ['building-wall', 'building_a_wall/', 'building_a_wall'],
  ['solway-tunnel', 'Solway_tunnel_ontology/', 'Solway_tunnel_ontology'],
  ['tag-concurrence', 'Tag_Concurrence_Graph/', 'Tag_Concurrence_Graph'],
  ['knowing-enough', 'knowing-enough/', 'knowing-enough'],
  ['meta-project-innovation', 'meta-project-innovation/', 'lawrencerowland.github.io/tree/master/meta-project-innovation'],
  ['counterfactual-steering', 'counterfactuals/', 'lawrencerowland.github.io/tree/master/counterfactuals'],
  ['bracken-vale', 'bracken-vale/', 'bracken-vale']
];

test('ten concrete scenarios retain their reviewed enquiry mappings and separate boundaries', () => {
  assert.deepEqual(scenarios.map(s => s.id), Object.keys(expectedScenarios));
  assert.equal(new Set(scenarios.map(s => s.url)).size, 10);
  for (const s of scenarios) {
    assert.equal(s.url, '/project-scenarios/' + s.id + '/');
    assert.deepEqual(s.projects.map(p => p.url), expectedScenarios[s.id].map(absolute), s.id + ': reviewed destinations');
    for (const key of ['title', 'description', 'image', 'image_alt', 'predicament', 'motivation', 'limitation']) assert.ok(s[key]?.trim(), s.id + ': ' + key);
    assert.match(s.sources_checked, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(s.sources.length, s.id + ': inspectable provenance');
    assert.equal(new Set(s.projects.map(p => p.id)).size, s.projects.length, s.id + ': unique enquiry identities');
    assert.equal(new Set(s.projects.map(p => p.title)).size, s.projects.length, s.id + ': distinct labels for distinct destinations');
    assert.deepEqual([...new Set(s.projects.map(p => p.project_id).filter(Boolean))].sort(), [...s.project_ids].sort());
    for (const id of s.project_ids) assert.ok(projects.some(p => p.id === id), s.id + ': known enquiry ' + id);
    for (const p of s.projects) {
      assert.ok(p.title && p.description, s.id + '/' + p.id + ': one name and short descriptor');
      if (p.project_id) assert.ok(emblems[p.project_id], s.id + ': shared enquiry emblem');
    }
    for (const item of [...s.projects, ...s.sources]) {
      assert.equal(new URL(item.url, origin).protocol, 'https:');
      if (item.url.startsWith('/')) {
        const pathname = decodeURIComponent(new URL(item.url, origin).pathname);
        const target = path.join(root, pathname);
        assert.ok(fs.existsSync(target) || fs.existsSync(target.replace(/\.html$/, '.md')), s.id + ': local source exists ' + pathname);
      }
    }
    if (s.image.startsWith('/')) assert.ok(fs.existsSync(path.join(root, s.image)), s.id + ': source scene exists');
    assert.ok(!s.image.includes('/experiment-emblems/'), s.id + ': the situation has its own scene');
    const page = read('project-scenarios/' + s.id + '.md');
    assert.match(page, /^---\nlayout: project-scenario\n/);
    assert.ok(page.includes('scenario_id: ' + s.id + '\n'));
    assert.ok(page.includes('permalink: ' + s.url + '\n'));
    assert.ok(page.includes('home_front_door: true'), s.id + ': skip navigation supported');
  }
  assert.equal(fs.readdirSync(path.join(root, 'project-scenarios')).filter(f => f.endsWith('.md')).length, 10);
});

test('nineteen enquiry identities, public homes and source repositories survive the new emblems', () => {
  assert.equal(projects.length, 19);
  assert.deepEqual(projects.map(p => [p.id, p.path, p.source_url]), expectedProjects.map(([id, route, repo]) => [id, absolute(route), 'https://github.com/lawrencerowland/' + repo]));
  assert.ok(projects.every(p => p.placement === 'project'), 'all nineteen retain their project-gallery placement');
  assert.deepEqual(Object.keys(emblems).sort(), projects.map(p => p.id).sort());
  assert.equal(new Set(Object.values(emblems).map(e => e.image)).size, 19);
  for (const p of projects) {
    const e = emblems[p.id];
    assert.ok(e.title && e.description);
    assert.equal(e.image, '/images/experiment-emblems/' + p.id + '.svg');
    const svg = new JSDOM(read(e.image), { contentType: 'image/svg+xml' }).window.document;
    assert.equal(svg.documentElement.getAttribute('viewBox'), '0 0 640 400', p.id + ': consistent emblem canvas');
    assert.ok(svg.querySelector('title'), p.id + ': emblem retains its own accessible title');
  }
});

test('the entrance redesign preserves all Library and Working views catalogue content', () => {
  // Canonical JSON hashes of origin/master before the entrance redesign: this
  // guards titles, destinations, limitations, source provenance and ordering,
  // not merely counts. The 3 October image relocation updates only the five
  // image URL fields; all captions, model limits, source hashes and ordering survive.
  // Intentional catalogue edits must update these snapshots.
  const snapshots = {
    library_themes: 'b30d2b8aca4ebc03a0bcb0200c7dbf314bdf57cfa2f4ac961c0a0036802c96b6',
    library_apps: '0555f0a4896547aab1ac4a395e72a2bb2709b64253f31635db2b58b8db7ad3f6',
    library_materials: '25069450e689810a694fad1c48369743d1823e3cdf1f69f19b64cef3623cf360',
    visualisations: '6289a8756bc42568e5da2135b21da627ec208dc52f7c33c91dc65697a7fb6d42'
  };
  for (const [name, expected] of Object.entries(snapshots)) assert.equal(createHash('sha256').update(JSON.stringify(json(name))).digest('hex'), expected, name + ': preserve pre-redesign content');
  assert.equal(themes.length + 1, 6, 'five subjects plus Custom GPTs');
  assert.equal(entries.length, 74);
  assert.equal(views.length, 38);
  assert.equal(json('library_additional').filter(e => e.url === '/explore-visually.html').length, 1, 'one supporting Working views entrance');
});

test('agent orientation is regenerated from the current three routes and scenario metadata', () => {
  const { generate, model } = require('../tools/agent-orientation/generate.cjs');
  assert.equal(generate({ check: true }), 5);
  assert.deepEqual(model().scenarios, scenarios);
  assert.deepEqual(model().copy.entrances.map(e => e.title), ['Experiments', 'Methods library', 'Project scenarios']);
  const directory = read('agents/directory.txt');
  for (const s of scenarios) {
    assert.ok(directory.includes('[' + s.title + '](' + origin + s.url + ')'));
    for (const p of s.projects) assert.ok(directory.includes('[' + p.title + '](' + new URL(p.url, origin).href + ')'));
  }
  assert.ok(read('LLMs.txt').includes('10 concrete settings'));
  assert.ok(read('agents/visual-atlas.txt').includes('# Working views'));
});

const built = process.argv[2] && path.resolve(process.argv[2]);
if (built) {
  const builtRead = file => fs.readFileSync(path.join(built, file), 'utf8');
  const document = route => new JSDOM(builtRead(route), { url: origin + '/' + route }).window.document;
  const outputPath = pathname => decodeURIComponent(pathname) + (pathname.endsWith('/') ? 'index.html' : '');
  function localTarget(raw, from) {
    if (!raw || /^[a-z][a-z0-9+.-]*:|^\/\//i.test(raw)) return;
    const url = new URL(raw, origin + '/' + from);
    const target = outputPath(url.pathname);
    assert.ok(fs.existsSync(path.join(built, target)), from + ': local target exists ' + raw);
    if (url.hash && target.endsWith('.html')) assert.ok(document(target).getElementById(decodeURIComponent(url.hash.slice(1))), from + ': fragment exists ' + raw);
  }
  function accessibility(d, route) {
    const ids = [...d.querySelectorAll('[id]')].map(e => e.id);
    assert.equal(new Set(ids).size, ids.length, route + ': IDs are unique');
    for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) for (const e of d.querySelectorAll('[' + attr + ']')) for (const id of e.getAttribute(attr).split(/\s+/)) assert.ok(d.getElementById(id), route + ': ' + attr + ' resolves ' + id);
    assert.equal(d.querySelector('main').querySelectorAll('h1').length, 1, route + ': one page heading');
    assert.equal(d.querySelector('#home-main').getAttribute('tabindex'), '-1');
    assert.equal(d.querySelector('.pw-skip-link').getAttribute('href'), '#home-main');
    assert.deepEqual([...d.querySelectorAll('.nav-links a')].map(a => clean(a.textContent)), ['Experiments', 'Methods library', 'Project scenarios']);
    for (const a of d.querySelectorAll('.pw-picture-tile')) {
      assert.ok(a.hasAttribute('href') && !a.hasAttribute('onclick'), route + ': native link works without scripting');
      assert.ok(!a.hasAttribute('tabindex') || Number(a.getAttribute('tabindex')) >= 0, route + ': tile is keyboard reachable');
      assert.equal(a.querySelectorAll('img').length, 1);
      const caption = a.querySelector('.pw-picture-caption');
      assert.equal(caption.children.length, 2, route + ': exactly a label and descriptor');
      assert.ok(clean(d.getElementById(a.getAttribute('aria-labelledby')).textContent));
      assert.ok(clean(d.getElementById(a.getAttribute('aria-describedby')).textContent));
      assert.equal(a.querySelectorAll('a,button,input,select').length, 0, route + ': no nested interactive target');
    }
  }
  test('built galleries have complete native links, unique accessible IDs and the three primary routes', () => {
    for (const route of ['index.html', 'side-projects.html', 'library.html', 'project-scenarios.html', ...scenarios.map(s => outputPath(s.url))]) {
      const d = document(route);
      accessibility(d, route);
      for (const e of d.querySelectorAll('[href],[src]')) localTarget(e.getAttribute('href') || e.getAttribute('src'), route);
      assert.ok(!builtRead(route).includes('{%') && !builtRead(route).includes('{{'), route + ': fully rendered');
    }
    const gallery = document('project-scenarios.html');
    assert.equal(gallery.querySelectorAll('.pw-picture-card').length, 10);
    for (const s of scenarios) {
      const tile = gallery.getElementById(s.id).querySelector('a');
      assert.equal(tile.getAttribute('href'), s.url);
      assert.equal(tile.querySelector('img').getAttribute('src'), s.image);
      const d = document(outputPath(s.url));
      assert.equal(d.querySelector('h1').textContent, s.title);
      assert.equal(d.querySelector('.pw-scenario-hero img').getAttribute('alt'), s.image_alt);
      for (const key of ['predicament', 'motivation', 'limitation']) assert.ok(d.body.textContent.includes(s[key]), s.id + ': keeps ' + key);
      const cards = [...d.querySelectorAll('.pw-picture-tile')];
      assert.equal(cards.length, s.projects.length);
      s.projects.forEach((p, i) => {
        assert.equal(cards[i].getAttribute('href'), p.url, s.id + ': correct local or absolute destination');
        assert.equal(cards[i].querySelector('.pw-picture-caption strong').textContent, p.title, s.id + ': destination-specific label');
        assert.equal(cards[i].querySelector('.pw-picture-caption > span').textContent, p.description);
        assert.equal(cards[i].querySelector('img').getAttribute('src'), p.project_id ? emblems[p.project_id].image : p.image, s.id + ': same enquiry emblem');
      });
      for (const source of s.sources) assert.ok([...d.querySelectorAll('.pw-scenario-notes a')].some(a => a.getAttribute('href') === source.url), s.id + ': source route preserved');
    }
  });
  test('built Library, enquiry and Working views entries retain their identities and destinations', () => {
    const experiments = document('side-projects.html');
    assert.equal(experiments.querySelectorAll('.foray-card').length, 19);
    for (const p of projects) {
      const card = experiments.getElementById(p.id);
      assert.equal(card.querySelector('a').getAttribute('href'), p.path);
      assert.equal(card.querySelector('img').getAttribute('src'), emblems[p.id].image);
      assert.ok(experiments.getElementById('notes-' + p.id), p.id + ': retained detailed notes');
    }
    assert.equal(document('library.html').querySelectorAll('.pw-library-subjects .pw-picture-card').length, 6);
    let count = 0;
    for (const theme of themes) {
      const d = document('library/methods/' + theme.id + '.html');
      for (const e of entries.filter(e => e.theme === theme.id)) { assert.ok(d.getElementById(e.id), e.id + ': retained Library card'); count++; }
    }
    assert.equal(count, 74);
    const atlas = document('explore-visually.html');
    assert.equal(atlas.querySelector('h1').textContent, 'Working views');
    assert.equal(atlas.querySelectorAll('.viz-tile').length, 38);
    assert.deepEqual(JSON.parse(atlas.getElementById('viz-data').textContent), views, 'all view provenance is embedded unchanged');
  });
  test('built CSS supplies keyboard focus, touch-visible captions and a narrow gallery layout', () => {
    const css = builtRead('assets/main.css');
    const rules = [...new JSDOM('<style>' + css + '</style>').window.document.styleSheets[0].cssRules];
    const allRules = list => list.flatMap(r => [r, ...r.cssRules ? allRules([...r.cssRules]) : []]);
    const flattened = allRules(rules);
    assert.ok(flattened.some(r => r.selectorText?.replace(/\s*,\s*/g, ',').includes('.pw-picture-tile:is(:hover,:focus-visible) .pw-picture-caption') && r.style.opacity === '1'), 'hover and keyboard focus reveal the same text');
    assert.ok(flattened.some(r => r.selectorText === '.pw-picture-tile:focus-visible' && r.style.outline), 'visible keyboard outline');
    const touch = rules.find(r => r.conditionText?.includes('hover:none') || r.conditionText?.includes('hover: none'));
    assert.ok(touch, 'touch-specific fallback exists');
    assert.ok([...touch.cssRules].some(r => r.selectorText === '.pw-picture-caption' && r.style.opacity === '1' && r.style.position === 'static'), 'touch captions are visible before activation');
    assert.ok(rules.some(r => /max-width:\s*720px/.test(r.conditionText || '') && [...r.cssRules].some(c => c.selectorText === '.pw-picture-grid' && /repeat\(2/.test(c.style.getPropertyValue('grid-template-columns')))), 'gallery adapts to narrow screens');
  });
}
