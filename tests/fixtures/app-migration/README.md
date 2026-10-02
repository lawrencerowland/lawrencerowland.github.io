# App migration fixtures

The `before` CSVs are the repaired general collection catalogues at pinned commits Project-web-apps `a83541f` and React_proj-apps `12957f3`, captured before the specialist move. `after` fixtures remove only the 14 migrated names (11 web, 3 React), using Python standard-library CSV parsing, independently of the page loader.

These are test data, not another public catalogue or app implementation. The fixtures exercise the real page loader against both release states: during transition the source catalogues may still list moved rows; afterwards those rows are absent. Neither state now renders named-home entries as ordinary cards. An exact old `?app=<slug>` query exposes its maintained destination, forwarding other query parameters and the fragment. Remaining source rows stay visible, with their usual query highlights.

The `current-before` Project Apps fixture is the exact catalogue from commit `1a71864699894e8a34e007d50d2ed69b3a6e4c8c` on 2 October 2026. `current-after` removes only the four rows for `decision-tree`, `project-risk-gradient`, `frobenius-dsm-explorer` and the duplicate `social-debt-explorer` cross-listing. Every other byte is retained and checked. React's current 16-row catalogue at `338469d49e7c706adc70d7b1542957371d47161b` is represented by the existing `after` fixture. Current-source tests verify 77 remaining combined cards both before and after the source catalogue catches up.

`provenance.json` records source revisions and row counts. The dependency-free test uses the actual page script and a small DOM/fetch harness. Its optional argument executes the script extracted from the built Jekyll page as well.
