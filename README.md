<div align="center">

<picture>
  <source media="(prefers-color-scheme: light)" srcset="docs/public/images/ghost-light.svg">
  <source media="(prefers-color-scheme: dark)" srcset="docs/public/images/ghost-dark.svg">
  <img src="docs/public/images/ghost-light.svg" alt="Awesome Temporary Root ghost logo: a ghost silhouette with a hash symbol cut out of its body" width="112" height="112">
</picture>

# Awesome Temporary Root

Root access on a locked Android bootloader, for one boot at a time.

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Devices](#supported-devices) · [Tools](#tools-and-managers) · [Modules](#modules) · [Quick start](#quick-start) · [Troubleshooting](#troubleshooting-and-faq) · [Contributing](#contributing-and-disclaimer)

<sub>GitHub project sources and CVE records checked 2026-10-19.</sub>

</div>

## What is temporary root?

Temporary root gives an app or an ADB shell UID 0 on the current boot without unlocking the bootloader or flashing a boot image. A loader exploits a kernel bug to obtain kernel read/write, uses that access to start a root daemon, then late-loads a KernelSU kernel module. A KernelSU-compatible manager can then grant `su`. A full reboot unloads the module and ends the session. Which bug and loader apply depends on the device, its firmware build, and its kernel.

The loaders here use one of two kernel bugs:

- **DirtyFrag (CVE-2026-43284)** — a page-cache write in ESP-in-UDP decryption. It is deterministic: a run either works or stops with an error. The loader needs a kernel module built for the device's KMI.
- **GhostLock (CVE-2026-43499)** — a futex priority-inheritance use-after-free turned into a controlled kernel write. It is a race, so retries and kernel panics are normal, and a working payload is tied to the exact kernel layout.

CVE records give these patch floors. Both bugs affect older branches than the ones listed.

| Kernel branch | DirtyFrag fixed in | GhostLock fixed in |
| --- | --- | --- |
| 5.10 | 5.10.255 | 5.10.261 |
| 5.15 | 5.15.205 | 5.15.212 |
| 6.1 | 6.1.171 | 6.1.175 |
| 6.6 | 6.6.138 | 6.6.140 |
| 6.12 | 6.12.87 | 6.12.86 |
| 6.18 | 6.18.28 | 6.18.27 |
| 7.0 | 7.0.5 | 7.0.4 |

DirtyFrag has been in Linux since 4.11 and GhostLock since 2.6.39. Vendors backport fixes out of order and sometimes change a kernel without changing the version string, so treat these numbers as a hint. The loader's own vulnerability check is the verdict.

**It enables:**

- `su` for apps the user approves, through a KernelSU-compatible manager.
- A root shell while the bootloader stays locked and the boot image stays stock.
- Modules that mount files or hook apps at runtime, for the current boot.
- A session that leaves the verified-boot chain, the stock kernel, and the recovery partitions untouched.

**It does not:**

- Survive a full reboot.
- Unlock the bootloader, allow unsigned images, custom ROMs, kernels, or recoveries.
- Run modules that need `init.rc` injection, `preinit`, `post-fs-data`, or a partition write.
- Guarantee Play Integrity, banking apps, or recovery from a bad module.
- Cover every device. A profile is built for a specific model and kernel layout.

A **soft reboot** restarts Android's userspace and `system_server`, not the kernel, so the late-loaded module stays and module mounts reactivate. A **full reboot** loads the stock kernel again and clears root. Files under `/data/adb` can remain, but nothing loads them. Do not delete that directory to "unroot": it also holds ADB keys and data other tools rely on.

**Related but different:** Shizuku runs a service as the shell user (UID 2000) through ADB and is not root, though several loaders use it as a transport. `adb root` works only on builds with `ro.debuggable=1`. Virtual-root apps (dual-space and parallel-space tools) sandbox selected apps and never grant UID 0. Magisk, KernelSU, and APatch boot-image installs are permanent and need an unlocked bootloader; KernelSU's late-load mode is a component of temporary root, not a root method by itself.

> [!WARNING]
> Temporary root is full root for the session, delivered by privilege-escalation code running in the kernel. A wrong profile or a lost race can panic the device, an incompatible module can bootloop it, and a partition write can make it unbootable. Verify the exact model, firmware build, and `uname -r` against the upstream project before running a loader, and back up data you cannot lose. Only use hardware you own or have explicit permission to modify.

## Supported devices

The tables record what each upstream project documents. This index has not tested the hardware; a status describes upstream evidence, not a guarantee. Where a row and an upstream README disagree, the upstream README wins.

| Status | Meaning |
| --- | --- |
| **Tested** | The upstream project documents a completed run on that exact target, or lists it as device-tested or hardware-verified. |
| **Reported** | The project ships a profile or publishes a report without documenting a completed run on that exact build. |
| **Experimental** | The project marks the target, route, or profile as work in progress, shell-only, or unverified. |
| **Untested** | The project lists the target with no run reported. |
| **Broken** | The project reports that the chain does not complete. |
| **Not feasible** | The project documents why that kernel layout cannot work with its route. |

A kernel string such as `6.6.98-android15-8-gf4dc45704e54-abogki446052083-4k` carries the upstream version, the KMI, a commit, a vendor build, and the page size. A model name alone is not a target: page size, vendored hardening, and compiler layout can differ between two phones on the same release. Where a loader matches the full `uname -r`, read the kernel line from the device, not from this table.

### Samsung Galaxy

[Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) ships per-build payloads and matches model plus kernel; some profiles require Shizuku. The exact model list for each payload is in the [payload feed](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads#supported-payloads).

| Device | Model | Build or kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| Galaxy S25, S25+, S25 Ultra, S25 Edge | SM-S931x, SM-S936x, SM-S937x, SM-S938x, SC-51F, SCG31, SC-52F, SCG32 | `6.6.98` | Root My Galaxy | Tested |
| Galaxy S25+ China | SM-S9360 | `S9360ZCSCCZG1`, `6.6.98` | Root My Galaxy | Tested |
| Galaxy S25 Edge China | SM-S9370 | `S9370ZCS9CZG1`, `6.6.98` | Root My Galaxy | Tested |
| Galaxy Z Fold7 | SM-F966U, SM-F966U1 | `F966USQU9BZDN` or `F966USQSBBZG3`, `6.6.98` | Root My Galaxy | Tested |
| Galaxy Z Fold7 | SM-F966B | `F966BXXSBBZG3`, `6.6.98` | Root My Galaxy | Tested |
| Galaxy S24 Ultra | SM-S928U1, SM-S928W | `S928USQS6DZF2`, `6.1.145` | Root My Galaxy | Tested |
| Galaxy S24 Ultra | SM-S928B | `S928BXXS6DZF2`, `6.1.145` | Root My Galaxy | Tested |
| Galaxy S24 Ultra China | SM-S9280 | `S9280ZCS6DZF2`, `6.1.145` | Root My Galaxy | Tested |
| Galaxy S24+ | SM-S926B | `S926BXXUEDZDR`, `6.1.157` | Root My Galaxy | Tested |
| Galaxy S24 | SM-S921B | `S921BXXSFDZE1`, `6.1.157` | Root My Galaxy | Tested |
| Galaxy S24 | SM-S921N | `S921NKSSFDZF3`, `6.1.157` | Root My Galaxy | Tested |
| Galaxy S24 FE | SM-S721B | `S721BXXSCDZF3`, `6.1.157` | Root My Galaxy | Tested |
| Galaxy S23 Ultra | SM-S918B | `S918BXXSAFZF5`, `5.15.189` | Root My Galaxy | Tested |
| Galaxy S23 Ultra | SM-S9180, S918N, S918Q, S918U, S918W, S918U1 | `S9180ZHS8FZF5`, `5.15.189` | Root My Galaxy | Reported |
| Galaxy S23+ | SM-S916B | `S916BXXSAFZG1`, `5.15.189` | Root My Galaxy (shell-only profile) | Experimental |
| Galaxy S23 | SM-S911U1 | `S911U1UES6DYI3`, `5.15.153` | Root My Galaxy | Experimental |
| Galaxy A56 5G | SM-A5660, A566B, A566E, A566S, A566U1, A566W | `A566EXXSCCZG6`, `6.6.102` | Root My Galaxy | Tested |
| Galaxy A36 5G | SM-A366W | `A366WVLS3AYG1`, `6.6.46` | Root My Galaxy | Tested |
| Galaxy A53 5G | SM-A536E | `A536EXXSNGZG3`, `5.10.237` | Root My Galaxy | Tested |
| Galaxy A17 | SM-A175F | `A175FXXS3BZA5` (`6.12.23`), `A175FXXS6CZG1` (`6.12.38`) | [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) | Tested |
| Galaxy A16 5G | SM-A166W | `A166WVLS8DZG1`, `5.15.189-android13-3-33503169` | [SM-A166W port](https://github.com/jojobear691/SM-A166W-DZG1-Temporary-Root) | Tested |
| Galaxy Tab S9 | SM-X710 | `X710XXS6EZF1`, `5.15.189` | Root My Galaxy | Tested |
| Galaxy Z Fold4 | SM-F9360 | `F9360ZCSAIZF1`, `5.10.236` | [Root My Galaxy Payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) | Tested |
| Galaxy Z Fold6 China | SM-F9560 | `F9560ZCS4DZI1`, `F9560ZCS4DZH5`, `F9560ZCS4DZG3` (`6.1.145`) | [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | Tested |
| Galaxy S22 series | SM-S9010, SM-S9060, SM-S9080 and regional variants | 66 builds across 4 kernel baselines | [GhostSam](https://github.com/MocLG/GhostSam) | Reported |
| Galaxy S26 series | SM-S9420, SM-S9470, SM-S9480 and regional variants | 153 builds; 7 additional One UI 9 builds | GhostSam | Reported |
| Galaxy Z Fold8 | SM-F9710, SM-F9760 and regional variants | 73 builds | GhostSam | Reported |

Notes:

- The S9180/S918N/S918Q/S918U/S918W/S918U1 payload was still marked "test in progress" upstream when this page was checked. The S918B profile is hardware-verified through the app's Shizuku mode; rooting that build without Shizuku is not.
- `F9360ZCSAIZF1` and the S916B shell-only profile are published in the payload repository but are outside the app's v3 feed.
- [Root My S24](https://github.com/NanoTurtle1145/root-my-s24) ports SM-S92X0 builds for China, Hong Kong, and Taiwan, plus the Chinese Z Fold6.

### Google Pixel

All rows use [Root My Pixel](https://github.com/alex193a/Root-My-Pixel), which requires Shizuku. Builds are matched exactly; an OTA changes the target.

| Family | Models | Supported builds | KMI | Status |
| --- | --- | --- | --- | --- |
| Pixel 11 | 11, 11 Pro, 11 Pro XL, 11 Pro Fold | `CD1A.260618.001.C2`, `.C3` | `android16-6.12` | Tested |
| Pixel 10 | 10, 10 Pro, 10 Pro XL, 10 Pro Fold | `CP2A.260705.006`, `CP2A.260805.005` | `android15-6.6` | Tested |
| Pixel 10a | 10a | `CP2A.260705.006`, `CP2A.260805.005` | `android14-6.1` | Tested |
| Pixel 9 | 9, 9 Pro, 9 Pro XL, 9 Pro Fold, 9a | `CP2A.260705.006`, `AD1A.240905.004` | `android14-6.1`, `android15-6.1` | Tested |
| Pixel 8 | 8, 8 Pro, 8a | `CP2A.260705.006`, `CP2A.260805.005` | `android14-6.1` | Tested |
| Pixel 7 | 7, 7 Pro, 7a | `CP2A.260705.006`, `BP2A.250705.008` | `android14-6.1` | Tested |
| Pixel 6 | 6, 6 Pro, 6a | `CP2A.260705.006`, `CP1A.260405.005` | `android14-6.1` | Tested |
| Pixel Fold | Fold | `CP2A.260605.012`, `CP2A.260705.006` | `android14-6.1` | Tested |
| Pixel Tablet | Tablet | `BP1A.250405.007`, `CP2A.260705.006` | `android14-6.1` | Tested |

A family row can list more than one build because its models differ. Each build is valid only for the models the upstream table names; check that row before running.

Root My Pixel reports the exploit is unreliable. Many users needed more than 20 attempts, and repeated failures can reboot the phone. Use one tool per device: GhostLock App also carries profiles for the Pixel 7, 9a, 9 Pro, and 9 Pro Fold.

### OnePlus, OPPO, Realme

[ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) documents both the kernels it verifies and the layouts it cannot support; the [not-feasible table](#not-feasible-broken-or-in-progress) covers the failures.

| Device | Model | Kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| OnePlus Ace 6T | PLR110 | `6.12.38`; ColorOS 16.0.2.403 and 16.0.8.301 | [GhostLock-for-OnePlus](https://github.com/p2p3p/GhostLock-for-OnePlus) | Tested |
| OnePlus 15 | PLK110 | `6.12.23` | GhostLock-for-OnePlus | Tested |
| OnePlus 15 | PLK110 | `6.12.58` | [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) | Tested |
| OnePlus 15 | CPH2745, CPH2747, CPH2749 | `6.12.23` | ghostlock-oneplus | Tested |
| OnePlus 13 | CPH2653, IN2060 | `6.6.89` | ghostlock-oneplus | Tested |
| OPPO K15 Pro+ | PMG110 | `PMG110_16.0.9.400(CN01)`, `6.6.118-android15-8-g93e223c276e7-abogki500782043-4k` | [Root My Device](https://github.com/WitAqua-tools/Root-My-Device) | Experimental |
| OPPO Pad 4 Pro | — | `6.6.89` | ghostlock-oneplus, GhostLock App | Tested |
| OnePlus 15T | PLZ110 | `6.12.38` | GhostLock App | Reported |
| OPPO Find X8, Find X8 Pro | — | `6.6.118` | GhostLock App | Reported |
| OPPO Find X8 Ultra, OnePlus 13, Ace 5 Pro | — | `6.6.118` | GhostLock App | Reported |
| OPPO Find N5 | — | `6.6.118` | GhostLock App | Reported |
| OPPO Pad 5, OnePlus Pad 2, Find X8s | — | `6.6.118` | GhostLock App | Reported |
| Realme GT 7T | RMX5085 | `6.6.118` | [ghostlock-rmx5085](https://github.com/Nixbones/ghostlock-rmx5085) | Reported |

Several rows share a model name with different kernels. That is intentional: the payload is tied to the build, not the product name.

Root My Device's K15 Pro+ target ships in its feed, but the payload repository says its own build has not completed a run; the chain was verified on that firmware in a separate port.

### vivo and iQOO

[RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) matches the full kernel release from its [payload catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/support/targets-vivo.json). It requires 6.6 builds below 6.6.139 and 6.1 builds below 6.1.144 for its ports.

| Device | Model | Kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| iQOO Neo 11 | PD2520, PD2520A–E, V2520A | `6.6.89` | RootMyVivo | Tested |
| iQOO Z10 Turbo Pro | PD2453, PD2453A, V2453A | `6.6.89` | RootMyVivo | Tested |
| iQOO 13 India | I2401 | `6.6.89` | RootMyVivo | Experimental |
| iQOO Neo10 Pro | PD2426, PD2426A, V2426A | `6.6.89` | RootMyVivo | Experimental |
| vivo X200, X200 Pro | PD2415, PD2405 and regional variants | `6.6.89` | RootMyVivo | Experimental |
| iQOO Z9 5G | I2302 | `5.15.178` | [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock) | Reported |
| vivo T3 5G | V2334 | `5.15.178` | iQOO Z9 / vivo T3 port | Reported |
| vivo X200 Pro | — | `6.6.30` | GhostLock App | Reported |
| vivo T4, iQOO 12 | — | `6.1.145` | GhostLock App | Reported |

RootMyVivo's README also lists `6.6.127` for the iQOO Neo 11, but its payload metadata describes that build's `remove_waiter()` as already fixed. Check the catalog entry before running on that release.

### Xiaomi, POCO, Redmi

Most rows are [GhostLock App](https://github.com/YuKongA/ghostlock-app) kernel profiles. The app matches the complete `uname -r`; the [profile table](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) carries the full strings.

| Device | Codename or model | Kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| Xiaomi 17, 17 Pro, 17 Pro Max, 17 Ultra | — | `6.12.23` | GhostLock App | Reported |
| Xiaomi 17T | — | `6.6.102` | GhostLock App | Reported |
| Xiaomi 17T Pro Japan | warhol | `OS3.0.304.0.WPSJPXM`, `6.12.38` | Root My Device | Tested |
| Xiaomi 14T Japan | XIG07 | `OS3.0.7.0.WNEJPKD`, `6.1.138` | Root My Device | Tested |
| Xiaomi 15 | — | `6.6.77` | GhostLock App | Reported |
| Xiaomi 15 Pro, Redmi K80 Pro, K80 Ultra | — | `6.6.77` | GhostLock App | Reported |
| Xiaomi 14 | — | `6.1.118`, `6.1.138` | GhostLock App | Reported |
| Xiaomi 13T | — | `6.12.38` | GhostLock App | Reported |
| Xiaomi Civi 5 Pro, Redmi K90, K90 4 Turbo, POCO F7 | — | `6.6.77` | GhostLock App | Reported |
| Redmi K90 Pro Max | — | `6.12.23` | GhostLock App | Reported |
| Redmi K90 Ultra | — | `6.6.118` | GhostLock App | Reported |
| Redmi K80 | — | `6.1.138` | GhostLock App | Reported |
| POCO X6 Pro | — | `6.1.115`, `6.1.138` | GhostLock App | Reported |
| POCO X8 Pro | — | `6.6.89` | GhostLock App | Reported |
| POCO X8 Pro Max | — | `6.6.89`, `6.6.118` | GhostLock App | Reported |
| POCO F7 | — | `6.6.77`, `6.6.118` | GhostLock App | Reported |
| POCO M6 Pro 4G | emerald | `6.12.30-android16-5`, 4K pages | [ghostlock-emerald](https://github.com/datfooldive/ghostlock-emerald) | Reported |
| Redmi Note 15 Pro+ | — | `6.1.118` | GhostLock App | Reported |
| Redmi Note 14 Pro 5G, POCO X7 | — | `6.1.138` | GhostLock App | Reported |
| Redmi Note 13 5G | — | `6.6.118` | GhostLock App | Reported |
| Redmi Note 15 4G | — | `6.12.30` | GhostLock App | Reported |
| Redmi 15C 4G, POCO C85 4G | — | `6.6.89` | GhostLock App | Reported |
| Xiaomi Pad 7 Ultra | — | `6.6.118` | GhostLock App | Reported |
| Redmi Turbo 5 Max | — | `6.6.118` | GhostLock App | Reported |

### Nothing, Meizu, Sony, ASUS, Motorola

| Device | Model or codename | Build or kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| Nothing Phone (3a) Pro | A059P | `6.1.157-android14-11` | GhostLock App | Reported |
| Nothing Phone (3a) | A059, Asteroids | `B4.1-260618-1048`, `B4.1-260810-1153`, `6.1.157-android14-11-g82d681c9b06b-ab14634535` | [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) | Tested |
| Nothing Phone (3) | — | `6.6.102` | GhostLock App | Reported |
| Nothing Phone (1) | spacewar | `5.4.302` | [Root My Nothing](https://github.com/ang3lo-azevedo/root-my-nothing) | Experimental |
| Meizu 21 | M2461, meizu21 | `6.1.25-android14-11` | [Meizu 21 GhostLock](https://github.com/ymh001/meizu21-ghostlock-root), GhostLock App | Reported |
| Meizu 21 Pro | — | `6.1.25-android14-11` | GhostLock App | Reported |
| Meizu 20 Pro | — | `5.15.41` | GhostLock App | Reported |
| Sony Xperia 1 V | — | `5.15.189` | GhostLock App | Reported |
| ASUS Zenfone 10 | — | `5.15.206` | GhostLock App | Reported |
| ASUS Zenfone 11 Ultra | — | `6.1.162` | GhostLock App | Reported |
| ASUS Zenfone 9 | ASUS_AI2202 | `5.10.205-android12-9` | [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock) | Reported |
| Motorola Razr 50 Ultra, Razr+ 2024 | — | `6.1.145` | GhostLock App | Reported |
| Motorola Edge 60 Fusion | — | `6.1.145` | GhostLock App | Reported |
| Motorola Razr 60 Ultra | — | `6.6.118` | GhostLock App | Reported |
| Motorola Edge 40 | — | `6.6.127` | GhostLock App | Reported |
| Motorola Razr Fold | — | `6.12.38` | GhostLock App | Reported |

Nothing Phone (3a) build `C5.0-260915-2123` (Android 17) is allowlisted by its port, but the root flow on that build is not verified. The Nothing Phone (1) chain is still incomplete upstream.

### Honor, Infinix, TECNO, Lenovo, ZTE

| Device | Kernel | Loader | Status |
| --- | --- | --- | --- |
| Honor Magic V5 | `6.6.89`, three firmware builds | GhostLock App | Reported |
| Infinix Note 50s 5G, Infinix GT 30 | `6.1.145` | GhostLock App | Reported |
| Infinix GT 30 Pro | `6.1.157` | GhostLock App | Reported |
| TECNO POVA 7 4G | `6.12.38` | GhostLock App | Reported |
| Lenovo Xiaoxin Pad Pro 12.7 | `6.1.138` | GhostLock App | Reported |
| Lenovo Yoga Tab Plus | `6.1.138` | GhostLock App | Reported |
| Lenovo Legion Tab Gen 5 China | `6.12.30` | GhostLock App | Reported |
| Lenovo Legion Y700 Wuji | `6.12.38` | GhostLock App | Reported |
| ZTE Nubia NX809J, NX888J | `6.12.38` | GhostLock App | Reported |

### Amazon, NVIDIA, Meta

| Device | Codename | Build or kernel | Loader | Status |
| --- | --- | --- | --- | --- |
| Amazon Fire Max 11 | sunstone | Fire OS 8.3.3.8 `RS8338.3339N`, `5.10` | [GhostLock-5.10](https://github.com/R0rt1z2/GhostLock) | Tested |
| Fire TV Stick 4K Max 2023 | karat | Fire OS 8.1.8.2 `RS8182.3811N`, `5.10` | GhostLock-5.10 | Tested |
| NVIDIA Shield TV Pro 2019 | mdarcy | Shield Experience 9.2.4, `4.9.141-tegra-gb6e5605a` | [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4) | Tested |
| Meta Quest 3 | eureka | `5.10.240-g55be3759aea4`, incremental `52345320035400520` | Root My Device | Tested |
| Meta Quest 3 | eureka | `5.10.240-g69827d40d782`, incremental `52168470043600520` | [IonStackQuest3](https://github.com/F-19-F/IonStackQuest3) | Reported |
| Meta Quest 3S | — | builds listed in the port | IonStackQuest3 | Reported |

The Shield port changes the live `adbd` credentials instead of installing a manager: root survives ADB client disconnects but not an `adbd` restart, and the included APK re-runs the exploit at boot. Meta fixed GhostLock in Quest 3 incremental `52345320040100520` and Quest 3S incremental `3697600032300610`; later builds are not vulnerable to this chain.

### Not feasible, broken, or in progress

| Device or build | Loader | Reason | Status |
| --- | --- | --- | --- |
| OPPO Find X9 Ultra, `6.12.58` | ghostlock-oneplus | PGO layout puts the futex waiter outside the controllable stack region | Not feasible |
| OnePlus 15 PLK110, `6.12.69` | ghostlock-oneplus | PGO inlines `do_futex`; waiter lands past the controllable region | Not feasible |
| OnePlus 12, `6.1.141` | ghostlock-oneplus | PGO inlines `do_futex`; waiter word 13 or 19 | Not feasible |
| OPPO Pad 5, `6.1.134` | ghostlock-oneplus | Waiter word 13 (OPLUS 6.1) | Not feasible |
| Motorola Edge 60 Fusion, `6.1.145` | ghostlock-oneplus | Waiter word 13, outside the controllable region; GhostLock App carries a profile for this release but no report | Not feasible |
| iQOO Neo 10 China, `6.1.84` | ghostlock-oneplus | `do_futex` frame `0xD0` puts the waiter word at -11 | Not feasible |
| OPPO PKW110, `5.15.180` | ghostlock-oneplus | `do_futex` frame `0x140` puts the waiter word at -29 | Not feasible |
| OnePlus 13R, Ace 5, `6.1.x` | ghostlock-oneplus | OPLUS 6.1; waiter word 13 | Not feasible |
| Realme RMX5070, `6.1.141` | ghostlock-oneplus | OPLUS 6.1; waiter word 13 | Not feasible |
| OPPO CPH2763, `6.1.115` | ghostlock-oneplus | PGO inlined; waiter word 24 | Not feasible |
| iQOO 12, `6.1.145` | ghostlock-oneplus | Waiter word 9, with task and lock in the zeroed area; GhostLock App carries a profile for this release | Not feasible |
| iQOO Z9 5G, `5.15.178` | ghostlock-oneplus | `do_futex` frame too large; a separate device port ships a payload for this build (see the vivo table) | Not feasible |
| Nothing Phone (1) | Root My Nothing | End-to-end chain not complete | Experimental |
| Galaxy S25 FE | [ghostlock-s25fe](https://github.com/ruik-tech/ghostlock-s25fe) | WIP port; the repository now documents an S26-series port | Experimental |

A model can appear in a working row and in this table. Different builds, different routes, and different projects do not transfer.

## Tools and managers

A temporary root setup needs a loader, a KernelSU-compatible manager, and whatever transport the loader uses. Some apps bundle all three.

### Exploit loaders and device-specific ports

| Tool | Bug | Coverage | Transport | Notes |
| --- | --- | --- | --- | --- |
| [DirtyFrag](https://github.com/mitschud/DirtyFrag) | DirtyFrag | Samsung and other KMIs the app ships modules for | On-device | Hardened DFRoot fork; module toggle, autorun, auto soft reboot, RO partition protection, log export |
| [DFRoot](https://github.com/diabl0w/DFRoot) | DirtyFrag | Broad; manager-agnostic | On-device | Minimal upstream chain |
| [GhostSam](https://github.com/MocLG/GhostSam) | Both | Galaxy S22, S26, Z Fold8 series | ADB | Series build tables; DirtyFrag path needs no race |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) | GhostLock | Meizu, Sony, ASUS, Xiaomi, OPPO, OnePlus, Honor, Motorola, Nothing, Pixel profiles | On-device; Shizuku optional | Exact `uname -r` match; profile import and CLI tools |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) | GhostLock | Selected Galaxy builds | On-device; Shizuku for some profiles | Payloads and feed live in the [payload repository](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads) |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) | GhostLock | Pixel 6 through Pixel 11 | Shizuku | Race; retries common |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) | GhostLock | vivo and iQOO | Shizuku first run, then ADB TCP 5555 | Payload catalog is fetched at runtime |
| [Root My Device](https://github.com/WitAqua-tools/Root-My-Device) | GhostLock | OPPO K15 Pro+, Xiaomi 17T Pro, Xiaomi 14T Japan, Meta Quest 3 | On-device | Exact feed match on kernel, build, SDK, ABI, page size |
| [Root My S24](https://github.com/NanoTurtle1145/root-my-s24) | GhostLock | Galaxy S24 China/HK/TW, Z Fold6 China | Shizuku or wireless debugging | Uses the official KernelSU manager |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | GhostLock | Galaxy Z Fold6 SM-F9560 builds | ADB or Shizuku | Three registered kernels |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) | GhostLock | OnePlus and some OPPO builds | ADB | Also documents infeasible layouts |
| [GhostLock-for-OnePlus](https://github.com/p2p3p/GhostLock-for-OnePlus) | GhostLock | Ace 6T, OnePlus 15 PLK110 | ADB | Verified kernels only |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) | GhostLock | Galaxy A17 SM-A175F | ADB | Ends in a per-boot root shell, not a manager |
| [GhostLock-5.10](https://github.com/R0rt1z2/GhostLock) | GhostLock | Fire Max 11, Fire TV Stick 4K Max 2023 | ADB | Root shell plus a local bind shell; disables OTA after success |
| [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4) | GhostLock | Shield TV Pro 2019 | ADB | UID 0 `adbd`, no `su` manager |
| [IonStackQuest3](https://github.com/F-19-F/IonStackQuest3) | GhostLock | Quest 3 and 3S on listed incrementals | ADB | Meta fixed newer builds |
| [DirtyInit](https://github.com/combeng6th/DirtyInit) | DirtyFrag | Samsung devices with the primitive | ADB relay | init-context toolkit; not a KernelSU route |
| [Root My Nothing](https://github.com/ang3lo-azevedo/root-my-nothing) | GhostLock | Nothing Phone (1) | On-device | In progress; end-to-end chain not complete |
| [KSuRoot](https://github.com/hmascs/KSuRoot) | GhostLock | Multi-device repack | On-device | Archived; payload bundle not audited |

### DirtyFrag KMI modules

GhostSam ships one DirtyFrag module per KMI and marks its set as follows. DirtyFrag also builds its modules per KMI; check its release assets for the set it includes. A KMI is not a device profile: two phones on `android15-6.6` can still differ in kernel commit, page size, and vendor hardening.

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

Other device-specific ports:

- [ghostlock-emerald](https://github.com/datfooldive/ghostlock-emerald) — POCO M6 Pro 4G.
- [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock) — ASUS Zenfone 9.
- [ghostlock-rmx5085](https://github.com/Nixbones/ghostlock-rmx5085) — Realme GT 7T.
- [Meizu 21 GhostLock](https://github.com/ymh001/meizu21-ghostlock-root) — Meizu 21.
- [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock) — iQOO Z9 5G, vivo T3 5G.
- [ghostlock-xringo1](https://github.com/ayyy7128/ghostlock-xringo1) — XRING O1 on `6.6.77` and `6.6.118`.
- [SM-A166W port](https://github.com/jojobear691/SM-A166W-DZG1-Temporary-Root) — Galaxy A16 5G.
- [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) — Nothing Phone (3a).

A multi-device repack can bundle legitimate payloads and still add code. Do not treat one as a trusted upstream, and do not grant root to a loader you cannot identify.

### Root managers

| Manager | What it is | Use it for |
| --- | --- | --- |
| [KernelSU](https://github.com/tiann/KernelSU) | Upstream kernel-based root manager | GKI devices; late-load support |
| [KernelSU-Next](https://github.com/KernelSU-Next/KernelSU-Next) | KernelSU fork | Devices a loader names it for |
| [KowSU](https://github.com/KOWX712/KernelSU) | KernelSU fork | Alternative manager for loaders that support it |
| [BakaSU](https://github.com/Baka-SU/BakaSU) | KernelSU fork, formerly ReSukiSU | Pixel profiles and other targets that name it |
| [diabl0w KernelSU](https://github.com/diabl0w/KernelSU) | Samsung-patched KernelSU | Samsung DirtyFrag and several Galaxy ports |

The manager must ship `libksud.so`. DirtyFrag 1.10 and later stages `ksud` from the selected manager, so a manager without that library cannot produce root. On Samsung, use diabl0w's build. A manager alone does not provide temporary root.

Do not use a manager's install, flash, or patch-boot-image actions on a locked phone. Those actions write protected partitions and are a documented hardbrick path.

### Transport and helpers

| Tool | What it does | Why it matters |
| --- | --- | --- |
| [Shizuku](https://github.com/RikkaApps/Shizuku) | ADB-privileged API bridge, runs as UID 2000 | Several loaders stage payloads through it. It is not root. |
| [Android Platform Tools](https://developer.android.com/tools/releases/platform-tools) | `adb`, `fastboot` | Build checks, logs, sideloading, uninstall recovery |
| [Termux](https://github.com/termux/termux-app) | Terminal emulator | `uname -r`, `su`, and on-device checks |
| [Obtainium](https://github.com/ImranR98/Obtainium) | APK updates from GitHub releases | Keeps loaders on the maintainer's release channel |

### Verifying a download

- Download from the project's own release page. Avoid reuploads, Telegram mirrors, paid builds, and remote-root services.
- Check the release tag and date, and compare published hashes or signing certificates when the project provides them.
- Build from source when you can. A clean VirusTotal result is not proof that an exploit APK is safe.

### Porting

Every loader is built around device-specific offsets. A generated profile is a candidate, not a supported device. Start with the [GhostLock App porting guide](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/README.md), the [Root My Galaxy payload notes](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads), or the [ghostlock-oneplus README](https://github.com/JoinChang/ghostlock-oneplus). Publish a device as supported only after the chain completes on hardware.

## Modules

Late-loaded KernelSU is not a normal boot-time install. It has no `init.rc` injection, no module `preinit`, no `post-fs-data` event, and no `ksud` kprobe hooks; safe-mode detection and boot-log capture are disabled. `late-load.d`, `post-mount.d`, `service.d`, and `boot-completed.d` scripts still run.

That means modules which mount a file or hook an app at runtime can work. Modules that run before `system_server`, replace a boot script, inject into `init.rc`, or write a partition cannot, and some fail by bootlooping the device. Samsung's DEFEX path rules and KDP add another way for a module that works on a Pixel to fail on a Galaxy.

| Status | Meaning |
| --- | --- |
| **Working** | Reported working on temporary root by the [upstream module list](https://github.com/rushiranpise/temporal-root-modules-list) or a community test. |
| **Caveat** | Works with a known bug, instability, or setup requirement. |
| **Broken** | Reported not working; several entries reboot the phone. |
| **Avoid** | Known hardbrick or serious failure on a locked device. |
| **Reported** | A community report that has not been reproduced widely. |
| **Outdated** | Superseded or unmaintained. |

The upstream list is the maintained source. The tables below keep this index's earlier notes. Most module reports here come from one device: a Galaxy S25 `SM-S931B` on One UI 8.5 with Root My Galaxy. Treat them as starting points, not device-independent results.

### Working or caveated

| Module | Category | What it does | Status | Notes |
| --- | --- | --- | --- | --- |
| [LSPosed](https://github.com/LSPosed/LSPosed) | Framework | Xposed framework | Working | Needs a Zygisk provider. GPS can misbehave. Scope changes need a soft reboot. |
| [ZygiskNext](https://github.com/Dr-TSNG/ZygiskNext) | Framework | Zygisk implementation for KernelSU | Working | The provider paired with LSPosed here; the upstream list still calls it buggy. Version matters. |
| [Vector](https://github.com/JingMatrix/Vector/releases) | Framework | LSPosed fork | Caveat | Confirmed buggy; random soft reboots reported. |
| [AdClose](https://github.com/zjyzip/AdClose) | Ads | Blocks ads and app limits through Xposed | Working | |
| [AdGuard Certificate](https://github.com/AdguardTeam/adguardcert) | Ads | HTTPS filtering certificate as a module | Working | |
| [AFWall+](https://github.com/ukanth/afwall) | Firewall | iptables firewall app | Working | Root app. A bad rule can cut off ADB. |
| [bindhosts](https://github.com/bindhosts/bindhosts) | Ads | Systemless hosts | Working | |
| [Discover Ads Filter](https://github.com/hxreborn/discover-ads-filter) | Ads | Removes ads from Google Discover | Working | |
| [amznkiller](https://github.com/hxreborn/amznkiller) | App mods | Removes Amazon app ads | Working | |
| [Facebook App Ads Remover](https://github.com/Loukious/FacebookAppAdsRemover) | App mods | Removes Facebook app ads | Working | |
| [NexAlloy](https://github.com/nexalloy/NexAlloy) | App mods | App modification toolkit | Working | |
| [Re:X](https://github.com/Xposed-Modules-Repo/one.dot.rex) | App mods | Xposed module for X | Working | |
| [ReVancedXposed_Spotify](https://github.com/TheWinner02/ReVancedXposed_Spotify) | App mods | Spotify patches | Working | |
| [WaDeepDark](https://github.com/Dhangofa/WaDeepDark) | App mods | WhatsApp theming | Working | |
| [YouTube ReVanced](https://github.com/Zy0x/YouTube-Revanced/) | App mods | YouTube patches | Working | Check reports before updating. |
| [IAmNotADeveloper](https://github.com/xfqwdsj/IAmNotADeveloper) | Patches | Hides developer-options state | Working | |
| [Migrate-OSS](https://github.com/BaltiApps/Migrate-OSS) | Patches | Backup and migration | Working | |
| [pairipfix](https://github.com/mezo123451A/pairipfix) | Patches | Bypasses PairIP signature checks | Working | |
| [Update Locker](https://github.com/Xposed-Modules-Repo/ru.mike.updatelocker/) | Patches | Stops selected apps from updating | Working | |
| [Zygisk Detach](https://github.com/j-hc/zygisk-detach) | Patches | Detaches apps from the Play Store | Working | Needs a working Zygisk provider. |
| [CorePatch](https://github.com/LSPosed/CorePatch) | Patches | Disables signature verification | Caveat | Confirmed buggy; soft-bootloop reports. Keep the module-disable switch reachable. |
| [DuckUSB](https://github.com/Bouteillepleine/DuckUSB) | Files and USB | Hides USB debugging from scoped apps | Working | |
| [MT Manager](https://mt2.cn/download/) | Files and USB | File manager and APK editor | Working | Do not edit system files on a locked phone. |
| [OneUI Settings Hook](https://github.com/HeheJuice/OneUI-Settings-Hook) | One UI | Adds and changes One UI settings | Working | Samsung only. |
| [OneUIX](https://github.com/SoClear/OneUIX) | One UI | One UI customization | Working | |
| [App Manager](https://github.com/Muntashirakon/AppManager) | System | Package manager and debloat tool | Working | |
| [net-switch](https://github.com/Rem01Gaming/net-switch) | System | Network mode switching | Working | |
| [Scene](https://omarea.com/) | System | Performance and battery profiles | Working | Avoid kernel or voltage changes. |
| [Frosty](https://github.com/Drsexo/Frosty) | System | Battery and Google services optimization | Caveat | Buggy; possible wake-lock issues. |
| [ViPERFX_RE](https://github.com/likelikeslike/ViPERFX_RE) | Audio | ViPER4Android audio processing | Caveat | Follow its install order; it expects KernelSU. |

### Broken

| Module | What happens | Status |
| --- | --- | --- |
| [Enable Screenshot (Disable FLAG_SECURE)](https://github.com/Xposed-Modules-Repo/io.github.lsposed.disableflagsecure) | Reboots the device on the test build. | Broken |
| [PrivacySpace](https://github.com/Xposed-Modules-Repo/cn.geektang.privacyspace) | Does not work. | Broken |
| [NeoZygisk](https://github.com/JingMatrix/NeoZygisk) | Reboots the device. | Broken |
| [ReZygisk](https://github.com/PerformanC/ReZygisk) | Reboots the device. | Broken |
| [Treat-Wheel-Zygisk](https://github.com/PerformanC/Treat-Wheel-Zygisk) | Reboots the device. | Broken |

Use ZygiskNext as the provider with LSPosed. Three alternative Zygisk implementations reboot the phone in these reports, so do not swap providers "for stability" without current ones.

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
| [HMA](https://github.com/frknkrc44/HMA-OSS) | Hides apps from selected apps | Reported | Needs a soft restart to start its service. |
| [Tailscale module](https://github.com/anasfanani/magisk-tailscaled) | Runs Tailscale as a root service | Reported | Worked for at least one user. |
| [Crond4Android](https://github.com/powerAn2020/crond4android) | Cron daemon with a UI | Reported | |
| [Sui](https://github.com/XiaoTong6666/Sui) | Alternative superuser interface | Reported | Do not run it alongside KernelSU without reading both projects. |
| [pm-install-from-anywhere](https://github.com/1ndevelopment/pm-install-from-anywhere) | Lets `pm` install APKs from any path | Reported | |
| [CaptureSposed](https://github.com/99keshav99/CaptureSposed) | Disables Android 14 screenshot detection | Reported | Conflicts with the Enable Screenshot failure report. |

### Reducing module risk

1. Confirm `su -c id` works and the manager opens.
2. Install one module, then soft reboot.
3. Check the feature it changes. Add the next module only after that passes.

Do not install LSPosed, a Zygisk provider, three Xposed modules, and a kernel tweaker in one pass. If the phone bootloops, you will not know which one caused it, and the manager may be unreachable.

If a loader offers autorun, leave it off until the module set is known good: autorun plus a bootlooping module re-runs the failure on every boot. Grant root per app and revoke it when the session ends.

Indexes for finding modules: the [LSPosed module repository](https://modules.lsposed.org/) and [MMRL](https://github.com/MMRLApp/MMRL). Neither tests for late-load compatibility.

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

2. **Match the exact build upstream.** Find the device in [Supported devices](#supported-devices), then confirm the model, build, and kernel in the loader's own support list. If the project does not list your build, stop. Do not try the closest one.

3. **Back up and plan recovery.** Copy data you cannot lose, and know how to reach safe mode, download mode, or a service center for that model before you run anything.

4. **Install the manager the loader names.** Open it once so its services are registered. Do not use its install, flash, or patch-boot-image actions. On Samsung with DirtyFrag, use diabl0w's KernelSU build.

5. **Run the loader.** Install it from the upstream release page, grant the permissions or transport it asks for, confirm it detected the expected model and kernel, then start the run and keep it in the foreground. Do not start a second run while the first is still working.

6. **Verify, then test modules one at a time.**

   ```bash
   adb shell su -c id
   ```

   Expected output starts with `uid=0(root)`. The SELinux context can differ. If `su` is missing, the exploit may have completed while the late-load failed; see [Troubleshooting](#troubleshooting-and-faq). Install one module, soft reboot, and test. A soft reboot keeps root; a full reboot clears it. Use the manager's soft-reboot action rather than `adb reboot`.

Nothing in this workflow flashes, patches, or installs a boot image. If a guide asks you to, it is a permanent-root procedure.

## Troubleshooting and FAQ

### Troubleshooting

<details>
<summary>GhostLock panics or reboots instead of finishing</summary>

A GhostLock panic is a failed attempt at a race, not by itself a brick. Wait for the phone to reboot, then retry if the build is supported. Stop if it panics at the same stage every time, if it bootloops with modules disabled, or if it becomes unusually hot.

A DirtyFrag panic more often points to a wrong KMI, a profile mismatch, or vendor hardening rather than timing.

</details>

<details>
<summary>Samsung shows "reboot device - d2" or will not enter download mode</summary>

There are two causes. The download-mode gate on One UI 8.5 and later refuses download mode while a lock-screen credential is set; Android still boots. Remove the screen lock, power off, hold Volume Up and Volume Down together, then connect USB. Some users report that enabling Maintenance Mode first has the same effect.

A modified protected image is different: the bootloader rejects it and Android does not boot. Key combinations will not help. If the phone does not enumerate over USB, contact Samsung or a repair service. If download mode opens, flash signed stock firmware for the exact model and region with Odin. Do not mix firmware from another model, and do not use a "D2 bypass" APK.

</details>

<details>
<summary>ADB does not list the device or says unauthorized</summary>

Check the cable, port, and USB debugging setting, then run `adb devices` again. For `unauthorized`, unlock the phone and accept the RSA prompt. For `no devices`, try another cable and port and check `lsusb`. Wireless debugging must be paired before it appears.

</details>

<details>
<summary>The loader reports "not vulnerable" or "patching failed"</summary>

The kernel is patched, the vendor backported a fix, or the build has an accidental mitigation. There is no app-side fix, and downgrading firmware on a locked phone can wipe data or brick it. Check the upstream issue tracker and stop.

</details>

### FAQ

<details>
<summary>Does temporary root survive a full reboot?</summary>

No. A full reboot loads the stock kernel, unloads the module, and removes the `su` daemon and module mounts. Files under `/data/adb` can remain but are inactive. If the build is still supported, run the loader again.

</details>

<details>
<summary>Does a soft reboot keep root?</summary>

Usually. A soft reboot restarts Android's userspace and `system_server`, not the Linux kernel, so the late-loaded module stays and module mounts reactivate. That is why module installs often ask for one. `adb reboot` is a full reboot.

</details>

<details>
<summary>Does the method unlock the bootloader or wipe data?</summary>

No. It does not unlock the bootloader, and there is no unlock-induced wipe. A failed run, a module bootloop, or a recovery attempt can still cost data, so back up first.

</details>

<details>
<summary>How do I know whether my device is supported?</summary>

Record the model code, build display ID, and full `uname -r`, find the device in [Supported devices](#supported-devices), then confirm the target in the loader's own support list. The table is a map; the project is the authority. If the exact build is missing, stop.

</details>

<details>
<summary>Why does the exact kernel build matter?</summary>

Offsets come from a specific `vmlinux` or boot image. Stack layout moves with compiler optimization, LTO, and PGO. A 4K-page profile does not cover a 16 KB page build. Vendor hardening such as KDP, DEFEX, and RKP changes the escalation path, and a vendor can backport the fix without changing the version string. An OTA can move the build or close the bug, so recheck before updating.

</details>

<details>
<summary>Do I need a computer or Shizuku?</summary>

Not always. DirtyFrag, Root My Galaxy, GhostLock App, RootMyVivo, and Root My Device can run on the phone itself. Root My Pixel needs Shizuku, which can be started over wireless debugging without a PC. Some profiles need a one-time ADB setup, and command-line ports are easier from a computer. Shizuku is an ADB bridge, not root.

</details>

<details>
<summary>Which root manager should I install?</summary>

The one the loader documents. It must ship `libksud.so`, because DirtyFrag 1.10 and later stage `ksud` from the selected manager. Samsung DirtyFrag requires diabl0w's KernelSU build; Root My Pixel expects the BakaSU/ReSukiSU manager named in its README. A manager alone does not give temporary root.

</details>

<details>
<summary>Which modules can work?</summary>

Modules that mount files or hook apps at runtime, using the late-load stages that remain available. Modules that need early boot, `init.rc`, `post-fs-data`, a kernel driver, or a partition write generally cannot. See [Modules](#modules), install one at a time, and keep the loader's module-disable switch reachable.

</details>

<details>
<summary>Root is missing after a run that looked successful</summary>

The exploit likely completed and the late-load failed. Check that you installed the manager the loader names, that it ships `libksud.so`, that it was selected in the loader, and that the KMI matches. Disable auto reboot if it is on, then run again and read the log. If the log shows a patched kernel or a profile mismatch, stop.

</details>

<details>
<summary>What do I do after a module bootloop?</summary>

A full reboot clears root and the kernel module. Open the loader, set modules to disabled, run it again, and remove the module. DirtyFrag's module switch works without root.

If Android does not start, try safe mode (hold Volume Down during boot; Android may also offer it after repeated crashes). Safe mode may not disable a late-loaded kernel module, so the loader switch remains the reliable path. On a user build, `adb uninstall <loader-package>` removes the loader without root. If the phone does not enumerate over USB and neither recovery nor download mode opens, stop and seek service support.

</details>

<details>
<summary>Will banking apps or Play Integrity work?</summary>

Maybe, but nothing here guarantees it. A locked bootloader helps some checks, while root, manager packages, module files, and SELinux state are all detectable. Strong integrity verdicts usually fail. Test the app before you depend on it.

</details>

<details>
<summary>How do I report a new device or module result?</summary>

Open an issue or pull request with the exact model, build, full `uname -r`, Android version, loader and manager versions, module version, result, and the relevant log tail. The format is in [Contributing](#contributing-and-disclaimer). One reproducible result is worth more than a list of guesses.

</details>

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
Result:        <Tested, Reported, Experimental, Broken, or Not feasible>
Notes:         <what failed, retries, panics, or side effects>
```

For a failure, include the last 50 lines of the loader log, with personal paths and account names removed. Keep the error text and the stage where it stopped.

### Status rules

Use the labels defined in [Supported devices](#supported-devices) and [Modules](#modules). Do not upgrade a label because a device is popular, and do not downgrade a failure because it worked once for someone else. A disputed row keeps the lower status until someone reproduces the result.

### What helps

- Device reports for builds missing from [Supported devices](#supported-devices).
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

### Sources

- CVE records: [CVE-2026-43284](https://nvd.nist.gov/vuln/detail/CVE-2026-43284), [CVE-2026-43499](https://nvd.nist.gov/vuln/detail/CVE-2026-43499). KernelSU: [module guide](https://kernelsu.org/guide/module.html), [bootloop rescue](https://kernelsu.org/guide/rescue-from-bootloop.html).
- Device and profile feeds: [Root My Galaxy payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads), [GhostLock App supported devices](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md), [RootMyVivo catalog](https://github.com/zenyxx-xd/RootMyVivo-Payloads/blob/main/support/targets-vivo.json), [Root My Device payloads](https://github.com/WitAqua-tools/Root-My-Device-Payloads).
- Module status: [Temporal Root Modules List](https://github.com/rushiranpise/temporal-root-modules-list), [XDA testing thread, now closed](https://xdaforums.com/t/list-of-modules-working-on-temporal-root.4796105/).
- Background: [awesome-android-root](https://github.com/awesome-android-root/awesome-android-root), [NebuSec IonStack](https://github.com/NebuSec/CyberMeowfia/tree/main/IonStack/CVE-2026-43499).
