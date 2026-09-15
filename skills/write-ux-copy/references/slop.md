# Copy slop (interface)

On-demand edit pass for [../SKILL.md](../SKILL.md). Load before
finalizing strings. These rules apply to **user-facing copy this skill
produces**, not to this skill's own documentation.

Fail the pass if any check below is still true.

## Em dashes

Drafted strings must not contain `—`.

Dashes are a fake pause in UI text. They also mangle in localization and
read poorly in a screen reader.

Replace with a period, a comma, a colon, or two sentences. A spaced
hyphen (` - `) used as the same beat does not count as a fix.

| Fail | Pass |
| --- | --- |
| Couldn't save — try again | Couldn't save. Try again. |
| Delete this project — this can't be undone | Delete this project? This can't be undone. |

Count `—` in the output. The bar is zero, not "fewer."

## One next action

Name the thing. Offer the recovery the interface actually has.

Do not stack three CTAs or three causes when only one is real.

| Fail | Pass |
| --- | --- |
| Check your connection, try again, or contact support | Couldn't upload. Try again. |
| Get started, explore templates, or watch a tour | Create a project |

If the implementation only retries, the copy only retries.

## Synonym triplets

Do not pad a string with three near-synonyms or three stacked
adjectives.

| Fail | Pass |
| --- | --- |
| Fast, simple, and secure upload | Upload the file |
| Something went wrong. Please check, retry, and try again later | Couldn't save. Try again. |

Keep the one word you mean. Two items are fine when they are actually
two different actions (Retry / Cancel). Three only when the product
truly has three distinct, usable paths.

## Lists that should be a sentence

Empty states, errors, and confirmations are not feature grids. If a
bullet list could be one sentence with one action, write the sentence.

Do not ship "It's not X, it's Y" in interface copy.
