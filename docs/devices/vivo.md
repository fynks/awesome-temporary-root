---
title: vivo and iQOO
description: Temporary-root device reports, exact kernel releases, and compatibility notes for vivo and iQOO devices.
---

# vivo and iQOO

[RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) matches the full kernel release from its [catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/catalog/devices.json). Upstream documents vulnerable GhostLock ranges below `6.6.140` and `6.1.145`. These are loader limits, not universal CVE patch floors. Match the exact catalog entry. The current 1.4.3 release can also use DirtyFrag when no GhostLock payload applies. The active catalog now contains only iQOO Z9 Turbo, iQOO Neo 10, and iQOO Z9 entries; older rows survive in the frozen `support/targets-vivo.json` file, which still lists Adreno profiles even though the app does not run those binaries.

For vivo and iQOO kernels carrying `vr.ko` tracepoint hooks, [DirtyFalg-vr](https://github.com/DONGDERS/DirtyFalg-vr) forks DirtyFrag (`CVE-2026-43284`) with BTF and boot/OTA `libvrext.so` offset extraction to disarm `__tracepoint_sys_exit` before late-loading KernelSU. [Shark](https://github.com/kpgc10kai/Shark) ([upstream binaries](https://github.com/Yunnijian/Shark-Releases)) and [yuehong-privilege-assistant](https://github.com/qq2070006042-create/yuehong-privilege-assistant) provide alternative Shizuku/Stellar/OTG workflows on supported builds.

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

| Device / status | Model | Kernel / loader |
| --- | --- | --- |
| iQOO Neo 11<br><kbd>Tested</kbd> | PD2520, PD2520A to PD2520E, V2520A | `6.6.89-android15-8-g1f71897ac249`<br>Loader: RootMyVivo |
| iQOO Z10 Turbo Pro<br><kbd>Tested</kbd> | PD2453, PD2453A, V2453A | `6.6.89-android15-8-g1f71897ac249`<br>Loader: RootMyVivo |
| iQOO Z9 5G / vivo T3 5G<br><kbd>Tested</kbd> | I2302 / V2334 | `5.15.178-android13-8-g0ebe6a5da65d`<br>Loader: [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock) |
| iQOO Z9 (China)<br><kbd>Upstream profile</kbd> | PD2361, PD2361A, V2361A | `5.15.197-android13-8-00049-g7d37760ec777`<br>Loader: RootMyVivo (experimental payload; not device-tested) |
| iQOO Z9 Turbo<br><kbd>User Reported</kbd> <kbd>Not supported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/22) | V2352A / PD2352 (China, Global ROM) | `PD2352B_A_16.2.17.0.W10`, Android 16 / OriginOS 6, SPL `2026-07-01`, `6.1.145-android14-11-maybe-dirty` (4K pages)<br>Loaders: Shark v2.4.1, RootMyVivo, DFRoot (version not supplied); no manager loaded |
| vivo X200<br><kbd>Tested</kbd> | PD2415, V2415A | `6.6.89-android15-8-gb57af212129c` (Port 16.1.12.2.W10)<br>Loader: [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root) |
| iQOO Neo8<br><kbd>Tested</kbd> | PD2301, V2301A | `5.10.198-gki-gfb2f5774872c`<br>Loader: [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8) |
| iQOO Neo7<br><kbd>User Reported</kbd> <kbd>Experimental</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/12) | I2214 | `PD2238F_EX_A_16.3.15.0.W30`, `5.10.246-android12-9-00012-g730d06ec05ff-ab15159037`<br>Loader: [DirtyFrag](https://github.com/mitschud/DirtyFrag) v1.17; KernelSU-Next v3.4.2 via `adb_root`; app `su` unavailable |
| vivo Pad (2022)<br><kbd>User Reported</kbd> <kbd>Experimental</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/15) | PA2170 / DPD2106 | Android 11 `DPD2106D_A_1.36.14` (SPL `2022-12-01`), `4.19.152-perf+` (non-GKI)<br>Loader: DFRoot v4.7 (API 30 repack); DirtyFrag page-cache write only; no root |
| vivo T3 Ultra<br><kbd>Tested</kbd> <kbd>Deprecated/unavailable</kbd> | V2426 | `5.15.197-android13-8-00040-g1d68e338760e-ab15563954`<br>Loader: MT6989-ghostlock (historical result; repository unavailable) |

Upstream references: [RootMyVivo catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/catalog/devices.json), [DirtyFalg-vr](https://github.com/DONGDERS/DirtyFalg-vr), [Shark (kpgc10kai fork)](https://github.com/kpgc10kai/Shark), [Shark Releases](https://github.com/Yunnijian/Shark-Releases), [yuehong-privilege-assistant](https://github.com/qq2070006042-create/yuehong-privilege-assistant), [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock), [vivo X200 device notes](https://github.com/xiaohj233/ghostlock-x200-root#支持的设备), [vivo/iQOO 6.6.127 CVE-2026-98260 research notes](https://github.com/janewas/cve-2026-98260-vivo-gki-research).

## Compatibility notes

- RootMyVivo's README names iQOO Neo 11 (`PD2520`) on both `6.6.89` and `6.6.127` as verified by the author, and iQOO Z10 Turbo Pro (`PD2453`) as working for users. The active catalog has no Neo 11 entry, so treat the README's Neo 11 result as an upstream author claim rather than a selectable catalog target. It lists iQOO 13 India (`I2401`), iQOO Neo10 Pro (`PD2426`), vivo X200 (`PD2415`), and vivo X200 Pro (`PD2405`) as built ports that still need an on-device run. The X200 row above is confirmed through GhostLock-X200, not RootMyVivo.
- The catalog also lists experimental iQOO Z9 Turbo (`PD2352`) and iQOO Neo 10 (`PD2425`) builds, but marks both off after a geometry miss: the waiter sits `0x70` shallower and the MCAST copy misses the lock by 8 bytes, so about 36% of runs panic. The iQOO Z9 (`PD2361`) profile is the only new ready target, and it has no hardware run.
- The iQOO Z9 Turbo (`PD2352`) report on `PD2352B_A_16.2.17.0.W10` ran no exploit at all: Shark v2.4.1 and RootMyVivo both refused the model or kernel, and DFRoot's vulnerability check rejected the build. `6.1.145` is the first release above RootMyVivo's documented vulnerable `6.1` range (`6.1` up to `6.1.144`), so the loader treats the kernel as patched. This is a support refusal, not the geometry panic the disabled catalog entries describe. Treat the build as unsupported and recheck upstream after an OTA.
- The frozen target file maps iQOO 13 China (`PD2408`/`V2408A`), Neo10 Pro+, X200 Ultra, Z10 Turbo, X200s, and some Neo10 Pro b57 units to another model's payload. Those are mappings, not confirmed runs. The Z10 Turbo+ `6.6.127` and iQOO Z10 `6.1.145` entries are disabled and not claimed to work.
- GhostLock App lists a `6.6.89-android15-8-g6bf8136549d7-abogki463261049-4k` profile for iQOO 13 (`V2408A` / `PD2408`), while the frozen RootMyVivo file maps the same China model to the Neo 11 `6.6.89-android15-8-g1f71897ac249` payload. The model is the same; the kernel builds differ. Match `uname -r` and do not cross-use the two.
- The RootMyVivo README credits the author with an iQOO Neo 11 run on `6.6.127` as well as `6.6.89`. `6.6.127` is below the documented `6.6.140` GhostLock fix floor, but the catalog carries no Neo 11 entry for either kernel, so the `6.6.89` payload does not automatically cover a `6.6.127` build.
- The MT6989-ghostlock repository is unavailable, and its V2426 target is absent from the current RootMyVivo catalog. Treat the hardware result as historical only.
- The iQOO Neo8 row uses the separate Adreno port. RootMyVivo's current app does not run Adreno binaries.
- The frozen target file also carries a disabled Adreno entry for iQOO Neo 9 (`PD2338C`/`PD2338`, `5.15.178` and `5.15.197`). It is not a working claim, and the app does not run Adreno binaries.
- The iQOO Neo7 (`I2214`) run used KernelSU-Next `adb_root`. Official KernelSU 3.3.1 loaded its module but never exposed `su`, so app-level `su` remains unavailable.
- The vivo Pad `PA2170` is a partial result. DirtyFrag wrote to the page cache but 4.19 has no usable module path. GhostLock was blocked by the boot ID slide, and CVE-2024-31317 stopped at uid 1000 under vendor sepolicy.
- The catalog gives iQOO Neo 10 Global `I2405` on `6.6.89-android15-8-g97a9aaefab9a` its own payload entry. It still needs on-device confirmation. The same kernel string alone does not establish an identical image.
- [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) also lists extracted offsets awaiting a device run for vivo X200 Ultra (`V2454A`, `6.6.89`), vivo X Fold3 Pro (`PD2337`, `6.1.124`), and vivo T4 (`6.1.145`), and marks iQOO Neo 10 CN, iQOO Z9 5G, and iQOO 12 as stack-layout incompatible for its chain.
- Kernel `6.1.145-android14-11-g74d1702dab4d-ab14669069` is claimed for different devices: GhostLock App assigns it to vivo T4 and iQOO 12, ghostlock-oneplus lists vivo T4 on `6.1.145` as awaiting a device run, and RootMyVivo's frozen file assigns it to iQOO Z10 India (`I2407`) with the entry disabled because the futex waiter lands in the zeroed fd_set. A shared kernel string is not a cross-model confirmation.
- RootMyVivo's frozen file lists vivo X200s only by market name on the X200 b57 kernel. GhostLock-X200 reports the same kernel SHA-256, but no X200s hardware run and no `PD`/`V` model code were confirmed, so the X200 row does not cover it.
- Unreleased RootMyVivo commit `7556a2df` (2026-11-10, after 1.4.3) lowers the DirtyFrag patch threshold from `5.10.255` to `5.10.245` and from `6.12.87` to `6.12.57`. The published 1.4.3 APK still uses the older values.
- [DirtyFalg-vr](https://github.com/DONGDERS/DirtyFalg-vr) extends DirtyFrag (`CVE-2026-43284`) with vivo `vr.ko` tracepoint disarming (`__tracepoint_sys_exit->funcs`) using chunked `/sys/kernel/btf/vmlinux` auto-resolve, manual offset entry, or its Rust `libvrext.so` parser on stock `boot.img` / `payload.bin` / OTA archives, aborting (`W1c FAILED`) on target mismatches. It includes 8 prebuilt GKI LKMs (`android12-5.10` through `android17-6.18`), captures `fsync`'d `/dev/kmsg` logs (`kmsglog`), and requires no Shizuku.
- [yuehong-privilege-assistant](https://github.com/qq2070006042-create/yuehong-privilege-assistant) (`v1.6.7`, Android 10+, arm64) integrates Stellar wireless debugging, `DirtyFalg-vr` (`CVE-2026-43284` + vivo VR), GhostLock, GhostKey (`CVE-2026-98260`), and a vivo/iQOO wired OTG mode in one launcher.
- [Shark](https://github.com/kpgc10kai/Shark) (active English fork continuing from `v2.3.2`, tracking [Yunnijian/Shark-Releases](https://github.com/Yunnijian/Shark-Releases) after the `Yunnijian/Shark` source repository was removed in November 2026) targets `CVE-2026-98260` across 7 chains (`6.6.118`, `6.6.127`, `6.12.23`, `6.12.38`, `6.12.58`, `6.12.69`, `6.18.21`) for vivo/iQOO alongside OPlus and Xiaomi, with Shizuku/Stellar launch and hot manager switching (`KernelSU`, `KernelSU-Next`, `BakaSU`, `SukiSU Nova`/`Ultra`, `FinaSU`).
- [janewas/cve-2026-98260-vivo-gki-research](https://github.com/janewas/cve-2026-98260-vivo-gki-research) documents porting analysis for `CVE-2026-98260` on iQOO Z10 Turbo Pro (`PD2453`, `6.6.127-android15-8-g24b70dd1cb81-abogki543627741-4k`, SPL `2026-08-01`) with no exploit binaries published.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
