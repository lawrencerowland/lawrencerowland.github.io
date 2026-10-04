---
layout: default
title: Scenarios
description: Start with a concrete project situation and explore the different questions it raises.
schema_type: CollectionPage
wide: true
home_front_door: true
---

<div class="pw-home pw-scenarios" id="home-main" tabindex="-1">
  <header class="pw-page-heading">
    <h1>Scenarios</h1>
    <p>Start with a situation. Follow the questions it raises.</p>
    <p class="pw-gallery-instruction"><span class="pw-gallery-desktop">Hover over a tile for details. Click to enter.</span><span class="pw-gallery-touch">Tap a tile to enter.</span></p>
  </header>

  <div class="pw-picture-grid" aria-label="Scenarios">
    {% for scenario in site.data.project_scenarios %}
      {% include picture-tile.html tile_id=scenario.id title=scenario.title description=scenario.description url=scenario.url image=scenario.image image_alt=scenario.image_alt variant="scenario" %}
    {% endfor %}
  </div>

  <p class="pw-route-note">One scenario can support several enquiries. Each keeps its own questions, assumptions and working examples.</p>
</div>
