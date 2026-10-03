# Investment & delivery playbook guide — 3.1

A rule-based tailoring and evidence-review demonstrator for the wholly invented Fellbridge Station Access project. Four fixed rules connect a supplied context to explicit source passages and eight review questions.

## Implemented

- Share the editable project profile and 13-source packet with the evidence cluster through the shell's explicit stage/load flow.
- Explain every applicability condition, including rules not triggered. BASE always applies. ACCESS applies to station-access work or a required working window; unknown relevant context keeps it as an unresolved candidate. HIGH applies to high cost, NOVEL to novel work; unknown values retain candidates.
- Surface the tension between station-access work and a profile that says no working window is needed; the station-access clause remains selected.
- Provide eight minimum-evidence questions: decision owner, scope, cost-baseline status, accessible route, agreed working window, independent estimate, bounded trial and fallback.
- Attach any supplied source paragraphs to each question and record an accountable role, user-authored assessment and local review state. Source inspection requires a cited passage and a nonblank note. A follow-up can be recorded without a source.
- Separate current-source availability, contested/missing/superseded references, local inspection and source adequacy. None is a compliance or approval score. A current passage can itself describe a missing agreement.
- Preserve notes for all requirements when profile changes make clauses inactive. Any packet change reopens local inspections and marks their prior context stale.
- Highlight edited rule source text, version or status: the applicability conditions remain fixed code, so changing prose cannot silently alter the rule engine.
- Assemble a copyable tailored Markdown extract containing every applicable/candidate clause, exact rule citation, evidence quotations, review notes and warnings. A checklist view filter never removes obligations from the output.

## Hand-checkable reference results

- The initial station-access/medium/established/unknown profile selects BASE and ACCESS: two clauses, five checklist questions. COST is missing. The temporary-route references include contested LAYOUT. ACCESS-NOW states agreement is outstanding despite being the current version.
- Unknown cost and novelty retain HIGH and NOVEL as unresolved candidates. High cost and novel work select them as applicable.
- Renewal/low/established/not-required selects BASE only.
- Station-access/not-required surfaces a context tension and retains ACCESS.
- Independent estimate, bounded trial and fallback initially have no source attached. The app does not treat a generic cost paragraph as an independent estimate or fabricate missing trial evidence.

## Validation and verification

`node --test apps/delivery-playbook-guide/app.test.mjs`

Ten focused model/render tests cover exact selected clauses, unknown branches, contradictory context, exact rule/document citations, availability labels, local-review prerequisites, packet staleness, rule-text changes, unchanged output under view filtering, escaping, malformed imports, source-reference and context-key invariants, and revision limits. Review keys are internally checked against valid canonical source packets. They are comparison keys, not authentication.

No browser or human usability test is claimed by this module. Root integration owns page-shell and publication checks.

## Boundaries and departures

This first version uses four newly authored rules for one fictional station project, with explicit work type, cost, novelty and working-window need. It does not model a full real delivery framework, service-disruption thresholds, operational authority, authenticated review, semantic proof of evidence adequacy or automatic policy amendments. The route-selector and state-machine apps remain independent examples; a shared source packet is exchanged only among the four evidence-cluster tools.

Rule-based tailoring completes the core mechanism at this deliberately small scope. No AI explanation is claimed or needed here. A short stable procedure may be clearer as a conventional checklist; the useful intervention is making conditional obligations and uncertainty visible when the context changes. All sample data and playbook wording are newly authored fiction.
