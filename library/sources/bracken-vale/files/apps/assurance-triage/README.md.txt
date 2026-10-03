# Consequential assurance triage — 8.3

Eight invented concerns carry cited passages and explicit human-declared consequence, evidence status, prior concern and effort hours. No NLP or sentiment extraction is claimed. The rule reads the fields, and the user must check them against the source text.

The transparent attention index is consequence points (high 6, medium 3, low 1, unknown 3) + evidence points (missing 4, contested 3, unknown 2, supplied 0) + 2 for prior concern + 1 when consequence is unknown or evidence missing/unknown. That final condition also creates an uncertainty flag. Points are neither safety scores nor probabilities. Independently of points, high consequence with missing/contested/unknown evidence is escalated. AT1's missing test/handback-evidence concern has 13 points and mandatory escalation in this invented policy.

**Allocate review capacity** applies a disclosed greedy rule: walk rank order and select non-deferred items that fit remaining whole review hours. Escalations stay above ordinary concerns. Unallocated and explicitly deferred concerns remain visible, including an “ESCALATED AND UNASSESSED” banner where appropriate. This is not an optimal allocation algorithm and never removes an underlying review need.

**Inspect** opens exact passages, field editing and reasons. **Record reasoned override** requires reviewer and explanation, preserves original input/result, and can raise within an escalation band, defer allocation or restore ordinary ordering. It cannot erase escalation or declare evidence adequate. Changed input makes prior overrides stale; validation recomputes original results to detect forged imports.

Compared with opaque traffic lights, the queue exposes rules and exclusions. No assurance approval, engineering acceptance or operational permission occurs. Real extraction, held-out severe-case recall and representative-corpus ranking validation remain open. Tests cover the 13-point reference, severe gap escalation, scarce capacity, uncertainty, reasoned overrides, staleness, forged results and atomic invalid inputs/reopen.
