---
title: Honor
description: Temporary-root device reports, MagicOS builds, and compatibility notes for Honor phones.
---

# Honor

Honor devices use single-build loaders such as [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root), [CVE-2026-98260-BRM-AN00](https://github.com/sganggs/CVE-2026-98260-BRM-AN00), and community ports based on GhostLock App.

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
| HONOR 400 (global)<br><kbd>Experimental</kbd> <kbd>Deprecated/unavailable</kbd> | DNY-NX9 | `DNY-N39 10.0.0.213(C636E4R3P2)`, `5.15.180-android13-8-00018-g9b2308ac0ad6-ab14563692`<br>Loader: MnemosyneLab/ghostlock-honor (upstream repo removed) |
| HONOR 90<br><kbd>Tested</kbd> | REA-AN00 | MagicOS `9.0.0.200SP1`, `5.10.236-android12-9-gd1575ab10b30`<br>Loader: [GhostLock-Honor90-REA-AN00](https://github.com/anVzdGFtb25/GhostLock-Honor90-REA-AN00) (GhostLock plus a KernelSU LKM loader; only the 9.0.0.200SP1 target is marked verified) |
| HONOR 90 (global)<br><kbd>Tested</kbd> | REA-NX9 | MagicOS `9.0.0.211` / Android 15, `5.10.236` (pure GKI)<br>Loader: [honor90-ghostlock](https://github.com/cyrrp/honor90-ghostlock) (fork of GhostLock-H80GT; verified on `8.0.0.128` `5.10.168`, `8.0.0.160` and `9.0.0.157` `5.10.209`) |
| HONOR 70 / 60 / 60 Pro<br><kbd>Tested</kbd> | FNE-AN00 / LSA / TNA | MagicOS `8.0.221` / `8.0.224`, `5.4.289-qgki-gf6cb1f712a6e` / `5.4.295-qgki-g0fb2656b2b50`<br>Loader: [GhostLock-HonorFne](https://github.com/MSEDGE-CORE/GhostLock-HonorFne) (GhostLock plus a custom KernelSU late-load; PC-side `run_root` scripts) |
| HONOR Magic5<br><kbd>Tested</kbd> | PGT-AN00 | `5.15.180-android13-8-g1c54d617912d`<br>Loader: [magic5-one-click-root](https://github.com/Sakuramoe233/magic5-one-click-root) (PC-side one-click GhostLock -> BakaSU / KernelSU LKM) |
| HONOR Magic8 Pro Air<br><kbd>Tested</kbd> | LDY-AN00 | MagicOS `10.0.0.113` (vulnerable code also confirmed in `10.0.0.170`)<br>Loader: [honor-ldy-an00-ghostlock](https://github.com/iodn/honor-ldy-an00-ghostlock) (GhostLock root shell over authorised ADB) |
| HONOR MagicPad3 Pro 13.3<br><kbd>Tested</kbd> | YLP-W00 | MagicOS `10.0.0` (`6.12.38-android16-5-gfde7767f6ef6-abogki481467632-4k`), MagicOS `11.0.0.109` (`6.12.58-android16-6-g3a7ac1674240-abogki541502914-4k`), `11.0.0.117` SP4 (`6.12.58-android16-6-g142ddad31e60-abogki576095858-4k`)<br>Loader: [CVE-2026-98260](https://github.com/woshigenm/CVE-2026-98260) (`CVE-2026-98260` PoC/EXP, uid-0 shell, KernelSU app) |
| HONOR Pad 9<br><kbd>Tested</kbd> | HEY2-W09 / HNHEY2-Q | MagicOS `8.0.0.191C00E185R2P4` / Android 14, `5.10.252-android12-9-ga431fb50f9a2`<br>Loader: [honor-pad9-ghostlock](https://github.com/vexpaer/honor-pad9-ghostlock) (ephemeral KernelSU late-load, no partition writes) |
| HONOR Magic9 Pro Max<br><kbd>Experimental</kbd> | WKL-AN20 / WKL-AN80 | Three verified `6.18.21` builds: `6.18.21-android17-5-g928d1bb4f1d7-abogki542339678-4k` (`CVE-2026-64560` / `CVE-2026-98260`), `...ge186062ea75f-abogki564062290-4k`, `...gfee2325de189-abogki572422516-4k`<br>Loader: [HOneClick](https://github.com/superboyyy/HOneClick) (on-device exploit generator for `6.18` KMI images) |
| HONOR 80 Pro Flat<br><kbd>Tested</kbd> | ANB-AN00 / HNANB | MagicOS `9.0.0.230` (`ANB-AN00 9.0.0.230(CHNC00E230R2P5)`), `5.10.236-android12-9-gd671cf8c2b02`<br>Loader: [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root) |
| HONOR Win2<br><kbd>Tested</kbd> | BRM-AN00 | MagicOS `11.0.0.115` (`BRM-AN00 11.0.0.115(SP7C00E115R101P3)`, Android 17), `6.18.21-android17-5-ge186062ea75f-abogki564062290-4k`<br>Loader: [CVE-2026-98260-BRM-AN00](https://github.com/sganggs/CVE-2026-98260-BRM-AN00) (`CVE-2026-98260`, `BRM ReSuki` Shizuku app or ADB -> BakaSU) |

Upstream reference: [ANB Root compatibility](https://github.com/Chuniex-0631/honor-anb-an00-root/blob/main/docs/COMPATIBILITY.md).

## Compatibility notes

- Upstream removed the HONOR 400 loader repo (`MnemosyneLab/ghostlock-honor`). This index can no longer re-verify the documented run, so the row keeps a lowered Experimental status.
- Honor ports listed above each name one or a few exact kernels. The Honor 90 REA-AN00 port keeps 80 GT offsets for older MagicOS builds and only marks `9.0.0.200SP1` as verified, so do not apply the verified row to `8.0.0.128`, `9.0.0.220SP2`, or `9.0.0.230`.
- [ExtractKit](https://github.com/qq2770355800/ExtractKit) is the shared calibration tool for these ports: it derives kallsyms and struct offsets from the device's own boot image, optionally leaks the KASLR slide through `CVE-2026-98937` (`perf_event_open` callchain), and ships 74 kernel profiles. Profiles are candidates, not confirmed runs. It selects strictly on the `g<hash>` kernel build because the same `6.1.157-android14-11` release can differ in `k_itimer` size and `task_struct.cred` offset.
- Huawei devices appear on [Other brands](./other-brands.md). Honor kernel profiles in GhostLock App stay candidates until a hardware run is recorded here.
- [ANB Root's compatibility table](https://github.com/Chuniex-0631/honor-anb-an00-root/blob/main/docs/COMPATIBILITY.md) pins KernelSU manager `v3.3.0` for the ANB-AN00 build, paired with its bundled Honor LKM. A user confirmed on 2026-11-11 that root still works after the LightUpdate `26.11.0.115 (FE55)` push. That push contains app and feature components only, not a kernel, boot, or system image, and the confirmation does not extend to later OTAs or other builds.
- [ANB Root v2.4.0](https://github.com/Chuniex-0631/honor-anb-an00-root/releases/tag/v2.4.0) changes its signing key. Versions 2.3.5 and earlier cannot update in place. Export diagnostics. Fully reboot if root was restored or a recovery attempt was made this boot. Then follow upstream's uninstall/reinstall and reauthorization steps. Shizuku and KernelSU do not need uninstalling. The supported device/build is unchanged.
- [GhostLock App](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) also lists Honor kernel profiles, which remain candidates until confirmed on hardware.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
