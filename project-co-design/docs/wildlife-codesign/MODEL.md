# Wildlife crossings: a finite compositional co-design

This experiment asks which complete bridge, guide-fence and monitoring configurations can provide a requested capability, and which resource commitments remain incomparable. It develops the wildlife branch of the Project Co-design foray by making the component obligations executable. The setting is an invented roe-deer crossing network. Every capacity, price, land allowance, staffing coefficient and support ratio is a declared synthetic assumption, not an estimate or ecological finding.

[Open the app](../../apps/wildlife-crossing.html). It is a standalone offline HTML file. The model is embedded byte-for-byte from [model.cjs](model.cjs); [API.md](API.md) gives the complete executable contract. No network service or external library is used by the app.

## The mathematical object

Let functionality be the naturally ordered non-negative integer capacity, and let resources be `(capital, land, annual expense)` with componentwise order. Lower resource use is preferred in each coordinate; there is no conversion into a single preference score. The implementation set consists of complete compatible triples `(b,f,m)`, drawn from fixed bridge, fence and monitoring catalogues.

For a bridge bundle, `exec(b,f,m)` is the sum of its stipulated crossing capacities. `eval(b,f,m)` is the componentwise sum of all three suppliers' resource vectors. The functionality label in the interface, “model crossings/day”, is a stipulated design capability. It is not a measured or predicted rate of animal use.

These are the elements of a finite design problem with implementations in Zardini's sense: distinct functionality and resource posets, an implementation set, and explicit execution and evaluation maps. The component design problems expose required and provided quantities on typed interfaces. The composed implementation set is the constrained product

```
I = {(b,f,m) :
     bridge.guideNeed <= fence.guideProvided,
     bridge.observationNeed + fence.observationNeed <= monitor.pointsProvided}
```

Guide kilometres are compared with guide kilometres, and observation points with observation points. The addition of two observation obligations is an explicit aggregation operation; no compatibility check substitutes one type for another. The source for the DPI and compatible-product construction is [Zardini, Co-Design of Complex Systems, chapter 3, especially definitions 3.3 and 3.17](https://www.research-collection.ethz.ch/handle/20.500.11850/648075). The treatment of minimum resources as an antichain follows [Censi, A Mathematical Theory of Co-Design](https://arxiv.org/abs/1512.08055v7).

This is a concrete use of compositional co-design. It is not a new category-theory result or a general solver for arbitrary feedback diagrams.

## Fixed catalogues and complete accounting

There are 20 unordered bridge bundles: zero to three bridges, each of width 30, 50 or 70 metres, including mixed bundles. The three individual bridge types have capacities 45/75/105, capital costs £4,225,000/£6,255,000/£8,306,000, land requirements 6,000/10,000/15,000 m², and annual upkeep £44,900/£65,500/£86,600. Every bridge requires 2 km of guide fencing and two observation points.

The seven fence choices are none, or 2/4/6 km of standard or durable fencing. Standard fencing costs £100,000 capital, 500 m² of land and £2,000 yearly upkeep per kilometre. Durable fencing costs £160,000 capital and £1,000 yearly upkeep per kilometre, with the same land. Each two kilometres adds one observation point to the monitoring obligation.

The seven monitoring choices are none, or 3/6/9 points with field or assisted review. For `p` points, field review costs `50000 + 30000p` pounds of capital, `800p` pounds of yearly equipment expense and `0.1p` staff FTE. Assisted review costs `120000 + 45000p` pounds of capital, `2000 + 1400p` pounds of yearly equipment expense and `0.04p` FTE. Both charge staff at £55,000 per FTE/year. Both use existing fence mounts and add no land in this declared model.

All staff expense is included in annual resources. Staffing is displayed to explain that cost; it is not an omitted fourth objective. Resource arithmetic uses whole pounds, whole square metres and pounds/year. The main result rounds for readability; the method tables, model and exported receipt preserve exact amounts.

These fixed catalogues yield 980 Cartesian triples and 239 compatible complete implementations. Surplus fencing or observation capacity is allowed. In particular, the zero-bridge choice may be paired with unnecessary support equipment when the two interface inequalities permit it. The all-zero implementation dominates these additions at a zero target. Zero work is an ordinary catalogue option, not a claimed categorical identity morphism.

## Composition before minimisation

The production solver evaluates both groupings:

1. Join bridges and fencing, retaining their combined observation requirement, then join monitoring.
2. Join fencing and monitoring, exposing provided guide kilometres and residual observation capacity, then join bridges.

The second construction uses `monitor.points − fence.observationNeed` only for pairs where this residual is non-negative. It retains the residual interface until the bridge requirement has been checked. Both groupings return the same 239 complete implementation witnesses, including component identities, interfaces and resource totals. This is an executable equality of the two evaluations of this finite wiring, verified against an independently flattened catalogue.

There is no intermediate Pareto pruning. Projecting onto cost before joining could discard a component whose different interface obligations matter downstream. Only complete compatible implementations are filtered by the request and then minimised. All implementation witnesses sharing a minimal resource tuple are retained. The interface presents one representative per resource tuple; the export preserves every retained witness.

The supported target is every integer from 0 to 330. Available sites range from zero to three, so maximum capacity is 315. Site availability restricts implementations; it is not a fourth minimised resource. Optional capital and land ceilings are upper bounds in whole pounds and square metres. Blank means unrestricted; zero means zero. The full supported API bounds are recorded in [API.md](API.md).

For a fixed catalogue, site bound and resource ceilings, raising the target restricts the feasible implementation set. Relaxing a ceiling enlarges it. This is the relevant order behaviour. The resulting Pareto points need not be nested sets, and monotonicity does not prohibit the user from lowering a requirement and solving again. No construction-time path, ecological dynamics or project schedule is modelled here.

## What the construction changes

At target 110 or 120, the old equal-width 50 + 50 m recipe is dominated by 30 + 50 m with identical support. The mixed pair provides 120 stipulated capacity and saves £2.03m capital, 0.40 ha land and £20,600 annual upkeep. The old pair provides 150; that surplus is unnecessary for these requests. The comparison is query-dependent, not a claim that the smaller pair dominates the larger one for every functionality requirement.

The default frontier has three resource tuples, all implementing the mixed pair:

| Capital | Land | Annual expense | Fence and monitoring |
| --- | --- | --- | --- |
| £11,110,000 | 1.80 ha | £156,200 | Standard, field |
| £11,270,000 | 1.80 ha | £142,000 | Standard, assisted |
| £11,510,000 | 1.80 ha | £138,000 | Durable, assisted |

At target 80, both one 70 m bridge and two 30 m bridges remain represented. The pair uses less land; the single crossing can use less capital and yearly expense. There are six resource tuples. A scalar cost ranking would hide this choice. At zero, the zero-work implementation is sufficient. Above 315, no implementation is available, even with three sites and no resource ceilings.

## Evidence and limits

The ecological sources motivate the connected-system question. [National Highways' M25 Junction 10 account](https://nationalhighways.co.uk/roads-and-travel/road-projects/m25-junction-10-project-profile/m25-junction-10-and-the-environment/) describes the Cockcrow green bridge with mammal-guiding hedges, habitat measures and long-term management and monitoring. [DMRB LA 108, Biodiversity, section 4](https://www.standardsforhighways.co.uk/tses/attachments/af0517ba-14d2-4a52-aa6d-1b21ba05b465?inline=true) identifies matters a monitoring proposal must address. Neither supplies this catalogue's numbers. This app does not establish safe crossing rates, ecological effectiveness, a field monitoring plan or a real project estimate.

The independent [oracle](oracle.mjs) reconstructs the catalogues and flattened product without importing production catalogue, composition, witness, query or Pareto helpers. [Results](results.json) record 14,262 query comparisons, all 239 witness reconstructions, 11,644 monotonicity checks and both grouping comparisons. Coverage includes every supported target and site bound across eight cap profiles, individual resource boundaries and selected joint boundaries; it is not every arbitrary pair of numeric ceilings. The independent [review](REVIEW.md) explains the scope.

The reviewed model SHA-256 is `cd86bef7f805f756a771ab1ead7197e947208c734a4971e2b7a98cf23795398e`. Run `node oracle.mjs` in this directory to reproduce the mathematical check. The separate [browser checks](browser.cjs) and [browser results](browser-results.json) cover actual controls, selected witnesses, exact breakdowns, export, URL reload, invalid/zero/infeasible requests, keyboard tabs and phone layouts. These establish bounded computation and interface behaviour; they do not establish human usefulness or field validity.
