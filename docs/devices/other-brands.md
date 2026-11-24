---
title: Other Brands
description: Temporary-root ports and GhostLock kernel profiles for Motorola, Lenovo, Sony, Huawei, TECNO, Infinix, RedMagic, Sharp, and Boox devices.
---

# Other brands

Huawei, Motorola, Lenovo, Sony, TECNO, Infinix, RedMagic (Nubia), Sharp, and Boox devices are covered by single-device ports and by the kernel-profile list in [GhostLock App](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md). A profile only names a kernel string. It is not a hardware result, so the second table marks those rows as candidates.

Honor and Huawei share some kernel lines but not firmware or signing, so Honor ports stay on the [Honor](./honor.md) page. Amazon, NVIDIA, Meta, Meizu, Rokid, and TCL stay on the [Amazon, NVIDIA, Meta, Meizu, Rokid, and TCL](./other.md) page.

## Status definitions

| Status | Meaning |
| --- | --- |
| <kbd>Tested</kbd> | Hardware run documented by the upstream loader project on this exact target. |
| <kbd>Experimental</kbd> | Partial, shell-only, or unstable result. |
| <kbd>Upstream profile</kbd> | Device kernel profile shipped upstream with no documented hardware run yet. |
| <kbd>Not supported</kbd> | Hardware run on this exact build reported no root. |
| <kbd>Deprecated/unavailable</kbd> | Upstream loader or repository is archived or removed. |

## Supported builds

| Device / status | Model or codename | Build or kernel / loader |
| --- | --- | --- |
| Lenovo Tab Pro GT (China)<br><kbd>Tested</kbd> | TB710FU (SM8650) | `6.1.128-android14-11-g5c2cea985a84-ab13606743` (Android 16, 4 KB pages)<br>Loader: [cve-2026-98260-tb710fu](https://github.com/aoxzh/cve-2026-98260-tb710fu) (`CVE-2026-98260`, on-device Shizuku app; patches the `.ko` on-device for kallsyms, vermagic, and `__versions`; manager reports `Working [Jailbreak mode]`) |
| Lenovo Legion Y700 (TB320FC)<br><kbd>Tested</kbd> | TB320FC (SM8475 / cape) | ZUX OS `1.1.350`, `5.10.209-android12-9-gef44381c3e04-ab50`<br>Loader: [tb320fc-temp-root](https://github.com/armyja/tb320fc-temp-root) (GhostLock one-tap app; rejects any other `uname -r`) |
| Huawei P50 Pro<br><kbd>Tested</kbd> | JAD-AL00 | HarmonyOS `3.0.0.205` / `4.0.0.132` / `4.2.0.211`, `5.4.86-qgki` (two `-dirty` builds per release)<br>Loader: [GhostLock-P50Pro-JAD-AL00](https://github.com/anVzdGFtb25/GhostLock-P50Pro-JAD-AL00) (GhostLock plus a KernelSU LKM loader; the manifest refuses unknown kernels) |
| Huawei MatePad 11 (2021)<br><kbd>Experimental</kbd> | DBY-W09 | HarmonyOS `4.2.0.213`, `4.19.157`<br>Loader: [GhostLock-MatePad11](https://github.com/natsuu233/GhostLock-MatePad11) (research-only chain; other builds need their own offset calibration) |
| Huawei TEL-AN10<br><kbd>Experimental</kbd> | TEL-AN10 (Kirin 810) | `4.14.116`<br>Loader: [ghostlock-tel-an10](https://github.com/XuexGao/ghostlock-tel-an10) (4.14 trigger and exploit offsets from the device `System.map`; full chain port still in progress) |
| Sony Xperia 1 VI<br><kbd>Tested</kbd> | XQ-EC72 family (model not supplied) | `6.1.162-android14-11-g40b1a8089d75-ab14960999`<br>Loader: [xperia1vi-root](https://github.com/RetributionByRevenue/xperia1vi-root) (GhostLock over ADB only, per-boot KernelSU) |
| Motorola Edge 60 Pro<br><kbd>Not supported</kbd> | XT2507-2 (cybert) | Android 17, `6.1.157-android14-11-g14047afecd8b-ab16012876` (4 KB pages)<br>[Research report](https://github.com/BKV0369/CVE-2026-98260-Motorola): `CVE-2026-98260` is unpatched and the race is won, but the write lands in `__ro_after_init` and panics the kernel; no root |
| Humane AI Pin<br><kbd>Experimental</kbd> | `penumbra` (Snapdragon W5 Gen 1) | Build not supplied<br>Loader: [humane-aipin-ghostlock](https://github.com/TheAndersMadsen/humane-aipin-ghostlock) (source-only GhostLock PoC; the service is discontinued, so only the exploit path is documented) |

### Upstream kernel profiles

[GhostLock App](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) ships these `uname -r` profiles. They are candidates until a hardware run is reported here. Run the app's vulnerability check and stop if it fails.

| Device | Kernel (`uname -r`) |
| --- | --- |
| Sony Xperia 5 IV (SO-54C / PDX-224) | `5.10.236-android12-9-00014-gb97c62c4e7d1` |
| Sony Xperia 1 V | `5.15.189-android13-8-00016-g51bba4309aac-ab14546557`, `5.15.189-android13-8-00004-g1c3825f8ac0a-ab14110541` |
| Sharp AQUOS R8 (SH-R80) | `5.15.178-android13-8-00025-g7feb0b0b7cd8-ab14134651` |
| Sharp AQUOS sense10 (SH-M33) | `6.1.157-android14-11-g27b608536f86-ab14702606` (upstream note: Shizuku recommended) |
| RedMagic 8 Pro | `5.15.167-android13-8-00017-gb1f32b310a30-ab12826353` |
| RedMagic 9 / 9S Pro | `6.1.145-android14-11-g11c274d0441f-ab14259673` (`REDMAGICOS11.0.5MR1_GB`) |
| RedMagic 10 Pro, 11 Air, Tablet 3 Pro | `6.6.92-android15-8-g3637f4904cf5-ab13944661-4k` |
| RedMagic 11 Pro, Tablet 5 Pro | `6.12.23-android16-5-gf1bdb13583da-ab13761046-4k` |
| RedMagic Tablet 3 Pro | `6.6.30-android15-8-g54dcbfbef792-ab12368803-4k` |
| Motorola Razr 50 Ultra / Razr+ 2024 | `6.1.145-android14-11-geaa643a2c0ee-ab14763719` |
| Motorola Edge 60 Fusion | `6.1.145-android14-11-g9b69cc399ae1-ab14819715` |
| Motorola Edge 40 | `6.6.127-android15-8-gb947b5758b2a-ab15580855-4k` |
| Motorola Razr 60 Ultra | `6.6.118-android15-8-gbf8cd367de7a-ab15314822-4k` |
| Motorola Razr Fold | `6.12.38-android16-5-g1d46253471dd-ab15048002-4k` |
| Lenovo Xiaoxin Pad Pro 12.7 (TB375FC) | `6.1.138-android14-11-g151cf2b6bfbe-ab13719792` |
| Lenovo Yoga Tab Plus (TB520FU) | `6.1.138-android14-11-g2ecae636cf9b-ab14676408` |
| Lenovo Xiaoxin Pro GT 13 | `6.6.82-android15-8-g076ac12bde16-ab13715361-4k` |
| Lenovo Legion Tab Gen 5 (China) | `6.12.30-android16-5-g1750f757fabe-ab13938768-4k` |
| Lenovo Legion Y700 Wuji | `6.12.38-android16-5-g74ad46052215-ab14494108-4k` |
| TECNO POVA 7 4G (TECNO LJ6) | `6.12.38-android16-5-gb575a0b6e647-ab14355190-4k` |
| Infinix Note 50s 5G, Infinix GT 30 (X6876) | `6.1.145-android14-11-g09f1c0074ad7-ab14226177` |
| Infinix GT 30 Pro (X6873) | `6.1.157-android14-11-ga8b0b542991e-ab15601211` |
| Boox Onyx NoteAir6C | `6.1.134-android14-11-maybe-dirty` |
| NX809J / NX888J | `6.12.38-android16-5-g665eafb62659-ab14778838-4k` |

Upstream references: [GhostLock App profile list](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md), [TB710FU port](https://github.com/aoxzh/cve-2026-98260-tb710fu#readme), [TB320FC port](https://github.com/armyja/tb320fc-temp-root#readme), [P50 Pro port](https://github.com/anVzdGFtb25/GhostLock-P50Pro-JAD-AL00#readme), [Xperia 1 VI port](https://github.com/RetributionByRevenue/xperia1vi-root#readme), [Edge 60 Pro report](https://github.com/BKV0369/CVE-2026-98260-Motorola#readme).

## Compatibility notes

- The Lenovo TB710FU port matches one kernel string and one Android 16 build. Its own README rejects a different `uname -r` at launch, so an OTA can turn it into a refusal rather than a failure.
- The Motorola Edge 60 Pro entry is a documented failure, kept because the analysis is useful: the futex race is won, but `selinux_state` sits in a read-only page, so the write faults and panics. KASLR leak sources (`perf_event_open`, `/proc/kallsyms`, `dmesg`, `pstore`) are all blocked for `shell` on that build. Do not read it as a partial success.
- GhostLock App profiles are keyed on the full kernel release. Two devices that share a KMI can still differ in layout, and a MediaTek profile usually needs `kernel_phys_load` / `kernel_phys_offset` from the device's own boot image before it can run.
- The Humane AI Pin repository is source-only and the product is discontinued. Treat it as an exploit reference, not a supported target.
- For any of these devices, a bootloader-unlock or `fastboot` step is permanent root, not temporary root. See [Tools and managers](../guide.md#tools-and-managers).

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
