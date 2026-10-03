# Change coordination — preservation and correction

Primary home: Library → Delivery dynamics & feedback. Reviewed 3 October 2026.

Source: `lawrencerowland/Project-web-apps` commit `459efda24b673a1e50b33cfd4347ffa5928817d9`, `web_apps/concurrent_change_levels_amazon.html`.
SHA-256: `446dbf1e42974acd6232a417d3d9a1b8ba6f7a3fdaf76142162387822adf884e`.

| Earlier feature or claim | Disposition |
| --- | --- |
| One-to-five layer slider | Retained count; defined as concurrent equal-weight change areas, because the original layers were not a specified organisational hierarchy. |
| Cubic n³/10 cost and marginal bars | Preserved exactly as the original curve, with arbitrary units and increments explained. No empirical strain interpretation. |
| Arrows imply strain propagates between layers | Removed misleading causal assertion. Added explicit interface picture which enumerates possible pairs. |
| Automatically show n−3 spin-outs above three layers | Replace unsupported threshold with a user-chosen balanced partition of the same work. Retain the useful second diagram and autonomy question. |
| Amazon three-layer ceiling; AWS/Lab126/Kuiper attributed to overload | Retire unsupported case-study assertions, including the false empirical fallback. AWS's own account is linked for autonomy/ownership context only. |
| Safe/caution/danger colours | Removed: no measured threshold exists. Explain assumptions beside each view. |
| Responsive canvas and status | Responsive SVG with descriptive title, readable metrics/table, keyboard sliders and reset; no external dependency. |
| Original screenshot pics/16.png | Stale screenshot of corrected UI; remove from source, new maintained SVG tile. |

Added alternative equal-per-area and pair-counting costs to show sensitivity to assumptions. Balanced team sizes and all possible pair interfaces are declared constructions, not an optimisation or simulation of Amazon. Boundary cost can reverse the apparent benefit of splitting. No work/priority recommendation or organisational capacity judgement is inferred.

Tests: `node --test library/apps/change-coordination/tests/*.cjs`. They independently enumerate crossing pairs for all 15 partitions, retain the five source cubic values, exercise 225 rule/partition/interface combinations, show a counterexample to automatic benefit, reject invalid inputs, and drive the actual DOM through changes, clamping and reset.

Source context: https://aws.amazon.com/executive-insights/content/amazon-two-pizza-team/ (read 3 October 2026). It does not supply or validate the numerical toy.
