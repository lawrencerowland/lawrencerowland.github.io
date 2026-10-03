# Door moisture sensitivity experiment

A bounded Wider interest toy at `/wider-interest/door-moisture-model/`. The page illustrates an assumed one-dimensional gap budget. It is not a calibrated timber, masonry, historic-building or door-operability assessment.

## Source and provenance

- Original repository: [lawrencerowland/Project-web-apps](https://github.com/lawrencerowland/Project-web-apps).
- Source revision inspected: `5c22c99719ea0a7940aac47574fd0cb8511a4b79`.
- Source file: [`web_apps/door-moisture-model.html`](https://github.com/lawrencerowland/Project-web-apps/blob/5c22c99719ea0a7940aac47574fd0cb8511a4b79/web_apps/door-moisture-model.html).
- SHA-256 of the complete original file: `7da9f517f6667542b538d1836d99c1a345c13d4736a2abda77d607f5b5193c30`.
- Reviewed in full: all 70 lines, including the four controls, constants, update function, copy and return link.
- Replacement prepared: 3 October 2026. This note establishes source review and local verification; publication and source retirement belong to the parent migration receipt.

## Feature and repair inventory

| Original feature or claim | Retained or repaired behaviour |
| --- | --- |
| Door slider, 6–28, step 0.1, default 12 | Same domain, increments and default. Label repaired to wood moisture content (MC), with percentage units. |
| Jamb slider, 6–28, step 0.1, default 12 | Same domain, increments and default; explains what the jamb is. |
| Wall slider, 0–1, step 0.01, default 0.2 | Same control and arithmetic. Reframed as an assumed independent inward wall/frame shift, 0–1.5 mm; removes unsupported sandstone moisture calibration. |
| Initial-clearance slider, 0–10 mm, step 0.1, default 3 | Same control, now explicitly the gap at both reference moisture values and zero frame shift. |
| Live value readouts | Preserved with units, native range semantics, explicit labels and `aria-valuetext`. |
| Door coefficient 0.25, jamb coefficient 0.20 | Preserved exactly, explicitly mm per percentage point of MC; assumed edge sensitivities, not species constants. |
| Wall coefficient 1.5 | Preserved exactly as mm per unit of the dimensionless control. |
| Reference of 12% | Preserved numerically. Unsupported “indoor Cumbrian average” claim removed. It is a chosen reference state. |
| “Effective moisture content (EMC)” | Corrected: EMC means equilibrium moisture content; the sliders now set assumed MC directly. No humidity-to-moisture or time model is claimed. |
| Linear equation and signed swelling/shrinkage | Preserved. Drier-than-reference timber opens the modelled gap. Jamb movement is explicitly assumed inward. |
| Default output 2.70 mm | Preserved exactly. Two-decimal output described as arithmetic precision, not measurement accuracy. |
| “Door free” / “Door likely sticks” | Replaced by positive modelled gap / first contact / unmet clearance demand. Negative clearance is explicitly unconstrained overlap, not physical penetration. |
| Seventeenth-century Cumbrian scene | Retained as the original motivating scene, with no historical or material calibration implied. |
| Return to Card Index | Replaced by top and bottom returns to the single Wider interest home. |

The original had no additional tabs, data, export, save, animation or other feature to preserve. Added interpretation consists of four illustrative settings (including a reset), a scale-consistent edge diagram, a signed contribution table and a door-only sensitivity sweep with a calculated contact threshold. All use the same pure model. No external scripts, fonts, server calls or browser storage are required.

## Model contract

`gap = clearance − 0.25 × (door − 12) − 0.20 × (jamb − 12) − 1.50 × wall`

The MC values are percentage values (12 means 12%, not 0.12). The coefficients already stand in for missing timber size, grain direction and restraint. No further timber-width multiplication is appropriate. Movement factor is independent of both MC controls and always closes the gap. Each timber has one spatially uniform assumed MC value. The model does not enforce contact or compute force.

The pure model rejects missing, non-numeric, non-finite and out-of-domain inputs. It copies inputs and exposes frozen constants and examples. Roundoff within `1e-10` mm is normalized to exact zero. A positive raw gap, rather than its displayed rounded value, determines the status. Valid endpoints give a global gap envelope of −8.70 to +12.70 mm.

SVG cross-section displacement uses 20 viewBox units per millimetre; timber widths are schematic. Dashed lines locate the current reference-clearance edges. Hatching represents arithmetic overlap only. The sweep uses a fixed vertical scale, retains the other three controls, and states when the contact threshold is outside 6–28% MC. The numeric result and table provide text alternatives to the graphics. Disabled controls and an explanatory message remain if initialization fails.

## Evidence boundary

Primary reference: Glass, S. V. and Zelinka, S. L. (2021), [Wood Handbook, Chapter 4: Moisture Relations and Physical Properties of Wood](https://research.fs.usda.gov/treesearch/62243), [chapter PDF](https://research.fs.usda.gov/download/treesearch/62243.pdf), pp. 4–1, 4–3, 4–7 and 4–10. Inspected for MC and EMC definitions, direction-dependent movement, fibre saturation and limitations of a linear approximation. It supports the terminology and limitations only. None of the retained numerical coefficients is represented as coming from that source.

## Verification

Run from the repository root:

```sh
node tests/final-door.test.cjs
```

Eight groups pass: original/default hand calculations; percentage-point dimensions and directions; an independent integer-micrometre oracle over 2,400 settings; all 16 endpoint combinations and global extrema; contact and near-contact; sweep and inverse contact threshold (including out-of-domain contact); invalid inputs; and static public-page/accessibility/asset contracts. Optional `node tests/final-door.test.cjs <build-directory>` also requires the four built public assets to match their tested source bytes.

Model and static checks are complete. Browser, mobile and keyboard journeys, the site build, shared metadata, deployment and served-byte checks are owned by the parent migration work and are not certified by this note.
