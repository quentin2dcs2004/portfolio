/**
 * Enchanted project book — ONE physical sheet turns at a time (real-book flip).
 * JS drives rotateY so the half-turn backface swap stays reliable.
 */
const book = document.getElementById('book');
const sheets = [...document.querySelectorAll('.sheet')];
const counter = document.getElementById('book-counter');
const bar = document.getElementById('book-progress-bar');
const prevBtn = document.getElementById('book-prev');
const nextBtn = document.getElementById('book-next');
const shell = document.getElementById('book-shell');
const fxCanvas = document.getElementById('book-fx');

if (book && sheets.length) {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FLIP_MS = REDUCED ? 0 : 1000;
  const LAST = sheets.length - 1;
  let open = 0;
  let busy = false;
  let drag = null;
  let raf = 0;

  // Smoothstep — page lifts early enough to read as a real turn
  const easePage = (t) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
  };

  /* ---------- Enchant particles ---------- */
  const fx = (() => {
    if (!fxCanvas) return { burst() {}, spark() {} };
    const ctx = fxCanvas.getContext('2d');
    const particles = [];
    const glyphs = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᛉ', 'ᛈ'];

    const resize = () => {
      const host = shell || book;
      const r = host.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      fxCanvas.width = Math.max(1, Math.floor(r.width * dpr));
      fxCanvas.height = Math.max(1, Math.floor(r.height * dpr));
      fxCanvas.style.width = `${r.width}px`;
      fxCanvas.style.height = `${r.height}px`;
      fxCanvas._dpr = dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = (x, y, n, tone = 'violet') => {
      const dpr = fxCanvas._dpr || 1;
      const color = tone === 'blue' ? [47, 107, 255] : [155, 92, 255];
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.5 + Math.random() * 2.8;
        particles.push({
          x: x * dpr,
          y: y * dpr,
          vx: Math.cos(a) * sp * dpr,
          vy: (Math.sin(a) * sp - 0.6) * dpr,
          life: 1,
          decay: 0.009 + Math.random() * 0.018,
          size: (1.1 + Math.random() * 2.5) * dpr,
          color,
          rune: Math.random() > 0.8,
        });
      }
    };

    const burst = (side = 'right') => {
      if (REDUCED) return;
      const w = fxCanvas.clientWidth;
      const h = fxCanvas.clientHeight;
      const x = side === 'right' ? w * 0.76 : w * 0.24;
      spawn(x, h * 0.4, 36, side === 'right' ? 'blue' : 'violet');
      spawn(w * 0.5, h * 0.46, 20, side === 'right' ? 'violet' : 'blue');
    };

    const spark = (clientX, clientY) => {
      if (REDUCED || !shell) return;
      const r = shell.getBoundingClientRect();
      spawn(clientX - r.left, clientY - r.top, 14, Math.random() > 0.5 ? 'violet' : 'blue');
    };

    const tick = () => {
      ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.018 * (fxCanvas._dpr || 1);
        ctx.globalCompositeOperation = 'lighter';
        const a = Math.max(0, p.life);
        if (p.rune) {
          ctx.font = `${p.size * 3.2}px serif`;
          ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${a * 0.9})`;
          ctx.fillText(glyphs[i % glyphs.length], p.x, p.y);
        } else {
          ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${a})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    if (!REDUCED) {
      setInterval(() => {
        if (document.hidden) return;
        const w = fxCanvas.clientWidth;
        const h = fxCanvas.clientHeight;
        spawn(w * (0.2 + Math.random() * 0.6), h * (0.15 + Math.random() * 0.65), 2);
      }, 400);
    }

    return { burst, spark };
  })();

  function stackOffset(i, flipped) {
    const n = i;
    if (!flipped) return `rotateY(0deg) translate3d(${n * 2}px, ${n}px, ${-n * 2}px)`;
    return `rotateY(-180deg) translate3d(${-n * 2}px, ${n}px, ${-n * 2}px)`;
  }

  function applyStaticState() {
    cancelAnimationFrame(raf);
    sheets.forEach((sheet, i) => {
      const flipped = i < open;
      sheet.classList.remove('is-turning', 'is-peeling', 'is-past-half');
      sheet.classList.toggle('is-flipped', flipped);
      const rightTop = open <= LAST ? i === open : i === LAST;
      const leftTop = open > 0 && i === Math.min(open, LAST + 1) - 1;
      sheet.classList.toggle('is-top', rightTop || leftTop);
      sheet.style.transition = 'none';
      sheet.style.transform = stackOffset(i, flipped);
    });
    book.dataset.open = String(open);
    book.classList.toggle('is-open', open > 0);
    book.classList.remove('is-turning-forward', 'is-turning-back', 'is-dragging');

    if (counter) {
      if (open === 0) counter.textContent = `Couverture · 0 / ${LAST}`;
      else if (open > LAST) counter.textContent = `Fin · ${LAST} / ${LAST}`;
      else counter.textContent = `Page ${open} / ${LAST}`;
    }
    if (bar) bar.style.width = `${(Math.min(open, LAST) / LAST) * 100}%`;
    if (prevBtn) prevBtn.disabled = open === 0;
    if (nextBtn) nextBtn.disabled = open > LAST;
  }

  function pulse(dir) {
    shell?.classList.remove('is-pulse-next', 'is-pulse-prev');
    void shell?.offsetWidth;
    shell?.classList.add(dir > 0 ? 'is-pulse-next' : 'is-pulse-prev');
  }

  function animateSheet(sheet, fromDeg, toDeg, duration, onDone) {
    const start = performance.now();
    sheet.classList.add('is-turning');
    sheet.style.transition = 'none';

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const p = easePage(t);
      const deg = fromDeg + (toDeg - fromDeg) * p;
      sheet.style.transform = `rotateY(${deg}deg)`;
      sheet.classList.toggle('is-past-half', Math.abs(deg) >= 90);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        sheet.classList.remove('is-turning', 'is-past-half');
        onDone?.();
      }
    };
    raf = requestAnimationFrame(step);
  }

  /** Flip exactly ONE sheet forward/back — never the whole stack. */
  function go(delta) {
    const target = open + delta;
    if (busy) return;
    if (target < 0 || target > LAST + 1) {
      shell?.classList.add('is-shake');
      window.setTimeout(() => shell?.classList.remove('is-shake'), 380);
      return;
    }

    if (REDUCED || FLIP_MS === 0) {
      open = target;
      applyStaticState();
      return;
    }

    const sheetIndex = delta > 0 ? open : open - 1;
    const sheet = sheets[sheetIndex];
    if (!sheet) return;

    busy = true;
    pulse(delta);
    fx.burst(delta > 0 ? 'right' : 'left');
    book.classList.add(delta > 0 ? 'is-turning-forward' : 'is-turning-back');

    // Freeze every other sheet where it is
    sheets.forEach((s, i) => {
      if (s === sheet) return;
      s.style.transition = 'none';
      s.style.transform = stackOffset(i, i < open);
      s.classList.remove('is-turning', 'is-peeling', 'is-past-half');
    });

    const from = delta > 0 ? 0 : -180;
    const to = delta > 0 ? -180 : 0;

    animateSheet(sheet, from, to, FLIP_MS, () => {
      open = target;
      applyStaticState();
      busy = false;
      fx.burst(delta > 0 ? 'left' : 'right');
    });
  }

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fx.spark(e.clientX, e.clientY);
    go(-1);
  });
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fx.spark(e.clientX, e.clientY);
    go(1);
  });

  book.addEventListener('click', (e) => {
    if (busy || drag?.moved) return;
    if (e.target.closest('a, button')) return;
    const rect = book.getBoundingClientRect();
    const x = e.clientX - rect.left;
    fx.spark(e.clientX, e.clientY);
    if (x >= rect.width * 0.5) go(1);
    else go(-1);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      go(-1);
    }
  });

  const activeSheetForDrag = (dx) => {
    if (dx < 0 && open <= LAST) return { sheet: sheets[open], forward: true };
    if (dx > 0 && open > 0) return { sheet: sheets[open - 1], forward: false };
    return null;
  };

  const onDown = (e) => {
    if (busy) return;
    if (e.target.closest('a, button')) return;
    const rect = book.getBoundingClientRect();
    drag = { x0: e.clientX, w: rect.width, moved: false, sheet: null, forward: true };
    try { book.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  };

  const onMove = (e) => {
    if (!drag || busy) return;
    const dx = e.clientX - drag.x0;
    if (!drag.moved && Math.abs(dx) > 8) {
      drag.moved = true;
      book.classList.add('is-dragging');
      const hit = activeSheetForDrag(dx);
      if (hit) {
        drag.sheet = hit.sheet;
        drag.forward = hit.forward;
        drag.sheet.classList.add('is-peeling', 'is-turning');
        drag.sheet.style.transition = 'none';
      }
    }
    if (!drag.moved || !drag.sheet) return;

    const amount = Math.min(1, Math.abs(dx) / (drag.w * 0.42));
    const deg = drag.forward ? amount * -180 : -180 + amount * 180;
    drag.sheet.style.transform = `rotateY(${deg}deg)`;
    drag.sheet.classList.toggle('is-past-half', Math.abs(deg) >= 90);
  };

  const onUp = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0;
    const moved = drag.moved;
    const sheet = drag.sheet;
    drag = null;

    if (sheet) {
      sheet.classList.remove('is-peeling');
    }
    book.classList.remove('is-dragging');

    if (!moved) return;
    if (dx < -48) go(1);
    else if (dx > 48) go(-1);
    else {
      applyStaticState();
      fx.spark(e.clientX, e.clientY);
    }
  };

  book.addEventListener('pointerdown', onDown);
  book.addEventListener('pointermove', onMove);
  book.addEventListener('pointerup', onUp);
  book.addEventListener('pointercancel', onUp);

  requestAnimationFrame(() => {
    book.classList.add('is-ready');
    fx.burst('right');
  });

  applyStaticState();
}
