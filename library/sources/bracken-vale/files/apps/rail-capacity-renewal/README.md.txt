# Where capacity binds — working trial 1.4

## Job and preserved intention
Compare a baseline with a resource-specific renewal/capacity intervention. The local numerical version preserves separate passenger/freight demand and service, all resource constraints, commissioning delay, temporary restriction, investment stock/spend and an infrastructure-only cash account. Five resources provide a compact synthetic example; all coefficients and costs are invented. No scenario edits propagate to other apps.

## Construction and equations
Each of up to 36 monthly steps represents an editable number of service hours at a continuous average rate. Demand grows as P(t)=P0(1+gP)^t and F(t)=F0(1+gF)^t. Each resource load is aP×P+aF×F. Its usable budget is max(0,(gross budget+commissioned addition)×availability−temporary restriction), in resource-minutes per representative hour. The common served fraction is min(1, usable/load for each positive load). No demand gives a fraction of one and zero served flows. Passenger and freight outputs remain separate.

Works run from `start` through `start+delay−1`; added budget and renewed availability apply at `start+delay`. Equal spend over works months reconciles to the stated total investment. Income is `(served P × access £/P movement + served F × access £/F movement) × representative hours`. Cash is income minus operating cost and capital spend. There is no ticket revenue, depreciation, discounting or official charging methodology.

## Walkthrough and reference
Use **Compare intervention** to move the investment from Junction to Station. **Inspect month** shows why the unchanged junction still binds. Change delay or works restriction and inspect both service and money tables. **Update resource** changes an assumption in both baseline and trial. The shared shell resets inputs and recomputes the trajectory.

Opening baseline: P=4, F=1, Junction load=5×4+10×1=30, usable budget=30×0.8=24. Track load=4×4=16, budget=32. Other resources are nonbinding. Fraction=0.8; served P=3.2 and F=0.8. Raising a nonbinding resource alone has no service effect. With the default start 2 and delay 2, commissioning first occurs in month 4. £16,000 spending is £8,000 in each of months 2 and 3.

## Checks and boundaries
`node --test apps/rail-capacity-renewal/app.test.mjs` runs five tests: independent reference/zero demand, nonbinding counterexample, delayed commissioning and resource/cash reconciliation, reset/determinism/atomic edit, and import/presentation failure handling. The model is deterministic; no stochastic inputs or seed controls are presented.

A resource-budget spreadsheet is the simpler comparator. This is a continuous teaching allocation, not a fair/optimal policy, timetable, engineering model, calibrated forecast or investment appraisal. A real application would need validated operating constraints, resource coefficients, financial boundaries and scenario data. No operational or investment use is claimed.
