# What is actually reproducible

This release contains a customized Home based on **Glasshouse 0.130.0**, upstream commit `1543769cfeb28c3ce0936dc6d20b24cd58c70255`. The main README and guides describe the public project; record the exact SHA and CI result for the checkout you use. Historical tables below describe earlier checks, not the current state of a remote branch.

## Public state at the initial audit

| Source at audit time | Revision checked | Contents at that revision |
| --- | --- | --- |
| [Earlier `main`](https://github.com/pducharme/glasshouse-custom-home/tree/9366c6bb9a1dcdbf8421d3f9de4dc178076e7491) | `9366c6bb9a1dcdbf8421d3f9de4dc178076e7491` | Five JPEGs and a wallpaper README. No server, demo, installer or complete UI guide. |
| [Audited UI code](https://github.com/pducharme/glasshouse-custom-home/tree/d2e3ebc843c827a7040aa08e69abc9b7c31a8abe) | `d2e3ebc843c827a7040aa08e69abc9b7c31a8abe` | Adapted Glasshouse 0.118.0 sources, synthetic demo, example configuration, locked dependencies, tests and customization bundle. |
| [PR #1](https://github.com/pducharme/glasshouse-custom-home/pull/1) | Same code commit | Open, draft and **not merged during that initial audit**. Its public contents differed from an ordinary clone of `main`. |

The two branches were cloned separately for that check. The default clone contained six tracked files; the PR clone contained 384 at the listed commit. Standalone guides were added after commit `d2e3ebc` and later merged by PR #1; checking out that earlier SHA removes them. To assess the current release, inspect the remote SHA of `main`, the included version and whether `glasshouse/package.json`, `docs/MANUAL_GUIDE.md` and `docs/AI_PROMPTS.md` exist at that exact reference. Confirm publication or merge status on GitHub rather than inferring it from this historical table.

The PR code had [successful CI on that revision](https://github.com/pducharme/glasshouse-custom-home/actions/runs/40212645485). That checks code and fixtures, not another television. Check today's branch, SHA and CI before following a mobile `main` link or branch name.

## Without Codex: yes for the demo, conditional for a TV

The demo requires no agent; Git and Node.js 22+ are sufficient. The commands in the [README demo](../README.md#local-demo) do not access a device. Developers can rebuild and test the package with npm, Python 3, `diff` and `patch`.

TV installation has additional requirements: a compatible TV that is already rooted, a working private maintenance connection, private backups and verified configuration. The [manual guide](MANUAL_GUIDE.md) describes this path. It does not create root access or a new access method. The HDMI layout must also match your actual devices; it is not a universal installer that discovers consoles.

An assistant using the [provided prompts](AI_PROMPTS.md) can help inspect and adapt sources. It does not grant permissions, solve a platform incompatibility by confirmation, or justify claiming an installation it did not verify.

## Compatibility: server, Home and persistence are separate

| Environment | What this release provides |
| --- | --- |
| Computer with Node.js 22+ | Offline demo and tests. No root access, LG account or TV is needed. |
| LG TV with Developer Mode only | Developer Mode supports app development/deployment in its own environment; it does not grant the root privileges required by this server, its hooks or replacing HOME. This guide stops before system deployment. |
| Already-rooted TV, webOS 9 | Home is supported by the code. Browser engine, inputs and commands still need checking on the actual model. |
| Already-rooted C2 (2022) | Depends on the version reported by the TV: webOS 22 (7.x) and 25 (10.x) are experimental; webOS 24 (9.x) is supported by the code and has been verified on one OLED55C2PUA. Other sizes, firmware and regions remain uncertified. See [C2 compatibility](C2.md). |
| Already-rooted TV, webOS 7 or 10 | Home is offered with experimental status in the 0.130 base. |
| Already-rooted TV, webOS 11 | Home is offered only with `allowExperimentalHome: true`. The adapted profile was used on a C6; that does not certify every webOS 11 model. |
| webOS 5 / system Node 8, including UN7300 | The upstream server may have separate compatibility, but **this public Home is refused** by this version. The persistence bundle requires `fs.rmSync` (Node 14.14+). The Lightkeeper variant observed on this hardware is not delivered here. |

Home's effective rules are in [`supported()`](../glasshouse/server/lib/home.js), the model profile is in [`lib/tv-profile.js`](../glasshouse/server/lib/tv-profile.js), and persistence prerequisites are in [its guide](../personalisation/README.md). Do not infer the webOS version from the retail model name or firmware number. Do not change the compatibility check merely to make a button appear. Port 8080 is used by examples and the documented tunnel; the 0.130 base no longer refuses Home solely because another port is configured. Check the effective configuration before adapting commands.

## Feature and rendering comparison

| Element | Public Glasshouse branch | Hardware evidence and limits |
| --- | --- | --- |
| Carousel, pointer glass, keyboard focus, reduced motion | Included. The synthetic demo uses a scaled 1920×1080 canvas. | C6 adaptation was observed; performance over time and physical pointer behavior still require checking on each target. C2 server/profile checks do not establish every visual or remote behavior. |
| Tiles and captions | App faces 280×157.5; inputs and shortcut 224×126. Captions are hidden while accessible names remain. | The shared styling is intended across targets; Lightkeeper sources are not in this repository. |
| App and console art | Use a native TV app icon when available, otherwise text. Xbox/PlayStation/Switch marks and unnamed-input HDMI connector marks are drawn inline. Private proprietary app logos are not redistributed. | A private screen may look different. Pixel-for-pixel reproduction of private logos is not promised. |
| HDMI | Ports are configurable through `layout.devPorts`; the default empty list keeps every input. No app tile is injected for a specific port. | The list does not discover wiring. The TV with only a Firestick uses a separate Lightkeeper port and must not receive an invented console. See the manual guide's HDMI adaptation notes. |
| Photos / app shortcut | `layout.shortcutAppId` can name an installed app such as Moonlight (`com.limelight.webos`); the server checks its launch point. Existing `photosAppId` remains supported for Immich clients. Glasshouse supplies no photo client, account or server. | A package ID or demo launch does not prove an app is installed on another TV. The C2 Moonlight package was present in the verified TV's app inventory; installing or authenticating third-party apps is separate. |
| All apps | Glasshouse launch-point catalog, including apps hidden from the carousel. Shows a count, TV-order/A–Z toggle accessible from the remote toolbar, and closes by button, Back or click outside. Up from the top grid row focuses the toolbar. It is not a complete list of system packages. | The feature is covered by offline tests. Test the physical remote and pointer on each target before claiming hardware verification. |
| Home Settings and G | Compact gear, native Recommendations toggle, close and launch of `com.tvweb.dashboard` if installed. | Native launch and visual result were confirmed on C6. No private settings were copied into the repository. |
| Recommendations | Per-app accordion, collapsed by default, with no fallback to another provider. Its placeholder stabilizes the dock; no cards are fabricated. Missing TV API is detected at runtime and reported in settings. | Catalog was available on the tested C6. These are not guaranteed resume results or personalized picks; an installed app may publish no cards. API availability can vary by webOS version, including on C2 systems remaining on webOS 22/24. |
| News → Plex | Native `haystack` support only if the TV's webOS 11 exposes that entry and Plex is installed. No mapping is preconfigured. | A physical press was verified on C6. No equivalent News entry is established for UN7300; do not copy a key code between models. |
| Wallpapers and weather | Five synthetic/public landscapes; daily rotation and dark mode 17:00–06:00. Demo weather is synthetic; live weather is off by default. | Clock, time zone, city and coordinates belong to each user; private settings are not included. |
| Startup / HOME | The server and watchdog have startup hooks. Home takeover is a separate explicit action; return to LG and restoration are separate as well. | Wake, cold start and update are different tests. After waking, a News key may still follow LG behavior until the mapping is reapplied. The verified C2 deployment did not enable Home takeover or a startup hook. |

Profile behavior is visible in [`items()` / `TILE.dev`](../glasshouse/server/assets/home.html), [`launchPoints()`](../glasshouse/server/lib/home.js) and [`lib/tv-profile.js`](../glasshouse/server/lib/tv-profile.js). Changing only an example JSON file does not change these presentation choices. The manual guide lists adaptation points and tests to run before deployment. The public customization no longer targets a particular Bell app or set-top box: no HDMI tile is injected into the Apps row. The examples do not preconfigure News/Plex or an Immich client for another TV. No custom PIN is included.

## Installation, fallback and recovery

`server/deploy.sh --no-app` is not a preview: it transfers files and restarts Glasshouse. By default, deployment also adds the server startup hook; `--no-persist` skips that hook. `--no-app` only prevents adding the dashboard tile. Glasshouse Home takeover is separate. An existing configuration is preserved, but that is not a full installation backup.

Returning to LG Home, restoring a key mapping, stopping the watchdog and restoring pre-deployment files are four distinct operations. The [manual guide](MANUAL_GUIDE.md) provides the steps and checks. Do not assume that a dashboard JSON export contains all secrets and files, or that `tvwebctl rollback` has a prior version after a first SSH deployment. Keep full backups outside Git. During update recovery, preserve `.previous` before another update and adapt the customization to the installed version. The in-memory asset cache also means you must check the served page; restarting only the service may be necessary during an approved maintenance window. Do not restore a whole old configuration just to repair the menu.

## Licenses and attribution

Glasshouse code is MIT; Outfit, Manrope and Inter use SIL OFL. TypeScript is Apache-2.0; `@types/node` and `undici-types` are MIT. The Immich SVG is a separate AGPL-3.0 asset with the original source, license and notice. These licenses do not transfer ownership of trademarks. Photo clients remain separate third-party apps.

No new blanket license applies to the five generated wallpapers or the repository as a whole. The server's MIT notice does not grant blanket rights to every image or mark. Preserve Open-Meteo attribution if real weather is enabled; its service terms apply separately. See [detailed provenance](PROVENANCE.md) and [Photos licensing](PHOTOS.md#licensing-and-trademarks).

## Scope of evidence

Demo, types, ES5, configuration, navigation and persistence tests can run without a TV. Clean-clone validation is separate from private real-world use; screenshots, addresses, device identities, settings, backups and personal logs are not redistributed. No software test guarantees that all secrets are absent, every TV is compatible, or every update will work. See [validation and limitations](VALIDATION.md).
