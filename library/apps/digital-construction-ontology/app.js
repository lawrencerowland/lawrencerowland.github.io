/* Native controls, one canonical case dataset, and a local D3 diagram. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id), M = window.OntologyModel, DATA = window.OntologyData;
  const palette = ['#287c8e','#a46122','#6b64a5','#4b865a','#b55173','#428d9c','#8b7136','#8053a1'];
  let graph, shown, selected = null, selectedEdge = null, positions = new Map(), scene, nodeSelection, linkSelection, textSelection, simulationNodes = [], simulationLinks = [], allTriples = [], color;
  const svg = window.d3 ? d3.select('#graph') : null;
  const zoom = svg ? d3.zoom().extent([[0,0],[900,560]]).scaleExtent([.1,5]).on('zoom', event => scene && scene.attr('transform',event.transform)) : null;
  if (svg) { svg.call(zoom); svg.on('dblclick.zoom',null); } else { $('graph').hidden=true; const fallback=document.createElement('p'); fallback.textContent='The diagram is unavailable. Use the node cards and inspector to explore every connection.'; document.querySelector('.graph-wrap').append(fallback); ['fit','zoom-in','zoom-out','reset-layout','unpin','download-svg'].forEach(id=>$(id).disabled=true); }
  const el = (tag, text, cls) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (cls) node.className = cls; return node; };
  const addLink = (parent, url, text) => { const a = el('a',text || url); a.href = url; a.target = '_blank'; a.rel = 'noopener'; parent.append(a); return a; };
  function status(message) { $('status').textContent = message; }
  function options() {
    return {query:$('search').value, types:[...document.querySelectorAll('#type-filters input:checked')].map(c => c.value), includeNeighbours:$('include-neighbours').checked, kind:$('relation-kind').value, focus:$('focus-neighbours').checked ? selected : null};
  }
  function switchCase(id, updateHash = true) {
    if (!DATA.cases[id]) id = 'modules';
    graph = DATA.cases[id]; selected = null; selectedEdge = null; positions = new Map();
    const errors = M.validate(graph); if (errors.length) throw new Error(errors.join('; '));
    document.querySelectorAll('[data-case]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.case === id)));
    $('case-title').textContent = graph.title; $('case-summary').textContent = graph.summary; $('case-boundary').textContent = graph.boundary;
    $('search').value = ''; $('focus-neighbours').checked = false; $('relation-kind').value = '';
    $('relation-label').hidden = id !== 'modules'; $('rdf-panel').hidden = id !== 'hs2'; $('reading-note').textContent = '';
    $('corrections').replaceChildren(...graph.corrections.map(c => el('li',c)));
    $('source-note').replaceChildren(el('span','Reviewed 3 October 2026. Original public example: ')); addLink($('source-note'),graph.source.url,graph.source.file);
    const types = [...new Set(graph.nodes.map(n => n.type))]; color = new Map(types.map((t,i) => [t,palette[i % palette.length]]));
    $('type-filters').replaceChildren(...types.map(type => {
      const label = el('label'), input = el('input'), swatch = el('span',undefined,'swatch'); input.type = 'checkbox'; input.value = type; input.checked = true; swatch.style.background = color.get(type); input.addEventListener('change',render); label.append(input,swatch,el('span',type)); return label;
    }));
    $('readings').replaceChildren(...graph.readings.map(reading => { const button = el('button',reading.title);button.addEventListener('click',() => {
      clearFilters(false); selected = reading.start; $('focus-neighbours').checked = true; $('reading-note').textContent = reading.text; render(); renderInspector();
    }); return button; }));
    if (id === 'hs2') { $('triple-search').value=''; $('selected-triples').checked=false; allTriples = M.triples(graph); $('turtle-text').textContent = M.turtle(graph); renderTriples(); }
    render(); renderInspector();
    if (updateHash && location.hash !== '#' + id) history.replaceState(null,'','#'+id);
    status('Showing ' + graph.title + '.');
  }
  function clearFilters(doRender = true) {
    $('search').value=''; $('relation-kind').value=''; $('focus-neighbours').checked=false;
    document.querySelectorAll('#type-filters input').forEach(input => {input.checked=true;});
    if (doRender) render();
  }
  function render() {
    shown = M.filter(graph, options());
    if (selected && !shown.nodes.some(n => n.id === selected)) { selected=null; $('focus-neighbours').checked=false; selectedEdge=null; shown=M.filter(graph,options()); renderInspector(); }
    $('stats').textContent=`${shown.nodes.length} of ${graph.nodes.length} nodes · ${shown.links.length} of ${graph.links.length} connections`;
    $('card-count').textContent=`${shown.nodes.length} cards`;
    $('empty').hidden=shown.nodes.length>0;
    renderCards(); renderGraph();
  }
  function renderCards() {
    const activeCard=document.activeElement?.closest('[data-node]')?.dataset.node;
    $('cards').replaceChildren(...shown.nodes.map(n => {
      const button=el('button',undefined,'node-card'); button.dataset.node=n.id; button.setAttribute('aria-pressed',String(n.id===selected));
      if ($('search').value.trim() && shown.matches.has(n.id)) button.classList.add('match');
      button.append(el('strong',n.label),el('span',n.type+' · '+n.degree+' connections'),el('span',(n.description || n.evidenceStatus || '').slice(0,140)));
      button.addEventListener('click',() => selectNode(n.id)); return button;
    }));
    if(activeCard)[...$('cards').querySelectorAll('[data-node]')].find(button=>button.dataset.node===activeCard)?.focus({preventScroll:true});
  }
  function selectNode(id) {
    selected = id; selectedEdge=null;
    if ($('focus-neighbours').checked) render(); else { renderCards(); highlight(); }
    renderInspector();
  }
  function clearSelection() { selected=null;selectedEdge=null;$('focus-neighbours').checked=false;render();renderInspector(); }
  function renderInspector() {
    if(graph.id==='hs2')renderTriples();
    const box=$('inspector'); box.replaceChildren();
    if (selectedEdge) {
      const edge=graph.links.find(e=>e.id===selectedEdge), s=graph.nodes.find(n=>n.id===M.endpoint(edge.source)), t=graph.nodes.find(n=>n.id===M.endpoint(edge.target));
      box.append(el('h3',edge.label),el('p',s.label+' → '+t.label),el('p',edge.rationale));
      if(edge.predicate || edge.iri) box.append(el('code',edge.predicate || edge.iri));
      if(edge.legacyPredicate && edge.legacyPredicate!==(edge.predicate || edge.iri)) box.append(el('p','Original mapping: '+edge.legacyPredicate,'small'));
      if(edge.validFrom) box.append(el('p','Applies from '+edge.validFrom));
      if(edge.evidence) addLink(box,edge.evidence,'Relationship source');
      return;
    }
    const n=graph.nodes.find(n=>n.id===selected);
    if(!n) {box.append(el('p','Choose a node, a card or a suggested starting point. Every connection can be inspected here without reading the diagram.'),el('p',graph.boundary,'small')); return;}
    box.append(el('span',n.type,'tag'),el('h3',n.label),el('p',n.description || 'A node in the selected case.'));
    if(n.evidenceStatus) box.append(el('p',n.evidenceStatus,'boundary'));
    if(n.modellingNote)box.append(el('p',n.modellingNote,'small'));
    const facts=el('dl',undefined,'facts');
    [['Identifier',n.id],['Class',n.rdfType || n.ontologyClass],['URI',n.uri],['Connections',n.degree],['Aliases',(n.aliases || []).join(', ')],['Package',n.contractPackage],['Award',n.award],['Reference',n.refId]].forEach(([key,value])=>{if(value!==undefined && value!=='')facts.append(el('dt',key),el('dd',String(value)));});box.append(facts);
    const pin=el('button',positions.get(n.id)?.pinned?'Unpin node':'Pin node');pin.disabled=!positions.has(n.id);pin.addEventListener('click',()=>{const p=positions.get(n.id);if(p){p.pinned=!p.pinned;renderInspector();status((p.pinned?'Pinned ':'Unpinned ')+n.label);}});box.append(pin);
    if(n.url){box.append(el('p'));addLink(box,n.url,'Open documentation');}
    if(graph.id==='hs2'){
      const roles=M.roles(graph,n.id);box.append(el('h4','Roles carried by this node'));
      if(!roles.length)box.append(el('p','No outgoing hasRole relation.','small'));
      else roles.forEach(role=>{const button=el('button',role.label);button.addEventListener('click',()=>revealNode(role.id));box.append(button);});
    }
    box.append(el('h4','All connections'));
    const list=el('ul',undefined,'connections');
    graph.links.filter(e=>M.endpoint(e.source)===n.id || M.endpoint(e.target)===n.id).forEach(edge=>{
      const outgoing=M.endpoint(edge.source)===n.id, otherId=M.endpoint(outgoing?edge.target:edge.source), other=graph.nodes.find(x=>x.id===otherId), li=el('li');
      const button=el('button',`${outgoing?'→':'←'} ${edge.label}: ${other.label}`);button.addEventListener('click',()=>revealNode(otherId));
      li.append(button,el('div',edge.predicate || edge.iri || edge.kind,'small'),el('div',edge.rationale,'small'));
      if(edge.validFrom)li.append(el('div','Applies from '+edge.validFrom,'small'));
      if(edge.legacyPredicate && edge.legacyPredicate!==edge.predicate)li.append(el('div','Original mapping: '+edge.legacyPredicate,'small'));
      if(edge.evidence)addLink(li,edge.evidence,'Relation source');list.append(li);
    });box.append(list);
    const sources=el('ul',undefined,'sources');(n.sources || []).forEach(url=>{const li=el('li');addLink(li,url);sources.append(li);});
    box.append(el('h4','Sources'),sources);
    if(n.legacy){const details=el('details'),summary=el('summary','Original values retained for comparison');details.append(summary,el('pre',JSON.stringify(n.legacy,null,2)));box.append(details);}
  }
  function revealNode(id){clearFilters(false);selected=id;render();renderInspector();}
  function renderGraph() {
    if(!svg){status('The diagram library did not load. Cards, details, filters and data exports remain available.');return;}
    svg.selectAll('*').remove();svg.append('title').attr('id','svg-title').text(graph.title);svg.append('desc').attr('id','svg-desc').text('Directed connections. The node cards and inspector below provide the same content.');
    svg.append('defs').append('marker').attr('id','arrow').attr('viewBox','0 -5 10 10').attr('refX',24).attr('refY',0).attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto').append('path').attr('d','M0,-5L10,0L0,5').attr('fill','#728d87');
    scene=svg.append('g');
    simulationNodes=shown.nodes.map(n=>{const p=positions.get(n.id);return {...n,...(p?{x:p.x,y:p.y,fx:p.pinned?p.x:null,fy:p.pinned?p.y:null}:{})};});
    simulationLinks=shown.links.map(e=>({...e,source:M.endpoint(e.source),target:M.endpoint(e.target)}));
    // Settle once: a deterministic layout respects reduced-motion users and never mutates the canonical data.
    const simulation=d3.forceSimulation(simulationNodes).force('link',d3.forceLink(simulationLinks).id(n=>n.id).distance(graph.id==='hs2'?88:120)).force('charge',d3.forceManyBody().strength(-370)).force('center',d3.forceCenter(450,280)).force('collide',d3.forceCollide().radius(36)).stop();simulation.tick(200);
    simulationNodes.forEach(n=>positions.set(n.id,{x:n.x,y:n.y,pinned:Boolean(n.fx!==null && n.fx!==undefined)}));
    linkSelection=scene.append('g').selectAll('line').data(simulationLinks).join('line').attr('class',e=>'graph-link '+e.kind).attr('marker-end','url(#arrow)').on('click',(event,e)=>{event.stopPropagation();selectedEdge=e.id;selected=null;highlight();renderCards();renderInspector();});linkSelection.append('title').text(e=>e.label+' — '+e.rationale);
    textSelection=scene.append('g').selectAll('text').data(simulationLinks).join('text').attr('class','edge-text').attr('text-anchor','middle').text(e=>e.label).style('display',$('edge-labels').checked?null:'none');
    nodeSelection=scene.append('g').selectAll('g').data(simulationNodes).join('g').attr('class','graph-node').attr('tabindex',0).attr('role','button').attr('aria-label',n=>n.label+', '+n.type+'. Select for details.').on('click',(event,n)=>{event.stopPropagation();selectNode(n.id);}).on('mouseenter',(event,n)=>highlight(n.id)).on('mouseleave',()=>highlight()).on('keydown',(event,n)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectNode(n.id);}}).call(d3.drag().on('drag',(event,n)=>{n.x=event.x;n.y=event.y;positions.set(n.id,{x:n.x,y:n.y,pinned:true});tick();}).on('end',()=>renderInspector()));
    nodeSelection.append('circle').attr('r',n=>8+Math.min(11,Math.sqrt(n.degree)*2)).attr('fill',n=>color.get(n.type)).attr('stroke','#fff').attr('stroke-width',2);
    nodeSelection.append('text').attr('x',17).attr('y',4).text(n=>n.label.length>30?n.label.slice(0,28)+'…':n.label).style('display',$('show-labels').checked?null:'none');
    nodeSelection.append('title').text(n=>n.label+'\n'+(n.description || n.evidenceStatus || ''));
    svg.on('click',event=>{if(event.target===$('graph'))clearSelection();});
    tick();highlight();fit();
  }
  function tick(){linkSelection.attr('x1',e=>e.source.x).attr('y1',e=>e.source.y).attr('x2',e=>e.target.x).attr('y2',e=>e.target.y);nodeSelection.attr('transform',n=>`translate(${n.x},${n.y})`);textSelection.attr('x',e=>(e.source.x+e.target.x)/2).attr('y',e=>(e.source.y+e.target.y)/2-4);}
  function highlight(hovered){if(!nodeSelection)return;const focus=hovered || selected,nearby=focus?M.neighbours(graph,focus):null;nodeSelection.classed('selected',n=>n.id===selected).classed('dim',n=>nearby && !nearby.has(n.id));linkSelection.classed('dim',e=>focus && M.endpoint(e.source)!==focus && M.endpoint(e.target)!==focus);}
  function fit(){if(!svg || !simulationNodes.length)return;const xs=simulationNodes.map(n=>n.x),ys=simulationNodes.map(n=>n.y),minX=Math.min(...xs)-25,maxX=Math.max(...xs)+170,minY=Math.min(...ys)-25,maxY=Math.max(...ys)+25;const scale=Math.min(1.6,840/(maxX-minX),490/(maxY-minY));svg.call(zoom.transform,d3.zoomIdentity.translate(450-(minX+maxX)/2*scale,280-(minY+maxY)/2*scale).scale(scale));}
  function renderTriples(){if(graph.id!=='hs2')return;const q=$('triple-search').value.toLowerCase(),node=graph.nodes.find(n=>n.id===selected);const rows=allTriples.filter(t=>(!$('selected-triples').checked || (node && (t.s===node.uri || t.oType==='uri' && t.o===node.uri))) && [t.s,t.p,t.o,M.qname(t.s),M.qname(t.p),M.qname(t.o)].join(' ').toLowerCase().includes(q));$('triple-count').textContent=`${rows.length} of ${allTriples.length} triples`;$('triples').replaceChildren(...rows.map(t=>{const tr=el('tr');tr.append(el('td',M.qname(t.s)),el('td',M.qname(t.p)),el('td',t.oType==='uri'?M.qname(t.o):'“'+t.o+'”'));return tr;}));}
  function download(name,body,type){const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Downloaded '+name+'.');}
  $('search').addEventListener('input',render);$('search').addEventListener('keydown',event=>{if(event.key==='Enter'){const id=[...shown.matches][0];if(id)selectNode(id);}});
  ['include-neighbours','relation-kind','focus-neighbours'].forEach(id=>$(id).addEventListener('change',render));
  $('show-labels').addEventListener('change',()=>{if(nodeSelection)nodeSelection.selectAll('text').style('display',$('show-labels').checked?null:'none');});
  $('edge-labels').addEventListener('change',()=>{if(textSelection)textSelection.style('display',$('edge-labels').checked?null:'none');});
  $('clear-filters').addEventListener('click',()=>clearFilters());$('clear-selection').addEventListener('click',clearSelection);$('fit').addEventListener('click',fit);
  $('zoom-in').addEventListener('click',()=>svg && svg.call(zoom.scaleBy,1.3));$('zoom-out').addEventListener('click',()=>svg && svg.call(zoom.scaleBy,1/1.3));
  $('reset-layout').addEventListener('click',()=>{positions=new Map();renderGraph();status('Layout reset; pins cleared.');});
  $('unpin').addEventListener('click',()=>{positions.forEach(p=>{p.pinned=false;});renderInspector();status('All node positions unpinned.');});
  $('download-json').addEventListener('click',()=>download('digital-construction-'+graph.id+'.json',JSON.stringify(graph,null,2),'application/json'));
  $('download-csv').addEventListener('click',()=>download('digital-construction-'+graph.id+'-nodes.csv',M.csv(graph),'text/csv;charset=utf-8'));
  $('download-svg').addEventListener('click',()=>{const clone=$('graph').cloneNode(true);clone.setAttribute('xmlns','http://www.w3.org/2000/svg');const style=document.createElementNS('http://www.w3.org/2000/svg','style');style.textContent='.graph-node text{font:12px system-ui;fill:#142f34;paint-order:stroke;stroke:#f7faf9;stroke-width:4px}.graph-link{stroke:#839d99;stroke-width:1.4px;fill:none}.graph-link.model,.graph-link.catalogue,.graph-link.alignment{stroke-dasharray:5 4}.edge-text{font:10px system-ui;fill:#536c68}.dim{opacity:.18}.selected circle{stroke:#111;stroke-width:3.5px}';clone.prepend(style);download('digital-construction-'+graph.id+'.svg',new XMLSerializer().serializeToString(clone),'image/svg+xml');});
  $('download-ttl').addEventListener('click',()=>download('hs2-editorial-snapshot.ttl',M.turtle(graph),'text/turtle;charset=utf-8'));
  $('download-triples').addEventListener('click',()=>download('hs2-editorial-triples.json',JSON.stringify(allTriples,null,2),'application/json'));
  $('copy-ttl').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(M.turtle(graph));status('Copied the full HS2 Turtle dataset.');}catch{status('Clipboard unavailable. Use Download full Turtle or select the complete Turtle text.');}});
  ['triple-search','selected-triples'].forEach(id=>$(id).addEventListener(id==='triple-search'?'input':'change',renderTriples));
  $('reset-triples').addEventListener('click',()=>{$('triple-search').value='';$('selected-triples').checked=false;renderTriples();});
  document.querySelectorAll('[data-case]').forEach(button=>button.addEventListener('click',()=>switchCase(button.dataset.case)));
  window.addEventListener('hashchange',()=>switchCase(location.hash.slice(1),false));
  document.addEventListener('keydown',event=>{if(/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;if(event.key==='Escape')clearSelection();if(event.key.toLowerCase()==='f')fit();});
  switchCase(location.hash.slice(1) || 'modules',false);
})();
