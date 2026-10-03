---
layout: default
title: "Digital transformation: choose a model file"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/Portfolio-data-model.html#other-model-reading-routes">← Return to the example</a> · <a href="/library/sources/programme-models/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> A 2019–2020 toy university transformation programme, with guessed details and a later reading guide. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/programme-models/files/READmeForprogrammegraphs.md.txt" download="READmeForprogrammegraphs.md">Download original file</a> · <a href="https://github.com/lawrencerowland/Data-models-for-programmes/blob/6bbd1af404c2b64fd53b550e486e3be44d59f213/READmeForprogrammegraphs.md">GitHub source at 6bbd1af (may require access)</a></p></aside>
</div>

{% raw %}
# Digital transformation: choose a model file

**A guide to the retained 2019–2020 example, revised 1 October 2026.** The scenario draws on public University of East London material and includes guessed details. These are alternative drawings and inputs for discussion, not an adopted institutional model.

[Read the scenario and three role views](/library/sources/programme-models/readme.html) · [Return to the Library's modelling guide](https://lawrencerowland.github.io/Portfolio-data-model.html#read-the-worked-models)

![A simplified schema groups Strategy, Projects and Operations around programme outcomes.](/images/index/Digital_Programme_simplified_graph_schema.jpg)

*A schema names kinds of things and relationships. The instance drawings below populate such a picture with specific names. This simplified overview has the same ten entity labels and three groups as Option 2; most arrows are unlabelled in the picture.*

## Which version of the model?

The earlier explanation said the author worked from Option 2 towards Option 1 by changing the level of abstraction. That remains part of the experiment's history, but its general-versus-specific ranking does not describe the saved files reliably. **Choose by the distinctions and relationships you want to inspect.** Neither file is established here as the best schema for a real organisation.

### The two schemas

#### [Schema Option 1 — more distinctions and visible relationship names](/library/sources/programme-models/files/graph_models/Digital%20Transformation%20Programme%20schema%20only-Option-1.graphml)

Separates Corporate Programmes from IT Programmes; includes Programme Threats and Programme approach. Its 13 entity nodes sit within or beside P3M, Operations and Strategy groups. All 26 edges have visible relationship labels.

Start here to read what the arrows say. Programme Outcomes and Services sit outside the three groups: connections can cross those visual boundaries.

#### [Schema Option 2 — a smaller grouped picture](/library/sources/programme-models/files/graph_models/Digital-Transformation-Programme-schema-only-Option-2.graphml)

Combines programmes into one kind and omits Programme Threats and Programme approach. Ten entity nodes, three groups and 21 edges; Services is inside Operations.

The file stores 20 relation values but does not draw their names as edge labels. One additional Operations self-loop has no relation value at all. Do not infer a meaning for every arrow from this overview.


For example, Option 1 lets a reader distinguish an IT programme from a corporate programme. Option 2 simply says Programmes. That is a modelling choice about what to retain in a conversation, not a claim that fewer boxes make a more correct model.

The group boxes matter: in Option 2, Services belongs inside the Operations group; in Option 1 it is outside. A connection to Services therefore does not mean the same thing as membership of Operations. The drawings do not establish that these visual groups are a formal class hierarchy.

### The two instance drawings

#### [Schema and instance v5 — named examples in nested groups](/library/sources/programme-models/files/graph_models/Digital%20Transformation%20Programme%20schema%20and%20instance%20v5.graphml)

150 named instances and 236 relationships, plus 16 visual group boxes. The XML contains 166 nodes when those groups are counted.

The grouped drawing helps distinguish families of things. Group membership and an edge to a neighbour answer different questions. Some entries remain placeholders, including Business Change 1–4 and generic numbered projects.

#### [Neo4j export for yEd Live — a flat exported view](/library/sources/programme-models/files/graph_models/DT%20Programme%20graph%20from%20Neo4j%20for%20YEd%20Live.graphml)

150 nodes and 236 relationships, with names, types and styling stored in the export's structured data. It has no nested group boxes.

This is a separate export of the example, not an identical file in a different wrapper. It uses special node styling. A tool that fails to draw its labels has not thereby shown that the names are missing.


## What the counts mean

The [historical Cypher input](/library/sources/programme-models/cypher-code-for-graph-database-2019-11-digital-transformation-programme-education-cypher-input-lr-neo4j.html) declares 150 nodes and 236 relationships, using 13 node labels. It gives each node an `id` and `name`; its relationships have types but no corresponding properties.

The grouped v5 drawing has 14 distinct relationship labels. The Cypher and flat export have **15 literal relationship types** because `are_delivered_by` and `are_delivered_by_` are separate spellings. Their shared counts therefore do not prove exact equivalence. These original differences have been preserved and identified, rather than silently normalised.

## Reading and editing are separate from execution

All four GraphML files parse as XML. They retain drawing and model information, but that alone does not establish compatibility with a current editor or a working database import. The earlier guide contradicted itself about yEd Live support; that guarantee has been removed. The grouped drawings use yEd-style graphics, while the flat export uses different styling conventions.

Use the [saved pictures and consultation sheets](/library/sources/programme-models/readme.html#operations-services-and-consumers) to read the example without installing anything. For editing, keep an untouched copy of the chosen GraphML source. For database work, inspect the separate Cypher input and its assumptions before considering an import into a disposable database; it is not a scheduling or decision engine. No editor import or database execution was performed for this guide.

[Back to the scenario and role views](/library/sources/programme-models/readme.html) · [Original sponsorship questions](/library/sources/programme-models/programme-sponsorship-questions.html) · [Library](https://lawrencerowland.github.io/library.html)

{% endraw %}
