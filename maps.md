---
layout: page
permalink: /maps/
map: true
eyebrow: Components
title: Maps
description: Static-friendly map components for info/OSINT archetype sites — vendored Leaflet, pre-rendered GeoJSON, progressive enhancement.
breadcrumbs:
  - title: Reference
    url: /components/
---

The map layer is **progressive enhancement over a data table**. Points come
from a **pre-rendered GeoJSON** file committed by the project (no runtime
service, no API key); [Leaflet is vendored and pinned](https://github.com/bussetech/platform/blob/main/docs/decisions/ADR-0027-map-tiles-and-library.md)
(ADR-0027), and the basemap is OpenStreetMap raster with attribution. With
JavaScript off, the map area stays empty and the project's tables are the
baseline — so a project **must** keep its table view on any page that shows a
map.

Colour is wayfinding only: markers are tinted from the **status tokens**.
`cancelled` gets a hollow, dimmed ring — a dead proposal stays visible, never
deleted (GD-0004).

{% include map-legend.html %}

## Cluster map

A full-dataset view. `map-cluster` fetches a GeoJSON `FeatureCollection` of
`Point` features and clusters them; `filters` builds checkbox facets from the
named feature properties (counts derived from the data).

{% include map-cluster.html
   geojson="/assets/demo/sample-sites.geojson"
   filters="status,operator,state"
   height="30rem"
   label="the sample sites"
   caption="Demo data. © OpenStreetMap contributors." %}

```liquid
{% raw %}{% include map-cluster.html
   geojson="/data/geo/sites.geojson"
   filters="status,operator,state"
   caption="© OpenStreetMap contributors." %}{% endraw %}
```

Feature `properties` the popup understands: `name`, `status`, `operator`,
`capacity_mw`, `location`, `url` (the record page).

## Locator map

A single point for a record/detail page. Renders nothing when no `lat`/`lon`
is supplied, so a coordinate-less record simply shows no map.

{% include map-locator.html
   lat=37.5407 lon=-77.6360 status="operational"
   label="Sample Operational Campus" zoom=9
   caption="© OpenStreetMap contributors." %}

```liquid
{% raw %}{% include map-locator.html
   lat=rec.location.lat lon=rec.location.lon
   status=rec.status label=rec.name %}{% endraw %}
```

## Contract

- **Theme owns the components; the project owns the data.** No project-specific
  logic lives here — a project supplies a GeoJSON URL (cluster) or a lat/lon
  (locator).
- Add `map: true` to the page front-matter — that gates the vendored assets, so
  table-only pages load none of the map weight.
- Keep the data table on the page: it is the no-JS baseline and the a11y floor.
