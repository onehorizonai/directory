# Forms and input

On-demand guidance for [../SKILL.md](../SKILL.md). Load for field layout,
labels, validation timing, errors, and auth/permission UX as design.
Not implementation of validators or auth libraries.

## Purpose first

- Every field must earn its place; optional work later if it drops
  completion.
- Easy questions first; group related fields; mark optional clearly.
- Match input width to expected content (postal codes aren’t full-bleed).
- Single-column by default on narrow; multi-column only when fields are
  truly peer and scanning stays clear.

## Labels and helpers

- Visible label **above** (or stably beside) the control — never
  placeholder-as-label.
- Specific: “Card number” not “Payment info.”
- Helper text explains format or why — doesn’t repeat the label.
- Placeholders are examples and end with an ellipsis (“Jane…”) when used;
  they disappear on type, so they can’t carry the only instruction.
- Required indicator consistent; don’t rely on color alone.

## Input types and entry comfort

- Choose entry modes that match content (email, tel, numeric, URL, date)
  so mobile keyboards and browsers help.
- Autofill-friendly naming and intent (meaningful names / autocomplete
  roles in the handoff).
- Allow paste everywhere (codes, passwords, account numbers). Allow the
  system password manager and autofill. Do not design a flow that only
  works if the user memorizes or retypes a secret.
- Show useful formatting while typing (card groups, phone) without
  fighting the caret.
- Short enumerations: prefer radios or segmented controls over long
  dropdowns on touch.
- Spellcheck off for emails, usernames, and one-time codes.

## Validation timing

| When | Use for |
| --- | --- |
| **On blur** | Format-complete fields (email, phone) after the user leaves |
| **On input** | Helpful live cues only (password strength, character count) |
| **On submit** | Cross-field rules and everything else |
| **Never** | Pristine fields on load — no accusatory red on arrival |

Reward early, punish late: don’t yell mid-keystroke for incomplete email.

## Errors and recovery

- Inline errors next to the field; explain **what’s wrong** and **how to
  fix**.
- Preserve all input on failure; focus the first error after submit.
- Form-level summary when many errors; still link each to its field.
- Keep submit enabled until the request starts; if disabled, state what’s
  missing — a mute gray button with no explanation is a dead end.
- Soften over-strict format traps (phone, address) when the risk model
  allows override or normalization.
- Warn on navigate with unsaved changes.

## Multi-step forms

- Split when >~6–8 fields or distinct topics; show “Step *n* of *m*.”
- Allow back navigation; preserve data; validate before forward, not before
  back.
- End with review when stakes are high (payment, legal, irreversible).

## Permissions, auth, and secure input (UX)

Design trust and recovery — not crypto details:

- Sign-in: minimal fields; password show/hide; don’t clear identity on
  failure when safe; rate-limit messaging with clear cooldown. Paste and
  password managers must work.
- MFA: plain setup, multiple methods, recovery codes at setup; frame as
  protection, not punishment; large code inputs on mobile; paste allowed.
- Do not re-ask information already supplied in this process (reuse a
  confirmed address rather than a second full form).
- Passwords: length > theatrical complexity; show requirements **before**
  failure; strength guidance while typing.
- Session expiry: explain, preserve destination, easy resume.
- Access denied (403): who can grant access + request path; read-only mode
  when partial capability exists.
- Consent: plain language, not pre-checked marketing; revoke as easy as
  grant.
- High-power actions (billing, permissions, bulk delete): preview
  consequences; confirm or undo proportional to risk.


## Checkboxes, radios, switches

- One combined hit target for label + control (no dead gaps).
- Radios for mutually exclusive choices; checkboxes for multi-select;
  switches for immediate on/off settings — don’t mix metaphors.
- Destructive toggles (public visibility, delete-on-sync) need plain-language
  consequence near the control.

## File, date, and sensitive fields

- File upload: show type/size limits before choose; progress + cancel;
  clear error if rejected.
- Dates: locale-appropriate display; don’t assume US order in labels.
- Payment and identity: minimize fields; show security reassurance only
  when accurate; never fake trust badges.

## Anti-patterns

- Placeholder-only labels
- Validate-on-load / pristine errors
- “Invalid input” with no fix
- Clearing fields after errors
- Disabled submit with invisible requirements
- Multi-step without progress or back
- Blocking paste; fighting autofill; treating memorized codes as the
  only authentication path
- Security theater (lock icons with no real protection)
- Flags for languages; IP-forced locale in account/locale pickers

## Verification

- [ ] Every field justified; labels visible and specific
- [ ] Validation timing documented (blur / input / submit)
- [ ] Errors fix-oriented; input preserved; focus order defined
- [ ] Submit/pending behavior clear
- [ ] Mobile entry modes and target sizes considered
- [ ] Auth / permission / consent states designed where in scope
- [ ] Unsaved-change and recovery paths noted

## Official links

- Live interaction rules (forms section): [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
- [WCAG: Error identification & suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [HTML autocomplete](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill)
