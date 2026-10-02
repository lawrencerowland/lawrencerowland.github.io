# Interface Maturity

Migrated from `Project-web-apps/web_apps/interface_maturity_simulator.html`, revision `9d9c253f9c203441be1fd301bcb9a6b976b85d4f`; reviewed 2 October 2026. Home: Delivery dynamics. The source file's SHA-256 was `342fb2b61d30716f85975ba40728a7b6b6fa268608cf95fe750047d608eb801a`.

Preserved: five interfaces/attributes, coupling waves, shared-party and weighted spillover, friction and threshold rules, four scenarios, heatmap/sparklines, network, dashboard/history, action log, undo, editable assumptions, CSV/conceptual mapping exports and simulation-state import/export. The mapping is explicitly not an official SharpCloud API format.

Corrections: absolute intervention holds the selected attribute for the whole step; only realised local changes spill over; zero actions are inert; friction affects beneficial changes according to each variable's direction. The global threshold penalty remains an explicit once-per-action assumption. Scenarios remain direct exogenous changes without the coupling engine. Imports validate fully before replacing state, accepting the original JSON shape. Restored configuration is reflected in controls; Reset resets configuration too. Directional coefficients are preserved in exports with four decimals. No browser storage is used or cleared.

Accessibility: keyboard buttons for tabs/matrix selection, visible focus and errors, chart values/history text, labelled export fields, responsive stacked layout and internal table scrolling. Original explanations and views retained, with invented assumptions and uncalibrated-index limits made explicit.

Verification: `node --test tests/eight-data-models.test.cjs`. Browser journeys: set baseline PM↔Design Trust 55 to 60, undo; zero nudge; change assumption; run scenario; inspect all four views; export/reload state; reject malformed state without losing current values; mobile/keyboard review.
