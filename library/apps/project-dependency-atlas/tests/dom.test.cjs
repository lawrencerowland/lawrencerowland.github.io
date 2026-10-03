const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM,VirtualConsole}=require('../../../../tools/library-apps/node_modules/jsdom');
const dir=path.resolve(__dirname,'..');
function setup({storageFailure=false}={}){
  const errors=[],downloads=[],storage=new Map([['another-app','untouched']]);const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM(fs.readFileSync(path.join(dir,'index.html'),'utf8'),{url:'https://example.test/library/apps/project-dependency-atlas/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
  const w=dom.window;
  Object.defineProperty(w,'localStorage',{value:{getItem:k=>{if(storageFailure)throw Error('Storage blocked');return storage.has(k)?storage.get(k):null;},setItem:(k,v)=>{if(storageFailure)throw Error('Quota exceeded');storage.set(k,String(v));}}});
  w.Blob=class{constructor(parts){this.content=parts.join('');}};
  w.URL.createObjectURL=blob=>{downloads.push(blob.content);return 'blob:example';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
  ['data.js','model.js','app.js'].forEach(file=>w.eval(fs.readFileSync(path.join(dir,file),'utf8')));
  const $=id=>w.document.getElementById(id),click=id=>$(id).click();
  const change=(id,value)=>{$(id).value=value;$(id).dispatchEvent(new w.Event('change',{bubbles:true}));};
  const state=()=>{click('export');return JSON.parse($('view-json').value);};
  return {dom,w,$,click,change,state,errors,downloads,storage,close:()=>w.close()};
}

test('every source node, edge, timeline item and supplied narrative renders in its original preset',()=>{
  const c=setup();try{
    assert.equal(c.$('error').textContent,'');assert.deepEqual(c.errors,[]);
    for(const [key,data] of Object.entries(c.w.DependencyAtlas.data.bundles)){
      c.change('bundle-example',key);
      assert.equal(c.$('bundle-chart').querySelectorAll('.bundle-node').length,data.hierarchy.children.flatMap(g=>g.children).length);
      assert.equal(c.$('bundle-chart').querySelectorAll('.bundle-edge').length,data.imports.length);
      assert.equal(c.$('edge-table').children.length,data.imports.length);
      assert.equal(c.$('bundle-original-narrative').textContent,data.insight.text);assert.equal(c.$('bundle-original-title').textContent,data.insight.title);assert.notEqual(c.$('bundle-narrative-title').textContent,data.insight.title);
      assert.equal(c.$('bundle-original').querySelectorAll('dt').length,data.meta.length);
      const paths=[...c.$('bundle-chart').querySelectorAll('.bundle-edge')];assert.ok(paths.every(p=>p.getAttribute('d').includes(' C ')&&!/NaN|Infinity/.test(p.getAttribute('d'))));
    }
    c.click('tab-timeline');assert.equal(c.$('timeline').hidden,false);assert.equal(c.$('bundle').hidden,true);
    for(const [key,data] of Object.entries(c.w.DependencyAtlas.data.timelines)){
      c.change('timeline-example',key);
      assert.equal(c.$('timeline-chart').querySelectorAll('svg').length,data.streams.length);
      assert.equal(c.$('timeline-chart').querySelectorAll('.timeline-item').length,data.streams.flatMap(s=>s.tasks).length);
      assert.equal(c.$('task-table').children.length,data.streams.flatMap(s=>s.tasks).length);
      assert.equal(c.$('timeline-original-narrative').textContent,data.insight.text);assert.equal(c.$('timeline-original-title').textContent,data.insight.title);assert.notEqual(c.$('timeline-narrative-title').textContent,data.insight.title);assert.doesNotMatch(c.$('timeline-narrative').textContent,/both demand|Three programmes competing|consumed 80%/);
      assert.equal(c.$('timeline-chart').querySelectorAll('.source-line').length,data.streams.length);
      assert.equal(c.$('overlap-table').children.length,key==='portfolio'?35:43);
    }
  }finally{c.close();}
});

test('node selection, preview, pointer and keyboard retain actual directional detail and correct filters',()=>{
  const c=setup();try{
    c.change('node-select','Design Integration');assert.equal(c.$('node-title').textContent,'Design Integration');assert.match(c.$('node-detail').textContent,/11 incident/);assert.match(c.$('node-detail').textContent,/5 incoming/);assert.match(c.$('node-detail').textContent,/6 outgoing/);
    assert.equal(c.$('bundle-chart').querySelectorAll('.connected').length,11);
    c.change('link-filter','cross');assert.equal(c.$('bundle-chart').querySelectorAll('.bundle-edge').length,23);assert.equal(c.$('bundle-chart').querySelectorAll('.connected').length,8);assert.match(c.$('node-detail').textContent,/11 incident/);
    const node=[...c.$('bundle-chart').querySelectorAll('.bundle-node')].find(n=>n.dataset.name==='Funding Case');node.dispatchEvent(new c.w.Event('mouseenter'));assert.equal(c.$('node-title').textContent,'Funding Case');
    assert.equal(c.state().node,'Design Integration');node.dispatchEvent(new c.w.Event('mouseleave'));assert.equal(c.$('node-title').textContent,'Design Integration');
    node.focus();assert.equal(c.w.document.activeElement,node);assert.equal(c.state().node,'Funding Case');
    node.dispatchEvent(new c.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(c.state().node,null);
    node.dispatchEvent(new c.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.equal(c.state().node,'Funding Case');
    c.click('clear-node');assert.equal(c.$('bundle-chart').querySelectorAll('.connected').length,0);
    c.change('link-filter','internal');assert.equal(c.$('edge-table').children.length,13);
    c.change('bundle-example','srp');assert.equal(c.$('edge-table').children.length,15);assert.equal(c.state().node,null);
    c.change('node-select','ONR Safety Case');assert.match(c.$('node-detail').textContent,/3 outgoing/);assert.match(c.$('node-detail').textContent,/Characterisation/);
  }finally{c.close();}
});

test('tabs implement arrow, Home and End navigation with hidden panels and one active tab',()=>{
  const c=setup();try{
    c.$('tab-bundle').focus();c.$('tab-bundle').dispatchEvent(new c.w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
    assert.equal(c.w.document.activeElement,c.$('tab-timeline'));assert.equal(c.$('timeline').hidden,false);assert.equal(c.$('tab-bundle').tabIndex,-1);assert.equal(c.$('tab-timeline').getAttribute('aria-selected'),'true');
    c.$('tab-timeline').dispatchEvent(new c.w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));assert.equal(c.$('bundle').hidden,false);
    c.$('tab-bundle').dispatchEvent(new c.w.KeyboardEvent('keydown',{key:'End',bubbles:true}));assert.equal(c.$('timeline').hidden,false);
  }finally{c.close();}
});

test('timeline status filters preserve the shared date scale and selections report elapsed dates, not float',()=>{
  const c=setup();try{
    c.click('tab-timeline');const positions=[...c.$('timeline-chart').querySelectorAll('.source-line')].map(n=>n.getAttribute('x1'));
    c.change('status-filter','milestone');assert.equal(c.$('task-table').children.length,4);assert.equal(c.$('timeline-chart').querySelectorAll('.bar').length,0);assert.equal(c.$('timeline-chart').querySelectorAll('.diamond').length,4);
    assert.deepEqual([...c.$('timeline-chart').querySelectorAll('.source-line')].map(n=>n.getAttribute('x1')),positions);
    c.change('task-select','0:3');assert.equal(c.$('task-title').textContent,'GRIP 5 Gate');assert.match(c.$('task-detail').textContent,/0 elapsed calendar days/);
    c.change('status-filter','at-risk');assert.equal(c.state().task,null);assert.equal(c.$('task-table').children.length,1);
    const item=c.$('timeline-chart').querySelector('.timeline-item');item.focus();assert.equal(c.state().task,'1:2');assert.match(c.$('task-detail').textContent,/59 elapsed calendar days/);
    c.change('timeline-example','pennine-tl');assert.equal(c.state().task,null);assert.equal(c.$('task-table').children.length,2);
    c.change('status-filter','delayed');assert.equal(c.$('task-table').children.length,0);assert.equal(c.$('timeline-chart').querySelectorAll('svg').length,5);assert.match(c.$('timeline-chart').textContent,/No items match this status/);
  }finally{c.close();}
});

test('save, reset, load and validated view import round-trip every selection without modifying other app storage',()=>{
  const c=setup();try{
    c.change('bundle-example','srp');c.change('node-select','Reg Approval Gate');c.change('link-filter','cross');c.click('tab-timeline');c.change('timeline-example','pennine-tl');c.change('status-filter','milestone');c.change('task-select','2:3');
    const before=c.state();c.click('save');c.click('reset');assert.equal(c.state().bundle,'pennine');c.click('load');assert.deepEqual(c.state(),before);assert.equal(c.storage.get('another-app'),'untouched');
    const imported={...before,view:'bundle',links:'internal',node:'ONR Safety Case'};c.click('import');c.$('view-json').value=JSON.stringify(imported);c.click('apply-view');assert.equal(c.$('transfer-error').textContent,'');assert.deepEqual(c.state(),imported);
    assert.equal(c.storage.size,2);c.click('load');assert.deepEqual(c.state(),before);
    c.click('export-data');const ref=JSON.parse(c.downloads.at(-1));assert.equal(ref.kind,'reference-data');assert.deepEqual(Object.keys(ref.bundles),['pennine','srp']);assert.equal(ref.timelines.portfolio.insight.text,c.w.DependencyAtlas.data.timelines.portfolio.insight.text);
    c.click('import');c.$('view-json').value=JSON.stringify(ref);c.click('apply-view');assert.match(c.$('transfer-error').textContent,/not changed/);assert.deepEqual(c.state(),before);
  }finally{c.close();}
});

test('invalid, hostile and filtered-out imported references leave the current view untouched',()=>{
  const c=setup();try{
    c.change('node-select','Design Integration');const before=c.state();
    for(const invalid of ['{',JSON.stringify({...before,node:'<img src=x onerror=alert(1)>'}),JSON.stringify({...before,task:'0:0',status:'milestone'}),JSON.stringify({...before,view:'future'}),JSON.stringify({...before,extra:'x'})]){
      c.click('import');c.$('view-json').value=invalid;c.click('apply-view');assert.match(c.$('transfer-error').textContent,/not changed/);assert.deepEqual(c.state(),before);
      assert.equal(c.w.document.querySelector('img'),null);
    }
  }finally{c.close();}
});

test('malformed or inaccessible storage is reported without overwriting bytes or claiming success',()=>{
  const c=setup();try{
    c.click('load');assert.match(c.$('status').textContent,/No saved view/);
    c.storage.set('library.project-dependency-atlas.view.v1','broken');c.click('load');assert.match(c.$('error').textContent,/unchanged/);assert.equal(c.storage.get('library.project-dependency-atlas.view.v1'),'broken');assert.equal(c.state().bundle,'pennine');
  }finally{c.close();}
  const blocked=setup({storageFailure:true});try{
    blocked.click('save');assert.match(blocked.$('error').textContent,/Could not save/);assert.equal(blocked.$('status').textContent,'');blocked.click('load');assert.match(blocked.$('error').textContent,/Could not load/);assert.equal(blocked.$('bundle-chart').querySelectorAll('.bundle-node').length,22);
  }finally{blocked.close();}
});
