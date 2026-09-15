# watchOS engineering (SwiftUI)

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
building or verifying **Apple Watch / watchOS** UI.

Shared SwiftUI fundamentals still apply via [swiftui.md](swiftui.md), but
**do not assume** generic iOS SwiftUI covers watchOS — navigation,
lifecycle, widgets, energy, and input differ. For look/behavior, fetch
current watchOS HIG (not iPhone HIG). For companion iPhone UI, use
[ios.md](ios.md) — never let phone implementation dictate Watch UI
structure.

Prefer current Apple docs and sample patterns. Flag WatchKit / ClockKit-era
approaches as legacy.

## Official sources (prefer these)

- [watchOS apps](https://developer.apple.com/documentation/watchos-apps)
- [WidgetKit — accessory widgets & complications](https://developer.apple.com/documentation/widgetkit/creating-accessory-widgets-and-watch-complications)
- [Migrating ClockKit complications to WidgetKit](https://developer.apple.com/documentation/widgetkit/migrating-clockkit-complications)
- [Digital Crown](https://developer.apple.com/documentation/swiftui/view/digitalcrownrotation(_:from:through:by:sensitivity:iscontinuous:ishapticfeedbackenabled:))
- WWDC: complications in WidgetKit; Smart Stack widgets on Apple Watch

## App model

- Prefer **SwiftUI `App`** lifecycle (`@main`) for new apps.
- Support **independent** Watch apps when the product allows; do not
  require the iPhone for core glance/act loops unless the domain truly
  needs it.
- Use `WKApplicationDelegateAdaptor` / extension delegate only when you
  need background task hooks, not as the primary UI architecture.
- Keep the Watch target lean: small payloads, few screens, clear state.

## Navigation (watchOS 10+)

Prefer:

- `NavigationStack` for shallow hierarchy
- `TabView` with **`.tabViewStyle(.verticalPage)`** for top-level sections
- System sheets for focused tasks

Avoid:

- `NavigationSplitView` (not a watchOS pattern)
- Deep stacks and iOS-style tab bars / sidebars
- Custom navigation chrome that fights the status area and Crown

Back every Crown-driven scroll/page with touch equivalents.

## State, Observation, concurrency

- Prefer `@State` / `@Observable` (Observation) for UI-owned state;
  keep models small.
- Use `async`/`await` and structured concurrency; hop to MainActor for UI.
- Do not block the main thread (networking, HealthKit queries, file I/O).
- Persist with the lightest fit: `AppStorage` / App Group `UserDefaults`
  for tiny shared values; SwiftData/Core Data only when already in the
  app’s stack and justified on Watch storage/energy.

## Digital Crown

- Bind scrollable content to Crown via system scroll containers.
- For continuous/discrete values: `.focusable()` +
  `.digitalCrownRotation(...)` with appropriate range, step, sensitivity,
  and haptics.
- Update UI on each increment; do not debounce until gesture end.
- Never handle Crown **press** for app features (system-reserved).

## Haptics

- Use `WKInterfaceDevice` / SwiftUI sensory feedback APIs appropriate to
  the OS version for success/failure/milestone cues.
- Especially important for workouts when eyes are off-screen.
- Avoid haptic spam; pair with meaningful events.

## Complications & Smart Stack (WidgetKit)

**New work: WidgetKit only.** Keep ClockKit only for migrating old
complications / shared faces; plan WidgetKit migration.

Pattern:

1. Watch widget extension target
2. `TimelineProvider` → `TimelineEntry` → SwiftUI views
3. `.supportedFamilies` for accessory families you support
4. Reload via `WidgetCenter.shared.reloadTimelines(ofKind:)` (budgeted)

Smart Stack:

- Provide relevance (`TimelineEntryRelevance` / relevant intents) so the
  system can elevate timely widgets
- Prefer rectangular accessory content suited to stack cards

Deep links: complication/widget tap should route into the relevant screen
(`widgetURL` / app intents), not always root.

Share tiny state with the widget via **App Group** container when needed.
Do not rely on obsolete assumptions that
`transferCurrentComplicationUserInfo` alone refreshes WidgetKit timelines —
verify against current Apple guidance for your OS versions.

## Notifications

- Register categories and actions; keep Long Look actions few and useful.
- Short Look is system-controlled — write titles that stand alone.
- Prefer actionable notifications over “open the app to see.”

## Background execution & energy

- Background refresh is **budgeted** — schedule conservatively; complete
  tasks promptly (`setTaskCompletedWithSnapshot`).
- Use `WKExtendedRuntimeSession` only for allowed session types (workout,
  mindfulness, etc.).
- Prefer small background `URLSession` payloads; expect deferral.
- Minimize Always On work: reduce updates, drop animations, redact
  sensitive UI using luminance-reduced environment values.

## WatchConnectivity & companions

- Use WatchConnectivity when phone↔watch sync is required (settings,
  heavy history, auth handoff).
- Design so the Watch remains useful offline / independent when possible.
- Do not push large blobs constantly; sync deltas; respect transfer queues.
- iPhone app changes must not force Watch UI to mirror phone screens.

## HealthKit / workouts (when in scope)

- Request only needed types; explain purpose.
- Live workouts: `HKWorkoutSession` + live builder patterns; keep metrics
  UI cheap to update.
- Extended runtime for sustained tracking; handle interruption cleanly.
- Water Lock / swimming: follow system expectations for touch disable.

## Persistence & performance

- Prefer ephemeral UI state; persist what complications and next launch
  need.
- Avoid large images, heavy animations, and frequent timers.
- Profile on device; Watch CPU/GPU/battery budgets are tight.
- Use container-relative layout — no hard-coded phone pixel layouts.

## Accessibility

- Labels/values/hints on icon-only controls and gauges.
- Dynamic Type / Bold Text / Increase Contrast / Reduce Motion.
- Verify VoiceOver on hardware when possible.
- Complications: keep content meaningful when tinted / reduced.

## Previews, sizes, availability

- Preview multiple Watch size classes / devices in Xcode.
- Use `#available` / availability APIs for newer watchOS APIs; keep a
  fallback that still meets glanceability.
- Test Always On (luminance reduced), Crown scroll, and complication
  families on simulator **and** device when risk warrants.

## Testing / TDD

- Add watchOS unit (and UI) test bundles for the Watch target.
- Prefer tests for timeline entries, routing from complications, and
  state reducers over brittle full-UI snapshots alone.
- Red → green for new Watch behavior when a harness exists; otherwise
  verify on simulator/device and report gaps.
- Exercise: launch → primary action; complication deep link; Crown
  scroll; reduced luminance; Dynamic Type.

## Deprecated / avoid for new work

| Avoid | Prefer |
| --- | --- |
| New ClockKit complications | WidgetKit accessory families |
| Storyboard-centric WatchKit UI | SwiftUI |
| Deep iOS navigation clones | Vertical pages + shallow stack |
| Assuming phone-only companion apps | Independent Watch when feasible |
| Blocking main thread / busy Always On timers | Budgeted refresh + TimelineView |

## Verification checklist

- [ ] Engineering refs: this file + [swiftui.md](swiftui.md) as needed
- [ ] Design companion: `wearable-apple` (not `mobile-ios`) for Watch UX
- [ ] Crown scroll/value works with live feedback
- [ ] WidgetKit complications/Smart Stack update and deep-link correctly
- [ ] Always On path redacts/simplifies; energy-sensible
- [ ] Background tasks complete within budget
- [ ] Accessibility + Dynamic Type checked
- [ ] Multiple Watch sizes previewed/tested
- [ ] No new ClockKit / WatchKit-anti-patterns introduced
- [ ] Tests or explicit **not run** with reason
