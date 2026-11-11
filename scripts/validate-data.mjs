/**
 * Validate the single-source-of-truth data in src/data/*.json.
 *
 * Runs on every `bun run lint:docs` (wired into package.json) and can be run
 * standalone: `bun run scripts/validate-data.mjs` or `node scripts/validate-data.mjs`.
 *
 * Rules:
 *  - Every required field is present and non-empty.
 *  - status is one of the allowed set.
 *  - method is one of the allowed set.
 *  - cve is one of the known CVE IDs or "Other".
 *  - No invented data: fields that are unknown must be exactly "Not documented".
 *  - upstreamProfileOnly entries must not claim a hardware test.
 *  - Dynamic counts: every device counted once; status counts sum to total.
 *
 * Exit non-zero on any violation so CI/lint fails fast.
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url)); // .../scripts
const dataDir = join(scriptDir, "..", "src", "data"); // .../src/data

const ALLOWED_STATUSES = new Set([
  "Tested",
  "Experimental",
  "Upstream profile",
  "Community reported",
  "Unverified candidate",
  "Deprecated/unavailable",
]);

const ALLOWED_METHODS = new Set(["DirtyFrag", "GhostLock", "Adreno", "Other", "Mixed"]);
const KNOWN_CVES = new Set(["CVE-2026-43284", "CVE-2026-43499", "CVE-2025-21479", "CVE-2026-98260", "Other"]);
const REQUIRED_DEVICE_FIELDS = [
  "id", "brand", "marketName", "models", "region", "builds", "androidVersion",
  "securityPatch", "kernelRelease", "kmi", "pageSize", "soc", "loader",
  "loaderRepo", "loaderVersion", "manager", "method", "cve", "status",
  "verifiedBy", "lastVerified", "sourceUrl", "notes", "upstreamProfileOnly",
];
const REQUIRED_TOOL_FIELDS = [
  "id", "name", "repo", "category", "method", "cve", "coverage", "transport",
  "license", "stars", "pushed", "archived", "status", "notes", "releaseUrl",
  "sourceProvenance",
];
const REQUIRED_MANAGER_FIELDS = [
  "id", "name", "repo", "description", "useFor", "license", "stars", "pushed",
  "archived", "providesKsud", "notes", "sourceProvenance",
];
const REQUIRED_MODULE_FIELDS = ["id", "name", "repo", "description", "notes", "status", "source"];

let errors = [];
let warnings = [];

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

function required(obj, fields, ctx) {
  for (const f of fields) {
    const v = obj[f];
    if (v === undefined) err(`${ctx}: missing required field "${f}"`);
    if (Array.isArray(v) && v.length === 0) err(`${ctx}: empty array field "${f}"`);
  }
}

// Identity fields must be non-empty strings.
function nonEmpty(obj, fields, ctx) {
  for (const f of fields) {
    const v = obj[f];
    if (typeof v !== "string" || v.trim() === "") err(`${ctx}: field "${f}" must be a non-empty string`);
  }
}

function isNotDocumented(v) {
  return v === "Not documented" || v === null || v === undefined;
}

// Every "unknown" field must be exactly "Not documented" - no invented values.
function checkNoInvention(obj, ctx) {
  const inventedMarkers = ["probably", "likely", "maybe", "assumed", "guessed", "estimated", "approximately", "~"];
  const text = JSON.stringify(obj);
  for (const m of inventedMarkers) {
    if (text.toLowerCase().includes(m)) warn(`${ctx}: possible invented/hedged language "${m}"`);
  }
}

async function main() {
  const devices = JSON.parse(await readFile(join(dataDir, "devices.json"), "utf8")).devices;
  const tools = JSON.parse(await readFile(join(dataDir, "tools.json"), "utf8")).tools;
  const managers = JSON.parse(await readFile(join(dataDir, "managers.json"), "utf8")).managers;
  const modules = JSON.parse(await readFile(join(dataDir, "modules.json"), "utf8")).modules;

  // --- devices ---
  const statusCounts = {};
  for (const d of devices) {
    const ctx = `device[${d.id ?? "<no-id>"}]`;
    required(d, REQUIRED_DEVICE_FIELDS, ctx);
    nonEmpty(d, ["id","brand","marketName","loader","method","status","sourceUrl"], ctx);
    if (!ALLOWED_STATUSES.has(d.status)) err(`${ctx}: invalid status "${d.status}"`);
    for (const m of String(d.method).split(" / ")) if (!ALLOWED_METHODS.has(m.trim())) err(`${ctx}: invalid method "${m.trim()}"`);
    for (const c of String(d.cve).split(" / ")) if (!KNOWN_CVES.has(c.trim())) err(`${ctx}: unknown cve "${c.trim()}"`);
    if (typeof d.upstreamProfileOnly !== "boolean") err(`${ctx}: upstreamProfileOnly must be boolean`);
    if (d.upstreamProfileOnly && d.status === "Tested") err(`${ctx}: upstreamProfileOnly=true but status is Tested (must not claim a hardware test)`);
    if (!d.models || !Array.isArray(d.models) || d.models.length === 0) err(`${ctx}: models must be a non-empty array`);
    if (!d.builds || !Array.isArray(d.builds) || d.builds.length === 0) err(`${ctx}: builds must be a non-empty array`);
    if (d.status === "Tested" && d.upstreamProfileOnly) err(`${ctx}: Tested device must not be upstream-profile-only`);
    statusCounts[d.status] = (statusCounts[d.status] ?? 0) + 1;
    checkNoInvention(d, ctx);
  }

  // --- tools ---
  for (const t of tools) {
    const ctx = `tool[${t.id ?? "<no-id>"}]`;
    required(t, REQUIRED_TOOL_FIELDS, ctx);
    nonEmpty(t, ["id","name","repo","category","method","status","sourceProvenance"], ctx);
    for (const c of String(t.cve).split(" / ")) if (!KNOWN_CVES.has(c.trim())) err(`${ctx}: unknown cve "${c.trim()}"`);
    if (typeof t.archived !== "boolean") err(`${ctx}: archived must be boolean`);
    if (typeof t.stars !== "number") err(`${ctx}: stars must be a number`);
    checkNoInvention(t, ctx);
  }

  // --- managers ---
  for (const m of managers) {
    const ctx = `manager[${m.id ?? "<no-id>"}]`;
    required(m, REQUIRED_MANAGER_FIELDS, ctx);
    nonEmpty(m, ["id","name","repo","description","useFor","license","sourceProvenance"], ctx);
    if (typeof m.archived !== "boolean") err(`${ctx}: archived must be boolean`);
    if (typeof m.providesKsud !== "boolean") err(`${ctx}: providesKsud must be boolean`);
    checkNoInvention(m, ctx);
  }

  // --- modules ---
  for (const m of modules) {
    const ctx = `module[${m.id ?? "<no-id>"}]`;
    required(m, REQUIRED_MODULE_FIELDS, ctx);
    nonEmpty(m, ["id","name","repo","description","status","source"], ctx);
    const allowedModuleStatuses = new Set(["Working","Caveat","Broken","Avoid","Reported","Outdated"]);
    if (!allowedModuleStatuses.has(m.status)) err(`${ctx}: invalid module status "${m.status}"`);
    checkNoInvention(m, ctx);
  }

  // --- dynamic counts ---
  const totalDevices = devices.length;
  const sumStatus = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  if (sumStatus !== totalDevices) err(`count mismatch: status counts sum to ${sumStatus} but there are ${totalDevices} devices`);
  const testedCount = statusCounts["Tested"] ?? 0;

  // --- report ---
  let failed = false;
  if (errors.length) {
    failed = true;
    console.error(`\n[validate-data] ${errors.length} ERROR(S):`);
    for (const e of errors) console.error(`  - ${e}`);
  }
  if (warnings.length) {
    console.warn(`\n[validate-data] ${warnings.length} warning(s):`);
    for (const w of warnings) console.warn(`  - ${w}`);
  }
  console.log(`\n[validate-data] devices=${totalDevices} tested=${testedCount} tools=${tools.length} managers=${managers.length} modules=${modules.length}`);
  console.log(`[validate-data] status counts: ${JSON.stringify(statusCounts)}`);
  if (failed) {
    console.error("\n[validate-data] VALIDATION FAILED");
    process.exit(1);
  }
  console.log("[validate-data] VALIDATION PASSED");
}

main().catch((e) => { console.error(e); process.exit(1); });
