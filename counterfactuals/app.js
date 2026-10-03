(function () {
  'use strict';
  const M=window.CausalLab, $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=(x,n=2)=>Number(x).toLocaleString('en-GB',{minimumFractionDigits:n,maximumFractionDigits:n});
  const setLabel=z=>z.length?'{ '+z.join(', ')+' }':'∅ (empty set)';
  let activeMode=location.hash==='#policies'?'policies':'paths';
  function mode() {
    if(location.hash==='#policies'||location.hash==='#paths')activeMode=location.hash.slice(1);
    const active=activeMode;
    for(const id of ['paths','policies']) $(id).hidden=id!==active;
    document.querySelectorAll('[data-mode]').forEach(a=>{if(a.dataset.mode===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  }
  window.addEventListener('hashchange',()=>{mode();if(location.hash==='#paths'||location.hash==='#policies')$(activeMode+'-title').focus();});mode();
  let state=M.example(),conditioned=[],marks={items:[]};
  function graph(){return M.graph(state.nodes,state.edges);}
  function selectors() {
    for(const id of ['edge-from','edge-to','cause','outcome','node-delete']) {
      const select=$(id),keep=id==='cause'?state.x:id==='outcome'?state.y:select.value;
      select.replaceChildren(...state.nodes.map(n=>new Option(n.id,n.id)));if(state.nodes.some(n=>n.id===keep))select.value=keep;
    }
    state.x=$('cause').value;state.y=$('outcome').value;
    for(const n of state.nodes) if(n.id===state.x||n.id===state.y)n.observed=true;
    conditioned=conditioned.filter(id=>id!==state.x&&id!==state.y&&state.nodes.some(n=>n.id===id&&n.observed));
    $('edge-delete').replaceChildren(...state.edges.map(([a,b],i)=>new Option(a+' → '+b,String(i))));
    $('delete-edge').disabled=!state.edges.length;
    $('conditioning').replaceChildren(...state.nodes.map(n=>{
      const row=document.createElement('div');row.className='variable-row';
      const name=document.createElement('span');name.textContent=n.id;row.append(name);
      for(const kind of ['observed','condition']) {
        const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=kind==='observed'?n.observed:conditioned.includes(n.id);
        const endpoint=n.id===state.x||n.id===state.y;input.disabled=endpoint||(kind==='condition'&&!n.observed);input.setAttribute('aria-label',(kind==='observed'?'Observed: ':'Condition on: ')+n.id);
        input.addEventListener('change',()=>{const focusLabel=input.getAttribute('aria-label');if(kind==='observed')n.observed=input.checked;else conditioned=input.checked?[...conditioned,n.id]:conditioned.filter(x=>x!==n.id);selectors();analyse();[...$('conditioning').querySelectorAll('input')].find(el=>el.getAttribute('aria-label')===focusLabel)?.focus();});
        label.append(input,document.createTextNode(kind==='observed'?'Observed':'Condition'));row.append(label);
      } return row;
    }));
  }
  function mutate(fn) {try{fn();selectors();analyse();$('graph-error').textContent='';}catch(e){$('graph-error').textContent=e.message;}}
  $('node-form').addEventListener('submit',e=>{e.preventDefault();mutate(()=>{const id=$('new-variable').value.trim(),nodes=[...state.nodes,{id,observed:true,x:100+(state.nodes.length%3)*250,y:60+Math.floor(state.nodes.length/3)*85}];M.graph(nodes,state.edges);state.nodes=nodes;$('new-variable').value='';});});
  $('edge-form').addEventListener('submit',e=>{e.preventDefault();mutate(()=>{const edges=[...state.edges,[$('edge-from').value,$('edge-to').value]];M.graph(state.nodes,edges);state.edges=edges;});});
  $('delete-edge').addEventListener('click',()=>mutate(()=>state.edges.splice(Number($('edge-delete').value),1)));
  $('delete-node').addEventListener('click',()=>mutate(()=>{const id=$('node-delete').value;state.nodes=state.nodes.filter(n=>n.id!==id);state.edges=state.edges.filter(e=>!e.includes(id));}));
  $('load-example').addEventListener('click',()=>mutate(()=>{state=M.example($('graph-example').value);conditioned=[];}));
  $('clear-graph').addEventListener('click',()=>mutate(()=>{state={nodes:[],edges:[],x:'',y:''};conditioned=[];}));
  for(const id of ['cause','outcome']) $(id).addEventListener('change',()=>{state.x=$('cause').value;state.y=$('outcome').value;selectors();analyse();});
  $('analyse').addEventListener('click',analyse);
  function analyse() {
    if(!state.x||!state.y||state.x===state.y) {$('graph-result').textContent='Choose two different variables as cause and outcome.';marks={items:[]};$('path-list').replaceChildren();drawGraph();return;}
    const g=graph(),sets=M.adjustmentSets(g,state.x,state.y),chosen=M.backdoor(g,state.x,state.y,conditioned);marks=M.paths(g,state.x,state.y,conditioned);
    $('graph-result').innerHTML='<h3>'+esc(state.x)+' → '+esc(state.y)+'</h3><p><strong>'+ (chosen.valid?'Selected set passes the back-door criterion.':'Selected set does not pass the back-door criterion.')+'</strong> '+esc(setLabel(conditioned))+'</p>'+chosen.reasons.map(r=>'<p>'+esc(r)+'</p>').join('')+'<p><strong>Inclusion-minimal observed sets</strong></p>'+(sets.length?'<div class="set-options">'+sets.map((z,i)=>'<button data-set="'+i+'">Use '+esc(setLabel(z))+'</button>').join('')+'</div>':'<p>No observed set passes this sufficient criterion for the assumed graph.</p>')+'<p class="note">This checks a graphical condition for estimating the total effect, not an effect size. The cause and outcome are treated as observed. '+(marks.truncated?'Only the first 200 paths are displayed below; the adjustment calculation still tests the whole graph.':'All '+marks.items.length+' connecting paths are listed below.')+'</p>';
    $('graph-result').querySelectorAll('[data-set]').forEach(b=>b.addEventListener('click',()=>{conditioned=[...sets[Number(b.dataset.set)]];selectors();analyse();}));
    $('path-list').innerHTML=marks.items.length?'<ol>'+marks.items.map(p=>'<li><strong>'+esc(p.kind)+' · '+(p.open?'open':'blocked')+'</strong><br><span class="path-text">'+p.nodes.map((n,i)=>esc(n)+(i<p.nodes.length-1?(g.edges.some(([a,b])=>a===n&&b===p.nodes[i+1])?' → ':' ← '):'')).join('')+'</span>'+(p.colliders.length?'<br><small>Collider on this path: '+esc(p.colliders.join(', '))+'</small>':'')+'</li>').join('')+'</ol>':'<p>No connecting path.</p>';
    drawGraph();
  }
  const NS='http://www.w3.org/2000/svg';
  function svgElement(tag,attrs,text) {const e=document.createElementNS(NS,tag);Object.entries(attrs||{}).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;return e;}
  function drawGraph() {
    const svg=$('dag');svg.replaceChildren();const defs=svgElement('defs'),marker=svgElement('marker',{id:'arrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:6,markerHeight:6,orient:'auto-start-reverse'});marker.append(svgElement('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:'context-stroke'}));defs.append(marker);svg.append(defs);
    const pathEdges=kind=>marks.items.filter(p=>p.kind===kind).flatMap(p=>p.nodes.slice(1).map((n,i)=>[p.nodes[i],n]));
    const causal=pathEdges('directed'),back=pathEdges('back-door'),colliders=new Set(marks.items.flatMap(p=>p.colliders));
    state.edges.forEach(([a,b],i)=>{
      const p=state.nodes.find(n=>n.id===a),q=state.nodes.find(n=>n.id===b),dx=q.x-p.x,dy=q.y-p.y;
      const edgePoint=(n,sign)=>{const factor=Math.min(Math.abs(dx)>0?92/Math.abs(dx):Infinity,Math.abs(dy)>0?25/Math.abs(dy):Infinity,.45);return [n.x+sign*dx*factor,n.y+sign*dy*factor];};
      const start=edgePoint(p,1),end=edgePoint(q,-1),cls=causal.some(e=>e[0]===a&&e[1]===b)?'causal':back.some(e=>e.includes(a)&&e.includes(b))?'backdoor':'';
      const line=svgElement('path',{d:`M${start[0]},${start[1]} L${end[0]},${end[1]}`,class:'edge '+cls,tabindex:0,role:'button','aria-label':a+' to '+b+'. Press Delete to remove.', 'marker-end':'url(#arrow)'});
      line.addEventListener('click',()=>{$('edge-delete').value=String(i);line.focus();});line.addEventListener('keydown',e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();mutate(()=>state.edges.splice(i,1));$('edge-delete').focus();}});svg.append(line);
    });
    for(const n of state.nodes) {
      const g=svgElement('g',{transform:`translate(${n.x},${n.y})`,class:'node'+(colliders.has(n.id)?' collider':'')+(conditioned.includes(n.id)?' conditioned':'')+(!n.observed?' unobserved':''),tabindex:0,role:'button','aria-label':n.id+'. Drag or use arrow keys to move.'});
      g.append(svgElement('rect',{x:-92,y:-25,width:184,height:50,rx:9}));if(conditioned.includes(n.id))g.append(svgElement('rect',{x:-87,y:-20,width:174,height:40,rx:6,class:'inner'}));
      const text=svgElement('text',{'text-anchor':'middle',y:5});text.textContent=n.id.length>25?n.id.slice(0,23)+'…':n.id;g.append(text,svgElement('title',{},n.id));
      g.addEventListener('keydown',e=>{const moves={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]};if(moves[e.key]){e.preventDefault();n.x=Math.max(95,Math.min(685,n.x+moves[e.key][0]));n.y=Math.max(30,Math.min(340,n.y+moves[e.key][1]));drawGraph();const moved=[...svg.querySelectorAll('.node')].find(el=>el.getAttribute('aria-label').startsWith(n.id+'.'));moved.focus();}});
      g.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();g.setPointerCapture(e.pointerId);const rect=svg.getBoundingClientRect(),startX=e.clientX,startY=e.clientY,x=n.x,y=n.y;
        const move=event=>{n.x=Math.max(95,Math.min(685,x+(event.clientX-startX)*780/rect.width));n.y=Math.max(30,Math.min(340,y+(event.clientY-startY)*370/rect.height));g.setAttribute('transform',`translate(${n.x},${n.y})`);};
        const end=()=>{g.removeEventListener('pointermove',move);g.removeEventListener('pointerup',end);g.removeEventListener('pointercancel',end);drawGraph();};g.addEventListener('pointermove',move);g.addEventListener('pointerup',end);g.addEventListener('pointercancel',end);
      });svg.append(g);
    }
  }
  selectors();analyse();
  let data=M.synthetic(),model=M.fit(data),dataName='Original synthetic sample (seed 42)',current=null;
  function installData(next,name) {const nextModel=M.fit(next);data=next;model=nextModel;dataName=name;showData();clearResults();run(false);}
  function clearResults() {current=null;$('focus-label').textContent='Results need a new run';$('policy-context').textContent='The current data has changed. Run a policy with valid controls to calculate results.';for(const id of ['kpis','policy-warnings','distributions','comparison'])$(id).replaceChildren();}
  function showData() {
    $('data-status').textContent=dataName+' · '+data.length+' weeks. No data is sent to a server.';
    $('data-preview').textContent=M.csv(data.slice(0,14));
    $('fit-note').textContent='First 14 rows shown. S = FTE; A = automation fraction; W = WIP cap (items); U/R = unplanned/rework indices; T = items/week; L = days; D = defects/item. Residual SD uses n − p degrees of freedom. No coefficient uncertainty is simulated.';
    const names={R:['intercept','U','A','W','S'],T:['intercept','S','A','U','R','W'],L:['intercept','W/T'],D:['intercept','U','R','A','T']};
    $('fit-table').innerHTML='<table><caption>Fitted coefficients and residual spread</caption><thead><tr><th>Equation</th><th>Coefficients</th><th>Residual SD</th></tr></thead><tbody>'+['R','T','L','D'].map(k=>'<tr><th scope="row">'+k+'</th><td>'+model[k].coef.map((v,i)=>names[k][i]+': '+fmt(v,5)).join('; ')+'</td><td>'+fmt(model[k].sigma,5)+'</td></tr>').join('')+'</tbody></table><p>Observed ranges: '+['S','A','W','U'].map(k=>k+' ['+fmt(model.ranges[k][0])+', '+fmt(model.ranges[k][1])+']').join(' · ')+'</p>';
  }
  const policyNames={baseline:'Baseline',auto_up:'Automation +0.15',fte_plus2:'Staffing +2 FTE',wip_minus2:'WIP limit −2',custom:'Custom policy'};
  function deltas() {return $('preset').value==='custom'?{dA:Number($('delta-a').value),dS:Number($('delta-s').value),dW:Number($('delta-w').value)}:M.presets[$('preset').value];}
  function run(compare) {
    try {
      if(!$('policy-form').reportValidity())return;
      const n=Number($('samples').value),seed=Number($('seed').value),key=$('preset').value;
      const baseline=M.simulate(model,M.presets.baseline,n,seed),focus=key==='baseline'?baseline:M.simulate(model,deltas(),n,seed);
      const results=compare?Object.entries(M.presets).map(([k,d])=>({name:policyNames[k],result:k==='baseline'?baseline:M.simulate(model,d,n,seed)})):[{name:'Baseline',result:baseline},...(key==='baseline'?[]:[{name:policyNames[key],result:focus}])];
      if(compare&&key==='custom')results.push({name:policyNames[key],result:focus});
      current={baseline,focus,results};renderPolicy(current);$('policy-error').textContent='';
    }catch(e){$('policy-error').textContent=e.message;}
  }
  $('policy-form').addEventListener('submit',e=>{e.preventDefault();run(false);});$('compare').addEventListener('click',()=>run(true));
  $('preset').addEventListener('change',()=>{$('custom-controls').hidden=$('preset').value!=='custom';$('policy-error').textContent='Controls changed. Run policy to update the displayed results.';});
  for(const k of ['a','s','w']) $('delta-'+k).addEventListener('input',()=>{$('delta-'+k+'-value').textContent=Number($('delta-'+k).value).toFixed(k==='a'?2:0);$('policy-error').textContent='Controls changed. Run policy to update the displayed results.';});
  for(const id of ['samples','seed'])$(id).addEventListener('input',()=>{$('policy-error').textContent='Controls changed. Run policy to update the displayed results.';});
  $('reset-policy').addEventListener('click',()=>{$('preset').value='baseline';$('custom-controls').hidden=true;for(const k of ['a','s','w']) {$('delta-'+k).value=0;$('delta-'+k+'-value').textContent=k==='a'?'0.00':'0';}$('samples').value=1000;$('seed').value=42;run(false);});
  $('synthetic').addEventListener('click',()=>{try{installData(M.synthetic(),'Original synthetic sample (seed 42)');$('csv-file').value='';}catch(e){$('policy-error').textContent=e.message;}});
  $('csv-file').addEventListener('change',async()=>{const file=$('csv-file').files[0];if(!file)return;try{if(file.size>2e6)throw Error('Use a CSV file no larger than 2 MB.');const parsed=M.parseCSV(await file.text());installData(parsed,'Imported: '+file.name);}catch(e){$('policy-error').textContent='Import rejected; current data retained. '+e.message;}});
  $('download').addEventListener('click',()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([M.csv(data)],{type:'text/csv'}));a.href=url;a.download='project-causal-lab-data.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  $('self-tests').addEventListener('click',()=>{try{$('test-output').textContent=M.selfTests().map(t=>(t.pass?'PASS':'FAIL')+' · '+t.name).join('\n');}catch(e){$('test-output').textContent='FAIL · '+e.message;}});
  function renderPolicy({baseline,focus,results}) {
    $('focus-label').textContent=policyNames[$('preset').value]+' · simulated results';
    $('policy-context').textContent=dataName+' · '+focus.samples.length+' paired draws · seed '+$('seed').value+'. Fixed controls: '+['S','A','W'].map(k=>k+' = '+fmt(focus.actual[k])).join(', ')+'.';
    const labels={T:'Throughput · items/week',L:'Lead time · days',D:'Defects/item',Uti:'Chosen value score'};
    $('kpis').innerHTML=Object.keys(labels).map(k=>'<div><span>'+labels[k]+'</span><strong>'+fmt(focus.stats[k].mean,k==='D'?4:2)+'</strong><small>Δ baseline '+fmt(focus.stats[k].mean-baseline.stats[k].mean,k==='D'?4:2)+'</small></div>').join('');
    const clamps=['S','A','W'].filter(k=>focus.actual[k]!==focus.requested[k]);
    $('policy-warnings').textContent=(clamps.length?'Control bounds applied: '+clamps.map(k=>k+' requested '+fmt(focus.requested[k])+' → '+fmt(focus.actual[k])).join('; ')+'. ':'')+(focus.extrapolated.length?'Outside observed input ranges: '+focus.extrapolated.join(', ')+'. These predictions extrapolate. ':'')+'Floored draws: '+Object.entries(focus.clipped).map(([k,v])=>k+' '+v+'/'+focus.samples.length).join(' · ')+'.';
    $('distributions').innerHTML=['T','L','D'].map(k=>histogram(focus,baseline,k,labels[k])).join('')+boxplot(focus,baseline);
    const ranked=[...results].sort((a,b)=>b.result.stats.Uti.mean-a.result.stats.Uti.mean);
    $('comparison').innerHTML=scoreBars(ranked)+'<table><caption>Descending mean value score; trade-offs remain visible</caption><thead><tr><th>Policy</th><th>Throughput</th><th>Days</th><th>Defects/item</th><th>Score mean ± SD</th><th>Δ baseline score</th><th>Outside data ranges</th></tr></thead><tbody>'+ranked.map(({name,result:r})=>'<tr><th scope="row">'+esc(name)+'</th><td>'+fmt(r.stats.T.mean)+'</td><td>'+fmt(r.stats.L.mean)+'</td><td>'+fmt(r.stats.D.mean,4)+'</td><td>'+fmt(r.stats.Uti.mean)+' ± '+fmt(r.stats.Uti.sd)+'</td><td>'+fmt(r.stats.Uti.mean-baseline.stats.Uti.mean)+'</td><td>'+esc(r.extrapolated.join(', ')||'None')+'</td></tr>').join('')+'</tbody></table>';
  }
  function histogram(f,b,key,label) {
    const vs=[...f.samples,...b.samples].map(s=>s[key]),lo=Math.min(...vs),rawHi=Math.max(...vs),hi=rawHi===lo?lo+1:rawHi,bins=18;
    const count=r=>{const a=Array(bins).fill(0);r.samples.forEach(s=>a[Math.min(bins-1,Math.floor((s[key]-lo)/(hi-lo)*bins))]++);return a;};
    const policy=count(f),base=count(b),max=Math.max(...policy,...base,1),width=270/bins;
    return '<figure><figcaption>'+label+'</figcaption><svg viewBox="0 0 330 195" role="img" aria-label="'+esc(label)+': policy mean '+fmt(f.stats[key].mean,4)+', baseline mean '+fmt(b.stats[key].mean,4)+'"><line class="axis" x1="40" x2="310" y1="155" y2="155"/>'+policy.map((v,i)=>'<rect class="policy-bar" x="'+(40+i*width)+'" y="'+(155-v/max*125)+'" width="'+(width-1)+'" height="'+v/max*125+'"/>').join('')+base.map((v,i)=>'<rect class="base-bar" x="'+(40+i*width)+'" y="'+(155-v/max*125)+'" width="'+(width-1)+'" height="'+v/max*125+'"/>').join('')+'<text x="35" y="30" text-anchor="end">'+max+'</text><text x="35" y="157" text-anchor="end">0</text><text x="40" y="178">'+fmt(lo,key==='D'?3:1)+'</text><text x="310" y="178" text-anchor="end">'+fmt(hi,key==='D'?3:1)+'</text></svg></figure>';
  }
  function boxplot(f,b) {
    const lo=Math.min(f.stats.Uti.q05,b.stats.Uti.q05),hi=Math.max(f.stats.Uti.q95,b.stats.Uti.q95),x=v=>70+(v-lo)/(hi-lo||1)*240;
    return '<figure><figcaption>Value score · 5–95% and middle 50%</figcaption><svg viewBox="0 0 330 195" role="img" aria-label="Value score distributions. Policy 5th to 95th percentile '+fmt(f.stats.Uti.q05)+' to '+fmt(f.stats.Uti.q95)+'; baseline '+fmt(b.stats.Uti.q05)+' to '+fmt(b.stats.Uti.q95)+'">'+[{r:f,name:'Policy',y:65},{r:b,name:'Base',y:120}].map(({r,name,y},i)=>{const s=r.stats.Uti;return '<text x="5" y="'+(y+4)+'">'+name+'</text><g class="box '+(i?'base-box':'policy-box')+'"><line x1="'+x(s.q05)+'" x2="'+x(s.q95)+'" y1="'+y+'" y2="'+y+'"/><rect x="'+x(s.q25)+'" y="'+(y-15)+'" width="'+Math.max(.5,x(s.q75)-x(s.q25))+'" height="30"/><line x1="'+x(s.median)+'" x2="'+x(s.median)+'" y1="'+(y-15)+'" y2="'+(y+15)+'"/></g>';}).join('')+'<text x="70" y="178">'+fmt(lo)+'</text><text x="310" y="178" text-anchor="end">'+fmt(hi)+'</text></svg></figure>';
  }
  function scoreBars(rows) {
    const lo=Math.min(0,...rows.map(({result:r})=>r.stats.Uti.mean-r.stats.Uti.sd)),hi=Math.max(0,...rows.map(({result:r})=>r.stats.Uti.mean+r.stats.Uti.sd)),x=v=>175+(v-lo)/(hi-lo||1)*465;
    return '<svg class="score-chart" viewBox="0 0 660 '+(rows.length*50+40)+'" role="img" aria-label="Mean value scores with plus or minus one simulated standard deviation; exact values in following table.">'+rows.map(({name,result:r},i)=>{const s=r.stats.Uti,y=15+i*50;return '<text x="5" y="'+(y+18)+'">'+esc(name)+'</text><rect class="policy-bar" x="'+Math.min(x(0),x(s.mean))+'" y="'+y+'" width="'+Math.abs(x(s.mean)-x(0))+'" height="28"/><line class="spread" x1="'+x(s.mean-s.sd)+'" x2="'+x(s.mean+s.sd)+'" y1="'+(y+14)+'" y2="'+(y+14)+'"/>';}).join('')+'<text x="175" y="'+(rows.length*50+25)+'">'+fmt(lo)+'</text><text x="640" y="'+(rows.length*50+25)+'" text-anchor="end">'+fmt(hi)+'</text></svg>';
  }
  showData();run(false);
})();
