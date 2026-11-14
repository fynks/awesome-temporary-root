/**
 * Build-time source: README.md to src/content/docs/guide.md.
 *
 * Generate the guide page; do not hand-edit it. Every `dev` and `build`
 * run regenerates it, so a deploy cannot ship README content from a
 * previous commit. The script rewrites only a few display-only paths:
 * GitHub's repo-relative asset paths and the LICENSE/CONTRIBUTING links.
 * The same Markdown then renders correctly in both places. GitHub alert
 * blockquotes (`> [!TIP]`) stay in the source. src/lib/github-alerts.ts
 * turns them into callouts when the page renders.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve from this file, not the caller's cwd, so `astro build --root` and
// editors that run scripts from elsewhere still read the repo's README.
const root = fileURLToPath(new URL("..", import.meta.url));
const readmePath = join(root, "README.md");
const guidePath = join(root, "src/content/docs/guide.md");

const readme = await readFile(readmePath, "utf8");

// The page layout supplies the title and description. The README body stays
// verbatim below the frontmatter. Strip a frontmatter block if the README
// ever grows one so it does not appear in the rendered page.
const body = readme
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
  .replaceAll("docs/public/images/", "/images/")
  .replaceAll("](LICENSE)", "](https://github.com/fynks/awesome-temporary-root/blob/main/LICENSE)")
  .replaceAll("](./LICENSE)", "](https://github.com/fynks/awesome-temporary-root/blob/main/LICENSE)")
  .replaceAll("](CONTRIBUTING.md)", "](https://github.com/fynks/awesome-temporary-root/blob/main/CONTRIBUTING.md)")
  .replaceAll("](./CONTRIBUTING.md)", "](https://github.com/fynks/awesome-temporary-root/blob/main/CONTRIBUTING.md)")
  .trimStart()
  .replace(/\s*$/, "\n");

const page = `---
title: Complete guide
description: Device support, temporary-root basics, safety, setup, tools, modules, troubleshooting, and sources.
---

<!-- Generated from README.md by scripts/sync-readme.mjs. Edit README.md, not this file. -->

${body}`;

await mkdir(dirname(guidePath), { recursive: true });

// If nothing changed, do not touch the file or trigger a rebuild.
const current = await readFile(guidePath, "utf8").catch(() => null);
if (current !== page) {
  await writeFile(guidePath, page);
  console.log("[sync-readme] README.md -> src/content/docs/guide.md");
}
