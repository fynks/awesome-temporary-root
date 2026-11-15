---
title: Google Pixel
description: Temporary-root device reports, exact firmware builds, and KMI details for Google Pixel phones and tablets.
---

# Google Pixel

All rows use [Root My Pixel](https://github.com/alex193a/Root-My-Pixel), which requires Shizuku. The loader matches builds exactly. An OTA changes the target.

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

| Model / status | Supported build | KMI |
| --- | --- | --- |
| Pixel 11, 11 Pro, 11 Pro XL<br><kbd>Tested</kbd> | `CD1A.260618.001.C2` | `android16-6.12` |
| Pixel 11 Pro Fold<br><kbd>Tested</kbd> | `CD1A.260618.001.C3` | `android16-6.12` |
| Pixel 10, 10 Pro, 10 Pro Fold<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android15-6.6` |
| Pixel 10 Pro XL<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP2A.260805.005` | `android15-6.6` |
| Pixel 10a<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP2A.260805.005` | `android14-6.1` |
| Pixel 9, 9a<br><kbd>Tested</kbd> | `CP2A.260705.006`; Pixel 9 also `AD1A.240905.004` | `android14-6.1` |
| Pixel 9 Pro, 9 Pro XL, 9 Pro Fold<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android15-6.1` |
| Pixel 8, 8 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 8a<br><kbd>Tested</kbd> | `CP2A.260805.005` | `android14-6.1` |
| Pixel 7, 7 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006`; Pixel 7 also `BP2A.250705.008` | `android14-6.1` |
| Pixel 7a<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 6, 6 Pro<br><kbd>Tested</kbd> | `CP2A.260705.006` | `android14-6.1` |
| Pixel 6a<br><kbd>Tested</kbd> | `CP2A.260705.006`, `CP1A.260405.005` | `android14-6.1` |
| Pixel Fold<br><kbd>Tested</kbd> | `CP2A.260605.012`, `CP2A.260705.006` | `android14-6.1` |
| Pixel Tablet<br><kbd>Tested</kbd> | `BP1A.250405.007`, `CP2A.260705.006` | `android14-6.1` |

Upstream reference: [Root My Pixel supported devices](https://github.com/alex193a/Root-My-Pixel#supported-devices--build-profiles).

## Compatibility notes

- Root My Pixel reports the exploit is unreliable. Many users needed more than 20 attempts, and a failed attempt can reboot the phone.
- [GhostLock App](https://github.com/YuKongA/ghostlock-app) also has Pixel 7, 9a, 9 Pro, and 9 Pro Fold profiles, but those are candidates, not confirmed targets.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
