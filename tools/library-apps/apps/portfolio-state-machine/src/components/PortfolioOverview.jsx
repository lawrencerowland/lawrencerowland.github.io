import React from 'react'
import { ProjectState } from '../portfolioLogic'

export default function PortfolioOverview({ portfolio }) {
  const states = portfolio.getProjectStates()
  return (
    <div className="portfolio-overview">
      <h2>Portfolio Overview</h2>
      <ul>
        {Object.values(ProjectState).map((state) => (
          <li key={state}>{state}: {states[state].length}</li>
        ))}
      </ul>
    </div>
  )
}
