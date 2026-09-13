#!/usr/bin/env node
// Walks skills/*/SKILL.md and writes:
//   - index.json                       — the website's single fetch target
//   - .claude-plugin/marketplace.json  — Claude Code plugin-marketplace manifest
//
// The template lives outside skills/ (see lib.mjs) so it never reaches
// either generated file without needing an explicit exclusion here.
//
// Both are generated from the same parsed skill data and committed. CI runs
// this script and then `git diff --exit-code` on both outputs, so a stale
// commit fails the PR instead of the website silently serving old data.
//
// Output must be byte-stable for two runs over the same input: skills are
// sorted by name, keys are in a fixed order, and there is no embedded
// timestamp — a `generatedAt` field would make every regeneration diff
// dirty even when nothing actually changed.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, listSkillFolders, parseSkillMd, extractSections } from "./lib.mjs";

const folders = listSkillFolders();

const skills = folders
  .map(({ name, skillMdPath }) => {
    const { frontmatter, body } = parseSkillMd(skillMdPath);
    const sections = extractSections(body);
    const metadata = frontmatter.metadata ?? {};

    return {
      name,
      title: metadata.title,
      tagline: metadata.tagline,
      description: frontmatter.description,
      category: metadata.category,
      tags: metadata.tags ?? [],
      compatibility: metadata.compatibility ?? [],
      overview: sections.overview ?? "",
      whenToUse: sections.whenToUse ?? "",
      examples: sections.examples ?? "",
      path: `skills/${name}/SKILL.md`,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const index = { skills };
writeFileSync(join(REPO_ROOT, "index.json"), `${JSON.stringify(index, null, 2)}\n`);

// Single-plugin marketplace: the repo root already has the shape Claude
// Code plugins expect (a skills/ directory at the source root), so this
// lists one plugin with source "./" rather than one plugin per skill —
// which would require nesting a skills/ dir inside every skills/<name>/,
// contradicting the flat layout. See docs/website-integration.md.
const marketplace = {
  name: "onehorizon-directory",
  owner: {
    name: "One Horizon",
    url: "https://onehorizon.ai",
  },
  plugins: [
    {
      name: "directory",
      source: "./",
      description: "Curated One Horizon skills, installable as a Claude Code plugin.",
      version: "1.0.0",
    },
  ],
};
writeFileSync(
  join(REPO_ROOT, ".claude-plugin", "marketplace.json"),
  `${JSON.stringify(marketplace, null, 2)}\n`
);

console.log(`build-index: wrote index.json (${skills.length} skill(s)) and .claude-plugin/marketplace.json`);
