/* Bounded teaching checks, shared by the browser and the downloaded Node checker. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HandoverModel=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const safeName=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9._-]*$/.test(x)&&!x.includes('..');
const digestKey=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9._-]*\.sha256$/.test(x)&&!x.includes('..');
const digestValue=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const clone=x=>JSON.parse(JSON.stringify(x));
function structuralIssues(record){
  const errors=[];
  if(!object(record))return ['The handover must be an object.'];
  for(const key of ['handover_id','owner'])if(!text(record[key]))errors.push(key+' must be a nonblank string.');
  if(record.example_only!==true)errors.push('example_only must be true for this teaching pack.');
  if(!object(record.project)||['name','stage','location'].some(k=>!text(record.project[k])))errors.push('Project needs a nonblank name, stage and location.');
  if(!Array.isArray(record.signoff)||record.signoff.length<1)errors.push('signoff must be a nonempty array.');
  else record.signoff.forEach((s,i)=>{
    if(!object(s)||!text(s.role)||!text(s.by))errors.push('Signoff '+(i+1)+' needs a role and declared signer.');
    if(!object(s)||typeof s.at!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(s.at)||!Number.isFinite(Date.parse(s.at))||new Date(s.at).toISOString().replace('.000Z','Z')!==s.at)errors.push('Signoff '+(i+1)+' needs a valid UTC timestamp (YYYY-MM-DDTHH:mm:ssZ).');
  });
  if(!Array.isArray(record.evidence)||record.evidence.length<1)errors.push('evidence must be a nonempty array.');
  else record.evidence.forEach((ev,i)=>{if(!object(ev)||!safeName(ev.name)||!digestKey(ev.digest_ref)||!text(ev.description))errors.push('Evidence '+(i+1)+' needs a safe file name, digest reference and description.');});
  if(!object(record.provenance)||record.provenance.status!=='not_verified'||!text(record.provenance.note))errors.push('Provenance must explicitly remain not_verified in this example.');
  if(!Array.isArray(record.handover_notes)||record.handover_notes.some(n=>!text(n)))errors.push('handover_notes must contain nonblank strings.');
  return errors;
}
function policyIssues(record,policy){
  if(!object(policy)||policy.id!=='refuge-record-v1'||policy.minimum_signoffs!==2||!Array.isArray(policy.required_roles)||policy.required_roles.join('|')!=='Project Architect|Safety & Access')throw new Error('The expected refuge-record-v1 policy is missing or has changed.');
  const errors=[],signoffs=record.signoff;
  if(signoffs.length<policy.minimum_signoffs)errors.push('This toy policy requires at least two declared signoffs.');
  const names=signoffs.map(s=>s.by.trim().toLowerCase());
  if(new Set(names).size!==names.length)errors.push('Declared signer names must be distinct (case and surrounding spaces are ignored).');
  for(const role of policy.required_roles)if(!signoffs.some(s=>s.role===role))errors.push('Missing declared role: '+role+'.');
  for(const key of ['name','digest_ref'])if(new Set(record.evidence.map(ev=>ev[key])).size!==record.evidence.length)errors.push('Evidence '+key+' values must be unique.');
  return errors;
}
async function evaluate(pack,sha256){
  const checks=[],add=(id,label,status,details)=>checks.push({id,label,status,details});
  const errors=structuralIssues(pack&&pack.record);
  add('structure','Record structure',errors.length?'fail':'pass',errors.length?errors:['Required fields, safe names and timestamp shapes are present. This checks the documented teaching schema.']);
  if(errors.length)add('policy','Declared approval policy','unknown',['Not evaluated because the record is malformed.']);
  else try{const issues=policyIssues(pack.record,pack.policy);add('policy','Declared approval policy',issues.length?'fail':'pass',issues.length?issues:['Two distinct declared names cover the two required roles. Their identities and independence are not authenticated.']);}catch(error){add('policy','Declared approval policy','unknown',['Policy could not run: '+error.message]);}
  if(errors.length)add('digests','Evidence bytes (SHA-256)','unknown',['Not evaluated because the record is malformed.']);
  else {
    const problems=[],details=[];let unavailable=false;
    const digests=pack.digests,files=pack.files;
    if(!object(digests)||Object.entries(digests).some(([key,value])=>!digestKey(key)||!digestValue(value)))problems.push('digests.json must be a flat map from *.sha256 names to 64 lowercase hexadecimal characters.');
    if(!object(files))problems.push('The evidence files are missing.');
    if(object(digests)&&object(files))for(const ev of pack.record.evidence){
      if(!own(digests,ev.digest_ref)||!digestValue(digests[ev.digest_ref])){problems.push(ev.name+': no valid declared digest at '+ev.digest_ref+'.');continue;}
      if(!own(files,ev.name)||!(typeof files[ev.name]==='string'||files[ev.name] instanceof Uint8Array)){problems.push(ev.name+': evidence file is missing.');continue;}
      if(typeof sha256!=='function'){unavailable=true;details.push(ev.name+': hashing is unavailable; no match is claimed.');continue;}
      try{
        const actual=await sha256(files[ev.name]);
        if(!digestValue(actual))throw new Error('hash tool returned an invalid result');
        if(actual!==digests[ev.digest_ref])problems.push(ev.name+': bytes differ from the declared SHA-256.');
        details.push(ev.name+'\nExpected: '+digests[ev.digest_ref]+'\nActual:   '+actual);
      }catch(error){unavailable=true;details.push(ev.name+': hashing failed ('+error.message+'); no match is claimed.');}
    }
    add('digests','Evidence bytes (SHA-256)',problems.length?'fail':unavailable?'unknown':'pass',[...problems,...details]);
  }
  add('acceptance','Identity, provenance and engineering acceptance','unknown',['Declared signoffs are assertions. No signature, trusted workflow, engineering calculation or real inspection has been verified. Matching bytes cannot establish that their content is true.']);
  const bounded=checks.filter(c=>c.id!=='acceptance');
  const status=bounded.some(c=>c.status==='fail')?'fail':bounded.some(c=>c.status==='unknown')?'unknown':'pass';
  return {status,checks,summary:status==='pass'?'Package checks pass; acceptance remains unverified.':status==='fail'?'Package checks fail; see the failed checks below.':'Package checks are incomplete; an unavailable check is not a pass.'};
}
function example(baseline,name){
  const pack=clone(baseline);
  if(name==='changed')pack.files['concept-note.txt']+='\nUnreviewed change to the concept note.\n';
  if(name==='missing')delete pack.files['risk-review.json'];
  if(name==='duplicate')pack.record.signoff[1].by=' '+pack.record.signoff[0].by.toUpperCase()+' ';
  if(name==='malformed')pack.record.owner='   ';
  if(name==='wrapped')pack.digests={digests:pack.digests};
  return pack;
}
// Async results only belong to the input revision that produced them.
function createRevisionGuard(){let revision=0;return {change:()=>++revision,current:()=>revision,isCurrent:token=>token===revision};}
return {structuralIssues,policyIssues,evaluate,example,createRevisionGuard,safeName};
});
