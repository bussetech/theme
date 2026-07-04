# Changelog

All notable changes to the studio theme. The format follows
[Keep a Changelog](https://keepachangelog.com/); this project adheres to
[semver](docs/versioning.md). Consuming sites pin to a tagged release.

## [Unreleased]

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

[Unreleased]: https://github.com/bussetech/theme/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/bussetech/theme/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/bussetech/theme/releases/tag/v0.1.0
