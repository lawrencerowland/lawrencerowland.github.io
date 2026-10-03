# Problem-to-solution map — working trial 6.3

A local shared-screen facilitation example for fictional Larch Junction Renewal (BVR-P01). It starts with nine typed nodes, eight directed relationships and one unresolved disagreement. It supports file exchange through the shared shell, not simultaneous collaboration.

## Implemented

- Add nodes as problem, evidence, hypothesis, intervention or outcome. Edit statements, owners and explicit evidence/assumptions.
- Add compatible typed relationships: evidence observes a problem; hypothesis explains a problem; intervention addresses a problem/hypothesis, tests a hypothesis, or contributes to an outcome.
- Remove links while retaining nodes and comments. Retype nodes with a recorded reason only when attached relationships remain meaningful.
- An intervention cannot be retyped as evidence. Add a separate evidence node for an actual observed result. Hypotheses and observations remain different types.
- Switch a type-column layer view, a problem-at-top tree-like view with cross-links and the complete relationship/node tables. Both graphical projections use the same node IDs and edges.
- Attach comments/disagreements to stable IDs. Record a resolution while preserving the original disagreement. Inspect candidate interventions and unresolved disagreements together.
- JSON bundles preserve comments, assumptions, retype history and resolutions. Shared shell supplies save/load/import/export/reset.

## Reference checks

Run `node --test apps/problem-solution-map/app.test.mjs`. Eight tests check projection identity, prohibited solution-to-observation relabelling, node/link/comment roundtrip, invalid typed relationships and retyping, preserved disagreement text, malformed data, escaped labelled controls and hostile presentation-field imports.

The initial competing hypotheses BVR-N4 and BVR-N5 both explain BVR-N1. BVR-N6 tests BVR-N4. Switching projections preserves all nine IDs and eight links but changes their coordinates. Attempting to retype BVR-N6 from intervention to evidence fails atomically.

## Limits and simpler practice

The second projection is a directed tree-like overview with preserved cross-links, not a claim that causes form a tree. Evidence is synthetic, explanations untested, and interventions planning hypotheses. There is no safe-working instruction or engineering design, concurrent editing, participant authentication or causal inference. A simple action/problem register may be sufficient; the additional value sought is preserving explanations, disagreements and tests in the same discussion. That practical benefit remains unmeasured.

Graph rendering ignores imported style/fill/stroke and extra edge-label properties. The renderer accepts only a closed projection of known text fields and computed finite coordinates.
