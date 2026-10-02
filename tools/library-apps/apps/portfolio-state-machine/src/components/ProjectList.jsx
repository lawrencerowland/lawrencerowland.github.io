import React from 'react'

export default function ProjectList({ projects }) {
  if (!projects || projects.length === 0) {
    return <p>No projects</p>
  }
  return (
    <ul className="project-list">
      {projects.map((p) => (
        <li key={p.name}>{p.name} - {p.state}</li>
      ))}
    </ul>
  )
}
