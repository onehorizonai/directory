# UI reasoning model

On-demand method for [../SKILL.md](../SKILL.md). Load **before placing
screens, components, cards, buttons, or styling**. A UI is the rendered
consequence of this model — not the starting point.

Review: **reconstruct** this model from the running page and any
design handoff. Do not start from whether the screenshot looks good.

## Order (do not skip ahead)

Outcome → Objects → Actions → Concepts → Use cases → Priority →
States → Structure → Hierarchy → Interaction → Visual refinement →
Verification

## Outcome

What the surface enables the user to accomplish, independent of a
particular UI.

| Bad (UI) | Better (outcome) |
| --- | --- |
| Add a modal for creating an agent | Let a user create and configure an agent |
| Put a Compose FAB on the inbox | Let a user start writing a message |

If the outcome cannot be established from evidence, stop and report
that gap — do not invent a model to find defects against.

## Objects

Nouns the user understands and interacts with. Prefer the user's mental
model over backend or module names. Do not expose an implementation
concept just because it exists in the data model.

Email-shaped example: message, recipient, account, inbox, folder, label,
attachment, spam message.

For each important object record:

- identity (how the user tells instances apart)
- important attributes
- relationships to other objects
- lifecycle / state
- actions available on it
- whether it can exist alone or only inside another object

## Actions

Verbs applied to objects. This map is the basis for navigation,
contextual actions, menus, toolbars, shortcuts, and progressive
disclosure.

Example:

- **Message:** read, reply, forward, archive, delete, mark unread, label
- **Inbox:** search, filter, sort, refresh
- **Account:** connect, disconnect, configure

Do not start from a toolbar and invent actions to fill it.

## Concepts

Higher-level jobs that combine several objects and actions. Optimize the
UI for these, not for the app's internal architecture.

Example: writing an email; finding a message; keeping the inbox
organized; removing spam; switching accounts.

A concept is not a screen name. "Settings stack" is architecture;
"switching accounts" is a concept.

## Use cases

Turn the model into user capabilities:

`A user should be able to [action] [object/outcome] [context or constraint].`

| Bad (UI) | Good (capability) |
| --- | --- |
| A user can click the blue Compose button | A user can start composing a message from the inbox |
| A user sees a red badge | A user can tell that unread messages are waiting |

Examples:

- A user should be able to compose a message and send it to multiple
  recipients.
- A user should be able to identify which account received a message.
- A user should be able to recover a message they deleted accidentally.

For **important** use cases also name: trigger, prerequisites, primary
path, alternate paths, interruption/recovery, completion, failure.

Every UI element should support an object, action, concept, state, or
use case. If it supports none of them, question why it exists.

## Priority (attention budget)

Score concepts and actions **before** designing hierarchy. Do not equate
priority with visual size automatically.

| Score | Meaning |
| --- | --- |
| **1 — Primary** | The reason this surface exists in the current context |
| **2 — Important** | Frequent or high-consequence; must stay easy to reach |
| **3 — Supporting** | Useful; should not compete with 1–2 |
| **4 — Rare / contextual** | Shown when the object or choice makes it relevant |
| **5 — Exceptional / advanced** | Overflow, disclosure, or a dedicated surface |

Derive the score from: importance to the outcome, frequency, urgency,
consequence of missing it, current context, and user expertise where
relevant. If evidence doesn't support a rank, mark it unknown — do not
invent one.

Higher priority generally means: easier to discover, fewer steps, stronger
placement, stronger contrast *where appropriate*, larger or clearer
target *where appropriate*, persistent when needed.

Lower priority generally means: quieter treatment, contextual placement,
menus, disclosure, secondary surfaces.

If everything demands attention, nothing has hierarchy.

## Progressive disclosure

Only expose information and controls when they are useful **now**.

Prefer: essential → contextual → advanced.

- Primary action visible.
- Object-specific secondary actions near the object.
- Rare actions in an overflow menu.
- Advanced configuration behind disclosure.
- Controls that apply only after a choice appear after that choice.

Do not hide frequently used functionality just to look minimal.
Simplicity is removing **irrelevant** complexity from the current task,
not minimizing visible pixels.

Avoid deep disclosure stacks. If users repeatedly open several layers to
reach something, the information architecture is wrong.
