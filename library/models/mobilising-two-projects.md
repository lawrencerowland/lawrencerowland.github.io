---
layout: default
title: Mobilising two projects with string diagrams
description: A small DisCoPy notebook draws two mobilisation processes, then combines their team and blueprint outputs.
schema_type: TechArticle
wide: true
home_front_door: true
tags: [DataModeling, CategoryTheory, ProjectManagement]
---

<div class="pw-home pw-framework-guide pw-model-comparison pw-notebook-guide" id="home-main" tabindex="-1">
  <header class="pw-model-heading">
    <p class="pw-home-kicker">Earlier modelling experiment · 8 October 2022</p>
    <h1>Mobilising two projects<br>with string diagrams.</h1>
    <p class="pw-model-lead">Imagine two projects starting from business as usual. Each mobilisation produces a team and a blueprint. How could those two beginnings connect to a combined team and a combined blueprint?</p>
    <p>This small notebook draws the proposed structure. Its wires make explicit which outputs need to meet before the parts can be joined.</p>
    <p class="pw-model-returns"><a href="{{ '/library/methods/states-and-relationships.html#mobilising-two-projects' | relative_url }}">← Notebook examples in the Library</a> · <a href="{{ '/Portfolio-data-model.html#processes-and-relationships' | relative_url }}">Processes and relationships</a></p>
  </header>
  <div class="pw-framework-prose">
    <figure class="pw-framework-figure pw-notebook-figure">
      <a href="https://raw.githubusercontent.com/lawrencerowland/discopy/e7c0d28703f5e99166a07f7fc230bc956c9e78ba/docs/_static/imgs/mobilise_2_projects.png"><img src="{{ '/images/notebook-examples/mobilising-two-projects.png' | relative_url }}" width="432" height="288" alt="Two BAU inputs each enter a mobilisation box and produce a team and a blueprint. The middle blueprint and team wires cross, bringing both teams to one merge box and both blueprints to another. One team and one blueprint emerge."></a>
      <figcaption>The original saved diagram, unchanged. Read downwards from the two BAU inputs. The staggered box positions are drawing layout; they do not measure time. Select the picture to inspect the source image.</figcaption>
    </figure>

    <h2 id="follow-the-wires">Follow the wires</h2>
    <p>BAU stands for business as usual in this reading. Each <code>mobilise</code> box takes one BAU input and gives two outputs: <code>team</code> and <code>blueprint</code>. Drawing two copies side by side initially puts the outputs in the order team, blueprint, team, blueprint.</p>
    <p>The crossing swaps the two middle wires. Teams now sit together, followed by blueprints. The crossing preserves their types: it neither combines them nor turns one kind into the other. Two separate <code>merge</code> boxes then combine the teams and the blueprints. The final interface has one team and one blueprint.</p>

    <h2 id="small-pieces">Small pieces with named interfaces</h2>
    <p>The notebook declares three types and names the boxes connecting them. The symbols express how those pieces fit:</p>
    <dl class="pw-notebook-key">
      <dt><code>Ty</code> and <code>Box</code></dt>
      <dd>A type names a kind of wire; a box declares its input and output types. Here, mobilisation connects BAU to team and blueprint.</dd>
      <dt><code>@</code> and <code>&gt;&gt;</code></dt>
      <dd><code>@</code> places diagrams side by side. <code>&gt;&gt;</code> connects one stage to the next, whose input types must match the preceding outputs.</dd>
      <dt><code>Id</code> and <code>Swap</code></dt>
      <dd><code>Id</code> carries the outer wires through unchanged while <code>Swap</code> exchanges the middle blueprint and team wires.</dd>
    </dl>

    <h2 id="source-and-limits">The experiment and its limits</h2>
    <p>Lawrence Rowland <a href="https://github.com/lawrencerowland/discopy/commit/1812090f970d38b2c6efad778f26ea152d817d3d">added this project adaptation on 8 October 2022</a>. It reuses the construction in <a href="https://github.com/lawrencerowland/discopy/blob/e7c0d28703f5e99166a07f7fc230bc956c9e78ba/README.md">DisCoPy’s two-eggs recipe</a>, replacing eggs, whites and yolks with BAU, teams and blueprints. The project interpretation is the personal contribution; the diagramming library and composition pattern come from DisCoPy.</p>
    <p>The boxes are symbolic declarations. The notebook supplies no method for combining actual people or reconciling blueprints. It has no durations, resource capacities or scheduling calculation, and it does not discover a plan. The proposed connections are supplied by hand; their type compatibility does not establish practical feasibility.</p>
    <p><a href="https://github.com/lawrencerowland/discopy/blob/e7c0d28703f5e99166a07f7fc230bc956c9e78ba/LR_get_started.ipynb">Read the original notebook on GitHub →</a></p>
    <p class="pw-framework-note">Guide written 1 October 2026 from the retained notebook and image. The source was inspected, without rerunning the notebook. Links preserve the reviewed source snapshot.</p>
    <p class="pw-model-returns"><a href="{{ '/library/methods/states-and-relationships.html#mobilising-two-projects' | relative_url }}">Back to the Library’s notebook examples</a> · <a href="{{ '/Portfolio-data-model.html#processes-and-relationships' | relative_url }}">Processes and relationships</a></p>
  </div>
</div>
