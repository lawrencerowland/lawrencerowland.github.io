# A bounded trial with a way back — working trial 5.3

## Job and preserved intention
Design a low-consequence office experiment with a hypothesis, baseline, separate change dimensions, stop rules and an owned fallback. The model never controls a real template/file or railway system. It records a local charter, configuration, observations and decisions.

## Construction
The change vector has four components: minutes per record, reviewer people, sample records and allocated pounds. Components are compared individually and never summed. Draft edits increment the charter version and preserve a full charter/configuration snapshot in history. Launch locks the charter and requires a hypothesis, trial owner, fallback owner/procedure and all three numeric stop bounds and the sample-size bound.

Observations are cumulative effort hours, records checked, discrepancy count and cost. They must not decrease; discrepancies cannot exceed checked records. A strictly exceeded time, discrepancy-percentage, cost or sample-count bound changes the local state from running to stopped. Further observations are blocked. Rollback restores the selected baseline configuration exactly, retaining all observations and decisions. Completion requires observations within the bounds and a learning statement.

## Walkthrough and reference
**Save charter version** changes the draft. **Launch bounded trial**, then **Record cumulative observation** with 2 hours, 10 checked records, zero discrepancies and £121 cost. The default £120 bound is exceeded, so the probe stops. **Simulate exact rollback** restores 20 minutes/record, two reviewers, 12 records and £200 allocation. The trial proposal had 15 minutes/record and £180 allocation: delta −5 minutes/record and −£20, with zero change in the other two units.

## Checks and limits
`node --test apps/safe-to-fail-probes/app.test.mjs` runs eight tests for launch prerequisites, unit-preserving changes, stopped-state enforcement and exact rollback, preserved snapshots/monotonic observations, false-completion imports, escaped roundtrip handling, sample overrun and locked-charter import consistency.

A one-page charter and a saved baseline are the simpler comparator. Local planning/tracking is the complete public function. A real office trial still needs an executable real fallback and agreed measurement; this model cannot establish a safe-to-fail claim for operational infrastructure. No live experiment or operational recovery is performed.

A launched charter must match its retained full launch snapshot. Importing altered current bounds, proposal, hypothesis or fallback with an unchanged launch snapshot is rejected. This consistency check does not authenticate a wholly rewritten local history.
