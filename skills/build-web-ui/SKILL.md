---
name: build-web-ui
description: >-
  Use when an approved web UI change needs implementing in an existing
  site or web app — use the product's design system, components, and
  conventions.

  Not for inventing the design, native app UI, greenfield products with no
  design system, or framework/routing/token migrations without a prior
  decision.
metadata:
  title: Build Web UI
  tagline: "Implement an approved web UI change with the product's design system, then verify it in a browser."
  category: engineering
  tags:
    - web
    - frontend
    - ui
    - accessibility
    - design-system
    - testing
  compatibility:
    oneHorizon:
      taskModes:
        - code
---

## Overview

Implements an already-approved web UI change in an existing product; it
does not decide what the UI should be. It inspects the existing route,
design system, and API/permission contracts first, models objects,
actions, and workflows before styling, builds **web platform first**
(semantic HTML, modern CSS, browser APIs) with the product's existing
components, tokens, and state patterns, real states, and accessible
interaction, and verifies the result in a running browser.

## When to use

- An approved web UI change (design, mock, spec, or a linked Initiative,
  Bug, or TODO) exists for an existing web app or website, and the next
  step is building it.
- The user asks to implement a specific page, view, or interaction on the
  web where the scope is already settled.

## Do not use when

- The design itself still needs deciding or approving — resolve that
  first.
- The UI is native iOS, Android, or desktop (including a desktop shell
  whose chrome should follow the host OS).
- There is no existing design system to follow (a greenfield site/app).
- The change would migrate framework, routing architecture, or global
  design tokens without an explicit prior decision to do so.
- The approved scope is behavior/API behind the UI (a query param, a
  validation rule, a backend integration), not the interface itself.

## Prerequisites and inputs

- Read/write access to the target repository, its design system/component
  library, and its test/build tooling. A way to run the app and inspect
  it in a real, rendered browser — ideally with browser automation (e.g.
  Playwright); a manual browser check is the floor.
- The approved UI change or design reference.
- The route/screen it belongs to, and the supported browsers, breakpoints,
  themes, languages, and accessibility target — declared explicitly if
  not evident from the repo or approval.
- Constraints from the approval (must preserve an existing API or
  permission, must not change navigation, must ship behind a flag).
- Pointers to the relevant page/component if known; otherwise locate it
  during the procedure.

## Procedure

1. Restate the approved change as concrete, testable behavior. Declare the
   route/screen and the supported browsers, breakpoints, themes, and
   accessibility target (from the repo, or explicitly if not evident).
   State whether the work reproduces an approved design, refines an
   existing interface, or changes behavior.
2. Load the matching **engineering** references (same-skill `references/`
   only — as needed, not all at once). For UX or visual decisions, fetch
   current public web UI guidance (the product's design system plus the
   Web Interface Guidelines / WCAG links named in the loaded refs); don't
   invent a visual language here. Load
   [references/testing-and-browser-verification.md](references/testing-and-browser-verification.md)
   whenever the change affects something a user can see or interact with,
   and pick the test level from the risk — a small visual change doesn't
   need a new automated test, a new flow or state usually does:

   | Concern | Load |
   | --- | --- |
   | HTML/CSS/platform, progressive enhancement | [references/web-platform.md](references/web-platform.md) |
   | Where state lives / survives | [references/state-management.md](references/state-management.md) |
   | React / Next App Router | [references/react-and-nextjs.md](references/react-and-nextjs.md) (only if stack is React) |
   | Component APIs / composition | [references/composition-patterns.md](references/composition-patterns.md) |
   | Implementing responsive layout | [references/responsive-implementation.md](references/responsive-implementation.md) |
   | A11y implementation + verify | [references/accessibility-implementation.md](references/accessibility-implementation.md) |
   | Tests + browser loop | [references/testing-and-browser-verification.md](references/testing-and-browser-verification.md) |
   | Perf investigation / CWV | [references/performance.md](references/performance.md) |
   | Substantial modeling / full checklist | [references/design-and-verification-checklist.md](references/design-and-verification-checklist.md) |

3. Inspect before writing: the current route/component tree, the design
   system (tokens, component library, typography/spacing scale, icons),
   the API and permission contracts the screen touches, the
   state-management approach, existing tests, and how comparable screens
   handle loading/empty/error/permission states and terminology.
4. Model the interface before styling it: identify the primary objects,
   their actions, and the workflows/concepts that combine them, and
   assign relative priority. That hierarchy — not borders, radius,
   shadows, or a new accent hue — drives layout, prominence, grouping,
   navigation, and progressive disclosure. Consistency with the product's
   existing interaction patterns, spacing, typography, and terminology
   beats local visual novelty; a locally prettier screen that breaks
   predictability is a regression. For substantial changes, also work
   through
   [references/design-and-verification-checklist.md](references/design-and-verification-checklist.md).
5. Define ownership and lifetime of transient UI state, form state, URL
   state, server/cache data, and any shared or persisted state the change
   touches ([references/state-management.md](references/state-management.md)).
   Specify what survives navigation and reload; handle interruption
   (connectivity loss, auth expiry, cancel/retry) without duplicate
   requests or false success. Prefer the smallest appropriate scope;
   don't copy server data into global client state without cause; don't
   add a state library mid-change unless approved.
6. If the approved scope requires a framework, routing, or
   global-design-token change, stop and report a blocker — that needs an
   explicit separate decision (see Failure behavior).
7. Implement with the product's existing components, tokens, and state
   patterns, in small increments, running targeted checks after each.
   Prefer platform capabilities before new dependencies
   ([references/web-platform.md](references/web-platform.md)); use
   [references/react-and-nextjs.md](references/react-and-nextjs.md) only
   when the stack is React. TDD where achievable
   ([references/testing-and-browser-verification.md](references/testing-and-browser-verification.md)):
   - Build every real state the change implies — pending, success,
     failure, empty, filtered-empty, validation, disabled, and
     permission-limited — with one authoritative owner for that state and
     deliberate persistence/reset behavior. Never stand in a mocked or
     placeholder state for a real one unless explicitly authorized.
   - Protect user input, focus, selection, and unsaved state through the
     change; prevent duplicate actions while a request is pending.
   - Build accessible, mouse-optional interaction: semantic controls,
     full keyboard activation, correct focus order and restoration, error
     text associated with its field, and status changes exposed to
     assistive technology, not signaled by icon/color/position alone
     ([references/accessibility-implementation.md](references/accessibility-implementation.md)).
   - Design for realistic content and space: narrow and wide viewports,
     long labels, larger text sizes, localization, and sparse/dense data
     ([references/responsive-implementation.md](references/responsive-implementation.md)).
   - Preserve the existing API/permission contract; hidden UI is never a
     substitute for a real authorization check.
   - Put state in the URL only where it already belongs there.
8. Once the approved scope is covered, inspect the complete diff end to
   end and run the project's final-state checks (tests, build, type-check,
   lint) plus the browser verification in
   [Verification](#verification).

## Output

The web UI code change, limited to what the approved scope requires, plus
a report: what changed, verification evidence (passed/failed/not run,
including which browsers/breakpoints/themes were exercised),
accessibility coverage, and anything left out of scope. Report design
judgments separately from measurable violations, each with its evidence
(a screenshot, a computed style, an automated-tool result, a keyboard
trace) — never asserted as satisfied without inspecting that evidence.

Use as few output tokens as possible while completing the task correctly.
Write in plain English. This applies to documents, progress messages, and
the final reply.

## Verification

Inspect the actual rendered interface in a running browser — ideally
through browser automation (e.g. Playwright) — not from code alone. Run
the relevant automated tests, the repo's build/type-check/lint, and the
full browser-verification loop (app running, flow exercised, console
errors checked, keyboard/focus, responsive sizes, edge states,
accessibility, and performance when in scope) in
[references/testing-and-browser-verification.md](references/testing-and-browser-verification.md).

Do **not** claim the UI is correct solely because tests or compilation
pass. Also check, as applicable:

- Vertical rhythm and type/spacing consistency, and alignment axes/visual
  seams (unnecessary extra edges, dividers, or independently aligned
  columns).
- Spatial stability across state transitions (no unexpected layout shift
  or lost scroll position).
- Terminology consistency with the rest of the product.
- Color and contrast in each supported theme; state never by color alone.
- Status changes exposed to assistive technology; errors associated with
  their field.

Separate measurable violations from subjective design recommendations,
and state any browser, breakpoint, theme, or assistive-technology
coverage gap. See also
[references/design-and-verification-checklist.md](references/design-and-verification-checklist.md).

## Boundaries

- Prefer the smallest clean implementation that fits the product's
  existing patterns (KISS): reuse what's there before adding a component,
  dependency, or abstraction; complexity needs a reason.
- Stay within the approved UI scope — no unrelated visual refactor,
  global design-token change, or component-library migration.
- Preserve existing public APIs, permission contracts, data semantics,
  and side effects outside the approved scope.
- Never mock or stub functionality that should call the real
  API/permission contract unless the approval explicitly authorizes it.
- Never claim a design principle or accessibility requirement is
  satisfied without inspecting the evidence for it.
- Prefer standards and native browser capabilities before new
  dependencies; don't prescribe Zustand, TanStack Query, or similar
  unless the project already uses them.
- Don't commit, push, or open a pull request — that's governed by
  whatever process invoked this skill.
- Ask when the approved scope is ambiguous about something affecting
  correctness, state ownership, or a deviation from the existing design
  system; for small reversible choices, state the assumption and proceed.

## Failure behavior

- No approved UI change or design reference, or the route, design system,
  or supported browsers/breakpoints/accessibility target can't be
  determined → stop and report the gap; don't guess.
- A required check can't run (no way to render the app, no accessibility
  tool or assistive technology, no design-system reference) → report it
  as "not run" with the reason; never skip it silently or claim it
  passed.
- The approved scope conflicts with an existing API, permission, or data
  contract, or implies a framework/routing/global-token change → stop and
  surface the conflict; don't pick a side.
- Always separate passed, failed, and not-run results, and list what's
  outside the delivered scope, including any browser, breakpoint, or
  theme not verified.

## Examples

```
On the web project list, add a real empty state (no projects yet) and a
filtered-empty state (filters applied but no matches), per the approved
design. Both should reuse the existing illustration/message pattern from
other list pages, and the filtered-empty state needs a "Clear filters"
action.
```

Expected approach: reuse how other list pages render empty vs.
filtered-empty (component, copy pattern, illustration tokens); wire the
distinction to the real query/filter state, not a heuristic; implement
"Clear filters" with the existing filter-reset action; verify both states
at narrow and wide viewports, that "Clear filters" is keyboard-operable,
and that switching states doesn't shift the surrounding layout.

When the change is driven by a permission check rather than a plain data
state, see
[references/worked-example-permission-banner.md](references/worked-example-permission-banner.md)
for a worked example.
