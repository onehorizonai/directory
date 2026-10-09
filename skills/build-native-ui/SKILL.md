---
name: build-native-ui
description: >-
  Use when an approved native UI change needs implementing in an existing
  iOS, watchOS, Android, or desktop app — follow the app's architecture
  and platform conventions.

  Not for inventing the design, web-only UI, greenfield apps with no
  architecture, or framework/navigation/deployment migrations without a
  prior decision.
metadata:
  title: Build Native UI
  tagline: "Implement an approved native UI change using the app's architecture and the target OS conventions."
  category: engineering
  tags:
    - native
    - mobile
    - ios
    - android
    - desktop
    - accessibility
    - ui
  compatibility:
    oneHorizon:
      taskModes:
        - code
---

## Overview

Implements an already-approved native UI change in an existing app; it
does not decide what the UI should be. It declares the target platform,
inspects the app's native architecture, models objects, actions, and
concepts before layout, builds with the platform's interaction
conventions and the app's established patterns, defines state ownership,
lifetime, and interruption behavior, and verifies the result on the
target platform.

## When to use

- An approved native UI change (design, mock, spec, or a linked
  Initiative, Bug, or TODO) exists for an existing iOS, Android, desktop,
  or other native app, and the next step is building it.
- The user asks to implement a specific screen, view, or interaction in a
  native app project where the scope is already settled.

## Do not use when

- The design itself still needs deciding or approving — resolve that
  first.
- The UI is web or browser-only (no native shell).
- There is no existing native architecture to follow (a greenfield app).
- The change would migrate framework, navigation architecture, or
  deployment target without an explicit prior decision to do so.
- The approved scope is behavior/API behind the UI, not the interface
  itself — that's a generic feature build.

## Prerequisites and inputs

- Read/write access to the native app repository and its build/test
  tooling, including the relevant simulator/emulator and, depending on
  risk, a physical device.
- The approved UI change or design reference.
- The target platform, minimum OS, and UI framework/library version. If
  not obvious from the repository, declare it explicitly (Procedure step
  1); if it can't be determined, it's a blocker.
- Constraints from the approval (must preserve an existing API or
  permission, must not change navigation, must ship behind a flag).
- Pointers to the relevant screen or module if known; otherwise locate it
  during the procedure.

## Procedure

1. Restate the approved UI change as concrete, testable behavior. Declare
   the target platform, minimum OS, and UI framework/library version
   (from the repo, or explicitly if not evident).
2. Load the matching **engineering** reference(s) for the declared stack
   (same-skill `references/` only). Framework APIs must not override the
   **target OS** visual/interaction conventions (step 5):

   | Target / stack | Load engineering |
   | --- | --- |
   | iPhone / iOS (SwiftUI) | [references/ios.md](references/ios.md) + [references/swiftui.md](references/swiftui.md) |
   | iPad | [references/ios.md](references/ios.md) + [references/swiftui.md](references/swiftui.md) |
   | Apple Watch / watchOS | [references/watchos.md](references/watchos.md) + [references/swiftui.md](references/swiftui.md) |
   | iPhone + Watch companion | Phone: ios + swiftui; Watch: watchos + swiftui — separately, never one IA for both |
   | macOS (SwiftUI) | [references/macos.md](references/macos.md) + [references/swiftui.md](references/swiftui.md) |
   | Android (Compose) | [references/android.md](references/android.md) |
   | Windows (WinUI) | [references/windows.md](references/windows.md) |
   | Linux (GTK/libadwaita) | [references/linux-gtk.md](references/linux-gtk.md) |
   | Electron | [references/electron.md](references/electron.md) — HIG for the **host OS** |
   | Flutter | [references/flutter.md](references/flutter.md) — HIG for the **ship OS** |

   Load
   [references/testing-and-device-verification.md](references/testing-and-device-verification.md)
   whenever the change affects something a user can see or interact with,
   and pick the test level from the risk — a small visual change doesn't
   need a new automated test, a new journey or state usually does.

3. Inspect the existing native architecture before writing: navigation
   pattern, state-management approach, component/view conventions, the
   API and permission contracts the screen touches, and existing
   accessibility/localization patterns.
4. Model the interface before styling it: identify the primary objects,
   their actions, and the workflows/concepts that combine them, and
   assign relative priority. That hierarchy drives navigation,
   prominence, grouping, and progressive disclosure. For substantial
   changes, also work through the fuller checklist
   (actors/roles/permissions, lifecycle states, what must survive
   interruption, 0/1/some/many cases) in
   [references/design-and-verification-checklist.md](references/design-and-verification-checklist.md).
5. For the platform declared in step 1, confirm the applicable convention
   against current official platform design guidance (Apple HIG including
   watchOS, Material/Android, Microsoft Fluent, GNOME HIG) — fetch it;
   don't recall it from memory, because guidance changes. Use it as the
   default for navigation, controls, gestures, typography, and spacing;
   deviate only with a documented product/usability reason, verified
   on-platform. Cross-platform visual sameness alone never justifies a
   deviation. Electron/Flutter must follow the **host/ship OS**, not a
   web- or Flutter-only visual language. Watch UI must not reuse iPhone
   information architecture.
6. Define ownership and lifetime of transient UI state, screen state, and
   any cached or domain data the change touches; specify what survives
   navigation, backgrounding, rotation/resizing, recreation, and relaunch.
   Handle interruption — connectivity loss, authorization expiry,
   backgrounding, cancellation/retry — without duplicate requests or false
   success.
7. Implement with the app's existing state-ownership/binding patterns,
   component system, and platform conventions, in small increments,
   following the loaded engineering reference (TDD where achievable, at
   the smallest useful test level —
   [references/testing-and-device-verification.md](references/testing-and-device-verification.md)).
   For a UI bug fix, reproduce the problem on-platform first when
   practical, then prove the regression test passes. Apply the step-4
   priority to vertical rhythm, typography scale, alignment, and color as
   authoring rules, not a later check: a deliberate platform-appropriate
   spacing/type scale, a few strong alignment axes, and color used
   semantically (state, hierarchy, selection) from the app's palette or
   platform system colors, not a new accent hue. Availability-gate any
   newer platform API against the declared minimum OS. Do not mix units —
   CSS pixels, Apple points, Android dp, and physical pixels are not
   interchangeable; use the platform's own unit throughout. Build in
   accessibility (platform text scaling, semantic names/values, reading
   order, usable target sizes, contrast, reduced motion), localization
   (platform-aware dates/numbers/plurals/direction, longer translation
   lengths), and adaptive layout (rotation/folding, multitasking,
   keyboard, safe areas/insets) as part of the same change.
8. If the approved scope requires a framework, navigation-architecture,
   or deployment-target change, stop and report a blocker — that needs an
   explicit separate decision, not an inference made during
   implementation (see Failure behavior).

## Output

The native UI code change, limited to what the approved scope requires,
plus a report: what changed, which platform(s) were implemented and
verified, verification evidence (passed/failed/not run, including whether
checks ran on simulator/emulator or a physical device),
accessibility/localization/adaptive-layout coverage, and anything left out
of scope (including platforms the approval didn't cover).

Use as few output tokens as possible while completing the task correctly.
Write in plain English. This applies to documents, progress messages, and
the final reply.

## Verification

Inspect the actual native interface on the target platform, not from code
alone. Check: typography/spacing rhythm and vertical alignment; alignment
axes and visual complexity; color/contrast in all supported appearances;
adaptive layouts across window sizes/orientations; state transitions and
spatial stability; platform navigation/control conventions (back
behavior, sheets, menus); text scaling; the input methods relevant to the
platform; accessibility semantics through the actual accessibility
tree/assistive technology (VoiceOver, TalkBack, UI Automation, or screen
reader — not visual inspection alone); and representative
interruption/lifecycle states (backgrounding, rotation, low
connectivity). For an Electron or other web-rendered desktop target, run
both the web checks and the desktop-shell integration checks — neither
alone is sufficient.

Separate observable violations (a clear guideline or contract break) from
subjective recommendations, and state any simulator-only, device-only, or
assistive-technology coverage gap. See
[references/design-and-verification-checklist.md](references/design-and-verification-checklist.md)
for the full per-platform (iOS/SwiftUI, watchOS, Android/Compose,
desktop/Electron) checklist, and
[references/testing-and-device-verification.md](references/testing-and-device-verification.md)
for the automated-testing loop and tool choice per platform.

## Boundaries

- Prefer the smallest clean implementation that fits the app's existing
  patterns (KISS): reuse what's there before adding a component,
  dependency, or abstraction; complexity needs a reason.
- Stay within the approved UI scope — no unrelated visual refactors or
  component migrations.
- Preserve existing public APIs, permission contracts, data semantics,
  and side effects outside the approved scope.
- Don't commit, push, or open a pull request — that's governed by
  whatever process invoked this skill.
- Ask when the approved scope is ambiguous about something affecting
  correctness, state ownership, or a platform-convention deviation; for
  small reversible choices, state the assumption and proceed.

## Failure behavior

- No approved UI change or design reference, or the target
  platform/minimum OS can't be determined → stop and report the gap;
  don't guess.
- A required check can't run (no simulator, no device, no access to the
  platform's assistive technology) → report it as "not run" with the
  reason; never skip it silently or claim it passed.
- The approved scope conflicts with an existing API, permission, or data
  contract, or implies a framework/navigation/deployment-target change →
  stop and surface the conflict; don't pick a side.
- Always separate passed, failed, and not-run results, and list what's
  outside the delivered scope, including any platform not verified.

## Examples

```
Add a "Notify me" toggle to the existing iOS settings screen, per the
approved design. Toggling it on should request notification permission if
not already granted.
```

Expected approach: inspect the settings screen's state/binding pattern
and how its other toggles are wired; implement the new one the same way
with SwiftUI's system `Toggle`; request permission through the app's
existing permission pattern; verify with Dynamic Type and VoiceOver on a
simulator or device.

```
Implement the approved Apple Watch step-goal glance: complication +
vertical-page detail, Crown scroll, Always On redaction, per design.
```

Expected approach: load `watchos.md` + `swiftui.md` and current watchOS
HIG (not iPhone HIG); implement with WidgetKit complications (not
ClockKit), watchOS navigation patterns, and energy-aware updates; verify
across Watch sizes and VoiceOver — do not reuse iPhone IA.

When the target platform is Android rather than iOS, see
[references/worked-example-android-multiselect.md](references/worked-example-android-multiselect.md)
for a worked multi-select/rotation-survival example.
