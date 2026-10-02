import React, { useState } from 'react'
import './App.css'
import { Project, Portfolio } from './portfolioLogic'
import ProjectList from './components/ProjectList'
import AddProject from './components/AddProject'
import TransitionProject from './components/TransitionProject'
import PortfolioOverview from './components/PortfolioOverview'
import SimulationResults from './components/SimulationResults'
import Instructions from './components/Instructions'
import StateMachineDiagram from './components/StateMachineDiagram'

export default function App() {
  const [portfolio, setPortfolio] = useState(new Portfolio())
  const [simulationResults, setSimulationResults] = useState(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [showStateMachine, setShowStateMachine] = useState(false)
  const [message, setMessage] = useState('')

  const addProject = (name) => {
    const newPortfolio = new Portfolio([...portfolio.projects])
    if (!newPortfolio.addProject(new Project(name))) {
      setMessage('A project with that name already exists. Use a distinct name.')
      return false
    }
    setPortfolio(newPortfolio)
    setSimulationResults(null)
    setMessage(`Added ${name}.`)
    return true
  }

  const transitionProject = (projectName, newState) => {
    const newPortfolio = new Portfolio(portfolio.projects.map(project => {
      const copy = new Project(project.name, project.state)
      copy.history = [...project.history]
      return copy
    }))
    if (!newPortfolio.transitionProject(projectName, newState, "User action")) {
      setMessage('That transition is not available from the current state.')
      return
    }
    setPortfolio(newPortfolio)
    setSimulationResults(null)
    setMessage(`${projectName} moved to ${newState}.`)
  }

  const runSimulation = () => {
    const results = portfolio.simulatePortfolio(100)
    setSimulationResults(results)
  }

  return (
    <main className="app-container">
      <h1>Portfolio Management App</h1>
      <p>A toy portfolio: move project ideas through approval and delivery, then explore possible outcomes using fixed illustrative transition probabilities.</p>
      <div className="button-group">
        <button aria-expanded={showInstructions} onClick={() => setShowInstructions(!showInstructions)}>
          {showInstructions ? 'Hide' : 'Show'} Instructions
        </button>
        <button aria-expanded={showStateMachine} onClick={() => setShowStateMachine(!showStateMachine)}>
          {showStateMachine ? 'Hide' : 'Show'} State Machine Diagram
        </button>
      </div>
      {showInstructions && <Instructions />}
      {showStateMachine && <StateMachineDiagram />}
      <p role="status">{message}</p>
      <div className="content-wrapper">
        <div className="left-panel">
          <ProjectList projects={portfolio.projects} />
          <AddProject onAddProject={addProject} />
        </div>
        <div className="right-panel">
          <TransitionProject 
            projects={portfolio.projects} 
            getValidTransitions={state => portfolio.getValidTransitions(state)}
            onTransition={transitionProject} 
          />
          <PortfolioOverview portfolio={portfolio} />
          <button onClick={runSimulation} disabled={!portfolio.projects.length} className="simulate-button">Run Simulation</button>
          {simulationResults && <SimulationResults results={simulationResults} />}
        </div>
      </div>
    </main>
  )
}
