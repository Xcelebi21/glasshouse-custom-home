/*
 * lib/tv-profile.js - which TV this is, and what its webOS allows
 *
 * Glasshouse Home has been tried on webOS 7, 9, 10 and, behind a setting, 11.
 * The rules that say what a version allows live here, once, so a dashboard, a
 * log line and a test all read the same answer. Nothing here touches the TV:
 * callers pass the model and the version they already read.
 *
 * Model names are LG's: OLED42C24LA, OLED55C25LB, OLED65C4PSA. Only the C2
 * and C6 families are named; every other set is '' and supported the same
 * way, as before.
 *
 * Strict ES5: runs on node 0.12.
 */

// OLED + size + C2: the 2022 C2 family, including later refreshes such as the
// OLED55C25LB, which reports webOS 10.3 rather than the 7.x it shipped with.
var C2 = /^OLED\d{2}C2/;
// OLED + size + C6: the 2026 C6 family, the set this fork's Home was first
// rendered on (webOS 11.2).
var C6 = /^OLED\d{2}C6/;

function familyOf(model) {
  if (C2.test(model)) return 'c2';
  if (C6.test(model)) return 'c6';
  return '';
}

/*
 * What Home may do on a reported webOS major:
 *   7   offered, experimental (tried on a 65UQ801C0SB, 7.6.0)
 *   9   offered
 *   10  offered, experimental (tried on a G5, 10.3.1)
 *   11  offered only with allowExperimentalHome (tried on a C6, 11.2)
 * Every other version is not offered.
 */
function homeSupport(major, allowExperimental) {
  if (major === 9) return { ok: true, tier: 'supported' };
  if (major === 7) return { ok: true, tier: 'experimental' };
  if (major === 10) return { ok: true, tier: 'experimental' };
  if (major === 11) {
    return allowExperimental ? { ok: true, tier: 'experimental' } : { ok: false, tier: 'gated' };
  }
  return { ok: false, tier: 'unsupported' };
}

/*
 * opts: { model, webosVersion, allowExperimental }
 * Returns the model as read, its family, the reported and marketing versions,
 * and what Home may do. LG names webOS by year from 7 on: the reported major
 * plus 15 is webOS 22, 24, 25 and so on.
 */
function detect(opts) {
  opts = opts || {};
  var webos = String(opts.webosVersion || '').trim();
  var model = typeof opts.model === 'string' ? opts.model.trim().toUpperCase() : '';
  var major = parseInt(webos, 10) || 0;
  return {
    model: model,
    family: familyOf(model),
    webos: webos,
    major: major,
    marketing: major >= 7 ? 'webOS ' + (major + 15) : '',
    home: homeSupport(major, opts.allowExperimental === true),
    // Both read by lib/home.js; kept together so a C2 cannot pick one rule up
    // and not the other.
    hideLgHomeAtStart: major === 9,
    blockFirst: major >= 10
  };
}

module.exports = {
  detect: detect,
  homeSupport: homeSupport,
  familyOf: familyOf
};
