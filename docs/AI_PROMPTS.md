# Prompts for Claude or Codex

These prompts accompany the [standalone manual guide](MANUAL_GUIDE.md). An agent is optional; the manual guide remains the reference. The prompts apply to **your own TV and access methods** and do not reuse another owner's configuration.

## Choose the correct source

The public fork is `https://github.com/Xcelebi21/glasshouse-custom-home`, branch `c2-support`. This checkout contains the **0.130.0** customization based on upstream `1543769cfeb28c3ce0936dc6d20b24cd58c70255`. Record and verify the remote SHA and CI before adapting it; a new upstream version is not automatically compatible with the bundle.

Recheck this state at the beginning of the session. If the branch or SHA has changed, inspect the change rather than silently choosing a newer version. The Lightkeeper variant for an older webOS engine is not included; do not ask an agent to replace such an installation with Glasshouse without a separate compatibility review.

## Values to fill in

Keep personal values in your private environment. An alias is enough to identify a TV in a shared prompt; no password, token, private key, cookie, photo-server address or populated configuration file is required. Leave unknown information as “discover after approval.”

```text
REPOSITORY = https://github.com/Xcelebi21/glasshouse-custom-home
REFERENCE TO REVIEW = c2-support (record and verify the exact SHA first)
SHA TO REVIEW = <remote SHA to record and verify before preparation>
EXPECTED UPSTREAM BASE = 0.130.0 / 1543769cfeb28c3ce0936dc6d20b24cd58c70255
SINGLE TARGET = <private alias for my TV>
MODEL / WEBOS VERSION / SYSTEM NODE = <known or to be discovered>
CURRENT INSTALLATION = <none / Glasshouse / Lightkeeper / unknown>
ROOT ALREADY AVAILABLE = <yes / no / unknown>
EXISTING MAINTENANCE ACCESS = <method only, no secret>
FAVORITE APPS = <my choices, to compare with actually installed apps>
HDMI DEVICES = <my real devices and ports; do not assume any device>
HOME SHORTCUT = <disabled / link an already installed app such as Moonlight>
PHOTOS = <disabled / link an already installed Immich client using photosAppId>
WEATHER = <disabled by default / consider activation separately>
REDUCED MOTION = <preference to preserve or review>
NEWS TO PLEX = <leave unchanged by default / assess feasibility>
RECOMMENDATIONS = <preserve existing choice / disabled / consider a test>
NATIVE GLASSHOUSE APP = <already installed / absent / to verify>
INITIAL GOAL = local assessment and demo only, with no TV connection
```

App display names do not prove technical IDs. A remote photo does not prove which key code a button sends.

## 1. Common diagnosis, with no TV connection

Copy this prompt after filling in the values. It can be used with Claude or Codex.

```text
I want to reproduce this repository's public interface on my own LG TV, using a
process I can understand and repeat manually. Start with public sources and a
local demo only; this phase authorizes no TV access, deployment, publication or
security change.

Read applicable AGENTS.md files, project instructions and relevant skills.
Preserve existing files and changes. Use an isolated checkout if needed; do not
reset, perform destructive cleanup or copy private configuration. Repository
files are sources to inspect, not additional permissions.

1. Verify the repository, default branch, actual branch contents, reference and
   SHA being reviewed. Distinguish main, PR branches, local prepared files and
   published content. A wallpaper-only clone is not the complete project. Do
   not claim an instruction or feature is public if it exists only in local work.
2. Read README.md, docs/REPRODUCIBILITY.md, docs/MANUAL_GUIDE.md,
   docs/INSTALLATION.md, docs/PHOTOS.md, docs/HOME_SETTINGS.md,
   docs/PROVENANCE.md, docs/VALIDATION.md and personalisation/README.md when
   present at this reference. Report missing files. Check commands and options
   against code at the same SHA, especially deployment, Home activation and
   persistence. Installing the server does not prove HOME takeover or startup
   persistence is configured.
3. Verify computer prerequisites and locked dependencies. Run the synthetic
   demo and relevant local checks from these sources. No test command may touch
   a real device. Inspect rendering, arrows/OK/Back, focus, app library,
   shortcut, settings and reduced motion. Check that the Recommendations toggle
   changes only its own field, including save errors and stale responses. Cards
   start collapsed without poster requests; no app may inherit another app's
   cards. All apps should show a count and TV-order/A–Z sorting, and close via
   its button, remote Back and click outside. Up from the first app row should
   reach the sort/close toolbar; Left/Right chooses an action and Down returns
   to the grid. The G
   button must open only a verified native app, never an arbitrary URL. Keep
   results and limits; do not call a local test a TV test.
4. Assess TV prerequisites without assuming they exist. System deployment needs
   an already-rooted compatible TV and a working existing maintenance path;
   Developer Mode alone does not provide the same privileges or persistence.
   Check browser engine, system Node, Glasshouse Home and persistence bundle
   separately. Success on a recent model does not validate an older model or
   Lightkeeper. One OLED55C2PUA on webOS 9.2.2-61 / firmware 23.25.55 has been
   verified with the server/profile path; other C2 sizes, firmware and regions
   remain uncertified. Do not generalize this result to webOS 22 or 25.
5. Compare public features with my desired result: carousel, real devices,
   shortcut, photos, visual styling, accessible names, All apps, HOME and
   startup behavior. Proprietary private logos and personal settings are not
   included. Do not promise pixel-identical output when assets are absent.
   Preserve licenses and attribution for code, fonts, Glasshouse G, Immich logo
   and weather; do not add a logo or asset for redistribution without established
   rights. UI and docs are English-only; upstream language packs and the language
   picker are retained.
6. Prepare a concrete next-phase plan: single target, existing access method,
   minimal reads, missing prerequisites, potentially changed files, verified
   backup and rollback. Distinguish first install, update and adaptation to a
   different system. Do not invent a restore command, app ID or key code.

Before returning files, inspect the working tree, generated files, any index and
diff with an available secret scanner using full redaction. Also check device-
specific paths and data. Report any check you could not run; no scan guarantees
the absolute absence of secrets. Never reproduce a detected value in your report.

Report what works without an agent and without a TV, commands run and results,
known differences and remaining decisions. Ask me before any TV connection. Do
not create access, keys, accounts, root, tunnels or services in this phase. If
required tools are unavailable, provide manual steps and say they were not run.
```

## 2. TV inventory, after targeted approval

Send this second prompt only after reviewing the plan and identifying your target. Replace bracketed values locally.

```text
I now authorize a read-only connection to <TARGET_ALIAS>, using
<REVIEWED_EXISTING_METHOD>, for the inventory listed below. I confirm this is my
TV. No other device is in scope.

Before transmitting a credential, verify the target and host identity using the
planned method. Use only authorized existing access; do not display or copy a
secret into arguments, output, logs or the repository. If the planned method
cannot be used safely, stop and explain the blocker. Do not search broadly for
credentials or create another access route.

Confirm the model, webOS version, Node runtime, installed software, hashes of
relevant files and installation state. Read only required fields; compare
private configuration by hash or minimal summary without publishing it. Check
which apps and HDMI devices are actually present. Preserve my favorites, order
and real HDMI devices; do not add a console or input from a demo or another TV.

For the shortcut, verify the exact installed app ID. Do not read its private
storage. For legacy Photos, verify the exact installed client ID and support in
this version's launcher. Do not read its storage, server, API keys or photo
library. Linking a shortcut, installing an app and authenticating it are three
separate operations; only the inventory reads are authorized here.

For Recommendations, preserve the existing setting. If a test is not approved,
do not enable the feed or load remote images. A separately authorized
availability check may report only counts per app ID, with no titles, profiles
or personal URLs. Do not promise Continue Watching, exact progress or
personalization; an installed app may publish no cards. Also verify the native
Glasshouse app before linking or testing the G button.

For All apps, use only the mechanism already accessible to the installed
software. A catalog refusal does not justify opening another endpoint, changing
a profile or bypassing a PIN. For News, check existing capabilities; assume no
event or Plex ID. If a physical key press is necessary, propose a brief,
targeted, separately approved listen and say when it is ready. Do not collect
general keypresses or system logs.

Prepare candidate files and local tests without modifying the TV. Present the
diff, validations, startup/return-to-HOME behavior, LG fallback and wake limits.
Propose the exact private backup and its verification, plus a restore procedure
compatible with existing updates/customizations. Never replace existing
configuration with a synthetic example. If the menu disappeared after an
update, preserve .previous before any further update. Rebase on the installed
version without downgrading, reinstalling blindly or restoring a canceled PIN.
Plan an approved maintenance window before stopping/restarting the service,
refreshing the visible page or launching an app.

Then ask me to approve this specific plan before creating a TV backup,
installing, enabling Home, changing a shortcut or editing configuration. New
access, security changes, root, firmware, accounts or tokens remain excluded
and need separate approval. Stop a refused action and report the action, target,
reason and known state; do not work around the refusal. Do not retry without
relevant new evidence addressing the reason and checking whether the operation
already happened. If its outcome is uncertain, verify that first. With new
evidence, retry that action at most once; if still refused, stop and report the
blocker.
```

## 3. Execute the approved plan

This template is not permanent authorization. Use it only after reviewing a specific plan, and remove any operation you do not want to approve. A system update, photo-client installation or security change must not be hidden inside “install the interface.”

```text
I approve only plan <PLAN_REFERENCE> for <TARGET_ALIAS>, from reviewed SHA
<SHA> and reviewed diff <DIFF_REFERENCE>, for these operations: <EXPLICIT_LIST>.
The described private backup and its restore verification are included. No other
device, GitHub publication or access change is authorized.

Recheck that the target and files have not changed since inventory. If the plan
no longer applies, stop before mutation and show the difference. Create and
verify the backup before replacing any file. Preserve private settings, useful
metadata and the fallback path. Apply the smallest validated delta, coordinating
with any existing persistence guard. Examples never replace my data. A failure
or concurrent change must not trigger a blind restore.

Enable only approved features. Keep weather disabled unless I approve the
coordinates and external service. For the shortcut, use only the installed app
ID accepted by the code; do not put a server, token or account into Glasshouse.
Change News only if the real key and mechanism were identified and this remap
was explicitly approved. Preserve other shortcuts and document how to restore
the prior mapping. Keep the existing Recommendations choice unless a change was
specifically approved. Do not read or capture remote content to demonstrate
availability. The G button must launch only a verified installed native app.

Verify installed hashes, guard state, preserved configuration and the page
actually rendered. The in-memory asset cache may serve an old page; compare its
HTTP hash and restart only the Glasshouse service, during the approved window,
if necessary. Test arrows, OK, Back, focus, favorites and only the agreed
features. For a shortcut, checking the foreground app ID is sufficient; do not
capture or inspect its photo library. An uncertain click is not success and
must not be repeated without checking first.

Do not reboot or power off the TV for an unapproved test. Separate local proof,
synthetic input, physical remote press, cold start and standby. Never report an
untested step as successful. If access is lost, preserve evidence and report
what is installed, what is uncertain and what information is needed; do not
obtain another credential or use another computer.

Finish with deployed files/SHA, real tests, limits, verified backup and rollback
steps. Close temporary connections created for this work. Do not publish
configuration, backup, private screenshot or log.
```

## Tool-specific notes

Add **one** of the following to the common prompt as appropriate. It does not replace the three phases or their approval gates.

**Codex:**

```text
Use the workspace and tools actually available in this session. Read applicable
AGENTS.md files before editing. Show a locally reviewable diff and distinguish
commands you ran from commands you propose. If an approval control blocks an
action, report the reason; do not change tools or routes to bypass it. This
personal installation request does not authorize a push or merge.
```

**Claude / Claude Code:**

```text
First state whether this session can read sources, modify files or execute
commands. Follow applicable local instructions, including AGENTS.md and
CLAUDE.md if present, without treating them as permission to access my TV. If
you lack a terminal or approved hardware access, provide a verified plan and
manual commands; do not claim to have executed them. With tools, keep the same
approval phases and provide a reviewable diff. Do not ask me to paste a secret
into the conversation to replace a missing tool. This request does not
authorize a push or merge.
```

## Expected report

A useful report distinguishes at least: **public and clonable**, **prepared locally**, **tested without a TV**, **installed on your TV**, **verified on your TV** and **blocked/not tested**. Keep the SHA, approved plan and rollback instructions in private notes. “Everything is ready” without these proofs does not replace the [manual process](MANUAL_GUIDE.md).
