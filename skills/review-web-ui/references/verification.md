# Design verification

On-demand method for [../SKILL.md](../SKILL.md). Load before declaring a
design (or a review of one) complete. Walk **use cases**, not screenshots.
A beautiful surface that fails an important use case is a failed design.

## Reconstruct the model

Read or rebuild, from evidence:

outcome → objects → actions → concepts → priorities → use cases → states

If a prior handoff or plan already has this, use it. If it is missing,
reconstruct it from the running page and the product — then judge the
UI against that model, not against taste. Do not invent priorities;
mark them as open questions when evidence is missing.

## Use-case walk

For each important use case:

1. Can the user discover how to begin?
2. Is the primary path obvious?
3. Is relevant context visible?
4. Are unnecessary decisions removed?
5. Does feedback explain what happened?
6. Can the user recover from mistakes?
7. Are all important states handled?
8. Does the hierarchy match the declared priority?
9. Does the interaction match platform conventions?
10. Is it accessible?
11. Does it remain usable with realistic and extreme content?
12. Does it adapt correctly to relevant viewport / container widths?

## Object / action coverage

For every important object:

- Can users identify it? Is identity clear?
- Are important attributes visible at the right time?
- Are relationships understandable?
- Are the named actions available, discoverable, and at the right
  priority?
- Are its states distinguishable, with recovery and preserved work?

For every named action: does it live on the object (or the right global
place), with feedback and recovery that match consequence?

## Adaptive relationships (not screenshots)

For each major region, say whether it: stays fixed, grows, shrinks,
wraps, reflows, changes presentation, moves, becomes a pane, becomes
contextual, or hides.

Do not stretch a phone layout into desktop or compress a desktop layout
onto a phone. Preserve conceptual relationships; presentation may change.

## Grayscale review

Remove color. Hierarchy, state, grouping, selection, and affordance
must remain understandable.

## Skeleton review

Ignore color, shadows, border decoration, icons, illustrations.
Evaluate only geometry, spacing, typography, grouping, alignment,
ordering.

If structure fails without decoration, fix the structure — do not
decorate harder.

## Density check

See [structure-hierarchy.md](structure-hierarchy.md) (density and
complexity). Accidental clutter is a defect; legitimate expert density
is not.

## Also walk, when the use case involves them

- Can the user authenticate without blocking paste or a password
  manager?
- Can they reorder or move an object without dragging as the only path?
- Does sticky or overlay chrome hide the focused control?
- If a chip, badge, or filter is truncated, can they still read the
  value without hover?
- Do light and dark both keep hierarchy, grouping, and state, or was
  one theme inferred from the other?
