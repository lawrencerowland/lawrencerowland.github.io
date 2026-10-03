# Project decision graph

Maintained home: `/library/apps/project-decision-graph/`, in **Decisions and trade-offs**. This is the successor to the public `hs2-decision-graph.html` teaching example. It presents a fictional viaduct supply decision, not a record of HS2 performance.

## Source and preservation

- Source repository: `lawrencerowland/Project-web-apps`.
- Source file: `web_apps/hs2-decision-graph.html`.
- Source revision: `cd0528939fd0e1f5de1df7cda9930785349e4946`.
- Source SHA-256: `c0df5196d63783d2a1e4ab3895b0ea47a8700306ca90102a9ca18643d0857306`.
- Review date: 3 October 2026.
- All **22 source entities**, their stable IDs, descriptive fields, six visual groups and ontology-inspired roles remain. All **25 original relationships** remain in corrected or qualified form, with their exact original source/target/type stored in `legacy`. Three added story relationships make the guided decision sequence continuous: variance → assessment, risk → value judgement, replacement → alternative supplier.
- The source graph, detailed node inspection, neighbour emphasis, force/distance controls, pan/zoom/reset, relationship labels and decision-path emphasis remain. The story preserves its context, stakeholders, vulnerabilities, threat capabilities, intentions, risk/value assessments, possible loss events, three options and assumed outcome.
- New facilities: three guided readings, search and type/relation filters, keyboard graph nodes, complete cards and relationship lists, graph pinning, a strict saved-view import/export, copyable view URL, full data JSON and visible-card CSV exports. Original overview/detail/scenario tabs become visible sections and expandable explanation; their content remains available.
- The old graph's pointer-only double-click connection emphasis is replaced by selection plus the explicit **Emphasise selected neighbours** control, available from keyboard and cards.
- Original bookmark fragments `#overview-tab`, `#details-tab`, `#scenario-tab` and their corresponding `*-content` IDs remain real targets at the overview, inspector and story sections. They survive selection and filter changes; the diagram keeps its `#network` target.

## Claim and model corrections

The former description implied real concrete-test failures and a supplier replacement on a “Chiltern Viaduct”. No incident source accompanied it. [HS2's official Colne Valley viaduct page](https://www.hs2.org.uk/building-hs2/viaducts-and-bridges/colne-valley-viaduct/) describes a real structure but does not substantiate this story. The maintained page calls the viaduct, agents, suppliers, events and causal relationships fictional. The two-week delay and 3% component cost increase remain explicitly assumed story figures; no calculation or guaranteed quality is asserted. Investigating a changed mix requires engineering review and compliance with the approved requirements.

The [COVER project](https://github.com/unibz-core/value-and-risk-ontology) and [foundational paper](https://www.inf.ufes.br/~gguizzardi/ER2018-Risk.pdf) informed a limited semantic review:

- The `inheresIn` arrows now run from each intention to the construction manager.
- In the fictional chronology, construction delay `historicallyDependsOn` quality failure, rather than the reverse.
- Material uncertainty `mayPrecede` failure; the original reverse triggering assertion was not supported.
- Replacement `acceptsShortTermDelay`, rather than claiming to mitigate the same delay it introduces.
- Risk/value qualities remain linked to their assessment/ascription; “structural reliability” is described as assessed value rather than an observed measurement.

This is an informal, partial teaching graph. Abbreviated roles, treating a production weakness as a “threat capability”, incomplete mediation/multiplicity modelling, and application-specific verbs are not a validated COVER implementation. There is no OWL/OntoUML conformance test, probability calculation, optimiser, causal estimator, or project approval decision.

## Running and checking

No build step. Open `index.html` directly, or serve the site. D3 **7.9.0** is bundled locally with its ISC licence in `vendor/`; the app needs no remote script. Data is embedded as `#kg-data`, with pure filtering and saved-view validation in `model.js`.

Run from the repository root:

```sh
node --test tests/phase-three-maps.test.cjs
```

The tests compare the public source fixture, check corrected arrows and a continuous directed decision path, verify filters/selection cleanup, test immutable view round trips, exercise the real local D3 graph including keyboard selection and zoom controls, and check complete operation of the card fallback without graphical libraries.

Quick browser QA route: choose **Follow the decision**; select Material Quality Variance with Enter; inspect its outgoing assessment link; pin/unpin it; use neighbour emphasis and zoom; search a nonmatching phrase then reset; export and restore a view; open the relationship rationale list. Check narrow-screen stacking and the Library return link. Browser visual QA belongs to the overall migration review, not the jsdom checks alone.

View files/URLs preserve filters, guided reading, selected node and layout control values. Manual coordinates, pins and zoom are session-only. Full-data JSON includes all original relationship mappings and claim limits. Import accepts this app's view schema and source revision only; it does not import an arbitrary graph. No state is sent to a server.
