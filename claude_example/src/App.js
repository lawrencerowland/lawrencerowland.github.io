import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const initialData = [
  { time: 0, sustaining: 20, disruptive: 0, acceptable: 30 },
  { time: 25, sustaining: 35, disruptive: 10, acceptable: 30 },
  { time: 50, sustaining: 50, disruptive: 30, acceptable: 30 },
  { time: 75, sustaining: 65, disruptive: 60, acceptable: 30 },
  { time: 100, sustaining: 80, disruptive: 100, acceptable: 30 },
];

const DataAnalyticsExplorer = () => {
  const [analyticsPoint, setAnalyticsPoint] = useState(75);
  const [dataPoint, setDataPoint] = useState(50);
  const [disruptionRate, setDisruptionRate] = useState(50);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnalyticsSliderChange = (value) => {
    setAnalyticsPoint(value[0]);
  };

  const handleDataSliderChange = (value) => {
    setDataPoint(value[0]);
  };

  const handleDisruptionRateChange = (value) => {
    setDisruptionRate(value[0]);
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  const adjustedData = initialData.map(point => ({
    ...point,
    disruptive: Math.min(100, point.disruptive * (disruptionRate / 50))
  }));

  const getPositionLabel = (point) => {
    if (point < 25) return 'Emerging';
    if (point < 50) return 'Growing';
    if (point < 75) return 'Maturing';
    return 'Established';
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Comprehensive Data and Analytics Hypothesis Explorer</h1>
      
      <Card className="mb-4">
        <CardHeader>Technology Performance and Industry Position</CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={adjustedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" label={{ value: 'Time / Industry Maturity', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Performance / Market Position', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sustaining" stroke="#8884d8" name="Sustaining Technology" />
              <Line type="monotone" dataKey="disruptive" stroke="#82ca9d" name="Disruptive Technology" />
              <Line type="monotone" dataKey="acceptable" stroke="#ff7300" name="Acceptable Performance" strokeDasharray="5 5" />
              <ReferenceLine x={analyticsPoint} stroke="red" label={{ value: "Analytics", fill: "red", fontSize: 12 }} />
              <ReferenceLine x={dataPoint} stroke="blue" label={{ value: "Data", fill: "blue", fontSize: 12 }} />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Analytics Position: {getPositionLabel(analyticsPoint)}</label>
              <Slider
                defaultValue={[75]}
                max={100}
                step={5}
                onValueChange={handleAnalyticsSliderChange}
              />
            </div>
            <div>
              <label className="block mb-2">Data Position: {getPositionLabel(dataPoint)}</label>
              <Slider
                defaultValue={[50]}
                max={100}
                step={5}
                onValueChange={handleDataSliderChange}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block mb-2">Disruption Rate: {disruptionRate}%</label>
            <Slider
              defaultValue={[50]}
              max={100}
              step={5}
              onValueChange={handleDisruptionRateChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Industry Dynamics Visualization</CardHeader>
        <CardContent>
          <div className="flex justify-around items-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Horizontal Industry</h3>
              <div className="w-32 h-32 border-2 border-green-500 rounded-full relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {analyticsPoint > 50 && <div className="text-red-500">Analytics</div>}
                  {dataPoint > 50 && <div className="text-blue-500">Data</div>}
                </div>
              </div>
              <p className="mt-2">Maturing Products</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Vertical Industry</h3>
              <div className="w-32 h-32 border-2 border-blue-500 rounded-full relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {analyticsPoint <= 50 && <div className="text-red-500">Analytics</div>}
                  {dataPoint <= 50 && <div className="text-blue-500">Data</div>}
                </div>
              </div>
              <p className="mt-2">Emerging Markets</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={toggleExplanation} className="mb-4">
        {showExplanation ? 'Hide' : 'Show'} Explanation
      </Button>
      
      {showExplanation && (
        <Card className="mb-4">
          <CardHeader>Hypothesis Explanation</CardHeader>
          <CardContent>
            <p>This model, based on Christensen's theory and Fine's work from 1998, illustrates:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Analytics (red line) is currently in the {getPositionLabel(analyticsPoint)} stage. {analyticsPoint > 50 ? "It's transitioning from horizontal (mature) markets to vertical (emerging) ones." : "It's positioned in emerging markets, showing potential for growth."}</li>
              <li>Data (blue line) is in the {getPositionLabel(dataPoint)} stage. {dataPoint <= 50 ? "It's positioned to directly enter emerging markets, showing high disruptive potential." : "It's moving towards maturity, potentially becoming a sustaining technology."}</li>
              <li>The disruption rate slider allows you to adjust the pace of disruptive technology growth, simulating different market conditions.</li>
              <li>The challenge for project management is to leverage the capabilities of both analytics and data, considering their different stages of development and market positions.</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataAnalyticsExplorer;