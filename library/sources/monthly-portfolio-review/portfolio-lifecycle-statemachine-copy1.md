---
layout: default
title: "Portfolio lifecycle statemachine-Copy1"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/ML-for-portfolios.html#monthly-portfolio-decisions">← Return to the example</a> · <a href="/library/sources/monthly-portfolio-review/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> December 2020 notes and two contrasting, unfinished random-policy notebooks, with their known defects explained. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/monthly-portfolio-review/files/Portfolio_lifecycle_statemachine-Copy1.ipynb" download="Portfolio_lifecycle_statemachine-Copy1.ipynb">Download original notebook</a> · <a href="https://github.com/lawrencerowland/Project_decisions/blob/19ae5453398e0387aef72657d868d05160d0870a/Portfolio_lifecycle_statemachine-Copy1.ipynb">GitHub source at 19ae545 (may require access)</a></p></aside>
</div>

{% raw %}
# Portfolio lifecycle statemachine-Copy1

Saved notebook · 8 cells. Code and outputs below are retained from the original; **nothing was executed for this reading copy**. Environment dependencies, missing data and the model limitations remain as described in the linked guide.

<section class="reading-cell" id="cell-1" markdown="1">
<p class="reading-cell-label">Cell 1 · code</p>

<pre class="reading-code"><code>import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import random
import weakref</code></pre>

</section>

<section class="reading-cell" id="cell-2" markdown="1">
<p class="reading-cell-label">Cell 2 · code</p>

<pre class="reading-code"><code>class Projects:
    
    _instances=set()
    
    def __init__(self,number,name,state,reward):
        self.number=number
        self.name=name
        self.state=state
        self.reward=reward
        self._instances.add(weakref.ref(self))
        
    @classmethod
    def getinstances(cls):
        for i in cls._instances:
            yield i()</code></pre>

</section>

<section class="reading-cell" id="cell-3" markdown="1">
<p class="reading-cell-label">Cell 3 · code</p>

<pre class="reading-code"><code>p1=Projects(1,&#x27;DT&#x27;,&#x27;Proposal&#x27;,0)
p2=Projects(2,&#x27;Covid_plan&#x27;,&#x27;Business_Case&#x27;,0)
# https://www.codegrepper.com/code-examples/python/how+to+get+a+list+of+all+instances+of+a+class+in+python</code></pre>

</section>

<section class="reading-cell" id="cell-4" markdown="1">
<p class="reading-cell-label">Cell 4 · code</p>

<pre class="reading-code"><code># W and S&#x27;: Reward and State transition
def step(state,action):
    
    if action == &#x27;promote&#x27;:
        if state == &#x27;Proposal&#x27;:
            return &#x27;Business_Case&#x27;, -2
        if state == &#x27;Business_Case&#x27;:
            return &#x27;Project_planned&#x27;, -5
        if state == &#x27;Project_planned&#x27;:
            return &#x27;Project_started&#x27;, -2
        if state == &#x27;Project_started&#x27;:
            return &#x27;Project_complete&#x27;,50
        
    if state == &#x27;Project_cancelled&#x27;:
        return &#x27;Project_cancelled&#x27;,0
    
    if state == &#x27;Project_complete&#x27;:
        return &#x27;Project_complete&#x27;, 0

    if action == &#x27;maintain&#x27;:
        if state == &#x27;Proposal&#x27;:
            return &quot;Proposal&quot;, -2
        if state == &#x27;Business_Case&#x27;:
            return &#x27;Business_Case&#x27;, -2
        if state == &#x27;Project_planned&#x27;:
            return &#x27;Project_planned&#x27;,-2
        if state == &#x27;Project_started&#x27;:
            return &#x27;Project_started&#x27;,-15
    
    if action==&#x27;cancel&#x27;:
        if state == &#x27;Proposal&#x27;:
            return &#x27;Project_cancelled&#x27;, -2
        if state == &#x27;Business_Case&#x27;:
            return &#x27;Project_cancelled&#x27;,-5
        if state == &#x27;Project_planned&#x27;:
            return &#x27;Project_cancelled&#x27;, -10
        if state == &#x27;Project_started&#x27;:
            return &#x27;Project_cancelled&#x27;,-20</code></pre>

</section>

<section class="reading-cell" id="cell-5" markdown="1">
<p class="reading-cell-label">Cell 5 · code</p>

<pre class="reading-code"><code># x Decision selection
Action_options=[&#x27;cancel&#x27;,&#x27;maintain&#x27;,&#x27;promote&#x27;]</code></pre>

</section>

<section class="reading-cell" id="cell-6" markdown="1">
<p class="reading-cell-label">Cell 6 · code</p>

<pre class="reading-code"><code>#Simulation of multiple trials
success=0
#for trial in range (1,2):
    
for p in Projects.getinstances():
    
    #state 0 decision
    state=p.state
    total_rewards=0
    
    for s in range(0,5):
        # state s action
        action=Action_options[random.randint(0,2)]

        # state s+1
        next_step=step(state,action)
        next_state, this_reward = next_step
        print (&#x27;project &#x27;,p.number, &#x27;step &#x27;, s,next_step)
        
        #update project
        p.state=next_state
        p.reward+=this_reward
        
        if next_state==&#x27;Project_complete&#x27;:
            success+=1
            break</code></pre>

<details class="reading-output"><summary>Saved output</summary>
<pre>project  1 step  0 (&#x27;Business_Case&#x27;, -2)
project  1 step  1 (&#x27;Business_Case&#x27;, -2)
project  1 step  2 (&#x27;Project_cancelled&#x27;, -2)
project  1 step  3 (&#x27;Proposal&#x27;, -2)
project  1 step  4 (&#x27;Project_cancelled&#x27;, -2)
project  2 step  0 (&#x27;Business_Case&#x27;, -2)
project  2 step  1 (&#x27;Project_cancelled&#x27;, -5)
project  2 step  2 (&#x27;Business_Case&#x27;, -2)
project  2 step  3 (&#x27;Project_cancelled&#x27;, -5)
project  2 step  4 (&#x27;Project_planned&#x27;, -5)
</pre>
</details>

</section>

<section class="reading-cell" id="cell-7" markdown="1">
<p class="reading-cell-label">Cell 7 · code</p>

<pre class="reading-code"><code>#Washup
for p in Projects.getinstances():
    print (p.name, p.state, p.reward )</code></pre>

<details class="reading-output"><summary>Saved output</summary>
<pre>DT Project_cancelled -10
Covid_plan Project_planned -19
</pre>
</details>

</section>

<section class="reading-cell" id="cell-8" markdown="1">
<p class="reading-cell-label">Cell 8 · code</p>

<pre class="reading-code"><code></code></pre>

</section>

{% endraw %}
