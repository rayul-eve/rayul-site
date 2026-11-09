/* ============================================================
   rayul.ca — Index (/archive)
   Every project as a slate row. ALL = newest, then the featured
   picks, then newest first. Role filters are plain date order.
   ============================================================ */
(function () {
  'use strict';
  var S = window.SITE;
  var rowsEl = document.getElementById('rows');
  var countEl = document.getElementById('count');
  var filters = document.getElementById('filters');
  var preview = document.getElementById('preview');
  var pImg = preview.querySelector('img'), pLbl = preview.querySelector('.lbl');
  var HOVER = window.matchMedia('(hover: hover) and (pointer: fine)');
  var current = [];

  function render(role) {
    current = role ? S.indexByRole(role) : S.indexAll();
    countEl.textContent = current.length + ' PROJECTS';
    rowsEl.innerHTML = current.map(function (p, i) {
      return '<li><button type="button" class="row" data-i="' + i + '">' +
        '<span class="th">' + (p.thumb ? '<img alt="" loading="lazy" decoding="async" src="' + p.thumb + '">' : '') + '</span>' +
        '<span class="n">' + S.pad(i + 1) + '</span>' +
        '<span class="t">' + S.esc(S.name(p)) + '</span>' +
        '<span class="r">' + S.roles(p) + '<span class="m2"> · ' + S.meta(p) + '</span></span>' +
        '<span class="m">' + S.meta(p) + '</span>' +
        '</button></li>';
    }).join('');
  }

  filters.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    Array.prototype.forEach.call(filters.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    render(b.dataset.role);
  });

  rowsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.row');
    if (!b) return;
    hide();
    S.openPlayer(current, +b.dataset.i, 'index');
  });

  /* ---------- hover still (desktop) ---------- */
  var mx = 0, my = 0, raf = 0, shown = null;
  function place() {
    raf = 0;
    var x = mx + 28;
    if (x + 360 > window.innerWidth - 16) x = mx - 388;
    preview.style.transform = 'translate(' + x + 'px,' + (my - 101) + 'px)';
  }
  function show(p) {
    if (shown === p) return;
    shown = p;
    if (p.thumb) { pImg.src = p.thumb; pImg.style.display = ''; pLbl.textContent = ''; }
    else { pImg.removeAttribute('src'); pImg.style.display = 'none'; pLbl.textContent = S.name(p) + ' · STILL COMING'; }
    preview.classList.add('on');
  }
  function hide() { shown = null; preview.classList.remove('on'); }
  rowsEl.addEventListener('mousemove', function (e) {
    if (!HOVER.matches) return;
    mx = e.clientX; my = e.clientY;
    if (!raf) raf = requestAnimationFrame(place);
    var b = e.target.closest('.row');
    if (b) show(current[+b.dataset.i]); else hide();
  });
  rowsEl.addEventListener('mouseleave', hide);
  window.addEventListener('scroll', hide, { passive: true });

  render('');

  // Preload a few stills so the first hovers are instant.
  current.slice(0, 8).forEach(function (p) { if (p.thumb) { var i = new Image(); i.src = p.thumb; } });

  // Open straight into a film from a shared link: rayul.ca/archive#project-id
  var hash = decodeURIComponent(location.hash.slice(1));
  if (hash) {
    var k = current.findIndex(function (p) { return p.id === hash; });
    if (k > -1) S.openPlayer(current, k, 'index');
  }
})();
