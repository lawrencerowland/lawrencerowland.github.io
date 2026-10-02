---
layout: default
title: Project examples have moved
description: The earlier project examples now have homes in Library subjects and their relevant projects.
canonical_url: https://lawrencerowland.github.io/library.html
sitemap: false
legacy_redirect: true
---

# Project examples have moved

These examples now sit with their subjects in the Library or with their related projects.

<p><a id="destination" href="{{ '/library.html#interactive-methods' | relative_url }}">Browse the Library subjects →</a></p>
<noscript><p>Automatic forwarding requires JavaScript. Use the link above to continue.</p></noscript>

<script>
(() => {
  const target = new URL(document.getElementById('destination').href, location.href);
  target.search = location.search;
  target.hash = 'interactive-methods';
  document.getElementById('destination').href = target.href;
  try {
    location.replace(target.href);
  } catch {
    // The visible link remains usable when automatic forwarding is blocked.
  }
})();
</script>
