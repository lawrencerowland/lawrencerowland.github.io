(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ProjectDataChecks = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const CODELISTS = {
    DeliveryPhase: ['Identification', 'Definition', 'Procurement', 'Delivery', 'Handover', 'Closeout'],
    ApprovalStage: ['SOC', 'OBC', 'FBC', 'Gate0_StrategicAssessment', 'Gate1_BusinessJustification', 'Gate2_ProcurementStrategy', 'Gate3_InvestmentDecision', 'Gate4_ReadinessForService', 'Gate5_OperationsReview'],
    RAG: ['GREEN', 'AMBER_GREEN', 'AMBER', 'AMBER_RED', 'RED', 'UNCLEAR']
  };
  const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const finiteAmount = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  const uuid = /^urn:pds:project:[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
  function parseDate(value) {
    if (typeof value !== 'string') return null;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(?:\.\d{1,3})?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d))?$/);
    if (!match) return null;
    const day = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
    if (day.toISOString().slice(0, 10) !== value.slice(0, 10)) return null;
    const parsed = new Date(value);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  }
  function validatePDS(payload, opts = {}) {
    const checks = [], violations = [];
    const check = (category, rule, pass, message, severity = 'error') => {
      checks.push({category, rule, pass: Boolean(pass)});
      if (!pass) violations.push({rule, severity, message});
    };
    const validRoot = record(payload) && record(payload.project);
    check('validity', 'STRUCTURE', validRoot, 'The payload must be an object containing a project object.');
    const raw = validRoot ? payload.project : {};
    const p = {...raw};
    for (const key of ['dates', 'baseline', 'forecast', 'actuals', 'provenance']) {
      if (raw[key] !== undefined) check('validity', 'STRUCTURE', record(raw[key]), 'project.' + key + ' must be an object.');
      p[key] = record(raw[key]) ? raw[key] : {};
    }
    for (const key of ['approvals', 'milestones', 'funding_lines']) {
      if (raw[key] !== undefined) check('validity', 'STRUCTURE', Array.isArray(raw[key]) && raw[key].every(record), 'project.' + key + ' must be an array of objects.');
      p[key] = Array.isArray(raw[key]) ? raw[key].filter(record) : [];
    }
    const present = value => value != null && (typeof value !== 'string' || value.trim().length > 0) && (!Array.isArray(value) || value.length > 0) && (!record(value) || Object.keys(value).length > 0);
    for (const key of ['name', 'security_classification', 'owner_org', 'delivery_phase', 'approvals', 'rag_overall', 'funding_lines', 'provenance']) {
      check('completeness', 'REQUIRED', present(p[key]), 'Missing required field in this example schema: ' + key);
    }
    for (const key of ['name', 'security_classification', 'owner_org']) check('validity', 'TEXT', typeof p[key] === 'string' && p[key].trim().length > 0, key + ' must be non-empty text.');
    check('validity', 'PROJECT-ID', typeof p.id === 'string' && uuid.test(p.id), 'project.id must use urn:pds:project: followed by a UUID in 8-4-4-4-12 form.');
    check('validity', 'PHASE', CODELISTS.DeliveryPhase.includes(p.delivery_phase), 'delivery_phase is not in the illustrative codelist.');
    for (const key of ['rag_overall', 'rag_cost', 'rag_schedule']) if (key === 'rag_overall' || p[key] !== undefined) check('validity', 'RAG', CODELISTS.RAG.includes(p[key]), key + ' is not in the illustrative RAG codelist.');
    for (const approval of p.approvals) check('validity', 'APPROVAL', CODELISTS.ApprovalStage.includes(approval.stage), 'Approval stage is not in the illustrative codelist: ' + String(approval.stage));

    const money = (value, label, required = true) => {
      if (value === undefined && !required) return null;
      const valid = record(value) && finiteAmount(value.amount) && typeof value.currency === 'string' && /^[A-Z]{3}$/.test(value.currency);
      check('validity', 'MONEY', valid, label + ' needs a finite non-negative numeric amount and three-letter uppercase currency code.');
      return valid ? value : null;
    };
    const baseline = money(p.baseline.cost?.capex, 'baseline.cost.capex');
    const forecast = money(p.forecast.cost?.capex, 'forecast.cost.capex');
    const actual = money(p.actuals.cost?.capex, 'actuals.cost.capex', ['Delivery', 'Handover', 'Closeout'].includes(p.delivery_phase));
    if (actual && forecast) {
      check('consistency', 'COST-CURRENCY', actual.currency === forecast.currency, 'Actual and forecast capex use different currencies; their amounts cannot be compared.');
      if (actual.currency === forecast.currency) check('consistency', 'SPEND-FORECAST', actual.amount <= forecast.amount, 'Actual spend to date exceeds the current total forecast. Review the forecast or clarify what actuals represent.', 'warning');
    }
    const tolerance = opts.tolerance === undefined ? 0.02 : opts.tolerance;
    const slaDays = opts.slaDays === undefined ? 30 : opts.slaDays;
    if (typeof tolerance !== 'number' || !Number.isFinite(tolerance) || tolerance < 0 || tolerance > 1) throw new RangeError('Tolerance must be a number from 0 to 1.');
    if (typeof slaDays !== 'number' || !Number.isFinite(slaDays) || slaDays <= 0) throw new RangeError('SLA days must be greater than zero.');
    const now = opts.now === undefined ? new Date() : new Date(opts.now);
    if (!Number.isFinite(now.getTime())) throw new RangeError('The assessment date is invalid.');
    const budgets = [];
    for (const line of p.funding_lines) {
      check('validity', 'FUNDING-CATEGORY', ['CAPEX', 'OPEX'].includes(line.category), 'Funding line ' + String(line.id) + ' needs a CAPEX or OPEX category.');
      const budget = money(line.budgeted, 'Funding line ' + String(line.id) + ' budgeted');
      if (line.category === 'CAPEX' && budget) budgets.push(budget);
      for (const field of ['forecast', 'actual']) if (line[field] !== undefined) money(line[field], 'Funding line ' + String(line.id) + ' ' + field);
    }
    const capexLines = p.funding_lines.filter(line => line.category === 'CAPEX');
    let funding = null;
    if (baseline && capexLines.length > 0 && budgets.length === capexLines.length) {
      const sameCurrency = budgets.every(value => value.currency === baseline.currency);
      check('consistency', 'FUNDING-CURRENCY', sameCurrency, 'CAPEX budgets and baseline must share a currency before summing. No conversion is performed.');
      if (sameCurrency) {
        const total = budgets.reduce((sum, value) => sum + value.amount, 0);
        check('validity', 'FUNDING-TOTAL', Number.isFinite(total), 'CAPEX budget total is too large to represent.');
        if (Number.isFinite(total)) {
          const gap = Math.abs(total - baseline.amount);
          const within = gap <= baseline.amount * tolerance;
          funding = {total, baseline: baseline.amount, currency: baseline.currency, within, relativeGap: baseline.amount ? gap / baseline.amount : null};
          check('consistency', 'FUNDING-BASELINE', within, 'CAPEX budget total differs from baseline beyond the selected tolerance. This comparison assumes the lines cover the whole baseline; missing years can explain the gap.', 'warning');
        }
      }
    } else check('consistency', 'FUNDING-COVERAGE', false, 'A valid baseline and at least one valid CAPEX budget line are needed for the funding comparison.', 'warning');

    const dates = {};
    for (const key of ['start_planned', 'finish_planned', 'start_actual', 'finish_actual']) {
      if (key.endsWith('_planned') || p.dates[key] !== undefined) {
        dates[key] = parseDate(p.dates[key]);
        check('validity', 'PROJECT-DATE', Boolean(dates[key]), key + ' needs a real ISO date (YYYY-MM-DD) or timestamp with a timezone.');
      }
    }
    for (const kind of ['planned', 'actual']) if (dates['start_' + kind] && dates['finish_' + kind]) check('consistency', 'DATE-ORDER', dates['start_' + kind] <= dates['finish_' + kind], kind + ' finish must not precede its start.');
    for (const milestone of p.milestones) for (const key of ['planned_date', 'forecast_date', 'actual_date']) {
      if (key === 'planned_date' || milestone[key] !== undefined) check('validity', 'MILESTONE-DATE', Boolean(parseDate(milestone[key])), 'Milestone ' + String(milestone.id) + ': invalid or missing ' + key + '. Early completion is allowed.');
    }
    const prov = p.provenance;
    for (const key of ['created_by', 'source_system']) check('completeness', 'PROVENANCE', typeof prov[key] === 'string' && prov[key].trim().length > 0, 'Provenance needs ' + key + '.');
    const created = parseDate(prov.created_at), modified = parseDate(prov.last_modified_at);
    check('validity', 'PROVENANCE-DATE', Boolean(created), 'Provenance created_at needs a valid ISO date or timestamp.');
    if (prov.last_modified_at !== undefined) check('validity', 'PROVENANCE-DATE', Boolean(modified), 'Provenance last_modified_at needs a valid ISO date or timestamp.');
    if (created && modified) check('consistency', 'PROVENANCE-ORDER', modified >= created, 'Last modification must not precede creation.');
    const last = prov.last_modified_at === undefined ? created : modified;
    check('timeliness', 'TIMELINESS-DATE', Boolean(last), 'A valid provenance date is needed to assess timeliness.');
    if (last) {
      const age = (now - last) / 86400000;
      check('timeliness', 'TIMELINESS-FUTURE', age >= 0, 'The latest provenance timestamp is in the future.', 'warning');
      check('timeliness', 'TIMELINESS-SLA', age <= slaDays, 'The record is older than the selected ' + slaDays + '-day SLA.', 'warning');
    }
    for (const key of ['milestones', 'funding_lines']) {
      const seen = new Set();
      for (const item of p[key]) {
        const valid = typeof item.id === 'string' && item.id.trim().length > 0;
        check('uniqueness', 'ITEM-ID', valid, key + ' entries need non-empty text IDs.');
        if (valid) {
          check('uniqueness', 'DUPLICATE-ID', !seen.has(item.id), 'Duplicate ' + key + ' ID: ' + item.id);
          seen.add(item.id);
        }
      }
    }
    const percent = items => items.length ? Math.round(100 * items.filter(item => item.pass).length / items.length) : null;
    const scores = {overall: percent(checks)};
    for (const key of ['completeness', 'validity', 'consistency', 'timeliness', 'uniqueness']) scores[key] = percent(checks.filter(item => item.category === key));
    return {violations, scores, checks, funding, project: p, options: {tolerance, slaDays, assessed_at: now.toISOString()}};
  }
  return {CODELISTS, parseDate, validatePDS};
});
