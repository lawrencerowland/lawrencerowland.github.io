import { describe, expect, test } from 'vitest';
import { reachableSubgraph, relationshipKey, weightedDegrees } from './graphExploration';
const nodes = ['a', 'b', 'c', 'd'].map(id => ({ id }));
const links = [
  { source: 'a', target: 'b', type: 'informs' },
  { source: 'b', target: 'c', type: 'enables' },
  { source: 'c', target: 'b', type: 'includes' },
  { source: 'd', target: 'a', type: 'produces' },
];
describe('preserved graph exploration', () => {
  test('weighted degree sums incident heuristic weights, not path count', () => {
    expect(weightedDegrees(nodes, links)).toEqual({ a: 4, b: 6, c: 4, d: 2 });
  });
  test('downstream traversal follows directed edges and terminates on cycles', () => {
    const result = reachableSubgraph(nodes, links, 'a', 'downstream');
    expect([...result.nodeIds].sort()).toEqual(['a', 'b', 'c']);
    expect([...result.linkKeys].sort()).toEqual(links.slice(0, 3).map(relationshipKey).sort());
  });
  test('upstream traversal reverses reachability without reversing recorded edges', () => {
    const result = reachableSubgraph(nodes, links, 'a', 'upstream');
    expect([...result.nodeIds].sort()).toEqual(['a', 'd']);
    expect([...result.linkKeys]).toEqual(['d|a|produces']);
  });
  test('hidden concepts cannot bridge a path even if their edges are supplied', () => {
    const result = reachableSubgraph(nodes.filter(node => node.id !== 'b'), links, 'a', 'downstream');
    expect([...result.nodeIds]).toEqual(['a']);
    expect(result.linkKeys.size).toBe(0);
  });
  test('excluded predicates and a hidden origin cannot enter the traversal', () => {
    const result = reachableSubgraph(nodes, links.filter(link => link.type !== 'enables'), 'a', 'downstream');
    expect([...result.nodeIds].sort()).toEqual(['a', 'b']);
    expect(reachableSubgraph(nodes, links, 'missing', 'upstream').nodeIds.size).toBe(0);
  });
});
