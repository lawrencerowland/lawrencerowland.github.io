# A few useful signals — working trial 2.2

## Job and preserved intention
Curate a small role board, inspect source calculations and learn whether a signal prompted useful action. Six declared tiles cover gate age, ready-decision waiting, evidence age, rework share, first-pass share and accepted flow. They are office/project-control cues, never operational alarms. Three local role boards preserve their own pins and dismissals; source records and explicit thresholds are shared between those boards only.

## Construction
Date ages are calendar-day differences to the editable reporting date. Rework is returned items / first submissions ×100. First-pass share is its complement from the same synthetic completed cohort. Accepted flow is a recorded count for a declared 30-day period. Missing values and zero denominators remain unknown. A source is stale when its checked-date age exceeds the declared freshness window. Threshold breach is separate from freshness; stale status prevents an old value looking current.

Every source mapping/formula type is validated against six supported definitions. This version keeps semantically compatible local definitions rather than creating a cross-app live data connection. Shared fixtures on other trial pages remain independent.

## Walkthrough and reference
**Inspect signal** on Rework share, then **Update source** from 3 returned items / 10 submissions to 1 / 10. Rework moves from 30% to 10%; first-pass share moves from 70% to 90%. Missing accepted flow remains unknown. **Dismiss with reason**, then **Restore** preserves both events in history. **Open role board** shows that a dismissal does not alter another role’s board. **Record feedback** captures action/no-action/false-alarm with the threshold then in use.

## Checks and full ambition
`node --test apps/control-signal-tiles/app.test.mjs` runs six tests covering hand references and stale/unknown values, shared-source dependency updates, role isolation and retained rationale, invalid dates/counts and zero denominators, and JSON/escaping/import failures and observation dates that cannot precede their events.

The local calculated board fulfils the basic function. There is no hidden AI proposer, notification service, live integration or guarantee of early warning. A dated exception list is the simpler comparator. Useful actions per review describes the authored feedback log, not measured alert accuracy or a proven organisational benefit.
