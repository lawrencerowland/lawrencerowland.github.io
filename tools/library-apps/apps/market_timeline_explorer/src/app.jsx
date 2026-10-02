import React, { useState, useMemo } from "react";
import "./App.css";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// --- Data ------------------------------------------------------------------
const slices = [
  {
    id: "2025Q2",
    label: "Q2 2025",
    winners: ["Accenture UKI", "Deloitte", "BAE AI"],
    stable: ["PA Consulting"],
    losers: ["WSP", "Mott MacDonald"],
    coalitions: ["Gov‑Big 4 compute‑sandbox"],
    summary:
      "Big‑4 firms bundle GenAI copilots into Project‑Management‑as‑a‑Service offerings; government sandbox privileges incumbents while legacy infra‑PM players lag."
  },
  {
    id: "2025Q3",
    label: "Q3 2025",
    winners: ["Monday.com/Asana‑OpenAI plugins", "Faculty (data‑ops)"],
    stable: ["Accenture UKI", "Deloitte"],
    losers: ["Tier‑2 QS firms"],
    coalitions: ["PMI Knowledge‑Hub on GenAI"],
    summary:
      "Low‑code SaaS vendors ride SME demand; boutique data‑ops monetise model‑tuning; mid‑market quantity‑surveyors lose share."
  },
  {
    id: "2025Q4",
    label: "Q4 2025",
    winners: ["Nvidia sovereign‑AI bidders", "BAE AI"],
    stable: ["Big‑4 consultancies"],
    losers: ["Freelance PM networks"],
    coalitions: ["Drafting alliances for EU‑AI Act lobbying"],
    summary:
      "Hardware OEMs court Westminster for sovereign stack deals; compliance uncertainty squeezes independent PM networks."
  },
  {
    id: "2026Q1",
    label: "Q1 2026",
    winners: ["AWS UK Regions", "Google Cloud UK"],
    stable: ["Nvidia sovereign‑AI bidders"],
    losers: ["On‑prem data centres"],
    coalitions: ["Growth‑Zone pilot consortia"],
    summary:
      "Hyperscalers secure long‑term public contracts; Growth‑Zone pilots pool demand; local data‑centres struggle to match elasticity."
  },
  {
    id: "2026Q2",
    label: "Q2 2026",
    winners: ["KPMG‑Microsoft Risk‑Tooling", "Accenture Safety‑Desk"],
    stable: ["AWS UK Regions"],
    losers: ["Independent PMO shops"],
    coalitions: ["Compute Mutual buying‑club"],
    summary:
      "Joint ventures race to certify high‑risk AI use‑cases; compute co‑ops emerge among mid‑cap manufacturers."
  },
  {
    id: "2026Q3",
    label: "Q3 2026",
    winners: ["Semiconductor brokers", "Accenture"],
    stable: ["KPMG‑Microsoft"],
    losers: ["Capital‑poor challengers"],
    coalitions: ["Compute Mutual expands"],
    summary:
      "Brokerage houses arbitrage GPU supply; cash‑strapped challengers shelve pilots pending hardware."
  },
  {
    id: "2026Q4",
    label: "Q4 2026 (AGI)",
    winners: ["UK‑AISI Stack", "EU‑Gaia‑Cloud", "US‑Frontier"],
    stable: [],
    losers: ["Services without privileged compute"],
    coalitions: ["Sovereign stacks cross‑licence safety‑protocols"],
    summary:
      "AGI arrival crystallises power around three sovereign compute stacks; everyone else pays rent."
  },
  {
    id: "2027Q1",
    label: "Q1 2027",
    winners: ["Big‑4 (post‑merger)", "Accenture‑UKI"],
    stable: ["Semiconductor brokers"],
    losers: ["Traditional scheduling software"],
    coalitions: ["PMI Agent‑Supervisor board"],
    summary:
      "Consolidation wave absorbs mid‑tier boutiques; PMI launches Agent‑Supervisor accreditation."
  },
  {
    id: "2027Q2",
    label: "Q2 2027",
    winners: ["ServiceNow Platform‑Orchestrator", "Jira‑Next"],
    stable: ["Big‑4"],
    losers: ["Body‑shopping IT staffing"],
    coalitions: ["Safety‑Assurance consortium"],
    summary:
      "Platform orchestrators license AGI, automating project micro‑tasks; staffing firms lose relevance."
  },
  {
    id: "2027Q3",
    label: "Q3 2027",
    winners: ["Palantir 'Iron Bridge'", "Accenture"],
    stable: ["ServiceNow"],
    losers: ["Body‑shopping IT staffing"],
    coalitions: ["Iron Bridge secure‑compute corridor"],
    summary:
      "Secure‑compute corridors appeal to defence primes; further pressure on commodity labour sourcing."
  },
  {
    id: "2027Q4",
    label: "Q4 2027",
    winners: ["Accenture 'Project‑Flight‑Control' desk"],
    stable: ["Government demand plateau"],
    losers: ["Chip rental brokers (peak rates)"],
    coalitions: ["Insurance‑funded Safety Assurance consortium"],
    summary:
      "Project portfolio desks monetise orchestration; chip rental rates peak and brokers hit ceiling."
  },
  {
    id: "2028Q1",
    label: "Q1 2028",
    winners: ["Private‑Equity roll‑ups", "Accenture‑backed niche shops"],
    stable: ["Accenture"],
    losers: ["Independent guilds"],
    coalitions: ["Open‑Agent Framework (OASIS)"],
    summary:
      "PE capital aggregates niche engineering PM; open agent framework seeds community‑driven standards."
  },
  {
    id: "2028Q2",
    label: "Q2 2028",
    winners: ["RegTech audit vendors"],
    stable: ["PE roll‑ups"],
    losers: ["Consultancies without compliance benches"],
    coalitions: ["OASIS expands certification"],
    summary:
      "AI‑Act enforcement monetises audit tooling; compliance‑lite consultancies concede market."
  },
  {
    id: "2028Q3",
    label: "Q3 2028",
    winners: ["Edge‑compute microgrids"],
    stable: ["RegTech"],
    losers: ["Late adopters"],
    coalitions: ["Regional energy‑compute co‑ops"],
    summary:
      "Microgrid edge compute moderates GPU scarcity; margins stabilise across project‑services."
  },
  {
    id: "2028Q4",
    label: "Q4 2028",
    winners: ["Quantum‑enhanced scheduling pilots"],
    stable: [],
    losers: ["Traditional PM platforms"],
    coalitions: ["UK‑Japan green‑compute alliance"],
    summary:
      "Quantum pilots demonstrate 25 % schedule compression; UK‑Japan pact shares green compute IP."
  },
  {
    id: "2029Q1",
    label: "Q1 2029",
    winners: ["Curation‑platforms"],
    stable: ["Quantum pilots"],
    losers: ["Compute brokers (over‑supplied)"],
    coalitions: ["Human‑in‑Command standards drafting"],
    summary:
      "Value shifts from execution to goal brokerage; compute rental gluts drive prices down."
  },
  {
    id: "2029Q2",
    label: "Q2 2029 (ASI)",
    winners: ["Universal open‑agency kernel"],
    stable: [],
    losers: ["Legacy hierarchies"],
    coalitions: ["Human‑in‑Command standards board"],
    summary:
      "ASI yields abundance; open agency kernel commoditises task execution and rattles existing hierarchies."
  },
  {
    id: "2029Q3",
    label: "Q3 2029",
    winners: ["Accenture‑UK Prime Integrator", "BAE‑Aegis Prime Integrator"],
    stable: ["Guild clouds"],
    losers: ["Compute monopolies"],
    coalitions: ["Prime integrators + guilds"],
    summary:
      "Market coalesces around two UK prime integrators; specialist guilds orbit them on demand."
  },
  {
    id: "2029Q4",
    label: "Q4 2029",
    winners: ["Cross‑jurisdiction arbitration services"],
    stable: ["Prime integrators"],
    losers: ["Traditional legal PM"],
    coalitions: ["Inter‑jurisdiction arbitration network"],
    summary:
      "Autonomous project disputes create demand for rapid arbitration; classical legal PM shrinks."
  },
  {
    id: "2030Q1",
    label: "Q1 2030",
    winners: ["Tokenised project‑capacity exchanges"],
    stable: ["Prime integrators"],
    losers: ["Hands‑on consultants"],
    coalitions: ["Digital asset regulators"],
    summary:
      "Token markets let firms trade capacity; consultants reposition as portfolio designers."
  },
  {
    id: "2030Q2",
    label: "Q2 2030",
    winners: ["ASI‑orchestrated Net‑Zero mega‑programmes"],
    stable: [],
    losers: ["Labour‑based PM"],
    coalitions: ["Public‑sector mission boards"],
    summary:
      "ASI coordinates public Net‑Zero projects; manual PM labour mostly displaced."
  },
  {
    id: "2030Q3",
    label: "Q3 2030",
    winners: ["Open‑standard coalition"],
    stable: ["Token exchanges"],
    losers: ["Proprietary protocol vendors"],
    coalitions: ["Project‑Intent Protocol v3 working group"],
    summary:
      "Industry finalises interoperable intent protocol; proprietary vendors scramble to open source."
  },
  {
    id: "2030Q4",
    label: "Q4 2030",
    winners: ["Orchestrators earning royalties on design IP"],
    stable: ["Open‑standard coalition"],
    losers: ["Monopoly rent seekers"],
    coalitions: ["Commons‑based peer‑production"],
    summary:
      "Abundance equilibrium reached; orchestration IP yields royalties while monopoly rents disappear."
  }
];

const transitions = [
  {
    from: "2025Q4",
    to: "2026Q1",
    label: "Reg‑quake",
    description: "EU‑AI Act compliance tiers kick in, reshaping cost curves and elevating hyperscalers."
  },
  {
    from: "2026Q3",
    to: "2026Q4",
    label: "Compute‑squeeze",
    description: "GPU scarcity peaks; sovereignty stacks gain decisive bargaining power."
  },
  {
    from: "2027Q2",
    to: "2027Q3",
    label: "Platform lock‑in",
    description: "Network effects entrench AGI‑licensed platforms, squeezing labour‑based service models."
  },
  {
    from: "2028Q1",
    to: "2028Q2",
    label: "Guild rebound",
    description: "Excess compute rents trigger co‑operative guild structures to share compliance cost."
  },
  {
    from: "2029Q2",
    to: "2029Q3",
    label: "Abundance inversion",
    description: "ASI oversupply flips compute scarcity; advantage migrates to integrators curating project intent."
  },
  {
    from: "2030Q3",
    to: "2030Q4",
    label: "Open‑standard flowering",
    description: "Industry‑wide protocol standard dissolves proprietary moats, fostering commons‑based production."
  }
];

// --- Components -------------------------------------------------------------
function Section({ title, list, badgeColor }) {
  if (!list || list.length === 0) return null;
  const colorClass =
    badgeColor === "green"
      ? "bg-green-100 text-green-800"
      : badgeColor === "blue"
      ? "bg-blue-100 text-blue-800"
      : badgeColor === "red"
      ? "bg-red-100 text-red-800"
      : "bg-purple-100 text-purple-800";
  return (
    <div className="space-y-1">
      <h3 className="font-semibold mb-1">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {list.map((item) => (
          <Badge key={item} className={colorClass}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function Timeline({ index, setIndex }) {
  return (
    <div className="overflow-x-auto pb-2 pt-1 border-t">
      <ul className="flex space-x-2 whitespace-nowrap">
        {slices.map((s, i) => (
          <li key={s.id}>
            <Button
              variant={i === index ? "secondary" : "outline"}
              size="sm"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              {s.label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MarketTimelineExplorer() {
  const [index, setIndex] = useState(0);
  const slice = slices[index];
  const transition = useMemo(() => {
    if (index === 0) return null;
    const prevId = slices[index - 1].id;
    return transitions.find((t) => t.from === prevId && t.to === slice.id);
  }, [index]);

  return (
    <div className="market-explorer p-6 max-w-5xl mx-auto space-y-4 font-sans">
      <h1>Project-services market: an imagined future</h1>
      <p role="note"><strong>Speculative scenario, originally framed in 2025.</strong> Every quarter below is an invented scenario, including dates that have now passed. Named firms, alliances, market gains, legislation effects, AGI in 2026 and ASI in 2029 are story assumptions, not reported events, verified forecasts or investment guidance.</p>
      <p>Explore who might gain or lose under this particular story. Use the arrows or select any quarter. The explorer does not assign probabilities or model alternative futures.</p>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous quarter"
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
          >
            <ChevronLeft />
          </Button>
          <CardTitle className="text-2xl">{slice.label}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next quarter"
            onClick={() => setIndex(Math.min(slices.length - 1, index + 1))}
            disabled={index === slices.length - 1}
          >
            <ChevronRight />
          </Button>
        </CardHeader>
        {transition && (
          <div className="mx-6 mt-2 bg-yellow-50 p-3 rounded-lg flex items-start gap-2 border border-yellow-200">
            <Sparkles className="mt-1 h-4 w-4" />
            <div>
              <p className="font-medium leading-tight">{transition.label}</p>
              <p className="text-sm leading-snug">{transition.description}</p>
            </div>
          </div>
        )}
        <CardContent className="space-y-4">
          <Section title="Hypothetical winners" list={slice.winners} badgeColor="green" />
          <Section title="Holding Steady" list={slice.stable} badgeColor="blue" />
          <Section title="Hypothetical losers" list={slice.losers} badgeColor="red" />
          <Section title="Imagined coalitions" list={slice.coalitions} badgeColor="purple" />
          <div className="prose max-w-none pt-2">
            <p>{slice.summary}</p>
          </div>
        </CardContent>
      </Card>
      <Timeline index={index} setIndex={setIndex} />
    </div>
  );
}

export default MarketTimelineExplorer;
