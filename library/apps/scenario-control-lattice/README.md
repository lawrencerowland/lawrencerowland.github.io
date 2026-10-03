# Scenario and control lattice

Reviewed 3 October 2026. Library home: **Data, evidence & assurance**.

A fictional distribution-centre go-live supplies six scenarios, five control tags and five evidence tags. Formal Concept Analysis groups these into eight concepts. A concept pairs every common attribute with every scenario having those attributes; individual scenario rows can contain different additional attributes.

## Retained

The original scenario stories, 6 × 10 input matrix, NextClosure enumeration and cover-relation lattice, hierarchy and force layouts, pan/zoom, selected extent/intent explanations, per-scenario detail, control/evidence separation, three gap reports, keyword search, help dialogs, local neighbourhood focus and reset.

## Corrected and improved

- Evidence is a recorded tag, not proof; an empty row does not prove a missing assessment, and a control tag does not prove effectiveness. Red nodes contain a flagged scenario, not necessarily exclusively flagged scenarios.
- Hierarchy uses longest-path ranks so every cover arrow points downward. The original breadth-first placement put the empty extent beside its predecessors.
- Empty-extent/all-attribute convention is explained. Different full rows can share a concept. Hierarchy follows strict extent inclusion; force-layout positions carry no hierarchy.
- Every concept has a keyboard-accessible selector using the same computed data. Search clears stale details, reports remain visible, help dialogs trap and restore focus, and reset restores all controls.
- Cytoscape 3.30.2 is shipped locally with its MIT licence. If the renderer is unavailable, the matrix, selector, search, details and reports still work. The diagram is supplementary to the accessible text.
- The model validates context identities and relations. It accepts no more than 100 scenarios, 12 attributes and 256 concepts; this interface uses only the fixed example and offers no imported assessment or risk prediction.

## Provenance

Original: `lawrencerowland/Project-web-apps`, `web_apps/scenario_barrier_proof_fca_lattice.html`, revision `9eb0973712a2d096c0642754ab238f7be7af41b1`.

SHA-256: `ab582f258624310aafe7f7539b255522e3f5ed3eef0bcfdc7933c63a348a87ca`.

Primary mathematical reference: [Cordero, Enciso, López-Rodríguez and Mora, *fcaR, Formal Concept Analysis with R* (2022), §2](https://journal.r-project.org/articles/RJ-2022-014/). The app retains its JavaScript implementation; it does not use fcaR.

## Checks

`node --test tests/phase-two-fca.test.cjs` from the repository root compares the eight concepts with independent exhaustive closure over all 1,024 attribute subsets, verifies cover edges and generic contexts, and exercises the actual interface including renderer failure. UI review also checks the rendered diagram, mobile layout and keyboard controls. These establish the bounded example's behaviour, not a safety assessment or validation with project teams.
