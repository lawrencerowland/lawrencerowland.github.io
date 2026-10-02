import React from 'react'
import diagram from '../portfolio_state_diag.svg'

export default function StateMachineDiagram() {
  return (
    <div className="state-machine-diagram">
      <img src={diagram} alt="Illustrative transition probabilities: idea to proposal 70%, proposal to approved 60%, approved to in progress 90%, in progress to completed 80%; the remaining probability at each step is cancellation." style={{ maxWidth: '100%' }} />
    </div>
  )
}
