# WildlifeCoDesign API and frozen finite contract

`model.cjs` is also embedded byte-for-byte in the standalone app. Node: `require('./model.cjs')`. Browser global: `WildlifeCoDesign`.

- `DEFAULTS = {target:110,maxSites:3,capitalLimit:null,landLimit:null}`.
- `normalize(params)` validates whole-number target 0–330, sites 0–3, optional capital ceiling in pounds (0–1,000,000,000) and land ceiling in square metres (0–1,000,000). `null` means no ceiling; zero means a zero ceiling. Reject unknown keys.
- `CATALOGUES`: `baseBridges`, `bridges`, `fences`, `monitoring`; frozen plain objects.
- `compose('bridge-fence' | 'fence-monitor')` returns `{grouping,compatiblePairs,implementations}` for the same fixed design problem, before query filtering. No intermediate Pareto pruning.
- `solve(params)` returns normalized `params`, `frontier`, every query-feasible implementation in `feasible`, `counts`, rejection counts (overlapping), and the maximum capacity at the available number of sites.
- `frontier` groups are `{id,resources,implementations}`. Equal resource vectors retain **all** implementation witnesses.
- Each witness is `{id,parts:{bridge,fence,monitoring},widths,sites,exec:{capacity},interfaces:{fenceRequired,fenceProvided,observationRequired,observationProvided},resources:{capital,land,annual},staffMilli}`. Resources are pounds, square metres and pounds/year. `staffMilli` is thousandths of an FTE, already costed in annual expense.
- `replay(id,params)` reconstructs from catalogue IDs, rechecks both interfaces and the request, and returns `{valid,errors,implementation}`. It does not trust exported resource values.

## Catalogue and compatibility

Unordered bridge bundles of up to three components (including empty): widths 30/50/70m; fictional capacities 45/75/105 model crossings/day; capital £4,225,000/£6,255,000/£8,306,000; land 6000/10000/15000m²; upkeep £44,900/£65,500/£86,600 per year. A bundle of N bridges requires 2N guide-fence kilometres and 2N observation points.

Fence entries: none, or 2/4/6km × standard/durable mesh. Per kilometre: standard capital £100,000, land 500m², upkeep £2,000; durable capital £160,000, same land, upkeep £1,000. Fencing requires one observation point per two kilometres.

Monitoring entries: none, or 3/6/9 point capacities × field/assisted review. For p points: field capital `50000+30000p`, staffing `100p` milli-FTE, annual equipment `800p`; assisted capital `120000+45000p`, staffing `40p` milli-FTE, annual equipment `2000+1400p`. Both cost staff at £55 per milli-FTE per year (£55,000/FTE). Both use existing fence mounts and require no additional land in this model.

The only compatibility inequalities are `B.fenceNeedKm <= F.km` and `B.observationNeed + F.observationNeed <= M.points`. Empty B with excess F/M is allowed by these interfaces; the zero-work tuple dominates it at target zero. No hidden equal-width rule, no forced zero special case, no bridge history or time path.

Group (B,F) first, retaining the observation obligation, or group (F,M) first, exposing residual observation capacity `M.points-F.observationNeed` alongside F's guide-km. Both constructions must return the identical complete witness set. Resources add componentwise.

The target selects provided capacity at least q. `maxSites` restricts implementation availability; it is **not** a fourth minimized resource. Capital/land ceilings restrict admissible resource vectors. All restrictions occur before minimization and are recomputed for every query.
