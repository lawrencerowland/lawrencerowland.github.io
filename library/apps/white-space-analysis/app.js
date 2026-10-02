(() => {
  'use strict';
  const M = WhiteSpace, dims = M.dimensions, $ = id => document.getElementById(id);
  let firms = structuredClone(M.example), entrant = {...M.defaultEntrant}, selected = M.autoPick(firms).pick;
  let sort = {key:'firm',dir:1};
  const errors = new Set(), fmt = n => Number(n.toFixed(2)).toString(), name = key => dims.find(d=>d.key===key).short;
  function el(tag, text, attrs={}) { const node=document.createElement(tag); if(text!==null) node.textContent=text; for(const [k,v] of Object.entries(attrs)) node.setAttribute(k,v); return node; }
  function status(text) { $('status').textContent=text; }
  function table() {
    const table=$('scoreTable'); table.querySelectorAll('thead,tbody').forEach(node=>node.remove());
    const head=el('thead',null), row=el('tr',null), body=el('tbody',null);
    for(const column of [{key:'firm',short:'Fictional firm'},...dims]) {
      const th=el('th',null,{scope:'col','aria-sort':sort.key===column.key ? sort.dir===1 ? 'ascending':'descending':'none'});
      const button=el('button',column.short,{type:'button'}); button.addEventListener('click',()=>{
        if(errors.size) {status('Correct invalid scores before sorting.');return;}
        sort={key:column.key,dir:sort.key===column.key ? -sort.dir:column.key==='firm'?1:-1}; tableRenderAndFocus(column.key);
      }); th.append(button); row.append(th);
    }
    head.append(row);
    const ordered=firms.slice().sort((a,b)=>sort.dir*(sort.key==='firm' ? a.firm.localeCompare(b.firm):a.scores[sort.key]-b.scores[sort.key]));
    for(const firm of ordered) {
      const tr=el('tr',null);tr.append(el('th',firm.firm,{scope:'row'}));
      for(const dim of dims) {
        const td=el('td',null), input=el('input',null,{type:'number',min:'0',max:'10',step:'any','aria-label':firm.firm+' — '+dim.short});input.value=firm.scores[dim.key];
        const errorKey=firm.firm+dim.key;
        input.addEventListener('input',()=>{
          try {firm.scores[dim.key]=M.score(input.value);errors.delete(errorKey);input.removeAttribute('aria-invalid');status(errors.size?'Correct the remaining invalid scores.':'Scores updated.');}
          catch(error) {errors.add(errorKey);input.setAttribute('aria-invalid','true');status(firm.firm+' — '+dim.short+': '+error.message);}
          $('csv').disabled=errors.size>0;$('auto').disabled=errors.size>0; renderOutputs();
        }); td.append(input);tr.append(td);
      } body.append(tr);
    } table.append(head,body);
  }
  function tableRenderAndFocus(key) {table();$('scoreTable').querySelectorAll('thead button')[[{key:'firm'},...dims].findIndex(d=>d.key===key)].focus();}
  function checks() {
    $('dimensions').replaceChildren();
    for(const dim of dims) {
      const label=el('label',null,{class:'check'}), input=el('input',null,{type:'checkbox',value:dim.key});input.checked=selected.includes(dim.key);
      input.addEventListener('change',()=>{
        if(input.checked && selected.length===4) {input.checked=false;$('selectionStatus').textContent='Four are selected. Uncheck one before adding another.';return;}
        selected=input.checked?[...selected,dim.key]:selected.filter(key=>key!==dim.key);renderOutputs();
      });label.append(input,document.createTextNode(dim.short));$('dimensions').append(label);
    }
  }
  function sliders() {
    $('sliders').replaceChildren();
    for(const dim of dims) {
      const label=el('label',null), output=el('output',fmt(entrant[dim.key]),{for:'entrant-'+dim.key});
      label.append(document.createTextNode(dim.short+': '),output);
      const input=el('input',null,{id:'entrant-'+dim.key,type:'range',min:'0',max:'10',step:'0.1'});input.value=entrant[dim.key];
      input.addEventListener('input',()=>{entrant[dim.key]=M.score(input.value);output.textContent=fmt(entrant[dim.key]);renderOutputs();});label.append(input);$('sliders').append(label);
    }
  }
  function svgEl(tag, attrs, text) {const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n;}
  function plot(xKey,yKey,region) {
    const card=el('article',null,{class:'plot'});card.append(el('h3',name(yKey)+' × '+name(xKey)));
    const svg=svgEl('svg',{viewBox:'0 0 340 270',role:'img','aria-label':name(yKey)+' versus '+name(xKey)+'. Values are available in the score table.'});
    const x=v=>42+v*27, y=v=>225-v*19;
    if(region.empty) svg.append(svgEl('rect',{x:x(region.x0),y:y(10),width:(10-region.x0)*27,height:(10-region.y0)*19,fill:'#dbe7c9',stroke:'#709758'}));
    for(const t of [0,5,10]) {
      svg.append(svgEl('line',{x1:x(0),x2:x(10),y1:y(t),y2:y(t),stroke:'#dce2d5'}),svgEl('line',{x1:x(t),x2:x(t),y1:y(0),y2:y(10),stroke:'#dce2d5'}));
      svg.append(svgEl('text',{x:x(t),y:244,'text-anchor':'middle'},t),svgEl('text',{x:30,y:y(t)+4,'text-anchor':'end'},t));
    }
    svg.append(svgEl('text',{x:312,y:263,'text-anchor':'end'},name(xKey)),svgEl('text',{x:42,y:20},name(yKey)));
    for(const firm of firms) {
      const description=firm.firm+': '+name(xKey)+' '+firm.scores[xKey]+', '+name(yKey)+' '+firm.scores[yKey];
      const dot=svgEl('circle',{cx:x(firm.scores[xKey]),cy:y(firm.scores[yKey]),r:4.5,fill:'#275740',tabindex:'0','aria-label':description});
      dot.append(svgEl('title',{},description));svg.append(dot);
    }
    const ex=x(entrant[xKey]),ey=y(entrant[yKey]);
    const marker=svgEl('rect',{x:ex-5,y:ey-5,width:10,height:10,transform:`rotate(45 ${ex} ${ey})`,fill:'#995317',stroke:'#fffdf7','stroke-width':1.5});
    marker.append(svgEl('title',{},'Entrant: '+entrant[xKey]+', '+entrant[yKey]));svg.append(marker);card.append(svg);
    card.append(el('p',region.empty ? `Empty when ${name(xKey)} ≥ ${fmt(region.x0)} and ${name(yKey)} ≥ ${fmt(region.y0)}. Area ${fmt(region.area)} / 100.`:'No empty upper-right region with positive area on the 0.1 grid.'));
    return card;
  }
  function renderOutputs() {
    $('plots').replaceChildren();$('ranked').replaceChildren();
    if(errors.size) {$('plots').append(el('p','Correct invalid scores to recompute the plots.'));$('entrantResult').textContent='Entrant comparison paused until scores are valid.';$('bestSet').textContent='';return;}
    const selectedPairs=M.pairs(selected);let hits=0;
    $('selectionStatus').textContent=selected.length+' of 4 dimensions selected';
    if(selected.length===4) for(const [x,y] of selectedPairs) {const region=M.largestEmptyTopRight(firms,x,y);$('plots').append(plot(x,y,region));if(M.inRegion(region,entrant[x],entrant[y]))hits++;}
    else $('plots').append(el('p','Select exactly four dimensions to show the six plots.'));
    $('entrantResult').textContent=selected.length===4 ? `The entrant lies inside ${hits} of 6 empty regions. This measures position in these plots, not business fit.`:'Select exactly four dimensions to compare the entrant.';
    const ranked=M.pairs(dims.map(d=>d.key)).map(([x,y])=>({x,y,...M.largestEmptyTopRight(firms,x,y)})).sort((a,b)=>b.area-a.area);
    for(const item of ranked.slice(0,5)) $('ranked').append(el('li',name(item.y)+' × '+name(item.x)+': '+(item.empty ? `thresholds ${fmt(item.x0)} and ${fmt(item.y0)}; area ${fmt(item.area)} / 100`:'no positive empty area')));
    const best=M.autoPick(firms);$('bestSet').textContent='Automatic choice: '+best.pick.map(name).join(', ')+'. Sum of six plotted areas: '+fmt(best.sumArea)+' (overlapping projections, not market volume).';
  }
  for(const dim of dims) {const p=el('p',null);p.append(el('strong',dim.name+': '),document.createTextNode(dim.description));$('dimensionDescriptions').append(p);}
  $('auto').addEventListener('click',()=>{selected=M.autoPick(firms).pick;checks();renderOutputs();});
  $('resetScores').addEventListener('click',()=>{firms=structuredClone(M.example);errors.clear();$('csv').disabled=false;$('auto').disabled=false;table();renderOutputs();status('Example scores restored.');});
  $('resetEntrant').addEventListener('click',()=>{entrant={...M.defaultEntrant};sliders();renderOutputs();});
  $('csv').addEventListener('click',()=>{if(errors.size)return;const blob=new Blob([M.csv(firms)],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=el('a',null,{href:url,download:'fictional-capability-scores.csv'});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('CSV download requested for the current scores.');});
  table();checks();sliders();renderOutputs();
})();
