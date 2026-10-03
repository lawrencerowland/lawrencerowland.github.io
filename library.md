---
layout: default
title: Library of more established methods
description: Captured solutions, modelling examples and earlier methods for particular project and portfolio problems, kept distinct from open research enquiries.
schema_type: CollectionPage
wide: true
home_front_door: true
tags: [Projects, Examples, PortfolioManagement, Library]
---

<div class="pw-home" id="home-main" tabindex="-1">
  <header class="pw-page-heading">
    <h1 id="library-title">Library</h1>
    <p>A home for more established methods.</p>
  </header>

  <section class="pw-home-questions pw-library-subjects" id="interactive-methods" aria-label="Library subjects">
    <span id="library-starts"></span><span id="notes"></span><span id="blog-posts"></span><span id="earlier-notes--2020"></span><span id="historical-articles"></span>
    <div class="pw-home-question-grid">
    {% for theme in site.data.library_themes %}
      <article class="pw-home-question"><a class="pw-home-tile-link" href="{{ '/library/methods/' | append: theme.id | append: '.html' | relative_url }}" aria-labelledby="theme-{{ theme.id }}">
        <div class="pw-home-question-visual"><img src="{{ theme.image | relative_url }}" alt="" width="960" height="600" loading="lazy"></div>
        <div class="pw-home-question-copy"><h2 id="theme-{{ theme.id }}">{{ theme.title | escape }}</h2><p>{{ theme.description | escape }}</p></div>
        <span class="pw-home-route-link">Explore this subject →</span>
      </a></article>
    {% endfor %}
      <article class="pw-home-question" id="custom-gpts"><a class="pw-home-tile-link" href="{{ '/gpt-links-page.html' | relative_url }}" aria-labelledby="custom-gpts-title">
        <div class="pw-home-question-visual"><img src="{{ '/images/8GPTs.WEBP' | relative_url }}" alt="" width="1792" height="1024" loading="lazy"></div>
        <div class="pw-home-question-copy"><h2 id="custom-gpts-title">Custom GPTs</h2><p>Coaches, co-pilots and agents for thinking through project work.</p></div>
        <span class="pw-home-route-link">Browse the GPTs →</span>
      </a></article>
    </div>
  </section>

  <section class="pw-library-additional" aria-label="Further reading and site information">
    <span id="earlier-app-collections"></span>
    <div class="pw-home-question-grid">
    {% for entry in site.data.library_additional %}
      <article class="pw-home-question" id="{{ entry.id }}"><a class="pw-home-tile-link" href="{{ entry.url | relative_url }}" aria-labelledby="additional-{{ entry.id }}">
        <div class="pw-home-question-visual"><img src="{{ entry.image | relative_url }}" alt="" width="800" height="500" loading="lazy"></div>
        <div class="pw-home-question-copy"><h2 id="additional-{{ entry.id }}">{{ entry.title | escape }}</h2><p>{{ entry.description | escape }}</p></div>
      </a></article>
    {% endfor %}
    </div>
  </section>

  {% for route in site.data.library_redirects %}
  <p class="pw-library-legacy-route" id="{{ route.id }}">This entry is now in <a data-library-destination href="{{ route.url | relative_url }}">{{ route.title | escape }} →</a></p>
  {% endfor %}
</div>
<script src="{{ '/assets/js/library-routes.js' | relative_url }}" defer></script>
