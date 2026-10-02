import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
const root=dirname(fileURLToPath(import.meta.url));
const site=resolve(root,'../..');
const apps=JSON.parse(readFileSync(resolve(site,'_data/library_apps.json'),'utf8'));
const themes=JSON.parse(readFileSync(resolve(site,'_data/library_themes.json'),'utf8'));
const app=apps.find(a=>a.id===(process.env.APP||apps[0].id));
if(!app) throw Error('Unknown Library app');
const theme=themes.find(t=>t.id===app.theme);
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default defineConfig({
 root:resolve(root,'apps',app.id), base:'./', publicDir:false,
 build:{outDir:resolve(site,'library/apps',app.id),emptyOutDir:true},
 plugins:[react(),{name:'library-reading-frame',transformIndexHtml:{order:'pre',handler(html){
 const entry=html.match(/<script[^>]*type="module"[^>]*src="([^"]+)"/)[1];
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(app.title)} · Lawrence Rowland</title><meta name="description" content="${esc(app.description)}"><link rel="canonical" href="https://lawrencerowland.github.io${app.url}"><link rel="stylesheet" href="../../../assets/library-frame.css"></head><body><a class="library-skip" href="#root">Skip to the example</a><header class="library-frame"><nav aria-label="Library"><a href="../../../library.html#interactive-methods">← Library</a><span aria-hidden="true"> / </span><a href="../../methods/${theme.id}.html">${esc(theme.title)}</a></nav><p class="library-frame-title">${esc(app.title)}</p><p>${esc(app.description)}</p><details><summary>Try this · assumptions · source</summary><p><strong>Try.</strong> ${esc(app.try_this)}</p><p><strong>Limits.</strong> ${esc(app.limitation)}</p><p>Earlier example reviewed ${app.reviewed}. <a href="https://github.com/lawrencerowland/lawrencerowland.github.io/tree/master/tools/library-apps/apps/${app.id}">Editable source</a>.</p></details></header><main id="root" tabindex="-1"></main><noscript>This interactive example needs JavaScript. <a href="../../methods/${theme.id}.html#${app.id}">Read its purpose and assumptions in the Library.</a></noscript><footer class="library-frame"><a href="../../methods/${theme.id}.html#${app.id}">More ${esc(theme.title.toLowerCase())} examples →</a></footer><script type="module" src="${entry}"></script></body></html>`;
 }}}],
 test:{globals:true,setupFiles:resolve(root,'src/common/setupTests.js'),environment:'jsdom',exclude:['**/node_modules/**','**/dist/**']}
});
