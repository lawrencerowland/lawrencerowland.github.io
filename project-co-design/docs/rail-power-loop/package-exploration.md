# What the MCDP package lets us do next

7 September 2026 · [New temporary-power app](../../apps/rail-power-loop.html) · [Foray home](../../index.html)

The useful addition is **executable feedback between components**. We can declare the capabilities that each component must provide, wire the demands they create for one another, and let the package find the least consistent resource requirements. The new rail essay uses that capability to size temporary power, including the power needed by its own cooling and conversion equipment.

This review used the actual source and an isolated installation of Corentin Briat's [`codesign-mcdp` 0.2.1 at commit 97d6446](https://github.com/cbriat/codesign-mcdp/tree/97d6446abf48c3424cf52bace9c5d9c40bfda978). It is the separate public implementation identified in the previous audit, not original PyMCDP returning. We inspected the package API, manual and selected examples, then ran bounded probes of the core solver before building the app.

## Capabilities and promising project questions

| Package capability | What it could add | Disposition in this experiment |
|---|---|---|
| `Module`, `System`, `solve` and feedback trace | Size an enabling resource whose own overhead creates further demand; expose which component causes the next increase. | Used directly for battery, cooling and converter sizing. |
| Series/parallel composition and resource antichains | Build a larger model from reusable component relations, preserving several incomparable answers. | The component system is explicit; eight fixed equipment-family combinations preserve named implementations and are compared by capital and footprint. |
| Lower/upper design problems and monotone parameter boxes | Ask which wildlife crossing or rail configuration remains adequate under an established range of assumptions. | Useful next extension, but the bracket and common adverse corner must be justified. The app currently has two explicit, separately solved equipment envelopes. |
| Online candidate evaluation with valid optimistic bounds | Decide which expensive engineering model to evaluate next, while preserving the remaining unknown candidates. | Potentially useful when inner calculations are expensive. It is a computational search question, not automatically an ecological survey or a field-learning policy. |
| Temporal, sequential and receding-horizon extensions | Explore changing systems and choices over time. | Not used here. Their semantics and stated research status need their own audit before replacing the existing staged-path result. |

A particularly promising later wildlife question is **one design committed before a survey versus a policy that keeps a later choice open**. A robust installed design must be the same physical implementation in every possible scenario. Reoptimising separately after seeing each scenario answers a different question. A survey-contingent policy would need explicit shared first-stage actions, observation branches and resource accounting; the package's uncertainty wrapper does not supply those policy rules automatically.

We chose the rail loop for this app because it puts the inspected static composition machinery directly to work on a gap in the existing rail story: temporary power had been assumed available rather than sized. It yields a compact, independently checkable next choice between real model implementations, while keeping that physical sizing question separate from the programme's installation sequence.

## Findings that changed the implementation

The package is useful, but its convenience APIs are not mathematical certificates for arbitrary supplied models. These source-pinned findings affected our design:

1. **Convergence is required.** A bounded runtime probe returned `feasible=True` while `status="max_iter"`; the intermediate resource point did not yet meet the full requirements. The [solver](https://github.com/cbriat/codesign-mcdp/blob/97d6446abf48c3424cf52bace9c5d9c40bfda978/codesign/solver.py) exposes these separately. The atlas build rejects every unfinished calculation.
2. **Cold starts preserve the least-solution question.** Reusing a larger solved point for a relaxed request produced false infeasibility in a probe, while a cold solve found the smaller answer. Every atlas calculation starts from zero.
3. **Catalogue availability is checked explicitly.** An empty capped component inside `System` produced a partly infinite internal state and `diverged`. We instead solve the monotone integer sizing system, verify its least point, and compare that point with the stated availability bounds. [The proof and exhaustive check](MODEL.md) establish when exceeding a bound rules out an available design.
4. **Implementation names are kept outside the numeric frontier.** [`CatalogDP.h`](https://github.com/cbriat/codesign-mcdp/blob/97d6446abf48c3424cf52bace9c5d9c40bfda978/codesign/dp.py#L140-L219) returns resource dictionaries rather than catalogue names. Each equipment-family combination is therefore solved and recorded with its own identity, counts and complete interface checks; equal-resource alternatives remain recoverable.
5. **Units and monotonicity belong to the model contract.** Unit strings are descriptive metadata. The package checks wiring targets and coverage, but does not prove physical dimensional consistency or monotonicity of arbitrary Python functions. The three inequalities, integer arithmetic and non-negative coefficients are independently checked here.

The uncertainty layer needs separate care. In this version an undeclared `Box` direction uses a summed-resource heuristic; an actual system probe selected the favourable endpoint as its reported worst case. Declaring the proven adverse direction produced the expected endpoint in that probe. The `Ellipsoid` direction shortcut is not a general worst-case oracle, and stochastic convenience summaries pool resource coordinates across feasible frontier points. Those coordinates need not describe one design committed before uncertainty resolves. The new app does not use these shortcuts. [Inspected uncertainty implementation](https://github.com/cbriat/codesign-mcdp/blob/97d6446abf48c3424cf52bace9c5d9c40bfda978/codesign/uncertainty.py).

There are also two different online layers: candidate-evaluation search and a myopic sense/solve/act loop. A budget-exhausted search is incomplete; a partially successful control run is not a completed programme. These distinctions would need explicit treatment in an app using them.

## Publication architecture

The core package has no mandatory runtime dependencies beyond Python's standard library. It can therefore be run reproducibly during generation without adding a heavy runtime to the public page. All supported briefs are calculated with the pinned Python package, and the recorded atlas is embedded in the standalone HTML.

The page supports exactly the displayed power, duration and condition choices. Its ceilings filter complete recorded designs; it does not interpolate a result for an uncomputed request. The [Python model](model.py), [generator](build_atlas.py), [contract](contract.json), package pin and independent oracle make a new atlas reproducible. The build checks source hashes and complete results, rather than trusting a screenshot or just a frontier count.

Running the Python package in a browser worker through Pyodide is a candidate future architecture if freely editable component parameters become useful; browser compatibility was not tested in this experiment. It would add runtime loading, cancellation, failure and browser/native-equivalence work. It is not necessary for the complete finite experiment published here.

## Source and scope

The framework remains [Censi's mathematical theory](https://arxiv.org/abs/1512.08055) and [Zardini's co-design definitions](https://www.research-collection.ethz.ch/items/d7c08dd5-bf96-4c1f-a744-5e751f0f44a5). The package's [manual](https://github.com/cbriat/codesign-mcdp/blob/97d6446abf48c3424cf52bace9c5d9c40bfda978/docs/manual/codesign-mcdp-manual.tex#L7066-L7072) distinguishes the established static machinery from its author's newer temporal and sequential extensions, which it describes as not yet peer reviewed. The app uses the static core and our declared finite engineering model, with an independent oracle; it makes no general correctness claim about every package module or a real railway installation.
