# Per-step review checklist

Extra sub-checks behind Procedure steps 3, 4, 5, and 7, beyond what's
already stated inline in SKILL.md. Steps 3 and 7 below just itemize the
inline prose — nothing new. Steps 4 and 5 add two checks not restated
inline: grouping things with consistent terminology, and letting a user
recognize relevant context in place rather than needing to remember it.
Load this file when one of those two specific checks is in question;
skip it otherwise — the inline steps are a complete, self-contained
review pass on their own.

## Step 3 — walk each prioritized use case

For entry/orientation:

- Is there a clear entry point with sufficient context?
- Is the object and its current state understandable?
- Do the available actions match that state and the actor's permissions?
- Is the information needed for a decision available near that decision?
- Is the result and resulting state understandable on completion?

## Step 4 — check hierarchy against priority

- Does prominence, placement, and grouping reflect actual use-case
  priority and frequency, not just build convenience?
- Are related things grouped with consistent terminology?
- Do secondary or rare actions use progressive disclosure instead of
  competing permanently with primary work?

## Step 5 — check consequence, recovery, and continuity

- Are consequences and reversibility of actions clear?
- Do happy, empty, loading, error, permission, interrupted, and recovery
  paths make sense?
- Does context or state survive navigation or interruption where the use
  case needs it to?
- Do 0/1/some/many cases stay usable?
- Can a user recognize relevant context in place rather than needing to
  remember it from elsewhere?

## Step 7 — check structural clarity

- A few strong shared alignment axes versus unnecessary vertical seams,
  nested insets, extra containers, or dividers that add complexity without
  communicating a relationship.
- Vertical rhythm — whether typography, line height, control sizing, and
  section spacing form a coherent, related scale.

Judge every one of these only by whether it supports hierarchy, grouping,
scanning, or consistency; never flag it for failing to match pixel-exact
sameness or a reviewer's own visual taste.
