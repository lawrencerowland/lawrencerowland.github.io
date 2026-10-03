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
