(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ProbeSession = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function resolve(ref, data) {
    const pack = data.probePacks.find(p => p.id === ref.packId);
    if (!pack || !Number.isInteger(ref.questionIndex) || !pack.questions[ref.questionIndex]) throw new Error('Unknown question in this run-sheet.');
    return { ...pack.questions[ref.questionIndex], packId: pack.id, packTitle: pack.title, artefacts: pack.artefacts || [] };
  }
  function validate(value, data) {
    if (!value || value.format !== 'probecrafter-session' || value.version !== 1 || !Array.isArray(value.questions) || value.questions.length > 100) throw new Error('Choose a Probecrafter run-sheet (version 1, up to 100 questions).');
    return value.questions.map(ref => {
      if (!ref || typeof ref.packId !== 'string') throw new Error('Invalid question reference.');
      resolve(ref, data);
      return { packId: ref.packId, questionIndex: ref.questionIndex };
    });
  }
  function serialise(questions) {
    return JSON.stringify({ format: 'probecrafter-session', version: 1, questions }, null, 2);
  }
  function move(questions, index, delta) {
    const next = questions.slice(), dest = index + delta;
    if (!Number.isInteger(index) || !Number.isInteger(delta) || index < 0 || index >= next.length || dest < 0 || dest >= next.length) return next;
    const [item] = next.splice(index, 1); next.splice(dest, 0, item); return next;
  }
  function text(questions, data) {
    const lines = ['Probecrafter — conversation run-sheet', 'Authored prompts to test with evidence; not a validated diagnostic or causal test.', ''];
    questions.forEach((ref, index) => {
      const q = resolve(ref, data);
      lines.push(`${index + 1}. ${q.prompt}`, `Pack: ${q.packTitle}`, `Purpose: ${q.angle}`, 'Listen and check:', ...q.whatToListenFor.map(x => '  • ' + x), 'Follow up:', ...q.followUps.map(x => '  • ' + x), `Coaching note: ${q.notes}`, 'Bring: ' + q.artefacts.join('; '), 'Evidence / alternative explanation / next action:', '');
    });
    return lines.join('\n');
  }
  return { resolve, validate, serialise, move, text };
});
