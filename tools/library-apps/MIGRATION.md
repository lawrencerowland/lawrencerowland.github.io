# React collection retirement — 2 October 2026

Status: replacement sites prepared for review; do not delete the old repository until the receiving changes are merged, served pages are checked and the old paths have been verified after routing changes.

## Source and preservation boundary

Source repository: `lawrencerowland/React_proj-apps`, main commit `338469d49e7c706adc70d7b1542957371d47161b`. All 16 remaining implementations, supporting model files and tests have been carried into this directory with targeted repairs. Their original catalogue identifiers, descriptions, tags and generation provenance remain in `original-app-index.csv`; the existing MIT licence is retained. The three apps already maintained in Programme Decision Sequences and Tag Concurrence Graph stay there.

Every remote branch was inspected. All app-bearing branches are ancestors of main; the sole unique branch commit, `15756d9`, is an unmodified Codespaces/React starter, with no project model to recover. No tags, releases or open issues/PRs were returned. The two `not_yet_used` sources add no unique useful material: Olaf differs only by its former import alias, and active data maturity contains the older content plus the original-prompt explanation.

No private project examples or source prose have been published. The five generic organising themes are questions a reader can use to find an example. The two AI maps/scenarios are explicitly marked historical or speculative; their presence does not make them established methods or new theory forays.

## Canonical homes

| Example | Library subject | Canonical app |
|---|---|---|
| Move a project through a portfolio | states-and-relationships | [portfolio-state-machine](/library/apps/portfolio-state-machine/) |
| See a project from different seats | states-and-relationships | [stakeholder-analysis-dashboard](/library/apps/stakeholder-analysis-dashboard/) |
| Read a stakeholder concept schema | states-and-relationships | [stakeholder-network-graph](/library/apps/stakeholder-network-graph/) |
| Trace outputs towards benefits | states-and-relationships | [scope-benefits-tree](/library/apps/scope-benefits-tree/) |
| Olaf’s afternoon deliveries | states-and-relationships | [olaf-delivery-dashboard](/library/apps/olaf-delivery-dashboard/) |
| Find the kind of decision you are making | decisions-and-trade-offs | [decision-path-guide](/library/apps/decision-path-guide/) |
| Find a better trade-off together | decisions-and-trade-offs | [pareto_projects](/library/apps/pareto_projects/) |
| When do task delays happen together? | decisions-and-trade-offs | [copula-risk-analysis](/library/apps/copula-risk-analysis/) |
| A project review changes the next move | delivery-dynamics | [project-management-simulation](/library/apps/project-management-simulation/) |
| A software team learns and reworks | delivery-dynamics | [project-dynamics-simulator](/library/apps/project-dynamics-simulator/) |
| A day on the pool-and-gym site | delivery-dynamics | [building-site-occupancy-simulation](/library/apps/building-site-occupancy-simulation/) |
| Discuss data maturity in context | data-and-assurance | [data-maturity-combined](/library/apps/data-maturity-combined/) |
| Find your way into project controls | data-and-assurance | [project-controls-knowledge-graph](/library/apps/project-controls-knowledge-graph/) |
| Match a task to a capability | capabilities-and-futures | [capabilities-wiring-diag](/library/apps/capabilities-wiring-diag/) |
| Follow the changing project-tool landscape | capabilities-and-futures | [pm-software-evolution](/library/apps/pm-software-evolution/) |
| Imagine different project-services markets | capabilities-and-futures | [market_timeline_explorer](/library/apps/market_timeline_explorer/) |

## Routing and retirement sequence

1. Merge and publish the Library source, compiled apps, pictured subject pages and compatibility paths in the main website.
2. Publish the Tag Concurrence Graph source-link correction, preserving its frozen 19-app snapshot. Programme Decision Sequences already uses maintained app routes; its historical source commit references remain historical.
3. Verify every canonical app and the downloadable NetLogo model on the served site. Remove the controls-graph duplicate listing only after its additional exploration controls are preserved in the Library version.
4. Delete `React_proj-apps` only after those checks. The main website then owns the old `/React_proj-apps/` namespace. Verify its 19 old app routes again on the public host; a locally successful redirect is not proof of GitHub's eventual routing.

The main website retains small old-path forwards, a compatible CSV with canonical URLs, earlier thumbnails and the direct NetLogo download. These are compatibility assets, not a second working app collection. Query parameters and fragments survive the forwards. Ordinary Library and combined-catalogue browsing no longer shows a React collection; Gap Map reads the maintained Library metadata directly. Frozen tag-map data remains a dated snapshot.

Build boilerplate, the unused alias copies, old duplicate deployment output and empty starter branch are not active Library material. Source and tests remain maintainable here, so the retired repository need not be retained as a safety copy.

## Feature review and corrections

The sections below record useful features, repairs and checks. Their model limitations remain visible in the apps themselves. Test results demonstrate the stated implementation, not real-world forecasting accuracy, adoption or organisational benefit.

# People, portfolio and project-control apps: retirement review


## Placement

All five work best as named **Library model views**, with cross-links to related subjects. None currently implements a particular theory-foray construction strongly enough to justify using a theory foray as its primary home.

| Existing app | Suggested named Library home | Purpose retained |
|---|---|---|
| `portfolio-state-machine` | **Portfolio lifecycle and uncertainty** | State transitions and sampling of terminal portfolio outcomes. |
| `stakeholder-analysis-dashboard` | **Stakeholder evidence and perspectives** | Complementary stakeholder-manager and business-case-director views of one fictional example. |
| `stakeholder-network-graph` | **Stakeholder concept schema** | A partial relationship model, including visibly unconnected concepts. |
| `scope-benefits-tree` | **Scope, outcomes and benefit assumptions** | Dual breakdown trees and conditional contribution links between them. |
| `project-controls-knowledge-graph` | **From project management to project controls** | Browsable knowledge graph plus an explicitly separate teaching route. |


## Portfolio state machine

Preserved: adding projects, all six states, the eight directed transitions and original fixed probabilities, individual project listing, counts by state, instruction disclosure, original SVG state diagram, manual transitions, and 100-run simulation output. Simulation still starts from each project's current state, samples each project independently, stops at completed/cancelled states and leaves the source portfolio unchanged.

Repairs:
- Case-insensitive duplicate names are rejected with visible feedback, eliminating ambiguous selection and React key collisions. A rejected entry stays in the input for correction.
- The transition form offers only valid next states, updates after every move and disables terminal-state transitions. It no longer silently offers forbidden moves.
- Transitions copy project histories before changing React state, avoiding mutation of the previous state object.
- Empty portfolios cannot run a simulation; portfolio edits clear now-stale simulation results.
- Simulation totals explicitly count outcomes across all 100 runs, with mean projects per run also shown. A total of 100 is no longer liable to be mistaken for 100 projects in a one-project portfolio.
- All controls have labels, disclosures expose expanded state, results/actions have status feedback and the two-column form stacks on narrow screens.
- The SVG now has a complete textual probability alternative; instructions explain terminal states and every probability.

Incorrect/incomplete implications corrected: simulation probabilities are invented teaching assumptions, not calibrated probabilities; results are not a project forecast. No model of duration, budget, shared resources or correlated risks is claimed. Browser state is temporary and reload clears it.

Meaningful checks: UI valid-transition progression through proposal and cancellation; terminal disabling; duplicate rejection and retained input; trial-result invalidation; illegal-transition rejection; exact sampler boundaries through all four delivery gates; source-state/history immutability; conservation of project count; terminal-state preservation. Six tests.

## Stakeholder analysis dashboard

Preserved: all five example stakeholders with their original scores, all five weighted relationships, radial network, alignment–influence scatter, sentiment bar chart, both role views, five objective rows, cross-field filtering and all three sort keys.

Repairs:
- Made the fictional transport-project scenario and invented scores explicit.
- The scatter's bubble area is driven by absolute sentiment strength on a stated 0–1 scale, rather than applying an unexplained area scale directly to signed sentiment. Tooltip includes stakeholder name, alignment, influence and signed sentiment; sign remains available through colour and text.
- Added the full chart-data table and readable weighted relationship list, retaining the charts while providing accessible nonvisual equivalents.
- Objective sentiment now displays the signed numeric score alongside each magnitude bar, so red/green colour is not the only sign indicator.
- Added named controls, active-role state, result count, empty-filter message and table/tooltip styling.

Incorrect/incomplete implications corrected: no survey, automated sentiment inference or assessment of real organisations is claimed. The scales and invented relationship weights are explained.

Meaningful checks: retention of all three chart headings, signed fallback data and fiction boundary; switching roles; filtering by opinion; sorting by stakeholder; and no-result feedback. Two tests. Graph/chart DOM is not a substitute for a browser rendering check.

## Stakeholder network graph

Preserved: every one of the 23 original concepts and 11 connections, all original node identifiers and relationship labels, isolated nodes, force layout, dragging, zoom, node/edge hover labels, original auto-colour data and instructions.

Repairs:
- Stable copied graph data prevents an instruction toggle or concept selection from rebuilding the mutable force-graph dataset and resetting layout.
- Force-library mutation is confined to private copies; the source schema is exported intact for verification.
- Added responsive container sizing, named zoom/fit/reset controls, direction arrows and once-per-layout automatic fitting that does not continuously override manual camera choices.
- Added keyboard-operable concept selection and a readable relationship inspector. Every original connection can be reached through its endpoint concepts, including incoming connections.
- Missing edge labels are explicitly “relationship type not specified”; isolated nodes are explicitly gaps, not fabricated relationships.

Incorrect/incomplete implications corrected: this is a draft **concept schema**, not measured stakeholder or social-network data. Geometry/colour does not establish influence, support or social distance.

Meaningful checks: exact concept/connection preservation, isolated concept handling, readable incoming/outgoing relationship content, stable dataset identity across instruction/selection changes, fresh copied layout on reset, preserved source endpoints, and camera-control calls. Four tests; force rendering is mocked in these interaction tests.

## Scope-to-benefits tree

Preserved: all 14 original nodes, all 16 original edges (12 group-membership links, four animated contribution links), both green and blue trees, the East West Rail scenario name, all source labels, and original pan/zoom/fit controls.

Repairs:
- Connected ReactFlow's real node-change state handler, so node dragging is retained instead of being lost in a controlled-but-unhandled node array. Reset restores original positions.
- Disabled unsupported connection-creation gestures; this viewer does not pretend to author persistent new edges.
- Direction arrows and edge text distinguish grouping (“contains”) from conditional contribution (“may contribute to”).
- Added complete textual paths for both trees and a readable explanation for each of the four contribution hypotheses.
- Added scenario, grouping/causality, control and limitation guidance.

Incorrect/incomplete implications corrected: this is not approved East West Rail scope, an approved business case or evidence of realised benefits. The original timetable→jobs and timetable→emissions links now state the assumptions required; they no longer stand as unqualified causal claims. Infrastructure alone cannot guarantee travel-time reductions. No numerical benefit model is claimed.

Meaningful checks: exact node/edge preservation and endpoint validity; distinction of all four contribution edges; real ReactFlow reducer applies a move and reset; unsupported connection creation is disabled; textual tree and hypothesis coverage. Three tests. The rendering surface is mocked but the node-change reducer is real.

## Project controls knowledge graph

Preserved: all 56 concepts, six categories and 54 stored relationships; search plus category filtering; concept counts and empty state; browser list and typed incoming/outgoing relationships; graph selection and keyboard node activation; drag/pin, pan, modifier-wheel zoom, zoom buttons, fit and reset; the complete eight-step PM→PC route with previous/next/step selection; the orange teaching overlay distinct from the actual grey knowledge-graph edges; About dialog, Escape and focus return.

Repairs:
- Following a relationship to a concept hidden by a search/category filter now reveals the destination and restores its necessary category, clearing search when required. Previously the newly selected hidden node could be immediately cleared.
- About traps Tab/Shift-Tab within the dialog and still restores opener focus after Escape or close.
- ISO 21500 description now identifies the 2021 context/concepts standard and distinguishes ISO 21502:2020 project-management guidance.
- PMBOK is labelled a guide; its edge to the project-management plan now says “informs”, replacing the overstrong “governs”.
- Variance-analysis→change-control predicate now says “may inform”, replacing the unconditional “triggers”. All endpoints remain unchanged.
- Broadened cost-control description beyond unauthorised baseline changes, clarified authorised change decisions, distinguished the illustrative Change Control Manager role from organisational change, stated forecast uncertainty and continuous lessons learning.
- About now marks the complete map as a curated teaching model with context-dependent role accountabilities, not a complete ontology, mandated governance structure or one-pass life cycle.

Primary sources checked for the standards correction:
- ISO 21500:2021 official catalogue: https://www.iso.org/standard/75704.html
- ISO 21502:2020 official catalogue: https://www.iso.org/standard/74947.html
- PMI PMBOK Guide: https://www.pmi.org/standards/pmbok

Meaningful checks: existing six regressions retained (filters, composed search, selection, full teaching route, dialog Escape/focus return, camera controls), plus hidden-relationship reveal and modal keyboard trap. Eight tests. D3 rendering is mocked in the unit suite; the graphical controls, real/teaching line separation and focus handling need the root's actual-browser pass.

## Validation and changed files

Targeted test run completed successfully: **5 files, 22 tests passed** using the repository's Vitest configuration with root overridden to the checkout. `git diff --check` for the five directories is clean. That initial successful run preceded the root's dependency-audit update; a subsequent post-update result should be appended below. No claim of browser visual QA, deployment, human adoption or production data validity is made by these unit results.

Changed files, all relative to the source checkout:

- `apps/portfolio-state-machine/src/App.css`
- `apps/portfolio-state-machine/src/App.jsx`
- `apps/portfolio-state-machine/src/App.test.jsx`
- `apps/portfolio-state-machine/src/components/AddProject.jsx`
- `apps/portfolio-state-machine/src/components/Instructions.jsx`
- `apps/portfolio-state-machine/src/components/SimulationResults.jsx`
- `apps/portfolio-state-machine/src/components/StateMachineDiagram.jsx`
- `apps/portfolio-state-machine/src/components/TransitionProject.jsx`
- `apps/portfolio-state-machine/src/portfolioLogic.js`
- `apps/stakeholder-analysis-dashboard/src/App.css`
- `apps/stakeholder-analysis-dashboard/src/App.jsx`
- `apps/stakeholder-analysis-dashboard/src/App.test.jsx`
- `apps/stakeholder-network-graph/src/App.css`
- `apps/stakeholder-network-graph/src/App.jsx`
- `apps/stakeholder-network-graph/src/App.test.jsx`
- `apps/stakeholder-network-graph/src/Instructions.jsx`
- `apps/scope-benefits-tree/src/App.css`
- `apps/scope-benefits-tree/src/App.jsx`
- `apps/scope-benefits-tree/src/App.test.jsx`
- `apps/project-controls-knowledge-graph/src/App.jsx`
- `apps/project-controls-knowledge-graph/src/App.test.jsx`

Post-audit validation: all **23 tests in five files pass** under Vitest 5.0.3 and Node 24 (15:45 local tool run). Network auto-fit now also has a regression proving it runs once per layout reset and leaves later manual camera choices alone.

# Dynamics, inference, risk and occupancy preservation review


## Project management simulation

Suggested home: Library / project uncertainty and active inference, with a contextual link from the active-inference foray. Present as **a scripted project review walkthrough inspired by active inference**.

Preserved all five reviews, authored feature/time/uncertainty values, recommendations, insight toggle, next-step/reset/autoplay/speed controls, score history, feature-estimate error bars and progress/resource comparison. Replaced “free energy” as a measured output with “illustrative uncertainty score”, explicitly distinguished authored ranges from confidence intervals and formal variational free energy. The underlying authored numbers remain intact.

Corrections: controlled speed slider now moves; autoplay stops and disables at the final review; initial setup now adds the missing history point; final state truthfully describes the original 91% mean feature progress rather than claiming completion. The explanation distinguishes formal variational free energy (complexity minus accuracy, upper bound on surprise) and expected-free-energy action selection from this story, with primary-paper links.

Validation: two meaningful tests cover resource conservation, range/history invariants, final 91%, controlled speed, full autoplay and reset. All passed.

Primary sources read and linked: [Reinforcement Learning or Active Inference?](https://www.fil.ion.ucl.ac.uk/spm/doc/papers/Reinforcement_Learning_or_Active_Inference.pdf) and [Active inference and epistemic value](https://www.fil.ion.ucl.ac.uk/~karl/Active%20inference%20and%20epistemic%20value.pdf).

## Project dynamics simulator

Suggested home: Library / project dynamics and feedback, related to the project simulations/decisions material. Present as **an illustrative stochastic weekly model**.

Preserved all six effect switches, start/pause/step/reset/speed, project metrics, progress/scope, team/quality and velocity/capability plots, event history, and the original weekly rules. Added a compact account of exactly how progress, reviews, feedback, morale and next-week velocity interact. Explicitly marks the coefficients and randomness as invented; reset retains selected switches.

Corrections: replaced the stale-state repeating interval with a current-state one-shot timer; live effect changes now affect subsequent weeks. Removed per-step numeric rounding that erased 0.01 weekly learning; values are formatted at presentation. Bounds quality and morale to 0–100 (morale is bounded before scaling velocity); completion is stable and prevents further controls/repeated events. Scope additions are points, not falsely percentages. Labels no longer equate harmful effects with negative feedback or beneficial effects with positive feedback. Capability axis can expand above 2.

Validation: three tests cover learning accumulation, percentage bounds, completion idempotence, successive autoplay ticks, live switch changes, pause and reset. Passed; rerun after the final morale-bound adjustment also passed.

## Copula risk analysis

Suggested home: Library / risk, uncertainty and dependence. Present as **a calculated Gaussian-copula teaching model with invented marginals**.

Preserved introduction, copula, marginal, joint and stress views; dependence slider; scatterplots/histograms; tail toggle; schedule and cost outputs. Added working sample-size selector (500/2,000/5,000), deterministic initial seed and New sample control. Reusing the seed while changing correlation helps separate changed dependence from changed random input.

Corrections:

- Fixed inverse-normal sign reversal that previously made increasing uniform foundation quantiles decrease the delay, reversing intended dependence.
- Preserved and accurately described the original marginals: capped lognormal foundation (30-day cap) and bounded power electrical (0–4 days). Removed fabricated historical-data provenance and false electrical long-tail description.
- Selects the intersection of underlying upper deciles before capping creates ties. Reports its observed count/frequency. Does not fabricate severe scenarios when the intersection is empty or incorrectly label the intersection as 10% probability.
- Retains original sample probability mass and normalizes conditional means correctly; removed the erroneous 0.9 subset weight total.
- Replaced the inconsistent max-of-means/0.7 rule with a stated two-sequential-task assumption: incremental delay = foundation + electrical; cost = $5k/day foundation + $3k/day electrical. Clearly explains that additive unconditional means should barely change with dependence although joint-tail frequency changes.
- Histograms now include the capped maximum endpoint, use the actual electrical range and preserve probability mass.
- Clarifies latent normal correlation versus transformed Pearson correlation, finite samples, dependence versus causation, ties, and Gaussian zero asymptotic tail dependence.

Validation: original render test plus seven model tests pass, checking quantile signs, transformed dependence sign, empirical independent tail frequency / stronger positive-dependence co-occurrence, reproducible common draws, normalized conditional impact, empty-tail behavior, capped ties and histogram mass. The empirical tests use a fixed 20,000-draw sample.

Primary references read and linked: [statsmodels Gaussian copula definition](https://www.statsmodels.org/stable/generated/statsmodels.distributions.copula.api.GaussianCopula.html), [Gaussian tail dependence](https://www.statsmodels.org/dev/generated/statsmodels.distributions.copula.api.GaussianCopula.dependence_tail.html).

## Building-site occupancy model and wrapper

Suggested home: Library / agent models and construction-site occupancy. Preserve **both the React explanatory/download page and the NetLogo source**. The application page itself is an explainer/download entrance; the actual simulation is the supplied NetLogo model.

Preserved pool/gym/break/storage/walkway layout, worker roles, stochastic deliveries, guard, occupancy series and downloadable `.nlogo`. Repaired the download into a complete valid model with view, worker slider, setup/go, clock/onsite/vehicle monitors, occupancy plot, shapes, version and model-format sections. Corrected undeclared patch state, nonexistent slider-introspection primitive, uninitialized areas, absent departures/guard schedule and trapping/random-walk movement. Agents now take one neighboring step toward destinations and physically return to the entrance on departure; guards patrol walkways. The full day starts at midnight, crew arrives 06:00, lunch 12:00, return 13:00, departures start 17:00, guard returns 21:00 and the model stops after 1,440 ticks. Deliveries spawn 06:00–16:30 with per-minute probability 1/120 and wait 30–60 minutes at their destination. Describes abstract geometry and absence of collisions, congestion, capacity, productivity and safety model; occupancy counts workers, not vehicles. Removes fabricated funding/reference placeholders.

Validation:

- Download/instructions/measurement-boundary React test passed.
- Compiled successfully with the official current `https://www.netlogoweb.org/tortoise-compiler.js` and executed using `https://www.netlogoweb.org/tortoise-engine.min.js`, fetched on 2 October 2026.
- Runtime self-reported metadata: `{"isApplet":false,"isWeb":true,"behaviorSpaceName":"","behaviorSpaceRun":0,"version":"1.0"}`. This is the runtime's generic metadata, not a precise release identifier; the asset hashes below identify the exact validation tools.
- Compiler SHA-256: `e38d78940830f678683f712fa75afa1c7a486ab64f0105a15e95817ce61fa85f`.
- Engine SHA-256: `d902ab47a0ff192a3a07792abb61b1cb3639f2d1ffb10bf0ccdb06e4348871d2`.
- Nine full-day runs passed: worker count 0/8/100 × seeds 1/42/97. Assertions check guard at start, crew arrival, arrival at work zones, lunch arrival, afternoon return, crew and delivery clearance, night guard, each series length 1,440, count bounds and terminal stop. Reproducible `verify-model.cjs` retained beside the model. External compiler/runtime files remain temporary validation tools, not bundled assets.
- This proves model compilation/execution and schedule invariants in NetLogo Web's engine, not real-site validity. Desktop NetLogo and the interactive Web upload UI were not separately exercised.

Read official [model-format documentation](https://github.com/NetLogo/NetLogo/wiki/Pre%E2%80%907.0.0-File-Format-%28.nlogo%29-and-Widget-Format), [NetLogo Web loading guidance](https://www.netlogoweb.org/docs/faq). The model remains NetLogo 6.4.0 `.nlogo` format; current Web successfully parses it.

## Combined verification


Root still owns destination context/routes, shared visual shell, all-app build, browser/mobile verification, publication, redirection and retirement. No claim is made here that migration or deployment is complete.

## Migrated browser QA and images (2 October, final local pass)


All eight app/device journeys passed after the root rebuild:

- Project management: next step, insight visibility, keyboard-controlled speed, autoplay to 5/5 and 91%, completion disable and reset.
- Project dynamics: all six switches, keyboard speed, successive autoplay weeks, pause, live learning switch, manual step and reset.
- Copula: sample size, all views, keyboard dependence endpoints, empty upper-decile intersection at negative dependence, nonempty intersection at positive dependence, new sample/seed.
- Occupancy: actual browser download on desktop and mobile, byte-identical to the preserved canonical source. SHA-256 `de9b14c309d860b7476d59d8c8a261f8e595919bd74956d82378920514e1be7f`.

Found and fixed in these app sources: dynamics controls now wrap on mobile; management feature chart labels are rotated and both percentage series share one axis; copula vertical axis labels are centered within their chart; occupancy introduction omits an irrelevant implementation reference. Root supplied missing dark button colors and intended desktop responsive utility classes, and removed overflow clipping. Final pass found no app content extending past the viewport, no page exceptions, and no app asset/request failures. The single browser resource warning was confirmed to be the local root `/favicon.ico` returning 404; it is separate from app functionality.


Four representative screenshots saved and visually inspected, all **960×600 JPEG**:

- `images/library-apps/project-management-simulation.jpg`: third review, decision and illustrative score history.
- `images/library-apps/project-dynamics-simulator.jpg`: eight weeks, populated metrics/plots, effects and event log.
- `images/library-apps/copula-risk-analysis.jpg`: default 0.70 copula structure, sample cloud, dependence control and explanation.
- `images/library-apps/building-site-occupancy-simulation.jpg`: working download, daily schedule and model notes.

These are browser/model checks and useful-state images; they do not establish empirical validation or deployment.

# React methods and themes review — 2 October 2026


## Feature and check matrix

| App | Useful features preserved | Corrections/improvements | Meaningful automated checks |
| --- | --- | --- | --- |
| pareto_projects | 100 strategy points, original/higher curves, reveal and explanation journey, instructions | Fixed bogus SVG coordinate overlay with a real chart-space improvement segment; fixed common axes; retain baseline when revealing; keyboard slider and numeric readout; reset; toy assumptions and vertical-vs-perpendicular distinction | Select25 => original50/improved70; reveal explanation; reset. Chart component mocked, so live ChartJS painting still requires browser check. |
| market_timeline_explorer | All 23 quarters from2025Q2 through2030Q4, four actor sections, summaries, six transitions, direct and sequential navigation | Explicit imagined scenario status for ALL dates, real names and AGI/ASI assumptions; labelled previous/next controls; selected-quarter state; local focus/readability CSS | Boundaries disabled; transition at2026Q4; final2030Q4 transition; selected state; explicit scenario framing. |
| decision-path-guide | Statement/complex branching, optional aspects/properties, cancellation/support/process/date, graph, footnotes, summary/restart | Complex property route explicit; supporting-party choices consistent with footnote excluding decision maker; labelled text/date inputs, empty-answer guard, restart during journey, clear session/decision-status scope | Complete statement journey through context/object/cancellation/support/process/effective date and restart; complex properties all traversed before participants/cancellation. |
| capabilities-wiring-diag | Three layers, six original profiles, category descriptions, model colours/filter, exploration and explanation | Connections retain same profile identity (previously could switch model via intermediate); filter constrains associations; keyboard/native cards and pinned touch state; readable details; native modal focus/Escape support; explicit historical unverified classification; invented Gemini1.5Reasoning recast as conceptual profile; corrected chain-of-thought/long-context/memory conceptual overclaims | No switched-profile false path; selected filter restrictions; keyboard description; selection/filter states; information-dialog open/close. |
| pm-software-evolution | All24 entries, six categories, five eras,23 links, node detail and linked browsing, canvas timeline, filters | Four source-linked date/name corrections; years stop2025 and centered in correct cells; keyboard nodes; clearer proposed-link status and interpretive timeline limits; horizontal readable timeline plus full visible-entry list; clear hidden selection on filter; selecting out-of-filter related node restores all; resize redraw | Category filtering; keyboard select; source link; no2026 label; clear stale details; cross-category linked selection restores visible node. Canvas mocked. |
| olaf-delivery-dashboard | Four counts/targets, three individually checked staff, instructions/problem/original prompt, completion message | Undo per count bounded at0; reset; status and pressed semantics; fictional/session boundary; completion no longer presented as actual site safety authorization | All delivery targets AND every individual required; undo revokes completion; reset clears staff/counts and disables negative correction. |
| data-maturity-combined | All30 full questions/scoring, eight capabilities,12 branches, three levels, graph/table/filter/expansion/detail/help/original prompt | Graph membership derives from each question's own capability and branch, soQ19/Q21/Q27 match table; cross-cutting branches supported; unique expansion keys; independent keyboard info buttons; readable details and close/Escape; state semantics; unvalidated ordinal-score/question-order boundary; no implied answer-saving/scoring; local responsive layout |Q19 underDLS,Q21 underDGS,Q27 underDIS; details; all30 table rows; Individual filter10; clear; original prompt preserved. |

Automated result: **7 test files / 10 tests passed** under Node24 / Vitest5.0.3, on2October2026 at15:45 local. `git diff --check` passed before the last CSS-only connector addition. No human-user testing, deployment or adoption claim.

## Unused-source reconciliation

Compared `not_yet_used/olaf-delivery-dashboard.tsx` to the baseline active implementation: only alias import differs; all original features/explanations already present. Compared `not_yet_used/data-maturity-combined.tsx`: the active version includes all older content and adds Original Prompt. No unique useful content was absent.

## Suggested Library homes

- Decisions and trade-offs: decision guide, Pareto.
- Project states and relationships / practical tools: Olaf checklist.
- Data, evidence and assurance: data maturity.
- Capabilities and AI futures: capability map (historical unverified sketch), software evolution (interpretive historical map), market timeline (hypothetical scenario).

No verified existing named foray provides a better current home for these seven. AI capability and market materials are speculative in subject, but do not justify inventing a new foray merely to house them; use the Library theme with explicit status.

## Public primary sources used for selected software corrections

- Jira Agile renaming2013: https://www.atlassian.com/blog/archives/simplify%24
- Project Online paired with Project Server2013: https://learn.microsoft.com/en-us/project/what-s-new-for-it-pros-in-project-server-2013
- dapulse/monday first product2014: https://monday.com/p/about/
- ClickUp founding/beta2017: https://clickup.com/press/100-million-series-b

All four URLs are linked from the relevant in-app detail cards. Remaining trend dates/causal relationships are qualified as interpretation; not comprehensively verified history. No private case material exported.

## Consolidated controls-graph duplicate

The Project Apps TSX version has the same 56 concept identities, but supplied predicate filters, heuristic weighted-degree sizing/thresholds, directed reachability and an Explain Traversal dialogue absent from the former React implementation. Those useful controls are now retained in the Library version and covered by eight additional semantic checks. Traversal uses visible filtered relationships, weighted degree is labelled a heuristic rather than importance, and the extra career “transitions” edge stays out of the knowledge graph: the PM-to-controls teaching route remains a distinct orange overlay. Source provenance and the superseded TSX hash are recorded in the coordinated Project Apps migration PR.

## Final receiving-site checks

55 model/interaction tests pass across 18 files. All 16 apps have desktop and 390px browser journeys, with no page exceptions or document overflow. The site-occupancy model compiled with the official NetLogo Web compiler and completed nine checked full-day runs; downloaded bytes match the maintained model. The combined catalogue checks 35 original repository/name identities and 272 saved selectors across four source states. Forty legacy entry journeys preserve query and fragment state, including the three apps moved earlier. The repository remains pending until the receiving site is merged and public checks complete.

Independent receiving-site review found and corrected two small guidance issues: the copula frame now describes the fixed marginal distributions correctly, and the compatible CSV describes the stakeholder app as a concept schema. The actual Gap Map loader retains all 16 canonical URLs and reciprocal capability links without fetching the retiring repository. Original catalogue metadata and licence were checked byte-for-byte.


## 3 October 2026 — Solway ontology move and contracts family

Digital Construction ontology has its sole primary home in Solway as **Ontology before work**, an early essai connecting vocabulary, project assertions and contextual roles to the foray’s explainable-work question. All three cases, source files, model, controls and exports are preserved there. The old Library folder now contains only a bookmark forward. Its model regression tests and original fixture move to Solway with the app.

Three remaining general apps become two pictured Decisions & trade-offs entries: **Explore a project agreement** (separate NEC and bargaining lessons) and **Rehearse a regulatory negotiation**. Source count 20→17; maintained Library apps 44−1+2=45; peer cards 67. No new subject or foray was needed for the finite commercial exercises. Contract Portfolio Board remains retained. Exact sources, changes and verification are documented beside each model; source commit 676cbc7 and CSV preservation are pinned in phase_four of the migration fixture.

Merge Solway PR39 first, then this website change, then the Project-web-apps retirement; verify each receiving deployment before switching its source routes. Model tests are bounded evidence, separate from legal advice, regulator behaviour or human-use validation.


## 3 October 2026 — phase5 cause, feedback and changing plans

Four former source identities receive three homes. **Counterfactual programme steering / Project Causal Lab** moves to `/counterfactuals/` as a corrected early essai in the existing local Counterfactuals foray (471), discovered through one pictured Experiments entrance. The retained August 2025 recording depicts its original policy app, so this placement rests on direct provenance. The distinct graph/adjustment mode supports explanation; it does not generate the policy model.

**See when feedback settles or grows** and **Trace dependencies across phases and time** remain Library examples under Delivery dynamics & feedback. Library apps45→47 and flat peer entries67→69; Experiments17→18; old catalogue17→13. No new Library subject is added. The feedback model can support Projects as behaviour loops (340), but does not yet address its schedule, cadences and nonlinearities. The Atlas can support Four project management jobs (280), but currently displays supplied dependencies rather than discovering missing business relationships. Those potential contributions do not change their present primary homes. The ontology relocation remains in Solway and Contract Portfolio Board remains retained.

Source revision8221f32 and exact source hashes, before/after CSV and destination identities are pinned in phase_five of the migration fixture. Numerical/model limits and retention are documented alongside each receiving app. Source retirement is a companion PR to merge only after these receiving routes publish and are verified.
