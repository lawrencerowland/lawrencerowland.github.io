(function () {
  'use strict';
  const M = window.DoorMoistureModel;
  const byId = id => document.getElementById(id);
  const inputs = Object.fromEntries(Object.keys(M.defaults).map(key => [key, byId(key)]));
  const examples = Array.from(document.querySelectorAll('[data-example]'));
  const signed = value => (Math.abs(value) < 0.0005 ? '0.00' : (value > 0 ? '+' : '−') + Math.abs(value).toFixed(2));
  function update() {
    const state = Object.fromEntries(Object.entries(inputs).map(([key, input]) => [key, Number(input.value)]));
    const r = M.calculate(state);
    for (const [key, input] of Object.entries(inputs)) {
      const value = key === 'wall' ? r[key].toFixed(2) : r[key].toFixed(1) + (key === 'clearance' ? ' mm' : '%');
      byId(key + '-value').textContent = value;
      input.setAttribute('aria-valuetext', key === 'wall' ? value + ', equivalent to ' + r.wallMovement.toFixed(2) + ' millimetres inward' : value);
    }
    examples.forEach(button => button.setAttribute('aria-pressed', String(Object.entries(M.examples[button.dataset.example]).every(([key, value]) => state[key] === value))));
    byId('gap-value').textContent = (r.gap < 0 ? '−' : '') + Math.abs(r.gap).toFixed(2);
    byId('result').dataset.state = r.status;
    const copy = {
      gap: ['A gap remains in this model', 'A positive number describes this one edge. It does not establish that a real door opens freely.'],
      contact: ['The model reaches first contact', 'The calculated gap is zero. The model stops before contact forces, deformation or friction.'],
      overlap: ['More clearance would be needed', 'The assumed movements exceed the starting gap by ' + r.extraClearance.toFixed(2) + ' mm. This is an unmet clearance demand, not physical penetration.']
    }[r.status];
    byId('gap-status').textContent = copy[0];
    byId('gap-explanation').textContent = copy[1];
    const contributions = { clearance: r.clearance, door: -r.doorMovement, jamb: -r.jambMovement, wall: -r.wallMovement, gap: r.gap };
    for (const [key, value] of Object.entries(contributions)) byId('budget-' + key).textContent = signed(value);

    // Every displacement uses the same scale: 20 SVG units per millimetre.
    const doorEdge = 250 + r.doorMovement * 20;
    const jambEdge = 250 + r.clearance * 20 - (r.jambMovement + r.wallMovement) * 20;
    byId('door-block').setAttribute('width', doorEdge - 48);
    byId('jamb-block').setAttribute('x', jambEdge);
    byId('jamb-block').setAttribute('width', 600 - jambEdge);
    byId('overlap-block').setAttribute('x', Math.min(doorEdge, jambEdge));
    byId('overlap-block').setAttribute('width', Math.max(0, doorEdge - jambEdge));
    byId('reference-guides').setAttribute('d', 'M250 45V217M' + (250 + r.clearance * 20) + ' 45V217');
    byId('edge-lines').setAttribute('d', 'M' + doorEdge + ' 55V205M' + jambEdge + ' 55V205');
    byId('dimension-line').setAttribute('d', 'M' + doorEdge + ' 229H' + jambEdge + 'M' + doorEdge + ' 223V235M' + jambEdge + ' 223V235');
    byId('dimension-label').setAttribute('x', (doorEdge + jambEdge) / 2);
    byId('dimension-label').textContent = Math.abs(r.gap).toFixed(2) + ' mm ' + (r.status === 'overlap' ? 'beyond contact' : 'gap');
    byId('diagram-caption').textContent = r.status === 'overlap'
      ? 'Hatching shows overlap in the unconstrained calculation. Real timbers cannot pass through each other. Dashed lines mark reference edges.'
      : 'Movement is magnified. Dashed lines mark the reference edges; timber widths are schematic.';
    byId('diagram-desc').textContent = 'Door-edge movement: ' + signed(r.doorMovement) + ' millimetres toward the jamb. Jamb movement: ' + signed(r.jambMovement) + ' millimetres toward the door. Additional frame shift: ' + r.wallMovement.toFixed(2) + ' millimetres inward. Calculated gap: ' + signed(r.gap) + ' millimetres. ' + copy[0] + '.';

    const x = moisture => 65 + (moisture - 6) / 22 * 540;
    const y = gap => 140 - gap * 7.5;
    const sweep = M.doorSweep(state);
    byId('sweep-line').setAttribute('d', sweep.map((point, i) => (i ? 'L' : 'M') + x(point.door).toFixed(2) + ' ' + y(point.gap).toFixed(2)).join(''));
    byId('sweep-dot').setAttribute('cx', x(r.door));
    byId('sweep-dot').setAttribute('cy', y(r.gap));
    const contact = M.contactMoisture(state);
    byId('contact-note').textContent = contact < 6
      ? 'These settings demand more clearance throughout the displayed 6–28% door-moisture range.'
      : contact > 28
        ? 'A positive gap remains throughout the displayed 6–28% door-moisture range at these settings.'
        : 'At these settings, the model reaches contact at ' + contact.toFixed(1) + '% door moisture.';
    byId('sweep-desc').textContent = 'Holding the other controls fixed, clearance changes from ' + signed(sweep[0].gap) + ' millimetres at 6% door moisture to ' + signed(sweep.at(-1).gap) + ' millimetres at 28%. ' + byId('contact-note').textContent;
  }
  for (const input of Object.values(inputs)) input.addEventListener('input', update);
  for (const button of examples) button.addEventListener('click', () => {
    for (const [key, value] of Object.entries(M.examples[button.dataset.example])) inputs[key].value = value;
    update();
  });
  update();
  byId('controls').disabled = false;
  byId('load-status').hidden = true;
}());
