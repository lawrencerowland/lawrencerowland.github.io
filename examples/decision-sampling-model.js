/* The earlier example's authored tree, with relative sibling weights unchanged. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DecisionSampling = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

const treeData = {
    name: "Root",
    description: "Select SaaS Solution",
    children: [
        {
            name: "Budget",
            description: "< $10/user/month",
            transitionProbability: 0.6,
            children: [
                {
                    name: "Integration",
                    description: "Needs deep integration with existing tools",
                    transitionProbability: 0.7,
                    children: [
                        {
                            name: "Usability",
                            description: "Intuitive UI is crucial",
                            transitionProbability: 0.85,
                            children: [
                                {
                                    name: "Scalability",
                                    description: "Must scale to 500+ users",
                                    transitionProbability: 0.75,
                                    children: [
                                      { name: "Solution A", description: "Meets all criteria", transitionProbability: 1.0 },
                                      { name: "Solution B", description: "Lacks scalability", transitionProbability: 0.0 }
                                    ]

                                },
                                {
                                    name: "Scalability",
                                    description: "Must scale to 500+ users",
                                     transitionProbability: 0.25,
                                    children: [
                                        { name: "Solution C", description: "Good, but less intuitive", transitionProbability: 1.0 }
                                    ]
                                }

                            ]
                        },
                        {
                            name: "Usability",
                            description: "Intuitive UI is less of a priority",
                            transitionProbability: 0.15,
                            children: [
                                { name: "Solution D", description: "Excellent Integration, but difficult UI", transitionProbability: 1.0 }
                            ]
                        }

                    ]
                },
                 {
                    name: "Integration",
                    description: "Basic integration is sufficient",
                    transitionProbability: 0.3,
                    children: [
                       { name: "Solution E", transitionProbability: 1.0, description: "Cheap, limited integration" },
                       { name: "Solution F", transitionProbability: 1.0, description: "Cheap, limited integration" }
                    ]
                }
            ]
        },
        {
            name: "Budget",
            description: "> $10/user/month",
            transitionProbability: 0.4,
            children: [
                 {
                    name: "Features",
                    description: "Advanced Features",
                     transitionProbability: 0.8,
                    children: [
                       { name: "Solution G", transitionProbability: 1.0, description: "Expensive, but powerful" },
                       { name: "Solution H", transitionProbability: 1.0, description: "Expensive, but powerful" },

                    ]
                },
                {
                    name: "Features",
                    description: "Basic Features",
                    transitionProbability: 0.2,
                    children: [
                        { name: "Solution I", transitionProbability: 1.0, description: "Moderately expensive" }
                    ]
                }
            ]
        }
    ]
};

  // Compile without modifying the supplied tree. IDs identify positions, not labels.
  function compile(root) {
    const ancestors = new Set();
    function visit(node, id) {
      if (!node || typeof node !== 'object' || Array.isArray(node)) {
        throw new TypeError(`Expected a tree node at ${id}`);
      }
      if (ancestors.has(node)) throw new TypeError(`Cyclic tree at ${id}`);
      if (node.children !== undefined && !Array.isArray(node.children)) {
        throw new TypeError(`Expected a children array at ${id}`);
      }
      ancestors.add(node);
      const children = node.children || [];
      const result = { id, name: node.name, description: node.description ?? '', children: [] };
      if (children.length) {
        const weights = children.map((child, index) => {
          const weight = child && child.transitionProbability;
          if (typeof weight !== 'number' || !Number.isFinite(weight) || weight < 0) {
            throw new RangeError(`Expected a finite non-negative weight at ${id}.${index}`);
          }
          return weight;
        });
        // Scaling avoids overflow when finite weights have a very large sum.
        const largest = weights.reduce((maximum, weight) => Math.max(maximum, weight), 0);
        if (largest === 0) throw new RangeError(`Sibling weights must have a positive total at ${id}`);
        const scaled = weights.map(weight => weight / largest);
        const total = scaled.reduce((sum, weight) => sum + weight, 0);
        result.children = children.map((child, index) => ({
          probability: scaled[index] / total,
          node: visit(child, `${id}.${index}`)
        }));
      }
      ancestors.delete(node);
      return result;
    }
    return visit(root, 'r');
  }

  function leavesOf(root) {
    const leaves = [];
    function visit(node, probability, path) {
      const item = { id: node.id, name: node.name, description: node.description };
      const nextPath = [...path, item];
      if (!node.children.length) leaves.push({ ...item, path: nextPath, probability });
      else for (const child of node.children) visit(child.node, probability * child.probability, nextPath);
    }
    visit(root, 1, []);
    return leaves;
  }

  function enumerate(root = treeData) {
    return leavesOf(compile(root));
  }

  function sample(n, rng = Math.random, root = treeData) {
    if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('Sample count must be a non-negative safe integer');
    if (typeof rng !== 'function') throw new TypeError('rng must be a function');
    const compiled = compile(root);
    const leaves = leavesOf(compiled);
    const counts = Object.fromEntries(leaves.map(leaf => [leaf.id, 0]));
    for (let trial = 0; trial < n; trial++) {
      let node = compiled;
      while (node.children.length) {
        const roll = rng();
        if (typeof roll !== 'number' || !Number.isFinite(roll) || roll < 0 || roll >= 1) {
          throw new RangeError('rng must return a finite number in [0, 1)');
        }
        let cumulative = 0;
        let selected;
        for (const child of node.children) {
          if (child.probability === 0) continue;
          selected = child.node;
          cumulative += child.probability;
          if (roll < cumulative) break;
        }
        // The last positive child also covers any floating-point rounding gap.
        node = selected;
      }
      counts[node.id]++;
    }
    let mostFrequentId = null;
    let highest = 0;
    // Ties use declared leaf order, independently of the order of sampled arrivals.
    for (const leaf of leaves) {
      if (counts[leaf.id] > highest) {
        highest = counts[leaf.id];
        mostFrequentId = leaf.id;
      }
    }
    return { counts, total: n, mostFrequentId };
  }

  return { treeData, enumerate, sample };
});
