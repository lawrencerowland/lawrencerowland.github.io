// Rebuild the downloadable archive after editing its sources. Does not rebaseline evidence hashes.
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname,pack=path.join(root,'handover-pack');
fs.copyFileSync(path.join(root,'handover-model.js'),path.join(pack,'handover-model.js'));
const names=['README.md','PROVENANCE.md','Makefile','check.cjs','handover-model.js','handover.json','handover.schema.json','policy.json','digests.json','validate.workflow.yml','evidence/concept-note.txt','evidence/risk-review.json'];
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
const locals=[],central=[];let offset=0;
for(const name of names){
  const filename=Buffer.from('handover-pack/'+name),data=fs.readFileSync(path.join(pack,name)),crc=crc32(data);
  const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);local.writeUInt16LE(0x21,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(data.length,18);local.writeUInt32LE(data.length,22);local.writeUInt16LE(filename.length,26);
  locals.push(local,filename,data);
  const entry=Buffer.alloc(46);entry.writeUInt32LE(0x02014b50,0);entry.writeUInt16LE(20,4);entry.writeUInt16LE(20,6);entry.writeUInt16LE(0x21,14);entry.writeUInt32LE(crc,16);entry.writeUInt32LE(data.length,20);entry.writeUInt32LE(data.length,24);entry.writeUInt16LE(filename.length,28);entry.writeUInt32LE(offset,42);central.push(entry,filename);
  offset+=local.length+filename.length+data.length;
}
const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(names.length,8);end.writeUInt16LE(names.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
fs.writeFileSync(path.join(root,'handover-pack.zip'),Buffer.concat([...locals,directory,end]));
console.log('Rebuilt handover-pack.zip from '+names.length+' files; evidence digests unchanged.');
