/**
 * Cyberpunk Instagram-style feed + stories + prepared Q&A (no backend).
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const QA = [
  {
    q: 'Tu fais quoi exactement ?',
    a: 'Graphisme, modélisation 3D et impression 3D — du concept à la pièce. Je construis aussi des expériences web créatives.',
  },
  {
    q: 'Impression 3D : pour qui ?',
    a: 'Prototypes, cosplay, pièces mécaniques, objets déco… Dès qu’une idée doit devenir tangible.',
  },
  {
    q: 'Tu es basé où ?',
    a: 'Marseille. Dispo pour collabs à distance ou en local selon le projet.',
  },
  {
    q: 'Comment te contacter ?',
    a: 'Email : quentindacostaso@gmail.com — ou téléphone 07 86 73 77 92. Liens aussi sur l’accueil.',
  },
  {
    q: 'C’est quoi Luminart ?',
    a: '[Placeholder] Compte / lab créatif lié à mes projets visuels — à préciser avec le vrai pitch.',
  },
  {
    q: 'Tu cherches quoi en ce moment ?',
    a: 'Multiplier les expériences en impression 3D, design et jeu vidéo (formation testeur), vers une activité autonome.',
  },
];

const STORIES = [
  {
    label: 'Moi',
    slides: [
      { type: 'text', title: 'QDCS ONLINE', body: 'Session cyber · portfolio vivant' },
      { type: 'text', title: 'FOCUS', body: '3D · print · graphisme' },
    ],
  },
  {
    label: 'Print',
    slides: [
      { type: 'text', title: 'FILAMENT', body: '[Placeholder] Shot d’une pièce fraîchement imprimée' },
      { type: 'text', title: 'MATIÈRE', body: 'PLA · PETG · recyclé — selon le brief' },
    ],
  },
  {
    label: 'Q&A',
    slides: [
      { type: 'text', title: 'ASK', body: 'Descends dans le feed et choisis une question' },
      { type: 'text', title: 'NO BACKEND', body: 'Réponses pré-écrites · 100% front' },
    ],
  },
  {
    label: 'Night',
    slides: [
      { type: 'text', title: '23:59', body: 'L’atelier ne dort jamais — presque.' },
    ],
  },
];

/* ---------- Q&A UI ---------- */
const list = document.getElementById('qa-list');
const answerBox = document.getElementById('qa-answer');
const answerQ = document.getElementById('qa-answer-q');
const answerA = document.getElementById('qa-answer-a');
const backBtn = document.getElementById('qa-back');

function showAnswer(item) {
  if (!answerBox) return;
  list?.setAttribute('hidden', '');
  answerBox.hidden = false;
  answerQ.textContent = item.q;
  answerA.textContent = item.a;
  answerBox.classList.remove('is-in');
  void answerBox.offsetWidth;
  answerBox.classList.add('is-in');
}

function showList() {
  answerBox.hidden = true;
  list?.removeAttribute('hidden');
}

if (list) {
  QA.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'qa-item';
    btn.setAttribute('role', 'listitem');
    btn.innerHTML = `<span class="qa-item__idx">${String(i + 1).padStart(2, '0')}</span><span class="qa-item__q">${item.q}</span>`;
    btn.addEventListener('click', () => showAnswer(item));
    list.appendChild(btn);
  });
}
backBtn?.addEventListener('click', showList);

/* ---------- Stories viewer ---------- */
const viewer = document.getElementById('story-viewer');
const body = document.getElementById('story-body');
const bars = document.getElementById('story-bars');
const closeBtn = document.getElementById('story-close');
const prevHit = document.getElementById('story-prev');
const nextHit = document.getElementById('story-next');
const rings = [...document.querySelectorAll('.story-ring')];

let storyIndex = 0;
let slideIndex = 0;
let timer = null;
const SLIDE_MS = 4200;

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function paintBars() {
  if (!bars) return;
  const slides = STORIES[storyIndex].slides;
  bars.innerHTML = slides
    .map((_, i) => `<span class="story-bar${i < slideIndex ? ' is-done' : ''}${i === slideIndex ? ' is-run' : ''}"></span>`)
    .join('');
}

function paintSlide() {
  const slide = STORIES[storyIndex].slides[slideIndex];
  if (!body || !slide) return;
  body.innerHTML = `
    <p class="story-slide__eyebrow">${STORIES[storyIndex].label}</p>
    <h2 class="story-slide__title">${slide.title}</h2>
    <p class="story-slide__body">${slide.body}</p>
  `;
  paintBars();
  clearTimer();
  timer = setTimeout(() => nextSlide(), SLIDE_MS);
}

function openStory(i) {
  storyIndex = i;
  slideIndex = 0;
  rings.forEach((r, idx) => {
    r.classList.toggle('is-active', idx === i);
    r.setAttribute('aria-pressed', String(idx === i));
  });
  viewer.hidden = false;
  document.body.classList.add('story-open');
  paintSlide();
}

function closeStory() {
  clearTimer();
  viewer.hidden = true;
  document.body.classList.remove('story-open');
}

function nextSlide() {
  const slides = STORIES[storyIndex].slides;
  if (slideIndex < slides.length - 1) {
    slideIndex += 1;
    paintSlide();
  } else if (storyIndex < STORIES.length - 1) {
    openStory(storyIndex + 1);
  } else {
    closeStory();
  }
}

function prevSlide() {
  if (slideIndex > 0) {
    slideIndex -= 1;
    paintSlide();
  } else if (storyIndex > 0) {
    storyIndex -= 1;
    slideIndex = STORIES[storyIndex].slides.length - 1;
    paintSlide();
  }
}

rings.forEach((ring) => {
  ring.addEventListener('click', () => openStory(Number(ring.dataset.story)));
});
closeBtn?.addEventListener('click', closeStory);
nextHit?.addEventListener('click', nextSlide);
prevHit?.addEventListener('click', prevSlide);
window.addEventListener('keydown', (e) => {
  if (viewer?.hidden) return;
  if (e.key === 'Escape') closeStory();
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

/* ---------- Neon particle backdrop ---------- */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 50);
  camera.position.z = 6;

  const count = 600;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.035,
    color: 0xff2bd6,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const grid = new THREE.GridHelper(20, 20, 0x00f0ff, 0x1a0033);
  grid.position.y = -3.2;
  grid.material.opacity = 0.35;
  grid.material.transparent = true;
  scene.add(grid);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let t0 = performance.now();
  function tick(now) {
    requestAnimationFrame(tick);
    const t = (now - t0) / 1000;
    if (!reduced) {
      points.rotation.y = t * 0.05;
      points.rotation.x = Math.sin(t * 0.2) * 0.08;
      grid.position.z = (t * 0.6) % 2;
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
}

initCyberCanvas();
