# Visual explorer previews

The catalogue in [`_data/visualisations.json`](../../_data/visualisations.json) records the original example URL, optional original image URL, capture date, source hash, pictured state and reading limits for each view. The examples keep their own homes and models.

This first selection has 26 views. It is not an inventory of every published visualisation, a ranking of methods, or a new technical validation of the source models. Decorative emblems and scenario hero images are excluded; the wildlife landscape is included because it renders the selected model configuration.

## Assets

- Existing raster diagrams are resized proportionally to at most 1600 × 1400 and saved as WebP. Thumbnails are at most 360 × 240. No diagram is redrawn or relabelled for the catalogue.
- Interactive views are browser screenshots of the published page in the state recorded by `state`. Following a link opens the original page; it does not promise to restore every pictured control setting.
- `farm-context.svg` is the unmodified published diagram. Small original notebook images retain their original resolution rather than inventing detail.
- `source_sha256` is the hash of the original image or screenshot before preview compression, not the hash of the WebP derivative.
- The DisCoPy and Py3Plex examples retain their explanatory guides and [upstream attribution notices](../notebook-examples/README.md).

## Adding a view

Read the source explanation and inspect the displayed view first. Add an identifiable visualisation, its useful question, what the reader should look for, and its material limitation. Prefer a source section link. Supply a genuine picture with readable full-size detail and a small proportional thumbnail; keep its original date when known. Do not use a project emblem in place of the actual view or silently promote an earlier experiment to a validated method.

Run `node tests/visual-explorer.test.cjs`, then the rendered check with the built site directory as its argument. Check the new preview in the browser at desktop and narrow widths, including the route to its source. A renamed or moved source should update this one record, not introduce a second copy of the model.
