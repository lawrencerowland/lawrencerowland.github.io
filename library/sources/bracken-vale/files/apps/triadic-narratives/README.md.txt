# Recover the story behind the pattern — working trial 7.1

## Job and preserved intention
Keep a participant-authored narrative attached to its participant-selected position. Twelve fictional accounts span two synthetic cohorts; two deliberately have no rating. The exercise’s dimensions are Shared understanding, Clear evidence and Local discretion. They are framing choices, not psychological traits or a proprietary instrument.

## Construction and accessible placement
Three nonnegative input weights are normalized by their sum into barycentric coordinates; all-zero input is rejected. The vertices are (450,55), (100,430) and (800,430). A plotted point is their weighted average. Pointer-operated native range controls also support keyboard arrow keys; an exact numeric form calls the identical normalization action. Placement is saved explicitly. The table uses the same stored proportions as the plot.

This chooses native range controls instead of a custom pointer-drag gesture on SVG so pointer and keyboard users use the same accessible mechanism. No unsupported graph event handler or automatic text classification is implied. Adding or editing narrative text never assigns or changes a rating. Marking unpositioned retains the account.

## Walkthrough and reference
**Read narrative** N5. Set weights 20,30,50 through the sliders or **Enter exact relative weights**, then **Save slider position** or **Save numeric position**. Both produce (0.2,0.3,0.5), plot coordinate (520,355), and 20% / 30% / 50% in the table. **Filter landscape** filters the visible accounts. Each opening cohort has five positioned accounts out of six; cohort centroids average only supplied ratings.

## Checks and full ambition
`node --test apps/triadic-narratives/app.test.mjs` runs six tests for geometry, identical control normalization, zero/invalid simplex failures, no inferred position, unpositioned additions/roundtrip, and hostile presentation/import handling.

The simpler comparator is a narrative table with three self-selected proportions. Local facilitation and file exchange fulfil this version. Multi-participant collection would require consent, access control and a private service. Small selected cohorts do not support population inference; this is not a validated assessment.
