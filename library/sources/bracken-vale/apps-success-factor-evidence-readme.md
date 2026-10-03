---
layout: default
title: "Success-factor evidence library · 4.1"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/bracken-vale/">← Return to the example</a> · <a href="/library/sources/bracken-vale/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the public foray scope and coverage record. Follow the project for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/bracken-vale/files/apps/success-factor-evidence/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/bracken-vale/blob/210bb906206d116fff62f98cd7bcc3aa4ab6e97d/apps/success-factor-evidence/README.md">GitHub source at 210bb90 (may require access)</a></p></aside>
</div>

{% raw %}
# Success-factor evidence library · 4.1

A curated local factor-to-case pipeline using eight wholly invented completed-project briefs. It preserves supporting passages, contradictory cases, transferability limits and a target-project planning judgement.

## Construction and sample

Eight cases span renewal, station access, power and monitoring, with favourable, mixed and disappointing outcomes. Each has three numbered passages: context, outcome account and limitation. Four authored factors each link to a supporting paragraph and a counterexample paragraph. The selection filter applies to supporting cases; selecting a factor always retains its contradictory case even if that case does not match the filter.

An applicability judgement records adopt/adapt/investigate/avoid, reason, planning action and owner. It retains the target project/asset/stage/challenge snapshot. Changing that context makes the earlier judgement stale; changing a view filter does not. The copyable checklist includes both source passages rather than exporting an unsupported recommendation.

## Walkthrough

1. Filter station / definition / access with **Filter supporting cases**.
2. Read the passenger-route factor and the disappointing omitted-user counterexample, including synthetic brief v1 §2 citations.
3. Choose adapt, explain whose needs were omitted, name a planning action/owner and **Record applicability judgement**.
4. Change the target project context to power work and observe the stale applicability label.
5. Copy the grounded planning checklist.

## Verification and boundaries

`node --test apps/success-factor-evidence/app.test.mjs` covers all factor references/caveats, counterexample retention under restrictive filters, actionable outputs, target staleness/view invariance, required reasons, atomic failures, imports and escaping.

These fictional outcomes are not empirical evidence, causal estimates or rail best practice. The factors are curated interpretations; no live AI extraction or synthesis is claimed. Grounded live extraction and human approval remain the larger source ambition. An ordinary case list is enough for browsing; this intervention is for challenging transfer before turning a pattern into a project action. Root owns browser/publication checks.

{% endraw %}
