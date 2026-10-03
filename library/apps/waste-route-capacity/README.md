# Find the queue in a waste route

Reviewed 3 October 2026. Library subject: **Delivery dynamics**. Canonical route: `/library/apps/waste-route-capacity/`.

This is a fictional capacity and queue experiment. It is not a digital twin, facility model, waste-acceptance assessment, hazard forecast or operational recommendation. No measured input is supplied. Open `index.html`; it has no external scripts, build step, storage, network requests or export/import state to migrate.

## Preserved operations

- Fractional FIFO cohorts through characterization, segregation, size reduction, packaging, assay, storage and transport; original arrival dates survive every split and rework visit.
- Editable incoming flow, all processing capacities, storage size, early release fraction, assay rework and a fictional packaging-allowance/rework trade-off.
- Planned assay/transport outages, Gaussian arrival perturbations, independent random outage starts with fixed duration, and reproducible seeded stress samples.
- Baseline, transport interruption, assay constraint, extra packaging, no early release, increased capacity/buffer and small fractional-flow presets.
- End-of-day queues, available-capacity utilization, heuristic pressure-day attribution, daily throughput, shipment lead-time chart, unfinished material/age and storage blocking.
- Stress percentiles and blocked-day distribution, accessible chart descriptions and exact daily tables. Keyboard controls, visible focus, skip link, responsive layout, static no-script explanation, progress/cancellation and stale-result messages.
- The multidimensional-state concept from Hazard Morphospace has an explicit explanatory home at [`#state-space`](index.html#state-space).

## Model semantics and corrections

Every queue stores conserved **material-equivalent units**, an arbitrary bookkeeping quantity, not measured mass, activity or physical volume. First packaging adds a once-only allowance for the scenario, producing **package-equivalents** used by assay, storage and transport. A reworked batch retains its allowance. This corrects the original re-expansion on every packaging visit.

Characterization, segregation, size reduction and packaging capacities use material units/day; assay and transport use package eq/day. Storage uses package eq. A 100% allowance therefore halves the material handled by a given assay/transport capacity. Packaging work, including repeat visits, continues to use material units. There is no capacity saving from size reduction: that is only a stage name here.

Two balances are reported and tested:

1. Arrivals = clean release + shipped material + unfinished material.
2. Arrivals + first-packaging allowance = clean release + shipped package eq + unfinished expanded load.

All entered processing capacities are used directly. The predecessor's unexplained 0.95/1.05 segregation and 0.98/1.05 packaging multipliers were removed. Disabling early release means no material exits by that route; the old “late segregation” preset did not implement an eventual later release, so it is now labelled **No early clean release**. “Conservative classification” is reframed as an invented extra-packaging/rework trade-off, with no implication about safe classification policy.

Daily order is arrivals → characterization → segregation/release → size reduction → packaging → assay/rework → transport. More than one stage can execute on a day; same-day shipments have lead time zero. Rework is appended after packaging has executed, so its earliest next packaging visit is the next day. FIFO means order of entry into each queue, not global order by original arrival date after rework. No physical transit/service delay is modelled.

Assay is limited by space for its passing fraction before transport executes. There is no direct cross-docking; even with available transport, zero storage blocks positive assay demand. **Storage-blocked days** require positive material that available assay capacity could have processed but cannot pass into storage. Empty zero-storage runs record zero blocked days. “No place” no longer means an arbitrary full-buffer threshold. Blocked material sums daily prevented work (the same material can recur); it is not a unique volume measure.

Storage peak is sampled after assay and before transport; day-end peak is separately named. Queue charts use material units; the daily table's storage/shipment columns use package eq. Lead times are quantity-weighted shipment age and exclude unfinished work. Unfinished mean/oldest age are separately shown; neither predicts eventual completion. No shipments gives missing lead time, not zero. Stress lead-time summaries omit those runs and expose the contributing count.

Utilization is processed quantity divided by available capacity, excluding planned/random outages. An entirely unavailable stage shows no ratio. Repeated visits count as processing. Pressure attribution is a heuristic: final daily queue / entered daily capacity, using package eq for assay/transport. Positive queues at zero capacity rank first; route order resolves ties. Empty queues have no winner. Storage blocking is separate. This is neither a proved bottleneck nor a highest-leverage recommendation.

For stress throughput, the displayed P50/P80/P95 are **exceedance** amounts (empirical Q50/Q20/Q05). For lead time, peak storage and blocked days, they are ordinary Q50/Q80/Q95. Percentiles use linear interpolation. Sample frequencies are not calibrated probabilities. Gaussian standard-normal draws are bounded to ±4 and negative arrivals are clipped to zero; nominal SD is therefore not the realized coefficient of variation. Outage start draws occur only when the corresponding random outage is inactive, including during planned outages. A duration includes its start day; planned/random overlaps run concurrently and do not extend each other.

## Bounds and repeatability

Model validation rejects missing, non-number, non-finite, negative or out-of-range values and fractional integer fields. Horizon is 1–730 days; nominal rates are 0–200; storage is 0–10,000; rework is 0–80%; clean release is 0–90%; expansion is 0–100%; runs are 2–100. A positive outage duration requires start day ≥1. Outages starting after the horizon simply have no effect. Stress work is additionally limited to 30,000 run-days. A one-million batch-operation guard stops pathological fragmentation without presenting partial results.

The base seed is an unsigned 32-bit integer, using a fixed Mulberry32-style PRNG. Run i uses `(baseSeed + i × 0x9E3779B9) mod 2^32`. Each stress run is synchronous and bounded; the browser yields between runs for progress and cancellation. Editing inputs cancels an active stress job and marks the prior deterministic result stale. No partial stress sample is reported as complete. Repeating inputs and seed reproduces the sample in this implementation.

## Historical inventory example disposition

The old SIXEP/2X26 preset and its README mixed a claimed 38 m³/year inventory figure with fictional capacities. The exact inventory edition, page and conversion basis were not verified for this migration. **No historical quantity, route permission, waste-acceptance claim, site capacity or calibration is retained as fact.** The new small-flow preset is wholly fictional and deliberately uses simple rounded values. The original claim remains inspectable only in the pinned predecessor source below; it is not evidence for this app.

## Hazard Morphospace disposition

**Combine its useful multidimensional-state explanation here; retire the old executable.** The direct replacement home is [`index.html#state-space`](index.html#state-space), rather than a second Library card.

The original scene compared five labelled work packages and four waste-category markers using chemical hazard, radiological intensity, structural integrity, and a time slider. Its “inspection cadence” simply sped linear interpolation between invented endpoints. It had no inspection, intervention, degradation, radiological or structural model; category coordinates were not comparable observed package states. Internal citation tokens did not supply usable source support for its precise-looking historical claims.

The replacement preserves the three distinct dimensions, the need to interpret direction separately on each axis, and the distinction between state and change over time. A compact **fictional ordinal state-card figure** compares an initial description, an observation and an assumed intervention. It explicitly shows that better knowledge is not automatic physical improvement and that one concern can remain high when another changes. It has no numerical trajectory, category coordinates, inspection multiplier or automatic hazard reduction. The figure is deliberately independent of the queue model. Original package names, invented coordinates and unsupported nuclear claims are retired; the source remains in history.

## Exact provenance

Read-only predecessor revision: `9eb0973712a2d096c0642754ab238f7be7af41b1` in `lawrencerowland/Project-web-apps`:

- [Waste Route & Capacity Digital Twin HTML](https://github.com/lawrencerowland/Project-web-apps/blob/9eb0973712a2d096c0642754ab238f7be7af41b1/web_apps/waste-route-capacity-digital-twin.html)
- [Its README and inventory claim](https://github.com/lawrencerowland/Project-web-apps/blob/9eb0973712a2d096c0642754ab238f7be7af41b1/web_apps/waste-route-capacity-digital-twin.README.md)
- [Hazard Morphospace HTML](https://github.com/lawrencerowland/Project-web-apps/blob/9eb0973712a2d096c0642754ab238f7be7af41b1/web_apps/hazard_morphospace.html)

This migration follows sections 4 and 12 of the 2 October 2026 planning/state-space audit. It rewrites the executable and preserves useful mechanisms, not unsupported claims. `model.js` contains the inspectable queue model; `app.js` provides the controls/charts; `tests/phase-two-waste.test.cjs` checks conservation, empty cases, rework accounting, FIFO, outages, reproducibility, bounds and UI behavior. Browser/deployment evidence belongs in the parent migration receipt; these files alone do not claim deployment or human validation.
