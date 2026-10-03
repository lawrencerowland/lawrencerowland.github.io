# HS2 Elite — retained game and repair inventory

Reviewed 3 October 2026. Canonical home: `/wider-interest/hs2-elite/`.

This is a small independent fictional space-trading game. Railway place names, legacy outpost labels and construction-related cargo supply the joke. Geometry, commodity prices, distances, physics and commerce are invented. The page does not describe or promise any real railway route, station opening, service or project outcome.

## Source identity and scope

- Original: `lawrencerowland/Project-web-apps`, `web_apps/HS2-elite.html`, 842 lines, titled **HS2 Elite — Intuitive Thrust Edition**.
- Reviewed source SHA-256: `fe7f0568c39e97407dd360d77d78d555abe23b19d38e9cd99576dc704630a2b3`.
- The complete original was read, including touch controls and its hidden Shift/Control thrust modifiers. This is a revised implementation retaining its playable scope, not a verbatim archival copy.
- `index.html`, `style.css`, `model.js` and `game.js` are the complete maintained runtime. No library, CDN, build step, external imagery or persistence service is required. Original-source retirement and wider-interest discovery are handled by the parent migration.

## Feature disposition

| Original feature or explanation | Retained home and disposition |
| --- | --- |
| Six named outposts with distinct positions and types | All retained exactly in `model.js`: Euston (0,0,0; terminus), Old Oak Common (300,50,-200; interchange), West Ruislip (600,-30,300; tunnel portal), Chiltern Tunnel (900,100,-100; TBM site), Birmingham Int. (1200,-80,250; station), Curzon Street (1500,20,0; terminus). The name and type are game labels. |
| Consultants, Concrete, Steel rails, TBM parts, Signalling tech, Env. reports | All six retained, including source base prices (£500/100/300/800/600/200) and variance factors (.3/.2/.25/.4/.35/.5). The label “Consultants” remains the original humorous commodity name, not a literal person-trading claim. |
| £10,000 starting credits; 20 cargo slots; 100 fuel | Retained. One slot per unit; individual buy and sell buttons; visible owned counts, affordability and cargo limit. |
| Markets and station-to-station price differences | Retained. Generate once per station per new game using a seeded random generator. Reopening, holding M, buying, selling and returning cannot reroll prices. Buy and sell use the same local price; no local profit loop. Tests use fixed seeds, normal games use a fresh seed. |
| Free 3D flight; WASD pitch/yaw; QE roll | Retained. Rotation is available with thrust released. Pitch/yaw are relative to the rolled cockpit. All rotation and movement are simulation-time based. |
| Click/tap auto orientation | Retained, corrected. Unproject the clicked point using the same camera basis, focal length and CSS dimensions as drawing. Includes yaw, pitch and roll; centre click means current forward. Automatic turning follows the short yaw arc. Thrust and manual steering cancel auto aiming. |
| Forward Space and reverse X, with fine Shift and boost Control | All retained and explained. A visible Fine/Normal/Boost selector makes every mode available to touch users. Fine/normal/boost use accelerations 15/45/150 m/s² and fuel .35/.96/3.6 units per second. These are intentionally retuned arcade values, not railway or spacecraft dynamics. |
| Inertia, drag, fuel depletion and coast-to-steer interaction | Retained. Exact damped integration inside 120 Hz fixed steps removes render-rate dependence. Normal drag .75/s; added brake assistance 3.8/s. Fuel is clamped at zero and final fuel is consumed proportionately. |
| Wireframe cube stations with rotating docking-port squares | Retained, with near-plane line clipping, responsive high-DPI drawing, restrained star field and selected-destination colour. Reduced-motion preference stops decorative port rotation. Flight motion remains intrinsic to playing. |
| Bright cyan thrust direction and crosshair | Corrected to the cockpit centre: forward is always the centre in a ship-relative view. An amber drift ring/line separately shows actual velocity. Aft or off-screen drift is stated. The old world-X/Y arrow gave a misleading direction once the ship turned. |
| Compass, heading, pitch, speed, thrust, location and nearest station HUD | Retained as canvas bearing indicator plus ordinary text instruments. Speed is now consistently game metres/second. In flight, location says “Free flight” rather than incorrectly retaining the last station as the current one. Fuel, nearest distance and explicit docking thresholds remain visible. |
| Automatic docking under distance/speed thresholds; free refuelling | Retained: distance below 50 game metres and speed below 5 m/s. Docking is now an explicit stable state, stops motion, refills immediately and records a visit. Markets cannot allow invisible flight. A docked berth camera presents the station at a useful viewing distance. |
| Undock action and backward push | Retained, now exits dock state explicitly, closes the market, clears inputs and moves to an 80 m departure point with 9 m/s reverse motion. A station lock prevents immediate redocking and clears beyond 90 m. |
| Market close/Escape | Retained as a native modal dialog with focus containment and named controls. Closing keeps the ship docked; “Undock and fly” launches. No continuously held market key can rebuild the dialog or prices. |
| Touch pads and flight activation instructions | Retained with semantic hold buttons, pointer capture, multi-touch, cancellation/release cleanup and native keyboard activation. All controls fit a narrow column below the view, including roll, reverse, fine and boost. Browser zoom is permitted. |
| On-screen messages and flight/trade explanation | Retained in persistent text and a polite status region, with pocket-guide steps, full keyboard notes and a honest note that visual flight is not fully nonvisual. No autoplay focus grab. |
| Initial free-space approach to Euston | Deliberately changed: start docked at Euston so first-time users can see all six commodities and learn the market immediately. Free-space flight begins with the explicit Undock button. |
| Old card-index link | Replaced by a single canonical Wider interest home and two `/wider-interest/` return links. No new top-level navigation route. |

## Proportionate additions

- Destination selection and explicit “Aim at destination” help find outposts outside the field of view; this orients only and is not an autopilot. A visited count offers an optional goal.
- Pause/Resume (P) and Escape pause, window/tab loss pauses, and keyboard focus leaving the cockpit pauses. Held keyboard and pointer input is cleared. Time is not caught up on return; any unexpected frame stall advances at most .1 seconds.
- Market, docked and paused states freeze the flight simulation. A return from another app always needs explicit Resume. Page scrolling without a focus change is not a pause; the button is always available above the view.
- Brake assistance makes the low-speed docking threshold usable. Reverse remains genuine reverse thrust, not an instant stop.
- A confirmed tow recovers a stranded ship to the nearest outpost for up to £250, preserving cargo and refuelling. It is an explicit arcade recovery convenience, not an economically optimal transport simulator. A confirmed new game resets all state and regenerates prices.
- Session-only state is explicit. No unrequested cloud save, authentication, analytics dependency or account system was added. Refresh is a new game.

## Validation and remaining boundary

Run `node --test tests/final-elite.test.cjs` from the site root. Tests cover retained data, market stability and all-goods trading, credit/capacity/location guards, camera-ray round trips including roll, shortest-angle auto orientation, 30/60/144 Hz equivalence, three thrust modes, reverse and fuel, pause/market/dock freezes, bounded stalled frames, all-station docking/undocking, approach thresholds, brake, recovery and a complete untowed Euston-to-Old-Oak flight.

Static checks also cover accessible markup, dependency-free resources, focus-loss and pointer cancellation hooks. These checks do not substitute for a real browser, keyboard or mobile journey. The parent migration owns real CUA visual checks, site build, route/link checks, publication and served-page verification. No browser automation/headless tools were used for this implementation.
