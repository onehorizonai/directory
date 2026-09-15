# Linux / GTK 4 + libadwaita engineering

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
building approved UI in an existing **GTK 4 / libadwaita** app (Python,
Rust, C, Vala — match the repo’s language).

For GNOME / visual HIG decisions, fetch current GNOME HIG (or KDE HIG if
that is the product's desktop) rather than recalling chrome from memory.
Do **not** invent Electron-style or Material chrome on a GNOME app;
framework choice does not override OS design.

Target APIs: **GTK 4.18+ / libadwaita 1.7+** unless the repo pins older.

## Architecture

- Prefer `Adw.Application` + `Adw.ApplicationWindow` over raw
  `Gtk.Application` / `Gtk.Window` for GNOME-targeted apps.
- One reverse-DNS `application_id` (e.g. `com.example.MyApp`) shared by
  desktop file, AppStream, GSettings schema, and Flatpak id.
- Structure: app owns actions / CSS / GSettings; windows own view state;
  reusable widgets expose GObject properties + signals, not globals.
- Prefer Blueprint (`.blp`) or UI resources for layout; keep imperative
  code for wiring and state.

### Lifecycle (`Adw.Application`)

| Signal / vfunc | When | Use for |
| --- | --- | --- |
| `startup` / `do_startup` | Once at launch | Actions, CSS provider, GSettings — **chain up first** |
| `activate` / `do_activate` | Each launch / raise | Create or `present()` the main window |
| `open` | Files passed on CLI / D-Bus | Document / file args |
| `shutdown` | Exit | Persist transient state, disconnect |

```python
def do_startup(self):
    Adw.Application.do_startup(self)  # required
    self._setup_actions()

def do_activate(self):
    win = self.props.active_window
    if not win:
        win = MainWindow(application=self)
    win.present()
```

## Threading

**GTK is single-threaded.** All widget / UI calls run on the main loop.

- Background work: `threading`, `Gio.Task`, or language async — never
  touch widgets from workers.
- Marshal UI updates with `GLib.idle_add(callback, …)` (or
  `GLib.idle_add` with a lambda that returns `GLib.SOURCE_REMOVE`).
- Never `time.sleep()` or block on network/disk inside signal handlers —
  the UI freezes.
- Prefer cancellable `Gio` async APIs for I/O so destroy / quit can abort.

## Signals and GObject

- Connect with `widget.connect("signal-name", handler)`; disconnect or
  use weak refs when the handler outlives the widget.
- Prefer property notify (`notify::prop`) and `GObject.Binding` /
  `bind_property` over ad-hoc sync loops.
- List UIs: `Gio.ListStore` + `Gtk.ListView` / `Gtk.GridView` + factory;
  avoid rebuilding large `Gtk.Box` trees of rows.
- Subclass with `GObject.Object` properties for testable state; expose
  actions for menu / shortcut entry points.

## Actions

- App-scoped: `app.quit`, `app.preferences`, `app.about`.
- Window-scoped: `win.save`, selection-dependent commands.
- Wire accelerators with `application.set_accels_for_action("app.quit",
  ["<Control>q"])`.
- Use stateful `Gio.SimpleAction` for toggles; menus and buttons should
  target actions (`action-name`), not duplicate handlers.

## GSettings

- Schema id matches application id; install via Meson / Flatpak.
- Read/write typed getters; prefer `settings.bind(...)` to widget
  properties for prefs that map 1:1.
- React with `changed::key`; test with `GSETTINGS_BACKEND=memory`.
- Paths: use XDG (`GLib.get_user_config_dir`, etc.) — never hardcode
  `$HOME/.myapp`.

## Resources and assets

- Bundle UI, CSS, and icons in a `GResource` compiled into the binary /
  Python package.
- Symbolic icons for chrome; follow the app’s existing icon set.
- Load CSS once in `startup` via `Gtk.CssProvider` on the display; prefer
  libadwaita style classes over one-off colors.

## Accessibility implementation

- Set accessible names / descriptions on icon-only controls
  (`accessible_role`, `Gtk.Accessible` update APIs / ATK-compatible
  properties as the binding exposes).
- Keyboard: every action reachable via focus + accelerators; don’t rely
  on pointer-only gestures.
- Respect system font size and contrast; use
  `Adw.StyleManager` for dark/light — don’t fork a private theme that
  ignores portals.
- Verify with **Orca** + GTK Inspector accessibility pane — not visuals
  alone.

## Testing and TDD

Prefer the repo’s stack (often **pytest** + PyGObject, or Rust unit
tests).

**Red–green–refactor** for app/window logic:

1. Fail a test on GSettings / action / model behavior without UI.
2. Implement in non-widget modules or testable GObject classes.
3. Add UI smoke tests when peers already do.

**Headless / CI:**

- `GDK_BACKEND=broadway` or xvfb where required; prefer Wayland-less CI
  patterns the project already uses.
- `GSETTINGS_BACKEND=memory`; never touch the developer’s real schemas.
- `GTK_A11Y=none` only when a11y init breaks headless — document it;
  keep at least one a11y-on run locally.
- Debug: `GTK_DEBUG=interactive`, `G_DEBUG=fatal-criticals`,
  `G_MESSAGES_DEBUG=all`.

## Packaging / Flatpak notes

- Ship `.desktop`, AppStream metainfo, icons, and GSettings schemas with
  matching ids.
- Flatpak: portals for files, notifications, secrets — don’t assume host
  filesystem paths.
- Runtime: `org.gnome.Platform` matching the libadwaita you build
  against; declare finish-args narrowly.
- Meson is the common build; keep resource XML and schema install paths
  consistent with Flatpak prefix.

## Current API preferences / deprecations

| Avoid | Prefer |
| --- | --- |
| `GtkShortcutsWindow` | `AdwShortcutsDialog` (libadwaita 1.8+) |
| `GtkSpinner` in Adw apps | `AdwSpinner` |
| Exclusive `GtkToggleButton` groups | `AdwToggleGroup` |
| `.dim-label` | `.dimmed` |
| Assuming X11 / Broadway forever | Wayland-first; X11 deprecated toward GTK 5 |

Also useful when peers already use them: `AdwBottomSheet`, `AdwWrapBox`,
`AdwInlineViewSwitcher`.

## Verification checklist

- [ ] `do_startup` chains up; activate presents a single primary window
- [ ] No UI calls from worker threads (`GLib.idle_add` verified)
- [ ] Actions + accelerators cover primary commands
- [ ] GSettings schema installs; binds don’t fight manual sets
- [ ] Resources load under Flatpak and local runs
- [ ] Orca names / keyboard paths for new controls
- [ ] Tests: unit + any headless smoke; gaps reported as **not run**

## Anti-patterns

- UI mutation from background threads
- Blocking the main loop in signal handlers
- Missing `do_startup` chain-up
- Signal handlers that never disconnect on destroy (leaks / use-after-free)
- Hardcoded absolute paths instead of XDG / portals
- Wrong or missing `application_id`
- `GtkShortcutsWindow`, `.dim-label`, spinner/toggle patterns above
- Custom CSS that fights libadwaita tokens and system accent
- Packaging without AppStream / desktop file id alignment
