---
title: OPPO
description: Temporary-root device reports, exact firmware builds, and compatibility notes for OPPO phones and tablets.
---

# OPPO

[ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) and [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) provide OPPO payloads matched on exact kernel builds.

See [Supported Devices](./index.md#status-definitions) for status definitions and matching rules.

## Supported builds

| Device / status | Model | Build or kernel / loader |
| --- | --- | --- |
| OPPO K15 Pro+<br><kbd>Experimental</kbd> | PMG110 | `PMG110_16.0.9.400(CN01)`, `6.6.118-android15-8-g93e223c276e7-abogki500782043-4k`<br>Loader: [Root My Device (Witaqua)](https://github.com/WitAqua-tools/Root-My-Device) |
| OPPO Pad 4 Pro<br><kbd>Tested</kbd> | n/a | `6.6.89-android15-8-g096cdb6ecefc-ab14358676-4k`<br>Loader: ghostlock-oneplus |

Upstream references: [ghostlock-oneplus verified devices](https://github.com/JoinChang/ghostlock-oneplus#supported-devices), [not-feasible layouts](https://github.com/JoinChang/ghostlock-oneplus#not-feasible-stack-layout-incompatible), [Root My Device (Witaqua) targets](https://github.com/WitAqua-tools/Root-My-Device-Payloads/releases/latest/download/targets-v2.json).

## Compatibility notes

- OPPO Pad 4 Pro uses a different root path (UMH) in ghostlock-oneplus.
- ghostlock-oneplus has extracted offsets awaiting a device run for OPPO Reno10 Pro+ (`CPH2521`, `5.10.236`) and OPPO Find X9 Pro (`PLG110`, `6.12.23`). Its not-feasible list includes OPPO Find X9 Ultra. Check both before trying a build.

Related ColorOS / OPlus pages: [OnePlus](./oneplus.md), [Realme](./realme.md). Return to [Supported Devices](./index.md) or the [complete guide](../guide.md#supported-devices).
