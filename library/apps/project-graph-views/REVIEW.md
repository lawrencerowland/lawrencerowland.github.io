# Migration and retention review

2 October 2026. Source: `Project-web-apps/web_apps/Graph-sharp1.html`, read from `/private/tmp/project-web-controls-retirement-20261002` at source HEAD `9f37378002110fd2f1d16d2ed76ce2943b21b732`. The `Graph to sharp.html` variant is byte-identical except it lacks the final `init();` and closing script tag. This migration keeps one implementation; integration owns both former routes. Original source was not edited by this work.

## Retained

All eight templates retain their original stable IDs; template versions are now 2.0.0 to distinguish corrected semantics. Kept the role selector, all template parameters and dynamic asset/milestone choices; graph JSON and nodes/edges CSV editors; dynamic dated demo/reset; card search, keyboard-operable card details, neighbors, inclusion reasons, KPI counts and computed output tables; six content sections; all ten feature explainer panels and their copy controls; JSON, CSV, schema, saved-search stub, lineage, receipt, full-graph, ZIP and print outputs. Native JavaScript remains dependency-free. CSS and script are local; no original working feature required an external service.

## Concrete corrections

- PMO query now qualifies a milestone before adding its upstream context; approved-only paths no longer leak into the result. Risk counts are distinct IDs, even when the same risk affects multiple upstream nodes.
- Red-risk filtering excludes owned hazards in missing-owner mode; turning the owner filter off includes matching owned and unowned hazards. Connected control edges survive evidence-only export.
- Assurance paths include risk→control and control→evidence edges. Shared risks do not duplicate gap rows. Absence-of-gap wording explains that evidence sufficiency was not assessed.
- Unfinished dependency query retains its historical template ID but drops the false Critical Path name. Empty state selections mean no match; parallel edges do not double-count tasks.
- Date windows use strict calendar dates; query date, integer parameters and limits fail clearly rather than silently defaulting. Known endpoint types prevent unrelated nodes from masquerading as Controls/Evidence. Owner counts are not called effort or contractual SLA compliance.
- Graph imports validate before mutation. Duplicate/conflicting IDs, invalid shapes, non-finite numbers, impossible dates, malformed relationships and dangling links reject the whole input. CSV rejects malformed quoting, duplicate/missing headers and inconsistent rows instead of silently skipping records. Header-only edge input and empty graphs work.
- Generated editable CSV retains zero, false, null, custom scalar fields, absent properties, delimiter-bearing tags and reserved-string IDs. Custom property dictionaries and KPI type counts do not inherit object prototype keys.
- Imported strings are escaped in cards, details, parameter options, summaries, receipt and lineage; keyboard Enter/Space activates cards. Copy has a bounded clipboard wait and selectable manual text; blocked print windows receive a useful status.
- A valid import clears all old query/result surfaces. View and receipt share a snapshot timestamp; the receipt records parameters, full result count and truncation. Limited exports have no dangling edges; full query context is explicitly distinguished in lineage.
- Property CSV columns cannot collide with identity columns; computed attributes cannot overwrite source attributes, even when a prefixed name already exists. Edge IDs survive view/CSV export. Download CSV neutralizes formula-leading text; raw JSON remains lossless for the supported model.
- Hash ordering is independent of record order, includes edge IDs and canonical scalar property order, and hashes UTF-8 bytes. Claims now distinguish repeatable checksums, query lineage and actual authenticity/approval. No verified SharpCloud importer or saved-search execution is claimed.
- Compact Library navigation, cream/green styling, responsive containers, internal table scrolling, visible focus and explicit labels preserve dense tool functionality without a new application framework.

## Evidence

14 maintained tests pass in `tests/step-one-graph-views.test.cjs`: all template/export invariants; positive and negative filtering; risk deduplication; date/threshold endpoints; malformed import preservation; CSV grammar and empty data; scalar/tag roundtrip; actual UI import lifecycle; full lineage/truncated view consistency; imported HTML text and keyboard operation; deterministic checksums; CSV formula handling; all eleven generated ZIP files and their exact result contents; and typed edges/parallel dependency counting.

These are model/DOM/package checks, not a claim of human usability or verified external application import. Root owns served desktop/mobile/browser scenarios, integration metadata/image, old-route forwarding and publication.

## Suggested Library wording

Title: **Project graph views**

Description: Generate parameterised views from a typed project graph and inspect why each item was included.

Try this: Run the assurance trail, inspect its control and evidence links, then lower the card limit and compare the receipt with the full lineage.

Limits: A fictional graph and explicit query rules; linked evidence and approval labels are inputs. Exports need destination mapping, and the checksum is not authentication.

PMO score clarification: `max_risk_score_all` (computed attribute `milestone_max_risk_score_all`) includes all matching open risks upstream of a flagged milestone, including those with an Approved control. The separate unmitigated-risk count excludes those risks. The demo deliberately shows count 1 with maximum 25: unmitigated R1 is 20; controlled R2 is 25. A regression checks both the values and visible explanation.
