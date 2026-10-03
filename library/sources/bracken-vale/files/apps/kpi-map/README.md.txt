# KPI relationship map — working trial 7.4

A native diagnostic for 12 fictional KPI definitions, 23 source fields and five metric-to-metric relationships. Six objective groups organise the dictionary. Infrastructure, passenger-operator, freight-operator and station-user boundaries are explicit. State is local and independent of other trials.

## Implemented

- Switch the metric network and objective-group hierarchy. Group links perform no arithmetic.
- Inspect a complete KPI dictionary: owner, formula, output unit, denominator, actor, project, refresh period and definition.
- Select a KPI to inspect its upstream numerator/denominator field links and source period/unit/value.
- Edit source observations (blank means unknown), units and period. Edit ownership, formula field references/multiplier, output unit, refresh period, definition and objective group.
- Add an aggregation claim or causal hypothesis with a rationale; these relations are diagnosed, never used to calculate or propagate values.
- Show missing ownership/source data, zero denominator, source actor/project or period mismatch, formula-unit mismatch, incompatible aggregation and untested causal links.
- Formula evaluation is a safe explicit numerator ÷ denominator × multiplier (or identity × multiplier); no expression evaluation or arbitrary code. Nonfinite results remain unknown.
- Shared shell supplies independent save/load/import/export/reset. Tables accompany graph projections and source inspection.

## Reference checks

Run `node --test apps/kpi-map/app.test.mjs`. Eight tests check the hand-calculated fixture, unknown/zero-denominator semantics, isolated source edits, seeded findings, relationship-type distinctions, import failures, escaped accessible form controls and hostile presentation extras.

Reference values: asset availability = 930 / 1000 × 100 = 93%; decision waiting = 42 / 7 = 6 days/decision; unowned action count = 3; material reuse = 18 / 60 × 100 = 30%. Evidence freshness is unknown because its numerator is null; entering 15 produces 75%. BVR-K4 has no owner. BVR-KL1 proposes an incompatible percentage-to-days aggregation. BVR-KL4 incorrectly proposes combining passenger and freight ratios with different actors and denominators. Three causal links remain explicitly untested.

## Limits and simpler practice

These are scenario-specific metric definitions, not official railway performance measures or a balanced-scorecard recommendation. Compatible-looking units do not establish valid aggregation; no metric-to-metric link combines values. Formula units are checked by stated unit strings and boundary identifiers, not by a general dimensional-analysis engine. Source data is fictional and manually entered; there are no live organisational feeds or causal predictions. A KPI dictionary table may be sufficient; the network adds visibility of assumed relationships. Practical diagnostic usefulness has not been measured.

Graph rendering uses a closed projection of known text fields and computed finite coordinates. Imported fill/style/stroke or extra relationship-label objects are never coerced or copied into SVG.
