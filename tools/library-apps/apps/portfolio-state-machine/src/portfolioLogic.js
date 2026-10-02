export const ProjectState = {
  IDEA: 'IDEA',
  PROPOSAL: 'PROPOSAL',
  APPROVED: 'APPROVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

export class Project {
  constructor(name, initialState = ProjectState.IDEA) {
    this.name = name
    this.state = initialState
    this.history = [{state: initialState, reason: "Initial state"}]
  }

  transition(newState, reason) {
    this.state = newState
    this.history.push({state: newState, reason})
  }
}

export class Portfolio {
  constructor(projects = []) {
    this.projects = projects
    this.stateMachine = {
      [ProjectState.IDEA]: {[ProjectState.PROPOSAL]: 0.7, [ProjectState.CANCELLED]: 0.3},
      [ProjectState.PROPOSAL]: {[ProjectState.APPROVED]: 0.6, [ProjectState.CANCELLED]: 0.4},
      [ProjectState.APPROVED]: {[ProjectState.IN_PROGRESS]: 0.9, [ProjectState.CANCELLED]: 0.1},
      [ProjectState.IN_PROGRESS]: {[ProjectState.COMPLETED]: 0.8, [ProjectState.CANCELLED]: 0.2},
      [ProjectState.COMPLETED]: {},
      [ProjectState.CANCELLED]: {},
    }
  }

  addProject(project) {
    if (!project.name.trim() || this.projects.some(p => p.name.toLowerCase() === project.name.toLowerCase())) return false
    this.projects.push(project)
    return true
  }

  transitionProject(projectName, newState, reason) {
    const project = this.projects.find(p => p.name === projectName)
    if (project && this.getValidTransitions(project.state).includes(newState)) {
      project.transition(newState, reason)
      return true
    }
    return false
  }

  getValidTransitions(currentState) {
    return Object.keys(this.stateMachine[currentState] || {})
  }

  getProjectStates() {
    return Object.values(ProjectState).reduce((acc, state) => {
      acc[state] = this.projects.filter(p => p.state === state).map(p => p.name)
      return acc
    }, {})
  }

  simulatePortfolio(numIterations, random = Math.random) {
    const results = []

    for (let i = 0; i < numIterations; i++) {
      const simulatedProjects = this.projects.map(p => new Project(p.name, p.state))
      let iteration = 0
      const maxIterations = 100 // Prevent infinite loops

      while (simulatedProjects.some(p => ![ProjectState.COMPLETED, ProjectState.CANCELLED].includes(p.state)) && iteration < maxIterations) {
        simulatedProjects.forEach(project => {
          const transitions = this.stateMachine[project.state]
          if (Object.keys(transitions).length > 0) {
            const draw = random()
            let cumulativeProbability = 0
            for (const [nextState, probability] of Object.entries(transitions)) {
              cumulativeProbability += probability
              if (draw < cumulativeProbability) {
                project.transition(nextState, "Simulated transition")
                break
              }
            }
          }
        })
        iteration++
      }

      const finalStates = Object.values(ProjectState).reduce((acc, state) => {
        acc[state] = simulatedProjects.filter(p => p.state === state).length
        return acc
      }, {})

      results.push(finalStates)
    }

    return results
  }
}
