---
layout: default
title: Sitemap
schema_type: CollectionPage
wide: true
home_front_door: true
---

<div class="pw-home pw-site-map" id="home-main" tabindex="-1">
<header class="pw-page-heading"><h1>Sitemap</h1><p>Follow a branch. Open a heading to see what sits beneath it.</p></header>
<div class="pw-map-root"><a href="{{ '/' | relative_url }}">Home</a></div>
<div class="pw-map-branches">
  {% assign projects = site.data.side_projects | where: 'placement', 'project' | sort: 'gallery_order' %}
  <section class="pw-map-branch" aria-labelledby="map-experiments">
    <h2 id="map-experiments"><a href="{{ '/side-projects.html' | relative_url }}">Experiments</a></h2>
    <details open><summary>{{ projects | size }} projects</summary><ol>
    {% for project in projects %}<li><a href="{{ project.path | relative_url }}">{{ project.title | escape }}</a>{% if project.related %}<details><summary>Linked examples</summary><ul>{% for item in project.related %}<li><a href="{{ item.path | relative_url }}">{{ item.title | escape }}</a></li>{% endfor %}</ul></details>{% endif %}</li>{% endfor %}
    </ol></details>
    <p class="pw-map-note">Each project continues into its own essays and apps.</p>
    <a href="{{ '/gimmer-comparison/' | relative_url }}">Compare the Gimmer approaches</a>
  </section>
  <section class="pw-map-branch" aria-labelledby="map-library">
    <h2 id="map-library"><a href="{{ '/library.html' | relative_url }}">Library</a></h2>
    <p class="pw-map-count">{{ site.data.library_themes | size | plus: 1 }} subjects</p>
    <ol class="pw-map-subjects">
    {% for theme in site.data.library_themes %}{% assign entries = site.data.library_apps | concat: site.data.library_materials | where: 'theme', theme.id | sort: 'order' %}
      <li><details><summary>{{ theme.title | escape }} <span>{{ entries | size }}</span></summary><p><a href="{{ '/library/methods/' | append: theme.id | append: '.html' | relative_url }}">Open this subject →</a></p><ol>{% for entry in entries %}{% include site-map-entry.html entry=entry %}{% endfor %}</ol></details></li>
    {% endfor %}
      <li><a href="{{ '/gpt-links-page.html' | relative_url }}">Custom GPTs</a></li>
    </ol>
    <details class="pw-map-further"><summary>Further shelves &amp; site information</summary><ol>
    {% for entry in site.data.library_additional %}<li><a href="{{ entry.url | relative_url }}">{{ entry.title | escape }}</a>{% if entry.id == 'wider-interest' %}<details><summary>{{ site.data.wider_interest | size }} pictured entries</summary><ol>{% for item in site.data.wider_interest %}<li><a href="{{ item.url | relative_url }}">{{ item.title | escape }}</a></li>{% endfor %}</ol></details>{% endif %}</li>{% endfor %}
    </ol></details>
  </section>
  <section class="pw-map-branch" aria-labelledby="map-atlas">
    <h2 id="map-atlas"><a href="{{ '/explore-visually.html' | relative_url }}">Visual atlas</a></h2>
    <details><summary>{{ site.data.visualisations | size }} pictures</summary><ol>{% for view in site.data.visualisations %}<li><a href="{{ '/explore-visually.html?view=' | append: view.id | relative_url }}">{{ view.title | escape }}</a></li>{% endfor %}</ol></details>
    <p class="pw-map-note">Another entrance to the same work. Each picture leads to its example.</p>
  </section>
</div>
</div>
