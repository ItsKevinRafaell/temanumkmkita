/* carousel.js — geser menu andalan Dapur Rasa. Native scroll + tombol.
   Ringan, no deps. Geser 1 kartu + gap tiap klik. */
(function () {
  var carousel = document.querySelector('.mc-carousel');
  if (!carousel) return;
  var track = carousel.querySelector('[data-mc-track]');
  var prev = carousel.querySelector('[data-mc-prev]');
  var next = carousel.querySelector('[data-mc-next]');
  if (!track) return;

  function step() {
    var card = track.querySelector('.mc-card');
    if (!card) return 320;
    var gap = parseInt(getComputedStyle(track).gap) || 20;
    return card.getBoundingClientRect().width + gap;
  }

  function updateBtns() {
    if (!prev || !next) return;
    var maxScroll = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll;
  }

  if (prev) prev.addEventListener('click', function () {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  if (next) next.addEventListener('click', function () {
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateBtns, { passive: true });
  window.addEventListener('resize', updateBtns);
  updateBtns();
})();
