# Are these models really using categorical co-design?

Reviewed 6 September 2026; package-backed feedback addition 7 September 2026. [Foray home](../index.html) · [Curation record](curation.md)

**Yes, in a bounded finite form.** The implementation witnesses, ordered functionality/resources and compatibility constraints do real work. We do not claim that every arrow is a categorical operation, or that these browser apps implement a general MCDP library.

## The source standard

Zardini’s *Co-Design of Complex Systems* (2023), Definition 3.3, separates a design problem into functionality `F`, implementations `I`, resources `R`, and maps `exec:I→F`, `eval:I→R`. Definition 3.17 composes these problems by retaining the tuples of component implementations whose resource requirements are met by connected functionality. The external ports then describe the whole system. The implementation set can be finite and solved by enumeration. [Zardini dissertation, §§3.1–3.5](https://www.research-collection.ethz.ch/items/d7c08dd5-bf96-4c1f-a744-5e751f0f44a5).

A query asks for `Min { eval(i) : f ≤ exec(i) }`, optionally subject to resource ceilings. The order compares each resource separately, so several incomparable answers can be minimal. This implements the finite catalogue idea behind the monotone co-design framework. A diagram or a weighted ranking alone would not establish that relation. [Censi, A Mathematical Theory of Co-Design](https://arxiv.org/abs/1512.08055).

## What each essay implements

| Essay | Implementations and interfaces | Accurate claim |
|---|---|---|
| [Staged paths](../apps/staged-paths.html) | Legal action histories; start-state guards, service during work, commissioned capacity, crews and access. Each resource vector has a replayable path. | A finite design problem with implementation. The engine compiles explicit temporal constraints into a history search; it is not a general diagram compiler or feedback solver. |
| [Temporary power](../apps/rail-power-loop.html) | Whole operating battery/converter/cooling counts; energy, electrical-power and thermal requirements form a cycle. | The actual pinned Python package builds a `System` feedback loop and solves each supported brief. Converged least integer counts are checked against availability and an independent bounded enumeration. The browser presents the recorded atlas. |
| [Programme studio](../apps/programme-studio.html) | Service-plan and platform/signalling/power package tuples satisfying capability requirements; governance assumptions and four supplied schedule templates evaluate incremental cost, time, risk and possessions. | A finite compatible-tuple composition. Flat enumeration is a valid way to solve the declared relation. Its affine approvals calculation is a particular resource evaluator, not a general MCDP feedback operator. |
| [Wildlife crossing](../apps/wildlife-crossing.html) | Bridge bundle, fence package and monitoring package, joined through guide-kilometre and observation-point requirements. Costs, land and annual expense are aggregated explicitly. | A finite acyclic composed design problem with full implementing tuples and resource antichains. Component regrouping is checked against an independent flattened relation. |

The studio’s existing-railway option is a **baseline implementation** with zero incremental programme burden when it meets the request. It is not the categorical identity morphism. The identity on an ordered interface is its order relation; those are different notions.

## Where composition changes the answer

In wildlife, a bundle of `N` bridges requires `2N` kilometres of guiding fence and `2N` observation points. A fence package adds its own observation requirement. A monitoring package must cover the total. These two inequalities are the actual join conditions:

```text
bridge.fenceNeedKm ≤ fence.km
bridge.observationNeed + fence.observationNeed ≤ monitoring.points
```

The two groupings `(bridges + fencing) + monitoring` and `bridges + (fencing + monitoring)` retain the same full implementation witnesses. In the second grouping, the fence/monitoring composite exposes guide length and residual observation capacity. No bridge option is discarded merely because its projected cost looks worse before its remaining obligations are met. See the [frozen contract](wildlife-codesign/API.md), [model](wildlife-codesign/model.cjs) and [independent comparison](wildlife-codesign/REVIEW.md).

The staged model has an analogous reason to retain future-relevant information: temporary equipment and prepared grid work can enable a later path. Pruning is restricted to identical physical state and time, after past requirements are checked. It is justified for the declared cost/finish/peak-access query; new cumulative budgets or external calendars would require a revised contract. [Staged method and proof conditions](rail-staged-codesign-method.md).

## What the checks establish

The finite model checks compare witnesses and feasible resource sets, not merely screenshots or frontier counts. Wildlife’s independent checker rebuilds the catalogues from the written contract, enumerates all component triples and checks the complete external relation. Studio checks include the previously hidden-ceiling counterexample and a baseline already meeting the request. Staged paths retains its independent explicit-history oracle.

For a fixed model, increasing the requested functionality can only remove feasible implementations; relaxing a resource ceiling can only add them. The *Pareto points themselves* need not be nested. Catalogue/context changes are changes of assumptions. Fictional rail/ecological constants and programme-risk coefficients remain assumptions, even when the finite calculation is exact.

A general MCDP solver additionally addresses suitable ordered spaces, continuity and loop solving. These experiments do not establish those general algorithms or replace field evidence. Their positive claim is smaller and inspectable: explicit components or paths, valid interface constraints, complete declared resource accounting and implementing witnesses behind the resource choices.

## Has the original Python package returned?

**No public restoration of the original PyMCDP repository was verified in the 6 September 2026 check.** The February brief’s withdrawn/refactoring note points to Censi’s PyMCDP. Its canonical [AndreaCensi/mcdp](https://github.com/AndreaCensi/mcdp) repository returned 404 from GitHub’s API, and targeted repository searches did not identify a restored solver. The checked [duckietown/mcdp](https://github.com/duckietown/mcdp) address also returned 404. This does not establish why it is unavailable or exclude an unpublished or differently named successor.

There are distinct public resources:

| Resource | Observed status |
|---|---|
| [fgolemo/mcdp](https://github.com/fgolemo/mcdp/tree/46eb25ca85660f4d6c2f1f6d026f7e97c7977ac3) | Historical2017 PyMCDP source survives. It is not evidence of a restored current canonical solver. Modern installation was not tested. |
| [ACT4E/ACT4E-mcdp](https://github.com/ACT4E/ACT4E-mcdp/tree/00aa19e69c0f3cb3b3b277024f74be098cc68b34) | Public course API, exercise and test infrastructure. Its README does not present it as the completed restored PyMCDP solver. |
| [cbriat/codesign-mcdp](https://github.com/cbriat/codesign-mcdp/tree/97d6446abf48c3424cf52bace9c5d9c40bfda978) | A separate from-scratch implementation is public and MIT-licensed. Inspected source version0.2.1 at commit97d6446 (11 August2026); latest GitHub release listing0.2.0. This is not Censi’s withdrawn repository returning. |

Repository availability, installation success and mathematical validity are separate questions. This 6 September check verified readable GitHub source, not a current PyPI inventory or a completed installation. [Briat’s inspected manual](https://github.com/cbriat/codesign-mcdp/blob/97d6446abf48c3424cf52bace9c5d9c40bfda978/docs/manual/codesign-mcdp-manual.tex#L7066-L7072) also labels its temporal/sequential extensions as the author’s newer, not-yet-peer-reviewed work; its availability is not a reason to silently adopt those broader claims. The three earlier apps retain their small independently written browser models and explicit checks; the new package-backed essay is described below.


## The package is now exercised in a new essay

On 7 September 2026 we installed and probed Briat's pinned source in an isolated environment, then used its core `System`/`Module`/`solve` path for [temporary power](../apps/rail-power-loop.html). It sizes circular battery, cooling and converter obligations. This is a new package-backed calculation, separate from the three earlier models. [Scope, dependency and proof](rail-power-loop/MODEL.md); [explored capabilities and limits](rail-power-loop/package-exploration.md).

The original PyMCDP availability finding above remains the dated repository check. The new installation is of Briat's different implementation.
