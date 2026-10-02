import React from 'react';
import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('preserves a downloadable model with instructions and its measurement boundary', () => {
  render(<App />);
  expect(screen.getByRole('link', {name:'building_site_pool_gym_model.nlogo'})).toHaveAttribute('download');
  expect(screen.getByText(/1,440 ticks/)).toBeDefined();
  expect(screen.getByText(/statistics count workers/)).toBeDefined();
});
