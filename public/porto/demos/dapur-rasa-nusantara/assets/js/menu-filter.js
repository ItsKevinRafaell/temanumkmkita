/* ============================================================
   menu-filter.js — Filter kategori menu (VANILLA JS)
   Tombol .menu-filter[data-filter] menyaring kartu .menu-card
   berdasar data-group, dan menyembunyikan judul kategori kosong.
   ============================================================ */
(function () {
  "use strict";

  var buttons = document.querySelectorAll(".menu-filter [data-filter]");
  if (!buttons.length) return;

  var cards = document.querySelectorAll(".menu-card[data-group]");
  var titles = document.querySelectorAll(".menu-cat-title[data-cat]");
  var grids = document.querySelectorAll(".menu-grid");

  function apply(filter) {
    cards.forEach(function (card) {
      var show = filter === "all" || card.getAttribute("data-group") === filter;
      card.style.display = show ? "" : "none";
    });

    // Sembunyikan judul kategori + grid yang kosong saat difilter
    titles.forEach(function (title) {
      var cat = title.getAttribute("data-cat");
      var visible = filter === "all" || filter === cat;
      title.style.display = visible ? "" : "none";
      var grid = title.nextElementSibling;
      if (grid && grid.classList.contains("menu-grid")) {
        grid.style.display = visible ? "" : "none";
      }
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      apply(btn.getAttribute("data-filter"));
    });
  });
})();
