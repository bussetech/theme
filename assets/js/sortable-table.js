// sortable-table.js — progressive enhancement for [data-sortable] tables
// (emitted only when a page sets `sortable_tables: true`; the map-scripts
// pattern). Without it the Liquid-rendered default sort stands. Sorting is
// display-only reordering of existing rows: no fetch, no state, no cookies.
(function () {
  "use strict";

  function valueOf(cell, numeric) {
    var raw = cell.getAttribute("data-value") || cell.textContent;
    if (!numeric) return raw.trim().toLowerCase();
    var n = parseFloat(String(raw).replace(/[^0-9.eE-]/g, ""));
    return isNaN(n) ? -Infinity : n;
  }

  document.querySelectorAll("table[data-sortable]").forEach(function (table) {
    var headers = table.querySelectorAll("thead th[data-key]");
    var tbody = table.querySelector("tbody");
    if (!tbody) return;

    headers.forEach(function (th, index) {
      var button = th.querySelector(".sortable-table__sort");
      if (!button) return;
      button.addEventListener("click", function () {
        var numeric = th.hasAttribute("data-numeric");
        // Toggle: same column flips direction; new column starts descending
        // for numbers (leaderboard convention), ascending for text.
        var current = th.getAttribute("aria-sort");
        var desc = current === "descending" ? false : current === "ascending" ? true : !!numeric;
        headers.forEach(function (other) { other.removeAttribute("aria-sort"); });
        th.setAttribute("aria-sort", desc ? "descending" : "ascending");

        Array.prototype.slice.call(tbody.rows)
          .sort(function (a, b) {
            var av = valueOf(a.cells[index], numeric);
            var bv = valueOf(b.cells[index], numeric);
            if (av < bv) return desc ? 1 : -1;
            if (av > bv) return desc ? -1 : 1;
            return 0;
          })
          .forEach(function (row) { tbody.appendChild(row); });
      });
    });
  });
})();
