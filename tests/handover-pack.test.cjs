const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const {createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),app=path.join(root,'library/apps/governance-trio'),packDir=path.join(app,'handover-pack');
const model=require(path.join(app,'handover-model.js'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const clone=x=>JSON.parse(JSON.stringify(x));
function baseline(){return {record:JSON.parse(fs.readFileSync(path.join(packDir,'handover.json'))),policy:JSON.parse(fs.readFileSync(path.join(packDir,'policy.json'))),digests:JSON.parse(fs.readFileSync(path.join(packDir,'digests.json'))),files:Object.fromEntries(['concept-note.txt','risk-review.json'].map(name=>[name,fs.readFileSync(path.join(packDir,'evidence',name),'utf8')]))};}
function row(result,id){return result.checks.find(c=>c.id===id);}
function tempPack(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'handover-check-'));fs.cpSync(packDir,dir,{recursive:true});t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;}
function run(dir,...args){return spawnSync(process.execPath,['check.cjs',...args],{cwd:dir,encoding:'utf8'});}

test('complete package checks bytes while keeping acceptance unverified',async()=>{
  const input=baseline(),before=clone(input),result=await model.evaluate(input,sha);
  assert.equal(result.status,'pass');assert.equal(row(result,'acceptance').status,'unknown');
  assert.ok(result.checks.filter(c=>c.id!=='acceptance').every(c=>c.status==='pass'));
  assert.match(result.summary,/acceptance remains unverified/);assert.deepEqual(input,before);
});
test('counterexamples distinguish structure, declared policy, missing bytes and flat-map failure',async()=>{
  const cases=[['changed','digests'],['missing','digests'],['duplicate','policy'],['malformed','structure'],['wrapped','digests']];
  for(const [name,id] of cases){const result=await model.evaluate(model.example(baseline(),name),sha);assert.equal(result.status,'fail',name);assert.equal(row(result,id).status,'fail',name);assert.equal(row(result,'acceptance').status,'unknown');}
  const duplicate=await model.evaluate(model.example(baseline(),'duplicate'),sha);assert.equal(row(duplicate,'structure').status,'pass');assert.equal(row(duplicate,'digests').status,'pass');
  const malformed=await model.evaluate(model.example(baseline(),'malformed'),sha);assert.equal(row(malformed,'policy').status,'unknown');assert.equal(row(malformed,'digests').status,'unknown');
});
test('blank fields, impossible dates and unsafe paths fail before dependent checks',async()=>{
  const mutations=[p=>p.record.signoff[0].role=' ',p=>p.record.signoff[0].by='',p=>p.record.signoff[0].at='2026-02-30T12:00:00Z',p=>p.record.evidence[0].name='../outside.txt',p=>p.record.evidence[0].digest_ref='../../secret.sha256',p=>p.record.provenance.status='verified',p=>p.record.example_only=false];
  for(const mutate of mutations){const pack=baseline();mutate(pack);const result=await model.evaluate(pack,()=>{throw new Error('must not be called');});assert.equal(row(result,'structure').status,'fail');assert.equal(row(result,'digests').status,'unknown');}
});
test('hash and policy execution failures never become passes',async()=>{
  for(const hash of [null,()=>{throw new Error('hash tool failed');},()=>Promise.reject(new Error('async tool failure')),()=>undefined,()=>'' ]){const result=await model.evaluate(baseline(),hash);assert.equal(result.status,'unknown');assert.equal(row(result,'digests').status,'unknown');}
  for(const value of [null,{id:'other'}, {...baseline().policy,minimum_signoffs:1}]){const pack=baseline();pack.policy=value;const result=await model.evaluate(pack,sha);assert.equal(result.status,'unknown');assert.equal(row(result,'policy').status,'unknown');}
});
test('updating an evidence digest restores byte consistency, not authority or truth',async()=>{
  const input=model.example(baseline(),'changed');input.digests['concept-note.txt.sha256']=sha(input.files['concept-note.txt']);
  const result=await model.evaluate(input,sha);assert.equal(result.status,'pass');assert.equal(row(result,'acceptance').status,'unknown');
  input.record.evidence.push(clone(input.record.evidence[0]));assert.equal(row(await model.evaluate(input,sha),'policy').status,'fail');
});
test('CLI checks real files on every run; stale status cannot hide changed or missing bytes',t=>{
  const dir=tempPack(t);assert.equal(run(dir).status,0);
  fs.writeFileSync(path.join(dir,'handover.status'),'PASS\n');
  fs.appendFileSync(path.join(dir,'evidence/concept-note.txt'),'Changed\n');
  for(let i=0;i<2;i++){const result=run(dir);assert.equal(result.status,1);assert.equal(JSON.parse(result.stdout).status,'fail');}
  fs.copyFileSync(path.join(packDir,'evidence/concept-note.txt'),path.join(dir,'evidence/concept-note.txt'));
  assert.equal(run(dir).status,0);
  fs.unlinkSync(path.join(dir,'evidence/risk-review.json'));assert.equal(run(dir).status,1);
});
test('Make is phony, repeats failures and propagates tool failure; malformed JSON fails closed',t=>{
  const dir=tempPack(t),make=()=>spawnSync('make',['validate','NODE='+process.execPath],{cwd:dir,encoding:'utf8'});
  assert.equal(make().status,0);fs.appendFileSync(path.join(dir,'evidence/concept-note.txt'),'Changed\n');
  assert.notEqual(make().status,0);assert.notEqual(make().status,0);
  const failedTool=spawnSync('make',['validate','NODE=false'],{cwd:dir,encoding:'utf8'});assert.notEqual(failedTool.status,0);assert.doesNotMatch(failedTool.stdout,/Package checks pass/);
  fs.writeFileSync(path.join(dir,'policy.json'),'{');const malformed=run(dir);assert.equal(malformed.status,2);assert.match(malformed.stderr,/could not run/);
});
test('downloaded checker shares the model and recomputes browser snapshot inputs',t=>{
  const dir=tempPack(t);assert.deepEqual(fs.readFileSync(path.join(app,'handover-model.js')),fs.readFileSync(path.join(packDir,'handover-model.js')));
  const input=model.example(baseline(),'changed');input.result={status:'pass'};fs.writeFileSync(path.join(dir,'handover-inputs.json'),JSON.stringify(input));
  const result=run(dir,'handover-inputs.json');assert.equal(result.status,1);assert.equal(JSON.parse(result.stdout).status,'fail');
  fs.writeFileSync(path.join(dir,'handover-inputs.json'),JSON.stringify(baseline()));assert.equal(run(dir,'handover-inputs.json').status,0);
  const wrapped=model.example(baseline(),'wrapped');fs.writeFileSync(path.join(dir,'digests.json'),JSON.stringify(wrapped.digests));assert.equal(run(dir).status,1);
});
test('archive includes the exact maintained checker, evidence, schema, policy and instructions',()=>{
  const bytes=fs.readFileSync(path.join(app,'handover-pack.zip')),names=[];let offset=0;
  while(bytes.readUInt32LE(offset)===0x04034b50){const size=bytes.readUInt32LE(offset+18),nameLength=bytes.readUInt16LE(offset+26),extraLength=bytes.readUInt16LE(offset+28),name=bytes.subarray(offset+30,offset+30+nameLength).toString(),start=offset+30+nameLength+extraLength;assert.equal(bytes.readUInt16LE(offset+8),0);assert.ok(name.startsWith('handover-pack/'));assert.deepEqual(bytes.subarray(start,start+size),fs.readFileSync(path.join(app,name)),name);names.push(name);offset=start+size;}
  assert.equal(names.length,12);for(const name of ['check.cjs','handover-model.js','handover.schema.json','policy.json','digests.json','validate.workflow.yml','evidence/concept-note.txt','evidence/risk-review.json'])assert.ok(names.includes('handover-pack/'+name));
});

async function ui(t,hash=async(_algorithm,bytes)=>crypto.createHash('sha256').update(bytes).digest()){
  const {JSDOM}=createRequire(path.join(root,'tools/library-apps/package.json'))('jsdom');
  const dom=new JSDOM(fs.readFileSync(path.join(app,'index.html'),'utf8'),{url:'https://example.test/library/apps/governance-trio/#handover',runScripts:'outside-only'});t.after(()=>dom.window.close());
  await new Promise(resolve=>dom.window.addEventListener('DOMContentLoaded',resolve,{once:true}));
  const win=dom.window;win.TextEncoder=TextEncoder;win.Blob=Blob;Object.defineProperty(win,'crypto',{value:{subtle:{digest:hash}}});
  win.fetch=async url=>{const body=fs.readFileSync(path.join(app,url),'utf8');return {ok:true,json:async()=>JSON.parse(body),text:async()=>body};};
  win.eval(fs.readFileSync(path.join(app,'handover-model.js'),'utf8'));win.eval(fs.readFileSync(path.join(app,'handover-app.js'),'utf8'));win.dispatchEvent(new win.Event('DOMContentLoaded'));
  await settle();return win;
}
async function settle(){for(let i=0;i<8;i++)await new Promise(resolve=>setImmediate(resolve));}
test('actual browser handlers switch examples and invalidate a visible result when inputs change',async t=>{
  const win=await ui(t),doc=win.document,$=id=>doc.getElementById(id);assert.match($('handover-status').textContent,/checks pass/);
  for(const name of ['changed','missing','duplicate','wrapped']){$('handover-example').value=name;$('handover-example').dispatchEvent(new win.Event('change'));await settle();assert.match($('handover-status').textContent,/checks fail/,name);}
  $('handover-example').value='unavailable';$('handover-example').dispatchEvent(new win.Event('change'));await settle();assert.match($('handover-status').textContent,/incomplete/);assert.match($('handover-results').textContent,/hashing is unavailable/);
  $('handover-example').value='complete';$('handover-example').dispatchEvent(new win.Event('change'));await settle();
  $('handover-evidence').value+='edit';$('handover-evidence').dispatchEvent(new win.Event('input'));assert.match($('handover-status').textContent,/Inputs changed/);assert.equal($('handover-results').children.length,0);
  $('handover-run').click();await settle();assert.match($('handover-status').textContent,/checks fail/);
  $('handover-reset').click();await settle();assert.match($('handover-status').textContent,/checks pass/);
});
test('an asynchronous old result cannot overwrite newer edited inputs',async t=>{
  let hold=false,release;const win=await ui(t,async(_algorithm,bytes)=>{if(hold){hold=false;await new Promise(resolve=>{release=resolve;});}return crypto.createHash('sha256').update(bytes).digest();});
  const $=id=>win.document.getElementById(id);hold=true;$('handover-run').click();await settle();assert.equal(typeof release,'function');
  $('handover-evidence').value+='new change';$('handover-evidence').dispatchEvent(new win.Event('input'));release();await settle();
  assert.match($('handover-status').textContent,/Inputs changed/);assert.equal($('handover-results').children.length,0);
});
test('browser download contains current inputs, no result claim, and rechecks consistently',async t=>{
  const win=await ui(t);let blob,filename;win.URL.createObjectURL=value=>{blob=value;return 'blob:test';};win.URL.revokeObjectURL=()=>{};win.HTMLAnchorElement.prototype.click=function(){filename=this.download;};
  const $=id=>win.document.getElementById(id);$('handover-evidence').value+='downloaded edit';$('handover-evidence').dispatchEvent(new win.Event('input'));$('handover-download').click();
  assert.equal(filename,'handover-inputs.json');const text=await blob.text(),input=JSON.parse(text);assert.equal(input.result,undefined);assert.equal((await model.evaluate(input,sha)).status,'fail');assert.match($('handover-download-note').textContent,/Download requested/);
  assert.equal($('handover-export-fallback').hidden,false);assert.equal($('handover-export-fallback').open,true);assert.equal($('handover-export-json').readOnly,true);assert.equal($('handover-export-json').value,text);assert.equal($('handover-save-link').href,'blob:test');assert.equal($('handover-save-link').download,'handover-inputs.json');
  $('handover-select-json').click();assert.equal(win.document.activeElement,$('handover-export-json'));assert.equal($('handover-export-json').selectionStart,0);assert.equal($('handover-export-json').selectionEnd,text.length);assert.match($('handover-download-note').textContent,/JSON selected/);
  const dir=tempPack(t);fs.writeFileSync(path.join(dir,'handover-inputs.json'),$('handover-export-json').value);assert.equal(run(dir,'handover-inputs.json').status,1);
  $('handover-reset').click();await settle();$('handover-download').click();fs.writeFileSync(path.join(dir,'handover-inputs.json'),$('handover-export-json').value);assert.equal(run(dir,'handover-inputs.json').status,0);
});
test('readable export survives unavailable Blob downloads and remains usable by the checker',async t=>{
  const win=await ui(t),$=id=>win.document.getElementById(id);win.URL.createObjectURL=()=>{throw new Error('blocked');};
  $('handover-download').click();assert.equal($('handover-export-fallback').hidden,false);assert.equal($('handover-save-link').hidden,true);assert.match($('handover-download-note').textContent,/Automatic download is unavailable/);
  const dir=tempPack(t);fs.writeFileSync(path.join(dir,'handover-inputs.json'),$('handover-export-json').value);assert.equal(run(dir,'handover-inputs.json').status,0);
});
test('exports persist for unchanged inputs and are revoked on edits, restore, example switch or page exit',async t=>{
  const win=await ui(t),$=id=>win.document.getElementById(id),revoked=[];let next=0;
  win.URL.createObjectURL=()=> 'blob:https://example.test/snapshot-'+(++next);win.URL.revokeObjectURL=url=>revoked.push(url);win.HTMLAnchorElement.prototype.click=()=>{};
  $('handover-download').click();const first=$('handover-save-link').getAttribute('href');$('handover-run').click();await settle();assert.equal($('handover-save-link').getAttribute('href'),first);assert.deepEqual(revoked,[]);
  for(const mutate of [()=>{$('handover-owner').value+='edit';$('handover-owner').dispatchEvent(new win.Event('input'));},()=>{$('handover-signer').value+='edit';$('handover-signer').dispatchEvent(new win.Event('input'));},()=>{$('handover-evidence').value+='edit';$('handover-evidence').dispatchEvent(new win.Event('input'));},()=>{$('handover-reset').click();},()=>{$('handover-example').value='missing';$('handover-example').dispatchEvent(new win.Event('change'));},()=>win.dispatchEvent(new win.Event('pagehide'))]){
    const old=$('handover-save-link').getAttribute('href');mutate();await settle();assert.ok(revoked.includes(old));assert.equal($('handover-save-link').hasAttribute('href'),false);assert.equal($('handover-save-link').hidden,true);assert.equal($('handover-export-fallback').hidden,true);assert.equal($('handover-export-json').value,'');assert.equal($('handover-download-note').textContent,'');$('handover-download').click();
  }
  const old=$('handover-save-link').getAttribute('href');$('handover-download').click();assert.ok(revoked.includes(old));assert.notEqual($('handover-save-link').getAttribute('href'),old);
});
test('handover reading anchor is preserved without a false saved-scenario error',async t=>{
  const {JSDOM}=createRequire(path.join(root,'tools/library-apps/package.json'))('jsdom');
  const dom=new JSDOM(fs.readFileSync(path.join(app,'index.html'),'utf8'),{url:'https://example.test/library/apps/governance-trio/#handover',runScripts:'outside-only'});t.after(()=>dom.window.close());
  await new Promise(resolve=>dom.window.addEventListener('DOMContentLoaded',resolve,{once:true}));
  const win=dom.window;win.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});
  win.eval(fs.readFileSync(path.join(app,'model.js'),'utf8'));win.eval(fs.readFileSync(path.join(app,'app.js'),'utf8'));win.dispatchEvent(new win.Event('DOMContentLoaded'));
  assert.equal(win.location.hash,'#handover');assert.equal(win.document.getElementById('status').textContent,'');assert.match(win.document.getElementById('shareLink').value,/#handover$/);
});

if(process.argv[2])test('built handover resources match maintained source',()=>{
  const built=path.resolve(root,process.argv[2],'library/apps/governance-trio');
  for(const name of ['index.html','app.js','model.js','handover-model.js','handover-app.js','handover.css','handover-pack.zip','handover-pack/handover.json','handover-pack/digests.json','handover-pack/policy.json','handover-pack/evidence/concept-note.txt','handover-pack/evidence/risk-review.json'])assert.deepEqual(fs.readFileSync(path.join(built,name)),fs.readFileSync(path.join(app,name)),name);
});
