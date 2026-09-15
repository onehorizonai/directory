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
---

## Overview

A finished screen can look plausible in a screenshot and still fail the
task it exists for. This skill reviews one **implemented** web interface
against the same model used to design it: reconstruct Outcome → Objects →
Actions → Concepts → Use cases → Priority, walk those use cases in a
running browser, then check states, hierarchy, a11y, and the design
system. It does not start from whether the page "looks good." It reviews
and reports; it does not edit the interface.

## When to use

- A newly built or changed web screen, component, or flow needs an
  independent UX/quality pass before or after it ships — "audit this page",
  "review this flow for UX problems", "is this screen accessible and
  consistent with the rest of the app".
- Someone wants to know whether an implemented interface's states (loading,
  empty, error, permission-limited, long-content, narrow/wide) actually work,
  not just whether the happy path renders.
- A screen needs checking against the product's established interaction
  patterns, spacing/typography scale, terminology, and information hierarchy
  rather than against generic best-practice checklists alone.

## Do not use when

- Nothing is implemented yet and the request is a design review of a mockup,
  wireframe, or written plan — that's a design/positioning step, not this
  skill; there is no running UI to inspect.
- The ask is to also fix what's found, not just review it — finish the
  review first, then invoke an implementation step as a separate, explicitly
  authorized action.
- The target route or version can't be pinned down (see
  [Failure behavior](#failure-behavior)) — resolve that first rather than
  reviewing a moving target.
- The request is a pure code-correctness review with no UI/UX angle —
  review it for defects and requirement coverage generally instead.
- The UI is a native iOS/Android/desktop app rather than a web interface —
  the checks here (browser rendering, DOM, CSS breakpoints) don't apply to
  a native shell.
- The primary question is whether the product's prioritized use cases and
  their model (actors, objects, actions, relationships, lifecycle states)
  hold together as an experience — not whether this specific build renders,
  performs, or complies with platform/accessibility mechanics correctly —
  that is a product-model and interaction-quality review, not the
  build-quality audit this skill performs.

## Prerequisites

Browser access to the actual running interface at a fixed route/version
(local dev server, staging, or production build) — ideally through
Playwright or an equivalent browser-automation tool, so findings are observed
evidence rather than inferred from source. Read access to the frontend source
and the product's design system/component library/tokens, for tracing an
observed problem to its cause and for checking against established patterns.
Where relevant to a flagged flow, awareness of the underlying API/permission
contracts the UI is bound by.

## Inputs

- The exact target: route/URL, environment, and build/version/commit — fixed
  before inspection starts, not left implicit.
- What kind of pass this is: full review, or focused on specific concerns
  (e.g. accessibility only, or state handling only) — ask if unstated and
  it changes scope materially.
- Access to the design system/component library/tokens and any reference
  screens that establish the product's existing patterns, so novelty can be
  told apart from inconsistency.
- The primary task(s) the interface exists to support, if not obvious from
  the interface itself — needed to judge hierarchy and priority, not just
  surface polish.
- Any known constraints: supported browsers, breakpoints, themes,
  accessibility target (e.g. WCAG 2.2 AA), localization requirements.

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
7. **Keyboard, focus, a11y.** Full task by keyboard; names/errors
   associated; status announced. Check current WCAG (or product target)
   rather than remembered numbers. Load
   [references/motion-feedback.md](references/motion-feedback.md) when
   motion, feedback, or recovery is in question.
8. **API/permission boundaries.** Visible affordances match what the
   backend authorizes; hidden UI is not authorization.
9. **Consistency.** Terminology, spacing, grouping, and control placement
   against the product's established patterns and the reconstructed
   model. Novelty that breaks predictability is a regression.
10. **Validate and rank.** Evidence from the running UI; matching
    viewport/theme/data for screenshots; no taste-as-defect. Confirmed
    defects, open questions, optional improvements.

## Output

Return findings grouped in this order, each group visibly separate:

1. **Confirmed defects** — validated issues, most-impactful first.
2. **Open questions** — suspected issues that couldn't be confirmed or
   denied with available evidence.
3. **Optional improvements** — real, evidence-backed, non-blocking
   suggestions (never bare aesthetic preference).

Each finding includes:

- **Severity/priority**
- **Location** — the exact screen/component/state, and where in the source
  it likely originates
- **Failure scenario** — the concrete interaction, viewport, state, or input
  method that surfaces it
- **Impact** — on the task, not just on appearance
- **Evidence** — what was actually observed (screenshot, DOM/style snapshot,
  keyboard trace, network call), taken under the matching conditions the
  finding requires
- **Design principle involved**, when the finding is a hierarchy/consistency
  issue — name the principle and why the current implementation conflicts
  with it, distinct from stating a preferred alternative
- **Suggested correction** — the smallest supported fix or decision,
  described only; this skill does not apply it
- **Confidence/condition** — when an assumption remains

State which states, viewports, input methods, and flows were actually
exercised, and which were not, as explicit scope — not left implicit.

## Verification

Before handing back findings, check:

- The target route/environment/version was fixed and stated, not left
  implicit.
- Outcome, objects, actions, concepts, use cases, and priority were
  reconstructed from evidence before styling was judged.
- Important use cases were walked in the running browser using
  [references/verification.md](references/verification.md); coverage
  gaps are named.
- Findings come from observed evidence in the running UI (browser/Playwright
  inspection), not solely from reading source and assuming rendered
  behavior.
- Every state the task realistically produces (loading, empty,
  filtered-empty, error, permission-limited, long-content, narrow/wide) was
  either exercised or explicitly named as not covered.
- Any screenshot comparison used as evidence was taken under matching
  viewport/theme/data/state conditions.
- Every confirmed defect is validated against rendered output, the design
  system, the API contract, or a reproduction — not left as an unvalidated
  suspicion.
- Aesthetic preference is not present in the confirmed-defects group; each
  hierarchy/consistency finding names the evidence and the design principle
  it conflicts with.
- Confirmed defects, open questions, and optional improvements stayed in
  separate groups, deduplicated and ranked by real impact.
- No UI code was edited during the audit.

## Boundaries

This skill reviews and reports; it does not edit the interface under review
and does not apply any of its own suggested corrections unless a human or the
invoking step explicitly authorizes a separate edit step. It does not change
API contracts, permissions, or backend behavior to test them — it observes
and reports against the contracts as they exist. The natural next step — an
implementation/fix skill — is a follow-on the caller can invoke separately,
not a hard dependency. Keep review and modification separate unless both are
explicitly requested together.

## Failure behavior

- No fixed target route/environment/version, or the target is still actively
  changing → stop and ask rather than reviewing a moving target.
- No browser/Playwright access to the running interface → say so as a
  coverage gap; do not substitute a static read of the source for observed
  behavior and report it as equivalent evidence.
- No access to the design system/reference screens → note that consistency
  checks are limited to internal coherence of the screen itself, not
  comparison against the wider product.
- A state (e.g. error, permission-limited) can't be reproduced with
  available access/data → report it as not exercised, not as passing by
  default.
- A suspected defect can't be validated with available evidence or tools →
  report it as an open question, not a confirmed defect.
- A finding turns out to rest on the reviewer's own preference rather than
  observed evidence or a stated design principle → drop it or move it to
  optional improvements with that caveat, never report it as a confirmed
  defect.

## Examples

```
Review the new /settings/billing page (staging, build abc123) for UX and
accessibility problems before it ships.
```

Expected approach: fix the target (staging, that route, that build);
reconstruct outcome, objects, actions, concepts, and priority (1–5) from
the product model and the running page — not from whether the screenshot
looks good; inspect the real page; walk the important use cases (view
plan, update payment method, cancel) with the twelve questions; exercise
loading, empty (no payment method), error (failed update), and
permission-limited (non-admin) states; check keyboard/focus and state
preservation across a validation error; check hierarchy against declared
priority; validate each suspected issue against rendered output or the
design system before reporting it; return confirmed defects, open
questions, and optional improvements as separate groups without editing
the page.

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
