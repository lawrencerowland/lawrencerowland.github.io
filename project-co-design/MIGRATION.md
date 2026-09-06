# Co-design collection and migration

This dedicated foray brings six independent experiments together. Their calculation models remain separate: the outputs answer different questions.

| Experiment | Contribution | Origin |
|---|---|---|
| [Staged paths](apps/staged-paths.html) | Generates legal construction histories and exact finite resource frontiers under a service floor, commissioning review, crew and access caps. | Project-web-apps: rail-staged-codesign |
| [Incremental upgrade](apps/incremental-upgrade.html) | Shows how platform, signalling and power requirements constrain one another, including discrete catalogues. | Project-web-apps: monotone_codesign_rail_upgrade |
| [Programme studio](apps/programme-studio.html) | Compares package catalogues, four prescribed staging strategies, governance and illustrative feedback assumptions. | Retained March 2026 rail studio, prepared for this site |
| [Earlier rail simulator](apps/rail-simulator.html) | Explores catalogue alternatives, resource trade-offs and stage commits. | Project-web-apps: monotone_codesign_rail |
| [Simple transit trade-offs](apps/transit-tradeoffs.html) | Introduces monotone subsystem relationships through a smaller model. | Project-web-apps: monotone-codesign-rail-transit |
| [Wildlife crossing](apps/wildlife-crossing.html) | Applies co-design to crossing, fencing and monitoring requirements. | Project-web-apps: animal_crossing_codesign |

The staged solver's mathematical engine is unchanged by migration. Its [model and verification note](docs/rail-staged-codesign-method.md) defines its finite exactness. The programme studio retains its distinct template and feedback model; its figures must not be pooled with the staged solver's frontier.

The migration publishes and verifies this receiver first. It then replaces the five old public app addresses with redirects to their matching experiments, preserving URL query and fragment settings, and removes their cards from the generic Project Apps catalogue and the dynamically mirrored All Project Apps page. One entry in Forays & Side Projects provides the collection route. More Project Apps and React Project Apps contained no additional co-design example to migrate; their unrelated tools remain in place.

The older apps add site navigation and mobile layout repairs. The earlier rail simulator now keeps the selected plan visible, and the wildlife example uses the correct catalogue threshold so that a selected bridge meets the requested capacity. Other inherited calculations are retained. Preparation of the March studio repairs stage-start timing, stale selections/results, invalid-input recovery and exact objective lenses; it also labels synthetic risk and staging assumptions explicitly. These are illustrative models, with no real-world engineering or human-use validation implied.
