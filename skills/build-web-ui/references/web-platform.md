# Web platform (framework-independent)

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
implementing layout, forms, navigation, focus, scroll, or progressive
enhancement — especially before reaching for a library.

This skill is **web-first**. Prefer HTML, CSS, and browser APIs that already
solve the problem. Framework guidance belongs in
[react-and-nextjs.md](react-and-nextjs.md) only when the project is React.

When MDN / web.dev / a Living Standard disagree with community writeups,
prefer [WHATWG HTML](https://html.spec.whatwg.org/multipage/), W3C CSS TRs,
[MDN](https://developer.mozilla.org/), and [web.dev Baseline](https://web.dev/baseline).

UX / visual hierarchy decisions (what should be prominent, how it should
feel) are not this file — follow the product's design system and current
public web UI guidance named in [../SKILL.md](../SKILL.md). This file is
how to implement with HTML/CSS/platform APIs.

## Authoring layers (lowest first)

Place each requirement in the lowest layer that can express it:

| Layer | Owns | Prefer |
| --- | --- | --- |
| Markup | Structure, landmarks, native controls | Semantic HTML |
| Style | Layout, appearance, hover/focus, responsive | Modern CSS |
| Behavior | Fetch, events, observers, custom elements | Smallest Web API |
| Animation | Enter/exit, scroll-tied motion | CSS / View Transitions; compositor-only props |

Promote upward only when the lower layer cannot do the job.

## Semantic HTML

- Landmarks first: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`,
  `<article>`, `<section>`, `<search>` — not `<div role="…">` when the
  element exists.
- Prefer native controls: `<button>`, `<a href>`, `<input>`, `<select>`,
  `<textarea>`, `<dialog>`, `<details>`/`<summary>`, form labels.
- Never nest interactive elements (`<button>` inside `<a>`, etc.).
- Never use `<br>` for vertical spacing — that is CSS.
- Don't reinvent what the platform already focuses, labels, and announces.

## Modern CSS (implementation)

Reach for CSS before JS for the same effect when Baseline support allows:

- Layout: Grid and Flexbox; intrinsic sizing (`min-content`, `max-content`,
  `fit-content`, `minmax`, `fr`).
- Responsiveness: container queries (`@container`) for component-driven
  layout; media queries for viewport/capability when needed. See
  [responsive-implementation.md](responsive-implementation.md).
- State in CSS: `:has()`, `:focus-visible`, `:focus-within`,
  `:user-invalid` where supported.
- Theming: custom properties, `color-mix()`, `light-dark()` when appropriate.
- Scoping: `@layer`, `@scope` when they clarify cascade ownership — not as
  decoration.

Gate **Newly Available** features with `@supports` (or JS feature detection)
and a working fallback. Do not polyfill features that are already Baseline
Widely Available. Check current status rather than memorizing dates:
[web.dev Baseline](https://web.dev/baseline),
[web-features](https://web-platform-dx.github.io/web-features/).

## Progressive enhancement

1. Core content and actions work with HTML (and CSS) alone where feasible.
2. Enhance with CSS for layout and affordances.
3. Add JS for behavior the platform cannot express — keep the no-JS path
   usable when the product requires it.
4. Feature-detect; never UA-sniff.

## Browser APIs (prefer platform)

| Need | Prefer |
| --- | --- |
| HTTP | `fetch` + `AbortController` |
| Visibility / lazy work | `IntersectionObserver` |
| Size changes | `ResizeObserver` (or container queries) |
| Deep clone | `structuredClone` |
| Dialog | `<dialog>` + `showModal()` |
| Inert background | `inert` (not `aria-hidden` alone) |
| Clipboard / share / etc. | Platform APIs with permission UX |

Avoid scroll handlers that read layout every frame (`getBoundingClientRect`
in `scroll`) — that forces synchronous layout. Prefer observers.

## Forms, navigation, focus, scroll

- Forms: visible `<label>` (not placeholder-only), correct `type` /
  `autocomplete`, associate errors with fields, allow paste into password
  and constrained fields unless the approval forbids it.
- Navigation: real links for locations (`<a href>`); buttons for actions.
  Don't fake routing with non-link clickables when a URL is meaningful.
- Focus: DOM order matches reading order; `tabindex` only `0` or `-1`
  (positive tabindex is an anti-pattern). Use `:focus-visible` for rings;
  never `outline: none` without a visible replacement.
- Dialogs: prefer native modal dialog (focus trap + inert background).
  Restore focus to the invoker on close.
- Scroll: preserve position across in-place updates; use
  `scroll-margin` / `scroll-padding` so sticky chrome doesn't obscure
  focused or target elements.

## Animation (compositor-safe)

For continuous motion, animate `transform`, `opacity`, and (when promoted)
`filter` — not `width` / `height` / `top` / `left` / margin / padding every
frame. Respect `prefers-reduced-motion` (see
[accessibility-implementation.md](accessibility-implementation.md)).

## Build step vs runtime

Introduce a bundler when TypeScript, tree-shaking payoff, npm-only CJS, or
large module graphs require it. Don't add a build step for a handful of
native ES modules on a static page. Follow the **project's** existing
toolchain — this skill does not migrate stacks.

## Anti-patterns

- Div soup + ARIA to recreate native controls
- Polyfilling Widely Available features
- Layout thrashing in scroll/resize handlers
- Animating layout properties for decorative motion
- New dependency for a one-liner the platform already has
