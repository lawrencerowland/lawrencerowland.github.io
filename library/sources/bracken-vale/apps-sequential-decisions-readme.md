---
layout: default
title: "Decide, learn, decide again — working trial 8.1"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/bracken-vale/">← Return to the example</a> · <a href="/library/sources/bracken-vale/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the public foray scope and coverage record. Follow the project for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/bracken-vale/files/apps/sequential-decisions/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/bracken-vale/blob/210bb906206d116fff62f98cd7bcc3aa4ab6e97d/apps/sequential-decisions/README.md">GitHub source at 210bb90 (may require access)</a></p></aside>
</div>

{% raw %}
# Decide, learn, decide again — working trial 8.1

## Job and theoretical bridge
Compare acting, buying information and staging a fictional renewal while preserving the information available at each decision. The formulation uses Warren Powell’s five-element framework: observable state, decision, new information, transition and objective. The constraints, equations, numbers and three policies here are newly authored, not supplied or validated by Powell.

Primary references checked during construction:
- [Warren B. Powell, A Universal Framework for Sequential Decision Problems, ORMS Today, 6 February 2023](https://pubsonline.informs.org/do/10.1287/orms.2023.01.02/full/): source for the five-element formulation, not validation of this toy.
- [Powell, Supervising theses on sequential decision problems](https://warrenpowell.org/supervising-theses/): reinforces that new information arrives after the decision.

## Model
Observable state contains period, remaining capital, unchanged/staged/renewed phase, poor-condition belief, whether inspection occurred, its revealed signal and the current known window. Policies receive only that state. The simulator separately owns a fixed hidden condition, one inspection random draw per time and one window draw per time. Mixed seeded draws are generated before actions; unused draws do not shift later randomness. Seeds are reproducible examples, not secure secrets. Local source/exports are inspectable; the claim is an algorithmic information boundary, not secrecy from a browser developer.

Inspect costs capital and reveals a symmetric noisy signal afterward. Bayes updates belief: p×likelihood(signal|poor) divided by the total signal likelihood. Stage halves exposure; renew removes it. Renewal/staging need a window and sufficient capital. Inspection is once only and before the last period. An invented belief bound blocks unmitigated inspection/deferral; it is not an operating rule. Capital plus hidden-condition period loss plus terminal residual is the declared objective in synthetic £k. No ticket revenue appears.

A no-admissible-action trajectory stops and has no full-horizon objective: cost is null, excluded from completed means, and counted explicitly. Summary denominators and jointly completed paired differences are shown. Unequal feasible subsets are not a fair ranking. The app does not reward infeasibility with a truncated low cost.

Policies: early renewal acts at its first affordable window; inspect-then-decide inspects once and mitigates when posterior belief is at least 50%; stage-then-finish stages first and completes at its next opportunity. Each has a declared legal-action fallback. None is trained or claimed optimal.

## Walkthrough and independent reference
**Inspect** reveals a signal only after recording the action. Read the next state, choose again, and inspect the completed objective. **Restart same scenario** reuses its tape. **Update assumptions and restart** changes parameters and clears the manual path. Comparison tapes begin at the next seed (wrapping the 32-bit seed range) and exclude the active manual seed; their displayed paths cannot reveal that manual trajectory. The comparison uses the same tapes for every policy and displays action paths and distributions.

Two-period exact enumeration: prior poor probability 0.5, perfect inspection, both windows available, costs inspection=2, renew=12, stage=6, finish=8, poor period loss=9, good loss=1, terminal poor=8/good=2. Early renewal costs 12 in both states. Inspect-then-decide costs 2+9+12=23 if poor and 2+1+1+2=6 if good, expectation 14.5. Stage-then-finish costs 6+4.5+8=18.5 if poor and 6+0.5+8=14.5 if good, expectation 16.5. Information can cost more than it saves.

## Checks and full ambition
`node --test apps/sequential-decisions/app.test.mjs` runs nine tests: exact enumeration, future-information isolation, common-tape determinism, adjacent-seed mixing, infeasible-cost handling, atomic action/import failures, capital/admissibility reconciliation and exclusion of the manual seed from comparison samples and null full-horizon objectives for partial paths.

The simpler comparator is a small decision tree with explicit information timing. The local numerical demonstration is complete. It is not a learned/optimal policy, forecast, engineering model or permission to operate, defer real maintenance or take access. Practical usefulness has not been measured.

{% endraw %}
