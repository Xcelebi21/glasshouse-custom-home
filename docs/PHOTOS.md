# Photos, app shortcut, and All apps

The Home screen has a compact tile to the right of the console/input row. It used to be a **Photos** launcher; it can now be configured as a general app shortcut, such as **Moonlight**. It is not a large carousel tile. Consoles and the shortcut share 224 × 126 faces and rounded corners; the shared background behind the input row is removed. Captions below carousel, input and drawer tiles are hidden, while accessible names and shortcut status remain available to assistive technology. If a console name is reported through HDMI-CEC, its Xbox, PlayStation or Switch mark is drawn inline. Unnamed inputs show an HDMI connector and port label. The Moonlight mark is also drawn inline.

Focus adds a bright outline and a slight lift. With the Magic Remote pointer, a highlight follows the pointer position and the tile tilts slightly. At most one frame is scheduled at a time; there is no continuous idle animation. Keyboard navigation, leaving a tile or opening another panel restores fixed focus. Gradients and outlines work without background blur; reduced-motion mode keeps visible focus and disables the moving highlight and tilt.

The bottom chevron opens **All apps**. Its grid uses the launch-point catalog supplied by Glasshouse, including apps hidden from the carousel. The drawer displays the number of apps and can sort them in TV order or A–Z order. It does not uninstall anything or change favorites. System services without launch points, web favorites and HDMI inputs are not a complete inventory of installed packages; upstream security filters still apply.

## Navigation

The gear near All apps opens Home Settings, which includes the native **Recommendations** toggle and a G shortcut to the Glasshouse app. See [Home settings](HOME_SETTINGS.md). This package installs no custom PIN screen or app lock.

- From the last input tile, Right moves to the shortcut; Left returns to the input row.
- Down moves to the All apps button; OK opens the drawer. Arrow keys navigate its grid. Page Up/Down jump several rows on remotes that send those keys.
- OK launches the selected app. Holding OK in the drawer does not start carousel reordering.
- Close the drawer with its close button, remote Back/Escape or by clicking outside the panel. From the top app row, Up reaches the sort/close toolbar; Left/Right selects a control, OK activates it and Down returns to the grid. Closing restores the prior Home focus.
- The Magic Remote pointer can select the same controls.
- When no shortcut app is configured, or the selected app is not installed, the tile reports its state and does not attempt to launch an app.

These paths are tested against the real page with synthetic data. On October 25, 2026, existing remote commands on a C6 also verified shortcut focus, its unconfigured state, opening the drawer, moving through the grid, Back/Up and return to the carousel, then launching YouTube and returning Home. Physical remote button presses and pointer behavior are separate tests. The demo does not turn on a TV. The C2 verification is described in [C2 compatibility](C2.md); it does not certify every C2 size, firmware or region.

## Configuring the shortcut

The shortcut uses an app package ID, never a URL or launch parameters. `layout.shortcutAppId` is empty by default in the public example. Set it only to an app that is actually installed. The server validates the package ID and checks the TV's launch-point list before opening it. The request from Home supplies no app override, URL or credentials.

To configure Moonlight, use `com.limelight.webos` if that package is installed on the TV. The offline demo uses this ID with synthetic apps; that does not install Moonlight on a real television. Other app IDs can be configured using the same field, subject to the installed-app check.

The existing `photosAppId` setting remains supported and unchanged for installations that still use the Immich shortcut. Two client IDs accepted by the existing Photos configuration are:

| Community client | ID | Source reviewed October 25, 2026 |
| --- | --- | --- |
| immich-webOS, Aneesh Tigga | `com.immich.webos` | [Manifest 0.14.0](https://github.com/aneeshtigga/immich-webos/blob/e43ac58e9b6af6cffa6236c65cb77698bf9b2b42/public/appinfo.json) |
| Immich TV, Seeky91 | `com.seeky91.immichtv` | [Manifest 1.7.0](https://github.com/Seeky91/immich-tv-webos/blob/8187a502d35ef8efa5cdaf0abc60d81b3b88004a/webos-meta/appinfo.json) |

For the legacy Photos setting, the server checks that the selected app is in its launch-point catalog before opening it. The request cannot substitute another target or launch parameters. The **official Immich logo**, included unchanged, remains in use even if the installed client supplies another icon. Its transparent flower is shown alone on a dark tile, without a white square. The SVG is served from this repository, including in the offline demo; showing it contacts no Immich server. No third-party client code or extra library is bundled.

Change only the appropriate field in the existing private `home.json`; do not replace the file with the example. Reordering or resetting rows preserves the shortcut choice. Do not configure an app until it has been installed separately and that installation is approved. The demo has no real Immich account or app.

## Immich client capabilities and limits

These two projects are independent of Immich. Aneesh's client declares webOS 5 or newer. Seeky's 1.7 release declares webOS 4, while its Homebrew listing still says webOS 5; the published webOS 4 test concerns a Chromium engine, not a physical TV. Their manifests alone do not establish compatibility with a particular television.

Sources: [Aneesh project](https://github.com/aneeshtigga/immich-webos), [Seeky 1.7 release](https://github.com/Seeky91/immich-tv-webos/releases/tag/v1.7.0), [Aneesh catalog](https://repo.webosbrew.org/apps/com.immich.webos/), [Seeky catalog](https://repo.webosbrew.org/apps/com.seeky91.immichtv/).

The clients offer photos, videos, timeline, albums and slideshow features. Glasshouse only launches the app; it does not use a verified contract for launching a specific album. Choose content inside the photo client.

The clients document email/password or API-key sign-in, with local QR entry from a phone. Even if a password is not retained, tokens or API keys and the server address persist in the app's local storage. A QR flow does not prove native OIDC support: Immich offers [OIDC](https://docs.immich.app/administration/oauth/), but that does not guarantee it works in these clients.

Sources: [Aneesh storage](https://github.com/aneeshtigga/immich-webos/blob/e43ac58e9b6af6cffa6236c65cb77698bf9b2b42/src/auth/store.ts), [Seeky storage](https://github.com/Seeky91/immich-tv-webos/blob/8187a502d35ef8efa5cdaf0abc60d81b3b88004a/src/utils/accountsStore.ts).

API-key permissions limit operations; they do not guarantee that a key is restricted to one album. Before enabling a real client, choose its content scope: a full account or albums explicitly shared with a read-only user. This repository creates no account, share or token. Keep sharing links and all authentication data out of Git. See [Immich sharing](https://docs.immich.app/features/sharing/).

## Licensing and trademarks

Both clients use the MIT license ([Aneesh](https://github.com/aneeshtigga/immich-webos/blob/e43ac58e9b6af6cffa6236c65cb77698bf9b2b42/LICENSE), [Seeky](https://github.com/Seeky91/immich-tv-webos/blob/8187a502d35ef8efa5cdaf0abc60d81b3b88004a/LICENSE)). The logo is separately sourced from the [official Immich repository](https://github.com/immich-app/immich/blob/256eb55dbe92ac77e02794442f9487e88ffed2b1/design/immich-logo.svg), commit `256eb55dbe92ac77e02794442f9487e88ffed2b1`. The original SVG, its [AGPL-3.0 license](../glasshouse/server/assets/third-party/immich/LICENSE-AGPL-3.0.txt) and its [provenance notice](../glasshouse/server/assets/third-party/immich/NOTICE.txt) are kept together under `glasshouse/server/assets/third-party/immich/` and in the persistence bundle. The image is not relicensed under MIT; the Glasshouse code license is unchanged. Preserve all three files when redistributing it.

Immich and its logo are FUTO trademarks. Their use identifies an optional photo app and does not imply affiliation, endorsement or an official service. See the [Immich FAQ](https://docs.immich.app/FAQ/#what-are-your-guidelines-for-resellers-and-trademark-usage). The launcher does not reuse client code.
