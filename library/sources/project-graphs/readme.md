---
layout: default
title: "Project models in Neo4j: one waste-removal example"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/project-model-comparison.html">← Return to the example</a> · <a href="/library/sources/project-graphs/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> Retained 2020 graph-construction examples and a separate Highways prediction exploration. Neither has been rerun here. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/project-graphs/files/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/project-scheduling-with-Neo4j/blob/4f5baa8f92c10d12b2318992602fde5195015977/README.md">GitHub source at 4f5baa8 (may require access)</a></p></aside>
</div>

{% raw %}
# Project models in Neo4j: one waste-removal example

These historical examples compare ways to describe the same small project. Identify the waste so it is understood; prepare an extraction plan so it is agreed; commission suppliers so they are ready; then remove the waste so none remains on site.

What should the graph make explicit: the work, the conditions it produces, the people involved, or schedule fields? The repository contains nine Cypher files with seven distinct contents, plus diagrams. They are graph-construction examples from 2020, with differing scope and detail.

![Four waste-removal tasks, the states they produce, and the roles allocated to them](/images/library-originals/waste-tasks-states-resources.png)

[Companion reading guide](https://lawrencerowland.github.io/project-model-comparison.html)

## Seven views to compare

1. **Tasks as nodes.** [Script](/library/sources/project-graphs/cypher-2020-02-tasks-w-tasks-as-nodes-cypher.html) · [Diagram](/images/library-originals/waste-tasks.png). Four named activities form a chain of `permits` relationships. This gives a compact account of what follows what. The conditions explaining those dependencies, role allocations and durations are absent.

2. **States as nodes.** [Script](/library/sources/project-graphs/cypher-2020-02-states-as-nodes-only-lr.html) · [Diagram](/images/library-originals/waste-states.png). Four achieved conditions are joined by `transitions_with_task`. The view foregrounds what must become true. The relationships carry no task names, and the initial act of identifying waste has no separate representation. The `.cypher.text` file duplicates this script.

3. **Tasks and states together.** [Script](/library/sources/project-graphs/cypher-2020-02-tasks-and-states-as-nodes-lr-cypher.html) · [Diagram](/library/sources/project-graphs/files/images/2020%2002%20tasks%20and%20states%20bipartite%20LR%20instance.png). Tasks `cause` states; states `permit` later tasks. This exposes the condition between consecutive activities. The relationship names express the model's intended meaning; the file does not check whether a condition holds or a task may execute. Roles and timing remain absent.

4. **Tasks, states and resources.** [Script](/library/sources/project-graphs/cypher-2020-02-tasks-and-states-and-resources-lr-cypher.html) · [Diagram](/images/library-originals/waste-tasks-states-resources.png). Operator, Engineer, Project_manager and Supplier connect to tasks through `allocated_to`. The Supplier participates in both commissioning and removal. These links show involvement, without quantities, availability, calendars, cost or capacity constraints.

5. **Add direct task dependencies.** [Script](/library/sources/project-graphs/cypher-2020-02-task-state-and-resource-w-extra-links.html) · [Diagram](/library/sources/project-graphs/files/images/2020%2002%20task%20state%20and%20resource%20w%20extra%20links.png). Direct task-to-task `permits` edges sit beside the task–state–task paths. They make the activity sequence easier to follow, while duplicating relationships that a maintained model would need to keep consistent. No derivation or consistency check is supplied. The `.cypher.txt` file duplicates this script.

6. **Petri-net-shaped fragment.** [Script](/library/sources/project-graphs/cypher-2020-02-petri-net-tasks-lr-cypher.html) · [Diagram](/images/library-originals/waste-petri-fragment.png). Only the first two tasks appear, as transitions; roles and states become places with token properties. There is no firing engine. Both state places already contain one token. The `Waste understood` input stores `Consumed_tokens:0`: zero consumption alone does not specify a requirement to test token presence. A [read arc](https://arpi.unipi.it/handle/11568/771117) explicitly tests without consuming. Resource units and whether resources should be returned remain unresolved; no return arcs are present. This fragment does not demonstrate executable prerequisite or resource control.

7. **Stored schedule attributes.** [Script](/library/sources/project-graphs/cypher-2020-02-project-task-scheduling-in-neo4j-from-nicole-white-reviewed-cypher.html) · [Related structure diagram](/library/sources/project-graphs/files/images/2020%2002%20task%20state%20and%20resource%20w%20extra%20links.png). Start/Finish nodes and duration, earliest/latest dates and slack are added. The file imports the numbers; it contains no scheduling algorithm. The related diagram omits these additions.

## Scope and other retained material

The scripts use historical constraint syntax; compatibility with current Neo4j has not been verified. No resource-constrained scheduling, simulation or optimisation result is established here.

## Highways delay prediction: a separate notebook

*Notebook labelled August 2020; reading guidance added 2 October 2026.*

[Read the pictured guide in the Library](https://lawrencerowland.github.io/ML-for-portfolios.html#highways-delay-notebook) · [Open the original notebook](/library/sources/project-graphs/2020-08-highways.html)

Could completed A14 activities help predict finish variance for work that has not started? The notebook selects a 30 September 2019 reporting snapshot, separates completed from not-started activities, and tries both classification (`FinishDateVariance >= 5`) and regression of the variance itself. The field's units and sign convention are not established in the notebook; it does not predict activity duration.

Its useful thread is the warning about information available at prediction time. Read from **Bring in data** through **Exploratory Data analyis**, then the classifier and regressor sections. The saved training-set comparisons are not a test on future work. DABL model-selection scores are also retained, but a separate test set and prediction-to-activity index checks remain unfinished. Cleaning precedes the completed/not-started split; feature availability and preparation need validation.

The required local `P6Activities.csv` is absent. The notebook and its saved outputs are preserved unchanged and were not rerun for this guide. This tabular prediction experiment is separate from the graph-model examples above.

## Other retained files

The repository also preserves an [earlier activity-schema picture](/library/sources/project-graphs/files/images/Projects-as-tasks-arrows-tool-LR.png), a [tasks-and-resources-only diagram](/library/sources/project-graphs/files/images/2020%2002%20tasks%20and%20resources%20as%20nodes.png), an [Apple Pages note](https://github.com/lawrencerowland/project-scheduling-with-Neo4j/blob/4f5baa8f92c10d12b2318992602fde5195015977/2020%2002%20scheduling%20answer.pages), a [saved Quora PDF](https://github.com/lawrencerowland/project-scheduling-with-Neo4j/blob/4f5baa8f92c10d12b2318992602fde5195015977/Search%20-%20what%20would%20be%20a%20recommended%20algorithm%20-%20Quora.pdf), and separate Browning-letter [data](https://github.com/lawrencerowland/project-scheduling-with-Neo4j/blob/4f5baa8f92c10d12b2318992602fde5195015977/data) and [images](/library/sources/project-graphs/). The Pages note and PDF have not been reviewed for this guide.

{% endraw %}
