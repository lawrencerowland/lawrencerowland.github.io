---
layout: default
title: Projects
description: Independent experiments and examples exploring project and programme questions.
schema_type: CollectionPage
tags: [SideProjects, Examples]
wide: true
---

<div class="foray-directory" id="foray-directory">
  <header class="foray-intro" id="browse-projects">
    <div><h1>Projects</h1><p>Experiments in project thinking.</p></div>
    <nav class="foray-sections" aria-label="More ways to explore">
      <a href="#compare-approaches">Compare approaches <span aria-hidden="true">↗</span></a>
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

    <section class="foray-group" aria-label="Project gallery">
      <div class="foray-grid">
      {% assign linked_groups = '|' %}
      {% for project in site.data.side_projects %}
        {% comment %}Preserve published section fragments at their first corresponding card.{% endcomment %}
        {% assign group_key = project.group | prepend: '|' | append: '|' %}
        {% assign legacy_anchor = '' %}
        {% unless linked_groups contains group_key %}
          {% case project.group %}
            {% when 'gimmer' %}{% assign legacy_anchor = 'gimmer-projects' %}
            {% when 'featured' %}{% assign legacy_anchor = 'featured-forays' %}
            {% when 'library' %}{% assign legacy_anchor = 'playgrounds' %}
          {% endcase %}
          {% assign linked_groups = linked_groups | append: project.group | append: '|' %}
        {% endunless %}
        <article class="example-card foray-card" {% if legacy_anchor != '' %}id="{{ legacy_anchor }}" {% endif %}data-tags="{{ project.tags | join: ',' | escape }}">
          <a class="foray-tile-link" href="{{ project.path | escape }}" aria-label="{{ project.action | escape }}: {{ project.title | escape }}">
            <span class="foray-scenario-image"><img src="{{ project.image | escape }}" alt="" width="640" height="400" {% if forloop.index <= 3 %}loading="eager"{% else %}loading="lazy"{% endif %} decoding="async"></span>
            <div class="foray-tile-body">
              <h2>{{ project.title | escape }}</h2>
              <p class="foray-scenario-caption">{{ project.scenario | escape }}</p>
              <span class="foray-action">{{ project.action | escape }} <span aria-hidden="true">→</span></span>
            </div>
          </a>
          <details class="foray-details">
            <summary>About this project</summary>
            <div class="foray-detail-body">
              <p class="foray-question">{{ project.question | escape }}</p>
              <p>{{ project.description | escape }}</p>
              {% if project.origin %}<p class="foray-origin">Origin: {{ project.origin | escape }}</p>{% endif %}
              <ul class="foray-tags" aria-label="Topics">
                {% for tag in project.tags %}<li>{{ tag | replace: '-', ' ' | escape }}</li>{% endfor %}
              </ul>
              {% if project.related %}
              <ul class="foray-related">
                {% for link in project.related %}<li><a href="{{ link.path | escape }}">{{ link.title | escape }}</a></li>{% endfor %}
              </ul>
              {% endif %}
            </div>
          </details>
        </article>
      {% endfor %}
      </div>
      <p class="foray-empty" id="foray-empty" hidden>No projects match this topic. Choose “All topics” to see the full collection.</p>
    </section>
  <section class="foray-comparison" id="compare-approaches" aria-labelledby="compare-approaches-heading">
    <h2 id="compare-approaches-heading">Compare approaches across the portfolio</h2>
    <p class="foray-comparison-lead">One shared challenge. Nine ways to reason.</p>
    <p>Nine approaches from across these side projects, applied to the same fictional mountain-refuge brief. Gimmer supplies the shared test case; the comparison spans processes, dynamics, agreement, co-design, semantics and decisions.</p>
    <div class="foray-comparison-actions">
      <a class="foray-comparison-link" href="{{ '/gimmer-comparison/' | relative_url }}">Open the comparison <span aria-hidden="true">→</span></a>
      <a href="#browse-projects">Browse individual projects <span aria-hidden="true">↑</span></a>
    </div>
  </section>

  <p class="foray-other-links" id="other-projects">Also explore <a href="{{ '/gpt-links-page.html' | relative_url }}">My Custom GPTs</a> or the earlier <a href="https://lawrencerowland.github.io/project_innovation_app/">Project Innovation App</a>.</p>
  <p class="foray-note">These are exploratory tools and toy models, not validated delivery methods.</p>
  <p class="foray-note">For individual tools from the two general app libraries, use the <a href="{{ '/all-project-apps.html' | relative_url }}">All Project Apps catalogue</a>.</p>
</div>
<script src="{{ '/assets/forays.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
