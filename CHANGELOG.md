# Changelog

All notable changes to the studio theme. The format follows
[Keep a Changelog](https://keepachangelog.com/); this project adheres to
[semver](docs/versioning.md). Consuming sites pin to a tagged release.

## [Unreleased]

## [0.4.0] — 2026-07-05

### Added

- **Map components** (EPIC2-06, ADR-0027): a static-friendly map layer for the
  info/OSINT archetype, as progressive enhancement over a data table.
  - `map-cluster` — a full-dataset clustered map that fetches a same-origin
    pre-rendered GeoJSON `FeatureCollection` and builds filter-facet controls
    from named feature properties (e.g. `status,operator,state`).
  - `map-locator` — a single-point map for a record/detail page; renders
    nothing when no `lat`/`lon` is supplied.
  - `map-legend` — the status colour key.
  - Markers are status-coloured from the existing status tokens (r/y/g); the
    earliest stage is neutral and a terminal/`cancelled` stage is a hollow,
    dimmed ring (visible, not deleted — GD-0004). No new colour tokens.
  - **Vendored, pinned** Leaflet 1.9.4 + Leaflet.markercluster 1.5.3 under
    `assets/vendor/leaflet/` with a checksum manifest (`VENDOR.md`) enforced by
    `scripts/check-vendor.sh` in CI — no CDN hotlink (supply-chain rule).
  - Assets load **only** on pages with `map: true` front-matter, gated by the
    new `map-head`/`map-scripts` includes; table-only pages load none of it.
  - Basemap: OpenStreetMap raster tiles (keyless, attributed) — the single
    permitted external request. Demo: `/maps/`.
  Backward-compatible: existing sites that set no `map:` flag are unaffected.

## [0.3.0] — 2026-07-05

### Added

- **Footer copyright**: the footer renders `site.studio.legal.copyright` when
  present — the studio's legal identity from the control repo's `platform.yml`
  (`branding.legal.copyright`), injected per site by the factory. Sites that
  supply no `legal.copyright` omit the line, so the change is backward
  compatible (EPIC2-01). No hardcoded entity in theme source; the demo
  `_config.yml` carries a sample value for the visual-regression surface.

## [0.2.0] — 2026-07-04

### Added

- **Gnome card**: optional `purpose` (one-line description) and `deployments`
  (list of repos the gnome works in) fields, both rendered only when present.
  Requested by the portal's gnome directory (EPIC1-07); backward-compatible.

## [0.1.0] — 2026-07-04

First release — the shared visual system for the Bussetech Software Studio.

### Added

- **Design tokens** (`tokens/design-tokens.yml`): type scale, spacing, gray
  ramp, wayfinding colours, borders, layout measures, breakpoints. Build
  script (`scripts/build-tokens.sh`) generates `_sass/_tokens.scss` (CSS
  custom properties + Sass aliases); CI enforces freshness.
- **WCAG AA proof**: `scripts/check_contrast.py` asserts 19 text/background
  pairings ≥ 4.5:1 on every push.
- **Layouts**: `default`, `home`, `page`, `post`, `data-explorer` (stub).
- **Includes / components**: config-driven logotype + footer attribution,
  status chip (r/y/g), action/info/ghost button, alert banner (orange), info
  callout (blue), project card (with visibility indicator), gnome card,
  feed-item card, breadcrumb/wayfinding header, header, footer, head.
- **Discoverability**: hand-rolled SEO/OG/Twitter meta, canonical URLs,
  `sitemap.xml`, `robots.txt`, RSS (`feed.xml`), JSON Feed (`feed.json`) —
  all propagated through the theme's `assets/` so consuming sites inherit
  them with no per-site file.
- **Cloudflare Web Analytics** beacon include — renders only when
  `studio.analytics_beacon` is set; cookieless, off by default.
- **Visibility leak rule** (ADR-0006): `private` sites get `noindex` +
  `Disallow: /`; no layout emits repo links or source maps.
- **Demo/docs site**: `/`, `/components/`, `/wayfinding/`, `/data/`,
  `/design/` — the visual regression surface for prompt 06.
- **Docs**: `docs/design.md` (rules, tokens, logotype, ≤5-line adoption,
  extend-without-breaking), `docs/versioning.md` (semver + canary rollout).
- **CI**: build the demo site, run contrast + token-freshness checks, fail on
  Sass/build errors. Third-party Actions pinned to commit SHAs.

[Unreleased]: https://github.com/bussetech/theme/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/bussetech/theme/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/bussetech/theme/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/bussetech/theme/releases/tag/v0.1.0
