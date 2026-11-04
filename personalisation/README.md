# Persistent Glasshouse customization

This bundle reproduces the public C6 Home changes on Glasshouse **0.130.0**, based on commit `1543769cfeb28c3ce0936dc6d20b24cd58c70255`. It keeps customizations outside the directory replaced by updates. The Lightkeeper variant uses a separate mechanism and is not covered here.

Four patches modify `assets/home.html`, `lib/home.js`, `lib/routes.js` and `lib/remotekeys.js` (News key support on webOS 11). Six assets are added: `lib/home-weather.js`, `lib/tv-profile.js` (C2/C6 profile and webOS rules), the night wallpaper, and the three official Immich-logo files (unchanged SVG, complete AGPL-3.0 license and notice). Proprietary custom app logos are not redistributed. The public UI uses its built-in alternatives; privately adding logos you have redistribution rights for is separate from this bundle.

## Generate and test on a computer

From the repository root, with Node.js 22, Python 3 and the `patch` command:

```sh
node personalisation/generate.js
node personalisation/generate.js --check
node personalisation/test-apply.js
node personalisation/test-guard.js
```

`generate.js` checks the hashes of the four MIT source files kept in `base/`, creates timestamp-free patches using Python's `difflib` (the same algorithm on macOS and Linux), copies only the six allow-listed assets and writes their SHA-256 hashes to `manifest.json`. It does not access a device or read personal configuration. Run it after changing public sources; `--check` fails if the bundle is stale.

The tests create their own temporary directories. They cover conflicts, asset integrity, paths and symlinks, concurrent writes, rollback on failure, preservation of settings and service restarts. They do not validate a new release on a TV. On Windows, use a checkout with LF line endings (`core.autocrlf=false`) for generation and `--check`; a CRLF checkout can fail the pinned source hashes.

## Optional manual installation

This procedure changes a **rooted TV that already has** Glasshouse 0.130.0, Homebrew Channel, `patch`, `start-stop-daemon` and a system Node.js compatible with `fs.rmSync` (14.14 minimum). It does not suit older models limited to Node.js 8. It does not root the TV, install firmware or change privacy protections. Review the plan, obtain explicit approval for adding a startup hook, prepare a private backup and verify compatibility before running it. This procedure is different from the conservative source deployment described in the [manual guide](../docs/MANUAL_GUIDE.md).

Settings, row order and wallpapers remain under `/var/lib/tvweb`. Configure tiles and weather according to the project docs; this bundle does not replace `home.json` or `config.json`. Do not add a TV's identity or state to this repository.

After generation and local tests, create an archive containing only the required files. Replace the example host locally:

```sh
TV_HOST=tv.example.invalid
tar -czf /tmp/glasshouse-personalisation.tgz -C personalisation \
  apply.js guard.js 49-glasshouse-personalisation manifest.json patches files base/LICENSE
scp /tmp/glasshouse-personalisation.tgz "root@$TV_HOST:/tmp/glasshouse-personalisation.tgz"
```

Open an SSH session to the TV, then run the following commands only after approval. They refuse to overwrite an existing bundle or hook. Do not bypass that refusal; an existing customization may include private changes.

```sh
ssh "root@$TV_HOST"
```

On the TV:

```sh
set -eu
test -d /var/lib/webosbrew/init.d
test -f /var/lib/tvweb/tvweb.js
test -x /usr/bin/node
command -v patch
command -v start-stop-daemon
/usr/bin/node -e 'if (typeof require("fs").rmSync !== "function") process.exit(1)'
test ! -e /var/lib/glasshouse-personalisation
test ! -e /var/lib/webosbrew/init.d/49-glasshouse-personalisation
mkdir -m 700 /var/lib/glasshouse-personalisation
tar -xzf /tmp/glasshouse-personalisation.tgz -C /var/lib/glasshouse-personalisation
chmod 700 /var/lib/glasshouse-personalisation
cp /var/lib/glasshouse-personalisation/49-glasshouse-personalisation /var/lib/webosbrew/init.d/
chmod 755 /var/lib/webosbrew/init.d/49-glasshouse-personalisation
/var/lib/webosbrew/init.d/49-glasshouse-personalisation
cat /var/lib/glasshouse-personalisation/status.json
```

The hook applies the bundle at boot, before the official `50-tvweb` hook, then checks files every ten seconds. It waits for two stable observations after an update and restarts Glasshouse once if it was already running. It does not start a service that was deliberately stopped. Installing the hook or reapplying a patch may interrupt Home; schedule an approved maintenance window before running it during viewing.

## Status and limitations

- `current`: customized files are present.
- `applied`: application completed; also check the `restart` field.
- `busy`: installation or another apply operation is in progress.
- `blocked`: a conflict or check failed; read `message` and adapt the bundle.
- `waiting`: Glasshouse is absent; it is not installed automatically.
- `restart: failed`: files were applied, but restarting the service failed.

Upstream changes outside the patches are preserved. Ambiguous context, an existing different asset or an incompatible file blocks the apply before replacement. The two most recent technical backups remain under `backups/latest` and `backups/previous` **on the TV**. Keep them private. Do not send `status.json`, lock files or logs to the repository.

This method cannot guarantee compatibility with every future version, a Glasshouse redesign, uninstall, factory reset or firmware update. After an update, check status, rendering and remote actions. Changing versions is a separate test from applying patches locally.

If the menu returns to upstream rendering, first preserve the current installation and `/var/lib/tvweb/.previous` if it exists, before another update. That copy belongs to the updater in place, is not created by a first `deploy.sh`, and is not guaranteed for an IPK installation. It is replaced at the next update. Preferences may survive even when UI files are replaced; a code backup does not authorize overwriting recent settings.

A blocked bundle must be adapted to the actually installed version. Compare patches, assets and the fields normalized by that version, then test locally; do not install the reference base or downgrade the server. After applying, check hashes on disk **and** the page served over HTTP. The in-memory asset cache may require restarting only the Glasshouse service during an approved maintenance window, followed by a Home refresh. This bundle does not change LG/Homebrew updates or security protections. It includes no PIN guard.

To stop automation without restoring older files, on the TV:

```sh
chmod -x /var/lib/webosbrew/init.d/49-glasshouse-personalisation
start-stop-daemon -K -q -p /var/run/glasshouse-personalisation.pid
```

This leaves the current Home and settings in place. To re-enable it, make the hook executable and run it. To retry after a compatible adaptation:

```sh
/usr/bin/node /var/lib/glasshouse-personalisation/guard.js --once
```

The upstream MIT notice remains in [base/LICENSE](base/LICENSE). The Immich logo retains its separate AGPL-3.0 license under `files/assets/third-party/immich/`; keep the SVG, license and notice together. No logo implies affiliation with Immich or FUTO.
