---
layout: default
title: Methods library
description: Captured solutions, modelling examples and earlier methods for particular project and portfolio problems, kept distinct from open research enquiries.
schema_type: CollectionPage
wide: true
home_front_door: true
tags: [Projects, Examples, PortfolioManagement, Library]
---

<div class="pw-home" id="home-main" tabindex="-1">
  <header class="pw-page-heading">
    <h1 id="library-title">Methods library</h1>
    <p>A home for more established methods.</p>
    <p class="pw-gallery-instruction"><span class="pw-gallery-desktop">Hover over a tile for details. Click to enter.</span><span class="pw-gallery-touch">Tap a tile to enter.</span></p>
  </header>

  <section class="pw-home-questions pw-library-subjects" id="interactive-methods" aria-label="Library subjects">
    <span id="library-starts"></span><span id="notes"></span><span id="blog-posts"></span><span id="earlier-notes--2020"></span><span id="historical-articles"></span>
    <div class="pw-picture-grid">
    {% for theme in site.data.library_themes %}
      {% assign theme_url = '/library/methods/' | append: theme.id | append: '.html' %}
      {% assign theme_id = 'theme-' | append: theme.id %}
      {% include picture-tile.html tile_id=theme_id title=theme.title description=theme.question url=theme_url image=theme.image %}
    {% endfor %}
      {% include picture-tile.html tile_id="custom-gpts" title="Custom GPTs" description="Coaches and co-pilots for thinking through project work." url="/gpt-links-page.html" image="/images/8GPTs.WEBP" %}
    </div>
  </section>

  <section class="pw-library-additional" aria-label="Further reading and site information">
    <span id="earlier-app-collections"></span>
    <div class="pw-picture-grid">
    {% for entry in site.data.library_additional %}
      {% include picture-tile.html tile_id=entry.id title=entry.title description=entry.description url=entry.url image=entry.image %}
    {% endfor %}
    </div>
  </section>

  {% for route in site.data.library_redirects %}
  <p class="pw-library-legacy-route" id="{{ route.id }}">This entry is now in <a data-library-destination href="{{ route.url | relative_url }}">{{ route.title | escape }} →</a></p>
  {% endfor %}
</div>
<script src="{{ '/assets/js/library-routes.js' | relative_url }}" defer></script>
