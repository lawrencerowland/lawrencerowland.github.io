---
layout: default
title: Explore visually
description: Browse small pictures of project models, diagrams and interactive views, then open a larger explanation or visit the original example.
schema_type: CollectionPage
wide: true
home_front_door: true
---

<div class="pw-home viz-explorer" id="home-main" tabindex="-1" data-baseurl="{{ site.baseurl | escape }}">
  <header class="viz-heading">
    <a class="viz-return" href="{{ '/library.html' | relative_url }}">← Library</a>
    <h1>Explore visually.</h1>
    <p>Find a picture that helps you think. Hover or focus for a hint; open it to explore the original example.</p>
    <p class="viz-note">A first selection of {{ site.data.visualisations | size }} views from across the published work, including earlier examples. More to come.</p>
  </header>

  <noscript><p>Each picture links directly to its original example. Enable JavaScript for hints and enlarged previews.</p></noscript>
  <div class="viz-grid" id="viz-grid" aria-label="Visualisations">
    {% for view in site.data.visualisations %}
    <a class="viz-tile" href="{{ view.url | escape }}" data-view="{{ view.id | escape }}" aria-labelledby="viz-title-{{ view.id | escape }}" aria-describedby="viz-caption-{{ view.id | escape }}">
      <span class="viz-picture"><img src="{{ view.thumb | relative_url }}" alt="" width="{{ view.width }}" height="{{ view.height }}" {% if forloop.index <= 12 %}loading="eager"{% else %}loading="lazy"{% endif %} decoding="async"></span>
      <span class="viz-tooltip" role="tooltip" hidden><strong id="viz-title-{{ view.id | escape }}">{{ view.title | escape }}</strong><span id="viz-caption-{{ view.id | escape }}">{{ view.caption | escape }}</span></span>
    </a>
    {% endfor %}
  </div>
  <p class="viz-footnote">These are saved views of the examples, not live models in miniature. Open an interactive example to change its inputs. Inclusion here does not mean that an older model has received a new technical review.</p>

  <dialog class="viz-dialog" id="viz-dialog" aria-labelledby="viz-detail-title">
    <div class="viz-dialog-top"><p id="viz-position" aria-live="polite"></p><button type="button" id="viz-close" aria-label="Close preview" autofocus>Close <span aria-hidden="true">×</span></button></div>
    <div class="viz-detail-layout">
      <div class="viz-detail-picture"><img id="viz-detail-image" alt=""><a id="viz-full-image" href="#" target="_blank" rel="noopener">Open picture at full size ↗</a><nav class="viz-related" id="viz-related" aria-label="Compare related views" hidden><p>Compare</p><div id="viz-related-links"></div></nav></div>
      <div class="viz-detail-copy">
        <p class="viz-detail-home" id="viz-detail-home"></p>
        <h2 id="viz-detail-title"></h2>
        <p class="viz-detail-status" id="viz-detail-status"></p>
        <p id="viz-caption"></p>
        <p><strong>Look for</strong><br><span id="viz-look"></span></p>
        <p class="viz-detail-limit"><strong>Keep in mind</strong><br><span id="viz-limit"></span></p>
        <p class="viz-detail-state" id="viz-state-wrap"><strong>View shown</strong><br><span id="viz-state"></span></p>
        <a class="viz-open-source" id="viz-source" href="#">Open this example →</a>
        <p class="viz-detail-provenance"><span id="viz-capture"></span> · <span id="viz-checked"></span><span id="viz-original-wrap"> · <a id="viz-original" href="#" target="_blank" rel="noopener">Original image ↗</a></span></p>
      </div>
    </div>
    <nav class="viz-detail-nav" aria-label="Browse previews"><button type="button" id="viz-previous">← Previous</button><span>Use ← → keys</span><button type="button" id="viz-next">Next →</button></nav>
  </dialog>
</div>
<script type="application/json" id="viz-data">{{ site.data.visualisations | jsonify }}</script>
<script src="{{ '/assets/visual-explorer.js' | relative_url }}" defer></script>
