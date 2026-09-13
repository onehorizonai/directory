# Design and verification checklist

On-demand detail for [../SKILL.md](../SKILL.md). Load this when the change
is substantial enough to warrant the fuller design model, or when running
platform verification. Skip it for small, self-contained changes where the
inline procedure already covers the risk.

## Design-modeling checklist

Work through these before implementing, in addition to the primary
objects/actions/concepts model in the main skill:

- Actors/roles and permissions: who can see or act on this, and does that
  vary by role or entitlement?
- Prioritized use cases and entry points: which use case is primary, and
  how does a user actually arrive at this screen/state?
- Object relationships and lifecycle states: what states can the primary
  object be in, and what triggers a transition between them?
- State-specific actions: which actions are available in which state, and
  which are hidden or disabled?
- Action frequency, importance, consequence, and reversibility: is this
  action common or rare, low-stakes or destructive, easily undone or not?
  Let that drive prominence, confirmation, and undo affordances.
- Information needed for decisions: what does the user need to see before
  taking an action, and is it visible at the point of decision?
- Happy path and recovery paths: what does success look like, and what
  does the user see and do when something fails?
- State that must survive interruption: what has to persist through
  backgrounding, rotation, low connectivity, or relaunch?
- 0/1/some/many cases: empty state, single item, a typical list, and a
  very long list — does the layout and copy hold up in all four?
- Context that should remain visible: what does the user need to keep
  seeing while acting (e.g. the item being edited, a running total)?
- The observable success condition for each primary use case: what
  concrete, checkable thing confirms the use case succeeded?

## Per-platform verification checklist

### iOS / SwiftUI

- State ownership and bindings use the supported mechanism
  (`@State`/`@Binding`/`@Observable`/etc.) matching how the rest of the app
  manages equivalent state.
- View identity and navigation intent are preserved (no unintended
  resets/animations from identity changes).
- System presentation is used where appropriate (sheets, alerts,
  `NavigationStack`) rather than a custom re-implementation.
- Dynamic Type: layout holds up at larger accessibility text sizes.
- VoiceOver: elements have correct labels/traits, and reading order
  matches visual order.
- Newer APIs are availability-gated against the declared minimum OS.
- Any performance concern is profiled before an architectural change is
  made to address it — not fixed speculatively.

### Android / Compose

- State is hoisted to the appropriate level, matching the app's existing
  state-hoisting pattern.
- Persistence choice (in-memory, `SavedStateHandle`, database, etc.)
  matches the state's required lifetime.
- Effects (`LaunchedEffect`, `DisposableEffect`) are bound to the correct
  lifecycle/key so they don't leak or re-run unexpectedly.
- Navigation and layout adapt to the available window size and insets
  (multi-window, foldables, system bars).
- Semantics are verified with TalkBack, and touch/input targets meet the
  platform's minimum size.
- Permissions are requested in context, at the point of use, not
  up front.

### Desktop (including Electron / web-rendered)

- Resizing and windowing behave correctly across a reasonable range of
  window sizes, not just the default.
- Precision-pointer interactions (hover, right-click, drag) work as
  expected.
- Keyboard shortcuts, menus, and focus order follow platform convention.
- The app behaves correctly across multiple displays (moving/resizing
  across a display boundary).
- Screen readers / platform accessibility APIs (UI Automation on Windows,
  VoiceOver on macOS) can reach and describe the changed UI.
- For Electron or other web-rendered desktop targets, run both sets of
  checks: standard web checks (DOM semantics, responsive layout, browser
  devtools accessibility audit) and desktop-shell integration checks
  (native menu, window controls, OS-level shortcuts, file-system/IPC
  behavior) — neither alone is sufficient.
