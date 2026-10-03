(function () {
  'use strict';
  const M=globalThis.SignedFeedbackModel, $=id=>document.getElementById(id);
  let run=M.start(M.preset()), timer=null;
  const colors=['#2a6958','#a5573c','#527b9b'], dashes=['','7 4','2 4'];
  const format=value=>Object.is(value,-0)?'0':value===0?'0':Math.abs(value)<.0001||Math.abs(value)>=1e5?value.toExponential(3):Number(value.toPrecision(5)).toString();
  const signed=value=>(value>0?'+':'')+format(value);
  function element(tag,attrs={},content) {const e=document.createElement(tag);Object.entries(attrs).forEach(([key,value])=>e.setAttribute(key,value));if(content!==undefined)e.textContent=content;return e;}
  function svg(tag,attrs={},content) {const e=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([key,value])=>e.setAttribute(key,value));if(content!==undefined)e.textContent=content;return e;}
  function message(text) {$('status').textContent=text;}
  function error(err) {$('error').hidden=false;$('error').textContent=err.message;}
  function clearError() {$('error').hidden=true;$('error').textContent='';}
  function pause(announce=true) {if(timer!==null)clearInterval(timer);timer=null;$('run').disabled=false;$('pause').disabled=true;if(announce)message('Paused at tick '+run.tick+'.');}
  function load(config,text) {pause(false);run=M.start(config);$('preset').value=run.config.preset;clearError();renderInputs();render();message(text);}
  function takeStep(announce=true) {try{const next=M.step(run);run=next;clearError();render();if(announce)message('Tick '+run.tick+'. Contributions now show the next update.');return true;}catch(err){pause(false);error(err);message('Run stopped at tick '+run.tick+'.');return false;}}
  function inputRow(id,labelText,value,detail) {const row=element('div',{class:'input-row'}),label=element('label',{for:id},labelText);if(detail)label.append(element('small',{},detail));row.append(label,element('input',{id,type:'number',step:'any',min:'-1000000',max:'1000000',required:'',value:String(value)}));return row;}
  function renderInputs() {$('initial-inputs').replaceChildren(...run.config.nodes.map(n=>inputRow('initial-'+n.id,n.label,n.initial)));$('gain-inputs').replaceChildren(...run.config.edges.map(e=>inputRow('gain-'+e.id,e.from+' → '+e.to,e.gain,e.activity)));}
  function numericInput(id) {const value=$(id).value;if(value.trim()===''||!Number.isFinite(Number(value)))throw new Error('Enter a finite number in every parameter field.');return Number(value);}
  function render() {
    const config=run.config,w=M.matrix(config),s=M.stability(w),flows=M.contributions(config,run.state);
    $('tick').textContent=run.tick;$('rho').textContent=s.rho.toPrecision(7);$('max-state').textContent=format(Math.max(...run.state.map(Math.abs)));
    const labels={decay:'Decays to zero',unstable:'Growing mode exists',boundary:'Boundary · inspect'};
    $('stability').textContent=labels[s.classification];
    $('stability-note').textContent=s.classification==='decay'?'With these fixed gains, every starting state tends to zero. Early transients can still rise or change sign.':s.classification==='unstable'?'These gains admit a growing mode. This describes the matrix, not a guarantee that every selected starting state grows.':'ρ is within 10⁻⁹ of 1. A numerical boundary cue alone cannot certify bounded or marginal behaviour.';
    $('flow-timing').textContent='Current signals: tick '+run.tick+'. Every activity box shows gain × current source, ready for tick '+(run.tick+1)+'.';
    renderGraph(config,flows);renderContributions(config,flows);renderLoops(config);renderMatrix(config,w);renderHistory(config);
    $('eigenvalues').textContent='Eigenvalues: '+s.eigenvalues.map(z=>format(z.re)+(Math.abs(z.im)>1e-13?(z.im<0?' − ':' + ')+format(Math.abs(z.im))+'i':'')).join('; ')+'.  ρ(W) = max |λ|.';
  }
  function wrappedText(group,text,x,y,width,lineHeight=17,fontSize=14) {
    const words=text.split(/\s+/).flatMap(word=>word.match(new RegExp('.{1,'+width+'}','g'))||[]),lines=[];let line='';
    for(const word of words){if((line+' '+word).trim().length>width && line){lines.push(line);line=word;}else line=(line+' '+word).trim();}if(line)lines.push(line);
    const visible=lines.slice(0,2);if(lines.length>2)visible[1]=visible[1].slice(0,width-1)+'…';
    visible.forEach((line,i)=>group.append(svg('text',{x,y:y+i*lineHeight,'text-anchor':'middle','font-size':fontSize},line)));
  }
  function renderGraph(config,flows) {
    const graph=$('graph');graph.querySelectorAll(':scope > :not(title):not(desc)').forEach(e=>e.remove());
    const defs=svg('defs');['positive','negative','zero'].forEach((id,i)=>{const marker=svg('marker',{id:'arrow-'+id,markerWidth:9,markerHeight:9,refX:8,refY:4.5,orient:'auto'});marker.append(svg('path',{d:'M0,0 L9,4.5 L0,9 Z',fill:['#2a6958','#9b4e3a','#74796f'][i]}));defs.append(marker);});graph.append(defs);
    const nodePos={Reg:[200,250],Op:[760,250],Ov:[480,75]},avPos=[[480,400],[480,250],[180,80],[780,80]];
    const paths=[['M200 290 V400 H370','M590 400 H760 V290'],['M680 250 H590','M370 250 H280'],['M400 75 H290','M180 125 V210 H200'],['M760 210 V125 H780','M670 80 H560']];
    config.edges.forEach((e,i)=>{const sign=e.gain<0?'negative':e.gain>0?'positive':'zero',color=e.gain<0?'#9b4e3a':e.gain>0?'#2a6958':'#74796f';paths[i].forEach(path=>graph.append(svg('path',{d:path,fill:'none',stroke:color,'stroke-width':2.2,'stroke-dasharray':e.gain<0?'7 4':e.gain===0?'2 5':'','marker-end':'url(#arrow-'+sign+')'})));});
    config.nodes.forEach((n,i)=>{const [x,y]=nodePos[n.id],group=svg('g');group.append(svg('rect',{x:x-80,y:y-40,width:160,height:80,rx:35,fill:'#e7eee3',stroke:colors[i],'stroke-width':2}));wrappedText(group,n.label,x,y-12,21,17,15);group.append(svg('text',{x,y:y+28,'text-anchor':'middle','font-size':17,'font-weight':600},n.id+': '+format(run.state[i])));graph.append(group);});
    config.edges.forEach((e,i)=>{const [x,y]=avPos[i],group=svg('g');group.append(svg('rect',{x:x-110,y:y-45,width:220,height:90,rx:7,fill:'#f5e8ca',stroke:'#bda270'}));wrappedText(group,e.activity,x,y-24,28,16,13);group.append(svg('text',{x,y:y+14,'text-anchor':'middle','font-size':13},e.id+' · gain '+signed(e.gain)),svg('text',{x,y:y+33,'text-anchor':'middle','font-size':16,'font-weight':600},'contribution '+signed(flows[i].value)));graph.append(group);});
  }
  function renderContributions(config,flows) {$('contributions').replaceChildren(...config.edges.map((e,i)=>{const tr=element('tr'),src=config.nodes.findIndex(n=>n.id===e.from),dst=config.nodes.find(n=>n.id===e.to);const label=element('td');label.append(element('strong',{},config.nodes[src].label+' → '+dst.label),element('br'),document.createTextNode(e.activity));tr.append(label,...[signed(e.gain),format(run.state[src]),signed(flows[i].value)].map(value=>element('td',{class:'number'},value)));return tr;}));}
  function renderLoops(config) {$('loops').replaceChildren(...M.loops(config).map(loop=>{const block=element('div',{class:'loop'});block.append(element('strong',{},loop.value===0?'Open path (a gain is zero)':loop.value>0?'Positive / reinforcing loop':'Negative / balancing loop'),element('p',{},loop.nodes.map(id=>config.nodes.find(n=>n.id===id).label).join(' → ')),element('p',{class:'note'},'Product '+signed(loop.value)+' across '+loop.length+' links / ticks.'));return block;}));}
  function renderMatrix(config,w) {
    const table=$('matrix');table.replaceChildren(element('caption',{},'W: rows receive, columns send. IDs match the diagram.'));
    const head=element('thead'),tr=element('tr');tr.append(element('th',{scope:'col'},'To ↓ / from →'),...config.nodes.map(n=>element('th',{scope:'col'},n.id)));head.append(tr);const body=element('tbody');w.forEach((row,i)=>{const tr=element('tr');tr.append(element('th',{scope:'row'},config.nodes[i].id),...row.map(v=>element('td',{class:'number'},signed(v))));body.append(tr);});table.append(head,body);
  }
  function renderHistory(config) {
    const chart=$('history-chart');chart.replaceChildren();const max=Math.max(...run.history.flatMap(h=>h.state.map(Math.abs)))||1;
    const left=80,right=970,top=18,bottom=235,mid=(top+bottom)/2,x=t=>left+t/Math.max(1,run.tick)*(right-left),y=v=>mid-v/max*(bottom-top)/2;
    [max,0,-max].forEach(v=>chart.append(svg('line',{x1:left,x2:right,y1:y(v),y2:y(v),stroke:'#d5ddcf','stroke-dasharray':v===0?'':'3 4'}),svg('text',{x:left-10,y:y(v)+5,'text-anchor':'end','font-size':13},format(v))));
    chart.append(svg('text',{x:left,y:263,'font-size':13},'Tick 0'),svg('text',{x:right,y:263,'text-anchor':'end','font-size':13},'Tick '+run.tick));
    config.nodes.forEach((n,i)=>{chart.append(svg('polyline',{points:run.history.map(h=>x(h.tick)+','+y(h.state[i])).join(' '),fill:'none',stroke:colors[i],'stroke-width':2.5,'stroke-dasharray':dashes[i]}));chart.append(svg('circle',{cx:x(run.tick),cy:y(run.state[i]),r:4,fill:colors[i]}));});
    chart.setAttribute('aria-label','Signals from tick 0 to '+run.tick+'. Latest: '+config.nodes.map((n,i)=>n.label+' '+format(run.state[i])).join('; ')+'. Numerical values follow.');
    $('history-legend').replaceChildren(...config.nodes.map((n,i)=>{const span=element('span'),key=element('i',{class:'key'});key.style.background=colors[i];span.append(key,document.createTextNode(n.label+' ('+['solid','dashed','dotted'][i]+')'));return span;}));
    const table=$('history-table'),head=element('thead'),tr=element('tr');tr.append(...['Tick',...config.nodes.map(n=>n.label)].map(v=>element('th',{scope:'col'},v)));head.append(tr);const body=element('tbody');run.history.slice(-12).forEach(h=>{const row=element('tr');row.append(...[h.tick,...h.state.map(format)].map(v=>element('td',{},v)));body.append(row);});table.replaceChildren(element('caption',{},'Last '+Math.min(12,run.history.length)+' states; CSV contains the complete run.'),head,body);
  }
  function download(text,type,name) {const url=URL.createObjectURL(new Blob([text],{type})),a=element('a',{href:url,download:name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Prepared '+name+' for download.');}
  $('parameters').addEventListener('submit',event=>{event.preventDefault();try{const config=M.clone(run.config);config.nodes.forEach(n=>n.initial=numericInput('initial-'+n.id));config.edges.forEach(e=>e.gain=numericInput('gain-'+e.id));load(M.validateConfig(config),'Changes applied. Paused at tick 0.');}catch(err){error(err);}});
  $('parameters').addEventListener('input',()=>message('Unapplied edits. Apply changes to begin a new run with these values.'));
  $('step').addEventListener('click',()=>{pause(false);takeStep();});
  $('run').addEventListener('click',()=>{if(timer!==null)return;if(run.tick>=M.MAX_TICKS){error(new Error('Restart before running beyond 500 ticks.'));return;}timer=setInterval(()=>takeStep(false),500);$('run').disabled=true;$('pause').disabled=false;message('Running one tick every half second.');});
  $('pause').addEventListener('click',()=>pause());
  $('restart').addEventListener('click',()=>load(run.config,'Restarted at tick 0 with the applied gains and starting signals.'));
  $('restore').addEventListener('click',()=>load(M.preset($('preset').value),'Selected example restored. Paused at tick 0.'));
  $('preset').addEventListener('change',()=>load(M.preset($('preset').value),'Selected example loaded. Paused at tick 0.'));
  $('show-json').addEventListener('click',()=>{$('model-json').value=M.encode(run.config);message('Applied model shown below. Copy it or download the JSON.');});
  $('apply-json').addEventListener('click',()=>{try{const config=M.decode($('model-json').value);load(config,'JSON loaded. Paused at tick 0 with the imported starting signals.');}catch(err){error(err);}});
  $('download-json').addEventListener('click',()=>download(M.encode(run.config)+'\n','application/json','signed-feedback-model.json'));
  $('download-dot').addEventListener('click',()=>download(M.dot(run.config,run.state),'text/vnd.graphviz','signed-feedback-tick-'+run.tick+'.dot'));
  $('download-csv').addEventListener('click',()=>download(M.csv(run),'text/csv','signed-feedback-history.csv'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&timer!==null)pause();});
  renderInputs();render();
})();
