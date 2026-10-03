---
layout: default
title: "Stakeholder & supplier relationship layers · 1.3"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/bracken-vale/">← Return to the example</a> · <a href="/library/sources/bracken-vale/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the public foray scope and coverage record. Follow the project for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/bracken-vale/files/apps/relationship-layers/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/bracken-vale/blob/210bb906206d116fff62f98cd7bcc3aa4ab6e97d/apps/relationship-layers/README.md">GitHub source at 210bb90 (may require access)</a></p></aside>
</div>

{% raw %}
# Stakeholder & supplier relationship layers · 1.3

A local multilayer relationship register for four invented project neighbourhoods. It preserves the intention to distinguish agreement, affiliation, alliance and tension rather than collapsing them into generic connections.

## Construction and sample

Four project nodes and ten actor nodes carry declared project memberships. Twelve initial relationships each retain type, from/to endpoints, relevant projects, source document/version/paragraph, source date, confirmed/unconfirmed status and an explanatory note. Passenger and freight operators remain separate actors from the infrastructure owner; only the stewardship role has an affiliation edge. REVIEW is deliberately isolated in both initial compared neighbourhoods.

A neighbourhood contains declared project members plus endpoints of every relationship declared relevant to that project. Visible edges then apply the selected type layers. Hiding layers never deletes or reinterprets source edges and never drops isolated actors. Added relationships start unconfirmed. A new project reference can bring an actor into the neighbourhood without rewriting the actor's earlier membership.

## Walkthrough

- Use **Compare neighbourhoods** for Larch and North Spur; inspect their shared specialist and isolated review role.
- Hide alliances. Their source records remain in the full register.
- Select E3, flag it unconfirmed and use **Save relationship evidence** with dated provenance.
- Expand **Add an unconfirmed relationship** to enter a distinct typed claim.
- Copy the full register and both selected neighbourhood projections.

## Checks and boundaries

`node --test apps/relationship-layers/app.test.mjs` covers layer preservation/isolation, provenance and operator separation, atomic confirmation edits, newly relevant endpoint inclusion, malformed imports/roundtrip and escaping. Exact actor and edge tables accompany the diagrams; dashed edges indicate unconfirmed claims. Geometry is not influence and a directional source relation is not necessarily a command hierarchy.

A contact list is simpler for finding people. This first version helps when relationships have different meanings and evidence. Local file exchange completes the bounded tool; authenticated multi-user stewardship remains optional and unimplemented. All entities and tensions are fiction, not allegations. Root owns browser/publication checks.

{% endraw %}
