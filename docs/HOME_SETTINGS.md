# Home settings and recommendations

The small gear to the right of **All apps** opens Home Settings. It has a visible focus and a pointer target sized for the remote. From All apps, press Right to reach the gear and OK to open the panel. Arrow keys and Tab move among its controls. Back/Escape or **Close** closes the panel and restores focus. Tiles behind the panel cannot be activated.

## Recommendations

The toggle updates `home.json.recommended` without writing favorites, order, the shortcut app or other preferences. If the server does not confirm a save, Home reports the error and reloads the saved state; it does not retry automatically. The view respects the existing choice. The public example and offline demo start with recommendations disabled.

The native Glasshouse feature, added in 0.129 and present in 0.130, reads cards that apps publish for LG Home. These are **app-provided suggestions**, not a guaranteed Continue Watching list or personalized catalog. Home does not invent progress percentages or playback positions. When opened, poster images come from the apps' servers and are not redistributed in this repository. This module requires no additional account or token.

In the Apps row, the accordion stays collapsed until Down or a click. It displays only cards whose app ID matches the currently selected app, with the source identified. An app with no cards never receives another app's recommendations, including after a delayed network response. The collapsed area keeps its height so the carousel does not shift. Up, Back, leaving the row or returning Home collapses the cards. Left/Right moves through an open list; OK uses the app's native launch mechanism for the published title. The app decides what it actually opens.

Upstream documents Netflix, Prime Video, Disney+, HBO Max and YouTube on webOS 10. Availability varies by TV, region, profile and app. Having Plex, Bell, ICI TOU.TV or Crave installed does not prove that it publishes cards. The module keeps at most twelve cards per app and refreshes the catalog, including on return to Home and periodically; this is not real-time playback tracking. Some webOS versions provide no cards. Availability is checked at runtime: if the TV does not expose the API, Home Settings reports that recommendations are unavailable. An empty list from a TV that does expose the API does not show that warning.

Sources: [0.129 release](https://github.com/rorygallagher2024/glasshouse/releases/tag/v0.129.0), [0.130 module](https://github.com/rorygallagher2024/glasshouse/blob/v0.130.0/server/lib/home-recommended.js), [Home documentation](https://github.com/rorygallagher2024/glasshouse/blob/v0.130.0/docs/dashboard/home.md).

## All apps drawer

The drawer lists the installed apps exposed by Glasshouse, including apps not shown in the Home carousel. It shows the total app count and has a toggle between TV order and alphabetical A–Z order. Use the directional keys to move through the grid; Page Up and Page Down jump by several rows where the remote sends those keys. OK opens the selected app.

Close the drawer with its **Back to the carousel** button, the remote Back key or a click outside the panel. From the top app row, Up moves focus to the toolbar; use Left/Right to choose A–Z/TV order or Close, OK to activate it, and Down to return to the grid. Closing restores the prior carousel row and selected tile. The drawer does not uninstall apps or change favorites. Its catalog is limited to the launch points Glasshouse provides and is not a complete list of every system package.

## G button — open Glasshouse

The Glasshouse G icon next to Close launches the native dashboard app, `com.tvweb.dashboard`, through the existing app-launch mechanism. It does not open a browser URL or change settings. Its accessible name is **Open Glasshouse**. Repeat launches are blocked while a launch is pending; a refusal displays an error.

Verify that this app ID appears in the TV's actual launch-point catalog before relying on the shortcut. An installation using `deploy.sh --no-app` does not install the dashboard app; the button cannot install it. Installing the app with `deploy.sh --app` is a separate choice and is described in the [manual guide](MANUAL_GUIDE.md). The demo simulates its launch. Back cannot cancel a native launch already sent.

The icon reuses Glasshouse's `assets/favicon.svg`, under the upstream MIT license retained in the repository. It is separate from the Immich logo, which has its own AGPL-3.0 license. These settings add no private service logos, PIN, photo account or personal configuration.
