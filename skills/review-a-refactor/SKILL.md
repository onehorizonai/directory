---
name: review-a-refactor
description: >-
  Use when a change under review is claimed to be a behavior-preserving
  refactor — a diff, PR, commit range, or branch against a named base — and
  the job is to check whether it actually is one. Checks behavioral
  equivalence (public interfaces, state, side effects, permissions, async
  ordering), catches hidden scope expansion (a feature, bug fix, or
  migration smuggled in under refactor cover), inspects test diffs for
  weakened coverage, and judges structural correctness against the named
  problem. Returns prioritized findings only; does not edit the code, and
  is not for reviewing a change that was never claimed to be
  behavior-preserving or for performing the refactor itself.
metadata:
  title: Review a Refactor
  tagline: Check a claimed behavior-preserving refactor for hidden behavior changes, scope creep, and weakened tests.
  category: engineering
  tags:
    - refactoring
    - code-review
    - regressions
    - testing
---

## Overview

A refactor is judged by a stricter bar than a normal change: nothing
observable is supposed to be different. That bar is easy to violate quietly
— a "just a rename" diff that also changes a return value, a "just an
extraction" that drops an error path, a "cleanup" that fixes a bug or adds a
capability along the way, or a test that was loosened just enough to let a
real behavior change through green. This skill is a procedure for reviewing
one concrete change that's been claimed as behavior-preserving: fix the
change range and the invariants/baseline it's supposed to preserve, check
behavioral equivalence against them, check the diff didn't grow into
approved-behavior work while looking structural, inspect the test diff for
weakened coverage, and judge whether the named structural problem was
actually solved — all without demanding a different architecture as a
matter of taste. It reviews and reports; it does not edit the code or
perform the refactor itself.

## When to use

- A diff, PR, commit range, or branch is presented as a refactor —
  "behavior-preserving," "just cleanup," "no functional change," "internal
  only" — and needs checking against that claim before merge.
- Someone wants to know whether a "simple rename/extraction/reorg" quietly
  changed what the system does, drops state, or weakens a permission check.
- A refactor's test diff needs scrutiny for deleted cases, relaxed
  assertions, or altered snapshots/mocks/fixtures that could be hiding a
  behavior change behind a passing suite.
- A change claims to solve a specific structural problem and it's unclear
  whether it actually solved it, left the problem half-done, or expanded
  into adjacent restructuring beyond what was named.

## Do not use when

- The change was never claimed to be behavior-preserving, or its purpose is
  a feature, bug fix, or migration — reviewing it under this skill's
  equivalence bar would reject the very behavior change it was supposed to
  make; review it for defects and requirement coverage generally instead.
- The request is to perform or continue the refactor, not review one
  that's already written.
- The change range or the invariants/baseline it's meant to preserve can't
  be pinned down (see [Failure behavior](#failure-behavior)) — resolve that
  first rather than reviewing a moving target or guessing at what "same
  behavior" was supposed to mean.
- The request is to also apply a fix for something this review finds —
  finish the review first, then invoke an implementation or refactor step as
  a separate, explicitly authorized action.

## Prerequisites and inputs

- A fixed review target and comparison baseline: a diff, a specific PR, a
  commit range, or a branch compared against a named base commit/branch.
  If the target is still moving (e.g. a branch being actively pushed to),
  that's a blocker, not something to review anyway.
- Read access to the repository at that target and baseline, and, where
  available, the ability to run its tests/build/lint to validate suspected
  findings.
- The named structural problem the refactor is supposed to solve, and any
  stated invariants — public interfaces, values/errors, side effects,
  ordering, persisted state, permissions, timing guarantees, and external
  contracts that are supposed to stay exactly the same. If these weren't
  supplied explicitly, derive them from the PR description, the linked
  Initiative/Bug/TODO, the code's existing callers and tests, and its
  current behavior — never invent an invariant that isn't traceable to one
  of those sources.
- Any explicit exclusions — code or behavior stated as out of scope for
  this change.

## Procedure

1. **Fix the target and baseline** — resolve and state the exact change
   range (diff, PR, commit range, or branch against a named base) and
   confirm it isn't still moving, before reading any code.
2. **Fix the stated invariants** — collect the named structural problem and
   the invariants the change claims to preserve; where none were supplied,
   derive them from the linked Initiative/Bug/TODO, the PR description,
   callers, and existing tests.
   Treat a change with no derivable invariants and no stated problem as a
   scope gap (see [Failure behavior](#failure-behavior)), not license to
   review against assumptions no one stated.
3. **Check scope purity** — read the diff for anything that isn't a
   structural move: a new capability, a changed return value or error
   behavior, a bug fix, a dependency/framework migration, or a performance
   change riding along with the restructuring. Each of these is
   approved-behavior work hiding under refactor cover, regardless of how
   small it looks, unless it was explicitly named as in-scope alongside the
   refactor.
4. **Check behavioral equivalence** — for each invariant from step 2, check
   whether the diff actually preserves it: altered public
   interfaces/signatures/routes, lost or reshaped state, changed or missing
   side effects, permission/access-check changes, and async ordering
   changes (a step that used to happen before another now happens after,
   or a race that didn't exist before now does). Read the code, not just
   the description of what it's supposed to do.
5. **Inspect the test diff for weakened coverage** — read every changed or
   deleted test in full. Look for deleted cases, relaxed assertions,
   changed snapshots, and altered mocks/fixtures that could let a real
   behavior change pass unnoticed. A test change that only follows a
   rename/move (same case, same assertion, updated reference) is not a
   weakening; a test change that reduces what's actually being checked is.
6. **Judge structural correctness against the named problem** — check
   whether the problem from step 2 was actually resolved: the old and new
   code paths aren't both still live, duplicate logic wasn't left at other
   call sites, no dead code was left behind, and an extracted abstraction
   has a real payoff (more than one caller, or a boundary it actually
   clarifies) rather than adding indirection for its own sake. A
   preference for a different pattern, more abstraction, or a different
   file layout is not a finding here — only a case where the diff's own
   stated problem is unsolved, half-done, or made worse counts.
7. **Validate every suspected issue** — before any suspected issue counts
   as a finding, check it against code, tests, a reproduction, or another
   appropriate source. A suspicion that isn't validated does not get
   reported as a confirmed regression.
8. **Rank and classify findings** — split into confirmed regressions
   (equivalence, scope, or structural-correctness violations), open
   questions (suspected but unconfirmed), and optional improvements
   (non-blocking, and never a bare architecture preference), prioritized by
   real impact with duplicates consolidated.

Step 3 is where the review has to draw a line the diff itself won't draw for
you — the same hunk can look like a harmless structural move or like
approved-behavior work in disguise, and only checking it against the stated
invariants and named problem tells the two apart. A hunk that reads as a
plain structural move still gets judged for correctness in step 6; a hunk
that reads as a behavior change or hidden scope goes through the same
validation discipline (step 7) as any other suspected defect before it's
reported.

## Output

Return findings grouped in this order, each group visibly separate:

1. **Confirmed regressions** — validated equivalence, scope-purity, or
   structural-correctness violations, most-impactful first.
2. **Open questions** — suspected issues that couldn't be confirmed or
   denied with available evidence.
3. **Optional improvements** — real but non-blocking suggestions; never a
   bare "I would have structured this differently."

Each finding includes:

- **Severity/priority**
- **Location** — precise: file/function/line or equivalent
- **Failure scenario** — concrete: what input, state, caller, or timing
  exposes it
- **Impact**
- **Evidence** — the specific diff line, test, or behavior observed
- **Suggested correction** — the smallest supported fix or decision,
  described only; this skill does not apply it
- **Confidence/condition** — when an assumption remains

Alongside the findings, state the overall verdict in one line: whether the
change held to its behavior-preserving claim, partially held it (with the
violations named), or wasn't actually a refactor (scope expanded into
approved-behavior work). Findings are prioritized by real impact,
duplicates are consolidated, and this skill does not manufacture a quota —
an empty confirmed-regressions list is a valid, complete result when the
change is clean.

## Verification

Before handing back findings, confirm: the target and baseline were fixed
and stated (step 1); invariants were stated or explicitly derived, not
invented (step 2); every hunk was placed as a structural move or flagged as
possible hidden behavior/scope (step 3); behavioral equivalence was checked
against every stated invariant class that plausibly applies — state, side
effects, permissions, async ordering, not just the return value (step 4);
every changed or deleted test was read in full for weakened coverage, not
just a passing run (step 5); structural correctness was judged against the
diff's own named problem, with no finding resting on "a different
architecture would be nicer" alone (step 6); every confirmed regression was
validated (step 7); the three output groups stayed separate; nothing was
edited; no secrets were reproduced in the output.

## Boundaries

This skill reviews and reports; it does not edit the code under review and
does not apply any of its own suggested corrections, unless a human or the
invoking step explicitly authorizes a separate edit step. It never rejects a
structural choice solely because a reviewer would have designed it
differently — a finding requires a broken invariant, hidden scope, a
weakened test, or an unsolved/half-done version of the diff's own named
problem. Keep review and modification separate unless both are explicitly
requested together. Protect secrets and sensitive material encountered while
reviewing — reference their location rather than reproducing them in
findings.

## Failure behavior

- No fixed change range/baseline, or the target keeps moving → stop and ask
  rather than reviewing a moving target.
- No stated invariants or named structural problem, and neither can be
  reasonably derived from the linked Initiative/Bug/TODO, the PR, callers,
  or tests → report it as a
  coverage gap and ask what "same behavior" and "the problem being solved"
  were supposed to mean, rather than inventing them.
- A suspected regression can't be validated with available evidence or
  tools → report it as an open question, not a confirmed regression.
- The diff turns out not to be behavior-preserving at all (it's really a
  feature, fix, or migration) → say so as the overall verdict rather than
  reviewing it under this skill's equivalence bar as if it should have held.
- A required verification step (test run, build, type-check) can't be run →
  state it as an unperformed/not-run check rather than skipping it silently.
- Secrets or sensitive material are encountered while reviewing → don't
  reproduce them in the findings output; reference their location only.

## Examples

```
Review this PR: it claims to extract the duplicated discount-calculation
logic from three checkout handlers into one shared function, behavior
unchanged. Base is main.
```

Expected approach: fix the range (PR vs main), pull the named problem
(duplicated discount logic across three handlers) and invariants (each
handler's current discount output and error behavior for the same inputs),
check scope purity (confirm no handler's actual discount math changed),
check equivalence by comparing each handler's output before/after for the
same inputs, read the full test diff for any relaxed discount assertions,
judge whether all three call sites now genuinely share the one function
(not two still duplicated and one migrated), validate any suspected mismatch
by running the handler tests, and report confirmed regressions, open
questions, and optional improvements separately with an overall verdict.

When no invariants were stated and must be derived from the code itself,
see
[references/worked-example-no-invariants.md](references/worked-example-no-invariants.md)
for a worked example.
