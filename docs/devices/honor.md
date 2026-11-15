---
title: Honor
description: Temporary-root device reports, MagicOS builds, and compatibility notes for Honor phones.
---

# Honor

Honor devices use single-build loaders such as [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root) and community ports based on GhostLock App.

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

## Supported builds

| Device / status | Model or codename | Build or kernel / loader |
| --- | --- | --- |
| HONOR 400 (global)<br><kbd>Experimental</kbd> <kbd>Deprecated/unavailable</kbd> | DNY-NX9 | `DNY-N39 10.0.0.213(C636E4R3P2)`, `5.15.180-android13-8-00018-g9b2308ac0ad6-ab14563692`<br>Loader: MnemosyneLab/ghostlock-honor (upstream repo removed) |
| HONOR 80 Pro Flat<br><kbd>Tested</kbd> | ANB-AN00 / HNANB | MagicOS `9.0.0.230` (`ANB-AN00 9.0.0.230(CHNC00E230R2P5)`), `5.10.236-android12-9-gd671cf8c2b02`<br>Loader: [ANB Root](https://github.com/Chuniex-0631/honor-anb-an00-root) |

Upstream reference: [ANB Root compatibility](https://github.com/Chuniex-0631/honor-anb-an00-root/blob/main/docs/COMPATIBILITY.md).

## Compatibility notes

- Upstream removed the HONOR 400 loader repo (`MnemosyneLab/ghostlock-honor`). This index can no longer re-verify the documented run, so the row keeps a lowered Experimental status. New Honor ports (Honor 90, Honor 70 Pro, Honor 50, and others) exist as community repositories but are not listed until they document a hardware run.
- [ANB Root v2.4.0](https://github.com/Chuniex-0631/honor-anb-an00-root/releases/tag/v2.4.0) changes its signing key. Versions 2.3.5 and earlier cannot update in place. Export diagnostics. Fully reboot if root was restored or a recovery attempt was made this boot. Then follow upstream's uninstall/reinstall and reauthorization steps. Shizuku and KernelSU do not need uninstalling. The supported device/build is unchanged.
- [GhostLock App](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) also lists Honor kernel profiles, which remain candidates until confirmed on hardware.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
