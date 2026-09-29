---
layout: default
title: Project Examples
schema_type: CollectionPage
tags: [Examples, Visualization, KnowledgeManagement]
---

# Project Examples

Earlier project examples, with links to corrected versions where the work has developed. Earlier illustrations remain available for comparison.

<div class="filter">
  <button data-tag="all">All</button>
  {% assign all_tags = site.data.examples | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
  {% for tag in all_tags %}
  <button data-tag="{{ tag }}">{{ tag }}</button>
  {% endfor %}
</div>

<div id="example-container">
  {% for example in site.data.examples %}
  <div class="example-card" data-tags="{{ example.tags | join: ',' }}">
    <h2><a href="{{ example.path }}">{{ example.title }}</a></h2>
    <p>{{ example.description }}</p>
    {% if example.earlier_path %}<details><summary>Earlier illustration</summary><p>{{ example.earlier_note }}</p><p><a href="{{ example.earlier_path | relative_url }}">{{ example.earlier_title }}</a></p></details>{% endif %}
    <p><strong>Origin:</strong> {{ example.origin }}</p>
    <p><strong>Tags:</strong> {% for tag in example.tags %}<span class="tag">{{ tag }}</span>{% unless forloop.last %}, {% endunless %}{% endfor %}</p>
  </div>
  {% endfor %}
</div>

<script>
function filterExamples(tag) {
  const cards = document.querySelectorAll('.example-card');
  cards.forEach(card => {
    const tags = card.dataset.tags.split(',').map(t => t.trim());
    if (tag === 'all' || tags.includes(tag)) {
      card.style.display = 'inline-block';
    } else {
      card.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter button').forEach(btn => {
    btn.addEventListener('click', () => filterExamples(btn.dataset.tag));
  });
});
</script>

