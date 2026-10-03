(function () {
  'use strict';
  const M = window.ContractLab;
  const $ = id => document.getElementById(id);
  const number = n => Number.isInteger(n) ? String(n) : n.toFixed(1);
  let state = M.start();
  const reasons = {
    agreement: 'The proposed bounds overlap the reservation values. The midpoint below is acceptable under the stated assumptions.',
    'no-zone': 'No ZOPA exists: even before considering offers, the supplier’s minimum exceeds the client’s maximum. Keeping the alternatives is rational in this model.',
    'uncrossed-offers': 'A ZOPA exists, but the supplier’s ask exceeds the client’s bid. Being close is not enough: these proposed bounds do not overlap.',
    'outside-reservations': 'The offers cross, but their overlap is outside at least one reservation value. A matching or crossed offer alone does not make a viable agreement.'
  };
  function scenarioHTML() {
    const fields = [
      ['cost', 'Supplier’s cost', 'Cost of delivering this package'],
      ['value', 'Client’s value', 'Benefit of receiving this package'],
      ['supplierAlternative', 'Supplier’s alternative surplus', 'Net benefit available without this deal'],
      ['clientAlternative', 'Client’s alternative surplus', 'Net benefit available without this deal']
    ];
    return '<h3 id="stage-title" tabindex="-1">1. Understand the scenario</h3><p>Use the original package numbers, or change the assumptions to examine a different bargain. All inputs are whole price units from 0 to 100.</p><div class="terms">' + fields.map(([id, label, note]) => '<label for="' + id + '">' + label + '<span class="note">' + note + '</span><input id="' + id + '" type="number" min="0" max="100" step="1" required value="' + state.terms[id] + '"></label>').join('') + '</div><p class="note">The five original packages start with zero outside-option surplus. Changes affect only this package; the next begins with its original assumptions.</p>';
  }
  function offerHTML(party) {
    const supplier = party === 'ask', label = supplier ? 'Supplier’s provisional ask' : 'Client’s provisional bid';
    const z = M.reservations(state.terms);
    return '<h3 id="stage-title" tabindex="-1">' + (supplier ? '2. Supplier’s turn' : '3. Client’s turn') + '</h3><p>' + (supplier ? 'Consider delivery cost, the alternative job and desired profit. Your reservation minimum is <strong>' + number(z.lower) + '</strong>.' : 'Consider the value of this package and your alternative. Your reservation maximum is <strong>' + number(z.upper) + '</strong>. The supplier’s provisional ask is <strong>' + state.ask + '</strong>.') + '</p><label for="offer-slider">' + label + ' · move the slider</label><input type="range" id="offer-slider" min="0" max="100" step="1" value="' + state[party] + '"><label for="offer-number">' + label + ' · or enter a number</label><input type="number" class="offer-input" id="offer-number" min="0" max="100" step="1" required value="' + state[party] + '"><p class="note">Price units, not percentages. Reservation limits remain in force even if the provisional offer crosses them.</p>';
  }
  function analysisHTML() {
    const r = M.analyse(state.terms, state.ask, state.bid);
    const facts = r.agreement ? [
      ['Feasible proposed interval', number(r.lower) + '–' + number(r.upper)],
      ['Selected midpoint price', number(r.price)],
      ['Supplier surplus (price − cost)', number(r.supplierSurplus)],
      ['Client surplus (value − price)', number(r.clientSurplus)],
      ['Supplier gain over alternative', number(r.supplierGain)],
      ['Client gain over alternative', number(r.clientGain)]
    ] : [
      ['Supplier keeps alternative surplus', number(state.terms.supplierAlternative)],
      ['Client keeps alternative surplus', number(state.terms.clientAlternative)],
      ['Additional gain for either party', '0']
    ];
    return '<h3 id="stage-title" tabindex="-1">4. Analyse the negotiation</h3><div class="result ' + (r.agreement ? '' : 'no-agreement') + '"><h3>' + (r.agreement ? 'Feasible agreement' : 'No agreement') + '</h3><p>' + reasons[r.reason] + '</p></div><dl class="facts"><dt>Supplier’s ask / client’s bid</dt><dd>' + r.ask + ' / ' + r.bid + '</dd>' + facts.map(([label, value]) => '<dt>' + label + '</dt><dd>' + value + '</dd>').join('') + '</dl><p class="note">This outcome is a preview. Go back to revise, or record it to move on. A zero-gain boundary price counts as acceptable because this exercise permits indifference.</p>';
  }
  function zoneSVG(z, r) {
    const x = v => 24 + v * 2.72;
    let shapes = '<line class="axis" x1="24" y1="42" x2="296" y2="42"/>';
    if (z.exists) shapes += '<line class="zone" x1="' + x(z.lower) + '" y1="42" x2="' + x(z.upper) + '" y2="42"/>' + (z.lower === z.upper ? '<circle cx="' + x(z.lower) + '" cy="42" r="8" fill="#d7e6cb"/>' : '');
    if (state.stage >= 1) shapes += '<line class="ask" x1="' + x(state.ask) + '" y1="24" x2="' + x(state.ask) + '" y2="61"/>';
    if (state.stage >= 2) shapes += '<line class="bid" x1="' + x(state.bid) + '" y1="29" x2="' + x(state.bid) + '" y2="66"/>';
    if (state.stage === 3 && r.agreement) shapes += '<line class="feasible" x1="' + x(r.lower) + '" y1="42" x2="' + x(r.upper) + '" y2="42"/><circle cx="' + x(r.price) + '" cy="42" r="5" fill="#285d4a"/>';
    return '<svg class="zone-chart" viewBox="0 0 320 90" aria-hidden="true">' + shapes + '<text x="24" y="82">0</text><text x="150" y="82">50</text><text x="275" y="82">100</text></svg>';
  }
  function renderZone() {
    const z = M.reservations(state.terms), r = M.analyse(state.terms, state.ask, state.bid);
    $('zone-panel').innerHTML = '<dl class="facts"><dt>Supplier minimum</dt><dd>' + number(z.lower) + '</dd><dt>Client maximum</dt><dd>' + number(z.upper) + '</dd></dl><p><strong>' + (z.exists ? 'ZOPA: ' + number(z.lower) + '–' + number(z.upper) + ' units' : 'No ZOPA under these assumptions') + '</strong></p>' + zoneSVG(z, r) + '<p class="note">Pale green: reservation overlap.' + (state.stage >= 1 ? ' Brown line: ask ' + state.ask + '.' : '') + (state.stage >= 2 ? ' Blue line: bid ' + state.bid + '.' : '') + (state.stage === 3 && r.agreement ? ' Dark green: feasible interval ' + number(r.lower) + '–' + number(r.upper) + '; dot: price ' + number(r.price) + '.' : '') + '</p>';
  }
  function renderHistory() {
    const total = M.summary(state.history);
    $('score').textContent = total.agreements + ' agreement' + (total.agreements === 1 ? '' : 's') + ' · ' + total.recorded + ' of 5 packages recorded';
    if (!total.recorded) { $('history').innerHTML = '<p class="note">Record the fourth step of a package to keep its outcome here.</p>'; return; }
    $('history').innerHTML = '<div class="table-scroll" tabindex="0" role="region" aria-label="Recorded package results; scroll horizontally on small screens"><table><caption>Every recorded outcome, including no-deal results. Gains are measured relative to the outside options.</caption><thead><tr><th scope="col">Package</th><th scope="col">Cost / value</th><th scope="col">Alternatives<br>supplier / client</th><th scope="col">Ask / bid</th><th scope="col">ZOPA</th><th scope="col">Outcome</th><th scope="col">Gains<br>supplier / client</th></tr></thead><tbody>' + state.history.map(r => '<tr><th scope="row">' + r.package + '</th><td>' + r.terms.cost + ' / ' + r.terms.value + '</td><td>' + r.terms.supplierAlternative + ' / ' + r.terms.clientAlternative + '</td><td>' + r.ask + ' / ' + r.bid + '</td><td>' + (r.zone.exists ? number(r.zone.lower) + '–' + number(r.zone.upper) : 'None') + '</td><td>' + (r.agreement ? 'Price ' + number(r.price) : 'No agreement') + '</td><td>' + (r.agreement ? number(r.supplierGain) + ' / ' + number(r.clientGain) : '0 / 0') + '</td></tr>').join('') + '</tbody></table></div><p class="note">Total additional gains across these independent packages: supplier ' + number(total.supplierGain) + '; client ' + number(total.clientGain) + ' price units. The exercise assumes those units are comparable between packages.</p>';
  }
  function showError(error) { $('input-error').textContent = error.message; }
  function readTerms() {
    const input = Object.fromEntries(['cost', 'value', 'supplierAlternative', 'clientAlternative'].map(key => [key, $(key).valueAsNumber]));
    state = M.setTerms(state, input);
  }
  function readOffer() {
    state = M.setOffer(state, state.stage === 1 ? 'ask' : 'bid', $('offer-number').valueAsNumber);
  }
  function bindStage() {
    if (state.stage === 0) {
      for (const input of $('game-stage').querySelectorAll('input')) input.addEventListener('input', () => {
        try { readTerms(); $('input-error').textContent = ''; renderZone(); }
        catch (error) { showError(error); $('zone-panel').innerHTML = '<p class="error">Enter valid assumptions to update the range.</p>'; }
      });
    } else if (state.stage === 1 || state.stage === 2) {
      $('offer-slider').addEventListener('input', () => {
        $('offer-number').value = $('offer-slider').value;
        readOffer(); $('input-error').textContent = ''; renderZone();
      });
      $('offer-number').addEventListener('input', () => {
        try { readOffer(); $('offer-slider').value = $('offer-number').value; $('input-error').textContent = ''; renderZone(); }
        catch (error) { showError(error); $('zone-panel').innerHTML = '<p class="error">Enter a valid offer to update the range.</p>'; }
      });
    }
  }
  function render(focus = false) {
    $('input-error').textContent = '';
    const total = M.summary(state.history);
    $('round-label').textContent = state.finished ? 'Exercise complete · 5 of 5 packages' : 'Package ' + (state.round + 1) + ' of 5';
    $('package-title').textContent = state.finished ? 'All five packages recorded' : M.packages[state.round].name;
    $('steps').hidden = state.finished;
    [...$('steps').children].forEach((li, index) => { li.removeAttribute('aria-current'); li.className = index < state.stage ? 'past' : ''; if (index === state.stage) li.setAttribute('aria-current', 'step'); });
    $('back').hidden = state.finished;
    $('back').disabled = state.stage === 0;
    $('next').hidden = state.finished;
    $('next').textContent = ['Supplier’s turn →', 'Client’s turn →', 'Analyse offers →', state.round === 4 ? 'Record & finish' : 'Record & next package →'][state.stage];
    if (state.finished) {
      $('game-stage').innerHTML = '<p class="offer-display">' + total.agreements + ' / 5</p><p>Packages with a feasible agreement under the chosen assumptions and midpoint rule.</p><p>Review the outcomes below. Did a failed deal come from the reservation values, the offers, or both? Would stronger alternatives change your decision?</p><p class="note">The counter is a result of the rules you explored, not a rating of negotiating ability.</p>';
    } else {
      $('game-stage').innerHTML = state.stage === 0 ? scenarioHTML() : state.stage === 3 ? analysisHTML() : offerHTML(state.stage === 1 ? 'ask' : 'bid');
      bindStage();
    }
    renderZone(); renderHistory();
    $('status').textContent = !total.recorded ? 'No packages recorded yet.' : total.recorded + ' of 5 recorded. Last package: ' + state.history.at(-1).package + ' — ' + (state.history.at(-1).agreement ? 'agreement at ' + number(state.history.at(-1).price) + '.' : 'no agreement.');
    if (focus) ($('stage-title') || $('package-title')).focus();
  }
  $('next').addEventListener('click', () => {
    try {
      if (state.stage === 0) readTerms();
      if (state.stage === 1 || state.stage === 2) readOffer();
      state = state.stage === 3 ? M.record(state) : M.next(state);
      render(true);
    } catch (error) { showError(error); }
  });
  $('back').addEventListener('click', () => { state = M.back(state); render(true); });
  $('reset').addEventListener('click', () => { state = M.start(); render(true); });
  for (const [id, open] of [['expand-cards', true], ['collapse-cards', false]]) $(id).addEventListener('click', () => { for (const card of $('lesson-cards').querySelectorAll('details')) card.open = open; });
  $('activity-complete').addEventListener('change', () => { $('activity-value').textContent = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(M.activityContribution($('activity-complete').checked)); });
  render();
})();
