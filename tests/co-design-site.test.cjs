const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const root=path.resolve('project-co-design');
const apps=['staged-paths','incremental-upgrade','programme-studio','rail-simulator','transit-tradeoffs','wildlife-crossing'];
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const app of apps){assert(home.includes(`apps/${app}.html`),`Missing home route ${app}`);const source=fs.readFileSync(path.join(root,'apps',app+'.html'),'utf8');assert(source.includes('../index.html'),`Missing return ${app}`);assert(!source.includes('/Users/'));}
const engine=fs.readFileSync(path.join(root,'docs/rail-staged-codesign/model.cjs'));
assert.equal(crypto.createHash('sha256').update(engine).digest('hex'),'8350d0e1e37c6732a1bdd9c8e34b11cff73bf5178ddd643b732102c5b3b47887');
assert(fs.readFileSync(path.join(root,'apps/staged-paths.html'),'utf8').includes(engine.toString()),'Embedded verified engine changed');
for(const file of ['index.html',...apps.map(a=>'apps/'+a+'.html')]){
 const full=path.join(root,file),text=fs.readFileSync(full,'utf8');
 for(const match of text.matchAll(/(?:href|src)=["']([^"']+)["']/g)){
  const url=match[1];if(/^(https?:|data:|#)/.test(url)||url.includes('${'))continue;
  assert(fs.existsSync(path.resolve(path.dirname(full),url.split(/[?#]/)[0])),`${file}: broken ${url}`);
 }
}
assert(fs.readFileSync('_data/side_projects.yml','utf8').includes('https://lawrencerowland.github.io/project-co-design/'));
console.log('PASS: six distinct routes, home returns, local resources and verified staged engine.');
