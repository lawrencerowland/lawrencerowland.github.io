# Stakeholder outcome map — working trial 1.2

A native, local Bracken Vale experiment. The fixture is wholly invented: 18 stakeholder roles, 18 aspirations, six objectives, six candidate scope items and 44 directed relationships. The four project identifiers refer to independent synthetic examples shared by the site; edits do not propagate to other apps.

## Implemented

- Select any stakeholder and follow stakeholder → aspiration → objective → candidate scope.
- Switch network, nested hierarchy and relationship table without changing the underlying data or revision.
- Edit aspiration wording, contribution/tension weight (0–5), author role and explicit assumption.
- Inspect contribution and tension totals separately across all six objectives. No subtraction or recommendation disguises a conflict.
- Every graph edge has ID, direction, type, author and assumption in its exact table equivalent.
- Shared shell supplies local save/load, JSON review bundle, import, reset and navigation. Input values are escaped and every form has unique label targets.

## Reference checks

Run `node --test apps/stakeholder-outcomes/app.test.mjs` from the repository root. Seven tests cover fixture integrity, an independently summed reference, isolated immutable mutation, identical relations across views, failure handling, malformed imports escaped accessible controls and hostile imported presentation fields.

Initial contribution totals in objective order are 13, 13, 12, 11, 9 and 12. Tension totals are 0, 3, 0, 2, 0 and 0. Changing the station access panel's contribution weight from 5 to 2 changes only accessibility's contribution total from 12 to 9. View changes do not increase revision.

## Limits and simpler practice

This records workshop judgements. Weights do not measure causality, social support or benefit. Candidate scope is an untested contribution hypothesis, not an engineering instruction. There is no multi-user service, inference or automatic prioritisation. Adding arbitrary node/edge types is outside this first release; users can revise the provided complete example. A relationship table is sufficient when the path adds no insight; the map helps expose the same data visually. Model tests do not establish faster stakeholder analysis or human usefulness.

Graph rendering projects only known string IDs/labels and computed finite coordinates. Imported styling, stroke and extra edge-label properties are ignored; they cannot inject attributes or trigger object coercion.
