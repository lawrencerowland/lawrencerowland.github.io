import { expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MarketTimelineExplorer from './app.jsx';
test('retains all quarters, bounded navigation and transition explanations with scenario framing', () => {
  render(<MarketTimelineExplorer />);
  expect(screen.getByText(/Every quarter below is an invented scenario/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Previous quarter' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: /Q3\s2026/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Next quarter' }));
  expect(screen.getByText('Compute‑squeeze')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Q4\s2026/ })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: /Q4\s2030/ }));
  expect(screen.getByRole('button', { name: 'Next quarter' })).toBeDisabled();
  expect(screen.getByText('Open‑standard flowering')).toBeInTheDocument();
});
