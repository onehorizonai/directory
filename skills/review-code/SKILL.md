---
name: review-code
description: >-
  Use when reviewing a diff, PR, commit range, or branch for defects,
  regressions, requirement gaps, or risks. Fix the change range and
  baseline, check requirements and integration (callers, state,
  permissions, interfaces, tests, side effects), and validate suspected
  defects before reporting. Returns prioritized findings only; does not
  edit code.

  Not for applying a fix, and not for approving scope or deciding what to
  build.
metadata:
  title: Review Code
  tagline: "Find defects, regressions, and requirement gaps in a code change. Findings only."
  category: engineering
  tags:
    - code-review
    - review
    - defects
    - regressions
    - quality
  compatibility:
    oneHorizon:
      taskModes:
        - review
---

## Overview

Reviews one concrete code change — a diff, PR, commit range, or branch
against a named base — for defects, regressions, requirement gaps, and
important risks. It checks the change against what was asked for and how
it fits the system, validates every suspicion before reporting it, and
returns prioritized findings. It does not edit the code under review.

## When to use

- The user asks to review a diff, pull request, branch, or commit range —
  "review this PR", "review my changes before I merge", "did this diff
  break anything".
- A change needs checking against its requirements or acceptance
  criteria, not just a code-quality pass.
- Someone wants a second look at a change's blast radius — callers, state,
  permissions, interfaces, tests, side effects — before it ships.

## Do not use when

- The request is to also apply a fix — review first; fixing is a
  separate, explicitly authorized step.
- Nothing is written yet and the ask is what to build — that's scoping or
  design.
- The change range or baseline can't be pinned down — resolve that first
  (see Failure behavior).

## Prerequisites and inputs

- A fixed review target and baseline — a diff, PR, commit range, or
  branch against a named base commit/branch. Don't infer it. A target
  that is still moving is a blocker.
- Read access to the repository at that target and baseline and, where
  available, the ability to run its tests/build/lint.
- The requirements, acceptance criteria, linked Initiative/Bug/TODO, or
  spec the change should satisfy. Ask if not supplied — a
  code-quality-only review is a narrower job.
- Known invariants, design/source references, or constraints the change
  must respect.

## Procedure

1. **Fix the target** — state the exact change range and baseline before
   reading any code. Confirm it isn't still moving.
2. **Check requirement coverage** — does the change do what was asked,
   and does it leave anything out? Do this before the code-quality pass.
3. **Check system integration** — callers (anything invoking the changed
   code), state (data/session/persisted invariants), permissions
   (auth/access checks preserved), interfaces (public APIs/contracts
   unchanged unless in scope), tests (coverage added or broken), and side
   effects (anything the change now does or no longer does beyond its
   purpose).
4. **Inspect for defects and regressions** — read the diff for
   correctness bugs, edge cases, and behavior that changed but shouldn't
   have. Apply KISS: flag speculative abstractions, unrelated
   refactoring, and unearned complexity as optional improvements. Check
   reuse: when the diff adds a component, utility, function, or pattern
   the codebase already has an equivalent of, that is a finding even if
   the new code has no bugs.
5. **Validate every suspected issue** — check it against code, docs, a
   reproduction, tests, or another appropriate source before it counts
   as a finding. Drop it if evidence contradicts it; make it an open
   question if it can't be confirmed or denied. Never report an
   unvalidated suspicion as a confirmed defect.
6. **Rank and structure findings** — prioritize by real impact,
   consolidate duplicates, and split into confirmed defects, open
   questions, and optional improvements.

## Output

Return findings in these groups, in this order, visibly separate:

1. **Confirmed defects** — validated issues, most impactful first.
2. **Open questions** — suspected issues that couldn't be confirmed or
   denied.
3. **Optional improvements** — real but non-blocking suggestions.

Each finding includes:

- **Severity/priority**
- **Location** — file/function/line or equivalent
- **Failure scenario** — the input or state that makes it go wrong
- **Impact**
- **Evidence**
- **Suggested correction** — the smallest supported fix or decision,
  described only
- **Confidence/condition** — when an assumption remains

Don't pad to a quota: an empty or short confirmed-defects list is a
complete result when the change is clean.

Use as few output tokens as possible while completing the task correctly.
Write in plain English. This applies to documents, progress messages, and
the final reply.

## Verification

Before returning findings, check:

- The target and baseline are stated.
- Requirement coverage was checked, not just code quality.
- Every confirmed defect was validated.
- Findings are deduplicated, ranked by real impact, and in their three
  separate groups.
- No code was edited.
- No secrets or sensitive material appear in the output.

Pull in a specialist pass (security, accessibility, performance, or other
domain review) only when the change crosses that boundary.

## Boundaries

Review and report only. Don't edit the code under review or apply a
suggested correction unless a human or the invoking step explicitly
authorizes a separate edit step. This skill works standalone; any fix is
a follow-on the caller invokes separately.

## Failure behavior

- No fixed change range/baseline, or the target keeps moving → stop and
  ask.
- No requirements or acceptance criteria, and none can be reasonably
  inferred → report it as a coverage gap; don't invent requirements.
- A suspected defect can't be validated → report it as an open question.
- Secrets or sensitive material encountered → reference their location
  only; don't reproduce them.
- A check can't be run (no test suite access, build won't run) → report
  it as not run; don't skip it silently.

## Examples

```
Review PR #482 (feature/order-status-filter branch vs main) for defects
before merge. Acceptance: invalid status returns 400; omitted status
returns all orders (unchanged).
```

Expected approach: fix the baseline (the branch vs main at the PR's
current head), check the diff against both acceptance criteria and
against the route's callers, tests, and permissions, validate any
suspected issue (read the validation code or run the route's tests), and
return the three groups without editing the PR.

```
Review my last three commits on this branch against main. I don't have a
written spec, just: "add retry logic to the payment webhook handler."
```

Expected approach: fix the range, note the requirement is informal and
check the diff against that intent (retry added, other webhook behavior
preserved), inspect the handler's callers and idempotency/state on retry,
validate any suspected defect (e.g. a duplicate-charge risk) against the
real code path, and name anything that couldn't be checked as a coverage
gap.
