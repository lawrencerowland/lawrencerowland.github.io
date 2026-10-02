import { expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
test('requires every delivery target and person; corrections revoke completion and reset clears state', () => {
  render(<App />);
  for (const [label, target] of [['Vans', 3], ['Lorries', 2], ['Skip Lorries', 1], ['Courier Drop-offs', 5]]) {
    for (let count = 0; count < target; count++) fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Add ${label}:`) }));
  }
  for (const name of ['Sam', 'Effie']) fireEvent.click(screen.getByRole('button', { name: `${name}: not yet checked out` }));
  expect(screen.queryByText('All tasks completed!')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Helen: not yet checked out' }));
  expect(screen.getByText('All tasks completed!')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Undo Vans' }));
  expect(screen.queryByText('All tasks completed!')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reset exercise' }));
  expect(screen.getByRole('button', { name: 'Undo Vans' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Sam: not yet checked out' })).toHaveAttribute('aria-pressed', 'false');
});
