# Interaction, motion, and feedback

On-demand method for [../SKILL.md](../SKILL.md). Load when reviewing
motion, feedback, recovery, or accessibility as part of walking use
cases — after the reconstructed model exists.

## Familiarity first

Before inventing an interaction, use the platform's established pattern
for: navigation, menus, selection, search, settings, dialogs, sheets,
toolbars, context menus, drag and drop, keyboard, back, destructive
actions.

Novel interactions need a reason. Familiarity is lower learning cost.

On native/desktop, this is mandatory: do not recreate a web UI with
system widgets.

## Motion explains change

Motion is functional first. Use it for causality, continuity, hierarchy,
spatial relationship, state change, feedback, and focus — not decoration.

Useful (translated, not Disney-literal):

- **Staging** — direct attention to what changed; don't run competing
  unrelated animations.
- **Slow in / slow out** — ease physical transitions; avoid linear
  motion for most UI moves.
- **Timing** — duration signals distance, scale, importance,
  responsiveness. Frequent actions must feel immediate.
- **Follow-through / overlap** — small offsets can relate container and
  content; use sparingly.
- **Arcs / spatial continuity** — preserve origin and destination when
  that keeps context.
- **Secondary action** — support the primary transition, don't compete.
- **Coherence** — one motion language, not theatrical "appeal."

Usually avoid: squash and stretch, theatrical anticipation that delays
the requested action, excessive overshoot, decorative bounce, motion
with no information.

Never make the user wait for animation. Honor Reduce Motion /
`prefers-reduced-motion` (or the platform equivalent).

## Motion contracts

- **Interruptible** — a tap or gesture cancels in-progress motion.
  Never wait for an animation-end event to reach the real state.
- **Press feedback** — visible response within about 100ms. Pressed
  visuals must not shift layout bounds.
- **Exit faster than enter** — leaving a surface should feel quicker
  than arriving.
- **Transform / opacity** — specify motion as movement and fade, not as
  animating width, height, or top/left (those reflow the layout).
- **One primary motion** — stage the thing that changed. Competing
  animations in the same moment are a defect.

## Object permanence

When an object changes location or representation, prefer a transition
that shows it is the **same** object: list item → detail, card →
expanded editor, button → attached popover, collapsed → expanded.

Avoid teleportation where a spatial transition would materially help.
Do not animate everything.

## Feedback matches consequence

Every meaningful interaction needs feedback scaled to significance:

- press → immediate visual state
- save → subtle confirmation if needed
- long task → progress/status
- failure → visible recovery
- irreversible destructive → stronger intervention

No disruptive alerts for routine success. Prefer feedback near the
object/action. The user must never wonder: **Did that work?**

## Recovery, not only prevention

Prevent errors where reasonable; assume they still happen.

Prefer: undo, draft preservation, reversible operations, inline
validation, retained input, retry, clear recovery actions.

Confirmation is for consequences that are significant, unexpected, and
hard or impossible to reverse — not for every delete of a trivial item
if undo exists.

## Accessibility is in the model

Not a final paint pass. While walking each important use case:

- keyboard access where the platform has a keyboard
- logical focus order; visible focus
- screen-reader / accessibility-tree semantics
- scalable text
- sufficient contrast; meaning not by color alone
- large enough targets; alternatives to gesture-only actions
  (drag-to-reorder needs Move up / Move down or equivalent)
- reduced-motion path; auto-rotating content has pause/stop
- sticky or overlay chrome must not cover the focused control
- authentication allows paste and the system password manager
- zoom / reflow; longer localized strings; RTL where relevant

Use **platform** accessibility behavior and conventions, not a web ARIA
recipe transplanted to native.
