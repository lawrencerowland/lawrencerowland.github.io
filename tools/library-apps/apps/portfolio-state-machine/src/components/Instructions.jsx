import React from 'react'

export default function Instructions() {
  return (
    <section className="instructions">
      <h2>Instructions</h2>
      <p>Add uniquely named projects, choose a project and one of its allowed next states, then run 100 independent simulations from the current portfolio. Each simulated project ends as completed or cancelled; your actual portfolio is unchanged.</p>
      <p>The diagram shows the assumptions: idea → proposal 70%, proposal → approved 60%, approved → in progress 90%, and in progress → completed 80%. At each step, the remaining probability is cancellation. Completed and cancelled projects stay in their terminal states.</p>
      <p>These probabilities are invented for teaching, not fitted to project data. The model assumes independent projects and does not represent time, cost, capacity or shared risks. Results vary between runs and are not a forecast. Changes and results last only until the page is reloaded.</p>
    </section>
  )
}
