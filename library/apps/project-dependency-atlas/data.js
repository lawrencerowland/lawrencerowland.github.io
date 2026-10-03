/* Historical illustrative data preserved from Project-web-apps 8221f32. */
(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.DependencyAtlasData = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
"use strict";
const SCENARIOS = {
  pennine: {
    title: "Pennine Viaduct Renewal Programme",
    subtitle: "Phase-bundled dependency map",
    meta: [
      { label: "Programme", value: "PVRP", sub: "Network Rail CP7" },
      { label: "Phases", value: "5", sub: "Concept → Handback" },
      { label: "Dependencies", value: "36", sub: "23 cross-phase" },
      { label: "Critical Node", value: "Design", sub: "11 incident links" }
    ],
    insight: {
      title: "Choke-point detected",
      text: "Design Integration acts as the structural hub: 11 of the 36 dependency links touch it directly, including six outgoing links into Build and Possession. That makes it the clearest point to test decoupling between permanent works approval, temporary works coordination, and downstream access planning."
    },
    hierarchy: {
      name: "PVRP",
      children: [
        { name: "Concept", children: [
          { name: "Feasibility Study" },
          { name: "Options Appraisal" },
          { name: "GRIP 1 Output" },
          { name: "Funding Case" }
        ]},
        { name: "Design", children: [
          { name: "Perm Works Design" },
          { name: "Temp Works Coord" },
          { name: "Design Integration" },
          { name: "Signalling Scheme" },
          { name: "GRIP 4 Gate" }
        ]},
        { name: "Build", children: [
          { name: "Piling & Foundations" },
          { name: "Steelwork Erection" },
          { name: "Deck Pour" },
          { name: "Drainage & Services" },
          { name: "Safety Barriers" }
        ]},
        { name: "Possession", children: [
          { name: "Possession Planning" },
          { name: "Line Blockage" },
          { name: "Rail Reinstatement" },
          { name: "Signalling Comms" }
        ]},
        { name: "Handback", children: [
          { name: "Test & Commission" },
          { name: "Defects Resolution" },
          { name: "As-Built Records" },
          { name: "Operator Handback" }
        ]}
      ]
    },
    imports: [
      // Concept → Design
      { s: "Feasibility Study", t: "Perm Works Design" },
      { s: "Options Appraisal", t: "Design Integration" },
      { s: "GRIP 1 Output", t: "GRIP 4 Gate" },
      { s: "Funding Case", t: "Design Integration" },
      // Concept → Build
      { s: "Options Appraisal", t: "Piling & Foundations" },
      // Design → Design (internal cross)
      { s: "Perm Works Design", t: "Design Integration" },
      { s: "Temp Works Coord", t: "Design Integration" },
      { s: "Signalling Scheme", t: "Design Integration" },
      // Design → Build
      { s: "Design Integration", t: "Piling & Foundations" },
      { s: "Design Integration", t: "Steelwork Erection" },
      { s: "Design Integration", t: "Deck Pour" },
      { s: "Perm Works Design", t: "Steelwork Erection" },
      { s: "Temp Works Coord", t: "Piling & Foundations" },
      { s: "GRIP 4 Gate", t: "Piling & Foundations" },
      { s: "Signalling Scheme", t: "Signalling Comms" },
      { s: "Design Integration", t: "Drainage & Services" },
      { s: "Design Integration", t: "Safety Barriers" },
      // Build → Build (internal)
      { s: "Piling & Foundations", t: "Steelwork Erection" },
      { s: "Steelwork Erection", t: "Deck Pour" },
      { s: "Deck Pour", t: "Drainage & Services" },
      { s: "Drainage & Services", t: "Safety Barriers" },
      // Build → Possession
      { s: "Safety Barriers", t: "Possession Planning" },
      { s: "Steelwork Erection", t: "Line Blockage" },
      { s: "Deck Pour", t: "Possession Planning" },
      { s: "Piling & Foundations", t: "Line Blockage" },
      // Design → Possession
      { s: "Design Integration", t: "Possession Planning" },
      { s: "Signalling Scheme", t: "Rail Reinstatement" },
      // Possession → Possession
      { s: "Possession Planning", t: "Line Blockage" },
      { s: "Line Blockage", t: "Rail Reinstatement" },
      { s: "Rail Reinstatement", t: "Signalling Comms" },
      // Possession → Handback
      { s: "Signalling Comms", t: "Test & Commission" },
      { s: "Rail Reinstatement", t: "Test & Commission" },
      // Build → Handback
      { s: "Safety Barriers", t: "Defects Resolution" },
      // Handback internal
      { s: "Test & Commission", t: "Defects Resolution" },
      { s: "Defects Resolution", t: "As-Built Records" },
      { s: "As-Built Records", t: "Operator Handback" }
    ],
    phaseColors: {
      "Concept": "#38bdf8",
      "Design": "#a78bfa",
      "Build": "#f59e0b",
      "Possession": "#fb923c",
      "Handback": "#34d399"
    }
  },

  srp: {
    title: "Sellafield SRP — Retrievals Programme",
    subtitle: "Gate-bundled dependency map",
    meta: [
      { label: "Programme", value: "SRP", sub: "Sellafield Ltd" },
      { label: "Gates", value: "6", sub: "FBC → Decommission" },
      { label: "Dependencies", value: "28", sub: "13 cross-gate" },
      { label: "Critical Node", value: "Reg approval", sub: "6 incident links" }
    ],
    insight: {
      title: "Regulatory coupling risk",
      text: "The ONR Safety Case has three direct outgoing links: to the ALARP demonstration, retrieval tooling design, and waste characterisation. That couples regulatory assurance to two delivery pathways; the Reg Approval Gate is the busiest node overall, with six incident links."
    },
    hierarchy: {
      name: "SRP",
      children: [
        { name: "FBC", children: [
          { name: "Business Case" },
          { name: "Cost Model" },
          { name: "Schedule Baseline" }
        ]},
        { name: "Regulatory", children: [
          { name: "ONR Safety Case" },
          { name: "EA Permit" },
          { name: "ALARP Demo" },
          { name: "Reg Approval Gate" }
        ]},
        { name: "Retrievals", children: [
          { name: "Tooling Design" },
          { name: "Remote Handling" },
          { name: "Silo Access" },
          { name: "Fuel Retrieval Ops" },
          { name: "Monitoring Systems" }
        ]},
        { name: "Waste", children: [
          { name: "Characterisation" },
          { name: "Conditioning" },
          { name: "Interim Storage" },
          { name: "Transport Package" }
        ]},
        { name: "Decomm", children: [
          { name: "Structure Demo" },
          { name: "Site Remediation" },
          { name: "Final Survey" },
          { name: "Delicensing" }
        ]},
        { name: "DigitalPMO", children: [
          { name: "Data Integration" },
          { name: "Digital Twin" },
          { name: "AI Monitoring" }
        ]}
      ]
    },
    imports: [
      { s: "Business Case", t: "ONR Safety Case" },
      { s: "Cost Model", t: "Schedule Baseline" },
      { s: "Schedule Baseline", t: "Tooling Design" },
      { s: "Business Case", t: "Reg Approval Gate" },
      { s: "ONR Safety Case", t: "ALARP Demo" },
      { s: "ALARP Demo", t: "Reg Approval Gate" },
      { s: "EA Permit", t: "Reg Approval Gate" },
      { s: "ONR Safety Case", t: "Tooling Design" },
      { s: "ONR Safety Case", t: "Characterisation" },
      { s: "Reg Approval Gate", t: "Silo Access" },
      { s: "Reg Approval Gate", t: "Remote Handling" },
      { s: "Reg Approval Gate", t: "Fuel Retrieval Ops" },
      { s: "Tooling Design", t: "Remote Handling" },
      { s: "Remote Handling", t: "Silo Access" },
      { s: "Silo Access", t: "Fuel Retrieval Ops" },
      { s: "Fuel Retrieval Ops", t: "Characterisation" },
      { s: "Monitoring Systems", t: "AI Monitoring" },
      { s: "Characterisation", t: "Conditioning" },
      { s: "Conditioning", t: "Interim Storage" },
      { s: "Interim Storage", t: "Transport Package" },
      { s: "Fuel Retrieval Ops", t: "Structure Demo" },
      { s: "Transport Package", t: "Structure Demo" },
      { s: "Structure Demo", t: "Site Remediation" },
      { s: "Site Remediation", t: "Final Survey" },
      { s: "Final Survey", t: "Delicensing" },
      { s: "Data Integration", t: "Digital Twin" },
      { s: "Digital Twin", t: "AI Monitoring" },
      { s: "Data Integration", t: "Monitoring Systems" }
    ],
    phaseColors: {
      "FBC": "#38bdf8",
      "Regulatory": "#f43f5e",
      "Retrievals": "#f59e0b",
      "Waste": "#a78bfa",
      "Decomm": "#34d399",
      "DigitalPMO": "#fb923c"
    }
  }
};

const TIMELINE_SCENARIOS = {
  portfolio: {
    title: "UK Infrastructure Portfolio — Q1/Q2 2026",
    subtitle: "Faceted schedule comparison",
    meta: [
      { label: "Programmes", value: "4", sub: "Active UK infrastructure" },
      { label: "Tasks tracked", value: "16", sub: "Across all streams" },
      { label: "Schedule risk", value: "2 slips", sub: "Amber/Red flags" },
      { label: "Window", value: "6 months", sub: "Jan — Jun 2026" }
    ],
    insight: {
      title: "Capacity collision ahead",
      text: "Pennine Viaduct steelwork and HS2 civils both demand specialist crane capacity in April-May. The Sellafield retrievals ramp overlaps with both. Three programmes competing for the same specialist subcontractor pool — flag to Portfolio Board for sequencing decision."
    },
    streams: [
      {
        name: "Pennine Viaduct Renewal",
        tasks: [
          { task: "GRIP 4 Design", start: "2026-01-05", end: "2026-02-28", status: "complete", milestone: false },
          { task: "Piling Works", start: "2026-03-01", end: "2026-04-15", status: "active", milestone: false },
          { task: "Steelwork Erection", start: "2026-04-16", end: "2026-06-10", status: "planned", milestone: false },
          { task: "GRIP 5 Gate", start: "2026-06-10", end: "2026-06-10", status: "milestone", milestone: true }
        ]
      },
      {
        name: "Sellafield SRP",
        tasks: [
          { task: "ONR Submission", start: "2026-01-15", end: "2026-03-01", status: "complete", milestone: false },
          { task: "Tooling Procurement", start: "2026-02-15", end: "2026-04-30", status: "active", milestone: false },
          { task: "Silo Access Prep", start: "2026-04-01", end: "2026-05-30", status: "at-risk", milestone: false },
          { task: "Retrieval Start", start: "2026-06-01", end: "2026-06-01", status: "milestone", milestone: true }
        ]
      },
      {
        name: "HS2 Phase 2a Civils",
        tasks: [
          { task: "Earthworks Package C", start: "2026-01-10", end: "2026-03-20", status: "delayed", milestone: false },
          { task: "Viaduct Civils", start: "2026-03-21", end: "2026-05-25", status: "planned", milestone: false },
          { task: "Utilities Diversion", start: "2026-02-01", end: "2026-04-10", status: "active", milestone: false },
          { task: "NR Possession Window", start: "2026-05-25", end: "2026-05-25", status: "milestone", milestone: true }
        ]
      },
      {
        name: "Thames Tideway — East",
        tasks: [
          { task: "Shaft Sinking", start: "2026-01-08", end: "2026-03-15", status: "complete", milestone: false },
          { task: "TBM Drive", start: "2026-03-01", end: "2026-06-30", status: "active", milestone: false },
          { task: "Secondary Lining", start: "2026-05-01", end: "2026-06-20", status: "planned", milestone: false },
          { task: "Connection Milestone", start: "2026-06-28", end: "2026-06-28", status: "milestone", milestone: true }
        ]
      }
    ]
  },
  "pennine-tl": {
    title: "Pennine Viaduct — Workstream Breakdown",
    subtitle: "Faceted schedule comparison",
    meta: [
      { label: "Programme", value: "PVRP", sub: "Detailed view" },
      { label: "Workstreams", value: "5", sub: "Discipline breakdown" },
      { label: "Critical path", value: "Steelwork", sub: "Longest chain" },
      { label: "Window", value: "8 months", sub: "Jan — Aug 2026" }
    ],
    insight: {
      title: "Float consumption warning",
      text: "Signalling integration has consumed 80% of its float due to late Network Rail design approvals. If the ERTMS interface specification slips past April, it becomes critical path and delays the possession window by the full slip duration — no remaining buffer."
    },
    streams: [
      {
        name: "Permanent Works",
        tasks: [
          { task: "Foundation Design", start: "2026-01-05", end: "2026-02-15", status: "complete", milestone: false },
          { task: "Piling", start: "2026-02-16", end: "2026-04-01", status: "active", milestone: false },
          { task: "Substructure", start: "2026-04-02", end: "2026-05-15", status: "planned", milestone: false },
          { task: "Superstructure", start: "2026-05-16", end: "2026-07-30", status: "planned", milestone: false }
        ]
      },
      {
        name: "Temporary Works",
        tasks: [
          { task: "Scaffold Design", start: "2026-01-12", end: "2026-02-08", status: "complete", milestone: false },
          { task: "Access Platform", start: "2026-02-20", end: "2026-03-25", status: "complete", milestone: false },
          { task: "Crane Base", start: "2026-03-15", end: "2026-04-20", status: "active", milestone: false },
          { task: "Demobilisation", start: "2026-07-15", end: "2026-08-10", status: "planned", milestone: false }
        ]
      },
      {
        name: "Signalling",
        tasks: [
          { task: "Scheme Design", start: "2026-01-20", end: "2026-03-30", status: "at-risk", milestone: false },
          { task: "ERTMS Interface", start: "2026-03-15", end: "2026-05-10", status: "at-risk", milestone: false },
          { task: "Installation", start: "2026-05-20", end: "2026-07-15", status: "planned", milestone: false },
          { task: "Sig Test Gate", start: "2026-07-15", end: "2026-07-15", status: "milestone", milestone: true }
        ]
      },
      {
        name: "Drainage & Services",
        tasks: [
          { task: "Survey & Design", start: "2026-02-01", end: "2026-03-10", status: "complete", milestone: false },
          { task: "Diversion Works", start: "2026-03-11", end: "2026-04-25", status: "active", milestone: false },
          { task: "New Drainage", start: "2026-05-01", end: "2026-06-15", status: "planned", milestone: false }
        ]
      },
      {
        name: "Possession & Handback",
        tasks: [
          { task: "Possession Bid", start: "2026-02-01", end: "2026-03-15", status: "complete", milestone: false },
          { task: "Line Blockage", start: "2026-06-01", end: "2026-07-20", status: "planned", milestone: false },
          { task: "Rail Reinstatement", start: "2026-07-21", end: "2026-08-05", status: "planned", milestone: false },
          { task: "Handback Gate", start: "2026-08-10", end: "2026-08-10", status: "milestone", milestone: true }
        ]
      }
    ]
  }
};

return { bundles: SCENARIOS, timelines: TIMELINE_SCENARIOS, sourceDate: "2026-03-25" };
});
