# Independent wildlife composition review

Model `wildlife-dpi-1`, checked 6 September 2026 at 22:19 UTC. Source SHA-256 `cd86bef7f805f756a771ab1ead7197e947208c734a4971e2b7a98cf23795398e`.

**Pass for the declared finite model.** The independent oracle reconstructed all component options and resource arithmetic from the written contract, using count-based bridge bundle enumeration. It did not import the production catalogue, join, witness, query or Pareto helpers. It independently flattened980 triples into239 compatible complete witnesses. Both production join groupings returned exactly those witnesses, including their interfaces, resource values and component IDs.

The source implements an actual finite co-design problem with implementations: bridge requirements are connected to provided fence coverage, the combined observation obligation is connected to monitoring coverage, and the exposed resource vector sums capital, land and annual burden. The second grouping exposes residual observation capacity and preserves it until bridge compatibility is checked. The same external relation survives the change of grouping. No intermediate cost projection discards a downstream interface.

The source basis is Zardini's *Co-Design of Complex Systems*, definitions3.3 and3.17 and section3.4 (the implementation product constrained by interfaces, and minimal-resource queries with witnesses), plus Censi's manual tutorial2.10–2.13 (catalogues, multiple minimal solutions, composition and reusable interfaces). Public bibliographic pointers: [Zardini dissertation](https://www.research-collection.ethz.ch/handle/20.500.11850/648075), [Censi's mathematical theory](https://arxiv.org/abs/1512.08055v7), [Censi manual](https://andreacensi.github.io/mcdp-manual/mcdp-manual.pdf).

The completed executable checks cover:

- 14,262 production/oracle query comparisons: every integer target 0–330, every site bound 0–3, eight cap profiles, every distinct capital/land boundary and one integer below it at five demands, and paired cap boundaries at every complete witness.
- 239 independent witness reconstructions, malformed/incompatible IDs and query-failed receipts.
- 11,644 demand/cap monotonicity comparisons. These concern nested feasible sets, not frontier size.
- Exact retained resource groups and all equal-resource witnesses.
- Target 0/no sites/zero caps returns the all-zero tuple; target 316 is infeasible in the catalogue.
- At target 120, the old equal-width [50,50] choice is strictly dominated by [30,50] with identical fencing and monitoring. The corrected frontier uses the mixed-width bundle.
- At target 80, both [70] and [30,30] remain represented, demonstrating a real incomparable trade-off.

The default model frontier is (£11.11m,1.8ha,£156.2k/year), (£11.27m,1.8ha,£142k/year), and (£11.51m,1.8ha,£138k/year). Each has an implementing bridge/fence/monitoring tuple. This is exact for the declared integer catalogue and arithmetic, not a prediction of animal usage or an ecological/safety validation.

Cap tests cover explicit profiles and all individual resource thresholds, not every joint combination of arbitrary numeric cap values. No assertion of a generic category-theory theorem prover, general MCDP loop solver, real-world calibration, construction-stage proof or field validation is made. The public UI and deployment are checked separately by the implementation team.

Reproduce with `node oracle.mjs` in this directory. `results.json` records the coverage, source hash and examples. The reviewed model and oracle are standalone; no third-party package is required.
