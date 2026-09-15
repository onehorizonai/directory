# Performance

On-demand engineering detail for [../SKILL.md](../SKILL.md). Load when
the change is perf-sensitive, when investigating slowness, or when
optimizing loading / interaction.

**Measure before optimize.** Evidence-driven changes only. Don't add
memoization, virtualization, or caching on suspicion.

## Fetch current thresholds

Metric thresholds and tooling APIs change. **Prefer retrieval over memory**
when citing numbers or Lighthouse weights:

| Source | Use for |
| --- | --- |
| [web.dev / vitals](https://web.dev/articles/vitals) | Core Web Vitals definitions and current "good" thresholds |
| [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance) | Trace analysis |
| [Lighthouse scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) | Score weights / metric thresholds |

Illustrative CWV bands (verify before treating as normative in a report):

| Metric | Good (approx.) |
| --- | --- |
| LCP | < ~2.5s |
| INP | < ~200ms |
| CLS | < ~0.1 |

Always re-check [web.dev](https://web.dev/articles/vitals) when the
finding hinges on a number.

## Workflow

1. Reproduce under comparable, production-like conditions.
2. Trace / network: identify the actual bottleneck (TTFB, request
   waterfall, render-blocking CSS/JS, late-discovered fonts/images,
   long tasks, layout shift culprits, hydration cost).
3. Quantify impact; skip 0 ms "optimizations."
4. Fix the cause with the smallest change that preserves correctness,
   freshness, and authorization.
5. Re-measure; report before/after.

## Common causes (web)

### Network waterfalls and dependencies

- Sequential `await` of independent fetches — parallelize
  (`Promise.all` or equivalent).
- Critical CSS/JS blocking first paint — defer non-critical scripts;
  avoid unnecessary render-blocking.
- Late discovery of fonts/hero images — preload only what is proven
  critical; remove unused preconnects.
- API routes that await step-by-step when work can start earlier.

### Caching

- Use the project's HTTP / framework cache correctly (Cache-Control,
  RSC/data cache, CDN). Don't invent a second cache that serves stale
  authorized data.
- Client: dedupe identical in-flight requests when the stack supports it.

### Fonts and images

- Subset / `font-display` strategy consistent with the app; avoid layout
  shift from font swap (reserve space, `size-adjust`, or matched fallback).
- Images: correct dimensions, modern formats when the pipeline supports
  them, responsive `srcset` where relevant; don't ship multi‑MB heroes.

### JavaScript

- Ship less client JS: server-render when the stack allows; dynamic-import
  heavy widgets; defer analytics until after hydration.
- Avoid barrel imports that pull thousands of modules when the bundler
  doesn't optimize them (direct imports or framework
  `optimizePackageImports`).
- Don't polyfill Baseline Widely Available features.

### Rendering and interaction

- Animate compositor-friendly properties (`transform` / `opacity`); see
  [web-platform.md](web-platform.md).
- Long lists: `content-visibility` or existing virtualization — match peers.
- CLS: images/ads/embeds with size reserves; avoid injecting content above
  existing content without reservation.
- INP: break up long tasks; avoid heavy sync work on input handlers.

## React / Next notes

When on that stack, also apply parallel fetching, Suspense boundaries,
serialization hygiene, and bundle rules in
[react-and-nextjs.md](react-and-nextjs.md). Prefer official React / Next
docs if they conflict with older blog guidance.

## Output

For a perf-scoped task, report:

1. Metrics (with sources/thresholds used)
2. Top issues with estimated impact
3. Specific fixes applied
4. What was measured vs. what could not be measured
