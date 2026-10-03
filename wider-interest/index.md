---
layout: default
title: Wider interest
schema_type: CollectionPage
wide: true
home_front_door: true
---

<div class="pw-home pw-wider-gallery" id="home-main" tabindex="-1">
<header class="pw-page-heading"><h1>Wider interest</h1><p>Topics beyond projects and AI.</p></header>
<div class="pw-home-question-grid">
{% for entry in site.data.wider_interest %}
<article class="pw-home-question"><a class="pw-home-tile-link" href="{{ entry.url | relative_url }}" aria-labelledby="wider-{{ entry.id }}">
  <div class="pw-home-question-visual"><img src="{{ entry.image | relative_url }}" width="800" height="500" alt="" loading="lazy"></div>
  <div class="pw-home-question-copy"><h2 id="wider-{{ entry.id }}">{{ entry.title | escape }}</h2><p>{{ entry.description | escape }}</p></div>
</a></article>
{% endfor %}
</div>
</div>
