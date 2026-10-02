import React from "react";
import * as Recharts from "recharts";
(globalThis as any).React = React;
(globalThis as any).Recharts = Recharts;
// A scripted teaching walkthrough, built with Vite and React.
// The small UI components below keep the original controls self-contained.

const { useState, useEffect } = React;
const {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ErrorBar,
  ReferenceLine,
} = Recharts;

const Card = ({ className = '', ...props }) => (
  <div className={`border rounded shadow p-4 ${className}`} {...props} />
);
const CardHeader = ({ className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props} />
);
const CardContent = ({ className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props} />
);
const CardFooter = ({ className = '', ...props }) => (
  <div className={`mt-4 ${className}`} {...props} />
);

const Button = ({ className = '', variant, ...props }) => (
  <button
    className={`px-4 py-2 rounded ${
      variant === 'outline'
        ? 'border'
        : variant === 'destructive'
        ? 'bg-red-500 text-white'
        : 'bg-blue-500 text-white'
    } ${className}`}
    {...props}
  />
);

const Slider = ({ value, defaultValue, onValueChange = () => {}, max = 100, step = 1 }) => (
  <input
    type="range"
    aria-label="Playback speed"
    value={(value ?? defaultValue ?? [0])[0]}
    onChange={(e) => onValueChange([Number(e.target.value)])}
    max={max}
    step={step}
    className="w-full"
  />
);

const createIcon = (symbol: string) =>
  ({ className = '', ...props }) => (
    <span className={`inline-block ${className}`} {...props}>{symbol}</span>
  );

const AlertCircle = createIcon('!');
const Info = createIcon('ℹ');
const ArrowRight = createIcon('→');
const Activity = createIcon('🏃');
const BarChart2 = createIcon('📊');
const Clock = createIcon('⏱');

export const initialState = {
  step: 0,
  overallEstimate: { mean: 26, uncertainty: 8 },
  features: [
    { name: 'Data Ingestion', mean: 4, uncertainty: 2, progress: 0, resourceAllocation: 20 },
    { name: 'ML Model', mean: 8, uncertainty: 3, progress: 0, resourceAllocation: 20 },
    { name: 'UI', mean: 6, uncertainty: 2, progress: 0, resourceAllocation: 20 },
    { name: 'Integration', mean: 5, uncertainty: 2, progress: 0, resourceAllocation: 20 },
    { name: 'Security', mean: 3, uncertainty: 1, progress: 0, resourceAllocation: 20 },
  ],
  freeEnergy: 100,
  freeEnergyHistory: [100],
  freeEnergyExplanation: 'The author assigns an initial illustrative uncertainty score of 100.'
};

export const actions = [
  {
    description: 'Initial Setup and Planning',
    explanation: 'We start with our initial estimates, uncertainties, and equal resource allocation for each feature.',
    freeEnergyExplanation: 'The illustrative uncertainty score starts at a baseline level, representing our initial uncertainty about the project.',
    update: (state) => ({ ...state, step: state.step + 1, freeEnergyHistory: [...state.freeEnergyHistory, state.freeEnergy], freeEnergyExplanation: "The initial score remains 100 during setup; this is a scripted baseline." }),
    decision: 'Maintain equal resource allocation for initial development sprint.',
    activeInferenceInsight: 'In active inference, we begin with prior beliefs (our initial estimates) and prepare to update them as new evidence emerges.'
  },
  {
    description: 'First Development Sprint',
    explanation: 'After the first sprint, we observe varied progress. Integration is behind schedule, increasing uncertainty.',
    freeEnergyExplanation: 'The illustrative uncertainty score increases due to the surprise of Integration falling behind schedule. This indicates a mismatch between our expectations and observations.',
    update: (state) => {
      const newFeatures = state.features.map((feature, index) => {
        const progressIncreases = [40, 20, 30, 10, 25];
        const newAllocations = [15, 15, 15, 40, 15];
        return {
          ...feature,
          progress: progressIncreases[index],
          mean: index === 3 ? feature.mean + 1 : feature.mean,
          uncertainty: index === 3 ? feature.uncertainty + 1 : feature.uncertainty,
          resourceAllocation: newAllocations[index],
        };
      });
      return {
        ...state,
        step: state.step + 1,
        features: newFeatures,
        overallEstimate: { mean: 28, uncertainty: 9 },
        freeEnergy: 120,
        freeEnergyHistory: [...state.freeEnergyHistory, 120],
        freeEnergyExplanation: 'Integration delays increased uncertainty, raising illustrative uncertainty score from 100 to 120.'
      };
    },
    decision: 'Reallocate resources to address integration delays, increasing the integration allocation from 20% to 40%.',
    activeInferenceInsight: 'Unexpected observations can prompt belief updates and action. Formal variational free energy depends on a specified probabilistic model; the score here is only an analogy.'
  },
  {
    description: 'Mid-Project Review',
    explanation: 'Midway through the project, we identify that the ML Model is more complex than initially estimated.',
    freeEnergyExplanation: 'The illustrative uncertainty score remains high, but is slightly reduced due to our adaptive response to the previously identified integration issues.',
    update: (state) => {
      const newFeatures = state.features.map((feature, index) => {
        const progressIncreases = [20, 15, 25, 30, 20];
        const newAllocations = [15, 35, 15, 25, 10];
        return {
          ...feature,
          progress: feature.progress + progressIncreases[index],
          mean: index === 1 ? feature.mean + 2 : feature.mean,
          uncertainty: index === 1 ? feature.uncertainty + 1 : feature.uncertainty * 0.9,
          resourceAllocation: newAllocations[index],
        };
      });
      return {
        ...state,
        step: state.step + 1,
        features: newFeatures,
        overallEstimate: { mean: 30, uncertainty: 7 },
        freeEnergy: 110,
        freeEnergyHistory: [...state.freeEnergyHistory, 110],
        freeEnergyExplanation: 'Resource reallocation to integration helped reduce uncertainty, but discovering ML model complexity increased it, resulting in a net illustrative uncertainty score of 110.'
      };
    },
    decision: 'Shift resources toward ML Model development (increasing from 15% to 35%) while maintaining adequate support for Integration.',
    activeInferenceInsight: 'Active inference involves a continuous balance between exploiting what we know and exploring to reduce uncertainty. Here, we explore the complexity of the ML Model.'
  },
  {
    description: 'Integration and Testing Phase',
    explanation: 'As we begin integration, we discover that the Data Ingestion and ML Model components require additional work to interface correctly.',
    freeEnergyExplanation: 'The illustrative uncertainty score decreases slightly as we gain clarity about integration requirements, despite discovering new interface issues.',
    update: (state) => {
      const newFeatures = state.features.map((feature, index) => {
        const progressIncreases = [10, 15, 20, 35, 30];
        const newAllocations = [25, 25, 10, 30, 10];
        return {
          ...feature,
          progress: feature.progress + progressIncreases[index],
          mean: index <= 1 ? feature.mean + 1 : feature.mean,
          uncertainty: index <= 1 ? feature.uncertainty + 0.5 : feature.uncertainty * 0.8,
          resourceAllocation: newAllocations[index],
        };
      });
      return {
        ...state,
        step: state.step + 1,
        features: newFeatures,
        overallEstimate: { mean: 32, uncertainty: 6 },
        freeEnergy: 95,
        freeEnergyHistory: [...state.freeEnergyHistory, 95],
        freeEnergyExplanation: 'While new interface issues were discovered, our targeted resource allocation has helped reduce overall uncertainty, decreasing illustrative uncertainty score to 95.'
      };
    },
    decision: 'Allocate additional resources to Data Ingestion (25%) and maintain focus on ML Model (25%) and Integration (30%).',
    activeInferenceInsight: 'In active inference, precision weighting determines how much we update our beliefs based on new evidence. Higher precision (lower uncertainty) evidence has more influence.'
  },
  {
    description: 'Final Delivery Review',
    explanation: 'The final review shows 91% average feature progress. Work remains on four features; this walkthrough ends before delivery is complete.',
    freeEnergyExplanation: 'The illustrative uncertainty score decreases significantly as the author assumes reduced uncertainty at the final review.',
    update: (state) => {
      const newFeatures = state.features.map((feature, index) => {
        const progressIncreases = [25, 25, 20, 15, 25];
        const newAllocations = [20, 20, 20, 20, 20];
        return {
          ...feature,
          progress: Math.min(100, feature.progress + progressIncreases[index]),
          mean: feature.mean,
          uncertainty: feature.uncertainty * 0.5,
          resourceAllocation: newAllocations[index],
        };
      });
      return {
        ...state,
        step: state.step + 1,
        features: newFeatures,
        overallEstimate: { mean: 33, uncertainty: 3 },
        freeEnergy: 70,
        freeEnergyHistory: [...state.freeEnergyHistory, 70],
        freeEnergyExplanation: 'At the final review, the author assigns a score of 70 and narrower estimate ranges. This does not establish project completion or a calculated probability.'
      };
    },
    decision: 'Balance resources equally (20% each) across all features for final completion and testing.',
    activeInferenceInsight: 'Active inference models can evaluate actions using expected free energy, balancing information gain with preferred outcomes. They do not simply seek confirmation of existing beliefs; this walkthrough does not implement that calculation.'
  },
];

const ProjectManagementSimulation = () => {
  const [state, setState] = useState(initialState);
  const [autoPlay, setAutoPlay] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [showActiveInferenceInsights, setShowActiveInferenceInsights] = useState(true);

  useEffect(() => {
    let timer;
    if (state.step >= actions.length) {
      setAutoPlay(false);
    } else if (autoPlay) {
      timer = setTimeout(() => {
        handleNextStep();
      }, playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, state.step, playbackSpeed]);

  const handleNextStep = () => {
    if (state.step < actions.length) {
      setState(actions[state.step].update(state));
    } else {
      setAutoPlay(false);
    }
  };

  const handleReset = () => {
    setState(initialState);
    setAutoPlay(false);
  };

  const handlePlaybackSpeedChange = (value) => {
    setPlaybackSpeed(2000 - value[0]);
  };

  const estimateChartData = state.features.map((feature) => ({
    name: feature.name,
    mean: feature.mean,
    uncertainty: feature.uncertainty,
    lowErrorBar: feature.mean - feature.uncertainty,
    highErrorBar: feature.mean + feature.uncertainty,
  }));

  const progressAndResourceChartData = state.features.map((feature) => ({
    name: feature.name,
    progress: feature.progress,
    resourceAllocation: feature.resourceAllocation,
  }));

  const totalProgress = state.features.reduce((sum, feature) => sum + feature.progress, 0) / 
    state.features.length;
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Management Simulation with Active Inference</h1>
      <p className="mb-4"><strong>Scripted teaching walkthrough.</strong> Follow five reviews of a software project as estimates, progress and resource allocations change. All decisions, score values and estimate ranges are authored examples, not results of an inference engine. The ± ranges are illustrative bounds, not confidence intervals; overall estimates are supplied separately from feature estimates. Try stepping through, then replaying with the insights hidden.</p>
      
      {/* Project Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <Clock className="mr-2" />
            <h3>Time Estimate</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{state.overallEstimate.mean} ±{state.overallEstimate.uncertainty} weeks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <Activity className="mr-2" />
            <h3>Illustrative Uncertainty Score</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{state.freeEnergy.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <BarChart2 className="mr-2" />
            <h3>Overall Progress</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalProgress.toFixed(0)}%</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Current Action and Decision */}
      <Card className="mb-4">
        <CardHeader className="flex items-center justify-between">
          <h3 className="font-semibold">Current Step: {state.step} / {actions.length}</h3>
          {state.step > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {actions[state.step - 1].description}
            </span>
          )}
        </CardHeader>
        <CardContent>
          {state.step > 0 ? (
            <>
              <p>{actions[state.step - 1].explanation}</p>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="font-medium flex items-center">
                  <ArrowRight size={16} className="mr-2" /> Decision: {actions[state.step - 1].decision}
                </p>
              </div>
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                <p>
                  <span className="font-medium">Illustrative Uncertainty Score Explanation:</span> {state.freeEnergyExplanation}
                </p>
              </div>
              {showActiveInferenceInsights && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="font-medium">Active Inference Insight:</p>
                  <p>{actions[state.step - 1].activeInferenceInsight}</p>
                </div>
              )}
            </>
          ) : (
            <p>Press 'Next Step' or 'Auto-Play' to start the simulation.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => setShowActiveInferenceInsights(!showActiveInferenceInsights)}
            variant="outline"
            size="sm"
          >
            {showActiveInferenceInsights ? 'Hide' : 'Show'} Active Inference Insights
          </Button>
        </CardFooter>
      </Card>

      {/* Illustrative Uncertainty Score Chart */}
      <Card className="mb-4">
        <CardHeader>
          <h3 className="font-semibold">Illustrative Uncertainty Score Over Time</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart 
              data={state.freeEnergyHistory.map((value, index) => ({ step: index, value }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="step" />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip />
              <ReferenceLine y={100} stroke="red" strokeDasharray="3 3" label="Initial Value" />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feature Estimates and Uncertainty */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Feature Estimates and Uncertainty</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={estimateChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={65} tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="mean" fill="#8884d8" name="Mean Estimate (weeks)">
              <ErrorBar dataKey="uncertainty" width={4} strokeWidth={2} stroke="#8884d8" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Progress and Resource Allocation */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Feature Progress and Resource Allocation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={progressAndResourceChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={65} tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" fill="#82ca9d" name="Progress (%)" />
            <Bar dataKey="resourceAllocation" fill="#ffc658" name="Resource Allocation (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex mb-2 md:mb-0">
          <Button onClick={handleNextStep} disabled={state.step >= actions.length || autoPlay}>
            Next Step
          </Button>
          <Button disabled={state.step >= actions.length} onClick={() => setAutoPlay(!autoPlay)} className="ml-2" variant={autoPlay ? "destructive" : "default"}>
            {autoPlay ? 'Pause' : 'Auto-Play'}
          </Button>
          <Button onClick={handleReset} className="ml-2" variant="outline">
            Reset
          </Button>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Playback Speed:</span>
          <Slider
            value={[2000 - playbackSpeed]}
            max={1900}
            step={100}
            onValueChange={handlePlaybackSpeedChange}
            className="w-32"
          />
        </div>
      </div>

      {/* About Active Inference */}
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center">
          <Info className="mr-2" />
          <h3 className="font-semibold">About Active Inference in Project Management</h3>
        </CardHeader>
        <CardContent>
          <p>Active inference offers a way to connect beliefs, observations and action through a probabilistic model. This story borrows the language to prompt project questions:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>What new evidence should change an estimate?</li>
            <li>Would an investigation reduce uncertainty enough to justify its cost?</li>
            <li>Which action best supports the outcomes the project values?</li>
          </ul>
          <p className="mt-2">In the formal theory, variational free energy is an upper bound on surprise (negative log model evidence), and can be written as complexity minus accuracy. It is not simply uncertainty, a percentage or this chart’s score. Evaluating future actions also requires preferences and a model of their consequences; no optimal resource allocation is calculated here.</p>
          <p className="mt-2">Theory: <a href="https://www.fil.ion.ucl.ac.uk/spm/doc/papers/Reinforcement_Learning_or_Active_Inference.pdf">Friston et al., Reinforcement Learning or Active Inference?</a> and <a href="https://www.fil.ion.ucl.ac.uk/~karl/Active%20inference%20and%20epistemic%20value.pdf">Active inference and epistemic value</a>.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManagementSimulation;
