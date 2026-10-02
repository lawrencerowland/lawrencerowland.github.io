import { afterEach, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { Portfolio, Project, ProjectState } from './portfolioLogic'

afterEach(cleanup)

test('adds distinct projects and offers only allowed transitions', async () => {
  const user = userEvent.setup()
  render(<App />)
  expect(screen.getByRole('button', { name: 'Run Simulation' })).toBeDisabled()
  await user.type(screen.getByLabelText('Project name'), 'Station access')
  await user.click(screen.getByRole('button', { name: 'Add Project' }))
  await user.selectOptions(screen.getByLabelText('Project to move'), 'Station access')
  expect([...screen.getByLabelText('Next state').options].map(option => option.value)).toEqual(['PROPOSAL', 'CANCELLED'])
  await user.click(screen.getByRole('button', { name: 'Transition' }))
  expect(screen.getByText('Station access - PROPOSAL')).toBeInTheDocument()
  expect([...screen.getByLabelText('Next state').options].map(option => option.value)).toEqual(['APPROVED', 'CANCELLED'])
  await user.selectOptions(screen.getByLabelText('Next state'), 'CANCELLED')
  await user.click(screen.getByRole('button', { name: 'Transition' }))
  expect(screen.getByLabelText('Next state')).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Transition' })).toBeDisabled()
})

test('prevents ambiguous duplicate names without discarding the entered name', async () => {
  const user = userEvent.setup()
  render(<App />)
  const input = screen.getByLabelText('Project name')
  await user.type(input, 'Signals')
  await user.click(screen.getByRole('button', { name: 'Add Project' }))
  await user.type(input, 'signals')
  await user.click(screen.getByRole('button', { name: 'Add Project' }))
  expect(screen.getByRole('status')).toHaveTextContent('already exists')
  expect(input).toHaveValue('signals')
  expect(screen.queryByText('signals - IDEA')).not.toBeInTheDocument()
})

test('labels trial totals and clears stale results when the portfolio changes', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText('Project name'), 'Track')
  await user.click(screen.getByRole('button', { name: 'Add Project' }))
  await user.click(screen.getByRole('button', { name: 'Run Simulation' }))
  expect(screen.getByText(/100 independent runs from the current portfolio/)).toBeInTheDocument()
  expect(screen.getByText('Track - IDEA')).toBeInTheDocument()
  await user.type(screen.getByLabelText('Project name'), 'Stations')
  await user.click(screen.getByRole('button', { name: 'Add Project' }))
  expect(screen.queryByRole('heading', { name: 'Simulation Results' })).not.toBeInTheDocument()
})

test('state machine rejects illegal and terminal transitions', () => {
  const portfolio = new Portfolio([new Project('A')])
  expect(portfolio.transitionProject('A', ProjectState.COMPLETED, 'invalid')).toBe(false)
  expect(portfolio.projects[0].history).toHaveLength(1)
  expect(portfolio.transitionProject('A', ProjectState.CANCELLED, 'stop')).toBe(true)
  expect(portfolio.transitionProject('A', ProjectState.PROPOSAL, 'restart')).toBe(false)
})

test('sampling follows each probability boundary and preserves the source portfolio', () => {
  const portfolio = new Portfolio([new Project('A')])
  const draws = [0.699, 0.599, 0.899, 0.799]
  expect(portfolio.simulatePortfolio(1, () => draws.shift())[0].COMPLETED).toBe(1)
  expect(portfolio.simulatePortfolio(1, () => 0.7)[0].CANCELLED).toBe(1)
  expect(portfolio.projects[0].state).toBe(ProjectState.IDEA)
  expect(portfolio.projects[0].history).toHaveLength(1)
})

test('every trial conserves project count and keeps terminal states', () => {
  const portfolio = new Portfolio([new Project('Done', ProjectState.COMPLETED), new Project('Stopped', ProjectState.CANCELLED), new Project('A')])
  const results = portfolio.simulatePortfolio(5, () => 0)
  expect(results).toHaveLength(5)
  results.forEach(result => {
    expect(Object.values(result).reduce((a, b) => a + b, 0)).toBe(3)
    expect(result.COMPLETED).toBe(2)
    expect(result.CANCELLED).toBe(1)
  })
})
