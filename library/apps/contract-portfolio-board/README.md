# Contract Portfolio Board

A small scope and ownership thinking board. Three proposed contract packages sit beside an unassigned pool; Context, Internal ownership and Concept of operations keep different kinds of material visible. This is a planning arrangement, not a contractual allocation, approval, procurement recommendation or completeness assessment.

## Source and review

Reviewed and rebuilt on 2 October 2026 from [`Project-web-apps/web_apps/contract-portfolio-board.html`](https://github.com/lawrencerowland/Project-web-apps/blob/72e90ed92af79205776ceac87b1d81136f85e4ec/web_apps/contract-portfolio-board.html).

The original supplied the three-contract layout, Digital Strategy workstream, four candidate artefacts, unassigned pool and explanation of context, internal ownership and operating concepts. It also presented controls/styles for filtering, splitting, ordering, ticks and import/export. Its executable only seeded cards, toggled a few information panels and removed a clicked unassigned card. This successor implements the useful intended workflow rather than presenting those controls as previously working features.

The original four artefacts are retained: Project charter, Future state processes, Business requirements, and Stakeholder analysis. The introductory purpose and “select then place” interaction are retained and expanded into accessible instructions. Missing context/extra-feature explanations are made explicit. The user requested retaining this board despite its incomplete original implementation.

## Working features

- Add/edit artefact titles and notes. Each artefact has one primary home and a stable ID. Notes can describe shared interfaces without silently duplicating scope.
- Select one or several artefacts, then choose a destination or press “Place selected here”. Selection never deletes. Remove is a separate, undoable action.
- Move between direct contract scope, workstreams, Unassigned, Context, Internal ownership and ConOps. Names can change without changing identity.
- Add/rename/reorder workstreams; move whole workstreams with their contents; split chosen artefacts into a new sibling, retaining order, notes, IDs and review ticks. Only empty workstreams can be removed.
- Reorder an artefact within its current destination. Review ticks mean “looked at”, not approved, completed or assigned to a legal party.
- Filter by title, notes, destination and review tick. Changing a filter clears selection to avoid acting on hidden selections. Ordering operates on the complete destination, including filtered items.
- Undo/redo up to 100 edits, including imports, local loads and reset. A new edit after undo starts a new history branch. Reset does not overwrite the local save.
- Explicit local save/load, automatic reopening of the last explicit save, portable JSON export, file/pasted JSON import and an editable correction area after failed imports.

## State and persistence

The original has no localStorage key to migrate. This app uses **only** `contract-portfolio-board.v1`; it never clears storage or changes another app's keys. Save writes a validated `{savedAt, board}` record. There is no autosave: edits remain in the current tab until the user presses Save locally or exports. Saved content is local to this origin/browser and is not a shared workspace or cross-device backup.

JSON version 1 contains the board title, seven typed groups, workstreams, artefacts, placement/order, notes and review ticks. Filters, selection and undo history are temporary. Duplicate display names are allowed; IDs must be globally unique. Every artefact must occur in exactly one destination, including Unassigned. A whole workstream can move to any group except Unassigned, which remains a flat candidate list.

Imports validate the complete shape before changing the board. Unknown fields are rejected rather than discarded, as are unsupported versions, broken references, duplicate allocations, invalid field types and missing artefacts. A failed import retains the working board and the editable JSON. A valid import is undoable and does not overwrite the browser save. File-read races cannot apply an earlier file after a newer choice or a closed dialog.

Bounds: 300 artefacts, 60 workstreams, 200-character titles, 4,000-character notes and a complete JSON export of at most 1.5 MB. Empty boards are supported. Storage access/quota failures are reported without claiming a save. Malformed saved content is preserved while the example is shown. Use a valid exported JSON file to recover or explicitly save a corrected working board.

## Interface and limits

Native buttons, labelled inputs, checkboxes and dialogs provide keyboard access; there is no drag-only operation. Imported content is rendered with text/value APIs, not HTML. The mobile layout stacks groups and brings Unassigned above the contracts. Local scripts/styles have no external runtime dependencies.

The board intentionally stays small: three editable contract placeholders and four supporting destinations, with no scheduling, costing, legal interpretation, multiuser synchronization or inferred accountability. It helps a person arrange and revise scope ideas; it does not make the underlying decisions.

## Verification

`tests/step-one-contract-board.test.cjs` exercises placement/content conservation, splits, stream transfers, item/stream order, renames, malformed imports, empty and hostile-text round trips, limits, undo/redo branches, storage isolation/failures, and actual DOM handlers through jsdom. The DOM journeys cover select/place/edit, filter selection, split/move, cancel, corrected import, saved reopen and reset recovery.

Run with `node --test tests/step-one-contract-board.test.cjs` after installing the existing `tools/library-apps` development dependencies. These checks do not establish rendered-browser usability, OS-level download completion or human usefulness. Those remain separate from the model and DOM checks.

## Suggested browser review

1. Select Project charter; place it in Digital Strategy. Confirm all four artefacts remain.
2. Place Business requirements there too; split it into “Definition”; move that workstream to Contract 2 or Internal ownership.
3. Edit its note, tick Reviewed, reorder, rename a group, then undo/redo several changes.
4. Save locally, make an unsaved edit, reload: the saved version reopens. Reset and Undo should recover the current board without changing that save.
5. Export; import malformed JSON; correct the same text and retry. Confirm a rejected import changed neither the board nor its saved copy.
6. Repeat select/place and the editor at a narrow width using keyboard controls. Check that long names wrap and dialogs remain usable.
