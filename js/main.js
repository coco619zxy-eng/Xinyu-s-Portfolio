/* =========================================================
   Xinyu Zhang (Coco) — Portfolio
   ========================================================= */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const html = (str) => {
    const t = document.createElement('template');
    t.innerHTML = str.trim();
    return t.content.firstElementChild;
  };

  /* ---------- Smooth "squircle" corners (Figma corner smoothing, as on the reference) ---------- */
  function squirclePath(w, h, scale = 1) {
    // scale > 1 = rounder corners (data-squircle="1.7"), never more than the shape allows
    const k = Math.min(Math.min(1, w / 480, h / 480) * scale, Math.min(w, h) / 160);
    const e = 80 * k, a = 42.288 * k, b = 23.431 * k, c = 11.716 * k;
    const r = (n) => Math.round(n * 100) / 100;
    return `M ${r(e)} 0 L ${r(w - e)} 0 ` +
      `C ${r(w - a)} 0 ${r(w - b)} 0 ${r(w - c)} ${r(c)} C ${r(w)} ${r(b)} ${r(w)} ${r(a)} ${r(w)} ${r(e)} ` +
      `L ${r(w)} ${r(h - e)} ` +
      `C ${r(w)} ${r(h - a)} ${r(w)} ${r(h - b)} ${r(w - c)} ${r(h - c)} C ${r(w - b)} ${r(h)} ${r(w - a)} ${r(h)} ${r(w - e)} ${r(h)} ` +
      `L ${r(e)} ${r(h)} ` +
      `C ${r(a)} ${r(h)} ${r(b)} ${r(h)} ${r(c)} ${r(h - c)} C 0 ${r(h - b)} 0 ${r(h - a)} 0 ${r(h - e)} ` +
      `L 0 ${r(e)} C 0 ${r(a)} 0 ${r(b)} ${r(c)} ${r(c)} C ${r(b)} 0 ${r(a)} 0 ${r(e)} 0 Z`;
  }
  if (window.CSS && CSS.supports('clip-path', 'path("M0 0 L1 0 L1 1 Z")')) {
    const ro = new ResizeObserver((entries) => {
      for (const { target, borderBoxSize } of entries) {
        // the outline follows the element's outer edge (padding included, e.g. the Graphic page mats)
        const box = borderBoxSize && borderBoxSize[0];
        const width = box ? box.inlineSize : target.offsetWidth;
        const height = box ? box.blockSize : target.offsetHeight;
        if (!width || !height) continue;
        const shape = `path("${squirclePath(width, height, parseFloat(target.dataset.squircle) || 1)}")`;
        target.style.clipPath = shape;
        target.style.setProperty('--sq', shape);     // same outline for the folded corner's flap
      }
    });
    // (cards marked data-square keep plain square corners — the Motions & Animations films)
    document.querySelectorAll('.card:not([data-square]), .portrait, [data-squircle]').forEach((el) => ro.observe(el, { box: 'border-box' }));
  }

  /* ---------- Pause animations that are off-screen ---------- */
  const visIO = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.classList.toggle('is-paused', !e.isIntersecting);
  }, { rootMargin: '100px' });

  /* =========================================================
     Placeholders (used until assets/videos/*.mp4 exist)
     ========================================================= */
  const ARROW_CURSOR =
    '<svg class="mo-cursor" viewBox="0 0 24 26" aria-hidden="true">' +
    '<path d="M3 2v19l5-5 3.4 7.4 3.2-1.4L11.2 15H18z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  function buildMotion() {
    return html(`
      <div class="ph ph-motion" aria-hidden="true">
        <div class="mo-arc"></div>
        <div class="mo-a-shadow"></div>
        <div class="mo-shape mo-a">A</div>
        <div class="mo-arm">
          <div class="mo-b-wrap">
            <div class="mo-shape mo-b">B</div>
            <div class="mo-sel"><i></i><i></i><i></i><i></i></div>
            ${ARROW_CURSOR}
          </div>
        </div>
        <div class="mo-shape mo-c">C</div>
        <div class="mo-timeline">
          <div class="mo-swatches">
            <i style="--c:var(--lime)"></i><i style="--c:var(--orange)"></i><i style="--c:var(--lilac)"></i>
          </div>
          <div class="mo-tracks">
            <div class="mo-track"><span class="mo-bar" style="--c:var(--lime);--l:3%;--w:44%"></span></div>
            <div class="mo-track"><span class="mo-bar" style="--c:var(--orange);--l:20%;--w:62%"></span></div>
            <div class="mo-track"><span class="mo-bar" style="--c:var(--lilac);--l:56%;--w:38%"></span></div>
            <div class="mo-playhead"></div>
          </div>
        </div>
      </div>`);
  }

  // Social Media Designs — an endlessly scrolling feed of post designs
  const TILES = {
    sale:  '<div class="so-tile so-sale"><span class="so-kicker">Summer</span><span class="so-big">30%</span></div>',
    dot:   '<div class="so-tile so-dot"><i></i></div>',
    sky:   '<div class="so-tile so-sky"><i></i></div>',
    dusk:  '<div class="so-tile so-sky so-sky--dusk"><i></i></div>',
    type:  '<div class="so-tile so-type"><em>New in</em><span>Collection 02</span></div>',
    post:  '<div class="so-tile so-post"><i class="av"></i><b></b><b></b><b class="s"></b></div>',
    star:  '<div class="so-tile so-star"><i></i></div>',
    grid4: '<div class="so-tile so-grid4"><i></i><i></i><i></i><i></i></div>',
    swipe: '<div class="so-tile so-swipe"><span>Swipe →</span><span class="dots"><i></i><i></i><i></i></span></div>',
  };
  function buildSocial() {
    const cols = [
      { dur: 30, rev: false, tiles: ['sale', 'sky', 'post', 'star', 'type'] },
      { dur: 36, rev: true,  tiles: ['swipe', 'dot', 'dusk', 'grid4', 'sale'] },
      { dur: 26, rev: false, tiles: ['type', 'star', 'grid4', 'post', 'dot'] },
    ];
    const col = ({ dur, rev, tiles }) => {
      const set = tiles.map((t) => TILES[t]).join('');
      return `<div class="so-col${rev ? ' so-col--rev' : ''}" style="--dur:${dur}s">${set}${set}</div>`;
    };
    return html(`<div class="ph ph-social" aria-hidden="true">${cols.map(col).join('')}</div>`);
  }

  function buildExperimental() {
    const el = html('<div class="ph ph-exp" aria-hidden="true"></div>');
    dotField(el);
    return el;
  }

  /* Interactive interference field — two wave sources, one follows the cursor */
  function dotField(host) {
    const canvas = document.createElement('canvas');
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const stops = ['#26251F', '#4A4F2A', '#8E9A3E', '#EEF27A', '#F6C85A', '#F4A03A'];
    const PAL = buildPalette(stops, 12);
    const TAU = Math.PI * 2;
    let w = 0, h = 0, dpr = 1, visible = false, raf = 0;
    const t0 = performance.now();
    const ptr = { x: .7, y: .4, tx: .7, ty: .4, active: false };

    const ro = new ResizeObserver(([e]) => {
      w = e.contentRect.width; h = e.contentRect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      draw(performance.now());
    });
    ro.observe(host);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduceMotion) raf = requestAnimationFrame(loop);
    });
    io.observe(host);

    // cursor → second wave source (listen on the card / lightbox so it works while expanding)
    requestAnimationFrame(() => {
      const target = host.closest('.card, .lightbox__stage') || host;
      target.addEventListener('pointermove', (ev) => {
        const r = host.getBoundingClientRect();
        ptr.tx = (ev.clientX - r.left) / r.width;
        ptr.ty = (ev.clientY - r.top) / r.height;
        ptr.active = true;
      });
      target.addEventListener('pointerleave', () => { ptr.active = false; });
    });

    function loop(now) {
      raf = 0;
      if (!host.isConnected) { ro.disconnect(); io.disconnect(); return; }
      draw(now);
      if (visible) raf = requestAnimationFrame(loop);
    }

    function draw(now) {
      if (!w || !h) return;
      const t = reduceMotion ? 2 : (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0E0E0D';
      ctx.fillRect(0, 0, w, h);

      const step = Math.max(12, Math.min(w, h) / 22);
      const cols = Math.ceil(w / step) + 1;
      const rows = Math.ceil(h / step) + 1;
      const ox = (w - (cols - 1) * step) / 2;
      const oy = (h - (rows - 1) * step) / 2;
      const s = Math.max(w, h);

      const ax = (.5 + .28 * Math.sin(t * .45)) * w;
      const ay = (.5 + .24 * Math.cos(t * .33)) * h;
      const idleX = .5 + .3 * Math.cos(t * .29 + 1);
      const idleY = .5 + .26 * Math.sin(t * .41 + 2);
      const gx = ptr.active ? ptr.tx : idleX;
      const gy = ptr.active ? ptr.ty : idleY;
      ptr.x += (gx - ptr.x) * .08;
      ptr.y += (gy - ptr.y) * .08;
      const bx = ptr.x * w, by = ptr.y * h;

      const paths = PAL.map(() => new Path2D());
      for (let j = 0; j < rows; j++) {
        const y = oy + j * step;
        for (let i = 0; i < cols; i++) {
          const x = ox + i * step;
          const d1 = Math.hypot(x - ax, y - ay) / s;
          const d2 = Math.hypot(x - bx, y - by) / s;
          const v = (Math.sin(d1 * 26 - t * 2.4) + Math.sin(d2 * 22 - t * 1.9)) * .5;
          const u = (v + 1) * .5;
          const r = step * .46 * (.1 + .9 * u * u);
          const p = paths[Math.min(PAL.length - 1, (u * PAL.length) | 0)];
          p.moveTo(x + r, y);
          p.arc(x, y, r, 0, TAU);
        }
      }
      paths.forEach((p, i) => { ctx.fillStyle = PAL[i]; ctx.fill(p); });
    }
  }

  function buildPalette(stops, n) {
    const rgb = stops.map((hx) => [1, 3, 5].map((i) => parseInt(hx.slice(i, i + 2), 16)));
    return Array.from({ length: n }, (_, k) => {
      const f = (k / (n - 1)) * (rgb.length - 1);
      const i = Math.min(rgb.length - 2, Math.floor(f));
      const m = f - i;
      const c = rgb[i].map((v, ch) => Math.round(v + (rgb[i + 1][ch] - v) * m));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    });
  }

  const PLACEHOLDERS = { motion: buildMotion, social: buildSocial, experimental: buildExperimental };

  /* ---------- Mount: placeholder underneath, video on top once it loads ---------- */
  function mountMedia(host, { video, placeholder, poster }) {
    const build = PLACEHOLDERS[placeholder];
    if (build) {
      const ph = build();
      host.appendChild(ph);
      visIO.observe(ph);
    }
    if (!video) return null;
    const v = document.createElement('video');
    v.className = 'media-video';
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'none';         // nothing downloads until the card is near the screen (see videoIO)
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    if (poster) {               // exact first frame — shows instantly while the video buffers
      v.poster = poster;
      host.classList.add('has-poster');
    }
    v.addEventListener('loadeddata', () => {
      host.classList.add('has-video');
      host.dispatchEvent(new CustomEvent('media:ready', { detail: v }));
    }, { once: true });
    v.addEventListener('error', () => { host.classList.remove('has-poster'); v.remove(); }, { once: true });
    v.src = video;
    host.appendChild(v);
    return v;
  }

  const safePlay = (v) => { if (v && v.isConnected) { const p = v.play(); if (p) p.catch(() => {}); } };

  /* ---------- Cards: previews loop continuously whenever they're on (or near) the screen ---------- */
  const mediaCards = [...document.querySelectorAll('.card--media')];
  const inView = new Set();
  const cardVideo = (card) => card.querySelector('.card__media video');
  const lightboxOpen = () => { const el = document.querySelector('.lightbox'); return !!el && !el.hidden; };

  // Muted preview. If the browser refuses to autoplay video (Safari in Low Power Mode, iPhone
  // Low Power Mode…), show the same clip through an <img> instead — Safari plays MP4 in <img>
  // like a silent looping GIF, and autoplay rules don't apply to images.
  function playPreview(card) {
    const host = card.querySelector('.card__media');
    const v = cardVideo(card);
    if (!v || host.classList.contains('is-img') || lightboxOpen()) return;
    const p = v.play();
    if (p) p.catch((err) => { if (err && err.name === 'NotAllowedError') imageFallback(card); });
  }
  function imageFallback(card) {
    const host = card.querySelector('.card__media');
    if (host.classList.contains('is-img')) return;
    host.classList.add('is-img');
    const img = new Image();
    img.className = 'media-img';
    img.alt = '';
    img.decoding = 'async';
    img.addEventListener('error', () => {            // browser can't show video in <img>: stay on the poster
      img.remove();
      host.classList.remove('is-img');
    }, { once: true });
    img.src = card.dataset.video;
    host.appendChild(img);                           // above the paused <video>
  }
  const playVisible = () => { if (!lightboxOpen()) inView.forEach(playPreview); };

  const videoIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = cardVideo(e.target);
      if (e.isIntersecting) {
        inView.add(e.target);
        playPreview(e.target);
      } else {
        inView.delete(e.target);
        if (v) v.pause();                 // off-screen: save battery, resumes on the way back
      }
    }
  }, { rootMargin: '200px 0px' });

  // Browsers can hold back playback (background tab, Low Power Mode…) — try again whenever we can
  document.addEventListener('visibilitychange', () => { if (!document.hidden) playVisible(); });
  ['pointerdown', 'keydown', 'touchstart'].forEach((type) =>
    window.addEventListener(type, playVisible, { once: true, passive: true }));

  // The media window stops just short of the text block — measured, so two-line titles never collide.
  // Normal cards: text on top, media below. .card--media-top: media on top, text at the bottom.
  const headRO = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const card = target.closest('.card--media');
      const head = card.querySelector('.card__head');
      const gap = Math.max(18, Math.min(27, card.clientWidth * .053));
      if (card.classList.contains('card--media-top')) {
        card.style.setProperty('--media-bottom', `${Math.round(card.clientHeight - head.offsetTop + gap)}px`);
      } else {
        card.style.setProperty('--media-top', `${Math.round(head.offsetTop + head.offsetHeight + gap)}px`);
      }
    }
  });

  mediaCards.forEach((card) => {
    const head = card.querySelector('.card__head');
    if (head) { headRO.observe(head); headRO.observe(card); }   // .card--bleed cards have no text block
    const host = card.querySelector('.card__media');
    const v = mountMedia(host, card.dataset);
    if (v) {
      videoIO.observe(card);
      v.addEventListener('canplay', () => { if (inView.has(card)) playPreview(card); });
      card.addEventListener('mouseenter', () => { if (v.parentNode === host) playPreview(card); });
    }
    // cards that point at another page just open it; the rest play full screen
    if (!card.getAttribute('href').startsWith('#')) return;
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(card);
    });
  });

  /* ---------- Sidebar category links: scroll to the card and outline it ---------- */
  document.querySelectorAll('.nav a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      target.classList.remove('is-flash');
      void target.offsetWidth;            // restart the animation on repeat clicks
      target.classList.add('is-flash');
      target.addEventListener('animationend', () => target.classList.remove('is-flash'), { once: true });
    });
  });

  /* ---------- Lightbox ---------- */
  const lb = document.querySelector('.lightbox');
  const soundBtn = lb && lb.querySelector('.lightbox__sound');
  const navBtns = lb ? [...lb.querySelectorAll('.lightbox__nav')] : [];
  let gallery = null;               // { items, index, title, year } while browsing a project's works
  let lastFocus = null;
  let closeTimer = 0;
  let lbVideo = null;
  let returnVideo = null;           // puts the borrowed card video back where it came from

  function openLightbox(card) {
    if (!lb) return;
    if (closeTimer) { clearTimeout(closeTimer); finishClose(); }
    const stage = lb.querySelector('.lightbox__stage');
    const inner = lb.querySelector('.lightbox__inner');
    stage.replaceChildren();
    stage.classList.remove('has-video');
    gallery = null;
    lb.classList.remove('is-gallery', 'is-tall');
    navBtns.forEach((b) => { b.hidden = true; });
    const portrait = window.innerHeight > window.innerWidth;   // phones: taller stage for placeholders
    inner.style.setProperty('--ar-n', portrait ? .8 : 1.6);
    stage.style.setProperty('--ar', portrait ? '4 / 5' : '16 / 10');
    if (card.dataset.ratio) {                                    // known shape of the full-screen video
      const [rw, rh] = card.dataset.ratio.split('/').map(Number);
      inner.style.setProperty('--ar-n', rw / rh);
      stage.style.setProperty('--ar', card.dataset.ratio);
    }

    lb.querySelector('.lightbox__title').textContent = card.dataset.title || '';
    lb.querySelector('.lightbox__year').textContent = card.dataset.year || '';

    // pause the muted card previews while the player is open
    document.querySelectorAll('.card video').forEach((cv) => cv.pause());

    // Borrow the card's own <video> (instant first frame, nothing downloaded twice).
    // Cards without a video show their placeholder design instead (e.g. the Social feed).
    const host = card.querySelector('.card__media');
    const v = host.querySelector('video');
    if (!v) mountMedia(stage, { placeholder: card.dataset.placeholder });
    lbVideo = v;
    soundBtn.hidden = !(v && 'audio' in card.dataset);

    if (v) {
      stage.appendChild(v);
      const wantSound = 'audio' in card.dataset;
      const full = card.dataset.full;
      let fv = null;          // the full-quality video, if this card has one
      let alive = true;
      // back into the card — underneath the <img> fallback if the card is using one
      returnVideo = () => {
        alive = false;
        if (fv) { fv.pause(); fv.removeAttribute('src'); fv.load(); }   // stop downloading the big file
        v.pause(); v.muted = true;
        host.insertBefore(v, host.querySelector('.media-img'));
      };

      // Size the stage to the video's real proportions — from the preview if it's loaded,
      // otherwise from the full-quality file (in Low Power Mode the preview never loads).
      const fitTo = (el) => {
        if (!alive || !el.videoWidth || !el.videoHeight) return;
        inner.style.setProperty('--ar-n', el.videoWidth / el.videoHeight);
        stage.style.setProperty('--ar', `${el.videoWidth} / ${el.videoHeight}`);
      };
      const fit = () => { if (!card.dataset.ratio) fitTo(v); };   // preview shape = full shape, unless data-ratio says otherwise
      const ready = () => { if (alive) stage.classList.add('has-video'); };
      if (v.readyState >= 1) fit(); else v.addEventListener('loadedmetadata', fit, { once: true });
      if (v.readyState >= 2) ready(); else v.addEventListener('loadeddata', ready, { once: true });
      v.addEventListener('error', () => { soundBtn.hidden = true; }, { once: true });

      v.currentTime = 0;
      if (full) {
        // Full screen plays the full-quality file (1080p, with sound). The light preview holds
        // its first frame on screen until the big file is playing, then it fades in on top.
        // data-controls = a whole film (Motions & Animations): plays once, with the player's own controls
        // (pause, scrub, volume, fullscreen) instead of looping, in a square-cornered stage.
        const film = 'controls' in card.dataset;
        v.pause();
        fv = document.createElement('video');
        fv.className = film ? 'film-video media-video--full' : 'media-video media-video--full';
        fv.loop = !film;
        fv.controls = film;
        if (film) stage.style.borderRadius = '0';
        fv.playsInline = true;
        fv.setAttribute('playsinline', '');
        fv.preload = 'auto';
        fv.muted = !wantSound;
        fv.src = full;
        stage.appendChild(fv);
        lbVideo = fv;
        soundBtn.hidden = !wantSound || film;     // a film's own controls handle the sound
        syncSound();
        fv.addEventListener('loadedmetadata', () => fitTo(fv), { once: true });
        fv.addEventListener('loadeddata', ready, { once: true });
        fv.addEventListener('playing', () => { if (alive) { fv.classList.add('is-ready'); v.pause(); } }, { once: true });
        fv.addEventListener('error', () => {           // full file missing → fall back to the (silent) preview
          if (!alive) return;
          fv.remove(); fv = null; lbVideo = v; soundBtn.hidden = true; safePlay(v);
        }, { once: true });
        // started inside the click, so the browser allows playback with sound
        const p = fv.play();
        if (p) p.catch((err) => {
          if (alive && fv && err && err.name === 'NotAllowedError') { fv.muted = true; syncSound(); safePlay(fv); }
        });
      } else if (wantSound) {
        // opened by a click / key press, so the browser allows playback with sound
        v.muted = false;
        syncSound();
        const p = v.play();
        if (p) p.catch(() => { v.muted = true; syncSound(); safePlay(v); });
      } else {
        safePlay(v);
      }
    }

    lastFocus = card;
    lb.hidden = false;
    root.classList.add('is-locked');
    requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('is-open')));
    lb.querySelector('.lightbox__close').focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!lb || lb.hidden || closeTimer) return;
    if (lbVideo) lbVideo.pause();                  // stop the audio straight away
    lb.classList.remove('is-open');
    root.classList.remove('is-locked');
    closeTimer = setTimeout(finishClose, 380);     // after the fade-out
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  function finishClose() {
    closeTimer = 0;
    gallery = null;
    lb.classList.remove('is-gallery', 'is-tall');
    navBtns.forEach((b) => { b.hidden = true; });
    if (returnVideo) { returnVideo(); returnVideo = null; }
    lbVideo = null;
    lb.hidden = true;
    lb.querySelector('.lightbox__stage').replaceChildren();
    lb.querySelector('.lightbox__stage').style.borderRadius = '';   // back to the player's own corners
    playVisible();                                  // previews carry on looping
  }

  function syncSound() {
    const on = !!lbVideo && !lbVideo.muted;
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.querySelector('.lightbox__sound-label').textContent = on ? 'Sound on' : 'Sound off';
  }
  function toggleSound() {
    if (!lbVideo || soundBtn.hidden || closeTimer) return;
    lbVideo.muted = !lbVideo.muted;
    syncSound();
    safePlay(lbVideo);
  }

  /* ---------- Image galleries (Graphic Design page): a work → full screen, ← → to browse ---------- */
  function showImage() {
    const { items, index, title, year } = gallery;
    const a = items[index];
    const [w, h] = (a.dataset.size || '4/5').split('/').map(Number);
    const stage = lb.querySelector('.lightbox__stage');
    const inner = lb.querySelector('.lightbox__inner');
    inner.style.setProperty('--ar-n', w / h);
    stage.style.setProperty('--ar', `${w} / ${h}`);
    // data-view="scroll" (a whole landing page): opens at a readable width and scrolls;
    // everything else is shown whole, as it is
    const tall = a.dataset.view === 'scroll';
    lb.classList.toggle('is-tall', tall);
    inner.style.setProperty('--view-w', `${a.dataset.viewW || 460}px`);
    // data-radius="8": round the corners by 8% of the width (app screens have rounded corners); "0" = square
    const r = parseFloat(a.dataset.radius);
    stage.style.borderRadius = r ? `${r}% / ${r * w / h}%` : r === 0 ? '0' : '';
    const thumb = a.querySelector('img');
    const img = new Image();
    img.className = 'media-img lightbox__img';
    img.alt = thumb ? thumb.alt : '';
    img.src = thumb ? (thumb.currentSrc || thumb.src) : a.href;     // the small version shows at once…
    stage.replaceChildren(img);
    stage.scrollTop = 0;
    const full = a.getAttribute('href');
    if (thumb && full && !img.src.endsWith(full)) {                 // …then the sharp one swaps in
      const hi = new Image();
      hi.onload = () => { if (gallery && gallery.items[gallery.index] === a) img.src = hi.src; };
      hi.src = full;
    }
    lb.querySelector('.lightbox__title').textContent = a.dataset.title || title;   // a work's own title wins
    lb.querySelector('.lightbox__year').textContent =
      items.length > 1 ? `${index + 1} / ${items.length}` : year;
  }
  function openGallery(items, index, title, year) {
    if (!lb) return;
    if (closeTimer) { clearTimeout(closeTimer); finishClose(); }
    gallery = { items, index, title, year };
    lbVideo = null;
    returnVideo = null;
    soundBtn.hidden = true;
    lb.classList.add('is-gallery');
    navBtns.forEach((b) => { b.hidden = items.length < 2; });
    showImage();
    lastFocus = items[index];
    lb.hidden = false;
    root.classList.add('is-locked');
    requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('is-open')));
    lb.querySelector('.lightbox__close').focus({ preventScroll: true });
  }
  function stepGallery(d) {
    if (!gallery || closeTimer) return;
    gallery.index = (gallery.index + d + gallery.items.length) % gallery.items.length;
    lastFocus = gallery.items[gallery.index];
    showImage();
  }
  // a single picture that opens full screen on its own
  document.querySelectorAll('[data-gallery-one]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    openGallery([a], 0, a.dataset.title || '', '');
  }));
  document.querySelectorAll('.gd-gallery, [data-gallery]').forEach((g) => {
    const items = [...g.querySelectorAll('.gd-item, .vb-shot, .tk-page__shot, a.so-item__frame:not(.card)')];
    const sec = g.closest('[data-title]');
    items.forEach((a, i) => a.addEventListener('click', (e) => {
      e.preventDefault();
      openGallery(items, i, sec ? sec.dataset.title : '', sec && sec.dataset.year ? sec.dataset.year : '');
    }));
  });
  if (lb) {
    navBtns.forEach((b) => b.addEventListener('click', () => stepGallery(b.classList.contains('lightbox__nav--prev') ? -1 : 1)));
    // touch: swipe left / right to browse
    let swipeX = null;
    lb.addEventListener('pointerdown', (e) => { if (gallery && e.pointerType !== 'mouse') swipeX = e.clientX; });
    lb.addEventListener('pointerup', (e) => {
      if (swipeX === null) return;
      const dx = e.clientX - swipeX;
      swipeX = null;
      if (Math.abs(dx) > 40) stepGallery(dx < 0 ? 1 : -1);
    });
  }

  if (lb) {
    lb.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    soundBtn.addEventListener('click', toggleSound);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'm' || e.key === 'M') toggleSound();
      if (e.key === 'ArrowLeft') stepGallery(-1);
      if (e.key === 'ArrowRight') stepGallery(1);
      if (e.key === 'Tab') {            // keep focus inside the player
        e.preventDefault();
        const focusables = [...lb.querySelectorAll('button:not([hidden]), video[controls]')];
        const i = focusables.indexOf(document.activeElement);
        const next = (i + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
        focusables[next].focus();
      }
    });
  }

  /* ---------- Reveal on load / scroll ----------
     Whatever comes into view together fades in one after another, in page order
     (heading first, then the works, left to right), 80ms apart. */
  const revealIO = new IntersectionObserver((entries) => {
    const shown = entries.filter((e) => e.isIntersecting).map((e) => e.target)
      .sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    shown.forEach((el, k) => {
      el.style.setProperty('--d', `${Math.min(k, 7) * 80}ms`);
      el.classList.add('is-in');
      revealIO.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  // containers whose children reveal one by one rather than as a single block
  document.querySelectorAll('.reveal-items').forEach((box) => {
    [...box.children].forEach((el) => el.classList.add('reveal'));
  });
  document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));

  /* ---------- Social card: crayon reactions — hearts / stars / +1s well up and spill out ----------
     Each card is a tiny physics world: what pours out of the icon tumbles down under gravity,
     bounces off the card's edges, knocks into the others and piles up at the bottom, then fades. */
  const ICONS = 'assets/images/icons/';
  const BURSTS = {
    heart: ['heart-1', 'heart-2', 'heart-3'],
    star: ['star-1', 'star-2', 'star-3'],
    plus: ['plus-1', 'plus-2', 'plus-3'],
  };
  const GRAVITY = 2100, MAX_ITEMS = 90;
  const worlds = new Map();

  function physics(w, now) {
    const dt = Math.min(1 / 30, Math.max(0, (now - w.last) / 1000));
    w.last = now;
    const W = w.layer.clientWidth, H = w.layer.clientHeight, items = w.items;
    for (const p of items) {
      p.age += dt;
      p.vy += GRAVITY * dt;
      p.vx *= 1 - 0.3 * dt;                          // a little air drag
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.a += p.va * dt;
      if (p.y > H - p.r) {                           // the floor: bounce, then slide and roll to a stop
        p.y = H - p.r;
        if (p.vy > 0) p.vy = p.vy > 90 ? -p.vy * p.bounce : 0;
        p.vx *= 1 - Math.min(1, 7 * dt);
        p.va += (p.vx / p.r - p.va) * 0.3;
      }
      if (p.y < p.r) { p.y = p.r; if (p.vy < 0) p.vy *= -0.3; }
      if (p.x < p.r) { p.x = p.r; if (p.vx < 0) p.vx *= -0.45; }
      if (p.x > W - p.r) { p.x = W - p.r; if (p.vx > 0) p.vx *= -0.45; }
    }
    // they knock into each other and land on top of one another
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < items.length; i++) {
        const a = items[i];
        for (let j = i + 1; j < items.length; j++) {
          const b = items[j];
          const dx = b.x - a.x, dy = b.y - a.y, min = a.r + b.r, d2 = dx * dx + dy * dy;
          if (d2 >= min * min || d2 < 1e-6) continue;
          const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, push = (min - d) / 2;
          a.x -= nx * push; a.y -= ny * push;
          b.x += nx * push; b.y += ny * push;
          const closing = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (closing < 0) {
            const k = -1.2 * closing / 2;
            a.vx -= k * nx; a.vy -= k * ny;
            b.vx += k * nx; b.vy += k * ny;
            a.va *= 0.9; b.va *= 0.9;
          }
        }
      }
    }
    for (let i = items.length - 1; i >= 0; i--) {
      const p = items[i];
      const grow = Math.min(1, p.age / 0.22);         // wells up out of the icon
      const s = 0.25 + 0.75 * (1 - (1 - grow) ** 3);
      const fade = p.age > p.life ? 1 - (p.age - p.life) / 0.8 : 1;
      if (fade <= 0) { p.el.remove(); items.splice(i, 1); continue; }
      p.el.style.opacity = fade;
      p.el.style.transform = `translate3d(${p.x - p.size / 2}px, ${p.y - p.size / 2}px, 0) rotate(${p.a}rad) scale(${s})`;
    }
    w.raf = items.length ? requestAnimationFrame((t) => physics(w, t)) : 0;
  }

  function pour(layer, icon, files) {
    let w = worlds.get(layer);
    if (!w) { w = { layer, items: [], raf: 0, last: 0 }; worlds.set(layer, w); }
    const box = layer.getBoundingClientRect(), r = icon.getBoundingClientRect();
    const size = 24 + Math.random() * 20;
    const el = new Image();
    el.className = 'burst__p';
    el.alt = '';
    el.draggable = false;
    el.src = `${ICONS}${files[Math.random() * files.length | 0]}.png`;
    el.style.width = `${size}px`;
    layer.appendChild(el);
    w.items.push({
      el, size, r: size * 0.4,
      x: r.left + r.width / 2 - box.left + (Math.random() - 0.5) * 8,
      y: r.top + r.height / 2 - box.top,
      vx: -190 + Math.random() * 250,               // spills over, mostly into the card
      vy: -330 + Math.random() * 230,               // a soft upward welling, not a launch
      a: (Math.random() - 0.5) * 0.8,
      va: (Math.random() - 0.5) * 7,
      bounce: 0.28 + Math.random() * 0.22,
      age: 0,
      life: 3 + Math.random() * 1.6,
    });
    // too many on screen: the oldest start fading
    const alive = w.items.filter((p) => p.age <= p.life);
    for (let i = 0; i < alive.length - MAX_ITEMS; i++) alive[i].life = alive[i].age;
    if (!w.raf) { w.last = performance.now(); w.raf = requestAnimationFrame((t) => physics(w, t)); }
  }

  const reactIcons = document.querySelectorAll('.react__icon');
  if (reactIcons.length) {                           // load the particles before the first hover
    Object.values(BURSTS).flat().forEach((n) => { new Image().src = `${ICONS}${n}.png`; });
  }
  reactIcons.forEach((icon) => {
    const layer = icon.closest('.card').querySelector('.burst');
    const files = BURSTS[icon.dataset.burst] || BURSTS.plus;
    let timer = 0;
    const flow = () => { pour(layer, icon, files); if (Math.random() < 0.5) pour(layer, icon, files); };
    const start = () => {
      if (reduceMotion || timer || !layer) return;
      icon.classList.add('is-bursting');
      flow();
      timer = setInterval(flow, 55);                // keeps welling up while the mouse stays
    };
    const stop = () => { clearInterval(timer); timer = 0; icon.classList.remove('is-bursting'); };
    icon.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') start(); });
    icon.addEventListener('pointerleave', stop);
    // touch screens have no hover: a tap pours out a handful (and doesn't follow the card's link)
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (reduceMotion || !layer) return;
      for (let i = 0; i < 14; i++) setTimeout(() => pour(layer, icon, files), i * 45);
    });
  });

  /* ---------- UX/UI page: the tab of the project on screen hangs a little lower ---------- */
  const projTabs = [...document.querySelectorAll('.proj-tab')];
  if (projTabs.length) {
    const tabFor = new Map(projTabs.map((t) => [t.getAttribute('href').slice(1), t]));
    const tabIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        projTabs.forEach((t) => t.classList.toggle('is-current', t === tabFor.get(e.target.id)));
      }
    }, { rootMargin: '-45% 0px -50% 0px' });         // a thin band across the middle of the screen
    tabFor.forEach((_, id) => { const sec = document.getElementById(id); if (sec) tabIO.observe(sec); });
  }

  /* ---------- About: optional portrait ---------- */
  document.querySelectorAll('img[data-optional]').forEach((img) => {
    const drop = () => img.remove();
    if (img.complete && !img.naturalWidth) drop();
    else img.addEventListener('error', drop, { once: true });
  });
})();
