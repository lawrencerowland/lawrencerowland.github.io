---
layout: default
title: A rail project through three layers
description: A small rail-project notebook keeps objectives, stakeholders and scope distinct while showing connections between them.
schema_type: TechArticle
seo:
  type: TechArticle
wide: true
home_front_door: true
tags: [DataModeling, MultilayerNetworks, ProjectManagement]
---

<div class="pw-home pw-framework-guide pw-model-comparison pw-notebook-guide" id="home-main" tabindex="-1">
  <header class="pw-model-heading">
    <p class="pw-home-kicker">Personal notebook version · 17 October 2022</p>
    <h1>A rail project.<br>Three connected layers.</h1>
    <p class="pw-model-lead">A rail scheme brings together a proposed station, faster trains, carbon ambitions, construction work and organisations with different concerns. How can these kinds of information stay distinct while their connections remain visible?</p>
    <p>Lawrence’s small Py3Plex notebook explores that question through objectives, stakeholders and scope. This guide, dated 1 October 2026, reads its original saved pictures and source.</p>
    <p class="pw-model-returns"><a href="{{ '/library/methods/states-and-relationships.html#rail-stakeholders-objectives-scope' | relative_url }}">← Notebook examples in the Library</a> · <a href="{{ '/Portfolio-data-model.html#processes-and-relationships' | relative_url }}">Processes and relationships</a></p>
  </header>
  <div class="pw-framework-prose">
    <figure class="pw-framework-figure pw-notebook-figure">
      <a href="{{ '/images/notebook-examples/rail-three-layers.png' | relative_url }}"><img src="{{ '/images/notebook-examples/rail-three-layers.png' | relative_url }}" width="349" height="236" alt="Original notebook drawing: objectives, stakeholders and scope occupy three coloured layers, with dashed curves connecting nodes across layers."></a>
      <figcaption>The saved three-layer overview. Individual nodes are unlabelled; the curves show connections, without conveying their direction or numeric weights.</figcaption>
    </figure>

    <h2 id="three-kinds-of-information">Keep the kinds of information visible</h2>
    <ul>
      <li><strong>Objectives:</strong> a carbon ambition (<code>sustain_carbon</code>), faster trains, a new station and a new construction method.</li>
      <li><strong>Stakeholders:</strong> town council, train operator, safety board and train manufacturer.</li>
      <li><strong>Scope:</strong> civil works, new track, in-cab signalling, new trains and telecoms.</li>
    </ul>
    <p>These are the notebook’s categories: its objectives include both aspirations and proposed choices. Separating the layers helps a reader distinguish what the scheme seeks, who is involved and what might be built.</p>

    <h2 id="follow-one-connection">Follow one connection across the layers</h2>
    <p>The source records <strong>new track → carbon ambition (<code>sustain_carbon</code>) → town council</strong>: scope connects to an objective, then to a stakeholder. This gives us a small chain to inspect without turning the three kinds of thing into one.</p>
    <p>The arrows alone do not establish carbon savings, council endorsement or a causal relationship. Their project meaning still needs an explanation; the notebook supplies connections rather than that evidence.</p>

    <h2 id="narrow-the-view">What does a narrower view leave out?</h2>
    <figure class="pw-framework-figure pw-notebook-figure">
      <a href="{{ '/images/notebook-examples/carbon-objective-neighbours.png' | relative_url }}"><img src="{{ '/images/notebook-examples/carbon-objective-neighbours.png' | relative_url }}" width="446" height="302" alt="Original objective-only neighbourhood: sustain_carbon connects to new_station and New_construction_method. Some labels are clipped in the saved image." loading="lazy"></a>
      <figcaption>The saved one-step neighbourhood of <code>sustain_carbon</code>, restricted to the objectives layer. The other nodes are <code>new_station</code> and <code>New_construction_method</code>.</figcaption>
    </figure>
    <p>This “ego” view keeps three nodes and two arrows. It excludes all scope and stakeholder connections, including the town council from our earlier chain. Faster trains is also absent: it is not an immediate outgoing neighbour. The smaller picture is easier to inspect, but answers a narrower question.</p>

    <details>
      <summary>Reading the original data carefully</summary>
      <p>The source contains 14 nodes and 27 directed edge records. A misspelling, <code>Train_manfacturer</code>, creates an extra manufacturer node. The new-trains → faster-trains link appears twice with weight 0.9; new-trains → safety-board has parallel links weighted 0.7 and 0.9.</p>
      <p>Weights have no documented units or common scale: objective links use 5, 7 and 10, while others use 0.1–1. They are not established probabilities or influence scores. The saved “9 unique node IDs” statistic counts only nodes with outgoing edges because of a library helper defect; there are 14 distinct names.</p>
      <p>These details remain in the original. Neither the data nor the pictures have been silently corrected.</p>
    </details>

    <h2 id="source-and-status">Read the notebook</h2>
    <p><a href="https://github.com/lawrencerowland/py3plex/blob/9bdfca4aa40a5115e8697fbd64e67347dc7a0a9a/stakeholder_objectives.ipynb">Inspect the saved notebook and its edge lists →</a></p>
    <p>This is Lawrence’s hand-entered example in a fork of the <a href="https://github.com/lawrencerowland/py3plex/blob/9bdfca4aa40a5115e8697fbd64e67347dc7a0a9a/README.md">Py3Plex library</a>, rather than an upstream demonstration. The two pictures are unchanged notebook outputs. The notebook was not rerun for this guide; present-day execution is unverified. It illustrates a representation, without calculating a schedule or validating a stakeholder decision.</p>
    <p class="pw-model-returns"><a href="{{ '/library/methods/states-and-relationships.html#rail-stakeholders-objectives-scope' | relative_url }}">Back to notebook examples</a> · <a href="{{ '/Portfolio-data-model.html#processes-and-relationships' | relative_url }}">Processes and relationships</a></p>
  </div>
</div>
