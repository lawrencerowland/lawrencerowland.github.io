(function (root) {
  'use strict';
  const prefixes = {
    hs2: 'https://example.org/hs2/', example: 'https://example.org/tokyo-stadium/',
    dica: 'https://w3id.org/digitalconstruction/0.5/Agents#', dice: 'https://w3id.org/digitalconstruction/0.5/Entities#',
    dicp: 'https://w3id.org/digitalconstruction/0.5/Processes#', dici: 'https://w3id.org/digitalconstruction/0.5/Information#',
    dicm: 'https://w3id.org/digitalconstruction/0.5/Materials#', dicv: 'https://w3id.org/digitalconstruction/0.5/Variables#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#', rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    dcterms: 'http://purl.org/dc/terms/', xsd: 'http://www.w3.org/2001/XMLSchema#', owl: 'http://www.w3.org/2002/07/owl#'
  };
  const endpoint = value => typeof value === 'object' && value ? value.id : value;
  const expand = value => value.replace(/^([A-Za-z]+):/, (all, p) => prefixes[p] || all);
  const qname = value => {
    for (const [p, base] of Object.entries(prefixes)) if (value.startsWith(base)) return p + ':' + value.slice(base.length);
    return value;
  };
  function validate(graph) {
    const ids = new Set(), errors = [];
    for (const n of graph.nodes) {
      if (!n.id || ids.has(n.id)) errors.push('Missing or duplicate node: ' + n.id);
      ids.add(n.id);
      if (!n.label || !n.type) errors.push('Missing label or type: ' + n.id);
    }
    const edges = new Set();
    for (const e of graph.links) {
      if (!ids.has(endpoint(e.source)) || !ids.has(endpoint(e.target))) errors.push('Unresolved edge: ' + e.id);
      if (!e.id || edges.has(e.id)) errors.push('Missing or duplicate edge ID: ' + e.id);
      edges.add(e.id);
    }
    return errors;
  }
  function neighbours(graph, id) {
    const ids = new Set([id]);
    graph.links.forEach(e => { if (endpoint(e.source) === id) ids.add(endpoint(e.target)); if (endpoint(e.target) === id) ids.add(endpoint(e.source)); });
    return ids;
  }
  function roles(graph, id) {
    const targets = new Set(graph.links.filter(e => e.predicate === prefixes.dice + 'hasRole' && endpoint(e.source) === id).map(e => endpoint(e.target)));
    return graph.nodes.filter(n => targets.has(n.id));
  }
  function filter(graph, options = {}) {
    const types = options.types ? new Set(options.types) : null;
    const kind = options.kind || '';
    const query = (options.query || '').trim().toLowerCase();
    const typeNodes = graph.nodes.filter(n => !types || types.has(n.type));
    const searchable = n => [n.label, n.description, n.id, n.ontologyClass, n.rdfType, ...(n.aliases || []), ...Object.values(n.props || {}), n.refId, n.contractPackage].join(' ').toLowerCase();
    const matches = new Set(typeNodes.filter(n => !query || searchable(n).includes(query)).map(n => n.id));
    let shown = new Set(matches);
    if (query && options.includeNeighbours) for (const id of matches) for (const neighbour of neighbours(graph, id)) shown.add(neighbour);
    if (options.focus) shown = new Set([...shown].filter(id => neighbours(graph, options.focus).has(id)));
    const nodes = typeNodes.filter(n => shown.has(n.id)), ids = new Set(nodes.map(n => n.id));
    const links = graph.links.filter(e => ids.has(endpoint(e.source)) && ids.has(endpoint(e.target)) && (!kind || e.kind === kind));
    return {nodes, links, matches};
  }
  function triples(graph) {
    if (graph.id !== 'hs2') throw new Error('RDF export is defined for the HS2 model only.');
    const rows = [], byId = new Map(graph.nodes.map(n => [n.id, n]));
    const add = (s, p, o, oType = 'literal') => { if (o !== undefined && o !== null && o !== '') rows.push({s, p, o: String(o), oType}); };
    const dataset = prefixes.hs2;
    add(dataset, prefixes.rdfs + 'label', graph.title);
    add(dataset, prefixes.dcterms + 'description', graph.boundary);
    add(dataset, prefixes.dcterms + 'created', '2026-02-04');
    add(dataset, prefixes.dcterms + 'modified', '2026-10-03');
    add(dataset, prefixes.dcterms + 'source', graph.source.url, 'uri');
    graph.nodes.forEach(n => {
      add(n.uri, prefixes.rdf + 'type', n.rdfType, 'uri');
      add(n.uri, prefixes.rdfs + 'label', n.label);
      add(n.uri, prefixes.rdfs + 'comment', n.description);
      (n.sources || []).forEach(source => add(n.uri, prefixes.dcterms + 'source', source, 'uri'));
      ['contractPackage', 'award', 'refId', 'evidenceStatus'].forEach(field => add(n.uri, prefixes.hs2 + field, n[field]));
      if (n.legacy) add(n.uri, prefixes.hs2 + 'originalMetadata', JSON.stringify(n.legacy));
      if (n.correctionSource) add(n.uri, prefixes.hs2 + 'correctionSource', n.correctionSource, 'uri');
    });
    graph.links.forEach(e => add(byId.get(endpoint(e.source)).uri, e.predicate, byId.get(endpoint(e.target)).uri, 'uri'));
    const unique = new Map(rows.map(row => [JSON.stringify(row), row]));
    return [...unique.values()];
  }
  // Full IRI terms and JSON-style string escaping form a strict, easily round-tripped Turtle subset.
  function iri(value) {
    if (!/^https?:\/\//.test(value) || /[<>"{}|^`\\\s]/.test(value)) throw new Error('Unsafe or invalid RDF IRI: ' + value);
    return '<' + value + '>';
  }
  function literal(value) {
    return '"' + String(value).replace(/[\\"\u0000-\u001f\u007f]/g, c => ({'\\':'\\\\','"':'\\"','\n':'\\n','\r':'\\r','\t':'\\t'}[c] || '\\u' + c.charCodeAt(0).toString(16).padStart(4,'0'))) + '"';
  }
  function turtle(graph) {
    return '# HS2 editorial teaching snapshot; see dataset description and per-node evidenceStatus.\n' + triples(graph).map(t => `${iri(t.s)} ${iri(t.p)} ${t.oType === 'uri' ? iri(t.o) : literal(t.o)} .`).join('\n') + '\n';
  }
  function csv(graph) {
    const quote = value => '"' + String(value ?? '').replace(/"/g, '""') + '"';
    const fields = [...new Set(['id','label','type',...graph.nodes.flatMap(n=>Object.keys(n))])];
    const value = item => item && typeof item === 'object' ? JSON.stringify(item) : item;
    return [fields.map(quote).join(','), ...graph.nodes.map(n => fields.map(f => quote(value(n[f]))).join(','))].join('\r\n');
  }
  const api = {prefixes, endpoint, expand, qname, validate, neighbours, roles, filter, triples, turtle, csv};
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.OntologyModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
