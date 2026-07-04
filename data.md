---
layout: data-explorer
permalink: /data/
eyebrow: Layout
title: Data Explorer
description: A stub layout for project sites that browse a text-based data store. Filter form is progressive enhancement — it works as a plain GET form with no JavaScript.
filterable: true
breadcrumbs:
  - title: System
    url: /wayfinding/
columns:
  - { key: repo, label: Repo }
  - { key: subdomain, label: Subdomain }
  - { key: status, label: Status }
rows:
  - { repo: dc, subdomain: dc.example.com, status: live }
  - { repo: twilio-demo, subdomain: twilio-demo.example.com, status: live }
  - { repo: www, subdomain: "@ (apex)", status: planned }
---
