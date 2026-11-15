---
title: Supported Devices
description: Overview of temporary-root hardware reports, status definitions, and upstream support tables by brand.
---

# Supported Devices

Status shows who reported the result and what happened. A generated profile is not a confirmed target. Check the loader's live table before running. A newer release does not inherit an older result.

Match the full kernel release your phone reports (`uname -r`). Two phones on the same Android release can differ in kernel build, page size, and vendor hardening, so a partial match is not enough. If a kernel or tool version is missing, treat it as unknown.

## Browse by brand

| Brand / group | Listed entries | Primary loaders |
| --- | --- | --- |
| [Samsung Galaxy](./samsung.md) | 28 | Root My Galaxy, RootMyS24, GhostSam, UniRoot, ghostlock-a17, SM-A166W port |
| [Google Pixel](./pixel.md) | 15 | Root My Pixel |
| [OnePlus](./oneplus.md) | 6 | ghostlock-oneplus, Anchor, Root My Device (tqmane) |
| [OPPO](./oppo.md) | 2 | ghostlock-oneplus, Root My Device (Witaqua) |
| [Realme](./realme.md) | 2 | ghostlock-rmx5085, DirtyFrag |
| [vivo and iQOO](./vivo.md) | 9 | RootMyVivo, GhostLock-X200, DirtyFrag, DFRoot, iQOO Z9 / vivo T3 port, Adreno port |
| [Xiaomi and Redmi](./xiaomi.md) | 6 | ghostlock-oneplus, Root My Device (Witaqua), DirtyFrag, GhostLock App, DFRoot |
| [ASUS](./asus.md) | 1 | zenfone9-ghostlock |
| [Nothing](./nothing.md) | 1 | Root My Device (tqmane) |
| [Honor](./honor.md) | 2 | ANB Root, MnemosyneLab/ghostlock-honor |
| [HMD and Nokia](./nokia.md) | 1 | DFRoot |
| [Amazon, NVIDIA, Meta, and TCL](./other.md) | 5 | R0rt1z2/GhostLock, GhostLock NVIDIA Shield, Root My Device (Witaqua) |

## Status definitions

| Status | Meaning |
| --- | --- |
| <kbd>Maintainer Verified</kbd> | A maintainer of this repository supplied or directly confirmed this hardware result and linked a report. It covers only the details in that report. It is not a security audit or a guarantee for other builds. |
| <kbd>User Reported</kbd> | A community member reported this hardware result with a linked report. This repository's maintainer has not independently verified it. The entry keeps the reported outcome and limitations. |
| <kbd>Tested</kbd> | An upstream project documents a completed hardware run on the stated target, including the full temporary-root chain where the loader provides one. This label alone does not imply maintainer verification. |
| <kbd>Experimental</kbd> | The run was partial, shell-only, or explicitly experimental. |
| <kbd>Upstream profile</kbd> | The upstream project lists an exact kernel profile for this device, but no documented hardware run confirms it. Treat it as a candidate. |
| <kbd>Unverified candidate</kbd> | The loader has a profile for this kernel, but no confirmed run exists for this model. |
| <kbd>Deprecated/unavailable</kbd> | The upstream project or loader is archived, removed, or no longer distributed. |

## Live upstream tables

These tables are maintained upstream and change more often than this index. Check your exact model, build, and `uname -r`. If they differ from these pages, use the upstream table.

| Project | Devices | Live support data |
| --- | --- | --- |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) | Samsung Galaxy | [Payload list](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads#supported-payloads), [JSON](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json) |
| [GhostSam](https://github.com/MocLG/GhostSam) | Galaxy S22, S26, Z Fold8 | [Device list](https://github.com/MocLG/GhostSam#supported-devices) |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | Galaxy Z Fold6 | [Kernel list](https://github.com/wxxsfxyzm/GhostLock-Galaxy#registered-kernel-profiles) |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) | Galaxy A17 | [Target list](https://github.com/mobilehackinglab/ghostlock-a17#target) |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) | Pixel 6 to 11 | [Build list](https://github.com/alex193a/Root-My-Pixel#supported-devices--build-profiles) |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) | OnePlus, OPPO, Xiaomi | [Verified list](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [Infeasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible) |
| [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) | Nothing Phone (3a), OnePlus Pad 3 | [Nothing list](https://github.com/tqmane/Root-My-Device/blob/main/devices/nothing-phone-3a/README.md#supported-exact-targets), [Pad 3 list](https://github.com/tqmane/Root-My-Device/blob/main/devices/oneplus-pad-3/README.md#supported-target) |
| [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) | Xiaomi, OPPO, and Meta Quest | [Target list](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json), [Notes](https://github.com/WitAqua-tools/Root-My-Device-Payloads#supported-targets) |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) | vivo and iQOO | [Catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/catalog/devices.json) |
| [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) | Galaxy S24/S24 Ultra, Z Flip6, China Z Fold6 | [Verified and pending firmware lists](https://github.com/NanoTurtle1145/root-my-s24#支持设备) |
| [R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock) | Amazon Fire devices, TCL T653T02 | [5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10), [Fire build threads](https://github.com/R0rt1z2/GhostLock/tree/5.10#readme), [5.15 TCL profiles](https://github.com/R0rt1z2/GhostLock/tree/5.15) |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) | Multi-brand `uname -r` profiles | [Profile list](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) |

Return to the [complete guide](../guide.md#supported-devices).
