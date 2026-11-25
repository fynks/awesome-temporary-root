---
title: Nothing
description: Temporary-root device reports, exact firmware builds, and compatibility notes for Nothing phones.
---

# Nothing

Nothing Phone (3a) uses [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) with exact build matching. The CMF Phone 1 has a [GhostLock App](https://github.com/YuKongA/ghostlock-app) report.

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
| Nothing Phone (3a) / (3a) Pro<br><kbd>Tested</kbd> | Asteroids | `6.1.172`<br>Loader: [CVE-2026-98260-Asteroids](https://github.com/arkylin/CVE-2026-98260-Asteroids) (`CVE-2026-98260`; patches unexported symbols in the KernelSU `.ko`, then `finit_module`; KernelSU 3.3.1 late-load) |
| Nothing Phone (3a)<br><kbd>Tested</kbd> | A059 / Asteroids | `B4.1-260618-1048`, `6.1.157-android14-11-g82d681c9b06b-ab14634535`<br>Loader: [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) |
| CMF Phone 1<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/39) | Tetris / Nothing A015 (TetrisTUR) | `Tetris-B4.1-260928-1140-TUR` (Nothing OS 4.1, Android 16, `BP2A.250605.031.A3`, SPL `2026-10-01`), `6.1.162-android14-11-g65896c4edca1-ab15242664` (4 KB pages)<br>Loader: [GhostLock App](https://github.com/YuKongA/ghostlock-app) v1.2 (pre-release), auto-matched built-in profile; KernelSU `v3.3.1 (32680-5)`, Jailbreak mode / LKM; root working, SELinux Enforcing |

Upstream reference: [Nothing Phone (3a) supported target](https://github.com/tqmane/Root-My-Device/blob/main/devices/nothing-phone-3a/README.md#supported-target).

## Compatibility notes

- [GhostLock App](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/SUPPORTED_DEVICES.md) also lists Nothing Phone (3a) Pro (`A059P`, `6.1.157-android14-11-g82d681c9b06b-ab14634535`) and Nothing Phone 3 (`6.6.102-android15-8-gab8eb70a71b8-ab14350911-4k`) profiles. They are candidates until a hardware run is recorded here; the CMF Phone 1 profile in the table above has a hardware report.
- The [CMF Phone 1 (Tetris) report](https://github.com/fynks/awesome-temporary-root/issues/39) reached working KernelSU root with GhostLock App v1.2 on Nothing OS 4.1. The SELinux bypass took about 5 seconds and sometimes needed a few retries, and the reporter saw a kernel panic when running the loader after charging. Match the exact build and kernel string; do not carry this result over to other Nothing or CMF builds.
- Build `B4.1-260810-1153` is supported upstream, but the verified run was on `B4.1-260618-1048`.
- Build `C5.0-260915-2123` is allowlisted upstream, but its root flow is not verified.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
