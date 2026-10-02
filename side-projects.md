---
layout: default
title: Experiments in how projects work
description: Experiments and examples exploring project and programme questions.
schema_type: CollectionPage
tags: [SideProjects, Examples]
wide: true
---

<div class="foray-directory" id="foray-directory">
  <header class="foray-intro pw-page-heading" id="browse-projects">
    <div><h1>Experiments</h1><p>Small project scenarios for exploring how work, resources and decisions fit together.</p></div>
    <nav class="foray-sections" aria-label="More ways to explore">
      <a href="#compare-approaches">Compare approaches <span aria-hidden="true">↗</span></a>
    </nav>
</header>

  <div class="foray-browse-tools">
  <details class="foray-question-routes" id="start-with-a-question">
    <summary>Start with a question</summary>
    <ul class="foray-question-list">
      {% for question in site.data.project_questions %}
      <li class="foray-question-route" id="question-{{ question.id | escape }}">
        <a class="foray-question-link" href="{{ question.path | escape }}">{{ question.question | escape }} <span aria-hidden="true">→</span></a>
        <p class="foray-question-project">{{ question.project_label | escape }}</p>
        <p class="foray-question-try">{{ question.try_this | escape }}</p>
        <p class="foray-question-limit">{{ question.limitation | escape }} <a href="{{ question.source_url | escape }}">Inspect source</a></p>
      </li>
      {% endfor %}
    </ul>
  </details>

  {% assign projects = site.data.side_projects | where: 'placement', 'project' | sort: 'gallery_order' %}
  <div class="foray-filter" id="foray-filter" hidden>
    <label for="foray-topic">Filter by topic</label>
    <select id="foray-topic" autocomplete="off">
      <option value="all">All topics</option>
      {% assign all_tags = projects | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
      {% for tag in all_tags %}
      <option value="{{ tag | escape }}">{{ tag | replace: '-', ' ' | escape }}</option>
      {% endfor %}
    </select>
    <p id="foray-count" role="status" aria-live="polite"></p>
  </div>

  </div>

    <section class="foray-group" aria-label="Project gallery">
      <div class="foray-grid">
      {% assign linked_groups = '|' %}
      {% for project in projects %}
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
        <article class="example-card foray-card" id="{{ project.id | escape }}" data-tags="{{ project.tags | join: ',' | escape }}">
          {% if legacy_anchor != '' %}<span class="foray-legacy-anchor" id="{{ legacy_anchor }}" aria-hidden="true"></span>{% endif %}
          <a class="foray-tile-link" href="{{ project.path | escape }}" aria-label="{{ project.action | escape }}: {{ project.title | escape }}" aria-describedby="{{ project.id | escape }}-question{% if project.entry_purpose %} {{ project.id | escape }}-purpose{% endif %}">
            <span class="foray-scenario-image"><img src="{{ project.tile_image | default: project.image | escape }}" alt="" width="640" height="400" {% if forloop.index <= 3 %}loading="eager"{% else %}loading="lazy"{% endif %} decoding="async"></span>
            <div class="foray-tile-body">
              <h2>{{ project.title | escape }}</h2>
              <p class="foray-scenario-caption">{{ project.scenario | escape }}</p>
              <p class="foray-entry-question" id="{{ project.id | escape }}-question">{{ project.entry_question | default: project.question | escape }}</p>
              {% if project.entry_purpose %}<p class="foray-entry-purpose" id="{{ project.id | escape }}-purpose">{{ project.entry_purpose | escape }}</p>{% endif %}
              <span class="foray-action">{{ project.action | escape }} <span aria-hidden="true">→</span></span>
            </div>
          </a>
          <details class="foray-details">
            <summary>About this project</summary>
            <div class="foray-detail-body">
              {% if project.entry_question %}<p class="foray-question">{{ project.question | escape }}</p>{% endif %}
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

  <p class="pw-library-legacy-route" id="other-projects">Custom GPTs now live in the <a data-library-destination href="{{ '/library.html#custom-gpts' | relative_url }}">Library →</a>.</p>
</div>
<script src="{{ '/assets/js/library-routes.js' | relative_url }}" defer></script>
<script src="{{ '/assets/forays.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
