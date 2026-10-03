# Digital Construction ontology

One Library home, with three distinct cases under **Project states & relationships**:

- `index.html#modules`: DiCon 0.5 module map.
- `index.html#tokyo`: Tokyo stadium worked model.
- `index.html#hs2`: HS2 roles and appointments.

The end is to help a reader distinguish an ontology vocabulary, an editorial project model, and the evidence for a project fact. These are bounded worked examples, not an open enquiry requiring a new foray. A diagram, source citation, valid RDF serialization and verified real-world assertion are separate things.

## Retention and corrections

| Original | Kept | Corrected |
|---|---|---|
| DiCon module map | Module/external-vocabulary explanations and documentation links; suite/root and type controls; searchable names; selected-node incoming/outgoing relationships; neighbour highlighting; diagram navigation; sharing guidance | Nine direct imports now come from ten saved official 0.5 Turtle files. The original manually drawn dependency web was wrong. Agents imports Processes; Processes imports Entities. Suite membership and external alignments are explicitly editorial catalogue links. |
| Tokyo stadium | All **20 node identities and 28 endpoint pairs**; building/location, agents, activities, information, materials, systems and cost; source links; all original values retained in node `legacy`; type filtering, search, selection, pin/unpin and JSON export | Replaced truncated JavaScript with the common functioning renderer. Corrected ontology terms and namespace ownership, chronology, and selected claims. Solar/rainwater are identified as sourced design intent, and JNSE operation begins in April 2025. |
| HS2 stakeholders | All **93 nodes and 125 connections**, including **20 appointments**; role and party topology; package/award/reference metadata; all original per-node sources; JSON, Turtle, copy and searchable triple table | Role lookup now tests both the exact `hasRole` predicate and the selected source. Graph, JSON, Turtle and triples derive from one canonical data object. Twelve appointments have selected metadata corrections with original values and correction sources retained. |

None of the original files contained embedded photos or other raster pictures. Their visual content was the interactive diagrams, which remain interactive. The new page adds accessible node cards, suggested readings, clear evidence boundaries and SVG/CSV downloads. Graph-only presentation is optional: cards and the inspector expose all connections and source details. Node size is connection count, not power or influence. Force-layout positions carry no domain meaning.

All three use search, node-type filters, selection/neighbour highlighting, hover titles, drag-to-pin, pin/unpin controls, pan/zoom, reset and fit. Enter selects the first search match; the node cards and graph nodes accept keyboard activation. `F` fits and Escape clears selection when focus is outside an input. The layout settles deterministically instead of continuously animating. Downloads state their scope: full case JSON; all node fields in CSV (including arrays/objects as JSON, but no connections or case-level notes); and the current diagram view.

### Version 0.5 map

The selected map has **21 nodes / 29 links**: suite root, ten ontology modules and ten external vocabularies; nine direct imports, ten catalogue-membership links and ten external-alignment catalogue links. This is intentionally not a complete map of the additional vocabularies or alignment modules.

The following are direct declarations, not inferred transitive dependencies:

```text
Entities -> Variables, Contexts
Processes -> Entities
Agents -> Processes
Information -> Agents
Materials -> Entities
Occupancy -> Information
Lifecycle -> Agents
Energy -> Information
Contexts and Variables: no owl:imports declarations in the saved files
```

The [official 0.5 suite catalogue](https://digitalconstruction.github.io/v/0.5/) calls the modules Materials, Occupancy and Energy. The older labels BuildingMaterials, OccupantBehavior and EnergySystems are retained as searchable aliases. IndoorAirQuality and BuildingAcoustics are retained as topics/aliases of Occupancy, where the versioned catalogue locates those topics. They are not falsely shown as separate 0.5 modules. External links lead to separate alignment-module references. Energy does not directly import SAREF.

`sources/*.ttl` are exact official module downloads, retrieved 3 October 2026. `sources/manifest.json` records each versioned URL and SHA-256. They are reference evidence and term-validation fixtures, not runtime network dependencies. The app does not fetch them on page load. Ontology authors include Seppo Törmä and Yuan Zheng; see each file's metadata. DiCon is distributed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The TTL files are unmodified; the visual selection and prose are this example's interpretation.

### Tokyo claim and mapping review

- [Japan Sport Council's stadium overview](https://www.jpnsport.go.jp/corp/Portals/0/kokuritsu/overview_of_the_JapanNationalStadium.pdf) identifies the joint venture. [Kengo Kuma & Associates](https://kkaa.co.jp/en/project/japan-national-stadium/) describes the timber eaves and mixed timber/steel roof. No source photograph was copied.
- The [Tokyo 2020 announcement published by IPC, 15 December 2019](https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games) supports the construction period, opening event, approximate announced capacity and ¥156.9 billion reported cost. The original “including surroundings” qualifier is retained only as an original value, not a verified scope.
- The [JSC 2025–2026 publication](https://www.jpnsport.go.jp/corp/Portals/0/corp/2025_JSC_Pamphlet_JPN_Web.pdf) gives location, floor area, natural turf and the 2021 Games use. The inspector notes the different floor-area figure on the architect's page instead of presenting one as definitive.
- [JNSE's 1 April 2025 announcement](https://jns-e.com/news/20250401-421/) dates its operating role. It is not attached retrospectively to construction or the Games.
- The [JSC environmental-design publication](https://www.jpnsport.go.jp/newstadium/Portals/0/kokuminmukeshiryou/shinkokuritsukyougijyouseibijigyou_1_01.pdf) supports planned thin-film solar cells and collected rainwater for planting. This is design intent, not an as-built or current-performance inspection. The original specific turf-irrigation claim is qualified.
- The [Japanese government statement of 22 December 2015](https://www.cas.go.jp/jp/seisakukaigi/tokyo2020_suishin_honbu/statement/2015/1222speech.html) supports the selection milestone.

`dicp:Activity` replaces undefined `dicp:ObjectActivity` and `dice:Activity`; `dicm:MaterialBatch` replaces `dice:MaterialBatch`. `dica:hasAgent` and `dici:hasInformation` replace wrong-namespace names; `dici:isAbout` replaces undefined `dici:describes`. A building uses `dice:locatedIn`, not process-only `dice:occursIn`. Representative material batches use `dicp:hasInputObject`. They are not measured batch records. Ownership, operation, construction-cost and milestone shortcuts use explicit local `example:` predicates. `prov:wasInformedBy` was not an appropriate shorthand for “includes milestone”. Original mappings remain visible on the connections and in JSON.

The Tokyo dataset is an editorial concept model spanning several periods. It is not exported as allegedly validated RDF. Its JSON retains the model, explanatory properties, original source links and corrections.

### HS2 evidence review

The source app was explicitly generated **4 February 2026**. Personnel and most project assertions remain a labelled historical editorial snapshot, not a newly verified current register. Role assignments and appointments are modelling choices. The live [HS2 supplier listing](https://www.hs2.org.uk/suppliers/direct-contract-opportunities/), checked 3 October 2026, contradicts some embedded reference fields. The correction records preserve the old values:

| Records | Selected correction |
|---|---|
| Align / SCS | Reference MWCC2553 / MWCC2551 |
| Accenture digital twin | Reference 2286 |
| Deloitte / EY / PwC assurance | Assurance Services lots 1/2/3; Q3 2021; reference 2035; lot descriptions corrected |
| Arup / Atkins built-environment support | Reference HS2_751 |
| Atkins / Gleeds commercial framework | Listing references C1000_2824 and C1000_2823; no unsupported lot-specific reference allocation |
| Siemens CCS | HS2 Project 2030; Q4 2024 |
| SMC high-voltage power | HS2 Project 2056 |

Identifiers containing obsolete references are stable opaque IDs; the separately displayed `refId` is the corrected field. This avoids silently breaking the retained 125-edge topology. `originalMetadata` and `correctionSource` accompany those records in RDF as well as JSON. The original description's word “currently” was explicitly changed to snapshot wording.

The original had 483 duplicated, separately embedded triples plus a separately serialized Turtle string. The new model emits **617 unique RDF statements**: the same retained/corrected graph statements and metadata, plus dataset provenance, evidence status and correction records. Full-IRI Turtle is also a strict N-Triples-style subset, with correctly escaped literal strings. Every graph link has exactly the same subject, predicate and object in the RDF table/export. `hs2:forProject`, package, award, reference and audit fields are explicitly local example properties. Passing syntax/round-trip tests is not an OWL consistency proof or validation of real-world truth.

## Original public source pin

All originals come from `lawrencerowland/Project-web-apps` commit `cd0528939fd0e1f5de1df7cda9930785349e4946`, under `web_apps/`:

| Source | SHA-256 |
|---|---|
| [dico_module_map_d3.html](https://github.com/lawrencerowland/Project-web-apps/blob/cd0528939fd0e1f5de1df7cda9930785349e4946/web_apps/dico_module_map_d3.html) | `56f386d262078cc5f292ec83680c1e1b5688f5271aa1ee7c823557337963de0a` |
| [tokyo_stadium_dicon_graph.html](https://github.com/lawrencerowland/Project-web-apps/blob/cd0528939fd0e1f5de1df7cda9930785349e4946/web_apps/tokyo_stadium_dicon_graph.html) | `54a68482f80e0838fcc82f551a3e07e2b68d67eed23a801b985ec74228aa2c10` |
| [hs2_stakeholders_network.html](https://github.com/lawrencerowland/Project-web-apps/blob/cd0528939fd0e1f5de1df7cda9930785349e4946/web_apps/hs2_stakeholders_network.html) | `54f38cc7c70954eb6e481148e5d1ea582e41bb2c7626951b9d81806d6357f3a1` |

No private Vault material is used. The `tests/fixtures/phase-three-ontology-original.json` fixture preserves original node IDs, topology, RDF statements, source pins and independently captured module imports for regression comparisons.

## Files and maintenance

- `data.js`: canonical public case data and provenance. Pure script data works from a local file or served page without fetch.
- `model.js`: filtering, endpoint normalization, exact role selection, RDF generation/escaping and CSV.
- `app.js`, `style.css`, `index.html`: native interface and shared navigation.
- `vendor/d3.v7.9.0.min.js`: local D3 7.9.0, SHA-256 `f2094bbf6141b359722c4fe454eb6c4b0f0e42cc10cc7af921fc158fceb86539`; [official distribution](https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js), license in `vendor/LICENSE-D3.txt`.

Edit the canonical data once; do not maintain a separate Turtle or triple literal. Keep legacy values when correcting sourced claims. Preserve the three case IDs because retired source URLs forward to their hashes.

## Verification

Run `node --test tests/phase-three-ontology.test.cjs` from the repository root. The regression tests cover exact Tokyo/HS2 retention; saved ontology hashes and import declarations; namespace term existence; the role predicate/source precedence regression with both raw and D3-style endpoints; filtering without dangling edges or data mutation; preservation or documented correction of every original RDF statement; independent Turtle parsing/round-trip and escaping; case rendering; selected-triple reset; and export controls. The tests use the site's existing jsdom dependency. They do not establish factual completeness or OWL consistency.

Browser QA route:

1. Open the default page. Choose **Direct imports only**, select Agents, and see the import to Processes. Search `IndoorAirQuality`; Occupancy should appear. Hide External vocabulary and Suite independently using the type controls.
2. Choose **Tokyo stadium**. There must be 20 nodes and 28 connections. Select construction and JNSE, inspect sources/original values, drag/pin/unpin, use Fit and export JSON/SVG.
3. Choose **HS2 roles & appointments**. There must be 93 nodes and 125 connections. Select HS2 Ltd: exactly its ProjectLeaderRole is listed as its role. Search `MWCC2553`, inspect the Align appointment and original `MWCC2555`, then clear filters.
4. Open RDF triples, select a node, enable **Selected node only**, then clear selection: zero triples until the filter is reset. Search `hs2:originalMetadata`: twelve statements. Download Turtle and JSON; graph and triples must refer to the same 125 edges.
5. Use keyboard-only cards and controls, then check a phone-width layout for horizontal overflow and legible inspector/source links.

Browser, deployed-route and human-use checks are separate integration tasks; this receipt records the source/model/jsdom validation, not a deployment claim.
