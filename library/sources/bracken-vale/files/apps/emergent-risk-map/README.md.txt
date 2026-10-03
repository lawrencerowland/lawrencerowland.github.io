# Emergent risk relationship map · 8.4

A typed local network that exposes combinations worth investigation: shared work windows, shared specialists and directed feedback cycles. It does not calculate risk probabilities.

## Construction and reference case

Nine fictional nodes and eleven dated, sourced relationships distinguish events, tasks, resources, a window and a risk. Edges distinguish may-affect, window-dependency, shared-resource, precedence and feedback; evidence character is recorded/hypothesis/unknown. Disabled edges stay in the register. Selected layers determine both the graph projection and the analysis.

Breadth-first traversal returns one shortest edge path per reachable node. Shared-parent checks flag a window/resource connected to tasks in more than one project; a common planning week is reported, but no resource capacity or probability is invented. Tarjan's strongly connected component algorithm identifies directed cycles. Mixed edge types are never multiplied.

The initial case has three patterns: WINDOW with E2/E3 across Larch and North Spur; SPECIALIST with E4/E5 in week 46; and the L-DESIGN/L-REVIEW/REWORK cycle E6/E8/E9. Pattern members are listed as a set, not falsely drawn as a serial path. The edge table gives exact topology. Hypothetical/unknown edges are dashed in the map.

A retained baseline supports comparison. Disabling E3 changes the WEATHER→N-REVIEW shortest path from E1/E3 to E1/E10/E11, while Larch's path stays unchanged. This is an alternate hypothetical route, not proof that an event will propagate. Reviews retain the full typed scenario; edits or layer changes stale them.

## Walkthrough

1. Use **Trace selected layers** from WEATHER and inspect the exact edge paths.
2. Read the shared-window/resource patterns and their sources; **Record interaction review** with a question and owner.
3. Open E3, uncheck enabled and **Apply scenario edge**.
4. Compare the changed North Spur path with the retained baseline and unchanged Larch path.
5. Copy the interaction register or explicitly **Use current scenario as baseline** with a name.

## Verification and boundaries

`node --test apps/emergent-risk-map/app.test.mjs` covers all three seeded patterns and exact edges, alternate-path removal behaviour, cycle break isolation, layer preservation, no-probability interpretation, snapshot staleness, fabricated-pattern import rejection, atomic invalid edges and escaping.

A normal risk list is simpler for independent concerns. This tool completes the bounded local graph intention, but does not prove common causation, actual capacity conflict, event timing or a numerical forecast. Quantitative propagation requires a separate calibrated model. Every source and scenario is invented. Root owns browser/publication checks.
