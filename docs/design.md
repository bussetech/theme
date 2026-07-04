---
layout: page
permalink: /design/
eyebrow: Guide
title: Design guide
description: The rules, the tokens, the logotype, how a site adopts the theme, and how to extend it without breaking wayfinding.
breadcrumbs:
  - title: Reference
    url: /components/
---

This is the design law for every site in the studio, and the adoption manual
for consuming it. It lives inside the theme so the rules and the code never
drift apart. (Rendered at `/design/`; also readable as `docs/design.md`.)

## 1. The aesthetic

Clean developer-docs. Swiss typography discipline: a system-grotesque stack
(`-apple-system, "Helvetica Neue", Arial, sans-serif`), strong hierarchy,
generous whitespace, a visible grid. Near-monochrome base — white/off-white
ground, near-black ink, one gray ramp. Influences: The Economist's restraint;
Ruedi Baur wayfinding; Köln-Bonn Airport signage — bold type as navigation,
colour as signal. **Flair budget: typography and rules, not gradients or
shadows.**

## 2. Colour is wayfinding only

Every colour in the theme is a token, and every colour has a job. There is no
decorative colour.

| Signal | Token family | Job |
| ------ | ------------ | --- |
| Action | `color.action.*` (green) | buttons, links that do something |
| Information | `color.info.*` (blue) | informational links, callouts |
| Alert | `color.alert.*` (orange) | warnings — accent/border/banner only |
| Status | `color.status.*` (red/amber/green) | health chips, badges |

The base — `color.ground`, `color.ink`, the `gray.*` ramp — carries everything
else. **Orange never sets body text** (the brand orange is 2.96:1 on white —
it fails AA). It appears as an accent border, an icon, or a banner wash with
ink text. When orange text is unavoidable, use `color.alert.text` (the
AA-safe tone).

Every text/background pairing the theme uses is asserted against WCAG 2.1 AA
by `scripts/check_contrast.py`, which CI runs on every push. Nineteen pairs,
all ≥ 4.5:1. Adding a colour means adding its pairings to `contrast_checks:`
in the token file — an unverified colour fails the build.

## 3. Tokens

`tokens/design-tokens.yml` is the single source of truth for type scale,
spacing, the gray ramp, the wayfinding colours, borders/radius, layout
measures, and breakpoints. The build script
(`scripts/build-tokens.sh`) generates `_sass/_tokens.scss` — CSS custom
properties (`--color-action-base`) plus Sass aliases (`$color-action-base`).

**Nothing in `_sass/` hardcodes a hex or a measure.** Every value is
`var(--token)`. The generated `_tokens.scss` is committed; CI runs
`build-tokens.sh --check` and fails if it is stale, so the CSS can never
drift from the token source.

To change a value: edit `tokens/design-tokens.yml`, run
`scripts/build-tokens.sh`, commit both the token file and the regenerated
`_sass/_tokens.scss`.

## 4. The logotype

The studio mark is text only — no image logo. Pattern:
`<org> | software studio`. The theme reads the string from
`site.studio.logotype` and renders it with the org name **bold**, a hairline
**pipe**, and the descriptor in **regular** weight, all lowercase. There is no
org name anywhere in the theme source — grep `_layouts _includes _sass assets`
for it and you get zero hits.

- Masthead: `{% raw %}{% include logotype.html size="lg" link="/" %}{% endraw %}`
- Footer attribution: rendered automatically — *a &lt;org&gt; | software
  studio project*. Portal/apex sites set `studio.is_portal: true` to show the
  bare mark instead (the portal is the studio, not a project of it).

Do not restyle the logotype per-site, do not swap the pipe for a slash, and do
not add an icon beside it. It is the one fixed mark across the studio.

## 5. Adopt the theme (≤ 5 lines)

A bare Jekyll site adopts the theme with a pinned `remote_theme` and a
`studio:` config block. Three steps:

**1. Pin the theme in `_config.yml`** — always to a tagged release, never to
`main`:

```yaml
remote_theme: bussetech/theme@v0.1.0
plugins:
  - jekyll-remote-theme
```

**2. Provide the studio contract** (the factory injects this from
`platform.yml`):

```yaml
studio:
  logotype: "bussetech | software studio"   # from platform.yml branding
  visibility: public                        # public | private | private-published
  analytics_beacon: ""                      # DNS steward mints this per host
  is_portal: false
  nav:
    - { title: Home, url: / }
```

**3. Add the remote-theme gem** to the `Gemfile`:

```ruby
gem "jekyll-remote-theme"
```

That's it. The site inherits every layout, component, the discoverability
layer (SEO/OG tags, `sitemap.xml`, `robots.txt`, `feed.xml`, `feed.json`,
canonical URLs), and the analytics beacon — the beacon renders only when
`studio.analytics_beacon` is non-empty.

### Config keys the theme reads

| Key | Purpose |
| --- | ------- |
| `studio.logotype` | the `<org> \| software studio` mark |
| `studio.visibility` | `public` / `private` / `private-published` — drives the leak rule and robots |
| `studio.is_portal` | suppresses the "a … project" footer framing |
| `studio.analytics_beacon` | Cloudflare Web Analytics token; empty = no beacon |
| `studio.nav` | primary nav items (`{title, url}`) |
| `studio.footer_note` | free-text footer line |
| `studio.theme_color` | mobile browser-chrome colour hint |
| `studio.default_image` | default OG/Twitter image |

## 6. Visibility & the leak rule

For a `private-published` site (private source, public output — ADR-0006),
the built HTML must carry **no repo links and no source maps**. The theme
holds to this: no layout or include ever emits a repo URL, and there is no
client-side build that could leak a source map. If you extend the theme, keep
that rule — key anything repo-referential off `studio.visibility`. A `private`
site additionally gets `noindex` and a `Disallow: /` robots file (though a
private site should not be publishing at all).

## 7. Extending without breaking wayfinding

- **New component?** Compose it from existing tokens. Give status meaning
  through the status tokens, actions through action-green, information through
  info-blue. Do not introduce a raw colour.
- **Need a new colour?** That is a wayfinding decision, not a style tweak. Add
  it to `tokens/design-tokens.yml` **with a documented job**, add its
  text/background pairings to `contrast_checks:`, regenerate, and record the
  rationale. An undocumented or unverified colour will not pass review or CI.
- **Never** use a status/alert colour decoratively (no green rule just because
  green looks nice). The moment colour stops meaning something, wayfinding is
  gone.
- Keep JS to progressive enhancement only (the nav toggle is the ceiling).

## 8. Versioning & rollout

The theme is released as semver git tags; consuming sites pin to a tag. See
[`docs/versioning.md`](https://github.com/bussetech/theme/blob/main/docs/versioning.md)
for the release procedure and the canary rollout pattern. The rule that
protects the whole studio: **one bad theme commit must never break every site
at once** — which is why sites pin to a release and roll forward one canary at
a time.
