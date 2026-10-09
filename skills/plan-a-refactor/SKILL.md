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
  compatibility:
    oneHorizon:
      taskModes:
        - plan
---

## Overview

Plans a behavior-preserving refactor before any code moves. It names the
concrete maintenance problem, fixes the invariants the change must
preserve, records the baseline evidence for them, and splits the work
into small transformations a reviewer can check one at a time. It moves
no code.

## When to use

- The ask is to plan reducing duplication, splitting a tangled module,
  extracting a function/component, renaming for clarity, collapsing a dead
  abstraction, or otherwise restructuring working code.
- Someone says "plan how we'd clean this up", "what would it take to split
  this module", or "figure out the safest way to extract this, don't do it
  yet".
- The request is scoped as internal-only (no new capability, output, or
  API response) and wants approach and risk worked out first.

## Do not use when

- Behavior is expected to change — adding a capability, changing an API
  response, fixing a bug, changing what a user sees or can do, or
  migrating a framework/dependency/runtime. That's a feature/change plan.
- The refactor is already planned and approved and the next step is doing
  it.
- The ask is "make this faster" — performance work is judged by a
  benchmark, not by behavior preservation.
- No specific structural problem is named ("make the code better", "add
  more abstraction") — see [Failure behavior](#failure-behavior).

## Prerequisites and inputs

- Read access to the code in scope, its callers, its tests, and any
  architecture decisions or design docs for that area. No write,
  execution, or build/deploy access is needed.
- The maintenance problem — e.g. "this logic is duplicated across three
  call sites", "this module imports from a layer it shouldn't", "this
  function does five unrelated things". Fewer lines, fewer files, or more
  abstraction is not specific enough.
- Known invariants (a public API a caller depends on, a persisted format
  another system reads). If none are supplied, derive them in the
  procedure.
- Explicit exclusions: code, files, or behavior that's off-limits for
  this pass.
- Pointers to the code in scope if known; otherwise locate it during
  inspection.

## Procedure

1. **Name the problem.** State the structural issue precisely enough that
   it's obvious when it's solved. "Fewer lines" or "more abstraction" is
   not a target — if that's all the request states, treat the problem as
   unresolved (see [Failure behavior](#failure-behavior)).
2. **Freeze the invariants.** List, by class, what must not change:
   public interfaces (signatures, exports, routes, CLI flags), return
   values and error behavior, side effects (writes, network calls,
   logging, emitted events), ordering guarantees, persisted/stored-data
   shape, permissions and access checks, timing guarantees, user-visible
   and accessibility behavior, and external contracts (API responses,
   schemas, wire formats). Skip a class only when it plainly doesn't
   apply. Copy exact identifiers (function, endpoint, table, flag, field
   names) from the code.
3. **Establish baseline evidence.** Inspect the code's callers, existing
   tests, current output, and affected boundaries — the stable entry
   points (public API, CLI, UI) through which behavior will later be
   verified. For each step-2 invariant no existing test protects, plan a
   characterization test before any transformation touches that code. If
   something looks like a bug rather than an intended contract, record it
   separately and leave it out of scope (see step 5).
4. **Plan the transformations.** Break the change into small, reviewable
   steps (a rename, an extraction, an inline, a file move), not one
   batched pass. Prefer steps a mechanical refactoring tool can perform
   when the language/editor has one. Each step states what changes and
   the check that nothing observable moved: reading the diff (including
   the full text of any touched test, not just pass/fail) and exercising
   the step-3 boundary for the ordinary case plus the boundary and failure
   cases the invariants imply. Order steps so each can be checked on its
   own. Leave out formatting-only changes and dependency bumps unless the
   named problem requires them. Follow the repo's conventions and
   agent/contributor guidance (`AGENTS.md`, `CONTRIBUTING`) for where code
   moves and what it's called, and name the commands the repo uses to
   test, lint, type-check, and build (package scripts, Makefile, CI
   config).
5. **Keep other work out.** Don't fold in a feature, bug fix, dependency
   or framework migration, or performance change, however trivial or
   adjacent. List each excluded item by name (what it is, where it was
   found) as a separate follow-up.
6. **Define the stopping condition.** State what "the named problem is
   solved" looks like structurally, so execution has an explicit point to
   stop.
7. **Surface unresolved decisions.** Where an invariant is ambiguous, the
   scope boundary is unclear, or a step might need a behavior change to
   work, mark a blocking open question with the specific choice and its
   consequence — don't assume a direction. For a small, reversible
   judgment call, state the assumption and proceed.
8. **Stop at the plan.** Once the problem, invariants, baseline, steps,
   and stopping condition are concrete enough for another capable agent
   to execute and verify from the plan and the repository alone, return
   the plan. See
   [references/coding-agent-handoff.md](references/coding-agent-handoff.md)
   for what that handoff needs. Do not transform any code.

## Output

A single self-contained plan, in this order: Problem (the maintenance
issue and what "solved" means); Invariants (by class, with exact
identifiers); Baseline evidence (callers, existing tests, current output,
and which invariants lack test coverage); Excluded work (bugs, features,
migrations, and performance items found but excluded, named specifically
— the executor leaves these alone); Transformation steps, each paired
with its check; Validation (the repo's test, lint, type-check, and build
commands); Stopping condition; Open questions (blocking vs.
non-blocking); Authority/approval points; Report back (ask the executor
to finish with what changed, which validation ran, and anything that
turned out not to be behavior-preserving). Keep facts, assumptions,
decisions, and open questions visibly separate. Drop Excluded work and
Open questions when there are none.

Use as few output tokens as possible while completing the task correctly.
Write in plain English. This applies to documents, progress messages, and
the final reply.

## Verification

Before returning the plan, confirm:
- The named problem is structural, not a preference for fewer lines or
  more abstraction.
- Every step-2 invariant class was considered; skipped ones are stated as
  not applicable.
- Every invariant traces to something inspected (code, tests, docs,
  output).
- Every untested invariant has a characterization-test step before the
  transformation that touches it.
- Each transformation step is small enough to review alone and names its
  check.
- Behavior changes, bug fixes, migrations, and performance work are
  listed as excluded, not folded into a step.
- The stopping condition is explicit.
- The validation commands named exist in the repo.
- A capable agent without this conversation could execute and verify the
  plan from the document and the repository alone.

## Boundaries

- Plan only: never move, rename, extract, delete, or otherwise edit code,
  and never commit, open a pull request, or run build/deploy commands.
- Never state an invariant or baseline fact that wasn't observed in code,
  tests, or output — say "unknown, needs inspection".
- Read-only inspection only: no state-changing actions against the target
  system, even to "check" something.
- Never plan a step that depends on weakening, deleting, or loosening a
  test. Where a test only references an internal name or path that a
  planned move relocates, plan for it to be updated to follow the move,
  and flag that update for the same scrutiny as any other test change.
- Ask before proceeding only on decisions that are irreversible, costly,
  or materially change scope, risk, or architecture; state and proceed on
  everything else.

## Failure behavior

- No named structural problem, or only "make it better" → stop and say
  what's missing (a specific maintenance problem); don't invent one.
- The target code, its callers, or its tests can't be inspected → say
  exactly what access or context is missing.
- An invariant can't be resolved from available evidence → list it as a
  blocking open question with the specific choice and its consequence.
- The change can't stay behavior-preserving (a step would need to change
  a return value, a side effect, or a public interface) → say so; that
  scope belongs to a feature/change plan.
- Always separate what was inspected from what's assumed, and excluded
  items from planned steps.

## Examples

```
This file has the same validation logic copy-pasted across four handler
functions. Plan how we'd extract it into one shared helper without changing
what any handler returns — don't write the change yet.
```

Expected approach: name the problem (validation duplicated across four
handlers), freeze invariants (each handler's return value and error
response for valid/invalid input), note which handlers lack tests for
those cases and plan characterization tests for the gaps, plan the
extraction as one small step per handler with a check that its response
is unchanged, and name the stopping condition (all four call the shared
helper, no response changed). Touch no handler.

When the named problem is a broken dependency boundary rather than
duplicated logic, see
[references/worked-example-dependency-boundary.md](references/worked-example-dependency-boundary.md)
for a worked example.
