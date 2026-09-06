/* Run: NODE_PATH=/path/to/node_modules CHROME=/path/to/chrome node browser.cjs URL [screenshots-directory] */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const base=process.env.APP_URL||process.argv[2]||'http://127.0.0.1:8772/codesign-curated-site/project-co-design/apps/wildlife-crossing.html';
const out=path.resolve(process.argv[3]||path.join(__dirname,'screenshots'));
const source=fs.readFileSync(path.join(__dirname,'../../apps/wildlife-crossing.html'),'utf8');
const kernel=fs.readFileSync(path.join(__dirname,'model.cjs'),'utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const checks=[],errors=[],network=[];const check=(name,fn)=>{fn();checks.push(name);};
(async()=>{
 check('standalone app embeds reviewed model byte-for-byte',()=>assert.equal(source.match(/<script id="wildlife-model">([\s\S]*?)<\/script>/)[1],kernel));
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,...(process.env.CHROME?{executablePath:process.env.CHROME}:{}),args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1100},acceptDownloads:true,reducedMotion:'reduce'});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('request',r=>{if(/^https?:/.test(r.url())&&new URL(r.url()).origin!==new URL(base).origin)network.push(r.url());});
 const snapshot=()=>page.evaluate(()=>WildlifeUI.getSnapshot());
 const apply=async values=>{await page.evaluate(()=>document.querySelector('#brief').open=true);for(const [id,v]of Object.entries(values)){if(id==='sites')await page.selectOption('#'+id,String(v));else await page.fill('#'+id,String(v));}await page.click('#apply');};
 const preset=async id=>{await page.click('#tab-explore');await page.click('[data-preset="'+id+'"]');};
 await page.goto(base,{waitUntil:'networkidle'});
 let s=await snapshot();
 check('default resource vectors and mixed implementation',()=>{assert.deepEqual(s.frontier.map(x=>Object.values(x.resources)),[[11110000,18000,156200],[11270000,18000,142000],[11510000,18000,138000]]);assert.deepEqual(s.implementation.widths,[30,50]);assert.equal(s.implementation.exec.capacity,120);});
 const defaultText=await page.locator('#result-area').innerText();check('visible default result agrees with witness',()=>{assert.match(defaultText,/£11\.11m/);assert.match(defaultText,/156\.2k/);});
 await page.screenshot({path:path.join(out,'desktop-default.png'),fullPage:true});
 await page.locator('[data-choice]').nth(2).click();s=await snapshot();
 check('selection updates witness, resources and active option',()=>{assert.equal(s.implementation.parts.fence,'f-durable-4');assert.equal(s.implementation.parts.monitoring,'m-assisted-6');assert.equal(s.implementation.resources.annual,138000);});
 assert.equal(await page.locator('[data-choice][aria-pressed="true"]').count(),1);assert.match(await page.locator('#result-area').innerText(),/0\.24 FTE/);
 await page.click('#tab-method');assert.match(await page.locator('#resource-table').innerText(),/£11,510,000/);assert.match(await page.locator('#staff-note').innerText(),/£13\.2k/);
 check('selected method shows exact cost totals and staff cost',()=>assert.equal(s.implementation.staffMilli,240));
 const selectedURL=page.url();await page.reload();s=await snapshot();check('URL reload preserves alternative and method tab',()=>{assert.equal(s.selected,'r-11510000-18000-138000');assert.equal(s.tab,'method');assert.equal(page.url(),selectedURL);});
 await page.screenshot({path:path.join(out,'desktop-method.png'),fullPage:true});
 await preset('land');s=await snapshot();check('q80 retains land-incomparable bridge configurations',()=>{assert.equal(s.frontier.length,6);assert.deepEqual([...new Set(s.frontier.map(x=>x.implementations[0].widths.join(',')))].sort(),['30,30','70']);});
 await page.locator('[data-choice]').last().click();s=await snapshot();check('q80 pair selection has smaller land but greater capital than single',()=>{assert.deepEqual(s.implementation.widths,[30,30]);assert.equal(s.implementation.resources.land,14000);assert.ok(s.implementation.resources.capital>8646000);});
 await apply({land:1.4});s=await snapshot();check('ordinary land input restricts q80 to pair',()=>{assert.equal(s.params.landLimit,14000);assert.equal(s.frontier.length,3);assert.ok(s.frontier.every(g=>g.implementations[0].widths.join(',')==='30,30'));});
 await apply({capital:9.08});s=await snapshot();check('capital boundary retains exact affordable choice',()=>{assert.equal(s.frontier.length,1);assert.equal(s.implementation.resources.capital,9080000);});
 await page.reload();s=await snapshot();check('URL reload preserves numeric resource ceilings',()=>{assert.equal(s.params.capitalLimit,9080000);assert.equal(s.params.landLimit,14000);});
 await apply({capital:9.079999});s=await snapshot();check('one pound below boundary is infeasible',()=>assert.equal(s.frontier.length,0));assert.match(await page.locator('#result-area').innerText(),/None also fits/);
 await preset('recipe');s=await snapshot();check('q120 replaces equal-width recipe with dominating mixed bundle',()=>{assert.equal(s.params.target,120);assert.equal(s.frontier.length,3);assert.ok(s.frontier.every(g=>g.implementations[0].widths.join(',')==='30,50'));});
 assert.match(await page.locator('#lesson').innerText(),/£2\.03m/);
 await preset('zero');s=await snapshot();check('zero request is zero work',()=>{assert.equal(s.frontier.length,1);assert.deepEqual(s.implementation.resources,{capital:0,land:0,annual:0});assert.deepEqual(s.implementation.widths,[]);});
 await preset('impossible');s=await snapshot();check('beyond catalogue is empty with accurate capacity bound',()=>{assert.equal(s.params.target,330);assert.equal(s.frontier.length,0);});assert.match(await page.locator('#result-area').innerText(),/at most 315/);
 await preset('mixed');await apply({sites:1});s=await snapshot();check('site availability excludes otherwise feasible bundles',()=>assert.equal(s.frontier.length,0));assert.match(await page.locator('#result-area').innerText(),/at most 105/);
 await apply({sites:3,capital:0});s=await snapshot();check('zero ceiling differs from blank',()=>{assert.equal(s.params.capitalLimit,0);assert.equal(s.frontier.length,0);});
 await apply({capital:''});s=await snapshot();check('blank ceiling removes restriction',()=>{assert.equal(s.params.capitalLimit,null);assert.equal(s.frontier.length,3);});
 const validURL=page.url();await apply({target:''});s=await snapshot();check('blank target is rejected while valid result persists',()=>{assert.equal(s.params.target,110);assert.equal(page.url(),validURL);});assert.equal(await page.locator('#error').isVisible(),true);
 await apply({target:110,capital:-1});const negativeError=await page.locator('#error').isVisible(),negativeSnapshot=await snapshot();check('negative ceiling is rejected',()=>{assert.equal(negativeError,true);assert.equal(negativeSnapshot.params.capitalLimit,null);});
 await page.click('#reset');s=await snapshot();check('reset restores defaults and clears errors',()=>assert.deepEqual(s.params,{target:110,maxSites:3,capitalLimit:null,landLimit:null}));assert.equal(await page.locator('#error').isVisible(),false);
 const downloadPromise=page.waitForEvent('download');await page.click('#export');const download=await downloadPromise;const receipt=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
 check('export includes selected implementation, successful replay and all vectors',()=>{assert.equal(receipt.replay.valid,true);assert.equal(receipt.selectedImplementation.id,s.implementation.id);assert.deepEqual(receipt.frontier,s.frontier);assert.equal(receipt.units.capital,'GBP');assert.equal(receipt.request.target,110);});
 await page.click('#copy');await page.waitForFunction(()=>/Link copied|Copy the link/.test(document.querySelector('#download-status').textContent));const copyStatus=await page.locator('#download-status').innerText();check('copy brief provides clipboard status or selected fallback',()=>assert.match(copyStatus,/Link copied|Copy the link/));
 await page.focus('#tab-explore');await page.keyboard.press('ArrowRight');const keyboardSnapshot=await snapshot(),methodFocused=await page.locator('#tab-method').evaluate(e=>e===document.activeElement);check('keyboard tab navigation opens method',()=>{assert.equal(keyboardSnapshot.tab,'method');assert.equal(methodFocused,true);});
 await page.keyboard.press('End');assert.equal((await snapshot()).tab,'sources');await page.keyboard.press('Home');assert.equal((await snapshot()).tab,'explore');
 await page.goto(base+'?v=1&q=-1',{waitUntil:'networkidle'});const invalidSnapshot=await snapshot(),invalidMessage=await page.locator('#error').innerText();check('invalid URL is reported with valid defaults',()=>{assert.equal(invalidSnapshot.params.target,110);assert.match(invalidMessage,/invalid brief/);});
 const viewports=[];
 for(const width of [1440,768,375,320]){
  await page.setViewportSize({width,height:900});await page.goto(base,{waitUntil:'networkidle'});
  for(const tab of ['explore','method','sources']){
   await page.click('#tab-'+tab);if(tab==='method')await page.locator('#method details').first().evaluate(e=>e.open=true);
   const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));assert.ok(sizes.scroll<=sizes.client+1,'overflow '+width+' '+tab+JSON.stringify(sizes));viewports.push({width,tab,...sizes});
  }
  if(width===375){await page.click('#tab-explore');await page.screenshot({path:path.join(out,'phone-default.png'),fullPage:true});await apply({target:80,land:1.4});assert.equal((await snapshot()).frontier.length,3);await page.screenshot({path:path.join(out,'phone-brief.png'),fullPage:true});checks.push('phone controls apply a substantive constrained query');}
 }
 check('desktop/tablet/phone views have no page overflow',()=>assert.equal(viewports.length,12));
 check('no browser exceptions or external requests',()=>{assert.deepEqual(errors,[]);assert.deepEqual(network,[]);});
 const result={status:'PASS',checkedAtUTC:new Date().toISOString(),modelSha256:sha(kernel),appSha256:sha(source),checks:checks.length,passed:checks,viewports,screenshots:fs.readdirSync(out).filter(x=>x.endsWith('.png')),browserErrors:errors,externalRequests:network};
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
