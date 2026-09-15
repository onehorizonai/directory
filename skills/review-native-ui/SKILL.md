---
name: review-native-ui
description: >-
  Use when a native interface that already exists — a built screen, flow, or
  release candidate in an iOS, Android, desktop, or other native app — needs
  to be reviewed for platform-convention, state/lifecycle, accessibility,
  layout, and interaction defects. Covers fixing the exact
  app/platform/version under review, inspecting the real running interface
  (not just code), checking navigation/control conventions, state
  ownership/lifetime, interruption/restoration, permissions, adaptive
  layout, text scaling/localization, input methods, and actual
  accessibility-tree/assistive-technology behavior, and separating
  confirmed defects from subjective cross-platform visual preferences.
  Returns prioritized findings only; does not edit the interface. Not for
  implementing or fixing a native UI change (use an implementation skill for
  that), not for web/browser-only UI, and not for deciding or approving a
  new design from scratch.
metadata:
  title: Review Native UI
  tagline: Review a real native interface for platform-convention, state, accessibility, and layout defects without editing it.
  category: engineering
  tags:
    - native
    - review
    - accessibility
    - ios
    - android
    - desktop
    - ui
    - defects
---

## Overview

Native UI review drifts toward opinions about visual style unless it's
anchored to something checkable: the platform's own interaction
conventions, the app's actual state/lifecycle behavior, and the real
accessibility tree — not a code read-through or a screenshot. This skill is
a fixed procedure for reviewing one concrete native interface — a built
screen, flow, or release candidate on a named app/platform/version — for
platform-convention violations, state/lifecycle defects, accessibility
gaps, layout problems, and interaction issues. It inspects the real running
interface wherever possible, checks it against current official platform
guidance and the app's existing patterns, validates every suspected issue
before it counts as a finding, and separates confirmed defects from
subjective cross-platform visual preferences. It reviews and reports; it
does not edit the interface under review.

## When to use

- The user asks to review a native screen, flow, or build — "review this
  iOS screen before release", "check this Android flow for accessibility
  issues", "does this desktop dialog follow platform conventions", "audit
  this native interface for lifecycle bugs".
- A built native interface needs checking against platform HIG/Material/
  Windows conventions, the app's own established patterns, or its
  state/lifecycle and accessibility behavior — not just a general visual
  pass.
- Someone wants a second look at how an interface handles interruption,
  restoration, permissions, adaptive layout, or assistive technology before
  it ships.

## Do not use when

- The request is to also fix what's found — finish the review first, then
  invoke a native implementation skill as a separate, explicitly
  authorized step. Don't blend review and modification into one pass.
- Nothing has been built yet and the ask is to decide or approve a new
  design — that's design/product work, not review of an existing interface.
- The UI is web or browser-only with no native shell to inspect.
- The ask is only pass/fail against stated acceptance criteria with no
  native platform-convention, state/lifecycle, or accessibility-tree
  dimension in scope, or is a general source-diff/code-quality review with
  no request to inspect the running interface itself.

## Prerequisites and inputs

- A fixed review target, not something this skill infers: the app, target
  platform (iOS, Android, desktop, or other), minimum OS and UI
  framework/library version, and the specific screen/flow/build under
  review.
- Any original requirements, design/mock reference, or acceptance criteria
  the interface should satisfy, plus known invariants (must preserve an
  existing permission contract, must match an established pattern
  elsewhere in the app).
- Access to the real interface — a simulator/emulator at minimum, a
  physical device where risk warrants it — and, where available, the
  app's source for inspecting architecture and existing patterns.
- Access to the platform's assistive technology (VoiceOver, TalkBack, UI
  Automation, or equivalent) for the accessibility checks; if unavailable,
  that's a named coverage gap, not a reason to skip the review.

## Procedure

1. **Fix the target** — resolve and state the exact app, platform, minimum
   OS, UI framework/library version, and the specific screen/flow/build
   under review before inspecting anything. Confirm it isn't still moving.
2. **Inspect architecture and the real interface** — read the existing
   native architecture (navigation pattern, state-management approach,
   existing accessibility/localization patterns) for context, then inspect
   the actual running interface on a simulator/emulator or device. Don't
   review from code or screenshots alone when the real interface is
   reachable.
3. **Review object/action/concept priority** — identify the interface's
   primary objects, actions, and workflows/concepts and the relative
   priority they should carry, before checking convention-by-convention.
   Check whether navigation, placement, size, grouping, and progressive
   disclosure actually communicate that priority — this is more important
   than surface-styling review, not a subset of it.
4. **Review platform conventions and semantic color** — navigation,
   controls, gestures, menus, dialogs, typography, and spacing against
   current official platform guidance (Apple HIG, Google Material/Android,
   Microsoft Windows), not memory. A deviation with no documented product/
   usability reason is a finding; matching or differing from another
   platform's look is never itself a justification or a defect (step 7).
   Check color used for state/hierarchy/selection/actions for semantic
   consistency, as a distinct check from accessibility contrast (step 6).
5. **Review state ownership/lifetime and interruption/restoration** — what
   survives navigation, backgrounding, rotation/resizing, recreation, and
   relaunch; behavior through connectivity loss, authorization
   expiry/denial, cancellation/retry, and return-to-app. Flag duplicate
   requests or false success on uncertain outcomes.
6. **Review permissions, adaptive layout, text scaling/localization, and
   input/accessibility** — permissions requested in context and handled
   gracefully when denied; layout across window sizes, orientation/
   folding, multitasking, keyboard, safe areas; platform text-scaling and
   locale-aware formatting; and actual accessibility-tree/assistive-
   technology behavior (labels, reading order, target sizes, contrast,
   reduced motion) — not visual inspection alone.

   Steps 3, 4, and 6 each have a fuller per-platform checklist — see
   [references/platform-review-checklist.md](references/platform-review-checklist.md)
   and consult it for any non-trivial platform-convention or accessibility
   check, and whenever a suspected finding needs sorting between "confirmed
   defect" and "cross-platform visual preference."
7. **Validate and separate findings** — before any suspected issue counts
   as a finding, check it against the real interface, platform guidance,
   the app's own patterns, or another appropriate source. Explicitly
   separate observable violations (a documented convention or contract
   break, or a mismatch between the interface's primary objects/actions/
   concepts and the priority its navigation/placement/size/grouping/
   disclosure or semantic color actually communicates) from subjective
   cross-platform visual preferences — the latter are not findings unless
   tied to a concrete usability or accessibility problem.
8. **Report environment evidence** — record what was actually checked:
   device/OS/window used, simulator vs. physical device, and any
   simulator-only limitation (e.g. some permission flows, haptics, or
   assistive-technology behavior don't fully reproduce off-device).
9. **Rank and structure findings** — prioritize by real impact,
   consolidate duplicates, and split into confirmed defects, open
   questions, and optional improvements before returning them.

## Output

Return findings grouped in this order, each group visibly separate:

1. **Confirmed defects** — validated issues, most-impactful first.
2. **Open questions** — suspected issues that couldn't be confirmed or
   denied with available evidence.
3. **Optional improvements** — real but non-blocking suggestions, kept
   distinct from subjective cross-platform visual preferences (which are
   not reported as findings at all unless tied to a concrete usability or
   accessibility problem).

Each finding includes:

- **Severity/priority**
- **Location** — precise: screen/component/state, or file/line if sourced
  from code
- **Failure scenario** — concrete: what input, state, device, or
  assistive-technology interaction causes it to go wrong
- **Impact**
- **Evidence** — what was actually observed on the real interface, or the
  specific platform-guidance passage being violated
- **Suggested correction** — the smallest supported fix or decision,
  described only; this skill does not apply it
- **Confidence/condition** — when an assumption remains

Close with an **environment/evidence** summary: app/platform/OS/device or
simulator used, which checks ran on a physical device vs. simulator/
emulator, and any coverage gap (no device, no assistive-technology access,
a check that couldn't run) stated explicitly rather than omitted.

## Verification

Before handing back findings, confirm: the target was fixed and stated
(step 1); the real interface was inspected, not just code or a screenshot,
wherever reachable (step 2); primary objects/actions/concepts and their
priority were checked against actual navigation/placement/grouping, not
assumed correct because individual conventions passed (step 3); platform
conventions and semantic color were checked against current official
guidance, not memory (step 4); state/lifecycle, interruption/restoration,
permissions, adaptive layout, text scaling/localization, input, and
accessibility-tree behavior were each considered (steps 5–6); every
confirmed defect was validated (step 7); confirmed defects stayed separated
from cross-platform visual preferences, open questions, and optional
improvements; environment/device evidence and any coverage gap were stated
explicitly (step 8); nothing was edited; no secrets were reproduced in the
output.

## Boundaries

This skill reviews and reports; it does not edit the interface under
review and does not apply any of its own suggested corrections, unless a
human or the invoking step explicitly authorizes a separate edit step. The
natural next step — a native implementation/fix skill — is a follow-on the
caller can invoke separately, not a hard dependency; this skill works
standalone. Cross-platform visual consistency alone is never sufficient
grounds for a finding in either direction: it doesn't excuse a native
convention violation, and it isn't itself a defect. Keep review and
modification separate unless both are explicitly requested together.

## Failure behavior

- No fixed app/platform/version/build, or the target keeps moving → stop
  and ask rather than reviewing a moving target.
- The real interface isn't reachable (no simulator, no device, no build) →
  say so and state which checks had to fall back to code/screenshot review
  instead of silently treating that as equivalent.
- The platform's assistive technology isn't accessible → report
  accessibility-tree checks as "not run" with the reason, not skipped
  silently or claimed as passed.
- A suspected defect can't be validated with available evidence or access
  → report it as an open question, not a confirmed defect.
- A suspected issue turns out to be only a cross-platform visual
  preference with no concrete usability or accessibility impact → drop it,
  don't report it as a defect or optional improvement.
- Secrets or sensitive material are encountered while reviewing → don't
  reproduce them in the findings output; reference their location only.
- Always separate passed, failed, and not-run checks, and list what's
  outside the reviewed scope, including any platform or device class not
  covered.

## Examples

```
Review the iOS "Order details" screen on the current App Store build
before we ship an update to it. iOS 17+, SwiftUI.
```

Expected approach: fix the target (iOS 17+, SwiftUI, current App Store
build, "Order details" screen); inspect the real screen on a simulator or
device rather than just the source; check its navigation/presentation
against current Apple HIG, its state ownership/lifetime across
backgrounding and rotation, Dynamic Type behavior, and VoiceOver labels/
reading order; validate any suspected issue against the running interface
or HIG before reporting it; separate a confirmed defect (e.g. a control
missing a VoiceOver label) from a subjective preference (e.g. "I'd make
this button bigger" with no usability basis); report confirmed defects,
open questions, and optional improvements with environment evidence (
simulator vs. device, iOS version used).

When the target platform is Android rather than iOS, see
[references/worked-example-android.md](references/worked-example-android.md)
for a worked lifecycle/accessibility review.
