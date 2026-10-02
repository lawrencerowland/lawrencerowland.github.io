'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const model = require('../library/apps/probecrafter/model.js');
const data = require('../library/apps/probecrafter/probecrafter.json');
const fs = require('node:fs'), path = require('node:path');
const libraryRequire = require('node:module').createRequire(path.join(__dirname,'../tools/library-apps/package.json'));
const { JSDOM } = libraryRequire('jsdom');
const a = {packId:'alignment-field-scan',questionIndex:0}, b = {packId:'value-story-audit',questionIndex:1};
test('all original packs, questions and supporting sections survive', () => {
  assert.equal(data.probePacks.length,3); assert.equal(data.probePacks.flatMap(p=>p.questions).length,9);
  assert.equal(data.personas.length,3); assert.equal(data.sessionTemplates.length,2);
  assert.equal(Object.keys(data.scorecard).length,3); assert.equal(data.coachNotes.length,3);
  for (const p of data.probePacks) for (const q of p.questions) assert.ok(q.prompt && q.angle && q.notes && q.whatToListenFor.length && q.followUps.length);
});
test('run-sheet round trip preserves duplicates, order and resolved follow-ups', () => {
  const refs=[b,a,b],saved=JSON.parse(model.serialise(refs));
  assert.deepEqual(model.validate(saved,data),refs);
  const text=model.text(refs,data);
  assert.ok(text.indexOf(model.resolve(b,data).prompt)<text.indexOf(model.resolve(a,data).prompt));
  for (const ref of refs) for (const question of model.resolve(ref,data).followUps) assert.ok(text.includes(question));
  assert.ok(text.includes('Evidence / alternative explanation / next action:'));
});
test('reordering does not mutate input and boundary moves are harmless', () => {
  const refs=[a,b]; assert.deepEqual(model.move(refs,1,-1),[b,a]); assert.deepEqual(refs,[a,b]);
  assert.deepEqual(model.move(refs,0,-1),refs); assert.deepEqual(model.move(refs,1,1),refs);
});
test('reject invalid files or references before returning any candidate state', () => {
  for (const value of [null,{}, {format:'probecrafter-session',version:2,questions:[a]}, {format:'probecrafter-session',version:1,questions:[a,{packId:'unknown',questionIndex:0}]}, {format:'probecrafter-session',version:1,questions:[{...a,questionIndex:-1}]}, {format:'probecrafter-session',version:1,questions:[{...a,questionIndex:'0'}]}]) assert.throws(()=>model.validate(value,data));
  assert.deepEqual(model.validate(JSON.parse(model.serialise([])),data),[]);
});

// Use the actual page and scripts, with a deferred local data response and a
// real jsdom localStorage/DOM. No network or printing side effects occur.
function appFixture(t, questions = [a,b]) {
  const appDir = path.join(__dirname,'../library/apps/probecrafter');
  const dom = new JSDOM(fs.readFileSync(path.join(appDir,'index.html'),'utf8'), {
    url:'https://example.test/library/apps/probecrafter/', runScripts:'outside-only'
  });
  t.after(() => dom.window.close());
  const {window} = dom, {document} = window;
  const key = 'library-probecrafter-session-v1';
  window.localStorage.setItem(key,model.serialise(questions));
  let finishFetch, prints = 0;
  window.fetch = () => new Promise(resolve => {finishFetch = resolve;});
  window.print = () => {prints++;};
  window.eval(fs.readFileSync(path.join(appDir,'model.js'),'utf8'));
  window.eval(fs.readFileSync(path.join(appDir,'app.js'),'utf8'));
  return {
    window, document, key,
    readSaved:() => JSON.parse(window.localStorage.getItem(key)).questions,
    printCount:() => prints,
    async load() {finishFetch({ok:true,json:async () => JSON.parse(JSON.stringify(data))}); await new Promise(setImmediate);}
  };
}

test('pending-fetch Clear cannot overwrite a saved sheet before it is loaded', async t => {
  const page = appFixture(t,[b,a,b]), clear = page.document.getElementById('resetSession');
  assert.equal(clear.disabled,true);
  clear.click();
  // Exercise the handler guard too, independently of the disabled control.
  clear.dispatchEvent(new page.window.Event('click'));
  assert.deepEqual(page.readSaved(),[b,a,b]);
  await page.load();
  assert.equal(page.document.querySelectorAll('.session-item').length,3);
  assert.equal(clear.disabled,false);
});

test('Clear persists an empty sheet; another empty Clear preserves the available Undo', async t => {
  const page = appFixture(t); await page.load();
  const clear = page.document.getElementById('resetSession'), undo = page.document.getElementById('undoClear');
  clear.click();
  assert.deepEqual(page.readSaved(),[]); assert.equal(clear.disabled,true); assert.equal(undo.disabled,false);
  clear.dispatchEvent(new page.window.Event('click'));
  assert.equal(undo.disabled,false);
  undo.click();
  assert.deepEqual(page.readSaved(),[a,b]); assert.equal(page.document.querySelectorAll('.session-item').length,2);
  assert.equal(undo.disabled,true);
});

test('print text is current before the print button is used and stays current after edits', async t => {
  const page = appFixture(t,[a]); await page.load();
  const printed = page.document.getElementById('printedRunSheet');
  assert.equal(printed.textContent,model.text([a],data));
  assert.equal(page.printCount(),0);
  page.document.querySelectorAll('#detail .question-card button')[1].click();
  const saved = page.readSaved();
  assert.equal(saved.length,2);
  page.window.dispatchEvent(new page.window.Event('beforeprint'));
  assert.equal(printed.textContent,model.text(saved,data));
  page.document.getElementById('showRunSheet').click();
  page.document.getElementById('printRunSheet').click();
  assert.equal(page.printCount(),1);
  page.document.querySelector('[aria-label="Remove question 1"]').click();
  assert.equal(printed.textContent,model.text(page.readSaved(),data));
  assert.equal(page.document.getElementById('runSheet').value,printed.textContent);
});

test('move and remove keep keyboard focus on the affected row or an enabled empty-state control', async t => {
  const page = appFixture(t); await page.load();
  const down = page.document.querySelector('[aria-label="Move down question 1"]'); down.focus(); down.click();
  assert.deepEqual(page.readSaved(),[b,a]);
  assert.equal(page.document.activeElement.getAttribute('aria-label'),'Remove question 2');
  page.document.activeElement.click();
  assert.deepEqual(page.readSaved(),[b]);
  assert.equal(page.document.activeElement.getAttribute('aria-label'),'Remove question 1');
  page.document.activeElement.click();
  assert.deepEqual(page.readSaved(),[]);
  assert.equal(page.document.activeElement.id,'showRunSheet');
  assert.equal(page.document.activeElement.disabled,false);
});
