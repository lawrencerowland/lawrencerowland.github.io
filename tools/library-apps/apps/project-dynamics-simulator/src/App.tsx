import React from "react";
import * as Recharts from "recharts";
import { advanceProjectWeek, initialProjectState, initialEffects } from "./model";
(globalThis as any).React = React;
(globalThis as any).Recharts = Recharts;

const { useState, useEffect } = React;
const {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} = Recharts;

const createIcon = (symbol: string) =>
  ({ className = "", ...props }) => (
    <span className={`inline-block ${className}`} {...props}>{symbol}</span>
  );

const AlertCircle = createIcon("⚠");
const Clock = createIcon("⏰");
const Target = createIcon("🎯");
const ThumbsUp = createIcon("👍");
const AlertTriangle = createIcon("⚠");
const Zap = createIcon("⚡");


const ProjectDynamicsSimulator = () => {
  // State for simulation parameters
  const [week, setWeek] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms between updates
  const [history, setHistory] = useState([]);
  const [showEffects, setShowEffects] = useState(initialEffects);
  const [projectState, setProjectState] = useState(initialProjectState);

  // Event log
  const [eventLog, setEventLog] = useState([
    { week: 0, event: "Project started", type: "info" }
  ]);
  
  const handleSpeedChange = (e) => setSpeed(Number(e.target.value));

  const resetSimulation = () => {
    setIsRunning(false);
    setWeek(1);
    setHistory([]);
    setEventLog([{ week: 0, event: "Project started", type: "info" }]);
    setProjectState(initialProjectState);
  };

  const toggleSimulation = () => setIsRunning(running => !running);

  const advanceWeek = () => {
    if (projectState.progress >= projectState.scope) return;
    const result = advanceProjectWeek(projectState, showEffects, week);
    setProjectState(result.state);
    setHistory(prev => [...prev, {
      week, ...result.state,
      progressPercent: Math.round(result.state.progress / result.state.scope * 100),
    }]);
    setEventLog(prev => [...prev, ...result.events]);
    setWeek(week + 1);
    if (result.state.progress >= result.state.scope) setIsRunning(false);
  };

  // A fresh one-shot timer captures the latest state and effect switches each week.
  useEffect(() => {
    if (!isRunning || projectState.progress >= projectState.scope) return;
    const timer = setTimeout(advanceWeek, speed);
    return () => clearTimeout(timer);
  }, [isRunning, week, projectState, showEffects, speed]);

  // Toggle effect handler
  const toggleEffect = (effect) => {
    setShowEffects(prev => ({
      ...prev,
      [effect]: !prev[effect]
    }));
  };
  
  // Manually advance one week
  const stepWeek = () => {
    advanceWeek();
  };
  
  // Calculate completion percentage
  const completionPercentage = Math.min(100, Math.round((projectState.progress / projectState.scope) * 100));
  
  // Format for event types
  const eventIcons = {
    info: <Clock size={16} className="text-blue-500" />,
    warning: <AlertTriangle size={16} className="text-yellow-500" />,
    danger: <AlertCircle size={16} className="text-red-500" />,
    success: <ThumbsUp size={16} className="text-green-500" />
  };
  
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Software Development Project Simulator</h2>
        <div className="text-sm text-gray-500">Weeks completed: {week - 1}</div>
      </div>
      
      <p><strong>Illustrative stochastic model.</strong> Follow a software team delivering 100 initial scope points. Toggle debt, learning, reviews, feedback and random events to see how these assumed rules change the trajectory. Runs differ because events are sampled anew; reset keeps your effect choices.</p>
      <p>Progress each week uses the previous velocity and capability, adjusted for debt and meeting time. Reviews may remove debt or add scope. Feedback can change morale, velocity and rework; morale then changes next week’s velocity. Quality and morale are bounded at 0–100. These coefficients are invented for exploration, not calibrated forecasts.</p>
      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-6 mb-2">
        <div 
          className="bg-blue-500 h-6 rounded-full flex items-center justify-center text-white text-sm"
          style={{ width: `${completionPercentage}%` }}
        >
          {completionPercentage}%
        </div>
      </div>
      
      {/* Control Panel */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          disabled={projectState.progress >= projectState.scope}
          onClick={toggleSimulation} 
          className={`px-4 py-2 rounded font-medium ${isRunning ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={stepWeek} 
          className="px-4 py-2 bg-blue-500 text-white rounded font-medium"
          disabled={isRunning || projectState.progress >= projectState.scope}
        >
          Step Forward
        </button>
        <button 
          onClick={resetSimulation} 
          className="px-4 py-2 bg-gray-500 text-white rounded font-medium"
        >
          Reset
        </button>
        <div className="flex items-center ml-4">
          <span className="mr-2 text-sm">Speed:</span>
          <input
            type="range"
            aria-label="Milliseconds per week"
            min="200"
            max="2000"
            step="100"
            value={speed}
            onChange={handleSpeedChange}
            className="w-32"
          />
          <span className="ml-2 text-sm">{speed}ms</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Project Metrics */}
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Current Project Metrics</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-lg font-medium">{projectState.progress.toFixed(1)} / {projectState.scope}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Velocity</div>
                <div className="text-lg font-medium">{projectState.velocity.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Quality</div>
                <div className="text-lg font-medium">{projectState.quality.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Team Morale</div>
                <div className="text-lg font-medium">{projectState.morale.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Technical Debt</div>
                <div className="text-lg font-medium">{projectState.technicalDebt.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Team Capability</div>
                <div className="text-lg font-medium">×{projectState.teamCapability.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          {/* Progress Over Time Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Progress & Scope Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="week" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#3b82f6" name="Progress" />
                <Line type="monotone" dataKey="scope" stroke="#ef4444" name="Scope" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* System Dynamics Controls */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Project Dynamics - Toggle Effects</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEffects.technicalDebt}
                  onChange={() => toggleEffect('technicalDebt')}
                  className="mr-2"
                />
                <span>Technical Debt (Drag)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEffects.teamLearning}
                  onChange={() => toggleEffect('teamLearning')}
                  className="mr-2"
                />
                <span>Team Learning (Growth)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEffects.weeklyMeetings}
                  onChange={() => toggleEffect('weeklyMeetings')}
                  className="mr-2"
                />
                <span>Weekly Planning (Cycle)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEffects.monthlyReviews}
                  onChange={() => toggleEffect('monthlyReviews')}
                  className="mr-2"
                />
                <span>Monthly Reviews (Cycle)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEffects.userFeedback}
                  onChange={() => toggleEffect('userFeedback')}
                  className="mr-2"
                />
                <span>User Feedback (Response)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEffects.unexpectedEvents}
                  onChange={() => toggleEffect('unexpectedEvents')}
                  className="mr-2"
                />
                <span>Unexpected Events (Random)</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Right Column - Metrics and Events */}
        <div className="flex flex-col gap-4">
          {/* Metrics Over Time Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Team & Quality Metrics</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="week" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="quality" stroke="#10b981" name="Quality" />
                <Line type="monotone" dataKey="morale" stroke="#8b5cf6" name="Morale" />
                <Line type="monotone" dataKey="technicalDebt" stroke="#f59e0b" name="Tech Debt" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Velocity & Capability Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Velocity & Team Capability</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 'auto']} />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="velocity" stroke="#ec4899" name="Velocity" yAxisId="left" />
                <Line type="monotone" dataKey="teamCapability" stroke="#6366f1" name="Team Capability" yAxisId="right" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Event Log */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Project Event Log</h3>
            <div className="max-h-64 overflow-y-auto">
              <ul className="space-y-1">
                {eventLog.slice().reverse().map((event, idx) => (
                  <li 
                    key={idx} 
                    className="py-1 px-2 rounded flex items-center gap-2"
                  >
                    {eventIcons[event.type]}
                    <span className="text-gray-500 text-sm mr-1">Week {event.week}:</span>
                    <span>{event.event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDynamicsSimulator;

