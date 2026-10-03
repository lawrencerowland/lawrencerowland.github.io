---
layout: default
title: One job, seven graph models
description: A small waste-removal project reveals what task, state, resource, Petri-net and schedule representations make explicit or leave out.
schema_type: TechArticle
wide: true
home_front_door: true
tags: [DataModeling, GraphDatabases, ProjectManagement]
---

<div class="pw-home pw-framework-guide pw-model-comparison" id="home-main" tabindex="-1">
  <header class="pw-model-heading">
    <p class="pw-home-kicker">Earlier modelling experiments · 2020</p>
    <h1>One job.<br>Seven graph models.</h1>
    <p class="pw-model-lead">A site needs its waste removed. Identify it, prepare an extraction plan, commission suppliers and remove it. What changes when we describe this job through tasks, achieved states, people or tokens?</p>
    <p>These small Neo4j examples let us inspect what each representation makes explicit—and what disappears. They are historical source models, not a working scheduler.</p>
    <p class="pw-model-returns"><a href="{{ '/library.html' | relative_url }}">← Library</a> · <a href="{{ '/Portfolio-data-model.html#read-the-worked-models' | relative_url }}">Other worked models</a> · <a href="#seven-views">Compare all seven</a></p>
  </header>
  <div class="pw-framework-prose">
    <h2 id="one-small-job">One small job, three kinds of thing</h2>
    <p>Follow the middle row from left to right. The green conditions explain what the blue tasks achieve and why later tasks can start. The pink roles show who is allocated. For example, preparing the plan and having an agreed plan are different things.</p>
<figure class="pw-framework-figure"><a href="{{ '/images/library-originals/waste-tasks-states-resources.png' | relative_url }}"><img src="{{ '/images/library-originals/waste-tasks-states-resources.png' | relative_url }}" alt="Green state nodes above four blue task nodes, with pink Operator, Engineer, Project manager and Supplier roles below. Tasks cause states; states permit subsequent tasks; roles are allocated to tasks." loading="lazy"></a><figcaption>Lawrence’s original task, state and resource diagram. Colour is supported by the labels and relationship names. Select the picture for the original at full size.</figcaption></figure>
    <h2 id="what-disappears">What disappears when we simplify?</h2>
    <p>The task-only view keeps the actions. The state-only view keeps the achieved conditions but drops the action names. Neither can answer every question the combined picture can.</p>
<figure class="pw-framework-figure"><a href="{{ '/images/library-originals/waste-tasks.png' | relative_url }}"><img src="{{ '/images/library-originals/waste-tasks.png' | relative_url }}" alt="Identify waste, Prepare Waste extraction plan, Commission suppliers and Remove waste connected in sequence." loading="lazy"></a><figcaption>Tasks only: a recognisable chain of work. Select the picture for the original at full size.</figcaption></figure><figure class="pw-framework-figure"><a href="{{ '/images/library-originals/waste-states.png' | relative_url }}"><img src="{{ '/images/library-originals/waste-states.png' | relative_url }}" alt="Waste understood, Plan agreed, Suppliers ready and No waste left on site connected in sequence." loading="lazy"></a><figcaption>States only: a chain of achieved conditions; the script’s links do not retain task identities. Select the picture for the original at full size.</figcaption></figure>
    <h2 id="seven-views">Seven choices, different questions</h2>
    <p>This reading order is a new guide to the earlier files, not a claim that the richer model is always better. Nine script files contain seven distinct variants; two pairs are exact copies.</p>
    <div class="pw-model-variants">
<section id="tasks" class="pw-model-variant"><p class="pw-home-kicker">1 · Tasks</p><h3>What work comes next?</h3><p>Four named tasks are linked by <code>permits</code>. This makes the sequence easy to follow; achieved conditions and resource needs are left implicit.</p><p><a href="/library/sources/project-graphs/cypher-2020-02-tasks-w-tasks-as-nodes-cypher.html">Read the tasks script →</a></p></section>
<section id="states" class="pw-model-variant"><p class="pw-home-kicker">2 · States</p><h3>What needs to become true?</h3><p>Four conditions run from “Waste understood” to “No waste left on site”. The links are called <code>transitions_with_task</code>, but the script does not name the tasks on them. The initial identification task has disappeared. This is a loss of information, not an equivalent view.</p><p><a href="/library/sources/project-graphs/cypher-2020-02-states-as-nodes-only-lr.html">Read the states script →</a></p></section>
<section id="tasks-and-states" class="pw-model-variant"><p class="pw-home-kicker">3 · Tasks and states</p><h3>Why does that task enable the next one?</h3><p>“Prepare Waste extraction plan” <em>causes</em> “Plan agreed”, which <em>permits</em> “Commission suppliers”. The intermediate condition now has its own identity. The assumed result of preparing a plan is agreement; no separate approval process is modelled.</p><p><a href="/library/sources/project-graphs/cypher-2020-02-tasks-and-states-as-nodes-lr-cypher.html">Read the tasks and states script →</a></p></section>
<section id="resources" class="pw-model-variant"><p class="pw-home-kicker">4 · Add resources</p><h3>Who is allocated to the work?</h3><p>Operator, Engineer, Project manager and Supplier connect to tasks through <code>allocated_to</code>. Supplier is attached to two tasks. These links record allocation; they do not check availability, capacity or competing demands.</p><p><a href="/library/sources/project-graphs/cypher-2020-02-tasks-and-states-and-resources-lr-cypher.html">Read the add resources script →</a></p></section>
<section id="dependencies" class="pw-model-variant"><p class="pw-home-kicker">5 · Add direct dependencies</p><h3>Can we keep the familiar task chain too?</h3><p>Task-to-task <code>permits</code> links sit alongside the task–state–task paths. Both describe the same order here, but the script does not derive one from the other or keep them consistent after an edit.</p><p><a href="/library/sources/project-graphs/cypher-2020-02-task-state-and-resource-w-extra-links.html">Read the add direct dependencies script →</a></p></section>
<section id="petri" class="pw-model-variant"><p class="pw-home-kicker">6 · A Petri-net fragment</p><h3>What might be counted or required for an action?</h3><p>Two tasks become transitions; two states and two roles become places with token counts. This is only the first part of the job. The file records a proposed structure, with unresolved token meanings and no firing engine. See the qualification below before interpreting its arrows.</p><p><a href="/library/sources/project-graphs/cypher-2020-02-petri-net-tasks-lr-cypher.html">Read the Petri-net fragment script →</a></p></section>
<section id="schedule" class="pw-model-variant"><p class="pw-home-kicker">7 · Stored schedule attributes</p><h3>Where could timing information live?</h3><p>The fuller graph adds Start and Finish plus supplied duration, earliest/latest and slack values. Its four durations add to 50 unspecified time units. Those values are imported constants: the script neither calculates a schedule nor updates dates when a duration changes.</p><p><a href="/library/sources/project-graphs/cypher-2020-02-project-task-scheduling-in-neo4j-from-nicole-white-reviewed-cypher.html">Read the stored schedule attributes script →</a></p></section>

    </div>
    <h2 id="petri-limits">Reading the Petri-net attempt carefully</h2>
    <p>The change is suggestive: a role and an achieved condition can both be represented as places feeding a task. But the old file has not yet made their different meanings precise.</p>
<figure class="pw-framework-figure"><a href="{{ '/images/library-originals/waste-petri-fragment.png' | relative_url }}"><img src="{{ '/images/library-originals/waste-petri-fragment.png' | relative_url }}" alt="Two Transition nodes for Identify waste and Prepare Waste extraction plan, linked to Place nodes for Operator, Engineer, Waste understood and Plan agreed, with consumed and produced token properties." loading="lazy"></a><figcaption>The original two-task fragment, drawn as a Neo4j graph. Its circles are graph-database nodes; the Place and Transition labels distinguish their roles. Select the picture for the original at full size.</figcaption></figure>
    <ul>
      <li>“Waste understood” and “Plan agreed” already have one token in the supplied marking. This is not a simulation starting before those conditions are achieved.</li>
      <li>The “Waste understood” input has <code>Consumed_tokens: 0</code>. If that property is intended as an input-arc weight, zero imposes no token requirement under ordinary Petri-net firing rules. It is not a test that the condition holds while leaving its token untouched; that needs an explicit rule or construction.</li>
      <li>Role inputs consume 5 Operator tokens and 10 Engineer tokens, with no return arcs. The file does not establish whether these mean people, effort or something else, and does not model reusable availability.</li>
    </ul>
    <p>These are limits of this attempt, not reasons to discard Petri nets. Nor does this file demonstrate open-system composition or derive a family of feasible schedules.</p>

    <h2 id="read-edit-run">Read, edit or run?</h2>
    <p><strong>Read:</strong> the pictures and linked Cypher files are available in a browser. <strong>Edit:</strong> the text files specify the imported graph. <strong>Run:</strong> they use historical Neo4j syntax; compatibility with current versions has not been checked. They create graph records, not an execution or scheduling engine.</p>
    <p>Selected files and original images are publicly retained with <a href="/library/sources/project-graphs/readme.html">project-scheduling-with-Neo4j</a>. The <a href="/library/sources/project-graphs/">supporting files</a> identify the pinned August 2020 revisions read by this guide; it adds explanation without rewriting those models. The separate Highways machine-learning notebook is a different experiment, not part of the seven-model comparison.</p>
    <p class="pw-framework-note">The useful comparison is what each graph can express and what a reader must still supply. A picture of a dependency, a resource allocation and a computed schedule carry different commitments.</p>
    <p class="pw-model-returns"><a href="{{ '/Portfolio-data-model.html#read-the-worked-models' | relative_url }}">Other worked models</a> · <a href="{{ '/library.html' | relative_url }}">Back to the Library</a></p>
  </div>
</div>
