# Data-heavy UI

On-demand guidance for [../SKILL.md](../SKILL.md). Load for dashboards,
tables, metrics, and charts. Short by design: **hierarchy and clarity
before decoration**.

## Start with the question

Before chart or table chrome:

1. What decision or question does this surface answer?
2. Who is the audience (operator, exec, analyst)?
3. At-a-glance monitoring vs exploratory analysis?
4. What is the one primary metric or object per region?

If the answer is unclear, the viz will decorate noise.

## Hierarchy before decoration

- Most important metrics toward the start of the reading path (e.g.
  top-start for LTR); quieter context beside or below.
- One focal chart or KPI group per section; avoid equal-weight widget
  walls.
- Group related metrics with proximity; consistent sizing beats ornamental
  cards.
- Shared category colors mean the same thing across the page.
- Prefer dense, scannable layout over chart-junk (3D, heavy gradients,
  ornamental shadows, dual-axis tricks).
- Grayscale test still applies: structure and weight must work without
  hue.

## Tables and density

- Tables for comparison and precise values; charts for patterns and
  trends — often both (summary + table alternative).
- Align numbers for comparison (tabular nums, end-aligned).
- Sticky header and frozen leading identity column when scroll is long.
- Column priority on narrow widths; don’t shrink every column to useless.
- Row actions: secondary until hover/focus/selection; bulk actions need
  count preview and clear scope (“12 selected”).
- Empty, loading, and error rows/cells specified — not blank holes.
- Many rows: pagination or virtualization intent; filter/search before
  infinite undifferentiated scroll.

## Charts (design intent)

Match type to relationship:

- **Compare categories** → bar (start value axis at zero)
- **Trend over time** → line (few series; label directly when possible)
- **Part-to-whole** → stacked bar / careful treemap; pie only for very few
  parts with a dominant slice
- **Correlation** → scatter (label outliers)

Color: sequential / diverging / categorical scales used on purpose; avoid
red–green-only encodings; patterns or direct labels as backup.

Interaction: legend toggle, focus/hover highlight, brush/zoom with reset;
tooltips add precision — never the only way to read a value (touch and
keyboard need access).

Real-time: show last-updated; don’t disorient with full-viz thrash.

## Dashboards

- Global filters (time range, segment) update related views together.
- Breathing room: dense ≠ cramped; walls of equal cards overwhelm.
- Avoid auto-refresh without indication.
- Drill-in: selecting a point should clarify detail, not open decorative
  modals with the same number larger.


## Metrics copy and honesty

- Every KPI shows **unit**, **time span**, and ideally a comparison
  (vs prior period, target, or baseline).
- Null, zero, and missing are visually distinct — missing is not plotted
  as zero without explanation.
- Round for scanning in charts; give exact values in table/tooltip/detail.
- Avoid decorative “hero metrics” that aren’t the user’s real data.

## Operator stress

Data tools are often used under time pressure:

- Prefer predictable layouts over novelty.
- Make the next troubleshooting step obvious when data looks wrong
  (refresh, range, source, permissions).
- Dangerous filters (delete, export PII, share) sit behind clear labeling
  and confirmation — see
  [hardening-and-edge-cases.md](hardening-and-edge-cases.md).

## Anti-patterns

- Chart junk and dual Y-axes that invite false comparison
- Truncated bar axes that exaggerate differences
- 10+ undifferentiated series
- Color-only series encoding
- Tooltip-only values
- KPI vanity numbers without comparison, unit, or time range
- Identical card grids of metrics with no priority
- Tables that only work at desktop full width with no strategy

## Verification

- [ ] User question stated; chart/table choice matches it
- [ ] Visual priority obvious in grayscale
- [ ] Numbers comparable (alignment, units, time span)
- [ ] Accessible alternative: text insight and/or table
- [ ] Narrow-width behavior defined
- [ ] Empty/loading/error for data regions defined
- [ ] Interactions work without hover-only reliance

## Official links

- [WCAG: Use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [SVG Accessibility / charts](https://www.w3.org/TR/svg-aam-1.0/) (handoff awareness)
- Live typography/numerics: [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
