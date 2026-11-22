---
title: Xiaomi and Redmi
description: Temporary-root device reports, HyperOS builds, and compatibility notes for Xiaomi, Redmi, and POCO devices.
---

# Xiaomi and Redmi

Xiaomi and Redmi devices use several independent loaders, including [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus), [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device), [DirtyFrag](https://github.com/mitschud/DirtyFrag), [DFRoot](https://github.com/diabl0w/DFRoot), [GhostLock App](https://github.com/YuKongA/ghostlock-app), [TimerRoot](https://github.com/MVN123123123123123/TimerRoot), [Shark](https://github.com/kpgc10kai/Shark), and per-device ports.

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

| Device / status | Model or codename | Build or kernel / loader |
| --- | --- | --- |
| Xiaomi 17<br><kbd>Tested</kbd> | pudding | `OS3.0.315.0.WPCCNXM` (`6.12.23`), `6.12.69`<br>Loader: ghostlock-oneplus |
| Xiaomi 17 / Pro / Ultra<br><kbd>Tested</kbd> | — | `6.12.23-android16-5-g75e9b1c7ae7c-abogki463945075-4k`<br>Loader: [CVE-2026-43499-popsicle](https://github.com/x-spy/CVE-2026-43499-popsicle) (`CVE-2026-43499`; caveat: new apps crash after exploit until reboot) |
| Xiaomi 17 Pro Max<br><kbd>Tested</kbd> | popsicle / 2509FPN0BC | HyperOS 4 / Android 17 (`OS4.0.4.0`, `OS4.0.5.0`, `OS4.0.6.0` `XPBCNXM`), `6.12.69-android16-6-g43b5ab7e247d-abogki558343811-4k`<br>Loader: [CVE-2026-98260-Xiaomi-17-Pro-Max](https://github.com/starriv/CVE-2026-98260-Xiaomi-17-Pro-Max) (kernel compared byte for byte; build allowlist; KernelSU jailbreak mode) |
| Xiaomi 13 (fuxi)<br><kbd>Tested</kbd> | fuxi / 2211133G | `5.15.194-android13-8-00019-gf4321180a397-ab15212794`<br>Loader: [fuxi-temp-root](https://github.com/realskyrin/fuxi-temp-root) (`CVE-2026-43499` via GhostRoot plus KernelSU late-load; verified with KernelSU 3.3.1) |
| Xiaomi Pad 7S Pro 12.5, Pad 7 Ultra, 15S Pro<br><kbd>Tested</kbd> | violin / jinghu / dijun (XRING O1) | `6.18.21-android17-5-g1d099fcb35e0-abogki538445360-4k` (OS4.0.0.14 and earlier), `6.18.21-android17-5-g284297031c53-abogki553682993-4k` (OS4.0.5.0 and later)<br>Loader: [xring-CVE-2026-98260-OS4.0](https://github.com/ChaYeWuu/xring-CVE-2026-98260-OS4.0) (one APK, optional KernelSU / SukiSU / KernelSU Next / 7kimisu handoff) |
| Redmi K80 Pro<br><kbd>Tested</kbd> | miro | HyperOS `3.0.305` (`6.6.118-android15-8-gc44b714366cc-abogki519650608-4k`) and `4.0.3.0` (`6.6.118-android15-8-gf72a02f47f4b-abogki551678766-4k`)<br>Loader: [K80Pro-miro-CVE-2026-98260](https://github.com/RMDycz/K80Pro-miro-CVE-2026-98260) (device-bound `CVE-2026-98260`; `3.0.304` is theory only) |
| Redmi K50 Pro<br><kbd>Tested</kbd> | matisse (MT6983) | `5.10.209-android12-9`<br>Loader: [matisse-public](https://github.com/ihamn/matisse-public) (full source, offsets, build recipe; KernelSU LKM late-load on a locked bootloader) |
| Redmi K50<br><kbd>Tested</kbd> | rubens / 22041211AC (MT6895) | `5.10.209-android12-9-00019-g4ea09a298bb4-ab12292661`<br>Loader: [redmi-k50-temp-root](https://github.com/noctide/redmi-k50-temp-root) (DirtyFrag with a `libbase` fallback) |
| Redmi Pad SE 8.7<br><kbd>Tested</kbd> | MT8786 | HyperOS 3 / Android 16, `6.6.118-android15-8-gc4127a25dcf3-ab15863337-4k`<br>Loader: [redmi-pad-se-87-root](https://github.com/nestchao/redmi-pad-se-87-root) (`CVE-2026-98260`; 14-chapter write-up, 13 ruled-out routes, and the KASLR-alignment correction for 512 KB-aligned devices) |
| Redmi Pad Pro / POCO Pad<br><kbd>Tested</kbd> | dizi / parrot | `CVE-2026-43499` (GhostLock App `select_stack` route)<br>Loader: [REDMI_Root](https://github.com/d16ug-a1l/REDMI_Root) (device-adapted GhostLock app, KernelSU jailbreak mode) |
| Redmi Note 15 Pro 5G<br><kbd>Tested</kbd> | lapis (MT6878) | `6.1.129-android14-11-g6b7a9f51c088-ab13432504`<br>Loader: [lapis-mt6878-root](https://github.com/idk12345-desigh/lapis-mt6878-root) (`CVE-2026-98260`; exact `uname -r` match or it refuses to run) |
| Redmi Note 15 Pro 5G (toolkit)<br><kbd>Experimental</kbd> | lapis (MT6878) | `6.1.138-android14-11-g51f8c580613d` and `6.1.157-android14-11-geadf9a793a09` (`libexploit_138.so` / `libexploit_157.so`)<br>Loader: [lapisroot](https://github.com/nekounknown/lapisroot) (KernelSU LKM toolkit with a Shizuku APK; the author states it was not hardware-tested) |
| Xiaomi 17T Pro<br><kbd>Tested</kbd> | warhol | `OS3.0.304.0.WPSJPXM`, `6.12.38-android16-5-g1d46253471dd-ab15048002-4k`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |
| Xiaomi 14T Japan<br><kbd>Tested</kbd> | XIG07 | `OS3.0.7.0.WNEJPKD`, `6.1.138-android14-11-g44bda9e8f6e9-ab13792638`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |
| Redmi Note 13 4G<br><kbd>Maintainer Verified</kbd> | sapphire | Android 15; HyperOS `2.0.213.0` Global; security patch `2026-08-01`<br>Kernel and loader version: unknown<br>Loader: [mitschud/DirtyFrag](https://github.com/mitschud/DirtyFrag) |
| Redmi Note 14 4G<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/6) | 24117RN76L | `BP2A.250605.031.A3`, `6.12.30-android16-5-g6e872b4863d6-ab13847919-4k`<br>Loader: [GhostLock App](https://github.com/YuKongA/ghostlock-app) v1.2; successful temporary root reported |
| Redmi Note 14 4G (DFRoot)<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/17) | tanzanite / 24117RN76L | `BP2A.250605.031.A3`, `6.12.30-android16-5-g6e872b4863d6-ab13847919-4k` (Android 16, HyperOS, SPL `2026-08-01`)<br>Loader: [DFRoot](https://github.com/diabl0w/DFRoot) v4.7; KernelSU `v3.3.1 (32680-5)` |
| Redmi 12 (heat)<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/27) | 23053RN02Y | `AP3A.240905.015.A2` (Android 15), HyperOS `2.0.205.0.VMXRUXM`, SPL `2026-09-01`, `6.6.58-android15-8-g33c1ba9ffede-4k`<br>Loader: [DFRoot](https://github.com/diabl0w/DFRoot) v4.7; KernelSU `v3.3.1 (32680)` |
| POCO X8 Pro<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/31) | klee / klee_eea (MT6899) | `OS4.0.7.0.XPJEUXM` (Android 17 / HyperOS 4, SPL `2026-10-01`), `6.6.118-android15-8-gc4127a25dcf3-ab15863337-4k` (4 KB pages)<br>Loader: [Shark](https://github.com/kpgc10kai/Shark) v2.5.1+ (`CVE-2026-98260`) over Shizuku; KernelSU `ksud 3.3.1`, late-load `--kmi android15-6.6` |
| POCO F6<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/32) | peridot | `BP2A.250605.031.A3` (Android 16 / HyperOS 3, SPL `2026-03-01`), `6.1.138-android14-11-g0c3d559bcd85-ab14529422` (4 KB pages)<br>Loader: [GhostLock App](https://github.com/YuKongA/ghostlock-app) v1.2 (597); KernelSU `v3.3.1`; `su -c id` returned `uid=0` with `context=u:r:ksu:s0` |

Ports for Xiaomi and Redmi builds outside the Root My Device, ghostlock-oneplus, and Shark lists:

- [CVE-2026-98260-Xiaomi-17-Pro-Max](https://github.com/starriv/CVE-2026-98260-Xiaomi-17-Pro-Max), [xring-CVE-2026-98260-OS4.0](https://github.com/ChaYeWuu/xring-CVE-2026-98260-OS4.0), [K80Pro-miro-CVE-2026-98260](https://github.com/RMDycz/K80Pro-miro-CVE-2026-98260), [fuxi-temp-root](https://github.com/realskyrin/fuxi-temp-root), [matisse-public](https://github.com/ihamn/matisse-public), [redmi-k50-temp-root](https://github.com/noctide/redmi-k50-temp-root), [redmi-pad-se-87-root](https://github.com/nestchao/redmi-pad-se-87-root), [REDMI_Root](https://github.com/d16ug-a1l/REDMI_Root), [lapisroot](https://github.com/nekounknown/lapisroot), and [lapis-mt6878-root](https://github.com/idk12345-desigh/lapis-mt6878-root).
- [cve-2026-98260-nezha](https://github.com/4627488/cve-2026-98260-nezha) and [CVE-2026-98260_nezha](https://github.com/skyrocketingHong/CVE-2026-98260_nezha) publish Xiaomi 17 Ultra (`nezha`) scripts, logs, and research rather than a verified receiver; use them to port, not as a supported target.

Upstream references: [Maintainer report: Redmi Note 13 4G](https://github.com/fynks/awesome-temporary-root/issues/9#issuecomment-6871968996), [Root My Device targets](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json), [ghostlock-oneplus verified devices](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [GhostLock App profile list](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md).

## Compatibility notes

- The Redmi Note 13 4G entry is a maintainer-reported DirtyFrag run on `sapphire`. Kernel and loader version are unknown. Do not generalize to other Note 13 variants or builds.
- The Redmi Note 14 4G DFRoot row is separate from the GhostLock row. DFRoot v4.3 rebooted the device on every run; v4.7 succeeded with KernelSU 3.3.1.
- The Redmi 12 report shows `uid=0` with `context=u:r:ksu:s0` after DFRoot v4.7. Its `6.6.58` build is a separate target from the Note 14 4G `6.12.30` row; do not carry the result across models or kernels.
- The POCO X8 Pro (klee) run reached `uid=0` with Shark on a locked bootloader (`verifiedbootstate=green`) and loaded the KernelSU `180224` module after late-load. It is a probabilistic slab race: the first attempt failed at `fake_uid` (`FAIL=cred`, `exit=13`) and the second succeeded in 6468 ms, with SELinux back to Enforcing. Runtime root is lost on a full reboot, so budget several attempts.
- The [POCO F6 (peridot) report](https://github.com/fynks/awesome-temporary-root/issues/32) reached `uid=0` with GhostLock App v1.2 on `6.1.138-android14-11-g0c3d559bcd85-ab14529422`. Match that exact model and kernel string; do not carry it over to other POCO F6 builds or the Redmi Note 14 4G `6.12.30` runs.
- GhostLock is not expected to work on POCO X8 Pro `OS4.0.7.0.XPJEUXM`. Extracting `boot.img` and `vendor_boot.img` showed `CVE-2026-43499` patched (`remove_waiter()` never reads `current`). That is firmware analysis from the [issue #31](https://github.com/fynks/awesome-temporary-root/issues/31) report, not an on-device failed-root run.
- The Redmi Note 14 4G run used the GhostLock App profile for kernel `6.12.30-android16-5-g6e872b4863d6-ab13847919-4k`, which upstream lists for the REDMI Note 15 4G and POCO M6 Pro 4G. GhostLock App selects on `uname -r`, so the same kernel string covers all three models, but the offset layout can still differ between them. Confirm the exact model, and treat a Note 14 4G run as unverified on a Note 15 4G and the reverse.
- GhostLock App has profiles for many Xiaomi, POCO, and Redmi devices. Those are candidates, not confirmed runs. Its [MediaTek guide](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/MEDIATEK.md) covers MT devices that miss the default target.
- GhostLock App's list includes a `6.1.138-android14-11-g7b9e94e37cfa-mi` profile for the Xiaomi Pad 7 Pro and a `6.12.38-android16-5-g1d46253471dd-ab15048002-4k` profile for the Motorola Razr Fold. The latter is the same kernel string as the Xiaomi 17T Pro row above; upstream has not shown that the two share an offset layout, so match the exact model as well as `uname -r`.
- The Redmi Note 15 Pro+ and Note 15 Pro kernels in TimerRoot (`6.1.138`) are separate profiles from Root My Device and DirtyFrag targets. TimerRoot also ships QEMU-only 6.18.21 profiles for Xiaomi 18 Pro (`hongkong`), 18 Pro Max (`madrid`), 18 Fold (`lhasa`), and Pad 9 Pro Max (`yingtian`). A TimerRoot QEMU check is not a hardware run.
- [Shark](https://github.com/kpgc10kai/Shark) ([upstream binaries](https://github.com/Yunnijian/Shark-Releases)) includes a `6.18.21` `CVE-2026-98260` chain. The fork lists Xiaomi 18 Pro and Xiaomi 18 Fold (`lhasa`, experimental); upstream [v2.5.1](https://github.com/Yunnijian/Shark-Releases/releases/tag/v2.5.1) (2026-11-18) adds Xiaomi Pad 7S Pro (`violin`, `6.18.21-android17-5-g284297031c53-abogki553682993-4k`) and Xiaomi Pad 9 Pro Max (`yingtian`, `6.18.21-android17-5-g805aa6adea19-abogki565292102-4k`) and removes vivo/iQOO targets.
- [CVE-2026-98260-nezha-android](https://github.com/quyicheng03-boop/CVE-2026-98260-nezha-android) documents a target-specific `CVE-2026-98260` research port for Xiaomi `nezha` (`OS4.0.4.0`).
- [CVE-2026-43499-aristotle](https://github.com/soralis0912/CVE-2026-43499-aristotle) is an incomplete WIP port for Xiaomi 13T (`aristotle` / au `XIG04`, `5.10.136`) whose `rb_erase` overlay fails to leak the KASLR slide; do not treat it as a working target.
- The POCO M6 Pro 4G ([ghostlock-emerald](https://github.com/datfooldive/ghostlock-emerald)) port has no upstream support table, so it is not listed as a confirmed target.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
