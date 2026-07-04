# CLAUDE.md — theme (studio design system)

This repo is the **shared visual system** for the Bussetech Software Studio.
Every studio site — the portal and every project — consumes it as a Jekyll
`remote_theme`, pinned to a tagged release. A fix here propagates to all of
them, which is exactly why the rules below are strict.

## Read first

1. `docs/design.md` — the design law: aesthetic, the wayfinding colour system,
   tokens, the logotype, ≤5-line adoption, and how to extend without breaking
   wayfinding. **Read it before changing anything visual.**
2. `docs/versioning.md` — semver + the release/canary procedure. Consuming
   sites pin to tags; never expect them to track `main`.
3. `tokens/design-tokens.yml` — the single source of truth for every colour
   and measure.

## The one rule that matters most

**Colour is wayfinding only.** green = action, blue = information, orange =
alert, red/amber/green = status. Never decorative. Every colour is a token in
`tokens/design-tokens.yml`; nothing in `_sass/` hardcodes a hex or a measure.
Adding a colour is a wayfinding decision — give it a job, add its
text/background pairings to `contrast_checks:`, regenerate, and expect CI to
prove AA.

## Working rules

- Change a token → run `scripts/build-tokens.sh` → commit **both**
  `tokens/design-tokens.yml` and the regenerated `_sass/_tokens.scss`. CI runs
  `build-tokens.sh --check` and fails on a stale stylesheet.
- The logotype renders from `site.studio.logotype` — **never** hardcode the org
  name. `grep -rn <org> _layouts _includes _sass assets` must return zero hits.
- Keep JS to progressive enhancement (the nav toggle is the ceiling). No CSS
  frameworks; hand-rolled Sass only.
- `private-published` leak rule (ADR-0006 in the platform repo): no layout or
  include may emit a repo URL or ship a source map. Key anything
  repo-referential off `studio.visibility`.
- Conventional commits, atomic. Release = a semver tag (`docs/versioning.md`).
  Roll out through a canary; never bump every consuming site at once.

## What ships vs. what doesn't

`remote_theme` propagates only `_layouts/`, `_includes/`, `_sass/`, and
`assets/` (the discoverability files — sitemap/robots/feeds — live under
`assets/` with `permalink` front matter so they reach consuming sites' roots).
Everything else here — `_config.yml`, `_data/`, `_posts/`, `*.md` demo pages,
`docs/`, `tokens/`, `scripts/` — builds this repo's own demo/docs site and is
**not** delivered to consumers.

## Detach procedure (repo portability)

This repo is a self-contained Jekyll theme with no inbound studio bindings — it
builds on its own (`bundle install && bundle exec jekyll build`). To detach:

1. It already stands alone; nothing to unwire. `remote_theme` consumers simply
   point at wherever the repo now lives.
2. The demo site's `_config.yml` `studio:` block carries this repo's own
   branding for the demo only — update it if the studio identity changes. The
   theme source itself contains no org/domain literals, so no code changes are
   needed to rebrand: consuming sites pass their own `studio.logotype`.
3. Consuming sites reference this repo as `<owner>/theme@vX.Y.Z`; re-point that
   string if the owner/org changes.
4. CI's `site` job calls the studio's reusable site CI
   (`bussetech/platform/.github/workflows/reusable-site-ci.yml@v1`), guarded by
   `if: github.repository_owner == 'bussetech'`. Outside the org that job
   **skips and stays green** — the theme-specific `checks` job (palette + token
   freshness) is self-contained and still runs. To fully re-home CI, replace the
   `site` job with a local Jekyll build. This is the theme's only build-time
   studio binding beyond its `platform.yml` registration.
