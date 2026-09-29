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

  <section class="pw-home-approach" aria-labelledby="atlas-reference-title">
    <article class="pw-home-question"><a class="pw-home-tile-link" href="{{ '/project-approach-atlas/' | relative_url }}" aria-labelledby="atlas-reference-title">
      <div class="pw-home-question-visual"><img src="{{ '/images/scenarios/approach-atlas.svg' | relative_url }}" width="640" height="400" alt="Three connected cards take a project question through a modelling method to a check" loading="lazy"></div>
      <div class="pw-home-question-copy"><p class="pw-home-project-label">Reference <span>Choosing an approach</span></p><h2 id="atlas-reference-title">Project-Approach Atlas</h2><p>Eleven approaches, their premises, ways they can fail, and a useful next check.</p></div>
      <span class="pw-home-route-link">Explore the atlas <span aria-hidden="true">→</span></span>
    </a></article>
    <div class="pw-home-approach-copy"><p class="pw-home-kicker">Before you choose a method</p><h2>What would make it useful?</h2><p>Start with the question the model should help you answer. The atlas connects each approach to sources and distinguishes a mathematical construction from a claim about project usefulness.</p><p>These reviewed notes are a guide to trying a method. They are not eleven solved examples. The earlier assessments and comparison map remain available within the atlas, clearly marked as unvalidated judgments.</p></div>
  </section>

  <section class="pw-home-questions" aria-labelledby="library-starts">
    <div class="pw-home-section-head"><div><p class="pw-home-kicker">Start with a practical question</p><h2 id="library-starts">Three strands of earlier work.</h2></div><p>Each will gain a clearer identity as its examples, assumptions and useful contributions are reviewed.</p></div>
    <div class="pw-home-question-grid">
      <article class="pw-home-question"><a class="pw-home-tile-link" href="{{ '/Portfolio-data-model.html' | relative_url }}" aria-labelledby="library-question-1">
        <div class="pw-home-question-visual"><img src="{{ '/images/Portfolio-data-model/Full-programme-data-model.png' | relative_url }}" width="640" height="400" alt="A programme data model connects delivery work with objectives and its organisational context" loading="lazy"></div>
        <div class="pw-home-question-copy"><p class="pw-home-project-label">Modelling example <span>Projects, programmes &amp; portfolios</span></p><h3 id="library-question-1">How should the work fit into a shared picture?</h3><p>Earlier graph models explore how projects, outcomes and dependencies can be represented together, with different views for different readers.</p></div>
        <span class="pw-home-route-link">Read the data-model guide <span aria-hidden="true">↗</span></span>
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
    <div class="pw-home-approach-copy"><p>Over time, individual apps will move out of the generic collections into homes that explain their purpose. Some belong with an ongoing enquiry. Others deserve a name of their own as worked examples, with a clear problem, inputs, result, assumptions and the version at which the work was captured.</p><p>Those are different roles, rather than a ladder every experiment must climb. A retained earlier attempt can still explain something its successor leaves out.</p><p><a href="{{ '/older-stuff.html' | relative_url }}">Browse earlier guides and material</a> · <a href="{{ '/blog_summary.html' | relative_url }}">Read the earlier notes</a></p></div>
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
</div>
