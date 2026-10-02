
    const state = {
      data: null,
      filters: {
        persona: 'All',
        intent: 'All',
        phase: 'All'
      },
      selectedPackId: null,
      session: []
    };

    const selects = {
      persona: document.getElementById('personaFilter'),
      intent: document.getElementById('intentFilter'),
      phase: document.getElementById('phaseFilter')
    };

    const tagLineEl = document.getElementById('tagline');
    const metaEl = document.getElementById('meta');
    const packListEl = document.getElementById('packList');
    const detailEl = document.getElementById('detail');
    const emptyStateEl = document.getElementById('emptyState');
    const sessionItemsEl = document.getElementById('sessionItems');
    const sessionEmptyEl = document.getElementById('sessionEmpty');
    const sessionMetaEl = document.getElementById('sessionMeta');
    const personaDeckEl = document.getElementById('personaDeck');
    const templateDeckEl = document.getElementById('templateDeck');
    const scoreDeckEl = document.getElementById('scoreDeck');
    const coachNotesEl = document.getElementById('coachNotes');

    function unique(list) {
      return Array.from(new Set(list));
    }

    function buildFilterOptions() {
      const { probePacks } = state.data;
      const personaOptions = ['All', ...unique(probePacks.flatMap(pack => pack.personaTags))];
      const intentOptions = ['All', ...unique(probePacks.map(pack => pack.intent))];
      const phaseOptions = ['All', ...unique(probePacks.map(pack => pack.phase))];

      const map = [
        ['persona', personaOptions],
        ['intent', intentOptions],
        ['phase', phaseOptions]
      ];

      map.forEach(([key, options]) => {
        const select = selects[key];
        select.innerHTML = '';
        options.forEach(option => {
          const opt = document.createElement('option');
          opt.value = option;
          opt.textContent = option;
          select.appendChild(opt);
        });
        select.value = state.filters[key];
        select.addEventListener('change', () => {
          state.filters[key] = select.value;
          renderPacks();
        });
      });
    }

    function passesFilters(pack) {
      const { persona, intent, phase } = state.filters;
      if (persona !== 'All' && !pack.personaTags.includes(persona)) return false;
      if (intent !== 'All' && pack.intent !== intent) return false;
      if (phase !== 'All' && pack.phase !== phase) return false;
      return true;
    }

    function renderPacks() {
      const packs = state.data.probePacks.filter(passesFilters);
      packListEl.innerHTML = '';
      document.getElementById('packCount').textContent = `${packs.length} matching pack${packs.length === 1 ? '' : 's'}`;
      if (!packs.length) {
        emptyStateEl.style.display = 'block';
        detailEl.innerHTML = '';
        state.selectedPackId = null;
        return;
      }
      emptyStateEl.style.display = 'none';
      if (!packs.some(pack => pack.id === state.selectedPackId)) state.selectedPackId = packs[0].id;

      packs.forEach(pack => {
        const card = document.createElement('button');
        card.type = 'button';
        card.setAttribute('aria-pressed', String(pack.id === state.selectedPackId));
        card.className = 'pack-card' + (pack.id === state.selectedPackId ? ' active' : '');
        card.dataset.id = pack.id;
        const title = document.createElement('span');
        title.className = 'pack-title';
        title.textContent = pack.title;
        card.appendChild(title);

        const summary = document.createElement('span');
        summary.className = 'pack-summary';
        summary.textContent = pack.summary;
        card.appendChild(summary);

        const meta = document.createElement('span');
        meta.className = 'meta';
        const intent = document.createElement('span');
        intent.className = 'pill';
        intent.textContent = pack.intent;
        meta.appendChild(intent);
        const phase = document.createElement('span');
        phase.className = 'pill';
        phase.textContent = pack.phase;
        meta.appendChild(phase);
        card.appendChild(meta);

        card.addEventListener('click', () => {
          state.selectedPackId = pack.id;
          renderPacks();
          packListEl.querySelector(`[data-id="${pack.id}"]`).focus();
        });

        packListEl.appendChild(card);
      });

      if (!state.selectedPackId || !packs.some(pack => pack.id === state.selectedPackId)) {
        state.selectedPackId = packs[0].id;
      }
      renderDetail();
    }

    function renderDetail() {
      detailEl.innerHTML = '';
      const pack = state.data.probePacks.find(p => p.id === state.selectedPackId);
      if (!pack) {
        detailEl.innerHTML = '<p style="color: var(--ink-muted);">Select a pack to view the probes.</p>';
        return;
      }

      const header = document.createElement('div');
      header.className = 'detail-header';
      const h2 = document.createElement('h2');
      h2.textContent = pack.title;
      header.appendChild(h2);

      const summary = document.createElement('p');
      summary.textContent = pack.summary;
      header.appendChild(summary);

      const personaRow = document.createElement('div');
      personaRow.className = 'persona-tags';
      pack.personaTags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'pill';
        span.textContent = tag;
        personaRow.appendChild(span);
      });
      header.appendChild(personaRow);

      const signalWrap = document.createElement('div');
      signalWrap.innerHTML = '<h3 style="margin:18px 0 6px;font-size:16px;color:var(--ink-soft);">Possible signals to investigate</h3>';
      const signals = document.createElement('div');
      signals.className = 'signal-list';
      pack.signals.forEach(signal => {
        const span = document.createElement('span');
        span.textContent = signal;
        signals.appendChild(span);
      });
      signalWrap.appendChild(signals);

      detailEl.appendChild(header);
      detailEl.appendChild(signalWrap);

      const questionHeading = document.createElement('h3');
      questionHeading.style.margin = '18px 0 6px';
      questionHeading.style.fontSize = '16px';
      questionHeading.style.color = 'var(--ink-soft)';
      questionHeading.textContent = 'Probes';
      detailEl.appendChild(questionHeading);

      pack.questions.forEach((question, idx) => {
        const qCard = document.createElement('article');
        qCard.className = 'question-card';

        const title = document.createElement('h3');
        title.textContent = `${idx + 1}. ${question.prompt}`;
        qCard.appendChild(title);

        const angle = document.createElement('p');
        angle.innerHTML = `<strong style="color:${'var(--ink-soft)'};font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">Angle</strong> ${question.angle}`;
        qCard.appendChild(angle);

        if (question.whatToListenFor?.length) {
          const listenHeading = document.createElement('p');
          listenHeading.innerHTML = '<strong style="color:var(--ink-soft);font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">Listen For</strong>';
          qCard.appendChild(listenHeading);
          const ul = document.createElement('ul');
          question.whatToListenFor.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
          });
          qCard.appendChild(ul);
        }

        if (question.followUps?.length) {
          const followHeading = document.createElement('p');
          followHeading.innerHTML = '<strong style="color:var(--ink-soft);font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">Follow Ups</strong>';
          qCard.appendChild(followHeading);
          const ul = document.createElement('ul');
          question.followUps.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
          });
          qCard.appendChild(ul);
        }

        if (question.notes) {
          const notes = document.createElement('p');
          notes.innerHTML = `<strong style="color:var(--ink-soft);font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">Coach Note</strong> ${question.notes}`;
          qCard.appendChild(notes);
        }

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.justifyContent = 'flex-end';

        const addBtn = document.createElement('button');
        addBtn.className = 'btn';
        addBtn.textContent = 'Add to Session';
        addBtn.addEventListener('click', () => {
          if (state.session.length >= 100) {status('A run-sheet can contain up to 100 questions. Export or remove questions before adding more.'); return;}
          state.session.push({packId: pack.id, questionIndex: idx});
          persistSession();
          renderSession();
        });
        actions.appendChild(addBtn);
        qCard.appendChild(actions);

        detailEl.appendChild(qCard);
      });

      if (pack.artefacts?.length) {
        const artefacts = document.createElement('div');
        artefacts.style.marginTop = '16px';
        artefacts.innerHTML = '<h3 style="margin:0 0 8px;font-size:16px;color:var(--ink-soft);">Artifacts to bring</h3>';
        const chipRow = document.createElement('div');
        chipRow.className = 'signal-list';
        pack.artefacts.forEach(item => {
          const span = document.createElement('span');
          span.textContent = item;
          chipRow.appendChild(span);
        });
        artefacts.appendChild(chipRow);
        detailEl.appendChild(artefacts);
      }
    }

    function renderSession() {
      sessionItemsEl.innerHTML = '';
      document.getElementById('resetSession').disabled = !state.session.length;
      document.getElementById('runSheet').value = ProbeSession.text(state.session, state.data);
      document.getElementById('printedRunSheet').textContent = ProbeSession.text(state.session, state.data);
      document.getElementById('exportSession').disabled = !state.session.length;
      sessionMetaEl.innerHTML = '';

      if (!state.session.length) {
        sessionEmptyEl.style.display = 'block';
        return;
      }
      sessionEmptyEl.style.display = 'none';

      state.session.forEach((ref, index) => {
        const item = ProbeSession.resolve(ref, state.data);
        const card = document.createElement('article');
        card.className = 'session-item';
        const header = document.createElement('header');
        const title = document.createElement('h3');
        title.textContent = `${index + 1}. ${item.prompt}`;
        header.appendChild(title);
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.setAttribute('aria-label', `Remove question ${index + 1}`);
        remove.addEventListener('click', () => {
          state.session.splice(index, 1);
          persistSession();
          renderSession();
          const next = sessionItemsEl.querySelectorAll('button[aria-label^="Remove"]')[Math.min(index, state.session.length - 1)];
          (next || document.getElementById('showRunSheet')).focus();
        });
        header.appendChild(remove);
        card.appendChild(header);

        const packLabel = document.createElement('p');
        packLabel.innerHTML = `<strong style="color:var(--ink-soft);">Pack:</strong> ${item.packTitle}`;
        card.appendChild(packLabel);

        const angle = document.createElement('p');
        angle.innerHTML = `<strong style="color:var(--ink-soft);">Angle:</strong> ${item.angle}`;
        card.appendChild(angle);

        const details = document.createElement('p');
        details.textContent = 'Follow up: ' + item.followUps.join(' · '); card.appendChild(details);
        const controls = document.createElement('div'); controls.className = 'session-controls';
        for (const [label, delta] of [['Move up', -1], ['Move down', 1]]) {
          const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
          button.setAttribute('aria-label', `${label} question ${index + 1}`);
          button.disabled = index + delta < 0 || index + delta >= state.session.length;
          button.addEventListener('click', () => {state.session = ProbeSession.move(state.session, index, delta); persistSession(); renderSession(); sessionItemsEl.querySelector(`[aria-label="Remove question ${index + delta + 1}"]`).focus();});
          controls.appendChild(button);
        }
        card.appendChild(controls);
        sessionItemsEl.appendChild(card);
      });

      const uniquePacks = unique(state.session.map(item => item.packId)).length;
      const total = state.session.length;
      const meta = document.createElement('div');
      meta.textContent = `${total} probe${total !== 1 ? 's' : ''} / ${uniquePacks} pack${uniquePacks !== 1 ? 's' : ''}`;
      sessionMetaEl.appendChild(meta);
    }

    function renderPersonas() {
      personaDeckEl.innerHTML = '';
      state.data.personas.forEach(persona => {
        const card = document.createElement('article');
        card.className = 'card';
        const title = document.createElement('h3');
        title.textContent = persona.name;
        card.appendChild(title);

        const mission = document.createElement('p');
        mission.innerHTML = `<strong style="color:var(--ink-soft);">Mission:</strong> ${persona.mission}`;
        card.appendChild(mission);

        const frictionTitle = document.createElement('p');
        frictionTitle.innerHTML = '<strong style="color:var(--ink-soft);">Frictions</strong>';
        card.appendChild(frictionTitle);
        const frictionList = document.createElement('ul');
        persona.frictions.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          frictionList.appendChild(li);
        });
        card.appendChild(frictionList);

        const noticeTitle = document.createElement('p');
        noticeTitle.innerHTML = '<strong style="color:var(--ink-soft);">What they notice</strong>';
        card.appendChild(noticeTitle);
        const noticeList = document.createElement('ul');
        persona.whatTheyNotice.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          noticeList.appendChild(li);
        });
        card.appendChild(noticeList);

        personaDeckEl.appendChild(card);
      });
    }

    function renderTemplates() {
      templateDeckEl.innerHTML = '';
      state.data.sessionTemplates.forEach(template => {
        const card = document.createElement('article');
        card.className = 'card';
        const title = document.createElement('h3');
        title.textContent = template.name;
        card.appendChild(title);

        const goal = document.createElement('p');
        goal.innerHTML = `<strong style="color:var(--ink-soft);">Goal:</strong> ${template.goal}`;
        card.appendChild(goal);

        const duration = document.createElement('p');
        duration.innerHTML = `<span class="badge">${template.duration}</span>`;
        card.appendChild(duration);

        if (template.recommendedProbes?.length) {
          const rec = document.createElement('p');
          rec.innerHTML = `<strong style="color:var(--ink-soft);">Probe Packs:</strong> ${template.recommendedProbes.join(', ')}`;
          card.appendChild(rec);
        }

        const stepsTitle = document.createElement('p');
        stepsTitle.innerHTML = '<strong style="color:var(--ink-soft);">Steps</strong>';
        card.appendChild(stepsTitle);
        const stepList = document.createElement('ul');
        template.steps.forEach(step => {
          const li = document.createElement('li');
          li.textContent = step;
          stepList.appendChild(li);
        });
        card.appendChild(stepList);

        if (template.outputs?.length) {
          const outputTitle = document.createElement('p');
          outputTitle.innerHTML = '<strong style="color:var(--ink-soft);">Outputs</strong>';
          card.appendChild(outputTitle);
          const outputList = document.createElement('ul');
          template.outputs.forEach(out => {
            const li = document.createElement('li');
            li.textContent = out;
            outputList.appendChild(li);
          });
          card.appendChild(outputList);
        }

        templateDeckEl.appendChild(card);
      });
    }

    function renderScorecard() {
      scoreDeckEl.innerHTML = '';
      const scorecard = state.data.scorecard;
      Object.entries(scorecard).forEach(([key, value]) => {
        const card = document.createElement('article');
        card.className = 'card';
        const title = document.createElement('h3');
        title.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        card.appendChild(title);

        const definition = document.createElement('p');
        definition.textContent = value.definition;
        card.appendChild(definition);

        const measures = document.createElement('div');
        measures.className = 'score-item';
        const measureTitle = document.createElement('p');
        measureTitle.innerHTML = '<strong style="color:var(--ink-soft);">Evidence to discuss</strong>';
        measures.appendChild(measureTitle);
        const list = document.createElement('ul');
        value.measures.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          list.appendChild(li);
        });
        measures.appendChild(list);
        card.appendChild(measures);

        scoreDeckEl.appendChild(card);
      });
    }

    function renderCoachNotes() {
      coachNotesEl.innerHTML = '';
      state.data.coachNotes.forEach(note => {
        const card = document.createElement('article');
        card.className = 'card';
        const p = document.createElement('p');
        p.textContent = note;
        card.appendChild(p);
        coachNotesEl.appendChild(card);
      });
    }

    const storageKey = 'library-probecrafter-session-v1';
    let clearedSession = null;
    const status = message => {document.getElementById('saveStatus').textContent = message;};
    function persistSession() {
      try { localStorage.setItem(storageKey, ProbeSession.serialise(state.session)); status('Run-sheet saved in this browser. Export a copy to keep or share.'); }
      catch { status('Browser storage is unavailable. Export your run-sheet before leaving this page.'); }
    }
    document.getElementById('resetSession').addEventListener('click', () => {
      if (!state.data || !state.session.length) return;
      clearedSession = state.session.slice(); state.session = []; persistSession(); renderSession();
      document.getElementById('undoClear').disabled = !clearedSession.length;
    });
    document.getElementById('undoClear').addEventListener('click', () => {
      if (!clearedSession) return;
      if (clearedSession.length + state.session.length > 100) {status('Undo would exceed 100 questions. Remove some questions or export the current sheet first.'); return;}
      state.session = clearedSession.concat(state.session); clearedSession = null;
      persistSession(); renderSession(); document.getElementById('undoClear').disabled = true;
    });
    document.getElementById('exportSession').addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([ProbeSession.serialise(state.session)], {type:'application/json'}));
      const link = document.createElement('a'); link.href = url; link.download = 'probecrafter-run-sheet.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status('Run-sheet export requested. Keep the downloaded file to reopen it with Import.');
    });
    document.getElementById('importSession').addEventListener('change', async event => {
      const file = event.target.files[0]; if (!file) return;
      try {
        if (file.size > 100000) throw new Error('Run-sheet is too large (maximum 100 KB).');
        const next = ProbeSession.validate(JSON.parse(await file.text()), state.data);
        state.session = next; clearedSession = null; document.getElementById('undoClear').disabled = true;
        persistSession(); renderSession();
      } catch(error) {status('Import not applied: ' + error.message + ' Your current run-sheet is unchanged.');}
      event.target.value = '';
    });
    document.getElementById('showRunSheet').addEventListener('click', () => {
      document.getElementById('runSheetPanel').hidden = false;
      document.getElementById('runSheet').focus();
    });
    document.getElementById('printRunSheet').addEventListener('click', () => {
      let printed = document.getElementById('printedRunSheet');
      if (!printed) {printed = document.createElement('pre'); printed.id = 'printedRunSheet'; document.getElementById('runSheetPanel').appendChild(printed);}
      printed.textContent = ProbeSession.text(state.session, state.data); window.print();
    });
    fetch('probecrafter.json')
      .then(resp => {if (!resp.ok) throw new Error('Question library request failed'); return resp.json();})
      .then(data => {
        state.data = data;
        tagLineEl.textContent = data.tagline;
        metaEl.textContent = `Original library ${data.lastUpdated} · reviewed October 2026 · ${data.probePacks.length} packs / ${data.probePacks.reduce((n,p) => n + p.questions.length,0)} questions`;
        try {const saved = localStorage.getItem(storageKey); if (saved) state.session = ProbeSession.validate(JSON.parse(saved), data);}
        catch {status('Saved run-sheet could not be read. It has not been changed; export a new sheet before leaving if storage is unavailable.');}
        buildFilterOptions(); renderPacks(); renderSession(); renderPersonas(); renderTemplates(); renderScorecard(); renderCoachNotes();
      })
      .catch(err => {console.error(err); tagLineEl.textContent = 'Could not load the question library. Refresh to retry; your saved run-sheet has not been changed.';});
