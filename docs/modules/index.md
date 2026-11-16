---
title: Modules and Apps
description: Late-load KernelSU module and root app compatibility reports, risk reduction rules, and unsupported modules on temporary root.
---

# Modules and Apps

Temporary root can run modules that mount files or hook apps after Android starts. It usually cannot run modules that need early boot, boot-script replacement, kernel drivers, or partition writes.

Late-loaded KernelSU has no `init.rc` injection, module `preinit`, `post-fs-data` event, safe-mode detection, or boot-log capture. `late-load.d`, `post-mount.d`, `service.d`, and `boot-completed.d` scripts still run. Samsung DEFEX and KDP can block modules that work on other devices.

## Status labels

| Status | Meaning |
| --- | --- |
| Working | Reported to work without major issues. |
| Occasional issues | Generally works, but may conflict with other modules or settings. |
| Device-dependent | Works on some devices, but may cause bugs, reboots, or other issues on certain models. |
| Not recommended | Reported serious issues. Avoid on temporary root. |
| Needs testing | Not enough reports yet. |

Entries are User Reported unless marked Maintainer Verified.

> [!IMPORTANT]
> Install Core Patch N before Modded HyperOS Launcher, FreeStyle-Control-Center, ColorOS_Control_Center, HyperOS-App-Vault, HyperOS-AOD, and iOS-Control-Center-HyperOS. These generally work on Xiaomi and Redmi devices, but may have issues on some POCO devices. Keep a backup launcher before trying Modded HyperOS Launcher.

## Module list

| Name | Category | Status | Notes |
| --- | --- | --- | --- |
| [Magic Mount (7a72)](https://github.com/KernelSU-Modules-Repo/meta-mm) | Metamodules | Working | |
| [Magic Mount-rs](https://github.com/Tools-cx-app/meta-magic_mount-rs) | Metamodules | Working | |
| Morphe Mount-Install Modules | Metamodules | Working | |
| [OverlayFS Enhanced](https://github.com/RipperHybrid/meta-overlayfsx) | Metamodules | Device-dependent | |
| [NeoZygisk](https://github.com/JingMatrix/NeoZygisk) | Zygisk | Working | Maintainer Verified. |
| [OnyxZygisk](https://github.com/OnyxZygisk/OnyxZygisk) | Zygisk | Device-dependent | |
| OxyxZygisk | Zygisk | Device-dependent | |
| [ReZygisk](https://github.com/PerformanC/ReZygisk) | Zygisk | Device-dependent | |
| [ZNNext](https://github.com/VeryBaaad/ZNNext) | Zygisk | Working | |
| [Zygisk Assistant](https://github.com/snake-4/Zygisk-Assistant) | Zygisk | Working | |
| [Zygisk Next](https://github.com/Dr-TSNG/ZygiskNext) | Zygisk | Occasional issues | |
| [Zygisk Sui](https://github.com/XiaoTong6666/Sui) | Zygisk | Working | Do not run alongside KernelSU without reading both projects. |
| [LSPosed](https://github.com/LSPosed/LSPosed) | Xposed | Device-dependent | Requires a compatible Zygisk provider. May cause occasional GPS issues. |
| LSPosedIT | Xposed | Working | Available through the LSPosed Telegram channel. |
| [NexAlloy](https://github.com/NexAlloy/NexAlloy) | Xposed | Working | |
| Spicy EX | Xposed | Working | |
| [Vector v2.2](https://github.com/JingMatrix/Vector) | Xposed | Occasional issues | May bootloop on some setups. |
| [Vector-SR](https://github.com/byemaxx/Vector-SR) | Xposed | Device-dependent | Enabling via soft reboot may fully reboot some devices. |
| [Device Spoof Labs](https://github.com/yubunus/DeviceSpoofLab-Magisk) | Hiding | Device-dependent | One UI 9: disable spoofing first if soft reboots occur. |
| [DeviceSpoofLab-Hooks](https://github.com/yubunus/DeviceSpoofLab-Hooks) | Hiding | Working | |
| [HMA-OSS (Hide My Applist)](https://github.com/frknkrc44/HMA-OSS) | Hiding | Working | Often enough for hiding. No banking or Play Integrity guarantee. |
| [KernelNoSu](https://github.com/fatalcoder524/kernelnosu) | Hiding | Working | |
| [pairipfix](https://github.com/ahmedmani/pairipfix) | Hiding | Working | |
| [Play Integrity Fix](https://github.com/KOWX712/PlayIntegrityFix) | Hiding | Working | |
| [Play Integrity Fork](https://github.com/osm0sis/PlayIntegrityFork) | Hiding | Working | |
| [ReSuSFS](https://github.com/ahmed-alnassif/ReSuSFS) | Hiding | Device-dependent | |
| [TEESimulator](https://github.com/JingMatrix/TEESimulator) | Hiding | Occasional issues | |
| [TreatWheel](https://github.com/lsMikepls/treatwheel) | Hiding | Device-dependent | |
| [Tricky Store OSS](https://github.com/beakthoven/TrickyStoreOSS) | Hiding | Working | |
| [VBMeta Disguiser](https://github.com/Astoritin/VBMetaDisguiser) | Hiding | Working | |
| [Re-Malwack](https://github.com/ZG089/Re-Malwack) | Ad blocking | Working | |
| [StevenBlock](https://github.com/mikropsoft/StevenBlock) | Ad blocking | Working | |
| Systemless Adblocker (Sürüm) | Ad blocking | Working | |
| [ZN-hostsredirect](https://github.com/aviraxp/ZN-hostsredirect) | Ad blocking | Working | |
| [LightningDSP (JamesDSP fork) v6.7.1](https://github.com/zahahah/LightningDSP) | Audio | Working | |
| [PIXAML v0.9.6](https://github.com/zahahah/PIXAML) | Audio | Working | |
| [ViPER4Android (likelikeslike)](https://github.com/likelikeslike/ViPER4Android) | Audio | Occasional issues | Follow the install order. It expects KernelSU. |
| [Global Icon Pack](https://github.com/RichardLuo0/global-icon-pack-android) | Visual | Needs testing | |
| [iOS Emoji for Android](https://github.com/Keinta15/Magisk-iOS-Emoji) | Visual | Needs testing | |
| [Azenith](https://github.com/Liliya2727/AZenith) | Gaming | Device-dependent | |
| [PerfGame](https://github.com/adivenxnataly/PerfGame) | Gaming | Working | |
| UPerf Game Turbo | Gaming | Working | |
| CatSmoker | Performance | Working | |
| [DalvikHyperthreading](https://github.com/LeanxModulostk/DalvikHyperthreading) | Performance | Working | |
| [Encore Tweaks](https://github.com/Rem01Gaming/encore-ksu) | Performance | Working | |
| HyperOptimize | Performance | Occasional issues | Avoid combining with modules that modify the same parameters. |
| [KernelSU Tuner](https://github.com/ylh440104/KernelSU-Tuner) | Performance | Needs testing | Avoid voltage or clock changes on locked devices. |
| Universal GMS Doze | Performance | Working | |
| [AshResXcue (AshLooper)](https://github.com/RipperHybrid/AshLooper) | Bootloop protection | Occasional issues | Uninstall other bootloop protectors first. |
| [Always Trust User Certificates](https://github.com/NVISOsecurity/AlwaysTrustUserCerts) | Patches and tools | Working | |
| [Block OTA Update](https://github.com/manhgdev/Block-OTA-Update) | Patches and tools | Device-dependent | May need a device-specific fork. |
| [CaptureSposed](https://github.com/99keshav99/CaptureSposed) | Patches and tools | Needs testing | |
| [ClearBox](https://github.com/FLYCOM-E/ClearBox) | Patches and tools | Needs testing | |
| [KernelSU Grant Toast](https://github.com/NativeStar/KernelSUGrantToast) | Patches and tools | Device-dependent | |
| [KernelSU Toolkit](https://github.com/rifsxd/ksu_toolkit) | Patches and tools | Working | |
| [QuickSwitch](https://github.com/skittles9823/QuickSwitch) | Patches and tools | Needs testing | |
| Simple Flag Secure | Patches and tools | Working | Upstream repository (`ShivamXD6/Simple-Flag-Secure`) is no longer available. |
| [ih8SecureLock](https://github.com/j-hc/ih8SecureLock) | Patches and tools | Needs testing | Zygisk `FLAG_SECURE` bypass replacing archived `FlagSecurePatcher`; Android 10 to 17. |
| [TrustAnyCert](https://github.com/gorkemgun/TrustAnyCert) | Patches and tools | Needs testing | Installing CA certificates changes trust. |
| [Zygisk Detach](https://github.com/j-hc/zygisk-detach) | Patches and tools | Working | Requires a working Zygisk provider. |
| [Enable MIUI ADB](https://github.com/Ylarod/enable-miui-adb) | HyperOS / MIUI | Working | |
| ASKS Disabler (Quantum) | Samsung / One UI | Working | |
| [No Volume Warning](https://github.com/zahahah/No-Volume-Warnings) | Pixel | Working | |
| [Tailscale module](https://github.com/anasfanani/magisk-tailscaled) | Network | Working | |
| [Crond4Android](https://github.com/powerAn2020/crond4android) | Utilities | Needs testing | |
| [pm-install-from-anywhere](https://github.com/1ndevelopment/pm-install-from-anywhere) | Utilities | Needs testing | |

## App list

| Name | Category | Status | Notes |
| --- | --- | --- | --- |
| [AdClose](https://github.com/zjyzip/AdClose) | Ad blocking | Working | |
| [AdGuard Certificate](https://github.com/AdguardTeam/adguardcert) | Ad blocking | Working | |
| [amznkiller](https://github.com/hxreborn/amznkiller) | Ad blocking | Working | |
| [bindhosts](https://github.com/bindhosts/bindhosts) | Ad blocking | Working | |
| [Facebook App Ads Remover](https://github.com/Loukious/FacebookAppAdsRemover) | Ad blocking | Working | |
| [Gmail Hide Ads](https://github.com/MrxSiN/GmailHideAds) | Ad blocking | Working | |
| [Google Play Store Adblock](https://github.com/hxreborn/playstore-adblock) | Ad blocking | Working | |
| [ZFont 3](https://play.google.com/store/apps/details?id=com.htetznaing.zfont2&pli=1) | Visual | Device-dependent | |
| [App Manager](https://github.com/MuntashirAkon/AppManager) | Patches and tools | Working | |
| [ChromeKt](https://github.com/JingMatrix/ChromeXt) | Patches and tools | Working | |
| [Core Patch N](https://github.com/LSPosed/CorePatch) | Patches and tools | Working | Install before HyperOS launcher/control-center modules. |
| [De-Bloater](https://github.com/sunilpaulmathew/de-bloater) | Patches and tools | Working | |
| [Device Spoof Labs (app)](https://github.com/yubunus/DeviceSpoofLab-Hooks/releases) | Patches and tools | Device-dependent | One UI 9: disable spoofing first if soft reboots occur. |
| [Duck USB](https://github.com/Bouteillepleine/DuckUSB) | Patches and tools | Needs testing | |
| [Enable Screenshot](https://github.com/LSPosed/DisableFlagSecure) | Patches and tools | Device-dependent | May reboot on some builds. |
| [Franco Kernel Manager](https://play.google.com/store/apps/details?id=com.franco.kernel) | Patches and tools | Working | Avoid kernel or voltage changes on locked devices. |
| [IAmNotADeveloper](https://github.com/xfqwdsj/IAmNotADeveloper) | Patches and tools | Working | |
| [MT Manager](https://mt2.cn/download/) | Patches and tools | Working | Avoid editing system files on locked devices. |
| [NoPhotoPickerAPI](https://github.com/yureitzk/NoPhotoPickerAPI) | Patches and tools | Working | |
| [NoStorageRestrict](https://github.com/DanGLVK/NoStorageRestrict) | Patches and tools | Working | |
| [Scene](https://omarea.com/#/) | Patches and tools | Working | Avoid kernel or voltage changes on locked devices. |
| [Update Locker](https://github.com/Xposed-Modules-Repo/ru.mike.updatelocker) | Patches and tools | Working | |
| [Zygisk Detach (app)](https://github.com/j-hc/zygisk-detach-app) | Patches and tools | Working | |
| [ColorOS_Control_Center](https://github.com/Mods-Center/ColorOS_Control_Center) | HyperOS / MIUI | Device-dependent | |
| [FreeStyle-Control-Center](https://github.com/Mods-Center/FreeStyle-Control-Center) | HyperOS / MIUI | Device-dependent | |
| [HyperBackground](https://github.com/Solomonstery/HyperBackground) | HyperOS / MIUI | Working | |
| [HyperCeiler](https://github.com/ReChronoRain/HyperCeiler) | HyperOS / MIUI | Working | Disable "Icon in Settings" if icons duplicate. |
| HyperControl | HyperOS / MIUI | Working | |
| HyperCopy | HyperOS / MIUI | Working | |
| HyperDesktop | HyperOS / MIUI | Working | |
| HyperDuo | HyperOS / MIUI | Working | |
| HyperGlow | HyperOS / MIUI | Working | Requires Spicy EX. |
| HyperHelper | HyperOS / MIUI | Working | |
| [HyperIsland](https://github.com/1812z/HyperIsland) | HyperOS / MIUI | Working | |
| [HyperLight](https://github.com/KiminonawaResa/HyperLight) | HyperOS / MIUI | Working | Disable "Icon in Settings" if icons duplicate. |
| [HyperLock](https://github.com/LXRylex/HyperLock) | HyperOS / MIUI | Working | Requires HyperDuo. |
| HyperLyric | HyperOS / MIUI | Working | |
| [HyperOS-AOD](https://github.com/Mods-Center/HyperOS-AOD) | HyperOS / MIUI | Device-dependent | |
| [HyperOS-App-Vault](https://github.com/Mods-Center/HyperOS-App-Vault) | HyperOS / MIUI | Device-dependent | |
| [HyperStack](https://github.com/cramqin/HyperStack) | HyperOS / MIUI | Working | |
| [HyperUnlocked](https://github.com/ukriu/HyperUnlocked) | HyperOS / MIUI | Working | |
| iOS-Control-Center-HyperOS | HyperOS / MIUI | Device-dependent | |
| MeowPower | HyperOS / MIUI | Working | |
| [Modded HyperOS Launcher](https://github.com/Mods-Center/HyperOS-Launcher) | HyperOS / MIUI | Device-dependent | Keep a backup launcher. Fossify Launcher is suggested. |
| PigLauncher | HyperOS / MIUI | Working | POCO exclusive. |
| [XApps](https://github.com/Leekin2/XApps) | HyperOS / MIUI | Working | |
| [Core Patch N for One UI 9](https://github.com/igorcv88/CorePatch-OneUI9) | Samsung / One UI | Working | |
| [Dressroom Advanced](https://github.com/BlueOutside/Dressroom-Advanced) | Samsung / One UI | Working | |
| [KnoxPatch](https://github.com/salvogiangri/KnoxPatch) | Samsung / One UI | Working | |
| [OneUI Settings Hook](https://github.com/HeheJuice/OneUI-Settings-Hook) | Samsung / One UI | Working | |
| [OneUIX](https://github.com/SoClear/OneUIX) | Samsung / One UI | Working | |
| [Migrate-OSS](https://github.com/BaltiApps/Migrate-OSS) | Backup | Working | |
| [NeoBackup](https://github.com/NeoApplications/Neo-Backup) | Backup | Working | |
| [AFWall+](https://github.com/ukanth/afwall) | Network | Working | Bad firewall rules can cut off ADB. |
| [Net Switch](https://github.com/Rem01Gaming/net-switch) | Network | Working | |
| [SettingsFirewall](https://github.com/canyie/SettingsFirewall) | Network | Working | |
| [Biometric Bypass](https://github.com/hxreborn/biometric-bypass) | Biometrics | Working | |
| [Fingerprint Catalog](https://github.com/custombeta/fingerprint-cataloge) | Biometrics | Working | |
| AlternativeUnlockXposed | Utilities | Working | |
| Cleaner Royall | Utilities | Working | |
| Clipboard Whitelist | Utilities | Working | |
| DarQ Reborn | Utilities | Working | |
| Disable Target API Block | Utilities | Working | |
| FuckDevicePolicy | Utilities | Working | |
| Iconify | Utilities | Working | |
| IslandRecorder | Utilities | Working | |
| RamStatusBar | Utilities | Working | |
| AClipBoardManager (ClipVault) | Other | Working | Upstream repository (`paras-moharle/ClipVault`) is no longer available. |
| [CleanShare](https://github.com/hxreborn/cleanshare) | Other | Working | |
| [Discover Ads Filter / Feed Filter](https://github.com/hxreborn/discover-ads-filter) | Other | Working | |
| [FreeUnlock](https://github.com/TheWhiteDog9487/FreeUnlock) | Other | Working | |
| [Frosty](https://github.com/Drsexo/Frosty) | Other | Working | Possible wake-lock issues. |
| [FuckMeta](https://github.com/fzer0x/FuckMeta) | Other | Working | |
| [Morphe](https://github.com/MorpheApp/morphe-manager) | Other | Working | |
| [Re:X](https://github.com/Xposed-Modules-Repo/one.dot.rex) | Other | Working | |
| [Remember My Sort](https://github.com/hxreborn/remember-my-sort) | Other | Working | |
| [ReVancedXposed_Spotify](https://github.com/TheWinner02/ReVancedXposed_Spotify) | Other | Working | |
| SpotifyNext | Other | Working | |
| [TiktokPatchXposed](https://github.com/hik0w/TiktokPatchXposed) | Other | Working | |
| [WA Enhancer](https://github.com/Dev4Mod/WaEnhancer) | Other | Working | |
| [WaDeepDark](https://github.com/Dhangofa/WaDeepDark) | Other | Working | |
| [WaEnhancer X](https://github.com/WaEnhancerX/WaEnhancerX) | Other | Working | |
| [WAPlusXposed](https://github.com/RevealedSoulEven/WAPlusXposed) | Other | Working | |
| [YouTube ReVanced](https://github.com/Zy0x/YouTube-Revanced/) | Other | Working | Check reports before updating. |
| YouTubeAdAway | Other | Working | |

## Not recommended

| Name | Status | Notes |
| --- | --- | --- |
| [Vector below v2.2](https://github.com/JingMatrix/Vector) | Not recommended | |
| [PrivacySpace](https://github.com/GeekTR/PrivacySpace) | Not recommended | |
| [SusFS](https://github.com/sidex15/susfs4ksu-module) | Not recommended | |
| [Magisk](https://github.com/topjohnwu/Magisk) | Not recommended | Direct Install on a locked bootloader can permanently hardbrick. |
| [KonaBess-Next](https://github.com/KonaBess-Next/KonaBess-Next) | Not recommended | Reported permanent hardbrick risk. |

Older KonaBess is also outdated. Avoid GPU voltage or clock changes on locked devices. Magisk itself is not malware, but Direct Install assumes an unlocked bootloader.

## Reducing module risk

1. Confirm `su -c id` works and the manager opens.
2. Install one module, then soft reboot. A soft reboot keeps root. A full reboot clears it.
3. Test the feature before adding the next module.

Do not install a framework, Zygisk provider, several Xposed modules, and a kernel tweaker in one pass. If the phone bootloops, you will not know which one caused it. Leave loader autorun off until the module set is known good.

If a HyperOS module causes app problems, uninstall it in KernelSU and soft reboot. Open Settings, then Apps, then the affected app. Uninstall updates and clear data. Reboot if needed.

Module indexes: [LSPosed module repository](https://modules.lsposed.org/) and [MMRL](https://github.com/MMRLApp/MMRL). They do not test late-load compatibility.

Return to the [complete guide](../guide.md#modules).
