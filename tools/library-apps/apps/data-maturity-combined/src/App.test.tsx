import { expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
test('graph places cross-cutting questions under their own capability, matching the table', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Expand Data Literacy & Skills' }));
  expect(screen.getByRole('button', { name: /^Q19:/ })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /^Q21:/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Expand Data Governance & Security' }));
  expect(screen.getByRole('button', { name: /^Q21:/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Expand Data Integration & Sharing' }));
  expect(screen.getByRole('button', { name: /^Q27:/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /^Q27:/ }));
  expect(screen.getByRole('region', { name: 'Framework detail' })).toHaveTextContent('DIS');
  fireEvent.click(screen.getByRole('button', { name: 'Close details' }));
  expect(screen.queryByRole('region', { name: 'Framework detail' })).not.toBeInTheDocument();
});
test('retains all 30 questions, filters across views and original prompt', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Table View' }));
  expect(screen.getAllByRole('row')).toHaveLength(31);
  fireEvent.click(screen.getByRole('button', { name: 'Individual' }));
  expect(screen.getAllByRole('row')).toHaveLength(11);
  fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
  expect(screen.getAllByRole('row')).toHaveLength(31);
  fireEvent.click(screen.getByRole('button', { name: 'Original Prompt' }));
  expect(screen.getByRole('region', { name: 'Framework detail' })).toHaveTextContent('three mutually supporting levels');
});
