import { expect, test, beforeAll } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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


test('keeps proposed arrow direction separate from the corrected milestone chronology', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'ClickUp, 2017', exact: true }));
  const incoming = screen.getByRole('heading', { name: 'Incoming proposed relationships:' }).nextElementSibling;
  expect(within(incoming).getByRole('button', { name: 'Notion (2018)' })).toBeInTheDocument();
  const lowCode = within(incoming).getByRole('button', { name: 'Low-Code PM (2019)' });
  expect(lowCode).toBeInTheDocument();
  expect(screen.getByText(/Arrow direction shows a proposed relationship, not chronological order/)).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /Related (earlier|later) entries/ })).not.toBeInTheDocument();

  // Follow an incoming connection forward in calendar time, then its outgoing
  // counterpart back to 2017: neither relationship label may imply chronology.
  fireEvent.click(lowCode);
  expect(screen.getByRole('heading', { name: 'Low-Code PM (2019)' })).toBeInTheDocument();
  const outgoing = screen.getByRole('heading', { name: 'Outgoing proposed relationships:' }).nextElementSibling;
  fireEvent.click(within(outgoing).getByRole('button', { name: 'ClickUp (2017)' }));
  expect(screen.getByRole('heading', { name: 'ClickUp (2017)' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'ClickUp, 2017', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
