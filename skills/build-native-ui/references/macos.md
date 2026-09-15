# macOS build deltas

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when the
target is **Mac (AppKit-hosted SwiftUI)**.

Shared SwiftUI engineering lives in [swiftui.md](swiftui.md) — load that
first.

When making UX / visual decisions, fetch current Apple HIG for macOS
rather than recalling chrome or windowing from memory.

## Scenes and windows

Prefer declarative SwiftUI scenes over manual `NSWindow` ownership:

| Scene | Use for |
| --- | --- |
| `WindowGroup` | Primary multi-instance windows (default choice) |
| `Window` | Singleton supplementary windows |
| `UtilityWindow` (macOS 15+) | Floating tools / inspectors that follow focus |
| `Settings` | Preferences (Cmd+,) — not a custom prefs window |
| `MenuBarExtra` | Menu-bar extras (prefer over raw `NSStatusItem`) |
| `DocumentGroup` | Document apps (File menu / multi-doc windows) |

Engineering notes:

- Gate macOS-only scenes with `#if os(macOS)` in multiplatform apps.
- Open windows with `@Environment(\.openWindow)` — brings existing
  instances forward by id/value.
- Open Settings with `SettingsLink` / `openSettings` (macOS 14+) rather
  than ad-hoc window code.
- `Window` as the *sole* scene quits on close; prefer `WindowGroup` for
  the main scene unless product requires quit-on-close.
- `UtilityWindow` receives `FocusedValues` from the key main window —
  wire selection via `@FocusedValue` / `@Entry`, not globals.

## Navigation and layout (desktop)

- Sidebar apps: `NavigationSplitView` with column widths and visibility.
- Peer panes (IDE-style): `HSplitView` / `VSplitView` — not a fake
  navigation split.
- Trailing inspectors: `inspector` + optional `InspectorCommands`.
- Prefer `Table` for multi-column data; use modern table style modifiers
  (avoid soft-deprecated bordered initializer flags).
- Commands and menus: publish selection through focused values so menu
  items enable/disable correctly.

## Focus, keyboard, and commands

- `@FocusState` is private; use `.defaultFocus` for initial focus (not
  racing `.onAppear` writes).
- `.focusable()` + `onKeyPress` / `onDeleteCommand` for non-text
  keyboard participation.
- Prefer `@Entry` focused values for document/selection commanded from
  the menu bar.

## Files, drag-drop, clipboard

- `fileImporter` / `fileExporter` / `fileMover` for panels; always
  `startAccessingSecurityScopedResource()` / stop on imported URLs.
- Prefer `Transferable` + `draggable` / `dropDestination` for cross-app
  drag; fall back to `NSItemProvider` only for legacy peers.
- Prefer `PasteButton` / `CopyButton` (macOS 15+) for clipboard UI over
  raw pasteboard prompts when possible.

## AppKit interop

- Prefer SwiftUI. Use `NSViewRepresentable` /
  `NSViewControllerRepresentable` only for true gaps.
- Coordinator for delegate callbacks; never set `frame`/`bounds` on
  SwiftUI-managed AppKit views.
- Hosting SwiftUI inside AppKit: `NSHostingController` /
  `NSHostingView` when the shell is still AppKit.

## Lifecycle and multi-window state

Define per change:

- What is per-window vs app-global (`@State` in the scene vs
  `.environment` / shared `@Observable`)
- Restoration of window frame / document / navigation when the system
  relaunches windows
- Behavior when the last window closes (stay running vs quit)

## Accessibility and verification (macOS)

- Full Keyboard Access and VoiceOver: tab order, focus rings, menu
  command parity with on-screen actions.
- Dynamic Type / larger text where text styles apply; respect Reduce
  Motion.
- Resize from narrow to ultra-wide; multiple displays if relevant.

Testing: unit-test models/services (see [swiftui.md](swiftui.md));
exercise window open/close, Settings, and focused-menu enablement in
manual or UI tests.

## Anti-patterns (macOS)

- Custom preferences window instead of `Settings`
- Manual status-item management when `MenuBarExtra` fits
- Using `NavigationSplitView` for equal peer panes (use split views)
- Ignoring security-scoped resource access on file-importer URLs
- Putting per-window UI state in a process-wide singleton without a
  product reason
