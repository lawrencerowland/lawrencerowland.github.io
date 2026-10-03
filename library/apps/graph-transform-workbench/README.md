# Graph-change workbench

Historical source names, revisions and hashes below identify the reviewed inputs; they are not retrieval links. [Maintained source and verification files](https://github.com/lawrencerowland/lawrencerowland.github.io/tree/master/library/apps/graph-transform-workbench).

Maintained Library home: **Project states & relationships**. Canonical route: `/library/apps/graph-transform-workbench/`. The return link is `/library/methods/states-and-relationships.html`.

A fictional installation moves from concept freeze to handover. This workbench asks what happens to dates and dependencies when graph data or its representation changes. It is a corrected teaching construction, not a new foray, operational scheduler or formal graph-rewriting framework.

Open `index.html` directly or serve the folder. `index.html`, `style.css`, `app.js`, `model.js`, `thumbnail.svg` and the six sample files are all local. There are **no runtime dependencies, external fonts, telemetry or network services**. The former D3 renderer is replaced with an SVG renderer: draggable nodes, graph pan/zoom/fit, task/edge selection, keyboard task selection and equivalent selectors. No D3 licence or vendored package is required because no D3 code is included.

## Source → construction → limitation

Source: `lawrencerowland/Project-web-apps@7888f8a85aa9121e99190d392a622a4ee0cd4a7e`, principally `web_apps/living-graph-transform-system.html`. `source-manifest.json` records SHA-256 of that file, the old roadmap/agent note, and all six input/expected Graphviz files, with separate hashes for maintained samples. The revision identifies the historical comparison; these hashes identify the compared bytes. The old implementation and working notes are not retained as a separate archive. The preserved ideas, corrections, samples and verification live here.

| Source idea | Actual maintained construction | Limit |
|---|---|---|
| Local change and a visible ripple | DAG forward pass, actual before/after task finish values, cancellation-safe highlight sequence | Full graph is recalculated; animation is an explanation of changed dates, not a local propagation algorithm. |
| Explainable transforms | Imported baseline, current graph, exact retained-node reachability/path comparisons and snapshot history | No signatures, policy approvals, automatic inverses or event replay. |
| Interface braiding | Default per-edge subdivision with zero-duration new node; weight appears on one leg only | Shared-node option intentionally changes coupling. Added reachability and cycles are reported. No coordination-reduction theorem. |
| Lane contraction | A separate grouped view with original membership and individual boundary edges | Internal edges are hidden; grouped cycles can appear. Timing and exports use the ungrouped graph. No sum-of-parallel-durations scheduler. |
| Dependency pruning | Reverse traversal retains chosen outputs and every ancestor | Only the declared edge relation is covered. No inference about absent resource or contractual coupling. |
| Agent scenarios | Deterministic greedy matching of offer tokens to needs with positive window overlap | Capacity/calendar fields are retained but explicitly unenforced. No task execution, resource scheduling, reciprocal trade or optimisation. |
| Formal and variance framing | Corrected explanatory notes, original examples and live counterexamples | No fibration, categorical governance proof or probabilistic critical-path calculation. |

The workbench has ordinary dependency and abstraction examples potentially useful alongside the independent milestone-context and project-wiring enquiries. They are links, not a claim that this application establishes those forays’ results.

## Preservation and claim disposition

“Corrected” preserves the useful job while changing erroneous semantics or claims. “Consolidated” means reachable in an explanation or model/table instead of the original panel. None of the original four strands is predecessor-only.

| Original tab/control/data/strand | Disposition and maintained route |
|---|---|
| Rescheduler tab | **Retained** as “1 · Delay & trace”. |
| Seven `NODES`: A concept freeze 3d; B design gate 4d; C procurement 5d; D site ready 3d; E install 4d; F commission 2d; G handover 1d | **Retained** in `M.MAIN`; original IDs, labels, tier values 1/2/2/3/3/3/4, eight edges and zero-lag baseline. `dur` is now the common `duration` field. Baseline finish is 19 days. Tiers appear in the data table and snapshot. |
| Original eight dependencies including A→C and B→C | **Retained**. Long edges arc around intervening boxes rather than disappearing beneath them. |
| `view`: slip/schedule/both | **Retained**, renamed scalar/schedule/both with matching labels. Schedule metrics remain schedule metrics. |
| `rule`: max/sum/mean | **Corrected**: all remain for scalar propagation only; mean is the arithmetic mean, not silently rounded. Finish-to-start dates always use maximum predecessor constraint. |
| `animate` | **Corrected**: highlight changed tasks in topological order; a later edit, view change or reset cancels stale highlights. All dates already reflect the current calculation. |
| Node click, `sel`, `delay`, `delayVal`, `apply`, `clear` | **Retained**, plus a keyboard selector. Local start delay is added after incoming constraints; clear preserves edge lags. |
| Edge click, `selEdge`, `lagNow`, `lagDelta`, `lagDeltaVal`, `applyLag` | **Retained**, plus a keyboard selector. Negative lag explicitly permits overlap; earliest starts have a day-zero floor. |
| `delayAB`, `delayBC` quick rewrites | **Retained** (+2d and +1d). |
| `resetAll` | **Retained**: reset slips/lags/trace while preserving view/rule choices. Pending animation cannot restore stale values. |
| `msBase`, `msNow`, `maxSlip`, rewrite log | **Corrected** baseline/current finish and largest positive finish shift; structured values in table and snapshot. Log is an unsigned session explanation, not a signed receipt. |
| Tier and risk legend | **Consolidated/corrected**: tiers in table; green/amber/rose are illustrative bands, not assessed risk. Scalar mode has its own accurate legend. |
| “What you’re seeing”, living-transform framing, hardening notes | **Consolidated/corrected** in the calculation panel and ten explanation notes. No claim that only a necessary neighbourhood is recomputed. |
| Graph-Transform Sandbox tab | **Retained** as “2 · Transform & check”. |
| Five-node S1–S5 sample; labels, tags, owners, types, dates and five weighted edges | **Retained** in `M.SAMPLE`. Dates remain the fictional original 2025 dates, not current project status. Node durations default to zero; edge `duration` means transfer duration. |
| `sandboxInput`, `sandboxSample`, `sandboxParse`, JSON drag/drop | **Corrected/retained**; adds file chooser. Loading fills editor; Parse commits only after full validation. Invalid import leaves baseline, current model and history unchanged. 150-node/600-edge/2MB and absolute numeric ≤1 billion teaching limits replace “large graphs are fine”. |
| Type/tag/owner/date filters | **Retained**: exact case-insensitive type/owner, tag substring, inclusive dates. Date range errors are explicit. Induced view removes unmatched nodes and edges. |
| `contractMode`, `contractTag` | **Corrected** to separate grouping. Owner/type/tag grouping and member lists remain; edge weights are never added. Original graph is retained for calculations, transformations and exports. |
| Apply transforms | **Corrected** to an explicit “Apply filters from baseline” and “Show grouping”. Prune/insert acts on current graph. This makes the original baseline/current distinction visible. |
| `sandboxUndo`, `sandboxRedo`, audit rail | **Retained** snapshot history; new edits after undo truncate the redo branch. Added restore-baseline control. No automatic inverse claim. |
| Before/after JSON, graph, topological/critical-path summary | **Retained/corrected**. One longest weighted path is highlighted in an acyclic ungrouped model. Cycles make dates/path highlighting unavailable; no misleading partial length. Exact tables remain readable independently of layout. |
| `pruneTag`, `pruneIds`, `pruneRun` | **Corrected/retained**: exact comma-separated output tags/types or IDs, unknown-ID validation, ancestor closure. No “only real-world influences” claim. |
| `braidLane`, `braidTags`, `braidFallback`, `braidReuse`, `braidRun` | **Corrected/retained**. Default is per-edge subdivision (previous default shared junctions was unsafe). Shared mode remains a visible coupling experiment, with new dependencies/cycles reported. Repeating insertion leaves existing interface legs alone. |
| Scope/contract/permit/power palette | **Retained** as a coloured type legend, explicitly not assessed risk. |
| Copy JSON/CSV/DOT, export previews | **Corrected/retained**. JSON round trips all node and edge fields; generic quoted node/edge CSV preserves isolated nodes and parallel IDs; escaped DOT. Adds named downloads. Clipboard failure leaves selectable preview. No SharpCloud/P6/yEd compatibility guarantee. |
| DAG/Fibration Scaffold tab | **Consolidated/corrected** as “3 · How to read the model”: visible edge-subdivision diagram, six sample links, source/construction/limits and mathematical boundaries. |
| Three canonical Graphviz pairs | **Retained** in `samples/`. Pruning files unchanged; interface comments correct unsupported fibration/coordination assertions; variance expected comments identify mean-path annotation, not computed probability. Graph data/annotations are retained. Exact before/after hashes recorded. |
| Hardcoded “Tests: 3 passing” | **Removed because unsupported**. Actual executable tests are described below; sample pairs are not test execution evidence. |
| Roadmap M0–M3 / repository-assets panel | **Consolidated** into reachable samples and source links. A CLI, Gephi integration, PNG diff pipeline and fibration schema were proposed, not built; no implied implementation commitment remains. |
| Agent diff/testing note | **Consolidated**: validation, independent path comparisons, failure cases and source/sample checks are executable tests. DOT comments/order can differ, but that alone proves no semantic equivalence. No copied agent instructions. |
| Agent Scenario Explorer tab | **Retained** as “4 · Match offers & windows”, with a visible matching graph. |
| Permit drift / Shared crane / Late design presets, original task IDs/windows/buffers/needs/offers and resource cap/calendar data | **Retained exactly** in `M.PRESETS`. Capacity/calendar are displayed as unenforced source annotations; not silently used as constraints or deleted. |
| Preset selection/load, JSON input, Run swaps | **Corrected/retained** as Run matching comparison. Validates arrays, IDs, resource references, numeric windows/buffers and duplicate tokens. Malformed input clears stale result/export availability. |
| Strict/liberal/priority policies | **Retained**. Strict retains windows; liberal expands both ends by buffer; priority uses half-buffer floor and smallest buffers first. “Strict = no early starts” is corrected to its actual meaning. |
| Trades, deficits, slack deltas, hotspots, baseline/policy receipts | **Corrected/retained** as matches, unmatched needs, window-width deltas, unmatched-window messages, and strict/current comparison. Width expansion is not CPM slack. Reciprocal provider needs are not solved. |
| Governance strip and lineage hash | **Consolidated/corrected** to policy/match/unmatched counts; noncryptographic hash removed because it supplied no lineage. Unsigned comparison JSON contains exact input and both results. |
| “P6 constraints CSV” | **Corrected** to a generic matching CSV with match/unmatched/window-delta rows. Invented P6 constraints are removed. |

### Every original explainer strand

All ten remain as modal notes under the third tab, with Escape, close button and native dialog focus return.

| Original | Maintained note and correction |
|---|---|
| Primer: reversible graph rewrites | **Graph rewrites and undo**: lossy transforms versus restoration from retained snapshots. |
| Why this beats logs | **What a trace adds**: useful trace data; ordinary logs can encode it too. |
| Minimal data model | **Minimal data model**: actual schema and baseline; explicit representation versus model data. |
| Governance hooks | **Governance hooks**: possible actor/authority/evidence fields, not executed compliance checks. |
| Digital twin diff UX | **Before/after interaction**: implemented comparison/history; absent scrubber/receipt/policy panes named honestly. |
| Rule design pattern | **Rule design**: actual subdivision rule and invariants; split/merge needs retained data, not an automatic inverse. |
| Storage & verification | **Storage and verification**: tab state and exports; no signature, immutable trace or authority inference. |
| Pilot plan for your stack | **How a bounded trial could use this**: declared model, question and inspectable result; no imposed rollout. |
| Next-week demo deliverables | **What this demonstration actually delivers**: concrete retained capabilities, no invented schedule commitment. |
| Tangential coda | **Category-theoretic framing**: category/groupoid/fibration distinctions, no claimed formal construction. |

The roadmap also proposed a unified product/process/org/cost graph, typed propagation limits, risk/float/cost dashboards, finish-phase guardrails, Revit/Tekla sync, PMO/Risk/Engineering query boards, a two-hop lineage view, CSV imports, signed rule receipts and a ZIP audit bundle. Those were **future proposals without implementation**. Their useful questions survive in the actual model/limits notes: what a schema means, what information a local boundary omits, which checks a change should preserve, and what provenance/authority evidence is absent. No controls are described as retained for features that never existed. The six sample files move; the roadmap and `.ai/agent-notes.md` need not be copied wholesale, because their source is fixed and their useful explanations are consolidated here.

## Model boundaries

- The schedule uses continuous days, node durations, finish-to-start dependencies, edge lag and optional transfer duration. Local delay is an additional wait after incoming constraints. No dates, calendars, resource levelling, cost/risk model, late pass, float, uncertainty or execution state.
- A sandbox import may contain cycles for inspection. `schedule()` returns `valid:false`, without a makespan/critical path, on cycles. Blocked nodes may include successors of cycles.
- Subdivision comparisons check original-node reachability and maximum weighted paths. Tests additionally compare **every path’s weight** with an independent enumerator across 64 small DAGs. This does not certify arbitrary project semantics.
- Grouping is a quotient **view**, not a replacement timing model. Shared interfaces are a different model operation. Both expose counterexamples.
- Snapshot history and downloads are local/unsigned. Refresh discards session edits; downloaded graph JSON can be re-imported, while schedule/matching snapshots are inspectable records rather than a general replay format. No automatic persistence is promised.
- CSV quoting protects format structure, not spreadsheet formula execution. Treat untrusted labels as text when using a spreadsheet. DOT is a structural/label export; JSON is the lossless route for node and edge fields.
- Layout is deterministic initially and then manually movable. Zoom/fit and keyboard selectors support inspection; graph coordinates are deliberately not included in exported graph data.

## Verification

Run `node tests/model.cjs`. It checks the original baseline and presets, arithmetic, independent all-path preservation, shared-junction/cyclic cases, grouped-view semantics, upstream selection, validation, transactional imports/commits, history, export round trips and retained sample hashes.

Run `node tests/ui.cjs` after the repository's normal `tools/library-apps` dependencies are installed. It uses the existing jsdom package; no server, browser or additional package is required. It exercises real event handlers for changes/reset during animation, snapshot contents, invalid import preserving state, interface checks, cyclic versus grouped-model behaviour, undo/redo, file import/export round trips, filters/pruning, clipboard fallback, explanations, matching failures, fresh-session reset and keyboard tab selection. Dialog methods/downloads are stubbed, so this is not layout, native focus or real-file browser evidence.

**Local verification on 3 October 2026:** 24 model checks passed, including the all-path oracle; the DOM interaction suite passed. A separate ordinary-browser review verified schedule 19→21 days, per-edge 3-day preservation, shared-interface cycle refusal, undo/invalid import atomicity, Shared Crane's two matches/one deficit, and no body overflow at 390px. These are implementation/UI checks, not human-use validation or evidence of project benefit. Publication and served-byte verification belong to the integrating change.
