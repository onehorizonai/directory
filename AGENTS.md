# AGENTS.md

Instructions for agents (and humans) working in this repository: how to
author and update skills, regenerate indexes, and what the website
consumes from this repo.

Install instructions for end users live in [README.md](README.md) — do
**not** put install steps inside individual `SKILL.md` files.

## Repository map

```
directory/
  AGENTS.md                   # this file — agent/maintainer how-to
  README.md                   # human browse + install
  CONTRIBUTING.md             # short pointer here
  LICENSE
  _template/                  # copy this to start a new skill
    SKILL.md
  .claude-plugin/
    marketplace.json          # generated — Claude Code plugin manifest
  schema/
    skill.schema.json         # JSON Schema for SKILL.md frontmatter
    categories.json           # closed list of allowed categories
    runtimes.json             # closed list of runtime ids
    task-modes.json           # closed list of One Horizon workflow task modes
    work-objects.json         # closed list of One Horizon work-object kinds
  scripts/
    validate.mjs              # validates every skills/*/SKILL.md
    build-index.mjs           # generates index.json + marketplace.json
  skills/
    <skill-name>/
      SKILL.md
      agents/openai.yaml      # required — OpenAI/Codex presentation
      assets/                 # required icons (+ optional other assets)
      references/             # optional, loaded on demand
      scripts/                # optional
  index.json                  # generated — the website's fetch target
```

`_template/` lives at the repo root, not inside `skills/`, so it is never
picked up as an installable skill when this repo is added as a Claude Code
plugin marketplace.

`index.json` and `.claude-plugin/marketplace.json` are generated,
committed, and diff-checked in CI — keep them in sync with `SKILL.md`.

## Adding or updating a skill

1. Copy the template (new skills only), renamed to kebab-case:

   ```
   cp -r _template skills/your-skill-name
   ```

2. Edit `skills/your-skill-name/SKILL.md`:
   - `name` must exactly match the folder name.
   - `description` is **trigger text** for agents deciding whether to
     invoke the skill — not marketing copy for humans.
   - Fill in `metadata.title`, `metadata.tagline` (≤160 chars), and
     `metadata.category` (an id from `schema/categories.json`).
   - Add `metadata.tags` if relevant.
   - Add `metadata.compatibility.runtimes` if the skill depends on
     specific tooling (values from `schema/runtimes.json`); omit it
     entirely if the skill works on any Agent-Skills-compatible runtime.
   - Add `metadata.compatibility.oneHorizon.taskModes` if the skill is
     intended for a specific One Horizon workflow step (values from
     `schema/task-modes.json`; see the mode mapping below). Omit
     `oneHorizon` entirely for skills that aren't workflow-bound (design
     and copywriting skills, for example).
   - Add `metadata.worksOn` only when the skill genuinely doesn't apply to
     every One Horizon work object (values from `schema/work-objects.json`,
     e.g. `bug` for a bug-only skill). Omit it when the skill applies
     equally to any object.
   - Add `metadata.source` only for an external submission that should
     preserve its original provenance (`kind: external`, plus
     `repository` and `maintainer`). Omit it for skills authored/
     maintained in this repo — the index build fills in this repo's own
     provenance (`kind: one-horizon`) automatically.
   - Write the three required body sections: `## Overview`,
     `## When to use`, `## Examples`.
   - Add `references/`, `scripts/`, or extra `assets/` as needed, and
     link to those files from the body with **relative** markdown links.

3. Add OpenAI/Codex presentation metadata (required by `npm run validate`):
   - `agents/openai.yaml` with quoted `interface` fields:
     `display_name` (must match `metadata.title`), `short_description`
     (25–64 chars), `icon_small`, `icon_large`, `brand_color`
     (`#` + uppercase 6-digit hex), optional `default_prompt` (must
     mention `$<skill-name>`).
   - Separate SVG icons at the paths referenced by the yaml
     (`icon-small` viewBox `0 0 32 32`, `icon-large` viewBox `0 0 64 64`).
   - Do not put presentation fields (`icon_*`, `brand_color`,
     `default_prompt`) in `SKILL.md`.

4. Validate and regenerate:

   ```
   npm install
   npm run validate
   npm run build-index
   ```

5. Commit `SKILL.md`, any `references/` / `assets/` / `agents/` changes,
   plus regenerated `index.json` and `.claude-plugin/marketplace.json`.
   Open a PR — CI re-runs validate and fails if generated files are stale.

### Review checklist

Mirrors what `npm run validate` checks:

- [ ] `name` is kebab-case and matches the folder name exactly.
- [ ] `name` doesn't collide with an existing skill (case-insensitively).
- [ ] `description` is present and non-empty.
- [ ] `metadata.title` and `metadata.tagline` are present; `tagline` ≤160
      chars.
- [ ] `metadata.category` is one of `schema/categories.json`.
- [ ] `metadata.tags`, if present, are lowercase-kebab with no duplicates.
- [ ] `metadata.compatibility.runtimes`, if present, values are from
      `schema/runtimes.json`.
- [ ] `metadata.compatibility.oneHorizon.taskModes`, if present, values
      are from `schema/task-modes.json`.
- [ ] `metadata.worksOn`, if present, values are from
      `schema/work-objects.json`.
- [ ] `metadata.source`, if present, has `kind: external` (curated skills
      omit `source` and get the repo's default provenance automatically).
- [ ] Body has non-empty `## Overview`, `## When to use`, and
      `## Examples`.
- [ ] Relative links to `references/`, `assets/`, or `scripts/` resolve.
- [ ] `agents/openai.yaml` + icon assets pass OpenAI metadata checks.
- [ ] `index.json` and `.claude-plugin/marketplace.json` are regenerated
      and committed.

### Skill writing conventions

Skills describe work with a small set of modes (maintainer index — do
**not** cross-link other skill names from a `SKILL.md`):

- **Plan** — turns a request into an implementation plan; never edits
  code.
- **Research** — investigates and returns sourced findings; never edits
  code.
- **Review** — checks a fixed target against a baseline; never edits the
  thing under review.
- **Code** / **Build** / **Debug** / **Refactor** — carries out an
  already-approved change and verifies it.
- **Verify** — independently checks a completion claim after the fact.
- **Write** — produces copy for an already-decided scope.

When a skill's mode above maps onto a One Horizon workflow step, set
`metadata.compatibility.oneHorizon.taskModes` to the matching wire value
from `schema/task-modes.json`: Plan → `plan`, Research → `research`,
Review → `review`, Code / Build / Debug / Refactor → `code`, Verify →
`review` (there is no separate verifier task mode). Write, and any skill
outside this mode list (Design, for example), isn't bound to a One Horizon
workflow step — omit `oneHorizon` for those.

Each skill must stand alone: describe out-of-scope situations by artifact
type / work state / requested outcome, not by naming another skill. Don't
invent a skill-specific second source of truth (`spec.md`, `plan.md`);
`## Output` is the contract for what the skill returns.

When referring to One Horizon work records, use **Initiative**, **Bug**,
or **TODO** — not bare `ticket` / `issue` / `story` — when you mean those
objects. Leave generic language for things the product doesn't own (Git
branches, PRs, browser pages, third-party trackers).

Prefer putting long catalogs, checklists, and on-demand detail in
`references/` and linking them from Procedure / Boundaries, rather than
inflating `SKILL.md`.

## Website integration (`index.json`)

This repo's public contract with [onehorizon.ai/directory](https://onehorizon.ai/directory)
is a single generated file at the repo root: `index.json`.

### Fetching it

`index.json` is committed on `main` and regenerated (with a diff check) by
CI on every merge, so a plain raw-file fetch always returns current data —
no API, no separate publish step:

```
https://raw.githubusercontent.com/onehorizonai/directory/main/index.json
```

### Shape

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
      "source": {
        "kind": "one-horizon",
        "repository": "onehorizonai/directory",
        "maintainer": "One Horizon"
      },
      "compatibility": {
        "runtimes": ["claude-code", "cursor"],
        "oneHorizon": { "taskModes": ["code"] }
      },
      "worksOn": ["bug"],
      "overview": "...",
      "whenToUse": "...",
      "examples": "...",
      "path": "skills/example-skill-name/SKILL.md"
    }
  ]
}
```

See [`skills/review-code/SKILL.md`](skills/review-code/SKILL.md) for a
real skill whose index entry follows this shape.

- `category` values come from `schema/categories.json` — fetch that file
  too if you need display labels rather than raw ids.
- `source` is always present. Curated skills get this repo's default
  provenance (`kind: "one-horizon"`) automatically when `metadata.source`
  is omitted; external submissions carry the provenance they declared.
- `compatibility.runtimes` is an empty array when omitted in frontmatter
  (skill works on any Agent-Skills-compatible runtime); only list runtimes
  when the skill is tied to specific tooling.
- `compatibility.oneHorizon.taskModes` is an empty array when the skill
  isn't bound to a specific One Horizon workflow step — values come from
  `schema/task-modes.json` (fetch it for display labels; render plain
  language like "Useful for planning", not the raw wire value).
- `worksOn` is an empty array when the skill applies to any One Horizon
  work object equally — values come from `schema/work-objects.json`
  (fetch it for display labels like "For bugs").
- `overview` / `whenToUse` / `examples` are the raw markdown bodies of
  those `SKILL.md` sections — render as markdown on the site.
- `path` lets the site link to or fetch the full `SKILL.md` via the same
  raw-file pattern as above.

### Future entry types

Other directory content (MCP server configs, plugins, etc.) should add a
**sibling key** on this same file — `"mcpServers"`, `"plugins"` — rather
than changing `index.json`'s shape or introducing a second fetch target.
The website's fetch contract should not need to change just because the
directory grows a new entry type.

### Frontmatter note

Directory-only metadata lives under a `metadata` key in each `SKILL.md`
frontmatter (`schema/skill.schema.json`), not in a separate file, on the
assumption that Agent-Skills-compatible runtimes tolerate unread keys
beyond `name` / `description`. If a runtime rejects unrecognized
frontmatter, the fallback is a sibling `meta.yaml` per skill (validator
would assert `name` matches); that would only change how
`scripts/build-index.mjs` reads metadata, not this `index.json` shape.

## What not to do

- Don't edit `index.json` or `.claude-plugin/marketplace.json` by hand —
  run `npm run build-index`.
- Don't put install instructions in `SKILL.md`.
- Don't put OpenAI presentation metadata in `SKILL.md`.
- Don't add a skill under `skills/` without `agents/openai.yaml` and the
  required icons.
- Don't commit without `npm run validate` passing.
