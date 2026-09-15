# Electron engineering

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
building approved UI in an existing **Electron** desktop app.

**Design rule:** follow current official HIG for the **host OS**, not an
Electron-only visual language. Fetch Apple HIG (macOS), Fluent (Windows),
or GNOME/KDE HIG (Linux) for the machine the app ships on.

Framework chrome must not override OS conventions (menus, window controls,
dialogs, typography, accent). Prefer native menus / dialogs /
notifications over web-only substitutes that fight the host.

## Process model

| Process | Role | May use Node? |
| --- | --- | --- |
| **Main** | App lifecycle, `BrowserWindow`, menus, protocol, auto-update, privileged OS APIs | Yes |
| **Preload** | Narrow bridge: expose allowlisted APIs via `contextBridge` | Limited (runs before page; treat as trusted) |
| **Renderer** | UI (HTML/CSS/JS or framework) | **No** — `nodeIntegration: false` |

Never put secrets, file-system writes, or shell execution in the renderer.

## Secure `BrowserWindow` defaults

```js
new BrowserWindow({
  webPreferences: {
    contextIsolation: true,   // required
    nodeIntegration: false,   // required
    sandbox: true,            // prefer on
    preload: path.join(__dirname, 'preload.js'),
    webSecurity: true,
    allowRunningInsecureContent: false,
  },
});
```

Also:

- `enableRemoteModule` / `@electron/remote` — do not reintroduce.
- Disable or tightly restrict `webviewTag`; if used, audit separately.
- `navigation` / `window.open`: deny unexpected origins; set
  `setWindowOpenHandler` and validate URLs.
- Load app UI from `app://` / custom protocol or bundled files — not
  arbitrary remote HTTP for the shell UI unless that is an explicit
  product decision with CSP + origin checks.
- Content-Security-Policy: no `unsafe-eval` in production; restrict
  `script-src` / `connect-src`.

## IPC contract

- Prefer **invoke / handle** (`ipcMain.handle` + `ipcRenderer.invoke`) for
  request/response; use `send` / `on` only for push events.
- Validate **every** argument in main (type, path containment, allowlists).
- Preload exposes **named functions**, not raw `ipcRenderer`:

```js
// preload.js
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  saveFile: (payload) => ipcRenderer.invoke('file:save', payload),
});
```

- Channel names: namespaced (`file:save`, `app:get-version`); reject
  unknown channels.
- Do not bounce privileged results to untrusted web content without
  filtering.
- Prefer structured clone–safe payloads; avoid sending native handles
  across unless required and typed.

## Window and app lifecycle

- Single-instance lock when the product expects one main window
  (`requestSingleInstanceLock`).
- Track window refs; on macOS typically keep app alive with no windows;
  on Windows/Linux quit when last window closes — **match existing app
  behavior** and OS norms.
- Persist window bounds with care (multi-monitor); restore only validated
  rectangles.
- Handle `ready-to-show` before `show()` to avoid white flash when peers
  do.
- Theme: follow `nativeTheme` / OS dark mode; don’t hardcode a web theme
  that ignores system appearance unless product says so.
- Menus: build with `Menu` in main (role-based items: `role: 'cut'`,
  etc.) so accelerators and platform layout stay native.

## State ownership

| Lifetime | Owner |
| --- | --- |
| Window UI / React-Vue-etc. state | Renderer (or shared store in renderer) |
| Session / window geometry / autostart | Main (or `electron-store` from main) |
| Secrets / tokens | Main / OS keychain — never `localStorage` alone |

Define what survives reload vs app quit. Renderer reload must not double-
submit privileged IPC operations — idempotency in main handlers.

## Performance

- Lazy-load heavy routes; avoid blocking main on sync FS/network.
- Prefer `BrowserWindow` backgroundThrottling awareness for timers.
- Large lists: virtualize in the renderer; don’t mirror huge arrays over
  IPC.
- Native modules: match Electron ABI; rebuild on Electron upgrades.
- Measure: Chromium DevTools in renderer; main-process CPU for IPC storms.

## Testing and TDD

Prefer the repo’s stack (Playwright, Spectron successors, WebDriver,
Jest/Vitest for unit).

**Red–green–refactor:**

1. Unit-test pure main handlers and preload allowlists with mocked `ipcMain`.
2. Component-test renderer UI with Node integration **off** (same as prod).
3. Smoke E2E: launch packaged or `electron .`, drive critical flows.

Cover: contextIsolation still true in test builds; IPC rejection of bad
input; window open/close; auto-update path **dry-run** where possible.

Report simulator/device gaps as **not run** — for Electron, state host OS
tested (macOS/Windows/Linux).

## Accessibility implementation

- Semantic HTML / ARIA in the renderer; focus order and keyboard paths.
- Honor OS reduced-motion / contrast when CSS hooks exist.
- Native menus and dialogs inherit OS a11y better than custom modals —
  prefer them for system actions.
- Verify with the **host** screen reader (VoiceOver / Narrator / Orca),
  not Chrome-only audits alone. Desktop shell + web a11y both required
  (see skill Verification).

## Packaging and updates

- Code-sign and notarize / SmartScreen as the platform requires.
- Auto-update via `autoUpdater` or the app’s existing channel
  (electron-updater, etc.); verify signatures; never disable TLS checks.
- Ship ASAR or equivalent; don’t leave writable privileged helpers
  world-writable.
- Deep links / custom protocols: register in main; validate URLs before
  navigation.

## Verification checklist

- [ ] `contextIsolation: true`, `nodeIntegration: false`, sandbox preferred
- [ ] Preload is allowlist-only; no leaked `require` / `ipcRenderer`
- [ ] Main validates IPC; no shell/FS from renderer
- [ ] Navigation / `window.open` restricted
- [ ] CSP present in production builds
- [ ] Menus, dialogs, and window behavior match **target OS** design ref
- [ ] Dark mode / accent follow system unless explicitly overridden
- [ ] Host OS screen reader + keyboard paths checked
- [ ] Tests or explicit **not run** per OS

## Anti-patterns

- `nodeIntegration: true` or `contextIsolation: false`
- Exposing entire `ipcRenderer` or `require` through `contextBridge`
- Remote module / arbitrary `executeJavaScript` from main on untrusted input
- Loading production UI over plain HTTP
- Web-only fake title bars / menu bars that ignore OS conventions
- Storing refresh tokens only in renderer storage
- Sync IPC or huge payloads on every keystroke
- Custom in-page “preferences” window when the OS expects native settings
  patterns already used by the app
- Inventing Electron-only visual chrome that fights macOS, Windows, or
  GNOME/HIG guidance for the ship target
