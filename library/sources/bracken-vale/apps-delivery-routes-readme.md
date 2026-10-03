---
layout: default
title: "Delivery routes — experiment 3.2"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/bracken-vale/">← Return to the example</a> · <a href="/library/sources/bracken-vale/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the public foray scope and coverage record. Follow the project for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/bracken-vale/files/apps/delivery-routes/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/bracken-vale/blob/210bb906206d116fff62f98cd7bcc3aa4ab6e97d/apps/delivery-routes/README.md">GitHub source at 210bb90 (may require access)</a></p></aside>
</div>

{% raw %}
# Delivery routes — experiment 3.2

A complete deterministic comparison of four invented approaches. Answer six questions, record an assumption note, edit four integer weights, compare two approaches and inspect every mandatory check. Unknown answers remain unknown. Failed checks exclude a route regardless of its score; incomplete checks cannot produce an eligible recommendation. Equal top scores remain tied. A one-point sensitivity table shows whether the eligible leader changes.

Four scenario project IDs are available as context labels. They do not import another app's data. Fixed route scores and requirements are exposed in the table and source; they are invented, not a procurement framework. The office pilot requires non-physical scope and mandatory evidence. It grants no exemption for physical work.

The initial reference scores are packaged renewal 23 and integrated design-and-delivery 24. Increasing efficiency weight from 2 to 3 reverses that order (27 versus 26). The compare controls are a view preference; assessment and weight edits increment revision. The shared shell provides save/load/reset/import/export.

Compared with a simple pros-and-cons list, this makes exclusions, uncertainty and sensitivity explicit. It does not recommend real suppliers, costs or operational methods. Tests: `node --test apps/delivery-routes/app.test.mjs` cover hand-calculated scores, mandatory exclusions, unknowns, ties, sensitivity, the office-pilot restriction, atomic failure and malformed state.

{% endraw %}
