/* Small, dependency-free calculations. Supplied narrative is never an input to them. */
(function (root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./data.js') : root.DependencyAtlasData);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DependencyAtlas = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (data) {
  'use strict';
  const DAY = 86400000;
  const statuses = ['complete', 'active', 'planned', 'at-risk', 'delayed', 'milestone'];
  const clone = value => JSON.parse(JSON.stringify(value));
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const record = value => value && typeof value === 'object' && !Array.isArray(value);
  const named = value => typeof value === 'string' && value.trim().length > 0;

  function graph(scenario) {
    assert(record(scenario) && record(scenario.hierarchy), 'A grouped dependency graph is required.');
    const groups = scenario.hierarchy.children;
    assert(Array.isArray(groups) && groups.length > 0 && groups.length <= 100, 'Expected 1–100 groups.');
    const nodes = [], byName = new Map(), groupNames = new Set();
    groups.forEach(group => {
      assert(record(group) && named(group.name) && !groupNames.has(group.name), 'Group names must be unique and nonempty.');
      groupNames.add(group.name);
      assert(Array.isArray(group.children) && group.children.length > 0, 'Every group needs a node.');
      group.children.forEach(leaf => {
        assert(record(leaf) && named(leaf.name) && !leaf.children && !byName.has(leaf.name), 'Leaf names must be unique and nonempty.');
        const node = { name: leaf.name, group: group.name, incoming: [], outgoing: [], incident: 0 };
        nodes.push(node); byName.set(node.name, node);
      });
    });
    assert(nodes.length <= 1000, 'At most 1000 nodes are supported.');
    assert(Array.isArray(scenario.imports) && scenario.imports.length <= 20000, 'Invalid dependency list.');
    const unique = new Set();
    const edges = scenario.imports.map(edge => {
      assert(record(edge) && byName.has(edge.s) && byName.has(edge.t), 'Every dependency endpoint must exist.');
      const key = JSON.stringify([edge.s, edge.t]);
      assert(!unique.has(key), 'Duplicate directed dependency.'); unique.add(key);
      const source = byName.get(edge.s), target = byName.get(edge.t);
      source.outgoing.push(target.name); target.incoming.push(source.name);
      source.incident += 1; if (source !== target) target.incident += 1;
      return { s: edge.s, t: edge.t, sourceGroup: source.group, targetGroup: target.group, crossGroup: source.group !== target.group };
    });
    return { nodes, edges, groups: groups.map(group => ({ name: group.name, nodes: group.children.map(n => n.name) })) };
  }
  function graphSummary(scenario) {
    const g = graph(scenario), maximum = Math.max(...g.nodes.map(n => n.incident));
    return { nodes: g.nodes.length, groups: g.groups.length, edges: g.edges.length,
      crossGroup: g.edges.filter(e => e.crossGroup).length,
      internal: g.edges.filter(e => !e.crossGroup).length,
      busiest: g.nodes.filter(n => n.incident === maximum).map(n => ({ name: n.name, incident: n.incident, incoming: n.incoming.length, outgoing: n.outgoing.length })) };
  }
  function visibleEdges(scenario, filter = 'all') {
    assert(['all', 'cross', 'internal'].includes(filter), 'Unknown dependency filter.');
    return graph(scenario).edges.filter(edge => filter === 'all' || (filter === 'cross' ? edge.crossGroup : !edge.crossGroup));
  }
  function nodeDetail(scenario, name) {
    const found = graph(scenario).nodes.find(n => n.name === name);
    assert(found, 'Unknown dependency node.'); return found;
  }
  function dateValue(iso) {
    assert(typeof iso === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(iso), 'Dates must use YYYY-MM-DD.');
    const value = Date.parse(iso + 'T00:00:00Z');
    assert(Number.isFinite(value) && new Date(value).toISOString().slice(0, 10) === iso, 'Invalid calendar date.');
    return value;
  }
  function elapsedDays(start, end) {
    const duration = (dateValue(end) - dateValue(start)) / DAY;
    assert(duration >= 0, 'End date must not precede start date.'); return duration;
  }
  function tasks(scenario) {
    assert(record(scenario) && Array.isArray(scenario.streams) && scenario.streams.length > 0 && scenario.streams.length <= 100, 'Expected 1–100 timeline facets.');
    const seenStreams = new Set(), all = [];
    scenario.streams.forEach((stream, streamIndex) => {
      assert(record(stream) && named(stream.name) && !seenStreams.has(stream.name) && Array.isArray(stream.tasks) && stream.tasks.length > 0, 'Facets need unique names and at least one item.');
      seenStreams.add(stream.name); const names = new Set();
      stream.tasks.forEach((task, taskIndex) => {
        assert(record(task) && named(task.task) && !names.has(task.task), 'Task names must be unique within a facet.'); names.add(task.task);
        assert(statuses.includes(task.status) && typeof task.milestone === 'boolean', 'Invalid task status or milestone flag.');
        const days = elapsedDays(task.start, task.end);
        assert(task.milestone ? days === 0 && task.status === 'milestone' : days > 0 && task.status !== 'milestone', 'Milestones require one date; activities require a positive interval.');
        all.push({ ...task, id: `${streamIndex}:${taskIndex}`, stream: stream.name, days });
      });
    });
    assert(all.length <= 2000, 'At most 2000 timeline items are supported.'); return all;
  }
  function timelineSummary(scenario) {
    const all = tasks(scenario), activities = all.filter(t => !t.milestone), overlaps = [];
    const statusCounts = Object.fromEntries(statuses.map(s => [s, all.filter(t => t.status === s).length]));
    // Positive intersection of half-open calendar intervals. A milestone or a shared endpoint has zero duration.
    for (let i = 0; i < activities.length; i++) for (let j = i + 1; j < activities.length; j++) {
      const a = activities[i], b = activities[j]; if (a.stream === b.stream) continue;
      const start = Math.max(dateValue(a.start), dateValue(b.start)), end = Math.min(dateValue(a.end), dateValue(b.end));
      if (end > start) overlaps.push({ a: a.id, b: b.id, start: new Date(start).toISOString().slice(0, 10), end: new Date(end).toISOString().slice(0, 10), days: (end - start) / DAY });
    }
    const min = Math.min(...all.map(t => dateValue(t.start))), max = Math.max(...all.map(t => dateValue(t.end)));
    return { items: all.length, activities: activities.length, milestones: all.length - activities.length, facets: scenario.streams.length, statusCounts,
      start: new Date(min).toISOString().slice(0, 10), end: new Date(max).toISOString().slice(0, 10), days: (max - min) / DAY, overlaps };
  }
  function monthTicks(start, end) {
    const a = dateValue(start), b = dateValue(end); assert(a <= b, 'Invalid date extent.');
    const d = new Date(a), output = []; d.setUTCDate(1); if (+d < a) d.setUTCMonth(d.getUTCMonth() + 1);
    while (+d <= b) { output.push(d.toISOString().slice(0, 10)); d.setUTCMonth(d.getUTCMonth() + 1); } return output;
  }
  function radialLayout(scenario) {
    const g = graph(scenario), count = g.nodes.length + g.groups.length, step = Math.PI * 2 / count;
    let index = 0;
    const nodes = [], groups = [];
    const point = (angle, radius) => ({ x: Math.sin(angle) * radius, y: -Math.cos(angle) * radius });
    g.groups.forEach(group => {
      const members = group.nodes.map(name => { const angle = (index++ + .5) * step; const n = { name, group: group.name, angle, ...point(angle, 220) }; nodes.push(n); return n; });
      index++;
      const start = members[0].angle - step * .38, end = members[members.length - 1].angle + step * .38, angle = (start + end) / 2;
      groups.push({ name: group.name, start, end, angle, ...point(angle, 110) });
    }); return { nodes, groups };
  }
  function hierarchyRoute(scenario, source, target) {
    const layout = radialLayout(scenario), a = layout.nodes.find(n => n.name === source), b = layout.nodes.find(n => n.name === target);
    assert(a && b, 'Unknown bundle endpoint.');
    const ga = layout.groups.find(g => g.name === a.group), gb = layout.groups.find(g => g.name === b.group);
    return (ga === gb ? [a, ga, b] : [a, ga, { x: 0, y: 0 }, gb, b]).map(p => ({ x: p.x, y: p.y }));
  }
  function bundledPath(points, beta = .82) {
    assert(Array.isArray(points) && points.length >= 2 && points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)), 'A finite route is required.');
    assert(Number.isFinite(beta) && beta >= 0 && beta <= 1, 'Bundle strength must be between 0 and 1.');
    const a = points[0], b = points[points.length - 1];
    if (beta === 0) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    const blended = points.map((p, i) => { const t = i / (points.length - 1); return { x: beta * p.x + (1 - beta) * (a.x + t * (b.x - a.x)), y: beta * p.y + (1 - beta) * (a.y + t * (b.y - a.y)) }; });
    // Convert uniform cubic B-spline segments to cubic Bezier coordinates; repeat endpoint controls.
    const controls = [blended[0], blended[0], ...blended, blended[blended.length - 1], blended[blended.length - 1]];
    const f = n => Number(n.toFixed(4)); let path = `M ${f(a.x)} ${f(a.y)}`;
    for (let i = 0; i <= controls.length - 4; i++) {
      const [, p1, p2, p3] = controls.slice(i, i + 4);
      path += ` C ${f((2 * p1.x + p2.x) / 3)} ${f((2 * p1.y + p2.y) / 3)} ${f((p1.x + 2 * p2.x) / 3)} ${f((p1.y + 2 * p2.y) / 3)} ${f((p1.x + 4 * p2.x + p3.x) / 6)} ${f((p1.y + 4 * p2.y + p3.y) / 6)}`;
    } return path;
  }
  const defaultState = () => ({ app: 'project-dependency-atlas', version: 1, view: 'bundle', bundle: 'pennine', timeline: 'portfolio', node: null, task: null, links: 'all', status: 'all' });
  function validateState(value) {
    assert(record(value), 'A view object is required.');
    const keys = Object.keys(defaultState()); assert(Object.keys(value).length === keys.length && keys.every(k => own(value, k)), 'The view has missing or unknown fields.');
    assert(value.app === 'project-dependency-atlas' && value.version === 1, 'Unsupported view file.');
    assert(['bundle', 'timeline'].includes(value.view) && own(data.bundles, value.bundle) && own(data.timelines, value.timeline), 'Unknown view or example.');
    assert(['all', 'cross', 'internal'].includes(value.links) && ['all', ...statuses].includes(value.status), 'Unknown view filter.');
    assert(value.node === null || (typeof value.node === 'string' && graph(data.bundles[value.bundle]).nodes.some(n => n.name === value.node)), 'Node does not belong to this example.');
    const all = tasks(data.timelines[value.timeline]);
    assert(value.task === null || (typeof value.task === 'string' && all.some(t => t.id === value.task && (value.status === 'all' || t.status === value.status))), 'Task is missing or excluded by the status filter.');
    return clone(value);
  }
  function parseState(text) { assert(typeof text === 'string' && text.length <= 20000, 'View file is too large.'); return validateState(JSON.parse(text)); }
  function serializeState(value) { return JSON.stringify(validateState(value), null, 2); }
  return { data, statuses, graph, graphSummary, visibleEdges, nodeDetail, dateValue, elapsedDays, tasks, timelineSummary, monthTicks, radialLayout, hierarchyRoute, bundledPath, defaultState, validateState, parseState, serializeState };
});
