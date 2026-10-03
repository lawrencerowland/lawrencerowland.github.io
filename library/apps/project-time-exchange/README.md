# Project Time Exchange

One maintained Library home for a small project time–cost comparison and its original explanatory article. Subject: Delivery dynamics. Native HTML/CSS/JavaScript; no build, remote dependency, persistence, payment or backend service.

## Provenance

Migrated 2026-10-03 from `lawrencerowland/Project-web-apps`, revision `9eb0973712a2d096c0642754ab238f7be7af41b1`:

| Source | SHA-256 |
| --- | --- |
| `web_apps/project_time_exchange.html` | `c18279eee6f23c02f4bee01e2a0de85542fb27206518a5eada4d16ced7b0af9e` |
| `web_apps/project_time_exchange_explainer.html` | `c91726622eefbd944a50aaa14540e6cd98f011be8b92e7ab8bf72ef6a0e80cd8` |

The original fictional A–G network, all discrete menus, and baseline of 25 weeks are preserved in `example.js`. There are 648 menu portfolios. The article is at `#explainer`; its former meaningful section anchor `#pilot` is retained. `#procurement-proposal` opens the labelled proposal disclosure. The source app had no persistence to migrate.

## What is retained

- Finish-to-start, zero-lag CPM, earliest/latest times, float, critical sets and baseline/chosen Gantts, including disconnected tasks and zero-duration milestones.
- Explicit per-task duration/cost menus and exhaustive bounded enumeration; full cost/makespan Pareto frontier, affordable knee heuristic, declared linear value-of-time objective, and manual frontier choice.
- JSON editors, input/result import, example reset, baseline recomputation, input/result JSON download, schedules/frontier CSV, calculation log and a selectable result text fallback.
- The original explanation's whole-network complementarity, floors, credible menus, hidden resource/calendar coupling, audit/rebaseline, value assumptions, scaling and pilot concepts. Procurement/incentives remain a clearly separated proposal.

## Deliberate corrections

The budget is now enforced for every executable choice. It caps declared incremental option costs, not supplier payments. The declared option-zero baseline is retained even when another option is faster and free. Discrete menus need not have increasing marginal cost.

The former payment expression collapses to zero for non-negative costs and did not establish the advertised procurement mechanism. Its executable payments and claims of truthfulness, fair prices, budget balance and no deficit have been removed. The article preserves the research question and identifies missing participant, outcome, valuation, funding, participation and payment assumptions. It does not turn the comparison into procurement advice. The old developer ping and unsupported payment summary have no user-facing replacement; the useful method overview is readable in the article.

Imports validate before replacing applied input. Outputs are recomputed, never trusted from imported reports. Stale file reads, stale imported calculations and cancelled work cannot overwrite newer input/results. An imported selection is labelled `manual` unless it actually matches the recalculated named choice. Editing JSON or controls cancels pending work; displayed results retain their applied controls until rerun. Keyboard activation retains focus after selecting a re-rendered frontier point.

## Model and limits

`model.js` is independently usable from Node. Activities use stable object keys, including reserved strings. Each option is `{duration,cost}` with optional text `label`, `notes`, `risk`. Activity fields are `name`, `duration`, `crashOptions`, optional `floor` and `notes`; a dataset may also have `title`. Option 0 has the declared duration and zero extra cost. Unknown input fields are rejected rather than silently discarded. All options lie between floor (default zero) and baseline. Cycles, duplicate or dangling edges, invalid numbers and empty menus are rejected.

Times and costs support six decimal places, represented as integer millionths for path/cost and budget comparisons. Net-value comparison uses exact integer products. The numeric display is rounded to six decimals. Values and option costs/durations are non-negative, up to 1,000,000 per item; budget is at most 1,000,000,000. Limits are 40 tasks, 20 options per task, 50,000 portfolios, and `portfolios × (tasks + edges) ≤ 2,000,000`. A file is limited to 1.5 MB. Enumeration is chunked and cancellable. The chart samples at most 600 points plus selected/knee/value choices, with an explicit notice when sampled; the paged table and exports retain the entire frontier.

Equal cost/finish points have one deterministic representative. Welfare/value ties prefer lower cost, then earlier finish. The knee uses normalised cost/time axes and greatest absolute distance from their endpoint chord; for one or two points it chooses the fastest affordable point, while a collinear multi-point frontier chooses the first/lower-cost point. It is a geometric heuristic, not an economic optimum.

No shared resources, calendars, uncertainty, safety, contract feasibility, risk scoring, payment mechanism or earned-value integration are modelled. Text risk/evidence descriptions are retained but do not enter arithmetic. The result JSON records inputs/settings, declared baseline, selected portfolio/schedule, frontier, counts and assumptions. CSVs quote text, retain context and prefix formula-leading string cells with an apostrophe; JSON retains exact text. CSV is a convenience format, not a verified interchange specification for any planning product. Imported result modes and outputs are recomputed.

## Source-backed explanation

- [MIT, Critical Path Method lecture](https://ocw.mit.edu/courses/esd-36-system-project-management-fall-2012/resources/mitesd_36f12_lec02/) supports the CPM forward/backward/float explanation.
- [Tim Roughgarden, Algorithmic Game Theory lecture 7: VCG](https://theory.stanford.edu/~tim/f13/l/l7.pdf) supplies background on allocation and payments under specified outcome/valuation models; it does not verify this app's proposed procurement setting.

## Verification

Run `node --test tests/phase-two-time.test.cjs` from the repository root. Thirteen tests pass: independent path-based CPM and pairwise-dominance frontier references; exhaustive budget/value choices; zero-edge and zero-duration cases; declared baseline with a faster free option; exact decimals; knee convention; cycles/floors/caps/invalid inputs; reserved IDs and safe exports; actual jsdom editing, cancellation, asynchronous imports, recomputation, budget controls and keyboard focus.

An independent agent also reported 80 generated five-task/three-option cases agreeing with its naive exhaustive CPM/frontier/net-value reference. Browser layout, actual download handling and human usefulness remain separate integration checks; passing these source/model/UI tests does not establish deployment or operational schedule validity.
