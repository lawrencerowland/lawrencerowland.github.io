---
layout: default
title: Experiments in how projects work
description: Experiments and examples exploring project and programme questions.
schema_type: CollectionPage
tags: [SideProjects, Examples]
wide: true
home_front_door: true
---

<div class="pw-home" id="home-main" tabindex="-1"><div class="foray-directory" id="foray-directory">
  <header class="foray-intro pw-page-heading" id="browse-projects">
    <div><h1>Experiments</h1><p>Open questions about how projects work.</p></div>

<p class="pw-gallery-instruction"><span class="pw-gallery-desktop">Hover over a tile for details. Click to enter.</span><span class="pw-gallery-touch">Tap a tile to enter.</span></p>
</header>

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

    <section class="foray-group" aria-label="Project gallery">
      <div class="pw-picture-grid">
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
        {% assign tile = site.data.experiment_tiles[project.id] %}
        {% assign tile_tags = project.tags | join: ',' %}
        {% include picture-tile.html tile_id=project.id card_class="foray-card" tags=tile_tags legacy_anchor=legacy_anchor title=tile.title description=tile.description url=project.path image=tile.image variant="emblem" %}
      {% endfor %}
      </div>
      <p class="foray-empty" id="foray-empty" hidden>No projects match this topic. Choose “All topics” to see the full collection.</p>
    </section>
  <details class="pw-gallery-notes" id="project-notes"><summary>Project notes and linked examples</summary>
    {% for project in projects %}<section id="notes-{{ project.id }}">
      <h2>{{ project.title | escape }}</h2>
      <p>{{ project.entry_purpose | escape }}</p><p>{{ project.description | escape }}</p>
      <p>{{ project.scenario | escape }}</p><p>{{ project.question | escape }}</p>
      {% if project.origin %}<p>Origin: {{ project.origin | escape }}</p>{% endif %}
      <p>{{ project.tags | join: ', ' | replace: '-', ' ' | escape }}</p>
      {% if project.related %}<ul>{% for link in project.related %}<li><a href="{{ link.path | escape }}">{{ link.title | escape }}</a></li>{% endfor %}</ul>{% endif %}
    </section>{% endfor %}
  </details>
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
</div></div>
<script src="{{ '/assets/js/library-routes.js' | relative_url }}" defer></script>
<script src="{{ '/assets/forays.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
