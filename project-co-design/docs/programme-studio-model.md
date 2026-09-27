# Wildlife crossing programme studio: compatible designs and declared programme assumptions

Model 3.0.0 · 27 September 2026. [Open the studio](../apps/programme-studio.html) · [Coupling primer](../apps/programme-studio.html#coupling-primer) · [Curation record](curation.md).

The scenario is a road crossing with vegetated passage, guided habitat approaches and monitoring. The studio compares habitat plans, compatible crossing/fencing/monitoring packages, three delivery arrangements and four supplied stage strategies. Every displayed choice retains its implementing tuple. The separate staged-path essay generates legal work histories and checks construction-period readiness constraints. This studio's interpolated readiness curves do not perform that temporal feasibility check.

## Source → concept → construction → limit

The source basis is Zardini's design problems with implementation and composition of compatible implementing tuples, §§3.1–3.5, alongside Censi's minimal resource antichains. [Zardini dissertation](https://www.research-collection.ethz.ch/items/d7c08dd5-bf96-4c1f-a744-5e751f0f44a5), [Censi's mathematical co-design paper](https://arxiv.org/abs/1512.08055).

The concept is a relation between requested functionality and the resources of compatible implementations. The construction here is a finite catalogue join, four supplied schedules, a partial-order frontier and an exact affine resource evaluator. All package capacities, costs, durations, camera requirements, context and governance coefficients are invented. They teach how to configure a coupled project; they are not field estimates, ecological predictions or an engineering specification. The four Project Co-design essays share a wildlife-crossing scenario, **not a quantitatively integrated model or a common calibration**.

## The finite design relation

Fix the catalogues, scenario coefficient, landscape context, available connected catchment, works-alternative filters and feedback setting. These define the implementation universe and resource evaluator. External functionality is **model crossings/day**, ordered by the usual `≤`. Its deliberately invented proxy is:

```text
model crossings/day = planned width (m) × connected catchment (km) × scenario coefficient
```

The default coefficient is 2 model crossings/day per m·km. This monotone proxy is not an ecological response law: more fence or a wider structure does not establish increased animal use, species acceptance or population connectivity. Monitoring is a commissioning requirement; it does not multiply this proxy or prove use.

An implementation contains:

- a habitat plan: 20, 30 or 40 m of intended habitat width and 2–6 km connected catchment;
- one crossing, one guide-fencing and one monitoring package;
- for new works, one delivery arrangement and one of four prescribed staging patterns;
- its component-compatibility witness, stage pattern and evaluated resources.

The crossing catalogue offers retained 20 m infrastructure, selective or full 30 m work, a 40 m landscape bridge, and staged 30→40 m widening. Fence packages provide 2–6 km envelopes with ramps, gates and connected approaches. Monitoring packages offer 4, 8, 12, 18 or 28 camera stations with increasing survey setup. They carry fictional incremental costs, durations, risk inputs and disruptive access-day requirements.

The three joins are:

```text
crossing.width >= habitatPlan.width
fence.catchment >= requiredFence
monitoring.stations >= requiredStations

requiredFence = max(habitatPlan.catchment, widthInducedFence)
widthInducedFence = 2 / 3 / 4 km for 20 / 30 / 40 m width
requiredStations = max(ceil((width/20) × (requiredFence/2) × 4 × context.surveyLoad),
                       4 / 6 / 8 stations for 20 / 30 / 40 m width)
```

Thus a 30 m plan with 2 km connected catchment requires 3 km guide fencing and 9 camera stations in the mixed landscape. A package offering 8 stations fails even though a simple 30 m width check succeeds. Guide fencing can exceed connected habitat reach because its declared scope includes returns and escape approaches.

Package quantities are available envelopes. The habitat plan commissions the required extent; surplus envelope is not assumed active or counted in the functionality proxy. Monitoring is sized to the required width/fencing extent, rather than unused spare package capability. This distinction is an explicit simplification, not a claim that every site can partition construction or monitoring this way.

`compatibility()` returns typed required/provided values and pass/fail results. The selected tuple's table and dependency diagram display those same checks. `query()` computes finite joins by prefiltering catalogue components, then rechecks the tuple in `evaluateImplementation()`. It retains the compatible subset of the Cartesian product; it does not combine disconnected subsystem optima and assume they fit.

With `exec(i)` equal to the proxy and `eval(i) = (capex, months, programmeRisk, accessDays)`, the query is:

```text
Min { eval(i) : requestedModelCrossings <= exec(i)
                and every declared nonzero resource ceiling is met }
```

`Min` uses coordinatewise dominance, not a weighted score. Stable implementation identifiers and resources do not depend on target demand. Raising **only** demand therefore removes feasible implementations while preserving surviving witnesses. Pareto points need not form nested sets. Changing coefficient, landscape, catalogues, feedback or programme alternatives changes the model and is not the same monotonicity test. This is a bounded design problem with compatible implementing tuples, not a general categorical diagram compiler or MCDP library.

## An already-available implementation

C0/F0/M0 are the baseline 20 m crossing, 2 km guided approaches and 4 camera stations. A no-project implementation exists when these meet all three joins and the catchment limit permits 2 km. At the default coefficient, it supplies 80 **model** crossings/day with `(0,0,0,0)` incremental capex, duration, programme risk and access days. The throughput query decides whether it meets the request.

This option selects no delivery arrangement or staging pattern: filters over **new works** do not remove an existing crossing. Existing operating cost, maintenance and operating risk lie outside incremental programme accounting. No mobilisation, strategy premium, chart-duration floor or approvals burden is invented around the baseline. Unnecessary upgrades may remain feasible but are dominated when the task is already satisfied.

This is a baseline implementation, **not** a categorical identity morphism. It is conditional: the Woodland context's survey coefficient 1.08 makes the minimum `ceil(4 × 1.08) = 5` stations, so its four-station baseline fails. Mixed and Open contexts admit it. This is a useful surprise from the declared compatibility rules, not evidence that an existing crossing ceases to function in woodland.

## Resource evaluation and two clocks

The three arrangements are a joint road–ecology team, separate works contracts, and a landowner delivery compact. Their overhead, coordination, access and approval effects are assumptions. A favourable joint-team result is not empirical evidence of reduced claims or improved ecological outcomes.

The four work strategies are supplied templates: start together; complete crossing then fencing then monitoring; complete fencing/monitoring before the crossing; or align corresponding stage bands. The schedules describe construction/readiness patterns, not legal permissions to interrupt habitat access. Stage-start arrays include gaps. Within each stage, capability increments are linearly interpolated. Mismatch integrates normalized readiness disparity using 120 equal right-endpoint samples. The red curve is the minimum readiness fraction, **not animal passage or observed crossing use**.

The chart shows **base works months**. Context scales that span; declared mismatch, access and approval terms then add programme-level delay. The selected plan displays the complete breakdown. These added delays are not assigned to individual stages, so the chart's final point is not total programme completion and the chart is not an executable programme.

Capex sums package costs in £m, applies context and arrangement multipliers, then adds strategy premium, overhead and `0.35 × overbuild`. Overbuild sums relative unused width, fencing and monitoring headroom. Access-day equivalents aggregate package requirements and apply declared context, arrangement and strategy factors; they are not a dated road-closure plan. Package risk inputs, context/arrangement/strategy offsets and `18 × overbuild` feed a synthetic risk index, not a probability or safety limit.

For feedback on, let `T0` be context-scaled works duration, `B` base risk, `q` mismatch rework, `A` access-day equivalents and `α` approval sensitivity:

```text
T = T0 + q + 0.10A + αr
r = B + 0.42(T − T0) + 0.18A + 0.30q
```

Hence:

```text
r = (B + 0.72q + 0.222A) / (1 − 0.42α)
T = T0 + q + 0.10A + αr
```

Every supplied arrangement has `0 ≤ 0.42α < 1`, giving a unique finite nonnegative fixed point. Resources use the algebraic result, subject to floating-point arithmetic. Earlier loop rows illustrate convergence from zero; the final “Exact” row is the algebraic value. This is **not** the general MCDP feedback operator over design relations. With feedback off, the declared simpler evaluator is `T=T0+q+0.10A`, `r=B+0.18A+0.30q`; neither recursive approvals nor schedule-to-risk is applied. The no-project option needs no loop.

## Failure meanings and counterexamples

There are no hidden 180-month/260-risk thresholds. A zero resource ceiling means unconstrained; a long finite programme remains a candidate. The independently checked feedback stress fixture uses explicit high sensitivity outside the three supplied arrangements and retains candidates beyond both old thresholds. It verifies the rule; it is not a fourth recommended delivery arrangement.

The interface distinguishes invalid input, absence of a compatible catalogue implementation, compatible implementations rejected by declared ceilings, and an incomplete calculation caused by unsupported or nonfinite evaluation. Calculation failure is not proof of infeasibility. All four resources are checked for finite, nonnegative values. Unsupported feedback coefficients fail explicitly; successful candidates remain available with an incomplete-result warning if another candidate fails.

## Independent checks

The oracle reads catalogue inputs but calls no production eligibility, evaluation, stage or Pareto helpers. It enumerates the full Cartesian product; checks requirements using a separate width lookup table; builds stage events; evaluates capability as summed stage increments; performs the declared sampling; solves feedback by high-precision iteration; and computes the frontier by all-pairs dominance. Production uses prefiltered joins and an algebraic fixed point. Hand-derived anchors separately check 30 m / 2 km → 3 km / 9 stations, the woodland five-station baseline requirement, and the fact that extra cameras never increase the functionality proxy.

The 27 September model run passed:

- 29 query comparisons, 19,941 oracle candidates, 79,764 resource coordinates and 29 complete frontier comparisons.
- 5,625 exhaustive typed joins across all habitat plans, three landscapes and all component triples.
- 23,640 surviving witnesses with unchanged resources as only demand rises.
- Default target 300, coefficient 2, catchment limit 6, Mixed, all arrangements/strategies, feedback on: **504 candidates and 12 minimal alternatives**.
- Woodland / Separate works contracts / Crossing first at the same target: **38 finite candidates and 2 minimal alternatives** with all ceilings zero.
- Target 80 in Mixed: baseline is the sole minimal option under every works filter, including £0.25m / 3 months / 5 risk ceilings. A higher request and the woodland compatibility failure exclude it.
- Large finite feedback values satisfy both defining equations and remain query candidates beyond former cutoffs; unsupported contraction and nonfinite resource fixtures report incomplete calculations.

Run `node tests/programme-studio.test.mjs` from `project-co-design/`. The standalone HTML is the tested source. The updated `programme-studio.ui.mjs` defines browser regression checks for the renamed wildlife controls, actual joins, diagrams, failure distinctions, baseline, exact loop, lenses, keyboard selection, five tabs and responsive overflow. **The browser script was not run for this refactor**; the integration browser review is recorded separately. Previous rail-model browser assertions are not evidence for this version. These are finite-model checks, not practitioner validation, approval or deployment evidence.

## Explanation preservation

| Learning | Destination and retained distinction |
|---|---|
| Functionality, implementation, resource | Primer, selected witness, pseudo-MCDPL and Method: requested proxy stays separate from a particular package tuple and its resource bundle. |
| A local choice induces co-moves | Width-induced fencing and station coverage; actual typed table and selected dependency diagram expose every requirement. |
| Composition uses compatible tuples | Prefiltered joins plus explicit recheck; independent full-product oracle. No assumption that subsystem optima compose. |
| Monotonicity and exploration | Raising demand alone shrinks feasible implementations; lowering an exploratory input remains allowed. Commitments would need a separate rule. |
| Partial-order frontier | Four resource coordinates; incomparable alternatives remain visible. Named lenses choose their actual minima; Balanced is only an initial weighted highlight. |
| Dependency versus operational flow | Typed dependency diagram links to its witness table; a separate animal-movement sketch explicitly does not simulate use. |
| Programme configuration | Three declared delivery arrangements and four supplied staging strategies; these do not generate the legal paths of the staged-path essay. |
| Readiness and programme clocks | Base-stage chart, normalized mismatch and the full context/access/approval breakdown remain distinct. |
| Feedback and its boundary | Exact affine result and illustrative convergence trace; explicit unsupported-calculation state and no hidden thresholds. |
| Existing capability | Genuine zero incremental resource baseline, including under new-works filters; context compatibility can exclude it. |

No historical claim of universal engineering safety, empirical governance benefit, stakeholder consent, categorical identity or general feedback solving is carried into the wildlife scenario. The core explanations are preserved through the declared crossing model rather than by retaining inappropriate transport terminology.
