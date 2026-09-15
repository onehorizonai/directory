# Desktop — Windows

On-demand platform guidance for [../SKILL.md](../SKILL.md). Load when the
design target is **Windows desktop** (Fluent / WinUI design language).
Apply after [ui-reasoning.md](ui-reasoning.md) — this file is OS chrome,
not the starting model.

Design only: look, behavior, and conventions. Do not specify XAML, MVVM,
packaging, or SDK setup.

## Official sources

- [Windows app design](https://learn.microsoft.com/windows/apps/design/)
- [Navigation basics](https://learn.microsoft.com/windows/apps/design/basics/navigation-basics)
- [Title bar design](https://learn.microsoft.com/windows/apps/design/basics/titlebar-design)
- [Responsive design](https://learn.microsoft.com/windows/apps/design/layout/responsive-design)
- [Mica](https://learn.microsoft.com/windows/apps/design/style/mica) · [Acrylic](https://learn.microsoft.com/windows/apps/design/style/acrylic)
- [Typography](https://learn.microsoft.com/windows/apps/design/signature-experiences/typography) · [Iconography](https://learn.microsoft.com/windows/apps/design/signature-experiences/iconography)
- [Accessibility](https://learn.microsoft.com/windows/apps/design/accessibility/accessibility) · [Keyboard](https://learn.microsoft.com/windows/apps/design/accessibility/keyboard-accessibility)
- [Motion](https://learn.microsoft.com/windows/apps/design/motion/)
- [WinUI Gallery](https://github.com/microsoft/WinUI-Gallery) (control and shell examples)

## Design intent

Windows desktop apps follow **Fluent**: clear hierarchy, theme-aware
surfaces, and a shell that still feels like Windows when resized from
wide desktop to narrow / snap / phone-width.

Prefer stock control chrome and navigation over bespoke panels. Support
**light, dark, and high contrast** by default. Design for mouse, touch,
pen, and keyboard with equal reach to core actions.

## Shell and navigation

| Need | Prefer |
|------|--------|
| Several stable top-level destinations | Left `NavigationView`-style pane |
| Few peer destinations + ample width | Top navigation |
| Shallow, document-first work | Single-page / document canvas, minimal chrome |
| Narrow / phone width | Overlay or minimal pane; toggle to open; close after navigate; content gets the width |

Keep primary destinations **few and stable**. Do not dump every command
into the nav pane — commands belong in command bars, menus, or page
tooling.

**Back** should match platform expectation when hierarchy exists. Search
in the shell stays consistent across pages when the app is search-led.

## Title bar and windowing

- Title bar is **functional chrome first**, branding second.
- Non-interactive regions remain draggable; caption buttons stay clear.
- Blend title-bar visuals with the app surface when customizing; respect
  light / dark / high contrast.
- Start with **one main window**. Add secondary windows only when the
  workflow needs detachment (documents, inspectors, tools).
- Multi-window must feel intentional, not accidental duplication.

## Layout and controls

**Prefer platform controls for common jobs:** text/number fields, combo
boxes, lists/grids, tabs, content dialogs, info bars, teaching tips,
command bars.

**Command surfaces:** Group document, formatting, view, and page actions
in a native command bar (with overflow for secondary actions) before
inventing custom button rows.

**Adaptive layout (responsive design techniques):**

- Reposition, resize, reflow, show/hide — plan **wide / medium / narrow**
  explicitly.
- Smallest supported width must be fully usable (single column, reduced
  padding, simplified controls).
- Add density and multi-column only when width allows.
- As width shrinks, drop or relocate secondary controls; do not squeeze
  a desktop canvas into a phone strip.
- Horizontal “shelves” need a phone-width stacked alternative — do not
  rely on clipped rails everywhere.

**Scroll ownership:** Decide which region scrolls vertically vs which
owns a horizontal shelf. Nested scroll conflicts create broken layouts.

**Surfaces:** Prefer system card / layer fills over “border around cards.”
Remove redundant outer frames when spacing and headers already group
content.

**Search / filter:** One live search field for local/cheap filtering;
explicit Apply only when the operation is expensive or remote.

**Feedback:**

| Situation | Pattern |
|-----------|---------|
| Modal decision | Content dialog |
| Persistent status | Info bar |
| Contextual onboarding | Teaching tip |
| Transient confirmation | Light dismiss / toast-style feedback |

## Visual language (Fluent)

- **Theme resources** and system brushes — never hard-coded light-only
  colors. Design light and dark together; test contrast and control
  states in each (do not invert a light palette).
- **Mica** on long-lived base layers (main window, title region).
- **Acrylic** on transient light-dismiss surfaces (flyouts, menus).
- Segoe UI Variable (or platform default) for hierarchy via type, not
  extra boxes.
- Fluent icons with consistent weight; avoid mixing unrelated icon sets.
- Metadata tags: quiet rounded rectangles — not bright oval pill clusters
  by default.

## Motion

- Motion clarifies hierarchy, continuity, and state — short and purposeful.
- Prefer platform transitions / connected animation when there is a real
  source → destination relationship.
- Do not delay interaction or hide focus/selection with decoration.

## Accessibility, input, localization

- Every meaningful control has an accessible name; icon-only actions need
  names and tooltips.
- Full keyboard path for the main workflow; visible focus; logical tab
  order; no traps.
- High-contrast-safe visuals; respect text scaling.
- Layouts tolerate string growth and RTL.
- Touch targets usable alongside mouse density.

## Anti-patterns

- Custom chrome that replaces NavigationView / command bar without a
  strong product reason.
- Nav pane as a branded hero with taglines and non-navigation clutter.
- Title bar that breaks dragging or caption clarity.
- Hard-coded colors that fail dark or high contrast.
- Acrylic everywhere (or Mica on fleeting flyouts).
- Dense desktop-only layouts that ignore narrow snap layouts.
- Nested scroll regions with undefined ownership.
- Double-card nesting (section border wrapping child cards).
- Decorative motion that blocks input or obscures focus.
- Icon-only actions without accessible names.

## Verification checklist

- [ ] Navigation model matches destination count and width plan.
- [ ] Narrow / phone-width shell behavior is intentional (overlay, not
  permanent desktop pane).
- [ ] Title bar still behaves like a Windows title bar.
- [ ] Primary actions live in command bar / menus — not only buried in
  nav.
- [ ] Light, dark, and high contrast all look correct.
- [ ] Materials match surface lifetime (Mica vs Acrylic vs solid).
- [ ] Breakpoints defined: when columns stack, when chrome simplifies.
- [ ] Scroll ownership clear for page vs shelves.
- [ ] Keyboard-only user can complete the core task; Narrator has names.
- [ ] Motion is purposeful and does not hide focus or delay work.
- [ ] No redundant outer borders; icons/type consistent with Fluent.
