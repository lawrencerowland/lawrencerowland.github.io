(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.ProjectServicesData = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const services = [
    {id:'strategic-alignment', family:'practice', title:'Strategic alignment workshop',
      offer:'Make competing objectives and trade-offs explicit with the people who own them.',
      artefact:'Strategy map, objective hierarchy and an alignment scorecard with recorded disagreements.',
      measure:'Traceability: count agreed objectives with an owner and a link to an agreed strategic goal, divided by all objectives in scope. Report unresolved disagreements separately.',
      scope:'One decision or programme, named decision-makers and a dated strategy. Agreement in a workshop is not evidence that benefits have been delivered.'},
    {id:'project-chartering', family:'practice', title:'Project chartering',
      offer:'Agree a starting mandate, boundaries and decision rights before detailed delivery planning.',
      artefact:'Charter, responsibility matrix (RACI), governance model and an assumptions log.',
      measure:'Unresolved mandate questions at approval, and subsequent changes attributed to an ambiguous starting scope. Compare against an agreed review checklist, not a universal clarity score.',
      scope:'One project and its sponsor. Record scope exclusions, budget basis and who may approve a change; a charter is a baseline for discussion, not a guarantee.'},
    {id:'pmo-design', family:'practice', title:'PMO establishment and improvement',
      offer:'Design a project-management office around decisions it must support and services it can sustain.',
      artefact:'PMO handbook, process playbooks, measures and a staged improvement roadmap.',
      measure:'Cadence adherence: completed, useful decision reviews divided by planned reviews in an agreed period. Pair the count with a sample of decisions and user feedback.',
      scope:'A named office, service boundary and staffing assumption. Use the separate capability worksheet to examine current and future capabilities; this option provides no maturity rating.'},
    {id:'master-scheduling', family:'practice', title:'Integrated master scheduling',
      offer:'Join dependencies, calendars and resource assumptions into a reviewable delivery plan.',
      artefact:'Integrated schedule, what-if scenarios, resource view and float map.',
      measure:'Track milestone forecast error in days at a fixed forecast horizon; record over-allocation hours by resource and period. Check forecast quality as well as utilisation.',
      scope:'Defined work packages, reporting cut-off and resource calendars. Record missing links and constraints; a critical path calculation cannot validate its input assumptions.'},
    {id:'risk-framework', family:'practice', title:'Risk and issue management',
      offer:'Make uncertainty, existing problems and response ownership visible to decision-makers.',
      artefact:'Risk and issue registers, mitigation backlog, assumptions and optional simulation outputs.',
      measure:'Response follow-through: agreed actions completed by their due dates divided by actions due. If using expected monetary value, state each probability, cost basis and dependency assumption.',
      scope:'A decision horizon and a consistent risk scale. Keep realised issues separate from uncertain events; changes in a score are not automatically risk reduction.'},
    {id:'change-and-comms', family:'practice', title:'Change and communications planning',
      offer:'Work with affected people to define what must change in everyday work and what support is needed.',
      artefact:'Stakeholder map, readiness questions, communications calendar and feedback record.',
      measure:'Adoption: people completing an agreed new task successfully divided by people asked to try it. Record support effort and who was not represented in the sample.',
      scope:'One change, affected groups and a review window. Ask about experience directly; attendance, message reach and expressed enthusiasm do not establish adoption.'},
    {id:'benefits-tracking', family:'practice', title:'Benefits realisation tracking',
      offer:'Connect delivered outputs to changes in practice and to benefits someone is accountable for.',
      artefact:'Benefits map, measure catalogue, dashboard and benefit-owner review notes.',
      measure:'For each benefit, specify unit, starting value, target, observation date and owner. Show observed change and the assumed project contribution separately; record delay from output to outcome.',
      scope:'A defined beneficiary and benefit period. Include costs and adverse effects; a dashboard does not establish attribution.'},
    {id:'workflow-orchestration', family:'automation', title:'Assisted workflow orchestration',
      offer:'Explore whether software assistance can draft routine task updates and route them for review.',
      artefact:'Workflow graph, permission and escalation rules, draft tickets or changes, and execution log.',
      measure:'Compare median request-to-approved-action time with the existing process. Report correction rate, reviewer time and failed or duplicated actions over the same cases.',
      scope:'One workflow and approved systems. Define human approval points and a recovery route before any external action; automation coverage alone is not value.'},
    {id:'digital-twin', family:'automation', title:'Digital-twin dashboard trial',
      offer:'Test whether a model linked to observations gives a useful warning or a better decision.',
      artefact:'Model with stated boundaries, timestamped data feed, anomaly log and simulation snapshots.',
      measure:'Mean absolute error: average absolute difference between prediction and observation, in a stated unit and horizon. Also measure alert-to-action time, missed events and false alarms.',
      scope:'One observable process, update interval and decision. Label stale or missing data. A visual dashboard is not evidence that a simulation matches the real system.'},
    {id:'scenario-lab', family:'automation', title:'Generative scenario lab',
      offer:'Use drafted alternatives to widen a planning conversation, then test them against explicit constraints.',
      artefact:'Scenario set, constraint checks, risk–utility comparison and narrative briefs.',
      measure:'Count materially different feasible alternatives after independent review. Record violated constraints and review effort; compare with alternatives produced by the existing planning method.',
      scope:'A bounded decision and agreed utility criteria. Generated scores are proposals for scrutiny; this guide calculates neither return on investment nor confidence in it.'},
    {id:'backlog-review', family:'automation', title:'Assisted backlog review',
      offer:'Explore clustering and draft priorities to help an owner review accumulated work.',
      artefact:'Cluster report, candidate work list, proposed goals and rationale log.',
      measure:'Staleness: items without an owner review within a locally agreed age divided by items in scope. Track accepted suggestions, important omissions and total review time.',
      scope:'One backlog with explicit priority rules. The owner approves priorities; point estimates and cluster similarity do not prove alignment with a goal.'},
    {id:'knowledge-commons', family:'automation', title:'Knowledge-graph commons',
      offer:'Explore a shared map of project entities and relationships, with links back to evidence.',
      artefact:'Graph, vocabulary or ontology, source links and repeatable query examples.',
      measure:'Precision at five: relevant results among the first five, judged against a fixed query set and relevance rule. Pair this with time to find a supported answer and the rate of broken evidence links.',
      scope:'An agreed corpus, access rules and vocabulary owner. Validate extracted relationships; graph connectivity and semantic similarity do not establish truth.'},
    {id:'compliance-review', family:'automation', title:'Assisted compliance review',
      offer:'Explore how change detection and draft comparisons can support an accountable review of requirements.',
      artefact:'Source-linked change report, suggested policy or clause edits, review decisions and audit trail.',
      measure:'On a reviewed sample, count missed relevant changes and false flags; measure elapsed time from a confirmed change to an approved response. State what the sample cannot cover.',
      scope:'Named requirements, authoritative versions and a qualified reviewer. Suggested text is not a legal or conformity conclusion; approval remains explicit.'},
    {id:'project-conversations', family:'automation', title:'Project conversation review',
      offer:'Use meeting notes or voluntary feedback to surface topics a facilitator should check with the team.',
      artefact:'Source-linked topic summary, discussion map and agreed follow-up questions.',
      measure:'Ask participants whether summaries are accurate and useful. Record corrections and follow-through on agreed actions, with a stated response rate; do not infer a morale score.',
      scope:'A consented set of material and an agreed retention boundary. Invite people to correct interpretations; language alone does not establish wellbeing or intervention efficacy.'},
    {id:'resource-levelling', family:'automation', title:'Predictive resource-levelling trial',
      offer:'Compare a proposed forecast and allocation method with a transparent planning baseline.',
      artefact:'Bottleneck forecast, candidate roster, skill and availability map, and constraint checks.',
      measure:'Over-allocation hours per resource and period; feasible assignments divided by proposed assignments. Record service shortfalls and schedule effects alongside forecast error.',
      scope:'A defined resource pool and planning horizon, with skills, availability and labour constraints. A planner approves changes; no automatic reassignment is implied.'}
  ];
  const groups = [
    {id:'ai-augmentation', title:'AI augmentation', ideas:[
      {id:'schedule-forecasting', title:'Would a learned schedule forecast improve a decision?', option:'Compare a time-series model with a simple forecast using the same dated schedule snapshots.', artefact:'Forecast comparison with a fixed horizon and error log.', measure:'Forecast error in days on later, held-out milestones; data preparation and retraining effort.', scope:'Avoid future information leaking into training. Test on the project type and reporting cadence that matter.', service:'master-scheduling'},
      {id:'workload-drafting', title:'Could a draft work breakdown expose missing work?', option:'Draft work packages and responsibilities from a narrative scope, then review them with delivery owners.', artefact:'Work breakdown and responsibility matrix with assumptions and source references.', measure:'Reviewer-confirmed omissions, incorrect responsibilities and time to reach an approved version.', scope:'Fix the source scope and review rubric. Completeness must be judged by the team, not by the generator.', service:'project-chartering'},
      {id:'risk-summaries', title:'Could retrieved evidence make risk summaries more useful?', option:'Draft a summary from a bounded risk log and related evidence, preserving links to source passages.', artefact:'Risk narrative with citations, contradictions and unresolved questions.', measure:'Supported statements divided by checked statements, plus missed material changes and review time.', scope:'Use dated sources and access controls. Retrieval can miss evidence; a fluent summary is not assurance.', service:'risk-framework'},
      {id:'resource-optimisation', title:'Would a learned allocation policy beat a simpler rule?', option:'Compare an experimental optimiser with a transparent heuristic under the same demand scenarios.', artefact:'Candidate allocations, constraint violations and a scenario comparison.', measure:'Over-allocation hours, unserved demand and computation time across the chosen scenarios.', scope:'State stochastic demand assumptions and hard constraints. Keep infeasible results visible and human approval explicit.', service:'resource-levelling'}
    ]},
    {id:'immersive-collaboration', title:'Immersive collaboration', ideas:[
      {id:'site-walkthroughs', title:'Would a shared spatial walkthrough resolve a site question?', option:'Try a model-based remote walkthrough for a specific coordination or inspection question.', artefact:'Annotated model, observation record and list of checks still requiring a site visit.', measure:'Correctly resolved issues and reviewer effort, compared with drawings or video for the same task.', scope:'Check model currency, registration accuracy, accessibility and what cannot be observed remotely.', service:'digital-twin'},
      {id:'spatial-meetings', title:'Would a spatial meeting room help this distributed team?', option:'Compare a shared virtual workspace with the team’s ordinary meeting format.', artefact:'Persistent workboard, decisions and action record.', measure:'Participant-reported accessibility and usefulness, plus unresolved decisions and setup time.', scope:'Offer a usable non-headset route. A sense of presence does not establish effective collaboration.', service:'change-and-comms'},
      {id:'schedule-overlays', title:'Would a schedule overlay clarify work at the point of use?', option:'Prototype a timeline aligned to a model or work area without assuming a particular headset exists.', artefact:'Dated overlay prototype and model-to-schedule link table.', measure:'Task-identification errors and time to answer a defined sequencing question.', scope:'Check alignment, data freshness and safe use conditions; compare with a simple marked-up plan.', service:'master-scheduling'}
    ]},
    {id:'sustainability-dashboards', title:'ESG & sustainability dashboards', ideas:[
      {id:'carbon-ledger', title:'Can a carbon ledger trace its supplier data?', option:'Explore an emissions record built from identifiable supplier and activity data.', artefact:'Ledger with source, unit, boundary, factor version and missing-data flags.', measure:'Records with traceable evidence divided by records in scope; quantify missing data and uncertainty separately.', scope:'Agree the emissions boundary and calculation method with a competent reviewer. No regulator API or automatic disclosure compliance is assumed.', service:'benefits-tracking'},
      {id:'circularity-options', title:'Which material loops are practical enough to compare?', option:'Map reuse and recovery routes before testing alternative procurement scenarios.', artefact:'Material-flow graph with quality, quantity, destination and transport assumptions.', measure:'Recoverable mass under each scenario, plus cost, transport and quality constraints.', scope:'Specify functional equivalence and actual acceptance routes; a graph loop does not prove a viable reuse market.', service:'scenario-lab'},
      {id:'water-exposure', title:'Would local water evidence change a project choice?', option:'Compare site demand and phase timing with suitable dated water availability or stress evidence.', artefact:'Location and time-aligned exposure map with dataset limitations.', measure:'Demand relative to the selected local availability measure, reported with units, season and uncertainty.', scope:'Check dataset resolution and local relevance. A regional index cannot by itself forecast site-level disruption.', service:'risk-framework'}
    ]},
    {id:'low-code-orchestration', title:'Low-code orchestration', ideas:[
      {id:'approval-flows', title:'Could a drafted approval flow reduce routine effort?', option:'Translate a plain-language process into a reviewable flow, including rejection and exception routes.', artefact:'Approval flow, role permissions and test cases.', measure:'End-to-end processing time, correction rate and failed or duplicated approvals in a controlled trial.', scope:'Agree who is allowed to act and what needs approval. Prompting a flow does not establish that it is safe to run.', service:'workflow-orchestration'},
      {id:'chat-to-workflow', title:'Can a chat request become a dependable data workflow?', option:'Draft the connections between systems, then inspect transformations, credentials and failure handling.', artefact:'Workflow definition, data contract and recovery runbook.', measure:'Correct end-to-end runs divided by test runs, including missing data, retry and duplicate-event cases.', scope:'Use an approved test environment and bounded permissions before working on live systems.', service:'workflow-orchestration'},
      {id:'workflow-traces', title:'Would execution traces explain a workflow failure?', option:'Inspect recorded tool calls, inputs, outputs and errors to locate an operational failure.', artefact:'Trace timeline, error classification and reproducible failing case.', measure:'Time to identify and reproduce known faults, plus gaps in the recorded trace.', scope:'Traces show recorded execution, not private model reasoning. Exclude unnecessary sensitive content and check retention.', service:'workflow-orchestration'}
    ]},
    {id:'compliance-and-governance', title:'Compliance & governance automation', ideas:[
      {id:'policy-gap-review', title:'Could a policy comparison focus an expert gap review?', option:'Compare policies with a named, authorised set of requirements and ask a reviewer to decide relevance.', artefact:'Requirement-to-evidence table with candidate gaps and reviewer decisions.', measure:'Missed relevant gaps and false flags against an independently reviewed sample.', scope:'Use the applicable version and full context. A document comparison is neither certification nor a conformity decision.', service:'compliance-review'},
      {id:'audit-evidence', title:'Can operational traces support a specific control claim?', option:'Link recorded events to a defined control, while identifying evidence that must come from elsewhere.', artefact:'Control-to-evidence map, provenance and collection log.', measure:'Required evidence items that are retrievable and verified divided by items in the agreed sample.', scope:'Ask the reviewer what is sufficient. Collection and technical observability do not prove that a control operated effectively.', service:'compliance-review'},
      {id:'obligation-tracking', title:'Could extracted clauses improve obligation follow-up?', option:'Draft an obligation register from an agreed contract, preserving clause context and amendments.', artefact:'Clause-linked obligations, owners, dates and unresolved interpretations.', measure:'Reviewer-confirmed omissions and incorrect obligations, plus overdue confirmed actions.', scope:'An authorised reviewer resolves legal meaning. Neither extraction nor a cryptographic record determines whether an obligation is met.', service:'compliance-review'}
    ]},
    {id:'knowledge-graph-intelligence', title:'Knowledge-graph intelligence', ideas:[
      {id:'semantic-search', title:'Would a shared vocabulary improve project search?', option:'Compare keyword and semantic retrieval over an agreed corpus, with explicit terms and entity identities.', artefact:'Vocabulary, graph links and a labelled test-query set.', measure:'Precision at five and time to a supported answer, judged using the same query set.', scope:'Check permissions and ambiguous names. Similar wording is not evidence that two project objects are identical.', service:'knowledge-commons'},
      {id:'delay-causality', title:'What evidence would justify a delay-propagation claim?', option:'Draw proposed causal links and distinguish observed association from assumptions about interventions.', artefact:'Causal diagram, assumption register and alternative explanations.', measure:'Testable predictions and sensitivity to disputed assumptions; record where evidence cannot distinguish explanations.', scope:'A graph or software estimator does not establish causality. Use intervention estimates only when identification assumptions can be defended.', service:'scenario-lab'},
      {id:'vocabulary-drift', title:'Could changing language signal a knowledge-map review?', option:'Compare terms and relationships across dated corpus samples and ask owners to inspect changes.', artefact:'Vocabulary change log and candidate mappings for review.', measure:'Useful alerts divided by reviewed alerts, missed known terminology changes and review effort.', scope:'Define the comparison period and stable reference set. Changing language may reflect project change rather than an error.', service:'knowledge-commons'}
    ]},
    {id:'advanced-analytics', title:'Advanced analytics', ideas:[
      {id:'delay-explanations', title:'Would a model explanation help a delay-risk review?', option:'Inspect which recorded inputs influence a prediction, then check the explanation with subject experts.', artefact:'Prediction explanation, model limitations and data-quality review.', measure:'Prediction error on held-out cases, explanation stability and reviewer understanding of its limits.', scope:'Feature attribution describes model behaviour; it does not establish a cause of delay or the right intervention.', service:'digital-twin'},
      {id:'simulation-speed', title:'Would faster simulation change the planning decision?', option:'Compare a simple implementation with a faster one on the same uncertainty model.', artefact:'Reproducible simulation, convergence check and scenario comparison.', measure:'Runtime at a stated hardware setup and error tolerance; stability of decision-relevant results as runs increase.', scope:'State distributions and dependencies. More runs or faster hardware cannot repair an unrealistic model.', service:'risk-framework'}
    ]},
    {id:'human-factors', title:'Human factors & wellbeing', ideas:[
      {id:'workload-and-wellbeing', title:'Could voluntary workload feedback prompt useful support?', option:'Start with direct, voluntary discussion of workload and support needs instead of inferring burnout from biosignals or keystrokes.', artefact:'Agreed workload review, team-level themes and support actions.', measure:'Participant-reported usefulness and completion of agreed actions, with response rate and privacy limits.', scope:'No diagnosis, individual surveillance or health prediction. Agree consent, access and a route to seek appropriate support.', service:'project-conversations'},
      {id:'retrospective-themes', title:'Could draft themes help a team shape its retrospective?', option:'Group consented feedback into proposed topics, then let participants correct and choose them.', artefact:'Editable topic map and participant-agreed discussion agenda.', measure:'Accuracy and usefulness as rated by participants, plus actions they choose to follow through.', scope:'Do not treat inferred emotion as a fact or a proxy for psychological safety. Keep dissent and minority views visible.', service:'project-conversations'}
    ]}
  ];
  return {services, groups};
});
