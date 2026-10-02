// Hand-chosen teaching weights inherited from the earlier graph explorer.
// They are not empirical measures of importance or authority.
export const PREDICATE_WEIGHTS = {
  workflow: 2.5, includes: 1.5, produces: 2, enables: 2.5, informs: 2,
  mayInform: 2.5, affects: 1.5, methodFor: 1.5, techniqueFor: 1.5,
  toolFor: 1.2, foundationFor: 2, creates: 1.2, delegates: 1,
  responsible: 2, performs: 2, manages: 1.5, authorizes: 1.5,
  generates: 1.2, documents: 1, emphasizes: 1.2, adapts: 1,
  utilizes: 1.4, structures: 1.3
};

export const relationshipKey = link => `${link.source}|${link.target}|${link.type}`;

export function weightedDegrees(nodes, links) {
  const scores = Object.fromEntries(nodes.map(node => [node.id, 0]));
  links.forEach(link => {
    const weight = PREDICATE_WEIGHTS[link.type] ?? 1;
    if (Object.hasOwn(scores, link.source)) scores[link.source] += weight;
    if (Object.hasOwn(scores, link.target)) scores[link.target] += weight;
  });
  return scores;
}

// Walk only the supplied graph slice. Hidden concepts cannot bridge a traversal.
export function reachableSubgraph(nodes, links, originId, direction) {
  const visibleIds = new Set(nodes.map(node => node.id));
  const nodeIds = new Set();
  const linkKeys = new Set();
  if (!visibleIds.has(originId)) return { nodeIds, linkKeys };
  nodeIds.add(originId);
  const stack = [originId];
  while (stack.length) {
    const current = stack.pop();
    links.forEach(link => {
      if (!visibleIds.has(link.source) || !visibleIds.has(link.target)) return;
      const incoming = direction === 'upstream';
      if ((incoming ? link.target : link.source) !== current) return;
      const next = incoming ? link.source : link.target;
      linkKeys.add(relationshipKey(link));
      if (!nodeIds.has(next)) { nodeIds.add(next); stack.push(next); }
    });
  }
  return { nodeIds, linkKeys };
}
