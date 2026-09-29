---
layout: default
title: Portfolio frameworks
description: Earlier work on choosing and adapting portfolio practices, with retained diagrams and an explicit guide to what remains public.
schema_type: TechArticle
wide: true
home_front_door: true
tags: [ProjectFrameworks, PortfolioManagement, NaturalLanguageProcessing]
---

<div class="pw-home pw-framework-guide" id="home-main" tabindex="-1">
  <!-- Preserve fragment links from the former generated contents list. -->
  <span id="markdown-toc"></span>
  <section class="pw-home-approach" aria-labelledby="portfolio-frameworks">
    <div><p class="pw-home-kicker">The library · earlier method</p><h1 id="portfolio-frameworks">Which working practices does this portfolio need?</h1></div>
    <div class="pw-home-approach-copy">
      <p>A portfolio framework describes how an organisation chooses, governs and supports its projects and programmes. This earlier work explored three ways to build one: adapt a modular framework, organise an existing body of knowledge, or examine the organisation’s own documents.</p>
      <p>The useful starting point is a business need and the practice that might answer it. The diagrams below retain that thinking. They are examples to interpret, not a complete framework ready to install.</p>
      <p><strong>What is available now:</strong> this guide, the illustrated adoption note and the original pictures. The linked repository was deliberately reduced to an outline; its former notebooks, corpora and toolkit are no longer in the current public copy.</p>
      <a class="pw-home-text-link" href="#use-cases">Choose a starting point <span aria-hidden="true">↓</span></a>
    </div>
  </section>

  <section class="pw-home-questions" aria-labelledby="use-cases">
    <div class="pw-home-section-head"><div><p class="pw-home-kicker">Three approaches from the original guide</p><span id="markdown-toc-use-cases"></span><h2 id="use-cases">Start with what you have.</h2></div><p>Each route explains the idea, its remaining public example and the judgement it still requires.</p></div>
    <div class="pw-home-question-grid">
      <article class="pw-home-question">
        <a class="pw-home-tile-link" href="#use-case-1-adopt-a-framework">
          <div class="pw-home-question-visual"><img src="{{ '/images/Portfolio-frameworks/portfolio-tier1.png' | relative_url }}" alt="Portfolio management divided into governance, reporting and control measures, and programme and project delivery support" width="540" height="324"></div>
          <div class="pw-home-question-copy"><p class="pw-home-project-label">1 · A known management need</p><h3>Choose the practices you need.</h3><p>Start from a modular framework and select the parts that answer a real portfolio problem.</p></div>
          <span class="pw-home-route-link">Read the adoption approach <span aria-hidden="true">↓</span></span>
        </a>
      </article>
      <article class="pw-home-question">
        <a class="pw-home-tile-link" href="#use-case-2-extract-from-existing-framework">
          <div class="pw-home-question-visual"><img src="{{ '/images/Portfolio-frameworks/2020-02-P3M-categories-in-Wikipedia-neo4j-LR.png' | relative_url }}" alt="A graph of project-management pages and categories, including change control, assurance and risk management" width="4786" height="3290" loading="lazy"></div>
          <div class="pw-home-question-copy"><p class="pw-home-project-label">2 · An existing body of knowledge</p><h3>Make its structure explicit.</h3><p>Extract topics and relationships, then decide which should become working practices.</p></div>
          <span class="pw-home-route-link">Read the extraction approach <span aria-hidden="true">↓</span></span>
        </a>
      </article>
      <article class="pw-home-question">
        <a class="pw-home-tile-link" href="#use-case-3-apply-nlp-to-understand-a-particular-business-domain">
          <div class="pw-home-question-visual"><img src="{{ '/images/Portfolio-frameworks/Orange-NLP-example.png' | relative_url }}" alt="An earlier Orange workflow links a document corpus to similarity, keyword and topic analyses" width="1060" height="928" loading="lazy"></div>
          <div class="pw-home-question-copy"><p class="pw-home-project-label">3 · The organisation’s own documents</p><h3>Find the vocabulary of the work.</h3><p>Use text analysis to suggest themes and relationships for people to examine.</p></div>
          <span class="pw-home-route-link">Read the text-analysis approach <span aria-hidden="true">↓</span></span>
        </a>
      </article>
    </div>
  </section>

  <section class="pw-framework-prose" aria-labelledby="purpose">
    <span id="markdown-toc-purpose"></span><h2 id="purpose">Purpose</h2>
    <p>Select practical portfolio-management practices and adapt them to the organisation’s business area. A useful framework should reflect how work is actually managed, make working practices specific, learn from experience and avoid unnecessary procedure.</p>
    <span id="markdown-toc-motivation"></span><h2 id="motivation">Motivation</h2>
    <p>The original guide used “framework” broadly. A lifecycle, a standard and a body of knowledge can contribute to a framework, but they are not interchangeable. A centre of excellence is an organisational function that may maintain and support these practices.</p>
    <figure class="pw-framework-figure">
      <a href="{{ '/images/Portfolio-frameworks/P3M-categories-Wikipedia-Higher-structure-LR-Neo4j.png' | relative_url }}"><img src="{{ '/images/Portfolio-frameworks/P3M-categories-Wikipedia-Higher-structure-LR-Neo4j.png' | relative_url }}" alt="A higher-level graph connects project management to software projects, construction, event management and related concepts" loading="lazy"></a>
      <figcaption>An earlier Wikipedia-category exploration, retained at full size. Its links show an information structure; they do not establish a recommended management process. Select the image to inspect it.</figcaption>
    </figure>

    <span id="markdown-toc-code-and-library-base"></span><h2 id="code-and-library-base">Code and library base</h2>
    <p>The <a href="https://github.com/lawrencerowland/Data-Model-for-Project-Frameworks">public repository outline</a> records the earlier work areas: modular practices, taxonomy/Neo4j exploration, Orange and Python text analysis, and expert discussion. Its README explains the intentional removal of the working files. Use it as a record of the structure, not as a download for a runnable toolkit.</p>

    <span id="markdown-toc-use-case-1-adopt-a-framework"></span><h2 id="use-case-1-adopt-a-framework">Use case 1: Adopt a framework</h2>
    <p>The earlier framework was assembled from experience across portfolios. Its modular idea was to select the practices needed, rather than deploy every module. The retained overview separates governance, reporting and control measures, and delivery support.</p>
    <p><a href="{{ '/2020/05/16/Adopt-existing-portfolio-framework.html' | relative_url }}">Read the illustrated adoption note</a>: follow a business need through to a proposed portfolio response. The original map and its attribution remain available; the former detailed module library is absent from the current public repository.</p>
    <p><a href="{{ '/images/Portfolio-frameworks/portfolio-tier1.png' | relative_url }}">Open the three-part framework diagram at full size</a></p>

    <span id="markdown-toc-use-case-2-extract-from-existing-framework"></span><h2 id="use-case-2-extract-from-existing-framework">Use case 2: Extract from existing framework</h2>
    <p>Start with an existing standard, book or taxonomy and make its topics and relationships visible. The retained graph illustrates this with project-management pages and categories. Organising that material can help a team navigate and adapt it; a category link by itself does not specify a responsibility, decision rule or effective practice.</p>
    <p><a href="{{ '/images/Portfolio-frameworks/2020-02-P3M-categories-in-Wikipedia-neo4j-LR.png' | relative_url }}">Open the original category graph at full size</a></p>

    <span id="markdown-toc-use-case-3-apply-nlp-to-understand-a-particular-business-domain"></span><h2 id="use-case-3-apply-nlp-to-understand-a-particular-business-domain">Use case 3: Apply NLP to understand a particular business domain</h2>
    <p>Use text mining to suggest topics, categories and relationships in a company’s or portfolio’s documents. The Orange screenshot records an earlier exploration of document similarity, keywords and topics. It includes unfinished branches; the image is not evidence of a validated or reproducible analysis.</p>
    <p>The practical question is whether the suggested structure helps people recognise their work and its constraints. People still have to decide which themes matter and which practices are justified. The original workflow and sample corpus are not available in the current public repository.</p>
    <p><a href="{{ '/images/Portfolio-frameworks/Orange-NLP-example.png' | relative_url }}">Open the original Orange workflow image</a></p>

    <span id="markdown-toc-other-business-examples-external-to-this-site"></span><h2 id="other-business-examples-external-to-this-site">Other business examples (external to this site)</h2>
    <p>The original guide also linked this <a href="https://go.neo4j.com/rs/710-RRC-335/images/Neo4j-case-study-IT%20Services-EN-US.pdf">Neo4j IT-services case study (PDF)</a>. It is an external example, not evidence that the framework described here was deployed.</p>

    <span id="markdown-toc-faq"></span><h2 id="faq">FAQ</h2>
    <span id="markdown-toc-at-what-project-level-can-this-be-applied-"></span><h3 id="at-what-project-level-can-this-be-applied-">At what project level can this be applied?</h3>
    <p>The approach can organise practices at project, programme or portfolio level. The responsibilities and decisions differ at each level; the same diagram does not automatically cover all three.</p>
    <span id="markdown-toc-what-is-the-difference-between-these-frameworks-and-your-data-models-"></span><h3 id="what-is-the-difference-between-these-frameworks-and-your-data-models-">What is the difference between these frameworks and the data models?</h3>
    <p>The framework organises management practices: governance, reporting and support. The <a href="{{ '/Portfolio-data-model.html' | relative_url }}">data-model guide</a> concerns how information represents projects, scope, outputs, outcomes and relationships. The practices and the information model influence one another.</p>
    <span id="markdown-toc-are-there-any-other-frameworks-elsewhere-"></span><h3 id="are-there-any-other-frameworks-elsewhere-">Are there other frameworks elsewhere?</h3>
    <p>The original guide favoured approaches colleagues understand and can adapt. Its reference points included <a href="https://www.praxisframework.org">Praxis</a>; <a href="https://axelos.com">MoP, MSP, PRINCE2 and P3M3</a>; the APM Body of Knowledge and PMBOK; <a href="https://op.europa.eu/en/publication-detail/-/publication/ac3e118a-cb6e-11e8-9424-01aa75ed71a1">the 2018 PM² guide</a>; Scrum and Kanban; and <a href="https://thecynefin.co/about-us/about-cynefin-framework/">Cynefin</a> for sense-making. These serve different purposes and are not interchangeable frameworks. This retained list is not a current edition, licensing or suitability comparison.</p>
    <p>The earlier rationale for MSP was its distinction between projects, programmes and business change; for PRINCE2, project practices; and for P3M3, examining maturity before introducing processes. Bodies of knowledge offered reference material for technical or regulated work, while familiar agile approaches could support team practice. Any adoption still depends on the actual organisation and problem.</p>
    <p class="pw-framework-note">Reader guide revised 29 September 2026. Earlier diagrams and the May 2020 adoption note are retained; no new toolkit or implementation is claimed. <a href="{{ '/library.html' | relative_url }}">Return to the Library</a>.</p>
  </section>
</div>
