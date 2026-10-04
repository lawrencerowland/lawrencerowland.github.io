'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const origin = 'https://lawrencerowland.github.io';
const canonical = origin + '/sitemap.html#for-agents';
const readJSON = name => JSON.parse(fs.readFileSync(path.join(root, '_data', name + '.json'), 'utf8'));
// Use Ruby's existing YAML parser, as the site's tests and Jekyll already do.
const readYAML = name => JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.load_file(ARGV[0]))', path.join(root, '_data', name + '.yml')], { encoding: 'utf8' }));
const html = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const markdown = value => String(value).replace(/([\\`*_[\]<>|])/g, '\\$1').replace(/\n/g, ' ');
const absolute = url => new URL(url, origin).href;
const link = (title, url) => '[' + markdown(title) + '](' + absolute(url) + ')';
function anchor(title, url) {
  const target = new URL(url, origin);
  // Preserve absolute catalogue URLs: sibling Pages projects share our host
  // but are not part of a local build of this repository.
  const href = String(url).startsWith('/') && !String(url).startsWith('//')
    ? "{{ '" + (target.pathname + target.search + target.hash).replace(/'/g, '%27') + "' | relative_url }}"
    : html(target.href);
  return '<a href="' + href + '">' + html(title) + '</a>';
}
const tagName = tag => ({ wbs: 'WBS', smc: 'SMC', 'github-pages': 'GitHub Pages' }[tag] || tag.replace(/[-_]/g, ' '));

function model() {
  const copy = readJSON('agent_orientation');
  const projects = readYAML('side_projects').filter(p => p.placement === 'project').sort((a, b) => a.gallery_order - b.gallery_order);
  const ids = projects.map(p => p.id);
  if (new Set(ids).size !== ids.length || Object.keys(copy.projects).length !== ids.length || Object.keys(copy.projects).some(id => !ids.includes(id))) throw Error('Agent project scope notes must exactly match the current project catalogue.');
  const apps = readJSON('library_apps'), materials = readJSON('library_materials');
  const themes = readJSON('library_themes').map(t => ({ ...t, url: '/library/methods/' + t.id + '.html', count: [...apps, ...materials].filter(e => e.theme === t.id).length }));
  const views = readJSON('visualisations');
  return { copy, projects: projects.map(p => {
    const note = copy.projects[p.id];
    for (const key of ['title', 'scenario', 'question', 'path', 'source_url']) if (!p[key]) throw Error(p.id + ': missing ' + key);
    if (!note.limit) throw Error(p.id + ': missing scope boundary');
    // Decode an escaped punctuation character already present in an older YAML scenario.
    const scenario = p.scenario.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
    return { ...p, scenario, question: p.entry_question || p.question, concepts: p.tags.filter(tag => !['github-pages', 'side-project'].includes(tag)).map(tagName), ...note };
  }), themes, views, additional: readJSON('library_additional'), wider: readJSON('wider_interest'), scenarios: readJSON('project_scenarios') };
}

function libraryMarkdown(data) {
  return data.themes.map(t => '- ' + link(t.title, t.url) + ': ' + t.description + ' (' + t.count + ' entries.)').concat([
    '- ' + link('Custom GPTs', '/gpt-links-page.html') + ': coaches, co-pilots and agents for thinking through project work.',
    ...data.additional.map(e => '- ' + link(e.title, e.url) + ': ' + e.description)
  ]).join('\n');
}

function projectMarkdown(project) {
  return '## ' + markdown(project.title) + '\n\n' +
    '- Question: ' + project.question + '\n- Scenario: ' + project.scenario + '\n- Approach: ' + project.description + '\n- Concepts: ' + project.concepts.join(', ') + '.\n- Scope and limits: ' + project.limit + '\n- ' + link('Open project', project.path) + ' · ' + link('GitHub source (may require access)', project.source_url) +
    (project.scope_links || []).map(item => ' · ' + link(item.title, item.url)).join('') + '\n';
}

function scenarioMarkdown(data) {
  return data.scenarios.map(s => '- ' + link(s.title, s.url) + ': ' + s.description + ' Enquiries: ' + s.projects.map(p => link(p.title, p.url)).join('; ') + '.').join('\n');
}

function guideHTML(data) {
  const c = data.copy;
  const projectRows = data.projects.map(p => '<tr data-agent-project="' + html(p.id) + '"><th scope="row">' + anchor(p.title, p.path) + '</th><td>' + html(p.question) + '<p class="pw-agent-approach">' + html(p.description) + '</p></td><td>' + html(p.scenario) + '</td><td>' + html(p.concepts.join(', ')) + '</td><td>' + html(p.limit) + '<br>' + anchor('GitHub source (may require access)', p.source_url) + (p.scope_links || []).map(s => '<br>' + anchor(s.title, s.url)).join('') + '</td></tr>').join('\n');
  const subjects = data.themes.map(t => '<li data-agent-theme="' + html(t.id) + '">' + anchor(t.title, t.url) + ' — ' + html(t.description) + ' <span>(' + t.count + ' entries)</span></li>').join('\n');
  return '<!-- Generated by tools/agent-orientation/generate.cjs; edit catalogues and _data/agent_orientation.json. -->\n' +
`<section class="pw-agent-orientation" id="for-agents" aria-labelledby="agent-welcome-title" tabindex="-1">
  <h2 id="agent-welcome-title">${html(c.title)}</h2>
  <p>${html(c.purpose)}</p>
  <ul class="pw-agent-entrances">${c.entrances.map(e => '<li>' + anchor(e.title, e.url) + ': ' + html(e.description) + '</li>').join('')}</ul>
  <p>${html(c.scope)}</p><p>${data.scenarios.length} ${anchor('scenarios', '/project-scenarios.html')} connect settings to their enquiries. ${anchor('Working views', '/explore-visually.html')} is the fourth navigation tab and shows the representations used inside the examples.</p>
  <p class="pw-agent-formats">${anchor('Read as Markdown', '/llms.txt')} · ${anchor('Detailed directory', '/agents/directory.md')} · ${anchor('Visual descriptions', '/agents/visual-atlas.md')}</p>
  <details><summary>Projects: questions, scenarios and limits (${data.projects.length})</summary>
    <p>The names, questions, scenarios and approaches follow the public project catalogue. These short boundary notes help interpret it; follow the project's own public scope when reading or continuing an enquiry. The linked End, Ways and Means statements belong to those projects.</p><p>${html(c.terms)}</p>
    <div class="pw-agent-table-wrap" role="region" aria-label="Project orientation table" tabindex="0"><table class="pw-agent-project-table"><caption>Published project entrances; links open each existing home</caption><thead><tr><th scope="col">Project</th><th scope="col">Question</th><th scope="col">Scenario</th><th scope="col">Concepts</th><th scope="col">Scope, limits and sources</th></tr></thead><tbody>
${projectRows}
    </tbody></table></div>
  </details>
  <details><summary>Library subjects and evidence boundaries</summary><p>${html(c.evidence)}</p><ul class="pw-agent-subjects">
${subjects}
    <li>${anchor('Custom GPTs', '/gpt-links-page.html')} — coaches, co-pilots and agents for thinking through project work.</li></ul><p>Further shelves: ${data.additional.map(e => anchor(e.title, e.url)).join(' · ')}. Wider interest has ${data.wider.length} pictured entries.</p></details>
  <details><summary>Reading the pictures (${data.views.length} views)</summary><p>${html(c.visual_guidance)}</p><p>Hover or focus for a hint; open a picture for its caption, “Look for”, “Keep in mind” and “View shown”. The preview links to the full image and its original example. ${anchor('Read all visual descriptions in Markdown', '/agents/visual-atlas.md')}.</p></details>
</section>
`;
}

function outputs(data = model()) {
  const c = data.copy;
  const short = '# Project Experiments in AI — agent welcome\n\n> ' + c.purpose + '\n\n' + c.scope + '\n\n' + c.evidence + '\n\n## Four navigation entrances\n\n' + c.entrances.map(e => '- ' + link(e.title, e.url) + ': ' + e.description).join('\n') +
    '\n\n## Orientation\n\n- ' + link('Agent welcome and sitemap', canonical) + ': the human-facing guide and the tree of existing homes.\n- ' + link('Project and Library directory', '/agents/directory.md') + ': ' + data.projects.length + ' project entrances with questions, scenarios, concepts and limits; ' + data.scenarios.length + ' concrete settings; ' + data.themes.length + ' Library subjects plus Custom GPTs and the further shelves. Follow each project’s public scope; some have their own End, Ways and Means.\n- ' + link('Working view descriptions', '/agents/visual-atlas.md') + ': ' + data.views.length + ' pictured views, with captions, what to look for, limits, depicted states, image URLs and canonical example URLs.\n\n' + c.visual_guidance + '\n\n## Optional\n\n- ' + link('About Lawrence and this collection', '/about_me.html') + '\n- ' + link('Machine sitemap', '/sitemap.xml') + ': published URL inventory; the human sitemap follows editorial homes.\n\nThis orientation is generated from the same public catalogues as the site. Picture capture and check dates describe those records, not a promise of present-day validity. Repository AGENTS.md files concern contributors; this guide does not grant authority to change a project or prescribe its next research step.\n';
  const directory = '# Project and Library directory\n\n' + link('Agent welcome', canonical) + ' · ' + link('Compact Markdown guide', '/llms.txt') + '\n\n' + c.purpose + '\n\n' + c.scope + '\n\n## Four navigation entrances\n\n' + c.entrances.map(e => '- ' + link(e.title, e.url) + ': ' + e.description).join('\n') + '\n\nThe question, scenario, approach and concept labels below follow the public catalogue. The short boundary notes are editorial orientation; the linked project owns its fuller scope. ' + c.terms + '\n\n' + data.projects.map(projectMarkdown).join('\n') + '\n## Scenarios\n\n' + scenarioMarkdown(data) + '\n\n## Library subjects and further shelves\n\n' + c.evidence + '\n\n' + libraryMarkdown(data) + '\n\n## Wider interest\n\n' + data.wider.map(e => '- ' + link(e.title, e.url) + ': ' + e.description).join('\n') + '\n\n## Reading the pictures\n\n' + c.visual_guidance + '\n\n' + link('Working view descriptions', '/agents/visual-atlas.md') + ': captions, limits, depicted states and source images for ' + data.views.length + ' views.\n';
  const atlas = '# Working views — meanings and source views\n\n' + link('Agent welcome', canonical) + ' · ' + link('Browse the pictures', '/explore-visually.html') + '\n\n' + c.visual_guidance + '\n\nCapture and check dates below describe the catalogue record. They do not claim that the live app was rechecked when this guide was generated. Use the image and the explanation together; read the original example for details beyond the depicted view.\n\n' + data.views.map(v => '## ' + markdown(v.title) + '\n\n- View ID: ' + v.id + '\n- Home: ' + v.home + '\n- Kind and catalogue status: ' + v.kind + '; ' + v.status + '\n- Caption: ' + v.caption + '\n- Look for: ' + v.look + '\n- Limit: ' + v.limit + (v.state ? '\n- Depicted state: ' + v.state : '') + '\n- Image description: ' + v.alt + '\n- ' + link('Preview this view', '/explore-visually.html?view=' + encodeURIComponent(v.id)) + ' · ' + link('Full image', v.image) + ' · ' + link('Thumbnail', v.thumb) + ' · ' + link('Original example', v.url) + '\n- Capture: ' + v.capture + '; recorded check date: ' + v.checked + (v.source_image ? '\n- ' + link('Original source image', v.source_image) : '') + '\n').join('\n');
  // A .txt source with an explicit .md permalink avoids Jekyll's Markdown
  // conversion while publishing actual Markdown at the advertised URLs.
  const markdownPage = (url, body) => '---\nlayout: null\npermalink: ' + url + '\nsitemap: false\n---\n' + body;
  return new Map([
    ['_includes/agent-orientation.html', guideHTML(data)],
    ['agents/overview.txt', markdownPage('/llms.txt', short)], ['LLMs.txt', short],
    ['agents/directory.txt', markdownPage('/agents/directory.md', directory)],
    ['agents/visual-atlas.txt', markdownPage('/agents/visual-atlas.md', atlas)]
  ]);
}

function generate({ check = false } = {}) {
  const result = outputs();
  for (const [name, content] of result) {
    const file = path.join(root, name);
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) throw Error('Agent orientation is missing or stale: ' + name);
    } else { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
  }
  return result.size;
}
module.exports = { model, outputs, generate, canonical };
if (require.main === module) {
  try { console.log((process.argv.includes('--check') ? 'Verified ' : 'Generated ') + generate({ check: process.argv.includes('--check') }) + ' agent orientation files.'); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
