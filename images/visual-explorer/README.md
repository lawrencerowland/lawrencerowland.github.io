# Visual explorer previews

The catalogue in [`_data/visualisations.json`](../../_data/visualisations.json) records the original example URL, optional original image URL, capture date, source hash, pictured state and reading limits for each view. The examples keep their own homes and models.

This is a growing selection from the side projects and Library. It is not an inventory of every published visualisation, a ranking of methods, or a new technical validation of the source models. Decorative emblems and scenario hero images are excluded; the wildlife landscape is included because it renders the selected model configuration.

## Assets

- Existing raster diagrams are resized proportionally to at most 1600 × 1400 and saved as WebP. Thumbnails are at most 360 × 240. No diagram is redrawn or relabelled for the catalogue.
- Interactive views are browser screenshots of the published page in the state recorded by `state`. Following a link opens the original page; it does not promise to restore every pictured control setting.
- `farm-context.svg` is the unmodified published diagram. Small original notebook images retain their original resolution rather than inventing detail.
- `source_sha256` is the hash of the original image or screenshot before preview compression, not the hash of the WebP derivative.
- The DisCoPy and Py3Plex examples retain their explanatory guides and [upstream attribution notices](../notebook-examples/README.md).

## Adding a view

Read the source explanation and inspect the displayed view first. Add an identifiable visualisation, its useful question, what the reader should look for, and its material limitation. Prefer a source section link. Supply a genuine picture with readable full-size detail and a small proportional thumbnail; keep its original date when known. Do not use a project emblem in place of the actual view or silently promote an earlier experiment to a validated method.

Run `node tests/visual-explorer.test.cjs`, then the rendered check with the built site directory as its argument. Check the new preview in the browser at desktop and narrow widths, including the route to its source. A renamed or moved source should update this one record, not introduce a second copy of the model.

## Reading the wall

The tiles are pictures only. Their existing question and description appear on hover or keyboard focus; tap or activate a picture to open its full reading context and pictured companion links. Search and filters were deliberately removed at Lawrence’s request on 1 October 2026. Earlier shared URLs still open their selected view, ignoring old filter parameters.

New additions should have a clear home in a side project or the Library. Do not expand this wall by trawling the generic app collections. Existing dependency and buffer examples remain because they already form named Library worked examples; their presence is not a reason to add unrelated apps. This gallery does not authorise retiring their original sources.

## 1 October additions

Eight more views bring the selection to 34: Spines’ shed precedence layers, the wider wall-and-roof shell, Island Reading Room feedback, Rotunda lens directions, three-way project relationships, an incident quotient, the Orange workflow and the monthly portfolio-review sequence. All have existing side-project or Library homes. The original 26 records, captions and source URLs are retained.

The new standalone `shell-resources.svg` and `monthly-decisions.svg` are copied directly from their published sources. The other five new SVGs capture the published rendered or inline SVG: source styling and background are embedded so the saved view renders on its own; event handlers are removed. No diagram coordinates, labels, connections or model states are changed. For these records, `source_sha256` refers to the captured source SVG before standalone styling. Their `state` fields name the settings pictured; source links do not imply those settings are restored.

The Orange screenshot uses the same proportional WebP derivation as earlier raster previews. Its original 2019 date is retained. The monthly-review record names the 2020 working note and explicitly identifies its diagram as a 2026 reading aid.
