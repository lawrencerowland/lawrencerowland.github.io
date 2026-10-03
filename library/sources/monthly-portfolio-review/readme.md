---
layout: default
title: "The monthly portfolio review"
schema_type: TechArticle
public_reading: true
---

<div class="public-reading">
<p class="reading-return"><a href="/ML-for-portfolios.html#monthly-portfolio-decisions">← Return to the example</a> · <a href="/library/sources/monthly-portfolio-review/">Supporting files</a></p>
<aside class="reading-provenance"><p><strong>Public reading copy · captured 3 October 2026.</strong> December 2020 notes and two contrasting, unfinished random-policy notebooks, with their known defects explained. Original wording and saved results are retained; relative links are adapted for this site. This copy does not update itself when the source changes. Links to GitHub may require repository access.</p>
<p><a href="/library/sources/monthly-portfolio-review/files/README.md.txt" download="README.md">Download original file</a> · <a href="https://github.com/lawrencerowland/Project_decisions/blob/19ae5453398e0387aef72657d868d05160d0870a/README.md">GitHub source at 19ae545 (may require access)</a></p></aside>
</div>

{% raw %}
# The monthly portfolio review

**An unfinished exploration by Lawrence Rowland, December 2020. Reading guide added 1 October 2026.**

What should a portfolio review decide this month, and what should it learn before deciding again? The original note considers advancing, suspending or cancelling projects alongside investigating, reviewing and assuring them. It asks whether the information arriving between meetings is good enough, and whether the decision cadence fits that information.

![At this review, state S zero informs decision x zero. Progress and new information W one lead into next month's updated state S one and decision x one.](/images/visual-explorer/monthly-decisions.svg)

*This 2026 reading diagram interprets the note's sequence. The notebooks do not implement the incoming-information or assurance parts of that idea.*

[Read the original December 2020 note](/library/sources/monthly-portfolio-review/2020-12-reinforcement-learning-for-project-portfolios.html) · [Methods guide](https://lawrencerowland.github.io/ML-for-portfolios.html#monthly-portfolio-decisions) · [Library](https://lawrencerowland.github.io/library.html#library-methods)

## What is worth recovering?

The note starts with two useful alternatives: **what decisions can we make?** and **what are we trying to achieve?** It then connects today's decision with tomorrow's information and the next decision. Three distinctions matter:

- **Changing the work and learning about it.** Advancing or cancelling a project changes the commitment. Investigation or assurance may change what the decision-maker knows. The note puts these choices beside one another without yet modelling how information is obtained or used.
- **A sequence, rather than one isolated choice.** State `S` describes the position at a decision point, `x` the decision, and `W` new information arriving afterwards. A transition describes how the next state depends on what happened. These are prompts for defining a model, not a completed model specification.
- **A good immediate score and a good longer-term outcome.** The note asks about objectives, costs and benefits over time. Those headings are largely unfinished; the notebooks use supplied numerical rewards instead of establishing a portfolio objective.

The original note also asks whether information is gathered effectively, decisions are made promptly, and reviews occur at a useful frequency. Its OODA comparison and possible outputs—a meeting procedure, decision checklist and decision tables—are ideas to inspect, not delivered products or a prescribed next research agenda.

## What the notebooks actually do

Both use the same broad lifecycle:

**Proposal → Business case → Planned → Started → Complete**, with cancellation as an alternative terminal state.

The chosen actions are **promote, maintain and cancel**. Their effects and rewards are supplied by hand. An action is selected randomly at each step; neither notebook learns a policy, represents an assurance action, consumes new evidence, or chooses between projects under shared resource constraints. A simulation step is not calibrated to a calendar month.

### Main notebook: repeated random trials

[Open `Portfolio_lifecycle_statemachine.ipynb`](/library/sources/monthly-portfolio-review/portfolio-lifecycle-statemachine.html).

This version sets up 99 trials, each with two projects starting at Proposal and nine decisions per project. It advances the stored state after each decision. Complete and Cancelled are absorbing states with zero subsequent reward. Promoting a Started project yields a supplied reward of 50; maintaining a non-terminal project costs 2. These are illustrative scores, not measured money or benefits.

**Known counting defect:** `success` increases on every subsequent step spent in Complete. It is not a count of completed projects. For example, completing on step 4 adds to the counter at steps 4 through 9. The saved output is evidence of an earlier random run, not an estimate of a learned strategy's success rate.

### Copy1: a different earlier attempt

[Open `Portfolio_lifecycle_statemachine-Copy1.ipynb`](/library/sources/monthly-portfolio-review/portfolio-lifecycle-statemachine-copy1.html).

This version starts one project at Proposal and one at Business Case, uses five decisions each, and changes two costs: maintaining a Started project costs 15 rather than 2; cancelling at Business Case costs 5 rather than 2. It is not an exact duplicate.

**Known transition defect:** the loop copies `state = p.state` before its decisions but never updates that local variable. Although it writes the result back to the project, the next call still uses the starting state. The saved trace consequently shows a cancelled project returning to Proposal. It cannot be read as a valid lifecycle simulation.

The two notebook files and their saved outputs are unchanged and have not been rerun for this review. Their contrasting attempts remain available for inspection; neither is presented as an executable solution ready for portfolio use.

## How to read the original claims

The note's title is *Reinforcement learning for project portfolios*. Its broader question is sequential decision-making; the surviving code implements random action selection and fixed transitions, not a learning algorithm. Claims about selecting the best design, optimising long-term benefits or choosing the most informative action describe ambitions, not demonstrated results.

The brief assertions about stationarity and ergodicity are not established in the note. They require a defined process and, for relevant long-run behaviour, a policy. The note also conflates changing review frequency with the learning step-size `alpha`; those are different choices. These clarifications are included at the original note's entrance so it can be read in context.

## Sources and limits

- [Original December 2020 note](/library/sources/monthly-portfolio-review/2020-12-reinforcement-learning-for-project-portfolios.html): the management question, information/decision sequence, incomplete headings and proposed applications. Its original body is retained beneath a dated reading note.
- The two notebooks above: the supplied states, actions, rewards, random runs and defects described here.
- [Warren Powell, *Reinforcement learning versus sequential decision analytics*](https://warrenpowell.org/rlvssda/): a 2026 reading reference distinguishing the broader decision-problem framework from particular solution methods.
- [Sutton and Barto, *Reinforcement Learning: An Introduction*, second-edition author draft, chapter 2, equation 2.5](https://www.incompleteideas.net/book/bookdraft2018mar21.pdf): a reference for the distinction between a learning problem and a random policy, and for learning step-size terminology. This is a 2026 clarification, not a claim that the notebooks implement the book's algorithms.

The useful result is an explicit set of questions for a portfolio review. There is no learned policy, calibrated uncertainty model, validated investment recommendation or evidence of operational benefit here.

[Return to the Library's methods guide](https://lawrencerowland.github.io/ML-for-portfolios.html#monthly-portfolio-decisions)

{% endraw %}
