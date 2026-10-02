# Existing homes and consolidation — 2 October 2026

This pass removes eight old catalogue entries while preserving Contract Portfolio Board at Lawrence's explicit request. The old catalogue goes from 42 to 34. The Library keeps its existing five subjects plus Custom GPTs, with two new maintained tools and a direct entrance to the existing Idea Notebook.

| Old entry | Maintained home and preservation |
|---|---|
| what_AI_model_for_what | Existing **Match a task to a capability**. The same 18-card/six-profile map is already maintained there; historical model labels are not republished as current recommendations. |
| idea-notebook | Existing **Idea notebook** at project_innovation_app/webapp/index.html. Direct Library card; original URL and storage keys stay intact. |
| pm_gap_map; gap_map_gemini | Existing **Gap Map**. Preserve the receiving map's Cognitive Framing and Historical Insight, restore Quantitative Risk Analysis and Risk Culture/Bias Mitigation under distinct IDs, reconcile useful relationships, derive reverse links from the same data, and use real resource destinations. See step-one-gap-map.md. |
| Graph to sharp; Graph-sharp1 | One **Project graph views** tool, under Data and assurance. Eight query templates, editable JSON/CSV, parameters, drill-down, lineage and export formats retained. Correct filtering, dates, limits, import validation, stale outputs and checksum/vendor claims. The first file was a truncated duplicate. |
| contract-portfolio-board | **Contract Portfolio Board**, under States and relationships. Keep three contracts and the original seed artefacts; make placement, editing, workstream moves/splits, review ticks, ordering, undo/redo, saving and portable JSON work. Context, internal ownership and concept of operations remain distinct. |
| 3D_Construction_Workflow | Retired. The shapes/lines animated, but resource/scope/risk controls did not model their stated relationships. A small old-address notice explains retirement without claiming an equivalent replacement. |

The seven retained source identities have canonical bookmark forwards preserving query and fragment. Ordinary catalogue cards disappear even against cached pre-migration CSVs. The remaining source catalogue still contributes useful Gap Map resources; optional feeds fail independently. Old working HTML and the obsolete AI chooser JSX are removed, with source identity/hashes pinned to Project-web-apps 72e90ed in the migration fixture and app metadata. No new local archive is needed.

## Preservation and verification

Contract Board has no prior implemented save format to migrate. It uses its own key only; saving is explicit, import is atomic and undoable, corrupt saves are not overwritten on opening. Idea Notebook stays at its original address. Graph views exports preserve the graph/query lineage and explicitly distinguish illustrative checksums and mapping examples from signatures, verification or guaranteed vendor imports.

Tests exercise the actual app scripts and UI, all eight queries, malformed inputs, CSV types/quoting, dates, output limits, graph paths and ZIP contents. Board checks cover conserved identities/content/placement through move/split/order, exact undo/redo, persistence and invalid imports. An independent check added 150 mixed board operations and malformed-import UI probes. Catalogue fixtures cover ten source publication states. Browser review covers desktop/390px layouts, board place/move/split/save/reload and export/paste-import round trip, graph query/lineage/limits/invalid imports, and Gap Map navigation/filter/graph controls. File formats and download dispatch are checked separately; this is not human acceptance testing.

## Publication order

1. Merge and publish the receiving website, then verify its canonical destinations and catalogue.
2. Merge the small Idea Notebook return-link change; its implementation and storage remain at the same address.
3. Merge and publish Project Apps cleanup after the receivers work.

Prepared PRs are not evidence of live publication. The separate React repository retirement is outside this pass.
