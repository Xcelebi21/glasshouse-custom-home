/**
 * test/test-home-c2.js - an LG C2 (2022) as a target: the profile its model
 * and webOS version give it, the HDMI ports its Inputs row keeps, and the
 * public build leaving out the owner's own Bell tile.
 *
 * Strict ES5 - node v0.12.2 on webOS 4 (LG OLED B8) has no ES6 support.
 */
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var profile = require('../server/lib/tv-profile');
var home = require('../server/lib/home');

console.log('Running test-home-c2.js ...');

// LG's model names, and the version the TV reports after its own updates.
var c2 = profile.detect({ model: 'OLED42C24LA', webosVersion: '9.2.2' });
assert.strictEqual(c2.family, 'c2');
assert.strictEqual(c2.webos, '9.2.2');
assert.strictEqual(c2.marketing, 'webOS 24');
assert.strictEqual(c2.home.ok, true);
assert.strictEqual(c2.home.tier, 'supported', 'webOS 9 is supported, as on the C2s in the tested table');
assert.strictEqual(c2.hideLgHomeAtStart, true);
assert.strictEqual(c2.blockFirst, false);
console.log('  ok C2 on webOS 9.2 is supported, and can hide LG\'s Home at start');

// A C2 that never left webOS 22 (7.x) is offered as experimental.
var stock = profile.detect({ model: 'OLED55C25LB', webosVersion: '7.4.0' });
assert.strictEqual(stock.family, 'c2');
assert.strictEqual(stock.webos, '7.4.0');
assert.strictEqual(stock.marketing, 'webOS 22');
assert.strictEqual(stock.home.ok, true);
assert.strictEqual(stock.home.tier, 'experimental');
assert.strictEqual(stock.hideLgHomeAtStart, false);
assert.strictEqual(stock.blockFirst, false);
console.log('  ok C2 on webOS 22 is offered as experimental');

// A C2 updated to webOS 25 (10.x) has the Flutter Home the takeover handles.
var updated = profile.detect({ model: 'oled65c24la', webosVersion: '10.3.1' });
assert.strictEqual(updated.model, 'OLED65C24LA', 'model names are compared in upper case');
assert.strictEqual(updated.family, 'c2');
assert.strictEqual(updated.marketing, 'webOS 25');
assert.strictEqual(updated.home.ok, true);
assert.strictEqual(updated.home.tier, 'experimental');
assert.strictEqual(updated.blockFirst, true);
console.log('  ok C2 updated to webOS 25 is offered as experimental, and blocks first');

// webOS 11 stays behind allowExperimentalHome, as on the C6 this fork came from.
assert.strictEqual(profile.detect({ model: 'OLED55C61LA', webosVersion: '11.2.0' }).home.tier, 'gated');
var c6 = profile.detect({ model: 'OLED55C61LA', webosVersion: '11.2.0', allowExperimental: true });
assert.strictEqual(c6.family, 'c6');
assert.strictEqual(c6.marketing, 'webOS 26');
assert.strictEqual(c6.home.ok, true);
assert.strictEqual(c6.home.tier, 'experimental');
console.log('  ok webOS 11 needs the setting, and is named webOS 26');

// Anything else is not offered, and the version is not named by year.
assert.strictEqual(profile.detect({ model: 'OLED65B8SLC', webosVersion: '4.4.0' }).home.tier, 'unsupported');
assert.strictEqual(profile.detect({ model: 'OLED65B8SLC', webosVersion: '4.4.0' }).marketing, '');
assert.strictEqual(profile.detect({}).home.tier, 'unsupported');
console.log('  ok unsupported and unknown versions stay unoffered');

// Ports: numbers 1 to 4, each once, lowest first; anything else is dropped.
assert.deepStrictEqual(home.normalise({ devPorts: [3, 1] }).devPorts, [1, 3]);
assert.deepStrictEqual(home.normalise({ devPorts: [2, 2, 5, '1', 0] }).devPorts, [1, 2]);
assert.deepStrictEqual(home.normalise({ devPorts: [] }).devPorts, [], 'no ports means every input');
assert.deepStrictEqual(home.normalise({ devPorts: 'hdmi1' }).devPorts, []);
assert.deepStrictEqual(home.normalise({}).devPorts, [], 'a layout from before the setting keeps every input');
assert.deepStrictEqual(home.layout().devPorts, [], 'the shipped default is every input, not this set\'s two ports');
console.log('  ok devPorts keeps valid ports only, and defaults to every input');

// The view reads the setting, and the owner's Bell tile is not in the public
// build: its HDMI 4 shortcut was this set's, not every C2's.
var html = fs.readFileSync(path.join(__dirname, '../server/assets/home.html'), 'utf8');
var homeJs = fs.readFileSync(path.join(__dirname, '../server/lib/home.js'), 'utf8');
assert.ok(/layout\.devPorts/.test(html), 'the view reads the port list');
assert.ok(!/it\.port !== 1 && it\.port !== 3/.test(html), 'the fixed two-port filter is gone');
assert.ok(!/Bell Fibe/.test(homeJs), 'no owner-specific tile in the public Home');
assert.ok(!/com\.bell/.test(homeJs), 'no owner-specific app id in the public Home');
console.log('  ok view uses the port list, and the public build has no Bell tile');

console.log('Home C2 profile, ports and public-build tests passed.');
