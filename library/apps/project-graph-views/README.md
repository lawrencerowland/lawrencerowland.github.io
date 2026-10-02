# Project graph views

A dependency-free, local HTML/JavaScript worked example in **Data and assurance**. Open `index.html`, choose a role/template and run a query. The fictional demo uses dates relative to the selected demo date. There is no network, persistence, live vendor connection or automatic approval.

Eight retained templates:

1. Milestones with upstream open risks and no Control labelled Approved.
2. Red risks on interfaces, with an optional missing-owner filter.
3. Asset interfaces with old proposed changes.
4. Interface risk window by date and hazard tag.
5. Unfinished milestone dependencies (formerly Critical Path Watch; no CPM calculation).
6. Owner risk counts and overdue review dates (not effort or contractual SLA assessment).
7. Recent decisions without linked Evidence and their interfaces.
8. Milestone assurance trail: upstream work → risks → controls → evidence.

The legacy `depends_on` edge follows **predecessor → successor** in this starter schema. Standard relationships enforce their declared endpoint types. Unknown node/edge types remain available for custom graphs, with a note that built-in queries use the starter schema. Approved/Verified states and linked evidence are supplied labels, not validated facts.

## Data and exports

- Graph JSON: stable node/edge IDs, scalar properties, tags and optional source timestamps. Invalid records, duplicate IDs, dangling endpoints, impossible calendar dates and malformed standard relationships reject the whole import. The current graph/result remains intact.
- Editable nodes/edges CSV: strict quoted fields and row/header validation; empty edge sets and empty graphs are valid. Generated editor CSV uses `tags-json` and `property-json:<name>` columns to preserve delimiters, types, zero/false/null and custom properties. Blank encoded cells mean absent properties. Plain property columns and pipe-separated `tags` remain accepted. Use explicit edge IDs for stable repeated imports; omitted IDs are based on row numbers.
- Graph properties support strings, finite numbers, booleans and null. Put nested documents in linked source material. Graph JSON export is the exact supported input representation; the CSV editor represents nodes/edges rather than graph-level metadata.
- Query outputs: view JSON; item/link CSV; receipt JSON/CSV; node/edge lineage CSV; starter schema CSV; saved-search stubs; print; eleven-file ZIP bundle; and a separate full Graph JSON download. JSON and CSV are generic mapping formats. SharpCloud/vendor compatibility has not been verified.
- Output CSV property columns use `attribute:` to avoid collisions with identity columns. Formula-leading text is prefixed with an apostrophe in spreadsheet CSVs; JSON retains exact values. Editable input CSV is not altered this way.
- One successful query supplies its view, receipt, CSV and ZIP outputs. Changes to controls require another run; the status explains that exports still use the previous successful query. Loading a new graph clears old results.
- Limit is an integer from 1 to 2,000. Receipts/view metadata record requested limit, full query-item count and truncation. Extra summary tables describe the full query. Lineage retains full query context, including nodes/edges outside the limited exported view. Every exported relationship has both endpoints present.
- FNV-1a over UTF-8 provides a deterministic 32-bit checksum of supported node/edge fields. Graph metadata is excluded. It is neither cryptographic nor evidence of source truth, approval or authentication. Download the input graph separately to rerun a query; the ZIP contains query outputs and context, not the complete input graph.

## Verification

`node --test tests/step-one-graph-views.test.cjs`

Tests use the actual app script in jsdom and inspect real query results, rendered DOM, CSV roundtrips and generated ZIP entries. Browser validation and publication are recorded separately by the integration owner. No browser/deployment claim follows merely from these tests.

PMO score clarification: `max_risk_score_all` (computed attribute `milestone_max_risk_score_all`) includes all matching open risks upstream of a flagged milestone, including those with an Approved control. The separate unmitigated-risk count excludes those risks. The demo deliberately shows count 1 with maximum 25: unmitigated R1 is 20; controlled R2 is 25. A regression checks both the values and visible explanation.
