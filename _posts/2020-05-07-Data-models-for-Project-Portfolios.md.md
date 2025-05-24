# Data models for project portfolios

{% include screenshot url="2020-05-07-Data-models-for-Project-Portfolios/Graph_Option.png" %}
# Purpose

Use a graph database to maintain and visualise a portfolio of projects.

# Why a data model ?
- A data-model shows how each project and programme type is described and fits together as a portfolio.
- The right data-model for the business sets out a place for all the relevant content about each projects
- The data-model can be tuned to match how all the business stakeholders understand your projects
- The data-model relates outcomes, objectives, benefits, scope, KPIs etc, in the way that your business understands these features

# Why a graph database for a data model?

Many good data models do not use graph-databases. 

Graph databases work well for portfolios where:
1. there are many dependencies between projects and programmes
2. the data model may need to added to or changed over time, because of the dynamic nature of the business. 
3. Internal teams see and use the portfolio data in very different ways, and the teams need the ability to show multiple views of the same projects. 

These repositories use freely available graph-database technology.

# Code and library base
Three document and code repositories are available for setting up at the team's preferred level:
1. at portfolio level https://github.com/lawrencerowland/Data-models-for-portfolios
2. at programme level https://github.com/lawrencerowland/Data-models-for-programmes
3. at project level   https://github.com/lawrencerowland/Data-models-for-projects

See further below for discussing of when  to apply at which project level. 

# Use cases
1. Portfolio is new and team needs to move from whiteboard charts to a portfolio database that fits the business. Here, the team will set up, manage and visualise their portfolio data within a graph database. 

2. Portfolio is working well, and recorded well either in spreadsheet, or relational database, or Project Management System. Team wants to gain insight into how projects and objectives relate to each other, and chooses to view the same data in parallel with a graph database. Here one runs a graph database alongside existing database, analytics and reporting.

3. Project level. There are a number of mature project data models available, and at the project level it often makes the most sense to stick with the implied data model your team already uses for projects. i.e. the data model often 'comes with' the enterprise project management system you are using, whether an in-house system or Jira/Asana etc. There is probably no need for a graph database data model at project level unless your team is handling projects that have unique business contexts. However, a graph-based data model can be run in parallel if you are looking for additional insight in visualising the ways your projects fit together. 

#Summary of start-up steps for application
# INTRODUCTION

# Data model ?
	