# Probecrafter

An authored library of programme-conversation prompts, grouped by role, purpose and phase. It is a facilitation aid, not a validated diagnostic, maturity assessment or causal test.

Preserved from `Project-web-apps` at `9d9c253f9c203441be1fd301bcb9a6b976b85d4f`: all three packs and nine questions, their purposes, follow-ups, listening prompts, coaching notes and artefacts; three role snapshots, two session templates, three reflection dimensions, three general coaching notes, filters, selection, repeated questions, removal and clear. Source files: `web_apps/probecrafter.html` and `input_json/probecrafter.json`. The source library's own date, 18 February 2025, remains visible.

The October 2026 review repaired initial pack selection, keyboard access and loading errors; removed the inference from silence/laughter to low confidence; stopped equating an unchanged critical path with ineffective governance; and framed the suggested timings, roles and reflection checklist as examples. The surprise-review template now investigates possible causes rather than claiming to establish them.

Run-sheets include follow-ups, coaching notes and artefacts. They can be reordered, printed, exported as JSON, reimported and saved in this browser. Clear has an undo. Repeated questions remain allowed for different interviewees. Import checks the entire document and known question references before replacing the sheet. A storage failure is reported; export is the portable copy. Nothing is uploaded. The app and question library have no external runtime dependency.

Model checks: `node --test tests/eight-probecrafter-model.test.cjs`. Browser checks and publication status are recorded in the batch review, `docs/eight-library-homes.md`.
