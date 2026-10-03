/* Authored source examples; fictional assumptions, not forecasts. */
(function(root){
  "use strict";
  const data = {
  "source": {
    "repository": "lawrencerowland/Project-web-apps",
    "revision": "7888f8a85aa9121e99190d392a622a4ee0cd4a7e",
    "path": "web_apps/portfolio_loom.html",
    "sha256": "a2ed9793665e223e132496f3d63e510c5124d1b6283bcb61b5d35c17cee1631d"
  },
  "seed": {
    "library": [
      {
        "id": "AI Export Controls Tightening",
        "name": "AI Export Controls Tightening",
        "type": "policy",
        "start": "2026-04-01",
        "end": "2027-01-01",
        "confidence": 0.75,
        "weight": 1,
        "effects": {
          "cost": 0.1,
          "schedule": 0.2,
          "quality": 0,
          "supply": 0.4,
          "regulatory": 0.8,
          "talent": 0.3
        },
        "second": [
          {
            "target": "Rare Earth Nationalization",
            "lagMonths": 3,
            "polarity": 1,
            "strength": 0.3
          }
        ],
        "tags": []
      },
      {
        "id": "Cloud Egress Price War",
        "name": "Cloud Egress Price War",
        "type": "market",
        "start": "2026-01-01",
        "end": "2026-12-01",
        "confidence": 0.6,
        "weight": 1,
        "effects": {
          "cost": -0.4,
          "schedule": -0.05,
          "quality": -0.05,
          "supply": 0.15,
          "regulatory": 0.05,
          "talent": 0
        },
        "second": [],
        "tags": []
      },
      {
        "id": "Rare Earth Nationalization",
        "name": "Rare Earth Nationalization",
        "type": "policy",
        "start": "2026-07-01",
        "end": "2027-06-01",
        "confidence": 0.7,
        "weight": 1,
        "effects": {
          "cost": 0.5,
          "schedule": 0.4,
          "quality": 0,
          "supply": 0.8,
          "regulatory": 0.3,
          "talent": 0
        },
        "second": [],
        "tags": []
      },
      {
        "id": "Solid‑State Battery Breakthrough",
        "name": "Solid‑State Battery Breakthrough",
        "type": "tech",
        "start": "2027-04-01",
        "end": "2028-03-01",
        "confidence": 0.65,
        "weight": 1,
        "effects": {
          "cost": -0.2,
          "schedule": -0.3,
          "quality": -0.1,
          "supply": -0.1,
          "regulatory": 0,
          "talent": 0.2
        },
        "second": [],
        "tags": []
      },
      {
        "id": "EU Data Residency Hardline",
        "name": "EU Data Residency Hardline",
        "type": "policy",
        "start": "2026-05-01",
        "end": "2027-07-01",
        "confidence": 0.7,
        "weight": 1,
        "effects": {
          "cost": 0.2,
          "schedule": 0.2,
          "quality": 0.1,
          "supply": 0,
          "regulatory": 0.7,
          "talent": 0.2
        },
        "second": [],
        "tags": []
      },
      {
        "id": "Maritime Chokepoint Disruption",
        "name": "Maritime Chokepoint Disruption",
        "type": "market",
        "start": "2026-03-01",
        "end": "2026-09-01",
        "confidence": 0.8,
        "weight": 1,
        "effects": {
          "cost": 0.35,
          "schedule": 0.35,
          "quality": 0,
          "supply": 0.7,
          "regulatory": 0.1,
          "talent": 0
        },
        "second": [],
        "tags": []
      },
      {
        "id": "GPU Oversupply Correction",
        "name": "GPU Oversupply Correction",
        "type": "market",
        "start": "2026-11-01",
        "end": "2027-09-01",
        "confidence": 0.65,
        "weight": 1,
        "effects": {
          "cost": -0.5,
          "schedule": -0.1,
          "quality": 0,
          "supply": -0.6,
          "regulatory": 0,
          "talent": 0
        },
        "second": [],
        "tags": []
      },
      {
        "id": "Open‑Source FM Leap",
        "name": "Open‑Source FM Leap",
        "type": "tech",
        "start": "2026-06-01",
        "end": "2027-03-01",
        "confidence": 0.6,
        "weight": 1,
        "effects": {
          "cost": -0.15,
          "schedule": -0.25,
          "quality": -0.1,
          "supply": 0,
          "regulatory": 0.05,
          "talent": -0.15
        },
        "second": [
          {
            "target": "Workforce Organizing Wave",
            "lagMonths": 6,
            "polarity": 1,
            "strength": 0.2
          }
        ],
        "tags": []
      },
      {
        "id": "Insurance Premium Supercycle",
        "name": "Insurance Premium Supercycle",
        "type": "market",
        "start": "2026-02-01",
        "end": "2028-01-01",
        "confidence": 0.6,
        "weight": 1,
        "effects": {
          "cost": 0.35,
          "schedule": 0.05,
          "quality": 0,
          "supply": 0,
          "regulatory": 0,
          "talent": 0
        },
        "second": [],
        "tags": []
      },
      {
        "id": "Workforce Organizing Wave",
        "name": "Workforce Organizing Wave",
        "type": "policy",
        "start": "2026-07-01",
        "end": "2027-09-01",
        "confidence": 0.65,
        "weight": 1,
        "effects": {
          "cost": 0.3,
          "schedule": 0.2,
          "quality": 0,
          "supply": 0,
          "regulatory": 0.1,
          "talent": 0.5
        },
        "second": [],
        "tags": []
      },
      {
        "id": "Green Subsidy Cliffs",
        "name": "Green Subsidy Cliffs",
        "type": "policy",
        "start": "2026-09-01",
        "end": "2027-11-01",
        "confidence": 0.7,
        "weight": 1,
        "effects": {
          "cost": 0.6,
          "schedule": 0.2,
          "quality": 0,
          "supply": 0,
          "regulatory": 0.4,
          "talent": 0
        },
        "second": [],
        "tags": []
      },
      {
        "id": "Flagship Privacy Breach (Sectoral)",
        "name": "Flagship Privacy Breach (Sectoral)",
        "type": "market",
        "start": "2026-10-01",
        "end": "2027-01-01",
        "confidence": 0.55,
        "weight": 1,
        "effects": {
          "cost": 0.1,
          "schedule": 0.05,
          "quality": 0.2,
          "supply": 0,
          "regulatory": 0.6,
          "talent": 0.1
        },
        "second": [
          {
            "target": "EU Data Residency Hardline",
            "lagMonths": 2,
            "polarity": 1,
            "strength": 0.25
          }
        ],
        "tags": []
      }
    ],
    "selected": [
      "AI Export Controls Tightening",
      "Rare Earth Nationalization",
      "Maritime Chokepoint Disruption",
      "Green Subsidy Cliffs"
    ],
    "milestones": [
      {
        "id": "m1",
        "label": "M1: Architecture Freeze",
        "date": "2025-10-01"
      },
      {
        "id": "m2",
        "label": "M2: Pilot Launch",
        "date": "2026-07-01"
      },
      {
        "id": "m3",
        "label": "M3: Scale Decision",
        "date": "2027-07-01"
      }
    ],
    "weights": {},
    "startDate": "2025-01-01",
    "horizon": 60,
    "risk": 0.5
  },
  "rules": [
    {
      "dim": "regulatory",
      "thresh": 0.8,
      "text": "Pre‑wire regulators; set up voluntary disclosure & sandbox MOUs."
    },
    {
      "dim": "supply",
      "thresh": 0.8,
      "text": "Dual‑source critical inputs; negotiate flexible MOQs and surge clauses."
    },
    {
      "dim": "cost",
      "thresh": 0.8,
      "text": "Introduce contingency bands; stage capex with option‑to‑defer gates."
    },
    {
      "dim": "schedule",
      "thresh": 0.8,
      "text": "Decompose into freeze horizons; protect critical path with time buffers."
    },
    {
      "dim": "talent",
      "thresh": 0.8,
      "text": "Cross‑train bench; create scarce‑skill fellowships and retention triggers."
    },
    {
      "dim": "quality",
      "thresh": 0.8,
      "text": "Add test oracles; expand pre‑prod canaries and observability budgets."
    },
    {
      "dim": "regulatory",
      "thresh": 0.5,
      "text": "Data lineage & residency proofs by design; contract addenda ready."
    },
    {
      "dim": "supply",
      "thresh": 0.5,
      "text": "Build inventory buffers for chokepoints; logistics scenario drills."
    },
    {
      "dim": "cost",
      "thresh": 0.5,
      "text": "Index contracts to input prices; adopt rolling hedges."
    },
    {
      "dim": "schedule",
      "thresh": 0.5,
      "text": "Flexible staffing pool; shift left acceptance criteria."
    },
    {
      "dim": "talent",
      "thresh": 0.5,
      "text": "Create internal guilds; succession for critical roles."
    },
    {
      "dim": "quality",
      "thresh": 0.5,
      "text": "Quality gates on vendor deliverables; SLO‑linked penalties."
    }
  ]
};
  if(typeof module!=="undefined"&&module.exports)module.exports=data;else root.LoomData=data;
})(typeof globalThis!=="undefined"?globalThis:this);
