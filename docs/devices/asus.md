---
title: ASUS
description: Temporary-root device reports and exact kernel release details for ASUS Zenfone devices.
---

# ASUS

ASUS Zenfone 9 builds use the dedicated [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock) port.

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

| Device / status | Model or codename | Build or kernel / loader |
| --- | --- | --- |
| ASUS Zenfone 9<br><kbd>Tested</kbd> | ASUS_AI2202 | `VA39`, `5.10.205-android12-9-00029-g3f12df86bfdb-ab11799032`<br>Loader: [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock) |
| ASUS Zenfone 9 (Adreno path)<br><kbd>Tested</kbd> | ASUS_AI2202 | `34.0304.2004.145` (SPL `2024-07-05`), `5.10.205-android12-9-00029-g3f12df86bfdb-ab11799032`<br>Loader: [zenfone9-root](https://github.com/RamenFast/zenfone9-root) (`CVE-2025-21479` Adreno KGSL plus a perf-based physical-address leak; resolves symbols offline and patches `__do_sys_capset`, then restores kernel text) |
| ASUS Zenfone 10<br><kbd>Upstream profile</kbd> | — | `5.15.206-android13-8-00056-g3f87b8704e9e-ab15683575`<br>Loader: [GhostLock App](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) kernel profile; no hardware run recorded |

Upstream references: [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock), [zenfone9-root verified target](https://github.com/RamenFast/zenfone9-root#readme), [GhostLock App profiles](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md).

## Compatibility notes

- Both Zenfone 9 rows name the same kernel release but use different bugs: `5.10.205` is vulnerable to GhostLock and to Adreno `CVE-2025-21479`. The Adreno path writes kernel text and restores it, so a crash mid-run is a harder failure than a GhostLock race loss.
- The Zenfone 10 row is an upstream kernel profile only.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
