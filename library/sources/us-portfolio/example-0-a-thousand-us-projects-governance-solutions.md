---
layout: default
title: "Choosing a route from governance needs to information"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/library/models/us-portfolio-questions.html">← Return to the example</a> · <a href="/library/sources/us-portfolio/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> September–October 2020 demonstration, with the later reading notes and limitations retained. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/us-portfolio/files/Example_0_a_thousand_US_projects/Governance_solutions.md.txt" download="Governance_solutions.md">Download original file</a> · <a href="https://github.com/lawrencerowland/Data-models-for-portfolios/blob/01b04839ec24fbff82ffd3ec33fb0de125eacb2c/Example_0_a_thousand_US_projects/Governance_solutions.md">GitHub source at 01b0483 (may require access)</a></p></aside>
</div>

{% raw %}
# Choosing a route from governance needs to information

**2020 working note · reading guidance added 1 October 2026.** The useful thread is to start with the decisions and accountabilities an organisation needs, then work through information, data and implementation choices. The three original sketches compare different routes; a graph can support model design without becoming the operational database.

These are proposed client scenarios, not evidence of three delivered engagements or a current service/tool recommendation. Terms such as “BIG” and the implementation checklist are retained as historical working language. Adding to a graph does not itself guarantee that existing queries or applications keep the same meaning: identifiers, relationship definitions and query assumptions still matter.

[Read the illustrated Library explanation](https://lawrencerowland.github.io/library/models/us-portfolio-questions.html#governance) · [Return to the portfolio walkthrough](/library/sources/us-portfolio/example-0-a-thousand-us-projects-readme.html)

## Original October 2020 note, retained unchanged

# Selling Governance solutions

- Select a solution

- Implementation steps

- When to use graphs

Appendix

- 2 more examples of solution selection

- example questions with client

- Use cases

- FAQ 

+++

## Select a solution

Conversation establishes client features, notably:
1.  Aspiration: how big a change does the client want ?
2.  Landscape of current data and accountabilities

Use these to select a *path through the woods*. 

> **Example 1** Client just wants to get project delivery up and running. They have a relatively tidy situation: departments have few overlapping accountabilities. They want to push some change, but want pace to reflect current project maturity in setting a roadmap, so effort will be spread over several months. 

<image src="/images/library-originals/us-portfolio-implementation-route.png" width="250"/>

 We decide we can:
 
 1. take their excel stored data
 2. use a graph database to set up & populate a project-data model
 3. hand the data back in a relational database 
 4. Dashboard and views will be set up in PowerBI. 



## Implementation steps

> '..we work back from the governance needs that we have to the MI implications, to the data implications, then to the data integration implications, then to the tool and process implications. That is the ethos, and that it is achieved by providing enabling capability - then layering on implications a step at a time as vision build then implied use cases build, and further business areas engage into the scenario.' Dunning Oct 2020

| Steps                 |   Considerations                                            |
| ---------------------------------- | ---------------------------------------------                                               |
| Create_Reference_views                     |    Club agrees upfront                                          |
|    |..data model w accountabilities|
|    |..per maturity |
|    |..per sector |
|Identify governance needs|Map_against_reference_view |
|     |    find a start-point                          |
| | from prelim discussions |
||identify related Dept. systems|
||add business entities|
| Identify_accountablities    |                                            agree key governance nodes|
||seed start-points for BIG|
|     |   complete for all entities|     
||define and describe| 
| Governance -> MI needs |     data implications & provenance                                           |
||identify decision-capability [^*(e.g. performance, lifecycle step) assurance, analysis and problem solving, opportunity / threat discovery*] |
|| map data -> insight |
|| map insight -> decision|  
||identify relevant Enterprise system|    
||confirm source->report_DB mapping|  
| Design_enablers                    |    enablers for Ops &BIG|   
||add governance, ops, process |
||build around use cases|
||add relevant permissions|
||develop cadence, support,|
||develop methods and tools|                                                           
| Migration_stages_to_BIG            |   define stages                                          |
|| ..driven by business-need|
||..phase in wider stakeholders|
||..build in step with progress on Vision|
||..when entities switch across|
||..when data-base and links change |
| Design_enablers_for_growth       |  set integration roadmap                                             |
||identify emerging challenges|
||culture roadmap|

+++

## When to use graphs

When we need to go through several iterations with the client

> 'graphs are naturally additive, meaning we can add new kinds of relationships, new nodes, new labels and new subgraphs to an existing structure without disturbing existing queries and application functionality' [^"Graph Databases" Robinson, Webber, Eifrem, 2015 Published by O'Reilly]

When we want to use the data to generate the schema

<image src="/library/sources/us-portfolio/files/Example_0_a_thousand_US_projects/images1/Neo4j_features.jpg" width="270"/>

**Other Indicators**
- projects are only part of the picture
- data domains overlap 
- accountability is widely distributed
- delivery is not just done in projects
- staff are not just accountable for projects
- data items are shared across the enterprise
- accountabilities overlap

+++

## Appendix 1 Two more examples

> *Example 2* An SME has a good project delivery capability, but senior visibility and accountability is poor. They would like a governance overlay over their existing project delivery framework, which covers many project aspects quite well, and is modelled on Prince. They do not want to go fast on this, because they believe that progress is rate-limited most by the  decision-making ability of their senior managers. Therefore we agree to progress in an agile fashion, only adding those features in each user-story which we can see are reachable at the start of each epic. 

<image src="/library/sources/us-portfolio/files/Example_0_a_thousand_US_projects/images1/Solution_selection_2a.png" width="250"/>

We decide we can:

1. Use our in_house tool to harvest the data
2. Maintain our design database in SQL, mirroring it in a graph database, to assist with fast visual prototyping of the schema with the client
3. Revert to a single schema in the SQL database we hand over,where additional elements in the schema get added in phases depending on progress. 
4. build a bespoke management and visualisation platform with the various business layers suggested by Chase_mgt_services. 

+++

> *Example 3* A large client wants to fully transform the way that projects are delivered, as well as the way they are governed and assured. There are multiple data-sources and numerous overlapping accountabilities. They have the budget and senior focus to be able to drive change fast through a Integrated Governance programme.  

<image src="/images/library-originals/us-portfolio-transformation-route.png" width="270"/>

 We decide we can:
 
 1. commission their IT team to use their Master Data Management  capability, hosted by Informatics, to provide the data we require, showing provenance,data-used, data-flows, and refresh-rate
 2. work within SQL on this data, with a schema we determine
 3. return to the client a new SQL schema with instructions via SQL, and work with their team to understand what data flows need to change
 4. Use Tableau to provide all the views as per all the Use Cases agreed for governance and decision making. 

*What are the features to select on ?*
*Which solution combinations work ?*

## Appendix 2: example questions with client

**Questions about Aspiration**

- Do you just want to get things moving ?
- Are projects being delivered okay, but with unclear accountabilities ?
	- do you need to clarify accountabilities across all delivery?
	- will this be a fully funded initiative to set Governance?
	- this can be used to plan and drive change
	- otherwise, an incremental approach may be indicated
 - Are you needing to overhaul both delivery and governance ?
 - how would you describe your desired end-state ?

**Questions about Landscape** 

- how good is the data ?
- how well are the accountabilities working ?
- are data and accountabilities in silos or widely distributed ?
- is there a useful business logic within the data ?
- or is the delivery landscape simple and project-focussed ?
- if so, might a project-centric data-model work ?
- how would you characterise the as-is state ?

**Questions about Tools**

- where are the data stored ?
- how are we going to store the data we analyse ?
- how will we be providing the data back for Operations ?
- what will be the primary tool for ongoing visuals and analytics?

+++

## Appendix 3: Use Cases (working list)

| Origin  |      Use-case                                         |
| ---------- | --------------------------------------------- |
| ones_we_design|visualise accountability and delivery nodes| 
||see links between accountability & other nodes|
||Commercial reviews Supplier capacity        |
||make KPIs accessible to daily management |
|| display specific %/binary accomplishments|
||map business plans against actual relationships|
||show hierarchy of results (e.g. as pyramid)|
||watch weaknesses (e.g. metrics least met)|
||watch strengths (e.g. metrics most met)|
||regular confidence scores per stakeholder type|
| ones_that_emerge                | track un-managed dependencies               |
|                  | compare aspirations with actual dependencies|
|| seeing resource constraint |
||make ad hoc “related to” links|
||£, priority, mgt-time for worse project types|
|| etc.|

+++

## Appendix 4: FAQ

**Q: Is a graph database needed to generate graph visualisations ?**

*A: No. Most software allows you to do this. Graph databases do this natively, but this is not their main benefit*

**Q: if we have a common capture process, we can translate into graph databases to support visualisation. Can we do this fast and cheaply?**

*A: This is probably a secondary use case. But yes, I think so, although I have so far only tested up to around 100,000 lines of  data entry. I might be able to take directly from the common capture process, depending on what its output is. Otherwise, I could take it from the relational database.*


{% endraw %}
