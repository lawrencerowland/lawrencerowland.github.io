---
layout: default
title: "Gimmer collection boundaries"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/gimmer-crag/app-index.html">← Return to the example</a> · <a href="/library/sources/gimmer-collections/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the collection-boundary note and its linked method explanation. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/gimmer-collections/files/planning/gimmer-collections.md.txt" download="gimmer-collections.md">Download original file</a> · <a href="https://github.com/lawrencerowland/gimmer-crag/blob/697e2dcee7bc501130a2e95288857f782f35ad85/planning/gimmer-collections.md">GitHub source at 697e2dc (may require access)</a></p></aside>
</div>

{% raw %}
# Gimmer collection boundaries

User-directed curation, 8 September 2026; App 20 entrances clarified 12 September 2026. This changes discoverability, not model behaviour or retirement status.

- `petri-smc-wbs.html`: main Petri → SMC → WBS route. Includes direct process/state-to-task mappings, Petri reachability and checks, plan generation, composition explanations and schedule/WBS projections. PDDL (#2) belongs here because its PNML-to-tasks bridge and causal WBS construction directly support the route. #12 is the conflict/event-structure companion. References and source generators remain labelled as such; listing does not imply full executable correctness.
- `app-index.html`: the twelve other numbered apps in observation/binding, procurement, ontology, sheaf/change, resource scheduling and alternative-method experiments, plus an explicit comparison reference to App 20. The comparison tests why two supplied mechanisms can give the same chosen plan; it does not infer a mechanism from a plan.
- The separate `gimmer-crag-project-mountain-refuge` site owns the higher-autonomy labs. Its inherited comparison links to the canonical App 20 here as background, not an independently generated new result. No apps are deleted or moved between repositories.

Maintain the disjoint, exhaustive numbered-app partition in `gimmer-collections.json`, the two landing pages and each app’s return links together. Keep source `apps/` and deployed `docs/` consistent through the normal build. The original CSV remains the complete inventory, not the broader collection membership list.

## App 20: one implementation, two purposes

The Processes to plans feature and catalogue entry open `apps/mountain-refuge-petri-wbs-demo/index.html?view=scheduler`: **Generate refuge schedules from process rules**. The broader comparison reference opens that same file with `?view=comparison`: **Why one plan can hide different process rules**. Each entrance sets the heading, introduction, visible work area and collection return. View changes retain temporary settings and results; reload restores defaults.

The numbered primary memberships remain a disjoint 16/12 partition. The manifest records the broader comparison as a reference, so there are 28 unique apps and 29 purpose entries, not a duplicate app or code copy. Both collection return anchors remain explicit in the app.

Plain URLs retain the comparison. Existing known hashes select and reveal their own view, including `#schedule-lab`, `#process-lab`, `#netJson`, `#model-notes` and `#same-plan-witness`; a recognized hash takes priority over the query. Other query parameters survive in-app navigation. Back/forward and repeated anchor activation restore the corresponding view. No inherited redirect needs alteration. Without JavaScript both sections remain available as markup, with the workbench disclosure and both collection links.

The original simulator and its twelve witness cases are retained. Schedule generation samples priority-based executions rather than exhaustively enumerating plans. Its same-start SMC-style expression and WBS remain illustrative projections; this curation adds no categorical or engineering-validity claim.

## Resource Heaps (App 27, 18 September 2026)

The broader collection now includes Resource Heaps: supplied mandatory jobs, fixed prerequisites and pooled renewable teams, with complete finite RCPSP optimisation and separately verified unit assignments. Its rising-block visual is retained as an allocation witness. It does not generate the required work or derive a Petri/SMC model, so it is a broader scheduling companion rather than a new Processes to plans entry. See [the method and sources](https://lawrencerowland.github.io/gimmer-crag/apps/resource-heaps/method.md).

## Homotopic cliff shed construction (App 28, 28 September 2026)

The broader collection includes the recovered three-path cliff-shed illustration. Native SVG and small static scripts preserve the original path coordinates and offer a selectable pair, interpolation slider and playback. The four engineering, time and cost claims are explicitly unknown, replacing the earlier unconditional invariant ticks. This is a homotopy of drawn paths in an unrestricted plane, not a checked deformation through feasible project plans. It neither generates work nor implements the Petri/SMC/WBS route.

The app links to the original TSX at pinned commit `c9481a81a731682906837b500602948407d5f630` in `gimmer-crag-project-mountain-refuge` for recovery. Its optional companion field retains all sixteen task names, types and supplied priorities, with seeded reproducible positions, strength/play/reset and task inspection. Corrected simultaneous, bounded updates support a heuristic spatial layout; affinity/proximity lines are not dependencies, phases or a feasible/optimal schedule. The earlier self-organisation and optimal-phase claims are withdrawn. Source `apps/homotopic-cliff-shed-construction/` is canonical; the build copies it to `docs/apps/` for Pages.

Run `npm run test:cliff-paths` for endpoint/interpolation, interaction and navigation checks, then `npm run check:app-links`. This record describes the implementation and collection boundary, not publication or human validation.

{% endraw %}
