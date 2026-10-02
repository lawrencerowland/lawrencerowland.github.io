# Date Defense Kit review

Reviewed 2 October 2026. Preserved from `lawrencerowland/Project-web-apps`, app 35, `web_apps/date-defence-kit.html` at source revision `9d9c253f9c203441be1fd301bcb9a6b976b85d4f`; original SHA-256 `3c2d14dcab0f5f7be87266da2f1a999cdacd93d5ca33fbb1eae89d2bcc932d55`.

The Library implementation retains both supplied examples, task/dependency editing, CSV/TSV paste, JSON import/export, saved inputs and narrative, legacy fragment sharing, start dates and two calendar modes, Beta-PERT and triangular simulation in a stoppable worker, histogram/CDF, percentiles/dates, criticality/spread ranking, narrative and top-three what-if. The old localStorage key `date_defense_kit_v1` and `#d=` payload remain supported. No application data is uploaded.

Corrections include separate rendering and insertion (the original duplicated restored task arrays), explicit repair of identical legacy copies, transactional import/schema validation, safe text rendering, finite input/run limits, worker failure recovery, fixed-duration chart support, input/result staleness, and a visible baseline/what-if comparison. Repeated what-ifs start from the baseline. A deterministic seed makes comparisons repeatable. Share links have a selectable manual-copy fallback.

The narrative reports model outputs without claiming confidence-bound commitments, prescribed buffers or the greatest marginal benefit. Duration draws are independent; the model has no resource scheduling, correlation, unlisted risks, cost or holiday calendars. P90−P50 is a percentile gap. Criticality×spread is a heuristic score. Dates round elapsed duration upward and exclude the start instant. Percentiles use linear interpolation of sorted sampled finishes.

Primary context: [GAO Schedule Assessment Guide](https://www.gao.gov/products/gao-16-89g), especially schedule-risk analysis, and [RiskAMP Beta-PERT documentation](https://www.riskamp.com/beta-pert/) for the chosen lambda-4 distribution. Neither validates this application or supplied inputs.

Pure model and actual worker/UI-handler regression checks live in `tests/eight-schedule-models.test.cjs` in the receiving repository. Browser journeys are reviewed separately. The implementation is a bounded teaching example, not a calibrated forecast.
