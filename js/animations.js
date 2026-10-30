/**
 * Page motion: intro handoff, reveals, typing, nav, magnetic hover, transitions.
 */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* Page transition veil */
const transition = document.getElementById('page-transition');
requestAnimationFrame(() => {
  transition?.classList.add('is-ready');
  transition?.classList.remove('is-leaving');
});

document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
  if (link.target === '_blank') return;
  link.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!transition || REDUCED) return;
    e.preventDefault();
    transition.classList.add('is-leaving');
    setTimeout(() => {
      window.location.href = href;
    }, 420);
  });
});

/* Header scroll state */
const header = document.getElementById('site-header');
const onScrollHeader = () => {
  header?.classList.toggle('is-scrolled', (window.scrollY || 0) > 24);
};
window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

/* Mobile nav */
const toggle = document.getElementById('nav-toggle');
const nav = document.getElementById('site-nav');
toggle?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

/* Smooth section anchors */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href')?.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: REDUCED ? 'auto' : 'smooth' });
  });
});

/* Active nav on scroll */
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
if (sections.length && navLinks.length) {
  const spy = () => {
    const y = window.scrollY + 120;
    let current = sections[0]?.id;
    for (const s of sections) {
      if (s.offsetTop <= y) current = s.id;
    }
    navLinks.forEach((l) => {
      l.classList.toggle('is-active', l.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();
}

/* Scroll reveals */
function setupReveals() {
  const nodes = document.querySelectorAll('[data-reveal]');
  if (REDUCED) {
    nodes.forEach((n) => n.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
  );
  nodes.forEach((n, i) => {
    n.style.setProperty('--reveal-delay', `${Math.min(i % 6, 5) * 70}ms`);
    io.observe(n);
  });

  const kickHero = () => {
    document.querySelectorAll('.hero [data-reveal], .home [data-reveal], .about-hero [data-reveal]').forEach((n) => {
      n.classList.add('is-visible');
    });
  };

  /* Soft parallax on home portrait */
  const parallaxPhoto = document.querySelector('.home-img');
  if (parallaxPhoto && !REDUCED && !window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      parallaxPhoto.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }, { passive: true });
  }

  /* Bounce hover like classic portfolio socials */
  document.querySelectorAll('.hover-bounce').forEach((el) => {
    el.addEventListener('mouseenter', () => el.classList.add('is-bounce'));
    el.addEventListener('mouseleave', () => el.classList.remove('is-bounce'));
  });
  const hasIntro = document.getElementById('intro-container') || document.getElementById('intro');
  if (document.body.classList.contains('intro-complete') || !hasIntro) {
    kickHero();
  } else {
    window.addEventListener('portfolio:intro-done', kickHero, { once: true });
  }
}
setupReveals();

/* Netflix-style intro (letter Q) — cinematic handoff */
(() => {
  const root = document.getElementById('intro-container');
  if (!root) return;
  const skipBtn = document.getElementById('intro-skip');
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let done = false;

  const endIntro = () => {
    if (done) return;
    done = true;
    root.classList.add('is-done');
    document.body.classList.add('intro-complete');
    window.dispatchEvent(new CustomEvent('portfolio:intro-done'));
    window.setTimeout(() => root.remove(), 900);
  };

  skipBtn?.addEventListener('click', endIntro);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      endIntro();
    }
  }, { once: true });

  // Full Netflix timing ≈ 4s then fade
  window.setTimeout(endIntro, REDUCED_MOTION ? 400 : 4200);
})();

/* Typing roles */
const roles = [
  'développeur web',
  'graphiste',
  'web designer',
  'modélisateur 3D',
  'imprimeur 3D',
];
const typingEl = document.getElementById('typing-effect');
async function runTyping() {
  if (!typingEl) return;
  if (REDUCED) {
    typingEl.textContent = roles[0];
    return;
  }
  let idx = 0;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const word = roles[idx % roles.length];
    typingEl.textContent = '';
    for (let i = 0; i < word.length; i++) {
      typingEl.textContent += word[i];
      await wait(55);
    }
    await wait(1600);
    while (typingEl.textContent.length) {
      typingEl.textContent = typingEl.textContent.slice(0, -1);
      await wait(28);
    }
    await wait(350);
    idx += 1;
  }
}
runTyping();

/* Magnetic buttons / brand */
if (!REDUCED && !window.matchMedia('(pointer: coarse)').matches) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });

  /* Soft cursor wash */
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.prepend(glow);
  let gx = 0;
  let gy = 0;
  let tx = 0;
  let ty = 0;
  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    glow.classList.add('is-on');
  }, { passive: true });
  window.addEventListener('pointerleave', () => glow.classList.remove('is-on'));
  const follow = () => {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.left = `${gx}px`;
    glow.style.top = `${gy}px`;
    requestAnimationFrame(follow);
  };
  requestAnimationFrame(follow);
}

/* Title underline draw when in view */
(() => {
  const titles = [...document.querySelectorAll(
    '.section__title, .book-stage__title, .phone-stage__title, .about-hero__title'
  )];
  if (!titles.length) return;
  if (REDUCED) {
    titles.forEach((t) => t.classList.add('is-drawn'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-drawn');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  titles.forEach((t) => io.observe(t));
})();

/* Skill item hover tilt */
document.querySelectorAll('.skill-item').forEach((item) => {
  item.addEventListener('pointermove', (e) => {
    if (REDUCED) return;
    const r = item.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    item.style.setProperty('--tilt-x', `${py * -6}deg`);
    item.style.setProperty('--tilt-y', `${px * 8}deg`);
  });
  item.addEventListener('pointerleave', () => {
    item.style.setProperty('--tilt-x', '0deg');
    item.style.setProperty('--tilt-y', '0deg');
  });
});
