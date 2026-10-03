# Project Frontier Lab

One fictional cloud-migration case viewed through five independent planning experiments. Maintained home: **Decisions & trade-offs** at `/library/apps/project-frontier-lab/`. Reviewed 3 October 2026; the original describes itself as rebuilt 11 July 2026.

## Provenance

Migrated from [`Project-web-apps/web_apps/advanced_project_planning_ideas.html`](https://github.com/lawrencerowland/Project-web-apps/blob/9eb0973712a2d096c0642754ab238f7be7af41b1/web_apps/advanced_project_planning_ideas.html), source repository revision `9eb0973712a2d096c0642754ab238f7be7af41b1`. The source was read, not modified, during this implementation.

- Original HTML SHA-256: `d8c7afd31179c7c431839dfe4e4346bc0b68d43f789c199598cd7a60fb82e4cb`.
- `tests/fixtures/phase-two-frontier-schedules.json` SHA-256: `3fd3e399bcf40ac537d878906c2cd1a81d8319d133459372f24a2fc6ef30273f`.
- The fixture records the unchanged source's 45 schedules: 5 policies × 3 duration scenarios × 3 capacities. It was obtained by running the original embedded script and calling its original `simulate` function, recording starts/finishes and all reported metrics. It is a regression reference, not external evidence that the assumptions describe a real project.

The previous read-only audit identified the useful whole case, verified 45 bounded schedule runs, and flagged the allocator's greedy nature, invented regret weights and independence of lens edits. This migration preserves those boundaries explicitly.

## Retained

1. **Demand:** all five demands, seven dispositions, two presets, obligation flag, synthetic relative-effort multipliers, commitment/avoidance/test counts and direct obligation-deletion warning. The other dispositions still require an owner's review; the app does not infer compliance.
2. **Evidence:** all four claims, sensors and owners; activity, evidence currency, threshold and reviewer controls; ordered weakest-link checks; and the separate gate-authority decision. Accepting every chain makes a case eligible for review, never approved.
3. **Scarcity:** all four packages, delay/confidence/minimum-package/alternative inputs, fixed reuse assumptions, per-day score, whole-package greedy ranking, deferred-package triggers and leftover capacity.
4. **Topology:** seven named nodes, ten typed directed links, active-edge controls, one-node outage, typed reachability, precedence-cycle detection, SVG and text descriptions. Feedback remains distinct from precedence.
5. **Planner tournament:** eight fixed tasks, five original priority rules, base/data/access-control scenarios and one to three parallel workstreams; deterministic event-based schedules, score and average regret. The original `robust` policy ID is retained with the more accurate visible label **Balanced heuristic**.
6. The explanatory ledger, methods, illustrative-data boundary and links into deeper Library tools.

## Corrections and bounded improvements

- Numeric scarcity controls reject blank, non-finite, fractional and out-of-range settings instead of silently coercing them. The last valid output is labelled when an edit is invalid; it cannot be exported as though it represented that edit. The pool now includes the meaningful zero-capacity boundary. Minimum packages remain whole days.
- Leftover capacity after every package is funded is reported accurately; it is no longer described as below an imaginary next package. The greedy heuristic and a concrete suboptimality counterexample are visible.
- Demand rounding handles decimal half-tenths consistently: the conservative preset is 32.55 points, displayed as 32.6 rather than a binary-floating-point 32.5. “No direct deletion” replaces the unsupported claim that a scope plan is internally coherent.
- Evidence changes update badges and output in place, preserving the focused checkbox/select. Tab navigation uses one tab stop plus Left/Right/Home/End; active panels are focusable. Checkbox labels provide larger click/touch areas.
- Topology output distinguishes local evidence-to-release paths from upstream reachability and explicitly avoids implying AND-prerequisite satisfaction or an authorised release. Unavailable feedback edges are excluded from the available-link count. Full node names and active typed links have a text equivalent; graph lines end at node borders so their arrowheads remain visible.
- Schedule stress cases can now be inspected individually. Priority formulas, score weights, stress increments and every fixed task input are visible. “First validated outcome” becomes **first assumed outcome** and “critical uncertainty” becomes **unresolved uncertainty**, matching what is actually calculated. All original schedule results remain unchanged. Lowest-regret ties are named instead of silently choosing the first tied policy.
- Native HTML/CSS/JS, no external runtime or network data, a canonical Library route, subject navigation, a skip link, mobile table labels, visible focus, and readable method content without JavaScript.
- Portable version-1 JSON snapshots cover all editable settings plus selected lens, policy and scenario. Export writes selectable text; import validates the complete bounded schema before any change. Duplicate/missing IDs, unknown fields, invalid scalar values and oversized text are rejected. Restoring the original example resets all lens settings. Nothing is saved to browser storage and no original persisted state existed to migrate.

## Scope and limitations

The lenses share explanatory context and a current ledger, **not a coupled planning model**. Scope changes do not alter schedule tasks; topology edits do not alter the scheduler; accepting evidence does not approve a gate; the greedy allocation does not commit real people or dates. The ledger is recalculated output, not a historical audit log.

All numbers, effort factors, priority points, score weights and stress increments are invented. Demand estimates cover immediate commitment, not total lifecycle savings or the cost of follow-on work. The allocator is a rank-and-fit whole-package heuristic, not a knapsack optimum. A path is structural reachability, not a proof that all prerequisites or authority requirements hold.

The scheduler uses non-preemptive tasks, one identical workstream per task, fixed finish-to-start dependencies and scenario durations known before scheduling. There are no calendars, named skill pools, lags, release dates, costs, stochastic estimates, surprise-driven replanning or operational data. An outcome flag assumes value on task completion; uncertainty and reuse are synthetic sums. Average regret compares only the five declared heuristics using equally weighted scenarios, not an exact scheduling optimum or a calibrated robustness result.

The snapshot schema intentionally permits editing only the controls already present. It contains settings, not custom names/tasks/edges, evidence attachments or output history. A visible invalid scarcity edit prevents export until corrected. There is no autosave and no imported legacy browser state.

## Verification

Run `node --test tests/phase-two-frontier.test.cjs` after installing the existing `tools/library-apps` dependencies. Eleven tests pass, covering:

- All 45 original schedule regressions, independently checked for task coverage, precedence, capacity and objective arithmetic; invalid schedule inputs.
- Actual demand presets, obligation warning and lens independence.
- All 24 evidence-chain combinations; completing the actual UI while preserving keyboard focus; a stale-evidence regression after acceptance.
- A concrete greedy-allocation counterexample, zero/all-funded boundaries, indivisibility, invalid inputs and actual UI rejection/recovery.
- Feedback versus precedence cycles, outages and the distinction between local evidence paths and upstream reachability.
- All 45 policy/scenario/capacity combinations through actual change handlers, including stress-schedule output and regret arithmetic.
- Complete export/reset/import through the UI; atomic rejection of malformed/oversized/unsupported snapshots; canonical ordering of IDs.
- Keyboard tab navigation, control labels, mobile table labels and canonical/noscript scaffolding.

DOM tests use jsdom and do not establish visual layout or a human-use outcome. Parent integration performs the real-browser desktop/mobile journeys and overall site checks. This implementation itself does not claim publication or deployment.
