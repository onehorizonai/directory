# Forms and input (native)

On-demand method for [../SKILL.md](../SKILL.md). Load when the surface
is input-heavy: settings, create/edit, search, auth, or a sheet that
collects data. Design intent for the **named OS**, not web form markup
or ARIA recipes.

Apply after [ui-reasoning.md](ui-reasoning.md) and [states.md](states.md).
Fetch current HIG for the target OS rather than recalling keyboard and
autofill details.

## Purpose first

- Every field must earn its place.
- Easy questions first; group related fields.
- Match field width to expected content.
- Follow the platform's settings / form patterns (iOS grouped lists,
  Android form in a scrolling column, desktop a labeled dialog or
  preferences pane). Do not paste a web form into native chrome.

## Labels and helpers

- Visible label on every field. Placeholder is never the only label.
- Helper text explains format or why, and does not repeat the label.
- Required / optional marking is consistent; not color alone.
- Icon-only trailing actions (clear, reveal password, scan) need an
  accessible name.

## Keyboards and entry

- Choose the platform keyboard / content type that matches the data
  (email, URL, number, one-time code).
- Allow paste. Allow the system password manager and autofill. Do not
  design a flow that only works if the user memorizes or retypes a
  secret.
- Show / hide for passwords.
- Spellcheck off for emails, usernames, and codes.
- Hit targets follow this OS (44 pt iOS, 48 dp Android, pointer-sized
  on desktop).

## Validation timing

- Not on pristine load.
- Format-complete fields: after the user leaves the field.
- Live cues only where they help (password strength, character count).
- Cross-field rules on submit.
- Errors name the problem and how to fix it, next to the field.
- Keep entered values on failure.
- After a failed submit, move focus to the first invalid field (or a
  short summary that links to fields when many failed).

## Unsaved work

- Warn before dismissing a sheet, dialog, or back-stack pop that would
  discard unsaved input.
- Prefer autosave or draft preservation on long forms.
- Confirm only when the loss is significant and hard to reverse.

## Auth and redundant entry

- Sign-in: minimal fields; don't clear a usable identity on a password
  error.
- MFA: large code fields; paste allowed; recovery path designed.
- Do not ask for information the user already supplied in this process
  (reuse a confirmed address rather than retyping it).
- Session expiry: explain, keep the destination, easy resume.

## Platform anti-patterns

- Web-style floating labels as the only HIG-violating chrome.
- Hover-only reveal of a required action on a phone.
- Disabled primary with no explanation of what is missing.
- "Invalid input" with no fix.
- Blocking paste or autofill as a security gesture.
