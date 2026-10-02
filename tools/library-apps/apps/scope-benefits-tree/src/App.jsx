import React from 'react';
import ReactFlow, { Background, Controls, MarkerType, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

export const initialNodes = [
  { id: 'scope', position: { x: 0, y: 0 }, data: { label: 'Scope' }, style: { background: '#b7eb8f' } },
  { id: 'track', position: { x: 200, y: -120 }, data: { label: 'Track Sections' }, style: { background: '#b7eb8f' } },
  { id: 'stations', position: { x: 200, y: 0 }, data: { label: 'Stations' }, style: { background: '#b7eb8f' } },
  { id: 'integration', position: { x: 200, y: 120 }, data: { label: 'Service Integration' }, style: { background: '#b7eb8f' } },
  { id: 'track_built', position: { x: 400, y: -120 }, data: { label: 'Track built' }, style: { background: '#b7eb8f' } },
  { id: 'stations_improved', position: { x: 400, y: 0 }, data: { label: 'Stations improved' }, style: { background: '#b7eb8f' } },
  { id: 'timetable', position: { x: 400, y: 120 }, data: { label: 'Timetable integrated' }, style: { background: '#b7eb8f' } },

  { id: 'benefits', position: { x: 1000, y: 0 }, data: { label: 'Benefits' }, style: { background: '#91d5ff' } },
  { id: 'growth', position: { x: 800, y: -120 }, data: { label: 'Economic Growth' }, style: { background: '#91d5ff' } },
  { id: 'congestion', position: { x: 800, y: 0 }, data: { label: 'Less Congestion' }, style: { background: '#91d5ff' } },
  { id: 'environment', position: { x: 800, y: 120 }, data: { label: 'Environmental' }, style: { background: '#91d5ff' } },
  { id: 'jobs', position: { x: 600, y: -120 }, data: { label: 'More Jobs' }, style: { background: '#91d5ff' } },
  { id: 'faster', position: { x: 600, y: 0 }, data: { label: 'Faster Travel' }, style: { background: '#91d5ff' } },
  { id: 'cleaner', position: { x: 600, y: 120 }, data: { label: 'Lower Emissions' }, style: { background: '#91d5ff' } },
];

export const edges = [
  { id: 'e1', source: 'scope', target: 'track' },
  { id: 'e2', source: 'scope', target: 'stations' },
  { id: 'e3', source: 'scope', target: 'integration' },
  { id: 'e4', source: 'track', target: 'track_built' },
  { id: 'e5', source: 'stations', target: 'stations_improved' },
  { id: 'e6', source: 'integration', target: 'timetable' },

  { id: 'e7', source: 'benefits', target: 'growth' },
  { id: 'e8', source: 'benefits', target: 'congestion' },
  { id: 'e9', source: 'benefits', target: 'environment' },
  { id: 'e10', source: 'growth', target: 'jobs' },
  { id: 'e11', source: 'congestion', target: 'faster' },
  { id: 'e12', source: 'environment', target: 'cleaner' },

  // cross connections
  { id: 'c1', source: 'track_built', target: 'faster', animated: true },
  { id: 'c2', source: 'stations_improved', target: 'faster', animated: true },
  { id: 'c3', source: 'timetable', target: 'jobs', animated: true },
  { id: 'c4', source: 'timetable', target: 'cleaner', animated: true },
].map(edge => ({
  ...edge,
  markerEnd: { type: MarkerType.ArrowClosed },
  label: edge.id.startsWith('c') ? 'may contribute to' : 'contains',
}));

const contributionAssumptions = [
  { source: 'Track built', target: 'Faster Travel', assumption: 'Services, capacity and operating speeds must turn the new infrastructure into shorter door-to-door journeys.' },
  { source: 'Stations improved', target: 'Faster Travel', assumption: 'Access, interchange and service patterns must reduce total journey time; station works alone do not guarantee this.' },
  { source: 'Timetable integrated', target: 'More Jobs', assumption: 'Improved access must connect people to opportunities, with sufficient labour demand and complementary investment.' },
  { source: 'Timetable integrated', target: 'Lower Emissions', assumption: 'A shift from higher-emission travel must outweigh construction and operating emissions over the assessment period.' },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  return (
    <main className="app-container">
      <h1>Scope to Benefits Tree: East West Rail</h1>
      <p>A teaching sketch inspired by a rail scheme. The named scope and benefits are illustrative; this is not an approved East West Rail scope, business case or evidence of realised benefits.</p>
      <p>Green nodes break scope into deliverables. Blue nodes group intended benefits. Solid “contains” arrows show each tree’s grouping; animated “may contribute to” arrows are hypotheses linking delivery to benefit.</p>
      <p>Drag nodes to rearrange them, pan the background, and use the zoom and fit controls. The lists below provide the same content without using the diagram.</p>
      <button type="button" onClick={() => setNodes(initialNodes.map(node => ({ ...node, position: { ...node.position } })))}>Reset node positions</button>
      <div style={{ height: '600px', width: '100%' }}>
        <ReactFlow nodes={nodes} onNodesChange={onNodesChange} edges={edges} nodesConnectable={false} minZoom={0.1} fitViewOptions={{ padding: 0.2, minZoom: 0.1, maxZoom: 1 }} fitView className="tree-flow">
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <section>
        <h2>Read the two trees</h2>
        <ul>
          <li>Scope → Track Sections → Track built</li>
          <li>Scope → Stations → Stations improved</li>
          <li>Scope → Service Integration → Timetable integrated</li>
          <li>Benefits → Economic Growth → More Jobs</li>
          <li>Benefits → Less Congestion → Faster Travel</li>
          <li>Benefits → Environmental → Lower Emissions</li>
        </ul>
        <h2>Test the contribution hypotheses</h2>
        <p>A connection records a question to investigate, not a causal proof. Benefits also depend on demand, service design, behaviour and wider conditions; no benefit values are calculated here.</p>
        <dl>{contributionAssumptions.map(item => <React.Fragment key={`${item.source}-${item.target}`}>
          <dt>{item.source} → {item.target}</dt><dd>{item.assumption}</dd>
        </React.Fragment>)}</dl>
      </section>
    </main>
  );
}
