---
layout: default
title: "Solution selector example 1.dot"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/library/models/us-portfolio-questions.html">← Return to the example</a> · <a href="/library/sources/us-portfolio/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> September–October 2020 demonstration, with the later reading notes and limitations retained. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/us-portfolio/files/Example_0_a_thousand_US_projects/images1/Solution_selector_example_1.dot.txt" download="Solution_selector_example_1.dot.txt">Download original file</a> · <a href="https://github.com/lawrencerowland/Data-models-for-portfolios/blob/01b04839ec24fbff82ffd3ec33fb0de125eacb2c/Example_0_a_thousand_US_projects/images1/Solution_selector_example_1.dot.txt">GitHub source at 01b0483 (may require access)</a></p></aside>
</div>

{% raw %}
# Solution selector example 1.dot

<pre class="reading-code"><code># http://www.graphviz.org/content/cluster

digraph G {
    bgcolor = transparent
  subgraph cluster_0 {
     Re_engineer; Accountability_overlay; Up_and_running;
    label = &quot;*Aspiration*&quot;;
  }
  subgraph cluster_1 {
    Complicated;Partial_framework; Tidy_silos:New_or_ad_hoc;
    label = &quot;*Data_&amp;_Accountability_landscape*&quot;;
  }
  
    subgraph cluster_3 {
    Corporate ;SME; small
    label = &quot;*Size*&quot;;
  }
  subgraph cluster_4 {
    node [style=filled];
    Drive_change ;Balanced; Iterate
    label = &quot;*Approach*&quot;;
  }
  subgraph cluster_9 {
    node [style=filled];
    Data_tool-&gt;Database-&gt;Final_Database-&gt;Visuals_and_Analytics;
    label = &quot;*Tool_choice*&quot;;
  }
  subgraph cluster_10 {
    node [style=filled];
    Excel-&gt;Graph_DB-&gt;SQL-&gt;PowerBI;
    label = &quot;*Tool_selected*&quot;;
  }
  Select_with_client -&gt; Up_and_running;
  Up_and_running -&gt;Tidy_silos;
  Tidy_silos-&gt; small;
  small-&gt;Balanced;
  Balanced-&gt;Data_tool;
  Balanced -&gt;Excel;
}</code></pre>

{% endraw %}
