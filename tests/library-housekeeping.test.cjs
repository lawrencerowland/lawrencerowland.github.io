'use strict';
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root,'blog_summary.md'),'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
for (const blocked of [false,true]) {
  let replaced; const destination = {href:'https://lawrencerowland.github.io/blog.html'};
  vm.runInNewContext(script,{URL,document:{getElementById:id=>{assert.equal(id,'writing-destination');return destination;}},window:{location:{search:'?from=notes&term=a%20b',hash:'#earlier-notes--2020',replace:href=>{replaced=href;if(blocked)throw Error('blocked');}}}});
  assert.equal(replaced,'https://lawrencerowland.github.io/blog.html?from=notes&term=a%20b#earlier-notes--2020');
  assert.equal(destination.href,replaced,'fallback preserves the same target when navigation is blocked');
}
const oldRoutes = ['/2020/06/20/Project-management-jobs-to-be-done.html','/2020/05/16/Adopt-existing-portfolio-framework.html','/2020/05/08/Applying-appropriate-machine-learning-approach.html','/2020/05/07/Data-models-for-Project-Portfolios.md.html'];
const pdf='deep-research/2025 04 project gaps capabilities resources DeepR.pdf';
assert.equal(fs.readFileSync(path.join(root,pdf)).subarray(0,5).toString(),'%PDF-');
assert.ok(!fs.readFileSync(path.join(root,'deep-research/index.md'),'utf8').includes('research2.html'),'unavailable report is not advertised');
assert.ok(!fs.readFileSync(path.join(root,'deep-research/research2.md'),'utf8').includes('<embed'),'unavailable report has no broken embedded PDF');
if(process.argv[2]) {
 const built = path.resolve(process.argv[2]);
 const blog=fs.readFileSync(path.join(built,'blog.html'),'utf8');
 for(const route of oldRoutes) {assert.ok(blog.includes('href="'+route+'"')); assert.ok(fs.existsSync(path.join(built,route)));}
 for(const id of ['notes','blog-posts','earlier-notes--2020']) assert.ok(blog.includes('id="'+id+'"'),'old heading fragment retained: '+id);
 const earlier=fs.readFileSync(path.join(built,'blog_summary.html'),'utf8');
 assert.match(earlier,/<a[^>]*id="writing-destination"[^>]*href="\/blog.html"/);
 assert.ok(earlier.includes('https://lawrencerowland.github.io/blog.html'),'canonical archive route retained');
 assert.ok(fs.readFileSync(path.join(built,pdf)).equals(fs.readFileSync(path.join(root,pdf))),'published PDF is byte-preserved');
 for(const file of ['library.html','blog.html','blog_summary.html','deep-research/index.html','deep-research/research1.html','deep-research/research2.html']) {
  const html=fs.readFileSync(path.join(built,file),'utf8');
  assert.ok(!html.includes('{{')&&!html.includes('{%'),file+' fully rendered');
  for(const match of html.matchAll(/(?:href|src|data)="([^"#]+)"/g)) {
   if(/^[a-z][a-z0-9+.-]*:|^\/\//i.test(match[1]))continue;
   const url=new URL(match[1],'https://lawrencerowland.github.io/'+file);
   if(url.origin!=='https://lawrencerowland.github.io')continue;
   let route=decodeURIComponent(url.pathname); if(route.endsWith('/'))route+='index.html';
   assert.ok(fs.existsSync(path.join(built,route)),file+' has published local target '+route);
  }
 }
}
console.log('PASS: old writing URLs preserve query/fragment and fallback; original post routes and PDF retained; unavailable report unlisted; optional built links verified.');
