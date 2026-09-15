# Visual design

On-demand guidance for [../SKILL.md](../SKILL.md). Load **after**
[ui-reasoning.md](ui-reasoning.md) has an outcome, objects, actions, and
priority — this file is visual refinement, not the start of the design.

## Ground in product and context first

Before palette or typeface choices:

1. Name the **subject** (product, page job, audience) in one sentence.
2. Note brand / design-system constraints and comparable existing pages.
3. State the page’s **single primary job** and one signature idea that
   fits *this* subject’s world (materials, vernacular, artifacts) — not a
   generic SaaS template.

If the brief is vague, pin those three yourself and declare the
assumption. Prefer the product’s existing tokens and patterns when they
exist; invent only where the surface is new or the brief asks for it.

## Direction and signature

- Choose one coherent aesthetic stance (minimal, editorial, industrial,
  playful, etc.) and execute it with precision.
- Spend boldness in **one** place: a signature element (hero treatment,
  type moment, interaction device). Keep everything else quiet.
- Match complexity to the vision: maximalism needs craft; minimalism
  needs exact spacing and type.
- Structural devices (eyebrows, dividers, numbering) must encode
  something true about the content — not decorate. Numbered markers only
  when order carries meaning.

## Hierarchy

- One primary focus; secondary and tertiary content visibly quieter.
- Prefer space, weight, contrast, and placement before color or chrome.
- Quiet section titles when content should lead; don’t make every heading
  a billboard.
- One clear primary action; secondary quieter; tertiary link-like.
- **Grayscale test**: if color vanished, primary / secondary / tertiary
  should still read within ~2 seconds.
- Emphasize by de-emphasizing: soften competing icons, metadata, and
  sidebars before making the hero louder.

## Typography

- Pair display and body deliberately for *this* brand — avoid default
  stacks (Inter, Roboto, Arial, system) when personality matters.
- Use a constrained scale (about 5–7 roles): caption → body → heading →
  display. Combine size + weight + color + space — not size alone.
- Body ≥16px for reading; line length ~45–75 characters; tighter line-height
  for headings, looser for body.
- App / dense UI: fixed rem-based scale. Marketing / content: fluid
  headings (`clamp`) with fixed body.
- Tabular numerals and right-aligned columns when comparison matters.
- Copy is design material: name things users recognize, active voice,
  specific actions (“Save changes”), sentence case for labels.

## Composition, spacing, density

- Space within groups < space between groups.
- Use a consistent spacing scale; avoid arbitrary one-off gaps.
- Density matches content: data tools tighter; marketing more air.
- Don’t wrap everything in cards. Cards for discrete actionable units —
  never nest cards in cards; prefer proximity and background shift.
- Break identical card-grid monotony; vary structure across sections.
- Max-width reading and form columns; don’t stretch content to fill 4K.
- Squint / blur test: primary element and groupings still identifiable.

## Color

- Palette as 4–6 named roles (background, surface, text, accent,
  semantic success/warn/error) grounded in subject — not a stock purple
  gradient or acid accent on near-black by default.
- Accent draws attention to the right thing; same colors mean the same
  thing across the flow.
- Never color alone for meaning (pair with label, icon, or shape).
- On tinted surfaces, use related tints — not gray text on colored fills.
- Follow brand light/dark semantics when the product has them.
- Design light and dark **together**. Dark mode uses desaturated /
  lighter tonal variants, not inverted colors. Test contrast, pressed,
  focus, disabled, and scrims on the real background in both themes.
  Do not infer one theme from the other.

## Motion

- One orchestrated moment beats scattered effects.
- Motion serves subject (entry, hierarchy, feedback) — not decoration.
- Prefer short, interruptible transitions; honor reduced-motion (instant
  or opacity-only alternatives).
- Avoid bounce/elastic easing and endless ambient loops that read as
  “AI-generated.”

## Anti-generic AI UI

AI-default looks (use only if the brief truly asks for them):

1. Warm cream ground + high-contrast serif + terracotta accent
2. Near-black + single acid green / vermilion glow
3. Broadsheet: hairline rules, zero radius, dense newspaper columns

Also avoid as defaults: purple-on-white / purple-indigo gradients,
glassmorphism stacks, hero-metric templates (big number + tiny label +
stat strip), identical icon+title+text card grids, gradient text,
overused rounded-full pills and multi-layer shadows.

**Test**: if someone said “AI made this,” would they believe you
immediately? If yes, revise direction toward the subject.

## Polish (design pass)

After structure is right:

- Optical alignment (icons may need a nudge)
- Consistent icon family and sizing; icon meaning depends on **use**
  (decorative vs meaningful vs control — see
  [structure-hierarchy.md](structure-hierarchy.md))
- Widows in headings; parallel copy structure
- Separation strategy: pick spacing *or* border *or* background — don’t
  pile all three
- Full interaction state set specified (see
  [interaction-and-states.md](interaction-and-states.md))

## Anti-patterns

- Templated palette/type unrelated to the product
- Every section equally loud; every button primary
- Color as the only hierarchy tool
- Decorative structure (fake numbering, empty eyebrows)
- Card grids and hero metrics as reflex
- Motion as garnish; ignoring reduced motion
- Polish decorating a weak hierarchy

## Verification

- [ ] Subject, audience, and page job stated
- [ ] Signature element is singular and justified
- [ ] Grayscale hierarchy passes in ~2s
- [ ] Type scale and pairing feel brand-specific
- [ ] Spacing rhythm and density match content type
- [ ] Palette roles named; color not sole meaning
- [ ] Motion intentional + reduced-motion path
- [ ] Does not read as generic AI UI
- [ ] Handoff notes cover tokens, hierarchy, and signature

## Official / durable references

- [MDN: CSS writing modes / logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)
  (layout resilience)
- Product design system / brand guidelines when present
