#!/usr/bin/env node
// Walks skills/*/SKILL.md and validates every one of them, collecting *all*
// failures before exiting non-zero so a contributor sees every problem in
// one pass instead of fixing errors one CI run at a time.

import { existsSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import Ajv from "ajv";
import matter from "gray-matter";
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
const OPENAI_INTERFACE_FIELDS = new Set([
  "display_name",
  "short_description",
  "icon_small",
  "icon_large",
  "brand_color",
  "default_prompt",
]);
const OPENAI_TOOL_FIELDS = new Set(["type", "value", "description", "transport", "url"]);

const ajv = new Ajv({ allErrors: true });
const validateSchema = ajv.compile(schema);

const errors = [];
const seenNames = new Map(); // lowercase name -> label that first used it

function fail(label, message) {
  errors.push(`${label}: ${message}`);
}

function unknownFields(value, supported) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? Object.keys(value).filter((key) => !supported.has(key))
    : [];
}

function parsePlainYaml(raw) {
  return matter(`---\n${raw}\n---\n`).data;
}

function checkIcon(label, skillDir, iconPath, expectedViewBox, expectedStroke, expectedRadius) {
  if (typeof iconPath !== "string" || !iconPath.startsWith("./assets/")) {
    fail(label, "icon paths must be quoted strings under ./assets/");
    return;
  }

  const assetsDir = resolve(skillDir, "assets");
  const target = resolve(skillDir, iconPath);
  if (target !== assetsDir && !target.startsWith(`${assetsDir}${sep}`)) {
    fail(label, `icon path "${iconPath}" escapes the skill assets directory`);
    return;
  }
  if (!existsSync(target)) {
    fail(label, `references missing icon asset "${iconPath}"`);
    return;
  }

  const svg = readFileSync(target, "utf8");
  if (!svg.includes(`viewBox="${expectedViewBox}"`)) {
    fail(label, `${relative(skillDir, target)} must use viewBox="${expectedViewBox}"`);
  }
  if (!svg.includes(`stroke-width="${expectedStroke}"`)) {
    fail(label, `${relative(skillDir, target)} must use the ${expectedStroke}px family stroke`);
  }
  if (!svg.includes(`class="tile"`) || !svg.includes(`rx="${expectedRadius}"`)) {
    fail(label, `${relative(skillDir, target)} must use the ${expectedRadius}px family tile radius`);
  }
  if (!svg.includes("prefers-color-scheme: dark") || !svg.includes('class="tile"') || !svg.includes('class="mark"')) {
    fail(label, `${relative(skillDir, target)} must define shared light/dark tile and mark styles`);
  }
  if (/<(?:text|foreignObject)\b|<(?:linear|radial)Gradient\b|<filter\b/i.test(svg)) {
    fail(label, `${relative(skillDir, target)} contains text, a gradient, or a filter`);
  }
}

function checkOpenAiYaml(label, skillDir, frontmatter, skillBody) {
  const path = join(skillDir, "agents", "openai.yaml");
  if (!existsSync(path)) {
    fail(label, "missing agents/openai.yaml");
    return;
  }

  const raw = readFileSync(path, "utf8");
  let doc;
  try {
    doc = parsePlainYaml(raw);
  } catch (err) {
    fail(label, `agents/openai.yaml failed to parse: ${err.message}`);
    return;
  }

  for (const key of unknownFields(doc, new Set(["interface", "dependencies", "policy"]))) {
    fail(label, `agents/openai.yaml has unsupported top-level field \`${key}\``);
  }

  const ui = doc.interface;
  if (!ui || typeof ui !== "object" || Array.isArray(ui)) {
    fail(label, "agents/openai.yaml must contain an `interface` mapping");
    return;
  }
  for (const key of unknownFields(ui, OPENAI_INTERFACE_FIELDS)) {
    fail(label, `agents/openai.yaml has unsupported interface field \`${key}\``);
  }

  for (const field of ["display_name", "short_description", "icon_small", "icon_large", "brand_color"]) {
    if (typeof ui[field] !== "string" || ui[field].trim().length === 0) {
      fail(label, `agents/openai.yaml is missing non-empty \`interface.${field}\``);
    } else if (!new RegExp(`^  ${field}: "(?:[^"\\\\]|\\\\.)*"\\s*$`, "m").test(raw)) {
      fail(label, `agents/openai.yaml \`interface.${field}\` must be quoted`);
    }
  }

  if (ui.display_name !== frontmatter?.metadata?.title) {
    fail(label, "`interface.display_name` must match `metadata.title` in SKILL.md");
  }
  if (typeof ui.short_description === "string" && (ui.short_description.length < 25 || ui.short_description.length > 64)) {
    fail(label, `\`interface.short_description\` must be 25–64 chars (found ${ui.short_description.length})`);
  }
  if (typeof ui.brand_color === "string" && !/^#[0-9A-F]{6}$/.test(ui.brand_color)) {
    fail(label, "`interface.brand_color` must be an uppercase six-digit hex color");
  }
  if (ui.icon_small === ui.icon_large) {
    fail(label, "small and large icons must use separate assets");
  }

  checkIcon(label, skillDir, ui.icon_small, "0 0 32 32", "1.5", "5");
  checkIcon(label, skillDir, ui.icon_large, "0 0 64 64", "1.75", "10");

  if (ui.default_prompt !== undefined) {
    if (typeof ui.default_prompt !== "string" || !ui.default_prompt.includes(`$${frontmatter.name}`)) {
      fail(label, `\`interface.default_prompt\` must be a string that mentions $${frontmatter.name}`);
    } else if (!/^  default_prompt: "(?:[^"\\]|\\.)*"\s*$/m.test(raw)) {
      fail(label, "`interface.default_prompt` must be quoted");
    }
  }

  if (doc.dependencies !== undefined) {
    const dependencies = doc.dependencies;
    for (const key of unknownFields(dependencies, new Set(["tools"]))) {
      fail(label, `agents/openai.yaml has unsupported dependencies field \`${key}\``);
    }
    if (!dependencies || !Array.isArray(dependencies.tools)) {
      fail(label, "`dependencies.tools` must be an array");
    } else {
      for (const [index, tool] of dependencies.tools.entries()) {
        for (const key of unknownFields(tool, OPENAI_TOOL_FIELDS)) {
          fail(label, `dependencies.tools[${index}] has unsupported field \`${key}\``);
        }
        if (tool?.type !== "mcp") fail(label, `dependencies.tools[${index}].type must be "mcp"`);
      }
    }
  }

  if (doc.policy !== undefined) {
    for (const key of unknownFields(doc.policy, new Set(["allow_implicit_invocation"]))) {
      fail(label, `agents/openai.yaml has unsupported policy field \`${key}\``);
    }
    if (typeof doc.policy?.allow_implicit_invocation !== "boolean") {
      fail(label, "`policy.allow_implicit_invocation` must be a boolean");
    }
  }

  if (/\b(?:icon_small|icon_large|brand_color|default_prompt)\b/.test(skillBody)) {
    fail(label, "presentation metadata belongs in agents/openai.yaml, not SKILL.md");
  }
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
  checkOpenAiYaml(label, dir, frontmatter, body);
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

console.log(`validate: ${folders.length} skill folder(s), OpenAI metadata/icons, template, and README checked, 0 errors.`);
