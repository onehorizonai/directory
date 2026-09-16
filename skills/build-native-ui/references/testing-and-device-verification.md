# Testing and device verification

On-demand detail for [../SKILL.md](../SKILL.md). Load when a change
affects something a user can see or interact with, to decide the test
level and the device-level tool, and when declaring a UI change done.
Unit/widget-level TDD for a specific stack (state, view models,
formatting logic) lives in that stack's own reference
([swiftui.md](swiftui.md), [android.md](android.md),
[flutter.md](flutter.md), [electron.md](electron.md),
[windows.md](windows.md), [linux-gtk.md](linux-gtk.md)) — this file
covers the layer above that: exercising the built screen through real
user journeys on the target platform.

**Do not claim the UI is correct because it compiles or unit tests
pass.** A meaningful UI change needs a pass on simulator, emulator, or
device.

## Testing philosophy

- Inspect the repo first and prefer its existing test framework and
  style when it fits — don't stand up a parallel harness. Use the
  per-platform tools below only when the project has none yet, or the
  existing tooling can't reach the behavior (cross-app navigation,
  permission dialogs, a real device).
- **TDD where appropriate**, at the smallest useful level — most
  behavior is proven faster by a unit or widget/view test than a full
  UI-automation run; reserve device-level tests for journeys a lower
  level can't reach. Don't force TDD ceremony onto exploratory layout
  work or a small visual polish change — a direct simulator/device look
  is enough there.
- For a **UI bug fix**, reproduce the problem on-platform first when
  practical, then add a regression test when it provides lasting value
  (a real interaction bug, not a one-off visual nit).
- The use cases, priorities, and states from the approved design (or the
  step-4 object/action model) are the candidate test list — turn each
  reachable state and primary journey into a check instead of testing
  only what the implementation happens to do.
- Cover **important user journeys**: entry, navigation between screens,
  input, dialogs/sheets/alerts, permission prompts, and the empty,
  loading, error, and success states the journey passes through.
- Prefer accessible, semantic queries (accessibility id/label, role) over
  coordinate taps or brittle view hierarchies.

## Device-level tools by platform

Use the appropriate tooling for the platform rather than forcing one
framework everywhere.

| Platform | Tool | Fits | Limitation |
| --- | --- | --- | --- |
| iOS / iPadOS / macOS | **XCUITest** | In-process UI automation driven from Xcode; navigation, input, permission-dialog handling, accessibility queries | Apple platforms only; slower than a unit/`Swift Testing` case |
| iOS / iPadOS / macOS | **Swift Testing** / **XCTest** | Unit and integration tests below the UI layer (see [swiftui.md](swiftui.md) / [macos.md](macos.md)) | Not a substitute for an on-device interaction pass |
| Android | **UI Automator** | Cross-app, system-UI interaction (permission dialogs, notifications, other apps) that Espresso can't reach | Slower, more brittle than in-app Espresso/Compose tests |
| Android | **Espresso** / **Compose UI testing** / **JUnit** | In-app UI automation and unit tests (see [android.md](android.md)) | Stays inside the app under test; can't drive system dialogs |
| Flutter | **flutter_test** / **integration_test** | Widget tests and full-app integration tests (see [flutter.md](flutter.md)) | `integration_test` can't drive native platform UI outside the Flutter view |
| Flutter | **Patrol** | Extends `integration_test` to reach native platform UI — permission dialogs, notifications, deep links | Adds a dependency; use only when a journey needs native-UI interop that `integration_test` can't reach |
| Electron | Renderer: a browser-automation tool (e.g. Playwright) against the renderer's DOM + main/IPC: unit tests | See [electron.md](electron.md) — Testing and TDD | Desktop-shell behavior (native menu, OS shortcuts) still needs a manual or shell-level pass |
| Cross-platform mobile / black-box flows | **Maestro** | Declarative, flaky-resistant flows across iOS and Android from one YAML spec; good default for a journey that must run identically on both platforms | Less granular than XCUITest/Espresso for a single-platform interaction detail |
| Cross-platform mobile | **Appium** | Cross-platform automation when the project already standardizes on WebDriver-style tooling, or needs one framework across native + hybrid + mobile web | More setup and maintenance overhead than Maestro for a simple journey |
| React Native | **Detox** | Gray-box E2E built for React Native's bridge, with less flakiness than black-box tools for that stack | React Native specific |

**Agent-ready tooling:** Maestro has an MCP server and an in-app
assistant (Maestro Studio) that let a coding agent drive a simulator/
emulator, inspect the current screen, and generate or run flows directly
— useful when a change needs new cross-platform journey coverage and the
project doesn't already have an equivalent Maestro flow. Don't reach for
it just because it exists; a project already standardized on Espresso/
XCUITest/Appium doesn't need a second framework for the same journey.

## What "done" requires (meaningful UI changes)

Align with the skill's Verification section:

1. Relevant unit/widget tests for the stack (per-platform reference).
2. Project build / lint / static-analysis as usual.
3. App running on simulator/emulator, and on a physical device when the
   change touches a device-only capability (camera, biometrics, real
   network conditions).
4. The affected journey exercised end to end: entry, navigation, input,
   any dialog/sheet/permission prompt it triggers.
5. Empty, loading, error, and success states the journey passes through.
6. Screen/window size and orientation coverage in scope (see the
   platform reference's adaptive-layout guidance).
7. Accessibility pass through the platform's real accessibility tree
   (VoiceOver, TalkBack, UI Automation) — not visual inspection alone.

## Flakes and honesty

- Wait for conditions (element appears, animation settles), not fixed
  sleeps as the only sync.
- If you can't run a simulator, emulator, or device, mark verification
  **not run** with the reason — never imply it passed.

Cross-check UI modeling and the full per-platform verification checklist
in
[design-and-verification-checklist.md](design-and-verification-checklist.md).
