# project-risk-gradient — maintained Library home

Moved from Project-web-apps/web_apps/project-risk-gradient.html at revision `5c22c99719ea0a7940aac47574fd0cb8511a4b79` on 3 October 2026. Source SHA-256: `8c67552d5593cffcd18190c4aeb8abe020e7670c03fd59f4eaa2c90169e7797f`.

The complete original was reviewed: seven tasks and dependencies, baseline and buffered CPM, fixed risk weights, exponential response, one-day finite differences, chart, rankings, two recommendation routes, network, task selection, sliders, reset, and both explanations. All are retained. The original embedded script SHA-256 is `621d744381b28dcd5faa2eb5e498ae16fdc2b992170d8c81c87185b5af8d761f` (script text between its tags). The migrated script deliberately differs to repair interface behaviour; the original scheduling and risk arithmetic is unchanged.

## Repairs and clarified limits

- Buffer inputs now remain in the DOM during updates. Continuous dragging and successive keyboard changes retain the same input and focus. Every buffer slider and Chart button has a task-specific accessible name. Dynamically redrawn ranking, recommendation and network controls recover focus; once every allocation is capped, focus falls back to Reset.
- Recommendations and rankings exclude tasks already at the 10-day allocation limit. The summary counts only available next-day options. An exhausted no-slip recommendation distinguishes the allocation cap from actual finish-date impact, rather than falsely claiming that every mathematical next day would move the finish.
- Chart curves retain the original hypothetical 11th-day sensitivity at a buffer of 10, now expressly labelled. Selected readouts and task cards say when another allocation is unavailable.
- The interactive network is an accessible group containing task buttons, rather than an image that could obscure the buttons' semantics.
- The advanced explanation now states that risk uses baseline float and fixed weights, while commitment dates use the recalculated schedule. Within the built-in slider limits the short branch can use only 20 of its 22 days of baseline float, so the critical branch cannot change. No new topology or empirical forecasting capability is claimed.
- Return navigation and canonical metadata now point into the maintained site. Existing Library example cards retain their images, detailed explanations and limitations. This page has no stored user state to migrate. The old source URL becomes a bookmark forward retaining query and fragment.

## Verification boundary

`node --test tests/final-risk-gradient.test.cjs` passes 11 tests: independent source-to-sink path enumeration for baseline, all 128 slider corners and out-of-range schedule crossover cases; exact baseline slack; independently weighted exponential risk and one-day rankings; monotonic/bounded responses; input sanitisation; and JSDOM checks for live slider identity/focus, recommendations, caps, reset and network selection. The out-of-range schedule cases test the general routine, not a capability offered by the sliders.

These are model and DOM checks. Real-browser, deployed-route and repository-retirement checks belong to the overall migration receipt. This migration does not claim new empirical validation.
