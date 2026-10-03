# More Project Apps

Small interactive explorations for people who deliver projects.

- [App index](https://lawrencerowland.github.io/more-project-apps/)
- [Social Debt — The code is ready. The team is waiting.](https://lawrencerowland.github.io/more-project-apps/web_apps/social-debt-explorer.html)
- [Original Project App Gallery](https://lawrencerowland.github.io/Project-web-apps/)

## Social Debt: source and boundaries

Based on **Eydy del Carmen Suárez Brieva, César Jesús Pardo Calvache and Ricardo Pérez-Castillo**, *An ontology-based metamodel for the analysis and management of social debt in software development teams*, Software and Systems Modeling (26 August 2026), [doi:10.1007/s10270-026-01413-6](https://doi.org/10.1007/s10270-026-01413-6).

The explorer uses the public abstract and [ontology deposited on Zenodo](https://zenodo.org/records/17665337), DOI 10.5281/zenodo.17665337. The source ontology states [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Please retain its authorship, source and license attribution when reusing the projection.

Adaptations: readable labels, an interactive graph projection, collapsed inverse schema-property pairs, separate interpretive themes and paths, and illustrated fictional software-team situations. The introduction uses a technical-debt analogy and a non-quantitative sequence of accumulation. These are not author-endorsed, a complete OWL rendering, a formal reasoning result, or evidence of intervention effectiveness. Source assertions and interpretation remain distinguished. Source-version/count and direction caveats are visible in the app.

As checked on 5 September 2026, Springer provides a subscription preview; no openly accessible full paper was verified. The journal article PDF is not listed in the Zenodo package. No full-study assessment is claimed.

## Hosting and maintenance

GitHub Pages serves the `main` branch at `/`. The standalone app lives in `web_apps/social-debt-explorer.html`; its data is embedded. The story, cards and credits need no graph-library download. The graph loads D3 v7 from d3js.org, with a visible failure state if unavailable.

`index.html` is a deliberately simple, static front door; `app-index.csv` is the companion machine-readable catalogue. Update both when adding an app. No build service is needed. The original gallery links to this app through a small redirect, so this repository is the canonical published copy.

The editorial illustration was created with the built-in image-generation tool. It is labelled as an imagined situation, not a research case study. The [web asset](assets/social-debt/team-release-scene.jpg) and its [generation prompt and notes](assets/social-debt/visual-notes.md) are retained in this repository. The app also embeds the image so its single-file copy remains portable.
