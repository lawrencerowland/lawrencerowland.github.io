---
layout: default
title: Forays & Side Projects
description: Experiments, models and playgrounds for exploring project and programme questions.
schema_type: CollectionPage
tags: [SideProjects, Examples, Forays]
wide: true
---

<div class="foray-directory" id="foray-directory">
  <header class="foray-intro">
    <h1>Forays &amp; Side Projects</h1>
    <p>Small experiments in project and programme thinking. Start with a question, try a model, or browse a collection.</p>
    <p class="foray-note">These are exploratory tools and toy models, not validated delivery methods.</p>
    <nav class="foray-sections" aria-label="On this page">
      <a href="#featured-forays">Featured forays</a>
      <a href="#playgrounds">Playgrounds &amp; libraries</a>
      <a href="#other-projects">Other side projects</a>
      <a href="{{ '/all-project-apps.html' | relative_url }}">All Project Apps catalogue</a>
    </nav>
  </header>

  <div class="foray-filter" id="foray-filter" hidden>
    <label for="foray-topic">Filter by topic</label>
    <select id="foray-topic" autocomplete="off">
      <option value="all">All topics</option>
      {% assign all_tags = site.data.side_projects | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
      {% for tag in all_tags %}
      <option value="{{ tag | escape }}">{{ tag | replace: '-', ' ' | escape }}</option>
      {% endfor %}
    </select>
    <p id="foray-count" role="status" aria-live="polite"></p>
  </div>

  {% assign groups = 'featured,library,other' | split: ',' %}
  {% for group in groups %}
    {% case group %}
      {% when 'featured' %}{% assign section_id = 'featured-forays' %}{% assign section_title = 'Featured forays' %}
      {% when 'library' %}{% assign section_id = 'playgrounds' %}{% assign section_title = 'Playgrounds & libraries' %}
      {% when 'other' %}{% assign section_id = 'other-projects' %}{% assign section_title = 'Other side projects' %}
    {% endcase %}
    <section class="foray-group" id="{{ section_id }}" aria-labelledby="{{ section_id }}-heading">
      <h2 id="{{ section_id }}-heading">{{ section_title | escape }}</h2>
      <div class="foray-grid">
      {% for project in site.data.side_projects %}
        {% if project.group == group %}
        <article class="example-card foray-card" data-tags="{{ project.tags | join: ',' | escape }}">
          <h3>{{ project.title | escape }}</h3>
          <p class="foray-question">{{ project.question | escape }}</p>
          <p>{{ project.description | escape }}</p>
          {% if project.origin %}<p class="foray-origin">Origin: {{ project.origin | escape }}</p>{% endif %}
          <ul class="foray-tags" aria-label="Topics">
            {% for tag in project.tags %}<li>{{ tag | replace: '-', ' ' | escape }}</li>{% endfor %}
          </ul>
          <p class="foray-action"><a href="{{ project.path | escape }}" aria-label="{{ project.action | escape }}: {{ project.title | escape }}">{{ project.action | escape }} <span aria-hidden="true">→</span></a></p>
          {% if project.related %}
          <ul class="foray-related">
            {% for link in project.related %}<li><a href="{{ link.path | escape }}">{{ link.title | escape }}</a></li>{% endfor %}
          </ul>
          {% endif %}
        </article>
        {% endif %}
      {% endfor %}
      </div>
      <p class="foray-empty" hidden>No projects in this section match this topic. Choose “All topics” to see the full collection.</p>
      {% if group == 'other' %}
      <p class="foray-other-links">Also explore <a href="{{ '/gpt-links-page.html' | relative_url }}">My Custom GPTs</a> or the earlier <a href="https://lawrencerowland.github.io/project_innovation_app/">Project Innovation App</a>.</p>
      {% endif %}
    </section>
  {% endfor %}
  <p class="foray-note">For individual tools from the two general app libraries, use the <a href="{{ '/all-project-apps.html' | relative_url }}">All Project Apps catalogue</a>.</p>
</div>
<script src="{{ '/assets/forays.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
