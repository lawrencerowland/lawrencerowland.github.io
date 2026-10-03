/* Formal Concept Analysis over a finite binary context. Source: the retained example's NextClosure algorithm. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ScenarioLattice=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
    const PROJECT = {
      title: "Distribution-centre go-live — 6 scenarios, 5 control tags, 5 evidence tags",
      controlPrefix: "control:",
      evidencePrefix: "evidence:",
      objects: [
        "risk-001",
        "risk-002",
        "risk-003",
        "risk-004",
        "risk-005",
        "risk-006"
      ],
      attributes: [
        // Barriers (controls)
        "control:traffic_separation_plan",
        "control:competency_training_signoff",
        "control:lockout_tagout",
        "control:preventive_maintenance_program",
        "control:vendor_chemical_audit",

        // Evidence record tags
        "evidence:floorwalk_checklist_2026_01_15",
        "evidence:training_roster_Q1_2026",
        "evidence:pm_workorder_log_2026_01",
        "evidence:vendor_audit_report_2026_01_09",
        "evidence:near_miss_ticket_1234"
      ],

      // Human-friendly descriptions (what directors care about)
      riskMeta: {
        "risk-001": {
          title: "Forklift–pedestrian collision at cross‑dock",
          chain: "Mixed traffic + blind corners → near‑misses → collision",
          impact: "Serious injury, stop‑work, schedule slip"
        },
        "risk-002": {
          title: "Conveyor jam overheats → smoke/fire",
          chain: "Dust + jam sensors failing → overheating → ignition",
          impact: "Fire alarm, downtime, asset damage"
        },
        "risk-003": {
          title: "Maintenance begins work without full energy isolation",
          chain: "Schedule pressure + ambiguous isolation points → LOTO bypass → exposure",
          impact: "Severe injury, regulatory incident"
        },
        "risk-004": {
          title: "Vendor chemical storage spill/exposure",
          chain: "Incompatible chemicals + poor labeling → spill → fumes/exposure",
          impact: "Injury, cleanup, environmental reporting"
        },
        "risk-005": {
          title: "Near‑miss tickets exist but no corrective barrier is implemented",
          chain: "Signals captured → no owner/action → repeat incidents",
          impact: "Learning loop broken; same incident recurs"
        },
        "risk-006": {
          title: "Mezzanine load limit not assessed/recorded",
          chain: "Design data missing → overload risk → structural failure",
          impact: "Catastrophic risk; immediate stop‑work if discovered late"
        }
      },

      attrMeta: {
        // Controls
        "control:traffic_separation_plan": {
          short: "Traffic separation plan",
          kind: "control",
          desc: "Physical separation + signage: walkways, bollards, one‑way aisles, crossings."
        },
        "control:competency_training_signoff": {
          short: "Competency training & sign‑off",
          kind: "control",
          desc: "Role‑based training + sign‑off for operators/maintainers; refreshers for new hires."
        },
        "control:lockout_tagout": {
          short: "Lockout/Tagout (LOTO)",
          kind: "control",
          desc: "Energy isolation + zero‑energy verification before clearing jams or maintenance."
        },
        "control:preventive_maintenance_program": {
          short: "Preventive maintenance program",
          kind: "control",
          desc: "Scheduled PM for conveyors: sensors, guarding, lubrication, dust removal."
        },
        "control:vendor_chemical_audit": {
          short: "Vendor chemical audit",
          kind: "control",
          desc: "Audit storage, labeling, SDS access, incompatibilities; corrective actions tracked."
        },

        // Evidence
        "evidence:floorwalk_checklist_2026_01_15": {
          short: "Floor‑walk checklist (Jan 15)",
          kind: "evidence",
          desc: "Supervisor walkthrough verifying pedestrian routes, barriers, and signage."
        },
        "evidence:training_roster_Q1_2026": {
          short: "Training roster (Q1 2026)",
          kind: "evidence",
          desc: "Export of completed training sign‑offs for operators/maintainers."
        },
        "evidence:pm_workorder_log_2026_01": {
          short: "PM work orders (Jan 2026)",
          kind: "evidence",
          desc: "CMMS log showing PM tasks closed for conveyors."
        },
        "evidence:vendor_audit_report_2026_01_09": {
          short: "Vendor audit report (Jan 9)",
          kind: "evidence",
          desc: "Audit report + corrective actions for chemical storage."
        },
        "evidence:near_miss_ticket_1234": {
          short: "Near‑miss ticket #1234",
          kind: "evidence",
          desc: "Ticket exists (signal), but not linked to an owned barrier/action."
        }
      },

      // relation: scenario -> list(attributes present)
      relation: {
        "risk-001": [
          "control:traffic_separation_plan",
          "control:competency_training_signoff",
          "evidence:floorwalk_checklist_2026_01_15",
          "evidence:training_roster_Q1_2026"
        ],
        "risk-002": [
          "control:preventive_maintenance_program",
          "control:competency_training_signoff",
          "evidence:pm_workorder_log_2026_01",
          "evidence:training_roster_Q1_2026"
        ],
        "risk-003": [
          "control:lockout_tagout",
          "control:competency_training_signoff",
          "evidence:training_roster_Q1_2026"
        ],
        "risk-004": [
          "control:vendor_chemical_audit",
          "control:competency_training_signoff",
          "evidence:vendor_audit_report_2026_01_09",
          "evidence:training_roster_Q1_2026"
        ],
        "risk-005": [
          "evidence:near_miss_ticket_1234"
        ],
        "risk-006": []
      }
    };


function create(PROJECT){
 if(!PROJECT||!Array.isArray(PROJECT.objects)||!Array.isArray(PROJECT.attributes)||!PROJECT.relation)throw new Error('A context needs objects, attributes and a relation.');
 if(PROJECT.objects.length>100||PROJECT.attributes.length>12)throw new Error('This bounded explorer accepts at most 100 objects and 12 attributes.');
 for(const list of [PROJECT.objects,PROJECT.attributes]){
  if(list.some(x=>typeof x!=='string'||!x.trim())||new Set(list).size!==list.length)throw new Error('Context identities must be non-empty distinct strings.');
 }
 for(const key of Object.keys(PROJECT.relation))if(!PROJECT.objects.includes(key))throw new Error('Unknown scenario in relation: '+key);
 for(const o of PROJECT.objects){
  const row=Object.hasOwn(PROJECT.relation,o)?PROJECT.relation[o]:[];
  if(!Array.isArray(row)||row.some(x=>!PROJECT.attributes.includes(x))||new Set(row).size!==row.length)throw new Error('Invalid or repeated attribute in scenario '+o);
 }
    const Objects = PROJECT.objects.slice();
    const Attrs = PROJECT.attributes.slice();

    const Rel = Object.create(null);
    for(const o of Objects){
      Rel[o] = new Set(Object.hasOwn(PROJECT.relation,o)?PROJECT.relation[o]:[]);
    }

    function prime_attr(B){
      // B' = objects having all attributes in B
      const res = [];
      outer: for(const o of Objects){
        const set = Rel[o];
        for(const a of B){
          if(!set.has(a)) continue outer;
        }
        res.push(o);
      }
      return new Set(res);
    }

    function prime_obj(X){
      // X' = attributes common to all objects in X
      // FCA convention: empty extent -> all attributes
      if(X.size === 0) return new Set(Attrs);
      const common = new Set(Attrs);
      for(const o of X){
        const set = Rel[o];
        for(const a of Array.from(common)){
          if(!set.has(a)) common.delete(a);
        }
      }
      return common;
    }

    function closure(B){
      return prime_obj(prime_attr(B));
    }

    function setEq(A,B){
      if(A.size !== B.size) return false;
      for(const x of A) if(!B.has(x)) return false;
      return true;
    }
    function setIntersect(A,B){
      const r = new Set();
      for(const x of A) if(B.has(x)) r.add(x);
      return r;
    }
    function setUnion(A,B){
      const r = new Set(A);
      for(const x of B) r.add(x);
      return r;
    }

    function nextClosure(B){
      // Ganter's NextClosure (lectic order over Attrs)
      const Bset = new Set(B);
      for(let i = Attrs.length - 1; i >= 0; i--){
        const ai = Attrs[i];
        if(!Bset.has(ai)){
          const prefix = new Set(Attrs.slice(0,i));
          const candidate = closure(setUnion(setIntersect(Bset, prefix), new Set([ai])));
          if(setEq(setIntersect(candidate, prefix), setIntersect(Bset, prefix))){
            return candidate;
          }
        }
      }
      return null;
    }

    function allIntents(){
      const intents = [];
      let B = closure(new Set()); // top intent (common attrs)
      intents.push(B);
      while(true){
        const Bn = nextClosure(B);
        if(!Bn) break;
        intents.push(Bn);
        B = Bn;
      }
      return intents;
    }

    const intents = allIntents();
    if(intents.length>256)throw new Error('This explorer supports at most 256 concepts; reduce the attribute context.');

    // Build concepts: each intent -> extent
    const concepts = intents.map((intent, idx) => {
      const extent = prime_attr(intent);
      const intentArr = Array.from(intent).sort();
      const extentArr = Array.from(extent).sort();

      const barrierCount = intentArr.filter(a => a.startsWith((PROJECT.controlPrefix || 'control:'))).length;
      const proofCount = intentArr.filter(a => a.startsWith((PROJECT.evidencePrefix || 'evidence:'))).length;

      // Node label: keep it director-friendly and compact
      const label = `${extentArr.length} scenario(s)\nbarriers: ${barrierCount}\nevidence: ${proofCount}`;

      return {
        id: "c" + idx,
        extent: extentArr,
        intent: intentArr,
        stats: {
          scenarioCount: extentArr.length,
          barrierCount,
          proofCount,
          intentSize: intentArr.length
        },
        label
      };
    });

    function hasseEdges(concepts){
      // Cover relation using extent inclusion (directed from larger extent -> smaller extent)
      const ext = concepts.map(c => new Set(c.extent));
      const edges = [];
      const n = concepts.length;

      function isProperSup(A,B){
        if(A.size <= B.size) return false;
        for(const x of B) if(!A.has(x)) return false;
        return true;
      }

      for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
          if(i===j) continue;
          if(isProperSup(ext[i], ext[j])){
            let between = false;
            for(let k=0;k<n;k++){
              if(k===i || k===j) continue;
              if(isProperSup(ext[i], ext[k]) && isProperSup(ext[k], ext[j])){
                between = true;
                break;
              }
            }
            if(!between){
              edges.push({ id: "e"+edges.length, source: concepts[i].id, target: concepts[j].id });
            }
          }
        }
      }
      return edges;
    }

    const edges = hasseEdges(concepts);

    // Root concept = max extent size
    const maxExtent = Math.max(...concepts.map(c => c.extent.length));
    const rootId = (concepts.find(c => c.extent.length === maxExtent) || concepts[0]).id;

    function computeGaps(){
      const noBarrier = [];
      const empty = [];
      for(const o of Objects){
        const attrs = Array.from(Rel[o]);
        const hasAny = attrs.length > 0;
        const hasBarrier = attrs.some(a => a.startsWith((PROJECT.controlPrefix || 'control:')));
        if(!hasAny) empty.push(o);
        if(!hasBarrier) noBarrier.push(o);
      }
      return {noBarrier, empty};
    }

    function mostSpecificConceptForRisk(riskId){
      const candidates = concepts.filter(c => c.extent.includes(riskId));
      if(candidates.length === 0) return null;
      candidates.sort((a,b) => {
        // prefer larger intent; tie-break: smaller extent
        if(b.intent.length !== a.intent.length) return b.intent.length - a.intent.length;
        return a.extent.length - b.extent.length;
      });
      return candidates[0].id;
    }


 function hierarchyPositions(){
  const ranks=new Map();
  for(const c of [...concepts].sort((a,b)=>b.extent.length-a.extent.length)){
   const parents=edges.filter(e=>e.target===c.id).map(e=>ranks.get(e.source));
   ranks.set(c.id,parents.length?1+Math.max(...parents):0);
  }
  const result={};
  for(const rank of new Set(ranks.values())){
   const row=concepts.filter(c=>ranks.get(c.id)===rank);
   row.forEach((c,i)=>{result[c.id]={x:(i-(row.length-1)/2)*145,y:rank*130};});
  }
  return result;
 }
 return {hierarchyPositions,objects:Objects,attributes:Attrs,relation:Rel,primeAttr:prime_attr,primeObj:prime_obj,closure,concepts,edges,rootId,gaps:computeGaps,conceptForRisk:mostSpecificConceptForRisk};
}
return {project:PROJECT,create};
});
