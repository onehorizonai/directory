---
name: audit-web-ui
description: >-
  Use when an already-implemented web interface needs a UX and quality audit
  against the running product — a route, page, or flow that exists and is
  reachable, checked for task flow and hierarchy, complete states, state
  preservation, responsive behavior, keyboard/focus/accessibility, API and
  permission boundaries, and visual consistency with the existing design
  system. Requests like "review this screen for UX issues", "audit the new
  settings page", "check this flow for accessibility and consistency
  problems", or "does this UI match how the rest of the product behaves".
  Returns validated, prioritized findings with observed evidence; does not
  edit the UI and does not review a design mockup or an unimplemented plan.
metadata:
  title: Audit Web UI
  tagline: Audit an implemented web interface for UX, state, accessibility, and consistency defects against the running product.
  category: engineering
  tags:
    - ux-review
    - accessibility
    - ui-audit
    - consistency
    - web
---

## Overview

A finished screen can look plausible in a screenshot and still fail the task
it exists for: state that resets on navigation, an empty or error state that
was never built, an action that only a mouse can reach, or a layout that
contradicts how the rest of the product groups the same objects. This skill
is a fixed procedure for auditing one implemented web interface — a route,
page, or flow that is actually running, not a mockup or a plan — against the
product's own interface model and design system. It inspects the real UI
(browser/Playwright evidence over static reading of the code), exercises the
states the task requires, and separates measurable inconsistencies and
behavioral defects from subjective visual preference. It reviews and reports;
it does not edit the interface.

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
- The ask is to also fix what's found, not just audit it — finish the audit
  first, then invoke an implementation step as a separate, explicitly
  authorized action.
- The target route or version can't be pinned down (see
  [Failure behavior](#failure-behavior)) — resolve that first rather than
  auditing a moving target.
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
- What kind of pass this is: full audit, or focused on specific concerns
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

1. **Fix the target.** Resolve and state the exact route/screen, environment,
   and build/version before inspecting anything. Confirm it isn't mid-change.
2. **Load context.** Identify the product's component system, tokens,
   typography/spacing scale, and terminology from the design
   system/reference screens — not just this screen in isolation. Identify the
   primary objects the interface represents, the actions available on them,
   and the broader workflows/concepts that combine them; note the apparent
   priority each carries in the implementation.
3. **Inspect the real running UI.** Use browser/Playwright inspection to
   gather observable evidence rather than reading the code and assuming
   rendered behavior matches it. Read the actual DOM/computed styles,
   keyboard/focus behavior, and network calls where relevant.
4. **Walk the task flow.** For each primary use case the screen supports,
   check that the current state and primary action are clear, the object and
   its state are understandable, the action can be found and completed, the
   result is understandable, and recovery from a realistic failure works.
5. **Exercise representative states.** Loading, success, error,
   empty, filtered-empty, validation, disabled, and permission-limited
   states — for each state that plausibly exists, confirm it was actually
   built rather than assumed to inherit from the happy path.
6. **Check state handling.** One authoritative state owner, deliberate
   persistence/reset behavior, and preserved input/focus/selection across
   navigation, refresh, and interruption — flag state that resets, drifts,
   or duplicates when it shouldn't.
7. **Check responsive and spatial behavior.** Narrow/wide viewports, long
   labels/larger text/localization, and spatial stability through state
   changes (layout shouldn't jump or reflow unnecessarily as content or state
   changes). Check vertical rhythm (whether type size, line height, control
   height, and spacing form a coherent scale) and note excessive or
   inconsistent alignment axes, containers, or dividers.
8. **Check keyboard, focus, and accessibility.** Confirm the complete task is
   operable by keyboard alone (no hover-only or pointer-only essential
   actions), focus order and restoration are sensible, names/labels/errors
   are associated correctly, and status changes are announced. Where an
   accessibility target is stated (e.g. WCAG 2.2 AA), check current criteria
   for that target — contrast, 200% text resizing, reflow, and target
   size, with their exceptions — rather than treating remembered numbers as
   timeless; verify against current guidance. Use automated tooling as
   partial evidence only; confirm manually.
9. **Check API/permission boundaries.** Confirm the UI's visible
   affordances match what the backend actually authorizes — hidden or
   disabled UI is not itself authorization; a permission-limited state should
   correspond to a real, enforced boundary, not just a hidden button.
10. **Check consistency.** Compare terminology, spacing, color use, grouping,
    and control placement against the product's established patterns from
    step 2. Flag conflicts between this screen's visual prominence/space/
    grouping/disclosure and the interface's own model (per step 2) or the
    product's conventions elsewhere — not just against generic taste. Weigh
    consistency over novelty: a screen that looks fresher but breaks an
    established pattern or makes the product less predictable is a
    regression, not an improvement, even when nothing else about it is wrong.
11. **Validate every suspected issue.** Before it counts as a finding, check
    it against the rendered DOM/styles, the design system reference, the API
    contract, or a reproduction in the browser. Where a visual comparison is
    part of a finding, use only screenshots taken under matching viewport,
    theme, data, and state — an unmatched comparison is not usable evidence.
    Separate objective, evidence-backed defects from a reviewer's own visual
    preference — a preference is not reported as a defect.
12. **Rank and structure findings**, consolidating duplicates and prioritizing
    by real impact on the task, before returning them.

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

This skill audits and reports; it does not edit the interface under review
and does not apply any of its own suggested corrections unless a human or the
invoking step explicitly authorizes a separate edit step. It does not change
API contracts, permissions, or backend behavior to test them — it observes
and reports against the contracts as they exist. The natural next step — an
implementation/fix skill — is a follow-on the caller can invoke separately,
not a hard dependency. Keep audit and modification separate unless both are
explicitly requested together.

## Failure behavior

- No fixed target route/environment/version, or the target is still actively
  changing → stop and ask rather than auditing a moving target.
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
Audit the new /settings/billing page (staging, build abc123) for UX and
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
