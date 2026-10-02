const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../library/apps/p3m-capability-review/model.js');
const example = require('../library/apps/p3m-capability-review/example.js');
const T = require('../library/apps/concept-triad-builder/model.js');

test('source inventory retains 110 leaves and distinguishes unanswered targets from confirmed gaps', () => {
  const data = P.validate(example), counts = {category:0,subcategory:0,capability:0};
  P.walk(data,(_,type) => counts[type]++);
  assert.deepEqual(counts,{category:4,subcategory:21,capability:110});
  assert.deepEqual(P.stats(data),{leaves:110,currentReviewed:41,currentPresent:41,futureRequired:98,gaps:0,unknownTargets:58,scopeChanges:0,parentJudgements:14});
});

test('confirmed absence, unknown and outside scope remain different target states', () => {
  const source = {version:1,categories:[{id:'c',name:'Office',currentOps:'YES',futureOps:'YES',subcategories:[],capabilities:[
    {id:'a',name:'A',currentOps:'NO',futureOps:'YES'},
    {id:'b',name:'B',currentOps:'',futureOps:'YES'},
    {id:'d',name:'D',currentOps:'NA',futureOps:'YES'},
    {id:'e',name:'E',currentOps:'YES',futureOps:'NO'}]}]};
  const stats = P.stats(source);
  assert.equal(stats.gaps,1); assert.equal(stats.unknownTargets,1); assert.equal(stats.scopeChanges,1); assert.equal(stats.currentReviewed,3); assert.equal(stats.leaves,4);
});

test('parent-only judgement preserves children; explicit cascading updates every descendant', () => {
  const data = P.validate(example), id = data.categories[0].id;
  const separate = P.update(data,id,'currentOps','NO');
  assert.equal(P.stats(separate).currentPresent,41);
  const bulk = P.update(data,id,'currentOps','NO',true);
  const first = bulk.categories[0];
  for (const sub of first.subcategories) {assert.equal(sub.currentOps,'NO'); for (const cap of sub.capabilities) assert.equal(cap.currentOps,'NO');}
  for (const cap of first.capabilities) assert.equal(cap.currentOps,'NO');
  assert.equal(data.categories[0].currentOps,'');
});

test('editing and removing one duplicate name uses identity and preserves its sibling', () => {
  const parent = example.categories[0].id;
  let data = P.add(example,parent,'New Capability','new-a'); data = P.add(data,parent,'New Capability','new-b');
  data = P.update(data,'new-b','name','Changed second');
  assert.equal(P.find(data,'new-a').node.name,'New Capability');
  data = P.update(data,'new-b','name','New Capability'); data = P.remove(data,'new-b');
  assert.equal(P.find(data,'new-a').node.name,'New Capability'); assert.throws(() => P.find(data,'new-b'));
});

test('extended CSV restores the full edited hierarchy, all blanks, duplicates and punctuation', () => {
  let data = P.clear(example), parent = data.categories[0].subcategories[0].id;
  data = P.update(data,parent,'name','Pipeline, "approval"\nreview');
  data = P.add(data,parent,'New, "quoted"\ncapability','new-one');
  data = P.add(data,parent,'New, "quoted"\ncapability','new-two');
  data = P.update(data,'new-two','currentOps','NA');
  assert.deepEqual(P.importCSV(P.exportCSV(data)),data);
  assert.deepEqual(P.importFile(JSON.stringify(data),true),data);
});

test('legacy CSV accepts empty unquoted cells and custom capabilities absent from the template', () => {
  const csv = 'Category,Subcategory,Capability,Current Operations,Future Operations\r\nOffice,,,YES,YES\r\nOffice,Support,,,YES\r\nOffice,Support,New custom capability,,YES\r\nOffice,,Direct capability,NO,YES\r\n';
  const data = P.importCSV(csv), stats = P.stats(data);
  assert.equal(data.categories[0].subcategories[0].capabilities[0].name,'New custom capability');
  assert.equal(stats.leaves,2); assert.equal(stats.gaps,1); assert.equal(stats.unknownTargets,1);
});

test('header-only, unrelated, invalid-status and unfinished CSV imports fail without mutating the worksheet', () => {
  const before = JSON.stringify(example);
  for (const input of ['Category,Subcategory,Capability,Current Operations,Future Operations\n','wrong,headings\n1,2',
    'Category,Subcategory,Capability,Current Operations,Future Operations\nOffice,,A,MAYBE,YES',
    'Category,Subcategory,Capability,Current Operations,Future Operations\n"unfinished']) assert.throws(() => P.importCSV(input));
  assert.equal(JSON.stringify(example),before);
});

test('extended CSV rejects orphan IDs and duplicate IDs instead of silently losing rows', () => {
  const data = P.clear(example); const rows = P.parseCSV(P.exportCSV(data));
  const stringify = rows => rows.map(row => row.map(v => JSON.stringify(v)).join(',')).join('\n');
  const orphan = rows.map(row => [...row]); orphan[2][6] = 'missing-parent';
  assert.throws(() => P.importCSV(stringify(orphan)),/parent ID/);
  const dup = rows.map(row => [...row]); dup[2][5] = dup[1][5];
  assert.throws(() => P.importCSV(stringify(dup)),/unique ID/);
});

test('unknown-target and gap filters include the right leaves and their hierarchy context', () => {
  let data = P.validate(example); const leaf = data.categories[0].subcategories[0].capabilities[1];
  assert.equal(P.visibleIds(data,'','gaps').size,0);
  data = P.update(data,leaf.id,'currentOps','NO');
  const ids = P.visibleIds(data,'Pipeline','gaps');
  assert.deepEqual([...ids].sort(),[leaf.id,data.categories[0].id,data.categories[0].subcategories[0].id].sort());
  assert.ok(!P.visibleIds(data,'','unknown').has(leaf.id));
  assert.equal(P.visibleIds(data,'not a real capability').size,0);
});

test('clear retains custom names and rows but resets current and future decisions', () => {
  const data = P.add(example,example.categories[0].id,'Extra custom row','extra'); const cleared = P.clear(data);
  assert.equal(P.stats(cleared).leaves,111); assert.equal(P.stats(cleared).futureRequired,0); assert.equal(P.stats(cleared).currentReviewed,0);
  assert.equal(P.find(cleared,'extra').node.name,'Extra custom row'); assert.equal(P.stats(example).currentPresent,41);
});

test('invalid JSON structure, duplicate IDs and invalid row names are rejected', () => {
  assert.throws(() => P.importFile('{',true));
  assert.throws(() => P.validate({version:1,categories:[{}]}));
  assert.throws(() => P.add(example,example.categories[0].id,'Duplicate ID',example.categories[0].id));
  assert.throws(() => P.update(example,example.categories[0].id,'name','   '));
  assert.throws(() => P.update(example,example.categories[0].id,'currentOps','MAYBE'));
});

test('triad sequential entry preserves multiword concepts and never mutates the earlier draft', () => {
  const one = T.addConcept(null,'  How we work  ','  Central control ');
  const two = T.addConcept(one,'ignored','Local autonomy');
  const three = T.addConcept(two,'ignored','Learning through apprenticeship');
  assert.deepEqual(one,{title:'How we work',concepts:['Central control']});
  assert.deepEqual(T.triad('one',three.title,three.concepts),{id:'one',title:'How we work',concepts:['Central control','Local autonomy','Learning through apprenticeship']});
  assert.throws(() => T.addConcept(three,'','Fourth'));
});

test('triad validation rejects blank or incomplete concepts and permits ordinary punctuation', () => {
  assert.throws(() => T.addConcept(null,'Title','   '));
  assert.throws(() => T.triad('a','Title',['One','Two']));
  assert.throws(() => T.triad('a','Title',['One','Two',' ']));
  assert.equal(T.triad('a','Who owns “quality”?',['A & B','<local>','Another view']).concepts[1],'<local>');
});

test('editing one triad with a duplicate title does not change another', () => {
  const a = T.triad('a','Same title',['one','two','three']), b = T.triad('b','Same title',['one','two','three']);
  const next = T.replace([a,b],'b','Changed',['a','b','c']);
  assert.deepEqual(next[0],a); assert.equal(next[1].title,'Changed'); assert.equal(b.title,'Same title');
  assert.throws(() => T.replace([a],'missing','T',['a','b','c']));
});

test('triad saved file round-trips completed cards and an unfinished draft', () => {
  const data = {version:1,triads:[T.triad('a','A topic',['Two words','More words','Third possibility'])],draft:{title:'Draft topic',concepts:['First thought','Second thought']}};
  assert.deepEqual(T.parse(JSON.stringify(data)),data);
  assert.throws(() => T.parse(JSON.stringify({...data,triads:[data.triads[0],data.triads[0]]})),/unique ID/);
  assert.throws(() => T.parse(JSON.stringify({...data,draft:{title:'T',concepts:['a','b','c']}})),/one or two/);
  assert.throws(() => T.parse('{'));
});
