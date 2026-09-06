// Run with Playwright available, or set PLAYWRIGHT_MODULE and CHROME_EXECUTABLE.
import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';import {pathToFileURL,fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const source=process.argv[2]||fileURLToPath(new URL('../apps/programme-studio.html',import.meta.url));
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
const receipt={assertions:0,pageErrors:[],screens:[]};
const yes=(v,m)=>{assert.ok(v,m);receipt.assertions++;};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>receipt.pageErrors.push(e.message));
 await page.goto(process.env.APP_URL||pathToFileURL(source).href);
 yes(await page.locator('#kpiFeasible').textContent()==='120','default count');yes(await page.locator('#kpiPareto').textContent()==='24','default front');
 yes(await page.locator('#coupling-primer').isVisible(),'retained primer');yes(await page.locator('#compatibilityTable tbody tr').count()===3,'actual joins');
 yes((await page.locator('#clockBreakdown').textContent()).includes('Two clocks'),'clock distinction');
 await page.selectOption('#context','urban');await page.selectOption('#governanceFilter','multiprime');await page.selectOption('#strategyFilter','civilsFirst');
 yes(await page.locator('#kpiFeasible').textContent()==='6','previous false infeasibility repaired');yes(await page.locator('#feasibilityPill').textContent()==='Feasible','finite uncapped');
 await page.locator('[data-tab="frontierTab"]').click();yes(await page.locator('#plansTable tbody tr').count()===2,'uncapped front');
 const duration=await page.locator('#plansTable tbody tr').first().locator('td').nth(7).textContent();yes(Number(duration)>180,'large finite duration retained');
 await page.locator('[data-tab="loopTab"]').click();yes((await page.locator('#loopNarrative').textContent()).includes('exact affine fixed point'),'exact loop narrative');yes((await page.locator('#iterTable tbody tr').last().textContent()).includes('Exact'),'exact row');
 await page.click('#resetBtn');await page.fill('#paxPerCar','150');await page.locator('#demand').evaluate(el=>{el.value='18000';el.dispatchEvent(new Event('change',{bubbles:true}));});
 await page.selectOption('#governanceFilter','multiprime');await page.selectOption('#strategyFilter','civilsFirst');await page.fill('#budgetCap','25');await page.fill('#deadlineCap','3');await page.fill('#riskCap','5');await page.click('#solveBtn');
 yes(await page.locator('#kpiPareto').textContent()==='1','baseline sole front');yes(await page.locator('#kpiPlan').textContent()==='Existing railway','baseline clear');yes((await page.locator('#topline').textContent()).includes('(0, 0, 0, 0)'),'baseline zero resources');
 await page.locator('[data-tab="loopTab"]').click();yes((await page.locator('#loopNarrative').textContent()).includes('No new programme'),'baseline no loop');
 await page.locator('[data-tab="briefTab"]').click();yes((await page.locator('#planInterpretation').textContent()).includes('operating risk are outside'),'baseline risk boundary');
 yes((await page.locator('#clockBreakdown').textContent()).includes('No new works'),'baseline zero clock');
 await page.selectOption('#context','urban');yes(!(await page.locator('#kpiPlan').textContent()).includes('Existing railway'),'incompatible baseline excluded');
 await page.click('#resetBtn');await page.fill('#budgetCap','25');await page.click('#solveBtn');yes((await page.locator('#topline').textContent()).includes('exceeds a declared resource ceiling'),'ceiling failure distinguished');
 await page.fill('#budgetCap','0');await page.fill('#maxTph','21');await page.locator('#demand').evaluate(el=>{el.value='42000';el.dispatchEvent(new Event('change',{bubbles:true}));});
 yes((await page.locator('#topline').textContent()).includes('No compatible implementation'),'catalogue failure distinguished');
 await page.fill('#paxPerCar','999');await page.click('#solveBtn');yes(await page.locator('#feasibilityPill').textContent()==='Check input','invalid-input failure distinguished');
 await page.click('#resetBtn');await page.click('#solveBtn');
 for(const lens of ['cheapest','fastest','lowestRisk','leastDisruption']){
   await page.selectOption('#decisionLens',lens);await page.locator('[data-tab="frontierTab"]').click();
   const k={cheapest:6,fastest:7,lowestRisk:8,leastDisruption:9}[lens];
   const vals=await page.locator('#plansTable tbody tr').evaluateAll((rows,k)=>rows.map(r=>Number(r.cells[k].textContent)),k);
   const chosen=Number(await page.locator('#plansTable .selected-row td').nth(k).textContent());yes(chosen===Math.min(...vals),lens+' selects named minimum');
 }
 const row=page.locator('#plansTable tbody tr').nth(1);await row.focus();await page.keyboard.press('Enter');yes(await row.getAttribute('aria-selected')==='true','keyboard row selection');
 for(const width of [1440,768,390]){
   await page.setViewportSize({width,height:1000});
   for(const tab of ['briefTab','methodTab','frontierTab','loopTab','mcdplTab']){
     await page.locator(`[data-tab="${tab}"]`).click();yes(await page.locator('#'+tab).isVisible(),'tab '+tab);yes(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no document overflow '+width+'/'+tab);
   }
 }
 yes(receipt.pageErrors.length===0,'zero browser errors');
 if(process.env.STUDIO_SCREENSHOT_DIR){
   for(const width of [1440,390]){await page.setViewportSize({width,height:1000});await page.locator('[data-tab="briefTab"]').click();await page.locator('#coupling-primer').scrollIntoViewIfNeeded();const file=process.env.STUDIO_SCREENSHOT_DIR+'/studio-primer-'+width+'.png';await page.screenshot({path:file});receipt.screens.push(file);}
 }
 console.log(JSON.stringify({status:'PASS',...receipt},null,2));
}finally{await browser.close();}
