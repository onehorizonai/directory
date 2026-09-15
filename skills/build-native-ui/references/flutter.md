# Flutter engineering

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
building approved UI in an existing **Flutter** app.

**Design rule:** follow current official HIG for the **ship OS** — do not
invent a Flutter-only visual language that fights the OS. Fetch Material
(Android), Apple HIG (iOS), or the matching desktop HIG. Prefer
`ThemeData` / `CupertinoTheme` / adaptive widgets already used by the
app (`Switch.adaptive`, platform-aware pages). Material on iOS or
Cupertino on Android only when the product already committed to that.

## Architecture (UI / Logic / Data)

Enforce separation of concerns; match the repo’s DI and state stack.

| Layer | Responsibility |
| --- | --- |
| **UI** | Lean widgets; layout, animation, routing hooks only |
| **ViewModel** | UI state + user intents; `ChangeNotifier` / `Listenable` (or existing Bloc/Riverpod/etc.) |
| **Repository** | Single source of truth; maps services → domain models; cache/retry |
| **Service** | Stateless API / DB / plugin wrappers |
| **Use case** | Optional — only when logic is heavy or shared across VMs |

Feature-first UI (`ui/features/...`), type-grouped data
(`data/services`, `data/repositories`). Inject repositories into
ViewModels; Views listen via `ListenableBuilder` / project equivalents —
no data fetching inside `build` beyond listening.

Immutable domain models (`freezed` / peers). Expose loading/error/content
explicitly; don’t leave half-updated UI state.

## State management

- Prefer the **existing** approach (Provider, Riverpod, Bloc, MobX) —
  don’t introduce a second stack for one screen.
- Ephemeral UI (expansion, tab index): local `StatefulWidget` /
  `ValueNotifier` when it doesn’t belong in a VM.
- Survive process death only where the approval requires it (and where
  the platform stack already does).
- Side effects (navigate, snackbars): one-shot events, not sticky state,
  when peers use that pattern.

## Layout and constraints

**Constraints go down. Sizes go up. Parent sets position.**

| Symptom | Typical fix |
| --- | --- |
| Vertical viewport unbounded height | `Expanded` / `SizedBox` around `ListView` in `Column` |
| `InputDecorator` unbounded width | `Expanded` / `Flexible` around `TextField` in `Row` |
| `RenderFlex overflowed` | `Expanded` / `Flexible` / ellipsis / wrap |
| Incorrect `ParentDataWidget` | `Expanded` only under `Flex`; `Positioned` only under `Stack` |
| Cascading “RenderBox was not laid out” | Fix the **first** constraint error above it |

- Prefer `Expanded` / `Flexible` over fixed pixel stacks for flexible
  regions.
- Long lists: `ListView.builder` / `GridView.builder` — never unbounded
  eager children for large data.
- Forms / readable columns on large widths: `Center` +
  `ConstrainedBox(maxWidth: …)`.

## Responsive / adaptive

- Decide from **window space**, not device marketing names: use
  `LayoutBuilder` (`constraints.maxWidth`) or `MediaQuery.sizeOf`.
- Do **not** switch top-level layout on `OrientationBuilder` /
  `MediaQuery.orientationOf` alone — orientation ≠ available space
  (foldables, desktop resize, split-screen).
- Do not lock orientation unless product requires it (hurts foldables);
  if locked, beware compatibility-mode size bugs.
- Support keyboard / pointer where the target includes tablet/desktop.
- Navigation shell: bottom bar on narrow, rail/sidebar on wide — match
  the approval and the ship-OS HIG.

## Routing

Prefer the app’s router. When using **go_router**:

- `MaterialApp.router` / `CupertinoApp.router` + top-level `GoRouter`.
- `context.go` vs `context.push` deliberately; path params typed at
  boundaries.
- Tabs: `StatefulShellRoute.indexedStack` so branches keep state.
- Deep links: Android App Links + assetlinks; iOS associated domains +
  AASA; don’t fight `FlutterDeepLinkingEnabled` vs third-party plugins.

## Theming (engineering)

- Colors / type / shapes from `Theme.of(context)` — no one-off hex in
  feature widgets unless matching an existing token.
- Dark mode and dynamic color: follow existing `ThemeMode` /
  platform brightness wiring.
- Prefer platform-adaptive controls when the design target is native
  feel; don’t force Material 3 shapes onto an iOS Cupertino app (or the
  reverse) without an explicit decision.

## Accessibility implementation

- Semantics: `Semantics` / `ExcludeSemantics`; meaningful labels on
  icon-only controls; merge where rows should read as one.
- Touch targets ~48dp logical; large text via system text scaler —
  layouts must not clip at 200% font scale.
- Focus / traversal for keyboard and screen readers.
- Respect `MediaQuery.disableAnimationsOf` / reduced motion.
- Verify with **TalkBack** (Android) and **VoiceOver** (iOS) — not
  screenshots alone.

## Animations

- Prefer implicit animations (`AnimatedContainer`, `AnimatedOpacity`) for
  simple transitions; explicit `AnimationController` when peers do.
- Route transitions: use platform / existing `Page` builders — don’t
  invent web-like fades that fight iOS/Android back physics.
- Dispose controllers; avoid infinite animations that break
  `pumpAndSettle` in tests.

## Localization

- Standard stack: `flutter_localizations` + `intl`, `generate: true`,
  `l10n.yaml`, ARB files → `AppLocalizations`.
- No hardcoded user-facing strings in widgets.
- Plurals / placeholders in ARB; dates/numbers via `intl`.
- RTL: rely on Flutter directionality; mirror custom painters/paddings.

## Native API interoperability

- Prefer mature plugins already in the app; don’t add a parallel plugin
  for the same capability.
- Platform channels / FFI: keep method names versioned; never block the
  UI isolate on heavy native work — use compute/isolates or native
  background APIs as peers do.
- Permissions at point of use; match Android/iOS manifests and Info.plist
  already present.
- Deep platform UI (share sheets, biometric prompts): use plugins that
  call **system** UI rather than reimplementing chrome in Flutter.

## Testing and TDD

**Red–green–refactor** for ViewModels / repositories first, then widgets.

### Widget tests (`flutter_test`)

- `testWidgets` + `tester.pumpWidget` (wrap `MaterialApp` /
  `Directionality` as needed).
- Finders + matchers; `tap` / `enterText` / `drag` then `pump` or
  `pumpAndSettle`.
- Keys on critical controls for stable finders.
- Goldens only when the module already uses them.

### Integration tests (`integration_test`)

- `IntegrationTestWidgetsFlutterBinding.ensureInitialized()`.
- `integration_test/` + optional `flutter drive` driver script.
- Scroll lazily built lists into view before interacting.
- Run on target OS/emulator; Firebase Test Lab when peers do.

### Unit

- ViewModel and repository tests with fakes; keep widgets free of
  hard-wired I/O so tests stay fast.

## Verification checklist

- [ ] Layers respected; no API calls buried in `build`
- [ ] Constraint errors fixed at source; builders for long lists
- [ ] Breakpoints from width/constraints, not phone/tablet flags
- [ ] Theme tokens used; platform design ref followed for ship OS
- [ ] Semantics + large text + TalkBack/VoiceOver
- [ ] l10n for new strings; RTL spot-check if supported
- [ ] Widget/VM tests green; integration coverage or **not run**

## Anti-patterns

- Mixing UI, networking, and persistence in one widget class
- Introducing a new state library beside an established one
- `MediaQuery.orientationOf` for major layout branching
- Locking orientation “to simplify layout”
- Eager `ListView(children: …)` for large/unknown lists
- Hardcoded colors/strings bypassing theme and l10n
- Custom Material chrome on iOS (or Cupertino on Android) against the
  ship-OS HIG
- Infinite animations / unsettled tickers breaking tests
- Platform channels without validation or main-thread offload
- Skipping screen-reader checks because “Flutter semantics look fine”
