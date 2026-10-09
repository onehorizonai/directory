---
name: build-feature
description: >-
  Use when an approved feature, bug fix, or behavior change is ready to
  implement in an existing codebase — Initiative, Bug, TODO, spec, or plan
  already says what should happen.

  Not for discovery or design, unscoped refactors, dependency upgrades,
  unconfirmed defects, or UI-only changes (layout, states, interaction,
  visuals).
metadata:
  title: Build a Feature
  tagline: "Build an approved feature or change into the existing codebase, with tests that prove it."
  category: engineering
  tags:
    - coding
    - implementation
    - testing
  compatibility:
    oneHorizon:
      taskModes:
        - code
---

## Overview

Implements a feature or change that's already approved — a linked
Initiative, Bug, TODO, spec, or plan says what should happen. It does not
decide what to build. It produces the smallest clean patch that matches
the codebase's code style and architecture patterns (KISS: the simplest
solution that fits, never a hack or code smell), built test-first unless
a named skip applies, and verified with real checks.

## When to use

- An approved feature, bug fix, or behavior change exists (a linked
  Initiative, Bug, TODO, spec, or approved plan) and the next step is
  writing the code for it in an existing codebase.
- The user asks to "implement X" / "build this" / "make this change" and
  points at scope that's already decided.

## Do not use when

- Scope is still discovery, design, or "what should we build" — resolve
  and approve it first.
- The change is a full rewrite, architecture migration, or dependency
  upgrade, unless that is explicitly the approved change.
- The reported defect's cause is not confirmed — diagnose before
  building.
- The approved scope is the interface itself (layout, states,
  interaction, or visual/structural presentation on web or native), not
  a behavior/API change that happens to touch a view — that needs
  platform or browser verification as the primary job.
- There is no approved scope that maps to a real code path — see
  Failure behavior.

## Prerequisites and inputs

- Read/write access to the target repository and its test/build tooling.
- The approved scope: what should change and, ideally, how success will
  be checked, in enough detail to restate as a testable statement. If
  neither exists, it's a blocker (see Failure behavior); don't infer
  scope from the codebase alone.
- Constraints from the approval (must preserve an API, must not touch a
  given area, must ship behind a flag, etc.).
- Pointers to the relevant code if known; otherwise locate it during the
  procedure.

## Procedure

1. Restate the approved behavior as one or more concrete, testable
   statements, and note anything the scope leaves ambiguous.
2. Inspect the existing implementation, its callers, its tests, and the
   project's conventions before writing anything — including local
   **code style** (naming, layout, error handling, typing, formatter/
   linter norms in neighboring files) and **architecture patterns**
   (which layer owns similar behavior and how peers call through it).
3. Choose among implementations that (a) satisfy the approved behavior,
   (b) match existing code style and architecture patterns, and (c) are
   not a hack or a one-off the next similar change would have to rip
   out. Among those, pick the smallest. If the smallest candidate is a
   smell — a silenced error, copy-paste duplicate, magic value, a
   growing god function/module, bypassing the existing pattern, or a
   workaround that hides the real change — reject it and take the
   next-smallest clean option. Future-proof means using the extension
   point the codebase already has instead of hardcoding a closed special
   case; it does not mean adding unused abstraction or speculative
   features "just in case." For smell catalogs, layering vocabulary, and
   the choose-among-options rule in fuller form, see
   [references/design-patterns.md](references/design-patterns.md).
4. Work test-driven (red → green → refactor): write or extend a test so
   it fails for the new behavior, implement the change in the existing
   style/architecture, confirm the test passes, then refactor while
   staying green. Skip TDD only when the user or approval clearly says
   not to write tests, or when a meaningful automated test isn't
   achievable (e.g. complex UI with no existing harness). "Slightly
   inconvenient" is not a skip. When skipped, say so in the report and
   still verify through the real boundary the change is reached through.
   Otherwise implement in small increments, running the relevant checks
   after each one. For the loop, skip gates, and evidence expectations,
   see
   [references/test-driven-development.md](references/test-driven-development.md).
5. Once the approved scope is covered, inspect the complete diff end to
   end and run the project's final-state checks (tests, build, type-check,
   lint — whatever the project documents).

## Output

The code patch, limited to what the approved behavior requires, plus a
short report: what changed, the verification evidence (passed / failed /
not run), any TDD skip and its reason, and anything left out of scope.

Use as few output tokens as possible while completing the task correctly.
Write in plain English. This applies to documents, progress messages, and
the final reply.

## Verification

Map each piece of the approved behavior to an actual check and run it —
never report a check as passed without running it. Unless a named TDD
skip applied, show evidence that the new or updated test failed before
the change and passed after. Test through the real boundary the change is
reached through (API, CLI, UI), covering the ordinary case plus the
boundary and failure cases the approved behavior implies. For UI,
stateful, or async/distributed changes, verify the specific things this
change could break (e.g. focus/selection, retries, ordering), not only
the happy path.

## Boundaries

- Stay tied to the approved behavior — no unrelated cleanup, renames,
  dependency upgrades, or architecture changes unless explicitly part of
  the approval.
- Match the surrounding code style and architecture patterns; don't
  introduce a personal style or a new layering approach in the same area.
- Preserve existing public APIs, permissions, data semantics, and side
  effects outside the approved scope.
- Never ship a hack or code smell when a clean option that fits existing
  patterns exists, and never add speculative architecture or unused
  abstraction.
- Never weaken or delete a test to make the change pass.
- Don't commit, push, or open a pull request — that's governed by
  whatever process invoked this skill.
- When the approved scope is ambiguous about something that affects
  correctness or architecture, or is hard to reverse, ask; for small
  reversible choices, state the assumption and proceed.

## Failure behavior

- No approved scope, or it doesn't map to any real code path → stop and
  report the gap; don't guess at requirements.
- A required test/build/lint step can't run → report it as "not run" with
  the reason; don't skip it silently.
- The approved behavior conflicts with an existing contract (an API, a
  permission, a data guarantee), or every implementation that satisfies
  it is a hack or smell → stop and surface the conflict; don't pick a
  side.
- Always separate passed, failed, and not-run results, and list what's
  left outside the delivered scope.

## Examples

```
Implement the approved change: add a `status` filter query param to
GET /api/orders that returns only orders matching the given status.
Acceptance: invalid status returns 400; omitted status returns all
orders (current behavior unchanged).
```

Expected approach: read the orders route/controller, its tests, and how
other query params are validated on this endpoint; write failing tests
for a valid status, an invalid status (400), and the omitted case
(unchanged); implement the filter through the same validation/error
pattern and layering — not a one-off `if status == …` special case;
confirm the tests pass, refactor any smell, run the route's test suite,
and report the results.

```
Add a "Duplicate order" action next to the existing "Delete order" action
in the orders list UI, per the approved design. Duplicating should copy
the order's fields except id and createdAt.
```

Expected approach: mirror the existing Delete action's component/handler.
If a component/UI test surface exists, write a failing test covering the
duplicated fields and that id/createdAt differ, then implement Duplicate
on the same event/state-update path. If no meaningful automated test is
achievable, skip TDD with that reason in the report and verify through
the real UI boundary. Inspect the diff before reporting.
