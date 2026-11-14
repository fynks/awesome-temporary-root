---
title: Complete guide
description: Device support, temporary-root basics, safety, setup, tools, modules, troubleshooting, and sources.
---

<!-- Generated from README.md by scripts/sync-readme.mjs. Edit README.md, not this file. -->

<div align="center">

<picture>
  <source media="(prefers-color-scheme: light)" srcset="/images/ghost-light.svg">
  <source media="(prefers-color-scheme: dark)" srcset="/images/ghost-dark.svg">
  <img src="/images/ghost-light.svg" alt="Awesome Temporary Root ghost logo: a ghost silhouette with a hash symbol cut out of its body" width="112" height="112">
</picture>

# Awesome Temporary Root

Root access on a locked Android bootloader, for one boot at a time.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](https://github.com/fynks/awesome-temporary-root/blob/main/LICENSE)
[![Listed entries](https://img.shields.io/badge/listed_entries-71-brightgreen?style=flat-square)](#supported-devices)
[![Kernels](https://img.shields.io/badge/kernels-4.9--6.12-informational?style=flat-square)](#supported-devices)
[![GitHub stars](https://img.shields.io/github/stars/fynks/awesome-temporary-root?style=flat-square)](https://github.com/fynks/awesome-temporary-root/stargazers)

[Jump to devices](#supported-devices)

</div>

## Contents

- [What is temporary root?](#what-is-temporary-root)
- [Supported devices](#supported-devices)
  - [Samsung Galaxy](#samsung-galaxy)
  - [Google Pixel](#google-pixel)
  - [OnePlus, OPPO, and Realme](#oneplus-oppo-and-realme)
  - [vivo and iQOO](#vivo-and-iqoo)
  - [Xiaomi, ASUS, Nothing, and Honor](#xiaomi-asus-nothing-and-honor)
  - [Amazon, NVIDIA, Meta, and TCL](#amazon-nvidia-meta-and-tcl)
  - [Live upstream tables](#live-upstream-tables)
- [Tools and managers](#tools-and-managers)
- [Modules](#modules)
  - [Status labels](#status-labels)
  - [Module list](#module-list)
  - [App list](#app-list)
  - [Not recommended](#not-recommended)
  - [Reducing module risk](#reducing-module-risk)
- [Firmware & recovery resources](#firmware--recovery-resources)
- [Research resources](#research-resources)
- [Quick start](#quick-start)
- [Troubleshooting and FAQ](#troubleshooting-and-faq)
- [Contributing and disclaimer](#contributing-and-disclaimer)
- [Sources](#sources)

> [!TIP]
> New here? Read [What is temporary root?](#what-is-temporary-root) first, find your exact model in [Supported devices](#supported-devices), then follow [Quick start](#quick-start). If your build is not listed, do not try the closest one.

> [!IMPORTANT]
> This project is only for accumulating all knowledge, tools, modules, and other resources relating to temporary rooting in one place.
> Unfortunately, porting temporary solutions to specific devices is out of scope of this project.

---

## What is temporary root?

Temporary root gives an app or an ADB shell UID 0 on the current boot without unlocking the bootloader or flashing a boot image. A loader exploits a kernel bug, starts a root daemon, and late-loads a KernelSU kernel module. A KernelSU-compatible manager can then grant `su`. A full reboot unloads the module and ends the session.

The loader that works depends on the device, its firmware build, and its kernel. Match all three.

<details>
<summary>Click to show <strong>how the loaders work</strong></summary>

<br>

The loaders use one of these kernel bugs:

- DirtyFrag (CVE-2026-43284) is a page-cache write bug in ESP-in-UDP decryption. A run either works or stops with an error. The loader needs a kernel module built for the device's KMI.
- GhostLock (CVE-2026-43499) is a futex priority-inheritance use-after-free that gives a controlled kernel write. It is a race, so retries and kernel panics are normal. A working payload depends on the exact kernel layout.
- The Adreno GPU route (CVE-2025-21479) is a GPU command-packet defect that lets the GPU overwrite its own page tables for physical read/write. RootMyVivo ships it for older 5.10/5.15 Snapdragon 8-class vivo and iQOO devices whose GPU firmware predates Qualcomm's June 2025 fix.

A few ports use other device-specific routes, such as a vendor service on MIUI or Honor, or a fastboot-issued permissive command line. Their table row says so.

RootMyS24 also uses CVE-2026-98260 (a POSIX CPU timers use-after-free) for selected Galaxy S24 series devices on One UI 9.0 / kernel 6.1.162. Its [CVE record](https://www.cve.org/CVERecord?id=CVE-2026-98260) now lists fixed stable releases `6.1.191`, `6.6.158`, `6.12.112`, `6.18.54`, and `7.2.8`, with `7.3` also marked unaffected. The same vendor-backport caveat applies.

CVE records give these patch floors. DirtyFrag and GhostLock affect older branches than the ones listed.

| Kernel | DirtyFrag fixed | GhostLock fixed |
| --- | --- | --- |
| 5.10 | 5.10.255 | 5.10.261 |
| 5.15 | 5.15.205 | 5.15.212 |
| 6.1 | 6.1.171 | 6.1.175 |
| 6.6 | 6.6.138 | 6.6.140 |
| 6.12 | 6.12.87 | 6.12.86 |
| 6.18 | 6.18.28 | 6.18.27 |
| 7.0 | 7.0.5 | 7.0.4 |

Vendors backport fixes out of order and sometimes change a kernel without changing the version string, so treat these numbers as a hint. The loader's own vulnerability check decides.

</details>

It enables:

- `su` for apps you approve, through a KernelSU-compatible manager.
- A root shell while the bootloader stays locked and the boot image stays stock.
- Modules that mount files or hook apps at runtime, for the current boot.
- A session that leaves the verified-boot chain, the stock kernel, and the recovery partitions untouched.

It does not:

- Survive a full reboot.
- Unlock the bootloader or allow unsigned images, custom ROMs, kernels, or recoveries.
- Run modules that need to start before Android, replace boot scripts, or write a partition.
- Guarantee Play Integrity, banking apps, or recovery from a bad module.
- Cover every device. A profile is built for a specific model and kernel layout.

A soft reboot restarts Android's interface and system services, not the kernel, so root and module mounts stay. A full reboot loads the stock kernel again and clears root. Files under `/data/adb` can remain, but nothing loads them. Do not delete that directory blindly to "unroot". It also holds module files and data other root tools rely on.

Shizuku runs a service as the shell user through ADB and is not root, though several loaders use it as a transport. `adb root` works only on builds that allow it. Virtual-root apps (dual-space and parallel-space tools) sandbox selected apps and never grant UID 0. Magisk, KernelSU, and APatch boot-image installs are permanent and need an unlocked bootloader. KernelSU's late-load mode is a component of temporary root, not a root method by itself.

> [!WARNING]
> Temporary root is full root for the session. Privilege-escalation code running in the kernel delivers it. A wrong profile or a lost race can panic the device. An incompatible module can bootloop it, and a partition write can make it unbootable. Verify the exact model, firmware build, and `uname -r` against the upstream project before running a loader. Back up data you cannot lose. Only use hardware you own or have explicit permission to modify.

---

## Supported devices

Status shows who reported the result and what happened. A generated profile is not a confirmed target. Check the loader's live table before running. A newer release does not inherit an older result.

| Status | Meaning |
| --- | --- |
| <kbd>Maintainer Verified</kbd> | A maintainer of this repository supplied or directly confirmed this hardware result and linked a report. It covers only the details in that report. It is not a security audit or a guarantee for other builds. |
| <kbd>User Reported</kbd> | A community member reported this hardware result with a linked report. This repository's maintainer has not independently verified it. The entry keeps the reported outcome and limitations. |
| <kbd>Tested</kbd> | An upstream project documents a completed hardware run on the stated target, including the full temporary-root chain where the loader provides one. This label alone does not imply maintainer verification. |
| <kbd>Experimental</kbd> | The run was partial, shell-only, or explicitly experimental. |
| <kbd>Upstream profile</kbd> | The upstream project lists an exact kernel profile for this device, but no documented hardware run confirms it. Treat it as a candidate. |
| <kbd>Unverified candidate</kbd> | The loader has a profile for this kernel, but no confirmed run exists for this model. |
| <kbd>Deprecated/unavailable</kbd> | The upstream project or loader is archived, removed, or no longer distributed. |

Match the full kernel release your phone reports. Two phones on the same Android release can differ in kernel build, page size, and vendor hardening, so a partial match is not enough. If a kernel or tool version is missing, treat it as unknown.

### Samsung Galaxy

[Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) is the main loader and ships per-build payloads matched on model plus kernel. GhostLock-Galaxy, the A17 and A16 ports, GhostSam, and RootMyS24 cover builds outside its list.

<details>
<summary>Click to show <strong>26 Samsung entries</strong></summary>

<br>

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
| Galaxy Z Fold4<br><kbd>Tested</kbd> | SM-F9360 | `F9360ZCSAIZF1`, `5.10.236`<br>Loader: [Root My Galaxy Payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) (command line) |
| Galaxy Z Flip6 (Korea)<br><kbd>Tested</kbd> | SM-F741N | `F741NKSS4DZE1`, `6.1.145`<br>Loader: [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) |
| Galaxy S24 (China)<br><kbd>Tested</kbd> | SM-S9210 | `S9210ZCS6DZI1`, `6.1.145`<br>Loader: RootMyS24 |
| Galaxy S24+ (Taiwan)<br><kbd>Tested</kbd> | SM-S9260 | `S9260ZHS6DZG1`, `6.1.145`<br>Loader: RootMyS24 |
| Galaxy S24 Ultra (Europe, One UI 9)<br><kbd>Tested</kbd> | SM-S928B | `S928BXXU6EZIF`, `6.1.162`<br>Loader: RootMyS24 |
| Galaxy S24 Ultra (Europe, One UI 9, EZJ1)<br><kbd>Tested</kbd> | SM-S928B | `S928BXXS6EZJ1`, `6.1.162`<br>Loader: RootMyS24 (POSIX CPU timers route) |
| Galaxy S24 Ultra (S9280, One UI 9)<br><kbd>Tested</kbd> | SM-S9280 | `S9280ZHU6EZIF`, `6.1.162`<br>Loader: RootMyS24 (POSIX CPU timers route) |
| Galaxy S24 (international, One UI 9)<br><kbd>Tested</kbd> | SM-S921E | `S921EXXU3DZIF`, `6.1.162`<br>Loader: RootMyS24 (POSIX CPU timers route) |
| Galaxy S24 Ultra (China)<br><kbd>Tested</kbd> | SM-S9280 | `S9280ZCS6DZF2` (baseline), `S9280ZCS6DZH3`, `S9280ZHS6DZE2` / `S9280ZHS6DZH3` (HK/TW), `S9280ZCS6DZG1`, `6.1.145`<br>Loader: RootMyS24 |
| Galaxy Z Fold6 (China)<br><kbd>Tested</kbd> | SM-F9580 | `6.1.145` (shares the S24 Ultra China DZF2 payload)<br>Loader: RootMyS24 |
| Galaxy S26, S26+, S26 Ultra<br><kbd>Tested</kbd> | SM-S942x, SM-S947x, SM-S948x | `6.12` (Snapdragon `S9420ZCS4AZG1` and Exynos `S942BXXS4AZG5`, `S947BXXS4AZG5`, plus other tested builds)<br>Loader: [GhostSam](https://github.com/MocLG/GhostSam) / [ghostlock-s26](https://github.com/snothin/ghostlock-s26) |

[Live table: Root My Galaxy payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads#supported-payloads), [targets-v3.json](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json), [ghostlock-a17 target](https://github.com/mobilehackinglab/ghostlock-a17#target), [SM-A166W build](https://github.com/jojobear691/SM-A166W-DZG1-Temporary-Root#exact-supported-build), [RootMyS24 tested firmware](https://github.com/NanoTurtle1145/root-my-s24#支持设备), [ghostlock-s26 firmware](https://github.com/snothin/ghostlock-s26#supported-firmware)

</details><br>

<details>
<summary>Click to show <strong>compatibility notes</strong></summary>

<br>

- Galaxy S23 Ultra (`SM-S918B`) is confirmed through the app's Shizuku mode only. Galaxy S23+ (`SM-S916B`) has an ADB-shell profile and no app payload, so treat it as experimental.
- Some payloads cover more models than the test device: the S24 Ultra payload also matches `SM-S928W`, and the A56 payload matches `SM-A5660`, `SM-A566B`, `SM-A566S`, `SM-A566U1`, and `SM-A566W`.
- The shared S25 payload covers the Snapdragon variants. S25+ and S25 Edge China builds use separate payloads.
- The Z Fold4 (`SM-F9360`) chain is confirmed from the command line. Its app payload is not.
- [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) documents hardware runs for the S24 Ultra China family (`DZF2`/`DZH3`/`DZE2`/`DZG1`), China Z Fold6 `SM-F9580`, and the One UI 9 builds `S9280ZHU6EZIF`, `S921EXXU3DZIF`, and `S928BXXS6EZJ1` listed above. Other shipped or calibrated targets are not necessarily tested.
- RootMyS24 requires the officially signed KernelSU manager `v3.3.0`. Its POSIX CPU timers route defaults to the bundled `3.2.5` driver. Upstream does not recommend the stock `3.3.0` driver on `6.1.162` because of intermittent `system_server` crash loops. Allow only one timers-route attempt per boot. Version `3.6.3` supports disabling KernelSU modules on that route. BakaSU LKM mode remains experimental on `S9280ZCS6DZH3` only. RootMyS24 does not support US S24 models (`SM-S921U`/`S926U1`/`S928U`/`U1`); the separate Root My Galaxy US target above is not a RootMyS24 target.
- Root My Galaxy's target feed also lists builds with no documented hardware run: Z Fold7 (`SM-F966U`/`U1`, `SM-F966B`), the international S24 targets (`S921BXXSFDZE1`, `S921NKSSFDZF3`), S24 FE (`S721BXXSCDZF3`), and the S23 base `SM-S911U1` through a separate tracefs/MCAST route. The S23 Ultra multi-region payload (`S9180ZHS8FZF5`) is marked "test in progress" upstream, so treat all of these as candidates.
- GhostSam also ships GhostLock chains and build tables for the Galaxy S22 series (66 known builds) and Galaxy Z Fold8 (73 known builds), plus a One UI 9 S26 variant driven by its io_submit chain. Those series have per-build runtime tables but no hardware runs documented in this list.

</details>

---

### Google Pixel

All rows use [Root My Pixel](https://github.com/alex193a/Root-My-Pixel), which requires Shizuku. The loader matches builds exactly. An OTA changes the target.

<details>
<summary>Click to show <strong>15 Pixel entries</strong></summary>

<br>

| Model / status | Supported build | KMI |
| --- | --- | --- |
| Pixel 11, 11 Pro, 11 Pro XL<br><kbd>Tested</kbd> | `CD1A.260618.001.C2` | `android16-6.12` |
| Pixel 11 Pro Fold<br><kbd>Tested</kbd> | `CD1A.260618.001.C3` | `android16-6.12` |
| Pixel 10, 10 Pro, 10 Pro Fold<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android15-6.6` |
| Pixel 10 Pro XL<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP2A.260805.005` | `android15-6.6` |
| Pixel 10a<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP2A.260805.005` | `android14-6.1` |
| Pixel 9, 9a<br><kbd>Tested</kbd> | `CP2A.260705.006`; Pixel 9 also `AD1A.240905.004` | `android14-6.1` |
| Pixel 9 Pro, 9 Pro XL, 9 Pro Fold<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android15-6.1` |
| Pixel 8, 8 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 8a<br><kbd>Tested</kbd> | `CP2A.260805.005` | `android14-6.1` |
| Pixel 7, 7 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006`; Pixel 7 also `BP2A.250705.008` | `android14-6.1` |
| Pixel 7a<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 6, 6 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 6a<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP1A.260405.005` | `android14-6.1` |
| Pixel Fold<br><kbd>Tested</kbd> | `CP2A.260605.012`, `CP2A.260705.006` | `android14-6.1` |
| Pixel Tablet<br><kbd>Tested</kbd> | `BP1A.250405.007`, `CP2A.260705.006` | `android14-6.1` |

[Live table: Root My Pixel supported devices](https://github.com/alex193a/Root-My-Pixel#supported-devices--build-profiles)

</details><br>

Root My Pixel reports the exploit is unreliable. Many users needed more than 20 attempts, and a failed attempt can reboot the phone. [GhostLock App](https://github.com/YuKongA/ghostlock-app) also has Pixel 7, 9a, 9 Pro, and 9 Pro Fold profiles, but those are candidates, not confirmed targets.

---

### OnePlus, OPPO, and Realme

[ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) is the main loader for OnePlus and OPPO builds. The OnePlus Pad 3 uses a dedicated Root My Device build, and the Realme GT 7T has its own port.

<details>
<summary>Click to show <strong>10 OnePlus, OPPO, and Realme entries</strong></summary>

<br>

| Device / status | Model | Build or kernel / loader |
| --- | --- | --- |
| OnePlus Ace 6T<br><kbd>Tested</kbd> | PLR110 | `6.12.38-android16-5-g8c67d4274c0a-ab14275539-4k` (ColorOS 16.0.2.403), `6.12.38-android16-5-g844001fb8721-ab14552068-4k` (16.0.8.301)<br>Loader: ghostlock-oneplus |
| OnePlus 15<br><kbd>Tested</kbd> | CPH2745, CPH2747, CPH2749 | `6.12.23-android16-5-gb2a876903b49-ab14541642-4k` (16.0.9.400)<br>Loader: ghostlock-oneplus |
| OnePlus 15<br><kbd>Tested</kbd> | PLK110 | `6.12.58` (`android16-6`, Android 17 Beta 3)<br>Loader: ghostlock-oneplus |
| OnePlus 13<br><kbd>Tested</kbd> | IN2060 | `6.6.89-android15-8-gf4dc45704e54-abogki446052083-4k` (16.0.2.403)<br>Loader: ghostlock-oneplus |
| OnePlus 13<br><kbd>Tested</kbd> | IN2060 | `6.6.89-android15-8-g97a9aaefab9a-ab14519050-4k`, `6.6.30-android15-8-g013ec21bba94-abogki383916444-4k`, `6.6.118-android15-8-g93e223c276e7-abogki500782043-4k`<br>Loader: [Anchor](https://github.com/byemaxx/ghostlock-anchor) |
| OPPO K15 Pro+<br><kbd>Experimental</kbd> | PMG110 | `PMG110_16.0.9.400(CN01)`, `6.6.118-android15-8-g93e223c276e7-abogki500782043-4k`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |
| OPPO Pad 4 Pro<br><kbd>Tested</kbd> | n/a | `6.6.89-android15-8-g096cdb6ecefc-ab14358676-4k`<br>Loader: ghostlock-oneplus |
| OnePlus Pad 3<br><kbd>Tested</kbd> | OPD2415 | `OPD2415_16.0.9.400(EX01)`, `6.6.118-android15-8-g2e6b9c3812c5-ab15114928-4k`<br>Loader: [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) |
| Realme GT 7T<br><kbd>Tested</kbd> | RMX5085 | `6.6.118-android15-8`<br>Loader: [ghostlock-rmx5085](https://github.com/Nixbones/ghostlock-rmx5085) |
| Realme Note 50<br><kbd>User Reported</kbd> | RMX3834export / RE5C9F | Android 15; fingerprint `realme/RMX3834/RE5C9F:15/AP3A.240905.015.A2/T.R4T2.1784276895:user/release-keys`; security patch `2026-07-01`; `5.15.189-android13-8-g746e08b68bca-ab1`<br>KernelSU LKM `v3.3.1 (32680-5)`; SELinux Enforcing; Seccomp Filter<br>Loader: DirtyFrag (CVE-2026-43284); loader app version unknown |

[User report: Realme Note 50](https://github.com/fynks/awesome-temporary-root/pull/10), [Live table: ghostlock-oneplus verified devices](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [not-feasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible), [Root My Device OnePlus Pad 3](https://github.com/tqmane/Root-My-Device/blob/main/devices/oneplus-pad-3/README.md#supported-target)

</details><br>

<details>
<summary>Click to show <strong>compatibility notes</strong></summary>

<br>

- The PLK110 OnePlus 15 entry is the Android 17 Beta 3 kernel. A stable build with a different kernel is not covered.
- OnePlus 13 `IN2060` and OPPO Pad 4 Pro use a different root path (UMH).
- ghostlock-oneplus also has offsets for devices it has not tested, and a list of devices its layout cannot support. Check both before you try a build.
- The Realme Note 50 entry is a user report. The DirtyFrag app version is unknown.
- A post-OTA follow-up reports Android 16 (36), manager `v3.4.2-spoofed (33355-5)`, Tracepoint hook mode, Hybrid Mount `6.2.6-rc.4`, SuSFS `v2.3.0 (GKI)`, and Zygisk Next `1.5.2 (864-a4a72ce-release)`. The exact post-OTA build is not confirmed. Treat it as separate from the Android 15 row.

</details>

---

### vivo and iQOO

[RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) matches the full kernel release from its [payload catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/support/targets-vivo.json). Upstream documents vulnerable GhostLock ranges below 6.6.140 and 6.1.145. These are loader limits, not universal CVE patch floors. Match the exact catalog entry. The catalog also has a separate Adreno route (CVE-2025-21479) for older 5.10/5.15 devices.

<details>
<summary>Click to show <strong>6 vivo and iQOO entries</strong></summary>

<br>

| Device / status | Model | Kernel / loader |
| --- | --- | --- |
| iQOO Neo 11<br><kbd>Tested</kbd> | PD2520, PD2520A to PD2520E, V2520A | `6.6.89-android15-8-g1f71897ac249`<br>Loader: RootMyVivo |
| iQOO Z10 Turbo Pro<br><kbd>Tested</kbd> | PD2453, PD2453A, V2453A | `6.6.89-android15-8-g1f71897ac249`<br>Loader: RootMyVivo |
| iQOO Z9 5G / vivo T3 5G<br><kbd>Tested</kbd> | I2302 / V2334 | `5.15.178-android13-8-g0ebe6a5da65d`<br>Loader: [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock) |
| vivo X200<br><kbd>Tested</kbd> | PD2415, V2415A | `6.6.89-android15-8-gb57af212129c` (Port 16.1.12.2.W10)<br>Loader: [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root) / RootMyVivo |
| iQOO Neo8<br><kbd>Tested</kbd> | PD2301, V2301A | `5.10.198-gki-gfb2f5774872c`<br>Loader: [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8) / RootMyVivo |
| vivo T3 Ultra<br><kbd>Tested</kbd> <kbd>Deprecated/unavailable</kbd> | V2426 | `5.15.197-android13-8-00040-g1d68e338760e-ab15563954`<br>Loader: MT6989-ghostlock (historical result; repository unavailable) |

[Live table: RootMyVivo payload catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/support/targets-vivo.json), [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock), [vivo X200 device notes](https://github.com/xiaohj233/ghostlock-x200-root#支持的设备)

</details><br>

<details>
<summary>Click to show <strong>compatibility notes</strong></summary>

<br>

- The catalog also lists iQOO 13 India (`I2401`) and iQOO Neo10 Pro (`PD2426`) with device-exact offsets taken from third-party port builds, plus an X200 family entry. Other entries reuse another model's payload (iQOO 13 China, Neo10 Pro+, X200 Ultra, and Z10 Turbo and Neo10 Pro b57 units). Those are mappings, not confirmed runs. Upstream disables the Z10 Turbo+ 6.6.127 and iQOO Z10 6.1.145 entries and does not claim they work.
- A `6.6.127` build on an iQOO Neo 11 has the fix, so the 6.6.89 payload does not cover it.
- The MT6989-ghostlock repository is unavailable, and its V2426 target is absent from the current RootMyVivo catalog. Treat the hardware result as historical only.
- The current catalog gives iQOO Neo 10 Global `I2405` on `6.6.89-android15-8-g97a9aaefab9a` its own payload entry. It still needs on-device confirmation. The same kernel string alone does not establish an identical image.

</details>

---

### Xiaomi, ASUS, Nothing, and Honor

These devices use several independent loaders, including DirtyFrag, ghostlock-oneplus, Root My Device, zenfone9-ghostlock, and Honor ports based on GhostLock App.

<details>
<summary>Click to show <strong>9 Xiaomi, ASUS, Nothing, and Honor entries</strong></summary>

<br>

| Device / status | Model or codename | Build or kernel / loader |
| --- | --- | --- |
| Xiaomi 17<br><kbd>Tested</kbd> | pudding | `OS3.0.315.0.WPCCNXM` (`6.12.23`), `6.12.69`<br>Loader: ghostlock-oneplus |
| Xiaomi 17T Pro<br><kbd>Tested</kbd> | warhol | `OS3.0.304.0.WPSJPXM`, `6.12.38-android16-5-g1d46253471dd-ab15048002-4k`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |
| Xiaomi 14T Japan<br><kbd>Tested</kbd> | XIG07 | `OS3.0.7.0.WNEJPKD`, `6.1.138-android14-11-g44bda9e8f6e9-ab13792638`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |
| Redmi Note 13 4G<br><kbd>Maintainer Verified</kbd> | sapphire | Android 15; HyperOS `2.0.213.0` Global; security patch `2026-08-01`<br>Kernel and loader version: unknown<br>Loader: [mitschud/DirtyFrag](https://github.com/mitschud/DirtyFrag) |
| Redmi Note 14 4G<br><kbd>User Reported</kbd> | 24117RN76L | `BP2A.250605.031.A3`, `6.12.30-android16-5-g6e872b4863d6-ab13847919-4k`<br>Loader: [GhostLock App](https://github.com/YuKongA/ghostlock-app) v1.2; successful temporary root reported |
| ASUS Zenfone 9<br><kbd>Tested</kbd> | ASUS_AI2202 | `5.10.205-android12-9-00029-g3f12df86bfdb-ab11799032`<br>Loader: [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock) |
| Nothing Phone (3a)<br><kbd>Tested</kbd> | A059 / Asteroids | `B4.1-260618-1048`, `6.1.157-android14-11-g82d681c9b06b-ab14634535`<br>Loader: [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) |
| HONOR 400 (global)<br><kbd>Experimental</kbd> <kbd>Deprecated/unavailable</kbd> | DNY-NX9 | `DNY-N39 10.0.0.213(C636E4R3P2)`, `5.15.180-android13-8-00018-g9b2308ac0ad6-ab14563692`<br>Loader: MnemosyneLab/ghostlock-honor (upstream repo removed) |
| HONOR 80 Pro Flat<br><kbd>Tested</kbd> | ANB-AN00 / HNANB | MagicOS `9.0.0.230` (`ANB-AN00 9.0.0.230(CHNC00E230R2P5)`), `5.10.236-android12-9-gd671cf8c2b02`<br>Loader: [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root) |

[Maintainer report: Redmi Note 13 4G](https://github.com/fynks/awesome-temporary-root/issues/9#issuecomment-6871968996), [User report: Redmi Note 14 4G](https://github.com/fynks/awesome-temporary-root/issues/6), [Live list: Root My Device targets](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json), [Nothing Phone (3a)](https://github.com/tqmane/Root-My-Device/blob/main/devices/nothing-phone-3a/README.md#supported-exact-targets), [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock), [ANB Root compatibility](https://github.com/Chuniex-0631/honor-anb-an00-root/blob/main/docs/COMPATIBILITY.md), [GhostLock App profile list](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md)

</details><br>

<details>
<summary>Click to show <strong>compatibility notes</strong></summary>

<br>

- The Redmi Note 13 4G entry is a maintainer-reported DirtyFrag run on `sapphire`. Kernel and loader version are unknown. Do not generalize to other Note 13 variants or builds.
- The Nothing Phone (3a) build `B4.1-260810-1153` is supported upstream, but the verified run was on `B4.1-260618-1048`. Build `C5.0-260915-2123` is allowlisted but its root flow is not verified.
- GhostLock App has profiles for many Xiaomi, POCO, Redmi, Meizu, Sony, Motorola, Honor, and other devices. Those are candidates, not confirmed runs. Its [MediaTek guide](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/MEDIATEK.md) covers MT devices that miss the default target.
- Upstream removed the HONOR 400 loader repo (MnemosyneLab/ghostlock-honor). This index can no longer re-verify the documented run, so the row keeps a lowered Experimental status. New Honor ports (Honor 90, Honor 70 Pro, Honor 50, and others) exist as community repositories but are not listed until they document a hardware run.
- The POCO M6 Pro 4G and Meizu 21 ports have no upstream support table, so they are not listed as confirmed targets.
- [ANB Root v2.4.0](https://github.com/Chuniex-0631/honor-anb-an00-root/releases/tag/v2.4.0) changes its signing key. Versions 2.3.5 and earlier cannot update in place. Export diagnostics. Fully reboot if root was restored or a recovery attempt was made this boot. Then follow upstream's uninstall/reinstall and reauthorization steps. Shizuku and KernelSU do not need uninstalling. The supported device/build is unchanged.
- The Redmi Note 14 4G run used the GhostLock App profile for kernel `6.12.30-android16-5-g6e872b4863d6-ab13847919-4k`, which upstream lists for the REDMI Note 15 4G and POCO M6 Pro 4G. GhostLock App selects on `uname -r`, so the same kernel string covers all three models, but the offset layout can still differ between them. Confirm the exact model, and treat a Note 14 4G run as unverified on a Note 15 4G and the reverse.

</details>

---

### Amazon, NVIDIA, Meta, and TCL

[R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock) now maintains separate kernel branches. The Fire Max 11 and Fire TV Stick 4K 2nd-gen entries use the [5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10), not the repository's current default branch. The Shield TV and Quest 3 have dedicated ports.

<details>
<summary>Click to show <strong>5 Amazon, NVIDIA, Meta, and TCL entries</strong></summary>

<br>

| Device / status | Codename | Build or kernel / loader |
| --- | --- | --- |
| Amazon Fire Max 11<br><kbd>Tested</kbd> | sunstone | Fire OS 8.3.3.8 `RS8338.3339N`, `5.10`<br>Loader: [GhostLock 5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10) |
| Fire TV Stick 4K Max (2023)<br><kbd>Tested</kbd> | karat | Fire OS 8.1.8.5 `RS8185.3891N`, `5.10`<br>Loader: [GhostLock 5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10) |
| TCL QM6K Pro 65-inch<br><kbd>Tested</kbd> | G08 / T653T02 | `UTT2.250416.001/AU14` (`5.15.180`), `UTT2.250416.001/AU22` / V339 (`5.15.192`)<br>Loader: [GhostLock 5.15 branch](https://github.com/R0rt1z2/GhostLock/tree/5.15) |
| NVIDIA Shield TV Pro 2019<br><kbd>Tested</kbd> | mdarcy | Shield Experience 9.2.4, `4.9.141-tegra-gb6e5605a`<br>Loader: [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4) |
| Meta Quest 3<br><kbd>Tested</kbd> | eureka | `5.10.240-g55be3759aea4`, incremental `52345320035400520`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |

[Fire Max 11 tested builds](https://xdaforums.com/t/temp-root-fire-max-11-2023-sunstone.4798590/), [Fire TV Stick 4K 2nd-gen tested builds](https://xdaforums.com/t/temp-root-fire-tv-stick-4k-2nd-gen-series-karat-mantra.4798627/), [GhostLock 5.15 TCL profiles](https://github.com/R0rt1z2/GhostLock/tree/5.15), [NVIDIA Shield validated target](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4#validated-target), [Root My Device targets](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json)

</details><br>

<details>
<summary>Click to show <strong>compatibility notes</strong></summary>

<br>

- The GhostLock 5.10 branch also supports older Fire OS builds. The linked XDA threads list tested builds and kernels. Other R0rt1z2/GhostLock branches target different devices/kernel lines, so choose the branch for the exact target.
- Upstream verifies the TCL entry on a QM6K Pro 65-inch. Other T653T02 models may share the platform, but each firmware needs its own registry entry. Those two runs do not confirm them.
- The Shield port gives root to the live ADB daemon instead of installing a manager. Root survives ADB disconnects but not an ADB restart, and the included app re-runs the exploit at boot.
- Meta fixed GhostLock in Quest 3 incremental `52345320040100520` and Quest 3S incremental `3697600032300610`. Later builds are not vulnerable. IonStackQuest3's own target is incremental `52168470043600520`.

</details>

---

### Live upstream tables

These tables are maintained upstream and change more often than this README. Check your exact model, build, and `uname -r`. If they differ from this page, use the upstream table.

| Project | Devices | Live support data |
| --- | --- | --- |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) | Samsung Galaxy | [Payload list](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads#supported-payloads), [JSON](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json) |
| [GhostSam](https://github.com/MocLG/GhostSam) | Galaxy S22, S26, Z Fold8 | [Device list](https://github.com/MocLG/GhostSam#supported-devices) |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | Galaxy Z Fold6 | [Kernel list](https://github.com/wxxsfxyzm/GhostLock-Galaxy#registered-kernel-profiles) |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) | Galaxy A17 | [Target list](https://github.com/mobilehackinglab/ghostlock-a17#target) |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) | Pixel 6 to 11 | [Build list](https://github.com/alex193a/Root-My-Pixel#supported-devices--build-profiles) |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) | OnePlus, OPPO, Xiaomi | [Verified list](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [Infeasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible) |
| [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) | Nothing Phone (3a), OnePlus Pad 3 | [Nothing list](https://github.com/tqmane/Root-My-Device/blob/main/devices/nothing-phone-3a/README.md#supported-exact-targets), [Pad 3 list](https://github.com/tqmane/Root-My-Device/blob/main/devices/oneplus-pad-3/README.md#supported-target) |
| [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) | Xiaomi, OPPO, and Meta Quest | [Target list](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json), [Notes](https://github.com/WitAqua-tools/Root-My-Device-Payloads#supported-targets) |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) | vivo and iQOO | [Target list](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/support/targets-vivo.json) |
| [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) | Galaxy S24/S24 Ultra, Z Flip6, China Z Fold6 | [Verified and pending firmware lists](https://github.com/NanoTurtle1145/root-my-s24#支持设备) |
| [R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock) | Amazon Fire devices, TCL T653T02 | [5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10), [Fire build threads](https://github.com/R0rt1z2/GhostLock/tree/5.10#readme), [5.15 TCL profiles](https://github.com/R0rt1z2/GhostLock/tree/5.15) |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) | Multi-brand `uname -r` profiles | [Profile list](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) |

[Back to contents](#contents)

---

## Tools and managers

A temporary root setup needs a loader, a KernelSU-compatible manager, and whatever transport the loader uses. Some apps bundle all three.

### Exploit loaders and device-specific ports

| Tool / release | Method | Coverage / note |
| --- | --- | --- |
| [DirtyFrag](https://github.com/mitschud/DirtyFrag)<br>[latest release](https://github.com/mitschud/DirtyFrag/releases) | DirtyFrag | Samsung-focused; other vulnerable devices/KMIs may work, on-device; no Shizuku required |
| [DFRoot](https://github.com/diabl0w/DFRoot)<br>[latest release](https://github.com/diabl0w/DFRoot/releases) | DirtyFrag | Broad, manager-agnostic, on-device |
| [GhostSam](https://github.com/MocLG/GhostSam)<br>[latest tag](https://github.com/MocLG/GhostSam/tags) | Both | Galaxy S22, S26, Z Fold8, ADB |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app)<br>[latest release](https://github.com/YuKongA/ghostlock-app/releases) | GhostLock | Multi-brand `uname -r` profiles, on-device/Shizuku<br>User-reported success on the Redmi Note 14 4G with v1.2 |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy)<br>[latest release](https://github.com/BuSung-dev/Root-My-Galaxy/releases) | GhostLock | Selected Galaxy builds, on-device/Shizuku |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel)<br>[latest release](https://github.com/alex193a/Root-My-Pixel/releases) | GhostLock | Pixel 6 to 11, Shizuku; retries common |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo)<br>[latest release](https://github.com/zenyxx-xd/RootMyVivo/releases) | GhostLock + Adreno | vivo/iQOO 5.10 to 6.12, Shizuku/ADB |
| [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device)<br>[latest release](https://github.com/WitAqua-tools/Root-My-Device/releases) | GhostLock | Xiaomi 17T Pro, 14T Japan, Quest 3, on-device |
| [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device)<br>[latest release](https://github.com/tqmane/Root-My-Device/releases) | GhostLock | Nothing Phone (3a), OnePlus Pad 3, Shizuku |
| [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24)<br>[latest release](https://github.com/NanoTurtle1145/root-my-s24/releases) | GhostLock + POSIX CPU timers | Selected Galaxy S24/S24 Ultra, Z Flip6, Z Fold6 CN builds, Shizuku/ADB; see exact target notes |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy)<br>[source](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | GhostLock | Galaxy Z Fold6 SM-F9560, ADB/Shizuku |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus)<br>[source](https://github.com/JoinChang/ghostlock-oneplus) | GhostLock | OnePlus, Xiaomi, OPPO, ADB |
| [GhostLock-for-OnePlus](https://github.com/p2p3p/GhostLock-for-OnePlus)<br>[latest tag](https://github.com/p2p3p/GhostLock-for-OnePlus/tags) | GhostLock | Ace 6T, OnePlus 15 PLK110, ADB |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17)<br>[source](https://github.com/mobilehackinglab/ghostlock-a17) | GhostLock | Galaxy A17 SM-A175F, ADB; shell only |
| [R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock)<br>[branches](https://github.com/R0rt1z2/GhostLock/branches) | GhostLock | Amazon Fire devices and TCL T653T02, ADB; choose the exact kernel branch |
| [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4)<br>[latest release](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4/releases) | GhostLock | Shield TV Pro 2019, ADB; no `su` |
| [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8)<br>[source](https://github.com/Qingizi7/cve-2025-21479_iqooneo8) | Adreno GPU | iQOO Neo8 SM8475 on `5.10.198`, ADB; pre-Jun-2025 GPU |
| [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root)<br>[latest release](https://github.com/xiaohj233/ghostlock-x200-root/releases) | GhostLock | vivo X200 PD2415 b57, PC or companion app |
| MT6989-ghostlock<br>Unavailable | GhostLock | Historical vivo T3 Ultra V2426 target; repository unavailable |
| [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root)<br>[v2.4.0 release](https://github.com/Chuniex-0631/honor-anb-an00-root/releases/tag/v2.4.0) | GhostLock | HONOR 80 Pro Flat ANB-AN00, Shizuku; single MagicOS build; signing-key migration |
| [Redmi K70 Pro temp root](https://github.com/Berge520/redmik70pro)<br>[latest release](https://github.com/Berge520/redmik70pro/releases) | MIUI service | Redmi K70 Pro (manet), HyperOS 3/Android 16, PC + ADB/fastboot |
| [ghostlock-s26](https://github.com/snothin/ghostlock-s26)<br>[latest release](https://github.com/snothin/ghostlock-s26/releases) | GhostLock | Galaxy S26 series, ADB; merged into GhostSam |
| [IonStackQuest3](https://github.com/F-19-F/IonStackQuest3)<br>[latest release](https://github.com/F-19-F/IonStackQuest3/releases) | GhostLock | Quest 3 listed incrementals, ADB; newer builds patched |
| [DirtyInit](https://github.com/combeng6th/DirtyInit)<br>[latest release](https://github.com/combeng6th/DirtyInit/releases) | DirtyFrag | Samsung devices with the page-cache write bug, ADB; not KernelSU |

DirtyFrag's latest checked release is [v1.17](https://github.com/mitschud/DirtyFrag/releases/tag/v1.17). It stages `ksud` from the selected manager's `libksud.so`. Samsung requires diabl0w's KernelSU build. Other devices can use the managers upstream names. Since v1.17, LKM selection uses the kernel's GKI level and vendor Android release rather than the marketing Android version. Read the run log and stop if the kernel has no supported module.

### Kernel module sets

<details>
<summary>Click to show <strong>which kernel modules each loader ships</strong></summary>

<br>

GhostSam ships one DirtyFrag module per KMI and marks its set as follows. DirtyFrag also builds modules per KMI. Its repository contains the prebuilt set. These are upstream module statuses, not verification labels from this repository. The KMI is not the full target. Two phones on the same KMI can still differ in kernel build, page size, and vendor hardening.

| KMI | Status | Notes |
| --- | --- | --- |
| `android12-5.10` | Tested | |
| `android13-5.10` | Untested | |
| `android13-5.15` | Tested | |
| `android14-5.15` | Untested | |
| `android14-6.1` | Partial | Kernels up to 6.1.71; later 6.1 builds are not supported by this module. |
| `android15-6.6` | Tested | |
| `android16-6.12` | Tested | |
| `android17-6.18` | Untested | |

</details>

Other device-specific ports:

- [ghostlock-emerald](https://github.com/datfooldive/ghostlock-emerald) for POCO M6 Pro 4G.
- [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock) for ASUS Zenfone 9.
- [ghostlock-rmx5085](https://github.com/Nixbones/ghostlock-rmx5085) for Realme GT 7T.
- [Meizu 21 GhostLock](https://github.com/ymh001/meizu21-ghostlock-root) for Meizu 21.
- [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock) for iQOO Z9 5G and vivo T3 5G.
- [ghostlock-xringo1](https://github.com/ayyy7128/ghostlock-xringo1) for XRING O1 on `6.6.77` and `6.6.118`.
- [SM-A166W port](https://github.com/jojobear691/SM-A166W-DZG1-Temporary-Root) for Galaxy A16 5G.

A multi-device repack can bundle legitimate payloads and still add code. Do not treat one as a trusted upstream, and do not grant root to a loader you cannot identify.

### Root managers

| Manager | What it is | Use it for |
| --- | --- | --- |
| [KernelSU](https://github.com/tiann/KernelSU) | Upstream kernel-based root manager | GKI devices; late-load support |
| [KernelSU-Next](https://github.com/KernelSU-Next/KernelSU-Next) | KernelSU fork | Devices a loader names it for |
| [KowSU](https://github.com/KOWX712/KernelSU) | KernelSU fork | Alternative manager for loaders that support it |
| [BakaSU](https://github.com/Baka-SU/BakaSU) | KernelSU fork, formerly ReSukiSU | Pixel profiles and other targets that name it |
| [diabl0w KernelSU](https://github.com/diabl0w/KernelSU) | Samsung-patched KernelSU | Samsung DirtyFrag and several Galaxy ports |

Use the manager the loader names. On Samsung, use diabl0w's build. A manager alone does not provide temporary root.

<details>
<summary>Click to show <strong>why the manager choice matters</strong></summary>

<br>

The manager must provide `libksud.so`, the library a loader uses to stage `ksud` on the device. A manager without that library cannot produce root. Use a current build from the project itself.

</details>

Do not use a manager's install, flash, or patch-boot-image actions on a locked phone. Those actions write protected partitions and can hardbrick the device.

### Transport and helpers

| Tool | What it does | Why it matters |
| --- | --- | --- |
| [Shizuku](https://github.com/RikkaApps/Shizuku) | ADB-privileged API bridge, runs as the shell user | Several loaders stage payloads through it. It is not root. |
| [Anchor](https://github.com/byemaxx/ghostlock-anchor) | One-tap launcher for the ghostlock-oneplus chain | Sets up local ADB with its own key. Requires a one-time `adb tcpip 5555` setup |
| [Android Platform Tools](https://developer.android.com/tools/releases/platform-tools) | `adb`, `fastboot` | Build checks, logs, sideloading, uninstall recovery |
| [Termux](https://github.com/termux/termux-app) | Terminal emulator | `uname -r`, `su`, and on-device checks |
| [Obtainium](https://github.com/ImranR98/Obtainium) | APK updates from GitHub releases | Keeps loaders on the project's release channel |

### Verifying a download

- Download from the project's own release page. Avoid reuploads, Telegram mirrors, paid builds, and remote-root services.
- Check the release tag and date, and compare published hashes or signing certificates when the project provides them.
- Build from source when you can. A clean VirusTotal result is not proof that an exploit APK is safe.

### Upstream porting resources

<details>
<summary>Click to show <strong>where to ask about porting</strong></summary>

<br>

Porting a temporary-root solution to a specific device is out of scope here. Use the relevant upstream project for development and device-specific help. These references explain why a generated profile is only a candidate: the [GhostLock App porting guide](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/README.md), the [Root My Galaxy payload notes](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads), or the [ghostlock-oneplus README](https://github.com/JoinChang/ghostlock-oneplus).

</details>

[Back to contents](#contents)

---

## Modules

Temporary root can run modules that mount files or hook apps after Android starts. It usually cannot run modules that need early boot, boot-script replacement, kernel drivers, or partition writes.

<details>
<summary>Click to show <strong>late-load limits</strong></summary>

<br>

Late-loaded KernelSU has no `init.rc` injection, module `preinit`, `post-fs-data` event, safe-mode detection, or boot-log capture. `late-load.d`, `post-mount.d`, `service.d`, and `boot-completed.d` scripts still run. Samsung DEFEX and KDP can block modules that work on other devices.

</details>

### Status labels

| Status | Meaning |
| --- | --- |
| Working | Reported to work without major issues. |
| Occasional issues | Generally works, but may conflict with other modules or settings. |
| Device-dependent | Works on some devices, but may cause bugs, reboots, or other issues on certain models. |
| Not recommended | Reported serious issues. Avoid on temporary root. |
| Needs testing | Not enough reports yet. |

Entries are User Reported unless marked Maintainer Verified.

> [!IMPORTANT]
> Install Core Patch N before Modded HyperOS Launcher, FreeStyle-Control-Center, ColorOS_Control_Center, HyperOS-App-Vault, HyperOS-AOD, and iOS-Control-Center-HyperOS. These generally work on Xiaomi and Redmi devices, but may have issues on some POCO devices. Keep a backup launcher before trying Modded HyperOS Launcher.

### Module list

<details>
<summary>Click to show <strong>modules</strong></summary>

<br>

| Name | Category | Status | Notes |
| --- | --- | --- | --- |
| [Magic Mount (7a72)](https://github.com/KernelSU-Modules-Repo/meta-mm) | Metamodules | Working | |
| [Magic Mount-rs](https://github.com/Tools-cx-app/meta-magic_mount-rs) | Metamodules | Working | |
| Morphe Mount-Install Modules | Metamodules | Working | |
| [OverlayFS Enhanced](https://github.com/RipperHybrid/meta-overlayfsx) | Metamodules | Device-dependent | |
| [NeoZygisk](https://github.com/JingMatrix/NeoZygisk) | Zygisk | Working | Maintainer Verified. |
| [OnyxZygisk](https://github.com/OnyxZygisk/OnyxZygisk) | Zygisk | Device-dependent | |
| OxyxZygisk | Zygisk | Device-dependent | |
| [ReZygisk](https://github.com/PerformanC/ReZygisk) | Zygisk | Device-dependent | |
| [ZNNext](https://github.com/VeryBaaad/ZNNext) | Zygisk | Working | |
| [Zygisk Assistant](https://github.com/snake-4/Zygisk-Assistant) | Zygisk | Working | |
| [Zygisk Next](https://github.com/Dr-TSNG/ZygiskNext) | Zygisk | Occasional issues | |
| [Zygisk Sui](https://github.com/XiaoTong6666/Sui) | Zygisk | Working | Do not run alongside KernelSU without reading both projects. |
| [LSPosed](https://github.com/LSPosed/LSPosed) | Xposed | Device-dependent | Requires a compatible Zygisk provider. May cause occasional GPS issues. |
| LSPosedIT | Xposed | Working | Available through the LSPosed Telegram channel. |
| [NexAlloy](https://github.com/NexAlloy/NexAlloy) | Xposed | Working | |
| Spicy EX | Xposed | Working | |
| [Vector v2.2](https://github.com/JingMatrix/Vector) | Xposed | Occasional issues | May bootloop on some setups. |
| [Vector-SR](https://github.com/byemaxx/Vector-SR) | Xposed | Device-dependent | Enabling via soft reboot may fully reboot some devices. |
| [Device Spoof Labs](https://github.com/yubunus/DeviceSpoofLab-Magisk) | Hiding | Device-dependent | One UI 9: disable spoofing first if soft reboots occur. |
| [DeviceSpoofLab-Hooks](https://github.com/yubunus/DeviceSpoofLab-Hooks) | Hiding | Working | |
| [HMA-OSS (Hide My Applist)](https://github.com/frknkrc44/HMA-OSS) | Hiding | Working | Often enough for hiding. No banking or Play Integrity guarantee. |
| [KernelNoSu](https://github.com/fatalcoder524/kernelnosu) | Hiding | Working | |
| [pairipfix](https://github.com/ahmedmani/pairipfix) | Hiding | Working | |
| [Play Integrity Fix](https://github.com/KOWX712/PlayIntegrityFix) | Hiding | Working | |
| [Play Integrity Fork](https://github.com/osm0sis/PlayIntegrityFork) | Hiding | Working | |
| [ReSuSFS](https://github.com/ahmed-alnassif/ReSuSFS) | Hiding | Device-dependent | |
| [TEESimulator](https://github.com/JingMatrix/TEESimulator) | Hiding | Occasional issues | |
| [TreatWheel](https://github.com/lsMikepls/treatwheel) | Hiding | Device-dependent | |
| [Tricky Store OSS](https://github.com/beakthoven/TrickyStoreOSS) | Hiding | Working | |
| [VBMeta Disguiser](https://github.com/Astoritin/VBMetaDisguiser) | Hiding | Working | |
| [Re-Malwack](https://github.com/ZG089/Re-Malwack) | Ad blocking | Working | |
| [StevenBlock](https://github.com/mikropsoft/StevenBlock) | Ad blocking | Working | |
| Systemless Adblocker (Sürüm) | Ad blocking | Working | |
| [ZN-hostsredirect](https://github.com/aviraxp/ZN-hostsredirect) | Ad blocking | Working | |
| [LightningDSP (JamesDSP fork) v6.7](https://github.com/zahahah/LightningDSP) | Audio | Working | |
| [PIXAML v0.9.6](https://github.com/zahahah/PIXAML) | Audio | Working | |
| [ViPER4Android (likelikeslike)](https://github.com/likelikeslike/ViPER4Android) | Audio | Occasional issues | Follow the install order. It expects KernelSU. |
| [Global Icon Pack](https://github.com/RichardLuo0/global-icon-pack-android) | Visual | Needs testing | |
| [iOS Emoji for Android](https://github.com/Keinta15/Magisk-iOS-Emoji) | Visual | Needs testing | |
| [Azenith](https://github.com/Liliya2727/AZenith) | Gaming | Device-dependent | |
| [PerfGame](https://github.com/adivenxnataly/PerfGame) | Gaming | Working | |
| UPerf Game Turbo | Gaming | Working | |
| CatSmoker | Performance | Working | |
| [DalvikHyperthreading](https://github.com/LeanxModulostk/DalvikHyperthreading) | Performance | Working | |
| [Encore Tweaks](https://github.com/Rem01Gaming/encore-ksu) | Performance | Working | |
| HyperOptimize | Performance | Occasional issues | Avoid combining with modules that modify the same parameters. |
| [KernelSU Tuner](https://github.com/ylh440104/KernelSU-Tuner) | Performance | Needs testing | Avoid voltage or clock changes on locked devices. |
| Universal GMS Doze | Performance | Working | |
| [AshResXcue (AshLooper)](https://github.com/RipperHybrid/AshLooper) | Bootloop protection | Occasional issues | Uninstall other bootloop protectors first. |
| [Always Trust User Certificates](https://github.com/NVISOsecurity/AlwaysTrustUserCerts) | Patches and tools | Working | |
| [Block OTA Update](https://github.com/manhgdev/Block-OTA-Update) | Patches and tools | Device-dependent | May need a device-specific fork. |
| [CaptureSposed](https://github.com/99keshav99/CaptureSposed) | Patches and tools | Needs testing | |
| [ClearBox](https://github.com/FLYCOM-E/ClearBox) | Patches and tools | Needs testing | |
| [KernelSU Grant Toast](https://github.com/NativeStar/KernelSUGrantToast) | Patches and tools | Device-dependent | |
| [KernelSU Toolkit](https://github.com/rifsxd/ksu_toolkit) | Patches and tools | Working | |
| [QuickSwitch](https://github.com/skittles9823/QuickSwitch) | Patches and tools | Needs testing | |
| [Simple Flag Secure](https://github.com/ShivamXD6/Simple-Flag-Secure) | Patches and tools | Working | |
| [TrustAnyCert](https://github.com/gorkemgun/TrustAnyCert) | Patches and tools | Needs testing | Installing CA certificates changes trust. |
| [Zygisk Detach](https://github.com/j-hc/zygisk-detach) | Patches and tools | Working | Requires a working Zygisk provider. |
| [Enable MIUI ADB](https://github.com/Ylarod/enable-miui-adb) | HyperOS / MIUI | Working | |
| ASKS Disabler (Quantum) | Samsung / One UI | Working | |
| [No Volume Warning](https://github.com/zahahah/No-Volume-Warnings) | Pixel | Working | |
| [Tailscale module](https://github.com/anasfanani/magisk-tailscaled) | Network | Working | |
| [Crond4Android](https://github.com/powerAn2020/crond4android) | Utilities | Needs testing | |
| [pm-install-from-anywhere](https://github.com/1ndevelopment/pm-install-from-anywhere) | Utilities | Needs testing | |

</details>

### App list

<details>
<summary>Click to show <strong>apps</strong></summary>

<br>

| Name | Category | Status | Notes |
| --- | --- | --- | --- |
| [AdClose](https://github.com/zjyzip/AdClose) | Ad blocking | Working | |
| [AdGuard Certificate](https://github.com/AdguardTeam/adguardcert) | Ad blocking | Working | |
| [amznkiller](https://github.com/hxreborn/amznkiller) | Ad blocking | Working | |
| [bindhosts](https://github.com/bindhosts/bindhosts) | Ad blocking | Working | |
| [Facebook App Ads Remover](https://github.com/Loukious/FacebookAppAdsRemover) | Ad blocking | Working | |
| [Gmail Hide Ads](https://github.com/MrxSiN/GmailHideAds) | Ad blocking | Working | |
| [Google Play Store Adblock](https://github.com/hxreborn/playstore-adblock) | Ad blocking | Working | |
| [ZFont 3](https://play.google.com/store/apps/details?id=com.htetznaing.zfont2&pli=1) | Visual | Device-dependent | |
| [App Manager](https://github.com/MuntashirAkon/AppManager) | Patches and tools | Working | |
| [ChromeKt](https://github.com/JingMatrix/ChromeXt) | Patches and tools | Working | |
| [Core Patch N](https://github.com/LSPosed/CorePatch) | Patches and tools | Working | Install before HyperOS launcher/control-center modules. |
| [De-Bloater](https://github.com/sunilpaulmathew/de-bloater) | Patches and tools | Working | |
| [Device Spoof Labs (app)](https://github.com/yubunus/DeviceSpoofLab-Hooks/releases) | Patches and tools | Device-dependent | One UI 9: disable spoofing first if soft reboots occur. |
| [Duck USB](https://github.com/Bouteillepleine/DuckUSB) | Patches and tools | Needs testing | |
| [Enable Screenshot](https://github.com/LSPosed/DisableFlagSecure) | Patches and tools | Device-dependent | May reboot on some builds. |
| [Franco Kernel Manager](https://play.google.com/store/apps/details?id=com.franco.kernel) | Patches and tools | Working | Avoid kernel or voltage changes on locked devices. |
| [IAmNotADeveloper](https://github.com/xfqwdsj/IAmNotADeveloper) | Patches and tools | Working | |
| [MT Manager](https://mt2.cn/download/) | Patches and tools | Working | Avoid editing system files on locked devices. |
| [NoPhotoPickerAPI](https://github.com/yureitzk/NoPhotoPickerAPI) | Patches and tools | Working | |
| [NoStorageRestrict](https://github.com/DanGLVK/NoStorageRestrict) | Patches and tools | Working | |
| [Scene](https://omarea.com/#/) | Patches and tools | Working | Avoid kernel or voltage changes on locked devices. |
| [Update Locker](https://github.com/Xposed-Modules-Repo/ru.mike.updatelocker) | Patches and tools | Working | |
| [Zygisk Detach (app)](https://github.com/j-hc/zygisk-detach-app) | Patches and tools | Working | |
| [ColorOS_Control_Center](https://github.com/Mods-Center/ColorOS_Control_Center) | HyperOS / MIUI | Device-dependent | |
| [FreeStyle-Control-Center](https://github.com/Mods-Center/FreeStyle-Control-Center) | HyperOS / MIUI | Device-dependent | |
| [HyperBackground](https://github.com/Solomonstery/HyperBackground) | HyperOS / MIUI | Working | |
| [HyperCeiler](https://github.com/ReChronoRain/HyperCeiler) | HyperOS / MIUI | Working | Disable "Icon in Settings" if icons duplicate. |
| HyperControl | HyperOS / MIUI | Working | |
| HyperCopy | HyperOS / MIUI | Working | |
| HyperDesktop | HyperOS / MIUI | Working | |
| HyperDuo | HyperOS / MIUI | Working | |
| HyperGlow | HyperOS / MIUI | Working | Requires Spicy EX. |
| HyperHelper | HyperOS / MIUI | Working | |
| [HyperIsland](https://github.com/1812z/HyperIsland) | HyperOS / MIUI | Working | |
| [HyperLight](https://github.com/KiminonawaResa/HyperLight) | HyperOS / MIUI | Working | Disable "Icon in Settings" if icons duplicate. |
| [HyperLock](https://github.com/LXRylex/HyperLock) | HyperOS / MIUI | Working | Requires HyperDuo. |
| HyperLyric | HyperOS / MIUI | Working | |
| [HyperOS-AOD](https://github.com/Mods-Center/HyperOS-AOD) | HyperOS / MIUI | Device-dependent | |
| [HyperOS-App-Vault](https://github.com/Mods-Center/HyperOS-App-Vault) | HyperOS / MIUI | Device-dependent | |
| [HyperStack](https://github.com/cramqin/HyperStack) | HyperOS / MIUI | Working | |
| [HyperUnlocked](https://github.com/ukriu/HyperUnlocked) | HyperOS / MIUI | Working | |
| iOS-Control-Center-HyperOS | HyperOS / MIUI | Device-dependent | |
| MeowPower | HyperOS / MIUI | Working | |
| [Modded HyperOS Launcher](https://github.com/Mods-Center/HyperOS-Launcher) | HyperOS / MIUI | Device-dependent | Keep a backup launcher. Fossify Launcher is suggested. |
| PigLauncher | HyperOS / MIUI | Working | POCO exclusive. |
| [XApps](https://github.com/Leekin2/XApps) | HyperOS / MIUI | Working | |
| [Core Patch N for One UI 9](https://github.com/igorcv88/CorePatch-OneUI9) | Samsung / One UI | Working | |
| [Dressroom Advanced](https://github.com/BlueOutside/Dressroom-Advanced) | Samsung / One UI | Working | |
| [KnoxPatch](https://github.com/salvogiangri/KnoxPatch) | Samsung / One UI | Working | |
| [OneUI Settings Hook](https://github.com/HeheJuice/OneUI-Settings-Hook) | Samsung / One UI | Working | |
| [OneUIX](https://github.com/SoClear/OneUIX) | Samsung / One UI | Working | |
| [Migrate-OSS](https://github.com/BaltiApps/Migrate-OSS) | Backup | Working | |
| [NeoBackup](https://github.com/NeoApplications/Neo-Backup) | Backup | Working | |
| [AFWall+](https://github.com/ukanth/afwall) | Network | Working | Bad firewall rules can cut off ADB. |
| [Net Switch](https://github.com/Rem01Gaming/net-switch) | Network | Working | |
| [SettingsFirewall](https://github.com/canyie/SettingsFirewall) | Network | Working | |
| [Biometric Bypass](https://github.com/hxreborn/biometric-bypass) | Biometrics | Working | |
| [Fingerprint Catalog](https://github.com/custombeta/fingerprint-cataloge) | Biometrics | Working | |
| AlternativeUnlockXposed | Utilities | Working | |
| Cleaner Royall | Utilities | Working | |
| Clipboard Whitelist | Utilities | Working | |
| DarQ Reborn | Utilities | Working | |
| Disable Target API Block | Utilities | Working | |
| FuckDevicePolicy | Utilities | Working | |
| Iconify | Utilities | Working | |
| IslandRecorder | Utilities | Working | |
| RamStatusBar | Utilities | Working | |
| [AClipBoardManager (ClipVault)](https://github.com/paras-moharle/ClipVault) | Other | Working | |
| [CleanShare](https://github.com/hxreborn/cleanshare) | Other | Working | |
| [Discover Ads Filter / Feed Filter](https://github.com/hxreborn/discover-ads-filter) | Other | Working | |
| [FreeUnlock](https://github.com/TheWhiteDog9487/FreeUnlock) | Other | Working | |
| [Frosty](https://github.com/Drsexo/Frosty) | Other | Working | Possible wake-lock issues. |
| [FuckMeta](https://github.com/fzer0x/FuckMeta) | Other | Working | |
| [Morphe](https://github.com/MorpheApp/morphe-manager) | Other | Working | |
| [Re:X](https://github.com/Xposed-Modules-Repo/one.dot.rex) | Other | Working | |
| [Remember My Sort](https://github.com/hxreborn/remember-my-sort) | Other | Working | |
| [ReVancedXposed_Spotify](https://github.com/TheWinner02/ReVancedXposed_Spotify) | Other | Working | |
| SpotifyNext | Other | Working | |
| [TiktokPatchXposed](https://github.com/hik0w/TiktokPatchXposed) | Other | Working | |
| [WA Enhancer](https://github.com/Dev4Mod/WaEnhancer) | Other | Working | |
| [WaDeepDark](https://github.com/Dhangofa/WaDeepDark) | Other | Working | |
| [WaEnhancer X](https://github.com/WaEnhancerX/WaEnhancerX) | Other | Working | |
| [WAPlusXposed](https://github.com/RevealedSoulEven/WAPlusXposed) | Other | Working | |
| [YouTube ReVanced](https://github.com/Zy0x/YouTube-Revanced/) | Other | Working | Check reports before updating. |
| YouTubeAdAway | Other | Working | |

</details>

### Not recommended

| Name | Status | Notes |
| --- | --- | --- |
| [Vector below v2.2](https://github.com/JingMatrix/Vector) | Not recommended | |
| [PrivacySpace](https://github.com/GeekTR/PrivacySpace) | Not recommended | |
| [SusFS](https://github.com/sidex15/susfs4ksu-module) | Not recommended | |
| [Magisk](https://github.com/topjohnwu/Magisk) | Not recommended | Direct Install on a locked bootloader can permanently hardbrick. |
| [KonaBess-Next](https://github.com/KonaBess-Next/KonaBess-Next) | Not recommended | Reported permanent hardbrick risk. |

Older KonaBess is also outdated. Avoid GPU voltage or clock changes on locked devices. Magisk itself is not malware, but Direct Install assumes an unlocked bootloader.

### Reducing module risk

1. Confirm `su -c id` works and the manager opens.
2. Install one module, then soft reboot. A soft reboot keeps root. A full reboot clears it.
3. Test the feature before adding the next module.

Do not install a framework, Zygisk provider, several Xposed modules, and a kernel tweaker in one pass. If the phone bootloops, you will not know which one caused it. Leave loader autorun off until the module set is known good.

If a HyperOS module causes app problems, uninstall it in KernelSU and soft reboot. Open Settings, then Apps, then the affected app. Uninstall updates and clear data. Reboot if needed.

Module indexes: [LSPosed module repository](https://modules.lsposed.org/) and [MMRL](https://github.com/MMRLApp/MMRL). They do not test late-load compatibility.

[Back to contents](#contents)

---

## Firmware & recovery resources

Temporary root does not replace recovery or flash a boot image. Device-specific loaders often need stock kernel and boot artifacts for analysis or offset extraction. Use these resources to obtain firmware for your own device for those purposes or for recovery. Do not use them to distribute proprietary images.

| Resource | What it provides | Notes |
| --- | --- | --- |
| [Bifrost](https://github.com/zacharee/Bifrost) | Cross-platform Samsung firmware downloader by model/CSC | Community download tool, not a flashing tool; availability depends on Samsung's servers. The former SamsungFirmware/Server link is unavailable. |
| [Odin (unofficial mirror)](https://odindownload.com/) | Samsung flash tool | Verify the download's provenance; restore only signed stock firmware for the exact model/region if download mode works |
| [Google Pixel factory images](https://developers.google.com/android/images) | Official Pixel factory images | Boot.img for Pixel KMI/offset derivation |
| [vivo kernel/target references](https://github.com/zenyxx-xd/RootMyVivo-Payloads) | RootMyVivo payload catalog | Exact kernel builds and payload references per vivo/iQOO model; not a boot-image mirror |
| [NVIDIA Shield firmware](https://developer.nvidia.com/shield-download) | Shield Experience images | mdarcy 9.2.4 target image |

> Firmware images are proprietary. Download them only from the vendor or the project that distributes them, and only for devices you own. This site does not host or mirror any firmware, boot image, or APK.

## Research resources

Primary sources for temporary-root research. These document the exploits, offsets, and porting workflows. They are not root tools.

| Resource | What it covers |
| --- | --- |
| [NebuSec IonStack (CyberMeowfia)](https://github.com/NebuSec/CyberMeowfia) | Original IonStack PoC for CVE-2026-43499 (GhostLock) |
| [GhostLock App porting guide](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/README.md) | Kernel profile porting, `uname -r` matching, MediaTek `kernel_phys_load`/`kernel_phys_offset` |
| [Root My Galaxy payload notes](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) | Samsung per-build offsets and payload structure |
| [ghostlock-oneplus offset extraction](https://github.com/JoinChang/ghostlock-oneplus) | `extract_target.py`, `extract_btf.py`, stack-layout feasibility |
| [DirtyFrag / DFRoot](https://github.com/diabl0w/DFRoot) | DirtyFrag (CVE-2026-43284) technique and page-cache write capability |
| [CVE records](https://www.cve.org/) | CVE-2026-43284, CVE-2026-43499, CVE-2025-21479, CVE-2026-98260 |

[Back to contents](#contents)

---

## Quick start

1. **Record the exact target.** Save the model, firmware build, Android version, security patch, and full kernel release where you can read them after a reboot.

   ```bash
   adb shell getprop ro.product.model
   adb shell getprop ro.product.device
   adb shell getprop ro.build.display.id
   adb shell getprop ro.build.version.release
   adb shell uname -r
   ```

   Without a computer, the About phone page in Settings gives the model and build. `uname -r` in Termux gives the kernel.

2. **Match the exact build upstream.** Use [Supported devices](#supported-devices) for a confirmed starting point, then open the loader's own live table. If the project does not list your exact model, build, and kernel, stop. Do not try the closest one.

3. **Back up and plan recovery.** Copy data you cannot lose, and know how to reach safe mode, download mode, or a service center for that model before you run anything.

4. **Install the manager the loader names.** Open it once to register its services. Do not use its install, flash, or patch-boot-image actions. On Samsung with DirtyFrag, use diabl0w's KernelSU build.

5. **Run the loader.** Install it from the upstream release page. Grant the permissions or transport it asks for. Confirm it detected the expected model and kernel, then start the run and keep it in the foreground. Do not start a second run while the first is still working.

6. **Verify, then test modules one at a time.**

   ```bash
   adb shell su -c id
   ```

   Expected output starts with `uid=0(root)`. The SELinux context can differ. If `su` is missing, the exploit may have completed while the late-load failed. See [Troubleshooting](#troubleshooting-and-faq). Install one module, soft reboot, and test. A soft reboot keeps root. A full reboot clears it. Use the manager's soft-reboot action rather than `adb reboot`.

Nothing in this workflow flashes, patches, or installs a boot image. If a guide asks you to, it is a permanent-root procedure.

[Back to contents](#contents)

---

## Troubleshooting and FAQ

### Troubleshooting

<details>
<summary>Click to show <strong>GhostLock panics or reboots instead of finishing</strong></summary>

<br>

A GhostLock panic is a failed attempt at a race, not by itself a brick. Wait for the phone to reboot, then retry if the build is supported. Stop if it panics at the same stage every time, if it bootloops with modules disabled, or if it becomes unusually hot.

A DirtyFrag panic more often points to a wrong KMI, a profile mismatch, or vendor hardening rather than timing.

</details><br>

<details>
<summary>Click to show <strong>Samsung shows "reboot device - d2" or will not enter download mode</strong></summary>

<br>

There are two causes. The download-mode gate on One UI 8.5 and later refuses download mode while a lock-screen credential is set. Android still boots. Remove the screen lock, power off, hold Volume Up and Volume Down together, then connect USB.

A modified protected image is different. The bootloader rejects it and Android does not boot. Key combinations will not help. If the phone does not appear over USB, contact Samsung or a repair service. If download mode opens, flash signed stock firmware for the exact model and region with Odin. Do not mix firmware from another model, and do not use a "D2 bypass" APK.

</details><br>

<details>
<summary>Click to show <strong>ADB does not list the device or says unauthorized</strong></summary>

<br>

Check the cable, port, and USB debugging setting, then run `adb devices` again. For `unauthorized`, unlock the phone and accept the RSA prompt. For `no devices`, try another cable and port and check `lsusb`. Pair wireless debugging before it appears.

</details><br>

<details>
<summary>Click to show <strong>The loader reports "not vulnerable" or "patching failed"</strong></summary>

<br>

The kernel is patched, the vendor backported a fix, or the build has an accidental mitigation. There is no app-side fix, and downgrading firmware on a locked phone can wipe data or brick it. Check the upstream issue tracker and stop.

</details><br>

### FAQ

<details>
<summary>Click to show <strong>Does temporary root survive a full reboot?</strong></summary>

<br>

No. A full reboot loads the stock kernel, unloads the module, and removes the `su` daemon and module mounts. Files under `/data/adb` can remain but are inactive. If the build is still supported, run the loader again.

</details><br>

<details>
<summary>Click to show <strong>Does a soft reboot keep root?</strong></summary>

<br>

Usually. A soft reboot restarts Android's userspace and `system_server`, not the Linux kernel, so the late-loaded module stays and module mounts reactivate. That is why module installs often ask for one. `adb reboot` is a full reboot.

</details><br>

<details>
<summary>Click to show <strong>Does the method unlock the bootloader or wipe data?</strong></summary>

<br>

No. It does not unlock the bootloader, and there is no unlock-induced wipe. A failed run, a module bootloop, or a recovery attempt can still cost data, so back up first.

</details><br>

<details>
<summary>Click to show <strong>How do I know whether my device is supported?</strong></summary>

<br>

Record the model code, build display ID, and full `uname -r`, find the device in [Supported devices](#supported-devices), then confirm the target in the loader's live table. If the exact build is missing from both, stop.

</details><br>

<details>
<summary>Click to show <strong>Why does the exact kernel build matter?</strong></summary>

<br>

Offsets come from a specific kernel build. Compiler settings and vendor hardening change the layout. A 4K-page profile does not cover a 16 KB page build. A vendor can backport the fix without changing the version string. An OTA can move the build or close the bug, so recheck before updating.

</details><br>

<details>
<summary>Click to show <strong>Do I need a computer or Shizuku?</strong></summary>

<br>

Not always. DirtyFrag, Root My Galaxy, GhostLock App, RootMyVivo, and Root My Device can run on the phone itself. Root My Pixel needs Shizuku, which can be started over wireless debugging without a PC. Some profiles need a one-time ADB setup, and command-line ports are easier from a computer. Shizuku is an ADB bridge, not root.

</details><br>

<details>
<summary>Click to show <strong>Which root manager should I install?</strong></summary>

<br>

The one the loader documents. Samsung DirtyFrag requires diabl0w's KernelSU build. Root My Pixel expects the BakaSU manager named in its README. A manager alone does not give temporary root.

</details><br>

<details>
<summary>Click to show <strong>Which modules can work?</strong></summary>

<br>

Modules that mount files or hook apps at runtime can work. Modules that need to start at early boot, replace boot scripts, load a kernel driver, or write a partition generally cannot. See [Modules](#modules), install one at a time, and keep the loader's module-disable switch reachable.

</details><br>

<details>
<summary>Click to show <strong>Root is missing after a run that looked successful</strong></summary>

<br>

The exploit likely completed and the late-load failed. Check that you installed the manager the loader names, selected it in the loader, and matched the kernel. Disable auto reboot if it is on, then run again and read the log. If the log shows a patched kernel or a profile mismatch, stop.

</details><br>

<details>
<summary>Click to show <strong>What do I do after a module bootloop?</strong></summary>

<br>

A full reboot clears root and the kernel module. Open the loader, set modules to disabled, run it again, and remove the module. DirtyFrag's module switch works without root.

If Android does not start, try safe mode. Hold Volume Down during boot. Android may also offer it after repeated crashes. Safe mode may not disable a late-loaded kernel module, so the loader switch remains the reliable path. On a user build, `adb uninstall <loader-package>` removes the loader without root. If the phone does not appear over USB and neither recovery nor download mode opens, stop and seek service support.

</details><br>

<details>
<summary>Click to show <strong>Will banking apps or Play Integrity work?</strong></summary>

<br>

Maybe, but nothing here guarantees it. A locked bootloader helps some checks, while root, manager packages, module files, and SELinux state are all detectable. Strong integrity verdicts usually fail. Test the app before you depend on it.

</details><br>

<details>
<summary>Click to show <strong>How do I report a new device or module result?</strong></summary>

<br>

Open an issue or pull request with the exact model, build, full `uname -r`, Android version, loader and manager versions, module version, result, and the relevant log tail. Use the templates linked from [Contributing](#contributing-and-disclaimer). Attach the log tail and exact build so someone else can repeat the run.

</details><br>

[Back to contents](#contents)

---

## Contributing and disclaimer

Read [CONTRIBUTING.md](https://github.com/fynks/awesome-temporary-root/blob/main/CONTRIBUTING.md) before opening an issue or pull request. Use the concise device-report, module-report, or correction template.

- Maintainer Verified is reserved for results supplied or directly confirmed by this repository's maintainer, with a linked report.
- User Reported identifies community evidence that the maintainer has not independently verified. Accepting a report does not promote it to maintainer verification.
- Tested, Experimental, and the module outcome labels describe results, not who verified them. Keep missing information explicit and do not infer broader device support.

This index collects knowledge and links to public projects. Requests to develop or port a root solution for a particular device belong in the relevant upstream project, not here. Report loader bugs upstream. Report stale or incorrect index entries here.

Contributions must cite primary sources, preserve uncertainty, and exclude credentials, personal data, proprietary firmware, and APK reuploads. Edit `README.md`, then run `npm run sync:readme`. The script generates `src/content/docs/guide.md`.

### License and disclaimer

Content is MIT licensed. Contributions are accepted under the same terms. Linked tools carry their own licenses and documentation.

This is a community-maintained index. It does not develop, audit, or guarantee the linked projects, and it is not affiliated with Google, Samsung, KernelSU, NebuSec, or any loader maintainer. Use these tools only on devices you own or have explicit permission to modify.

---

## Sources

- CVE records: [CVE-2026-98260](https://www.cve.org/CVERecord?id=CVE-2026-98260), [CVE-2026-43284](https://www.cve.org/CVERecord?id=CVE-2026-43284) ([NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-43284)), [CVE-2026-43499](https://www.cve.org/CVERecord?id=CVE-2026-43499) ([NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-43499)). KernelSU: [module guide](https://kernelsu.org/guide/module.html), [bootloop rescue](https://kernelsu.org/guide/rescue-from-bootloop.html).
- Device and profile sources: [Root My Galaxy payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads), [GhostLock App supported devices](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md), [RootMyVivo catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/support/targets-vivo.json), [Root My Device payloads](https://github.com/WitAqua-tools/Root-My-Device-Payloads), [Root My Device project](https://github.com/tqmane/Root-My-Device).
- Loader documentation: [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus), [GhostSam](https://github.com/MocLG/GhostSam), [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy), [R0rt1z2/GhostLock branches](https://github.com/R0rt1z2/GhostLock/branches), [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4), [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17), [ghostlock-s26](https://github.com/snothin/ghostlock-s26), [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root), [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root), [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8), [redmik70pro](https://github.com/Berge520/redmik70pro).
- Module/app compatibility: community lists from r/androidroot and r/HyperOS, the [Temporal Root Modules List](https://github.com/rushiranpise/temporal-root-modules-list), and the [XDA testing thread](https://xdaforums.com/t/list-of-modules-working-on-temporal-root.4796105/).
- Maintainer reports: [Redmi Note 13 4G (sapphire), DirtyFrag](https://github.com/fynks/awesome-temporary-root/issues/9#issuecomment-6871968996), [NeoZygisk confirmation](https://github.com/fynks/awesome-temporary-root/pull/10).
- User reports: [Redmi Note 14 4G compatibility report](https://github.com/fynks/awesome-temporary-root/issues/6), [Realme Note 50 report](https://github.com/fynks/awesome-temporary-root/pull/10).
- Update checks: [DirtyFrag v1.17](https://github.com/mitschud/DirtyFrag/releases/tag/v1.17), [RootMyS24 supported firmware](https://github.com/NanoTurtle1145/root-my-s24#支持设备), [ANB Root v2.4.0](https://github.com/Chuniex-0631/honor-anb-an00-root/releases/tag/v2.4.0), [HMA late-load issue #130](https://github.com/frknkrc44/HMA-OSS/issues/130).
- Background: [awesome-android-root](https://github.com/awesome-android-root/awesome-android-root), [NebuSec IonStack](https://github.com/NebuSec/CyberMeowfia/tree/main/IonStack/CVE-2026-43499).
