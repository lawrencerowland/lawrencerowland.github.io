# Temporary power that includes its own overhead

[Open the app](../../apps/rail-power-loop.html) · [Foray home](../../index.html)

This essay asks whether a temporary battery installation can supply a declared constant railway load throughout a grid outage **while also supplying its cooling and conversion overhead**. It develops the enabling-resource question behind the staged planner: temporary power is useful only if a complete installation can meet the chosen brief.

The new construction is a separate component-sizing model. It does not automatically validate the staged planner's abstract service units, installation slots or rail cutover rules. Its next useful result is a complete sized implementation, with resource commitments and visible reasons that a one-pass estimate may fail.

## What the Python package actually does

The atlas is computed by Corentin Briat's [`codesign-mcdp`](https://github.com/cbriat/codesign-mcdp/tree/97d6446abf48c3424cf52bace9c5d9c40bfda978), source version 0.2.1, pinned to commit `97d6446abf48c3424cf52bace9c5d9c40bfda978`. It is a separate implementation of Censi's framework, not a restored original PyMCDP repository.

Three `Module` instances are wired through the package's `System` builder. `System.build()` constructs its internal feedback `Loop`; `solve(..., trace=True)` starts from the bottom and iterates the resulting resource antichain. Every displayed calculation step comes from that package run. We solve each of eight fixed equipment-family combinations separately so its physical identity remains explicit. We then compare their complete resource points.

The browser displays the package's recorded answers for every supported brief. It does not run Python or silently substitute a JavaScript solver. The published input selectors define that finite set; changing an equipment coefficient or adding another duration requires regenerating the atlas with the supplied Python recipe. Cost and footprint ceilings filter the recorded complete designs exactly, without interpolating frontiers.

[API and catalogue](API.md) · [Python model](model.py) · [Generator](build_atlas.py) · [Recorded atlas](atlas.json) · [Independent verification](REVIEW.md)

## A physically motivated, explicitly invented contract

The catalogue is synthetic. Its costs, space allowances, available quantities, usable energy, cooling capacity and condition factors are not supplier specifications or a real railway estimate.

In particular, each operating battery rack carries a **thermal design allowance**. Summing those allowances creates the declared cooling obligation. This is not a physical assertion that adding parallel batteries always increases actual heat at a fixed traction load. Usable battery energy is net DC energy after internal cell losses; external cooling and converter losses are additional demands.

The [National Laboratory of the Rockies' thermal-performance research](https://nrel.sitefinity.cloud/transportation/energy-storage-performance) motivates treating heat generation, cooling, efficiency and energy sizing together. It does not supply this catalogue or validate the fixed allowance per rack. Real design would need measured load profiles, thermal dynamics, power ratings, state-of-charge behaviour, charging/recharging, distribution losses, redundancy, protection, siting and railway operating constraints. None is silently inferred from the result.

The mild and hot cases are two declared equipment envelopes. “Hot” lowers usable battery energy and cooling capacity and increases the battery thermal allowance. It is not a forecast, a probability distribution or an open-ended claim of robustness to weather.

## The circular requirements

For one fixed family combination, let `B`, `I` and `C` be the numbers of operating battery packs, converter modules and cooling units. Let `P` be the constant railway load in kW and `H` the outage duration in hours. The families supply usable energy `e` kWh/pack, converter capacity `v` kW/unit and heat removal `k` kW/unit. Their per-unit allowances are battery heat `b`, converter loss/heat `l`, and cooling electricity `c`, all in kW.

A complete installation must satisfy all three inequalities:

```text
B × e ≥ H × (P + C × c + I × l)   battery energy covers every declared load
I × v ≥ P + C × c                 converters supply railway and cooling power
C × k ≥ B × b + I × l             cooling covers the thermal allowances
```

Converter losses are drawn on the battery side and released as heat; they are not added twice to converter output. Multiplying kW by hours gives kWh. The package's unit labels are descriptive metadata, so these dimensional relationships are part of our independently checked contract.

For each component, the `Module` returns the least whole-unit count able to meet its current demand. All coefficients are non-negative. The resulting count map is monotone, but feedback means a one-pass allocation need not satisfy the other two modules when their induced demands return.

The declared resources are total equipment capital and equipment footprint, summed across all three components. No weighting converts them into one objective. A cheaper but larger design and a dearer but smaller design can both survive. The available catalogue limits the numbers of operating packs, converters and coolers; those limits are stated in the API.

## Why the fixed point and the availability decision are justified

Write the three ceiling requirements above as `Φ(B,I,C)`. A compatible tuple `z` satisfies `Φ(z) ≤ z`. Because `Φ` is monotone, induction shows that every iterate from zero is below every compatible tuple. If the iteration settles at `x*`, then `x*` is the componentwise least compatible count vector for that fixed family combination.

Every equipment cost and footprint coefficient is positive. Larger compatible count vectors therefore cannot improve either resource. The least fixed point is sufficient for that family: it meets a capital/space ceiling if and only if some compatible configuration of that family does. Likewise, if one coordinate of `x*` exceeds the corresponding catalogue availability, no configuration inside the availability bounds can work.

We calculate the least point before applying availability limits. A probe of this package version showed that putting an empty, capped module directly inside `System` can yield `diverged` through a partially infinite internal state. That status is not a catalogue-infeasibility certificate. The external availability check has the explicit proof above and is independently compared with exhaustive enumeration of all bounded component counts.

Only `status == "converged"` is accepted. A package result can have `feasible=True` while its iteration limit has been reached; that is not a completed design. All runs start cold. An arbitrary warm start can exclude valid smaller solutions when the request is relaxed, so it is not used here. The numerical solver never supplies a green result merely because a resource point is finite.

## A result that changes the choice

At the default 750 kW, eight-hour hot-envelope brief, the standard battery / standard converter / air-cooling combination appears to cost £2.965m on the one-pass estimate. It does not meet the completed energy and converter requirements. Closing the loop needs nine battery packs, four converters and seven coolers, costing £3.390m.

The standard battery / efficient converter / liquid-cooling combination looks dearer initially, at £3.130m. Its completed design needs eight packs, four converters and three coolers, costing £3.245m. The more expensive support equipment avoids an extra battery pack and becomes the cheaper complete design.

The full default resource frontier contains £3.245m / 274 m², £4.200m / 168 m² and £4.360m / 152 m². None improves both capital and footprint over another. These are three complete designs, not independently chosen coordinate minima.

## What the trace means

The animation replays calculation iterations, not construction stages, elapsed outage hours, a commissioning sequence or an operational simulation. Intermediate iterates may violate the final requirements: they are lower estimates being propagated around the loop. The app identifies the final checked implementation separately.

The first-pass comparison deliberately sizes components without returning all induced demands to their upstream suppliers. Its deficits are recalculated against the complete contract. It is an explanatory comparator, not a second optimisation method or a proposed workable installation.

## Relationship to categorical co-design

The source framework is [Censi, A Mathematical Theory of Co-Design](https://arxiv.org/abs/1512.08055) and [Zardini, Co-Design of Complex Systems, chapter 3](https://www.research-collection.ethz.ch/items/d7c08dd5-bf96-4c1f-a744-5e751f0f44a5). Functionality and resource spaces are ordered, component requirements are wired explicitly, and feedback is solved through the package's antichain iteration. The independent finite integer oracle checks the complete resulting implementations.

This use goes beyond the existing acyclic wildlife composition and the programme studio's particular affine formula: the library now builds and solves the cyclic component model. It does not establish arbitrary package modules' monotonicity, a general correctness proof of the third-party implementation, or a real engineering approval.
