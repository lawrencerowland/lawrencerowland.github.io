# Project controls transformation picture: receiving record

Integrated 3 October 2026 into the existing PM Software Evolution app. This is a second, dated reading lens, not a new app or catalogue card. The 2004–2025 timeline retains its 24 entries, six categories, five eras, 23 proposed connections, filters, canvas, list alternative, keyboard details, related-entry navigation and existing explanation/source boundaries.

## Sources read in full

Read-only source checkout: `Project-web-apps` at `459efda24b673a1e50b33cfd4347ffa5928817d9`.

| Source path | SHA-256 | Disposition |
| --- | --- | --- |
| `web_apps/Project_Controls_2010-2025_Transformation.html` | `d15ab8e78626e11f4973c18d275240449344f83ded748f4df76769ebfe407a66` | Thin image wrapper replaced by the existing history app's comparison section. |
| `other_apps/Project_Controls_2010-2025_Transformation.svg` | `b45ae4b985a08d3153a0a3de449fd9a538525c4419b6282814e19226eaeb8e5f` | The dated diagram is adapted and corrected in `src/project-controls-transformation.svg`; it is not reproduced as an authoritative measured map. |

The wrapper references only that SVG. There are no external image, font or script dependencies in the SVG. A former catalogue thumbnail is not part of the wrapper's functionality; the root retirement record owns its disposition.

## Route and feature mapping

The intended receiving URL is `/library/apps/pm-software-evolution/#controls-transformation` for the old wrapper and old standalone diagram. This section is linked from the existing history app's top navigation and links back to `#software-timeline`. The original diagram's `wardleyMapInfo` and `transformationInfo` callouts become the visible reading guide and the “What changed in the original picture, and why?” disclosure in the same section. The root retirement operation owns the outgoing repository links and any old-route stub; this record alone does not claim that the old repository has been retired.

| Legacy feature | Receiving treatment |
| --- | --- |
| 2010s and 2025 contrast | Retained as an authored historical comparison of emphasis; no claim that the entire industry had transformed or that old practices disappeared. |
| Ten 2010s components and six 2025 components | All sixteen names retained in the diagram or its unplaced panel and in an accessible two-column definition list that becomes one column on mobile. “MS Project, Primavera”, spreadsheet registers, nPlan, IoT and drones remain in explanatory context. |
| Evolution: genesis → custom → product → commodity | Clarified as changing supply/market characteristics, not time, novelty alone, benefit, or a numerical maturity score. Broad stage locations are interpretive. |
| Visibility/value chain | Explained relative to a user need. The discussion prompt names a controls lead needing a credible forecast; it is not an observed project service. Heights group visible tools and supporting infrastructure; dependencies remain to be established. |
| AI/nPlan positioned near custom/genesis | Corrected to a product example using nPlan's dated 2023 Portfolio launch. No claim that its whole capability bundle is a commodity or autonomous project control. |
| Digital twins placed near genesis | Corrected to product/service platform building blocks, with a separate local model/context requirement. Azure's 2020 availability supports the specific offering, not universal twin maturity. |
| Basic cloud in product area, later cloud further right | Metered storage is a utility example for both periods: S3's 2006 launch described pay-as-you-go provision. No inference that all cloud services have the same evolution stage. |
| Ten unspecified functions/practices/arrangements | Stage withheld. This corrects unsupported placement rather than silently assigning new exact coordinates. |
| Two continuous dependency chains | Removed because no supporting dependency evidence was supplied. The notes explain how a real user need and verified dependencies would be needed for a full map. |
| Leftward “Transformation” arrow | Removed because a date contrast is not a single movement back towards genesis. |
| Wardley and transformation info boxes | Replaced with readable, linked, mobile-friendly explanatory prose and explicit correction notes. |
| Source image accessibility | Descriptive SVG title/description, HTML alt text, shapes as well as colours, complete text interpretation, keyboard-focusable horizontal image region, visible scroll guidance and direct readable SVG link. |

Corrected editable SVG SHA-256: `fa09d591bc941e603fa6ec3a4355eedb762d164df11f6f98b30f01f1e78f570b`. Vite copies this imported asset to the app's fingerprinted `assets/project-controls-transformation-*.svg` output; it has no remote image dependency. The generated filename can change on rebuild; the section URL is the stable receiving route.

## Primary sources checked

- [Microsoft, 12 May 2010](https://news.microsoft.com/source/2010/05/12/microsoft-delivers-the-future-of-productivity-with-office-2010-and-sharepoint-2010/): business availability of Project and SharePoint 2010.
- [AWS, 14 March 2006](https://aws.amazon.com/blogs/aws/amazon_s3/): S3 launch and pay-as-you-go storage provision.
- [nPlan, 27 July 2023](https://www.nplan.io/press-releases/bam-joins-forces-with-nplan-to-roll-out-new-approach-to-portfolio-risk-management-powered-by-ai-and-past-project-data): Portfolio product launch. Supplier performance claims are not independently validated here.
- [Microsoft Azure, 8 December 2020](https://azure.microsoft.com/en-us/blog/azure-digital-twins-now-generally-available-create-iot-solutions-that-model-the-real-world/): Azure Digital Twins general availability and platform building blocks.
- [Simon Wardley, Finding a new purpose](https://medium.com/wardleymaps/finding-a-new-purpose-8c60c9484d3b): evolution is not measured over time or adoption; current positions rely on characteristics and interpretation.

These sources establish the selected offerings and clarify the axes. They do not validate the whole diagram, historical adoption rates, service dependencies, maturity coordinates or realised benefits. Existing timeline claims retain their earlier explicit verification boundary.

## Verification

From `tools/library-apps`, using Node 24:

```sh
node node_modules/vitest/vitest.mjs run apps/pm-software-evolution/src/App.test.jsx --root .
APP=pm-software-evolution node node_modules/vite/bin/vite.js build
```

Passed both meaningful interaction tests: the existing test covers keyboard milestone detail/source, mobile-category filtering, clearing stale details, and cross-category linked selection restoring the visible node. A regression additionally follows ClickUp (2017) ↔ Low-Code PM (2019), with Notion (2018) also incoming, to ensure directed relationship labels do not misstate calendar order. The former “Related earlier/later entries” headings now read “Incoming/outgoing proposed relationships”, with a visible explanation that direction is not chronology. The comparison adds native links and disclosure, not a new simulated model or stateful interaction.

Isolated headless Chrome reviewed the generated production output on 3 October 2026:

- Keyboard selects Jira Agile details, filters to Mobile PM, follows Trello and restores All Categories.
- Keyboard jump reaches `#controls-transformation`; disclosure opens with Enter.
- All sixteen component labels appear in the text equivalent; readable SVG opens successfully.
- Desktop SVG was visually inspected and label/axis collisions repaired.
- At 390 px the document width remains 390 px; the diagram scrolls within its 348 px region, with all content also available in text. No page JavaScript errors.

Temporary local evidence: `/private/tmp/phase7-history-browser.json`, `/private/tmp/phase7-history-diagram.png`, `/private/tmp/phase7-history-mobile.png`. The temporary browser harness is `/private/tmp/phase7-history-browser.cjs`. These checks establish rendering and interaction, not historical/empirical validation. Deployment is checked by the root task after integration.
