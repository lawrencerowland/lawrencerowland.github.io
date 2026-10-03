---
layout: default
title: "Functors for Projects"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="https://lawrencerowland.github.io/functors-for_projects/">← Return to the example</a> · <a href="/library/sources/functors/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A dated copy of the collection purpose and linked method notes. Follow the collection for subsequent work. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/functors/files/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/functors-for_projects/blob/e70117539aa4ee6eaa5bf594524740b70d9584fa/README.md">GitHub source at e701175 (may require access)</a></p></aside>
</div>

{% raw %}
# Functors for Projects

Small public experiments in translating, connecting and comparing project views. The collection contains **16 catalogue entries**, each with its own construction and limits; it is not one complete project-management system.

[Open the collection](https://lawrencerowland.github.io/functors-for_projects/) · [All 16 experiments](https://lawrencerowland.github.io/functors-for_projects/#apps)

## Two places to start

- **[The Island Reading Room](https://lawrencerowland.github.io/functors-for_projects/apps/geometry-of-interaction/)** follows two coordinators proposing a delivery plan. Supply an external access report, compare fixed-pallet and hand-carried-box policies, then hide the internal conversation. Its finite Geometry of Interaction construction is not full game semantics, learned policy or completed delivery. The [essay’s method note](https://lawrencerowland.github.io/functors-for_projects/apps/geometry-of-interaction/README.md) names the source theory and this implementation’s contribution.
- **[Milestones under changing constraints](https://lawrencerowland.github.io/functors-for_projects/apps/fibration-milestone-linking/)** traces declared connections between regional plans and a shared response. Privacy, time and budget constraints reduce two supplied options to one, then none. It computes bounded dependency and feasibility checks; the fibration interpretation remains a candidate.

The home page gives a short first comparison for each, with routes to sources and limits. The atlas explanation and project graph remain available within the full searchable catalogue. Their coverage checks do not establish functor laws. Earlier mathematical teaching examples retain their original addresses and catalogue records.

## Develop and verify

Use the locked dependencies with `npm ci`. `npm start` launches Vite on port 3000; the default is the `portfolio-state-machine` template. Set `APP=<app-name>` for another React app. Static HTML examples can be served directly from the repository, or from the production output below.

```sh
npm test -- --run
for check in tests/*.cjs; do node "$check"; done
npm run build
```

The build regenerates the home catalogue from `app-index.csv`, builds the React apps and copies static apps/assets into **`docs/`**. Serve `docs/` with a static web server to preview the complete collection. Model and interface checks are separate from mathematical proof, deployment and human-use validation.

## Files and publication

- `index.html`: scenario entrances and generated catalogue between `APP-CARDS` markers.
- `app-index.csv`: the 16 catalogue records; preserve numbers and routes for retrieval.
- `scripts/generate-catalogue.js`: labels, picture selection and catalogue order.
- `apps/<name>/`: static HTML or React/Vite app source; shared styles in `common.css` and `src/common/`.
- `pics/`: catalogue pictures. The entrance also reuses the Island Reading Room illustration from its app assets.
- `tests/`: bounded model, controller and catalogue checks.
- `docs/`: generated, ignored build output. Do not edit it as source.

The existing **GitHub Actions** workflow builds and publishes `docs/` on a push to `main`. A pull request is not a deployed revision. App addresses are `https://lawrencerowland.github.io/functors-for_projects/apps/<name>/`. The old `app-index.html` address redirects to `index.html#apps`.

When adding an app, retain relative asset paths and responsive layouts, provide a named overview/catalogue return, add its CSV record and picture, then regenerate, test and build. Each new model needs an explicit source/concept/construction/limitation explanation. See [AGENTS.md](https://github.com/lawrencerowland/functors-for_projects/blob/e70117539aa4ee6eaa5bf594524740b70d9584fa/AGENTS.md) for existing model-specific boundaries.

## Earlier repository material

[PMO Prototype Suite](/library/sources/functors/pmo-prototype-suite.html) is an earlier design document, not the current collection inventory or a claim that its proposed PMO products are supplied here. The portfolio-state-machine template and other source material remain in the repository.

## Licence

See [LICENSE](/library/sources/functors/files/LICENSE).

## Grounded theory and a finite colimit

`apps/grounded-theory-colimit/` is the maintained home of the corrected finite-set illustration migrated from Project Web Apps on 17 September 2026. It computes equivalence classes of declared identifications and checks compatible label assignments, retaining all reading stages, undo/reset and explicit limits. `node tests/grounded-theory-colimit.cjs` checks 76 graphs and 1099 candidate maps against independent enumeration. The original URL redirects here; source history remains in Project Web Apps at a83541f.

## Milestones under changing constraints

The canonical campaign example is `apps/fibration-milestone-linking/`; the former V2 address redirects here. It preserves regional plans and adaptation policies, exposes three independent constraints and a shared-service decision, and distinguishes declared dependency/feasibility checks from an unproved fibration interpretation. See the in-app method explanation and the related Solway gate/interface example. Run `node tests/milestone-context.cjs` and `node tests/milestone-catalogue.cjs` before publishing. The catalogue has one milestone entry.

{% endraw %}
