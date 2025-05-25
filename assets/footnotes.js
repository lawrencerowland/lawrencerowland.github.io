// Simple footnote hover popups
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('sup.footnote-ref').forEach(ref => {
    const link = ref.querySelector('a');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id) return;
    const note = document.querySelector(id);
    if (!note) return;
    const popup = document.createElement('span');
    popup.className = 'footnote-popup';
    popup.innerHTML = note.innerHTML;
    ref.appendChild(popup);
  });
});
