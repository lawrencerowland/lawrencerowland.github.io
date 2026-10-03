# Portfolio scenario loom

Historical source names, revisions and hashes below identify the reviewed inputs; they are not retrieval links. [Maintained source and verification files](https://github.com/lawrencerowland/lawrencerowland.github.io/tree/master/library/apps/portfolio-scenario-loom).

A maintained Library example in **Capabilities & futures**. A fictional technology portfolio considers an architecture freeze, pilot launch and scale decision while authored policy, market and technology assumptions overlap. The app exposes the assumptions' signed effects at each milestone and compares a changed scenario selection.

Open `index.html` directly or serve this directory. It uses local HTML, CSS, JavaScript and SVG, with no build, runtime package, external font or network request. Canonical home: `https://lawrencerowland.github.io/library/apps/portfolio-scenario-loom/`. Its return route is `/library/methods/capabilities-and-futures.html`.

The indices are dimensionless. They are **not probabilities, money, schedule forecasts, causal evidence, commitment robustness or demonstrated project benefit**. Selecting fewer adverse scenarios changes an assumption set; it does not improve the underlying portfolio.

## Source and retention

Source: `lawrencerowland/Project-web-apps@7888f8a85aa9121e99190d392a622a4ee0cd4a7e`, `lawrencerowland/Project-web-apps@7888f8a85aa9121e99190d392a622a4ee0cd4a7e:web_apps/portfolio_loom.html`.

Original HTML SHA-256: `a2ed9793665e223e132496f3d63e510c5124d1b6283bcb61b5d35c17cee1631d`.

The entire HTML, including its calculations, interaction handlers and three explainers, was read. `data.js` retains all **12 scenario names and IDs, types, base window dates, strength values, six signed effects, three declared lagged links, default weights, original four-item selection, three milestone offsets and 12 prompt rules**. The original revision and hashes record that comparison; this maintained data and the correction ledger are the retained evidence.

An independent execution of the original seed and rule declarations in UTC produces the same retained-data SHA-256 as `JSON.stringify({library:seed.library,selected:seed.selected,milestones:seed.milestones,rules})`: `ce5f632f17d7d9ad5ad6c6d62893cd0ed812e16366a7acf644593b79b85d1c41`. Random original milestone IDs are normalised to `m1`, `m2`, `m3` for this comparison. The source's intended calendar offsets are retained; accidental timezone-dependent shifts from mixing local setters and UTC serialisation are corrected.

| Original feature or explanation | Maintained treatment |
|---|---|
| Twelve policy, market and technology scenario “fibres” | All names, values, types and relative timing retained; explicitly fictional assumptions. “Scenario” is the primary UI term. |
| Select/toggle scenarios | Retained, with the selected count independent of search/type filters. |
| Search and type filter | Made functional. The original read these values only during unrelated refreshes and did not register search/filter events. |
| Add/edit scenario | Retained with labelled native controls, validation and real Cancel behaviour. Tags survive edits and are editable. Names are text, not markup. |
| Confidence and weight | Same coefficients; “confidence” appears as **assumed strength**. It scales an activation amplitude, not an occurrence probability or confidence interval. The saved field name stays `confidence` for source-format compatibility. |
| Six effects from −1 relief to +1 stress | Retained for cost, schedule, quality, supply, regulatory and talent. |
| Optional second-order JSON | Retained as explicit one-pass lagged links, with valid target IDs, signed polarity, bounded gain and integer lag. Both ends must be selected. Corrected to retain contributions originating before the visible timeline start. |
| Triangular activation and widened shoulders | Original construction retained, using UTC calendar months and a shared 0–2 activation scale. The shoulders are a modelling choice, not epistemic uncertainty bounds. |
| Decorative sine ribbons and “confidence envelope” | Replaced by the actual monthly activation curves and lightly filled areas. No invented oscillation or statistical envelope is implied. |
| Resonance/interference bands | Same pairwise dot products, labelled **same-direction alignment** and **opposition**. Neither is coloured or described as inherently good or bad. Exact values are available in the monthly table/CSV. |
| Milestone pressures | Same underlying signed sums, augmented with separate positive stress and negative relief totals so cancellation remains visible. |
| Robustness percentages | Removed. Replaced by an explicit unnormalised attention index derived from positive net pressure and a stated review-emphasis factor. No alternative-world robustness test existed. |
| Risk-appetite slider | Retained as **tolerance for pressure**, using the original factor `1.3 − 0.6 × tolerance`. It changes attention/prompts only, not effects, activation or pairwise indices. |
| Delivery-anchor rules | All 12 original texts and thresholds retained as discussion prompts. Only positive net pressure can trigger them; at most three highest-pressure dimensions are shown. No minimality, optimality or effectiveness claim is made. |
| Add and drag milestones | Retained, with exact month controls as keyboard/touch alternatives and a remove control. Pointer coordinates now match the SVG scale. Out-of-horizon dates are shown as outside rather than clamped to a boundary value. |
| Fabric-swap suggestion | Replaced by explicit remove/add choices with recomputed before/after milestone values and a separate Apply step. The old suggestion ranked window midpoints against the existing field without evaluating the incoming scenario's effects. It was not a valid optimiser. |
| Model JSON export/import | Retained with a versioned format and support for explicit imports of original CSPL exports. Invalid imports are rejected before changing the model or any browser save. |
| Browser-local persistence | Retained through explicit Save/Load buttons under one new app-specific key. Opening the app starts the original example. Saving is not an upload or backup. |
| Reset | Restores the complete original example immediately, including all three milestones. It does not remove a browser save. |
| Three explanatory buttons | Reworked into native disclosures: how to use, model mechanics, prompt rules and source corrections. Useful conceptual explanation survives without the unsupported forecast, tensor-network, credal-set or top-k-invariance claims. |
| Numerical inspection | Added full monthly activation/net-effect table, stress/relief milestone tables and CSV of activation, stress, relief, net, pairwise indices and attention. |

## Model contract

Dates are validated calendar dates, but evaluation is at **calendar-month resolution**: days within the same month have the same model position. The UI uses month controls. UTC arithmetic prevents daylight-saving and timezone changes from moving a model to a different month; adding months to a late-month imported date clamps to that destination month's final day.

For scenario `i`, let `s` and `e` be start/end month offsets, `w = max(1, round(0.15 × max(2, e−s)))`, and `mid = (s+e)/2`. Its triangular shape is zero at `s−w` and `e+w`, and one at `mid`. Base activation is this shape multiplied by `confidence × weight`. An explicit saved weight overrides the scenario's default weight, including a genuine zero override. Inherited object properties are never weights: valid IDs such as `toString` use the same default/override rule in the calculation, display and editor.

At each visible target month `t`, a selected source contributes `base_source(t − lagMonths) × link.strength × link.polarity`. Earlier source months remain part of this calculation even when they precede the visible timeline; changing the timeline start must not alter a shared calendar month's result. This corrects the former array shift, which discarded contributions before the displayed start. For example, a January–March source with strength and weight 1, linked with gain 1 and a two-month lag to a zero-base target, contributes 0.5 in March whether the view begins in January, February or March.

The target adds all such contributions to its own base activation, then clips to `[0,2]`. Links are evaluated once from base activation, not recursively from propagated activation. Cycles and self-links therefore do not create repeated feedback. Dormant links to unselected targets have no effect. The displayed clipping count counts visible scenario-months whose raw activation lies outside `[0,2]`; it is not a physical saturation law.

For effect dimension `k`, contribution is `effect_i,k × activation_i(t)`. Stress sums positive contributions; relief sums their negative magnitudes; net equals stress minus relief. These are authored quantities in a common invented scale, not measured portfolio units. Cancellation within a dimension is allowed by this source model and exposed alongside the separate totals.

For each selected scenario pair, the source's unnormalised dot product of their six effect vectors is multiplied by their activations. Nonnegative results accumulate in alignment; negative magnitudes accumulate in opposition. Mixed-sign vectors can have a net positive or negative dot product. These values reflect the supplied directions and scales; they do not establish common causes, interactions, benefits or harm. The graphic normalises each band's opacity to its own current maximum, so numerical values—not colour intensity across separate selections—support comparison.

At a milestone, the new attention index is:

```text
review emphasis = 1.3 − 0.6 × tolerance
attention = review emphasis × sum_k max(0, net_k)
```

The old score instead used absolute net effects divided by twice the number of selected scenarios. Independent probes showed that one cost-stress scenario scored approximately 50%; adding a zero-effect scenario raised it to approximately 75% without changing pressure. A pure relief scenario received the same 50% penalty as stress. Those behaviours cannot support the original robustness language. The new index has no selected-count denominator or percentage interpretation. It remains a stated heuristic; relief can offset stress, and incomplete assumptions can produce an artificially low value.

Discussion prompts apply the same emphasis factor to each positive net dimension, select the highest threshold met (`0.5` or `0.8`), and show at most three dimensions in descending pressure order. Prompt texts do not model the consequences of taking their suggested actions. Absence of a prompt establishes neither safety nor readiness.

The original default timeline starts **January 2025**, horizon **60 months**. Scenario windows are anchored in **2026**. Milestones are **October 2025**, **July 2026** and **July 2027**. Their initial attention indices are respectively **0**, **2.33696969697** and **0.74666666667**. The zero first value is an artefact of these supplied assumptions, not a risk conclusion.

## Files, validation and local state

Version 1 files contain `{app, version, state}`. Original unwrapped CSPL model exports are also accepted. Validation requires complete scenario records, all six numeric effects, unique IDs, valid selected IDs/weight keys, existing link targets, true calendar dates, finite bounded coefficients and valid milestone records. Unknown fields and versions are rejected rather than silently dropped. Model files are limited to 200 KB; up to 32 scenarios, 12 milestones, 8 links per scenario and 10 tags per scenario are supported. Horizon is 6–120 months. Strength/tolerance are 0–1, weights/link gains 0–2, effects −1–1, link lags integer 0–120 and link polarities exactly ±1. These are UI/implementation bounds, not scientific conditions.

Imports and edits validate a separate candidate before installation. A parse or validation failure preserves the visible model. Imports do not overwrite browser storage. Save writes only `library.portfolio-scenario-loom.v1`; Load checks the entire saved object before installation. Failed storage writes/reads report the error. The old `cspl_*` keys are untouched. Reset restores the model without deleting saved data. JSON import does not run code, and imported labels are rendered with text nodes.

The source's automatic selection-swap claim is replaced by a transparent comparison. The user picks one selected and one unselected assumption. Both states use the same dates, coefficients, link rules and milestones. Preview does not change the current model; Apply installs the preview. Any model or selection change invalidates the preview. Empty and fully selected lists disable the swap control.

## Validation and limits

From this directory, run:

```sh
node --test tests/*.test.cjs
```

21 tests pass: 12 model tests and 9 DOM interaction tests. They cover the independently extracted source-data digest; analytic activation/lag examples; timeline-start invariance including pre-window source contributions and lags longer than the visible horizon; dormant and negative links; clipping; stress/relief/cancellation; an irrelevant-scenario invariant; tolerance effects; outside-horizon milestones; swap recomputation; strict model and original-format round trips; prototype-name IDs with default and explicit zero weights in the model, display and editor; malformed/range/reference/size inputs; source-data CSV; real search/filter/Cancel/Save/reset/import/export handlers; explicit and blocked browser saves; hostile labels; zero/all-selected states; milestone month/add/remove/pointer controls; and CSV download content. UTC and America/Los_Angeles runs return identical milestone results.

The DOM tests use the receiving repository's existing test-only jsdom dependency. No jsdom or other package is delivered to readers. Browser rendering, phone layout, live navigation and served publication remain the receiving integration review's responsibility; passing these checks does not prove usability or empirical validity.

## Placement

The current app is a bounded way to inspect overlapping scenario assumptions, so its single pictured home is **Capabilities & futures**. The local 240, 270, 280 and 290 Ends were inspected for fit; no direct source lineage or construction warrant was found that makes this app their current result. This is not a claim that an early experiment or a known mathematical method cannot belong to a foray. The judgement concerns this particular model and the work it currently performs.
