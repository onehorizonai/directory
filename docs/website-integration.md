# Website integration

This repo's public contract with onehorizon.ai/directory is a single generated
file at the repo root: `index.json`.

## Fetching it

`index.json` is committed on `main` and regenerated (with a diff check) by CI
on every merge, so a plain raw-file fetch always returns current data — no
API, no separate publish step:

```
https://raw.githubusercontent.com/onehorizonai/directory/main/index.json
```

## Shape

```json
{
  "skills": [
    {
      "name": "example-skill-name",
      "title": "Example Skill",
      "tagline": "One sentence a human scans while browsing the list.",
      "description": "Runtime-facing trigger text: when an agent should invoke this skill.",
      "category": "productivity",
      "tags": ["example-tag"],
      "compatibility": ["claude-code", "cursor"],
      "overview": "...",
      "whenToUse": "...",
      "examples": "...",
      "path": "skills/example-skill-name/SKILL.md"
    }
  ]
}
```

(See [`skills/review-code/SKILL.md`](../skills/review-code/SKILL.md)
for a real entry with real values in this exact shape.)

- `category` values come from `schema/categories.json` — fetch that file too
  if you need display labels rather than raw ids.
- `compatibility` is omitted (empty array) when a skill works on any
  Agent-Skills-compatible runtime; only list it when a skill is tied to a
  specific runtime's tooling.
- `overview` / `whenToUse` / `examples` are the raw markdown body of each
  `SKILL.md` section, unprocessed — render as markdown on the site.
- `path` lets the site link to or fetch the full `SKILL.md` (e.g. for a
  "view source" or "copy install command" action) via the same raw-file
  pattern as above.

## Adding future entry types

The parent initiative anticipates other directory content beyond skills
(MCP server configs, plugins, etc.). When those land, they add a **sibling
key** to this same file — `"mcpServers"`, `"plugins"` — rather than changing
`index.json`'s shape or introducing a second file. The website's fetch
contract should never need to change just because the directory grows a new
entry type.

## Note on frontmatter shape

Each skill's directory-only metadata lives nested under a `metadata` key in
its `SKILL.md` frontmatter (see `schema/skill.schema.json`), rather than in a
separate file, on the assumption that Agent-Skills-compatible runtimes
tolerate frontmatter keys beyond `name`/`description` that they don't read.
If a target runtime turns out to reject unrecognized frontmatter keys, the
fallback is a sibling `meta.yaml` per skill folder carrying the same fields,
with the validator asserting its `name` matches the SKILL.md `name`. That
would only change how `build-index.mjs` reads the metadata, not this file's
output shape.
