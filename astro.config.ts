import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import nimbus, {
  defineConfig as defineNimbusConfig,
} from "@cloudflare/nimbus-docs";
import { tableScroll } from "@cloudflare/nimbus-docs/markdown";
import { githubAlerts } from "./src/lib/github-alerts";

const nimbusConfig = defineNimbusConfig({
  // CHANGE_ME: your site's canonical origin, with no trailing slash. It drives
  // canonical URLs, absolute OG image URLs, robots.txt, sitemap, and the
  // links in /llms.txt. Leaving the placeholder breaks all of them.
  site: "https://awesome-temporary-root.pages.dev",
  // CHANGE_ME: your project's name. Used for <title>, the home H1, and OG.
  title: "Awesome Temporary Root",
  // CHANGE_ME: a one-line description of your docs. Used for meta + OG.
  description: "Temporary-root device reports, tools, modules, setup, and safety guidance for Android devices.",
  locale: "en",
  // CHANGE_ME: your repository. Shown as the GitHub link in the header.
  github: "https://github.com/fynks/awesome-temporary-root",
  socialImageAlt: "Awesome Temporary Root documentation preview",
  // The home page leads the sidebar; every other page joins it automatically.
  sidebar: {
    items: ["index", { autogenerate: { collection: "docs" } }],
  },
});

export default defineConfig({
  // nimbus:adapter
  output: "static",
  // Tailwind v4 via its Vite plugin. This is the integration Astro recommends
  // for Tailwind v4. It replaces the PostCSS plugin, which does not build under
  // Astro 7's Vite 8 bundler.
  vite: {
    plugins: [tailwindcss()],
  },
  // Hover-prefetch link targets so full-page navigations feel instant without
  // a client-side router.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    nimbus(nimbusConfig, {
      // Authoring rules are opt-in. The two below matter most: frontmatter
      // must validate against the content schema for the page to render, and
      // broken internal links become 404s. Add the others, such as heading
      // hierarchy, code-block language, and style, when you want to enforce
      // them. See `nimbus-docs lint --help`.
      rules: {
        "nimbus/frontmatter-shape": "error",
        "nimbus/internal-link": "error",
      },
      markdown: {
        // Wrap wide tables so they scroll instead of overflowing the page
        // (styled by `.nb-table-scroll` in src/styles/prose.css), and turn
        // GitHub `> [!TIP]` blockquotes into styled callouts (styled by
        // `.nb-alert` in the same file).
        hastPlugins: [githubAlerts(), tableScroll()],
        // `## Install {#install}` gives a heading a fixed id. A heading that
        // ends in other `{...}` text, such as `{account_id}` in a .md file, is
        // read as attributes too. Remove this to keep it as text.
        features: { headingAttributes: true },
      },
    }),
  ],
});
