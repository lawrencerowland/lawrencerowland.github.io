# Gimmer comparison

One fictional refuge, nine questions and nine small executable models. Open `index.html` through an HTTP server; the canonical public route is https://lawrencerowland.github.io/gimmer-comparison/.

- `models.js`: DOM-free finite models; explicit assumptions and no external dependencies.
- `app.js`: controls, generated views, reproducible query/fragment state, exports and comparison matrix.
- `method.html`: public method contracts, limits and source links.
- `../assets/gimmer-comparison.css`: responsive interface styling.
- `../tests/gimmer-comparison.test.cjs`: counterexamples, independent finite enumerations, replay, PDDL parity and navigation contracts.
- `export-standalone.cjs`: generates a convenience standalone HTML; the source above remains canonical.

Run `node tests/gimmer-comparison.test.cjs` from the repository root. After Jekyll builds the site, run `node tests/gimmer-comparison.test.cjs _site` and the existing directory check. GitHub Actions runs these alongside the site's existing checks.

The comparison supersedes the July illustrative page. Generated plan alternatives, dynamic state exploration, all-view compatibility, typed interface/resource checks, proposal acceptance, finite staged co-design, goal-to-work planning and finite evidence decisions replace preset result messages. The source guide distinguishes every small implementation from the broader native research.

The original nine research programmes remain independent. Publication of this comparison is not a claim of general mathematical results, engineering validity or measured human learning.
