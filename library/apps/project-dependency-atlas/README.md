# Project Dependency Atlas

A bounded Library worked example in **Delivery dynamics & feedback**. A hypothetical viaduct team traces handoffs between phases; a hypothetical portfolio team compares dates across programmes. Phase/gate edge bundles and faceted timelines answer different questions. The app does not join the two datasets into a scheduling model.

Open `index.html` directly or serve this folder. There is no build step, font service, CDN, runtime package or third-party chart dependency. The pictured entrance is `thumbnail.svg`, drawn from the retained Pennine graph and portfolio timeline data.

## Pinned source and complete retention

- Repository: [Project-web-apps](https://github.com/lawrencerowland/Project-web-apps).
- Source commit: `8221f32b398d582801e639b5460aa674805f1671`.
- Source file: [`web_apps/project-dependency-atlas.html`](https://github.com/lawrencerowland/Project-web-apps/blob/8221f32b398d582801e639b5460aa674805f1671/web_apps/project-dependency-atlas.html).
- Git blob: `abe993f88bdc34492f67cbcc50f96f0652ae9d7b`.
- Original file SHA-256: `b67aa2e234930c472dffb1dfa35d5f696e125c3063b014f8300c3ce6810ea1e1`.
- Canonical retained-data SHA-256: `761d351004ed7824bc875e556460ce4c704adee2fde931171f5d88656f6964f7`. This hashes UTF-8 `JSON.stringify({bundles: SCENARIOS, timelines: TIMELINE_SCENARIOS, sourceDate: "2026-03-25"})`, independently evaluated from the pinned source.
- No matching TSX was found in the source or receiver checkout, or the available React retirement checkout. This migration's source is the HTML app.
- Original repository license: [CC0 1.0](https://github.com/lawrencerowland/Project-web-apps/blob/8221f32b398d582801e639b5460aa674805f1671/LICENSE). No D3 code or other dependency has been vendored.

`data.js` preserves both source objects, including every node, hierarchy group, directed edge, original phase colour, timeline facet, task, date, status, milestone, metadata label and insight text. The display palette changes for the light Library design; original colours remain in data and the reference export. All names are historical toy-scenario names, including real organisation/programme names. They are not claims about real project activity in March 2026 or today.

| Retained example | Data | Computed facts |
| --- | --- | --- |
| Pennine dependency map | 5 phases, 22 nodes, 36 links | 23 across phases; Design Integration has 11 incident links, 5 incoming and 6 outgoing |
| SRP dependency map | 6 gate/group headings, 23 nodes, 28 links | 13 across groups; Reg Approval Gate has 6 incident links, 3 incoming and 3 outgoing |
| Portfolio timeline | 4 facets, 16 items | 12 activities, 4 milestones; 5 Jan–30 Jun 2026; 176 elapsed days; 35 overlapping cross-facet activity pairs |
| Pennine workstreams | 5 facets, 19 items | 17 activities, 2 milestones; 5 Jan–10 Aug 2026; 217 elapsed days; 43 overlapping cross-facet activity pairs |

## Retention and correction ledger

| Source capability or voice | Maintained form |
| --- | --- |
| Radial phase/gate edge bundles | Native SVG hierarchy-guided cubic basis curves, group arcs, node labels and group legend; two original presets |
| Node hover/focus highlighting and incoming/outgoing counts | Pointer preview, keyboard focus and click/tap selection, persistent detail panel, explicit direction lists and a node selector; Escape/clear removes selection |
| Faceted schedule comparison | All nine original facets across two presets, shared UTC date scale, bars, separate milestone rows, month ticks and source-date lines |
| Task/milestone hover and focus detail | Pointer preview and retained keyboard/click/tap selection, full dates, elapsed-day duration and supplied status; readable selector/table alternatives |
| Tabs and scenario switches | Two ARIA tabs with arrow/Home/End keyboard navigation; labelled native scenario selectors |
| Choke-point / regulatory coupling / capacity collision / float-consumption voices | Main interpretations recast as conditional questions; original titles and text retained verbatim only in the original-wording disclosures |
| Original metadata cards | Full original values retained in a provenance disclosure, including historical “critical” and “risk” wording; computed summaries occupy the main cards |
| Source date | Explicitly 25 March 2026; never a live “today” marker |
| Portable data and state | Original app had no editing, import, export or persistence. The maintained version adds reference-data export and validated view-state export/import/manual local save; it does not claim to import arbitrary project schedules |

The source silently filtered out unresolved graph endpoints; the model now rejects them. Graph validation also rejects duplicate node/group names and duplicate directed edges. Busiest-node summaries compute all ties and do not call degree “criticality”. Original narrative numerical observations can be checked against the listed edges, while their proposed interventions remain historical interpretations. Main headings avoid “detected” or advance warnings that the model cannot substantiate.

The original timeline contained no resource assignments, resource capacities, precedence network, durations mapped to the graph, schedule baseline or float calculation. Its specialist-crane competition, 80%-float-consumption and longest-chain statements therefore cannot be derived from the displayed data. They remain available only in the original-wording disclosure as historical hypotheses. The main interpretation panels ask conditional questions without asserting missing resource demand, measured float consumption or actual regulatory causation. No detected collision, critical path, current slippage, probability, safety conclusion or regulatory determination is reported.

## Computation and visual assumptions

`model.js` is shared by browser rendering and tests. `app.js` makes DOM nodes with text content; imported text is never evaluated or rendered as HTML.

- Every listed edge has a source and target. Incoming and outgoing counts follow this direction. Incident degree counts an edge once for a node it touches (including a self-loop); it is not a schedule calculation. Cycles are allowed because this is a general dependency display, not a DAG scheduling engine.
- The radial order follows the original group and leaf order with one angular gap per group. A within-group route visits source → group → target; a cross-group route visits source → source group → root → target group → target. Routes blend toward the straight endpoint line at strength 0.82, then use a cubic basis spline. The native implementation is not pixel-identical to D3's original cluster layout. Shared curve geometry never adds an edge.
- [D3's official curveBundle documentation](https://d3js.org/d3-shape/curve#curveBundle), checked 3 October 2026, describes straightening a cubic basis spline by a bundle-strength parameter and links the hierarchical edge-bundling work underlying the source. This is a visual layout method, not evidence of delivery causation.
- Date parsing requires real `YYYY-MM-DD` calendar dates. Differences use UTC midnight, so DST cannot change a day count. Duration is end minus start, not an inclusive count of both endpoint dates; weekends and holidays count.
- Non-milestone activities must have positive duration. Milestones must have matching start/end dates and the milestone status. Status flags remain supplied, even when dates are in the past.
- Cross-facet overlap compares positive intersections of half-open activity intervals: `max(0, min(endA,endB) - max(startA,startB))`. Pairs in the same facet, milestones and shared endpoints are excluded. The unit is one activity pair, not one resource or one period of contention.
- Filters change only the displayed links or items. Summary counts, overlap comparisons, narrative panels and the shared timeline extent always describe the complete selected example. Selected-node detail includes all its dependencies and says so.
- On small screens the radial picture initially fits the screen. “Enlarge diagram” exposes a scrollable, readable version; selectors and tables provide an alternative. Timeline charts keep readable dimensions and scroll horizontally within their panel. Every milestone has its own row, avoiding collisions between marker labels.

## View files and local saving

Version 1 view JSON contains exactly `app`, `version`, `view`, `bundle`, `timeline`, `node`, `task`, `links` and `status`. Validation checks the complete field set, app/version identifiers, allowed presets/filters, a node belonging to the selected graph and a task belonging to the selected timeline and matching the status filter. Imports are parsed and validated before changing the view. Inputs over 20,000 characters are rejected. Temporary hover previews and diagram enlargement are not saved.

Save and load are explicit actions using only `library.project-dependency-atlas.view.v1`. Opening the page shows the default view rather than silently loading storage. Reset does not delete a saved view. Malformed or inaccessible storage leaves the current view and stored bytes unchanged; a failed write does not report success. Other application keys are untouched. View exports also show copyable JSON as a fallback if a browser download is unavailable.

“Export example data” writes a separate versioned `reference-data` file with all four source datasets, original metadata/narratives, pinned source commit and source date. It is deliberately not accepted as a view file. Browser-local saving is not an upload or cross-device backup. Download preparation does not establish an OS-level save.

## Validation

From the repository root:

```sh
node --test library/apps/project-dependency-atlas/tests/*.cjs
```

Tests use the existing `tools/library-apps/node_modules/jsdom` development dependency. Production has no dependency on it.

Sixteen test groups pass, covering:

- Exact independent source-data retention digest and computed counts/directions for both graphs.
- Cycles, self-loops, disconnected nodes, ties, malformed graph references and duplicate identities; unchanged results when narrative claims change.
- Within-group/cross-group route structure and finite geometry at zero/default/full bundling strength.
- Every original timeline item and an independent per-calendar-day overlap oracle for both presets and 25 generated examples.
- Leap days, invalid dates, DST boundaries, zero-duration milestones, touching intervals, same-facet exclusions and non-inferred statuses.
- Complete view-state round trips, missing/extra/version/type/reference errors and filtered-out selections.
- Real DOM handlers for both tabs, every scenario and status/link filter, all original node/edge/item/narrative renderings, pointer previews, focus/keyboard selection, explicit save/load/reset, export/import, hostile text, malformed/blocked storage and other-key isolation.

Local Chrome review on 3 October 2026 covered desktop 1440px and phone 390px presentations, both lenses and all four presets. There were no page errors or document-width overflow at 390px. Graph labels were moved inside their group rings after visual review to avoid a phase label crossing a node label; the radial diagram now fits on phones and can be enlarged. Browser layout checks complement the model/DOM tests; they do not establish accessibility certification, human usefulness, empirical validity, successful OS-level downloads, deployment or publication.

## Placement judgement

One pictured home in **Delivery dynamics & feedback** is enough. The worked question is how grouping exposes handoffs and how comparable timelines expose simultaneous activity, while retaining the distinction between observation and a resource or schedule claim. It is a useful bounded example, not a new open enquiry requiring a foray. The generic graph representation is secondary to this delivery-reading purpose.
