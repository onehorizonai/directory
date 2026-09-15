# Android / Jetpack Compose engineering

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
building approved UI in an existing **Kotlin + Jetpack Compose** app.

For Material / visual HIG decisions, fetch current Material 3 / Android
design guidance rather than recalling it from memory.
Prefer the app's existing Material 3 theme tokens over inventing a
parallel palette.

## Prefer native Compose

- Prefer Material 3 components (`Scaffold`, `TopAppBar`,
  `NavigationBar` / rail / drawer, `Dialog`, sheets, lists) matching
  peers.
- Prefer Compose Navigation over hand-rolled back stacks.
- Prefer ViewModel + coroutines patterns already in the module; do not
  introduce a new architecture for one screen.
- Units are **dp** / **sp** — never mix CSS px or iOS points.

## State ownership and hoisting

**Hoist state** to the lowest common owner that needs to read or write
it. Stateless composables take values + lambdas; stateful wrappers own
`remember` / ViewModel.

| Lifetime | Mechanism |
| --- | --- |
| Ephemeral UI (expanded, text field while typing) | `remember { mutableStateOf }` |
| Survive rotation / process death for UI | `rememberSaveable` and/or `SavedStateHandle` |
| Screen / business state | `ViewModel` (`viewModel()` / Hilt as peers do) |
| Shared app state | existing DI graph / data store — not a new singleton |

Rules:

- Prefer immutable UI state types exposed from ViewModel (`StateFlow` /
  `compose` `collectAsStateWithLifecycle`).
- Do not hold Context / View / LifecycleOwner in a ViewModel.
- Unstable lambdas causing recomposition: `remember(keys) { { … } }` or
  hoist method references.
- Derived values: compute or `derivedStateOf`, do not duplicate source
  of truth.

## Side effects and coroutines

- `LaunchedEffect(key)` for suspend work tied to composition entry /
  key change.
- `DisposableEffect` for listeners / callbacks that must unregister.
- `rememberCoroutineScope` for event-driven launches (clicks), not for
  work that should cancel when leaving composition — use
  `LaunchedEffect` / ViewModel `viewModelScope` instead.
- Cancel and idempotency: treat recomposition and config change as
  normal; no duplicate POSTs on rotation.
- Prefer structured concurrency in ViewModel; expose UI events once
  (SharedFlow / Channel) when the app already uses that pattern.

## Navigation implementation

- Prefer **type-safe routes** (Serialization + Navigation Compose
  typed APIs) when the project is on them; otherwise match existing
  route strings/args.
- `NavHost` + single `NavController` at the shell; screens receive
  lambdas (`onBack`, `onOpenDetail`) rather than reaching for a global
  controller when peers are testable that way.
- Bottom nav / rail: `popUpTo(start) { saveState = true }`,
  `launchSingleTop`, `restoreState` to avoid stacked duplicates.
- Deep links and back: verify system back and predictive back against
  the approved flow; do not change the nav graph topology without an
  explicit decision.
- Pass Scaffold `paddingValues` into content; respect WindowInsets /
  IME.

## Lists and performance

- Long lists: `LazyColumn` / `LazyRow` / grids with **stable `key`**.
- Prefer `items(count) { }` / keyed `items` over index-only identity.
- Prefer `Modifier` stability; avoid allocating heavy objects in
  `@Composable` without `remember`.
- Images: use the app’s image loader (Coil, etc.) with size constraints;
  don’t decode full-res bitmaps on the UI path.
- Prefer `PullToRefreshBox` / M3 swipe patterns already in the catalog
  over custom gesture stacks.

## Theming wiring (engineering)

- Read colors/typography/shapes from `MaterialTheme` — not hard-coded
  hex in feature UI.
- Dynamic color (Android 12+): follow the app’s existing
  `dynamicDark/LightColorScheme` branch; do not fork a second theme.
- Dark mode and contrast come from the theme; verify both appearances.

## Accessibility implementation

- Interactive elements: meaningful `contentDescription` (or null for
  decorative / redundant with visible text).
- Minimum **48.dp** touch targets (`Modifier.sizeIn` / padding).
- Semantics: `semantics { }` / `mergeDescendants` for grouped rows;
  custom actions when gestures are non-obvious.
- Font scale: layouts must work at large system font sizes; prefer
  `sp` for text.
- Verify with **TalkBack** and Accessibility Scanner — not screenshots
  alone.

## Localization

- String resources (`stringResource`, plurals, quantity); no hardcoded
  user-facing English in composables.
- Dates/numbers via Android formatters / ICU; layout direction from
  `LocalLayoutDirection`; leave room for long translations.

## Adaptive layout

- Use `WindowSizeClass` / existing adaptive helpers for phone / tablet /
  foldable — match module peers (`ListDetailPaneScaffold`, etc.).
- Handle fold posture and multi-window insets when the approval
  includes large screens.
- Do not assume a single phone width.

## Testing and TDD

Prefer the module’s JVM + instrumentation stack (typically JUnit,
Turbine, Compose UI Test, Espresso as already used).

**Red–green–refactor** for ViewModel and use-cases:

1. Write failing tests for state transitions (loading → content /
   error, selection survive process death if required).
2. Implement in ViewModel / repository fakes.
3. Compose UI tests for critical interactions (click, scroll, TalkBack
   semantics) when peers test UI that way.

**Composable testability:** hoisted state + lambdas let you drive UI
without spinning the real ViewModel when that is the local pattern.

**Previews:** `@Preview` light/dark, font scale, and locale when
useful; use preview parameter providers / fake repos — no live
network.

## Verification checklist

- [ ] State lifetime matches requirement (remember vs saveable vs VM)
- [ ] Effects keyed correctly; no leaks in `DisposableEffect`
- [ ] Navigation back / deep link / config change preserve required
      state (selection, scroll) as approved
- [ ] Lazy keys stable; no janky full-tree recomposition on trivial
      edits
- [ ] TalkBack labels + 48.dp targets; large font scale
- [ ] Light/dark and dynamic color path still coherent
- [ ] Unit tests for VM; UI/semantics tests or explicit **not run**

## Anti-patterns

- Business logic inside composables that peers keep in ViewModel
- `remember` for state that must survive process death
- Holding Lifecycle/Context in ViewModel
- Stringly-typed navigation when the app already uses typed routes
  (or inventing typed routes in a stringly codebase without a decision)
- `Column` of thousands of children instead of `LazyColumn`
- Custom gesture-only controls without semantics
- Hard-coded colors bypassing `MaterialTheme`
- Requesting all permissions on first launch instead of point-of-use
