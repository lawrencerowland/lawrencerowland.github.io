---
layout: default
title: About
permalink: /about_me.html
schema_type: AboutPage
tags: [ProjectManagement, AI, Personal, PortfolioManagement, GraphDatabases, MachineLearning, KnowledgeManagement]
---

<h1 id="about">About</h1>

<section id="current-work">
  <p>I'm Lawrence Rowland. I use small scenarios—a farm lane, a mountain refuge or a wildlife crossing—to explore ideas about work, resources, decisions and how systems fit together. AI helps me build and explore; making the ideas understandable and inspectable is part of the work.</p>
  <p>These public experiments bring together sources, visible models and their limits. A working demonstration is not proof that a method will work on a real project. My employment and client work are outside the scope of this collection.</p>
</section>

<h2 id="earlier-purpose">The site's earlier purpose</h2>
<p>The site began as a collection of tools and frameworks for project portfolio management. This earlier purpose remains background to the current experiments.</p>

<details>
  <summary>Portfolio management background</summary>
  <section id="purpose">
    <h3>Purpose and description</h3>
    <p>The aim was to help portfolio managers choose frameworks for different business challenges and use them to set up and deliver projects, programmes and portfolios. Alongside conventional project management, the collection explored machine learning, natural language understanding and graph databases, using no-code or low-code examples that managers could apply directly.</p>
    <p>Lessons from each project and portfolio were intended to feed back into the frameworks.</p>
  </section>
  <section id="how-to-use">
    <h3>Using the material</h3>
    <p>Individual examples link to repositories that can be downloaded or cloned for use and modification. Check each repository's licence and source terms before reuse.</p>
  </section>
  <section id="motivation">
    <h3>Motivation</h3>
    <p>Open-source generosity has helped me learn and work better. Sharing frameworks that have worked for me also lets me learn from how others apply and extend them.</p>
    <p>Project management remains as much art as science: people and teams, consensus, stories, incentives and unintended consequences all matter. Tools and frameworks only do so much.</p>
    <p>Building and rebuilding useful frameworks can reduce time spent on project mechanics, leaving more attention for the company, the portfolio's context and the conversation or approach that gives it a chance to succeed.</p>
  </section>
</details>

<h2 id="earlier-interests">Earlier interests in AI and project management</h2>
<details>
  <summary>Methods, experiments and frameworks</summary>
  <section id="methodologies">
    <h3>AI-assisted project methods</h3>
    <ul>
      <li>GPTs as low-code tools, including custom GPTs with project knowledge</li>
      <li>AI-augmented communication and documentation</li>
      <li>Retrieval-Augmented Generation (RAG) for document use</li>
      <li>AI agents with defined project roles, such as risk analyst</li>
    </ul>
  </section>
  <section id="experiments">
    <h3>Experiments</h3>
    <ul>
      <li>GPT-to-GPT collaboration on project strategy and literature</li>
      <li>Role-based agents simulating project team interactions</li>
      <li>Asynchronous “thinking” agents</li>
      <li>Ontology-driven app building with AI coders</li>
    </ul>
  </section>
  <section id="frameworks">
    <h3>Frameworks and predictions</h3>
    <ul>
      <li>Project GPT Framework: AI-augmented team models</li>
      <li>Thinker and Builder agents: a classification for delegation</li>
      <li>AI Flywheel: compounding learning through early adoption</li>
      <li>Making project management tools more accessible through AI</li>
    </ul>
  </section>
  <section id="manifesto">
    <h3>Principles for running projects with AI</h3>
    <p>Treat AI as a collaborator, retain human judgement, experiment, widen access, prioritise knowledge flow, and focus on value. Transparency and validation underpin that approach.</p>
  </section>
  <section id="publications">
    <h3>Publications and media</h3>
    <ul>
      <li>Substack: <em>Experiment in AI</em></li>
      <li>LinkedIn series: <em>Daily AI Project Tips</em></li>
      <li>Interviews: Project Chatter Podcast and MPA Podcast</li>
    </ul>
  </section>
</details>

<figure>
  <img src="{{ '/images/Howgills.png' | relative_url }}" alt="The Howgills" loading="lazy">
</figure>

<section id="contact">
  <h2>Contact</h2>
  <p>To discuss an experiment, suggest an improvement or report a correction, raise an issue in its linked GitHub repository.</p>
</section>

<script>
(function () {
  function revealLinkedSection() {
    var fragment;
    try { fragment = decodeURIComponent(window.location.hash.slice(1)); } catch (error) { return; }
    var target = document.getElementById(fragment);
    if (!target) return;
    var ancestor = target.parentElement;
    var opened = false;
    while (ancestor) {
      if (ancestor.tagName === 'DETAILS' && !ancestor.open) {
        ancestor.open = true;
        opened = true;
      }
      ancestor = ancestor.parentElement;
    }
    if (opened) target.scrollIntoView();
  }
  revealLinkedSection();
  window.addEventListener('hashchange', revealLinkedSection);
}());
</script>
