---
layout: default
title: "Portfolio evidence gates — experiment 5.1"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/bracken-vale/">← Return to the example</a> · <a href="/library/sources/bracken-vale/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the public foray scope and coverage record. Follow the project for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/bracken-vale/files/apps/portfolio-gates/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/bracken-vale/blob/210bb906206d116fff62f98cd7bcc3aa4ab6e97d/apps/portfolio-gates/README.md">GitHub source at 210bb90 (may require access)</a></p></aside>
</div>

{% raw %}
# Portfolio evidence gates — experiment 5.1

Twelve invented projects occupy six governance stages: Idea, Shape, Assess, Approve, Deliver and Review. Every next-stage gate requires named evidence with a present/missing/unknown status. Present evidence requires a text reference. A simulated move also requires the assigned role, an explicit workshop confirmation and a rationale. Missing evidence and invalid attempts leave state and history untouched.

Select a project, update its evidence, try a gate, change its simulated owner, hold/resume it or stop it. Stopped projects are terminal in this model. Readiness, blocked, held, completed and stopped queues are summarised above the register. A six-stage SVG strip shows transition arrows, the current stage and the next-gate check; the ordered stage list and tables remain text alternatives. History records evidence changes, owner changes, transitions and status decisions. The scenario date stamps new events; it is not a historical snapshot filter and cannot precede existing events. Shared-shell controls handle persistence and review bundles.

This is a **separate fictional companion**, reflecting the revised implementation boundary. It neither extends nor modifies the original six-state teaching app, probabilities, redirects or tests. No legacy link is assumed. Governance approval never authorises railway work, access, isolation, energisation, operation or return to service. Local evidence notes are not attachments or authenticated proof; local role selection is not real authority. State is independent of every other experiment.

Compared with a stage-only spreadsheet, requirements and guarded moves reveal why an item is blocked; a trusted shared audit or real governance would require another system. Tests: `node --test apps/portfolio-gates/app.test.mjs` cover 12 fixtures, mandatory evidence, atomic rejection, simulated roles, unknown values, hold/resume/stop, history dates, malformed imports and escaping.

{% endraw %}
