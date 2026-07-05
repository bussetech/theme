/*
 * map.js — studio theme map behaviour (progressive enhancement).
 *
 * Initialises any `.map` container on a page that opted in with `map: true`
 * front-matter. Two modes, read from data attributes:
 *   cluster  — fetches a same-origin GeoJSON URL, plots status-coloured
 *              circle markers in a marker-cluster group, fits bounds, and
 *              builds filter controls from the feature properties named in
 *              data-map-filters.
 *   locator  — a single point from data-map-lat/lon, for a record page.
 *
 * Colour is wayfinding only: marker fills come from the status tokens
 * (--color-status-*), read live from the stylesheet so the design system
 * stays the single source of truth. `cancelled` gets a distinct hollow
 * treatment (GD-0004: dead proposals stay visible, not deleted), never a hue.
 *
 * The map is additive. With JS off, or if Leaflet/the fetch fails, the
 * container stays empty and the page's data tables remain the baseline.
 */
(function () {
  "use strict";

  if (typeof L === "undefined") return; // vendored Leaflet absent — tables stand.

  var css = getComputedStyle(document.documentElement);
  function token(name, fallback) {
    var v = css.getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }

  // Default lifecycle status -> marker style, for the info/OSINT archetype.
  // r/y/g are the status tokens; the earliest/least-certain stage is neutral;
  // a terminal/cancelled stage is a hollow, dimmed ring — present but plainly
  // inactive. A project with a different vocabulary gets the neutral fallback
  // for any status not listed here (see styleFor).
  var STATUS = {
    operational: { color: token("--color-status-green", "#00843D"), fill: true },
    "under-construction": { color: token("--color-status-amber", "#9A5B00"), fill: true },
    permitted: { color: token("--color-status-amber", "#9A5B00"), fill: true },
    announced: { color: token("--gray-500", "#6B6B6B"), fill: true },
    cancelled: { color: token("--gray-500", "#6B6B6B"), fill: false }
  };
  function styleFor(status) {
    var s = STATUS[status] || { color: token("--gray-500", "#6B6B6B"), fill: true };
    return {
      radius: 7,
      color: s.color,
      weight: s.fill ? 1.5 : 2,
      opacity: s.fill ? 1 : 0.85,
      fillColor: s.color,
      fillOpacity: s.fill ? 0.85 : 0,
      dashArray: s.fill ? null : "3 3",
      className: "map-marker map-marker--" + (status || "unknown")
    };
  }

  var OSM_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  var OSM_ATTR =
    '&copy; <a href="https://www.openstreetmap.org/copyright" rel="external nofollow">OpenStreetMap</a> contributors';

  function baseLayer() {
    return L.tileLayer(OSM_URL, { maxZoom: 18, attribution: OSM_ATTR });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function popupHtml(p) {
    var parts = [];
    var title = esc(p.name || p.title || "Site");
    parts.push(p.url ? '<strong><a href="' + esc(p.url) + '">' + title + "</a></strong>" : "<strong>" + title + "</strong>");
    var meta = [];
    if (p.status) meta.push(esc(p.status));
    if (p.operator) meta.push(esc(p.operator));
    if (meta.length) parts.push('<span class="map-popup__meta">' + meta.join(" · ") + "</span>");
    if (p.capacity_mw) parts.push('<span class="map-popup__meta">' + esc(p.capacity_mw) + " MW</span>");
    if (p.location) parts.push('<span class="map-popup__meta">' + esc(p.location) + "</span>");
    return '<div class="map-popup">' + parts.join("<br>") + "</div>";
  }

  function initLocator(el) {
    var lat = parseFloat(el.getAttribute("data-map-lat"));
    var lon = parseFloat(el.getAttribute("data-map-lon"));
    if (isNaN(lat) || isNaN(lon)) return; // no coords -> leave empty
    var zoom = parseInt(el.getAttribute("data-map-zoom"), 10) || 9;
    var status = el.getAttribute("data-map-status") || "";
    var map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([lat, lon], zoom);
    baseLayer().addTo(map);
    var m = L.circleMarker([lat, lon], styleFor(status)).addTo(map);
    var label = el.getAttribute("data-map-label");
    if (label) m.bindPopup(popupHtml({ name: label, status: status }));
    el.setAttribute("data-map-ready", "1");
  }

  function initCluster(el) {
    var url = el.getAttribute("data-map-geojson");
    if (!url) return;
    var filters = (el.getAttribute("data-map-filters") || "")
      .split(",").map(function (s) { return s.trim(); }).filter(Boolean);

    var map = L.map(el, { attributionControl: true }).setView([38.0, -95.0], 4);
    baseLayer().addTo(map);
    var cluster = (typeof L.markerClusterGroup === "function")
      ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 45 })
      : L.featureGroup();
    map.addLayer(cluster);

    fetch(url, { credentials: "same-origin" })
      .then(function (r) { if (!r.ok) throw new Error("geojson " + r.status); return r.json(); })
      .then(function (gj) {
        var facets = {};
        filters.forEach(function (f) { facets[f] = {}; });
        var entries = [];
        (gj.features || []).forEach(function (feat) {
          var g = feat.geometry;
          if (!g || g.type !== "Point" || !g.coordinates) return;
          var lon = g.coordinates[0], lat = g.coordinates[1];
          if (typeof lat !== "number" || typeof lon !== "number") return;
          var p = feat.properties || {};
          var marker = L.circleMarker([lat, lon], styleFor(p.status));
          marker.bindPopup(popupHtml(p));
          entries.push({ marker: marker, props: p });
          filters.forEach(function (f) {
            var v = p[f];
            if (v != null && v !== "") facets[f][v] = (facets[f][v] || 0) + 1;
          });
        });

        var active = {}; // facet -> Set of hidden values
        filters.forEach(function (f) { active[f] = {}; });

        function apply() {
          cluster.clearLayers();
          var shown = [];
          entries.forEach(function (e) {
            var hide = filters.some(function (f) { return active[f][e.props[f]]; });
            if (!hide) shown.push(e.marker);
          });
          cluster.addLayers(shown);
          if (shown.length) {
            try { map.fitBounds(L.featureGroup(shown).getBounds().pad(0.15)); } catch (e) {}
          }
        }

        buildControls(el, filters, facets, active, apply);
        apply();
        el.setAttribute("data-map-ready", "1");
      })
      .catch(function () { el.setAttribute("data-map-error", "1"); /* tables remain */ });
  }

  function buildControls(el, filters, facets, active, apply) {
    var host = el.parentNode.querySelector("[data-map-controls]");
    if (!host || !filters.length) return;
    filters.forEach(function (f) {
      var values = Object.keys(facets[f]).sort();
      if (!values.length) return;
      var group = document.createElement("fieldset");
      group.className = "map-filter";
      var legend = document.createElement("legend");
      legend.textContent = f;
      group.appendChild(legend);
      values.forEach(function (v) {
        var id = "mf-" + f + "-" + v.replace(/[^a-z0-9]+/gi, "-");
        var label = document.createElement("label");
        label.className = "map-filter__opt";
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = true;
        cb.id = id;
        cb.addEventListener("change", function () {
          if (cb.checked) delete active[f][v]; else active[f][v] = true;
          apply();
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(" " + v + " (" + facets[f][v] + ")"));
        group.appendChild(label);
      });
      host.appendChild(group);
    });
    host.removeAttribute("hidden");
  }

  function init() {
    var nodes = document.querySelectorAll(".map[data-map-mode]");
    Array.prototype.forEach.call(nodes, function (el) {
      var mode = el.getAttribute("data-map-mode");
      if (mode === "locator") initLocator(el);
      else if (mode === "cluster") initCluster(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
