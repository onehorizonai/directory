# Responsive and adaptive

On-demand guidance for [../SKILL.md](../SKILL.md). Load when layout must
change with space, input, or context — **after**
[structure-hierarchy.md](structure-hierarchy.md) has IA and grouping.
Prefer **available space and capabilities** over device labels
(“iPhone”, “desktop”). For each major region, say whether it stays
fixed, grows, shrinks, wraps, reflows, changes presentation, moves,
becomes a pane, becomes contextual, or hides. Do not stretch a phone
layout into desktop or compress a desktop layout onto mobile.

## First principles

- Design the **core task** under the tightest real constraint first, then
  enrich as space/input allow — don’t squash a wide layout.
- Narrow layouts are their own composition, not proportional compression.
- Preserve natural content widths (forms, prose, sidebars); fluid forever
  is rarely right.
- Large elements may shrink faster than small ones; relationships change.
- Same information architecture across contexts; change presentation and
  progressive disclosure, not the product model.
- Prefer **content-driven** breakpoints (where the design breaks) over
  memorized device widths. Common bands for planning: narrow ≈320–767,
  medium ≈768–1023, wide ≈1024+ — revise to match the design.

## What changes as space shrinks

**Layout**

- Multi-column → single column; side-by-side → stack.
- Persistent side nav → drawer / condensed menu / accordion.
- Master–detail may become list-then-detail with clear back affordance.
- Tables: prioritize columns, allow horizontal scroll inside the table
  region, or offer a card/list alternative — don’t crush unreadably.
- Charts: simplify legends, rotate labels, or switch to a narrower-friendly
  chart type (e.g. horizontal bars).

**Hierarchy and chrome**

- Keep the primary task and primary action visible; demote secondary into
  tabs, “More”, or follow-up screens.
- Sticky context (title, critical filters, primary CTA) when scroll is long.
- Hide decorative chrome before hiding capability.
- Safe-area insets on full-bleed narrow viewports.

**Content**

- Shorter labels where needed; keep meaning.
- Progressive disclosure: details expand on demand.
- Body text still readable (≥16px for reading; ≥14px only in truly dense
  compact UI with care).

## Medium and wide

- Medium: two columns, side panels, master–detail; support touch *and*
  pointer.
- Wide: multi-panel, always-visible nav, richer tables; add hover and
  keyboard shortcuts as enhancements.
- Cap measure and form width; use extra space for structure (columns,
  inspectors), not endless line length.

## Touch vs pointer vs keyboard

Design for **capabilities**, not product marketing names:

| Capability | Design implications |
| --- | --- |
| **Coarse pointer / touch** | ≥44×44 targets; more spacing; no hover-only actions; drawers over cramped menus; thumb-reachable primary actions |
| **Fine pointer** | Hover enrichment OK; denser packing allowed; context menus as secondary |
| **Keyboard** | Full task completion without pointer; visible focus; shortcuts documented for power paths |
| **Mixed** | Many “desktops” are touch-capable — don’t assume mouse |

Gestures (swipe, pinch, drag) need a tap/click and keyboard alternative
unless the gesture *is* the essential experience.

## Embedded, print, and constrained contexts

- **Embedded / iframe / widget**: assume unknown host width; prefer
  container-driven adaptation over viewport-only thinking.
- **Print**: remove nav/chrome; logical page breaks; expand collapsed
  content; include title/date; limited color.
- **Slow / offline**: prioritize content and recovery messaging (see
  [hardening-and-edge-cases.md](hardening-and-edge-cases.md)).


## Planning artifacts for handoff

Document in the design handoff (not as device checkboxes alone):

1. **Narrow composition** — wire or description of the primary task stack,
   nav entry point, and what is deferred.
2. **Medium** — what gains a second column or persistent context.
3. **Wide** — what becomes multi-panel; max content width.
4. **Input matrix** — touch / pointer / keyboard expectations per critical
   flow.
5. **Break notes** — the widths where type, nav, or table strategy changes
   (content-driven).

## Density shifts

- As space grows, add **simultaneous context** (nav + list + detail), not
  just larger padding around the same single column.
- As space shrinks, reduce **parallel chrome** before reducing **legibility**.
- Do not invent a separate “mobile product” feature set unless the brief
  explicitly scopes that.

## Anti-patterns

- Hiding core functionality on narrow viewports
- Different IA per breakpoint (“mobile app” vs “desktop app” mental models
  for the same web product)
- Hover-only critical paths
- Generic breakpoint worship that ignores where *this* layout breaks
- Stretching reading/forms to full ultra-wide
- Ignoring landscape-narrow and split-screen medium widths
- Treating DevTools emulation as proof without real device / input checks

## Verification

- [ ] Narrow composition solves the core task without horizontal page scroll
- [ ] Hierarchy and primary action remain obvious at each band
- [ ] Nav adapts in presentation, not in confusing restructure
- [ ] Touch targets and non-hover paths specified where coarse input exists
- [ ] Wide layouts use max-widths and extra structure wisely
- [ ] Orientation, split-screen, and very small (≈320) / very large checked
- [ ] Print/embedded considered if in scope

## Official links

- [MDN: Responsive design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [MDN: Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [WCAG: Reflow (1.4.10)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
