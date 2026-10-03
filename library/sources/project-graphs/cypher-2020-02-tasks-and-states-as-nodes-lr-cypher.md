---
layout: default
title: "2020 02 tasks and states as nodes LR.cypher"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/project-model-comparison.html">← Return to the example</a> · <a href="/library/sources/project-graphs/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> Retained 2020 graph-construction examples and a separate Highways prediction exploration. Neither has been rerun here. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/project-graphs/files/cypher/2020%2002%20tasks%20and%20states%20as%20nodes%20LR.cypher.txt" download="2020 02 tasks and states as nodes LR.cypher.txt">Download original file</a> · <a href="https://github.com/lawrencerowland/project-scheduling-with-Neo4j/blob/aa6e8102bd5ff5fe14a05380895ce0bfcfc65351/cypher/2020%2002%20tasks%20and%20states%20as%20nodes%20LR.cypher.txt">GitHub source at aa6e810 (may require access)</a></p></aside>
</div>

{% raw %}
# 2020 02 tasks and states as nodes LR.cypher

<pre class="reading-code"><code>CREATE CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
UNWIND [{_id:0, properties:{name:&quot;Identify waste&quot;}}, {_id:3, properties:{name:&quot;Remove waste&quot;}}, {_id:20, properties:{name:&quot;Prepare Waste extraction plan&quot;}}, {_id:21, properties:{name:&quot;Commission suppliers&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Task;
UNWIND [{_id:2, properties:{name:&quot;No waste left on site&quot;}}, {_id:23, properties:{name:&quot;Waste understood&quot;}}, {_id:40, properties:{name:&quot;Plan agreed&quot;}}, {_id:41, properties:{name:&quot;Suppliers ready&quot;}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:State;
UNWIND [{start: {_id:40}, end: {_id:21}, properties:{}}, {start: {_id:23}, end: {_id:20}, properties:{}}, {start: {_id:41}, end: {_id:3}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:permits]-&gt;(end) SET r += row.properties;
UNWIND [{start: {_id:3}, end: {_id:2}, properties:{}}, {start: {_id:20}, end: {_id:40}, properties:{}}, {start: {_id:21}, end: {_id:41}, properties:{}}, {start: {_id:0}, end: {_id:23}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:causes]-&gt;(end) SET r += row.properties;
MATCH (n:`UNIQUE IMPORT LABEL`)  WITH n LIMIT 20000 REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID`;
DROP CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
</code></pre>

{% endraw %}
