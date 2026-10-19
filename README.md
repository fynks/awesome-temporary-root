# awesome-temporary-root

Temporary root gives you UID 0 on an Android phone without unlocking its bootloader. The root lives in memory until the next full reboot. That sentence covers the appeal and the limit.

This README collects the tools, the builds people have tested, the modules that survive a session, and the failures that cost people a phone. It covers DirtyFrag (CVE-2026-43284), GhostLock (CVE-2026-43499), and the KernelSU late-load step that turns either exploit into a usable root manager.

Checked against upstream sources on 19 October 2026. No APK hosting, no exploit code, no paid links.

> [!CAUTION]
> Temporary root is full root. A bad module, a partition write, or a Magisk Direct Install on a locked phone can leave it unbootable. The tools are third-party projects. Use them on hardware you own, and back up first.

## Contents

- [What temporary root is](#what-temporary-root-is)
- [How it works](#how-it-works)
- [Methods](#methods)
- [Quick start](#quick-start)
- [Supported devices](#supported-devices)
- [Tools](#tools)
- [Modules](#modules)
- [Apps](#apps)
- [Things to avoid](#things-to-avoid)
- [Recovery and troubleshooting](#recovery-and-troubleshooting)
- [FAQ](#faq)
- [Sources](#sources)
- [Contributing](#contributing)

## What temporary root is

A temporary root session does not flash anything. A loader exploits a kernel bug, uses that access to start a root daemon, and late-loads a KernelSU kernel module into the running kernel. The manager app gets `su`, and root apps can request access. A full reboot clears all of it.

People use it for cases where permanent root is impossible or unwanted: carrier-locked Samsungs that cannot be OEM-unlocked, phones where an unlock trips Knox or wipes data, and owners who want root for an hour rather than a year.

### What it does

- Grants root to apps through a KernelSU-compatible manager.
- Runs a root shell on a locked bootloader.
- Loads some KernelSU modules for the current boot.
- Survives a soft reboot in many setups, because a soft reboot restarts Android's userspace, not the kernel.
- Leaves the stock boot image and the verified boot chain intact.

### What it does not do

- It does not survive a full reboot. The kernel module, the `su` daemon, and module mounts are gone.
- It does not unlock the bootloader or make unsigned images bootable.
- It does not allow custom ROMs, custom kernels, or custom recoveries.
- It does not guarantee Play Integrity, banking access, or app compatibility.
- It does not support every module. Late-load mode has no `init.rc` injection, no `preinit`, and no `post-fs-data`.
- It does not cover every device. Exploits need a matching build, and often a matching kernel layout.
- It does not stop updates from closing the bug.

### Who should not use it

Skip it if any of these apply:

- You want root that stays after a reboot. Unlock the bootloader and use a permanent solution.
- The phone is your only banking, work, or emergency device.
- You cannot identify the exact model, build, and kernel release.
- You are not willing to recover a bootloop or lose data.
- You need a module that runs before Android boots, changes the kernel, or writes a partition.
- You are using a phone you do not own or have permission to modify.

## How it works

A temporary root tool is a chain. Each stage can fail on its own, which is why a loader can report "exploit succeeded" and still leave you without `su`.

```text
unprivileged app or ADB shell
        |
        v
kernel vulnerability  ->  controlled kernel read/write
        |
        v
SELinux enforcement off for the session  ->  privileged helper runs as UID 0
        |
        v
root daemon on a local socket  ->  ksud late-load
        |
        v
KernelSU LKM inside the running kernel  ->  manager, su prompts, modules
        |
        v
full reboot  ->  module unloaded, daemon gone, back to stock
```

<details>
<summary>DirtyFrag: the page-cache write (CVE-2026-43284)</summary>

1. The app creates an IPsec ESP transform through `IpSecManager` with AES-CBC and HMAC-SHA256.
2. The kernel decrypts an ESP packet into the page cache of a file opened for `splice()`. By choosing the initialization vector, the decrypted block becomes the file content the attacker wants.
3. A helper spliced into `crash_dump64` carries the write into a `vendor_file` path that an ordinary app cannot reach.
4. Shellcode patched into `libc++.so` runs when `init` calls the hooked function. It checks UID and TID, uses `/dev/df` as a one-shot lock, and runs `insmod` in the `vendor_modprobe` domain.
5. The module sets SELinux permissive, handles DEFEX and vendor anti-tamper checks, and calls `call_usermodehelper` to run the root bootstrap.
6. The bootstrap starts the selected manager's `su` daemon, then `ksud late-load` loads the manager's kernel module.

There is no race window. If the kernel is vulnerable and the offsets match, the run either works or stops with an error.

</details>

<details>
<summary>GhostLock: the futex use-after-free (CVE-2026-43499)</summary>

1. Two threads create a circular dependency between priority-inheritance futexes.
2. `FUTEX_CMP_REQUEUE_PI` returns `-EDEADLK` and takes the rollback path. `remove_waiter()` clears `current->pi_blocked_on` instead of the waiter's pointer, leaving the waiter with a dangling pointer into its own reclaimed kernel stack frame.
3. `pselect6` with a carefully sized `nfds` copies three `fd_set` bitmaps onto the same stack region, overwriting the stale `rt_mutex_waiter`.
4. `sched_setattr()` walks the PI chain. The red-black tree rebalance turns the overwritten fields into one aligned kernel write.
5. Ports widen that write into read/write through a carrier object, disable SELinux, and start a root helper. Samsung ports forge a work item on a kernel workqueue so the kernel runs a helper with init credentials, because KDP protects credential pages at EL2.
6. The helper starts a root daemon, then `ksud late-load` loads the manager.

The bug entered Linux in 2.6.39, released in 2011. Nebula Security disclosed it in July 2026 and used it in its IonStack Android chain.

</details>

### KernelSU late-load

`ksud late-load` loads `kernelsu.ko` into an already-booted kernel instead of loading it during boot. It detects the Kernel Module Interface (KMI), picks the matching module, applies SELinux rules, and runs the module scripts that late-load supports.

The mode is narrower than a normal KernelSU boot.

| Feature | Normal boot | Late-load |
| --- | --- | --- |
| `init.rc` injection | Yes | Unavailable |
| Module `preinit` | Yes | Unavailable |
| `post-fs-data` scripts | Yes | Skipped |
| kprobe hooks for `ksud` | Yes | Skipped |
| Safe mode by volume key | Yes | Always disabled |
| Boot log capture | Yes | Skipped |
| `late-load.d`, `post-mount.d`, `service.d`, `boot-completed.d` scripts | Yes | Yes |

Modules that mount a file, hook an app, or start a late service can work. Modules that run before `system_server`, replace an early boot file, or inject into `init.rc` cannot. Some fail by bootlooping the phone.

### Soft reboot or full reboot

A **soft reboot** restarts Android's userspace and `system_server`, not the Linux kernel. The late-loaded module stays in the kernel, so root survives and modules can reactivate. Module installs usually ask for one.

A **full reboot** goes through the bootloader, loads the stock kernel, and starts fresh. Root is gone. Files under `/data` and `/data/adb` remain, including module files, but nothing makes them active.

### Why the exact build matters

- **Kernel offsets.** A port uses offsets extracted from a specific `vmlinux` or boot image.
- **Stack layout.** GhostLock only works if the freed waiter lands in the region the `fd_set` copy controls. Compiler optimization, LTO, and PGO can move it.
- **Page size.** A `-4k` profile does not cover a 16 KB page build.
- **Vendor hardening.** KDP, DEFEX, RKP, and anti-tamper modules change the escalation path.
- **Firmware build.** A vendor can backport the fix without changing the kernel version.

`6.6.98` is a kernel version. `6.6.98-android15-8-gf4dc45704e54-abogki446052083-4k` is a target. The full string, the model code, and often the firmware build all matter.

## Methods

### DirtyFrag

DirtyFrag is a page-cache write in the kernel's IPsec ESP handling. It is the more predictable of the two families because it does not depend on winning a race. The Android tools around it turn the write into UID 0, start a root daemon, and late-load KernelSU.

The bug has been in Linux since the XFRM ESP code changed in 2017. Fixed versions:

| Branch | Fixed in |
| --- | --- |
| 5.10 | 5.10.255 |
| 5.15 | 5.15.205 |
| 6.1 | 6.1.171 |
| 6.6 | 6.6.138 |
| 6.12 | 6.12.87 |
| 6.18 | 6.18.28 |
| 7.0 | 7.0.5 |

A build at or above the floor for its branch is patched. Vendors backport out of order, so treat the number as a hint and the loader's patch check as the verdict.

DirtyFrag ships prebuilt modules for these KMIs:

| KMI | Status | Notes |
| --- | --- | --- |
| `android12-5.10` | Tested | |
| `android13-5.10` | Untested | |
| `android13-5.15` | Tested | |
| `android14-5.15` | Untested | |
| `android14-6.1` | Partial | Some kernels up to 6.1.71. Newer 6.1 builds have an accidental mitigation. |
| `android15-6.6` | Tested | Common on 2025 and 2026 flagships. |
| `android16-6.12` | Tested | Common on 2026 flagships and some Android 17 builds. |
| `android17-6.18` | Untested | Listed, not proven. |

A KMI is not a device profile. Two phones on `android15-6.6` can have different kernels, page sizes, and vendor hardening.

**Tools**

| Tool | What it is | Notes |
| --- | --- | --- |
| [DirtyFrag](https://github.com/mitschud/DirtyFrag) | Hardened DFRoot fork with a Samsung focus | Autorun, auto soft reboot, module toggle, read-only partition protection, Odin indicator, log export. |
| [DFRoot](https://github.com/diabl0w/DFRoot) | Upstream exploit and app | Minimal feature set, manager-agnostic. |
| [DirtyFrag-Galaxy](https://github.com/coey0814/DirtyFrag-Galaxy) | One-click Samsung app | Korean and English docs. Needs a separate KernelSU manager. |
| [GhostSam](https://github.com/MocLG/GhostSam) | Samsung toolkit with DirtyFrag and GhostLock chains | Galaxy S22, S26, and Z Fold8. Needs ADB. |
| [DirtyInit](https://github.com/combeng6th/DirtyInit) | Samsung init-context root | A different endgame with a smaller support list. Experimental. |

**Run it**

1. Install the manager. On Samsung, use [diabl0w's KernelSU](https://github.com/diabl0w/KernelSU/releases/latest). Elsewhere, use KernelSU, KernelSU-Next, KowSU, or BakaSU. Open it once.
2. Install DirtyFrag from its [latest release](https://github.com/mitschud/DirtyFrag/releases/latest).
3. Select the manager in the SU Manager card. If your manager is missing, it probably does not ship `libksud.so`.
4. Check the model and kernel line. If the app shows a different build, stop.
5. Press **Run exploit**. Keep the app in the foreground. The run window is about 70 seconds.
6. Wait for the late-load to finish. Do not start a second run because the progress bar is slow.
7. Grant root to DirtyFrag if the manager asks.
8. Verify with `su -c id`.

**Switches that matter**

- **SU Manager.** On Samsung this is not a preference. Use the Samsung-patched build.
- **KernelSU Modules.** Disables all modules before `ksud` starts. It works without root, which makes it the escape hatch after a bad module.
- **Autorun.** Starts the exploit at boot. It is behind Expert mode because autorun plus a broken module is a bootloop that restarts the exploit.
- **Auto reboot (soft reboot).** Restarts userspace after late-load. It does not clear root.
- **RO partition protection.** Leave it on.
- **Odin indicator.** Reports whether the firmware is likely to allow download mode while a lock-screen credential is set.
- **Log export.** Saves the run log. Post it with the model, full kernel, manager version, and module list.

**Common failures**

- **"Not vulnerable" or "patching failed."** The kernel is patched, backported, or has the 6.1 mitigation. There is no app-side fix. Stop.
- **"Success" but no root.** Disable auto reboot and run again. The late-load may have been interrupted.
- **Progress at 0 percent.** The bar maps log markers. Wait out the 70 seconds.
- **A module bootloops the phone.** Set KernelSU Modules to Disabled, run again, and remove the module. Details in [Recovery](#recovery-and-troubleshooting).

### GhostLock

GhostLock is a use-after-free in the futex priority-inheritance code. It is the wider family because individual maintainers have ported it to specific phones that DirtyFrag does not cover. It is a race, so failed attempts and kernel panics are normal.

Fixed versions:

| Branch | Fixed in |
| --- | --- |
| 5.10 | 5.10.261 |
| 5.15 | 5.15.212 |
| 6.1 | 6.1.175 |
| 6.6 | 6.6.140 |
| 6.12 | 6.12.86 |
| 6.18 | 6.18.27 |
| 7.0 | 7.0.4 |

**Tools**

| Tool | Coverage | Transport |
| --- | --- | --- |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) | Meizu, Sony, ASUS, Xiaomi, OnePlus, OPPO, Honor, Motorola, Nothing, Pixel, and more | App, optionally Shizuku |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) | Galaxy S25, S24, S23, Z Fold4 and Fold7, A36, A53, A56, S24 FE, Tab S9 | App, Shizuku on some profiles |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) | Pixel 6 through Pixel 11 | Shizuku |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) | vivo and iQOO | Shizuku or ADB over TCP 5555 |
| [Root My Device](https://github.com/WitAqua-tools/Root-My-Device) | Xiaomi 17T Pro, Xiaomi 14T, Nothing Phone 3a, Quest 3, and other feed targets | App |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | Galaxy Z Fold6 `SM-F9560` builds | ADB or Shizuku |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) | OnePlus and some OPPO builds | ADB |
| [GhostLock-for-OnePlus](https://github.com/p2p3p/GhostLock-for-OnePlus) | OnePlus 15 and Ace 6T | ADB |

**Run it**

1. Install the manager the port names. Many Pixel and Samsung ports expect ReSukiSU or BakaSU rather than upstream KernelSU.
2. Install the loader from its upstream release.
3. Stage the transport. Shizuku must be running and authorized, or ADB must be connected.
4. Confirm the app or script detected the exact model, build, and kernel. If not, stop.
5. Start the run. Keep the screen on and the app in the foreground.
6. Wait. A panic and reboot is a failed attempt, not necessarily a brick.
7. If the run succeeds, the tool starts a root daemon and late-loads KernelSU. Verify with `su -c id`.
8. If it fails at the same stage every time, stop. A different build may be the cause.

**Retries**

Root My Pixel's README says the exploit is not fully reliable, and some users needed more than 20 attempts. Other ports built on the same race report similar behavior. Keep trying while the failure looks like timing. Stop when the log shows a profile mismatch, a wrong offset, or a build that the project does not list.

**Limits**

- No persistence across a full reboot.
- No custom ROM, kernel, or recovery.
- Some ports leave SELinux permissive for the session.
- Some ports break Wallet, RCS, or banking apps until the phone has been unrooted for a few days.
- A panic can leave a phone unable to boot if the device was already unstable or the profile is wrong.

### Which method to use

| Device | Start with |
| --- | --- |
| Samsung with a supported DirtyFrag kernel | DirtyFrag, then Root My Galaxy for an exact payload |
| Samsung with only a GhostLock port | Root My Galaxy, GhostSam, or the single-model port |
| Pixel 6 to Pixel 11 | Root My Pixel, then GhostLock App for unlisted profiles |
| vivo or iQOO | RootMyVivo |
| OnePlus, OPPO, Realme | DirtyFrag if supported, otherwise ghostlock-oneplus or GhostLock-for-OnePlus |
| Xiaomi, POCO, Redmi | GhostLock App profile, Root My Device, or DirtyFrag |
| Nothing, Meizu, Sony, ASUS, Motorola | GhostLock App or a single-device port |
| Amazon Fire, NVIDIA Shield, Meta Quest | The device-specific port |
| Bootloader already unlocked and you want permanent root | Use a standard KernelSU, Magisk, or APatch guide |

### Adjacent approaches

**Shizuku is not root.** It runs a service as the shell user, UID 2000, through ADB or wireless debugging. Apps can call privileged APIs through it. That is useful for staging an exploit, and several loaders require it. It does not give UID 0, kernel access, or KernelSU modules.

**ADB root needs a userdebug build.** `adb root` restarts `adbd` as root only when `ro.debuggable=1`. Retail phones ship user builds and refuse it.

**Magisk, KernelSU, and APatch are permanent solutions.** They patch or replace a boot image and need an unlocked bootloader. KernelSU's late-load mode is a component of temporary root, not a way to get root by itself.

**Bootloader mods are a different category.** Kaeru and Fenrir modify the MediaTek boot chain. They require flashing, they can brick the device, and they do not give you a root shell in the current boot.

**Older session roots are history.** Dirty Cow, Dirty Pipe, mtk-su, and the one-click apps of the 2010s all depended on bugs that are fixed. Do not install an old APK because a forum post says it still works.

**Virtual root is a sandbox.** Dual-space and parallel-space apps give selected apps a modified runtime. They do not modify the real system and do not grant UID 0 outside their sandbox.

For this README, temporary root means four things:

1. A kernel-level exploit obtains privileged kernel access.
2. A root daemon runs as UID 0 for the current boot.
3. A root manager is loaded so apps can request `su`.
4. A full reboot clears all of it.

| Approach | Bootloader | Survives reboot | Can flash ROMs | Main risk |
| --- | --- | --- | --- | --- |
| Magisk, KernelSU, APatch | Unlocked | Yes | Yes | Unlock wipes data, AVB state changes |
| DirtyFrag, GhostLock | Locked | No | No | Panic, module bootloop, exploit failure |
| Shizuku | Locked | Yes, as an ADB service | No | Limited to shell-level APIs |
| Kaeru, Fenrir | Unlocked or exploited | Yes | Sometimes | A wrong image can brick the boot chain |

## Quick start

This is the shortest safe path from a stock phone to a session root. It assumes a full reboot clears root.

> [!WARNING]
> Do not skip the build check. The most common failure is a tool that matches the model but not the kernel. The second is a module that needs early boot. Both can leave the phone in a bootloop.

### Step 1: Record the exact build

You need the model code, the firmware build ID, the full kernel release, the Android version, and the security patch.

With USB debugging and a computer:

```bash
adb devices
adb shell getprop ro.product.model
adb shell getprop ro.product.device
adb shell getprop ro.build.display.id
adb shell getprop ro.build.version.release
adb shell getprop ro.build.version.security_patch
adb shell getprop ro.vendor.build.security_patch
adb shell getprop ro.product.cpu.abi
adb shell uname -r
```

Without a computer, open **Settings > About phone** for the model and build, and run `uname -r` in Termux. Save the output somewhere you can read after a reboot.

### Step 2: Match the support list

Find your model in [Supported devices](#supported-devices), then open the linked project and check its list. The table here is a map. The upstream project is the authority.

Match the complete kernel release and, when the project lists one, the firmware build. A `-4k` profile does not cover a 16 KB page build. An `SM-S931B` profile does not cover an `SM-S938U`. A Pixel build for `CP2A.260705.006` does not cover a later OTA.

If the project does not list your exact build, stop. Do not try the closest one.

### Step 3: Choose the method

Use the table in [Which method to use](#which-method-to-use). DirtyFrag is faster and more predictable when it supports the kernel. GhostLock has more ports and more retries. Neither one lets you skip a backup.

### Step 4: Install the manager

The exploit needs a KernelSU-compatible manager that ships `libksud.so`.

- **Samsung:** [diabl0w's KernelSU](https://github.com/diabl0w/KernelSU/releases/latest).
- **Other devices:** [KernelSU](https://github.com/tiann/KernelSU/releases/latest), [KernelSU-Next](https://github.com/KernelSU-Next/KernelSU-Next/releases/latest), [KowSU](https://github.com/KOWX712/KernelSU/releases/latest), or [BakaSU](https://github.com/Baka-SU/BakaSU/releases/latest), whichever the loader documents.
- **Root My Pixel:** the ReSukiSU/BakaSU manager named in its README.

Open the manager once. Do not use its install, flash, or patch boot image buttons on a locked phone.

### Step 5: Run the loader

1. Install the loader from its upstream release page.
2. Grant the permissions it asks for. Some need Shizuku.
3. Select your manager if the app has a selector.
4. Confirm the app detected the expected model and kernel.
5. Start the run and keep the app in the foreground.
6. Wait. DirtyFrag runs for about 70 seconds. GhostLock may reboot once or several times.
7. Grant root to the loader if the manager asks after late-load.

Do not unplug the cable, force-stop the app, or start a second run while the first is working.

### Step 6: Verify root

```bash
adb shell su -c id
```

Expected output:

```text
uid=0(root) gid=0(root) groups=0(root) context=u:r:su:s0
```

The SELinux context can differ. What matters is `uid=0(root)`. Also check that the manager shows a version and that a root app you trust can request access.

If `su` is missing, the exploit may have succeeded while late-load failed. Check [Troubleshooting](#troubleshooting) before trying another payload.

### Step 7: Add modules one at a time

Install one module, soft reboot, test the phone. If it bootloops, use the loader's module-disable switch or Android safe mode. Do not install five modules and then guess which one broke the boot.

A soft reboot keeps root. A full reboot clears it. Use the manager's soft reboot action, not `adb reboot`.

### Step 8: Reboot when done

A full reboot returns the phone to stock. The loader and module files can stay installed; they are inert without the kernel module. If you want them gone, read the project's unroot notes before deleting anything.

### Checklist

- [ ] Model code, build ID, and full `uname -r` recorded.
- [ ] Exact build appears in the upstream support list.
- [ ] Data backed up.
- [ ] Recovery option understood, including Samsung download mode.
- [ ] Correct manager installed and opened.
- [ ] Loader downloaded from the upstream release page.
- [ ] No Magisk, no partition images, no "permanent root" tool.
- [ ] Module plan is one at a time.
- [ ] Reboot plan understood: soft keeps root, full clears it.

## Supported devices

Every row maps a device to a tool and a known build. Statuses come from project READMEs, payload feeds, and public test reports. The maintainers of this README have not tested the hardware.

**Read the exact row.** A model family is not a target. A kernel major version is not a target. The build string and `uname -r` are the target.

| Status | Meaning |
| --- | --- |
| Verified | Reproduced on hardware by more than one tester, or by the project maintainer with a log. |
| Tested | The project reports hardware validation, or the target is in a device-tested payload feed. Not tested by the maintainers of this README. |
| Reported | A profile or public report exists without broad validation. |
| Experimental | The project marks it as in progress, shell-only, or unverified. |
| Not feasible | The port documentation says the layout cannot work on that build. |
| Broken | The project says the chain does not work end to end. |

A kernel string like `6.6.98-android15-8-gf4dc45704e54-abogki446052083-4k` carries the upstream version, the KMI, a git commit, a vendor build ID, and the page size. The KMI `android15-6.6` describes the kernel branch, not the marketing Android version. A `-4k` profile does not cover a 16 KB page device.

### Samsung Galaxy

| Device | Model | Build or kernel | Tool | Status |
| --- | --- | --- | --- | --- |
| Galaxy S25, S25+, S25 Ultra, S25 Edge | SM-S931, S936, S938, S937; SC-51F, SCG31, SC-52F, SCG32 | 6.6.98 | Root My Galaxy | Tested |
| Galaxy S25+ China | SM-S9360 | S9360ZCSCCZG1, 6.6.98 | Root My Galaxy | Tested |
| Galaxy S25 Edge China | SM-S9370 | S9370ZCS9CZG1, 6.6.98 | Root My Galaxy | Tested |
| Galaxy Z Fold7 | SM-F966U, F966U1, F966B | F966USQU9BZDN and later, 6.6.98 | Root My Galaxy | Tested |
| Galaxy S24 Ultra | SM-S928U1, S928W, S928B, S9280 | S928USQS6DZF2 and later, 6.1.145 | Root My Galaxy | Tested |
| Galaxy S24+ | SM-S926B | S926BXXUEDZDR, 6.1.157 | Root My Galaxy | Tested |
| Galaxy S24 | SM-S921B, SM-S921N | S921BXXSFDZE1, 6.1.157 | Root My Galaxy | Tested |
| Galaxy S24 FE | SM-S721B | S721BXXSCDZF3, 6.1.157 | Root My Galaxy | Tested |
| Galaxy S23 Ultra | SM-S918B, S9180, S918N, S918Q, S918U, S918W, S918U1 | S918BXXSAFZF5, 5.15.189 | Root My Galaxy | Tested |
| Galaxy S23+ | SM-S916B | S916BXXSAFZG1, 5.15.189 | Root My Galaxy | Experimental |
| Galaxy S23 | SM-S911U1 | S911U1UES6DYI3, 5.15.153 | Root My Galaxy | Experimental |
| Galaxy A56 5G | SM-A5660, A566B, A566E, A566S, A566U1, A566W | A566EXXSCCZG6, 6.6.102 | Root My Galaxy | Tested |
| Galaxy A36 5G | SM-A366W | A366WVLS3AYG1, 6.6.46 | Root My Galaxy | Tested |
| Galaxy A53 5G | SM-A536E | A536EXXSNGZG3, 5.10.237 | Root My Galaxy | Tested |
| Galaxy Tab S9 | SM-X710 | X710XXS6EZF1, 5.15.189 | Root My Galaxy | Tested |
| Galaxy Z Fold4 | SM-F9360 | F9360ZCSAIZF1, 5.10.236 | Root My Galaxy | Tested |
| Galaxy S22 series | SM-S901, S906, S908 variants | 66 builds, kernels 5.10 to 5.15 | GhostSam | Tested |
| Galaxy S26 series | SM-S9420, S9470, S9480 variants | 153 builds, 6.6 and 6.12 | GhostSam | Tested |
| Galaxy Z Fold8 | SM-F9710, F9760 variants | 73 builds, 6.6 and 6.12 | GhostSam | Tested |
| Galaxy Z Fold6 China | SM-F9560 | F9560ZCS4DZI1, F9560ZCS4DZH5, F9560ZCS4DZG3, 6.1.145 | GhostLock-Galaxy | Tested |
| Galaxy A17 | SM-A175F | A175FXXS3BZA5 (6.12.23), A175FXXS6CZG1 (6.12.38) | ghostlock-a17 | Tested |
| Galaxy A16 5G | SM-A166W | A166WVLS8DZG1 | Single-model port | Reported |

The S23+ `SM-S916B` and S23 `SM-S911U1` profiles work outside the normal Root My Galaxy feed, which is why they are marked Experimental.

### Google Pixel

| Family | Models | Builds | KMI | Tool | Status |
| --- | --- | --- | --- | --- | --- |
| Pixel 11 | 11, 11 Pro, 11 Pro XL, 11 Pro Fold | CD1A.260618.001.C2, .C3 | android16-6.12 | Root My Pixel | Tested |
| Pixel 10 | 10, 10 Pro, 10 Pro XL, 10 Pro Fold | CP2A.260705.006, CP2A.260805.005 | android15-6.6 | Root My Pixel | Tested |
| Pixel 10a | 10a | CP2A.260705.006, CP2A.260805.005 | android14-6.1 | Root My Pixel | Tested |
| Pixel 9 | 9, 9 Pro, 9 Pro XL, 9 Pro Fold, 9a | CP2A.260705.006, AD1A.240905.004 | android14-6.1 or android15-6.1 | Root My Pixel | Tested |
| Pixel 8 | 8, 8 Pro, 8a | CP2A.260705.006, CP2A.260805.005 | android14-6.1 | Root My Pixel | Tested |
| Pixel 7 | 7, 7 Pro, 7a | CP2A.260705.006, BP2A.250705.008 | android14-6.1 | Root My Pixel | Tested |
| Pixel 6 | 6, 6 Pro, 6a | CP2A.260705.006, CP1A.260405.005 | android14-6.1 | Root My Pixel | Tested |
| Pixel Fold | Fold | CP2A.260605.012, CP2A.260705.006 | android14-6.1 | Root My Pixel | Tested |
| Pixel Tablet | Tablet | BP1A.250405.007, CP2A.260705.006 | android14-6.1 | Root My Pixel | Tested |

GhostLock App also lists Pixel 7, 9a, 9 Pro, 9 Pro Fold, 10, and 11 profiles. Use one tool per device.

### OnePlus, OPPO, and Realme

| Device | Model | Build or kernel | Tool | Status |
| --- | --- | --- | --- | --- |
| OnePlus Ace 6T | PLR110 | 6.12.38, ColorOS 16.0.2.403 and 16.0.8.301 | GhostLock-for-OnePlus | Verified |
| OnePlus 15 | PLK110 | 6.12.23 | GhostLock-for-OnePlus | Verified |
| OnePlus 15 | CPH2745, CPH2747, CPH2749 | 6.12.23 | ghostlock-oneplus | Reported |
| OnePlus 13 | CPH2653, IN2060 | 6.6.89 | ghostlock-oneplus | Reported |
| OnePlus 15T | not listed | 6.12.38 | GhostLock App | Reported |
| OPPO Find X8, Find X8 Pro | not listed | 6.6.118 | GhostLock App | Reported |
| OPPO Find X8 Ultra, OnePlus 13, Ace 5 Pro | not listed | 6.6.118 | GhostLock App | Reported |
| OPPO Find N5 | not listed | 6.6.118 | GhostLock App | Reported |
| OPPO Pad 4 Pro | not listed | 6.6.89 | GhostLock App | Reported |
| OPPO Pad 5, OnePlus Pad 2, Find X8s | not listed | 6.6.118 | GhostLock App | Reported |
| Realme GT 7T | RMX5085 | 6.6.118 | ghostlock-rmx5085 | Reported |

The same model can appear in a working row and a not-feasible row because the build changes the layout. Read the kernel, not the product name.

### vivo and iQOO

| Device | Model | Build or kernel | Tool | Status |
| --- | --- | --- | --- | --- |
| iQOO Neo 11 | PD2520 | 6.6.89, 6.6.127 | RootMyVivo | Tested |
| iQOO Z10 Turbo Pro | PD2453 | 6.6.89 | RootMyVivo | Tested |
| iQOO 13 India, Neo10 Pro, vivo X200, X200 Pro | not listed | payload catalog builds | RootMyVivo | Experimental |
| iQOO Z9 5G | I2302 | 5.15.178 | iQOO Z9 / vivo T3 port | Reported |
| vivo T3 5G | V2334 | 5.15.178 | iQOO Z9 / vivo T3 port | Reported |
| vivo X200 Pro | not listed | 6.6.30 | GhostLock App | Reported |
| vivo T4, iQOO 12 | not listed | 6.1.145 | GhostLock App | Reported |

RootMyVivo's own guidance: 6.6 builds below 6.6.139 and 6.1 builds below 6.1.144.

### Xiaomi, POCO, and Redmi

| Device | Codename | Build or kernel | Tool | Status |
| --- | --- | --- | --- | --- |
| Xiaomi 17, 17 Pro, 17 Pro Max, 17 Ultra | not listed | 6.12.23 | GhostLock App | Reported |
| Xiaomi 17T | not listed | 6.6.102 | GhostLock App | Reported |
| Xiaomi 17T Pro Japan | warhol | OS3.0.304.0.WPSJPXM, 6.12.38 | Root My Device | Reported |
| Xiaomi 14T Japan | XIG07 | OS3.0.7.0.WNEJPKD, 6.1.138 | Root My Device | Reported |
| Xiaomi 15 | not listed | 6.6.77 | GhostLock App | Reported |
| Xiaomi 15 Pro, Redmi K80 Pro, K80 Ultra | not listed | 6.6.77 | GhostLock App | Reported |
| Xiaomi 14 | not listed | 6.1.118, 6.1.138 | GhostLock App | Reported |
| Xiaomi 13T | not listed | 6.12.38 | GhostLock App | Reported |
| Xiaomi Civi 5 Pro, Redmi K90, POCO F7 | not listed | 6.6.77 | GhostLock App | Reported |
| Redmi K90 Pro Max | not listed | 6.12.23 | GhostLock App | Reported |
| Redmi K90 Ultra | not listed | 6.6.118 | GhostLock App | Reported |
| Redmi K80 | not listed | 6.1.138 | GhostLock App | Reported |
| POCO X6 Pro | not listed | 6.1.115, 6.1.138 | GhostLock App | Reported |
| POCO X8 Pro | not listed | 6.6.89 | GhostLock App | Reported |
| POCO X8 Pro Max | not listed | 6.6.89, 6.6.118 | GhostLock App | Reported |
| POCO F7 | not listed | 6.6.77, 6.6.118 | GhostLock App | Reported |
| POCO M6 Pro 4G | emerald | 6.12.30-android16-5, 4k | ghostlock-emerald | Reported |
| Redmi Note 15 Pro+ | not listed | 6.1.118 | GhostLock App | Reported |
| Redmi Note 14 Pro 5G, POCO X7 | not listed | 6.1.138 | GhostLock App | Reported |
| Redmi Note 13 5G | not listed | 6.6.118 | GhostLock App | Reported |
| Redmi Note 15 4G | not listed | 6.12.30 | GhostLock App | Reported |
| Redmi 15C 4G, POCO C85 4G | not listed | 6.6.89 | GhostLock App | Reported |
| Xiaomi Pad 7 Ultra | not listed | 6.6.118 | GhostLock App | Reported |
| Redmi Turbo 5 Max | not listed | 6.6.118 | GhostLock App | Reported |

### Nothing, Meizu, Sony, ASUS, Motorola

| Device | Model or codename | Build or kernel | Tool | Status |
| --- | --- | --- | --- | --- |
| Nothing Phone (3a) Pro | A059P | 6.1.157-android14-11 | GhostLock App | Reported |
| Nothing Phone (3a) | A059, Asteroids | B4.1-260618-1048, 6.1.157 | Root My Device | Tested |
| Nothing Phone (3) | not listed | 6.6.102 | GhostLock App | Reported |
| Nothing Phone (1) | spacewar | 5.4.302 | Root My Nothing | Broken |
| Meizu 21 | M2461, meizu21 | 6.1.25-android14-11 | Meizu 21 GhostLock, GhostLock App | Reported |
| Meizu 21 Pro | not listed | 6.1.25 | GhostLock App | Reported |
| Meizu 20 Pro | not listed | 5.15.41 | GhostLock App | Reported |
| Sony Xperia 1 V | not listed | 5.15.189 | GhostLock App | Reported |
| ASUS Zenfone 10 | not listed | 5.15.206 | GhostLock App | Reported |
| ASUS Zenfone 11 Ultra | not listed | 6.1.162 | GhostLock App | Reported |
| ASUS Zenfone 9 | ASUS_AI2202 | 5.10.205-android12-9 | zenfone9-ghostlock | Reported |
| Motorola Razr 50 Ultra, Razr+ 2024 | not listed | 6.1.145 | GhostLock App | Reported |
| Motorola Edge 60 Fusion | not listed | 6.1.145 | GhostLock App | Reported |
| Motorola Razr 60 Ultra | not listed | 6.6.118 | GhostLock App | Reported |
| Motorola Edge 40 | not listed | 6.6.127 | GhostLock App | Reported |
| Motorola Razr Fold | not listed | 6.12.38 | GhostLock App | Reported |

### Honor, Infinix, TECNO, Lenovo, ZTE

| Device | Build or kernel | Tool | Status |
| --- | --- | --- | --- |
| Honor Magic V5 | 6.6.89, two firmware builds | GhostLock App | Reported |
| Infinix Note 50s 5G, GT 30 | 6.1.145 | GhostLock App | Reported |
| Infinix GT 30 Pro | 6.1.157 | GhostLock App | Reported |
| TECNO POVA 7 4G | 6.12.38 | GhostLock App | Reported |
| Lenovo Xiaoxin Pad Pro 12.7 | 6.1.138 | GhostLock App | Reported |
| Lenovo Yoga Tab Plus | 6.1.138 | GhostLock App | Reported |
| Lenovo Legion Tab Gen 5 China | 6.12.30 | GhostLock App | Reported |
| Lenovo Legion Y700 Wuji | 6.12.38 | GhostLock App | Reported |
| ZTE Nubia NX809J, NX888J | 6.12.38 | GhostLock App | Reported |

### Amazon, NVIDIA, and Meta

| Device | Codename | Build or kernel | Tool | Status |
| --- | --- | --- | --- | --- |
| Amazon Fire Max 11 | sunstone | Fire OS 8 RS8338.3339N, 5.10 | GhostLock-5.10 | Tested |
| Fire TV Stick 4K Max 2023 | karat | Fire OS 8 RS8182.3811N, 5.10 | GhostLock-5.10 | Tested |
| NVIDIA Shield TV Pro 2019 | mdarcy | Shield Experience 9.2.4, 4.9.141 | GhostLock NVIDIA Shield | Tested |
| Meta Quest 3 | eureka | 5.10.240, incremental 52345320035400520 | IonStackQuest3, Root My Device | Reported |
| Meta Quest 3S | not listed | builds in the port | IonStackQuest3 | Reported |

The Shield port gives UID 0 `adbd`, not a general `su` manager. Root is lost when `adbd` restarts. The Quest ports are headset-specific and do not follow the phone flow.

### Not feasible or not ready

| Device or tool | Why | Status |
| --- | --- | --- |
| OPPO Find X9 Ultra, 6.12.58 | PGO layout moves the futex waiter out of the controllable stack region | Not feasible |
| OnePlus 15 PLK110, 6.12.69 | Same layout problem on that build | Not feasible |
| OnePlus 12, 6.1.141 | Same layout problem on that build | Not feasible |
| iQOO Neo 10 China, 6.1.84 | Waiter offset outside the feasible range | Not feasible |
| OPPO PKW110, 5.15.180 | Waiter offset outside the feasible range | Not feasible |
| Nothing Phone (1) | Chain is not working end to end | Broken |
| Galaxy S25 FE | GhostLock port is work in progress | Experimental |

If your device is not listed, check the upstream support lists first. Then search GitHub for the codename and CVE. Treat a new port as experimental until its README shows a completed chain and a log. Do not ask a maintainer to "make it work" without the model, build, kernel, and log.

## Tools

A temporary root setup has three parts: an exploit loader, a KernelSU-compatible manager, and the transport the loader needs. Some apps bundle all three.

### Managers

| Manager | What it is | Notes |
| --- | --- | --- |
| [KernelSU](https://github.com/tiann/KernelSU) | Official kernel-based root manager | GKI devices, late-load support |
| [KernelSU-Next](https://github.com/KernelSU-Next/KernelSU-Next) | KernelSU fork | Non-Samsung devices the loader lists |
| [KowSU](https://github.com/KOWX712/KernelSU) | KernelSU fork | Alternative manager |
| [BakaSU](https://github.com/Baka-SU/BakaSU) | KernelSU fork, formerly ReSukiSU | Pixel and other ReSukiSU targets |
| [diabl0w KernelSU](https://github.com/diabl0w/KernelSU) | Samsung-patched KernelSU | Samsung DirtyFrag and several Galaxy ports |

The manager must ship `libksud.so`. DirtyFrag 1.10 and later stages `ksud` from the selected manager, so a manager without that library cannot give you root. On Samsung, use diabl0w's build. DirtyFrag 1.16 drops zandatsu07's KernelSU-Next for Samsung because it only worked on S23 and older 5.15 kernels.

Do not use the manager's install, flash, or patch boot image buttons on a locked phone.

### Loaders and ports

| Tool | Exploit | Coverage | Transport | Status |
| --- | --- | --- | --- | --- |
| [DirtyFrag](https://github.com/mitschud/DirtyFrag) | CVE-2026-43284 | Samsung and other supported KMIs | On-device | Working |
| [DFRoot](https://github.com/diabl0w/DFRoot) | CVE-2026-43284 | Broad, manager-agnostic | On-device or ADB | Working |
| [DirtyFrag-Galaxy](https://github.com/coey0814/DirtyFrag-Galaxy) | CVE-2026-43284 | Samsung Galaxy builds with the primitive | On-device | Working |
| [GhostSam](https://github.com/MocLG/GhostSam) | Both | Galaxy S22, S26, Z Fold8 | ADB | Working |
| [GhostLock App](https://github.com/YuKongA/ghostlock-app) | CVE-2026-43499 | Meizu, Sony, ASUS, Pixel, Xiaomi, OnePlus, OPPO, Honor, Motorola, Nothing | App or Shizuku | Working |
| [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) | CVE-2026-43499 | Galaxy S25, S24, S23, Z Fold4 and Fold7, A36, A53, A56, S24 FE, Tab S9 | App or Shizuku | Working |
| [Root My Pixel](https://github.com/alex193a/Root-My-Pixel) | CVE-2026-43499 | Pixel 6 through Pixel 11 | Shizuku | Working |
| [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo) | CVE-2026-43499 | vivo and iQOO | Shizuku or ADB TCP | Working |
| [Root My Device](https://github.com/WitAqua-tools/Root-My-Device) | CVE-2026-43499 | Xiaomi 17T Pro, 14T, Nothing 3a, Quest 3, and feed targets | App | Working |
| [Root My S24](https://github.com/NanoTurtle1145/root-my-s24) | CVE-2026-43499 | Galaxy S24 China, Hong Kong, Taiwan; Z Fold6 China | App | Working |
| [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy) | CVE-2026-43499 | Galaxy Z Fold6 SM-F9560 builds | ADB or Shizuku | Working |
| [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus) | CVE-2026-43499 | OnePlus and some OPPO builds | ADB | Working |
| [GhostLock-for-OnePlus](https://github.com/p2p3p/GhostLock-for-OnePlus) | CVE-2026-43499 | OnePlus 15, Ace 6T | ADB | Working |
| [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17) | CVE-2026-43499 | Galaxy A17 SM-A175F | ADB | Working |
| [GhostLock-5.10](https://github.com/R0rt1z2/GhostLock) | CVE-2026-43499 | Amazon Fire Max 11, Fire TV Stick 4K Max 2023 | ADB | Working |
| [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4) | CVE-2026-43499 | Shield TV Pro 2019 | ADB | Working |
| [IonStackQuest3](https://github.com/F-19-F/IonStackQuest3) | CVE-2026-43499 | Meta Quest 3 and 3S | ADB | Working |
| [DirtyInit](https://github.com/combeng6th/DirtyInit) | CVE-2026-43284 | Samsung devices with the primitive | ADB relay | Experimental |
| [Root My Nothing](https://github.com/ang3lo-azevedo/root-my-nothing) | CVE-2026-43499 | Nothing Phone (1) | App | Broken |
| [KSuRoot](https://github.com/hmascs/KSuRoot) | CVE-2026-43499 | Multi-device repack | On-device | Caveat |

More single-device ports:

- [ghostlock-emerald](https://github.com/datfooldive/ghostlock-emerald), POCO M6 Pro 4G.
- [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock), ASUS Zenfone 9.
- [ghostlock-rmx5085](https://github.com/Nixbones/ghostlock-rmx5085), Realme GT 7T.
- [Meizu 21 GhostLock](https://github.com/ymh001/meizu21-ghostlock-root), Meizu 21.
- [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock), iQOO Z9 5G and vivo T3 5G.
- [ghostlock-xringo1](https://github.com/ayyy7128/ghostlock-xringo1), XRING O1 on 6.6.77 and 6.6.118.

"Broken" means the project's own README says the chain does not work end to end. "Caveat" means it bundles payloads or profiles from several sources and has not been audited. Do not treat a multi-device repack as a trusted upstream.

### Helpers

| Tool | What it does | Why it matters |
| --- | --- | --- |
| [Shizuku](https://github.com/RikkaApps/Shizuku) | ADB-privileged API bridge | Some loaders use it to stage payloads. It is not root. |
| [Platform Tools](https://developer.android.com/tools/releases/platform-tools) | `adb` and `fastboot` | Build checks, logs, sideloading, uninstall recovery. |
| [Termux](https://github.com/termux/termux-app) | Terminal emulator | `uname -r`, `su`, and on-device checks. Use the F-Droid or GitHub build. |
| [Obtainium](https://github.com/ImranR98/Obtainium) | Direct APK updates from GitHub | Keeps loaders on the maintainer's release channel. |
| [LSPosed module repository](https://modules.lsposed.org/) | Xposed module index | Finding modules. Test one at a time. |
| [MMRL](https://github.com/MMRLApp/MMRL) | Module repository manager | Discovery for KernelSU and Magisk modules. Check compatibility first. |

### Verify a download

- Use the upstream repository's Releases page. Avoid file-sharing links, Telegram reposts, and mirror sites.
- Check the release tag and date against the README or changelog.
- Compare published hashes or signing fingerprints when the project provides them.
- A clean VirusTotal result is not proof that an exploit APK is safe.
- Build from source if you can.
- Do not grant root to a loader you cannot identify.

### Porting

Every loader is built around device-specific offsets. Porting is not a beginner task, and a generated profile is a candidate, not a supported device. Read the [GhostLock App porting guide](https://github.com/YuKongA/ghostlock-app/blob/main/docs/kernel_profiles/README.md), the [Root My Galaxy payload notes](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads), the [ghostlock-oneplus README](https://github.com/JoinChang/ghostlock-oneplus), or the [GhostLock-Galaxy target extraction notes](https://github.com/wxxsfxyzm/GhostLock-Galaxy). Do not publish a device as supported until the chain completes on hardware.

## Modules

A temporary session is not a normal KernelSU install. Modules that expect early boot, `init.rc` injection, or a full sepolicy cannot work. Some fail with an error. Some reboot the phone. A few can brick a locked device.

The main test environment behind these reports is a Galaxy S25 `SM-S931B` (EUX) on One UI 8.5, builds `CZG3` and `CZH1`, using Root My Galaxy. Community reports fill in the rest.

| Status | Meaning |
| --- | --- |
| Working | Reported working on temporary root by the maintained list or a community test. |
| Caveat | Works for some people, with a known bug or setup requirement. |
| Broken | Reported not working. Some entries reboot the phone. |
| Avoid | Known hardbrick or serious failure on a locked device. |
| Outdated | Superseded or unmaintained. |
| Reported | A community report that has not been reproduced widely. |

### Working and caveated

| Module | Category | What it does | Status | Notes |
| --- | --- | --- | --- | --- |
| [LSPosed](https://github.com/KernelSU-Modules-Repo/zygisk_lsposed) | Framework | Xposed framework | Working | GPS can misbehave. Needs a Zygisk provider. Scope changes need a soft reboot. |
| [ZygiskNext](https://github.com/Dr-TSNG/ZygiskNext) | Framework | Zygisk implementation for KernelSU | Working | The test thread pairs it with LSPosed. Version matters. |
| [Vector](https://github.com/JingMatrix/Vector/releases) | Framework | LSPosed fork | Caveat | Confirmed buggy, with random soft reboots. |
| [AdClose](https://github.com/zjyzip/AdClose) | Ads | Blocks ads and app limits through Xposed | Working | |
| [AdGuard Certificate](https://github.com/AdguardTeam/adguardcert) | Ads | HTTPS filtering certificate as a module | Working | |
| [AFWall+](https://github.com/ukanth/afwall) | Firewall | iptables firewall app | Working | Root app. Grant per app. A bad rule can cut off ADB. |
| [bindhosts](https://github.com/bindhosts/bindhosts) | Ads | Systemless hosts | Working | |
| [Discover Ads Filter](https://github.com/hxreborn/discover-ads-filter) | Ads | Removes ads from Google Discover | Working | |
| [amznkiller](https://github.com/hxreborn/amznkiller) | App mods | Removes Amazon app ads | Working | |
| [Facebook App Ads Remover](https://github.com/Loukious/FacebookAppAdsRemover) | App mods | Removes Facebook app ads | Working | |
| [NexAlloy](https://github.com/nexalloy/NexAlloy) | App mods | App modification toolkit | Working | |
| [Re:X](https://github.com/Xposed-Modules-Repo/one.dot.rex) | App mods | Xposed module for X | Working | |
| [ReVancedXposed_Spotify](https://github.com/TheWinner02/ReVancedXposed_Spotify) | App mods | Spotify patches | Working | |
| [WaDeepDark](https://github.com/Dhangofa/WaDeepDark) | App mods | WhatsApp theming | Working | |
| [YouTube ReVanced](https://github.com/Zy0x/YouTube-Revanced/) | App mods | YouTube patches | Working | Update only after checking reports. |
| [IAmNotADeveloper](https://github.com/xfqwdsj/IAmNotADeveloper) | Patches | Hides developer options state | Working | |
| [Migrate-OSS](https://github.com/BaltiApps/Migrate-OSS) | Patches | Backup and migration | Working | |
| [pairipfix](https://github.com/mezo123451A/pairipfix) | Patches | Bypasses PairIP signature checks | Working | |
| [Update Locker](https://github.com/Xposed-Modules-Repo/ru.mike.updatelocker/) | Patches | Stops selected apps from updating | Working | |
| [Zygisk Detach](https://github.com/j-hc/zygisk-detach) | Patches | Detaches apps from the Play Store | Working | Needs a working Zygisk provider. |
| [CorePatch](https://github.com/LSPosed/CorePatch) | Patches | Disables signature verification | Caveat | Confirmed buggy, with a soft bootloop report. Keep the module-disable switch ready. |
| [DuckUSB](https://github.com/Bouteillepleine/DuckUSB) | Files and USB | Hides USB debugging from scoped apps | Working | |
| [MT Manager](https://mt2.cn/download/) | Files and USB | File manager and APK editor | Working | Root app. Do not edit system files on a locked phone. |
| [OneUI Settings Hook](https://github.com/HeheJuice/OneUI-Settings-Hook) | One UI | Adds and changes One UI settings | Working | Samsung only. |
| [OneUIX](https://github.com/SoClear/OneUIX) | One UI | One UI customization | Working | |
| [App Manager](https://github.com/Muntashirakon/AppManager) | System | Package manager and debloat tool | Working | Root app. |
| [net-switch](https://github.com/Rem01Gaming/net-switch) | System | Network mode switching | Working | |
| [Scene](https://omarea.com/) | System | Performance and battery profiles | Working | Avoid kernel or voltage changes. |
| [Frosty](https://github.com/Drsexo/Frosty) | System | Battery and Google services optimization | Caveat | Buggy, with possible wake-lock issues. |
| [ViPERFX_RE](https://github.com/likelikeslike/ViPERFX_RE) | Audio | ViPER4Android audio processing | Caveat | Read the install order. It expects KernelSU. |

### Broken

| Module | What happens | Status |
| --- | --- | --- |
| [Enable Screenshot (Disable FLAG_SECURE)](https://modules.lsposed.org/module/io.github.lsposed.disableflagsecure/) | Reboots the device on the test build. | Broken |
| [PrivacySpace](https://github.com/Xposed-Modules-Repo/cn.geektang.privacyspace) | Does not work. | Broken |
| [NeoZygisk](https://github.com/JingMatrix/NeoZygisk) | Reboots the device. | Broken |
| [ReZygisk](https://github.com/PerformanC/ReZygisk) | Reboots the device. | Broken |
| [Treat-Wheel-Zygisk](https://github.com/PerformanC/Treat-Wheel-Zygisk) | Reboots the device. | Broken |

ZygiskNext and LSPosed are the pair the test thread lists as working. Three other Zygisk implementations reboot the phone. Do not swap them "for stability" without reading current reports.

### Avoid on a locked phone

| Module | Why | Status |
| --- | --- | --- |
| [Magisk](https://github.com/topjohnwu/Magisk) | Direct Install writes protected images. On a locked Samsung this has caused a permanent hardbrick and the D2 screen. | Avoid |
| [KonaBess-Next](https://github.com/KonaBess-Next/KonaBess-Next) | GPU voltage and clock changes. Reported permanent hardbrick on the test device. | Avoid |
| [KonaBess](https://github.com/libxzr/KonaBess) | Older GPU modification tool. | Outdated |

The Magisk entry does not mean Magisk is malware. It means Magisk's install model assumes an unlocked bootloader. Using Direct Install on a locked phone is the mistake.

### Reported, needs more testing

These came from the XDA thread or later reports. One report is not a compatibility result.

| Module | What it does | Notes |
| --- | --- | --- |
| [HMA](https://github.com/frknkrc44/HMA-OSS) | Hides apps from selected apps | Needs a soft restart to start its service. |
| [Tailscale module](https://github.com/anasfanani/magisk-tailscaled) | Runs Tailscale as a root service | Worked for at least one user. |
| [Crond4Android](https://github.com/powerAn2020/crond4android) | Cron daemon with a UI | |
| [Sui](https://github.com/XiaoTong6666/Sui) | Alternative superuser interface | Do not run it alongside KernelSU without reading both projects. |
| [pm-install-from-anywhere](https://github.com/1ndevelopment/pm-install-from-anywhere) | Lets `pm` install APKs from any path | |
| [CaptureSposed](https://github.com/99keshav99/CaptureSposed) | Disables Android 14 screenshot detection | Conflicts with the Enable Screenshot failure report. |

### Why modules fail here

Late-load KernelSU is missing several mechanisms that a normal boot provides:

- No `init.rc` injection.
- No module `preinit`.
- No `post-fs-data` event.
- kprobe hooks for `ksud` are skipped.
- Safe mode detection is disabled.
- Boot log capture is skipped.

A module that mounts a file or hooks an app at runtime can survive those limits. A module that replaces a boot script, patches `system_server` too early, or expects to run before the package manager starts cannot. Some modules do not check for the missing feature. They write to a path, fail, and take the boot with them.

Samsung adds DEFEX path restrictions and KDP. A module that works on a Pixel may fail on a Galaxy because its helper cannot execute from the path it chose.

### Install order that reduces pain

1. Confirm `su -c id` works and the manager opens.
2. Install one module.
3. Soft reboot.
4. Open the module's app or check the feature it changes.
5. If the phone bootloops, do a full reboot, disable all modules in the loader, and run the exploit again.
6. Remove the bad module before re-enabling the rest.

Do not install LSPosed, a Zygisk provider, three Xposed modules, and a kernel tweaker in one pass. When the phone bootloops, you will not know which one caused it, and the manager may not be reachable.

## Apps

Most root apps do not care how the kernel module was loaded. They call `su`, get a UID 0 shell, and run. Apps that start a service before Android finishes booting, load a kernel driver, or depend on a permanent manager will fail.

| App | What it does | Status | Notes |
| --- | --- | --- | --- |
| [App Manager](https://github.com/Muntashirakon/AppManager) | Package manager, viewer, debloat, backups | Working | Also works through Shizuku without root. |
| [MT Manager](https://mt2.cn/download/) | File manager and APK editor | Working | Root features are optional. |
| [AFWall+](https://github.com/ukanth/afwall) | iptables firewall | Working | Test rules carefully. |
| [Scene](https://omarea.com/) | Performance and battery profiles | Working | Avoid voltage and kernel changes. |
| [Migrate-OSS](https://github.com/BaltiApps/Migrate-OSS) | App and data migration | Working | Root restores may need a full reboot. |
| [Termux](https://github.com/termux/termux-app) | Terminal emulator | Working | `su -c id` is the quickest check. |

Likely to work, but untested here: [Swift Backup](https://github.com/SwiftlyLand/SwiftBackup), [SD Maid SE](https://github.com/d4rken-org/sdmaid-se), [MiXplorer](https://mixplorer.com/), [Tasker](https://tasker.joaoapps.com/), and [AdAway](https://github.com/AdAway/AdAway). They use standard `su` and do not need early boot, but backup tools and hosts-based blockers can depend on paths or mounts that late-load cannot provide.

Do not expect these to work:

- **Magisk and its modules.** Magisk assumes it controls the boot image. Its modules that depend on Magisk internals will not work under KernelSU late-load.
- **Kernel managers and GPU tweakers.** KonaBess, KonaBess-Next, and similar tools change kernel tables or voltages. They have caused permanent hardbricks.
- **Apps that need root at boot.** A service that starts before `system_server` cannot be provided by a late-loaded module.
- **Apps that check for an unlocked bootloader.** Some banking, wallet, and anti-cheat apps use their own signals. Root can work while the app still refuses to run.
- **One-click permanent root apps.** They will try to flash or patch a boot image. Do not run them from a session.

Grant root per app and revoke it when you are done. A leftover grant is a standing privilege.

## Things to avoid

1. **Magisk Direct Install.** A Galaxy S25 `SM-S931B` owner used Root My Galaxy, installed the official Magisk app, and chose **Install > Direct Install**. After a reboot the phone showed `[reboot device - d2]`, recovery would not load, download mode would not open, and the phone stopped enumerating over USB. The owner received a warranty replacement. Magisk's install model assumes it can patch and flash a boot image, and a locked bootloader rejects the modified image.

2. **Partition writes and custom images.** Do not flash boot, init_boot, vbmeta, recovery, a custom kernel, or a Magisk-patched image. Do not use `dd` on a partition. Do not install a module that patches a partition instead of mounting over it. Temporary root leaves the verified boot chain intact. That is why it works on a locked phone.

3. **GPU and kernel tweakers.** KonaBess and KonaBess-Next modify GPU voltage and clock tables. On the temporary root test device they are listed as a major problem with a permanent hardbrick. A wrong table can leave the phone unable to boot.

4. **Module stacks.** Install one module, soft reboot, test. If the phone bootloops after five modules, you have five suspects and maybe no working manager to disable them. The Zygisk stack deserves special caution: install the provider and LSPosed first, test them, then add modules. Do not run two Zygisk implementations.

5. **Autorun plus a broken module.** DirtyFrag's autorun starts the exploit at boot. Combine it with a module that bootloops and the phone restarts into the same failure. The failed-run interlock helps, but it is not a substitute for testing.

6. **OTA updates while rooted.** An update can patch the bug, change the kernel layout, or fail with modules installed. Disable automatic updates and check the support list before updating. Staying on old firmware has its own security cost. Make that trade-off deliberately.

7. **"Make it permanent" tools.** There is no supported way to make session root persistent without unlocking the bootloader. A script that claims to do it is flashing a partition, installing a boot image, or lying.

8. **Random APKs and repacks.** Download from the upstream release page, check the tag and date, and compare hashes when published. Avoid file-sharing links, Telegram uploads, and paid "premium" builds. A multi-device repack can bundle legitimate payloads and still add code.

9. **Paid remote-root services.** A remote service that asks for access to your phone can do anything with the session. You cannot verify what it runs, and you may be paying for a free upstream tool.

10. **Broad root grants.** Do not grant root to a file manager from a random site, a performance booster with no source, or an app that asks on first launch without explanation. A malicious root app can read every app's data and install a persistent payload.

11. **Deleting `/data/adb` to clean up.** That directory holds ADB keys, module data, and files used by other tools. DirtyFrag's unroot notes say to remove `/data/adb/KernelSU` and KSUD residue, and explicitly warn against deleting the ADB folder. A full reboot already removes the active root.

12. **Ignoring the exact build.** The most common non-brick failure is a payload that does not match the kernel. A matching model name is not enough. A matching kernel version without the vendor build is not enough either.

## Recovery and troubleshooting

Most failures are recoverable. The phone reboots, root is gone, and you try again. A smaller set need download mode or a service center. Separate the two before pressing buttons.

### The recovery ladder

1. **Does the phone reach Android?** If yes, the session is probably recoverable without a computer. Disable modules in the loader and run it again.
2. **Does it bootloop?** A full reboot clears root. Then open the loader and set KernelSU Modules to Disabled.
3. **Can you reach ADB?** On a user build, `adb uninstall df.root` can remove DirtyFrag without root. Use the loader's actual package name.
4. **Can you reach safe mode?** Hold Volume Down during boot on many devices. Safe mode disables third-party apps but may not disable a late-loaded kernel module.
5. **Does download mode open?** On Samsung, use it with signed stock firmware for the exact model and region. A CSC file wipes data; HOME_CSC tries to preserve it.
6. **Does the phone enumerate over USB?** If not, and recovery and download mode are both unavailable, stop and contact the manufacturer or a repair service.

### Module bootloop

1. Full reboot. Root and the kernel module are gone.
2. Open the loader and disable KernelSU modules.
3. Run the loader again.
4. Open the manager and remove the module that caused the loop.
5. Re-enable modules one at a time.

If the phone does not reach Android, try safe mode or the `adb uninstall` route above.

### Kernel panic

A GhostLock panic is a failed race. The phone should reboot into Android. Wait for it to settle, then retry if the build is supported. Stop if it panics at the same stage every time, bootloops with modules disabled, or gets unusually hot. A DirtyFrag panic usually points to a wrong KMI or vendor hardening mismatch, not bad timing.

### Samsung D2 screen

The D2 screen has two causes. They need different responses.

**The download-mode gate.** One UI 8.5 and later can refuse download mode while a lock-screen credential is set. The phone still boots Android. Remove the screen lock under **Settings > Security and privacy > Lock screen > Screen lock type > None**, power off, hold Volume Up and Volume Down together, then connect USB to a computer. Some owners report that enabling Maintenance Mode first has the same effect.

**A modified protected image.** The bootloader rejects the image and the phone cannot boot Android. The key combo cannot help. Connect USB and check whether the phone enumerates. If it does not, contact Samsung or a repair service. A motherboard replacement may be the only repair.

If download mode opens, flash signed stock firmware for the exact model and region with Odin. Do not mix firmware from another model. Do not install a "D2 bypass" APK.

### Root is gone after a reboot

That is the design. Run the loader again if the firmware is still supported. The app and module files remain, but the kernel module and daemon do not.

If the loader suddenly says the device is not vulnerable after an update, the update probably patched the bug. Do not downgrade firmware unless the project documents a safe path. Downgrading can wipe data or brick a locked phone.

### Troubleshooting

| Symptom | Likely cause | First action |
| --- | --- | --- |
| "Not vulnerable" or "patching failed" | Kernel patched, backported fix, or the 6.1 mitigation | Stop. Check the upstream issue tracker. |
| Progress bar at 0 percent | UI log mapping, not exploit progress | Wait out the 70-second window. |
| "Success" but no `su` | Late-load failed, manager mismatch, or auto reboot interrupted it | Disable auto reboot and run again. |
| Kernel panic during GhostLock | Failed race | Retry if the build is supported. Stop after repeated identical failures. |
| Manager opens but does not detect root | Manager lacks `libksud.so`, wrong manager, or KMI mismatch | Install the manager the loader names. |
| `su` works but an app does not | App needs a module, early boot, or a permanent manager | Check the app's requirements. |
| Module installed but inactive | No soft reboot yet | Soft reboot, then check the manager. |
| Bootloop after a module | Incompatible module or early-boot dependency | Full reboot, disable modules, re-run. |
| ADB says unauthorized | RSA key not accepted | Unlock the phone and accept the prompt. |
| ADB shows no devices | Cable, driver, port, or debugging off | Try another cable and port. Check `lsusb`. |
| D2 screen on Samsung | Download-mode gate or modified boot image | Read the D2 section above. |

If a run fails, export the loader log before changing anything. Include the model, build, full `uname -r`, Android version, security patch, loader version, manager version, module list, and the exact error text. A post that says "it bricked" cannot be diagnosed.

### When to stop

Stop and seek service support if:

- The phone does not enumerate over USB.
- Download mode and recovery are both unavailable.
- The D2 screen persists after a power cycle.
- The phone bootloops with no modules and no root.
- The device overheats or the battery swells.

A temporary root is optional. A working phone is not.

## FAQ

### Does it survive a reboot?

A full reboot clears it. The kernel module is unloaded, the root daemon is gone, and the bootloader loads the stock image. Files under `/data` can remain, but they are not active.

### Does a soft reboot keep root?

Usually yes. A soft reboot restarts Android's userspace and `system_server`, not the kernel. The late-loaded module stays active. That is why module installs often ask for a soft reboot.

### Does it wipe data?

The exploit does not unlock the bootloader, so there is no unlock-induced wipe. A botched run, a module bootloop, or a recovery attempt can still cost data. Back up first.

### Does it unlock the bootloader?

No. The bootloader stays locked and rejects unsigned images. The exploit runs inside the running kernel.

### Does it trip Knox?

The documented chains do not perform a bootloader unlock, so they do not trip the e-fuse. That does not guarantee that Samsung Wallet, Secure Folder, or every Knox service works while root is active. Those apps can detect root on their own.

### Is it safe?

Safer than unlocking and flashing in one sense: it does not modify the boot chain. It is still privilege-escalation code running in the kernel. A bad module, a wrong payload, or a panic can bootloop or brick the phone.

### Can it brick my phone?

Yes. The confirmed hardbrick involved Magisk Direct Install from a session, not the exploit alone. A bad module can bootloop a phone, and a wrong profile can panic the kernel. Read [Things to avoid](#things-to-avoid) first.

### Can I undo it?

A full reboot removes the active root. To remove the tools, disable modules, uninstall the loader and manager, and follow the project's unroot notes. Do not delete `/data/adb` blindly.

### Is it legal?

Modifying a device you own is legal in many places, but contracts and anti-circumvention laws vary. Do not use these tools on a device you do not own or have permission to modify.

### How do I know if my device is supported?

Check the exact model code, build ID, and full `uname -r` against the upstream project's list. The [device table](#supported-devices) is a map. The project is the authority.

### Why is the exact build important?

Offsets, stack layout, page size, and vendor hardening differ between builds. A payload for one kernel can write to the wrong address on another. Some ports list firmware build IDs because the vendor changed the kernel without changing the version string.

### Is there a universal tool?

No. The exploits depend on kernel internals that differ by device, compiler, and vendor patch. An app that looks universal still selects a per-device payload under the hood.

### Does it work on Android 17?

Some Android 17 builds use 6.12 or 6.18 kernels that are still vulnerable, and some are patched. The Android version alone does not answer the question. Check the kernel release and the tool's list.

### Can I use a profile for a similar model?

No. Use the exact model and kernel, or wait for a port. "Similar" is how people brick phones.

### Do I need a computer?

Not always. DirtyFrag, Root My Galaxy, GhostLock App, Root My Pixel, and RootMyVivo have on-device paths. Some profiles need Shizuku, ADB, or a one-time ADB setup. CLI ports such as ghostlock-oneplus are easier with a computer.

### Do I need Shizuku?

Only if the loader asks for it. DirtyFrag does not. Root My Pixel and some GhostLock profiles do. Shizuku is an ADB bridge, not root.

### Which manager should I install?

The one the loader documents. On Samsung, DirtyFrag requires diabl0w's KernelSU. Root My Pixel expects ReSukiSU/BakaSU. Other loaders list KernelSU, KernelSU-Next, KowSU, or BakaSU. A manager without `libksud.so` cannot give you root in DirtyFrag 1.10 and later.

### Can I install Magisk modules?

Some KernelSU-compatible modules work. Magisk-specific modules often do not. Modules that need early boot, `init.rc`, or a partition write will fail, sometimes by bootlooping. Check [Modules](#modules) and install one at a time.

### Can I use LSPosed?

LSPosed is reported working with a compatible Zygisk provider. The Zygisk stack is fragile on temporary root: ZygiskNext works in the test thread, while NeoZygisk, ReZygisk, and Treat-Wheel-Zygisk have reboot reports. Test the provider and LSPosed before adding modules.

### Why do modules need a soft reboot?

KernelSU activates module mounts and scripts during startup or late-load. A soft reboot restarts userspace so the changes are picked up while the kernel module stays loaded. A full reboot clears root entirely.

### The manager shows the module but `su` fails

Check that the manager ships `libksud.so`, that it is the manager the loader selected, and that the KMI matches. Read the loader log. Do not reinstall random payloads.

### Will banking apps work?

Maybe. Some work, some detect root, and some detect the manager or module files. A locked bootloader helps with some integrity checks but is not a hiding solution. Test the app before you depend on it.

### Does Play Integrity pass?

It can pass basic checks on some builds. Strong verdicts usually fail. Results depend on the device, the manager, the modules, and Google's current verdicts. This README does not promise any integrity result.

### Can I take an OTA?

Not safely while you rely on root. An update can patch the exploit, change the layout, or fail with modules installed. Disable automatic updates and check the support list before updating.

### How long does a run take?

DirtyFrag's run window is about 70 seconds. GhostLock can take seconds or several attempts, and a failed attempt can reboot the phone. Late-load adds a little time after the exploit succeeds.

### Why does GhostLock fail repeatedly?

It is a race. Timing, CPU load, and stack layout affect it. Some users need many attempts. If it fails at the same stage every time, the profile may be wrong or the build may be patched.

### Can I flash a ROM or recovery?

No. A locked bootloader still rejects unsigned images. Temporary root does not change that.

### Where do I report a working device or module?

Use the project's issue tracker and the [contribution rules](#contributing). Include the model, build, kernel, manager version, module version, and a log. One reproducible result is worth more than a list of guesses.

## Sources

### Core projects

- [GhostLock App](https://github.com/YuKongA/ghostlock-app): on-device GhostLock runs, kernel profile import, the largest device table.
- [DirtyFrag](https://github.com/mitschud/DirtyFrag): Samsung-hardened DirtyFrag, KernelSU late-load, module toggle, logs.
- [DFRoot](https://github.com/diabl0w/DFRoot): the original DirtyFrag chain.
- [Root My Galaxy](https://github.com/BuSung-dev/Root-My-Galaxy) and [payloads](https://github.com/BuSung-dev/Root-My-Galaxy-Payloads): Samsung GhostLock installer and exact model rows.
- [Root My Pixel](https://github.com/alex193a/Root-My-Pixel): Pixel 6 through 11.
- [GhostSam](https://github.com/MocLG/GhostSam): Galaxy S22, S26, Z Fold8 chains.
- [KernelSU](https://github.com/tiann/KernelSU) and the [module guide](https://kernelsu.org/guide/module.html): late-load behavior and limits.
- [Temporal Root Modules List](https://github.com/rushiranpise/temporal-root-modules-list): tested module statuses.

### Device ports

- [Root-My-Device](https://github.com/WitAqua-tools/Root-My-Device), [RootMyVivo](https://github.com/zenyxx-xd/RootMyVivo), [Root My S24](https://github.com/NanoTurtle1145/root-my-s24), [Root My Nothing](https://github.com/ang3lo-azevedo/root-my-nothing).
- [ghostlock-oneplus](https://github.com/JoinChang/ghostlock-oneplus), [GhostLock-for-OnePlus](https://github.com/p2p3p/GhostLock-for-OnePlus), [ghostlock-xringo1](https://github.com/ayyy7128/ghostlock-xringo1).
- [GhostLock-Galaxy](https://github.com/wxxsfxyzm/GhostLock-Galaxy), [ghostlock-a17](https://github.com/mobilehackinglab/ghostlock-a17), [ghostlock-emerald](https://github.com/datfooldive/ghostlock-emerald), [Meizu 21 GhostLock](https://github.com/ymh001/meizu21-ghostlock-root).
- [GhostLock-5.10](https://github.com/R0rt1z2/GhostLock), [GhostLock NVIDIA Shield](https://github.com/cyberbalsa/GhostLock-NVIDIA-Shield-9.2.4), [IonStackQuest3](https://github.com/F-19-F/IonStackQuest3), [zenfone9-ghostlock](https://github.com/CKwasd/zenfone9-ghostlock), [ghostlock-rmx5085](https://github.com/Nixbones/ghostlock-rmx5085).
- [iQOO Z9 / vivo T3 port](https://github.com/ankitrawatgit/iQOO-Z9_5G-vivo-T3_5G-Root-GhostLock), [DirtyFrag-Galaxy](https://github.com/coey0814/DirtyFrag-Galaxy), [DirtyInit](https://github.com/combeng6th/DirtyInit).

### Analysis and background

- [awesome-android-root](https://github.com/awesome-android-root/awesome-android-root): the GhostLock guide and the temporary-root comparison.
- [NebuSec IonStack](https://github.com/NebuSec/CyberMeowfia/tree/main/IonStack/CVE-2026-43499): the exploit framework behind Root My Pixel and other ports.
- [Penligent](https://www.penligent.ai/hackinglabs/), [TuxCare](https://tuxcare.com/), [Mobile Hacking Lab](https://www.mobilehackinglab.com/), and independent writeups on the futex rollback bug.
- [NVD CVE-2026-43499](https://nvd.nist.gov/vuln/detail/CVE-2026-43499) and [NVD CVE-2026-43284](https://nvd.nist.gov/vuln/detail/CVE-2026-43284).
- [Linux kernel releases](https://www.kernel.org/) and [Android security bulletins](https://source.android.com/docs/security/bulletin).

### Community threads

- [XDA: List of modules working on temporal root](https://xdaforums.com/t/list-of-modules-working-on-temporal-root.4796105/): module reports, including the failures. Closed, still readable.
- [XDA: D2 error and download mode on One UI 8.5](https://xdaforums.com/t/bypass-samsungs-new-2026-d2-error-enter-download-mode-one-ui-8-5.4792462/).
- [XDA: SM-S931B D2 brick report](https://xdaforums.com/t/sm-s931b-galaxy-s25-stuck-on-reboot-device-d2-after-magisk-direct-install-from-temporary-root-my-galaxy-root.4796719/).
- [Reddit r/androidroot](https://www.reddit.com/r/androidroot/) for general questions. Search is more useful than new threads.

Threads go stale. A report from an older firmware may not apply to the current build. Read the last page, not the first.

## Contributing

A report is only useful if someone else can reproduce it. "Works on my S24" is not a data point. The model, build, kernel, loader version, manager version, and result are.

### Report format

```text
Device: Samsung Galaxy S25
Model: SM-S931B
Region / CSC: EUX
Build: S931BXXU4CZH1
Android: 16
Kernel: 6.6.98-android15-8-gf4dc45704e54-abogki446052083-4k
Page size: 4k
Loader: Root My Galaxy 1.4.2
Manager: diabl0w KernelSU 3.2.1
Method: GhostLock
Stage reached: KernelSU late-load, su works
Modules: LSPosed 1.9.2, ZygiskNext 1.2.6
Result: Working
Notes: first run panicked, second run completed. Wallet fails while rooted.
```

For a failure, add the last 50 lines of the loader log. Remove personal paths and account names, but keep the error text and the stage where it stopped.

### Status rules

| Label | Rule |
| --- | --- |
| Verified | Reproduced on hardware by at least two people, or by the maintainer with a log. |
| Tested | One completed run with evidence. |
| Reported | A plausible report without enough detail to reproduce. |
| Experimental | The project says it is unverified or work in progress. |
| Untested | Listed because it should work, but nobody has checked. |
| Broken | Reproduced failure, with a log or a clear description. |
| Not feasible | The project documents why the build cannot work. |

Do not upgrade a label because a device is popular. Do not downgrade a failure because it worked once for someone else.

### What this project needs

- Device reports for builds that are missing from [Supported devices](#supported-devices).
- Module reports for versions that are not in [Modules](#modules).
- Corrections to tool names, links, or status labels.
- Fixes to instructions that no longer match a current release.

### What it does not need

- "Please root my phone" requests.
- Links to reuploads, Telegram channels, or paid services.
- Instructions that require unlocking the bootloader or flashing a boot image.
- Exploit code, offsets, or payloads for devices without a public project.
- Claims without a build string or a log.

Small fixes can go straight to a pull request. Device and module reports need the evidence above. A disputed row keeps the lower status until someone reproduces the result.

## License and disclaimer

Content is MIT licensed. Contributions are accepted under the same terms. The linked tools carry their own licenses.

This README documents public projects. It does not develop, audit, or guarantee them. It is not affiliated with Google, Samsung, KernelSU, Nebula Security, or any loader maintainer. Use it on hardware you own, and back up first.
