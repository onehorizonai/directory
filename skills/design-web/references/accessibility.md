# Accessibility (design-side)

On-demand guidance for [../SKILL.md](../SKILL.md). Load **after**
[ui-reasoning.md](ui-reasoning.md) and [states.md](states.md) exist —
accessibility is part of each use case, not a final paint pass. Covers
contrast, focus, naming, targets, motion preference, reading order, and
inclusive perception. **Not** ARIA attribute recipes or component-library
wiring — those are implementation, not design.

Baseline intent: **WCAG 2.2 Level AA** unless the product standard says
otherwise.

## Perceivable

- Text contrast: aim ≥**4.5:1** normal text, ≥**3:1** large text and
  meaningful UI chrome (icons, input borders, focus rings against
  adjacent colors).
- Color is never the only cue for state, error, or required — pair with
  text, icon, or pattern.
- Charts and status: distinguishable under common color-vision
  deficiencies (prefer blue–orange over red–green alone).
- Informative images need text alternatives in the design (caption or
  described purpose); decorative images marked as such in handoff.
- Don’t ship designs that require pinch-zoom to be disabled; reflow to
  ~320 CSS px width without essential loss (see
  [responsive-adaptive.md](responsive-adaptive.md)).
- At 200% zoom, primary tasks remain usable; avoid fixed viewports that
  clip content.

## Operable

- Visible focus for every interactive control; stronger than surrounding
  chrome; never “no focus because it looks cleaner.”
- Hit targets ~**44×44** CSS px for pointer/touch primary controls;
  adequate spacing between adjacent targets.
- Keyboard: full task path; logical tab order = reading order; Escape
  closes overlays; no traps.
- Motion: honor **prefers-reduced-motion** — provide still or minimal
  fade alternatives; don’t hide meaning behind motion-only reveals;
  autoplay motion needs pause/stop when it competes with content.
- Timeouts and sessions: warn before expiry; extend without data loss
  when possible.

## Understandable

- Control **names** match visible labels; icon-only controls get a
  human-readable name in the handoff.
- Heading and landmark structure planned as an outline (one clear h1
  job, nested sections) — visual size may be quieter than semantic rank.
- Errors identified in text and associated with fields; suggestions when
  known.
- Consistent navigation and action vocabulary across pages.
- Language/locale switches are explicit user choices; don’t hard-trap by
  IP (see [hardening-and-edge-cases.md](hardening-and-edge-cases.md)).

## Reading order and structure

- Visual order matches the intended screen-reader / keyboard order;
  don’t rearrange with visuals alone in ways that scramble sequence.
- Group related controls (fieldset-like groupings) in the design.
- Skip link or equivalent path to main content on content-heavy pages.
- Tables for tabular data in the design intent (headers clear); don’t
  fake grids of data as unlabeled cards when comparison matters —
  or provide a table alternative (see [data-heavy-ui.md](data-heavy-ui.md)).

## Inclusive states

- Disabled: explain how to unlock; don’t leave mute controls with no
  path.
- Loading and live updates: design non-visual announcement intent
  (“status region”) without specifying ARIA syntax here.
- Auth and permission walls: plain language recovery (sign in, request
  access) — see [forms-and-input.md](forms-and-input.md).


## Target size and spacing (design)

- Primary and frequent controls meet ~44×44 CSS px; secondary icon hits
  can be visually smaller only if the hit area is enlarged invisibly in
  implementation notes. WCAG 2.2 AA floor is 24×24 CSS px; do not treat
  that floor as the design size.
- Maintain clear separation between adjacent targets (especially in
  toolbars and table row actions).
- Sticky footers / floating CTAs must clear system gestures and safe areas
  and must not cover focused fields.

## WCAG 2.2 AA (named outcomes)

These are design contracts, not ARIA snippets. Fetch current WCAG text
if a number is in dispute.

- **Focus not obscured** — sticky headers, banners, chat widgets, and
  floating CTAs must not cover the focused control. Offset scroll
  padding to match chrome height.
- **Dragging** — author-controlled drag (reorder, resize, select) needs
  a single-pointer non-drag path (Move up / Move down, menu, tap to
  move) plus keyboard.
- **Accessible authentication** — allow paste and password managers.
  Do not require memorizing or transcribing a secret as the only path.
- **Redundant entry** — do not ask for information already supplied in
  the same process unless re-entry is essential.
- **Consistent help** — repeated help stays in the same relative place
  across the page set.
- **Target size** — AA pointer-target floor is 24×24 CSS px; keep ~44×44
  as the touch design target for primary controls (see
  [structure-hierarchy.md](structure-hierarchy.md)).
- **Auto-rotation** — carousels and moving content have pause/stop and
  stop on focus or reduced motion.

## Forms and status (design contract)

- Every input has a persistent visible label in the mock.
- Error and success are visible as text (and optional icon), not hue alone.
- Async status (saving, saved, failed) has a defined place in the layout
  and a non-visual announcement intent for assistive tech.

## Anti-patterns

- Contrast theater (light gray body on white “for aesthetics”)
- Focus outline removed with no replacement
- Color-only errors / required markers
- Tiny or overlapping targets
- Motion-only information; infinite autoplay without control
- Placeholder-only labels; unlabeled icon buttons
- `user-scalable=no` / locked zoom as a design requirement
- Heading levels chosen only for visual size
- Drag-only reorder; auth that blocks paste or password managers

## Verification

- [ ] Contrast targets met for text and critical UI
- [ ] Meaning survives grayscale and color-vision simulation
- [ ] Focus appearance specified; keyboard path complete
- [ ] Names for icon-only and unlabeled controls listed
- [ ] Targets and spacing adequate for touch
- [ ] Reduced-motion alternatives specified
- [ ] Reading order / heading outline intentional
- [ ] Zoom and reflow considered for primary flows

## Official links

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI: Easy checks](https://www.w3.org/WAI/test-evaluate/preliminary/)
- Live UI rules (a11y/focus): [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
