# Platform review checklist

On-demand detail for [../SKILL.md](../SKILL.md). Load this when running the
per-platform verification pass, or when a suspected finding needs to be
sorted between "confirmed defect" and "cross-platform visual preference."
Skip it for a narrow, self-contained check where the inline procedure
already covers the risk.

## Separating defects from preferences

A finding only counts as confirmed when one of these is true:

- It contradicts current official platform guidance (Apple HIG, Google
  Material/Android guidance, Microsoft Windows design guidance) and there's
  no documented product/usability reason for the deviation.
- It contradicts the app's own established pattern elsewhere (e.g. every
  other destructive action in the app confirms, this one doesn't).
- It breaks an observable contract: state is lost when it shouldn't be, an
  action produces a duplicate request or false success, an accessibility
  label is missing or wrong, a target is unreachable by keyboard or
  assistive technology, layout breaks or clips at a supported size.

None of these, on their own, are findings:

- "This doesn't look like platform X's equivalent screen" when platform X
  wasn't the target platform.
- "This differs from the other native platform's version of the same
  screen" — native platforms are expected to diverge in presentation while
  sharing product meaning.
- A stylistic preference (spacing, color choice, icon style) with no tie to
  a documented convention, an app-internal inconsistency, or a usability/
  accessibility impact.

When unsure which bucket a suspected issue falls into, state the specific
guidance passage or app pattern it's checked against; if none exists, it's
a preference, not a defect — report it as an optional improvement only if
it has a concrete, stated usability rationale, otherwise drop it.

## Per-platform verification checklist

### iOS / SwiftUI

- State ownership and bindings match how the rest of the app manages
  equivalent state (`@State`/`@Binding`/`@Observable`/etc.), and view
  identity/navigation intent is preserved (no unintended resets or
  animations from identity changes).
- System presentation is used where the platform expects it (sheets,
  alerts, `NavigationStack`) rather than a custom re-implementation, unless
  there's a documented reason.
- Dynamic Type: layout holds up at larger accessibility text sizes without
  clipping or overlap.
- VoiceOver: elements have correct labels/traits/values, reading order
  matches visual/logical order, and custom controls expose the right
  actions.
- Newer APIs actually used are availability-gated against the app's
  declared minimum OS.
- State survives backgrounding, rotation/resizing, and relaunch as
  appropriate to what it represents (transient UI state vs. durable data).

### Android / Compose

- State is hoisted to the level matching the app's existing
  state-hoisting pattern, and persistence choice (in-memory,
  `SavedStateHandle`, database) matches the state's required lifetime.
- Effects (`LaunchedEffect`, `DisposableEffect`) are bound to the correct
  lifecycle/key — check for leaks or unexpected re-runs, not just presence.
- Navigation and layout adapt to the available window size and insets
  (multi-window, foldables, system bars) rather than assuming one fixed
  window class.
- Semantics are verified with TalkBack, not just Compose semantics tree
  inspection, and touch targets meet the platform's minimum size.
- Permissions are requested in context, at the point of use, and denial/
  revocation is handled without breaking the flow.
- Selection, scroll position, and other in-flight state survive
  configuration change and, where the app's contract requires it, process
  death.

### Desktop (including Electron / web-rendered)

- Resizing and windowing behave correctly across a reasonable range of
  window sizes, not just the default, including minimum-size and
  maximized/tiled states.
- Precision-pointer interactions (hover, right-click, drag) and keyboard
  shortcuts, menus, and focus order follow platform convention.
- The app behaves correctly across multiple displays (moving/resizing
  across a display boundary, mixed DPI).
- Screen readers / platform accessibility APIs (UI Automation on Windows,
  VoiceOver on macOS) can reach and describe the interface, not just the
  visual layout.
- For Electron or other web-rendered desktop targets, run both sets of
  checks: standard web checks (DOM semantics, responsive layout, browser
  devtools accessibility audit) and desktop-shell integration checks
  (native menu, window controls, OS-level shortcuts, file-system/IPC
  behavior) — neither alone is sufficient.

## Environment and simulator-limitation notes

Record, per finding and for the review overall:

- Whether the check ran on a simulator/emulator or a physical device.
- The OS version, window size/orientation, and locale/text-scale setting
  used.
- Any check that a simulator/emulator cannot fully reproduce and had to be
  skipped or caveated — common examples: some permission-prompt flows,
  haptics, certain sensor-driven behavior, and some assistive-technology
  timing/announcement behavior differ from a physical device. State these
  explicitly rather than reporting a simulator-only check as equivalent to
  a device-verified one.
