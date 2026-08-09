/* ============================================================
   cart.js — Keranjang Belanja Menu Digital (VANILLA JS, no lib)
   ------------------------------------------------------------
   - State cart = array of {id, name, price, img, qty}
   - Persist ke localStorage (bertahan saat reload)
   - Tombol "+ Keranjang" -> addToCart(id)
   - Panel keranjang: qty +/- , hapus item, subtotal, total
   - Checkout -> generate pesan WhatsApp + window.open ke wa.me
   Dipakai di menu.html. Item menu didefinisikan lewat data-* pada
   tombol .btn-add, jadi HTML = sumber kebenaran daftar menu.
   ============================================================ */

(function () {
  "use strict";

  var WA_NUMBER = "6281234567890";
  var STORE_KEY = "drn_cart_v1";
  var BRAND = "Dapur Rasa Nusantara";

  var cart = [];

  /* ---------- FORMAT RUPIAH ---------- */
  function formatRp(n) {
    return "Rp " + Number(n).toLocaleString("id-ID");
  }

  /* ---------- PERSISTENCE ---------- */
  function loadCart() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      cart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cart)) cart = [];
    } catch (e) {
      cart = [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(cart));
    } catch (e) {
      /* storage penuh / diblokir -> abaikan, cart tetap jalan di memori */
    }
  }

  /* ---------- CART OPERATIONS ---------- */
  function addToCart(id, name, price, img) {
    var found = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) { found = cart[i]; break; }
    }
    if (found) {
      found.qty += 1;
    } else {
      cart.push({ id: id, name: name, price: Number(price), img: img, qty: 1 });
    }
    saveCart();
    renderCart();
    updateBadge();
  }

  function changeQty(id, delta) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart[i].qty += delta;
        if (cart[i].qty <= 0) cart.splice(i, 1);
        break;
      }
    }
    saveCart();
    renderCart();
    updateBadge();
  }

  function removeItem(id) {
    cart = cart.filter(function (it) { return it.id !== id; });
    saveCart();
    renderCart();
    updateBadge();
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    updateBadge();
  }

  function totalItems() {
    return cart.reduce(function (s, it) { return s + it.qty; }, 0);
  }

  function totalPrice() {
    return cart.reduce(function (s, it) { return s + it.price * it.qty; }, 0);
  }

  /* ---------- RENDER ---------- */
  function updateBadge() {
    var badge = document.querySelector(".cart-badge");
    if (!badge) return;
    var n = totalItems();
    badge.textContent = n;
    if (n > 0) badge.classList.remove("hidden");
    else badge.classList.add("hidden");
  }

  function renderCart() {
    var list = document.querySelector(".cart-items");
    var totalEl = document.querySelector(".cart-total-value");
    var checkoutBtn = document.querySelector(".cart-checkout");
    if (!list) return;

    if (!cart.length) {
      list.innerHTML =
        '<div class="cart-empty">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
        '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
        '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>" +
        "<p>Keranjang masih kosong.<br>Yuk pilih menu favoritmu dulu!</p>" +
        "</div>";
      if (totalEl) totalEl.textContent = formatRp(0);
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    var html = "";
    cart.forEach(function (it) {
      html +=
        '<div class="cart-item">' +
        '<img class="cart-item-thumb" src="' + it.img + '" alt="' + escapeHtml(it.name) + '">' +
        '<div class="cart-item-info">' +
        "<h4>" + escapeHtml(it.name) + "</h4>" +
        '<div class="ci-price">' + formatRp(it.price) + "</div>" +
        '<div class="cart-qty">' +
        '<button type="button" data-act="dec" data-id="' + it.id + '" aria-label="Kurangi">&minus;</button>' +
        "<span>" + it.qty + "</span>" +
        '<button type="button" data-act="inc" data-id="' + it.id + '" aria-label="Tambah">+</button>' +
        '<button type="button" class="cart-item-remove" data-act="rm" data-id="' + it.id + '">Hapus</button>' +
        "</div>" +
        "</div>" +
        '<div class="ci-subtotal"><b>' + formatRp(it.price * it.qty) + "</b></div>" +
        "</div>";
    });
    list.innerHTML = html;
    if (totalEl) totalEl.textContent = formatRp(totalPrice());
    if (checkoutBtn) checkoutBtn.disabled = false;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- CHECKOUT VIA WHATSAPP ---------- */
  function checkoutWhatsApp() {
    if (!cart.length) return;
    var lines = ["Halo " + BRAND + ", saya mau pesan:"];
    cart.forEach(function (it) {
      lines.push(
        "- " + it.qty + "x " + it.name + " (" + formatRp(it.price * it.qty) + ")"
      );
    });
    lines.push("");
    lines.push("Total: " + formatRp(totalPrice()));
    lines.push("");
    lines.push("Mohon konfirmasi ketersediaan & estimasi waktunya ya. Terima kasih!");

    var pesan = lines.join("\n");
    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(pesan);
    window.open(url, "_blank");
  }

  /* ---------- PANEL OPEN/CLOSE ---------- */
  function openPanel() {
    var panel = document.querySelector(".cart-panel");
    var overlay = document.querySelector(".cart-overlay");
    if (panel) panel.classList.add("open");
    if (overlay) overlay.classList.add("open");
  }
  function closePanel() {
    var panel = document.querySelector(".cart-panel");
    var overlay = document.querySelector(".cart-overlay");
    if (panel) panel.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  }

  /* ---------- TOAST ---------- */
  var toastTimer = null;
  function showToast(msg) {
    var toast = document.querySelector(".cart-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  /* ---------- BIND EVENTS ---------- */
  function bind() {
    // Tombol "+ Keranjang" pada tiap kartu menu
    document.querySelectorAll(".btn-add").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        var name = btn.getAttribute("data-name");
        var price = btn.getAttribute("data-price");
        var img = btn.getAttribute("data-img");
        addToCart(id, name, price, img);
        showToast(name + " ditambahkan ke keranjang");
        btn.classList.add("added");
        var orig = btn.getAttribute("data-label") || btn.textContent;
        btn.textContent = "\u2713 Ditambahkan";
        setTimeout(function () {
          btn.classList.remove("added");
          btn.textContent = orig;
        }, 1100);
      });
    });

    // FAB buka keranjang
    var fab = document.querySelector(".cart-fab");
    if (fab) fab.addEventListener("click", openPanel);

    // Tutup panel
    var closeBtn = document.querySelector(".cart-close");
    if (closeBtn) closeBtn.addEventListener("click", closePanel);
    var overlay = document.querySelector(".cart-overlay");
    if (overlay) overlay.addEventListener("click", closePanel);

    // Delegasi klik di dalam daftar item (qty +/- & hapus)
    var list = document.querySelector(".cart-items");
    if (list) {
      list.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-act]");
        if (!btn) return;
        var id = btn.getAttribute("data-id");
        var act = btn.getAttribute("data-act");
        if (act === "inc") changeQty(id, 1);
        else if (act === "dec") changeQty(id, -1);
        else if (act === "rm") removeItem(id);
      });
    }

    // Checkout WA
    var checkoutBtn = document.querySelector(".cart-checkout");
    if (checkoutBtn) checkoutBtn.addEventListener("click", checkoutWhatsApp);

    // Kosongkan keranjang
    var clearBtn = document.querySelector(".cart-clear");
    if (clearBtn) clearBtn.addEventListener("click", function () {
      if (cart.length && confirm("Kosongkan seluruh keranjang?")) clearCart();
    });

    // Escape untuk tutup panel
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanel();
    });
  }

  /* ---------- INIT ---------- */
  function boot() {
    loadCart();
    bind();
    renderCart();
    updateBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Ekspos untuk debugging manual (opsional)
  window.DRNCart = {
    add: addToCart,
    clear: clearCart,
    get: function () { return cart.slice(); }
  };
})();
