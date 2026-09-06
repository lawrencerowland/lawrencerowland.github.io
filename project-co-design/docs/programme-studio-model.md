# Programme studio: compatible designs and declared programme assumptions

Model 2.0.0 · 6 September 2026. [Open the studio](../apps/programme-studio.html) · [Coupling primer](../apps/programme-studio.html#coupling-primer) · [Curation record](curation.md).

The studio compares service plans, compatible platform/signalling/power packages, three governance alternatives and four supplied stage strategies. It retains an actual implementing tuple for every displayed choice. The separate staged-path essay generates legal work histories and checks operating service during construction. This studio's interpolated readiness curves do not perform that temporal feasibility check.

## The finite design relation

Fix the catalogues, passengers per car, corridor context, operational maximum, works-alternative filters and feedback setting. These define the implementation universe and resource evaluator. The external functionality is peak-direction throughput, ordered by the usual `≤`. An implementation contains:

- a service plan: cars and trains per hour;
- one platform, one signalling and one power package;
- for new works, a governance choice and one of four prescribed staging patterns;
- its component-compatibility witness, stage pattern and resource evaluation.

The three joins used by the code are:

```text
platform.cars >= service.cars
signalling.tph >= max(service.tph, trainLengthSignalRequirement(service.cars))
power.index >= max((service.cars/8) * (requiredSignalTph/18) * context.traction,
                   trainLengthPowerRequirement(service.cars))
```

The train-length signalling requirement is 18/21/24 tph for 8/10/12 cars. The power floor is 1/1.18/1.42 respectively. These are fictional compatibility rules. Extra *provided* signalling capability is an available envelope; the service plan need not operate at that maximum. The actual planned throughput and its induced minimum are used consistently for eligibility and power demand.

`compatibility()` returns the typed required/provided values and pass/fail result. The selected tuple's table displays those same checks. `query()` performs the finite joins by prefiltering catalogue components and checks the resulting tuple in `evaluateImplementation()`. It retains the compatible subset of the Cartesian product; it does not compare disconnected subsystem optima and assume they will fit together.

With `exec(i) = cars × tph × passengersPerCar` and `eval(i) = (capex, months, programmeRisk, possessions)`, the query is:

```text
Min { eval(i) : requestedThroughput <= exec(i)
                and every declared nonzero resource ceiling is met }
```

`Min` uses coordinatewise dominance, not a weighted score. Stable implementation identifiers and resource evaluations do not depend on the target demand. Raising only demand therefore removes feasible implementations while leaving surviving witnesses unchanged. Pareto points need not themselves form nested sets. Changing context, catalogues, feedback or programme alternatives changes the model/implementation universe and is not the same monotonicity test.

This is a bounded design problem with implementation and a compatible-tuple composition. Flat enumeration is a legitimate finite solution method: the implementing tuple and the compatibility inequalities do the compositional work. It is not a general categorical diagram compiler or MCDP library. The source basis is Zardini's design problems with implementation and composition of compatible implementing tuples, §§3.1–3.5, alongside Censi's minimal resource antichains. [Zardini dissertation](https://www.research-collection.ethz.ch/items/d7c08dd5-bf96-4c1f-a744-5e751f0f44a5), [Censi's mathematical co-design paper](https://arxiv.org/abs/1512.08055).

## An already-available implementation

P0/S0/W0 are the baseline 8-car, 18-tph, power-index-1 packages. A no-project implementation exists when these packages meet all three compatibility joins and the operational maximum allows 18 tph. It supplies `8 × 18 × passengersPerCar` pphpd with zero *incremental* capex, duration, programme risk and possessions. The throughput query decides whether that existing capability meets the request.

This option does not select governance or staging: filters over **new works** do not remove the existing railway. Existing operating costs and operating risk lie outside incremental programme accounting. No mobilisation, strategy premium, chart-duration floor or approvals burden is invented around the all-baseline tuple. Unnecessary upgrades may remain feasible but are dominated by this zero-resource option when the task is already satisfied.

This is a baseline implementation, **not** a categorical identity morphism. It is also conditional: Urban context's traction coefficient1.08 exceeds the baseline power envelope under the declared relation, so this particular no-project tuple is not compatible there. The model does not silently invent slower-than-18-tph service plans. Mixed and Surface contexts can admit the baseline. Those are finite-catalogue assumptions, not an assertion about any real railway.

## Resource evaluation and two clocks

The four work strategies remain supplied templates: start together; complete civils then signalling then power; complete signalling/power before civils; or align corresponding stage bands. Stage-start arrays are respected, including gaps between stages. Within each stage the model linearly interpolates the capability increment. The mismatch penalty integrates normalized readiness disparity using 120 equal right-endpoint samples. That sampling rule defines the studio's illustrative evaluator; it is not assessed operating service.

The chart shows **base works months**. Context scales the base span; declared mismatch, possession and approval terms then add programme-level delay. The selected plan displays the full breakdown. These additional delays are not assigned to individual work stages, so the chart is not an executable programme whose last point equals the total duration.

Capex sums package costs, applies context and governance multipliers, then adds the strategy premium, governance overhead and overbuild penalty. Possessions aggregate package values and apply the declared context, governance and strategy factors. Baseline package risks, governance offsets and strategy offsets are inputs to the synthetic programme-risk evaluator. The coefficients express assumptions; a favourable alliance result is not empirical evidence that alliances reduce claims.

For feedback on, let `T0` be context-scaled works duration, `B` base risk, `q` mismatch rework, `P` possessions and `α` approval sensitivity. The equations are:

```text
T = T0 + q + 0.10P + αr
r = B + 0.42(T − T0) + 0.18P + 0.30q
```

Hence:

```text
r = (B + 0.72q + 0.222P) / (1 − 0.42α)
T = T0 + q + 0.10P + αr
```

Every supplied governance option has `0 ≤ 0.42α < 1`, so this affine evaluator has a unique finite nonnegative fixed point. Resources use the algebraic result, subject to ordinary floating-point arithmetic. The loop panel's earlier rows illustrate convergence from zero; its final “Exact” row is the algebraic value. This is **not** an implementation of the general MCDP feedback operator over design relations.

With feedback off, the deliberately simpler declared evaluator is `T=T0+q+0.10P`, `r=B+0.18P+0.30q`; neither the recursive approvals term nor the schedule-to-risk term is applied. The no-project implementation needs no loop at all.

## Failure meanings

There are no undisclosed180-month/260-risk thresholds. A resource ceiling of zero means unconstrained, so a very long finite programme remains a candidate. Its practical desirability is a separate question.

The interface distinguishes invalid input, absence of a compatible catalogue implementation for the task, compatible implementations rejected by declared resource ceilings, and an incomplete calculation caused by an unsupported/nonfinite resource evaluation. A calculation failure is not advertised as proof of infeasibility. In the declared current coefficient domain, the feedback equation is finite; that failure guard protects future model edits.

## Independent checks

The test reads the declared catalogues but calls no production eligibility, evaluation or Pareto helpers for its oracle. It enumerates the full Cartesian product, checks the typed requirements independently, constructs stage events, evaluates capability as summed stage increments, performs the declared sampling, solves feedback by high-precision iteration, and computes the frontier by all-pairs dominance. The production engine uses prefiltered joins and an algebraic fixed point, so the comparison exercises independently implemented paths to the same relation.

Current results:

- 28 query comparisons;15,760 oracle candidates;63,040 resource coordinates;28 complete frontier comparisons.
- 5,625 exhaustive typed-join comparisons across all service plans, three contexts and all platform/signalling/power triples.
- 30,818 surviving implementation witnesses retain exactly the same resources as demand rises with the model fixed.
- The previously false-infeasible Urban / Multi-prime / Civils-first case returns6 finite candidates and2 minimal alternatives, with all user resource ceilings zero.
- The baseline-compatible18,000pphpd request at150 passengers/car returns the no-project option with `(0,0,0,0)`, including across every works-filter combination and tight positive ceilings. Incompatible/exceeded baseline cases exclude it.
- Large finite feedback values beyond both former cutoffs satisfy the defining equations; unsupported contraction coefficients are rejected explicitly.
- 57 browser assertions cover the counterexamples, input/failure distinctions, exact feedback display, component table, no-project narrative, true extreme selection lenses, keyboard row selection, all five tabs, and no document overflow at1440/768/390px. No page errors were observed. Desktop/mobile primer views were inspected visually.

From `project-co-design/`, run the independent model test with `node tests/programme-studio.test.mjs`; the standalone HTML is the tested model source. Run `tests/programme-studio.ui.mjs` with Playwright installed; optional `PLAYWRIGHT_MODULE` and `CHROME_EXECUTABLE` environment values select a local test runtime. These are finite-model and local UI checks, not practitioner validation, engineering approval or empirical evidence for the risk coefficients.

## Explanation preservation

| Origin | Surviving destination | Preserved and corrected |
|---|---|---|
| Incremental rail upgrade, introductory coupling diagram and package/provides/requires/status table | `#coupling-primer`, `#component-compatibility` in the studio | A subsystem provides a capability and requires resources; connected requirements must agree. The table now displays the actual typed checks selecting the implementation. |
| Incremental/transit slider accounts of induced signalling and power work | `#coupling-primer` | One requested service plan may induce several subsystem requirements. Monotonicity concerns the ordered request/relation, not an obligation never to lower an exploratory input. |
| Rail simulator, quick method explanation and director's reading of the Pareto set | `#coupling-primer`, Frontier panel, selected-plan reading | Functionality, implementation and resource distinctions; coordinatewise dominance; several incomparable choices; the frontier as a discussion object; compare resource trade-offs without forcing stakeholder objectives into one score. |
| Earlier logical-dependency versus operational-flow distinction | Brief diagrams and actual compatibility table | Dependency arrows show requirements, not simulated train signals or a causal proof. The table is the executable evidence behind the diagram. |

Intentionally discarded: slider-history maxima presented as mathematical monotonicity; the incremental catalogue's unimplemented antichain promise; “OK” packages that fail the actual requested service; an unimplemented business-case feedback arrow; claims that resource-frontier slope identifies an external binding cause; risk ceilings as actual stakeholder veto/consent; universal rail-safety assertions; decorative coproduct/general-feedback terminology unsupported by the engine. No stronger claims are inherited merely because an earlier essay used them.
