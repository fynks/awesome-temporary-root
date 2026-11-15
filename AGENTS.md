# AGENTS.md

## Overview

VitePress 2 documentation site and GitHub reference for temporary Android root on locked bootloaders (Bun `1.4.4`, Node `26`).

## Source of Truth

- `README.md`: Canonical guide source (includes tools, quick start, FAQ, and links to subpages).
- `docs/guide.md`: Generated from `README.md` by `scripts/sync-readme.mjs` (do not edit manually; content inside `<!-- web-app-link:start -->` ... `<!-- web-app-link:end -->` is stripped).
- `docs/devices/*.md`: Uncollapsed brand device tables and status definitions.
- `docs/modules/index.md`: Uncollapsed module and app compatibility tables.
- `docs/index.md` and `docs/.vitepress/`: Home page, navigation, PWA, and `llms.txt` config.

## Commands

- `bun run sync:readme`: Sync `README.md` to `docs/guide.md`.
- `bun run dev`: Sync guide and start VitePress dev server.
- `bun run check`: Sync guide and run `tsc --noEmit`.
- `bun run build`: Sync guide and build static site into `dist/`.

## Content Rules

- Use `and` instead of `&` in headings, navigation, and prose.
- Keep relative links in `README.md` (`docs/devices/*.md`, `docs/modules/index.md`) working on both GitHub and VitePress.
- Do not hardcode listed entry counts; device and module tables change frequently.
- Never self-assign `Maintainer Verified`; preserve exact kernel (`uname -r`) and build uncertainty.
