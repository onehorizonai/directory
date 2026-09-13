#!/usr/bin/env node
// Walks skills/*/SKILL.md and validates every one of them, collecting *all*
// failures before exiting non-zero so a contributor sees every problem in
// one pass instead of fixing errors one CI run at a time.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv from "ajv";
import {
  REPO_ROOT,
  TEMPLATE_SKILL_MD_PATH,
  listSkillFolders,
  parseSkillMd,
  extractSections,
  findRelativeLinks,
  REQUIRED_SECTIONS,
} from "./lib.mjs";

const schema = JSON.parse(readFileSync(join(REPO_ROOT, "schema", "skill.schema.json"), "utf8"));
const categoriesDoc = JSON.parse(readFileSync(join(REPO_ROOT, "schema", "categories.json"), "utf8"));
const runtimesDoc = JSON.parse(readFileSync(join(REPO_ROOT, "schema", "runtimes.json"), "utf8"));

const VALID_CATEGORIES = new Set(categoriesDoc.categories.map((c) => c.id));
const VALID_RUNTIMES = new Set(runtimesDoc.runtimes.map((r) => r.id));
const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const ajv = new Ajv({ allErrors: true });
const validateSchema = ajv.compile(schema);

const errors = [];
const seenNames = new Map(); // lowercase name -> label that first used it

function fail(label, message) {
  errors.push(`${label}: ${message}`);
}

/**
 * Checks shared by every SKILL.md (real skills and the template alike):
 * schema conformance, description, metadata fields, body sections, and
 * relative links. Name-matches-folder and cross-repo uniqueness are handled
 * separately by the caller, since the template is exempt from both.
 */
function checkSkillMd(label, frontmatter, body, baseDir) {
  if (!validateSchema(frontmatter)) {
    for (const err of validateSchema.errors) {
      fail(label, `schema violation at ${err.instancePath || "(root)"}: ${err.message}`);
    }
  }

  if (typeof frontmatter?.description !== "string" || frontmatter.description.trim().length === 0) {
    fail(label, "missing or empty required frontmatter field `description`");
  }

  const metadata = frontmatter?.metadata ?? {};

  if (typeof metadata.title !== "string" || metadata.title.trim().length === 0) {
    fail(label, "missing or empty required `metadata.title`");
  }
  if (typeof metadata.tagline !== "string" || metadata.tagline.trim().length === 0) {
    fail(label, "missing or empty required `metadata.tagline`");
  } else if (metadata.tagline.length > 160) {
    fail(label, `\`metadata.tagline\` is ${metadata.tagline.length} chars, over the 160 char cap`);
  }

  if (metadata.category && !VALID_CATEGORIES.has(metadata.category)) {
    fail(label, `\`metadata.category\` "${metadata.category}" is not in schema/categories.json`);
  }

  if (metadata.tags !== undefined) {
    if (!Array.isArray(metadata.tags)) {
      fail(label, "`metadata.tags` must be an array");
    } else {
      const seenTags = new Set();
      for (const tag of metadata.tags) {
        if (typeof tag !== "string" || !KEBAB_CASE.test(tag)) {
          fail(label, `\`metadata.tags\` entry "${tag}" must be lowercase-kebab`);
        }
        if (seenTags.has(tag)) {
          fail(label, `\`metadata.tags\` has a duplicate entry "${tag}"`);
        }
        seenTags.add(tag);
      }
    }
  }

  if (metadata.compatibility !== undefined) {
    if (!Array.isArray(metadata.compatibility)) {
      fail(label, "`metadata.compatibility` must be an array");
    } else {
      for (const runtime of metadata.compatibility) {
        if (!VALID_RUNTIMES.has(runtime)) {
          fail(label, `\`metadata.compatibility\` entry "${runtime}" is not in schema/runtimes.json`);
        }
      }
    }
  }

  const sections = extractSections(body);
  for (const { heading, key } of REQUIRED_SECTIONS) {
    if (!sections[key] || sections[key].trim().length === 0) {
      fail(label, `body is missing a non-empty "${heading}" section`);
    }
  }

  for (const link of findRelativeLinks(body)) {
    const target = join(baseDir, link);
    if (!existsSync(target)) {
      fail(label, `body links to "${link}", which does not exist`);
    }
  }
}

// --- Real skills: skills/<name>/SKILL.md -----------------------------------

const folders = listSkillFolders();

for (const { name: folder, dir, skillMdPath } of folders) {
  if (!existsSync(skillMdPath)) {
    fail(`skills/${folder}`, "missing SKILL.md");
    continue;
  }

  let frontmatter;
  let body;
  try {
    ({ frontmatter, body } = parseSkillMd(skillMdPath));
  } catch (err) {
    fail(`skills/${folder}`, `SKILL.md frontmatter failed to parse: ${err.message}`);
    continue;
  }

  const label = `skills/${folder}`;

  // name is kebab-case, matches the folder, and is unique
  // (case-insensitively) across the repo.
  const name = frontmatter?.name;
  if (typeof name !== "string" || name.length === 0) {
    fail(label, "missing required frontmatter field `name`");
  } else {
    if (!KEBAB_CASE.test(name)) {
      fail(label, `\`name\` "${name}" must be kebab-case (lowercase letters, digits, hyphens)`);
    }
    if (name !== folder) {
      fail(label, `\`name\` "${name}" must exactly equal the folder name "${folder}"`);
    }
    const key = name.toLowerCase();
    if (seenNames.has(key)) {
      fail(label, `\`name\` "${name}" collides with ${seenNames.get(key)} (case-insensitive)`);
    } else {
      seenNames.set(key, label);
    }
  }

  checkSkillMd(label, frontmatter, body, dir);
}

// --- Template: _template/SKILL.md, outside skills/ --------------------------
// Kept out of skills/ so it's never picked up by Claude Code's default
// skills/ scan when this repo is installed as a plugin. Exempt from the
// folder-name-match and uniqueness rules above (there's no real folder name
// to match), but still schema- and section-checked so it can't rot.

if (existsSync(TEMPLATE_SKILL_MD_PATH)) {
  try {
    const { frontmatter, body } = parseSkillMd(TEMPLATE_SKILL_MD_PATH);
    checkSkillMd("_template", frontmatter, body, join(REPO_ROOT, "_template"));
  } catch (err) {
    fail("_template", `SKILL.md frontmatter failed to parse: ${err.message}`);
  }
} else {
  fail("_template", "missing _template/SKILL.md");
}

// --- README drift check ------------------------------------------------------
// PLAN-DOCS-001: the README's category list and runtime install table are
// meant to be sourced from schema/categories.json and schema/runtimes.json.
// This doesn't enforce sourcing mechanically, but it catches the schema and
// the README silently drifting apart as categories/runtimes are added.
// One-directional: it fails when the README is missing a current schema
// entry, but not when the README still lists one that's since been removed
// from the schema — a stale README row is a manual-review problem, not one
// this check catches.

const readme = readFileSync(join(REPO_ROOT, "README.md"), "utf8");

for (const category of categoriesDoc.categories) {
  if (!readme.includes(category.label)) {
    fail("README.md", `is missing the category label "${category.label}" from schema/categories.json`);
  }
}

for (const runtime of runtimesDoc.runtimes) {
  if (!readme.includes(runtime.installPath)) {
    fail("README.md", `is missing the install path "${runtime.installPath}" from schema/runtimes.json`);
  }
}

// --- Report -------------------------------------------------------------------

if (errors.length > 0) {
  console.error(`\n${errors.length} validation error(s):\n`);
  for (const err of errors) console.error(`  - ${err}`);
  console.error("");
  process.exit(1);
}

console.log(`validate: ${folders.length} skill folder(s) + template + README checked, 0 errors.`);
