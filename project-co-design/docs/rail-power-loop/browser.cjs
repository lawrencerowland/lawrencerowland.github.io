/* Browser-level verification of the actual served app. No application source is changed.
   APP_URL=http://127.0.0.1:8788/apps/rail-power-loop.html QA_DIR=/tmp/rail-power-qa \
   PLAYWRIGHT_MODULE=/path/to/playwright CHROME_EXECUTABLE=/path/to/chrome node browser.cjs
   QA_DIR is required and must be outside this source directory. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const APP_URL=process.env.APP_URL,QA_DIR=process.env.QA_DIR;
if(!APP_URL||!QA_DIR)throw Error('Provide APP_URL for the served app and QA_DIR for external QA artifacts.');
const resolvedQA=path.resolve(QA_DIR);
if(resolvedQA===__dirname||resolvedQA.startsWith(__dirname+path.sep))throw Error('QA_DIR must be outside the source directory.');
fs.mkdirSync(resolvedQA,{recursive:true});
const receipt={appURL:APP_URL,started:new Date().toISOString(),checks:[],screenshots:[],pageErrors:[],consoleErrors:[],requestFailures:[]};
let browser,context,page,checks=0;
function check(name,value){assert.ok(value,name);checks++;receipt.checks.push(name);}
function equal(name,actual,expected){assert.deepEqual(actual,expected,name);checks++;receipt.checks.push(name);}
async function snapshot(){return page.evaluate(()=>RailPowerUI.getSnapshot());}
async function apply(p=750,h=8,c='hot',capital='',land=''){
  await page.locator('#power').selectOption(String(p));await page.locator('#duration').selectOption(String(h));await page.locator('#climate').selectOption(c);
  await page.locator('#capexCap').fill(String(capital));await page.locator('#areaCap').fill(String(land));await page.locator('#apply').click();return snapshot();
}
async function capture(name,fullPage=true){const filename=path.join(resolvedQA,name+'.png');await page.screenshot({path:filename,fullPage});receipt.screenshots.push(filename);}
async function overflow(){return page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);}
function attach(p){p.on('pageerror',e=>receipt.pageErrors.push(e.message));p.on('console',m=>{if(m.type()==='error')receipt.consoleErrors.push(m.text());});p.on('requestfailed',r=>receipt.requestFailures.push({url:r.url(),failure:r.failure()}));}
(async()=>{
  browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{channel:'chrome'})});
  context=await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
  page=await context.newPage();attach(page);
  const response=await page.goto(APP_URL,{waitUntil:'networkidle'});check('Served app returns success',response.ok());
  const served=await response.body();receipt.servedHTMLSha256=crypto.createHash('sha256').update(served).digest('hex');
  await page.waitForFunction(()=>window.RailPowerUI?.getSnapshot().ready);
  const atlas=await page.locator('#mcdp-atlas').evaluate(el=>JSON.parse(el.textContent));
  receipt.atlasProvenance=atlas.provenance;
  equal('All 98 briefs embedded',atlas.queries.length,98);equal('All 784 package records embedded',atlas.queries.reduce((n,q)=>n+q.results.length,0),784);
  equal('Pinned actual package version',atlas.provenance.version,'0.2.1');equal('Pinned package commit',atlas.provenance.commit,'97d6446abf48c3424cf52bace9c5d9c40bfda978');
  let s=await snapshot();equal('Default brief',s.queryId,'p750-h8-hot');equal('Cheapest default architecture','standard-efficient-liquid',s.selectedArchitectureId);
  equal('Default resource frontier',s.frontierArchitectureIds,['standard-efficient-liquid','compact-standard-liquid','compact-efficient-liquid']);
  equal('Default settled counts',s.record.selected.witness.counts,{batteries:8,converters:4,coolers:3});equal('Default exact resources',s.record.selected.witness.resources,{capitalGBP:3245000,landM2:274});
  check('Default £3.245m is visibly preserved',(await page.locator('#metric-capital').textContent()).includes('3.245'));
  check('Ranking reversal is visible',await page.locator('#ranking-insight').isVisible());check('Ranking reversal shows both incomplete and complete values',/2,965,000/.test(await page.locator('#ranking-insight').textContent())&&/3,390,000/.test(await page.locator('#ranking-insight').textContent())&&/3,245,000/.test(await page.locator('#ranking-insight').textContent()));
  check('Default desktop has no horizontal overflow',!await overflow());await capture('desktop-default');
  await page.locator('[data-ranking-design="standard-standard-air"]').click();s=await snapshot();equal('Ranking link selects complete former front-runner',s.record.selected.witness.counts,{batteries:9,converters:4,coolers:7});check('Dominated selection is explicitly labelled',(await page.locator('#result-kicker').textContent()).includes('DOMINATED'));
  await page.locator('[data-design="compact-efficient-liquid"]').click();s=await snapshot();equal('Frontier row selects compact result',s.record.selected.witness.resources,{capitalGBP:4360000,landM2:152});check('SVG count description follows actual selected witness',(await page.locator('#compound svg').getAttribute('aria-label')).includes('6 battery racks, 4 converters and 4 coolers'));
  await apply();await page.locator('[data-design="standard-efficient-liquid"]').click();
  const expectedDefault=await snapshot();
  await page.locator('#trace-slider').focus();await page.keyboard.press('Home');equal('Trace keyboard Home reaches zero seed',(await snapshot()).traceIndex,0);check('Seed is described as calculation bound',(await page.locator('#trace-caption').textContent()).includes('starting bound'));
  await page.keyboard.press('End');equal('Trace keyboard End reaches recorded final row',(await snapshot()).traceIndex,expectedDefault.record.selected.trace.length-1);
  await page.locator('#trace-play').click();await page.waitForTimeout(1020);s=await snapshot();check('Trace plays from start',s.playing&&s.traceIndex>0&&s.traceIndex<expectedDefault.record.selected.trace.length);
  await page.locator('#trace-play').click();const paused=(await snapshot()).traceIndex;await page.waitForTimeout(950);equal('Trace remains paused',(await snapshot()).traceIndex,paused);
  await page.locator('#trace-play').click();await page.locator('#tab-method').click();check('Leaving Explore pauses trace',!(await snapshot()).playing);check('Method distinguishes iterations from construction',(await page.locator('#method').textContent()).includes('does not place it into that construction model'));
  await page.locator('#tab-method').focus();await page.keyboard.press('ArrowRight');equal('Tab keyboard arrow selects Sources',await page.locator('#tab-sources').getAttribute('aria-selected'),'true');await page.keyboard.press('Home');equal('Tab keyboard Home selects Explore',await page.locator('#tab-explore').getAttribute('aria-selected'),'true');
  // Every supported brief is applied through the visible controls. Compare UI projections with the immutable package records.
  for(const q of atlas.queries){s=await apply(q.powerKW,q.durationHours,q.condition);equal('Applied brief '+q.id,s.queryId,q.id);equal('Frontier family preservation '+q.id,s.frontierArchitectureIds.slice().sort(),q.frontier.slice().sort());equal('Unmodified package record preservation '+q.id,s.record.allFamilyResults,q.results);if(q.powerKW===0){equal('Zero shows one physical result '+q.id,await page.locator('#frontier-count').textContent(),'1 no-equipment result');equal('Zero hides redundant family option rows '+q.id,await page.locator('#frontier-options button').count(),0);equal('Zero has no incremental resources '+q.id,s.record.selected.witness.resources,{capitalGBP:0,landM2:0});}if(q.frontier.length===0){check('Unavailable brief empty state '+q.id,await page.locator('#empty-state').isVisible());check('Unavailable distinction '+q.id,(await page.locator('#empty-kicker').textContent()).includes('CALCULATION COMPLETE'));}}
  s=await apply(750,8,'hot','3245000','274');equal('Exact ceilings retain boundary',s.frontierArchitectureIds,['standard-efficient-liquid']);
  s=await apply(750,8,'hot','3244999.99','274');equal('Fractional ceiling below exact capital excludes result',s.frontierArchitectureIds,[]);check('Resource ceiling distinction',(await page.locator('#empty-title').textContent()).includes('ceilings'));
  s=await apply(750,8,'hot','3244999.999999999999999999','274');equal('Arbitrarily close decimal below boundary is exact',s.frontierArchitectureIds,[]);equal('Exact decimal ceiling survives in export',s.record.ceilings.capitalGBP,'3244999.999999999999999999');await page.reload({waitUntil:'networkidle'});equal('Exact decimal boundary survives URL reload',(await snapshot()).frontierArchitectureIds,[]);
  await page.locator('#empty-recover').click();equal('No-result ceiling recovery restores three frontier families',(await snapshot()).frontierArchitectureIds.length,3);
  s=await apply(750,8,'hot','4300000','200');equal('Mixed ceilings select middle trade-off',s.frontierArchitectureIds,['compact-standard-liquid']);
  s=await apply(750,8,'hot','4500000','160');equal('Tight footprint selects compact efficient trade-off',s.frontierArchitectureIds,['compact-efficient-liquid']);
  s=await apply(750,8,'hot','0','');equal('Zero capital is a strict ceiling',s.frontierArchitectureIds,[]);
  s=await apply(0,24,'hot','0','0');equal('Zero request fits zero ceilings',s.record.selected.witness.resources,{capitalGBP:0,landM2:0});check('Zero is explicitly no installation',(await page.locator('#result-title').textContent()).includes('No temporary installation needed'));await capture('zero-result');
  s=await apply(750,8,'hot','4500000','160');const validURL=page.url(),validSnapshot=s;
  for(const invalid of ['-1','NaN','1e9','£500','3,500,000','Infinity']){await page.locator('#capexCap').fill(invalid);await page.locator('#apply').click();check('Invalid input reported '+invalid,await page.locator('#input-error').isVisible());equal('Invalid input preserves applied record '+invalid,(await snapshot()).record,validSnapshot.record);equal('Invalid input preserves applied URL '+invalid,page.url(),validURL);}
  await page.locator('#clear-caps').click();check('Clear ceilings recovers from invalid input',!(await page.locator('#input-error').isVisible()));
  s=await apply(2000,24,'hot');equal('Demanding brief has no available architecture',s.frontierArchitectureIds,[]);await page.locator('#all-details summary').click();check('Inventory cap failure is visible',(await page.locator('#all-table').textContent()).includes('Availability exceeded'));await capture('catalogue-unavailable');await page.locator('#empty-recover').click();equal('Inventory failure recovers to default',(await snapshot()).queryId,'p750-h8-hot');
  // Persistence, actual clipboard, and a complete downloadable record.
  s=await apply(1000,6,'mild','5000000','300');const beforeReload=await snapshot();await page.reload({waitUntil:'networkidle'});equal('URL reload preserves brief, ceilings and selected witness',(await snapshot()).record,beforeReload.record);
  await page.locator('#share').click();const clipboard=await page.evaluate(()=>navigator.clipboard.readText());equal('Copied link is applied URL',clipboard,page.url());
  const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;const exportedPath=path.join(resolvedQA,download.suggestedFilename());await download.saveAs(exportedPath);const downloaded=JSON.parse(fs.readFileSync(exportedPath,'utf8'));equal('Download preserves exact actual record',downloaded,(await snapshot()).record);equal('Download preserves eight complete family records',downloaded.allFamilyResults.length,8);check('Download includes model coefficients',!!downloaded.catalogues.batteries[0].usableKWh);receipt.download=exportedPath;
  // Deterministically exercise the clipboard-denied recovery in the browser only.
  await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:async()=>{throw Error('simulated clipboard denial');}}));await page.locator('#share').click();check('Clipboard denial provides selectable link',await page.locator('#share-fallback').isVisible());equal('Fallback link preserves query',await page.locator('#share-fallback').inputValue(),page.url());
  const unsupported=new URL(APP_URL);unsupported.search='?power=999&hours=3&condition=unknown&capital=-1';await page.goto(unsupported.href,{waitUntil:'networkidle'});equal('Unsupported URL recovers to declared default',(await snapshot()).queryId,'p750-h8-hot');check('Unsupported URL recovery is disclosed',(await page.locator('#status').textContent()).includes('unsupported'));
  for(const badPower of ['', '   ']){const bad=new URL(APP_URL);bad.searchParams.set('power',badPower);await page.goto(bad.href,{waitUntil:'networkidle'});equal('Blank URL power does not become zero '+JSON.stringify(badPower),(await snapshot()).queryId,'p750-h8-hot');check('Blank URL power recovery is disclosed '+JSON.stringify(badPower),(await page.locator('#status').textContent()).includes('unsupported'));}const goodZero=new URL(APP_URL);goodZero.searchParams.set('power','0');await page.goto(goodZero.href,{waitUntil:'networkidle'});equal('Explicit URL zero remains zero',(await snapshot()).brief.powerKW,0);await page.locator('[data-preset=default]').click();
  await page.locator('#tab-method').click();await page.locator('#method summary').click();await capture('desktop-method');await page.locator('#tab-sources').click();await capture('desktop-sources');
  for(const width of [390,320]){await page.setViewportSize({width,height:844});await page.locator('#tab-explore').click();await apply();check('Phone width '+width+' has no page overflow',!await overflow());await page.locator('#trace-slider').focus();await page.keyboard.press('Home');equal('Phone keyboard trace works '+width,(await snapshot()).traceIndex,0);await capture('phone-'+width);await page.locator('#tab-method').click();check('Phone method '+width+' has no page overflow',!await overflow());await page.locator('#tab-sources').click();check('Phone sources '+width+' has no page overflow',!await overflow());}
  equal('No browser runtime errors',receipt.pageErrors,[]);equal('No browser console errors',receipt.consoleErrors,[]);equal('No failed network requests',receipt.requestFailures,[]);
  receipt.status='PASS';receipt.assertions=checks;receipt.finished=new Date().toISOString();fs.writeFileSync(path.join(resolvedQA,'browser-receipt.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({status:receipt.status,assertions:checks,receipt:path.join(resolvedQA,'browser-receipt.json'),screenshots:receipt.screenshots},null,2));
})().catch(async error=>{receipt.status='FAIL';receipt.assertions=checks;receipt.error=error.stack;try{if(page)await capture('failure');}catch(_){}fs.writeFileSync(path.join(resolvedQA,'browser-receipt.json'),JSON.stringify(receipt,null,2)+'\n');console.error(error);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();});
