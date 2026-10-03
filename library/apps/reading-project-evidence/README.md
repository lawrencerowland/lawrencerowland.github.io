# Reading claims from project text

Historical source names, revisions and hashes below identify the reviewed inputs; they are not retrieval links. [Maintained source and verification files](https://github.com/lawrencerowland/lawrencerowland.github.io/tree/master/library/apps/reading-project-evidence).

Reviewed 3 October 2026. Library home: **Data, evidence & assurance**.

Two historical examples share a methodological question: what justifies the step from text to a theme, stance or intention? Their separate datasets are not pooled into a research finding. Neither supplies a new foray End; both are useful worked examples for inspecting interpretations and their limits.

## Retained and improved

- The qualitative tree keeps all four themes, 73 labels, 62 annotations and parent–child relationships. Clickable, keyboard-accessible annotations replace hover-only tooltips. Expand/collapse and text search preserve surrounding context.
- The Legends Tower example keeps all 22 original records (10 news, 12 social), text, source links, stakeholder labels, interpreted intentions, stance labels, supplied scores and missing dates. Counts, averages, a scatter plot, searchable/sortable table and the 22 statement–interpretation pairs use the same selected records. Search includes original dates, sentiment labels, numerical scores and source URLs. Pairs show the original stance in text and colour; the inspector includes polarity, subjectivity, lexicon score and sentiment.
- The old 44-node physics layout consisted only of 22 disconnected pairs. A scrollable paired diagram preserves each relationship and colour distinction without implying an interpersonal network. Selection works through pairs, chart points and table IDs; all have a text alternative.
- JSON export includes the full tree, selected statement records and evidence boundary. Filtering invalidates a prepared export so an old selection cannot be downloaded accidentally. Neither original app stored user data.

## Corrections

The coding draft supplied no corpus, linked posts, coding log or calculations supporting its claims of 919 posts, a 35-fold increase or manual coding of every post. Its annotations remain **unverified draft text**, not authenticated quotations. Recommendations survive as questions; unsupported adoption trends, competitive-necessity claims and a prescribed timetable do not.

The other report conflated statements, stakeholders, sentiment and stance. Its supposed `dica:hasIntention` mapping is removed: the displayed arrow identifies the draft analyst's interpretation, not a validated ontology property or a person's established intention. A safety objection or feasibility doubt does not establish opposition to an entire project. Repeated people and source threads are not independent observations.

Legacy TextBlob-labelled and lexicon scores remain historical supplied outputs. The original file supplies no reproducible scoring version, lexicon or execution trace. Aggregation is checked; the scoring and sampling are not validated. Two records, `news_03` and `news_04`, were checked against the [cited 4 June 2024 Journal Record article](https://journalrecord.com/2024/06/04/okc-council-approves-rezoning-for-1907-foot-legends-tower/). Other attributions remain unverified in this review. Social-post dates remain unknown.

## Sources and provenance

Both originals: `lawrencerowland/Project-web-apps`, revision `cd0528939fd0e1f5de1df7cda9930785349e4946`.

| Original file | SHA-256 |
|---|---|
| `lawrencerowland/Project-web-apps@cd0528939fd0e1f5de1df7cda9930785349e4946:web_apps/grounded-theory-approach.html` | `2c0a689f5f8fd8a30df1045eb27072452b9448fff4966fadb2fe777551b5aecd` |
| `lawrencerowland/Project-web-apps@cd0528939fd0e1f5de1df7cda9930785349e4946:web_apps/legends_tower_sentiment_report.html` | `af49f45e50a1de174715eb71397accffeedc4f4ec6e9bf99ba992f7d4b254ef1` |

Method references: [Diehl et al., *Studying Visualization Guidelines According to Grounded Theory* (2020)](https://arxiv.org/abs/2010.09040), an example of an explicit research process rather than a claim that this prototype followed it; [TextBlob sentiment documentation](https://textblob.readthedocs.io/en/stable/quickstart.html#sentiment-analysis), distinguishing polarity and subjectivity. No additional private corpus was accessed or published.

## Checks

`node --test tests/phase-three-evidence.test.cjs` checks independently extracted source records and tree labels, identity counts, filtering and aggregation, empty selections, sorting, accessible controls, selection clearing and export invalidation. Browser review covers ordinary desktop/mobile journeys. These checks validate the bounded interface and preservation, not the truth of the draft interpretations or benefit to a human research team.
