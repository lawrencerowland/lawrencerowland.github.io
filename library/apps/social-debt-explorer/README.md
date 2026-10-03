# Social Debt explorer

A fictional software release leads into a projection of the public Social Debt Ontology. The complete introduction, three accumulation examples, graph, seven guided readings, cards, filters, source notes and downloads moved from `lawrencerowland/more-project-apps` into the Library on 3 October 2026.

Canonical home: <https://lawrencerowland.github.io/library/apps/social-debt-explorer/>.

## Source and limits

The paper is *An ontology-based metamodel for the analysis and management of social debt in software development teams*, Eydy del Carmen Suárez Brieva, César Jesús Pardo Calvache and Ricardo Pérez-Castillo, Software and Systems Modeling, 26 August 2026, [DOI 10.1007/s10270-026-01413-6](https://doi.org/10.1007/s10270-026-01413-6). The explorer draws on its public abstract and the [CC BY 4.0 ontology deposit](https://zenodo.org/records/17665337); it does not contain or assess the full paper. Springer still presented subscription content when checked on 3 October 2026. The Zenodo API listed 16 ontology/supporting files and no journal article PDF.

The embedded projection retains all 331 nodes, 750 edges, 331 cards and six stored readings; the original runtime adds the seventh handover reading. Fictional team scenes, explanatory sequences and interpretive links are distinguished from source assertions. The visible cautions remain: the abstract's 286 individuals versus 262 declared in the deposited file, 39 relationship-direction observations, incomplete measurement/strategy examples and placeholder namespace. This migration does not recalculate or silently repair the ontology.

The illustration remains embedded for portability and is available separately in `assets/team-release-scene.jpg`. Its original generation notes and the former repository README are preserved unchanged under `provenance/`. Their historical builder references describe the original local authoring package, which was never present in the published repository; they are not instructions for rebuilding from this folder.

## Maintenance

There is no build step. The original app runtime is unchanged apart from loading the licensed D3 v7.9.0 copy in `vendor/`. Migration also adds a canonical URL, Library links and no-script guidance, and refreshes the access-check date. `provenance/migration.json` records all eight original tracked files and hashes.

The old repository is retained as a compatibility shell for its root, app URL and illustration. Its separate unpublished mountain-refuge handover branch was discovered during the audit and is left untouched; its placeholder evidence is not an assurance result. There is no other active app on the published branch.

Run the preservation and interaction checks from the site root:

```sh
node --test tests/social-debt-migration.test.cjs
```

These checks cover data integrity, preservation hashes, story stages, keyboard tab navigation, cards/search, all guided readings, filters, deep links and data downloads. Actual graph layout and image export also need a browser check.
