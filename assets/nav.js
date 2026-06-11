/* ============================================================
   RAYUL — PILL NAVBAR (shared across all pages)
   MENU/CLOSE toggle, sequential pill unfold + text scramble.
   Open state persists across pages via sessionStorage.
   ============================================================ */
(function () {
  'use strict';

  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('nav-menu-toggle');
  const links  = document.getElementById('nav-links');
  if (!nav || !toggle || !links) return;

  const pills       = Array.from(links.querySelectorAll('.nav-pill--link'));
  const toggleLabel = toggle.querySelector('.nav-pill-label');

  const CHARS         = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';
  const OPEN_STAGGER  = 90;   // ms between pills unfolding
  const CLOSE_STAGGER = 65;   // ms between pills folding (reverse order)
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- active page ---------- */
  const page = (location.pathname.split('/').pop() || 'index.html');
  pills.forEach(p => {
    if (p.getAttribute('href') === page) p.classList.add('is-active');
  });

  /* ---------- per-element text scramble ---------- */
  function rand() { return CHARS[(Math.random() * CHARS.length) | 0]; }

  function scrambleTo(el, target, duration) {
    if (REDUCED) { el.textContent = target; return; }
    if (el._raf) cancelAnimationFrame(el._raf);
    const len = target.length;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      let out = '';
      for (let i = 0; i < len; i++) {
        const resolveAt = (i / Math.max(len - 1, 1)) * 0.6;
        if (t >= resolveAt + 0.35)   out += target[i];
        else if (t >= resolveAt)     out += rand();
        else                         out += ' ';
      }
      el.textContent = out;
      if (t < 1) el._raf = requestAnimationFrame(tick);
      else { el.textContent = target; el._raf = null; }
    }
    el._raf = requestAnimationFrame(tick);
  }

  function scrambleAway(el, duration) {
    if (REDUCED) { el.textContent = ' '; return; }
    if (el._raf) cancelAnimationFrame(el._raf);
    const len = (el.textContent || '').length || 1;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      let out = '';
      for (let i = 0; i < len; i++) {
        const clearAt = 0.25 + (i / Math.max(len - 1, 1)) * 0.55;
        out += (t >= clearAt) ? ' ' : rand();
      }
      el.textContent = out;
      if (t < 1) el._raf = requestAnimationFrame(tick);
      else el._raf = null;
    }
    el._raf = requestAnimationFrame(tick);
  }

  function scrambleSwap(el, target) {
    if (REDUCED) { el.textContent = target; return; }
    scrambleAway(el, 160);
    setTimeout(() => scrambleTo(el, target, 300), 170);
  }

  /* ---------- measurement ---------- */
  function measure() {
    links.classList.add('no-anim');
    const wasOpen = links.classList.contains('is-open');
    links.classList.add('is-open');
    // restore real labels so widths are accurate
    pills.forEach(p => {
      const label = p.querySelector('.nav-pill-label');
      label.textContent = label.dataset.label;
      p.style.removeProperty('--w');
    });
    pills.forEach(p => {
      p.style.setProperty('--w', Math.ceil(p.getBoundingClientRect().width) + 'px');
    });
    if (!wasOpen) links.classList.remove('is-open');
    void links.offsetWidth; // flush before re-enabling transitions
    links.classList.remove('no-anim');

    // lock toggle to the wider of MENU / CLOSE so the swap never jumps
    const current = toggleLabel.textContent;
    toggle.style.minWidth = '';
    toggleLabel.textContent = 'CLOSE';
    const w1 = toggle.getBoundingClientRect().width;
    toggleLabel.textContent = 'MENU';
    const w2 = toggle.getBoundingClientRect().width;
    toggleLabel.textContent = current;
    toggle.style.minWidth = Math.ceil(Math.max(w1, w2)) + 'px';
  }

  /* ---------- open / close ---------- */
  let isOpen = false;

  /* Menu sits to the RIGHT of the pills, so unfold outward from it:
     last pill (nearest MENU) first on open, furthest first on close. */
  function applyDelays(opening) {
    pills.forEach((p, i) => {
      const d = opening ? (pills.length - 1 - i) * OPEN_STAGGER : i * CLOSE_STAGGER;
      p.style.setProperty('--d', d + 'ms');
    });
  }

  function openNav(animate) {
    isOpen = true;
    try { sessionStorage.setItem('rayul-nav-open', '1'); } catch (e) {}
    toggle.setAttribute('aria-expanded', 'true');
    applyDelays(true);
    links.classList.add('is-open');
    pills.forEach((p, i) => {
      const label = p.querySelector('.nav-pill-label');
      const target = label.dataset.label;
      if (!animate || REDUCED) { label.textContent = target; return; }
      label.textContent = ' '.repeat(target.length);
      setTimeout(() => scrambleTo(label, target, 420), (pills.length - 1 - i) * OPEN_STAGGER + 140);
    });
    if (animate) scrambleSwap(toggleLabel, 'CLOSE');
    else toggleLabel.textContent = 'CLOSE';
  }

  function closeNav(animate) {
    isOpen = false;
    try { sessionStorage.setItem('rayul-nav-open', '0'); } catch (e) {}
    toggle.setAttribute('aria-expanded', 'false');
    applyDelays(false);
    if (animate && !REDUCED) {
      pills.forEach((p, i) => {
        const label = p.querySelector('.nav-pill-label');
        setTimeout(() => scrambleAway(label, 200), i * CLOSE_STAGGER);
      });
    }
    links.classList.remove('is-open');
    if (animate) scrambleSwap(toggleLabel, 'MENU');
    else toggleLabel.textContent = 'MENU';
  }

  toggle.addEventListener('click', () => (isOpen ? closeNav(true) : openNav(true)));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeNav(true);
  });

  /* ---------- init ---------- */
  measure();
  let startOpen = false;
  try { startOpen = sessionStorage.getItem('rayul-nav-open') === '1'; } catch (e) {}
  if (startOpen) openNav(false);
  else closeNav(false);

  /* re-measure across breakpoints */
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(measure, 150);
  });

  /* ---------- custom cursor hover (pages attach to a/button,
     but pills inside .nav-links are also covered there since
     they are anchors — nothing extra needed) ---------- */
})();
