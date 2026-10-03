import { afterEach, beforeEach, expect, test } from 'vitest';
import { cleanup, render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarketTimelineExplorer from './app.jsx';
import { readSelection, stories, archetypes } from './stories';
import { geminiSnapshots, navigatorQuarters, marketSlices, marketTransitions } from './narratives';

beforeEach(() => window.history.replaceState(null, '', '/'));
afterEach(cleanup);

test('retains all existing quarters, bounded navigation and six transition explanations with scenario framing', () => {
  render(<MarketTimelineExplorer />);
  expect(screen.getByText(/Every quarter below is an invented scenario/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Previous quarter' })).toBeDisabled();
  expect(within(screen.getByRole('group', { name: 'Story periods' })).getAllByRole('button')).toHaveLength(23);
  for (const t of marketTransitions) {
    const period = stories.market.periods.find(p => p.id === t.to);
    fireEvent.click(screen.getByRole('button', { name: new RegExp('^' + period.label.replace(/\s/g, '\\s')) }));
    expect(screen.getByText(`Imagined transition: ${t.label}`)).toBeInTheDocument();
    expect(screen.getByText(t.description)).toBeInTheDocument();
  }
  expect(screen.getByRole('button', { name: 'Next quarter' })).toBeDisabled();
  expect(screen.getByText('Open‑standard coalition')).toBeInTheDocument();
  expect(window.location.hash).toBe('#story=market&period=2030Q4');
});

test('all imported quarters retain lists, dynamics, force and all 60 strategic prompts', () => {
  expect(marketSlices).toHaveLength(23);
  expect(marketTransitions).toHaveLength(6);
  expect(geminiSnapshots).toHaveLength(12);
  expect(Object.keys(navigatorQuarters)).toHaveLength(20);
  expect(Object.values(navigatorQuarters).flatMap(q => q.questions)).toHaveLength(60);
  expect(archetypes).toHaveLength(5);
  window.history.replaceState(null, '', '/#navigator');
  render(<MarketTimelineExplorer />);
  for (const [label, source] of Object.entries(navigatorQuarters)) {
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${label}`) }));
    expect(screen.getByRole('heading', { name: source.phase, exact: true })).toBeInTheDocument();
    expect(screen.getByText(source.phaseDescription)).toBeInTheDocument();
    const snapshot = screen.getByRole('article');
    for (const text of [...source.winners, ...source.losers, ...source.coalitions, ...source.dynamics, source.transition]) {
      expect(within(snapshot).getAllByText(text).length).toBeGreaterThan(0);
    }
    for (const q of source.questions) expect(screen.getByRole('button', { name: q })).toBeInTheDocument();
  }
  expect(screen.getByRole('button', { name: 'Next quarter' })).toBeDisabled();
});

test('archetype story preserves uneven periods, all snapshots and definitions', () => {
  window.history.replaceState(null, '', '/#gemini');
  render(<MarketTimelineExplorer />);
  expect(within(screen.getByRole('group', { name: 'Story periods' })).getAllByRole('button')).toHaveLength(12);
  for (const [name, role] of archetypes) {
    expect(screen.getByText(name, { selector: 'dt' })).toBeInTheDocument();
    expect(screen.getByText(role, { selector: 'dd' })).toBeInTheDocument();
  }
  for (const [i, source] of geminiSnapshots.entries()) {
    const period = stories.gemini.periods[i];
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${period.label}`) }));
    expect(screen.getByText(source.subtitle)).toBeInTheDocument();
    expect(screen.getByText(source.dynamic)).toBeInTheDocument();
  }
  fireEvent.click(screen.getByRole('button', { name: 'Q3 2027–Q1 2029' }));
  expect(screen.getByRole('heading', { name: 'Uneven Plateau' })).toBeInTheDocument();
  expect(window.location.hash).toBe('#story=gemini&period=2027Q3');
});

test('source forwards and period links open the intended story, with safe invalid fallback', () => {
  expect(readSelection('#gemini')).toEqual({ storyId: 'gemini', index: 0 });
  expect(readSelection('#navigator')).toEqual({ storyId: 'navigator', index: 0 });
  expect(readSelection('#story=gemini&period=2026Q4')).toEqual({ storyId: 'gemini', index: 5 });
  expect(readSelection('#story=navigator&period=2029Q2')).toEqual({ storyId: 'navigator', index: 13 });
  expect(readSelection('#story=__proto__&period=bad')).toEqual({ storyId: 'market', index: 0 });
  window.history.replaceState(null, '', '/#story=gemini&period=2026Q4');
  render(<MarketTimelineExplorer />);
  expect(screen.getByRole('heading', { name: 'AGI SHOCK' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Strategic questions 20 quarters/ }));
  expect(screen.getByRole('heading', { name: 'AGI Arrives', exact: true })).toBeInTheDocument();
  expect(window.location.hash).toBe('#story=navigator&period=2026Q4');
});

test('keyboard navigation, external fragments and premise reflection are usable', () => {
  window.history.replaceState(null, '', '/#navigator');
  render(<MarketTimelineExplorer />);
  const first = screen.getByRole('button', { name: 'Q1 2026' });
  first.focus();
  fireEvent.keyDown(first, { key: 'ArrowRight' });
  expect(screen.getByRole('button', { name: 'Q2 2026' })).toHaveFocus();
  fireEvent.keyDown(document.activeElement, { key: 'End' });
  expect(screen.getByRole('button', { name: 'Q4 2030' })).toHaveFocus();
  fireEvent.keyDown(document.activeElement, { key: 'Home' });
  expect(first).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: navigatorQuarters['Q1 2026'].questions[1] }));
  expect(screen.getByText('Test the premise')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Next quarter' }));
  expect(screen.queryByText('Test the premise')).not.toBeInTheDocument();
  window.history.replaceState(null, '', '/#gemini');
  fireEvent(window, new HashChangeEvent('hashchange'));
  expect(screen.getByRole('heading', { name: 'Pre-Divergence' })).toBeInTheDocument();
  window.history.replaceState(null, '', '/#root');
  fireEvent(window, new HashChangeEvent('hashchange'));
  expect(screen.getByRole('heading', { name: 'Pre-Divergence' })).toBeInTheDocument();
  expect(screen.getByText(/two retired catalogue descriptions said/)).toBeInTheDocument();
});


test('arrows navigate from a tab-focused unselected period, not the prior selection', async () => {
  window.history.replaceState(null, '', '/#navigator');
  const user = userEvent.setup();
  render(<MarketTimelineExplorer />);
  const first = screen.getByRole('button', { name: 'Q1 2026' });
  first.focus();
  await user.tab();
  await user.tab();
  const third = screen.getByRole('button', { name: 'Q3 2026' });
  expect(third).toHaveFocus();
  expect(third).toHaveAttribute('aria-pressed', 'false');
  expect(first).toHaveAttribute('aria-pressed', 'true');
  await user.keyboard('{ArrowRight}');
  const fourth = screen.getByRole('button', { name: 'Q4 2026 AGI assumed' });
  expect(fourth).toHaveFocus();
  expect(fourth).toHaveAttribute('aria-pressed', 'true');
  expect(window.location.hash).toBe('#story=navigator&period=2026Q4');
  await user.tab();
  expect(screen.getByRole('button', { name: 'Q1 2027' })).toHaveFocus();
  await user.keyboard('{ArrowLeft}');
  expect(fourth).toHaveFocus();
  expect(fourth).toHaveAttribute('aria-pressed', 'true');
});
