# Handing a plan to a coding agent

The plan is usually executed by someone who starts with only the plan and
the repository — a coding agent such as Codex, Claude Code, or Cursor, or
a person picking it up cold. Write it like a well-scoped engineering
issue: a clear goal, the context that matters, the constraints, and what
"done" looks like. Give direction, not a line-by-line recipe.

Work these qualities into the skill's own Output sections; don't add
extra headings alongside them.

## Scale it to the work

A small change gets a short plan: the goal, where to look, what done looks
like, and the checks to run. Add a section only when it changes what the
executor will do. Drop any section that would only say "none" or repeat
another one.

## What to include

- **Goal and why.** Lead with the user-visible outcome and the reason it's
  needed, in a sentence or two.
- **Where to look first.** Name the files, components, design tokens,
  tests, and the existing pattern to follow ("export it the same way
  `ReportExport` streams rows"). State that the target repo's own
  conventions, agent/contributor guidance (`AGENTS.md`, `CONTRIBUTING`),
  and existing dependencies win over anything in the plan that conflicts
  with them.
- **Constraints that apply.** Only the ones that matter for this change:
  technical (public interfaces, data shape, supported environments), UX,
  accessibility, security, performance. Make each one checkable.
- **Required vs. suggested.** Mark which constraints are required and
  which values are suggestions or starting values the executor may tune.
  A guess written as a hard requirement gets implemented as one.
- **Behavior, not code.** Describe what must be true. Add a concrete
  example (an input and its output, a state change) where words alone are
  ambiguous. Don't write the implementation, name private helpers, or
  settle structure the repo's conventions already settle. The exception is
  when the location is the point: a bug fix names the exact place the
  cause lives, and a refactor names exactly what moves where.
- **Lifecycle and edge cases, when relevant.** Setup and cleanup
  (listeners, timers, subscriptions, animation frames), loading, empty,
  error, and permission states, interruption and retry, concurrency, and
  the 0 / 1 / many and very-large cases. List the ones that apply; skip
  the rest.
- **Done when.** Acceptance criteria as observable results, each paired
  with how to check it.
- **Validation.** The repo's actual commands for tests, lint, type checks,
  and build, found in package scripts, the Makefile, CI config, or
  `AGENTS.md` — not "run the tests". For UI, say what to check in a
  browser or on a device. For a bug, rerun the original reproduction.
- **Focused tests.** Ask for tests that assert behavior through a public
  entry point. Avoid tests that pin private structure, call counts, or
  whole-tree snapshots; they break on harmless changes.
- **Scope.** Name what's out of scope. Ask for a focused change: no
  unrelated refactors, renames, formatting sweeps, or dependency bumps.
  Anything adjacent goes on a follow-up list.
- **Report back.** Ask the executor to finish with a short summary: what
  changed, which validation ran and its result, and any trade-offs or
  departures from the plan.

## Avoid

- Pasting the code the executor should write, or steps that narrate edits
  file by file.
- Generic rules that apply to every change ("write clean code", "follow
  best practices").
- Every section filled in for a one-file change.

## Example

An illustrative handoff for a UI change with performance and accessibility
constraints:

```
Goal: Add an animated particle background to the homepage hero so the
page feels alive, without slowing the page down.

Look first: the hero component, the existing reduced-motion hook, and the
color tokens. Follow the repo's existing component patterns. Don't add an
animation library.

Required: static frame when prefers-reduced-motion is set; pauses when
the hero is off-screen or the tab is hidden; cancels the frame loop and
removes listeners on unmount; no layout shift; hero text contrast is
unchanged; colors come from tokens.
Starting values: about 40 particles at 30% opacity. Tune by eye.

Done when: the hero animates smoothly, stays static with reduced motion
on, and the frame loop stops when scrolled away (check the browser's
performance panel). `npm run lint`, `npm run typecheck`, and `npm test`
pass.

Out of scope: other homepage sections and the hero copy.

Report back: what changed, checks run, trade-offs.
```
