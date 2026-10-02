# Interactive Library examples

Sixteen useful apps from `React_proj-apps` now live with named Library subjects. The examples retain their editable source, models, explanations and meaningful interaction; the public output is static HTML, CSS and JavaScript. They are deliberately small illustrations, not production project systems.

- [Browse the Library](https://lawrencerowland.github.io/library.html#interactive-methods)
- [Feature preservation and retirement record](MIGRATION.md)
- [Original catalogue metadata](original-app-index.csv)
- [MIT licence](LICENSE)

## Maintain an example

Use Node 24. From this directory:

```sh
npm ci
npm test
npm run build
```

Commit both source changes here and the generated `../../library/apps/` files. The site itself remains a Jekyll/static site: visitors do not compile React. CI checks the models and interactions and reproduces the committed output. `APP=portfolio-state-machine npm run dev` previews a single example; the production build supplies its Library navigation frame.

Titles, purpose, assumptions, canonical locations and theme membership live in `../../_data/library_apps.json`. The five theme descriptions live in `../../_data/library_themes.json`. Each app has a source link and an explicit distinction between what the example demonstrates and what it does not establish.

To check the migration routes: `node ../../tests/library-app-retirement.test.cjs`. To validate the site-occupancy model using the official NetLogo Web compiler, see the verifier alongside its `.nlogo` source. Browser checks are needed as well as unit tests, especially for canvas charts, graph gestures and mobile layouts.
