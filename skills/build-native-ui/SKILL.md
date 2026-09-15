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
---

## Overview

This skill covers only implementing an already-approved native UI change in
an existing app — it does not cover deciding what the UI should be. Given
the approved change, it declares the target platform and inspects the app's
existing native architecture, models the interface's objects, actions, and
concepts before touching layout, implements using the platform's own
interaction conventions and the app's established patterns, defines state
ownership/lifetime and interruption behavior explicitly, and verifies the
result on the actual target platform rather than from code alone.

## When to use

- An approved native UI change (design, mock, spec, or a linked
  Initiative, Bug, or TODO) exists for an existing iOS, Android, desktop,
  or other native app, and the next step is building it.
- The user asks to implement a specific screen, view, or interaction in a
  native app project where the scope is already settled.

## Do not use when

- The design itself still needs deciding or approving — resolve that
  first.
- The UI is web or browser-only (no native shell) — layout and platform
  constraints differ.
- There is no existing native architecture to follow (a greenfield app).
- The change would migrate framework, navigation architecture, or
  deployment target without an explicit prior decision to do so.
- The approved scope is behavior/API behind the UI rather than the
  interface itself — that's a generic feature build, not native UI
  implementation.

## Prerequisites

- Read/write access to the native app repository and its build/test
  tooling, including the relevant simulator/emulator and, depending on
  risk, a physical device.
- The approved UI change itself, ideally with a design/mock reference.
- The target platform, minimum OS, and UI framework/library version. If
  it's not already obvious from the repository, declare it explicitly
  before proceeding (Procedure step 1) or treat it as a blocker if it can't
  be determined.

## Inputs

- The approved UI change or design reference.
- The target platform, minimum OS, and UI framework/library version —
  declared explicitly if not already evident from the repo.
- Any explicit constraints called out in the approval (must preserve an
  existing API or permission, must not change navigation, must ship behind
  a flag).
- Pointers to the relevant screen or module, if already known; otherwise
  located during the procedure.

## Procedure

1. Restate the approved UI change as concrete, testable behavior. Declare
   the target platform, minimum OS, and UI framework/library version from
   the repo, or explicitly if not yet evident.
2. Load the matching **engineering** reference(s) for the declared stack
   (same-skill `references/` only). Framework APIs must not override the
   **target OS** visual/interaction conventions — fetch current official
   platform design guidance for that OS (Apple HIG including watchOS,
   Material/Android, Microsoft Fluent, GNOME HIG) when making UX or
   visual decisions, rather than recalling it from memory:

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

3. Inspect the existing native architecture before writing anything:
   navigation pattern, state-management approach, component/view
   conventions, the API and permission contracts the screen touches, and
   existing accessibility/localization patterns.
4. Model the interface before styling it: identify the primary objects, the
   actions available on them, and the broader workflows/concepts that
   combine them; assign relative priority. Let that hierarchy drive
   navigation, prominence, grouping, and progressive disclosure. For
   substantial changes, also work through the fuller checklist
   (actors/roles/permissions, lifecycle states, what must survive
   interruption, 0/1/some/many cases) in
   [references/design-and-verification-checklist.md](references/design-and-verification-checklist.md).
5. For the platform declared in step 1, confirm the applicable convention
   against current official platform design guidance (Apple HIG including
   watchOS, Material/Android, Microsoft Fluent, GNOME HIG) rather than
   recalling it from memory — guidance changes over time. Use it as the
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
7. Implement using the app's existing state-ownership/binding patterns,
   component system, and platform conventions, in small increments,
   following the loaded engineering reference (TDD where achievable). Apply
   the object/action/concept priority from step 4 to vertical rhythm,
   typography scale, alignment, and color as authoring rules, not just a
   later check: use a deliberate platform-appropriate spacing/type scale, a
   small number of strong alignment axes, and color used semantically
   (state, hierarchy, selection) from the app's existing palette or
   platform system colors, rather than a new accent hue. Availability-gate
   any newer platform API the change relies on against the declared
   minimum OS. Do not mix units — CSS pixels, Apple points, Android dp, and
   physical pixels are not interchangeable; use the platform's own unit
   throughout. Build in accessibility (platform text scaling, semantic
   names/values, reading order, usable target sizes, contrast, reduced
   motion), localization (platform-aware dates/numbers/plurals/direction,
   longer translation lengths), and adaptive layout (rotation/folding,
   multitasking, keyboard, safe areas/insets) as part of the same change.
8. If the approved scope turns out to require a framework,
   navigation-architecture, or deployment-target change, stop and report it
   as a blocker instead of proceeding — that needs an explicit separate
   decision (see Failure behavior).

The stop/continue decision points in this procedure:

```mermaid
flowchart TD
  Start[Approved native UI change] --> Declare[Declare platform, min OS, framework version]
  Declare --> LoadRefs[Load engineering refs + current OS HIG]
  LoadRefs --> Inspect[Inspect existing native architecture]
  Inspect --> Scope{Scope implies framework, nav, or<br/>deployment-target change?}
  Scope -- Yes --> StopA[Stop: report blocker,<br/>needs explicit prior decision]
  Scope -- No --> Model[Model objects, actions, concepts, priority]
  Model --> Implement[Implement with platform conventions<br/>+ app's existing patterns]
  Implement --> Verify{Verified on target<br/>platform/device?}
  Verify -- No --> StopB[Report as not run,<br/>with the reason]
  Verify -- Yes --> Done[Report result, evidence,<br/>and any coverage gaps]
```

## Output

The native UI code change, limited to what the approved scope requires,
plus a report: what changed, which platform(s) were implemented and
verified, verification evidence (passed/failed/not run, including whether
checks ran on simulator/emulator vs. a physical device),
accessibility/localization/adaptive-layout coverage, and anything left out
of scope (including platforms the approval didn't cover).

## Verification

Verification must inspect the actual native interface on the target
platform rather than describe it from code alone. Check: typography/
spacing rhythm and vertical alignment; alignment axes and visual
complexity; color/contrast in all supported appearances; adaptive layouts
across window sizes/orientations; state transitions and spatial stability;
platform navigation/control conventions (back behavior, sheets, menus);
text scaling; the input methods relevant to the platform; accessibility
semantics through the actual accessibility tree/assistive technology
(VoiceOver, TalkBack, UI Automation, or screen reader — not visual
inspection alone); and representative interruption/lifecycle states
(backgrounding, rotation, low connectivity). For an Electron or other
web-rendered desktop target, run both the web checks and the desktop-shell
integration checks — neither alone is sufficient.

Separate observable violations (a clear guideline or contract break) from
subjective recommendations, and state any simulator-only, device-only, or
assistive-technology coverage gap explicitly rather than omitting it. See
[references/design-and-verification-checklist.md](references/design-and-verification-checklist.md)
for the full per-platform (iOS/SwiftUI, watchOS, Android/Compose,
desktop/Electron) checklist.

## Boundaries

Stay tied to the approved UI scope only — no unrelated visual refactors or
component migrations. Preserve existing public APIs, permission contracts,
data semantics, and side effects outside the approved scope. Never migrate
framework, navigation architecture, or deployment target as part of this
skill — that requires an explicit prior decision, not an inference made
during implementation. Cross-platform visual consistency alone never
justifies overriding a native platform convention. This skill doesn't
commit, push, or open a pull request — that's governed by whatever process
invoked it. Ask rather than assume when the approved scope is ambiguous
about something affecting correctness, state ownership, or a
platform-convention deviation; for small reversible choices, state the
assumption and proceed.

## Failure behavior

If there is no approved UI change or design reference, or the target
platform/minimum OS can't be determined, stop and report that gap instead
of guessing. If a required check can't run — no simulator, no device, no
access to the platform's assistive technology — report it as "not run"
with the reason rather than skipping it silently or claiming it passed. If
the approved scope conflicts with an existing API, permission, or data
contract, or implies a framework/navigation/deployment-target change, stop
and surface the conflict instead of picking a side. Always separate
passed, failed, and not-run results, and list what's outside the delivered
scope, including any platform not verified.

## Examples

```
Add a "Notify me" toggle to the existing iOS settings screen, per the
approved design. Toggling it on should request notification permission if
not already granted.
```

Expected approach: inspect the existing settings screen's state/binding
pattern and how other toggles on that screen are wired; implement the new
toggle using that same pattern and SwiftUI's system `Toggle` control;
handle the permission-request flow using the app's existing permission
pattern rather than a new one; verify with Dynamic Type and VoiceOver on a
simulator or device.

```
Implement the approved Apple Watch step-goal glance: complication +
vertical-page detail, Crown scroll, Always On redaction, per design.
```

Expected approach: load `watchos.md` + `swiftui.md` and current watchOS
HIG (not iPhone HIG); implement with WidgetKit complications (not
ClockKit), watchOS navigation patterns, and energy-aware updates; verify
across Watch sizes and VoiceOver — do not reuse iPhone IA.

```
Add multi-select to the existing Android contacts list, per the approved
design: long-press selects an item, a selection toolbar appears, and the
selection and scroll position must survive rotation and returning from
the backgrounded app.
```

Expected approach: inspect the existing list's state-hoisting pattern and
where scroll position is currently tracked; hoist selection state the same
way and persist both selection and scroll position across
configuration change and process death using the app's existing
`SavedStateHandle`/state-restoration pattern; verify with TalkBack, a
rotation check, and a background/foreground round-trip on an emulator or
device.
