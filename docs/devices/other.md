---
title: Amazon, NVIDIA, Meta, and TCL
description: Temporary-root device reports and compatibility notes for Amazon Fire, NVIDIA Shield, Meta Quest, and TCL Android devices.
---

# Amazon, NVIDIA, Meta, and TCL

[R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock) maintains separate kernel branches. The Fire Max 11 and Fire TV Stick 4K 2nd-gen entries use the [5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10), not the repository's current default branch, and TCL uses the [5.15 branch](https://github.com/R0rt1z2/GhostLock/tree/5.15). The Shield TV and Quest 3 have dedicated ports.

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

| Device / status | Codename | Build or kernel / loader |
| --- | --- | --- |
| Amazon Fire Max 11<br><kbd>Tested</kbd> | sunstone | Fire OS 8.3.3.8 `RS8338.3339N`, `5.10`<br>Loader: [GhostLock 5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10) |
| Fire TV Stick 4K Max (2023)<br><kbd>Tested</kbd> | karat | Fire OS 8.1.8.5 `RS8185.3891N`, `5.10`<br>Loader: [GhostLock 5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10) |
| TCL QM6K Pro 65-inch<br><kbd>Tested</kbd> | G08 / T653T02 | `UTT2.250416.001/AU14` (`5.15.180`), `UTT2.250416.001/AU22` / V339 (`5.15.192`)<br>Loader: [GhostLock 5.15 branch](https://github.com/R0rt1z2/GhostLock/tree/5.15) |
| NVIDIA Shield TV Pro 2019<br><kbd>Tested</kbd> | mdarcy | Shield Experience 9.2.4, `4.9.141-tegra-gb6e5605a`<br>Loader: [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4) |
| Meta Quest 3<br><kbd>Tested</kbd> | eureka | `5.10.240-g55be3759aea4`, incremental `52345320035400520`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |

Upstream references: [Fire Max 11 tested builds](https://xdaforums.com/t/temp-root-fire-max-11-2023-sunstone.4798590/), [Fire TV Stick 4K 2nd-gen tested builds](https://xdaforums.com/t/temp-root-fire-tv-stick-4k-2nd-gen-series-karat-mantra.4798627/), [GhostLock 5.15 TCL profiles](https://github.com/R0rt1z2/GhostLock/tree/5.15), [NVIDIA Shield validated target](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4#validated-target), [Root My Device targets](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json).

## Compatibility notes

- The GhostLock 5.10 branch also supports older Fire OS builds. The linked XDA threads list tested builds and kernels. Other R0rt1z2/GhostLock branches target different devices and kernel lines, so choose the branch for the exact target.
- Upstream verifies the TCL entry on a QM6K Pro 65-inch. Other T653T02 models may share the platform, but each firmware needs its own registry entry. Those two runs do not confirm them.
- The Shield port gives root to the live ADB daemon instead of installing a manager. Root survives ADB disconnects but not an ADB restart, and the included app re-runs the exploit at boot.
- Meta fixed GhostLock in Quest 3 incremental `52345320040100520` and Quest 3S incremental `3697600032300610`. Later builds are not vulnerable. IonStackQuest3's own target is incremental `52168470043600520`.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
