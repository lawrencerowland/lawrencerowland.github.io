---
layout: default
title: "2020 02 Tasks and states and resources LR.cypher"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/project-model-comparison.html">← Return to the example</a> · <a href="/library/sources/project-graphs/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> Retained 2020 graph-construction examples and a separate Highways prediction exploration. Neither has been rerun here. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/project-graphs/files/cypher/2020%2002%20Tasks%20and%20states%20and%20resources%20LR.cypher.txt" download="2020 02 Tasks and states and resources LR.cypher.txt">Download original file</a> · <a href="https://github.com/lawrencerowland/project-scheduling-with-Neo4j/blob/aa6e8102bd5ff5fe14a05380895ce0bfcfc65351/cypher/2020%2002%20Tasks%20and%20states%20and%20resources%20LR.cypher.txt">GitHub source at aa6e810 (may require access)</a></p></aside>
</div>

{% raw %}
# 2020 02 Tasks and states and resources LR.cypher

<pre class="reading-code"><code>CREATE CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
UNWIND [{_id:46, properties:{name:&quot;Identify waste&quot;}}, {_id:47, properties:{name:&quot;Remove waste&quot;}}, {_id:48, properties:{name:&quot;Prepare Waste extraction plan&quot;}}, {_id:49, properties:{name:&quot;Commission suppliers&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Task;
UNWIND [{_id:50, properties:{name:&quot;No waste left on site&quot;}}, {_id:51, properties:{name:&quot;Waste understood&quot;}}, {_id:52, properties:{name:&quot;Plan agreed&quot;}}, {_id:53, properties:{name:&quot;Suppliers ready&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:State;
UNWIND [{_id:66, properties:{role:&quot;Engineer&quot;}}, {_id:67, properties:{role:&quot;Project_manager&quot;}}, {_id:68, properties:{role:&quot;Supplier&quot;}}, {_id:69, properties:{role:&quot;Operator&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource;
UNWIND [{start: {_id:67}, end: {_id:49}, properties:{}}, {start: {_id:68}, end: {_id:49}, properties:{}}, {start: {_id:66}, end: {_id:48}, properties:{}}, {start: {_id:68}, end: {_id:47}, properties:{}}, {start: {_id:69}, end: {_id:46}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:allocated_to]-&gt;(end) SET r += row.properties;
UNWIND [{start: {_id:52}, end: {_id:49}, properties:{}}, {start: {_id:51}, end: {_id:48}, properties:{}}, {start: {_id:53}, end: {_id:47}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:permits]-&gt;(end) SET r += row.properties;
UNWIND [{start: {_id:47}, end: {_id:50}, properties:{}}, {start: {_id:48}, end: {_id:52}, properties:{}}, {start: {_id:49}, end: {_id:53}, properties:{}}, {start: {_id:46}, end: {_id:51}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:causes]-&gt;(end) SET r += row.properties;
MATCH (n:`UNIQUE IMPORT LABEL`)  WITH n LIMIT 20000 REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID`;
DROP CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
</code></pre>

{% endraw %}
