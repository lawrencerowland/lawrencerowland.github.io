# Contribution Guidelines

This repository contains a Jekyll-based site with minimal dependencies and self-contained interactive examples. Follow these conventions when proposing changes.

## General style
- Keep pages lightweight. Avoid large binary assets and external dependencies whenever possible.
- Interactive examples should be plain HTML/CSS/JS with no build step other than optional `esbuild` bundling noted in the example documentation.
- Pages can opt into Schema.org metadata by setting `schema_type` in the front matter. New pages should consider adding a suitable type.
- Navigation for examples is driven by `_data/examples.yml`; add entries there when creating new example pages.
- Commit messages follow the pattern `Verb short summary`, e.g. `Add new graph example` or `Fix broken link`.

## Local testing
1. Ensure Ruby and Bundler are available.
2. Install dependencies with `bundle install` (first run only).
3. Build the site with `bundle exec jekyll build`.
   This should succeed without warnings.

If interactive examples include a simple smoke-watch as seen in `examples/petri-to-wbs.html`, check that the page loads without triggering the fallback message in a browser after building.

