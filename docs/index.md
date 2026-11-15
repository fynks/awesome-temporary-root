---
title: Awesome Temporary Root
description: Community-maintained reference of temporary-root hardware reports, kernel loaders, late-load modules, and safety guidance for locked Android bootloaders.
---

<div class="atr-home-header">
  <div class="atr-home-copy">
    <h1>Awesome Temporary Root</h1>
    <p class="atr-home-lead">
      Root access on a locked Android bootloader, for one boot at a time. This community-maintained reference documents hardware-tested temporary-root reports, kernel loaders, late-load modules, and safety rules, separating maintainer-verified results from user reports and unverified upstream profiles.
    </p>
    <div class="atr-home-actions">
      <a class="atr-btn atr-btn-primary" href="/devices/">Browse Supported Devices</a>
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

Tables on every brand page are expanded by default for direct scanning and `Ctrl+F` lookup across 78 documented entries (`4.9` to `6.12` kernels).

| Brand / group | Entries | Loaders covered |
| --- | --- | --- |
| [Samsung Galaxy](./devices/samsung.md) | 28 | Root My Galaxy, RootMyS24, GhostSam, UniRoot, ghostlock-a17, SM-A166W port |
| [Google Pixel](./devices/pixel.md) | 15 | Root My Pixel |
| [OnePlus](./devices/oneplus.md) | 6 | ghostlock-oneplus, Anchor, Root My Device (tqmane) |
| [OPPO](./devices/oppo.md) | 2 | ghostlock-oneplus, Root My Device (Witaqua) |
| [Realme](./devices/realme.md) | 2 | ghostlock-rmx5085, DirtyFrag |
| [vivo and iQOO](./devices/vivo.md) | 9 | RootMyVivo, GhostLock-X200, DirtyFrag, DFRoot, iQOO Z9 / vivo T3 port, Adreno port |
| [Xiaomi and Redmi](./devices/xiaomi.md) | 6 | ghostlock-oneplus, Root My Device (Witaqua), DirtyFrag, GhostLock App, DFRoot |
| [ASUS](./devices/asus.md) | 1 | zenfone9-ghostlock |
| [Nothing](./devices/nothing.md) | 1 | Root My Device (tqmane) |
| [Honor](./devices/honor.md) | 2 | ANB Root, MnemosyneLab/ghostlock-honor |
| [HMD and Nokia](./devices/nokia.md) | 1 | DFRoot |
| [Amazon, NVIDIA, Meta, and TCL](./devices/other.md) | 5 | R0rt1z2/GhostLock, GhostLock NVIDIA Shield, Root My Device (Witaqua) |

See [Supported Devices](./devices/index.md) for status badge definitions and live upstream support catalogs.

## Guide sections

The [Complete Guide](./guide.md) is synced from [`README.md`](https://github.com/fynks/awesome-temporary-root/blob/main/README.md) on every build and holds the core documentation, loader directory, and module lists:

- [What is temporary root?](./guide.md#what-is-temporary-root): DirtyFrag, GhostLock, Adreno, and POSIX timer routes, kernel patch floors, and session limits.
- [Tools and managers](./guide.md#tools-and-managers): Exploit loaders, KMI module sets, KernelSU-compatible managers, and Shizuku / ADB helpers.
- [Modules and apps](./guide.md#modules): Late-load compatibility rules, tested Zygisk / Xposed / systemless modules, root apps, and modules to avoid on locked bootloaders.
- [Firmware and recovery resources](./guide.md#firmware-and-recovery-resources) and [Research resources](./guide.md#research-resources): Stock image sources and exploit writeups.
- [Quick start](./guide.md#quick-start) and [Troubleshooting and FAQ](./guide.md#troubleshooting-and-faq): Step-by-step verification commands (`uname -r`, `su -c id`) and bootloop recovery.
- [Contributing and disclaimer](./guide.md#contributing-and-disclaimer) and [Sources](./guide.md#sources): Evidence rules for Maintainer Verified vs. User Reported entries.
