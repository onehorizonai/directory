# SwiftUI engineering

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
building or verifying SwiftUI UI on iOS, iPadOS, macOS, or as a shared
base for watchOS. This file covers **how to engineer** — structure, state,
concurrency, navigation implementation, testing, accessibility wiring,
performance, lifecycle, and API currency.

For visual / HIG conventions (chrome, typography, spacing, control
affordance), fetch current official platform design guidance for the
**target OS** rather than recalling it from memory:

- iPhone / iOS → Apple HIG for iOS
- Mac → Apple HIG for macOS
- Apple Watch → Apple HIG for watchOS (never iPhone HIG)

Platform deltas: [ios.md](ios.md), [macos.md](macos.md),
[watchos.md](watchos.md) (Watch-specific APIs — load in addition to this
file; do not assume iOS SwiftUI is enough for watchOS).

## Prefer native SwiftUI

- Prefer SwiftUI APIs over UIKit/AppKit bridging unless the feature is
  unavailable or the app already owns a representable for that surface.
- Prefer system controls (`Button`, `Toggle`, `NavigationStack`, sheets,
  toolbars) over gesture-only custom chrome.
- Match the app’s existing architecture; do not invent a second pattern
  for one screen. Separate business logic from views for testability
  without mandating MVVM/VIPER.

## Modern APIs (prefer these)

Hard-deprecated or long-replaced — **always** use the modern form in new
code and when you touch the call site:

| Prefer | Avoid |
| --- | --- |
| `NavigationStack` / `NavigationSplitView` | `NavigationView` |
| `navigationTitle` + `toolbar` | `navigationBarTitle` / `navigationBarItems` |
| `foregroundStyle` | `foregroundColor` |
| `ignoresSafeArea` | `edgesIgnoringSafeArea` |
| `tint` | `accentColor` |
| `confirmationDialog` / modern `.alert` | `ActionSheet` / `Alert` types |
| Dedicated a11y modifiers | Generic `.accessibility(label:)` |
| `@Entry` for custom environment | Manual `EnvironmentKey` boilerplate |
| `Button` for taps | `onTapGesture` (unless location/count needed) |
| `animation(_:value:)` | `animation(_:)` without `value` |
| `dismiss` / `isPresented` env | `PresentationMode` |

iOS 17+ / aligned: prefer `@Observable` + `@State` / `@Bindable` over
`ObservableObject` + `@StateObject` / `@ObservedObject`. Prefer
`onChange(of:) { }` / old+new overloads over `onChange(of:perform:)`.

iOS 18+: prefer `Tab { }` over `.tabItem`; `toolbarVisibility` over
`navigationBarHidden`; `#Preview` + `@Previewable` when deployment
allows.

Gate version-specific APIs with `#available` and a real fallback. Soft-
deprecated APIs (still compile, placeholder deprecation version): do
**not** introduce them in new code; when editing a view that already
uses one, leave it alone unless the approved scope is migration.

## State and data flow

Treat each `View` type as an invalidation boundary — pass only what that
subtree reads.

| Situation | Choice |
| --- | --- |
| View-owned value | `@State private` |
| Child must write parent state | `@Binding` |
| Read-only from parent | `let` |
| Owned `@Observable` model | `@State private var model = …` (not bare `let`) |
| Injected `@Observable` needing bindings | `@Bindable` |
| Legacy owned / injected `ObservableObject` | `@StateObject` / `@ObservedObject` |

Rules that prevent silent bugs:

- Mark `@State`, `@StateObject`, and `@FocusState` `private`.
- Do not store changing parent-owned inputs as `@State` — they seed once
  and ignore later parent updates.
- Prefer KeyPath/subscript bindings over `Binding(get:set:)` closures.
- Declare reactive bindings as `@Binding`, not `let x: Binding<T>`
  (untracked; often Release-only failures).
- Inside `@Observable` classes, mark property-wrapper storage
  (`@AppStorage`, `@SceneStorage`, `@Query`, …) with
  `@ObservationIgnored`.
- Prefer `Equatable` types for frequently written `@Observable`
  properties so redundant writes skip invalidation.
- Observation tracks whole stored properties: avoid rows that read
  `model.items[index]`; pass the element or the fields the row needs.
- Never put closures in custom `@Entry` / focused-value keys; keep
  defaults stable (no `Model()` / `Date()` / `UUID()` inline defaults).
- Do not put high-frequency values (scroll offset, drag, timer ticks)
  in the environment — coarsen or use local/`@Observable` state.

## Concurrency and lifecycle

- Prefer `.task { }` / `.task(id:)` for view-scoped async work —
  cancellation when the view leaves the hierarchy is built in.
- Mark UI-facing `@Observable` models `@MainActor` unless the project
  already uses default MainActor isolation.
- Keep `body` pure: no network, sorting of large collections, or
  formatter allocation on every evaluation — move work to the model or
  cache via `onChange`.
- Closures that may run off-main (`Shape.path`, `visualEffect`,
  `Layout`, `onGeometryChange` transform) must be `Sendable`-safe —
  capture values, do not touch MainActor state directly.
- Define what survives navigation, sheet dismiss, backgrounding, and
  process death (`@SceneStorage` / persistence) explicitly for the
  change under build.

## Navigation and presentation (implementation)

- Prefer value-based `NavigationLink(value:)` +
  `navigationDestination(for:)` and `NavigationPath` for programmatic
  stacks.
- Prefer `.sheet(item:)` (and item-driven alerts /
  `confirmationDialog` when available) over boolean + optional pairs.
- Sheets own dismiss via `@Environment(\.dismiss)` — avoid callback
  prop-drilling for Cancel/Save.
- Multiple sheet kinds → one `Identifiable` enum + one `.sheet(item:)`.
- Use `NavigationSplitView` for sidebar/detail; configure column
  visibility/widths with the modern modifiers, not ad-hoc stacks.
- Prefer `inspector` for trailing supplementary panes where the
  deployment target allows (adapts to sheet on compact).

## Lists and identity

- Stable, unique, cheap ids that outlive edits — never `ForEach(….indices)`.
- Constant, unary row shape in `List` (single top-level container;
  branch inside). Avoid `AnyView` rows and inline `.filter` in
  `ForEach`.
- Prefer `LazyVStack` / `LazyHStack` / lazy grids for long collections
  inside scroll views.
- Empty: `ContentUnavailableView` (iOS 17+) when the app already uses it.

## Layout engineering (not visual HIG)

- Size from the proposed size / size classes / `ViewThatFits` /
  `AnyLayout` — never `UIScreen.main` or orientation booleans.
- Prefer `containerRelativeFrame` / `visualEffect` / gated
  `onGeometryChange` over nested `GeometryReader` preference thrash.
- Own static containers in the custom view; let the caller own lazy
  containers.
- Prefer `.frame(maxWidth: .infinity, alignment:)` over
  `HStack` + `Spacer` for single-child stretch.

## Accessibility implementation

- Prefer `Button` for activation (traits, focus, VoiceOver for free).
- Labels: dedicated modifiers; decorative images via
  `Image(decorative:)` or `accessibilityHidden(true)`.
- Group with `accessibilityElement(children: .combine / .ignore /
  .contain)`; custom controls via `accessibilityRepresentation` and
  `accessibilityAdjustableAction`.
- Dynamic Type: system text styles or
  `Font.custom(_:size:relativeTo:)`; scale spacing/icons with
  `@ScaledMetric`.
- Verify with VoiceOver / Accessibility Inspector — not visual
  inspection alone.

## Localization (engineering)

- Pass string literals to `LocalizedStringKey` APIs directly — do not
  wrap in `String(localized:)` inside `Text` (eager resolve).
- Model user-facing text on non-views as `LocalizedStringResource`.
- Prefer interpolation over concatenation; use formatters /
  `FormatStyle` for dates/numbers; leave room for longer strings and
  RTL.
- Packages/frameworks: pass `bundle: #bundle`.

## Architecture / separation of concerns

- Views orchestrate UI state; validation, networking, and persistence
  live in testable models/services.
- Action handlers reference methods, not multi-line closures in `body`.
- Previews and unit tests share the same mock seams (protocols /
  sample statics on models).

## Testing and TDD

Prefer the project’s existing XCTest / Swift Testing harness.

**Red–green–refactor** for behavior that lives outside `body`:

1. List concrete cases (happy path, empty, error, permission denied).
2. Fail a test against the model/service first.
3. Implement the smallest pass; refactor while green.

**What to unit-test:** `@Observable` / service logic, formatting,
validation, navigation path reducers, persistence mapping.

**What to exercise with previews / UI tests:** layout under Dynamic
Type, sheet/navigation wiring, VoiceOver labels for custom controls.

**Previews:** `#Preview` with self-contained samples; inject
`.environment(Model.preview)`; never hit live network. Use
`@Previewable` when deployment ≥ iOS 18; else a tiny wrapper view.

## Performance

- Update state only when the value actually changes (especially hot
  paths: scroll, gestures).
- Narrow inputs; extract subviews so invalidation stays local.
- Optional advanced: `Equatable` views + `.equatable()`, POD wrappers,
  per-item `@Observable` holders for list rows that otherwise share a
  broad collection dependency.
- Debug unexpected updates with `Self._logChanges()` /
  `_printChanges()` in DEBUG.
- Profile with Instruments before structural “optimizations.”

## Verification checklist

- [ ] State ownership matches peers; no parent input trapped in `@State`
- [ ] Navigation/presentation uses modern stack/sheet/item APIs
- [ ] `#available` + fallbacks for APIs above min OS
- [ ] Stable list identity; unary rows
- [ ] Dynamic Type + VoiceOver checked on simulator/device
- [ ] Interruption: background, dismiss, cancel/retry without duplicate
      requests
- [ ] Unit tests for non-view logic; preview coverage for key states
- [ ] Soft-deprecated APIs not newly introduced

## Anti-patterns

- Business rules inside `Button` closures or `body`
- Creating formatters / sorting large arrays inside `body`
- Boolean sheet flags synced with a separate optional model
- Passing entire config/context objects when a few fields suffice
- Closures in custom environment keys; unstable `@Entry` defaults
- `ForEach` over indices or ids derived from editable content
- Bridging to UIKit/AppKit for something SwiftUI already provides
- Shipping Liquid Glass / newest chrome APIs without an explicit product
  ask and availability plan
