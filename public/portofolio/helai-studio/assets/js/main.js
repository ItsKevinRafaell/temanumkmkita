/* ============================================================
   main.js — Interaksi template Company Profile (vanilla)
   ------------------------------------------------------------
   - Reveal on scroll (IntersectionObserver) — PROGRESSIVE ENHANCEMENT
   - Toggle menu mobile (hamburger)
   - Handler form kontak dummy
   - Menu tabs (kategori koleksi)
   Catatan: nav dimuat via include.js secara async, jadi binding
   toggle & re-scan reveal dilakukan setelah event "include:loaded".
   ============================================================ */

(function () {
  "use strict";

  // Tandai JS aktif -> CSS boleh menyembunyikan .reveal untuk animasi.
  // Kalau JS mati, class ini tak pernah ada -> .reveal tetap opacity:1.
  document.documentElement.classList.add("js-reveal");

  /* ---------- 1. REVEAL ON SCROLL ---------- */
  var io = null;

  function ensureObserver() {
    if (io || !("IntersectionObserver" in window)) return io;
    try {
      io = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );
    } catch (err) {
      io = null;
    }
    return io;
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal:not(.visible)");
    if (!items.length) return;

    // Fallback total: tanpa IntersectionObserver -> tampil semua.
    var obs = ensureObserver();
    if (!obs) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    // Observe SEMUA elemen target (termasuk yang sudah in-viewport;
    // observer otomatis fire pada observe pertama untuk yang visible).
    items.forEach(function (el) { obs.observe(el); });
  }

  // SAFETY NET: force-reveal apa pun yang masih tersembunyi setelah 1500ms.
  function scheduleSafetyReveal() {
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.visible)").forEach(function (el) {
        el.classList.add("visible");
      });
    }, 1500);
  }

  /* ---------- 2. HAMBURGER MENU (mobile) ---------- */
  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links || toggle.dataset.bound) return;
    toggle.dataset.bound = "1";

    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  /* ---------- 3. FORM KONTAK DUMMY ---------- */
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "1";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        status.textContent =
          "Terima kasih! Pesan Anda telah kami terima. Tim kami akan segera menghubungi Anda.";
        status.style.color = "var(--accent-2)";
      }
      form.reset();
    });
  }

  /* ---------- 4. MENU TABS (kategori) ---------- */
  function initMenuTabs() {
    var tabs = document.querySelectorAll(".menu-tab");
    var panels = document.querySelectorAll(".menu-panel");
    if (!tabs.length || !panels.length) return;

    tabs.forEach(function (tab) {
      if (tab.dataset.bound) return;
      tab.dataset.bound = "1";
      tab.addEventListener("click", function () {
        var cat = tab.getAttribute("data-cat");
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        panels.forEach(function (p) {
          var on = p.getAttribute("data-panel") === cat;
          p.classList.toggle("is-active", on);
          if (on) { p.removeAttribute("hidden"); }
          else { p.setAttribute("hidden", ""); }
        });
      });
    });
  }

  /* ---------- 5. SHINE EFFECT (btn-shine class) ---------- */
  function initShineButtons() {
    // Shine effect is pure CSS (.btn-shine::before), no JS needed.
    // This function exists as a hook if we need future enhancements.
  }

  /* ---------- INIT ---------- */
  function boot() {
    initReveal();
    initContactForm();
    initNavToggle();
    initMenuTabs();
    initShineButtons();
    scheduleSafetyReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Ketika partial nav/footer selesai dimuat via include.js
  document.addEventListener("include:loaded", function (e) {
    if (e.detail && e.detail.name === "nav") {
      initNavToggle();
    }
    // Re-scan reveal kalau partial punya elemen reveal
    initReveal();
  });
})();
