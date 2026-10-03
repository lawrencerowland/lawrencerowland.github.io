# Central app compatibility routes

`_data/legacy_app_routes.json` is the maintained record for old Project-web-apps and more-project-apps Pages addresses. Run `node tools/legacy-apps/generate.cjs` after editing it, and commit the generated static files. `--check` verifies that no generated output is missing, stale or accompanied by unregistered files.

The main site currently publishes from the root of `master` through GitHub's normal Jekyll build. Therefore the small generated pages and image copy are committed at their exact former URL paths. They contain no working app implementations and need no external script, stylesheet or registry fetch. The generator itself is excluded from the site by the existing `tools` exclusion.

Coverage is 85 Project-web-apps HTML files (82 registered moved paths, one additional directory alias, one retired-animation notice and the collection root) plus two more-project-apps HTML files. Directory `index.html` files also serve their trailing-slash addresses. Header-only CSVs, the old moved/retired JSON endpoints and the Social Debt illustration notes remain compatible. The old Social Debt JPEG URL keeps the exact image bytes, because an HTML forwarding page cannot stand in for an image response.

Each redirect preserves the incoming query and fragment. A supplied fragment overrides any default destination fragment; otherwise the default is retained. The Project-web-apps root retains its query-based route through `all-project-apps.html`. The obsolete Social Debt hop now goes directly to its Library home. The retired construction animation keeps an explanatory notice rather than an automatic redirect implying a replacement model.

Run `node --test tests/legacy-app-routes.test.cjs`; after building, run `node tests/legacy-app-routes.test.cjs _site` to check complete published bytes. The built check permits Jekyll's optional rendered `visual-notes.html` beside its unchanged Markdown source and verifies its maintained notes link. The source inventory rejects that alias and all unregistered files.

## Publication boundary

GitHub documents a user site's root URL, project sites under `/repositoryname`, and static files appearing in the published directory structure. It also documents disabling a project's Pages source independently of deleting its repository. These establish the intended arrangement but do not explicitly document routing precedence when a published project site and the user site contain the same path. Publish these files first, disable one old project's Pages source, and verify its exact URLs are served from the central site before deleting its repository. No Pages setting or repository is changed by this generator.

- [GitHub Pages site types](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Published directory structure](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Disable a Pages site without deleting its repository](https://docs.github.com/en/pages/getting-started-with-github-pages/deleting-a-github-pages-site)

The existing React_proj-apps compatibility folder is separately maintained and unchanged here. On 3 October 2026 its root URL returned the exact main-site stub while both the repository and Pages API returned 404. This is evidence for that currently served address, not a completed takeover test for the other two project sites.

GitHub repository/blob/tree URLs are a different namespace. These Pages forwards cannot preserve source-history links after repository deletion. The receiving site's working citations should point to maintained code, tests and useful receiving notes, retaining the original repository names, revisions and hashes as historical identity text. Check those precise citations and the useful unpublished-branch contribution before deletion; this route generator does not require a duplicate full-history archive.
