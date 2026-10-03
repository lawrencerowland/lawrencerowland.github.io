---
layout: default
title: "Decision latency — experiment 8.2"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/bracken-vale/">← Return to the example</a> · <a href="/library/sources/bracken-vale/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the public foray scope and coverage record. Follow the project for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/bracken-vale/files/apps/decision-latency/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/bracken-vale/blob/210bb906206d116fff62f98cd7bcc3aa4ab6e97d/apps/decision-latency/README.md">GitHub source at 210bb90 (may require access)</a></p></aside>
</div>

{% raw %}
# Decision latency — experiment 8.2

Forty invented decisions span four project contexts. Each record has request, readiness, target and resolution dates; owner; waiting reason; dependency references; and explicit purposeful-information intervals. Dates, owners and reasons can remain unknown. Add decisions, edit records, add/replace/remove purposeful waits and maintain an acyclic dependency list. Project/status filters and a selectable record keep the queue usable.

The reporting date yields open observations, resolved records or not-yet-requested records. Age ends at the earlier of resolution and reporting date. Half-open UTC date intervals include their start and exclude their end. Choose calendar days or Monday–Friday counts with **no holiday calendar**. Preparation runs to a known readiness date. If readiness is unknown, all elapsed observation days stay explicitly unclassified; they are not assumed to be preparation or ready waiting. Purposeful waits must lie in the ready period, cannot overlap, and must end by resolution. Remaining ready-period time is reported as other ready waiting. The component graphic is explicitly a composition bar, not chronological interval placement. Rows and a table provide text alternatives.

Reference case: request 1 September 2026, ready 4 September, purposeful wait 5–8 September, report 13 September: 12 calendar days = 3 preparation + 3 purposeful + 6 other ready waiting. Weekday result: 9 = 3 + 1 + 5. An unresolved decision never becomes a zero-duration completed event. Future resolution remains open at an earlier reporting date.

Dependency cycles are rejected and unresolved predecessors are exposed, but dependency references do not prohibit recording a resolution. There are no notifications, real owners, individual rankings, decision-quality scores or multi-user services. Dates and review examples are fictional. State is independent of the other tools; shared-shell controls provide save/load/reset/import/export.

Compared with a plain decision log, this makes the day convention and purposeful waits explicit. Tests: `node --test apps/decision-latency/app.test.mjs` cover hand-calculated reference dates, open/closed/future observations, weekday boundaries, component conservation, malformed imports, overlaps, cycles, atomic failure and escaping.

{% endraw %}
