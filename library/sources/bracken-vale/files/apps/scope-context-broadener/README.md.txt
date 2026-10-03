# Scope & context broadener · 5.4

A local typed-vocabulary traversal and review checklist. It preserves the intended concept paths, provenance, unknown vocabulary and persistent accept/defer/reject decisions without claiming a formal ontology reasoner.

## Construction and scope

The invented Bracken Vale context vocabulary v1.0 contains 16 concepts and 16 individually referenced rules. Each rule has a source section, relation type and rationale. From each declared scope concept, depth-first traversal follows at most three directed rules without revisiting a node within a path. Targets already declared are excluded from suggestions. Multiple supporting paths stay visible.

A judgement is keyed to project, vocabulary version and the sorted supporting paths. An unchanged rejected suggestion stays rejected. If a new scope item adds a path, the previous decision/reason remains visible and the changed context explicitly requests review. Accepted factors expand the graph with their intermediate rule steps. Deferred/rejected factors remain in the exported checklist.

Unknown concepts use explicit extension records with no invented rules. The loaded drainage telemetry interface demonstrates this boundary. Project labels select context for a local assessment; they do not retrieve another app's records.

## Walkthrough

1. Read the loaded station/temporary-work scope and visible unknown concept.
2. Inspect **Passenger accessibility**, including R1 and R6, then **Record context judgement** with a reason.
3. Reject ecology. Reviewing another suggestion does not reopen that rejection.
4. Add bridge using **Update starting scope**. Its additional ecology path R12 makes the prior judgement visibly stale and retains the reason.
5. Accept a factor and inspect the expanded typed graph/table; copy the full context report.

## Verification and limits

`node --test apps/scope-context-broadener/app.test.mjs` covers six references: known paths and unknowns, rejection persistence, explicit reopening on a new path, accepted graph expansion/view invariance, unknown extension and atomic invalid review, retained-path import integrity and escaping.

This 16-concept vocabulary is intentionally bounded. It is newly authored fiction, not a rail standard or a complete ontology. Traversal cannot establish scope completeness, compatibility or permission. Compared with brainstorming it provides repeatable prompts, but expert judgement remains necessary. No formal reasoner, cross-app sync or live AI is claimed. Browser and publication checks belong to root integration.
