# Project Management Pong — preservation and repair

Reviewed and rebuilt 2026-10-03. This page is a playful project-management diversion with a single home under Wider interest. It has no network dependencies, storage, build step, or framework. The playable model and interface are embedded in `index.html`; the marked `pong-model` script also runs independently of the browser for tests.

## Source identity

- Earlier repository: `lawrencerowland/Project-web-apps`.
- Original path: `web_apps/project-management-pong.html`.
- Reviewed local source: `/private/tmp/project-web-controls-retirement-20261002/web_apps/project-management-pong.html`.
- SHA-256 of the complete reviewed source: `a532bd66c209b0c153059b6ed8917c4aaa366c97c0a71b121896d9f5ba81330f`.
- Reviewed in full: 600 × 400 canvas, styling, introduction, all eight feature explanations, controls, drawing code, keyboard handlers, paddle AI, collisions, scope changes, miss/serve behaviour, start and reset.
- The source has one game mode. It contains no additional scenario, dataset, difficulty mode, or authored essay hidden behind the feature overlay.

## Feature inventory and disposition

| Source feature | Preserved content and final behaviour |
| --- | --- |
| Project Manager bottom paddle; Programme Manager computer paddle at top | Retained roles, visible court labels, and computer tracking. The player's paddle now controls the return angle, making a centre hit meaningful. |
| Scope begins at 1.0, target 10.0, floor 0.5 | Retained values. “Scope” is explicitly an invented game quantity, never completed work. |
| Growing ball; slower movement at higher scope | Retained. Ball area follows scope (`radius = 10 × sqrt(scope)`) and movement slows with the square root of scope so the court stays usable. |
| One week per paddle hit | Retained as an exchange, also labelled a “toy week”. Wall contacts and misses do not increment it. It is not a forecast of elapsed project time. |
| Left problems wall: ×0.3 horizontal speed, −0.2 scope | Retained with minimum/maximum horizontal speeds to avoid a near-stationary or excessively fast ball. |
| Right superficial-progress wall: ×1.3 horizontal speed, −0.2 scope | Retained with the same speed bounds. Text accurately says sideways acceleration, not sustained productivity. |
| Direct communication and +0.4 scope | Retained as a completed project-to-programme transfer, starting from the middle 60% of the player's paddle, with no wall contact or miss. A dashed visual cue shows eligibility. |
| Programme miss: +0.5 scope | Retained as work falling back to the project. The counter-intuitive scoring incentive is explained prominently, including that it can trigger the target. |
| Project miss: −0.3 scope | Retained as dropped requirements. |
| A miss serves another ball and retains score | Retained. Alternating deterministic serve directions replace randomness, making behaviour reproducible without affecting the central metaphor. |
| Start and reset | Retained; reset clears all game state and scores while preserving the user's assistance preference. Added explicit pause/resume. |
| Feature overlay | All useful content moved into persistent rules and a native disclosure. No inaccessible close glyph, overlay, or focus trap remains. |
| “Average project duration” / 52-week target | Unsupported factual claim removed. 52 remains only as an expressly fictional optional exchange challenge, with no loss condition. |
| Return to old card index | Replaced with `/wider-interest/`. |

## Repairs and deliberate clarifications

- **Repeated collision counting:** collisions require travel toward the paddle and crossing its front plane. The ball is separated after a hit; departing overlap cannot count again. Circle/paddle overlap includes edge contacts. A ball already behind the paddle cannot be rescued by moving underneath it.
- **Display-rate dependence:** a fixed 120 Hz simulation runs using elapsed seconds. 30, 60 and 144 Hz frame schedules produce the same game state. Frame stalls are capped at 0.1 seconds so resuming rendering does not teleport the ball.
- **Pause and animation ownership:** one animation loop runs only while playing. Pause, reset, tab hiding and window blur clear controls and clock timing. Completed games cannot be restarted without reset.
- **Scope semantics:** the old introduction said “completed scope”, while its rules rewarded programme misses, dropped requirements and communication. The page consistently describes game scope, states that target attainment is not delivery, and explicitly names the awkward incentive.
- **Passive growth claim:** the original explanation said scope grew over time, but its actual model changed scope only on events. The rebuilt explanation matches the event-driven implementation.
- **Direct communication:** the original awarded growth on a bottom-paddle hit based on a prior-hit flag, including initial/reset states; it did not verify delivery to the programme paddle or intervening wall contacts. The new model awards only a completed clean transfer.
- **Paddle aiming:** centre contacts now aim vertically and off-centre contacts aim sideways. This gives the user a practical way to create direct communication rather than relying on a fixed horizontal velocity.
- **Usability:** responsive court, large touch buttons, pointer dragging with capture, native paddle-position slider, scoped keyboard handling, automatic pause on leaving the page, and optional assisted play. Rules and scores are available as text. Events use a polite live region, not per-frame announcements. The dynamic spatial game still relies on visual feedback for precise manual aiming; assisted play and text events offer a way to inspect the metaphor without precise aiming.

## Validation

Run `node --test tests/final-pong.test.cjs` from the repository root. All 16 tests passed at handoff. Tests execute the shipped model directly, including collision direction/separation, direct-transfer eligibility, wall effects, scope floor/target, both kinds of miss, terminal state, pause, stalled frames, display-rate equivalence, paddle bounds, size/speed coupling and an entire assisted rally to completion. A page contract check covers essential controls, text and absence of external scripts.

Browser and deployed-route checks are owned by the parent retirement task. They are a separate boundary from passing these model tests; no browser inspection was performed by this implementation subtask.
