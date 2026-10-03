---
layout: default
title: "Steering pack assistant — 3.3"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/bracken-vale/">← Return to the example</a> · <a href="/library/sources/bracken-vale/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the public foray scope and coverage record. Follow the project for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/bracken-vale/files/apps/steering-pack-assistant/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/bracken-vale/blob/210bb906206d116fff62f98cd7bcc3aa4ab6e97d/apps/steering-pack-assistant/README.md">GitHub source at 210bb90 (may require access)</a></p></aside>
</div>

{% raw %}
# Steering pack assistant — 3.3

Essai 01 first version, built 2026-10-03. One newly invented Fellbridge Station Access source packet and an invented steering meeting template. This is a working drafting demonstration, not full completion of the original live-AI ambition.

## Working path

1. Set a meeting label/date and inspect or edit the shared sources.
2. Assemble six sections: decision request, current position, changes/dependencies, commitments/interfaces, action follow-up and evidence gaps.
3. Compare exact extract assembly with the recorded AI example, available only on the original packet and meeting context.
4. Edit any section, save its wording and check it against the exact source snapshot displayed below it.
5. Check every section, enter a reviewer label/note and explicitly retain the unresolved gaps. The locally reviewed Markdown then becomes copyable.

The shared shell saves/reopens full app JSON. Sources may be explicitly staged and loaded into the other three evidence-cluster apps. No update propagates silently. Receiving any packet clears local review; a changed source key or meeting context preserves old wording and its original evidence snapshot but marks it stale, blocks editing/review and removes reviewed Markdown until the user assembles a replacement. Assembly explicitly replaces the current draft; the interface advises saving a version first.

`draft-core.mjs` is shared with the gateway app. It supplies quoted extraction, exact snapshot citations, section editing, per-section checks, local review, Markdown and provenance validation. Source links target the root shell's current shelf; the draft separately preserves and displays the exact historical excerpt that supported its text.

## Evidence and authorship

- Current means a source version, never verified truth or agreement. Missing source text stays a gap. Contested statements remain labelled. The superseded access note is only history.
- Assembly copies the actual packet text, including edits; instructions use neutral wording instead of reasserting facts from the original fixture.
- Suggested follow-up is explicitly a draft suggestion. There is no separate previous-action register; unsupported owners, dates and completion status remain unknown.
- The recorded AI synthesis was genuinely authored by the Codex implementation assistant, acting as a drafting model, on 2026-10-03 during this build. It synthesises the fixed invented packet into a decision emphasis. It is not an API response generated in the browser and is never regenerated.
- The recorded example requires the exact original source snapshot and meeting context. Validation rejects rebasing its provenance to altered sources. Edited recorded wording must be labelled user-authored.
- User edits retain source links for checking; the app cannot establish that a rewritten assertion follows from them. Saving an edit clears its section check and global review.
- Local review records a user's wording review, not approval, document authenticity, agreement, circulation or operational permission. Editable JSON is a working record, not a trusted audit log.

## Simpler alternative and limits

Compared with copying notes into a document, this version makes citation versions, unresolved gaps and stale wording visible. Compared with local assembly, AI synthesis can focus a reader's attention but introduces editorial judgement that needs checking. No preparation-time, correction-rate or human-benefit result has been measured.

This first version has one project, no live status/action integration, no multi-meeting history, no live grounded AI service and no document delivery. The original method's live-AI/full-functional completion remains open. Other Essai 01 use cases also remain open until each has a version; this app is one contribution to that larger first attempt.

## Verification

Run `node --test apps/steering-pack-assistant/app.test.mjs` from the repository root. Tests check expected fixture facts and gaps; old/new access versions; review/export gating; user-authored edits; preserved snapshots and staleness; context changes; exact recorded provenance and a forged source rebase; changed approved decisions; malformed imports; maximum valid source lengths; HTML escaping and JSON reopen.

The root owns build, browser verification, public hosting and publication receipts. This module alone makes no deployment or human-use claim.

{% endraw %}
