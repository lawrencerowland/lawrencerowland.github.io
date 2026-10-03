/* Demonstration inputs preserved from the original rehearsal board. */
(function(root){
const initialState = {
      parties: [
        {name:"ONR", role:"Safety regulator", mandatory:true, threshold:.56, reputation:.62, baseReputation:.60, concessionCost:.055, alpha:5.2, beta:1.25, network:.90, weights:[.52,.20,.08,.20]},
        {name:"EA", role:"Environmental regulator", mandatory:true, threshold:.55, reputation:.59, baseReputation:.56, concessionCost:.050, alpha:5.0, beta:1.18, network:.88, weights:[.34,.18,.08,.40]},
        {name:"NDA", role:"Funding authority", mandatory:false, threshold:.51, reputation:.54, baseReputation:.51, concessionCost:.065, alpha:4.0, beta:1.00, network:.65, weights:[.24,.24,.38,.14]},
        {name:"Operator", role:"Site operator", mandatory:false, threshold:.52, reputation:.53, baseReputation:.50, concessionCost:.070, alpha:4.2, beta:.95, network:.60, weights:[.24,.36,.26,.14]},
        {name:"Contractor", role:"Delivery partner", mandatory:false, threshold:.50, reputation:.50, baseReputation:.49, concessionCost:.075, alpha:3.8, beta:.85, network:.48, weights:[.20,.34,.36,.10]},
        {name:"Local Councils", role:"Local consent", mandatory:false, threshold:.53, reputation:.51, baseReputation:.49, concessionCost:.030, alpha:4.1, beta:1.05, network:.70, weights:[.20,.08,.10,.62]},
        {name:"Insurers", role:"Risk capital", mandatory:false, threshold:.52, reputation:.50, baseReputation:.50, concessionCost:.070, alpha:3.9, beta:.90, network:.55, weights:[.40,.10,.36,.14]}
      ],
      influence: [
        [0,.30,.24,.22,.16,.18,.28],
        [.32,0,.20,.18,.12,.32,.18],
        [.25,.18,0,.30,.20,.12,.16],
        [.22,.16,.32,0,.34,.15,.22],
        [.14,.10,.20,.35,0,.10,.26],
        [.18,.34,.12,.16,.10,0,.12],
        [.30,.18,.16,.24,.28,.12,0]
      ],
      levers: [
        {id:"inspection", label:"Raise inspection cadence", owner:"ONR", family:"Assurance", effect:[.08,-.025,-.030,.030], cost:{Operator:.030, Contractor:.040, NDA:.012}, contract:"Assurance sprint with sample-based inspections, fixed evidence packs, and a no-surprise escalation route.", explanation:"Buys safety credibility, but creates delivery friction if not paired with clearer guidance."},
        {id:"guideline", label:"Issue guideline clarity", owner:"EA", family:"Regulatory clarity", effect:[.045,.045,-.008,.040], cost:{EA:.015, Operator:.010, Contractor:.012}, contract:"Joint interpretation note with decision logs, named owners, and acceptance criteria for recurring evidence.", explanation:"Reduces ambiguity and makes later concessions cheaper to trust."},
        {id:"buffer", label:"Add schedule buffer", owner:"Operator", family:"Delivery pacing", effect:[.020,.095,-.045,.018], cost:{Operator:.040, NDA:.025}, contract:"Gateway buffer with explicit burn-down rules and protection against informal acceleration pressure.", explanation:"Protects credibility by admitting uncertainty before it becomes a surprise."},
        {id:"incentive", label:"Contractor incentive", owner:"Contractor", family:"Commercial alignment", effect:[.018,.070,.060,.012], cost:{Contractor:.050, NDA:.020}, contract:"Balanced incentive with safety hold-points, gain-share, and no reward for unresolved assurance debt.", explanation:"Speeds delivery only if the assurance rules stop the incentive becoming a risk transfer trick."},
        {id:"community", label:"Community package", owner:"Local Councils", family:"Consent", effect:[.018,.020,-.020,.110], cost:{Operator:.018, NDA:.025}, contract:"Community benefit package with transparent governance, local works commitments, and reporting cadence.", explanation:"Turns public sentiment from a late objection into a negotiated obligation."},
        {id:"costRecovery", label:"Cost-recovery and capacity rights", owner:"NDA", family:"Funding", effect:[.025,.055,.115,.018], cost:{NDA:.060, Operator:.020}, contract:"Cost-recovery collar, release gates, and capacity rights linked to verified readiness.", explanation:"Makes funding authority comfortable that value and obligations move together."},
        {id:"riskCap", label:"Risk-transfer cap", owner:"Insurers", family:"Liability", effect:[.075,.020,-.015,.030], cost:{Insurers:.050, Contractor:.018}, contract:"Liability cap with evidence escrow, insurance triggers, and reserved rights for exceptional conduct.", explanation:"Converts abstract fear into priced obligations and clearer insurability."},
        {id:"infoProtocol", label:"Information-sharing protocol", owner:"Operator", family:"Transparency", effect:[.050,.040,.020,.055], cost:{Operator:.025, Contractor:.010}, contract:"Shared dashboard, issue taxonomy, and response clocks for regulators and delivery parties.", explanation:"The cheapest trust builder: fewer surprises, faster diagnosis, clearer accountability."}
      ],
      synergies: {
        "guideline+inspection":[.040,.030,.010,.020],
        "buffer+infoProtocol":[.020,.060,.025,.020],
        "incentive+riskCap":[.045,.040,.030,.010],
        "community+guideline":[.012,.015,.000,.060],
        "costRecovery+infoProtocol":[.015,.035,.065,.010],
        "inspection+riskCap":[.055,.010,.000,.012]
      },
      synergyNotes: {
        "guideline+inspection":"Guidance turns inspection from extra friction into a clear route to acceptance.",
        "buffer+infoProtocol":"A buffer only earns trust when everyone can see what is consuming it.",
        "incentive+riskCap":"Commercial acceleration works better when residual risk has a priced boundary.",
        "community+guideline":"Local benefits land better when the consenting logic is transparent.",
        "costRecovery+infoProtocol":"Funding release is easier when readiness evidence is shared rather than asserted.",
        "inspection+riskCap":"Assurance evidence makes the risk-transfer cap credible and insurable."
      },
      clauseLibrary: [
        {id:"assuranceProtocol", title:"Assurance protocol", owner:"ONR", trigger:"Safety case or regulator confidence is binding.", linkedLevers:["inspection","guideline"], constraints:["safety"], primary:"Time-boxed assurance sprint with fixed evidence packs, sample-based inspection cadence, named decision owners, and escalation for unresolved safety questions.", fallback:"Keep the cadence but narrow the evidence pack to the top residual hazards and agree a second-stage review for lower-tier issues.", redline:"Do not let acceleration incentives override hold-points or convert safety acceptance into a deemed approval."},
        {id:"environmentStatement", title:"Environmental Statement of Common Ground", owner:"EA", trigger:"Environmental permit or public confidence is the constraint.", linkedLevers:["guideline","community"], constraints:["environment","community"], primary:"Joint interpretation note covering monitoring triggers, information requirements, issue owners, and decision dates before the formal permit gate.", fallback:"Use interim agreed positions for low-dispute topics while reserving disputed thresholds for a named technical meeting.", redline:"Do not bury unresolved permit assumptions inside programme baseline or commercial schedules."},
        {id:"gatewayCostCollar", title:"Gateway cost-recovery collar", owner:"NDA", trigger:"Funding authority or cost certainty is binding.", linkedLevers:["costRecovery","infoProtocol"], constraints:["funding"], primary:"Cost collar with staged release gates, readiness evidence, change-control thresholds, and capacity rights linked to verified delivery states.", fallback:"Use a narrower collar on high-confidence work packages and reserve contingency release for independently evidenced changes.", redline:"Avoid broad pass-through recovery without matching obligations, audit rights, and stop/go gates."},
        {id:"incentiveGuardrail", title:"Incentive guardrail", owner:"Contractor", trigger:"Commercial acceleration is needed but assurance debt remains.", linkedLevers:["incentive","inspection"], constraints:["schedule","safety"], primary:"Gain-share only pays after safety hold-points, quality evidence, and interface obligations are complete; unresolved assurance debt reduces payment.", fallback:"Pay a smaller milestone incentive for evidence completeness rather than final schedule acceleration.", redline:"Do not reward early dates if they create latent regulatory, quality, or rework risk."},
        {id:"bufferBurn", title:"Buffer burn protocol", owner:"Operator", trigger:"Schedule confidence is binding.", linkedLevers:["buffer","infoProtocol"], constraints:["schedule"], primary:"Protected schedule buffer with burn-down rules, causes taxonomy, decision rights, and escalation when buffer is consumed by unresolved interfaces.", fallback:"Create a smaller protected buffer around regulatory and commissioning gates only.", redline:"Do not let informal acceleration pressure erase the buffer without an explicit change record."},
        {id:"riskTransferCap", title:"Risk-transfer cap", owner:"Insurers", trigger:"Insurance or liability remains unresolved.", linkedLevers:["riskCap","inspection"], constraints:["liability","safety"], primary:"Liability cap tied to evidence escrow, insurability triggers, reserved rights for exceptional conduct, and periodic risk re-pricing.", fallback:"Apply the cap to defined risk classes first, leaving novel or unquantified risks under reserved review.", redline:"Do not accept unlimited or undefined risk transfer that cannot be priced, insured, or governed."},
        {id:"communityBenefits", title:"Community benefits deed", owner:"Local Councils", trigger:"Community acceptance is weak or optional consent is fragile.", linkedLevers:["community","guideline"], constraints:["community","environment"], primary:"Benefit commitments with transparent governance, local works schedule, reporting rhythm, escalation route, and release conditions.", fallback:"Pilot a smaller benefits package tied to the first delivery gate and expand once reporting is trusted.", redline:"Do not use vague social value promises without owners, dates, and enforceable reporting."},
        {id:"informationProtocol", title:"Information-sharing protocol", owner:"Operator", trigger:"Parties are negotiating from different facts.", linkedLevers:["infoProtocol"], constraints:["safety","funding","schedule"], primary:"Shared dashboard, issue taxonomy, response clocks, evidence status, decision log, and named owners for every live regulatory or delivery issue.", fallback:"Start with the top ten cross-party issues and expand the dashboard once the rhythm is working.", redline:"Do not create a dashboard that becomes advocacy material rather than a shared record of evidence and decisions."}
      ],
      sequences: [
        {id:"silo123", label:"Silo 1 -> Silo 2 -> Silo 3", modifier:[.020,.035,.010,.010], surprise:.020},
        {id:"silo132", label:"Silo 1 -> Silo 3 -> Silo 2", modifier:[.040,-.010,-.005,.020], surprise:.050},
        {id:"silo213", label:"Silo 2 -> Silo 1 -> Silo 3", modifier:[.000,.050,.020,-.005], surprise:.030},
        {id:"silo321", label:"Silo 3 -> Silo 2 -> Silo 1", modifier:[-.030,-.040,.015,-.020], surprise:.090}
      ],
      scenario: {
        activeLevers:["inspection","guideline","buffer","infoProtocol"],
        selectedSequence:"silo123",
        epsilon:.08,
        platformEffect:.04,
        surprisePenalty:.035,
        mandatoryGate:true,
        topK:6
      },
      receipts:[]
    };


if(typeof module === "object" && module.exports) module.exports = initialState; else root.RehearsalData = initialState;
})(typeof globalThis !== "undefined" ? globalThis : this);
