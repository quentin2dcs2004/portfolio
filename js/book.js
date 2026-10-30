/**
 * Interactive project book — CSS 3D page spreads + keyboard / click nav.
 */
const spreads = [...document.querySelectorAll('.book__spread')];
const counter = document.getElementById('book-counter');
const bar = document.getElementById('book-progress-bar');
const prevBtn = document.getElementById('book-prev');
const nextBtn = document.getElementById('book-next');
const book = document.getElementById('book');

if (!spreads.length || !book) {
  // not on book page
} else {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let flipping = false;

  function render() {
    spreads.forEach((s, i) => {
      s.classList.toggle('is-active', i === index);
      s.classList.toggle('is-behind', i < index);
      s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    if (counter) counter.textContent = `${index + 1} / ${spreads.length}`;
    if (bar) bar.style.width = `${((index + 1) / spreads.length) * 100}%`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === spreads.length - 1;
  }

  function go(delta) {
    const next = index + delta;
    if (flipping || next < 0 || next >= spreads.length) return;
    if (REDUCED) {
      index = next;
      render();
      return;
    }
    flipping = true;
    book.classList.remove('flip-forward', 'flip-back');
    // force reflow
    void book.offsetWidth;
    book.classList.add(delta > 0 ? 'flip-forward' : 'flip-back');
    const current = spreads[index];
    current?.classList.add(delta > 0 ? 'is-exiting-left' : 'is-exiting-right');
    window.setTimeout(() => {
      current?.classList.remove('is-exiting-left', 'is-exiting-right');
      index = next;
      render();
      flipping = false;
    }, 520);
  }

  prevBtn?.addEventListener('click', () => go(-1));
  nextBtn?.addEventListener('click', () => go(1));

  book.addEventListener('click', (e) => {
    const rect = book.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.55) go(1);
    else if (x < rect.width * 0.45) go(-1);
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

  let touchX = null;
  book.addEventListener('touchstart', (e) => {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  book.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });

  render();
}
