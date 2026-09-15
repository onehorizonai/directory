# State management

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
deciding where UI or domain state lives, what survives navigation, or
whether a shared store is justified.

Do **not** introduce Zustand, Redux, Jotai, TanStack Query, etc. merely
because state exists. Use them only when the project already does, or when
an explicit approval adds them. Prefer framework and platform capabilities
first (component state, URL, server cache, form APIs).

## Kind of state

| Kind | Typical home | Survives navigation? |
| --- | --- | --- |
| **Local UI** | Component / nearest owner (open/closed, hover, ephemeral highlight) | Usually no |
| **Derived** | Computed from props/state/URL — do not store a copy | N/A |
| **Form** | Controlled fields, or native form + FormData / framework form helpers | Draft may need explicit persistence |
| **URL** | Search params, path segments, hash — shareable, bookmarkable, back/forward | Yes (by design) |
| **Server** | Fetched resources; cache/revalidate owned by server or data library | Via cache keys / revalidation |
| **Shared app** | Context or store only when distant siblings need the same mutable truth | Explicitly designed |
| **Persisted** | `localStorage` / `sessionStorage` / IndexedDB / cookies — versioned schema | Across sessions (define which) |

## Rules

1. **Smallest scope that works.** Colocate state with the only consumer;
   lift only when a sibling or parent must coordinate.
2. **One authoritative owner** per piece of truth. Don't mirror the same
   value in URL + global store + local state without a clear sync story.
3. **Derive, don't duplicate.** If it can be computed from props, URL, or
   server data, don't keep a second writable copy.
4. **Don't copy server data into global client state** "for convenience."
   Keep server state in the fetch/cache layer the app already uses; pass
   props or read from that cache. Client global state is for true
   client-only cross-cutting concerns (e.g. wizard draft not yet saved).
5. **URL for shareable UI state** when the product already treats that
   concern as addressable (filters, selected tab, pagination, deep links).
   Don't put ephemeral hover or one-off modal open state in the URL unless
   the approval says so.
6. **Persistence is a product decision.** Version stored schemas; handle
   missing/corrupt data; never block first paint on large sync storage
   reads without a plan (see hydration notes in
   [react-and-nextjs.md](react-and-nextjs.md) when on React).

## Ownership checklist (before implementing)

For each piece of state the change touches, write down:

- Owner (component, route, server cache, store module)
- Who may write it
- What resets it (navigation, logout, success, cancel)
- What must survive (reload, back, refresh, tab restore)
- Loading / empty / error / permission variants and which owner drives them

## Forms

- Prefer uncontrolled + progressive enhancement or the project's existing
  form pattern (Server Actions, remix Form, etc.) over a novel form library.
- Pending submit: disable or guard duplicate submits; keep field values on
  validation failure.
- Associate errors with fields; expose status to assistive tech (see
  [accessibility-implementation.md](accessibility-implementation.md)).

## Shared state without abstraction theater

When composition needs shared state across siblings, a small provider with
an explicit **state / actions / meta** interface is enough — see
[composition-patterns.md](composition-patterns.md). The provider is the
only place that knows *how* state is stored; consumers depend on the
interface.

## Interruption

Define behavior for: slow network, abort/retry, expired auth, tab
backgrounding, and navigating away with unsaved input. Never report
success if the server rejected the mutation; never leave duplicate
in-flight requests that double-apply.

## Anti-patterns

- Global store for a single form's field values
- Syncing server list into Redux "so components stay dumb" when props/cache
  suffice
- Storing derived filters that already exist as search params
- New state library mid-change without approval
- Optimistic UI that can't roll back or reconcile with the server
