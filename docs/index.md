---
title: Awesome Temporary Root
description: Community-maintained reference of temporary-root hardware reports, kernel loaders, late-load modules, and safety guidance for locked Android bootloaders.
---

<div class="atr-home-header">
  <div class="atr-home-copy">
    <h1>Awesome Temporary Root</h1>
    <p class="atr-home-lead">
      Temporary root on a locked Android bootloader, one boot at a time. This community-maintained reference documents hardware-tested temporary-root reports, kernel loaders, late-load modules, and safety rules, separating maintainer-verified results from user reports and unverified upstream profiles.
    </p>
    <div class="atr-home-actions">
      <a class="atr-btn atr-btn-primary" href="/devices/">Browse Supported Devices</a>
      <a class="atr-btn atr-btn-secondary" href="/modules/">Modules and Apps</a>
      <a class="atr-btn atr-btn-secondary" href="/guide">Read Complete Guide</a>
    </div>
  </div>
  <picture class="atr-home-emblem">
    <source media="(prefers-color-scheme: dark)" srcset="/images/ghost-dark.svg" />
    <img src="/images/ghost-light.svg" alt="Awesome Temporary Root ghost emblem with a hash cutout" width="96" height="96" fetchpriority="high" />
  </picture>
</div>

> [!IMPORTANT]
> **Project scope:** This repository accumulates temporary-root documentation, tools, modules, and hardware reports in one place. Porting temporary-root solutions to specific devices is out of scope. Use each loader's upstream project for porting and loader bugs.

> [!WARNING]
> **Match your exact build:** Temporary root runs privilege-escalation code in the kernel. A mismatched profile can panic or damage a device. Confirm the exact model code, firmware build, and full `uname -r` against the upstream project before running anything, and test only on hardware you own or are authorized to modify.

## Supported devices by brand

Tables on every brand page are expanded by default for direct scanning and `Ctrl+F` lookup across `4.4` to `6.18` kernels.

| Brand / group | Loaders covered |
| --- | --- |
| [Samsung Galaxy](./devices/samsung.md) | Root My Galaxy, Root My Galaxy Next, Root My Galaxy Ultra, Root My Galaxy Extended, RootMyS24, GhostSam, SamTimer, GhostKey, GhostLock-Galaxy, UniRoot, ghostlock-a17, SM-A166W port |
| [Google Pixel](./devices/pixel.md) | Root My Pixel, TimerRoot, LSPromise |
| [OnePlus](./devices/oneplus.md) | ghostlock-oneplus, Anchor, Root My Device (tqmane), Shark, OnePlus 16 PYB110 kit |
| [OPPO](./devices/oppo.md) | ghostlock-oneplus, Root My Device (Witaqua), Shark, CVE-2025-21479-FX5P |
| [Realme](./devices/realme.md) | ghostlock-rmx5085, DirtyFrag, Shark |
| [vivo and iQOO](./devices/vivo.md) | RootMyVivo, DirtyFalg-vr, Shark, yuehong-privilege-assistant, GhostLock-X200, DirtyFrag, DFRoot, iQOO Z9 / vivo T3 port, Adreno port |
| [Xiaomi and Redmi](./devices/xiaomi.md) | ghostlock-oneplus, Root My Device (Witaqua), DirtyFrag, GhostLock App, DFRoot, TimerRoot, Shark, CVE-2026-43499-popsicle |
| [ASUS](./devices/asus.md) | zenfone9-ghostlock |
| [Nothing](./devices/nothing.md) | Root My Device (tqmane) |
| [Honor](./devices/honor.md) | ANB Root, CVE-2026-98260-BRM-AN00, MnemosyneLab/ghostlock-honor |
| [HMD and Nokia](./devices/nokia.md) | DFRoot |
| [Amazon, NVIDIA, Meta, Meizu, and TCL](./devices/other.md) | R0rt1z2/GhostLock, GhostLock NVIDIA Shield, Root My Device (Witaqua), Meizu 20 Pro / 21 |

See [Supported Devices](./devices/index.md) for status badge definitions and live upstream support catalogs.

## Guide and compatibility pages

The [Complete Guide](./guide.md) is synced from [`README.md`](https://github.com/fynks/awesome-temporary-root/blob/main/README.md) on every build, and [Modules and Apps](./modules/index.md) lists uncollapsed compatibility tables:

- [What is temporary root?](./guide.md#what-is-temporary-root): DirtyFrag, GhostLock, Adreno, and POSIX timer routes, kernel patch floors, and session limits.
- [Tools and managers](./guide.md#tools-and-managers): Exploit loaders, KMI module sets, KernelSU-compatible managers, and Shizuku / ADB helpers.
- [Modules and apps](./modules/index.md): Uncollapsed late-load KernelSU module list, root app list, risk-reduction steps, and modules to avoid on locked bootloaders.
- [Firmware and recovery resources](./guide.md#firmware-and-recovery-resources) and [Research resources](./guide.md#research-resources): Stock image sources and exploit writeups.
- [Quick start](./guide.md#quick-start) and [Troubleshooting and FAQ](./guide.md#troubleshooting-and-faq): Step-by-step verification commands (`uname -r`, `su -c id`) and bootloop recovery.
- [Contributing and disclaimer](./guide.md#contributing-and-disclaimer) and [Sources](./guide.md#sources): Evidence rules for Maintainer Verified vs. User Reported entries.
