---
title: OPPO
description: Temporary-root device reports, exact firmware builds, and compatibility notes for OPPO phones and tablets.
---

# OPPO

[ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) and [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) provide OPPO payloads matched on exact kernel builds, while [CVE-2025-21479-FX5P](https://github.com/diyiqiuye/CVE-2025-21479-FX5P) covers Find X5 Pro `5.10` Adreno builds and [Shark](https://github.com/kpgc10kai/Shark) targets selected `CVE-2026-98260` ColorOS kernels.

## Status definitions

| Status | Meaning |
| --- | --- |
| <kbd>Maintainer Verified</kbd> | Hardware result directly confirmed by a repository maintainer with a linked report. |
| <kbd>User Reported</kbd> | Community hardware report with linked evidence, not independently verified by a maintainer. |
| <kbd>Tested</kbd> | Hardware run documented by the upstream loader project on this exact target. |
| <kbd>Experimental</kbd> | Partial, shell-only, or unstable result. |
| <kbd>Upstream profile</kbd> | Device kernel profile shipped upstream with no documented hardware run yet. |
| <kbd>Unverified candidate</kbd> | Matching kernel profile exists, but this model is unconfirmed on hardware. |
| <kbd>Not supported</kbd> | Hardware run on this exact build reported no root; the loader refused the target or reported the kernel patched. |

## Supported builds

| Device / status | Model | Build or kernel / loader |
| --- | --- | --- |
| OPPO Find X8s<br><kbd>Tested</kbd> | PKT110 | ColorOS 17 / Android 17, `6.6.118-android15-8-g9bc34d5b0c79-abogki537459655-4k`<br>Loader: [oppo-jailbreak](https://github.com/tw0m8/oppo-jailbreak) (app `RootNow`; KernelSU-Next reports Working, LKM, jailbreak mode) |
| OPPO Find N2<br><kbd>Tested</kbd> | PGU110 (SM8475) | KMI `android12-5.10`, `5.10.236` (post-OTA `5.10.246`) <br>Loader: [findn2-ksu-chain](https://github.com/pubglite55/findn2-ksu-chain) (futex-PI write -> cred overwrite -> self-built KernelSU LKM; SELinux stays Enforcing) |
| OPPO Pad 3<br><kbd>Tested</kbd> | OPD2405 / OP6159L1 | Android 16, `6.1.157-android14-11` (GKI, 4 KB pages)<br>Loader: [CVE-2026-98260-OPD2405](https://github.com/Yunxi422/CVE-2026-98260-OPD2405) (`adb shell` uid 2000 -> uid 0, optional KernelSU late-load; ReSukiSU 4.2.0-rc3) |
| OPPO Reno7 5G<br><kbd>Experimental</kbd> | OP5227 | Android 12, `5.4.254-qgki-gaa96eae94d32`<br>Loader: [ghostlock54-OPPO-Reno7-5G](https://github.com/qunbot/ghostlock54-OPPO-Reno7-5G) (GhostLock54; replaces `cred` with `init_cred` and drops seccomp, so it gives a root shell rather than a manager) |
| OPPO A96<br><kbd>Experimental</kbd> | PFUM10 | `CVE-2026-43499` chain into a BakaSU driver<br>Loader: [BakaSU-PostLock](https://github.com/poisongod/BakaSU-PostLock) (post-relock toolkit with `ocsk` kernel-defence probes against `OPLUS_ROOT_CHECK` and boot-restore scripts) |
| OPPO K15 Pro+<br><kbd>Experimental</kbd> | PMG110 | `PMG110_16.0.9.400(CN01)`, `6.6.118-android15-8-g93e223c276e7-abogki500782043-4k`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |
| OPPO Pad 4 Pro<br><kbd>Tested</kbd> | n/a | `6.6.89-android15-8-g096cdb6ecefc-ab14358676-4k`<br>Loader: ghostlock-oneplus |
| OPPO Find X5 Pro<br><kbd>Tested</kbd> | PFEM00 | `5.10.198-android12-9`, `5.10.168` (`14.0.0.81(CN01)`)<br>Loader: [CVE-2025-21479-FX5P](https://github.com/diyiqiuye/CVE-2025-21479-FX5P) (`CVE-2025-21479` Adreno KGSL, PC/ADB; KernelSU 3.3.0) |

Additional OPPO ports:

- [oppo-jailbreak](https://github.com/tw0m8/oppo-jailbreak) ships `RootNow` and was field-tested on a retail Find X8s on the latest ColorOS 17.
- [findn2-ksu-chain](https://github.com/pubglite55/findn2-ksu-chain) builds its own KernelSU module and keeps SELinux Enforcing; it is the clearest end-to-end write-up for a MediaTek-free OPPO target.
- [CVE-2026-98260-OPD2405](https://github.com/Yunxi422/CVE-2026-98260-OPD2405) credits [cuteaplane/CVE-2026-98260-for-OPD2501](https://github.com/cuteaplane/CVE-2026-98260-for-OPD2501) and [zjns/CVE-2026-98260](https://github.com/zjns/CVE-2026-98260) as its same-KMI sources.

Upstream references: [ghostlock-oneplus verified devices](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [not-feasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible), [Root My Device (Witaqua) targets](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json).

## Compatibility notes

- OPPO Pad 4 Pro uses a different root path (UMH) in ghostlock-oneplus.
- ghostlock-oneplus has extracted offsets awaiting a device run for OPPO Reno10 Pro+ (`CPH2521`, `5.10.236`) and OPPO Find X9 Pro (`PLG110`, `6.12.23`). Its not-feasible list includes OPPO Find X9 Ultra. Check both before trying a build.
- [Shark](https://github.com/kpgc10kai/Shark) ([upstream binaries](https://github.com/Yunnijian/Shark-Releases)) lists `CVE-2026-98260` chains (`6.6.118`, `6.12.38`, `6.12.58`, `6.12.69`, `6.18.21`) covering selected OPPO builds alongside OnePlus and Realme. Its device table added OPPO K15 Pro+ (`PMG110`) on `6.6.118-android15-8-g9bc34d5b0c79-abogki537459655-4k` in November 2026; that entry is an upstream profile with a linked working report, not a hardware run verified here.

Related ColorOS / OPlus pages: [OnePlus](./oneplus.md), [Realme](./realme.md). Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
