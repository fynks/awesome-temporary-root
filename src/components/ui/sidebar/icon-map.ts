/**
 * Leaf rows come from Nimbus without an icon field (only groups carry one),
 * so the site supplies a small href -> astro-icon map. Hrefs from the runtime
 * may or may not keep a trailing slash; normalise them here once.
 */
export function resolveSidebarIcon(
  icons: Record<string, string> | undefined,
  href: string,
): string | undefined {
  if (!icons) return undefined;
  const bare = href.replace(/\/+$/, "");
  return icons[href] ?? icons[bare || "/"] ?? icons[`${bare}/`];
}
