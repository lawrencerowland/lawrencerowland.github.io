import React from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { advanceProjectWeek, initialProjectState, initialEffects } from './model';

const off = Object.fromEntries(Object.keys(initialEffects).map(k => [k, false]));
afterEach(() => { cleanup(); vi.useRealTimers(); });

test('weekly learning accumulates instead of being rounded away', () => {
  let state = initialProjectState;
  for (let week = 1; week <= 4; week++) state = advanceProjectWeek(state, {...off, teamLearning:true}, week, () => .5).state;
  expect(state.teamCapability).toBeCloseTo(1.04);
  expect(initialProjectState.teamCapability).toBe(1);
});

test('percent metrics remain bounded and completion is stable', () => {
  const result = advanceProjectWeek({...initialProjectState, quality:99.9, morale:99, progress:25}, {...off, weeklyMeetings:true,userFeedback:true}, 3, () => .9);
  expect(result.state.quality).toBe(100);
  expect(result.state.morale).toBe(100);
  const done = advanceProjectWeek({...initialProjectState, progress:99}, off, 1, () => .5);
  expect(done.state.progress).toBe(100);
  expect(done.events.filter(e => e.event === 'Project completed!')).toHaveLength(1);
  expect(advanceProjectWeek(done.state, initialEffects, 2).events).toEqual([]);
});

test('autoplay advances successive weeks and honors live effect changes', () => {
  vi.useFakeTimers();
  render(<App />);
  screen.getAllByRole('checkbox').forEach(box => fireEvent.click(box));
  fireEvent.click(screen.getByRole('button', {name:'Start'}));
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByText('Weeks completed: 1')).toBeDefined();
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByText('Weeks completed: 2')).toBeDefined();
  fireEvent.click(screen.getByRole('checkbox', {name:'Team Learning (Growth)'}));
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByText('×1.01')).toBeDefined();
  fireEvent.click(screen.getByRole('button', {name:'Pause'}));
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText('Weeks completed: 3')).toBeDefined();
  fireEvent.click(screen.getByRole('button', {name:'Reset'}));
  expect(screen.getByText('Weeks completed: 0')).toBeDefined();
});
