import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

export default function App() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const lowerParetoData = Array.from({ length: 100 }, (_, i) => 100 - Math.pow(i + 1, 0.5) * 10);
  const higherParetoData = lowerParetoData.map(value => value + 20); // Higher Pareto curve is shifted up

  const dataLower = {
    labels: Array.from({ length: 100 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Pareto Curve',
        data: lowerParetoData,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        fill: true,
      },
    ],
  };

  const dataHigher = {
    labels: Array.from({ length: 100 }, (_, i) => i + 1),
    datasets: [
      dataLower.datasets[0],
      {
        label: 'Illustrative improvement',
        data: selectedPoint === null ? [] : [
          { x: selectedPoint + 1, y: lowerParetoData[selectedPoint] },
          { x: selectedPoint + 1, y: higherParetoData[selectedPoint] },
        ],
        borderColor: '#b91c1c',
        backgroundColor: '#b91c1c',
        showLine: true,
        pointRadius: 5,
        fill: false,
      },
      {
        label: 'Higher Pareto Curve',
        data: higherParetoData,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        fill: true,
      },

    ],
  };

  const options = {
    animation: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear', min: 1, max: 100,
        title: {
          display: true,
          text: 'Apparent Progress',
        },
      },
      y: {
        min: 0, max: 120,
        title: {
          display: true,
          text: 'Real Progress',
        },
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const { index } = elements[0];
        setSelectedPoint(index);
      }
    },
  };

  const handleShowSolution = () => {
    setShowSolution(true);
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };


  return (
    <main>
      <h1>Really Winning on Projects</h1>
      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginBottom: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        aria-expanded={showInstructions}
        onClick={() => setShowInstructions(value => !value)}
      >
        Instructions
      </button>
      <p>A toy trade-off between apparent and real progress. The curves and the 20-unit improvement are invented for discussion, not measured project results.</p>
      {showInstructions && <p>Click a curve point or use the strategy slider. Reveal a possible improvement, then read the explanation. Reset to try another strategy.</p>}
      <label htmlFor="strategy">Project strategy (apparent progress): {selectedPoint === null ? 'not selected' : selectedPoint + 1}</label>
      <input id="strategy" type="range" min="1" max="100" value={selectedPoint === null ? 1 : selectedPoint + 1} onChange={event => setSelectedPoint(Number(event.target.value) - 1)} />
      <button onClick={() => { setSelectedPoint(null); setShowSolution(false); setShowExplanation(false); }}>Reset</button>
      {selectedPoint !== null && <p aria-live="polite">Selected strategy: apparent progress {selectedPoint + 1}; real progress {lowerParetoData[selectedPoint].toFixed(1)}{showSolution ? `; illustrative improved real progress ${higherParetoData[selectedPoint].toFixed(1)}` : ''}.</p>}
      <div className="pareto-chart" style={{ position: 'relative', marginBottom: '20px', height: 'clamp(320px, 45vw, 460px)' }}>
        {!showSolution ? (
          <Line data={dataLower} options={options} />
        ) : (
          <>
            <Line data={dataHigher} options={options} />

          </>
        )}
      </div>
      <p>What's your project strategy?</p>
      {selectedPoint !== null && !showSolution && (
        <div>
          <p>Selected Point: {selectedPoint + 1}</p>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleShowSolution}
          >
            See Solution
          </button>
        </div>
      )}
      {showSolution && !showExplanation && (
        <div>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              marginTop: '20px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleShowExplanation}
          >
            Explanation
          </button>
        </div>
      )}
      {showExplanation && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
            A Pareto frontier describes the best available trade-offs under a set of assumptions. A new method or resource could expand what is feasible. Here the red segment shows 20 more units of real progress at unchanged apparent progress; it is a vertical illustration, not a perpendicular vector or evidence that an improvement can be achieved. Discuss what practical change and evidence would justify the higher frontier.
          </p>
        </div>
      )}
    </main>
  );
}
