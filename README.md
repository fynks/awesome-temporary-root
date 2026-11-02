<div align="center">

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/public/images/ghost-light.svg">
  <source media="(prefers-color-scheme: dark)" srcset="docs/public/images/ghost-dark.svg">
  <img src="docs/public/images/ghost-light.svg" alt="Awesome Temporary Root ghost logo: a ghost silhouette with a hash symbol cut out of its body" width="112" height="112">
</picture>

# Awesome Temporary Root

Root access on a locked Android bootloader, for one boot at a time.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Listed targets](https://img.shields.io/badge/listed_targets-62-brightgreen?style=flat-square)](#supported-devices)
[![Kernels](https://img.shields.io/badge/kernels-4.9--6.12-informational?style=flat-square)](#supported-devices)
[![GitHub stars](https://img.shields.io/github/stars/fynks/awesome-temporary-root?style=flat-square)](https://github.com/fynks/awesome-temporary-root/stargazers)

[Devices](#supported-devices) · [Live tables](#live-upstream-tables) · [Tools](#tools-and-managers) · [Modules](#modules) · [Quick start](#quick-start) · [Troubleshooting](#troubleshooting-and-faq) · [Contributing](#contributing-and-disclaimer)

<sub>Verified against upstream projects and CVE records in November 2026. Hardware-confirmed targets only.</sub>

</div>

## Contents

- [What is temporary root?](#what-is-temporary-root)
- [Supported devices](#supported-devices)
  - [Samsung Galaxy](#samsung-galaxy)
  - [Google Pixel](#google-pixel)
  - [OnePlus, OPPO, and Realme](#oneplus-oppo-and-realme)
  - [vivo and iQOO](#vivo-and-iqoo)
  - [Xiaomi, ASUS, Nothing, and Honor](#xiaomi-asus-nothing-and-honor)
  - [Amazon, NVIDIA, Meta](#amazon-nvidia-meta)
  - [Live upstream tables](#live-upstream-tables)
- [Tools and managers](#tools-and-managers)
- [Modules](#modules)
- [Quick start](#quick-start)
- [Troubleshooting and FAQ](#troubleshooting-and-faq)
- [Contributing and disclaimer](#contributing-and-disclaimer)
- [Sources](#sources)

> [!TIP]
> New here? Read [What is temporary root?](#what-is-temporary-root) first, find your exact model in [Supported devices](#supported-devices), then follow [Quick start](#quick-start). If your build is not listed, do not try the closest one.

---

## What is temporary root?

Temporary root gives an app or an ADB shell UID 0 on the current boot without unlocking the bootloader or flashing a boot image. A loader exploits a kernel bug, starts a root daemon, and late-loads a KernelSU kernel module. A KernelSU-compatible manager can then grant `su`. A full reboot unloads the module and ends the session.

The loader that works depends on the device, its firmware build, and its kernel. Match all three.

<details>
<summary>Click to show <strong>how the loaders work</strong></summary>

<br>

The loaders use one of these kernel bugs:

- **DirtyFrag (CVE-2026-43284)**: a page-cache write reached through ESP-in-UDP decryption. It is deterministic: a run either works or stops with an error. The loader needs a kernel module built for the device's KMI.
- **GhostLock (CVE-2026-43499)**: a futex priority-inheritance use-after-free turned into a controlled kernel write. It is a race, so retries and kernel panics are normal, and a working payload is tied to the exact kernel layout.
- **Adreno GPU route (CVE-2025-21479)**: a GPU command-packet defect that lets the GPU overwrite its own page tables for physical read/write. RootMyVivo ships it for older 5.10/5.15 Snapdragon 8-class vivo and iQOO devices whose GPU firmware predates Qualcomm's June 2025 fix.

A few ports use other device-specific routes, such as a vendor service on MIUI or Honor, or a fastboot-issued permissive command line. Their table row says so.

CVE records give these patch floors. DirtyFrag and GhostLock affect older branches than the ones listed.

| Kernel branch | DirtyFrag fixed in | GhostLock fixed in |
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

**It enables:**

- `su` for apps you approve, through a KernelSU-compatible manager.
- A root shell while the bootloader stays locked and the boot image stays stock.
- Modules that mount files or hook apps at runtime, for the current boot.
- A session that leaves the verified-boot chain, the stock kernel, and the recovery partitions untouched.

**It does not:**

- Survive a full reboot.
- Unlock the bootloader or allow unsigned images, custom ROMs, kernels, or recoveries.
- Run modules that need to start before Android, replace boot scripts, or write a partition.
- Guarantee Play Integrity, banking apps, or recovery from a bad module.
- Cover every device. A profile is built for a specific model and kernel layout.

A **soft reboot** restarts Android's interface and system services, not the kernel, so root and module mounts stay. A **full reboot** loads the stock kernel again and clears root. Files under `/data/adb` can remain, but nothing loads them. Do not delete that directory to "unroot": it also holds ADB keys and data other tools rely on.

**Related but different:** Shizuku runs a service as the shell user through ADB and is not root, though several loaders use it as a transport. `adb root` works only on builds that allow it. Virtual-root apps (dual-space and parallel-space tools) sandbox selected apps and never grant UID 0. Magisk, KernelSU, and APatch boot-image installs are permanent and need an unlocked bootloader. KernelSU's late-load mode is a component of temporary root, not a root method by itself.

> [!WARNING]
> Temporary root is full root for the session, delivered by privilege-escalation code running in the kernel. A wrong profile or a lost race can panic the device, an incompatible module can bootloop it, and a partition write can make it unbootable. Verify the exact model, firmware build, and `uname -r` against the upstream project before running a loader, and back up data you cannot lose. Only use hardware you own or have explicit permission to modify.

---

## Supported devices

Only targets with a documented hardware run are listed, with the exact build and kernel the loader matches. A generated profile or an upstream candidate is not a confirmed target.

| Status | Meaning |
| --- | --- |
| <kbd>Tested</kbd> | A completed run on that exact target, including the full temporary-root chain where the loader provides one. |
| <kbd>Experimental</kbd> | A partial, shell-only, or explicitly experimental hardware run. |

Match the full kernel release your phone reports. Two phones on the same Android release can differ in kernel build, page size, and vendor hardening, so a partial match is not enough.

### Samsung Galaxy

[Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) is the main loader and ships per-build payloads matched on model plus kernel. GhostLock-Galaxy, the A17 and A16 ports, GhostSam, and RootMyS24 cover builds outside its list.

<details>
<summary>Click to show <strong>21 confirmed Samsung targets</strong></summary>

<br>

| Device | Model | Build or kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| Galaxy S25, S25+, S25 Ultra, S25 Edge | SM-S9310/B/N/Q/U/U1/W/Z, SM-S936B/N/U/U1/W, SM-S937B/N/U/U1/W, SM-S9380/B/N/Q/U/U1/W/Z, SC-51F, SCG31, SC-52F, SCG32 | `6.6.98` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy S25+ China | SM-S9360 | `S9360ZCSCCZG1`, `6.6.98` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy S25 Edge China | SM-S9370 | `S9370ZCS9CZG1`, `6.6.98` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy S24 Ultra (US) | SM-S928U1 | `S928USQS6DZF2`, `6.1.145` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy S24 Ultra International | SM-S928B | `S928BXXS6DZF2`, `6.1.145` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy S24 Ultra China | SM-S9280 | `S9280ZCS6DZF2`, `6.1.145` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy S24+ | SM-S926B | `S926BXXUEDZDR`, `6.1.157` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy S23 Ultra | SM-S918B | `S918BXXSAFZF5`, `5.15.189` | Root My Galaxy (Shizuku mode) | <kbd>Tested</kbd> |
| Galaxy S23+ | SM-S916B | `S916BXXSAFZG1`, `5.15.189` | Root My Galaxy (shell-only profile) | <kbd>Experimental</kbd> |
| Galaxy A56 5G | SM-A566E | `A566EXXSCCZG6`, `6.6.102` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy A36 5G | SM-A366W | `A366WVLS3AYG1`, `6.6.46` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy A53 5G | SM-A536E | `A536EXXSNGZG3`, `5.10.237` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy Tab S9 (Wi-Fi) | SM-X710 | `X710XXS6EZF1`, `5.15.189` | Root My Galaxy | <kbd>Tested</kbd> |
| Galaxy A17 | SM-A175F | `A175FXXS3BZA5` (`6.12.23`), `A175FXXS6CZG1` (`6.12.38`) | [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) | <kbd>Tested</kbd> |
| Galaxy A16 5G | SM-A166W | `A166WVLS8DZG1`, `5.15.189-android13-3-33503169` | [SM-A166W port](https://github.com/jojobear691/SM-A166W-DZG1-Temporary-Root) | <kbd>Tested</kbd> |
| Galaxy Z Fold4 | SM-F9360 | `F9360ZCSAIZF1`, `5.10.236` | [Root My Galaxy Payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) (command line) | <kbd>Tested</kbd> |
| Galaxy Z Flip6 (Korea) | SM-F741N | `F741NKSS4DZE1`, `6.1.145` | [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) | <kbd>Tested</kbd> |
| Galaxy S24 (China) | SM-S9210 | `S9210ZCS6DZI1`, `6.1.145` | RootMyS24 | <kbd>Tested</kbd> |
| Galaxy S24+ (Taiwan) | SM-S9260 | `S9260ZHS6DZG1`, `6.1.145` | RootMyS24 | <kbd>Tested</kbd> |
| Galaxy S24 Ultra (Europe, One UI 9) | SM-S928B | `S928BXXU6EZIF`, `6.1.162` | RootMyS24 | <kbd>Tested</kbd> |
| Galaxy S26, S26+, S26 Ultra | SM-S942x, SM-S947x, SM-S948x | `6.12` (`S9420ZCS4AZG1` plus other tested builds) | [GhostSam](https://github.com/MocLG/GhostSam) / [ghostlock-s26](https://github.com/snothin/ghostlock-s26) | <kbd>Tested</kbd> |

[Live table: Root My Galaxy payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads#supported-payloads) · [targets-v3.json](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json) · [ghostlock-a17 target](https://github.com/mobilehackinglab/ghostlock-a17#target) · [SM-A166W build](https://github.com/jojobear691/SM-A166W-DZG1-Temporary-Root#exact-supported-build) · [ghostlock-s26 firmware](https://github.com/snothin/ghostlock-s26#supported-firmware)

</details><br>

<details>
<summary>Click to show <strong>compatibility notes</strong></summary>

<br>

- Galaxy S23 Ultra (`SM-S918B`) is confirmed through the app's Shizuku mode only. Galaxy S23+ (`SM-S916B`) has an ADB-shell profile and no app payload, so treat it as experimental.
- Some payloads cover more models than the test device: the S24 Ultra payload also matches `SM-S928W`, and the A56 payload matches `SM-A5660`, `SM-A566B`, `SM-A566S`, `SM-A566U1`, and `SM-A566W`.
- The shared S25 payload covers the Snapdragon variants. S25+ and S25 Edge China builds use separate payloads.
- The Z Fold4 (`SM-F9360`) chain is confirmed from the command line; its app payload is not.
- [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) covers more S24, Z Flip6, and China Z Fold6 builds, including firmware marked as untested. Root My Galaxy's target feed also lists some builds with no documented hardware run (Z Fold7, S24, S24 FE, S23, and S9180), so treat those as candidates.

</details>

---

### Google Pixel

All rows use [Root My Pixel](https://github.com/alex193a/Root-My-Pixel), which requires Shizuku. Builds are matched exactly; an OTA changes the target.

<details>
<summary>Click to show <strong>15 confirmed Pixel targets</strong></summary>

<br>

| Model | Supported build | KMI | Status |
| --- | --- | --- | --- |
| Pixel 11, 11 Pro, 11 Pro XL | `CD1A.260618.001.C2` | `android16-6.12` | <kbd>Tested</kbd> |
| Pixel 11 Pro Fold | `CD1A.260618.001.C3` | `android16-6.12` | <kbd>Tested</kbd> |
| Pixel 10, 10 Pro, 10 Pro Fold | `CP2A.260705.006` | `android15-6.6` | <kbd>Tested</kbd> |
| Pixel 10 Pro XL | `CP2A.260705.006`, `CP2A.260805.005` | `android15-6.6` | <kbd>Tested</kbd> |
| Pixel 10a | `CP2A.260705.006`, `CP2A.260805.005` | `android14-6.1` | <kbd>Tested</kbd> |
| Pixel 9, 9a | `CP2A.260705.006`; Pixel 9 also `AD1A.240905.004` | `android14-6.1` | <kbd>Tested</kbd> |
| Pixel 9 Pro, 9 Pro XL, 9 Pro Fold | `CP2A.260705.006` | `android15-6.1` | <kbd>Tested</kbd> |
| Pixel 8, 8 Pro | `CP2A.260705.006` | `android14-6.1` | <kbd>Tested</kbd> |
| Pixel 8a | `CP2A.260805.005` | `android14-6.1` | <kbd>Tested</kbd> |
| Pixel 7, 7 Pro | `CP2A.260705.006`; Pixel 7 also `BP2A.250705.008` | `android14-6.1` | <kbd>Tested</kbd> |
| Pixel 7a | `CP2A.260705.006` | `android14-6.1` | <kbd>Tested</kbd> |
| Pixel 6, 6 Pro | `CP2A.260705.006` | `android14-6.1` | <kbd>Tested</kbd> |
| Pixel 6a | `CP2A.260705.006`, `CP1A.260405.005` | `android14-6.1` | <kbd>Tested</kbd> |
| Pixel Fold | `CP2A.260605.012`, `CP2A.260705.006` | `android14-6.1` | <kbd>Tested</kbd> |
| Pixel Tablet | `BP1A.250405.007`, `CP2A.260705.006` | `android14-6.1` | <kbd>Tested</kbd> |

[Live table: Root My Pixel supported devices](https://github.com/alex193a/Root-My-Pixel#supported-devices--build-profiles)

</details><br>

Root My Pixel reports the exploit is unreliable: many users needed more than 20 attempts, and a failed attempt can reboot the phone. [GhostLock App](https://github.com/YuKongA/ghostlock-app) also has Pixel 7, 9a, 9 Pro, and 9 Pro Fold profiles, but those are candidates, not confirmed targets.

---

### OnePlus, OPPO, and Realme

[ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) is the main loader for OnePlus and OPPO builds. The OnePlus Pad 3 uses a dedicated Root My Device build, and the Realme GT 7T has its own port.

<details>
<summary>Click to show <strong>9 confirmed OnePlus, OPPO, and Realme targets</strong></summary>

<br>

| Device | Model | Build or kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| OnePlus Ace 6T | PLR110 | `6.12.38-android16-5-g8c67d4274c0a-ab14275539-4k` (ColorOS 16.0.2.403), `6.12.38-android16-5-g844001fb8721-ab14552068-4k` (16.0.8.301) | ghostlock-oneplus | <kbd>Tested</kbd> |
| OnePlus 15 | CPH2745, CPH2747, CPH2749 | `6.12.23-android16-5-gb2a876903b49-ab14541642-4k` (16.0.9.400) | ghostlock-oneplus | <kbd>Tested</kbd> |
| OnePlus 15 | PLK110 | `6.12.58` (`android16-6`, Android 17 Beta 3) | ghostlock-oneplus | <kbd>Tested</kbd> |
| OnePlus 13 | IN2060 | `6.6.89-android15-8-gf4dc45704e54-abogki446052083-4k` (16.0.2.403) | ghostlock-oneplus | <kbd>Tested</kbd> |
| OnePlus 13 | IN2060 | `6.6.89-android15-8-g97a9aaefab9a-ab14519050-4k`, `6.6.30-android15-8-g013ec21bba94-abogki383916444-4k`, `6.6.118-android15-8-g93e223c276e7-abogki500782043-4k` | [Anchor](https://github.com/byemaxx/ghostlock-anchor) | <kbd>Tested</kbd> |
| OPPO K15 Pro+ | PMG110 | `PMG110_16.0.9.400(CN01)`, `6.6.118-android15-8-g93e223c276e7-abogki500782043-4k` | [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) | <kbd>Experimental</kbd> |
| OPPO Pad 4 Pro | n/a | `6.6.89-android15-8-g096cdb6ecefc-ab14358676-4k` | ghostlock-oneplus | <kbd>Tested</kbd> |
| OnePlus Pad 3 | OPD2415 | `OPD2415_16.0.9.400(EX01)`, `6.6.118-android15-8-g2e6b9c3812c5-ab15114928-4k` | [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) | <kbd>Tested</kbd> |
| Realme GT 7T | RMX5085 | `6.6.118-android15-8` | [ghostlock-rmx5085](https://github.com/Nixbones/ghostlock-rmx5085) | <kbd>Tested</kbd> |

[Live table: ghostlock-oneplus verified devices](https://github.com/JoinChang/ghostlock-oneplus#supported-devices) · [not-feasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible) · [Root My Device OnePlus Pad 3](https://github.com/tqmane/Root-My-Device/blob/main/devices/oneplus-pad-3/README.md#supported-target)

</details><br>

<details>
<summary>Click to show <strong>compatibility notes</strong></summary>

<br>

- The PLK110 OnePlus 15 entry is the Android 17 Beta 3 kernel. A stable build with a different kernel is not covered.
- OnePlus 13 `IN2060` and OPPO Pad 4 Pro use a different root path (UMH).
- ghostlock-oneplus also has offsets for devices it has not tested, and a list of devices its layout cannot support. Check both before you try a build.

</details>

---

### vivo and iQOO

[RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) matches the full kernel release from its [payload catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/support/targets-vivo.json). Its GhostLock port accepts 6.6 kernels up to 6.6.139 and 6.1 kernels up to 6.1.144; later releases carry the fix. The catalog also has a separate Adreno route (CVE-2025-21479) for older 5.10/5.15 devices.

<details>
<summary>Click to show <strong>6 confirmed vivo and iQOO targets</strong></summary>

<br>

| Device | Model | Kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| iQOO Neo 11 | PD2520, PD2520A–E, V2520A | `6.6.89-android15-8-g1f71897ac249` | RootMyVivo | <kbd>Tested</kbd> |
| iQOO Z10 Turbo Pro | PD2453, PD2453A, V2453A | `6.6.89-android15-8-g1f71897ac249` | RootMyVivo | <kbd>Tested</kbd> |
| iQOO Z9 5G / vivo T3 5G | I2302 / V2334 | `5.15.178-android13-8-g0ebe6a5da65d` | [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock) | <kbd>Tested</kbd> |
| vivo X200 | PD2415, V2415A | `6.6.89-android15-8-gb57af212129c` (Port 16.1.12.2.W10) | [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root) / RootMyVivo | <kbd>Tested</kbd> |
| iQOO Neo8 | PD2301, V2301A | `5.10.198-gki-gfb2f5774872c` | [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8) / RootMyVivo | <kbd>Tested</kbd> |
| vivo T3 Ultra | V2426 | `5.15.197-android13-8-00040-g1d68e338760e-ab15563954` | [MT6989-ghostlock](https://github.com/MaheshSharan/MT6989-ghostlock) | <kbd>Tested</kbd> |

[Live table: RootMyVivo payload catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/support/targets-vivo.json) · [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock) · [vivo X200 device notes](https://github.com/xiaohj233/ghostlock-x200-root#支持的设备) · [vivo T3 Ultra target](https://github.com/MaheshSharan/MT6989-ghostlock#vivo-t3-ultra-jailbreak-root-ghostlock)

</details><br>

<details>
<summary>Click to show <strong>compatibility notes</strong></summary>

<br>

- The catalog also lists iQOO 13 India, iQOO Neo10 Pro, and an X200 family entry. Some entries reuse another model's payload (iQOO 13 China, Neo10 Pro+, X200 Ultra); those are mappings, not confirmed runs.
- A `6.6.127` build on an iQOO Neo 11 has the fix, so the 6.6.89 payload does not cover it.

</details>

---

### Xiaomi, ASUS, Nothing, and Honor

These devices use several independent loaders, including ghostlock-oneplus, Root My Device, zenfone9-ghostlock, and Honor ports based on GhostLock App.

<details>
<summary>Click to show <strong>7 confirmed Xiaomi, ASUS, Nothing, and Honor targets</strong></summary>

<br>

| Device | Model or codename | Build or kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| Xiaomi 17 | pudding | `OS3.0.315.0.WPCCNXM` (`6.12.23`), `6.12.69` | ghostlock-oneplus | <kbd>Tested</kbd> |
| Xiaomi 17T Pro | warhol | `OS3.0.304.0.WPSJPXM`, `6.12.38-android16-5-g1d46253471dd-ab15048002-4k` | [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) | <kbd>Tested</kbd> |
| Xiaomi 14T Japan | XIG07 | `OS3.0.7.0.WNEJPKD`, `6.1.138-android14-11-g44bda9e8f6e9-ab13792638` | [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) | <kbd>Tested</kbd> |
| ASUS Zenfone 9 | ASUS_AI2202 | `5.10.205-android12-9-00029-g3f12df86bfdb-ab11799032` | [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock) | <kbd>Tested</kbd> |
| Nothing Phone (3a) | A059 / Asteroids | `B4.1-260618-1048`, `6.1.157-android14-11-g82d681c9b06b-ab14634535` | [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) | <kbd>Tested</kbd> |
| HONOR 400 (global) | DNY-NX9 | `DNY-N39 10.0.0.213(C636E4R3P2)`, `5.15.180-android13-8-00018-g9b2308ac0ad6-ab14563692` | [MnemosyneLab/ghostlock-honor](https://github.com/MnemosyneLab/ghostlock-honor) | <kbd>Tested</kbd> |
| HONOR 80 Pro Flat | ANB-AN00 / HNANB | MagicOS `9.0.0.230` (`ANB-AN00 9.0.0.230(CHNC00E230R2P5)`), `5.10.236-android12-9-gd671cf8c2b02` | [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root) | <kbd>Tested</kbd> |

[Live list: Root My Device targets](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json) · [Nothing Phone (3a)](https://github.com/tqmane/Root-My-Device/blob/main/devices/nothing-phone-3a/README.md#supported-exact-targets) · [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock) · [ghostlock-honor scope](https://github.com/MnemosyneLab/ghostlock-honor#支持范围) · [ANB Root compatibility](https://github.com/Chuniex-0631/honor-anb-an00-root/blob/main/docs/COMPATIBILITY.md)

</details><br>

<details>
<summary>Click to show <strong>compatibility notes</strong></summary>

<br>

- The Nothing Phone (3a) build `B4.1-260810-1153` is supported upstream, but the verified run was on `B4.1-260618-1048`. Build `C5.0-260915-2123` is allowlisted but its root flow is not verified.
- GhostLock App has profiles for many Xiaomi, POCO, Redmi, Meizu, Sony, Motorola, Honor, and other devices. Those are candidates, not confirmed runs. Its [MediaTek guide](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/MEDIATEK.md) covers MT devices that miss the default target.
- The POCO M6 Pro 4G and Meizu 21 ports have no upstream support table, so they are not listed as confirmed targets.

</details>

---

### Amazon, NVIDIA, Meta

GhostLock-5.10 covers the Fire devices, while the Shield TV and Quest 3 have dedicated ports.

<details>
<summary>Click to show <strong>4 confirmed Amazon, NVIDIA, and Meta targets</strong></summary>

<br>

| Device | Codename | Build or kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| Amazon Fire Max 11 | sunstone | Fire OS 8.3.3.8 `RS8338.3339N`, `5.10` | [GhostLock-5.10](https://github.com/R0rt1z2/GhostLock) | <kbd>Tested</kbd> |
| Fire TV Stick 4K Max (2023) | karat | Fire OS 8.1.8.2 `RS8182.3811N`, `5.10` | [GhostLock-5.10](https://github.com/R0rt1z2/GhostLock) | <kbd>Tested</kbd> |
| NVIDIA Shield TV Pro 2019 | mdarcy | Shield Experience 9.2.4, `4.9.141-tegra-gb6e5605a` | [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4) | <kbd>Tested</kbd> |
| Meta Quest 3 | eureka | `5.10.240-g55be3759aea4`, incremental `52345320035400520` | [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) | <kbd>Tested</kbd> |

[Live table: GhostLock-5.10 supported builds](https://github.com/R0rt1z2/GhostLock#supported-devices) · [NVIDIA Shield validated target](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4#validated-target) · [Root My Device targets](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json)

</details><br>

<details>
<summary>Click to show <strong>compatibility notes</strong></summary>

<br>

- GhostLock-5.10 also supports older Fire OS builds; its table lists each build and kernel.
- The Shield port gives root to the live ADB daemon instead of installing a manager. Root survives ADB disconnects but not an ADB restart, and the included app re-runs the exploit at boot.
- Meta fixed GhostLock in Quest 3 incremental `52345320040100520` and Quest 3S incremental `3697600032300610`. Later builds are not vulnerable. IonStackQuest3's own target is incremental `52168470043600520`.

</details>

---

### Live upstream tables

These tables are maintained upstream and change more often than this README. Check your exact model, build, and `uname -r`. If they differ from this page, the upstream table wins.

| Project | Devices | Live support data |
| --- | --- | --- |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) | Samsung Galaxy | [Payload list](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads#supported-payloads) · [JSON](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads/blob/main/support/targets-v3.json) |
| [GhostSam](https://github.com/MocLG/GhostSam) | Galaxy S22, S26, Z Fold8 | [Device list](https://github.com/MocLG/GhostSam#supported-devices) |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | Galaxy Z Fold6 | [Kernel list](https://github.com/wxxsfxyzm/GhostLock-Galaxy#registered-kernel-profiles) |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) | Galaxy A17 | [Target list](https://github.com/mobilehackinglab/ghostlock-a17#target) |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) | Pixel 6–11 | [Build list](https://github.com/alex193a/Root-My-Pixel#supported-devices--build-profiles) |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) | OnePlus, OPPO, Xiaomi | [Verified list](https://github.com/JoinChang/ghostlock-oneplus#supported-devices) · [Infeasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible) |
| [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) | Nothing Phone (3a), OnePlus Pad 3 | [Nothing list](https://github.com/tqmane/Root-My-Device/blob/main/devices/nothing-phone-3a/README.md#supported-exact-targets) · [Pad 3 list](https://github.com/tqmane/Root-My-Device/blob/main/devices/oneplus-pad-3/README.md#supported-target) |
| [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) | Xiaomi, OPPO, and Meta Quest | [Target list](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json) · [Notes](https://github.com/WitAqua-tools/Root-My-Device-Payloads#supported-targets) |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) | vivo and iQOO | [Target list](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/support/targets-vivo.json) |
| [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) | Galaxy S24, Z Flip6, Z Fold6 China builds | [Verified and pending firmware lists](https://github.com/NanoTurtle1145/root-my-s24#支持设备) |
| [GhostLock-5.10](https://github.com/R0rt1z2/GhostLock) | Fire Max 11, Fire TV Stick 4K Max | [Build list](https://github.com/R0rt1z2/GhostLock#supported-devices) |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) | Multi-brand `uname -r` profiles | [Profile list](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) |

[↑ Back to contents](#contents)

---

## Tools and managers

A temporary root setup needs a loader, a KernelSU-compatible manager, and whatever transport the loader uses. Some apps bundle all three.

### Exploit loaders and device-specific ports

| Tool | Method | Coverage | Latest | Notes |
| --- | --- | --- | --- | --- |
| [DirtyFrag](https://github.com/mitschud/DirtyFrag) | DirtyFrag | Samsung and other KMIs the app ships modules for | [![latest release](https://img.shields.io/github/v/release/mitschud/DirtyFrag?style=flat-square)](https://github.com/mitschud/DirtyFrag/releases) | On-device. Hardened DFRoot fork. Module toggle, autorun with a failed-run interlock, automatic soft reboot, partition protection, download-mode indicator, and a recovery writer for Samsung download mode |
| [DFRoot](https://github.com/diabl0w/DFRoot) | DirtyFrag | Broad; manager-agnostic | [![latest release](https://img.shields.io/github/v/release/diabl0w/DFRoot?style=flat-square)](https://github.com/diabl0w/DFRoot/releases) | On-device. Minimal upstream chain |
| [GhostSam](https://github.com/MocLG/GhostSam) | Both | Galaxy S22, S26, Z Fold8 series | [![latest tag](https://img.shields.io/github/v/tag/MocLG/GhostSam?style=flat-square)](https://github.com/MocLG/GhostSam/tags) | ADB. Per-series build tables. The DirtyFrag path needs no race |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) | GhostLock | Exact `uname -r` profiles across many brands | [![latest release](https://img.shields.io/github/v/release/YuKongA/ghostlock-app?include_prereleases&style=flat-square)](https://github.com/YuKongA/ghostlock-app/releases) | On-device or Shizuku. A profile is a candidate, not a tested device. Supports profile import and command-line tools |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) | GhostLock | Selected Galaxy builds | [![latest release](https://img.shields.io/github/v/release/BuSung-dev/Root-My-Galaxy?style=flat-square)](https://github.com/BuSung-dev/Root-My-Galaxy/releases) | On-device; Shizuku for some profiles. Payloads live in the [payload repository](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) | GhostLock | Pixel 6 through Pixel 11 | [![latest release](https://img.shields.io/github/v/release/alex193a/Root-My-Pixel?style=flat-square)](https://github.com/alex193a/Root-My-Pixel/releases) | Shizuku. GhostLock race; retries are common |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) | GhostLock + Adreno | vivo and iQOO, 5.10–6.12 | [![latest release](https://img.shields.io/github/v/release/zenyxx-xd/RootMyVivo?style=flat-square)](https://github.com/zenyxx-xd/RootMyVivo/releases) | Shizuku first run, then ADB over TCP. Payload catalog fetched at runtime; each entry says how it was verified |
| [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) | GhostLock | Xiaomi 17T Pro, Xiaomi 14T Japan, Meta Quest 3 | [![latest release](https://img.shields.io/github/v/release/WitAqua-tools/Root-My-Device?style=flat-square)](https://github.com/WitAqua-tools/Root-My-Device/releases) | On-device. Checks the full target before running |
| [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) | GhostLock | Nothing Phone (3a), OnePlus Pad 3 | [![latest release](https://img.shields.io/github/v/release/tqmane/Root-My-Device?style=flat-square)](https://github.com/tqmane/Root-My-Device/releases) | Shizuku. Separate app builds per device |
| [RootMyS24](https://github.com/NanoTurtle1145/root-my-s24) | GhostLock | Galaxy S24 China/HK/TW, Z Fold6 China | [![latest release](https://img.shields.io/github/v/release/NanoTurtle1145/root-my-s24?style=flat-square)](https://github.com/NanoTurtle1145/root-my-s24/releases) | Shizuku or wireless debugging. Uses the official KernelSU manager |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | GhostLock | Galaxy Z Fold6 SM-F9560 builds | [![source](https://img.shields.io/badge/source-repo-blue?style=flat-square)](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | ADB or Shizuku. Covers three registered kernels |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) | GhostLock | OnePlus, Xiaomi, and OPPO builds | [![source](https://img.shields.io/badge/source-repo-blue?style=flat-square)](https://github.com/JoinChang/ghostlock-oneplus) | ADB. Also lists layouts it cannot support |
| [GhostLock-for-OnePlus](https://github.com/p2p3p/GhostLock-for-OnePlus) | GhostLock | Ace 6T, OnePlus 15 PLK110 | [![latest tag](https://img.shields.io/github/v/tag/p2p3p/GhostLock-for-OnePlus?style=flat-square)](https://github.com/p2p3p/GhostLock-for-OnePlus/tags) | ADB. Verified kernels only |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) | GhostLock | Galaxy A17 SM-A175F | [![source](https://img.shields.io/badge/source-repo-blue?style=flat-square)](https://github.com/mobilehackinglab/ghostlock-a17) | ADB. Ends in a per-boot root shell, not a manager |
| [GhostLock-5.10](https://github.com/R0rt1z2/GhostLock) | GhostLock | Fire Max 11, Fire TV Stick 4K Max 2023 | [![source](https://img.shields.io/badge/source-repo-blue?style=flat-square)](https://github.com/R0rt1z2/GhostLock) | ADB. Root shell plus a local bind shell; disables OTA after success |
| [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4) | GhostLock | Shield TV Pro 2019 | [![latest release](https://img.shields.io/github/v/release/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4?style=flat-square)](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4/releases) | ADB. Gives root to the ADB daemon, with no `su` manager |
| [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8) | Adreno GPU | iQOO Neo8 SM8475 on `5.10.198` | [![source](https://img.shields.io/badge/source-repo-blue?style=flat-square)](https://github.com/Qingizi7/cve-2025-21479_iqooneo8) | ADB. Needs pre-June-2025 GPU firmware |
| [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root) | GhostLock | vivo X200 PD2415 on the b57 kernel | [![latest release](https://img.shields.io/github/v/release/xiaohj233/ghostlock-x200-root?style=flat-square)](https://github.com/xiaohj233/ghostlock-x200-root/releases) | PC toolkit (PowerShell) or the [companion app](https://github.com/xiaohj233/ghostlock-x200-app). Only the X200 b57 combination is verified |
| [MT6989-ghostlock](https://github.com/MaheshSharan/MT6989-ghostlock) | GhostLock | vivo T3 Ultra V2426 (MT6989) | [![latest release](https://img.shields.io/github/v/release/MaheshSharan/MT6989-ghostlock?style=flat-square)](https://github.com/MaheshSharan/MT6989-ghostlock/releases) | Shizuku or plain `adb shell`. One attempt per boot; downloads the exploit and manager from its release |
| [GhostLock HONOR](https://github.com/MnemosyneLab/ghostlock-honor) | GhostLock | HONOR 400 DNY-NX9 on `5.15.180-...g9b2308ac0ad6` | [![latest release](https://img.shields.io/github/v/release/MnemosyneLab/ghostlock-honor?style=flat-square)](https://github.com/MnemosyneLab/ghostlock-honor/releases) | On-device or Shizuku. GhostLock App fork; standalone and Shizuku recovery paths; overseas model only |
| [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root) | GhostLock | HONOR 80 Pro Flat ANB-AN00 on `5.10.236-android12-9-gd671cf8c2b02` | [![latest release](https://img.shields.io/github/v/release/Chuniex-0631/honor-anb-an00-root?style=flat-square)](https://github.com/Chuniex-0631/honor-anb-an00-root/releases) | Shizuku over wireless debugging. Single verified MagicOS combo; checks model and exact kernel |
| [Redmi K70 Pro temp root](https://github.com/Berge520/redmik70pro) | MIUI service | Redmi K70 Pro (manet), HyperOS 3 / Android 16 | [![latest release](https://img.shields.io/github/v/release/Berge520/redmik70pro?style=flat-square)](https://github.com/Berge520/redmik70pro/releases) | PC tool plus ADB or fastboot. Boots a permissive command line through fastboot, then late-loads KernelSU through a MIUI service. Not a GhostLock or DirtyFrag route |
| [ghostlock-s26](https://github.com/snothin/ghostlock-s26) | GhostLock | Galaxy S26 series | [![latest release](https://img.shields.io/github/v/release/snothin/ghostlock-s26?style=flat-square)](https://github.com/snothin/ghostlock-s26/releases) | ADB. Merged into GhostSam |
| [IonStackQuest3](https://github.com/F-19-F/IonStackQuest3) | GhostLock | Quest 3 on the listed incrementals | [![latest release](https://img.shields.io/github/v/release/F-19-F/IonStackQuest3?style=flat-square)](https://github.com/F-19-F/IonStackQuest3/releases) | ADB. Meta fixed newer builds |
| [DirtyInit](https://github.com/combeng6th/DirtyInit) | DirtyFrag | Samsung devices with the primitive | [![latest release](https://img.shields.io/github/v/release/combeng6th/DirtyInit?style=flat-square)](https://github.com/combeng6th/DirtyInit/releases) | ADB relay. Init-context toolkit; not a KernelSU route |

### Kernel module sets

<details>
<summary>Click to show <strong>which kernel modules each loader ships</strong></summary>

<br>

GhostSam ships one DirtyFrag module per KMI and marks its set as follows. DirtyFrag also builds modules per KMI; its release assets list the included set. The KMI is not the full target: two phones on the same KMI can still differ in kernel build, page size, and vendor hardening.

| KMI | Module status | Notes |
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

Do not use a manager's install, flash, or patch-boot-image actions on a locked phone. Those actions write protected partitions and are a documented hardbrick path.

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

### Porting a new device

<details>
<summary>Click to show <strong>porting notes</strong></summary>

<br>

Every loader is built around device-specific offsets. A generated profile is a candidate, not a supported device. Start with the [GhostLock App porting guide](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/README.md), the [Root My Galaxy payload notes](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads), or the [ghostlock-oneplus README](https://github.com/JoinChang/ghostlock-oneplus).

</details>

[↑ Back to contents](#contents)

---

## Modules

Late-loaded KernelSU is not a normal boot-time install. Modules that mount files or hook apps at runtime can work. Modules that must run before Android starts, replace a boot script, or write a partition cannot, and some fail by bootlooping the device.

<details>
<summary>Click to show <strong>how late-load limits modules</strong></summary>

<br>

Late-loaded KernelSU has no `init.rc` injection, no module `preinit`, no `post-fs-data` event, and no `ksud` kprobe hooks. Safe-mode detection and boot-log capture are disabled. `late-load.d`, `post-mount.d`, `service.d`, and `boot-completed.d` scripts still run.

Samsung's DEFEX path rules and KDP add another way for a module that works on a Pixel to fail on a Galaxy.

</details>

| Status | Meaning |
| --- | --- |
| **Working** | Reported working on temporary root by the [upstream module list](https://github.com/rushiranpise/temporal-root-modules-list) or a community test. |
| **Caveat** | Works with a known bug, instability, or setup requirement. |
| **Broken** | Reported not working; several entries reboot the phone. |
| **Avoid** | Known hardbrick or serious failure on a locked device. |
| **Reported** | A community report that has not been reproduced widely. |
| **Outdated** | Superseded or unmaintained. |

The [upstream list](https://github.com/rushiranpise/temporal-root-modules-list) is the maintained source; the tables below summarize it. Most reports come from one device: a Galaxy S25 `SM-S931B` on One UI 8.5 with Root My Galaxy. Treat them as starting points, not device-independent results.

### Working or caveated

| Module | What it does | Status | Notes |
| --- | --- | --- | --- |
| [LSPosed](https://github.com/LSPosed/LSPosed) | Xposed framework | Working | Needs a Zygisk provider. GPS can misbehave. Scope changes need a soft reboot. |
| [ZygiskNext](https://github.com/Dr-TSNG/ZygiskNext) | Zygisk implementation for KernelSU | Working | The provider paired with LSPosed here. Use a current release; some older builds are reported buggy. |
| [Vector](https://github.com/JingMatrix/Vector/releases) | LSPosed fork | Working | Works on the latest CI and canary builds. |
| [NeoZygisk](https://github.com/JingMatrix/NeoZygisk) | Zygisk implementation | Working | Works on the latest CI build. |
| [AdClose](https://github.com/zjyzip/AdClose) | Blocks ads and app limits through Xposed | Working | |
| [AdGuard Certificate](https://github.com/AdguardTeam/adguardcert) | HTTPS filtering certificate as a module | Working | |
| [AFWall+](https://github.com/ukanth/afwall) | iptables firewall app | Working | Root app. A bad rule can cut off ADB. |
| [bindhosts](https://github.com/bindhosts/bindhosts) | Systemless hosts | Working | |
| [Discover Ads Filter](https://github.com/hxreborn/discover-ads-filter) | Removes ads from Google Discover | Working | |
| [amznkiller](https://github.com/hxreborn/amznkiller) | Removes Amazon app ads | Working | |
| [Facebook App Ads Remover](https://github.com/Loukious/FacebookAppAdsRemover) | Removes Facebook app ads | Working | |
| [NexAlloy](https://github.com/nexalloy/NexAlloy) | App modification toolkit | Working | |
| [HMA](https://github.com/frknkrc44/HMA-OSS) | Hides apps from selected apps | Working | Works on the latest CI and canary builds. Needs a soft restart to start its service. |
| [Re:X](https://github.com/Xposed-Modules-Repo/one.dot.rex) | Xposed module for X | Working | |
| [ReVancedXposed_Spotify](https://github.com/TheWinner02/ReVancedXposed_Spotify) | Spotify patches | Working | |
| [WaDeepDark](https://github.com/Dhangofa/WaDeepDark) | WhatsApp theming | Working | |
| [YouTube ReVanced](https://github.com/Zy0x/YouTube-Revanced/) | YouTube patches | Working | Check reports before updating. |
| [IAmNotADeveloper](https://github.com/xfqwdsj/IAmNotADeveloper) | Hides developer-options state | Working | |
| [Migrate-OSS](https://github.com/BaltiApps/Migrate-OSS) | Backup and migration | Working | |
| [pairipfix](https://github.com/mezo123451A/pairipfix) | Bypasses PairIP signature checks | Working | |
| [Update Locker](https://github.com/Xposed-Modules-Repo/ru.mike.updatelocker/) | Stops selected apps from updating | Working | |
| [Zygisk Detach](https://github.com/j-hc/zygisk-detach) | Detaches apps from the Play Store | Working | Needs a working Zygisk provider. |
| [CorePatch](https://github.com/LSPosed/CorePatch) | Disables signature verification | Caveat | Confirmed buggy; soft-bootloop reports. Keep the module-disable switch reachable. |
| [DuckUSB](https://github.com/Bouteillepleine/DuckUSB) | Hides USB debugging from scoped apps | Working | |
| [MT Manager](https://mt2.cn/download/) | File manager and APK editor | Working | Do not edit system files on a locked phone. |
| [OneUI Settings Hook](https://github.com/HeheJuice/OneUI-Settings-Hook) | Adds and changes One UI settings | Working | Samsung only. |
| [OneUIX](https://github.com/SoClear/OneUIX) | One UI customization | Working | |
| [App Manager](https://github.com/Muntashirakon/AppManager) | Package manager and debloat tool | Working | |
| [net-switch](https://github.com/Rem01Gaming/net-switch) | Network mode switching | Working | |
| [Scene](https://omarea.com/) | Performance and battery profiles | Working | Avoid kernel or voltage changes. |
| [Frosty](https://github.com/Drsexo/Frosty) | Battery and Google services optimization | Caveat | Buggy; possible wake-lock issues. |
| [ViPERFX_RE](https://github.com/likelikeslike/ViPERFX_RE) | ViPER4Android audio processing | Caveat | Follow its install order; it expects KernelSU. |

### Broken

| Module | What happens | Status |
| --- | --- | --- |
| [Enable Screenshot (Disable FLAG_SECURE)](https://modules.lsposed.org/module/io.github.lsposed.disableflagsecure/) | Reboots the device on the test build. | Broken |
| [PrivacySpace](https://github.com/Xposed-Modules-Repo/cn.geektang.privacyspace) | Does not work. | Broken |
| [ReZygisk](https://github.com/PerformanC/ReZygisk) | Reboots the device. | Broken |
| [Treat-Wheel-Zygisk](https://github.com/PerformanC/Treat-Wheel-Zygisk) | Reboots the device. | Broken |

Use ZygiskNext as the provider with LSPosed. ReZygisk and Treat-Wheel-Zygisk still reboot the phone in these reports, so do not swap providers "for stability" without current evidence.

### Avoid on a locked phone

| Tool or module | Why | Status |
| --- | --- | --- |
| [Magisk](https://github.com/topjohnwu/Magisk) | Direct Install writes protected images. On a locked Samsung this has caused a permanent hardbrick and the D2 screen. | Avoid |
| [KonaBess-Next](https://github.com/KonaBess-Next/KonaBess-Next) | GPU voltage and clock changes; reported permanent hardbrick on the test device. | Avoid |
| [KonaBess](https://github.com/libxzr/KonaBess) | Older GPU modification tool. | Outdated |

The Magisk entry does not mean Magisk is malware. Its install model assumes an unlocked bootloader; Direct Install on a locked phone is the mistake.

### Reported, needs more testing

| Module | What it does | Status | Notes |
| --- | --- | --- | --- |
| [Tailscale module](https://github.com/anasfanani/magisk-tailscaled) | Runs Tailscale as a root service | Reported | Worked for at least one user. |
| [Crond4Android](https://github.com/powerAn2020/crond4android) | Cron daemon with a UI | Reported | |
| [Sui](https://github.com/XiaoTong6666/Sui) | Alternative superuser interface | Reported | Do not run it alongside KernelSU without reading both projects. |
| [pm-install-from-anywhere](https://github.com/1ndevelopment/pm-install-from-anywhere) | Lets `pm` install APKs from any path | Reported | |
| [CaptureSposed](https://github.com/99keshav99/CaptureSposed) | Disables Android 14 screenshot detection | Reported | Conflicts with the Enable Screenshot failure report. |
| [HyperLock](https://github.com/LXRylex/HyperLock) | HyperOS SystemUI theming (HyperDuo fork) | Reported | Tested by its author on a Redmi Note 13 Pro 4G. |

### Reducing module risk

1. Confirm `su -c id` works and the manager opens.
2. Install one module, then soft reboot.
3. Check the feature it changes. Add the next module only after that passes.

Do not install LSPosed, a Zygisk provider, three Xposed modules, and a kernel tweaker in one pass. If the phone bootloops, you will not know which one caused it, and the manager may be unreachable.

If a loader offers autorun, leave it off until the module set is known good: autorun plus a bootlooping module re-runs the failure on every boot. Grant root per app and revoke it when the session ends.

Indexes for finding modules: the [LSPosed module repository](https://modules.lsposed.org/) and [MMRL](https://github.com/MMRLApp/MMRL). Neither tests for late-load compatibility.

[↑ Back to contents](#contents)

---

## Quick start

1. **Record the exact target.** Model, firmware build, Android version, security patch, and the full kernel release. Save the output where you can read it after a reboot.

   ```bash
   adb shell getprop ro.product.model
   adb shell getprop ro.product.device
   adb shell getprop ro.build.display.id
   adb shell getprop ro.build.version.release
   adb shell uname -r
   ```

   Without a computer, **Settings > About phone** gives the model and build; `uname -r` in Termux gives the kernel.

2. **Match the exact build upstream.** Use [Supported devices](#supported-devices) for a confirmed starting point, then open the loader's own live table. If the project does not list your exact model, build, and kernel, stop. Do not try the closest one.

3. **Back up and plan recovery.** Copy data you cannot lose, and know how to reach safe mode, download mode, or a service center for that model before you run anything.

4. **Install the manager the loader names.** Open it once so its services are registered. Do not use its install, flash, or patch-boot-image actions. On Samsung with DirtyFrag, use diabl0w's KernelSU build.

5. **Run the loader.** Install it from the upstream release page, grant the permissions or transport it asks for, confirm it detected the expected model and kernel, then start the run and keep it in the foreground. Do not start a second run while the first is still working.

6. **Verify, then test modules one at a time.**

   ```bash
   adb shell su -c id
   ```

   Expected output starts with `uid=0(root)`. The SELinux context can differ. If `su` is missing, the exploit may have completed while the late-load failed; see [Troubleshooting](#troubleshooting-and-faq). Install one module, soft reboot, and test. A soft reboot keeps root; a full reboot clears it. Use the manager's soft-reboot action rather than `adb reboot`.

Nothing in this workflow flashes, patches, or installs a boot image. If a guide asks you to, it is a permanent-root procedure.

[↑ Back to contents](#contents)

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

There are two causes. The download-mode gate on One UI 8.5 and later refuses download mode while a lock-screen credential is set; Android still boots. Remove the screen lock, power off, hold Volume Up and Volume Down together, then connect USB. Some users report that enabling Maintenance Mode first has the same effect.

A modified protected image is different: the bootloader rejects it and Android does not boot. Key combinations will not help. If the phone does not enumerate over USB, contact Samsung or a repair service. If download mode opens, flash signed stock firmware for the exact model and region with Odin. Do not mix firmware from another model, and do not use a "D2 bypass" APK.

</details><br>

<details>
<summary>Click to show <strong>ADB does not list the device or says unauthorized</strong></summary>

<br>

Check the cable, port, and USB debugging setting, then run `adb devices` again. For `unauthorized`, unlock the phone and accept the RSA prompt. For `no devices`, try another cable and port and check `lsusb`. Wireless debugging must be paired before it appears.

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

Offsets come from a specific kernel build. Compiler settings and vendor hardening change the layout, a 4K-page profile does not cover a 16 KB page build, and a vendor can backport the fix without changing the version string. An OTA can move the build or close the bug, so recheck before updating.

</details><br>

<details>
<summary>Click to show <strong>Do I need a computer or Shizuku?</strong></summary>

<br>

Not always. DirtyFrag, Root My Galaxy, GhostLock App, RootMyVivo, and Root My Device can run on the phone itself. Root My Pixel needs Shizuku, which can be started over wireless debugging without a PC. Some profiles need a one-time ADB setup, and command-line ports are easier from a computer. Shizuku is an ADB bridge, not root.

</details><br>

<details>
<summary>Click to show <strong>Which root manager should I install?</strong></summary>

<br>

The one the loader documents. Samsung DirtyFrag requires diabl0w's KernelSU build; Root My Pixel expects the BakaSU manager named in its README. A manager alone does not give temporary root.

</details><br>

<details>
<summary>Click to show <strong>Which modules can work?</strong></summary>

<br>

Modules that mount files or hook apps at runtime can work. Modules that need to start at early boot, replace boot scripts, load a kernel driver, or write a partition generally cannot. See [Modules](#modules), install one at a time, and keep the loader's module-disable switch reachable.

</details><br>

<details>
<summary>Click to show <strong>Root is missing after a run that looked successful</strong></summary>

<br>

The exploit likely completed and the late-load failed. Check that you installed the manager the loader names, that it was selected in the loader, and that the kernel matches. Disable auto reboot if it is on, then run again and read the log. If the log shows a patched kernel or a profile mismatch, stop.

</details><br>

<details>
<summary>Click to show <strong>What do I do after a module bootloop?</strong></summary>

<br>

A full reboot clears root and the kernel module. Open the loader, set modules to disabled, run it again, and remove the module. DirtyFrag's module switch works without root.

If Android does not start, try safe mode (hold Volume Down during boot; Android may also offer it after repeated crashes). Safe mode may not disable a late-loaded kernel module, so the loader switch remains the reliable path. On a user build, `adb uninstall <loader-package>` removes the loader without root. If the phone does not enumerate over USB and neither recovery nor download mode opens, stop and seek service support.

</details><br>

<details>
<summary>Click to show <strong>Will banking apps or Play Integrity work?</strong></summary>

<br>

Maybe, but nothing here guarantees it. A locked bootloader helps some checks, while root, manager packages, module files, and SELinux state are all detectable. Strong integrity verdicts usually fail. Test the app before you depend on it.

</details><br>

<details>
<summary>Click to show <strong>How do I report a new device or module result?</strong></summary>

<br>

Open an issue or pull request with the exact model, build, full `uname -r`, Android version, loader and manager versions, module version, result, and the relevant log tail. The format is in [Contributing](#contributing-and-disclaimer). One reproducible result is worth more than a list of guesses.

</details><br>

[↑ Back to contents](#contents)

---

## Contributing and disclaimer

### Reporting a device or module result

A report is useful only if someone else can reproduce it. "Works on my S24" is not a data point; the model, build, kernel, tool versions, and result are.

```text
Device:        <market name>
Model:         <ro.product.model>
Region / CSC:  <region or CSC>
Build:         <ro.build.display.id>
Android:       <ro.build.version.release>
Kernel:        <full uname -r>
Page size:     <4k or 16k>
Loader:        <project and version>
Manager:       <manager and version>
Method:        <DirtyFrag or GhostLock>
Stage reached: <last successful stage>
Modules:       <name and version>
Result:        <Tested, Experimental, or failure>
Notes:         <what failed, retries, panics, or side effects>
```

For a failure, include the last 50 lines of the loader log, with personal paths and account names removed. Keep the error text and the stage where it stopped.

### Status rules

Use the labels defined in [Supported devices](#supported-devices): **Tested** and **Experimental**. Do not upgrade a label because a device is popular, or downgrade a failure because it worked once for someone else. A disputed entry keeps the lower status until someone reproduces the result.

### What helps

- Device reports for builds missing from [Supported devices](#supported-devices), with a full target string.
- Module reports for versions not in [Modules](#modules).
- Corrections to tool names, links, or statuses.
- Fixes to instructions that no longer match a current release.
- A link to an upstream change when a row becomes stale.

### What does not help

- Requests to root a specific phone.
- Links to reuploads, Telegram channels, or paid services.
- Instructions that unlock a bootloader or flash a boot image.
- Exploit code or offsets for devices without a public project.
- Claims without a build string or a log.

Small fixes can go straight to a pull request; device and module reports need the evidence above. Open issues at [github.com/fynks/awesome-temporary-root/issues](https://github.com/fynks/awesome-temporary-root/issues).

### License and disclaimer

Content is MIT licensed; contributions are accepted under the same terms. Linked tools carry their own licenses and documentation.

This is a community-maintained index. It does not develop, audit, or guarantee the linked projects, and it is not affiliated with Google, Samsung, KernelSU, NebuSec, or any loader maintainer. Use these tools only on devices you own or have explicit permission to modify.

---

## Sources

- CVE records: [CVE-2026-43284](https://www.cve.org/CVERecord?id=CVE-2026-43284) ([NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-43284)), [CVE-2026-43499](https://www.cve.org/CVERecord?id=CVE-2026-43499) ([NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-43499)). KernelSU: [module guide](https://kernelsu.org/guide/module.html), [bootloop rescue](https://kernelsu.org/guide/rescue-from-bootloop.html).
- Device and profile sources: [Root My Galaxy payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads), [GhostLock App supported devices](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md), [RootMyVivo catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/support/targets-vivo.json), [Root My Device payloads](https://github.com/WitAqua-tools/Root-My-Device-Payloads), [Root My Device project](https://github.com/tqmane/Root-My-Device).
- Loader documentation: [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus), [GhostSam](https://github.com/MocLG/GhostSam), [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy), [GhostLock-5.10](https://github.com/R0rt1z2/GhostLock), [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4), [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17), [ghostlock-s26](https://github.com/snothin/ghostlock-s26), [GhostLock-X200](https://github.com/xiaohj233/ghostlock-x200-root), [MT6989-ghostlock](https://github.com/MaheshSharan/MT6989-ghostlock), [GhostLock HONOR](https://github.com/MnemosyneLab/ghostlock-honor), [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root), [cve-2025-21479_iqooneo8](https://github.com/Qingizi7/cve-2025-21479_iqooneo8), [redmik70pro](https://github.com/Berge520/redmik70pro).
- Module status: [Temporal Root Modules List](https://github.com/rushiranpise/temporal-root-modules-list), [XDA testing thread, now closed](https://xdaforums.com/t/list-of-modules-working-on-temporal-root.4796105/).
- Background: [awesome-android-root](https://github.com/awesome-android-root/awesome-android-root), [NebuSec IonStack](https://github.com/NebuSec/CyberMeowfia/tree/main/IonStack/CVE-2026-43499).
