import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { archetypes, readSelection, selectionHash, stories } from './stories';

function StoryList({ title, items }) {
  if (!items?.length) return null;
  return <section className="story-list"><h3>{title}</h3><ul>{items.map(item => <li key={item}>{item === 'N/A' ? 'Not assigned in this story' : item}</li>)}</ul></section>;
}

function MarketTimelineExplorer() {
  const [{ storyId, index }, setSelection] = useState(() => readSelection());
  const [reflection, setReflection] = useState(null);
  const periodButtons = useRef([]);
  const story = stories[storyId];
  const slice = story.periods[index];
  const transition = index > 0 && story.transitions.find(t => t.from === story.periods[index - 1].id && t.to === slice.id);
  const plotStep = story.plotStarts.findLastIndex(start => index >= start);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#root') return; // The shared Library skip link must preserve the story.
      setSelection(readSelection()); setReflection(null);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function select(nextStory, nextIndex, focus = false) {
    setSelection({ storyId: nextStory, index: nextIndex });
    setReflection(null);
    window.history.replaceState(null, '', selectionHash(nextStory, nextIndex));
    if (focus) periodButtons.current[nextIndex]?.focus();
    periodButtons.current[nextIndex]?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }
  function changeStory(nextStory) {
    const matching = stories[nextStory].periods.findIndex(p => p.id === slice.id);
    select(nextStory, Math.max(0, matching));
  }
  function timelineKeys(e, focusedIndex) {
    let next;
    if (e.key === 'ArrowLeft') next = Math.max(0, focusedIndex - 1);
    if (e.key === 'ArrowRight') next = Math.min(story.periods.length - 1, focusedIndex + 1);
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = story.periods.length - 1;
    if (next !== undefined) { e.preventDefault(); select(storyId, next, true); }
  }

  return <div className="market-explorer">
    <header className="market-intro">
      <p className="eyebrow">Three authored futures · one question to explore</p>
      <h1>Who holds power when project work changes?</h1>
      <p>Imagine a project-services firm choosing between specialist expertise, platform access and trusted relationships. Explore how three stories change the value of those choices.</p>
    </header>
    <aside className="scenario-note" role="note">
      <strong>Historical thought experiments, not forecasts.</strong>
      <p>Every quarter below is an invented scenario, including dates that have now passed. All three stories assume AGI in Q4 2026 and ASI in Q2 2029. Organisations, market outcomes and abundance are plot assumptions, not reported events or present corporate evidence.</p>
      <p>These narratives share a premise; they do not independently support it or assign probabilities.</p>
    </aside>

    <section className="story-picker" aria-labelledby="story-picker-title">
      <h2 id="story-picker-title">Choose a story</h2>
      <div className="story-options">{Object.entries(stories).map(([id, item]) => <button key={id} aria-pressed={storyId === id} onClick={() => changeStory(id)}>
        <strong>{item.title}</strong><span>{item.subtitle}</span>
      </button>)}</div>
      <p>{story.description}</p>
    </section>

    <figure className="story-plot">
      <figcaption><strong>This story’s imagined path</strong> · causal sketch, not a measured trend</figcaption>
      <ol>{story.plot.map((stage, i) => <li key={stage} className={i === plotStep ? 'current' : ''} aria-current={i === plotStep ? 'step' : undefined}><span>{i + 1}</span>{stage}</li>)}</ol>
      <p>The current period sits in the highlighted stage. Capability does not establish adoption, market power or human benefit; those connections are assumptions in these stories.</p>
    </figure>

    <section aria-labelledby="period-picker-title" className="period-picker">
      <div className="period-label"><h2 id="period-picker-title">Choose a period</h2><span>{index + 1} of {story.periods.length} {storyId === 'gemini' ? 'snapshots' : 'quarters'}</span></div>
      {storyId === 'gemini' && <p className="small-note">The plateau covers Q3 2027–Q1 2029 and the final snapshot covers all of 2030.</p>}
      <div className="timeline" role="group" aria-label="Story periods">
        {story.periods.map((p, i) => <button key={p.id} ref={el => { periodButtons.current[i] = el; }} aria-pressed={i === index} onKeyDown={e => timelineKeys(e, i)} onClick={() => select(storyId, i)}>
          <span className="timeline-dot" aria-hidden="true" /><span>{p.label}</span>{p.assumption && <small>{p.assumption}</small>}
        </button>)}
      </div>
      <p className="small-note">Select any period, or use Left / Right, Home / End while a period has focus.</p>
    </section>

    <article className="snapshot" aria-labelledby="snapshot-title">
      <div className="snapshot-nav">
        <button onClick={() => select(storyId, index - 1)} disabled={index === 0} aria-label="Previous quarter">← Previous</button>
        <span aria-live="polite">{slice.label} · {story.title}</span>
        <button onClick={() => select(storyId, index + 1)} disabled={index === story.periods.length - 1} aria-label="Next quarter">Next →</button>
      </div>
      <p className="eyebrow">Authored scenario snapshot {slice.assumption && `· ${slice.assumption}`}</p>
      <h2 id="snapshot-title">{slice.title || slice.label}</h2>
      <p className="snapshot-summary">{slice.summary}</p>
      {transition && <aside className="transition"><h3>Imagined transition: {transition.label}</h3><p>{transition.description}</p></aside>}
      <div className="snapshot-groups">
        <StoryList title="Hypothetical winners" items={slice.winners} />
        <StoryList title="Hypothetical losers" items={slice.losers} />
        <StoryList title="Imagined coalitions" items={slice.coalitions} />
        <StoryList title="Holding steady in this story" items={slice.stable} />
      </div>
      {slice.dynamics && <div className="story-forces">
        <StoryList title="Imagined market dynamics" items={slice.dynamics} />
        {slice.transition && <section><h3>Imagined transition force</h3><p>{slice.transition}</p></section>}
      </div>}
      {slice.questions && <section className="strategic-questions" aria-labelledby="questions-title">
        <h3 id="questions-title">Three questions to carry back to your firm</h3>
        <p>Original prompts, including their assumptions. Choose one to examine; none requires you to accept the story.</p>
        <ol>{slice.questions.map((q, i) => <li key={q}><button aria-pressed={reflection === i} onClick={() => setReflection(reflection === i ? null : i)}>{q}</button></li>)}</ol>
        {reflection !== null && <aside className="reflection" aria-live="polite"><strong>Test the premise</strong><p>{slice.questions[reflection]}</p><p>Which part assumes a capability, a date or a change in human behaviour? What evidence would make you revise it? What choice would still make sense if this story were wrong?</p></aside>}
      </section>}
    </article>

    {storyId === 'gemini' && <section className="archetypes" aria-labelledby="archetypes-title"><h2 id="archetypes-title">Meet the fictional archetypes</h2><dl>{archetypes.map(([name, role]) => <div key={name}><dt>{name}</dt><dd>{role}</dd></div>)}</dl></section>}

    <details className="source-details">
      <summary>Read this story’s source, construction and limits</summary>
      <dl>
        <dt>Source</dt><dd><a href={story.sourceUrl}>{story.source}</a>. Generation labels are original catalogue metadata, not independent authorship verification. The original publication dates are not established here; the dates on the timeline belong to the imagined scenario. Migration reviewed 3 October 2026.</dd>
        <dt>Concept</dt><dd>{story.lens}.</dd>
        <dt>Construction</dt><dd>{story.construction} Wording is retained as authored scenario text; the path diagram and “Test the premise” questions are editorial reading aids added for this merged explorer.</dd>
        <dt>Limits and corrections</dt><dd>No story supports a factual claim about current organisations, regulation, AGI or ASI. The two retired catalogue descriptions said “ASI in 2030”; both source timelines actually place it in Q2 2029. This explorer follows the source timelines and labels that date as an assumption. Post-scarcity, displacement percentages, 10× productivity and the existing story’s 25% schedule compression are unevidenced plot claims.</dd>
      </dl>
    </details>
    <p className="share-note">The address records the selected story and period, so you can link to the same point in the discussion.</p>
  </div>;
}

export default MarketTimelineExplorer;
