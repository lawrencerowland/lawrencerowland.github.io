# Project Contract Lab

One maintained Library home for two finite teaching examples:

- `#nec`: the seven-card HVAC contract journey, now explicitly NEC4 ECC, June 2017 edition revised January 2023, Option A (priced contract with activity schedule).
- `#bargaining`: five fictional rail packages, each with scenario, supplier, client and analysis steps.

The bargaining exercise is not an NEC process. Its original HS2 title was unsupported by project evidence; all five packages are labelled fictional. There is no claim about HS2 commercial facts or behaviour. This is an educational example, not legal, procurement or engineering advice.

## Use and implementation

Open `index.html` locally, or serve this folder using a static server. There is no build step, React, Babel, CSS framework, network asset or external runtime. The seven NEC cards use native accessible disclosure controls and remain readable without JavaScript. The bargaining exercise and optional activity-payment illustration need JavaScript.

All state stays in the current tab. Reloading or **Start again** clears the exercise. Assumptions may be changed during a package’s scenario step; **Previous step** allows revision before the result is recorded. Recording moves to the next package and preserves the previous inputs and outcome in a table. The fifth recording enters a terminal state with all results visible. Each new package starts from its original assumptions and zero outside-option surplus.

`model.js` is a pure browser/CommonJS model. `app.js` handles rendering, input validation, focus, the range illustration and result history. `style.css` follows the Library’s warm background, green controls and serif heading conventions. `thumbnail.svg` is an original, meaningful diagram of the contract journey and the bridge bargain (45–55, price 50).

## Bargaining rule

Inputs are invented, comparable price units. Cost `c`, value `v`, supplier alternative surplus `s`, client alternative surplus `b`, ask `a` and bid `d` are integers in `[0,100]`. An alternative surplus is a net benefit available without this deal, not the gross price of an alternative contract. Both parties see all assumptions; the same reader plays both roles.

Reservation minimum `S = c + s`; reservation maximum `B = v − b`. A ZOPA exists precisely when `S ≤ B`. Some inputs put a reservation limit outside the offered price domain; then no ZOPA exists because `S ≥ 0` and `B ≤ 100` by construction.

The ask and bid are **provisional proposal bounds**, not binding offers. Reservation limits remain in force. Let `L = max(a,S)` and `U = min(d,B)`. An agreement exists iff `L ≤ U`; its chosen price is `(L+U)/2`. The midpoint is an explicit classroom rule, not an equilibrium result or a prediction. It splits the feasible proposed interval; it need not split the total available surplus equally.

Supplier surplus is `p−c`, client surplus is `v−p`. Their gains over the alternatives are `p−S` and `B−p`; the sum is `v−c−s−b`. A boundary price with zero gain is permitted (weak preference / indifference). If no agreement is possible, each takes its alternative and both incremental gains are zero. Result fields for a nonexistent price or bargain surplus are `null`; the UI does not display an invented transaction.

The score counts feasible deals, not negotiation skill or project success. Independent package gains may be added only under the declared comparable-unit assumption. The exercise omits uncertainty, competition, procurement rules, strategic opponents, coupled packages, discounting and multiple bargaining offers within a package.

### Changes from the original model

- The original fixed 40–60% ZOPA has been replaced with a package-specific reservation interval.
- The original `abs(ask−bid) ≤ 10` success test ignored cost, value, direction and alternatives. It is replaced with the feasible-price intersection above.
- Original package costs and client values are retained unchanged, now as units rather than unsupported percentages. Outside-option surpluses are optional, explicit assumptions.
- Offer sliders retain their 0–100 whole-unit domain and have labelled numeric alternatives. Both surplus and gain above alternatives are explained.
- Outcomes are recorded only at analysis. Inputs may be revised before recording. All five results remain visible, including no deals.
- The old render could dereference package index 5 before its completion effect ran. Completion is now an explicit terminal transition at index 4; repeated terminal recording cannot add another result.
- Information modals have become native disclosures, removing the original inaccessible dialog/focus implementation while preserving and extending the ZOPA and BATNA explanations.

## NEC teaching basis and corrections

The source wrapper did not name an edition or contract form; its Works Information and clause-16 early-warning references were NEC3 language. The maintained lesson selects NEC4 ECC Option A and makes that choice visible before the cards. It does not reproduce contract text or model notice validity, time bars, entitlement or an amount due.

The seven original ideas remain: scope overview; measurable HVAC requirements; weeks 12–16 including one week of commissioning; a ten-week supply lead-time warning; an instructed upgrade; the illustrative 15% activity price; and correction of a temperature-performance defect. The original 68–72°F, zonal controls and 18 SEER remain as fictional specification details, with their missing test/rating basis called out.

The £150,000 activity price and £1,000,000 initial total are declared teaching assumptions which instantiate the original 15%. The checkbox assumes the **whole** activity satisfies Option A’s completion test. It shows only this activity’s contribution to Price for Work Done to Date: £0 or £150,000. It does not calculate the amount due, an invoice, retention, tax, other activities, amendments, change adjustments or prior payments. Completion of part of this single activity does not trigger a pro-rata fraction in the illustration.

Publisher sources checked 3 October 2026:

| Claim supported | Official NEC source |
|---|---|
| Named edition and ECC Option A form | [NEC4 suite: June 2017, revised January 2023](https://www.neccontract.com/products/contracts/nec4/june-2017-edition-including-alliance-contract/nec4-bundle) |
| NEC4 Scope replaces NEC3 Works Information | [Changes in NEC4 works contracts](https://www.neccontract.com/news/changes-in-nec4-works-contracts) |
| Programme clauses 31/32 and distinction from adjustment of Completion Date | [Additional time in ECC](https://www.neccontract.com/news/additional-time-in-ecc-%E2%80%93-a-practical-approach) |
| NEC4 ECC early warning clause 15.1 | [NEC4 / FAC-1 guidance mapping](https://www.neccontract.com/getContentAsset/927fb0b0-eab4-406d-895e-7e3f14b4627a/0d97e4a9-e9ea-4e9e-bc2b-b08a6eae8854/NEC4_FAC-1-Guidance-Notes.pdf?language=en) |
| Early warnings do not themselves create compensation events | [NEC early warnings as a risk-management tool](https://www.neccontract.com/news/nec-early-warning-notices-a-unique-risk-management-tool-of-mutual-benefit) (2017; uses earlier clause numbering) |
| Compensation events address qualifying changes and time/cost effects through a process | [Introduction to compensation events](https://www.neccontract.com/news/compensation-events-an-introduction-for-new-nec-users) |
| Scope-change exceptions under 60.1(1) | [Bid-winning supply chains and Scope](https://www.neccontract.com/news/how-to-ensure-that-bid-winning-supply-chains-actually-get-used) |
| Option A PWDD uses completed activity prices | [NEC4 ECC pricing provisions](https://www.neccontract.com/news/nec4-ecc-pricing-provisions-%E2%80%93-an-introduction-for-new-nec-users) |
| Defect definition 11.2(6), notification and correction duties | [Defining and managing defects](https://www.neccontract.com/news/defining-and-managing-defects-in-ecc-and-liability-for-not-correcting-them) |

The source summaries are deliberately bounded; the complete applicable contract and project facts govern a real matter. This is not an NEC-endorsed product.

## Source inventory and preservation

Repository: `lawrencerowland/Project-web-apps`, source revision `676cbc7417d58ec9dd2d6fa751a54bd1000bc03a`. The two HTML files were wrappers. Both referenced their corresponding TSX file and external Tailwind 2.2.19, React 18, ReactDOM 18 and Babel. The complete TSX files were inspected before migration; there were no additional lesson-data dependencies. Git retains the originals; there is no second maintained code copy here.

| Original source | SHA-256 |
|---|---|
| `web_apps/interactive-nec-contract-journey.html` | `b6f0390a4d1de64a61272b94496942a7f4d52489bb909d21581669da3d593374` |
| `tsx_apps/interactive-nec-contract-journey.tsx` | `c0b13972219bb017f3e9308d9600defb18f06fbd43aee37049a6b623f44e7ecf` |
| `web_apps/hs2-contract-game.html` | `177b7f8dcc6900e1ed527cb950067f7be1bb7a5d746c0b2f4f823fb700048f9a` |
| `tsx_apps/hs2-contract-game.tsx` | `5cb51eaeea3d4343c0fe82d595354eaa8f8c410552c55721f81e8c55510d1ae4` |

| Source content or interaction | Maintained location |
|---|---|
| Seven expandable NEC cards | `#nec`, retaining source card IDs: `scope`, `works-info`, `program`, `early-warning`, `compensation-events`, `price`, `defects` |
| HVAC Scope / Works Information | Cards 1–2: one NEC4 Scope; original requirements retained as fictional |
| Programme / early warning / instructed upgrade | Cards 3–5: timings retained, edition and entitlement distinctions corrected |
| 15% milestone and defects example | Cards 6–7: explicit activity assumption and defect/correction distinctions |
| Bridge 45/55, tunnel 50/60, station 40/50, signalling 55/65, electrification 48/58 | `model.js` packages; all five in the four-step exercise |
| Scenario, supplier slider, client slider, analysis | `#bargaining` four-stage flow, keyboard controls and numeric alternatives |
| ZOPA and BATNA explanations | “Understand the bargain” disclosures, current interval, formulas and counterexamples |
| Score, round feedback and replay | Result history, live status, fifth-package completion, Start again |

The full source preservation/retirement receipt is also maintained by the repository’s migration fixtures. This app folder owns no redirects or catalogue records.

## Validation

Run `node --test library/apps/project-contract-lab/tests/model.test.cjs` from the website repository. Eleven tests cover all original packages, close/crossed offers, reservation violations, zero-width and endpoint bargains, outside alternatives, asymmetric surplus, input limits, stage/role rules, immutability, five-round completion, reset and the toy activity contribution. A separate brute-force search enumerates half-unit candidate prices for 2,400 seeded bargains and compares feasibility with the interval model; it also checks non-negative gains and conservation of surplus.

Browser review must check native disclosure controls, focus after stage transitions, slider keyboard use, invalid input, revising before recording, all five packages, final completion, reset and 390px layout. Model tests alone do not establish browser accessibility or human understanding.

## Placement judgement

These are bounded teaching cases with explicit inputs and a finite explanatory purpose. They belong together in the Library’s **Decisions & trade-offs** subject. Shared words such as “contract”, “game” or “negotiation” do not establish a substantive research connection to another foray. This migration does not open a new foray or imply an NEC mechanism is a bargaining algorithm. The credible result is a more honest pair of small lessons; strategic behaviour, procurement outcomes and human learning remain outside what has been established.

## Integration review — 3 October 2026

Independent model and interface review found no blocking issue. Browser journeys verified reservation-value rejection (ask 42/bid 43 versus supplier minimum 45), a feasible tunnel bargain at 55 with 5 units of gain per party, all five recorded packages, terminal state and restart, rejection of negative cost, card expansion and the £0→£150,000 activity contribution. The compact phone layout remained readable without document-wide horizontal overflow. Automated and browser checks establish the declared learning model, not legal correctness for a particular contract or human-use benefit. Publication remains subject to the receiving PR merge and deployment.
