import React, { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import './App.css'
import Instructions from './Instructions'

// An illustrative concept schema, not observations of named stakeholders.
export const schema = {
    nodes: [
      { id: 'Stakeholder', color: 'yellow' },
      { id: 'claim' },
      { id: 'collaboration_style' },
      { id: 'Public_press_presence' },
      { id: 'Internal_stakeholders' },
      { id: 'User_engagement' },
      { id: 'External_event' },
      { id: 'Public_persona' },
      { id: 'Level_of_project_support' },
      { id: 'Outgoing_communication' },
      { id: 'reasoning_style' },
      { id: 'Project_awareness' },
      { id: 'Level_of_formal_representation' },
      { id: 'Stakeholder_importance' },
      { id: 'Project_role' },
      { id: 'External_project' },
      { id: 'Project_scope' },
      { id: 'Business_theme' },
      { id: 'product_Breakdown_structure' },
      { id: 'externality' },
      { id: 'agreement' },
      { id: 'veto' },
      { id: 'Post_project_role' },
    ],
    links: [
      { source: 'Stakeholder', target: 'claim', label: 'demands' },
      { source: 'Stakeholder', target: 'collaboration_style' },
      { source: 'Stakeholder', target: 'Public_press_presence' },
      { source: 'Stakeholder', target: 'Internal_stakeholders' },
      { source: 'Stakeholder', target: 'Project_role', label: 'has_project_role' },
      { source: 'Project_role', target: 'External_project', label: 'has_project_interfaces' },
      { source: 'External_project', target: 'Project_scope', label: 'has_interface_to' },
      { source: 'Public_persona', target: 'Level_of_project_support', label: 'interacts_with' },
      { source: 'Stakeholder', target: 'Project_awareness', label: 'has_level_of_awareness' },
      { source: 'Business_theme', target: 'Stakeholder', label: 'relates_to' },
      { source: 'Stakeholder', target: 'External_event', label: 'has_caused' },
    ],
  };

const label = id => id.replaceAll('_', ' ')
const endpointId = endpoint => typeof endpoint === 'object' ? endpoint.id : endpoint

export default function App() {
  const [showInstructions, setShowInstructions] = useState(false)
  const [selectedId, setSelectedId] = useState('Stakeholder')
  const [layoutVersion, setLayoutVersion] = useState(0)
  const [width, setWidth] = useState(800)
  const graphRef = useRef(null)
  const hostRef = useRef(null)
  const fittedLayoutRef = useRef(-1)
  // The force library mutates nodes and link endpoints. Keep a stable, private copy.
  const data = useMemo(() => ({
    nodes: schema.nodes.map(node => ({ ...node })),
    links: schema.links.map(link => ({ ...link }))
  }), [layoutVersion])
  const relationships = schema.links.filter(link => link.source === selectedId || link.target === selectedId)

  useEffect(() => {
    const resize = () => setWidth(Math.max(240, hostRef.current?.clientWidth || 800))
    resize()
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(resize)
      observer.observe(hostRef.current)
      return () => observer.disconnect()
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <main className="app-container">
      <h1>Interactive Stakeholder Graph</h1>
      <p>Explore a draft schema of stakeholder concepts: {schema.nodes.length} concepts and {schema.links.length} recorded connections. These are model ideas, not a measured social network.</p>
      <button aria-expanded={showInstructions} onClick={() => setShowInstructions(!showInstructions)}>
        {showInstructions ? 'Hide' : 'Show'} Instructions
      </button>
      {showInstructions && <Instructions />}
      <div className="graph-controls" aria-label="Graph view controls">
        <button onClick={() => graphRef.current?.zoom(graphRef.current.zoom() * 1.2, 200)}>Zoom in</button>
        <button onClick={() => graphRef.current?.zoom(graphRef.current.zoom() / 1.2, 200)}>Zoom out</button>
        <button onClick={() => graphRef.current?.zoomToFit(300, 40)}>Fit graph</button>
        <button onClick={() => setLayoutVersion(version => version + 1)}>Reset layout</button>
      </div>
      <div ref={hostRef} className="graph-host" role="group" aria-label="Stakeholder concept map; select concepts in the list below for keyboard access">
      <ForceGraph2D
        key={layoutVersion}
        ref={graphRef}
        width={width}
        height={500}
        graphData={data}
        nodeAutoColorBy="id"
        nodeLabel={node => label(node.id)}
        nodeColor={node => node.id === selectedId ? '#a44712' : node.color || '#2d6d9a'}
        nodeCanvasObjectMode={() => 'after'}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const text = label(node.id)
          const fontSize = 11 / globalScale
          ctx.font = `${fontSize}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          const textWidth = ctx.measureText(text).width
          ctx.fillStyle = 'rgba(255,255,255,0.88)'
          ctx.fillRect(node.x - textWidth / 2 - 2, node.y + 6, textWidth + 4, fontSize + 2)
          ctx.fillStyle = node.id === selectedId ? '#81340e' : '#23384a'
          ctx.fillText(text, node.x, node.y + 7)
        }}
        cooldownTicks={100}
        linkLabel={link => `${label(endpointId(link.source))} → ${label(endpointId(link.target))}: ${link.label ? label(link.label) : 'relationship type not specified'}`}
        linkDirectionalArrowLength={5}
        onNodeClick={node => setSelectedId(node.id)}
        onEngineStop={() => {
          if (fittedLayoutRef.current !== layoutVersion) {
            graphRef.current?.zoomToFit(300, 40)
            fittedLayoutRef.current = layoutVersion
          }
        }}
      />
      </div>
      <section aria-labelledby="concept-list-heading">
        <h2 id="concept-list-heading">Browse concepts</h2>
        <div className="concept-list">
          {schema.nodes.map(node => <button key={node.id} aria-pressed={selectedId === node.id} onClick={() => setSelectedId(node.id)}>{label(node.id)}</button>)}
        </div>
        <div aria-live="polite">
          <h3>{label(selectedId)}</h3>
          {relationships.length ? <ul>{relationships.map((link, index) => <li key={index}>
            {label(link.source)} → {label(link.target)}: {link.label ? label(link.label) : 'relationship type not specified'}
          </li>)}</ul> : <p>No connections have been recorded for this concept. Its presence does not imply a relationship.</p>}
        </div>
      </section>
    </main>
  )
}
