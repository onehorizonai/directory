# Structure and hierarchy

On-demand method for [../SKILL.md](../SKILL.md). Load after objects,
actions, concepts, use cases, and priority exist — not before. Structure
is derived from the model; visual hierarchy is an **output** of priority.

## Information architecture

Navigation reflects stable concepts and objects the user understands —
not implementation modules.

Ask:

- What are the primary objects?
- Which objects deserve destinations?
- Which relationships imply hierarchy?
- Which concepts belong together?
- Which actions belong to an object rather than global navigation?
- What must remain accessible across contexts?

Prefer the platform's familiar navigation (tabs, sidebar, split view,
back stack, settings scene) over a novel mechanism. Novel IA needs a
reason.

Do not use a modal, sheet, or dialog as the **primary path** for a
first-class object. Those are for inspect, edit, confirm, or filter.
If the user must live in a modal to do the job, it needed a destination.

## Gestalt (use on purpose)

**Proximity** — related things closer than unrelated things. Spacing
communicates relationship. Do not compensate for bad proximity with
borders, cards, or extra labels.

**Common region** — containers only when a stronger grouping signal is
necessary. Do not put everything in cards. Start with spacing; add
containment only when it improves understanding.

**Similarity** — alike look → alike meaning or behavior. Same action
level, same object type, same interaction → consistent treatment. Unrelated
actions must not look identical.

**Continuity** — align so the eye can follow predictable paths.

**Figure / ground** — obvious what is content, interactive, background,
and currently focused.

**Common fate** — things that move together are related. Use in
transitions and state changes; do not animate unrelated regions together.

## Alignment audit

Every extra alignment edge is another relationship the eye must process.
Prefer fewer **strong** lines over many weak ones.

For each screen or component:

- name major vertical and horizontal alignment lines
- remove arbitrary offsets
- align related content to shared edges
- align text baselines where appropriate
- mix left / center / right only on purpose
- avoid arbitrary widths
- avoid nested containers that add a new margin at every level

A good layout often shows a small number of strong invisible lines when
guides are drawn over it.

Prefer **optical** alignment when math looks wrong (icons, circles,
typography, asymmetric symbols).

## Vertical rhythm

Use the product's spacing scale. Do not invent one-off values when a
token works.

Evaluate as relationships, not isolated gaps:

- within a control
- label → value
- heading → content
- item → item
- group → group
- section → section

Spacing **inside** a conceptual group must normally be smaller than
spacing **between** groups. Repeated structures use repeated spacing.
Typography and line-height are part of the rhythm.

Ignore color and decoration: composition should still make sense from
spacing and alignment alone.

## Hierarchy maps from priority

Create hierarchy with the **fewest** of: position, spacing, size,
typography, weight, contrast, color, containment, depth, motion.

Do not make something larger, brighter, bold, colored, elevated, **and**
animated because it is primary. One clear hierarchy beats several
competing emphasis systems.

Checks:

- If the screen were blurred, would major areas and the primary action
  still be apparent?
- Where does the eye land first, second, third — does that match the
  priority scores?

## Attention budget

Emphasis is scarce. Every element that gains it reduces everything else.

Reserve the strongest action treatment for the most likely or important
action **in this context**. Avoid: competing primary buttons, badge
clutter, unnecessary colored fills, decorative icons on every label, too
many type sizes/weights, excessive separators, nested cards, permanent
instructional text for obvious controls.

## Recognition over recall

Do not require users to remember what the interface can reasonably show:
selected object, current filters, entered values after validation
failure, available actions, labels with unfamiliar icons, context when
going to detail and back.

Shortcuts may accelerate; they must not be the only discovery path.

## Decision complexity (Hick)

When the user must choose: remove irrelevant choices, group related
ones, provide sensible defaults, order by likely relevance, disclose
advanced later.

Do not blindly shorten every list. A visible, well-organized list can
beat hiding choices behind extra steps. When complexity is inherent,
move it into defaults, grouping, or context — not onto the user.

## Targets (Fitts + platform)

Important/frequent targets should be easy to acquire: size, distance,
placement, edge/corner on pointer UIs, thumb reach on touch, separation
of destructive vs safe.

Visual size and hit area need not match. Follow **this OS's** minimum
target guidance (e.g. 44 pt iOS, 48 dp Android) — do not invent one
universal pixel size.

## Density and complexity review

Ask: how many concepts, competing actions, groups, containers, alignment
lines, type styles, emphasis levels, semantic colors, and currently
irrelevant controls are visible?

Reduce **accidental** complexity. Do not blindly reduce information
density — expert tools may be dense. Goal: high information value, low
perceptual disorder.

## Compact labels

A **badge** is status. A **chip** or tag is a value the user owns or
can remove. A **filter chip** is an action on the current query. Do not
make every pill clickable, and do not encode status with color alone.

Keep a compact label on one line when practical. Do not wrap a status
pill onto two lines. If a collection overflows, wrap the collection
before shrinking labels. A `+n` overflow control must be operable, not
a dead count.

Truncation needs a disclosure that works without hover (tap, keyboard,
or expand). A `title` tooltip is not enough.

## Icon meaning by use

The same glyph is not always the same thing:

- **Decorative** next to visible text — hide it from the accessibility
  tree.
- **Meaningful** with no equivalent text — needs a text alternative.
- **Control** — needs an accessible name and, when relevant, selected /
  pressed / expanded state.

Use one icon family and one stroke/fill discipline per hierarchy level.
Do not use emoji as structural icons.

