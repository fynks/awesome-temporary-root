---
title: vivo and iQOO
description: Temporary-root device reports, exact kernel releases, and compatibility notes for vivo and iQOO devices.
---

# vivo and iQOO

[RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) matches the full kernel release from its [catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/catalog/devices.json). Upstream documents vulnerable GhostLock ranges below `6.6.140` and `6.1.145`. These are loader limits, not universal CVE patch floors. Match the exact catalog entry. The current 1.4.3 release can also use DirtyFrag when no GhostLock payload applies. The catalog still carries an Adreno route for older 5.10/5.15 devices, but the app does not run those binaries.

See [Supported Devices](./index.md#status-definitions) for status definitions and matching rules.

## Supported builds

| Device / status | Model | Kernel / loader |
| --- | --- | --- |
| iQOO Neo 11<br><kbd>Tested</kbd> | PD2520, PD2520A to PD2520E, V2520A | `6.6.89-android15-8-g1f71897ac249`<br>Loader: RootMyVivo |
| iQOO Z10 Turbo Pro<br><kbd>Tested</kbd> | PD2453, PD2453A, V2453A | `6.6.89-android15-8-g1f71897ac249`<br>Loader: RootMyVivo |
| iQOO Z9 5G / vivo T3 5G<br><kbd>Tested</kbd> | I2302 / V2334 | `5.15.178-android13-8-g0ebe6a5da65d`<br>Loader: [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock) |
| iQOO Z9 (China)<br><kbd>Upstream profile</kbd> | PD2361, PD2361A, V2361A | `5.15.197-android13-8-00049-g7d37760ec777`<br>Loader: RootMyVivo (experimental payload; not device-tested) |
| vivo X200<br><kbd>Tested</kbd> | PD2415, V2415A | `6.6.89-android15-8-gb57af212129c` (Port 16.1.12.2.W10)<br>Loader: [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root) |
| iQOO Neo8<br><kbd>Tested</kbd> | PD2301, V2301A | `5.10.198-gki-gfb2f5774872c`<br>Loader: [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8) |
| iQOO Neo7<br><kbd>User Reported</kbd> <kbd>Experimental</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/12) | I2214 | `PD2238F_EX_A_16.3.15.0.W30`, `5.10.246-android12-9-00012-g730d06ec05ff-ab15159037`<br>Loader: [DirtyFrag](https://github.com/mitschud/DirtyFrag) v1.17; KernelSU-Next v3.4.2 via `adb_root`; app `su` unavailable |
| vivo Pad (2022)<br><kbd>User Reported</kbd> <kbd>Experimental</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/15) | PA2170 / DPD2106 | Android 11 `DPD2106D_A_1.36.14` (SPL `2022-12-01`), `4.19.152-perf+` (non-GKI)<br>Loader: DFRoot v4.7 (API 30 repack); DirtyFrag page-cache write only; no root |
| vivo T3 Ultra<br><kbd>Tested</kbd> <kbd>Deprecated/unavailable</kbd> | V2426 | `5.15.197-android13-8-00040-g1d68e338760e-ab15563954`<br>Loader: MT6989-ghostlock (historical result; repository unavailable) |

Upstream references: [RootMyVivo catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/catalog/devices.json), [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock), [vivo X200 device notes](https://github.com/xiaohj233/ghostlock-x200-root#支持的设备).

## Compatibility notes

- RootMyVivo's README names only iQOO Neo 11 and Z10 Turbo Pro as hardware-verified. It lists iQOO 13 India (`I2401`), iQOO Neo10 Pro (`PD2426`), vivo X200 (`PD2415`), and vivo X200 Pro (`PD2405`) as built ports that still need an on-device run. The X200 row above is confirmed through GhostLock-X200, not RootMyVivo.
- The catalog also lists experimental iQOO Z9 Turbo (`PD2352`) and iQOO Neo 10 (`PD2425`) builds, but marks both off after a geometry miss: the waiter sits `0x70` shallower and the MCAST copy misses the lock by 8 bytes, so about 36% of runs panic. The iQOO Z9 (`PD2361`) profile is the only new ready target, and it has no hardware run.
- The catalog still maps iQOO 13 China, Neo10 Pro+, X200 Ultra, Z10 Turbo, and some Neo10 Pro b57 units to another model's payload. Those are mappings, not confirmed runs. The Z10 Turbo+ 6.6.127 and iQOO Z10 6.1.145 entries are disabled and not claimed to work.
- A `6.6.127` build on an iQOO Neo 11 has the fix, so the 6.6.89 payload does not cover it.
- The MT6989-ghostlock repository is unavailable, and its V2426 target is absent from the current RootMyVivo catalog. Treat the hardware result as historical only.
- The iQOO Neo8 row uses the separate Adreno port. RootMyVivo's current app does not run Adreno binaries.
- The iQOO Neo7 (`I2214`) run used KernelSU-Next `adb_root`. Official KernelSU 3.3.1 loaded its module but never exposed `su`, so app-level `su` remains unavailable.
- The vivo Pad `PA2170` is a partial result. DirtyFrag wrote to the page cache but 4.19 has no usable module path. GhostLock was blocked by the boot ID slide, and CVE-2024-31317 stopped at uid 1000 under vendor sepolicy.
- The catalog gives iQOO Neo 10 Global `I2405` on `6.6.89-android15-8-g97a9aaefab9a` its own payload entry. It still needs on-device confirmation. The same kernel string alone does not establish an identical image.
- [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) also lists extracted offsets awaiting a device run for vivo X200 Ultra (`V2454A`, `6.6.89`), vivo X Fold3 Pro (`PD2337`, `6.1.124`), and vivo T4 (`6.1.145`), and marks iQOO Neo 10 CN, iQOO Z9 5G, and iQOO 12 as stack-layout incompatible for its chain.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
