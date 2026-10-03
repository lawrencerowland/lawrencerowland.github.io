# Fictional refuge handover exercise

This pack checks record structure, declared approval policy and the byte consistency of listed evidence. It does not verify identities, signing authority, independence, engineering content, real execution or acceptance. All project details and signoffs are invented. An empty risk findings array means no assessment was performed.

Unzip, open a terminal in this directory, and run `node check.cjs` with Node 22 or later. There are no packages to install. `make validate` is an optional equivalent. Every invocation reads the current files and recomputes SHA-256; no cached status file is used. Exit 0 means only that these bounded package checks passed; exit 1 means a failed check; exit 2 means a check could not run. The acceptance row always remains unknown.

To check a browser experiment, save its “Download current inputs” JSON alongside this checker and run `node check.cjs handover-inputs.json`. The JSON snapshot contains the record, flat digest map, toy policy and exact UTF-8 text of its evidence files. It contains no browser-generated result that the checker trusts.

Try changing a byte in `evidence/concept-note.txt`, deleting `evidence/risk-review.json`, repeating a declared signer, or wrapping `digests.json` in a `digests` object. Run again after each change. A failed run must fail again until its input is repaired. Restoring the original file repairs byte consistency. Updating a digest to match new content merely declares a new baseline; it does not approve the change.

`handover.schema.json` documents the record using JSON Schema 2020-12. The shared model implements these specific record checks, including valid whole-second UTC dates, without loading a general schema engine. `policy.json` names the fixed teaching policy: at least two distinct declared signer names covering Project Architect and Safety & Access, plus unique evidence names and digest references. Changed or missing policy configuration yields an unknown result, never a pass. `digests.json` is a flat map; each reference must resolve to a 64-character lowercase SHA-256 value.

`validate.workflow.yml` is a small example workflow for a repository whose root is this pack. Copy it to `.github/workflows/validate.yml` if you want to try it there. It runs the same checker, has read-only repository permissions and performs no signing or deployment. Node must be available on the runner. A CI result still concerns this toy package only.

No Cosign or OPA result is simulated. Real attestation would need an actual signed artifact, a constrained trusted identity and explicit binding to the intended project, handover revision and evidence inventory. That integration is outside this exercise.

See `PROVENANCE.md` for the original prototype and the repaired failure modes.
