---
name: review-web-ui
description: >-
  Use when an already-built web route, page, or flow needs a UX and
  quality review against the running product — task flow, hierarchy,
  states, responsiveness, keyboard/focus/accessibility, API and permission
  boundaries, and design-system consistency. Returns prioritized findings
  with observed evidence.

  Does not edit the UI. Not for mockups or unimplemented plans.
metadata:
  title: Review Web UI
  tagline: "Review a live web UI for UX, state, accessibility, and design-system consistency."
  category: engineering
  tags:
    - ux-review
    - accessibility
    - ui-audit
    - consistency
    - web
  compatibility:
    oneHorizon:
      taskModes:
        - review
---

## Overview

Reviews one **implemented** web interface against the model used to
design it: reconstruct Outcome → Objects → Actions → Concepts → Use
cases → Priority, walk those use cases in a running browser, then check
states, hierarchy, a11y, and the design system. It does not start from
whether the page "looks good." **Less is more:** look for controls,
containers, borders, visual levels, words, or decorative elements that
could be removed, combined, or hidden behind progressive disclosure
without losing anything the use case needs. It does not edit the
interface.

## When to use

- A newly built or changed web screen, component, or flow needs an
  independent UX/quality pass before or after it ships — "audit this
  page", "review this flow for UX problems", "is this screen accessible
  and consistent with the rest of the app".
- Someone wants to know whether an implemented interface's states
  (loading, empty, error, permission-limited, long-content, narrow/wide)
  work, not just whether the happy path renders.
- A screen needs checking against the product's established interaction
  patterns, spacing/typography scale, terminology, and information
  hierarchy, not generic best-practice checklists alone.

## Do not use when

- Nothing is implemented yet and the request is a design review of a
  mockup, wireframe, or written plan — there is no running UI to inspect.
- The ask is to also fix what's found — review first; fixing is a
  separate, explicitly authorized step.
- The request is a pure code-correctness review with no UI/UX angle.
- The UI is a native iOS/Android/desktop app — browser rendering, DOM,
  and CSS breakpoint checks don't apply to a native shell.
- The primary question is whether the product's prioritized use cases and
  their model (actors, objects, actions, relationships, lifecycle states)
  hold together as an experience, not whether this build renders,
  performs, or complies with mechanics — that's a product-model review.

## Prerequisites and inputs

- The exact target: route/URL, environment, and build/version/commit,
  fixed before inspection starts. Browser access to the running interface
  — ideally through Playwright or equivalent browser automation, so
  findings are observed, not inferred from source.
- What kind of pass this is: full review, or focused on specific concerns
  (e.g. accessibility only) — ask if unstated and it changes scope
  materially.
- Read access to the frontend source and the design system/component
  library/tokens/reference screens, for tracing an observed problem to its
  cause and telling novelty from inconsistency.
- The primary task(s) the interface supports, if not obvious — needed to
  judge hierarchy and priority.
- Known constraints: supported browsers, breakpoints, themes,
  accessibility target (e.g. WCAG 2.2 AA), localization requirements, and,
  where relevant to a flagged flow, the API/permission contracts the UI
  is bound by.

## Procedure

1. **Fix the target.** Exact route/screen, environment, and
   build/version. Confirm it isn't mid-change.
2. **Reconstruct the model.** Load
   [references/ui-reasoning.md](references/ui-reasoning.md). From the
   handoff, requirements, design system, and the running page, establish
   Outcome → Objects → Actions → Concepts → Use cases → Priority
   (1–5). Do not invent priorities. Do not start from cards or styling.
3. **Inspect the real UI.** Browser/Playwright evidence over assuming
   source matches render. DOM, computed styles, keyboard, network where
   relevant.
4. **Walk use cases.** Load
   [references/verification.md](references/verification.md). For each
   important use case run the twelve questions. A beautiful page that
   fails a use case is a failed design.
5. **States and coverage.** Load [references/states.md](references/states.md).
   Empty ≠ filtered-empty ≠ error ≠ permission; work preserved; one
   authoritative owner per piece of state.
6. **Structure vs priority.** Load
   [references/structure-hierarchy.md](references/structure-hierarchy.md).
   Alignment, rhythm, Gestalt, attention budget, grayscale and skeleton.
   Responsive: what each region does as width changes — not a stretched
   phone layout.
7. **Keyboard, focus, a11y.** Full task by keyboard: Tab/Shift+Tab reach
   and traverse every control, Enter/Space activate, Escape dismisses
   overlays, no keyboard trap; composite widgets (tabs, menus) follow the
   ARIA APG pattern for that widget instead of custom key handling; names/
   errors associated; disabled and selected states exposed, not just
   styled; status announced; semantic headings and landmarks present.
   Check current WCAG (or product target), not remembered numbers. Load
   [references/motion-feedback.md](references/motion-feedback.md) when
   motion, feedback, or recovery is in question.
8. **API/permission boundaries.** Visible affordances match what the
   backend authorizes; hidden UI is not authorization.
9. **Consistency.** Terminology, spacing, grouping, and control placement
   against the product's established patterns and the reconstructed
   model. Novelty that breaks predictability is a regression. Check
   reuse: when the screen introduces a new component, control, or
   interaction pattern that already has an equivalent in the design
   system or product, flag it — even when it's style-consistent and
   bug-free.
10. **Validate and rank.** Evidence from the running UI; matching
    viewport/theme/data for screenshots; no taste-as-defect. Confirmed
    defects, open questions, optional improvements.

## Output

Return findings in these groups, in this order, visibly separate:

1. **Confirmed defects** — validated issues, most impactful first.
2. **Open questions** — suspected issues that couldn't be confirmed or
   denied.
3. **Optional improvements** — real, evidence-backed, non-blocking
   suggestions (never bare aesthetic preference).

Each finding includes:

- **Severity/priority**
- **Location** — the exact screen/component/state, and where in the
  source it likely originates
- **Failure scenario** — the interaction, viewport, state, or input
  method that surfaces it
- **Impact** — on the task, not just on appearance
- **Evidence** — what was observed (screenshot, DOM/style snapshot,
  keyboard trace, network call), under the conditions the finding
  requires
- **Design principle involved**, when the finding is a
  hierarchy/consistency issue — name the principle and why the
  implementation conflicts with it, distinct from a preferred alternative
- **Suggested correction** — the smallest supported fix or decision,
  described only
- **Confidence/condition** — when an assumption remains

State which states, viewports, input methods, and flows were exercised
and which were not.

Use as few output tokens as possible while completing the task correctly.
Write in plain English. This applies to documents, progress messages, and
the final reply.

## Verification

Before returning findings, check:

- The target route/environment/version is stated.
- Outcome, objects, actions, concepts, use cases, and priority were
  reconstructed from evidence before styling was judged.
- Important use cases were walked in the running browser using
  [references/verification.md](references/verification.md); coverage
  gaps are named.
- Findings come from observed evidence in the running UI, not from
  reading source and assuming rendered behavior.
- Every state the task realistically produces (loading, empty,
  filtered-empty, error, permission-limited, long-content, narrow/wide)
  was exercised or named as not covered.
- Any screenshot comparison used as evidence was taken under matching
  viewport/theme/data/state conditions.
- Every confirmed defect is validated against rendered output, the design
  system, the API contract, or a reproduction.
- No aesthetic preference is in the confirmed-defects group; each
  hierarchy/consistency finding names its evidence and the design
  principle it conflicts with.
- The three groups are separate, deduplicated, and ranked by real impact.
- No UI code was edited.

## Boundaries

Review and report only. Don't edit the interface under review or apply a
suggested correction unless a human or the invoking step explicitly
authorizes a separate edit step. Don't change API contracts, permissions,
or backend behavior to test them — observe and report against the
contracts as they exist. This skill works standalone; any fix is a
follow-on the caller invokes separately.

## Failure behavior

- No fixed target route/environment/version, or the target is still
  changing → stop and ask.
- No browser/Playwright access to the running interface → report a
  coverage gap; a static read of the source is not equivalent evidence.
- No access to the design system/reference screens → note that
  consistency checks are limited to the screen's internal coherence.
- A state (e.g. error, permission-limited) can't be reproduced with
  available access/data → report it as not exercised, never as passing.
- A suspected defect can't be validated → report it as an open question.
- A finding rests on the reviewer's preference, not observed evidence or
  a stated design principle → drop it or move it to optional
  improvements with that caveat.

## Examples

```
Review the new /settings/billing page (staging, build abc123) for UX and
accessibility problems before it ships.
```

Expected approach: fix the target (staging, that route, that build);
reconstruct outcome, objects, actions, concepts, and priority (1–5) from
the product model and the running page; walk the important use cases
(view plan, update payment method, cancel) with the twelve questions;
exercise loading, empty (no payment method), error (failed update), and
permission-limited (non-admin) states; check keyboard/focus and state
preservation across a validation error; check hierarchy against
priority; validate each suspected issue against rendered output or the
design system; return the three groups without editing the page.

When comparing a redesign against a prior version rather than reviewing a
single build, see
[references/worked-examples.md](references/worked-examples.md) for a
worked example, including matched-condition screenshot comparison.
