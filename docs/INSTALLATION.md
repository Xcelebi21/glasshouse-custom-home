# Installation and configuration

For a first-time walkthrough without an assistant, use the [standalone manual guide](MANUAL_GUIDE.md). This document is the reference for the public profile's settings. First review the [initial audit and compatibility](REPRODUCIBILITY.md), then verify that the code is present in the exact reference you downloaded. Older `main` commits before PR #1 was merged contained only wallpapers.

The README demo is the recommended way to inspect the UI without hardware. The optional TV procedure is only for a TV that is already rooted, has Homebrew Channel, and has an existing maintenance connection. It is not a root or firmware installation guide.

## Full source deployment

This branch is based on Glasshouse **0.130.0**, upstream commit `1543769cfeb28c3ce0936dc6d20b24cd58c70255`, with a customized Home view. The server remains ES5 JavaScript, but the persistence mechanism requires a modern system Node version; see its guide. Validate this modified public build on each target TV. Historical C6 experience does not certify every model.

Before deployment, perform a read-only preflight and make a private, verified backup of the current installation and settings. Inspect the exact changes before writing to the TV. `deploy.sh` installs and restarts Glasshouse; by default it also installs the `50-tvweb` startup hook. `--no-persist` skips that hook, and `--no-app` avoids adding the dashboard tile. Neither option enables Glasshouse Home. They do not create a complete backup or a ready-to-use version restore; prepare those using the manual guide first. These commands are not part of the demo or CI.

For an SSH first install, prepare a private minimal config file locally. This command refuses to overwrite an existing file and generates the token without printing it:

```sh
cd glasshouse
node -e 'const fs=require("fs"),crypto=require("crypto"); const c=JSON.parse(fs.readFileSync("config.example.json")); c.token=crypto.randomBytes(32).toString("hex"); fs.writeFileSync("server/config.json",JSON.stringify(c,null,2)+"\n",{flag:"wx",mode:0o600});'
```

For an update where the TV already has a configuration, no new local file is needed. A first install without a configuration is refused before replacing files. SSH deployment never silently falls back to Telnet. Telnet must be explicitly requested, is unencrypted, and cannot send a configuration seed; the TV must already have `/var/lib/tvweb/config.json`.

From `glasshouse/`, after reviewing the target and backup:

```sh
TV_HOST=tv.example.invalid
bash server/deploy.sh "$TV_HOST" --no-persist --no-app
```

Replace the example host locally. The script preserves the existing `config.json` and wallpaper storage; a local bootstrap config is used only when the TV has none. Keep private settings in the ignored `glasshouse/server/config.json`, never in a tracked file. Adapt `config.example.json` with a locally generated token, the desired network binding and only the necessary commands. Do not expose the rooted server to the Internet. See upstream [security documentation](../glasshouse/docs/SECURITY.md).

The example binds locally, so use a tunnel to access its dashboard:

```sh
ssh -N -L 8767:127.0.0.1:8080 "root@$TV_HOST"
```

Open `http://127.0.0.1:8767/` and enter the token from the private file in the authentication field. Do not put a token in a public URL or report. Explicitly enable `allowControl` in the private configuration if control commands are required; `allowPower` is optional. On an existing TV, edit its `/var/lib/tvweb/config.json` through the dashboard or SSH: the local bootstrap file never replaces that file.

The guide uses server port **8080**, which is the example value. Home is supported by the code on **webOS 9**, offered experimentally on **webOS 7 and 10**, and offered on **webOS 11** only with `allowExperimentalHome: true`. That flag does not enable Home on webOS 5 or another unrecognized version. Developer Mode does not replace the required root access. Home remains disabled in the example; verify the target before enabling it. The Lightkeeper variant for older models is not included.

## Home layout and inputs

In Glasshouse Home settings, enable Home only after the separate preview and approval steps; the safe deployment above does not enable takeover. The synthetic starting values are in `examples/home.example.json`; do not copy that file over an existing `home.json`.

The demo Apps row includes YouTube, Netflix, Plex, Crave, Prime Video, ICI TOU.TV, Bell Fibe and LG Home. These apps must be installed separately; subscriptions, sessions and personal app data are not included. LG Home remains available as a return path. To launch Bell as an app, use its actual installed app ID (`com.bell.fibetv.production` is accepted by the profile), not the HDMI input for a set-top box. Its presence on another TV does not prove it is installed on yours.

The inputs row follows `layout.devPorts` in `home.json`. The default empty list keeps all inputs; `[1, 3]` keeps only those ports. No HDMI tile is injected into the Apps row. Console art is selected from an HDMI-CEC name where available (Xbox, PlayStation or Switch); an unnamed input shows an HDMI connector and its port. The configured console layout can use Switch 2 and Xbox as visual labels on ports 1 and 3; this is not universal device detection. For other hardware, adapt `TILE.dev` in `glasshouse/server/assets/home.html`, regenerate the persistence bundle and run the tests. The port list does not discover the physical wiring.

The former Photos tile is a general app shortcut configured by `layout.shortcutAppId`, a plain package ID. The server checks that the selected ID is installed before launch; no URL or launch parameters are accepted. For Moonlight, set it to `com.limelight.webos` only if that app is installed. Existing `photosAppId` configurations remain supported. See [Photos and app shortcut](PHOTOS.md) for the ID validation, privacy boundaries and Immich compatibility details. The demo uses synthetic apps and makes no photo-service connection.

The All apps drawer lists apps from Glasshouse's launch-point catalog, shows an app count, and toggles between TV order and A–Z sorting. Close it with the close button, remote Back/Escape or a click outside. From the top app row, Up reaches the sort/close toolbar; Left/Right selects an action, OK activates it and Down returns to the grid. The [Home settings guide](HOME_SETTINGS.md) describes recommendations and the Glasshouse shortcut. These controls do not provide a custom PIN lock.

The four daytime wallpapers are uploaded to Glasshouse Home's wallpaper slots:

| Slot | File |
| --- | --- |
| morning | 01-lac-alpin-bleu.jpg |
| afternoon | 02-rockies-turquoise.jpg |
| evening | 03-lac-soleil-doux.jpg |
| night | 04-foret-brume-bleue.jpg |

Home cycles these four slots **by day**, despite their historical filenames. The fifth wallpaper, `05-lac-nuit.jpg`, is bundled as `assets/home-wallpaper-dark.jpg` for the 17:00–06:00 dark period. The TV's clock controls that period. Holding OK reorders tiles without revealing hidden apps.

## Optional private weather

The module makes no request when `homeWeather.enabled` is false or its settings are invalid. Private configuration accepts numeric latitude and longitude, an IANA time zone and a city label. This is the shape to fill locally in the existing `config.json`:

```json
{
  "homeWeather": {
    "enabled": false,
    "latitude": null,
    "longitude": null,
    "timezone": "Etc/UTC",
    "label": "YOUR_CITY"
  }
}
```

After entering local values, `enabled: true` allows Open-Meteo requests using those coordinates. The label appears in the widget. Follow the service terms and retain its attribution. Never publish the completed file.

## Updates

An upstream update may replace customized files. The [persistence bundle](../personalisation/README.md) reapplies them when patch context is compatible; it does not restore old settings. An incompatible update blocks patch application and requires an adaptation. Check status and rendering after each update. This repository does not change the TV's privacy protections or access settings.

If the customized menu disappears, first back up the current state and `/var/lib/tvweb/.previous` if it exists. The updater may replace that copy on its next update. An IPK install does not guarantee that this backup exists. Compare the version, configuration, assets and watchdog state before restoring anything. Rebase only compatible changes onto the installed version; do not downgrade or blindly copy back an old page or `home.json`.

The server also caches assets in memory. After a validated replacement, a refresh may still return the old page. During an approved maintenance window, restart **only the Glasshouse service**, then verify the hash of the actual HTTP response and inspect the rendered page. A TV reboot is not a default step. Backup and recovery are detailed in the [manual guide](MANUAL_GUIDE.md).
