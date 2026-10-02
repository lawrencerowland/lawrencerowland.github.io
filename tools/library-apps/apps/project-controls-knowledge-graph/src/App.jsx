import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import './App.css';
import { PREDICATE_WEIGHTS, reachableSubgraph, relationshipKey, weightedDegrees } from './graphExploration';

const CATEGORIES = {
  pmCore: { name: 'Project Management Core', color: '#287fbd' },
  pcCore: { name: 'Project Controls Core', color: '#23865b' },
  tools: { name: 'Tools & Techniques', color: '#c86412' },
  methods: { name: 'Methodologies & Frameworks', color: '#7652b8' },
  roles: { name: 'Roles & Responsibilities', color: '#c94747' },
  docs: { name: 'Documents & Deliverables', color: '#a56f00' }
};

const CATEGORY_KEYS = Object.keys(CATEGORIES);

const GUIDED_PATH = [
  { id: 'projectManager', guidance: 'Begin with broad responsibility for the whole project and its outcomes.' },
  { id: 'projectPlanning', guidance: 'Translate that responsibility into a coordinated plan and agreed basis for control.' },
  { id: 'costBaseline', guidance: 'Establish the approved, time-phased budget that cost performance will be measured against.' },
  { id: 'costControl', guidance: 'Monitor expenditure and protect the integrity of the approved cost baseline.' },
  { id: 'performanceMeasurement', guidance: 'Bring actual progress and plan together to understand how the project is performing.' },
  { id: 'earnedValueMgmt', guidance: 'Integrate scope, schedule and cost signals into a consistent performance view.' },
  { id: 'forecastingReports', guidance: 'Turn current performance into an explicit view of likely future outcomes.' },
  { id: 'projectController', guidance: 'Apply these connected practices as a specialist partner to project leadership.' }
];

const ProjectControlsKnowledgeGraph = () => {
  // Create graph data: nodes and links
  const nodes = useMemo(() => [
    // Project Management Core Concepts (Blue)
    { id: "projectInitiation", name: "Project Initiation", category: "pmCore", description: "Process of formally authorizing a new project or project phase" },
    { id: "projectPlanning", name: "Project Planning", category: "pmCore", description: "Defining project scope, objectives, and actions to achieve project goals" },
    { id: "projectExecution", name: "Project Execution", category: "pmCore", description: "Performing the work defined in the project management plan" },
    { id: "projectClosing", name: "Project Closing", category: "pmCore", description: "Finalizing all activities across all project management process groups" },
    { id: "stakeholderMgmt", name: "Stakeholder Management", category: "pmCore", description: "Identifying and engaging with individuals affected by the project" },
    { id: "scopeMgmt", name: "Scope Management", category: "pmCore", description: "Defining and controlling what is and is not included in the project" },
    { id: "riskMgmt", name: "Risk Management", category: "pmCore", description: "Identifying, analyzing, and responding to project risks" },
    { id: "teamMgmt", name: "Team Management", category: "pmCore", description: "Organizing, managing and leading the project team" },
    { id: "qualityMgmt", name: "Quality Management", category: "pmCore", description: "Ensuring the project will satisfy the needs for which it was undertaken" },
    { id: "communicationMgmt", name: "Communication Management", category: "pmCore", description: "Planning, collecting, and distributing project information" },
    
    // Project Controls Core Concepts (Green)
    { id: "costControl", name: "Cost Control", category: "pcCore", description: "Monitoring costs against the approved baseline, explaining variances and managing authorised changes" },
    { id: "scheduleControl", name: "Schedule Control", category: "pcCore", description: "Monitoring project progress to update and manage changes to the schedule baseline" },
    { id: "earnedValueMgmt", name: "Earned Value Management", category: "pcCore", description: "Technique for measuring project performance against scope, schedule and cost baselines" },
    { id: "performanceMeasurement", name: "Performance Measurement", category: "pcCore", description: "Collecting and analyzing data to assess project progress and performance" },
    { id: "changeControl", name: "Change Control", category: "pcCore", description: "Process of reviewing proposed changes and recording decisions made by the authorised governance roles" },
    { id: "forecasting", name: "Forecasting", category: "pcCore", description: "Estimating future project performance based on actual performance to date" },
    { id: "varianceAnalysis", name: "Variance Analysis", category: "pcCore", description: "Evaluating the difference between planned and actual performance" },
    { id: "progressTracking", name: "Progress Tracking", category: "pcCore", description: "Monitoring and documenting the advancement of project activities" },
    { id: "baselineMgmt", name: "Baseline Management", category: "pcCore", description: "Maintaining and controlling the approved project baselines" },
    { id: "resourceOptimization", name: "Resource Optimization", category: "pcCore", description: "Efficient allocation and utilization of project resources" },
    
    // Tools & Techniques (Orange)
    { id: "wbs", name: "Work Breakdown Structure", category: "tools", description: "Hierarchical decomposition of project scope into manageable work packages" },
    { id: "cpm", name: "Critical Path Method", category: "tools", description: "Algorithm for scheduling project activities based on logical dependencies" },
    { id: "pert", name: "PERT Analysis", category: "tools", description: "Statistical tool used to estimate project duration with uncertain activity times" },
    { id: "sCurves", name: "S-Curves", category: "tools", description: "Graphical display of cumulative costs, labor hours or other quantities over time" },
    { id: "monteCarlo", name: "Monte Carlo Simulation", category: "tools", description: "Statistical technique using random sampling to obtain numerical results" },
    { id: "ganttCharts", name: "Gantt Charts", category: "tools", description: "Bar chart illustrating project schedule with tasks displayed against time" },
    { id: "resourceHistograms", name: "Resource Histograms", category: "tools", description: "Bar chart showing resource allocation and utilization over time" },
    { id: "controlAccounts", name: "Control Accounts", category: "tools", description: "Management control points where scope, budget, and schedule are integrated" },
    { id: "trendAnalysis", name: "Trend Analysis", category: "tools", description: "Examining project results over time to determine if performance is improving or deteriorating" },
    { id: "dashboards", name: "Dashboards & Reporting", category: "tools", description: "Visual displays of key performance indicators to communicate project status" },
    
    // Methodologies & Frameworks (Purple)
    { id: "waterfall", name: "Waterfall", category: "methods", description: "Sequential project management approach with distinct phases" },
    { id: "agile", name: "Agile", category: "methods", description: "Iterative approach focusing on customer feedback and incremental delivery" },
    { id: "hybrid", name: "Hybrid", category: "methods", description: "Combination of waterfall and agile methodologies tailored to project needs" },
    { id: "pmbok", name: "PMBOK Guide", category: "methods", description: "PMI guide to project management knowledge, published alongside The Standard for Project Management; application depends on project context" },
    { id: "prince2", name: "PRINCE2", category: "methods", description: "Process-based method for effective project management with defined structure" },
    { id: "lean", name: "Lean", category: "methods", description: "Methodology focused on maximizing value while minimizing waste" },
    { id: "sixSigma", name: "Six Sigma", category: "methods", description: "Data-driven approach focused on process improvement and variation reduction" },
    { id: "iso21500", name: "ISO 21500", category: "methods", description: "ISO 21500:2021 describes context and concepts for project, programme and portfolio management; project-management guidance is in ISO 21502:2020" },
    
    // Roles & Responsibilities (Red)
    { id: "projectManager", name: "Project Manager", category: "roles", description: "Professional responsible for leading the project from initiation to closure" },
    { id: "projectController", name: "Project Controller", category: "roles", description: "Specialist monitoring cost, schedule and performance throughout the project" },
    { id: "costEngineer", name: "Cost Engineer", category: "roles", description: "Professional focused on project cost estimation, budgeting and control" },
    { id: "scheduler", name: "Scheduler", category: "roles", description: "Specialist in developing and maintaining project schedules" },
    { id: "riskAnalyst", name: "Risk Analyst", category: "roles", description: "Professional responsible for identifying and analyzing project risks" },
    { id: "changeManager", name: "Change Control Manager", category: "roles", description: "Illustrative role overseeing project change control; distinct from managing organisational adoption and behaviour change" },
    { id: "pmoLead", name: "PMO Lead", category: "roles", description: "Manager of the Project Management Office providing standards and support" },
    { id: "sponsor", name: "Sponsor", category: "roles", description: "Executive responsible for providing project resources and support" },
    
    // Documents & Deliverables (Yellow)
    { id: "projectCharter", name: "Project Charter", category: "docs", description: "Document authorizing the project and providing initial requirements" },
    { id: "projectManagementPlan", name: "Project Management Plan", category: "docs", description: "Formal, approved document defining how the project is executed and controlled" },
    { id: "costBaseline", name: "Cost Baseline", category: "docs", description: "Approved version of the time-phased project budget" },
    { id: "scheduleBaseline", name: "Schedule Baseline", category: "docs", description: "Approved version of the project schedule model" },
    { id: "riskRegister", name: "Risk Register", category: "docs", description: "Document containing results of risk analysis and risk response planning" },
    { id: "changeLog", name: "Change Log", category: "docs", description: "Document that captures all change requests to the project" },
    { id: "statusReports", name: "Status Reports", category: "docs", description: "Regular documents showing current project status against baselines" },
    { id: "performanceReports", name: "Performance Reports", category: "docs", description: "Documents presenting earned value metrics and performance analysis" },
    { id: "forecastingReports", name: "Forecasting Reports", category: "docs", description: "Documents with estimates of future project performance and completion, together with their assumptions and uncertainty" },
    { id: "lessonsLearned", name: "Lessons Learned", category: "docs", description: "Knowledge captured and applied throughout the project, then consolidated for future use" }
  ], []);

  const links = useMemo(() => [
    // Workflow links in Project Management
    { source: "projectInitiation", target: "projectPlanning", type: "workflow" },
    { source: "projectPlanning", target: "projectExecution", type: "workflow" },
    { source: "projectExecution", target: "projectClosing", type: "workflow" },
    
    // Project Planning relationships
    { source: "projectPlanning", target: "scopeMgmt", type: "includes" },
    { source: "projectPlanning", target: "riskMgmt", type: "includes" },
    { source: "projectPlanning", target: "qualityMgmt", type: "includes" },
    { source: "projectPlanning", target: "communicationMgmt", type: "includes" },
    { source: "projectPlanning", target: "teamMgmt", type: "includes" },
    { source: "projectPlanning", target: "stakeholderMgmt", type: "includes" },
    
    // Document creation
    { source: "projectInitiation", target: "projectCharter", type: "produces" },
    { source: "projectPlanning", target: "projectManagementPlan", type: "produces" },
    { source: "projectPlanning", target: "costBaseline", type: "produces" },
    { source: "projectPlanning", target: "scheduleBaseline", type: "produces" },
    { source: "riskMgmt", target: "riskRegister", type: "produces" },
    { source: "changeControl", target: "changeLog", type: "produces" },
    
    // Project Controls relationships
    { source: "costBaseline", target: "costControl", type: "enables" },
    { source: "scheduleBaseline", target: "scheduleControl", type: "enables" },
    { source: "scheduleControl", target: "performanceMeasurement", type: "informs" },
    { source: "costControl", target: "performanceMeasurement", type: "informs" },
    { source: "performanceMeasurement", target: "forecasting", type: "enables" },
    { source: "performanceMeasurement", target: "varianceAnalysis", type: "enables" },
    { source: "varianceAnalysis", target: "changeControl", type: "mayInform" },
    { source: "changeControl", target: "baselineMgmt", type: "affects" },
    
    // Tool relationships
    { source: "earnedValueMgmt", target: "performanceMeasurement", type: "methodFor" },
    { source: "cpm", target: "scheduleControl", type: "techniqueFor" },
    { source: "pert", target: "scheduleControl", type: "techniqueFor" },
    { source: "monteCarlo", target: "forecasting", type: "techniqueFor" },
    { source: "ganttCharts", target: "scheduleControl", type: "toolFor" },
    { source: "resourceHistograms", target: "resourceOptimization", type: "toolFor" },
    { source: "wbs", target: "costControl", type: "foundationFor" },
    { source: "wbs", target: "scheduleControl", type: "foundationFor" },
    { source: "sCurves", target: "progressTracking", type: "toolFor" },
    { source: "trendAnalysis", target: "forecasting", type: "techniqueFor" },
    { source: "dashboards", target: "performanceReports", type: "creates" },
    
    // Role relationships
    { source: "projectManager", target: "projectController", type: "delegates" },
    { source: "projectController", target: "costControl", type: "responsible" },
    { source: "projectController", target: "scheduleControl", type: "responsible" },
    { source: "costEngineer", target: "costControl", type: "performs" },
    { source: "scheduler", target: "scheduleControl", type: "performs" },
    { source: "riskAnalyst", target: "riskMgmt", type: "performs" },
    { source: "changeManager", target: "changeControl", type: "manages" },
    { source: "sponsor", target: "projectManager", type: "authorizes" },
    
    // Performance and reporting
    { source: "progressTracking", target: "statusReports", type: "generates" },
    { source: "performanceMeasurement", target: "performanceReports", type: "generates" },
    { source: "forecasting", target: "forecastingReports", type: "generates" },
    { source: "projectClosing", target: "lessonsLearned", type: "documents" },
    
    // Methodology connections
    { source: "pmbok", target: "projectManagementPlan", type: "informs" },
    { source: "prince2", target: "changeControl", type: "emphasizes" },
    { source: "waterfall", target: "baselineMgmt", type: "emphasizes" },
    { source: "agile", target: "progressTracking", type: "adapts" },
    
    // Additional connections for transitions
    { source: "costControl", target: "earnedValueMgmt", type: "utilizes" },
    { source: "scheduleControl", target: "earnedValueMgmt", type: "utilizes" },
    { source: "earnedValueMgmt", target: "forecasting", type: "enables" },
    { source: "controlAccounts", target: "earnedValueMgmt", type: "structures" }
  ], []);

  const predicateTypes = useMemo(() => [...new Set(links.map(link => link.type))].sort(), [links]);
  const [activePredicates, setActivePredicates] = useState(() => new Set(links.map(link => link.type)));
  const [degreeThreshold, setDegreeThreshold] = useState(0);
  const [traversalEnabled, setTraversalEnabled] = useState(false);
  const [traversalDirection, setTraversalDirection] = useState('upstream');
  const degreeScores = useMemo(() => weightedDegrees(nodes, links), [nodes, links]);
  const maxDegree = useMemo(() => Math.max(1, ...Object.values(degreeScores)), [degreeScores]);
  const nodeRadius = useCallback(node => 8 + 10 * (degreeScores[node.id] || 0) / maxDegree, [degreeScores, maxDegree]);

  const svgRef = useRef(null);
  const graphHostRef = useRef(null);
  const simulationRef = useRef(null);
  const nodeSelectionRef = useRef(null);
  const linkSelectionRef = useRef(null);
  const pathSelectionRef = useRef(null);
  const viewControlsRef = useRef({});
  const closeAboutRef = useRef(null);
  const aboutOpenerRef = useRef(null);
  const aboutDialogRef = useRef(null);
  const pendingFocusRef = useRef(null);

  const [activeCategories, setActiveCategories] = useState(() => new Set(CATEGORY_KEYS));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showGuidedPath, setShowGuidedPath] = useState(false);
  const [guidedStep, setGuidedStep] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [viewport, setViewport] = useState({ width: 960, height: 600 });
  const [layoutVersion, setLayoutVersion] = useState(0);

  const nodeById = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes]);
  const categoryCounts = useMemo(() => Object.fromEntries(
    CATEGORY_KEYS.map(key => [key, nodes.filter(node => node.category === key).length])
  ), [nodes]);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleNodes = useMemo(() => nodes.filter(node => {
    if (!activeCategories.has(node.category) || degreeScores[node.id] < degreeThreshold) return false;
    if (!normalizedSearch) return true;
    return `${node.name} ${node.description}`.toLowerCase().includes(normalizedSearch);
  }), [activeCategories, degreeScores, degreeThreshold, nodes, normalizedSearch]);
  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(node => node.id)), [visibleNodes]);
  const visibleLinks = useMemo(() => links.filter(link => (
    activePredicates.has(link.type) && visibleNodeIds.has(link.source) && visibleNodeIds.has(link.target)
  )), [activePredicates, links, visibleNodeIds]);
  const traversal = useMemo(() => reachableSubgraph(visibleNodes, visibleLinks, traversalEnabled ? selectedNodeId : null, traversalDirection), [selectedNodeId, traversalDirection, traversalEnabled, visibleLinks, visibleNodes]);
  const selectedNode = selectedNodeId ? nodeById.get(selectedNodeId) : null;
  const currentGuidedItem = GUIDED_PATH[guidedStep];
  const currentGuidedNode = nodeById.get(currentGuidedItem.id);

  const selectedRelationships = useMemo(() => {
    if (!selectedNode) return [];
    return links
      .filter(link => link.source === selectedNode.id || link.target === selectedNode.id)
      .map(link => {
        const outgoing = link.source === selectedNode.id;
        const otherNode = nodeById.get(outgoing ? link.target : link.source);
        return { ...link, outgoing, otherNode };
      })
      .filter(relationship => relationship.otherNode);
  }, [links, nodeById, selectedNode]);

  useEffect(() => {
    if (!selectedNodeId || visibleNodeIds.has(selectedNodeId)) return;
    setSelectedNodeId(null);
  }, [selectedNodeId, visibleNodeIds]);

  useEffect(() => {
    const host = graphHostRef.current;
    if (!host) return undefined;

    const updateSize = () => {
      const width = Math.max(320, Math.round(host.clientWidth || 960));
      const height = width < 680 ? 500 : Math.min(680, Math.max(560, Math.round(width * 0.62)));
      setViewport(previous => (
        previous.width === width && previous.height === height ? previous : { width, height }
      ));
    };

    updateSize();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || visibleNodes.length === 0) {
      d3.select(svgRef.current).selectAll('*').remove();
      viewControlsRef.current = {};
      return undefined;
    }

    const { width, height } = viewport;
    const svgElement = svgRef.current;
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.append('title').attr('id', 'pc-kg-graph-title').text('Interactive project controls knowledge graph');
    svg.append('desc').attr('id', 'pc-kg-graph-description').text(
      'Use the category filters or search to narrow the graph. Select a node for its description and relationships.'
    );

    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'pc-kg-relationship-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#98a4b7');
    defs.append('marker')
      .attr('id', 'pc-kg-path-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#d76500');

    const graphGroup = svg.append('g').attr('class', 'pc-kg__graph-group');
    const zoom = d3.zoom()
      .scaleExtent([0.35, 3])
      .filter(event => {
        if (event.type === 'wheel') return event.ctrlKey || event.metaKey;
        return !event.button;
      })
      .on('zoom', event => graphGroup.attr('transform', event.transform));
    svg.call(zoom).on('dblclick.zoom', null);

    const graphNodes = visibleNodes.map(node => ({ ...node }));
    const graphNodeById = new Map(graphNodes.map(node => [node.id, node]));
    const graphLinks = visibleLinks.map(link => ({ ...link }));
    const pathSegments = GUIDED_PATH.slice(0, -1)
      .map((item, index) => ({
        source: graphNodeById.get(item.id),
        target: graphNodeById.get(GUIDED_PATH[index + 1].id),
        order: index + 1
      }))
      .filter(segment => segment.source && segment.target);

    const link = graphGroup.append('g')
      .attr('class', 'pc-kg__links')
      .selectAll('line')
      .data(graphLinks)
      .join('line')
      .attr('class', 'pc-kg__link')
      .attr('marker-end', 'url(#pc-kg-relationship-arrow)');
    link.append('title').text(item => {
      const source = nodeById.get(typeof item.source === 'string' ? item.source : item.source.id);
      const target = nodeById.get(typeof item.target === 'string' ? item.target : item.target.id);
      return `${source?.name || 'Concept'} ${formatRelationship(item.type)} ${target?.name || 'concept'}`;
    });

    const pathLink = graphGroup.append('g')
      .attr('class', 'pc-kg__path-links')
      .selectAll('line')
      .data(pathSegments)
      .join('line')
      .attr('class', 'pc-kg__path-link')
      .attr('marker-end', 'url(#pc-kg-path-arrow)')
      .style('display', 'none');

    const pathIndex = new Map(GUIDED_PATH.map((item, index) => [item.id, index + 1]));
    const node = graphGroup.append('g')
      .attr('class', 'pc-kg__nodes')
      .selectAll('g')
      .data(graphNodes, item => item.id)
      .join('g')
      .attr('class', 'pc-kg__node')
      .attr('role', 'button')
      .attr('tabindex', 0)
      .attr('aria-label', item => `${item.name}. ${item.description}`)
      .on('click', (event, item) => {
        event.stopPropagation();
        setShowGuidedPath(false);
        setSelectedNodeId(item.id);
      })
      .on('keydown', (event, item) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        setShowGuidedPath(false);
        setSelectedNodeId(item.id);
      });

    node.append('circle').attr('class', 'pc-kg__node-hit').attr('r', 24);
    node.append('circle')
      .attr('class', 'pc-kg__node-dot')
      .attr('r', nodeRadius)
      .attr('fill', item => CATEGORIES[item.category].color);
    node.append('text')
      .attr('class', 'pc-kg__node-label')
      .attr('x', node => nodeRadius(node) + 5)
      .attr('y', 4)
      .text(item => item.name);

    const stepBadge = node.filter(item => pathIndex.has(item.id))
      .append('g')
      .attr('class', 'pc-kg__step-badge')
      .attr('transform', 'translate(-16,-17)');
    stepBadge.append('circle').attr('r', 10);
    stepBadge.append('text').attr('y', 3.5).text(item => pathIndex.get(item.id));

    const updatePositions = () => {
      link
        .attr('x1', item => item.source.x)
        .attr('y1', item => item.source.y)
        .attr('x2', item => item.target.x)
        .attr('y2', item => item.target.y);
      pathLink
        .attr('x1', item => item.source.x)
        .attr('y1', item => item.source.y)
        .attr('x2', item => item.target.x)
        .attr('y2', item => item.target.y);
      node.attr('transform', item => `translate(${item.x},${item.y})`);
    };

    const drag = d3.drag()
      .on('start', event => {
        event.sourceEvent?.stopPropagation();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on('drag', event => {
        event.subject.fx = Math.max(28, Math.min(width - 28, event.x));
        event.subject.fy = Math.max(28, Math.min(height - 28, event.y));
        event.subject.x = event.subject.fx;
        event.subject.y = event.subject.fy;
        updatePositions();
      })
      .on('end', () => node.classed('pc-kg__node--pinned', item => Number.isFinite(item.fx)));
    node.call(drag);

    const simulation = d3.forceSimulation(graphNodes)
      .randomSource(d3.randomLcg(0.42))
      .force('link', d3.forceLink(graphLinks).id(item => item.id).distance(96).strength(0.62))
      .force('charge', d3.forceManyBody().strength(-230))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.13))
      .force('y', d3.forceY(height / 2).strength(0.12))
      .force('collision', d3.forceCollide().radius(36).strength(0.92))
      .stop();
    simulationRef.current = simulation;
    for (let index = 0; index < 300; index += 1) simulation.tick();
    graphNodes.forEach(item => {
      const labelAllowance = Math.min(210, Math.max(82, item.name.length * 6.5 + 28));
      item.x = Math.max(34, Math.min(width - labelAllowance, item.x));
      item.y = Math.max(34, Math.min(height - 34, item.y));
    });
    updatePositions();

    const transformForNodes = (targetNodes, maxScale = 1.35) => {
      if (targetNodes.length === 0) return d3.zoomIdentity;
      const minX = d3.min(targetNodes, item => item.x - 28);
      const minY = d3.min(targetNodes, item => item.y - 28);
      const maxX = d3.max(targetNodes, item => item.x + Math.max(48, item.name.length * 6.5 + 24));
      const maxY = d3.max(targetNodes, item => item.y + 28);
      const contentWidth = Math.max(1, maxX - minX);
      const contentHeight = Math.max(1, maxY - minY);
      const scale = Math.max(0.35, Math.min(maxScale, 0.88 * Math.min(width / contentWidth, height / contentHeight)));
      const centerX = minX + contentWidth / 2;
      const centerY = minY + contentHeight / 2;
      return d3.zoomIdentity
        .translate(width / 2 - scale * centerX, height / 2 - scale * centerY)
        .scale(scale);
    };

    const fit = () => svg.call(zoom.transform, transformForNodes(graphNodes));
    const focusNode = nodeId => {
      const target = graphNodeById.get(nodeId);
      if (!target) return;
      const scale = 1.55;
      svg.call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2 - scale * target.x, height / 2 - scale * target.y).scale(scale)
      );
      node.filter(item => item.id === nodeId).node()?.focus();
    };

    viewControlsRef.current = {
      fit,
      focusNode,
      reset: () => setLayoutVersion(version => version + 1),
      zoomIn: () => svg.call(zoom.scaleBy, 1.25),
      zoomOut: () => svg.call(zoom.scaleBy, 0.8)
    };
    nodeSelectionRef.current = node;
    linkSelectionRef.current = link;
    pathSelectionRef.current = pathLink;
    fit();

    svg.on('click', event => {
      if (event.target === svgElement) setSelectedNodeId(null);
    });

    return () => {
      simulation.stop();
      simulationRef.current = null;
      nodeSelectionRef.current = null;
      linkSelectionRef.current = null;
      pathSelectionRef.current = null;
      viewControlsRef.current = {};
      svg.on('.zoom', null).on('click', null);
    };
  }, [layoutVersion, nodeById, nodeRadius, viewport, visibleLinks, visibleNodes]);

  useEffect(() => {
    const guidedIds = new Set(GUIDED_PATH.map(item => item.id));
    nodeSelectionRef.current
      ?.classed('pc-kg__node--selected', item => item.id === selectedNodeId)
      .classed('pc-kg__node--path', item => showGuidedPath && guidedIds.has(item.id))
      .classed('pc-kg__node--current', item => showGuidedPath && item.id === currentGuidedItem.id)
      .classed('pc-kg__node--muted', item => showGuidedPath && !guidedIds.has(item.id))
      .classed('pc-kg__node--reachable', item => traversalEnabled && traversal.nodeIds.has(item.id))
      .classed('pc-kg__node--outside-traversal', item => traversalEnabled && selectedNodeId && !traversal.nodeIds.has(item.id));
    linkSelectionRef.current
      ?.classed('pc-kg__link--muted', showGuidedPath)
      .classed('pc-kg__link--reachable', item => traversalEnabled && traversal.linkKeys.has(relationshipKey({ ...item, source: typeof item.source === 'object' ? item.source.id : item.source, target: typeof item.target === 'object' ? item.target.id : item.target })))
      .classed('pc-kg__link--outside-traversal', item => traversalEnabled && selectedNodeId && !traversal.linkKeys.has(relationshipKey({ ...item, source: typeof item.source === 'object' ? item.source.id : item.source, target: typeof item.target === 'object' ? item.target.id : item.target })));
    pathSelectionRef.current?.style('display', showGuidedPath ? null : 'none');
    if (showGuidedPath) viewControlsRef.current.focusNode?.(currentGuidedItem.id);
    if (pendingFocusRef.current && visibleNodeIds.has(pendingFocusRef.current)) {
      viewControlsRef.current.focusNode?.(pendingFocusRef.current);
      pendingFocusRef.current = null;
    }
  }, [currentGuidedItem.id, guidedStep, selectedNodeId, showGuidedPath, traversal, traversalEnabled, visibleNodes, visibleNodeIds]);

  useEffect(() => {
    if (!showAbout) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeAboutRef.current?.focus();
    const closeOnEscape = event => {
      if (event.key === 'Escape') setShowAbout(false);
      if (event.key === 'Tab') {
        const focusable = aboutDialogRef.current?.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
      aboutOpenerRef.current?.focus();
    };
  }, [showAbout]);

  const toggleCategory = useCallback(categoryKey => {
    setShowGuidedPath(false);
    setActiveCategories(current => {
      const next = new Set(current);
      if (next.has(categoryKey)) next.delete(categoryKey);
      else next.add(categoryKey);
      return next;
    });
  }, []);

  const startGuidedPath = () => {
    setActiveCategories(new Set(CATEGORY_KEYS));
    setSearchTerm('');
    setActivePredicates(new Set(predicateTypes));
    setDegreeThreshold(0);
    setTraversalEnabled(false);
    setSelectedNodeId(null);
    setGuidedStep(0);
    setShowGuidedPath(true);
  };

  const selectNode = nodeId => {
    setShowGuidedPath(false);
    if (!visibleNodeIds.has(nodeId)) {
      setSearchTerm('');
      setDegreeThreshold(0);
      setActiveCategories(current => new Set([...current, nodeById.get(nodeId).category]));
      pendingFocusRef.current = nodeId;
    }
    setSelectedNodeId(nodeId);
    if (visibleNodeIds.has(nodeId)) viewControlsRef.current.focusNode?.(nodeId);
  };

  const moveGuidedPath = direction => {
    const nextStep = guidedStep + direction;
    if (nextStep >= GUIDED_PATH.length) {
      setShowGuidedPath(false);
      return;
    }
    setGuidedStep(Math.max(0, nextStep));
  };

  const formatCategorySummary = () => {
    if (activeCategories.size === CATEGORY_KEYS.length) return 'all categories';
    if (activeCategories.size === 0) return 'no categories';
    return `${activeCategories.size} categories`;
  };

  return (
    <main className="pc-kg">
      <header className="pc-kg__header">
        <div>
          <p className="pc-kg__eyebrow">Interactive learning map</p>
          <h1>Project Controls Knowledge Graph</h1>
          <p className="pc-kg__lede">
            Explore how project-management responsibilities connect to controls, methods, roles and evidence.
          </p>
        </div>
        <div className="pc-kg__header-actions">
          <a className="pc-kg__link-button" href="../../methods/data-and-assurance.html">Library: data &amp; assurance</a>
          <button ref={aboutOpenerRef} className="pc-kg__button pc-kg__button--secondary" onClick={() => setShowAbout(true)}>
            About this graph
          </button>
          <button
            className={`pc-kg__button ${showGuidedPath ? 'pc-kg__button--active' : 'pc-kg__button--primary'}`}
            aria-pressed={showGuidedPath}
            onClick={showGuidedPath ? () => setShowGuidedPath(false) : startGuidedPath}
          >
            {showGuidedPath ? 'Exit guided path' : 'Start PM → PC path'}
          </button>
        </div>
      </header>

      <section className="pc-kg__toolbar" aria-label="Graph filters">
        <div className="pc-kg__search">
          <label htmlFor="pc-kg-search">Find a concept</label>
          <input
            id="pc-kg-search"
            type="search"
            value={searchTerm}
            placeholder="Try forecasting or risk…"
            onChange={event => {
              setShowGuidedPath(false);
              setSearchTerm(event.target.value);
            }}
          />
        </div>

        <fieldset className="pc-kg__filters">
          <legend>Show categories</legend>
          <div className="pc-kg__chips">
            {CATEGORY_KEYS.map(categoryKey => {
              const category = CATEGORIES[categoryKey];
              const active = activeCategories.has(categoryKey);
              return (
                <button
                  key={categoryKey}
                  type="button"
                  className="pc-kg__chip"
                  style={{ '--chip-color': category.color }}
                  aria-pressed={active}
                  onClick={() => toggleCategory(categoryKey)}
                >
                  <span className="pc-kg__chip-dot" aria-hidden="true" />
                  <span>{category.name}</span>
                  <span className="pc-kg__chip-count" aria-label={`${categoryCounts[categoryKey]} concepts`}>
                    {categoryCounts[categoryKey]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="pc-kg__filter-actions">
            <button
              type="button"
              className="pc-kg__text-button"
              disabled={activeCategories.size === CATEGORY_KEYS.length}
              onClick={() => setActiveCategories(new Set(CATEGORY_KEYS))}
            >
              Show all
            </button>
            <button
              type="button"
              className="pc-kg__text-button"
              disabled={activeCategories.size === 0}
              onClick={() => {
                setShowGuidedPath(false);
                setActiveCategories(new Set());
              }}
            >
              Clear
            </button>
          </div>
        </fieldset>
      </section>

      <details className="pc-kg__exploration">
        <summary>Relationship filters, weighted degree and traversal</summary>
        <div className="pc-kg__exploration-grid">
          <fieldset>
            <legend>Allowed relationship types</legend>
            <p>Only checked types appear as graph edges and can be followed in a traversal. Isolated concepts remain available.</p>
            <div className="pc-kg__predicate-list">{predicateTypes.map(type => <label key={type}>
              <input type="checkbox" checked={activePredicates.has(type)} onChange={() => {
                setShowGuidedPath(false);
                setActivePredicates(current => { const next = new Set(current); if (next.has(type)) next.delete(type); else next.add(type); return next; });
              }} />
              <span>{formatRelationship(type)} <small>(weight {PREDICATE_WEIGHTS[type] ?? 1})</small></span>
            </label>)}</div>
            <button type="button" onClick={() => setActivePredicates(new Set(predicateTypes))}>All relationship types</button>
            <button type="button" onClick={() => { setShowGuidedPath(false); setActivePredicates(new Set()); }}>No relationship types</button>
          </fieldset>
          <div>
            <label htmlFor="pc-degree-threshold">Minimum whole-graph weighted degree: {degreeThreshold.toFixed(1)}</label>
            <input id="pc-degree-threshold" type="range" min="0" max={Math.ceil(maxDegree)} step="0.5" value={degreeThreshold} onChange={event => { setShowGuidedPath(false); setDegreeThreshold(Number(event.target.value)); }} />
            <p>Node size and this threshold use the sum of incident relationship weights in the full recorded graph, before any filters. Weights are hand-chosen teaching heuristics, not measured importance, authority or evidence quality. Maximum score: {maxDegree.toFixed(1)}.</p>
            <button type="button" aria-pressed={traversalEnabled} disabled={!selectedNode && !traversalEnabled} onClick={() => { setShowGuidedPath(false); setTraversalEnabled(value => !value); }}>{traversalEnabled ? 'Disable traversal' : 'Enable traversal'}</button>
            <label htmlFor="pc-traversal-direction">Traversal direction</label>
            <select id="pc-traversal-direction" value={traversalDirection} onChange={event => setTraversalDirection(event.target.value)}>
              <option value="upstream">Upstream (incoming)</option><option value="downstream">Downstream (outgoing)</option>
            </select>
            <p>Select a concept to set the origin. Teal highlights reachable concepts and recorded edges within the current category, search, degree and relationship filters.</p>
            <details><summary>Explain traversal</summary>
              <ol><li>Select a starting concept in the graph or Browse concepts list.</li><li>Choose the relationship types relevant to your question.</li><li>Choose upstream to follow incoming arrows or downstream to follow outgoing arrows.</li><li>Enable traversal and inspect the reachable concepts. Filters exclude hidden concepts from the walk, so they cannot bridge a path.</li></ol>
              <p>This is directed reachability through the chosen relationship types. It can help investigate a dependency or roll-up question, but does not prove a causal dependency, a governance rule or path-dependent logic. The orange PM → PC route is a separate teaching sequence; starting it resets filters and turns traversal off.</p>
            </details>
          </div>
        </div>
      </details>

      <p className="pc-kg__summary" aria-live="polite">
        Showing {visibleNodes.length} of {nodes.length} concepts across {formatCategorySummary()}
        {normalizedSearch ? ` matching “${searchTerm.trim()}”` : ''}.
      </p>
      <p className="pc-kg__relationship-summary" role="status">Showing {visibleLinks.length} of {links.length} recorded relationships.{traversalEnabled && selectedNode ? ` Traversal from ${selectedNode.name}: ${traversal.nodeIds.size} reachable concepts including the origin, ${traversal.linkKeys.size} relationships.` : ''}</p>

      <div className="pc-kg__workspace">
        <section className="pc-kg__graph-panel" aria-labelledby="pc-kg-graph-heading">
          <div className="pc-kg__graph-header">
            <div>
              <h2 id="pc-kg-graph-heading">Concept map</h2>
              <p>Grey arrows are recorded relationships; teal highlights a traversal of them. The orange route is a separate teaching sequence.</p>
            </div>
            <div className="pc-kg__graph-controls" aria-label="Graph view controls">
              <button type="button" aria-label="Zoom out" disabled={!visibleNodes.length} onClick={() => viewControlsRef.current.zoomOut?.()}>−</button>
              <button type="button" aria-label="Zoom in" disabled={!visibleNodes.length} onClick={() => viewControlsRef.current.zoomIn?.()}>+</button>
              <button type="button" disabled={!visibleNodes.length} onClick={() => viewControlsRef.current.fit?.()}>Fit graph</button>
              <button type="button" disabled={!visibleNodes.length} onClick={() => viewControlsRef.current.reset?.()}>Reset layout</button>
            </div>
          </div>

          <div ref={graphHostRef} className="pc-kg__canvas-wrap" style={{ height: viewport.height }}>
            <svg
              ref={svgRef}
              className="pc-kg__canvas"
              role="group"
              aria-labelledby="pc-kg-graph-title pc-kg-graph-description"
            />
            {visibleNodes.length === 0 && (
              <div className="pc-kg__empty">
                <strong>No concepts match this view.</strong>
                <span>Show a category or clear the search to bring concepts back.</span>
              </div>
            )}
          </div>
          <p className="pc-kg__graph-help">
            Select a node or its label for details. Drag to pin a node. Pan by dragging the background; pinch or hold Command/Ctrl while scrolling to zoom.
          </p>
        </section>

        <aside className="pc-kg__inspector" aria-label="Concept details">
          {showGuidedPath ? (
            <GuidedPathInspector
              currentNode={currentGuidedNode}
              currentItem={currentGuidedItem}
              guidedStep={guidedStep}
              nodeById={nodeById}
              onChooseStep={setGuidedStep}
              onMove={moveGuidedPath}
              onExit={() => setShowGuidedPath(false)}
            />
          ) : selectedNode ? (
            <>
            <NodeInspector
              node={selectedNode}
              weightedDegree={degreeScores[selectedNode.id]}
              relationships={selectedRelationships}
              onClose={() => setSelectedNodeId(null)}
              onSelectNode={selectNode}
            />
            {traversalEnabled && <section aria-label="Reachable concepts">
              <h3>Reachable concepts</h3>
              <p>Origin: {selectedNode.name}. {traversalDirection === 'upstream' ? 'Following incoming arrows.' : 'Following outgoing arrows.'}</p>
              <ul>{visibleNodes.filter(node => traversal.nodeIds.has(node.id)).map(node => <li key={node.id}>{node.name}</li>)}</ul>
            </section>}
            </>
          ) : (
            <ConceptBrowser nodes={visibleNodes} onSelectNode={selectNode} />
          )}
        </aside>
      </div>

      {showAbout && (
        <div
          className="pc-kg__modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setShowAbout(false);
          }}
        >
          <section
            ref={aboutDialogRef}
            className="pc-kg__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pc-kg-about-title"
          >
            <div className="pc-kg__modal-header">
              <div>
                <p className="pc-kg__eyebrow">How to use it</p>
                <h2 id="pc-kg-about-title">About this knowledge graph</h2>
              </div>
              <button ref={closeAboutRef} type="button" className="pc-kg__icon-button" aria-label="Close About" onClick={() => setShowAbout(false)}>×</button>
            </div>
            <p>
              This is a learning map for people moving between project management and project controls. Filter by category, search for a concept, then use the inspector to read its recorded relationships.
            </p>
            <p>Concepts and grey relationships are a curated teaching model, not a complete ontology or a prescribed governance structure. Role accountabilities vary by organisation; a link does not establish a universal requirement. Planning, delivery and learning often recur rather than follow a single pass.</p>
            <p>Standards context: <a href="https://www.iso.org/standard/75704.html">ISO 21500:2021</a> covers context and concepts; <a href="https://www.iso.org/standard/74947.html">ISO 21502:2020</a> provides project-management guidance. See also <a href="https://www.pmi.org/standards/pmbok">PMI’s PMBOK Guide</a>. This map is not a reproduction of those standards.</p>
            <ul className="pc-kg__about-list">
              <li>The category chips add and remove concepts and their incident relationships.</li>
              <li>Opening a relationship reveals its target concept, restoring its category and clearing the search and degree threshold when needed.</li>
              <li>The guided PM → PC route is an explicit teaching sequence, shown separately from the grey knowledge-graph relationships.</li>
              <li>All concepts are also available in the keyboard-friendly Browse concepts list.</li>
              <li>Fit graph restores the current view; Reset layout also removes manual node positioning.</li>
            </ul>
            <button type="button" className="pc-kg__button pc-kg__button--primary" onClick={() => setShowAbout(false)}>Close</button>
          </section>
        </div>
      )}
    </main>
  );
};

const formatRelationship = type => type.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

const ConceptBrowser = ({ nodes, onSelectNode }) => {
  const sortedNodes = [...nodes].sort((left, right) => left.name.localeCompare(right.name));
  return (
    <div>
      <p className="pc-kg__eyebrow">Keyboard-friendly view</p>
      <h2>Browse concepts</h2>
      <p className="pc-kg__inspector-copy">Choose a concept to see what it means and how it connects.</p>
      {sortedNodes.length ? (
        <ul className="pc-kg__concept-list">
          {sortedNodes.map(node => (
            <li key={node.id}>
              <button type="button" onClick={() => onSelectNode(node.id)}>
                <span className="pc-kg__list-dot" style={{ backgroundColor: CATEGORIES[node.category].color }} aria-hidden="true" />
                <span>{node.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="pc-kg__quiet">No concepts are available in the current filter.</p>
      )}
    </div>
  );
};

const NodeInspector = ({ node, weightedDegree, relationships, onClose, onSelectNode }) => (
  <div>
    <div className="pc-kg__inspector-heading">
      <div>
        <p className="pc-kg__eyebrow">{CATEGORIES[node.category].name}</p>
        <h2>{node.name}</h2>
      </div>
      <button type="button" className="pc-kg__icon-button" aria-label="Close concept details" onClick={onClose}>×</button>
    </div>
    <p className="pc-kg__inspector-copy">{node.description}</p>
    <p className="pc-kg__quiet">Whole-graph weighted degree: {weightedDegree.toFixed(1)} (illustrative heuristic).</p>
    <h3>Recorded relationships</h3>
    <p className="pc-kg__quiet">All recorded relationships for this concept are listed here, including those hidden by the graph filters.</p>
    {relationships.length ? (
      <ul className="pc-kg__relationship-list">
        {relationships.map((relationship, index) => (
          <li key={`${relationship.source}-${relationship.target}-${relationship.type}-${index}`}>
            <span className="pc-kg__relationship-type">{formatRelationship(relationship.type)}</span>
            <span aria-hidden="true">{relationship.outgoing ? '→' : '←'}</span>
            <button type="button" onClick={() => onSelectNode(relationship.otherNode.id)}>{relationship.otherNode.name}</button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="pc-kg__quiet">No relationships have yet been recorded for this concept.</p>
    )}
  </div>
);

const GuidedPathInspector = ({ currentNode, currentItem, guidedStep, nodeById, onChooseStep, onMove, onExit }) => (
  <div>
    <p className="pc-kg__eyebrow">Guided PM → PC path</p>
    <p className="pc-kg__step-count">Step {guidedStep + 1} of {GUIDED_PATH.length}</p>
    <h2>{currentNode.name}</h2>
    <p className="pc-kg__inspector-copy">{currentNode.description}</p>
    <p className="pc-kg__guidance">{currentItem.guidance}</p>
    <div className="pc-kg__path-actions">
      <button type="button" disabled={guidedStep === 0} onClick={() => onMove(-1)}>Previous</button>
      <button type="button" className="pc-kg__button--primary" onClick={() => onMove(1)}>
        {guidedStep === GUIDED_PATH.length - 1 ? 'Finish path' : 'Next step'}
      </button>
    </div>
    <ol className="pc-kg__path-list" aria-label="Guided path steps">
      {GUIDED_PATH.map((item, index) => (
        <li key={item.id}>
          <button
            type="button"
            aria-current={index === guidedStep ? 'step' : undefined}
            onClick={() => onChooseStep(index)}
          >
            <span>{index + 1}</span>
            {nodeById.get(item.id).name}
          </button>
        </li>
      ))}
    </ol>
    <p className="pc-kg__quiet">Orange links show this teaching sequence; they do not assert additional knowledge-graph relationships.</p>
    <button type="button" className="pc-kg__text-button" onClick={onExit}>Exit guided path</button>
  </div>
);

export default ProjectControlsKnowledgeGraph;
