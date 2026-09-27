# Staged wildlife co-design: the implementation is a path

[Open the experiment](../apps/staged-paths.html) · [Reproducibility files](rail-staged-codesign/)

This experiment constructs a finite answer to a specific question: **can a preferred final wildlife-corridor design be delivered while maintaining declared readiness and meeting intermediate commitments?** The result is an executable implementation path and its resource trade-offs. A temporary mobile monitoring team contributes no final permanent capability, yet can become indispensable to a least-cost implementation that preserves readiness.

## End, way and contribution

The four public essays now share a wildlife-corridor scenario. This essay asks how passage, guide fencing and monitoring can be upgraded across delivery boundaries. It generates admissible action histories, rather than choosing only a final asset configuration or a supplied staging template. Its method and difficult staged-delivery question are retained from the Foray 180/182 rail antecedent; the wildlife mapping is a fictional model, not an ecological calibration.

The earlier rail simulator, incremental upgrade and transit demonstration were retired after model and claim review. Their strongest explanations are preserved in the [programme studio’s coupling primer](../apps/programme-studio.html#coupling-primer) and this app’s distinction between monotonicity and commitments. The [curation record](curation.md) preserves the reasons and historical source. The studio retains a different question: comparing compatible packages and four prescribed programme strategies. This construction generates admissible paths and derives their finite resource frontier.

This is progress within the foray, without a claim to have invented temporal co-design. Gioele Zardini's *Co-Design of Complex Systems*, §§3.1–3.5, printed pp39–50, defines a design problem with implementation `(F,I,R,exec,eval)`. Implementations may be plans or control strategies; functionality and resources are ordered, and composition restricts implementation tuples through their interfaces. Here, finite stage paths become those implementations. [Thesis, ETH Zürich](https://www.research-collection.ethz.ch/items/d7c08dd5-bf96-4c1f-a744-5e751f0f44a5).

Andrea Censi's co-design theory supplies minimal resource antichains under partial orders. The finite solver here is independently written; it does not implement the general library's recursive feedback solver. The MCDP manual's catalogue examples informed the explicit alternatives. [Censi, *A Mathematical Theory of Co-Design*](https://arxiv.org/abs/1512.08055), [MCDP manual](https://andreacensi.github.io/mcdp-manual/mcdp-manual.pdf). ACT4E's *Categories and Compositionality with a View to Applications* provides narrower background on interfaces, design problems and finite solution methods; its complete book is not claimed as implemented. [ACT4E](https://applied-compositional-thinking.engineering/).

## Declared model

Permanent passage, guide-fencing and monitoring modules have tiers `0,1,2`, initially 0, with readiness band `1+tier`. All must reach tier 2. Commissioned permanent tiers never decrease. Construction and commissioned operation remain different: a larger provision at slot end does not imply uninterrupted readiness during that slot.

**Corridor readiness is the minimum available band across the three required modules.** This is a management requirement for the toy corridor, not measured animal passage, species response, ecological benefit or a claim that monitoring causes animals to use a crossing. A monitoring outage can therefore reduce this declared readiness to zero even though animals may still be able to cross.

Each action lasts one slot and uses one delivery crew. Ongoing mobile monitoring staffing is bundled into mobilisation cost; it is not an extra concurrent delivery action:

| Action | Cost | Access | Main rule |
|---|---:|---:|---|
| Passage upgrade | 3 | 1 | Matching guide-fence tier already commissioned |
| Guide-fence upgrade | 4 | 1 | Next tier available |
| Direct monitoring cutover | 3 | 2 | Observation readiness drops to zero unless mobile cover is active |
| Prepare protected monitoring cutover | 2 | 0 | Prepare one monitoring tier |
| Protected monitoring cutover | 4 | 1 | Prepared; retains previous monitoring band |
| Mobilise temporary monitoring team | 4 | 1 | Available once, before monitoring completion |
| Release temporary monitoring team | 0 | 1 | Mobile team active; return its equipment |

All concurrent guards read the start state. Effects take place at slot end. Monitoring actions, including preparation, cannot share a slot with another monitoring action or mobile-team mobilisation/release. Other combinations must meet total crew and access limits. Fencing commissioned alongside a passage upgrade cannot enable that same passage upgrade.

The catalogue assumes modular passage and guide-fencing work alongside existing provision, retaining the previous band throughout the slot. Protected monitoring uses a prepared redundant arrangement. An active mobile team covers the currently commissioned monitoring band; it is assumed capable of covering the higher band before a second cutover without an additional charge. These are explicit delivery assumptions, not field observations or standard practice. A real corridor with closures, disturbance or differently sized mobile cover would need different transitions and costs.

Completion requires both tiers of every permanent module, no unused prepared monitoring work, and released temporary staff with equipment returned. Costs, readiness bands, access units and work rules are illustrative. Actual ecological, regulatory and stakeholder requirements must be supplied as explicit constraints; there is no fabricated political-risk score.

The readiness floor applies during every work slot. The intermediate promise concerns commissioned readiness at the **end** of its selected slot. It does not impose a higher operating floor thereafter. Completed paths extend their final readiness to the horizon.

The supported domain is horizon 4–12, crews 1–3, access cap 1–3, readiness floor 0–3, milestone readiness 1–3, milestone slot 1–horizon or 0 for disabled, and mobile-team availability true/false. Defaults are horizon 8, two crews, access cap 2, floor 1, and commissioned readiness 2 by slot 4.

## Query, algorithm and pruning condition

For fixed catalogue and availability limits, `I` contains paths legal under the declared transition rules and complete within the finite horizon. `exec(i)` contains readiness-during-work and commissioned-readiness curves, ordered pointwise, and final tiers. Resources are `(total cost, completion slot, peak simultaneous access)`, ordered componentwise. The query is:

`h(f) = Min { eval(i) : i in I and f <= exec(i) }`.

“Minimal” permits incomparable answers. Total access use is displayed but is not a fourth optimization objective.

The solver generates legal nonempty action batches and advances slot by slot. It first checks the temporal requirements. It then prunes cost/peak-access labels **only within identical `(time,p,s,g,prepared,temporary-phase)` states**. Those states have identical future actions; retained labels have no greater cost or peak access. Temporary phase distinguishes unused, active and released mobile cover. Removing that distinction would invalidate the argument.

The stable internal keys retain the historical implementation's IDs: `p`/`platform-up` now mean passage; `s`/`signal-up` mean guide fencing; `g`/`grid-*` mean monitoring. The JSON export supplies these meanings and wildlife action names. These IDs and the legacy reproducibility-directory name are compatibility/provenance, not public railway assumptions.

Past queried requirements have already been enforced. Full curves are reconstructed for retained witnesses; every possible readiness curve is not retained. Changing the request triggers a fresh solve. Additional cumulative-resource constraints or objectives would require extending the labels and dominance order.

Empty waits are normalized away. No external release dates exist, so deleting a wait preserves action guards and transition readiness, and cannot worsen upper-bound completion or commissioning deadlines. Seasonal work windows, dated permissions or time-varying requirements would require explicit waiting transitions and a revised proof.

## What the default witness proves

| Query | Minimal `(cost,finish,peak access)` tuples |
|---|---|
| Final readiness only | `(20,5,2)`, `(23,4,2)`, `(26,6,1)` |
| Full temporal request | `(24,5,2)`, `(26,4,2)`, `(26,6,1)` |

Two full-request frontier tuples are absent from the endpoint frontier: the 24-unit mobile-cover path and the faster 26-unit protected path. Endpoint pruning followed by filtering cannot recover them. Pareto reasoning remains correct; the endpoint projection omitted required functionality.

The arithmetic is inspectable. Passage/fencing work costs 14. Two direct monitoring cutovers cost 6, producing the 20-unit endpoint design but interrupting readiness. Adding mobile cover costs 4, producing 24. Two prepared protected cutovers cost 12, producing 26. These alternatives exchange cost, completion and access requirements.

A failed displayed path is weaker evidence than an excluded resource tuple. With floor 0 and readiness 2 required by slot 3, one selected endpoint path fails while another ordering achieves the same `(20,5,2)` tuple. The app distinguishes witness rearrangement from actual frontier loss.

The six-slot, one-crew continuity case is infeasible within this model: four passage/fencing actions plus either four protected-monitoring actions or two direct-monitoring actions and mobile-team mobilisation/release require at least eight unit actions. This provides a bounded impossibility argument, not a claim about all wildlife-corridor delivery methods.

## Antecedents and verification

Corentin Briat's 2026 `codesign-mcdp` includes sequential and temporal extensions. The reviewed manual characterized these as the author's extensions, work in preparation and not peer reviewed. Its carried-state implementation preserves future resource consequences before projecting onto cost. That antecedent reinforces the pruning condition above; this app uses its own solver. [Library paper](https://arxiv.org/abs/2607.18415), [reviewed implementation at commit 97d6446](https://github.com/cbriat/codesign-mcdp/blob/97d6446abf48c3424cf52bace9c5d9c40bfda978/codesign/sequential.py#L423-L475).

The independent oracle implements the rules without importing the engine's transitions, feasibility tests or dominance helpers. It enumerates complete histories without state merging. A fresh wildlife-edition run on 27 September 2026 passed all 507 tested configurations: 4,733,325 history prefixes, 1,016,583 complete normalized histories, 7,405 returned-plan replays, 38,308 stage-annotation checks and 175 relaxation checks. This tests feasible histories surviving relaxed constraints; it does not incorrectly require Pareto point sets to be nested. The runner also checks that the app's embedded engine exactly matches the standalone engine.

Verified wildlife-edition engine SHA256:

`97098474bab0cf5682f93fcdbabc5ee40bbb25754f0ca9b268bd95e393ea41cb`

The [reproducibility directory](rail-staged-codesign/) contains the [engine](rail-staged-codesign/model.cjs), [independent oracle](rail-staged-codesign/oracle.mjs), [verification runner](rail-staged-codesign/verify.mjs), [fresh model results](rail-staged-codesign/results.json), [browser-check script](rail-staged-codesign/browser.cjs) and [historical browser results](rail-staged-codesign/browser-results.json). The historical browser receipt concerns the earlier rail edition and is explicitly not fresh wildlife-interface evidence. The computational result concerns this finite model. Neither calculation nor interface checks establish ecological calibration, safety approval, adoption or human usefulness.
