'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { test } = require('node:test');
const root = path.resolve(__dirname, '..');
const B = require('../wider-interest/john-burnet-of-barns-journey.js');
const C = require('../wider-interest/caesars-gallic-wars-rivers.js');

test('Burnet retains all 24 supplied stages and 76 legs without invented connectors', () => {
  assert.equal(B.journeyData.length, 24);
  assert.equal(B.journeyData.reduce((sum, stage) => sum + stage.legs.length, 0), 76);
  // Hash the original route data, not the rendering, to guard the preservation requirement.
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(B.journeyData)).digest('hex'), '59069a825f0ee13524686cd106614d257945335bc8950764896e1cae3027d16c');
  const gapStage = B.journeyData.find(stage => stage.day === 'US7+1');
  assert.deepEqual(B.routeGaps(gapStage), ['Newlands_Moor']);
  for (const stage of B.journeyData) for (const leg of stage.legs) for (const grid of [leg[1], leg[3]]) {
    const point = B.OsGridRef.parse(grid).toLatLon();
    assert.ok(point.lat > 55 && point.lat < 56.2 && point.lon > -4.5 && point.lon < -2.8, grid);
  }
});

test('British National Grid uses OSGB36 then transforms to WGS84', () => {
  // Published Caister water tower example: TG 51409 13177.
  // The Helmert approximation differs from OSTN15 by metres, so use 0.00005 degrees.
  const point = B.OsGridRef.parse('TG5140913177').toLatLon();
  assert.ok(Math.abs(point.lat - 52.65798) < 0.00005);
  assert.ok(Math.abs(point.lon - 1.71605) < 0.00005);
  assert.equal(B.OsGridRef.parse('nt240390').easting, 324000);
  assert.equal(B.OsGridRef.parse('NT240390').northing, 639000);
  for (const input of ['NT123', 'NI1234', 'AA1234', '', 'TG123456789012']) assert.throws(() => B.OsGridRef.parse(input), /Invalid OS Grid/);
});

test('Caesar preserves every original selection identifier while removing 38 duplicates', () => {
  assert.equal(C.references.length, 99);
  const legacy = C.references.flatMap(ref => ref.legacySeq).sort((a, b) => a - b);
  assert.deepEqual(legacy, Array.from({ length: 137 }, (_, i) => i + 1));
  assert.equal(new Set(C.references.map(ref => ref.sentence)).size, 99);
  assert.deepEqual(C.references.map(ref => ref.seq), Array.from({ length: 99 }, (_, i) => i + 1));
  let lastBook = 0, lastChapter = 0;
  for (const ref of C.references) {
    assert.ok(ref.book > lastBook || ref.book === lastBook && ref.chapter >= lastChapter);
    lastBook = ref.book; lastChapter = ref.chapter;
    assert.match(ref.sourceUrl, /^https:\/\/www\.gutenberg\.org\/cache\/epub\/10657\/pg10657\.html#id\d+$/);
    assert.ok(ref.rivers.length);
    for (const river of ref.rivers) assert.ok(C.riverLocations[river], river);
    assert.doesNotMatch(ref.sentence, /His responsis|Mittitur ad eos|Bohn \[|war with 40 Ambiorix/);
  }
});

test('all named rivers, restored text and source corrections survive the reading view', () => {
  assert.deepEqual(C.references[0].rivers, ['Garonne', 'Marne', 'Seine']);
  assert.match(C.references[19].sentence, /^That about 15,000 of them \[i\.e\. of the Germans\]/);
  assert.match(C.references[70].sentence, /L\. Minucius Basilus/);
  assert.deepEqual(C.references[93].rivers, ['Rhone']);
  assert.match(C.references[93].note, /Rhodanum/);
  assert.deepEqual(C.references[94].rivers, ['Rhine']);
  assert.equal(C.references[95].chapter, 90);
  assert.equal(C.references[96].book, 8);
  for (const seq of [35, 36, 73]) assert.ok(C.references[seq - 1].noteUrl);
});

test('search combines river and book filters, including accents, multiple rivers and no results', () => {
  assert.equal(C.filterReferences().length, 99);
  assert.deepEqual(C.filterReferences('', 'Marne').map(ref => ref.seq), [1]);
  assert.deepEqual(C.filterReferences('7.65').map(ref => ref.seq), [94, 95]);
  assert.ok(C.filterReferences('Rhône').length > 0);
  assert.ok(C.filterReferences('', 'Meuse').length > 0);
  assert.ok(C.filterReferences('', 'Po').length > 0);
  assert.ok(C.filterReferences('bridge', 'Rhone', '1').length > 0);
  assert.deepEqual(C.filterReferences('no river has this name', 'Rhone', '1'), []);
  assert.ok(C.filterReferences('', '', '8').every(ref => ref.book === 8));
});

function loadWithoutMap(file) {
  class Element {
    constructor(id = '') { this.id = id; this.children = []; this.listeners = {}; this.value = ''; this.dataset = {}; this.attributes = {}; this.textContent = ''; this.hidden = false; this.disabled = false; }
    append(...children) { this.children.push(...children); }
    prepend(...children) { this.children.unshift(...children); }
    replaceChildren(...children) { this.children = children; }
    setAttribute(name, value) { this.attributes[name] = value; }
    addEventListener(type, listener) { this.listeners[type] = listener; }
    focus() { this.focused = true; }
    fire(type) { this.listeners[type]?.call(this); }
  }
  const elements = new Map();
  const get = id => { if (!elements.has(id)) elements.set(id, new Element(id)); return elements.get(id); };
  const document = { getElementById: get, createElement: () => new Element(), querySelectorAll: () => get('items').children };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'wider-interest', file), 'utf8'), { document });
  return get;
}

test('Caesar still supports selection, filtering, empty results and reset if the map library fails', () => {
  const $ = loadWithoutMap('caesars-gallic-wars-rivers.js');
  assert.equal($('map').hidden, true);
  assert.equal($('count').textContent, '99 of 99 passages');
  assert.equal($('previous').disabled, true);
  $('next').fire('click');
  assert.match($('selection-title').textContent, /^Passage 2 /);
  $('river').value = 'Marne'; $('river').fire('change');
  assert.equal($('items').children.length, 1);
  assert.equal($('next').disabled, true);
  $('search').value = 'zzzz'; $('search').fire('input');
  assert.equal($('empty').hidden, false);
  assert.equal($('selection').hidden, true);
  $('clear').fire('click');
  assert.equal($('selection').hidden, false);
  assert.equal($('items').children.length, 99);
  assert.equal($('search').focused, true);
});

test('Burnet keeps all textual stages and explicit gaps usable when its map fails', () => {
  const $ = loadWithoutMap('john-burnet-of-barns-journey.js');
  assert.equal($('map').hidden, true);
  assert.equal($('stage').children.length, 24);
  assert.equal($('previous').disabled, true);
  $('next').fire('click');
  assert.match($('stage-title').textContent, /^US2 /);
  $('stage').value = '9'; $('stage').fire('change');
  assert.match($('stage-title').textContent, /^US7\+1 /);
  assert.ok($('legs').children.some(li => li.children.some(child => child.textContent.startsWith('Gap in supplied route'))));
  $('stage').value = '23'; $('stage').fire('change');
  assert.equal($('next').disabled, true);
});

test('Johnson milestone table stays aligned and the optional overlay toggles without changing dates', () => {
  const html = fs.readFileSync(path.join(root, 'wider-interest/johnsons-dictionary-project.html'), 'utf8');
  const table = html.match(/<table class="timeline">([\s\S]*?)<\/table>/)[1];
  for (const row of table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const columns = [...row[1].matchAll(/<(?:td|th)\b([^>]*)>/g)].reduce((sum, cell) => sum + Number(cell[1].match(/colspan="(\d+)"/)?.[1] || 1), 0);
    assert.equal(columns, 11, 'Every row must align with its ten calendar-year columns');
  }
  assert.doesNotMatch(html, /1952|\uFFFD/);
  assert.match(html, /illustrative placements for discussion/);
  const checkbox = { addEventListener(type, callback) { this.callback = callback; } }, phases = { hidden: true };
  vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], { document: { getElementById: id => id === 'show-phases' ? checkbox : phases } });
  checkbox.callback.call({ checked: true }); assert.equal(phases.hidden, false);
  checkbox.callback.call({ checked: false }); assert.equal(phases.hidden, true);
});

if (process.argv[2]) test('built historical apps and pictured tiles match the verified source', () => {
  const files = ['wider-interest/john-burnet-of-barns-journey.html','wider-interest/john-burnet-of-barns-journey.js','wider-interest/johnsons-dictionary-project.html','wider-interest/caesars_gallic_wars_rivers.html','wider-interest/caesars-gallic-wars-rivers.js','images/wider-interest/john-burnet.svg','images/wider-interest/johnsons-dictionary.svg','images/wider-interest/caesar-rivers.svg'];
  for (const file of files) assert.equal(fs.readFileSync(path.join(root, file), 'utf8'), fs.readFileSync(path.resolve(process.argv[2], file), 'utf8'), file);
});
