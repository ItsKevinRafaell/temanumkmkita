/* ============================================================
   katalog.js — Helai Studio
   ------------------------------------------------------------
   Fitur utama demo (vanilla JS, no plugin):
   1. Render grid produk dari data array.
   2. Filter kategori via tombol (toggle show/hide by data-kategori).
   3. Detail produk -> modal: foto besar, harga, bahan, ukuran,
      + tombol "Pesan via WhatsApp" yang generate pesan otomatis.
   ============================================================ */

(function () {
  "use strict";

  var WA_NUMBER = "6281234567890";

  /* ---------- DATA PRODUK (min 12) ---------- */
  // Palet nude/taupe/bone/ink untuk swatch card (tanpa foto).
  // foto: path relatif ke gen/*.jpg dipakai pada produk unggulan.
  var PRODUK = [
    {
      id: "p01", nama: "Blus Linen Serena", kategori: "atasan", harga: 289000,
      foto: "assets/img/gen/product-flatlay.jpg",
      desc: "Blus lengan panjang dari linen premium yang jatuh anggun. Potongan longgar dengan kancing kayu, nyaman untuk keseharian maupun acara semi-formal.",
      bahan: "Linen 100%", ukuran: "S, M, L, XL"
    },
    {
      id: "p02", nama: "Kemeja Katun Aluna", kategori: "atasan", harga: 249000,
      bg: "1A1A1A", fg: "F4F1EC",
      desc: "Kemeja oversized berbahan katun twill lembut. Siluet clean dengan detail saku dada, cocok dipadukan dengan celana kulot atau rok.",
      bahan: "Katun Twill", ukuran: "S, M, L"
    },
    {
      id: "p03", nama: "Atasan Rajut Maré", kategori: "atasan", harga: 315000,
      bg: "C9BBA8", fg: "1A1A1A",
      desc: "Atasan rajut halus dengan tekstur rib yang memeluk tubuh dengan lembut. Bahan breathable, tidak gerah dipakai seharian.",
      bahan: "Rajut Cotton Blend", ukuran: "All size (fit S-L)"
    },
    {
      id: "p04", nama: "Kulot Palazzo Nira", kategori: "bawahan", harga: 299000,
      bg: "3B3A2E", fg: "F4F1EC",
      desc: "Celana kulot wide-leg dengan pinggang karet tersembunyi. Jatuh lurus dan elegan, memberi kesan tinggi semampai.",
      bahan: "Crepe Premium", ukuran: "S, M, L, XL"
    },
    {
      id: "p05", nama: "Rok Lilit Sekar", kategori: "bawahan", harga: 275000,
      bg: "B0A18C", fg: "1A1A1A",
      desc: "Rok lilit A-line dengan bukaan samping. Fleksibel disesuaikan ukuran pinggang, memberi keleluasaan gerak.",
      bahan: "Katun Rayon", ukuran: "Adjustable"
    },
    {
      id: "p06", nama: "Celana Tapered Basa", kategori: "bawahan", harga: 320000,
      bg: "EAE5DC", fg: "1A1A1A",
      desc: "Celana tapered dengan potongan mengecil di bawah. Terlihat rapi dan profesional, ideal untuk kantor maupun santai.",
      bahan: "Poly-Viscose", ukuran: "27, 28, 29, 30, 31"
    },
    {
      id: "p07", nama: "Dress Midi Laras", kategori: "dress", harga: 459000,
      bg: "1A1A1A", fg: "C9BBA8",
      desc: "Dress midi dengan potongan wrap dan tali pinggang. Siluet feminin yang menonjolkan bentuk tubuh tanpa berlebihan.",
      bahan: "Crepe Silky", ukuran: "S, M, L"
    },
    {
      id: "p08", nama: "Dress Linen Wening", kategori: "dress", harga: 425000,
      bg: "C9BBA8", fg: "1A1A1A",
      desc: "Dress linen sleeveless dengan kerut lembut di pinggang. Adem, ringan, dan sempurna untuk hari-hari cerah.",
      bahan: "Linen Blend", ukuran: "S, M, L, XL"
    },
    {
      id: "p09", nama: "Gaun Malam Anjani", kategori: "dress", harga: 685000,
      bg: "5C2A2A", fg: "F4F1EC",
      desc: "Gaun panjang berbahan satin dengan potongan bias yang jatuh sempurna. Pilihan elegan untuk acara istimewa.",
      bahan: "Satin Premium", ukuran: "S, M, L"
    },
    {
      id: "p10", nama: "Scarf Sutra Kirana", kategori: "aksesoris", harga: 149000,
      bg: "C9BBA8", fg: "1A1A1A",
      desc: "Scarf sutra dengan motif abstrak monokrom. Sentuhan akhir yang mengubah tampilan sederhana jadi berkelas.",
      bahan: "Sutra 100%", ukuran: "90 x 90 cm"
    },
    {
      id: "p11", nama: "Tote Bag Kanvas Dara", kategori: "aksesoris", harga: 189000,
      bg: "B0A18C", fg: "1A1A1A",
      desc: "Tote bag kanvas tebal dengan tali kulit sintetis. Muat besar, kuat, dan tetap terlihat chic untuk aktivitas harian.",
      bahan: "Kanvas + Kulit Sintetis", ukuran: "38 x 40 cm"
    },
    {
      id: "p12", nama: "Ikat Pinggang Lakon", kategori: "aksesoris", harga: 129000,
      bg: "1A1A1A", fg: "F4F1EC",
      desc: "Ikat pinggang kulit dengan gesper matte minimalis. Aksen sempurna untuk mempertegas siluet dress dan kulot.",
      bahan: "Kulit Sapi Asli", ukuran: "Panjang 100 cm"
    },
    {
      id: "p13", nama: "Outer Kimono Tala", kategori: "atasan", harga: 349000,
      bg: "EAE5DC", fg: "1A1A1A",
      desc: "Outer kimono panjang tanpa kancing dengan belahan mengalir. Layer serbaguna yang menambah dimensi setiap gaya.",
      bahan: "Rayon Premium", ukuran: "All size"
    },
    {
      id: "p14", nama: "Set Loungewear Nadia", kategori: "dress", harga: 389000,
      bg: "3B3A2E", fg: "F4F1EC",
      desc: "Set atasan dan celana loungewear dari katun modal super lembut. Nyaman di rumah, tetap rapi untuk video call.",
      bahan: "Katun Modal", ukuran: "S, M, L"
    }
  ];

  /* ---------- HELPERS ---------- */
  function rupiah(n) {
    return "Rp " + n.toLocaleString("id-ID");
  }

  // Visual produk: pakai foto custom (gen/*.jpg) bila ada,
  // atau swatch warna solid nude/taupe/bone/ink elegan + nama produk.
  function visualHTML(p, klass) {
    if (p.foto) {
      return '<img src="' + p.foto + '" alt="' + p.nama + '" />';
    }
    return '<div class="' + (klass || "swatch") + '" style="background:#' + p.bg + ';color:#' + p.fg + '">' +
             '<span>' + p.nama + '</span>' +
           '</div>';
  }

  function labelKategori(k) {
    var map = { atasan: "Atasan", bawahan: "Bawahan", dress: "Dress", aksesoris: "Aksesoris" };
    return map[k] || k;
  }

  /* ---------- RENDER GRID ---------- */
  function renderGrid() {
    var grid = document.querySelector("#produk-grid");
    if (!grid) return;

    grid.innerHTML = PRODUK.map(function (p) {
      return (
        '<article class="produk-card reveal" data-kategori="' + p.kategori + '" data-id="' + p.id + '">' +
          '<div class="produk-thumb">' + visualHTML(p, "swatch") + '</div>' +
          '<div class="produk-info">' +
            '<span class="card-kategori">' + labelKategori(p.kategori) + '</span>' +
            '<h3>' + p.nama + '</h3>' +
            '<span class="harga">' + rupiah(p.harga) + '</span>' +
            '<span class="lihat-detail">Klik untuk lihat detail &rarr;</span>' +
          '</div>' +
        '</article>'
      );
    }).join("");

    // Klik kartu -> buka modal
    grid.querySelectorAll(".produk-card").forEach(function (card) {
      card.addEventListener("click", function () {
        openModal(card.getAttribute("data-id"));
      });
    });
  }

  /* ---------- FILTER KATEGORI ---------- */
  function initFilter() {
    var bar = document.querySelector("#filter-bar");
    var grid = document.querySelector("#produk-grid");
    if (!bar || !grid) return;

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;

      // Toggle state tombol aktif
      bar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      var pilih = btn.getAttribute("data-filter"); // "all" / "atasan" / dst
      var tampil = 0;

      grid.querySelectorAll(".produk-card").forEach(function (card) {
        var cocok = (pilih === "all" || card.getAttribute("data-kategori") === pilih);
        if (cocok) {
          card.classList.remove("hide");
          card.style.animation = "none";
          // reflow lalu re-trigger animasi masuk
          void card.offsetWidth;
          card.style.animation = "";
          tampil++;
        } else {
          card.classList.add("hide");
        }
      });

      // Pesan kalau kosong (secara teori tak terjadi, tapi aman)
      var kosong = grid.querySelector(".no-result");
      if (tampil === 0 && !kosong) {
        var el = document.createElement("p");
        el.className = "no-result";
        el.textContent = "Belum ada produk di kategori ini.";
        grid.appendChild(el);
      } else if (tampil > 0 && kosong) {
        kosong.remove();
      }
    });
  }

  /* ---------- MODAL DETAIL PRODUK ---------- */
  function findProduk(id) {
    for (var i = 0; i < PRODUK.length; i++) if (PRODUK[i].id === id) return PRODUK[i];
    return null;
  }

  function waLink(p) {
    var pesan = "Halo Helai Studio, saya tertarik dengan produk: " + p.nama + " (" + rupiah(p.harga) + ")";
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(pesan);
  }

  function openModal(id) {
    var p = findProduk(id);
    var overlay = document.querySelector("#produk-modal");
    if (!p || !overlay) return;

    overlay.querySelector(".modal-img").innerHTML = visualHTML(p, "swatch");
    overlay.querySelector(".js-kategori").textContent = labelKategori(p.kategori);
    overlay.querySelector(".js-nama").textContent = p.nama;
    overlay.querySelector(".modal-harga").textContent = rupiah(p.harga);
    overlay.querySelector(".modal-desc").textContent = p.desc;
    overlay.querySelector(".js-bahan").textContent = p.bahan;
    overlay.querySelector(".js-ukuran").textContent = p.ukuran;
    overlay.querySelector(".btn-wa").setAttribute("href", waLink(p));

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    var overlay = document.querySelector("#produk-modal");
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function initModal() {
    var overlay = document.querySelector("#produk-modal");
    if (!overlay) return;

    overlay.querySelector(".modal-close").addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal(); // klik backdrop
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ---------- INIT ---------- */
  function boot() {
    renderGrid();
    initFilter();
    initModal();
    // re-scan reveal setelah kartu di-render (main.js pegang observer-nya)
    if (window.HelaiReveal) window.HelaiReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
