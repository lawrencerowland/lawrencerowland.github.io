import React from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import App, { actions, initialState } from './App';
afterEach(() => { cleanup(); vi.useRealTimers(); });

test('script retains a point for every step and does not claim incomplete work is finished', () => {
  let state = initialState;
  for (const action of actions) {
    state = action.update(state);
    expect(state.features.reduce((sum, f) => sum + f.resourceAllocation, 0)).toBe(100);
    expect(state.freeEnergyHistory).toHaveLength(state.step + 1);
    expect(state.features.every(f => f.progress >= 0 && f.progress <= 100)).toBe(true);
  }
  expect(state.features.reduce((sum, f) => sum + f.progress, 0) / state.features.length).toBe(91);
  expect(actions.at(-1).description).toBe('Final Delivery Review');
});

test('playback speed remains controlled and autoplay stops at the last review', () => {
  vi.useFakeTimers();
  render(<App />);
  expect(screen.getByText(/Scripted teaching walkthrough/)).toBeDefined();
  const speed = screen.getByRole('slider', {name:'Playback speed'});
  expect(speed).toHaveValue('1000');
  fireEvent.change(speed, {target:{value:'1900'}});
  expect(speed).toHaveValue('1900');
  fireEvent.click(screen.getByRole('button', {name:'Auto-Play'}));
  for (let i = 0; i < 5; i++) act(() => vi.advanceTimersByTime(100));
  expect(screen.getByText(/Current Step: 5 \/ 5/)).toBeDefined();
  expect(screen.getByRole('button', {name:'Auto-Play'})).toBeDisabled();
  expect(screen.getByRole('button', {name:'Next Step'})).toBeDisabled();
  fireEvent.click(screen.getByRole('button', {name:'Reset'}));
  expect(screen.getByText(/Current Step: 0 \/ 5/)).toBeDefined();
});
