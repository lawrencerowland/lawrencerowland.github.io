# Regulatory Negotiation Rehearsal

A bounded coalition and attribution example for **Decisions & trade-offs**. Seven parties explore a hypothetical nuclear-site work package in England. Switching levers changes four outcome scores, which define coalition worth. Exact Shapley contributions, a coalition-core diagnostic, an illustrative consent index and a separate working-group comparison answer different questions. None determines a consent, permit, agreed payment, safety conclusion or legal position.

## Provenance and preservation

Reviewed and rebuilt 3 October 2026 from [Project-web-apps, `regulatory-negotiation-rehearsal-board.html`, commit `676cbc7`](https://github.com/lawrencerowland/Project-web-apps/blob/676cbc7/web_apps/regulatory-negotiation-rehearsal-board.html). Original packaged file SHA-256: `3ec5fe335dbf5f8e5e9d5b7a77ad87383a523b19e6d05057b66fc52efc153a21`. The gzip single-file wrapper was decoded and the complete 1,522-line HTML inspected, including data, numerical functions, rendering and handlers. This successor uses local HTML, CSS and JavaScript with no runtime package or network dependency and no decompression requirement. Source data are in `data.js`, mathematical rules in `model.js`, browser interaction in `app.js`.

The original had **no localStorage/sessionStorage keys**, no remote calls and no external runtime dependencies. Its import/export JSON is the compatibility surface.

Retained inventory:

- All seven named parties and their original role text, mandatory flags, thresholds, reputations, base reputations, concession costs, logistic α/β/network coefficients, four utility weights and 7×7 influence matrix.
- All eight levers: inspection, guideline clarity, buffer, incentive, community, cost recovery/capacity rights, risk cap, information protocol. Original owners, families, signed effects, party costs, contract prompts and explanations remain.
- All six synergy vectors and explanatory notes, including active/one-move-away/dormant states.
- All four sequence presets, labels, four-coordinate modifiers and extra-surprise inputs. These are explicitly abstract preset labels, not a simulation of meetings.
- All eight clause records, primary/fallback/red-line narratives, trigger text, ownership, linked levers and constraints. The original highlight scoring is retained and labelled a discussion rule.
- All scenario controls: active levers, sequence, selected-party gate, ε, platform effect, surprise penalty, top-K; all original editable party gates, thresholds, concession costs and weights.
- The original four-coordinate baseline/reference point, clipped hypervolume worth, exact weighted-subset Shapley mechanism, costs, logistic network iterations, 12-round reputation update, six pressure formulas, coalition ranking/filter and frozen-group utility comparison.
- Briefing cards, party influence map, pressure grid, deal prompts, synergy cards, timeline, party table, clause library, scenario import/export, receipt actor/event/rationale, receipt export and in-app checks. The complete timeline, signed allocations and all 128 coalition values are now visible in accessible tables.
- Existing v1 raw-state or `{version:"rehearsal-board-v1",state,outputs}` exports, historical `state.outputs`, and legacy receipts are accepted and retained. Old incomplete receipts are never labelled reproducible. Current outputs are always recomputed.

## Corrections and boundaries

**Signed attribution.** The original computed exact φ but clipped negative φ when displaying “shares”. This could make displayed shares exceed the attributed total. φ is now shown signed, and φ/grand is signed with a near-zero-total guard. The largest contributor is ranked by raw φ, including zero-total games with offsetting contributions; an all-zero allocation has no attributed contributor. The map area uses absolute φ with a minimum visible area and labels each signed value. The original baseline model’s default Shapley values remain unchanged.

**Two distinct stability questions.** The original working split fixes assurance = ONR, EA, councils, insurers; delivery = the other parties. Its payoff comparison uses unchanged group averages. That heuristic is retained, without silently simulating a move or calling it an equilibrium. Previously only gains above ε were retained before calculating maximum gain, making “At risk” unreachable. All comparisons now appear first; max positive gain ≤ ε/2 is Stable, ε/2 < gain ≤ ε is At risk, and gain > ε is Unstable. A separate exact diagnostic tests efficiency and every coalition inequality for the Shapley vector. It does not assert core emptiness or real-world agreement.

**Illustrative consent.** The logistic and reputation computations are retained, but called indices. A product formula combining gate indices and an “at least one optional party” term does not become a calibrated probability, especially when indices influence one another. Changing gate flags filters the ranked explorer and changes the consent formula; it does not change coalition worth, the Shapley game, or statutory authority.

**Reproducible receipts.** New receipts carry `modelVersion: regulatory-rehearsal-2.0`, all party/lever/influence/sequence/clause/scenario inputs, named numerical constants (including pressure coefficients and clause scoring), and all results. Inputs contain an empty receipt list to avoid recursive history and omit derived historic `state.outputs`. Replay reruns the versioned model and compares every recorded result using a key-order-independent JSON comparison. Receipts are copied, not live references. Current-version incomplete, altered or non-reproducible receipts reject the whole import. Legacy/unknown-version receipts remain preserved and are explicitly not claimed replayable. Receipt timestamps and actor text are user records, not authenticated approval evidence.

**Real-world evidence boundary.** The fictional scenario is narrowed from the original UK-wide framing to England because EA is the named environmental regulator. [ONR’s licensing account](https://www.onr.org.uk/our-work/how-we-regulate/nuclear-site-licensing) and [EA’s nuclear-site permit guidance](https://www.gov.uk/guidance/nuclear-sites-rsr-environmental-permits) establish distinct statutory processes; neither supports these numerical coefficients. [Shapley’s original RAND memorandum](https://www.rand.org/pubs/research_memoranda/RM0670.html) supplies the mathematical attribution idea, not this worth function or consent sketch. Primary sources checked 3 October 2026.

## State, imports and storage

Only explicit **Save locally** writes `regulatory-rehearsal.v2`. The last explicit save reopens on a later visit to the same origin/browser. Load, Reset, import, receipts and ordinary edits do not overwrite that save. Undo / redo last change swaps the current and immediately previous full working states, including receipts. It is intentionally one level, labelled as such.

Scenario JSON uses `rehearsal-board-v2` with a model version, coefficients, input state and freshly computed outputs. Import validates the complete supported model shape, finite numeric ranges, fixed party identities/order, lever/sequence/clause identity sets, references, arrays, unique IDs, bounds and current receipt consistency before changing the working board. Missing/unknown model fields are rejected rather than silently dropped. Narrative text is retained verbatim and escaped at the rendering boundary. Historical derived `state.outputs` are retained, never trusted for current calculations. Raw JSON and the correction area remain available after failed imports; file reads have generation guards against older reads replacing newer choices.

Limits: seven fixed parties, eight fixed lever IDs, six synergy pairs, eight clause IDs, four sequence IDs; narrative text up to 12,000 characters per validated field; 100 receipts; 12 MB serialized scenario; nesting depth 35. JSON may change permitted coefficients and narrative inputs within the validated model, but this is not an arbitrary game editor. Public `exactShapley` and `coreCheck` functions also support independently supplied signed finite games of 1–10 parties for tests.

Malformed or inaccessible storage shows the example and an error while leaving saved bytes untouched. Quota/write failures do not claim a save. No storage is automatically cleared and no other app keys are touched. Browser-local saving is not sharing, a cross-device backup or an upload. Downloads are prepared in the browser; OS-level saving remains browser controlled.

## Verification

From the repository root, with existing development dependencies installed:

```sh
node --test library/apps/regulatory-rehearsal/tests/*.cjs
```

Sixteen test groups pass:

- Independent full-permutation Shapley oracle for 48 arbitrary signed/nonmonotone games of 1–6 parties; efficiency, symmetry, dummy, negative marginal values and offsetting zero-total allocations.
- Every one of the 256 lever packages; full independent permutation checks for five representative seven-party packages; exact default-value fixtures; separate gate/filter semantics.
- Core membership examples, negative games, an inefficient allocation and the three-player majority-game counterexample with coalition shortfalls.
- All three reachable working-split statuses, signed gains, fixed averages and tolerance boundaries.
- Complete v1/v2 state round trips, historical-output and legacy-receipt preservation, detached complete receipts, exact replay and altered/incomplete-receipt rejection.
- Rejected malformed JSON, unsupported versions, duplicate identities, unknown references, invalid lengths/ranges and non-finite/fractional inputs without changing the original state.
- Actual DOM handlers for lever/sequence/tab edits, invalid numeric edits, save/reload/load/reset/undo, complete receipt inspection/replay/export, corrected import, hostile text, malformed/blocked storage, other-key isolation, keyboard focus and expanded lever explanations.

Independent review additionally compared source-default outcomes, consent, complete timeline, pressures, synergies, clauses and ranked coalitions exactly, and checked 60 further signed/nonmonotone permutation-oracle games of 2–7 parties. No discrepancy remained after the identified receipt-completeness and zero-total-ranking fixes.

Browser review of the maintained page belongs to the migration’s overall record. Model/DOM tests do not establish human usefulness, empirical validity, legal adequacy, or successful OS-level downloads. No deployment or publication is claimed by these files.

## Placement judgement

Keep one discoverable home in **Decisions & trade-offs**. The underlying question is how a specified coalition worth model allocates contribution, whether its allocation invites coalition objections, and why neither result establishes consent or a commercial agreement. It is a useful bounded worked example, not a fresh research enquiry needing a new foray. Its numerical and institutional assumptions remain open to criticism without multiplying publication routes.
