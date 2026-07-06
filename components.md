---
layout: page
permalink: /components/
eyebrow: Reference
title: Components
description: Every component the theme ships, rendered from its include. This page is the visual regression surface for the studio's screenshot checks (prompt 06).
---

Each block below is produced by the same include a project site calls. Color
is wayfinding only — watch where green, blue, orange, and red/amber/green
appear, and where they deliberately do not.

The [map components](/maps/) (cluster + locator) live on their own page — they
pull in vendored Leaflet only when a page opts in.

## Logotype & attribution

The masthead above and the footer below both render the logotype from
`site.studio.logotype` — no image, no hardcoded org name. Three sizes:

<p>{% include logotype.html size="lg" %}</p>
<p>{% include logotype.html %}</p>
<p>{% include logotype.html size="sm" %}</p>

The footer carries the attribution mark: *a &lt;org&gt; | software studio
project* (portal sites suppress the "a … project" framing with
`studio.is_portal: true`).

## Action button — green

Green means *you can do this*.

<p>
  {% include button.html label="Primary action" url="#" %}
  &nbsp;
  {% include button.html label="Ghost action" url="#" variant="ghost" %}
  &nbsp;
  {% include button.html label="Informational" url="#" variant="info" %}
</p>

## Status chip — red / amber / green

Health at a glance. The dot carries the signal; the label stays ink.

<p>
  {% include status-chip.html status="ok" label="healthy" %}
  {% include status-chip.html status="warn" label="degraded" %}
  {% include status-chip.html status="error" label="failing" %}
</p>

Filled variant (white label on the status fill — both pass AA):

<p>
  {% include status-chip.html status="ok" label="live" filled=true %}
  {% include status-chip.html status="warn" label="stale" filled=true %}
  {% include status-chip.html status="error" label="down" filled=true %}
</p>

## Info callout — blue

Blue means *information*.

{% include callout.html label="Note" body="Consuming sites pin the theme to a tagged release — never <code>main</code>. See the design guide for the version-pin rule." %}

## Alert banner — orange

Orange means *alert*. The orange is the accent border only; body text stays
ink for contrast.

{% include alert.html label="Heads up" body="This site is <code>private-published</code>: the source repo is private, the built site is public. Output must carry no repo links or source maps (ADR-0006)." %}

## Project card

Shows a status chip and — when the source repo isn't public — a
*source: private* indicator. Never a repo URL.

<div class="grid grid--3">
  {% for p in site.data.demo_projects %}{% include project-card.html project=p %}{% endfor %}
</div>

## Gnome card

Display name, `gn_*` variable name, level, status, and home repo.

<div class="grid grid--3">
  {% for g in site.data.demo_gnomes %}{% include gnome-card.html gnome=g %}{% endfor %}
</div>

## Feed-item card

<div class="stack">
  {% for i in site.data.demo_feed %}{% include feed-item.html item=i %}{% endfor %}
</div>

## Email signup — neutral region, green submit only

Config-gated (`studio.signup` in the site config): renders nothing unless a
site opts in with a provider `action`. A plain no-JS POST to an external
provider — no pixel, no popup, no cookie. The provider holds the PII; the
studio's repos hold only the aggregate count (platform ADR-0034). The privacy
note is injected by the site and must name Eszett, LLC. Green appears only on
the submit button (action = "you can subscribe"); the region itself is neutral.

{% include signup.html %}

The same include serves other placements by passing a `placement` (attributes
the capture by source) and, later, `upgrade` framing for the content-upgrade
gates (case study / whitepaper, prompts 06/08):

{% include signup.html heading="Get the case study" placement="components-demo" upgrade=true %}

## Typographic scale & elements

# Heading 1
## Heading 2
### Heading 3
#### Heading 4

Body text sets at a comfortable measure. A [green action link](#) does
something; an [informational link](#){:.link-info} is blue. `Inline code`
sits in the mono stack.

> A blockquote uses a hairline rule and de-emphasized ink — structure through
> typography, not color.

| Column | Column | Status |
| ------ | ------ | ------ |
| Alpha  | 1,204  | {% include status-chip.html status="ok" label="ok" %} |
| Beta   | 88     | {% include status-chip.html status="warn" label="watch" %} |

```
$ bin/gn-run --gnome gn_dns_steward --mode dry-run
```
