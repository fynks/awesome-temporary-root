import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Generate docs/guide.md from README.md on every dev and build run. Do not hand-edit docs/guide.md.
const root = fileURLToPath(new URL("..", import.meta.url));
const readmePath = join(root, "README.md");
const guidePath = join(root, "docs/guide.md");

const readme = await readFile(readmePath, "utf8");

// Rewrite repo-relative GitHub paths so the same Markdown renders in VitePress under docs/.
const body = readme
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
  .replace(/<!--\s*web-app-link:start\s*-->[\s\S]*?<!--\s*web-app-link:end\s*-->\r?\n?/g, "")
  .replaceAll("docs/public/images/", "/images/")
  .replaceAll("](docs/", "](")
  .replaceAll("](./docs/", "](")
  .replaceAll("](LICENSE)", "](https://github.com/fynks/awesome-temporary-root/blob/main/LICENSE)")
  .replaceAll("](./LICENSE)", "](https://github.com/fynks/awesome-temporary-root/blob/main/LICENSE)")
  .replaceAll("](CONTRIBUTING.md)", "](https://github.com/fynks/awesome-temporary-root/blob/main/CONTRIBUTING.md)")
  .replaceAll("](./CONTRIBUTING.md)", "](https://github.com/fynks/awesome-temporary-root/blob/main/CONTRIBUTING.md)")
  .trimStart()
  .replace(/\s*$/, "\n");

const page = `---
title: Complete Guide
description: Temporary-root basics, safety, supported devices, tools, modules, quick start, troubleshooting, and sources.
---

<!-- Generated from README.md by scripts/sync-readme.mjs. Edit README.md, not this file. -->

${body}`;

await mkdir(dirname(guidePath), { recursive: true });

// Skip writing when unchanged so VitePress dev does not loop on file watcher events.
const current = await readFile(guidePath, "utf8").catch(() => null);
if (current !== page) {
  await writeFile(guidePath, page);
  console.log("[sync-readme] README.md -> docs/guide.md");
}
