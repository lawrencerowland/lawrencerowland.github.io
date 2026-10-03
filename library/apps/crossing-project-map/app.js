(function(){
'use strict';
const M=window.GraphModel,data=M.validateData(JSON.parse(document.getElementById('kg-data').textContent));
const $=id=>document.getElementById(id),el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const isMap=data.meta.kind==='crossing';let state=M.defaultState(data),view,positions=new Map(),pinned=new Set(),svg,layer,zoom,map,markers,mapLines,tiles,layoutKey;
const palette=['#24629b','#a44339','#8b611b','#26734f','#7751a3','#a34e08'];
const allTypes=M.defaultState(data).types,color=type=>palette[allTypes.indexOf(type)%palette.length];
const status=text=>$('status').textContent=text;
try{if(location.hash.startsWith('#view='))state=M.importView(data,decodeURIComponent(location.hash.slice(6)));}catch(e){status('Saved view could not be opened: '+e.message);}
function button(text,action,id){const b=el('button',text);b.type='button';if(id)b.id=id;b.addEventListener('click',action);return b;}
function safeLink(url,text){const a=el('a',text);if(/^https:\/\//.test(url)){a.href=url;a.target='_blank';a.rel='noopener noreferrer';}return a;}
function fieldChecks(id,values,key){for(const value of values){const label=el('label',undefined,'check'),input=el('input');input.type='checkbox';input.value=value;input.checked=state[key].includes(value);input.addEventListener('change',()=>{state[key]=[...$(id).querySelectorAll('input:checked')].map(i=>i.value);state.reading='';render();});label.append(input);if(key==='types'){const swatch=el('span');swatch.setAttribute('aria-hidden','true');swatch.style.cssText='display:inline-block;width:12px;height:12px;margin-top:5px;border-radius:50%;flex-shrink:0;background:'+color(value);label.append(swatch);}label.append(el('span',value));$(id).append(label);}}
fieldChecks('node-types',allTypes,'types');fieldChecks('edge-types',M.defaultState(data).relations,'relations');
for(const reading of data.scenarios)$('readings').append(button(reading.title,()=>{state={...M.defaultState(data),reading:reading.id};render();status(reading.summary);},'reading-'+reading.id));
$('readings').append(button('Show full graph',()=>{state.reading='';render();}));
function syncControls(){
  $('search').value=state.query;
  for(const [id,key] of [['node-types','types'],['edge-types','relations']])$(id).querySelectorAll('input').forEach(i=>i.checked=state[key].includes(i.value));
  for(const key of ['undated','inferred','labels','ego','mapLines'])if($(key))$(key).checked=state[key];
  for(const key of ['year','charge','distance'])if($(key)){$(key).value=state[key];if($(key+'-value'))$(key+'-value').textContent=state[key];}
  $('readings').querySelectorAll('button[id]').forEach(b=>b.setAttribute('aria-pressed',b.id==='reading-'+state.reading?'true':'false'));
  $('reading-text').textContent=data.scenarios.find(r=>r.id===state.reading)?.summary||'Choose a reading, select a node, or filter the graph. Every visible item is also available in the card index.';
}
function select(id){state.selected=id;render();status(data.nodes.find(n=>n.id===id).label+' selected. Details and its visible relationships are below the graph.');}
function render(){
  const focused=document.activeElement?.id;
  view=M.derive(data,state);state.selected=view.selected;syncControls();
  $('stats').textContent=`${view.nodes.length} of ${data.nodes.length} nodes · ${view.edges.length} of ${data.edges.length} relationships · ${view.inferred} inferred relationships visible · ${view.isolated.length} nodes without visible links`;
  renderGraph();renderCards();renderDetail();renderRelations();renderGaps();if(map)renderMap();
  if(focused&&$(focused)&&document.activeElement!==$(focused))$(focused).focus({preventScroll:true});
}
function renderCards(){
  const host=$('cards');host.replaceChildren();
  if(!view.nodes.length){host.append(el('p','No nodes match these filters. Reset the filters to restore the example.'));return;}
  for(const n of view.nodes){const card=el('article',undefined,'node-card');card.dataset.nodeId=n.id;
    const title=el('h3');title.append(button(n.label,()=>select(n.id),'card-'+n.id));
    card.append(title,el('p',`${M.group(n)} · ${n.type}`,'eyebrow'),el('p',n.summary),el('p',n.basis,'basis'));if(state.selected===n.id)card.classList.add('selected');host.append(card);
  }
}
function addMeta(host,key,value){if(value==null||value==='')return;host.append(el('dt',key),el('dd',Array.isArray(value)?value.join(', '):String(value)));}
function renderDetail(){
  const host=$('details');host.replaceChildren();const n=data.nodes.find(n=>n.id===state.selected);
  if(!n){host.append(el('h2','Inspect a node'),el('p','Select a graph node, map marker or card to read its meaning, source and relationships.'));return;}
  host.append(el('h2',n.label),el('p',n.summary),el('p',n.basis,'basis'));
  const meta=el('dl');addMeta(meta,'Type',n.type);if(n.group)addMeta(meta,'Visual group',n.group);
  for(const [key,val] of Object.entries(n.meta))addMeta(meta,key.replace(/([a-z])([A-Z])/g,'$1 $2'),key.toLowerCase().includes('valuegbp')&&typeof val==='number'?new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:2}).format(val):val);
  if(n.legacyLabel&&n.legacyLabel!==n.label)addMeta(meta,'Original sample label',n.legacyLabel+' — renamed to prevent a claim about a real HS2 entity.');
  const coord=M.coordinate(data,n.id);if(coord){addMeta(meta,'Projection coordinate',`${coord.lat}, ${coord.lon}`);addMeta(meta,'Coordinate meaning',coord.basis);}
  host.append(meta);if(n.url)host.append(safeLink(n.url,n.meta.noticeId?'Open primary notice ↗':'Open official project page ↗'));
  if(n.legacyMeta){const old=el('details'),summary=el('summary','Original fields and corrections');old.append(summary,el('p','These superseded source fields are retained for comparison. Use the corrected fields above.'),el('pre',JSON.stringify(n.legacyMeta,null,2)));host.append(old);}
  const actions=el('div',undefined,'actions');
  actions.append(button(pinned.has(n.id)?'Unpin graph node':'Pin graph node',()=>{pinned.has(n.id)?pinned.delete(n.id):pinned.add(n.id);render();},'pin-node'));
  if(coord&&map)actions.append(button('Centre map here',()=>{map.setView([coord.lat,coord.lon],n.type==='Site'?10:9);$('map').scrollIntoView({block:'nearest',behavior:'smooth'});}));
  actions.append(button('Clear selection',()=>{state.selected=null;render();}));host.append(actions);
  const connected=view.edges.filter(e=>e.source===n.id||e.target===n.id),list=el('ul');
  host.append(el('h3',`${connected.length} relationships under current filters`));
  for(const e of connected){const other=data.nodes.find(v=>v.id===(e.source===n.id?e.target:e.source)),li=el('li');li.append(el('span',e.source===n.id?e.label+' → ':'← '+e.label+' '),button(other.label,()=>select(other.id),'neighbor-'+e.id));list.append(li);}host.append(list);
}
function renderRelations(){
  const host=$('relations');host.replaceChildren();
  for(const e of view.edges){const li=el('li'),a=data.nodes.find(n=>n.id===e.source),b=data.nodes.find(n=>n.id===e.target);
    li.append(el('strong',`${a.label} → ${e.label} → ${b.label}`),el('span',` [${e.kind}] `,'basis'),el('p',e.rationale));
    if(e.sourceUrl)li.append(safeLink(e.sourceUrl,'Relationship source ↗'));
    if(e.legacy&&(e.source!==e.legacy.source||e.target!==e.legacy.target||e.type!==e.legacy.type)){const details=el('details');details.append(el('summary','How this differs from the original graph'),el('p',`${e.legacy.source} → ${e.legacy.type} → ${e.legacy.target}. ${e.rationale}`));li.append(details);}
    host.append(li);
  }
  if(!view.edges.length)host.append(el('li','No relationships meet the current filters. Nodes may still match.'));
}
function renderGaps(){
  const host=$('gaps');host.replaceChildren();
  const notes=isMap?['Only 12 award notices are included; this cannot establish the project’s full supply chain, current commitments or total spend.','Four primary notices could not be retrieved during review. Their rows and linked claims remain labelled legacy.','Office and city proxies do not locate contract delivery. Similar buyer names remain distinct source records; no legal-entity reconciliation is claimed.','Framework links from file or email labels and area associations are editorial inferences.']:['All nodes and relationships describe a fictional case; no real incident, supplier performance or outcome is evidenced.','No probabilities, option scores or quantified risk model are supplied. The two-week delay and 3% component cost increase are story assumptions.','COVER terminology is used as a teaching aid. No ontology conformance, multiplicity check or reasoning result is claimed.'];
  notes.forEach(t=>host.append(el('li',t)));
  host.append(el('li',view.isolated.length?`Without visible links under these filters: ${view.isolated.map(n=>n.label).join('; ')}.`:'Every visible node has at least one visible relationship.'));
}
function renderGraph(){
  if(!window.d3){$('graph-fallback').hidden=false;return;}
  const d3=window.d3,width=980,height=570;
  if(!svg){svg=d3.select('#network').attr('viewBox',`0 0 ${width} ${height}`);svg.append('defs').append('marker').attr('id','edge-arrow').attr('viewBox','0 -5 10 10').attr('refX',22).attr('markerWidth',5).attr('markerHeight',5).attr('orient','auto').append('path').attr('d','M0,-5L10,0L0,5').attr('fill','#688072');layer=svg.append('g');zoom=d3.zoom().extent([[0,0],[width,height]]).scaleExtent([.15,5]).on('zoom',ev=>layer.attr('transform',ev.transform));svg.call(zoom);}
  layer.selectAll('*').remove();
  const nodes=view.nodes.map(n=>({...n,...positions.get(n.id)})),edges=view.edges.map(e=>({...e}));
  nodes.forEach(n=>{if(pinned.has(n.id)&&Number.isFinite(n.x)){n.fx=n.x;n.fy=n.y;}else{n.fx=null;n.fy=null;}});
  const nextKey=JSON.stringify([nodes.map(n=>n.id),edges.map(e=>e.id),state.distance,state.charge]),changed=layoutKey!==nextKey||nodes.some(n=>!positions.has(n.id));
  const simulation=d3.forceSimulation(nodes).stop().randomSource(d3.randomLcg(.42)).force('link',d3.forceLink(edges).id(n=>n.id).distance(state.distance)).force('charge',d3.forceManyBody().strength(-state.charge)).force('collide',d3.forceCollide().radius(43)).force('center',d3.forceCenter(width/2,height/2));if(changed)simulation.tick(140);layoutKey=nextKey;
  const links=layer.append('g').selectAll('line').data(edges).join('line').attr('class',e=>'edge '+e.kind).attr('marker-end','url(#edge-arrow)').attr('stroke-width',e=>e.source.id===state.selected||e.target.id===state.selected?3:1.4);
  links.append('title').text(e=>e.label+' — '+e.kind+' — '+e.rationale);
  const labels=layer.append('g').selectAll('text').data(edges).join('text').attr('class','edge-label').attr('text-anchor','middle').text(e=>e.label).style('display',e=>state.selected&&(e.source.id===state.selected||e.target.id===state.selected)?null:'none');
  const node=layer.append('g').selectAll('g').data(nodes).join('g').attr('class',n=>'graph-node'+(n.id===state.selected?' selected':'')).attr('id',n=>'graph-'+n.id).attr('tabindex',0).attr('role','button').attr('aria-label',n=>n.label+', '+n.type+', '+n.basis).on('click',(_,n)=>select(n.id)).on('keydown',(ev,n)=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();select(n.id);}});
  node.append('circle').attr('r',n=>13+Math.min(8,view.degree.get(n.id))).attr('fill',n=>color(M.group(n))).attr('stroke-width',n=>pinned.has(n.id)?4:2);
  node.append('title').text(n=>n.label+' — '+n.summary);
  node.append('text').attr('class','node-label').attr('y',-27).attr('text-anchor','middle').style('display',state.labels?null:'none').each(function(n){const words=n.label.split(' '),lines=[];let line='';for(const w of words){if((line+' '+w).trim().length>28&&line){lines.push(line);line=w;}else line=(line+' '+w).trim();}if(line)lines.push(line);d3.select(this).selectAll('tspan').data(lines).join('tspan').attr('x',0).attr('dy',(_,i)=>i?13:0).text(v=>v);});
  if(state.ego&&state.selected){node.style('opacity',n=>view.neighbors.has(n.id)?1:.2);links.style('opacity',e=>e.source.id===state.selected||e.target.id===state.selected?1:.12);}
  function tick(){links.attr('x1',e=>e.source.x).attr('y1',e=>e.source.y).attr('x2',e=>e.target.x).attr('y2',e=>e.target.y);labels.attr('x',e=>(e.source.x+e.target.x)/2).attr('y',e=>(e.source.y+e.target.y)/2-5);node.attr('transform',n=>`translate(${n.x},${n.y})`);nodes.forEach(n=>positions.set(n.id,{x:n.x,y:n.y}));}
  node.call(d3.drag().on('start',ev=>ev.sourceEvent.stopPropagation()).on('drag',(ev,n)=>{n.x=ev.x;n.y=ev.y;tick();}).on('end',(_,n)=>{positions.set(n.id,{x:n.x,y:n.y});}));tick();if(changed)fit();
}
function fit(){if(!svg||!view.nodes.length)return;const p=view.nodes.map(n=>positions.get(n.id)).filter(Boolean),xs=p.map(n=>n.x),ys=p.map(n=>n.y);const minX=Math.min(...xs)-95,maxX=Math.max(...xs)+95,minY=Math.min(...ys)-65,maxY=Math.max(...ys)+65;const k=Math.min(1.6,980/(maxX-minX),570/(maxY-minY));svg.call(zoom.transform,d3.zoomIdentity.translate(490-k*(minX+maxX)/2,285-k*(minY+maxY)/2).scale(k));}
function initMap(){
  if(!isMap)return;if(!window.L){$('map-fallback').hidden=false;return;}
  map=L.map('map',{scrollWheelZoom:false}).setView([52.3,-.7],6);
  const grid=L.layerGroup().addTo(map);
  for(let lat=49;lat<=60;lat++)L.polyline([[lat,-10],[lat,5]],{color:'#c8d2bd',weight:1,interactive:false}).addTo(grid);
  for(let lon=-10;lon<=5;lon++)L.polyline([[49,lon],[60,lon]],{color:'#c8d2bd',weight:1,interactive:false}).addTo(grid);
  markers=L.layerGroup().addTo(map);mapLines=L.layerGroup().addTo(map);
  // Tiles are optional; local points, relationships and lists never need a tile server.
  $('tiles').addEventListener('change',()=>{if($('tiles').checked){if(!tiles){tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});tiles.on('tileerror',()=>{$('map-status').textContent='Street tiles are unavailable. The coordinate projection and card index still work.';});}tiles.addTo(map);$('map-status').textContent='Online street tiles enabled; point accuracy still depends on the source coordinates.';}else{if(tiles)map.removeLayer(tiles);$('map-status').textContent='Coordinate projection only. Enable online street tiles for geographic context.';}});
  $('fit-map').addEventListener('click',fitMap);
}
function fitMap(){const coords=view.nodes.map(n=>M.coordinate(data,n.id)).filter(Boolean);if(coords.length)map.fitBounds(coords.map(c=>[c.lat,c.lon]),{padding:[35,35],maxZoom:9});}
function renderMap(){
  markers.clearLayers();mapLines.clearLayers();const grouped=new Map();
  for(const n of view.nodes){const c=M.coordinate(data,n.id);if(!c)continue;const key=c.lat+','+c.lon;if(!grouped.has(key))grouped.set(key,{c,nodes:[]});grouped.get(key).nodes.push(n);}
  for(const {c,nodes} of grouped.values()){
    const primary=nodes.find(n=>n.id===state.selected)||nodes.find(n=>!M.coordinate(data,n.id).derived)||nodes[0];
    const marker=L.circleMarker([c.lat,c.lon],{radius:9,color:primary.id===state.selected?'#111':'#fff',weight:primary.id===state.selected?4:2,fillColor:color(M.group(primary)),fillOpacity:.85}).addTo(markers);
    const popup=el('div');popup.append(el('strong',nodes.length===1?primary.label:`${nodes.length} nodes share this projection point`),el('p',c.basis));nodes.forEach(n=>popup.append(button(n.label,()=>select(n.id))));marker.bindPopup(popup);marker.bindTooltip(primary.label+(nodes.length>1?` (+${nodes.length-1})`:''),{permanent:true,direction:'top',className:'map-label'});marker.on('click',()=>{status('Map point selected. Choose an item in the popup to inspect the graph record.');});
  }
  const lines=state.mapLines?M.mapEdges(data,view):[];
  for(const e of lines){const line=L.polyline([[e.a.lat,e.a.lon],[e.b.lat,e.b.lon]],{color:e.kind==='inferred'?'#9a671f':'#366755',weight:2,opacity:.45,dashArray:e.kind==='inferred'?'7 5':'3 5'}).addTo(mapLines);line.bindTooltip(e.label+' — geographic projection, not a route');}
  $('map-count').textContent=`${grouped.size} distinct coordinate points · ${lines.length} projected lines. Several records can share a point; open its popup to choose one.`;
}
function download(name,text,type='application/json'){try{const url=URL.createObjectURL(new Blob([text],{type})),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Downloaded '+name);}catch(e){status('Download unavailable in this environment. The share link remains available.');}}
$('search').addEventListener('input',()=>{state.query=$('search').value;state.reading='';render();});
for(const key of ['undated','inferred','labels','ego','mapLines'])if($(key))$(key).addEventListener('change',()=>{state[key]=$(key).checked;render();});
for(const key of ['year','charge','distance'])if($(key))$(key).addEventListener('input',()=>{state[key]=Number($(key).value);render();});
$('fit').addEventListener('click',fit);$('zoom-in').addEventListener('click',()=>{if(svg)svg.call(zoom.scaleBy,1.3);});$('zoom-out').addEventListener('click',()=>{if(svg)svg.call(zoom.scaleBy,1/1.3);});
$('reset').addEventListener('click',()=>{state=M.defaultState(data);pinned.clear();positions.clear();render();if(map)fitMap();status('Default view restored; graph pins cleared.');});
$('export-view').addEventListener('click',()=>download(data.meta.kind+'-view.json',M.exportView(data,state)));
$('export-data').addEventListener('click',()=>download(data.meta.kind+'-graph.json',JSON.stringify({meta:data.meta,nodes:data.nodes,edges:data.edges,scenarios:data.scenarios},null,2)));
$('export-csv').addEventListener('click',()=>{const quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';const rows=[['ID','Label','Type','Basis','Summary','Source'],...view.nodes.map(n=>[n.id,n.label,n.type,n.basis,n.summary,n.url||''])];download(data.meta.kind+'-visible-cards.csv',rows.map(r=>r.map(quote).join(',')).join('\r\n'),'text/csv');});
$('import-view').addEventListener('change',async ev=>{const file=ev.target.files[0];if(!file)return;try{if(file.size>30000)throw Error('View file is too large.');const next=M.importView(data,await file.text());state=next;render();status('Saved view restored. Manual graph positions and map zoom are session-only.');}catch(e){status('View was not changed: '+e.message);}ev.target.value='';});
$('share').addEventListener('click',()=>{const fragment='#view='+encodeURIComponent(M.exportView(data,state));$('share-link').value=location.href.split('#')[0]+fragment;try{history.replaceState(null,'',fragment);}catch(_){}$('share-link').focus();$('share-link').select();status('View link ready to copy. It preserves filters, reading and selection; graph positions and map zoom are session-only.');});
initMap();render();if(map)fitMap();
window.LibraryGraph={data,getState:()=>JSON.parse(JSON.stringify(state)),getView:()=>view};
})();
