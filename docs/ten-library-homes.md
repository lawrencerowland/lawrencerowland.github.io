# Ten reviewed apps receive Library homes

Prepared 2 October 2026. This is the receiving record for ten repaired Project Apps examples and their five existing Library subjects.
Receiving change: [website PR175](https://github.com/lawrencerowland/lawrencerowland.github.io/pull/175). Paired retirement: [Project Apps PR149](https://github.com/lawrencerowland/Project-web-apps/pull/149). Both are proposed changes; publication remains pending.

## Source and identities

Original implementations were reviewed at [`fa5a4a4819c8c5d25b413c7d1f3219aac2e81fc2`](https://github.com/lawrencerowland/Project-web-apps/tree/fa5a4a4819c8c5d25b413c7d1f3219aac2e81fc2/web_apps).
The receiving `_data/library_apps.json` records each original catalogue ID, name, path, full source revision and SHA-256, alongside its maintained source directory.
These identities and hashes were independently checked against that revision; Git retains the full original source.

All old files below are under `Project-web-apps/web_apps/`; all destinations are under the website’s `/library/apps/`.

| Original ID and file | Library destination | Subject |
| --- | --- | --- |
| 25 · `intro_risk_matrix.html` | `risk-matrix/` | Decisions & trade-offs |
| 30 · `weighted-decision-matrix.html` | `weighted-decision-matrix/` | Decisions & trade-offs |
| 29 · `eisenhower-matrix.html` | `eisenhower-matrix/` | Decisions & trade-offs |
| 27 · `decision-latency.html` | `decision-latency/` | Delivery dynamics & feedback |
| 42 · `critical-path-spotter.html` | `critical-path-spotter/` | Delivery dynamics & feedback |
| 6 · `hs2_WBS_to_PBS.html` | `wbs-to-pbs/` | Project states & relationships |
| 34 · `Project_Data_standard_example.html` | `project-data-standard/` | Data, evidence & assurance |
| 38 · `white_space_analysis.html` | `white-space-analysis/` | Capabilities & futures |
| 32 · `service_trident.html` | `service-trident/` | Capabilities & futures |
| 28 · `stakeholder-mapper.html` | `stakeholder-mapper/` | Project states & relationships |

## What is retained and corrected

- **Risk matrix:** keeps named risks, 1–5 controls, score product, bands, grid and materials example. Multiple risks now survive in one cell; 3 × 5 is correctly Moderate. Adds editing, a register and explicit ordinal-score limits.
- **Weighted decisions:** keeps all three vendor examples, criteria/options, editable weights/ratings, raw totals and removal confirmations. Missing or invalid ratings pause ranking, all ties are shown, and normalised scores remain stable when weights are rescaled.
- **Eisenhower matrix:** keeps task ratings, all four action rules, scatter map, task list and optional support link. A 2.5 boundary agrees with the ≥3 high-rating rule; overlapping tasks remain inspectable. Editing no longer retains an earlier blank-name validation error.
- **Decision latency:** keeps eight tasks, five decision durations, every association, both charts and cross-highlighting. Explanations now distinguish association from causal delay; the supplied data cannot identify a critical path. Adds keyboard selection and a full table.
- **Critical path:** keeps the seven-task network, every add-one control, task bars and dependencies. Validated forward/backward passes calculate float and multiple critical routes; cycles and invalid inputs fail explicitly. Adds duration editing, reset and zero-duration milestone marks.
- **Work to products:** keeps every original work/product/participant record, metrics, phase views, trees and relationships. Distinct product IDs resolve collisions; three previously unreachable outputs are exposed. Legacy HS2 figures and the process-oriented left tree are clearly qualified.
- **Project data:** keeps editable JSON, example, codelists, SLA/tolerance, six readouts, three visuals and report export. Allows early completion and forecast savings; checks CAPEX currencies, zero tolerance and provenance. Invalid input clears stale reports; invalid money cannot create comparable chart bars.
- **Capability white space:** keeps six dimensions, all five numerical score vectors, six plots, automatic selection, entrant sliders, rankings and CSV. Fictional labels replace unsupported company assessments; scores are now editable. Empty-region boundaries and zero-area cases are corrected. The speculative Controls + Twin + Contract offering remains as a labelled hypothesis.
- **Service Trident:** keeps all three need-to-service mappings, multi-level selection, suggestions, clear and summary copy. Native controls preserve focus; failed or stalled clipboard access reveals manual copy. The app describes its mapping as an authored conversation heuristic.
- **Stakeholder mapper:** keeps power/interest ratings, four contact categories, plot and list. Coincident entries remain distinct, thresholds and axes are explicit, and editing/removal preserve keyboard continuity. Judgements are not treated as measured support or a reason to exclude people.

The ten receiving apps retain their useful explanations and visualisations with local HTML/CSS/JavaScript, subject navigation, labelled controls and a cream/green Library frame.
None of the ten originals used localStorage, sessionStorage or IndexedDB persistence; no stored browser data is cleared or migrated.

## Catalogue and retirement scope

The old `app-index.csv` changes from **60 to 50 records**, removing exactly these ten source identities and preserving unrelated rows.
The receiving site adds ten static examples to its sixteen existing maintained apps: **26 Library apps** in total.
Both maintained manifests retain the old source names as lookup keys, point directly to the Library routes, and suppress duplicates when a stale pre-migration CSV is loaded.
Independent execution of that stale-catalogue case produced 76 distinct identities: 50 general apps plus 26 maintained examples.

Only the ten old working implementations and their ten unused catalogue thumbnails are retired by this change.
Each old HTML route becomes a tiny canonical bookmark forward that preserves query strings and fragments; it contains no duplicate app implementation.
Prior move records remain unchanged, and source history remains available at the pinned revision.
The static receiving apps are excluded from the earlier bundled-app rebuild loop so it cannot overwrite their maintained files.

## Checks and evidence boundary

- Decision regression group: **12 passed**, covering products/bands, duplicate entries, weighted totals/ties/rescaling/invalid input and validation-to-edit recovery.
- Schedule/breakdown regression group: **14 passed**, covering CPM, supplied latency data, UTC dates, full tree reachability and cross-view identity.
- Capability/data regression group: **12 passed**, including a full-grid white-space oracle, funding-renderer invalid-currency cases and stalled-clipboard fallback. Stakeholder classification/range/orientation assertions also passed.
- Independent integration review checked all ten source IDs/hashes, routes, subjects, manifests, stale-catalogue deduplication and deletion scope. Existing app-migration and earlier sixteen-app retirement checks passed.
- Old repository’s complete `node test.js` passed, including all 23 canonical forwards with query/fragment preservation. Diff whitespace checks passed in both repositories.
- Browser journeys passed for all ten apps, including shared risk cells and invalid-name-to-edit recovery, vendor ties and blank-rating pause, urgency editing, CPM float/finish changes, decision cross-highlighting, linked product inspection, early milestone validation, white-space boundary changes, service mapping/copy, and stakeholder overlap/edit/removal. All ten phone-width layouts fit the page at 390px; wider diagrams and tables scroll inside their panels. Ten diagram screenshots provide the pictured entrances. Exact Jekyll build and rendered-route checks run on PR175; its current check status is authoritative.
- All 22 source Node checks passed; the prior sixteen apps passed 55 model tests and rebuilt to 49 unchanged files. Project-data report preview generation and download dispatch were observed. A completed browser download event and saved file have **not** yet been confirmed. No publication or human-use outcome is inferred from local tests.

## Publication order

1. Review and merge the receiving website change; build and publish its ten destinations.
2. Verify the served destinations, subject entrances, dependencies and relevant interactions.
3. Only then merge and publish the old-repository retirement; verify old links, query/fragment forwards and the 50-row catalogue.
4. Record the actual review/deployment references and final browser/download outcomes here. At preparation time those publication references remain pending.
