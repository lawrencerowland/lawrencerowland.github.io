'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const os = require('node:os');
const crypto = require('node:crypto');
const { JSDOM } = require('../tools/library-apps/node_modules/jsdom');
const { outputs, generate } = require('../tools/legacy-apps/generate.cjs');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const manifest = json('_data/legacy_app_routes.json');
const originalRoutes = json('tests/fixtures/app-migration/provenance.json').final_retirement.complete_source_routes;
const specialists = json('assets/data/specialist-apps.json');
const origin = 'https://lawrencerowland.github.io';
const social = origin + '/library/apps/social-debt-explorer/';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

test('the central manifest covers every registered old app plus roots, alias and retired notice', () => {
  assert.equal(originalRoutes.length, 82, 'retain the independently recorded source inventory');
  assert.deepEqual(manifest.sources.map(source => [source.repository, source.html_files]), [['Project-web-apps', 85], ['more-project-apps', 2]]);
  for (const source of manifest.sources) assert.match(source.revision, /^[a-f0-9]{40}$/);
  const expected = originalRoutes.map(route => '/Project-web-apps/' + route.old_path).concat([
    '/Project-web-apps/index.html', '/Project-web-apps/web_apps/regulatory-benefits-pmo/index.html',
    '/Project-web-apps/web_apps/3D_Construction_Workflow.html',
    '/more-project-apps/index.html', '/more-project-apps/web_apps/social-debt-explorer.html'
  ]);
  assert.equal(manifest.routes.length, 87);
  assert.equal(new Set(manifest.routes.map(route => route.path)).size, 87);
  assert.deepEqual(manifest.routes.map(route => route.path).sort(), expected.sort(), 'case, spaces, suffixes and nested index paths are exact');
  for (const original of originalRoutes) {
    const actual = manifest.routes.find(route => route.path === '/Project-web-apps/' + original.old_path);
    assert.equal(actual.name, original.name);
    assert.equal(actual.kind, 'redirect');
    assert.match(actual.source_stub_sha256, /^[a-f0-9]{64}$/);
    const registered = specialists.find(row => row.repo === 'Project-web-apps' && row.name === actual.name);
    assert.ok(registered, actual.name + ': registered maintained home');
    assert.equal(actual.destination, registered.url, actual.name + ': forwards directly to its current home');
    if (actual.name !== 'social-debt-explorer') assert.equal(actual.destination, original.destination, actual.name + ': original migration destination retained');
  }
  const alias = manifest.routes.find(route => route.path.endsWith('/regulatory-benefits-pmo/index.html'));
  assert.equal(alias.alias_of, '/Project-web-apps/web_apps/regulatory-benefits-pmo.html');
  assert.equal(alias.destination, manifest.routes.find(route => route.path === alias.alias_of).destination);
  assert.equal(manifest.routes.find(route => route.path === '/Project-web-apps/index.html').query_destination, origin + '/all-project-apps.html');
  for (const old of ['/Project-web-apps/web_apps/social-debt-explorer.html', '/more-project-apps/index.html', '/more-project-apps/web_apps/social-debt-explorer.html']) assert.equal(manifest.routes.find(route => route.path === old).destination, social);
});

test('every redirect preserves queries, repeated parameters and fragments, with a matching blocked-navigation fallback', () => {
  for (const route of manifest.routes.filter(route => route.kind === 'redirect')) {
    const html = read(route.path);
    assert.ok(Buffer.byteLength(html) < 2300, route.path + ': only a small compatibility page');
    const document = new JSDOM(html, { url: origin + route.path }).window.document;
    assert.equal(document.querySelector('link[rel=canonical]').href, route.destination);
    assert.equal(document.querySelector('meta[name=robots]').content, 'noindex, follow');
    assert.equal(document.querySelectorAll('script[src],link[rel=stylesheet],img,iframe').length, 0, route.path + ': no runtime app or external dependency');
    const fallback = document.getElementById('destination');
    assert.ok(fallback.textContent.trim());
    assert.equal(fallback.href, route.destination, route.path + ': no-script link remains useful');
    const script = document.querySelector('script').textContent;
    for (const [search, hash] of [
      ['', ''], ['?app=social-debt-explorer', ''],
      ['?from=saved&repeat=1&repeat=2&encoded=%2523%26%3D', '#node=individual%3ACOG-001_KnowledgeMonopoly'],
      ['', '#view=path%3Aknowledge-flow-cascade'], ['?odd=%ZZ', '#bad%ZZ']
    ]) {
      for (const blocked of [false, true]) {
        let forwarded;
        const link = { href: route.destination };
        const location = { search, hash, replace: url => { forwarded = url; if (blocked) throw Error('navigation blocked'); } };
        vm.runInNewContext(script, { URL, location, document: { getElementById: id => { assert.equal(id, 'destination'); return link; } } });
        const expected = new URL(route.query_destination && search ? route.query_destination : route.destination);
        expected.search = search;
        if (hash) expected.hash = hash;
        assert.equal(forwarded, expected.href, route.path + ': exact target and incoming state');
        assert.equal(link.href, expected.href, route.path + ': same manual destination if forwarding fails');
      }
    }
  }
});

test('retired animation stays an explanatory notice and compatibility catalogues retain all moved identities', () => {
  const retired = manifest.routes.filter(route => route.kind === 'retired');
  assert.equal(retired.length, 1);
  assert.equal(retired[0].path, '/Project-web-apps/web_apps/3D_Construction_Workflow.html');
  const html = read(retired[0].path);
  assert.ok(html.includes(retired[0].reason));
  assert.ok(!html.includes('<script>') && !html.includes('location.replace'), 'the notice does not imply a replacement model');
  for (const file of ['Project-web-apps/app-index.csv', 'more-project-apps/app-index.csv']) {
    const rows = read(file).trimEnd().split(/\r?\n/);
    assert.equal(rows.length, 1, file + ': no active collection rows');
    assert.ok(rows[0].startsWith('#,name,description,'));
  }
  const moved = json('Project-web-apps/moved-apps.json');
  assert.equal(moved.length, originalRoutes.length);
  assert.deepEqual(moved.map(row => row.old_path).sort(), originalRoutes.map(row => row.old_path).sort());
  assert.ok(moved.every(row => row.source_repository === 'Project-web-apps'));
  for (const route of manifest.routes.filter(route => route.kind === 'redirect' && route.name)) {
    const row = moved.find(item => item.name === route.name);
    for (const [key, value] of Object.entries(route.registry_metadata || {})) assert.deepEqual(row[key], value, route.name + ': retain existing registry metadata ' + key);
  }
  assert.equal(moved.find(row => row.name === 'social-debt-explorer').destination, social);
  assert.equal(json('Project-web-apps/retired-apps.json')[0].name, '3D_Construction_Workflow');
});

test('the old Social Debt image and notes remain accessible without a duplicate working app', () => {
  assert.equal(manifest.assets.length, 1);
  const image = manifest.assets[0];
  assert.equal(image.path, '/more-project-apps/assets/social-debt/team-release-scene.jpg');
  assert.equal(image.sha256, '4069e80cdee55573a556bd1c335bb20324c876cd8daf625054d1b4e0c938e6be');
  assert.equal(sha(fs.readFileSync(path.join(root, image.path))), image.sha256);
  assert.ok(fs.readFileSync(path.join(root, image.path)).equals(fs.readFileSync(path.join(root, image.source))));
  assert.ok(read('more-project-apps/assets/social-debt/visual-notes.md').includes('/library/apps/social-debt-explorer/provenance/original-visual-notes.md'));
  assert.ok(!read('more-project-apps/web_apps/social-debt-explorer.html').includes('kg-data'));
});

test('generation is reproducible and rejects unregistered files or changed compatibility images', () => {
  assert.equal(generate({ check: true }), 93);
  assert.equal(outputs(manifest).size, 93);
  const altered = JSON.parse(JSON.stringify(manifest));
  altered.assets[0].sha256 = '0'.repeat(64);
  assert.throws(() => outputs(altered), /Legacy asset has changed/);
  const escape = JSON.parse(JSON.stringify(manifest));
  escape.routes[0].path = '/Project-web-apps/../index.html';
  assert.throws(() => outputs(escape), /Unsupported compatibility path/);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'legacy-app-routes-'));
  try {
    assert.equal(generate({ destination: temporary }), 93);
    assert.equal(generate({ check: true, destination: temporary }), 93);
    const alias = path.join(temporary, manifest.build_aliases[0].path);
    fs.writeFileSync(alias, '<p>Jekyll-rendered illustration notes</p>');
    assert.throws(() => generate({ check: true, destination: temporary }), /Unregistered file in compatibility output/, 'source check still rejects the exact build alias');
    assert.equal(generate({ check: true, destination: temporary, built: true }), 93);
    fs.writeFileSync(path.join(temporary, 'Project-web-apps/unregistered.html'), '<p>Unexpected content</p>');
    assert.throws(() => generate({ check: true, destination: temporary }), /Unregistered file in compatibility output/);
    assert.throws(() => generate({ check: true, destination: temporary, built: true }), /Unregistered file in compatibility output/, 'built exception does not admit other files');
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
});

if (process.argv[2]) {
  test('every generated compatibility page, catalogue and image is published with the verified bytes', () => {
    const builtRoot = path.resolve(process.argv[2]);
    assert.equal(generate({ check: true, destination: builtRoot, built: true }), 93);
    assert.deepEqual(manifest.build_aliases, [{ path: '/more-project-apps/assets/social-debt/visual-notes.html', source: '/more-project-apps/assets/social-debt/visual-notes.md' }]);
    for (const alias of manifest.build_aliases) {
      const file = path.join(builtRoot, alias.path);
      if (fs.existsSync(file)) {
        const document = new JSDOM(fs.readFileSync(file, 'utf8'), { url: origin + alias.path }).window.document;
        assert.ok([...document.querySelectorAll('a[href]')].some(link => link.href === social + 'provenance/original-visual-notes.md'), 'optional Jekyll HTML alias retains the exact maintained notes link');
      }
    }
  });
}
