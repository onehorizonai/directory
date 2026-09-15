// Shared parsing helpers for validate.mjs and build-index.mjs.
// Keeping this in one place means the two scripts never disagree about what
// a SKILL.md "is" — one parse, two consumers.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const SKILLS_DIR = join(REPO_ROOT, "skills");

// The template lives outside skills/ entirely (not skills/_template/) so it
// is never picked up by Claude Code's default skills/ scan when this repo
// is installed as a plugin — that scan runs independently of validate.mjs
// and build-index.mjs and has no underscore-prefix exclusion.
export const TEMPLATE_SKILL_MD_PATH = join(REPO_ROOT, "_template", "SKILL.md");

// Provenance applied to any skill whose frontmatter omits `metadata.source`.
// Curated skills authored in this repo don't repeat this in all 21+ files;
// external submissions set `metadata.source` explicitly to preserve their
// original origin instead of getting this default.
export const DEFAULT_SOURCE = Object.freeze({
  kind: "one-horizon",
  repository: "onehorizonai/directory",
  maintainer: "One Horizon",
});

const REQUIRED_SECTIONS = [
  { heading: "## Overview", key: "overview" },
  { heading: "## When to use", key: "whenToUse" },
  { heading: "## Examples", key: "examples" },
];

/**
 * Every folder directly under skills/. Returns [] if skills/ doesn't exist
 * yet (a legitimate state before the first skill is added).
 * Returns [{ name, dir, skillMdPath }].
 */
export function listSkillFolders() {
  if (!existsSync(SKILLS_DIR)) return [];
  return readdirSync(SKILLS_DIR)
    .filter((entry) => statSync(join(SKILLS_DIR, entry)).isDirectory())
    .map((name) => {
      const dir = join(SKILLS_DIR, name);
      return { name, dir, skillMdPath: join(dir, "SKILL.md") };
    });
}

/**
 * Parses one SKILL.md into { frontmatter, body, raw }. Throws with a plain
 * message on unreadable/unparseable files — callers turn that into a
 * per-skill error rather than letting the process crash.
 */
export function parseSkillMd(skillMdPath) {
  const raw = readFileSync(skillMdPath, "utf8");
  const { data: frontmatter, content: body } = matter(raw);
  return { frontmatter, body, raw };
}

/**
 * Splits the markdown body into the three required sections by heading.
 * A section's content is everything between its heading and the next
 * level-2 (or higher) heading. Missing headings come back as undefined so
 * callers can report exactly which one is absent.
 *
 * Lines inside fenced code blocks (``` ... ```) are never treated as
 * headings — a "## " inside an example's code fence shouldn't truncate the
 * section it lives in.
 */
export function extractSections(body) {
  const lines = body.split("\n");
  const sections = {};
  let current = null;
  let buffer = [];
  let inFence = false;

  const flush = () => {
    if (current) {
      sections[current] = buffer.join("\n").trim();
    }
    buffer = [];
  };

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      if (current) buffer.push(line);
      continue;
    }

    if (!inFence) {
      const match = REQUIRED_SECTIONS.find((s) => line.trim() === s.heading);
      if (match) {
        flush();
        current = match.key;
        continue;
      }
      if (current && /^#{1,2}\s/.test(line.trim())) {
        // Hit another top-level/second-level heading; current section ends.
        flush();
        current = null;
      }
    }

    if (current) buffer.push(line);
  }
  flush();

  return sections;
}

/**
 * Finds relative markdown-link targets in the body that point at
 * references/, assets/, or scripts/ so the caller can confirm they exist.
 * Ignores absolute URLs, mailto:, and in-page anchors.
 */
export function findRelativeLinks(body) {
  const links = [];
  const linkPattern = /]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;
  while ((match = linkPattern.exec(body))) {
    let target = match[1];
    if (/^([a-z]+:)?\/\//i.test(target) || target.startsWith("#") || target.startsWith("mailto:")) {
      continue;
    }
    target = target.replace(/^\.\//, "");
    if (/^(references|assets|scripts)\//.test(target)) {
      links.push(target);
    }
  }
  return links;
}

export { REQUIRED_SECTIONS };
