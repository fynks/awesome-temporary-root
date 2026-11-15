---
title: Samsung Galaxy
description: Temporary-root device reports, exact firmware builds, and compatibility notes for Samsung Galaxy phones and tablets.
---

# Samsung Galaxy

[Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) is the main loader and ships per-build payloads matched on model plus kernel. GhostLock-Galaxy, the A17 and A16 ports, UniRoot, GhostSam, and RootMyS24 cover builds outside its list.

See [Supported Devices](./index.md#status-definitions) for status definitions and matching rules.

## Supported builds

| Device / status | Model | Build or kernel / loader |
| --- | --- | --- |
| Galaxy S25, S25+, S25 Ultra, S25 Edge<br><kbd>Tested</kbd> | SM-S9310/B/N/Q/U/U1/W/Z, SM-S936B/N/U/U1/W, SM-S937B/N/U/U1/W, SM-S9380/B/N/Q/U/U1/W/Z, SC-51F, SCG31, SC-52F, SCG32 | `6.6.98`<br>Loader: Root My Galaxy |
| Galaxy S25+ China<br><kbd>Tested</kbd> | SM-S9360 | `S9360ZCSCCZG1`, `6.6.98`<br>Loader: Root My Galaxy |
| Galaxy S25 Edge China<br><kbd>Tested</kbd> | SM-S9370 | `S9370ZCS9CZG1`, `6.6.98`<br>Loader: Root My Galaxy |
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
| Galaxy S24 Ultra (China)<br><kbd>Tested</kbd> | SM-S9280 | `S9280ZCS6DZF2` (baseline), `S9280ZCS6DZH3`, `S9280ZHS6DZE2` / `S9280ZHS6DZH3` (HK/TW), `S9280ZCS6DZG1`, `6.1.145`<br>Loader: RootMyS24 |
| Galaxy S24 Ultra (China, DZJ3)<br><kbd>Experimental</kbd> | SM-S9280 | `S9280ZCS6DZJ3`, `6.1.145`<br>Loader: RootMyS24 (98260 route; manual staging verified, app path not yet tested) |
| Galaxy Z Fold6 (China)<br><kbd>Tested</kbd> | SM-F9580 | `6.1.145` (shares the S24 Ultra China DZF2 payload)<br>Loader: RootMyS24 |
| Galaxy S26, S26+, S26 Ultra<br><kbd>Tested</kbd> | SM-S942x, SM-S947x, SM-S948x | `6.12` (Snapdragon `S9420ZCS4AZG1` and Exynos `S942BXXS4AZG5`, `S947BXXS4AZG5`, plus other tested builds)<br>Loader: [GhostSam](https://github.com/MocLG/GhostSam) / [ghostlock-s26](https://github.com/snothin/ghostlock-s26) |

Upstream references: [Root My Galaxy payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads#supported-payloads), [targets-v3.json](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json), [ghostlock-a17 target](https://github.com/mobilehackinglab/ghostlock-a17#target), [SM-A166W build](https://github.com/jojobear691/SM-A166W-DZG1-Temporary-Root#exact-supported-build), [RootMyS24 tested firmware](https://github.com/NanoTurtle1145/root-my-s24#支持设备), [ghostlock-s26 firmware](https://github.com/snothin/ghostlock-s26#supported-firmware).

## Compatibility notes

- Galaxy S23 Ultra (`SM-S918B`) is confirmed through the app's Shizuku mode only. Galaxy S23+ (`SM-S916B`) has an ADB-shell profile and no app payload, so treat it as experimental.
- The Galaxy A15 4G (`SM-A155F`) report did not include a CSC. It used UniRoot 5.0.0's DirtyFrag path with KernelSU Next.
- Some payloads cover more models than the test device: the S24 Ultra payload also matches `SM-S928W`, and the A56 payload matches `SM-A5660`, `SM-A566B`, `SM-A566S`, `SM-A566U1`, and `SM-A566W`.
- The shared S25 payload covers the Snapdragon variants. S25+ and S25 Edge China builds use separate payloads.
- The Z Fold4 (`SM-F9360`) chain is confirmed from the command line. Its app payload is not.
- [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) documents hardware runs for the S24 Ultra China family (`DZF2`/`DZH3`/`DZE2`/`DZG1`), the community-calibrated `DZJ3` manual staging result, China Z Fold6 `SM-F9580`, and the One UI 9 builds `S9280ZHU6EZIF`, `S921EXXU3DZIF`, and `S928BXXS6EZJ1` listed above. Other shipped or calibrated targets are not necessarily tested.
- RootMyS24's 98260 route uses KernelSU driver `3.2.5 (32525)` and expects the officially signed manager of the same version. The `3.3.0 (32601)` driver is experimental, and upstream advises against it on `6.1.162` because of intermittent `system_server` crash loops. Allow only one route attempt per boot. Version `3.6.4-beta.1` adds the per-target `S9280ZCS6DZJ3` payload. BakaSU LKM mode remains experimental on `S9280ZCS6DZH3` only. RootMyS24 does not support US S24 models (`SM-S921U`/`S926U1`/`S928U`/`U1`); the separate Root My Galaxy US target above is not a RootMyS24 target.
- Root My Galaxy's target feed also lists builds with no documented hardware run: Z Fold7 (`SM-F966U`/`U1`, `SM-F966B`, all on `6.6.98`), the international S24 base (`SM-S921B`, `SM-S921N`, `6.1.157`), S24 FE (`SM-S721B`, `6.1.157`), and the S23 base (`SM-S911U1`, `5.15.153`) through a separate tracefs/MCAST route. The S23 Ultra multi-region payload (`S9180ZHS8FZF5`) is marked "test in progress" upstream, so treat all of these as candidates.
- GhostSam also ships GhostLock chains and build tables for the Galaxy S22 series (66 known builds), Galaxy S26 series (153 known builds, plus 7 One UI 9 builds), and Galaxy Z Fold8 (73 known builds). Those series have per-build runtime tables but no hardware runs documented in this list.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
