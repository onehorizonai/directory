# Hardening and edge cases

On-demand guidance for [../SKILL.md](../SKILL.md). Load for real-world
resilience **after** [states.md](states.md): cardinality, long content,
i18n, papercuts, empty/error recovery, and hierarchy checks without
color. Design only. Also run the grayscale and skeleton reviews in
[verification.md](verification.md).

Ideal happy-path mockups are not production-ready. Treat edge cases as
**design input**.

## Cardinality: 0 / 1 / some / many

Design each count explicitly:

| Count | Design for |
| --- | --- |
| **0** | Empty state with purpose + CTA; hide dead filters/tabs/toolbars |
| **1** | Don’t look broken or lonely; singular copy; avoid plural chrome |
| **Some** | Default comfortable density; clear primary action |
| **Many** | Scan, filter, sort, paginate or virtualize intent; bulk actions with previews |

Also stress: **one very long item** vs **many short items**; **partial
failure** (some rows loaded, some not).

## Long content and overflow

Anticipate short, average, and extreme user-generated strings:

- Names, titles, URLs, tags, breadcrumbs — truncate with meaning, wrap, or
  line-clamp; never blow out the layout.
- Compact labels (badges, chips, filters): one line when practical; `+n`
  must be operable; truncation needs a non-hover disclosure. See
  [structure-hierarchy.md](structure-hierarchy.md).
- Flex/grid children need room to shrink in the handoff notes (min-width
  intent) so truncation can work.
- Numeric and ID columns: tabular alignment; overflow strategy defined.
- Screenshots and user images: awkward crops, tiny icons, giant images —
  define containment and fallbacks.
- Lists of thousands: don’t imply rendering everything at once; design
  search/filter + progressive load.

## Internationalization (design impact)

- Budget ~**30–40%** wider strings (German/Finnish) for buttons, nav, tags.
- Test shortest locales (often CJK) so rhythm doesn’t fall apart.
- RTL: mirror directional chrome (chevrons, sequences); don’t mirror
  universal imagery (clocks) blindly; use logical start/end thinking.
- Dates, numbers, currency, addresses, name order: locale-aware display
  intent — no hardcoded `MM/DD` assumptions in mock copy.
- Pluralization and gendered grammar: write full sentences for translation,
  not concatenated fragments.
- Language pickers: language names, not flags.
- Locale: suggest from browser; never hard-redirect travelers/VPN users.
- Pseudo-localization mindset: if expanded gibberish breaks the layout,
  fix the layout before ship.

Deep string/TMS architecture is out of scope; capture layout and format
requirements in the handoff.

## Empty and error recovery

Map failures to recovery, not toasts alone:

- Network / timeout → retry + what failed
- 401 → sign-in, preserve destination
- 403 → permission empty state + request access
- 404 → path home/search
- 429 → wait / retry-after messaging
- 5xx / 503 → retry + status/support; full-page when route-level

Preserve user input across failures. For high-power tools (bulk,
permissions, automation, billing): preview counts, confirm irreversible,
undo when reversible, plain consequence copy.

## Papercuts (micro-failures)

Small repeated flaws destroy trust even when “it works”:

- Hover traps and layout jump on hover
- Focus loss after refresh or inline edit
- Stale badges and unread counts
- Controls that look enabled but do nothing
- Inconsistent validation timing across fields
- Scroll jump when loading more
- Tooltips as the only way to see critical values on touch devices

Specify the boring states: hover, focus, disabled, loading, empty, error,
success — consistently.

## Grayscale hierarchy check

Before calling the design done:

1. Imagine the screen in grayscale (or desaturate a screenshot).
2. Can you still name primary, secondary, tertiary in ~2 seconds?
3. Do errors and required fields still read without hue?

If not, fix weight, space, and labels — don’t add more color.

## Onboarding-adjacent edges

First-run and activation (when in scope): time-to-value over tour theater;
skippable when possible; empty states as product surfaces; progressive
permission asks; honest progress — not fake step counts. Detailed tours
belong only when complexity truly requires them.

## Anti-patterns

- Happy-path-only mockups
- “No items” / raw exception text as UI
- Fixed-width buttons that break in long locales
- Flags-as-languages; IP-forced locale
- Bulk destroy without preview/confirm
- Tooltip-only data on touch
- Color-only hierarchy and errors
- Ignoring 1-item and 10k-item extremes

## Verification

- [ ] 0 / 1 / some / many (+ long item) specified
- [ ] Overflow/truncation strategy for key fields
- [ ] i18n expansion + RTL + locale formats considered
- [ ] Error matrix with recovery paths
- [ ] Dead chrome removed in empty/permission states
- [ ] Papercut states listed for primary controls
- [ ] Grayscale hierarchy passes
- [ ] High-power actions have proportional guardrails

## Official links

- [WCAG: Consistent identification](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html)
- [Unicode: bidirectional text](https://www.w3.org/International/articles/inline-bidi-markup/)
- Live content-handling rules: [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
