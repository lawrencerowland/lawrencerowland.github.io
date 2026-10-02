import React from 'react'

export default function Instructions() {
  return (
    <section className="instructions">
      <h2>Instructions</h2>
      <p>
        Hover over nodes and links to see their labels. Drag nodes to rearrange
        them and scroll to zoom the view. Zoom and Fit controls are also available. Select any concept in the list to read its connections without using the canvas. Reset layout restores the initial arrangement.
      </p>
      <p>Arrows follow the recorded source-to-target direction. Unlabelled links have an unspecified relationship type. Isolated concepts are retained as gaps in this draft schema; their positions and colours do not measure influence, support or distance.</p>
    </section>
  )
}
