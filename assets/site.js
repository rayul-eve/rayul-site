/* ============================================================
   rayul.ca — shared helpers + overlay player
   Needs assets/data/projects.js loaded first (window.RAYUL).
   ============================================================ */
(function () {
  'use strict';

  var R = window.RAYUL;
  var ROLE = { direction: 'DIRECTION', dp: 'DP', edit: 'EDIT', colour: 'COLOUR', vfx: 'VFX' };
  var LOGOS = [
    ['sony.png', 'Sony'],
    ['spencerbadu.png', 'Spencer Badu'],
    ['vitaly.png', 'Vitaly'],
    ['acronym.png', 'Acronym'],
    ['4ye.png', '4YE'],
    ['momandpop.png', 'Mom + Pop'],
    ['remixproject.png', 'The Remix Project'],
    ['menuextra.png', 'Menu Extra'],
    ['nespresso.png', 'Nespresso'],
    ['nomad.png', 'Nomad'],
    ['artscape.png', 'Toronto Artscape Foundation'] // always last
  ];
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOBILE = window.matchMedia('(max-width: 700px)');

  /* ---------- text ---------- */
  function up(s) { return (s || '').toUpperCase(); }
  function name(p) { return up(p.client) + (p.title ? ' · ' + up(p.title) : ''); }
  function roles(p) { return p.roles.map(function (r) { return ROLE[r] || up(r); }).join(' / '); }
  function meta(p) { return up(p.type) + ', ' + p.year; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- data ---------- */
  var BY_ID = {};
  R.projects.forEach(function (p, i) { p._i = i; BY_ID[p.id] = p; });
  function byId(id) { return BY_ID[id]; }
  function byYear(list) {
    return list.slice().sort(function (a, b) { return (+b.year - +a.year) || (a._i - b._i); });
  }
  function workList() { return R.work.map(byId).filter(Boolean); }
  // Index ALL: newest first, then the featured picks, then everything else newest first.
  function indexAll() {
    var newest = R.projects[0];
    var feat = R.featured.map(byId).filter(function (p) { return p && p !== newest; });
    var rest = byYear(R.projects.filter(function (p) { return p !== newest && feat.indexOf(p) === -1; }));
    return [newest].concat(feat, rest);
  }
  function indexByRole(role) {
    return byYear(R.projects.filter(function (p) { return p.roles.indexOf(role) !== -1; }));
  }

  /* ---------- logo strip ---------- */
  function fillMarquee(el) {
    var track = document.createElement('div');
    track.className = 'mq-track';
    var html = '';
    for (var pass = 0; pass < 2; pass++) {
      LOGOS.forEach(function (l) {
        html += '<img src="assets/logos/white/' + l[0] + '" alt="' + (pass ? '' : esc(l[1])) + '"' +
          (pass ? ' aria-hidden="true"' : '') + ' loading="lazy" decoding="async">';
      });
    }
    track.innerHTML = html;
    el.appendChild(track);
  }

  /* ---------- script loader ---------- */
  var scripts = {};
  function loadScript(src) {
    if (!scripts[src]) {
      scripts[src] = new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = src; s.async = true; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    return scripts[src];
  }
  function vimeoApi() { return loadScript('https://player.vimeo.com/api/player.js').then(function () { return window.Vimeo; }); }
  var ytPromise;
  function youtubeApi() {
    if (!ytPromise) {
      ytPromise = new Promise(function (res) {
        if (window.YT && window.YT.Player) return res(window.YT);
        var prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function () { if (prev) prev(); res(window.YT); };
        loadScript('https://www.youtube.com/iframe_api').catch(function () {});
      });
    }
    return ytPromise;
  }
  function vimeoSrc(v, params) {
    return 'https://player.vimeo.com/video/' + v.id + '?' + (v.hash ? 'h=' + v.hash + '&' : '') + params;
  }

  /* ============================================================
     OVERLAY PLAYER
     ============================================================ */
  var ICON_PAUSE = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.5v9M9.5 1.5v9" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
  var ICON_PLAY = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z" fill="currentColor"/></svg>';
  var ICON_FS = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="4" width="13" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 1.5h-2.5v2.5M12 1.5h2.5v2.5M4 14.5h-2.5v-2.5M12 14.5h2.5v-2.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';

  var P = {
    el: null, list: [], i: 0, ctx: null, adapter: null,
    playing: false, t: 0, dur: 0, stamp: 0, muted: false, raf: 0, lastFocus: null
  };

  function build() {
    var el = document.createElement('div');
    el.className = 'player';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Video player');
    el.innerHTML =
      '<div class="player-top">' +
        '<span class="pos quiet"></span>' +
        '<button type="button" class="player-close">CLOSE <span class="dim only-desktop">ESC</span></button>' +
      '</div>' +
      '<div class="player-stage">' +
        '<div class="player-frame"><img class="poster" alt=""><div class="slot"></div>' +
          '<button type="button" class="click-catch" aria-label="Play or pause"></button></div>' +
        '<div class="player-controls">' +
          '<button type="button" class="ctl play" aria-label="Pause">' + ICON_PAUSE + '</button>' +
          '<div class="scrub" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
            '<div class="scrub-bar"><div class="scrub-fill"></div><div class="scrub-head"></div></div></div>' +
          '<span class="tc">00:00:00:00</span>' +
          '<button type="button" class="ctl snd" aria-pressed="true">SOUND ON</button>' +
          '<button type="button" class="ctl fs"><span class="only-desktop">FULL SCREEN</span>' +
            '<span class="only-mobile" aria-hidden="true">' + ICON_FS + '</span><span class="sr-only only-mobile">Full screen</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="player-foot">' +
        '<div><h2 class="player-title"></h2><span class="quiet meta"></span></div>' +
        '<nav class="player-nav" aria-label="More projects">' +
          '<button type="button" class="prev"><span class="lbl">PREV</span><span class="ttl"></span></button>' +
          '<button type="button" class="next"><span class="lbl">NEXT</span><span class="ttl"></span></button>' +
        '</nav>' +
      '</div>';
    document.body.appendChild(el);
    P.el = el;
    P.q = function (s) { return el.querySelector(s); };

    P.q('.player-close').addEventListener('click', close);
    P.q('.play').addEventListener('click', toggle);
    P.q('.click-catch').addEventListener('click', toggle);
    P.q('.snd').addEventListener('click', toggleSound);
    P.q('.fs').addEventListener('click', fullscreen);
    P.q('.prev').addEventListener('click', function () { go(-1); });
    P.q('.next').addEventListener('click', function () { go(1); });

    var scrub = P.q('.scrub');
    function seekFrom(e) {
      var r = scrub.getBoundingClientRect();
      var x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      seek(x * P.dur);
    }
    scrub.addEventListener('pointerdown', function (e) {
      scrub.setPointerCapture(e.pointerId); seekFrom(e);
      function mv(ev) { seekFrom(ev); }
      function upH() { scrub.removeEventListener('pointermove', mv); scrub.removeEventListener('pointerup', upH); }
      scrub.addEventListener('pointermove', mv); scrub.addEventListener('pointerup', upH);
    });
    scrub.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); seek(cur() + 5); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); seek(cur() - 5); }
    });

    document.addEventListener('keydown', function (e) {
      if (!el.classList.contains('is-open')) return;
      if (e.key === 'Escape' && !document.fullscreenElement) { e.preventDefault(); if (el.classList.contains('is-pseudo-fs')) exitPseudo(); else close(); }
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); toggle(); }
      else if (e.key === 'm' || e.key === 'M') toggleSound();
      else if (e.key === 'Tab') trap(e);
    });
    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement && screen.orientation && screen.orientation.unlock) {
        try { screen.orientation.unlock(); } catch (err) { /* ignore */ }
      }
    });
  }

  function trap(e) {
    var f = Array.prototype.filter.call(P.el.querySelectorAll('button, [tabindex="0"]'), function (n) { return n.offsetParent !== null && !n.disabled; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- adapters: one interface for Vimeo + YouTube ---------- */
  function vimeoAdapter(p, slot) {
    var iframe = document.createElement('iframe');
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.setAttribute('allowfullscreen', '');
    iframe.title = p.client + ' ' + p.title;
    iframe.src = vimeoSrc(p.vimeo, 'autoplay=1&controls=0&title=0&byline=0&portrait=0&playsinline=1&dnt=1&autopause=0');
    slot.appendChild(iframe);
    var a = { player: null, kind: 'vimeo' };
    var ready = vimeoApi().then(function (V) {
      a.player = new V.Player(iframe);
      a.player.on('play', function () { onState(true); });
      a.player.on('playing', function () { onState(true); reveal(); });
      a.player.on('pause', function () { onState(false); });
      a.player.on('ended', function () { onState(false); });
      a.player.on('timeupdate', function (d) { onTime(d.seconds, d.duration); });
      a.player.getDuration().then(function (d) { P.dur = d; });
      a.player.getPaused().then(function (paused) { onState(!paused); if (!paused) reveal(); });
      return a.player;
    }).catch(function () { return new Promise(function () {}); });
    a.play = function () { ready.then(function (pl) { pl.play().catch(function () { onState(false); }); }); };
    a.pause = function () { ready.then(function (pl) { pl.pause(); }); };
    a.seek = function (s) { ready.then(function (pl) { pl.setCurrentTime(s); }); };
    a.mute = function (m) { ready.then(function (pl) { pl.setMuted(m); }); };
    a.native = function () { ready.then(function (pl) { pl.requestFullscreen(); }); };
    a.destroy = function () { ready.then(function (pl) { pl.destroy(); }).catch(function () {}); iframe.remove(); };
    return a;
  }

  function youtubeAdapter(p, slot) {
    var host = document.createElement('div');
    host.className = 'yt-host';
    slot.appendChild(host);
    var a = { player: null, kind: 'youtube' }, timer = 0;
    var ready = youtubeApi().then(function (YT) {
      return new Promise(function (res) {
        a.player = new YT.Player(host, {
          videoId: p.youtube,
          playerVars: { autoplay: 1, controls: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1 },
          events: {
            onReady: function (e) { P.dur = e.target.getDuration(); e.target.playVideo(); res(e.target); },
            onStateChange: function (e) {
              var on = e.data === 1;
              onState(on);
              if (on) reveal();
            }
          }
        });
        timer = setInterval(function () {
          if (a.player && a.player.getCurrentTime) onTime(a.player.getCurrentTime(), a.player.getDuration());
        }, 250);
      });
    }).catch(function () { return new Promise(function () {}); });
    a.play = function () { ready.then(function (pl) { pl.playVideo(); }); };
    a.pause = function () { ready.then(function (pl) { pl.pauseVideo(); }); };
    a.seek = function (s) { ready.then(function (pl) { pl.seekTo(s, true); }); };
    a.mute = function (m) { ready.then(function (pl) { if (m) pl.mute(); else pl.unMute(); }); };
    a.native = null;
    a.destroy = function () { clearInterval(timer); ready.then(function (pl) { pl.destroy(); }).catch(function () {}); var n = P.q('.slot'); if (n) n.innerHTML = ''; };
    return a;
  }

  /* ---------- state ---------- */
  function onState(on) {
    P.playing = on; P.stamp = performance.now();
    var b = P.q('.play');
    b.innerHTML = on ? ICON_PAUSE : ICON_PLAY;
    b.setAttribute('aria-label', on ? 'Pause' : 'Play');
  }
  function onTime(t, d) { P.t = t; if (d) P.dur = d; P.stamp = performance.now(); }
  function cur() { return P.playing ? P.t + (performance.now() - P.stamp) / 1000 : P.t; }
  function reveal() { var img = P.q('.poster'); if (img) img.style.opacity = '0'; }

  function tick() {
    var t = Math.min(cur(), P.dur || cur());
    var pct = P.dur ? (t / P.dur) * 100 : 0;
    P.q('.scrub-fill').style.width = pct + '%';
    P.q('.scrub-head').style.left = pct + '%';
    P.q('.scrub').setAttribute('aria-valuenow', Math.round(pct));
    var s = Math.floor(t);
    P.q('.tc').textContent = MOBILE.matches
      ? pad(Math.floor(s / 60)) + ':' + pad(s % 60)
      : pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60) + ':' + pad(Math.floor((t - s) * 24));
    P.raf = requestAnimationFrame(tick);
  }

  function toggle() { if (!P.adapter) return; if (P.playing) P.adapter.pause(); else P.adapter.play(); }
  function seek(s) {
    if (!P.adapter || !P.dur) return;
    s = Math.max(0, Math.min(P.dur - 0.1, s));
    P.t = s; P.stamp = performance.now();
    P.adapter.seek(s);
  }
  function setSound(muted) {
    P.muted = muted;
    var b = P.q('.snd');
    b.textContent = muted ? 'SOUND OFF' : (MOBILE.matches ? 'SOUND' : 'SOUND ON');
    b.setAttribute('aria-pressed', muted ? 'false' : 'true');
    if (P.adapter) P.adapter.mute(muted);
  }
  function toggleSound() { setSound(!P.muted); }

  /* ---------- full screen: landscape on phones ---------- */
  function fullscreen() {
    var stage = P.q('.player-stage');
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (stage.requestFullscreen && document.fullscreenEnabled) {
      stage.requestFullscreen().then(function () {
        if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {});
      }).catch(function () { fallbackFs(); });
    } else {
      fallbackFs();
    }
  }
  function fallbackFs() {
    // iPhone: Vimeo opens Apple's native full-screen player (rotates with the phone).
    if (P.adapter && P.adapter.native) { P.adapter.native(); return; }
    P.el.classList.add('is-pseudo-fs');
  }
  function exitPseudo() { P.el.classList.remove('is-pseudo-fs'); }

  /* ---------- open / close / navigate ---------- */
  function render() {
    var p = P.list[P.i];
    if (P.adapter) { P.adapter.destroy(); P.adapter = null; }
    P.q('.slot').innerHTML = '';
    P.t = 0; P.dur = 0; P.playing = false;
    var img = P.q('.poster');
    img.style.transition = 'none'; img.style.opacity = p.thumb ? '1' : '0';
    if (p.thumb) img.src = p.thumb; else img.removeAttribute('src');
    void img.offsetWidth; img.style.transition = 'opacity 0.5s ease';

    P.q('.pos').textContent = pad(P.i + 1) + ' / ' + pad(P.list.length);
    P.q('.player-title').textContent = name(p);
    P.q('.meta').textContent = roles(p) + ' · ' + meta(p);

    var prev = P.list[P.i - 1], next = P.list[P.i + 1];
    var bp = P.q('.prev'), bn = P.q('.next');
    bp.disabled = !prev; bn.disabled = !next;
    bp.querySelector('.ttl').textContent = prev ? name(prev) : '';
    bn.querySelector('.ttl').textContent = next ? (MOBILE.matches ? up(next.client) : name(next)) : '';

    P.adapter = p.vimeo ? vimeoAdapter(p, P.q('.slot')) : youtubeAdapter(p, P.q('.slot'));
    onState(true); P.playing = false; // show the pause icon while it starts; time only runs once the video reports playing
    setSound(P.muted);
    if (history.replaceState) history.replaceState(null, '', '#' + p.id);
  }

  function open(list, i, ctx) {
    if (!P.el) build();
    P.list = list; P.i = i; P.ctx = ctx || null;
    P.lastFocus = document.activeElement;
    P.muted = false;
    P.el.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    document.dispatchEvent(new CustomEvent('player:open'));
    render();
    cancelAnimationFrame(P.raf); P.raf = requestAnimationFrame(tick);
    P.q('.player-close').focus({ preventScroll: true });
  }
  function close() {
    if (!P.el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    exitPseudo();
    if (P.adapter) { P.adapter.destroy(); P.adapter = null; }
    cancelAnimationFrame(P.raf);
    P.el.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    document.dispatchEvent(new CustomEvent('player:close', { detail: { index: P.i, ctx: P.ctx } }));
    if (P.lastFocus && P.lastFocus.focus) P.lastFocus.focus({ preventScroll: true });
  }
  function go(d) {
    var n = P.i + d;
    if (n < 0 || n >= P.list.length) return;
    P.i = n; render();
  }

  window.SITE = {
    name: name, roles: roles, meta: meta, up: up, pad: pad, esc: esc,
    byId: byId, workList: workList, indexAll: indexAll, indexByRole: indexByRole,
    fillMarquee: fillMarquee, vimeoApi: vimeoApi, youtubeApi: youtubeApi, vimeoSrc: vimeoSrc,
    openPlayer: open, closePlayer: close, REDUCED: REDUCED, MOBILE: MOBILE
  };
})();
