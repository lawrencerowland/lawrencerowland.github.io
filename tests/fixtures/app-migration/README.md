# App migration fixtures

The `before` CSVs are the repaired general collection catalogues at pinned commits Project-web-apps `a83541f` and React_proj-apps `12957f3`, captured before the specialist move. `after` fixtures remove only the 14 migrated names (11 web, 3 React), using Python standard-library CSV parsing, independently of the page loader.

These are test data, not another public catalogue or app implementation. The fixtures exercise the real page loader against both release states: during transition the source catalogues may still list moved rows; afterwards those rows are absent. Both must show all 14 specialists once, with direct new-home links and working query highlights. Remaining source rows remain visible.

`provenance.json` records source revisions and row counts. The dependency-free test uses the actual page script and a small DOM/fetch harness. Its optional argument executes the script extracted from the built Jekyll page as well.
