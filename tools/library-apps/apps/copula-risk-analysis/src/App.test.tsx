import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import CopulaRiskAnalysis from './App';

test('renders copula heading', () => {
  render(<CopulaRiskAnalysis />);
  const heading = screen.getByText(/Construction Project Risk Analysis with Copulas/i);
  expect(heading).toBeDefined();
});
