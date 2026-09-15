# Mobile — iOS

On-demand platform guidance for [../SKILL.md](../SKILL.md). Load when designing for **iPhone / iOS**. Apply after [ui-reasoning.md](ui-reasoning.md) — this file is OS chrome, not the starting model.

For iPad size classes, multitasking, and pointer, use [tablet-ipad.md](tablet-ipad.md).
For Apple Watch, use [wearable-apple.md](wearable-apple.md) — never treat Watch as a small iPhone.

## Official sources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [iOS / iPadOS design](https://developer.apple.com/design/human-interface-guidelines/designing-for-ios)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [Accessibility (HIG)](https://developer.apple.com/design/human-interface-guidelines/accessibility)

## Design principles

- **Clarity** — Content is legible; icons are precise; chrome stays quiet.
- **Deference** — UI helps people understand content without competing with it.
- **Depth** — Layers and motion convey hierarchy and navigation.

## Navigation

| Pattern | When to use |
| --- | --- |
| **Tab bar** | 3–5 peer top-level destinations; each tab owns its own stack |
| **Hierarchical (push)** | Drill into related content; back control + edge swipe return |
| **Modal sheet / full-screen cover** | Self-contained tasks (compose, filter, settings) that interrupt the flow |
| **Search** | System search field in the navigation area; scopes when useful |

**Rules**

- Keep tab destinations peer-level; do not bury primary destinations behind a single “More” catch-all unless the product truly has many top-level areas.
- Prefer large or inline navigation titles that match content importance.
- Edge-swipe back must remain available on push navigation.
- Badges on tabs only for actionable, time-sensitive counts — not decoration.

## Layout, safe areas, and chrome

- Respect the **safe area** (notch/Dynamic Island, home indicator, status bar). Do not pin primary controls into unsafe edges.
- Standard content inset ≈ **16 pt** horizontal; list rows often use ~12–16 pt vertical padding.
- Prefer semantic backgrounds: system / secondary / grouped — they adapt to light and dark.
- Use materials (blur) for floating bars and overlays so content remains readable underneath.
- Bottom bars and floating action areas must clear the home indicator.

## Typography and Dynamic Type

Use the **system text styles** (do not invent a parallel scale of fixed sizes):

| Style | Typical role |
| --- | --- |
| Large Title / Title / Title 2–3 | Screen and section headers |
| Headline / Body / Callout | Primary reading and actions |
| Subheadline / Footnote / Caption | Secondary and meta |

**Rules**

- All text must scale with **Dynamic Type**. Custom fonts must map to a text style.
- At accessibility sizes, stack horizontally paired content vertically instead of truncating.
- Prefer semantic label colors: primary, secondary, tertiary.

## Color and appearance

- Tint / accent for interactive emphasis; **red** for destructive actions.
- Support **Light and Dark** via semantic colors — never hardcode black/white for text or surfaces. Design both appearances together (desaturated dark tokens, not inverted light). Test contrast, pressed, focus, disabled, and scrims on the real background in each.
- Destructive and success states need more than color alone (icon + label).

## Icons (SF Symbols)

- Prefer **SF Symbols** over custom icons for system-familiar actions.
- Match weight and scale to adjacent text; use multicolor / hierarchical rendering when the symbol supports it.
- Every interactive symbol needs an accessibility label (or accompanying visible text).

## Touch targets and controls

- Minimum hit target **44×44 pt**.
- Primary actions: bordered-prominent; secondary: bordered or plain; destructive: destructive role.
- Prefer system control sizes (large for primary CTAs in forms and sheets).
- Menus and context menus for secondary actions; confirmation dialogs for destructive or irreversible choices.

## Sheets, dialogs, and alerts

| Component | Use for |
| --- | --- |
| **Sheet** (medium/large detents) | Inspect, edit, filter; keep drag indicator when multiple detents |
| **Full-screen cover** | Immersive or multi-step flows (onboarding, camera, compose) |
| **Confirmation dialog** | Short choice lists, especially destructive confirmations |
| **Alert** | Critical decisions that need focused attention |

**Rules**

- Sheets that edit data need a clear dismiss path (**Done** / **Cancel**); disable interactive dismiss when unsaved changes matter.
- Prefer sheets with their own navigation stack for multi-step modal tasks.
- Alerts are scarce — never for routine success.

## Toolbars and search

- Leading: edit / cancel; trailing: primary actions (add, filter, share).
- Bottom toolbar for contextual actions on the current screen’s content.
- Integrate **search** in the navigation chrome; show suggestions and scopes when they reduce friction.

## Interaction patterns

- Pull to refresh on scrollable lists when data is remote.
- Swipe actions on rows for archive/delete — always offer a non-gesture path too.
- Haptics: selection for pickers; impact for meaningful toggles; notification for success/failure — sparingly.
- Empty and error states use a clear title, short explanation, and one recovery action (system empty-content pattern).
- Loading: prefer inline progress or skeletons over blocking full-screen spinners.

## Accessibility

- Support VoiceOver: combine related elements; provide labels, values, and hints where needed.
- Do not rely on color alone; keep contrast sufficient in both appearances.
- Respect Reduce Motion: offer non-essential animation alternatives.
- Test at the largest Dynamic Type sizes and with Bold Text.

## Anti-patterns

- Android-style floating action button as the default primary pattern, or Material bottom sheets as the default modal.
- Tiny custom tap targets or custom back buttons that break edge-swipe.
- Fixed font sizes that ignore Dynamic Type.
- Hardcoded colors that break Dark Mode.
- Nested tab bars or deep modal stacks with no clear exit.
- Using alerts for non-critical feedback.

## Verification checklist

- [ ] Tab vs push vs sheet choice matches task scope
- [ ] Content and controls clear safe areas and home indicator
- [ ] Text uses system styles and scales with Dynamic Type
- [ ] Interactive controls ≥ 44×44 pt; SF Symbols labeled
- [ ] Light and Dark both readable with semantic colors
- [ ] Destructive actions require confirmation and non-color cues
- [ ] Empty, loading, and error states have clear next steps
- [ ] VoiceOver order and labels make sense on primary flows
