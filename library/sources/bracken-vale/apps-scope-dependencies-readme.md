---
layout: default
title: "Scope dependencies — experiment 4.4"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/bracken-vale/">← Return to the example</a> · <a href="/library/sources/bracken-vale/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the public foray scope and coverage record. Follow the project for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/bracken-vale/files/apps/scope-dependencies/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/bracken-vale/blob/210bb906206d116fff62f98cd7bcc3aa4ab6e97d/apps/scope-dependencies/README.md">GitHub source at 210bb90 (may require access)</a></p></aside>
</div>

{% raw %}
# Scope dependencies — experiment 4.4

The fixture contains 48 invented tasks (12 roles in each of four projects), 29 accepted precedence links and three cross-project shared-resource associations. Eleven role-matching rules yield 16 initially missing links. Every suggestion exposes its rule, rationale and task evidence context. Accepting a suggestion is an explicit action with a planner rationale; rejection or reopening changes only the candidate register and review log.

The starting network is acyclic. In BVR-P04, an intentionally questionable acceptance-review → handback-document relation means rule R10 would create a cycle. It is warned about before review and cannot be accepted. Remove DEP-29 and the same candidate becomes admissible. All custom precedence links are also checked for cycles, self links, duplicate relations and unknown endpoints. Shared-resource associations are symmetric for duplicate checking and do not imply logical order, reserve capacity or enter cycle detection.

Select a project, inspect proposals, accept/reject/reopen, add/remove explicit relations and edit task titles, owners and evidence context. Unknown owners remain unknown. Before/after diagrams compare the saved starting network with the current accepted links; exact change lists and relationship tables cover links that cross project boundaries. A dated review log retains candidate decisions. The baseline is part of the local review bundle; it is not tamper-proof audit evidence. View selection does not increment revision.

This is a deterministic teaching graph, not an AI suggestion engine, verified schedule, complete dependency model or operating instruction. Accepted links do not grant access, authorise isolation, verify signalling compatibility or permit return to service. No durations, scheduling solver or resource allocation are claimed. State is independent of the other tools; shared-shell controls provide persistence, reset and import/export.

Compared with a small checklist, this makes rule provenance, rejected suggestions and graph consequences inspectable. Tests: `node --test apps/scope-dependencies/app.test.mjs` cover fixture counts, seeded omissions, explicit acceptance, pre-acceptance cycle warnings, atomic rejection, reverse-link repair, independent resource semantics, malformed data and escaping.

{% endraw %}
