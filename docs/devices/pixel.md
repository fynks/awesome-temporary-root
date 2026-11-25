---
title: Google Pixel
description: Temporary-root device reports, exact firmware builds, and KMI details for Google Pixel phones and tablets.
---

# Google Pixel

[Root My Pixel](https://github.com/alex193a/Root-My-Pixel) covers most rows and requires Shizuku. [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) covers the Android 17 `6.1.162` build on Pixel 6 through 10a, the November 2026 `6.1.172` build (`CP4A.261105.040.A1`) on Pixel 6a through 10a, the Pixel 10 Pro November 2026 `6.12.81` build, the Pixel 10 `6.6.127` build, the Pixel 11 October `6.12.69` build, and the Pixel 11 November `6.12.81` 4 KB and 16 KB builds (`CP4A.261105.040.D1`). [LSPromise](https://github.com/LSPosed/LSPromise) provides a no-Shizuku Android 17 chain (`CVE-2026-49881` + `CVE-2026-43284` DirtyFrag) tested on Pixel 10. Each loader matches builds exactly. An OTA changes the target.

## Status definitions

| Status | Meaning |
| --- | --- |
| <kbd>Maintainer Verified</kbd> | Hardware result directly confirmed by a repository maintainer with a linked report. |
| <kbd>User Reported</kbd> | Community hardware report with linked evidence, not independently verified by a maintainer. |
| <kbd>Tested</kbd> | Hardware run documented by the upstream loader project on this exact target. |
| <kbd>Experimental</kbd> | Partial, shell-only, or unstable result. |
| <kbd>Upstream profile</kbd> | Device kernel profile shipped upstream with no documented hardware run yet. |
| <kbd>Unverified candidate</kbd> | Matching kernel profile exists, but this model is unconfirmed on hardware. |
| <kbd>Not supported</kbd> | Hardware run on this exact build reported no root; the loader refused the target or reported the kernel patched. |

## Supported builds

| Model / status | Supported build | KMI |
| --- | --- | --- |
| Pixel 11, 11 Pro, 11 Pro XL<br><kbd>Tested</kbd> | `CD1A.260618.001.C2` | `android16-6.12` |
| Pixel 11 Pro Fold<br><kbd>Tested</kbd> | `CD1A.260618.001.C3` | `android16-6.12` |
| Pixel 10, 10 Pro, 10 Pro Fold<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android15-6.6` |
| Pixel 10 (LSPromise)<br><kbd>Tested</kbd> | Android 17 initial release (pre-`2026-09-01` SPL)<br>Loader: [LSPromise](https://github.com/LSPosed/LSPromise) (`CVE-2026-49881` + DirtyFrag `CVE-2026-43284`); KernelSU | `android15-6.6` / `android16-6.12` |
| Pixel 10 Pro (TimerRoot)<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/26) | `blazer`, global; Android 17, November 2026 SPL, 4 KB pages; reporter gave no build or `uname -r` (upstream November profile: `CP4A.261105.040.A1`, `6.12.81-android16-6-g4a1a020d156e-ab16388316-4k`, QEMU-only)<br>Loader: [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) `0.40` beta; KernelSU-Next `33355-5` | `android16-6.12` (upstream) |
| Pixel 10 Pro XL<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP2A.260805.005` | `android15-6.6` |
| Pixel 10a<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP2A.260805.005` | `android14-6.1` |
| Pixel 9, 9a<br><kbd>Tested</kbd> | `CP2A.260705.006`; Pixel 9 also `AD1A.240905.004` | `android14-6.1` |
| Pixel 9 Pro, 9 Pro XL, 9 Pro Fold<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android15-6.1` |
| Pixel 8, 8 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 8a<br><kbd>Tested</kbd> | `CP2A.260805.005` | `android14-6.1` |
| Pixel 7, 7 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006`; Pixel 7 also `BP2A.250705.008` | `android14-6.1` |
| Pixel 7a<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 7a (TimerRoot)<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/19) | `CP3A.261005.002.A1`, `6.1.162-android14-11-g9dd05ae3a1de-ab16261587` (Android 17, SPL `2026-10-26`, 4 KB pages)<br>Loader: [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) `timer-p7a` beta; SukiSU Ultra `41100-6`; CVE-2026-98260 | `android14-6.1` |
| Pixel 7a (TimerRoot, November 2026)<br><kbd>Tested</kbd> | `CP4A.261105.040.A1`, `6.1.172-android14-11-g8d0115b07367-ab16385437` (SPL `2026-11-05`, 4 KB pages; hardware run 2026-11-16)<br>Loader: [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) `6.1.172` 4K profile | `android14-6.1` |
| Pixel 9a (TimerRoot)<br><kbd>Tested</kbd> | `CP3A.261005.005`, `6.1.162-android14-11-g9dd05ae3a1de-ab16261587` (4 KB pages; 16 KB images use the `-16k` profile)<br>Loader: [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) `timer-p7a` beta; CVE-2026-98260 | `android14-6.1` |
| Pixel 6, 6 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 6a<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP1A.260405.005` | `android14-6.1` |
| Pixel Fold<br><kbd>Tested</kbd> | `CP2A.260605.012`, `CP2A.260705.006` | `android14-6.1` |
| Pixel Tablet<br><kbd>Tested</kbd> | `BP1A.250405.007`, `CP2A.260705.006` | `android14-6.1` |

Upstream reference: [Root My Pixel supported devices](https://github.com/alex193a/Root-My-Pixel#supported-devices--build-profiles), [TimerRoot supported devices](https://github.com/MVN123123123123123/TimerRoot/blob/main/docs/supported-devices.md).

## Compatibility notes

- Root My Pixel reports the exploit is unreliable. Many users needed more than 20 attempts, and a failed attempt can reboot the phone.
- [GhostLock App](https://github.com/YuKongA/ghostlock-app) also has Pixel 7, 9a, 9 Pro, and 9 Pro Fold profiles, but those are candidates, not confirmed targets.
- TimerRoot selects a `conf/` profile from the full kernel release and the userspace page size, so the 4 KB and 16 KB builds of `6.1.162` need different profiles. The Pixel 7a report used the 4 KB profile.
- Upstream hardware runs cover Pixel 7a and 9a on `6.1.162`; Pixel 6a is `tested, flinky`, and other rows are byte-identical QEMU checks, not hardware runs. The `6.1.172` release adds a Pixel 7a hardware run (2026-11-16). Pixel 10 Pro `6.12.81`, Pixel 10 `6.6.127`, and Pixel 11 `6.12.69`/`6.12.81` (4 KB and 16 KB; `6.12.81-android16-6-gf5369e7496cb-ab16467452` on `CP4A.261105.040.D1`) are QEMU-only. A 2026-11-22 Pixel 8 Pro `husky` run reached a root shell but missed every fake-credential stage; the fix has only a syntax/QEMU check, so no new tested row.
- The reporter ran with auto-root at BFU: apps and services started after the first unlock can consume enough CPU to make the race fail. The same device passed with KernelSU and KernelSU-Next before the switch to SukiSU Nova (formerly SukiSU Ultra).
- The Pixel 10 Pro November 2026 result comes from an [XDA report](https://xdaforums.com/t/how-to-use-new-temporary-root-timer-root.4807360/post-90821599): the user sideloaded the November OTA and rooted with the beta config, but gave no firmware string or `uname -r`. It is separate from the QEMU-only `6.12.81` upstream profile, and the same background-load failure rate applies.
- TimerRoot is a fork of [osamaassolimany-ui/TimerRoot](https://github.com/osamaassolimany-ui/TimerRoot). Its rolling `timer-p7a` beta tag was published 2026-11-15 but its assets were refreshed 2026-11-24; `v0.40` was a build label. Work after 2026-11-22 is on the unmerged `beta-test` branch (PR #6 closed 2026-11-23).
- [LSPromise](https://github.com/LSPosed/LSPromise) chains `CVE-2026-49881` (Telecom `InCallController` logic bug, fixed in Android SPL `2026-09-01`) into `CVE-2026-43284` (DirtyFrag) from an unprivileged app; upstream confirms Pixel 10 Android 17 initial release and notes Pixel 6a (`6.1.xxx-android14`) fails.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
