---
title: Google Pixel
description: Temporary-root device reports, exact firmware builds, and KMI details for Google Pixel phones and tablets.
---

# Google Pixel

[Root My Pixel](https://github.com/alex193a/Root-My-Pixel) covers most rows and requires Shizuku. [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) covers the Android 17 `6.1.162` build on Pixel 6 through 10a, the Pixel 10 `6.6.127` build, and the Pixel 11 `6.12.69` build. [LSPromise](https://github.com/LSPosed/LSPromise) provides a no-Shizuku Android 17 chain (`CVE-2026-49881` + `CVE-2026-43284` DirtyFrag) tested on Pixel 10. Each loader matches builds exactly. An OTA changes the target.

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

| Model / status | Supported build | KMI |
| --- | --- | --- |
| Pixel 11, 11 Pro, 11 Pro XL<br><kbd>Tested</kbd> | `CD1A.260618.001.C2` | `android16-6.12` |
| Pixel 11 Pro Fold<br><kbd>Tested</kbd> | `CD1A.260618.001.C3` | `android16-6.12` |
| Pixel 10, 10 Pro, 10 Pro Fold<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android15-6.6` |
| Pixel 10 (LSPromise)<br><kbd>Tested</kbd> | Android 17 initial release (pre-`2026-09-01` SPL)<br>Loader: [LSPromise](https://github.com/LSPosed/LSPromise) (`CVE-2026-49881` + DirtyFrag `CVE-2026-43284`); KernelSU | `android15-6.6` / `android16-6.12` |
| Pixel 10 Pro XL<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP2A.260805.005` | `android15-6.6` |
| Pixel 10a<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP2A.260805.005` | `android14-6.1` |
| Pixel 9, 9a<br><kbd>Tested</kbd> | `CP2A.260705.006`; Pixel 9 also `AD1A.240905.004` | `android14-6.1` |
| Pixel 9 Pro, 9 Pro XL, 9 Pro Fold<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android15-6.1` |
| Pixel 8, 8 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 8a<br><kbd>Tested</kbd> | `CP2A.260805.005` | `android14-6.1` |
| Pixel 7, 7 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006`; Pixel 7 also `BP2A.250705.008` | `android14-6.1` |
| Pixel 7a<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 7a (TimerRoot)<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/19) | `CP3A.261005.002.A1`, `6.1.162-android14-11-g9dd05ae3a1de-ab16261587` (Android 17, SPL `2026-10-26`, 4 KB pages)<br>Loader: [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) `timer-p7a` beta; SukiSU Ultra `41100-6`; CVE-2026-98260 | `android14-6.1` |
| Pixel 9a (TimerRoot)<br><kbd>Tested</kbd> | `CP3A.261005.005`, `6.1.162-android14-11-g9dd05ae3a1de-ab16261587` (4 KB pages; 16 KB images use the `-16k` profile)<br>Loader: [TimerRoot](https://github.com/MVN123123123123123/TimerRoot) `timer-p7a` beta; CVE-2026-98260 | `android14-6.1` |
| Pixel 6, 6 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 6a<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP1A.260405.005` | `android14-6.1` |
| Pixel Fold<br><kbd>Tested</kbd> | `CP2A.260605.012`, `CP2A.260705.006` | `android14-6.1` |
| Pixel Tablet<br><kbd>Tested</kbd> | `BP1A.250405.007`, `CP2A.260705.006` | `android14-6.1` |

Upstream reference: [Root My Pixel supported devices](https://github.com/alex193a/Root-My-Pixel#supported-devices--build-profiles), [TimerRoot supported devices](https://github.com/MVN123123123123123/TimerRoot#supported-devices).

## Compatibility notes

- Root My Pixel reports the exploit is unreliable. Many users needed more than 20 attempts, and a failed attempt can reboot the phone.
- [GhostLock App](https://github.com/YuKongA/ghostlock-app) also has Pixel 7, 9a, 9 Pro, and 9 Pro Fold profiles, but those are candidates, not confirmed targets.
- TimerRoot selects a `conf/` profile from the full kernel release and the userspace page size, so the 4 KB and 16 KB builds of `6.1.162` need different profiles. The Pixel 7a report used the 4 KB profile.
- Upstream says only the Pixel 7a and Pixel 9a have been run on hardware for `6.1.162`. The other Pixel 6 to 10a rows in its table were verified in QEMU against the same byte-identical 4 KB kernel payload, which is not a hardware run. Its Pixel 10 `6.6.127` and Pixel 11 `6.12.69` profiles are also QEMU-only.
- The reporter ran with auto-root at BFU: apps and services started after the first unlock can consume enough CPU to make the race fail. The same device passed with KernelSU and KernelSU-Next before the switch to SukiSU Nova (formerly SukiSU Ultra).
- The linked TimerRoot repository is a fork of [osamaassolimany-ui/TimerRoot](https://github.com/osamaassolimany-ui/TimerRoot). Its release channel is the rolling `timer-p7a` beta (`beta` tag, last updated 2026-11-15); `v0.40` was a build label, not a release tag.
- [LSPromise](https://github.com/LSPosed/LSPromise) chains `CVE-2026-49881` (Telecom `InCallController` logic bug, fixed in Android SPL `2026-09-01`) into `CVE-2026-43284` (DirtyFrag) from an unprivileged app; upstream confirms Pixel 10 Android 17 initial release and notes Pixel 6a (`6.1.xxx-android14`) fails.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
