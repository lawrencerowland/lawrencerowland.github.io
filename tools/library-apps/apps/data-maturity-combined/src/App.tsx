import React, { useState } from 'react';
import './App.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Info, X } from 'lucide-react';

const DetailButton = ({ label, onClick }) => <button type="button" className="detail-button" aria-label={label} onClick={onClick}><Info size={16} aria-hidden="true" /></button>;

const DataMaturityAssessment = () => {
  // State for tabs and interactive elements
  const [activeTab, setActiveTab] = useState('graph');
  const [expandedCapability, setExpandedCapability] = useState(null);
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [highlightedLevel, setHighlightedLevel] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const originalPromptText = `Write me a structured question framework, with question branches , for assessing the data maturity of a project management organisation, broken down into three mutually supporting levels of capability : 1. Project staff member. 2. Project team capability .3. Whole project organisation capability. Ask the most differentiating questions first , in case the interviewees only answer a few questions. please provide this as an artifact, both as: 1. a table including columns for question , question branch , capability area, capability level and scoring schema for the question. 2. an interactive graph of capability areas and question branches. You will need to provide very short labels to the nodes and edges, with a key`;
  
  // Capability areas (main nodes)
  const capabilities = [
    { id: "DCM", name: "Data Collection & Management", color: "#4285F4", description: "How data is gathered, stored, and organized throughout the project lifecycle" },
    { id: "DAI", name: "Data Analysis & Interpretation", color: "#EA4335", description: "How data is analyzed to extract meaningful insights for project decision-making" },
    { id: "DDM", name: "Data-Driven Decision Making", color: "#FBBC05", description: "How data insights are incorporated into project decisions at all levels" },
    { id: "DIT", name: "Data Infrastructure & Technology", color: "#34A853", description: "What tools and systems support data work across the project organization" },
    { id: "DGS", name: "Data Governance & Security", color: "#8E24AA", description: "How data is protected, managed, and governed across projects" },
    { id: "DLS", name: "Data Literacy & Skills", color: "#FF6D00", description: "What capabilities exist to work with data effectively at individual and team levels" },
    { id: "DIS", name: "Data Integration & Sharing", color: "#0097A7", description: "How data flows between teams, systems, and stakeholders" },
    { id: "DQR", name: "Data Quality & Reliability", color: "#757575", description: "How data accuracy, completeness, and consistency are maintained" }
  ];
  
  // Question branches (secondary nodes)
  const branches = [
    { id: "CP", name: "Collection Practices", capability: "DCM", description: "Methods and approaches used to gather project data" },
    { id: "SO", name: "Storage & Organization", capability: "DCM", description: "How project data is stored, structured, and organized" },
    { id: "AM", name: "Analysis Methods", capability: "DAI", description: "Techniques used to analyze and make sense of project data" },
    { id: "RV", name: "Reporting & Visualization", capability: "DAI", description: "How project data is presented and communicated visually" },
    { id: "DP", name: "Decision Processes", capability: "DDM", description: "How data informs and influences project decisions" },
    { id: "TI", name: "Technology Infrastructure", capability: "DIT", description: "Technical systems and tools that support project data management" },
    { id: "SP", name: "Security Protocols", capability: "DGS", description: "Measures to protect and secure project data" },
    { id: "TD", name: "Training & Development", capability: "DLS", description: "How data skills are built and maintained across the organization" },
    { id: "DS", name: "Data Sharing Mechanisms", capability: "DIS", description: "Methods for sharing project data with stakeholders" },
    { id: "QC", name: "Quality Control", capability: "DQR", description: "Processes to ensure project data is accurate and reliable" },
    { id: "SA", name: "Strategic Alignment", capability: "DDM", description: "How project data usage aligns with organizational strategy" },
    { id: "CI", name: "Continuous Improvement", capability: "DQR", description: "How data practices evolve and improve over time" }
  ];
  
  // Capability levels
  const levels = [
    { id: 1, name: "Individual", color: "#A8D5BA", description: "Capabilities of individual project staff members in working with data" },
    { id: 2, name: "Team", color: "#95B8D1", description: "Collective data capabilities at the project team level" },
    { id: 3, name: "Organization", color: "#B8A9C9", description: "Enterprise-wide project data capabilities across the organization" }
  ];
  
  // Questions data with full text
  const questions = [
    { id: "Q1", branch: "CP", capability: "DCM", level: 2, text: "How are project data requirements identified and documented?", scoring: "1=No formal requirements, 3=Basic documented requirements, 5=Comprehensive requirements aligned with project objectives" },
    { id: "Q2", branch: "DP", capability: "DDM", level: 3, text: "How are data-driven insights used to make project decisions?", scoring: "1=Rarely used, 3=Used for some key decisions, 5=Systematically integrated into all decision-making processes" },
    { id: "Q3", branch: "TD", capability: "DLS", level: 1, text: "What skills do you personally have for analyzing project data?", scoring: "1=Basic spreadsheet skills only, 3=Intermediate analysis skills, 5=Advanced analysis and visualization capabilities" },
    { id: "Q4", branch: "QC", capability: "DQR", level: 2, text: "How is data quality verified and maintained within projects?", scoring: "1=No verification process, 3=Basic quality checks, 5=Comprehensive quality assurance framework" },
    { id: "Q5", branch: "SP", capability: "DGS", level: 3, text: "What data governance policies exist across the organization?", scoring: "1=No formal policies, 3=Basic policies in place, 5=Comprehensive governance framework with regular audits" },
    { id: "Q6", branch: "CP", capability: "DCM", level: 1, text: "How do you personally collect and manage project data?", scoring: "1=Ad-hoc collection, 3=Structured approach, 5=Systematic collection with metadata" },
    { id: "Q7", branch: "TI", capability: "DIT", level: 3, text: "What technology infrastructure supports data management across projects?", scoring: "1=Minimal infrastructure, 3=Basic systems in place, 5=Advanced integrated systems" },
    { id: "Q8", branch: "DS", capability: "DIS", level: 2, text: "How does your team share project data with stakeholders?", scoring: "1=Manual sharing on request, 3=Regular reporting mechanisms, 5=Automated dashboards with self-service analytics" },
    { id: "Q9", branch: "AM", capability: "DAI", level: 1, text: "How do you personally interpret project data for decision-making?", scoring: "1=Basic interpretation, 3=Contextual analysis, 5=Advanced statistical analysis" },
    { id: "Q10", branch: "QC", capability: "DQR", level: 2, text: "What processes does your team use to ensure data reliability?", scoring: "1=No formal processes, 3=Basic validation checks, 5=Comprehensive quality management system" },
    { id: "Q11", branch: "SA", capability: "DDM", level: 3, text: "How is project data used to inform strategic organizational decisions?", scoring: "1=Rarely considered, 3=Sometimes incorporated, 5=Systematically integrated into strategy" },
    { id: "Q12", branch: "TI", capability: "DIT", level: 1, text: "What data analysis tools do you personally use for project work?", scoring: "1=Basic spreadsheets, 3=Specialized analysis tools, 5=Advanced analytics software" },
    { id: "Q13", branch: "RV", capability: "DAI", level: 2, text: "How does your team visualize and report project data?", scoring: "1=Basic tables and charts, 3=Interactive dashboards, 5=Advanced visualizations with predictive elements" },
    { id: "Q14", branch: "SP", capability: "DGS", level: 1, text: "What data security practices do you personally follow?", scoring: "1=Basic password protection, 3=Following standard protocols, 5=Proactive security practices" },
    { id: "Q15", branch: "DS", capability: "DIS", level: 3, text: "How is project data integrated across teams and departments?", scoring: "1=Minimal integration, 3=Some shared systems, 5=Fully integrated data ecosystem" },
    { id: "Q16", branch: "TD", capability: "DLS", level: 1, text: "What training is available to improve your personal data skills?", scoring: "1=No formal training, 3=Basic training available, 5=Comprehensive development program" },
    { id: "Q17", branch: "DP", capability: "DDM", level: 2, text: "How does your team incorporate data analysis into project planning?", scoring: "1=Minimal use in planning, 3=Regular consideration, 5=Planning fully driven by data insights" },
    { id: "Q18", branch: "SO", capability: "DCM", level: 3, text: "What organizational standards exist for data management across projects?", scoring: "1=No standards, 3=Basic standards defined, 5=Comprehensive standards with compliance monitoring" },
    { id: "Q19", branch: "CI", capability: "DLS", level: 1, text: "How do you personally keep your data skills current?", scoring: "1=No specific effort, 3=Occasional learning, 5=Structured continuous development" },
    { id: "Q20", branch: "CI", capability: "DQR", level: 2, text: "What processes does your team use to improve data practices?", scoring: "1=No formal processes, 3=Periodic reviews, 5=Systematic improvement framework" },
    { id: "Q21", branch: "CI", capability: "DGS", level: 3, text: "How does the organization evaluate the effectiveness of its data practices?", scoring: "1=No evaluation, 3=Basic assessments, 5=Comprehensive evaluation and improvement framework" },
    { id: "Q22", branch: "QC", capability: "DQR", level: 1, text: "How do you verify the quality of data you personally work with?", scoring: "1=No verification, 3=Basic checks, 5=Systematic validation procedures" },
    { id: "Q23", branch: "SO", capability: "DCM", level: 2, text: "What tools does your team use to store and organize project data?", scoring: "1=Basic file systems, 3=Dedicated databases, 5=Advanced data management platforms" },
    { id: "Q24", branch: "TD", capability: "DLS", level: 3, text: "How are data analytics capabilities developed across the organization?", scoring: "1=No development focus, 3=Some training available, 5=Comprehensive capability development strategy" },
    { id: "Q25", branch: "DP", capability: "DDM", level: 1, text: "How do you use project data to improve your personal work performance?", scoring: "1=Rarely use data, 3=Regular review of metrics, 5=Continuous data-driven performance improvement" },
    { id: "Q26", branch: "AM", capability: "DAI", level: 2, text: "What technology does your team use for data analysis?", scoring: "1=Basic tools only, 3=Specialized analysis software, 5=Advanced analytics platforms with AI/ML capabilities" },
    { id: "Q27", branch: "SA", capability: "DIS", level: 3, text: "How is data treated as a strategic asset across the organization?", scoring: "1=Not viewed as strategic, 3=Recognized value, 5=Central to organizational strategy" },
    { id: "Q28", branch: "TI", capability: "DIT", level: 1, text: "What access do you have to project data repositories?", scoring: "1=Limited access, 3=Access to team repositories, 5=Comprehensive access with appropriate permissions" },
    { id: "Q29", branch: "SP", capability: "DGS", level: 2, text: "How does your team handle data security incidents?", scoring: "1=No defined process, 3=Basic response procedures, 5=Comprehensive incident management framework" },
    { id: "Q30", branch: "QC", capability: "DQR", level: 3, text: "What organization-wide systems are in place for data quality assurance?", scoring: "1=No systems, 3=Basic quality standards, 5=Comprehensive quality management framework" }
  ];

  // Help content for popup
  const helpContent = {
    general: {
      title: "How to Use This Framework",
      content: [
        "This data maturity assessment framework helps evaluate project management organizations across three capability levels.",
        "1. Q1-Q5 are suggested opening questions; their ability to distinguish maturity has not been validated.",
        "2. Choose questions relevant to the specific role of the interviewee (individual, team, or organizational level).",
        "3. Score each response on a 1-5 scale using the provided scoring criteria.",
        "4. Use the Graph View to understand relationships between capability areas.",
        "5. Use the Table View for detailed question information and scoring guides."
      ]
    },
    conducting: {
      title: "Conducting the Assessment",
      content: [
        "1. Select a representative sample of staff across different roles and levels.",
        "2. Schedule 30-45 minute interviews or distribute as a survey.",
        "3. Focus on getting concrete examples, not just theoretical answers.",
        "4. Compare responses across levels to identify gaps between individual, team, and organizational capabilities.",
        "5. Prioritize improvement areas where capabilities are misaligned across levels."
      ]
    },
    analyzing: {
      title: "Analyzing Results",
      content: [
        "1. Record responses and supporting examples outside this app. If averaging ordinal 1–5 scores, explain the limitations and retain the underlying answers.",
        "2. Identify strengths (high scores) and weaknesses (low scores).",
        "3. Look for capability gaps between individual, team, and organizational levels.",
        "4. Create a maturity heatmap using the scoring data across capability areas.",
        "5. Develop targeted improvement plans for the lowest-scoring areas."
      ]
    },
    originalPrompt: {
      title: "Original Prompt",
      content: [originalPromptText]
    }
  };

  // Helper function to get branches for a capability
  const getBranchesForCapability = (capabilityId) => {
    return branches.filter(branch => questions.some(question => question.branch === branch.id && question.capability === capabilityId));
  };

  // Helper function to get questions for a branch
  const getQuestionsForBranch = (branchId, capabilityId) => {
    return questions.filter(question => question.branch === branchId && question.capability === capabilityId);
  };

  // Helper function to get capability by ID
  const getCapabilityById = (capabilityId) => {
    return capabilities.find(cap => cap.id === capabilityId);
  };

  // Helper function to get branch by ID
  const getBranchById = (branchId) => {
    return branches.find(branch => branch.id === branchId);
  };

  // Helper function to get level by ID
  const getLevelById = (levelId) => {
    return levels.find(level => level.id === levelId);
  };

  // Function to render tooltip
  const renderTooltip = (id, type) => {
    let content;
    
    if (type === 'capability') {
      const cap = getCapabilityById(id);
      content = (
        <div>
          <h3 className="font-bold text-sm">{cap.name}</h3>
          <p className="text-xs mt-1">{cap.description}</p>
        </div>
      );
    } else if (type === 'branch') {
      const branch = getBranchById(id);
      content = (
        <div>
          <h3 className="font-bold text-sm">{branch.name}</h3>
          <p className="text-xs mt-1">{branch.description}</p>
        </div>
      );
    } else if (type === 'level') {
      const level = getLevelById(id);
      content = (
        <div>
          <h3 className="font-bold text-sm">Level {id}: {level.name}</h3>
          <p className="text-xs mt-1">{level.description}</p>
        </div>
      );
    } else if (type === 'question') {
      const question = questions.find(q => q.id === id);
      content = (
        <div>
          <h3 className="font-bold text-sm">{question.text}</h3>
          <p className="text-xs mt-1"><strong>Scoring:</strong> {question.scoring}</p>
          <p className="text-xs mt-1">
            <strong>Level:</strong> {getLevelById(question.level).name} | 
            <strong> Capability:</strong> {getCapabilityById(question.capability).id} | 
            <strong> Branch:</strong> {getBranchById(question.branch).id}
          </p>
        </div>
      );
    } else if (type === 'help') {
      const helpSection = helpContent[id];
      content = (
        <div>
          <h3 className="font-bold text-sm">{helpSection.title}</h3>
          <ul className="text-xs mt-1 list-disc pl-4">
            {helpSection.content.map((item, index) => (
              <li key={index} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
      );
    } else if (type === 'prompt') {
      content = (
        <div>
          <h3 className="font-bold text-sm">Original Prompt</h3>
          <p className="text-xs mt-1 whitespace-pre-wrap">{originalPromptText}</p>
        </div>
      );
    }
    
    return (
      <div role="region" aria-label="Framework detail" className="framework-detail bg-white border shadow-lg rounded-md p-3">
        <button 
          className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
          aria-label="Close details"
          onClick={() => setActiveTooltip(null)}
        >
          <X size={16} />
        </button>
        {content}
      </div>
    );
  };

  return (
    <div className="maturity-app flex flex-col gap-4" onKeyDown={event => { if (event.key === 'Escape') setActiveTooltip(null); }}>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Data Maturity Assessment Framework</CardTitle>
              <CardDescription>
                An illustrative question bank for discussing project data capabilities
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 flex items-center gap-1"
                aria-expanded={showHelp}
                onClick={() => setShowHelp(!showHelp)}
              >
                <Info size={16} /> Help
              </button>
              <div className="relative">
                <button
                  className="px-3 py-1 text-sm rounded-md bg-green-100 hover:bg-green-200 text-green-800 flex items-center gap-1"
                  onClick={() => setActiveTooltip('prompt')}
                >
                  <Info size={16} /> Original Prompt
                </button>
                {activeTooltip === 'prompt' && (
                  <div className="relative mt-2">
                    {renderTooltip('originalPrompt', 'prompt')}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <p>This is an unvalidated discussion framework, not a benchmark or certification. It does not save answers or calculate scores. The 1–5 guides and question order are suggestions; no evidence establishes that Q1–Q5 are the most differentiating. Branches can belong to more than one capability.</p>
          {/* Tabs */}
          <div className="flex border-b mt-2">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'graph' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              aria-pressed={activeTab === 'graph'}
              onClick={() => { setActiveTab('graph'); setActiveTooltip(null); }}
            >
              Graph View
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'table' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              aria-pressed={activeTab === 'table'}
              onClick={() => { setActiveTab('table'); setActiveTooltip(null); }}
            >
              Table View
            </button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Help popups */}
          {showHelp && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
              <div className="font-medium mb-2">Assessment Framework Help</div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-2 py-1 text-xs rounded-md bg-white hover:bg-blue-100"
                  onClick={() => setActiveTooltip('help-general')}
                >
                  How to Use This Framework
                </button>
                <button
                  className="px-2 py-1 text-xs rounded-md bg-white hover:bg-blue-100"
                  onClick={() => setActiveTooltip('help-conducting')}
                >
                  Conducting the Assessment
                </button>
                <button
                  className="px-2 py-1 text-xs rounded-md bg-white hover:bg-blue-100"
                  onClick={() => setActiveTooltip('help-analyzing')}
                >
                  Analyzing Results
                </button>
              </div>
              
              {activeTooltip === 'help-general' && (
                <div className="relative mt-2">
                  {renderTooltip('general', 'help')}
                </div>
              )}
              {activeTooltip === 'help-conducting' && (
                <div className="relative mt-2">
                  {renderTooltip('conducting', 'help')}
                </div>
              )}
              {activeTooltip === 'help-analyzing' && (
                <div className="relative mt-2">
                  {renderTooltip('analyzing', 'help')}
                </div>
              )}
            </div>
          )}
          
          {/* Graph View Tab */}
          {activeTab === 'graph' && (
            <div>
              {/* Level filter */}
              <div className="level-filters flex gap-2 mb-4">
                <div className="text-sm font-medium">Filter by level:</div>
                {levels.map(level => (
                  <div key={level.id} className="relative">
                    <button
                      className="px-2 py-1 text-xs rounded-full transition-colors flex items-center gap-1"
                      style={{ 
                        backgroundColor: highlightedLevel === level.id ? level.color : 'rgba(0,0,0,0.05)',
                        color: '#111827'
                      }}
                      aria-pressed={highlightedLevel === level.id}
                      onClick={() => setHighlightedLevel(highlightedLevel === level.id ? null : level.id)}
                    >
                      {level.name}

                    </button>
                    <DetailButton label={`About ${level.name} level`} onClick={() => setActiveTooltip(`level-${level.id}`)} />
                    {activeTooltip === `level-${level.id}` && (
                      <div className="relative">
                        {renderTooltip(level.id, 'level')}
                      </div>
                    )}
                  </div>
                ))}
                {highlightedLevel && (
                  <button
                    className="px-2 py-1 text-xs rounded-full bg-gray-200"
                    onClick={() => setHighlightedLevel(null)}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Graph container */}
              <div className="relative border rounded-md p-4 overflow-x-auto" style={{ minHeight: '600px' }}>
                <div className="flex flex-row justify-between mb-4 gap-2">
                  {/* Capability nodes (Level 1 of hierarchy) */}
                  {capabilities.map(capability => (
                    <div key={capability.id} className="flex flex-col items-center min-w-32">
                      <div className="relative">
                        <button
                          className="w-32 p-2 rounded-md text-white text-center mb-2 font-medium text-sm relative"
                          style={{ backgroundColor: capability.color, color: '#111827' }}
                          aria-label={`Expand ${capability.name}`}
                          aria-expanded={expandedCapability === capability.id}
                          onClick={() => setExpandedCapability(expandedCapability === capability.id ? null : capability.id)}
                        >
                          {capability.id}
                          <div className="text-xs font-normal">{capability.name.split(' ')[0]}</div>

                        </button>
                        <DetailButton label={`About ${capability.name}`} onClick={() => setActiveTooltip(`cap-${capability.id}`)} />
                        {activeTooltip === `cap-${capability.id}` && (
                          <div className="relative">
                            {renderTooltip(capability.id, 'capability')}
                          </div>
                        )}
                      </div>
                      
                      {/* Vertical connector line */}
                      <div className="h-6 w-0.5 bg-gray-300"></div>
                      
                      {/* Branch nodes (Level 2 of hierarchy) */}
                      <div className="flex flex-col items-center gap-6">
                        {getBranchesForCapability(capability.id).map(branch => (
                          <div key={branch.id} className="flex flex-col items-center">
                            <div className="relative">
                              <button
                                className="w-24 p-1 rounded-md border-2 text-center mb-2 text-sm relative"
                                style={{ 
                                  borderColor: capability.color,
                                  backgroundColor: expandedBranch === `${capability.id}-${branch.id}` ? `${capability.color}20` : 'white'
                                }}
                                aria-label={`Expand ${branch.name} in ${capability.id}`}
                                aria-expanded={expandedBranch === `${capability.id}-${branch.id}`}
                                onClick={() => setExpandedBranch(expandedBranch === `${capability.id}-${branch.id}` ? null : `${capability.id}-${branch.id}`)}
                              >
                                {branch.id}

                              </button>
                              <DetailButton label={`About ${branch.name} in ${capability.id}`} onClick={() => setActiveTooltip(`branch-${capability.id}-${branch.id}`)} />
                              {activeTooltip === `branch-${capability.id}-${branch.id}` && (
                                <div className="relative">
                                  {renderTooltip(branch.id, 'branch')}
                                </div>
                              )}
                            </div>
                            
                            {/* Vertical connector line */}
                            <div className="h-4 w-0.5 bg-gray-300"></div>
                            
                            {/* Question nodes (Level 3 of hierarchy) - showing questions for the selected branch */}
                            {(expandedCapability === capability.id || expandedBranch === `${capability.id}-${branch.id}`) && (
                              <div className="flex flex-col items-center gap-2">
                                {getQuestionsForBranch(branch.id, capability.id)
                                  .filter(q => highlightedLevel === null || q.level === highlightedLevel)
                                  .map(question => (
                                    <div key={question.id} className="relative">
                                      <button
                                        className="w-20 p-1 rounded-md text-center text-xs relative"
                                        style={{ 
                                          backgroundColor: getLevelById(question.level).color,
                                          opacity: highlightedLevel === null || question.level === highlightedLevel ? 1 : 0.4
                                        }}
                                        aria-label={`${question.id}: ${question.text}`}
                                        onClick={() => setActiveTooltip(`q-${question.id}`)}
                                      >
                                        {question.id}
                                        <div className="text-xs">L{question.level}</div>
                                      </button>
                                      {activeTooltip === `q-${question.id}` && (
                                        <div className="relative">
                                          {renderTooltip(question.id, 'question')}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Instructions */}
                <div className="absolute top-2 right-2 bg-white bg-opacity-80 p-2 rounded-md text-xs">
                  <p>Click on capability areas or branches to expand/collapse</p>
                  <p>Click on info icons <Info size={12} className="inline" /> for details</p>
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-bold mb-1">Capability Areas</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {capabilities.map(cap => (
                        <div key={cap.id} className="flex items-center">
                          <span 
                            className="inline-block w-3 h-3 mr-1 rounded-full" 
                            style={{ backgroundColor: cap.color }}
                          />
                          <span><strong>{cap.id}</strong>: {cap.name.split(' & ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-1">Question Branches</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {branches.slice(0, 6).map(branch => (
                        <div key={branch.id}>
                          <strong>{branch.id}</strong>: {branch.name}
                        </div>
                      ))}
                      {branches.slice(6, 12).map(branch => (
                        <div key={branch.id}>
                          <strong>{branch.id}</strong>: {branch.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-1">Capability Levels</h4>
                    <div className="flex flex-col gap-1">
                      {levels.map(level => (
                        <div key={level.id} className="flex items-center">
                          <span 
                            className="inline-block w-3 h-3 mr-1 rounded-full" 
                            style={{ backgroundColor: level.color }}
                          />
                          <span><strong>L{level.id}</strong>: {level.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Table View Tab */}
          {activeTab === 'table' && (
            <div>
              <div className="level-filters flex gap-2 mb-4">
                <div className="text-sm font-medium">Filter by level:</div>
                {levels.map(level => (
                  <button
                    key={level.id}
                    className="px-2 py-1 text-xs rounded-full transition-colors"
                    style={{ 
                      backgroundColor: highlightedLevel === level.id ? level.color : 'rgba(0,0,0,0.05)',
                      color: '#111827'
                    }}
                    aria-pressed={highlightedLevel === level.id}
                      onClick={() => setHighlightedLevel(highlightedLevel === level.id ? null : level.id)}
                  >
                    {level.name}
                  </button>
                ))}
                {highlightedLevel && (
                  <button
                    className="px-2 py-1 text-xs rounded-full bg-gray-200"
                    onClick={() => setHighlightedLevel(null)}
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <p className="text-sm">Scroll the table horizontally to read every column, including the scoring guide.</p>
              <div className="overflow-x-auto" tabIndex={0} aria-label="Question table; scroll horizontally">
                <table className="w-full border-collapse text-sm">
                  <caption>Question bank — {highlightedLevel === null ? 'all levels' : getLevelById(highlightedLevel).name}</caption>
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-3 py-2 text-left">ID</th>
                      <th className="border px-3 py-2 text-left">Question</th>
                      <th className="border px-3 py-2 text-left">Branch</th>
                      <th className="border px-3 py-2 text-left">Capability</th>
                      <th className="border px-3 py-2 text-left">Level</th>
                      <th className="border px-3 py-2 text-left">Scoring</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions
                      .filter(q => highlightedLevel === null || q.level === highlightedLevel)
                      .map(question => {
                        const capability = getCapabilityById(question.capability);
                        const branch = getBranchById(question.branch);
                        const level = getLevelById(question.level);
                        
                        return (
                          <tr key={question.id} className="hover:bg-gray-50">
                            <td className="border px-3 py-2 font-medium">{question.id}</td>
                            <td className="border px-3 py-2">{question.text}</td>
                            <td className="border px-3 py-2">
                              <div className="flex items-center">
                                <span className="font-medium mr-1">{branch.id}</span>
                                <span className="text-xs text-gray-500">({branch.name})</span>
                              </div>
                            </td>
                            <td className="border px-3 py-2">
                              <div className="flex items-center">
                                <span 
                                  className="w-3 h-3 rounded-full mr-1" 
                                  style={{ backgroundColor: capability.color }}
                                ></span>
                                <span className="font-medium mr-1">{capability.id}</span>
                              </div>
                            </td>
                            <td className="border px-3 py-2">
                              <span 
                                className="px-2 py-0.5 rounded-full text-xs"
                                style={{ backgroundColor: level.color }}
                              >
                                {level.name}
                              </span>
                            </td>
                            <td className="border px-3 py-2 text-xs">
                              {question.scoring}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataMaturityAssessment;
