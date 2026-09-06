# Independent review of the temporary-power feedback model

[App](../../apps/rail-power-loop.html) · [Model explanation](MODEL.md) · [Oracle](oracle.py) · [Machine-readable results](oracle-results.json)

**Result: PASS for the declared finite domain.** The independent oracle agrees with all 784 recorded architecture calculations across 98 briefs. It examined all 7,063,056 integer count triples within the catalogue limits. This is model verification; it is not empirical validation, railway safety approval or a general correctness proof of the upstream package.

## Independence and reproducibility

The oracle imports neither `codesign` nor `model.py`. It independently transcribes the frozen catalogue constants and checks every triple of 0–32 batteries, 0–12 converters and 0–20 coolers against the three complete interface inequalities. It uses no fixed-point iteration to generate its expected available answers. The package-produced witness and its recorded calculation trace are compared with that independent enumeration.

Run with the Python standard library:

```sh
python3 oracle.py
```

The output records hashes of the atlas, contract, model, generator and oracle. It also checks that the atlas's model, contract and generator hashes match the accompanying files. The separately supplied build recipe verifies the hashes of the actual imported upstream package sources. The reviewed package is Corentin Briat's `codesign-mcdp` 0.2.1 at commit `97d6446abf48c3424cf52bace9c5d9c40bfda978`; it is an independent implementation, not evidence that the original PyMCDP repository was restored.

## What was checked

| Check | Result |
|---|---:|
| Supported briefs | 98 |
| Fixed equipment-family architectures per brief | 8 |
| Package calculations checked | 784 |
| Bounded integer triples examined | 7,063,056 |
| Compatible bounded triples found | 1,892,418 |
| Catalogue-feasible least witnesses | 726 |
| Catalogue-unavailable architecture results | 58 |
| Complete/comparator interface comparisons | 4,704 |
| Recorded count-map transitions checked | 3,203 |
| Cost/space ceiling boundary cases | 24,076 |
| Hot witnesses checked against mild conditions | 392 |
| Adjacent power/duration monotonicity comparisons | 1,344 |

For every available architecture result, the package witness equals the independently found componentwise least compatible integer tuple. Its capital and land values are no larger than those of every other compatible tuple in the same family. Every reported global frontier matches an independent comparison of the eight complete family results. Equal-resource family IDs are retained.

The oracle also checks the exact power, energy and heat quantities; all supplied/required interface values and margins; the declared availability counts and flags; each trace's zero seed, monotone transitions and final fixed point; and every displayed trace quantity and resource sum. The model, contract and generator provenance hashes match. Every accepted package calculation has status `converged` and a complete final witness.

The resource-ceiling checks cover both coordinates' exact boundary values, one integer below each boundary, zero and no ceiling. Filtering an existing frontier gives the same result as filtering all available architectures first and recomputing the frontier. The underlying upper ceilings cannot retain a dominated point while excluding its componentwise dominator.

Raising service power or duration never reduces any least equipment count or total resource, and an available harder brief always has an available easier brief in the same family. Every hot witness remains compatible in mild conditions. This verifies the declared scenario ordering; it does not establish that the hot scenario bounds every real weather condition.

All 14 zero-power briefs have the zero-equipment, zero-resource answer. The eight equal-resource family labels remain represented. This is a zero-work result, not a claim that these family labels are eight different physical zero installations or categorical identity morphisms.

## Concrete results

For the default **750 kW, 8 hours, hot** brief, three incomparable family implementations survive:

| Battery / converter / cooling family | Counts: batteries, converters, coolers | Capital | Footprint |
|---|---|---:|---:|
| Standard / efficient / liquid | 8, 4, 3 | £3,245,000 | 274 m² |
| Compact / standard / liquid | 6, 4, 4 | £4,200,000 | 168 m² |
| Compact / efficient / liquid | 6, 4, 4 | £4,360,000 | 152 m² |

For the all-standard/air family, the same brief's deliberately incomplete service-only estimate is `(8, 3, 6)`. It fails the full battery-energy and converter-output requirements. The complete least tuple is `(9, 4, 7)`, costing £3,390,000 and occupying 384 m². It is dominated by standard batteries with efficient conversion and liquid cooling. The calculation therefore changes both the required equipment counts and a meaningful architecture choice.

All 672 nonzero-power service-only comparisons are incomplete under the declared full interfaces. This is expected: the comparator deliberately does not return the cooling load to the converter calculation. It is an explanatory omission, not an independent planning method being fairly outperformed.

Three briefs have no architecture within the declared availability limits: **1,500 kW for 24 hours in hot conditions**, and **2,000 kW for 24 hours in either condition**. Those outcomes agree with exhaustive enumeration. They mean no allowed combination in these eight fixed families meets this contract; they do not rule out other equipment, mixed-family combinations, additional quantities or changed service arrangements.

## Why the availability conclusion is valid

For a fixed family, write the three whole-unit requirement functions as `Φ(B,I,C)`. Their coefficients are nonnegative, so the map is componentwise monotone. Any compatible tuple `z` satisfies `Φ(z) ≤ z`. Since zero is below `z`, induction gives `Φⁿ(0) ≤ z` for every iteration. If the sequence settles at `x*`, then `x*` is compatible and no larger than every compatible tuple.

Consequently, if `x*` exceeds a battery, converter or cooler cap, no compatible tuple can fit all caps. Conversely, if `x*` fits, it is itself an available implementation. Positive capital and footprint coefficients mean larger compatible tuples cannot improve either resource. This argument is specific to the fixed families and their stated monotone relations. It is independently confirmed by the bounded enumeration here.

The generator rejects unfinished upstream calculations. A finite iterate or `feasible=True` alone is insufficient. The app uses cold starts; it does not use an earlier, larger query as a warm start for a relaxed brief. Availability is checked after convergence because the reviewed upstream version can propagate a capped module's empty result into a partially infinite internal state. Such solver behaviour is not treated as a proof of catalogue infeasibility.

## Source and conceptual scope

The component interfaces and actual cyclic resource dependency are consistent with the source-level co-design approach in [Censi's mathematical theory](https://arxiv.org/abs/1512.08055) and [Zardini's chapter 3](https://www.research-collection.ethz.ch/items/d7c08dd5-bf96-4c1f-a744-5e751f0f44a5). The implementation actually calls the pinned package's [`System.build`](https://github.com/cbriat/codesign-mcdp/blob/97d6446abf48c3424cf52bace9c5d9c40bfda978/codesign/system.py#L273-L413) and [`solve`](https://github.com/cbriat/codesign-mcdp/blob/97d6446abf48c3424cf52bace9c5d9c40bfda978/codesign/solver.py#L438-L579). It does not rely on the package's uncertain-set, stochastic-summary, online or temporal extensions.

The genuinely new project question is whether the temporary power capability assumed by an enabling option can be sized consistently once its own overhead is included. This is separate from proving any path in the existing staged planner. The trace shows calculation iterations, not commissioning stages or outage hours.

The per-rack heat figure is explicitly an invented thermal design allowance. It is not a universal physical law that adding batteries increases actual heat at fixed traction load. Equipment ratings, costs, footprints and scenario factors are synthetic. Unit labels in the package do not perform dimensional analysis; the independent equations do distinguish kW from kWh. The review supports the declared integer model and its recorded finite answers, with no claim of supplier calibration, operational simulation or safety approval.
