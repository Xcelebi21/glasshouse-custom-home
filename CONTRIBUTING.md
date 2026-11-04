# Contributing

Start with the local demo and the [README development checks](README.md#development). Open an issue with the Glasshouse version, TV model, webOS version, checkout SHA and reproducible steps. Do not include secrets, real configuration, unredacted logs or personal photos.

Keep changes focused. Home changes should preserve keyboard and remote navigation, reduced-motion support, and operation when recommendations are unavailable or no shortcut app is configured. Update relevant tests. If the persistence bundle changes, regenerate it with `node personalisation/generate.js`, then run `sh scripts/validate.sh`. Document the compatibility actually tested and its limits; a green CI run does not certify another device.

Preserve asset licenses and notices. New logos, images and dependencies need documented provenance and redistribution terms. Examples never need private data.
