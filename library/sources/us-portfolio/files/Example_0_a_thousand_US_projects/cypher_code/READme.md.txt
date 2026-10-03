# Graph exports and unfinished setup

**Historical 2020 files · reading guidance added 1 October 2026.** Read the [pictured walkthrough](../READme.md) before treating these files as a model. The original setup draft below remains incomplete, with unresolved duplicate nodes. It is not a supported import procedure.

- [Complete graph](Complete_graph.cypher), [Health extract](Health_sub_graph.cypher), [FDA extract](FDA_sub_graph.cypher) and [alternate FDA extract](FDA_sub_graph_0.cypher) preserve different saved exports. They are not asserted to be interchangeable or to reproduce each pictured view exactly.
- `export.cypher0` through `export.cypher3` belong to the staged attempt described below. They are not a verified sequence of migration steps.
- The cleanup examples use `DETACH DELETE`; matching the proposed survivor and duplicate to the same node can delete the survivor. In one pattern `[pays_for]` names a relationship variable rather than restricting its type. These are substantive reasons not to run the draft as a recipe on an existing database.
- The original research/development-only data-use restriction still applies. Public files are not a new licence. No imports, deletions, queries or notebook runs were performed for this reading guide.

## Original setup note, retained unchanged

# STATUS

This is not finalised. There are some procedural gaps in this. I will need to redo. 

The original temporary sandbox is no longer offered here. Create your own Neo4j instance and use your own connection details. The setup instructions below are historical and incomplete.

# Constructing the Health graph in Sandbox 

In the Sandbox, on a slower connection, I was finding that pulling in all the cypher code for the FDA sub graph was timing out.

Instead I did it as as a series of smaller pull ins. The Cypher 0 -3 refers to the cypher files in this directory.

0. Apply cypher 0 which brings in 108 projects and 22 investments (PROJECT, INVESTMENT, ACTIVITY)

> I also removed this label in the new graph
> MATCH (n:`UNIQUE IMPORT LABEL`) REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID` RETURN n


1. Apply Cypher 1 . Now 196 Projects but with only the recent ones in with links to Activities. Presumably this is the remainder. 

2. Apply Cypher 2. Now there will be duplicate investments where there is also a Metric

3. Apply Cypher 3
Now there will be duplicate investments where there is also a  Contract

But I find that this turns up no changes.
There are however duplicate Investments I will need to review later. 

# the Queries which were used to construct these cypher files 0-3

Cypher 0 was created by

> MATCH (n:Project)-[r:has_task]->(m:Activity), (p:Investment)-[pays_for]->(o:Project) WHERE o.Id=n.Id 
> MERGE (o)-[:has_task]->(m) WITH n,o,m
> DETACH DELETE (n)
> RETURN o.name,m.name

Cypher 1 seems to have been a continuation of the above query

Cypher 2 was created by

> MATCH (o:Investment)-[g:judged_by]->(v:Metric), (p:Investment)-[b:pays_for]->(q:Project) WHERE p.Identifier=o.Identifier
> MERGE (p)-[:judged_by]->(v) WITH p,v,o
> DETACH DELETE (o)
> RETURN p.name

Cypher 3

> MATCH (o:Investment)-[i:lets_contract]->(w:Contract), (p:Investment)-[b:pays_for]->(q:Project) WHERE p.Identifier=o.Identifier
> MERGE (p)-[:lets_contract]->(w) WITH o,p
> DETACH DELETE (o)
> RETURN p.name


