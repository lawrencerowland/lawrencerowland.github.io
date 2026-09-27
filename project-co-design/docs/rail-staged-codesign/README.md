# Reproduce the staged wildlife co-design experiment

The app is a self-contained offline HTML file: [`../../apps/staged-paths.html`](../../apps/staged-paths.html). The [method note](../rail-staged-codesign-method.md) defines the model, its wildlife mapping and claim boundaries.

The legacy directory and action/state IDs remain stable for provenance and trace comparison. Public labels describe passage, guide fencing, monitoring and temporary mobile cover. The exported calculation explains those internal IDs. Readiness is a fictional management requirement across these three modules, not animal-use data or ecological benefit.

## Exact finite checks

No dependencies beyond Node.js:

```sh
node project-co-design/docs/rail-staged-codesign/verify.mjs
```

This imports `model.cjs`, checks that it exactly matches the engine embedded in the app, and compares it with the independently written all-history `oracle.mjs`. The command writes `results.json` beside the checker. Optional arguments replace the engine path and output path; the embedded-engine check applies only to the default engine.

`results.json` records the fresh 27 September 2026 wildlife-edition run, its time and engine SHA256, the 507 parameter rows and a mobile-cover witness. All 507 configurations passed, retaining the original numerical frontiers: staged `(24,5,2)`, `(26,4,2)`, `(26,6,1)` and endpoint `(20,5,2)`, `(23,4,2)`, `(26,6,1)`. The guards, costs, resources and transition logic are unchanged from the rail antecedent. The exact checks include endpoint frontier loss, witness-only reordering, start-state guards, returned temporary equipment and malformed parameters.

## Browser action checks

In a test environment with Playwright and Chromium, serve the repository root on port 8770, then run:

```sh
node project-co-design/docs/rail-staged-codesign/browser.cjs
```

Optional environment variables: `APP_URL` selects another local or deployed page; `PLAYWRIGHT_MODULE` supplies a Playwright module path; `CHROMIUM_PATH` selects an installed Chromium browser; `QA_DIR` changes the temporary result directory. The action loops cover valid and invalid inputs, correction, reload, URL sharing, the wildlife JSON export and key meanings, seven worked cases, keyboard selection, responsive layouts, companion-app return and gallery discovery.

`browser-results.json` is preserved as **historical rail-edition evidence**, with the historical application hash. It is not a fresh wildlife-interface pass. The updated browser script is available for a new run, but the fresh independent model check alone does not establish current browser behaviour, publication, ecological validity or human usefulness.

The application creates no account or server record. Sharing retains the applied brief in a URL. Export downloads a local calculation file. Path selection and replay position are deliberately temporary. No file is overwritten by application controls.
