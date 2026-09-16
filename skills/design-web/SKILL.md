---
name: design-web
description: >-
  Use when designing a site, web app, or responsive browser UI — "design
  this page", "redesign this dashboard for desktop and mobile". Returns a
  handoff for layout, hierarchy, typography, color, spacing, states, and
  responsive behavior.

  Not for native app design, production code, platform-agnostic UX with no
  web surface yet, or QA review of a built UI.
metadata:
  title: Design Web
  tagline: "Design browser UI: layout, hierarchy, and responsive behavior. No production code."
  category: design
  tags:
    - web-design
    - frontend-design
    - visual-design
    - responsive
    - ui-design
---

## Overview

A web interface designed from a template, or from components first,
tends to ignore what the user is actually trying to accomplish and which
states they hit. This skill produces **web front-end design** for
browser surfaces. It works in a fixed order — Outcome → Objects →
Actions → Concepts → Use cases → Priority → States → Structure →
Hierarchy → Interaction → Visual refinement → Verification — then
applies the product's design system. It returns a handoff an implementer
(and a later review) can use. It does not write production code, does
not cover native/desktop chrome, and does not review a running build.

**Design vs build:** this skill answers what the experience should look
like and how it should behave. Component APIs, React/architecture,
testing, and patches are later implementation work — not this
procedure.

**Less is more:** every visible element has to earn its place. Prefer
fewer controls, competing actions, containers, borders, visual levels,
words, and decorative elements over more of them; use progressive
disclosure for anything that doesn't need to be visible all the time.

Method detail lives in `references/` and is loaded on demand. Do not
load every file up front.

## When to use

- The ask is to **design** a web page, web app screen, marketing
  section, or responsive browser UI — "design this pricing page",
  "propose a layout for the dashboard", "redesign this flow for mobile
  and desktop web".
- Someone wants layout / visual / interaction treatment for the **web**
  before or without implementing it.
- The target surface is a browser (narrow, medium, or wide web).

## Do not use when

- The target is a native or desktop app (iOS, Android, macOS, Windows,
  Linux, iPad), including a web-rendered desktop shell whose chrome
  should follow the **host OS** rather than the browser.
- The ask is only a platform-independent interaction model (actors,
  objects, actions, use cases) with no web surface yet.
- The ask is to implement, restyle in code, or ship the interface.
- The ask is to review an already-built running interface for defects
  rather than produce a design.

## Prerequisites

- A brief or approved scope: product/page/flow, audience, success
  criteria, and any brand or design-system constraints.
- Read access to existing product/brand context when designing inside
  an existing site (patterns, tokens, comparable pages).
- Ability to fetch current public web UI/accessibility guidance when a
  loaded reference says to (do not treat remembered WCAG numbers or
  checklist items as timeless).
- No write access to the product codebase is required — this skill
  produces a handoff, not a patch.

## Inputs

- The design request and success criteria, in full.
- Known space/input constraints (or ask): widths, touch vs pointer,
  languages.
- Brand, design-system, or reference URLs/screens if available.
- Accessibility target if the product has one (otherwise assume WCAG
  2.2 AA intent unless the brief says otherwise).

## Procedure

1. **Ground.** Restate audience, constraints, and brand/design-system
   context. Prefer existing web patterns/tokens before inventing. If the
   brief is vague, pin assumptions and declare them.
2. **Model before chrome.** Load
   [references/ui-reasoning.md](references/ui-reasoning.md). Work
   Outcome → Objects → Actions → Concepts → Use cases → Priority
   (1–5). Do **not** place pages, cards, buttons, or styling yet.
   Prefer the user's mental model over backend names.
3. **States.** Load [references/states.md](references/states.md). Specify
   the matrix for important objects and use cases — first-use vs empty vs
   filtered-empty vs error vs permission are different.
4. **Structure.** Load
   [references/structure-hierarchy.md](references/structure-hierarchy.md)
   and, when space/input changes,
   [references/responsive-adaptive.md](references/responsive-adaptive.md).
   Derive IA from the object model; Gestalt, alignment, rhythm, attention
   budget; map priority → hierarchy with the fewest signals. For each
   major region, say whether it stays, grows, wraps, reflows, moves, or
   hides.
5. **Interaction.** Load
   [references/motion-feedback.md](references/motion-feedback.md) and, as
   needed:
   - live web UI rules →
     [references/interaction-and-states.md](references/interaction-and-states.md)
     (fetch the current Web Interface Guidelines URL there)
   - forms / validation / auth UX →
     [references/forms-and-input.md](references/forms-and-input.md)
   - a11y intent → [references/accessibility.md](references/accessibility.md)
   - 0/1/many, i18n, overflow →
     [references/hardening-and-edge-cases.md](references/hardening-and-edge-cases.md)
   - dashboards/tables/charts →
     [references/data-heavy-ui.md](references/data-heavy-ui.md)
6. **Visual refinement last.** Load
   [references/visual-design.md](references/visual-design.md) for type,
   color, signature, and anti-generic-AI checks — only after the model
   and hierarchy exist. One signature; everything else quieter.
7. **Verify.** Load [references/verification.md](references/verification.md).
   Walk use cases (not mockups); grayscale and skeleton; object/action
   coverage. Fix the design; do not defer to implementation.
8. **Handoff and stop.** Return the output below. No production code,
   commits, or PRs.

## Output

A single self-contained **web design handoff**, in this order:

1. **Outcome** — what the user can accomplish, independent of UI.
2. **Model** — objects, actions, concepts, use cases (capability form),
   priority scores (1–5) and their basis.
3. **States** — matrix with recovery and preserved work; empty ≠
   filtered-empty ≠ error.
4. **Structure** — IA, grouping, alignment, rhythm; what each region
   does as space changes.
5. **Interaction** — patterns, motion/feedback/recovery, keyboard/focus
   intent, a11y as design contracts (not ARIA snippets).
6. **Visual treatment** — hierarchy mapped from priority; tokens/roles;
   signature; anti-generic-AI check.
7. **Product context used** — pages/tokens actually inspected.
8. **Rationale** — short decisions only.
9. **Open questions** — blocking vs non-blocking.
10. **Out of scope**

Not production code. This model is what a later review walks. Write the
handoff in plain, concrete English — the shortest phrasing that still
tells the reader what they need to act.

## Verification

Before returning the handoff, confirm:

- The ordered model was completed before components or styling.
- Priority scores exist or are listed unknown — not silently invented.
- Distinct empty / filtered-empty / error / permission states are
  specified where reachable.
- Hierarchy matches declared priority (grayscale / blur).
- The design does not default to generic AI-template aesthetics unless
  the brief asked for that look.
- Use-case walk in [references/verification.md](references/verification.md)
  was applied, including object/action coverage.
- Live UI/a11y rules a reference says to fetch were fetched, or marked
  unverified.
- No production code, repo writes, commits, or PRs were produced.
- Facts, assumptions, decisions, and open questions stay separate.

## Boundaries

- Web / browser surfaces only.
- Design and specify — do not implement in the product codebase,
  commit, push, or open a pull request.
- Prefer the product's existing web design system when one exists.
- Do not invent a second source of truth (`spec.md` / `plan.md`); this
  handoff is the contract.
- Do not emit ARIA attribute recipes or framework component trees —
  those are implementation.
- Ask rather than assume when the page job, accessibility target, or a
  hard-to-reverse visual direction is unclear; for small reversible
  choices, state the assumption and proceed.

## Failure behavior

- Goal of the request is undefined (not just the visual approach) →
  say so instead of designing an assumed page.
- Brand/design-system context is missing for an existing product →
  state the limitation and design against the brief, naming
  assumptions rather than inventing a second brand.
- A referenced live guidance document cannot be fetched → mark those
  checks unverified; don't invent current WCAG/UI-checklist numbers
  from memory as if verified.
- The brief demands native-app chrome on the web (or identical UI to
  an iOS/Android app) → surface the conflict; design for the browser
  unless the caller explicitly accepts a documented deviation.

## Examples

```
Design a pricing page for our marketing site: three tiers, monthly/annual
toggle, FAQ below. Match the existing brand; desktop and mobile web.
```

Expected approach: inspect existing marketing pages and tokens; model
outcome (choose a plan) and objects (tier, interval, FAQ) with priority
before layout; load ui-reasoning then responsive-adaptive + visual-design
last; specify toggle/FAQ states; return a handoff — no production code.

```
Redesign the web app's project list empty state and filtered-empty state
so they feel consistent with the rest of the product.
```

Expected approach: distinguish empty vs filtered-empty as different
states with different next actions; load states + interaction-and-states;
propose layout, copy placement, and dead-chrome removal from that model;
return a handoff — no code.
