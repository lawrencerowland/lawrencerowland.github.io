# Lessons review assistant · 6.4

A local lesson register, version history, milestone retrieval queue, review-action record and explicit calendar export. Thirty newly authored fictional retrospective passages ground thirty starting lessons.

## Construction and sample

The corpus covers access, interfaces, station users, evidence, data and maintenance (five lessons each). A lesson carries a project, one or more version records, stage, context tags, source IDs, date and author label. Revising appends a version and preserves earlier text and evidence links. New capture requires an actual local source passage.

Three milestones cover the Fellbridge option decision, North Spur interface review and monitoring-data handover. Retrieval requires an exact stage match and at least one shared tag. Rank = 2 × shared-tag count + 1 for the same originating project, with a stable ID tie-break. This rank is a disclosed relevance heuristic, not causal importance. The initial Fellbridge queue is exactly L01, L02, L04, L11, L12, L14, L16, L17 and L20; L21 is a counterexample that should not appear there.

Review records bind a specific lesson version, its exact cited source passages and the milestone context. A source, lesson or milestone change makes the prior action visibly stale. Planned/dismissed/acted are unauthenticated local user assertions, not external activity verification. Source snapshots remain in review records.

A short AI synthesis was genuinely authored by Codex during this build on 3 October 2026 for the seed Fellbridge snapshot, citing L01/L11/L16 and their source paragraphs. It is labelled recorded, never regenerated, and disabled when lessons, sources, milestone corpus, reporting date or selected milestone differ from that snapshot. The current queue and brief remain deterministic.

## Walkthrough

- Select **Temporary access option decision**, inspect L01 and its source.
- Use **Record milestone action** with a reason, owner and due date.
- Expand **Revise this lesson** and **Append lesson version**. The old version survives and the action becomes stale.
- Use **Compare a recorded AI synthesis** on the unchanged seed; edited snapshots explain why it is unavailable.
- Copy the cited brief or **Download calendar review event (.ics)**. Import that all-day event into a calendar and configure any reminder there.

## Verification and boundaries

`node --test apps/lessons-review/app.test.mjs` covers the exact nine-lesson queue, irrelevant exclusion, retained versions, source/context staleness, grounded new capture, unsupported citations, calendar file structure/CRLF injection prevention, malformed keys, roundtrip and escaping.

The calendar is an explicit alternative, not an automatic backend. The page never observes the closed browser, sends messages or claims notification delivery. Live AI review, authenticated team capture/storage and a scheduler remain unimplemented source ambitions. The toy corpus is not actual incident history or proof of a general causal mechanism. A normal lesson register remains simpler for capture alone. Root owns browser/publication checks.
