# Concept triad builder

Historical source names, revisions and hashes below identify the reviewed inputs; they are not retrieval links. [Maintained source and verification files](https://github.com/lawrencerowland/lawrencerowland.github.io/tree/master/library/apps/concept-triad-builder).

Reviewed and adapted for the Library, 2 October 2026. Subject: Decisions & trade-offs.

## Provenance

- Original ID 20, `interactive-concept-map`, in Project-web-apps at revision `9d9c253f9c203441be1fd301bcb9a6b976b85d4f`.
- `lawrencerowland/Project-web-apps@9d9c253f9c203441be1fd301bcb9a6b976b85d4f:web_apps/interactive-concept-map.html`, SHA-256 `097fce2ae5192d3e18a3fdb86cef494fdb98cbed18213fdeb3bfb48fd1d890fe`.
- `lawrencerowland/Project-web-apps@9d9c253f9c203441be1fd301bcb9a6b976b85d4f:tsx_apps/interactive-concept-map.tsx`, SHA-256 `5d6d3d90b6ca2656f32c35ef76c2c4aed35a8763625e63d9a74cfc2b3d65e975`.

## Retained and corrected

Retained sequential title/first/second/third entry, multiple titled triangle cards, a distinct green third vertex, instructions and the explanation of challenging a two-sided framing. The tool now trims only on submission, so ordinary multiword typing works. State updates are immutable; partial cards show their missing concepts explicitly.

Added Back, Cancel draft, edit/remove completed cards, Undo, a labelled fictional example, readable full concept lists beside the SVG, and complete JSON save/load including accepted partial drafts. Import validation and preview precede replacement; duplicate titles retain separate stable IDs. Dialogs, labels, keyboard submission and status/empty states support ordinary keyboard use. Long labels wrap/shorten in the diagram while their full text remains visible in the list.

The attribution is grounded in Dave Snowden's [A trialectic method, 17 January 2021](https://thecynefin.co/28999-2/). The app drafts three concepts inspired by that proposal. It does not implement participant positioning, SenseMaker, weighted relations or evidence of improved decisions. Equal triangle spacing is a display choice. The explanatory intention is retained without promising that a third concept resolves conflict.

## Operation and checks

Native HTML/CSS/JavaScript; no framework, bundle, build step, external runtime request or storage key. Open `index.html` directly or serve this directory. Files are read/generated in the browser. Reloading loses unsaved entries; JSON includes completed cards and concepts already added to an unfinished draft. No authored-data upload is implemented. The original had no browser storage to migrate.

Run from the site root: `node --test tests/eight-capability-models.test.cjs`. Fifteen shared model tests pass, including multiword sequential entry, immutable drafts, blank/incomplete rejection, duplicate-title identity and complete/partial JSON round-trips. All five scripts across both apps pass syntax checks. Browser operation and saved-file reopening remain separate integration checks; no human-use benefit is claimed from these tests.
