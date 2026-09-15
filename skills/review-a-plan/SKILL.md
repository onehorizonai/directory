---
name: review-a-plan
description: >-
  Use when a fixed implementation plan, spec, or design doc — written by an
  agent or a human — needs review before implementation starts: "review
  this plan", "is this spec ready to build from", "check this
  implementation plan for gaps before we execute it". Checks the plan's
  current/desired behavior claims against real system evidence, and
  whether its invariants, decisions, open questions, dependencies, and
  approval points are present, traceable, and executable. Returns
  prioritized findings only; does not rewrite or implement the plan, and is
  not for reviewing code (a diff, PR, or branch) or for producing the plan
  itself.
metadata:
  title: Review a Plan
  tagline: Check a fixed implementation plan against original requirements and system evidence before anyone builds from it.
  category: engineering
  tags:
    - planning
    - implementation-plan
    - code-review
    - requirements
    - risk-assessment
---

## Overview

A plan is cheapest to fix before anyone builds from it, but only if the
review actually checks the things that make a plan executable: that its
claims about current behavior are true, that its decisions and open
questions are visible rather than smoothed over, and that its steps are
concrete enough for someone else to execute without rejoining the original
conversation. This skill is a procedure for reviewing one fixed version of
an implementation plan against the requirements it's supposed to satisfy and
the real system it describes — checking current/desired behavior,
invariants, decisions, open questions, dependencies, testable increments,
verification, and approval points — and flagging unsupported assumptions and
non-executable vagueness with evidence. It reviews and reports; it does not
rewrite or implement the plan.

## When to use

- A written plan, spec, or design doc exists — agent- or human-written —
  and needs a check before implementation starts: "review this plan", "is
  this spec ready to build from", "check this implementation plan before
  we execute it".
- Someone wants to know whether a plan's "current behavior" claims are
  actually true, whether its decisions and open questions are visible, or
  whether its steps are concrete enough for another agent to execute.
- A plan needs checking against the original request or requirements it was
  supposed to satisfy, not just read for internal consistency.

## Do not use when

- No written plan exists yet — producing one is a different job than
  reviewing something that hasn't been written.
- The artifact under review is code (a diff, PR, commit range, or branch),
  not a plan.
- The plan is still being actively rewritten while under review — fix a
  version first (see [Failure behavior](#failure-behavior)) rather than
  reviewing a moving target.
- The request is to also fix or rewrite the plan, not just review it —
  finish the review first, then apply changes only as a separate,
  explicitly authorized step.

## Prerequisites and inputs

- A fixed plan version to review — a specific document, file, or pasted
  text, not "the plan we're discussing" if it's still shifting.
- The original request/requirements and any stated acceptance criteria the
  plan is supposed to satisfy. Ask for it if not supplied — reviewing a
  plan with no requirements source is a materially narrower, weaker job.
- Read access to the relevant code, docs, and configuration the plan
  describes, so current-state and invariant claims can be checked against
  reality rather than taken on faith.
- Any invariants or exclusions stated in the requirements but not restated
  in the plan.

## Procedure

1. **Fix the plan version and the requirements baseline** — resolve and
   state exactly which version of the plan is under review and the original
   request/requirements it must satisfy, before reading it for content.
   Confirm the plan isn't still being actively rewritten.
2. **Check the requested result and desired behavior** — compare the
   plan's stated goal against the original request: does it address what
   was actually asked for, leave something out, or solve a different
   problem than the one requested? Check that the desired end state is
   stated precisely and kept distinct from current behavior, not blurred
   into one narrative.
3. **Check current-state and invariant claims against real evidence** —
   for every claim the plan makes about what the system currently does, and
   every invariant/exclusion it states, inspect the actual code, docs, or
   config. A claim that isn't traceable to something inspected is an
   unsupported assumption, not a confirmed fact.
4. **Check decisions, open questions, and assumptions** — are consequential
   decisions made with visible reasoning; is every open question that
   remains actually surfaced (as blocking or non-blocking) rather than
   silently resolved or silently dropped; is anything stated as fact that's
   really an unstated assumption?
5. **Check dependencies and risks** — are the plan's named dependencies and
   risks (other components, teams, migrations, external contracts,
   build/release ordering) accurate and complete against what's
   discoverable in the system, not just restated from the request? A real
   dependency the plan never names — a shared caller, a data migration, an
   external contract it would break — is a gap, not a nice-to-have.
6. **Check executability, sequencing, and verification** — for each
   implementation step: is it concrete enough for another agent to execute
   without inventing a decision the plan should have made; does the
   sequence reflect real dependencies rather than arbitrary order; does
   every step or acceptance criterion have a mapped, concrete way to check
   it (test, manual check, log/metric); is every point that changes scope,
   risk, cost, or external state marked as needing approval rather than
   folded silently into "implementation"?
7. **Validate every suspected issue** — before any suspected gap or
   vagueness counts as a finding, check it against the code, docs, the
   requirements, or another appropriate source. A missing element is only a
   finding when something concrete is actually at risk from its absence —
   a plan for a small, self-contained change with no interface, data, or
   permission exposure does not need an "Invariants" section to be
   complete, and demanding one anyway is not a finding.
8. **Rank and classify findings** — split into confirmed gaps (validated
   requirement mismatches, unsupported claims, missed dependencies/risks, or
   non-executable steps), open questions (suspected but unconfirmed), and
   optional improvements (real but non-blocking), prioritized by what would
   actually go wrong if the plan were executed as written.

Step 7 is where the review has to resist turning a template into a
checklist — a missing section is not automatically a defect. A suspected
weakness that fails validation is either dropped (nothing concrete was
actually at risk) or downgraded to an open question (cannot confirm or
deny with available evidence) — it never becomes a confirmed gap either
way.

## Output

Return findings grouped in this order, each group visibly separate:

1. **Confirmed gaps** — validated requirement mismatches, unsupported
   assumptions, missing invariants that matter, unresolved decisions that
   should have been resolved or surfaced, missed or unstated dependencies
   and risks, non-executable or vague steps, or missing
   verification/approval points — most-impactful first.
2. **Open questions** — suspected issues that couldn't be confirmed or
   denied with available evidence.
3. **Optional improvements** — real but non-blocking suggestions; never a
   bare "I would have structured this plan differently."

Each finding includes:

- **Severity/priority**
- **Location** — the specific plan section or step
- **Failure scenario** — concretely, what would go wrong if this plan were
  executed as written (a wrong assumption acted on, a step someone can't
  execute without guessing, a change that slips through with no approval
  gate)
- **Impact**
- **Evidence** — the quoted plan text, plus either the code/doc/config that
  contradicts it or the specific decision a second agent would have to
  invent to execute the step
- **Suggested correction** — the smallest supported fix or clarification,
  described only; this skill does not apply it
- **Confidence/condition** — when an assumption remains

Alongside the findings, state the overall verdict in one line: ready to
execute, ready with named gaps, or not ready. Findings are prioritized by
real impact, duplicates are consolidated, and this skill does not
manufacture a quota — an empty confirmed-gaps list is a valid, complete
result when the plan is sound.

## Verification

Before handing back findings, confirm: the plan version and requirements
baseline were fixed and stated (step 1); the requested result and desired
behavior were checked against the original request, kept distinct from
current behavior (step 2); every current-state and invariant claim that
plausibly matters was checked against actual code, docs, or config, not
taken on faith (step 3); decisions, open questions, and assumptions were
checked for visibility (step 4); named dependencies/risks were checked
against the system, and the system was checked for a real dependency the
plan never named (step 5); every step was checked for executability, real
sequencing, mapped verification, and approval gates (step 6); every
confirmed gap was validated, with no finding resting on a missing section
alone (step 7); the three output groups stayed separate; nothing was
rewritten or implemented; no secrets were reproduced in the output.

## Boundaries

This skill reviews and reports; it does not rewrite the plan and does not
implement any part of it, and does not apply any of its own suggested
corrections, unless a human or the invoking step explicitly authorizes a
separate step. It never treats a missing template section as a defect on
its own — a finding requires a requirement mismatch, an unsupported claim,
an unresolved decision that should have been surfaced, a non-executable
step, or a missing verification/approval point where something concrete is
actually at risk. Keep review and modification separate unless both are
explicitly requested together. Protect secrets and sensitive material
encountered while reviewing — reference their location rather than
reproducing them in findings.

## Failure behavior

- No fixed plan version, or the plan keeps changing while under review →
  stop and ask rather than reviewing a moving target.
- No original requirements available and none can be reasonably inferred →
  report it as a coverage gap and ask what the plan was supposed to satisfy,
  rather than inventing requirements to review against.
- The codebase or system the plan describes can't be inspected → say so,
  and treat the plan's current-state and invariant claims as unverified
  assumptions rather than confirmed facts, not as silently passed.
- A suspected gap can't be validated with available evidence → report it as
  an open question, not a confirmed gap.
- No plan actually exists yet, only a request → say this is out of scope
  and point to the appropriate planning skill instead of reviewing nothing.
- Secrets or sensitive material are encountered while reviewing → don't
  reproduce them in the findings output; reference their location only.

## Examples

```
Here's the plan for letting a team have more than one admin (pasted below).
Review it against the original request before anyone implements it.
```

Expected approach: fix the plan text and the original request (teams should
support one-or-more admins instead of exactly one) as the baseline; check
the plan's stated goal against that request; inspect the actual
admin-permission code to confirm its "current behavior" claims (e.g. "admin
is enforced as a single foreign key") are accurate; check that the
migration path for existing single-admin teams is a visible decision, not
an unstated assumption; check each implementation step is concrete enough
to execute (e.g. "update permission checks" without naming which checks is
too vague) and has a mapped verification; check any behavior-changing step
is marked for approval; validate any suspected gap against the code before
reporting it; and return confirmed gaps, open questions, and optional
improvements with an overall readiness verdict.

When reviewing a bug-fix plan that names a specific root cause, see
[references/worked-example-bug-fix-plan.md](references/worked-example-bug-fix-plan.md)
for a worked example of validating that claim and flagging a missing test
plan.
