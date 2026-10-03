---
layout: default
title: "Adoption has a workload of its own — working trial 7.2"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/bracken-vale/">← Return to the example</a> · <a href="/library/sources/bracken-vale/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the public foray scope and coverage record. Follow the project for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/bracken-vale/files/apps/efficiency-uptake/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/bracken-vale/blob/210bb906206d116fff62f98cd7bcc3aa4ab6e97d/apps/efficiency-uptake/README.md">GitHub source at 210bb90 (may require access)</a></p></aside>
</div>

{% raw %}
# Adoption has a workload of its own — working trial 7.2

## Job and preserved intention
Combine a four-team adoption heatmap with an explicit office-work stock-flow account. Backlog, arrivals, learning, support, task effort and rework remain inspectable. Baseline and intervention are calculated independently. All starting coefficients are synthetic assumptions; a separate authored observation ledger cannot be overwritten by a model run.

## Equations and boundaries
Requested joins = adoption rate×(people−adopters). Decay = decay rate×adopters. Actual joins are capped by hours available for learning and support after support for continuing adopters. Next adopters = previous+joins−decay. Fractional adopter-equivalents describe aggregate rates, not partly trained individuals.

Funded support is capped by available hours after learning; required but unfunded support is reported separately. Working hours = available−learning−funded support. Existing adopter decay is still governed only by the declared decay rate; unsupported continuing adoption is a visible assumption/shortfall. Effort per standard-work hour = (1−adopted share×task saving) + baseline rework fraction×(1−adopted share×rework reduction). Completed work = min(backlog+arrivals, working hours/effort per standard hour). Next backlog = previous+arrivals−completed.

Task savings = completed×adopted share×task saving. Rework savings = completed×baseline rework×adopted share×rework reduction. Net modelled useful hours = these two disjoint savings−learning−support. The components relate to the same completed work and are not added again as throughput gains. Unused capacity remains unused. The unchanged baseline has no adoption, overhead or savings; initial trial adopters’ earlier training is a sunk cost outside the horizon. This is a newly authored model, not a calibrated system-dynamics model.

## Walkthrough and reference
Use **Compare scenarios** to increase learning hours or set both savings assumptions to zero. **Inspect team** shows the stock identities each week. **Record separate observation** stores an explicitly authored figure and method; changing assumptions never rewrites it.

Independent one-week check: four people×10 hours, zero starting adopters, 25% adoption, no decay/overhead gives one adopter and share 0.25. Task saving 0.2 and rework reduction 0.5 on baseline rework 0.2 give effort 0.95+0.175=1.125 hours per standard hour. Completion is 40/1.125=35.555… standard hours; backlog 100 falls to 64.444… . Task savings are completion×0.05; rework savings completion×0.025. With only 10 available hours and 1,000 learning hours/new adopter, at most 0.01 new adopter-equivalents enter that week.

## Checks and full ambition
`node --test apps/efficiency-uptake/app.test.mjs` runs six tests for the independent reference, adopter/backlog/hour balances, resource-limited adoption, no double-counted/assumption-labelled benefit safe invalid edits/imports and zero-availability reconciliation.

A weekly workload/adoption ledger is the simpler comparator. A real uplift tracker requires agreed baselines, repeated observation and cost allocation. No modelled hour is reported as measured benefit, train-service capacity or safety performance; the model cannot justify reducing required assurance.

{% endraw %}
