---
layout: default
title: About page moved
permalink: /about_the_site.html
redirect_to: /about_me.html
canonical_url: https://lawrencerowland.github.io/about_me.html
legacy_redirect: true
sitemap: false
---

<h1>The About pages are now together</h1>
<p><a id="about-destination" href="{{ page.redirect_to | relative_url }}">Continue to About →</a></p>

<script>
(function () {
  var destination = document.getElementById('about-destination');
  var url = new URL(destination.href);
  var fragments = {
    'about-this-site': 'about',
    'the-sites-earlier-purpose': 'earlier-purpose',
    'purpose': 'purpose',
    'description': 'purpose',
    'how-to-use': 'how-to-use',
    'motivation': 'motivation',
    'contact': 'contact'
  };
  url.search = window.location.search;
  if (window.location.hash) {
    var fragment = window.location.hash.slice(1);
    try { fragment = decodeURIComponent(fragment); } catch (error) { /* Preserve unfamiliar fragments. */ }
    var oldSection = fragment.replace(/^markdown-toc-/, '');
    url.hash = Object.prototype.hasOwnProperty.call(fragments, oldSection) ? fragments[oldSection] : fragment;
  }
  destination.href = url.href;
  try { window.location.replace(url.href); } catch (error) { /* The visible link remains usable. */ }
}());
</script>
