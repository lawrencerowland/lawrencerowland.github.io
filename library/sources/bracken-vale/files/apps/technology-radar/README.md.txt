# Team technology radar — working trial 2.1

A native Bracken Vale workshop tool with eight invented proposals, four quadrants and four editable adoption-ring labels. Projects, roles, trial notes and dates are fictional. This local state is independent of the other applications.

## Implemented

- Nominate a tool/practice with project, quadrant, ring, owner, review date, evidence and next experiment.
- Review an existing nomination; every ring move and every recorded review requires a rationale and stores the author role, fictional reporting date and evidence snapshot.
- Record separate sponsor and practitioner suggested rings and reasons. Switch the plotted viewpoint without modifying the agreed placement or durable revision.
- Inspect the whole radar through its numbered table; all changes use keyboard-operable forms. Graph positions are derived from rings, with angle used only for legibility.
- Rename the rings while retaining stable ring IDs and history. Inspect overdue reviews against an adjustable scenario date.
- Shared shell supplies local persistence, import/export and reset.

## Reference checks

Run `node --test apps/technology-radar/app.test.mjs`. Nine tests check JSON roundtrip/reset fixture integrity, mandatory rationale and history, nomination completion, viewpoint isolation, malformed import/invalid dates, escaped values, unique labelled form controls and chronological history/review constraints.

Moving BVR-TECH2 from R2 to R1 adds a second history entry containing R2 → R1, the owner and evidence. A blank rationale rejects the entire change and returns the unchanged original state. Practitioner view changes the plotted coordinates but leaves recorded rings and revision unchanged.

## Limits and simpler practice

Positions are explicit workshop judgements, never approval of fitness, security or value. Evidence is authored text, not independently verified. A copied record or role name does not prove that a real sponsor/practitioner participated. There are no shared nominations, votes, live reviews, AI assessments or connections to equipment. Eight proposals provide a readable cross-quadrant sample; no fixed proposal count was required. An ordinary trial register may be enough; the radar supplies a visual conversation aid using the same table data. Human adoption benefit has not been measured.

Reporting dates cannot move before a recorded nomination or review. Imported histories must be chronological and no later than the reporting date. The next review date must be on or after the latest recorded review; new nominations and reviews require a next date on or after their reporting date. Existing overdue records remain visible when time advances.
