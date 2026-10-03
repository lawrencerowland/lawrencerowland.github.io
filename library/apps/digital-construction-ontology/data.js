/* Public source-derived data; see README for provenance and corrections. */
(function(root){const data={
  "version": 1,
  "reviewed": "2026-10-03",
  "cases": {
    "modules": {
      "id": "modules",
      "title": "DiCon 0.5 module map",
      "summary": "Trace an ontology import from the importing module to its dependency. Compare those formal arrows with the suite’s editorial module and alignment catalogue.",
      "boundary": "A selected view of version 0.5, an ontology specification draft. Solid arrows are the nine direct owl:imports declarations in the ten downloaded module files. Dashed suite/alignment links are catalogue relationships, not OWL imports. Vocabularies and alignment modules themselves are outside this compact view.",
      "source": {
        "file": "dico_module_map_d3.html",
        "url": "https://github.com/lawrencerowland/Project-web-apps/blob/cd0528939fd0e1f5de1df7cda9930785349e4946/web_apps/dico_module_map_d3.html",
        "sha256": "56f386d262078cc5f292ec83680c1e1b5688f5271aa1ee7c823557337963de0a"
      },
      "nodes": [
        {
          "id": "DICO Suite",
          "type": "Suite",
          "label": "DiCon 0.5 suite",
          "url": "https://w3id.org/digitalconstruction/",
          "description": "Catalogue root for the selected version 0.5 modules and external alignments.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 20
        },
        {
          "id": "Contexts",
          "type": "Core module",
          "label": "Contexts",
          "prefix": "dicc:",
          "url": "https://digitalconstruction.github.io/Contexts/v/0.5/",
          "description": "Multi-context data: planned/actual, as-designed/as-built, LOD levels.",
          "sources": [
            "https://digitalconstruction.github.io/Contexts/v/0.5/contexts.ttl"
          ],
          "sourceHash": "8ac23ebd0dd69bf5299fe519a16f8962f4fb60907a3c30ac4cc1073caf29e300",
          "aliases": [],
          "rdfType": "http://www.w3.org/2002/07/owl#Ontology",
          "uri": "https://w3id.org/digitalconstruction/0.5/Contexts",
          "degree": 2
        },
        {
          "id": "Variables",
          "type": "Core module",
          "label": "Variables",
          "prefix": "dicv:",
          "url": "https://digitalconstruction.github.io/Variables/v/0.5/",
          "description": "Properties, changing values, constraints and value metadata.",
          "sources": [
            "https://digitalconstruction.github.io/Variables/v/0.5/variables.ttl"
          ],
          "sourceHash": "5183653542146e6c1c498f5d0ed093001b2678292b141ace28cef3d5bf6b7621",
          "aliases": [],
          "rdfType": "http://www.w3.org/2002/07/owl#Ontology",
          "uri": "https://w3id.org/digitalconstruction/0.5/Variables",
          "degree": 2
        },
        {
          "id": "Entities",
          "type": "Core module",
          "label": "Entities",
          "prefix": "dice:",
          "url": "https://digitalconstruction.github.io/Entities/v/0.5/",
          "description": "Identifiable entities with classifications, breakdowns and groupings.",
          "sources": [
            "https://digitalconstruction.github.io/Entities/v/0.5/entities.ttl"
          ],
          "sourceHash": "ab4b632fe24166027a2708960550fd0095e76f26049af885fb4b3fe6b36aedad",
          "aliases": [],
          "rdfType": "http://www.w3.org/2002/07/owl#Ontology",
          "uri": "https://w3id.org/digitalconstruction/0.5/Entities",
          "degree": 5
        },
        {
          "id": "Processes",
          "type": "Core module",
          "label": "Processes",
          "prefix": "dicp:",
          "url": "https://digitalconstruction.github.io/Processes/v/0.5/",
          "description": "Activities, capabilities, constraints and variables.",
          "sources": [
            "https://digitalconstruction.github.io/Processes/v/0.5/processes.ttl"
          ],
          "sourceHash": "6f9571b327eafc990090601d28b6c92b91a71991d98629b3f2d084cb7a575b06",
          "aliases": [],
          "rdfType": "http://www.w3.org/2002/07/owl#Ontology",
          "uri": "https://w3id.org/digitalconstruction/0.5/Processes",
          "degree": 3
        },
        {
          "id": "Agents",
          "type": "Core module",
          "label": "Agents",
          "prefix": "dica:",
          "url": "https://digitalconstruction.github.io/Agents/v/0.5/",
          "description": "Actors & stakeholders, and their relations and contracts.",
          "sources": [
            "https://digitalconstruction.github.io/Agents/v/0.5/agents.ttl"
          ],
          "sourceHash": "70c12bef50a2ab6c19fc5dbc9a42b9a674a7e3157b24aec27f9605890bd08394",
          "aliases": [],
          "rdfType": "http://www.w3.org/2002/07/owl#Ontology",
          "uri": "https://w3id.org/digitalconstruction/0.5/Agents",
          "degree": 4
        },
        {
          "id": "Information",
          "type": "Core module",
          "label": "Information",
          "prefix": "dici:",
          "url": "https://digitalconstruction.github.io/Information/v/0.5/",
          "description": "Information content entities including designs, plans, events, and issues.",
          "sources": [
            "https://digitalconstruction.github.io/Information/v/0.5/information.ttl"
          ],
          "sourceHash": "748393013b29bb835bd0a37ef094bf62f35057134c5291e8733c045453e639c6",
          "aliases": [],
          "rdfType": "http://www.w3.org/2002/07/owl#Ontology",
          "uri": "https://w3id.org/digitalconstruction/0.5/Information",
          "degree": 4
        },
        {
          "id": "Materials",
          "type": "Extension module",
          "label": "Materials",
          "prefix": "dicbm:",
          "url": "https://digitalconstruction.github.io/Materials/v/0.5/",
          "description": "Building materials.",
          "sources": [
            "https://digitalconstruction.github.io/Materials/v/0.5/materials.ttl"
          ],
          "sourceHash": "019bab393ae602e7e7849adbcba89ace4a5e829a3b40c64e64b8998a03977267",
          "aliases": [
            "BuildingMaterials"
          ],
          "rdfType": "http://www.w3.org/2002/07/owl#Ontology",
          "uri": "https://w3id.org/digitalconstruction/0.5/Materials",
          "degree": 2
        },
        {
          "id": "Occupancy",
          "type": "Extension module",
          "label": "Occupancy",
          "prefix": "dicob:",
          "url": "https://digitalconstruction.github.io/Occupancy/v/0.5/",
          "description": "Occupant behaviour, comfort, safety and health, including indoor air quality and building acoustics.",
          "sources": [
            "https://digitalconstruction.github.io/Occupancy/v/0.5/occupancy.ttl"
          ],
          "sourceHash": "fa7e971b71a89054168ba03007537936d5d872ab05c8c104bed4832ed0585bb4",
          "aliases": [
            "OccupantBehavior",
            "IndoorAirQuality",
            "BuildingAcoustics"
          ],
          "rdfType": "http://www.w3.org/2002/07/owl#Ontology",
          "uri": "https://w3id.org/digitalconstruction/0.5/Occupancy",
          "degree": 2
        },
        {
          "id": "Lifecycle",
          "type": "Extension module",
          "label": "Lifecycle",
          "prefix": "dicl:",
          "url": "https://digitalconstruction.github.io/Lifecycle/v/0.5/",
          "description": "Evolution of information over construction lifecycle and refinement through LOD levels.",
          "sources": [
            "https://digitalconstruction.github.io/Lifecycle/v/0.5/lifecycle.ttl"
          ],
          "sourceHash": "4049e5491501ebda2bdd2d56219ac7398fa8525d102299faddffcdcc8f2d2379",
          "aliases": [],
          "rdfType": "http://www.w3.org/2002/07/owl#Ontology",
          "uri": "https://w3id.org/digitalconstruction/0.5/Lifecycle",
          "degree": 2
        },
        {
          "id": "Energy",
          "type": "Extension module",
          "label": "Energy",
          "prefix": "dices:",
          "url": "https://digitalconstruction.github.io/Energy/v/0.5/",
          "description": "Energy systems of buildings.",
          "sources": [
            "https://digitalconstruction.github.io/Energy/v/0.5/energy.ttl"
          ],
          "sourceHash": "75e29fa2d63a59fa3d66945d3f237a48166b5491fedd455e1383220346916398",
          "aliases": [
            "EnergySystems"
          ],
          "rdfType": "http://www.w3.org/2002/07/owl#Ontology",
          "uri": "https://w3id.org/digitalconstruction/0.5/Energy",
          "degree": 2
        },
        {
          "id": "BFO",
          "type": "External vocabulary",
          "label": "BFO",
          "url": "https://basic-formal-ontology.org/",
          "description": "Basic Formal Ontology (top-level categories). The suite catalogue lists a separate BFO alignment; this is not a direct import from the suite root.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 1
        },
        {
          "id": "ifcOWL",
          "type": "External vocabulary",
          "label": "ifcOWL",
          "url": "https://standards.buildingsmart.org/IFC/DEV/IFC4/ADD2_TC1/OWL",
          "description": "IFC ontology for BIM models. The suite catalogue lists a separate IFC alignment; this is not a direct import from the suite root.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 1
        },
        {
          "id": "OWL-Time",
          "type": "External vocabulary",
          "label": "OWL-Time",
          "url": "https://www.w3.org/2006/time",
          "description": "W3C Time Ontology (time instants & intervals). The suite catalogue lists a separate OWLTime alignment; this is not a direct import from the suite root.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 1
        },
        {
          "id": "PROV-O",
          "type": "External vocabulary",
          "label": "PROV-O",
          "url": "https://www.w3.org/TR/prov-o/",
          "description": "W3C Provenance Ontology. The suite catalogue lists a separate PROV alignment; this is not a direct import from the suite root.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 1
        },
        {
          "id": "FOAF",
          "type": "External vocabulary",
          "label": "FOAF",
          "url": "http://xmlns.com/foaf/0.1/",
          "description": "Friend of a Friend vocabulary. The suite catalogue lists a separate FOAF alignment; this is not a direct import from the suite root.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 1
        },
        {
          "id": "QUDT",
          "type": "External vocabulary",
          "label": "QUDT",
          "url": "http://qudt.org/2.1/schema/qudt",
          "description": "Quantities, Units, Dimensions and Types. The suite catalogue lists a separate QUDT alignment; this is not a direct import from the suite root.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 1
        },
        {
          "id": "SSN",
          "type": "External vocabulary",
          "label": "SSN",
          "url": "http://www.w3.org/ns/ssn/",
          "description": "Semantic Sensor Network Ontology. The suite catalogue lists a separate SSN alignment; this is not a direct import from the suite root.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 1
        },
        {
          "id": "SOSA",
          "type": "External vocabulary",
          "label": "SOSA",
          "url": "http://www.w3.org/ns/sosa/",
          "description": "Sensor, Observation, Sample and Actuator. The suite catalogue lists a separate SSN alignment; this is not a direct import from the suite root.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 1
        },
        {
          "id": "SAREF",
          "type": "External vocabulary",
          "label": "SAREF",
          "url": "https://saref.etsi.org/core/",
          "description": "Smart Appliances REFerence ontology (ETSI). The suite catalogue lists a separate Saref alignment; this is not a direct import from the suite root.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 1
        },
        {
          "id": "ORG",
          "type": "External vocabulary",
          "label": "ORG",
          "url": "https://www.w3.org/TR/vocab-org/",
          "description": "W3C Organization Ontology (org:). The suite catalogue lists a separate Org alignment; this is not a direct import from the suite root.",
          "sources": [
            "https://digitalconstruction.github.io/v/0.5/"
          ],
          "degree": 1
        }
      ],
      "links": [
        {
          "source": "DICO Suite",
          "target": "Contexts",
          "label": "catalogue includes",
          "kind": "catalogue",
          "rationale": "Editorial suite membership from the version 0.5 catalogue.",
          "evidence": "https://digitalconstruction.github.io/v/0.5/",
          "id": "modules-edge-1"
        },
        {
          "source": "DICO Suite",
          "target": "Variables",
          "label": "catalogue includes",
          "kind": "catalogue",
          "rationale": "Editorial suite membership from the version 0.5 catalogue.",
          "evidence": "https://digitalconstruction.github.io/v/0.5/",
          "id": "modules-edge-2"
        },
        {
          "source": "DICO Suite",
          "target": "Entities",
          "label": "catalogue includes",
          "kind": "catalogue",
          "rationale": "Editorial suite membership from the version 0.5 catalogue.",
          "evidence": "https://digitalconstruction.github.io/v/0.5/",
          "id": "modules-edge-3"
        },
        {
          "source": "Entities",
          "target": "Variables",
          "label": "owl:imports",
          "kind": "import",
          "predicate": "http://www.w3.org/2002/07/owl#imports",
          "rationale": "Direct owl:imports statement in the saved version 0.5 Turtle file.",
          "evidence": "https://digitalconstruction.github.io/Entities/v/0.5/entities.ttl",
          "id": "modules-edge-4"
        },
        {
          "source": "Entities",
          "target": "Contexts",
          "label": "owl:imports",
          "kind": "import",
          "predicate": "http://www.w3.org/2002/07/owl#imports",
          "rationale": "Direct owl:imports statement in the saved version 0.5 Turtle file.",
          "evidence": "https://digitalconstruction.github.io/Entities/v/0.5/entities.ttl",
          "id": "modules-edge-5"
        },
        {
          "source": "DICO Suite",
          "target": "Processes",
          "label": "catalogue includes",
          "kind": "catalogue",
          "rationale": "Editorial suite membership from the version 0.5 catalogue.",
          "evidence": "https://digitalconstruction.github.io/v/0.5/",
          "id": "modules-edge-6"
        },
        {
          "source": "Processes",
          "target": "Entities",
          "label": "owl:imports",
          "kind": "import",
          "predicate": "http://www.w3.org/2002/07/owl#imports",
          "rationale": "Direct owl:imports statement in the saved version 0.5 Turtle file.",
          "evidence": "https://digitalconstruction.github.io/Processes/v/0.5/processes.ttl",
          "id": "modules-edge-7"
        },
        {
          "source": "DICO Suite",
          "target": "Agents",
          "label": "catalogue includes",
          "kind": "catalogue",
          "rationale": "Editorial suite membership from the version 0.5 catalogue.",
          "evidence": "https://digitalconstruction.github.io/v/0.5/",
          "id": "modules-edge-8"
        },
        {
          "source": "Agents",
          "target": "Processes",
          "label": "owl:imports",
          "kind": "import",
          "predicate": "http://www.w3.org/2002/07/owl#imports",
          "rationale": "Direct owl:imports statement in the saved version 0.5 Turtle file.",
          "evidence": "https://digitalconstruction.github.io/Agents/v/0.5/agents.ttl",
          "id": "modules-edge-9"
        },
        {
          "source": "DICO Suite",
          "target": "Information",
          "label": "catalogue includes",
          "kind": "catalogue",
          "rationale": "Editorial suite membership from the version 0.5 catalogue.",
          "evidence": "https://digitalconstruction.github.io/v/0.5/",
          "id": "modules-edge-10"
        },
        {
          "source": "Information",
          "target": "Agents",
          "label": "owl:imports",
          "kind": "import",
          "predicate": "http://www.w3.org/2002/07/owl#imports",
          "rationale": "Direct owl:imports statement in the saved version 0.5 Turtle file.",
          "evidence": "https://digitalconstruction.github.io/Information/v/0.5/information.ttl",
          "id": "modules-edge-11"
        },
        {
          "source": "DICO Suite",
          "target": "Materials",
          "label": "catalogue includes",
          "kind": "catalogue",
          "rationale": "Editorial suite membership from the version 0.5 catalogue.",
          "evidence": "https://digitalconstruction.github.io/v/0.5/",
          "id": "modules-edge-12"
        },
        {
          "source": "Materials",
          "target": "Entities",
          "label": "owl:imports",
          "kind": "import",
          "predicate": "http://www.w3.org/2002/07/owl#imports",
          "rationale": "Direct owl:imports statement in the saved version 0.5 Turtle file.",
          "evidence": "https://digitalconstruction.github.io/Materials/v/0.5/materials.ttl",
          "id": "modules-edge-13"
        },
        {
          "source": "DICO Suite",
          "target": "Occupancy",
          "label": "catalogue includes",
          "kind": "catalogue",
          "rationale": "Editorial suite membership from the version 0.5 catalogue.",
          "evidence": "https://digitalconstruction.github.io/v/0.5/",
          "id": "modules-edge-14"
        },
        {
          "source": "Occupancy",
          "target": "Information",
          "label": "owl:imports",
          "kind": "import",
          "predicate": "http://www.w3.org/2002/07/owl#imports",
          "rationale": "Direct owl:imports statement in the saved version 0.5 Turtle file.",
          "evidence": "https://digitalconstruction.github.io/Occupancy/v/0.5/occupancy.ttl",
          "id": "modules-edge-15"
        },
        {
          "source": "DICO Suite",
          "target": "Lifecycle",
          "label": "catalogue includes",
          "kind": "catalogue",
          "rationale": "Editorial suite membership from the version 0.5 catalogue.",
          "evidence": "https://digitalconstruction.github.io/v/0.5/",
          "id": "modules-edge-16"
        },
        {
          "source": "Lifecycle",
          "target": "Agents",
          "label": "owl:imports",
          "kind": "import",
          "predicate": "http://www.w3.org/2002/07/owl#imports",
          "rationale": "Direct owl:imports statement in the saved version 0.5 Turtle file.",
          "evidence": "https://digitalconstruction.github.io/Lifecycle/v/0.5/lifecycle.ttl",
          "id": "modules-edge-17"
        },
        {
          "source": "DICO Suite",
          "target": "Energy",
          "label": "catalogue includes",
          "kind": "catalogue",
          "rationale": "Editorial suite membership from the version 0.5 catalogue.",
          "evidence": "https://digitalconstruction.github.io/v/0.5/",
          "id": "modules-edge-18"
        },
        {
          "source": "Energy",
          "target": "Information",
          "label": "owl:imports",
          "kind": "import",
          "predicate": "http://www.w3.org/2002/07/owl#imports",
          "rationale": "Direct owl:imports statement in the saved version 0.5 Turtle file.",
          "evidence": "https://digitalconstruction.github.io/Energy/v/0.5/energy.ttl",
          "id": "modules-edge-19"
        },
        {
          "source": "DICO Suite",
          "target": "BFO",
          "label": "alignment listed",
          "kind": "alignment",
          "rationale": "Catalogue entry for a separate alignment module; not a direct owl:imports assertion.",
          "evidence": "https://w3id.org/digitalconstruction/0.5/Alignment/BFO",
          "id": "modules-edge-20"
        },
        {
          "source": "DICO Suite",
          "target": "ifcOWL",
          "label": "alignment listed",
          "kind": "alignment",
          "rationale": "Catalogue entry for a separate alignment module; not a direct owl:imports assertion.",
          "evidence": "https://w3id.org/digitalconstruction/0.5/Alignment/IFC",
          "id": "modules-edge-21"
        },
        {
          "source": "DICO Suite",
          "target": "OWL-Time",
          "label": "alignment listed",
          "kind": "alignment",
          "rationale": "Catalogue entry for a separate alignment module; not a direct owl:imports assertion.",
          "evidence": "https://w3id.org/digitalconstruction/0.5/Alignment/OWLTime",
          "id": "modules-edge-22"
        },
        {
          "source": "DICO Suite",
          "target": "PROV-O",
          "label": "alignment listed",
          "kind": "alignment",
          "rationale": "Catalogue entry for a separate alignment module; not a direct owl:imports assertion.",
          "evidence": "https://w3id.org/digitalconstruction/0.5/Alignment/PROV",
          "id": "modules-edge-23"
        },
        {
          "source": "DICO Suite",
          "target": "FOAF",
          "label": "alignment listed",
          "kind": "alignment",
          "rationale": "Catalogue entry for a separate alignment module; not a direct owl:imports assertion.",
          "evidence": "https://w3id.org/digitalconstruction/0.5/Alignment/FOAF",
          "id": "modules-edge-24"
        },
        {
          "source": "DICO Suite",
          "target": "QUDT",
          "label": "alignment listed",
          "kind": "alignment",
          "rationale": "Catalogue entry for a separate alignment module; not a direct owl:imports assertion.",
          "evidence": "https://w3id.org/digitalconstruction/0.5/Alignment/QUDT",
          "id": "modules-edge-25"
        },
        {
          "source": "DICO Suite",
          "target": "SSN",
          "label": "alignment listed",
          "kind": "alignment",
          "rationale": "Catalogue entry for a separate alignment module; not a direct owl:imports assertion.",
          "evidence": "https://w3id.org/digitalconstruction/0.5/Alignment/SSN",
          "id": "modules-edge-26"
        },
        {
          "source": "DICO Suite",
          "target": "SOSA",
          "label": "alignment listed",
          "kind": "alignment",
          "rationale": "Catalogue entry for a separate alignment module; not a direct owl:imports assertion.",
          "evidence": "https://w3id.org/digitalconstruction/0.5/Alignment/SSN",
          "id": "modules-edge-27"
        },
        {
          "source": "DICO Suite",
          "target": "SAREF",
          "label": "alignment listed",
          "kind": "alignment",
          "rationale": "Catalogue entry for a separate alignment module; not a direct owl:imports assertion.",
          "evidence": "https://w3id.org/digitalconstruction/0.5/Alignment/Saref",
          "id": "modules-edge-28"
        },
        {
          "source": "DICO Suite",
          "target": "ORG",
          "label": "alignment listed",
          "kind": "alignment",
          "rationale": "Catalogue entry for a separate alignment module; not a direct owl:imports assertion.",
          "evidence": "https://w3id.org/digitalconstruction/0.5/Alignment/Org",
          "id": "modules-edge-29"
        }
      ],
      "readings": [
        {
          "title": "Follow the dependency chain",
          "start": "Information",
          "text": "Select Information: it directly imports Agents, which imports Processes, which imports Entities. An inherited dependency is not another direct import."
        },
        {
          "title": "Separate a module from an alignment",
          "start": "SAREF",
          "text": "SAREF is listed through the separate Saref alignment. The Energy module itself imports Information; it does not directly import SAREF."
        },
        {
          "title": "Find the renamed extensions",
          "start": "Occupancy",
          "text": "Version 0.5 groups occupant behaviour, comfort, air quality and acoustics in Occupancy. Earlier labels remain searchable aliases."
        }
      ],
      "corrections": [
        "Replaced the hand-authored import network with nine direct declarations parsed from ten versioned TTL files.",
        "Materials, Energy and Occupancy replace older extension labels. IndoorAirQuality and BuildingAcoustics remain searchable topics within Occupancy.",
        "External vocabulary links describe separate alignments. SAREF is not a direct import of Energy. The suite node is a navigation aid."
      ]
    },
    "tokyo": {
      "nodes": [
        {
          "id": "stadium",
          "label": "Japan National Stadium (Tokyo Olympic Stadium)",
          "type": "Building",
          "ontologyClass": "dice:BuildingObject",
          "props": {
            "nativeName": "国立競技場",
            "location": "Kasumigaokamachi, Shinjuku, Tokyo, Japan",
            "opened": "2019-12-21",
            "capacity": "68,000 (2019 announcement; configuration-dependent)",
            "floorArea": "≈192,000 m² (JSC); architect page reports 194,000 m²",
            "primaryUses": "Athletics, ceremonies, football, rugby"
          },
          "sources": [
            "https://www.jpnsport.go.jp/corp/Portals/0/corp/2025_JSC_Pamphlet_JPN_Web.pdf",
            "https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games",
            "https://kkaa.co.jp/en/project/japan-national-stadium/"
          ],
          "legacy": {
            "ontologyClass": "dice:BuildingObject",
            "label": "Japan National Stadium (Tokyo Olympic Stadium)",
            "props": {
              "nativeName": "国立競技場",
              "location": "Kasumigaokamachi, Shinjuku, Tokyo, Japan",
              "opened": "2019-12-21",
              "capacity": "≈67,750",
              "floorArea": "≈192,000 m² (reported)",
              "primaryUses": "Athletics, ceremonies, football, rugby"
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium",
              "https://www.sports-tokyo-info.metro.tokyo.lg.jp/english/tokyoSportsFacilities/facility/02.html"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "nativeName: 国立競技場; location: Kasumigaokamachi, Shinjuku, Tokyo, Japan; opened: 2019-12-21; capacity: 68,000 (2019 announcement; configuration-dependent); floorArea: ≈192,000 m² (JSC); architect page reports 194,000 m²; primaryUses: Athletics, ceremonies, football, rugby",
          "degree": 10
        },
        {
          "id": "tokyo",
          "label": "Tokyo (Shinjuku)",
          "type": "Location",
          "ontologyClass": "dice:Location",
          "props": {
            "country": "Japan"
          },
          "sources": [
            "https://www.jpnsport.go.jp/corp/Portals/0/corp/2025_JSC_Pamphlet_JPN_Web.pdf"
          ],
          "legacy": {
            "ontologyClass": "dice:Location",
            "label": "Tokyo (Shinjuku)",
            "props": {
              "country": "Japan"
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "country: Japan",
          "degree": 1
        },
        {
          "id": "jsc",
          "label": "Japan Sport Council (Owner / Public client)",
          "type": "Agent",
          "ontologyClass": "dica:Organization",
          "props": {
            "role": "Owner; commissioning body"
          },
          "sources": [
            "https://www.jpnsport.go.jp/corp/Portals/0/corp/2025_JSC_Pamphlet_JPN_Web.pdf"
          ],
          "legacy": {
            "ontologyClass": "dica:Organization",
            "label": "Japan Sport Council (Owner / Public client)",
            "props": {
              "role": "Owner; commissioning body"
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium",
              "https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "role: Owner; commissioning body",
          "degree": 3
        },
        {
          "id": "kengo_kuma",
          "label": "Kengo Kuma (Architect)",
          "type": "Agent",
          "ontologyClass": "dica:Person",
          "props": {
            "profession": "Architect"
          },
          "sources": [
            "https://kkaa.co.jp/en/project/japan-national-stadium/"
          ],
          "legacy": {
            "ontologyClass": "dica:Person",
            "label": "Kengo Kuma (Architect)",
            "props": {
              "profession": "Architect"
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium",
              "https://kkaa.co.jp/en/project/japan-national-stadium/"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "profession: Architect",
          "degree": 1
        },
        {
          "id": "kkaa",
          "label": "Kengo Kuma & Associates (Design JV member)",
          "type": "Agent",
          "ontologyClass": "dica:Organization",
          "props": {
            "role": "Architecture / design"
          },
          "sources": [
            "https://www.jpnsport.go.jp/corp/Portals/0/kokuritsu/overview_of_the_JapanNationalStadium.pdf",
            "https://kkaa.co.jp/en/project/japan-national-stadium/"
          ],
          "legacy": {
            "ontologyClass": "dica:Organization",
            "label": "Kengo Kuma & Associates (Design JV member)",
            "props": {
              "role": "Architecture / design"
            },
            "sources": [
              "https://kkaa.co.jp/en/project/japan-national-stadium/",
              "https://www.archdaily.com/964848/japan-national-stadium-taisei-corporation-plus-azusa-sekkei-plus-kengo-kuma-and-associates"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "role: Architecture / design",
          "degree": 2
        },
        {
          "id": "taisei",
          "label": "Taisei Corporation (Main contractor / design JV member)",
          "type": "Agent",
          "ontologyClass": "dica:Organization",
          "props": {
            "role": "Construction; design-build JV member"
          },
          "sources": [
            "https://www.jpnsport.go.jp/corp/Portals/0/kokuritsu/overview_of_the_JapanNationalStadium.pdf",
            "https://kkaa.co.jp/en/project/japan-national-stadium/"
          ],
          "legacy": {
            "ontologyClass": "dica:Organization",
            "label": "Taisei Corporation (Main contractor / design JV member)",
            "props": {
              "role": "Construction; design-build JV member"
            },
            "sources": [
              "https://www.archdaily.com/964848/japan-national-stadium-taisei-corporation-plus-azusa-sekkei-plus-kengo-kuma-and-associates",
              "https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "role: Construction; design-build JV member",
          "degree": 2
        },
        {
          "id": "azusa",
          "label": "Azusa Sekkei (Design JV member)",
          "type": "Agent",
          "ontologyClass": "dica:Organization",
          "props": {
            "role": "Design / engineering support"
          },
          "sources": [
            "https://www.jpnsport.go.jp/corp/Portals/0/kokuritsu/overview_of_the_JapanNationalStadium.pdf",
            "https://kkaa.co.jp/en/project/japan-national-stadium/"
          ],
          "legacy": {
            "ontologyClass": "dica:Organization",
            "label": "Azusa Sekkei (Design JV member)",
            "props": {
              "role": "Design / engineering support"
            },
            "sources": [
              "https://www.archdaily.com/964848/japan-national-stadium-taisei-corporation-plus-azusa-sekkei-plus-kengo-kuma-and-associates",
              "https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "role: Design / engineering support",
          "degree": 2
        },
        {
          "id": "jnse",
          "label": "Japan National Stadium Entertainment (Operator)",
          "type": "Agent",
          "ontologyClass": "dica:Organization",
          "props": {
            "role": "Operating company from 1 April 2025",
            "notDuring": "Construction and the Tokyo Games preceded this concession"
          },
          "sources": [
            "https://jns-e.com/news/20250401-421/"
          ],
          "legacy": {
            "ontologyClass": "dica:Organization",
            "label": "Japan National Stadium Entertainment (Operator)",
            "props": {
              "note": "Operations/management transition referenced by JSC; operator shown in several sources."
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium",
              "https://www.jpnsport.go.jp/corp/english/tabid/397/Default.aspx"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "role: Operating company from 1 April 2025; notDuring: Construction and the Tokyo Games preceded this concession",
          "degree": 2
        },
        {
          "id": "design_selection",
          "label": "Design selection & planning (rebid; Kuma team selected)",
          "type": "Activity",
          "ontologyClass": "dicp:Activity",
          "props": {
            "date": "22 December 2015"
          },
          "sources": [
            "https://www.cas.go.jp/jp/seisakukaigi/tokyo2020_suishin_honbu/statement/2015/1222speech.html"
          ],
          "legacy": {
            "ontologyClass": "dicp:ObjectActivity",
            "label": "Design selection & planning (rebid; Kuma team selected)",
            "props": {
              "date": "2015 (selection announced Dec 2015)"
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium",
              "https://www.nippon.com/en/guide-to-japan/gu900072/"
            ]
          },
          "evidenceStatus": "Government statement confirms selection; links to individual design participants are editorial.",
          "description": "date: 22 December 2015",
          "degree": 7
        },
        {
          "id": "construction",
          "label": "Construction of the stadium",
          "type": "Activity",
          "ontologyClass": "dicp:Activity",
          "props": {
            "start": "2016-12-01",
            "end": "2019-11-30",
            "peakWorkforce": "≈2,800/day (reported)"
          },
          "sources": [
            "https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games"
          ],
          "legacy": {
            "ontologyClass": "dicp:ObjectActivity",
            "label": "Construction of the stadium",
            "props": {
              "start": "2016-12-01",
              "end": "2019-11-30",
              "peakWorkforce": "≈2,800/day (reported)"
            },
            "sources": [
              "https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games",
              "https://en.wikipedia.org/wiki/Japan_National_Stadium"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "start: 2016-12-01; end: 2019-11-30; peakWorkforce: ≈2,800/day (reported)",
          "degree": 11
        },
        {
          "id": "opening",
          "label": "Stadium opening ceremony",
          "type": "Activity",
          "ontologyClass": "dicp:Activity",
          "props": {
            "date": "2019-12-21"
          },
          "sources": [
            "https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games"
          ],
          "legacy": {
            "ontologyClass": "dice:Activity",
            "label": "Stadium opening ceremony",
            "props": {
              "date": "2019-12-21"
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "date: 2019-12-21",
          "degree": 1
        },
        {
          "id": "operations",
          "label": "Operations & event hosting",
          "type": "Activity",
          "ontologyClass": "dicp:Activity",
          "props": {
            "since": "2019",
            "uses": "Athletics, football, rugby, ceremonies, cultural events",
            "operatorPeriod": "JNSE link applies from April 2025; operations began before this"
          },
          "sources": [
            "https://www.jpnsport.go.jp/corp/Portals/0/corp/2025_JSC_Pamphlet_JPN_Web.pdf",
            "https://jns-e.com/news/20250401-421/"
          ],
          "legacy": {
            "ontologyClass": "dice:Activity",
            "label": "Operations & event hosting",
            "props": {
              "since": "2019",
              "uses": "Athletics, football, rugby, ceremonies, cultural events"
            },
            "sources": [
              "https://www.sports-tokyo-info.metro.tokyo.lg.jp/english/tokyoSportsFacilities/facility/02.html",
              "https://en.wikipedia.org/wiki/Japan_National_Stadium"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "since: 2019; uses: Athletics, football, rugby, ceremonies, cultural events; operatorPeriod: JNSE link applies from April 2025; operations began before this",
          "degree": 3
        },
        {
          "id": "olympics_2020",
          "label": "Tokyo 2020 Olympic & Paralympic main venue (ceremonies, athletics)",
          "type": "Activity",
          "ontologyClass": "dicp:Activity",
          "props": {
            "period": "Tokyo 2020 Games held in 2021",
            "role": "Main stadium"
          },
          "sources": [
            "https://www.jpnsport.go.jp/corp/Portals/0/corp/2025_JSC_Pamphlet_JPN_Web.pdf"
          ],
          "legacy": {
            "ontologyClass": "dice:Activity",
            "label": "Tokyo 2020 Olympic & Paralympic main venue (ceremonies, athletics)",
            "props": {
              "note": "Used as main stadium; events held without spectators due to COVID-19 measures."
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium",
              "https://apnews.com/article/847c7bdd00791d2ae28ad1ee0ab2cbde"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "period: Tokyo 2020 Games held in 2021; role: Main stadium",
          "degree": 2
        },
        {
          "id": "design_concept",
          "label": "Design: layered eaves + wood louvers (Kuma concept)",
          "type": "Information",
          "ontologyClass": "dici:Design",
          "props": {
            "theme": "Traditional eaves in contemporary form; human scale; integration with surroundings"
          },
          "sources": [
            "https://kkaa.co.jp/en/project/japan-national-stadium/"
          ],
          "legacy": {
            "ontologyClass": "dici:Design",
            "label": "Design: layered eaves + wood louvers (Kuma concept)",
            "props": {
              "theme": "Traditional eaves in contemporary form; human scale; integration with surroundings"
            },
            "sources": [
              "https://kkaa.co.jp/en/project/japan-national-stadium/"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "theme: Traditional eaves in contemporary form; human scale; integration with surroundings",
          "degree": 2
        },
        {
          "id": "timber",
          "label": "Timber elements (cedar/larch; sourced across Japan)",
          "type": "Material",
          "ontologyClass": "dicm:MaterialBatch",
          "props": {
            "note": "Wood used in eaves/soffits; sourcing described as spanning Japan's prefectures."
          },
          "sources": [
            "https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games",
            "https://kkaa.co.jp/en/project/japan-national-stadium/"
          ],
          "legacy": {
            "ontologyClass": "dice:MaterialBatch",
            "label": "Timber elements (cedar/larch; sourced across Japan)",
            "props": {
              "note": "Wood used in eaves/soffits; sourcing described as spanning Japan's prefectures."
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium",
              "https://www.archpaper.com/2019/01/kengo-kuma-2020-tokyo-olympic-national-stadium/"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "modellingNote": "Representative material-batch concept; no batch identifier, quantity or delivery record is supplied.",
          "description": "note: Wood used in eaves/soffits; sourcing described as spanning Japan's prefectures.",
          "degree": 1
        },
        {
          "id": "steel",
          "label": "Steel structure",
          "type": "Material",
          "ontologyClass": "dicm:MaterialBatch",
          "props": {
            "note": "Major structural material (roof and frame)."
          },
          "sources": [
            "https://kkaa.co.jp/en/project/japan-national-stadium/"
          ],
          "legacy": {
            "ontologyClass": "dice:MaterialBatch",
            "label": "Steel structure",
            "props": {
              "note": "Major structural material (roof and frame)."
            },
            "sources": [
              "https://www.archdaily.com/964848/japan-national-stadium-taisei-corporation-plus-azusa-sekkei-plus-kengo-kuma-and-associates"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "modellingNote": "Representative material-batch concept; no batch identifier, quantity or delivery record is supplied.",
          "description": "note: Major structural material (roof and frame).",
          "degree": 1
        },
        {
          "id": "solar",
          "label": "Transparent solar panels (part of roof)",
          "type": "System",
          "ontologyClass": "dice:BuildingObject",
          "props": {
            "note": "JSC environmental design publication specifies see-through thin-film solar cells at the roof edge. This source is design intent, not an as-built inspection."
          },
          "sources": [
            "https://www.jpnsport.go.jp/newstadium/Portals/0/kokuminmukeshiryou/shinkokuritsukyougijyouseibijigyou_1_01.pdf"
          ],
          "legacy": {
            "ontologyClass": "dice:BuildingObject",
            "label": "Transparent solar panels (part of roof)",
            "props": {
              "note": "Solar panels described as integrated into part of the roof."
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium"
            ]
          },
          "evidenceStatus": "Primary design intent; installation and current performance not verified.",
          "description": "note: JSC environmental design publication specifies see-through thin-film solar cells at the roof edge. This source is design intent, not an as-built inspection.",
          "degree": 1
        },
        {
          "id": "rainwater",
          "label": "Rainwater collection and landscape irrigation",
          "type": "System",
          "ontologyClass": "dice:BuildingObject",
          "props": {
            "note": "JSC design publication specifies rainwater storage and irrigation of planted areas, with rainwater/well-water reuse. Original turf-specific claim is not treated as verified."
          },
          "sources": [
            "https://www.jpnsport.go.jp/newstadium/Portals/0/kokuminmukeshiryou/shinkokuritsukyougijyouseibijigyou_1_01.pdf"
          ],
          "legacy": {
            "ontologyClass": "dice:BuildingObject",
            "label": "Rainwater collection (cisterns → turf irrigation)",
            "props": {
              "note": "Rainwater reuse described for irrigating arena turf and plants."
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium"
            ]
          },
          "evidenceStatus": "Primary design intent; installation and current performance not verified.",
          "description": "note: JSC design publication specifies rainwater storage and irrigation of planted areas, with rainwater/well-water reuse. Original turf-specific claim is not treated as verified.",
          "degree": 1
        },
        {
          "id": "turf",
          "label": "Grass playing surface (turf)",
          "type": "Material",
          "ontologyClass": "dicm:MaterialBatch",
          "props": {
            "surface": "Grass"
          },
          "sources": [
            "https://www.jpnsport.go.jp/corp/Portals/0/corp/2025_JSC_Pamphlet_JPN_Web.pdf"
          ],
          "legacy": {
            "ontologyClass": "dice:MaterialBatch",
            "label": "Grass playing surface (turf)",
            "props": {
              "surface": "Grass"
            },
            "sources": [
              "https://en.wikipedia.org/wiki/Japan_National_Stadium"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "modellingNote": "Representative material-batch concept; no batch identifier, quantity or delivery record is supplied.",
          "description": "surface: Grass",
          "degree": 1
        },
        {
          "id": "cost",
          "label": "Reported construction cost: ¥156.9 billion",
          "type": "Cost",
          "ontologyClass": "qudt:QuantityValue",
          "props": {
            "amount": 156.9,
            "unit": "JPY (billion)",
            "budgetCap": "¥159B planned (reported)",
            "scope": "2019 Tokyo 2020 announcement; the original “including surroundings” qualifier is not verified here."
          },
          "sources": [
            "https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games"
          ],
          "legacy": {
            "ontologyClass": "qudt:QuantityValue",
            "label": "Construction cost: ¥156.9B (incl. surroundings)",
            "props": {
              "amount": 156.9,
              "unit": "JPY (billion)",
              "budgetCap": "¥159B planned (reported)"
            },
            "sources": [
              "https://www.nippon.com/en/japan-topics/g00795/",
              "https://www.paralympic.org/news/tokyo-2020-olympic-stadium-ready-games"
            ]
          },
          "evidenceStatus": "Selected facts checked against primary sources; graph classification is editorial.",
          "description": "amount: 156.9; unit: JPY (billion); budgetCap: ¥159B planned (reported); scope: 2019 Tokyo 2020 announcement; the original “including surroundings” qualifier is not verified here.",
          "degree": 2
        }
      ],
      "links": [
        {
          "source": "stadium",
          "target": "tokyo",
          "label": "located in",
          "iri": "dice:locatedIn",
          "legacyPredicate": "dice:occursIn",
          "kind": "model",
          "rationale": "A building is located in a place; occursIn is for processes.",
          "predicate": "dice:locatedIn",
          "id": "tokyo-edge-1"
        },
        {
          "source": "stadium",
          "target": "jsc",
          "label": "owned by",
          "iri": "example:ownedBy",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Local ownership shorthand; hasAgent would incorrectly treat the building as a process.",
          "predicate": "example:ownedBy",
          "id": "tokyo-edge-2"
        },
        {
          "source": "stadium",
          "target": "jnse",
          "label": "operated by",
          "iri": "example:operatedBy",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Local ownership/operation shorthand, applicable from April 2025.",
          "validFrom": "2025-04-01",
          "predicate": "example:operatedBy",
          "id": "tokyo-edge-3"
        },
        {
          "source": "design_selection",
          "target": "stadium",
          "label": "object of activity",
          "iri": "dicp:hasObject",
          "legacyPredicate": "dicp:hasObject",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dicp:hasObject",
          "id": "tokyo-edge-4"
        },
        {
          "source": "construction",
          "target": "stadium",
          "label": "object of activity",
          "iri": "dicp:hasObject",
          "legacyPredicate": "dicp:hasObject",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dicp:hasObject",
          "id": "tokyo-edge-5"
        },
        {
          "source": "opening",
          "target": "stadium",
          "label": "object of activity",
          "iri": "dicp:hasObject",
          "legacyPredicate": "dicp:hasObject",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dicp:hasObject",
          "id": "tokyo-edge-6"
        },
        {
          "source": "operations",
          "target": "stadium",
          "label": "object of activity",
          "iri": "dicp:hasObject",
          "legacyPredicate": "dicp:hasObject",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dicp:hasObject",
          "id": "tokyo-edge-7"
        },
        {
          "source": "design_selection",
          "target": "jsc",
          "label": "has agent",
          "iri": "dica:hasAgent",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dica:hasAgent",
          "id": "tokyo-edge-8"
        },
        {
          "source": "design_selection",
          "target": "kengo_kuma",
          "label": "has agent",
          "iri": "dica:hasAgent",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dica:hasAgent",
          "id": "tokyo-edge-9"
        },
        {
          "source": "design_selection",
          "target": "kkaa",
          "label": "has agent",
          "iri": "dica:hasAgent",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dica:hasAgent",
          "id": "tokyo-edge-10"
        },
        {
          "source": "design_selection",
          "target": "taisei",
          "label": "has agent",
          "iri": "dica:hasAgent",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dica:hasAgent",
          "id": "tokyo-edge-11"
        },
        {
          "source": "design_selection",
          "target": "azusa",
          "label": "has agent",
          "iri": "dica:hasAgent",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dica:hasAgent",
          "id": "tokyo-edge-12"
        },
        {
          "source": "construction",
          "target": "taisei",
          "label": "has agent",
          "iri": "dica:hasAgent",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dica:hasAgent",
          "id": "tokyo-edge-13"
        },
        {
          "source": "construction",
          "target": "kkaa",
          "label": "has agent",
          "iri": "dica:hasAgent",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dica:hasAgent",
          "id": "tokyo-edge-14"
        },
        {
          "source": "construction",
          "target": "azusa",
          "label": "has agent",
          "iri": "dica:hasAgent",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dica:hasAgent",
          "id": "tokyo-edge-15"
        },
        {
          "source": "construction",
          "target": "jsc",
          "label": "has agent",
          "iri": "dica:hasAgent",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dica:hasAgent",
          "id": "tokyo-edge-16"
        },
        {
          "source": "operations",
          "target": "jnse",
          "label": "has agent",
          "iri": "dica:hasAgent",
          "legacyPredicate": "dice:hasAgent",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "validFrom": "2025-04-01",
          "predicate": "dica:hasAgent",
          "id": "tokyo-edge-17"
        },
        {
          "source": "design_selection",
          "target": "design_concept",
          "label": "has information",
          "iri": "dici:hasInformation",
          "legacyPredicate": "dice:hasInformation",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dici:hasInformation",
          "id": "tokyo-edge-18"
        },
        {
          "source": "design_concept",
          "target": "stadium",
          "label": "describes",
          "iri": "dici:isAbout",
          "legacyPredicate": "dici:describes",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dici:isAbout",
          "id": "tokyo-edge-19"
        },
        {
          "source": "construction",
          "target": "timber",
          "label": "has material",
          "iri": "dicp:hasInputObject",
          "legacyPredicate": "dice:hasMaterial",
          "kind": "model",
          "rationale": "Representative material batch as input to construction; not a measured material flow.",
          "predicate": "dicp:hasInputObject",
          "id": "tokyo-edge-20"
        },
        {
          "source": "construction",
          "target": "steel",
          "label": "has material",
          "iri": "dicp:hasInputObject",
          "legacyPredicate": "dice:hasMaterial",
          "kind": "model",
          "rationale": "Representative material batch as input to construction; not a measured material flow.",
          "predicate": "dicp:hasInputObject",
          "id": "tokyo-edge-21"
        },
        {
          "source": "construction",
          "target": "turf",
          "label": "has material",
          "iri": "dicp:hasInputObject",
          "legacyPredicate": "dice:hasMaterial",
          "kind": "model",
          "rationale": "Representative material batch as input to construction; not a measured material flow.",
          "predicate": "dicp:hasInputObject",
          "id": "tokyo-edge-22"
        },
        {
          "source": "construction",
          "target": "solar",
          "label": "system in design",
          "iri": "dicp:hasObject",
          "legacyPredicate": "dicp:hasObject",
          "kind": "model",
          "rationale": "The linked JSC publication gives design intent; construction completion of this system is not verified.",
          "predicate": "dicp:hasObject",
          "id": "tokyo-edge-23"
        },
        {
          "source": "construction",
          "target": "rainwater",
          "label": "system in design",
          "iri": "dicp:hasObject",
          "legacyPredicate": "dicp:hasObject",
          "kind": "model",
          "rationale": "The linked JSC publication gives design intent; construction completion of this system is not verified.",
          "predicate": "dicp:hasObject",
          "id": "tokyo-edge-24"
        },
        {
          "source": "construction",
          "target": "cost",
          "label": "has cost",
          "iri": "example:hasConstructionCost",
          "legacyPredicate": "dicv:hasVariable (modeled)",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "example:hasConstructionCost",
          "id": "tokyo-edge-25"
        },
        {
          "source": "cost",
          "target": "stadium",
          "label": "cost of",
          "iri": "example:costOf",
          "legacyPredicate": "dicp:hasObject",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "example:costOf",
          "id": "tokyo-edge-26"
        },
        {
          "source": "olympics_2020",
          "target": "stadium",
          "label": "hosted at",
          "iri": "dice:occursIn",
          "legacyPredicate": "dice:occursIn",
          "kind": "model",
          "rationale": "Editorial relation in the worked example; not an official project assertion.",
          "predicate": "dice:occursIn",
          "id": "tokyo-edge-27"
        },
        {
          "source": "operations",
          "target": "olympics_2020",
          "label": "includes milestone",
          "iri": "example:includesMilestone",
          "legacyPredicate": "prov:wasInformedBy",
          "kind": "model",
          "rationale": "Local timeline association; prov:wasInformedBy would mean communication between activities.",
          "predicate": "example:includesMilestone",
          "id": "tokyo-edge-28"
        }
      ],
      "id": "tokyo",
      "title": "Tokyo stadium worked model",
      "summary": "Start with a stadium and follow the design, construction, materials, information and people around it. Twenty concepts make the modelling choices small enough to inspect.",
      "boundary": "An illustrative model spanning construction (2015–2019), the Games in 2021 and the operator transition in April 2025. It is not a current asset register or a single-time snapshot. Node sources support selected facts; the links and class assignments are editorial modelling choices, not official RDF or a reasoner-validated ontology.",
      "source": {
        "file": "tokyo_stadium_dicon_graph.html",
        "url": "https://github.com/lawrencerowland/Project-web-apps/blob/cd0528939fd0e1f5de1df7cda9930785349e4946/web_apps/tokyo_stadium_dicon_graph.html",
        "sha256": "54a68482f80e0838fcc82f551a3e07e2b68d67eed23a801b985ec74228aa2c10"
      },
      "readings": [
        {
          "title": "Follow construction to its materials",
          "start": "construction",
          "text": "Construction connects to a building, participating agents and representative material batches. The batches are concepts here, not measured deliveries."
        },
        {
          "title": "Separate fact from model",
          "start": "cost",
          "text": "The reported ¥156.9 billion amount is sourced. Linking it to construction uses an explicitly local example predicate, not a claim that DiCon provides that exact property."
        },
        {
          "title": "Keep time visible",
          "start": "jnse",
          "text": "JNSE began operating the stadium in April 2025. It was not the operator during construction or the Tokyo Games."
        }
      ],
      "corrections": [
        "The incomplete script has been replaced; all 20 concepts and 28 connections remain.",
        "Activity, MaterialBatch, hasAgent and hasInformation use the correct 0.5 module; describes becomes isAbout. Building location uses locatedIn, not occursIn.",
        "Ownership, operation, cost and milestone shortcuts have explicit example: predicates. They are not presented as DiCon axioms.",
        "Solar/rainwater are sourced design intent. JNSE links are dated from April 2025. Capacity/floor area and the original cost-scope qualifier are qualified in the node details. Original values are retained there."
      ]
    },
    "hs2": {
      "nodes": [
        {
          "id": "HS2Programme",
          "label": "High Speed Two (HS2) Programme",
          "type": "Project",
          "uri": "https://example.org/hs2/HS2Programme",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Processes#Project",
          "description": "UK high-speed rail programme (snapshot described as focused on London–Birmingham).",
          "sources": [
            "https://www.nao.org.uk/reports/hs2-update-following-cancellation-of-phase-2/",
            "https://www.gov.uk/government/organisations/high-speed-two-limited"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 34
        },
        {
          "id": "DepartmentForTransport",
          "label": "Department for Transport (DfT)",
          "type": "Organization",
          "uri": "https://example.org/hs2/DepartmentForTransport",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "description": "UK government department sponsoring/overseeing the HS2 programme.",
          "sources": [
            "https://www.nao.org.uk/reports/hs2-update-following-cancellation-of-phase-2/",
            "https://www.gov.uk/government/organisations/high-speed-two-limited"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 4
        },
        {
          "id": "HS2Ltd",
          "label": "High Speed Two (HS2) Limited",
          "type": "Organization",
          "uri": "https://example.org/hs2/HS2Ltd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "description": "Arm’s-length body sponsored by DfT, responsible for delivering HS2.",
          "sources": [
            "https://www.nao.org.uk/reports/hs2-update-following-cancellation-of-phase-2/",
            "https://www.gov.uk/government/organisations/high-speed-two-limited",
            "https://www.hs2.org.uk/about-us/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 24
        },
        {
          "id": "OfficeOfRailAndRoad",
          "label": "Office of Rail and Road (ORR)",
          "type": "Organization",
          "uri": "https://example.org/hs2/OfficeOfRailAndRoad",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "description": "Independent safety and economic regulator for Britain’s railways; engages on HS2 safety/integration and track access issues.",
          "sources": [
            "https://www.orr.gov.uk/high-speed-two-hs2",
            "https://www.gov.uk/government/organisations/office-of-rail-and-road"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "HealthAndSafetyExecutive",
          "label": "Health and Safety Executive (HSE)",
          "type": "Organization",
          "uri": "https://example.org/hs2/HealthAndSafetyExecutive",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "description": "Enforcing authority for the majority of activities related to HS2 construction works.",
          "sources": [
            "https://www.orr.gov.uk/high-speed-two-hs2"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "NationalAuditOffice",
          "label": "National Audit Office (NAO)",
          "type": "Organization",
          "uri": "https://example.org/hs2/NationalAuditOffice",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "description": "UK Parliament’s independent public spending watchdog; reports on HS2 value for money and programme changes.",
          "sources": [
            "https://www.nao.org.uk/reports/hs2-update-following-cancellation-of-phase-2/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "IndependentHS2Commissioner",
          "label": "Independent HS2 Commissioner",
          "type": "Organization",
          "uri": "https://example.org/hs2/IndependentHS2Commissioner",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "description": "Independent complaints-handling/mediation role (merged in April 2025) for unresolved HS2-related disputes/complaints.",
          "sources": [
            "https://www.gov.uk/government/collections/independent-hs2-commissioner",
            "https://www.hs2.org.uk/about-us/independent-hs2-commissioner/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "HeidiAlexander",
          "label": "Heidi Alexander MP",
          "type": "Person",
          "uri": "https://example.org/hs2/HeidiAlexander",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Person",
          "description": "UK Secretary of State for Transport (appointed 29 Nov 2024).",
          "sources": [
            "https://www.gov.uk/government/ministers/secretary-of-state-for-transport"
          ],
          "evidenceStatus": "Historical snapshot only; current office or employment has not been asserted.",
          "degree": 2
        },
        {
          "id": "MarkWild",
          "label": "Mark Wild OBE",
          "type": "Person",
          "uri": "https://example.org/hs2/MarkWild",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Person",
          "description": "Chief Executive Officer of HS2 Ltd (since December 2024).",
          "sources": [
            "https://www.hs2.org.uk/people/mark-wild/",
            "https://www.hs2.org.uk/about-us/board-and-executive-team/"
          ],
          "evidenceStatus": "Historical snapshot only; current office or employment has not been asserted.",
          "degree": 2
        },
        {
          "id": "MikeBrown",
          "label": "Mike Brown CBE",
          "type": "Person",
          "uri": "https://example.org/hs2/MikeBrown",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Person",
          "description": "Chair of HS2 Ltd (appointed July 2025).",
          "sources": [
            "https://www.hs2.org.uk/people/mike-brown/",
            "https://www.hs2.org.uk/about-us/board-and-executive-team/"
          ],
          "evidenceStatus": "Historical snapshot only; current office or employment has not been asserted.",
          "degree": 2
        },
        {
          "id": "Role_DfT_ProjectOwner",
          "label": "DfT: Project owner / sponsor role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_DfT_ProjectOwner",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#ProjectOwnerRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_HS2Ltd_ProjectLeader",
          "label": "HS2 Ltd: Delivery / project leader role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_HS2Ltd_ProjectLeader",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#ProjectLeaderRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_HeidiAlexander_ProjectOwner",
          "label": "Secretary of State: Project owner role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_HeidiAlexander_ProjectOwner",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#ProjectOwnerRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_MarkWild_ProjectLeader",
          "label": "CEO: Project leader role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_MarkWild_ProjectLeader",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#ProjectLeaderRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_MikeBrown_ProjectLeader",
          "label": "Chair: Project leader role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_MikeBrown_ProjectLeader",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#ProjectLeaderRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_ORR_Stakeholder",
          "label": "ORR: Stakeholder role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_ORR_Stakeholder",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#StakeholderRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_HSE_Stakeholder",
          "label": "HSE: Stakeholder role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_HSE_Stakeholder",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#StakeholderRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_NAO_Stakeholder",
          "label": "NAO: Stakeholder role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_NAO_Stakeholder",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#StakeholderRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_Commissioner_Stakeholder",
          "label": "Independent HS2 Commissioner: Stakeholder role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_Commissioner_Stakeholder",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#StakeholderRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Appt_DfT_to_HS2Ltd",
          "label": "Appointment: DfT sponsors HS2 Ltd",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_DfT_to_HS2Ltd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.nao.org.uk/reports/hs2-update-following-cancellation-of-phase-2/",
            "https://www.gov.uk/government/organisations/high-speed-two-limited"
          ],
          "contractPackage": "Programme sponsorship / oversight",
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 3
        },
        {
          "id": "BalfourBeattyGroupLtd",
          "label": "Balfour Beatty Group Ltd",
          "type": "Organization",
          "uri": "https://example.org/hs2/BalfourBeattyGroupLtd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "VINCIConstructionUKLtd",
          "label": "VINCI Construction UK Ltd",
          "type": "Organization",
          "uri": "https://example.org/hs2/VINCIConstructionUKLtd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "VINCIConstructionTerrassement",
          "label": "VINCI Construction Terrassement",
          "type": "Organization",
          "uri": "https://example.org/hs2/VINCIConstructionTerrassement",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "EiffageGenieCivil",
          "label": "Eiffage Génie Civil",
          "type": "Organization",
          "uri": "https://example.org/hs2/EiffageGenieCivil",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "KierInfrastructureAndOverseasLtd",
          "label": "Kier Infrastructure and Overseas Ltd",
          "type": "Organization",
          "uri": "https://example.org/hs2/KierInfrastructureAndOverseasLtd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "FerrovialAgroman",
          "label": "Ferrovial Agroman",
          "type": "Organization",
          "uri": "https://example.org/hs2/FerrovialAgroman",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "BAMNuttall",
          "label": "BAM Nuttall",
          "type": "Organization",
          "uri": "https://example.org/hs2/BAMNuttall",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "BouyguesTravauxPublics",
          "label": "Bouygues Travaux Publics",
          "type": "Organization",
          "uri": "https://example.org/hs2/BouyguesTravauxPublics",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "VolkerFitzpatrickLimited",
          "label": "VolkerFitzpatrick Limited",
          "type": "Organization",
          "uri": "https://example.org/hs2/VolkerFitzpatrickLimited",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "SirRobertMcAlpineLtd",
          "label": "Sir Robert McAlpine Ltd",
          "type": "Organization",
          "uri": "https://example.org/hs2/SirRobertMcAlpineLtd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "SkanskaConstructionUKLtd",
          "label": "Skanska Construction (UK) Ltd",
          "type": "Organization",
          "uri": "https://example.org/hs2/SkanskaConstructionUKLtd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "CostainLtd",
          "label": "Costain Ltd",
          "type": "Organization",
          "uri": "https://example.org/hs2/CostainLtd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.costain.com/media/press-releases/2024/siemens-mobility-and-costain-joint-venture-wins-hs2-high-voltage-rail-systems-power-supply-contract/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "STRABAGAG",
          "label": "STRABAG AG",
          "type": "Organization",
          "uri": "https://example.org/hs2/STRABAGAG",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "MaceLimited",
          "label": "Mace Limited",
          "type": "Organization",
          "uri": "https://example.org/hs2/MaceLimited",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/government-support-for-hs2-delivers-landmark-euston-station-contracts"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "DragadosSA",
          "label": "Dragados S.A.",
          "type": "Organization",
          "uri": "https://example.org/hs2/DragadosSA",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/government-support-for-hs2-delivers-landmark-euston-station-contracts"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "LaingORourkeDeliveryLimited",
          "label": "Laing O'Rourke Delivery Limited",
          "type": "Organization",
          "uri": "https://example.org/hs2/LaingORourkeDeliveryLimited",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "JacobsUKLimited",
          "label": "Jacobs UK Limited",
          "type": "Organization",
          "uri": "https://example.org/hs2/JacobsUKLimited",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/hs2-ltd-appoints-phase-one-engineering-delivery-partners"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "AtkinsLimited",
          "label": "Atkins Limited",
          "type": "Organization",
          "uri": "https://example.org/hs2/AtkinsLimited",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/hs2-ltd-appoints-phase-one-engineering-delivery-partners"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "SENEREngineeringAndSystemsLtd",
          "label": "SENER Engineering and Systems Ltd",
          "type": "Organization",
          "uri": "https://example.org/hs2/SENEREngineeringAndSystemsLtd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/hs2-ltd-appoints-phase-one-engineering-delivery-partners"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "SiemensMobilityLimited",
          "label": "Siemens Mobility Limited",
          "type": "Organization",
          "uri": "https://example.org/hs2/SiemensMobilityLimited",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.contractsfinder.service.gov.uk/notice/b95ea6c5-b800-4cbe-877d-2802894989b4"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 3
        },
        {
          "id": "AccentureUKLimited",
          "label": "Accenture (UK) Limited",
          "type": "Organization",
          "uri": "https://example.org/hs2/AccentureUKLimited",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "DeloitteLLP",
          "label": "Deloitte LLP",
          "type": "Organization",
          "uri": "https://example.org/hs2/DeloitteLLP",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "ErnstYoungLLP",
          "label": "Ernst & Young LLP (EY)",
          "type": "Organization",
          "uri": "https://example.org/hs2/ErnstYoungLLP",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "PwCLLP",
          "label": "PricewaterhouseCoopers LLP (PwC)",
          "type": "Organization",
          "uri": "https://example.org/hs2/PwCLLP",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "OveArupInternational",
          "label": "Ove Arup International",
          "type": "Organization",
          "uri": "https://example.org/hs2/OveArupInternational",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "Gleeds",
          "label": "Gleeds",
          "type": "Organization",
          "uri": "https://example.org/hs2/Gleeds",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 2
        },
        {
          "id": "HitachiRailLtd",
          "label": "Hitachi Rail Ltd",
          "type": "Organization",
          "uri": "https://example.org/hs2/HitachiRailLtd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/government-awards-hs2-rolling-stock-contract"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "BombardierTransportationUKLtd",
          "label": "Bombardier Transportation UK Ltd (Alstom)",
          "type": "Organization",
          "uri": "https://example.org/hs2/BombardierTransportationUKLtd",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/government-awards-hs2-rolling-stock-contract"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 1
        },
        {
          "id": "AtkinsGlobal",
          "label": "Atkins Global",
          "type": "Organization",
          "uri": "https://example.org/hs2/AtkinsGlobal",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Organization",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 3
        },
        {
          "id": "BBV_JV",
          "label": "BBV (Balfour Beatty VINCI) Joint Venture",
          "type": "DeliveryTeam",
          "uri": "https://example.org/hs2/BBV_JV",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#DeliveryTeam",
          "description": "Main Works Civils contractor team for HS2 Phase One (Area North).",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 6
        },
        {
          "id": "EKFB_JV",
          "label": "EKFB (Eiffage Kier Ferrovial BAM) Joint Venture",
          "type": "DeliveryTeam",
          "uri": "https://example.org/hs2/EKFB_JV",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#DeliveryTeam",
          "description": "Main Works Civils contractor team for HS2 Phase One (Area Central).",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 7
        },
        {
          "id": "SCS_JV",
          "label": "SCS (Skanska Costain STRABAG) Joint Venture",
          "type": "DeliveryTeam",
          "uri": "https://example.org/hs2/SCS_JV",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#DeliveryTeam",
          "description": "Main Works Civils contractor team for HS2 Phase One (Area South).",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 6
        },
        {
          "id": "Align_JV",
          "label": "Align Joint Venture",
          "type": "DeliveryTeam",
          "uri": "https://example.org/hs2/Align_JV",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#DeliveryTeam",
          "description": "Works on the Chiltern tunnels and Colne Valley viaduct for HS2 Phase One.",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 6
        },
        {
          "id": "MaceDragados_JV",
          "label": "Mace / Dragados Joint Venture",
          "type": "DeliveryTeam",
          "uri": "https://example.org/hs2/MaceDragados_JV",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#DeliveryTeam",
          "description": "Station construction partner team (e.g., Euston and Birmingham Curzon Street).",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/government-support-for-hs2-delivers-landmark-euston-station-contracts"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 6
        },
        {
          "id": "EngineeringDeliveryPartner_Team",
          "label": "Engineering Delivery Partner (EDP) Team",
          "type": "DeliveryTeam",
          "uri": "https://example.org/hs2/EngineeringDeliveryPartner_Team",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#DeliveryTeam",
          "description": "Engineering Delivery Partner for HS2 Phase One.",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/hs2-ltd-appoints-phase-one-engineering-delivery-partners"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 6
        },
        {
          "id": "HitachiAlstomHighSpeedJV",
          "label": "Hitachi-Alstom High Speed Joint Venture (HAH-S)",
          "type": "DeliveryTeam",
          "uri": "https://example.org/hs2/HitachiAlstomHighSpeedJV",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#DeliveryTeam",
          "description": "Rolling stock manufacture and maintenance joint venture for HS2.",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/government-awards-hs2-rolling-stock-contract",
            "https://www.alstom.com/press-releases-news/2021/12/hitachi-and-alstom-win-order-build-and-maintain-high-speed-two-trains-britain"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 5
        },
        {
          "id": "SMCRailPowerJV",
          "label": "SMC Rail Power Joint Venture",
          "type": "DeliveryTeam",
          "uri": "https://example.org/hs2/SMCRailPowerJV",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#DeliveryTeam",
          "description": "Joint venture delivering HS2 high-voltage rail power supply systems.",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.costain.com/media/press-releases/2024/siemens-mobility-and-costain-joint-venture-wins-hs2-high-voltage-rail-systems-power-supply-contract/"
          ],
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 5
        },
        {
          "id": "Role_BBV_JV_Vendor",
          "label": "BBV (Balfour Beatty VINCI) Joint Venture: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_BBV_JV_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_EKFB_JV_Vendor",
          "label": "EKFB (Eiffage Kier Ferrovial BAM) Joint Venture: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_EKFB_JV_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_SCS_JV_Vendor",
          "label": "SCS (Skanska Costain STRABAG) Joint Venture: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_SCS_JV_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_Align_JV_Vendor",
          "label": "Align Joint Venture: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_Align_JV_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_MaceDragados_JV_Vendor",
          "label": "Mace / Dragados Joint Venture: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_MaceDragados_JV_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_EngineeringDeliveryPartner_Team_Vendor",
          "label": "Engineering Delivery Partner (EDP) Team: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_EngineeringDeliveryPartner_Team_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_HitachiAlstomHighSpeedJV_Vendor",
          "label": "Hitachi-Alstom High Speed Joint Venture (HAH-S): Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_HitachiAlstomHighSpeedJV_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_SMCRailPowerJV_Vendor",
          "label": "SMC Rail Power Joint Venture: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_SMCRailPowerJV_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_SiemensMobilityLimited_Vendor",
          "label": "Siemens Mobility Limited: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_SiemensMobilityLimited_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_AccentureUKLimited_Vendor",
          "label": "Accenture (UK) Limited: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_AccentureUKLimited_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_LaingORourkeDeliveryLimited_Vendor",
          "label": "Laing O'Rourke Delivery Limited: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_LaingORourkeDeliveryLimited_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_DeloitteLLP_Vendor",
          "label": "Deloitte LLP: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_DeloitteLLP_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_ErnstYoungLLP_Vendor",
          "label": "Ernst & Young LLP (EY): Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_ErnstYoungLLP_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_PwCLLP_Vendor",
          "label": "PricewaterhouseCoopers LLP (PwC): Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_PwCLLP_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_OveArupInternational_Vendor",
          "label": "Ove Arup International: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_OveArupInternational_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_AtkinsGlobal_Vendor",
          "label": "Atkins Global: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_AtkinsGlobal_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Role_Gleeds_Vendor",
          "label": "Gleeds: Vendor/Supplier role",
          "type": "Role",
          "uri": "https://example.org/hs2/Role_Gleeds_Vendor",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#VendorRole",
          "evidenceStatus": "Editorial role assignment, not an official role register.",
          "degree": 1
        },
        {
          "id": "Appt_HS2Ltd_to_EKFB_MWCC2554",
          "label": "Appointment: HS2 Ltd → EKFB JV (MWCC Area Central)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_EKFB_MWCC2554",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "contractPackage": "Main Works Civils – Area Central",
          "award": "Q3 2017",
          "refId": "MWCC2554",
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_Align_MWCC2555",
          "label": "Appointment: HS2 Ltd → Align JV (MWCC Chiltern Tunnels & Colne Valley Viaduct)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_Align_MWCC2555",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Main Works Civils – Chiltern Tunnel & Colne Valley Viaduct",
          "award": "Q3 2017",
          "refId": "MWCC2553",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "refId": "MWCC2555"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_BBV_MWCC2556",
          "label": "Appointment: HS2 Ltd → BBV JV (MWCC Area North)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_BBV_MWCC2556",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "contractPackage": "Main Works Civils – Area North",
          "award": "Q3 2017",
          "refId": "MWCC2556",
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_SCS_MWCC2557",
          "label": "Appointment: HS2 Ltd → SCS JV (MWCC Area South)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_SCS_MWCC2557",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Main Works Civils – Area South",
          "award": "Q3 2017",
          "refId": "MWCC2551",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "refId": "MWCC2557"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_MaceDragados_Euston_CPC2163",
          "label": "Appointment: HS2 Ltd → Mace/Dragados JV (Euston Station, London)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_MaceDragados_Euston_CPC2163",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/government-support-for-hs2-delivers-landmark-euston-station-contracts"
          ],
          "contractPackage": "Euston Station (London) – Station construction partner",
          "award": "Q1 2019",
          "refId": "CPC2163 - P1 CPC Lot 1",
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_MaceDragados_Curzon_C1000_2191",
          "label": "Appointment: HS2 Ltd → Mace/Dragados JV (Birmingham Curzon Street Station)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_MaceDragados_Curzon_C1000_2191",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "contractPackage": "Birmingham Curzon Street Station – Station construction",
          "award": "Q2 2021",
          "refId": "C1000_2191",
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_LaingORourke_Interchange_1458",
          "label": "Appointment: HS2 Ltd → Laing O'Rourke (Birmingham Interchange Station)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_LaingORourke_Interchange_1458",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/"
          ],
          "contractPackage": "Birmingham Interchange Station – Station construction",
          "award": "Q3 2022",
          "refId": "HS2 Project_1458",
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_EDP_Ref369",
          "label": "Appointment: HS2 Ltd → Engineering Delivery Partner team (Phase One)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_EDP_Ref369",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/hs2-ltd-appoints-phase-one-engineering-delivery-partners"
          ],
          "contractPackage": "Engineering Delivery Partner (EDP) – Phase One",
          "award": "Q1 2016",
          "refId": "Phase One Ref 369",
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_Accenture_DigitalTwin_2286",
          "label": "Appointment: HS2 Ltd → Accenture (Digital Twin / Digital Engineering Delivery Partner)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_Accenture_DigitalTwin_2286",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Digital Twin / Digital Engineering Delivery Partner",
          "award": "Q3 2021",
          "refId": "2286",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "refId": "C1000_2286"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_Deloitte_ProgrammeAssurance_2649",
          "label": "Appointment: HS2 Ltd → Deloitte (Assurance Services, Lot 1)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_Deloitte_ProgrammeAssurance_2649",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Assurance Services – Lot 1 (Consultancy & Advisory Services)",
          "award": "Q3 2021",
          "refId": "2035",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "label": "Appointment: HS2 Ltd → Deloitte (Programme Assurance Framework, Lot 1)",
            "contractPackage": "Programme Assurance Framework – Lot 1",
            "award": "Q2 2020",
            "refId": "C1000_2649"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_EY_ProgrammeAssurance_2649",
          "label": "Appointment: HS2 Ltd → EY (Assurance Services, Lot 2)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_EY_ProgrammeAssurance_2649",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Assurance Services – Lot 2 (Corporate Assurance)",
          "award": "Q3 2021",
          "refId": "2035",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "label": "Appointment: HS2 Ltd → EY (Programme Assurance Framework, Lot 2)",
            "contractPackage": "Programme Assurance Framework – Lot 2",
            "award": "Q2 2020",
            "refId": "C1000_2649"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_PwC_ProgrammeAssurance_2649",
          "label": "Appointment: HS2 Ltd → PwC (Assurance Services, Lot 3)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_PwC_ProgrammeAssurance_2649",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Assurance Services – Lot 3 (Programme Assurance)",
          "award": "Q3 2021",
          "refId": "2035",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "label": "Appointment: HS2 Ltd → PwC (Programme Assurance Framework, Lot 3)",
            "contractPackage": "Programme Assurance Framework – Lot 3",
            "award": "Q2 2020",
            "refId": "C1000_2649"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_Arup_BESC_1869",
          "label": "Appointment: HS2 Ltd → Arup (Built Environment Support Contract, Lot A)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_Arup_BESC_1869",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Built Environment Support Contract – Lot A",
          "award": "Q3 2017",
          "refId": "HS2_751",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "refId": "C1000_1869"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_AtkinsGlobal_BESC_1869",
          "label": "Appointment: HS2 Ltd → Atkins Global (Built Environment Support Contract, Lot B)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_AtkinsGlobal_BESC_1869",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Built Environment Support Contract – Lot B",
          "award": "Q3 2017",
          "refId": "HS2_751",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "refId": "C1000_1869"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_Atkins_CommercialControls_2634",
          "label": "Appointment: HS2 Ltd → Atkins (Commercial Delivery & Controls Framework, Lot 1)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_Atkins_CommercialControls_2634",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Commercial Delivery & Controls Framework – Lot 1",
          "award": "Q3 2020",
          "refId": "C1000_2824 & C1000_2823 (framework listing; lot-specific allocation not asserted)",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "refId": "C1000_2634"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_Gleeds_CommercialControls_2634",
          "label": "Appointment: HS2 Ltd → Gleeds (Commercial Delivery & Controls Framework, Lot 2)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_Gleeds_CommercialControls_2634",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Commercial Delivery & Controls Framework – Lot 2",
          "award": "Q3 2020",
          "refId": "C1000_2824 & C1000_2823 (framework listing; lot-specific allocation not asserted)",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "refId": "C1000_2634"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_HitachiAlstom_RollingStock_917",
          "label": "Appointment: HS2 Ltd → Hitachi-Alstom High Speed JV (Rolling stock)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_HitachiAlstom_RollingStock_917",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.gov.uk/government/news/government-awards-hs2-rolling-stock-contract",
            "https://www.alstom.com/press-releases-news/2021/12/hitachi-and-alstom-win-order-build-and-maintain-high-speed-two-trains-britain"
          ],
          "contractPackage": "Rolling stock manufacture & maintenance (HS2 trains)",
          "award": "Q4 2021",
          "refId": "HS2 Project_917",
          "evidenceStatus": "Retained from the 4 February 2026 editorial snapshot; not individually reverified.",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_Siemens_CCS_TM",
          "label": "Appointment: HS2 Ltd → Siemens Mobility (Control, Command, Signalling & Traffic Management)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_Siemens_CCS_TM",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.contractsfinder.service.gov.uk/notice/b95ea6c5-b800-4cbe-877d-2802894989b4",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Railway Systems – Control, Command & Signalling (CCS) and Traffic Management",
          "award": "Q4 2024",
          "refId": "HS2 Project 2030",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "refId": "Contract Finder notice b95ea6c5-b800-4cbe-877d-2802894989b4",
            "award": "Q4 2024 (award year)"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        },
        {
          "id": "Appt_HS2Ltd_to_SMC_HVPower",
          "label": "Appointment: HS2 Ltd → SMC Rail Power JV (High Voltage Power System)",
          "type": "Appointment",
          "uri": "https://example.org/hs2/Appt_HS2Ltd_to_SMC_HVPower",
          "rdfType": "https://w3id.org/digitalconstruction/0.5/Agents#Appointment",
          "sources": [
            "https://www.hs2.org.uk/supply-chain/direct-contract-opportunities/",
            "https://www.costain.com/media/press-releases/2024/siemens-mobility-and-costain-joint-venture-wins-hs2-high-voltage-rail-systems-power-supply-contract/",
            "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/"
          ],
          "contractPackage": "Railway Systems – High Voltage (HV) Power System",
          "award": "Q4 2024",
          "refId": "HS2 Project 2056",
          "evidenceStatus": "Selected package/reference fields corrected against HS2 supplier listing, 3 October 2026; stable ID retains the old reference.",
          "legacy": {
            "refId": "HS2 HV Power System contract (press release 19 Dec 2024)"
          },
          "correctionSource": "https://www.hs2.org.uk/suppliers/direct-contract-opportunities/",
          "degree": 3
        }
      ],
      "links": [
        {
          "source": "HeidiAlexander",
          "target": "DepartmentForTransport",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#isOrganizationPartOf",
          "label": "isOrganizationPartOf",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-1"
        },
        {
          "source": "MarkWild",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#isOrganizationPartOf",
          "label": "isOrganizationPartOf",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-2"
        },
        {
          "source": "MikeBrown",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#isOrganizationPartOf",
          "label": "isOrganizationPartOf",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-3"
        },
        {
          "source": "DepartmentForTransport",
          "target": "Role_DfT_ProjectOwner",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-4"
        },
        {
          "source": "HS2Ltd",
          "target": "Role_HS2Ltd_ProjectLeader",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-5"
        },
        {
          "source": "HeidiAlexander",
          "target": "Role_HeidiAlexander_ProjectOwner",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-6"
        },
        {
          "source": "MarkWild",
          "target": "Role_MarkWild_ProjectLeader",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-7"
        },
        {
          "source": "MikeBrown",
          "target": "Role_MikeBrown_ProjectLeader",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-8"
        },
        {
          "source": "OfficeOfRailAndRoad",
          "target": "Role_ORR_Stakeholder",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-9"
        },
        {
          "source": "HealthAndSafetyExecutive",
          "target": "Role_HSE_Stakeholder",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-10"
        },
        {
          "source": "NationalAuditOffice",
          "target": "Role_NAO_Stakeholder",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-11"
        },
        {
          "source": "IndependentHS2Commissioner",
          "target": "Role_Commissioner_Stakeholder",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-12"
        },
        {
          "source": "HS2Programme",
          "target": "DepartmentForTransport",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAgent",
          "label": "hasAgent",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-13"
        },
        {
          "source": "HS2Programme",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAgent",
          "label": "hasAgent",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-14"
        },
        {
          "source": "HS2Programme",
          "target": "OfficeOfRailAndRoad",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAgent",
          "label": "hasAgent",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-15"
        },
        {
          "source": "HS2Programme",
          "target": "HealthAndSafetyExecutive",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAgent",
          "label": "hasAgent",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-16"
        },
        {
          "source": "HS2Programme",
          "target": "NationalAuditOffice",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAgent",
          "label": "hasAgent",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-17"
        },
        {
          "source": "HS2Programme",
          "target": "IndependentHS2Commissioner",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAgent",
          "label": "hasAgent",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-18"
        },
        {
          "source": "Appt_DfT_to_HS2Ltd",
          "target": "DepartmentForTransport",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-19"
        },
        {
          "source": "Appt_DfT_to_HS2Ltd",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-20"
        },
        {
          "source": "Appt_DfT_to_HS2Ltd",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-21"
        },
        {
          "source": "BBV_JV",
          "target": "BalfourBeattyGroupLtd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-22"
        },
        {
          "source": "BBV_JV",
          "target": "VINCIConstructionUKLtd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-23"
        },
        {
          "source": "BBV_JV",
          "target": "VINCIConstructionTerrassement",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-24"
        },
        {
          "source": "HS2Programme",
          "target": "BBV_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasProjectTeam",
          "label": "hasProjectTeam",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-25"
        },
        {
          "source": "EKFB_JV",
          "target": "EiffageGenieCivil",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-26"
        },
        {
          "source": "EKFB_JV",
          "target": "KierInfrastructureAndOverseasLtd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-27"
        },
        {
          "source": "EKFB_JV",
          "target": "FerrovialAgroman",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-28"
        },
        {
          "source": "EKFB_JV",
          "target": "BAMNuttall",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-29"
        },
        {
          "source": "HS2Programme",
          "target": "EKFB_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasProjectTeam",
          "label": "hasProjectTeam",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-30"
        },
        {
          "source": "SCS_JV",
          "target": "SkanskaConstructionUKLtd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-31"
        },
        {
          "source": "SCS_JV",
          "target": "CostainLtd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-32"
        },
        {
          "source": "SCS_JV",
          "target": "STRABAGAG",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-33"
        },
        {
          "source": "HS2Programme",
          "target": "SCS_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasProjectTeam",
          "label": "hasProjectTeam",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-34"
        },
        {
          "source": "Align_JV",
          "target": "BouyguesTravauxPublics",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-35"
        },
        {
          "source": "Align_JV",
          "target": "VolkerFitzpatrickLimited",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-36"
        },
        {
          "source": "Align_JV",
          "target": "SirRobertMcAlpineLtd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-37"
        },
        {
          "source": "HS2Programme",
          "target": "Align_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasProjectTeam",
          "label": "hasProjectTeam",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-38"
        },
        {
          "source": "MaceDragados_JV",
          "target": "MaceLimited",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-39"
        },
        {
          "source": "MaceDragados_JV",
          "target": "DragadosSA",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-40"
        },
        {
          "source": "HS2Programme",
          "target": "MaceDragados_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasProjectTeam",
          "label": "hasProjectTeam",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-41"
        },
        {
          "source": "EngineeringDeliveryPartner_Team",
          "target": "JacobsUKLimited",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-42"
        },
        {
          "source": "EngineeringDeliveryPartner_Team",
          "target": "AtkinsLimited",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-43"
        },
        {
          "source": "EngineeringDeliveryPartner_Team",
          "target": "SENEREngineeringAndSystemsLtd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-44"
        },
        {
          "source": "HS2Programme",
          "target": "EngineeringDeliveryPartner_Team",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasProjectTeam",
          "label": "hasProjectTeam",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-45"
        },
        {
          "source": "HitachiAlstomHighSpeedJV",
          "target": "HitachiRailLtd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-46"
        },
        {
          "source": "HitachiAlstomHighSpeedJV",
          "target": "BombardierTransportationUKLtd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-47"
        },
        {
          "source": "HS2Programme",
          "target": "HitachiAlstomHighSpeedJV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasProjectTeam",
          "label": "hasProjectTeam",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-48"
        },
        {
          "source": "SMCRailPowerJV",
          "target": "SiemensMobilityLimited",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-49"
        },
        {
          "source": "SMCRailPowerJV",
          "target": "CostainLtd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasOrganizationPart",
          "label": "hasOrganizationPart",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-50"
        },
        {
          "source": "HS2Programme",
          "target": "SMCRailPowerJV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasProjectTeam",
          "label": "hasProjectTeam",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-51"
        },
        {
          "source": "BBV_JV",
          "target": "Role_BBV_JV_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-52"
        },
        {
          "source": "EKFB_JV",
          "target": "Role_EKFB_JV_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-53"
        },
        {
          "source": "SCS_JV",
          "target": "Role_SCS_JV_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-54"
        },
        {
          "source": "Align_JV",
          "target": "Role_Align_JV_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-55"
        },
        {
          "source": "MaceDragados_JV",
          "target": "Role_MaceDragados_JV_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-56"
        },
        {
          "source": "EngineeringDeliveryPartner_Team",
          "target": "Role_EngineeringDeliveryPartner_Team_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-57"
        },
        {
          "source": "HitachiAlstomHighSpeedJV",
          "target": "Role_HitachiAlstomHighSpeedJV_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-58"
        },
        {
          "source": "SMCRailPowerJV",
          "target": "Role_SMCRailPowerJV_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-59"
        },
        {
          "source": "SiemensMobilityLimited",
          "target": "Role_SiemensMobilityLimited_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-60"
        },
        {
          "source": "AccentureUKLimited",
          "target": "Role_AccentureUKLimited_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-61"
        },
        {
          "source": "LaingORourkeDeliveryLimited",
          "target": "Role_LaingORourkeDeliveryLimited_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-62"
        },
        {
          "source": "DeloitteLLP",
          "target": "Role_DeloitteLLP_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-63"
        },
        {
          "source": "ErnstYoungLLP",
          "target": "Role_ErnstYoungLLP_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-64"
        },
        {
          "source": "PwCLLP",
          "target": "Role_PwCLLP_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-65"
        },
        {
          "source": "OveArupInternational",
          "target": "Role_OveArupInternational_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-66"
        },
        {
          "source": "AtkinsGlobal",
          "target": "Role_AtkinsGlobal_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-67"
        },
        {
          "source": "Gleeds",
          "target": "Role_Gleeds_Vendor",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Entities#hasRole",
          "label": "hasRole",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-68"
        },
        {
          "source": "Appt_HS2Ltd_to_EKFB_MWCC2554",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-69"
        },
        {
          "source": "Appt_HS2Ltd_to_EKFB_MWCC2554",
          "target": "EKFB_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-70"
        },
        {
          "source": "Appt_HS2Ltd_to_EKFB_MWCC2554",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-71"
        },
        {
          "source": "Appt_HS2Ltd_to_Align_MWCC2555",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-72"
        },
        {
          "source": "Appt_HS2Ltd_to_Align_MWCC2555",
          "target": "Align_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-73"
        },
        {
          "source": "Appt_HS2Ltd_to_Align_MWCC2555",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-74"
        },
        {
          "source": "Appt_HS2Ltd_to_BBV_MWCC2556",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-75"
        },
        {
          "source": "Appt_HS2Ltd_to_BBV_MWCC2556",
          "target": "BBV_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-76"
        },
        {
          "source": "Appt_HS2Ltd_to_BBV_MWCC2556",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-77"
        },
        {
          "source": "Appt_HS2Ltd_to_SCS_MWCC2557",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-78"
        },
        {
          "source": "Appt_HS2Ltd_to_SCS_MWCC2557",
          "target": "SCS_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-79"
        },
        {
          "source": "Appt_HS2Ltd_to_SCS_MWCC2557",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-80"
        },
        {
          "source": "Appt_HS2Ltd_to_MaceDragados_Euston_CPC2163",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-81"
        },
        {
          "source": "Appt_HS2Ltd_to_MaceDragados_Euston_CPC2163",
          "target": "MaceDragados_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-82"
        },
        {
          "source": "Appt_HS2Ltd_to_MaceDragados_Euston_CPC2163",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-83"
        },
        {
          "source": "Appt_HS2Ltd_to_MaceDragados_Curzon_C1000_2191",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-84"
        },
        {
          "source": "Appt_HS2Ltd_to_MaceDragados_Curzon_C1000_2191",
          "target": "MaceDragados_JV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-85"
        },
        {
          "source": "Appt_HS2Ltd_to_MaceDragados_Curzon_C1000_2191",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-86"
        },
        {
          "source": "Appt_HS2Ltd_to_LaingORourke_Interchange_1458",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-87"
        },
        {
          "source": "Appt_HS2Ltd_to_LaingORourke_Interchange_1458",
          "target": "LaingORourkeDeliveryLimited",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-88"
        },
        {
          "source": "Appt_HS2Ltd_to_LaingORourke_Interchange_1458",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-89"
        },
        {
          "source": "Appt_HS2Ltd_to_EDP_Ref369",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-90"
        },
        {
          "source": "Appt_HS2Ltd_to_EDP_Ref369",
          "target": "EngineeringDeliveryPartner_Team",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-91"
        },
        {
          "source": "Appt_HS2Ltd_to_EDP_Ref369",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-92"
        },
        {
          "source": "Appt_HS2Ltd_to_Accenture_DigitalTwin_2286",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-93"
        },
        {
          "source": "Appt_HS2Ltd_to_Accenture_DigitalTwin_2286",
          "target": "AccentureUKLimited",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-94"
        },
        {
          "source": "Appt_HS2Ltd_to_Accenture_DigitalTwin_2286",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-95"
        },
        {
          "source": "Appt_HS2Ltd_to_Deloitte_ProgrammeAssurance_2649",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-96"
        },
        {
          "source": "Appt_HS2Ltd_to_Deloitte_ProgrammeAssurance_2649",
          "target": "DeloitteLLP",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-97"
        },
        {
          "source": "Appt_HS2Ltd_to_Deloitte_ProgrammeAssurance_2649",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-98"
        },
        {
          "source": "Appt_HS2Ltd_to_EY_ProgrammeAssurance_2649",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-99"
        },
        {
          "source": "Appt_HS2Ltd_to_EY_ProgrammeAssurance_2649",
          "target": "ErnstYoungLLP",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-100"
        },
        {
          "source": "Appt_HS2Ltd_to_EY_ProgrammeAssurance_2649",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-101"
        },
        {
          "source": "Appt_HS2Ltd_to_PwC_ProgrammeAssurance_2649",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-102"
        },
        {
          "source": "Appt_HS2Ltd_to_PwC_ProgrammeAssurance_2649",
          "target": "PwCLLP",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-103"
        },
        {
          "source": "Appt_HS2Ltd_to_PwC_ProgrammeAssurance_2649",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-104"
        },
        {
          "source": "Appt_HS2Ltd_to_Arup_BESC_1869",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-105"
        },
        {
          "source": "Appt_HS2Ltd_to_Arup_BESC_1869",
          "target": "OveArupInternational",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-106"
        },
        {
          "source": "Appt_HS2Ltd_to_Arup_BESC_1869",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-107"
        },
        {
          "source": "Appt_HS2Ltd_to_AtkinsGlobal_BESC_1869",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-108"
        },
        {
          "source": "Appt_HS2Ltd_to_AtkinsGlobal_BESC_1869",
          "target": "AtkinsGlobal",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-109"
        },
        {
          "source": "Appt_HS2Ltd_to_AtkinsGlobal_BESC_1869",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-110"
        },
        {
          "source": "Appt_HS2Ltd_to_Atkins_CommercialControls_2634",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-111"
        },
        {
          "source": "Appt_HS2Ltd_to_Atkins_CommercialControls_2634",
          "target": "AtkinsGlobal",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-112"
        },
        {
          "source": "Appt_HS2Ltd_to_Atkins_CommercialControls_2634",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-113"
        },
        {
          "source": "Appt_HS2Ltd_to_Gleeds_CommercialControls_2634",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-114"
        },
        {
          "source": "Appt_HS2Ltd_to_Gleeds_CommercialControls_2634",
          "target": "Gleeds",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-115"
        },
        {
          "source": "Appt_HS2Ltd_to_Gleeds_CommercialControls_2634",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-116"
        },
        {
          "source": "Appt_HS2Ltd_to_HitachiAlstom_RollingStock_917",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-117"
        },
        {
          "source": "Appt_HS2Ltd_to_HitachiAlstom_RollingStock_917",
          "target": "HitachiAlstomHighSpeedJV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-118"
        },
        {
          "source": "Appt_HS2Ltd_to_HitachiAlstom_RollingStock_917",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-119"
        },
        {
          "source": "Appt_HS2Ltd_to_Siemens_CCS_TM",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-120"
        },
        {
          "source": "Appt_HS2Ltd_to_Siemens_CCS_TM",
          "target": "SiemensMobilityLimited",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-121"
        },
        {
          "source": "Appt_HS2Ltd_to_Siemens_CCS_TM",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-122"
        },
        {
          "source": "Appt_HS2Ltd_to_SMC_HVPower",
          "target": "HS2Ltd",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointingParty",
          "label": "hasAppointingParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-123"
        },
        {
          "source": "Appt_HS2Ltd_to_SMC_HVPower",
          "target": "SMCRailPowerJV",
          "predicate": "https://w3id.org/digitalconstruction/0.5/Agents#hasAppointedParty",
          "label": "hasAppointedParty",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-124"
        },
        {
          "source": "Appt_HS2Ltd_to_SMC_HVPower",
          "target": "HS2Programme",
          "predicate": "https://example.org/hs2/forProject",
          "label": "https://example.org/hs2/forProject",
          "kind": "model",
          "rationale": "Editorial modelling of the retained 4 February 2026 snapshot. Sources are attached to the nodes; formal role assignments have not been independently established.",
          "id": "hs2-edge-125"
        }
      ],
      "id": "hs2",
      "title": "HS2 roles and appointments",
      "summary": "Inspect a project, its agents, the roles they bear and the appointments between organisations. An appointment is a node with two parties and package metadata, not just an arrow.",
      "boundary": "An editorial snapshot originally generated 4 February 2026, with selected contract metadata corrected on 3 October 2026. It is a teaching model, not an official register or a live statement of personnel or contracts. Role assignments and appointment modelling are interpretations. The example.org identifiers belong to this example.",
      "source": {
        "file": "hs2_stakeholders_network.html",
        "url": "https://github.com/lawrencerowland/Project-web-apps/blob/cd0528939fd0e1f5de1df7cda9930785349e4946/web_apps/hs2_stakeholders_network.html",
        "sha256": "54f38cc7c70954eb6e481148e5d1ea582e41bb2c7626951b9d81806d6357f3a1"
      },
      "prefixes": {
        "hs2": "https://example.org/hs2/",
        "dica": "https://w3id.org/digitalconstruction/0.5/Agents#",
        "dice": "https://w3id.org/digitalconstruction/0.5/Entities#",
        "dicp": "https://w3id.org/digitalconstruction/0.5/Processes#",
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "foaf": "http://xmlns.com/foaf/0.1/",
        "dcterms": "http://purl.org/dc/terms/"
      },
      "readings": [
        {
          "title": "Distinguish an agent from its role",
          "start": "HS2Ltd",
          "text": "HS2 Ltd is an organisation. Its ProjectLeaderRole is a separate node. The inspector lists only hasRole targets as roles, then all other connections separately."
        },
        {
          "title": "Follow a contract appointment",
          "start": "Appt_HS2Ltd_to_Align_MWCC2555",
          "text": "The appointment joins an appointing party, an appointed party and the programme. The original identifier is retained; the corrected reference field is MWCC2553."
        },
        {
          "title": "Inspect a delivery team",
          "start": "EKFB_JV",
          "text": "A joint venture connects to members, the project and a vendor role. Placement and line count do not measure power, accountability or influence."
        }
      ],
      "corrections": [
        "All 93 nodes and 125 connections survive, including the 20 appointment nodes and their package, award and reference fields.",
        "Twelve appointments have selected metadata corrections against the HS2 supplier listing; original values are preserved in each inspector and JSON. Identifiers remain stable and must not be read as current reference fields.",
        "Graph, JSON, Turtle and searchable triples are generated from one dataset. Metadata, sources, snapshot date and corrections travel with the RDF.",
        "Roles are selected strictly by hasRole and the selected source node; unrelated outgoing connections are not shown as roles."
      ]
    }
  }
};if(typeof module!=="undefined"&&module.exports)module.exports=data;else root.OntologyData=data;})(typeof globalThis!=="undefined"?globalThis:this);
