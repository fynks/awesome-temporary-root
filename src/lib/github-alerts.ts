import type { Element, ElementContent } from "hast";

/**
 * GitHub alert blockquotes -> Aside-compatible callout markup.
 *
 * GitHub renders `> [!TIP]` blocks as colored callouts, but plain Markdown
 * renderers (including this site's `.md` pipeline) treat the marker as text.
 * This HAST transform only runs on the rendered HTML, so README.md stays
 * canonical and copy-pasteable while the docs page gets a real callout.
 */
type AlertType = "note" | "tip" | "caution" | "danger";

interface AlertDefinition {
  type: AlertType;
  label: string;
  icon: keyof typeof ICON_PATHS;
}

const ALERTS: Record<string, AlertDefinition> = {
  NOTE: { type: "note", label: "Note", icon: "info" },
  TIP: { type: "tip", label: "Tip", icon: "lightbulb" },
  IMPORTANT: { type: "caution", label: "Important", icon: "warning-circle" },
  WARNING: { type: "caution", label: "Warning", icon: "warning" },
  CAUTION: { type: "danger", label: "Caution", icon: "warning-circle" },
};

const ICON_PATHS = {
  info: "M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m16-40a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m-32-92a12 12 0 1 1 12 12a12 12 0 0 1-12-12",
  lightbulb:
    "M176 232a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h80a8 8 0 0 1 8 8m40-128a87.55 87.55 0 0 1-33.64 69.21A16.24 16.24 0 0 0 176 186v6a16 16 0 0 1-16 16H96a16 16 0 0 1-16-16v-6a16 16 0 0 0-6.23-12.66A87.59 87.59 0 0 1 40 104.49C39.74 56.83 78.26 17.14 125.88 16A88 88 0 0 1 216 104m-16 0a72 72 0 0 0-73.74-72c-39 .92-70.47 33.39-70.26 72.39a71.65 71.65 0 0 0 27.64 56.3A32 32 0 0 1 96 186v6h64v-6a32.15 32.15 0 0 1 12.47-25.35A71.65 71.65 0 0 0 200 104m-16.11-9.34a57.6 57.6 0 0 0-46.56-46.55a8 8 0 0 0-2.66 15.78c16.57 2.79 30.63 16.85 33.44 33.45A8 8 0 0 0 176 104a9 9 0 0 0 1.35-.11a8 8 0 0 0 6.54-9.23",
  warning:
    "M236.8 188.09L149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19a23.51 23.51 0 0 0 .02-23.72m-13.87 15.71a8.5 8.5 0 0 1-7.48 4.2H40.55a8.5 8.5 0 0 1-7.48-4.2a7.59 7.59 0 0 1 0-7.72l87.45-151.87a8.75 8.75 0 0 1 15 0l87.45 151.87a7.59 7.59 0 0 1-.04 7.72M120 144v-40a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0m20 36a12 12 0 1 1-12-12a12 12 0 0 1 12 12",
  "warning-circle":
    "M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m-8-80V80a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0m20 36a12 12 0 1 1-12-12a12 12 0 0 1 12 12",
} as const;

// The marker may sit alone on its line, followed by body text on the same
// text node (`[!TIP]\n…`) or on the next node. Consume the marker and the
// line break that separates it from the body.
const MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:[ \t]*(?:\r?\n|$))?/;

function isWhitespace(node: ElementContent): boolean {
  return node.type === "text" && node.value.trim() === "";
}

function alertIcon(name: keyof typeof ICON_PATHS): Element {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 256 256",
      width: 16,
      height: 16,
      fill: "currentColor",
      focusable: "false",
      "aria-hidden": "true",
    },
    children: [
      {
        type: "element",
        tagName: "path",
        properties: { d: ICON_PATHS[name] },
        children: [],
      },
    ],
  };
}

export function githubAlerts() {
  return {
    name: "nimbus:github-alerts",
    element: {
      filter: ["blockquote"],
      visit(node: Element): Element | undefined {
        const paragraph = node.children.find(
          (child): child is Element => child.type === "element" && child.tagName === "p",
        );
        if (!paragraph) return;

        const markerIndex = paragraph.children.findIndex((child) => !isWhitespace(child));
        const marker = paragraph.children[markerIndex];
        if (!marker || marker.type !== "text") return;

        const match = MARKER.exec(marker.value);
        if (!match) return;

        const definition = ALERTS[match[1]];
        if (!definition) return;

        const content = [...paragraph.children];
        const remainder = marker.value.slice(match[0].length);

        if (remainder.trim()) content[markerIndex] = { ...marker, value: remainder };
        else content.splice(markerIndex, 1);

        // If the body started on the next text node, drop the line break that
        // opened it so the paragraph doesn't begin with a blank line.
        const firstContentIndex = content.findIndex((child) => !isWhitespace(child));
        if (firstContentIndex !== -1) {
          const firstContent = content[firstContentIndex];
          if (firstContent.type === "text") {
            const value = firstContent.value.replace(/^[ \t]*\r?\n[ \t]*/, "");
            if (value.trim() === "") content.splice(0, firstContentIndex + 1);
            else if (value !== firstContent.value) {
              content[firstContentIndex] = { ...firstContent, value };
            }
          }
        }

        const blocks: ElementContent[] = [];
        if (content.some((child) => !isWhitespace(child))) {
          blocks.push({
            type: "element",
            tagName: "p",
            properties: {},
            children: content,
          });
        }
        blocks.push(...node.children.filter((child) => child !== paragraph && !isWhitespace(child)));

        const children: ElementContent[] = [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["nb-alert-icon"], "aria-hidden": "true" },
            children: [alertIcon(definition.icon)],
          },
          {
            type: "element",
            tagName: "div",
            properties: { className: ["nb-alert-content"] },
            children: [
              {
                type: "element",
                tagName: "p",
                properties: { className: ["nb-alert-title"] },
                children: [{ type: "text", value: definition.label }],
              },
              ...(blocks.length > 0
                ? [
                    {
                      type: "element" as const,
                      tagName: "div",
                      properties: { className: ["nb-alert-body"] },
                      children: blocks,
                    },
                  ]
                : []),
            ],
          },
        ];

        return {
          type: "element",
          tagName: "aside",
          properties: {
            role: "note",
            "aria-label": definition.label,
            className: ["nb-alert"],
            "data-type": definition.type,
          },
          children,
        };
      },
    },
  };
}
