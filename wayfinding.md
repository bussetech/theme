---
layout: page
permalink: /wayfinding/
eyebrow: System
title: Wayfinding
description: How color signals meaning in the studio. Every hue is a token and every hue is a signal — never decoration.
breadcrumbs:
  - title: Reference
    url: /components/
---

The breadcrumb above is the wayfinding header — bold type as navigation, a
hairline separator, the current page in ink. It emits from `page.breadcrumbs`.

## The colour legend

| Signal | Colour | Means | Where it appears |
| ------ | ------ | ----- | ---------------- |
| Action | green  | something you can do | buttons, action links |
| Information | blue | context, notes | info links, callouts, breadcrumb links |
| Alert | orange | warning | banner accent, private-source indicator |
| Status | red / amber / green | health | chips, badges |

Everything else is near-monochrome: one white ground, one near-black ink, one
gray ramp. If a page needs emphasis and it isn't one of the four signals
above, reach for **type and rules**, not colour.

## Swatches

<div class="grid grid--3">
  <div class="card">
    <p class="eyebrow">Action</p>
    <p>{% include button.html label="Green action" %}</p>
    <p class="card__desc">Buttons and links that perform an action.</p>
  </div>
  <div class="card">
    <p class="eyebrow">Information</p>
    <p>{% include button.html label="Blue info" variant="info" %}</p>
    <p class="card__desc">Informational links and callouts.</p>
  </div>
  <div class="card">
    <p class="eyebrow">Status</p>
    <p>
      {% include status-chip.html status="ok" label="ok" %}
      {% include status-chip.html status="warn" label="warn" %}
      {% include status-chip.html status="error" label="down" %}
    </p>
    <p class="card__desc">Red / amber / green health signals.</p>
  </div>
</div>

{% include alert.html label="Wayfinding discipline" body="Adding a new colour is a wayfinding change, not a style change. Extend the token file and give the colour a job — never introduce a hue for decoration. See the design guide." %}

See the [data explorer](/data/) for a layout that browses a text-based data
store.
