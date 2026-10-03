/* Plain browser UI. The model is separately usable in Node for semantic checks. */
(function(){
'use strict';
const root=document.getElementById('gapMap');if(!root)return;
const M=window.GapMapModel,$=id=>document.getElementById(id);
let base,data,category='gap',search='',excluded=new Set(),selected=null,graphVisible=false,simulation=null,zoom=null,modalOpener=null;
const types={gap:'gaps',cap:'capabilities',res:'resources'};
function element(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;}
function button(text,action,cls){const b=element('button',text,cls);b.type='button';b.addEventListener('click',action);return b;}
function getItem(id){for(const [kind,key] of Object.entries(types)){const item=data[key].find(x=>x.id===id);if(item)return {item,kind};}return null;}
function sections(item,kind){return kind==='gap'?[['capabilities','Related capabilities',item.linkedCapabilities]]:kind==='cap'?[['gaps','Related gaps',item.linkedGaps],['resources','Resources to investigate',item.linkedResources]]:[['capabilities','Related capabilities',item.linkedCapabilities]];}
function makeCard(item,kind){
  const card=element('article',undefined,'item '+kind+(item.fromApp?' from-app':'')+(selected===item.id?' highlighted':''));card.dataset.id=item.id;card.id='item-'+item.id;
  const h=element('h3');const select=button(item.title,()=>selectItem(item.id),'item-title');select.setAttribute('aria-label','Select '+item.title);h.append(select);card.append(h);
  card.append(element('div',[item.type,...item.domains].filter(Boolean).join(' · '),'domains'));
  if(item.description)card.append(element('p',item.description));
  if(item.sourceKind)card.append(element('p',item.sourceKind+(item.reviewed?' · link reviewed '+item.reviewed:''),'source-note'));
  if(item.association)card.append(element('p',item.association,'source-note'));
  const url=M.safeURL(item.url);if(url){const a=element('a',(item.fromApp?'Open example: ':'Open reference: ')+item.title);a.href=url;card.append(a);}
  if(kind==='res'&&!item.linkedCapabilities.length)card.append(element('p','No capability association has been added for this example yet.','source-note'));
  for(const [key,label,ids] of sections(item,kind)){
    if(!ids?.length)continue;
    const details=element('details');details.append(element('summary',ids.length+' '+label.toLowerCase()));
    const children=element('div',undefined,'childList');
    for(const id of ids){const target=data[key].find(x=>x.id===id);if(target)children.append(button(target.title,()=>follow(id),'childItem'));}
    details.append(children);card.append(details);
  }
  return card;
}
function renderList(){
  const list=$('listView');list.replaceChildren();const items=data[types[category]].filter(i=>M.matches(i,search,excluded));
  for(const item of items)list.append(makeCard(item,category));
  if(!items.length)list.append(element('p','No matching items. Try another term or clear the filters.','empty-state'));
  if(!graphVisible)$('resultCount').textContent=items.length+' '+types[category]+' shown';
}
function render(){if(!data)return;renderList();if(graphVisible)drawGraph();}
function buildDomains(){
  const ds=[...new Set(Object.values(types).flatMap(key=>data[key].flatMap(i=>i.domains)))].sort();
  const container=$('domainFilters'),focusedDomain=container.contains(document.activeElement)?document.activeElement.dataset.domain:null;container.replaceChildren();
  for(const d of ds){const label=element('label'),input=element('input');input.type='checkbox';input.checked=!excluded.has(d);input.dataset.domain=d;input.addEventListener('change',()=>{if(input.checked)excluded.delete(d);else excluded.add(d);render();});label.append(input,document.createTextNode(d));container.append(label);}
  if(focusedDomain)[...container.querySelectorAll('input')].find(i=>i.dataset.domain===focusedDomain)?.focus();
}
function clearFilters(){search='';$('searchBox').value='';excluded.clear();buildDomains();}
function selectItem(id){
  selected=id;
  root.querySelectorAll('.item').forEach(el=>el.classList.toggle('highlighted',el.dataset.id===id));
  if(graphVisible){
    root.querySelectorAll('.node-group').forEach(el=>el.classList.toggle('selected',el.dataset.id===id));
    if(window.d3)window.d3.select('#graphSvg').selectAll('.link').classed('highlighted',d=>d.source.id===id||d.target.id===id);
    const found=getItem(id);$('graphSelection').replaceChildren();if(found){const card=makeCard(found.item,found.kind);card.removeAttribute('id');$('graphSelection').append(card);}
  }
}
function follow(id){
  const found=getItem(id);if(!found)return;
  clearFilters();category=found.kind;selected=id;graphVisible=false;syncView();setCategory(category);
  const target=$('item-'+id)?.querySelector('button');target?.focus();target?.scrollIntoView?.({block:'nearest'});
}
function setCategory(kind){category=kind;root.querySelectorAll('[data-cat]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cat===kind)));renderList();}
function syncView(){
  $('graphView').hidden=!graphVisible;$('listView').hidden=graphVisible;$('toggleGraph').textContent=graphVisible?'List view':'Graph view';$('toggleGraph').setAttribute('aria-pressed',String(graphVisible));
  if(!graphVisible&&simulation){simulation.stop();simulation=null;}
}
function drawGraph(){
  if(simulation){simulation.stop();simulation=null;}
  const d3=window.d3;if(!d3)return;
  const {nodes,links}=M.graphData(data,search,excluded),svg=d3.select('#graphSvg');svg.selectAll('*').remove();
  const width=$('graphSvg').clientWidth||900,height=$('graphSvg').clientHeight||560;
  svg.attr('viewBox',`0 0 ${width} ${height}`);
  $('resultCount').textContent=nodes.length+' graph items · '+links.length+' visible relationships';
  const holder=svg.append('g');zoom=d3.zoom().extent([[0,0],[width,height]]).scaleExtent([.25,5]).on('zoom',event=>holder.attr('transform',event.transform));svg.call(zoom);svg.call(zoom.transform,d3.zoomIdentity);
  if(!nodes.length){svg.append('text').attr('x',20).attr('y',40).text('No matching items. Clear the filters to restore the map.');$('graphSelection').replaceChildren();return;}
  const colors={gap:'#9a4638',cap:'#365f75',res:'#37654b'},xs={gap:width*.18,cap:width*.5,res:width*.82};
  const lines=holder.append('g').selectAll('line').data(links).join('line').attr('class','link').attr('stroke','#bbc4ba').attr('stroke-width',1.3);
  const groups=holder.append('g').selectAll('g').data(nodes).join('g').attr('class','node-group').attr('data-id',n=>n.id).attr('tabindex',0).attr('role','button').attr('aria-label',n=>({gap:'Gap',cap:'Capability',res:'Resource'}[n.kind])+': '+n.title)
    .on('click',(event,n)=>selectItem(n.id)).on('keydown',(event,n)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectItem(n.id);}})
    .on('pointerenter',(event,n)=>{const tip=root.querySelector('.graph-tooltip');tip.textContent=n.title;tip.hidden=false;const rect=$('graphView').getBoundingClientRect();tip.style.left=Math.min(Math.max(0,event.clientX-rect.left+10),Math.max(0,rect.width-280))+'px';tip.style.top=Math.max(0,event.clientY-rect.top-30)+'px';})
    .on('pointerleave',()=>{root.querySelector('.graph-tooltip').hidden=true;});
  groups.append('circle').attr('class','node').attr('r',8).attr('fill',n=>colors[n.kind]);groups.append('title').text(n=>n.title);
  groups.filter(n=>n.fromApp).append('circle').attr('class','app-ring').attr('r',12);
  // Labels appear on the selected node via details, keeping the dense overview readable.
  simulation=d3.forceSimulation(nodes).force('link',d3.forceLink(links).id(n=>n.id).distance(65)).force('charge',d3.forceManyBody().strength(-90)).force('center',d3.forceCenter(width/2,height/2)).force('x',d3.forceX(n=>xs[n.kind]).strength(.5)).force('y',d3.forceY(height/2).strength(.04)).force('collide',d3.forceCollide(12));
  groups.call(d3.drag().on('start',(event,n)=>{if(!event.active)simulation.alphaTarget(.3).restart();n.fx=n.x;n.fy=n.y;}).on('drag',(event,n)=>{n.fx=event.x;n.fy=event.y;}).on('end',(event,n)=>{if(!event.active)simulation.alphaTarget(0);n.fx=null;n.fy=null;}));
  simulation.on('tick',()=>{lines.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);groups.attr('transform',d=>`translate(${d.x},${d.y})`);});
  if(selected&&nodes.some(n=>n.id===selected))selectItem(selected);else $('graphSelection').replaceChildren();
}
function setupModal(openerId,id){
  const modal=$(id),close=()=>{modal.hidden=true;modalOpener?.focus();};
  $(openerId).addEventListener('click',()=>{modalOpener=$(openerId);modal.hidden=false;modal.querySelector('button').focus();});
  modal.querySelector('.close-button').addEventListener('click',close);
  modal.addEventListener('click',event=>{if(event.target===modal)close();});
  modal.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();close();}
    if(event.key==='Tab'){const focusables=[...modal.querySelectorAll('button,a[href]')];const first=focusables[0],last=focusables.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });
}
async function init(){
  setupModal('whatBtn','whatModal');setupModal('howToBtn','howToModal');setupModal('moreInfoBtn','moreInfoModal');
  try{const response=await fetch('/assets/data/gap-map.json');if(!response.ok)throw new Error('Map unavailable');base=await response.json();data=M.createData(base);}catch(error){$('loadStatus').textContent='The map could not load. Reload this page to try again; the Library links above remain available.';return;}
  root.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.cat)));
  $('searchBox').addEventListener('input',event=>{search=event.target.value;render();});
  $('clearSelectionBtn').addEventListener('click',()=>{selected=null;clearFilters();$('graphSelection').replaceChildren();render();});
  $('allDomains').addEventListener('click',()=>{excluded.clear();buildDomains();render();});
  $('noDomains').addEventListener('click',()=>{excluded=new Set([...$('domainFilters').querySelectorAll('input')].map(i=>i.dataset.domain));buildDomains();render();});
  $('toggleGraph').addEventListener('click',()=>{graphVisible=!graphVisible;syncView();render();});
  if(!window.d3){$('toggleGraph').disabled=true;$('toggleGraph').title='Graph library unavailable; all items and links remain available in the list.';}
  for(const [id,scale] of [['zoomIn',1.4],['zoomOut',1/1.4]])$(id).addEventListener('click',()=>{if(zoom)window.d3.select('#graphSvg').call(zoom.scaleBy,scale);});
  $('resetGraph').addEventListener('click',()=>{if(zoom)window.d3.select('#graphSvg').call(zoom.transform,window.d3.zoomIdentity);});
  window.addEventListener('pagehide',()=>simulation?.stop());
  buildDomains();render();$('loadStatus').textContent='Guidance loaded. Loading interactive examples…';
  const catalogue=await M.loadCatalogues(fetch);
  data=M.integrateApps(base,catalogue.apps);buildDomains();render();
  $('loadStatus').textContent=(catalogue.failures.length?'Some example feeds are unavailable: '+catalogue.failures.join(', ')+'. The other resources remain usable.':catalogue.apps.length+' interactive examples loaded alongside 18 guidance resources.')+(!window.d3?' Graph unavailable; use the list.':'');
}
init();
})();
