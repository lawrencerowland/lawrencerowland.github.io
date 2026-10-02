import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root=dirname(fileURLToPath(import.meta.url));
const apps=JSON.parse(readFileSync(resolve(root,'../../_data/library_apps.json'),'utf8'));
for(const app of apps){
 const result=spawnSync(process.execPath,[resolve(root,'node_modules/vite/bin/vite.js'),'build'],{cwd:root,env:{...process.env,APP:app.id},stdio:'inherit'});
 if(result.status!==0)process.exit(result.status||1);
}
