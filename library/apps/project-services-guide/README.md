# Project service design guide

A compact, self-contained Library guide for turning a project service idea into a scoped offer, a tangible artefact and a measure. Fifteen service options connect to 23 design questions under eight headings. It is an authored discussion aid, not a list of delivered services or a P3M capability assessment.

Source revision: `459efda24b673a1e50b33cfd4347ffa5928817d9` in `lawrencerowland/Project-web-apps`; complete feature, claim, hash and route records are in [MIGRATION.md](MIGRATION.md).

- Open `index.html` directly or serve this directory. All content is readable without JavaScript; local scripts add search, family filters, expansion and deep-link reveal.
- Former catalogue route maps to `#offers`; former tree route maps to `#questions`.
- Search risk, inspect a source-linked summary question, then follow its link to a service option. Agree a baseline and comparison before proposing a trial.
- No files are uploaded, no external runtime is loaded and no browser persistence is used.
- To maintain the content, edit `data.js`, run `node library/apps/project-services-guide/render.cjs`, and then `node --test library/apps/project-services-guide/guide.test.cjs` from the website root. The render helper is optional author tooling; visitors need no build step.

The new local `thumbnail.svg` depicts offer → artefact → measure. The two originals had no source picture or supporting local asset to preserve. Their dated and unsupported product/performance assertions are replaced with questions and locally definable measures, with a per-item explanation in the migration record.
