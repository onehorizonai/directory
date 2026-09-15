# WinUI 3 / Windows App SDK engineering

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
building approved UI in an existing **WinUI 3 + Windows App SDK** (C#)
desktop app.

For Fluent / visual HIG decisions, fetch current Windows app design
guidance rather than recalling it from memory.
Prefer stock WinUI controls and system brushes over bespoke chrome.

## Prefer native WinUI

- Prefer built-in controls (`NavigationView`, `CommandBar`, `ListView` /
  `GridView`, `ContentDialog`, `InfoBar`, `TeachingTip`, form controls)
  before CommunityToolkit or custom controls.
- Prefer `CommandBar` for grouped page/window actions over ad-hoc
  `Grid`/`StackPanel` tool rows.
- Prefer `x:Bind` for strongly typed page/VM bindings; use `{Binding}`
  when the data context must stay dynamic.
- Match the solution’s packaging model (**packaged** vs **unpackaged**)
  — do not mix identity assumptions.

## App structure and MVVM

Typical maintainable split (adapt to peers, don’t force ceremony):

- `App.xaml` — resources, startup, exception handling
- `MainWindow` — shell, title bar, navigation host
- `Pages/` — views; `ViewModels/` — state/commands when the app already
  separates them; `Services/` — OS integration, persistence
- `Styles/` — shared resource dictionaries

MVVM engineering:

- ViewModels expose state + commands; views stay thin.
- Prefer CommunityToolkit.Mvvm (`ObservableObject`, `[RelayCommand]`,
  `[ObservableProperty]`) **when the project already uses it**.
- Async commands: cancel overlapping work; marshal UI updates to the
  UI thread (`DispatcherQueue`).
- Do not invent a second DI/MVVM stack for one page.

## Shell, navigation, windowing

- Default shell: `NavigationView` with a small stable destination set
  and platform back behavior.
- Narrow / phone-width: overlay or minimal pane, content-first —
  implement explicit visual states or size handlers, not a squeezed
  desktop pane.
- Title bar: keep drag regions and caption buttons correct when
  customizing; use Windows App SDK `AppWindow` APIs for modern
  windowing.
- Multi-window only when the workflow needs it; use AppWindow samples
  for placement/activation rather than custom abstractions.
- Frame navigation: centralize navigate/back in the shell; pass
  parameters explicitly; restore nav state if the app already does.

## Layout and collections (implementation)

- Effective pixels; responsive reposition / reflow / show-hide at
  documented breakpoints (wide / medium / phone-width).
- **Scroll ownership:** if the page scrolls vertically, do not nest a
  scroll-owning `GridView` for a horizontal shelf — use a horizontal
  `ScrollViewer` + `ItemsRepeater` / `ItemsControl` instead.
- Prefer virtualizing controls for long lists; keep item templates
  shallow.
- Avoid redundant outer `Border` “cards” around surfaces that already
  provide chrome.

## Async, lifecycle, and packaging

- Keep I/O and CPU off the UI thread; show progress with existing
  patterns (`ProgressRing`, `InfoBar`, disabled commands).
- App lifecycle / activation / restart: use Windows App SDK AppLifecycle
  APIs and samples — not ad-hoc mutex-only hacks unless peers do.
- Packaged: package identity and `ApplicationData` are available.
- Unpackaged: bootstrapper/runtime init required; **guard** APIs that
  need package identity; do not call packaged-only storage APIs blindly.
- Notifications: use the notifications samples/APIs matching push vs
  app notifications for the deployment model.

## Accessibility implementation

- AutomationProperties.Name / help text / landmarks for meaningful
  elements; icon-only controls must have accessible names.
- Full keyboard path for the primary workflow; visible focus; no traps.
- Verify Narrator (or UI Automation inspection) — not mouse-only QA.
- High contrast and text scaling must keep layout usable.
- Pointer, touch, pen, and keyboard parity for core actions where the
  platform expects it.

## Localization

- Put user-facing strings in resw / x:Uid resources; no hardcoded UI
  strings in XAML/code-behind for shipping surfaces.
- Layouts tolerate growth and RTL (`FlowDirection`) when the product
  localizes.

## Performance

- Measure before restructuring: WPR/WPA + XAML frame analysis for jank.
- Trim visual tree depth and template complexity; avoid layout thrash
  from circular size dependencies.
- Virtualize collections; defer non-critical startup work.

## Testing and TDD

Prefer the repo’s test stack (often xUnit/NUnit + MSTest, plus WinAppDriver
/ UI Automation if present).

**Red–green–refactor** for ViewModels and services:

1. Fail tests for state transitions, command enablement, and error
   paths.
2. Implement with fakes for file/network/activation.
3. Keep UI verification for chrome/navigation that unit tests cannot
   see.

**Build/run verification** (required for startup-sensitive edits):

1. Build the real project/platform (prefer explicit `x64` when AnyCPU
   is ambiguous).
2. Launch via the path that matches packaging (VS deploy vs unpackaged
   `.exe`).
3. Confirm an actual top-level window (title / responsive shell) — a
   process exit code alone is insufficient.
4. Report **not run** when no Windows host is available.

Debugging aids: Hot Reload, Live Visual Tree / Live Property Explorer
for layout; Event Viewer / debugger output for pre-window crashes.
Opaque `MSB3073` / XamlCompiler failures → simplify toward the known
template shape before inventing structure.

## Verification checklist

- [ ] Structure matches peers (shell vs page vs VM vs resources)
- [ ] Native controls/`CommandBar` used before custom chrome
- [ ] Navigation + narrow-width behavior verified at runtime
- [ ] Scroll ownership correct for mixed collection layouts
- [ ] Light, dark, high contrast; text scaling
- [ ] Keyboard-only primary flow; automation names present
- [ ] Packaging model respected in storage/activation code
- [ ] Build + real launch verified, or gaps listed as **not run**
- [ ] VM/service unit tests for non-trivial logic

## Anti-patterns

- Custom control library for standard WinUI affordances
- Hard-coded light-only brushes
- Nested scroll-owning grids inside page `ScrollViewer` “shelves”
- UI-thread network/disk in command handlers
- Packaged-only APIs on an unpackaged startup path
- Declaring success from `dotnet build` without a visible window when
  launch was in scope
- Multi-window and custom title bars without preserving drag/caption
  behavior
