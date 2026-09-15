# Mobile — Android

On-demand platform guidance for [../SKILL.md](../SKILL.md). Load when designing for **Android phones**. Apply after [ui-reasoning.md](ui-reasoning.md) — this file is OS chrome, not the starting model.

Larger Android widths (tablet / foldable) share Material adaptive ideas below; keep phone navigation defaults unless the brief targets large screens.

## Official sources

- [Material Design 3](https://m3.material.io/)
- [Material 3 guidelines](https://m3.material.io/get-started)
- [Navigation](https://m3.material.io/components/navigation-bar/overview)
- [Accessibility](https://m3.material.io/foundations/accessible-design/overview)
- [Material Icons](https://fonts.google.com/icons)
- [Android design / large screens](https://developer.android.com/design)

## Design principles

- **Personalization** — Dynamic color (Material You) can reflect the user’s wallpaper on supported versions; brand themes should still map cleanly onto M3 roles.
- **Hierarchy through tone** — Surfaces, containers, and elevation (often tonal) express layering more than heavy drop shadows.
- **Predictable motion** — Shared axis / fade patterns for forward and back; keep transitions short and meaningful.

## Navigation

| Pattern | When to use |
| --- | --- |
| **Navigation bar** (bottom) | 3–5 top-level destinations on compact phones |
| **Navigation rail** | Medium width (large phone landscape, small tablet) |
| **Navigation drawer** (modal) | Many destinations or user/profile header entry points |
| **Permanent drawer** | Expanded / large-screen layouts |
| **Forward stack** | Detail flows; system **Back** returns predictably |

**Rules**

- Bottom destinations are peer top-level areas; reselecting a tab restores that destination’s state when expected.
- Use badges sparingly for counts that need attention.
- Modal flows (settings subtrees, checkout) should hide the bottom bar when they leave the main graph.
- System Back must never trap users in dead ends; confirm only when discarding destructive work.

## Layout, system bars, and spacing

- Respect **status bar**, **navigation bar / gesture inset**, and display cutouts. Content scrolls under translucent system bars only when intentionally edge-to-edge with scrims/contrast handled.
- Comfortable content padding ≈ **16 dp**; related items often **8–12 dp** apart.
- Scaffold structure: top app bar + content + optional bottom bar / FAB — insets apply to content, not double-padded chrome.
- Prefer **adaptive** grids (`compact` / `medium` / `expanded` width) over phone-only assumptions.

## Typography (Material type scale)

Use the M3 roles — do not invent a one-off size ladder:

| Role | Typical use |
| --- | --- |
| Display L/M/S | Hero numerals, marketing moments |
| Headline L/M/S | Screen-level emphasis |
| Title L/M/S | Top app bars, list headers, cards |
| Body L/M/S | Reading and supporting copy |
| Label L/M/S | Buttons, chips, navigation, badges |

**Rules**

- Scale with user font size / display size settings; avoid fixed px that ignore accessibility font scales.
- `onSurface` / `onSurfaceVariant` for primary vs secondary text.
- Keep line length readable; on larger widths, constrain measure rather than stretching sentences edge to edge.

## Color, shape, elevation

- Map UI to **M3 color roles**: primary / secondary / tertiary, containers, surface, error, outline.
  Design light and dark schemes together. Do not invert a light palette.
  Test contrast and state (pressed, focus, disabled, scrim) in both.
- Dynamic color when appropriate; provide a brand fallback scheme for older platforms or locked brand needs.
- Shapes: extra-small → extra-large per component (chips vs sheets vs dialogs) — stay consistent.
- Prefer **tonal elevation** on surfaces; reserve strong shadows for true floating elements (FAB, menus).

## Icons (Material)

- Prefer **Material Symbols / Icons** with consistent optical size and filled/outlined style within a screen.
- Navigation icons need selected/unselected treatments that meet contrast.
- Decorative icons: no content description; actionable icons: concise content description (or visible text).

## Touch targets and controls

- Minimum touch target **48×48 dp**.
- Button hierarchy: filled (primary) → tonal → outlined → text; FAB for the single most common create/primary action on a screen when appropriate.
- Lists: one primary tap target per row; trailing icon buttons still meet 48 dp.
- Swipe-to-dismiss / archive must also be available via explicit actions for accessibility.

## Sheets, dialogs, and menus

| Component | Use for |
| --- | --- |
| **Modal bottom sheet** | Alternative actions, pickers, short forms |
| **Standard bottom sheet** | Persistent supporting content anchored to the screen |
| **Dialog** | Focused decisions, confirmations, blocking errors |
| **Snackbar** | Brief feedback with optional single action (e.g. Undo) |
| **Menus** | Overflow and dense secondary actions |

**Rules**

- Destructive confirms use a dialog (or clear sheet actions) with labeled Cancel / Delete — not snackbars alone.
- Sheets need a drag handle when height is variable; keep actions above the system gesture area.
- Date/time pickers use platform Material pickers, not custom wheels that fight platform norms.

## Top app bars and search

- Small/center-aligned or medium/large app bars depending on scroll and hierarchy needs.
- Navigation icon: Up/Back or menu (opens drawer) — match the back stack.
- Actions in the top bar: 1–3 frequent actions + overflow.
- Search: Material search bar / search view patterns; expanding search should preserve a clear exit back to content.

## Interaction patterns

- Pull to refresh on primary lists when data is remote.
- Selection mode for bulk actions; show a contextual top bar while selecting.
- Empty / error / loading: illustrated or icon + short explanation + primary recovery action.
- Prefer skeletons or inline indicators over modal blocking loaders for content regions.
- Foldables (when in scope): avoid critical UI in hinge regions; consider dual-pane when unfolded.

## Accessibility

- Content descriptions for icon-only controls; merge related text for talkback focus when needed.
- Contrast: text and icons meet accessible contrast on surface roles (dynamic schemes included).
- Do not rely on color alone for state (error, selected, success).
- Respect reduced motion / animation scales when the system requests less motion.
- Keyboard / switch access on large screens: focus order follows reading order.

## Anti-patterns

- iOS-only patterns as defaults (large navigation titles without Material equivalent, SF Symbol metaphors, edge-swipe as the only back story).
- Touch targets under 48 dp or dense icon rows without spacing.
- Hardcoded light-only colors that ignore dynamic / dark schemes.
- Overusing dialogs for routine messages — prefer snackbars or inline text.
- Bottom navigation with more than five destinations or nested competing bottom bars.
- FAB plus competing primary buttons fighting for the same action.

## Verification checklist

- [ ] Compact navigation uses a bottom bar (or justified alternative); Back behavior is clear
- [ ] Content clears system bars / gesture insets
- [ ] Type roles follow M3; text scales with system font settings
- [ ] Color mapped to M3 roles; dark and dynamic variants remain legible
- [ ] Interactive targets ≥ 48×48 dp; Material icons labeled when icon-only
- [ ] Sheets/dialogs/snackbars match urgency of the message
- [ ] Empty, loading, and error states offer recovery
- [ ] TalkBack order and descriptions work on primary flows
