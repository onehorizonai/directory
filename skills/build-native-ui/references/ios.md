# iOS build deltas

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when the
target is **iPhone / iPad (iOS / iPadOS)** and the implementation is
SwiftUI (or UIKit only where the app already does).

Shared SwiftUI engineering (state, concurrency, navigation APIs, a11y
wiring, testing, performance, API currency) lives in
[swiftui.md](swiftui.md) — load that first.

When making UX / visual decisions, fetch current Apple HIG for iOS (and
iPadOS if the change is iPad-primary) rather than recalling spacing or
chrome from memory. This file is engineering.

**Apple Watch is not iOS:** for watchOS targets use [watchos.md](watchos.md)
and current watchOS HIG — do not apply this iOS delta file as the Watch UI
architecture.

## Declare and respect the target

- State min iOS, SwiftUI / SDK version, and whether the change ships on
  iPhone only, iPad, or both.
- Availability-gate every API above the deployment target; provide a
  fallback that still meets the approved behavior.
- Do not raise deployment target or migrate `NavigationView` → stack /
  UIKit → SwiftUI as part of this skill without an explicit prior
  decision.

## iOS-specific navigation and chrome

- Compact width: `NavigationSplitView` and `inspector` collapse to stack
  / sheet — design the code paths so selection and dismiss still work.
- Prefer system presentations: `.sheet`, `.fullScreenCover`,
  `.popover` with explicit
  `.presentationCompactAdaptation` when iPhone must keep popover
  behavior.
- Tab roots: prefer iOS 18+ `Tab` API when the deployment target allows;
  keep `.tabItem` only for older targets or existing peers.
- Safe areas, keyboard avoidance, and home-indicator insets are part of
  the layout contract — use SwiftUI safe-area APIs, not hard-coded
  offsets.
- Haptics: prefer declarative `sensoryFeedback(_:trigger:)` over
  imperative `UIFeedbackGenerator` in SwiftUI views.

## Lifecycle and interruption (mobile)

Define ownership for:

- Push / deep link entry while the screen is already presented
- Background → foreground (stale data, expired auth)
- Incoming call / multitasking size-class changes (especially iPad)
- Permission prompts (notifications, photos, location) at point of use,
  using the app’s existing permission helper — not a new one-off

Prefer `.task` for loads tied to appearance; cancel in-flight work on
disappear. Avoid duplicate network requests when `onAppear` fires again
after a sheet dismiss.

## UIKit interop (only when necessary)

- Prefer SwiftUI-native controls. Use `UIViewRepresentable` /
  `UIViewControllerRepresentable` only for gaps the app already bridges
  or that SwiftUI cannot express.
- When a binding drives UIKit presentation, use `@Binding` (tracked) so
  `updateUIView` runs on dismiss — plain `Binding` properties miss
  updates.
- Do not set frames on hosted UIKit views; SwiftUI owns layout.

## Accessibility and input (iOS)

- Verify Dynamic Type at accessibility sizes and VoiceOver reading order
  on a simulator or device.
- Minimum usable targets; Support Switch Control / Full Keyboard Access
  when the control is custom.
- Reduce Motion: avoid essential information that exists only in motion.

## Testing and verification (iOS)

Follow TDD for models/services per [swiftui.md](swiftui.md).

On-device / simulator checks specific to this change:

- [ ] Portrait and landscape (or the orientations the app supports)
- [ ] Sheet / fullScreen / navigation back stack identity preserved
- [ ] Dynamic Type xxxLarge; layout does not clip primary actions
- [ ] VoiceOver labels/traits for new controls
- [ ] Background/foreground and permission denial paths
- [ ] iPad multitasking / Stage Manager if the approval includes iPad

Report simulator-only vs device, and any assistive-tech gap as **not
run**.

## Anti-patterns (iOS)

- `UIScreen.main.bounds` for layout
- Assuming phone-only metrics on iPad (or ignoring compact split
  collapse)
- Boolean modal flags instead of item-driven sheets for model content
- Imperative UIKit haptics / generators inside SwiftUI button actions
  when `sensoryFeedback` is available
- New UIKit bridges for features SwiftUI already covers
