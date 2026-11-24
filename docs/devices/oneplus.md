---
title: OnePlus
description: Temporary-root device reports, exact firmware builds, and compatibility notes for OnePlus phones and tablets.
---

# OnePlus

[ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) is the main loader for OnePlus builds, paired with [Anchor](https://github.com/byemaxx/ghostlock-anchor) on supported OnePlus 13 kernels. The OnePlus Pad 3 uses a dedicated [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) build, while [Shark](https://github.com/kpgc10kai/Shark) and per-device `CVE-2026-98260` ports cover selected ColorOS `6.6`, `6.12`, and `6.18` kernels.

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
| OnePlus 16, 15, 15T, Ace 6T / Ace 6 / Ace 5 Pro, Ace 7 / Ace 7 Pro, Ace 6 Ultra, Pad 2 Pro / 3 Pro<br><kbd>Tested</kbd> | PYB110, PLK110, PLZ110, PLR110, PLQ110, PKR110, PYF110, PMS110, PMB110, OPD2413, OPD2513 | ColorOS 16 / 17 builds on `6.6.118`, `6.12.38`, `6.12.58`, `6.12.69`, and `6.18.21` chains<br>Loader: [Shark-Moto](https://github.com/CYB3R0ID694/Shark-Moto) (`CVE-2026-98260` one-tap app; manager switching across KernelSU, KernelSU-Next, BakaSU, SukiSU Ultra, and FinaSU) |
| OnePlus Ace 6T<br><kbd>Tested</kbd> | PLR110 | `6.12.38-android16-5-g8c67d4274c0a-ab14275539-4k` (ColorOS 16.0.2.403), `6.12.38-android16-5-g844001fb8721-ab14552068-4k` (16.0.8.301)<br>Loader: ghostlock-oneplus |
| OnePlus 15<br><kbd>Tested</kbd> | CPH2745, CPH2747, CPH2749 | `6.12.23-android16-5-gb2a876903b49-ab14541642-4k` (16.0.9.400)<br>Loader: ghostlock-oneplus |
| OnePlus 15<br><kbd>Tested</kbd> | PLK110 | `6.12.58` (`android16-6`, Android 17 Beta 3)<br>Loader: ghostlock-oneplus |
| OnePlus 16<br><kbd>Tested</kbd> | PYB110 | `6.18.21-android17-5-gf957accaf563-ab15926176-4k` (ColorOS 17 / Android 17)<br>Loader: [CVE-2026-98260-OnePlus16-PYB110-Jailbreak](https://github.com/AzirX1337/CVE-2026-98260-OnePlus16-PYB110-Jailbreak) (`CVE-2026-98260`, ADB; KernelSU or FinaSU) |
| OnePlus 13<br><kbd>Tested</kbd> | IN2060 | `6.6.89-android15-8-gf4dc45704e54-abogki446052083-4k` (16.0.2.403)<br>Loader: ghostlock-oneplus |
| OnePlus 13<br><kbd>Tested</kbd> | IN2060 | `6.6.89-android15-8-g97a9aaefab9a-ab14519050-4k`, `6.6.30-android15-8-g013ec21bba94-abogki383916444-4k`, `6.6.118-android15-8-g93e223c276e7-abogki500782043-4k`<br>Loader: [Anchor](https://github.com/byemaxx/ghostlock-anchor) |
| OnePlus Pad 3<br><kbd>Tested</kbd> | OPD2415 | `OPD2415_16.0.9.400(EX01)`, `6.6.118-android15-8-g2e6b9c3812c5-ab15114928-4k`<br>Loader: [Root My Device (tqmane)](https://github.com/tqmane/Root-My-Device) |

Additional ColorOS tooling:

- [Shark-Moto](https://github.com/CYB3R0ID694/Shark-Moto) is a multi-brand `CVE-2026-98260` launcher that extends the Shark kernel-chain table to Motorola and publishes its own OnePlus, OPPO, and Realme rows. It names exact kernel strings, so check your own `uname -r` against its table instead of the model name.
- [ghostlock-anchor](https://github.com/byemaxx/ghostlock-anchor) remains the one-tap setup for the ghostlock-oneplus chain on OnePlus 13 and similar builds.

Upstream references: [ghostlock-oneplus verified devices](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [not-feasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible), [Root My Device OnePlus Pad 3](https://github.com/tqmane/Root-My-Device/blob/main/devices/oneplus-pad-3/README.md#supported-target).

## Compatibility notes

- The PLK110 OnePlus 15 entry is the Android 17 Beta 3 kernel. A stable build with a different kernel is not covered.
- OnePlus 13 `IN2060` uses a different root path (UMH).
- GhostLock App lists kernel `6.12.38-android16-5-g844001fb8721-ab14552068-4k` for the OnePlus 15T, while the Ace 6T row above uses the same string. A shared `uname -r` does not prove the same offset layout, so do not treat an Ace 6T result as a OnePlus 15T result or the reverse.
- ghostlock-oneplus has extracted offsets awaiting a device run for OnePlus 15T (`PLZ110`, `6.12.38`). Its not-feasible list includes OnePlus 12 and OnePlus 13R / Ace 5. Check both lists before trying a build.
- [Shark](https://github.com/kpgc10kai/Shark) ([upstream binaries](https://github.com/Yunnijian/Shark-Releases); original `Yunnijian/Shark` source removed November 2026) targets `CVE-2026-98260` across five current chains (`6.6.118`, `6.12.38`, `6.12.58`, `6.12.69`, `6.18.21`) via Shizuku or Stellar. The fork dropped the `6.6.127` and `6.12.23` chains and all vivo/iQOO targets; upstream v2.6.26 (2026-11-24) adds `6.1.157` kernels and a Xiaomi 17 `6.12.69` profile not yet ported to the fork. Check exact chain support before running.
- On the OnePlus 16 (`PYB110`) `6.18.21` kit, upstream warns that `ksud soft-reboot` and `ctl.restart zygote` with Zygisk Next active can freeze the device until a forced full reboot; refresh manager UI via force-stop instead.

Related ColorOS / OPlus pages: [OPPO](./oppo.md), [Realme](./realme.md). Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
