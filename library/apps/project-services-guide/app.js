(() => {
  'use strict';
  const M=ProjectServicesGuide,$=id=>document.getElementById(id);
  const cards=[...document.querySelectorAll('[data-record]')],groups=[...document.querySelectorAll('[data-group]')];
  let previousOpen=null;
  function filter() {
    const constrained=$('search').value.trim()!==''||$('type').value!=='all';
    if(constrained&&previousOpen===null)previousOpen=new Set(groups.filter(x=>x.open).map(x=>x.id));
    const matches=M.filter($('search').value,$('type').value),ids=new Set(matches.map(x=>x.id));
    cards.forEach(card=>card.hidden=!ids.has(card.id));
    groups.forEach(group=>{
      const shown=[...group.querySelectorAll('[data-record]')].filter(x=>!x.hidden);
      group.hidden=shown.length===0;
      group.querySelector('[data-group-count]').textContent=`${shown.length} question${shown.length===1?'':'s'}`;
      if(constrained&&shown.length)group.open=true;
      else if(!constrained&&previousOpen!==null)group.open=previousOpen.has(group.id);
    });
    if(!constrained)previousOpen=null;
    const serviceCount=matches.filter(x=>x.type!=='question').length,questionCount=matches.length-serviceCount;
    $('offers').hidden=serviceCount===0;$('questions').hidden=questionCount===0;
    $('empty').hidden=matches.length!==0;
    $('results').textContent=`${serviceCount} of 15 service options · ${questionCount} of 23 questions`;
  }
  function resetFilters(){ $('search').value='';$('type').value='all';filter(); }
  function expand(open) {
    document.querySelectorAll('#browse details').forEach(el=>{if(!el.hidden&&!el.closest('[hidden]'))el.open=open;});
    if(previousOpen!==null)previousOpen=new Set(groups.filter(x=>x.open).map(x=>x.id));
    $('action-status').textContent=open?'All visible options and questions expanded.':'All visible options and questions collapsed.';
  }
  function revealHash() {
    let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
    const target=M.target(id);if(!target)return;
    resetFilters();
    if(target.group)$(target.group).open=true;
    const el=$(target.id),content=target.disclosure?el.querySelector('details'):el;
    if(content.tagName==='DETAILS')content.open=true;
    const focus=content.tagName==='DETAILS'?content.querySelector('summary'):content.querySelector('h2');
    if(focus)focus.focus({preventScroll:true});
    el.scrollIntoView?.({block:'start'});
  }
  $('search').addEventListener('input',filter);$('type').addEventListener('change',filter);
  $('clear').addEventListener('click',()=>{resetFilters();$('search').focus();$('action-status').textContent='All filters cleared.';});
  $('expand').addEventListener('click',()=>expand(true));$('collapse').addEventListener('click',()=>expand(false));
  $('try-risk').addEventListener('click',()=>{$('search').value='risk';$('type').value='all';filter();$('search').focus();});
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{if(link.hash===location.hash)revealHash();}));
  window.addEventListener('hashchange',revealHash);
  $('filters').hidden=false;filter();if(location.hash)revealHash();
})();
