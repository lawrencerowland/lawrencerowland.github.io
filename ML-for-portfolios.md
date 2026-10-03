---
layout: default
title: Machine learning for project portfolios
description: Earlier Orange and Highways prediction explorations, with their limits, alongside questions about monthly portfolio decisions.
schema_type: TechArticle
tags: [MachineLearning, PortfolioManagement, GraphDatabases, ProjectManagement]
---

# ML for portfolios

**Using machine learning to improve portfolios**

1. TOC
{:toc}

# Purpose
Apply machine learning to understand how to improve the project portfolio

## A worked example: project ratings in Orange
{: #orange-project-ratings }

*2019 exploration · explanation reviewed 1 October 2026*

**Could completed-project records help a portfolio manager decide where to look next?** This World Bank example makes the process visible: prepare records, compare models, inspect the mistakes, and consider what a prediction might change in a monthly review.

[![Original Orange workflow: project data preparation branches into model comparison, visual exploration and an intended prediction route.]({{ '/images/ML-for-portfolios/orange-project-ratings-workflow.png' | relative_url }})](/library/sources/orange-project-ratings/project-success-prediction-readme.html)

Follow the top row from **Extract** to **Sample data**, then the lower branch into **Test possible supervised models**. The illustrated guide explains why a good-looking score and a useful management decision are different achievements.

[Read the illustrated Orange walkthrough →](/library/sources/orange-project-ratings/project-success-prediction-readme.html)

The original name was *Project Success Prediction*, but its target is **IEG Bank Performance**, a specific evaluation rating. This is a historical demonstration: the workbook is absent and the displayed accuracy has not been reproduced as an early forecast. The guide retains all 15 screenshots, the short film, demonstration script and saved workflow, with clear routes to each.

[Film, script and workflow files](/library/sources/orange-project-ratings/project-success-prediction-readme.html#resources) · [Back to the Library]({{ '/library/methods/data-and-assurance.html#orange-project-ratings' | relative_url }})

## Before work starts: the Highways delay notebook
{: #highways-delay-notebook }

*Notebook labelled August 2020 · reading guide added 2 October 2026*

**Could completed A14 activities help a planner identify which unstarted work might finish late?** The notebook asks a useful prior question: which information would actually be available when making that prediction? An actual finish date can help explain the past while being unavailable for a forecast.

The saved code follows three steps:

1. **Choose a reporting snapshot.** It selects 30 September 2019, keeps completed and not-started activities, and excludes work in progress. The saved outputs show 9,332 completed records for training and 2,462 not-started records for prediction.
2. **Ask two different questions.** A classifier predicts the flag `FinishDateVariance >= 5`; a regressor estimates `FinishDateVariance` itself. The notebook does not establish the field's units or sign convention, so “five days late” would be an unjustified translation. Finish variance is also different from an activity's duration.
3. **Inspect the estimates.** It compares candidate models with DABL, examines predictions on the training records, then makes estimates for the not-started records. Those estimates are not later observed outcomes.

[![Saved training-set scatter plot: recorded finish variance on the horizontal axis and predicted variance on the vertical axis. Most predictions form a narrow band while recorded values spread much further.]({{ '/images/ML-for-portfolios/highways-training-variance.png' | relative_url }})]({{ '/images/ML-for-portfolios/highways-training-variance.png' | relative_url }})

*Original saved plot, extracted unchanged from “Show how well this model does on the Training Set” in the regression section. The diagonal marks equality; distance from it shows a mismatch. The original axes are unlabelled: the plotting code supplies the meanings above. This picture describes a training-set comparison, not performance on future activities. Select it for the original-size image.*

**What remains useful is the discipline of asking what we could know in time.** The notebook removes actual-finish and progress fields, and excludes the target and its derived flag from model inputs. It explicitly warns about information leakage. That is a valuable question to bring to a project forecast; it does not establish that the remaining inputs are available early enough or that the finished model predicts reliably.

**Read it as an unfinished exploration.** The separate test-set step and a check that predictions still align with the correct activity rows are recorded as unfinished. DABL's saved model-selection scores are a different check from the later training-set comparisons; neither establishes performance on later project work. Cleaning occurs before the completed/not-started split, and the feature preparation and prediction-time availability still need validation. The required `P6Activities.csv` is absent, and the notebook has not been rerun for this guide.

[Read the original Highways notebook →](/library/sources/project-graphs/2020-08-highways.html)

It is retained in the Neo4j repository for historical reasons; this is a tabular prediction experiment, separate from its graph-model examples. [Retained reading guide](/library/sources/project-graphs/readme.html#highways-delay-prediction-a-separate-notebook) · [Current explanation of information leakage](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage) · [Back to the Library]({{ '/library/methods/data-and-assurance.html#highways-delay-notebook' | relative_url }})

## A different question: monthly portfolio decisions
{: #monthly-portfolio-decisions }

*December 2020 working note · reading guide added 1 October 2026*

**What should we decide this month, and what should we learn before deciding again?** This earlier note puts advancing, suspending and cancelling projects beside investigation, review and assurance. One set of choices changes the work; the other may change what we know about it.

[![This month's state and decision lead through progress and new information into next month's updated state and decision.]({{ '/images/ML-for-portfolios/monthly-portfolio-review.svg' | relative_url }})](/library/sources/monthly-portfolio-review/readme.html#the-monthly-portfolio-review)

*Reading diagram made in 2026 from the original note. It illustrates the question; it does not calculate a policy.*

The useful thread is **state → decision → new information → next state and decision**. Read `S` as the project's position at a review, `x` as the decision, and `W` as information arriving afterwards. Does the timing of our reviews fit the information we need—and could finding out more change the next decision?

[Read the monthly portfolio-review guide →](/library/sources/monthly-portfolio-review/readme.html#the-monthly-portfolio-review)

The two retained notebooks explore a much smaller idea: random choices between **promote, maintain and cancel**, with supplied rewards. Neither learns a policy, consumes new evidence or models assurance. The guide distinguishes their different attempts and known counting/transition defects; the original note and saved outputs remain available. This is an unfinished exploration, with useful questions rather than validated recommendations.

[Original note and clarifications](/library/sources/monthly-portfolio-review/2020-12-reinforcement-learning-for-project-portfolios.html) · [Back to the Library]({{ '/library/methods/decisions-and-trade-offs.html#monthly-portfolio-decisions' | relative_url }})

# Code and library base
The guides and selected files above remain readable here. The [broader GitHub repository](https://github.com/lawrencerowland/Machine-learning-for-project-portfolios) contains other source material and may require access.

# Use cases for machine learning in managing projects. 

Below shows the phase of project delivery and Operations these use cases first appear.

![](/images/ML-for-portfolios/Usecase-to-Operations-subgraph-ML-models-created.png)

# Fitting ML into an organisation context

This optional survey asks some basic questions about what you and your team is trying to do with machine learning. 

[ML Online survey](https://forms.gle/9SCRtFvwqzQ8ZYu38)
  
# Summary of start-up steps for application

Once a use-case has been chosen, the following decisions can be made:

- Identify possible use cases
- Map  to business area/lifecycle
- Narrow down to a generic ML method
- Select a straightforward ML model
- Choose a suitable model environment
- Choose a code library or algorithm to apply that model
- select data-set

More is said about each stage [here](https://lawrencerowland.github.io/library/articles/choosing-a-machine-learning-approach.html)

# Applying machine learning at project or programme or portfolio levels

Machine learning provides different types of insight at different project levels. Some machine learning approaches make the most of the extra context provided by graph databases, specifically in terms of which relationships are meaningful. 

- PROJECT & PROGRAMME level: node, edge and property prediction for risks, dependencies, project sectoral properties and success.

- PORTFOLIO level: mostly standard network algorithms (centrality, breadth first search etc). Includes the conversion between graph and tree structures to provide appropriate views for different stakeholders. The ML element is currently restricted to identifying common and anomalous graph motifs.

- TASK AND SCHEDULE level: This is the least well developed, but a broad range of approaches to making the most of the Optimisation work of Professor Warren B. Powell, making the most of the inherent graph structure of resource-task-outcome paths. 
***Eventually exploring Graph-Graph neural networks & Seq-Seq/ Transformer approaches as well as Monte Carlo Tree search***

- PMO and CENTRE OF EXCELLENCE. NLP applied to boost taxonomic and semantic approaches to curating body of project practice for the organisation. 

# More guidance on applying ML to portfolios
The guidance continues [here](https://lawrencerowland.github.io/library/articles/choosing-a-machine-learning-approach.html)









