# Eight further examples with Library homes

Reviewed 2 October 2026. Source: `lawrencerowland/Project-web-apps` at `9d9c253f9c203441be1fd301bcb9a6b976b85d4f`. The previous ten-example migration (website PR175 / Project Apps PR149) is merged and its served files were verified before this pass.

These are corrected existing examples within the five flat Library subjects. No new research programme or foray has been created. There are now 34 maintained apps and 55 subject entries. The source collection falls from 50 to 42 entries. The eight canonical records include source-file hashes, including the two TSX implementations and Probecrafter's question JSON.

| Original | One maintained home | Preserved and improved |
|---|---|---|
| P3M capability tool | [Capabilities & futures — capability review](/library/apps/p3m-capability-review/) | All 110 leaves, 21 subcategories and four categories; assessments, expansion/filtering, hierarchy edits, bulk operations, CSV. Stable IDs preserve duplicate names and custom rows; imports preview before applying. Unknowns, outside-scope judgements and confirmed gaps remain distinct. |
| Interactive concept map | [Decisions & trade-offs — concept triads](/library/apps/concept-triad-builder/) | Sequential three-concept entry, multiple titled SVG triangles and the trialectic explanation. Spaces survive typing; cards and partial drafts can be corrected, undone and saved. Snowden's wider participant-placement exercise is accurately distinguished from this builder. |
| WBS rewrite | [Delivery dynamics — task-network rewriting](/library/apps/wbs-rewriter/) | Editable network, inspector, resource/Gantt views, four rewrite experiments, scenarios, undo/redo, imports/exports and duration sampling. Scheduling honours predecessors and capacities; collapse preserves internal resource profiles and rejects unsafe boundary changes. Rewrites are explicit hypotheses, not certified transformations of real work. |
| Date defence kit | [Delivery dynamics — delivery-date assumptions](/library/apps/date-defence-kit/) | Both example plans, editable estimates/dependencies, Beta-PERT/triangular simulation, criticality, percentiles, what-if, calendar modes, narrative, save/share and file exchange. Identical legacy task copies repair on load; comparisons start from a stable baseline. Model percentiles are not calibrated delivery assurance. |
| Interface maturity simulator | [Delivery dynamics — interface changes](/library/apps/interface-maturity/) | Five interfaces/attributes, feedback, spillover, scenarios, editable coefficients, heatmap/sparklines/network/dashboard/history, mapping exports and saved-state exchange. Absolute values stay exact; spillover uses realised change; zero actions are inert; imports validate before replacement. Coefficients and index remain illustrative. |
| Intent field navigator | [Decisions & trade-offs — backlog priorities](/library/apps/intent-field-navigator/) | Three CSV inputs, original demo, similarity/allocation calculations, target edits, charts, candidate moves, outcome update, four explainers and five CSV exports. Correct CSV quoting, zero effort, unmatched work, portfolio units and one-use updates. A second example exposes ambiguity and missing evidence. The original broader architecture remains a labelled hypothesis. |
| Governance trio | [Data & assurance — governance trail](/library/apps/governance-trio/) | Six events, seed, log, rule receipts, lineage, contextual help and shared URL. Missing prerequisites stay visible; absent triggers are N/A; the chosen approval role can fail. Synthetic presence checks do not authenticate execution, chronology or independent review. |
| Probecrafter | [Capabilities & futures — programme conversations](/library/apps/probecrafter/) | All three packs/nine questions, follow-ups, artefacts, role snapshots, templates, reflection prompts and coaching notes. Keyboard selection, reorder, full run-sheet, save/reopen and clear/undo. Prompts investigate evidence; silence, unchanged plans and conversation patterns are not diagnostic proof. |

Each app's source directory contains a feature/provenance review. The screenshots are of the maintained apps. The broad catalogue and Gap Map use canonical identities and suppress retired copies even when an old catalogue is cached. Historical CSV fixtures retain eight publication states; unrelated source rows are byte-preserved.

## Persistence and retirement

- Date retains `date_defense_kit_v1` on the shared GitHub Pages origin and accepts old `#d=` links. A shared plan does not overwrite local saved work until explicitly saved. Narratives persist; simulations must be rerun after reopening.
- Governance accepts the original `{a,seed}` URL state and preserves unrelated query parameters. Its new role is part of shared state.
- P3M, triads, WBS and Interface use explicit file saving; they do not claim automatic browser persistence. Original valid exports remain accepted where those originals had an export format. Triad saving is new.
- Probecrafter adds a separate browser-storage key and validated portable run-sheets. No original persistent state is cleared. Clear is disabled until data loads and undo remains available after clearing.
- Intent reads local CSVs and exports computed results. It has no automatic save. The source CSVs are the reusable inputs; no input data is uploaded.
- Old implementations become small canonical bookmark forwards preserving query and fragment. The two now-unreferenced TSX files and relocated Probecrafter JSON are removed from the source repo. No extra working archive is added to 00002.

## Verification and release order

The new calculation/import tests cover known original failures, invalid inputs and state preservation. Separate schedule checks compare resource allocations and precedence against independently calculated time-slot sums, and finish/critical sets against exhaustive paths. Browser checks cover actual edits and resulting values, undo/redo, saved/reopened narrative and run-sheet, URL-state restoration, loading errors, keyboard controls, and desktop/390px layouts. File-format round trips are tested separately from browser download dispatch; this review does not claim every operating-system download/save/reopen path was observed.

Run `node --test tests/eight-*-models.test.cjs tests/eight-probecrafter-model.test.cjs`, `node tests/eight-library-migration.test.cjs`, and the existing catalogue/Library tests. CI also reproduces the existing bundled apps, builds Jekyll and checks the rendered routes. The source repository runs its full existing test command, including all bookmark forwards.

**Merge and publish the receiving website first.** Verify the eight served destinations before merging/publishing the companion Project Apps cleanup. A green preview is evidence about the proposed build, not evidence that the changes are live or useful to human readers. The PR records current checks and preview evidence.
