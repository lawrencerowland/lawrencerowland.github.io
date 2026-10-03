# Reading the original query sheet

**September 2020 queries · review note added 1 October 2026.** These are retained query texts supporting the [pictured walkthrough](READme.md), not rerun results or a checked contemporary Neo4j tutorial.

The patterns show how a question selects connected records. They also show why the unit of a result matters: `count(i)` and `count(t.Description)` count matched rows/non-null values, not necessarily distinct investments or programmes. Multiple paths can repeat the same entity. The supplier comparison requires identifier/name reconciliation; the start-delay query groups activity observations by business function, not independently established “programme types”. The metric query uses `Project_delay > 100`, so its threshold is strictly more than 100 days.

The spend query uses the historical property name `Enhancement_spend_$m` without identifier quoting, converts values to integers and reports no currency conversion. Its original £82m claim is therefore not a verified monetary result. Inspect types, property names, distinct identifiers and missing records before any future reproduction. No queries have been executed during this review.

2026 terminology references: [Neo4j aggregation and duplicate counting](https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-count) and [identifier naming rules](https://neo4j.com/docs/cypher-manual/current/syntax/naming/). These clarify the reading notes; the historical query text has not been modernised.

## Original query sheet, retained unchanged

### Cypher queries

These are the queries used to return the results in this note. 

**How many programmes are dependent on our largest single supplier ?**

> MATCH (s:Supplier)<-[r:uses_Supplier]-(i:Investment) WHERE i.name IS NOT null RETURN s.name,count(i) ORDER BY count (i) DESCENDING

> MATCH (s:Supplier)<-[r:uses_Supplier]-(i:Investment) WHERE s.name='INTERNATIONAL BUSINESS MACHINES CORPORATION' AND i.name IS NOT NULL OPTIONAL MATCH  (i)<--(j:Bureau) OPTIONAL MATCH  (i)<--(k:Agency) RETURN s,i,j,k

**What metrics are being used to control these particular programmes?**

> MATCH (s:Supplier)<-[r:uses_Supplier]-(i:Investment)-->(m:Metric) WHERE s.name='INTERNATIONAL BUSINESS MACHINES CORPORATION' AND i.name IS NOT NULL RETURN m.Measurement_category,count(m.Description) ORDER BY count(m.Description) DESCENDING

> MATCH (m:Metric) WHERE m.Metric_results="Met" RETURN m.Measurement_category,COUNT(m.Description) ORDER BY m.Measurement_category

** Which programmes are given low scores by clients?**

> MATCH (m:Investment)--(n:Service) WHERE (m.Evaluation_by_CIO='1'OR m.Evaluation_by_CIO='2') AND m.name IS NOT NULL RETURN m,n

** How much money is being spent on similar HR programmes ?**

> MATCH (s:Service)--(i:Investment) WHERE  s.name='756-Human Capital / Workforce Management' AND i.name IS NOT null RETURN s,i

> MATCH (s:Service)--(i:Investment) WHERE  s.name='756-Human Capital / Workforce Management' AND i.name IS NOT null RETURN sum(toInteger(i.Enhancement_spend_$m))

> MATCH (s:Service)--(i:Investment)--(p:Project) WHERE  s.name='756-Human Capital / Workforce Management' AND i.name IS NOT null AND p.Project_delay>0 RETURN i,s,p

**How much delay to projects on these programmes?**

> MATCH (s:Service)--(i:Investment)--(p:Project) WHERE  s.name='756-Human Capital / Workforce Management' AND i.name IS NOT null RETURN i,s,p

> MATCH (s:Service)--(i:Investment)--(p:Project) WHERE  s.name='756-Human Capital / Workforce Management' AND i.name IS NOT null AND p.Project_delay>0 RETURN i,s,p

> MATCH (s:Service)--(i:Investment)--(p:Project) WHERE  s.name='756-Human Capital / Workforce Management' AND i.name IS NOT null AND p.Project_delay>0 RETURN sum(p.Project_delay)

**22 activities listed for these delayed projects**

> MATCH (s:Service)--(i:Investment)--(p:Project)--(a:Activity) WHERE  s.name='756-Human Capital / Workforce Management' AND i.name IS NOT null AND p.Project_delay>0 RETURN a.output_type

> MATCH (s:Service)--(i:Investment)--(p:Project)--(a:Activity) WHERE  s.name='756-Human Capital / Workforce Management' AND i.name IS NOT null AND p.Project_delay>0 RETURN avg(Tointeger(replace((a.Actual_start_delay)," days","")))

**Which programmes start late?**

> MATCH (a:Activity)  RETURN avg(Tointeger(replace((a.Actual_start_delay)," days","")))

> MATCH (b:Business_Function)<--(i:Investment)-->(p:Project)-->(a:Activity) WITH b,i,p,a,Tointeger(replace((a.Actual_start_delay)," days","")) AS x RETURN b.name AS `Type of programme`,Tointeger(avg(x)) AS `Average start delay (days)` ORDER BY Tointeger(avg(x)) DESC

> MATCH (b:Business_Function)<--(i:Investment)-->(p:Project)-->(a:Activity) WITH b,i,p,a,Tointeger(replace((a.Actual_start_delay)," days","")) AS x WHERE b.name='301-Controls and Oversight'AND i.name IS NOT null RETURN b,i,p,a

**Business functions for one particular service**

> MATCH (m:Service)--(i:Investment)--(o:Business_Function) WHERE m.name='743-Knowledge Discovery' AND i.name IS NOT null RETURN m,i,o

**What metrics might help with very late projects?**

> MATCH (m:Project)--(:Investment)--(t:Metric) WHERE m.Project_delay>100 AND t.Metric_results='Not Met' RETURN t.Measurement_category,count(t.Description) ORDER BY count(t.Description) DESC

**the work of 1 department**

> MATCH (p:Investment)<-[:responsible_for]-(c:Bureau)   WHERE c.Name='Food and Drug Administration' OPTIONAL MATCH (p)-[:pays_for]->(n:Project) OPTIONAL MATCH (n)-[:has_task]->(m:Activity) OPTIONAL MATCH (p)-[:judged_by]->(v:Metric) OPTIONAL MATCH (p)-[:lets_contract]->(w:Contract) OPTIONAL MATCH (p)-[:uses_Supplier]->(a:Supplier) OPTIONAL MATCH (p)-[:is_a_type_of]->(b:Service) OPTIONAL MATCH (p)-[:has_business_function]->(e:Business_Function)-[:serves]->(d:Business_Area) RETURN p,c,n,m,v,w,a,b,d,e
