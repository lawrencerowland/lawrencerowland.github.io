import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

afterEach(cleanup);

test('preserves all stakeholder charts with readable signed source data', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Stakeholder Analysis Dashboard' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Stakeholder Network Graph' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Stakeholder Alignment vs Influence Matrix' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Stakeholder Sentiment Analysis' })).toBeInTheDocument();
  expect(screen.getByText('-0.4')).toBeInTheDocument();
  expect(screen.getByRole('table')).toHaveTextContent('Environmental Groups');
  expect(screen.getByText(/fictional transport-project example/)).toBeInTheDocument();
});

test('switches role, filters across fields, sorts and gives an empty state', async () => {
  const user = userEvent.setup();
  render(<App />);
  const director = screen.getByRole('button', { name: 'Business Case Director View' });
  await user.click(director);
  expect(director).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText('-0.6')).toBeInTheDocument();
  await user.type(screen.getByLabelText('Filter objectives, stakeholders or opinions'), 'critical');
  expect(screen.getByRole('status')).toHaveTextContent('1 of 5');
  expect(screen.getByRole('table')).toHaveTextContent('Environmental Groups');
  await user.clear(screen.getByLabelText('Filter objectives, stakeholders or opinions'));
  await user.selectOptions(screen.getByLabelText('Sort objectives by'), 'stakeholder');
  const rows = within(screen.getByRole('table')).getAllByRole('row');
  expect(rows[1]).toHaveTextContent('Business Associations');
  await user.type(screen.getByLabelText('Filter objectives, stakeholders or opinions'), 'no match');
  expect(screen.getByText('No objectives match this filter.')).toBeInTheDocument();
});
