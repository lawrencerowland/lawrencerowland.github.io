(function(){
    "use strict";

    // -------------------------
    // 1) Fixed example dataset
    // -------------------------
    const PROJECT = ScenarioLattice.project;
    const $ = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

    function escapeHtml(s){
      return String(s)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
    }

    function attrShort(a){
      return (PROJECT.attrMeta[a] && PROJECT.attrMeta[a].short) ? PROJECT.attrMeta[a].short : a;
    }
    function attrDesc(a){
      return (PROJECT.attrMeta[a] && PROJECT.attrMeta[a].desc) ? PROJECT.attrMeta[a].desc : "";
    }
    function riskTitle(r){
      return (PROJECT.riskMeta[r] && PROJECT.riskMeta[r].title) ? PROJECT.riskMeta[r].title : r;
    }

    $("#projectTitle").textContent = PROJECT.title;

    // -------------------------
    // 2) Fill scenario list (left panel)
    // -------------------------
    $("#scenarioUl").innerHTML = PROJECT.objects.map(r => {
      const m = PROJECT.riskMeta[r];
      return `<li><code>${escapeHtml(r)}</code> — ${escapeHtml(m.title)}</li>`;
    }).join("");

    // -------------------------
    // 3) FCA (Next Closure) in JS
    // -------------------------
    const model = ScenarioLattice.create(PROJECT);
    const {objects:Objects,attributes:Attrs,relation:Rel,concepts,edges,rootId}=model;
    // -------------------------
    // 4) Matrix view
    // -------------------------
    function renderMatrix(){
      const attrs = Attrs.slice();

      const head = `
        <thead>
          <tr>
            <th>Scenario</th>
            ${attrs.map(a => {
              const isCtrl = a.startsWith(PROJECT.controlPrefix);
              const short = attrShort(a);
              const prefix = isCtrl ? "Control" : "Evidence";
              const title = `${prefix}: ${short}\n${attrDesc(a)}\n\nToken: ${a}`;
              return `<th title="${escapeHtml(title)}">${escapeHtml(short)}</th>`;
            }).join("")}
          </tr>
        </thead>
      `;

      const body = `
        <tbody>
          ${Objects.map(o => {
            const set = Rel[o];
            const m = PROJECT.riskMeta[o] || { title: o };
            return `
              <tr>
                <td>
                  <div><code>${escapeHtml(o)}</code> — ${escapeHtml(m.title)}</div>
                  <div class="hint" style="margin-top:6px;"><b>Causal chain:</b> ${escapeHtml(m.chain || "")}</div>
                </td>
                ${attrs.map(a => set.has(a) ? `<td class="mark">✓</td>` : `<td></td>`).join("")}
              </tr>
            `;
          }).join("")}
        </tbody>
      `;

      $("#matrix").innerHTML = `<table>${head}${body}</table>`;
    }
    renderMatrix();

    // -------------------------
    // 5) Cytoscape graph
    // -------------------------
    function ensureCytoscape(){
      if(typeof cytoscape === "undefined"){
        $("#cy").innerHTML = `
          <div style="padding:16px;">
            <div class="callout">
              <b>Cytoscape.js failed to load.</b>
              <div class="hint" style="margin-top:8px;">
                The picture is unavailable. The concept selector, scenario search, input matrix and reports below still use the same computed lattice.
              </div>
            </div>
          </div>
        `;
        $("#btnLayoutHierarchy").disabled=true; $("#btnLayoutForce").disabled=true;
        return null;
      }
      return cytoscape;
    }


    function fallbackGraph(){
      function selection(nodes=[]){return {data:()=>nodes[0]||{},select(){return this;},unselect(){return this;},addClass(){return this;},removeClass(){return this;},closedNeighborhood(){return this;},not(){return this;}};}
      return {getElementById:id=>selection(concepts.filter(c=>c.id===id)),nodes:()=>selection(concepts),elements:()=>selection(concepts),layout:()=>({run(){}}),animate(){},on(){}};
    }

    const Cyt = ensureCytoscape();

    const cy = Cyt ? Cyt({
      container: $("#cy"),
      elements: {
        nodes: concepts.map(c => ({
          data: {
            id: c.id,
            label: c.label,
            extent: c.extent,
            intent: c.intent,
            stats: c.stats
          }
        })),
        edges: edges.map(e => ({ data: e }))
      },
      wheelSensitivity: 0.2,
      layout: { name: "preset", positions:model.hierarchyPositions(), fit:true, padding:30 },
      style: [
        { selector: "node", style: {
          "label": "data(label)",
          "text-wrap": "wrap",
          "text-max-width": 170,
          "font-size": 11,
          "background-color": "#e2e8f0",
          "border-width": 1,
          "border-color": "#94a3b8",
          "width": 96,
          "height": 68,
          "shape": "roundrectangle",
          "text-valign": "center",
          "text-halign": "center"
        }},
        { selector: "edge", style: {
          "width": 1,
          "line-color": "#94a3b8",
          "target-arrow-color": "#94a3b8",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier"
        }},
        { selector: "node:selected", style: {
          "border-width": 4,
          "border-color": "#2563eb",
          "background-color": "#dbeafe"
        }},
        { selector: ".gap", style: {
          "border-width": 4,
          "border-color": "#dc2626",
          "background-color": "#fee2e2"
        }},
        { selector: ".emptyRisk", style: {
          "border-style": "dashed"
        }},
        { selector: ".searchHit", style: {
          "border-width": 4,
          "border-color": "#0f766e",
          "background-color": "#ccfbf1"
        }},
        { selector: ".dim", style: {
          "opacity": 0.18
        }}
      ]
    }) : fallbackGraph();

    function runHierarchy(){
      $("#btnLayoutHierarchy").setAttribute("aria-pressed","true"); $("#btnLayoutForce").setAttribute("aria-pressed","false");
      cy.layout({ name:"preset", positions:model.hierarchyPositions(), fit:true, padding:30 }).run();
    }
    function runForce(){
      $("#btnLayoutHierarchy").setAttribute("aria-pressed","false"); $("#btnLayoutForce").setAttribute("aria-pressed","true");
      cy.layout({ name:"cose", padding: 30, animate: true, randomize: true }).run();
    }

    $("#btnLayoutHierarchy").addEventListener("click", runHierarchy);
    $("#btnLayoutForce").addEventListener("click", runForce);

    // -------------------------
    // 6) Selected concept panel
    // -------------------------
    function splitAttrs(arr){
      const barriers = [], proofs = [], other = [];
      for(const a of arr){
        if(a.startsWith(PROJECT.controlPrefix)) barriers.push(a);
        else if(a.startsWith(PROJECT.evidencePrefix)) proofs.push(a);
        else other.push(a);
      }
      return {barriers, proofs, other};
    }

    function plural(n, s){ return n===1 ? s : (s+"s"); }

    function renderAttrList(items){
      if(items.length === 0) return "<div class=\"hint\">—</div>";
      return `
        <ul>
          ${items.map(a => `
            <li>
              <b>${escapeHtml(attrShort(a))}</b>
              <span class="mono">(${escapeHtml(a)})</span>
              <div class="hint">${escapeHtml(attrDesc(a))}</div>
            </li>
          `).join("")}
        </ul>
      `;
    }

    function renderSelected(node){
      if(!node){
        $("#conceptSelect").value="";
        $("#selectedPanel").innerHTML = `
          <div class="h2">Selected node</div>
          <div class="emptyState">Choose a concept above or click a node in the lattice to see details.</div>
        `;
        return;
      }

      const d = node.data();
      $("#conceptSelect").value=d.id;
      const extent = d.extent || [];
      const intent = d.intent || [];
      const {barriers, proofs, other} = splitAttrs(intent);

      const extentCards = extent.map(r => {
        const m = PROJECT.riskMeta[r] || { title: r, chain:"", impact:"" };
        const attrsForRisk = PROJECT.relation[r] || [];
        const barrierTags = attrsForRisk.filter(a => a.startsWith(PROJECT.controlPrefix)).map(attrShort);
        const proofTags = attrsForRisk.filter(a => a.startsWith(PROJECT.evidencePrefix)).map(attrShort);

        return `
          <details class="riskCard">
            <summary><code>${escapeHtml(r)}</code> — ${escapeHtml(m.title)}</summary>
            <div class="riskBody">
              <div class="hint"><b>Causal chain:</b> ${escapeHtml(m.chain || "")}</div>
              <div class="hint"><b>If it happens:</b> ${escapeHtml(m.impact || "")}</div>
              <div class="tagRow">
                ${barrierTags.map(t => `<span class="tag">Barrier: ${escapeHtml(t)}</span>`).join("")}
                ${proofTags.map(t => `<span class="tag">Evidence: ${escapeHtml(t)}</span>`).join("")}
              </div>
            </div>
          </details>
        `;
      }).join("");

      $("#selectedPanel").innerHTML = `
        <div class="h2">Selected node</div>

        <div class="callout">
          <div><b>${extent.length}</b> ${plural(extent.length,"scenario")} share this attribute pattern</div>
          <div class="hint">Node id: <code>${escapeHtml(d.id)}</code></div>
        </div>

        <div class="callout">
          <div style="font-weight:900; margin-bottom:6px;">Intent (shared control/evidence tags)</div>

          <div class="hint"><b>Barriers</b> (${barriers.length})</div>
          ${renderAttrList(barriers)}

          <div class="hint" style="margin-top:10px;"><b>Evidence</b> (${proofs.length})</div>
          ${renderAttrList(proofs)}

          ${other.length ? `
            <div class="hint" style="margin-top:10px;"><b>Other</b> (${other.length})</div>
            ${renderAttrList(other)}
          ` : ``}
        </div>

        <div class="callout">
          <div style="font-weight:900; margin-bottom:6px;">Extent (scenarios)</div>
          <div class="hint" style="margin-top:0;">
            These scenarios share the attributes listed above; they may have additional, different attributes. Expand each one to read its causal chain.
          </div>
          ${extentCards || `<div class="emptyState">No scenario has all these attributes together. FCA assigns every attribute to the empty extent by convention; this is not a perfectly protected scenario.</div>`}
        </div>

        <div class="row">
          <button class="btn small" id="btnCenter">Center on node</button>
          <button class="btn small ghost" id="btnDimOthers">Dim others</button>
        </div>
        <div class="hint">“Dim others” helps you focus on the local neighborhood of this concept.</div>
      `;

      $("#btnCenter").addEventListener("click", () => {
        cy.animate({ center: { eles: node }, duration: 300 });
        node.select();
      });
      $("#btnDimOthers").addEventListener("click", () => {
        cy.elements().removeClass("dim");
        const hood = node.closedNeighborhood();
        cy.elements().not(hood).addClass("dim");
      });
    }

    cy.on("tap", "node", (evt) => renderSelected(evt.target));
    cy.on("tap", (evt) => { if(evt.target === cy) cy.elements().removeClass("dim"); });

    // -------------------------
    // 7) Gap highlighting + report
    // -------------------------
    const computeGaps = model.gaps;
    const mostSpecificConceptForRisk = model.conceptForRisk;
    let gapsOn = false;
    $("#btnGaps").addEventListener("click", () => {
      gapsOn = !gapsOn;
      $("#btnGaps").classList.toggle("active", gapsOn);
      $("#btnGaps").setAttribute("aria-pressed",String(gapsOn));

      cy.nodes().removeClass("gap emptyRisk");

      if(!gapsOn){
        $("#gapReport").innerHTML = `Turn on <b>Highlight gaps</b> to generate a gap report.`;
        return;
      }

      const gaps = computeGaps();
      const emptySet = new Set(gaps.empty);

      // Highlight the most specific concept for each gap scenario (avoids painting the whole lattice red)
      for(const r of gaps.noBarrier){
        const cid = mostSpecificConceptForRisk(r);
        if(cid) cy.getElementById(cid).addClass("gap");
      }
      for(const r of gaps.empty){
        const cid = mostSpecificConceptForRisk(r);
        if(cid) cy.getElementById(cid).addClass("emptyRisk");
      }

      const evidenceOnly = [];
      for(const o of gaps.noBarrier){
        if(emptySet.has(o)) continue;
        const attrs = PROJECT.relation[o] || [];
        const hasProof = attrs.some(a => a.startsWith(PROJECT.evidencePrefix));
        if(hasProof) evidenceOnly.push(o);
      }

      function riskLi(o){
        const m = PROJECT.riskMeta[o];
        return `<li><code>${escapeHtml(o)}</code> — ${escapeHtml(m.title)}</li>`;
      }

      $("#gapReport").innerHTML = `
        <div class="callout">
          <div style="font-weight:900; margin-bottom:6px;">No recorded control (${gaps.noBarrier.length})</div>
          <div class="hint">Scenarios with <b>zero</b> <code>${escapeHtml(PROJECT.controlPrefix)}</code> attributes.</div>
          <ul>${gaps.noBarrier.map(riskLi).join("") || "<li>—</li>"}</ul>
        </div>

        <div class="callout">
          <div style="font-weight:900; margin-bottom:6px;">Evidence‑only (${evidenceOnly.length})</div>
          <div class="hint">An evidence tag is present, but no control tag. Check the underlying assessment; this table cannot establish missing ownership or control effectiveness.</div>
          <ul>${evidenceOnly.map(riskLi).join("") || "<li>—</li>"}</ul>
        </div>

        <div class="callout">
          <div style="font-weight:900; margin-bottom:6px;">No attributes recorded (${gaps.empty.length})</div>
          <div class="hint">No attributes are recorded. That could mean missing data, an incomplete assessment, or a deliberately empty row; the table cannot decide which.</div>
          <ul>${gaps.empty.map(riskLi).join("") || "<li>—</li>"}</ul>
        </div>

        <div class="hint">
          A marked node contains at least one flagged scenario; its other scenarios need not have a gap. For example, the empty-row scenario belongs to the all-scenario concept. Inspect the report and scenario rows.
        </div>
      `;
    });

    // -------------------------
    // 8) Search (by id or keyword)
    // -------------------------
    function matchedRisks(query){
      const q = (query || "").trim().toLowerCase();
      if(!q) return [];
      return Objects.filter(r => {
        const m = PROJECT.riskMeta[r] || { title:"", chain:"" };
        return r.toLowerCase().includes(q) || (m.title || "").toLowerCase().includes(q) || (m.chain || "").toLowerCase().includes(q);
      });
    }

    function searchRisk(query){
      cy.nodes().removeClass("searchHit");
      const matches = matchedRisks(query);
      cy.elements().removeClass("dim").unselect();
      if(!matches.length)renderSelected(null);

      if(matches.length === 0){
        $("#canvasHint").textContent = `No scenario matches “${query}”. Try “forklift”, “chemical”, or “risk-003”.`;
        return;
      }

      // Highlight most specific concept(s) for each matched risk
      const conceptIds = new Set();
      for(const r of matches){
        const cid = mostSpecificConceptForRisk(r);
        if(cid) conceptIds.add(cid);
      }
      for(const cid of conceptIds){
        cy.getElementById(cid).addClass("searchHit");
      }

      // Focus
      const firstId = Array.from(conceptIds)[0];
      if(firstId){
        const first = cy.getElementById(firstId);
        cy.animate({ center: { eles: first }, duration: 300 });
        first.select();
        renderSelected(first);
      }

      $("#canvasHint").textContent = matches.length+" scenario(s) matched. Their most specific concepts are highlighted; concept extents can include other scenarios.";

    }

    $("#btnSearch").addEventListener("click", () => searchRisk($("#riskSearch").value));
    $("#riskSearch").addEventListener("keydown", (e) => { if(e.key === "Enter") searchRisk($("#riskSearch").value); });

    // ESC clears highlights and closes modals
    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape"){
        cy.nodes().removeClass("searchHit");
        closeAllModals();
      }
    });

    // -------------------------
    // 9) Reset
    // -------------------------
    $("#btnReset").addEventListener("click", () => {
      gapsOn = false;
      $("#btnGaps").classList.remove("active");
      $("#btnGaps").setAttribute("aria-pressed","false");
      $("#riskSearch").value = "";
      cy.elements().removeClass("gap emptyRisk searchHit dim");
      cy.elements().unselect();
      renderSelected(null);
      $("#gapReport").innerHTML = `Turn on <b>Highlight gaps</b> to generate a gap report.`;
      $("#canvasHint").textContent = "A node is a “barrier bundle”: the scenarios (extent) that share the common control/evidence tags (intent), even when their full rows differ. Click any node to see the causal stories for the scenarios it groups.";
      runHierarchy();
    });

    // -------------------------
    // 10) Modals
    // -------------------------

    let opener=null;
    function openModal(id){
      const m=document.getElementById(id);if(!m)return;
      closeAllModals();opener=document.activeElement;
      m.classList.add('open');m.setAttribute('aria-hidden','false');
      $$('body > :not(.modal)').forEach(el=>{el.inert=true;});
      m.querySelector('[data-close]').focus();
    }
    function closeModal(m){
      m.classList.remove('open');m.setAttribute('aria-hidden','true');
      $$('body > :not(.modal)').forEach(el=>{el.inert=false;});
      if(opener)opener.focus();opener=null;
    }
    function closeAllModals(){$$('.modal.open').forEach(closeModal);}
    $$('[data-open]').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.open)));
    $$('[data-close]').forEach(btn=>btn.addEventListener('click',closeAllModals));
    $$('.modal').forEach(m=>{
      m.addEventListener('click',e=>{if(e.target===m)closeModal(m);});
      m.addEventListener('keydown',e=>{
        if(e.key!=='Tab')return;
        const controls=Array.from(m.querySelectorAll('button,a[href],input,select,[tabindex="0"]'));
        const first=controls[0],last=controls.at(-1);
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      });
    });
    $('#conceptSelect').innerHTML='<option value="">Choose a concept…</option>'+concepts.map((c,i)=>'<option value="'+c.id+'">Concept '+(i+1)+' · '+c.extent.length+' scenarios · '+c.stats.barrierCount+' controls · '+c.stats.proofCount+' evidence tags</option>').join('');
    $('#conceptSelect').addEventListener('change',e=>{
      cy.elements().unselect().removeClass('dim');
      const node=e.target.value?cy.getElementById(e.target.value):null;
      if(node){node.select();}
      renderSelected(node);
    });
    // Start with empty details
    renderSelected(null);

  })();
