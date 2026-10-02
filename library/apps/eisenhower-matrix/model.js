(function (root) {
  'use strict';
  function getRecommendedAction(urgency, importance) {
    if (![urgency, importance].every(value => Number.isInteger(value) && value >= 1 && value <= 5)) {
      throw new RangeError('Choose whole-number urgency and importance ratings from 1 to 5.');
    }
    if (importance >= 3) return urgency >= 3 ? 'Do immediately' : 'Schedule (Decide)';
    return urgency >= 3 ? 'Delegate' : 'Delete / Defer';
  }
  function groupTasks(tasks) {
    const groups = new Map();
    tasks.forEach((task, index) => {
      getRecommendedAction(task.urgency, task.importance);
      const key = `${task.urgency},${task.importance}`;
      if (!groups.has(key)) groups.set(key, { urgency: task.urgency, importance: task.importance, tasks: [] });
      groups.get(key).tasks.push({ ...task, number: index + 1 });
    });
    return [...groups.values()];
  }
  const api = { getRecommendedAction, groupTasks };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EisenhowerMatrix = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
