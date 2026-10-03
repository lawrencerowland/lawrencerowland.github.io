---
layout: default
title: "2020 02 Project task scheduling in Neo4j from Nicole White reviewed.cypher"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/project-model-comparison.html">← Return to the example</a> · <a href="/library/sources/project-graphs/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> Retained 2020 graph-construction examples and a separate Highways prediction exploration. Neither has been rerun here. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/project-graphs/files/cypher/2020%2002%20Project%20task%20scheduling%20in%20Neo4j%20from%20Nicole%20White%20reviewed.cypher.txt" download="2020 02 Project task scheduling in Neo4j from Nicole White reviewed.cypher.txt">Download original file</a> · <a href="https://github.com/lawrencerowland/project-scheduling-with-Neo4j/blob/aa6e8102bd5ff5fe14a05380895ce0bfcfc65351/cypher/2020%2002%20Project%20task%20scheduling%20in%20Neo4j%20from%20Nicole%20White%20reviewed.cypher.txt">GitHub source at aa6e810 (may require access)</a></p></aside>
</div>

{% raw %}
# 2020 02 Project task scheduling in Neo4j from Nicole White reviewed.cypher

<pre class="reading-code"><code>CREATE CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
UNWIND [{_id:46, properties:{duration:10, earliest_finish:10, slack:0, name:&quot;Identify waste&quot;, earliest_start:0, latest_start:0, latest_finish:10}}, {_id:47, properties:{duration:10, earliest_finish:50, slack:0, name:&quot;Remove waste&quot;, earliest_start:40, latest_start:40, latest_finish:50}}, {_id:49, properties:{duration:20, earliest_finish:30, slack:0, name:&quot;Prepare Waste extraction plan&quot;, latest_finish:30, earliest_start:10, latest_start:10}}, {_id:100, properties:{duration:0, earliest_finish:50, slack:0, name:&quot;Finish&quot;, latest_start:50, earliest_start:50, latest_finish:50}}, {_id:102, properties:{duration:10, earliest_finish:40, slack:0, name:&quot;Commission suppliers&quot;, earliest_start:30, latest_start:30, latest_finish:40}}, {_id:115, properties:{duration:0, earliest_finish:0, slack:0, name:&quot;Start&quot;, latest_start:0, latest_finish:0, earliest_start:0}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Task;
UNWIND [{_id:48, properties:{name:&quot;Plan agreed&quot;}}, {_id:103, properties:{name:&quot;No waste left on site&quot;}}, {_id:110, properties:{name:&quot;Suppliers ready&quot;}}, {_id:116, properties:{name:&quot;Waste understood&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:State;
UNWIND [{_id:111, properties:{role:&quot;Engineer&quot;}}, {_id:112, properties:{role:&quot;Project_manager&quot;}}, {_id:113, properties:{role:&quot;Supplier&quot;}}, {_id:114, properties:{role:&quot;Operator&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource;
UNWIND [{start: {_id:112}, end: {_id:102}, properties:{}}, {start: {_id:113}, end: {_id:102}, properties:{}}, {start: {_id:111}, end: {_id:49}, properties:{}}, {start: {_id:113}, end: {_id:47}, properties:{}}, {start: {_id:114}, end: {_id:46}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:allocated_to]-&gt;(end) SET r += row.properties;
UNWIND [{start: {_id:116}, end: {_id:49}, properties:{}}, {start: {_id:110}, end: {_id:47}, properties:{}}, {start: {_id:48}, end: {_id:102}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:permits]-&gt;(end) SET r += row.properties;
UNWIND [{start: {_id:47}, end: {_id:103}, properties:{}}, {start: {_id:49}, end: {_id:48}, properties:{}}, {start: {_id:102}, end: {_id:110}, properties:{}}, {start: {_id:46}, end: {_id:116}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:causes]-&gt;(end) SET r += row.properties;
UNWIND [{start: {_id:49}, end: {_id:102}, properties:{}}, {start: {_id:102}, end: {_id:47}, properties:{}}, {start: {_id:115}, end: {_id:46}, properties:{}}, {start: {_id:46}, end: {_id:49}, properties:{}}, {start: {_id:47}, end: {_id:100}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:permits]-&gt;(end) SET r += row.properties;
MATCH (n:`UNIQUE IMPORT LABEL`)  WITH n LIMIT 20000 REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID`;
DROP CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
</code></pre>

{% endraw %}
