# Constraint & engagement librarian — 1.1

A local evidence shelf and constraint register for the wholly invented Fellbridge Station Access project. It implements the first demonstrator of the intention, not the proposed grounded AI service.

## Implemented

- Search all significant query tokens across source IDs, titles, versions, paragraph labels, topics and passage text. Tokens are combined with AND; common question words are ignored. Matching is case-insensitive substring matching, not semantic retrieval.
- Combine topic and status filters. The initial view includes current, contested and missing records and excludes superseded records. All 13 sources remain in the packet.
- Return an explicit corpus/filter gap for an unmatched query. Display current, contested, superseded and missing extracts honestly: a missing placeholder never supplies a positive assertion.
- Compare any two records, including the initial v1/v2 access notes and the community/layout contradiction. These are preidentified scenario pairs; the tool does not detect contradictions in arbitrary edited text.
- Add a source to a constraint-and-commitment register, record user interpretation, accountable role, next step and local inspection state, or remove the entry.
- Retain the exact source passage, status, citation and canonical packet snapshot for each entry. Changed packets preserve the old passage and user notes, reopen inspection and visibly mark the retained snapshot stale. Refreshing a snapshot is explicit.
- Assemble a copyable Markdown working register with citations, staleness, user notes and packet warnings. The shared shell exports/imports the whole trial and explicitly stages/loads evidence packets between the four evidence apps.

## Hand-checkable reference results

- Initial search has 12 records: ACCESS-OLD is excluded, LAYOUT and COST stay visible.
- `night window` with initial filters returns ACCESS-NOW only: Operator working-window note, v2, §3, which says the proposal is not confirmed. Including superseded sources returns ACCESS-OLD and ACCESS-NOW.
- `bat habitat` returns no passage and an explicit evidence gap.
- COMMUNITY retains the daytime step-free commitment; LAYOUT is contested and reports a possible obstruction. Neither silently wins.
- Changing any packet context after pinning a source preserves its retained passage but invalidates its prior local inspection.

## Validation and verification

`node --test apps/constraint-evidence-librarian/app.test.mjs`

Nine focused model/render tests cover the reference queries, contradiction visibility, exact citation versions and paragraphs, independent states, composition of filters, missing-source handling, register mutation and staleness, unchanged failure results, HTML escaping, malformed imports, snapshot internal coherence and revision limits. Source snapshots are checked against their encoded packet so an imported citation or passage cannot contradict that same packet. This is internal consistency, not source authentication.

No browser or human usability test is claimed by this module. Root integration owns page-shell and publication checks.

## Boundaries and departures

The first version contains 13 synthetic records for one project, four record statuses and topic filters. It does not implement a larger archive, stakeholder/date facets, a retrieval server, authenticated users, semantic search, live AI answers, or evidence of practical time savings. Quotes and user notes are clearly differentiated; the corpus never establishes legal, engineering or operational compliance. A current source may explicitly say that an agreement is absent. An empty register never implies permission or absence of constraints.

The method is useful when versions and conflicting commitments need to be compared and traced. For a stable short list, a conventional register may be simpler. All public sample data and wording are newly authored for this fictional demonstration.
