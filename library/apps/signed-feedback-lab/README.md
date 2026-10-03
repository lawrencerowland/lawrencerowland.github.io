# Signed feedback lab

Historical source names, revisions and hashes below identify the reviewed inputs; they are not retrieval links. [Maintained source and verification files](https://github.com/lawrencerowland/lawrencerowland.github.io/tree/master/library/apps/signed-feedback-lab).

A bounded Library example for **Delivery dynamics & feedback** (`delivery-dynamics`). Open `index.html`; it uses local HTML, CSS and JavaScript with no runtime dependency or build step. The diagram and thumbnail are native SVG.

The entrance is a small, explicitly assumed project scenario: review pressure requests rework; correction reduces review pressure; rework reveals evidence gaps; those gaps trigger further review. Signals are dimensionless deviations from a baseline, not quantities of actual work. This is not a calibrated project or nuclear governance simulator.

## Source and preservation

Reviewed source: `lawrencerowland/Project-web-apps@8221f32b398d582801e639b5460aa674805f1671`, 3 October 2026. The source repository's `LICENSE` is CC0 1.0 Universal. No matching TSX/JSX version was present.

| Original | SHA-256 | Receiving treatment |
| --- | --- | --- |
| `lawrencerowland/Project-web-apps@8221f32b398d582801e639b5460aa674805f1671:web_apps/SMR_governance_simulator.html` | `1e050043a60b6d2b5be2a64707ba3470d2d99b5c675453b1f7a4ea8af2bb3654` | Three-state/four-link model and useful interactions reimplemented here; the historical identity and hash record the reviewed HTML; no duplicate runtime or predecessor archive is retained. |
| `lawrencerowland/Project-web-apps@8221f32b398d582801e639b5460aa674805f1671:web_apps/SMR_governance_simulator_av.dot` | `9ed272b8d9d47fbeae74cbb12375d886a546ecc5c681b6f0adcfb1f5953048a6` | Preserved byte-for-byte as [`original-governance-av.dot`](original-governance-av.dot), linked for download. |

The “Original governance labels” preset retains Regulator, Operator, Oversight; initial values `[1, 0.2, 0]`; gains `[0.35, -0.25, 0.20, 0.30]`; and Licence conditions, Incident reports, Parliamentary pressure, Transparency metrics. The default delivery preset changes labels only. Node IDs (`Reg`, `Op`, `Ov`) and link IDs remain stable for data interchange.

| Source feature / explanation | Maintained implementation |
| --- | --- |
| Three core states, four editable directed signed links | Same topology and simultaneous matrix update; accessible labelled numeric controls instead of canvas prompts. |
| Four intermediate “accountability vector” nodes | Four activity/contribution boxes, with directed arrows, signed gains and current values; equivalent readable table. They are algebraic, not additional dynamic states. |
| Step, autorun, pause | Step one tick, Run at 500 ms, Pause; background tab pauses. |
| Reset | Explicit Restart current model (keep applied parameters) versus Restore example (restore supplied parameters); both stop autorun and reset tick/history. Applying parameter edits also starts a paused run at tick zero. |
| Tick, spectral radius, max absolute state | Retained, with full eigenvalues, exact matrix, loop products and readable stability qualification. |
| Static DOT report | Exact historical file retained; a separate current DOT export applies each gain once and passes the contribution onward with gain 1. |
| Explanations of link contributions, stepper and policy nudge | Corrected mathematical explanation, scenario assumptions, suggested experiments, cited stability/polarity definitions and explicit limits. |

New conveniences are complete model JSON import/export, full trajectory CSV, history chart/table, three illustrative delivery presets, input validation, numerical run limits and a pictured Library entrance. JSON is configuration only; importing starts at tick zero. No state is sent to a server or persisted automatically.

## Corrections and model contract

With nodes ordered Reg, Op, Ov and gains `a=e1`, `b=e2`, `c=e3`, `d=e4`:

```text
W = [ 0 b c ]          x(t + 1) = W x(t)
    [ a 0 0 ]          contribution_e(t) = gain_e × source_e(t)
    [ 0 d 0 ]          next destination = sum of incoming contributions

det(λI − W) = λ³ − abλ − acd
```

1. The source's real power iteration plus Rayleigh quotient does not reliably estimate the spectral radius for signed, non-symmetric matrices, notably complex conjugate eigenvalues. `eigenvalues3` calculates all roots of the scaled 3×3 characteristic polynomial via real Cardano/trigonometric branches, including the complex pair. It is a small floating-point implementation, not a general large-matrix eigensolver.
2. Decay means every starting state tends to zero for fixed W when `ρ(W) < 1`. A radius above 1 means a growing mode exists, not that every chosen state grows on every tick. The UI calls values within `1e-9` of 1 **Boundary**, not automatically “marginally stable”; repeated unit roots may need further analysis.
3. An edge is same-direction (+) or opposite-direction (−). Reinforcing/balancing describes a whole loop's sign product. The two original cycle products are −0.0875 over two links and +0.021 over three; neither is the coupled system's spectral radius.
4. The source's `B ← B + AV` wording contradicted its actual replacement update. The maintained equation sums contributions into the **next** state with no retained `+x(t)` term. This is a discrete map, not an Euler integrator of an unspecified continuous model.
5. Intermediate nodes have no independent state or delay. They display contributions from the currently visible state **for the next tick**, avoiding the source's previous-contribution/current-state mismatch. The historical name “accountability vector” is retained in explanation, but an activity label does not prove who is accountable.
6. The source Reset retained edited gains and could continue autorunning. Restart and Restore now make these separate outcomes explicit and always pause.
7. Governance/nuclear labels provided no sector mechanics or empirical basis. They remain an optional source-faithful view; the primary scenario states its assumed, illustrative nature.

Limits are ±1,000,000 for gains and starting signals, 100 printable characters per label, 100 KB input JSON, 500 ticks, and a stop before any signal exceeds `1e12`. Invalid imports are rejected before changing applied data. Long diagram labels are shortened visually; the table retains their complete text. No clipping or saturation is added to the mathematical update.

## Technical references

- Stephen Boyd, Stanford EE263, [Lecture 11: Eigenvectors and diagonalization](https://ee263.stanford.edu/archive/eig.pdf), especially slide 11–34, for the discrete-time eigenvalue stability criterion and complex modes. [Lecture 12: Jordan canonical form](https://ee263.stanford.edu/archive/jcf.pdf) explains why repeated eigenvalues require attention to block structure. These mathematical references do not validate this toy scenario.
- David N. Ford (2019), [A system dynamics glossary](https://doi.org/10.1002/sdr.1641), for the difference between causal-link polarity and feedback-loop polarity. This discrete map is not a stock-and-flow implementation of all system dynamics concepts.

## Verification

From the repository root, with Node 22 or later and the existing `tools/library-apps/node_modules/jsdom` installation:

```sh
node --test library/apps/signed-feedback-lab/tests/*.cjs
```

Model tests use hand-calculated first/second updates and independent known spectra: diagonal, real repeated, nilpotent, complex rotation and cube-root matrices. They cover both sides of the unit-circle boundary, defective unit roots, transient amplification, zero initial states in an unstable system, topology/data validation, exact-once DOT gains, JSON/CSV outputs and run-stop semantics. UI tests cover Step/Run/Pause, duplicate autorun prevention, parameter apply, restart versus restore, example switching, valid/invalid JSON import, inert imported labels and all three download controls.

The parent integration audit also compared this implementation against NumPy eigenvalues for 504 matrices (250 general, 250 with the source topology, plus boundary/Jordan cases): worst normalized root error 1.17×10⁻⁸ and spectral radii agreeing within 10⁻⁶. This is numerical implementation evidence, not real-world model validation.

Local browser checks on 3 October 2026 confirmed the desktop diagram and controls, Enter-key stepping, Run/Restart pausing, the growing preset, and an edited JSON round trip (gain 0.7, tick 0, paused). At a 390-pixel viewport, the body/document stayed within the viewport; the diagram used its labelled internal horizontal scroll area and the readable table remained available. The browser reported no console errors or warnings. The viewport override was reset after checking.

The receiving site's link/build checks and publication remain integration responsibilities. Passing tests or a local preview does not establish live deployment or human usefulness.
