# Install and use the interface without an assistant

This guide uses a terminal and a browser; Claude or Codex is not required. It describes the files in **this version**, not a universal installer for every LG TV. Start with the demo; the TV procedure is optional.

## 1. Choose the correct source

This checkout contains the **0.130.0** adaptation, based on upstream commit `1543769cfeb28c3ce0936dc6d20b24cd58c70255`. Clone the fork's `c2-support` branch, record its SHA, verify CI and check that the files below exist. Older wallpaper-only commits or the 0.118.0 adaptation do not describe this release.

On the computer, with Git and Node.js 22 or later:

```sh
SOURCE_REF=c2-support
git clone --branch "$SOURCE_REF" --single-branch \
  https://github.com/Xcelebi21/glasshouse-custom-home.git
cd glasshouse-custom-home
git rev-parse HEAD
test -f glasshouse/package.json
test -f docs/MANUAL_GUIDE.md
test -f docs/AI_PROMPTS.md
npm --prefix glasshouse run demo -- --port 8766
```

Record the displayed SHA and stop if any checked file is missing. The Glasshouse base is `1543769cfeb28c3ce0936dc6d20b24cd58c70255`, version 0.130.0; the customized fork SHA is different.

Open `http://127.0.0.1:8766/`. App launches and weather are simulated; no TV is contacted. Use the arrow keys, Enter, long-press Enter and Escape to try the Home screen. `?hour=19` shows dark mode. Stop with `Ctrl+C`.

To validate the sources, also install Python 3 and the `diff` and `patch` commands, then run from the repository root:

```sh
npm ci --prefix glasshouse --ignore-scripts --no-audit --no-fund
TEST_CONCURRENCY=1 sh scripts/validate.sh
```

There is no JavaScript build to deploy; the server ships as source. These tests do not validate TV privileges or the TV's web engine. See [reproducibility](REPRODUCIBILITY.md) for what is included, prepared or absent, and [assistant prompts](AI_PROMPTS.md) for optional help.

## 2. Choose a compatible path

| Situation | Path available here |
| --- | --- |
| Computer only | Demo and tests; no LG account or TV required. |
| LG with Developer Mode only | Install webOS apps as LG documents; **not** this HOME replacement or this repository's rooted server. |
| TV already rooted, Homebrew Channel present, root SSH already works | Run the checks below, then consider manual installation if the version is suitable. |
| Glasshouse Home on webOS 9 | Supported by this source; hardware validation is still necessary. |
| Glasshouse Home on webOS 7 | Experimental in the 0.130 base; validate the actual model. |
| Glasshouse Home on webOS 10 | Experimental in the 0.130 base; validate the actual model. |
| Glasshouse Home on webOS 11 | Requires private `allowExperimentalHome: true` and a separately chosen experimental path. |
| webOS 5 / older system Node | The Lightkeeper port used on another device is **separate and absent from this branch**. Do not copy this bundle over it. |

The dashboard server may support more models than the **HOME replacement**. `home.supported()` limits this feature to webOS 7, 9, 10 and 11 with the stated option. This guide uses port **8080** from the example; adjust the tunnel if your actual configuration uses another port. The optional persistence bundle additionally requires system Node 14.14+ (`fs.rmSync`), `patch` and `start-stop-daemon`. A successful computer demo does not lift these limits.

The [official LG Developer Mode](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app) supports installing and testing apps as user `prisoner`, generally through port 9922. It is session-limited; disabling it may remove apps installed through that method. It does not provide the root access used here. The [webOSbrew comparison](https://www.webosbrew.org/rooting/) also distinguishes these capabilities. Installing Homebrew Channel as an app does not prove the TV is rooted. If the required access is not already available, stop the TV procedure: this guide does not create a key, root the TV or change firmware.

## 3. Identify the target and verify existing access

Enter all values **locally**. The example hostname will not work. Keep addresses, device names, passwords, keys and archives out of the repository and public messages.

On the computer:

```sh
TV_HOST=tv.example.invalid
ssh -o BatchMode=yes -o StrictHostKeyChecking=yes "root@$TV_HOST" \
  'id -u; /usr/bin/node --version; command -v tar; command -v start-stop-daemon'
```

`id -u` must return `0`. This command assumes an SSH key and host fingerprint that are **already known and verified**. If authentication fails, the host key changes or the target is ambiguous, stop: do not blindly accept a new fingerprint, delete the old one or switch to Telnet. The deployment script itself uses `accept-new`, so this strict preflight matters. Existing SSH profiles may provide the port and key; do not put secrets in a command line.

In the existing SSH session, identify the actual model and active versions. Keep the output in private notes:

```sh
/usr/bin/luna-send -n 1 -w 8000 \
  luna://com.webos.service.tv.systemproperty/getSystemProperties \
  '{"keys":["modelName","firmwareVersion","sdkVersion"]}' </dev/null
```

Also inspect whether `/var/lib/tvweb`, its `config.json`, hooks `50-tvweb` and `49-glasshouse-personalisation` under `/var/lib/webosbrew/init.d`, and `/var/lib/glasshouse-personalisation` exist. Do not use this guide to replace a Lightkeeper installation or an unknown customization.

## 4. Back up before any installation

The dashboard JSON export is useful for some settings, but it does not include access secrets, all server settings, HOME activation, code or uploaded images. It is not a full backup. `deploy.sh` also does not create the `.previous` directory used by the updater. If `/var/lib/tvweb/.previous` already exists, preserve it with the current state **before another update**: the installed updater replaces that copy on its next update. An IPK install does not guarantee `.previous` exists.

### Updating an existing Glasshouse installation

1. Record the version, files/hooks present, whether HOME is enabled, and whether the service/watchdog is running. Avoid settings changes while copying.
2. If a persistence guard is present, stop only that guard using its [documented procedure](../personalisation/README.md#status-and-limitations). Record its state and hook mode so you can restore them. A different private customization requires comparison before replacement, not deletion.
3. Agree on an interruption window before stopping the service or changing the foreground app. On the TV, temporarily stop Glasshouse. This returns to LG without deleting `home.json`; a later start may resume the custom view:

```sh
/var/lib/tvweb/tvwebctl stop
/var/lib/tvweb/tvwebctl status
```

On the computer, in a **second terminal**, set the same `TV_HOST` and create a private archive outside the checkout. The new directory prevents overwriting an earlier backup:

```sh
TV_HOST=tv.example.invalid
BACKUP_DIR="$HOME/glasshouse-private/backup-$(date +%Y%m%d-%H%M%S)"
(
set -eu
umask 077
mkdir -p "$HOME/glasshouse-private"
mkdir "$BACKUP_DIR"
ssh -o BatchMode=yes -o StrictHostKeyChecking=yes "root@$TV_HOST" '
  set -eu
  cd /
  test -d var/lib/tvweb
  set -- var/lib/tvweb
  for p in var/lib/glasshouse-personalisation \
    var/lib/webosbrew/init.d/49-glasshouse-personalisation \
    var/lib/webosbrew/init.d/50-tvweb; do
    if test -e "$p"; then set -- "$@" "$p"; fi
  done
  tar -czf - "$@"
' > "$BACKUP_DIR/before.tgz"
test -s "$BACKUP_DIR/before.tgz"
tar -tzf "$BACKUP_DIR/before.tgz" > "$BACKUP_DIR/contents.txt"
)
```

Stop if SSH or `tar` fails; a partial archive is not enough. Check `contents.txt` for the code, `config.json`, `home.json` if present, uploaded wallpapers and expected hooks. Test extraction into an empty private directory and calculate a local hash:

```sh
mkdir "$BACKUP_DIR/verify"
tar -xzf "$BACKUP_DIR/before.tgz" -C "$BACKUP_DIR/verify"
shasum -a 256 "$BACKUP_DIR/before.tgz" > "$BACKUP_DIR/before.sha256"
```

On Linux, `sha256sum` may be used instead of `shasum -a 256`. Extracted files and the archive may contain secrets; do not attach them to an issue. This backup does not back up firmware or app accounts. If you cancel installation, restart the service and restore the guard exactly to its previous state.

### A genuinely fresh installation

Instead, record that the target directories/hooks are absent. Do not run the backup block above without `/var/lib/tvweb`. If files exist even though the server is absent, treat this as an existing installation and examine them before writing.

## 5. Prepare private configuration

For a first SSH installation, from the checkout root, this command creates an ignored config file with a random token without printing it and refuses to overwrite an existing file:

```sh
node -e 'const fs=require("fs"),crypto=require("crypto"); const c=JSON.parse(fs.readFileSync("glasshouse/config.example.json")); c.token=crypto.randomBytes(32).toString("hex"); fs.writeFileSync("glasshouse/server/config.json",JSON.stringify(c,null,2)+"\n",{flag:"wx",mode:0o600});'
```

Open **this private file** in your editor and enter only the settings you want. Keep `host: "127.0.0.1"` and `port: 8080` for the tunnel procedure. `allowControl: true` permits commands and HOME activation; `allowPower` is not needed for the app launcher. On webOS 11, choose `allowExperimentalHome: true` only after the prior checks. MQTT, weather, optional telemetry and system hiding can remain disabled. Never use an example token.

For an existing installation, the active file is `/var/lib/tvweb/config.json` **on the TV**. After backing it up, change only the desired values using your private editor over the existing maintenance path; preserve all other values. A local bootstrap `config.json` never replaces the TV's file. Do not copy `config.example.json` or `home.example.json` over your real configuration.

## 6. Install the server and preview Home separately

After reviewing the target, verified backup and diff, this command **writes to the TV and restarts Glasshouse**:

```sh
cd glasshouse
bash server/deploy.sh "$TV_HOST" --no-persist --no-app
```

This copies the server to `/var/lib/tvweb`, preserves its existing configuration and does not add a startup hook or dashboard tile. It does **not** activate Glasshouse Home or disable persistence already installed on the TV. Existing files are replaced; the script is not a full rollback transaction if the connection drops. If the result is uncertain, inspect the state before considering another deployment.

If your only maintenance path is Telnet, use it only when you have separately approved the unencrypted connection. Pass `--telnet` explicitly. Telnet cannot send a configuration seed, so a first install requires `/var/lib/tvweb/config.json` to exist already on the TV.

Open the dashboard through a loopback-bound tunnel from the computer:

```sh
ssh -o StrictHostKeyChecking=yes -N \
  -L 127.0.0.1:8767:127.0.0.1:8080 "root@$TV_HOST"
```

Open `http://127.0.0.1:8767/`. Authenticate with the token from the private configuration; keep it out of the URL and reports. Leave the tunnel open while using the dashboard; `Ctrl+C` closes it.

The conservative path ends with a server health check and a **preview through a developer Home tile that is already installed and approved**. `--no-app` does not install that tile; do not install an app or tile unless that change is separately approved. Verify the server response on loopback with token authentication. If a suitable developer tile already exists, launch it and inspect the Home page and app library. Keep Home Settings' takeover action untouched.

**Activating Glasshouse Home is a separate, higher-impact step and is not part of this guide's safe preview.** It changes the LG Home replacement and requires explicit approval after reviewing a separate plan, backup and rollback path. Do not select **Use Glasshouse Home**, add a startup hook or enable hiding LG Home during the preview. On the verified C2, no takeover, startup hiding or boot hook was enabled.

If the dashboard is already present and Glasshouse Home was separately activated by an approved plan, the LG Home tile and a long press on **HOME** (about 1.2 seconds) are documented exits. To return durably to LG Home, use **Use LG Home** in that approved setup. If the dashboard stops responding, the targeted TV-side recovery command is:

```sh
/var/lib/tvweb/tvwebctl restore-glasshouse-home
```

`restore-home` is a different function related to LG layout; do not substitute it. Complete any reported partial restoration before uninstalling. Do not use checkpoint deletion or reboot procedures as routine fixes for a UI issue.

## 7. Adapt apps, HDMI, shortcut and wallpapers to your TV

**Apps.** Install and sign into services separately. In the dashboard, use the apps actually listed, then set their visibility and order in Home. A retail name does not guarantee the same app ID in every region. **All apps** lists launch points exposed by the server, not every system package; it keeps apps removed from the carousel reachable. Keep the LG Home tile. Long-press OK reorders tiles; test saving and cancelling before continuing. To launch Bell as an app, use the actual installed webOS app ID if that is the intended destination. The Bell Fibe box and its HDMI input are a separate device; changing one must not remove the other.

**HDMI.** The Inputs row follows `layout.devPorts` in `home.json`. The shipped empty list keeps all inputs; `[1, 3]` selects those ports. No HDMI input is injected as an app tile. Console marks are selected from the HDMI-CEC name (Xbox, PlayStation or Switch); unnamed inputs show an HDMI connector. A configured console layout may use Switch 2 and Xbox labels for ports 1 and 3, but those are visual choices, not detection. Do not copy these labels to a TV with only a Firestick connected. For other hardware, adapt `TILE.dev` in [`home.html`](../glasshouse/server/assets/home.html), then regenerate and test the bundle as described below. Do not invent consoles to fill a row.

**Moonlight and Photos.** The former Photos tile is a configurable app shortcut; it does not install an app or photo service. To use Moonlight, set `shortcutAppId` in the existing private `home.json` to `com.limelight.webos` only after confirming that exact ID is installed. The server validates the package ID and checks its launch-point catalog before opening it; the Home request cannot supply a URL or launch parameters. Existing `photosAppId` configurations remain supported.

For the legacy Photos setting, the logo is included, but no Immich client or account is. If you want to use it, install a chosen client separately according to its own instructions, then check the exact ID in the TV's app catalog. To read that private list over existing SSH:

```sh
/usr/bin/luna-send -n 1 -w 8000 \
  luna://com.webos.applicationManager/listApps '{}' </dev/null
```

The list is private; do not publish it. In the existing private `/var/lib/tvweb/home.json`, change only `photosAppId` to one of the allowed IDs: `com.immich.webos` or `com.seeky91.immichtv`. These strings alone do not prove installation. Leave it `""` if no client is chosen. The server refuses to launch a missing app or a target outside the allow-list. See [Photos](PHOTOS.md) for projects, licenses and limits. The launcher needs no photo-server URL, API key or album. Verify only that the intended app opens; content access and authentication are separate client-specific steps.

**Wallpapers.** Upload the four daytime JPEGs to the `morning`, `afternoon`, `evening` and `night` slots in this order: `01-…`, `02-…`, `03-…`, `04-…`. In this customization, they rotate **by day** despite the historical slot names. The fifth wallpaper, `05-lac-nuit.jpg`, is bundled for 17:00–06:00 according to the TV's local time. Uploaded files are outside the update payload. Live weather is optional; set coordinates and attribution as described in [Installation](INSTALLATION.md#optional-private-weather), only in a private file. The demo does not reproduce your location or subscriptions.

**News → Plex.** In **Apps → Remote keys**, choose News only if the active mechanism offers that key and a physical press corresponds to it. Added support concerns the native `haystack` mapping on webOS 11; it is not a universal key code. Choose your installed Plex app, then test one physical press. If the key is unknown, stop rather than inventing a code or installing an interceptor. To undo only this choice, use **As LG has it** for that key. `restore-keys` restores every key and is not the targeted undo. At startup or wake, LG may handle the shortcut before Glasshouse, especially if the key also turns on the TV.

**Settings and recommendations.** From All apps, press Right then OK to open the gear. The Recommendations toggle preserves other settings and honors the saved value; it is off in examples. Turning it on allows app-provided cards and remote poster images. Do not promise resume playback or personalization. The accordion opens with Down/click, never mixes providers and shows no cards for an app that publishes none. An empty result is not an error to bypass. See [Home settings](HOME_SETTINGS.md) for details. The small G opens only the verified native Glasshouse app.

## 8. Persistence, startup and validation

The `50-tvweb` server hook starts Glasshouse at boot. The optional `49-glasshouse-personalisation` guard reapplies this bundle after a compatible update. They are separate mechanisms. Use the [persistence guide](../personalisation/README.md) only after the server is working and the system Node version is verified; it refuses a pre-existing bundle or hook. Do not bypass that refusal: a private adaptation may already be present.

After changing a source and **before** building or copying the bundle:

```sh
# From the repository root
node personalisation/generate.js
node personalisation/generate.js --check
node personalisation/test-apply.js
node personalisation/test-guard.js
TEST_CONCURRENCY=1 sh scripts/validate.sh
```

On the TV, inspect the guard's `status.json` **privately**: `current` confirms expected files; `applied` must also have a successful or unnecessary restart. `blocked`, `busy` or `waiting` are not successes. The bundle's `latest`/`previous` technical backups do not replace your initial archive.

Test without opening personal content: launch an app, a selected HDMI input, shortcut status, arrows/OK/Back, the drawer, reordering, accessible names and reduced motion. For the drawer, verify the count, both sort modes and all closing paths (button, Back and click outside). From the top app row, Up should focus the sort/close toolbar; Left/Right selects a tool, OK activates it and Down returns to the grid. For the shortcut, verify only the intended installed app opens. Test standby and cold start **separately** when no playback or recording is in progress. Do not promise a fixed startup time. Quick Start+, Home Auto Launch, firmware and services affect startup; activation may adjust Home Auto Launch and deactivation restores it. Do not force settings to imitate another TV. Keep a usable LG Home recovery path.

## Recover the menu after an upstream update

Returning to the standard menu does not prove that settings were lost. Before another update, preserve the current state **and `.previous` if it exists** using the backup steps above. Record the actual version, hashes, assets, guard state and relevant errors privately. `blocked` may indicate an incompatible patch; returning to LG Home may also be a fallback. Do not reinstall blindly.

Compare saved customizations with the official sources for the version actually installed. Reapply compatible deltas, keep new upstream features and test before applying. Check custom fields separately: a stock version may remove an unknown field when saving settings. Repair only the necessary field against the verified installed version and preserve other current preferences.

Apply prepared files with a targeted backup and concurrent-change checks. Do not copy an entire old page, `home.json` or `.previous` onto the new version. Restoring the complete older state below is a separate choice, not the normal treatment for a missing menu.

The server caches assets in memory. Compare the on-disk hash with the hash of the content **actually served**; a refresh may still show the old page. Only during an approved interruption window:

```sh
/var/lib/tvweb/tvwebctl restart
```

This restarts the service, not the TV. Then verify the HTTP response, guard, menu and approved destinations before claiming recovery. A blank screenshot does not prove the physical screen is off. Preserve LG/Homebrew updates and protections; do not reintroduce a custom PIN.

## 9. Return to the previous state

To abandon only the Home replacement, **Use LG Home** or `restore-glasshouse-home` is sufficient; verify LG Home returns. To restore **files from before a manual deployment**, use your private archive:

1. Verify the archive hash and contents on the computer. It must come from this TV and this intervention, and contain only the paths that were backed up. Do not restore another device's archive.
2. On the TV, restore LG Home first, then stop the persistence guard and server. If HOME restoration fails, stop this procedure.
3. Preserve the current installation and recent settings in a **new** private backup. Compare dates and user changes since the first backup; do not overwrite them without reconciling.
4. Put the verified archive in a private temporary directory and extract it first into a **new staging directory**, not over the active system. Verify restored code, configuration, files and modes.
5. Replace only directories/hooks present in the initial inventory, keeping removed versions for recovery. Files created by this installation but absent from that inventory should be removed only after identification, not through a broad `/var/lib` deletion.
6. Restore snapshot modes, then restore the guard hook's **original mode recorded before stopping it**; the backup may have captured it temporarily disabled. Start the server/guard only if each was running before. Check the version, HOME state, configuration and launches.

To stage the archive created above, keep `TV_HOST` and `BACKUP_DIR` private. On the computer:

```sh
(
set -eu
ssh -o StrictHostKeyChecking=yes "root@$TV_HOST" \
  'umask 077; test ! -e /var/lib/glasshouse-restore-manual && mkdir -m 700 /var/lib/glasshouse-restore-manual'
scp -o StrictHostKeyChecking=yes "$BACKUP_DIR/before.tgz" \
  "root@$TV_HOST:/var/lib/glasshouse-restore-manual/before.tgz"
)
```

Do not continue if the directory already existed or the copy fails. On the TV, **after** steps 1–3 and verifying the private archive:

```sh
set -eu
cd /var/lib/glasshouse-restore-manual
mkdir stage current
tar -xzf before.tgz -C stage
test -f stage/var/lib/tvweb/tvweb.js
test -f stage/var/lib/tvweb/config.json
```

At this point, inspect staging and reconcile recent changes. The next block is the **actual replacement**, limited to the four paths in this backup; it preserves removed versions under `current`. Do not run it with an archive from another TV, for a first installation without a backup, or before reconciling user changes. HOME, server and guard must be stopped as described above. If a target path is a symlink or remains an active mount, stop and investigate before moving it:

```sh
set -eu
cd /var/lib/glasshouse-restore-manual
for p in var/lib/tvweb var/lib/glasshouse-personalisation \
  var/lib/webosbrew/init.d/49-glasshouse-personalisation \
  var/lib/webosbrew/init.d/50-tvweb; do
  if test -e "/$p"; then
    mkdir -p "current/$(dirname "$p")"
    mv "/$p" "current/$p"
  fi
  if test -e "stage/$p"; then
    mkdir -p "/$(dirname "$p")"
    mv "stage/$p" "/$p"
  fi
done
```

If interrupted, inspect `stage`, `current` and the destinations before doing anything else; this block is not atomic or safe to repeat blindly. It respects an originally absent hook/bundle: a file added after the backup stays under `current` rather than being started. Restore the original guard hook mode if present, then run `/var/lib/tvweb/tvwebctl start` and the guard only if they were active originally. Verify status and keep `current` private until recovery is validated.

For a first installation, rollback means restoring the initial absence of files owned by this package after restoring LG Home; it is not a TV reset. The block above requires a backup of an older installation and is not suitable. `tvwebctl rollback` uses `.previous` created by the **updater**; it is not a guaranteed backup from `deploy.sh`. Keep the manual archive until the result and a later startup have been verified.

## 10. What you can share

Glasshouse code is MIT; fonts are SIL OFL; the Immich logo is the original SVG accompanied by its separate AGPL-3.0 license and notice. Preserve these files and attributions when redistributing. Trademarks and their terms are distinct from code licensing. Private TV-service logos are not shipped; the public rendering uses text alternatives, native app icons, or public Simple Icons console marks and an inline HDMI connector, and is not pixel-identical to private installations. No new blanket license is assigned to previously published wallpapers.

See [Provenance](PROVENANCE.md). Do not share completed configuration files, archives, logs, personal screenshots, SSH keys, photo-client sessions or private links. Secret scanning is an additional check, not an absolute guarantee. Publication, new root/access, installing an app or changing security remain decisions separate from preparing this guide.
