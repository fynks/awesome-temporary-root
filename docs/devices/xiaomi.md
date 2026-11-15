---
title: Xiaomi and Redmi
description: Temporary-root device reports, HyperOS builds, and compatibility notes for Xiaomi, Redmi, and POCO devices.
---

# Xiaomi and Redmi

Xiaomi and Redmi devices use several independent loaders, including [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus), [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device), [DirtyFrag](https://github.com/mitschud/DirtyFrag), [DFRoot](https://github.com/diabl0w/DFRoot), and [GhostLock App](https://github.com/YuKongA/ghostlock-app).

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

## Supported builds

| Device / status | Model or codename | Build or kernel / loader |
| --- | --- | --- |
| Xiaomi 17<br><kbd>Tested</kbd> | pudding | `OS3.0.315.0.WPCCNXM` (`6.12.23`), `6.12.69`<br>Loader: ghostlock-oneplus |
| Xiaomi 17T Pro<br><kbd>Tested</kbd> | warhol | `OS3.0.304.0.WPSJPXM`, `6.12.38-android16-5-g1d46253471dd-ab15048002-4k`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |
| Xiaomi 14T Japan<br><kbd>Tested</kbd> | XIG07 | `OS3.0.7.0.WNEJPKD`, `6.1.138-android14-11-g44bda9e8f6e9-ab13792638`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |
| Redmi Note 13 4G<br><kbd>Maintainer Verified</kbd> | sapphire | Android 15; HyperOS `2.0.213.0` Global; security patch `2026-08-01`<br>Kernel and loader version: unknown<br>Loader: [mitschud/DirtyFrag](https://github.com/mitschud/DirtyFrag) |
| Redmi Note 14 4G<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/6) | 24117RN76L | `BP2A.250605.031.A3`, `6.12.30-android16-5-g6e872b4863d6-ab13847919-4k`<br>Loader: [GhostLock App](https://github.com/YuKongA/ghostlock-app) v1.2; successful temporary root reported |
| Redmi Note 14 4G (DFRoot)<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/17) | tanzanite / 24117RN76L | `BP2A.250605.031.A3`, `6.12.30-android16-5-g6e872b4863d6-ab13847919-4k` (Android 16, HyperOS, SPL `2026-08-01`)<br>Loader: [DFRoot](https://github.com/diabl0w/DFRoot) v4.7; KernelSU `v3.3.1 (32680-5)` |

Upstream references: [Maintainer report: Redmi Note 13 4G](https://github.com/fynks/awesome-temporary-root/issues/9#issuecomment-6871968996), [Root My Device targets](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json), [ghostlock-oneplus verified devices](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [GhostLock App profile list](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md).

## Compatibility notes

- The Redmi Note 13 4G entry is a maintainer-reported DirtyFrag run on `sapphire`. Kernel and loader version are unknown. Do not generalize to other Note 13 variants or builds.
- The Redmi Note 14 4G DFRoot row is separate from the GhostLock row. DFRoot v4.3 rebooted the device on every run; v4.7 succeeded with KernelSU 3.3.1.
- The Redmi Note 14 4G run used the GhostLock App profile for kernel `6.12.30-android16-5-g6e872b4863d6-ab13847919-4k`, which upstream lists for the REDMI Note 15 4G and POCO M6 Pro 4G. GhostLock App selects on `uname -r`, so the same kernel string covers all three models, but the offset layout can still differ between them. Confirm the exact model, and treat a Note 14 4G run as unverified on a Note 15 4G and the reverse.
- GhostLock App has profiles for many Xiaomi, POCO, and Redmi devices. Those are candidates, not confirmed runs. Its [MediaTek guide](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/MEDIATEK.md) covers MT devices that miss the default target.
- The POCO M6 Pro 4G ([ghostlock-emerald](https://github.com/datfooldive/ghostlock-emerald)) port has no upstream support table, so it is not listed as a confirmed target.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
