# Glasshouse Custom Home

**An English-language Home customization for LG webOS**

[Project documentation](docs/README.md) · [Upstream Glasshouse](https://github.com/rorygallagher2024/glasshouse) · [This fork](https://github.com/Xcelebi21/glasshouse-custom-home)

![Actual Home with YouTube recommendations](docs/images/c6-home-recommendations-2026-10-28.png)

| All apps | Compact settings |
| --- | --- |
| ![App drawer](docs/images/c6-all-apps-2026-10-28.png) | ![Recommendations, Close and Glasshouse](docs/images/c6-settings-2026-10-28.png) |

*Captured October 28, 2026: the actual page served by a C6 running Glasshouse 0.130.0 and rendered in a browser—not a panel capture or synthetic demo.*

## What it does

Glasshouse Custom Home is a community customization of [Glasshouse](https://github.com/rorygallagher2024/glasshouse) Home for an already-rooted LG webOS TV. It includes the Home interface, server sources, a reproducible customization bundle, tests and guides. It is not affiliated with LG or the services shown.

- An app carousel, configurable HDMI/console row and a shortcut tile. Xbox, PlayStation and Switch marks are drawn inline when HDMI-CEC reports the device; unnamed inputs show an HDMI connector. The former Photos tile can launch an installed app such as Moonlight (`com.limelight.webos`).
- An **All apps** library that includes apps outside the carousel, shows an app count, sorts by TV order or A–Z from the remote or pointer, and closes with its button, remote Back or a click outside. Up from the first app row moves to the sort/close toolbar.
- A **Recommendations** accordion scoped to the selected app; it does not invent cards when a provider publishes none.
- Compact settings with a recommendations toggle and a shortcut to the native Glasshouse app.
- Daily wallpapers, dark mode from 17:00 to 06:00 and optional weather, shown in Fahrenheit as an icon, temperature and city.

The UI and project documentation are English-only. Upstream Spanish, German, Russian, Hungarian and Italian language packs and the language picker are retained. The public demo uses synthetic weather and launches; it does not connect to a TV or external service. Moonlight and photo clients are not installed by this project.

## Compatibility and safe installation

The source baseline is **Glasshouse 0.130.0**, upstream commit `1543769cfeb28c3ce0936dc6d20b24cd58c70255`. One **OLED55C2PUA** running webOS `9.2.2-61 (ombre-okapi)`, firmware `23.25.55`, was hardware-verified: the profile identified family `c2` and tier `supported`, the server returned HTTP 200 on loopback `127.0.0.1:8080` with token authentication, and the developer Home tile launched. The Glasshouse Home takeover was then mounted in LG Home's place and the boot hook `/var/lib/webosbrew/init.d/50-tvweb` was installed; running that hook re-mounted the takeover and started the server. Hiding LG Home at startup remains off, so a failed start still leaves LG Home reachable. This verifies one C2 only; other sizes, firmware versions and regions remain uncertified. See the [C2 compatibility note](docs/C2.md).

1. Try the [local demo](#local-demo); it requires no TV or AI assistant.
2. Follow the [manual guide](docs/MANUAL_GUIDE.md) to check the exact model, existing root access, Node runtime and maintenance path. Developer Mode alone does not provide the privileges needed for system deployment.
3. Before any TV write, perform a read-only preflight and make a private, verified backup. Keep backups and real configuration outside Git.
4. The conservative source deployment is `deploy.sh --no-persist --no-app`: it skips the startup hook and dashboard tile. It does **not** enable Home takeover. Preview the UI through an approved developer tile first; do not change Home or startup behavior without explicit approval.
5. Keep the [rollback procedure](docs/MANUAL_GUIDE.md) available before any update.

The [persistence bundle](personalisation/README.md) can reapply patches to compatible versions but cannot guarantee every future upgrade. The repository does not ship a ready-to-use nightly updater. Recommendations do not guarantee resume playback, progress tracking or universal personalization.

## Local demo

**Git and Node.js 22+** are required. The demo needs no npm packages.

```sh
git clone https://github.com/Xcelebi21/glasshouse-custom-home.git glasshouse-custom-home
cd glasshouse-custom-home
git rev-parse HEAD
test -f glasshouse/package.json
npm --prefix glasshouse run demo -- --port 8766
```

Open `http://127.0.0.1:8766/`. The demo listens on loopback and contacts no TV or external service. Use arrow keys to navigate, Enter for OK, a long press to reorder and Escape for Back. `?hour=12` and `?hour=19` preview daytime and nighttime. Press `Ctrl+C` to stop the demo. Record the SHA before adapting a TV.

## Project map

| Path | Contents |
| --- | --- |
| [`glasshouse/`](glasshouse/) | Server sources, Home UI and tests |
| [`personalisation/`](personalisation/) | Reproducible patches and optional persistence guard |
| [`docs/`](docs/README.md) | Installation, compatibility, recovery and provenance |
| [`examples/`](examples/) | Synthetic configuration to adapt locally |
| [`scripts/validate.sh`](scripts/validate.sh) | Local and CI validation |
| [`docs/images/`](docs/images/) | Documentation screenshots |

The five root-level wallpapers are AI-generated landscapes: [blue](01-lac-alpin-bleu.jpg), [turquoise](02-rockies-turquoise.jpg), [sunset](03-lac-soleil-doux.jpg), [mist](04-foret-brume-bleue.jpg) and [night](05-lac-nuit.jpg). Their paths are retained for existing references.

## Development

Node.js 22+, Python 3, `diff` and `patch`:

```sh
npm ci --prefix glasshouse --ignore-scripts --no-audit --no-fund
sh scripts/validate.sh
```

Validation covers types, tests, ES5, UI consistency, the persistence bundle and package assembly. CI also scans the tree and history for secrets.

See [Contributing](CONTRIBUTING.md). Keep real settings, personal photos, backups, logs, keys and tokens out of issues and commits.

## Licenses and credits

- Glasshouse: [upstream MIT license](glasshouse/LICENSE), Rory Gallagher; notices retained.
- Fonts: Outfit, Manrope and Inter, SIL OFL 1.1, notices included. Inter is the Apple TV-style face; SF Pro cannot be redistributed.
- Immich logo: separate AGPL-3.0 asset with [license and attribution](glasshouse/server/assets/third-party/immich/NOTICE.txt). It is used by the legacy Photos shortcut only.
- Weather: Open-Meteo, with attribution in the dashboard's Home settings.
- Service marks, app icons and images in screenshots belong to their respective owners; no affiliation or trademark license is implied.

See [detailed provenance](docs/PROVENANCE.md). No blanket new license applies to the wallpapers or the repository.
