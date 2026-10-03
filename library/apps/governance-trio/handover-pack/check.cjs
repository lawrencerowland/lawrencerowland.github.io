#!/usr/bin/env node
'use strict';
// Node 22+; built-in libraries only. A clean exit concerns package checks only.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const model=require('./handover-model.js');
const readJSON=name=>JSON.parse(fs.readFileSync(path.join(__dirname,name),'utf8'));
async function main(){
  let pack;
  if(process.argv[2]){
    pack=JSON.parse(fs.readFileSync(path.resolve(process.argv[2]),'utf8'));
    // A browser snapshot stores each evidence file as exact UTF-8 text.
  }else{
    pack={record:readJSON('handover.json'),policy:readJSON('policy.json'),digests:readJSON('digests.json'),files:{}};
    // Do not read paths supplied by malformed records. Structure errors are reported below.
    if(Array.isArray(pack.record.evidence))for(const ev of pack.record.evidence){
      if(!ev||!model.safeName(ev.name))continue;
      try{pack.files[ev.name]=fs.readFileSync(path.join(__dirname,'evidence',ev.name));}
      catch(error){if(error.code!=='ENOENT')throw error;}
    }
  }
  const result=await model.evaluate(pack,bytes=>crypto.createHash('sha256').update(bytes).digest('hex'));
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
  process.exitCode=result.status==='pass'?0:result.status==='fail'?1:2;
}
main().catch(error=>{process.stderr.write('Package checks could not run: '+error.message+'\n');process.exitCode=2;});
