# Staged rail co-design: the implementation is a path

[Open the experiment](../apps/staged-paths.html) · [Reproducibility files](rail-staged-codesign/)

This experiment constructs a finite answer to a specific question: **can a preferred final rail design be delivered while maintaining service and meeting intermediate commitments?** The result is an executable implementation path and its resource trade-offs. A temporary grid bridge contributes no final permanent capacity, yet can become indispensable to a least-cost implementation that preserves service.

## End, way and contribution

Foray 180/182 asks for substantive monotone co-design of a rail upgrade, explained at project-director level through interactive HTML. Its difficult case is staged alignment of platform, signalling and power expansion across delivery boundaries. This app retains that purpose and method. It generates admissible action histories, rather than choosing only a final asset configuration or a supplied staging template.

The [earlier rail simulator](../apps/rail-simulator.html), [incremental upgrade](../apps/incremental-upgrade.html) and [transit example](../apps/transit-tradeoffs.html) remain available. Earlier work includes endpoint catalogues, Pareto plots and staging demonstrations; a subsequent retained studio compared four staging templates with mismatch penalties. The new construction supplies explicit transition rules and derives the complete feasible resource frontier for the declared finite problem.

This is progress within the foray, without a claim to have invented temporal co-design. Gioele Zardini's *Co-Design of Complex Systems*, §§3.1–3.5, printed pp40–48, defines a design problem with implementation `(F,I,R,exec,eval)`. Implementations may be plans or control strategies; functionality and resources are ordered, and composition restricts implementation tuples through their interfaces. Here, finite stage paths become those implementations. [Thesis, ETH Zürich](https://www.research-collection.ethz.ch/items/d7c08dd5-bf96-4c1f-a744-5e751f0f44a5).

Andrea Censi's co-design theory supplies minimal resource antichains under partial orders. The finite solver here is independently written; it does not implement the general library's recursive feedback solver. The MCDP manual's catalogue examples informed the explicit alternatives. [Censi, *A Mathematical Theory of Co-Design*](https://arxiv.org/abs/1512.08055), [MCDP manual](https://andreacensi.github.io/mcdp-manual/mcdp-manual.pdf). ACT4E's *Categories and Compositionality with a View to Applications* provides narrower background on interfaces, design problems and finite solution methods; its complete book is not claimed as implemented. [ACT4E](https://applied-compositional-thinking.engineering/).

## Declared model

Permanent platform, signalling and grid modules have tiers `0,1,2`, initially 0, with capability `1+tier` in fictional service bands. All must reach tier 2. Permanent commissioned tiers never decrease. Construction and commissioned operation remain different: a larger asset at slot end does not imply uninterrupted service during that slot.

Each action lasts one slot and uses one crew:

| Action | Cost | Access | Main rule |
|---|---:|---:|---|
| Platform upgrade | 3 | 1 | Matching signalling tier already commissioned |
| Signalling upgrade | 4 | 1 | Next tier available |
| Direct grid cutover | 3 | 2 | Grid service drops to zero unless bridge active |
| Prepare protected grid cutover | 2 | 0 | Prepare one grid tier |
| Protected grid cutover | 4 | 1 | Prepared; retains previous grid service |
| Install temporary bridge | 4 | 1 | Available once, before grid completion |
| Return temporary bridge | 0 | 1 | Bridge active |

All concurrent guards read the start state. Effects take place at slot end. Grid actions, including preparation, cannot share a slot with another grid action or bridge installation/return. Other combinations must meet total crew and access limits. Platform/signalling work retains its previous operating capacity. The bridge preserves pre-cutover grid service. Operating corridor service is the weakest available module.

Completion requires both tiers of every permanent module, no unused prepared grid work, and returned temporary equipment. Costs, capacity bands, access units and work rules are illustrative assumptions, not railway engineering standards. Actual regulatory obligations or stakeholder agreements must be supplied as explicit constraints; there is no fabricated political-risk score.

The operating floor applies during every work slot. The intermediate promise concerns commissioned capacity at the **end** of its selected slot. It does not impose a higher operating floor thereafter. Completed paths extend their final service/capability to the horizon.

The supported domain is horizon 4–12, crews 1–3, access cap 1–3, operating floor 0–3, milestone capability 1–3, milestone slot 1–horizon or 0 for disabled, and bridge availability true/false. Defaults are horizon 8, two crews, access cap 2, floor 1, and commissioned capability 2 by slot 4.

## Query, algorithm and pruning condition

For fixed catalogue and availability limits, `I` contains physically legal, complete finite paths. `exec(i)` contains operating-service and commissioned-capacity curves, ordered pointwise, and final tiers. Resources are `(total cost, completion slot, peak simultaneous access)`, ordered componentwise. The query is:

`h(f) = Min { eval(i) : i in I and f <= exec(i) }`.

“Minimal” permits incomparable answers. Total access use is displayed but is not a fourth optimization objective.

The solver generates legal nonempty action batches and advances slot by slot. It first checks the temporal requirements. It then prunes cost/peak-access labels **only within identical `(time,P,S,G,prepared,temporary-phase)` states**. Those states have identical future actions; retained labels have no greater cost or peak access. Temporary phase distinguishes unused, active and returned equipment. Removing that distinction would invalidate the argument.

Past queried requirements have already been enforced. Full curves are reconstructed for retained witnesses; every possible service curve is not retained. Changing the request triggers a fresh solve. Additional cumulative-resource constraints or objectives would require extending the labels and dominance order.

Empty waits are normalized away. No external release dates exist, so deleting a wait preserves action guards and transition service, and cannot worsen upper-bound completion or commissioning deadlines. Calendar possessions, dated permissions or time-varying operating requirements would require explicit waiting transitions and a revised proof.

## What the default witness proves

| Query | Minimal `(cost,finish,peak access)` tuples |
|---|---|
| Final capacity only | `(20,5,2)`, `(23,4,2)`, `(26,6,1)` |
| Full temporal request | `(24,5,2)`, `(26,4,2)`, `(26,6,1)` |

Two full-request frontier tuples are absent from the endpoint frontier: the 24-unit temporary bridge path and the faster 26-unit protected path. Endpoint pruning followed by filtering cannot recover them. Pareto reasoning remains correct; the endpoint projection omitted required functionality.

The arithmetic is inspectable. Platform/signalling work costs 14. Two direct grid cutovers cost 6, producing the 20-unit endpoint design but interrupting service. Adding the bridge costs 4, producing 24. Two prepared protected cutovers cost 12, producing 26. These alternatives exchange cost, completion and access requirements.

A failed displayed path is weaker evidence than an excluded resource tuple. With floor 0 and capability 2 required by slot 3, one selected endpoint path fails while another ordering achieves the same `(20,5,2)` tuple. The app distinguishes witness rearrangement from actual frontier loss.

The six-slot, one-crew continuity case is infeasible within this model: four platform/signalling actions plus either four protected-grid actions or two direct-grid actions and bridge installation/return require at least eight unit actions. This provides a bounded impossibility argument, not a claim about all railway delivery methods.

## Antecedents and verification

Corentin Briat's 2026 `codesign-mcdp` includes sequential and temporal extensions. Its manual characterizes these as the author's extensions, work in preparation and not peer reviewed. Its carried-state implementation preserves future resource consequences before projecting onto cost. That antecedent reinforces the pruning condition above; this app uses its own solver. [Library paper](https://arxiv.org/abs/2607.18415), [reviewed implementation at commit 97d6446](https://github.com/cbriat/codesign-mcdp/blob/97d6446abf48c3424cf52bace9c5d9c40bfda978/codesign/sequential.py#L423-L475).

An independent oracle implemented the rules without importing the engine's transitions, feasibility tests or dominance helpers. It enumerated complete histories without state merging. All 507 tested configurations passed: 4,733,325 history prefixes, 1,016,583 complete normalized histories, 7,405 returned-plan replays, 38,308 stage-annotation checks and 175 relaxation checks. This tests feasible histories surviving relaxed constraints; it does not incorrectly require Pareto point sets to be nested.

Verified engine SHA256:

`8350d0e1e37c6732a1bdd9c8e34b11cff73bf5178ddd643b732102c5b3b47887`

The [reproducibility directory](rail-staged-codesign/) contains the [engine](rail-staged-codesign/model.cjs), [independent oracle](rail-staged-codesign/oracle.mjs), [verification runner](rail-staged-codesign/verify.mjs), [model results](rail-staged-codesign/results.json), [browser checks](rail-staged-codesign/browser.cjs) and [browser results](rail-staged-codesign/browser-results.json). The computational result concerns this finite model; browser checks establish interface behavior. Neither establishes real-project calibration, safety approval or human usefulness.
