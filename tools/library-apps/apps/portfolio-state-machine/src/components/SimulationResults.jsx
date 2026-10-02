import React from 'react'
import { ProjectState } from '../portfolioLogic'

export default function SimulationResults({ results }) {
  if (!results || results.length === 0) return null

  const aggregated = results.reduce((acc, r) => {
    for (const state of Object.values(ProjectState)) {
      acc[state] = (acc[state] || 0) + (r[state] || 0)
    }
    return acc
  }, {})

  return (
    <div className="simulation-results">
      <h2>Simulation Results</h2>
      <p>{results.length} independent runs from the current portfolio. Totals below count project outcomes across every run; averages give projects per run.</p>
      <ul>
        {Object.entries(aggregated).map(([state, count]) => (
          <li key={state}>{state}: {count} total; {(count / results.length).toFixed(2)} projects per run</li>
        ))}
      </ul>
    </div>
  )
}
