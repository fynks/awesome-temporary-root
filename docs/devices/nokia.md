---
title: HMD and Nokia
description: Temporary-root device reports, exact firmware builds, and module notes for HMD and Nokia phones.
---

# HMD and Nokia

HMD and Nokia devices in this index have community DirtyFrag reports using [DFRoot](https://github.com/diabl0w/DFRoot).

See [Supported Devices](./index.md#status-definitions) for status definitions and matching rules.

## Supported builds

| Device / status | Model or codename | Build or kernel / loader |
| --- | --- | --- |
| HMD Nokia G22<br><kbd>User Reported</kbd><br>[Source](https://github.com/fynks/awesome-temporary-root/issues/14) | TA-1528 / Sunfire | `00WW_3_610_SP09`, `5.15.189-android13-8-gda0f9c88f088` (Android 14, SPL `2026-05-05`)<br>Loader: [DFRoot](https://github.com/diabl0w/DFRoot) v4.7; KernelSU 3.3.1 |

## Compatibility notes

- The HMD Nokia G22 run used DFRoot v4.7 built from `master`, with the PR 185 hook fallback.
- AshResXcue, ReZygisk, and the Block OTA module caused bootloops on this build; KernelSU Tuner lagged with ZRAM enabled.

Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
