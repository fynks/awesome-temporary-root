---
title: Supported Devices
description: Overview of temporary-root hardware reports, status definitions, and upstream support tables by brand.
---

# Supported Devices

Status shows who reported the result and what happened. A generated profile is not a confirmed target. Check the loader's live table before running. A newer release does not inherit an older result.

Match the full kernel release your phone reports (`uname -r`). Two phones on the same Android release can differ in kernel build, page size, and vendor hardening, so a partial match is not enough. If a kernel or tool version is missing, treat it as unknown.

## Status definitions

| Status | Meaning |
| --- | --- |
| <kbd>Maintainer Verified</kbd> | Hardware result directly confirmed by a repository maintainer with a linked report. |
| <kbd>User Reported</kbd> | Community hardware report with linked evidence, not independently verified by a maintainer. |
| <kbd>Tested</kbd> | Hardware run documented by the upstream loader project on this exact target. |
| <kbd>Experimental</kbd> | Partial, shell-only, or unstable result. |
| <kbd>Upstream profile</kbd> | Device kernel profile shipped upstream with no documented hardware run yet. |
| <kbd>Unverified candidate</kbd> | Matching kernel profile exists, but this model is unconfirmed on hardware. |
| <kbd>Deprecated/unavailable</kbd> | Upstream loader or repository is archived or removed. |
| <kbd>Not supported</kbd> | Hardware run on this exact build reported no root; the loader refused the target or reported the kernel patched. |

## Browse by brand

| Brand / group | Primary loaders |
| --- | --- |
| [Samsung Galaxy](./samsung.md) | Root My Galaxy, Root My Galaxy Next, Root My Galaxy Ultra, RootMyS24, GhostSam, GhostLock-Galaxy, UniRoot, ghostlock-a17, SM-A166W port |
| [Google Pixel](./pixel.md) | Root My Pixel, TimerRoot |
| [OnePlus](./oneplus.md) | ghostlock-oneplus, Anchor, Root My Device (tqmane) |
| [OPPO](./oppo.md) | ghostlock-oneplus, Root My Device (Witaqua) |
| [Realme](./realme.md) | ghostlock-rmx5085, DirtyFrag |
| [vivo and iQOO](./vivo.md) | RootMyVivo, GhostLock-X200, DirtyFrag, DFRoot, iQOO Z9 / vivo T3 port, Adreno port |
| [Xiaomi and Redmi](./xiaomi.md) | ghostlock-oneplus, Root My Device (Witaqua), DirtyFrag, GhostLock App, DFRoot |
| [ASUS](./asus.md) | zenfone9-ghostlock |
| [Nothing](./nothing.md) | Root My Device (tqmane) |
| [Honor](./honor.md) | ANB Root, MnemosyneLab/ghostlock-honor |
| [HMD and Nokia](./nokia.md) | DFRoot |
| [Amazon, NVIDIA, Meta, and TCL](./other.md) | R0rt1z2/GhostLock, GhostLock NVIDIA Shield, Root My Device (Witaqua) |

## Live upstream tables

These tables are maintained upstream and change more often than this index. Check your exact model, build, and `uname -r`. If they differ from these pages, use the upstream table.

| Project | Devices | Live support data |
| --- | --- | --- |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) | Samsung Galaxy | [Payload list](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads#supported-payloads), [JSON](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json) |
| [Root My Galaxy Next](https://github.com/rushiranpise/Root-My-Galaxy-Next) | Samsung Galaxy | [Fork payload feed](https://github.com/rushiranpise/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json) |
| [Root My Galaxy Ultra](https://github.com/xorpix/Root-My-Galaxy-Ultra) | Galaxy S26 Ultra | [S26 Ultra support rules](https://github.com/xorpix/Root-My-Galaxy-Ultra/blob/main/docs/S26-ULTRA-SUPPORT.md) |
| [GhostSam](https://github.com/MocLG/GhostSam) | Galaxy S22, S26, Z Fold8 | [Device list](https://github.com/MocLG/GhostSam#supported-devices) |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | Galaxy Z Fold6 | [Kernel list](https://github.com/wxxsfxyzm/GhostLock-Galaxy#registered-kernel-profiles) |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) | Galaxy A17 | [Target list](https://github.com/mobilehackinglab/ghostlock-a17#target) |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) | Pixel 6 to 11 | [Build list](https://github.com/alex193a/Root-My-Pixel#supported-devices--build-profiles) |
| [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) | Pixel 6 to 11, selected Xiaomi/Redmi | [Supported devices](https://github.com/MVN123123123123123/TimerRoot#supported-devices) |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) | OnePlus, OPPO, Xiaomi | [Verified list](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [Infeasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible) |
| [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) | Nothing Phone (3a), OnePlus Pad 3 | [Nothing list](https://github.com/tqmane/Root-My-Device/blob/main/devices/nothing-phone-3a/README.md#supported-target), [Pad 3 list](https://github.com/tqmane/Root-My-Device/blob/main/devices/oneplus-pad-3/README.md#supported-target) |
| [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) | Xiaomi, OPPO, and Meta Quest | [Target list](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json), [Notes](https://github.com/WitAqua-tools/Root-My-Device-Payloads#supported-targets) |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) | vivo and iQOO | [Catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/catalog/devices.json) |
| [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) | Galaxy S24/S24 Ultra, Z Flip6, China Z Fold6 | [Verified and pending firmware lists](https://github.com/NanoTurtle1145/root-my-s24#支持设备) |
| [R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock) | Amazon Fire devices, TCL T653T02 | [4.14 default branch](https://github.com/R0rt1z2/GhostLock/tree/4.14), [5.4](https://github.com/R0rt1z2/GhostLock/tree/5.4), [4.4](https://github.com/R0rt1z2/GhostLock/tree/4.4), [5.10](https://github.com/R0rt1z2/GhostLock/tree/5.10), [5.15 TCL profiles](https://github.com/R0rt1z2/GhostLock/tree/5.15) |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) | Multi-brand `uname -r` profiles | [Profile list](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) |

Return to the [complete guide](../guide.md#supported-devices).
