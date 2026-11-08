/**
 * The site's mark, drawn once for every place it appears: the navbar and the
 * mobile drawer (Logo.astro) and the social cards (src/pages/og/_card.ts).
 *
 * The ghost's eyes and the hash cut out of its body are even-odd holes in a
 * single path, so the whole mark takes the caller's text colour and needs no
 * mask or second colour. Keep it a single-colour drawing.
 */
export const logo = {
  /** The drawing's box; it is square, so callers size it with one dimension. */
  width: 128,
  height: 128,
  /** Cutout subpaths (eyes, hash) punch through the body instead of painting. */
  fillRule: "evenodd" as const,
  paths: [
    [
      // Body.
      "M16 112V60C16 33.5 37.5 12 64 12s48 21.5 48 48v52q-12 10-24 0-12 10-24 0-12 10-24 0-12 10-24 0z",
      // Eyes.
      "M45.5 45a6.5 6.5 0 0 1 6.5 6.5v6a6.5 6.5 0 0 1-13 0v-6a6.5 6.5 0 0 1 6.5-6.5z",
      "M82.5 45a6.5 6.5 0 0 1 6.5 6.5v6a6.5 6.5 0 0 1-13 0v-6a6.5 6.5 0 0 1 6.5-6.5z",
      // Hash: horizontal bars, then the vertical bars split around them.
      "M52 80h24v5H52z",
      "M52 89h24v5H52z",
      "M58 73h5v7h-5z",
      "M65 73h5v7h-5z",
      "M58 85h5v4h-5z",
      "M65 85h5v4h-5z",
      "M58 94h5v6h-5z",
      "M65 94h5v6h-5z",
    ].join(" "),
  ],
};
