(function () {
      'use strict';

      var ledger = {
        demand: ['No reading yet', 'Synthetic relative effort and stated obligations', 'Review each disposition with the demand owner'],
        assurance: ['No reading yet', 'Synthetic activity, evidence and review states', 'Obtain current evidence and named reviewer decisions'],
        scarcity: ['No reading yet', 'Declared delay, confidence, package and alternative inputs', 'Re-run when capacity or evidence changes'],
        topology: ['No reading yet', 'Typed directed links in this scenario', 'Validate link types and owners against the real plan'],
        planners: ['No reading yet', 'Three synthetic duration scenarios and declared policy rules', 'Calibrate scores on historical delivery evidence']
      };
      var ledgerNames = {
        demand: 'Challenge demand',
        assurance: 'Test plan claims',
        scarcity: 'Allocate scarcity',
        topology: 'Inspect dependencies',
        planners: 'Planner tournament'
      };

      function labelTables() {
        document.querySelectorAll('table').forEach(function (table) {
          var headings = Array.from(table.querySelectorAll('thead th')).map(function (th) { return th.textContent; });
          table.querySelectorAll('tbody tr').forEach(function (row) {
            Array.from(row.children).forEach(function (cell, i) { cell.dataset.label = headings[i] || ''; });
          });
        });
      }
      function renderLedger() {
        var body = document.getElementById('ledger-body');
        body.innerHTML = '';
        Object.keys(ledger).forEach(function (key) {
          var row = document.createElement('tr');
          var values = [ledgerNames[key], ledger[key][0], ledger[key][1], ledger[key][2]];
          values.forEach(function (value) {
            var cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
          });
          body.appendChild(row);
        });
        labelTables();
      }

      var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () { activateTab(tab); });
        tab.addEventListener('keydown', function (event) {
          var next = null;
          if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
          if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
          if (event.key === 'Home') next = tabs[0];
          if (event.key === 'End') next = tabs[tabs.length - 1];
          if (next) {
            event.preventDefault();
            activateTab(next);
            next.focus();
          }
        });
      });
      function activateTab(tab) {
        tabs.forEach(function (item) {
          var selected = item === tab;
          item.setAttribute('aria-selected', selected ? 'true' : 'false');
          item.tabIndex = selected ? 0 : -1;
          document.getElementById(item.getAttribute('aria-controls')).tabIndex = 0;
          document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
        });
      }

      var demandActions = {
        delete: { label: 'Delete', factor: 0, note: 'remove the demand' },
        shrink: { label: 'Shrink', factor: .45, note: 'retain only the smallest useful slice' },
        substitute: { label: 'Substitute', factor: .35, note: 'meet the need another way' },
        standardise: { label: 'Standardise', factor: .55, note: 'adopt a common pattern' },
        automate: { label: 'Automate', factor: .65, note: 'trade build effort for repeatability' },
        test: { label: 'Test first', factor: .2, note: 'buy evidence before commitment' },
        proceed: { label: 'Proceed', factor: 1, note: 'retain the demand as stated' }
      };
      var demands = [
        { id: 'D1', name: 'Rebuild all 42 dashboards', why: 'User continuity; only 11 are active', effort: 12, mandatory: false, action: 'shrink' },
        { id: 'D2', name: 'Retain seven years of audit history', why: 'Stated records obligation', effort: 10, mandatory: true, action: 'proceed' },
        { id: 'D3', name: 'Recreate bespoke customer scoring', why: 'Commercial differentiation is assumed', effort: 8, mandatory: false, action: 'test' },
        { id: 'D4', name: 'Replicate daily spreadsheet extracts', why: 'Habit; downstream need is unclear', effort: 6, mandatory: false, action: 'delete' },
        { id: 'D5', name: 'Convert every legacy schema automatically', why: 'Speed; exception rate is unknown', effort: 9, mandatory: false, action: 'test' }
      ];
      function renderDemandRows() {
        var body = document.getElementById('demand-body');
        body.innerHTML = '';
        demands.forEach(function (item) {
          var row = document.createElement('tr');
          var name = document.createElement('td');
          name.innerHTML = '<span class="claim-title">' + item.id + ' · ' + item.name + '</span>' +
            (item.mandatory ? '<span class="status warn">obligation</span>' : '<span class="status info">choice</span>');
          var why = document.createElement('td');
          why.textContent = item.why;
          var effort = document.createElement('td');
          effort.textContent = item.effort;
          var actionCell = document.createElement('td');
          var select = document.createElement('select');
          select.setAttribute('aria-label', 'Disposition for ' + item.name);
          Object.keys(demandActions).forEach(function (key) {
            var option = document.createElement('option');
            option.value = key;
            option.textContent = demandActions[key].label;
            option.selected = item.action === key;
            select.appendChild(option);
          });
          select.addEventListener('change', function () { item.action = select.value; computeDemand(); });
          actionCell.appendChild(select);
          [name, why, effort, actionCell].forEach(function (cell) { row.appendChild(cell); });
          body.appendChild(row);
        });
      }
      function computeDemand() {
        // The fixed effort multipliers have two decimal places. Round their
        // hundredths to tenths explicitly, avoiding a binary 32.55 -> 32.5 display.
        function effortLabel(points) { return (Math.round(Math.round(points * 100) / 10) / 10).toFixed(1); }
        var baseline = demands.reduce(function (sum, item) { return sum + item.effort; }, 0);
        var residual = 0;
        var tests = 0;
        var obligationWarnings = [];
        demands.forEach(function (item) {
          residual += item.effort * demandActions[item.action].factor;
          if (item.action === 'test') tests += 1;
          if (item.mandatory && item.action === 'delete') obligationWarnings.push(item.id);
        });
        var avoided = baseline - residual;
        document.getElementById('demand-baseline').textContent = baseline.toFixed(0);
        document.getElementById('demand-residual').textContent = effortLabel(residual);
        document.getElementById('demand-avoided').textContent = effortLabel(avoided);
        document.getElementById('demand-tests').textContent = tests;
        var output = '<strong>' + (obligationWarnings.length ? 'Obligation conflict' : 'No direct deletion of the stated obligation') + '</strong>' +
          '<ul><li>' + effortLabel(avoided) + ' relative effort points are avoided, displaced or held behind a test.</li>' +
          '<li>' + tests + ' demand decision' + (tests === 1 ? ' remains' : 's remain') + ' conditional on evidence.</li>' +
          '<li>' + (obligationWarnings.length ? 'Do not delete ' + obligationWarnings.join(', ') + ' without resolving the stated obligation.' : 'The stated records obligation remains visible; its proposed solution still needs review.') + '</li></ul>';
        document.getElementById('demand-output').innerHTML = output;
        ledger.demand[0] = effortLabel(residual) + ' of ' + baseline + ' effort points committed; ' + tests + ' test-first decision(s)';
        ledger.demand[2] = obligationWarnings.length ? 'Resolve obligation conflict on ' + obligationWarnings.join(', ') : 'Run the open tests, then confirm residual scope';
        renderLedger();
      }
      document.getElementById('demand-conservative').addEventListener('click', function () {
        var preset = ['shrink', 'proceed', 'proceed', 'standardise', 'automate'];
        demands.forEach(function (item, i) { item.action = preset[i]; });
        renderDemandRows(); computeDemand();
      });
      document.getElementById('demand-challenge').addEventListener('click', function () {
        var preset = ['shrink', 'standardise', 'test', 'delete', 'test'];
        demands.forEach(function (item, i) { item.action = preset[i]; });
        renderDemandRows(); computeDemand();
      });

      var claims = [
        { id: 'A1', claim: 'Priority pipeline can be restored within four hours', sensor: 'Timed recovery rehearsal ≤ 4h', owner: 'Operations lead', activity: true, evidence: 'current', threshold: true, review: true },
        { id: 'A2', claim: 'Customer totals reconcile within 0.5%', sensor: 'Parallel-run variance ≤ 0.5%', owner: 'Data product owner', activity: true, evidence: 'stale', threshold: true, review: false },
        { id: 'A3', claim: 'Cross-domain reads are blocked by the access model', sensor: 'Negative access tests show zero unauthorised reads', owner: 'Security architect', activity: true, evidence: 'missing', threshold: false, review: false },
        { id: 'A4', claim: 'Day-two operations can be run by the service team', sensor: 'Observed runbook exercise with no critical assist', owner: 'Service owner', activity: false, evidence: 'missing', threshold: false, review: false }
      ];
      function chainState(claim) {
        if (!claim || ['activity', 'threshold', 'review'].some(function (key) { return typeof claim[key] !== 'boolean'; }) || ['current', 'stale', 'missing'].indexOf(claim.evidence) < 0) throw new Error('Invalid evidence-chain settings.');
        if (!claim.activity) return ['Activity incomplete', 'info'];
        if (claim.evidence === 'missing') return ['Evidence missing', 'stop'];
        if (claim.evidence === 'stale') return ['Evidence stale', 'warn'];
        if (!claim.threshold) return ['Claim not supported', 'stop'];
        if (!claim.review) return ['Awaiting review', 'warn'];
        return ['Chain accepted', 'good'];
      }
      function renderAssurance() {
        var body = document.getElementById('assurance-body');
        body.innerHTML = '';
        claims.forEach(function (claim) {
          var row = document.createElement('tr');
          var title = document.createElement('td');
          title.innerHTML = '<span class="claim-title">' + claim.id + ' · ' + claim.claim + '</span><span class="subtle">Sensor: ' + claim.sensor + '<br>Owner: ' + claim.owner + '</span>';
          var activity = checkboxCell(claim, 'activity', 'Activity done for ' + claim.id);
          var evidenceCell = document.createElement('td');
          var select = document.createElement('select');
          select.setAttribute('aria-label', 'Evidence state for ' + claim.id);
          ['current', 'stale', 'missing'].forEach(function (value) {
            var option = document.createElement('option');
            option.value = value; option.textContent = value; option.selected = claim.evidence === value;
            select.appendChild(option);
          });
          select.addEventListener('change', function () { claim.evidence = select.value; updateAssuranceStates(); });
          evidenceCell.appendChild(select);
          var threshold = checkboxCell(claim, 'threshold', 'Threshold met for ' + claim.id);
          var review = checkboxCell(claim, 'review', 'Reviewer accepts ' + claim.id);
          var stateCell = document.createElement('td');
          stateCell.dataset.chain = claim.id;
          var state = chainState(claim);
          stateCell.innerHTML = '<span class="status ' + state[1] + '">' + state[0] + '</span>';
          [title, activity, evidenceCell, threshold, review, stateCell].forEach(function (cell) { row.appendChild(cell); });
          body.appendChild(row);
        });
        computeAssurance();
      }
      function checkboxCell(object, key, label) {
        var cell = document.createElement('td');
        cell.className = 'check-cell';
        var input = document.createElement('input');
        input.type = 'checkbox'; input.checked = object[key]; input.setAttribute('aria-label', label);
        input.addEventListener('change', function () { object[key] = input.checked; updateAssuranceStates(); });
        var target = document.createElement('label'); target.className = 'check-target'; target.appendChild(input);
        cell.appendChild(target);
        return cell;
      }
      function updateAssuranceStates() {
        claims.forEach(function (claim) {
          var badge = document.querySelector('[data-chain="' + claim.id + '"] .status');
          var state = chainState(claim); badge.textContent = state[0]; badge.className = 'status ' + state[1];
        });
        computeAssurance();
      }
      function computeAssurance() {
        var accepted = claims.filter(function (claim) { return chainState(claim)[0] === 'Chain accepted'; }).length;
        var blockers = claims.filter(function (claim) { return chainState(claim)[0] !== 'Chain accepted'; });
        var ready = accepted === claims.length;
        document.getElementById('assurance-gate').textContent = ready ? 'Eligible for review' : 'Hold';
        document.getElementById('assurance-detail').innerHTML = '<strong>' + accepted + ' of ' + claims.length + ' evidence chains accepted.</strong><ul>' +
          (blockers.length ? blockers.map(function (claim) { return '<li>' + claim.id + ': ' + chainState(claim)[0] + '.</li>'; }).join('') : '<li>No internal chain gaps remain; an authorised gate decision is still separate.</li>') + '</ul>';
        ledger.assurance[0] = accepted + ' of ' + claims.length + ' evidence chains accepted; gate remains ' + (ready ? 'eligible for review' : 'on hold');
        ledger.assurance[2] = blockers.length ? 'Repair ' + blockers.map(function (claim) { return claim.id; }).join(', ') : 'Seek the named authority’s separate gate decision';
        renderLedger();
      }
      document.getElementById('assurance-check').addEventListener('click', computeAssurance);

      var scarcityDemands = [
        { id: 'S1', name: 'Identity boundary pattern', outcome: 'Unblocks three delivery teams', delay: 10, confidence: 90, min: 3, alternative: 'none', reuse: 4 },
        { id: 'S2', name: 'Dashboard hardening', outcome: 'Protects early-adopter release', delay: 7, confidence: 65, min: 2, alternative: 'partial', reuse: 2 },
        { id: 'S3', name: 'Retention design', outcome: 'Clarifies records migration', delay: 9, confidence: 80, min: 3, alternative: 'none', reuse: 3 },
        { id: 'S4', name: 'CI policy template', outcome: 'Creates repeatable assurance', delay: 5, confidence: 70, min: 1, alternative: 'yes', reuse: 5 }
      ];
      function renderScarcityRows() {
        var body = document.getElementById('scarcity-body');
        body.innerHTML = '';
        scarcityDemands.forEach(function (item) {
          var row = document.createElement('tr');
          var title = document.createElement('td');
          title.innerHTML = '<span class="claim-title">' + item.id + ' · ' + item.name + '</span><span class="subtle">' + item.outcome + ' · reuse ' + item.reuse + '</span>';
          var delay = numberCell(item, 'delay', 1, 10, 'Delay cost for ' + item.id);
          var confidence = numberCell(item, 'confidence', 0, 100, 'Evidence confidence for ' + item.id);
          var min = numberCell(item, 'min', 1, 6, 'Minimum useful days for ' + item.id);
          var alt = document.createElement('td');
          var select = document.createElement('select');
          select.setAttribute('aria-label', 'Alternative route for ' + item.id);
          select.dataset.scarcityId = item.id; select.dataset.key = 'alternative';
          ['none', 'partial', 'yes'].forEach(function (value) {
            var option = document.createElement('option'); option.value = value; option.textContent = value; option.selected = item.alternative === value; select.appendChild(option);
          });
          select.addEventListener('change', allocateScarcity);
          alt.appendChild(select);
          [title, delay, confidence, min, alt].forEach(function (cell) { row.appendChild(cell); });
          body.appendChild(row);
        });
      }
      function integer(value, min, max, label) {
        if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
          throw new Error(label + ' must be a whole number from ' + min + ' to ' + max + '.');
        }
        return value;
      }
      function numberCell(object, key, min, max, label) {
        var cell = document.createElement('td');
        var input = document.createElement('input'); input.type = 'number'; input.min = min; input.max = max; input.step = 1;
        input.value = object[key]; input.setAttribute('aria-label', label); input.setAttribute('aria-describedby', 'scarcity-validation');
        input.dataset.scarcityId = object.id; input.dataset.key = key;
        input.addEventListener('change', allocateScarcity);
        cell.appendChild(input); return cell;
      }
      function validatePackage(item) {
        integer(item.delay, 1, 10, 'Delay cost'); integer(item.confidence, 0, 100, 'Evidence confidence');
        integer(item.min, 1, 6, 'Minimum days'); integer(item.reuse, 0, 5, 'Reuse points');
        if (['none', 'partial', 'yes'].indexOf(item.alternative) < 0) throw new Error('Unknown alternative route.');
      }
      function scarcityScore(item) {
        validatePackage(item);
        var alternativeFactor = item.alternative === 'none' ? 1.15 : item.alternative === 'partial' ? 1 : .82;
        return ((item.delay * item.confidence / 100) * alternativeFactor + item.reuse * .55) / item.min;
      }
      function allocatePackages(items, pool) {
        integer(pool, 0, 12, 'Architect-days');
        if (!Array.isArray(items) || items.length > 20) throw new Error('Expected up to 20 packages.');
        items.forEach(validatePackage);
        var ranked = items.slice().sort(function (a, b) { return scarcityScore(b) - scarcityScore(a); });
        var remaining = pool, funded = [], deferred = [];
        ranked.forEach(function (item) {
          if (item.min <= remaining) { funded.push(item); remaining -= item.min; }
          else deferred.push(item);
        });
        return {funded: funded, deferred: deferred, remaining: remaining};
      }
      function readScarcityControls() {
        var controls = Array.from(document.querySelectorAll('#panel-scarcity input[type="number"]'));
        var errors = [];
        controls.forEach(function (input) {
          var valid = input.value.trim() !== '' && Number.isInteger(Number(input.value)) && Number(input.value) >= Number(input.min) && Number(input.value) <= Number(input.max);
          input.setAttribute('aria-invalid', valid ? 'false' : 'true');
          if (!valid) errors.push((input.getAttribute('aria-label') || 'Architect-days available') + ': enter a whole number from ' + input.min + ' to ' + input.max + '.');
        });
        if (errors.length) throw new Error(errors.join(' '));
        var items = scarcityDemands.map(function (item) {
          var next = Object.assign({}, item);
          document.querySelectorAll('[data-scarcity-id="' + item.id + '"]').forEach(function (input) {
            next[input.dataset.key] = input.dataset.key === 'alternative' ? input.value : Number(input.value);
          });
          validatePackage(next); return next;
        });
        return {pool: Number(document.getElementById('scarcity-pool').value), demands: items};
      }
      function allocateScarcity() {
        var settings;
        try { settings = readScarcityControls(); }
        catch (error) {
          document.getElementById('scarcity-validation').textContent = error.message + ' The allocation below still shows the last valid settings.';
          ledger.scarcity[0] = 'Inputs need correction; allocation is from the last valid settings'; renderLedger();
          return false;
        }
        document.getElementById('scarcity-validation').textContent = '';
        scarcityDemands = settings.demands;
        var pool = settings.pool;
        var allocation = allocatePackages(scarcityDemands, pool);
        var remaining = allocation.remaining, funded = allocation.funded, deferred = allocation.deferred;
        var html = '<strong>' + pool + ' architect-days → ' + funded.length + ' useful package(s)</strong><div class="allocation-list">';
        funded.forEach(function (item) {
          html += '<div class="allocation-row"><div><strong>' + item.id + ' · ' + item.name + '</strong><div class="subtle">' + item.outcome + '</div><div class="bar"><span style="width:' + Math.min(100, scarcityScore(item) * 11) + '%"></span></div></div><span class="status good">' + item.min + 'd</span></div>';
        });
        deferred.forEach(function (item) {
          var trigger = item.confidence < 70 ? 'stronger evidence' : item.alternative === 'none' ? 'more capacity or lower delay elsewhere' : 'failure of the alternative route';
          html += '<div class="allocation-row"><div><strong>' + item.id + ' · ' + item.name + '</strong><div class="subtle">Reconsider after ' + trigger + '.</div></div><span class="status warn">defer</span></div>';
        });
        html += '</div><p class="subtle">' + remaining + (deferred.length ? ' day(s) remain; no deferred whole package fits this balance.' : ' day(s) remain after funding every package.') + ' This is a greedy allocation, not a proved optimum.</p>';
        document.getElementById('scarcity-output').innerHTML = html;
        ledger.scarcity[0] = pool + ' days fund ' + (funded.map(function (item) { return item.id; }).join(', ') || 'no complete package') + '; ' + remaining + ' day(s) uncommitted';
        ledger.scarcity[2] = deferred.length ? 'Re-run after evidence, alternatives or capacity change for ' + deferred.map(function (item) { return item.id; }).join(', ') : 'Confirm owners and dates before committing the allocation';
        renderLedger();
      }
      document.getElementById('scarcity-run').addEventListener('click', allocateScarcity);
      document.getElementById('scarcity-pool').addEventListener('change', allocateScarcity);

      var nodes = [
        { id: 'A', name: 'Profile legacy estate', x: 75, y: 170 },
        { id: 'B', name: 'Design target model', x: 215, y: 95 },
        { id: 'C', name: 'Build migration tooling', x: 350, y: 70 },
        { id: 'D', name: 'Migrate pilot domain', x: 490, y: 80 },
        { id: 'E', name: 'Reconcile evidence', x: 490, y: 235 },
        { id: 'G', name: 'Test access pattern', x: 330, y: 260 },
        { id: 'F', name: 'Release decision', x: 625, y: 170 }
      ];
      var edges = [
        { id: 'e1', from: 'A', to: 'B', type: 'precedence', active: true },
        { id: 'e2', from: 'B', to: 'C', type: 'precedence', active: true },
        { id: 'e3', from: 'C', to: 'D', type: 'precedence', active: true },
        { id: 'e4', from: 'D', to: 'E', type: 'evidence', active: true },
        { id: 'e5', from: 'E', to: 'F', type: 'approval', active: true },
        { id: 'e6', from: 'B', to: 'G', type: 'precedence', active: true },
        { id: 'e7', from: 'G', to: 'F', type: 'evidence', active: true },
        { id: 'e8', from: 'E', to: 'B', type: 'feedback', active: true },
        { id: 'e9', from: 'G', to: 'E', type: 'evidence', active: false },
        { id: 'e10', from: 'D', to: 'B', type: 'precedence', active: false }
      ];
      function nodeById(id) { return nodes.filter(function (node) { return node.id === id; })[0]; }
      function renderTopologyControls() {
        var failure = document.getElementById('topology-failure');
        failure.innerHTML = '<option value="">None</option>';
        nodes.filter(function (node) { return node.id !== 'A' && node.id !== 'F'; }).forEach(function (node) {
          var option = document.createElement('option'); option.value = node.id; option.textContent = node.id + ' · ' + node.name; failure.appendChild(option);
        });
        var body = document.getElementById('topology-body');
        body.innerHTML = '';
        edges.forEach(function (edge) {
          var row = document.createElement('tr');
          var link = document.createElement('td'); link.textContent = edge.from + ' → ' + edge.to;
          var type = document.createElement('td'); type.textContent = edge.type;
          var active = document.createElement('td'); active.className = 'check-cell';
          var input = document.createElement('input'); input.type = 'checkbox'; input.checked = edge.active; input.setAttribute('aria-label', 'Activate ' + edge.id + ' ' + edge.from + ' to ' + edge.to);
          input.addEventListener('change', function () { edge.active = input.checked; analyseTopology(); });
          var target = document.createElement('label'); target.className = 'check-target'; target.appendChild(input); active.appendChild(target);
          [link, type, active].forEach(function (cell) { row.appendChild(cell); }); body.appendChild(row);
        });
      }
      function pathExists(from, to, failure, types) {
        if (!nodeById(from) || !nodeById(to)) throw new Error('Unknown path endpoint.');
        if (!Array.isArray(types) || types.some(function (type) { return ['precedence', 'evidence', 'approval', 'feedback'].indexOf(type) < 0; })) throw new Error('Unknown link type.');
        var stack = [from]; var seen = {};
        while (stack.length) {
          var current = stack.pop();
          if (current === failure) continue;
          if (current === to) return true;
          if (seen[current]) continue;
          seen[current] = true;
          edges.forEach(function (edge) {
            if (edge.active && edge.from === current && edge.to !== failure && types.indexOf(edge.type) !== -1) stack.push(edge.to);
          });
        }
        return false;
      }
      function precedenceCycle(failure) {
        var visiting = {}; var visited = {}; var cycle = false;
        function visit(id) {
          if (id === failure || cycle) return;
          if (visiting[id]) { cycle = true; return; }
          if (visited[id]) return;
          visiting[id] = true;
          edges.forEach(function (edge) {
            if (edge.active && edge.type === 'precedence' && edge.from === id && edge.to !== failure) visit(edge.to);
          });
          visiting[id] = false; visited[id] = true;
        }
        nodes.forEach(function (node) { visit(node.id); });
        return cycle;
      }
      function renderNetwork(failure) {
        var edgeGroup = document.getElementById('network-edges'); edgeGroup.innerHTML = '';
        edges.filter(function (edge) { return edge.active; }).forEach(function (edge) {
          var from = nodeById(edge.from); var to = nodeById(edge.to);
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          // Stop at the node borders so the opaque rectangles do not hide arrowheads.
          var dx = to.x - from.x, dy = to.y - from.y;
          var inset = Math.min(55 / Math.abs(dx), 28 / Math.abs(dy));
          line.setAttribute('x1', from.x + dx * inset); line.setAttribute('y1', from.y + dy * inset);
          line.setAttribute('x2', to.x - dx * inset); line.setAttribute('y2', to.y - dy * inset);
          line.setAttribute('class', 'edge ' + edge.type); line.setAttribute('marker-end', 'url(#arrow)');
          if (from.id === failure || to.id === failure) line.setAttribute('opacity', '.18');
          edgeGroup.appendChild(line);
        });
        var nodeGroup = document.getElementById('network-nodes'); nodeGroup.innerHTML = '';
        nodes.forEach(function (node) {
          var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', node.x - 52); rect.setAttribute('y', node.y - 25); rect.setAttribute('width', 104); rect.setAttribute('height', 50); rect.setAttribute('rx', 7);
          rect.setAttribute('class', 'node' + (node.id === failure ? ' failed' : ''));
          var idText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          idText.setAttribute('x', node.x); idText.setAttribute('y', node.y - 5); idText.setAttribute('text-anchor', 'middle'); idText.setAttribute('font-weight', '700'); idText.textContent = node.id;
          var name = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          name.setAttribute('x', node.x); name.setAttribute('y', node.y + 12); name.setAttribute('text-anchor', 'middle'); name.textContent = node.name.length > 18 ? node.name.slice(0, 17) + '…' : node.name;
          group.appendChild(rect); group.appendChild(idText); group.appendChild(name); nodeGroup.appendChild(group);
        });
      }
      function analyseTopology() {
        var failure = document.getElementById('topology-failure').value;
        var cycle = precedenceCycle(failure);
        var deliveryPath = pathExists('A', 'F', failure, ['precedence', 'evidence', 'approval']);
        var evidencePath = pathExists('D', 'F', failure, ['evidence', 'approval']);
        var accessPath = pathExists('G', 'F', failure, ['evidence', 'approval']);
        var feedback = edges.filter(function (edge) { return edge.active && edge.type === 'feedback' && edge.from !== failure && edge.to !== failure; }).length;
        var status = cycle ? 'Infeasible precedence loop' : deliveryPath ? 'A structural path to release remains' : 'No structural path to release remains';
        document.getElementById('topology-output').innerHTML = '<strong>' + status + '</strong><ul>' +
          '<li>Precedence cycle: ' + (cycle ? 'yes — resolve before scheduling' : 'none detected') + '.</li>' +
          '<li>Evidence/approval path D → F: ' + (evidencePath ? 'yes' : 'no') + '; G → F: ' + (accessPath ? 'yes' : 'no') + '. These local paths do not test whether D or G can be reached from A.</li>' +
          '<li>Precedence path A → D: ' + (pathExists('A', 'D', failure, ['precedence']) ? 'yes' : 'no') + '; A → G: ' + (pathExists('A', 'G', failure, ['precedence']) ? 'yes' : 'no') + '. A path alone does not establish completion or approval.</li>' +
          '<li>' + feedback + ' available feedback link(s) are modelled separately; they are not treated as schedule cycles.</li>' +
          (failure ? '<li>Simulated unavailable node: ' + failure + ' · ' + nodeById(failure).name + '.</li>' : '<li>No node outage is being simulated.</li>') + '</ul>';
        renderNetwork(failure);
        document.getElementById('topology-text').innerHTML = '<ul>' + nodes.map(function (node) {
          return '<li>' + node.id + ' — ' + node.name + (node.id === failure ? ' (unavailable)' : '') + '</li>';
        }).join('') + '</ul><p>Active links (excluding the unavailable node):</p><ul>' + edges.filter(function (edge) {
          return edge.active && edge.from !== failure && edge.to !== failure;
        }).map(function (edge) { return '<li>' + edge.from + ' → ' + edge.to + ': ' + edge.type + '</li>'; }).join('') + '</ul>';
        ledger.topology[0] = status + (failure ? ' with ' + failure + ' unavailable' : '');
        ledger.topology[2] = cycle ? 'Remove or retype the precedence loop' : !deliveryPath ? 'Add or restore an owned route to the release decision' : 'Validate optional links and single-owner dependencies';
        renderLedger();
      }
      document.getElementById('topology-analyse').addEventListener('click', analyseTopology);
      document.getElementById('topology-failure').addEventListener('change', analyseTopology);

      var tasks = [
        { id: 'P0', name: 'Observe early-adopter work', deps: [], duration: 2, risk: 2, value: 4, uncertainty: 5, reuse: 2, outcome: false },
        { id: 'P1', name: 'Profile legacy data', deps: [], duration: 2, risk: 5, value: 2, uncertainty: 5, reuse: 3, outcome: false },
        { id: 'P2', name: 'Test access-control pattern', deps: [], duration: 2, risk: 5, value: 3, uncertainty: 4, reuse: 4, outcome: false },
        { id: 'P3', name: 'Migrate customer pilot', deps: ['P1', 'P2'], duration: 3, risk: 4, value: 5, uncertainty: 5, reuse: 4, outcome: true },
        { id: 'P4', name: 'Build ingestion framework', deps: ['P1'], duration: 4, risk: 3, value: 5, uncertainty: 3, reuse: 5, outcome: true },
        { id: 'P5', name: 'Build reconciliation harness', deps: ['P3', 'P4'], duration: 2, risk: 5, value: 4, uncertainty: 4, reuse: 5, outcome: true },
        { id: 'P6', name: 'Release dashboard slice', deps: ['P0', 'P3'], duration: 2, risk: 2, value: 5, uncertainty: 2, reuse: 2, outcome: true },
        { id: 'P7', name: 'Run readiness review', deps: ['P2', 'P5', 'P6'], duration: 1, risk: 5, value: 3, uncertainty: 2, reuse: 3, outcome: false }
      ];
      var policies = [
        { id: 'risk', name: 'Risk-first' },
        { id: 'value', name: 'Value-first' },
        { id: 'learning', name: 'Learning-first' },
        { id: 'reuse', name: 'Reuse-first' },
        { id: 'robust', name: 'Balanced heuristic' }
      ];
      var scenarios = [
        { id: 'base', name: 'Base case', changes: {} },
        { id: 'data', name: 'Data stress', changes: { P1: 2, P3: 1 } },
        { id: 'security', name: 'Access-control stress', changes: { P2: 2, P7: 1 } }
      ];
      function priority(task, policy) {
        if (policy === 'risk') return task.risk * 2 + task.uncertainty - task.duration * .2;
        if (policy === 'value') return task.value * 2 + task.risk * .4 - task.duration * .2;
        if (policy === 'learning') return task.uncertainty * 2 + task.risk * .5 - task.duration * .2;
        if (policy === 'reuse') return task.reuse * 2 + task.value * .4 - task.duration * .2;
        return task.risk + task.value + task.uncertainty + task.reuse - task.duration * .45;
      }
      function simulate(policy, scenario, capacity) {
        integer(capacity, 1, 3, 'Parallel capacity');
        if (!policies.some(function (p) { return p.id === policy; })) throw new Error('Unknown schedule policy.');
        var knownScenario = scenario && scenarios.find(function (s) { return s.id === scenario.id; });
        if (!knownScenario || !scenario.changes || typeof scenario.changes !== 'object' || Array.isArray(scenario.changes) || Object.keys(scenario.changes).length !== Object.keys(knownScenario.changes).length || Object.keys(knownScenario.changes).some(function (id) { return scenario.changes[id] !== knownScenario.changes[id]; })) throw new Error('Unknown duration scenario.');
        var pending = tasks.map(function (task) {
          var copy = Object.assign({}, task); copy.duration = task.duration + (scenario.changes[task.id] || 0); return copy;
        });
        var completed = {}; var running = []; var rows = []; var week = 0;
        while (pending.length || running.length) {
          for (var i = running.length - 1; i >= 0; i -= 1) {
            if (running[i].end <= week) { completed[running[i].id] = true; running.splice(i, 1); }
          }
          var eligible = pending.filter(function (task) { return task.deps.every(function (dep) { return completed[dep]; }); });
          eligible.sort(function (a, b) { return priority(b, policy) - priority(a, policy) || a.id.localeCompare(b.id); });
          while (running.length < capacity && eligible.length) {
            var next = eligible.shift();
            pending.splice(pending.indexOf(next), 1);
            next.start = week; next.end = week + next.duration; running.push(next); rows.push(next);
          }
          if (!running.length && pending.length) throw new Error('Planner deadlock: check task dependencies.');
          if (running.length) week = Math.min.apply(null, running.map(function (task) { return task.end; }));
        }
        var finish = Math.max.apply(null, rows.map(function (task) { return task.end; }));
        var outcomes = rows.filter(function (task) { return task.outcome; });
        var firstOutcome = Math.min.apply(null, outcomes.map(function (task) { return task.end; }));
        var uncertainty6 = rows.filter(function (task) { return task.end > 6; }).reduce(function (sum, task) { return sum + task.uncertainty; }, 0);
        var reuse6 = rows.filter(function (task) { return task.end <= 6; }).reduce(function (sum, task) { return sum + task.reuse; }, 0);
        var riskExposure = rows.reduce(function (sum, task) { return sum + task.risk * task.end; }, 0);
        var objective = finish * 2 + firstOutcome * 3 + uncertainty6 * 1.2 + riskExposure * .18 - reuse6 * .65;
        return { rows: rows, finish: finish, firstOutcome: firstOutcome, uncertainty6: uncertainty6, reuse6: reuse6, objective: objective };
      }
      function runTournament() {
        var capacity = Number(document.getElementById('planner-capacity').value);
        var selectedPolicy = document.getElementById('planner-policy').value;
        var selectedScenario = document.getElementById('planner-scenario').value;
        var scenarioIndex = scenarios.findIndex(function (s) { return s.id === selectedScenario; });
        var results = {};
        policies.forEach(function (policy) {
          results[policy.id] = scenarios.map(function (scenario) { return simulate(policy.id, scenario, capacity); });
        });
        var bestByScenario = scenarios.map(function (scenario, index) {
          return Math.min.apply(null, policies.map(function (policy) { return results[policy.id][index].objective; }));
        });
        var body = document.getElementById('policy-body'); body.innerHTML = '';
        policies.forEach(function (policy) {
          var averageRegret = results[policy.id].reduce(function (sum, result, index) { return sum + result.objective - bestByScenario[index]; }, 0) / scenarios.length;
          policy.regret = averageRegret;
          var base = results[policy.id][0];
          var row = document.createElement('tr');
          if (policy.id === selectedPolicy) row.className = 'selected';
          [policy.name, averageRegret.toFixed(1), 'week ' + base.finish, 'week ' + base.firstOutcome, base.uncertainty6, base.reuse6].forEach(function (value) {
            var cell = document.createElement('td'); cell.textContent = value; row.appendChild(cell);
          });
          body.appendChild(row);
        });
        var selected = results[selectedPolicy][scenarioIndex];
        renderSchedule(selected.rows, selected.finish, selectedPolicy, selectedScenario);
        var minimumRegret = Math.min.apply(null, policies.map(function (p) { return p.regret; }));
        var winners = policies.filter(function (p) { return Math.abs(p.regret - minimumRegret) < 1e-9; }).map(function (p) { return p.name; });
        var winnerNames = winners.join(', ');
        document.getElementById('planner-output').innerHTML = '<strong>Lowest average regret' + (winners.length > 1 ? ' (tie)' : '') + ': ' + winnerNames + '</strong><ul><li>Selected: ' + policyName(selectedPolicy) + ' · ' + scenarios[scenarioIndex].name + '.</li><li>Finish: week ' + selected.finish + '; first assumed outcome: week ' + selected.firstOutcome + '.</li><li>' + selected.uncertainty6 + ' uncertainty points remain at week 6; ' + selected.reuse6 + ' reuse points are completed by then.</li><li>Selected scenario score: ' + selected.objective.toFixed(2) + '. The table retains base metrics and average regret across all three scenarios.</li></ul>';
        ledger.planners[0] = winnerNames + (winners.length > 1 ? ' tie for' : ' has') + ' lowest average regret; selected view is ' + policyName(selectedPolicy) + ' / ' + scenarios[scenarioIndex].name;
        ledger.planners[2] = 'Challenge the scoring rule and stress scenarios before choosing a real policy';
        renderLedger();
      }
      function policyName(id) { return policies.filter(function (policy) { return policy.id === id; })[0].name; }
      function renderSchedule(rows, finish, policy, scenario) {
        document.getElementById('schedule-title').textContent = policyName(policy) + ' · ' + scenarios.find(function (s) { return s.id === scenario; }).name + ' schedule';
        var schedule = document.getElementById('schedule'); schedule.innerHTML = '';
        rows.slice().sort(function (a, b) { return a.start - b.start || a.id.localeCompare(b.id); }).forEach(function (task) {
          var row = document.createElement('div'); row.className = 'schedule-row';
          var label = document.createElement('span'); label.textContent = task.id + ' · ' + task.name;
          var line = document.createElement('div'); line.className = 'timeline';
          var bar = document.createElement('span'); bar.style.left = (task.start / finish * 100) + '%'; bar.style.width = (task.duration / finish * 100) + '%'; line.appendChild(bar);
          var weeks = document.createElement('span'); weeks.textContent = 'w' + task.start + '–' + task.end;
          row.appendChild(label); row.appendChild(line); row.appendChild(weeks); schedule.appendChild(row);
        });
      }
      function initPlannerControls() {
        var select = document.getElementById('planner-policy');
        policies.forEach(function (policy) { var option = document.createElement('option'); option.value = policy.id; option.textContent = policy.name; if (policy.id === 'robust') option.selected = true; select.appendChild(option); });
        select.addEventListener('change', runTournament);
        document.getElementById('planner-capacity').addEventListener('change', runTournament);
        document.getElementById('planner-scenario').addEventListener('change', runTournament);
        document.getElementById('planner-run').addEventListener('click', runTournament);
      }

      function copy(value) { return JSON.parse(JSON.stringify(value)); }
      function exactKeys(value, keys, label) {
        if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== keys.length || Object.keys(value).some(function (key) { return keys.indexOf(key) < 0; })) throw new Error('Unexpected fields in ' + label + '.');
      }
      function choice(value, choices, label) {
        if (choices.indexOf(value) < 0) throw new Error('Unknown ' + label + '.');
        return value;
      }
      function records(value, examples, keys, label, validate) {
        if (!Array.isArray(value) || value.length !== examples.length) throw new Error('Expected all ' + examples.length + ' ' + label + ' records.');
        var ids = new Set();
        value.forEach(function (item) {
          exactKeys(item, keys, label); choice(item.id, examples.map(function (x) { return x.id; }), label + ' ID');
          if (ids.has(item.id)) throw new Error('Duplicate ' + label + ' ID.'); ids.add(item.id); validate(item);
        });
        return examples.map(function (example) { return copy(value.find(function (item) { return item.id === example.id; })); });
      }
      function validateSnapshot(value) {
        exactKeys(value, ['app', 'version', 'demand', 'assurance', 'scarcity', 'topology', 'planner', 'view'], 'snapshot');
        if (value.app !== 'project-frontier-lab' || value.version !== 1) throw new Error('Use a Project Frontier Lab version 1 snapshot.');
        var result = {app: value.app, version: 1};
        result.demand = records(value.demand, demands, ['id', 'action'], 'demand', function (item) { choice(item.action, Object.keys(demandActions), 'demand disposition'); });
        result.assurance = records(value.assurance, claims, ['id', 'activity', 'evidence', 'threshold', 'review'], 'assurance', chainState);
        exactKeys(value.scarcity, ['pool', 'demands'], 'scarcity');
        result.scarcity = {pool: integer(value.scarcity.pool, 0, 12, 'Architect-days'), demands: records(value.scarcity.demands, scarcityDemands, ['id', 'delay', 'confidence', 'min', 'alternative'], 'scarcity', function (item) {
          validatePackage(Object.assign({}, item, {reuse: scarcityDemands.find(function (x) { return x.id === item.id; }).reuse}));
        })};
        exactKeys(value.topology, ['failure', 'edges'], 'topology');
        result.topology = {failure: choice(value.topology.failure, ['', 'B', 'C', 'D', 'E', 'G'], 'unavailable node'), edges: records(value.topology.edges, edges, ['id', 'active'], 'link', function (item) {
          if (typeof item.active !== 'boolean') throw new Error('Link active state must be true or false.');
        })};
        exactKeys(value.planner, ['capacity', 'policy', 'scenario'], 'planner');
        result.planner = {capacity: integer(value.planner.capacity, 1, 3, 'Parallel capacity'), policy: choice(value.planner.policy, policies.map(function (p) { return p.id; }), 'schedule policy'), scenario: choice(value.planner.scenario, scenarios.map(function (s) { return s.id; }), 'duration scenario')};
        result.view = choice(value.view, Object.keys(ledger), 'selected lens');
        return result;
      }
      function snapshot() {
        var scarcity = readScarcityControls();
        return validateSnapshot({
          app: 'project-frontier-lab', version: 1,
          demand: demands.map(function (x) { return {id: x.id, action: x.action}; }),
          assurance: claims.map(function (x) { return {id: x.id, activity: x.activity, evidence: x.evidence, threshold: x.threshold, review: x.review}; }),
          scarcity: {pool: scarcity.pool, demands: scarcity.demands.map(function (x) { return {id: x.id, delay: x.delay, confidence: x.confidence, min: x.min, alternative: x.alternative}; })},
          topology: {failure: document.getElementById('topology-failure').value, edges: edges.map(function (x) { return {id: x.id, active: x.active}; })},
          planner: {capacity: Number(document.getElementById('planner-capacity').value), policy: document.getElementById('planner-policy').value, scenario: document.getElementById('planner-scenario').value},
          view: document.querySelector('[role="tab"][aria-selected="true"]').id.slice(4)
        });
      }
      function restore(value) {
        // Validate the complete snapshot before mutating any lens or control.
        var next = validateSnapshot(value);
        next.demand.forEach(function (item, index) { Object.assign(demands[index], item); });
        next.assurance.forEach(function (item, index) { Object.assign(claims[index], item); });
        next.scarcity.demands.forEach(function (item, index) { Object.assign(scarcityDemands[index], item); });
        next.topology.edges.forEach(function (item, index) { Object.assign(edges[index], item); });
        document.getElementById('scarcity-pool').value = next.scarcity.pool;
        document.getElementById('planner-capacity').value = next.planner.capacity;
        document.getElementById('planner-policy').value = next.planner.policy;
        document.getElementById('planner-scenario').value = next.planner.scenario;
        renderDemandRows(); computeDemand(); renderAssurance(); renderScarcityRows(); allocateScarcity();
        renderTopologyControls(); document.getElementById('topology-failure').value = next.topology.failure; analyseTopology(); runTournament();
        activateTab(document.getElementById('tab-' + next.view));
      }
      function renderTaskInputs() {
        var body = document.getElementById('task-inputs'); body.innerHTML = '';
        tasks.forEach(function (task) {
          var row = document.createElement('tr');
          [task.id + ' · ' + task.name, task.deps.join(', ') || 'None', task.duration, task.risk, task.value, task.uncertainty, task.reuse, task.outcome ? 'Assumed on completion' : 'No'].forEach(function (value) {
            var cell = document.createElement('td'); cell.textContent = value; row.appendChild(cell);
          });
          body.appendChild(row);
        });
      }

      activateTab(tabs[0]);
      renderDemandRows();
      computeDemand();
      renderAssurance();
      renderScarcityRows();
      allocateScarcity();
      renderTopologyControls();
      analyseTopology();
      initPlannerControls();
      renderTaskInputs();
      runTournament();
      renderLedger();
      var original = snapshot();
      document.getElementById('state-export').addEventListener('click', function () {
        try {
          var text = document.getElementById('state-json'); text.value = JSON.stringify(snapshot(), null, 2);
          text.focus(); text.select(); document.getElementById('state-status').textContent = 'Settings exported below. Copy the selected text to keep it.';
        } catch (error) { document.getElementById('state-status').textContent = 'Cannot export: ' + error.message; }
      });
      document.getElementById('state-import').addEventListener('click', function () {
        try {
          var text = document.getElementById('state-json').value;
          if (text.length > 20000) throw new Error('The snapshot exceeds 20,000 characters.');
          restore(JSON.parse(text)); document.getElementById('state-status').textContent = 'Settings restored. All five lenses were recalculated.';
        } catch (error) { document.getElementById('state-status').textContent = 'Settings were not loaded: ' + error.message; }
      });
      document.getElementById('state-reset').addEventListener('click', function () {
        restore(original); document.getElementById('state-status').textContent = 'Original example restored. Any exported text remains available above.';
      });
      // Model definitions and settings are returned as copies; edits use restore's validation.
      window.FrontierLab = Object.freeze({
        snapshot: snapshot, validateSnapshot: validateSnapshot, restore: restore, chainState: chainState,
        scarcityScore: scarcityScore, allocatePackages: allocatePackages, simulate: simulate,
        pathExists: pathExists, precedenceCycle: precedenceCycle,
        example: function () { return copy(original); },
        model: function () { return copy({tasks: tasks, policies: policies.map(function (p) { return {id: p.id, name: p.name}; }), scenarios: scenarios}); }
      });
    }());
