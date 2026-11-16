---
title: Realme
description: Temporary-root device reports, exact firmware builds, and compatibility notes for Realme phones.
---

# Realme

Realme devices in this index use dedicated GhostLock ports or DirtyFrag loaders matched to the device kernel.

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

| Device / status | Model | Build or kernel / loader |
| --- | --- | --- |
| Realme GT 7T<br><kbd>Tested</kbd> | RMX5085 | `RE6090L1`, `6.6.118-android15-8`<br>Loader: [ghostlock-rmx5085](https://github.com/Nixbones/ghostlock-rmx5085); manager ReSukiSU |
| Realme Note 50<br><kbd>User Reported</kbd><br>[Source](https://www.reddit.com/r/Magisk/comments/1xu5qqg/success_i_have_my_realme_note_50_rmx3834export/) | RMX3834export / RE5C9F | Android 15; fingerprint `realme/RMX3834/RE5C9F:15/AP3A.240905.015.A2/T.R4T2.1784276895:user/release-keys`; security patch `2026-07-01`; `5.15.189-android13-8-g746e08b68bca-ab1`<br>KernelSU LKM `v3.3.1 (32680-5)`; SELinux Enforcing; Seccomp Filter<br>Loader: DirtyFrag (CVE-2026-43284); loader app version unknown |

Upstream reference: [ghostlock-rmx5085](https://github.com/Nixbones/ghostlock-rmx5085).

## Compatibility notes

- The Realme Note 50 entry is a user report. The DirtyFrag app version is unknown.
- A post-OTA follow-up reports Android 16 (36), manager `v3.4.2-spoofed (33355-5)`, Tracepoint hook mode, Hybrid Mount `6.2.6-rc.4`, SuSFS `v2.3.0 (GKI)`, and Zygisk Next `1.5.2 (864-a4a72ce-release)`. The exact post-OTA build is not confirmed. Treat it as separate from the Android 15 row.
- [Shark](https://github.com/kpgc10kai/Shark) ([upstream binaries](https://github.com/Yunnijian/Shark-Releases)) lists `CVE-2026-98260` chains (`6.6.118`, `6.6.127`, `6.12.23`, `6.12.38`, `6.12.58`, `6.12.69`, `6.18.21`) for selected Realme kernels alongside OnePlus and OPPO.

Related ColorOS / OPlus pages: [OnePlus](./oneplus.md), [OPPO](./oppo.md). Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
