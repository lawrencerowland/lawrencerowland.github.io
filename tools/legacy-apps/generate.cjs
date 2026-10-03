'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const manifestPath = path.join(root, '_data/legacy_app_routes.json');
const prefixes = ['Project-web-apps', 'more-project-apps'];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
function outputPath(route) {
  if (!route.startsWith('/') || route.includes('\\') || route.split('/').includes('..') || !prefixes.some(prefix => route.startsWith('/' + prefix + '/'))) throw Error('Unsupported compatibility path: ' + route);
  return route.slice(1);
}
function page(route) {
  const destination = escapeHTML(route.destination);
  const retired = route.kind === 'retired';
  const redirect = retired ? '' : `<script>
(function () {
  const link = document.getElementById('destination');
  const destination = ${JSON.stringify(route.destination)};
  const queryDestination = ${JSON.stringify(route.query_destination || null)};
  const target = new URL(queryDestination && location.search ? queryDestination : destination);
  target.search = location.search;
  if (location.hash) target.hash = location.hash;
  link.href = target.href;
  try { location.replace(target.href); } catch (_) { /* Keep the matching manual link available. */ }
})();
</script>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, follow"><title>${escapeHTML(route.title)}</title><link rel="canonical" href="${destination}"><style>body{max-width:42rem;margin:12vh auto;padding:1.5rem;background:#f6f1e7;color:#26342c;font:18px/1.6 system-ui,sans-serif}a{color:#245d49}a:focus-visible{outline:3px solid currentColor;outline-offset:4px}</style></head>
<body><main><h1>${escapeHTML(route.title)}</h1><p>${retired ? escapeHTML(route.reason) : 'This example now has a maintained home.'}</p><p><a id="destination" href="${destination}">${retired ? 'Browse delivery dynamics in the Library' : 'Continue to its new home'} →</a></p></main>
${redirect}
<!-- Central compatibility route: ${escapeHTML(route.path)} -->
</body></html>
`;
}
function outputs(manifest) {
  const result = new Map();
  const add = (route, body) => {
    const file = outputPath(route);
    if (result.has(file)) throw Error('Duplicate compatibility path: ' + route);
    result.set(file, Buffer.isBuffer(body) ? body : Buffer.from(body));
  };
  for (const route of manifest.routes) {
    if (!['redirect', 'retired'].includes(route.kind)) throw Error('Unsupported route kind: ' + route.kind);
    const destination = new URL(route.destination);
    if (destination.origin !== 'https://lawrencerowland.github.io') throw Error('Unexpected destination origin: ' + destination.origin);
    add(route.path, page(route));
  }
  for (const item of manifest.text_responses) add(item.path, item.content);
  for (const item of manifest.registry_responses) {
    const rows = manifest.routes.filter(route => route.source_repository === item.source_repository && route.name && !route.alias_of && route.kind === (item.kind === 'moved' ? 'redirect' : 'retired'));
    const data = rows.map(route => item.kind === 'moved'
      ? { name: route.name, source_repository: route.source_repository, old_path: route.path.slice(route.source_repository.length + 2), destination: route.destination, ...route.registry_metadata }
      : { repo: route.source_repository, name: route.name, old_path: route.path.slice(route.source_repository.length + 2), reason: route.registry_metadata?.reason || route.reason });
    add(item.path, JSON.stringify(data, null, 2) + '\n');
  }
  for (const item of manifest.assets) {
    const source = path.resolve(root, item.source);
    if (!source.startsWith(root + path.sep)) throw Error('Asset source is outside this site: ' + item.source);
    const bytes = fs.readFileSync(source);
    if (crypto.createHash('sha256').update(bytes).digest('hex') !== item.sha256) throw Error('Legacy asset has changed: ' + item.source);
    add(item.path, bytes);
  }
  return result;
}
function filesUnder(folder) {
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? filesUnder(path.join(folder, entry.name)) : [path.join(folder, entry.name)]);
}
function generate({ check = false, destination = root, built = false } = {}) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const result = outputs(manifest);
  // Jekyll may render this plain Markdown beside the byte-preserved source.
  // This exception is only for a built-site check, never the source inventory.
  const buildAliases = new Set((manifest.build_aliases || []).map(item => {
    const alias = outputPath(item.path), source = outputPath(item.source);
    if (!result.has(source) || !source.endsWith('.md') || alias !== source.replace(/\.md$/, '.html')) throw Error('Unsupported Jekyll alias: ' + item.path);
    return alias;
  }));
  for (const prefix of prefixes) {
    for (const file of filesUnder(path.join(destination, prefix))) {
      const relative = path.relative(destination, file).split(path.sep).join('/');
      if (!result.has(relative) && !(check && built && buildAliases.has(relative))) throw Error('Unregistered file in compatibility output; inspect before removing it: ' + relative);
    }
  }
  for (const [relative, content] of result) {
    const file = path.join(destination, relative);
    if (check) {
      if (!fs.existsSync(file) || !fs.readFileSync(file).equals(content)) throw Error('Compatibility output is missing or stale: ' + relative);
    } else {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content);
    }
  }
  return result.size;
}
module.exports = { outputs, generate };
if (require.main === module) {
  try {
    const check = process.argv.includes('--check');
    const count = generate({ check });
    console.log((check ? 'Verified' : 'Generated') + ' ' + count + ' central compatibility files.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
