/* ============================================================
   gallery.js — Filter kategori + fade-in on scroll (vanilla)
   ------------------------------------------------------------
   PROGRESSIVE ENHANCEMENT:
   - CSS default: .card VISIBLE (opacity:1).
   - JS menandai <html class="js-reveal"> -> baru elemen disembunyikan
     lalu di-fade-in. Jadi kalau JS mati konten tetap keliatan.
   - Fallback: kalau IntersectionObserver tak ada / gagal -> semua card
     langsung visible. Plus safety setTimeout 1500ms force-reveal.
   ============================================================ */

(function () {
  "use strict";

  // Tandai bahwa JS aktif -> CSS boleh menyembunyikan elemen untuk animasi.
  // Dilakukan secepatnya agar animasi mulai dari state tersembunyi.
  document.documentElement.classList.add("js-reveal");

  function revealAll(cards) {
    cards.forEach(function (c) { c.classList.add("visible"); });
  }

  function initReveal() {
    var cards = document.querySelectorAll(".card");
    if (!cards.length) return;

    // Fallback total: browser tanpa IntersectionObserver -> tampil semua.
    if (!("IntersectionObserver" in window)) {
      revealAll(cards);
      return;
    }

    var observer;
    try {
      observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var idx = Number(entry.target.dataset.idx || 0);
              entry.target.style.transitionDelay = (idx % 4) * 70 + "ms";
              entry.target.classList.add("visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );
    } catch (err) {
      // Kalau observer gagal dibuat, tampilkan semua.
      revealAll(cards);
      return;
    }

    // Observe SEMUA card. Untuk elemen yang sudah in-viewport saat load,
    // IntersectionObserver otomatis fire pada observe pertama.
    cards.forEach(function (card, i) {
      card.dataset.idx = i;
      observer.observe(card);
    });

    // SAFETY NET: kalau setelah 1500ms masih ada card belum visible
    // (observer gagal fire), paksa reveal semua sisanya.
    setTimeout(function () {
      document.querySelectorAll(".card:not(.visible)").forEach(function (c) {
        c.classList.add("visible");
      });
    }, 1500);
  }

  /* ---------- FILTER KATEGORI ---------- */
  function initFilter() {
    var filterBtns = document.querySelectorAll(".filter-btn");
    var gridCards = document.querySelectorAll(".card");
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        var filter = btn.dataset.filter; // "semua" / "jasa" / "fnb" ...

        gridCards.forEach(function (card) {
          var kategori = card.dataset.kategori || "";
          var match = filter === "semua" || kategori.split(" ").indexOf(filter) !== -1;

          if (match) {
            card.style.display = "";
            card.classList.remove("visible");
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                card.classList.add("visible");
              });
            });
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  function boot() {
    initReveal();
    initFilter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
