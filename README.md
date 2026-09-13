# directory

The canonical, curated home for One Horizon skills — and, over time, other
directory content like MCP server configs and plugins.

Browse the full listing at **[onehorizon.ai/directory](https://onehorizon.ai/directory)**,
or explore the [`skills/`](skills/) folder directly on GitHub.

Every entry here has passed review: this is a curated collection, not an open
dump. Have a skill you'd like considered? See [CONTRIBUTING.md](CONTRIBUTING.md).

## What's a skill?

A skill is a folder containing a `SKILL.md` file — a small markdown document
with YAML frontmatter that tells an AI coding agent what the skill does and
when to use it. It's an open format ("Agent Skills") already supported
natively by several agent runtimes, so the same file works unmodified
wherever you install it — no per-runtime conversion needed.

## Installing a skill

Pick a skill under [`skills/`](skills/), then copy (or symlink) its folder
into your runtime's skills directory:

| Runtime | Install path |
| --- | --- |
| Claude Code | `.claude/skills/<name>/` |
| Cursor | `.cursor/skills/<name>/` |
| Codex | `.agents/skills/<name>/` |
| Any Agent Skills-compatible runtime | Copy the skill's folder into that runtime's skills directory. |

**Claude Code users** can skip manual copying entirely and install straight
from this repo as a plugin marketplace:

```
/plugin marketplace add onehorizonai/directory
```

This is the only place install instructions are documented — individual
skills don't repeat them.

## Categories

Every skill is tagged with one category from [`schema/categories.json`](schema/categories.json):

- Content & Writing
- Engineering
- Research
- Productivity
- Data & Analytics
- Design
- Operations
- Other

Browse [`skills/`](skills/) or [onehorizon.ai/directory](https://onehorizon.ai/directory)
to filter by category.

## Repository structure

```
directory/
  README.md
  LICENSE
  CONTRIBUTING.md
  _template/                  # copy this to start a new skill
    SKILL.md
  .claude-plugin/
    marketplace.json          # generated — Claude Code plugin manifest
  schema/
    skill.schema.json         # JSON Schema for SKILL.md frontmatter
    categories.json           # closed list of allowed categories
    runtimes.json             # closed list of runtime ids
  scripts/
    validate.mjs              # validates every skills/*/SKILL.md
    build-index.mjs           # generates index.json + marketplace.json
  skills/
    <skill-name>/
      SKILL.md
      references/              # optional, loaded on demand
      assets/                  # optional
  index.json                  # generated — the website's fetch target
  docs/
    website-integration.md    # index.json contract for the website
```

`_template/` lives at the repo root, not inside `skills/`, so it's never
picked up as an installable skill when this repo is added as a Claude Code
plugin marketplace — Claude Code's default plugin scan treats every folder
under `skills/` as a real skill.

`index.json` and `.claude-plugin/marketplace.json` are generated, committed,
and diff-checked in CI — they're always in sync with the `SKILL.md` files
that produce them.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add a skill, including the
validation rules CI enforces.

## License

[Apache License 2.0](LICENSE).
