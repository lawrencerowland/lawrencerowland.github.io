/* Old Library bookmarks follow their entries into the subject pages. The same
   visible link is the fallback when scripts or navigation are unavailable. */
(function () {
  function followEntry() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return; }
    const entry = document.getElementById(id);
    const link = entry && entry.querySelector('a[data-library-destination]');
    if (!link) return;
    const destination = new URL(link.href, window.location.href);
    destination.search = window.location.search;
    link.href = destination.href;
    try { window.location.replace(destination.href); } catch (_) { /* Keep the link usable. */ }
  }
  followEntry();
  window.addEventListener('hashchange', followEntry);
}());
