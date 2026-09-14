---
name: build-feature
description: >-
  Use when there's an approved feature, bugfix, or behavior change to build
  in an existing codebase — a linked Initiative, Bug, TODO, spec, or
  approved plan already states what should happen, and the next step is
  writing the code. Covers
  inspecting the existing implementation before touching it, making the
  smallest change that satisfies the approved behavior, and verifying the
  result. Not for discovery, design, or approval work, and not for
  unscoped refactors, dependency upgrades, or architecture changes.
metadata:
  title: Build a Feature
  tagline: Turn an approved feature or change into a small, verified patch that fits the existing codebase.
  category: engineering
  tags:
    - coding
    - implementation
    - testing
---

## Overview

This skill covers only the implementation step for a feature or change
that's already approved — a linked Initiative, Bug, TODO, spec, or plan
states what should happen. It does not cover deciding what to build; that
happens before this
skill is invoked. Given the approved scope, it produces the smallest patch
that satisfies it, built on the codebase's own existing patterns, and
verified against real checks rather than described from memory.

## When to use

- An approved feature, bugfix, or behavior change exists (a linked
  Initiative, Bug, TODO, spec, or approved plan) and the next step is
  writing the code for it in an
  existing codebase.
- The user asks to "implement X" / "build this" / "make this change" and
  points at scope that's already decided, not still being explored.

Don't use this for open-ended discovery, design, or "what should we build"
conversations — resolve scope first. Don't use it for a full rewrite, an
architecture migration, or a dependency upgrade unless that is explicitly
the approved change.

## Prerequisites

- Read/write access to the target repository and its test/build tooling.
- The approved scope itself: what should change and, ideally, how success
  will be checked. If neither exists, treat that as a blocker (see Failure
  behavior) rather than inferring scope from the codebase alone.

## Inputs

- The approved behavior or change, in enough detail to restate as a
  testable statement.
- Any explicit constraints called out in the approval (must preserve an
  API, must not touch a given area, must ship behind a flag, etc.).
- Pointers to the relevant part of the codebase, if already known;
  otherwise locate it during the procedure.

## Procedure

1. Restate the approved behavior as one or more concrete, testable
   statements, and note anything the scope leaves ambiguous.
2. Inspect the existing implementation, its callers, its tests, and the
   project's own conventions (naming, error handling, state/component
   patterns) before writing anything.
3. Pick the smallest change boundary that satisfies the approved behavior
   using those existing patterns — don't introduce a new pattern where one
   already exists.
4. Add or locate a test that observes the target behavior, then implement
   in small increments, running the relevant checks after each one.
5. Once the approved scope is covered, inspect the complete diff end to
   end and run the project's final-state checks (tests, build, type-check,
   lint — whatever the project documents).

## Output

The code patch, limited to what the approved behavior requires, plus a
short report: what changed, the verification evidence (passed / failed /
not run), and anything left out of scope.

## Verification

Map each piece of the approved behavior to an actual check and run it —
don't report a check as passed without running it. Test through the real
boundary the change is reached through (API, CLI, UI), covering the
ordinary case plus the boundary and failure cases the approved behavior
implies. For UI, stateful, or async/distributed changes, verify the
specific things this change could break (e.g. focus/selection, retries,
ordering) rather than only the happy path.

## Boundaries

Stay tied to the approved behavior — no unrelated cleanup, renames,
dependency upgrades, or architecture changes unless explicitly part of the
approval. Preserve existing public APIs, permissions, data semantics, and
side effects outside the approved scope. Never weaken or delete a test to
make the change pass. This skill doesn't commit, push, or open a pull
request — that's governed by whatever process invoked it. When the
approved scope is ambiguous about something that affects correctness,
architecture, or is hard to reverse, ask rather than assume; for small
reversible choices, state the assumption and proceed.

## Failure behavior

If there's no approved scope, or it doesn't map to any real code path,
stop and report that gap instead of guessing at requirements. If a
required test/build/lint step can't run, report it as "not run" with the
reason rather than skipping it silently. If the approved behavior
conflicts with an existing contract (an API, a permission, a data
guarantee), stop and surface the conflict instead of picking a side.
Always separate passed, failed, and not-run results, and list what's left
outside the delivered scope.

## Examples

```
Implement the approved change: add a `status` filter query param to
GET /api/orders that returns only orders matching the given status.
Acceptance: invalid status returns 400; omitted status returns all
orders (current behavior unchanged).
```

Expected approach: read the existing orders route/controller, its tests,
and how other query params are validated on this endpoint; add the filter
using the same validation/error pattern already used there; add tests for
a valid status, an invalid status (400), and the omitted case (unchanged);
run the route's test suite and report the results.

```
Add a "Duplicate order" action next to the existing "Delete order" action
in the orders list UI, per the approved design. Duplicating should copy
the order's fields except id and createdAt.
```

Expected approach: find the existing Delete action's component/handler as
the pattern to mirror, add Duplicate using the same event/state-update
path, add a test covering the duplicated order's fields and that
id/createdAt differ, run the component/UI test suite, and inspect the diff
before reporting.
