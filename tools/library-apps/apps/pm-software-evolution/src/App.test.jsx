import { expect, test, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App.tsx';
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => ({ clearRect() {}, beginPath() {}, moveTo() {}, bezierCurveTo() {}, lineTo() {}, stroke() {}, setLineDash() {} });
});
test('keeps a 2004–2025 timeline, category filtering, keyboard details and corrected source links', () => {
  render(<App />);
  expect(screen.queryByText('2026')).not.toBeInTheDocument();
  const jira = screen.getByRole('button', { name: 'JIRA Agile, 2013' });
  fireEvent.keyDown(jira, { key: 'Enter' });
  expect(screen.getByRole('link', { name: 'Primary source for this milestone' })).toHaveAttribute('href', 'https://www.atlassian.com/blog/archives/simplify%24');
  fireEvent.change(screen.getByLabelText('Filter:'), { target: { value: 'mobile' } });
  expect(screen.queryByRole('button', { name: 'JIRA Agile, 2013' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Mobile PM Apps, 2015' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Primary source for this milestone' })).not.toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('button', { name: 'Mobile PM Apps, 2015' }), { key: ' ' });
  fireEvent.click(screen.getByRole('button', { name: 'Trello (2011)' }));
  expect(screen.getByLabelText('Filter:')).toHaveValue('all');
  expect(screen.getByRole('button', { name: 'Trello, 2011' })).toHaveAttribute('aria-pressed', 'true');
});
