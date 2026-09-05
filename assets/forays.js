(() => {
  const directory = document.getElementById('foray-directory');
  if (!directory) return;
  const filter = document.getElementById('foray-filter');
  const select = document.getElementById('foray-topic');
  const count = document.getElementById('foray-count');
  const cards = [...directory.querySelectorAll('.foray-card')];
  const groups = [...directory.querySelectorAll('.foray-group')];

  function applyFilter() {
    let visible = 0;
    cards.forEach(card => {
      const tags = card.dataset.tags.split(',').map(tag => tag.trim());
      card.hidden = select.value !== 'all' && !tags.includes(select.value);
      if (!card.hidden) visible += 1;
    });
    groups.forEach(group => {
      const hasMatches = [...group.querySelectorAll('.foray-card')].some(card => !card.hidden);
      group.querySelector('.foray-empty').hidden = hasMatches;
    });
    count.textContent = visible + ' of ' + cards.length + ' projects shown';
  }

  // Filtering is temporary. Reload starts from the complete directory.
  select.value = 'all';
  select.addEventListener('change', applyFilter);
  filter.hidden = false;
  applyFilter();

  // Browsers can restore a select value after history navigation without firing change.
  // Reset after that restoration so the control, visible cards and count agree.
  window.addEventListener('pageshow', () => {
    window.setTimeout(() => {
      select.value = 'all';
      applyFilter();
    }, 0);
  });
})();
