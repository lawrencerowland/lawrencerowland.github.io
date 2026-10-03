---
layout: default
title: "Ready, returned, completed — working trial 4.3"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/bracken-vale/">← Return to the example</a> · <a href="/library/sources/bracken-vale/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the public foray scope and coverage record. Follow the project for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/bracken-vale/files/apps/process-readiness/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/bracken-vale/blob/210bb906206d116fff62f98cd7bcc3aa4ab6e97d/apps/process-readiness/README.md">GitHub source at 210bb90 (may require access)</a></p></aside>
</div>

{% raw %}
# Ready, returned, completed — working trial 4.3

## Job and preserved intention
Compare readiness, first-pass quality, rework and observed lead times using eight synthetic work-package logs. Cohort/stage filters, an empirical estimate range and individual event trails preserve the original intention to support an estimation discussion. The example contains two open cases, one missing labour observation, one exact duplicate and one distinct planned access wait.

## Construction
Exact event IDs deduplicate equal (date,kind,effort) records; conflicting copies reject the import. Rework percentage = known rework labour hours / all recorded prepare+rework labour hours ×100, only when every relevant effort is known and the denominator is positive. The table retains the known subtotal when the complete ratio is unknown.

Completed calendar cycle = acceptance−opening. Open cases use reporting date−opening as age and are excluded from completed-cycle quantiles and first-pass denominators. A recorded planned access interval is reported separately and subtracted for the reference-class comparison; elapsed time is never added to labour hours. Pre-submission time is a timestamp interval, not a causal diagnosis. Empirical quartiles use linear interpolation in sorted completed adjusted durations. Small samples are flagged.

Readiness is completed checks / all checks against an editable threshold; any unknown check prevents a ready declaration. Editing readiness does not rewrite the event history or imply that a past outcome changed.

## Walkthrough and reference
Choose **Compare cohort**, then **Open record** to trace the result. W1 contains a duplicate rework event: after deduplication, 5 rework hours / (20 preparation+5 rework) =20%; calendar duration is 11 days. W3 has 15 calendar days, four planned access-wait days and 11 adjusted days. The six completed adjusted durations are 6,8,9,10,11,11: Q1=8.25, median=9.5, Q3=10.75. Two open cases are excluded. Three of six accepted cases had no return, giving 50% first-pass acceptance. The overall rework ratio is unknown because W5 preparation effort is missing.

Use **Correct effort** for a recorded labour event; equal duplicate copies are corrected together. **Append event** obeys submission/return/rework/acceptance order and rejects events after acceptance.

## Checks and boundaries
`node --test apps/process-readiness/app.test.mjs` runs six tests for the references, open-case exclusion, separate wait/effort units, unknown readiness, conflicting/invalid events and safe roundtrip/rendering.

The simpler comparator is a completed-cycle spreadsheet with a separate first-pass and labour tally. The local tool is complete as a demonstrator. Trusted real-team logs, agreed definitions and repeated comparison would be needed for a useful operational tracker; no causal explanation or calibrated forecast is claimed.

{% endraw %}
