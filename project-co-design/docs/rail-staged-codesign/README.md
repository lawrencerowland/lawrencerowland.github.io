# Reproduce the staged co-design experiment

The app is a self-contained offline HTML file: [`../../apps/staged-paths.html`](../../apps/staged-paths.html). The [method note](../rail-staged-codesign-method.md) defines the model and claim boundaries.

## Exact finite checks

No dependencies beyond Node.js:

```sh
node project-co-design/docs/rail-staged-codesign/verify.mjs
```

This imports `model.cjs`, the exact engine embedded in the app, and compares it with the independently written all-history `oracle.mjs`. The command writes `results.json` beside the checker. Optional arguments replace the engine path and output path. `results.json` is the retained successful run, including the parameter rows and a temporary-bridge witness.

## Browser action checks

Install Playwright and its Chromium browser in your own test environment, serve the repository root on port 8770, then run:

```sh
REQUIRE_INDEX=1 node project-co-design/docs/rail-staged-codesign/browser.cjs
```

Optional environment variables: `APP_URL` selects another local or deployed page; `PLAYWRIGHT_MODULE` supplies a Playwright module path; `CHROMIUM_PATH` selects an installed Chromium browser; `QA_DIR` changes the temporary result directory. The checked action loops cover valid and invalid inputs, correction, reload, URL sharing, JSON export, the seven worked cases, keyboard selection, responsive layouts, earlier-app return and gallery discovery. `browser-results.json` records the successful migration test run; the local experiment receipt records the commit, served-file comparisons and retained screenshots.

The application creates no account or server record. Sharing retains the applied brief in a URL. Export downloads a local calculation file. Path selection and replay position are deliberately temporary. No file is overwritten by application controls.
