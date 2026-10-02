import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// A highlighted relation must retain the same model/profile across its endpoints.
export function connectedProfileNodes(layers, startNode, activeModel) {
  const modelIds = startNode ? startNode.models.filter(id => !activeModel || id === activeModel) : [];
  return Object.fromEntries(Object.entries(layers).map(([layer, nodes]) => [layer, nodes.filter(node => node.models.some(id => modelIds.includes(id)))]));
}

// Helper to lighten a hex color by mixing it with white
const lightenColor = (hex, amount = 0.8) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const lighten = (c) => Math.round(c + (255 - c) * amount);
  return (
    '#' +
    [lighten(r), lighten(g), lighten(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
};

const AICapabilitiesDiagram = () => {
  // Define the three layers of nodes
  const layers = {
    inputs: [
      { id: 'text', label: 'Text', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'], 
        description: 'Natural language text inputs including prompts, instructions, and lengthy text documents.' },
      { id: 'images', label: 'Images', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Static image inputs that models can analyze, including photos, charts, diagrams, and screenshots.' },
      { id: 'audio', label: 'Audio', models: ['gflash', 'g15pro', 'g15reasoning'],
        description: 'Audio files or streams including speech, music, and ambient sounds for transcription or analysis.' },
      { id: 'video', label: 'Video', models: ['gflash', 'g15pro', 'g15reasoning'],
        description: 'Video content that can be analyzed for visual content, motion, and accompanying audio.' },
      { id: 'documents', label: 'Documents', models: ['gflash', 'g15pro', 'claude35', 'claude37'],
        description: 'Structured documents like PDFs, spreadsheets, or presentations with text, tables, and formatting.' },
      { id: 'structured', label: 'Structured Files', models: ['g15pro'],
        description: 'Highly structured data formats like JSON, CSV, or code repositories with specific syntax and organization.' },
    ],
    processing: [
      { id: 'reasoning', label: 'Enhanced Reasoning', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Advanced logical reasoning capabilities for solving complex problems, drawing inferences, and making connections.' },
      { id: 'cot', label: 'Extended Reasoning', models: ['gpt45', 'gflash', 'g15reasoning', 'claude37'],
        description: 'A conceptual category for spending more computation on a problem. A visible explanation is not a faithful trace of a model’s internal reasoning.' },
      { id: 'longcontext', label: 'Long Context Window', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Support for long inputs; context limits vary and useful details may still be missed.' },
      { id: 'tooluse', label: 'Tool Use & Function Calling', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Capability to use external tools, call functions, execute code, or interface with APIs to extend functionality.' },
      { id: 'multimodal', label: 'Multimodal Understanding', models: ['gflash', 'g15pro', 'claude35', 'claude37'],
        description: 'Integration of information across different modalities (text, images, etc.) for unified comprehension.' },
      { id: 'memory', label: 'Memory & Personalization', models: ['gpt45', 'claude35', 'claude37'],
        description: 'An application-level capability that can retain preferences or retrieve prior interactions; it is not implied by a model name alone.' },
    ],
    outputs: [
      { id: 'text_out', label: 'Text/Reports', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Natural language text outputs including explanations, stories, summaries, and detailed reports.' },
      { id: 'structured_out', label: 'Structured Data (JSON/XML)', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Formatted data structures that follow specific schemas like JSON or XML for easy integration with other systems.' },
      { id: 'code', label: 'Code', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Programming code in various languages, including functions, scripts, or complete applications.' },
      { id: 'images_out', label: 'Images', models: ['gflash'],
        description: 'AI-generated images, modified images, or visual representations based on text prompts.' },
      { id: 'documents_out', label: 'Documents & Artifacts', models: ['gpt45', 'g15pro', 'claude35', 'claude37'],
        description: 'Complex documents with formatting, sections, and potentially embedded content like tables or charts.' },
      { id: 'interactive', label: 'Interactive Visuals', models: ['claude35', 'claude37'],
        description: 'Dynamic, interactive visual outputs such as charts, diagrams, or interfaces that users can manipulate.' },
    ]
  };

  // Define models with their display names and colors
  const models = [
    { id: 'gpt45', name: 'GPT 4.5', color: '#74aa9c', description: 'OpenAI\'s GPT-4.5 large language model with enhanced reasoning and knowledge capabilities.' },
    { id: 'gflash', name: 'Gemini Flash', color: '#4285F4', description: 'Google\'s Gemini Flash model optimized for fast responses with strong reasoning capabilities and multimodal inputs.' },
    { id: 'g15pro', name: 'Gemini 1.5 Pro', color: '#34A853', description: 'Google\'s Gemini 1.5 Pro featuring extremely long context window and advanced multimodal processing.' },
    { id: 'g15reasoning', name: 'Reasoning profile (conceptual)', color: '#FBBC05', description: 'An unverified profile from the original sketch, retained as a conceptual category rather than a confirmed product.' },
    { id: 'claude35', name: 'Claude 3.5 Sonnet', color: '#662D91', description: 'Anthropic\'s Claude 3.5 Sonnet balancing reasoning capabilities with speed and efficiency.' },
    { id: 'claude37', name: 'Claude 3.7 w/ Extended Thinking', color: '#8A4FFF', description: 'Claude with enhanced extended thinking mode for deeper reasoning on complex problems.' }
  ];

  // State for the active model filter, hovered node, and info modal
  const [activeModel, setActiveModel] = useState(null);
  const [previewNode, setHoveredNode] = useState(null);
  const [pinnedNode, setPinnedNode] = useState(null);
  const hoveredNode = previewNode || pinnedNode;
  const [showInfoModal, setShowInfoModal] = useState(false);
  const infoDialog = useRef(null);
  useEffect(() => {
    if (showInfoModal) infoDialog.current?.showModal();
    else infoDialog.current?.close();
  }, [showInfoModal]);

  // Function to determine if a node should be highlighted based on the active model
  const isHighlighted = (node) => {
    if (!activeModel) return true;
    return node.models.includes(activeModel);
  };

  // Find a color representing the connection between two nodes
  const getConnectionColor = (nodeA, nodeB) => {
    if (!nodeA || !nodeB) return '#3b82f6'; // Tailwind blue-500 default

    // If a model filter is active and both nodes include it, use that color
    if (activeModel && nodeA.models.includes(activeModel) && nodeB.models.includes(activeModel)) {
      const model = models.find(m => m.id === activeModel);
      if (model) return model.color;
    }

    // Otherwise pick the first shared model between the nodes
    const shared = nodeA.models.find(m => nodeB.models.includes(m));
    if (shared) {
      const model = models.find(m => m.id === shared);
      if (model) return model.color;
    }

    return '#3b82f6';
  };

  // Function to find all connected nodes across layers
  // Extract hoveredNode information
  const [hoveredLayer, hoveredId] = hoveredNode ? hoveredNode.split(':') : [null, null];
  const hoveredNodeObj = hoveredLayer ? layers[hoveredLayer].find(n => n.id === hoveredId) : null;
  
  // Find connected nodes
  const connectedNodes = connectedProfileNodes(layers, hoveredNodeObj, activeModel);
  
  // Function to check if a node is part of the highlighted path
  const isPartOfPath = (node, layer) => {
    if (!hoveredNode) return false;
    return connectedNodes[layer].includes(node);
  };

  return (
    <div className="capabilities-app flex flex-col w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center flex-grow">AI Models Capabilities Wiring Diagram (2025)</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
          aria-label="About this diagram"
          onClick={() => setShowInfoModal(true)}
        >
          ?
        </button>
      </div>
      
      <p><strong>Historical concept sketch (2025), not a verified model comparison.</strong> These original classifications mix model, platform and application features. They are retained to explore a three-layer representation; product support and model names require independent verification before use.</p>
      <p>Highlighted cards share a listed model or conceptual profile. They do not prove a working end-to-end pipeline or reveal a model’s internal architecture.</p>
      {/* Model selector */}
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        <button 
          className={`px-3 py-1 rounded-full text-sm ${!activeModel ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          aria-pressed={!activeModel}
          onClick={() => setActiveModel(null)}
        >
          All Models
        </button>
        {models.map(model => (
          <button
            key={model.id}
            className={`px-3 py-1 rounded-full text-sm ${activeModel === model.id ? 'text-white' : 'bg-gray-200 text-gray-800'}`}
            style={{ backgroundColor: activeModel === model.id ? model.color : '' }}
            aria-pressed={activeModel === model.id}
            onClick={() => setActiveModel(model.id)}
            title={model.description}
          >
            {model.name}
          </button>
        ))}
      </div>
      
      {/* Diagram layout */}
      <div className="flex justify-between gap-4">
        {/* Inputs column */}
        <div className="w-1/3 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Inputs</h2>
          <div className="space-y-3 w-full">
            {layers.inputs.map(node => {
              const isEgoNode = hoveredNode === `inputs:${node.id}`;
              const isConnected = isPartOfPath(node, 'inputs');
              const opacity = hoveredNode && !isConnected ? 0.3 : 1;
              
              return (
                <button type="button"
                  key={node.id}
                  className={`p-3 rounded-lg text-center transition-all duration-200
                    ${!isHighlighted(node) ? 'opacity-30' : ''}
                    ${isEgoNode ? 'ring-4 shadow-lg scale-105 z-10' :
                     isConnected ? 'ring-2 shadow-md' : 'shadow-sm'}`}
                  style={{
                    backgroundColor: isHighlighted(node) ?
                      (isEgoNode
                        ? lightenColor(getConnectionColor(hoveredNodeObj, node), 0.85)
                        : isConnected
                          ? lightenColor(getConnectionColor(hoveredNodeObj, node), 0.9)
                          : '#f0f4f8')
                      : '#f0f0f0',
                    cursor: 'pointer',
                    opacity: !isHighlighted(node) ? 0.3 : opacity,
                    transform: isEgoNode ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out',
                    '--tw-ring-color': getConnectionColor(hoveredNodeObj, node)
                  }}
                  onMouseEnter={() => setHoveredNode(`inputs:${node.id}`)}
                  onFocus={() => setHoveredNode(`inputs:${node.id}`)}
                  onBlur={() => setHoveredNode(null)}
                  onClick={() => setPinnedNode(pinnedNode === `inputs:${node.id}` ? null : `inputs:${node.id}`)}
                  aria-pressed={pinnedNode === `inputs:${node.id}`}
                  aria-label={`${node.label}: ${node.description}`}
                  onMouseLeave={() => setHoveredNode(null)}
                  title={node.description}
                >
                  <div className={`font-medium ${isEgoNode ? 'text-blue-800' : ''}`}>{node.label}</div>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {node.models.map(modelId => {
                      const model = models.find(m => m.id === modelId);
                      return (
                        <div 
                          key={modelId}
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: model.color,
                            opacity: activeModel && activeModel !== modelId ? 0.3 : 1
                          }}
                          title={model.name}
                        />
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Processing column */}
        <div className="w-1/3 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Processing & Reasoning</h2>
          <div className="space-y-3 w-full">
            {layers.processing.map(node => {
              const isEgoNode = hoveredNode === `processing:${node.id}`;
              const isConnected = isPartOfPath(node, 'processing');
              const opacity = hoveredNode && !isConnected ? 0.3 : 1;
              
              return (
                <button type="button"
                  key={node.id}
                  className={`p-3 rounded-lg text-center transition-all duration-200
                    ${!isHighlighted(node) ? 'opacity-30' : ''}
                    ${isEgoNode ? 'ring-4 shadow-lg scale-105 z-10' :
                     isConnected ? 'ring-2 shadow-md' : 'shadow-sm'}`}
                  style={{
                    backgroundColor: isHighlighted(node) ?
                      (isEgoNode
                        ? lightenColor(getConnectionColor(hoveredNodeObj, node), 0.85)
                        : isConnected
                          ? lightenColor(getConnectionColor(hoveredNodeObj, node), 0.9)
                          : '#edf2ff')
                      : '#f0f0f0',
                    cursor: 'pointer',
                    opacity: !isHighlighted(node) ? 0.3 : opacity,
                    transform: isEgoNode ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out',
                    '--tw-ring-color': getConnectionColor(hoveredNodeObj, node)
                 }}
                  onMouseEnter={() => setHoveredNode(`processing:${node.id}`)}
                  onFocus={() => setHoveredNode(`processing:${node.id}`)}
                  onBlur={() => setHoveredNode(null)}
                  onClick={() => setPinnedNode(pinnedNode === `processing:${node.id}` ? null : `processing:${node.id}`)}
                  aria-pressed={pinnedNode === `processing:${node.id}`}
                  aria-label={`${node.label}: ${node.description}`}
                  onMouseLeave={() => setHoveredNode(null)}
                  title={node.description}
                >
                  <div className={`font-medium ${isEgoNode ? 'text-blue-800' : ''}`}>{node.label}</div>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {node.models.map(modelId => {
                      const model = models.find(m => m.id === modelId);
                      return (
                        <div 
                          key={modelId}
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: model.color,
                            opacity: activeModel && activeModel !== modelId ? 0.3 : 1
                          }}
                          title={model.name}
                        />
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Outputs column */}
        <div className="w-1/3 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Outputs</h2>
          <div className="space-y-3 w-full">
            {layers.outputs.map(node => {
              const isEgoNode = hoveredNode === `outputs:${node.id}`;
              const isConnected = isPartOfPath(node, 'outputs');
              const opacity = hoveredNode && !isConnected ? 0.3 : 1;
              
              return (
                <button type="button"
                  key={node.id}
                  className={`p-3 rounded-lg text-center transition-all duration-200
                    ${!isHighlighted(node) ? 'opacity-30' : ''}
                    ${isEgoNode ? 'ring-4 shadow-lg scale-105 z-10' :
                     isConnected ? 'ring-2 shadow-md' : 'shadow-sm'}`}
                  style={{
                    backgroundColor: isHighlighted(node) ?
                      (isEgoNode
                        ? lightenColor(getConnectionColor(hoveredNodeObj, node), 0.85)
                        : isConnected
                          ? lightenColor(getConnectionColor(hoveredNodeObj, node), 0.9)
                          : '#f0f8f4')
                      : '#f0f0f0',
                    cursor: 'pointer',
                    opacity: !isHighlighted(node) ? 0.3 : opacity,
                    transform: isEgoNode ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out',
                    '--tw-ring-color': getConnectionColor(hoveredNodeObj, node)
                 }}
                  onMouseEnter={() => setHoveredNode(`outputs:${node.id}`)}
                  onFocus={() => setHoveredNode(`outputs:${node.id}`)}
                  onBlur={() => setHoveredNode(null)}
                  onClick={() => setPinnedNode(pinnedNode === `outputs:${node.id}` ? null : `outputs:${node.id}`)}
                  aria-pressed={pinnedNode === `outputs:${node.id}`}
                  aria-label={`${node.label}: ${node.description}`}
                  onMouseLeave={() => setHoveredNode(null)}
                  title={node.description}
                >
                  <div className={`font-medium ${isEgoNode ? 'text-blue-800' : ''}`}>{node.label}</div>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {node.models.map(modelId => {
                      const model = models.find(m => m.id === modelId);
                      return (
                        <div 
                          key={modelId}
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: model.color,
                            opacity: activeModel && activeModel !== modelId ? 0.3 : 1
                          }}
                          title={model.name}
                        />
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <section aria-live="polite" className="node-description">{hoveredNodeObj ? <><h2>{hoveredNodeObj.label}</h2><p>{hoveredNodeObj.description}</p></> : <p>Focus, hover or select a capability card to read its description. Select it again to release the selection.</p>}</section>
      {/* Legend */}
      <div className="mt-8">
        <h3 className="text-base font-semibold mb-2">Models Legend</h3>
        <div className="flex flex-wrap gap-4">
          {models.map(model => (
            <div key={model.id} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: model.color }}
              />
              <span>{model.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-600">
        <p>Hover, focus or select cards to inspect shared model/profile classifications across the layers.</p>
        <p>Select a specific model to highlight only its capabilities, or view "All Models" for the complete picture.</p>
      </div>
      
      {/* Information Modal */}
      <dialog ref={infoDialog} aria-labelledby="diagram-about" onClose={() => setShowInfoModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 id="diagram-about" className="text-xl font-bold">About This Diagram</h2>
              <button 
                aria-label="Close diagram information"
                onClick={() => setShowInfoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p><strong>What is this?</strong> This historical sketch groups claimed AI capabilities into inputs, processing and outputs. It is an exploratory representation, with unverified product classifications.</p>
              
              <h3 className="font-semibold">Three-Layer Architecture:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Inputs</strong> (left column): The types of data each model can accept and process (text, images, audio, etc.)</li>
                <li><strong>Processing & Reasoning</strong> (middle column): Conceptual capability categories; these are not verified internal operations</li>
                <li><strong>Outputs</strong> (right column): The formats and types of content each model can produce in response</li>
              </ul>
              
              <h3 className="font-semibold">How to Use This Diagram:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Hover, focus or select any card</strong> to see categories sharing a listed model/profile. This does not establish a supported input-to-output workflow</li>
                <li><strong>Filter by model</strong> using the buttons at the top to focus on one profile in this sketch</li>
                <li><strong>Hover over colored dots</strong> to see which model they represent</li>
                <li><strong>Explore connections</strong> to understand how different input types, processing capabilities, and output formats are related</li>
              </ul>
              
              <h3 className="font-semibold">Example Use Cases:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ask which evidence would establish an image-to-code workflow</li>
                <li>Compare the categories assigned to interactive visuals</li>
                <li>Compare the original classifications across all three layers</li>
                <li>Identify missing evidence before using a claimed connection in a real application</li>
              </ul>
              
              <p className="mt-4">Use this as a prompt for checking components, integrations and evidence. A shared label is only an association in this dataset.</p>
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
      </dialog>
    </div>
  );
};

export default AICapabilitiesDiagram;