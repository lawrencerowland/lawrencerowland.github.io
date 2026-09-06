const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const root=path.resolve('project-co-design');
const apps=['staged-paths','rail-power-loop','programme-studio','wildlife-crossing'];
const retired=['incremental-upgrade','rail-simulator','transit-tradeoffs'];
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const app of apps){assert(home.includes(`apps/${app}.html`),`Missing home route ${app}`);const source=fs.readFileSync(path.join(root,'apps',app+'.html'),'utf8');assert(source.includes('../index.html'),`Missing return ${app}`);assert(!source.includes('/Users/'));}
for(const name of retired){const source=fs.readFileSync(path.join(root,'apps',name+'.html'),'utf8');assert(!home.includes(`apps/${name}.html`),`Retired route still promoted: ${name}`);assert(source.includes('Retired experiment'));assert(source.includes('noindex'));assert(source.includes('programme-studio.html#coupling-primer'));assert(!/<script[ >]/i.test(source),'Retired app still runs code');}
assert.equal((home.match(/href="https:\/\/lawrencerowland.github.io\/side-projects.html"/g)||[]).length,2);
const engine=fs.readFileSync(path.join(root,'docs/rail-staged-codesign/model.cjs'));
assert.equal(crypto.createHash('sha256').update(engine).digest('hex'),'8350d0e1e37c6732a1bdd9c8e34b11cff73bf5178ddd643b732102c5b3b47887');
assert(fs.readFileSync(path.join(root,'apps/staged-paths.html'),'utf8').includes(engine.toString()),'Embedded verified engine changed');
for(const file of ['index.html',...[...apps,...retired].map(a=>'apps/'+a+'.html')]){
 const full=path.join(root,file),text=fs.readFileSync(full,'utf8');
 for(const match of text.matchAll(/(?:href|src)=["']([^"']+)["']/g)){
  const url=match[1];if(/^(https?:|data:|#)/.test(url)||url.includes('${'))continue;
  assert(fs.existsSync(path.resolve(path.dirname(full),url.split(/[?#]/)[0])),`${file}: broken ${url}`);
 }
}
assert(fs.readFileSync('_data/side_projects.yml','utf8').includes('https://lawrencerowland.github.io/project-co-design/'));
const powerPage=fs.readFileSync(path.join(root,'apps/rail-power-loop.html'),'utf8');
const inlineAtlas=powerPage.match(/<script id="mcdp-atlas" type="application\/json">([\s\S]*?)<\/script>/);
assert(inlineAtlas,'Missing recorded package calculations');
const atlasSource=fs.readFileSync(path.join(root,'docs/rail-power-loop/atlas.json'),'utf8');
assert.equal(inlineAtlas[1].trim(),atlasSource.trim(),'Browser atlas differs from the verified Python output');
assert.equal(JSON.parse(atlasSource).queries.length,98,'Missing supported briefs');
console.log('PASS: four active essays, three retirement records, reciprocal directory links, resources and unchanged staged engine.');
