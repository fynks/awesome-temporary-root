---
title: Samsung Galaxy
description: Temporary-root device reports, exact firmware builds, and compatibility notes for Samsung Galaxy phones and tablets.
---

# Samsung Galaxy

[Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) is the main loader and ships per-build payloads matched on model plus kernel. [Root My Galaxy Next](https://github.com/rushiranpise/Root-My-Galaxy-Next), [Root My Galaxy Ultra](https://github.com/xorpix/Root-My-Galaxy-Ultra), and [Root My Galaxy Extended](https://github.com/igorcv88/Root-My-Galaxy-Extended) are independent forks with their own payload feeds and extra backends, not newer releases of the same app. GhostLock-Galaxy, the A17 and A16 ports, UniRoot, GhostSam, SamTimer, GhostKey, and RootMyS24 cover builds outside its list.

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
| Galaxy S25, S25+, S25 Ultra, S25 Edge<br><kbd>Tested</kbd> | SM-S9310/B/N/Q/U/U1/W/Z, SM-S936B/N/U/U1/W, SM-S937B/N/U/U1/W, SM-S9380/B/N/Q/U/U1/W/Z, SC-51F, SCG31, SC-52F, SCG32 | `6.6.98`<br>Loader: Root My Galaxy |
| Galaxy S25+ China<br><kbd>Tested</kbd> | SM-S9360 | `S9360ZCSCCZG1`, `6.6.98`<br>Loader: Root My Galaxy |
| Galaxy S25 Edge China<br><kbd>Tested</kbd> | SM-S9370 | `S9370ZCS9CZG1`, `6.6.98`<br>Loader: Root My Galaxy |
| Galaxy S25 Edge (Extended)<br><kbd>Tested</kbd> | SM-S937B | `S937BXXU8CZF1`, `6.6.98`<br>Loader: [Root My Galaxy Extended](https://github.com/igorcv88/Root-My-Galaxy-Extended) |
| Galaxy S25 Ultra (Extended, One UI 9 beta)<br><kbd>Tested</kbd> | SM-S938B | `S938BXXUCZZI4`, `6.6.127`<br>Loader: [Root My Galaxy Extended](https://github.com/igorcv88/Root-My-Galaxy-Extended) (KernelSU Next / SUSFS supported; upstream notes `S938B` `CZG3` tested and `S936B` unvalidated) |
| Galaxy S25 Ultra (US)<br><kbd>Upstream profile</kbd> | SM-S938U1 | `S938U1UEUDDZJB`, `6.6.127-android15-8-p87b1ce1-abogkiS938USQUDDZJB-4k`<br>Loader: [Root My Galaxy Next](https://github.com/rushiranpise/Root-My-Galaxy-Next) (CVE-2026-98260; feed ships KernelSU 3.3.0, KernelSU-Next 3.4.2, and BakaSU 4.2.0-rc3 flavours) |
| Galaxy S24 Ultra (US)<br><kbd>Tested</kbd> | SM-S928U1 | `S928USQS6DZF2`, `6.1.145`<br>Loader: Root My Galaxy |
| Galaxy S24 Ultra International<br><kbd>Tested</kbd> | SM-S928B | `S928BXXS6DZF2`, `6.1.145`<br>Loader: Root My Galaxy |
| Galaxy S24 Ultra China<br><kbd>Tested</kbd> | SM-S9280 | `S9280ZCS6DZF2`, `6.1.145`<br>Loader: Root My Galaxy |
| Galaxy S24+<br><kbd>Tested</kbd> | SM-S926B | `S926BXXUEDZDR`, `6.1.157`<br>Loader: Root My Galaxy |
| Galaxy S23 Ultra<br><kbd>Tested</kbd> | SM-S918B | `S918BXXSAFZF5`, `5.15.189`<br>Loader: Root My Galaxy (Shizuku mode) |
| Galaxy S23+<br><kbd>Experimental</kbd> | SM-S916B | `S916BXXSAFZG1`, `5.15.189`<br>Loader: Root My Galaxy (shell-only profile) |
| Galaxy A56 5G<br><kbd>Tested</kbd> | SM-A566E | `A566EXXSCCZG6`, `6.6.102`<br>Loader: Root My Galaxy |
| Galaxy A36 5G<br><kbd>Tested</kbd> | SM-A366W | `A366WVLS3AYG1`, `6.6.46`<br>Loader: Root My Galaxy |
| Galaxy A53 5G<br><kbd>Tested</kbd> | SM-A536E | `A536EXXSNGZG3`, `5.10.237`<br>Loader: Root My Galaxy |
| Galaxy Tab S9 (Wi-Fi)<br><kbd>Tested</kbd> | SM-X710 | `X710XXS6EZF1`, `5.15.189`<br>Loader: Root My Galaxy |
| Galaxy S26 Ultra (GalaxyCrash)<br><kbd>Tested</kbd> | SM-S948B (m3q) | `6.12.69-android16-6-pee899be-abogkiS948BXXU4BZI6-4k` (Android 17, SPL `2026-09`)<br>Loader: [GalaxyCrash](https://github.com/RemiPelloux/GalaxyCrash) (stability fork of DirtyFrag; one build tested, the October patch was not retested) |
| Galaxy S26 Ultra (Samsung Root Kit)<br><kbd>Upstream profile</kbd> | SM-S948U1 (US) | One UI 9.5 / Android 17, Knox 3.15, `6.12.69-android16-6` (4K pages)<br>Loader: [SamsungRootKit](https://github.com/shangu2003/SamsungRootKit) (offline toolbox: DirtyFrag first, GhostLock fallback, DFReroot persistence; it publishes per-model firmware counts, not a hardware run) |
| Galaxy S26 Ultra (Samsung Root Managers)<br><kbd>Upstream profile</kbd> | SM-S948U1 (US) | One UI 9.5 / Android 17, Knox 3.15, `6.12.69-android16-6` (4K pages)<br>Loader: [Samsung Root Managers](https://github.com/thecaticorn01/Samsung-Root-Managers) (continuously rebuilt KernelSU-Next and BakaSU managers with `ksud` and `.ko` for LKM late-load; built for this model, no hardware run claimed) |
| Galaxy S23 (SM-S9110)<br><kbd>Tested</kbd> | SM-S9110 (dm1q, TGY) | `S9110ZHS8FZI1`, `5.15.189-android13-8-33413713-abS9110ZHS8FZI1`<br>Loader: [root-my-s23](https://github.com/zxsos/root-my-s23) (re-arms `CVE-2026-43499` and KernelSU late-load at boot without a PC; also lists `SM-S911U1` `5.15.153` verified) |
| Galaxy S24 Ultra (DZJ3)<br><kbd>Tested</kbd> | SM-S9280 (e3q, CHC) | `S9280ZCS6DZJ3`, `6.1.145-android14-11-3254743-abS9280ZCS6DZJ3`<br>Loader: [galaxy-s24u-dzj3-temp-root](https://github.com/Reallyliked21/galaxy-s24u-dzj3-temp-root) (source-only `CVE-2026-98260` chain; the RootMyS24 app entry for this build is still untested) |
| Galaxy S24 (China, CYL1)<br><kbd>Experimental</kbd> | SM-S9210 | `S9210ZCS4CYL1`, `6.1.128`<br>Loader: [CVE-2026-43499-CYL1](https://github.com/zhanghangjie/CVE-2026-43499-CYL1) (GhostLock resource pack: probe guard, fake `fops`, kprobe templates, and three successful root runs with panic logs) |
| Galaxy XR<br><kbd>Tested</kbd> | SM-I610 (AZJ2) | `5.10.240-android12-9-perf-33775878-abI610UES3AZJ2`<br>Loader: [galaxyxr-root](https://github.com/booinspace/galaxyxr-root) (locally built DirtyFrag helper and KernelSU GXR manager; manager reports `Working [Jailbreak mode]`; AZJ2 only) |
| Galaxy Tab S10 FE (Wi-Fi)<br><kbd>Tested</kbd> | SM-X520 | `X520XXSBCZI2` (Exynos 1580)<br>Loader: [Galaxy Tab S10 FE root](https://github.com/CarlenGoss/Galaxy-Tab-S10-FE-root-temporal) (root-my-galaxy GhostLock port plus KernelSU late-load and a Shizuku launcher app) |
| Galaxy A17<br><kbd>Tested</kbd> | SM-A175F | `A175FXXS3BZA5` (`6.12.23`), `A175FXXS6CZG1` (`6.12.38`)<br>Loader: [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) |
| Galaxy A16 5G<br><kbd>Tested</kbd> | SM-A166W | `A166WVLS8DZG1`, `5.15.189-android13-3-33503169`<br>Loader: [SM-A166W port](https://github.com/jojobear691/SM-A166W-DZG1-Temporary-Root) |
| Galaxy A15 4G<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/16) | SM-A155F (CSC not supplied) | `BP2A.250605.031.A3`, `6.12.23-android16-5-abA155FXXU7DYK1-4k` (One UI 8 / Android 16, SPL `2025-10-01`)<br>Loader: [UniRoot](https://github.com/kuuky29/UniRoot) v5.0.0 (DirtyFrag); manager KernelSU Next |
| Galaxy Z Fold4<br><kbd>Tested</kbd> | SM-F9360 | `F9360ZCSAIZF1`, `5.10.236`<br>Loader: [Root My Galaxy Payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) (command line) |
| Galaxy Z Flip6 (Korea)<br><kbd>Tested</kbd> | SM-F741N | `F741NKSS4DZE1`, `6.1.145`<br>Loader: [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) |
| Galaxy S24 (China)<br><kbd>Tested</kbd> | SM-S9210 | `S9210ZCS6DZI1`, `6.1.145`<br>Loader: RootMyS24 |
| Galaxy S24+ (Taiwan)<br><kbd>Tested</kbd> | SM-S9260 | `S9260ZHS6DZG1`, `6.1.145`<br>Loader: RootMyS24 |
| Galaxy S24 Ultra (Europe, One UI 9)<br><kbd>Tested</kbd> | SM-S928B | `S928BXXU6EZIF`, `6.1.162`<br>Loader: RootMyS24 |
| Galaxy S24 Ultra (Europe, One UI 9, EZJ1)<br><kbd>Tested</kbd> | SM-S928B | `S928BXXS6EZJ1`, `6.1.162`<br>Loader: RootMyS24 (POSIX CPU timers route) |
| Galaxy S24 Ultra (S9280, One UI 9)<br><kbd>Tested</kbd> | SM-S9280 | `S9280ZHU6EZIF`, `6.1.162`<br>Loader: RootMyS24 (POSIX CPU timers route) |
| Galaxy S24 (international, One UI 9)<br><kbd>Tested</kbd> | SM-S921E | `S921EXXU3DZIF`, `6.1.162`<br>Loader: RootMyS24 (POSIX CPU timers route) |
| Galaxy S24 (Korea, One UI 9)<br><kbd>Tested</kbd> | SM-S921N (e1s, Exynos 2400) | `6.1.162-android14-11` (One UI 9)<br>Loader: [SamTimer](https://github.com/Leo141212/SamTimer) (`CVE-2026-98260`, Shizuku; KernelSU-Next 3.4.2 no-patch-text build) |
| Galaxy S24 Ultra (China)<br><kbd>Tested</kbd> | SM-S9280 | `S9280ZCS6DZF2` (baseline), `S9280ZCS6DZH3`, `S9280ZHS6DZE2` / `S9280ZHS6DZH3` (HK/TW), `S9280ZCS6DZG1`, `6.1.145`<br>Loader: RootMyS24 |
| Galaxy S24 Ultra (China, DZJ3)<br><kbd>Experimental</kbd> | SM-S9280 | `S9280ZCS6DZJ3`, `6.1.145`<br>Loader: RootMyS24 (98260 route; manual staging verified, app path not yet tested) |
| Galaxy Z Fold6 (China)<br><kbd>Tested</kbd> | SM-F9580 | `6.1.145` (shares the S24 Ultra China DZF2 payload)<br>Loader: RootMyS24 |
| Galaxy Z Fold6 (`q6q`)<br><kbd>Upstream profile</kbd> | SM-F9560 | `F9560ZCS4DZI1`, `F9560ZCS4DZH5`, `F9560ZCS4DZG3`, all `6.1.145-android14-11-3254009`<br>Loader: [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) |
| Galaxy S26, S26+, S26 Ultra<br><kbd>Tested</kbd> | SM-S942x, SM-S947x, SM-S948x | `6.12` (Snapdragon `S9420ZCS4AZG1` and Exynos `S942BXXS4AZG5`, `S947BXXS4AZG5`, plus other tested builds)<br>Loader: [GhostSam](https://github.com/MocLG/GhostSam) / [ghostlock-s26](https://github.com/snothin/ghostlock-s26) |
| Galaxy S26 Ultra (BZJA)<br><kbd>Tested</kbd> | SM-S948B (m3q) | `S948BXXU5BZJA`, Android 16, `6.12` family (full release not supplied)<br>Loader: [Root My Galaxy Ultra](https://github.com/xorpix/Root-My-Galaxy-Ultra) (DirtyFrag; root and SusFS confirmed upstream) |
| Galaxy S26 Ultra (AZHL)<br><kbd>Upstream profile</kbd> | SM-S948B (m3q) | `S948BXXS4AZHL`, `6.12.30-android16-5-pd30ff70-abogkiS948BXXS4AZHL-4k` (4 KB pages)<br>Loader: Root My Galaxy Ultra (M3Q / GhostLock; exact recorded build, Shizuku) |
| Galaxy S26 Ultra (BZIG)<br><kbd>Tested</kbd> | SM-S948B (m3q) | `S948BXXS4BZIG`, `6.12.69-android16-6-pb4d3caf-abogkiS948BXXS4BZIG-4k` (4 KB pages)<br>Loader: Root My Galaxy Ultra (DirtyFrag; before-first-unlock root confirmed with BakaSU, about 54 seconds after boot) |
| Galaxy S26 Ultra (BZK1)<br><kbd>Upstream profile</kbd> | SM-S948N (m3q) | `S948NKSS6BZK1`, `6.12.69-android16-6-p342046c-abogkiS948NKSS6BZK1-4k` (4 KB pages; offline boot-image check only)<br>Loader: Root My Galaxy Ultra |

Ports for Galaxy builds outside the Root My Galaxy feeds:

- [GalaxyCrash](https://github.com/RemiPelloux/GalaxyCrash), [SamsungRootKit](https://github.com/shangu2003/SamsungRootKit), [Samsung Root Managers](https://github.com/thecaticorn01/Samsung-Root-Managers), [root-my-s23](https://github.com/zxsos/root-my-s23), [galaxy-s24u-dzj3-temp-root](https://github.com/Reallyliked21/galaxy-s24u-dzj3-temp-root), [CVE-2026-43499-CYL1](https://github.com/zhanghangjie/CVE-2026-43499-CYL1), [galaxyxr-root](https://github.com/booinspace/galaxyxr-root), [Galaxy Tab S10 FE root](https://github.com/CarlenGoss/Galaxy-Tab-S10-FE-root-temporal), [KsuLateLoad](https://github.com/NanoTurtle1145/KsuLateLoad), and [DFReroot](https://github.com/polygraphene/DFReroot).
- [Time-My-Galaxy](https://github.com/MocLG/Time-My-Galaxy) downloads a signed per-build bundle keyed on `ro.build.version.incremental` and marks builds verified only after a run; treat anything it lists without that mark as untested.

Upstream references: [Root My Galaxy payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads#supported-payloads), [targets-v3.json](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json), [Root My Galaxy Ultra support rules](https://github.com/xorpix/Root-My-Galaxy-Ultra/blob/main/docs/S26-ULTRA-SUPPORT.md), [Root My Galaxy Next feed](https://github.com/rushiranpise/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json), [ghostlock-a17 target](https://github.com/mobilehackinglab/ghostlock-a17#target), [SM-A166W build](https://github.com/jojobear691/SM-A166W-DZG1-Temporary-Root#exact-supported-build), [RootMyS24 tested firmware](https://github.com/NanoTurtle1145/root-my-s24#支持设备), [ghostlock-s26 firmware](https://github.com/snothin/ghostlock-s26#supported-firmware), [GalaxyCrash](https://github.com/RemiPelloux/GalaxyCrash), [root-my-s23 targets](https://github.com/zxsos/root-my-s23#readme), [galaxyxr-root AZJ2 release](https://github.com/booinspace/galaxyxr-root/releases/tag/azj2-root-2026.11.12).

## Compatibility notes

- Galaxy S23 Ultra (`SM-S918B`) is confirmed through the app's Shizuku mode only. Galaxy S23+ (`SM-S916B`) has an ADB-shell profile and no app payload, so treat it as experimental.
- The Galaxy A15 4G (`SM-A155F`) report did not include a CSC. It used UniRoot 5.0.0's DirtyFrag path with KernelSU Next.
- Some payloads cover more models than the test device: the S24 Ultra payload also matches `SM-S928W`, and the A56 payload matches `SM-A5660`, `SM-A566B`, `SM-A566S`, `SM-A566U1`, and `SM-A566W`.
- The current Root My Galaxy payload feed adds Galaxy Z Fold7 profiles (`SM-F966U`, `SM-F966U1`, and two `SM-F966B` builds), a Galaxy S24 base profile (`SM-S921B`, `6.1.157`), a Galaxy S24 FE profile (`SM-S721B`, `6.1.157`), and a base Galaxy S23 profile (`SM-S911U1`, `5.15.153`, tracefs/MCAST route). A feed entry is an upstream target, not a hardware result, so only the `SM-F966*` and `SM-S911U1` builds appear above as `Upstream profile` rows; the others are covered by the existing S24 and S24 FE rows.
- The Samsung rows above that name one model code are firmware-locked builds. GalaxyCrash documents a hardware run on one `SM-S948B` build and did not retest the October patch that upstream issue #42 was filed against. Samsung Root Kit and Samsung Root Managers are built for `SM-S948U1` but publish no hardware result, so they stay `Upstream profile`.
- [KsuLateLoad](https://github.com/NanoTurtle1145/KsuLateLoad) and [DFReroot](https://github.com/polygraphene/DFReroot) are helpers, not targets: the first runs a Shizuku plus `CVE-2026-43499` late-load, the second restores DirtyFrag on later boots after an initial temporary root.
- Galaxy XR (`SM-I610`) is a headset on `5.10.240`. Its root build needs Samsung's own Open Source kernel archives and produces local APKs; it does not establish support for a later OTA.
- The shared S25 payload covers the Snapdragon variants. S25+ and S25 Edge China builds use separate payloads.
- The Z Fold4 (`SM-F9360`) chain is confirmed from the command line. Its app payload is not.
- [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) documents hardware runs for the S24 Ultra China family (`DZF2`/`DZH3`/`DZE2`/`DZG1`), the community-calibrated `DZJ3` manual staging result, China Z Fold6 `SM-F9580`, and the One UI 9 builds `S9280ZHU6EZIF`, `S921EXXU3DZIF`, and `S928BXXS6EZJ1` listed above. Other shipped or calibrated targets are not necessarily tested.
- RootMyS24's 98260 route uses KernelSU driver `3.2.5 (32525)` and expects the officially signed manager of the same version. The `3.3.0 (32601)` driver is experimental, and upstream advises against it on `6.1.162` because of intermittent `system_server` crash loops. Allow only one route attempt per boot. Version `3.6.4-beta.1` adds the per-target `S9280ZCS6DZJ3` payload. BakaSU LKM mode remains experimental on `S9280ZCS6DZH3` only. RootMyS24 does not support US S24 models (`SM-S921U`/`S926U1`/`S928U`/`U1`); the separate Root My Galaxy US target above is not a RootMyS24 target.
- The Root My Galaxy and Next feeds also list builds with no documented hardware run: Z Fold7 (`SM-F966U`/`U1` on `F966USQU9BZDN` or `F966USQSBBZG3`, `SM-F966B` on `F966BXXSBBZG3`, all `6.6.98`), the international S24 base (`SM-S921B` `S921BXXSFDZE1`, `SM-S921N` `S921NKSSFDZF3`, `6.1.157`), S24 FE (`SM-S721B` `S721BXXSCDZF3`, `6.1.157`), and the S23 base (`SM-S911U1` `S911U1UES6DYI3`, `5.15.153`) through a separate tracefs/MCAST route. The S23 Ultra multi-region payload (`S9180ZHS8FZF5`) is marked "test in progress" upstream. Treat all of these as candidates.
- [Root My Galaxy Next](https://github.com/rushiranpise/Root-My-Galaxy-Next) installs as its own package (`dev.rushiranpise.rmgnext`) beside the original and reads both its own feed and the `BuSung-dev` feed. It adds KernelSU-Next and BakaSU (ReSukiSU) payload flavours, a manager-version choice, wireless ADB pairing, and Shizuku start at boot. The payload's flavour decides which manager a run offers, so a KernelSU-Next payload and its manager are a pair.
- The forks do not add model coverage by themselves. Next reads the original feed plus its own fork feed, and Ultra is limited to the S26 Ultra (`m3q`). A newer app does not make a newer phone supported; check the fork's target list for the exact build.
- [Root My Galaxy Ultra](https://github.com/xorpix/Root-My-Galaxy-Ultra) is a fork of Next for the S26 Ultra (`m3q`). It recognizes `SM-S948` regional variants, `SC-53G`, and `SCG37` that report arm64, 4 KB pages, API 36 or newer, and an android16 / Linux `6.12` kernel. Only the exact `S948BXXS4AZHL` identity uses M3Q / GhostLock through Shizuku; other eligible builds use DirtyFrag. The `S948BXXU5BZJA` build is maintainer-confirmed for root and SusFS, while the rest of the family route is upstream recognition rather than hardware validation. The BZIG entry is hardware-confirmed for root before first unlock with BakaSU, and upstream issue #52 reports DirtyFrag root on `SM-S948N` / `S948NKSS4BZIG` with `6.12.69-android16-6-pb4d3caf-abogkiS948NKSS4BZIG-4k`. The BZK1 entry has only an offline boot-image check.
- Root My Galaxy Ultra 1.4.2 (2026-11-16) refreshes the bundled KernelSU 3.3.1, KernelSU-Next 3.4.2, BakaSU 4.2.0-rc3, and KowSU 3.3.0 backends to driver/UAPI 6. Upstream says those backend revisions have not been tested on a phone, so install a manager that matches UAPI 6 and keep the backend and manager paired.
- A late-loaded driver is fixed for the boot. If a manager reports a UAPI mismatch or asks for a newer kernel while the manager app itself is current, the manager is newer than the driver the loader staged: install a manager build whose UAPI matches that driver instead of re-rooting. A manager install does not replace the loaded driver, and changing the manager family needs a full reboot. Prefer the loader's pinned manager link when it has one; GitHub CI artifacts expire, and a `manager-spoofed` artifact uses a different package ID.
- On Samsung, DFRoot and DirtyFrag expect diabl0w's KernelSU build. DFRoot is manager-agnostic elsewhere and names upstream KernelSU, KernelSU-Next, or KowSU for non-Samsung devices. A fork that bundles its own daemon expects the manager shipped with it.
- GhostSam also ships GhostLock chains and build tables for the Galaxy S22 series (66 known builds), Galaxy S26 series (153 known builds, plus 7 One UI 9 builds), and Galaxy Z Fold8 (73 known builds). Those series have per-build runtime tables but no hardware runs documented in this list.
- [GhostKey](https://github.com/countryside99/GhostKey) is an ongoing Shizuku `CVE-2026-98260` port targeting the Galaxy S25 Ultra (`SM-S938B`, `6.6.127` One UI 9). Treat it as in-progress until upstream documents a completed release.
- [DFReroot](https://github.com/polygraphene/DFReroot) is a second-stage persistence helper (tested on Galaxy S26 One UI 8.5 `S942QOPU1AZDE`) that uses an initial temporary root session to register a `packages.xml` system-UID app for subsequent DirtyFrag runs without repeating GhostLock races; its author now recommends [DFRoot](https://github.com/diabl0w/DFRoot) for simpler single-stage use.
- [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) now has a Samsung mode with `conf/samsung/` profiles for S24/S26 Ultra (`SM-S921N`/`SM-S948U`, untested), S24 FE `SM-S721B`, A15 5G `SM-A1560`, S23 `SM-S911B`, S23 FE `SM-S711B`, S26 FE `SM-S741B`, and S25 Edge `SM-S937B`. All but the untested row are QEMU-only; none is a documented hardware run.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
