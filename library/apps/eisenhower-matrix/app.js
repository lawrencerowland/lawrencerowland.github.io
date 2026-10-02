'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const tasks = [];
  let nextId = 1;
  let editingId = null;
  const colours = { 'Do immediately': '#944734', 'Schedule (Decide)': '#235d50', 'Delegate': '#806315', 'Delete / Defer': '#59625d' };
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function svgElement(tag, attrs, text) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([name, value]) => node.setAttribute(name, String(value)));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function preview() {
    $('preview').textContent = `Suggested action: ${EisenhowerMatrix.getRecommendedAction(Number($('taskUrgency').value), Number($('taskImportance').value))}.`;
  }
  function cancelEdit() {
    editingId = null;
    $('taskForm').reset();
    $('taskDescription').setCustomValidity('');
    $('addTaskButton').textContent = 'Add task';
    $('cancelEdit').hidden = true;
    preview();
  }
  function drawChart() {
    const svg = svgElement('svg', { id: 'matrixChart', viewBox: '0 0 650 455', role: 'group', 'aria-labelledby': 'chartTitle chartDesc' });
    svg.append(svgElement('title', { id: 'chartTitle' }, 'Task urgency and importance'), svgElement('desc', { id: 'chartDesc' }, 'Urgency increases to the right and importance increases upwards. Ratings 3 to 5 are high. Every plotted task is also described in the task list.'));
    const x = value => 85 + (value - 0.5) * 100;
    const y = value => 375 - (value - 0.5) * 60;
    [[85,75,200,180,'#e2eee7'],[285,75,300,180,'#f2ded6'],[85,255,200,120,'#e9ece5'],[285,255,300,120,'#f0e8c9']].forEach(([px,py,width,height,fill]) => svg.append(svgElement('rect', { x: px, y: py, width, height, fill })));
    for (let value = 1; value <= 5; value++) {
      svg.append(svgElement('line', { x1: x(value), x2: x(value), y1: 75, y2: 375, stroke: '#cbd4c7', 'stroke-width': 1 }));
      svg.append(svgElement('line', { x1: 85, x2: 585, y1: y(value), y2: y(value), stroke: '#cbd4c7', 'stroke-width': 1 }));
      svg.append(svgElement('text', { x: x(value), y: 400, 'text-anchor': 'middle', class: 'tick' }, String(value)));
      svg.append(svgElement('text', { x: 66, y: y(value) + 6, 'text-anchor': 'middle', class: 'tick' }, String(value)));
    }
    svg.append(svgElement('line', { x1: 285, x2: 285, y1: 75, y2: 375, stroke: '#667667', 'stroke-dasharray': '5 5', 'stroke-width': 2 }));
    svg.append(svgElement('line', { x1: 85, x2: 585, y1: 255, y2: 255, stroke: '#667667', 'stroke-dasharray': '5 5', 'stroke-width': 2 }));
    svg.append(svgElement('text', { x: 185, y: 197, 'text-anchor': 'middle', class: 'quadrant' }, 'Schedule'));
    svg.append(svgElement('text', { x: 435, y: 197, 'text-anchor': 'middle', class: 'quadrant' }, 'Do immediately'));
    svg.append(svgElement('text', { x: 185, y: 317, 'text-anchor': 'middle', class: 'quadrant' }, 'Delete / Defer'));
    svg.append(svgElement('text', { x: 435, y: 317, 'text-anchor': 'middle', class: 'quadrant' }, 'Delegate'));
    svg.append(svgElement('text', { x: 335, y: 438, 'text-anchor': 'middle', class: 'axis' }, 'Urgency →'));
    svg.append(svgElement('text', { transform: 'translate(26 225) rotate(-90)', 'text-anchor': 'middle', class: 'axis' }, 'Importance →'));
    svg.append(svgElement('text', { x: 335, y: 38, 'text-anchor': 'middle', class: 'chart-heading' }, `${tasks.length} task${tasks.length === 1 ? '' : 's'} placed`));
    EisenhowerMatrix.groupTasks(tasks).forEach(group => {
      const action = EisenhowerMatrix.getRecommendedAction(group.urgency, group.importance);
      const label = `${group.tasks.map(task => `Task ${task.number}: ${task.description}`).join('; ')}. Urgency ${group.urgency}, importance ${group.importance}. ${action}.`;
      const point = svgElement('g', { transform: `translate(${x(group.urgency)} ${y(group.importance)})`, tabindex: '0', role: 'button', 'aria-label': label, class: 'point' });
      point.append(svgElement('title', {}, label));
      point.append(svgElement('circle', { r: 22, fill: 'transparent', class: 'hit' }));
      point.append(svgElement('circle', { r: 15, fill: colours[action], stroke: '#fffef9', 'stroke-width': 2 }));
      point.append(svgElement('text', { y: 5, 'text-anchor': 'middle', fill: 'white', class: 'point-number' }, group.tasks.length > 1 ? `${group.tasks.length}×` : String(group.tasks[0].number)));
      const showDetail = () => { $('pointDetail').textContent = label; };
      point.addEventListener('focus', showDetail);
      point.addEventListener('mouseenter', showDetail);
      point.addEventListener('click', showDetail);
      point.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showDetail(); } });
      svg.append(point);
    });
    $('chart').replaceChildren(svg);
    $('pointDetail').textContent = tasks.length ? 'Focus, hover or tap a point to read its tasks.' : 'No points yet. Add a task to explore the map.';
  }
  function render() {
    $('taskList').replaceChildren();
    $('empty').hidden = tasks.length > 0;
    tasks.forEach((task, index) => {
      const action = EisenhowerMatrix.getRecommendedAction(task.urgency, task.importance);
      const item = element('li');
      const content = element('div');
      content.append(element('strong', `${index + 1}. ${task.description}`), element('p', `Urgency ${task.urgency} · Importance ${task.importance} → ${action}`));
      const controls = element('div', undefined, 'actions');
      const edit = element('button', 'Edit', 'secondary small');
      edit.setAttribute('aria-label', `Edit ${task.description}`);
      edit.addEventListener('click', () => {
        editingId = task.id;
        $('taskDescription').setCustomValidity('');
        $('taskDescription').value = task.description;
        $('taskUrgency').value = task.urgency;
        $('taskImportance').value = task.importance;
        $('addTaskButton').textContent = 'Save task changes';
        $('cancelEdit').hidden = false;
        preview(); $('taskDescription').focus();
        $('status').textContent = `Editing ${task.description}.`;
      });
      const remove = element('button', 'Remove', 'danger small');
      remove.setAttribute('aria-label', `Remove ${task.description}`);
      remove.addEventListener('click', () => {
        tasks.splice(tasks.findIndex(item => item.id === task.id), 1);
        if (editingId === task.id) cancelEdit();
        render(); $('status').textContent = `Removed ${task.description}.`; $('taskDescription').focus();
      });
      controls.append(edit, remove); item.append(content, controls);
      $('taskList').append(item);
    });
    drawChart();
  }
  $('taskForm').addEventListener('submit', event => {
    event.preventDefault();
    const description = $('taskDescription').value.trim();
    if (!description) { $('taskDescription').setCustomValidity('Enter a task description.'); $('taskDescription').reportValidity(); return; }
    const urgency = Number($('taskUrgency').value);
    const importance = Number($('taskImportance').value);
    const action = EisenhowerMatrix.getRecommendedAction(urgency, importance);
    const existing = tasks.find(task => task.id === editingId);
    if (existing) Object.assign(existing, { description, urgency, importance });
    else tasks.push({ id: nextId++, description, urgency, importance });
    cancelEdit(); render();
    $('status').textContent = `${existing ? 'Updated' : 'Added'} ${description}: ${action}.`;
    $('taskDescription').focus();
  });
  $('taskDescription').addEventListener('input', () => $('taskDescription').setCustomValidity(''));
  $('taskUrgency').addEventListener('change', preview);
  $('taskImportance').addEventListener('change', preview);
  $('cancelEdit').addEventListener('click', () => { cancelEdit(); $('status').textContent = 'Edit cancelled.'; $('taskDescription').focus(); });
  $('exampleButton').addEventListener('click', () => {
    [{ description: 'Resolve release blocker', urgency: 5, importance: 5 },
      { description: 'Plan recovery drills', urgency: 2, importance: 5 },
      { description: 'Handle routine meeting logistics', urgency: 4, importance: 2 },
      { description: 'Review an unused report format', urgency: 1, importance: 1 }
    ].forEach(task => tasks.push({ id: nextId++, ...task }));
    render(); $('status').textContent = 'Added four example tasks, one in each quadrant.';
  });
  preview(); render();
})();
