# Desktop — Linux

On-demand platform guidance for [../SKILL.md](../SKILL.md). Load when the
design target is **Linux desktop**, with **GNOME / libadwaita HIG** as the
default design language unless the product already targets another DE
(KDE, etc.). Apply after [ui-reasoning.md](ui-reasoning.md) — this file
is OS chrome, not the starting model.

Design only: look, behavior, and conventions. Do not specify GObject
signals, packaging, or toolkit wiring.

## Official sources

- [GNOME Human Interface Guidelines](https://developer.gnome.org/hig/)
- [GNOME HIG — patterns](https://developer.gnome.org/hig/patterns/)
- [libadwaita documentation](https://gnome.pages.gitlab.gnome.org/libadwaita/)
- [GNOME Design](https://welcome.gnome.org/team/design/) (design team / process context)

When the product must look native on **KDE Plasma**, follow
[KDE Human Interface Guidelines](https://develop.kde.org/hig/) instead of
forcing GNOME chrome onto a Plasma app. State the target DE in the
handoff.

## Design intent

GNOME apps aim for **calm, focused windows**: header bar chrome, boxed
lists for settings, symbolic icons, and adaptive layouts that work from
about **800×600** up to large displays and (where relevant) narrower
form factors.

Prefer libadwaita patterns over custom styling. One clear primary action
per view. Feedback is toast-first; dialogs are for decisions.

## Windows and containers

| Scenario | Pattern |
|----------|---------|
| Main app | Application window + header bar |
| Settings | Dedicated preferences window (searchable groups / subpages) |
| Modal task | Dialog with Cancel (start) + specific action (end) |
| Lists of settings | Boxed preference groups and rows |
| Empty content | Status page: icon + title + description + optional action |

Remember last window size; start near a comfortable default (~800×600)
unless the app is inherently smaller (calculator-like utilities).

**Header bar:** Title and view switchers toward the center/start; primary
actions toward the end; menu (⋯) for secondary items. Icon-only header
buttons always need tooltips.

## Navigation

| Structure | Pattern |
|-----------|---------|
| Single view | No switcher |
| 2–4 peer views | View switcher in the header bar |
| Many / dynamic destinations | Sidebar split navigation |
| Hierarchy | Drill-down navigation view (back in header) |

Do not invent a parallel nav system when one of the above fits. Keep
switcher destinations stable and few.

## Controls (defaults)

| Need | Prefer | Avoid |
|------|--------|-------|
| On / off | Switch row | Checkbox for preference toggles |
| Choose one (few/many) | Combo row (+ search when long) | Long radio lists in main UI |
| Short text | Entry row | Bare unstyled fields in settings |
| Number | Spin row | Free text for constrained numbers |
| Action in a list | Action row + suffix control | Crowded multi-button rows |
| Search | Search bar revealed by toggle / shortcut | Always-visible search competing with header |
| View mode (list/grid) | Exclusive toggle group | Ad-hoc toggle button sets |
| Tags / chips that wrap | Wrapping box | Horizontal overflow only |

**Primary action:** One emphasized (“suggested”) button per view when
needed. **Destructive:** Distinct destructive styling; prefer undo toast
over confirm when reversible.

**Validation:** Inline error state on the field; format checks on change;
expensive checks on leave; final check on submit.

## Lists, grids, selection

- Settings / preferences → boxed groups.
- Sidebar navigation lists → selectable rows.
- Large or dynamic data → virtualized list/grid.
- Thumbnail collections → grid view.
- Bulk actions → explicit selection mode + bottom/action bar — not
  hidden multi-select without chrome.

## Feedback

| Situation | Pattern |
|-----------|---------|
| Action completed | Toast (optional Undo) |
| Reversible delete | Toast + Undo (prefer over confirm) |
| Recoverable blip | Toast; retry quietly when safe |
| Persistent state (offline, auth) | Banner |
| Blocking error / irreversible choice | Dialog |
| Short wait | Spinner |
| Long job | Progress + concrete status text |

**Escalation:** toast → banner → dialog. Do not jump to a dialog for a
transient network blip.

**Dialog copy:** Specific verbs (“Delete”, “Save”) — never “OK” / “Yes”.
Cancel first, confirming action last. One destructive control max in the
footer.

**Context menus:** Short popover menus for item actions; complex flows
belong in dialogs or subpages.

## Visual language

- **Symbolic** (monochrome outline) icons in UI chrome — not full-color
  app icons as toolbar glyphs.
- Typography style classes for hierarchy (title / heading / body /
  caption); rely on libadwaita spacing — avoid one-off margins.
- Follow system light/dark and **system accent** when the desktop
  provides them. Design both; test contrast and control states in each.
- Header capitalization for labels; sentence case for descriptions.
- Comfortable density — neither cramped nor sparse.
- For code or document surfaces, respect user monospace / document font
  preferences when the platform exposes them.

## Adaptive and multi-input

- Usable at ~800×600; reflow to larger sizes; plan narrower breakpoints
  when the app may run on small / mobile-adjacent shells.
- Bottom sheets for persistent secondary controls (e.g. player bar) when
  the pattern fits — not as a dumping ground for primary nav.
- Full keyboard: Tab, Enter, Space; mnemonics/shortcuts where expected;
  publish a shortcuts overview for power users.
- Touch-friendly targets when the shell is touch-capable; keep pointer
  precision comfortable on desktop.

## Accessibility

- Accessible names for icon-only controls and images.
- Works in high contrast and at large text (e.g. 200% scaling).
- No information conveyed by color alone.
- Screen-reader labels match visible intent.

## Anti-patterns

- Custom CSS skins where a libadwaita pattern already exists.
- Multiple suggested or destructive buttons in one view.
- Confirmation dialogs for easily undoable actions.
- Text over busy textures; low-contrast captions.
- Non-symbolic / non-GNOME icon sets without strong brand justification.
- Missing tooltips on header icon buttons.
- Generic dialog labels (“OK”, “Yes”, “Submit”).
- Frozen UI with no spinner / progress / disabled state.
- Always-visible search and overloaded header bars.
- Forcing GNOME header-bar patterns onto a KDE-targeted app (or the
  reverse) without stating the DE target.

## Verification checklist

- [ ] Window type matches role (app / preferences / dialog).
- [ ] Navigation pattern matches view count and hierarchy.
- [ ] Standard rows/controls used for settings and forms.
- [ ] Symbolic icons + tooltips on icon-only header actions.
- [ ] One suggested action max; destructive styled and undoable or
  confirmed intentionally.
- [ ] Empty, loading, error, and offline/banner states designed.
- [ ] Feedback uses toast → banner → dialog escalation correctly.
- [ ] Dialogs use specific verbs; Cancel before confirm.
- [ ] Keyboard-only path works; accessible names present.
- [ ] High contrast and large text remain legible.
- [ ] Layout works at ~800×600 and at large sizes.
- [ ] Target DE stated if not GNOME; patterns match that HIG.
