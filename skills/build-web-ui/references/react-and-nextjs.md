# React and Next.js

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load **only
when the project is React** (and Next.js when App Router / RSC apply).

This skill remains web-first — see [web-platform.md](web-platform.md).
Prefer **official React and Next.js docs** when community skills conflict.
Do not treat library choices (Zustand, TanStack Query, shadcn, Tailwind)
as mandatory; follow what the repo already uses.

Guidance below consolidates high-impact patterns (waterfalls, bundles,
RSC boundaries, Suspense, rerenders). It is not a full framework manual.

## Server vs client components (App Router)

- Default to **Server Components** for data fetching, secrets, and
  non-interactive UI.
- Add `"use client"` only for interactivity, browser APIs, or hooks that
  require the client.
- Keep client leaves small; pass **minimal props** across the RSC → client
  boundary (serialize only fields the client uses).

**Avoid shipping unused fields:**

```tsx
// Avoid: serializes the entire user object to the client
async function Page() {
  const user = await fetchUser()
  return <Profile user={user} />
}

// Prefer: pass what the client needs
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}
```

- Same object reference across RSC children deduplicates serialization;
  mapping/filtering into new arrays on the server can duplicate payload —
  transform on the client when that is the lighter option.
- Authenticate Server Actions like any other mutation endpoint.

## Data fetching, caching, mutations

- Prefer the app's existing data layer (fetch cache, React `cache()`,
  router refresh, Query library already in tree).
- **Eliminate waterfalls:** independent async work runs in parallel.

```ts
// Avoid sequential independent awaits
const user = await fetchUser()
const posts = await fetchPosts()

// Prefer
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()])
```

- **Defer await** until the branch that needs it (don't block early returns).
- Start promises early in handlers/routes; await late.
- Use `React.cache()` for per-request dedupe when that is the project
  pattern; don't invent a cross-request LRU unless peers already do.
- After mutations: revalidate the correct tags/paths; don't leave the UI
  on stale optimistic data without rollback.

## Suspense, streaming, loading, errors

- Wrap slow segments in `<Suspense>` so shells (nav, chrome) stream first.

```tsx
export default function Page() {
  return (
    <>
      <Sidebar />
      <Suspense fallback={<Skeleton />}>
        <DataPanel />
      </Suspense>
    </>
  )
}

async function DataPanel() {
  const data = await fetchData()
  return <Panel data={data} />
}
```

- Share a started promise across children with `use()` when that matches
  current React guidance and the codebase.
- Use route `loading.js` / `error.js` (or existing equivalents) consistently
  with neighboring routes — don't invent a one-off error UI system.
- Prefer `useTransition` for non-urgent pending UI when peers do; don't
  fight an existing mutation library's isPending.

## Hydration

- Server HTML and first client render must match.
- Client-only values (`localStorage`, `Date.now()`, random IDs): gate with
  an established pattern (inline boot script, `suppressHydrationWarning`
  only where justified, or client-only mount) — avoid flash-of-wrong-theme
  and hydration errors.
- Don't read `window` during SSR render.

## Forms

- Prefer the project's form pattern: Server Actions + progressive
  enhancement, controlled forms, or existing form helpers.
- Pending: disable double submit; preserve field values on error.
- See [state-management.md](state-management.md) and
  [accessibility-implementation.md](accessibility-implementation.md).

## Bundle size (critical)

- Avoid **barrel imports** that pull huge module graphs (`lucide-react`,
  MUI, lodash) unless Next `optimizePackageImports` (or equivalent) is on.

```tsx
// Costly when unoptimized
import { Check, Menu } from 'lucide-react'

// Prefer direct paths or optimized package imports config
import Check from 'lucide-react/dist/esm/icons/check'
```

- Dynamic-import heavy editors, charts, and modals (`next/dynamic` /
  `React.lazy`) when not needed for first paint.
- Defer analytics/third-party until after hydration when product allows.
- Load optional features only when activated; preload on hover/focus only
  when measurement shows benefit.

## Rerenders (medium)

- Don't subscribe to high-frequency state only used in callbacks — read
  at call time / refs / event handlers.
- Prefer derived booleans / media queries over continuous width
  subscriptions for layout switches.
- Functional `setState`; lazy `useState(() => init)` for expensive inits.
- `startTransition` for non-urgent updates; don't blanket-`memo` everything.
- Conditional render with ternary (`condition ? <A /> : null`) when `0`
  / `''` could render accidentally via `&&`.

## Composition

Component API design: [composition-patterns.md](composition-patterns.md).

## Official docs (prefer when unsure)

- [React docs](https://react.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)

Re-check current APIs (`use()`, `after()`, Activity, cache semantics) —
framework defaults move faster than this reference.
