(function () {
  'use strict';
  const M = window.WasteRoute;
  const $ = id => document.getElementById(id);
  const labels = {char: 'Characterization', seg: 'Segregation', size: 'Size reduction', pack: 'Packaging', assay: 'Assay', storage: 'Storage', transport: 'Transport'};
  const colors = ['#176858', '#3269aa', '#a35c15', '#b14368', '#7655a1', '#4f747d'];
  let job = 0, last = null, stressBusy = false;
  const fmt = (v, dp = 1) => v === null || !Number.isFinite(v) ? '—' : v.toLocaleString('en-GB', {maximumFractionDigits: dp});
  const pct = v => v === null ? 'Unavailable' : fmt(v * 100) + '%';
  function message(error) {
    let text = error.message;
    const key = text.split(':')[0];
    const input = $(key);
    if (input) {
      text = text.replace(key, document.querySelector(`label[for="${key}"]`).textContent);
      const details = input.closest('details');
      if (details) details.open = true;
      input.focus();
    }
    $('error').textContent = text;
  }
  function inputs() {
    const p = {};
    for (const key of Object.keys(M.LIMITS)) p[key] = $(key).value.trim() === '' ? NaN : Number($(key).value);
    p.earlySeg = $('earlySeg').checked; p.conservative = $('conservative').checked;
    return M.validate(p);
  }
  function setInputs(p) {
    for (const key of Object.keys(M.LIMITS)) $(key).value = p[key];
    $('earlySeg').checked = p.earlySeg; $('conservative').checked = p.conservative;
  }
  function stopStress(text) {
    job++;
    if (stressBusy && text) $('stressStatus').textContent = text;
    stressBusy = false; $('cancelBtn').disabled = true; $('stressBtn').disabled = false;
  }
  function clearStress(text = 'Choose Run stress comparison to sample the current scenario.') {
    $('stressResults').replaceChildren(); $('stressChart').replaceChildren(); $('stressStatus').textContent = text;
  }
  function lineChart(id, series, days, title, unit) {
    const width = 700, height = 250, l = 58, r = 18, t = 22, b = 38;
    const ymax = Math.max(1, ...series.flatMap(s => s.values.filter(Number.isFinite)));
    const x = i => l + (days.length <= 1 ? 0 : i / (days.length - 1)) * (width - l - r);
    const y = n => height - b - n / ymax * (height - t - b);
    let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}Title ${id}Desc"><title id="${id}Title">${title}</title><desc id="${id}Desc">${unit}, days 1 to ${days.length}. Exact daily values are in the table below the shipment charts.</desc>`;
    for (let tick = 0; tick <= 4; tick++) {
      const v = ymax * tick / 4;
      svg += `<line x1="${l}" y1="${y(v)}" x2="${width-r}" y2="${y(v)}" stroke="#d5ddd3"/><text x="${l-8}" y="${y(v)+4}" font-size="11" text-anchor="end" fill="#526563">${fmt(v)}</text>`;
    }
    series.forEach((s, index) => {
      let path = '', connected = false;
      s.values.forEach((v, i) => {
        if (!Number.isFinite(v)) { connected = false; return; }
        path += `${connected ? 'L' : 'M'}${x(i).toFixed(2)},${y(v).toFixed(2)} `; connected = true;
      });
      svg += `<path d="${path}" fill="none" stroke="${s.color || colors[index]}" stroke-width="2.3" ${index % 2 ? 'stroke-dasharray="7 3"' : ''}/>`;
      // Keep isolated observations and single-day horizons visible.
      s.values.forEach((v, i) => {
        if (Number.isFinite(v) && (s.values.length === 1 || (!Number.isFinite(s.values[i-1]) && !Number.isFinite(s.values[i+1])))) svg += `<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="${s.color || colors[index]}"/>`;
      });
    });
    svg += `<text x="${l}" y="${height-12}" font-size="12" fill="#526563">Day 1</text><text x="${width-r}" y="${height-12}" text-anchor="end" font-size="12" fill="#526563">Day ${days.length}</text></svg>`;
    $(id).innerHTML = svg;
  }
  function bars(id, items, title, unit) {
    const width = 700, height = 35 + items.length * 34, max = Math.max(1, ...items.map(i => i.value));
    let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}Title"><title id="${id}Title">${title}. ${items.map(i => `${i.label}: ${i.display || fmt(i.value) + ' ' + unit}`).join('; ')}</title>`;
    items.forEach((item, i) => {
      const y = 12 + i * 34;
      svg += `<text x="140" y="${y+16}" text-anchor="end" font-size="12" fill="#243a3a">${item.label}</text><rect x="150" y="${y}" width="${item.value/max*455}" height="22" rx="3" fill="${colors[i % colors.length]}"/><text x="${160+item.value/max*455}" y="${y+16}" font-size="12" fill="#243a3a">${item.display || fmt(item.value)}</text>`;
    });
    $(id).innerHTML = svg + '</svg>';
  }
  function render(r) {
    last = r;
    $('resultBasis').textContent = `${r.params.horizon} days · constant arrival ${fmt(r.params.inbound)} material u/day · no random outages · planned outages included. Packaging multiplier ${fmt(r.factor, 2)}; assay rework ${fmt(r.reworkFraction * 100)}%.`;
    const cards = [
      ['Shipped load', r.shippedLoad, 'package eq'], ['Unfinished material', r.unfinished, 'material u'],
      ['Storage-blocked days', r.blockedDays, 'days with work actually blocked'], ['Completed-shipment lead time', r.avgLead, 'days · excludes unfinished material'],
      ['Unfinished mean age', r.unfinishedAge, 'days at end of horizon'], ['Peak storage before transport', r.peakStorage, `package eq · day-end peak ${fmt(r.peakStorageEnd)}`]
    ];
    $('metrics').innerHTML = cards.map(([label, value, unit]) => `<div class="metric"><span>${label}</span><strong>${fmt(value)}</strong><span class="unit">${unit}</span></div>`).join('');
    $('reading').textContent = `${fmt(r.arrivals)} material units arrived; ${fmt(r.clean)} were released early, ${fmt(r.shipped)} shipped and ${fmt(r.unfinished)} remain. Rework added ${fmt(r.reworked)} material-unit visits to packaging (repeat visits count again). ${r.oldestAge === null ? 'No material remains.' : `The oldest unfinished material is ${fmt(r.oldestAge)} days old.`}`;
    const days = r.history.map(h => h.day);
    lineChart('queueChart', M.STAGES.map((key, i) => ({values: r.history.map(h => h.queues[key]), color: colors[i]})), days, 'End-of-day material queues', 'Material units');
    $('queueLegend').innerHTML = M.STAGES.map((key, i) => `<span style="--swatch:${colors[i]}">${labels[key]}${i % 2 ? ' (dashed)' : ''}</span>`).join('');
    $('stageRows').innerHTML = M.WORK.map(key => `<tr><th scope="row">${labels[key]}</th><td>${fmt(r.endQueues[key === 'transport' ? 'storage' : key])}${key === 'transport' ? ' in storage' : ''}</td><td>${pct(r.utilization[key])}</td><td>${r.pressureDays[key]}</td></tr>`).join('');
    lineChart('flowChart', [{values: r.history.map(h => h.shippedLoad), color: colors[0]}], days, 'Daily shipped load', 'Package-equivalents');
    lineChart('leadChart', [{values: r.history.map(h => h.completedLead), color: colors[4]}], days, 'Mean age of completed shipments each day', 'Days');
    bars('utilChart', M.WORK.map(key => ({label: labels[key], value: r.utilization[key] === null ? 0 : r.utilization[key] * 100, display: pct(r.utilization[key])})), 'Utilization of available capacity', '%');
    bars('pressureChart', M.WORK.map(key => ({label: labels[key], value: r.pressureDays[key]})), 'Highest end-of-day queue pressure', 'days');
    $('dailyRows').innerHTML = r.history.map(h => `<tr><th scope="row">${h.day}</th><td>${fmt(h.arrivals, 3)}</td>${M.STAGES.filter(k => k !== 'storage').map(k => `<td>${fmt(h.queues[k], 3)}</td>`).join('')}<td>${fmt(h.storage, 3)}</td><td>${fmt(h.shippedLoad, 3)}</td><td>${fmt(h.completedLead, 3)}</td><td>${h.blocked ? 'Yes' : 'No'}</td></tr>`).join('');
    $('balance').textContent = `This run: material balance difference ${r.materialBalanceError.toExponential(2)} u; expanded-load balance difference ${r.loadBalanceError.toExponential(2)} eq. Differences near zero are numerical rounding. Packaging allowance added ${fmt(r.allowanceAdded)} eq once; unfinished expanded load ${fmt(r.endLoad)} eq.`;
  }
  function run() {
    stopStress('Stress cancelled because a deterministic case was requested.');
    try {
      const p = inputs(), result = M.simulate(p);
      render(result); clearStress(); $('error').textContent = ''; $('status').textContent = 'Deterministic case updated.';
    } catch (error) { message(error); }
  }
  function renderStress(runs, p) {
    const s = M.stressSummary(runs);
    $('stressResults').innerHTML = `<div class="scroll"><table><caption>${s.count} completed runs · base seed ${p.seed} · ${p.horizon} days each</caption><thead><tr><th scope="col">Measure</th><th scope="col">P50</th><th scope="col">P80</th><th scope="col">P95</th></tr></thead><tbody><tr><th scope="row">Mean completed-shipment lead · days</th>${s.lead.map(v => `<td>${fmt(v)}</td>`).join('')}</tr><tr><th scope="row">Peak storage · package eq</th>${s.peak.map(v => `<td>${fmt(v)}</td>`).join('')}</tr><tr><th scope="row">Storage-blocked days</th>${s.blocked.map(v => `<td>${fmt(v)}</td>`).join('')}</tr><tr><th scope="row">Shipped package eq · exceedance convention</th>${s.throughputExceedance.map(v => `<td>${fmt(v)}</td>`).join('')}</tr></tbody></table></div><p class="small">For lead time, peak storage and blocked days, P80 means the empirical 80th percentile (80% at or below). For throughput, P80 means the lower 20th percentile: about 80% of runs meet or exceed that amount; P95 uses the lower 5th percentile. Linear interpolation is used, so small samples need not match those percentages exactly.</p><p>${s.leadRuns} of ${s.count} runs shipped material and contribute to the lead-time percentiles. ${fmt(s.blockedShare * 100)}% of runs had at least one storage-blocked day. These are simulated sample frequencies, not calibrated real-world probabilities.</p>`;
    const counts = new Map();
    const binSize = Math.max(1, Math.ceil((Math.max(...runs.map(r => r.blockedDays)) + 1) / 8));
    runs.forEach(r => { const bin = Math.floor(r.blockedDays / binSize); counts.set(bin, (counts.get(bin) || 0) + 1); });
    const bins = [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([bin, count]) => ({label: binSize === 1 ? `${bin} blocked days` : `${bin * binSize}–${(bin + 1) * binSize - 1} days`, value: count}));
    bars('stressChart', bins, 'Distribution of storage-blocked days', 'runs');
    $('stressStatus').textContent = `Stress comparison complete: ${s.count} runs. Rerunning with these inputs and seed reproduces this sample.`;
  }
  async function stress() {
    stopStress();
    let p;
    try { p = M.validateStress(inputs()); render(M.simulate(p)); $('error').textContent = ''; }
    catch (error) { message(error); return; }
    clearStress();
    stressBusy = true; $('cancelBtn').disabled = false; $('stressBtn').disabled = true;
    const thisJob = job, runs = [];
    $('status').textContent = 'Deterministic case updated; stress comparison is running.';
    try {
      for (let i = 0; i < p.stressRuns; i++) {
        if (job !== thisJob) return;
        // Yield before each bounded run so cancellation and keyboard input remain usable.
        $('stressStatus').textContent = `Stress comparison: ${i} of ${p.stressRuns} runs complete.`;
        await new Promise(resolve => window.setTimeout(resolve, 0));
        if (job !== thisJob) return;
        const result = M.simulate(p, true, M.stressSeed(p.seed, i));
        // Retain summaries only; each run's cohort/day detail can be released.
        runs.push({avgLead: result.avgLead, shippedLoad: result.shippedLoad, blockedDays: result.blockedDays, peakStorage: result.peakStorage});
      }
      renderStress(runs, p); $('status').textContent = 'Deterministic case and stress comparison use the same inputs.';
    } catch (error) { message(error); $('stressStatus').textContent = 'Stress comparison stopped; no partial sample is reported.'; }
    finally { if (job === thisJob) { stressBusy = false; $('cancelBtn').disabled = true; $('stressBtn').disabled = false; } }
  }
  $('scenario').addEventListener('submit', event => { event.preventDefault(); run(); });
  $('stressBtn').addEventListener('click', stress);
  $('cancelBtn').addEventListener('click', () => { stopStress('Stress comparison cancelled; no partial sample is reported.'); $('status').textContent = 'Stress cancelled.'; });
  function preset(key) { stopStress(); setInputs(M.PRESETS[key]); $('preset').value = key; run(); }
  $('preset').addEventListener('change', () => preset($('preset').value));
  $('resetBtn').addEventListener('click', () => preset('baseline'));
  $('scenario').addEventListener('input', event => {
    if (event.target.id === 'preset') return;
    stopStress(); clearStress('Inputs changed. Run a new stress comparison.'); $('error').textContent = '';
    $('status').textContent = 'Inputs changed. The displayed deterministic result still describes the previous run.';
  });
  preset('baseline');
})();
