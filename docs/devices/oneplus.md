---
title: OnePlus
description: Temporary-root device reports, exact firmware builds, and compatibility notes for OnePlus phones and tablets.
---

# OnePlus

[ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) is the main loader for OnePlus builds, paired with [Anchor](https://github.com/byemaxx/ghostlock-anchor) on supported OnePlus 13 kernels. The OnePlus Pad 3 uses a dedicated [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) build.

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

| Device / status | Model | Build or kernel / loader |
| --- | --- | --- |
| OnePlus Ace 6T<br><kbd>Tested</kbd> | PLR110 | `6.12.38-android16-5-g8c67d4274c0a-ab14275539-4k` (ColorOS 16.0.2.403), `6.12.38-android16-5-g844001fb8721-ab14552068-4k` (16.0.8.301)<br>Loader: ghostlock-oneplus |
| OnePlus 15<br><kbd>Tested</kbd> | CPH2745, CPH2747, CPH2749 | `6.12.23-android16-5-gb2a876903b49-ab14541642-4k` (16.0.9.400)<br>Loader: ghostlock-oneplus |
| OnePlus 15<br><kbd>Tested</kbd> | PLK110 | `6.12.58` (`android16-6`, Android 17 Beta 3)<br>Loader: ghostlock-oneplus |
| OnePlus 13<br><kbd>Tested</kbd> | IN2060 | `6.6.89-android15-8-gf4dc45704e54-abogki446052083-4k` (16.0.2.403)<br>Loader: ghostlock-oneplus |
| OnePlus 13<br><kbd>Tested</kbd> | IN2060 | `6.6.89-android15-8-g97a9aaefab9a-ab14519050-4k`, `6.6.30-android15-8-g013ec21bba94-abogki383916444-4k`, `6.6.118-android15-8-g93e223c276e7-abogki500782043-4k`<br>Loader: [Anchor](https://github.com/byemaxx/ghostlock-anchor) |
| OnePlus Pad 3<br><kbd>Tested</kbd> | OPD2415 | `OPD2415_16.0.9.400(EX01)`, `6.6.118-android15-8-g2e6b9c3812c5-ab15114928-4k`<br>Loader: [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) |

Upstream references: [ghostlock-oneplus verified devices](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [not-feasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible), [Root My Device OnePlus Pad 3](https://github.com/tqmane/Root-My-Device/blob/main/devices/oneplus-pad-3/README.md#supported-target).

## Compatibility notes

- The PLK110 OnePlus 15 entry is the Android 17 Beta 3 kernel. A stable build with a different kernel is not covered.
- OnePlus 13 `IN2060` uses a different root path (UMH).
- GhostLock App lists kernel `6.12.38-android16-5-g844001fb8721-ab14552068-4k` for the OnePlus 15T, while the Ace 6T row above uses the same string. A shared `uname -r` does not prove the same offset layout, so do not treat an Ace 6T result as a OnePlus 15T result or the reverse.
- ghostlock-oneplus has extracted offsets awaiting a device run for OnePlus 15T (`PLZ110`, `6.12.38`). Its not-feasible list includes OnePlus 12 and OnePlus 13R / Ace 5. Check both lists before trying a build.

Related ColorOS / OPlus pages: [OPPO](./oppo.md), [Realme](./realme.md). Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
