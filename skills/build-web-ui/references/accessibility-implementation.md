# Accessibility implementation

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
building or verifying operable, perceivable UI.

**First rule of ARIA:** use native HTML semantics first. ARIA supplements;
it does **not** recreate buttons, links, checkboxes, dialogs, or
expand/collapse when native elements exist
([WAI-ARIA](https://www.w3.org/TR/wai-aria-1.2/),
[ARIA in HTML](https://www.w3.org/TR/html-aria/),
[APG](https://www.w3.org/WAI/ARIA/apg/)).

Visual / interaction a11y choices (contrast intent, names, target sizes)
come from the approved design and WCAG — this file is implementation and
verification.

## Semantics first

| Need | Prefer |
| --- | --- |
| Button / link | `<button>` / `<a href>` |
| Expand section | `<details>`/`<summary>` |
| Modal | `<dialog showModal()>` |
| Checkbox / radio / select | Native inputs (+ `<fieldset>`/`<legend>`) |
| Site nav | `<nav><ul><a>` — **not** `role="menu"` |
| Search landmark | `<search>` |

Never put `role="button"` on a `<div>` if `<button>` works. ARIA does not
add keyboard behavior, form submission, or focusability by itself.

## Names, roles, states

Accessible name precedence: `aria-labelledby` > `aria-label` > native
label / `alt` / content > `title`.

- Visible text exists → point with `aria-labelledby` (don't override with
  a diverging `aria-label`).
- Icon-only → `aria-label` (or visually hidden text).
- Errors → visible message + `aria-invalid="true"` and
  `aria-errormessage` / `aria-describedby` as the stack supports.
- Don't add redundant roles (`<nav role="navigation">`,
  `<button role="button">`).

## Keyboard and focus

- Full task completable without a mouse: Tab and Shift+Tab move forward
  and backward through every interactive control in order; Enter and
  Space activate controls per their native role; Escape dismisses
  dismissible UI (menus, dialogs, popovers) where the platform expects it.
- Focus order follows reading order; only `tabindex="0"` or `"-1"`.
- Visible `:focus-visible` indicator meeting non-text contrast (~3:1).
- Composite widgets (tabs, menus, listboxes): roving tabindex or
  `aria-activedescendant` with arrow-key movement per the matching **APG
  pattern** — don't leave every item `tabindex="0"`. Tab interfaces
  specifically follow the [APG tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
  rather than ad hoc keyboard wiring.
- No keyboard trap: every focusable region a user can Tab into has a
  keyboard path back out.
- Disabled controls are excluded from the tab order and exposed via the
  native `disabled` attribute or `aria-disabled` (not style alone);
  selected/pressed/expanded state is exposed via `aria-selected`,
  `aria-pressed`, or `aria-expanded` to match the visual state.
- Modal: prefer `<dialog>.showModal()` (inert background + focus trap).
  If custom, use `inert` on the background — **`aria-hidden` alone does
  not remove background from tab order**.
- Manage focus on open/close for dialogs, sheets, and popovers: move
  focus into the opened UI, then on close restore focus to the control
  that opened it.
- Escape dismisses overlays consistently; don't trap focus without an exit.
- Semantic headings (`h1`–`h6` in outline order, no skipped levels chosen
  for size) and landmarks (`main`, `nav`, `header`, `footer`, `search`)
  give assistive tech a real page structure to navigate, separate from
  visual heading size.

## Live regions and status

- Expose loading finished, save succeeded, and errors to assistive tech —
  not by color/icon alone.
- Prefer `role="status"` (polite) for routine updates; `role="alert"`
  sparingly for urgent failures.
- Live region node must **exist in the DOM before** content is injected;
  updating `textContent` of a pre-rendered region works; creating the
  region at announcement time often fails silently.

## Motion, contrast, targets (WCAG 2.2-aware)

- Gate decorative motion with `prefers-reduced-motion`; keep a non-motion
  cue for essential state changes.
- Measure contrast on the **rendered** pair (opacity, gradients overlays
  count). Text AA: ~4.5:1 normal / ~3:1 large; UI chrome ~3:1
  ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)). Fetch current SC text when
  auditing formally — don't rely on memorized edge cases.
- Target size minimum 24×24 CSS px (2.5.8) unless an exception applies.
- Provide a non-drag alternative for drag-only interactions (2.5.7).
- Allow paste / password-manager friendly auth fields (3.3.8).
- Focus not obscured by sticky UI (2.4.11) — use scroll padding/margin.

## Custom widgets

If no native control fits (tabs, combobox with custom options, tree,
grid), follow the matching **APG pattern** end-to-end (roles + keyboard +
states). Partial ARIA is worse than a simpler native composition.

High-risk patterns (drag-and-drop, rich text, trees, grids, custom
comboboxes, carousels, toast-heavy UIs): verify what you can
mechanically; hand off real screen-reader confirmation rather than
emulating announcement.

## Verification tiers

Automation catches only part of defects. For meaningful UI changes:

1. **Automated** — project a11y lint / axe-like scan on the affected route
   (partial evidence).
2. **Keyboard** — one full Tab walk of the flow; operate with
   Enter/Space/arrows/Escape where relevant.
3. **Accessibility tree** — names, roles, states match the UI (DevTools /
   browser snapshot). Presence of `aria-live` ≠ confirmed announcement.
4. **Manual / AT** — when risk warrants (custom widgets, legal conformance):
   hand off VoiceOver / NVDA / JAWS; don't invent user experience claims.

Report findings with evidence (selector + observation). Separate
**verified** failures from **needs human** judgment. Never claim WCAG
conformance from compile or a green unit test alone.

See also [design-and-verification-checklist.md](design-and-verification-checklist.md)
and [testing-and-browser-verification.md](testing-and-browser-verification.md).
