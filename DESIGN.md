# Design Direction: Awesome Temporary Root

Dial: ENERGY 1 / RHYTHM 2 / MOTION 1

## Identity and Purpose

Awesome Temporary Root is a technical hardware-compatibility and safety reference for temporary kernel root on locked Android bootloaders. Readers visit to verify exact model codes, firmware builds, kernel strings (`uname -r`), exploit loaders, and module compatibility before running privilege-escalation code on real hardware.

The aesthetic must feel like an authoritative hardware-security reference manual: calm, legible, high-contrast, scannable, and unhurried.

## Visual System

- **Core palette (2 neutrals + 1 accent):**
  - Light surface base: `#f8fafc` / `#ffffff`, primary ink `#0f172a`, secondary ink `#475569` (all meeting WCAG AA >= 4.5:1).
  - Dark surface base: `#0b0f19` / `#111827`, primary ink `#f8fafc`, secondary ink `#cbd5e1` (all meeting WCAG AA >= 4.5:1).
  - Single deliberate accent: slate-teal (`#0f766e` in light mode, `#2dd4bf` in dark mode) for active navigation markers, links, and primary focus rings.
- **Typography:**
  - Sans: VitePress bundled Inter variable font for dense hardware documentation legibility across operating systems without external font network requests.
  - Monospace: system monospace stack (`ui-monospace`, `SFMono-Regular`, `Menlo`, `Consolas`) so kernel build strings (`6.12.30-android16-5-g6e872b4863d6-ab13847919-4k`) and `adb` commands read crisp and unambiguous.
- **Identity motif:**
  - The repository's ghost-with-hash (`#`) emblem paired with crisp `<kbd>` hardware status tags (`Maintainer Verified`, `User Reported`, `Tested`, `Experimental`, `Upstream profile`, `Deprecated/unavailable`) styled like technical keycaps with clear borders and readable contrast in both themes.
- **Layout and rhythm (RHYTHM 2):**
  - Home page combines a compact, content-first intro header (with the ghost emblem and direct actions into the Guide and Supported Devices), safety callouts, and a structured brand directory table/grid with exact entry counts so readers can jump straight to their manufacturer without marketing filler.
  - Documentation and device pages prioritize wide, uncollapsed, horizontally-scrollable hardware tables on narrow screens (`overflow-x: auto`) so firmware strings never clip or cause page-level horizontal overflow.
- **Motion (MOTION 1):**
  - Instant state transitions on hover/focus only; respects `prefers-reduced-motion: reduce`. No decorative loops, pulses, or scroll-jacking.
