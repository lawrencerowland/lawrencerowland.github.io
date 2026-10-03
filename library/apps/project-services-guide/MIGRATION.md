# Project service design guide — migration record

Reviewed 3 October 2026. One home in **Capabilities & futures**. This guide asks what a service could produce and how a bounded trial could be judged. The options are editorial proposals, not a supplier catalogue or claims of current delivery.

## Sources and route map

Both source HTML files were read in full at Project-web-apps revision `459efda24b673a1e50b33cfd4347ffa5928817d9`. The hashes below pin the reviewed inputs; coordinated retirement replaces their old HTML implementations with forwards.

| Original identity | SHA-256 of original bytes | Destination |
|---|---|---|
| `web_apps/consulting_catalogue.html` (catalogue ID 22) | `131b45f68ed390abaa94c391aee450ddab2f065f5cb83331fd98e489304bb013` | `/library/apps/project-services-guide/#offers` |
| `web_apps/project_use_case_tree.html` (catalogue ID 18) | `2a9725bf7acda8af1b12eb035232d8d52aa4f51405572fb18dd4cb00e898ffd1` | `/library/apps/project-services-guide/#questions` |

Pinned originals: [catalogue](https://github.com/lawrencerowland/Project-web-apps/blob/459efda24b673a1e50b33cfd4347ffa5928817d9/web_apps/consulting_catalogue.html), [tree](https://github.com/lawrencerowland/Project-web-apps/blob/459efda24b673a1e50b33cfd4347ffa5928817d9/web_apps/project_use_case_tree.html). Source-repository retirement and redirects are managed by the parent integration task; this record does not independently establish their publication.

The source catalogue has seven typical and eight AI-enabled offerings. The tree has eight headings with 4, 3, 3, 3, 3, 3, 2 and 2 ideas, totalling 23. All 15 options, eight headings and 23 idea identities have a maintained equivalent. Editorial reframing is explicit below.

## Boundary with neighbouring examples

The existing Service Trident HTML, model and controller were reviewed. It selects one perceived need, supplies an authored lead-service mapping and allows intervention-level choices. The existing P3M capability review page, review note and supplied inventory were inspected: it assesses current/future states within 110 authored capability leaves. Neither already provides an offer → artefact → measure discussion with scoped trial questions. This guide therefore combines the two assigned sources into a distinct home. It links to the neighbours, but does not copy their assessments or treat service offers as P3M leaves.

## Interaction and asset disposition

| Source feature or asset | Disposition and reason |
|---|---|
| Catalogue title, description, artefacts and metrics for all 15 records | Retained as offer, artefact and measure with a scope boundary. Measures are definitions to agree, with no numeric performance promises. |
| Typical / AI-enabled buttons | Retained as filter choices “Facilitated & analytical” and “Automation options”, plus All and Questions. No implication that one family is newer, better or currently delivered. |
| Search across title and description | Retained and extended to all offer/question content, artefacts, measures, scope and question-group headings. Multiple terms intersect, then combine with family filter. Visible result counts and no-match state added. |
| Clickable non-keyboard catalogue cards and modal | Replaced by native details/summary. Content remains next to its heading, keyboard-operable and readable without JavaScript; no focus trap or overlay is needed. |
| Tree's eight nested expandable headings | Preserved with stable group anchors and 23 native nested question disclosures. Content is static HTML and independent of script loading. |
| Expand-all plus sibling auto-collapse | Repaired. The original auto-collapse handlers counteracted Expand all. Separate Expand visible / Collapse visible controls now leave all visible disclosures in the requested state. Independent manual expansion is retained. |
| Tree had no search | Added shared search. Matching parent groups open; clearing the filter restores prior group expansion. Explicit bulk expansion changes the state that will be restored. |
| Cross-source connections | Added authored question→service links, described as connections rather than validated mappings. Each question and option also has its own shareable anchor. Hash navigation clears restrictive filters, reveals ancestors and focuses the target without removing summary keyboard access. |
| Original index return links | Replaced with Library and Capabilities & futures returns. No duplicate discoverable app grouping is created. |
| Catalogue inline styles/script | Rewritten as small local CSS/JS; no modal code retained. All information remains available. |
| Tree remote Tailwind CDN | Retired. No local source image/font/data attachment exists in either HTML; Tailwind was the sole runtime dependency. |
| Original diagrams and external assets | Neither source contained a picture or local supporting file. New `thumbnail.svg` supplies the offer→artefact→measure illustration and is also the hero. No source imagery was deleted. |
| Save/import/export/persistence | Neither source implemented these features. No data entry, storage, upload or silent save is introduced. |
| Print / no script | Static details remain readable without JS; print CSS reveals all unfiltered detail content. JS-only controls are hidden without scripting. |

## Catalogue item and claim disposition

All destination fragments in this section are under `/library/apps/project-services-guide/`.

| Source offering | Destination | Retained structure and changed claim/measure |
|---|---|---|
| Strategic Alignment Workshop | `#strategic-alignment` | Strategy map, objective hierarchy and alignment scorecard retained. “Executive buy-in index” and “goal coherence %” become traceable objective/owner counts and recorded disagreements; no universal scale is implied. |
| Comprehensive Project Chartering | `#project-chartering` | Charter, RACI/responsibility matrix and governance retained; assumptions added. Scope-clarity score and unqualified baseline variance become unresolved mandate questions and later ambiguity-related changes. |
| PMO Establishment & Maturity Uplift | `#pmo-design` | Handbook, playbooks, measures and roadmap retained. Removed implied OPM3 maturity measurement and any promised uplift. Cadence adherence defined with usefulness review; the capability worksheet is signposted separately. |
| Integrated Master Scheduling | `#master-scheduling` | Integrated schedule, scenarios, resources and float retained. Primavera/MSP specificity removed. Forecast error and over-allocation hours replace undefined schedule-risk index and utilisation-only success. |
| Risk & Issue Management Framework | `#risk-framework` | Register, mitigation and optional simulation retained. Expected monetary value retained conditionally with probability/cost assumptions; risk-burn rate replaced with action follow-through and explicit score limits. |
| Change-Management & Comms Plan | `#change-and-comms` | Stakeholders, readiness, communications and feedback retained. Removed implicit ADKAR product framing. Adoption is successful task completion with denominator/support effort; resistance incidents are not a success proxy. |
| Benefits Realisation Tracking | `#benefits-tracking` | Map, measure catalogue and dashboard retained. Replace generic realised-value percentage with unit/baseline/target/owner, lag and separate contribution assumptions. |
| AI-Augmented Workflow Orchestration | `#workflow-orchestration` | Workflow graph, policies, draft tickets/changes and logs retained. GitHub/JIRA product assumptions and automatic external action claim removed. Lead time is request→approved action, paired with errors and reviewer effort; coverage is insufficient. |
| Real-Time Digital-Twin Dashboards | `#digital-twin` | Model, feed, anomaly log and snapshots retained as a trial. “Real-time” and model validity are not assumed. MAE and alert→action latency defined with unit/horizon, misses and false alarms. |
| Generative Scenario Labs | `#scenario-lab` | Scenario set, risk–utility comparison and briefs retained. GPT-4o-specific capability, generated scoring authority and “ROI at confidence x” removed. Feasible alternatives and review effort replace undefined diversity/ROI assertions. |
| Autonomous Backlog Grooming | `#backlog-review` | Clusters, work candidates, goals and rationale retained. Nightly autonomous triage becomes owner-reviewed assistance. Staleness has an age threshold and denominator; accepted suggestions, omissions and review time replace points→goal fit. |
| Knowledge-Graph Commons | `#knowledge-commons` | Graph, vocabulary/ontology, queries and source links retained. Automatic extraction presented as something to validate. Precision at five and supported-answer time are defined against an agreed query set. |
| Continuous Compliance Copilot | `#compliance-review` | Diffs, suggested edits and audit trail retained as reviewed proposals. Automatic legal/policy rewriting and ungrounded non-compliance risk percentage removed. Missed changes, false flags and confirmed-change→approved-response time added. |
| Natural-Language Project Diagnostics | `#project-conversations` | Source-linked discussion/topic summaries and follow-up prompts retained. Morale scoring, sentiment-as-fact and intervention-efficacy claims removed. Consent, participant correction, usefulness and follow-through replace diagnostic claims. |
| Predictive Resource-Leveling | `#resource-levelling` | Forecast, roster and skills view retained as candidates. “Hybrid ML” effectiveness and auto-swapping removed. Allocation hours and feasible/proposed assignments use a defined pool/horizon; a planner approves changes. |

## Tree idea and claim disposition

Every source factual assertion below was removed from reader-facing content, not silently verified or retained as a current fact. Its useful question or mechanism survives as a scoped option. No external research was needed to assert that a question is worth considering; no product capability, date or empirical result is asserted in its place.

| Heading / source idea | Destination | Specific disposition |
|---|---|---|
| AI augmentation / predictive scheduling with transformer time-series models | `#schedule-forecasting` | Retain learned schedule forecasting. Remove open-source stabilisation in 2022, sub-hourly retraining and accuracy claims; require held-out comparison with a simple baseline. |
| AI augmentation / generative workload drafting | `#workload-drafting` | Retain WBS/RACI drafting and owner review. Remove enterprise-tuned GPT-4o (2024) and >80% baseline coverage; measure actual omissions and review effort. |
| AI augmentation / RAG risk narrative summarisation | `#risk-summaries` | Retain retrieval-supported summaries. Remove “since 2023” and continuous collaboration-suite availability; assess support, missed changes and review time. |
| AI augmentation / DiffRL resource levelling | `#resource-optimisation` | Retain the learned-optimiser hypothesis under stochastic demand. Remove DiffRL (2025), diffusion-policy effectiveness and smooth-spike assertion; compare constraints and unmet demand against a heuristic. |
| Immersive collaboration / Apple Vision Pro site walkthroughs | `#site-walkthroughs` | Retain remote spatial review. Remove VisionOS 1.2 (2024), tether-free BIM availability and travel-free audit conclusion; state what still needs a physical visit. |
| Immersive collaboration / spatial-audio metaverse stand-ups | `#spatial-meetings` | Retain shared virtual meeting workspace and persistent workboard. Remove Meta Horizon Workrooms late-2022 feature claim and implied effectiveness; compare accessibility, usefulness and setup burden. |
| Immersive collaboration / HoloLens 3 holographic Gantt | `#schedule-overlays` | Retain a schedule/model overlay prototype. Remove HoloLens 3 dev-kit (2025) existence and streaming claim; test errors, alignment and freshness without a product premise. |
| ESG & sustainability dashboards / SEC climate-disclosure API carbon ledger | `#carbon-ledger` | Retain supplier/activity ledger and traceability. Remove 2023 SEC API and live Scope 3 data-availability assertions; agree boundary, method and missing data. |
| ESG & sustainability dashboards / ELLY-EULER circularity optimiser | `#circularity-options` | Retain material loops and procurement scenarios. Remove project name, 2024 release and graph-RL effectiveness assertions; include quality, destination and transport constraints. |
| ESG & sustainability dashboards / Copernicus 2024 water-stress fusion | `#water-exposure` | Retain location/time water exposure comparison. Remove unspecified dataset release, direct local forecasting and coverage assertions; require resolution/relevance checks. |
| Low-code orchestration / GPT RPA in Power Automate | `#approval-flows` | Retain plain-language approval-flow drafting. Remove Copilot GA (2023) and automatic approval capability claim; include permissions, rejection, errors and human review. |
| Low-code orchestration / chat pipelines in n8n Cloud | `#chat-to-workflow` | Retain chat→workflow hypothesis. Remove n8n 2024 assistant capability claim; explicitly inspect data contracts, retries and duplicate events. |
| Low-code orchestration / chain-of-thought debugging in OpenAI trace viewer | `#workflow-traces` | Retain execution trace inspection. Remove 2025 release and exposure-of-private-reasoning assertion. The page distinguishes recorded calls/inputs/outputs/errors from private model reasoning. |
| Compliance & governance automation / ISO 42001 policy scanner | `#policy-gap-review` | Retain requirements→policy gap review. Remove 2024 scanner availability and automatic conformance implication; use authorised versions and independent expert review. No standard conformity claim is made. |
| Compliance & governance automation / autonomous OpenTelemetry SOC 2 collection | `#audit-evidence` | Retain control-evidence collection and provenance. Remove automatic verified-control-stream/SOC 2 sufficiency implication; distinguish retrieved evidence from effective operation. |
| Compliance & governance automation / smart-contract obligation tracker | `#obligation-tracking` | Retain clause-linked register and follow-up. Remove since-2024, zero-knowledge graph and near-real-time completeness assertions; reviewers determine meaning and compliance. |
| Knowledge-graph intelligence / E5 ontology embeddings | `#semantic-search` | Retain shared vocabulary and semantic search comparison. Remove E5-V2 (2023) and ontological adequacy claims; use fixed queries, access controls and entity identity checks. |
| Knowledge-graph intelligence / DoWhy++ delay causality | `#delay-causality` | Retain causal-diagram/intervention question. Remove DoWhy++ toolkit and 2024 integration assertion; explicitly require defensible identification assumptions. |
| Knowledge-graph intelligence / concept-drift sentry | `#vocabulary-drift` | Retain terminology-change alerts. Remove open-source 2025 availability and early-warning effectiveness claims; owner-reviewed useful/missed alerts are proposed measures. |
| Advanced analytics / SHAP graph-net delay explanations | `#delay-explanations` | Retain model explanations. Remove 2023 graph-aware SHAP availability and stakeholder-confidence claim; distinguish model attribution from cause or intervention advice. |
| Advanced analytics / GPU Monte Carlo clusters | `#simulation-speed` | Retain speed/convergence comparison. Remove 2024 launch, 100k runs in minutes and real-time contingency assertions; measure actual hardware/runtime at a stated error tolerance. |
| Human factors & wellbeing / multimodal biosignal burnout predictor | `#workload-and-wellbeing` | Retain the underlying support/workload question; replace wearable-HRV/keystroke surveillance and 2023 LSTM prediction weeks ahead with direct voluntary feedback. No diagnosis or health prediction remains. |
| Human factors & wellbeing / emotion-embedding retrospectives | `#retrospective-themes` | Retain draft thematic grouping and facilitated discussion. Remove 2024 availability and maximised psychological-safety claim; participants correct and choose themes. |

## Verification and maintenance

- Run `node --test library/apps/project-services-guide/guide.test.cjs` from the website root with Node 24 and the existing `tools/library-apps/node_modules/jsdom` dependency. Eight tests pass: complete inventory, search intersections, static/data consistency and local assets, stable bulk expansion after native toggle events, no-match recovery and prior-group restoration, visible-only expansion, hash reveal with keyboard access, and removed unsupported assertions.
- All content is present in checked-in HTML; `data.js` is its editable data source. `render.cjs` is an optional authoring helper: run it after content edits, then the tests. There is no runtime build or remote dependency. `model.js` filters data and resolves named targets; `app.js` enhances the static disclosures.
- Stable route anchors are `#offers`, `#questions`, eight group IDs and all 38 item IDs recorded above. The source documents had no named per-item URL scheme to retain.
- Browser/mobile/keyboard and deployed-route checks are separate integration work. Passing the local model/DOM checks does not establish current publication, user usefulness, delivered service capability or an empirical result.
