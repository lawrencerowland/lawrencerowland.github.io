import React, { useState } from 'react'

export default function TransitionProject({ projects, onTransition, getValidTransitions }) {
  const [selected, setSelected] = useState('')
  const [state, setState] = useState('')
  const project = projects.find(project => project.name === selected)
  const transitions = project ? getValidTransitions(project.state) : []
  const nextState = transitions.includes(state) ? state : transitions[0] || ''

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selected || !nextState) return
    onTransition(selected, nextState)
  }

  return (
    <form onSubmit={handleSubmit} className="transition-form">
      <label htmlFor="transition-project">Project to move</label>
      <select id="transition-project" value={selected} onChange={(e) => { setSelected(e.target.value); setState('') }}>
        <option value="">Select project</option>
        {projects.map((p) => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>
      <label htmlFor="next-project-state">Next state</label>
      <select id="next-project-state" value={nextState} disabled={!transitions.length} onChange={(e) => setState(e.target.value)}>
        {!transitions.length && <option value="">{project ? 'Terminal state — no further transitions' : 'Choose a project first'}</option>}
        {transitions.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button type="submit" disabled={!nextState}>Transition</button>
    </form>
  )
}
