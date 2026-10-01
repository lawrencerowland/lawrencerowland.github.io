---
layout: default
title: Machine learning for project portfolios
description: Earlier methods and an illustrated Orange walkthrough connecting project records, predictions and portfolio decisions.
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

[![Original Orange workflow: project data preparation branches into model comparison, visual exploration and an intended prediction route.]({{ '/images/ML-for-portfolios/orange-project-ratings-workflow.png' | relative_url }})](https://github.com/lawrencerowland/Machine-learning-for-project-portfolios/blob/master/project-success-prediction/READme.md)

Follow the top row from **Extract** to **Sample data**, then the lower branch into **Test possible supervised models**. The illustrated guide explains why a good-looking score and a useful management decision are different achievements.

[Read the illustrated Orange walkthrough →](https://github.com/lawrencerowland/Machine-learning-for-project-portfolios/blob/master/project-success-prediction/READme.md)

The original name was *Project Success Prediction*, but its target is **IEG Bank Performance**, a specific evaluation rating. This is a historical demonstration: the workbook is absent and the displayed accuracy has not been reproduced as an early forecast. The guide retains all 15 screenshots, the short film, demonstration script and saved workflow, with clear routes to each.

[Film, script and workflow files](https://github.com/lawrencerowland/Machine-learning-for-project-portfolios/blob/master/project-success-prediction/READme.md#resources) · [Back to the Library]({{ '/library.html#library-methods' | relative_url }})

# Code and library base
If you wish to go straight to the code and document libraries, start [here](https://github.com/lawrencerowland/Machine-learning-for-project-portfolios)

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









