import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
vi.mock('react-chartjs-2', () => ({ Line: ({ data }) => <div data-testid="chart">{data.datasets.map(row => row.label).join(', ')}</div> }));
import App from './App';
test('selects a strategy without a pointer, reveals the improvement and explanation, then resets', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/Project strategy/), { target: { value: '25' } });
  expect(screen.getByText(/real progress 50.0/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'See Solution' }));
  expect(screen.getByText(/illustrative improved real progress 70.0/)).toBeInTheDocument();
  expect(screen.getByTestId('chart')).toHaveTextContent('Illustrative improvement');
  fireEvent.click(screen.getByRole('button', { name: 'Explanation' }));
  expect(screen.getByText(/not a perpendicular vector/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.queryByText(/Selected strategy:/)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'See Solution' })).not.toBeInTheDocument();
});
