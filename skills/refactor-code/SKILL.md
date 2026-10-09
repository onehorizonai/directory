---
name: refactor-code
description: >-
  Use when improving internal structure while external behavior stays the
  same — reduce duplication, untangle a dependency, extract or rename,
  clarify a boundary. Name the structural problem, freeze invariants, move
  code in small verified steps, prove nothing observable drifted.

  Not for new capabilities, bug fixes, framework migrations, or any change
  that alters what the system does.
metadata:
  title: Refactor Code
  tagline: "Restructure code without changing what it does. Prove behavior held."
  category: engineering
  tags:
    - refactoring
    - code-quality
    - testing
  compatibility:
    oneHorizon:
      taskModes:
        - code
---

## Overview

Improves how code is structured without changing what it does. A refactor
is judged by whether *no* behavior changed, so it stays separate from
feature and bug-fix work. KISS governs the target state: the smallest
clean structure that fits, reusing existing patterns over inventing new
ones — complexity needs a reason.

## When to use

- The ask is to reduce duplication, split a tangled module, extract a
  function/component, rename for clarity, collapse dead abstraction, or
  otherwise reorganize code that already works.
- Someone says "clean this up", "this file is doing too much", "extract a
  helper for this", or "simplify this without changing what it does".
- A change is described as internal-only: no new capability, output, or
  API response.

## Do not use when

- The ask adds a capability, changes an API response, fixes a bug,
  changes what a user sees or can do, or migrates a
  framework/dependency/runtime — behavior is expected to change, so it's
  approved-behavior work, not a refactor.
- The "cleanup" turns out, once inspected, to depend on changing a return
  value, a side effect, or a public interface — stop and hand it off (see
  Failure behavior).
- The ask is "make this faster" — performance work is judged by a
  benchmark, not by behavior preservation.
- No specific structural problem is named ("make the code better", "add
  more abstraction") — ask what maintenance problem it should solve
  first.

## Prerequisites and inputs

- Read/write access to the target code and the project's test/build
  tooling.
- A named structural problem in scope — e.g. "this logic is duplicated in
  three call sites", "this module imports from a layer it shouldn't",
  "this abstraction has one caller and adds indirection with no payoff".
  Fewer lines, fewer files, or more abstraction is not specific enough;
  with no named problem, treat it as a blocker (see
  [Failure behavior](#failure-behavior)).
- Known invariants (a public API a caller depends on, a data format
  another system reads). If none are supplied, derive them in the
  procedure.
- Explicit exclusions: code, files, or behavior that's off-limits for
  this pass.
- Pointers to the code in scope if known; otherwise locate it during the
  procedure.

## Procedure

1. **Name the problem** — state the concrete structural issue, specific
   enough that it's obvious when it's fixed. "Fewer lines" or "more
   abstraction" is not a target; ask what maintenance pain the current
   structure causes.
2. **Freeze the invariants** — before touching code, list what must not
   change, by class: public interfaces (signatures, exports, routes, CLI
   flags), return values and error behavior, side effects (writes,
   network calls, logging, emitted events), ordering guarantees,
   persisted/stored-data shape, permissions and access checks, timing
   guarantees (timeouts, debounce, rate limits), user-visible and
   accessibility behavior (focus, selection, screen-reader text, keyboard
   paths), and external contracts (API responses, schemas, wire formats).
   Skip a class only when it plainly doesn't apply.
3. **Establish the baseline** — inspect the code's callers, existing
   tests, current output, and recorded design decisions for the area. For
   any step-2 invariant no existing test protects, add a characterization
   test before changing anything. If something looks like a bug rather
   than an intended contract, record it and leave it alone (see step 6).
4. **Transform in the smallest reviewable step** — make one small,
   self-contained structural move (a rename, an extraction, an inline, a
   file move), not several batched. Prefer a mechanical refactoring tool
   when the language/editor has one. Leave out formatting-only changes,
   dependency bumps, and anything the named problem doesn't require.
5. **Inspect the diff for this step** — read the actual diff, including
   the full text of every changed or deleted test, not just whether the
   suite is green. Look for deleted test cases, relaxed assertions,
   changed snapshots, and altered mocks/fixtures. If the step needs a
   real behavior change to work, or a step-2 invariant is unclear, stop
   the loop: clarify the invariant (back to step 2) or exit into
   [Failure behavior](#failure-behavior). Never continue transforming on
   top of an unresolved gap.
6. **Repeat only while the named problem remains** — repeat steps 4–5
   until step 1's problem is resolved, then stop, even if adjacent code
   still looks improvable. Record anything else noticed — a bug, a
   missing feature, a dependency to upgrade — as a separate, out-of-scope
   item, never in this patch.
7. **Final verification** — verify the whole change together, not just
   the last step, per [Verification](#verification).

## Output

The patch, limited to the named structural problem, plus a report with:

- What became simpler and why, tied to the named problem.
- The invariants checked (per step 2) and how each was verified.
- Verification evidence — passed / failed / not run.
- A separate list of anything discovered but excluded: bugs, missing
  features, migrations, or performance issues, each specific enough for a
  follow-up task to pick up.

Use as few output tokens as possible while completing the task correctly.
Write in plain English. This applies to documents, progress messages, and
the final reply.

## Verification

- Exercise the code through the same stable boundary used for the step-3
  baseline (the public API, CLI, or UI entry point) — not through
  internal calls the refactor may have moved — covering the ordinary case
  plus the boundary and failure cases the frozen invariants imply.
- Read the full diff of every changed or deleted test across the whole
  change: confirm no test was deleted, weakened, or given a relaxed
  assertion/snapshot/mock to make the change pass.
- Confirm the complete effect of the change: callers, any generated or
  config output touched, and, for UI code,
  focus/selection/input/navigation/accessibility and async ordering.
- Confirm every step-2 invariant was exercised by some check, not assumed
  safe because nothing failed.

## Boundaries

- No commits, pushes, pull requests, or other publishing actions — that's
  governed by whatever process invoked this skill.
- No bug fixes, features, dependency/framework migrations, or performance
  work in the same patch, however trivial — record them as
  discovered-but-excluded.
- Never weaken, delete, or loosen a test to make a step pass. A test that
  fails only because it referenced an internal name/path the move
  relocated (not because an invariant broke) may be updated to follow the
  move — read that diff with the same scrutiny as any other test change.
- Once the named problem is solved, stop: don't refactor adjacent code,
  chase a lower line count, or add abstraction "while already in there".
- When an invariant or the scope is ambiguous in a way that affects
  correctness or is hard to reverse, raise it; for a small, reversible
  judgment call, state the assumption and proceed.

## Failure behavior

- No named structural problem, or only "make it better" → stop and ask
  what maintenance problem the change should solve; don't invent one.
- No accessible baseline (the existing tests/build can't run, or the code
  has no coverage and none can be added) → stop and report the gap; don't
  move code with no way to verify it stayed equivalent.
- A step needs a real behavior change to work, or an invariant conflicts
  with what the code is asked to do → stop and report the specific
  conflict; that work needs an approved behavior change first.
- A required verification step (test run, build, type-check) can't run →
  report it as "not run" with the reason; never skip it silently or
  assume it would pass.
- Always separate passed, failed, and not-run results, and
  discovered-but-excluded items from what was changed.

## Examples

```
This file has the same validation logic copy-pasted across four handler
functions. Extract it into one shared helper without changing what any
handler returns.
```

Expected approach: name the problem (validation duplicated across four
handlers), freeze invariants (each handler's return value and error
response for valid/invalid input), confirm or add tests for each
handler's validation behavior, extract one shared helper and switch
handlers to it one at a time, inspect each step's diff including test
changes, then run the full handler suite and confirm all four return
exactly what they did before.

When the named problem is a broken dependency boundary rather than
duplicated logic, see
[references/worked-example-dependency-boundary.md](references/worked-example-dependency-boundary.md)
for a worked example.
