'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const criteria = [{ name: 'Cost (affordability)', weight: 0.3 }, { name: 'Quality', weight: 0.4 }, { name: 'Support', weight: 0.3 }];
  const options = [{ name: 'Vendor A', ratings: [3, 4, 5] }, { name: 'Vendor B', ratings: [4, 3, 4] }, { name: 'Vendor C', ratings: [5, 2, 3] }];
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function input(type, value, label, change, attrs = {}) {
    const node = element('input');
    Object.assign(node, { type, value: value == null ? '' : value, ...attrs });
    node.setAttribute('aria-label', label);
    node.addEventListener('input', () => { change(type === 'number' ? node.valueAsNumber : node.value); calculate(); });
    return node;
  }
  function removeButton(getLabel, remove) {
    const button = element('button', 'Remove', 'danger small');
    button.type = 'button';
    button.setAttribute('aria-label', getLabel());
    button.addEventListener('click', () => {
      const label = getLabel();
      if (!window.confirm(`${label}?`)) return;
      remove(); render(); $('editStatus').textContent = `${label.replace(/^Remove /, '')} removed.`;
      $('criterionName').focus();
    });
    return button;
  }
  function format(value) {
    if (!Number.isFinite(value)) return 'Outside display range';
    if (value !== 0 && (Math.abs(value) < 0.001 || Math.abs(value) >= 1e7)) return value.toExponential(3);
    return value.toFixed(3);
  }
  function calculate() {
    const result = WeightedDecision.evaluate(criteria, options);
    criteria.forEach((criterion, index) => {
      $('header-row').cells[index + 1].querySelector('button').setAttribute('aria-label', `Remove criterion ${criterion.name || index + 1}`);
      $('weight-row').cells[index + 1].querySelector('input').setAttribute('aria-label', `Weight for ${criterion.name || `criterion ${index + 1}`}`);
    });
    document.querySelectorAll('#matrix input').forEach(node => node.setAttribute('aria-invalid', String(!node.validity.valid || !node.value.trim())));
    [...$('body').rows].forEach((row, index) => {
      const valid = !result.errors.length;
      const leader = valid && result.leaders.includes(index);
      row.classList.toggle('best', leader);
      row.querySelector('.total').textContent = valid ? format(result.scores[index].raw) : '—';
      row.querySelector('.normalised').textContent = valid ? `${format(result.scores[index].normalised)}${leader ? result.leaders.length > 1 ? ' · Joint highest' : ' · Highest' : ''}` : '—';
      row.querySelector('input[type=text]').setAttribute('aria-label', `Option ${index + 1} name`);
      row.querySelector('button').setAttribute('aria-label', `Remove option ${options[index].name || index + 1}`);
      row.querySelectorAll('input[type=number]').forEach((node, criterionIndex) => node.setAttribute('aria-label', `${options[index].name || `Option ${index + 1}`} rating for ${criteria[criterionIndex].name || `criterion ${criterionIndex + 1}`}`));
    });
    if (result.errors.length) {
      $('result').textContent = result.errors.join(' ');
      $('result').classList.add('error');
      $('weightSummary').textContent = 'No option is ranked until the matrix is complete and valid.';
      return;
    }
    $('result').classList.remove('error');
    const names = result.leaders.map(index => options[index].name).join(', ');
    $('result').textContent = options.length === 1 ? `${names} is the only option; add another to compare.` : `${result.leaders.length > 1 ? 'Joint highest scores' : 'Highest score'}: ${names}.`;
    $('weightSummary').textContent = `Weight shares: ${criteria.map((criterion, index) => `${criterion.name} ${(result.shares[index] * 100).toFixed(1)}%`).join(' · ')}.`;
  }
  function render() {
    $('header-row').replaceChildren(element('th', 'Option / criterion'));
    $('weight-row').replaceChildren(element('th', 'Weight'));
    criteria.forEach((criterion, index) => {
      const heading = element('th'); heading.scope = 'col';
      heading.append(input('text', criterion.name, `Criterion ${index + 1} name`, value => { criterion.name = value; }, { required: true, maxLength: 100 }),
        removeButton(() => `Remove criterion ${criterion.name}`, () => { criteria.splice(index, 1); options.forEach(option => option.ratings.splice(index, 1)); }));
      $('header-row').append(heading);
      const weightCell = element('td');
      weightCell.append(input('number', criterion.weight, `Weight for ${criterion.name}`, value => { criterion.weight = value; }, { min: '0', step: 'any', required: true }));
      $('weight-row').append(weightCell);
    });
    $('header-row').append(element('th', 'Total'), element('th', 'Normalised / 5'));
    $('weight-row').append(element('td', 'Σ weight × rating'), element('td', 'Total ÷ Σ weight'));
    $('body').replaceChildren();
    options.forEach((option, optionIndex) => {
      const row = element('tr');
      const nameCell = element('th'); nameCell.scope = 'row';
      nameCell.append(input('text', option.name, `Option ${optionIndex + 1} name`, value => { option.name = value; }, { required: true, maxLength: 100 }),
        removeButton(() => `Remove option ${option.name}`, () => options.splice(optionIndex, 1)));
      row.append(nameCell);
      criteria.forEach((criterion, criterionIndex) => {
        const cell = element('td');
        cell.append(input('number', option.ratings[criterionIndex], `${option.name} rating for ${criterion.name}`, value => { option.ratings[criterionIndex] = value; }, { min: '1', max: '5', step: 'any', required: true }));
        row.append(cell);
      });
      row.append(element('td', '—', 'total'), element('td', '—', 'normalised'));
      $('body').append(row);
    });
    calculate();
  }
  function validName(id) {
    const name = $(id).value.trim();
    $(id).setCustomValidity(name ? '' : 'Enter a name.');
    if (!name) $(id).reportValidity();
    return name;
  }
  $('criterionForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = validName('criterionName');
    const weight = $('criterionWeight').valueAsNumber;
    if (!name || !Number.isFinite(weight) || weight < 0) return;
    criteria.push({ name, weight }); options.forEach(option => option.ratings.push(null));
    $('criterionForm').reset(); render();
    $('editStatus').textContent = `Added ${name}. Rate each option against the new criterion.`;
    $('body').querySelector(`tr td:nth-child(${criteria.length + 1}) input`)?.focus();
  });
  $('optionForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = validName('optionName'); if (!name) return;
    options.push({ name, ratings: criteria.map(() => null) });
    $('optionForm').reset(); render();
    $('editStatus').textContent = `Added ${name}. Complete its ratings.`;
    $('body').lastElementChild?.querySelector('input[type=number]')?.focus();
  });
  ['criterionName', 'optionName'].forEach(id => $(id).addEventListener('input', () => $(id).setCustomValidity('')));
  render();
})();
