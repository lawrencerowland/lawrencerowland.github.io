(function () {
  'use strict';
  const M = window.DependencyAtlas, D = M.data, $ = id => document.getElementById(id);
  const STORAGE = 'library.project-dependency-atlas.view.v1';
  const palette = ['#3c7280', '#756391', '#a67b30', '#a66242', '#4f7850', '#a65366'];
  const statusColors = { complete: '#47744d', active: '#347487', planned: '#9ca393', 'at-risk': '#a77623', delayed: '#aa4d40', milestone: '#79619a' };
  const interpretations = {
    pennine: {title:'A possible coordination bottleneck',text:'Design Integration touches 11 listed links, including six outgoing links into Build and Possession. Could separating permanent-works approval, temporary-works coordination and access-planning handoffs reduce coupling while preserving necessary dependencies? This graph is a starting point for that question.'},
    srp: {title:'A question about regulatory coupling',text:'The toy graph links ONR Safety Case to ALARP Demo, Tooling Design and Characterisation. Which assurance handoffs would need supporting evidence before being treated as delivery constraints? The picture does not establish actual approval conditions or the consequences of changing a link.'},
    portfolio: {title:'A possible capacity question',text:'Several activities share calendar dates. If those packages also require the same scarce cranes or subcontractor capacity, which overlaps warrant a sequencing discussion? Resource requirements, assignments and available capacity would be needed to establish a conflict.'},
    'pennine-tl': {title:'A question about signalling float',text:'The Signalling facet contains two activities marked at risk in the supplied example. If their interfaces or approvals slip, what consequences would follow for installation and possession? A linked schedule, baseline and float calculation would be needed to test that question; no float-consumption percentage is established here.'}
  };
  let state = M.defaultState();
  function element(tag, text, attrs = {}, parent) {
    const e = document.createElement(tag); if (text !== null && text !== undefined) e.textContent = text;
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v)); if (parent) parent.append(e); return e;
  }
  function svgElement(tag, attrs, parent, text) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs || {}).forEach(([k,v]) => e.setAttribute(k,v));
    if (text !== undefined) e.textContent = text; if (parent) parent.append(e); return e;
  }
  function text(id, value) { $(id).textContent = value; }
  function feedback(message = '', error = '') { text('status',message); text('error',error); }
  function metric(parent, value, label, sub) {
    const e = element('div', null, { class: 'metric' }, parent);
    element('strong', value, { class:'number' }, e); element('span',label,{class:'label'},e);
    if (sub) element('span',sub,{class:'sub'},e);
  }
  function options(select, rows, selected) {
    select.replaceChildren(); rows.forEach(([value,label]) => element('option',label,{value},select)); select.value = selected || '';
  }
  function legend(id, rows) {
    $(id).replaceChildren(); rows.forEach(([label,color]) => { const e = element('span',null,{},$(id)); const dot = element('i',null,{class:'swatch','aria-hidden':'true'},e); dot.style.background = color; e.append(document.createTextNode(label)); });
  }
  function original(id, scenario) { $(id).replaceChildren(); scenario.meta.forEach(m => { element('dt',m.label,{},$(id)); element('dd',`${m.value} · ${m.sub}`,{},$(id)); }); }
  function row(body, cells) { const tr = element('tr',null,{},body); cells.forEach(value => element('td',value,{},tr)); }
  function arc(radius,start,end) {
    const p = angle => [Math.sin(angle)*radius, -Math.cos(angle)*radius]; const a=p(start), b=p(end);
    return `M ${a[0]} ${a[1]} A ${radius} ${radius} 0 ${end-start>Math.PI?1:0} 1 ${b[0]} ${b[1]}`;
  }
  function bundleColor(group) { return palette[M.graph(D.bundles[state.bundle]).groups.findIndex(g => g.name === group) % palette.length]; }
  function nodeDetails(name, preview = false) {
    const panel = $('node-detail'); panel.replaceChildren();
    if (!name) { text('node-title','Trace a dependency'); element('p','Choose a node to see every explicitly listed incoming and outgoing handoff. The map does not calculate delay or a critical path.',{},panel); return; }
    const n = M.nodeDetail(D.bundles[state.bundle],name);
    text('node-title',name); element('p',`${n.group} group${preview ? ' · hover preview' : ''}`,{class:'hint'},panel);
    element('span',`${n.incident} incident`,{class:'small-stat'},panel); element('span',`${n.incoming.length} incoming`,{class:'small-stat'},panel); element('span',`${n.outgoing.length} outgoing`,{class:'small-stat'},panel);
    for (const [label, members, prefix] of [['Incoming · source → this node',n.incoming,'← '],['Outgoing · this node → target',n.outgoing,'→ ']]) {
      element('h3',label,{},panel); if (!members.length) element('p','None listed.',{class:'hint'},panel);
      else { const list=element('ul',null,{},panel); members.forEach(item=>element('li',prefix+item,{},list)); }
    }
    element('p','Lists and counts include all links, even when the map is filtered. Incident count describes connectedness only.',{class:'hint'},panel);
  }
  function highlightNode(name, preview = false) {
    const connected = new Set(name ? [name] : []);
    const g = M.graph(D.bundles[state.bundle]);
    g.edges.forEach(edge=>{if(edge.s===name||edge.t===name){connected.add(edge.s);connected.add(edge.t);}});
    $('bundle-chart').querySelectorAll('.bundle-edge').forEach(path=>{
      const yes = path.dataset.source===name || path.dataset.target===name;
      path.classList.toggle('connected',!!name&&yes); path.classList.toggle('faded',!!name&&!yes);
      path.setAttribute('stroke', name && yes ? (path.dataset.source===name ? '#346346' : '#a44b3d') : path.dataset.color);
    });
    $('bundle-chart').querySelectorAll('.bundle-node').forEach(node=>{
      node.classList.toggle('dimmed',!!name&&!connected.has(node.dataset.name)); node.classList.toggle('selected',node.dataset.name===name);
      node.setAttribute('aria-pressed',String(node.dataset.name===state.node));
    });
    nodeDetails(name,preview);
  }
  function selectNode(name) { state = M.validateState({...state,node:name||null}); $('node-select').value=state.node||''; highlightNode(state.node); }
  function renderBundle() {
    const scenario = D.bundles[state.bundle], summary=M.graphSummary(scenario), graph=M.graph(scenario), layout=M.radialLayout(scenario), edges=M.visibleEdges(scenario,state.links);
    $('bundle-example').value=state.bundle; $('link-filter').value=state.links;
    options($('node-select'),[['','No node selected'],...graph.nodes.map(n=>[n.name,`${n.group} · ${n.name}`])],state.node);
    text('bundle-title',`${scenario.title} · ${scenario.subtitle}`);
    const metrics=$('bundle-summary');metrics.replaceChildren();
    metric(metrics,summary.nodes,'Nodes in the full example',`${summary.groups} phase / gate groups`);
    metric(metrics,summary.edges,'Directed dependencies',`${summary.internal} within groups`);
    metric(metrics,summary.crossGroup,'Dependencies across groups','Explicitly listed links only');
    metric(metrics,summary.busiest[0].incident,'Most incident links',summary.busiest.map(n=>n.name).join(' · '));
    text('bundle-narrative-title',interpretations[state.bundle].title);text('bundle-narrative',interpretations[state.bundle].text);text('bundle-original-title',scenario.insight.title);text('bundle-original-narrative',scenario.insight.text);
    text('bundle-boundary','Node counts come from the graph. Proposed changes and implications remain questions. The exact original narrative is retained under Original scenario labels and wording.');
    original('bundle-original',scenario);
    const container=$('bundle-chart');container.replaceChildren();
    const svg=svgElement('svg',{viewBox:'-390 -350 780 700',role:'group','aria-label':`${scenario.title}: grouped dependency diagram`},container);
    svgElement('title',{},svg,`${scenario.subtitle}; select a node to trace incoming and outgoing links.`);
    const edgeLayer=svgElement('g',{'aria-hidden':'true'},svg);
    edges.forEach(edge=>{const col=edge.crossGroup?'#829180':bundleColor(edge.sourceGroup);svgElement('path',{d:M.bundledPath(M.hierarchyRoute(scenario,edge.s,edge.t)),class:'bundle-edge',stroke:col,'data-source':edge.s,'data-target':edge.t,'data-color':col},edgeLayer);});
    layout.groups.forEach(group=>{
      svgElement('path',{d:arc(210,group.start,group.end),fill:'none',stroke:bundleColor(group.name),'stroke-width':10,opacity:.2},svg);
      const x=Math.sin(group.angle)*182,y=-Math.cos(group.angle)*182;
      svgElement('text',{x,y,'text-anchor':'middle',class:'phase-label'},svg,group.name);
    });
    layout.nodes.forEach(node=>{
      const n=svgElement('g',{transform:`translate(${node.x} ${node.y})`,class:'bundle-node',tabindex:0,role:'button','aria-pressed':String(state.node===node.name),'aria-label':`${node.name}; ${node.group} group; select to trace dependencies`,'data-name':node.name},svg);
      const right=Math.sin(node.angle)>=0; const angle=node.angle*180/Math.PI-90; const rotate=right?angle:angle+180;
      svgElement('circle',{r:14,class:'hit'},n);svgElement('circle',{r:4.5,fill:bundleColor(node.group),class:'node-dot'},n);
      const label=svgElement('g',{transform:`rotate(${rotate})`},n);
      svgElement('text',{x:right?10:-10,y:4,'text-anchor':right?'start':'end'},label,node.name);
      n.addEventListener('mouseenter',()=>highlightNode(node.name,true)); n.addEventListener('mouseleave',()=>highlightNode(state.node));
      n.addEventListener('focus',()=>selectNode(node.name));n.addEventListener('click',()=>selectNode(node.name));
      n.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectNode(node.name);}if(event.key==='Escape'){event.preventDefault();selectNode(null);}});
    });
    legend('bundle-legend',[...graph.groups.map(g=>[g.name,bundleColor(g.name)]),['Selected: outgoing','#346346'],['Selected: incoming','#a44b3d']]);
    text('visible-links',`${edges.length} of ${summary.edges} dependencies displayed. Arrow direction is shown in the detail panel and table.`);
    $('edge-table').replaceChildren();edges.forEach(edge=>row($('edge-table'),[edge.s,edge.t,edge.crossGroup?`${edge.sourceGroup} → ${edge.targetGroup}`:`Within ${edge.sourceGroup}`]));
    highlightNode(state.node);
  }
  function taskDetails(id) {
    const panel=$('task-detail');panel.replaceChildren();const task=M.tasks(D.timelines[state.timeline]).find(t=>t.id===id);
    if(!task){text('task-title','Inspect a timeline item');element('p','Hover for a preview, or focus, click, tap or select an activity to retain its dates and supplied status here.',{},panel);return;}
    text('task-title',task.task);element('p',task.stream,{class:'hint'},panel);
    element('p',`${task.start} → ${task.end}`,{},panel);element('p',`${task.days} elapsed calendar days${task.milestone?' · milestone':''}`,{},panel);
    element('span',`Supplied status: ${task.status}`,{class:'small-stat'},panel);
    element('p','This status comes from the historical toy dataset. The dates do not establish current progress, slippage or available float.',{class:'hint'},panel);
  }
  function selectTask(id) {
    state=M.validateState({...state,task:id||null});$('task-select').value=state.task||'';
    $('timeline-chart').querySelectorAll('.timeline-item').forEach(item=>{item.classList.toggle('selected',item.dataset.id===state.task);item.setAttribute('aria-pressed',String(item.dataset.id===state.task));});taskDetails(state.task);
  }
  function renderTimeline() {
    const scenario=D.timelines[state.timeline],all=M.tasks(scenario),summary=M.timelineSummary(scenario),shown=all.filter(t=>state.status==='all'||t.status===state.status);
    $('timeline-example').value=state.timeline;$('status-filter').value=state.status;
    options($('task-select'),[['','No item selected'],...shown.map(t=>[t.id,`${t.stream} · ${t.task}`])],state.task);
    text('timeline-title',scenario.title);const metrics=$('timeline-summary');metrics.replaceChildren();
    metric(metrics,summary.items,'Items in the full example',`${summary.activities} activities · ${summary.milestones} milestones`);
    metric(metrics,summary.facets,'Timeline facets','Independent rows, shared scale');
    metric(metrics,summary.days,'Elapsed days in full extent',`${summary.start} → ${summary.end}`);
    metric(metrics,summary.overlaps.length,'Cross-facet overlapping pairs','Calendar intersections, not collisions');
    text('timeline-narrative-title',interpretations[state.timeline].title);text('timeline-narrative',interpretations[state.timeline].text);text('timeline-original-title',scenario.insight.title);text('timeline-original-narrative',scenario.insight.text);original('timeline-original',scenario);
    const chart=$('timeline-chart');chart.replaceChildren();
    const day=86400000,domainStart=M.dateValue(summary.start)-7*day,domainEnd=M.dateValue(summary.end)+7*day;
    const x=date=>260+(M.dateValue(date)-domainStart)/(domainEnd-domainStart)*590;
    const ticks=M.monthTicks(new Date(domainStart).toISOString().slice(0,10),new Date(domainEnd).toISOString().slice(0,10));
    scenario.streams.forEach(stream=>{
      const items=shown.filter(t=>t.stream===stream.name),height=78+Math.max(items.length,1)*32;
      const svg=svgElement('svg',{viewBox:`0 0 880 ${height}`,role:'group','aria-label':`${stream.name}; same date scale as other facets`},chart);
      svgElement('text',{x:10,y:22,class:'facet-title'},svg,stream.name);
      ticks.forEach(date=>{svgElement('line',{x1:x(date),x2:x(date),y1:34,y2:height-25,class:'time-grid'},svg);svgElement('text',{x:x(date)+3,y:height-7,class:'time-month'},svg,new Intl.DateTimeFormat('en-GB',{month:'short',year:'2-digit',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z')));});
      if(M.dateValue(D.sourceDate)>=domainStart&&M.dateValue(D.sourceDate)<=domainEnd){svgElement('line',{x1:x(D.sourceDate),x2:x(D.sourceDate),y1:34,y2:height-25,class:'source-line'},svg);svgElement('text',{x:x(D.sourceDate)+5,y:22,class:'source-label'},svg,'SOURCE · 25 MAR 2026');}
      if(!items.length)svgElement('text',{x:12,y:58,class:'time-label'},svg,'No items match this status.');
      items.forEach((task,index)=>{
        const y=50+index*32,start=x(task.start),end=x(task.end),g=svgElement('g',{class:'timeline-item',tabindex:0,role:'button','aria-label':`${task.task}, ${task.stream}, ${task.start} to ${task.end}, ${task.days} elapsed days, supplied status ${task.status}`,'aria-pressed':String(task.id===state.task),'data-id':task.id},svg);
        svgElement('rect',{x:0,y:y-12,width:875,height:29,class:'hit'},g);svgElement('text',{x:12,y:y+5,class:'time-label'},g,task.task);
        if(task.milestone){svgElement('path',{d:`M ${start} ${y-8} L ${start+7} ${y} L ${start} ${y+8} L ${start-7} ${y} Z`,fill:statusColors.milestone,class:'diamond'},g);}
        else svgElement('rect',{x:start,y:y-8,width:Math.max(2,end-start),height:17,rx:3,fill:statusColors[task.status],opacity:task.status==='planned'?.65:.85,class:'bar'},g);
        svgElement('title',{},g,`${task.task}: ${task.start} → ${task.end}; ${task.days} elapsed days; ${task.status}`);
        g.addEventListener('mouseenter',()=>taskDetails(task.id));g.addEventListener('mouseleave',()=>taskDetails(state.task));g.addEventListener('focus',()=>selectTask(task.id));g.addEventListener('click',()=>selectTask(task.id));
        g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectTask(task.id);}if(event.key==='Escape'){event.preventDefault();selectTask(null);}});
      });
    });
    legend('timeline-legend',Object.entries(statusColors));text('visible-items',`${shown.length} of ${all.length} items displayed. Dates, counts and overlap comparisons retain the full example extent.`);
    $('task-table').replaceChildren();shown.forEach(t=>row($('task-table'),[t.stream,t.task,t.start,t.end,t.days,t.status]));
    const byId=new Map(all.map(t=>[t.id,t]));$('overlap-table').replaceChildren();summary.overlaps.forEach(o=>{const a=byId.get(o.a),b=byId.get(o.b);row($('overlap-table'),[`${a.stream} · ${a.task}`,`${b.stream} · ${b.task}`,o.start,o.end,o.days]);});
    selectTask(state.task);
  }
  function setView(view, focus=false) {
    state=M.validateState({...state,view});document.querySelectorAll('[data-view]').forEach(tab=>{const selected=tab.dataset.view===view;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
    $('bundle').hidden=view!=='bundle';$('timeline').hidden=view!=='timeline';if(focus)$('tab-'+view).focus();
  }
  function render(){renderBundle();renderTimeline();setView(state.view);}
  const tabs=[...document.querySelectorAll('[data-view]')];tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>setView(tab.dataset.view));tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setView(tabs[next].dataset.view,true);});
  });
  $('bundle-example').addEventListener('change',event=>{state=M.validateState({...state,bundle:event.target.value,node:null});renderBundle();feedback('Dependency example changed.');});
  $('link-filter').addEventListener('change',event=>{state=M.validateState({...state,links:event.target.value});renderBundle();feedback('Displayed links filtered. Full graph counts are unchanged.');});
  $('node-select').addEventListener('change',event=>selectNode(event.target.value));$('clear-node').addEventListener('click',()=>selectNode(null));
  $('timeline-example').addEventListener('change',event=>{state=M.validateState({...state,timeline:event.target.value,task:null});renderTimeline();feedback('Timeline example changed.');});
  $('status-filter').addEventListener('change',event=>{state=M.validateState({...state,status:event.target.value,task:null});renderTimeline();feedback('Displayed items filtered. Full date scale and comparisons are unchanged.');});
  $('task-select').addEventListener('change',event=>selectTask(event.target.value));
  $('enlarge-diagram').addEventListener('click',()=>{const expanded=$('bundle-chart').classList.toggle('expanded');$('enlarge-diagram').setAttribute('aria-pressed',String(expanded));text('enlarge-diagram',expanded?'Fit diagram to screen':'Enlarge diagram');});
  $('reset').addEventListener('click',()=>{state=M.defaultState();$('bundle-chart').classList.remove('expanded');$('enlarge-diagram').setAttribute('aria-pressed','false');text('enlarge-diagram','Enlarge diagram');render();feedback('Default view restored. Any saved view is unchanged.');});
  $('save').addEventListener('click',()=>{try{localStorage.setItem(STORAGE,M.serializeState(state));feedback('View saved in this browser.');}catch(error){feedback('','Could not save this view: '+error.message);}});
  $('load').addEventListener('click',()=>{try{const raw=localStorage.getItem(STORAGE);if(raw===null){feedback('No saved view in this browser.');return;}const parsed=M.parseState(raw);state=parsed;render();feedback('Saved view loaded.');}catch(error){feedback('','Could not load the saved view; current view and saved bytes are unchanged. '+error.message);}});
  function showTransfer(value){$('transfer').hidden=false;$('view-json').value=value;text('transfer-error','');$('view-json').focus();}
  function download(filename,content){const blob=new Blob([content],{type:'application/json'});const url=URL.createObjectURL(blob);const a=element('a',null,{href:url,download:filename},document.body);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('export').addEventListener('click',()=>{const json=M.serializeState(state);showTransfer(json);try{download('project-dependency-atlas-view.json',json);feedback('View file prepared for download; the same JSON is available above.');}catch(error){feedback('','Download unavailable. Copy the view JSON shown above.');}});
  $('import').addEventListener('click',()=>showTransfer(''));
  $('apply-view').addEventListener('click',()=>{try{const parsed=M.parseState($('view-json').value);state=parsed;render();text('transfer-error','');feedback('Validated view applied. Use Save view locally to retain it in this browser.');}catch(error){text('transfer-error','View was not changed. '+error.message);}});
  $('close-transfer').addEventListener('click',()=>{$('transfer').hidden=true;$('import').focus();});
  $('export-data').addEventListener('click',()=>{try{download('project-dependency-atlas-example-data.json',JSON.stringify({app:'project-dependency-atlas',version:1,kind:'reference-data',sourceCommit:'8221f32b398d582801e639b5460aa674805f1671',sourceDate:D.sourceDate,note:'Historical illustrative datasets. Supplied narratives and metadata are not computed results.',bundles:D.bundles,timelines:D.timelines},null,2));feedback('All four example datasets and original narrative labels prepared for download.');}catch(error){feedback('','Could not prepare the data download: '+error.message);}});
  try{render();}catch(error){feedback('','The Atlas could not render: '+error.message);}
})();
