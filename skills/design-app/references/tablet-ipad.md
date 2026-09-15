# Tablet — iPad

On-demand platform guidance for [../SKILL.md](../SKILL.md). Load when designing for **iPad / iPadOS**. Apply after [ui-reasoning.md](ui-reasoning.md) — this file is OS chrome, not the starting model.

Phone-first iOS patterns live in [mobile-ios.md](mobile-ios.md). Prefer this file whenever the canvas is regular-width, multitasking, or pointer-capable.

## Official sources

- [Designing for iPadOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-ipados)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Multitasking and layout (HIG)](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Pointing devices](https://developer.apple.com/design/human-interface-guidelines/pointing-devices)
- [SF Symbols](https://developer.apple.com/sf-symbols/)

## Design principles (iPad emphasis)

- **Use the canvas** — Prefer multi-column and persistent sidebars over phone-scale single-column stacks stretched wide.
- **Stay adaptive** — Layouts must work full screen, Split View, Slide Over, and Stage Manager window sizes.
- **Support pointer and keyboard** — Hover, dense toolbars, and shortcuts are first-class, not afterthoughts.

## Size classes and layout

| Width | Typical context | Layout expectation |
| --- | --- | --- |
| **Compact** | Slide Over, narrow split, some orientations | Phone-like: single column, tab bar OK |
| **Regular** | Full screen iPad, wide Split View | Sidebar / split columns, denser chrome |

**Rules**

- Drive structure from **horizontal size class**, not device name.
- In regular width, prefer **NavigationSplitView**-style patterns: sidebar → optional content list → detail.
- Grids gain columns in regular width; avoid a single stretched card column.
- Maintain readable measure for body text — do not force ultra-wide paragraphs.
- Content should reflow when the window resizes (Stage Manager / Split View), not assume a fixed iPad frame.

## Navigation

| Pattern | When to use |
| --- | --- |
| **Sidebar + detail** | Primary iPad information architecture for apps with sections or libraries |
| **Two- or three-column split** | List → sublist → detail (Mail, Files, Notes style) |
| **Tab bar** | Compact width, or few peer destinations when a sidebar would be empty chrome |
| **Inspector / trailing panel** | Contextual tools for the selected item without leaving the canvas |
| **Sheets** | Focused tasks; often narrower than phone full-bleed sheets |

**Rules**

- Selecting a sidebar item updates the detail pane; avoid pushing a whole new phone-style stack when a column can update in place.
- Provide an empty-detail state (“Select an item”) instead of a blank panel.
- Preserve selection across rotations and multitasking resizes when possible.
- Deep links should restore the visible column path, not only a phone stack.

## Multitasking and windows

- Design for **Split View** and **Slide Over**: critical controls must remain usable at roughly half and one-third widths.
- Avoid fixed multi-pane layouts that collapse into unusable slivers; degrade gracefully to one column.
- Support multiple windows when the task benefits (documents, comparisons).
- External display / Stage Manager: treat the scene as a resizable window, not a fixed tablet screenshot.

## Pointer, keyboard, and Apple Pencil

- Show **hover** affordances on clickable rows, buttons, and collection items.
- Increase information density slightly versus phone, but keep hit areas comfortable for touch (still aim for **44×44 pt** minimum).
- Expose common actions via **keyboard shortcuts** and a discoverable shortcut overlay where platform conventions expect it.
- Context menus on secondary click / long press for the same actions available elsewhere.
- Pencil: low-latency ink where drawing/annotation is core; do not require Pencil for essential tasks.

## Toolbars and chrome

- Prefer a **top toolbar / navigation bar** with titled panes; use trailing primary actions and leading sidebar toggles.
- Tab bars are secondary on regular-width iPad when a sidebar already expresses top-level structure.
- Search often lives in the sidebar or toolbar; large searchable libraries benefit from always-visible search.
- Place inspectors and format controls in trailing bars or popovers rather than covering the whole canvas.

## Typography, color, icons

- Same **Dynamic Type** and semantic text styles as iPhone — do not freeze sizes for “desktop-like” density.
- At accessibility text sizes, allow columns to stack or scroll rather than clip.
- Semantic colors and materials across light/dark; sidebars often use distinct grouped/sidebar backgrounds.
  Design both appearances together; test contrast and control states in each, including at accessibility text sizes.
- Prefer **SF Symbols** with consistent weight across sidebar, toolbar, and content.

## Sheets, popovers, and dialogs

- Prefer **popovers** and form sheets anchored to the control that opened them on regular width.
- Use medium/large sheets for editing; avoid unnecessary full-screen covers when a popover suffices.
- Confirmation dialogs and alerts follow iOS rules — scarce, focused, labeled actions.
- Keep modal tasks dismissible with Done/Cancel; warn on unsaved changes.

## Interaction patterns

- Drag and drop between columns and from other apps when the content model allows.
- Multi-select and bulk actions fit the larger canvas better than on phone — expose edit mode clearly.
- Empty, loading, and error states should fill the relevant **column**, not the entire window, when other panes remain useful.
- Selection-driven UI: detail and inspector update with the current selection without extra navigation hops.

## Accessibility

- VoiceOver: announce column roles (sidebar, list, detail) so focus order matches reading order.
- Full keyboard access: every essential action reachable without touch.
- Dynamic Type and Reduce Motion apply the same as iPhone; verify split layouts at large sizes.
- Pointer alone must not be required — touch remains primary.

## Anti-patterns

- Scaled-up iPhone UI with huge empty margins and a lone phone-width column.
- Assuming full-screen only — ignoring Split View, Slide Over, and Stage Manager.
- Hiding primary destinations exclusively in hamburger patterns when a persistent sidebar fits.
- Hover-only affordances with no touch equivalent.
- Full-screen modals for every small edit that could be a popover or inspector.
- Hardcoded layouts keyed to “iPad” instead of size class / window width.

## Verification checklist

- [ ] Regular width uses sidebar or multi-column structure where content warrants it
- [ ] Compact width (Slide Over / narrow split) remains usable with a sensible single-column fallback
- [ ] Resizing the window reflows panes without clipping critical controls
- [ ] Empty detail state guides selection
- [ ] Hover + keyboard shortcuts exist; touch targets still ≥ 44×44 pt
- [ ] Sheets/popovers match task weight; not everything is full-screen
- [ ] Dynamic Type and VoiceOver work across columns
- [ ] Pencil optional unless the product is drawing-first
