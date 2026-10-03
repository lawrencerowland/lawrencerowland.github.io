'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { JSDOM } = require('../tools/library-apps/node_modules/jsdom');
const root = path.resolve(__dirname, '..');
const origin = 'https://lawrencerowland.github.io';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const yaml = file => JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.load_file(ARGV[0]))', path.join(root, file)], { encoding: 'utf8' }));
const themes = json('_data/library_themes.json');
const apps = json('_data/library_apps.json');
const materials = json('_data/library_materials.json');
const additional = json('_data/library_additional.json');
const wider = json('_data/wider_interest.json');
const atlas = json('_data/visualisations.json');
const scenarios = json('_data/project_scenarios.json');
const projects = yaml('_data/side_projects.yml').filter(item => item.placement === 'project').sort((a, b) => a.gallery_order - b.gallery_order);
const worked = yaml('_data/worked_examples.yml');
const articles = json('_data/historical_articles.yml');
const homeEntrances = [['Experiments', '/side-projects.html'], ['Methods library', '/library.html'], ['Project scenarios', '/project-scenarios.html']];
const entrances = [...homeEntrances, ['Working views', '/explore-visually.html']];
const clean = value => value.replace(/\s+/g, ' ').trim();
const sourceHref = value => value.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/, '$1');
const sourceDocument = file => new JSDOM(read(file).replace(/^---\r?\n[\s\S]*?\r?\n---/, '')).window.document;
const absolute = url => new URL(url, origin).href;
const peers = theme => [...apps, ...materials].filter(entry => entry.theme === theme.id).sort((a, b) => a.order - b.order);
function resolveEntry(entry) {
  if (entry.kind === 'worked-example') {
    const record = worked.find(item => item.id === entry.id);
    assert.ok(record, entry.id + ': a worked example resolves to its source record');
    return { id: entry.id, title: record.title, url: record.canonical_url };
  }
  if (entry.kind === 'article') {
    const record = articles.find(item => item.url === entry.historical_url);
    assert.ok(record, entry.id + ': a historical article resolves to its source record');
    return { id: entry.id, title: record.title, url: record.url };
  }
  return entry;
}
function assertSourceTarget(url) {
  const pathname = new URL(url, origin).pathname;
  const base = pathname.endsWith('/') ? pathname + 'index' : pathname.replace(/\.html$/, '');
  assert.ok([pathname, base + '.html', base + '.md'].some(file => {
    const p = path.join(root, decodeURIComponent(file));
    return fs.existsSync(p) && fs.statSync(p).isFile();
  }), 'local destination has a retained source: ' + url);
}
function assertPicturedRecords(records) {
  assert.equal(new Set(records.map(entry => entry.id)).size, records.length, 'stable card identities are unique');
  assert.equal(new Set(records.map(entry => entry.url)).size, records.length, 'each entry has one destination');
  for (const entry of records) {
    for (const key of ['id', 'title', 'description', 'url', 'image']) assert.ok(entry[key]?.trim(), entry.id + ': ' + key);
    assertSourceTarget(entry.url);
    assert.ok(entry.image.startsWith('/'), entry.id + ': image is hosted with the site');
    assert.ok(fs.statSync(path.join(root, entry.image)).size > 100, entry.id + ': pictured entrance exists');
  }
}

test('the shared navigation has four tabs and preserves the three home tiles', () => {
  const nav = sourceDocument('_includes/nav.html');
  assert.deepEqual([...nav.querySelectorAll('#main-nav-links a')].map(a => [clean(a.textContent), sourceHref(a.getAttribute('href'))]), entrances);
  const home = sourceDocument('index.md');
  const tiles = [...home.querySelectorAll('.pw-home-question')];
  assert.deepEqual(tiles.map(tile => [clean(tile.querySelector('h2').textContent), sourceHref(tile.querySelector('a').getAttribute('href'))]), homeEntrances);
  for (const tile of tiles) {
    const link = tile.querySelector('a'), title = tile.querySelector('h2');
    assert.equal(link.getAttribute('aria-labelledby'), title.id, 'each whole-tile link is named by its visible title');
    assert.ok(tile.querySelector('img'), title.textContent + ': visual entrance');
  }
  assert.ok(!read('index.md').includes('/wider-interest/'), 'Wider interest is reached below Library');
});

test('all eight Wider entries have a pictured home with their established destinations', () => {
  assert.deepEqual(wider.map(entry => [entry.id, entry.url]), [
    ['door-moisture-model', '/wider-interest/door-moisture-model/'],
    ['project-management-pong', '/wider-interest/project-management-pong/'],
    ['hs2-elite', '/wider-interest/hs2-elite/'],
    ['john-burnet', '/wider-interest/john-burnet-of-barns-journey.html'],
    ['johnsons-dictionary', '/wider-interest/johnsons-dictionary-project.html'],
    ['caesar-rivers', '/wider-interest/caesars_gallic_wars_rivers.html'],
    ['polytope', '/wider-interest/polytope.html'],
    ['conker-season', '/wider-interest/conker-season.html']
  ]);
  assertPicturedRecords(wider);
  const gallery = read('wider-interest/index.md');
  for (const field of ['for entry in site.data.wider_interest', 'entry.url', 'entry.image', 'entry.title', 'entry.description']) assert.ok(gallery.includes(field), 'gallery uses ' + field);
  assert.ok(!gallery.includes('More Project Apps'), 'the retired collection is not an additional gallery');
});

test('Library retains six subjects and four additional pictured tiles, with Sitemap last', () => {
  assert.equal(themes.length, 5);
  assert.equal(apps.length, 52);
  assert.equal(materials.length, 22);
  assert.deepEqual(additional.map(entry => [entry.id, entry.url]), [
    ['social-debt', '/library/apps/social-debt-explorer/'],
    ['wider-interest', '/wider-interest/'],
    ['about', '/about_me.html'],
    ['site-map', '/sitemap.html']
  ]);
  assertPicturedRecords(additional);
  assert.equal(additional.at(-1).title, 'Sitemap');
  assert.ok(![...apps, ...materials].some(entry => entry.id === 'social-debt' || entry.id === 'social-debt-explorer'), 'Social Debt has one bottom tile, not a duplicate subject card');
  const library = read('library.md');
  assert.ok(library.indexOf('site.data.library_additional') > library.indexOf('id="custom-gpts"'), 'the additional tiles follow the established subjects');
  assert.ok(library.includes('id="earlier-app-collections"'), 'saved collection fragment remains at the replacement tiles');
  assert.ok(!/more-project-apps\/|Project-web-apps\/|React_proj-apps\//.test(library), 'retired collection entrances are absent');
});

test('the sitemap resolves project, Library and picture branches from current metadata', () => {
  const sitemap = read('sitemap.md'), resolver = read('_includes/site-map-entry.html');
  const d = sourceDocument('sitemap.md');
  assert.deepEqual([...d.querySelectorAll('.pw-map-branch > h2 > a')].map(a => [clean(a.textContent), sourceHref(a.getAttribute('href'))]), entrances);
  for (const field of ['site.data.side_projects', "where: 'placement', 'project'", "sort: 'gallery_order'", 'project.related', 'site.data.library_themes', 'site.data.library_apps', 'site.data.library_materials', "where: 'theme', theme.id", "sort: 'order'", 'site.data.library_additional', 'site.data.wider_interest', 'site.data.visualisations', 'site.data.project_scenarios']) assert.ok(sitemap.includes(field), 'sitemap is driven by ' + field);
  assert.match(sitemap, /site\.data\.library_themes\s*\|\s*size\s*\|\s*plus:\s*1/, 'subject count follows the five subject records plus Custom GPTs');
  assert.ok(sitemap.includes('include site-map-entry.html entry=entry'));
  for (const field of ['site.data.worked_examples', 'worked.canonical_url', 'site.data.historical_articles', 'article.url']) assert.ok(resolver.includes(field), 'entry resolver uses ' + field);
  assert.ok(!sitemap.includes('site.pages') && !sitemap.includes('site.posts'), 'the human sitemap follows editorial homes, not compatibility pages');
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length);
  assert.equal(new Set(projects.map(project => project.gallery_order)).size, projects.length);
  assert.equal(new Set(atlas.map(view => view.id)).size, atlas.length);
  for (const theme of themes) {
    const entries = peers(theme).map(resolveEntry);
    assert.ok(entries.length, theme.id + ': populated subject');
    for (const entry of entries) {
      assert.ok(entry.title?.trim(), entry.id + ': visible sitemap title');
      assert.ok(entry.url?.trim(), entry.id + ': direct sitemap destination');
      assert.ok(!/\/blog(?:_summary)?\.html|\/2020\/|\/Project-web-apps\/|\/more-project-apps\//.test(entry.url), entry.id + ': canonical home instead of a retired entry');
    }
  }
});

if (process.argv[2]) {
  const built = path.resolve(process.argv[2]);
  const documentFor = route => {
    const html = fs.readFileSync(path.join(built, route), 'utf8');
    assert.ok(!html.includes('{{') && !html.includes('{%'), route + ': Liquid rendered');
    return new JSDOM(html, { url: origin + '/' + route }).window.document;
  };
  const assertLink = (anchor, title, url) => {
    assert.ok(anchor, title + ': link exists');
    assert.equal(clean(anchor.textContent), clean(title));
    assert.equal(anchor.href, absolute(url), title + ': exact destination');
  };
  const picturedCards = (cards, records) => {
    assert.equal(cards.length, records.length);
    for (const [index, entry] of records.entries()) {
      const card = cards[index], link = card.querySelector('a'), title = card.querySelector('h2, .pw-picture-caption strong'), img = card.querySelector('img');
      assert.equal(clean(title.textContent), entry.title);
      assert.equal(link.href, absolute(entry.url));
      assert.equal(link.getAttribute('aria-labelledby'), title.id);
      assert.equal(clean(card.querySelector('p, .pw-picture-caption > span').textContent), clean(entry.description));
      assert.equal(img.getAttribute('src'), entry.image);
      assert.ok(img.hasAttribute('alt'));
      assert.ok(fs.readFileSync(path.join(built, entry.image)).equals(fs.readFileSync(path.join(root, entry.image))), entry.id + ': published picture is complete');
    }
  };

  test('rendered entrances and pictured galleries exactly match their metadata', () => {
    for (const route of ['index.html', 'library.html', 'sitemap.html', 'wider-interest/index.html', 'explore-visually.html']) {
      const d = documentFor(route);
      assert.deepEqual([...d.querySelectorAll('#main-nav-links a')].map(a => [clean(a.textContent), a.getAttribute('href')]), entrances, route + ': four navigation tabs');
    }
    const working = documentFor('explore-visually.html');
    assert.deepEqual([...working.querySelectorAll('#main-nav-links [aria-current=page]')].map(a => clean(a.textContent)), ['Working views']);
    const home = documentFor('index.html');
    assert.deepEqual([...home.querySelectorAll('.pw-home-question')].map(card => [clean(card.querySelector('h2').textContent), card.querySelector('a').getAttribute('href')]), homeEntrances);
    const library = documentFor('library.html');
    const subjects = [...library.querySelectorAll('.pw-library-subjects .pw-picture-card')];
    assert.equal(subjects.length, themes.length + 1);
    for (const [index, theme] of themes.entries()) {
      assert.equal(clean(subjects[index].querySelector('strong').textContent), theme.title);
      assert.equal(subjects[index].querySelector('a').getAttribute('href'), '/library/methods/' + theme.id + '.html');
    }
    assert.equal(subjects.at(-1).querySelector('a').getAttribute('href'), '/gpt-links-page.html');
    picturedCards([...library.querySelectorAll('.pw-library-additional .pw-picture-card')], additional);
    const widerPage = documentFor('wider-interest/index.html');
    picturedCards([...widerPage.querySelectorAll('.pw-wider-gallery .pw-home-question')], wider);
  });

  test('rendered sitemap branches match every current title, destination, count and order', () => {
    const d = documentFor('sitemap.html');
    const branches = [...d.querySelectorAll('.pw-map-branch')];
    assert.equal(branches.length, 4);
    entrances.forEach(([title, url], i) => assertLink(branches[i].querySelector('h2 a'), title, url));
    assertLink(d.querySelector('.pw-map-root a'), 'Home', '/');
    const projectList = branches[0].querySelector(':scope > details > ol');
    assert.equal(clean(branches[0].querySelector(':scope > details > summary').textContent), projects.length + ' projects');
    assert.equal(projectList.children.length, projects.length);
    for (const [index, project] of projects.entries()) {
      const item = projectList.children[index];
      assertLink(item.querySelector(':scope > a'), project.title, project.path);
      const linked = [...item.querySelectorAll(':scope > details > ul > li > a')];
      assert.equal(linked.length, (project.related || []).length);
      (project.related || []).forEach((entry, i) => assertLink(linked[i], entry.title, entry.path));
    }
    assert.equal(clean(branches[1].querySelector('.pw-map-count').textContent), (themes.length + 1) + ' subjects');
    const subjectItems = [...branches[1].querySelectorAll('.pw-map-subjects > li')];
    assert.equal(subjectItems.length, themes.length + 1);
    for (const [index, theme] of themes.entries()) {
      const item = subjectItems[index], entries = peers(theme).map(resolveEntry);
      assert.equal(clean(item.querySelector('summary').textContent), theme.title + ' ' + entries.length);
      assertLink(item.querySelector(':scope > details > p > a'), 'Open this subject →', '/library/methods/' + theme.id + '.html');
      const listed = [...item.querySelectorAll('li[data-map-entry]')];
      assert.deepEqual(listed.map(li => li.getAttribute('data-map-entry')), entries.map(entry => entry.id));
      entries.forEach((entry, i) => assertLink(listed[i].querySelector('a'), entry.title, entry.url));
    }
    assertLink(subjectItems.at(-1).querySelector('a'), 'Custom GPTs', '/gpt-links-page.html');
    const further = [...branches[1].querySelectorAll('.pw-map-further > ol > li')];
    assert.equal(further.length, additional.length);
    additional.forEach((entry, i) => assertLink(further[i].querySelector(':scope > a'), entry.title, entry.url));
    const widerItem = further[additional.findIndex(entry => entry.id === 'wider-interest')];
    assert.equal(clean(widerItem.querySelector('summary').textContent), wider.length + ' pictured entries');
    const widerLinks = [...widerItem.querySelectorAll(':scope > details > ol > li > a')];
    assert.equal(widerLinks.length, wider.length);
    wider.forEach((entry, i) => assertLink(widerLinks[i], entry.title, entry.url));
    assert.equal(clean(branches[2].querySelector('summary').textContent), scenarios.length + ' scenarios');
    const scenarioLinks = [...branches[2].querySelectorAll(':scope > details > ol > li > a')];
    assert.equal(scenarioLinks.length, scenarios.length);
    scenarios.forEach((entry, i) => assertLink(scenarioLinks[i], entry.title, entry.url));
    const workItem = branches[3];
    const atlasLinks = [...workItem.querySelectorAll(':scope > details > ol > li > a')];
    assert.equal(atlasLinks.length, atlas.length);
    atlas.forEach((entry, i) => assertLink(atlasLinks[i], entry.title, '/explore-visually.html?view=' + encodeURIComponent(entry.id)));
    for (const a of d.querySelectorAll('a[href]')) {
      if (!a.getAttribute('href').startsWith('/')) continue;
      const url = new URL(a.href), file = decodeURIComponent(url.pathname) + (url.pathname.endsWith('/') ? 'index.html' : '');
      assert.ok(fs.existsSync(path.join(built, file)), 'published sitemap destination exists: ' + file);
      if (url.hash) assert.ok(documentFor(file.replace(/^\//, '')).getElementById(decodeURIComponent(url.hash.slice(1))), 'published sitemap fragment exists: ' + a.href);
    }
  });
}
