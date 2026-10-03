import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ProjectControlsTransformation from './ProjectControlsTransformation';

// Data type definitions for clarity
interface Category { id: string; name: string; }
interface Era { id: string; name: string; color: string; }
interface NodeData {
  id: number;
  name: string;
  year: number;
  era: string;
  category: string;
  description: string;
  source?: string;
}
interface Connection { source: number; target: number; description: string; }

const PMSoftwareEvolution: React.FC = () => {
  type CategoryId = 'all' | 'traditional' | 'agile' | 'collaboration' | 'lowcode' | 'mobile' | 'ai';
  const [filterCategory, setFilterCategory] = useState<CategoryId>('all');
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  // Categories for filtering
  const categories: Category[] = [
    { id: 'all',           name: 'All Categories' },
    { id: 'traditional',   name: 'Traditional PM' },
    { id: 'agile',         name: 'Agile Tools' },
    { id: 'collaboration', name: 'Collaboration Tools' },
    { id: 'lowcode',       name: 'Low-Code/No-Code' },
    { id: 'mobile',        name: 'Mobile-First' },
    { id: 'ai',            name: 'AI-Enhanced' }
  ];

  // Timeline eras with labels and background colors
  const eras: Era[] = [
    { id: 'era1', name: '2004-2008: Web Transition',       color: 'bg-blue-100'   },
    { id: 'era2', name: '2009-2013: Agile & Cloud',        color: 'bg-green-100'  },
    { id: 'era3', name: '2014-2018: Mobile & Integration', color: 'bg-yellow-100' },
    { id: 'era4', name: '2019-2023: Low-Code & AI',        color: 'bg-purple-100' },
    { id: 'era5', name: '2024-2025: AI Experiments',  color: 'bg-red-100'    }
  ];

  // Key PM software/tools and trends over the years
  const nodes: NodeData[] = [
    // 2004-2008: Web Transition Era
    { id: 1,  name: 'MS Project 2007', year: 2007, era: 'era1', category: 'traditional',  description: "Microsoft's flagship project management tool added enhanced visualization, multi-level undo, and better resource management." },
    { id: 2,  name: 'Basecamp',        year: 2004, era: 'era1', category: 'collaboration', description: 'Pioneered web-based project management with a focus on simplicity and communication over complex gantt charts.' },
    { id: 3,  name: 'JIRA (Early)',    year: 2004, era: 'era1', category: 'agile',         description: 'Initially focused on bug and issue tracking, began adding more project management capabilities.' },
    { id: 4,  name: 'Web-Based Transition', year: 2006, era: 'era1', category: 'collaboration', description: 'Industry shift from desktop-only to web-accessible project management tools.' },
    { id: 5,  name: 'Primavera P6',    year: 2008, era: 'era1', category: 'traditional',  description: "Oracle's acquisition of Primavera brought enterprise-level PM to more industries with enhanced web capabilities." },

    // 2009-2013: Agile & Cloud Era
    { id: 6,  name: 'Asana Launch',    year: 2011, era: 'era2', category: 'collaboration', description: 'Founded by a Facebook co-founder, focused on team collaboration and work management with a simple UI.' },
    { id: 7,  name: 'Trello',          year: 2011, era: 'era2', category: 'agile',         description: 'Popularized the Kanban board approach to project management with a card-based visual interface.' },
    { id: 8,  name: 'JIRA Agile',      year: 2013, era: 'era2', category: 'agile',         description: 'Atlassian renamed GreenHopper to Jira Agile in 2013.', source: 'https://www.atlassian.com/blog/archives/simplify%24' },
    { id: 9,  name: 'Cloud Adoption',  year: 2010, era: 'era2', category: 'collaboration', description: 'PM tools increasingly moved to SaaS models with enhanced collaboration features.' },
    { id: 10, name: 'dapulse (later monday.com)', year: 2014, era: 'era3', category: 'collaboration', description: 'The company was founded in 2012; its first product launched in 2014 as dapulse.', source: 'https://monday.com/p/about/' },

    // 2014-2018: Mobile & Integration Era
    { id: 11, name: 'Slack Integration Era', year: 2014, era: 'era3', category: 'collaboration', description: "Slack's growth drove PM tools to develop robust integrations, changing how teams communicated about projects." },
    { id: 12, name: 'Mobile PM Apps',       year: 2015, era: 'era3', category: 'mobile',        description: 'Dedicated mobile apps became standard, with mobile-first design approaches taking hold.' },
    { id: 13, name: 'MS Project Online',    year: 2013, era: 'era2', category: 'traditional',   description: 'Microsoft paired the Project Server 2013 release with Project Online in Office 365.', source: 'https://learn.microsoft.com/en-us/project/what-s-new-for-it-pros-in-project-server-2013' },
    { id: 14, name: 'Airtable',             year: 2015, era: 'era3', category: 'lowcode',       description: 'Combined spreadsheet simplicity with database power, allowing teams to build custom PM solutions.' },
    { id: 15, name: 'Notion',               year: 2018, era: 'era3', category: 'collaboration', description: 'All-in-one workspace combining notes, tasks, wikis, and databases, challenging traditional PM categories.' },

    // 2019-2023: Low-Code & AI Era
    { id: 16, name: 'Low-Code PM',      year: 2019, era: 'era4', category: 'lowcode',       description: 'Rise of customizable platforms allowing teams to build bespoke PM workflows without coding.' },
    { id: 17, name: 'ClickUp',          year: 2017, era: 'era3', category: 'collaboration', description: 'ClickUp was founded and released its beta in 2017; its product evolved into a broader work platform.', source: 'https://clickup.com/press/100-million-series-b' },
    { id: 18, name: 'AI Assistance',    year: 2021, era: 'era4', category: 'ai',            description: 'Introduction of AI for scheduling suggestions, risk identification, and resource allocation optimization.' },
    { id: 19, name: 'Remote Work Tools',year: 2020, era: 'era4', category: 'collaboration', description: 'Pandemic accelerated remote work features: enhanced video integration, digital whiteboards, async updates.' },
    { id: 20, name: 'Atlassian Cloud',  year: 2021, era: 'era4', category: 'agile',         description: "Atlassian's aggressive cloud migration strategy changed how enterprises approached PM infrastructure." },

    // 2024-2025: AI Experiments Era
    { id: 21, name: 'AI Project Assistants', year: 2024, era: 'era5', category: 'ai',            description: 'AI that can plan projects, identify risks, suggest resources, and even draft communication for stakeholders.' },
    { id: 22, name: 'Predictive Analytics',  year: 2024, era: 'era5', category: 'ai',            description: 'Advanced forecasting of project outcomes based on historical data and current project metrics.' },
    { id: 23, name: 'Natural Language PM',   year: 2025, era: 'era5', category: 'ai',            description: 'Conversation-based interfaces for managing projects through text or voice commands.' },
    { id: 24, name: 'Unified Work Platforms',year: 2025, era: 'era5', category: 'collaboration', description: 'Consolidation of project management, communication, documentation, and development into single unified platforms.' }
  ];

  // Connections indicating influences or direct evolution between nodes
  const connections: Connection[] = [
    { source: 1,  target: 5,  description: 'Enterprise PM evolution' },
    { source: 1,  target: 13, description: 'MS Project evolution to cloud' },
    { source: 2,  target: 4,  description: 'Influenced web transition' },
    { source: 2,  target: 6,  description: 'Influenced collaboration-focused tools' },
    { source: 3,  target: 8,  description: 'JIRA evolution toward agile' },
    { source: 4,  target: 9,  description: 'Web-based to cloud transition' },
    { source: 6,  target: 10, description: 'Influenced visual collaboration approach' },
    { source: 7,  target: 8,  description: 'Popularized kanban in agile tools' },
    { source: 7,  target: 12, description: 'Visual approach influenced mobile design' },
    { source: 9,  target: 11, description: 'Cloud enabled enhanced integrations' },
    { source: 10, target: 16, description: 'Customization influenced low-code approach' },
    { source: 11, target: 15, description: 'Integration capabilities influenced all-in-one workspaces' },
    { source: 12, target: 19, description: 'Mobile capabilities enabled remote work tooling' },
    { source: 14, target: 16, description: 'Pioneered low-code approach to PM' },
    { source: 15, target: 17, description: 'All-in-one approach influence' },
    { source: 16, target: 17, description: 'Low-code principles adopted in collaborative platforms' },
    { source: 18, target: 21, description: 'Early AI evolved into full project assistants' },
    { source: 18, target: 22, description: 'AI capabilities expanded to predictions' },
    { source: 19, target: 24, description: 'Remote needs drove unified platforms' },
    { source: 21, target: 23, description: 'AI assistants evolved to natural language interfaces' },
    { source: 8,  target: 20, description: 'Evolution to cloud-first strategy' },
    { source: 13, target: 18, description: 'Traditional tools adding AI capabilities' },
    { source: 17, target: 24, description: 'Evolution toward unified work management' }
  ];

  // Dynamically filtered nodes based on the selected category
  const filteredNodes: NodeData[] = (filterCategory === 'all')
    ? nodes
    : nodes.filter(node => node.category === filterCategory);

  // Filter connections to only those where both source and target are in filteredNodes
  const filteredConnections: Connection[] = connections.filter(conn =>
    filteredNodes.some(node => node.id === conn.source) &&
    filteredNodes.some(node => node.id === conn.target)
  );

  // Handle selecting a node (show details)
  const handleNodeClick = (node: NodeData) => {
    setSelectedNode(node);
    if (filterCategory !== 'all' && node.category !== filterCategory) setFilterCategory('all');
  };

  // Helper: get unique DOM element ID for a node (for linking canvas lines)
  const getNodeDomId = (nodeId: number) => `node-${nodeId}`;

  // Group the filtered nodes by category for rendering rows
  const nodesByCategory: { [categoryId: string]: NodeData[] } = {};
  categories.slice(1).forEach(cat => {
    nodesByCategory[cat.id] = filteredNodes.filter(node => node.category === cat.id);
  });

  // useRef to store node DOM elements for line calculations
  const nodeRefs = useRef<{ [domId: string]: HTMLDivElement | null }>({});

  // Determine CSS classes for node boxes based on category
  const getNodeColor = (category: string) => {
    switch (category) {
      case 'traditional':   return 'bg-blue-100 border-blue-400';
      case 'agile':         return 'bg-green-100 border-green-400';
      case 'collaboration': return 'bg-purple-100 border-purple-400';
      case 'lowcode':       return 'bg-yellow-100 border-yellow-400';
      case 'mobile':        return 'bg-orange-100 border-orange-400';
      case 'ai':            return 'bg-red-100 border-red-400';
      default:              return 'bg-gray-100 border-gray-400';
    }
  };

  // Timeline range and helper for positioning
  const startYear = 2004;
  const yearSpan = 21;  // covers 2004–2025 inclusive
  const getYearPosition = (year: number) => ((year - startYear + 0.5) / (yearSpan + 1)) * 100;

  // Canvas overlay for drawing connection lines (curved arrows between nodes)
  const ConnectionLines: React.FC = () => {
    useEffect(() => {
      const canvas = document.getElementById('connection-canvas') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const draw = () => {
      const canvasRect = canvas.getBoundingClientRect();
      // Match canvas dimensions to display size for crisp lines
      canvas.width = canvasRect.width;
      canvas.height = canvasRect.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw each connection as a curved line with an arrowhead
      filteredConnections.forEach(conn => {
        const sourceEl = nodeRefs.current[getNodeDomId(conn.source)];
        const targetEl = nodeRefs.current[getNodeDomId(conn.target)];
        if (!sourceEl || !targetEl) return;  // skip if source/target not in DOM (e.g., filtered out)
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        // Calculate coordinates relative to the canvas element
        const sourceX = sourceRect.left + sourceRect.width / 2 - canvasRect.left;
        const sourceY = sourceRect.top + sourceRect.height / 2 - canvasRect.top;
        const targetX = targetRect.left + targetRect.width / 2 - canvasRect.left;
        const targetY = targetRect.top + targetRect.height / 2 - canvasRect.top;
        // Draw a Bezier curve from source to target
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        const midX = (sourceX + targetX) / 2;
        ctx.bezierCurveTo(midX, sourceY, midX, targetY, targetX, targetY);
        // Use solid line for direct "evolution" influence, dashed for other influences
        if (conn.description.includes('evolution')) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = '#888';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 3]);
        }
        ctx.stroke();
        ctx.setLineDash([]);  // reset line style
        // Draw an arrowhead at the target end of the line
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(
          targetX - 10 * Math.cos(angle - Math.PI / 6),
          targetY - 10 * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(
          targetX - 10 * Math.cos(angle + Math.PI / 6),
          targetY - 10 * Math.sin(angle + Math.PI / 6)
        );
        ctx.strokeStyle = conn.description.includes('evolution') ? '#000' : '#888';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      };
      draw();
      window.addEventListener('resize', draw);
      return () => window.removeEventListener('resize', draw);
    }, [filteredConnections]);  // re-draw when connections or filtered nodes change

    return (
      <canvas 
        id="connection-canvas"
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />
    );
  };

  // Determine selected node's category and era for display badges
  const selectedCategory = selectedNode ? categories.find(c => c.id === selectedNode.category) : null;
  const selectedEra      = selectedNode ? eras.find(e => e.id === selectedNode.era) : null;

  return (
    <div className="pmse-container bg-white rounded-lg shadow-lg">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-center p-4 border-b">
          Project Management Software Evolution (2004-2025)
        </h1>

        <p className="p-4">An interpretive map of selected tools and trends, retained through 2025. Broad trend years are narrative markers, not product launch dates. Links describe proposed relationships rather than proven influence. Selected release corrections include primary sources in their detail cards; other historical claims remain unverified.</p>
        <nav className="controls-view-links" aria-label="History views"><a href="#software-timeline">Software timeline</a><a href="#controls-transformation">Project controls transformation picture →</a></nav>
        <h2 id="software-timeline" className="p-4">Selected tools and trends</h2>
        {/* Controls: filter dropdown and category toggle buttons */}
        <div className="px-4 py-2 border-b flex items-center bg-gray-50">
          <div className="mr-4">
            <label htmlFor="category-filter" className="font-semibold">Filter:</label>
            <select id="category-filter"
              value={filterCategory}
              onChange={e => { setFilterCategory(e.target.value as CategoryId); setSelectedNode(null); }}
              className="ml-2 p-1 border rounded"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.slice(1).map(cat => {
              let bgColor = '';
              switch (cat.id) {
                case 'traditional':   bgColor = 'bg-blue-100 hover:bg-blue-200';    break;
                case 'agile':         bgColor = 'bg-green-100 hover:bg-green-200';  break;
                case 'collaboration': bgColor = 'bg-purple-100 hover:bg-purple-200';break;
                case 'lowcode':       bgColor = 'bg-yellow-100 hover:bg-yellow-200';break;
                case 'mobile':        bgColor = 'bg-orange-100 hover:bg-orange-200';break;
                case 'ai':            bgColor = 'bg-red-100 hover:bg-red-200';      break;
              }
              return (
                <button 
                  key={cat.id}
                  className={`px-2 py-1 text-xs rounded border cursor-pointer ${
                    filterCategory === cat.id ? 'font-bold border-gray-500' : 'border-gray-300'
                  } ${bgColor}`}
                  aria-pressed={filterCategory === cat.id}
                  onClick={() => { setFilterCategory(cat.id === filterCategory ? 'all' : (cat.id as CategoryId)); setSelectedNode(null); }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="timeline-scroll" tabIndex={0} aria-label="Software timeline; scroll horizontally"><div className="timeline-wide">
        {/* Timeline era bands */}
        <div className="flex w-full border-b">
          {eras.map((era, index) => (
            <div 
              key={era.id} 
              className={`${era.color} p-2 text-center font-semibold border-r`}
              style={{ width: `${(index === eras.length - 1 ? 2 : 5) / 22 * 100}%` }}
            >
              {era.name}
            </div>
          ))}
        </div>

        {/* Year labels from 2004 to 2025 */}
        <div className="flex border-b text-xs bg-gray-50">
          {Array.from({ length: yearSpan + 1 }, (_, i) => (
            <div 
              key={i} 
              className="text-center border-r py-1" 
              style={{ width: `${100 / (yearSpan + 1)}%` }}
            >
              {startYear + i}
            </div>
          ))}
        </div>

        {/* Main visualization container */}
        <div className="relative" style={{ height: '600px' }}>
          {/* Vertical grid lines across the timeline */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${yearSpan + 1}, 1fr)` }}>
              {Array.from({ length: yearSpan + 1 }, (_, i) => (
                <div key={i} className="h-full border-r border-gray-200"></div>
              ))}
            </div>
          </div>

          {/* Canvas overlay for connection lines */}
          <ConnectionLines />

          {/* Rows for each category (excluding 'All'), containing nodes */}
          {categories.slice(1).map((cat, catIndex) => (
            <div 
              key={cat.id}
              className="absolute left-0 w-full border-b pb-8"
              style={{ top: `${catIndex * 100}px` }}
            >
              {/* Category label on the left of each row */}
              <div className="absolute left-0 px-2 py-1 bg-white border rounded shadow-sm z-20 font-semibold">
                {cat.name}
              </div>
              {/* Nodes for this category */}
              {nodesByCategory[cat.id].map(node => {
                const xPos = getYearPosition(node.year);
                const isSelected = selectedNode && selectedNode.id === node.id;
                return (
                  <div 
                    key={node.id}
                    id={getNodeDomId(node.id)}
                    ref={el => (nodeRefs.current[getNodeDomId(node.id)] = el)}
                    className={`absolute p-2 rounded-md border cursor-pointer z-20 ${getNodeColor(node.category)} ${
                      isSelected ? 'shadow-lg border-gray-500 border-2' : 'shadow'
                    }`}
                    style={{
                      left: `${xPos}%`,
                      top: '20px',
                      transform: 'translate(-50%, 0)',
                      width: '105px'
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.name}, ${node.year}`}
                    aria-pressed={Boolean(isSelected)}
                    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleNodeClick(node); } }}
                    onClick={() => handleNodeClick(node)}
                  >
                    <div className="text-sm font-bold mb-1">{node.name}</div>
                    <div className="text-xs text-gray-600">{node.year}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        </div></div>
        <details className="p-4"><summary>Browse all visible entries as a list ({filteredNodes.length})</summary><ul>{filteredNodes.map(node => <li key={node.id}><button onClick={() => handleNodeClick(node)}>{node.year} · {node.name}</button> — {node.description}</li>)}</ul></details>
        {/* Details panel (below the timeline) */}
        <div className="border-t p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            {/* Left column: Node details */}
            <div>
              {selectedNode ? (
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedNode.name} ({selectedNode.year})
                  </h3>
                  <div className="flex space-x-2 my-1">
                    {/* Category badge for selected node */}
                    {selectedCategory && (
                      <span className={`px-2 py-1 text-xs rounded ${getNodeColor(selectedNode.category)}`}>
                        {selectedCategory.name}
                      </span>
                    )}
                    {/* Era badge for selected node */}
                    {selectedEra && (
                      <span className="px-2 py-1 text-xs rounded bg-gray-200">
                        {selectedEra.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm">{selectedNode.description}</p>
                  {selectedNode.source && <p><a href={selectedNode.source}>Primary source for this milestone</a></p>}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p className="font-semibold">Click on a node to view details</p>
                  <p className="mt-2 text-sm">
                    This visualization shows the evolution of project management software from 2004–2025.
                  </p>
                </div>
              )}
            </div>

            {/* Right column: Influence connections (incoming/outgoing) */}
            {selectedNode && (
              <div>
                <div className="rounded border bg-white p-3">
                  <p className="text-sm">Arrow direction shows a proposed relationship, not chronological order. Corrected milestone dates can run against the original arrows.</p>
                  <h4 className="font-semibold border-b pb-1 mb-2">Incoming proposed relationships:</h4>
                  <ul className="text-sm">
                    {connections
                      .filter(conn => conn.target === selectedNode.id)
                      .map(conn => {
                        const sourceNode = nodes.find(n => n.id === conn.source);
                        if (!sourceNode) return null;
                        return (
                          <li key={`in-${conn.source}`} className="mt-1 flex items-start">
                            <span className="mr-1">←</span>
                            <button
                              className="font-medium text-blue-600 hover:underline text-left"
                              onClick={() => handleNodeClick(sourceNode)}
                            >
                              {sourceNode.name} ({sourceNode.year})
                            </button>
                            <span className="ml-1 text-gray-600">: {conn.description}</span>
                          </li>
                        );
                      })}
                    {connections.filter(conn => conn.target === selectedNode.id).length === 0 && (
                      <li className="text-gray-500 italic">No incoming proposed relationships</li>
                    )}
                  </ul>

                  <h4 className="font-semibold border-b pb-1 mt-4 mb-2">Outgoing proposed relationships:</h4>
                  <ul className="text-sm">
                    {connections
                      .filter(conn => conn.source === selectedNode.id)
                      .map(conn => {
                        const targetNode = nodes.find(n => n.id === conn.target);
                        if (!targetNode) return null;
                        return (
                          <li key={`out-${conn.target}`} className="mt-1 flex items-start">
                            <span className="mr-1">→</span>
                            <button
                              className="font-medium text-blue-600 hover:underline text-left"
                              onClick={() => handleNodeClick(targetNode)}
                            >
                              {targetNode.name} ({targetNode.year})
                            </button>
                            <span className="ml-1 text-gray-600">: {conn.description}</span>
                          </li>
                        );
                      })}
                    {connections.filter(conn => conn.source === selectedNode.id).length === 0 && (
                      <li className="text-gray-500 italic">No outgoing proposed relationships</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Legend: connection types and category colors */}
          <div className="flex items-center justify-center mt-4 text-sm gap-8 pt-3 border-t">
            <div>
              <div className="font-semibold mb-1">Connection types:</div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-black"></div>
                <span className="ml-2">Proposed evolution</span>
              </div>
              <div className="flex items-center mt-1">
                <div className="w-8 h-0.5 bg-gray-500 border-dashed border-t border-gray-500"></div>
                <span className="ml-2">Proposed connection</span>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Categories:</div>
              <div className="flex flex-wrap gap-1">
                <div className="px-2 py-1 bg-blue-100 border-blue-400 border rounded text-xs">Traditional</div>
                <div className="px-2 py-1 bg-green-100 border-green-400 border rounded text-xs">Agile</div>
                <div className="px-2 py-1 bg-purple-100 border-purple-400 border rounded text-xs">Collaboration</div>
                <div className="px-2 py-1 bg-yellow-100 border-yellow-400 border rounded text-xs">Low-Code</div>
                <div className="px-2 py-1 bg-orange-100 border-orange-400 border rounded text-xs">Mobile</div>
                <div className="px-2 py-1 bg-red-100 border-red-400 border rounded text-xs">AI</div>
              </div>
            </div>
          </div>
        </div>
        <ProjectControlsTransformation />
      </div>
    </div>
  );
};

export default PMSoftwareEvolution;
