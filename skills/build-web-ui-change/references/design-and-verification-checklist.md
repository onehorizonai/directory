# Design and verification checklist

On-demand detail for [../SKILL.md](../SKILL.md). Load this when the change
is substantial enough to warrant the fuller design model, or when running
the full verification pass. Skip it for small, self-contained changes
where the inline procedure already covers the risk.

## Design-modeling checklist

Work through these before implementing, in addition to the primary
objects/actions/concepts model in the main skill:

- Actors/roles and permissions: who can see or act on this, and does that
  vary by role or entitlement? Does the UI's own logic match what the API
  actually enforces?
- Prioritized use cases and entry points: which use case is primary, and
  how does a user actually arrive at this route/screen?
- Object relationships and lifecycle states: what states can the primary
  object be in, and what triggers a transition between them?
- State-specific actions: which actions are available in which state, and
  which are hidden or disabled — and is "disabled" also enforced
  server-side, not just visually?
- Action frequency, importance, consequence, and reversibility: is this
  action common or rare, low-stakes or destructive, easily undone or not?
  Let that drive prominence, confirmation, and undo affordances.
- Information needed for decisions: what does the user need to see before
  taking an action, and is it visible at the point of decision without
  requiring memory of an earlier screen?
- Happy path and recovery paths: what does success look like, and what
  does the user see and do when something fails?
- State that must survive interruption: what has to persist through
  navigation, a page reload, a lost connection, or returning to the tab
  later?
- 0/1/some/many cases: empty state, single item, a typical list, and a
  very long list or label — does the layout and copy hold up in all four?
- Context that should remain visible: what does the user need to keep
  seeing while acting (e.g. the item being edited, a running total, active
  filters)?
- The observable success condition for each primary use case: what
  concrete, checkable thing confirms the use case succeeded?

## Verification checklist

### Layout and rhythm

- Vertical rhythm: text size, line height, control height, and section
  spacing form one coherent scale from top to bottom, not sized
  independently component by component.
- Alignment axes: count the distinct vertical alignment lines/columns —
  every extra left edge, divider, nested inset, or independently aligned
  card increases complexity; each one should communicate a real hierarchy
  or relationship.
- Similar hierarchy levels carry similar visual weight and spacing unless
  the task model gives a specific reason to differ.

### Responsive and content coverage

- Reprioritization (not just reflow) across every declared breakpoint —
  what's hidden, collapsed, or reordered at narrow widths, and does the
  primary action stay reachable?
- Realistic content at each breakpoint: long labels, larger text-scale
  settings, localized strings that run longer than English, sparse data,
  and dense data.
- Layout holds at 200% text zoom without loss of content or function
  (verify current WCAG guidance rather than treating the number as fixed).

### States

- Every state the change implies is rendered with real data/contracts:
  pending, success, failure, empty, filtered-empty, validation, disabled,
  permission-limited.
- Exactly one authoritative owner for each piece of state, with
  deliberate persistence/reset behavior across navigation and reload.
- No layout shift or lost scroll/selection position across a state
  transition (spatial stability).
- Duplicate actions are prevented while a request is pending (no
  double-submit on a slow network).

### Accessibility

- Full task completable by keyboard alone: every essential action is
  reachable and operable without a mouse, not only discoverable on hover.
- Focus order matches visual/reading order; focus is restored sensibly
  after a dialog, menu, or dynamic update closes.
- Dialogs have an accessible name, sensible initial and final focus, real
  modal containment, and a way to dismiss without a focus-obscuring
  overlay left behind.
- Forms have visible labels (not placeholder-only), appropriate input
  types/autocomplete, errors associated with their field, and support
  pasting into constrained fields.
- Status changes (loading finished, save succeeded, error appeared) are
  exposed to assistive technology, not signaled by icon, color, animation,
  or position alone.
- Color/contrast meets the product's target in every supported theme;
  state is never communicated by color alone.
- Automated tooling (e.g. an axe scan) is used as partial evidence only —
  pair it with an actual keyboard pass and, where the risk warrants it, a
  screen reader pass.

### Terminology and system fit

- Action labels and state names match the product's existing terminology
  exactly (e.g. remove vs. delete vs. cancel vs. discard are not
  interchangeable).
- Component, token, and spacing choices reuse the existing design system
  rather than introducing a parallel one-off pattern.

### Browser/device coverage

- The declared supported browsers and input methods (mouse, keyboard,
  touch) are each exercised, proportionate to the change's risk.
- Motion respects reduced-motion preference and never blocks task
  completion while it plays.

### Performance (when the change touches a known-slow interaction)

- The slow task is measured under comparable, production-like conditions
  before and after — not assumed improved from the change alone.
- The actual cause (request waterfall, bundle size, media, layout
  instability, main-thread work, expensive rendering) is diagnosed before
  applying caching, memoization, virtualization, or code-splitting.
- Correctness, data freshness, and authorization are preserved by any
  performance change.
