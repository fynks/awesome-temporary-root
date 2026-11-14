# Contributing

> [!IMPORTANT]
> This project is only for accumulating all knowledge, tools, modules, and other resources relating to temporary rooting in one place.
> Unfortunately, porting temporary solutions to specific devices is out of scope of this project.

Help improve the index with reproducible device/module results, corrections, and links to public upstream projects. Report loader bugs and request device ports in the loader's own issue tracker, not here.

## Choose a report

Use the [issue templates](https://github.com/fynks/awesome-temporary-root/issues/new/choose):

- Use a device report for a success, partial result, or failure on an exact device/build.
- Use a module report for a module's behavior under temporary root.
- Use a correction for a stale status, broken link, incorrect claim, or documentation fix.

Search existing issues first. Add new evidence to an existing report instead of opening a duplicate.

## Evidence required

Record the market name, model/codename, region, full firmware build, Android/vendor OS version, security patch, and full kernel release:

```sh
adb shell getprop ro.product.model
adb shell getprop ro.product.device
adb shell getprop ro.build.display.id
adb shell getprop ro.build.version.release
adb shell getprop ro.build.version.security_patch
adb shell getprop ro.vendor.build.version.release
adb shell uname -r
adb shell getconf PAGE_SIZE
```

Also include the loader URL and version, manager name and version, method, results, and module names/versions where relevant. Link the upstream support entry, release, or test report. For failures, attach the relevant log tail (normally the last 50 lines), preserving the error and last successful stage.

Use "not supplied" or "unknown" for missing information. Never guess a kernel, build suffix, offset, or tool version. A report about one model or firmware build does not verify another.

## Status rules

- Maintainer Verified is reserved for a hardware result that a maintainer of this repository supplied or directly confirmed, with a linked report. If the confirmation omits environment details, mark them "not supplied" and limit the claim to that confirmation. It is not a security audit or a guarantee for other builds.
- User Reported marks a community result that this repository's maintainer has not independently verified. Merging a report does not promote it to Maintainer Verified.
- Tested, Experimental, and module outcome labels describe the result, not who verified it. An upstream maintainer's test is not automatically a test by this repository's maintainer.
- Module/app statuses use the text labels Working, Occasional issues, Device-dependent, Not recommended, and Needs testing. Keep status separate from provenance. Community entries remain User Reported.
- Profiles, generated offsets, shared kernel strings, and model aliases are candidates until a hardware result supports them. Preserve unavailable/deprecated history rather than presenting an old download as current.

Do not self-assign Maintainer Verified. Keep disputes and missing evidence visible until a maintainer reviews them.

## Pull requests

1. Keep changes focused and cite primary sources: upstream README/support data, release notes, CVE records, or a linked hardware report. Include the date checked when updating live information.
2. Edit `README.md`, the canonical guide source. Do not hand-edit `src/content/docs/guide.md`.
3. Run `npm run sync:readme` and review both files. For site changes, use Node 26 and the package manager declared in `package.json`. Run the relevant build/check commands.
4. Check links, table columns, status wording, and target counts. Keep the generated guide in sync.
5. Explain what changed, link the evidence, and distinguish hardware verification from source-only checks.

Do not submit exploit offsets for unsupported devices, requests to port a loader, bootloader-unlocking/boot-flashing instructions, paid services, or APK/firmware reuploads. Use official project release links.

## Safety and privacy

Test only on hardware you own or are authorized to modify. Back up first. Kernel exploits and modules can cause crashes or data loss. Redact serial numbers, IMEIs, account names, tokens, private paths, and unrelated log data. Do not upload proprietary firmware or boot images.

Content contributions are accepted under the repository's [MIT license](LICENSE). Linked tools retain their own licenses.
