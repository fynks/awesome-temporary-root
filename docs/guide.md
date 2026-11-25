---
title: Complete Guide
description: Temporary-root basics, safety, supported devices, tools, modules, quick start, troubleshooting, and sources.
---

<!-- Generated from README.md by scripts/sync-readme.mjs. Edit README.md, not this file. -->

<div align="center">

<picture>
  <source media="(prefers-color-scheme: light)" srcset="/images/ghost-light.svg">
  <source media="(prefers-color-scheme: dark)" srcset="/images/ghost-dark.svg">
  <img src="/images/ghost-light.svg" alt="Awesome Temporary Root ghost logo: a ghost silhouette with a hash symbol cut out of its body" width="96" height="96">
</picture>

# Awesome Temporary Root

**Temporary root on a locked Android bootloader, one boot at a time.**

Curated compatibility index for DirtyFrag, GhostLock, POSIX CPU timer, Adreno GPU loaders, KernelSU late-load managers, and runtime modules.


[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)
[![Kernels](https://img.shields.io/badge/kernels-4.4--6.18-informational?style=flat-square)](#supported-devices)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](https://github.com/fynks/awesome-temporary-root/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/fynks/awesome-temporary-root?style=flat-square)](https://github.com/fynks/awesome-temporary-root/stargazers)

**[Supported devices](devices/index.md)** · **[Tools and managers](#tools-and-managers)** · **[Modules and apps](modules/index.md)** · **[Quick start](#quick-start)** · **[FAQ](#troubleshooting-and-faq)**

</div>

## Contents

- [What is temporary root?](#what-is-temporary-root)
- [Supported devices](#supported-devices)
  - [Browse by brand](#browse-by-brand)
  - [Live upstream tables](#live-upstream-tables)
- [Tools and managers](#tools-and-managers)
- [Modules](#modules)
- [Firmware and recovery resources](#firmware-and-recovery-resources)
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

- DirtyFrag (CVE-2026-43284) is a page-cache write bug in ESP-in-UDP decryption. A run either works or stops with an error, and the loader needs a kernel module built for the device's KMI.
- DirtyFrag forks: [DirtyFalg-vr](https://github.com/DONGDERS/DirtyFalg-vr) disarms vivo/iQOO `vr.ko` tracepoint hooks (`__tracepoint_sys_exit`); [DFReroot](https://github.com/polygraphene/DFReroot) persists a system-UID app for later boots; [LSPromise](https://github.com/LSPosed/LSPromise) chains `CVE-2026-49881` into DirtyFrag without Shizuku.
- GhostLock (CVE-2026-43499) is a futex priority-inheritance use-after-free that gives a controlled kernel write. It is a race, so retries and kernel panics are normal. A working payload depends on the exact kernel layout.
- The Adreno GPU route (CVE-2025-21479) is a GPU command-packet defect that lets the GPU overwrite its own page tables for physical read/write. RootMyVivo, [CVE-2025-21479-FX5P](https://github.com/diyiqiuye/CVE-2025-21479-FX5P), and Quest `cheese` ports ship it for vulnerable Snapdragon devices whose GPU firmware predates Qualcomm's June 2025 fix.

A few ports use other device-specific routes, such as a vendor service on MIUI or Honor, or a fastboot-issued permissive command line. Their table row says so.

POSIX CPU timers (`CVE-2026-98260`, a use-after-free on non-leader `exec()` fixed upstream in Linux commit `acb03d388181`) underpin `RootMyS24`, `TimerRoot`, `SamTimer`, `GhostKey`, `Shark`, and single-target `6.18.21` ports for OnePlus 16 (`PYB110`) and HONOR Win2 (`BRM-AN00`). Its [CVE record](https://www.cve.org/CVERecord?id=CVE-2026-98260) lists fixed stable releases `6.1.191`, `6.6.158`, `6.12.112`, `6.18.54`, and `7.2.8`, with `7.3` also marked unaffected. The same vendor-backport caveat applies.

Non-kernel privilege escalation and bootloader-unlock tools sit outside RAM-only temporary root:

- **Limited / non-kernel privilege escalation (not KernelSU root):** `CVE-2024-31317` (Zygote injection on pre-`2024-06-01` SPL reaching UID `1000` / app UIDs), `CVE-2026-49881` (`TLPE`, Android 17 Telecom -> `system_server`, fixed in SPL `2026-09-01`), and `DirtyInit` (`u:r:init:s0` ADB shell via `CVE-2026-43284` without `su` or KernelSU).
- **Bootloader unlock bypasses and boot-chain tools:** Separate from temporary root; they modify partitions, AVB state, or unlock fastboot and carry factory-reset or brick risks.

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

The 5.4 line needs a separate qualification. Public DirtyFrag research calls the upstream PoC infeasible there because the UDP zero-copy path needs `MSG_SPLICE_PAGES`, which arrived in 6.5. A [labelled 5.4-qgki research report](https://github.com/Jean7z/temporary-root-samsung-5.4-research) ([correction #42](https://github.com/fynks/awesome-temporary-root/issues/42)) instead records one observed `uid=0` session on an exact locked Galaxy S21 Ultra build using a hardened DFRoot fork with a userspace `crash_dump64` `splicehelper`. That is a User Reported, Experimental result on one build: it does not make the upstream PoC feasible on 5.4, does not mean the fork is upstream-supported, and does not generalize to other 5.4 kernels. The report itself leaves the mechanism unverified.

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

Status shows who reported the result and what happened. Each device page includes the status definitions table. A generated profile is not a confirmed target. Check the loader's live table before running. A newer release does not inherit an older result.

Match the full kernel release your phone reports. Two phones on the same Android release can differ in kernel build, page size, and vendor hardening, so a partial match is not enough. If a kernel or tool version is missing, treat it as unknown.

> [!WARNING]
> Pixel 7a TimerRoot runs started after first unlock (AFU) fail far more often: background apps and services can win the race. This repeats on `CP4A.261105.040.A1` after the earlier report. See [Google Pixel](devices/pixel.md) for details.

### Browse by brand

Device tables, status definitions, and per-brand compatibility notes live on dedicated pages:

| Brand / group | Loaders |
| --- | --- |
| [Samsung Galaxy](devices/samsung.md) | Root My Galaxy, Root My Galaxy Next, Root My Galaxy Ultra, Root My Galaxy Extended, RootMyS24, GhostSam, SamTimer, GhostKey, GhostLock-Galaxy, UniRoot, ghostlock-a17, SM-A166W port |
| [Google Pixel](devices/pixel.md) | Root My Pixel, TimerRoot, LSPromise |
| [OnePlus](devices/oneplus.md) | ghostlock-oneplus, Anchor, Root My Device (tqmane), Shark, OnePlus 16 PYB110 kit |
| [OPPO](devices/oppo.md) | ghostlock-oneplus, Root My Device (Witaqua), Shark, CVE-2025-21479-FX5P |
| [Realme](devices/realme.md) | ghostlock-rmx5085, DirtyFrag, Shark |
| [vivo and iQOO](devices/vivo.md) | RootMyVivo, DirtyFalg-vr, yuehong-privilege-assistant, GhostLock-X200, DirtyFrag, DFRoot, iQOO Z9 / vivo T3 port, Adreno port |
| [Xiaomi and Redmi](devices/xiaomi.md) | ghostlock-oneplus, Root My Device (Witaqua), DirtyFrag, GhostLock App, DFRoot, TimerRoot, Shark, CVE-2026-43499-popsicle |
| [ASUS](devices/asus.md) | zenfone9-ghostlock |
| [Nothing](devices/nothing.md) | Root My Device (tqmane), GhostLock App |
| [Honor](devices/honor.md) | ANB Root, CVE-2026-98260-BRM-AN00 |
| [HMD and Nokia](devices/nokia.md) | DFRoot |
| [Other brands](devices/other-brands.md) | Huawei, Motorola, Lenovo, Sony, TECNO, Infinix, RedMagic, Sharp, and Boox ports plus GhostLock App kernel profiles |
| [Amazon, NVIDIA, Meta, Meizu, Rokid, and TCL](devices/other.md) | R0rt1z2/GhostLock, GhostLock NVIDIA Shield, Root My Device (Witaqua), Meizu 20 Pro / 21, Rokid RV101 GhostLock |

See the [Supported Devices overview](devices/index.md) for all brand pages in one index.

---

### Live upstream tables

These tables are maintained upstream and change more often than this README. Check your exact model, build, and `uname -r`. If they differ from this page, use the upstream table.

| Project | Devices | Live support data |
| --- | --- | --- |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) | Samsung Galaxy | [Payload list](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads#supported-payloads), [JSON](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json) |
| [Root My Galaxy Next](https://github.com/rushiranpise/Root-My-Galaxy-Next) | Samsung Galaxy | [Fork payload feed](https://github.com/rushiranpise/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json) |
| [Root My Galaxy Ultra](https://github.com/xorpix/Root-My-Galaxy-Ultra) | Galaxy S26 Ultra | [S26 Ultra support rules](https://github.com/xorpix/Root-My-Galaxy-Ultra/blob/main/docs/S26-ULTRA-SUPPORT.md) |
| [Root My Galaxy Extended](https://github.com/igorcv88/Root-My-Galaxy-Extended) | Galaxy S25 series | [README support notes](https://github.com/igorcv88/Root-My-Galaxy-Extended#supported-devices) |
| [GhostSam](https://github.com/snothin/GhostSam) | Galaxy S22, S26, Z Fold8 | [Device list](https://github.com/snothin/GhostSam#supported-devices) |
| [SamTimer](https://github.com/Leo141212/SamTimer) | Samsung Galaxy (`CVE-2026-98260`) | [README target notes](https://github.com/Leo141212/SamTimer#overview) |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | Galaxy Z Fold6 | [Kernel list](https://github.com/wxxsfxyzm/GhostLock-Galaxy#registered-kernel-profiles) |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) | Galaxy A17 | [Target list](https://github.com/mobilehackinglab/ghostlock-a17#target) |
| [Shark-Moto](https://github.com/CYB3R0ID694/Shark-Moto) | OnePlus, OPPO, Realme, iQOO, Motorola (`CVE-2026-98260`) | [Kernel-chain table](https://github.com/CYB3R0ID694/Shark-Moto#readme) |
| [ExtractKit](https://github.com/qq2770355800/ExtractKit) | Honor / MagicOS calibration, 74 kernel profiles | [Supported kernels](https://github.com/qq2770355800/ExtractKit/blob/main/docs/supported-kernels.md) |
| [GhostLock-HonorFne](https://github.com/MSEDGE-CORE/GhostLock-HonorFne) | Honor 70 / 60 / 60 Pro | [README targets](https://github.com/MSEDGE-CORE/GhostLock-HonorFne#readme) |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) | Pixel 6 to 11 | [Build list](https://github.com/alex193a/Root-My-Pixel#supported-devices--build-profiles) |
| [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) | Pixel 6 to 11, Samsung mode, selected Xiaomi/Redmi and imported vendor profiles | [Supported devices](https://github.com/MVN123123123123123/TimerRoot/blob/main/docs/supported-devices.md) |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) | OnePlus, OPPO, Xiaomi | [Verified list](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [Infeasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible) |
| [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) | Nothing Phone (3a), OnePlus Pad 3 | [Nothing list](https://github.com/tqmane/Root-My-Device/blob/main/devices/nothing-phone-3a/README.md#supported-target), [Pad 3 list](https://github.com/tqmane/Root-My-Device/blob/main/devices/oneplus-pad-3/README.md#supported-target) |
| [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) | Xiaomi, OPPO, and Meta Quest | [Target list](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json), [Notes](https://github.com/WitAqua-tools/Root-My-Device-Payloads#supported-targets) |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) | vivo and iQOO | [Catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/catalog/devices.json) |
| [DirtyFalg-vr](https://github.com/DONGDERS/DirtyFalg-vr) | vivo/iQOO (`vr.ko`) and GKI `5.10` to `6.18` | [LKM matrix and `libvrext.so` notes](https://github.com/DONGDERS/DirtyFalg-vr#readme) |
| [Shark (kpgc10kai fork)](https://github.com/kpgc10kai/Shark) / [Upstream releases](https://github.com/Yunnijian/Shark-Releases) | OnePlus, OPPO, Realme, Xiaomi 18 Pro, Xiaomi 18 Fold, Pad 7S Pro, and Pad 9 Pro Max (experimental); upstream v2.6.26 adds Xiaomi 17 and `6.1.157` profiles | [Supported kernel chains](https://github.com/kpgc10kai/Shark#readme) |
| [yuehong-privilege-assistant](https://github.com/qq2070006042-create/yuehong-privilege-assistant) | Multi-method / vivo and iQOO | [Supported methods](https://github.com/qq2070006042-create/yuehong-privilege-assistant#readme) |
| [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) | Galaxy S24/S24 Ultra, Z Flip6, China Z Fold6 | [Verified and pending firmware lists](https://github.com/NanoTurtle1145/root-my-s24#支持设备) |
| [R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock) | Amazon Fire devices, TCL T653T02 | [4.14 default branch](https://github.com/R0rt1z2/GhostLock/tree/4.14), [5.4](https://github.com/R0rt1z2/GhostLock/tree/5.4), [4.4](https://github.com/R0rt1z2/GhostLock/tree/4.4), [5.10](https://github.com/R0rt1z2/GhostLock/tree/5.10), [5.15 TCL profiles](https://github.com/R0rt1z2/GhostLock/tree/5.15) |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) | Multi-brand `uname -r` profiles | [Profile list](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) |

[Back to contents](#contents)

---

## Tools and managers

A temporary root setup needs a loader, a KernelSU-compatible manager, and whatever transport the loader uses. Some apps bundle all three.

### Exploit loaders and device-specific ports

| Tool / latest version | Method | Coverage / note |
| --- | --- | --- |
| [DirtyFrag](https://github.com/mitschud/DirtyFrag) / [Latest version](https://github.com/mitschud/DirtyFrag/releases) | DirtyFrag | Samsung-focused; other vulnerable devices/KMIs may work, on-device; no Shizuku required |
| [DirtyFalg-vr](https://github.com/DONGDERS/DirtyFalg-vr) / [Latest version](https://github.com/DONGDERS/DirtyFalg-vr/releases) | DirtyFrag | Hardened DirtyFrag fork for vivo/iQOO (`vr.ko` tracepoint disarm via BTF or Rust `libvrext.so` boot/OTA extraction, `W1c` verification, `fsync` kmsg log, 8 LKMs `5.10` to `6.18`), on-device; no Shizuku required |
| [DFRoot](https://github.com/diabl0w/DFRoot) / [Latest version](https://github.com/diabl0w/DFRoot/releases) | DirtyFrag | Broad, manager-agnostic, on-device |
| [DFReroot](https://github.com/polygraphene/DFReroot) / [Latest version](https://github.com/polygraphene/DFReroot/releases) | DirtyFrag (second-stage) | Persists a system-UID app in `packages.xml` after an initial temporary root so subsequent boots run DirtyFrag directly; tested Galaxy S26 One UI 8.5; author recommends DFRoot for simpler use |
| [LSPromise](https://github.com/LSPosed/LSPromise) | `CVE-2026-49881` + DirtyFrag | Android 17 `untrusted_app` -> KernelSU chain without Shizuku; Pixel 10 initial Android 17 release tested (pre-`2026-09-01` SPL); fails on Pixel 6a / `6.1.xxx-android14` |
| [yuehong-privilege-assistant](https://github.com/qq2070006042-create/yuehong-privilege-assistant) / [Latest version](https://github.com/qq2070006042-create/yuehong-privilege-assistant/releases) | Multi-method | Multi-method launcher (`roro.stellar.yuehong`, Android 10+, arm64) integrating Stellar wireless debugging, `DirtyFalg-vr`, GhostLock, GhostKey, and vivo/iQOO wired OTG mode |
| [Shark (kpgc10kai fork)](https://github.com/kpgc10kai/Shark) / [Upstream releases](https://github.com/Yunnijian/Shark-Releases) | 98260 UAF | One-tap temp root + hot manager switching (seven managers: KernelSU, KernelSU-Next, BakaSU, SukiSU Ultra, SukiSU Nova, YukiSU, FinaSU) across five current chains (`6.6.118`, `6.12.38`, `6.12.58`, `6.12.69`, `6.18.21`) for OnePlus, OPPO, Realme, and Xiaomi targets; Xiaomi 18 Fold, Pad 7S Pro, and Pad 9 Pro Max are experimental. Shizuku/Stellar, plus experimental wireless ADB pairing. Upstream v2.6.26 adds Xiaomi 17 and `6.1.157` profiles, not yet ported to the fork |
| [UniRoot](https://github.com/kuuky29/UniRoot) / [Latest version](https://github.com/kuuky29/UniRoot/releases) | DirtyFrag + GhostLock | Samsung Galaxy, on-device; V5 is DirtyFrag-first with an in-app `ksud` patcher and no Shizuku, while the classic GhostLock path is retained; Galaxy A15 4G confirmed |
| [GhostSam](https://github.com/snothin/GhostSam) / [Latest version](https://github.com/snothin/GhostSam/releases) | Both | Galaxy S22, S26, Z Fold8, ADB; the upstream repository is `snothin/GhostSam`, and `MocLG/GhostSam` is a fork with the same description |
| [GalaxyCrash](https://github.com/RemiPelloux/GalaxyCrash) / [Latest version](https://github.com/RemiPelloux/GalaxyCrash/releases) | DirtyFrag | Stability fork of DirtyFrag for Galaxy devices; one `SM-S948B` build verified, reboot clears root |
| [Samsung Root Kit](https://github.com/shangu2003/SamsungRootKit) / [Latest version](https://github.com/shangu2003/SamsungRootKit/releases) | DirtyFrag + GhostLock | Offline Samsung toolbox: DirtyFrag first, GhostLock fallback, then DFReroot persistence; per-model firmware counts, no hardware run claimed |
| [Samsung Root Managers](https://github.com/thecaticorn01/Samsung-Root-Managers) | KernelSU-Next + BakaSU | Continuously rebuilt Samsung managers with `ksud` and `.ko` for LKM late-load on `SM-S948U1` |
| [root-my-s23](https://github.com/zxsos/root-my-s23) / [Latest version](https://github.com/zxsos/root-my-s23/releases) | GhostLock | Galaxy S23 (`SM-S9110`) boot-time re-arm: re-runs `CVE-2026-43499` and the KernelSU late-load without a PC |
| [Time-My-Galaxy](https://github.com/MocLG/Time-My-Galaxy) / [Latest version](https://github.com/MocLG/Time-My-Galaxy/releases) | 98260 UAF | Samsung `CVE-2026-98260` Shizuku launcher that downloads a signed per-build bundle keyed on `ro.build.version.incremental` |
| [galaxyxr-root](https://github.com/booinspace/galaxyxr-root) / [Latest version](https://github.com/booinspace/galaxyxr-root/releases) | DirtyFrag | Galaxy XR (`SM-I610`) AZJ2 build with a locally built DirtyFrag helper and KernelSU GXR manager |
| [KsuLateLoad](https://github.com/NanoTurtle1145/KsuLateLoad) / [Latest version](https://github.com/NanoTurtle1145/KsuLateLoad/releases) | 98260 UAF | One-tap KernelSU late-load helper over Shizuku |
| [oppo-jailbreak](https://github.com/tw0m8/oppo-jailbreak) / [Latest version](https://github.com/tw0m8/oppo-jailbreak/releases) | GhostLock | App `RootNow`; field-tested on a retail OPPO Find X8s (`PKT110`, ColorOS 17) |
| [findn2-ksu-chain](https://github.com/pubglite55/findn2-ksu-chain) / [Latest version](https://github.com/pubglite55/findn2-ksu-chain/releases) | GhostLock | OPPO Find N2 (`PGU110`, `5.10.236`/`5.10.246`): futex-PI write, cred overwrite, self-built KernelSU LKM, SELinux stays Enforcing |
| [infinitylock-app](https://github.com/kailashrs/infinitylock-app) / [Latest version](https://github.com/kailashrs/infinitylock-app/releases) | 98260 UAF | vivo X200 Ultra (`V2454A` / `PD2454`) Shizuku launcher with firmware+kernel pairing and an optional one-attempt-per-boot mode |
| [CVE-2026-98260-Asteroids](https://github.com/arkylin/CVE-2026-98260-Asteroids) | 98260 UAF | Nothing Phone (3a) / (3a) Pro on `6.1.172`; patches KernelSU `.ko` symbols before `finit_module` |
| [Shark-Moto](https://github.com/CYB3R0ID694/Shark-Moto) / [Latest version](https://github.com/CYB3R0ID694/Shark-Moto/releases) | 98260 UAF | Multi-brand Shark fork with the kernel-chain table extended to Motorola |
| [cve-2026-64560-rmx6699](https://github.com/totsiaw/cve-2026-64560-rmx6699) / [Latest version](https://github.com/totsiaw/cve-2026-64560-rmx6699/releases) | `CVE-2026-64560` UAF | realme RMX6699 (`6.6.118`, Android 17); another POSIX CPU timer use-after-free |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) / [Latest version](https://github.com/YuKongA/ghostlock-app/tags) | GhostLock | Multi-brand `uname -r` profiles, on-device/Shizuku<br>User-reported success on the Redmi Note 14 4G with v1.2 |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) / [Latest version](https://github.com/BuSung-dev/Root-My-Galaxy/releases) | GhostLock | Selected Galaxy builds, on-device/Shizuku |
| [Root My Galaxy Next](https://github.com/rushiranpise/Root-My-Galaxy-Next) / [Latest version](https://github.com/rushiranpise/Root-My-Galaxy-Next/releases) | GhostLock + DirtyFrag | Independent fork of Root My Galaxy; KernelSU, KernelSU-Next, and BakaSU (ReSukiSU) payload flavours, on-device/wireless ADB/Shizuku |
| [Root My Galaxy Ultra](https://github.com/xorpix/Root-My-Galaxy-Ultra) / [Latest version](https://github.com/xorpix/Root-My-Galaxy-Ultra/releases) | GhostLock + DirtyFrag | Fork of Root My Galaxy Next for Galaxy S26 Ultra (`m3q`), on-device/Shizuku; KernelSU, KernelSU-Next, BakaSU, and KowSU managers |
| [Root My Galaxy Extended](https://github.com/igorcv88/Root-My-Galaxy-Extended) / [Latest version](https://github.com/igorcv88/Root-My-Galaxy-Extended/releases) | GhostLock + 98260 UAF | Fork of Root My Galaxy for Galaxy S25 series (`SM-S931B`, `SM-S936B` unvalidated, `SM-S937B` `CZF1`, `SM-S938B` `CZG3`/`CZZI4` One UI 9 beta), on-device/Shizuku |
| [SamTimer](https://github.com/Leo141212/SamTimer) | 98260 UAF | Samsung Galaxy `CVE-2026-98260` Shizuku app -> KernelSU-Next 3.4.2 (`ksud-next-generic-kdp`), auto-root + safe-boot module disabler; tested `SM-S921N` (`6.1.162`, One UI 9) |
| [GhostKey](https://github.com/Feiman55/CVE-2026-98260-GhostKey) | 98260 UAF | `CVE-2026-98260` Shizuku + NDK app, version `1.1.5`, with exact-`uname -r` built-in profiles, `boot.img` profile parsing, and KernelSU staging; no GitHub Releases and no documented Samsung run |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) / [Latest version](https://github.com/alex193a/Root-My-Pixel/releases) | GhostLock | Pixel 6 to 11, Shizuku; retries common |
| [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) / [Latest version](https://github.com/MVN123123123123123/TimerRoot/releases) | 98260 UAF | Pixel 6 to 11 (4 KB and 16 KB profiles), Samsung mode, and selected Xiaomi/Redmi/OPPO/realme/Meizu kernels, Shizuku; Pixel 7a and 9a have documented hardware runs, most other profiles are QEMU-only; exact `uname -r`, page size, and on Samsung the model, are required. Rolling `beta` assets were refreshed 2026-11-24; post-2026-11-22 work sits on the unmerged `beta-test` branch |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) / [Latest version](https://github.com/zenyxx-xd/RootMyVivo/releases) | GhostLock + DirtyFrag | vivo/iQOO GhostLock and DirtyFrag targets, Shizuku/ADB |
| [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) / [Latest version](https://github.com/WitAqua-tools/Root-My-Device/releases) | GhostLock | Xiaomi 17T Pro, 14T Japan, Quest 3, on-device |
| [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) / [Latest version](https://github.com/tqmane/Root-My-Device/releases) | GhostLock | Nothing Phone (3a), OnePlus Pad 3, Shizuku |
| [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) / [Latest version](https://github.com/NanoTurtle1145/root-my-s24/releases) | GhostLock + 98260 UAF | Selected Galaxy S24/S24 Ultra, Z Flip6, Z Fold6 CN builds, Shizuku/ADB; see exact target notes |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) / [Latest version](https://github.com/wxxsfxyzm/GhostLock-Galaxy/commits/main) | GhostLock | Galaxy Z Fold6 SM-F9560, ADB/Shizuku |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) / [Latest version](https://github.com/JoinChang/ghostlock-oneplus/commits/main) | GhostLock | OnePlus, Xiaomi, OPPO, ADB |
| [GhostLock-for-OnePlus](https://github.com/p2p3p/GhostLock-for-OnePlus) / [Latest version](https://github.com/p2p3p/GhostLock-for-OnePlus/tags) | GhostLock | Ace 6T, OnePlus 15 PLK110, ADB |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) / [Latest version](https://github.com/mobilehackinglab/ghostlock-a17/commits/main) | GhostLock | Galaxy A17 SM-A175F, ADB; shell only |
| [R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock) / [Latest version](https://github.com/R0rt1z2/GhostLock/branches) | GhostLock | Amazon Fire devices and TCL T653T02, ADB; 4.14 is the default branch, with 5.4, 4.4, 5.10, and 5.15 branches for other targets; choose the exact kernel branch |
| [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4) / [Latest version](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4/releases) | GhostLock | Shield TV Pro 2019, ADB; no `su` |
| [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8) / [Latest version](https://github.com/Qingizi7/cve-2025-21479_iqooneo8/commits/main) | Adreno GPU | iQOO Neo8 SM8475 on `5.10.198`, ADB; pre-Jun-2025 GPU |
| [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root) / [Latest version](https://github.com/xiaohj233/ghostlock-x200-root/releases) | GhostLock | vivo X200 PD2415 b57, PC or companion app |
| [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root) / [Latest version](https://github.com/Chuniex-0631/honor-anb-an00-root/releases) | GhostLock | HONOR 80 Pro Flat ANB-AN00, Shizuku; single MagicOS build; signing-key migration |
| [Redmi K70 Pro temp root](https://github.com/Berge520/redmik70pro) / [Latest version](https://github.com/Berge520/redmik70pro/releases) | MIUI service | Redmi K70 Pro (manet), HyperOS 3/Android 16, PC + ADB/fastboot |
| [ghostlock-s26](https://github.com/snothin/ghostlock-s26) / [Latest version](https://github.com/snothin/ghostlock-s26/releases) | GhostLock | Galaxy S26 series, ADB; merged into GhostSam |
| [IonStackQuest3](https://github.com/F-19-F/IonStackQuest3) / [Latest version](https://github.com/F-19-F/IonStackQuest3/releases) | GhostLock | Quest 3 listed incrementals, ADB; newer builds patched |
| [DirtyInit](https://github.com/combeng6th/DirtyInit) / [Latest version](https://github.com/combeng6th/DirtyInit/releases) | DirtyFrag | Samsung devices with the page-cache write bug, ADB; hooks `init` (`u:r:init:s0`) for a `dirtyinit` socket shell, not KernelSU/`su` |

DirtyFrag's latest checked release is [v1.18](https://github.com/mitschud/DirtyFrag/releases/tag/v1.18). It stages `ksud` from the selected manager's `libksud.so`. Samsung requires diabl0w's KernelSU build. Other devices can use the managers upstream names. Since v1.17, LKM selection uses the kernel's GKI level and vendor Android release rather than the marketing Android version. Read the run log and stop if the kernel has no supported module.

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

- [CVE-2026-98260-Xiaomi-17-Pro-Max](https://github.com/starriv/CVE-2026-98260-Xiaomi-17-Pro-Max) for Xiaomi 17 Pro Max (`popsicle`, `6.12.69`, HyperOS `OS4.0.4.0` to `OS4.0.6.0`).
- [xring-CVE-2026-98260-OS4.0](https://github.com/ChaYeWuu/xring-CVE-2026-98260-OS4.0) for the XRING O1 family (`violin`, `jinghu`, `dijun`) on two `6.18.21` kernels.
- [cve-2026-98260-tb710fu](https://github.com/aoxzh/cve-2026-98260-tb710fu) for Lenovo Tab Pro GT (`TB710FU`, `6.1.128`) and [tb320fc-temp-root](https://github.com/armyja/tb320fc-temp-root) for the Lenovo Legion Y700 (`TB320FC`, `5.10.209`).
- [GhostLock-Honor90-REA-AN00](https://github.com/anVzdGFtb25/GhostLock-Honor90-REA-AN00), [honor90-ghostlock](https://github.com/cyrrp/honor90-ghostlock), [GhostLock-HonorFne](https://github.com/MSEDGE-CORE/GhostLock-HonorFne), [magic5-one-click-root](https://github.com/Sakuramoe233/magic5-one-click-root), [honor-ldy-an00-ghostlock](https://github.com/iodn/honor-ldy-an00-ghostlock), [CVE-2026-98260](https://github.com/woshigenm/CVE-2026-98260) (MagicPad3 Pro), [honor-pad9-ghostlock](https://github.com/vexpaer/honor-pad9-ghostlock), and [HOneClick](https://github.com/superboyyy/HOneClick) for Honor devices.
- [GhostLock-P50Pro-JAD-AL00](https://github.com/anVzdGFtb25/GhostLock-P50Pro-JAD-AL00) and [GhostLock-MatePad11](https://github.com/natsuu233/GhostLock-MatePad11) for Huawei devices.
- [xperia1vi-root](https://github.com/RetributionByRevenue/xperia1vi-root), [zenfone9-root](https://github.com/RamenFast/zenfone9-root), [humane-aipin-ghostlock](https://github.com/TheAndersMadsen/humane-aipin-ghostlock), [make-it-root](https://github.com/DarkDevil-937/make-it-root) and [ghostlock-firetv-tank](https://github.com/Anezium/ghostlock-firetv-tank) for Sony, ASUS, Humane, and Fire TV targets.
- [matisse-public](https://github.com/ihamn/matisse-public), [redmi-k50-temp-root](https://github.com/noctide/redmi-k50-temp-root), [redmi-pad-se-87-root](https://github.com/nestchao/redmi-pad-se-87-root), [REDMI_Root](https://github.com/d16ug-a1l/REDMI_Root), and [fuxi-temp-root](https://github.com/realskyrin/fuxi-temp-root) for Xiaomi, Redmi, and POCO builds outside the upstream feeds.
- [ghostlock-emerald](https://github.com/datfooldive/ghostlock-emerald) for POCO M6 Pro 4G.
- [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock) for ASUS Zenfone 9.
- [ghostlock-rmx5085](https://github.com/Nixbones/ghostlock-rmx5085) for Realme GT 7T.
- [Meizu 21 GhostLock](https://github.com/ymh001/meizu21-ghostlock-root) for Meizu 21, and [meizu20pro-temp-root](https://github.com/h5hg6vy8nt-hue/meizu20pro-temp-root) for Meizu 20 Pro (`meizu_20Pro_CN`, Flyme `12.6`/`12.7`, `5.15.119`).
- [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock) for iQOO Z9 5G and vivo T3 5G.
- [ghostlock-xringo1](https://github.com/ayyy7128/ghostlock-xringo1) for XRING O1 on `6.6.77` and `6.6.118`.
- [SM-A166W port](https://github.com/jojobear691/SM-A166W-DZG1-Temporary-Root) for Galaxy A16 5G.
- [OnePlus 16 PYB110 kit](https://github.com/AzirX1337/CVE-2026-98260-OnePlus16-PYB110-Jailbreak) for OnePlus 16 (`PYB110`, `6.18.21` ColorOS 17 / Android 17, `CVE-2026-98260` -> KernelSU or FinaSU).
- [HONOR Win2 BRM-AN00 port](https://github.com/sganggs/CVE-2026-98260-BRM-AN00) for HONOR Win2 (`BRM-AN00`, `6.18.21` MagicOS 11 / Android 17, `CVE-2026-98260` -> BakaSU).
- [CVE-2026-43499-popsicle](https://github.com/x-spy/CVE-2026-43499-popsicle) for Xiaomi 17 / Pro / Ultra (`6.12.23`, `CVE-2026-43499`; caveat: new apps crash after exploit until reboot).
- [CVE-2025-21479-FX5P](https://github.com/diyiqiuye/CVE-2025-21479-FX5P) for OPPO Find X5 Pro (`PFEM00`, `5.10.168`/`5.10.198`, Adreno KGSL `CVE-2025-21479` -> KernelSU 3.3.0).
- [cheese](https://github.com/zhuowei/cheese), [eureka_panther-adreno-gpu-exploit-1](https://github.com/FreeXR/eureka_panther-adreno-gpu-exploit-1), and [cheese-cake](https://github.com/sarabpal-dev/cheese-cake) for Adreno A7xx (`CVE-2025-21479`) on pre-August 10, 2025 Meta Quest 3 / 3S and Snapdragon 8-class builds.

A multi-device repack can bundle legitimate payloads and still add code. Do not treat one as a trusted upstream, and do not grant root to a loader you cannot identify.

### Root managers

| Manager | What it is | Use it for |
| --- | --- | --- |
| [KernelSU](https://github.com/tiann/KernelSU) | Upstream kernel-based root manager | GKI devices; late-load support |
| [KernelSU-Next](https://github.com/KernelSU-Next/KernelSU-Next) | KernelSU fork | Devices a loader names it for |
| [KowSU](https://github.com/KOWX712/KernelSU) | KernelSU fork | Alternative manager for loaders that support it; the fork's own repository is archived, so use a loader-pinned build |
| [SukiSU Nova](https://github.com/SukiSU-Nova/SukiSU-Nova) | KernelSU fork, formerly SukiSU Ultra | Pixel TimerRoot profiles and other targets that name it or SukiSU Ultra |
| [BakaSU](https://github.com/Baka-SU/BakaSU) | KernelSU fork, formerly ReSukiSU | Pixel profiles and other targets that name it; payload feeds still label the flavour `resukisu` |
| [diabl0w KernelSU](https://github.com/diabl0w/KernelSU) | Samsung-patched KernelSU | Samsung DirtyFrag and several Galaxy ports |
| [Samsung Root Managers](https://github.com/thecaticorn01/Samsung-Root-Managers) | Rebuilt KernelSU-Next and BakaSU managers | `SM-S948U1` late-load pairings; each release carries the manager APK, `ksud`, and KMI-matched `.ko` |

Use the manager the loader names. On Samsung, use diabl0w's build. A manager alone does not provide temporary root.

<details>
<summary>Click to show <strong>why the manager choice matters</strong></summary>

<br>

Most loaders stage a manager-provided `libksud.so`, the library used to run `ksud` on the device. The filename is not universal: DirtyFalg-vr v1.16-vr.2 locates the renamed bundled `ksud` in SukiSU Nova by ELF signature (PIE with `PT_INTERP` and a `late-load` string). Follow the manager rules your loader documents, and use a build from the project itself.

The driver is the kernel module the loader stages, and it is fixed for the boot. Some managers check its UAPI and refuse to run, or show an update banner, when the manager is newer than that driver. That is a match problem, not a missing app update: install a manager build whose UAPI matches the staged driver, then reboot before changing the manager family. Loaders that pin a manager link, and forks such as Root My Galaxy Next and Root My Galaxy Ultra that choose a manager from the payload or backend, exist to keep that pairing consistent.

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
| [InfinityLock](https://github.com/kailashrs/infinitylock-app) / [pd2454-kernelsu-runner](https://github.com/kailashrs/pd2454-kernelsu-runner) | Single-device Shizuku launcher and KernelSU runner | vivo X200 Ultra (`PD2454`); useful as a reference for firmware-keyed payload pairing |
| [MT Manager](https://mt2.cn/download/) | On-device APK and archive editor | Inspect a loader before installing it; do not edit system files on a locked build |

### Verifying a download

- Download from the project's own release page. Avoid reuploads, Telegram mirrors, paid builds, and remote-root services.
- Check the release tag and date, and compare published hashes or signing certificates when the project provides them.
- Build from source when you can. A clean VirusTotal result is not proof that an exploit APK is safe.

### Limited and non-kernel privilege escalation

<details>
<summary>Click to show <strong>limited / non-kernel privilege escalation tools</strong></summary>

<br>

These tools reach a limited privilege level (such as `system_server` UID `1000` or app-UID Zygote injection) rather than kernel root, or require an already permissive SELinux state:

| Tool | Mechanism / CVE | Scope and limitations |
| --- | --- | --- |
| [TLPE](https://github.com/Supersonic/TLPE) | `CVE-2026-49881` (Telecom `InCallController`) | Android 17 `untrusted_app` -> `system_server` (UID `1000`), not kernel root; fixed in Android SPL `2026-09-01` (used as stage 1 in `LSPromise`) |
| [zygote-CVE-2024-31317](https://github.com/rabits/zygote-CVE-2024-31317) | `CVE-2024-31317` (Zygote command injection) | Android 14 and earlier up to SPL `2024-05-01` (fixed in `2024-06-01`); grants UID `1000` or app UID under SELinux, not kernel root |
| [Magica](https://github.com/vvb2060/Magica) | Zygote seccomp disable (archived) | Android 10 to 16 diagnostic/utility flow; requires SELinux permissive or existing privilege, not an exploit by itself |

</details><br>

### Bootloader unlock bypasses and boot-chain tools

<details>
<summary>Click to show <strong>bootloader unlock and AVB/preloader tools (separate scope and higher risk)</strong></summary>

<br>

> [!WARNING]
> Unlike RAM-only temporary root, these tools modify bootloader state, AVB metadata, or protected partitions, often trigger a factory reset, or require BROM/EDL/hardware access. Misuse can permanently brick a device.

| Tool | Target / SoC | What it does |
| --- | --- | --- |
| [QuestStack](https://github.com/starseed12345/QuestStack) | Meta Quest 1 (`49845030443200410`), Quest 2 (`50670960048600150` web) | Chains GhostLock with `CVE-2021-1931` ABL downgrade to unlock the bootloader (factory-resets device) |
| [gbl_root_canoe](https://github.com/SuperTurtleDev/gbl_root_canoe) | GBL / UEFI Android boot chain | Boot-chain / GBL-level unlock and root research |
| [qualcomm_avb_exploit_poc](https://github.com/atlas4381/qualcomm_avb_exploit_poc) / [qualcomm_noavb_exploit_common](https://github.com/kasnria001/qualcomm_noavb_exploit_common) | Qualcomm (`NO_AVB`, archived) | Qualcomm AVB bypass PoC and helper framework for qualifying unverified boot chains |
| [oppo-mtk-fastboot-unlock](https://github.com/Shocked-Cat/oppo-mtk-fastboot-unlock) | MediaTek OPPO / OPlus | Unlocks fastboot on susceptible MediaTek OPPO models |
| [kaeru](https://github.com/R0rt1z2/kaeru) / [fenrir](https://github.com/R0rt1z2/fenrir) | MediaTek (`lk` / preloader) | `kaeru` spoofs unlock state / bypasses boot checks on supported MTK chains; `fenrir` was archived and deprecated in September 2026 |
| [mtkclient](https://github.com/bkerler/mtkclient) | MediaTek BROM / preloader | Low-level BROM/EDL dump, flash, and bootloader unlock utility |

</details><br>

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

Full uncollapsed compatibility tables, status labels, not-recommended entries, and risk-reduction rules live on [Modules and Apps](modules/index.md):

- [Module list](modules/index.md#module-list): Metamodules, Zygisk providers, Xposed forks, hiding, audio, performance, and system patches.
- [App list](modules/index.md#app-list): Root apps and Xposed modules for ad blocking, HyperOS, One UI, backup, and networking.
- [Not recommended](modules/index.md#not-recommended): Modules and tools with reported bootloop or hardbrick risk on locked bootloaders.
- [Reducing module risk](modules/index.md#reducing-module-risk): One-at-a-time soft-reboot testing and recovery steps.

[Back to contents](#contents)

---

## Firmware and recovery resources

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
| [Samsung 5.4 DirtyFrag research map](https://github.com/Jean7z/temporary-root-samsung-5.4-research) | Labelled verified public facts, observed device evidence, and open hypotheses for one locked SM-G998U 5.4-qgki build; separates the upstream `MSG_SPLICE_PAGES` limit from a hardened fork observation |
| [ExtractKit](https://github.com/qq2770355800/ExtractKit) | Honor/MagicOS calibration: kallsyms and struct offsets from the device's own boot image, `g<hash>`-strict profile matching, and optional `CVE-2026-98937` KASLR leak for calibration only |
| [matisse-public](https://github.com/ihamn/matisse-public) | Full source and failure log for a MediaTek MT6983 `5.10.209` late-load, including panic excerpts |
| [redmi-pad-se-87-root](https://github.com/nestchao/redmi-pad-se-87-root) | 13 ruled-out CVE routes with disassembly evidence, and why public exploits fail on 512 KB-aligned KASLR |
| [findn2-ksu-chain](https://github.com/pubglite55/findn2-ksu-chain) | Building and loading a self-compiled KernelSU module on a locked OPPO, with SELinux left Enforcing |
| [DirtyFalg-vr](https://github.com/DONGDERS/DirtyFalg-vr) | vivo `vr.ko` tracepoint disarming and `libvrext.so` boot/OTA offset extraction for DirtyFrag |
| [V4bel InfinityCore](https://github.com/V4bel/InfinityCore) | Disclosure of `CVE-2026-98260` (POSIX CPU timers UAF) and related Linux kernel LPEs |
| [vivo/iQOO 6.6.127 CVE-2026-98260 notes](https://github.com/janewas/cve-2026-98260-vivo-gki-research) | Porting analysis for iQOO Z10 Turbo Pro (`PD2453`, `6.6.127`) without exploit binaries |
| [Xiaomi nezha CVE-2026-98260 port](https://github.com/quyicheng03-boop/CVE-2026-98260-nezha-android) | Target-specific `CVE-2026-98260` porting notes for Xiaomi `nezha` (`OS4.0.4.0`) |
| [rootWithoutUnlockBootloaderList](https://github.com/lokey0905/rootWithoutUnlockBootloaderList/blob/main/README.en.md) | Community taxonomy of locked-bootloader root, GBL/ABL, and unlock bypass tools |
| [CVE records](https://www.cve.org/) | CVE-2026-43284, CVE-2026-43499, CVE-2026-98260, CVE-2026-64560, CVE-2026-49881, CVE-2026-98937, CVE-2025-21479, CVE-2024-31317 |

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

The one the loader documents. Samsung DirtyFrag requires diabl0w's KernelSU build. Root My Pixel expects the BakaSU manager named in its README. Root My Galaxy Next follows the flavour of the payload it resolves, and Root My Galaxy Ultra follows the backend chosen in its settings. A manager alone does not give temporary root. If a manager asks for a kernel update while the app is current, match its UAPI to the loaded driver instead of reinstalling root.

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
<summary>Click to show <strong>The manager says update required but it is the newest release</strong></summary>

<br>

That banner is a UAPI match check between the manager and the late-loaded driver, not a notice that a newer app exists. The driver is the module the loader staged for this boot, so it cannot be updated without a fresh root run, and a newer manager release can require a newer driver than the loader ships. Install a manager build whose UAPI matches the staged driver. Many loaders pin one, and KernelSU-Next publishes development manager builds in its [Build Manager CI](https://github.com/KernelSU-Next/KernelSU-Next/actions/workflows/build-manager-ci.yml) workflow. Then open the manager and confirm the backend is working before testing `su`. Re-rooting does not change the banner, a `manager-spoofed` artifact uses a different package ID, and GitHub CI artifacts expire, so prefer the loader's link or the project's own repository.

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

Contributions must cite primary sources, preserve uncertainty, and exclude credentials, personal data, proprietary firmware, and APK reuploads. Edit `README.md`, `docs/modules/index.md`, or the brand pages under `docs/devices/`, then run `bun run sync:readme`. The script generates `docs/guide.md`.

### License and disclaimer

Content is MIT licensed. Contributions are accepted under the same terms. Linked tools carry their own licenses and documentation.

This is a community-maintained index. It does not develop, audit, or guarantee the linked projects, and it is not affiliated with Google, Samsung, KernelSU, NebuSec, or any loader maintainer. Use these tools only on devices you own or have explicit permission to modify.

---

## Sources

<details>
<summary>Click to show <strong>primary sources</strong></summary>

- CVE records: [CVE-2026-98260](https://www.cve.org/CVERecord?id=CVE-2026-98260), [CVE-2026-43284](https://www.cve.org/CVERecord?id=CVE-2026-43284) ([NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-43284)), [CVE-2026-43499](https://www.cve.org/CVERecord?id=CVE-2026-43499) ([NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-43499)). KernelSU: [module guide](https://kernelsu.org/guide/module.html), [bootloop rescue](https://kernelsu.org/guide/rescue-from-bootloop.html).
- Device and profile sources: [Root My Galaxy payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads), [GhostLock App supported devices](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md), [RootMyVivo catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/catalog/devices.json), [Root My Device payloads](https://github.com/WitAqua-tools/Root-My-Device-Payloads), [Root My Device project](https://github.com/tqmane/Root-My-Device).
- Loader documentation: [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus), [GhostSam](https://github.com/snothin/GhostSam), [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy), [R0rt1z2/GhostLock branches](https://github.com/R0rt1z2/GhostLock/branches), [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4), [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17), [ghostlock-s26](https://github.com/snothin/ghostlock-s26), [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root), [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root), [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8), [redmik70pro](https://github.com/Berge520/redmik70pro), [Root My Galaxy Next](https://github.com/rushiranpise/Root-My-Galaxy-Next), [Root My Galaxy Ultra](https://github.com/xorpix/Root-My-Galaxy-Ultra), [Root My Galaxy Extended](https://github.com/igorcv88/Root-My-Galaxy-Extended), [DirtyFalg-vr](https://github.com/DONGDERS/DirtyFalg-vr), [Shark (kpgc10kai fork)](https://github.com/kpgc10kai/Shark), [Shark Releases](https://github.com/Yunnijian/Shark-Releases), [yuehong-privilege-assistant](https://github.com/qq2070006042-create/yuehong-privilege-assistant), [DFReroot](https://github.com/polygraphene/DFReroot), [LSPromise](https://github.com/LSPosed/LSPromise), [SamTimer](https://github.com/Leo141212/SamTimer), [GhostKey](https://github.com/Feiman55/CVE-2026-98260-GhostKey), [OnePlus 16 PYB110 kit](https://github.com/AzirX1337/CVE-2026-98260-OnePlus16-PYB110-Jailbreak), [HONOR Win2 BRM-AN00 port](https://github.com/sganggs/CVE-2026-98260-BRM-AN00), [CVE-2026-43499-popsicle](https://github.com/x-spy/CVE-2026-43499-popsicle), [CVE-2025-21479-FX5P](https://github.com/diyiqiuye/CVE-2025-21479-FX5P), [meizu20pro-temp-root](https://github.com/h5hg6vy8nt-hue/meizu20pro-temp-root).
- Newer loader and port sources: [GalaxyCrash](https://github.com/RemiPelloux/GalaxyCrash), [SamsungRootKit](https://github.com/shangu2003/SamsungRootKit), [Samsung Root Managers](https://github.com/thecaticorn01/Samsung-Root-Managers), [root-my-s23](https://github.com/zxsos/root-my-s23), [Time-My-Galaxy](https://github.com/MocLG/Time-My-Galaxy), [galaxyxr-root](https://github.com/booinspace/galaxyxr-root), [KsuLateLoad](https://github.com/NanoTurtle1145/KsuLateLoad), [ExtractKit](https://github.com/qq2770355800/ExtractKit), [GhostLock-HonorFne](https://github.com/MSEDGE-CORE/GhostLock-HonorFne), [GhostLock-Honor90-REA-AN00](https://github.com/anVzdGFtb25/GhostLock-Honor90-REA-AN00), [honor90-ghostlock](https://github.com/cyrrp/honor90-ghostlock), [magic5-one-click-root](https://github.com/Sakuramoe233/magic5-one-click-root), [honor-ldy-an00-ghostlock](https://github.com/iodn/honor-ldy-an00-ghostlock), [CVE-2026-98260 MagicPad3](https://github.com/woshigenm/CVE-2026-98260), [honor-pad9-ghostlock](https://github.com/vexpaer/honor-pad9-ghostlock), [HOneClick](https://github.com/superboyyy/HOneClick), [GhostLock-P50Pro-JAD-AL00](https://github.com/anVzdGFtb25/GhostLock-P50Pro-JAD-AL00), [GhostLock-MatePad11](https://github.com/natsuu233/GhostLock-MatePad11), [oppo-jailbreak](https://github.com/tw0m8/oppo-jailbreak), [findn2-ksu-chain](https://github.com/pubglite55/findn2-ksu-chain), [CVE-2026-98260-OPD2405](https://github.com/Yunxi422/CVE-2026-98260-OPD2405), [cve-2026-64560-rmx6699](https://github.com/totsiaw/cve-2026-64560-rmx6699), [Shark-Moto](https://github.com/CYB3R0ID694/Shark-Moto), [CVE-2026-98260-Xiaomi-17-Pro-Max](https://github.com/starriv/CVE-2026-98260-Xiaomi-17-Pro-Max), [xring-CVE-2026-98260-OS4.0](https://github.com/ChaYeWuu/xring-CVE-2026-98260-OS4.0), [K80Pro-miro-CVE-2026-98260](https://github.com/RMDycz/K80Pro-miro-CVE-2026-98260), [fuxi-temp-root](https://github.com/realskyrin/fuxi-temp-root), [matisse-public](https://github.com/ihamn/matisse-public), [redmi-k50-temp-root](https://github.com/noctide/redmi-k50-temp-root), [redmi-pad-se-87-root](https://github.com/nestchao/redmi-pad-se-87-root), [REDMI_Root](https://github.com/d16ug-a1l/REDMI_Root), [lapis-mt6878-root](https://github.com/idk12345-desigh/lapis-mt6878-root), [lapisroot](https://github.com/nekounknown/lapisroot), [CVE-2026-98260-Asteroids](https://github.com/arkylin/CVE-2026-98260-Asteroids), [MT6989-ghostlock](https://github.com/MaheshSharan/MT6989-ghostlock), [cve-2026-98260-vivo-x200-ultra-temproot](https://github.com/aoxzh/cve-2026-98260-vivo-x200-ultra-temproot), [infinitylock-app](https://github.com/kailashrs/infinitylock-app), [iqoo-neo9-ghostlock-pc](https://github.com/AuroraMythweaver/iqoo-neo9-ghostlock-pc), [iqoo-z6-temp-root](https://github.com/bxffhss/iqoo-z6-temp-root), [cve-2025-21479_iqooneo7speed](https://github.com/longg66/cve-2025-21479_iqooneo7speed), [pd2301-dirtyfrag-root](https://github.com/nemoiwkryang/pd2301-dirtyfrag-root), [RootMyZ9Turbo](https://github.com/Yukaneko520/RootMyZ9Turbo), [cve-2026-98260-tb710fu](https://github.com/aoxzh/cve-2026-98260-tb710fu), [tb320fc-temp-root](https://github.com/armyja/tb320fc-temp-root), [xperia1vi-root](https://github.com/RetributionByRevenue/xperia1vi-root), [zenfone9-root](https://github.com/RamenFast/zenfone9-root), [make-it-root](https://github.com/DarkDevil-937/make-it-root), [ghostlock-firetv-tank](https://github.com/Anezium/ghostlock-firetv-tank), [humane-aipin-ghostlock](https://github.com/TheAndersMadsen/humane-aipin-ghostlock), [CVE-2026-98260-Motorola](https://github.com/BKV0369/CVE-2026-98260-Motorola).
- Research, managers, and boot-chain references: [SukiSU Nova](https://github.com/SukiSU-Nova/SukiSU-Nova), [V4bel InfinityCore](https://github.com/V4bel/InfinityCore), [TLPE](https://github.com/Supersonic/TLPE), [cheese](https://github.com/zhuowei/cheese), [QuestStack](https://github.com/starseed12345/QuestStack), [gbl_root_canoe](https://github.com/SuperTurtleDev/gbl_root_canoe).
- Manager version matching: [KernelSU-Next UAPI check](https://github.com/KernelSU-Next/KernelSU-Next/commit/e1f4fec), [Build Manager CI](https://github.com/KernelSU-Next/KernelSU-Next/actions/workflows/build-manager-ci.yml), [Root My Galaxy Ultra manager table](https://github.com/xorpix/Root-My-Galaxy-Ultra#backends-and-manager-apps).
- Module/app compatibility: community lists from r/androidroot and r/HyperOS, and the [XDA testing thread](https://xdaforums.com/t/list-of-modules-working-on-temporal-root.4796105/).
- Maintainer reports: [Redmi Note 13 4G (sapphire), DirtyFrag](https://github.com/fynks/awesome-temporary-root/issues/9#issuecomment-6871968996), [NeoZygisk confirmation](https://github.com/fynks/awesome-temporary-root/pull/10).
- Update checks: [DirtyFrag v1.18](https://github.com/mitschud/DirtyFrag/releases/tag/v1.18), [Root My Galaxy v0.2.65](https://github.com/BuSung-dev/Root-My-Galaxy/releases/tag/v0.2.65), [Root My Galaxy Next ci-1.0-59](https://github.com/rushiranpise/Root-My-Galaxy-Next/releases), [Root My Galaxy Extended v0.3.104](https://github.com/igorcv88/Root-My-Galaxy-Extended/releases/tag/v0.3.104), [RootMyS24 v3.7.0-alpha.2](https://github.com/NanoTurtle1145/root-my-s24/releases/tag/v3.7.0-alpha.2), [Root My Pixel v1.5](https://github.com/alex193a/Root-My-Pixel/releases/tag/v1.5), [DFRoot v4.7](https://github.com/diabl0w/DFRoot/releases/tag/v4.7), [UniRoot v5.0.0](https://github.com/kuuky29/UniRoot/releases/tag/v5.0.0), [DFReroot v2.2.0](https://github.com/polygraphene/DFReroot/releases/tag/v2.2.0), [Shark v2.5.1-en.6](https://github.com/kpgc10kai/Shark/releases/tag/v2.5.1-en.6), [Shark v2.6.26](https://github.com/Yunnijian/Shark-Releases/releases/tag/v2.6.26), [DirtyFalg-vr v1.16-vr.2](https://github.com/DONGDERS/DirtyFalg-vr/releases/tag/v1.16-vr.2), [RootMyVivo 1.4.3](https://github.com/zenyxx-xd/RootMyVivo/releases/tag/1.4.3) (latest stable; newer `1.5.0-beta24` is a prerelease), [Root My Galaxy Ultra 1.4.5](https://github.com/xorpix/Root-My-Galaxy-Ultra/releases/tag/1.4.5), [TimerRoot `timer-p7a` beta](https://github.com/MVN123123123123123/TimerRoot/releases/tag/beta) (tag 2026-11-15, assets refreshed 2026-11-24, active work on unmerged `beta-test`), [RootMyS24 supported firmware](https://github.com/NanoTurtle1145/root-my-s24#支持设备), [ANB Root v2.4.0](https://github.com/Chuniex-0631/honor-anb-an00-root/releases/tag/v2.4.0), [HMA late-load issue #130](https://github.com/frknkrc44/HMA-OSS/issues/130).
- Background: [awesome-android-root](https://github.com/awesome-android-root/awesome-android-root), [NebuSec IonStack](https://github.com/NebuSec/CyberMeowfia/tree/main/IonStack/CVE-2026-43499), [Samsung 5.4 DirtyFrag research map](https://github.com/Jean7z/temporary-root-samsung-5.4-research).

</details>
