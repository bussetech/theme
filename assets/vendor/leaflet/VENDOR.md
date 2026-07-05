# Vendored map libraries

Third-party map code, vendored and pinned per **ADR-0027** and the frontend
supply-chain rule (platform `docs/security.md` threat 2). These files are **not**
hotlinked from a CDN — they are committed, checksummed, and verified in CI
(`scripts/check-vendor.sh`). Bumping a version is an explicit, human-reviewed
commit that updates both the files and this manifest.

## Provenance

| library | version | upstream (fetched over TLS) | tarball sha256 |
| ------- | ------- | --------------------------- | -------------- |
| Leaflet | 1.9.4 | `https://registry.npmjs.org/leaflet/-/leaflet-1.9.4.tgz` | `84c65a256e50657896f54c33bd857b6849ebe94c817803be818bf32a3dde0b77` |
| Leaflet.markercluster | 1.5.3 | `https://registry.npmjs.org/leaflet.markercluster/-/leaflet.markercluster-1.5.3.tgz` | `fc6b0b1d00b6c708ae54e43ee4a11ac345e41660e19f0a570190bb35babb1a1c` |

Both are MIT-licensed. Only the `dist/` files needed at runtime are vendored;
`*.js.map` sourcemaps and unminified `*-src.js` are intentionally omitted, and
the `//# sourceMappingURL=` trailer is stripped from each text file so the
assets are self-contained (no `.map` fetch, honoring the studio no-sourcemap
posture). Marker/layer PNGs stay in `images/` next to `leaflet.css` because
Leaflet auto-detects that path.

## Checksums (verified by `scripts/check-vendor.sh`)

| file | bytes | sha256 |
| ---- | ----- | ------ |
| `MarkerCluster.Default.css` | 1288 | `a594b9d8923476cec61b58faf31cb29102dc30ffd86ad77e5a3f45213a73726d` |
| `MarkerCluster.css` | 872 | `614dea0a98ff3f4ead74f04918f6b1d1b9ba435c25b5fc23b21a394d1e3e4d87` |
| `images/layers-2x.png` | 1259 | `066daca850d8ffbef007af00b06eac0015728dee279c51f3cb6c716df7c42edf` |
| `images/layers.png` | 696 | `1dbbe9d028e292f36fcba8f8b3a28d5e8932754fc2215b9ac69e4cdecf5107c6` |
| `images/marker-icon-2x.png` | 2464 | `00179c4c1ee830d3a108412ae0d294f55776cfeb085c60129a39aa6fc4ae2528` |
| `images/marker-icon.png` | 1466 | `574c3a5cca85f4114085b6841596d62f00d7c892c7b03f28cbfa301deb1dc437` |
| `images/marker-shadow.png` | 618 | `264f5c640339f042dd729062cfc04c17f8ea0f29882b538e3848ed8f10edb4da` |
| `leaflet.css` | 14805 | `2b544030b117dedfc49b2b436d44c2374594757b2ff71165889aadfecdc83d79` |
| `leaflet.js` | 147517 | `dc71f8a6880bc3ca1bd9fa8dc5f1af48c702dc510b0a78240a07c5feed7ce935` |
| `leaflet.markercluster.js` | 34087 | `b1ef34ccee0fb36d856ff4719c759046a0e14293dbbf9d531d969735481168bc` |
