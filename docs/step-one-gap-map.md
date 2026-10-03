# One maintained Gap Map

Reviewed 2 October 2026. Receiving route: `/gap-map.html`, Library **Capabilities & futures**. No new category, personal-data store or research direction.

## Provenance and retention

The two original implementations are pinned to Project-web-apps revision `72e90ed92af79205776ceac87b1d81136f85e4ec`:

- `lawrencerowland/Project-web-apps@72e90ed92af79205776ceac87b1d81136f85e4ec:web_apps/pm_gap_map.html`: simple nested reading list, domain selection, 13 gaps / 18 capabilities / 15 placeholder resources.
- `lawrencerowland/Project-web-apps@72e90ed92af79205776ceac87b1d81136f85e4ec:web_apps/gap_map_gemini.html`: richer descriptions, three categories, keyword/domain filters, nested links, selectable/draggable graph and help.
- Receiving baseline: website `e159c23f26941f86167b3e28ebe7b8a7e5d37e63`, already including framing/history concepts, hypothesis generation/testing, zoom, selection, dynamic app resources and the background article.

The result has **13 gaps, 23 capabilities, 18 guidance resources**, 47 gap→capability and 42 static capability→resource relationships. Dynamic catalogue examples add resources and suggested relationships; their count changes with the maintained feeds. No browser data is read or written.

Preserved: all gap themes, old capability meanings, resource subjects, receiving hypothesis-testing additions, category browsing, keyword/domain search, nested relationship navigation, external-reference links, list/graph selection, drag, pan, zoom, clear/reset, help and article link. The list remains usable if the external D3 library is unavailable. Subject and Library links provide navigation.

## Semantic decisions

- Receiving **C14 remains Cognitive Framing** and **C15 remains Historical Insight**. Original C14 risk analysis becomes **C22**; original C15 risk culture becomes **C23**. Risk tags, Treasury guidance, nPlan and coaching references now attach to the appropriate restored risk concepts. Framing/history associations are separately curated.
- Both older maps' meaningful links are retained. This includes C6→Jira, C11→Teams and risk culture→coaching, plus capability-side links previously absent from the gap-side lists. A direct comparison against the two original datasets found no missing forward or reverse source relationships after the identity remap.
- Each relationship is now stored once in `assets/data/gap-map.json`; `assets/js/gap-map-model.js` derives reverse links and rejects dangling/duplicate identities. List and graph use the same data and filters.
- Domain synonyms collapse to the existing labels: leadership/team variants, resource allocation/optimisation, schedule, innovation and evaluation. The older G13 Emerging Practice classification is retained. Items with no classified tags use an explicit Unclassified domain.
- Gap descriptions are questions to investigate, not unsupported measurements of industry-wide prevalence. Resource links mean editorial relevance, not a claim that coaching cures bias, Teams supplies a benefits method, or Jira optimises a portfolio. Card notes explain these weaker associations. Vendor pages are identified as owner/vendor material.
- R3's old benefits-guide URL redirects to the government homepage. The card is explicitly updated to the current official benefits-management collection. R17 now uses IDEO.org's primary framing method instead of a secondary design-thinking explainer; its AI connection remains an editorial extension.

## Catalogue continuity

The loader independently requests Library, specialist and remaining Project Apps feeds, plus `assets/data/retired-apps.json`. A failed feed produces a visible partial-load message while other resources remain usable. Original CSV inclusion stays until repository closure, preserving residual apps in the graph.

Library metadata wins over specialist metadata, which wins over the older CSV. Deduplication uses exact source `repo:name` and a normalised destination URL. Self-links from the two retired Gap Map wrappers are suppressed, including stale CSV copies. Exact retired identities are filtered before integration. Invalid retirement rows fail only that feed; inherited object-property names in catalogue text cannot access mapping entries. A stale conflicting alias does not merge two distinct maintained homes already kept from higher-priority metadata. The shared retirement list is maintained by the integration task, not duplicated here.

Examples with no capability association remain searchable/browsable and have an explicit note. No relationships are invented merely to eliminate isolated graph nodes. At final source-repository closure, remove the legacy feed; the remaining feeds already work independently.

## Resource-link review evidence

Official/owner pages were found using web search and opened where indicated. This checks identity and destination, not vendor efficacy. URLs are stored on each card. No resource is left with `#`.

| IDs | Check and outcome |
|---|---|
| R1 / R2 | APM official search results identify **Coaching in the Project Environment** and **Introduction to Gamification**. Coaching has its own report page; the Emerging Trends page explicitly lists both the introductory report and later study. |
| R3 | Opened original GOV.UK landing and PDF links: both redirected to the government homepage. Followed its benefits-collection announcement to [Benefits Management in Government](https://projectdelivery.gov.uk/library-product/benefits-management-in-government/), whose page lists guidance, workbooks and templates. Card title/note records replacement. |
| R4 | GOV.UK official result identifies the [Green Book optimism-bias guidance](https://www.gov.uk/government/publications/green-book-supplementary-guidance-optimism-bias). Card limits relevance to appraisal guidance. |
| R5 | PeopleCert official [PRINCE2 Agile overview](https://www.peoplecert.org/Frameworks-Professionals/PRINCE2-Agile-Framework) found, describing agile practices within governance; commercial owner material identified. |
| R6 | Opened [SAFe framework](https://framework.scaledagile.com/): official framework overview and links to disciplines. No claim of equivalence to integrated project controls. |
| R7 | Prosci official [ADKAR model](https://www.prosci.com/methodology/adkar) found; card calls it a model within a wider change approach. |
| R8 | APM official Directing Change publication introduction found. Linked as an introduction, without promising access to the full guide. |
| R9 | Opened [Project 13](https://www.project13.info/): enterprise delivery, governance and integration described. Sustainability association remains contextual. |
| R10 | Opened [nPlan](https://www.nplan.io/): official vendor schedule-risk product destination. No independent product-performance check claimed. |
| R11 | Opened [APM ChPP](https://www.apm.org.uk/chartered-standard/): professional standard/application destination. No inferred coaching/remote-leadership qualification. |
| R12 | Microsoft official Teams file-sharing page found, describing collaboration and co-editing. Does not establish predictive analytics or a benefits-management method. |
| R13 | Skills England official ST0310 v1.5 result found. Card asks readers to check applicable version/delivery status rather than freezing an eligibility claim. |
| R14 | Atlassian official Jira getting-started guide found; supports tracking/agile-work reading, not an optimisation claim. |
| R15 | APM official stakeholder principles page explicitly attributes its basis to the jointly commissioned 2014 APM/RICS guidance. Card title distinguishes the principles page from a full guide. |
| R16 | Opened [Eric Ries's methodology](https://theleanstartup.com/principles); Build–Measure–Learn and assumptions testing are described. |
| R17 | Opened [IDEO.org framing method](https://www.designkit.org/methods/frame-your-design-challenge.html); it covers problem scope, context/constraints and alternative solutions. |
| R18 | Opened the existing Scrum.org Evidence-Based Management URL; official endpoint returned a robot-check page. Full content access was not verified, and the card records that limit. |

## Validation and remaining checks

`node --test tests/step-one-gap-map.test.cjs`: **14 passed**. Tests cover risk identity/path corrections; one-to-one forward/reverse relationships; old-only links; valid source destinations; quoted/multiline CSV; stale identity/destination aliases; exact retirement suppression; independent feed failures; domain OR semantics; no dangling filtered edges; deferred-feed filter/focus preservation; linked-target navigation/focus; clear-all and empty states; three dialogs' close/focus behavior; and the actual D3 graph's filtering, keyboard selection and simulation cleanup.

Two older migration harnesses import the new model loader through the integration task. Syntax checks and `git diff --check` pass for owned files. No publication, download-save confirmation, human-use validation or browser rendering claim is implied by these tests. Root owns the Jekyll build and browser/served checks before publication.

Suggested browser path: search **Quantitative Risk Analysis Techniques** → select Graph view → select its node → expand resources → follow **HM Treasury** → confirm filters clear and focus reaches the resource; switch domains off/all; open and close each help dialog; test phone width; verify a remaining old app and a maintained app both open their current destinations without duplicate Gap Map wrappers.
