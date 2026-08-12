/* ============================================================
   include.js — Loader partial nav/footer (vanilla, no plugin)
   ------------------------------------------------------------
   Cara pakai di HTML:
     <div data-include="nav"></div>
     <div data-include="footer"></div>
   Script akan fetch partials/<nama>.html lalu inject.

   Fitur:
   - Auto-resolve path partial relatif terhadap halaman.
   - Highlight menu aktif berdasar nama file saat ini.
   - Fallback pesan kalau fetch gagal (mis. dibuka via file://).
   ============================================================ */

(function () {
  "use strict";

  // Ambil semua slot include di halaman
  const slots = document.querySelectorAll("[data-include]");
  if (!slots.length) return;

  slots.forEach(function (slot) {
    const name = slot.getAttribute("data-include"); // "nav" / "footer"
    const url = "/portofolio/helai-studio/partials/" + name + ".html";

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (html) {
        slot.innerHTML = html;
        // Setelah nav masuk, tandai link aktif
        if (name === "nav") highlightActive(slot);
        // Beritahu listener lain kalau partial sudah termuat
        slot.dispatchEvent(
          new CustomEvent("include:loaded", { bubbles: true, detail: { name: name } })
        );
      })
      .catch(function (err) {
        console.warn("[include.js] Gagal memuat partial '" + name + "':", err.message);
        // Fallback minimal supaya halaman tetap bisa dipakai (mis. file://)
        slot.innerHTML = fallbackMarkup(name);
        if (name === "nav") highlightActive(slot);
      });
  });

  /**
   * Tandai link nav yang sesuai halaman aktif.
   */
  function highlightActive(scope) {
    let current = window.location.pathname.split("/").pop();
    if (!current || current === "") current = "index.html";
    // Dukung clean-URL (tanpa .html) via .htaccess
    const currentBase = current.replace(/\.html$/, "");

    scope.querySelectorAll("a[href]").forEach(function (link) {
      const href = link.getAttribute("href").split("/").pop().replace(/\.html$/, "");
      if (href === currentBase || (currentBase === "index" && href === "")) {
        link.classList.add("active");
      }
    });
  }

  /**
   * Markup fallback bila fetch tidak tersedia.
   */
  function fallbackMarkup(name) {
    if (name === "nav") {
      return (
        '<div class="nav-inner container">' +
        '<a class="nav-brand" href="index.html">Company&nbsp;<b>Profile</b></a>' +
        '<nav class="nav-links">' +
        '<a href="index.html">Beranda</a>' +
        '<a href="tentang.html">Tentang</a>' +
        '<a href="layanan.html">Layanan</a>' +
        '<a href="galeri.html">Galeri</a>' +
        '<a href="kontak.html">Kontak</a>' +
        "</nav></div>"
      );
    }
    if (name === "footer") {
      return (
        '<div class="container footer-cols">' +
        "<p>&copy; " +
        new Date().getFullYear() +
        " Company Profile. Dibuat oleh Teman UMKM Kita.</p>" +
        "</div>"
      );
    }
    return "";
  }
})();
