# Platform review checklist

On-demand detail for [../SKILL.md](../SKILL.md). The core rules (defect
vs preference, the object/action/priority and semantic-color checks) are
inline in steps 3, 4, and 8 — this file adds the per-platform checklist
(iOS/Compose, Android/Compose, or Desktop — load only the section for the
platform under review) and extra edge-case examples for sorting an
ambiguous finding between "confirmed defect" and "cross-platform visual
preference." Skip this file when the inline steps already resolved the
finding.

## Separating defects from preferences

A finding is confirmed only when one of these is true:

- It contradicts current official platform guidance (Apple HIG, Google
  Material/Android guidance, Microsoft Windows design guidance) with no
  documented product/usability reason.
- It contradicts the app's own established pattern (e.g. every other
  destructive action in the app confirms, this one doesn't).
- It breaks an observable contract: state lost when it shouldn't be, a
  duplicate request or false success, a missing or wrong accessibility
  label, a target unreachable by keyboard or assistive technology, layout
  that breaks or clips at a supported size.
- Navigation, placement, size, grouping, or progressive disclosure
  misrepresents the interface's primary objects/actions/concepts and their
  relative priority (e.g. a secondary action more prominent than the
  primary one, a primary object's state buried behind disclosure), or
  color that signals state/hierarchy/selection/action is used
  decoratively or inconsistently — with no documented product/usability
  reason. This counts even when every control is convention-correct and
  contract-clean; the defect is in the interface model.

None of these, on their own, are findings:

- "This doesn't look like platform X's equivalent screen" when platform X
  wasn't the target platform.
- "This differs from the other native platform's version of the same
  screen" — native platforms are expected to diverge in presentation while
  sharing product meaning.
- A stylistic preference (spacing, purely decorative color with no
  signalling role, icon style) with no tie to a documented convention, an
  app-internal inconsistency, a usability/accessibility impact, or a
  misrepresented object/action/concept priority.

When unsure which bucket an issue falls into, state the specific guidance
passage or app pattern it's checked against; if none exists, it's a
preference — report it as an optional improvement only if it has a
concrete, stated usability rationale, otherwise drop it.

## Object/action/concept priority and semantic color

Check these before or alongside platform-convention checks — they test
the interface model, not the styling of individual controls:

- Identify the primary objects, actions, and workflows/concepts the
  interface represents and their relative priority. Then check that
  navigation, placement, size, grouping, and progressive disclosure
  reflect that priority — a secondary action can pass every convention
  check and still be the most prominent control on the screen, or a
  primary object's state can be present but buried behind a disclosure
  control. Either is a finding when there's no documented product/
  usability reason.
- Check color for semantic use, separately from the accessibility-contrast
  check: color that signals state, hierarchy, selection, or available
  actions should be applied consistently and match the platform's
  semantic-color conventions (e.g. a destructive action always using the
  same color, a selected state always using the same indicator color).
  Decorative or inconsistent color for what looks like a
  state/hierarchy/selection signal is a finding on its own, even when the
  colors pass contrast.

## Per-platform verification checklist

### iOS / SwiftUI

- State ownership and bindings match how the rest of the app manages
  equivalent state (`@State`/`@Binding`/`@Observable`/etc.), and view
  identity/navigation intent is preserved (no unintended resets or
  animations from identity changes).
- System presentation is used where the platform expects it (sheets,
  alerts, `NavigationStack`) rather than a custom re-implementation, unless
  there's a documented reason.
- Dynamic Type: layout holds at larger accessibility text sizes without
  clipping or overlap.
- VoiceOver: elements have correct labels/traits/values, reading order
  matches visual/logical order, and custom controls expose the right
  actions.
- Newer APIs used are availability-gated against the app's declared
  minimum OS.
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
- Permissions are requested at the point of use, and denial/revocation is
  handled without breaking the flow.
- Selection, scroll position, and other in-flight state survive
  configuration change and, where the app's contract requires it, process
  death.

### Desktop (including Electron / web-rendered)

- Resizing and windowing behave correctly across a range of window sizes,
  not just the default, including minimum-size and maximized/tiled states.
- Precision-pointer interactions (hover, right-click, drag) and keyboard
  shortcuts, menus, and focus order follow platform convention.
- The app behaves correctly across multiple displays (moving/resizing
  across a display boundary, mixed DPI).
- Screen readers / platform accessibility APIs (UI Automation on Windows,
  VoiceOver on macOS) can reach and describe the interface, not just the
  visual layout.
- For Electron or other web-rendered desktop targets, run both: standard
  web checks (DOM semantics, responsive layout, browser devtools
  accessibility audit) and desktop-shell integration checks (native menu,
  window controls, OS-level shortcuts, file-system/IPC behavior) — neither
  alone is sufficient.

## Environment and simulator-limitation notes

Record, per finding and for the review overall:

- Whether the check ran on a simulator/emulator or a physical device.
- The OS version, window size/orientation, and locale/text-scale setting.
- Any check a simulator/emulator cannot fully reproduce that was skipped
  or caveated — e.g. some permission-prompt flows, haptics, certain
  sensor-driven behavior, and some assistive-technology
  timing/announcement behavior differ from a physical device. State these
  explicitly rather than reporting a simulator-only check as equivalent to
  a device-verified one.
