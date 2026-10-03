---
layout: default
title: Find a moved app
legacy_redirect: true
schema_type: WebPage
---

# Find a moved app

The old collection has been placed in the [Library](/library.html), [Experiments](/side-projects.html) and [Wider interest](/wider-interest/). Saved app links still find their current home here.

<p id="moved-app-notice" role="status">Choose a subject above, or reopen your saved app link.</p>
<noscript><p>JavaScript resolves named app bookmarks. The three subject links above remain available.</p></noscript>
<script>
const slugify = name => String(name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
async function loadData() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('app');
  if (!slug) return;
  const notice = document.getElementById('moved-app-notice');
  try {
    const [homes, retired] = await Promise.all(['/assets/data/specialist-apps.json','/assets/data/retired-apps.json'].map(async url => {
      const response = await fetch(url); if (!response.ok) throw new Error('Catalogue unavailable'); return response.json();
    }));
    const retirement = retired.find(item => slugify(item.name) === slug);
    if (retirement) { notice.textContent = retirement.reason; return; }
    const item = homes.find(item => slugify(item.name) === slug);
    if (!item) { notice.textContent = 'No saved app matches this name. Browse a subject above.'; return; }
    const destination = new URL(item.url);
    if (destination.origin !== 'https://lawrencerowland.github.io') throw new Error('Unsupported destination');
    params.delete('app'); destination.search = params.toString();
    if (window.location.hash) destination.hash = window.location.hash;
    notice.textContent = item.name + ' now lives in ' + item.home + '. ';
    const link = document.createElement('a'); link.href = destination.href; link.textContent = 'Open the example →'; notice.appendChild(link);
  } catch { notice.textContent = 'The saved-link list could not load. Try again, or browse a subject above.'; }
}
document.addEventListener('DOMContentLoaded', loadData);
</script>
