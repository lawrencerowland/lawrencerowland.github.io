# Portfolio-office capability review

Historical source names, revisions and hashes below identify the reviewed inputs; they are not retrieval links. [Maintained source and verification files](https://github.com/lawrencerowland/lawrencerowland.github.io/tree/master/library/apps/p3m-capability-review).

Reviewed and adapted for the Library, 2 October 2026. Subject: Capabilities & futures.

## Provenance

- Original ID 14, `p3m-capability-tool`, in Project-web-apps at revision `9d9c253f9c203441be1fd301bcb9a6b976b85d4f`.
- `lawrencerowland/Project-web-apps@9d9c253f9c203441be1fd301bcb9a6b976b85d4f:web_apps/p3m-capability-tool.html`, SHA-256 `8db9afaae6451269bd06799b7a4960ef2f744fd14b36f05cf1db43939ce71c44`.
- `lawrencerowland/Project-web-apps@9d9c253f9c203441be1fd301bcb9a6b976b85d4f:tsx_apps/p3m-capability-tool.tsx`, SHA-256 `70248bc7d39c231fc5ea83906d7bab8b3441243b93b25bc1cc994cc471458c65`.
- The authored inventory and starting assessments are preserved in `example.js`: four categories, 21 subcategories and 110 individual capabilities. They are a supplied taxonomy and fictional example, not population-level maturity evidence.

## Retained and corrected

Retained three-level current/future assessment, editable names, add/remove capability, parent bulk updates, expansion, search/category/gap filtering, summary counts, clear, restore example, CSV import/export, and P3M/hierarchy/workshop explanations. The previously unconnected sample-CSV function now has a visible download control. JSON save/load also fulfils the original help text's promised format.

Stable IDs prevent duplicate-name edits/deletes from affecting the wrong row. Full CSV/JSON round-trips preserve custom rows and renamed groups; CSV supports quotes, commas, multiline names and empty fields. Imports validate before a preview and explicit replacement, with Undo. Malformed files never clear the current worksheet. The original five CSV columns remain accepted; new exports add ID, Parent ID and Type.

Counts now use individual capabilities: the source example has 110 leaves, 41 present, 98 targets, **zero confirmed gaps and 58 unknown targets**. Parent judgements do not inflate totals. Outside scope is explicit. Bulk changes are optional, described and undoable; ordinary parent changes preserve child detail. Filtering reveals matching branches and gives empty states.

Replaced unsupported “typical organisation” and “realistic 18-month” claims with example framing. Retained the suggested assessment-depth durations as workshop planning suggestions. The [PeopleCert P3M3 source](https://www.peoplecert.org/Organizations/Services/Drive-Organisational-Growth-P3M3) supports the distinction from formal maturity assessment; it does not validate this checklist.

## Operation and checks

Native HTML/CSS/JavaScript; no framework, bundle, build step, external runtime request or storage key. Open `index.html` directly or serve this directory. Files are read/generated in the browser; unsaved work is lost on reload. No automatic browser persistence or authored-data upload is implemented. The original had no browser storage to migrate.

Run from the site root: `node --test tests/eight-capability-models.test.cjs`. Fifteen shared model tests pass, covering inventory retention, unknown/gap separation, bulk updates, stable duplicate identities, complete and legacy CSV round-trips, rejected imports, clear/restore invariants and triad cases. All five scripts across both apps pass syntax checks. Browser journeys and saved-file reopening are separate verification steps managed by the integration task; model tests alone do not establish those results or human usefulness.
