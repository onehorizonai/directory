# Wearable — Apple Watch (watchOS)

On-demand platform guidance for [../SKILL.md](../SKILL.md). Load when
designing for **Apple Watch / watchOS**. Apply after
[ui-reasoning.md](ui-reasoning.md) — this file is OS chrome, not the
starting model.

**Not a small iPhone.** An iPhone UI shrunk onto the wrist is a failed
watchOS design. Prefer native watchOS patterns, glanceability, and low
interaction cost. For the companion iPhone experience, load
[mobile-ios.md](mobile-ios.md) separately — do not let phone IA dictate
Watch UI.

## Official sources (prefer these)

- [Designing for watchOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos)
- [Digital Crown](https://developer.apple.com/design/human-interface-guidelines/digital-crown)
- [Complications](https://developer.apple.com/design/human-interface-guidelines/complications) /
  [WidgetKit accessory widgets](https://developer.apple.com/documentation/widgetkit/creating-accessory-widgets-and-watch-complications)
- [Notifications](https://developer.apple.com/design/human-interface-guidelines/notifications)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- Cross-check unofficial writeups against the Apple docs above before
  treating them as normative; Apple docs win on conflict.

## Core principles

1. **Glanceable** — key information readable within about **two seconds**
   of wrist raise, ideally **without scrolling**.
2. **Short sessions** — design for raise → act → wrist down (seconds, not
   minutes). Cut steps ruthlessly.
3. **One job per screen** — a single primary message or action; secondary
   detail is progressive.
4. **Crown-first navigation** — from watchOS 10, the Digital Crown is the
   primary way people move through vertical lists, pages, and tabs; back
   touch with equivalent gestures.
5. **Prefer native controls** — system lists, buttons, toggles, sheets,
   and gauges over custom chrome that fights the platform.

## Glanceability and hierarchy

- Put the **most important value or status** largest and highest contrast
  on the first screen.
- Prefer numbers, SF Symbols, and short labels over sentences.
- Avoid dense tables, multi-column layouts, and iPhone-style card grids.
- If content needs a long read or multi-step form, design a **Watch slice**
  (status + one action) and continue the deep work on iPhone — not a
  miniature phone flow.
- Truncate aggressively; never require a scroll to discover why the app
  opened.

## Interaction cost

- Primary action reachable in **one tap** (or Crown + tap) from launch or
  from a complication deep link.
- Avoid deep trees (keep hierarchy shallow — roughly 2–3 levels max).
- Avoid hamburger menus, settings mazes, and multi-page wizards.
- Confirmations: keep rare and focused; prefer undo/toast-style recovery
  when the platform allows over multi-step dialogs.

## Digital Crown

- Anchor scrolling and value adjustment to the Crown; provide matching
  touch scroll where content scrolls.
- Discrete values should feel detent-like (haptic + visible step).
- Do **not** consume Crown presses — the system owns Home / system
  gestures.
- Provide **immediate visual feedback** while the Crown turns; do not
  batch UI updates until the gesture ends.
- Do not fight system Crown uses (volume, system UI scroll, complication
  time travel where applicable).

## Touch and targets

- Use generous hit targets; prefer full-width list rows and system buttons
  over tiny icon clusters.
- Prefer vertical lists and large controls; precision drag is hard on the
  wrist.
- Support Double Tap / Action Button only as optional accelerators where
  hardware exists — never as the only path.

## Scrolling and layout

- Design for **vertical** motion (Crown + swipe).
- Prefer `List` / vertical page tabs over sideways “app drawer” metaphors.
- Account for rounded corners and the status area; keep critical content
  in the safe, readable region.
- Test across Watch sizes (compact through Ultra) — layouts must adapt
  without fixed phone-style breakpoints.

## Navigation patterns

| Need | Prefer |
| --- | --- |
| Top-level sections | Vertical page `TabView` (watchOS 10+) |
| Hierarchical detail | Shallow `NavigationStack` |
| Focused task | Sheet / confirmation |
| Long content | Crown-scrollable list, not multi-column |

Avoid iPhone sidebar/tab-bar clones, split views, and deep modal stacks.

## Controls, sheets, confirmations

- Prefer system buttons, toggles, pickers, and gauges.
- Sheets for short, single-purpose tasks (confirm, pick one value) — not
  primary navigation.
- Destructive actions need clear labeling and a deliberate confirm when
  irreversible; keep copy tiny.

## Complications and Smart Stack

- Complications are often the **real** product surface — design them
  first, not as an afterthought.
- Support multiple accessory families when useful (`circular`, `corner`,
  `rectangular`, `inline`).
- Content must read at a glance **without** launching the app; include
  units/context in the few characters available.
- Tint/full-color: remain legible when the face applies a single tint.
- Tap → open the **relevant** app context, not a generic home.
- Smart Stack / widgets: surface timely, relevant slices; relevance
  should match real urgency (not always-on noise).
- Prefer **WidgetKit** for new work; do not design around legacy ClockKit
  families for new apps.

## Notifications

- Short Look: title + identity must communicate purpose instantly.
- Long Look: concise body + few high-value actions (avoid “open app” as
  the only option when an inline action exists).
- Watch notifications are for **time-sensitive / actionable** events — not
  a mirror of every phone notification.
- Match haptic intensity to urgency; do not over-notify (users disable
  noisy apps).

## Always On and wrist behavior

- On wrist-down / reduced luminance: simplify — drop motion, secondary
  chrome, and **sensitive** content (messages, health, finance).
- Avoid layout jumps between active and Always On.
- Do not assume continuous attention; pause non-critical work when inactive.

## Typography, symbols, motion, haptics

- Use **system text styles** and Dynamic Type; do not hardcode dense phone
  type scales.
- Prefer SF Symbols with clear meaning; pair icons with labels when
  ambiguous.
- Motion: short, purposeful; respect Reduce Motion; no decorative loops
  on Always On. Do not infer Always On redaction from the full-color
  face; design the dimmed state.
- Haptics: milestone and confirmation cues (especially workouts) when
  eyes are off the screen; avoid constant buzz.

## Accessibility

- Meaningful labels on every control (never raw symbol names alone).
- Full VoiceOver path through primary tasks.
- Values/hints on gauges and custom controls.
- Bold Text / Increase Contrast / Reduce Motion respected.
- Complications must remain understandable under assistive tech where
  applicable.

## Companion iPhone apps

- Phone and Watch are **two experiences**, not one responsive layout.
- Watch: status, quick actions, sensors, complications, timely alerts.
- Phone: setup, history, heavy editing, long reading.
- Never require the Watch to complete a flow that only makes sense on
  phone — and never force phone-style chrome onto Watch.

## Anti-patterns

- Shrinking an iPhone screen or web layout onto Watch
- Walls of text, dense tables, multi-step forms
- Ignoring Digital Crown for scroll/value change
- Deep navigation or hidden menus
- Stale complications / tap-to-generic-home
- Mirroring every phone notification
- Showing private content on Always On
- Custom controls that reinvent system lists/buttons poorly

## Verification checklist

- [ ] Primary info understandable in ~2s without scroll
- [ ] Session completable in a few seconds when that is the goal
- [ ] Crown scrolls / adjusts; visual + haptic feedback feel live
- [ ] Primary action ≤1 tap from launch or complication
- [ ] Hierarchy shallow; no iPhone IA clone
- [ ] Complications glanceable, tint-safe, deep-link correctly
- [ ] Always On simplified; sensitive data redacted
- [ ] Notifications short + actionable; not noisy
- [ ] Dynamic Type / a11y / Reduce Motion checked
- [ ] Layout verified on small and large Watch sizes
