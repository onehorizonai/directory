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

Code review quality tends to drift toward whatever the diff itself shows,
skipping the two things that catch the worst bugs: checking the change
against what was actually asked for, and validating a suspicion before
calling it a defect. This skill is a fixed procedure for reviewing one
concrete code change — a diff, PR, commit range, or branch against a named
base — for defects, regressions, requirement gaps, and important risks. It
checks requirement coverage and system integration (callers, state,
permissions, interfaces, tests, side effects), validates every suspected
issue before it counts as a finding, and returns prioritized, structured
findings. It reviews and reports; it does not edit the code under review.

## When to use

- The user asks to review a diff, pull request, branch, or commit range —
  "review this PR", "review my changes before I merge", "did this diff
  break anything", "check this change for defects or regressions".
- A change needs checking against its original requirements or acceptance
  criteria, not just a general code-quality pass.
- Someone wants a second look at a change's blast radius — callers, state,
  permissions, interfaces, tests, side effects — before it ships.

## Do not use when

- The request is to also apply a fix, not just review — finish the review
  first, then invoke an implementation step (e.g. an "implement/fix" skill)
  as a separate, explicitly authorized action. Don't blend review and
  modification into one pass.
- Nothing has been written yet and the ask is to decide what to build —
  that's scoping/design work, not review.
- The change range or baseline can't be pinned down (see Failure behavior)
  — resolve that first rather than reviewing a moving or undefined target.

## Prerequisites and inputs

- A fixed review target and comparison baseline, not something this skill
  infers — a diff, a specific PR, a commit range, or a branch compared
  against a named base commit/branch. If the target is still moving (e.g.
  a branch being actively pushed to), that's a blocker, not something to
  review anyway.
- Read access to the repository at that target and baseline, and, where
  available, the ability to run its tests/build/lint to validate suspected
  defects.
- The original requirements, acceptance criteria, linked Initiative/Bug/
  TODO, or spec the change is supposed to satisfy. Ask for it if not
  supplied — reviewing only for code quality with no requirement source is
  a materially different, narrower job.
- Any known invariants, design/source references, or constraints the
  change must respect.

## Procedure

1. **Fix the target** — resolve and state the exact change range and
   baseline (diff, PR, commit range, or branch against a named base) before
   reading any code. Confirm it isn't still moving.
2. **Check requirement coverage** — compare the change against its original
   requirements/acceptance criteria/spec: does it do what was asked, and
   does it leave anything out? Treat this as distinct from, and prior to,
   a general code-quality pass.
3. **Check system integration** — inspect how the change fits its
   surroundings: callers (anything invoking the changed code), state
   (data/session/persisted invariants), permissions (auth/access checks
   preserved), interfaces (public APIs/contracts unchanged unless in
   scope), tests (coverage added or broken), and side effects (anything
   the change now does or no longer does beyond its stated purpose).
4. **Inspect for defects and regressions** — read the actual diff for
   correctness bugs, edge cases, and behavior that changed but shouldn't
   have, using the requirement and integration checks above as context.
   Apply KISS: flag speculative abstractions, unrelated refactoring, and
   complexity that isn't earning its keep as optional improvements, not
   just outright bugs.
5. **Validate every suspected issue** — before any suspected issue counts
   as a finding, check it against code, docs, a reproduction, tests, or
   another appropriate source. A suspicion that isn't validated does not
   get reported as a confirmed defect.
6. **Rank and structure findings** — prioritize by real impact, consolidate
   duplicates, and split into confirmed defects, open questions, and
   optional improvements before returning them.

Step 5 is the step most likely to get skipped under time pressure — a
suspected issue is not allowed to go straight from "noticed" to "reported"
without passing through validation. A suspected issue that fails
validation is either dropped (contradicted by evidence) or downgraded to
an open question (cannot confirm or deny with available evidence) — it
never becomes a confirmed defect either way.

## Output

Return findings grouped in this order, each group visibly separate:

1. **Confirmed defects** — validated issues, most-impactful first.
2. **Open questions** — suspected issues that couldn't be confirmed or
   denied with available evidence.
3. **Optional improvements** — real but non-blocking suggestions.

Each finding includes:

- **Severity/priority**
- **Location** — precise: file/function/line or equivalent
- **Failure scenario** — concrete: what input or state causes it to go
  wrong
- **Impact**
- **Evidence**
- **Suggested correction** — the smallest supported fix or decision,
  described only; this skill does not apply it
- **Confidence/condition** — when an assumption remains

Findings are prioritized by real impact, duplicates are consolidated, and
this skill does not manufacture a quota of findings — an empty or short
confirmed-defects list is a valid, complete result when the change is
clean. Write each finding in plain, concrete English — the shortest
phrasing that still tells the reader what they need to act.

## Verification

Before handing back findings, check:

- The target and baseline were fixed and stated, not left implicit.
- Requirement coverage was checked, not just code quality.
- Every confirmed defect was validated against code, docs, tests, or a
  reproduction — not left as an unvalidated suspicion.
- Findings are deduplicated and ranked by real impact, not padded to a
  quota.
- Confirmed defects, open questions, and optional improvements stayed in
  separate groups.
- No code was edited during the review.
- No secrets or sensitive material encountered during review were
  reproduced in the output.

Pull in a specialist pass (security, accessibility, performance, or other
domain-specific review) selectively when the change crosses that boundary,
rather than folding it into this general procedure by default.

## Boundaries

This skill reviews and reports; it does not edit the code under review and
does not apply any of its own suggested corrections, unless a human or the
invoking step explicitly authorizes a separate edit step. The natural next
step — an implementation/fix skill — is a follow-on the caller can invoke
separately, not a hard dependency; this skill works standalone. Keep review
and modification separate unless both are explicitly requested together.

## Failure behavior

- No fixed change range/baseline, or the target keeps moving → stop and
  ask rather than reviewing a moving target.
- No original requirements/acceptance criteria available and none can be
  reasonably inferred → say so as a coverage gap rather than inventing
  requirements to review against.
- A suspected defect can't be validated with available evidence or tools
  → report it as an open question, not a confirmed defect.
- Secrets or sensitive material are encountered while reviewing → don't
  reproduce them in the findings output; reference their location only.
- A check the procedure calls for can't be run (e.g. no test suite access,
  can't run the build) → state it as an unperformed/not-run check rather
  than skipping it silently.

## Examples

```
Review PR #482 (feature/order-status-filter branch vs main) for defects
before merge. Acceptance: invalid status returns 400; omitted status
returns all orders (unchanged).
```

Expected approach: fix the baseline (feature/order-status-filter vs main
at the PR's current head), check the diff against the stated acceptance
criteria (invalid-status handling, omitted-status behavior), check
integration with the route's existing callers/tests/permissions, validate
any suspected issue (e.g. by reading the validation code or running the
route's tests) before reporting it, and return confirmed defects, open
questions, and optional improvements as separate groups — without editing
the PR.

```
Review my last three commits on this branch against main. I don't have a
written spec, just: "add retry logic to the payment webhook handler."
```

Expected approach: fix the range (last three commits vs main), note the
requirement is informal and check the diff against that stated intent
(retry logic added, existing webhook behavior otherwise preserved), inspect
integration (callers of the handler, idempotency/state on retry,
error/side-effect behavior), validate any suspected defect (e.g. a
duplicate-charge risk) against the actual code path before reporting it,
and flag anything that can't be checked (e.g. no test suite access) as a
named coverage gap rather than skipping it silently.
