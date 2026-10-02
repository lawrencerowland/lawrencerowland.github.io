import { expect, test, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App, { connectedProfileNodes } from './app.jsx';
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});
test('does not switch model identity through an intermediate capability', () => {
  const start = { id: 'input', models: ['a'] };
  const other = { id: 'output', models: ['b'] };
  const layers = { inputs: [start], processing: [{ id: 'shared', models: ['a', 'b'] }], outputs: [other] };
  expect(connectedProfileNodes(layers, start, null).outputs).toEqual([]);
  expect(connectedProfileNodes(layers, start, 'b').processing).toEqual([]);
});
test('makes descriptions, filters and explanatory dialog accessible', () => {
  render(<App />);
  const card = screen.getByRole('button', { name: /^Structured Files:/ });
  fireEvent.focus(card);
  expect(screen.getByRole('heading', { name: 'Structured Files' })).toBeInTheDocument();
  fireEvent.click(card);
  expect(card).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Gemini 1.5 Pro' }));
  expect(screen.getByRole('button', { name: /^Interactive Visuals:/ })).toHaveStyle({ opacity: '0.3' });
  fireEvent.click(screen.getByRole('button', { name: 'About this diagram' }));
  expect(screen.getByRole('dialog', { name: 'About This Diagram' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Close diagram information' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
