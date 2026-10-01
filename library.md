---
layout: default
title: Worked examples & earlier methods
description: Captured solutions, modelling examples and earlier methods for particular project and portfolio problems, kept distinct from open research enquiries.
schema_type: CollectionPage
wide: true
home_front_door: true
tags: [Projects, Examples, PortfolioManagement, Library]
---

<div class="pw-home" id="home-main" tabindex="-1">
  <section class="pw-home-approach" aria-labelledby="library-title">
    <div><p class="pw-home-kicker">The library</p><h1 id="library-title">Worked examples.<br>Ideas worth keeping.</h1></div>
    <div class="pw-home-approach-copy"><p>Some work asks an open question. Some reaches a useful stopping point: a model, method or example that resolves a particular problem under stated assumptions.</p><p>This library is the home for those captured solutions and the earlier work behind them. “Solved” here means a bounded problem has a worked answer; it does not mean project management is solved, or that every older example is ready to deploy today.</p><p>The collection is being tidied gradually. These starting points retain their original explanations and limits; they have not all received a new technical review.</p><a href="{{ '/side-projects.html' | relative_url }}">Looking for the open enquiries? Explore the projects →</a></div>
  </section>

  <section class="pw-home-questions" aria-labelledby="worked-examples-title">
    <div class="pw-home-section-head"><div><p class="pw-home-kicker">Two bounded worked examples</p><h2 id="worked-examples-title">A question you can try.</h2></div><p>Small, explicit models with a useful result to inspect. Each stays in its existing home.</p></div>
    <div class="pw-home-question-grid pw-worked-example-grid">
      {% for example in site.data.worked_examples %}
      <article class="pw-home-question" id="{{ example.id | escape }}">
        <a class="pw-home-tile-link" href="{{ example.canonical_url | escape }}" aria-labelledby="worked-example-{{ example.id | escape }}">
          <div class="pw-home-question-visual"><img src="{{ example.image | relative_url }}" width="640" height="400" alt="{{ example.image_alt | escape }}" loading="lazy"></div>
          <div class="pw-home-question-copy"><p class="pw-home-project-label">Worked example <span>{{ example.topic | escape }}</span></p><h3 id="worked-example-{{ example.id | escape }}">{{ example.title | escape }}</h3><p>{{ example.problem | escape }}</p></div>
          <span class="pw-home-route-link">{{ example.action | escape }} <span aria-hidden="true">↗</span></span>
        </a>
        <details class="foray-details">
          <summary>What to try, assumptions &amp; source</summary>
          <div class="foray-detail-body">
            <p><strong>Inputs.</strong> {{ example.inputs | escape }}</p>
            <p><strong>Try this.</strong> {{ example.try | escape }}</p>
            <p><strong>Limits.</strong> {{ example.limitation | escape }}</p>
            <p>{{ example.revision_context | escape }}</p>
            <p><a href="{{ example.source_url | escape }}">{{ example.source_label | escape }}</a>{% if example.checks_url %} · <a href="{{ example.checks_url | escape }}">{{ example.checks_label | escape }}</a>{% endif %}</p>
          </div>
        </details>
      </article>
      {% endfor %}
    </div>
  </section>

  <section class="pw-home-questions" aria-labelledby="library-starts">
    <div class="pw-home-section-head"><div><p class="pw-home-kicker">Start with a practical question</p><h2 id="library-starts">Three strands of earlier work.</h2></div><p>Each will gain a clearer identity as its examples, assumptions and useful contributions are reviewed.</p></div>
    <div class="pw-home-question-grid">
      <article class="pw-home-question"><a class="pw-home-tile-link" href="{{ '/Portfolio-data-model.html#read-the-worked-models' | relative_url }}" aria-labelledby="library-question-1">
        <div class="pw-home-question-visual"><img src="{{ '/images/Portfolio-data-model/Full-programme-data-model.png' | relative_url }}" width="640" height="400" alt="A programme data model connects delivery work with objectives and its organisational context" loading="lazy"></div>
        <div class="pw-home-question-copy"><p class="pw-home-project-label">Modelling example <span>Projects, programmes &amp; portfolios</span></p><h3 id="library-question-1">How should the work fit into a shared picture?</h3><p>Read four directors’ views of one roadmap, compare programme schemas, or explore portfolio-needs notes and an earlier project ontology experiment. The explanations link to their original diagrams and source files.</p></div>
        <span class="pw-home-route-link">Read the worked models <span aria-hidden="true">↗</span></span>
      </a></article>
      <article class="pw-home-question"><a class="pw-home-tile-link" href="{{ '/Portfolio-frameworks.html' | relative_url }}" aria-labelledby="library-question-2">
        <div class="pw-home-question-visual"><img src="{{ '/images/Portfolio-frameworks/portfolio-tier1.png' | relative_url }}" width="640" height="400" alt="An overview of the categories in a portfolio management framework" loading="lazy"></div>
        <div class="pw-home-question-copy"><p class="pw-home-project-label">Earlier method <span>Portfolio management</span></p><h3 id="library-question-2">Which working practices does this portfolio need?</h3><p>A guide to choosing and adapting frameworks. The linked public code repository now retains a navigational skeleton, rather than the former full toolkit.</p></div>
        <span class="pw-home-route-link">Read the framework guide <span aria-hidden="true">↗</span></span>
      </a></article>
      <article class="pw-home-question"><a class="pw-home-tile-link" href="{{ '/ML-for-portfolios.html' | relative_url }}" aria-labelledby="library-question-3">
        <div class="pw-home-question-visual"><img src="{{ '/images/ML-for-portfolios/Usecase-to-Operations-subgraph-ML-models-created.png' | relative_url }}" width="640" height="400" alt="A graph relates project use cases to delivery and operational stages" loading="lazy"></div>
        <div class="pw-home-question-copy"><p class="pw-home-project-label">Earlier exploration <span>Information &amp; methods</span></p><h3 id="library-question-3">Which method fits the question and the available data?</h3><p>Earlier thinking on matching machine-learning approaches to project information needs. Read it as a record of methods and possibilities, with technology and performance claims to recheck.</p></div>
        <span class="pw-home-route-link">Read the methods guide <span aria-hidden="true">↗</span></span>
      </a></article>
    </div>
  </section>

  <section class="pw-home-approach" aria-labelledby="library-future">
    <div><p class="pw-home-kicker">From collection to named example</p><h2 id="library-future">Keep what each example teaches.</h2></div>
    <div class="pw-home-approach-copy"><p>Over time, individual apps will move out of the generic collections into homes that explain their purpose. Some belong with an ongoing enquiry. Others deserve a name of their own as worked examples, with a clear problem, inputs, result, assumptions and the version at which the work was captured.</p><p>Those are different roles, rather than a ladder every experiment must climb. A retained earlier attempt can still explain something its successor leaves out.</p></div>
  </section>

  <section class="pw-retained-collections" id="earlier-app-collections" aria-labelledby="collections-title">
    <h2 id="collections-title">Earlier app collections</h2>
    <p>The original collections remain available, including their earlier experiments. Individual examples will gain clearer homes as they are reviewed.</p>
    <details>
      <summary>Browse the original collections</summary>
      <div class="foray-grid">
      {% assign collections = site.data.side_projects | where: 'placement', 'library' %}
      {% for project in collections %}
        <article class="example-card foray-card" id="{{ project.id | escape }}">
          <a class="foray-tile-link" href="{{ project.path | escape }}" aria-label="{{ project.action | escape }}: {{ project.title | escape }}">
            <span class="foray-scenario-image"><img src="{{ project.image | escape }}" alt="" width="640" height="400" loading="lazy" decoding="async"></span>
            <div class="foray-tile-body">
              <h3>{{ project.title | escape }}</h3>
              <p class="foray-scenario-caption">{{ project.scenario | escape }}</p>
              <span class="foray-action">{{ project.action | escape }} <span aria-hidden="true">→</span></span>
            </div>
          </a>
          <details class="foray-details">
            <summary>About this collection</summary>
            <div class="foray-detail-body">
              <p class="foray-question">{{ project.question | escape }}</p>
              <p>{{ project.description | escape }}</p>
              {% if project.origin %}<p class="foray-origin">Origin: {{ project.origin | escape }}</p>{% endif %}
              <ul class="foray-tags" aria-label="Topics">{% for tag in project.tags %}<li>{{ tag | replace: '-', ' ' | escape }}</li>{% endfor %}</ul>
              {% if project.related %}<ul class="foray-related">{% for link in project.related %}<li><a href="{{ link.path | escape }}">{{ link.title | escape }}</a></li>{% endfor %}</ul>{% endif %}
            </div>
          </details>
        </article>
      {% endfor %}
      </div>
    </details>
    <p><a href="{{ '/all-project-apps.html' | relative_url }}">Browse the combined app catalogue</a> · <a href="https://lawrencerowland.github.io/more-project-apps/">More Project Apps</a></p>
  </section>

  <section class="pw-retained-collections" aria-labelledby="library-reading">
    <h2 id="library-reading">Research &amp; writing</h2>
    <div class="pw-home-question-grid">
      <article><h3><a href="{{ '/deep-research/' | relative_url }}">Deep Research</a></h3><p>A retained report on project gaps, capabilities and resources, with a direct PDF link and a readable report page.</p></article>
      <article><h3><a href="{{ '/blog.html' | relative_url }}">Earlier blog posts</a></h3><p>Four posts from 2020 on project information, data models, methods and frameworks. Original dates and articles are retained.</p></article>
    </div>
  </section>
</div>
