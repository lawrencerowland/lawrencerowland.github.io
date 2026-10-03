---
layout: default
title: "2020 02 task state and resource w extra links"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/project-model-comparison.html">← Return to the example</a> · <a href="/library/sources/project-graphs/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> Retained 2020 graph-construction examples and a separate Highways prediction exploration. Neither has been rerun here. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/project-graphs/files/cypher/2020%2002%20task%20state%20and%20resource%20w%20extra%20links.cypher" download="2020 02 task state and resource w extra links.cypher">Download original file</a> · <a href="https://github.com/lawrencerowland/project-scheduling-with-Neo4j/blob/aa6e8102bd5ff5fe14a05380895ce0bfcfc65351/cypher/2020%2002%20task%20state%20and%20resource%20w%20extra%20links.cypher">GitHub source at aa6e810 (may require access)</a></p></aside>
</div>

{% raw %}
# 2020 02 task state and resource w extra links

<pre class="reading-code"><code>CREATE CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
UNWIND [{_id:46, properties:{name:&quot;Identify waste&quot;}}, {_id:47, properties:{name:&quot;Remove waste&quot;}}, {_id:48, properties:{name:&quot;Prepare Waste extraction plan&quot;}}, {_id:49, properties:{name:&quot;Commission suppliers&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Task;
UNWIND [{_id:110, properties:{name:&quot;No waste left on site&quot;}}, {_id:111, properties:{name:&quot;Waste understood&quot;}}, {_id:112, properties:{name:&quot;Plan agreed&quot;}}, {_id:113, properties:{name:&quot;Suppliers ready&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:State;
UNWIND [{_id:114, properties:{role:&quot;Engineer&quot;}}, {_id:115, properties:{role:&quot;Project_manager&quot;}}, {_id:116, properties:{role:&quot;Supplier&quot;}}, {_id:117, properties:{role:&quot;Operator&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource;
UNWIND [{start: {_id:115}, end: {_id:49}, properties:{}}, {start: {_id:116}, end: {_id:49}, properties:{}}, {start: {_id:114}, end: {_id:48}, properties:{}}, {start: {_id:116}, end: {_id:47}, properties:{}}, {start: {_id:117}, end: {_id:46}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:allocated_to]-&gt;(end) SET r += row.properties;
UNWIND [{start: {_id:112}, end: {_id:49}, properties:{}}, {start: {_id:111}, end: {_id:48}, properties:{}}, {start: {_id:113}, end: {_id:47}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:permits]-&gt;(end) SET r += row.properties;
UNWIND [{start: {_id:47}, end: {_id:110}, properties:{}}, {start: {_id:48}, end: {_id:112}, properties:{}}, {start: {_id:49}, end: {_id:113}, properties:{}}, {start: {_id:46}, end: {_id:111}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:causes]-&gt;(end) SET r += row.properties;
UNWIND [{start: {_id:46}, end: {_id:48}, properties:{}}, {start: {_id:48}, end: {_id:49}, properties:{}}, {start: {_id:49}, end: {_id:47}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:permits]-&gt;(end) SET r += row.properties;
MATCH (n:`UNIQUE IMPORT LABEL`)  WITH n LIMIT 20000 REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID`;
DROP CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
</code></pre>

{% endraw %}
