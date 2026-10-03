import { marketSlices, marketTransitions, geminiSnapshots, navigatorQuarters } from './narratives';

const sourceRecord = 'https://github.com/lawrencerowland/lawrencerowland.github.io/blob/master/tools/library-apps/apps/market_timeline_explorer/MIGRATION.md#sources-and-identity';
const quarterId = label => label.replace(/\s/g, '').replace(/Q([1-4])(\d{4})/, '$2Q$1');
export const archetypes = [
  ['Goliath Consulting', 'Major incumbent'],
  ['Nimble Associates', 'SME specialist'],
  ['CodeCrafters AI', 'Startup'],
  ['Independents', 'Freelancers'],
  ['Athena AGI', 'Proprietary AGI platform'],
];
export const stories = {
  market: {
    title: 'Market & coalitions',
    subtitle: '23 quarters · Q2 2025–Q4 2030',
    description: 'Follow a story about compute, coalitions and the balance of power. Real company names stand in for imagined market roles.',
    source: 'Market Timeline Explorer · ChatGPT o3 Pro in the original catalogue',
    sourceUrl: sourceRecord,
    lens: 'Named organisations and changing coalitions',
    construction: '23 authored quarterly snapshots and six transition explanations. The existing story remains intact, including its “holding steady” category.',
    plot: ['Compute scarcity', 'Sovereign stacks', 'Intent brokerage', 'Open commons'],
    plotStarts: [0, 6, 15, 21],
    periods: marketSlices.map(s => ({ ...s, label: s.label.replace(/\s*\((AGI|ASI)\)/, ''), assumption: s.id === '2026Q4' ? 'AGI assumed' : s.id === '2029Q2' ? 'ASI assumed' : null })),
    transitions: marketTransitions,
  },
  gemini: {
    title: 'Fictional archetypes',
    subtitle: '12 snapshots · Q3 2025–2030',
    description: 'Follow Goliath, Nimble, CodeCrafters and the independents through a platform-capture story. All five archetypes are fictional.',
    source: 'AI_timeline_from_Gemini_25 · Gemini Pro 2.5 in the original catalogue',
    sourceUrl: sourceRecord,
    lens: 'Scale, specialist expertise and proprietary platform access',
    construction: '12 authored snapshots. The “Uneven Plateau” covers Q3 2027–Q1 2029; the final snapshot covers 2030. These are not equally spaced quarters.',
    plot: ['Scale & expertise', 'Athena access', 'Two-tier market', 'Market dissolution'],
    plotStarts: [0, 5, 7, 10],
    periods: geminiSnapshots.map(s => ({
      id: quarterId(s.id.replace(/q(\d)-(\d{4})/, 'Q$1 $2')),
      label: s.quarter === 'Uneven Plateau' ? 'Q3 2027–Q1 2029' : s.quarter,
      title: s.quarter === 'Uneven Plateau' ? s.quarter : s.title,
      summary: s.subtitle,
      winners: s.winners,
      losers: s.losers,
      coalitions: Array.isArray(s.coalitions) ? s.coalitions : [s.coalitions],
      dynamics: [s.dynamic],
      assumption: s.shock ? s.shock.toUpperCase() + ' assumed' : null,
    })),
    transitions: [],
  },
  navigator: {
    title: 'Strategic questions',
    subtitle: '20 quarters · Q1 2026–Q4 2030',
    description: 'Use a quarterly story to question your firm’s assumptions about access, outcomes, trust and purpose. Each period keeps its three original prompts.',
    source: 'Project Services Navigator · Claude Opus 4 in the original catalogue',
    sourceUrl: sourceRecord,
    lens: 'Business-model choices under an assumed discontinuity',
    construction: '20 authored quarters, each retaining its phase, winners, losers, coalitions, three dynamics, transition force and three strategic questions.',
    plot: ['Billable hours', 'AGI access', 'Trust & experience', 'Purpose & abundance'],
    plotStarts: [0, 3, 8, 10],
    periods: Object.entries(navigatorQuarters).map(([label, s]) => ({
      ...s, id: quarterId(label), label, title: s.phase, summary: s.phaseDescription,
      assumption: label === 'Q4 2026' ? 'AGI assumed' : label === 'Q2 2029' ? 'ASI assumed' : null,
    })),
    transitions: [],
  },
};

export function readSelection(hash = window.location.hash) {
  const fragment = hash.replace(/^#/, '');
  const params = new URLSearchParams(fragment);
  const aliases = { 'AI_timeline_from_Gemini_25': 'gemini', 'project-services-navigator': 'navigator' };
  const requested = params.get('story') || aliases[fragment] || fragment;
  const storyId = Object.hasOwn(stories, requested) ? requested : 'market';
  const index = stories[storyId].periods.findIndex(p => p.id === params.get('period'));
  return { storyId, index: index < 0 ? 0 : index };
}

export function selectionHash(storyId, index) {
  return `#story=${storyId}&period=${stories[storyId].periods[index].id}`;
}
