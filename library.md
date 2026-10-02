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

  <section class="pw-retained-collections" id="earlier-app-collections" aria-labelledby="collections-title">
    <h2 id="collections-title">Earlier app collections</h2>
    <p>The collections keep the apps still waiting for a clearer home. As examples move into named projects or Library subjects, their old listings are removed; saved links still lead to their destinations.</p>
    <details>
      <summary>Browse the remaining collections</summary>
      <div class="foray-grid">
      {% assign collections = site.data.side_projects | where: 'placement', 'library' %}
      {% for project in collections %}
        <article class="example-card foray-card" id="{{ project.id | escape }}">
          <a class="foray-tile-link" href="{{ project.path | escape }}" aria-label="{{ project.action | escape }}: {{ project.title | escape }}">
            <span class="foray-scenario-image"><img src="{{ project.image | escape }}" alt="" width="640" height="400" loading="lazy" decoding="async"></span>
            <div class="foray-tile-body">
              <h3>{{ project.title | escape }}</h3>
              <p class="foray-scenario-caption">{{ project.scenario | escape }}</p>
              <span class="foray-action">{{ project.action | escape }} <span aria-hidden="true">→</span></span>
            </div>
          </a>
          <details class="foray-details">
            <summary>About this collection</summary>
            <div class="foray-detail-body">
              <p class="foray-question">{{ project.question | escape }}</p>
              <p>{{ project.description | escape }}</p>
              {% if project.origin %}<p class="foray-origin">Origin: {{ project.origin | escape }}</p>{% endif %}
              <ul class="foray-tags" aria-label="Topics">{% for tag in project.tags %}<li>{{ tag | replace: '-', ' ' | escape }}</li>{% endfor %}</ul>
              {% if project.related %}<ul class="foray-related">{% for link in project.related %}<li><a href="{{ link.path | escape }}">{{ link.title | escape }}</a></li>{% endfor %}</ul>{% endif %}
            </div>
          </details>
        </article>
      {% endfor %}
      </div>
    </details>
    <p><a href="{{ '/all-project-apps.html' | relative_url }}">Browse the combined app catalogue</a> · <a href="https://lawrencerowland.github.io/more-project-apps/">More Project Apps</a></p>
  </section>

  <nav class="pw-library-utilities" aria-label="About and site index"><a href="{{ '/about_me.html' | relative_url }}">About</a><a href="{{ '/sitemap.html' | relative_url }}">Sitemap</a></nav>

  {% for route in site.data.library_redirects %}
  <p class="pw-library-legacy-route" id="{{ route.id }}">This entry is now in <a data-library-destination href="{{ route.url | relative_url }}">{{ route.title | escape }} →</a></p>
  {% endfor %}
</div>
<script src="{{ '/assets/js/library-routes.js' | relative_url }}" defer></script>
