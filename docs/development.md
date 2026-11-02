# Local development

All tooling is zero-dependency: **bun** installs packages, **node** runs everything.

## Commands

| Command | What it does |
| --- | --- |
| `bun install` | Install dependencies from `bun.lock` |
| `bun run dev` | Dev server on `http://localhost:3000` (live source + live reload) |
| `bun run test` | Run the test suite (`node --test` discovers `tests/*.test.mjs`) |
| `bun run lint` | Syntax-check every script and browser JS file (`node --check`) |
| `bun run data:validate` | Validate `data/source/*.json` against the JSON Schemas in `data/schema/` |
| `bun run data:generate` | Validate + sort + minify source data into `dist/data/` |
| `bun run build` | Full production build into `dist/` (index.html at root, data under `/data`) |
| `bun run preview` | Serve the built `dist/` exactly as Cloudflare Pages will (`--port` supported) |

## Dev server

`bun run dev` serves `website/` directly — edits to HTML/CSS/JS are picked up on refresh,
and the browser auto-refreshes via a server-sent-events channel (`/__livereload`).
`/data/*.json` is mapped to the editable files in `data/source/`, so the fetch code
path is identical to production while you iterate on device data.

Pick another port with:

```sh
node scripts/dev-server.mjs --port 3001
```

## Repo layout: website/ vs dist/

- `website/` — source of the site, versioned in git. Edit these files.
- `dist/` — build output, **gitignored**, produced only by `bun run build`. This is the
  single directory Cloudflare Pages publishes (it never lives in the repo, it exists
  locally after a build and inside CI as an artifact).

## Deployment

`deploy.yml` publishes the CI-built `dist/` artifact to the Cloudflare Pages project
`temp-root-checker` → https://temp-root-checker.pages.dev via `wrangler-action`.
Required repository secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
