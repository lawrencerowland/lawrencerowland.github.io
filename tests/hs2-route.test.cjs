const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../examples/hs2-decision-graph.html'), 'utf8');
const target = 'https://lawrencerowland.github.io/Project-web-apps/web_apps/hs2-decision-graph.html';
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).find(source => source.includes('location.replace'));

function follow(search = '', hash = '', blocked = false) {
  const link = { href: target };
  let forwarded;
  vm.runInNewContext(script, {
    URL,
    document: { getElementById(id) { assert.equal(id, 'destination'); return link; } },
    location: { search, hash, replace(url) { forwarded = url; if (blocked) throw new Error('Forwarding blocked'); } }
  });
  return { href: link.href, forwarded };
}

test('retained root route identifies the published canonical graph', () => {
  assert.ok(html.includes(`<link rel="canonical" href="${target}">`));
  assert.ok(html.includes(`<a id="destination" href="${target}">`));
  assert.match(html, /<noscript><p>Automatic forwarding requires JavaScript/);
  assert.doesNotMatch(html, /http-equiv\s*=\s*["']refresh/i);
  assert.deepEqual(follow(), { href: target, forwarded: target });
});

test('forwards exact query and fragment state while keeping the destination fixed', () => {
  for (const [search, hash] of [
    ['?view=scenario&label=a%20b', '#scenario-tab'],
    ['', '#details-tab'],
    ['?next=https%3A%2F%2Fexample.invalid%2F&tag=one&tag=two', '#https://example.invalid/']
  ]) {
    assert.deepEqual(follow(search, hash), { href: target + search + hash, forwarded: target + search + hash });
  }
});

test('manual fallback retains state even when automatic forwarding fails', () => {
  const expected = target + '?view=scenario#scenario-tab';
  assert.deepEqual(follow('?view=scenario', '#scenario-tab', true), { href: expected, forwarded: expected });
});

test('retains the required analytics snippets without retaining another graph implementation', () => {
  assert.match(html, /<!-- Google Tag Manager -->/);
  assert.match(html, /<!-- Google Tag Manager \(noscript\) -->/);
  assert.equal((html.match(/GTM-WXM2VXQH/g) || []).length, 2);
  assert.doesNotMatch(html, /ontologyData|d3\.forceSimulation|cdnjs\.cloudflare\.com/);
});
