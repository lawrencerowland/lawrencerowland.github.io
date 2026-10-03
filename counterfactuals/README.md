# Counterfactual programme steering — Project Causal Lab

**Counterfactuals · Foray 471 · corrected early essai · 3 October 2026.** One discoverable home on Experiments, at `/counterfactuals/`, with two distinct modes:

- `#paths`: edit a small assumed DAG, inspect connecting paths and test Pearl's back-door criterion.
- `#policies`: fit the original four-equation delivery example and simulate policies under explicit structural and noise assumptions.

## Why this belongs to the foray

The retained August 2025 Counterfactual Programme recording in the local 471 folder shows the original policy app: matching title, staffing/automation/WIP choices, nine-column data schema and outcome distributions. Those details were checked against the pinned HTML source. This is direct lineage, rather than a topic match inferred from the word “counterfactual”. The graph mode supplies an explanatory companion for examining causal assumptions; it is not evidence that the historical recording contained that editor.

The working question for this essai is whether explicit causal assumptions help a manager compare interventions and recognise what evidence the comparison still requires. Its existing mathematics is a means of pursuing that question. A bounded construction can contribute to a foray without claiming mathematical novelty or completion of its wider End.

The repair preserves both source models while correcting their reasoning and making the limits visible. Neither mode supplies causal evidence for a real project. Graph editing does not fit the simulation; importing telemetry does not identify a causal effect. Policy comparisons sample new scenarios under supplied equations, not evidence-conditioned counterfactuals for an observed unit. This is not yet a demonstration that the approach supports a real management intervention.

The public entrance states End, Ways, Means and the unresolved question. Primary references remain below and in the app. There is no separate Library card or duplicate working copy. The programme-policy and graph bookmarks land directly on their respective modes.

## Where the arrows come from

The entrance now includes **Why this arrow?**, a worked elicitation step before the graph calculation. Its public source is [Tatlidil et al. (2025), *A comparison of methods to elicit causal structure*](https://www.frontiersin.org/journals/cognition/articles/10.3389/fcogn.2025.1544387/full), checked against the paper on 3 October 2026. Their imagined-intervention questions elicit qualitative causal structure for everyday objects. They do not estimate relation strengths or validate project-management causal claims. Their assumption for pruning direct links when indirect routes exist is not imported into this app.

Our fictional adaptation asks whether pre-rollout specialist capacity affects automation adoption, offers a mechanism and competing account, then lets a reader keep or remove **Team Capacity → Automation** in the existing three-variable example. Both choices explicitly replace the editor graph and clear conditioning. The displayed adjustment set is calculated by the existing exact graph routines; it is not a canned verdict. With the arrow, measured capacity is required by this graph's sufficient back-door test; without the arrow, the empty set passes. Unmeasured capacity, subsequent graph edits and changed endpoints are reflected rather than leaving a stale example conclusion. The current policy simulator and its data stay unchanged.

This reconnects the June 2026 CausalNex/DoWhy workflow illustration to its earlier elicitation question. That synthetic trial encoded its assumed signs; its numerical result was not evidence for the arrows. The public explanation contains no private record links, raw notes or database identifiers. A missing arrow is an assumption too, and effect estimation still needs defensible structure, consistency and overlap. This is a small extension of the Counterfactuals essai, not a merger with the separate literature enquiry into causal reasoning in project management.

## Use

Open `index.html` or serve the directory statically. Plain HTML/CSS/JS and native SVG; no build, React, Babel, CDN, plotting library, D3 or external runtime. All edits/data live in the current tab and clear on reload. CSV export downloads the current dataset. Native disclosures keep the explanations readable without JavaScript. The two modes have stable anchors and preserve state when switching. The graph supports pointer dragging, keyboard arrow-key movement, accessible arrow removal, graph reset and explicit conditioning. At small widths, the diagram and comparison table scroll inside their panels.

## Source inventory and preservation

Source repository: `lawrencerowland/Project-web-apps`. Pinned revision: **`8221f32b398d582801e639b5460aa674805f1671`**. Both complete HTML sources were read; neither has a matching TSX or other lesson-data dependency. The DAG source loaded D3 and d3-dag; the policy source loaded Plotly. These dependencies are removed, with equivalent bounded interactions and plots rendered locally. Original implementations remain recoverable from Git rather than duplicated as maintained code.

| Source path at pinned revision | SHA-256 |
|---|---|
| `web_apps/pm_causal_playground.html` | `a2e291100c6714965e04420d8b627f5d3e6198f74d13f9a206e97233d9ed4480` |
| `web_apps/counterfactual_programme_steering.html` | `2276c0445e8150ca39f13b356f22a795c3d39b7481d3403c32686786b9597022` |

| Original feature/content | Maintained destination and treatment |
|---|---|
| Six seeded PM variables, five arrows | `model.js` original `project` example, unchanged names/edges; deliberate legible layout |
| Add variable, add arrow, cycle guard, drag, Delete, reset | `#paths`, plus keyboard movement, named removal controls, remove-variable, clear and reload example |
| Cause/outcome selection and highlighted connecting routes | Exact path classification, directional path text, open/blocked status; directed paths no longer misnamed “front-door” |
| Suggested “minimal” adjustment and collider hints | Exact sufficient back-door test; all inclusion-minimal observed sets; real conditioning and observed/unobserved controls |
| Three DAG explainers / overview, background, what it does | Native disclosures; collider role is path-specific; descendants can activate colliders; identification boundaries corrected |
| Seed-42, 52-week synthetic dataset | Generator is bit-for-bit retained across all nine columns and 52 rows; downloadable CSV |
| CSV import and 14-row preview | Nine-column parser with BOM/CRLF/quoted-number/reordered-header support, validation and transactional rejection |
| Four OLS fits for R,T,L,D; mean baseline | Same regressors/equations, robust centered/scaled QR with rank rejection, displayed coefficients/ranges/residual SD |
| Baseline, A +0.15, S +2, W −2, custom sliders | Same policy choices/ranges, explicit effective control bounds; seed and draw-count controls |
| Throughput/lead-time/defects/utility KPIs | Means, baseline differences, units, extrapolation and floor counts |
| Three histograms, utility box plot, comparison bar/error chart | Native SVG histograms, 5–95%/IQR score plot, mean ± SD comparison bars and exact numerical table |
| Four policy explainer levels | Overview/one-minute combined disclosure; manager/analyst and full technical disclosures, all useful content retained with unsupported claims corrected |
| Self-test button, reset, synthetic-data restore | Non-mutating in-app checks, reset policy, restore original data; separate independent tests |
| Proposed EVPI/VOPI, DAG checks, constraints, GLMs/nonparametric work | No original implementation existed; boundaries remain explicit rather than implying delivery or a validated remedy |

The serialized original 52-row dataset has SHA-256 `f2d6de852bab7fe4ca54a84c201b862321075bb728c7994ffa134aab8d62ab7e` using `JSON.stringify(generateSynthetic(52,42))`. A retention test pins that exact digest; a live comparison executed the source generator and checked every cell.

## DAG mathematics and corrections

`graph` rejects repeated/missing endpoints, duplicate names, cycles and graphs above 12 nodes. Names are text, not markup. Causes and outcomes are distinct and treated as observed in the UI. Other variables may be explicitly unobserved.

For a chosen `(X,Y,Z)`, `dSeparated` computes ancestors of `{X,Y}∪Z`, creates the induced ancestral graph, joins each child's parents, removes edge directions and the vertices in Z, then tests connectivity. This ancestral-moral criterion is independent of the display path enumerator. `backdoor` rejects endpoints, unobserved adjustment variables and descendants of X, then checks d-separation after removing all outgoing edges from X. It implements Pearl's sufficient back-door criterion for the total effect in the stated DAG.

All eligible observed subsets are tested (at most 1,024 for 12 nodes). Supersets of already valid sets cannot be inclusion-minimal and are skipped; a final subset filter leaves all inclusion-minimal solutions. This does **not** assume that adding variables preserves validity. An empty set is a real valid set when no adjustment is needed. No set passing this sufficient criterion does not imply general non-identifiability: other identification strategies may work.

Path display enumerates the first 200 simple skeleton paths only, stating when truncated; that cap never limits the exact adjustment test. A path is open when no conditioned non-collider lies on it and every collider is conditioned or has a conditioned descendant. Collider status belongs to a path, not intrinsically to a variable. Open paths indicate d-connection, not a guaranteed nonzero numerical effect.

The original common-ancestor-minus-global-collider heuristic was neither a complete adjustment criterion nor a minimal-set algorithm. The original directed-path accumulator duplicated internal nodes, and “front-door” was used for any causal route. Those behaviours are replaced, not preserved as teaching claims. Missing confounders, wrong arrows, lack of overlap/positivity, consistency failures, cyclic systems and bidirected-edge models remain outside the guarantee. The UI represents known hidden variables explicitly.

## Policy equations and corrections

Retained regression structure:

```
R = c0 + c1 U + c2 A + c3 W + c4 S + εR
T = a0 + a1 S + a2 A + a3 U + a4 R + a5 W + εT
L = b0 + b1 W/T + εL
D = d0 + d1 U + d2 R + d3 A + d4 T + εD
score = 2 T − 0.03 L − 1.5 D
```

S is staffing in FTE; A automation fraction; W a WIP cap in items; U/R are unplanned/rework indices; T is items/week; L days; D defects/item. The original source reused U as a utility label; the maintained interface calls utility a value score to avoid that collision. Staffing/automation costs and resource constraints are absent; utility is neither money nor a validated objective.

OLS uses centered/scaled, twice-orthogonalized modified Gram-Schmidt QR. A predictor that is constant, or an orthogonalized column norm less than `sqrt(n) × 1e−8`, fails explicitly. It never replaces a zero pivot with epsilon. Residual SD uses `sqrt(RSS/(n−p))`. This rank test is numerical protection, not a causal or predictive adequacy test. Sample size alone does not establish estimability.

The parser accepts exactly nine named numeric columns, 8–5,000 complete rows and files up to 2 MB. Weeks are distinct positive integers; values must be finite with magnitude ≤1e9. It rejects blank cells, extra/missing cells, duplicate headers, malformed quotes, nonnumeric tokens and invalid domains. S,U,R,D ≥0; A in [0,1]; W ≥1; T,L >0. A parse or fit failure keeps the prior data and results. Successfully installing new data clears old results before attempting a run, so invalid simulation controls cannot leave old-model KPIs beside new-model coefficients.

Baseline fixes S,A,W at their sample means. A policy adds deltas to those means and holds the resulting controls fixed; this is not a per-row shift policy or the observed history. S is floored at 0, A bounded to [0,1], W floored at 1; requested/effective values and extrapolation outside observed ranges are visible. Missing overlap cannot be remedied by a numerical clamp.

Each draw samples independent Gaussian disturbances and U, then propagates the equations. **Noise assumptions changed:** the old hardcoded U SD `0.25` becomes the sample SD; the old L/D residual multipliers `0.2`/`0.5` are removed, so all four equations use their full fitted residual SD. These are revised simulation assumptions, not empirical validation. U is floored at 0; R,D at 0; T at 0.05; L at 0.1, and floor counts are reported. The original deterministic forward and Monte Carlo paths used inconsistent clipping; they now share one forward function. Clipping alters simulated means and may conceal poor local fits, so the explanation calls it out.

Seeded draws are paired across policies. Baseline compared with itself is exactly identical. Quantiles, histograms, standard deviations and means describe this model's simulated scenarios only; they exclude coefficient uncertainty, model uncertainty, error dependence, time dependence and regime changes. Independent errors and invariant equations are substantive assumptions. Regression fit does not establish identification, and writing `do` does not turn observational telemetry into an experiment.

The L equation is labelled an **empirical WIP-cap proxy**. Little's law relates average occupancy, flow rate and average time under its conditions, not a WIP limit to throughput by definition. W/T has units of weeks here, whereas L is days; the fitted coefficients describe a local empirical relation rather than enforcing the queueing identity. The original synthetic generator retains its numerical five-day factor unchanged.

No unit-level abduction is performed. A genuine unit counterfactual requires conditioning on that unit's evidence, changing the equation and reusing the inferred disturbances. This app samples new policy scenarios. It also does not solve a formal influence diagram, do-calculus identification, EVPI/VOPI or constrained optimisation. The source's proposed extensions were aspirations, not implemented features.

## Primary-source basis

Sources checked 3 October 2026; implementation choices and synthetic examples are ours.

| Basis | Primary source |
|---|---|
| Path blocking, colliders and conditioned descendants | [Pearl, d-Separation Without Tears](https://bayes.cs.ucla.edu/BOOK-2K/d-sep.html) |
| Causal assumptions versus association; sufficient back-door test; counterfactual distinction | [Pearl (2009), Causal inference in statistics: An overview, Definitions 1/3 and §3.4](https://ftp.cs.ucla.edu/pub/stat_ser/r350.pdf) |
| Abduction, action, prediction for evidence-conditioned counterfactuals | [Pearl, UCLA report R-484](https://ftp.cs.ucla.edu/pub/stat_ser/r484.pdf) |
| Average occupancy/flow/time identity and original stationarity conditions | [Little (1961), A Proof for the Queuing Formula](https://pubsonline.informs.org/doi/abs/10.1287/opre.9.3.383) |

## Validation and limits

Run from the website repository:

```
node --test counterfactuals/tests/*.test.cjs
```

The original 20 maintained tests cover 16 model and 4 jsdom UI cases; the arrow-elicitation tests additionally cover both judgements, changing observability and conditioning, editing away from the worked graph, preservation of policy state and reload behaviour. jsdom is the existing test-only dependency at `tools/library-apps/node_modules/jsdom`; it is not served to readers. Graph tests independently enumerate skeleton paths, check all 3,072 four-node endpoint/conditioning cases and 200 seeded six-node graphs, and cover collider descendants, hidden confounding, valid collider-containing sets, redundant ancestor sets, descendant exclusion, cycles and display truncation. Regression tests use exact analytic solutions, scaled designs and rank failures. Simulation tests use a hand-computed cascade, zero-noise/paired-draw invariants, full residual-scale checks and domain/floor boundaries. CSV and UI tests exercise round trips, hostile text, invalid/rank-deficient imports, graph edits, presets, reset and data replacement with invalid run controls.

An independent integration review additionally checked all 1,024 ordered five-node DAGs (163,840 endpoint/conditioning comparisons and 20,480 minimal-set comparisons, including an unobserved node), five adversarial regression designs and the original dataset cell-for-cell. A separate NumPy least-squares comparison covered 60 random full-rank regressions: maximum coefficient discrepancy `1.16e−14`, with residual SDs within `1e−9`. These are bounded numerical checks, not empirical validation of the causal assumptions.

Browser review on 3 October 2026 used the actual served page at 1280px and 390px. It verified common-cause adjustment, collider-descendant opening, keyboard node movement, keyboard policy execution and slider movement, unchanged selected-policy focus after comparison, labelled extrapolation, and no console errors/warnings. Phone review caught a grid minimum-width overflow; panel containment was corrected and the recheck measured document/body width 375px inside a 390px viewport. Graph and comparison content scroll internally. Final integrated-site build, navigation, publication and served-route checks belong to the receiving repository review. No human learning benefit or real-programme prediction has been demonstrated.
