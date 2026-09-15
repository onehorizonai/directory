# Desktop — Mac

On-demand platform guidance for [../SKILL.md](../SKILL.md). Load when the
design target is **macOS**. Apply after [ui-reasoning.md](ui-reasoning.md)
— this file is OS chrome, not the starting model.

Design only: look, behavior, and conventions. Do not specify frameworks,
bindings, or packaging.

## Official sources

- [macOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/macos)
- [Windows and views](https://developer.apple.com/design/human-interface-guidelines/windows)
- [Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars)
- [Menus](https://developer.apple.com/design/human-interface-guidelines/menus)
- [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)
- [Keyboard shortcuts](https://developer.apple.com/design/human-interface-guidelines/keyboards)

## Design intent

macOS apps are **pointer-first**, **menu-bar driven**, and **multi-window**.
Users expect system chrome, keyboard reachability for every primary action,
and layouts that resize gracefully rather than phone-like stacks.

Prefer native control language: translucent sidebars, unified toolbars,
standard preferences, system file dialogs, and inspectors that feel like
Finder / Mail / Notes — not iOS sheets transplanted to the desktop.

## Window types and roles

| Role | Pattern | Behavior |
|------|---------|----------|
| Primary work | Multi-instance main windows | User can open several; may tab them together |
| Preferences | Dedicated Settings window | Opened via **⌘,** or app menu; typically tabbed panes |
| Singleton tools | One utility / doctor window | Bring existing instance forward; do not spawn duplicates |
| Palettes / inspectors | Floating utility window | Tracks the focused main window’s selection; Escape dismisses; often hide when app inactive |
| Menu bar utilities | Status-item menu or popover | Menu for short actions; compact popover for live status |
| Documents | Document windows | File → New / Open / Save; one window per document |

**Sizing:** Give every window a sensible default size and a hard minimum so
content never becomes unusable. Fixed-size windows only for simple dialogs
or tightly constrained utilities.

**Chrome:** Unified or unified-compact toolbar for most apps; expanded title
above toolbar when many items need room. Hide the title bar only for
immersive media or intentional custom chrome — and still preserve close /
minimize / zoom affordances and drag regions.

## Layout patterns

- **Sidebar navigation:** Leading sidebar drives content (and optional
  detail). Columns stay side-by-side; sidebar uses translucent material;
  users resize columns by dragging.
- **Peer panes (IDE-style):** Equal peer splits when panes are not
  “navigate → content” (editor + preview + console). Distinct from sidebar
  navigation.
- **Inspector:** Trailing supplementary panel for properties of the current
  selection — toggleable, resizable, not a second primary nav.
- **Tables:** Multi-column data with sorting; bordered + alternating rows
  for dense data; inset for lighter lists. Collapse thoughtfully at narrow
  widths rather than crushing columns.
- **Empty detail:** When nothing is selected, show a clear empty state
  (“Select an item”) instead of a blank pane.

## Menus, toolbars, and commands

- Put **every repeatable action** in the menu bar with a keyboard shortcut
  where convention exists (⌘S, ⌘N, ⌘W, ⌘,, etc.).
- Toolbar holds frequent, glanceable actions; keep labels/icons clear;
  group related items; allow customization when the app has many tools.
- Prefer system search placement (often sidebar or toolbar) over a custom
  always-visible search field that fights chrome.
- Menu commands and toolbar buttons must stay in sync with the **focused**
  window’s selection (enable/disable accordingly).
- Utility windows and palettes should reflect the focused document’s
  selection without stealing focus until the user interacts with them.

## Focus and keyboard

- Full workflows must work with keyboard: Tab order, Return/Escape in
  dialogs, arrow navigation in lists/tables, Delete for remove when
  selection-focused.
- Show a clear focus ring on custom focusable controls (or an equivalent
  custom focus treatment that remains obvious).
- Default focus in dialogs lands on the primary field or the safest
  default control — not a destructive button.
- Search fields should be focusable via a standard shortcut (often ⌘F)
  and feel part of the window, not a modal interruption.

## Sheets, dialogs, and panels

- Use **sheets** attached to a window for scoped tasks (rename, export
  options) when the task belongs to that document.
- Use **alerts / confirmation** only for irreversible or high-impact
  decisions; prefer undo for reversible deletes.
- Modal sheets own Cancel / Confirm in the chrome; verbs are specific
  (“Save”, “Delete”), not “OK” / “Yes”.
- Prefer inspectors and utility windows over stacking many modal sheets
  for ongoing attribute editing.

## Files, drag-and-drop, clipboard

- Use system Open / Save panels (sidebar, tags, Quick Look, format
  menus) — do not invent a custom file browser for ordinary import/export.
- Support **cross-app** drag and drop where content types make sense
  (Finder ↔ app).
- Respect pasteboard conventions; expose Paste / Copy where users expect
  them in Edit menu and context menus.

## Visual language

- System typography hierarchy; comfortable density (not mobile-tight).
- Light and dark appearance; respect accent color and reduce-transparency
  preferences when materials are used. Design both appearances together;
  test contrast, pressed, focus, disabled, and scrims in each.
- SF Symbols (or platform-consistent icons) with tooltips on icon-only
  toolbar items.
- Prefer materials and separators the system already uses over heavy
  card stacks and mobile-style bottom bars.

## Anti-patterns

- Phone navigation (tab bars, full-screen push stacks) as the primary
  desktop shell.
- Preferences buried only in an in-window page with no ⌘, / Settings scene.
- Crowded toolbars with unlabeled icons and no menu equivalents.
- Modals for reversible edits that should be undoable or live in an
  inspector.
- Fixed layouts that ignore resize, zoom, and multi-display placement.
- Hiding window controls or breaking title-bar drag without a strong
  immersive reason.
- Focusable custom controls with no focus ring and no keyboard path.
- iOS-only patterns (large navigation titles, bottom sheets) without
  adapting to pointer, menus, and multi-window.

## Verification checklist

- [ ] Window roles match the table above (main / settings / utility /
  document / menu-bar).
- [ ] ⌘, opens preferences; primary actions have menu + shortcut.
- [ ] Sidebar vs peer-split vs inspector roles are clear and resizable.
- [ ] Empty, loading, error, and no-selection states are designed.
- [ ] Keyboard-only path completes the core task; focus is visible.
- [ ] Destructive actions use confirmation **or** undo — not neither.
- [ ] System file dialogs and DnD used where appropriate.
- [ ] Light/dark and reduced-transparency look intentional.
- [ ] Minimum window size still shows usable hierarchy.
- [ ] Icon-only controls have tooltips; labels use title case for menus /
  buttons per HIG writing style.
