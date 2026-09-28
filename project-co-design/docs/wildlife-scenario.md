# One wildlife crossing, four co-design essais

27 September 2026; consolidation 28 September 2026 · [Foray home](../index.html)

Local planning now has one home: **Foray 180 · Co-design for trade-offs**. The former animal-crossing (181) and railway (182) drafts are predecessors, not additional active essais.

## End

Use a project we can picture—a green crossing reconnecting habitats across a busy road—to understand how connected choices constrain one another. A bridge needs guiding infrastructure and observation; constructing it and supporting that observation bring further obligations. The aim is to expose useful chunks of work, capability, scope and resource, and the trade-offs between complete implementations. The animal crossing is an intuition pump, not the limit of the eventual use case.

An *essai* is a trial: a way to test what a method makes visible, including where it stops. The four trials below share the story, not a common calibration. They do not together constitute a designed, costed or approved wildlife scheme.

## Ways: source → concept → construction → limit

Read the relevant source and each model contract before extending an essai. Do not infer a general categorical result from a plausible diagram or a passing finite test.

- **Gioele Zardini, [Co-Design of Complex Systems](https://www.research-collection.ethz.ch/items/d7c08dd5-bf96-4c1f-a744-5e751f0f44a5), chapter 3, §§3.1–3.5.** Functionality, implementations and resources; compatible component tuples. The crossing and studio make the implementing tuple visible rather than merely presenting a ranked score.
- **Andrea Censi, [A Mathematical Theory of Co-Design](https://arxiv.org/abs/1512.08055).** Ordered functionality and resources, antichains and feedback. All four retain resource trade-offs. The power essai exercises a particular pinned package feedback solver; the staged history search and studio's affine equation are different constructions.
- **The inspected [Briat MCDP implementation](https://github.com/cbriat/codesign-mcdp/tree/97d6446abf48c3424cf52bace9c5d9c40bfda978)** and its [local exploration note](rail-power-loop/package-exploration.md). It supplies the actual `System`/`Module`/`solve` path behind the recorded monitoring-power atlas. Package availability, the solver's formal scope and this finite application's checks remain separate questions.
- **Ecological motivation:** the [crossing essay's source panel](../apps/wildlife-crossing.html#sources) distinguishes highway biodiversity guidance and the Cockcrow green-bridge example from our invented numerical catalogue. Those sources motivate considering guidance, habitat and observation together; they do not validate the toy coefficients.

## Means: preserve the question each method can answer

| Essai | Concrete question | Method and retained learning | Boundary |
|---|---|---|---|
| [Compose the crossing](../apps/wildlife-crossing.html) | Which bridge bundle, fencing and monitoring meet the brief together? | Typed guide-km and observation-point interfaces; full compatible tuples; three-resource antichain; equivalent component regroupings. | Finite configuration model. Model crossings/day are stipulated capability, not predicted animal use. |
| [Construct a path](../apps/staged-paths.html) | Can we reach the final passage, guidance and monitoring levels while meeting intermediate requirements? | Generated histories, start-state guards, construction-period readiness, crews/access, commissioning milestones, temporary mobile monitoring and replayable witnesses. | Exact only within the declared finite state/action contract. Readiness is a management proxy, not an ecological safety or animal-use claim. |
| [Compare programmes](../apps/programme-studio.html) | How do complete package choices and delivery assumptions change resource trade-offs? | Induced requirements, explicit compatible tuples, four supplied strategy templates, governance/context, affine approvals feedback, and a zero-incremental-work baseline. | It compares supplied strategies; it does not generate all paths. Its numerical catalogue differs from the configuration essai. |
| [Power the monitoring](../apps/monitoring-power-loop.html) | Can an autonomous observation installation also power its own cooling and conversion overhead? | A real package feedback construction, integer equipment witnesses, convergence traces and an independently checked recorded atlas. | Synthetic packs, converters and coolers; no live browser solver or real equipment design. Cabinet allocation is litres, separate from crossing land. |

Do not pass the output of one app directly into another as if their catalogue assumptions agreed. A future genuinely coupled model would need explicit shared interfaces, units, capability definitions, validity domains and new checks. In particular, fence length is a declared design input here, not evidence that extending a fence increases observed animal use.

## What changed from the railway edition

The live front door and all four active essais now use the wildlife setting. The original crossing solver is preserved. Staged paths retains its finite numerical problem while interpreting its state levels as passage, guidance and observation; the distinction is explicit. Programme studio uses a wildlife catalogue and reruns its independent evaluator. Monitoring power uses watt/Wh-scale equipment and cabinet volume, with a newly generated package atlas and rerun independent oracle.

The green-arch-and-deer emblem replaces the railway image in this foray and its side-project card. The larger scene shows the crossing, guiding fences, cameras and power cabinet together.

The old `rail-power-loop.html` address is a migration notice, with an immutable link to the old source. Its saved kW/footprint settings are not reinterpreted as watts/litres. The three older retired rail apps remain historical notices. Rail-named method directories are retained for stable source links; their current documents identify the wildlife edition, and dated rail evidence is labelled historical.

What has *not* changed is the End: learn how composition exposes obligations and useful project choices. Keeping the source, construction and limits in view matters more than making every method look identical.

[Verification record for this refactor](wildlife-refactor-review.md) distinguishes model tests, fresh browser review and the human-use boundary.
