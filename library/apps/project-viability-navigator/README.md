# Explore project states and possible traps

A bounded, fictional state-graph method in **Project states & relationships**. Open `index.html` directly or through the site. There is no build, server, network request, automatic storage or real-project data. D3 is included locally; if it cannot load, the complete state/transition tables and model controls still work.

The practical question is: **under these explicitly supplied assumptions, which project situations have routes out, and which closed groups can a walk reach?** The steel-mill example is a thinking aid. It does not establish project viability, causal effects, safety, an optimal policy, actual probabilities, or a forecast.

## Pinned provenance

- Original: [`web_apps/project_viability_state_space_navigator_plus.html`](https://github.com/lawrencerowland/Project-web-apps/blob/cd0528939fd0e1f5de1df7cda9930785349e4946/web_apps/project_viability_state_space_navigator_plus.html), source repository commit `cd0528939fd0e1f5de1df7cda9930785349e4946`.
- Original HTML SHA-256: `007068f1be681fa6696deca22b687e4eef5adace26eea28c6589409726d1bee0`.
- The five states and seven transitions, including IDs, labels, notes, viability scores, weights and impacts, are retained verbatim. Their independent extraction fixture is `tests/fixtures/phase-three-viability-baseline.json`, SHA-256 `69ffa256f47d1dafd8014fc9d940026acc82f026bfa73fa4d2d71c6263628d96`.
- D3 7.9.0: local `vendor/d3.v7.9.0.min.js`, copied from the repository's installed `d3` package; SHA-256 `f2094bbf6141b359722c4fe454eb6c4b0f0e42cc10cc7af921fc158fceb86539`. Its ISC license is retained in `vendor/D3-LICENSE` (SHA-256 `3e6849627f74ff73c257a3ae1efb574015d94fc1035c05ec3c15805165efcbc4`). The original loaded the same D3 version from unpkg.

## What is retained and corrected

| Capability | Retention / correction |
| --- | --- |
| Editable project states | Labels, scores and notes remain editable; start selection remains available in both selector and inspector. New explicit state add/remove controls supplement JSON editing. |
| Editable directed transitions | Weights, impacts and labels remain editable. Add/remove controls supplement the original random structural changes. Self-loops work; opposite-direction edges are curved separately. |
| Graph exploration | Force layout, drag/pin, pan/zoom, relayout, edge labels, start highlight, closed-class focus and visit thickness remain. Zoom buttons and keyboard node movement are added. |
| Threshold bands | Source thresholds are preserved: above/equal threshold, below threshold but at least 60% of it, and lower. Labels now describe score bands rather than asserting stable/marginal/non-viable outcomes. |
| Weight cutoff | The same filter determines displayed active edges, graph analysis and walk exits. Zero-weight edges are inactive even at cutoff zero. |
| Closed classes | Strongly connected components with no active exit, including single terminal states, replace the earlier cycle-only “attractor” test. Each class is listed separately with start reachability. |
| Weighted walk | The xmur3/mulberry32 seed sequence and relative-weight sampling remain. `p` is explicitly a weight, normalised over active exits from the current state. Starting visits and terminal stays count; a terminal state never teleports back to the start. |
| Destination impacts | Optional `dv` changes the destination's assumed viability on each actual transition, clamped to [0,1]. A terminal hold has no transition impact. Scores do not feed back into the transition weights. |
| Five perturbations | Score nudge, weight nudge, add, remove and rewire remain, with the same amplitude controls and optional relayout. Addition/rewiring select from feasible choices, so an available change cannot fail merely because random retries missed it. No applicable change is reported explicitly. The term “safe-to-fail” is removed: model reversibility does not imply intervention safety. |
| Diagnostics | Counts, mean score, threshold bands, SCCs and a degree/score heuristic remain. The explicit heuristic `(active in-degree + active out-degree + 1) × (1 − viability)` is shown for every state, labelled “attention score”, not estimated risk. |
| Undo and history | Last 30 actions can be undone, restoring model, layout, start, threshold/cutoff, visits and last-walk summary. History keeps 40 labels, displaying the latest 25. Keyboard undo is not intercepted while editing text. |
| JSON / PNG | Both exports retained. JSON includes all supported model fields and layout. File import plus a paste/copy route are provided. PNG captures the current graph view. |
| Accessibility and mobile | All inputs have labels, graph nodes/edges support Enter/Space, nodes support arrow movement, native lists provide complete inspection/edit access, scrollable tables have names, and status is announced. Section jump links work in the stacked phone layout. |

The original had no persistence; this version likewise stores changes only in the current tab. Export before leaving. Model JSON excludes visits, history, seed, threshold/cutoff and perturbation settings. The start state and destination scores after an impact walk are part of the model and are exported. Every run restarts from the selected start and seed. Visits accumulate only while the transition/start assumptions remain compatible; model edits, structural perturbations, cutoff/start changes and imports clear them. Changing the title or display threshold does not clear visits.

## Model mathematics and sources

For an active transition `i → j`, its one-step model chance is `p(i,j) / Σ(active p(i,k))`. Active means weight > 0 and weight ≥ cutoff. If no active exit exists, the simulation makes an implicit self-transition with chance 1 and no score impact. A supplied self-loop is an ordinary actual transition, including its optional impact. The result is a finite, fixed-transition Markov walk conditional on these assumptions. The viability scores change independently when impacts are enabled; that does not constitute a formal viability-control model.

Closed classes are SCCs with no outgoing edge to another SCC. An isolated or terminal state is a closed singleton. The app does not infer that every closed class is reachable, harmful, robust, or empirically present. It does not estimate stationary distributions or absorption probabilities.

Primary/reference checks, reviewed 3 October 2026:

- [Grinstead and Snell, *Introduction to Probability*, chapter 11](https://math.dartmouth.edu/~prob/prob/prob.pdf), sections 11.1 and 11.2; absorbing-state definition 11.1, printed p. 416 (PDF p. 424, one-based). Transition probabilities sum to one; an absorbing state cannot be left. This supports normalisation and the terminal-state correction, not any of the steel-mill weights.
- [NetworkX, attracting components](https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.components.attracting_components.html): a closed strongly connected component cannot be left by its random walk. [Condensation](https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.components.condensation.html) describes SCC contraction. Our SCC implementation is Tarjan; tests use transitive closure as an independent oracle.

This bounded method belongs in the existing Library subject because the implemented graph, walk and sensitivity operations are useful on their own. There is no claim that it constructs completion paths from resources, implements categorical lenses, learns changing goals or justifies a real governance intervention.

## Validation and supported import schema

The entire proposed import is checked before changing the current model or its undo/visit state. No transition, duplicate, unknown field or invalid coordinate is silently discarded. File reads that finish after an intervening edit are rejected, avoiding replacement of a newer model.

```json
{
  "meta": {"title": "A small example", "start": "A"},
  "states": [
    {"id": "A", "label": "Operating", "viability": 0.7, "notes": "Assumed score"},
    {"id": "B", "label": "Paused", "viability": 0.3, "notes": "No modelled exit"}
  ],
  "transitions": [{"from": "A", "to": "B", "p": 0.4, "dv": -0.05, "label": "Interruption"}],
  "layout": {"positions": [{"id": "A", "x": 150, "y": 200}, {"id": "B", "x": 450, "y": 200}]}
}
```

- 1–200 states; 0–2,000 transitions; one per ordered pair. Parallel pairs reject instead of collapsing. An empty transition set is valid; an empty state set is not.
- IDs are nonblank strings of at most 100 characters or safe integers, converted to strings **before** duplicate/endpoint checks. Numeric zero is valid. Mixed `1` and `"1"` collide and reject. Arbitrary ID/label text is rendered as inert text; edge identities use JSON tuples, not delimiter concatenation.
- Viability and weight must be finite JSON numbers in [0,1]; impact must be finite in [−1,1]. Numeric strings, null, overflow, NaN through a programmatic call, and out-of-range numbers reject. Only omitted optional fields receive defaults.
- Missing viability defaults to 0.5; weight to 1; impact to 0; state label to ID; notes/edge label to empty text. Missing metadata defaults to title “Untitled” and the first state as start. A supplied invalid start rejects.
- Title and labels are at most 200 characters; notes 5,000; seed 200. Optional layout is null or an object with `positions`. Coordinates must be finite in [−10,000,10,000], with known, unique state IDs.
- Unknown fields reject with an explanation. Preserve unsupported fields separately or explicitly map them into notes; the importer does not pretend to retain data it cannot represent.
- JSON text/file limit is 2 MiB. Walk steps are a whole number from 1 to 50,000. Walks yield after 500 steps; Cancel discards the pending run, leaving the previous model and visits intact. Pure simulation functions share the bound; graph and probe sizes are also bounded.

## Automated verification

From the repository root:

```sh
node --test tests/phase-three-viability.test.cjs
```

18 tests pass. They check the pinned source fixture, all 512 three-state directed graphs at three cutoffs against an independent transitive-closure oracle, normalised chances, exact absorbing/cycle counts and impacts, reproducibility and a separate 3:1 frequency check, numeric IDs, atomic malformed imports, literal malicious strings, all five perturbations, limits, real DOM edit/start/undo/add/remove flows, cancelled/completed walks, imported layout and keyboard movement, async file race protection, text undo, labelled controls and the actual vendored D3 renderer in jsdom.

These tests establish the bounded code behaviour. They do not establish browser rendering quality, a successful download, deployment, real-world validity or human usefulness.

## Browser QA for integration

1. Open on desktop and around 390 px wide. Read the opening scenario, use Controls / Graph / Editor / States / Transitions jump links, and confirm the page itself does not overflow horizontally; tables may scroll internally.
2. Run the default 250-step walk. Visits total 251, the start remains S1, and both outgoing S1 chances are 70%/30%. Clear visits and repeat with the same settings to get the same counts.
3. Set cutoff to 0.31. S3 (Automation) has no active exit. Choose S3 as start and run 10 steps: S3 has 11 visits, 0 actual transitions and 10 terminal stays. Undo restores prior settings/counts.
4. Use only the keyboard to select a state and edge, edit fields, set the start, move a graph node with arrow keys, operate zoom/focus and undo. Text editing's own Ctrl/Cmd-Z should not undo the model.
5. Try each perturbation type separately, undo each, and check a disabled/empty set receives an explanation. Add/remove a state and transition; removing a state also removes its incident edges, and Undo recovers them.
6. Start 50,000 steps and cancel promptly. Previous scores and visit counts remain intact. Complete another run with impacts on; scores change and are undoable.
7. Export JSON, alter the model, reimport, and compare states, transitions, start and layout. Paste invalid JSON, duplicate IDs, missing endpoints or a null score; the existing model remains intact and the status explains the failure.
8. Export PNG and open it. It should contain the current view with readable labels/arrows and a light background. Block the local D3 script to confirm the table/editor fallback stays usable.

Browser QA and publication remain the integration owner's separate checks.
