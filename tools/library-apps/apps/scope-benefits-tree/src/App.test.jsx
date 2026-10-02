import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App, { initialNodes, edges } from './App';

// Keep ReactFlow's real node-change reducer; replace only the canvas surface.
vi.mock('reactflow', async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: ({ children, nodes, onNodesChange, nodesConnectable }) => <div className="tree-flow" data-connectable={String(nodesConnectable)}>
      <output aria-label="Scope position">{nodes.find(node => node.id === 'scope').position.x}</output>
      <button onClick={() => onNodesChange([{ id: 'scope', type: 'position', position: { x: 75, y: 20 } }])}>Drag scope test</button>
      {children}
    </div>,
    Background: () => null,
    Controls: () => null,
  };
});

afterEach(cleanup);

test('preserves all fourteen concepts and sixteen links with valid endpoints', () => {
  expect(initialNodes).toHaveLength(14);
  expect(edges).toHaveLength(16);
  expect(edges.filter(edge => edge.animated)).toHaveLength(4);
  const ids = new Set(initialNodes.map(node => node.id));
  edges.forEach(edge => {
    expect(ids.has(edge.source) && ids.has(edge.target)).toBe(true);
    expect(edge.label).toBe(edge.id.startsWith('c') ? 'may contribute to' : 'contains');
  });
});

test('retains dragged node positions and resets them', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Drag scope test' }));
  expect(screen.getByLabelText('Scope position')).toHaveTextContent('75');
  fireEvent.click(screen.getByRole('button', { name: 'Reset node positions' }));
  expect(screen.getByLabelText('Scope position')).toHaveTextContent('0');
  expect(document.querySelector('.tree-flow')).toHaveAttribute('data-connectable', 'false');
});

test('provides readable tree paths and conditional benefit explanations', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Scope to Benefits Tree/ })).toBeInTheDocument();
  expect(screen.getByText(/not an approved East West Rail scope/)).toBeInTheDocument();
  expect(screen.getByText('Scope → Track Sections → Track built')).toBeInTheDocument();
  expect(screen.getByText(/shift from higher-emission travel/)).toBeInTheDocument();
});
