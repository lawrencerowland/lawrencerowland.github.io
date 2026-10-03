---
layout: default
title: "2021 Project ontology in Gistv0"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/Portfolio-data-model.html#other-model-reading-routes">← Return to the example</a> · <a href="/library/sources/project-ontology/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> An unfinished 2021 Owlready/Gist exploration. Machine-specific paths and environment dependencies remain in the originals. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/project-ontology/files/Data_model_recorded_as_ontology_Owlready/2021%20Project_ontology_in_Gistv0.ipynb" download="2021 Project_ontology_in_Gistv0.ipynb">Download original notebook</a> · <a href="https://github.com/lawrencerowland/Data-models-for-projects/blob/6667aa15a5ae881d889131814a940bc17f0d6dc1/Data_model_recorded_as_ontology_Owlready/2021%20Project_ontology_in_Gistv0.ipynb">GitHub source at 6667aa1 (may require access)</a></p></aside>
</div>

{% raw %}
# 2021 Project ontology in Gistv0

Saved notebook · 3 cells. Code and outputs below are retained from the original; **nothing was executed for this reading copy**. Environment dependencies, missing data and the model limitations remain as described in the linked guide.

<section class="reading-cell" id="cell-1" markdown="1">
<p class="reading-cell-label">Cell 1 · code</p>

<pre class="reading-code"><code># Relevant classes
Project, Task,PlannedEvent,ScheduledTask,

Organization,Person,

Obligation,Commitment,DegreeOfCommitment,Intention,

Function,Requirement,Specification,ServiceSpecification,Artifact,ProductUnit,

Possibly useful: Aspect, Category,Behavior,Building, BundledCatalogItem,CatalogItem,Collection,OrderedCollection,Restriction,Component,System,Event,
,ContingentEvent,Controller,Duration,HistoricalEvent,Message,Permission,PhysicalEvent,ProductCategory,
SystemInstant,TaskTemplate,</code></pre>

</section>

<section class="reading-cell" id="cell-2" markdown="1">
<p class="reading-cell-label">Cell 2 · code</p>

<pre class="reading-code"><code># Relevant object properties:
subTaskOf,hasSubTask,hasDirectPart,directPartOf,hasPart,memberOf,hasMember,aspectOf,
partOf,categorizedBy,orderedMemberOf,madeUpOf,

hasGoal,affectedBy,allocatedBy,contributesTo,basisFor,

governedBy,directs,respondsTo, governs,recognizedBy,accepts,allows,prevents,identifies,owns,

triggeredBy,precedes,directlyPrecededBy,directlyPrecedes,plannedEnd,plannedStart,actualStart,actualEnd,

fromAgent,toAgent,

hasSubCategory,hasSuperCategory,

affects,connectedTo,
    
conformsTo, basedOn,
 
directSubTaskOf,hasDirectSubTask,
 
parentOf,planned,produces,recognizes,requires,</code></pre>

</section>

<section class="reading-cell" id="cell-3" markdown="1">
<p class="reading-cell-label">Cell 3 · code</p>

<pre class="reading-code"><code># cant get this to work
Project100 = onto.Project(&quot;Project100&quot;) 
Project101= onto.Project(&quot;Project101&quot;, namespace = onto)
onto.search(type = &#x27;Project&#x27;) # searches for Individuals of a given class
onto.search(is_a = &quot;Project&quot;) # searching both Individuals and subclasses of a given Class
onto.destroy_entity
list(onto.Project.subclasses())</code></pre>

</section>

{% endraw %}
