---
layout: default
title: "2021 project ontology in Gistv1"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/Portfolio-data-model.html#other-model-reading-routes">← Return to the example</a> · <a href="/library/sources/project-ontology/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> An unfinished 2021 Owlready/Gist exploration. Machine-specific paths and environment dependencies remain in the originals. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/project-ontology/files/Data_model_recorded_as_ontology_Owlready/2021_project_ontology_in_Gistv1.ipynb" download="2021_project_ontology_in_Gistv1.ipynb">Download original notebook</a> · <a href="https://github.com/lawrencerowland/Data-models-for-projects/blob/6667aa15a5ae881d889131814a940bc17f0d6dc1/Data_model_recorded_as_ontology_Owlready/2021_project_ontology_in_Gistv1.ipynb">GitHub source at 6667aa1 (may require access)</a></p></aside>
</div>

{% raw %}
# 2021 project ontology in Gistv1

Saved notebook · 39 cells. Code and outputs below are retained from the original; **nothing was executed for this reading copy**. Environment dependencies, missing data and the model limitations remain as described in the linked guide.

<section class="reading-cell" id="cell-1" markdown="1">
<p class="reading-cell-label">Cell 1 · code</p>

<pre class="reading-code"><code>import os
import graphviz
import owlready2 as owl
import weakref
import graph_onto as GO # set up within this directory</code></pre>

</section>

<section class="reading-cell" id="cell-2" markdown="1">
<p class="reading-cell-label">Cell 2 · code</p>

<pre class="reading-code"><code>onto_path = &#x27;file://&#x27; + os.path.abspath(&#x27;ontologies/gistCore9.5.0&#x27;)
onto = owl.get_ontology(onto_path).load()
print(&#x27;Loaded owl file at:&#x27;, onto_path)
# onto1 = get_ontology(&quot;file:///Users/lawrence/ontologies/project_example.owl&quot;).load() NEED TO ADD EMPTY ONTOLOGY
# onto.base_iri</code></pre>

</section>

<section class="reading-cell" id="cell-3" markdown="1">
<p class="reading-cell-label">Cell 3 · code</p>

<pre class="reading-code"><code># OPTION LOOK ACROSS ALL CLASSES using the generator
for x in onto.classes(): 
    print(x)</code></pre>

</section>

<section class="reading-cell" id="cell-4" markdown="1">
<p class="reading-cell-label">Cell 4 · code</p>

<pre class="reading-code"><code># OPTION Or transform the generator into a list with the list() function
class_as_list=list(onto.classes())
print (class_as_list[-10]) # Get a random class in collection
list (onto.disjoint_classes()) # or look at disjoint classes
# Or, rather than simply classes,etreive all disjoint individual entity objects, stored in the dict
disjoints = list(onto.disjoints())
for x in disjoints: 
    print(x, &#x27;    &#x27;,x.__dict__,&#x27;\n&#x27;)</code></pre>

</section>

<section class="reading-cell" id="cell-5" markdown="1">
<p class="reading-cell-label">Cell 5 · code</p>

<pre class="reading-code"><code># FIND THE CLASSES OF INTEREST
Project_search_results_as_list=onto.search(iri=&#x27;*Project*&#x27;) # search for entities by looking along the full IRI
Task_search_results_as_list=onto.search(iri=&#x27;*Task&#x27;)
Artifact_search_results_as_list=onto.search(iri=&#x27;*Artifact&#x27;)
print(Project_search_results_as_list,Task_search_results_as_list,Artifact_search_results_as_list)</code></pre>

</section>

<section class="reading-cell" id="cell-6" markdown="1">
<p class="reading-cell-label">Cell 6 · code</p>

<pre class="reading-code"><code># SELECT THE CLASSES OF INTEREST FROM SEARCH RESULTS
Project_class_actually=Project_search_results_as_list[0]
Task_class_actually=Task_search_results_as_list[0]
Artifact_class_actually=Artifact_search_results_as_list[0]</code></pre>

</section>

<section class="reading-cell" id="cell-7" markdown="1">
<p class="reading-cell-label">Cell 7 · code</p>

<pre class="reading-code"><code># OPTION HAVE A LOOK AT CLASS PROPERTIES
print (&#x27;is a&#x27;, Artifact_class_actually.is_a)  # this gives SUPER classes
print(&#x27;equivalent_to:&#x27;, Artifact_class_actually.equivalent_to)
print(&#x27;has subclasses: &#x27;, onto.search(subclass_of=Artifact_class_actually))  # this give SUB classes
for sc in Artifact_class_actually.ancestors():
    print (sc)
for sc in Artifact_class_actually.descendants():
    print (sc)
print(Artifact_class_actually.__dict__)</code></pre>

</section>

<section class="reading-cell" id="cell-8" markdown="1">
<p class="reading-cell-label">Cell 8 · code</p>

<pre class="reading-code"><code># CREATE INSTANCES OF THIS CLASS</code></pre>

</section>

<section class="reading-cell" id="cell-9" markdown="1">
<p class="reading-cell-label">Cell 9 · code</p>

<pre class="reading-code"><code>#Refer to each project as ProjectX[0] etc
Project=[]
ProjectX=[]
for p in range (0,3):
    name=&#x27;Project&#x27;+str(p)
    Project.append(name) # this does nothing 
    ProjectX.append(Project_class_actually(Project[p]))
    print (Project[p], &#x27;   &#x27;,ProjectX[p])</code></pre>

</section>

<section class="reading-cell" id="cell-10" markdown="1">
<p class="reading-cell-label">Cell 10 · code</p>

<pre class="reading-code"><code># TaskX[0] etc
Task=[]
TaskX=[]
for t in range (0,9):
    name=&#x27;Task&#x27;+str(t)
    Task.append(name)
    TaskX.append(Task_class_actually(Task[t]))
    print (Task[t], &#x27;   &#x27;,TaskX[t])</code></pre>

</section>

<section class="reading-cell" id="cell-11" markdown="1">
<p class="reading-cell-label">Cell 11 · code</p>

<pre class="reading-code"><code># ArtifactX[0] etc
Artifact=[]
ArtifactX=[]
for t in range (0,3):
    name=&#x27;Artifact&#x27;+str(t)
    Artifact.append(name)
    ArtifactX.append(Artifact_class_actually(Artifact[t]))
    print (Artifact[t], &#x27;   &#x27;,ArtifactX[t])</code></pre>

</section>

<section class="reading-cell" id="cell-12" markdown="1">
<p class="reading-cell-label">Cell 12 · code</p>

<pre class="reading-code"><code>ProjectX[2]</code></pre>

<details class="reading-output"><summary>Saved output</summary>
<pre>gist.Project2</pre>
</details>

</section>

<section class="reading-cell" id="cell-13" markdown="1">
<p class="reading-cell-label">Cell 13 · code</p>

<pre class="reading-code"><code># The first parameter is the name (or identifier) of the Individual; it corresponds to the .name attribute in Owlready2. 
# If not given, the name if automatically generated from the Class name and a number.
random_name=Project_class_actually(&#x27;Project_Fruitloop100&#x27;)# create a one off project EASIEST
ProjectX.append(Project_class_actually(&#x27;Project_Fruitloop200&#x27;)) # SECOND EASIEST
ProjectX.append(Project_class_actually(&#x27;Project_Fruitloop300&#x27;,namespace=onto,hasSubTask=[TaskX[0]])) # THIRD EASIEST</code></pre>

</section>

<section class="reading-cell" id="cell-14" markdown="1">
<p class="reading-cell-label">Cell 14 · code</p>

<pre class="reading-code"><code># OPTIONAL  
# ACCESS INSTANCES BY GENERAL VARIABLE OR BY ITERATING THROUGH CLASS
print (ProjectX[0].name,ProjectX[0].iri)
list (onto.individuals())
# note that this particular ontology has ensured some individuals are disjoint
# Some tasks will not be disjoint, but Project people will be, so good to have a go at creating this
print (&#x27;\n different indiviudals&#x27;)
list (onto.different_individuals())
list (onto.individuals())</code></pre>

</section>

<section class="reading-cell" id="cell-15" markdown="1">
<p class="reading-cell-label">Cell 15 · code</p>

<pre class="reading-code"><code># OPTIONAL  
for p in Project_class_actually.instances(): print (p.name)
for t in Task_class_actually.instances(): print (t.name)
for t in Artifact_class_actually.instances():print (t.name)</code></pre>

</section>

<section class="reading-cell" id="cell-16" markdown="1">
<p class="reading-cell-label">Cell 16 · code</p>

<pre class="reading-code"><code># CREATE RELATIONSHIPS</code></pre>

</section>

<section class="reading-cell" id="cell-17" markdown="1">
<p class="reading-cell-label">Cell 17 · code</p>

<pre class="reading-code"><code># Most simple
# ProjectX[0].hasSubTask = [TaskX[0],TaskX[1],TaskX[2]]</code></pre>

</section>

<section class="reading-cell" id="cell-18" markdown="1">
<p class="reading-cell-label">Cell 18 · code</p>

<pre class="reading-code"><code># Second most simple
# ProjectX[0] is type Gist.Project and is not subscriptable further. But below is a generator so can use:
#for p in Project_class_actually.instances(): p.hasSubTask = [TaskX[0]]</code></pre>

</section>

<section class="reading-cell" id="cell-19" markdown="1">
<p class="reading-cell-label">Cell 19 · code</p>

<pre class="reading-code"><code># Third most simple</code></pre>

</section>

<section class="reading-cell" id="cell-20" markdown="1">
<p class="reading-cell-label">Cell 20 · code</p>

<pre class="reading-code"><code>#problem is here, that I dont know what order the instances are presented in. So only good for slapdash
counter=0
for p in Project_class_actually.instances():
    p.hasSubTask = [TaskX[counter],TaskX[counter+1],TaskX[counter+2]]
    counter+=3</code></pre>

</section>

<section class="reading-cell" id="cell-21" markdown="1">
<p class="reading-cell-label">Cell 21 · code</p>

<pre class="reading-code"><code>counter=0
for p in Project_class_actually.instances():
    p.produces = [ArtifactX[counter]]
    counter+=1</code></pre>

</section>

<section class="reading-cell" id="cell-22" markdown="1">
<p class="reading-cell-label">Cell 22 · code</p>

<pre class="reading-code"><code>#OPTIONAL check relationships have worked
print (ProjectX[0].get_properties(),&#x27;\n&#x27;) # OR..
for p in Project_class_actually.instances(): print (p.get_properties(),&#x27;\n&#x27;)
print(ProjectX[2].INDIRECT_hasSubTask,&#x27;\n&#x27;) # alternative
print(ProjectX[2].INDIRECT_produces,&#x27;\n&#x27;)
property_list=list(onto.properties()) #list of all generic properties:  
rel = property_list[-1] # select a particular relation from the list
print(rel, rel.__dict__)</code></pre>

</section>

<section class="reading-cell" id="cell-23" markdown="1">
<p class="reading-cell-label">Cell 23 · code</p>

<pre class="reading-code"><code>#Interested in the relation &#x27;produces&#x27;
#  the .class_property_type attribute of Properties allows to indicate how to handle class properties:
# “some”: handle class properties as existential restrictions (i.e. SOME restrictions and VALUES restrictions).
# “only”: handle class properties as universal restrictions (i.e. ONLY restrictions).
# “relation”: handle class properties as relations (i.e. simple RDF triple, as in Linked Data).
print(onto.search(produces = &quot;*&quot;)) #searches for individuals related w ‘produces’ 
pr=onto.search(iri=&#x27;*produces*&#x27;) # this focusses on the relationship itself
print (pr)
print(&#x27;class_property_some:&#x27;, pr[0]._class_property_some)
print(&#x27;class_property_only:&#x27;, pr[0]._class_property_only)
print(&#x27;class_property_relation:&#x27;, pr[0]._class_property_relation)
print(pr[0].__dict__)
# print(&#x27;name(string):&#x27;, pr[0].name)
#print(&#x27;module_type:&#x27;, pr[0].__module__)
# print(&#x27;is_a:&#x27;, pr[0].is_a) # will come back saying its an owl property</code></pre>

</section>

<section class="reading-cell" id="cell-24" markdown="1">
<p class="reading-cell-label">Cell 24 · code</p>

<pre class="reading-code"><code>#calling the functions from *.py file</code></pre>

</section>

<section class="reading-cell" id="cell-25" markdown="1">
<p class="reading-cell-label">Cell 25 · code</p>

<pre class="reading-code"><code>entity = GO.keyword_search_onto(&#x27;Artifact&#x27;, onto)
print(entity == onto.Artifact, entity,&#x27;-&#x27;*20,&#x27;\n&#x27;)
kg = GO.ontograf_simple(entity, onto)
print(kg)
GO.convert_to_graphviz(kg)</code></pre>

</section>

<section class="reading-cell" id="cell-26" markdown="1">
<p class="reading-cell-label">Cell 26 · code</p>

<pre class="reading-code"><code># so far, I have introduced a new property &#x27; produces&#x27; between instances of Project and Artifact.
#This does not appear in the class rules, and it will need to presumably.</code></pre>

</section>

<section class="reading-cell" id="cell-27" markdown="1">
<p class="reading-cell-label">Cell 27 · code</p>

<pre class="reading-code"><code>onto.save(file = &quot;/Users/lawrence/Documents/GitHub/Data-models-for-projects/Project_model.owl&quot;, format = &quot;rdfxml&quot;)</code></pre>

</section>

<section class="reading-cell" id="cell-28" markdown="1">
<p class="reading-cell-label">Cell 28 · code</p>

<pre class="reading-code"><code>Artifact_class_actually.instances()</code></pre>

<details class="reading-output"><summary>Saved output</summary>
<pre>[gist.Artifact0, gist.Artifact1, gist.Artifact2]</pre>
</details>

</section>

<section class="reading-cell" id="cell-29" markdown="1">
<p class="reading-cell-label">Cell 29 · code</p>

<pre class="reading-code"><code># ACTION THIS BELOW
# We can see from this, that relationship properties have to be created both sides 
print(onto.search(hasSubTask = &quot;*&quot;))
ProjectX[0].__dict__
TaskX[0].__dict__</code></pre>

<details class="reading-output"><summary>Saved output</summary>
<pre>[gist.Project0, gist.Project1, gist.Project2]
</pre>
</details>

</section>

<section class="reading-cell" id="cell-30" markdown="1">
<p class="reading-cell-label">Cell 30 · code</p>

<pre class="reading-code"><code># annotations are one of the property types where the objects are names or strings or link addresses (IRIs),
# but over which no reasoning may occur. Annotations provide the labels, definitions, comments, and pointers to the actual objects in the system. We can assign values in a straightforward manner to annotations (in this case, &lt;code&gt;altLabel&lt;/code&gt;):</code></pre>

</section>

<section class="reading-cell" id="cell-31" markdown="1">
<p class="reading-cell-label">Cell 31 · code</p>

<pre class="reading-code"><code>ProjectX[0].altLabel = [&quot;Digital_Reset_project&quot;,&#x27;2021_Cloud_project&#x27;]</code></pre>

</section>

<section class="reading-cell" id="cell-32" markdown="1">
<p class="reading-cell-label">Cell 32 · code</p>

<pre class="reading-code"><code>ProjectX[0].get_properties()</code></pre>

</section>

<section class="reading-cell" id="cell-33" markdown="1">
<p class="reading-cell-label">Cell 33 · code</p>

<pre class="reading-code"><code>print(ProjectX[0].altLabel)</code></pre>

</section>

<section class="reading-cell" id="cell-34" markdown="1">
<p class="reading-cell-label">Cell 34 · code</p>

<pre class="reading-code"><code># Owlready2 enables us to also place restrictions on our classes
#nthrough a special type of class constructed by the system.
some - Property.some(Range_Class)
only - Property.only(Range_Class)
min - Property.min(cardinality, Range_Class)
max - Property.max(cardinality, Range_Class)
exactly - Property.exactly(cardinality, Range_Class)
value - Property.value(Range_Individual / Literal value)
has_self - Property.has_self(Boolean value).</code></pre>

</section>

<section class="reading-cell" id="cell-35" markdown="1">
<p class="reading-cell-label">Cell 35 · markdown</p>

### Operators
Owlready2 provides three logical operators between classes (including class constructs and restrictions):

- ‘&’ - And operator (intersection). For example: Class1 & Class2. It can also be written: And([Class1, Class2])
- ‘|’ - Or operator (union). For example: Class1 | Class2. It can also be written: Or([Class1, Class2])
- Not() - Not operator (negation or complement). For example: Not(Class1).

</section>

<section class="reading-cell" id="cell-36" markdown="1">
<p class="reading-cell-label">Cell 36 · markdown</p>

Both HermiT and Pellet are written in Java, so require access to a JVM on your system. If you have difficulty running these systems it is likely because you: 1) do not have a recent version of Java installed on your system; or 2) do not have a proper PATH statement in your environmental variables to find the Java executable. If you encounter such problems, please consult third-party sources to get Java properly configured for your system before continuing with this installment.

</section>

<section class="reading-cell" id="cell-37" markdown="1">
<p class="reading-cell-label">Cell 37 · code</p>

<pre class="reading-code"><code>owl.sync_reasoner()</code></pre>

</section>

<section class="reading-cell" id="cell-38" markdown="1">
<p class="reading-cell-label">Cell 38 · code</p>

<pre class="reading-code"><code>owl.sync_reasoner_pellet()</code></pre>

</section>

<section class="reading-cell" id="cell-39" markdown="1">
<p class="reading-cell-label">Cell 39 · code</p>

<pre class="reading-code"><code></code></pre>

</section>

{% endraw %}
