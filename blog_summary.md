---
layout: default
title: Earlier notes have moved
schema_type: CollectionPage
canonical_url: https://lawrencerowland.github.io/blog.html
---

# Earlier notes have moved

The notes and blog archive now share one entrance. All four original posts, dates and short descriptions remain available.

<p><a id="writing-destination" href="{{ '/blog.html' | relative_url }}">Open the earlier blog posts →</a></p>

<script>
(function () {
  const destination = document.getElementById('writing-destination');
  const target = new URL(destination.href);
  target.search = window.location.search;
  target.hash = window.location.hash;
  destination.href = target.href;
  try { window.location.replace(target.href); } catch (_) { /* The visible link remains available. */ }
})();
</script>
