---
name: plan-a-refactor
description: >-
  Use when planning a structural code change that must keep external
  behavior identical — reduce duplication, untangle dependencies, split a
  module, extract or rename, clarify a boundary. Returns a refactor plan:
  the maintenance problem, invariants, baseline evidence, and small
  reviewable steps with checks.

  Not for executing the refactor, or for planning features, bug fixes,
  migrations, or any change that alters behavior.
metadata:
  title: Plan a Refactor
  tagline: "Plan a behavior-preserving structural change as small, reviewable steps."
  category: engineering
  tags:
    - planning
    - refactoring
    - code-quality
    - architecture
---

## Overview

A refactor plan is judged by a different standard than a feature plan: not
"is the new behavior correct" but "did anything observable change at all."
Jumping straight to moving code skips the step where that standard gets
established — what the current structure actually does, which of its
effects callers depend on, and how a reviewer would tell a safe
transformation from one that quietly changed something. This skill produces
that missing step: a plan that names the concrete maintenance problem, fixes
the invariants the change must preserve, records the baseline evidence for
them, and breaks the work into small transformations a reviewer can check
one at a time — without doing any of the moving itself.

## When to use

- The ask is to plan reducing duplication, splitting a tangled module,
  extracting a function/component, renaming for clarity, collapsing a dead
  abstraction, or otherwise restructuring code that already works — before
  anyone starts moving code.
- Someone says "plan how we'd clean this up," "what would it take to split
  this module," or "figure out the safest way to extract this, don't do it
  yet."
- The request is explicitly scoped as internal-only (no new capability, no
  different output, no different API response) and wants the approach and
  risk worked out before execution.

## Do not use when

- The plan is for adding a capability, changing an API response, fixing a
  bug, changing what a user sees or can do, or migrating a
  framework/dependency/runtime — any of these means behavior is expected to
  change, which is a feature/change plan, not a refactor plan.
- The refactor is already planned and approved and the next step is doing
  it, not planning it — this skill stops at the plan.
- The ask is "make this faster" — a performance change is judged by a
  benchmark, not by behavior preservation; it needs a different plan even
  if the mechanics look similar.
- No specific structural problem is named — "make the code better" or "add
  more abstraction" isn't a scoped refactor to plan; see
  [Failure behavior](#failure-behavior) instead of inventing one.

## Prerequisites and inputs

- Read access to the target codebase: the code in scope, its callers, its
  existing tests, and any recorded architecture decisions or design docs
  covering that area. No write, execution, or build/deploy access is
  required — this skill only reads and plans.
- The maintenance problem to plan for — e.g. "this logic is duplicated
  across three call sites," "this module imports from a layer it
  shouldn't," "this function does five unrelated things." A goal stated
  only as fewer lines, fewer files, or more abstraction is not specific
  enough to plan from.
- Any invariants already known to matter (a public API a caller depends
  on, a persisted data format another system reads) — if none are
  supplied, derive them during the procedure rather than skipping the
  step.
- Explicit exclusions: code, files, or behavior that's off-limits for this
  pass even if related.
- Pointers to the code in scope, if already known; otherwise locate it
  during inspection.

## Procedure

1. **Name the problem.** State the concrete structural issue precisely
   enough that it's obvious when it's solved. Reject "fewer lines" or "more
   abstraction" as the actual target — if the request only states one of
   those, treat the real problem as unresolved (see
   [Failure behavior](#failure-behavior)) rather than planning around a
   restated preference.
2. **Freeze the invariants.** Enumerate, by class, what the plan must not
   change: public interfaces (signatures, exports, routes, CLI flags),
   return values and error behavior, side effects (writes, network calls,
   logging, emitted events), ordering guarantees, persisted/stored-data
   shape, permissions and access checks, timing guarantees, user-visible and
   accessibility behavior, and external contracts (API responses, schemas,
   wire formats other systems depend on). Skip a class only when it plainly
   doesn't apply to the code in scope, not by default. Carry over exact
   identifiers (function, endpoint, table, flag, field names) as found in
   the code, not paraphrased.
3. **Establish baseline evidence.** Inspect the code's callers, its existing
   tests, its current output, and its affected boundaries — the stable
   entry points (public API, CLI, UI) through which behavior will later be
   verified. For each invariant from step 2 that no existing test actually
   protects, the plan must include adding a characterization test for it
   before any transformation touches that code — do not plan the move
   first and the safety net later. If inspection surfaces something that
   looks like a bug rather than an intended contract, record it separately
   and leave it out of scope (see step 5).
4. **Plan the transformations.** Break the recommended structural change
   into small, reviewable steps (a rename, an extraction, an inline, a file
   move) rather than one batched pass. Prefer a step that a mechanical
   refactoring tool can perform when the language/editor/IDE has one, since
   a tool cannot silently retype behavior the way a freehand rewrite can.
   Each step states what changes and pairs it with the check that verifies
   nothing observable moved — reading the diff (including any touched
   test's full text, not just pass/fail) and exercising the boundary from
   step 3 for the ordinary case plus the boundary and failure cases implied
   by the frozen invariants. Sequence steps so each stands independently
   checkable; leave formatting-only changes and dependency bumps out
   entirely unless the named problem requires them.
5. **Keep other work out.** Do not fold a feature, a bug fix, a dependency
   or framework migration, or a performance change into this plan, even
   when it looks trivial or adjacent. List each discovered-but-excluded
   item by name (what it is, where it was found) as a separate follow-up,
   not as an extra step.
6. **Define the stopping condition.** State plainly what "the named problem
   is solved" looks like structurally, so the plan (and whoever executes
   it) has an explicit point to stop at rather than continuing to refactor
   adjacent code that still looks improvable.
7. **Surface unresolved decisions.** Where an invariant is ambiguous, where
   the boundary of "in scope" is unclear, or where a step might turn out to
   need an actual behavior change to work, mark it as a blocking open
   question with the specific choice and its consequence — do not resolve
   it by assuming a direction. For a small, reversible judgment call
   instead, state the assumption and proceed.
8. **Stop at the plan.** Once the problem, invariants, baseline, steps, and
   stopping condition are concrete enough for another capable agent to
   execute and verify without this conversation, return the plan. Do not
   transform any code.

## Output

A single self-contained plan, in this order: Problem (the named maintenance
issue and what "solved" means); Invariants (by class, with exact
identifiers); Baseline evidence (callers, existing tests, current output,
and which invariants currently lack test coverage); Excluded work
(discovered-but-excluded bugs, features, migrations, performance items,
named specifically); Transformation steps, each paired with its check;
Stopping condition; Open questions (blocking vs. non-blocking); Authority/
approval points. Facts, assumptions, decisions, and open questions stay
visibly separate.

## Verification

Before returning the plan, confirm:
- The named problem is a structural one, not a restated preference for
  fewer lines or more abstraction.
- Every invariant class in step 2 was considered explicitly — "skipped, not
  applicable" is stated, not silently omitted.
- Every invariant traces to something actually inspected (code, tests,
  docs, output) — not assumed.
- Any invariant lacking existing test coverage has a characterization-test
  step planned before the transformation step that touches it.
- Each transformation step is small enough to review independently and
  names its own check.
- Behavior changes, bug fixes, dependency/framework migrations, and
  performance work are listed as excluded, not folded into a step.
- The stopping condition is explicit, not "keep improving while it looks
  better."
- A capable agent with no access to this conversation could execute and
  verify the plan from the document alone.

## Boundaries

- Plan only: never move, rename, extract, delete, or otherwise edit code,
  and never commit, open a pull request, or run build/deploy commands as
  part of this skill.
- Never state an invariant or baseline fact that wasn't actually observed
  in code, tests, or output — say "unknown, needs inspection" instead of
  guessing.
- Don't perform state-changing actions against the target system while
  planning, even to "check" something — read-only inspection only.
- Never plan a step that depends on weakening, deleting, or loosening an
  existing test to make it pass. Where a test only references an internal
  name or path that a planned move relocates, plan for it to be updated to
  follow the move — and flag that update for the same scrutiny as any other
  test change at execution time.
- Ask before proceeding only on decisions that are irreversible, costly, or
  materially change scope, risk, or architecture; state and proceed on
  everything else.

## Failure behavior

- No named structural problem exists, or the request only maps to "make it
  better" — stop and say what's missing (a specific maintenance problem)
  instead of inventing one to plan around.
- The target code, its callers, or its tests can't be inspected (no access,
  or the code doesn't exist yet) — say exactly what access or context is
  missing rather than planning on assumptions.
- An invariant can't be resolved from available evidence — list it as a
  blocking open question with the specific choice and its consequence,
  don't pick one silently.
- Inspection reveals the change can't stay behavior-preserving (a step
  would require changing a return value, a side effect, or a public
  interface to work) — say so plainly instead of forcing it into a
  behavior-preserving shape; that scope belongs to a feature/change plan,
  not this one.
- Always separate what was actually inspected from what's assumed, and list
  discovered-but-excluded items separately from the planned steps.

## Examples

```
This file has the same validation logic copy-pasted across four handler
functions. Plan how we'd extract it into one shared helper without changing
what any handler returns — don't write the change yet.
```

Expected approach: name the problem (validation duplicated across four
handlers), freeze invariants (each handler's current return value and error
response for valid/invalid input), inspect existing tests and note which
handlers lack coverage for those cases, plan characterization tests for the
gaps, then plan the extraction as one small step per handler (each paired
with a check that the handler's response is unchanged), name the stopping
condition (all four handlers call the shared helper, no handler's response
changed), and return the plan without touching the handlers.

When the named problem is a broken dependency boundary rather than
duplicated logic, see
[references/worked-example-dependency-boundary.md](references/worked-example-dependency-boundary.md)
for a worked example.
