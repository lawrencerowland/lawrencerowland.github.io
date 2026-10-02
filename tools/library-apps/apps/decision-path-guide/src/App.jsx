import React, { useState, useRef, useEffect } from 'react';
import ReactFlow, { Background, Controls, ReactFlowProvider, useNodesInitialized, useReactFlow, useNodes } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

export class DecisionGuideLogic {
  constructor() {
    this.selectedAspects = [];
    this.currentAspectIndex = 0;
    this.selectedProperties = [];
    this.currentPropertyIndex = 0;
    this.footnotes = {
      DecisionContext: 'conditions under which the decision is made, e.g. the weapon may be used under threat to life conditions',
      DecisionConstraint: 'constraints under which the decision is made, e.g. the decider chooses between A and B or all decisions must satisfy a predicate',
      DecisionArtifact: 'document reflecting or publishing the decision',
      DecisionObject: 'the object influenced by the decision',
      DecisionStatement: 'statement: yes or no, accept, reject, neutral, etc.',
      cancels: 'A decision can cancel other earlier decisions. In practice, canceling a decision means invalidating the artifact through which that decision is documented (the DecisionArtifact).',
      isSupportedBy: 'A stakeholder in the decision-making process, but not the decision-maker.',
      resultsFrom: 'Connection to the decision-making process.',
      DecisionEvent: 'when the decision is made or when is effective',
      recipient: 'Recipient of the decision (role).'
    };
  }

  getNextQuestion(currentClass, userInput, decisions) {
    if (!currentClass) {
      return {
        question: 'What type of decision are you making?',
        options: ['Complex Decision (multiple aspects and considerations)', 'Statement Decision (simple accept/reject/defer decision)'],
        current_class: 'Decision',
        multiple_select: false
      };
    }

    if (currentClass === 'Decision') {
      if (userInput === 'Complex Decision (multiple aspects and considerations)') {
        return {
          question: 'What are the main aspects of your complex decision? (Select all that apply)',
          options: ['DecisionContext', 'DecisionConstraint', 'DecisionProperties', 'DecisionParticipants'],
          current_class: 'ComplexDecisionAspects',
          multiple_select: true
        };
      }
      if (userInput === 'Statement Decision (simple accept/reject/defer decision)') {
        return {
          question: 'What is the context of your decision?',
          input_type: 'text',
          current_class: 'DecisionContext',
          footnote: this.footnotes.DecisionContext
        };
      }
    }

    if (currentClass === 'DecisionContext' && decisions.Decision === 'Statement Decision (simple accept/reject/defer decision)') {
      return {
        question: 'What is your decision statement?',
        options: ['Accept', 'Reject', 'Neutral', 'Defer'],
        current_class: 'DecisionStatement',
        multiple_select: false,
        footnote: this.footnotes.DecisionStatement
      };
    }

    if (currentClass === 'DecisionStatement') {
      return {
        question: 'What is the object influenced by the decision?',
        input_type: 'text',
        current_class: 'DecisionObject',
        footnote: this.footnotes.DecisionObject
      };
    }

    if (currentClass === 'ComplexDecisionAspects') {
      this.selectedAspects = Array.isArray(userInput) ? userInput : [userInput];
      this.currentAspectIndex = 0;
      return this.getNextAspectQuestion();
    }

    if (['DecisionContext', 'DecisionConstraint'].includes(currentClass)) {
      this.currentAspectIndex += 1;
      return this.getNextAspectQuestion();
    }

    if (currentClass === 'DecisionProperties') {
      this.selectedProperties = Array.isArray(userInput) ? userInput : [userInput];
      this.currentPropertyIndex = 0;
      return this.getNextPropertyQuestion();
    }

    if (['DecisionArtifact', 'DecisionObject', 'Party'].includes(currentClass) && decisions.Decision === 'Complex Decision (multiple aspects and considerations)') {
      this.currentPropertyIndex += 1;
      return this.getNextPropertyQuestion();
    }

    if (currentClass === 'DecisionParticipants') {
      this.currentAspectIndex += 1;
      return this.getNextAspectQuestion();
    }

    if (currentClass === 'DecisionObject') {
      return {
        question: 'Does this decision cancel any previous decisions?',
        options: ['Yes', 'No'],
        current_class: 'CancelsDecision',
        multiple_select: false,
        footnote: this.footnotes.cancels
      };
    }

    if (currentClass === 'CancelsDecision') {
      if (userInput === 'Yes') {
        return {
          question: 'Which previous decision(s) does it cancel? (Enter comma-separated values)',
          input_type: 'text',
          current_class: 'CancelledDecision',
          footnote: this.footnotes.cancels
        };
      }
      return this.getNextQuestion('CancelledDecision', null, decisions);
    }

    if (['CancelledDecision', 'StatementDecision'].includes(currentClass)) {
      return {
        question: 'Who supports this decision? (Select all that apply)',
        options: ['Consultant', 'Expert', 'Party'],
        current_class: 'SupportedBy',
        multiple_select: true,
        footnote: this.footnotes.isSupportedBy
      };
    }

    if (currentClass === 'SupportedBy') {
      return {
        question: 'What decision process resulted in this decision?',
        input_type: 'text',
        current_class: 'ResultsFrom',
        footnote: this.footnotes.resultsFrom
      };
    }

    if (currentClass === 'ResultsFrom') {
      return {
        question: 'When will this decision be effective?',
        input_type: 'date',
        current_class: 'DecisionEvent',
        footnote: this.footnotes.DecisionEvent
      };
    }

    return null;
  }

  getNextAspectQuestion() {
    if (this.currentAspectIndex < this.selectedAspects.length) {
      const aspect = this.selectedAspects[this.currentAspectIndex];
      if (aspect === 'DecisionContext') {
        return {
          question: 'What is the context of your decision?',
          input_type: 'text',
          current_class: 'DecisionContext',
          footnote: this.footnotes.DecisionContext
        };
      }
      if (aspect === 'DecisionConstraint') {
        return {
          question: 'What are the constraints for your decision?',
          input_type: 'text',
          current_class: 'DecisionConstraint',
          footnote: this.footnotes.DecisionConstraint
        };
      }
      if (aspect === 'DecisionProperties') {
        return {
          question: 'What are the properties of your decision? (Select all that apply)',
          options: ['DecisionArtifact', 'DecisionObject', 'Party'],
          current_class: 'DecisionProperties',
          multiple_select: true
        };
      }
      if (aspect === 'DecisionParticipants') {
        return {
          question: 'Who are the participants in this decision? (Select all that apply)',
          options: ['DecisionMaker', 'Consultant', 'Expert', 'Party'],
          current_class: 'DecisionParticipants',
          multiple_select: true
        };
      }
    }
    return {
      question: 'Does this decision cancel any previous decisions?',
      options: ['Yes', 'No'],
      current_class: 'CancelsDecision',
      multiple_select: false,
      footnote: this.footnotes.cancels
    };
  }

  getNextPropertyQuestion() {
    if (this.currentPropertyIndex < this.selectedProperties.length) {
      const type = this.selectedProperties[this.currentPropertyIndex];
      if (type === 'DecisionArtifact') {
        return {
          question: 'What type of document reflects or publishes the decision?',
          input_type: 'text',
          current_class: 'DecisionArtifact',
          footnote: this.footnotes.DecisionArtifact
        };
      }
      if (type === 'DecisionObject') {
        return {
          question: 'What is the object influenced by the decision?',
          input_type: 'text',
          current_class: 'DecisionObject',
          footnote: this.footnotes.DecisionObject
        };
      }
      if (type === 'Party') {
        return {
          question: 'Who is the recipient of the decision?',
          input_type: 'text',
          current_class: 'Party',
          footnote: this.footnotes.recipient
        };
      }
    } else {
      this.currentAspectIndex += 1;
      return this.getNextAspectQuestion();
    }
  }

  generateSummary(decisions) {
    let summary = 'Decision Summary:\n\n';
    Object.entries(decisions).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        summary += `${k}:\n`;
        v.forEach(item => {
          summary += `  - ${item}\n`;
        });
      } else {
        summary += `${k}: ${v}\n`;
      }
    });
    return summary;
  }
}

function FitDecisionGraph() {
  const initialized = useNodesInitialized();
  const nodeCount = useNodes().length;
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (initialized) fitView({ padding: 0.18, duration: 150, minZoom: 0.1, maxZoom: 1.5 });
  }, [initialized, nodeCount, fitView]);
  return null;
}

export default function App() {
  const logicRef = useRef(new DecisionGuideLogic());
  const [decisions, setDecisions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    logicRef.current.getNextQuestion(null, null, {})
  );
  const [summary, setSummary] = useState(null);
  const [textValue, setTextValue] = useState('');
  const [multiValues, setMultiValues] = useState([]);
  const [history, setHistory] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);


  useEffect(() => {
    setTextValue('');
    setMultiValues([]);
  }, [currentQuestion]);

  const generateGraphData = (steps, cq) => {
    const rootLabel = steps[0] && steps[0].class === 'Decision'
      ? `Decision: ${Array.isArray(steps[0].answer) ? steps[0].answer.join(', ') : steps[0].answer}`
      : 'Decision';

    const nds = [
      {
        id: 'Decision',
        data: { label: rootLabel },
        position: { x: 0, y: 0 }
      }
    ];
    const eds = [];

    let parentId = 'Decision';
    let stepList = steps;
    if (steps[0] && steps[0].class === 'Decision') {
      const first = steps[0];
      if (first.options && !first.multiple_select) {
        first.options.forEach((opt, i) => {
          if (opt !== first.answer) {
            const optId = `Decision-opt-${i}`;
            nds.push({
              id: optId,
              data: { label: opt },
              position: { x: (i + 1) * 150, y: 0 },
              style: { opacity: 0.5 }
            });
            eds.push({ id: `Decision-${optId}`, source: 'Decision', target: optId });
          }
        });
      }
      stepList = steps.slice(1);
    }

    stepList.forEach((step, idx) => {
      const stepId = `step-${idx}`;
      const label = Array.isArray(step.answer)
        ? `${step.class}: ${step.answer.join(', ')}`
        : `${step.class}: ${step.answer}`;
      nds.push({
        id: stepId,
        data: { label },
        position: { x: 0, y: (idx + 1) * 120 }
      });
      eds.push({ id: `${parentId}-${stepId}`, source: parentId, target: stepId });

      if (step.options && !step.multiple_select) {
        step.options.forEach((opt, i) => {
          if (opt !== step.answer) {
            const optId = `${stepId}-opt-${i}`;
            nds.push({
              id: optId,
              data: { label: opt },
              position: { x: (i + 1) * 150, y: (idx + 1) * 120 },
              style: { opacity: 0.5 }
            });
            eds.push({ id: `${parentId}-${optId}`, source: parentId, target: optId });
          }
        });
      }

      parentId = stepId;
    });

    if (cq) {
      const curY = (steps.length + 1) * 120;
      nds.push({
        id: 'current',
        data: { label: cq },
        position: { x: 0, y: curY },
        style: { background: '#ffeb3b' }
      });
      eds.push({ id: `${parentId}-current`, source: parentId, target: 'current' });

      if (currentQuestion.options && !currentQuestion.multiple_select) {
        currentQuestion.options.forEach((opt, i) => {
          const optId = `current-opt-${i}`;
          nds.push({
            id: optId,
            data: { label: opt },
            position: { x: (i + 1) * 150, y: curY },
            style: { opacity: 0.5 }
          });
          eds.push({ id: `current-${optId}`, source: 'current', target: optId });
        });
      }
    }

    return { nds, eds };
  };

  useEffect(() => {
    const { nds, eds } = generateGraphData(history, currentQuestion.current_class);
    setNodes(nds);
    setEdges(eds);
  }, [history, currentQuestion]);

  const submitAnswer = (answer) => {
    const cq = currentQuestion.current_class;
    const newDecisions = { ...decisions, [cq]: answer };
    setDecisions(newDecisions);
    setHistory(prev => [
      ...prev,
      {
        class: cq,
        answer,
        options: currentQuestion.options,
        multiple_select: currentQuestion.multiple_select
      }
    ]);
    const next = logicRef.current.getNextQuestion(cq, answer, newDecisions);
    if (next) {
      setCurrentQuestion(next);
    } else {
      setSummary(logicRef.current.generateSummary(newDecisions));
    }
  };

  const startOver = () => {
    logicRef.current = new DecisionGuideLogic();
    const first = logicRef.current.getNextQuestion(null, null, {});
    setDecisions({});
    setHistory([]);
    setSummary(null);
    setCurrentQuestion(first);
  };

  if (summary) {
    return (
      <div className="app-container">
        <h1>Decision path summary</h1>
        <p>This records your answers in this browser session. It does not approve or execute a decision.</p>
        <pre style={{whiteSpace: 'pre-wrap'}}>{summary}</pre>
        <button onClick={startOver}>Start Over</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Decision Path Guide</h1>
      <p>Build a structured decision record. Select the relevant aspects, answer the prompts, and review the summary. Entries stay in this page until you restart or reload.</p>
      <div className="graph-container">
        <ReactFlowProvider>
          <ReactFlow nodes={nodes} edges={edges} minZoom={0.1} fitView>
            <FitDecisionGraph />
            <Background />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      <h2 id="decision-question">{currentQuestion.question}</h2>
      {currentQuestion.footnote && <p className="footnote">{currentQuestion.footnote}</p>}
      {currentQuestion.options && !currentQuestion.multiple_select && (
        <div className="button-group">
          {currentQuestion.options.map(opt => (
            <button key={opt} onClick={() => submitAnswer(opt)}>{opt}</button>
          ))}
        </div>
      )}
      {currentQuestion.options && currentQuestion.multiple_select && (
        <div className="option-list">
          {currentQuestion.options.map(opt => (
            <label key={opt}>
              <input
                type="checkbox"
                value={opt}
                checked={multiValues.includes(opt)}
                onChange={e => {
                  if (e.target.checked) {
                    setMultiValues(prev => [...prev, opt]);
                  } else {
                    setMultiValues(prev => prev.filter(o => o !== opt));
                  }
                }}
              />
              {opt}
            </label>
          ))}
          <div>
            <button onClick={() => submitAnswer(multiValues)}>Submit</button>
          </div>
        </div>
      )}
      {currentQuestion.input_type === 'text' && (
        <div>
          <input
            aria-labelledby="decision-question"
            type="text"
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
          />
          <button disabled={!textValue.trim()} onClick={() => submitAnswer(textValue.trim())}>Submit</button>
        </div>
      )}
      {currentQuestion.input_type === 'date' && (
        <div>
          <input
            aria-labelledby="decision-question"
            type="date"
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
          />
          <button disabled={!textValue.trim()} onClick={() => submitAnswer(textValue.trim())}>Submit</button>
        </div>
      )}
      {history.length > 0 && <button onClick={startOver}>Start Over</button>}
    </div>
  );
}
