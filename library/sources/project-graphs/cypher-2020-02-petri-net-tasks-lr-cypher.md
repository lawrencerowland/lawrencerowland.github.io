---
layout: default
title: "2020 02 petri net tasks LR.cypher"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/project-model-comparison.html">← Return to the example</a> · <a href="/library/sources/project-graphs/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> Retained 2020 graph-construction examples and a separate Highways prediction exploration. Neither has been rerun here. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/project-graphs/files/cypher/2020%2002%20petri%20net%20tasks%20LR.cypher.txt" download="2020 02 petri net tasks LR.cypher.txt">Download original file</a> · <a href="https://github.com/lawrencerowland/project-scheduling-with-Neo4j/blob/aa6e8102bd5ff5fe14a05380895ce0bfcfc65351/cypher/2020%2002%20petri%20net%20tasks%20LR.cypher.txt">GitHub source at aa6e810 (may require access)</a></p></aside>
</div>

{% raw %}
# 2020 02 petri net tasks LR.cypher

<pre class="reading-code"><code>CREATE CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
UNWIND [{_id:49, properties:{identity:&quot;Prepare Waste extraction plan&quot;, transition_type:&quot;Task&quot;}}, {_id:103, properties:{identity:&quot;Identify waste&quot;, transition_type:&quot;Task&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Transition;
UNWIND [{_id:46, properties:{identity:&quot;Plan agreed&quot;, resource_type:&quot;State&quot;, token:1}}, {_id:47, properties:{identity:&quot;Operator&quot;, resource_type:&quot;Role&quot;, token:5}}, {_id:102, properties:{identity:&quot;Engineer&quot;, resource_type:&quot;Role&quot;, token:10}}, {_id:116, properties:{identity:&quot;Waste understood&quot;, resource_type:&quot;State&quot;, token:1}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Place;
UNWIND [{start: {_id:47}, end: {_id:103}, properties:{Consumed_tokens:5}}, {start: {_id:102}, end: {_id:49}, properties:{Consumed_tokens:10}}, {start: {_id:116}, end: {_id:49}, properties:{Consumed_tokens:0}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:ARC]-&gt;(end) SET r += row.properties;
UNWIND [{start: {_id:103}, end: {_id:116}, properties:{Produced_tokens:1}}, {start: {_id:49}, end: {_id:46}, properties:{Produced_tokens:1}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:ARC]-&gt;(end) SET r += row.properties;
MATCH (n:`UNIQUE IMPORT LABEL`)  WITH n LIMIT 20000 REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID`;
DROP CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
</code></pre>

{% endraw %}
