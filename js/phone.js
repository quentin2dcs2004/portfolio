/**
 * Phone stage — virtual projects + prepared DM Q&A (no backend).
 */

const PROJECTS = [
  {
    id: 'armure',
    tag: '3D · Cosplay',
    title: 'Pièce d’armure',
    meta: 'Impression PLA',
    tone: 'rgba(155, 92, 255, 0.55)',
    body: 'Prototype d’élément de cosplay : modélisation, supports, finition. [Placeholder — remplacer par le vrai brief et des photos.]',
  },
  {
    id: 'marque',
    tag: 'Graphisme',
    title: 'Identité visuelle',
    meta: 'Brand locale',
    tone: 'rgba(47, 107, 255, 0.55)',
    body: 'Recherche de signe, typographie et déclinaisons. [Placeholder]',
  },
  {
    id: 'mecanique',
    tag: 'CAO',
    title: 'Pièce mécanique',
    meta: 'Matières mixtes',
    tone: 'rgba(107, 140, 255, 0.5)',
    body: 'Conception d’une pièce fonctionnelle adaptée à l’usage. [Placeholder]',
  },
  {
    id: 'web',
    tag: 'UI · Motion',
    title: 'Expérience web',
    meta: 'Portfolio vivant',
    tone: 'rgba(155, 92, 255, 0.4)',
    body: 'Interface immersive pour présenter un univers créatif — ce site en est l’ébauche.',
  },
];

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
    a: 'Email : quentindacostaso@gmail.com — ou 07 86 73 77 92. Liens aussi sur l’accueil.',
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

const device = document.getElementById('device');
const projectsEl = document.getElementById('phone-projects');
const thread = document.getElementById('phone-thread');
const chips = document.getElementById('phone-chips');
const timeEl = document.getElementById('phone-time');
const tabs = [...document.querySelectorAll('.phone-dock__btn')];
const views = [...document.querySelectorAll('.phone-view')];

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let answering = false;

function clock() {
  if (!timeEl) return;
  const d = new Date();
  timeEl.textContent = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
clock();
setInterval(clock, 30000);

/* ---------- Tabs ---------- */
function showTab(name) {
  views.forEach((v) => {
    const on = v.dataset.view === name;
    v.hidden = !on;
    v.classList.toggle('is-active', on);
  });
  tabs.forEach((t) => {
    const on = t.dataset.tab === name;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
  });
}

tabs.forEach((btn) => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

/* ---------- Projects ---------- */
function openDetail(project) {
  let detail = document.getElementById('phone-detail');
  if (!detail) {
    detail = document.createElement('div');
    detail.id = 'phone-detail';
    detail.className = 'phone-detail';
    document.getElementById('view-projets')?.appendChild(detail);
  }
  detail.hidden = false;
  detail.innerHTML = `
    <button type="button" class="phone-detail__back" id="phone-detail-back">← Galerie</button>
    <p class="phone-card__tag">${project.tag}</p>
    <h3>${project.title}</h3>
    <p>${project.body}</p>
    <p class="phone-card__meta">${project.meta} · <span class="placeholder-tag">Placeholder</span></p>
  `;
  detail.querySelector('#phone-detail-back')?.addEventListener('click', () => {
    detail.hidden = true;
  });
}

function renderProjects() {
  if (!projectsEl) return;
  projectsEl.innerHTML = '';
  PROJECTS.forEach((p) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'phone-card';
    btn.innerHTML = `
      <span class="phone-card__glow" style="--tone:${p.tone}"></span>
      <span class="phone-card__body">
        <span class="phone-card__tag">${p.tag}</span>
        <span class="phone-card__title">${p.title}</span>
        <span class="phone-card__meta">${p.meta}</span>
      </span>
    `;
    btn.addEventListener('click', () => openDetail(p));
    projectsEl.appendChild(btn);
  });
}

/* ---------- DM / Q&A ---------- */
function stamp() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function appendBubble(html, kind) {
  if (!thread) return null;
  const el = document.createElement('div');
  el.className = `bubble bubble--${kind}`;
  el.innerHTML = html;
  thread.appendChild(el);
  thread.scrollTop = thread.scrollHeight;
  return el;
}

function setChipsEnabled(on) {
  chips?.querySelectorAll('.phone-chip').forEach((c) => {
    c.disabled = !on;
  });
}

async function ask(item) {
  if (answering) return;
  answering = true;
  setChipsEnabled(false);

  appendBubble(`<p>${item.q}</p><time>${stamp()}</time>`, 'out');

  const typing = appendBubble('<i></i><i></i><i></i>', 'in');
  typing?.classList.add('bubble--typing');

  const delay = REDUCED ? 0 : 700 + Math.min(1400, item.a.length * 12);
  await new Promise((r) => setTimeout(r, delay));
  typing?.remove();

  appendBubble(`<p>${item.a}</p><time>${stamp()}</time>`, 'in');
  answering = false;
  setChipsEnabled(true);
}

function renderChips() {
  if (!chips) return;
  chips.innerHTML = '';
  QA.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'phone-chip';
    btn.textContent = item.q;
    btn.addEventListener('click', () => ask(item));
    chips.appendChild(btn);
  });
}

/* Boot */
renderProjects();
renderChips();
requestAnimationFrame(() => device?.classList.add('is-ready'));

// Deep-link ?tab=mp
const params = new URLSearchParams(location.search);
if (params.get('tab') === 'mp' || params.get('tab') === 'profil') {
  showTab(params.get('tab'));
}
