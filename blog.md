---
layout: default
title: Blog
schema_type: Blog
tags: [BlogPosts, PortfolioManagement, ProjectManagement]
---

# Blog Posts

<ul>
{% for post in site.posts %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <small>{{ post.date | date: '%Y-%m-%d' }}</small></li>
{% endfor %}
</ul>

