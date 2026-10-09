# Consolidated findings template

Structure for one findings artifact, updated in place as sources are
reviewed — not a new summary per source. Drop sections a small question
doesn't need; use all of them once a question needs more than a couple of
sources.

## Question

The exact question or decision, in one or two sentences.

## Scope & freshness

- System/product/version/geography boundaries and explicit exclusions.
- Freshness window: how current the answer must be.
- Audience and purpose: why the answer is needed.

## Primary-source categories checked

What counts as a primary source for this domain (official docs/specs,
source code, standards bodies, first-hand reports, direct statements), and
which categories were checked versus skipped, and why.

## Findings

| Claim | Evidence | Source | Confidence | Notes |
| --- | --- | --- | --- | --- |
| The specific claim | The fact/quote/data supporting it | Name, link, or file — traceable to an origin, not another summary | High / medium / low, and why | Recency, primary or secondary source, etc. |

Merge duplicate claims into one row. Raise confidence only on rows
corroborated by unrelated primary sources, not when several secondary
sources repeat one original claim.

## Contradictions & resolution

For each contradiction: the conflicting claims, their sources, and either
how it was resolved (and why one source was preferred) or a statement
that it remains unresolved.

## Coverage gaps

What could not be checked, and why (inaccessible source, out of scope,
tool couldn't reach it). List everything that wasn't checked.

## Recommendation

The answer or recommendation that follows from the findings, with
uncertainty stated next to the part it qualifies, not as a closing
disclaimer.
