'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const risks = [];
  let nextId = 1;
  let editingId = null;
  const likelihoodLabels = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain'];
  const impactLabels = ['Minimal', 'Minor', 'Moderate', 'Major', 'Severe'];
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function announce(text) { $('status').textContent = text; }
  function preview() {
    const likelihood = Number($('likelihood').value);
    const impact = Number($('impact').value);
    $('likeDisplay').value = `${likelihood} — ${likelihoodLabels[likelihood - 1]}`;
    $('impDisplay').value = `${impact} — ${impactLabels[impact - 1]}`;
    const result = RiskMatrix.scoreRisk(likelihood, impact);
    $('preview').textContent = `${likelihood} × ${impact} = ${result.score} · ${result.band} in this example.`;
  }
  function cancelEdit() {
    editingId = null;
    $('riskForm').reset();
    $('riskName').setCustomValidity('');
    $('addRiskButton').textContent = 'Add risk to matrix';
    $('cancelEdit').hidden = true;
    preview();
  }
  function editRisk(risk) {
    editingId = risk.id;
    $('riskName').setCustomValidity('');
    $('riskName').value = risk.name;
    $('likelihood').value = risk.likelihood;
    $('impact').value = risk.impact;
    $('addRiskButton').textContent = 'Save risk changes';
    $('cancelEdit').hidden = false;
    preview();
    $('riskName').focus();
    announce(`Editing ${risk.name}.`);
  }
  function render() {
    const groups = RiskMatrix.groupRisks(risks);
    $('matrixBody').replaceChildren();
    for (let impact = 5; impact >= 1; impact--) {
      const row = element('tr');
      const heading = element('th', `${impact} · ${impactLabels[impact - 1]}`);
      heading.scope = 'row';
      row.append(heading);
      for (let likelihood = 1; likelihood <= 5; likelihood++) {
        const { score, band } = RiskMatrix.scoreRisk(likelihood, impact);
        const cell = element('td', undefined, band.toLowerCase());
        cell.dataset.likelihood = likelihood;
        cell.dataset.impact = impact;
        cell.append(element('span', `${score} · ${band}`, 'cell-score'));
        const group = groups.get(`${likelihood},${impact}`) || [];
        if (group.length) {
          const list = element('ul');
          group.forEach(risk => list.append(element('li', risk.name)));
          cell.append(list);
        }
        row.append(cell);
      }
      $('matrixBody').append(row);
    }
    $('empty').hidden = risks.length > 0;
    $('registerWrap').hidden = risks.length === 0;
    $('riskList').replaceChildren();
    risks.forEach(risk => {
      const result = RiskMatrix.scoreRisk(risk.likelihood, risk.impact);
      const row = element('tr');
      row.append(element('th', risk.name), element('td', String(risk.likelihood)), element('td', String(risk.impact)));
      row.firstChild.scope = 'row';
      const score = element('td');
      score.append(element('span', `${result.score} · ${result.band}`, `tag ${result.band.toLowerCase()}`));
      const controls = element('td');
      const actions = element('div', undefined, 'actions');
      const edit = element('button', 'Edit', 'secondary small');
      edit.setAttribute('aria-label', `Edit ${risk.name}`);
      edit.addEventListener('click', () => editRisk(risk));
      const remove = element('button', 'Remove', 'danger small');
      remove.setAttribute('aria-label', `Remove ${risk.name}`);
      remove.addEventListener('click', () => {
        risks.splice(risks.findIndex(item => item.id === risk.id), 1);
        if (editingId === risk.id) cancelEdit();
        render();
        announce(`Removed ${risk.name}.`);
        $('riskName').focus();
      });
      actions.append(edit, remove); controls.append(actions); row.append(score, controls);
      $('riskList').append(row);
    });
  }
  $('riskForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = $('riskName').value.trim();
    if (!name) { $('riskName').setCustomValidity('Enter a risk name.'); $('riskName').reportValidity(); return; }
    const likelihood = Number($('likelihood').value);
    const impact = Number($('impact').value);
    const result = RiskMatrix.scoreRisk(likelihood, impact);
    const existing = risks.find(risk => risk.id === editingId);
    if (existing) Object.assign(existing, { name, likelihood, impact });
    else risks.push({ id: nextId++, name, likelihood, impact });
    cancelEdit(); render();
    announce(`${existing ? 'Updated' : 'Added'} ${name}: likelihood ${likelihood}, impact ${impact}, score ${result.score}, ${result.band}.`);
    $('riskName').focus();
  });
  $('riskName').addEventListener('input', () => $('riskName').setCustomValidity(''));
  $('likelihood').addEventListener('input', preview);
  $('impact').addEventListener('input', preview);
  $('cancelEdit').addEventListener('click', () => { cancelEdit(); announce('Edit cancelled.'); $('riskName').focus(); });
  $('exampleButton').addEventListener('click', () => {
    risks.push({ id: nextId++, name: 'Delayed materials', likelihood: 3, impact: 5 });
    render(); announce('Added Delayed materials: likelihood 3, impact 5, score 15, Moderate.');
  });
  preview(); render();
})();
