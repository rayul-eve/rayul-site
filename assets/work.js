/* ============================================================
   rayul.ca — Work page
   Reel first, then the Work projects from assets/data/projects.js.
   Native scroll-snap (one project per gesture), poster still first,
   video fades in once it plays, only the current + next video load.
   ============================================================ */
(function () {
  'use strict';
  var S = window.SITE, R = window.RAYUL;
  var list = S.workList();
  var total = list.length;
  var root = document.getElementById('slides');
  var reelSlide = root.querySelector('.slide-reel');
  var ARROW = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1v10M2 7l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  var PLAY = '<svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z" fill="currentColor"/></svg>';
  var active = -1;
  var bg = {};          // index -> { play(), pause() }
  var playerOpen = false;

  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  function nextLabel(p) {
    return '<span>NEXT</span><span class="ttl"><span class="only-desktop">' + S.esc(S.name(p)) +
      '</span><span class="only-mobile">' + S.esc(S.up(p.client)) + '</span></span>' + ARROW;
  }

  /* ---------- build ---------- */
  S.fillMarquee(document.getElementById('reel-logos'));
  reelSlide.querySelector('.count').textContent = '00 / ' + S.pad(total);
  var reelNext = reelSlide.querySelector('.nextlink');
  reelNext.innerHTML = nextLabel(list[0]);
  reelNext.dataset.to = '1';

  list.forEach(function (p, k) {
    var i = k + 1, next = list[k + 1];
    var s = document.createElement('section');
    s.className = 'slide';
    s.dataset.i = i;
    s.setAttribute('aria-label', S.name(p));
    var lines = '<span>' + S.esc(S.up(p.client)) + '</span>' + (p.title ? '<span>' + S.esc(S.up(p.title)) + '</span>' : '');
    s.innerHTML =
      '<div class="media" data-open="' + k + '">' +
        (p.thumb ? '<img class="poster" alt="" decoding="async"' + (i > 2 ? ' loading="lazy"' : '') + ' src="' + p.thumb + '">' : '') +
        '<div class="vid"></div></div>' +
      '<div class="shade-t"></div><div class="shade-b"></div>' +
      '<div class="slide-foot">' +
        '<div class="slate">' +
          '<h2><button type="button" data-open="' + k + '" aria-label="Play ' + S.esc(S.name(p)) + '">' + lines + '</button></h2>' +
          '<div class="slate-sub small">' +
            '<span>' + S.roles(p) + '</span>' +
            '<span class="quiet">' + S.meta(p) + '</span>' +
            '<button type="button" class="playlink" data-open="' + k + '">' + PLAY + 'PLAY</button>' +
          '</div>' +
        '</div>' +
        '<div class="side small">' +
          '<button type="button" class="jumpbtn"><span>' + S.pad(i) + ' / ' + S.pad(total) + '</span><span class="quiet">ALL PROJECTS</span></button>' +
          (next
            ? '<a href="#" class="nextlink" data-to="' + (i + 1) + '">' + nextLabel(next) + '</a>'
            : '<a href="/archive" class="nextlink"><span>NEXT</span><span class="ttl">INDEX</span>' + ARROW + '</a>') +
        '</div>' +
      '</div>';
    root.appendChild(s);
  });
  var slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));

  /* ---------- navigation ---------- */
  function goTo(i, instant) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    root.scrollTo({ top: slides[i].offsetTop, behavior: (instant || S.REDUCED) ? 'auto' : 'smooth' });
  }
  root.addEventListener('click', function (e) {
    var to = e.target.closest('[data-to]');
    if (to) { e.preventDefault(); goTo(+to.dataset.to); return; }
    var op = e.target.closest('[data-open]');
    if (op) { openFilm(+op.dataset.open); return; }
    if (e.target.closest('.jumpbtn')) openJump();
  });
  document.addEventListener('keydown', function (e) {
    if (playerOpen || jump.classList.contains('is-open')) return;
    if (e.target.closest && e.target.closest('button, a, input')) { if (e.key === ' ') return; }
    var k = e.key;
    if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) { e.preventDefault(); goTo(active + 1); }
    else if (k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) { e.preventDefault(); goTo(active - 1); }
    else if (k === 'Home') { e.preventDefault(); goTo(0); }
    else if (k === 'End') { e.preventDefault(); goTo(slides.length - 1); }
  });

  /* ---------- background video ---------- */
  function cover(el) { el.style.opacity = ''; }
  function loadBg(i) {
    if (i < 1 || i > total || bg[i]) return;
    var p = list[i - 1], vid = slides[i].querySelector('.vid');
    var b = bg[i] = { ready: false, want: false, play: function () { this.want = true; }, pause: function () { this.want = false; } };
    if (p.vimeo) {
      var f = document.createElement('iframe');
      f.title = S.name(p);
      f.setAttribute('aria-hidden', 'true');
      f.tabIndex = -1;
      f.allow = 'autoplay; fullscreen';
      f.src = S.vimeoSrc(p.vimeo, 'background=1&autoplay=1&loop=1&muted=1&playsinline=1&dnt=1&autopause=0');
      vid.appendChild(f);
      var fallback = setTimeout(function () { vid.classList.add('on'); }, 6000);
      S.vimeoApi().then(function (V) {
        var pl = new V.Player(f);
        pl.on('playing', function () { clearTimeout(fallback); vid.classList.add('on'); });
        pl.on('timeupdate', function onT() { clearTimeout(fallback); vid.classList.add('on'); pl.off('timeupdate', onT); });
        b.play = function () { this.want = true; pl.play().catch(function () {}); };
        b.pause = function () { this.want = false; pl.pause().catch(function () {}); };
        if (!b.want && active !== i) pl.pause().catch(function () {});
      }).catch(function () {});
    } else if (p.youtube) {
      var host = document.createElement('div');
      host.className = 'yt-bg';
      vid.appendChild(host);
      S.youtubeApi().then(function (YT) {
        var pl = new YT.Player(host, {
          videoId: p.youtube,
          playerVars: { autoplay: 1, mute: 1, controls: 0, loop: 1, playlist: p.youtube, playsinline: 1, modestbranding: 1, rel: 0, iv_load_policy: 3, disablekb: 1, fs: 0 },
          events: {
            onReady: function (e) {
              e.target.mute();
              var fr = e.target.getIframe(); fr.tabIndex = -1; fr.setAttribute('aria-hidden', 'true');
              if (active === i && !playerOpen) e.target.playVideo(); else e.target.pauseVideo();
            },
            onStateChange: function (e) { if (e.data === 1) vid.classList.add('on'); }
          }
        });
        b.play = function () { this.want = true; if (pl.playVideo) pl.playVideo(); };
        b.pause = function () { this.want = false; if (pl.pauseVideo) pl.pauseVideo(); };
      }).catch(function () {});
    }
  }

  /* ---------- reel + sound ---------- */
  var reel = { pl: null, soundOn: false, blocked: false };
  var wantSound = store('reelSound') !== 'off';
  var sndBtn = document.getElementById('snd');
  function soundUI(on) {
    reel.soundOn = on;
    sndBtn.querySelector('.snd-label').textContent = on ? 'SOUND ON' : 'SOUND OFF';
    sndBtn.querySelector('.eq').classList.toggle('on', on);
    sndBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  function fadeVolume(to, ms) {
    if (!reel.pl) return Promise.resolve();
    var steps = 10, n = 0;
    return reel.pl.getVolume().then(function (from) {
      return new Promise(function (res) {
        var t = setInterval(function () {
          n++;
          reel.pl.setVolume(from + (to - from) * (n / steps)).catch(function () {});
          if (n >= steps) { clearInterval(t); res(); }
        }, ms / steps);
      });
    }).catch(function () {});
  }
  function tryUnmute() {
    if (!reel.pl) return;
    reel.pl.setVolume(1).catch(function () {});
    reel.pl.setMuted(false).then(function () {
      setTimeout(function () {
        reel.pl.getPaused().then(function (paused) {
          if (paused) { reel.pl.setMuted(true); reel.pl.play().catch(function () {}); soundUI(false); reel.blocked = true; }
          else { soundUI(true); reel.blocked = false; }
        });
      }, 350);
    }).catch(function () { reel.pl.setMuted(true); soundUI(false); reel.blocked = true; });
  }
  // Browsers block sound until the visitor taps or clicks once. First gesture on the reel turns it on.
  function onFirstGesture(e) {
    if (!reel.blocked || !wantSound || active !== 0 || playerOpen) return;
    if (e.target.closest && e.target.closest('#snd')) return;
    if (!reel.pl) return;
    reel.blocked = false;
    reel.pl.setVolume(1).catch(function () {});
    reel.pl.setMuted(false).then(function () { reel.pl.play().catch(function () {}); soundUI(true); }).catch(function () {});
  }
  ['pointerdown', 'keydown', 'touchend'].forEach(function (t) { document.addEventListener(t, onFirstGesture, true); });

  sndBtn.addEventListener('click', function () {
    var on = !reel.soundOn;
    wantSound = on; reel.blocked = false;
    store('reelSound', on ? 'on' : 'off');
    soundUI(on);
    if (!reel.pl) return;
    if (on) { reel.pl.setVolume(1).catch(function () {}); reel.pl.setMuted(false).catch(function () {}); reel.pl.play().catch(function () {}); }
    else reel.pl.setMuted(true).catch(function () {});
  });

  (function loadReel() {
    var vid = reelSlide.querySelector('.vid');
    var f = document.createElement('iframe');
    f.title = 'rayul showreel';
    f.setAttribute('aria-hidden', 'true');
    f.tabIndex = -1;
    f.allow = 'autoplay; fullscreen';
    f.src = S.vimeoSrc(R.showreel.vimeo, 'autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&playsinline=1&dnt=1&autopause=0');
    vid.appendChild(f);
    var fallback = setTimeout(function () { vid.classList.add('on'); }, 6000);
    soundUI(false);
    S.vimeoApi().then(function (V) {
      reel.pl = new V.Player(f);
      var first = true;
      reel.pl.on('playing', function () {
        clearTimeout(fallback); vid.classList.add('on');
        if (first) { first = false; if (wantSound && active === 0 && !playerOpen) tryUnmute(); }
      });
    }).catch(function () {});
  })();

  function reelEnter() {
    if (!reel.pl) return;
    reel.pl.play().catch(function () {});
    if (wantSound && reel.soundOn) { reel.pl.setMuted(false).catch(function () {}); fadeVolume(1, 400); }
  }
  function reelLeave() {
    if (!reel.pl) return;
    fadeVolume(0, 450).then(function () {
      if (active !== 0) { reel.pl.pause().catch(function () {}); reel.pl.setVolume(1).catch(function () {}); }
    });
  }

  /* ---------- which slide is on screen ---------- */
  function setActive(i) {
    if (i === active) return;
    var prev = active;
    active = i;
    loadBg(i); loadBg(i + 1);
    Object.keys(bg).forEach(function (k) { if (+k === i && !playerOpen) bg[k].play(); else bg[k].pause(); });
    if (i === 0 && prev !== -1) reelEnter();
    if (i !== 0 && prev === 0) reelLeave();
    var cur = jumpList.querySelector('[aria-current="true"]');
    if (cur) cur.removeAttribute('aria-current');
    if (i > 0) { var b = jumpList.children[i - 1]; if (b) b.firstChild.setAttribute('aria-current', 'true'); }
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) setActive(+en.target.dataset.i); });
  }, { root: root, threshold: 0.6 });
  slides.forEach(function (s) { io.observe(s); });

  /* ---------- jump list ---------- */
  var jump = document.getElementById('jump');
  var jumpList = document.getElementById('jump-list');
  jumpList.innerHTML = list.map(function (p, k) {
    return '<li><button type="button" data-go="' + (k + 1) + '">' +
      '<span class="n">' + S.pad(k + 1) + '</span>' +
      '<span class="t">' + S.esc(S.name(p)) + '</span>' +
      '<span class="r">' + S.roles(p) + '</span>' +
      '<span class="m">' + S.meta(p) + '</span></button></li>';
  }).join('');
  var jumpOpener = null;
  function openJump() {
    jumpOpener = document.activeElement;
    jump.classList.add('is-open');
    var cur = jumpList.querySelector('[aria-current="true"]') || jumpList.querySelector('button');
    cur.focus({ preventScroll: true });
  }
  function closeJump() { jump.classList.remove('is-open'); if (jumpOpener && jumpOpener.focus) jumpOpener.focus({ preventScroll: true }); }
  document.getElementById('jump-close').addEventListener('click', closeJump);
  jumpList.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]');
    if (!b) return;
    jump.classList.remove('is-open');
    goTo(+b.dataset.go, true);
    var s = slides[+b.dataset.go];
    var t = s && s.querySelector('h2 button'); if (t) t.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && jump.classList.contains('is-open')) closeJump(); });

  /* ---------- overlay player ---------- */
  function openFilm(k) { S.openPlayer(list, k, 'work'); }
  document.addEventListener('player:open', function () {
    playerOpen = true;
    Object.keys(bg).forEach(function (k) { bg[k].pause(); });
    if (reel.pl) { reel.pl.setMuted(true).catch(function () {}); reel.pl.pause().catch(function () {}); }
  });
  document.addEventListener('player:close', function (e) {
    playerOpen = false;
    var d = e.detail || {};
    if (d.ctx === 'work' && d.index + 1 !== active) { goTo(d.index + 1, true); }
    else if (bg[active]) bg[active].play();
    if (active === 0 && reel.pl) { reel.pl.play().catch(function () {}); if (reel.soundOn) reel.pl.setMuted(false).catch(function () {}); }
  });

  // Open straight into a film from a shared link: rayul.ca/#project-id
  var hash = decodeURIComponent(location.hash.slice(1));
  if (hash) {
    var k = list.findIndex(function (p) { return p.id === hash; });
    if (k > -1) { goTo(k + 1, true); openFilm(k); }
    else if (S.byId(hash)) S.openPlayer([S.byId(hash)], 0, 'link');
  }
})();
