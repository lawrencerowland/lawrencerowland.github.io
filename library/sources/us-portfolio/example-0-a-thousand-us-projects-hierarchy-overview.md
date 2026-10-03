---
layout: default
title: "Reading the Health hierarchy draft"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/library/models/us-portfolio-questions.html">← Return to the example</a> · <a href="/library/sources/us-portfolio/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> September–October 2020 demonstration, with the later reading notes and limitations retained. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/us-portfolio/files/Example_0_a_thousand_US_projects/Hierarchy_overview.md.txt" download="Hierarchy_overview.md">Download original file</a> · <a href="https://github.com/lawrencerowland/Data-models-for-portfolios/blob/01b04839ec24fbff82ffd3ec33fb0de125eacb2c/Example_0_a_thousand_US_projects/Hierarchy_overview.md">GitHub source at 01b0483 (may require access)</a></p></aside>
</div>

{% raw %}
# Reading the Health hierarchy draft

**2020 working note · clarification added 1 October 2026.** This is a top-down companion to the [pictured walkthrough](/library/sources/us-portfolio/example-0-a-thousand-us-projects-readme.html), not a reconciled count of the entire US government portfolio.

Read its useful structure as **agency → bureau → investment → project → activity**, with investments also related to measures, business functions and services. The original below says both 11 and 6 bureaus and contains an unexplained `22 108 410 66` line. Its second “Business Functions” list describes service categories; the saved Health export has separate `Business_Function` and `Service` node types. Static inspection of the Health export finds 721 Investment records, of which 22 have names, and 202 Project records, of which 108 have names. Its Investment identifier strings are all distinct. It contains 11 Bureau, 18 Business_Function and 29 Service nodes: those figures support the earlier 11-bureau statement and identify the second classification list as services. The complete export’s 437 investments and 1,547 projects count named records, explaining the apparent total mismatch. These are checks of saved export text, not a rebuilt database or independently validated entity register.

[Read the Library case study](https://lawrencerowland.github.io/library/models/us-portfolio-questions.html#model) · [Inspect the retained Health export](/library/sources/us-portfolio/files/Example_0_a_thousand_US_projects/cypher_code/Health_sub_graph.cypher)

## Original draft, retained unchanged

### The Portfolio for the Department of Health and Human Services

Above, we have been dotting around asking typical management and   forensic questions. A top down description  can also be helpful, so here is one of the contents of one of the large sub-portfolios: that for Health. 

The US Government is responsible for the work of 26 Agencies and 81 Bureaus. 
One of these is the Health Agency which has:
- 202 Projects 
- spread across 11 Bureaus
22	108	410	66
This Agency is responsible for the work of 6 Bureaus, of which one is the FDA, shows above: 

- "Centers for Medicare and Medicaid Services"
- "Health Resources and Services Administration"
- "National Institutes of Health"
- "Indian Health Services"
- "Centers for Disease Control and Prevention"
- "Department of Health and Human Services"
- "Substance Abuse and Mental Health Services Administration"
- "Administration for Children and Families"
- "Agency for Healthcare Research and Quality"
- "Departmental Management"

Altogether these Bureaus run 721 Investments, of which many are Programmes, the remainder being Operational spend. 

There are 202 Projects run to deliver these Programmes, and 1102 Activities described within these Projects. 

These investments are judged by 455 Metrics.

These investments contribute to 18 Business Functions, grouped into three business areas: 
The top five contributions are to:
- "Health" supported by 	338 investments 
- "IT Management" supported by 136
- "Planning and Budgeting"	 supported by 37
- "Controls and Oversight"supported by 	34
- "Administrative Management" supported by	32

These investments contribute to 29 Business Functions. The top five contributions are to:
- "Knowledge Management"	supported by 185 investments
- "Management of Process"	by 138
- "Financial Management"	 by 60
- "Tracking and Workflow"	by 40
- "Development and Integration"	by 30

Overall, there are 2796 nodes representing these features of the Health Agency, along with 3677 relationships between them, plus additional properties related to each node, such as start and end dates.

{% endraw %}
