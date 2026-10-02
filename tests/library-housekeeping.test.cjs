'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const origin = 'https://lawrencerowland.github.io';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const digest = content => crypto.createHash('sha256').update(content).digest('hex');
const fixture = JSON.parse(read('tests/fixtures/historical-articles.json'));
const records = JSON.parse(read('_data/historical_articles.yml'));
const materials = JSON.parse(read('_data/library_materials.json'));
const libraryRedirects = JSON.parse(read('_data/library_redirects.json'));
const articles = fixture.articles;
const scalar = (source, key) => {
  const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(frontMatter, 'source has front matter');
  const value = frontMatter[1].match(new RegExp('^' + key + ':\\s*(.+)$', 'm'))?.[1];
  return value?.trim().replace(/^(["'])(.*)\1$/, '$2');
};

// These hashes were captured from commit 38c935c and its PR #160 built artifact,
// before migration. Do not regenerate them from the new articles. Normalize only
// the authorized title/heading, image-path and reader-navigation changes.
function normalizedBody(source) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/^\s*# [^\n]*\n/, '')
    .replace(/^#{1,2} /gm, '## ')
    .replace(/\{% include screenshot url="2020-05-07-Data-models-for-Project-Portfolios\/Graph_Option\.png" %\}/g, '[RETAINED_GRAPH_OPTION_IMAGE]')
    .replace(/<figure><img src="\{\{ '\/images\/Portfolio-data-model\/Graph_Option\.png' \| relative_url \}\}" alt="A graph-based view of a project portfolio"><\/figure>/g, '[RETAINED_GRAPH_OPTION_IMAGE]')
    .replace(/^\[(?:Back to Blog|Return to Portfolio frameworks|Historical articles in the Library|Return to related Library material)\].*$/gm, '')
    .split('\n').map(line => line.trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
function normalizedVisibleText(html) {
  return html.replace(/<p><a\b[^>]*>(?:Back to Blog|Return to Portfolio frameworks|Historical articles in the Library|Return to related Library material)<\/a>[\s\S]*?<\/p>/g, '')
    .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
const externalLinks = html => [...html.matchAll(/<a\b[^>]*href="(https?:[^"#]+(?:#[^"]*)?)"/g)].map(match => match[1]);
const ids = html => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
const sourceLayout = read('_layouts/historical-article.html');
assert.match(sourceLayout, /Originally published/);
assert.match(sourceLayout, /<time\b/);
assert.match(sourceLayout, /page\.date/);
assert.ok(sourceLayout.includes('library_url'), 'articles return directly to their peer card in the Library subject');
assert.ok(!sourceLayout.includes('/library.html#historical-articles') && !sourceLayout.includes('More from the same period'), 'related reading follows subject rather than publication period');
assert.ok(!fs.existsSync(path.join(root, 'blog.md')) && !fs.existsSync(path.join(root, 'blog_summary.md')), 'both blog index sources are retired');
assert.ok(!fs.existsSync(path.join(root, '_posts')) || fs.readdirSync(path.join(root, '_posts')).length === 0, 'no parallel post archive remains');
assert.equal(articles.length, 4);
assert.equal(records.length, 4);
assert.equal(new Set(records.map(article => article.url)).size, 4);
assert.deepEqual([...records.map(article => article.url)].sort(), [...articles.map(article => article.url)].sort());
const subjects = {
  '/library/articles/data-models-for-project-portfolios.html': 'data-models',
  '/library/articles/choosing-a-machine-learning-approach.html': 'methods',
  '/library/articles/adopting-a-portfolio-framework.html': 'frameworks',
  '/library/articles/project-management-jobs-to-be-done.html': 'frameworks'
};
for (const article of articles) {
  const source = read(article.source);
  const record = records.find(candidate => candidate.url === article.url);
  assert.equal(scalar(source, 'layout'), 'historical-article', article.source);
  assert.equal(scalar(source, 'schema_type'), 'Article', article.source);
  assert.equal(scalar(source, 'date'), article.date, 'retain the original publication date');
  assert.equal(scalar(source, 'title_anchor'), article.title_anchor, 'retain the original title fragment');
  assert.equal(record.date, article.date);
  assert.equal(record.subject, subjects[article.url], 'article is grouped with its subject');
  const placement = materials.find(item => item.kind === 'article' && item.historical_url === article.url);
  assert.ok(placement, 'article has a peer placement in the subject');
  assert.equal(record.library_url, '/library/methods/' + placement.theme + '.html#' + placement.id);
  assert.ok(record.guide_url && record.guide_title, 'article retains a route to the related subject guide');
  assert.equal(record.title, scalar(source, 'title'));
  assert.ok(record.summary.trim(), 'every Library entry has reading context');
  assert.equal(digest(normalizedBody(source)), article.normalized_body_sha256, article.source + ': complete original body preserved under the documented changes');
  assert.ok(!/Back to Blog|schema_type: BlogPosting/.test(source));
  for (const image of article.images) {
    assert.equal(digest(fs.readFileSync(path.join(root, image.url))), image.sha256, image.url + ': retained image bytes');
  }
}
assert.ok(read('library/articles/adopting-a-portfolio-framework.md').includes('reading guidance revised 29 September 2026'), 'later revision is separately dated');
assert.ok(read('library/articles/adopting-a-portfolio-framework.md').includes('/Portfolio-frameworks.html#use-case-1-adopt-a-framework'), 'retain the subject-guide return route');
assert.ok(!read('ML-for-portfolios.md').includes('/2020/05/08/'), 'subject guide links directly to the moved ML article');
assert.ok(read('ML-for-portfolios.md').includes('/library/articles/choosing-a-machine-learning-approach.html'));
assert.ok(!read('Portfolio-frameworks.md').includes('/2020/05/16/'), 'framework guide links directly to the moved adoption article');
assert.ok(read('Portfolio-frameworks.md').includes('/library/articles/adopting-a-portfolio-framework.html'));

const redirects = articles.map(article => ({
  old: article.old_url, target: article.url, fragment: '#' + article.legacy_ids.find(id => !id.startsWith('markdown-toc'))
})).concat(['/blog.html', '/blog_summary.html'].map(old => ({old, target: '/library.html#library-starts', fragment: '#earlier-notes--2020'})));
const legacySources = fs.readdirSync(path.join(root, 'legacy-writing')).filter(file => file.endsWith('.html')).map(file => read('legacy-writing/' + file));
assert.equal(legacySources.length, 6, 'six compatibility pages and no blog copy');
const redirectScript = html => [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]).find(script => script.includes('article-destination') && script.includes('location.replace'));
const script = redirectScript(read('_layouts/legacy-writing-redirect.html'));
assert.ok(script, 'use the actual redirect script');
function exerciseRedirect(script, redirect, actualHref = new URL(redirect.target, origin).href) {
  for (const blocked of [false, true]) {
    for (const [search, hash] of [['', ''], ['?from=old&term=a%20b', ''], ['', redirect.fragment], ['?from=old&term=a%20b', redirect.fragment], ['?a=1', '#unknown-section']]) {
      let replaced;
      const destination = {href: actualHref};
      const expected = new URL(redirect.target, origin);
      expected.search = search;
      if (hash) expected.hash = hash;
      vm.runInNewContext(script, {
        URL,
        document: {getElementById: id => { assert.equal(id, 'article-destination'); return destination; }},
        window: {location: {search, hash, replace: href => { replaced = href; if (blocked) throw Error('navigation blocked'); }}}
      });
      assert.equal(replaced, expected.href, redirect.old + ': direct destination preserves query and fragment');
      assert.equal(destination.href, expected.href, redirect.old + ': visible fallback preserves the same URL when navigation fails');
    }
  }
}
for (const redirect of redirects) {
  const matching = legacySources.filter(source => scalar(source, 'permalink') === redirect.old);
  assert.equal(matching.length, 1, redirect.old + ': exact old route including case and suffix');
  const source = matching[0];
  assert.equal(scalar(source, 'layout'), 'legacy-writing-redirect');
  assert.equal(scalar(source, 'redirect_to'), redirect.target);
  assert.equal(scalar(source, 'canonical_url'), new URL(redirect.target, origin).href.split('#')[0]);
  assert.equal(scalar(source, 'legacy_redirect'), 'true');
  assert.equal(scalar(source, 'sitemap'), 'false');
  exerciseRedirect(script, redirect);
}
const librarySource = read('library.md');
for (const id of ['notes', 'blog-posts', 'earlier-notes--2020', 'historical-articles', 'library-starts']) assert.ok(ids(librarySource).has(id), 'Library retains generic index fragment ' + id);
for (const id of ['library-data-models', 'library-frameworks', 'library-methods']) assert.ok(libraryRedirects.some(item => item.id === id), 'Library retains a forwarding entrance for migrated index fragment ' + id);
assert.ok(read('sitemap.md').includes('page.legacy_redirect'), 'human sitemap excludes compatibility pages');
assert.ok(!read('sitemap.md').includes('site.posts'), 'no empty Posts section');
assert.ok(!read('_includes/footer.html').includes('/feed.xml'), 'empty historical feed is not advertised');
assert.ok(!read('_includes/head.html').includes('feed_meta'), 'no empty-feed autodiscovery');

// Retain the existing checks for the separate Deep Research material.
const pdf = 'deep-research/2025 04 project gaps capabilities resources DeepR.pdf';
assert.equal(fs.readFileSync(path.join(root, pdf)).subarray(0, 5).toString(), '%PDF-');
assert.ok(!read('deep-research/index.md').includes('research2.html'), 'unavailable report is not advertised');
assert.ok(!read('deep-research/research2.md').includes('<embed'), 'unavailable report has no broken embedded PDF');
if (process.argv[2]) {
  const built = path.resolve(process.argv[2]);
  const builtRead = file => fs.readFileSync(path.join(built, file), 'utf8');
  const library = builtRead('library.html');
  const siteMap = builtRead('sitemap.xml');
  const humanMap = builtRead('sitemap.html');
  for (const article of articles) {
    const html = builtRead(article.url);
    const record = records.find(candidate => candidate.url === article.url);
    assert.ok(html.includes('href="' + record.library_url + '"'), article.url + ': returns to its peer card in the Library subject');
    const related = html.match(/<nav class="pw-article-related"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(related, 'related reading navigation exists');
    assert.ok(related.includes('href="' + record.guide_url + '"'), 'related subject guide remains reachable');
    const relatedArticles = [...related.matchAll(/href="(\/library\/articles\/[^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(relatedArticles.sort(), records.filter(candidate => candidate.subject === record.subject && candidate.url !== article.url).map(candidate => candidate.url).sort(), 'related articles share the same subject');
    const body = html.match(/<div class="pw-article-body">([\s\S]*)<\/div>\s*<nav class="pw-article-related"/)?.[1];
    assert.ok(body !== undefined, article.url + ': rendered article body exists');
    assert.equal(digest(normalizedVisibleText(body)), article.normalized_visible_text_sha256, article.url + ': original visible text and order preserved');
    assert.deepEqual(externalLinks(body), article.external_links, article.url + ': original external references preserved');
    assert.equal((html.match(/<h1\b/g) || []).length, 1, article.url + ': one page title');
    for (const id of [article.title_anchor, ...article.legacy_ids]) assert.ok(ids(html).has(id), article.url + ': original fragment ' + id);
    const dateTag = new RegExp('<time\\b[^>]*datetime="' + article.date + '"[^>]*>([^<]+)</time>');
    const date = html.match(dateTag);
    assert.ok(date, article.url + ': original publication date is visible and machine-readable');
    const expectedDate = new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(new Date(article.date + 'T12:00:00Z'));
    assert.equal(date[1].trim(), expectedDate);
    assert.match(html, /Historical article · Originally published/);
    assert.ok(html.includes('rel="canonical" href="' + origin + article.url + '"'), article.url + ': new canonical URL');
    assert.ok(!html.includes('BlogPosting'), article.url + ': no old blog schema');
    const structured = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    assert.ok(structured.some(item => item['@type'] === 'Article' && item.datePublished?.startsWith(article.date) && item.url === origin + article.url), article.url + ': Article metadata retains original date');
    for (const item of structured) if (item.datePublished) assert.ok(item.datePublished.startsWith(article.date), article.url + ': metadata dates agree');
    const renderedImages = [...body.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(renderedImages, article.images.map(image => image.url), article.url + ': all original diagrams appear in order');
    for (const image of article.images) assert.equal(digest(fs.readFileSync(path.join(built, image.url))), image.sha256, 'built diagram is byte-preserved');
    const subjectURL = new URL(record.library_url, origin);
    const subjectPage = builtRead(subjectURL.pathname);
    assert.ok(ids(subjectPage).has(subjectURL.hash.slice(1)), 'article return fragment exists on subject page');
    assert.ok(subjectPage.includes('href="' + article.url + '"'), 'Library subject directly links ' + article.url);
    assert.ok(subjectPage.match(dateTag), 'Library subject dates ' + article.url);
    assert.ok(siteMap.includes('<loc>' + origin + article.url + '</loc>'), 'machine sitemap includes article');
    assert.ok(humanMap.includes('href="' + article.url + '"'), 'human sitemap includes article');
  }
  for (const redirect of redirects) {
    const html = builtRead(redirect.old);
    const anchor = html.match(/<a\b[^>]*id="article-destination"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/);
    assert.ok(anchor && anchor[2].trim(), redirect.old + ': visible fallback exists without JavaScript');
    assert.equal(anchor[1], redirect.target);
    assert.ok(html.includes('rel="canonical" href="' + new URL(redirect.target, origin).href.split('#')[0] + '"'), 'redirect advertises new canonical');
    assert.ok(!html.includes('pw-article-body'), 'old URL contains no parallel article copy');
    exerciseRedirect(redirectScript(html), redirect, new URL(anchor[1], origin).href);
    assert.ok(!siteMap.includes('<loc>' + origin + redirect.old + '</loc>'), 'machine sitemap omits old route');
    assert.ok(!humanMap.includes('href="' + redirect.old + '"'), 'human sitemap omits old route');
    const target = new URL(redirect.target, origin);
    assert.ok(fs.existsSync(path.join(built, target.pathname)), 'redirect destination exists');
    if (target.hash) assert.ok(ids(builtRead(target.pathname)).has(target.hash.slice(1)), 'index destination fragment exists');
  }
  assert.ok(fs.existsSync(path.join(built, 'feed.xml')), 'feed endpoint remains available for existing subscribers');
  assert.ok(!builtRead('feed.xml').includes('<entry'), 'no parallel blog article feed remains');
  assert.ok(fs.readFileSync(path.join(built, pdf)).equals(fs.readFileSync(path.join(root, pdf))), 'published PDF is byte-preserved');
  const routes = ['library.html', ...new Set(materials.map(item => 'library/methods/' + item.theme + '.html')), ...articles.map(article => article.url), ...redirects.map(redirect => redirect.old), 'deep-research/index.html', 'deep-research/research1.html', 'deep-research/research2.html'];
  for (const file of routes) {
    const html = builtRead(file);
    assert.ok(!html.includes('{{') && !html.includes('{%'), file + ': Liquid fully rendered');
    for (const match of html.matchAll(/(?:href|src|data)="([^"]+)"/g)) {
      // Absolute references can lead to independent repositories on the same
      // GitHub Pages host. This check covers this site's relative resources.
      if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(match[1])) continue;
      const url = new URL(match[1], origin + '/' + file.replace(/^\//, ''));
      let route = decodeURIComponent(url.pathname);
      if (route.endsWith('/')) route += 'index.html';
      assert.ok(fs.existsSync(path.join(built, route)), file + ': published local target ' + route);
      if (url.hash && route.endsWith('.html')) assert.ok(ids(builtRead(route)).has(decodeURIComponent(url.hash.slice(1))), file + ': local fragment exists ' + url.pathname + url.hash);
    }
  }
}
console.log('PASS: four complete historical Library articles, original dates/images/fragments, six direct redirects and fallbacks, and retained Deep Research; optional built content and links verified.');
