# Theme versioning & rollout

This is the procedure that protects the whole studio from a single bad theme
commit. Every consuming site pins to a **tagged release**, never to `main`.

## Why pinning is non-negotiable

`remote_theme: bussetech/theme` (no tag) resolves to the tip of `main` at each
site's build time. One broken commit would then break *every* site the next
time it builds. Pinning to a tag (`bussetech/theme@v1.2.3`) makes theme
upgrades an explicit, staged act — never an accident.

## Semver

- **MAJOR** — a breaking change: a removed/renamed layout, include, or config
  key; a wayfinding-semantic change (e.g. repurposing a colour); markup that
  breaks a consuming site's overrides.
- **MINOR** — a backward-compatible addition: a new component, layout, token,
  or config key that existing sites can ignore.
- **PATCH** — a fix that changes nothing about the contract: a colour tuned for
  contrast, a spacing bug, a Liquid fix.

Tokens are part of the contract: retuning an existing colour for AA is a
PATCH; adding a colour is a MINOR; changing what a colour *means* is a MAJOR.

## Release procedure

1. Land the change on `main` (green CI: build + contrast + token freshness).
2. Update `CHANGELOG.md` — move items from *Unreleased* under the new version
   with the date.
3. Tag and push:

   ```sh
   git tag -a v1.2.3 -m "theme v1.2.3"
   git push origin v1.2.3
   ```

4. Cut a GitHub release from the tag, pasting the changelog section.

Tags are immutable — never move or delete a published tag. A mistake in a
release is fixed by a new release, so no site that pinned the bad tag is
surprised by a moving target.

## The release train (one-dispatch releases)

The stamp→tag→canary→fanout procedure below can run as ONE sysop dispatch:
`theme-release-train` in the control repo (platform ADR-0037,
`docs/theme-release-train.md` there). STEERCO-authorized for theme
FEATURE releases only; the feature PR's review/merge stays human. The
manual procedure remains valid — the train is a faster spelling of the
same receipts.

## Canary rollout

Never bump every site at once — that would defeat the point of pinning.

1. **Canary.** Bump the pin (`@vNEW`) in exactly one low-stakes site first —
   the theme's own demo site, or a designated canary project. Let it build and
   eye the components/wayfinding pages (the visual-regression surface,
   prompt 06).
2. **Soak.** Give it a beat. If the canary is healthy, proceed.
3. **Fan out.** Bump the remaining sites — ideally in a batch the factory
   (prompt 08) drives, so the pin lives in one templated place per repo.

The factory template and prompt 08 inherit this rule: new repos are stamped
with a pinned `remote_theme` and roll forward through the canary, never
straight to `main`.

## Rollback

Because sites pin, "rollback" is just re-pinning the previous tag
(`@vOLD`) and rebuilding — no coordination, no scramble. Keep the previous
release working; that is the safety net.
