---
layout: default
title: "subgraph OxfordUS Portfolio"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/library/models/us-portfolio-questions.html">← Return to the example</a> · <a href="/library/sources/us-portfolio/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> September–October 2020 demonstration, with the later reading notes and limitations retained. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/us-portfolio/files/Example_0_a_thousand_US_projects/subgraph_OxfordUS_Portfolio.ipynb" download="subgraph_OxfordUS_Portfolio.ipynb">Download original notebook</a> · <a href="https://github.com/lawrencerowland/Data-models-for-portfolios/blob/01b04839ec24fbff82ffd3ec33fb0de125eacb2c/Example_0_a_thousand_US_projects/subgraph_OxfordUS_Portfolio.ipynb">GitHub source at 01b0483 (may require access)</a></p></aside>
</div>

{% raw %}
# subgraph OxfordUS Portfolio

Saved notebook · 106 cells. Code and outputs below are retained from the original; **nothing was executed for this reading copy**. Environment dependencies, missing data and the model limitations remain as described in the linked guide.

<section class="reading-cell" id="cell-1" markdown="1">
<p class="reading-cell-label">Cell 1 · markdown</p>

# Setting up a Graph Database for the US Government IT Portfolios

</section>

<section class="reading-cell" id="cell-2" markdown="1">
<p class="reading-cell-label">Cell 2 · code</p>

<pre class="reading-code"><code>import pandas as pd
import numpy as np
import dabl
%matplotlib inline
import os
from dabl import plot
import matplotlib.pyplot as plt
import datetime as dt</code></pre>

<details class="reading-output"><summary>Saved output</summary>
<pre>Matplotlib is building the font cache; this may take a moment.
</pre>
</details>

</section>

<section class="reading-cell" id="cell-3" markdown="1">
<p class="reading-cell-label">Cell 3 · code</p>

<pre class="reading-code"><code>directory = &#x27;/Users/lawrence/Documents/GitHub/data_files_for_access/ProjectHack3data_Challenge9_from_Said_school/2013/&#x27;</code></pre>

</section>

<section class="reading-cell" id="cell-4" markdown="1">
<p class="reading-cell-label">Cell 4 · markdown</p>

# Bring in Projects file

</section>

<section class="reading-cell" id="cell-5" markdown="1">
<p class="reading-cell-label">Cell 5 · code</p>

<pre class="reading-code"><code>Projects=pd.read_csv(directory+&#x27;Projects.csv&#x27;, encoding= &#x27;unicode_escape&#x27;)</code></pre>

</section>

<section class="reading-cell" id="cell-6" markdown="1">
<p class="reading-cell-label">Cell 6 · code</p>

<pre class="reading-code"><code>Projects=Projects.drop([&#x27;Agency Project ID&#x27;,&#x27;Project Description&#x27;,&#x27;Lifecycle Cost&#x27;, &#x27;Cost Variance (%)&#x27;,&#x27;Projected/Actual Cost ($ M)&#x27;,&#x27;Updated Time&#x27;,&#x27;Unique Project ID&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-7" markdown="1">
<p class="reading-cell-label">Cell 7 · code</p>

<pre class="reading-code"><code>Projects[&#x27;Completion Date (B1)&#x27;]=Projects[&#x27;Completion Date (B1)&#x27;].astype(&#x27;datetime64&#x27;)
Projects[&#x27;Planned Project Completion Date (B2)&#x27;]=Projects[&#x27;Planned Project Completion Date (B2)&#x27;].astype(&#x27;datetime64&#x27;)
Projects[&#x27;Start Date&#x27;]=Projects[&#x27;Start Date&#x27;].astype(&#x27;datetime64&#x27;)
Projects[&#x27;Projected/Actual Project Completion Date (B2)&#x27;]=Projects[&#x27;Projected/Actual Project Completion Date (B2)&#x27;].astype(&#x27;datetime64&#x27;)
Projects[&#x27;Updated Date&#x27;]=Projects[&#x27;Updated Date&#x27;].astype(&#x27;datetime64&#x27;)
Projects[&#x27;Business Case ID&#x27;]=Projects[&#x27;Business Case ID&#x27;].astype(&#x27;category&#x27;)
Projects[&#x27;Agency Code&#x27;]=Projects[&#x27;Agency Code&#x27;].astype(&#x27;category&#x27;)
Projects[&#x27;Project ID&#x27;]=Projects[&#x27;Project ID&#x27;].astype(&#x27;category&#x27;)</code></pre>

</section>

<section class="reading-cell" id="cell-8" markdown="1">
<p class="reading-cell-label">Cell 8 · markdown</p>

In nearly all cases, Completion Date (B1) > Planned Project Completion Date (B2)

In some cases 'Projected/Actual Project Completion Date (B2) < Planned Project Completion Date (B2)
But in most cases, it is the other way around , so that Planned < Project /Actual i,e is earlier

And in most cases, where not equal: Projected/Actual Project Completion Date (B2)' <   'Completion Date (B1)'

therefore, Planning progresses in this order 

1. Planned Project Completion Date (B2)
2. Projected/Actual Project Completion Date (B2)
3. Completion Date (B1) 

So I will create:

- Planned Duration
 - Project Delay, which is the worst Project Delay I can find
Schedule variance appears to be Planned Project Completion Date (B2) MINUS 'Projected/Actual Project Completion Date (B2)
and Hence is often listed as Negative.
Which is okay, so Negative just means that Progress was underwhelming as normal.
So I can drop schedule variance and schedule  variance % because we have calculated it better as Project_Delay

</section>

<section class="reading-cell" id="cell-9" markdown="1">
<p class="reading-cell-label">Cell 9 · code</p>

<pre class="reading-code"><code># worked this out by a variety of boolean mixing such as:
# constraint=(Projects[&#x27;Projected/Actual Project Completion Date (B2)&#x27;]&lt;Projects[&#x27;Completion Date (B1)&#x27;])&amp;(pd.notna(Projects[&#x27;Projected/Actual Project Completion Date (B2)&#x27;]))&amp;(pd.notna(Projects[&#x27;Completion Date (B1)&#x27;]))
# Projects [constraint]</code></pre>

</section>

<section class="reading-cell" id="cell-10" markdown="1">
<p class="reading-cell-label">Cell 10 · markdown</p>

Projected/Actual more or less the same as Planned cost.
- sometimes a little more which makes sense
- a few with 0s which is okay
- so maybe best to drop 'Projected/Actual'

Lifecycle cost is:
- often zero
- mostly identical to Planned
- so best to drop this too. 
Looks like mostly Cost Variance +Planned Cost = Project/Actual Cost
i.e. just keep Planned cost and Cost Variance

</section>

<section class="reading-cell" id="cell-11" markdown="1">
<p class="reading-cell-label">Cell 11 · code</p>

<pre class="reading-code"><code># worked this out from variants of: 
# plt.scatter ((Projects[&#x27;Planned Cost ($ M)&#x27;],Projects[&#x27;Cost Variance ($ M)&#x27;]))</code></pre>

</section>

<section class="reading-cell" id="cell-12" markdown="1">
<p class="reading-cell-label">Cell 12 · code</p>

<pre class="reading-code"><code>Projects[&#x27;Planned_Duration&#x27;]=(Projects[&#x27;Planned Project Completion Date (B2)&#x27;]-Projects[&#x27;Start Date&#x27;]).dt.days
Projects[&#x27;Project_delay&#x27;]=(np.maximum(Projects[&#x27;Projected/Actual Project Completion Date (B2)&#x27;]-Projects[&#x27;Planned Project Completion Date (B2)&#x27;],Projects[&#x27;Completion Date (B1)&#x27;]-Projects[&#x27;Planned Project Completion Date (B2)&#x27;])).dt.days</code></pre>

</section>

<section class="reading-cell" id="cell-13" markdown="1">
<p class="reading-cell-label">Cell 13 · code</p>

<pre class="reading-code"><code>Projects=Projects.drop([&#x27;Planned Project Completion Date (B2)&#x27;,&#x27;Completion Date (B1)&#x27;,&#x27;Projected/Actual Project Completion Date (B2)&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-14" markdown="1">
<p class="reading-cell-label">Cell 14 · code</p>

<pre class="reading-code"><code>Projects[&#x27;Start_days_after_2000&#x27;]=(Projects[&#x27;Start Date&#x27;]-pd.Timestamp(&#x27;2000-01-01&#x27;)).dt.days</code></pre>

</section>

<section class="reading-cell" id="cell-15" markdown="1">
<p class="reading-cell-label">Cell 15 · code</p>

<pre class="reading-code"><code>Projects=Projects.drop([&#x27;Schedule Variance (%)&#x27;,&#x27;Schedule Variance (in days)&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-16" markdown="1">
<p class="reading-cell-label">Cell 16 · code</p>

<pre class="reading-code"><code>Projects[&#x27;Updated Date&#x27;]=(Projects[&#x27;Updated Date&#x27;]-Projects[&#x27;Start Date&#x27;]).dt.days # where this is now the no of days the update happened after start date</code></pre>

</section>

<section class="reading-cell" id="cell-17" markdown="1">
<p class="reading-cell-label">Cell 17 · code</p>

<pre class="reading-code"><code>Constraint=Projects[&#x27;Agency Code&#x27;]==9</code></pre>

</section>

<section class="reading-cell" id="cell-18" markdown="1">
<p class="reading-cell-label">Cell 18 · code</p>

<pre class="reading-code"><code>Projects=Projects[Constraint]</code></pre>

</section>

<section class="reading-cell" id="cell-19" markdown="1">
<p class="reading-cell-label">Cell 19 · markdown</p>

## Work out Data Structure as you go. 
Agency >> Investment (w Business Case ) >> Project ( Start, Completion, Cost, Variances)

## Create a basic example in Neo4j inline

CREATE (m:Agency {name:'Dept Agriculture',Code:5})
CREATE (n:Investment {name:'AMS Infrastructure WAN and DMZ (AMSWAN)', Identifier:'005-000001723'})
CREATE (o:Project {name:'Virtualization', Id:657,Cost_Variance:0,Planned_Cost:0.179,Updated_Date:60,Planned_Duration:182, Project_delay:0,Start_days_after_2000:4291})
CREATE (m)-[:invests]->(n)
CREATE (n)-[:pays_for]->(o)

After testing this, I can bring in CSV: see further below

</section>

<section class="reading-cell" id="cell-20" markdown="1">
<p class="reading-cell-label">Cell 20 · markdown</p>

## Export to CSV en route to Neo4j

</section>

<section class="reading-cell" id="cell-21" markdown="1">
<p class="reading-cell-label">Cell 21 · code</p>

<pre class="reading-code"><code>Projects=Projects.rename(columns={&quot;Agency Name&quot;: &quot;Agency_Name&quot;, &quot;Agency Code&quot;:&quot;Agency_Code&quot;,&#x27;Investment Title&#x27;:&#x27;Investment_Title&#x27;,&#x27;Unique Investment Identifier&#x27;:&#x27;Unique_Investment_Identifier&#x27;,&#x27;Project Name&#x27;:&#x27;Project_Name&#x27;,&#x27;Project ID&#x27;:&#x27;Project_ID&#x27;,&#x27;Start Date&#x27;:&#x27;Start_Date&#x27;, &#x27;Cost Variance ($ M)&#x27;:&#x27;Cost_Variance&#x27;,&#x27;Planned Cost ($ M)&#x27;:&#x27;PlannedCost&#x27;,&#x27;Updated Date&#x27;:&#x27;Updated_Date&#x27;,&#x27;Business Case ID&#x27;:&#x27;Business_Case_ID&#x27;})  </code></pre>

</section>

<section class="reading-cell" id="cell-22" markdown="1">
<p class="reading-cell-label">Cell 22 · code</p>

<pre class="reading-code"><code>Projects=Projects.dropna()</code></pre>

</section>

<section class="reading-cell" id="cell-23" markdown="1">
<p class="reading-cell-label">Cell 23 · code</p>

<pre class="reading-code"><code>Projects.to_csv(directory+&#x27;Health_Projects_Out.csv&#x27;, index=False)</code></pre>

</section>

<section class="reading-cell" id="cell-24" markdown="1">
<p class="reading-cell-label">Cell 24 · markdown</p>

#Cypher code for Neo4j
LOAD CSV WITH HEADERS FROM 'file:///Health_Projects_Out.csv' AS row
MERGE (m:Agency {name:row.Agency_Name,Code:row.Agency_Code})
MERGE (n:Investment {name:row.Investment_Title,Identifier:row.Unique_Investment_Identifier,Business_Case:row.Business_Case_ID})
MERGE (o:Project {name:row.Project_Name,Id:row.Project_ID,Cost_Variance:toFloat(row.Cost_Variance),Planned_Cost:toFloat(row.PlannedCost),Updated_Date:toInteger(row.Updated_Date),Planned_Duration:toInteger(row.Planned_Duration),Project_delay:toInteger(row.Project_delay),Start_days_after_2000:toInteger(row.Start_days_after_2000)})
MERGE (m)-[:invests]->(n)
MERGE (n)-[:pays_for]->(o)

</section>

<section class="reading-cell" id="cell-25" markdown="1">
<p class="reading-cell-label">Cell 25 · markdown</p>

# Pull in strategic investment information

</section>

<section class="reading-cell" id="cell-26" markdown="1">
<p class="reading-cell-label">Cell 26 · code</p>

<pre class="reading-code"><code>Strategy=pd.read_csv(directory+&#x27;Exhibit300A.csv&#x27;, encoding= &#x27;unicode_escape&#x27;)</code></pre>

</section>

<section class="reading-cell" id="cell-27" markdown="1">
<p class="reading-cell-label">Cell 27 · code</p>

<pre class="reading-code"><code>Strategy=Strategy.drop([&#x27;Investment Title (Exhibit 53)&#x27;,&#x27;Investment Title (Exhibit 300)&#x27;,&#x27;Date of Last Change to Activities&#x27;,&#x27;Date of Last Update to Activities&#x27;,&#x27;Date of Last Update to Activities&#x27;,&#x27;Date of Last Update to Activities&#x27;,&#x27;Date of Last Change to Contracts&#x27;,&#x27;Date of Last Change to Performance Metrics&#x27;,&#x27;Date of Last Tech Stat&#x27;,&#x27;Budget Year&#x27;,&#x27;Date of Last Investment Detail Update&#x27;,&#x27;Investment Auto Submission Date&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-28" markdown="1">
<p class="reading-cell-label">Cell 28 · code</p>

<pre class="reading-code"><code>Strategy=Strategy.drop([&#x27;Data Freshness&#x27;,&#x27;Date of Last Change to CIO Evaluation&#x27;,&#x27;Date of Last Update to CIO Evaluation&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-29" markdown="1">
<p class="reading-cell-label">Cell 29 · code</p>

<pre class="reading-code"><code>Strategy=Strategy.drop([&#x27;IPT Charter Date&#x27;,&#x27;Date Investment First Submitted&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-30" markdown="1">
<p class="reading-cell-label">Cell 30 · code</p>

<pre class="reading-code"><code>Strategy=Strategy.drop([&#x27;Business Case ID&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-31" markdown="1">
<p class="reading-cell-label">Cell 31 · code</p>

<pre class="reading-code"><code>Strategy=Strategy.drop([&#x27;CIO Evaluation Color&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-32" markdown="1">
<p class="reading-cell-label">Cell 32 · code</p>

<pre class="reading-code"><code>Strategy[&#x27;Date of Last Baseline&#x27;]=Strategy[&#x27;Date of Last Baseline&#x27;].astype(&#x27;datetime64&#x27;)</code></pre>

</section>

<section class="reading-cell" id="cell-33" markdown="1">
<p class="reading-cell-label">Cell 33 · code</p>

<pre class="reading-code"><code>#Strategy=Strategy.dropna()</code></pre>

</section>

<section class="reading-cell" id="cell-34" markdown="1">
<p class="reading-cell-label">Cell 34 · code</p>

<pre class="reading-code"><code>Strategy=Strategy.rename(columns={&#x27;Agency Name&#x27;:&#x27;Agency_Name&#x27;,&quot;Bureau Name&quot;: &quot;Bureau_Name&quot;,&#x27;Bureau Code&#x27;:&#x27;Bureau_Code&#x27;,&#x27;Number of changes to Baseline&#x27;:&#x27;Number_of_changes_to_Baseline&#x27;,&#x27;Evaluation (by Agency CIO)&#x27;:&#x27;Evalu)ation_by_CIO&quot;}&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-35" markdown="1">
<p class="reading-cell-label">Cell 35 · code</p>

<pre class="reading-code"><code>Strategy=Strategy.rename(columns={&#x27;Evalu)ation_by_CIO&quot;}&#x27;:&#x27;Evaluation_by_CIO&#x27;,&#x27;Date of Last Baseline&#x27;:&#x27;Date_Last_Baseline&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-36" markdown="1">
<p class="reading-cell-label">Cell 36 · code</p>

<pre class="reading-code"><code>Constraint=Strategy[&#x27;Agency Code&#x27;]==9</code></pre>

</section>

<section class="reading-cell" id="cell-37" markdown="1">
<p class="reading-cell-label">Cell 37 · code</p>

<pre class="reading-code"><code>Strategy=Strategy[Constraint]</code></pre>

</section>

<section class="reading-cell" id="cell-38" markdown="1">
<p class="reading-cell-label">Cell 38 · markdown</p>

## Work out Data Structure as you go. 
## This results in the following Cypher code to be placed into Neo4j
LOAD CSV WITH HEADERS FROM 'file:///Health_Strategy_Out.csv' AS row 
MERGE (m:Agency {Code:row.Agency_Code})
MERGE (o:Bureau {Code:row.Bureau_Code,Name:row.Bureau_Name})
MERGE (n:Investment {Identifier:row.Unique_Investment_Identifier})
CREATE (m)-[:owns]->(o)
CREATE (o)-[:responsible_for]->(n)
SET n.Summary=row.Brief_Summary
SET n.Performance_Gap=row.Summary_of_Performance_Gap
SET n.Evaluation_by_CIO=row.Evaluation_by_CIO
SET n.Changes_to_Baseline=row.Number_of_changes_to_Baseline
SET n.Last_Baseline=row.Date_Last_Baseline

LOAD CSV WITH HEADERS FROM 'file:///Health_Strategy_Out.csv' AS row 
MATCH (m:Agency {Code:row.Agency_Code})
SET m.name = row.Agency_Name
RETURN m

"MERGE matches on the entire pattern you specify within a single clause...The solution is to MERGE on the unique property and then use SET to update additional properties.

</section>

<section class="reading-cell" id="cell-39" markdown="1">
<p class="reading-cell-label">Cell 39 · code</p>

<pre class="reading-code"><code></code></pre>

</section>

<section class="reading-cell" id="cell-40" markdown="1">
<p class="reading-cell-label">Cell 40 · code</p>

<pre class="reading-code"><code>Strategy=Strategy.rename(columns={&#x27;Unique Investment Identifier&#x27;:&#x27;Unique_Investment_Identifier&#x27;,&#x27;Brief Summary&#x27;:&#x27;Brief_Summary&#x27;,
&#x27;Summary of Performance Gap&#x27;:&#x27;Summary_of_Performance_Gap&#x27;,&#x27;Agency Code&#x27;:&#x27;Agency_Code&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-41" markdown="1">
<p class="reading-cell-label">Cell 41 · code</p>

<pre class="reading-code"><code>Strategy.to_csv(directory+&#x27;Health_Strategy_Out.csv&#x27;, index=False)</code></pre>

</section>

<section class="reading-cell" id="cell-42" markdown="1">
<p class="reading-cell-label">Cell 42 · markdown</p>

# Bring in Contracts file

</section>

<section class="reading-cell" id="cell-43" markdown="1">
<p class="reading-cell-label">Cell 43 · code</p>

<pre class="reading-code"><code>Contracts=pd.read_csv(directory+&#x27;Contracts.csv&#x27;, encoding= &#x27;unicode_escape&#x27;)</code></pre>

</section>

<section class="reading-cell" id="cell-44" markdown="1">
<p class="reading-cell-label">Cell 44 · code</p>

<pre class="reading-code"><code>Constraint=Contracts[&#x27;Agency Code&#x27;]==9</code></pre>

</section>

<section class="reading-cell" id="cell-45" markdown="1">
<p class="reading-cell-label">Cell 45 · code</p>

<pre class="reading-code"><code>Contracts=Contracts[Constraint]</code></pre>

</section>

<section class="reading-cell" id="cell-46" markdown="1">
<p class="reading-cell-label">Cell 46 · code</p>

<pre class="reading-code"><code>Contracts=Contracts.drop([&#x27;Business Case ID&#x27;,&#x27;Agency Code&#x27;,&#x27;Agency Name&#x27;,&#x27;Investment Title&#x27;,&#x27;Agency Contract ID&#x27;,&#x27;Contract Status&#x27;,&#x27;Contracting Agency ID&#x27;,&#x27;Contract Number (PIID)&#x27;,&#x27;Performance Based Contract (USAspending)&#x27;,&#x27;Contract Start Date (USAspending)&#x27;,&#x27;Contract End Date (USAspending)&#x27;,&#x27;Contract Compete (USAspending)&#x27;,&#x27;Base Contract ID (USAspending)&#x27;
        ,&#x27;Identifying Agency ID (USAspending)&#x27;,&#x27;Transaction Number (USAspending)&#x27;,&#x27;Timestamp (Base Contract)&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-47" markdown="1">
<p class="reading-cell-label">Cell 47 · code</p>

<pre class="reading-code"><code>Contracts=Contracts.drop([&#x27;IDV Agency ID&#x27;,&#x27;Match found in USAspending&#x27;,&#x27;Solicitation ID (USAspending)&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-48" markdown="1">
<p class="reading-cell-label">Cell 48 · code</p>

<pre class="reading-code"><code>Contracts=Contracts.rename(columns={&#x27;Unique Investment Identifier&#x27;:&#x27;Unique_Investment_Identifier&#x27;,&#x27;Contract ID&#x27;:&#x27;Contract_ID&#x27;,&#x27;IDV PIID&#x27;:&#x27;IDV_PIID&#x27;,&#x27;Vendor Name (USAspending)&#x27;:&#x27;Vendor_name&#x27;,&#x27;Action Obligation Amount (In $ million) (USAspending)&#x27;:&#x27;Contract_size&#x27;,&#x27;Contract Description (USAspending)&#x27;:&#x27;Contract_Description&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-49" markdown="1">
<p class="reading-cell-label">Cell 49 · markdown</p>

## Work out Data Structure as you go. 
## This results in the following Cypher code to be placed into Neo4j

</section>

<section class="reading-cell" id="cell-50" markdown="1">
<p class="reading-cell-label">Cell 50 · code</p>

<pre class="reading-code"><code>Contracts=Contracts.dropna()</code></pre>

</section>

<section class="reading-cell" id="cell-51" markdown="1">
<p class="reading-cell-label">Cell 51 · code</p>

<pre class="reading-code"><code>Contracts.to_csv(directory+&#x27;Health_Contracts_Out.csv&#x27;, index=False)</code></pre>

</section>

<section class="reading-cell" id="cell-52" markdown="1">
<p class="reading-cell-label">Cell 52 · markdown</p>

LOAD CSV WITH HEADERS FROM 'file:///Health_Contracts_Out.csv' AS row 
MERGE (m:Contract {ID:row.Contract_ID})
MERGE (n:Investment {Identifier:row.Unique_Investment_Identifier})
MERGE (o:Supplier {ID:row.IDV_PIID})
SET m.Description=row.Contract_Description
SET m.Contract_size=row.Contract_size
SET o.name=row.Vendor_name
CREATE (n)-[:lets_contract]->(m)
CREATE (n)-[:uses_Supplier]->(o)
CREATE (o)-[:delivers]->(m)


</section>

<section class="reading-cell" id="cell-53" markdown="1">
<p class="reading-cell-label">Cell 53 · markdown</p>

# Bring in Metrics file

</section>

<section class="reading-cell" id="cell-54" markdown="1">
<p class="reading-cell-label">Cell 54 · code</p>

<pre class="reading-code"><code>Metrics=pd.read_csv(directory+&#x27;Performance_Metrics.csv&#x27;, encoding= &#x27;unicode_escape&#x27;)</code></pre>

</section>

<section class="reading-cell" id="cell-55" markdown="1">
<p class="reading-cell-label">Cell 55 · code</p>

<pre class="reading-code"><code>Metrics=Metrics.drop([&#x27;Business Case ID&#x27;,&#x27;Agency Name&#x27;,&#x27;Agency Performance Metric ID&#x27;,&#x27;Comment&#x27;,&#x27;Updated Date&#x27;,&#x27;Updated Time&#x27;,&#x27;Reporting Frequency&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-56" markdown="1">
<p class="reading-cell-label">Cell 56 · code</p>

<pre class="reading-code"><code>Metrics=Metrics.drop([&#x27;Target for PY&#x27;,&#x27;Actual for PY&#x27;,&#x27;Most Recent Actual Results&#x27;,&#x27;Measurement Condition&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-57" markdown="1">
<p class="reading-cell-label">Cell 57 · code</p>

<pre class="reading-code"><code>Metrics=Metrics.rename(columns={&#x27;Unique Investment Identifier&#x27;:&#x27;Unique_Investment_Identifier&#x27;,&#x27;Performance Metric ID&#x27;:&#x27;Performance_Metric_ID&#x27;,&#x27;Metric Description&#x27;:&#x27;Metric_Description&#x27;,&#x27;Unit of Measure&#x27;:&#x27;Unit_of_Measure&#x27;,&#x27;FEA Performance Measurement Category Mapping&#x27;:&#x27;Measurement_category&#x27;,&#x27;Actuals have Met/Not Met Target&#x27;:&#x27;Metric_results&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-58" markdown="1">
<p class="reading-cell-label">Cell 58 · code</p>

<pre class="reading-code"><code>#Metrics=Metrics.dropna()</code></pre>

</section>

<section class="reading-cell" id="cell-59" markdown="1">
<p class="reading-cell-label">Cell 59 · code</p>

<pre class="reading-code"><code>Constraint=Metrics[&#x27;Agency Code&#x27;]==9</code></pre>

</section>

<section class="reading-cell" id="cell-60" markdown="1">
<p class="reading-cell-label">Cell 60 · code</p>

<pre class="reading-code"><code>Metrics=Metrics[Constraint]</code></pre>

</section>

<section class="reading-cell" id="cell-61" markdown="1">
<p class="reading-cell-label">Cell 61 · code</p>

<pre class="reading-code"><code>Metrics.to_csv(directory+&#x27;Health_Metrics_Out.csv&#x27;, index=False)</code></pre>

</section>

<section class="reading-cell" id="cell-62" markdown="1">
<p class="reading-cell-label">Cell 62 · markdown</p>

from this, we know that Metric ID is unique
constraint=(Metrics.duplicated(subset='Performance_Metric_ID', keep=False))==True
Metrics[constraint]

</section>

<section class="reading-cell" id="cell-63" markdown="1">
<p class="reading-cell-label">Cell 63 · markdown</p>

## Work out Data Structure as you go. 
## This results in the following Cypher code to be placed into Neo4j
LOAD CSV WITH HEADERS FROM 'file:///Health_Metrics_Out.csv' AS row 
MERGE (m:Metric {ID:row.Performance_Metric_ID})
MERGE (n:Investment {Identifier:row.Unique_Investment_Identifier})
SET m.Description=row.Metric_Description
SET m.Measurement_category=row.Measurement_category
SET m.Metric_results=row.Metric_results
MERGE (n)-[:judged_by]->(m)

</section>

<section class="reading-cell" id="cell-64" markdown="1">
<p class="reading-cell-label">Cell 64 · markdown</p>

# Bring in Business Mapping

</section>

<section class="reading-cell" id="cell-65" markdown="1">
<p class="reading-cell-label">Cell 65 · code</p>

<pre class="reading-code"><code>Mapping=pd.read_csv(directory+&#x27;Exhibit53.csv&#x27;, encoding= &#x27;unicode_escape&#x27;)</code></pre>

</section>

<section class="reading-cell" id="cell-66" markdown="1">
<p class="reading-cell-label">Cell 66 · code</p>

<pre class="reading-code"><code>Constraint=Mapping[&#x27;Agency Code&#x27;]==9</code></pre>

</section>

<section class="reading-cell" id="cell-67" markdown="1">
<p class="reading-cell-label">Cell 67 · code</p>

<pre class="reading-code"><code>Mapping=Mapping[Constraint]</code></pre>

</section>

<section class="reading-cell" id="cell-68" markdown="1">
<p class="reading-cell-label">Cell 68 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.drop([&#x27;Agency Code&#x27;,&#x27;Agency Name&#x27;,&#x27;Previous UPI&#x27;,&#x27;Investment Category&#x27;,&#x27;Bureau Code&#x27;,&#x27;Bureau Name&#x27;,&#x27;Part of Exhibit 53&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-69" markdown="1">
<p class="reading-cell-label">Cell 69 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.drop([&#x27;Mission Delivery And Management Support Area&#x27;,&#x27;Line Item Descriptor&#x27;,&#x27;Investment Title&#x27;,&#x27;Investment Description&#x27;,&#x27;Updated Date&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-70" markdown="1">
<p class="reading-cell-label">Cell 70 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.drop([&#x27;Budget Year&#x27;,&#x27;XML Request ID&#x27;,&#x27;Updated Time&#x27;,&#x27;O&amp;M BY Contributions ($ M)&#x27;,&#x27;O&amp;M BY Agency Funding ($ M)&#x27;,&#x27;O&amp;M CY Contributions ($ M)&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-71" markdown="1">
<p class="reading-cell-label">Cell 71 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.drop([&#x27;O&amp;M CY Agency Funding ($ M)&#x27;,&#x27;O&amp;M PY Contributions ($ M)&#x27;,&#x27;O&amp;M PY Agency Funding ($ M)&#x27;,&#x27;DME BY Contributions ($ M)&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-72" markdown="1">
<p class="reading-cell-label">Cell 72 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.drop([&#x27;Segment Architecture - Agency Segment&#x27;,&#x27;Total IT Spending FY2011 (PY) ($ M)&#x27;,&#x27;Total IT Spending FY2012 (CY) ($ M)&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-73" markdown="1">
<p class="reading-cell-label">Cell 73 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.drop([&#x27;DME PY Contributions ($ M)&#x27;,&#x27;DME CY Contributions ($ M)&#x27;,&#x27;DME BY Agency Funding ($ M)&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-74" markdown="1">
<p class="reading-cell-label">Cell 74 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.rename(columns={&#x27;Unique Investment Identifier&#x27;:&#x27;Unique_Investment_Identifier&#x27;,&#x27;Type of Investment&#x27;:&#x27;Investment_type&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-75" markdown="1">
<p class="reading-cell-label">Cell 75 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.rename(columns={&#x27;FEA BRM Mapping - Sub-Function&#x27;:&#x27;Sub-Function&#x27;,&#x27;FEA BRM Mapping - Primary Function&#x27;:&#x27;Function&#x27;,&#x27;FEA BRM Mapping - Business Area&#x27;:&#x27;Business_Area&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-76" markdown="1">
<p class="reading-cell-label">Cell 76 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.rename(columns={&#x27;Service Code Mapping - Component&#x27;:&#x27;Service_Component&#x27;,&#x27;Service Code Mapping - Primary Function&#x27;:&#x27;Service&#x27;,&#x27;Function&#x27;:&#x27;Business Function&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-77" markdown="1">
<p class="reading-cell-label">Cell 77 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.rename(columns={&#x27;Service Code Mapping - Business Area&#x27;:&#x27;Service Area&#x27;,&#x27;Segment Architecture - Federal Standard Segment&#x27;:&#x27;Architecture_code&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-78" markdown="1">
<p class="reading-cell-label">Cell 78 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.drop([&#x27;Total IT Spending FY2013 (BY) ($ M)&#x27;,&#x27;DME PY Agency Funding ($ M)&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-79" markdown="1">
<p class="reading-cell-label">Cell 79 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.rename(columns={&#x27;DME CY Agency Funding ($ M)&#x27;:&#x27;Enhancement_spend_$m&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-80" markdown="1">
<p class="reading-cell-label">Cell 80 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.rename(columns={&#x27;Enhancement_spend_$M)&#x27;:&#x27;Enhancement_spend_$m&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-81" markdown="1">
<p class="reading-cell-label">Cell 81 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.rename(columns={&#x27;Service Area&#x27;:&#x27;Service_Area&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-82" markdown="1">
<p class="reading-cell-label">Cell 82 · code</p>

<pre class="reading-code"><code>Mapping=Mapping.rename(columns={&#x27;Business Function&#x27;:&#x27;Business_Function&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-83" markdown="1">
<p class="reading-cell-label">Cell 83 · code</p>

<pre class="reading-code"><code>#Mapping=Mapping.dropna()</code></pre>

</section>

<section class="reading-cell" id="cell-84" markdown="1">
<p class="reading-cell-label">Cell 84 · code</p>

<pre class="reading-code"><code>Mapping.to_csv(directory+&#x27;Health_Mapping_Out.csv&#x27;, index=False)</code></pre>

</section>

<section class="reading-cell" id="cell-85" markdown="1">
<p class="reading-cell-label">Cell 85 · markdown</p>

## Code for Neo4j
LOAD CSV WITH HEADERS FROM 'file:///Health_Mapping_Out.csv' AS row 
MERGE (n:Investment {Identifier:row.Unique_Investment_Identifier})
SET n.Enhancement_spend_$m=toFloat(row.Enhancement_spend_$m)
MERGE (o:Service {name:row.Service})
MERGE (p:Business_Area {name:row.Business_Area})
MERGE (q:Business_Function {name:row.Business_Function})
SET n.Investment_type=row.Investment_type
MERGE (n)-[:has_business_function]->(q)
MERGE (q)-[:serves]->(p)
MERGE (n)-[:is_a_type_of]->(o)

</section>

<section class="reading-cell" id="cell-86" markdown="1">
<p class="reading-cell-label">Cell 86 · markdown</p>

# Bring in activities

</section>

<section class="reading-cell" id="cell-87" markdown="1">
<p class="reading-cell-label">Cell 87 · code</p>

<pre class="reading-code"><code>Activities=pd.read_csv(directory+&#x27;Activities.csv&#x27;, encoding= &#x27;unicode_escape&#x27;)</code></pre>

</section>

<section class="reading-cell" id="cell-88" markdown="1">
<p class="reading-cell-label">Cell 88 · code</p>

<pre class="reading-code"><code>Activities=Activities.drop([&#x27;Agency Name&#x27;,&#x27;Business Case ID&#x27;,&#x27;Investment Title&#x27;,&#x27;Date of Last Change&#x27;,&#x27;Baseline ID&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-89" markdown="1">
<p class="reading-cell-label">Cell 89 · code</p>

<pre class="reading-code"><code>Activities=Activities.drop([&#x27;Cost Variance&#x27;,&#x27;Cost Variance Percent&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-90" markdown="1">
<p class="reading-cell-label">Cell 90 · code</p>

<pre class="reading-code"><code># Cost Variance and Cost % are unreliable: they give different signs, so dropped</code></pre>

</section>

<section class="reading-cell" id="cell-91" markdown="1">
<p class="reading-cell-label">Cell 91 · code</p>

<pre class="reading-code"><code>Activities=Activities.drop([&#x27;Structure ID&#x27;,&#x27;Schedule Variance (in days)&#x27;,&#x27;Schedule Variance Percent&#x27;,&#x27;Schedule Duration (in days)&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-92" markdown="1">
<p class="reading-cell-label">Cell 92 · code</p>

<pre class="reading-code"><code>Constraint=Activities[&#x27;Agency Code&#x27;]==9</code></pre>

</section>

<section class="reading-cell" id="cell-93" markdown="1">
<p class="reading-cell-label">Cell 93 · code</p>

<pre class="reading-code"><code>Activities=Activities[Constraint]</code></pre>

</section>

<section class="reading-cell" id="cell-94" markdown="1">
<p class="reading-cell-label">Cell 94 · code</p>

<pre class="reading-code"><code>Activities=Activities.dropna(subset=[&#x27;Unique Investment Identifier&#x27;,&#x27;Agency Code&#x27;,&#x27;Agency Activity ID&#x27;,&#x27;Project ID&#x27;,&#x27;Activity Name&#x27;,&#x27;Start Date Planned&#x27;,&#x27;Completion Date Planned&#x27;,
                                     &#x27;Total Costs Planned&#x27;,&#x27;Activity Status&#x27;,&#x27;Has No Child Activity&#x27;,&#x27;Date of Last Update&#x27;,&#x27;Unique Activity ID&#x27;])</code></pre>

</section>

<section class="reading-cell" id="cell-95" markdown="1">
<p class="reading-cell-label">Cell 95 · code</p>

<pre class="reading-code"><code>Activities=Activities.drop([&#x27;Agency Activity ID&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-96" markdown="1">
<p class="reading-cell-label">Cell 96 · code</p>

<pre class="reading-code"><code>Activities[&#x27;Start Date Planned&#x27;] = pd.to_datetime(Activities[&#x27;Start Date Planned&#x27;])
Activities[&#x27;Start Date Projected&#x27;] = pd.to_datetime(Activities[&#x27;Start Date Projected&#x27;])
Activities[&#x27;Start Date Actual&#x27;] = pd.to_datetime(Activities[&#x27;Start Date Actual&#x27;])
Activities[&#x27;Completion Date Planned&#x27;] = pd.to_datetime(Activities[&#x27;Completion Date Planned&#x27;])
Activities[&#x27;Completion Date Projected&#x27;] = pd.to_datetime(Activities[&#x27;Completion Date Projected&#x27;])
Activities[&#x27;Completion Date Actual&#x27;] = pd.to_datetime(Activities[&#x27;Completion Date Actual&#x27;])</code></pre>

</section>

<section class="reading-cell" id="cell-97" markdown="1">
<p class="reading-cell-label">Cell 97 · code</p>

<pre class="reading-code"><code>Activities[&#x27;Planned_Duration&#x27;]=np.subtract(Activities[&#x27;Completion Date Planned&#x27;],Activities[&#x27;Start Date Planned&#x27;])</code></pre>

</section>

<section class="reading-cell" id="cell-98" markdown="1">
<p class="reading-cell-label">Cell 98 · code</p>

<pre class="reading-code"><code>Activities=Activities.drop(&#x27;Completion Date Planned&#x27;,axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-99" markdown="1">
<p class="reading-cell-label">Cell 99 · code</p>

<pre class="reading-code"><code>Activities[&#x27;Actual_duration&#x27;]=np.subtract(Activities[&#x27;Completion Date Actual&#x27;],Activities[&#x27;Start Date Actual&#x27;])
Activities[&#x27;Actual_start_delay&#x27;]=np.subtract(Activities[&#x27;Start Date Actual&#x27;],Activities[&#x27;Start Date Planned&#x27;])</code></pre>

</section>

<section class="reading-cell" id="cell-100" markdown="1">
<p class="reading-cell-label">Cell 100 · code</p>

<pre class="reading-code"><code>Activities=Activities.drop([&#x27;Start Date Actual&#x27;,&#x27;Completion Date Actual&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-101" markdown="1">
<p class="reading-cell-label">Cell 101 · code</p>

<pre class="reading-code"><code>Activities=Activities.rename(columns={&#x27;Unique Investment Identifier&#x27;:&#x27;Unique_Investment_Identifier&#x27;,&#x27;Project ID&#x27;:&#x27;Project_ID&#x27;,&#x27;Activity Name&#x27;:&#x27;Activity_Name&#x27;,&#x27;Activity Description&#x27;:&#x27;Activity Description&#x27;,&#x27;Key Deliverable / Usable Functionality&#x27;:&#x27;Output_type&#x27;,&#x27;Start Date Planned&#x27;:&#x27;Start Date Planned&#x27;,&#x27;Total Costs Planned&#x27;:&#x27;Planned_Costs&#x27;,&#x27;Activity Status&#x27;:&#x27;Status&#x27;,&#x27;Has No Child Activity&#x27;:&#x27;No_Child_Activity&#x27;,&#x27;Unique Activity ID&#x27;:&#x27;ID&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-102" markdown="1">
<p class="reading-cell-label">Cell 102 · code</p>

<pre class="reading-code"><code>Activities=Activities.drop([&#x27;Unique_Investment_Identifier&#x27;,&#x27;Agency Code&#x27;,&#x27;Start Date Projected&#x27;,&#x27;Start Date Projected&#x27;],axis=1)</code></pre>

</section>

<section class="reading-cell" id="cell-103" markdown="1">
<p class="reading-cell-label">Cell 103 · code</p>

<pre class="reading-code"><code>Activities=Activities.rename(columns={&#x27;Activity Description&#x27;:&#x27;Description&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-104" markdown="1">
<p class="reading-cell-label">Cell 104 · code</p>

<pre class="reading-code"><code>Activities=Activities.rename(columns={&#x27;Start Date Planned&#x27;:&#x27;Start_Date_Planned&#x27;})</code></pre>

</section>

<section class="reading-cell" id="cell-105" markdown="1">
<p class="reading-cell-label">Cell 105 · markdown</p>

## Code for Neo4j
LOAD CSV WITH HEADERS FROM 'file:///Health_Activities_Out.csv' AS row 
MERGE (n:Project {Id:row.Project_ID})
MERGE (o:Activity {Id:row.ID})
SET o.name=row.Activity_Name
SET o.description=row.Description
SET o.output_type=row.Output_type
SET o.planned_Costs=row.Planned_Costs
SET o.status=row.Status
SET o.No_Child_Activity=row.No_Child_Activity
SET o.Planned_Duration=row.Planned_Duration
SET o.Actual_duration=row.Actual_duration
SET o.Actual_start_delay=row.Actual_start_delay
SET o.Start_Date_Planned=row.Start_Date_Planned
MERGE (n)-[:has_task]->(o)

# This is the additional code to take subgraph, as a query, to export Cypher code, say for populating a Sandbox
CALL apoc.export.cypher.query(
"MATCH (n:Bureau)-[a]-(o:Investment)-[b]-(p:Project)-[c]-(q:Activity),(o)-[d]-(r:Service),(o)-[e]-(s:Business_Function)-[f]-(t:Business_Area),(o)-[g]-(u:Metric),(o)-[h]-(v:Agency) WHERE n.Name='Small Business Administration' OR  RETURN *","export.cypher",{});

</section>

<section class="reading-cell" id="cell-106" markdown="1">
<p class="reading-cell-label">Cell 106 · code</p>

<pre class="reading-code"><code>Activities.to_csv(directory+&#x27;Health_Activities_Out.csv&#x27;, index=False)</code></pre>

</section>

{% endraw %}
