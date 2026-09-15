# Interaction and states

On-demand guidance for [../SKILL.md](../SKILL.md). Load for navigation,
controls, focus, keyboard, feedback, and empty/loading/error **web**
behavior after
[ui-reasoning.md](ui-reasoning.md) and [states.md](states.md) exist.
Design intent only — not framework event handlers.

## Live checklist (fetch before review)

When auditing or finalizing interaction design against current web UI
rules, fetch the latest Vercel Web Interface Guidelines (do not rely on
a remembered copy):

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

That file is the living checklist (a11y, focus, forms, animation, touch,
navigation, anti-patterns). This reference distills **durable** principles;
always prefer the fetched rules when they disagree with a memory of older
guidance.

## Semantic interaction

- **Buttons** for actions that change state; **links** for navigation
  (open in new tab / middle-click must work for destinations).
- Don’t design clickable “cards” or text that behave like buttons without
  looking and announcing as controls.
- Destructive actions need confirmation **or** a clear undo window — never
  instant irreversible delete as the only path.
- URL should reflect durable UI state: filters, tabs, pagination, expanded
  panels — so refresh and share restore context.
- Hover is enhancement: every hover-only affordance needs a touch/keyboard
  equivalent.

## Navigation

- Keep IA consistent across widths; adapt presentation (drawer, collapsed
  nav, sticky context), not the mental model.
- Current location is obvious (stronger than color alone).
- Skip path to main content for keyboard users (design the affordance).
- Overlays (modal, drawer, sheet): trap focus while open, Escape closes,
  return focus to trigger; contain scroll (no background scroll bleed).
- Safe areas: full-bleed layouts respect notch / home-indicator insets.

## Buttons, links, and hit targets

- One primary action per region; don’t flatten hierarchy on hover/focus.
- Specific labels: “Save API key” not “Continue” / “Submit.”
- Icon-only controls need a visible tooltip **and** an accessible name.
- Minimum target ~44×44 CSS px on touch; don’t pack targets so fat-finger
  misses are likely.
- Interactive states increase clarity: hover / active / focus more
  prominent than rest — never remove focus styling without a stronger
  replacement.
- Prefer `:focus-visible` intent (keyboard ring, not permanent click ring).

## Keyboard and focus

- Every interactive control reachable in a logical order matching visual
  reading order.
- No keyboard traps; custom widgets document Enter / Space / Escape /
  arrows as appropriate.
- Sticky headers and overlays must not cover the focused control.
- `autofocus` sparingly: desktop, single primary field, user-initiated
  flows — avoid on mobile entry pages.
- Route / view changes: move focus to the new heading or main region.

## Feedback and system status

- Immediate acknowledgment for actions (pressed, pending, done).
- Loading copy ends with an ellipsis character (“Saving…”) and names what
  is loading when helpful.
- Toasts / async validation: announce politely; don’t rely on sight alone.
- Unsaved changes: warn before navigate away.
- Double-submit: once the request starts, show progress and prevent
  duplicate fires — keep the control understandable (spinner + label).

## Loading, empty, error, success

Design each as a real screen, not an afterthought.

| State | Intent |
| --- | --- |
| **Loading** | Reduce uncertainty; skeleton or inline progress; show stale vs fresh when refreshing |
| **Empty (first use)** | What belongs here, why it matters, primary CTA; hide dead chrome |
| **Empty (no results)** | Explain query/filters; clear/recover action; keep context |
| **Permission** | Plain limit + who can grant + request path |
| **Error** | What failed + how to fix; retry for transient; sign-in for auth; support for systemic |
| **Success** | Confirm in the same vocabulary as the action; offer next step |

Tone differs by type — first-use ≠ error ≠ permission. Illustration never
outranks the CTA.


## Menus, disclosures, and selection

- Menus and selects: keyboard arrow intent documented; typeahead for long
  lists; don’t use dropdowns for 2–3 options when radios are clearer.
- Disclosures/accordions: one section vs many — avoid nested accordion
  mazes for primary tasks.
- Multi-select: visible selection count and clear “clear selection.”
- Drag-and-drop: always offer a non-drag alternative (buttons to reorder).

## Touch and pointer specifics

- Intentional tap highlight; prevent accidental double-tap zoom delay where
  appropriate in handoff notes.
- During drag, disable text selection; provide cancel/escape.
- Long-press and right-click are accelerators, not the only path.

## Anti-patterns

- Div/`onClick` navigation that breaks open-in-new-tab
- Focus rings removed with no replacement
- Hover-only critical actions
- Instant destructive actions without confirm/undo
- State only in memory (filters lost on refresh)
- “No items” with no next step; empty toolbars that do nothing
- Vague errors (“Something went wrong”) with no recovery
- Disabled primary with no explanation of what to fix

## Verification

- [ ] Actions vs links chosen correctly; destructive path guarded
- [ ] Shareable URL for durable state where relevant
- [ ] Focus visible; keyboard path complete; no traps
- [ ] Targets sized; touch alternatives to hover
- [ ] Loading / empty / error / success specified with recovery
- [ ] Latest Web Interface Guidelines fetched and checked for gaps

## Official links

- Live rules: [Web Interface Guidelines `command.md`](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) (focus, targets, status)
- [MDN: `:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
