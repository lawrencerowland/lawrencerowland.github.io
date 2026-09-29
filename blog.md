---
layout: default
title: Earlier blog posts
schema_type: Blog
tags: [BlogPosts, PortfolioManagement, ProjectManagement]
summaries:
  "2020-06-20": "Project information needs and the management jobs that information should support."
  "2020-05-16": "Choosing and adapting an existing portfolio-management framework."
  "2020-05-08": "Selecting machine-learning methods and models for project use cases."
  "2020-05-07": "Using graph databases to maintain and visualise a project portfolio."
---

# Earlier blog posts

Earlier writing on project information, methods and frameworks, collected in one place. The dates belong to the original posts; bringing them together here does not make their technology or availability claims current.

For the developing experiments, visit [Projects]({{ '/side-projects.html' | relative_url }}). Each foray keeps its own explanations, sources and open questions.

<span id="notes"></span>
<span id="blog-posts"></span>
<span id="earlier-notes--2020"></span>
<ul class="post-list">
{% for post in site.posts %}
  {% assign date_key = post.date | date: '%Y-%m-%d' %}
  <li><p><time datetime="{{ date_key }}">{{ post.date | date: '%-d %B %Y' }}</time><br><a href="{{ post.url | relative_url }}">{{ post.title }}</a></p>{% if page.summaries[date_key] %}<p>{{ page.summaries[date_key] }}</p>{% endif %}</li>
{% endfor %}
</ul>

[Return to the Library →]({{ '/library.html#library-reading' | relative_url }})
