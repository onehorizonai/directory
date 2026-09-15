# Responsive implementation

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
implementing layout across widths, containers, overflow, or input modes.

**What** should change at each width (hierarchy, navigation chrome, what
collapses) is a design decision already in the approved change or the
product's existing responsive patterns. This file is **how** to implement
that adaptation with CSS and platform APIs.

Prefer adapting to **available space and capabilities**, not to named
devices inferred from arbitrary breakpoints alone.

## Intrinsic layout first

- Prefer Grid/Flex with `minmax`, `fr`, `auto-fit` / `auto-fill`, and
  flexible basis sizes so content reflows without a breakpoint per pixel.
- Size with constraints (`min-width`, `max-width`, `clamp`) rather than
  fixed widths for every pane.
- Avoid hard-coded pixel heights that clip when text grows or translates.

## Container queries vs media queries

| Use | When |
| --- | --- |
| `@container` | Component should respond to **its** allocated width (card in sidebar vs main) |
| `@media` | Viewport-level concerns: preference queries, coarse pointer, reduced motion, print |
| Both | Page shell uses media; reusable widgets use containers |

Don't assume "mobile" from `max-width: 768px` alone — embed, split view,
and desktop narrow windows share that width with different input.

## Fluid type and space

- Use `clamp()` for fluid type/spacing when the design system allows, or
  stick to existing token scales at declared breakpoints.
- Verify at **200% text zoom / large font settings** — layout must remain
  usable (reflow, not truncated essential content).

## Overflow and wrapping

- Plan truncation (`line-clamp`, ellipsis) only where the design allows;
  essential actions and errors must remain reachable.
- Tables and wide data: scroll regions need keyboard-accessible scroll
  and visible focus; consider stacked rows or priority columns per design.
- Prevent accidental horizontal page scroll from fixed widths or
  unconstrained children (`min-width: 0` on flex/grid children is a common
  fix).

## Viewport, safe areas, keyboard

- Use appropriate viewport meta already present in the app; don't invent
  a second viewport strategy.
- Respect `env(safe-area-inset-*)` for notched devices when the shell
  already does (or when shipping full-bleed mobile web).
- On mobile web, account for virtual keyboard resizing / `visualViewport`
  when sticky footers or bottom CTAs are in scope.

## Input capabilities

```css
@media (pointer: coarse) {
  /* Comfortable targets; avoid hover-only essential actions */
}
@media (hover: hover) and (pointer: fine) {
  /* Hover affordances OK as enhancement */
}
```

Essential actions must work with keyboard and touch, not hover alone.
Target size: aim for WCAG 2.2 minimum (24×24 CSS px) unless an exception
applies — see [accessibility-implementation.md](accessibility-implementation.md).

## Implementation checklist

- [ ] Primary action reachable at the narrowest declared width
- [ ] Reprioritization matches the approved design (hide/collapse/reorder
      — not only shrink)
- [ ] 0 / 1 / some / many content cases don't blow the layout
- [ ] Long labels / localized strings wrap or truncate intentionally
- [ ] Focused controls aren't obscured by sticky headers (`scroll-margin`)
- [ ] No hover-only essential path on coarse pointers
