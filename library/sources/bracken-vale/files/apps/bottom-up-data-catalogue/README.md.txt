# Bottom-up data catalogue · 5.2

A deterministic CSV/JSON profiler for seven invented project tables. It preserves the original intention: examine actual values and quality before adopting a schema, and require a human judgement on guessed relationships.

## Construction and scope

A state-machine CSV parser handles quoted commas, doubled quotes, embedded newlines and CRLF. Flat JSON arrays become a union of object fields; absent values become null. Blank strings and nulls are missing. Types are unknown, boolean, integer, number, ISO date, text or mixed; leading-zero strings remain text. Dates must be real calendar dates. Fields retain their names and source rows.

For each field: null rate = missing / rows; repeated values = present count − distinct present values. A candidate key means all observed values are present and distinct, never a database guarantee. Joins are proposed when column names match with some value overlap, or at least two distinct values overlap. Coverage = matched non-null left rows / non-null left rows; target uniqueness and type compatibility remain separate diagnostics. At most 300 candidate relationships are retained, ordered by observed target uniqueness, coverage and stable reference; the selected-table view shows 12. No inferred relationship is accepted automatically. User confirm/reject judgements retain the exact table snapshot and become stale after any data change.

Seven seed tables cover projects, routes, assets, windows, tasks, costs and risks. They are deliberately small (three or four rows each) rather than a fabricated enterprise catalogue. Input is pasted CSV/JSON, not a database connection or file-picker integration. Bounds: 12 tables, 30 columns, 500 rows per table, 80,000 input characters and 2,000 characters per cell. Nested JSON is rejected.

## Walkthrough

1. Open **assets**: A2 repeats, one route is missing, and installed contains date/text/missing values.
2. Open **tasks** and inspect the proposed asset join. Three of four populated asset references overlap, but the target has duplicate A2 and A9 is an orphan.
3. Inspect date → date. Matching values do not mean a task date equals an agreed working window. **Record join judgement** with a reason.
4. Expand **Replace this table or add another CSV/JSON table**, edit a source, then **Parse and profile**. Earlier judgements become stale.
5. Copy the catalogue/quality/relationship report or use the shared review-file export.

## Verification and limits

`node --test apps/bottom-up-data-catalogue/app.test.mjs` covers seven substantive references: quoted parsing and CSV roundtrip, defects/types, JSON nulls and invalid cells, duplicate-target/orphan joins, explicit/stale reviews, atomic malformed/oversized inputs with escaping, and prototype-like JSON field names.

A spreadsheet inspection is simpler for one table. This tool exposes repeated quality and relationship assumptions. It cannot infer business meaning, operational permissions or full enterprise constraints; similar date/ID names are not equivalence. No AI, server, private upload or live integration is claimed. Browser and publication checks belong to root integration.
