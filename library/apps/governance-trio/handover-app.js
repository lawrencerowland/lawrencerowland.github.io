(function(){
'use strict';
const model=HandoverModel,guard=model.createRevisionGuard();
const $=id=>document.getElementById(id);
let baseline=null,pack=null,exportURL=null;
const descriptions={
  complete:'The supplied text matches its declared hashes. Package checks can pass while acceptance stays unverified.',
  changed:'One line was added to the concept note, but the recorded digest was kept. The hash check should fail.',
  missing:'The risk review file is missing. A reference and a digest cannot replace its bytes.',
  duplicate:'Both role declarations now name the same signer. Structure can pass while the toy approval policy fails.',
  malformed:'The owner is blank. Structure fails, so dependent checks remain unevaluated.',
  wrapped:'The flat digest map was put inside a digests object, reproducing the original lookup mismatch.',
  unavailable:'Hashing is deliberately unavailable in this example. An unperformed check must stay unknown.'
};
function snapshot(){return JSON.parse(JSON.stringify(pack));}
function renderRecord(){$('handover-record').textContent=JSON.stringify({record:pack.record,digests:pack.digests,policy:pack.policy},null,2);}
function clearExport(){
  if(exportURL){URL.revokeObjectURL(exportURL);exportURL=null;}
  $('handover-save-link').removeAttribute('href');$('handover-save-link').hidden=true;
  $('handover-export-json').value='';$('handover-export-fallback').hidden=true;$('handover-export-fallback').open=false;
  $('handover-download-note').textContent='';
}
function invalidate(){guard.change();clearExport();$('handover-results').replaceChildren();$('handover-status').textContent='Inputs changed. Run checks again; the previous result no longer applies.';renderRecord();}
function fill(){
  $('handover-owner').value=pack.record.owner;
  $('handover-signer').value=pack.record.signoff[1].by;
  $('handover-evidence').value=pack.files['concept-note.txt'];
  $('handover-example-note').textContent=descriptions[$('handover-example').value];
  renderRecord();
}
async function sha256(bytes){
  if(!globalThis.crypto||!globalThis.crypto.subtle)throw new Error('SHA-256 is unavailable in this browser context');
  const input=typeof bytes==='string'?new TextEncoder().encode(bytes):bytes;
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',input)),x=>x.toString(16).padStart(2,'0')).join('');
}
function show(result){
  $('handover-status').textContent=result.summary;
  const list=$('handover-results');list.replaceChildren();
  for(const check of result.checks){
    const li=document.createElement('li'),title=document.createElement('strong');
    title.textContent=check.label+' — '+({pass:'Pass',fail:'Fail',unknown:'Unknown'}[check.status]);
    title.className=check.status==='unknown'?'handover-unknown':check.status;
    li.append(title);
    for(const detail of check.details){const p=document.createElement('p');p.textContent=detail;li.append(p);}
    list.append(li);
  }
}
async function run(){
  if(!pack)return;
  const token=guard.change(),input=snapshot(),disabledHash=$('handover-example').value==='unavailable';
  $('handover-results').replaceChildren();$('handover-status').textContent='Checking this input revision…';
  try{const result=await model.evaluate(input,disabledHash?null:sha256);if(guard.isCurrent(token))show(result);}
  catch(error){if(guard.isCurrent(token)){$('handover-status').textContent='Checks could not run: '+error.message+'. No pass is claimed.';$('handover-results').replaceChildren();}}
}
function loadExample(){pack=model.example(baseline,$('handover-example').value);invalidate();fill();run();}
function download(){
  clearExport();
  const json=JSON.stringify(snapshot(),null,2)+'\n';
  $('handover-export-json').value=json;$('handover-export-fallback').hidden=false;$('handover-export-fallback').open=true;
  $('handover-download-note').textContent='Download requested: inputs only, without a claimed result. If no file appears, use the save link or copy the JSON below. The local checker recomputes hashes; the simulated browser hash outage is not part of the inputs.';
  try{
    exportURL=URL.createObjectURL(new Blob([json],{type:'application/json'}));
    const savedLink=$('handover-save-link');savedLink.href=exportURL;savedLink.hidden=false;
    const link=document.createElement('a');link.href=exportURL;link.download='handover-inputs.json';document.body.append(link);
    try{link.click();}finally{link.remove();}
  }catch(error){$('handover-download-note').textContent='Automatic download is unavailable. Copy the JSON below and save it as handover-inputs.json. No saved file or check result is claimed.';}
}
async function start(){
  try{
    async function get(name,json=true){const response=await fetch('handover-pack/'+name);if(!response.ok)throw new Error(name+' could not be loaded');return json?response.json():response.text();}
    const [record,policy,digests,note,risk]=await Promise.all([get('handover.json'),get('policy.json'),get('digests.json'),get('evidence/concept-note.txt',false),get('evidence/risk-review.json',false)]);
    baseline={record,policy,digests,files:{'concept-note.txt':note,'risk-review.json':risk}};
    $('handover-example').addEventListener('change',loadExample);
    $('handover-owner').addEventListener('input',()=>{pack.record.owner=$('handover-owner').value;invalidate();});
    $('handover-signer').addEventListener('input',()=>{pack.record.signoff[1].by=$('handover-signer').value;invalidate();});
    $('handover-evidence').addEventListener('input',()=>{pack.files['concept-note.txt']=$('handover-evidence').value;invalidate();});
    $('handover-run').addEventListener('click',run);
    $('handover-reset').addEventListener('click',loadExample);
    $('handover-download').addEventListener('click',download);
    $('handover-select-json').addEventListener('click',()=>{const field=$('handover-export-json');field.focus();field.select();$('handover-download-note').textContent='JSON selected. Copy it, then save it in a plain-text editor as handover-inputs.json using UTF-8. This page has not saved the file for you.';});
    for(const el of document.querySelectorAll('#handover [disabled]'))el.disabled=false;
    loadExample();
  }catch(error){$('handover-status').textContent='The exercise could not load: '+error.message+'. The explanation and downloadable pack remain available.';}
}
window.addEventListener('DOMContentLoaded',start);
window.addEventListener('pagehide',clearExport);
})();
