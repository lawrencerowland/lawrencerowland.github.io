import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, BarChart, Bar } from 'recharts';
import './App.css';
import { generateGaussianCopula, createRiskDistributions, generateExtremeScenario, calculateImpact, getHistogramData, seededRandom } from './model';

const CopulaRiskAnalysis = () => {
  const [correlationParam, setCorrelationParam] = useState(0.7);
  const [sampleSize, setSampleSize] = useState(500);
  const [seed, setSeed] = useState(42);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [copulaData, setCopulaData] = useState<any[]>([]);
  const [extremeScenarioData, setExtremeScenarioData] = useState<any[]>([]);
  const [showExtremeScenario, setShowExtremeScenario] = useState(false);
  const [scenarioImpact, setScenarioImpact] = useState<{ delay: number, cost: number } | null>(null);
  const [currentView, setCurrentView] = useState('intro');

  useEffect(() => {
    const copula = generateGaussianCopula(correlationParam, sampleSize, seededRandom(seed));
    setCopulaData(copula);
    
    const risks = createRiskDistributions(copula);
    setRiskData(risks);
    
    const extremeScenario = generateExtremeScenario(risks);
    setExtremeScenarioData(extremeScenario);
    
    const impact = calculateImpact(risks);
    setScenarioImpact(impact);
    
    setFoundationHistogram(getHistogramData(risks, d => d.foundationDelay, 10, 30));
    setElectricalHistogram(getHistogramData(risks, d => d.electricalDelay, 10, 4));
  }, [correlationParam, sampleSize, seed]);
  
  useEffect(() => {
    if (showExtremeScenario) {
      const extremeImpact = calculateImpact(extremeScenarioData);
      setScenarioImpact(extremeImpact);
    } else {
      const normalImpact = calculateImpact(riskData);
      setScenarioImpact(normalImpact);
    }
  }, [showExtremeScenario, extremeScenarioData, riskData]);
  
  const handleCorrelationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorrelationParam(parseFloat(e.target.value));
  };
  
  const handleExtremeScenarioToggle = () => {
    setShowExtremeScenario(!showExtremeScenario);
  };
  
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };
  
  const [foundationHistogram, setFoundationHistogram] = useState<any[]>([]);
  const [electricalHistogram, setElectricalHistogram] = useState<any[]>([]);
  
  return (
    <div className="flex flex-col p-4 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">Construction Project Risk Analysis with Copulas</h1>
        
        <p className="mb-3"><strong>Calculated toy model.</strong> Couple two invented task-delay distributions with a Gaussian copula. Each dot is one equally weighted Monte Carlo draw, not project evidence. The seed stays fixed while you adjust dependence so comparisons reuse the same random inputs.</p>
        <div className="flex gap-4 mb-4 flex-wrap">
          <label>Samples: <select value={sampleSize} onChange={e => setSampleSize(Number(e.target.value))}><option value={500}>500</option><option value={2000}>2,000</option><option value={5000}>5,000</option></select></label>
          <button className="px-3 py-2 rounded-md bg-gray-200" onClick={() => setSeed(s => s + 1)}>New sample</button>
          <span>Seed: {seed}</span>
        </div>
        <div className="flex gap-4 mb-4 flex-wrap">
          <button
            className={`px-3 py-2 rounded-md ${currentView === 'intro' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('intro')}
          >
            Introduction
          </button>
          <button
            className={`px-3 py-2 rounded-md ${currentView === 'copula' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('copula')}
          >
            Copula Structure
          </button>
          <button
            className={`px-3 py-2 rounded-md ${currentView === 'marginals' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('marginals')}
          >
            Task Delay Distributions
          </button>
          <button
            className={`px-3 py-2 rounded-md ${currentView === 'joint' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('joint')}
          >
            Joint Delay Analysis
          </button>
          <button
            className={`px-3 py-2 rounded-md ${currentView === 'stress' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleViewChange('stress')}
          >
            Stress Testing
          </button>
        </div>
        
        {currentView === 'intro' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Office Building Construction Project</h2>
            <p className="mb-2">
              We're analyzing a construction project with two key interrelated tasks:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li><strong>Foundation Work:</strong> Potential delays in days (affects multiple downstream tasks)</li>
              <li><strong>Electrical System Installation:</strong> Potential delays in days (dependent on foundation completion)</li>
            </ul>
            <p className="mb-3">
              These tasks have individual delay distributions, but they're also related. For example:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Poor soil conditions can delay foundation work <strong>and</strong> make electrical conduit installation more difficult</li>
              <li>Labor shortages can affect both tasks simultaneously</li>
              <li>Material availability issues often impact both systems</li>
            </ul>
            <p className="mb-2">
              <strong>Why a copula approach helps:</strong> Copulas allow us to model both the individual risk behavior of each task and their mutual dependencies, showing when both tasks might be delayed simultaneously.
            </p>
          </div>
        )}
        
        {currentView === 'copula' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">The Copula: Modeling Task Dependencies</h2>
            <p className="mb-3">
              A copula is a mathematical function that describes the dependence structure between tasks, separate from each task's individual delay distribution.
            </p>
            <p className="mb-3">
              <strong>In practical terms:</strong> A copula lets us answer questions like "If foundation work is delayed by 2 weeks, what's the probability that electrical installation will also be delayed?"
            </p>
            <p className="mb-2">
              The plot below shows a Gaussian copula with uniform margins. This represents the pure dependency structure between our two tasks before applying their specific delay distributions.
            </p>
            
            <div className="flex items-center mb-4">
              <span className="mr-2 font-medium">Latent normal correlation:</span>
              <input
                type="range"
                aria-label="Latent normal correlation"
                min="-0.95"
                max="0.95"
                step="0.05"
                value={correlationParam}
                onChange={handleCorrelationChange}
                className="w-64"
              />
              <span className="ml-2">{correlationParam.toFixed(2)}</span>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="u1" name="U1" domain={[0, 1]} label={{ value: 'Foundation Delay (Uniform Scale)', position: 'bottom' }} />
                  <YAxis type="number" dataKey="u2" name="U2" domain={[0, 1]} label={{ value: 'Electrical Delay (Uniform Scale)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                  <Tooltip 
                    formatter={(value) => [value.toFixed(2), '']}
                    labelFormatter={() => 'Uniform values'}
                  />
                  <Scatter name="Dependency Structure" data={copulaData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <p className="mt-3">
              <strong>What this means:</strong> With positive correlation ({correlationParam > 0 ? 'like we see here' : ''}), delays in foundation work tend to coincide with delays in electrical installation. Negative correlation would mean that when one task is delayed, the other tends to be on schedule.
            </p>
          </div>
        )}
        
        {currentView === 'marginals' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Task Delay Distributions</h2>
            <p className="mb-3">
              Both marginal distributions are invented assumptions for this example; no historical project data has been fitted:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Foundation Work Delays</h3>
                <p className="mb-2">Capped lognormal: exp(2 + 0.8Z) days, with Z standard normal and a hard cap at 30 days. The cap creates a point mass at 30 and removes more severe outcomes; the histogram includes that mass.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={foundationHistogram} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="binCenter" label={{ value: 'Delay (days)', position: 'bottom' }} />
                      <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                      <Tooltip 
                        formatter={(value) => [(value * 100).toFixed(1) + '%', 'Probability']}
                        labelFormatter={(value) => `Delay: ~${Math.round(value)} days`}
                      />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Electrical Installation Delays</h3>
                <p className="mb-2">Bounded power distribution: 4 × U^(1/1.5) days for uniform U. It ranges from 0 to 4 days and favors the upper end. It has no long right tail; that is a restrictive teaching assumption.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={electricalHistogram} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="binCenter" label={{ value: 'Delay (days)', position: 'bottom' }} />
                      <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                      <Tooltip 
                        formatter={(value) => [(value * 100).toFixed(1) + '%', 'Probability']}
                        labelFormatter={(value) => `Delay: ~${Math.round(value)} days`}
                      />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <p className="mt-3">
              <strong>Key insight:</strong> Looking at these distributions separately doesn't tell us how delays in one task might coincide with delays in the other. That's where copulas come in.
            </p>
          </div>
        )}
        
        {currentView === 'joint' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Joint Delay Analysis</h2>
            <p className="mb-3">
              Increasing marginal quantile transforms turn the uniform values into task delays. The foundation cap creates ties, so the capped margins no longer have a unique copula:
            </p>
            
            <div className="h-64 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="foundationDelay" name="Foundation Delay" label={{ value: 'Foundation Delay (days)', position: 'bottom' }} />
                  <YAxis type="number" dataKey="electricalDelay" name="Electrical Delay" label={{ value: 'Electrical Delay (days)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                  <ZAxis type="number" dataKey="probability" range={[20, 20]} />
                  <Tooltip 
                    formatter={(value) => [value.toFixed(1) + ' days', '']}
                    labelFormatter={(_, payload) => {
                      if (!payload || !payload[0]) return '';
                      return `Foundation: ${payload[0].payload.foundationDelay.toFixed(1)} days\nElectrical: ${payload[0].payload.electricalDelay.toFixed(1)} days`;
                    }}
                  />
                  <Scatter name="Delay Scenarios" data={riskData} fill="#ff7300" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <p className="mb-2">
              <strong>What project managers can learn:</strong> This finite sample illustrates combinations under the assumed distributions, helping you inspect:
            </p>
            <ul className="list-disc pl-6">
              <li>Which delay combinations are most likely</li>
              <li>How often both tasks enter their upper deciles in this sample</li>
              <li>How delays in foundation work tend to correlate with delays in electrical installation</li>
              <li>The presence of outliers that represent extreme risk scenarios</li>
            </ul>
            
            <p className="mt-3">
              The parameter ({correlationParam.toFixed(2)}) is the correlation of the latent normal draws. It is not the Pearson correlation of the transformed delays. Dependence is an assumption, not evidence of common causes.
            </p>
          </div>
        )}
        
        {currentView === 'stress' && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Stress Testing: What If Both Tasks Are Severely Delayed?</h2>
            <p className="mb-3">
              Select draws where both underlying uniforms exceed 0.90. Each task is in its upper decile, but their intersection is generally much less than 10% and can be empty in a finite sample.
            </p>
            
            <div className="mb-4">
              <button
                className={`px-4 py-2 rounded-md ${showExtremeScenario ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                onClick={handleExtremeScenarioToggle}
              >
                {showExtremeScenario ? 'Hide Extreme Scenario' : 'Show Both Upper Deciles'}
              </button>
            </div>
            
            <div className="h-64 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="foundationDelay" name="Foundation Delay" label={{ value: 'Foundation Delay (days)', position: 'bottom' }} />
                  <YAxis type="number" dataKey="electricalDelay" name="Electrical Delay" label={{ value: 'Electrical Delay (days)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                  <ZAxis type="number" dataKey="probability" range={[20, 20]} />
                  <Tooltip 
                    formatter={(value) => [value.toFixed(1) + ' days', '']}
                    labelFormatter={(_, payload) => {
                      if (!payload || !payload[0]) return '';
                      return `Foundation: ${payload[0].payload.foundationDelay.toFixed(1)} days\nElectrical: ${payload[0].payload.electricalDelay.toFixed(1)} days`;
                    }}
                  />
                  <Scatter 
                    name="Delay Scenarios" 
                    data={showExtremeScenario ? extremeScenarioData : riskData} 
                    fill={showExtremeScenario ? '#d32f2f' : '#ff7300'} 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <p className="mb-3">Joint upper-decile draws: {extremeScenarioData.length} / {riskData.length} ({riskData.length ? (100 * extremeScenarioData.length / riskData.length).toFixed(2) : '0'}%). This is a Monte Carlo estimate, not a confidence level; zero observed draws does not establish zero risk.</p>
            <div className="bg-yellow-50 p-3 rounded-lg mb-3">
              <h3 className="text-lg font-medium mb-1">Illustrative Project Impact</h3>
              <p>Assume two sequential tasks with no float: added delay = foundation + electrical days. Cost = $5,000 per foundation day + $3,000 per electrical day. Conditional means normalize the selected sample weights. The unconditional mean of this additive rule should barely change with dependence; joint-tail frequency can change strongly.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Mean added project delay: {scenarioImpact ? `${scenarioImpact.delay} days` : "Not estimated — no joint-tail draws"}</strong><br/>
                  {showExtremeScenario ? 
                    '(Conditional on both upper deciles)' :
                    '(Mean across all sample draws)'}
                </div>
                <div>
                  <strong>Mean cost impact: {scenarioImpact ? `$${scenarioImpact.cost}k` : "Not estimated — no joint-tail draws"}</strong><br/>
                  {showExtremeScenario ? 
                    '(Conditional on both upper deciles)' :
                    '(Mean across all sample draws)'}
                </div>
              </div>
            </div>
            
            <p className="mb-2">
              <strong>Actions for risk mitigation:</strong>
            </p>
            <ul className="list-disc pl-6">
              <li>Identify common causes that could delay both tasks (e.g., labor issues, weather events)</li>
              <li>Prepare targeted contingency plans for the specific scenario where both tasks face severe delays</li>
              <li>Consider resource reallocation strategies that can address simultaneous delays</li>
              <li>Determine appropriate financial and schedule buffers based on correlated risk assessments</li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Key Takeaways for Project Risk Managers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <h3 className="text-lg font-medium mb-1">Beyond Independent Analysis</h3>
            <p>
              Traditional risk analyses often treat task delays as independent events. Copulas encode an assumed pattern of joint delays; they do not identify the causes of that dependence.
            </p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="text-lg font-medium mb-1">Targeted Contingency Planning</h3>
            <p>
              Instead of generic buffers, you can develop specific contingency plans for scenarios where multiple interdependent tasks face delays simultaneously.
            </p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <h3 className="text-lg font-medium mb-1">Risk Communication</h3>
            <p>
              Copula analysis provides a clearer picture of project risk for stakeholder communication, showing not just individual task risks but how they might combine.
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p>
            <strong>Mathematical note for data scientists:</strong> For |ρ| &lt; 1, a Gaussian copula has zero asymptotic upper and lower tail dependence, even though finite upper-decile co-occurrence can be substantial. Other families have different behavior: Clayton has lower-tail dependence and Gumbel upper-tail dependence in their usual positive-dependence forms; Frank has neither. A chosen family needs evidence and validation.
          </p>
          <p className="mt-2">Method: <a href="https://www.statsmodels.org/stable/generated/statsmodels.distributions.copula.api.GaussianCopula.html">Gaussian copula definition</a>; <a href="https://www.statsmodels.org/dev/generated/statsmodels.distributions.copula.api.GaussianCopula.dependence_tail.html">Gaussian tail dependence</a>.</p>
          <p className="mt-2 italic">
            Try adjusting the correlation parameter to see how different dependency structures between foundation work and electrical installation affect overall project risk profiles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopulaRiskAnalysis;
