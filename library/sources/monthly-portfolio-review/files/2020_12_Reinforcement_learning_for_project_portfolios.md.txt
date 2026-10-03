# Monthly portfolio decisions — December 2020 working note

**Reading note added 1 October 2026.** The original text below is retained unchanged. Its useful question is how decisions, project progress and new information interact between monthly reviews. Several sections were left as headings, and proposed benefits are ambitions rather than tested results.

- The accompanying notebooks select actions randomly using hand-written transitions and rewards. They do not learn a policy or model the value of investigation/assurance. [The reading guide explains both variants and their defects](README.md#what-the-notebooks-actually-do).
- “Information & Decision Analytics” and reinforcement learning are not interchangeable labels for every sequential decision problem. No reinforcement-learning update is implemented here.
- Changing the review cadence is different from changing a learning step-size `alpha`. The assertions “stationary: yes” and “ergodic: no” are not justified by the note. The promised optimisation and management benefits remain unvalidated. See the [terminology and source clarification](README.md#how-to-read-the-original-claims).

[Read the guide](README.md) · [Methods in the Library](https://lawrencerowland.github.io/ML-for-portfolios.html#monthly-portfolio-decisions)

---

# 0 Business need

Focus: **The monthly portfolio review**

Build on:
- **a well-defined project portfolio**
- **with a clear project lifecycle**
- **the portfolio is regularly updated**

Move to:
- **Making decisions about projects each month**
- **Anticipating and handling uncertainty**

# 1 Starter Question

Which starter question do you prefer ?

1. **What decisions can we make ?**
2. *What are we trying to achieve?*

# 1.5 Basic Model 0

Decision > New information > ....

> x0
> **Project decision**

>>W1, x1
>> **Project progress, New project decision**

>>> W2, x2...
					

# 2 Basic Model I 

State > Decision > New Information & new State ....

>> S0,x0
>> **Project status, Project decision**

>> W1,S1,x1
>> **Project progress, New Project status, New project decision**

>>> W2,S2,x2...

Can also think of this as action > value > action> value...

# 2.1 Alternate visualisation

|  start|  | month 1 | | month 2|
|:--|:--|:--|:--|:--|
|  |  |  W1| | W2|
| S0|  | S1 | |S2|
| x0 |  | x1 | |x2|

# 3 Basic Model II 

Minimum of two components
1. New information (W)
2. Decisions       (x)

> *maximum expectation of some function of (x,W)*

With up to three more: 
4. Objective
5. State
5. Transition function
*Objective function* allows the long-term direction to be set
Tracking 
*state* avoids myopic focus on the next reward
*Transition function* takes advantage of our knowledge of dynamics or mechanics of the situation

# 4 Basic Model III

- 'Information & Decision Analytics'
- a.k.a Reinforcement Learning
- Two USPs:
	- handles uncertainty
	- handles decisions over time
- So
	- *goes beyond boiling down uncertainty into 3/4 scenarios*
	- *whilst not needing a decision tree that explodes*
# 3 Decision variables
Decisions (x) or actions (a) or continuous efforts u

|  Lifecycle decisions|  Assurance actions| Control actions |
|:--|:--|:--|
| Project advances |  Investigate|  |
|  Project suspended|  Review|  |
|  Project cancelled| Assure |  |

More than one agent making key decisions ? *No*

# 4 Objective function
# 5 Uncertainty
# 6 State
# 7 State Transitions
# 8 Policies that meet the Objective function
# 9 The intuition: the closest analogy
# 10 Management insight for this use case
Parallels OODA thus 
# 11 Pre-requisites for this use-case
*State machine* etc
# 12 Management improvements
1. data: are we gathering W regularly and effectively?
2. promptitude: are we making decisions as per agreed cadence?
3. exploration/ exploitation ? i.e epsilon-greedy ?
5. other myopic strategy suitable ?
6. change tick-rate ? (alpha) step size parameter
7. do we need optimistic initial values ?
# 13 What else does this tell us ?

Is this situation:
stationary ? *yes*
ergodic ? *no*
a contextual bandit ?
# Other page structure
Benefits
- manages uncertainty as first-class citizen
- selects which decision reduces uncertainty
- Algorithm for selecting best project design
- long term benefits vs costs balanced on-the-fly
Why it works
- reinforcement learning
 - integrated framework for sequential decisions
 - learns the next best decision from the last decision 
Products
- Decision look-up-tables
- Programme Management meeting Procedure
- Portfolio decision checklist
Applications
- Investment business case decisions
- Optimal Innovation programme design
- Prototype planning and selection
Consulting