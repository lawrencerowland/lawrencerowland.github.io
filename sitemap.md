---
layout: default
title: Sitemap
schema_type: CollectionPage
---

# Sitemap

## Pages

<ul>
{% for page in site.pages %}
  {% if page.title and page.url != '/sitemap.html' %}
  <li><a href="{{ page.url | relative_url }}">{{ page.title }}</a></li>
  {% endif %}
{% endfor %}
</ul>

## Posts

<ul>
{% for post in site.posts %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> ({{ post.date | date: "%Y-%m-%d" }})</li>
{% endfor %}
</ul>
