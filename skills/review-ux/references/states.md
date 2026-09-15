# States

On-demand method for [../SKILL.md](../SKILL.md). Load when specifying or
reviewing states — **before** treating the design as complete. Every
important object, use case, component, and data-driven surface needs this
pass.

## Object and data states (minimum)

Consider, as relevant to this surface:

- first use
- empty
- populated
- loading
- refreshing
- partial data
- success
- error
- validation error
- unavailable
- offline / network failure
- disabled
- read-only
- permission denied
- no results
- filtered to zero results
- processing
- interrupted
- completed
- destructive action pending
- destructive action completed
- stale data
- very large data sets
- minimum data
- unusually long content

## Interaction states (where the control exists)

default, hover, focus, pressed, selected, disabled, dragging, drop
target.

## Read-only is not disabled

Read-only content is still readable and selectable. Disabled is a dead
control: it cannot be used, and the design must say how to unlock it (or
why it is unavailable).

Do not style read-only like disabled (faded, skipped by focus, looking
tappable but doing nothing). Do not style disabled like a primary action
that happens to ignore taps.

## Empty is not one state

Do not ship a generic illustration for every "nothing here."

| Situation | Different next step |
| --- | --- |
| There are no messages yet | First-use: explain + primary create/connect |
| This search has no matches | Change query; keep the query visible |
| The selected filter produces no results | Clear/adjust filters; keep filter context |
| No account is connected | Connect an account |
| Messages could not be loaded | Retry; say what failed |

## For every state, ask

1. What happened?
2. Does the user need to know?
3. What can they do next?
4. Can they recover?
5. Is their work preserved?

If (2) is no, do not invent chrome. If (3)–(5) are no for a state the
user can actually reach, the design is incomplete.

## Work preserved

Retain entered values on validation failure. Warn before discarding
unsaved work. Do not reset selection, scroll, or filters on a routine
refresh unless the use case requires it.
