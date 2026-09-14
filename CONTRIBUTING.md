# Contributing

This repo is the curated, accepted destination for One Horizon skills — not
the intake form. If you have a skill idea and haven't already gone through
the submission process for the parent initiative, start there first; this
document covers how an already-accepted skill gets added to the repo.

## Adding a skill

1. Copy the template folder into `skills/`, renamed to your skill's name
   (kebab-case):

   ```
   cp -r _template skills/your-skill-name
   ```

2. Edit `skills/your-skill-name/SKILL.md`:
   - `name` must exactly match the folder name (replace the template's
     placeholder `your-skill-name`).
   - `description` should describe when an agent should invoke this skill —
     it's read by agents deciding whether to trigger the skill, not by
     humans browsing a list.
   - Fill in `metadata.title`, `metadata.tagline` (≤160 chars), and
     `metadata.category` (one of the ids in `schema/categories.json`).
   - Add `metadata.tags` and/or `metadata.compatibility` if relevant
     (`compatibility` values must come from `schema/runtimes.json`; omit it
     entirely if the skill works on any Agent-Skills-compatible runtime).
   - Write the three required body sections: `## Overview`, `## When to
     use`, `## Examples`.
   - Add `references/`, `scripts/`, or `assets/` subfolders if your skill
     needs them, and link to files in those folders from the body using
     relative markdown links.

3. Run validation locally:

   ```
   npm install
   npm run validate
   ```

4. Regenerate the generated files and include them in your commit:

   ```
   npm run build-index
   ```

5. Open a PR. CI re-runs both steps and fails if `index.json` or
   `.claude-plugin/marketplace.json` don't match what's committed.

Don't add install instructions to your `SKILL.md` — that's documented once,
generically, in the [README](README.md#installing-a-skill) for every skill.

## Terminology conventions

Skills in this directory describe work using a small, consistent set of
modes, so an agent can tell what a skill produces without reading every
section of it:

- **Plan** — turns a request into a self-contained implementation plan
  grounded in the real system. Reads and reasons; never edits code, never
  performs the change. (`plan-a-feature`, `plan-a-refactor`,
  `plan-a-bug-fix`)
- **Research** — investigates an external or technical question and returns
  sourced findings with visible uncertainty. Never edits code or performs
  the action it researches. (`research-technical-question`)
- **Review** (or a domain-specific verb like **Audit** for UI work) — checks
  a fixed target (a plan, a diff, a running interface) against a stated
  baseline and returns validated, prioritized findings only. Never edits
  the thing under review. (`review-a-plan`, `review-a-refactor`,
  `review-code`, `review-native-ui`, `audit-web-ui`)
- **Implement / Debug / Refactor** — carries out an already-approved change:
  writes the code, verifies it against real checks, and reports the result.
  Doesn't decide what to build or approve scope — that's Plan's job.
  (`implement-feature`, `implement-web-ui-change`, `implement-native-ui`,
  `refactor-code`, `debug-a-bug`)
- **Verify** — independently checks a completion claim against stated
  acceptance criteria after the fact; distinct from the inline verification
  an implementation skill already runs on its own work.
  (`verify-implementation`)
- **Write** — produces copy or other content for an already-decided scope;
  doesn't decide strategy, positioning, or product behavior itself.
  (`write-ux-copy`, `write-website-copy`)

A skill's own domain verb (`audit`, `debug`, `refactor`) can stay
descriptive in its name — it doesn't need to literally repeat "review" or
"plan". Each skill must stand on its own: write its `description` and "Do
not use when" section to describe the situation that's out of scope (the
artifact type, the state of the work, the requested outcome), not to name
or depend on another skill in this directory. A skill should work
correctly even if every other skill were removed. The mode list above is
an index for maintainers, not something an individual `SKILL.md` should
reference. Don't invent a skill-specific artifact file (`spec.md`,
`review.md`, `plan.md`) as a second source of truth; a skill's own
`## Output` section is the contract for what it returns, and how the
caller stores or hands that off is the caller's concern, not the skill's.

## Review checklist

This mirrors what `npm run validate` checks, so you can catch problems
before CI does:

- [ ] `name` is kebab-case and matches the folder name exactly.
- [ ] `name` doesn't collide with an existing skill (case-insensitively).
- [ ] `description` is present and non-empty.
- [ ] `metadata.title` and `metadata.tagline` are present; `tagline` is
      160 characters or fewer.
- [ ] `metadata.category` is one of `schema/categories.json`.
- [ ] `metadata.tags`, if present, are lowercase-kebab with no duplicates.
- [ ] `metadata.compatibility`, if present, values are from
      `schema/runtimes.json`.
- [ ] Body has non-empty `## Overview`, `## When to use`, and `## Examples`
      sections.
- [ ] Any relative link to `references/`, `assets/`, or `scripts/` in the
      body resolves to a real file.
- [ ] `index.json` and `.claude-plugin/marketplace.json` are regenerated and
      committed.
