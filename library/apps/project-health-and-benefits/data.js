/* Original toy data and decorative diagrams, preserved from Project-web-apps. */
(function(root){const data={
  "projects": [
    {
      "name": "Hydrogen Hub",
      "tag": "Phase 2",
      "capGap": 38,
      "matGap": 62,
      "perfGap": 25
    },
    {
      "name": "Grid Interconnect",
      "tag": "Design",
      "capGap": 70,
      "matGap": 20,
      "perfGap": 40
    },
    {
      "name": "Port Expansion",
      "tag": "Delivery",
      "capGap": 25,
      "matGap": 35,
      "perfGap": 75
    },
    {
      "name": "EV Corridors",
      "tag": "Pilot",
      "capGap": 55,
      "matGap": 55,
      "perfGap": 15
    },
    {
      "name": "Data Spine",
      "tag": "Build",
      "capGap": 15,
      "matGap": 80,
      "perfGap": 30
    },
    {
      "name": "Offshore Tie‑in",
      "tag": "Stage Gate",
      "capGap": 45,
      "matGap": 30,
      "perfGap": 60
    }
  ],
  "starterModel": {
    "scenarioName": "Baseline rehearsal",
    "activePreset": "baseline",
    "drivers": {
      "benefitVolatility": 0.42,
      "regulatoryPressure": 0.58,
      "evidenceConfidence": 0.62,
      "interfaceDrag": 0.36,
      "fundingTension": 0.44,
      "deliveryAcceleration": 0.34
    },
    "benefits": [
      {
        "id": "b1",
        "name": "Hazard reduction",
        "owner": "Safety case",
        "current": 0.68,
        "target": 0.78,
        "weights": {
          "benefitVolatility": 0.23,
          "regulatoryPressure": 0.3,
          "evidenceConfidence": 0.36,
          "interfaceDrag": 0.18,
          "fundingTension": 0.1,
          "deliveryAcceleration": 0.06
        }
      },
      {
        "id": "b2",
        "name": "Throughput reliability",
        "owner": "Operations",
        "current": 0.63,
        "target": 0.74,
        "weights": {
          "benefitVolatility": 0.34,
          "regulatoryPressure": 0.14,
          "evidenceConfidence": 0.2,
          "interfaceDrag": 0.35,
          "fundingTension": 0.18,
          "deliveryAcceleration": 0.16
        }
      },
      {
        "id": "b3",
        "name": "Regulatory confidence",
        "owner": "Assurance",
        "current": 0.59,
        "target": 0.76,
        "weights": {
          "benefitVolatility": 0.16,
          "regulatoryPressure": 0.38,
          "evidenceConfidence": 0.42,
          "interfaceDrag": 0.2,
          "fundingTension": 0.11,
          "deliveryAcceleration": 0.05
        }
      },
      {
        "id": "b4",
        "name": "Public value",
        "owner": "Community",
        "current": 0.55,
        "target": 0.7,
        "weights": {
          "benefitVolatility": 0.35,
          "regulatoryPressure": 0.2,
          "evidenceConfidence": 0.18,
          "interfaceDrag": 0.16,
          "fundingTension": 0.22,
          "deliveryAcceleration": 0.07
        }
      },
      {
        "id": "b5",
        "name": "Cost predictability",
        "owner": "Finance",
        "current": 0.61,
        "target": 0.75,
        "weights": {
          "benefitVolatility": 0.22,
          "regulatoryPressure": 0.14,
          "evidenceConfidence": 0.18,
          "interfaceDrag": 0.22,
          "fundingTension": 0.4,
          "deliveryAcceleration": 0.12
        }
      },
      {
        "id": "b6",
        "name": "Schedule resilience",
        "owner": "Controls",
        "current": 0.57,
        "target": 0.73,
        "weights": {
          "benefitVolatility": 0.18,
          "regulatoryPressure": 0.2,
          "evidenceConfidence": 0.16,
          "interfaceDrag": 0.34,
          "fundingTension": 0.18,
          "deliveryAcceleration": 0.38
        }
      }
    ],
    "parties": [
      {
        "id": "onr",
        "name": "ONR",
        "role": "Safety regulator",
        "mandatory": true,
        "threshold": 0.64,
        "base": 0.61,
        "sensitivity": {
          "regulatoryPressure": 0.2,
          "evidenceConfidence": 0.3,
          "benefitVolatility": 0.1
        },
        "x": 170,
        "y": 105
      },
      {
        "id": "ea",
        "name": "EA",
        "role": "Environmental regulator",
        "mandatory": true,
        "threshold": 0.61,
        "base": 0.58,
        "sensitivity": {
          "regulatoryPressure": 0.2,
          "evidenceConfidence": 0.24,
          "benefitVolatility": 0.14
        },
        "x": 385,
        "y": 125
      },
      {
        "id": "funder",
        "name": "Funding authority",
        "role": "Capital release",
        "mandatory": false,
        "threshold": 0.58,
        "base": 0.57,
        "sensitivity": {
          "fundingTension": 0.28,
          "evidenceConfidence": 0.16,
          "benefitVolatility": 0.18
        },
        "x": 500,
        "y": 285
      },
      {
        "id": "operator",
        "name": "Operator",
        "role": "Benefit owner",
        "mandatory": false,
        "threshold": 0.57,
        "base": 0.56,
        "sensitivity": {
          "interfaceDrag": 0.24,
          "deliveryAcceleration": 0.16,
          "benefitVolatility": 0.18
        },
        "x": 300,
        "y": 300
      },
      {
        "id": "contractor",
        "name": "Delivery partners",
        "role": "Execution",
        "mandatory": false,
        "threshold": 0.55,
        "base": 0.54,
        "sensitivity": {
          "interfaceDrag": 0.28,
          "deliveryAcceleration": 0.22,
          "fundingTension": 0.12
        },
        "x": 120,
        "y": 285
      },
      {
        "id": "community",
        "name": "Local stakeholders",
        "role": "Consent and legitimacy",
        "mandatory": false,
        "threshold": 0.58,
        "base": 0.53,
        "sensitivity": {
          "benefitVolatility": 0.24,
          "regulatoryPressure": 0.12,
          "evidenceConfidence": 0.12
        },
        "x": 300,
        "y": 470
      }
    ],
    "influence": [
      [
        "onr",
        "ea",
        0.55
      ],
      [
        "onr",
        "operator",
        0.44
      ],
      [
        "ea",
        "community",
        0.42
      ],
      [
        "operator",
        "contractor",
        0.56
      ],
      [
        "operator",
        "funder",
        0.36
      ],
      [
        "contractor",
        "funder",
        0.26
      ],
      [
        "community",
        "funder",
        0.32
      ],
      [
        "ea",
        "operator",
        0.25
      ]
    ],
    "levers": [
      {
        "id": "evidenceSprint",
        "label": "Joint evidence sprint",
        "owner": "ONR",
        "family": "assurance",
        "active": true,
        "delta": {
          "evidenceConfidence": 0.1,
          "regulatoryPressure": -0.06
        },
        "party": {
          "onr": 0.08,
          "ea": 0.06
        },
        "text": "Named evidence packs, sample checks, and decision owners before the next gate."
      },
      {
        "id": "benefitsDeed",
        "label": "Benefits deed",
        "owner": "Local stakeholders",
        "family": "benefits",
        "active": true,
        "delta": {
          "benefitVolatility": -0.07,
          "evidenceConfidence": 0.03
        },
        "party": {
          "community": 0.12,
          "funder": 0.04
        },
        "text": "Benefits expressed as governed obligations, not hopeful outcome prose."
      },
      {
        "id": "gateProtocol",
        "label": "Gate protocol",
        "owner": "Funding authority",
        "family": "governance",
        "active": true,
        "delta": {
          "regulatoryPressure": -0.05,
          "fundingTension": -0.05
        },
        "party": {
          "funder": 0.08,
          "onr": 0.04,
          "ea": 0.04
        },
        "text": "Stage release rules tied to decision evidence and open assumption burn-down."
      },
      {
        "id": "assuranceHoldpoints",
        "label": "Assurance hold-points",
        "owner": "ONR",
        "family": "safety",
        "active": false,
        "delta": {
          "evidenceConfidence": 0.07,
          "deliveryAcceleration": -0.05
        },
        "party": {
          "onr": 0.09,
          "operator": 0.03
        },
        "text": "Explicit hold-points protect safety acceptance from schedule compression."
      },
      {
        "id": "interfaceRoom",
        "label": "Interface control room",
        "owner": "Operator",
        "family": "interfaces",
        "active": true,
        "delta": {
          "interfaceDrag": -0.1,
          "deliveryAcceleration": 0.03
        },
        "party": {
          "operator": 0.08,
          "contractor": 0.07
        },
        "text": "Daily cross-party interface decisions with visible constraint ownership."
      },
      {
        "id": "fundingCollar",
        "label": "Funding collar",
        "owner": "Funding authority",
        "family": "commercial",
        "active": false,
        "delta": {
          "fundingTension": -0.1,
          "evidenceConfidence": 0.02
        },
        "party": {
          "funder": 0.12,
          "contractor": 0.03
        },
        "text": "Release gates, audit rights, and contingency calls tied to verified states."
      }
    ],
    "evidence": [
      {
        "id": "r1",
        "scenario": "Safety case assumption drift",
        "barrier": "Independent hazard close-out board",
        "proof": "Signed close-out register",
        "status": "covered",
        "owner": "ONR"
      },
      {
        "id": "r2",
        "scenario": "Benefits erode after permit changes",
        "barrier": "Benefits change-control threshold",
        "proof": "Draft threshold only",
        "status": "evidence-only",
        "owner": "Benefits lead"
      },
      {
        "id": "r3",
        "scenario": "Interface lateness shifts benefit date",
        "barrier": "Interface control room",
        "proof": "Decision log and ageing report",
        "status": "covered",
        "owner": "Operator"
      },
      {
        "id": "r4",
        "scenario": "Community objection delays gate",
        "barrier": "Benefits deed",
        "proof": "Stakeholder commitments register",
        "status": "covered",
        "owner": "Local stakeholders"
      },
      {
        "id": "r5",
        "scenario": "Funding release outruns assurance evidence",
        "barrier": "",
        "proof": "Portfolio finance pack",
        "status": "evidence-only",
        "owner": "Funding authority"
      },
      {
        "id": "r6",
        "scenario": "Supplier acceleration creates latent rework",
        "barrier": "Assurance hold-points",
        "proof": "",
        "status": "no-proof",
        "owner": "Delivery partners"
      },
      {
        "id": "r7",
        "scenario": "Environmental monitoring threshold disputed",
        "barrier": "",
        "proof": "",
        "status": "unassessed",
        "owner": "EA"
      }
    ],
    "interfaces": [
      {
        "id": "i1",
        "name": "Regulator to operator",
        "maturity": 0.61,
        "weight": 0.85,
        "x": 180,
        "y": 145
      },
      {
        "id": "i2",
        "name": "Operator to contractor",
        "maturity": 0.55,
        "weight": 0.78,
        "x": 425,
        "y": 160
      },
      {
        "id": "i3",
        "name": "Funder to programme",
        "maturity": 0.58,
        "weight": 0.65,
        "x": 480,
        "y": 360
      },
      {
        "id": "i4",
        "name": "Benefits to controls",
        "maturity": 0.52,
        "weight": 0.6,
        "x": 285,
        "y": 450
      },
      {
        "id": "i5",
        "name": "Community to consents",
        "maturity": 0.5,
        "weight": 0.48,
        "x": 105,
        "y": 350
      }
    ],
    "sourceLenses": [
      {
        "name": "Project_Health_Atlas",
        "role": "Front-door health atlas",
        "instantiation": "Benefit streams, gate families, and constraints as deforming tiles.",
        "url": "../Project_Health_Atlas.html"
      },
      {
        "name": "regulatory-negotiation-rehearsal-board",
        "role": "Consent rehearsal",
        "instantiation": "Levers, pivotal parties, constraint heatmap, clauses, receipts.",
        "url": "../regulatory-negotiation-rehearsal-board.html"
      },
      {
        "name": "governance-trio-replay-rules-lineage",
        "role": "Assurance memory",
        "instantiation": "Replay log, rule receipts, and lineage DAG for benefit claims.",
        "url": "../governance-trio-replay-rules-lineage.html"
      },
      {
        "name": "scenario_barrier_proof_fca_lattice",
        "role": "Barrier coverage",
        "instantiation": "Scenario x barrier x proof gap logic for benefit erosion.",
        "url": "https://lawrencerowland.github.io/library/apps/scenario-control-lattice/"
      },
      {
        "name": "portfolio_loom",
        "role": "Benefits sensitivity",
        "instantiation": "Scenario fibres and time-phased benefit resilience.",
        "url": "../portfolio_loom.html"
      },
      {
        "name": "counterfactual_programme_steering",
        "role": "Causal steering",
        "instantiation": "do-interventions for benefit, lead time, quality, and evidence.",
        "url": "../counterfactual_programme_steering.html"
      },
      {
        "name": "intent_field_navigator",
        "role": "Intent alignment",
        "instantiation": "CSV-first benefit intent, work item, and outcome coverage.",
        "url": "../intent_field_navigator.html"
      },
      {
        "name": "interface_maturity_simulator",
        "role": "Interface spillover",
        "instantiation": "Coupling and maturity propagation across programme interfaces.",
        "url": "../interface_maturity_simulator.html"
      }
    ]
  },
  "presets": {
    "baseline": {
      "label": "Baseline rehearsal",
      "drivers": {
        "benefitVolatility": 0.42,
        "regulatoryPressure": 0.58,
        "evidenceConfidence": 0.62,
        "interfaceDrag": 0.36,
        "fundingTension": 0.44,
        "deliveryAcceleration": 0.34
      }
    },
    "evidenceShock": {
      "label": "Evidence shock",
      "drivers": {
        "benefitVolatility": 0.5,
        "regulatoryPressure": 0.72,
        "evidenceConfidence": 0.42,
        "interfaceDrag": 0.46,
        "fundingTension": 0.52,
        "deliveryAcceleration": 0.36
      }
    },
    "benefitDrift": {
      "label": "Benefits drift",
      "drivers": {
        "benefitVolatility": 0.74,
        "regulatoryPressure": 0.54,
        "evidenceConfidence": 0.55,
        "interfaceDrag": 0.44,
        "fundingTension": 0.58,
        "deliveryAcceleration": 0.3
      }
    },
    "gateCompression": {
      "label": "Gate compression",
      "drivers": {
        "benefitVolatility": 0.5,
        "regulatoryPressure": 0.76,
        "evidenceConfidence": 0.56,
        "interfaceDrag": 0.6,
        "fundingTension": 0.5,
        "deliveryAcceleration": 0.7
      }
    },
    "communityChallenge": {
      "label": "Community challenge",
      "drivers": {
        "benefitVolatility": 0.68,
        "regulatoryPressure": 0.66,
        "evidenceConfidence": 0.52,
        "interfaceDrag": 0.42,
        "fundingTension": 0.48,
        "deliveryAcceleration": 0.31
      }
    }
  },
  "driverLabels": {
    "benefitVolatility": "Benefit volatility",
    "regulatoryPressure": "Regulatory pressure",
    "evidenceConfidence": "Evidence confidence",
    "interfaceDrag": "Interface drag",
    "fundingTension": "Funding tension",
    "deliveryAcceleration": "Delivery acceleration"
  },
  "diagrams": [
    "\n<svg viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n  <defs>\n    <marker id=\"arrow-0\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"3\" orient=\"auto\">\n      <path d=\"M0,0 L0,6 L7,3 z\" fill=\"#aab4c8\"/>\n    </marker>\n  </defs>\n  <g fill=\"none\" stroke=\"#aab4c8\" stroke-width=\"1.2\" marker-end=\"url(#arrow-0)\" opacity=\".9\">\n    <path d=\"M18,78 C38,70 58,50 80,40\"  /><path d=\"M24,36 C40,46 54,58 70,70\"  /><path d=\"M52,96 C64,78 78,62 96,58\" stroke=\"#e05263\" stroke-width=\"2.6\" />\n  </g>\n  <g>\n    <circle cx=\"18\" cy=\"78\" r=\"7\" fill=\"#6a7dff\" /><circle cx=\"24\" cy=\"36\" r=\"7\" fill=\"#6f7aa6\" /><circle cx=\"52\" cy=\"96\" r=\"7\" fill=\"#e05263\" /><circle cx=\"82\" cy=\"36\" r=\"7\" fill=\"#e0a400\" /><circle cx=\"96\" cy=\"58\" r=\"7\" fill=\"#8fbf9f\" />\n  </g>\n</svg>",
    "\n<svg viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n  <defs>\n    <marker id=\"arrow-1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"3\" orient=\"auto\">\n      <path d=\"M0,0 L0,6 L7,3 z\" fill=\"#aab4c8\"/>\n    </marker>\n  </defs>\n  <g fill=\"none\" stroke=\"#aab4c8\" stroke-width=\"1.2\" marker-end=\"url(#arrow-1)\" opacity=\".9\">\n    <path d=\"M16,88 C34,78 58,66 74,54\"  /><path d=\"M34,28 C48,36 58,52 70,66\" stroke=\"#e05263\" stroke-width=\"2.6\" /><path d=\"M44,70 C60,72 78,72 98,70\"  />\n  </g>\n  <g>\n    <circle cx=\"16\" cy=\"88\" r=\"7\" fill=\"#6a7dff\" /><circle cx=\"34\" cy=\"28\" r=\"7\" fill=\"#6f7aa6\" /><circle cx=\"44\" cy=\"70\" r=\"7\" fill=\"#e05263\" /><circle cx=\"82\" cy=\"24\" r=\"7\" fill=\"#e0a400\" /><circle cx=\"98\" cy=\"70\" r=\"7\" fill=\"#8fbf9f\" />\n  </g>\n</svg>",
    "\n<svg viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n  <defs>\n    <marker id=\"arrow-2\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"3\" orient=\"auto\">\n      <path d=\"M0,0 L0,6 L7,3 z\" fill=\"#aab4c8\"/>\n    </marker>\n  </defs>\n  <g fill=\"none\" stroke=\"#aab4c8\" stroke-width=\"1.2\" marker-end=\"url(#arrow-2)\" opacity=\".9\">\n    <path d=\"M18,38 C38,46 52,54 66,62\"  /><path d=\"M20,90 C40,86 64,80 84,72\" stroke=\"#e05263\" stroke-width=\"2.6\" /><path d=\"M60,96 C70,78 84,66 96,64\"  />\n  </g>\n  <g>\n    <circle cx=\"20\" cy=\"90\" r=\"7\" fill=\"#6a7dff\" /><circle cx=\"18\" cy=\"38\" r=\"7\" fill=\"#6f7aa6\" /><circle cx=\"60\" cy=\"96\" r=\"7\" fill=\"#e05263\" /><circle cx=\"90\" cy=\"34\" r=\"7\" fill=\"#e0a400\" /><circle cx=\"96\" cy=\"64\" r=\"7\" fill=\"#8fbf9f\" />\n  </g>\n</svg>",
    "\n<svg viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n  <defs>\n    <marker id=\"arrow-3\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"3\" orient=\"auto\">\n      <path d=\"M0,0 L0,6 L7,3 z\" fill=\"#aab4c8\"/>\n    </marker>\n  </defs>\n  <g fill=\"none\" stroke=\"#aab4c8\" stroke-width=\"1.2\" marker-end=\"url(#arrow-3)\" opacity=\".9\">\n    <path d=\"M26,30 C44,38 58,54 72,66\" stroke=\"#e05263\" stroke-width=\"2.6\" /><path d=\"M24,82 C44,78 58,70 76,60\"  /><path d=\"M66,92 C78,80 88,70 96,68\"  />\n  </g>\n  <g>\n    <circle cx=\"24\" cy=\"82\" r=\"7\" fill=\"#6a7dff\" /><circle cx=\"26\" cy=\"30\" r=\"7\" fill=\"#6f7aa6\" /><circle cx=\"66\" cy=\"92\" r=\"7\" fill=\"#e05263\" /><circle cx=\"90\" cy=\"46\" r=\"7\" fill=\"#e0a400\" /><circle cx=\"96\" cy=\"68\" r=\"7\" fill=\"#8fbf9f\" />\n  </g>\n</svg>",
    "\n<svg viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n  <defs>\n    <marker id=\"arrow-4\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"3\" orient=\"auto\">\n      <path d=\"M0,0 L0,6 L7,3 z\" fill=\"#aab4c8\"/>\n    </marker>\n  </defs>\n  <g fill=\"none\" stroke=\"#aab4c8\" stroke-width=\"1.2\" marker-end=\"url(#arrow-4)\" opacity=\".9\">\n    <path d=\"M16,74 C34,70 58,58 78,46\"  /><path d=\"M32,34 C48,42 60,56 72,66\"  /><path d=\"M46,96 C60,82 78,70 98,58\" stroke=\"#e05263\" stroke-width=\"2.6\" />\n  </g>\n  <g>\n    <circle cx=\"16\" cy=\"74\" r=\"7\" fill=\"#6a7dff\" /><circle cx=\"32\" cy=\"34\" r=\"7\" fill=\"#6f7aa6\" /><circle cx=\"46\" cy=\"96\" r=\"7\" fill=\"#e05263\" /><circle cx=\"88\" cy=\"30\" r=\"7\" fill=\"#e0a400\" /><circle cx=\"98\" cy=\"58\" r=\"7\" fill=\"#8fbf9f\" />\n  </g>\n</svg>",
    "\n<svg viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n  <defs>\n    <marker id=\"arrow-5\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"3\" orient=\"auto\">\n      <path d=\"M0,0 L0,6 L7,3 z\" fill=\"#aab4c8\"/>\n    </marker>\n  </defs>\n  <g fill=\"none\" stroke=\"#aab4c8\" stroke-width=\"1.2\" marker-end=\"url(#arrow-5)\" opacity=\".9\">\n    <path d=\"M20,32 C38,38 54,50 72,60\"  /><path d=\"M22,86 C42,80 64,72 86,64\" stroke=\"#e05263\" stroke-width=\"2.6\" /><path d=\"M54,90 C68,78 82,70 98,66\"  />\n  </g>\n  <g>\n    <circle cx=\"22\" cy=\"86\" r=\"7\" fill=\"#6a7dff\" /><circle cx=\"20\" cy=\"32\" r=\"7\" fill=\"#6f7aa6\" /><circle cx=\"54\" cy=\"90\" r=\"7\" fill=\"#e05263\" /><circle cx=\"84\" cy=\"28\" r=\"7\" fill=\"#e0a400\" /><circle cx=\"98\" cy=\"66\" r=\"7\" fill=\"#8fbf9f\" />\n  </g>\n</svg>"
  ]
};if(typeof module==='object'&&module.exports)module.exports=data;else root.HealthBenefitsData=data;})(typeof globalThis!=='undefined'?globalThis:this);
