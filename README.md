# theme — the studio's shared design system

One Jekyll theme, consumed as a `remote_theme`, so a design fix propagates to
every site in the **Bussetech Software Studio** at once. Portal and project
sites alike inherit its layouts, components, wayfinding, and discoverability
layer.

- **Design law & adoption:** [`docs/design.md`](docs/design.md) (rendered at
  `/design/`) — the rules, the tokens, the logotype, the ≤5-line adoption, and
  how to extend without breaking wayfinding.
- **Versioning & rollout:** [`docs/versioning.md`](docs/versioning.md) — semver
  tags, the release procedure, and the canary rollout that keeps one bad commit
  from breaking every site.
- **Demo / visual regression surface:** the built site — `/`, `/components/`,
  `/wayfinding/`, `/data/`, `/design/`.

## The idea in three sentences

Clean developer-docs aesthetic, Swiss typography, near-monochrome ground.
**Colour is wayfinding only** — green = action, blue = information, orange =
alert, red/amber/green = status; never decoration. Every colour is a token,
every text/background pair is proven against WCAG AA in CI.

## Adopt it (≤ 5 lines)

```yaml
# _config.yml
remote_theme: bussetech/theme@v0.1.0   # always pin a tag, never main
plugins:
  - jekyll-remote-theme
studio:
  logotype: "bussetech | software studio"   # from platform.yml branding
  visibility: public
```

Full key reference and the leak rule for `private-published` sites are in the
[design guide](docs/design.md).

## Tokens are the single source of truth

`tokens/design-tokens.yml` → `scripts/build-tokens.sh` → `_sass/_tokens.scss`
(CSS custom properties + Sass aliases). Nothing in `_sass/` hardcodes a colour
or measure. Regenerate and commit after any token change:

```sh
scripts/build-tokens.sh          # validate palette + regenerate CSS
scripts/build-tokens.sh --check  # CI mode: fail if CSS is stale
```

## Develop

```sh
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

CI (`.github/workflows/ci.yml`) builds the demo site, runs the WCAG-AA
contrast check and the token-freshness check, and fails on any Sass/build
error.

## Detach

This repo is a standalone Jekyll theme — it builds on its own with no studio
bindings. See [`CLAUDE.md`](CLAUDE.md) for the detach procedure.

Registered in the studio as `bussetech/theme` (public — required so private
repos can consume it via `remote_theme`). Licensed MIT.
