(function (root) {
  'use strict';
  const STATUSES = ['', 'YES', 'NO', 'NA'];
  const HEADERS = ['Category', 'Subcategory', 'Capability', 'Current Operations', 'Future Operations'];
  const clone = data => JSON.parse(JSON.stringify(data));
  function walk(data, visit) {
    data.categories.forEach(category => {
      visit(category, 'category', null, category);
      category.capabilities.forEach(cap => visit(cap, 'capability', category, category));
      category.subcategories.forEach(sub => {
        visit(sub, 'subcategory', category, category);
        sub.capabilities.forEach(cap => visit(cap, 'capability', sub, category));
      });
    });
  }
  function validate(data) {
    if (!data || data.version !== 1 || !Array.isArray(data.categories) || !data.categories.length) throw Error('The file needs version 1 and at least one category.');
    const ids = new Set(); let count = 0;
    const check = (node, type) => {
      if (!node || typeof node !== 'object') throw Error('Each row must be an object.');
      if (typeof node.id !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(node.id) || ids.has(node.id)) throw Error('Every row needs a unique ID made of letters, numbers, hyphens or underscores.');
      ids.add(node.id);
      if (++count > 5000) throw Error('Use a file with at most 5,000 rows.');
      if (typeof node.name !== 'string' || !node.name.trim() || node.name.length > 300) throw Error('Each row needs a name of 1–300 characters.');
      for (const field of ['currentOps', 'futureOps']) if (!STATUSES.includes(node[field])) throw Error('Assessments must be blank, YES, NO or NA (outside scope).');
      if (type !== 'capability' && !Array.isArray(node.capabilities)) throw Error('Categories and subcategories need capability arrays.');
      if (type === 'category' && !Array.isArray(node.subcategories)) throw Error('Categories need subcategory arrays.');
      if (type === 'category') node.subcategories.forEach(sub => check(sub, 'subcategory'));
      if (type !== 'capability') node.capabilities.forEach(cap => check(cap, 'capability'));
    };
    data.categories.forEach(cat => check(cat, 'category'));
    return clone(data);
  }
  function find(data, id) {
    let result;
    walk(data, (node, type, parent, category) => { if (node.id === id) result = {node, type, parent, category}; });
    if (!result) throw Error('That row no longer exists.');
    return result;
  }
  function update(data, id, field, value, cascade = false) {
    if (!['name', 'currentOps', 'futureOps'].includes(field)) throw Error('Unknown field.');
    if (field === 'name') { value = String(value).trim(); if (!value || value.length > 300) throw Error('Enter a name of 1–300 characters.'); }
    else if (!STATUSES.includes(value)) throw Error('Choose a valid assessment.');
    const next = clone(data), target = find(next, id);
    target.node[field] = value;
    if (cascade && field !== 'name') {
      const children = node => { (node.capabilities || []).forEach(cap => {cap[field] = value;}); (node.subcategories || []).forEach(sub => {sub[field] = value; children(sub);}); };
      children(target.node);
    }
    return next;
  }
  function add(data, parentId, name, id) {
    name = String(name).trim();
    if (!name || name.length > 300) throw Error('Enter a name of 1–300 characters.');
    const next = clone(data), parent = find(next, parentId);
    if (parent.type === 'capability') throw Error('Add capabilities to a category or subcategory.');
    parent.node.capabilities.push({id, name, currentOps:'', futureOps:''});
    return validate(next);
  }
  function remove(data, id) {
    const next = clone(data), item = find(next, id);
    if (item.type !== 'capability') throw Error('Only individual capabilities can be removed.');
    item.parent.capabilities = item.parent.capabilities.filter(cap => cap.id !== id);
    return next;
  }
  function clear(data) {
    const next = clone(data); walk(next, node => {node.currentOps = ''; node.futureOps = '';}); return next;
  }
  function stats(data) {
    const result = {leaves:0, currentReviewed:0, currentPresent:0, futureRequired:0, gaps:0, unknownTargets:0, scopeChanges:0, parentJudgements:0};
    walk(data, (node, type) => {
      if (type !== 'capability') { if (node.currentOps || node.futureOps) result.parentJudgements++; return; }
      result.leaves++;
      if (node.currentOps) result.currentReviewed++;
      if (node.currentOps === 'YES') result.currentPresent++;
      if (node.futureOps === 'YES') {
        result.futureRequired++;
        if (node.currentOps === 'NO') result.gaps++;
        if (node.currentOps === '') result.unknownTargets++;
        if (node.currentOps === 'NA') result.scopeChanges++;
      }
    }); return result;
  }
  function visibleIds(data, query = '', mode = 'all', categoryId = '') {
    const ids = new Set(), needle = query.trim().toLowerCase();
    walk(data, (node, type, parent, category) => {
      if (categoryId && category.id !== categoryId) return;
      const path = [category.name, parent && parent.name, node.name].filter(Boolean).join(' ').toLowerCase();
      if (!path.includes(needle)) return;
      if (mode !== 'all' && type !== 'capability') return;
      if (mode === 'gaps' && !(node.currentOps === 'NO' && node.futureOps === 'YES')) return;
      if (mode === 'unknown' && !(node.currentOps === '' && node.futureOps === 'YES')) return;
      ids.add(node.id); ids.add(category.id); if (parent) ids.add(parent.id);
    }); return ids;
  }
  // RFC 4180-style quoting, including escaped quotes and embedded newlines.
  function parseCSV(text) {
    if (typeof text !== 'string' || text.length > 2000000) throw Error('Use a CSV file smaller than 2 MB.');
    text = text.replace(/^\uFEFF/, '');
    const rows = []; let row = [], field = '', quoted = false, closed = false;
    const pushField = () => {row.push(field); field = ''; closed = false;};
    const pushRow = () => {pushField(); if (row.some(value => value.trim())) rows.push(row); row = [];};
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"') {if (text[i + 1] === '"') {field += '"'; i++;} else {quoted = false; closed = true;}}
        else field += c;
      } else if (c === '"') {
        if (field || closed) throw Error('A quote appears inside an unquoted CSV field.');
        quoted = true;
      } else if (c === ',') pushField();
      else if (c === '\n' || c === '\r') {if (c === '\r' && text[i + 1] === '\n') i++; pushRow();}
      else {if (closed) throw Error('Unexpected text after a closing CSV quote.'); field += c;}
    }
    if (quoted) throw Error('A quoted CSV field is unfinished.');
    if (field || row.length || closed) pushRow();
    return rows;
  }
  function exportCSV(data) {
    validate(data);
    const rows = [[...HEADERS, 'ID', 'Parent ID', 'Type']];
    walk(data, (node, type, parent, cat) => {
      rows.push([cat.name, type === 'subcategory' ? node.name : parent && parent !== cat ? parent.name : '', type === 'capability' ? node.name : '', node.currentOps, node.futureOps, node.id, parent ? parent.id : '', type]);
    });
    return rows.map(row => row.map(value => '"' + value.replace(/"/g, '""') + '"').join(',')).join('\r\n') + '\r\n';
  }
  function importCSV(text) {
    const rows = parseCSV(text);
    if (rows.length < 2) throw Error('The CSV has no assessment rows.');
    const headers = rows.shift().map(h => h.trim().toLowerCase());
    const expected = HEADERS.map(h => h.toLowerCase());
    if (![5,8].includes(headers.length) || expected.some((h,i) => h !== headers[i]) || (headers.length === 8 && ['id','parent id','type'].some((h,i) => h !== headers[i + 5]))) throw Error('Use the five original assessment columns, optionally followed by ID, Parent ID and Type. Download the sample for the format.');
    const extended = headers.length === 8, data = {version:1,categories:[]};
    rows.forEach((row,index) => {
      if (row.length !== headers.length) throw Error('CSV row ' + (index + 2) + ' has the wrong number of columns.');
      if (!row[0].trim()) throw Error('Every CSV row needs a category.');
      if (![row[3], row[4]].every(value => STATUSES.includes(value))) throw Error('CSV row ' + (index + 2) + ': assessments must be blank, YES, NO or NA.');
    });
    if (extended) {
      const nodes = new Map();
      rows.forEach(row => {
        const [cat,sub,cap,currentOps,futureOps,id,parentId,type] = row;
        if (!['category','subcategory','capability'].includes(type) || nodes.has(id)) throw Error('Each imported row needs a valid type and unique ID.');
        if ((type === 'category' && (sub || cap || parentId)) || (type === 'subcategory' && (!sub || cap || !parentId)) || (type === 'capability' && (!cap || !parentId))) throw Error('An imported row has an inconsistent hierarchy.');
        const node = {id, name:type === 'category' ? cat : type === 'subcategory' ? sub : cap, currentOps, futureOps};
        if (type !== 'capability') node.capabilities = [];
        if (type === 'category') node.subcategories = [];
        nodes.set(id, {node,type,parentId,cat,sub});
      });
      nodes.forEach(entry => {
        const {node,type,parentId,cat,sub} = entry;
        if (type === 'category') {data.categories.push(node); return;}
        const parent = nodes.get(parentId);
        if (!parent || parent.type === 'capability' || parent.cat !== cat || (type === 'subcategory' && parent.type !== 'category') || (type === 'capability' && (parent.type === 'category' ? Boolean(sub) : parent.sub !== sub))) throw Error('A parent ID or category/subcategory path does not match.');
        (type === 'subcategory' ? parent.node.subcategories : parent.node.capabilities).push(node);
      });
    } else {
      const categories = new Map(), explicit = new Set(); let sequence = 0;
      const make = name => ({id:'import-'+(++sequence),name,currentOps:'',futureOps:''});
      rows.forEach(([catName,subName,capName,currentOps,futureOps]) => {
        let category = categories.get(catName);
        if (!category) {category = {...make(catName),subcategories:[],capabilities:[]}; categories.set(catName,category); data.categories.push(category);}
        let parent = category;
        if (subName) {
          parent = category.subcategories.find(sub => sub.name === subName);
          if (!parent) {parent = {...make(subName),capabilities:[]}; category.subcategories.push(parent);}
        }
        if (capName) parent.capabilities.push({...make(capName),currentOps,futureOps});
        else {if (explicit.has(parent.id)) throw Error('A category or subcategory assessment is repeated.'); explicit.add(parent.id); parent.currentOps = currentOps; parent.futureOps = futureOps;}
      });
    }
    return validate(data);
  }
  function importFile(text, isJSON) {
    if (typeof text !== 'string' || text.length > 2000000) throw Error('Use a file smaller than 2 MB.');
    if (!isJSON) return importCSV(text);
    let parsed; try { parsed = JSON.parse(text); } catch (_) {throw Error('The JSON file could not be read.');}
    return validate(parsed);
  }
  const api = {clone,walk,validate,find,update,add,remove,clear,stats,visibleIds,parseCSV,exportCSV,importCSV,importFile};
  if (typeof module === 'object' && module.exports) module.exports = api; else root.P3MModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
