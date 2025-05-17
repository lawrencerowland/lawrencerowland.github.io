---
layout: default
title: Project Examples
---

# Project Examples

[Home](/)

<div class="filter">
  <button data-tag="all">All</button>
  {% assign all_tags = site.data.examples | map: 'tags' | join: ',' | split: ',' | sort | uniq %}
  {% for tag in all_tags %}
  <button data-tag="{{ tag }}">{{ tag }}</button>
  {% endfor %}
</div>

<div id="example-container">
  {% for example in site.data.examples %}
  <div class="example-card" data-tags="{{ example.tags | join: ' ' }}">
    <h2><a href="{{ example.path }}">{{ example.title }}</a></h2>
    <img src="{{ example.thumbnail }}" alt="{{ example.title }} thumbnail">
    <p>{{ example.description }}</p>
    <p><strong>Origin:</strong> {{ example.origin }}</p>
    <p><strong>Tags:</strong> {% for tag in example.tags %}<span class="tag">{{ tag }}</span>{% unless forloop.last %}, {% endunless %}{% endfor %}</p>
  </div>
  {% endfor %}
</div>

<script>
function filterExamples(tag) {
  const cards = document.querySelectorAll('.example-card');
  cards.forEach(card => {
    const tags = card.dataset.tags.split(' ');
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

