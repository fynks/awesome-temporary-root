---
title: Nothing
description: Temporary-root device reports, exact firmware builds, and compatibility notes for Nothing phones.
---

# Nothing

Nothing Phone (3a) uses [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) with exact build matching.

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
| Nothing Phone (3a) / (3a) Pro<br><kbd>Tested</kbd> | Asteroids | `6.1.172`<br>Loader: [CVE-2026-98260-Asteroids](https://github.com/arkylin/CVE-2026-98260-Asteroids) (`CVE-2026-98260`; patches unexported symbols in the KernelSU `.ko`, then `finit_module`; KernelSU 3.3.1 late-load) |
| Nothing Phone (3a)<br><kbd>Tested</kbd> | A059 / Asteroids | `B4.1-260618-1048`, `6.1.157-android14-11-g82d681c9b06b-ab14634535`<br>Loader: [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) |

Upstream reference: [Nothing Phone (3a) supported target](https://github.com/tqmane/Root-My-Device/blob/main/devices/nothing-phone-3a/README.md#supported-target).

## Compatibility notes

- [GhostLock App](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) also lists Nothing Phone (3a) Pro (`A059P`, `6.1.157-android14-11-g82d681c9b06b-ab14634535`) and Nothing Phone 3 (`6.6.102-android15-8-gab8eb70a71b8-ab14350911-4k`) profiles. They are candidates until a hardware run is recorded here.
- Build `B4.1-260810-1153` is supported upstream, but the verified run was on `B4.1-260618-1048`.
- Build `C5.0-260915-2123` is allowlisted upstream, but its root flow is not verified.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
