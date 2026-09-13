# Consolidated findings template

Reusable structure for maintaining findings across a research session —
update this in place as sources are reviewed rather than writing a new
summary per source. Drop sections that don't apply to a small question; use
the full structure once a question needs more than a couple of sources.

## Question

The exact question or decision being answered, restated in one or two
sentences.

## Scope & freshness

- System/product/version/geography boundaries and explicit exclusions.
- Freshness window: how current the answer must be.
- Audience and purpose: why the answer is needed.

## Primary-source categories checked

What counts as a primary source for this question's domain (official
docs/specs, source code, standards bodies, first-hand reports, direct
statements), and which of those categories were actually checked versus
skipped and why.

## Findings

| Claim | Evidence | Source | Confidence | Notes |
| --- | --- | --- | --- | --- |
| The specific claim being made | The specific fact/quote/data supporting it | Where it came from (name, link, or file — traceable to an origin, not another summary) | High / medium / low, and why | Anything relevant: recency, whether it's a primary or secondary source, etc. |

Merge duplicate claims into one row as sources accumulate. Strengthen
(raise confidence on) rows independently corroborated by unrelated
primary sources. Don't inflate confidence just because several secondary
sources repeat the same original claim.

## Contradictions & resolution

For each contradiction found: the conflicting claims, their sources, and
either how it was resolved (and why one source was preferred) or an
explicit statement that it remains unresolved.

## Coverage gaps

What could not be checked, and why (inaccessible source, out of scope, tool
couldn't reach it). Never silently omitted — if it wasn't checked, it's
listed here.

## Recommendation

The answer or recommendation that follows from the findings above, with
uncertainty stated next to the part of the answer it qualifies rather than
as a blanket disclaimer at the end.
