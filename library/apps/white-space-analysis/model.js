(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WhiteSpace = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const dimensions = [
    {key:'ot', short:'OT depth', name:'Engineering and asset lifecycle', description:'An assumed ability to work with operational technology, engineering, maintenance and asset constraints.'},
    {key:'gov', short:'Governance', name:'Programme governance and controls', description:'An assumed ability to work with costs, schedules, risks, stage gates and commercial controls.'},
    {key:'ip', short:'Productised IP', name:'Reusable tools and delivery methods', description:'An assumed stock of repeatable tools, reference architectures, templates and delivery methods.'},
    {key:'ai', short:'Industrial data / AI', name:'Data and software engineering', description:'An assumed ability to connect industrial data and build or operate software and analytical tools.'},
    {key:'scale', short:'Scale', name:'Delivery capacity and reach', description:'An assumed capacity to staff and support several programmes and locations.'},
    {key:'comm', short:'Commercial innovation', name:'Commercial and contract design', description:'An assumed ability to design alternative pricing, incentives and modular service arrangements.'}
  ];
  // Retain the original numerical toy inputs, with fictional labels rather than
  // presenting unsourced scores as evidence about named real organisations.
  const example = [
    {firm:'Firm A', scores:{ot:6,gov:7,ip:5,ai:7,scale:8,comm:5}},
    {firm:'Firm B', scores:{ot:6,gov:6,ip:6,ai:9,scale:9,comm:6}},
    {firm:'Firm C', scores:{ot:5,gov:6,ip:5,ai:6,scale:6,comm:5}},
    {firm:'Firm D', scores:{ot:4,gov:9,ip:3,ai:3,scale:5,comm:4}},
    {firm:'Firm E', scores:{ot:5,gov:8,ip:2,ai:3,scale:4,comm:4}}
  ];
  const defaultEntrant = {ot:9,gov:8,ip:9,ai:8,scale:5,comm:8};
  const keys = dimensions.map(d => d.key);
  function score(value) {
    if ((typeof value !== 'number' && typeof value !== 'string') || (typeof value === 'string' && !value.trim())) throw new TypeError('Enter a score from 0 to 10.');
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || number > 10) throw new RangeError('Enter a score from 0 to 10.');
    return number;
  }
  function pairKeys(x, y) {
    if (!keys.includes(x) || !keys.includes(y) || x === y) throw new RangeError('Choose two different known dimensions.');
  }
  function pointsFor(rows, x, y) {
    pairKeys(x,y);
    if (!Array.isArray(rows)) throw new TypeError('Scores must be an array.');
    return rows.map(row => {
      if (!row || typeof row !== 'object' || !row.scores) throw new TypeError('Each firm needs a score object.');
      return [score(row.scores[x]), score(row.scores[y])];
    });
  }
  function largestEmptyTopRight(rows, x, y) {
    const points = pointsFor(rows, x, y);
    // Thresholds live on a 0.1 grid. Strictly move beyond an occupied boundary;
    // at (10,10), no empty positive-area top-right rectangle exists.
    const nextThreshold = value => {
      let tick = Math.floor(value * 10);
      while (tick > 0 && (tick - 1) / 10 > value) tick--;
      while (tick <= 100 && tick / 10 <= value) tick++;
      return tick / 10;
    };
    const candidates = index => [...new Set([0, ...points.map(p => nextThreshold(p[index])).filter(v => v <= 10)])].sort((a,b) => a-b);
    let best = {x0:10,y0:10,area:0,empty:false};
    for (const x0 of candidates(0)) for (const y0 of candidates(1)) {
      if (points.some(p => p[0] >= x0 && p[1] >= y0)) continue;
      const area = (10-x0)*(10-y0);
      if (area > best.area + 1e-9) best = {x0,y0,area,empty:true};
    }
    return best;
  }
  function pairs(selected) {
    if (!Array.isArray(selected) || new Set(selected).size !== selected.length || selected.some(k => !keys.includes(k))) throw new RangeError('Use distinct known dimensions.');
    const result=[];
    for(let i=0;i<selected.length;i++) for(let j=i+1;j<selected.length;j++) result.push([selected[i],selected[j]]);
    return result;
  }
  function autoPick(rows) {
    let best=null;
    for(let a=0;a<keys.length;a++) for(let b=a+1;b<keys.length;b++) for(let c=b+1;c<keys.length;c++) for(let d=c+1;d<keys.length;d++) {
      const pick=[keys[a],keys[b],keys[c],keys[d]];
      const sumArea=pairs(pick).reduce((total,[x,y])=>total+largestEmptyTopRight(rows,x,y).area,0);
      if(!best || sumArea>best.sumArea+1e-9) best={pick,sumArea};
    }
    return best;
  }
  function inRegion(region, x, y) { return region.empty && region.area > 0 && score(x) >= region.x0 && score(y) >= region.y0; }
  function csv(rows) {
    const cell=value=>'"'+String(value).replace(/"/g,'""')+'"';
    return [[cell('Fictional firm'),...dimensions.map(d=>cell(d.name))].join(','),...rows.map(row=>[cell(row.firm),...keys.map(k=>score(row.scores[k]))].join(','))].join('\r\n');
  }
  return {dimensions,example,defaultEntrant,score,pairs,largestEmptyTopRight,autoPick,inRegion,csv};
});
