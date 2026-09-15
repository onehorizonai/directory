# Composition patterns

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
designing component APIs, refactoring boolean-prop explosions, or sharing
state across composed pieces.

Composition should make the next change **easier to understand**, not add
layers for their own sake. Prefer the patterns the codebase already uses.
Examples below are React-shaped; apply the same ideas in other component
models (slots, named fragments, render trees).

## Prefer composition over boolean props

Each boolean doubles the state space and hides which combinations are
valid. Prefer explicit variants that compose shared internals.

**Avoid:**

```tsx
function Composer({
  isThread,
  isDMThread,
  isEditing,
  isForwarding,
}: Props) {
  return (
    <form>
      {isDMThread ? <AlsoSendToDM /> : isThread ? <AlsoSendToChannel /> : null}
      {isEditing ? <EditActions /> : isForwarding ? <ForwardActions /> : <DefaultActions />}
    </form>
  )
}
```

**Prefer:** dedicated `ChannelComposer`, `ThreadComposer`, `EditComposer`
that each assemble the same primitives (`Composer.Frame`, `Composer.Input`,
footer pieces) without a combinatorial parent.

## Compound components

For complex widgets, export a small set of cooperating parts that share
context, and let callers compose only what they need:

```tsx
<Composer.Provider state={state} actions={actions} meta={meta}>
  <Composer.Frame>
    <Composer.Header />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Submit />
    </Composer.Footer>
  </Composer.Frame>
</Composer.Provider>
```

Avoid a monolithic component with many `renderX` / `showX` knobs.
Prefer `children` over `renderHeader={() => …}` when the slot is just
"put stuff here."

## Explicit variants

If two modes differ in structure or behavior, make two components (or two
routes) instead of `mode="edit" | "create" | "duplicate"` with deep
conditionals — unless the product already standardizes on a single mode
prop and peers follow it.

## State ownership at the composition boundary

- Lift state into a provider when siblings outside the visual tree must
  read/write it (dialog actions + preview + input).
- Keep the **provider** as the only module that knows storage details
  (local `useState`, URL, server mutation hook).
- Expose a stable interface: **state**, **actions**, **meta** (refs,
  ids). UI parts consume the interface, not a concrete hook.

```tsx
interface ComposerContextValue {
  state: { input: string; isSubmitting: boolean }
  actions: {
    update: (updater: (s: ComposerContextValue['state']) => ComposerContextValue['state']) => void
    submit: () => void
  }
  meta: { inputRef: React.RefObject<HTMLInputElement | null> }
}
```

Different providers can implement the same interface (ephemeral forward
dialog vs. channel draft) without rewriting inputs and buttons.

## Controlled vs uncontrolled

Match the parent: if the app already controls value/`onChange`, stay
controlled. If native form semantics dominate, uncontrolled + FormData is
fine. Don't make every leaf controlled "for consistency."

## When not to abstract

- One call site — don't invent a compound API
- A single boolean that maps to one clear product mode peers already use
- Wrapping the design system just to rename props

Follow [state-management.md](state-management.md) for where data lives;
composition only structures *access*.
