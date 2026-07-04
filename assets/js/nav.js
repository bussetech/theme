// nav.js — the theme's only JavaScript. Progressive enhancement: the nav
// works as a plain list without it; this just toggles the mobile menu.
(function () {
  "use strict";
  var toggle = document.querySelector(".nav__toggle");
  var list = document.getElementById("nav-list");
  if (!toggle || !list) return;

  toggle.addEventListener("click", function () {
    var open = list.getAttribute("data-open") === "true";
    list.setAttribute("data-open", String(!open));
    toggle.setAttribute("aria-expanded", String(!open));
  });
})();
