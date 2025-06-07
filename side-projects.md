---
layout: default
title: Side Projects
schema_type: CollectionPage
tags: [SideProjects, Examples]
---

# Side Projects

[Home](/)
[My Custom GPTs](/my-custom-gpts.html)

<div class="filter">
  <button data-tag="all">All</button>
  {% assign all_tags = site.data.side_projects | map: 'tags' | join: ',' | split: ',' | sort | uniq %}
  {% for tag in all_tags %}
  <button data-tag="{{ tag }}">{{ tag }}</button>
  {% endfor %}
</div>

<div id="side-project-container">
  {% for project in site.data.side_projects %}
  <div class="example-card" data-tags="{{ project.tags | join: ',' }}">
    <h2><a href="{{ project.path }}">{{ project.title }}</a></h2>
    <p>{{ project.description }}</p>
    <p><strong>Origin:</strong> {{ project.origin }}</p>
    <p><strong>Tags:</strong> {% for tag in project.tags %}<span class="tag">{{ tag }}</span>{% unless forloop.last %}, {% endunless %}{% endfor %}</p>
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

