---
name: review-a-refactor
description: >-
  Use when a diff, PR, or branch is claimed to be a behavior-preserving
  refactor and you need to verify that claim. Check behavioral
  equivalence, catch hidden features/fixes/migrations, inspect weakened
  tests, and judge structural correctness against the named problem.
  Returns prioritized findings only.

  Does not edit code. Not for changes never claimed as refactors, and not
  for performing the refactor.
metadata:
  title: Review a Refactor
  tagline: "Check whether a claimed refactor actually preserved behavior."
  category: engineering
  tags:
    - refactoring
    - code-review
    - regressions
    - testing
  compatibility:
    oneHorizon:
      taskModes:
        - review
---

## Overview

Reviews one concrete change claimed to be behavior-preserving. It fixes
the change range and the invariants the change should preserve, checks
behavioral equivalence, checks the diff didn't grow into
approved-behavior work, inspects the test diff for weakened coverage, and
judges whether the named structural problem was solved — without
demanding a different architecture as a matter of taste. It does not edit
the code or perform the refactor.

## When to use

- A diff, PR, commit range, or branch is presented as a refactor —
  "behavior-preserving", "just cleanup", "no functional change",
  "internal only" — and needs checking against that claim before merge.
- Someone wants to know whether a "simple rename/extraction/reorg" changed
  what the system does, drops state, or weakens a permission check.
- A refactor's test diff needs scrutiny for deleted cases, relaxed
  assertions, or altered snapshots/mocks/fixtures.
- A change claims to solve a specific structural problem and it's unclear
  whether it solved it, left it half-done, or expanded into adjacent
  restructuring.

## Do not use when

- The change was never claimed to be behavior-preserving, or its purpose
  is a feature, bug fix, or migration — the equivalence bar would reject
  the behavior change it was meant to make. Review it for defects and
  requirement coverage instead.
- The request is to perform or continue the refactor.
- The change range or the invariants/baseline can't be pinned down —
  resolve that first (see [Failure behavior](#failure-behavior)).
- The request is to also apply a fix — review first; fixing is a
  separate, explicitly authorized step.

## Prerequisites and inputs

- A fixed review target and baseline: a diff, PR, commit range, or branch
  against a named base commit/branch. A target that is still moving is a
  blocker.
- Read access to the repository at that target and baseline and, where
  available, the ability to run its tests/build/lint.
- The named structural problem and any stated invariants — public
  interfaces, values/errors, side effects, ordering, persisted state,
  permissions, timing guarantees, and external contracts that must stay
  the same. If not supplied, derive them from the PR description, the
  linked Initiative/Bug/TODO, the code's callers and tests, and its
  current behavior — never invent an invariant not traceable to one of
  those.
- Explicit exclusions — code or behavior stated as out of scope.

## Procedure

1. **Fix the target and baseline** — state the exact change range and
   confirm it isn't still moving, before reading any code.
2. **Fix the stated invariants** — collect the named structural problem
   and the invariants the change claims to preserve; where none were
   supplied, derive them from the linked Initiative/Bug/TODO, the PR
   description, callers, and existing tests. A change with no derivable
   invariants and no stated problem is a scope gap (see
   [Failure behavior](#failure-behavior)), not license to review against
   assumptions.
3. **Check scope purity** — read the diff for anything that isn't a
   structural move: a new capability, a changed return value or error
   behavior, a bug fix, a dependency/framework migration, or a
   performance change. Each is approved-behavior work under refactor
   cover, however small, unless explicitly named as in scope. Judge each
   hunk against the stated invariants and named problem, not by how it
   looks; a flagged hunk still passes through step 7 before it is
   reported.
4. **Check behavioral equivalence** — for each step-2 invariant, check
   the diff preserves it: altered public interfaces/signatures/routes,
   lost or reshaped state, changed or missing side effects,
   permission/access-check changes, and async ordering changes (a step
   that now happens after another, or a new race). Read the code, not
   just its description.
5. **Inspect the test diff for weakened coverage** — read every changed
   or deleted test in full. Look for deleted cases, relaxed assertions,
   changed snapshots, and altered mocks/fixtures. A test change that only
   follows a rename/move (same case, same assertion, updated reference)
   is not a weakening; one that reduces what's checked is.
6. **Judge structural correctness against the named problem** — was the
   step-2 problem resolved: old and new code paths aren't both live,
   duplicate logic wasn't left at other call sites, no dead code remains,
   and an extracted abstraction has a real payoff (more than one caller,
   or a boundary it clarifies)? A preference for a different pattern,
   more abstraction, or a different file layout is not a finding — only
   the diff's own stated problem left unsolved, half-done, or made worse.
7. **Validate every suspected issue** — check it against code, tests, a
   reproduction, or another appropriate source before it counts as a
   finding. Never report an unvalidated suspicion as a confirmed
   regression.
8. **Rank and classify findings** — split into confirmed regressions
   (equivalence, scope, or structural-correctness violations), open
   questions (suspected but unconfirmed), and optional improvements
   (non-blocking, never a bare architecture preference), prioritized by
   real impact with duplicates consolidated.

## Output

Return findings in these groups, in this order, visibly separate:

1. **Confirmed regressions** — validated equivalence, scope-purity, or
   structural-correctness violations, most impactful first.
2. **Open questions** — suspected issues that couldn't be confirmed or
   denied.
3. **Optional improvements** — real but non-blocking suggestions; never a
   bare "I would have structured this differently."

Each finding includes:

- **Severity/priority**
- **Location** — file/function/line or equivalent
- **Failure scenario** — the input, state, caller, or timing that exposes
  it
- **Impact**
- **Evidence** — the specific diff line, test, or behavior observed
- **Suggested correction** — the smallest supported fix or decision,
  described only
- **Confidence/condition** — when an assumption remains

State the overall verdict in one line: the change held to its
behavior-preserving claim, partially held it (violations named), or
wasn't a refactor (scope expanded into approved-behavior work). Don't pad
to a quota: an empty confirmed-regressions list is a complete result when
the change is clean.

Use as few output tokens as possible while completing the task correctly.
Write in plain English. This applies to documents, progress messages, and
the final reply.

## Verification

Before returning findings, confirm:

- The target and baseline are stated (step 1).
- Invariants were stated or explicitly derived, not invented (step 2).
- Every hunk was placed as a structural move or flagged as possible
  hidden behavior/scope (step 3).
- Equivalence was checked against every invariant class that plausibly
  applies — state, side effects, permissions, async ordering, not just
  the return value (step 4).
- Every changed or deleted test was read in full (step 5).
- Structural correctness was judged against the diff's own named problem;
  no finding rests on "a different architecture would be nicer" (step 6).
- Every confirmed regression was validated (step 7).
- The three groups are separate, nothing was edited, and no secrets
  appear in the output.

## Boundaries

Review and report only. Don't edit the code under review or apply a
suggested correction unless a human or the invoking step explicitly
authorizes a separate edit step. Never reject a structural choice only
because a reviewer would have designed it differently: a finding needs a
broken invariant, hidden scope, a weakened test, or an unsolved or
half-done version of the diff's own named problem. Protect secrets and
sensitive material — reference their location; don't reproduce them.

## Failure behavior

- No fixed change range/baseline, or the target keeps moving → stop and
  ask.
- No stated invariants or named structural problem, and neither can be
  derived from the linked Initiative/Bug/TODO, the PR, callers, or tests
  → report a coverage gap and ask what "same behavior" and "the problem
  being solved" meant; don't invent them.
- A suspected regression can't be validated → report it as an open
  question.
- The diff isn't behavior-preserving at all (it's a feature, fix, or
  migration) → say so as the overall verdict; don't review it against
  the equivalence bar as if it should have held.
- A required verification step (test run, build, type-check) can't run →
  report it as not run; don't skip it silently.
- Secrets or sensitive material encountered → reference their location
  only.

## Examples

```
Review this PR: it claims to extract the duplicated discount-calculation
logic from three checkout handlers into one shared function, behavior
unchanged. Base is main.
```

Expected approach: fix the range (PR vs main), take the named problem
(discount logic duplicated across three handlers) and invariants (each
handler's discount output and error behavior for the same inputs),
confirm no handler's discount math changed, compare each handler's output
before and after, read the full test diff for relaxed discount
assertions, check all three call sites now share the one function,
validate any suspected mismatch by running the handler tests, and return
the three groups with a verdict.

When no invariants were stated and must be derived from the code itself,
see
[references/worked-example-no-invariants.md](references/worked-example-no-invariants.md)
for a worked example.
