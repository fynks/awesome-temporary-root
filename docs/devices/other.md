---
title: Amazon, NVIDIA, Meta, Meizu, TCL, and Legacy
description: Temporary-root device reports and compatibility notes for Amazon Fire, NVIDIA Shield, Meta Quest, Meizu, TCL, and historical Sony Xperia / LG Android devices.
---

# Amazon, NVIDIA, Meta, Meizu, TCL, and Legacy

[R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock) maintains separate kernel branches. The [4.14 branch](https://github.com/R0rt1z2/GhostLock/tree/4.14) is the repository default and targets the Fire TV Stick 4K Max 1st Gen. Fire HD 8 12th Gen uses [5.4](https://github.com/R0rt1z2/GhostLock/tree/5.4); Fire TV Stick Lite, Fire TV Stick 3rd Gen, and Fire TV Stick 4K 1st Gen use [4.4](https://github.com/R0rt1z2/GhostLock/tree/4.4); Fire Max 11 and Fire TV Stick 4K 2nd Gen use [5.10](https://github.com/R0rt1z2/GhostLock/tree/5.10); TCL uses [5.15](https://github.com/R0rt1z2/GhostLock/tree/5.15). The Shield TV, Quest, and Meizu devices have dedicated ports or guides, while legacy Sony Xperia and LG models rely on historical patched CVEs.

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

## Supported builds

| Device / status | Codename | Build or kernel / loader |
| --- | --- | --- |
| Amazon Fire Max 11<br><kbd>Tested</kbd> | sunstone | Fire OS 8.3.3.8 `RS8338.3339N`, `5.10`<br>Loader: [GhostLock 5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10) |
| Fire TV Stick 4K Max (2023)<br><kbd>Tested</kbd> | karat | Fire OS 8.1.8.5 `RS8185.3891N`, `5.10`<br>Loader: [GhostLock 5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10) |
| Fire TV Stick 4K Max 1st Gen<br><kbd>Upstream profile</kbd> | kara | XDA thread lists supported builds, `4.14`<br>Loader: [GhostLock 4.14 branch](https://github.com/R0rt1z2/GhostLock/tree/4.14) (repository default) |
| Amazon Fire HD 8 (12th Gen)<br><kbd>Upstream profile</kbd> | raspite | 18 registered Fire OS builds, `5.4`<br>Loader: [GhostLock 5.4 branch](https://github.com/R0rt1z2/GhostLock/tree/5.4) |
| Fire TV Stick Lite / 3rd Gen<br><kbd>Upstream profile</kbd> | sheldon / sheldonp | XDA thread lists supported builds, `4.4`<br>Loader: [GhostLock 4.4 branch](https://github.com/R0rt1z2/GhostLock/tree/4.4) |
| Fire TV Stick 4K 1st Gen<br><kbd>Upstream profile</kbd> | mantis | XDA thread lists supported builds, `4.4`<br>Loader: [GhostLock 4.4 branch](https://github.com/R0rt1z2/GhostLock/tree/4.4) |
| TCL QM6K Pro 65-inch<br><kbd>Tested</kbd> | G08 / T653T02 | `UTT2.250416.001/AU14` (`5.15.180`), `UTT2.250416.001/AU22` / V339 (`5.15.192`)<br>Loader: [GhostLock 5.15 branch](https://github.com/R0rt1z2/GhostLock/tree/5.15) |
| NVIDIA Shield TV Pro 2019<br><kbd>Tested</kbd> | mdarcy | Shield Experience 9.2.4, `4.9.141-tegra-gb6e5605a`<br>Loader: [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4) |
| Meta Quest 3<br><kbd>Tested</kbd> | eureka | `5.10.240-g55be3759aea4`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |
| Meta Quest 3 / 3S (Adreno)<br><kbd>Tested</kbd> | eureka / panther | Pre-Aug 10, 2025 builds (`< 5115411.13420.520` / `< 117688.10380.610`)<br>Loader: [cheese](https://github.com/zhuowei/cheese) / [eureka_panther-adreno-gpu-exploit-1](https://github.com/FreeXR/eureka_panther-adreno-gpu-exploit-1) / [cheese-cake](https://github.com/sarabpal-dev/cheese-cake) (`CVE-2025-21479`) |
| Meizu 20 Pro<br><kbd>Tested</kbd> | meizu_20Pro_CN (SM8550) | Flyme `12.6` / `12.7` (Android 16, SPL `2026-10-01`), `5.15.119-android13-8-gdae8b7f03305-ab1764145455`<br>Guide: [meizu20pro-temp-root](https://github.com/h5hg6vy8nt-hue/meizu20pro-temp-root) (`DirtyFrag` v1.17 deterministic and `GhostLock` probabilistic -> KernelSU 3.3.0) |
| Meizu 21<br><kbd>Tested</kbd> | — | `GhostLock`<br>Loader: [Meizu 21 GhostLock](https://github.com/ymh001/meizu21-ghostlock-root) |

Upstream references: [Fire Max 11 tested builds](https://xdaforums.com/t/temp-root-fire-max-11-2023-sunstone.4798590/), [Fire TV Stick 4K 2nd-gen tested builds](https://xdaforums.com/t/temp-root-fire-tv-stick-4k-2nd-gen-series-karat-mantra.4798627/), [GhostLock 4.14 kara builds](https://xdaforums.com/t/temp-root-fire-tv-stick-4k-max-1st-gen-kara.4801361/), [GhostLock 4.4 sheldon builds](https://xdaforums.com/t/temp-root-downgrade-fire-tv-stick-lite-3rd-gen-sheldon-sheldonp.4800976/), [GhostLock 4.4 mantis builds](https://xdaforums.com/t/temp-root-downgrade-fire-tv-stick-4k-1st-gen-mantis.4808520/), [GhostLock 5.15 TCL profiles](https://github.com/R0rt1z2/GhostLock/tree/5.15), [NVIDIA Shield validated target](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4#validated-target), [Root My Device targets](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json).

## Compatibility notes

- The GhostLock branches also support older Fire OS builds. The linked XDA threads list tested builds and kernels. Other R0rt1z2/GhostLock branches target different devices and kernel lines, so choose the branch for the exact target. The 4.14 branch is the repository default but does not cover 5.4 or 4.4 devices.
- The Fire HD 8 12th Gen, Fire TV Stick Lite/3rd Gen, and Fire TV Stick 4K 1st Gen rows are registered upstream profiles, not re-verified hardware runs in this index. The 5.4 branch ships 18 exact `raspite` registry entries; the 4.4 branch builds `sheldon` by default and needs `PROJECT=mantis` for the 4K 1st Gen.
- Upstream verifies the TCL entry on a QM6K Pro 65-inch. Other T653T02 models may share the platform, but each firmware needs its own registry entry. Those two runs do not confirm them.
- The Shield port gives root to the live ADB daemon instead of installing a manager. Root survives ADB disconnects but not an ADB restart, and the included app re-runs the exploit at boot.
- Meta fixed GhostLock in Quest 3 incremental `52345320040100520` and Quest 3S incremental `3697600032300610`. Later builds are not vulnerable. IonStackQuest3's own target is incremental `52168470043600520`.
- Meta fixed Adreno GPU `CVE-2025-21479` on Quest 3 / 3S on August 10, 2025 (`>= 5115411.13420.520` / `117688.10380.610`). For bootloader unlocking (not RAM-only temporary root) on Quest 1 (`49845030443200410`) and Quest 2 (`50670960048600150` web), [QuestStack](https://github.com/starseed12345/QuestStack) pairs GhostLock with `CVE-2021-1931` ABL downgrade and factory-resets the headset.
- **Legacy / historical patched devices (Sony Xperia and LG):** Older locked-bootloader temporary-root tools target specific pre-patch builds only: [qu1ckr00t](https://github.com/grant-h/qu1ckr00t) / [renoshell](https://github.com/j4nn/renoshell) (`CVE-2019-2215`, pre-October 2019 SPL on Xperia XZ1 / XZp and Pixel 2), `j4nn`'s `CVE-2020-0041` `temproot` on XDA (Xperia 1 / 5, XZ2 / XZ3, LG V50 / G8), and [SO-02J-Temp-Root](https://github.com/FradSer/SO-02J-Temp-Root) (DirtyCOW `CVE-2016-5195`, Xperia X Compact `SO-02J`). None apply to modern Android builds.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
