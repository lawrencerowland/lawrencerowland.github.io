# Project Co-design

Interactive experiments in coupled project choices: the assets, the programme and the path that delivers them.

**[Open the foray site](https://lawrencerowland.github.io/project-co-design/)**

The site brings Forays 180 and 182 together, with the related wildlife-crossing experiment from Foray 181. It offers three independent ways into the investigation:

| Question | Experiment | Contribution |
|---|---|---|
| What else has to change? | [Incremental rail upgrade](apps/incremental-upgrade.html) | Visual couplings between platforms, signalling and power, with illustrative stage gates. |
| Which trade-offs are worth making? | [Programme co-design studio](apps/programme-studio.html) | Package and governance alternatives, four supplied staging strategies, and illustrative schedule/risk feedback. |
| Can we keep the whole promise? | [Staged path co-design](apps/staged-paths.html) | Exact finite generation of feasible delivery paths under service, milestone, crew and access constraints. |

These are learning routes, not a maturity ranking. Each app retains its own assumptions and implementation. The consolidation supplies a shared home and navigation; it does not merge the models or make their outputs interchangeable.

[Rail staging simulator](apps/rail-simulator.html) and [Transit trade-offs](apps/transit-tradeoffs.html) remain available as earlier experiments. [Wildlife-crossing co-design](apps/wildlife-crossing.html) provides a related application.

The [staged-path method note](docs/rail-staged-codesign-method.md) documents its mathematical construction, primary sources, scope and independent verification. These are illustrative models, not calibrated railway plans.

## Structure

- `index.html` — responsive, accessible static landing page with inline styles and no runtime dependencies.
- `apps/` — independent interactive HTML experiments.
- `docs/` — method and reproducibility material.

The site lives in `project-co-design/` on the `master` branch of [lawrencerowland/lawrencerowland.github.io](https://github.com/lawrencerowland/lawrencerowland.github.io/tree/master/project-co-design). GitHub Pages serves this directory without a build step. Each app is linked directly and retains its own model.
