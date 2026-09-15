# Worked examples

## New page before ship

```
Review the new /settings/billing page (staging, build abc123) for UX and
accessibility problems before it ships.
```

Expected approach: fix the target (staging, that route, that build); load the
product's design system and check what the billing object/actions/workflow
priority should look like; inspect the real page in the browser; walk the
primary flow (view plan, update payment method, cancel); exercise loading,
empty (no payment method), error (failed update), and permission-limited
(non-admin) states; check keyboard/focus operation and state preservation
across a validation error; check spacing/terminology/grouping against other
settings pages; validate each suspected issue against rendered output or the
design system before reporting it; return confirmed defects, open questions,
and optional improvements as separate groups without editing the page.

## Redesign comparison

```
Review this dashboard redesign against the old one — does it actually work
better, or does it just look different?
```

Expected approach: fix both targets (redesigned route/build vs. the prior
version, same environment); identify the dashboard's primary objects and
which metrics/actions the task model says should carry the most priority;
inspect both versions in the browser under matching viewport/theme/data;
compare only screenshots taken under those matching conditions; separate
measurable regressions (e.g. a primary action now behind an extra click, a
lost keyboard path, broken vertical rhythm) from the reviewer's own visual
taste; report the former as confirmed defects with the evidence and design
principle involved, and explicitly exclude the latter rather than reporting
it as a defect.
