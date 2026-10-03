# Crossing project map

Maintained home: `/library/apps/crossing-project-map/`, in **Data and assurance**. A frozen Lower Thames Crossing procurement sample is explored through linked network and geographic views.

## Source and preservation

- Source repository: `lawrencerowland/Project-web-apps`.
- Source file: `web_apps/lower_thames_crossing_geo_kg.html`.
- Source revision: `cd0528939fd0e1f5de1df7cda9930785349e4946`.
- Source SHA-256: `3efc41b26b20a27af56d6575cd3031d20814bef7732a1cca7e1ee690036944a7`.
- Review/freeze date: **3 October 2026**. This is a review date, not a claim that the sample covers notices through that date. The twelve retained notices were published from 2016 to January 2026.
- All **54 nodes**, their stable IDs, all **76 relations**, all **12 notice URLs** and all **16 original coordinate pairs** survive. Superseded node fields and every original relation mapping remain inspectable/exportable. Source values are also pinned in the test fixture.
- Retained: project/site/organisation/location/framework/contract entities; map/network projections; node and relation type filters; award-year slider; neighbour emphasis; pan/zoom/reset; map relationship lines; notice/source links; graph pin/unpin; centre-map-on-selection; node metadata, explanations and future-scaling discussion.
- Added: search, three guided readings, keyboard-selectable D3 nodes, complete cards and relationship lists, per-relation basis/rationale, explicit undated-contract choice, full graph JSON, visible-card CSV, strict view-file round trips and copyable view links. Colour is supplemented by type text.
- The former help drawer and inspector become accessible page sections. All original explanatory subjects remain, with causal/geographic conclusions qualified. Nodes sharing a map point are grouped in a popup so the records remain selectable.

## Primary-notice review

Eight notice pages were retrievable through the web tool on 3 October 2026. This checks selected public notice fields, not performance, completion, legal identities, award attachments, or today's project status.

| Record | Review and retained qualification |
| --- | --- |
| [Architectural gantries](https://www.contractsfinder.service.gov.uk/notice/b5c40d07-3e8d-49eb-a731-d748d6f25255) | Corrected award to 23 December 2025, start to 14 January 2026, end to 31 August 2027, CPV to 71220000, and contract region to East of England/London. Corrected AtkinsRealis's stated address. Stable ID retains publication year 2026; date filtering uses the actual award field. |
| [Insurance advisor](https://www.contractsfinder.service.gov.uk/notice/a1cf1439-908c-45e5-8c06-08f5712e5e6e) | Core award fields match. The notice repeats Marsh twice, represented as one named organisation here. Its contract-location postcode and buyer-address postcode differ; both meanings are explained. |
| [Finance ERP](https://www.contractsfinder.service.gov.uk/notice/975ba958-45ec-4907-a3b2-d731ec8dc7cb) | Retains £2,000,000 from the award section alongside £1,248,585 from the summary. No cross-notice total is calculated. |
| [Commercial partner audit](https://www.contractsfinder.service.gov.uk/notice/12929928-f207-4b04-8650-466fbeeee25b) | Core award fields, Deloitte as audit supplier, named audit target and framework description checked. The underlying contract is distinct from its audit. |
| [SES structures lead advisor](https://www.contractsfinder.service.gov.uk/notice/43744d20-b898-4487-9fa6-34dce974d648) | Core award fields and FUTRAN match. SPaTS 2 association is inferred from the attachment/email label, not an inspected contract clause. |
| [Task order 17A](https://www.contractsfinder.service.gov.uk/notice/d3d75c8d-3159-4673-886b-d81ecbf5ccda) | Retains award-section end date 31 December 2015 alongside summary end date 6 January 2016. |
| [Project director](https://www.contractsfinder.service.gov.uk/notice/26a72d13-b737-4fbb-a890-97f883aa9dd4) | Core dates, value and Jacobs supplier match. Buyer heading and contact-address organisation remain distinct; no automatic entity merge is made. |
| [Hydrogen expertise](https://www.contractsfinder.service.gov.uk/Notice/a4996afe-09ae-49d1-af0c-2d4193d2338d) | Corrected award/start to 29 February 2024, end to 31 October 2024, award value to £146,423 and CPV to 73220000. The notice says Newcastle; interpreting this as Newcastle upon Tyne remains unverified. |

Four primary pages were not retrievable in this review: [legal advisory](https://www.contractsfinder.service.gov.uk/notice/36569c5d-a7e9-45fd-b6e3-9c3e14aac44b), [technical-partner audit](https://www.contractsfinder.service.gov.uk/notice/e372beb0-cfef-45ed-a1c0-ce37abac65bc), [DA2 audit](https://www.contractsfinder.service.gov.uk/notice/ac00d743-798c-4d77-8e88-008ad8e60e38), and [strategic cycle routes](https://www.contractsfinder.service.gov.uk/notice/67c1de3f-1b0f-47bf-bb25-b151a8148243). Their rows remain labelled **legacy notice row — not reverified**, not silently promoted to checked facts. Related edges remain legacy or inferred. Future verification must preserve this distinction until evidence changes.

## Geography and relationships

The [official National Highways project pages](https://nationalhighways.co.uk/roads-and-travel/road-projects/lower-thames-crossing/) provide actual project information and route maps. This example retains the original approximate crossing anchor and postcode/city coordinates, originally attributed to doogal.co.uk and latitude.to. It does not claim independent geocoding or surveyed project geometry.

- Direct map points are the inherited location coordinates and approximate project anchor. Office postcodes are not delivery locations.
- An organisation inherits a coordinate through its `BASED_IN` relation. Six organisations only have a representative city-area proxy. FUTRAN shares a Wokingham-area point with Jacobs, but only Jacobs has that postcode in the checked notice.
- Project and award nodes inherit the crossing anchor purely for this projection. The details explicitly say this is not a contract-delivery coordinate. Unlocated nodes remain unlocated.
- Map lines resolve these declared inherited coordinates and skip coincident endpoints. They are straight projected relationships, not routes, physical flows, boundaries or evidence of regional collaboration. The original implementation had no coordinate-bearing endpoints for most relations; this declared resolver makes its map-lines feature useful without inventing delivery coordinates.
- `SUPPLIES` becomes `SUPPLIED_BY` to match the contract-to-supplier arrow. `DELIVERS_TO` becomes inferred `ASSOCIATED_WITH_AREA`. Exact old endpoints/type remain on every relation.
- Solid links mark checked notice relationships. Dashed links mark editorial inferences; dotted links retain unverified legacy relationships. Project grouping, city proxies and weak framework associations remain explicit modelling choices.
- A date filter gates **award dates**, including the corrected gantry date. Undated underlying contract references have a separate checkbox. Organisations/places remain context, so filtering can intentionally leave isolated nodes. The gaps panel exposes them.

This is not a full supply-chain inventory, current-spend dashboard, causal model, operational map, or statement that an award has been delivered. Different historical buyer names remain distinct records.

## Running and checking

No build step. Open `index.html` or serve the site. D3 **7.9.0** and Leaflet **1.9.4** are local, with ISC/BSD licences in `vendor/`. Initial geography uses a coordinate grid and labelled markers without network access. Optional OpenStreetMap street tiles require connectivity; failure leaves the projections, graph, cards and coordinate explanations intact. No remote scripts or fetched graph data are required.

```sh
node --test tests/phase-three-maps.test.cjs
```

The tests preserve source identity/coordinates, check primary corrections and explicit discrepancies, examine date/type/inference filters and endpoint closure, verify inherited/proxy coordinate semantics, exercise actual local D3 and Leaflet with grouped markers/map lines, check saved-view round trips, and confirm complete card fallback without either graphical library. These do not substitute for visual browser QA.

Quick browser QA route: choose **A contract is a node**, inspect Insurance Advisor and open its primary notice; reset, set award year to 2026 and exclude undated references (only Finance ERP remains as a Contract); turn map lines on and inspect grouped-point popups; select a card then **Centre map here**; pin/unpin its graph node; toggle online street tiles; search a nonmatch and reset; export/restore a view. Check narrow-screen map/network stacking, readable labels and keyboard card/graph selection.

View files/links preserve filters, reading, selection and layout-control values. Pins, manual graph positions, map zoom and online-tile choice are session-only. Full graph JSON preserves sources and correction notes. Import accepts saved views for this app and pinned source revision only, not arbitrary graph data. No view is sent to a server.
