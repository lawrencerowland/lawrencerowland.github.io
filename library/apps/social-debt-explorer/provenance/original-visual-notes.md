# Social Debt introduction revision · 6 September 2026

The opening uses a fictional release-team scene, a technical-debt/social-debt comparison and a non-quantitative sequence showing accumulation. None is a case study, effect estimate or finding attributed to the paper. The source ontology and the graph’s data have not been changed.

## Illustration

- Created with the built-in image-generation tool, not the CLI fallback.
- Selected original: `assets/team-release-scene.png`.
- Web copy, encoded as JPEG without changing the composition: `assets/team-release-scene.jpg`.
- The JPEG is embedded in the generated HTML so the app remains portable. It is also kept separately for the gallery thumbnail.
- The cartoon is explicitly labelled as an AI-created illustration of an imagined team.

## Final generation prompt

Use case: illustration-story. Asset type: editorial cartoon for the opening of an educational website about social debt in software teams. Create one wide landscape illustration, approximately 3:2, sophisticated pen-and-ink with very light watercolour washes on warm ivory paper. Scene: a recognisable, ordinary software team office just before a release, not a generic corporate meeting. Three thoughtful software developers at a shared desk with laptops, one turning to an empty swivel chair at the right; the other two quietly paused, looking between a laptop and the vacant place. On the empty desk are a closed laptop, a mug and a small plant. The absence is the visual focal point: the one person holding the history of a tricky integration is away. A restrained wall board has a few simple issue cards and a checkmark, no legible text. One small remote colleague tile can be present on a laptop. Body language shows uncertainty and a pause in work, not anger, stupidity, blame or slapstick. Mature understated newspaper-editorial drawing, elegant irregular black ink contours, expressive but natural people, gently observed dry humour, spacious composition with clean negative space around figures. Palette: warm off-white, charcoal, muted sage, small restrained ochre accents. Eye-level slightly raised three-quarter view, laptops and faces visible, empty chair clearly visible on right. No speech bubbles, no words, no captions, no logos, no monetary symbols, no technical debt monsters, no cartoon piles of money, no glossy 3D, no stock-corporate vector people, no exaggerated comedy. The webpage will supply all captions in accessible HTML. This image depicts a fictional illustrative situation, not the paper's case study.

## Rebuilding

`build_social_debt_explorer.py` reads the original Turtle, `explorer-template.html`, `story.html`, `story.css`, `story.js` and the JPEG. It generates `Social Debt Ontology Explorer.html`. The graph contains 331 nodes and 750 edges, plus the existing runtime handover reading. The new accumulation controls change only the illustrative introduction, not source assertions.
