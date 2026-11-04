# Public package validation

The reproducible validation command for this branch is:

```sh
npm ci --prefix glasshouse --ignore-scripts --no-audit --no-fund
TEST_CONCURRENCY=1 sh scripts/validate.sh
```

It runs the server and demo tests, weather configuration tests, apply/guard tests, TypeScript without emitting files, ES5 checks, module checks, DOM IDs, translations, QML, deployed-file checks and entities, then assembles the installable package. The runner limits tests to two concurrent processes by default (`TEST_CONCURRENCY`, maximum four). The server ships as JavaScript source; it is not transpiled. Regenerate persistence patches before validation when their source files change.

Local package assembly does not install anything on a TV. Building the IPK and installing it through Homebrew Channel on hardware are separate from SSH deployment. Upstream `check-upgrade.js` and `check-entity-stability.py` require upstream history/tags and do not apply directly to this vendored subdirectory. The four 0.130 customization bases are included so the bundle can be tested without private history.

## C6 preparation and its limits

The 0.130 adaptation from which this branch's sanitized code was derived was checked locally with **45 synthetic browser checks, 11 backend suites and 39 transaction/rollback cases**. Those counts describe private preparation, **not** the final CI result for this public commit. Operational scripts, backups, private scan reports and TV captures are not included. The relevant public result is the output of `scripts/validate.sh` and CI for the exact SHA being reviewed; results from another branch or an old green badge do not substitute for it.

The UI checks cover:

- launching a native app and the optional shortcut, the unconfigured state, All apps, reordering, focus/Back and reduced motion;
- C2/C6 profiles and webOS rules (`test-home-c2.js`), configurable HDMI ports (`layout.devPorts`), console/HDMI art and absence of an injected Bell tile;
- Home Settings with pointer and remote input, focus containment, held OK, prevention of background launches, close and return to the gear;
- writes limited to `recommended`, stale responses, save failures and reload of server state, with no optimistic confirmation; the unavailable-recommendations note appears only when the TV lacks the API;
- the collapsed recommendations accordion without poster requests, exact app attribution, horizontal navigation, and rejection of late YouTube cards after changing to Plex, Bell, ICI TOU.TV or Crave;
- vertical dock stability when an app has no cards or recommendations are off, separation of date and expanded rows, and 1920×1080 and 1280×720 viewports;
- the G button's native launch, errors and duplicate-launch blocking;
- the All apps count and sort toggle, remote access to its toolbar, Back, click-outside and close-button paths.

The C6's served version and file hashes were checked, its current settings and `.previous` were preserved, and its menu was restored to 0.130 without a downgrade. The owner confirmed rendering, settings, the toggle, recommendation filtering, dock stability and the G button opening Glasshouse. Native Glasshouse launch was also confirmed by checking the foreground app. Those tests did not replace personal settings with the public example.

News → Plex was restored and checked in the saved and native mappings without changing other keys. A physical press had been confirmed on an earlier version; it was not physically retested in that 0.130 pass. Full playback of recommended content, each provider's resume behavior, the physical pointer, standby and reboot are separate tests. No PIN lock was installed. The TV2 Lightkeeper variant is neither included nor certified by these results.

## C2 hardware verification

One **OLED55C2PUA** running webOS `9.2.2-61 (ombre-okapi)`, firmware `23.25.55`, was verified with this fork. The profile reported family `c2` and tier `supported`; the deployed server returned HTTP 200 on loopback `127.0.0.1:8080` with token authentication, and the developer Home tile launched. This verifies that deployment and preview path on **one C2**; it does not certify other sizes, firmware versions or regions. Home takeover, startup hiding, and boot persistence were not enabled as part of that verification. See [C2 compatibility](C2.md).

The current UI code has offline tests for its marks, Moonlight shortcut and app-library close paths. A successful C2 server response does not by itself verify those new visuals or remote interactions on the physical TV. Report a feature as hardware-tested only after observing it on the TV.

## Pre-publication checks

Review the working tree, generated files, index, diff and candidate history. Gitleaks 8.30.1 is run with full redaction and no allow-comments; CI pins its archive by SHA-256. Also search for private configuration, user paths, device identities, screenshots, archives, backups, logs and secrets. A result over private preparation files is not a result over the final public branch.

Preserve the MIT and OFL notices, the Glasshouse MIT G, and the original Immich SVG with its separate AGPL-3.0 license and notice. Private proprietary logos and provider card images are not redistributed. Public fixtures use synthetic data. The demo contacts no TV or photo library.

These checks reduce exposure risk; they cannot guarantee the absence of every secret or vulnerability. If a published secret is confirmed, stop the affected release without exposing its value. Rotation, history rewriting and access changes require a separate decision.

## Public rendering fidelity

Apps use 280 × 157.5 faces; inputs and the shortcut use 224 × 126 faces within the scaled 1920×1080 canvas. The glass styling, hidden captions and accessible names are retained. Private proprietary app logos are not shipped; the public UI uses inline console/HDMI marks, available native app icons or text fallbacks. The five public wallpapers are used. Weather, demo order and launches are synthetic.

Recommendations reflect what apps publish at that moment, with no guarantee of personalization, resume playback or progress tracking. Future upstream updates may require another adaptation. Check the [branch state](REPRODUCIBILITY.md) before attributing these features to `main`.
