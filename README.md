<div align="center">

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/public/images/ghost-light.svg">
  <source media="(prefers-color-scheme: dark)" srcset="docs/public/images/ghost-dark.svg">
  <img src="docs/public/images/ghost-light.svg" alt="Awesome Temporary Root ghost logo: a ghost silhouette with a hash symbol cut out of its body" width="96" height="96">
</picture>

# Awesome Temporary Root

**Temporary root on a locked Android bootloader, one boot at a time.**

Curated compatibility index for DirtyFrag, GhostLock, Adreno GPU loaders, KernelSU late-load managers, and runtime modules.

<!-- web-app-link:start -->
<h3><a href="https://awesome-temporary-root.pages.dev">Open the Web App (awesome-temporary-root.pages.dev)</a></h3>
<p>Search devices, browse uncollapsed hardware and module tables, and read offline.</p>
<!-- web-app-link:end -->

[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)
<!-- web-app-link:start -->
[![Web App](https://img.shields.io/badge/web_app-awesome--temporary--root.pages.dev-0f766e?style=flat-square)](https://awesome-temporary-root.pages.dev)
<!-- web-app-link:end -->
[![Kernels](https://img.shields.io/badge/kernels-4.9--6.12-informational?style=flat-square)](#supported-devices)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/fynks/awesome-temporary-root?style=flat-square)](https://github.com/fynks/awesome-temporary-root/stargazers)

**[Supported devices](docs/devices/index.md)** · **[Tools and managers](#tools-and-managers)** · **[Modules and apps](docs/modules/index.md)** · **[Quick start](#quick-start)** · **[FAQ](#troubleshooting-and-faq)**

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

Status shows who reported the result and what happened. Each device page includes the status definitions table. A generated profile is not a confirmed target. Check the loader's live table before running. A newer release does not inherit an older result.

Match the full kernel release your phone reports. Two phones on the same Android release can differ in kernel build, page size, and vendor hardening, so a partial match is not enough. If a kernel or tool version is missing, treat it as unknown.

### Browse by brand

Device tables, status definitions, and per-brand compatibility notes live on dedicated pages:

| Brand / group | Loaders |
| --- | --- |
| [Samsung Galaxy](docs/devices/samsung.md) | Root My Galaxy, RootMyS24, GhostSam, UniRoot, ghostlock-a17, SM-A166W port |
| [Google Pixel](docs/devices/pixel.md) | Root My Pixel, TimerRoot |
| [OnePlus](docs/devices/oneplus.md) | ghostlock-oneplus, Anchor, Root My Device (tqmane) |
| [OPPO](docs/devices/oppo.md) | ghostlock-oneplus, Root My Device (Witaqua) |
| [Realme](docs/devices/realme.md) | ghostlock-rmx5085, DirtyFrag |
| [vivo and iQOO](docs/devices/vivo.md) | RootMyVivo, GhostLock-X200, DirtyFrag, DFRoot, iQOO Z9 / vivo T3 port, Adreno port |
| [Xiaomi and Redmi](docs/devices/xiaomi.md) | ghostlock-oneplus, Root My Device (Witaqua), DirtyFrag, GhostLock App, DFRoot |
| [ASUS](docs/devices/asus.md) | zenfone9-ghostlock |
| [Nothing](docs/devices/nothing.md) | Root My Device (tqmane) |
| [Honor](docs/devices/honor.md) | ANB Root, MnemosyneLab/ghostlock-honor |
| [HMD and Nokia](docs/devices/nokia.md) | DFRoot |
| [Amazon, NVIDIA, Meta, and TCL](docs/devices/other.md) | R0rt1z2/GhostLock, GhostLock NVIDIA Shield, Root My Device (Witaqua) |

See the [Supported Devices overview](docs/devices/index.md) for all brand pages in one index.

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
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) | vivo and iQOO | [Catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/catalog/devices.json) |
| [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) | Galaxy S24/S24 Ultra, Z Flip6, China Z Fold6 | [Verified and pending firmware lists](https://github.com/NanoTurtle1145/root-my-s24#支持设备) |
| [R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock) | Amazon Fire devices, TCL T653T02 | [5.10 branch](https://github.com/R0rt1z2/GhostLock/tree/5.10), [Fire build threads](https://github.com/R0rt1z2/GhostLock/tree/5.10#readme), [5.15 TCL profiles](https://github.com/R0rt1z2/GhostLock/tree/5.15) |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) | Multi-brand `uname -r` profiles | [Profile list](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) |

[Back to contents](#contents)

---

## Tools and managers

A temporary root setup needs a loader, a KernelSU-compatible manager, and whatever transport the loader uses. Some apps bundle all three.

### Exploit loaders and device-specific ports

| Tool / latest version | Method | Coverage / note |
| --- | --- | --- |
| [DirtyFrag](https://github.com/mitschud/DirtyFrag) / [Latest version](https://github.com/mitschud/DirtyFrag/releases) | DirtyFrag | Samsung-focused; other vulnerable devices/KMIs may work, on-device; no Shizuku required |
| [DFRoot](https://github.com/diabl0w/DFRoot) / [Latest version](https://github.com/diabl0w/DFRoot/releases) | DirtyFrag | Broad, manager-agnostic, on-device |
| [UniRoot](https://github.com/kuuky29/UniRoot) / [Latest version](https://github.com/kuuky29/UniRoot/releases) | DirtyFrag + GhostLock | Samsung Galaxy, on-device; DirtyFrag (fast) and classic GhostLock profiles; Galaxy A15 4G confirmed |
| [GhostSam](https://github.com/MocLG/GhostSam) / [Latest version](https://github.com/MocLG/GhostSam/tags) | Both | Galaxy S22, S26, Z Fold8, ADB |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) / [Latest version](https://github.com/YuKongA/ghostlock-app/tags) | GhostLock | Multi-brand `uname -r` profiles, on-device/Shizuku<br>User-reported success on the Redmi Note 14 4G with v1.2 |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) / [Latest version](https://github.com/BuSung-dev/Root-My-Galaxy/releases) | GhostLock | Selected Galaxy builds, on-device/Shizuku |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) / [Latest version](https://github.com/alex193a/Root-My-Pixel/releases) | GhostLock | Pixel 6 to 11, Shizuku; retries common |
| [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) / [Latest version](https://github.com/MVN123123123123123/TimerRoot/releases) | 98260 UAF | Pixel 6 to 11 and selected Xiaomi/Redmi kernels, Shizuku; exact `uname -r` and page size required |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) / [Latest version](https://github.com/zenyxx-xd/RootMyVivo/releases) | GhostLock + DirtyFrag | vivo/iQOO GhostLock and DirtyFrag targets, Shizuku/ADB |
| [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) / [Latest version](https://github.com/WitAqua-tools/Root-My-Device/releases) | GhostLock | Xiaomi 17T Pro, 14T Japan, Quest 3, on-device |
| [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) / [Latest version](https://github.com/tqmane/Root-My-Device/releases) | GhostLock | Nothing Phone (3a), OnePlus Pad 3, Shizuku |
| [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) / [Latest version](https://github.com/NanoTurtle1145/root-my-s24/releases) | GhostLock + 98260 UAF | Selected Galaxy S24/S24 Ultra, Z Flip6, Z Fold6 CN builds, Shizuku/ADB; see exact target notes |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) / [Latest version](https://github.com/wxxsfxyzm/GhostLock-Galaxy/commits/main) | GhostLock | Galaxy Z Fold6 SM-F9560, ADB/Shizuku |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) / [Latest version](https://github.com/JoinChang/ghostlock-oneplus/commits/main) | GhostLock | OnePlus, Xiaomi, OPPO, ADB |
| [GhostLock-for-OnePlus](https://github.com/p2p3p/GhostLock-for-OnePlus) / [Latest version](https://github.com/p2p3p/GhostLock-for-OnePlus/tags) | GhostLock | Ace 6T, OnePlus 15 PLK110, ADB |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) / [Latest version](https://github.com/mobilehackinglab/ghostlock-a17/commits/main) | GhostLock | Galaxy A17 SM-A175F, ADB; shell only |
| [R0rt1z2/GhostLock](https://github.com/R0rt1z2/GhostLock) / [Latest version](https://github.com/R0rt1z2/GhostLock/branches) | GhostLock | Amazon Fire devices and TCL T653T02, ADB; choose the exact kernel branch |
| [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4) / [Latest version](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4/releases) | GhostLock | Shield TV Pro 2019, ADB; no `su` |
| [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8) / [Latest version](https://github.com/Qingizi7/cve-2025-21479_iqooneo8/commits/main) | Adreno GPU | iQOO Neo8 SM8475 on `5.10.198`, ADB; pre-Jun-2025 GPU |
| [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root) / [Latest version](https://github.com/xiaohj233/ghostlock-x200-root/releases) | GhostLock | vivo X200 PD2415 b57, PC or companion app |
| MT6989-ghostlock<br>Unavailable | GhostLock | Historical vivo T3 Ultra V2426 target; repository unavailable |
| [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root) / [Latest version](https://github.com/Chuniex-0631/honor-anb-an00-root/releases) | GhostLock | HONOR 80 Pro Flat ANB-AN00, Shizuku; single MagicOS build; signing-key migration |
| [Redmi K70 Pro temp root](https://github.com/Berge520/redmik70pro) / [Latest version](https://github.com/Berge520/redmik70pro/releases) | MIUI service | Redmi K70 Pro (manet), HyperOS 3/Android 16, PC + ADB/fastboot |
| [ghostlock-s26](https://github.com/snothin/ghostlock-s26) / [Latest version](https://github.com/snothin/ghostlock-s26/releases) | GhostLock | Galaxy S26 series, ADB; merged into GhostSam |
| [IonStackQuest3](https://github.com/F-19-F/IonStackQuest3) / [Latest version](https://github.com/F-19-F/IonStackQuest3/releases) | GhostLock | Quest 3 listed incrementals, ADB; newer builds patched |
| [DirtyInit](https://github.com/combeng6th/DirtyInit) / [Latest version](https://github.com/combeng6th/DirtyInit/releases) | DirtyFrag | Samsung devices with the page-cache write bug, ADB; not KernelSU |

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

Full uncollapsed compatibility tables, status labels, not-recommended entries, and risk-reduction rules live on [Modules and Apps](docs/modules/index.md):

- [Module list](docs/modules/index.md#module-list): Metamodules, Zygisk providers, Xposed forks, hiding, audio, performance, and system patches.
- [App list](docs/modules/index.md#app-list): Root apps and Xposed modules for ad blocking, HyperOS, One UI, backup, and networking.
- [Not recommended](docs/modules/index.md#not-recommended): Modules and tools with reported bootloop or hardbrick risk on locked bootloaders.
- [Reducing module risk](docs/modules/index.md#reducing-module-risk): One-at-a-time soft-reboot testing and recovery steps.

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

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request. Use the concise device-report, module-report, or correction template.

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
- Loader documentation: [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus), [GhostSam](https://github.com/MocLG/GhostSam), [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy), [R0rt1z2/GhostLock branches](https://github.com/R0rt1z2/GhostLock/branches), [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4), [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17), [ghostlock-s26](https://github.com/snothin/ghostlock-s26), [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root), [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root), [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8), [redmik70pro](https://github.com/Berge520/redmik70pro).
- Module/app compatibility: community lists from r/androidroot and r/HyperOS, the [Temporal Root Modules List](https://github.com/rushiranpise/temporal-root-modules-list), and the [XDA testing thread](https://xdaforums.com/t/list-of-modules-working-on-temporal-root.4796105/).
- Maintainer reports: [Redmi Note 13 4G (sapphire), DirtyFrag](https://github.com/fynks/awesome-temporary-root/issues/9#issuecomment-6871968996), [NeoZygisk confirmation](https://github.com/fynks/awesome-temporary-root/pull/10).
- Update checks: [DirtyFrag v1.17](https://github.com/mitschud/DirtyFrag/releases/tag/v1.17), [RootMyVivo 1.4.3](https://github.com/zenyxx-xd/RootMyVivo/releases/tag/1.4.3), [RootMyS24 supported firmware](https://github.com/NanoTurtle1145/root-my-s24#支持设备), [ANB Root v2.4.0](https://github.com/Chuniex-0631/honor-anb-an00-root/releases/tag/v2.4.0), [HMA late-load issue #130](https://github.com/frknkrc44/HMA-OSS/issues/130).
- Background: [awesome-android-root](https://github.com/awesome-android-root/awesome-android-root), [NebuSec IonStack](https://github.com/NebuSec/CyberMeowfia/tree/main/IonStack/CVE-2026-43499).

</details>