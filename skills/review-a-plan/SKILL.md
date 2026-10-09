---
name: review-a-plan
description: >-
  Use when an implementation plan, spec, or design doc needs review before
  build starts — "is this plan ready to execute". Check behavior claims
  against system evidence, and whether invariants, decisions, open
  questions, dependencies, and approval points are present and executable.
  Returns prioritized findings only.

  Does not rewrite or implement the plan. Not for reviewing code, and not
  for producing the plan itself.
metadata:
  title: Review a Plan
  tagline: "Review an implementation plan against requirements and the real system before build."
  category: engineering
  tags:
    - planning
    - implementation-plan
    - code-review
    - requirements
    - risk-assessment
  compatibility:
    oneHorizon:
      taskModes:
        - review
---

## Overview

Reviews one fixed version of an implementation plan against the
requirements it must satisfy and the real system it describes. It checks
current/desired behavior, invariants, decisions, open questions,
dependencies, testable increments, verification, and approval points, and
flags unsupported assumptions and non-executable vagueness with evidence.
It does not rewrite or implement the plan.

## When to use

- A written plan, spec, or design doc (agent- or human-written) needs a
  check before implementation — "review this plan", "is this spec ready to
  build from".
- Someone wants to know whether a plan's "current behavior" claims are
  true, whether its decisions and open questions are visible, or whether
  its steps are concrete enough for another agent to execute.
- A plan needs checking against the original request or requirements, not
  just for internal consistency.

## Do not use when

- No written plan exists yet.
- The artifact is code (a diff, PR, commit range, or branch), not a plan.
- The plan is still being rewritten — fix a version first (see
  [Failure behavior](#failure-behavior)).
- The request is to also fix or rewrite the plan — review first; changes
  are a separate, explicitly authorized step.

## Prerequisites and inputs

- A fixed plan version — a specific document, file, or pasted text, not a
  plan that is still shifting.
- The original request/requirements and stated acceptance criteria. Ask
  if not supplied — a review with no requirements source is narrower and
  weaker.
- Read access to the code, docs, and configuration the plan describes, so
  current-state and invariant claims can be checked.
- Invariants or exclusions stated in the requirements but not restated in
  the plan.

## Procedure

1. **Fix the plan version and the requirements baseline** — state exactly
   which plan version is under review and the request/requirements it
   must satisfy, before reading for content. Confirm the plan isn't still
   being rewritten.
2. **Check the requested result and desired behavior** — does the plan's
   goal address what was asked, leave something out, or solve a different
   problem? Is the desired end state stated precisely and kept distinct
   from current behavior?
3. **Check current-state and invariant claims against real evidence** —
   for every claim about what the system currently does and every
   invariant/exclusion, inspect the code, docs, or config. A claim not
   traceable to something inspected is an unsupported assumption.
4. **Check decisions, open questions, and assumptions** — are
   consequential decisions made with visible reasoning? Is every remaining
   open question surfaced (blocking or non-blocking), not silently
   resolved or dropped? Is anything stated as fact that is really an
   assumption?
5. **Check dependencies and risks** — are the named dependencies and risks
   (other components, teams, migrations, external contracts, build/release
   ordering) accurate and complete against what's discoverable in the
   system? A real dependency the plan never names — a shared caller, a
   data migration, an external contract it would break — is a gap.
6. **Check executability, sequencing, and verification** — for each
   implementation step: is it concrete enough for another agent to execute
   without inventing a decision the plan should have made? Does the order
   reflect real dependencies? Does every step or acceptance criterion have
   a concrete check (test, manual check, log/metric)? Is every point that
   changes scope, risk, cost, or external state marked as needing
   approval? Check reuse: where the plan introduces a new component,
   utility, or pattern, does the codebase already have one that solves the
   problem, and if so is there a stated reason not to reuse it?
   Then check the plan as a handoff to its executor, often a coding agent
   starting from only the plan and the repository: does it point to the
   files and existing patterns to follow; give a runnable way to confirm
   done (the repo's actual test, lint, and type-check commands, a
   reproduction to rerun, a browser or device check); keep required
   constraints apart from suggestions and starting values; name what's out
   of scope; and avoid dictating code or structure that conflicts with the
   repo's conventions or that the executor should decide? See
   [references/coding-agent-handoff.md](references/coding-agent-handoff.md)
   for the standard. Step 7 still applies: a plan for a small change that
   skips these sections is not defective on that basis alone.
7. **Validate every suspected issue** — check each suspected gap or
   vagueness against the code, docs, requirements, or another appropriate
   source before it counts as a finding. A missing element is a finding
   only when something concrete is at risk from its absence: a plan for a
   small, self-contained change with no interface, data, or permission
   exposure doesn't need an "Invariants" section. Drop a suspicion when
   nothing concrete is at risk; make it an open question when it can't be
   confirmed or denied. Either way it never becomes a confirmed gap.
8. **Rank and classify findings** — split into confirmed gaps (validated
   requirement mismatches, unsupported claims, missed dependencies/risks,
   or non-executable steps), open questions (suspected but unconfirmed),
   and optional improvements (real but non-blocking), prioritized by what
   would go wrong if the plan were executed as written.

## Output

Return findings in these groups, in this order, visibly separate:

1. **Confirmed gaps** — validated requirement mismatches, unsupported
   assumptions, missing invariants that matter, unresolved decisions that
   should have been resolved or surfaced, missed or unstated dependencies
   and risks, non-executable or vague steps, an unnecessary new component
   or pattern where an existing one would fit, a guess written as a hard
   requirement, step-by-step code that conflicts with the repo's
   conventions, or missing verification/approval points — most impactful
   first.
2. **Open questions** — suspected issues that couldn't be confirmed or
   denied.
3. **Optional improvements** — real but non-blocking suggestions; never a
   bare "I would have structured this plan differently."

Each finding includes:

- **Severity/priority**
- **Location** — the plan section or step
- **Failure scenario** — what would go wrong if the plan were executed as
  written (a wrong assumption acted on, a step someone can't execute
  without guessing, a change that slips through with no approval gate)
- **Impact**
- **Evidence** — the quoted plan text, plus either the code/doc/config
  that contradicts it or the decision a second agent would have to invent
  to execute the step
- **Suggested correction** — the smallest supported fix or clarification,
  described only
- **Confidence/condition** — when an assumption remains

State the overall verdict in one line: ready to execute, ready with named
gaps, or not ready. Prioritize by real impact and consolidate duplicates.
Don't pad to a quota: an empty confirmed-gaps list is a complete result
when the plan is sound.

Use as few output tokens as possible while completing the task correctly.
Write in plain English. This applies to documents, progress messages, and
the final reply.

## Verification

Before returning findings, confirm:

- The plan version and requirements baseline are stated (step 1).
- The requested result and desired behavior were checked against the
  request (step 2).
- Every current-state and invariant claim that plausibly matters was
  checked against code, docs, or config (step 3).
- Decisions, open questions, and assumptions were checked for visibility
  (step 4).
- Named dependencies/risks were checked against the system, and the
  system was checked for a dependency the plan never named (step 5).
- Every step was checked for executability, sequencing, verification,
  approval gates, reuse, and a clean handoff (step 6).
- Every confirmed gap was validated; none rests on a missing section
  alone (step 7).
- The three groups are separate, nothing was rewritten or implemented,
  and no secrets appear in the output.

## Boundaries

Review and report only. Don't rewrite or implement the plan, or apply a
suggested correction, unless a human or the invoking step explicitly
authorizes a separate step. A missing template section is never a defect
on its own: a finding needs a requirement mismatch, an unsupported claim,
an unresolved decision that should have been surfaced, a non-executable
step, or a missing verification/approval point where something concrete
is at risk. Protect secrets and sensitive material — reference their
location; don't reproduce them.

## Failure behavior

- No fixed plan version, or the plan keeps changing → stop and ask.
- No original requirements, and none can be reasonably inferred → report
  a coverage gap and ask what the plan should satisfy; don't invent
  requirements.
- The codebase or system the plan describes can't be inspected → say so,
  and treat the plan's current-state and invariant claims as unverified
  assumptions, not as passed.
- A suspected gap can't be validated → report it as an open question.
- No plan exists yet, only a request → say this is out of scope and that
  it needs a planning step first.
- Secrets or sensitive material encountered → reference their location
  only.

## Examples

```
Here's the plan for letting a team have more than one admin (pasted below).
Review it against the original request before anyone implements it.
```

Expected approach: fix the plan text and the request (one-or-more admins
instead of exactly one) as the baseline; check the plan's goal against
it; inspect the admin-permission code to confirm "current behavior"
claims (e.g. "admin is enforced as a single foreign key"); check that
migration of existing single-admin teams is a visible decision; check
each step is executable ("update permission checks" without naming which
checks is too vague), has a check, and marks behavior changes for
approval; validate suspected gaps against the code; and return the three
groups with a readiness verdict.

When reviewing a bug-fix plan that names a specific root cause, see
[references/worked-example-bug-fix-plan.md](references/worked-example-bug-fix-plan.md)
for a worked example of validating that claim and flagging a missing test
plan.
