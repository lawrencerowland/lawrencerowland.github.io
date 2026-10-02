import React from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App, { schema } from './App'

const graph = vi.hoisted(() => ({ props: null, zoom: vi.fn(() => 1), fit: vi.fn() }))
vi.mock('react-force-graph-2d', () => ({
  default: React.forwardRef((props, ref) => {
    graph.props = props
    React.useImperativeHandle(ref, () => ({ zoom: graph.zoom, zoomToFit: graph.fit }))
    return <canvas data-testid="graph" />
  })
}))

afterEach(() => { cleanup(); vi.clearAllMocks() })

test('preserves all concepts and edges, including isolated concepts', async () => {
  const user = userEvent.setup()
  render(<App />)
  expect(schema.nodes).toHaveLength(23)
  expect(schema.links).toHaveLength(11)
  expect(graph.props.graphData.nodes).toHaveLength(23)
  expect(screen.getByText('Stakeholder → claim: demands')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'veto' }))
  expect(screen.getByText(/No connections have been recorded/)).toBeInTheDocument()
})

test('instruction and selection changes preserve the force-layout data instance', async () => {
  const user = userEvent.setup()
  render(<App />)
  const initialData = graph.props.graphData
  await user.click(screen.getByRole('button', { name: 'Show Instructions' }))
  expect(graph.props.graphData).toBe(initialData)
  await user.click(screen.getByRole('button', { name: 'Project role' }))
  expect(graph.props.graphData).toBe(initialData)
  expect(screen.getByText('Project role → External project: has project interfaces')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Reset layout' }))
  expect(graph.props.graphData).not.toBe(initialData)
  expect(schema.links[0].source).toBe('Stakeholder')
})

test('graph view buttons operate the graph camera', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Zoom in' }))
  expect(graph.zoom).toHaveBeenCalledWith(1.2, 200)
  await user.click(screen.getByRole('button', { name: 'Zoom out' }))
  expect(graph.zoom).toHaveBeenCalledWith(1 / 1.2, 200)
  await user.click(screen.getByRole('button', { name: 'Fit graph' }))
  expect(graph.fit).toHaveBeenCalledWith(300, 40)
})

test('automatic fitting happens once per reset rather than overriding later camera choices', async () => {
  const user = userEvent.setup()
  render(<App />)
  graph.props.onEngineStop()
  graph.props.onEngineStop()
  expect(graph.fit).toHaveBeenCalledTimes(1)
  await user.click(screen.getByRole('button', { name: 'Reset layout' }))
  graph.props.onEngineStop()
  expect(graph.fit).toHaveBeenCalledTimes(2)
})
